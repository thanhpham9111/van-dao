'use strict';
/* ============================================================================
   M4 (GÓI 05) — Tương tác "sơn môn" trong thôn V47T
   Thanh Thạch Thôn chính là trụ sở Thanh Vân Tông (V14_SECTS cloud: leader
   'inn' = "Đại điện · Trưởng lão"). Module thêm 6 loại tương tác (8 điểm):
     ward     Bùa động phủ      — 1 lần/ngày; có Hộ Thân Phù thì dán (+45 tu vi,
                                  tiêu 1 phù), không có thì vẽ bùa giấy (+20).
                                  Bùa sáng nhẹ trên cửa Động phủ tới hết ngày.
     herb_1..3 Hái dược thảo    — mỗi khóm +1 linh thảo, mọc lại sau 30 đơn vị
                                  worldTime (2 giờ game), tổng 6 lần/ngày.
     spring   Uống linh tuyền   — 2 lần/ngày: linh lực đầy, +30% máu tối đa
                                  (kẹp theo currentStats), lần đầu/ngày +10 tu vi.
     furnace  Lò luyện khí      — mở Thiên Công Phường (v30ForgeOpen live) khi
                                  v30ForgeAllowed(); lửa bùng 1,5 giây mỗi lần nhấn.
     master   Giáo đầu sân luyện— lần đầu/ngày chỉ điểm (+15 tu vi, 1 câu khuyên
                                  xoay vòng 8 câu); các lần sau gọi v42tOpen().
     incense  Thắp hương        — 1 lần/ngày, +10 tu vi + câu chúc; hương cháy
                                  30 đơn vị worldTime, khói ≤12 hạt, đêm có quầng ấm.

   NỐI VÀO GAME (không bọc đè hàm nào) — 4 PATCH lên src/67_town_life.js
   (ops/patches/MUSE_05_M4.json):
     1. townLifePoints() nối thêm sectLifePoints()  -> townLifeNear/dock E thấy điểm.
     2. đầu townLifeInteract(): pt.kind==='sect' -> sectLifeInteract(pt).
     3. cuối townLifeDrawEntries(): sectLifeDrawEntries(push,inside) (y-sort M2).
     4. townLifeDrawEntry(): it.type==='sect' -> sectLifeDrawEntry(it).
   Tick hạt/lửa/khói: FRAME_HOOKS.update (src/01_core.js) — sectLifeTick(dt),
   dt kẹp ≤0,1 giây, chỉ chạy khi cảnh thôn V47T đang hoạt động.

   TỌA ĐỘ: map 3200×1800 của DATA.town_layout. Mỗi điểm cách mọi point khác của
   layout, mọi V471_NODES (sau townApplyLayout) và cổng ≥110 px vì townLifeNear
   (bán kính 95) được ưu tiên trước NPC/công trình. Giáo đầu vì thế đứng cách
   node 'training' ~132 px (>90): lần 2+ v42tOpen live sẽ dẫn đường vài bước
   tới Sân luyện ("Đang đến sân luyện."), tới nơi nhấn E như cũ.

   SAVE: chỉ dùng trường p.sectLife trong save hiện có (không key mới):
     {day, ward, wardDay, wardKind, herb, regrow:{herb_1:wt,...}, spring,
      master, tip, incense, incenseUntil}
   Đếm/ngày reset khi Math.floor(worldTime/360) đổi; save cũ thiếu -> tạo mặc định.
   Cờ SECT_LIFE=false, TOWN_NEW false/thiếu, hoặc thiếu DATA.town_layout
   (console.warn 1 lần) -> module im lặng, sectLifePoints() trả [].
   ========================================================================== */
var SECT_LIFE = true;
var sectLifeWarned = false;
var sectRun = null;              // trạng thái chạy (hạt, lửa) — không lưu save
var sectLifeSprites = {};        // cache canvas phụ: mỗi loại vẽ 1 lần
var SECT_LIFE_MAX_SMOKE = 12;
var SECT_LIFE_MAX_FX = 40;
var SECT_LIFE_REGROW = 30;       // đơn vị worldTime (15 = 1 giờ game)
var SECT_LIFE_BURN = 30;
var SECT_LIFE_LIMITS = {ward:1, herb:6, spring:2, master:1, incense:1};
var SECT_LIFE_POINTS = [
  {id:'ward',    kind:'sect', act:'ward',    name:'Bùa động phủ',        x:2470, y:490},
  {id:'herb_1',  kind:'sect', act:'herb',    name:'Khóm dược thảo',      x:740,  y:1560},
  {id:'herb_2',  kind:'sect', act:'herb',    name:'Khóm dược thảo',      x:1020, y:1700},
  {id:'herb_3',  kind:'sect', act:'herb',    name:'Khóm dược thảo',      x:400,  y:1600},
  {id:'spring',  kind:'sect', act:'spring',  name:'Linh tuyền',          x:2200, y:620},
  {id:'furnace', kind:'sect', act:'furnace', name:'Lò luyện khí',        x:530,  y:1240},
  {id:'master',  kind:'sect', act:'master',  name:'Giáo đầu sân luyện',  x:2600, y:1235},
  {id:'incense', kind:'sect', act:'incense', name:'Đỉnh hương Đại điện', x:1600, y:690}
];
var SECT_LIFE_TIPS = [
  'Hơi thở đều thì linh khí mới thuận. Luyện kiếm trước hết là luyện tâm.',
  'Đừng tham công. Một chiêu thuần thục hơn mười chiêu nửa vời.',
  'Bước chân vững thì kiếm mới vững. Hạ thấp trọng tâm xuống đan điền.',
  'Thấy đối thủ vung đòn lớn, lùi nửa bước rồi phản kích — đừng đỡ cứng.',
  'Linh lực cạn là lúc dễ bại nhất. Giữ lại một phần cho lúc thoát thân.',
  'Tu vi tăng nhanh mà căn cơ lỏng thì gặp thiên kiếp sẽ khổ. Chậm mà chắc.',
  'Đánh mộc nhân trăm lần không bằng một trận thật. Nhưng chưa vững thì chớ liều.',
  'Sáng luyện thể, tối tĩnh tọa. Âm dương điều hòa, đạo tâm tự sáng.'
];
var SECT_LIFE_BLESS = [
  'Nguyện tổ sư phù hộ, đạo tâm kiên định',
  'Nguyện sơn môn hưng thịnh, đồng môn bình an',
  'Nguyện tu hành thuận lợi, sớm ngày đột phá',
  'Nguyện thiên địa linh khí tụ về Thanh Vân',
  'Nguyện tâm như minh kính, không vướng bụi trần'
];

/* ---- điều kiện chạy ---- */
function sectLifeLayout(){
  if(typeof townLifeLayout==='function') return townLifeLayout();
  if(typeof DATA!=='undefined'&&DATA) return DATA.town_layout||null;
  return null;
}
function sectLifeEnabled(){
  if(!SECT_LIFE) return false;
  if(typeof TOWN_NEW==='undefined'||!TOWN_NEW) return false;
  if(!sectLifeLayout()){
    if(!sectLifeWarned){ sectLifeWarned=true; console.warn('[M4] DATA.town_layout thiếu — tắt tương tác sơn môn.'); }
    return false;
  }
  return true;
}
function sectLifeActive(){
  return sectLifeEnabled()&&typeof townLifeActive==='function'&&townLifeActive();
}
function sectLifePoints(){ return sectLifeEnabled()?SECT_LIFE_POINTS:[]; }
function sectLifeNow(){ return (p&&Number.isFinite(p.worldTime))?p.worldTime:0; }
function sectLifeDay(){ return Math.floor(sectLifeNow()/360); }
function sectLifeIsNight(){
  if(typeof townLifeNight==='function') return townLifeNight();
  const h=(sectLifeNow()%360)/15; return h>=19||h<5;
}
/* p.sectLife: mặc định cho save cũ, reset đếm khi đổi ngày. */
function sectLifeState(){
  if(!p) return {day:0,ward:0,wardDay:-1,wardKind:'',herb:0,regrow:{},spring:0,master:0,tip:0,incense:0,incenseUntil:0};
  let s=p.sectLife;
  if(!s||typeof s!=='object'||Array.isArray(s)){ s={}; p.sectLife=s; }
  const today=sectLifeDay();
  if(!Number.isFinite(s.day)) s.day=today;
  for(const k of ['ward','herb','spring','master','incense','tip','incenseUntil']) if(!Number.isFinite(s[k])) s[k]=0;
  if(!Number.isFinite(s.wardDay)) s.wardDay=-1;
  if(typeof s.wardKind!=='string') s.wardKind='';
  if(!s.regrow||typeof s.regrow!=='object') s.regrow={};
  if(s.day!==today){ s.day=today; s.ward=0; s.herb=0; s.spring=0; s.master=0; s.incense=0; }
  return s;
}
function sectLifeRun(){
  if(!sectRun) sectRun={clock:0, flareT:0, talkT:0, talk:'', pickT:{}, smoke:[], fx:[], ripples:[],
    spawn:{smoke:0, ember:0, steam:0, ripple:0}};
  return sectRun;
}
function sectLifeCount(n,N){ return ' ('+n+'/'+N+' hôm nay)'; }
function sectLifeSave(){ if(typeof save==='function') save(); }
function sectLifeXP(n){ if(typeof gainXP==='function') gainXP(n); }
function sectLifeSay(s){ if(typeof message==='function') message(s); }
function sectLifePt(act){ return SECT_LIFE_POINTS.find(function(q){ return q.act===act; }); }
function sectLifeInCam(x,y,m){
  if(typeof townLifeInCam==='function') return townLifeInCam(x,y,m);
  return true;
}
function sectLifeAddFx(arr,max,o){ while(arr.length>=max) arr.shift(); arr.push(o); }

/* ---- tương tác (E) ---- */
function sectLifeInteract(pt){
  if(!pt||pt.kind!=='sect'||!p) return false;
  if(!sectLifeEnabled()) return false;
  const s=sectLifeState(), R=sectLifeRun(), now=sectLifeNow();
  if(pt.act==='ward'){
    if(s.ward>=SECT_LIFE_LIMITS.ward){ sectLifeSay('Hôm nay đã trấn bùa cửa động phủ'+sectLifeCount(s.ward,1)+'. Mai hãy quay lại.'); return true; }
    let used=false;
    if(typeof v13Adjust==='function'){ try{ used=!!v13Adjust('ward',-1); }catch(e){ used=false; } }
    s.ward=1; s.wardDay=s.day; s.wardKind=used?'phu':'giay';
    sectLifeXP(used?45:20);
    for(let i=0;i<8;i++) sectLifeAddFx(R.fx,SECT_LIFE_MAX_FX,{kind:'spark',x:pt.x+Math.random()*24-12,y:pt.y-70+Math.random()*20,vx:Math.random()*30-15,vy:-20-Math.random()*20,life:1,max:1});
    sectLifeSay(used?'Dán Hộ Thân Phù trấn cửa động phủ · +45 tu vi'+sectLifeCount(1,1)+'.'
                    :'Không có Hộ Thân Phù — vẽ bùa giấy trấn cửa · +20 tu vi'+sectLifeCount(1,1)+'.');
    sectLifeSave();
    return true;
  }
  if(pt.act==='herb'){
    if(s.herb>=SECT_LIFE_LIMITS.herb){ sectLifeSay('Hôm nay đã hái đủ 6 lần dược thảo. Mai hãy quay lại.'); return true; }
    const until=Number(s.regrow[pt.id])||0;
    if(until>now){
      const h=((until-now)/15).toFixed(1).replace('.',',');
      sectLifeSay('Khóm dược thảo mới hái, chưa mọc lại · còn khoảng '+h+' giờ.');
      return true;
    }
    s.herb++; s.regrow[pt.id]=now+SECT_LIFE_REGROW;
    let got=false;
    if(typeof v13Adjust==='function'){ try{ got=!!v13Adjust('herb',1); }catch(e){ got=false; } }
    if(!got&&p.v13&&p.v13.bag){ p.v13.bag.herb=(p.v13.bag.herb||0)+1; got=true; }
    if(!got) p.stones=(p.stones||0)+3;
    R.pickT[pt.id]=0.6;
    for(let i=0;i<6;i++) sectLifeAddFx(R.fx,SECT_LIFE_MAX_FX,{kind:'leaf',x:pt.x+Math.random()*30-15,y:pt.y-24,vx:Math.random()*40-20,vy:-30-Math.random()*20,life:0.9,max:0.9});
    sectLifeSay((got?'Hái dược thảo · +1 linh thảo':'Hái dược thảo · +3 linh thạch')+sectLifeCount(s.herb,6)+'.');
    sectLifeSave();
    return true;
  }
  if(pt.act==='spring'){
    if(s.spring>=SECT_LIFE_LIMITS.spring){ sectLifeSay('Linh tuyền hôm nay đã uống đủ 2 lần. Mai hãy quay lại.'); return true; }
    s.spring++;
    const first=s.spring===1;
    const st=(typeof currentStats==='function')?currentStats():null;
    if(st){ p.mp=st.mp; p.hp=Math.min(st.hp,(p.hp||0)+st.hp*0.3); }
    if(first) sectLifeXP(10);
    for(let i=0;i<3;i++) sectLifeAddFx(R.ripples,8,{x:pt.x+Math.random()*30-15,y:pt.y-40+Math.random()*8-4,r:4+i*5,life:1.4,max:1.4});
    sectLifeSay('Uống linh tuyền · linh lực đầy, hồi 30% máu'+(first?' · +10 tu vi':'')+sectLifeCount(s.spring,2)+'.');
    sectLifeSave();
    return true;
  }
  if(pt.act==='furnace'){
    R.flareT=1.5;
    for(let i=0;i<10;i++) sectLifeAddFx(R.fx,SECT_LIFE_MAX_FX,{kind:'ember',x:pt.x+Math.random()*24-12,y:pt.y-64,vx:Math.random()*50-25,vy:-60-Math.random()*50,life:1.1,max:1.1});
    const ok=(typeof v30ForgeAllowed==='function')&&!!v30ForgeAllowed();
    if(ok&&typeof v30ForgeOpen==='function'){ v30ForgeOpen(); return true; }
    sectLifeSay('Lò luyện khí chỉ khai hỏa được trong Thanh Thạch Thôn.');
    return true;
  }
  if(pt.act==='master'){
    if(s.master<SECT_LIFE_LIMITS.master){
      s.master=1;
      const tip=SECT_LIFE_TIPS[((s.tip%SECT_LIFE_TIPS.length)+SECT_LIFE_TIPS.length)%SECT_LIFE_TIPS.length];
      s.tip=(s.tip+1)%SECT_LIFE_TIPS.length;
      sectLifeXP(15);
      R.talk=tip; R.talkT=5;
      sectLifeSay('Giáo đầu chỉ điểm: “'+tip+'” · +15 tu vi'+sectLifeCount(1,1)+'.');
      sectLifeSave();
      return true;
    }
    if(typeof v42tOpen==='function') v42tOpen();
    return true;
  }
  if(pt.act==='incense'){
    if(s.incense>=SECT_LIFE_LIMITS.incense){
      sectLifeSay('Hôm nay đã thắp hương'+sectLifeCount(s.incense,1)+(s.incenseUntil>now?' — khói hương còn vấn vương.':'.')+' Mai hãy quay lại.');
      return true;
    }
    s.incense=1; s.incenseUntil=now+SECT_LIFE_BURN;
    sectLifeXP(10);
    const b=SECT_LIFE_BLESS[((s.day%SECT_LIFE_BLESS.length)+SECT_LIFE_BLESS.length)%SECT_LIFE_BLESS.length];
    sectLifeSay('Thắp nén hương trước Đại điện · '+b+' · +10 tu vi'+sectLifeCount(1,1)+'.');
    sectLifeSave();
    return true;
  }
  return false;
}

/* ---- cập nhật (FRAME_HOOKS.update) ---- */
function sectLifeTick(dt){
  if(!sectLifeActive()) return;
  dt=Math.min(Math.max(Number(dt)||0.016,0),0.1);
  const R=sectLifeRun(), s=sectLifeState(), now=sectLifeNow();
  R.clock+=dt;
  R.flareT=Math.max(0,R.flareT-dt);
  R.talkT=Math.max(0,R.talkT-dt);
  for(const k in R.pickT) R.pickT[k]=Math.max(0,R.pickT[k]-dt);
  /* khói nhang */
  const ic=sectLifePt('incense');
  R.spawn.smoke-=dt;
  if(s.incenseUntil>now&&R.spawn.smoke<=0&&sectLifeInCam(ic.x,ic.y,200)){
    R.spawn.smoke=0.32;
    sectLifeAddFx(R.smoke,SECT_LIFE_MAX_SMOKE,{x:ic.x+Math.random()*10-5,y:ic.y-126,vx:Math.random()*6-3,vy:-16-Math.random()*6,life:3.4,max:3.4,size:3+Math.random()*2});
  }
  /* đốm lửa lò */
  const fu=sectLifePt('furnace');
  R.spawn.ember-=dt;
  if(R.spawn.ember<=0&&sectLifeInCam(fu.x,fu.y,200)){
    R.spawn.ember=R.flareT>0?0.06:0.45;
    sectLifeAddFx(R.fx,SECT_LIFE_MAX_FX,{kind:'ember',x:fu.x+Math.random()*16-8,y:fu.y-126,vx:Math.random()*14-7,vy:-30-Math.random()*25-(R.flareT>0?40:0),life:1,max:1});
  }
  /* hơi nước + gợn linh tuyền */
  const sp=sectLifePt('spring');
  R.spawn.steam-=dt; R.spawn.ripple-=dt;
  if(sectLifeInCam(sp.x,sp.y,200)){
    if(R.spawn.steam<=0){ R.spawn.steam=0.5; sectLifeAddFx(R.fx,SECT_LIFE_MAX_FX,{kind:'steam',x:sp.x+Math.random()*60-30,y:sp.y-40+Math.random()*10-5,vx:Math.random()*6-3,vy:-12-Math.random()*6,life:2.4,max:2.4}); }
    if(R.spawn.ripple<=0){ R.spawn.ripple=1.1; sectLifeAddFx(R.ripples,8,{x:sp.x+Math.random()*50-25,y:sp.y-40+Math.random()*10-5,r:3,life:1.6,max:1.6}); }
  }
  for(const q of R.smoke){ q.life-=dt; q.x+=q.vx*dt+Math.sin(R.clock*1.7+q.y*0.05)*6*dt; q.y+=q.vy*dt; q.size+=2.2*dt; }
  for(const q of R.fx){ q.life-=dt; q.x+=q.vx*dt; q.y+=q.vy*dt; if(q.kind==='leaf') q.vy+=60*dt; }
  for(const q of R.ripples){ q.life-=dt; q.r+=14*dt; }
  R.smoke=R.smoke.filter(function(q){ return q.life>0; });
  R.fx=R.fx.filter(function(q){ return q.life>0; });
  R.ripples=R.ripples.filter(function(q){ return q.life>0; });
}

/* ---- họa tiết thủ tục (cache canvas phụ, vẽ 1 lần mỗi loại) ---- */
function sectLifeSprite(key,w,h,ax,ay,paint){
  if(sectLifeSprites[key]!==undefined) return sectLifeSprites[key];
  if(typeof document==='undefined'||!document||!document.createElement){ sectLifeSprites[key]=null; return null; }
  const c=document.createElement('canvas');
  c.width=w; c.height=h;
  const d=c.getContext&&c.getContext('2d');
  if(!d){ sectLifeSprites[key]=null; return null; }
  paint(d,w,h);
  sectLifeSprites[key]={c:c,ax:ax,ay:ay};
  return sectLifeSprites[key];
}
function sectLifeBlit(key,w,h,ax,ay,paint,x,y){
  const sp=sectLifeSprite(key,w,h,ax,ay,paint);
  if(sp) g.drawImage(sp.c,Math.round(x-sp.ax),Math.round(y-sp.ay));
  return !!sp;
}
function sectLifeLG(d,x0,y0,x1,y1,stops){
  const gr=d.createLinearGradient(x0,y0,x1,y1);
  for(const st of stops) gr.addColorStop(st[0],st[1]);
  return gr;
}
/* Đỉnh hương đồng ba chân trên bệ đá (neo đáy giữa). */
function sectPaintCenser(d,w,h){
  const cx=w/2;
  d.fillStyle='rgba(0,0,0,.28)'; d.beginPath(); d.ellipse(cx,h-6,40,8,0,0,TAU); d.fill();
  d.fillStyle=sectLifeLG(d,0,h-26,0,h-6,[[0,'#8b8477'],[1,'#4c463d']]);
  d.beginPath(); d.moveTo(cx-38,h-24); d.lineTo(cx+38,h-24); d.lineTo(cx+42,h-8); d.lineTo(cx-42,h-8); d.closePath(); d.fill();
  d.strokeStyle='rgba(30,26,22,.7)'; d.lineWidth=1.2; d.stroke();
  d.strokeStyle='rgba(239,230,212,.25)'; d.beginPath(); d.moveTo(cx-37,h-23); d.lineTo(cx+37,h-23); d.stroke();
  d.fillStyle='#4a3420';
  for(const lx of [-20,0,20]){ d.beginPath(); d.moveTo(cx+lx-4,h-46); d.lineTo(cx+lx+4,h-46); d.lineTo(cx+lx+3,h-24); d.lineTo(cx+lx-3,h-24); d.closePath(); d.fill(); }
  d.fillStyle=sectLifeLG(d,cx-30,0,cx+30,0,[[0,'#4f361f'],[0.35,'#a9854b'],[0.55,'#c9a86a'],[1,'#4a321c']]);
  d.beginPath(); d.moveTo(cx-30,h-72); d.bezierCurveTo(cx-34,h-46,cx-22,h-40,cx,h-40); d.bezierCurveTo(cx+22,h-40,cx+34,h-46,cx+30,h-72); d.closePath(); d.fill();
  d.strokeStyle='#2e2016'; d.lineWidth=1.5; d.stroke();
  d.strokeStyle='rgba(201,168,106,.55)'; d.lineWidth=1;
  for(let i=-24;i<=18;i+=7){ d.beginPath(); d.moveTo(cx+i,h-60); d.lineTo(cx+i+3,h-56); d.lineTo(cx+i+6,h-60); d.stroke(); }
  d.beginPath(); d.moveTo(cx-29,h-64); d.lineTo(cx+29,h-64); d.stroke();
  d.fillStyle=sectLifeLG(d,cx-34,0,cx+34,0,[[0,'#5a3d22'],[0.5,'#b8945a'],[1,'#5a3d22']]);
  d.beginPath(); d.ellipse(cx,h-72,34,8,0,0,TAU); d.fill(); d.strokeStyle='#2e2016'; d.stroke();
  d.fillStyle='#3c3632'; d.beginPath(); d.ellipse(cx,h-72,28,5.5,0,0,TAU); d.fill();
  d.fillStyle='rgba(190,182,170,.55)'; d.beginPath(); d.ellipse(cx,h-71,22,3.5,0,0,TAU); d.fill();
  d.strokeStyle='#8a6a3c'; d.lineWidth=3.5;
  d.beginPath(); d.moveTo(cx-24,h-74); d.lineTo(cx-24,h-86); d.lineTo(cx-14,h-86); d.stroke();
  d.beginPath(); d.moveTo(cx+24,h-74); d.lineTo(cx+24,h-86); d.lineTo(cx+14,h-86); d.stroke();
}
/* Lò luyện khí: bệ đá, thân đồng hình đỉnh, mái chóp, miệng lửa (lửa vẽ động). */
function sectPaintFurnace(d,w,h){
  const cx=w/2;
  d.fillStyle='rgba(0,0,0,.3)'; d.beginPath(); d.ellipse(cx,h-6,48,10,0,0,TAU); d.fill();
  d.fillStyle=sectLifeLG(d,0,h-24,0,h-4,[[0,'#7c766b'],[1,'#47423a']]);
  d.beginPath(); d.rect(cx-44,h-24,88,18); d.fill(); d.strokeStyle='rgba(28,24,20,.7)'; d.lineWidth=1.2; d.stroke();
  d.strokeStyle='rgba(28,24,20,.45)'; d.beginPath(); d.moveTo(cx-14,h-24); d.lineTo(cx-14,h-6); d.moveTo(cx+18,h-24); d.lineTo(cx+18,h-6); d.stroke();
  d.fillStyle=sectLifeLG(d,cx-36,0,cx+36,0,[[0,'#3e2a18'],[0.3,'#8a6a3c'],[0.5,'#b08a4e'],[1,'#3a2715']]);
  d.beginPath(); d.moveTo(cx-34,h-24); d.lineTo(cx-38,h-80); d.quadraticCurveTo(cx,h-92,cx+38,h-80); d.lineTo(cx+34,h-24); d.closePath(); d.fill();
  d.strokeStyle='#24180e'; d.lineWidth=1.6; d.stroke();
  d.strokeStyle='rgba(201,168,106,.5)'; d.lineWidth=1;
  d.beginPath(); d.moveTo(cx-36,h-70); d.quadraticCurveTo(cx,h-78,cx+36,h-70); d.stroke();
  d.beginPath(); d.moveTo(cx-35,h-34); d.lineTo(cx+35,h-34); d.stroke();
  d.fillStyle='#d9bb7a';
  for(const rx of [-28,-14,14,28]){ d.beginPath(); d.arc(cx+rx,h-74,1.6,0,TAU); d.fill(); }
  d.fillStyle='#1a120c';
  d.beginPath(); d.moveTo(cx-15,h-34); d.lineTo(cx-15,h-52); d.quadraticCurveTo(cx,h-66,cx+15,h-52); d.lineTo(cx+15,h-34); d.closePath(); d.fill();
  d.strokeStyle='#c9a86a'; d.lineWidth=1.2; d.stroke();
  d.fillStyle=sectLifeLG(d,cx-30,0,cx+30,0,[[0,'#3a2715'],[0.5,'#9c7a44'],[1,'#3a2715']]);
  d.beginPath(); d.moveTo(cx-30,h-84); d.quadraticCurveTo(cx-6,h-100,cx-6,h-112); d.lineTo(cx+6,h-112); d.quadraticCurveTo(cx+6,h-100,cx+30,h-84); d.closePath(); d.fill();
  d.strokeStyle='#24180e'; d.stroke();
  d.fillStyle='#2a1c10'; d.beginPath(); d.ellipse(cx,h-112,7,2.5,0,0,TAU); d.fill();
  d.strokeStyle='#8a6a3c'; d.lineWidth=4;
  d.beginPath(); d.arc(cx-40,h-60,7,Math.PI*0.5,Math.PI*1.5); d.stroke();
  d.beginPath(); d.arc(cx+40,h-60,7,-Math.PI*0.5,Math.PI*0.5); d.stroke();
}
/* Linh tuyền: vành đá rêu + mặt nước sâu, vòi đá nhỏ (neo tâm hồ). */
function sectPaintSpring(d,w,h){
  const cx=w/2, cy=h/2+4;
  d.fillStyle='rgba(0,0,0,.25)'; d.beginPath(); d.ellipse(cx,cy+6,70,24,0,0,TAU); d.fill();
  const water=d.createRadialGradient(cx-10,cy-4,4,cx,cy,62);
  water.addColorStop(0,'#7d97a0'); water.addColorStop(0.45,'#3f5a66'); water.addColorStop(1,'#1d2c35');
  d.fillStyle=water; d.beginPath(); d.ellipse(cx,cy,60,20,0,0,TAU); d.fill();
  d.strokeStyle='rgba(239,230,212,.25)'; d.lineWidth=1;
  d.beginPath(); d.ellipse(cx-8,cy-3,30,7,0,Math.PI*1.1,Math.PI*1.8); d.stroke();
  let seed=7;
  const rnd=function(){ seed=(seed*9301+49297)%233280; return seed/233280; };
  for(let i=0;i<22;i++){
    const a=i/22*TAU, rx=Math.cos(a)*63+cx, ry=Math.sin(a)*22+cy, rr=5+rnd()*5;
    const sg=d.createLinearGradient(rx,ry-rr,rx,ry+rr);
    sg.addColorStop(0,'#a39b8c'); sg.addColorStop(1,'#544e44');
    d.fillStyle=sg; d.beginPath(); d.ellipse(rx,ry,rr*1.3,rr*0.8,a,0,TAU); d.fill();
    d.strokeStyle='rgba(30,26,22,.5)'; d.lineWidth=0.8; d.stroke();
    if(rnd()<0.45){ d.fillStyle='rgba(98,122,72,.75)'; d.beginPath(); d.ellipse(rx,ry-rr*0.5,rr*0.8,rr*0.35,0,0,TAU); d.fill(); }
  }
  d.fillStyle=sectLifeLG(d,0,cy-46,0,cy-18,[[0,'#9a9284'],[1,'#4f493f']]);
  d.beginPath(); d.moveTo(cx+30,cy-18); d.lineTo(cx+34,cy-42); d.quadraticCurveTo(cx+48,cy-50,cx+58,cy-38); d.lineTo(cx+60,cy-16); d.closePath(); d.fill();
  d.strokeStyle='rgba(30,26,22,.6)'; d.stroke();
  d.fillStyle='rgba(98,122,72,.8)'; d.beginPath(); d.ellipse(cx+46,cy-44,10,4,0,0,TAU); d.fill();
}
/* Khóm dược thảo đầy lá + nụ vàng nhạt; và mầm non sau khi hái. */
function sectPaintHerb(d,w,h){
  const cx=w/2, by=h-6;
  d.fillStyle='rgba(0,0,0,.22)'; d.beginPath(); d.ellipse(cx,by,24,6,0,0,TAU); d.fill();
  d.fillStyle='#5a4632'; d.beginPath(); d.ellipse(cx,by-1,18,4,0,0,TAU); d.fill();
  const leaves=[[-0.95,30],[-0.6,36],[-0.25,40],[0.1,42],[0.45,38],[0.8,34],[1.1,26],[-1.2,22]];
  for(const lf of leaves){
    const a=lf[0]-Math.PI/2, len=lf[1];
    const tx=cx+Math.cos(a)*len, ty=by+Math.sin(a)*len;
    d.fillStyle=sectLifeLG(d,cx,by,tx,ty,[[0,'#3d5530'],[0.6,'#6f8f52'],[1,'#9fbc78']]);
    d.beginPath(); d.moveTo(cx,by-2);
    d.quadraticCurveTo(cx+Math.cos(a+0.5)*len*0.55,by+Math.sin(a+0.5)*len*0.55,tx,ty);
    d.quadraticCurveTo(cx+Math.cos(a-0.5)*len*0.55,by+Math.sin(a-0.5)*len*0.55,cx,by-2);
    d.fill();
    d.strokeStyle='rgba(30,42,22,.55)'; d.lineWidth=0.8; d.stroke();
  }
  for(const bd of [[-8,-38],[6,-44],[16,-32],[-16,-28]]){
    const gl=d.createRadialGradient(cx+bd[0],by+bd[1],0,cx+bd[0],by+bd[1],6);
    gl.addColorStop(0,'rgba(240,226,170,.9)'); gl.addColorStop(1,'rgba(240,226,170,0)');
    d.fillStyle=gl; d.beginPath(); d.arc(cx+bd[0],by+bd[1],6,0,TAU); d.fill();
    d.fillStyle='#e8d9a0'; d.beginPath(); d.arc(cx+bd[0],by+bd[1],2.2,0,TAU); d.fill();
  }
}
function sectPaintSprout(d,w,h){
  const cx=w/2, by=h-4;
  d.fillStyle='rgba(0,0,0,.2)'; d.beginPath(); d.ellipse(cx,by,14,4,0,0,TAU); d.fill();
  d.fillStyle=sectLifeLG(d,0,by-6,0,by+2,[[0,'#6e563d'],[1,'#47372a']]);
  d.beginPath(); d.ellipse(cx,by-1,13,4.5,0,0,TAU); d.fill();
  d.strokeStyle='#5d7a44'; d.lineWidth=1.6; d.beginPath(); d.moveTo(cx,by-2); d.lineTo(cx,by-12); d.stroke();
  d.fillStyle='#86a862';
  d.beginPath(); d.ellipse(cx-5,by-13,5,2.4,-0.5,0,TAU); d.fill();
  d.beginPath(); d.ellipse(cx+5,by-14,5,2.4,0.5,0,TAU); d.fill();
}
/* Cọc bùa gỗ có mái che nhỏ + tấm bài (neo đáy giữa). */
function sectPaintWardPost(d,w,h){
  const cx=w/2;
  d.fillStyle='rgba(0,0,0,.25)'; d.beginPath(); d.ellipse(cx,h-5,16,5,0,0,TAU); d.fill();
  d.fillStyle=sectLifeLG(d,cx-5,0,cx+5,0,[[0,'#3a2a1c'],[0.5,'#7a5a3a'],[1,'#3a2a1c']]);
  d.fillRect(cx-4,h-80,8,76);
  d.fillStyle=sectLifeLG(d,0,h-74,0,h-30,[[0,'#6b4e31'],[1,'#4a3522']]);
  d.beginPath(); d.rect(cx-14,h-74,28,44); d.fill(); d.strokeStyle='#24180e'; d.lineWidth=1.4; d.stroke();
  d.strokeStyle='rgba(201,168,106,.55)'; d.lineWidth=1; d.strokeRect(cx-11,h-71,22,38);
  d.fillStyle=sectLifeLG(d,0,h-92,0,h-78,[[0,'#5a3d24'],[1,'#2e2016']]);
  d.beginPath(); d.moveTo(cx-20,h-78); d.quadraticCurveTo(cx,h-96,cx+20,h-78); d.closePath(); d.fill();
  d.strokeStyle='#1a120c'; d.stroke();
}
/* Lá bùa giấy vàng, nét chu sa (neo tâm). */
function sectPaintTalisman(d,w,h){
  d.fillStyle=sectLifeLG(d,0,0,0,h,[[0,'#efdc98'],[1,'#d8bf72']]);
  d.fillRect(2,2,w-4,h-4);
  d.strokeStyle='rgba(120,90,40,.6)'; d.lineWidth=1; d.strokeRect(2.5,2.5,w-5,h-5);
  d.strokeStyle='#9c2b22'; d.lineWidth=1.6; d.lineCap='round';
  const cx=w/2;
  d.beginPath(); d.moveTo(cx-5,7); d.lineTo(cx+5,7); d.moveTo(cx,7); d.lineTo(cx,h-8); d.stroke();
  d.beginPath(); d.moveTo(cx-6,14); d.quadraticCurveTo(cx+7,17,cx-4,22); d.quadraticCurveTo(cx+8,26,cx-5,31); d.stroke();
  d.beginPath(); d.arc(cx,h-12,3.5,0,TAU); d.stroke();
}
/* Giáo đầu: áo luyện công sẫm, đai vàng, búi tóc, râu, gậy (neo chân). */
function sectPaintMaster(d,w,h){
  const cx=w/2, by=h-6;
  d.fillStyle='rgba(0,0,0,.28)'; d.beginPath(); d.ellipse(cx,by+2,18,6,0,0,TAU); d.fill();
  d.strokeStyle='#5a4028'; d.lineWidth=4; d.lineCap='round';
  d.beginPath(); d.moveTo(cx+22,by); d.lineTo(cx+22,by-110); d.stroke();
  d.strokeStyle='#c9a86a'; d.lineWidth=2; d.beginPath(); d.moveTo(cx+22,by-104); d.lineTo(cx+22,by-110); d.stroke();
  d.fillStyle=sectLifeLG(d,cx-18,0,cx+18,0,[[0,'#262a33'],[0.5,'#474d5a'],[1,'#262a33']]);
  d.beginPath(); d.moveTo(cx-12,by-74); d.quadraticCurveTo(cx-22,by-30,cx-18,by); d.lineTo(cx+18,by); d.quadraticCurveTo(cx+22,by-30,cx+12,by-74); d.closePath(); d.fill();
  d.strokeStyle='#14110e'; d.lineWidth=1.2; d.stroke();
  d.fillStyle='#e9dfc8'; d.beginPath(); d.moveTo(cx-6,by-76); d.lineTo(cx,by-62); d.lineTo(cx+6,by-76); d.closePath(); d.fill();
  d.fillStyle='#c9a86a'; d.fillRect(cx-15,by-50,30,5);
  d.fillStyle='#8a6a3c'; d.fillRect(cx-3,by-46,4,14);
  d.fillStyle=sectLifeLG(d,0,by-74,0,by-40,[[0,'#3a404c'],[1,'#262a33']]);
  d.beginPath(); d.ellipse(cx-16,by-58,6,15,0.25,0,TAU); d.fill();
  d.beginPath(); d.ellipse(cx+16,by-58,6,15,-0.35,0,TAU); d.fill();
  d.fillStyle='#d9b48a'; d.beginPath(); d.arc(cx+20,by-60,4,0,TAU); d.fill();
  const sk=d.createRadialGradient(cx-3,by-90,2,cx,by-88,12);
  sk.addColorStop(0,'#efcfa6'); sk.addColorStop(1,'#c99d74');
  d.fillStyle=sk; d.beginPath(); d.arc(cx,by-88,11,0,TAU); d.fill();
  d.fillStyle='#2a2420'; d.beginPath(); d.arc(cx,by-91,11.5,Math.PI*1.05,Math.PI*1.95); d.fill();
  d.beginPath(); d.arc(cx,by-103,5,0,TAU); d.fill();
  d.fillStyle='#c9a86a'; d.fillRect(cx-6,by-104,12,2);
  d.fillStyle='#d8d2c6'; d.beginPath(); d.moveTo(cx-5,by-82); d.quadraticCurveTo(cx,by-68,cx+5,by-82); d.closePath(); d.fill();
  d.fillStyle='#1d1a17'; d.fillRect(cx-5,by-90,2.5,1.6); d.fillRect(cx+2.5,by-90,2.5,1.6);
}

/* ---- vẽ ---- */
function sectLifeLabel(text,x,y){
  g.font='13px sans-serif'; g.textAlign='center';
  const w=(g.measureText?g.measureText(text).width:text.length*7)+18;
  g.fillStyle='rgba(20,17,14,.85)';
  g.beginPath(); if(g.roundRect) g.roundRect(x-w/2,y-18,w,24,6); else g.rect(x-w/2,y-18,w,24); g.fill();
  g.strokeStyle='rgba(201,168,106,.7)'; g.lineWidth=1; g.stroke();
  g.fillStyle='#efe6d4'; g.fillText(text,x,y-1);
}
function sectLifeHeroDist(x,y){
  if(typeof V47T==='undefined'||!V47T) return Infinity;
  return Math.hypot(x-V47T.x,y-V47T.y);
}
/* Gọi từ cuối townLifeDrawEntries (PATCH 3): thêm mục 'sect' vào y-sort. */
function sectLifeDrawEntries(push,inside){
  if(!sectLifeActive()||typeof push!=='function') return;
  const s=sectLifeState(), day=sectLifeDay();
  const inn=(typeof inside==='function')?inside:function(){ return true; };
  for(const pt of SECT_LIFE_POINTS){
    if(!inn(pt.x,pt.y)) continue;
    /* y-sort: neo hơi bắc điểm đứng nhưng luôn > y của công trình phía sau. */
    const sy={ward:pt.y-6,herb:pt.y-12,spring:pt.y-60,furnace:pt.y-14,master:pt.y-24,incense:pt.y-26}[pt.act];
    push(sy,{type:'sect',act:pt.act,pt:pt});
  }
  if(s.wardDay===day&&s.ward>0){
    const L=sectLifeLayout(), cave=L&&(L.points||[]).find(function(q){ return q.id==='v31_cave'; });
    if(cave&&inn(cave.x,cave.y)) push(cave.y+1,{type:'sect',act:'wardDoor',x:cave.x,y:cave.y-118,kindW:s.wardKind});
  }
}
/* Vẽ 1 mục 'sect' (PATCH 4), trong ngữ cảnh translate(-cam) của townDrawWorld. */
function sectLifeDrawEntry(it){
  if(!it||it.type!=='sect') return;
  const R=sectLifeRun(), s=sectLifeState(), now=sectLifeNow(), night=sectLifeIsNight(), clk=R.clock;
  if(it.act==='wardDoor'){
    const pulse=0.55+0.45*Math.sin(clk*2.2);
    const gl=g.createRadialGradient(it.x,it.y,2,it.x,it.y,46);
    gl.addColorStop(0,'rgba(240,210,140,'+(0.32*pulse+(night?0.12:0))+')'); gl.addColorStop(1,'rgba(240,210,140,0)');
    g.fillStyle=gl; g.beginPath(); g.arc(it.x,it.y,46,0,TAU); g.fill();
    sectLifeBlit('talisman',24,48,12,24,sectPaintTalisman,it.x,it.y);
    return;
  }
  const pt=it.pt;
  if(!pt) return;
  const near=sectLifeHeroDist(pt.x,pt.y);
  if(it.act==='ward'){
    const bx=pt.x, by=pt.y-6;
    sectLifeBlit('wardpost',48,100,24,96,sectPaintWardPost,bx,by);
    if(s.wardDay===sectLifeDay()&&s.ward>0){
      const pulse=0.55+0.45*Math.sin(clk*2.2+1);
      const gl=g.createRadialGradient(bx,by-52,1,bx,by-52,26);
      gl.addColorStop(0,'rgba(240,210,140,'+(0.4*pulse)+')'); gl.addColorStop(1,'rgba(240,210,140,0)');
      g.fillStyle=gl; g.beginPath(); g.arc(bx,by-52,26,0,TAU); g.fill();
      sectLifeBlit('talisman',24,48,12,24,sectPaintTalisman,bx,by-52);
    }
    for(const q of R.fx) if(q.kind==='spark'&&Math.abs(q.x-pt.x)<60&&Math.abs(q.y-pt.y)<140){
      g.fillStyle='rgba(240,214,150,'+Math.max(0,q.life/q.max)+')'; g.beginPath(); g.arc(q.x,q.y,2,0,TAU); g.fill();
    }
    if(near<120) sectLifeLabel(pt.name,bx,by-108);
    return;
  }
  if(it.act==='herb'){
    const until=Number(s.regrow[pt.id])||0, by=pt.y-12;
    const sway=Math.sin(clk*1.4+pt.x*0.03)*1.5;
    if(until>now) sectLifeBlit('sprout',36,24,18,20,sectPaintSprout,pt.x,by);
    else sectLifeBlit('herb',64,56,32,50,sectPaintHerb,pt.x+sway,by);
    for(const q of R.fx) if(q.kind==='leaf'&&Math.abs(q.x-pt.x)<60&&Math.abs(q.y-pt.y)<100){
      g.fillStyle='rgba(134,168,98,'+Math.max(0,q.life/q.max)+')';
      g.beginPath(); g.ellipse(q.x,q.y,3.5,1.6,q.x*0.1,0,TAU); g.fill();
    }
    if(near<120) sectLifeLabel(until>now?pt.name+' · đang mọc lại':pt.name,pt.x,by-56);
    return;
  }
  if(it.act==='spring'){
    const cx=pt.x, cy=pt.y-40;
    sectLifeBlit('spring',150,70,75,39,sectPaintSpring,cx,cy);
    const sh=0.5+0.5*Math.sin(clk*1.1);
    g.strokeStyle='rgba(239,230,212,'+(0.12+0.1*sh)+')'; g.lineWidth=1;
    g.beginPath(); g.ellipse(cx-6,cy-2,24+sh*4,5,0,Math.PI*1.15,Math.PI*1.85); g.stroke();
    for(const r of R.ripples){
      const al=Math.max(0,r.life/r.max)*0.45;
      g.strokeStyle='rgba(220,228,226,'+al+')'; g.lineWidth=1.2;
      g.beginPath(); g.ellipse(r.x,r.y,r.r,r.r*0.34,0,0,TAU); g.stroke();
    }
    g.strokeStyle='rgba(220,228,226,.5)'; g.lineWidth=1.5;
    g.beginPath(); g.moveTo(cx+42,cy-22); g.quadraticCurveTo(cx+36,cy-14,cx+34,cy-4+Math.sin(clk*6)*0.8); g.stroke();
    for(const q of R.fx) if(q.kind==='steam'){
      const al=Math.max(0,q.life/q.max);
      g.fillStyle='rgba(235,232,224,'+(al*0.18)+')';
      g.beginPath(); g.arc(q.x,q.y,6+(1-al)*8,0,TAU); g.fill();
    }
    if(near<120) sectLifeLabel(pt.name,cx,cy-38);
    return;
  }
  if(it.act==='furnace'){
    const bx=pt.x, by=pt.y-14;
    sectLifeBlit('furnace',112,124,56,118,sectPaintFurnace,bx,by);
    const fl=R.flareT>0?R.flareT/1.5:0;
    const flick=0.75+0.25*Math.sin(clk*11)+0.1*Math.sin(clk*23);
    const my=by-40, mr=18+fl*26;
    const gl=g.createRadialGradient(bx,my,1,bx,my,mr+(night?14:0));
    gl.addColorStop(0,'rgba(255,196,110,'+(0.75*flick)+')'); gl.addColorStop(0.5,'rgba(232,120,48,'+(0.35+0.3*fl)+')'); gl.addColorStop(1,'rgba(232,120,48,0)');
    g.fillStyle=gl; g.beginPath(); g.arc(bx,my,mr+(night?14:0),0,TAU); g.fill();
    g.fillStyle='rgba(255,170,70,'+(0.8*flick)+')';
    const fh=10+fl*22;
    for(let i=-1;i<=1;i++){
      const tx=bx+i*6+Math.sin(clk*9+i)*2;
      g.beginPath(); g.moveTo(tx-5,by-20); g.quadraticCurveTo(tx-4,by-20-fh*0.6,tx,by-20-fh*(1-Math.abs(i)*0.3)); g.quadraticCurveTo(tx+4,by-20-fh*0.6,tx+5,by-20); g.closePath(); g.fill();
    }
    if(fl>0){
      const tg=g.createRadialGradient(bx,by-112,1,bx,by-112,20*fl+6);
      tg.addColorStop(0,'rgba(255,190,100,'+(0.6*fl)+')'); tg.addColorStop(1,'rgba(255,190,100,0)');
      g.fillStyle=tg; g.beginPath(); g.arc(bx,by-112,20*fl+6,0,TAU); g.fill();
    }
    for(const q of R.fx) if(q.kind==='ember'&&Math.abs(q.x-pt.x)<80&&q.y<pt.y&&q.y>pt.y-300){
      g.fillStyle='rgba(255,176,86,'+Math.max(0,q.life/q.max)+')'; g.beginPath(); g.arc(q.x,q.y,1.8,0,TAU); g.fill();
    }
    if(near<120) sectLifeLabel(pt.name,bx,by-130);
    return;
  }
  if(it.act==='master'){
    const bx=pt.x, by=pt.y-24, bob=Math.sin(clk*1.6)*0.8;
    sectLifeBlit('master',64,128,32,122,sectPaintMaster,bx,by+bob);
    if(near<260) sectLifeLabel('Giáo đầu',bx,by-122);
    if(R.talkT>0&&R.talk){
      const tw=Math.min(420,(g.measureText?g.measureText(R.talk).width:R.talk.length*7)+24);
      g.font='13px sans-serif'; g.textAlign='center';
      g.fillStyle='rgba(20,17,14,.85)';
      g.beginPath(); if(g.roundRect) g.roundRect(bx-tw/2,by-176,tw,28,6); else g.rect(bx-tw/2,by-176,tw,28); g.fill();
      g.strokeStyle='rgba(201,168,106,.7)'; g.lineWidth=1; g.stroke();
      g.fillStyle='#efe6d4'; g.fillText(R.talk,bx,by-157);
    }
    return;
  }
  if(it.act==='incense'){
    const bx=pt.x, by=pt.y-26;
    sectLifeBlit('censer',96,100,48,96,sectPaintCenser,bx,by);
    const burning=s.incenseUntil>now;
    const left=burning?Math.max(0,Math.min(1,(s.incenseUntil-now)/SECT_LIFE_BURN)):0;
    const top=by-72;
    for(let i=-1;i<=1;i++){
      const sx=bx+i*7, len=burning?10+24*left:6;
      g.strokeStyle=burning?'#8a5a3a':'#5a4030'; g.lineWidth=1.6;
      g.beginPath(); g.moveTo(sx,top); g.lineTo(sx+i*1.5,top-len); g.stroke();
      if(burning){
        const ex=sx+i*1.5, ey=top-len, gl=0.7+0.3*Math.sin(clk*5+i);
        if(night){
          const hg=g.createRadialGradient(ex,ey,0,ex,ey,22);
          hg.addColorStop(0,'rgba(255,180,100,'+(0.28*gl)+')'); hg.addColorStop(1,'rgba(255,180,100,0)');
          g.fillStyle=hg; g.beginPath(); g.arc(ex,ey,22,0,TAU); g.fill();
        }
        g.fillStyle='rgba(255,92,52,'+gl+')'; g.beginPath(); g.arc(ex,ey,1.8,0,TAU); g.fill();
      }
    }
    if(burning&&night){
      const wg=g.createRadialGradient(bx,by-60,4,bx,by-60,70);
      wg.addColorStop(0,'rgba(255,190,110,.16)'); wg.addColorStop(1,'rgba(255,190,110,0)');
      g.fillStyle=wg; g.beginPath(); g.arc(bx,by-60,70,0,TAU); g.fill();
    }
    for(const q of R.smoke){
      const al=Math.max(0,q.life/q.max);
      g.fillStyle='rgba(226,222,212,'+(al*0.32)+')';
      g.beginPath(); g.arc(q.x,q.y,q.size,0,TAU); g.fill();
    }
    if(near<120) sectLifeLabel(pt.name,bx,by-112);
    return;
  }
}

/* ---- đăng ký điểm móc ---- */
if(typeof FRAME_HOOKS!=='undefined'&&FRAME_HOOKS&&FRAME_HOOKS.update) FRAME_HOOKS.update.push(sectLifeTick);

/* ===== [Claude ghép 22/11] khớp bố cục sơn môn bản 3 + sprite thật GÓI 07 =====
   Muse làm trên toạ độ thôn cũ (3200x1800) → đặt lại điểm theo layout; công trình đã có ảnh vẽ tay
   (phù ấn, luống dược, linh tuyền, lò rèn, đỉnh hương) nên bỏ hình thủ tục, chỉ giữ hiệu ứng (khói, lửa, gợn, lá, sáng). */
(function(){
  const L=(typeof DATA!=='undefined'&&DATA.town_layout)||null; if(!L||!(L.version>=3)) return;
  const O=function(id){ return (L.objects||[]).find(function(o){ return o.id===id; }); };
  const at=function(id,dx,dy){ const o=O(id); return o?{x:o.x+dx,y:o.y+dy}:null; };
  const pos={ward:at('p_cave_seal',-160,140), herb_1:at('herb_bed_0',0,24), herb_2:at('herb_bed_1',0,24),
             spring:at('p_spring',0,45), furnace:at('b_forge',300,40), master:{x:3700,y:2060}, incense:at('p_incense',0,30)};
  SECT_LIFE_POINTS=SECT_LIFE_POINTS.filter(function(q){ return q.id!=='herb_3'; });
  for(const q of SECT_LIFE_POINTS){ const P=pos[q.id]; if(P){ q.x=P.x; q.y=P.y; } }
  const SKIP={wardpost:1,herb:1,sprout:1,spring:1,furnace:1,censer:1};
  const blit0=sectLifeBlit;
  sectLifeBlit=function(key,w,h,ax,ay,paint,x,y){ if(SKIP[key]) return true; return blit0(key,w,h,ax,ay,paint,x,y); };
})();
