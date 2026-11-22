'use strict';
// M2 — T16 Hội thoại NPC thật (12 NPC × 3 lần gặp). GÓI 05.
// Chỉ tạo file mới này; không bọc đè hàm. Chen hành vi bằng FRAME_HOOKS.update
// (chữ chạy + phím) và PATCH: v8Talk (src/05, mở hội thoại mới thay bảng npc8),
// panelLegacy (src/47, vẽ modal kind 'dialogue'), resume() (src/48, migration
// thiện cảm), thẻ data/dialogues.js + src/70_dialogue.js trong index.html.
// Dữ liệu: DATA.dialogues (data/dialogues.js, version 1). Ảnh chân dung:
// ASSETS["portrait_<id>"] (12 ảnh đã có trong ops/ASSETS_LIST.txt); data ghi
// portrait:null cho cả 12 NPC nghĩa là "dùng ảnh game", KHÔNG phải "không có ảnh".
// Thiếu dữ liệu hợp lệ hoặc thiếu cả hai nguồn ảnh (ASSETS portrait + imgs npc)
// thì dlgTryOpen() trả false để v8Talk giữ bảng NPC cũ npc8.
// Thiện cảm dùng p.v8Relations có sẵn (như v8Bond/v8Panel), KHÔNG tạo p.favor mới:
// migration batch01_addendum §2 áp lên p.v8Relations (10 NPC mới, không inn/shop).
// Khung kiểu giấy A: vẽ trong panel() nên uiPaperBegin/End tự đổi màu; ảnh không đổi.
// Không phủ tấm màu multiply/screen lên thoại/modal/HUD. Không tạo phím mới:
// Click/Space/Enter = hiện hết rồi câu sau · 1–4 = chọn · Tab = Việc khác · ESC = đóng.
// Bố cục theo spec dialogue.md §2.1 (1280×720) + dialogue_addendum.md §3
// (nút "Việc khác [Tab]" x1036,y382,w128,h38; ô thiện cảm dời sang x772,y382,w256).
let dlgWarned=false,dlgOff=false;
const dlgValidated={}; // id -> npc data đã duyệt, hoặc false (lỗi -> fallback npc8)
const dlgImgCache={}; // tên asset -> Image/đối tượng ảnh đã phân giải
const DLG={open:false,npc:null,meeting:null,node:null,nodeId:null,committed:false,
 t:0,revealT:0,shown:0,revealDone:false,choiceAt:0,lines:[],lineClusters:[],lineCum:[],
 totalClusters:0,cumTimes:[],favorToast:0,favorToastN:0,suppress:false,pendingShop:false,textSize:18};
// 10 NPC mới trong migration thiện cảm (batch01_addendum §2) — không inn/shop.
const DLG_MIGRATE_NPCS=['sentry','herbalist','wanderer','bambooKeeper','mountainHunter',
 'snowHermit','swampMedic','desertSmith','demonWatcher','ghostSeer'];
const DLG_FX_KEYS=['talked','favor','setFlag','openShop','stones','pills','xp'];
const DLG_COND_KEYS=['favorMin','levelMin','stonesMin','pillsMin'];
const DLG_SEAL={'inn':'長','shop':'藥'}; // ấn chữ fallback khi ảnh chưa tải kịp (§2.2)
// ---- bố cục (spec §2.1) ----
const DLG_FRAME={x:24,y:408,w:1232,h:288};
const DLG_PORTRAIT={x:40,y:192,w:288,h:456};
const DLG_PLINTH={x:48,y:648,w:272,h:24};
const DLG_NAME={x:344,y:382,w:392,h:38};
const DLG_FAVOR={x:772,y:382,w:256,h:38};
const DLG_OTHER={x:1036,y:382,w:128,h:38};
const DLG_ESC={x:1172,y:382,w:60,h:38};
const DLG_TEXT={x:344,y:434,w:864,h:66};
const DLG_CHOICE={x:344,y:510,w:864,h:34,gap:38};
const DLG_NEXT={x:1036,y:602,w:172,h:48};
const DLG_HINT={x:344,y:668,w:864,h:18};

// ---------- dữ liệu ----------
function dlgData(){
 if(dlgOff)return null;
 const d=(typeof DATA!=='undefined'&&DATA)?DATA.dialogues:null;
 if(!d||typeof d!=='object'||!d.npcs||typeof d.npcs!=='object'){
  if(!dlgWarned){dlgWarned=true;console.warn('[M2 dialogue] DATA.dialogues thiếu — tắt module hội thoại, giữ bảng npc8.');}
  dlgOff=true;return null;
 }
 return d;
}
// Duyệt 1 NPC: meetings đúng thứ tự, start + mọi next trỏ node có thật hoặc null,
// choices 2–4, cond/effects đúng enum. Lỗi cấu trúc -> false (fallback npc8).
function dlgNpc(id){
 if(Object.hasOwn(dlgValidated,id))return dlgValidated[id]||null;
 const d=dlgData(),bad=(why)=>{
  if(!dlgWarned||!dlgValidated['warn:'+id]){console.warn('[M2 dialogue] NPC '+id+' bỏ qua: '+why);}
  dlgValidated['warn:'+id]=true;dlgValidated[id]=false;return null;};
 if(!d)return null;
 const npc=d.npcs[id];
 if(!npc||typeof npc!=='object')return bad('không có trong DATA.dialogues.npcs');
 if(!Array.isArray(npc.meetings)||!npc.meetings.length)return bad('thiếu meetings');
 const seen={};
 for(const m of npc.meetings){
  if(!m||typeof m.id!=='string'||!m.id)return bad('meeting thiếu id');
  if(seen[m.id])return bad('trùng meeting id '+m.id);
  seen[m.id]=true;
  if(!m.when||typeof m.when!=='object')return bad(m.id+': thiếu when');
  if(!m.nodes||typeof m.nodes!=='object')return bad(m.id+': thiếu nodes');
  if(typeof m.start!=='string'||!m.nodes[m.start])return bad(m.id+': start không trỏ node có thật');
  for(const [nid,n] of Object.entries(m.nodes)){
   if(!n||typeof n.text!=='string'||!n.text)return bad(m.id+'/'+nid+': thiếu text');
   if(n.text.length>140)console.warn('[M2 dialogue] '+m.id+'/'+nid+': text dài '+n.text.length+' ký tự (>140), vẫn hiện đủ.');
   if(n.next!==undefined&&n.next!==null&&!m.nodes[n.next])return bad(m.id+'/'+nid+': next trỏ node không có');
   if(n.choices!==undefined){
    if(!Array.isArray(n.choices)||n.choices.length<2||n.choices.length>4)
     return bad(m.id+'/'+nid+': choices phải 2–4, đang có '+(Array.isArray(n.choices)?n.choices.length:'?'));
    for(const c of n.choices){
     if(!c||typeof c.text!=='string'||!c.text)return bad(m.id+'/'+nid+': choice thiếu text');
     if(c.next!==undefined&&c.next!==null&&!m.nodes[c.next])return bad(m.id+'/'+nid+': choice next trỏ node không có');
     if(c.cond)for(const k of Object.keys(c.cond))if(!DLG_COND_KEYS.includes(k))return bad(m.id+'/'+nid+': cond lạ '+k);
     if(c.effects)for(const k of Object.keys(c.effects))if(!DLG_FX_KEYS.includes(k))return bad(m.id+'/'+nid+': effect lạ '+k);
    }
   }
   if(n.effects)for(const k of Object.keys(n.effects))if(!DLG_FX_KEYS.includes(k))return bad(m.id+'/'+nid+': effect lạ '+k);
   if(n.cond)for(const k of Object.keys(n.cond))if(!DLG_COND_KEYS.includes(k))return bad(m.id+'/'+nid+': cond lạ '+k);
  }
 }
 dlgValidated[id]=npc;return npc;
}
// ---------- chân dung ----------
// ASSETS["portrait_<id>"] là URL (chuỗi) hoặc đối tượng ảnh như v63Img (src/63).
function dlgResolveImg(name){
 if(dlgImgCache[name]!==undefined)return dlgImgCache[name];
 let out=null;
 const src=(typeof ASSETS!=='undefined')?ASSETS[name]:undefined;
 if(src){
  if(typeof src==='object'&&src.img){out=src.img;}
  else if(typeof src==='object'&&src.naturalWidth){out=src;}
  else if(typeof src==='string'&&typeof Image==='function'){
   const im=new Image();im.src=src;out=im;
  }
 }
 dlgImgCache[name]=out;return out;
}
function dlgImgReady(im){return !!im&&im.complete!==false&&!!im.naturalWidth;}
// Có ảnh để vẽ không: portrait riêng, nếu không thì sprite npc (imgs['npc_'+id])
// như dialogue_addendum §5 (vẽ tối đa 2×). Cả hai đều không có -> fallback npc8.
function dlgHasPortrait(id){
 if(dlgResolveImg('portrait_'+id))return true;
 const a=(typeof imgs!=='undefined')?imgs['npc_'+id]:null;
 return !!(a&&a.ready&&a.img);
}
// Trả {im, maxScale} để vẽ contain trong khung chân dung, hoặc null.
function dlgPortraitImg(id){
 const a=dlgResolveImg('portrait_'+id);
 if(a)return {im:a,maxScale:0};
 const b=(typeof imgs!=='undefined')?imgs['npc_'+id]:null;
 if(b&&b.ready&&b.img)return {im:b.img,maxScale:2};
 return null;
}
// ---------- trạng thái ----------
function dlgFavor(id){return clamp((p.v8Relations&&p.v8Relations[id])||0,0,100);}
function dlgCondOk(cond){
 if(!cond)return true;
 if(cond.favorMin!==undefined&&dlgFavor(DLG.npc)<cond.favorMin)return false;
 if(cond.levelMin!==undefined&&(p.level||1)<cond.levelMin)return false;
 if(cond.stonesMin!==undefined&&(p.stones||0)<cond.stonesMin)return false;
 if(cond.pillsMin!==undefined&&(p.pills||0)<cond.pillsMin)return false;
 return true;
}
function dlgPickMeeting(npc,id){
 const talked=!!(p.v12Talk&&p.v12Talk[id]);
 for(const m of npc.meetings){
  const w=m.when||{};let ok=true;
  if('talkedBefore' in w)ok=ok&&(w.talkedBefore===talked);
  if('flag' in w)ok=ok&&!!(p.flags&&p.flags[w.flag]===true);
  if('notFlag' in w)ok=ok&&!(p.flags&&p.flags[w.notFlag]===true);
  for(const k of Object.keys(w))
   if(!['talkedBefore','flag','notFlag'].includes(k)){ok=false;console.warn('[M2 dialogue] '+m.id+': when lạ '+k+', bỏ qua meeting này.');}
  if(ok)return m;
 }
 return null;
}
// Tách theo cụm grapheme để không làm rời dấu tiếng Việt (Intl.Segmenter, fallback [...s]).
let dlgSegmenter=null;
function dlgClusters(s){
 try{
  if(!dlgSegmenter&&typeof Intl!=='undefined'&&Intl.Segmenter)dlgSegmenter=new Intl.Segmenter('vi',{granularity:'grapheme'});
  if(dlgSegmenter)return [...dlgSegmenter.segment(String(s))].map(x=>x.segment);
 }catch(e){}
 return [...String(s)];
}
// Ngắt dòng theo bề rộng (giống wrapText) để chữ không nhảy dòng khi lộ dần.
function dlgWrapLines(s,size,mw){
 const words=String(s).split(' '),lines=[];let cur='';
 g.font=size+'px V45Sans,"Segoe UI",Arial,sans-serif';
 for(const w of words){const nx=cur?cur+' '+w:w;
  if(g.measureText(nx).width>mw&&cur){lines.push(cur);cur=w;}else cur=nx;}
 if(cur)lines.push(cur);
 return lines;
}
// Vào node mới: ngắt dòng sẵn (18px, tối đa 3 dòng; dài quá thì 16px), tính thời gian reveal.
function dlgEnterNode(nodeId){
 const n=DLG.meeting.nodes[nodeId];
 if(!n){dlgClose();return;}
 DLG.node=n;DLG.nodeId=nodeId;DLG.committed=false;
 DLG.revealT=0;DLG.shown=0;DLG.revealDone=false;DLG.choiceAt=0;
 let size=18,lines=dlgWrapLines(n.text,size,DLG_TEXT.w);
 if(lines.length>3){size=16;lines=dlgWrapLines(n.text,size,DLG_TEXT.w);}
 DLG.textSize=size;DLG.lines=lines;
 DLG.lineClusters=lines.map(dlgClusters);
 DLG.lineCum=[];let acc=0;
 for(const lc of DLG.lineClusters){acc+=lc.length;DLG.lineCum.push(acc);}
 DLG.totalClusters=acc;
 // 28ms/cụm, +70ms sau dấu kết câu; tổng tối đa 4,5s (co lại nếu vượt).
 const all=dlgClusters(n.text),times=[];let t=0;
 for(const c of all){t+=0.028;times.push(t);if(/[.!?…]/.test(c))t+=0.07;}
 if(t>4.5){const k=4.5/t;for(let i=0;i<times.length;i++)times[i]*=k;}
 DLG.cumTimes=times;
}
// ---------- mở / đóng ----------
// Được v8Talk (đã PATCH) gọi trước khi đặt modal npc8. Trả true = đã mở hội thoại mới.
function dlgTryOpen(o){
 if(DLG.suppress||dlgOff)return false;
 const id=o&&o.id;if(!id||typeof V8_INFO==='undefined'||!V8_INFO[id])return false;
 const npc=dlgNpc(id);if(!npc)return false;
 if(!dlgHasPortrait(id))return false; // thiếu ảnh -> giữ bảng npc8 cũ
 if(!p)return false;
 p.v8Relations??={};p.v8Quests??={};p.flags??={};p.v12Talk??={};
 const m=dlgPickMeeting(npc,id);
 if(!m||!m.nodes[m.start])return false;
 DLG.open=true;DLG.npc=id;DLG.meeting=m;DLG.t=0;DLG.favorToast=0;DLG.favorToastN=0;
 modal={kind:'dialogue',npc:id};
 dlgEnterNode(m.start);
 return true;
}
function dlgClose(){
 DLG.open=false;DLG.node=null;DLG.meeting=null;DLG.npc=null;
 if(modal&&modal.kind==='dialogue')modal=null;
}
// Mở bảng npc8 cũ của NPC (nút "Việc khác" / openShop): đi qua v8Talk thật để
// lớp V12/V13/V36 chạy đúng như trước; cờ suppress ngăn v8Talk mở lại hội thoại mới.
function dlgOpenLegacy(id){
 if(!id)return;
 const wasOpen=DLG.open;
 DLG.open=false;DLG.node=null;DLG.meeting=null;DLG.npc=null;
 modal=null;
 DLG.suppress=true;
 try{if(typeof v8Talk==='function')v8Talk({id});}finally{DLG.suppress=false;}
 if(!modal&&wasOpen){/* v8Talk bị chặn (vd cửa V36): thoại đã đóng, không mở lại */}
}
// ---------- commit effect (chỉ khi xác nhận rời node — §3.3) ----------
function dlgCommitEffects(fx){
 if(!fx)return false;
 const id=DLG.npc;let changed=false;
 if(fx.talked){
  p.v12Talk??={};p.v12Talk[id]=true;
  if(typeof v12Check==='function')v12Check(); // đúng 3 lệnh addendum §2 (đặt cờ + check + save cuối commit)
  changed=true;
 }
 if(typeof fx.favor==='number'&&fx.favor!==0){
  p.v8Relations??={};
  const before=dlgFavor(id),after=clamp(before+fx.favor,0,100);
  p.v8Relations[id]=after;
  if(after>before){DLG.favorToastN=after-before;DLG.favorToast=0.9;}
  changed=true;
 }
 if(typeof fx.setFlag==='string'){p.flags??={};p.flags[fx.setFlag]=true;changed=true;}
 if(typeof fx.stones==='number'&&fx.stones!==0){p.stones=Math.max(0,(p.stones||0)+fx.stones);changed=true;}
 if(typeof fx.pills==='number'&&fx.pills!==0){p.pills=Math.max(0,(p.pills||0)+fx.pills);changed=true;}
 if(typeof fx.xp==='number'&&fx.xp>0&&typeof gainXP==='function'){gainXP(fx.xp);changed=true;}
 if(fx.openShop)DLG.pendingShop=true;
 return changed;
}
function dlgCommitNode(){
 if(DLG.committed||!DLG.node)return false;
 DLG.committed=true;
 const changed=dlgCommitEffects(DLG.node.effects);
 if(changed&&typeof save==='function')save();
 return changed;
}
// ---------- tiến thoại ----------
function dlgRevealAll(){
 DLG.revealT=1e9;DLG.shown=DLG.totalClusters;DLG.revealDone=true;DLG.choiceAt=DLG.t;
}
function dlgAdvance(){
 if(!DLG.open||!DLG.node)return;
 if(!DLG.revealDone){dlgRevealAll();return;} // bấm đầu chỉ hiện hết, không chuyển
 if(DLG.node.choices&&DLG.node.choices.length)return; // node có lựa chọn: chờ click/phím số
 DLG.pendingShop=false;
 dlgCommitNode();
 if(DLG.pendingShop){DLG.pendingShop=false;const id=DLG.npc;dlgClose();dlgOpenLegacy(id);return;}
 if(DLG.node.next)dlgEnterNode(DLG.node.next);
 else dlgClose();
}
function dlgChoose(i){
 if(!DLG.open||!DLG.node||!DLG.revealDone)return;
 if(DLG.t-DLG.choiceAt<0.1)return; // choices hiện 100ms mới nhận input
 const ch=DLG.node.choices&&DLG.node.choices[i];
 if(!ch||!dlgCondOk(ch.cond))return; // lựa chọn không đủ điều kiện: không effect, không chuyển
 DLG.pendingShop=false;
 dlgCommitNode(); // node rồi choice, đúng một lượt (§3.3)
 dlgCommitEffects(ch.effects);
 if(typeof save==='function')save();
 if(DLG.pendingShop){DLG.pendingShop=false;const id=DLG.npc;dlgClose();dlgOpenLegacy(id);return;}
 if(ch.next)dlgEnterNode(ch.next);
 else dlgClose();
}
// ---------- update (FRAME_HOOKS.update: chạy sau update(), trước khi pressed bị xoá) ----------
function dlgUpdate(dt){
 if(DLG.open&&(!modal||modal.kind!=='dialogue')){DLG.open=false;return;} // đóng từ nơi khác (vd ESC ở thôn): bỏ, không commit
 if(!DLG.open||!modal||modal.kind!=='dialogue')return;
 DLG.t+=dt;
 if(DLG.favorToast>0)DLG.favorToast=Math.max(0,DLG.favorToast-dt);
 if(!DLG.revealDone){
  DLG.revealT+=dt;
  let n=0;while(n<DLG.cumTimes.length&&DLG.cumTimes[n]<=DLG.revealT)n++;
  DLG.shown=n;
  if(n>=DLG.totalClusters){DLG.revealDone=true;DLG.choiceAt=DLG.t;}
 }
 if(typeof pressed==='undefined')return;
 if(pressed.Escape){delete pressed.Escape;dlgClose();return;}
 if(pressed.Tab){delete pressed.Tab;dlgOpenLegacy(DLG.npc);return;}
 if(pressed.Enter||pressed.Space){delete pressed.Enter;delete pressed.Space;dlgAdvance();return;}
 for(let i=1;i<=4;i++)if(pressed['Digit'+i]){delete pressed['Digit'+i];dlgChoose(i-1);}
}
if(typeof FRAME_HOOKS!=='undefined'&&FRAME_HOOKS.update)FRAME_HOOKS.update.push(dlgUpdate);
// ---------- migration thiện cảm cho save cũ (batch01_addendum §2, trên p.v8Relations) ----------
function dlgMigrateFavor(){
 if(!p)return false;
 p.v8Relations??={};p.v12Talk??={};
 let changed=false;
 for(const id of DLG_MIGRATE_NPCS){
  if(p.v12Talk[id]===true&&!Object.hasOwn(p.v8Relations,id)){p.v8Relations[id]=5;changed=true;}
 }
 if(changed&&typeof save==='function')save();
 return changed;
}
function resume_L19(){const r=resume_L18();if(p&&mode==='play'){try{dlgMigrateFavor();}catch(e){console.error('dlgMigrateFavor',e);}}return r;}
// ---------- vẽ (gọi từ panelLegacy khi modal.kind==='dialogue', trong uiPaperBegin) ----------
function dlgDraw(){
 if(!DLG.open||!DLG.node||!modal||modal.kind!=='dialogue')return;
 const d=V8_INFO[DLG.npc];
 if(!d){dlgClose();return;}
 const npcSpeaker=DLG.node.speaker!=='player';
 const name=npcSpeaker?d.role+' '+d.name:(p.v8Name||'Vô Danh');
 // Lớp phủ tối + khung giấy (không multiply/screen).
 g.fillStyle='rgba(16,11,19,0.45)';g.fillRect(0,0,W,H);
 box(DLG_FRAME.x,DLG_FRAME.y,DLG_FRAME.w,DLG_FRAME.h,'#100b13','#e3b96f',4);
 // Chân dung lớn bên trái, contain, không kéo méo.
 const pr=DLG_PORTRAIT;
 box(pr.x,pr.y,pr.w,pr.h,'#16282c','#c9a86a',6);
 const pic=dlgPortraitImg(DLG.npc);
 const readyIm=pic&&dlgImgReady(pic.im)?pic.im:null;
 if(readyIm){
  const iw=readyIm.naturalWidth||1,ih=readyIm.naturalHeight||1;
  let s=Math.min(pr.w/iw,pr.h/ih);
  if(pic.maxScale>0)s=Math.min(s,pic.maxScale);
  const dw=iw*s,dh=ih*s,dx=pr.x+(pr.w-dw)/2,dy=pr.y+(pr.h-dh)/2;
  g.save();if(!npcSpeaker)g.globalAlpha=0.72;
  g.drawImage(readyIm,dx,dy,dw,dh);g.restore();
 }else{
  const seal=DLG_SEAL[DLG.npc];
  if(seal){g.save();g.font='44px V18Serif, serif';g.textAlign='center';g.textBaseline='middle';
   g.fillStyle='#e3b96f';g.fillText(seal,pr.x+pr.w/2,pr.y+pr.h/2);g.restore();}
 }
 box(DLG_PLINTH.x,DLG_PLINTH.y,DLG_PLINTH.w,DLG_PLINTH.h,'#100b13','rgba(201,168,106,0.35)',3);
 // Ấn tên (đỏ son) + thiện cảm + Việc khác + Esc.
 box(DLG_NAME.x,DLG_NAME.y,DLG_NAME.w,DLG_NAME.h,'rgba(241,132,116,0.90)','#e3b96f',3);
 let nameSize=20;
 g.font='bold 20px V45Sans,"Segoe UI",Arial,sans-serif';
 if(g.measureText(name).width>DLG_NAME.w-24)nameSize=18;
 text(name,DLG_NAME.x+DLG_NAME.w/2,DLG_NAME.y+DLG_NAME.h/2,nameSize,'#100b13','center','bold');
 const fv=dlgFavor(DLG.npc);
 box(DLG_FAVOR.x,DLG_FAVOR.y,DLG_FAVOR.w,DLG_FAVOR.h,'#100b13','rgba(201,168,106,0.45)',3);
 text('Thiện cảm: '+fv+'/100',DLG_FAVOR.x+12,DLG_FAVOR.y+DLG_FAVOR.h/2,14,C.jade,'left');
 box(DLG_FAVOR.x+150,DLG_FAVOR.y+16,68,5,'#142126','#2d3c40',2);
 if(fv>0)box(DLG_FAVOR.x+150,DLG_FAVOR.y+16,Math.max(2,68*fv/100),5,C.jade,'',2);
 addButton(DLG_OTHER.x,DLG_OTHER.y,DLG_OTHER.w,DLG_OTHER.h,'Việc khác · Tab',()=>dlgOpenLegacy(DLG.npc));
 addButton(DLG_ESC.x,DLG_ESC.y,DLG_ESC.w,DLG_ESC.h,'Esc',()=>dlgClose());
 // "Thiện cảm +N" 900ms sau commit, chỉ khi modal còn mở.
 if(DLG.favorToast>0){
  g.save();g.globalAlpha=DLG.favorToast>0.2?1:DLG.favorToast/0.2;
  text('Thiện cảm +'+DLG.favorToastN,1032,364,13,C.jade,'center');g.restore();
 }
 // Nội dung thoại: chỉ hiện số cụm đã lộ (dòng đã ngắt sẵn từ đầu).
 const ts=DLG.textSize||18,lh=ts===18?22:20;
 let remain=DLG.shown;
 for(let li=0;li<DLG.lines.length;li++){
  const lc=DLG.lineClusters[li]||[];
  const take=Math.max(0,Math.min(remain,lc.length));
  if(take>0)text(lc.slice(0,take).join(''),DLG_TEXT.x,DLG_TEXT.y+11+li*lh,ts,C.paper,'left');
  remain-=lc.length;if(remain<=0&&take<lc.length)break;
 }
 // Hitbox vùng chữ: bấm = hiện hết / (đã hết mà có lựa chọn thì không làm gì).
 buttons.push({x:DLG_TEXT.x,y:DLG_TEXT.y,w:DLG_TEXT.w,h:DLG_TEXT.h,fn:dlgAdvance});
 if(DLG.revealDone){
  const chs=DLG.node.choices;
  if(chs&&chs.length){
   const canPick=DLG.t-DLG.choiceAt>=0.1;
   chs.forEach((c,i)=>{
    const y=DLG_CHOICE.y+i*DLG_CHOICE.gap,ok=dlgCondOk(c.cond);
    const hov=typeof mouse!=='undefined'&&mouse.x>=DLG_CHOICE.x&&mouse.x<=DLG_CHOICE.x+DLG_CHOICE.w&&mouse.y>=y&&mouse.y<=y+DLG_CHOICE.h;
    box(DLG_CHOICE.x,y,DLG_CHOICE.w,DLG_CHOICE.h,
     ok?(hov?'#62442b':'#2b2417'):'#100b13',
     ok?(hov?'#f5d897':'rgba(201,168,106,0.45)'):'rgba(181,161,139,0.30)',3);
    text(String(i+1),DLG_CHOICE.x+12,y+DLG_CHOICE.h/2,14,ok?C.gold:C.muted,'left','bold');
    text(c.text,DLG_CHOICE.x+44,y+DLG_CHOICE.h/2,14,ok?C.paper:C.muted,'left');
    if(canPick)buttons.push({x:DLG_CHOICE.x,y,w:DLG_CHOICE.w,h:DLG_CHOICE.h,fn:()=>dlgChoose(i)});
   });
  }else{
   addButton(DLG_NEXT.x,DLG_NEXT.y,DLG_NEXT.w,DLG_NEXT.h,
    DLG.node.next?'Tiếp · Enter':'Kết thúc · Enter',()=>dlgAdvance(),true);
  }
 }
 // Hướng dẫn.
 const hint=!DLG.revealDone?'Click / Enter / Space: hiện hết · Esc: đóng · Tab: Việc khác'
  :(DLG.node.choices&&DLG.node.choices.length?'Click hoặc 1–4: chọn · Esc: đóng · Tab: Việc khác'
  :(DLG.node.next?'Enter / Space: Tiếp · Esc: đóng · Tab: Việc khác':'Enter / Space: Kết thúc · Esc: đóng · Tab: Việc khác'));
 text(hint,DLG_HINT.x,DLG_HINT.y+9,12,C.muted,'left');
}
