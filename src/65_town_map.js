'use strict';
/* ============================================================================
   M2 (GÓI 04) — Ghép + vẽ + va chạm map thôn mới "Thanh Thạch Thôn"
   Dữ liệu: DATA.town_layout (data/town_layout.js, M1) — map 3200x1800.
   Thay map tranh cũ (V47T/v471MapArt) bằng map ghép từ linh kiện.

   CỜ SO SÁNH: TOWN_NEW=true dùng map mới; false dùng lại map cũ y nguyên
   (mọi PATCH trong ops/patches/MUSE_04_M2.json đều rẽ nhánh theo cờ này).

   ẢNH — QUY ƯỚC TÊN (đọc ops/ASSETS_LIST.txt): ASSETS dùng khóa PHẲNG, không
   tiền tố thư mục (vd ASSETS["loading_truc"], ASSETS["portrait_inn"],
   ASSETS["world_map_ink"]). Vì vậy code kiểm tra đúng MỘT cách:
        ASSETS[asset]   (vd ASSETS["b_inn"], ASSETS["tile_grass_a"])
   ASSETS[...] là chuỗi URL (theo mẫu src/63_lore.js) hoặc đối tượng
   {img, ready} kiểu imgs[...]; code cache Image một lần. Khi ảnh thật về,
   chỉ cần đăng ký đúng khóa phẳng trên là thay, không sửa code.
   Chưa có ảnh -> vẽ khối màu giữ chỗ đúng kích thước khai báo trong layout.

   VA CHẠM — townBlocked(x,y,r): biên map dùng đủ r; foot/blocks chỉ nới tối
   đa 12px (rr=min(r,12)); nước chỉ chặn khi điểm NẰM TRONG đa giác (không
   nới), vì 2 cầu nằm đúng lỗ hổng của 3 đa giác nước. Lý do nới 12px:
   code cũ (v47tBlocked live) KHÔNG hề nới vật cản theo r (chỉ dùng r cho
   biên map); các điểm tương tác trong layout đứng cách foot 20px về phía
   nam nên nới >20px sẽ làm 7/11 điểm + cổng bị "chặn" và v471Route từ
   chối dẫn đường. Nới 12px vẫn chặt hơn code cũ mà giữ mọi điểm đi được.

   Y-SORT: một danh sách chung objects + người chơi + NPC, vẽ theo y chân
   tăng dần. Vật thể đứng trước người chơi (y chân lớn hơn) mà đè lên hình
   người chơi thì vẽ mờ alpha .5 để dễ nhìn.

   CẮT TRÀN MÉP: toàn bộ lớp thế giới được clip vào hình chữ nhật map
   (0,0,3200,1800): sprite Đại điện cao 760px đặt tại y=520 nên đỉnh tràn
   lên y=-240; sprite cổng chào rộng 560px tại x=2960 tràn 40px qua mép
   đông — cả hai chỉ vẽ phần trong map.

   HIỆU NĂNG: nền (cỏ + tiles + đường + nước + decals) được vẽ MỘT LẦN vào
   cache canvas phụ theo từng ô 512px, mỗi frame chỉ drawImage các ô trong
   khung camera (+lề 200px); vật thể cũng chỉ vẽ khi sprite chạm khung
   camera (+lề 200px). Không có trường save mới.
   ========================================================================== */
const TOWN_NEW = true;

/* ---- trạng thái module ---- */
var townWarned = false;       // đã console.warn DATA thiếu (chỉ 1 lần)
var townLayoutApplied = false;// đã áp layout vào V471_NODES/gates/spawn
var townGroundCache = {};     // "tx,ty" -> canvas 512x512 (nền đã vẽ sẵn)
var townImgCache = {};        // asset -> {img,ready} | null (không có ảnh)
var townStats = {groundTiles:0, groundCreated:0, objectsDrawn:0, objectsCulled:0, npcsDrawn:0, heroDrawn:0, occluded:0};
var TOWN_TILE = 512;          // cỡ ô cache nền

/* ---- dữ liệu ---- */
function townLayout(){
  if(typeof DATA==='undefined'||!DATA) return null;
  return DATA.town_layout||null;
}
function townLayoutValid(L){
  return !!L && L.version===1 && L.w===3200 && L.h===1800 &&
    Array.isArray(L.objects) && Array.isArray(L.points) &&
    Array.isArray(L.paths) && Array.isArray(L.water) &&
    Array.isArray(L.blocks) && Array.isArray(L.gates) && L.gates.length>0 &&
    L.spawn && Number.isFinite(L.spawn.x) && Number.isFinite(L.spawn.y);
}
/* true khi module mới dùng được. Lần đầu true sẽ áp layout vào game (chỉ 1 lần).
   DATA thiếu -> console.warn 1 lần rồi tắt module (trả false), game dùng map cũ. */
function townMapReady(){
  const L=townLayout();
  if(!townLayoutValid(L)){
    if(!townWarned){ townWarned=true; console.warn('[M2] DATA.town_layout thiếu/không hợp lệ — dùng map thôn cũ.'); }
    return false;
  }
  if(!townLayoutApplied) townApplyLayout(V471_NODES);
  return true;
}
/* Ghi đè tọa độ cũ (tranh 1672x941) bằng layout mới, GIỮ ĐÚNG id + name.
   Gọi được an toàn nhiều lần (cờ townLayoutApplied); cũng được gọi từ
   init cuối file này và từ townMapReady() để không phụ thuộc thứ tự nạp. */
function townApplyLayout(nodes){
  const L=townLayout();
  if(!townLayoutValid(L)||townLayoutApplied) return false;
  if(Array.isArray(nodes)){
    for(const n of nodes){
      const pt=L.points.find(function(q){ return q.id===n.id; });
      if(pt){ n.x=pt.x; n.y=pt.y; }
    }
  }
  if(typeof V47T_MAP!=='undefined'&&V47T_MAP){
    V47T_MAP.spawn=[L.spawn.x,L.spawn.y];
    const g=L.gates[0], gt=V47T_MAP.gates&&V47T_MAP.gates[0];
    if(g&&gt){ gt.x=g.x; gt.y=g.y; gt.r=g.r||90; gt.ax=g.x-160; gt.ay=g.y; }
  }
  townLayoutApplied=true;
  return true;
}

/* ---- hình học ---- */
function townInPoly(px,py,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const xi=poly[i][0], yi=poly[i][1], xj=poly[j][0], yj=poly[j][1];
    if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi)) inside=!inside;
  }
  return inside;
}
function townProj(q,a,b){
  const dx=b.x-a.x, dy=b.y-a.y, l2=dx*dx+dy*dy;
  if(!l2) return {x:a.x,y:a.y};
  let t=((q.x-a.x)*dx+(q.y-a.y)*dy)/l2;
  t=Math.max(0,Math.min(1,t));
  return {x:a.x+dx*t,y:a.y+dy*t};
}
function townDistToSeg(px,py,a,b){
  const z=townProj({x:px,y:py},a,b);
  return Math.hypot(px-z.x,py-z.y);
}
/* Điểm trên đường layout gần q nhất (dùng cho v471Snap khi TOWN_NEW). */
function townSnap(q){
  const L=townLayout();
  if(!L) return null;
  let best=null;
  for(const pa of L.paths){
    for(let i=1;i<pa.points.length;i++){
      const a={x:pa.points[i-1][0],y:pa.points[i-1][1]};
      const b={x:pa.points[i][0],y:pa.points[i][1]};
      const z=townProj(q,a,b), d=Math.hypot(q.x-z.x,q.y-z.y);
      if(!best||d<best.d) best={x:z.x,y:z.y,d:d};
    }
  }
  return best;
}

/* ---- va chạm ---- */
function townBlocked(x,y,r){
  const L=townLayout();
  if(!L) return false;
  r=r||0;
  if(x<r||y<r||x>L.w-r||y>L.h-r) return true;
  const rr=Math.min(r,12); // xem ghi chú đầu file: nới foot/blocks tối đa 12px
  for(const o of L.objects){
    const f=o.foot;
    if(!f||!f.w||!f.h) continue; // foot 0x0 (cầu, ruộng) = đi được
    if(x>=o.x+f.x-rr&&x<=o.x+f.x+f.w+rr&&y>=o.y+f.y-rr&&y<=o.y+f.y+f.h+rr) return true;
  }
  // Nước: chỉ chặn khi điểm nằm TRONG đa giác. Cầu nằm đúng lỗ hổng giữa
  // các đa giác nên điểm trên cầu tự do — không cần ngoại lệ cầu riêng.
  for(const poly of L.water){
    if(townInPoly(x,y,poly)) return true;
  }
  for(const b of L.blocks){
    if(x>=b.x-rr&&x<=b.x+b.w+rr&&y>=b.y-rr&&y<=b.y+b.h+rr) return true;
  }
  return false;
}

/* ---- ảnh (cache một lần) / khối màu giữ chỗ ---- */
function townImg(asset){
  if(typeof ASSETS==='undefined'||!ASSETS) return null;
  if(townImgCache[asset]!==undefined) return townImgCache[asset];
  const src=ASSETS[asset];
  if(!src){ townImgCache[asset]=null; return null; }
  if(typeof src==='object'&&src.img){ townImgCache[asset]={img:src.img,ready:!!src.ready}; return townImgCache[asset]; }
  if(typeof src!=='string'){ townImgCache[asset]=null; return null; }
  const entry={img:null,ready:false};
  try{
    const im=new Image();
    entry.img=im;
    im.onload=function(){ entry.ready=true; if(asset.indexOf('tile_')===0) townGroundCache={}; };
    im.src=src;
  }catch(err){ townImgCache[asset]=null; return null; }
  townImgCache[asset]=entry;
  return entry;
}
/* Vẽ 1 object: có ảnh thì vẽ ảnh (đáy ảnh = chân, giữa đáy = x,y),
   thiếu ảnh thì vẽ khối màu giữ chỗ đúng w,h. Trả về 'img' | 'place'. */
function townDrawObject(o){
  const im=townImg(o.asset);
  if(im&&im.ready&&im.img){ g.drawImage(im.img,o.x-o.w/2,o.y-o.h,o.w,o.h); return 'img'; }
  const x=o.x, y=o.y, w=o.w, h=o.h, a=o.asset||'';
  g.save();
  if(a.indexOf('t_')===0){ // cây: thân nâu + tán tròn xanh
    const top=y-h+70;
    g.fillStyle='#5d4a33'; g.fillRect(x-7,top+40,14,y-top-40);
    g.fillStyle=a.indexOf('t_cherry')===0?'#b0707f':(a.indexOf('t_bamboo')===0?'#5d7a4a':'#4a6b3f');
    g.beginPath(); g.arc(x,top+55,Math.min(w,h)*0.32,0,TAU); g.fill();
    g.beginPath(); g.arc(x-w*0.22,top+85,Math.min(w,h)*0.24,0,TAU); g.fill();
    g.beginPath(); g.arc(x+w*0.22,top+85,Math.min(w,h)*0.24,0,TAU); g.fill();
  }else if(a.indexOf('s_bridge')===0){ // cầu: dải nâu nhạt + lan can 2 bên
    g.fillStyle='#a98f68'; g.fillRect(x-w/2,y-26,w,52);
    g.fillStyle='#7d6547'; g.fillRect(x-w/2,y-34,w,8); g.fillRect(x-w/2,y+26,w,8);
    g.fillStyle='#8a6f4d';
    for(let i=0;i<=4;i++){ const bx=x-w/2+8+i*(w-16)/4; g.fillRect(bx-3,y-34,6,68); }
  }else if(a==='s_field'){ // ruộng: ô nâu + luống
    g.fillStyle='#6b543a'; g.fillRect(x-w/2,y-h,w,h);
    g.strokeStyle='#4e3d2a'; g.lineWidth=4;
    for(let i=1;i<4;i++){ g.beginPath(); g.moveTo(x-w/2+8,y-h+i*h/4); g.lineTo(x+w/2-8,y-h+i*h/4); g.stroke(); }
  }else if(a.indexOf('s_stall')===0){ // sạp: hộp + mái
    g.fillStyle='#7d6547'; g.fillRect(x-w/2,y-70,w,70);
    g.fillStyle='#a34d3a'; g.beginPath(); g.moveTo(x-w/2-8,y-70); g.lineTo(x+w/2+8,y-70); g.lineTo(x,y-150); g.closePath(); g.fill();
  }else if(a.indexOf('s_dummy')===0){ // hình nộm: cọc + thanh ngang
    g.fillStyle='#5d4a33'; g.fillRect(x-5,y-150,10,150);
    g.fillRect(x-45,y-130,90,10);
    g.fillStyle='#c9a86a'; g.beginPath(); g.arc(x,y-160,14,0,TAU); g.fill();
  }else if(a==='s_rack'){ // giá binh khí: hộp thấp
    g.fillStyle='#6b543a'; g.fillRect(x-w/2,y-60,w,60);
    g.fillStyle='#3a2f24'; g.fillRect(x-w/2+10,y-90,w-20,8);
  }else if(a.indexOf('p_lantern')===0){ // đèn lồng: hộp nhỏ đỏ cam
    g.fillStyle='#a34d3a'; g.fillRect(x-14,y-110,28,60);
    g.fillStyle='#e8c98b'; g.beginPath(); g.arc(x,y-80,8,0,TAU); g.fill();
    g.fillStyle='#3a2f24'; g.fillRect(x-2,y-140,4,30);
  }else if(a.indexOf('p_fence')===0||a.indexOf('p_rail')===0){ // hàng rào / lan can đá: hộp thấp dài
    g.fillStyle=a.indexOf('p_rail')===0?'#8a8578':'#7d6547';
    g.fillRect(x-w/2,y-36,w,36);
  }else if(a.indexOf('p_bush')===0){ // bụi: bầu xanh
    g.fillStyle='#4a6b3f'; g.beginPath(); g.ellipse(x,y-28,w/2,26,0,0,TAU); g.fill();
  }else if(a.indexOf('r_rock')===0){ // đá: bầu xám
    g.fillStyle='#8a8578'; g.beginPath(); g.ellipse(x,y-24,w/2,22,0,0,TAU); g.fill();
  }else if(a.indexOf('p_banner')===0){ // cờ: cột + vải
    g.fillStyle='#3a2f24'; g.fillRect(x-3,y-h,6,h);
    g.fillStyle='#a34d3a'; g.fillRect(x+3,y-h+10,44,54);
  }else if(a==='p_crate'){ g.fillStyle='#7d6547'; g.fillRect(x-w/2,y-h,w,h);
  }else if(a==='p_barrel'){ g.fillStyle='#6b543a'; g.beginPath(); g.ellipse(x,y-34,w/2,34,0,0,TAU); g.fill();
  }else{ // nhà / công trình: hộp + mái tam giác (+ cửa giữa dưới)
    const bw=w*0.8, bh=h*0.62, bx=x-bw/2, by=y-bh;
    g.fillStyle=a==='b_gate'?'#6b543a':'#7d6547'; g.fillRect(bx,by,bw,bh);
    g.fillStyle=a==='b_gate'?'#4e3d2a':'#5d4a33';
    g.beginPath(); g.moveTo(bx-14,by); g.lineTo(x,by-(h-bh)); g.lineTo(bx+bw+14,by); g.closePath(); g.fill();
    if(a.indexOf('b_')===0&&a!=='b_gate'&&a!=='b_board'&&a!=='b_well'){
      g.fillStyle='#2e2422'; g.fillRect(x-26,y-96,52,96);
    }
    if(a==='b_well'){ g.fillStyle='#8a8578'; g.beginPath(); g.arc(x,y-40,34,0,TAU); g.fill(); g.fillStyle='#2e2422'; g.beginPath(); g.arc(x,y-40,20,0,TAU); g.fill(); }
  }
  g.restore();
  return 'place';
}

/* ---- nền: cache từng ô 512px ---- */
var TOWN_GROUND_COLORS={grass_a:'#67795a',grass_b:'#7d8f66',stone:'#a99b7e',soil:'#6b543a',sand:'#cdbA89',dirt:'#8a6f4d',water:'#3b7779'};
function townGroundTile(tx,ty){
  const key=tx+','+ty;
  if(townGroundCache[key]) return townGroundCache[key];
  const cv=document.createElement('canvas');
  cv.width=TOWN_TILE; cv.height=TOWN_TILE;
  const d=cv.getContext('2d');
  const ox=tx*TOWN_TILE, oy=ty*TOWN_TILE;
  const L=townLayout();
  d.save();
  d.beginPath(); d.rect(0,0,TOWN_TILE,TOWN_TILE); d.clip();
  d.translate(-ox,-oy);
  d.fillStyle=TOWN_GROUND_COLORS.grass_a; d.fillRect(ox,oy,TOWN_TILE,TOWN_TILE);
  // tiles (vẽ theo thứ tự, sau đè trước)
  for(const t of L.tiles){
    const col=TOWN_GROUND_COLORS[t.tile]||TOWN_GROUND_COLORS.grass_a;
    const im=townImg('tile_'+t.tile);
    d.beginPath();
    t.poly.forEach(function(pt,i){ if(i===0)d.moveTo(pt[0],pt[1]); else d.lineTo(pt[0],pt[1]); });
    d.closePath();
    if(im&&im.ready&&im.img&&d.createPattern){ d.save(); d.clip(); d.fillStyle=d.createPattern(im.img,'repeat'); d.fillRect(ox,oy,TOWN_TILE,TOWN_TILE); d.restore(); }
    else{ d.fillStyle=col; d.fill(); }
  }
  // paths: viền tối rộng hơn rồi lõi màu
  d.lineCap='round'; d.lineJoin='round';
  for(const pa of L.paths){
    const col=TOWN_GROUND_COLORS[pa.tile]||TOWN_GROUND_COLORS.dirt;
    for(const pass of [{w:pa.width+10,c:'rgba(20,26,18,.28)'},{w:pa.width,c:col}]){
      d.strokeStyle=pass.c; d.lineWidth=pass.w;
      d.beginPath();
      pa.points.forEach(function(pt,i){ if(i===0)d.moveTo(pt[0],pt[1]); else d.lineTo(pt[0],pt[1]); });
      d.stroke();
    }
  }
  // water
  for(const poly of L.water){
    d.beginPath();
    poly.forEach(function(pt,i){ if(i===0)d.moveTo(pt[0],pt[1]); else d.lineTo(pt[0],pt[1]); });
    d.closePath();
    d.fillStyle=TOWN_GROUND_COLORS.water; d.fill();
    d.strokeStyle='rgba(255,255,255,.18)'; d.lineWidth=3;
    d.beginPath(); d.moveTo(poly[0][0],poly[0][1]); d.lineTo(poly[1][0],poly[1][1]); d.stroke();
  }
  // decals phẳng (cỏ/đá vụn)
  for(const dc of (L.decals||[])){
    d.fillStyle='rgba(20,26,18,.10)';
    d.beginPath(); d.ellipse(dc.x,dc.y,dc.w/2,dc.h/2,0,0,TAU); d.fill();
  }
  // đốm cỏ li ti (giả ngẫu nhiên cố định theo ô, chỉ vẽ 1 lần vào cache)
  let seed=((tx+1)*374761393+(ty+1)*668265263)>>>0;
  const rnd=function(){ seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
  for(let i=0;i<36;i++){
    d.fillStyle=rnd()<0.5?'rgba(20,26,18,.06)':'rgba(255,255,255,.05)';
    d.beginPath(); d.arc(ox+rnd()*TOWN_TILE,oy+rnd()*TOWN_TILE,2+rnd()*3,0,TAU); d.fill();
  }
  d.restore();
  townGroundCache[key]=cv;
  townStats.groundCreated++;
  return cv;
}

/* ---- NPC trong thôn (vị trí mới, theo điểm layout) ----
   V47T_NPCS cũ (1600,1400)/(640,1420) nằm GIỮA SÔNG ở layout mới nên
   không dùng; NPC đứng ngay phía nam cửa của điểm tương tác (điểm +40y):
   Trưởng lão ở cửa Đại điện, Thương nhân ở cửa tiệm. */
function townNPCs(){
  const L=townLayout();
  if(!L) return [];
  const defs=[{id:'inn',name:'Trưởng lão Thanh Thạch',kind:'npc'},{id:'shop',name:'Thương nhân Linh Dược',kind:'shop'}];
  const out=[];
  for(const dd of defs){
    const pt=L.points.find(function(q){ return q.id===dd.id; });
    if(pt) out.push({id:dd.id,name:dd.name,x:pt.x,y:pt.y+40,kind:dd.kind});
  }
  return out;
}
/* Danh sách vẽ y-sort (đã lọc theo khung camera + lề 200, xếp theo y chân).
   Dùng chung cho townDrawWorld và để test kiểm thứ tự. */
/* Xếp danh sách vẽ theo y chân tăng dần (dùng chung cho townBuildDrawList
   và để test kiểm thứ tự trên danh sách mẫu). */
function townSortDrawList(list){
  list.sort(function(a,b){ return a.y-b.y||(a.kind<b.kind?-1:1); });
  return list;
}
function townBuildDrawList(vx0,vy0,vx1,vy1){
  const L=townLayout();
  const list=[];
  if(L){
    for(const o of L.objects){
      if(o.x+o.w/2<vx0||o.x-o.w/2>vx1||o.y<vy0||o.y-o.h>vy1){ townStats.objectsCulled++; continue; }
      list.push({kind:'obj',y:o.y,o:o});
    }
  }
  for(const n of townNPCs()){
    if(n.x>=vx0&&n.x<=vx1&&n.y>=vy0&&n.y<=vy1) list.push({kind:'npc',y:n.y,n:n});
  }
  if(V47T&&V47T.x>=vx0&&V47T.x<=vx1&&V47T.y>=vy0&&V47T.y<=vy1) list.push({kind:'hero',y:V47T.y});
  if(typeof townLifeDrawEntries==='function') townLifeDrawEntries(list,vx0,vy0,vx1,vy1);
  return townSortDrawList(list);
}
function townRectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){
  return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
}
/* Vẽ toàn bộ lớp thế giới thôn mới. Gọi TRONG ngữ cảnh đã translate(-cam)
   của v47tDraw live (PATCH), thay cho v471MapArt + cổng + điểm + hero cũ. */
function townDrawWorld(){
  const L=townLayout();
  if(!L) return false;
  const cam=V47T.cam;
  const vx0=cam.x-200, vy0=cam.y-200, vx1=cam.x+W+200, vy1=cam.y+H+200;
  townStats.groundTiles=0; townStats.objectsDrawn=0; townStats.objectsCulled=0;
  townStats.npcsDrawn=0; townStats.heroDrawn=0; townStats.occluded=0;
  g.save();
  g.beginPath(); g.rect(0,0,L.w,L.h); g.clip(); // cắt tràn mép (Đại điện, cổng)
  const tx0=Math.max(0,Math.floor(vx0/TOWN_TILE)), tx1=Math.min(Math.ceil(L.w/TOWN_TILE)-1,Math.floor(vx1/TOWN_TILE));
  const ty0=Math.max(0,Math.floor(vy0/TOWN_TILE)), ty1=Math.min(Math.ceil(L.h/TOWN_TILE)-1,Math.floor(vy1/TOWN_TILE));
  for(let ty=ty0;ty<=ty1;ty++) for(let tx=tx0;tx<=tx1;tx++){
    g.drawImage(townGroundTile(tx,ty),tx*TOWN_TILE,ty*TOWN_TILE);
    townStats.groundTiles++;
  }
  const heroRect={x:V47T.x-36,y:V47T.y-104,w:72,h:112};
  const list=townBuildDrawList(vx0,vy0,vx1,vy1);
  for(const e of list){
    if(e.kind==='hero'){ v47tDrawHero(); townStats.heroDrawn++; continue; }
    if(e.kind==='npc'){
      const n=e.n;
      g.fillStyle=n.kind==='npc'?'#e8c98b':'#79e3a5';
      g.beginPath(); g.arc(n.x,n.y,16,0,TAU); g.fill();
      g.strokeStyle='#101014'; g.lineWidth=2; g.stroke();
      g.fillStyle='#f2e5c9'; g.font='bold 15px sans-serif'; g.textAlign='center';
      g.fillText(n.name,n.x,n.y-26);
      townStats.npcsDrawn++;
      continue;
    }
    if(e.kind==='life'){ if(typeof townLifeDrawEntry==='function') townLifeDrawEntry(e); townStats.lifeDrawn=(townStats.lifeDrawn||0)+1; continue; }
    const o=e.o;
    // Vật thể đứng TRƯỚC người chơi (y chân lớn hơn) mà đè lên hình người
    // thì vẽ mờ alpha .5 để dễ nhìn; chỉ mờ sprite đó, không mờ nhân vật.
    const inFront=o.y>V47T.y&&townRectsOverlap(o.x-o.w/2,o.y-o.h,o.w,o.h,heroRect.x,heroRect.y,heroRect.w,heroRect.h);
    if(inFront){ g.save(); g.globalAlpha=0.5; townDrawObject(o); g.restore(); townStats.occluded++; }
    else townDrawObject(o);
    townStats.objectsDrawn++;
  }
  // Cổng + điểm + đường dẫn + mục tiêu (giữ nguyên hành vi v47tDraw live cũ)
  const gt=V47T_MAP.gates[0];
  g.strokeStyle=v46CanEnter(gt.to).ok?'#7df0d8':'#e8a0a0';
  g.lineWidth=3;
  g.beginPath(); g.ellipse(gt.x,gt.y,46+Math.sin(V47T.clock*3)*4,21,0,0,TAU); g.stroke();
  for(const n of V471_NODES){
    circle(n.x,n.y,7,'#dfc18b','#213731');
    if(dist(n,V47T)<370){
      g.font='bold 15px sans-serif'; g.textAlign='center';
      g.strokeStyle='#152723'; g.lineWidth=4; g.strokeText(n.name,n.x,n.y-23);
      g.fillStyle='#fff1d4'; g.fillText(n.name,n.x,n.y-23);
    }
  }
  if(V47T.path&&V47T.path.length){
    g.save(); g.setLineDash([6,7]); g.strokeStyle='#f1d99b'; g.lineWidth=2;
    g.beginPath(); g.moveTo(V47T.x,V47T.y);
    for(const q of V47T.path) g.lineTo(q.x,q.y);
    g.stroke(); g.restore();
  }
  if(V47T.goal){ g.strokeStyle='#e8c98b'; g.lineWidth=2; g.beginPath(); g.arc(V47T.goal.x,V47T.goal.y,12,0,TAU); g.stroke(); }
  g.restore();
  return true;
}
/* Thống kê frame vừa vẽ (để test hiệu năng). */
function townFrameStats(){
  return {groundTiles:townStats.groundTiles, groundCreated:townStats.groundCreated,
    objectsDrawn:townStats.objectsDrawn, objectsCulled:townStats.objectsCulled,
    npcsDrawn:townStats.npcsDrawn, heroDrawn:townStats.heroDrawn, occluded:townStats.occluded};
}

/* ---- bản đồ M / bản đồ nhỏ: vẽ thu nhỏ từ layout ---- */
function townDrawMapBg(x,y,w,h){
  const L=townLayout();
  if(!L) return false;
  const sx=w/L.w, sy=h/L.h;
  g.fillStyle='#657755'; g.fillRect(x,y,w,h);
  for(const poly of L.water){
    g.beginPath();
    poly.forEach(function(pt,i){ const px=x+pt[0]*sx, py=y+pt[1]*sy; if(i===0)g.moveTo(px,py); else g.lineTo(px,py); });
    g.closePath(); g.fillStyle='#3b7779'; g.fill();
  }
  for(const t of L.tiles){
    if(t.tile!=='stone'&&t.tile!=='soil') continue;
    g.beginPath();
    t.poly.forEach(function(pt,i){ const px=x+pt[0]*sx, py=y+pt[1]*sy; if(i===0)g.moveTo(px,py); else g.lineTo(px,py); });
    g.closePath(); g.fillStyle=t.tile==='stone'?'#a99b7e':'#6b543a'; g.fill();
  }
  g.lineCap='round';
  for(const pa of L.paths){
    g.strokeStyle=pa.tile==='stone'?'#a99b7e':'#8a6f4d';
    g.lineWidth=Math.max(2,pa.width*sx);
    g.beginPath();
    pa.points.forEach(function(pt,i){ const px=x+pt[0]*sx, py=y+pt[1]*sy; if(i===0)g.moveTo(px,py); else g.lineTo(px,py); });
    g.stroke();
  }
  // khối nhà / công trình / cây (thu nhỏ)
  for(const o of L.objects){
    const px=x+o.x*sx, py=y+o.y*sy;
    if(o.asset.indexOf('t_')===0){ g.fillStyle='#4a6b3f'; g.beginPath(); g.arc(px,py,Math.max(1.5,o.w*sx/2),0,TAU); g.fill(); continue; }
    g.fillStyle=o.asset.indexOf('b_')===0?'#7d6547':(o.asset.indexOf('s_bridge')===0?'#a98f68':'#8a6f4d');
    g.fillRect(px-o.w*sx/2,py-o.h*sy,o.w*sx,Math.max(1.5,o.h*sy));
  }
  return true;
}
function townDrawMapPoints(x,y,w,h,labels){
  const L=townLayout();
  if(!L) return false;
  const project=function(n){ return {x:x+n.x/L.w*w,y:y+n.y/L.h*h}; };
  for(const n of V471_NODES){
    const z=project(n);
    circle(z.x,z.y,labels?5:2.5,'#e2bf80','#132421');
    if(labels) v33Fit(n.name,z.x,z.y-12,135,11,V45.paper,'center');
  }
  const gt=V47T_MAP.gates[0], gz=project(gt);
  g.save(); g.translate(gz.x,gz.y); g.rotate(Math.PI/4);
  g.fillStyle='#75e8d6'; g.strokeStyle='#132421'; g.lineWidth=2;
  const s=labels?6:3.5; g.fillRect(-s,-s,s*2,s*2); g.strokeRect(-s,-s,s*2,s*2);
  g.restore();
  if(labels) v33Fit('Cổng Thanh Trúc Lâm',gz.x,gz.y-12,135,11,V45.paper,'center');
  const z=project(V47T);
  circle(z.x,z.y,labels?6:3,'#fff7c9','#102c2b');
  return true;
}

/* ---- init: áp layout ngay khi nạp (data/ nạp trước src/), không chờ frame đầu.
   townMapReady() cũng tự áp ở lần gọi đầu nên thứ tự nạp có lệch vẫn đúng. ---- */
if(TOWN_NEW&&typeof V471_NODES!=='undefined'&&typeof V47T_MAP!=='undefined') townMapReady();
