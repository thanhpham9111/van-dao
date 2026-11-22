'use strict';
// T45 · Trình diễn Thiên kiếp (Cửu Tiêu Lôi Đài) — src/64_breakthrough.js
// Chỉ trình diễn, KHÔNG đổi luật V30: số đợt, dạng vùng, thời gian báo trước,
// sát thương, thắng/thua đều do v30TrialStart/v30TrialTick/v30TrialZone/
// v30TrialEnd (src/20) quyết định. Module này chỉ:
//  - cảnh mở đầu 1,8s TRƯỚC đợt đầu (đồng hồ đợt giữ bằng PATCH ở
//    v30TrialTick, bật đồng bộ bằng PATCH ở v30TrialStart),
//  - thanh đợt + thời gian còn lại của vùng sét thật (không vẽ lại vùng
//    nguy hiểm: vùng đó renderer V30/v27Zone đã vẽ),
//  - hiệu ứng thăng cảnh giới + câu Trưởng lão khi thắng, câu an ủi khi thua
//    (nhận từ PATCH ở cuối v30TrialEnd — thắng/thua lấy từ handler thật).
// Chen hành vi chỉ qua FRAME_HOOKS (src/01_core.js). Không bọc đè hàm,
// không tạo phím mới (Space/Esc có sẵn để bỏ qua intro), không thêm
// trường save (p.breakFails / p.v30.records đã có sẵn do V30 quản).
// Lời dẫn / lời chúc / câu an ủi lấy nguyên văn từ ops/specs/breakthrough.md
// §2/§4 (không có file data riêng cho thiên kiếp).
const B64={
  intro:false,introT:0,introSerial:-1,introRank:1,
  result:null, // {ok,rank,serial,t} — chỉ đặt bởi b64TrialEnd (PATCH)
  doneSerial:-1,seenSerial:-1,clock:0
};
const B64_INTRO_MS=1.8;   // spec §2: 0–250 tụ, 250–1400 giữ lời, 1400–1800 tan
const B64_WIN_MS=2.2;     // spec §4: 220 + 1680 + 300
const B64_LOSE_MS=1.88;   // spec §4: 160 + 1500 + 220
const B64_INK='#14110e',B64_PAPER='#efe6d4',B64_GOLD='#c9a86a',
  B64_MUTED='#b5a18b',B64_RED='#f18474';
// Lời mở đầu theo cảnh giới đích (spec §2, ≤70 ký tự mỗi câu, tách 2 dòng).
const B64_INTRO_LINES={
  1:['Linh khí hội tụ, xin tiểu hữu','lấy tâm vững làm nền đạo.'],
  2:['Hàn hỏa cùng quy, một niệm','kết đan giữa tiếng lôi.'],
  3:['Tâm thần vượt vỏ cũ, đừng để','sợ hãi lấn nhịp thở.'],
  4:['Trời đất thử lòng người;','giữ một niệm sáng qua thiên lôi.']
};
// Lời chúc của Trưởng lão khi thắng (spec §2, ≤70 ký tự).
const B64_ELDER={
  1:'Căn cơ đã vững. Tiểu hữu hãy giữ tâm như buổi đầu học đạo.',
  2:'Kim Đan đã thành. Đừng để ánh vàng che mất đạo tâm.',
  3:'Nguyên Anh khai sáng. Hãy để hiểu biết dẫn đường, không phải kiêu tâm.',
  4:'Hóa Thần rồi. Vạn đạo rộng lớn, lòng người vẫn cần khiêm nhường.'
};
// Hai câu an ủi khi thua (spec §4, ≤70 ký tự mỗi câu).
const B64_LOSE_LINES=[
  'Đạo tâm còn đó, một lần thất bại chưa phải tận đường.',
  'Nhìn dấu báo sét, giữ lối thoát và dùng Shift đúng lúc.'
];
function b64RealmName(rank){
  if(typeof V22_REALMS!=='undefined'&&V22_REALMS[rank])return V22_REALMS[rank];
  return ['','Trúc Cơ','Kim Đan','Nguyên Anh','Hóa Thần'][rank]||'Trúc Cơ';
}
// Thời gian báo trước — cùng công thức với v30TrialTick (src/20:62),
// chỉ đọc, không đặt lại.
function b64Warn(rank){return Math.max(.85,1.55-.11*rank);}
// PATCH v30TrialStart gọi đồng bộ: intro bật trước frame update đầu tiên,
// để PATCH v30TrialTick kịp giữ đồng hồ đợt.
function b64TrialBegin(t){
  if(!t)return;
  B64.seenSerial=t.serial;B64.intro=true;B64.introT=0;
  B64.introSerial=t.serial;B64.introRank=t.rank||1;B64.result=null;
}
function b64IntroActive(){return !!B64.intro;}
// PATCH cuối v30TrialEnd gọi: handler đã dịch chuyển + hồi máu xong nên
// vị trí/cảnh giới lúc này là đúng. Chỉ ghi nhận, không đổi luật/thưởng.
function b64TrialEnd(ok,t){
  if(!t||t.serial===B64.doneSerial)return;
  B64.doneSerial=t.serial;B64.intro=false;
  B64.result={ok:!!ok,rank:t.rank||1,serial:t.serial,t:0};
}
function b64Serif(t,x,y,size,color,strokeW){
  g.save();g.font='bold '+size+'px V18Serif, "DejaVu Serif", Georgia, serif';
  g.textAlign='center';g.textBaseline='middle';
  if(strokeW){g.lineWidth=strokeW;g.strokeStyle='#100b13';g.strokeText(t,x,y);}
  g.fillStyle=color;g.fillText(t,x,y);g.restore();
}
function b64Sans(t,x,y,size,color,align){
  g.save();g.font=size+'px V45Sans, "Segoe UI", Arial, sans-serif';
  g.textAlign=align||'center';g.textBaseline='middle';
  g.fillStyle=color;g.fillText(t,x,y);g.restore();
}
// Vị trí nhân vật trên màn hình logic 1280×720. Trong lôi đài (room mode)
// p.x/p.y đã là toạ độ màn hình; sau khi thắng/thua handler dịch chuyển về
// thế giới mở thì dùng đúng phép chuyển world→screen của renderer (hdPoint).
function b64PlayerScreen(){
  try{
    if(p&&p.worldMode&&typeof hdPoint==='function'){
      const z=hdPoint(p.x,p.y);
      if(Number.isFinite(z.x)&&Number.isFinite(z.y))return z;
    }
  }catch(_){}
  if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){
    if(p.worldMode&&typeof owCamera!=='undefined'&&owCamera)
      return {x:p.x-owCamera.x,y:p.y-owCamera.y};
    return {x:p.x,y:p.y};
  }
  return {x:640,y:500};
}
// Thanh đợt (430,194,420,28) có giao vùng sét thật thì ẩn toàn thanh (§3).
function b64InAnnulus(x,y,z){
  const d=Math.hypot(x-z.x,y-z.y);
  return d>=(z.inner||0)-4&&d<=z.reach+4;
}
function b64BarHidden(z){
  const x0=430,y0=194,x1=850,y1=222;
  if(!z)return false;
  if(z.shape==='line')
    return z.x<x1+4&&z.x+z.reach>x0-4&&z.y-z.width<y1+4&&z.y+z.width>y0-4;
  if(z.shape==='target'){
    const cx=clamp(z.x,x0,x1),cy=clamp(z.y,y0,y1);
    return Math.hypot(z.x-cx,z.y-cy)<=z.reach+4;
  }
  if(z.shape==='ring'){
    for(let x=x0;x<=x1;x+=16)
      if(b64InAnnulus(x,y0,z)||b64InAnnulus(x,y1,z))return true;
    for(let y=y0;y<=y1;y+=8)
      if(b64InAnnulus(x0,y,z)||b64InAnnulus(x1,y,z))return true;
    return b64InAnnulus(640,208,z);
  }
  const cx=clamp(z.x,x0,x1),cy=clamp(z.y,y0,y1);
  return Math.hypot(z.x-cx,z.y-cy)<=(z.reach||0)+4;
}
function b64ShapeName(shape){
  return shape==='target'?'Vùng tròn':shape==='line'?'Dải ngang':
    shape==='ring'?'Vòng sét':'';
}
function b64DrawIntro(){
  const t=B64.introT;
  const a=clamp(t/.25,0,1)*(t>1.4?clamp((B64_INTRO_MS-t)/.4,0,1):1);
  if(a<=0)return;
  g.save();g.globalAlpha=a;
  // Mây kiếp 0,0,1280,340: nền mực .28, mép mây giấy .08 (không tạo
  // gradient/canvas mới mỗi frame — chỉ vẽ hình tròn mờ).
  g.fillStyle='rgba(16,11,19,0.28)';g.fillRect(0,0,1280,340);
  for(let i=0;i<6;i++){
    const cx=140+i*210+Math.sin(t*.7+i*1.7)*10,cy=92+(i%3)*72,r=92+(i%3)*38;
    g.fillStyle='rgba(241,228,207,0.08)';
    g.beginPath();g.arc(cx,cy,r,0,TAU);g.fill();
    g.fillStyle='rgba(16,11,19,0.28)';
    g.beginPath();g.arc(cx+26,cy+16,r*.72,0,TAU);g.fill();
  }
  // Nét mực đầu 368,202,544,108.
  g.fillStyle='rgba(16,11,19,0.68)';g.fillRect(368,202,544,108);
  g.fillStyle='rgba(241,228,207,0.06)';g.fillRect(372,206,536,100);
  // Tên cảnh + lời dẫn + nhắc bỏ qua.
  b64Serif('THIÊN KIẾP · '+b64RealmName(B64.introRank).toUpperCase(),
    640,228,28,B64_GOLD,2);
  const lines=B64_INTRO_LINES[B64.introRank]||B64_INTRO_LINES[1];
  b64Sans(lines[0],640,259,16,B64_PAPER);
  b64Sans(lines[1],640,277,16,B64_PAPER);
  b64Sans('Space / Esc · Bỏ qua',640,306,12,B64_MUTED);
  g.restore();
}
function b64DrawWaveBar(t){
  const z=t.zone;
  if(z&&b64BarHidden(z))return; // telegraph giao rect → ẩn toàn thanh
  const wait=b64Warn(t.rank);
  const remain=t.hit?0:Math.max(0,wait-t.t);
  const q=t.hit?0:clamp(remain/wait,0,1);
  g.save();
  g.fillStyle='rgba(20,17,14,0.85)';g.fillRect(430,194,420,28);
  const label='Thiên kiếp · Đợt '+(t.wave+1)+'/'+t.total+
    (z&&b64ShapeName(z.shape)?' · '+b64ShapeName(z.shape):'');
  b64Sans(label,442,208,14,B64_PAPER,'left');
  b64Sans(t.hit?'Sét giáng!':remain.toFixed(1).replace('.',',')+'s',
    838,208,14,t.hit||q<=.2?B64_RED:B64_GOLD,'right');
  // Mini-progress (440,218,400,3): tỉ lệ đúng thời gian còn lại thật.
  g.fillStyle='rgba(239,230,212,0.18)';g.fillRect(440,218,400,3);
  if(q>0){
    const late=q<=.2;
    g.globalAlpha=late?.55+.35*Math.sin(B64.clock*17):1;
    g.fillStyle=q>.5?B64_GOLD:B64_RED;
    g.fillRect(440,218,400*q,3);
  }
  g.globalAlpha=.8;g.fillStyle=B64_GOLD;g.fillRect(430,220,420,2);
  g.restore();
}
function b64DrawResult(){
  const r=B64.result;if(!r)return;
  const total=r.ok?B64_WIN_MS:B64_LOSE_MS,t=r.t;
  let a;
  if(r.ok)a=t<.22?t/.22:t>1.9?clamp((B64_WIN_MS-t)/.3,0,1):1;
  else a=t<.16?t/.16:t>1.66?clamp((B64_LOSE_MS-t)/.22,0,1):1;
  if(a<=0)return;
  g.save();g.globalAlpha=a;
  if(r.ok){
    const s=b64PlayerScreen();
    // Vòng sáng quanh chân actor thật: r 24→112 trong 560ms, gold .55→0.
    const q=clamp(t/.56,0,1);
    if(q<1){
      g.strokeStyle='#e3b96f';g.globalAlpha=a*(1-q)*.55;g.lineWidth=3;
      g.beginPath();g.arc(s.x,s.y,24+88*q,0,TAU);g.stroke();
      g.globalAlpha=a;
    }
    // 12 hạt giấy/vàng ≤4px trong 600ms (vị trí xác định theo chỉ số).
    if(t<.6){
      const pq=clamp(t/.6,0,1);
      for(let i=0;i<12;i++){
        const ang=i*TAU/12+.35,rad=20+pq*92*(.6+.4*((i*37)%10)/10);
        g.globalAlpha=a*(1-pq);
        g.fillStyle=i%2?B64_PAPER:B64_GOLD;
        g.beginPath();
        g.arc(s.x+Math.cos(ang)*rad,s.y+Math.sin(ang)*rad*.8,2+(i%3),0,TAU);
        g.fill();
      }
      g.globalAlpha=a;
    }
    // Thư pháp cảnh giới mới + lời chúc Trưởng lão.
    g.fillStyle='rgba(20,17,14,0.55)';g.fillRect(344,212,592,124);
    b64Serif(b64RealmName(r.rank).toUpperCase(),640,255,42,'#e3b96f',3);
    const bless=B64_ELDER[r.rank]||B64_ELDER[1];
    g.save();
    g.font='16px V45Sans, "Segoe UI", Arial, sans-serif';
    if(g.measureText(bless).width>528)g.font='14px V45Sans, "Segoe UI", Arial, sans-serif';
    g.textAlign='center';g.textBaseline='middle';g.fillStyle=B64_PAPER;
    g.fillText(bless,640,313);g.restore();
  }else{
    g.fillStyle='rgba(20,17,14,0.85)';g.fillRect(392,214,496,94);
    b64Serif('Thiên kiếp chưa qua',640,236,22,B64_MUTED);
    b64Sans(B64_LOSE_LINES[0],640,262,14,B64_PAPER);
    b64Sans(B64_LOSE_LINES[1],640,284,14,B64_RED);
  }
  g.restore();
}
function b64Update(dt){
  dt=Number.isFinite(dt)&&dt>0?dt:1/60;
  B64.clock+=dt;
  let t=null;
  try{t=typeof v30Trial==='function'?v30Trial():null;}catch(_){t=null;}
  // Dự phòng khi PATCH v30TrialStart chưa được áp: phát hiện trial mới
  // (wave 0, vừa bắt đầu) rồi bật intro. Đường chính vẫn là b64TrialBegin
  // đồng bộ trong v30TrialStart (kịp trước tick của frame đầu).
  if(t&&t.serial!==B64.seenSerial){
    B64.seenSerial=t.serial;
    if(!B64.intro&&B64.doneSerial!==t.serial&&t.wave===0&&t.t<.1&&mode==='play'){
      B64.intro=true;B64.introT=0;
      B64.introSerial=t.serial;B64.introRank=t.rank||1;B64.result=null;
    }
  }
  if(B64.intro){
    // Space/Esc chỉ bỏ qua cảnh: xoá phím khỏi `pressed` ngay trong hook
    // (hook chạy trước khi frame xoá pressed — xem src/47 frame()),
    // nên phím không truyền xuống handler khác ở frame sau. Lưu ý: cùng
    // frame này update() gốc đã chạy trước hook — Esc mở bảng Cài đặt thì
    // đóng lại ngay tại đây; Space chỉ gây khinh công (điều khiển/né vẫn
    // được phép trong lúc intro, spec §2), không mở modal hay thoát trial.
    if(pressed.Space||pressed.Escape){
      const esc=!!pressed.Escape;
      delete pressed.Space;delete pressed.Escape;
      if(esc&&modal&&modal.kind==='settings')modal=null;
      B64.intro=false;
    }else{
      B64.introT+=dt;
      if(B64.introT>=B64_INTRO_MS)B64.intro=false;
    }
    if(!t)B64.intro=false; // chuyển cảnh/abort giữa chừng → xoá overlay
  }
  if(B64.result){
    B64.result.t+=dt;
    if(B64.result.t>=(B64.result.ok?B64_WIN_MS:B64_LOSE_MS))B64.result=null;
  }
}
function b64Overlay(){
  if(!p||mode!=='play')return;
  if(modal)return; // modal khác đang mở → ẩn cut-in (spec §2)
  if(B64.intro){b64DrawIntro();return;}
  if(B64.result){b64DrawResult();return;}
  let t=null;
  try{t=typeof v30Trial==='function'?v30Trial():null;}catch(_){t=null;}
  if(t)b64DrawWaveBar(t);
}
if(typeof FRAME_HOOKS!=='undefined'){
  FRAME_HOOKS.update.push(b64Update);
  FRAME_HOOKS.overlay.push(b64Overlay);
}
