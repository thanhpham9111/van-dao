'use strict';
// M2 · T13 HUD chiến đấu — lớp phủ game feel (src/62_combat_hud.js)
// Chỉ dùng điểm móc có sẵn (src/01_core.js): COMBAT_HOOKS.afterHit /
// afterPlayerDamage, FRAME_HOOKS.update / overlay. Không bọc đè hàm nào.
// Kiểu mực đêm: nền mực #14110e, chữ giấy #efe6d4, chỉ vàng #c9a86a,
// đỏ #f18474; KHÔNG xanh ngọc, KHÔNG khung bo tròn viền vàng.
//
// Phạm vi (theo spec ops/specs/hud_combat.md v1.3, phần giao cho M2):
//  - Số sát thương bay (thường / chí mạng / kết liễu / nhận đòn) với thời
//    lượng theo bảng §6, gộp đòn cùng mục tiêu trong 80ms, tối đa 36 số.
//  - Chuỗi đòn (combo): đếm đòn trúng liên tiếp trong 2,0 giây; mốc 5/10/15…
//    hiện chữ "LIÊN KÍCH ×N" giữa màn hình. (Bộ đếm "N liên kích" nhỏ ở
//    dock của v35Dock vẫn do game vẽ — module này không vẽ thêm bộ đếm
//    thường trực để tránh trùng.)
//  - Khoá mục tiêu: ngoặc góc vàng quanh mục tiêu đang chọn (v34Target) +
//    vòng chớp khi vừa trúng đòn. (Vòng ellipse dưới chân của
//    v35TargetRing vẫn giữ — đây là dấu khác, không trùng.)
//  - Viền đỏ mép màn hình + rung nhẹ ≤3px khi nhận sát thương (chỉ rung
//    các phần tử neo theo thế giới trong overlay, KHÔNG rung HUD; tắt hẳn
//    khi screenShake === false).
//  - Thanh boss đáy màn hình đúng toạ độ spec §5 (tên x360,y664,w322;
//    pha x692,y664,w152; % x854,y664,w66; khung x360,y684,w560,h12),
//    vẽ trong hệ toạ độ gốc của nhóm target (v35Group) nên tôn trọng
//    F2 (dời/scale/alpha) của nhóm này. Máu trễ: giữ 220ms rồi đuổi kịp
//    trong 400ms, tối đa trễ 350ms; hồi máu đuổi kịp trong 120ms.
//  - Chỉ hiện khi v45CombatHUD() true. Overlay vẽ chung cho cả hai đường
//    HUD (thôn v47tDraw + ngoài thôn v35Render) vì frameOverlay() chạy
//    sau draw() ở mọi chế độ.
// Cần 3 PATCH kèm theo (ops/patches/MUSE_03_M2.json): bỏ floating() số
// sát thương cũ trong hit_L00 / damagePlayer_L00 (tránh vẽ trùng số),
// và cho v35TargetNormal() bỏ qua boss sống (boss chỉ hiện ở thanh đáy).
// Không thêm trường save, không dùng DATA/ASSETS, không tạo phím mới.
const V62={
  ink:'#14110e',paper:'#efe6d4',gold:'#c9a86a',red:'#f18474',muted:'#b5a18b',
  clock:0,nums:[],combo:{n:0,until:0,e:null},milestone:null,
  vig:{t:0,dur:0.62},shake:{t:0,dur:0.12,amp:2.5},
  lockFlash:{e:null,t:0},
  boss:{e:null,delayed:null,holdT:0,lagStart:0,fade:0,deathT:0,phase:0,phaseFade:0},
  combatPrev:false,dbg:{shakeX:0,shakeY:0}
};
function v62BossRatio(e){
  if(!e||!isFinite(e.max)||e.max<=0)return 0;
  return clamp(e.hp/e.max,0,1);
}
function v62BossTarget(){
  if(typeof v34Target!=='function'||typeof bossType!=='function')return null;
  let e=null;
  try{e=v34Target();}catch(err){return null;}
  if(!e||e.dead||!bossType(e.type))return null;
  return e;
}
// Toạ độ màn hình (logic 1280×720) từ toạ độ thế giới/đấu trường.
function v62ScreenPos(x,y){
  try{
    if(p&&p.worldMode&&typeof hdPoint==='function')return hdPoint(x,y);
  }catch(err){}
  return {x:x,y:y};
}
// Điểm neo số bay lúc trúng đòn (kẹp khỏi vùng HUD trên/dưới).
function v62Anchor(o,up){
  const z=v62ScreenPos(o.x,o.y);
  const x=isFinite(z.x)?z.x:640, y=isFinite(z.y)?z.y:360;
  return {x:clamp(x,48,1232),y:clamp(y-(up||0),100,600)};
}
function v62OnHit(info){
  if(!info||!info.e||!p||mode!=='play')return;
  const e=info.e,lost=Math.max(0,info.lost||0),b=V62.boss;
  if(info.boss){
    if(b.e!==e){b.e=e;b.delayed=v62BossRatio(e);b.holdT=0;b.lagStart=0;}
    b.holdT=0.22;
    if(b.lagStart<=0)b.lagStart=V62.clock;
    if(info.killed)b.deathT=0.2;
  }
  if(lost<=0)return; // Đòn hụt / không gây sát thương: không số, không combo.
  const c=V62.combo;
  if(V62.clock<c.until&&c.e===e)c.n++;else c.n=1;
  c.until=V62.clock+2.0;c.e=e;
  if(c.n>=5&&c.n%5===0)V62.milestone={n:c.n,t:0.9};
  V62.lockFlash={e:e,t:0.15};
  const isSkill=!!(typeof V26!=='undefined'&&V26&&V26.action&&V26.action.kind==='skill');
  const kind=info.crit?'crit':(info.killed?'kill':'dmg');
  const life=(info.crit||info.killed)?0.76:(isSkill?0.68:0.58);
  for(const n of V62.nums){
    if(n.e===e&&n.kind===kind&&n.t<0.08){n.value+=lost;n.t=0;n.comboN=c.n;return;}
  }
  const z=v62Anchor(e,32);
  V62.nums.push({e:e,kind:kind,value:lost,crit:!!info.crit,killed:!!info.killed,
    x:z.x,y:z.y,t:0,life:life,comboN:c.n});
  if(V62.nums.length>36)V62.nums.splice(0,V62.nums.length-36);
}
function v62OnHurt(info){
  if(!info||!p||mode!=='play')return;
  const lost=Math.max(0,info.lost||0);
  if(lost<=0)return; // Đòn bị bỏ qua (dashT/hurt): không hiệu ứng.
  V62.vig={t:0.62,dur:0.62};
  if(typeof screenShake==='undefined'||screenShake!==false)
    V62.shake={t:0.12,dur:0.12,amp:2.5};
  const z=v62Anchor(p,55);
  V62.nums.push({e:null,kind:'hurt',value:lost,crit:false,killed:false,
    x:z.x,y:z.y,t:0,life:0.62,comboN:0});
  if(V62.nums.length>36)V62.nums.splice(0,V62.nums.length-36);
}
function v62Tick(dt){
  dt=clamp(dt||0,0,0.1);
  V62.clock+=dt;
  if(!p||mode!=='play'){
    V62.nums.length=0;V62.combo.n=0;V62.combo.e=null;V62.milestone=null;
    V62.vig.t=0;V62.shake.t=0;V62.lockFlash.t=0;
    V62.boss.fade=0;V62.boss.e=null;V62.boss.deathT=0;V62.combatPrev=false;
    return;
  }
  for(const n of V62.nums)n.t+=dt;
  V62.nums=V62.nums.filter(n=>n.t<n.life);
  if(V62.clock>V62.combo.until){V62.combo.n=0;V62.combo.e=null;}
  if(V62.milestone){V62.milestone.t-=dt;if(V62.milestone.t<=0)V62.milestone=null;}
  V62.vig.t=Math.max(0,V62.vig.t-dt);
  V62.shake.t=Math.max(0,V62.shake.t-dt);
  V62.lockFlash.t=Math.max(0,V62.lockFlash.t-dt);
  const combat=(typeof v45CombatHUD==='function')?!!v45CombatHUD():false;
  if(!combat&&V62.combatPrev){V62.combo.n=0;V62.combo.e=null;}
  V62.combatPrev=combat;
  // Thanh boss: máu trễ + fade 200ms.
  const b=V62.boss,live=combat?v62BossTarget():null;
  if(live){
    if(b.e!==live){b.e=live;b.delayed=v62BossRatio(live);b.holdT=0;b.lagStart=0;b.deathT=0;}
    const real=v62BossRatio(live);
    if(b.delayed==null)b.delayed=real;
    if(real<b.delayed){
      if(b.lagStart<=0)b.lagStart=V62.clock;
      let rem=dt;
      if(b.holdT>0){const u=Math.min(b.holdT,rem);b.holdT-=u;rem-=u;}
      if(rem>0){
        b.delayed-=(b.delayed-real)*Math.min(1,rem/0.4);
        if(V62.clock-b.lagStart>0.57)b.delayed=real; // Tối đa trễ 350ms sau 220ms giữ.
      }
    }else if(real>b.delayed){
      b.delayed+=(real-b.delayed)*Math.min(1,dt/0.12); // Hồi máu đuổi kịp trong 120ms.
      b.lagStart=0;
    }else b.lagStart=0;
    if(Math.abs(b.delayed-real)<0.0015)b.delayed=real;
    let ph=0;
    try{ph=(typeof v27AI==='function')?(v27AI(live).phase||0):0;}catch(err){ph=0;}
    if(ph!==b.phase){b.phase=ph;b.phaseFade=0.16;}
    b.phaseFade=Math.max(0,b.phaseFade-dt);
    b.fade=Math.min(1,b.fade+dt/0.2);
  }else{
    if(b.deathT>0){
      b.deathT-=dt;
      if(b.deathT>0)b.fade=1; // Còn trong 200ms hiển thị HP 0 sau khi hạ boss.
      else b.fade=Math.max(0,b.fade-(-b.deathT)/0.2); // Hết 200ms -> mờ dần 200ms.
    }else b.fade=Math.max(0,b.fade-dt/0.2);
    if(b.fade<=0){b.e=null;b.delayed=null;}
  }
}
function v62DrawVignette(){
  const v=V62.vig;
  if(v.t<=0)return;
  const a=clamp(v.t/v.dur,0,1);
  g.save();
  const edge=(x0,y0,x1,y1,rx,ry,rw,rh)=>{
    const gr=g.createLinearGradient(x0,y0,x1,y1);
    gr.addColorStop(0,'rgba(241,132,116,'+(0.55*a).toFixed(3)+')');
    gr.addColorStop(1,'rgba(241,132,116,0)');
    g.fillStyle=gr;g.fillRect(rx,ry,rw,rh);
  };
  edge(0,0,0,46,0,0,1280,46);
  edge(0,720,0,674,0,674,1280,46);
  edge(0,0,46,0,0,0,46,720);
  edge(1280,0,1234,0,1234,0,46,720);
  g.strokeStyle='rgba(241,132,116,'+(0.5*a).toFixed(3)+')';
  g.lineWidth=3;g.strokeRect(1.5,1.5,1277,717);
  g.restore();
}
function v62DrawNums(){
  for(const n of V62.nums){
    const u=clamp(n.t/n.life,0,1),age=n.t;
    let sc=1,rise=0;
    if(age<0.1){const k=age/0.1;sc=0.85+0.27*k;rise=-10*k;}
    else{
      const k=clamp((age-0.1)/Math.max(0.01,n.life-0.1),0,1);
      sc=1.12-0.12*Math.min(1,(age-0.1)/0.08);rise=-(10+26*k);
    }
    const alpha=u<0.65?1:1-(u-0.65)/0.35;
    const main=n.kind==='hurt'?('-'+Math.round(n.value)):String(Math.round(n.value));
    const size=(n.kind==='crit'||n.kind==='kill')?20:(n.kind==='hurt'?17:16);
    const col=n.kind==='hurt'?V62.red:((n.kind==='crit'||n.kind==='kill')?V62.gold:V62.paper);
    g.save();
    g.globalAlpha=clamp(alpha,0,1);
    g.translate(n.x,n.y+rise);g.scale(sc,sc);
    g.font='bold '+size+'px V45Sans, "Segoe UI", Arial, sans-serif';
    g.textAlign='center';g.textBaseline='middle';
    g.lineWidth=3;g.strokeStyle=V62.ink;g.strokeText(main,0,0);
    g.fillStyle=col;g.fillText(main,0,0);
    const sub=n.kind==='crit'?'Bạo kích':(n.kind==='kill'?'Kết liễu':null);
    if(sub){
      g.font='12px V45Sans, "Segoe UI", Arial, sans-serif';
      g.lineWidth=3;g.strokeStyle=V62.ink;g.strokeText(sub,0,16);
      g.fillStyle=V62.gold;g.fillText(sub,0,16);
    }
    if(n.comboN>=2){
      g.font='bold 12px V45Sans, "Segoe UI", Arial, sans-serif';
      const w=g.measureText(main).width/2;
      g.lineWidth=3;g.strokeStyle=V62.ink;g.strokeText('×'+n.comboN,w+16,0);
      g.fillStyle=V62.gold;g.fillText('×'+n.comboN,w+16,0);
    }
    g.restore();
  }
}
function v62DrawLock(){
  if(typeof v34Target!=='function')return;
  let e=null;
  try{e=v34Target();}catch(err){return;}
  if(!e||e.dead)return;
  const z=v62ScreenPos(e.x,e.y);
  if(!isFinite(z.x)||!isFinite(z.y)||z.x<-60||z.x>1340||z.y<-40||z.y>760)return;
  const t=(typeof TYPES!=='undefined'&&TYPES[e.type])?TYPES[e.type]:null;
  const hw=Math.max(26,(t&&t.r||22)+8),hh=30,cy=z.y-28;
  g.save();
  g.strokeStyle=V62.gold;g.lineWidth=2;g.globalAlpha=0.9;
  const a=10,x0=z.x-hw,x1=z.x+hw,y0=cy-hh,y1=cy+hh;
  g.beginPath();
  g.moveTo(x0,y0+a);g.lineTo(x0,y0);g.lineTo(x0+a,y0);
  g.moveTo(x1-a,y0);g.lineTo(x1,y0);g.lineTo(x1,y0+a);
  g.moveTo(x1,y1-a);g.lineTo(x1,y1);g.lineTo(x1-a,y1);
  g.moveTo(x0+a,y1);g.lineTo(x0,y1);g.lineTo(x0,y1-a);
  g.stroke();
  g.globalAlpha=0.65+0.35*Math.sin(V62.clock*6);
  if(typeof diamond==='function')diamond(g,z.x,y0-14,4,V62.gold);
  g.restore();
  const f=V62.lockFlash;
  if(f.e===e&&f.t>0){
    const k=1-f.t/0.15;
    g.save();g.globalAlpha=0.8*(1-k);g.strokeStyle=V62.gold;g.lineWidth=2;
    g.beginPath();g.ellipse(z.x,cy,10+k*22,6+k*12,0,0,TAU);g.stroke();g.restore();
  }
}
function v62DrawMilestone(){
  const m=V62.milestone;
  if(!m)return;
  g.save();
  g.globalAlpha=clamp(m.t/0.9,0,1);
  g.font='bold 20px V18Serif, "Noto Serif CJK SC", serif';
  g.textAlign='center';g.textBaseline='middle';
  g.lineWidth=4;g.strokeStyle=V62.ink;
  g.strokeText('LIÊN KÍCH ×'+m.n,640,300);
  g.fillStyle=V62.gold;g.fillText('LIÊN KÍCH ×'+m.n,640,300);
  g.restore();
}
function v62DrawBoss(){
  const b=V62.boss;
  if(b.fade<=0.01||!b.e)return;
  if(typeof v35State!=='function'||typeof V35_GROUPS==='undefined')return;
  let st=null;
  try{st=v35State().groups.target;}catch(err){return;}
  if(!st||st.hidden)return;
  const bg=V35_GROUPS.target;
  if(!bg)return;
  const real=b.deathT>0?0:v62BossRatio(b.e);
  const delayed=(b.delayed==null)?real:clamp(b.delayed,0,1);
  const name=(typeof TYPES!=='undefined'&&TYPES[b.e.type])?TYPES[b.e.type].name:'Boss';
  const baseA=clamp(st.alpha==null?1:st.alpha,0,1)*b.fade;
  g.save();
  g.globalAlpha=baseA;
  // Cùng phép biến đổi nhóm target của v35Group (src/24_v35_v34.js:13):
  // translate(bx+dx,by+dy) → scale → translate(-bx,-by); toạ độ vẽ là
  // toạ độ gốc theo spec (trước transform), như v35TargetNormal.
  g.translate(bg.x+(st.dx||0),bg.y+(st.dy||0));
  g.scale(st.scale||1,st.scale||1);
  g.translate(-bg.x,-bg.y);
  if(typeof HUD_TQ!=='undefined'&&HUD_TQ)g.translate(0,-636); // HUD kiểu Titan Quest: đáy là thanh kỹ năng → thanh boss lên đỉnh giữa (y28)
  g.fillStyle='rgba(20,17,14,0.85)';g.fillRect(360,664,560,32);
  g.fillStyle=V62.gold;g.fillRect(360,664,560,1);
  let size=16;
  g.textAlign='left';g.textBaseline='middle';
  g.font='bold '+size+'px V18Serif, "Noto Serif CJK SC", serif';
  while(size>12&&g.measureText(name).width>322){
    size-=2;g.font='bold '+size+'px V18Serif, "Noto Serif CJK SC", serif';
  }
  g.fillStyle=V62.paper;g.fillText(name,360,673);
  const ph=b.phase;
  if(ph===1||ph===2||ph===3){
    const label=ph===1?'I':(ph===2?'II':'III · Cuồng nộ');
    g.save();
    if(b.phaseFade>0)g.globalAlpha*=0.35+0.65*(1-b.phaseFade/0.16);
    g.font='13px V45Sans, "Segoe UI", Arial, sans-serif';
    g.textAlign='center';g.fillStyle=ph===3?V62.red:V62.gold;
    g.fillText(label,692+76,673);
    g.restore();
  }
  g.font='12px V45Sans, "Segoe UI", Arial, sans-serif';
  g.textAlign='right';g.fillStyle=V62.paper;
  g.fillText(Math.ceil(clamp(real,0,1)*100)+'%',920,673);
  g.fillStyle=V62.ink;g.fillRect(360,684,560,12);
  if(delayed>0){
    g.globalAlpha=baseA*0.9;g.fillStyle=V62.muted;
    g.fillRect(362,686,556*clamp(delayed,0,1),8);
  }
  g.globalAlpha=baseA;
  if(real>0){
    g.fillStyle=V62.red;
    g.fillRect(362,686,556*clamp(real,0,1),8);
  }
  g.restore();
}
function v62Draw(){
  if(!p||mode!=='play'||modal)return;
  if(typeof v35Editing==='function'&&v35Editing())return;
  if(typeof v45CombatHUD!=='function'||!v45CombatHUD())return;
  let ox=0,oy=0;
  if(V62.shake.t>0&&(typeof screenShake==='undefined'||screenShake!==false)){
    const k=V62.shake.t/V62.shake.dur,a=Math.min(3,V62.shake.amp*k);
    ox=(Math.random()*2-1)*a;oy=(Math.random()*2-1)*a;
  }
  V62.dbg.shakeX=ox;V62.dbg.shakeY=oy;
  v62DrawVignette();
  g.save();g.translate(ox,oy);
  v62DrawNums();
  v62DrawLock();
  g.restore();
  v62DrawMilestone();
  v62DrawBoss();
}
if(typeof COMBAT_HOOKS!=='undefined'){
  COMBAT_HOOKS.afterHit.push(v62OnHit);
  COMBAT_HOOKS.afterPlayerDamage.push(v62OnHurt);
}
if(typeof FRAME_HOOKS!=='undefined'){
  FRAME_HOOKS.update.push(v62Tick);
  FRAME_HOOKS.overlay.push(v62Draw);
}
