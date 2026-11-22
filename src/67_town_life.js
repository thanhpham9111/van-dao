'use strict';
/* ============================================================================
   M3 (GÓI 04) — Thôn sống động + tương tác "Thanh Thạch Thôn"
   Theo ops/MUSE_BATCH_04.md mục M3 + ops/newbie_map_25d.md §2 (CHỈ §2 Sống
   động & tương tác; §1 chiều sâu 4 lớp/ánh sáng là việc khác, KHÔNG làm).

   ẢNH: dân làng/động vật chưa có asset -> vẽ giữ chỗ (người = elip thân +
   tròn đầu, cao 104 px; gà/chim = chấm nhỏ có cánh đập). Khi asset về, thay
   ở townLifeDrawEntry, không đổi hành vi.

   NỐI VÀO GAME (không bọc đè hàm nào):
   - FRAME_HOOKS.update (src/01_core.js): townLifeTick — cập nhật mỗi frame.
   - Vẽ qua danh sách y-sort của M2: PATCH src/65_town_map.js
     (townBuildDrawList gọi townLifeDrawEntries; townDrawWorld gọi
     townLifeDrawEntry cho kind 'life').
   - Nhấn E: PATCH src/48_v48_v47.js v47tInteract — kiểm townLifeNear()
     trước v471Near(); dock v471Dock hiện tên điểm M3 khi lại gần.
   - TOWN_NEW=false -> module không vẽ/không chạy (townLifeActive() false).

   GIỜ/NGÀY (theo code game có sẵn, không bịa đơn vị khác):
   - giờ = (p.worldTime%360)/15 (0-24), như src/04 hdSun + src/38_save.js:36.
   - ngày = Math.floor(p.worldTime/360), như v13Day() (src/09_v13_v8.js:31).
   - đêm = giờ >= 19 hoặc giờ < 5, như b04EventTime (src/55_events.js:27).
   - bướm chỉ ban ngày, đom đóm chỉ ban đêm.

   SAVE: trường mới duy nhất p.townLife = {day, well, fish} (đếm/ngày, reset
   khi ngày đổi). Save cũ thiếu p.townLife -> khởi tạo mặc định khi dùng.
   Trạng thái chạy (dân làng, hạt, ngồi/câu...) chỉ sống trong bộ nhớ.

   Hồi máu ghế đá: 36 máu/giây khi ngồi = x3 mức hồi 12 máu/giây ở thôn
   trong worldUpdate (src/03_v8_v22.js:67). Trong cảnh thôn V47T, update
   live không tự hồi máu nên ngồi ghế là cách hồi duy nhất tại chỗ.
   Câu cá trúng: +1 linh thảo qua v13Adjust('herb',1) (src/09) nếu có,
   nếu không thì +1 vào túi p.v13.bag, cuối cùng mới +3 linh thạch.
   ========================================================================== */
var townLifeWarned = false;   // đã console.warn DATA thiếu (chỉ 1 lần)
var townLife = null;          // trạng thái chạy (không lưu save)
var TOWN_LIFE_MAX_PARTICLES = 120;
var TOWN_LIFE_MAX_TRACKS = 40;

/* ---- điều kiện chạy ---- */
function townLifeLayout(){
  if(typeof townLayout==='function'){ const L=townLayout(); if(L) return L; }
  if(typeof DATA!=='undefined'&&DATA) return DATA.town_layout||null;
  return null;
}
function townLifeActive(){
  if(typeof TOWN_NEW==='undefined'||!TOWN_NEW) return false;
  if(typeof townMapReady!=='function'||!townMapReady()) return false;
  if(typeof v47tIsActive!=='function'||!v47tIsActive()) return false;
  return !!p;
}
function townLifeDay(){ return Math.floor(((p&&p.worldTime)||0)/360); }
function townLifeHour(){ return (((p&&p.worldTime)||0)%360)/15; }
function townLifeNight(){ const h=townLifeHour(); return h>=19||h<5; }
/* Đếm/ngày trong save (khởi tạo mặc định khi thiếu; reset khi đổi ngày). */
function townLifeState(){
  if(!p) return {day:0,well:0,fish:0};
  if(!p.townLife||typeof p.townLife!=='object') p.townLife={day:townLifeDay(),well:0,fish:0};
  if(p.townLife.day!==townLifeDay()){ p.townLife.day=townLifeDay(); p.townLife.well=0; p.townLife.fish=0; }
  return p.townLife;
}
function townLifeInCam(x,y,m){
  if(typeof V47T==='undefined'||!V47T||!V47T.cam) return true;
  m=m||0;
  return x>=V47T.cam.x-m&&x<=V47T.cam.x+W+m&&y>=V47T.cam.y-m&&y<=V47T.cam.y+H+m;
}
function townLifeBlocked(x,y){
  if(typeof townBlocked==='function') return townBlocked(x,y,14);
  return x<0||y<0||x>3200||y>1800;
}
/* Bước thử theo hướng (dx,dy): thử x rồi y để trượt dọc tường.
   Chỉ tính là thành công khi vị trí THẬT SỰ đổi (bước 0 ở một trục mà
   trục kia bị chặn thì vẫn là thất bại — nếu không nhánh tránh/tìm đường
   tưởng đã đi được và không thử hướng khác). */
function townLifeTryStep(a,dx,dy,step){
  const d=Math.hypot(dx,dy);
  if(d<0.001) return false;
  const nx=a.x+dx/d*step, ny=a.y+dy/d*step, ox=a.x, oy=a.y;
  if(!townLifeBlocked(nx,a.y)) a.x=nx;
  if(!townLifeBlocked(a.x,ny)) a.y=ny;
  return Math.hypot(a.x-ox,a.y-oy)>0.001;
}
/* Thử bước theo 8 hướng (thoát kẹt góc); trả true nếu dịch chuyển. */
function townLifeStepAny(a,step){
  const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(const dd of dirs){ if(townLifeTryStep(a,dd[0],dd[1],step)) return true; }
  return false;
}
/* Di chuyển có va chạm (thử x rồi y). Trả true khi tới đích. */
function townLifeMove(a,tx,ty,dt,speed){
  const dx=tx-a.x, dy=ty-a.y, d=Math.hypot(dx,dy);
  if(d<2) return true;
  const step=Math.min(d,speed*dt);
  if(townLifeTryStep(a,dx,dy,step)) return Math.hypot(tx-a.x,ty-a.y)<3;
  /* Kẹt góc (vd khe giữa hàng rào và bảng ủy thác): thử 8 hướng để thoát ra. */
  townLifeStepAny(a,step);
  return Math.hypot(tx-a.x,ty-a.y)<3;
}

/* ---- khởi tạo runtime ---- */
function townLifeInit(){
  const L=townLifeLayout();
  const st={
    clock:0, sitting:false, bellT:0,
    fishing:{active:false,state:'idle',t:0,biteT:0,pt:null,bobber:null},
    villagers:[], animals:{chickens:[],dogs:[],cats:[],ducks:[],birds:[],butterflies:[],fireflies:[]},
    particles:[], ripples:[], tracks:[],
    spawnT:{leaf:0,smoke:0,ember:0,dust:0,ripple:0,fish:6+Math.random()*6},
    footT:0, bubbleT:0
  };
  townLife=st;
  if(!L) return st;
  /* Dân làng: 5 người, mỗi người một nhà (điểm về đêm). */
  const defs=[
    {name:'Bà Tư', home:{x:1600,y:600}, col:'#a34d3a', skin:'#e8c39a'},
    {name:'Ông Sáu', home:{x:380,y:1240}, col:'#5d6b4a', skin:'#d9b48a'},
    {name:'Cô Lan', home:{x:760,y:1140}, col:'#7a5a8a', skin:'#e8c39a'},
    {name:'Anh Ba', home:{x:2520,y:1560}, col:'#4a6b7a', skin:'#d9b48a'},
    {name:'Bé Na', home:{x:640,y:800}, col:'#c98a3a', skin:'#f0cba0'}
  ];
  for(let i=0;i<defs.length;i++){
    const d=defs[i];
    const v={name:d.name,home:d.home,col:d.col,skin:d.skin,
      x:d.home.x+(Math.random()*80-40), y:d.home.y+40+Math.random()*40,
      path:0, wp:0, target:0, dest:null, destT:-99, wait:Math.random()*4,
      bubble:null, bubbleT:4+Math.random()*8, speed:52+Math.random()*14, seed:Math.random()*10};
    /* Đặt lên điểm đường gần nhà nhất để bắt đầu đi theo paths. */
    let best=null;
    (L.paths||[]).forEach(function(pa,pi){
      pa.points.forEach(function(pt,wi){
        const dd=Math.hypot(pt[0]-v.x,pt[1]-v.y);
        if(!best||dd<best.d) best={d:dd,path:pi,wp:wi};
      });
    });
    if(best){ v.path=best.path; v.wp=best.wp; v.target=best.wp; }
    /* Điểm spawn lỡ rơi vào va chạm (vd ngay trước cửa tiệm) thì kéo về
       mốc đường gần nhất — mốc đường luôn đi được theo thiết kế layout. */
    if(townLifeBlocked(v.x,v.y)&&best){ const pa=L.paths[best.path].points[best.wp]; v.x=pa[0]; v.y=pa[1]; }
    st.villagers.push(v);
  }
  /* Động vật. */
  const field={x:880,y:1620};
  for(let i=0;i<4;i++) st.animals.chickens.push({x:field.x+Math.random()*220-110, y:field.y+Math.random()*120-40, tx:field.x, ty:field.y, wait:Math.random()*2, peck:Math.random()*6, seed:Math.random()*10});
  st.animals.dogs.push({x:1560,y:640,home:{x:1560,y:640},wait:6,seed:1});
  st.animals.dogs.push({x:820,y:1120,home:{x:820,y:1120},wait:3,seed:2});
  st.animals.cats.push({x:700,y:760,home:{x:700,y:760},wait:8,seed:3});
  st.animals.cats.push({x:2340,y:1000,home:{x:2340,y:1000},wait:5,seed:4});
  for(let i=0;i<3;i++) st.animals.ducks.push({x:500+i*700,y:1400,dir:i%2?1:-1,seed:Math.random()*10});
  for(let i=0;i<5;i++){
    const spots=[[1100,1180],[1500,1250],[900,1500],[2400,1250],[1700,1150]];
    st.animals.birds.push({x:spots[i][0],y:spots[i][1],state:'ground',vx:0,vy:0,flyT:0,seed:Math.random()*10});
  }
  for(let i=0;i<6;i++) st.animals.butterflies.push({x:700+Math.random()*1400,y:900+Math.random()*600,phase:Math.random()*10,seed:Math.random()*10});
  for(let i=0;i<8;i++) st.animals.fireflies.push({x:400+Math.random()*2400,y:600+Math.random()*900,phase:Math.random()*10,seed:Math.random()*10});
  return st;
}
/* Điểm đến theo giờ của một dân làng (đổi khi giờ đổi). */
function townLifeDestFor(v,hour){
  const L=townLifeLayout();
  const pt=function(id){ const q=(L&&L.points||[]).find(function(z){ return z.id===id; }); return q?{x:q.x,y:q.y}:null; };
  if(hour>=19||hour<5) return {x:v.home.x, y:v.home.y+30, name:'về nhà'};
  if(hour>=5&&hour<9){ const q=pt('v13_market'); return q?{x:q.x,y:q.y,name:'chợ'}:{x:1100,y:1220,name:'chợ'}; }
  if(hour>=9&&hour<12){ const q=pt('well_1'); return q?{x:q.x,y:q.y+30,name:'giếng'}:{x:1600,y:1060,name:'giếng'}; }
  if(hour>=12&&hour<15){ const q=pt('v13_farm'); return q?{x:q.x,y:q.y,name:'ruộng'}:{x:880,y:1620,name:'ruộng'}; }
  const q=pt('v13_market');
  return q?{x:q.x,y:q.y,name:'chợ'}:{x:1100,y:1220,name:'chợ'};
}
/* Chọn đường (paths) + mốc gần điểm đến nhất cho dân làng. */
function townLifePickPath(v,dest){
  const L=townLifeLayout();
  let best=null;
  (L.paths||[]).forEach(function(pa,pi){
    pa.points.forEach(function(pt,wi){
      const dd=Math.hypot(pt[0]-dest.x,pt[1]-dest.y);
      if(!best||dd<best.d) best={d:dd,path:pi,wp:wi};
    });
  });
  if(!best) return;
  v.path=best.path; v.target=best.wp;
  /* Mốc hiện tại = mốc gần vị trí đang đứng nhất trên đường đã chọn. */
  const pa=L.paths[v.path];
  let bi=0, bd=Infinity;
  pa.points.forEach(function(pt,wi){ const dd=Math.hypot(pt[0]-v.x,pt[1]-v.y); if(dd<bd){ bd=dd; bi=wi; } });
  v.wp=bi;
}

/* ---- điểm tương tác (E) ---- */
function townLifePoints(){
  const L=townLifeLayout();
  if(!L) return [];
  return (L.points||[]).filter(function(pt){ return pt.kind==='bench'||pt.kind==='bell'||pt.kind==='well'||pt.kind==='fishing'; });
}
function townLifeNear(radius){
  if(!townLifeActive()) return null;
  const r=radius||95;
  let best=null, bd=r;
  for(const pt of townLifePoints()){
    const d=Math.hypot(pt.x-V47T.x,pt.y-V47T.y);
    if(d<bd){ bd=d; best=pt; }
  }
  return best;
}
function townLifeFlushBirds(){
  if(!townLife) return;
  for(const b of townLife.animals.birds){
    if(b.state!=='ground') continue;
    const a=Math.random()*TAU;
    b.state='fly'; b.vx=Math.cos(a)*260; b.vy=Math.sin(a)*260-160; b.flyT=1.4+Math.random()*0.8;
  }
}
function townLifeCatchFish(){
  const st=townLifeState(), f=townLife.fishing;
  st.fish++;
  let got=false;
  if(typeof v13Adjust==='function'){ try{ got=!!v13Adjust('herb',1); }catch(e){ got=false; } }
  if(!got&&p.v13&&p.v13.bag){ p.v13.bag.herb=(p.v13.bag.herb||0)+1; got=true; }
  if(!got) p.stones=(p.stones||0)+3;
  f.active=false; f.state='idle'; f.t=0; f.bobber=null;
  message(got?'Câu được cá linh · +1 linh thảo ('+st.fish+'/5 hôm nay).':'Câu được cá · +3 linh thạch ('+st.fish+'/5 hôm nay).');
  if(typeof save==='function') save();
  return true;
}
function townLifeInteract(pt){
  if(!pt||!townLife) return false;
  const st=townLifeState();
  if(pt.kind==='bench'){
    if(townLife.sitting){ townLife.sitting=false; message('Đứng dậy khỏi ghế đá.'); }
    else { townLife.sitting=true; message('Ngồi nghỉ trên ghế đá · hồi máu nhanh hơn.'); }
    return true;
  }
  if(pt.kind==='bell'){
    townLife.bellT=1.2;
    townLifeFlushBirds();
    message('Tiếng chuông vang khắp thôn · chim bay tán loạn.');
    return true;
  }
  if(pt.kind==='well'){
    if(st.well>=3){ message('Giếng hôm nay đã múc đủ 3 lần. Mai hãy quay lại.'); return true; }
    st.well++;
    const s=(typeof currentStats==='function')?currentStats():null;
    p.mp=Math.min(s?s.mp:999,(p.mp||0)+10);
    message('Múc nước giếng · +10 linh lực ('+st.well+'/3 hôm nay).');
    if(typeof save==='function') save();
    return true;
  }
  if(pt.kind==='fishing'){
    const f=townLife.fishing;
    if(f.active&&f.state==='bite') return townLifeCatchFish();
    if(f.active&&f.state==='waiting'){ message('Chưa có cá cắn câu… chờ phao chìm rồi nhấn E.'); return true; }
    if(st.fish>=5){ message('Hôm nay đã câu đủ 5 con. Mai hãy quay lại.'); return true; }
    f.active=true; f.state='waiting'; f.t=1.5+Math.random()*2.5; f.biteT=0;
    f.pt={x:pt.x,y:pt.y}; f.bobber={x:pt.x+30,y:pt.y+75};
    message('Đã thả câu… chờ phao chìm rồi nhấn E.');
    return true;
  }
  return false;
}

/* ---- hạt ---- */
function townLifeAddParticle(pt){
  if(!townLife||townLife.particles.length>=TOWN_LIFE_MAX_PARTICLES) return;
  townLife.particles.push(pt);
}
function townLifeAddTrack(x,y){
  if(!townLife) return;
  townLife.tracks.push({x:x,y:y,a:1});
  while(townLife.tracks.length>TOWN_LIFE_MAX_TRACKS) townLife.tracks.shift();
}
function townLifeAddRipple(x,y){
  if(!townLife||townLife.ripples.length>24) return;
  townLife.ripples.push({x:x,y:y,r:6,life:1.6,max:1.6});
}

/* ---- cập nhật mỗi frame (FRAME_HOOKS.update) ---- */
function townLifeTick(dt){
  if(typeof TOWN_NEW==='undefined'||!TOWN_NEW) return; /* cờ M2 tắt: im lặng */
  const L0=townLifeLayout();
  if(!L0){
    if(!townLifeWarned){ townLifeWarned=true; console.warn('[M3] DATA.town_layout thiếu — tắt thôn sống động.'); }
    return;
  }
  if(!townLifeActive()){
    if(townLife) townLife.sitting=false;
    return;
  }
  const L=L0;
  if(!townLife) townLifeInit();
  dt=Math.min(dt||0.016,0.12);
  const t=townLife, hour=townLifeHour(), night=townLifeNight();
  t.clock+=dt;
  t.bellT=Math.max(0,t.bellT-dt);
  townLifeState(); /* reset đếm/ngày khi ngày đổi */
  const modalOpen=(typeof modal!=='undefined')?!!modal:false;

  /* Ngồi ghế: hồi 36 máu/giây; đứng dậy khi di chuyển hoặc mở bảng. */
  if(t.sitting){
    if(V47T.moving||modalOpen){ t.sitting=false; if(V47T.moving) message('Đứng dậy khỏi ghế đá.'); }
    else{
      const s=(typeof currentStats==='function')?currentStats():null;
      if(s) p.hp=Math.min(s.hp,(p.hp||0)+36*dt);
      else p.hp=(p.hp||0)+36*dt;
    }
  }
  /* Câu cá: chờ phao chìm -> cửa sổ cắn câu 0,9 giây -> lỡ thì chờ lại.
     Đi xa khỏi bến (>220 px) thì tự thu cần. */
  const f=t.fishing;
  if(f.active){
    if(Math.hypot(V47T.x-f.pt.x,V47T.y-f.pt.y)>220){ f.active=false; f.state='idle'; f.bobber=null; message('Thu cần câu lại.'); }
    else if(f.state==='waiting'){ f.t-=dt; if(f.t<=0){ f.state='bite'; f.biteT=0.9; message('Phao chìm! Nhấn E ngay!'); } }
    else if(f.state==='bite'){ f.biteT-=dt; if(f.biteT<=0){ f.state='waiting'; f.t=1.5+Math.random()*2.5; message('Cá thoát mất… chờ lần sau.'); } }
  }

  /* Dân làng: đi theo paths tới điểm đến theo giờ, tránh người chơi. */
  const chatter=L.chatter||[];
  for(const v of t.villagers){
    v.bubbleT-=dt;
    if(v.bubble&&((v.bubble.t-=dt)<=0)) v.bubble=null;
    /* Tránh người chơi trong vòng 46 px — kể cả khi đang đứng chờ. */
    const dp=Math.hypot(v.x-V47T.x,v.y-V47T.y);
    if(dp<46&&dp>0.01){
      const ax=(v.x-V47T.x)/dp, ay=(v.y-V47T.y)/dp;
      if(!townLifeTryStep(v,ax,ay,70*dt)){
        if(!townLifeTryStep(v,ay,ax,70*dt)&&!townLifeTryStep(v,-ay,-ax,70*dt)) townLifeStepAny(v,70*dt);
      }
      continue;
    }
    if(v.wait>0){ v.wait-=dt; continue; }
    if(!v.dest||t.clock-v.destT>20){ v.dest=townLifeDestFor(v,hour); v.destT=t.clock; townLifePickPath(v,v.dest); }
    if(Math.hypot(v.dest.x-v.x,v.dest.y-v.y)<70){ v.wait=4+Math.random()*6; v.dest=null; continue; }
    const pa=L.paths[v.path];
    if(!pa) continue;
    const wp=pa.points[v.wp];
    if(!wp) continue;
    if(townLifeMove(v,wp[0],wp[1],dt,v.speed)){
      if(v.wp<v.target) v.wp++;
      else if(v.wp>v.target) v.wp--;
    }
    /* Bong bóng thoại khi đi ngang người chơi (<230 px). */
    if(!v.bubble&&v.bubbleT<=0&&dp<230&&chatter.length){
      v.bubble={text:chatter[Math.floor(Math.random()*chatter.length)],t:3};
      v.bubbleT=8+Math.random()*10;
    }
  }

  /* Động vật. */
  for(const c of t.animals.chickens){
    c.peck-=dt;
    if(c.wait>0){ c.wait-=dt; continue; }
    if(Math.hypot(c.tx-c.x,c.ty-c.y)<8){
      if(c.peck<=0){ c.peck=1+Math.random()*2; }
      c.tx=880+Math.random()*220-110; c.ty=1620+Math.random()*120-40;
      c.wait=0.6+Math.random()*1.6;
    } else townLifeMove(c,c.tx,c.ty,dt,42);
  }
  for(const d of t.animals.dogs.concat(t.animals.cats)){
    d.wait-=dt;
    if(d.wait<=0){ d.wait=6+Math.random()*8; const nx=d.home.x+Math.random()*40-20, ny=d.home.y+Math.random()*24-12; if(!townLifeBlocked(nx,ny)){ d.x=nx; d.y=ny; } }
  }
  for(const d of t.animals.ducks){
    d.x+=d.dir*22*dt;
    if(d.x<380) d.dir=1;
    if(d.x>3100) d.dir=-1;
    d.y=1400+Math.sin(t.clock*0.9+d.seed)*10;
  }
  for(const b of t.animals.birds){
    if(b.state==='fly'){
      b.flyT-=dt; b.x+=b.vx*dt; b.y+=b.vy*dt; b.vy+=260*dt;
      if(b.flyT<=0){
        b.state='ground'; b.x=Math.max(60,Math.min(3140,b.x)); b.y=Math.max(120,Math.min(1740,b.y));
        if(townLifeBlocked(b.x,b.y)){ b.x=1100; b.y=1180; }
      }
      continue;
    }
    if(Math.hypot(b.x-V47T.x,b.y-V47T.y)<140){
      const a=Math.atan2(b.y-V47T.y,b.x-V47T.x);
      b.state='fly'; b.vx=Math.cos(a)*260; b.vy=Math.sin(a)*160-160; b.flyT=1.4+Math.random()*0.8;
    }
  }
  for(const b of t.animals.butterflies){
    b.phase+=dt;
    b.x+=Math.sin(b.phase*0.9+b.seed)*26*dt+12*dt;
    b.y+=Math.cos(b.phase*1.3+b.seed)*18*dt;
  }
  for(const fl of t.animals.fireflies){
    fl.phase+=dt;
    fl.x+=Math.sin(fl.phase*0.7+fl.seed)*20*dt;
    fl.y+=Math.cos(fl.phase*0.9+fl.seed)*14*dt;
  }

  /* Hạt: lá/cánh hoa theo gió (từ cây anh đào), khói ống khói, tàn lửa lò rèn. */
  const wind=Math.sin(t.clock*0.5)*14+10;
  t.spawnT.leaf-=dt;
  if(t.spawnT.leaf<=0){
    t.spawnT.leaf=0.5;
    const cherries=(L.objects||[]).filter(function(o){ return o.asset&&o.asset.indexOf('t_cherry')===0; });
    if(cherries.length&&!night){
      const c=cherries[Math.floor(Math.random()*cherries.length)];
      if(townLifeInCam(c.x,c.y,300)) townLifeAddParticle({kind:Math.random()<0.5?'leaf':'petal',x:c.x,y:c.y-c.h*0.6,vx:wind,vy:10+Math.random()*8,life:6,max:6,size:4+Math.random()*3});
    }
  }
  t.spawnT.smoke-=dt;
  if(t.spawnT.smoke<=0){
    t.spawnT.smoke=0.22;
    for(const s of (L.smoke||[])){
      if(townLifeInCam(s.x,s.y,300)) townLifeAddParticle({kind:'smoke',x:s.x+Math.random()*8-4,y:s.y,vx:wind*0.3,vy:-22-Math.random()*8,life:4,max:4,size:7+Math.random()*5});
    }
  }
  t.spawnT.ember-=dt;
  if(t.spawnT.ember<=0){
    t.spawnT.ember=0.3;
    if(townLifeInCam(380,1180,300)) townLifeAddParticle({kind:'ember',x:380+Math.random()*30-15,y:1140,vx:Math.random()*10-5,vy:-34-Math.random()*20,life:1.2,max:1.2,size:2.5});
  }
  /* Bụi chân + dấu chân khi người chơi di chuyển trên đất. */
  t.spawnT.dust-=dt;
  if(V47T.moving){
    if(t.spawnT.dust<=0){ t.spawnT.dust=0.14; if(townLifeInCam(V47T.x,V47T.y,0)) townLifeAddParticle({kind:'dust',x:V47T.x,y:V47T.y-4,vx:-wind*0.2,vy:-8,life:0.8,max:0.8,size:5}); }
    t.footT-=dt;
    if(t.footT<=0){ t.footT=0.4; townLifeAddTrack(V47T.x,V47T.y); }
  }
  for(const tr of t.tracks) tr.a=Math.max(0,tr.a-dt/7);
  t.tracks=t.tracks.filter(function(tr){ return tr.a>0; });
  /* Nước: vòng sóng khi người chơi ở bờ/cầu; cá nhảy ngẫu nhiên. */
  t.spawnT.ripple-=dt;
  if(V47T.y>1300&&V47T.y<1500&&t.spawnT.ripple<=0){ t.spawnT.ripple=0.5; townLifeAddRipple(V47T.x,V47T.y+6); }
  t.spawnT.fish-=dt;
  if(t.spawnT.fish<=0){
    t.spawnT.fish=6+Math.random()*8;
    const fx=300+Math.random()*2600;
    if(townLifeInCam(fx,1400,300)){
      townLifeAddParticle({kind:'fish',x:fx,y:1400,vx:0,vy:-150,life:0.9,max:0.9,size:9});
      townLifeAddRipple(fx,1400);
    }
  }
  /* Cập nhật hạt + vòng sóng (chỉ trong khung camera + 300 px). */
  for(const pt of t.particles){
    pt.life-=dt; pt.x+=pt.vx*dt; pt.y+=pt.vy*dt;
    if(pt.kind==='smoke'){ pt.size+=6*dt; pt.vx+=Math.sin(t.clock+pt.x*0.01)*2*dt; }
    if(pt.kind==='fish'){ pt.vy+=420*dt; }
    if(pt.kind==='leaf'||pt.kind==='petal'){ pt.vx+=Math.sin(t.clock*2+pt.y*0.02)*6*dt; }
  }
  t.particles=t.particles.filter(function(pt){ return pt.life>0&&townLifeInCam(pt.x,pt.y,300); });
  for(const r of t.ripples){ r.life-=dt; r.r+=26*dt; }
  t.ripples=t.ripples.filter(function(r){ return r.life>0; });
}

/* ---- vẽ qua danh sách y-sort của M2 (PATCH src/65) ---- */
/* Gọi từ townBuildDrawList (đã lọc theo khung camera + 200): thêm các mục
   kind 'life' vào danh sách, vẫn xếp theo y chân. */
function townLifeDrawEntries(list,vx0,vy0,vx1,vy1){
  if(!townLifeActive()) return;
  if(!townLife) townLifeInit();
  const t=townLife, L=townLifeLayout();
  if(!L) return;
  const inside=function(x,y){ return x>=vx0-100&&x<=vx1+100&&y>=vy0-100&&y<=vy1+100; };
  const push=function(y,life){ list.push({kind:'life',y:y,life:life}); };
  for(const v of t.villagers) if(inside(v.x,v.y)) push(v.y,{type:'villager',v:v});
  for(const c of t.animals.chickens) if(inside(c.x,c.y)) push(c.y,{type:'chicken',a:c});
  for(const d of t.animals.dogs) if(inside(d.x,d.y)) push(d.y,{type:'dog',a:d});
  for(const d of t.animals.cats) if(inside(d.x,d.y)) push(d.y,{type:'cat',a:d});
  for(const d of t.animals.ducks) if(inside(d.x,d.y)) push(d.y,{type:'duck',a:d});
  for(const b of t.animals.birds) if(inside(b.x,b.y)) push(b.y,{type:'bird',a:b});
  if(!townLifeNight()) for(const b of t.animals.butterflies) if(inside(b.x,b.y)) push(b.y,{type:'butterfly',a:b});
  if(townLifeNight()) for(const fl of t.animals.fireflies) if(inside(fl.x,fl.y)) push(fl.y,{type:'firefly',a:fl});
  for(const tr of t.tracks) if(inside(tr.x,tr.y)) push(tr.y+1,{type:'track',tr:tr});
  for(const r of t.ripples) if(inside(r.x,r.y)) push(r.y+2,{type:'ripple',r:r});
  for(const pt of t.particles) if(inside(pt.x,pt.y)) push(pt.y,{type:'particle',pt:pt});
  /* Vật tương tác có hình: ghế đá, chuông, phao câu; cửa mở khi lại gần. */
  for(const pt of (L.points||[])){
    if(pt.kind==='bench'&&inside(pt.x,pt.y)) push(pt.y,{type:'bench',pt:pt});
    if(pt.kind==='bell'&&inside(pt.x,pt.y)) push(pt.y,{type:'bell',pt:pt});
    if(pt.kind==='door'&&inside(pt.x,pt.y)) push(pt.y,{type:'door',pt:pt,open:Math.hypot(pt.x-V47T.x,pt.y-V47T.y)<160});
  }
  if(t.fishing.active&&t.fishing.bobber) push(t.fishing.bobber.y,{type:'bobber',f:t.fishing});
  /* Cỏ/bụi rung: đối tượng có sway:true — lá động khi gió, rung mạnh khi
     người chơi đi qua gần (<120 px). */
  for(const o of (L.objects||[])){
    if(!o.sway) continue;
    if(!inside(o.x,o.y)) continue;
    push(o.y,{type:'sway',o:o});
  }
}
/* Vẽ 1 mục kind 'life' (đã ở trong ngữ cảnh translate(-cam) của townDrawWorld). */
function townLifeDrawEntry(e){
  const it=e.life, t=townLife;
  if(!it) return;
  if(it.type==='villager'){
    const v=it.v, x=v.x, y=v.y;
    g.fillStyle='rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(x,y+2,16,6,0,0,TAU); g.fill();
    g.fillStyle=v.col; g.beginPath(); g.ellipse(x,y-42,16,34,0,0,TAU); g.fill();
    g.fillStyle=v.skin; g.beginPath(); g.arc(x,y-88,12,0,TAU); g.fill();
    g.fillStyle='#2e2422'; g.beginPath(); g.arc(x,y-92,12,Math.PI,TAU); g.fill();
    if(Math.hypot(x-V47T.x,y-V47T.y)<260){
      g.fillStyle='#efe6d4'; g.font='12px sans-serif'; g.textAlign='center';
      g.fillText(v.name,x,y-112);
    }
    if(v.bubble){
      const w=g.measureText?g.measureText(v.bubble.text).width+18:120;
      g.fillStyle='rgba(20,17,14,.85)';
      g.beginPath(); g.roundRect(x-w/2,y-152,w,26,6); g.fill();
      g.strokeStyle='#c9a86a'; g.lineWidth=1; g.stroke();
      g.fillStyle='#efe6d4'; g.font='13px sans-serif'; g.textAlign='center';
      g.fillText(v.bubble.text,x,y-139);
    }
    return;
  }
  if(it.type==='chicken'){
    const a=it.a, flap=Math.sin(t.clock*10+a.seed)*0.9;
    g.fillStyle='#e8dcc0'; g.beginPath(); g.ellipse(a.x,a.y-6,8,6,0,0,TAU); g.fill();
    g.beginPath(); g.arc(a.x+6,a.y-13,4,0,TAU); g.fill();
    g.strokeStyle='#c9a86a'; g.lineWidth=1.5;
    g.beginPath(); g.moveTo(a.x,a.y-8); g.lineTo(a.x-8,a.y-12-flap*4); g.stroke();
    return;
  }
  if(it.type==='dog'||it.type==='cat'){
    const a=it.a, s=it.type==='dog'?1:0.65;
    g.fillStyle=it.type==='dog'?'#8a6f4d':'#6b6b6b';
    g.beginPath(); g.ellipse(a.x,a.y-8,22*s,8*s,0,0,TAU); g.fill();
    g.beginPath(); g.arc(a.x+18*s,a.y-14*s,7*s,0,TAU); g.fill();
    return;
  }
  if(it.type==='duck'){
    const a=it.a;
    g.fillStyle='#e8e0c8'; g.beginPath(); g.ellipse(a.x,a.y,10,7,0,0,TAU); g.fill();
    g.fillStyle='#5d7a4a'; g.beginPath(); g.arc(a.x+8,a.y-6,4.5,0,TAU); g.fill();
    return;
  }
  if(it.type==='bird'){
    const a=it.a;
    if(a.state==='fly'){
      const flap=Math.sin(t.clock*22+a.seed)*0.9;
      g.strokeStyle='#3a2f24'; g.lineWidth=2;
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(a.x-10,a.y-8-flap*8); g.stroke();
      g.beginPath(); g.moveTo(a.x,a.y); g.lineTo(a.x+10,a.y-8+flap*8); g.stroke();
      g.fillStyle='#5d4a33'; g.beginPath(); g.arc(a.x,a.y,4,0,TAU); g.fill();
    }else{
      g.fillStyle='#6b543a'; g.beginPath(); g.arc(a.x,a.y-4,4,0,TAU); g.fill();
      g.strokeStyle='#6b543a'; g.lineWidth=1.5;
      g.beginPath(); g.moveTo(a.x,a.y-4); g.lineTo(a.x-6,a.y-8); g.stroke();
    }
    return;
  }
  if(it.type==='butterfly'){
    const a=it.a, flap=Math.sin(t.clock*14+a.seed)*0.8;
    g.fillStyle='#e8a0b8';
    g.beginPath(); g.ellipse(a.x-3,a.y-6-flap*3,4,2.5,-0.5,0,TAU); g.fill();
    g.beginPath(); g.ellipse(a.x+3,a.y-6+flap*3,4,2.5,0.5,0,TAU); g.fill();
    return;
  }
  if(it.type==='firefly'){
    const a=it.a, glow=0.5+0.5*Math.sin(t.clock*3+a.phase);
    g.fillStyle='rgba(255,233,160,'+(0.25*glow)+')'; g.beginPath(); g.arc(a.x,a.y,9,0,TAU); g.fill();
    g.fillStyle='#ffe9a0'; g.beginPath(); g.arc(a.x,a.y,3,0,TAU); g.fill();
    return;
  }
  if(it.type==='track'){
    const tr=it.tr;
    g.fillStyle='rgba(46,38,32,'+(tr.a*0.35)+')';
    g.beginPath(); g.ellipse(tr.x,tr.y,5,8,0,0,TAU); g.fill();
    return;
  }
  if(it.type==='ripple'){
    const r=it.r, al=Math.max(0,r.life/r.max)*0.5;
    g.strokeStyle='rgba(207,232,226,'+al+')'; g.lineWidth=2;
    g.beginPath(); g.ellipse(r.x,r.y,r.r,r.r*0.36,0,0,TAU); g.stroke();
    return;
  }
  if(it.type==='particle'){
    const pt=it.pt, al=Math.max(0,pt.life/pt.max);
    if(pt.kind==='leaf'||pt.kind==='petal'){
      g.save(); g.translate(pt.x,pt.y); g.rotate(pt.x*0.05);
      g.fillStyle=pt.kind==='leaf'?'rgba(125,143,102,'+al+')':'rgba(232,160,184,'+al+')';
      g.fillRect(-pt.size/2,-pt.size/4,pt.size,pt.size/2); g.restore();
    }else if(pt.kind==='smoke'){
      g.fillStyle='rgba(220,220,210,'+(al*0.28)+')';
      g.beginPath(); g.arc(pt.x,pt.y,pt.size,0,TAU); g.fill();
    }else if(pt.kind==='ember'){
      g.fillStyle='rgba(255,170,80,'+al+')';
      g.beginPath(); g.arc(pt.x,pt.y,pt.size,0,TAU); g.fill();
    }else if(pt.kind==='dust'){
      g.fillStyle='rgba(205,186,137,'+(al*0.4)+')';
      g.beginPath(); g.arc(pt.x,pt.y,pt.size,0,TAU); g.fill();
    }else if(pt.kind==='fish'){
      const h=Math.sin(Math.max(0,pt.life/pt.max)*Math.PI)*46;
      g.fillStyle='#c9a86a'; g.beginPath(); g.ellipse(pt.x,pt.y-h,pt.size,pt.size*0.4,0,0,TAU); g.fill();
      g.beginPath(); g.moveTo(pt.x-pt.size,pt.y-h); g.lineTo(pt.x-pt.size-7,pt.y-h-5); g.lineTo(pt.x-pt.size-7,pt.y-h+5); g.closePath(); g.fill();
    }
    return;
  }
  if(it.type==='bench'){
    const pt=it.pt;
    const bim=typeof townImg==='function'?townImg('p_bench_stone'):null;
    if(bim&&bim.ready&&bim.img){ const iw=bim.img.naturalWidth,ih=bim.img.naturalHeight,dw=120,dh=dw*ih/iw; g.drawImage(bim.img,pt.x-dw/2,pt.y-dh+6,dw,dh); return; }
    g.fillStyle='#8a8578'; g.fillRect(pt.x-42,pt.y-28,84,18);
    g.fillStyle='#6b6558'; g.fillRect(pt.x-36,pt.y-10,10,10); g.fillRect(pt.x+26,pt.y-10,10,10);
    return;
  }
  if(it.type==='bell'){
    const pt=it.pt, sw=t.bellT>0?Math.sin(t.clock*9)*0.35:Math.sin(t.clock*0.8)*0.03;
    const bl=typeof townImg==='function'?townImg('p_bell'):null;
    if(bl&&bl.ready&&bl.img){ const iw=bl.img.naturalWidth,ih=bl.img.naturalHeight,dw=150,dh=dw*ih/iw; g.save(); g.translate(pt.x,pt.y-dh*.62); g.rotate(sw*.25); g.drawImage(bl.img,-dw/2,-dh*.38,dw,dh); g.restore(); return; }
    g.save(); g.translate(pt.x,pt.y-70); g.rotate(sw);
    g.fillStyle='#c9a86a'; g.beginPath(); g.moveTo(-16,0); g.lineTo(-12,-34); g.lineTo(12,-34); g.lineTo(16,0); g.closePath(); g.fill();
    g.fillStyle='#8a6f3a'; g.beginPath(); g.arc(0,4,4,0,TAU); g.fill();
    g.restore();
    g.strokeStyle='#5d4a33'; g.lineWidth=4;
    g.beginPath(); g.moveTo(pt.x-20,pt.y); g.lineTo(pt.x-20,pt.y-104); g.stroke();
    g.beginPath(); g.moveTo(pt.x+20,pt.y); g.lineTo(pt.x+20,pt.y-104); g.stroke();
    return;
  }
  if(it.type==='door'){
    const pt=it.pt;
    g.fillStyle='#5d4a33'; g.fillRect(pt.x-26,pt.y-72,52,72);
    if(it.open){
      g.fillStyle='#2e2422'; g.fillRect(pt.x-20,pt.y-66,40,66);
      g.fillStyle='rgba(255,217,138,.75)'; g.fillRect(pt.x-20,pt.y-66,40,66);
      g.fillStyle='#7d6547';
      g.beginPath(); g.moveTo(pt.x+20,pt.y-66); g.lineTo(pt.x+38,pt.y-58); g.lineTo(pt.x+38,pt.y); g.lineTo(pt.x+20,pt.y); g.closePath(); g.fill();
    }else{
      g.fillStyle='#3a2f24'; g.fillRect(pt.x-20,pt.y-66,40,66);
    }
    return;
  }
  if(it.type==='bobber'){
    const f=it.f, b=f.bobber;
    g.strokeStyle='rgba(239,230,212,.7)'; g.lineWidth=1;
    g.beginPath(); g.moveTo(f.pt.x,f.pt.y); g.lineTo(b.x,b.y); g.stroke();
    g.fillStyle=f.state==='bite'?'#ff6a5a':'#e8e0c8';
    g.beginPath(); g.arc(b.x,b.y+(f.state==='bite'?5:0),5,0,TAU); g.fill();
    if(f.state==='bite'){ g.strokeStyle='rgba(207,232,226,.8)'; g.beginPath(); g.ellipse(b.x,b.y,12,5,0,0,TAU); g.stroke(); }
    return;
  }
  if(it.type==='sway'){
    const o=it.o;
    const near=Math.hypot(o.x-V47T.x,o.y-V47T.y)<120;
    const amp=near?6:2, ph=Math.sin(t.clock*1.3+o.x*0.05)*amp;
    const topY=o.asset&&o.asset.indexOf('t_bamboo')===0?o.y-o.h+50:o.y-52;
    g.strokeStyle='rgba(125,143,102,.85)'; g.lineWidth=2;
    for(let i=-1;i<=1;i++){
      g.beginPath(); g.moveTo(o.x+i*16,topY+18);
      g.lineTo(o.x+i*16+ph,topY-2-Math.abs(i)*4); g.stroke();
    }
    return;
  }
}

/* ---- đăng ký điểm móc ---- */
if(typeof FRAME_HOOKS!=='undefined'&&FRAME_HOOKS&&FRAME_HOOKS.update) FRAME_HOOKS.update.push(townLifeTick);
