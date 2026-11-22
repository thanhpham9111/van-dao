'use strict';
/* ============================================================================
   M1 (GÓI 05 — T73+T22) — Chiều sâu 2.5D + ánh sáng ngày–đêm cho thôn tân thủ
   Gắn vào townDrawWorld() của src/65 bằng PATCH (ops/patches/MUSE_05_M1.json).
   Khi TOWN_NEW=false (hoặc thiếu layout / không ở thôn) thì không làm gì.

   3 MỨC theo v41Quality() (src/31:5 — V41E.quality 0/1/2):
     0 thấp  = chỉ lớp màu phủ (multiply + screen).
     1 vừa   = thêm parallax (xa/giữa/tiền cảnh) + bóng đổ.
     2 cao   = đủ cả: + lớp tối có đục lỗ + quầng sáng thật + sương + bụi vàng.

   QUY ƯỚC VẼ (theo lighting.md §2.1): chỉ scene (nền/nhà/cây/người) nhận
   multiply/screen; HUD/minimap/nhãn/tooltip/thoại/modal/menu KHÔNG phủ màu.
   Vì vậy mọi lớp của module này đều vẽ TRONG townDrawWorld() (trước khi
   v47tDraw vẽ thanh tiêu đề + prompt E), KHÔNG dùng FRAME_HOOKS.overlay.
   Tiền cảnh né 3 vùng HUD Titan Quest (src/69: hudTQZoneHit): chân dung
   trái trên [0,0,312,100], bản đồ tròn phải trên [1100,0,180,232],
   khối đáy [214,642,852,78]; con trỏ vẽ ở overlay nên luôn nằm trên.

   GIỜ: giờ = (p.worldTime%360)/15 (như hdSun src/04, lịch NPC src/05);
   1 ngày = 360 đơn vị = 24 giờ, 1 giờ game = 15 đơn vị, 1 phút = 0,25.

   HỌA TIẾT GIỮ CHỖ — VẼ TAY BẰNG CODE (không khối phẳng như GÓI 04):
   núi 3 lớp đường cong mềm + chi tiết rặng + tuyết đỉnh + sương khí quyển
   nhạt dần theo xa; dải rừng xa có khối tán biến thiên; cành tiền cảnh có
   cụm lá + gân lá; nhà có hàng ngói vảy + vân gỗ + cửa sổ sáng theo giờ;
   đá lát có mạch; nước có gợn sáng. Mọi họa tiết tĩnh cache ra canvas phụ
   MỘT LẦN (núi/rừng/tiền cảnh/bóng tĩnh/lớp tối), không vẽ lại mỗi khung.
   Ảnh thật (nếu có) thay giữ chỗ: ASSETS["map_bg_far"], ["map_bg_mid"],
   ["fg_branch_1"], ["fg_bamboo_1"], ["fg_eave_1"], ["light_glow"].

   SAVE: không có trường save mới.
   ========================================================================== */
const DEPTH_LIGHT = true;

/* ---- trạng thái module ---- */
var depthLightWarned = false;
var dlCache = {far:null, mid:null, fgTop:null, fgLeft:null, fgRight:null,
  shadow:null, shadowKey:'', shadowAnchor:{x:0,y:0},
  dark:null, darkKey:'', gradeM:null, gradeS:null, gradeKey:'',
  glow:{}, img:{}};
var dlStats = {frames:0, graded:0, gradeRebuilds:0, parallaxDraws:0, shadowDraws:0, shadowRebuilds:0,
  darkDraws:0, darkRebuilds:0, glowsDrawn:0, dustDrawn:0, fgDraws:0, detailCalls:0};

/* ---- bảng mốc giờ (lighting.md §2.2 — ĐÚNG mã màu, 360 trùng 0) ---- */
var DL_STOPS = [
  {t:0,   M:[0x58,0x61,0x7A], aM:0.58, S:[0x85,0x92,0xAB], aS:0.035, L:1.00, K:0.60},
  {t:60,  M:[0x69,0x73,0x86], aM:0.48, S:[0x89,0x9C,0xB0], aS:0.045, L:0.90, K:0.65},
  {t:90,  M:[0xC9,0xAD,0x92], aM:0.30, S:[0xF1,0xC9,0x9E], aS:0.075, L:0.30, K:0.85},
  {t:120, M:[0xEE,0xE3,0xCA], aM:0.15, S:[0xF3,0xDE,0xB4], aS:0.035, L:0.00, K:1.00},
  {t:180, M:[0xF0,0xE8,0xD6], aM:0.12, S:[0xF5,0xE6,0xCA], aS:0.025, L:0.00, K:1.00},
  {t:240, M:[0xE3,0xCE,0xB1], aM:0.19, S:[0xF1,0xCD,0x9C], aS:0.055, L:0.00, K:0.95},
  {t:270, M:[0xAF,0x87,0x79], aM:0.38, S:[0xE9,0xB1,0x88], aS:0.075, L:0.55, K:0.78},
  {t:300, M:[0x69,0x73,0x84], aM:0.52, S:[0x87,0x95,0xAC], aS:0.045, L:0.95, K:0.65},
  {t:360, M:[0x58,0x61,0x7A], aM:0.58, S:[0x85,0x92,0xAB], aS:0.035, L:1.00, K:0.60}
];
/* Profile vùng thôn (lighting.md §2.3): nhuộm thêm rất nhẹ trên bảng giờ. */
var DL_REGION = {Mv:[0xE8,0xD5,0xB6], aV:0.10, F:'#EEE0C9', aF:0.11,
  P:'#E9CFA3', dust:18, local:'#FFD298'};
/* 3 vùng HUD Titan Quest (src/69) — dùng khi hudTQZoneHit chưa nạp. */
var DL_HUD_ZONES = [[0,0,312,100],[1100,0,180,232],[214,642,852,78]];

/* ---- tiện ích (xác định, không random theo frame) ---- */
function dlClamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function dlHash(s){ let h=0; s=String(s); for(let i=0;i<s.length;i++) h=(Math.imul(h,31)+s.charCodeAt(i))|0; return (h>>>0)/4294967296; }
function dlSeedRand(seed){ let s=(seed>>>0)||1; return function(){ s=(Math.imul(s,1664525)+1013904223)>>>0; return s/4294967296; }; }
function dlHexA(hex,a){ const n=parseInt(hex.slice(1),16);
  return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'; }
function dlClock(){ if(typeof V47T!=='undefined'&&V47T&&Number.isFinite(V47T.clock)) return V47T.clock;
  if(typeof elapsed==='number') return elapsed; return 0; }

/* ---- điều kiện chạy / chất lượng / giờ ---- */
function depthLightActive(){
  if(typeof TOWN_NEW==='undefined'||!TOWN_NEW) return false;
  if(typeof townMapReady!=='function'||!townMapReady()) return false;
  if(typeof v47tIsActive==='function'&&!v47tIsActive()) return false;
  if(typeof p==='undefined'||!p) return false;
  return true;
}
function depthLightQuality(){
  if(typeof v41Quality==='function'){ try{ return dlClamp(Math.round(v41Quality()),0,2); }catch(_){} }
  return 1;
}
function depthLightHour(){ return ((((p&&p.worldTime)||0)%360)+360)%360/15; }
function depthLightTime(){ return ((((p&&p.worldTime)||0)%360)+360)%360; }
/* Nội suy tuyến tính giữa 2 mốc liền kề (cùng cặp mốc cho mọi kênh). */
function depthLightGrade(t){
  t=((t%360)+360)%360;
  let i=0;
  for(let k=0;k<DL_STOPS.length-1;k++){ if(t>=DL_STOPS[k].t&&t<DL_STOPS[k+1].t){ i=k; break; } }
  const a=DL_STOPS[i], b=DL_STOPS[i+1], f=(t-a.t)/Math.max(1,b.t-a.t);
  const mix=function(u,v){ return u+(v-u)*f; };
  return {t:t, hour:t/15,
    M:[mix(a.M[0],b.M[0]),mix(a.M[1],b.M[1]),mix(a.M[2],b.M[2])], aM:mix(a.aM,b.aM),
    S:[mix(a.S[0],b.S[0]),mix(a.S[1],b.S[1]),mix(a.S[2],b.S[2])], aS:mix(a.aS,b.aS),
    L:mix(a.L,b.L), K:mix(a.K,b.K)};
}
/* Grade cache theo phút game (0,25 đơn vị): detail/bóng/lớp trước dùng chung,
   tránh tính lại nội suy cho từng vật thể mỗi khung. */
var dlGradeCache={key:-1,gr:null};
function depthLightGradeCached(){
  const t=depthLightTime(), key=Math.floor(t*4);
  if(dlGradeCache.key!==key||!dlGradeCache.gr){ dlGradeCache.key=key; dlGradeCache.gr=depthLightGrade(t); }
  return dlGradeCache.gr;
}
/* Hệ số multiply gộp giờ+vùng, kẹp [0.55,1] (lighting.md §2.4).
   Kiểm chứng: thôn 12:00 ≈ (0.984,0.973,0.953); 00:00 ≈ (0.615,0.630,0.678). */
function depthLightFactors(gr){
  const out={r:0,g:0,b:0};
  const ch=['r','g','b'];
  for(let i=0;i<3;i++){
    const f1=1-gr.aM+gr.aM*gr.M[i]/255, f2=1-DL_REGION.aV+DL_REGION.aV*DL_REGION.Mv[i]/255;
    out[ch[i]]=Math.round(dlClamp(f1*f2,0.55,1)*255);
  }
  return out;
}
/* Sương sớm 5h–8h: đỉnh 6h30, alpha tối đa = aF vùng (0.11). */
function depthLightFogAlpha(hour){
  if(hour<5||hour>8) return 0;
  return dlClamp(1-Math.abs(hour-6.5)/1.5,0,1)*DL_REGION.aF;
}
/* Hướng/độ dài bóng theo giờ: sáng dài về tây (-x), trưa ngắn, chiều dài
   về đông (+x); đêm len=0 (chỉ còn bóng tiếp đất quanh nguồn sáng).
   dx,dy = độ lệch (đơn vị: chiều cao vật); len = độ dài tương đối. */
function depthLightShadowVec(hour){
  hour=((hour%24)+24)%24;
  if(hour>=19||hour<5) return {dx:0,dy:0,len:0,night:true};
  const f=(hour-6)/12, elev=Math.sin(Math.PI*f);
  const len=0.15+1.35*(1-elev), dirx=(hour-12)/6;
  return {dx:dirx*len, dy:0.35*len, len:len, night:false};
}

/* ---- ảnh (cache một lần, cùng quy ước khóa phẳng như src/65) ---- */
function depthLightImg(asset){
  if(typeof ASSETS==='undefined'||!ASSETS) return null;
  if(dlCache.img[asset]!==undefined) return dlCache.img[asset];
  const src=ASSETS[asset];
  if(!src){ dlCache.img[asset]=null; return null; }
  if(typeof src==='object'&&src.img){ dlCache.img[asset]={img:src.img,ready:!!src.ready}; return dlCache.img[asset]; }
  if(typeof src!=='string'){ dlCache.img[asset]=null; return null; }
  const entry={img:null,ready:false};
  try{ const im=new Image(); entry.img=im;
    im.onload=function(){ entry.ready=true; }; im.src=src;
  }catch(err){ dlCache.img[asset]=null; return null; }
  dlCache.img[asset]=entry;
  return entry;
}
function dlCanvas(w,h){
  const cv=document.createElement('canvas'); cv.width=w; cv.height=h; return cv;
}
/* Quầng sáng tròn mềm cache theo màu (falloff §3: 0%→1, 25%→.72, 60%→.25). */
function dlGlowSprite(color){
  if(dlCache.glow[color]) return dlCache.glow[color];
  const cv=dlCanvas(128,128), d=cv.getContext('2d');
  const gr=d.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,dlHexA(color,1)); gr.addColorStop(0.25,dlHexA(color,0.72));
  gr.addColorStop(0.6,dlHexA(color,0.25)); gr.addColorStop(1,dlHexA(color,0));
  d.fillStyle=gr; d.fillRect(0,0,128,128);
  dlCache.glow[color]=cv; return cv;
}

/* ---- nguồn sáng thật (đọc từ layout + đom đóm của 67) ---- */
function depthLightSources(){
  const L=(typeof townLayout==='function')?townLayout():((typeof DATA!=='undefined'&&DATA)?DATA.town_layout:null);
  if(!L) return [];
  const out=[];
  for(const o of L.objects){
    if(!o) continue;
    if((o.id&&o.id.indexOf('p_lantern_')===0)||(o.asset||'').indexOf('p_lantern')===0||(o.fallback||'').indexOf('p_lantern')===0) // [Claude ghép] bố cục bản 3 đặt id đèn khác
      out.push({id:o.id,type:'lantern',x:o.x,y:o.y-80,r:62,color:'#FFD298',peak:0.26});
    else if(o.asset==='b_forge')
      out.push({id:'v13_forge',type:'fire',x:o.x,y:o.y-70,r:76,color:'#EFB17E',peak:0.26});
    else if(o.asset&&o.asset.indexOf('b_')===0&&o.asset!=='b_gate'&&o.asset!=='b_board'&&o.asset!=='b_well'&&o.w>=400){
      out.push({id:o.id+'_w1',type:'window',x:o.x-o.w*0.18,y:o.y-o.h*0.52,r:48,color:'#F1C18D',peak:0.18});
      out.push({id:o.id+'_w2',type:'window',x:o.x+o.w*0.18,y:o.y-o.h*0.52,r:48,color:'#F1C18D',peak:0.18});
    }
  }
  for(const s of (L.smoke||[]))
    out.push({id:'chimney_'+s.x+'_'+s.y,type:'hearth',x:s.x,y:s.y-30,r:44,color:'#FFD298',peak:0.18});
  if(typeof townLife!=='undefined'&&townLife&&townLife.animals&&townLife.animals.fireflies){
    const fls=townLife.animals.fireflies;
    for(let i=0;i<fls.length;i++)
      out.push({id:'firefly_'+i,type:'firefly',x:fls[i].x,y:fls[i].y,r:26,color:'#FFE9A0',peak:0.22});
  }
  return out;
}
/* Tối đa 6 nguồn (không tính đom đóm) thấy được, gần tâm camera nhất (§3);
   đom đóm tối đa 3 con gần nhất. Không có điểm chịu 3 quầng chồng.
   Danh sách nguồn tĩnh cache theo phút game + ô camera 16px (đom đóm vẫn
   tính trực tiếp mỗi khung vì chúng di chuyển). */
var dlVisCache={key:'',main:[]};
function depthLightVisibleSources(){
  const cam=(typeof V47T!=='undefined'&&V47T&&V47T.cam)?V47T.cam:{x:0,y:0};
  const cx=cam.x+W/2, cy=cam.y+H/2;
  const key=Math.floor(depthLightTime()*4)+'|'+Math.floor(cam.x/16)+','+Math.floor(cam.y/16);
  let main;
  if(dlVisCache.key===key){ main=dlVisCache.main; }
  else{
    main=depthLightSources().filter(function(s){ return s.type!=='firefly'; })
      .sort(function(a,b){ return Math.hypot(a.x-cx,a.y-cy)-Math.hypot(b.x-cx,b.y-cy); }).slice(0,6);
    dlVisCache={key:key,main:main};
  }
  let flies=[];
  if(typeof townLife!=='undefined'&&townLife&&townLife.animals&&townLife.animals.fireflies){
    flies=townLife.animals.fireflies.map(function(fl,i){
        return {id:'firefly_'+i,type:'firefly',x:fl.x,y:fl.y,r:26,color:'#FFE9A0',peak:0.22}; })
      .sort(function(a,b){ return Math.hypot(a.x-cx,a.y-cy)-Math.hypot(b.x-cx,b.y-cy); }).slice(0,3);
  }
  return {list:main.concat(flies), total:depthLightSources().length};
}
/* Alpha đỉnh theo loại (§3) + nhấp nháy nhẹ, pha cố định theo id nguồn. */
function depthLightPeak(src,L,clock){
  let base=0, period=2200, amp=0.04;
  if(src.type==='lantern'){ base=0.26*L; period=2200; amp=0.04; }
  else if(src.type==='window'){ base=0.18*L; period=2600; amp=0.04; }
  else if(src.type==='fire'){ base=0.14+0.12*L; period=900; amp=0.11; }
  else if(src.type==='hearth'){ base=0.12+0.06*L; period=2800; amp=0.05; }
  else if(src.type==='firefly'){ base=0.22; period=1000; amp=0.5; }
  if(base<=0.01) return 0;
  const fl=1+amp*Math.sin(clock*Math.PI*2/(period/1000)+dlHash(src.id)*Math.PI*2);
  return dlClamp(base*fl,0,0.29);
}
function dlZoneHit(x,y,w,h){
  if(typeof hudTQZoneHit==='function'){ try{ return hudTQZoneHit(x,y,w,h); }catch(_){} }
  return DL_HUD_ZONES.some(function(z){ return x<z[0]+z[2]&&x+w>z[0]&&y<z[1]+z[3]&&y+h>z[1]; });
}

/* ============================================================================
   HỌA TIẾT TĨNH — vẽ tay bằng code, cache một lần
   ========================================================================== */
/* Dãy núi 3 lớp: đường cong mềm + rặng chi tiết + tuyết đỉnh lớp xa nhất +
   sương khí quyển nhạt dần theo xa (lớp xa nhạt + hơi xanh lam). */
function dlFarCanvas(){
  if(dlCache.far) return dlCache.far;
  const img=depthLightImg('map_bg_far');
  const cv=dlCanvas(1280,260), d=cv.getContext('2d');
  if(img&&img.ready&&img.img){ d.drawImage(img.img,0,0,1280,260); dlCache.far=cv; return cv; }
  const sky=d.createLinearGradient(0,0,0,260);
  sky.addColorStop(0,'#C9D4DF'); sky.addColorStop(0.6,'#D8DEE4'); sky.addColorStop(1,'#E4E2D8');
  d.fillStyle=sky; d.fillRect(0,0,1280,260);
  const layers=[
    {base:150, amp:52, col:'#A9B6C9', a:0.85, snow:true,  seed:11},
    {base:195, amp:44, col:'#8FA0B8', a:0.92, snow:false, seed:47},
    {base:232, amp:30, col:'#7A8AA3', a:1.0,  snow:false, seed:83}];
  for(const L of layers){
    const rnd=dlSeedRand(L.seed);
    d.save(); d.globalAlpha=L.a; d.fillStyle=L.col;
    d.beginPath(); d.moveTo(-20,260); d.lineTo(-20,L.base);
    let x=-20;
    while(x<1300){
      const w=90+rnd()*150, peak=L.base-(20+rnd()*L.amp);
      const cx2=x+w/2, cx3=x+w;
      d.quadraticCurveTo(x+w*0.25,peak-rnd()*14,cx2,peak);
      d.quadraticCurveTo(x+w*0.75,peak+rnd()*10,cx3,L.base-(10+rnd()*26));
      /* rặng chi tiết: gờ nhỏ trên sườn núi */
      d.quadraticCurveTo(x+w*0.3,L.base-6-rnd()*8,x+w*0.55,L.base-2);
      x=cx3;
    }
    d.lineTo(1300,260); d.closePath(); d.fill();
    if(L.snow){ /* tuyết đỉnh: mảng trắng nhỏ ở các đỉnh cao */
      d.fillStyle='rgba(244,246,248,0.85)';
      const r2=dlSeedRand(L.seed+5);
      for(let i=0;i<9;i++){
        const px=40+r2()*1200, py=L.base-58-r2()*22, s=10+r2()*16;
        d.beginPath(); d.moveTo(px-s,py+6); d.lineTo(px,py-s*0.7); d.lineTo(px+s,py+6);
        d.lineTo(px+s*0.5,py+2); d.lineTo(px,py+8); d.lineTo(px-s*0.5,py+2);
        d.closePath(); d.fill();
      }
    }
    d.restore();
  }
  /* mây mỏng + sương khí quyển phủ nhạt dần về xa */
  d.fillStyle='rgba(238,240,242,0.30)';
  for(const c of [[180,42,150,16],[620,28,190,18],[1020,52,170,15]]){
    d.beginPath(); d.ellipse(c[0],c[1],c[2],c[3],0,0,Math.PI*2); d.fill();
  }
  const haze=d.createLinearGradient(0,60,0,260);
  haze.addColorStop(0,'rgba(216,224,232,0.34)'); haze.addColorStop(1,'rgba(216,224,232,0)');
  d.fillStyle=haze; d.fillRect(0,0,1280,260);
  /* mờ dần mép dưới để tan vào mặt đất */
  d.globalCompositeOperation='destination-in';
  const fade=d.createLinearGradient(0,150,0,260);
  fade.addColorStop(0,'rgba(0,0,0,1)'); fade.addColorStop(1,'rgba(0,0,0,0)');
  d.fillStyle=fade; d.fillRect(0,0,1280,260);
  d.globalCompositeOperation='source-over';
  dlCache.far=cv; return cv;
}
/* Nền giữa: đồi + dải rừng xa — khối tán biến thiên (nhiều cụm tròn lệch
   tông, mặt sáng trên + mặt tối dưới), vài thân cây xa, sương nhạt phủ. */
function dlMidCanvas(){
  if(dlCache.mid) return dlCache.mid;
  const img=depthLightImg('map_bg_mid');
  const cv=dlCanvas(1280,200), d=cv.getContext('2d');
  if(img&&img.ready&&img.img){ d.drawImage(img.img,0,0,1280,200); dlCache.mid=cv; return cv; }
  const rnd=dlSeedRand(101);
  d.fillStyle='#8A9A7C'; /* đồi xa */
  d.beginPath(); d.moveTo(0,200); d.lineTo(0,120);
  d.quadraticCurveTo(320,58,640,104); d.quadraticCurveTo(960,142,1280,88);
  d.lineTo(1280,200); d.closePath(); d.fill();
  const cols=['#5F7D5E','#6E8A68','#54704F','#7D9678','#68836A','#4E6A52'];
  for(let i=0;i<64;i++){ /* tán rừng: cụm 2–3 vòng tròn lệch tông */
    const x=rnd()*1280, y=78+rnd()*86, r=14+rnd()*26, col=cols[Math.floor(rnd()*cols.length)];
    d.fillStyle=col;
    d.beginPath(); d.arc(x,y,r,0,Math.PI*2); d.fill();
    d.beginPath(); d.arc(x-r*0.55,y+r*0.28,r*0.68,0,Math.PI*2); d.fill();
    d.fillStyle='rgba(143,169,130,0.5)'; /* mặt sáng trên */
    d.beginPath(); d.arc(x-r*0.15,y-r*0.42,r*0.55,Math.PI,Math.PI*2); d.fill();
    d.fillStyle='rgba(20,30,20,0.28)'; /* mặt tối dưới */
    d.beginPath(); d.arc(x+r*0.1,y+r*0.5,r*0.6,0,Math.PI); d.fill();
    if(rnd()<0.3){ d.strokeStyle='rgba(58,47,36,0.7)'; d.lineWidth=2; /* thân xa */
      d.beginPath(); d.moveTo(x,y+r*0.4); d.lineTo(x,y+r*1.05); d.stroke(); }
  }
  const haze=d.createLinearGradient(0,0,0,200);
  haze.addColorStop(0,'rgba(212,222,208,0.30)'); haze.addColorStop(1,'rgba(212,222,208,0)');
  d.fillStyle=haze; d.fillRect(0,0,1280,200);
  d.globalCompositeOperation='destination-in';
  const fade=d.createLinearGradient(0,110,0,200);
  fade.addColorStop(0,'rgba(0,0,0,1)'); fade.addColorStop(1,'rgba(0,0,0,0)');
  d.fillStyle=fade; d.fillRect(0,0,1280,200);
  d.globalCompositeOperation='source-over';
  dlCache.mid=cv; return cv;
}
/* Tiền cảnh: cành có cụm lá / trúc / mái hiên — vẽ tay chi tiết, nền trong. */
function dlFgCanvas(which){
  if(which==='top'&&dlCache.fgTop) return dlCache.fgTop;
  if(which==='left'&&dlCache.fgLeft) return dlCache.fgLeft;
  if(which==='right'&&dlCache.fgRight) return dlCache.fgRight;
  const img=depthLightImg(which==='top'?'fg_eave_1':which==='left'?'fg_branch_1':'fg_bamboo_1');
  let cv, d;
  if(which==='top'){
    cv=dlCanvas(480,90); d=cv.getContext('2d');
    if(img&&img.ready&&img.img){ d.drawImage(img.img,0,0,480,90); dlCache.fgTop=cv; return cv; }
    d.fillStyle='#2E2118'; d.fillRect(0,0,480,26); /* xà mái hiên */
    d.fillStyle='#3A2A1E'; d.fillRect(0,26,480,10);
    for(let x=6;x<480;x+=24){ /* hàng ngói vảy: vòm úp nối nhau */
      d.fillStyle=(x/24)%2?'#5D4A33':'#6B563D';
      d.beginPath(); d.arc(x,36,13,0,Math.PI); d.fill();
      d.strokeStyle='rgba(20,14,8,0.5)'; d.lineWidth=1.5; d.stroke();
      d.fillStyle='rgba(232,201,139,0.35)';
      d.beginPath(); d.arc(x-3,32,4,Math.PI,Math.PI*2); d.fill();
    }
    d.strokeStyle='#2E2118'; d.lineWidth=3; /* gờ dưới mái */
    d.beginPath(); d.moveTo(0,52); d.lineTo(480,52); d.stroke();
    /* cành nhỏ + cụm lá ở đầu phải mái hiên */
    d.strokeStyle='#3A2F24'; d.lineWidth=5;
    d.beginPath(); d.moveTo(480,58); d.quadraticCurveTo(440,66,408,52); d.stroke();
    dlLeafCluster(d,428,58,dlSeedRand(7),1);
  }else if(which==='left'){
    cv=dlCanvas(140,320); d=cv.getContext('2d');
    if(img&&img.ready&&img.img){ d.drawImage(img.img,0,0,140,320); dlCache.fgLeft=cv; return cv; }
    d.strokeStyle='#3A2F24'; d.lineWidth=9; d.lineCap='round';
    d.beginPath(); d.moveTo(-6,20); d.quadraticCurveTo(70,60,96,128); d.stroke();
    d.lineWidth=6;
    d.beginPath(); d.moveTo(60,96); d.quadraticCurveTo(96,150,78,214); d.stroke();
    d.beginPath(); d.moveTo(96,128); d.quadraticCurveTo(120,180,104,248); d.stroke();
    const rnd=dlSeedRand(21);
    for(const c of [[96,128],[78,214],[104,248],[52,80],[120,180]]){
      dlLeafCluster(d,c[0],c[1],rnd,1.15);
    }
  }else{
    cv=dlCanvas(130,360); d=cv.getContext('2d');
    if(img&&img.ready&&img.img){ d.drawImage(img.img,0,0,130,360); dlCache.fgRight=cv; return cv; }
    const rnd=dlSeedRand(33);
    for(const sx of [38,86]){
      d.strokeStyle='#4E6B38'; d.lineWidth=10; d.lineCap='round';
      d.beginPath(); d.moveTo(sx,362); d.quadraticCurveTo(sx+8,200,sx-6,10); d.stroke();
      d.strokeStyle='#6E8A4E'; d.lineWidth=2; /* đốt trúc */
      for(const ny of [90,170,250,320]){
        d.beginPath(); d.moveTo(sx-7,ny); d.lineTo(sx+7,ny); d.stroke();
      }
      for(let i=0;i<4;i++){ /* lá trúc dài ở các đốt */
        const ly=60+rnd()*280, dir=rnd()<0.5?-1:1;
        d.strokeStyle='#5D7A4A'; d.lineWidth=3;
        d.beginPath(); d.moveTo(sx,ly);
        d.quadraticCurveTo(sx+dir*26,ly-14,sx+dir*44,ly-4); d.stroke();
        d.beginPath(); d.moveTo(sx,ly+8);
        d.quadraticCurveTo(sx-dir*22,ly-4,sx-dir*38,ly+4); d.stroke();
      }
    }
  }
  if(which==='top') dlCache.fgTop=cv;
  else if(which==='left') dlCache.fgLeft=cv; else dlCache.fgRight=cv;
  return cv;
}
/* Một cụm lá: 5–7 lá elip xoay + gân giữa, 2 tông xanh. */
function dlLeafCluster(d,cx,cy,rnd,scale){
  const cols=['#4A6B3F','#5D7A4A','#3E5C36'];
  for(let i=0;i<6;i++){
    const a=rnd()*Math.PI*2, r=(14+rnd()*16)*scale;
    const lx=cx+Math.cos(a)*r*0.9, ly=cy+Math.sin(a)*r*0.7;
    d.save(); d.translate(lx,ly); d.rotate(a);
    d.fillStyle=cols[i%3];
    d.beginPath(); d.ellipse(0,0,13*scale,6*scale,0,0,Math.PI*2); d.fill();
    d.strokeStyle='rgba(20,30,16,0.45)'; d.lineWidth=1;
    d.beginPath(); d.moveTo(-11*scale,0); d.lineTo(11*scale,0); d.stroke();
    d.restore();
  }
  d.fillStyle='#6E8A5E';
  d.beginPath(); d.arc(cx,cy,7*scale,0,Math.PI*2); d.fill();
}

/* ============================================================================
   BÓNG ĐỔ — cả lô bóng tĩnh vào 1 canvas phụ cache theo phút game
   ========================================================================== */
function dlDrawOneShadow(c,fx,fy,fw,fh,hgt,vec,K){
  const a=0.20*K*(vec.night?0.5:1);
  c.fillStyle='rgba(16,11,19,'+a.toFixed(3)+')';
  c.beginPath(); c.ellipse(fx,fy+1,Math.max(10,fw*0.55),Math.max(4,fh*0.4+3),0,0,Math.PI*2); c.fill();
  if(!vec.night&&vec.len>0.2){
    const ox=vec.dx*hgt*0.55, oy=vec.dy*hgt*0.55;
    c.fillStyle='rgba(16,11,19,'+(a*0.55).toFixed(3)+')';
    c.beginPath();
    c.ellipse(fx+ox,fy+1+oy,Math.max(12,fw*0.5+Math.abs(ox)*0.5),Math.max(4,fh*0.4+3),0,0,Math.PI*2);
    c.fill();
  }
}
function dlBuildShadow(vec,K){
  const cam=V47T.cam;
  const ax=Math.floor(cam.x/256)*256, ay=Math.floor(cam.y/256)*256;
  const cv=dlCanvas(1536,960), d=cv.getContext('2d');
  d.save(); d.translate(-ax,-ay);
  const L=(typeof townLayout==='function')?townLayout():null;
  if(L){
    for(const o of L.objects){
      const f=o.foot;
      if(!f||!f.w||!f.h) continue; /* foot 0x0 (cầu, ruộng) = không bóng */
      dlDrawOneShadow(d,o.x+f.x+f.w/2,o.y+f.y+f.h/2,f.w,f.h,o.h,vec,K);
    }
  }
  d.restore();
  dlCache.shadow=cv; dlCache.shadowAnchor={x:ax,y:ay}; dlStats.shadowRebuilds++;
}
function dlDrawShadows(){
  const cam=V47T.cam, gr=depthLightGradeCached();
  const vec=depthLightShadowVec(gr.hour);
  const key=Math.floor(depthLightTime()*4)+'|'+Math.floor(cam.x/256)+','+Math.floor(cam.y/256);
  if(!dlCache.shadow||dlCache.shadowKey!==key){ dlBuildShadow(vec,gr.K); dlCache.shadowKey=key; }
  const a=dlCache.shadowAnchor;
  g.drawImage(dlCache.shadow,a.x,a.y);
  dlStats.shadowDraws++;
  /* Bóng sống của người/động vật di chuyển — vẽ trực tiếp mỗi khung. */
  const live=[];
  live.push({x:V47T.x,y:V47T.y,fw:36,fh:14,h:104});
  if(typeof townNPCs==='function'){ try{
    for(const n of townNPCs()) live.push({x:n.x,y:n.y,fw:32,fh:12,h:100});
  }catch(_){} }
  if(typeof townLife!=='undefined'&&townLife&&townLife.villagers){
    for(const v of townLife.villagers) live.push({x:v.x,y:v.y,fw:32,fh:12,h:104});
  }
  for(const e of live) dlDrawOneShadow(g,e.x,e.y,e.fw,e.fh,e.h,vec,gr.K);
}

/* ============================================================================
   LỚP TỐI CÓ ĐỤC LỖ + QUẦNG SÁNG — cache theo phút game + vị trí camera
   ========================================================================== */
/* Lớp grading bake ra 2 canvas NỬA phân giải (lighting.md §8 cho phép lớp
   sáng nội bộ thấp hơn 1280×720 rồi scale mượt): một canvas màu multiply
   (đục), một canvas màu screen (alpha aS đã bake). Màu chỉ đổi theo phút
   game nên rebuild ~4 lần/giây thật; mỗi khung chỉ còn 2 drawImage. */
function dlGradeCanvases(gr){
  const key=Math.floor(depthLightTime()*4);
  if(dlCache.gradeM&&dlCache.gradeS&&dlCache.gradeKey===key) return;
  const hw=Math.max(2,W>>1), hh=Math.max(2,H>>1);
  let m=dlCache.gradeM, s=dlCache.gradeS;
  if(!m){ m=dlCanvas(hw,hh); dlCache.gradeM=m; }
  if(!s){ s=dlCanvas(hw,hh); dlCache.gradeS=s; }
  if(m.width!==hw||m.height!==hh){ m.width=hw; m.height=hh; s.width=hw; s.height=hh; }
  const f=depthLightFactors(gr);
  const dm=m.getContext('2d');
  dm.save(); dm.globalCompositeOperation='source-over'; dm.globalAlpha=1;
  dm.fillStyle='rgb('+f.r+','+f.g+','+f.b+')'; dm.fillRect(0,0,hw,hh); dm.restore();
  const ds=s.getContext('2d');
  ds.save(); ds.globalCompositeOperation='source-over';
  ds.clearRect(0,0,hw,hh);
  ds.globalAlpha=gr.aS;
  ds.fillStyle='rgb('+Math.round(gr.S[0])+','+Math.round(gr.S[1])+','+Math.round(gr.S[2])+')';
  ds.fillRect(0,0,hw,hh); ds.restore();
  dlCache.gradeKey=key; dlStats.gradeRebuilds++;
}
/* Lớp tối nửa phân giải, đục lỗ quanh nguồn sáng (destination-out). */
function dlDarkCanvas(gr){
  const darkA=dlClamp(gr.aM-0.15,0,0.45);
  if(darkA<=0.005) return null;
  const cam=V47T.cam;
  const key=Math.floor(depthLightTime()*4)+'|'+Math.floor(cam.x/32)+','+Math.floor(cam.y/32);
  if(dlCache.dark&&dlCache.darkKey===key) return dlCache.dark;
  const hw=Math.max(2,W>>1), hh=Math.max(2,H>>1);
  const cv=dlCanvas(hw,hh), d=cv.getContext('2d');
  d.fillStyle='rgba(5,7,16,'+darkA.toFixed(3)+')'; d.fillRect(0,0,hw,hh);
  d.globalCompositeOperation='destination-out';
  const vis=depthLightVisibleSources().list;
  for(const s of vis){
    const sx=(s.x-cam.x)/2, sy=(s.y-cam.y)/2, sr=s.r/2;
    if(sx<-sr||sx>hw+sr||sy<-sr||sy>hh+sr) continue;
    const pk=depthLightPeak(s,gr.L,dlClock());
    if(pk<=0.01) continue;
    const rad=d.createRadialGradient(sx,sy,0,sx,sy,sr);
    rad.addColorStop(0,'rgba(0,0,0,0.9)'); rad.addColorStop(0.6,'rgba(0,0,0,0.45)');
    rad.addColorStop(1,'rgba(0,0,0,0)');
    d.fillStyle=rad;
    d.beginPath(); d.arc(sx,sy,sr,0,Math.PI*2); d.fill();
  }
  d.globalCompositeOperation='source-over';
  dlCache.dark=cv; dlCache.darkKey=key; dlStats.darkRebuilds++;
  return cv;
}
function dlDrawGlows(gr){
  const cam=V47T.cam, clock=dlClock();
  const vis=depthLightVisibleSources().list;
  const glowImg=depthLightImg('light_glow');
  g.save(); g.globalCompositeOperation='lighter';
  for(const s of vis){
    const pk=depthLightPeak(s,gr.L,clock);
    if(pk<=0.01) continue;
    const sx=s.x-cam.x, sy=s.y-cam.y;
    if(sx<-s.r||sx>W+s.r||sy<-s.r||sy>H+s.r) continue;
    if(glowImg&&glowImg.ready&&glowImg.img){
      g.globalAlpha=pk; g.drawImage(glowImg.img,sx-s.r,sy-s.r,s.r*2,s.r*2);
    }else{
      g.globalAlpha=pk; g.drawImage(dlGlowSprite(s.color),sx-s.r,sy-s.r,s.r*2,s.r*2);
    }
    if(s.type==='firefly'){ /* lõi đom đóm nhấp nháy */
      const pulse=0.5+0.5*Math.sin(clock*3+dlHash(s.id)*6);
      g.globalAlpha=0.85*pulse; g.fillStyle='#FFE9A0';
      g.beginPath(); g.arc(sx,sy,3,0,Math.PI*2); g.fill();
    }
    dlStats.glowsDrawn++;
  }
  g.restore();
}
function dlDrawDust(gr){
  if(gr.L>0.6) return; /* đêm: đom đóm thay bụi */
  const clock=dlClock();
  g.save();
  g.fillStyle=DL_REGION.P;
  for(let i=0;i<DL_REGION.dust;i++){
    const x=((i*173+clock*6)%(W+40))-20, y=(i*97+Math.sin(clock*0.5+i)*8)%H;
    g.globalAlpha=0.20*(1-gr.L*0.7);
    g.beginPath(); g.arc(x,y,1+(i%2)*0.8,0,Math.PI*2); g.fill();
    dlStats.dustDrawn++;
  }
  g.restore();
}
/* Tiền cảnh: mái hiên giữa đỉnh + cành trái + trúc phải — né 3 vùng HUD,
   mờ đi khi người chơi đứng sau (đứng gần mép có tiền cảnh). */
function dlDrawForeground(){
  const cam=V47T.cam, gr=depthLightGradeCached();
  const hx=V47T.x-cam.x, hy=V47T.y-cam.y;
  const dim=0.55+0.45*(1-gr.aM); /* đêm tiền cảnh cũng tối theo */
  const pieces=[
    {cv:dlFgCanvas('top'),   x:400, y:0,   w:480, h:90,  near:(hy<120)},
    {cv:dlFgCanvas('left'),  x:0,   y:140, w:140, h:320, near:(hx<160&&hy>140&&hy<460)},
    {cv:dlFgCanvas('right'), x:1150,y:300, w:130, h:360, near:(hx>1130&&hy>300&&hy<660)}];
  for(const pc of pieces){
    if(dlZoneHit(pc.x,pc.y,pc.w,pc.h)) continue;
    g.save();
    g.globalAlpha=0.85*dim*(pc.near?0.4:1);
    g.drawImage(pc.cv,pc.x,pc.y);
    g.restore();
    dlStats.fgDraws++;
  }
}

/* ============================================================================
   2 ĐIỂM GẮN TRONG townDrawWorld() (PATCH)
   ========================================================================== */
/* Gọi sau vòng nền (trước danh sách y-sort): parallax xa/giữa + sương sớm
   (mức vừa trở lên) + bóng đổ. Mức thấp: không vẽ gì ở đây. */
function depthLightDrawBack(){
  if(!depthLightActive()) return;
  const q=depthLightQuality();
  if(q<1) return;
  const cam=V47T.cam, clock=dlClock();
  // [Claude ghép 22/11] cập nhật hướng/độ dài bóng sprite chung (src/65 TOWN_SUN) theo giờ — thay hệ bóng chân riêng của M1
  if(typeof TOWN_SUN!=='undefined'){ const v=depthLightShadowVec(depthLightHour());
    if(v.night){ TOWN_SUN.alpha=0.07; TOWN_SUN.sx=0; TOWN_SUN.sy=-0.12; }
    else { TOWN_SUN.sx=-v.dx*0.4; TOWN_SUN.sy=-(0.12+0.18*v.len); TOWN_SUN.alpha=0.30; } }
  // [Claude ghép] map bản 3 lát kín màn hình: viễn cảnh chỉ hiện ở dải trời phía trên vách núi bắc (world y<540)
  const skyH=Math.max(0,Math.min(H,540-cam.y));
  if(skyH<=0) return;
  g.save();
  g.translate(cam.x,cam.y); /* về hệ màn hình: 0..W, 0..H */
  g.beginPath(); g.rect(0,0,W,skyH); g.clip();
  const far=dlFarCanvas(), mid=dlMidCanvas();
  let ox=-((cam.x*0.25)%W); if(ox>0) ox-=W;
  g.save(); g.globalAlpha=0.55; /* viễn cảnh nhạt + hơi xanh lam */
  g.drawImage(far,ox,0); g.drawImage(far,ox+W,0); g.restore();
  let mx=-((cam.x*0.55)%W); if(mx>0) mx-=W;
  g.save(); g.globalAlpha=0.6;
  g.drawImage(mid,mx,64); g.drawImage(mid,mx+W,64); g.restore();
  dlStats.parallaxDraws++;
  const fa=depthLightFogAlpha(depthLightHour());
  if(fa>0.005){ /* sương sớm: 3 dải mờ ngang trôi chậm */
    g.save();
    for(let i=0;i<3;i++){
      const bw=[480,640,520][i], bh=[110,140,120][i], by=[120,175,235][i];
      const bx=((clock*3+i*613)%(W+900))-450;
      g.fillStyle=dlHexA(DL_REGION.F,fa*(0.7+0.3*Math.sin(clock*0.4+i*2)));
      g.beginPath(); g.ellipse(bx,by,bw/2,bh/2,0,0,Math.PI*2); g.fill();
    }
    g.restore();
  }
  g.restore();
  /* dlDrawShadows(); — [Claude ghép] tắt: dùng bóng theo hình sprite của src/65 (TOWN_SUN cập nhật ở trên) */
}
/* Gọi cuối townDrawWorld (sau cổng/điểm/đường dẫn): grading toàn scene +
   lớp tối đục lỗ + quầng sáng + bụi (mức cao) + tiền cảnh (mức vừa+).
   Mức thấp: chỉ grading. */
function depthLightDrawFront(){
  if(!depthLightActive()) return;
  const q=depthLightQuality();
  const gr=depthLightGradeCached();
  g.save();
  g.translate(camSafe().x,camSafe().y); /* về hệ màn hình */
  dlGradeCanvases(gr); /* grading = 2 drawImage canvas nửa phân giải */
  g.globalCompositeOperation='multiply';
  g.drawImage(dlCache.gradeM,0,0,W,H);
  g.globalCompositeOperation='screen';
  g.drawImage(dlCache.gradeS,0,0,W,H);
  g.globalAlpha=1; g.globalCompositeOperation='source-over';
  dlStats.graded++;
  if(q>=2){
    const dk=dlDarkCanvas(gr);
    if(dk){ g.drawImage(dk,0,0,W,H); dlStats.darkDraws++; }
    dlDrawGlows(gr);
    dlDrawDust(gr);
  }
  /* if(q>=1) dlDrawForeground(); — [Claude ghép] tắt: tiền cảnh dán cố định theo màn hình (dải mái tối ở đỉnh, cành ở 2 mép) trông như khung che; sẽ làm lại thành vật thể thế giới parallax 1,35× */
  g.restore();
  dlStats.frames++;
}
function camSafe(){ return (typeof V47T!=='undefined'&&V47T&&V47T.cam)?V47T.cam:{x:0,y:0}; }

/* ============================================================================
   HỌA TIẾT CHI TIẾT CHO KHỐI GIỮ CHỖ (PATCH townDrawObject / townGroundTile)
   Chỉ chạy khi module đang hoạt động; có ảnh thật thì townDrawObject đã
   return 'img' trước đó nên không chạm vào ảnh.
   ========================================================================== */
/* Cổng detail cache 100ms (theo V47T.clock + quality): tránh gọi
   depthLightActive()/v41Quality() cho từng vật thể mỗi khung; lệch tối đa
   100ms lúc vào/rời thôn — townDrawWorld chỉ chạy trong thôn nên vô hại. */
var dlDetailGate={key:'',ok:false};
function dlDetailAllowed(){
  const key=Math.floor(dlClock()*10)+'|'+depthLightQuality();
  if(dlDetailGate.key!==key){ dlDetailGate.key=key; dlDetailGate.ok=depthLightActive()&&depthLightQuality()>=1; }
  return dlDetailGate.ok;
}
function depthLightObjectDetail(o,x,y,w,h){
  if(!dlDetailAllowed()) return;
  dlStats.detailCalls++;
  const a=o.asset||'';
  const gr=depthLightGradeCached();
  var rnd=null;
  const rndFn=function(){ if(!rnd) rnd=dlSeedRand(Math.floor(dlHash(o.id||a)*100000)+7); return rnd; };
  g.save();
  if(a.indexOf('b_')===0&&a!=='b_gate'&&a!=='b_board'&&a!=='b_well'){
    const bw=w*0.8, bh=h*0.62, bx=x-bw/2, by=y-bh, roofH=h-bh;
    /* hàng ngói vảy: gom mọi vòm vào MỘT path, fill+stroke 1 lần */
    g.beginPath();
    for(let row=0;row<3;row++){
      const ry=by-roofH*(0.25+row*0.28), halfW=(bw/2+14)*(1-(0.25+row*0.28));
      const n=Math.max(3,Math.floor(halfW/26));
      for(let i=0;i<n;i++){
        const tx=bx+bw/2-halfW+(2*halfW)*(i+0.5)/n;
        g.moveTo(tx+10,ry); g.arc(tx,ry,10,0,Math.PI);
      }
    }
    g.fillStyle='rgba(93,74,51,0.85)'; g.fill();
    g.strokeStyle='rgba(20,14,8,0.4)'; g.lineWidth=1; g.stroke();
    g.strokeStyle='rgba(232,201,139,0.4)'; g.lineWidth=2; /* sống mái */
    g.beginPath(); g.moveTo(bx-14,by); g.lineTo(x,by-roofH); g.lineTo(bx+bw+14,by); g.stroke();
    /* vân gỗ: 3 đường lượn gom 1 path */
    g.strokeStyle='rgba(30,20,12,0.20)'; g.lineWidth=1.5;
    g.beginPath();
    for(const fy of [0.3,0.55,0.8]){
      const wy=by+bh*fy;
      g.moveTo(bx+8,wy); g.quadraticCurveTo(x,wy+3,bx+bw-8,wy);
    }
    g.stroke();
    /* cửa sổ: 2 ô — fill gom, khung + chữ thập gom 1 path */
    g.fillStyle=gr.L>0.05?dlHexA('#F1C18D',0.25+0.6*gr.L):'rgba(40,30,20,0.6)';
    g.beginPath();
    for(const wx of [x-w*0.22,x+w*0.22]){ g.rect(wx-13,by+bh*0.26,26,34); }
    g.fill();
    g.strokeStyle='rgba(20,14,8,0.55)'; g.lineWidth=1.5;
    g.beginPath();
    for(const wx of [x-w*0.22,x+w*0.22]){
      const wy=by+bh*0.26;
      g.rect(wx-13,wy,26,34);
      g.moveTo(wx,wy); g.lineTo(wx,wy+34);
      g.moveTo(wx-13,wy+17); g.lineTo(wx+13,wy+17);
    }
    g.stroke();
    g.strokeStyle='rgba(20,14,8,0.5)'; g.lineWidth=2; /* khung cửa */
    g.strokeRect(x-28,y-98,56,98);
  }else if(a.indexOf('t_')===0){
    const top=y-h+70, rnd=rndFn();
    if(a.indexOf('t_bamboo')===0){ /* đốt trúc + lá — gom 1 path mỗi loại */
      g.beginPath();
      for(const ny of [top+90,top+170,top+250]){ g.moveTo(x-8,ny); g.lineTo(x+8,ny); }
      g.strokeStyle='rgba(46,60,30,0.6)'; g.lineWidth=2; g.stroke();
      g.beginPath();
      for(let i=0;i<4;i++){ const ly=top+60+rnd()*220, dir=rnd()<0.5?-1:1;
        g.moveTo(x,ly); g.quadraticCurveTo(x+dir*20,ly-12,x+dir*36,ly-2); }
      g.strokeStyle='#5D7A4A'; g.lineWidth=2.5; g.stroke();
    }else{ /* cụm lá phụ: tán biến thiên, mặt sáng trên — gom path */
      const pts=[];
      g.beginPath();
      for(let i=0;i<4;i++){
        const lx=x+(rnd()-0.5)*w*0.5, ly=top+55+(rnd()-0.5)*70, r=10+rnd()*14;
        pts.push([lx,ly,r]);
        g.moveTo(lx+r,ly); g.arc(lx,ly,r,0,Math.PI*2);
      }
      g.fillStyle='#5F7D5E'; g.fill();
      g.beginPath();
      for(const q of pts){ g.moveTo(q[0]+q[2]*0.5,q[1]-q[2]*0.4); g.arc(q[0]-q[2]*0.2,q[1]-q[2]*0.4,q[2]*0.5,Math.PI,Math.PI*2); }
      g.fillStyle='rgba(143,169,130,0.5)'; g.fill();
      g.beginPath();
      g.moveTo(x,top+70); g.lineTo(x-w*0.2,top+110);
      g.moveTo(x,top+70); g.lineTo(x+w*0.2,top+105);
      g.strokeStyle='rgba(30,40,20,0.4)'; g.lineWidth=1.5; g.stroke();
    }
  }else if(a.indexOf('s_bridge')===0){
    g.beginPath(); /* ván cầu — gom 1 path */
    for(let i=1;i<8;i++){ const bx2=x-w/2+i*w/8;
      g.moveTo(bx2,y-26); g.lineTo(bx2,y+26); }
    g.strokeStyle='rgba(60,44,26,0.5)'; g.lineWidth=2; g.stroke();
  }else if(a==='s_field'){
    g.beginPath(); /* mầm linh thảo theo luống (12 mầm) — gom 1 path */
    for(let r2=0;r2<3;r2++) for(let c2=0;c2<4;c2++){
      const px=x-w/2+30+c2*(w-60)/3, py=y-h+30+r2*h/4;
      g.moveTo(px,py); g.lineTo(px-3,py-9); g.moveTo(px,py); g.lineTo(px+3,py-9);
    }
    g.strokeStyle='#7D9678'; g.lineWidth=2; g.stroke();
  }else if(a.indexOf('p_lantern')===0){
    g.beginPath(); /* tua đèn — gom 1 path */
    for(let i=-1;i<=1;i++){ g.moveTo(x+i*5,y-20); g.lineTo(x+i*5,y-6); }
    g.strokeStyle='#C9A86A'; g.lineWidth=2; g.stroke();
    g.fillStyle=dlHexA('#FFD298',0.3+0.6*gr.L);
    g.beginPath(); g.arc(x,y-80,12,0,Math.PI*2); g.fill();
  }else if(a.indexOf('r_rock')===0){
    g.beginPath(); /* mặt đá */
    g.moveTo(x-w*0.25,y-30); g.lineTo(x,y-44); g.lineTo(x+w*0.25,y-28);
    g.strokeStyle='rgba(40,36,30,0.5)'; g.lineWidth=1.5; g.stroke();
    g.beginPath(); g.moveTo(x-w*0.3,y-38); g.lineTo(x-w*0.1,y-46);
    g.strokeStyle='rgba(255,255,255,0.25)'; g.stroke();
  }else if(a.indexOf('p_fence')===0||a.indexOf('p_rail')===0){
    g.beginPath(); /* thanh dọc — gom 1 path */
    for(let i=1;i<6;i++){ const px=x-w/2+i*w/6;
      g.moveTo(px,y-36); g.lineTo(px,y); }
    g.strokeStyle='rgba(30,22,14,0.4)'; g.lineWidth=1.5; g.stroke();
  }else if(a.indexOf('s_stall')===0){
    g.fillStyle='rgba(60,30,24,0.35)'; /* sọc mái sạp + hàng hóa */
    for(let i=0;i<3;i++){ g.fillRect(x-w/2+i*w/3,y-150,w/6,80); }
    g.beginPath();
    for(let i=0;i<5;i++){ const px=x-w/2+16+i*16; g.moveTo(px+4,y-78); g.arc(px,y-78,4,0,Math.PI*2); }
    g.fillStyle='#C9A86A'; g.fill();
  }else if(a==='p_crate'){
    g.beginPath(); /* chéo thùng — gom 1 path */
    g.moveTo(x-w/2,y-h); g.lineTo(x+w/2,y); g.moveTo(x+w/2,y-h); g.lineTo(x-w/2,y);
    g.strokeStyle='rgba(40,28,16,0.5)'; g.lineWidth=2; g.stroke();
  }else if(a==='p_barrel'){
    g.beginPath(); /* đai thùng — gom 1 path */
    g.ellipse(x,y-48,w/2,7,0,0,Math.PI*2);
    g.ellipse(x,y-20,w/2,7,0,0,Math.PI*2);
    g.strokeStyle='rgba(40,28,16,0.55)'; g.lineWidth=2; g.stroke();
  }else if(a.indexOf('p_banner')===0){
    g.beginPath(); /* nếp vải — gom 1 path */
    g.moveTo(x+12,y-h+24); g.lineTo(x+12,y-h+52);
    g.moveTo(x+30,y-h+24); g.lineTo(x+30,y-h+52);
    g.strokeStyle='rgba(60,20,16,0.45)'; g.lineWidth=1.5; g.stroke();
    g.fillStyle='#E8C98B'; g.beginPath(); g.arc(x+25,y-h+36,5,0,Math.PI*2); g.fill();
  }else if(a.indexOf('p_bush')===0){
    const rnd=rndFn();
    g.beginPath(); /* lá non trên bụi — gom 1 path */
    for(let i=0;i<4;i++){ const px=x+(rnd()-0.5)*w*0.6, py=y-28+(rnd()-0.5)*22, pr=5+rnd()*4;
      g.moveTo(px+pr,py); g.arc(px,py,pr,0,Math.PI*2); }
    g.fillStyle='rgba(143,169,130,0.55)'; g.fill();
  }
  g.restore();
}
/* Đá lát có mạch: lưới khớp 64px theo tọa độ thế giới, kẹp theo poly. */
function depthLightStoneJoints(d,poly){
  d.save();
  d.beginPath();
  poly.forEach(function(pt,i){ if(i===0)d.moveTo(pt[0],pt[1]); else d.lineTo(pt[0],pt[1]); });
  d.closePath(); d.clip();
  let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
  for(const pt of poly){ minX=Math.min(minX,pt[0]); maxX=Math.max(maxX,pt[0]); minY=Math.min(minY,pt[1]); maxY=Math.max(maxY,pt[1]); }
  d.strokeStyle='rgba(20,18,14,0.20)'; d.lineWidth=2;
  d.beginPath();
  for(let x=Math.floor(minX/64)*64;x<=maxX;x+=64){ d.moveTo(x,minY); d.lineTo(x,maxY); }
  for(let y=Math.floor(minY/64)*64;y<=maxY;y+=64){ d.moveTo(minX,y); d.lineTo(maxX,y); }
  d.stroke();
  d.strokeStyle='rgba(255,255,255,0.06)'; d.lineWidth=1;
  d.beginPath();
  for(let x=Math.floor(minX/64)*64+2;x<=maxX;x+=64){ d.moveTo(x,minY); d.lineTo(x,maxY); }
  d.stroke();
  d.restore();
}
/* Nước có gợn sáng: 7 vệt sáng lượn sóng, vị trí cố định theo poly. */
function depthLightWaterGlints(d,poly){
  let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
  for(const pt of poly){ minX=Math.min(minX,pt[0]); maxX=Math.max(maxX,pt[0]); minY=Math.min(minY,pt[1]); maxY=Math.max(maxY,pt[1]); }
  const rnd=dlSeedRand(Math.floor(minX*7+minY*13)+5);
  d.save();
  d.strokeStyle='rgba(255,255,255,0.28)'; d.lineWidth=2; d.lineCap='round';
  for(let i=0;i<7;i++){
    const x=minX+20+rnd()*(maxX-minX-70), y=minY+10+rnd()*(maxY-minY-20), len=18+rnd()*22;
    d.beginPath(); d.moveTo(x,y);
    d.quadraticCurveTo(x+len/2,y-3,x+len,y); d.stroke();
  }
  d.fillStyle='rgba(255,255,255,0.07)';
  d.beginPath(); d.ellipse((minX+maxX)/2,(minY+maxY)/2,(maxX-minX)*0.3,10,0,0,Math.PI*2); d.fill();
  d.restore();
}

/* ---- chẩn đoán cho harness / Claude ---- */
function depthLightStats(){
  return {frames:dlStats.frames, graded:dlStats.graded, gradeRebuilds:dlStats.gradeRebuilds, parallaxDraws:dlStats.parallaxDraws,
    shadowDraws:dlStats.shadowDraws, shadowRebuilds:dlStats.shadowRebuilds,
    darkDraws:dlStats.darkDraws, darkRebuilds:dlStats.darkRebuilds,
    glowsDrawn:dlStats.glowsDrawn, dustDrawn:dlStats.dustDrawn, fgDraws:dlStats.fgDraws,
    detailCalls:dlStats.detailCalls, quality:depthLightQuality(),
    hour:depthLightHour(), active:depthLightActive()};
}
