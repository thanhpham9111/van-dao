'use strict';
// M3 (GÓI 05) · T24 — Nội thất quán trọ (phòng đầu tiên trong 5 phòng V36).
// Theo ops/specs/interior.md + batch01_addendum.md §7, bố cục khớp ảnh concept
// assets/interior_inn_concept.webp (đại điện mở: bình phong núi 3 tấm sau quầy,
// kệ sách hai bên, cột đỏ, đèn lồng tường, sàn đá, thảm dài giữa, bàn trà trái,
// ghế dài phải, bồ đoàn). Ảnh nội thất chưa cắt sẵn nên mọi họa tiết vẽ thủ
// công bằng code, cache ra canvas phụ — KHÔNG vẽ khối phẳng (như GÓI 04 đã
// nâng cấp ở M1): vân gỗ sàn/tường, gạch đá, vải quầy, tranh núi trên bình phong.
// Chỉ làm phòng inn ('inn'); 4 phòng kia giữ nguyên backdrop + đồ đạc cũ.
// Không tạo phím mới, không đổi save, không đổi đường vào/ra, spawn, NPC, quest.
// Va chạm: chỉ thêm đúng 1 khối quầy (foot) cho phòng inn, qua PATCH v36Blocked;
// 4 phòng kia và mọi collider cũ giữ nguyên.
// Ánh sáng: đèn lồng vẽ đúng anchor quầng thật của v41RoomLive (478,180) và
// (802,180) (src/31) — không tự tạo pass glow mới, không phủ màu lên HUD.
const INTERIOR_NEW=true;
// Quầy tiếp kiến (spec §3.1: 500,248,280,62). Chân quầy y=310 trùng chân NPC
// (V36_NPC 640,310): NPC đứng sau quầy, quầy vẽ sau NPC trong y-sort.
const INTERIOR_INN_DESK={x:500,y:248,w:280,h:62};
// Đèn lồng tường: tâm đúng quầng v41RoomLive (src/31:67).
const INTERIOR_INN_LAMPS=[{x:478,y:180},{x:802,y:180}];
// Khung phòng thật (khớp v36Backdrop/src-26 + v41RoomLive): tường hậu y134-251,
// sàn y251-580, cửa ra (640,558), lối giữa x542-738 luôn trống.
const INTERIOR_INN_FRAME={x:251,y:127,w:778,h:454};
let _interiorDeskCanvas=null;

// Hash xác định cục bộ (không phụ thuộc hashOW/seed của game).
function interiorInnHash(x,y,s){let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul((s||0)|0,1446648777))|0;n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;}
function interiorInnRoom(){if(typeof v36Current!=='function')return null;return v36Current();}
function interiorInnActive(){return typeof INTERIOR_NEW!=='undefined'&&INTERIOR_NEW&&interiorInnRoom()&&interiorInnRoom().id==='inn';}
// Va chạm foot của quầy — chỉ phòng inn; nới như đồ đạc cũ trong v36Blocked
// (x ±14, y -13/+13) để nhân vật không kẹp mép gỗ. NPC vẫn tiếp cận được:
// đứng sát quầy (640,323) cách NPC 13px (< 75px để E nói chuyện).
function interiorInnBlocked(x,y){if(!interiorInnActive())return false;const f=INTERIOR_INN_DESK;return x>f.x-14&&x<f.x+f.w+14&&y>f.y-13&&y<f.y+f.h+13;}

// ---------- Backdrop phòng inn (canvas tĩnh, cache trong V36.roomCache) ----------
function interiorInnBackdrop(r){
  if(V36.roomCache.has(r.id))return V36.roomCache.get(r.id);
  const c=document.createElement('canvas');c.width=W;c.height=H;const d=c.getContext('2d');
  const rect=(x,y,w,h,col,edge)=>{d.fillStyle=col;d.fillRect(x,y,w,h);if(edge){d.strokeStyle=edge;d.lineWidth=1;d.strokeRect(x+.5,y+.5,w-1,h-1);}};
  const line=(x,y,X,Y,col,w)=>{d.strokeStyle=col;d.lineWidth=w||1;d.beginPath();d.moveTo(x,y);d.lineTo(X,Y);d.stroke();};
  const poly=(pts,col,edge)=>{d.beginPath();d.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)d.lineTo(pts[i][0],pts[i][1]);d.closePath();d.fillStyle=col;d.fill();if(edge){d.strokeStyle=edge;d.lineWidth=1;d.stroke();}};
  const ell=(x,y,rx,ry,col)=>{d.fillStyle=col;d.beginPath();d.ellipse(x,y,rx,ry,0,0,TAU);d.fill();};
  const lgrad=(x,y,X,Y,a,b)=>{const z=d.createLinearGradient(x,y,X,Y);z.addColorStop(0,a);z.addColorStop(1,b);return z;};
  const rgrad=(x,y,r0,r1,a,b)=>{const z=d.createRadialGradient(x,y,r0,x,y,r1);z.addColorStop(0,a);z.addColorStop(1,b);return z;};
  // Nền ngoài phòng: mực đêm, tối dần về rìa (không đen đặc che HUD).
  rect(0,0,W,H,rgrad(640,340,80,670,'#2c352c','#081419'));
  d.save();d.shadowColor='#000';d.shadowBlur=24;rect(236,124,808,472,'#2c2721');d.restore();
  // --- Tường hậu: ván gỗ đứng, vân thớ + mối nối, xà trên + chân tường ---
  rect(251,134,778,117,'#4a3b2c');
  for(let i=0;i<12;i++){const x=251+i*65,w=i===11?778-i*65:65,q=interiorInnHash(i,7,11);
    rect(x,134,w,117,q>.5?'#574631':'#4e3f2d','#3a2e22');
    for(let j=0;j<4;j++){const gx=x+6+interiorInnHash(i,j,21)*(w-12);line(gx,140,gx+((j%2)?4:-4),244,'#2e241a55',.8);}
    line(x+2,140,x+2,244,'#241c1333');line(x+w-2,140,x+w-2,244,'#e8d8b31c');}
  rect(251,134,778,12,'#33291e','#6b5636');rect(251,239,778,12,'#3a2c20','#8a6f45');
  // --- Bình phong 3 tấm sau quầy: khung gỗ sẫm, giấy vẽ núi + thác + tùng ---
  rect(468,138,344,110,'#2e241a','#c2a36b');
  const panels=[[474,144,106,98],[586,144,108,98],[700,144,106,98]];
  for(let pi=0;pi<3;pi++){const px=panels[pi][0],py=panels[pi][1],pw=panels[pi][2],ph=panels[pi][3];
    rect(px,py,pw,ph,lgrad(px,py,px,py+ph,'#ddd0ac','#c4b28a'),'#241c13');
    // Dãy núi xa -> gần, sương mù ngang, thác trắng ở tấm giữa.
    poly([[px,py+ph],[px,py+ph-26],[px+pw*.28,py+ph-52],[px+pw*.55,py+ph-30],[px+pw*.78,py+ph-46],[px+pw,py+ph-22],[px+pw,py+ph]],'#9aa78f');
    poly([[px,py+ph],[px,py+ph-14],[px+pw*.3,py+ph-38],[px+pw*.52,py+ph-18],[px+pw*.8,py+ph-34],[px+pw,py+ph-12],[px+pw,py+ph]],'#6d7f66');
    poly([[px,py+ph],[px,py+ph-8],[px+pw*.35,py+ph-24],[px+pw*.6,py+ph-10],[px+pw,py+ph-18],[px+pw,py+ph]],'#4d675c');
    rect(px,py+ph-58,pw,7,'#e9e0c866');rect(px,py+ph-34,pw,5,'#e9e0c855');
    if(pi===1){rect(px+pw/2-4,py+18,8,ph-40,'#f2ecdcbb');rect(px+pw/2-2,py+18,4,ph-40,'#fffdf4');}
    if(pi===0){ // Tùng cổ bên trái.
      line(px+pw*.62,py+ph-12,px+pw*.55,py+ph-52,'#3d3226',3);
      for(let b=0;b<4;b++){const by=py+ph-50+b*10;ell(px+pw*.55+(b%2?14:-10),by,20-b*2,5,'#4a5f45');}
    }
    if(pi===2){ell(px+pw*.72,py+22,7,7,'#e7ba7d');} // Mặt trời/mặt trăng nhạt.
    rect(px,py,pw,3,'#6d573f');rect(px,py+ph-3,pw,3,'#6d573f');}
  // --- Cửa sổ song gỗ hai bên bình phong: sáng ấm, song chéo ---
  for(const wx of [318,868]){
    rect(wx-5,148,104,83,'#272e2a','#c9a86a');
    rect(wx,153,94,73,lgrad(wx,153,wx,226,'#e8dcb2','#769b8e'),'#6f654e');
    for(let yy=158;yy<223;yy+=17)for(let xx=wx+4;xx<wx+90;xx+=17){line(xx,yy,xx+15,yy+15,'#514735',2);line(xx+15,yy,xx,yy+15,'#594d36',2);}
    rect(wx-7,226,108,5,'#aa8a5e');}
  // --- Cột đỏ trầm hai bên bình phong + hai cột ngoài (vân + đai vàng + đế đá) ---
  for(const cx of [268,452,806,990]){
    rect(cx,132,22,120,lgrad(cx,0,cx+22,0,'#7e3b2a','#a3543a'),'#2e1a12');
    for(let j=0;j<3;j++)line(cx+5+interiorInnHash(cx,j,31)*12,138,cx+5+interiorInnHash(cx,j,47)*12,246,'#5e2a1e66',.8);
    rect(cx+3,135,3,114,'#c98d5f');rect(cx-5,134,32,6,'#c9a86a');rect(cx-4,240,30,9,'#4e4335','#c8ab76');
    rect(cx-2,248,26,6,'#8f8b7d','#5c564a');}
  // --- Sàn đá phối cảnh: hàng ngắn dần về hậu, từng viên lệch tông + vân ---
  rect(251,251,778,329,'#8a7452');
  let y=251,row=0;
  while(y<580){const prog=(y-251)/329,rowH=13+prog*17;
    const tw=104+prog*10,off=(row%2)*tw/2;
    for(let x=251-off;x<1028;x+=tw){const X=Math.max(x,251),w=Math.min(x+tw-1,1028)-X,h=Math.min(rowH-1,580-y),q=interiorInnHash(Math.round(x),Math.round(y),3733);
      rect(X,y,w,h,lgrad(X,y,X,y+h,q>.5?'#b39a72':'#a68d68',q>.5?'#967f5e':'#8a7550'),'#6e5f4a88');
      line(X+1,y+1,X+w-1,y+1,'#e8d8b32e');
      for(let j=0;j<3;j++){const gy=y+3+interiorInnHash(Math.round(x),Math.round(y),j+4)*Math.max(2,h-5),gx=X+3+interiorInnHash(Math.round(x),Math.round(y),j+20)*w*.5;
        line(gx,gy,Math.min(X+w-3,gx+w*(.12+interiorInnHash(Math.round(x),Math.round(y),j+50)*.4)),gy,'#e2d7bd14',.7);}
      if(q>.86)rect(X+4,y+3,Math.min(w-8,14),2,'#5e5140aa');}
    y+=rowH;row++;}
  // Bóng tiếp giáp tường/sàn + vệt nắng xiên từ cửa sổ trái.
  rect(251,251,778,52,lgrad(0,251,0,303,'#0a100e66','#0a100e00'));
  poly([[330,251],[392,251],[560,462],[392,462]],'#f0e0b014');
  poly([[880,251],[942,251],[1010,430],[880,430]],'#f0e0b00e');
  // --- Thảm dài giữa (từ quầy xuống cửa): dệt sọc + viền vàng + trám giữa ---
  rect(548,312,184,254,'#6e3a30');rect(554,314,172,250,'#7d453a','#c9a86a');
  rect(560,320,160,238,'#7d453a','#a5814f');
  for(let ty=322;ty<556;ty+=3)line(562,ty,718,ty,'#e8d8b30d',.7);
  for(const my of [372,442,512]){d.save();d.translate(640,my);d.scale(1,.62);
    for(const ra of [26,31]){d.strokeStyle='#c9a86a99';d.lineWidth=1;d.beginPath();d.arc(0,0,ra,0,TAU);d.stroke();}
    for(let j=0;j<8;j++){const a=j*TAU/8;poly([[0,0],[Math.cos(a-.18)*15,Math.sin(a-.18)*15],[Math.cos(a)*23,Math.sin(a)*23],[Math.cos(a+.18)*15,Math.sin(a+.18)*15]],'#c9a86a88');}
    ell(0,0,4,4,'#c9a86a');d.restore();}
  // Bóng mềm dưới chân quầy (quầy không có trong v37Furniture nên wrapper không đổ bóng).
  ell(640,312,150,10,'#151b1855');ell(640,312,112,6,'#151b1840');
  // --- Đèn lồng tường: giá đỡ + thân đỏ + lõi sáng + tua rua (quầng do v41RoomLive) ---
  for(const L of INTERIOR_INN_LAMPS){const x=L.x,cy=L.y;
    line(x-14,cy-34,x,cy-30,'#8a6f45',3);line(x,cy-34,x,cy-26,'#8a6f45',2);
    rect(x-12,cy-16,24,4,'#583b2a');rect(x-11,cy+14,22,4,'#583b2a');
    ell(x,cy,12,16,'#9d422d');ell(x,cy,9,13,'#f1ac5f');ell(x,cy,5,8,'#ffe2a2');
    line(x,cy+16,x,cy+28,'#a33327',2);ell(x,cy+30,3,4,'#c0503c');}
  // Khung cửa trước: ngưỡng sáng ở cửa ra (bậc đá do wrapper src/31 vẽ thêm).
  rect(579,530,122,65,lgrad(0,530,0,595,'#e4e4b600','#dce1a64d'));
  V36.roomCache.set(r.id,c);return c;
}

// ---------- Quầy tiếp kiến (sprite y-sort, vẽ sau NPC để NPC đứng sau quầy) ----------
// Canvas 280x72, vẽ tại (500,238) -> chân 310. Đồ trên mặt quầy né x595-685
// (vùng NPC) để không đè lên người chủ quán.
function interiorInnDeskCanvas(){
  if(_interiorDeskCanvas)return _interiorDeskCanvas;
  const c=document.createElement('canvas');c.width=280;c.height=72;const d=c.getContext('2d');
  const rect=(x,y,w,h,col,edge)=>{d.fillStyle=col;d.fillRect(x,y,w,h);if(edge){d.strokeStyle=edge;d.lineWidth=1;d.strokeRect(x+.5,y+.5,w-1,h-1);}};
  const line=(x,y,X,Y,col,w)=>{d.strokeStyle=col;d.lineWidth=w||1;d.beginPath();d.moveTo(x,y);d.lineTo(X,Y);d.stroke();};
  const ell=(x,y,rx,ry,col)=>{d.fillStyle=col;d.beginPath();d.ellipse(x,y,rx,ry,0,0,TAU);d.fill();};
  const hsh=(x,y,s)=>interiorInnHash(x,y,s);
  // Đồ trên mặt quầy (y0-12): chồng sách trái, ống bút, cuộn thư + lư hương phải.
  rect(18,2,34,10,'#3f5a52','#241c13');rect(20,0,30,4,'#d6c5a2');line(22,6,48,6,'#8f4437',1);
  rect(56,0,10,12,'#4a3220','#241c13');for(let b=0;b<3;b++)line(58+b*3,0,57+b*3,-6,'#d8c9a0',1.4);
  rect(226,3,38,9,'#d8c9a0','#6b5636');ell(226,7,3,5,'#8a6f45');ell(264,7,3,5,'#8a6f45');line(232,7,258,7,'#8f4437',1);
  rect(196,4,12,8,'#8a6f45','#3a2c20');ell(202,3,7,3,'#c9a86a');line(202,0,202,-4,'#e8dcc088',1);
  // Mặt quầy (y12-26): gỗ vân ngang + mép trước sáng.
  rect(0,12,280,14,'#6b4a2f');
  for(let j=0;j<4;j++){const gy=15+j*3;for(let x=4;x<276;x+=18)line(x,gy,x+12+(hsh(x,gy,61)*8|0),gy,'#4a322055',.8);}
  rect(0,12,280,2,'#a5814f');rect(0,24,280,2,'#3a2c20');
  // Vải phủ quầy (y12-58, giữa): nền kem, viền nâu, cành thêu, mép lượn.
  rect(96,12,88,46,'#e8dcc0');rect(96,12,88,46,'#e8dcc0','#8a6f45');
  rect(102,16,76,38,'#e8dcc0','#a5814f');
  line(140,20,140,50,'#6d573f',1.2);line(140,28,128,22,'#6d573f',1);line(140,34,152,28,'#6d573f',1);line(140,42,130,38,'#6d573f',1);
  ell(128,22,3,2,'#8f4437');ell(152,28,3,2,'#8f4437');ell(130,38,3,2,'#5d6943');
  for(let k=0;k<6;k++)ell(100+k*15,58,7,3,'#e8dcc0');
  // Mặt trước quầy (y26-72): khung gỗ, 2 ô chạm khắc, đinh đồng, chân đế.
  rect(0,26,280,46,'#5a3d27','#2e1a12');
  for(const px of [8,150]){rect(px,32,122,30,'#6b4a2f','#3a2c20');rect(px+4,36,114,22,'#5a3d27','#8a6f45');
    line(px+10,40,px+112,40,'#8a6f4544',1);line(px+10,54,px+112,54,'#8a6f4544',1);}
  for(let s=0;s<7;s++){ell(14+s*43,29,2,2,'#c9a86a');ell(14+s*43,69,2,2,'#c9a86a');}
  rect(0,26,280,3,'#8a6f45');rect(0,68,280,4,'#3a2c20');
  _interiorDeskCanvas=c;return c;
}
// Mục y-sort cho quầy: chân y=310, vẽ sau NPC (NPC y=310, sort ổn định giữ
// NPC trước) nên phần dưới quầy che thân dưới chủ quán — đúng kiểu đứng sau quầy.
function interiorInnDeskEntry(r){
  if(!interiorInnActive()||!r||r.id!=='inn')return null;
  return {y:INTERIOR_INN_DESK.y+INTERIOR_INN_DESK.h,draw:function(){g.drawImage(interiorInnDeskCanvas(),500,238);}};
}

