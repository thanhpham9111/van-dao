'use strict';
// M1 — T42 Văn bản thế giới (GÓI 03).
// Chỉ tạo file mới này; không sửa file có sẵn, không bọc đè hàm.
// Chen hành vi bằng FRAME_HOOKS.overlay; chỗ cần sửa hàm có sẵn ghi PATCH
// ở ops/patches/MUSE_03_M1.json (v42PerfLoadingDraw src/44, v21Tooltip_L03
// src/20, thẻ data/lore.js trong index.html).
// Dữ liệu: DATA.lore (data/lore.js). Ảnh: ASSETS["loading_<vùng>"].
// Kiểu mực đêm: nền mực gần đen #14110e ~85%, chữ giấy #efe6d4,
// chỉ vàng #c9a86a tiết chế. Không xanh ngọc, không khung bo tròn viền vàng.
let v63Warned=false,v63Off=false,v63TipIdx=-1,v63TipSessions=-1;
const v63Imgs={};
const V63_INK='rgba(20,17,14,0.85)',V63_PAPER='#efe6d4',V63_GOLD='#c9a86a',V63_MUTED='#b5a18b';

// DATA.lore thiếu -> console.warn một lần rồi tắt module.
function v63Lore(){
  if(v63Off)return null;
  const l=(typeof DATA!=='undefined'&&DATA)?DATA.lore:null;
  if(!l||typeof l!=='object'){
    if(!v63Warned){v63Warned=true;console.warn('[M1 lore] DATA.lore thiếu — tắt module thơ vùng / mẹo / lore tooltip.');}
    v63Off=true;return null;
  }
  return l;
}
// Hai câu thơ của vùng (DATA.lore.regions[id].verse), hoặc null.
function v63Verse(id){
  const l=v63Lore();if(!l||!l.regions)return null;
  const r=l.regions[id];
  return (r&&Array.isArray(r.verse)&&r.verse.length>=2)?r.verse:null;
}
// Tra lore chung: kind 'equipment' | 'relics' | 'techs' | 'sets'.
function v63LoreFor(kind,key){
  const l=v63Lore();if(!l||!l[kind]||key===undefined||key===null)return null;
  const s=l[kind][String(key)];
  return (typeof s==='string'&&s)?s:null;
}
// Vẽ 1 dòng lore chữ nghiêng màu phụ, tự ngắt tối đa 2 dòng trong bề rộng w.
// (x,y) là tâm dòng đầu; dòng 2 (nếu có) lệch +14px.
function v63DrawLoreLine(s,x,y,w){
  if(!s)return false;
  g.save();
  g.font='italic 11px V45Sans, "Segoe UI", Arial, sans-serif';
  g.textAlign='center';g.textBaseline='middle';
  g.fillStyle=(typeof V21!=='undefined'&&V21.muted)?V21.muted:V63_MUTED;
  const words=String(s).split(/\s+/),lines=[''];
  for(const wd of words){
    const t=lines[lines.length-1]?lines[lines.length-1]+' '+wd:wd;
    if(g.measureText(t).width<=w||!lines[lines.length-1])lines[lines.length-1]=t;
    else if(lines.length<2)lines.push(wd);
    else break;
  }
  const n=Math.min(2,lines.length),y0=y-(n-1)*7;
  for(let i=0;i<n;i++)g.fillText(lines[i],x,y0+i*14);
  g.restore();
  return true;
}
// --- (c) Lore tooltip: gọi từ PATCH trong v21Tooltip_L03 (src/20) ---
// Trang bị -> DATA.lore.equipment[id]; không có thì bộ -> DATA.lore.sets[key].
// Vẽ ở dải trống cuối tooltip: y+h-20 (không v30), y+h-42 (có dải tinh luyện
// v30 ở y+h-26). Dải này trống vì L00 kẹp danh sách so sánh chừa 37px cuối.
function v63TooltipLore(it,x,y,w,ground){
  if(!it)return false;
  let s=null;
  const d=(typeof gearDef==='function')?gearDef(it):null;
  if(d)s=v63LoreFor('equipment',d.id);
  if(!s&&d&&d.v29Set)s=v63LoreFor('sets',d.v29Set);
  if(!s)return false;
  let dl=0;
  try{dl=(typeof v21Diff==='function')?v21Diff(it).length:0;}catch(e){dl=0;}
  const aff=(it.affixes&&it.affixes.length)?it.affixes.length:1;
  const h=ground?Math.min(390,215+Math.max(1,aff)*17+Math.min(4,dl)*16):420;
  return v63DrawLoreLine(s,x+w/2,y+h-(it.v30?42:20),w-28);
}
// --- (b) Mẹo xoay vòng: 1 mẹo mỗi phiên màn tải ---
// Phiên mới = V42_PERF.warm.sessions tăng (src/44 tăng khi bắt đầu warmup).
// Chỉ số lưu ở p.loreTip (save cũ thiếu -> mặc định 0).
function v63Tip(){
  const l=v63Lore();if(!l||!Array.isArray(l.tips)||!l.tips.length)return '';
  const sess=(typeof V42_PERF!=='undefined'&&V42_PERF.warm)?V42_PERF.warm.sessions:-1;
  if(sess!==v63TipSessions){
    v63TipSessions=sess;
    if(typeof p!=='undefined'&&p){
      if(typeof p.loreTip!=='number')p.loreTip=0;
      v63TipIdx=((p.loreTip%l.tips.length)+l.tips.length)%l.tips.length;
    }
    if(v63TipIdx<0)v63TipIdx=0;
    v63TipIdx=(v63TipIdx+1)%l.tips.length;
    if(typeof p!=='undefined'&&p)p.loreTip=v63TipIdx;
  }
  return l.tips[v63TipIdx]||'';
}
// Ảnh loading: ASSETS[...] là URL (chuỗi) -> cache Image; nếu đã là đối
// tượng ảnh (test) thì dùng thẳng. Chưa tải xong -> null (rơi về màn tải cũ).
function v63Img(name){
  if(v63Imgs[name])return v63Imgs[name];
  const src=(typeof ASSETS!=='undefined')?ASSETS[name]:undefined;
  if(!src)return null;
  if(typeof src==='object'){v63Imgs[name]=src;return src;}
  if(typeof Image!=='function')return null;
  const im=new Image();im.src=src;v63Imgs[name]=im;return im;
}
function v63ImgReady(im){return !!im&&im.complete!==false&&!!im.naturalWidth;}
// --- (b) Màn tải / chuyển vùng: gọi từ PATCH đầu v42PerfLoadingDraw ---
// Vẽ phủ cover 1280x720, dải y 540-720 tối dần, 1 mẹo + thanh tải.
// Trả true = đã vẽ xong (PATCH return sớm); false = ảnh chưa sẵn -> màn cũ.
function v63LoadingDraw(now){
  const l=v63Lore();if(!l)return false;
  const id=(typeof p!=='undefined'&&p&&p.mapId)?p.mapId:'thon';
  const im=v63Img('loading_'+id);
  if(!v63ImgReady(im))return false;
  let f=0,idx=0,total=0;
  if(typeof V42_PERF!=='undefined'&&V42_PERF.warm){
    const w=V42_PERF.warm;total=w.total||0;idx=w.index||0;
    f=total?clamp(idx/total,0,1):0;
  }
  const iw=im.naturalWidth||1600,ih=im.naturalHeight||900;
  const sc=Math.max(W/iw,H/ih),dw=iw*sc,dh=ih*sc;
  g.save();
  g.drawImage(im,(W-dw)/2,(H-dh)/2,dw,dh);
  const band=g.createLinearGradient(0,540,0,720);
  band.addColorStop(0,'rgba(20,17,14,0.45)');
  band.addColorStop(1,'rgba(20,17,14,0.93)');
  g.fillStyle=band;g.fillRect(0,540,W,180);
  const tip=v63Tip();
  g.font='bold 11px V45Sans, "Segoe UI", Arial, sans-serif';
  g.textAlign='center';g.textBaseline='middle';
  g.fillStyle=V63_GOLD;g.fillText('MẸO',640,566);
  g.save();
  g.font='15px V45Sans, "Segoe UI", Arial, sans-serif';
  g.fillStyle=V63_PAPER;
  const words=String(tip).split(/\s+/),lines=[''];
  for(const wd of words){
    const t=lines[lines.length-1]?lines[lines.length-1]+' '+wd:wd;
    if(g.measureText(t).width<=920||!lines[lines.length-1])lines[lines.length-1]=t;
    else if(lines.length<2)lines.push(wd);
    else break;
  }
  for(let i=0;i<Math.min(2,lines.length);i++)g.fillText(lines[i],640,592+i*20);
  g.restore();
  g.fillStyle='#0e0c09';g.fillRect(440,648,400,10);
  g.strokeStyle=V63_GOLD;g.lineWidth=1;g.strokeRect(440.5,648.5,400,10);
  if(f>0){g.fillStyle=V63_GOLD;g.fillRect(441,649,398*f,8);}
  g.font='12px V45Sans, "Segoe UI", Arial, sans-serif';
  g.fillStyle=V63_PAPER;
  g.fillText('Đang chuẩn bị · '+Math.floor(f*100)+'%'+(total?' · '+idx+'/'+total+' khu vực':''),640,682);
  g.restore();
  return true;
}
// --- (a) Thơ vùng: vẽ qua FRAME_HOOKS.overlay ---
// Kích hoạt khi worldTitle>0 (màn chuyển vùng src/04, 3.5s) hoặc owTitle>0
// (tiêu đề vùng src/47, 3s); mờ dần theo cùng công thức alpha của game.
// Vị trí theo đúng chỗ tên vùng đang hiện: thôn V47T (tên y110) -> y166/190;
// splash ngoài thôn (tên y575, phụ y603) -> y630/654; chỉ còn tiêu đề HUD
// (tên y64, ảnh splash chưa sẵn) -> y106/128, có nền mực để không đè toast.
function v63SplashReady(){
  if(typeof imgs==='undefined')return false;
  const mi=(typeof V22_ORDER!=='undefined')?V22_ORDER.indexOf((typeof p!=='undefined'&&p&&p.mapId)?p.mapId:'thon'):-1;
  const pm=imgs['v47map'+(mi<0?0:mi)];
  return !!(pm&&pm.ready);
}
function v63DrawVerse(){
  if(v63Lore()===null)return;
  if(typeof p==='undefined'||!p||!p.worldMode)return;
  if(typeof modal!=='undefined'&&modal)return;
  if(typeof V48X!=='undefined'&&V48X.active)return;
  if(typeof v36Inside==='function'&&v36Inside())return;
  const wt=(typeof worldTitle==='number')?worldTitle:0;
  const ot=(typeof owTitle==='number')?owTitle:0;
  if(wt<=0&&ot<=0)return;
  const verse=v63Verse(p.mapId||'thon');
  if(!verse)return;
  const a=Math.max(
    clamp((3.5-wt)*4,0,1)*clamp(wt,0,1),
    clamp((3-ot)/.2,0,1)*clamp(ot/.4,0,1)
  );
  if(a<=0.01)return;
  let y1,y2,pill=false;
  if(typeof v47tIsActive==='function'&&v47tIsActive()){y1=166;y2=190;}
  else{y1=158;y2=180;pill=true;} // Claude: luôn dưới tên vùng + dải thông báo phía trên, không đè thanh kỹ năng dưới đáy
  g.save();
  g.globalAlpha=a;
  if(pill){
    g.font='italic 15px V45Sans, "Segoe UI", Arial, sans-serif';
    const w=Math.max(g.measureText(verse[0]).width,g.measureText(verse[1]).width)+36;
    g.fillStyle=V63_INK;
    if(typeof g.roundRect==='function'){g.beginPath();g.roundRect(640-w/2,y1-28,w,56,4);g.fill();}
    else g.fillRect(640-w/2,y1-28,w,56);
  }
  g.font='italic 15px V45Sans, "Segoe UI", Arial, sans-serif';
  g.textAlign='center';g.textBaseline='middle';
  g.fillStyle=V63_PAPER;
  g.fillText(verse[0],640,y1);
  g.fillText(verse[1],640,y2);
  g.restore();
}
if(typeof FRAME_HOOKS!=='undefined'&&FRAME_HOOKS.overlay)FRAME_HOOKS.overlay.push(v63DrawVerse);
