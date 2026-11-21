'use strict';
// V45 presentation layers, using the existing controls and world geometry.
const V45 = {
  ink:'#182724', deep:'#101f1c', panel:'#1d2f2a', paper:'#F0E6D2', soft:'#8fa08e',
  gold:'#B88961', edge:'#B8896155', jade:'#A2B299', red:'#e98776', blue:'#86c3e4'
};
const V45_BOXES = {
  identity:{x:24,y:24,w:312,h:112}, map:{x:1024,y:24,w:232,h:124},
  quest:{x:1024,y:160,w:232,h:132}, target:{x:408,y:14,w:464,h:83},
  dock:{x:414,y:638,w:452,h:58}, left:{x:24,y:646,w:234,h:46},
  nav:{x:950,y:610,w:306,h:82}, feed:{x:24,y:544,w:300,h:86}
};
// T11 — palette Design Bible cho HUD (§2 spec T10): chỉ dùng cho chữ/vạch HUD
// viết mới; các mặt panel chung (v45Surface/v45Button) giữ màu V45 cũ.
const V45_SPEC={ink:'#100b13',paper:'#f1e4cf',gold:'#e3b96f',jade:'#a8d6c5',muted:'#b5a18b',red:'#f18474'};
const V45_TIPS={}; // id -> {since} : theo dõi thời gian hover cho tooltip (§11)
// Tooltip HUD (§11): h28, y574, rộng theo chữ tối đa 180px; hiện sau 350ms hover, fade-in 120ms.
function v45Tip(id,x,y,w,h,label){
  if(v35Editing()){delete V45_TIPS[id];return;}
  if(!v33Over(x,y,w,h)){delete V45_TIPS[id];return;}
  const t=V45_TIPS[id]||(V45_TIPS[id]={since:elapsed}),dt=elapsed-t.since;
  if(dt<.35)return;
  const a=clamp((dt-.35)/.12,0,1),tw=clamp(label.length*7+21,56,180),tx=clamp(x+w/2-tw/2,24,1256-tw);
  g.save();g.globalAlpha=a;
  v45Surface(tx,574,tw,28);
  v33Fit(label,tx+tw/2,588,tw-12,11,V45.paper,'center');
  g.restore();
}
// Tên nhân vật (§3): Serif 20px, tối đa 2 dòng (line-height 20px); dài thì thu 18→12px,
// vẫn dài thì chia 2 dòng, cùng lắm cắt '…' ở 12px. y = tâm hàng tên (một dòng).
// M09a: viền chữ ink 3px alpha 0.8 như v45Text (giữ font Serif, không dùng v18Title
// chỉ có bóng) để tên đọc rõ trên mọi nền. v45Name chỉ gọi từ v35Identity nên
// một chỗ sửa này phủ cả hai đường vẽ (thôn v47tDraw + ngoài thôn v35Render).
function v45NameText(t,x,y,size){
  const f='bold '+size+'px V18Serif, "DejaVu Serif", Georgia, "Segoe UI", Arial, serif';
  g.save();g.font=f;g.textAlign='left';g.textBaseline='middle';g.lineJoin='round';
  g.lineWidth=3;g.strokeStyle='rgba(16,11,19,0.8)';g.strokeText(String(t),x,y);
  g.fillStyle=V45_SPEC.paper;g.fillText(String(t),x,y);g.restore();
}
function v45Name(name,x,y,w){
  const serif=s=>'bold '+s+'px V18Serif, "DejaVu Serif", Georgia, "Segoe UI", Arial, serif';
  name=String(name||'Vô Danh');
  let size=20;
  g.save();g.font=serif(size);
  while(size>12&&g.measureText(name).width>w){size-=2;g.font=serif(size);}
  if(g.measureText(name).width<=w){g.restore();v45NameText(name,x,y,size);return;}
  const words=name.split(' ');
  const cut=s=>{let t=s;while(t.length>1&&g.measureText(t+'…').width>w)t=t.slice(0,-1);return t.length<s.length?t+'…':t;};
  if(words.length<2){const t=cut(name);g.restore();v45NameText(t,x,y,12);return;}
  const total=name.length;let l1='',i=0;
  for(;i<words.length;i++){const t=l1?l1+' '+words[i]:words[i];if(l1&&t.length>total/2)break;l1=t;}
  const l2=words.slice(i).join(' ')||words[words.length-1];
  g.font=serif(12);
  const a=cut(l1),b=cut(l2);
  g.restore();
  v45NameText(a,x,y-10,12);
  v45NameText(b,x,y+10,12);
}
// Một hàng HP/MP (§3): nhãn x100, thanh x128 w116 h6, số phải x336; độ dài nội suy 180ms;
// HP ≤25% nhấp viền 1.200ms. cy = tâm hàng.
function v45HpMpRow(label,x,cy,value,max,col,kind){
  const ratio=clamp(value/Math.max(1,max),0,1),now=elapsed;
  const k='_'+kind+'Disp',tk=k+'T',dt=Math.min(.1,now-(V45_HUB[tk]??now));V45_HUB[tk]=now;
  if(V45_HUB[k]==null)V45_HUB[k]=ratio;
  V45_HUB[k]+=(ratio-V45_HUB[k])*Math.min(1,dt/.18);
  v45Text(label,x,cy,12,V45_SPEC.paper,'left','bold');
  v45Text(Math.ceil(value)+' / '+Math.ceil(max),x+236,cy,12,V45_SPEC.paper,'right');
  v44Rect(x+28,cy-3,116,6,'#100b13bf',null,3);
  if(V45_HUB[k]>0)v44Rect(x+28,cy-3,Math.max(2,116*V45_HUB[k]),6,col,null,3);
  if(kind==='hp'&&ratio<=.25){
    g.save();g.globalAlpha=.45+.45*Math.sin(elapsed*TAU/1.2);
    g.strokeStyle=V45_SPEC.red;g.lineWidth=1;
    g.beginPath();g.roundRect(x+27,cy-4,118,8,3);g.stroke();g.restore();
  }
}
// Tu vi (§9): nhãn căn giữa y676–690, thanh mảnh y692 h4; độ dài nội suy 250ms;
// đủ tu vi thì phát sáng gold (chu kỳ 600ms). Thuộc nhóm dock, vẽ dưới đáy.
function v45XpBar(){
  const x=414,w=452,need=Math.max(1,xpNeed()),cap=p.level>=45;
  const ratio=cap?1:clamp(p.xp/need,0,1),now=elapsed;
  const dt=Math.min(.1,now-(V45_HUB._xpT??now));V45_HUB._xpT=now;
  if(V45_HUB._xpDisp==null)V45_HUB._xpDisp=ratio;
  V45_HUB._xpDisp+=(ratio-V45_HUB._xpDisp)*Math.min(1,dt/.25);
  v45Text(cap?'Tu vi · Đại viên mãn':'Tu vi '+Math.floor(p.xp)+' / '+need,640,683,12,V45_SPEC.paper,'center');
  v44Rect(x,692,w,4,'#100b13bf',null,2);
  if(V45_HUB._xpDisp>0)v44Rect(x,692,Math.max(2,w*V45_HUB._xpDisp),4,V45_SPEC.gold,null,2);
  if(!cap&&p.xp>=need){
    g.save();g.globalAlpha=.4+.4*Math.sin(elapsed*TAU/.6);
    g.strokeStyle=V45_SPEC.gold;g.lineWidth=1;
    g.beginPath();g.roundRect(x-1,691,w+2,6,3);g.stroke();g.restore();
  }
}
// Ngắt chữ thành tối đa maxLines dòng theo chiều rộng (đo bằng V45Sans); dòng dài
// hơn một từ thì để v33Fit cắt '…' khi vẽ.
function v45WrapLines(s,w,size,maxLines){
  const font=size+'px V45Sans, "Segoe UI", Arial, sans-serif';
  g.save();g.font=font;
  const words=String(s??'').split(' '),lines=[];let cur='';
  for(const wd of words){
    const t=cur?cur+' '+wd:wd;
    if(g.measureText(t).width>w&&cur){lines.push(cur);cur=wd;if(lines.length>=maxLines)break;}
    else cur=t;
  }
  if(lines.length<maxLines&&cur)lines.push(cur);
  g.restore();
  return lines;
}
// Ô chức năng chỉ-icon (§11): icon 24px căn giữa, badge phím góc trên-phải,
// không nhãn dưới icon; tooltip tên đầy đủ + phím thật (qua v45Tip, y574).
function v45IconCell(x,y,w,h,kind,key,label,fn,active=false){
  const over=v33Over(x,y,w,h),col=active||over?V45_SPEC.gold:V45_SPEC.muted;
  v45Surface(x,y,w,h,{active,edge:over?'#d7c18ea0':V45.edge});
  v35Icon(kind,x+w/2,y+h/2,16,col);
  if(key){
    const kw=Math.max(19,key.length*6+8);
    v44Rect(x+w-kw-2,y+2,kw,14,'#15171ce8','#ffffff32',4);
    text(key,x+w-kw/2-1,y+9,10,V45.paper,'center','bold');
  }
  buttons.push({x,y,w,h,fn,v35:key||label});
  if(label)v45Tip('cell:'+(key||label),x,y,w,h,label+(key?' · '+key:''));
}
// Chữ có viền ink (§2, góp ý Claude 07:07 — bóng 1px chưa đủ trên nền sáng):
// strokeText 3px ink alpha 0.8 rồi fillText; dùng cho chữ trần trên nền tranh.
function v45Text(t,x,y,size,col,align='left',weight='normal'){
  const f=(weight==='normal'?'':weight+' ')+size+'px V45Sans, "Segoe UI", Arial, sans-serif';
  g.save();g.font=f;g.textAlign=align;g.textBaseline='middle';g.lineJoin='round';
  g.lineWidth=3;g.strokeStyle='rgba(16,11,19,0.8)';g.strokeText(String(t),x,y);
  g.fillStyle=col;g.fillText(String(t),x,y);g.restore();
}
// Một ô tài nguyên (§10): icon 18px + số 13px; số dài thì thu tới 12px, tooltip đầy đủ.
function v45ResourceCell(x,y,w,kind,amount,unit){
  if(kind==='stone')diamond(g,x+10,y+14,5,V45_SPEC.gold);
  else uiIcon(3,x+1,y+5,18);
  const s=String(v41HUDNum(amount));
  let size=13;
  g.save();g.font='bold '+size+'px V45Sans, "Segoe UI", Arial, sans-serif';
  while(size>12&&g.measureText(s).width>w-30){size--;g.font='bold '+size+'px V45Sans, "Segoe UI", Arial, sans-serif';}
  g.restore();
  text(s,x+26,y+14,size,V45_SPEC.paper,'left','bold');
  v45Tip('res:'+kind,x,y,w,28,amount+' '+unit);
}
for (const [k,b] of Object.entries(V45_BOXES)) Object.assign(V35_GROUPS[k],b);
Object.assign(V44UI,{ivory:V45.paper,muted:V45.soft,gold:V45.gold,gold2:'#90754a',jade:V45.jade,red:V45.red,blue:V45.blue,edge:V45.edge,dark:V45.ink,surface:V45.panel});
Object.assign(H35,{gold:V45.gold,edge:V45.edge,ink:V45.ink,paper:V45.paper,muted:V45.soft,jade:V45.jade});
Object.assign(H33,{gold:V45.gold,edge:V45.edge,ink:V45.ink,bright:V45.paper,muted:V45.soft,jade:V45.jade});
Object.assign(H34,{gold:V45.gold,line:V45.edge,paper:V45.paper,muted:V45.soft,jade:V45.jade});
Object.assign(V42HUD,{bronze:V45.gold,bright:'#f7d897',edge:V45.edge,ink:V45.ink,paper:V45.paper,muted:V45.soft,jade:V45.jade,red:V45.red});
Object.assign(V21,{gold:V45.gold,silver:V45.edge,paper:V45.paper,muted:V45.soft,green:V45.jade,red:V45.red});

const V46_SURF_CACHE=new Map();
function v45Surface(x,y,w,h,{active=false,edge=V45.edge,solid=false}={}){
  const _sk=y+'|'+h+'|'+(active?1:0)+'|'+(solid?1:0);let grad=V46_SURF_CACHE.get(_sk);if(!grad){grad=g.createLinearGradient(0,y,0,y+h);
  grad.addColorStop(0,active?'#52442cec':solid?'#1a2b29':'#21322deb');
  grad.addColorStop(1,active?'#292a20fa':solid?'#111d1d':'#101b1cef');V46_SURF_CACHE.set(_sk,grad);}
  v44Rect(x,y,w,h,grad,edge,Math.min(8,h*.18));
}
function v45Frame(x,y,w,h,edge=V45.edge,active=false){
  v45Surface(x,y,w,h,{active,edge:active?'#ddbd809c':edge===V45.edge?edge:v42HUDAlpha(edge,'70')});
}
v42HUDFrame=v45Frame;v35Plate=v45Frame;v34Panel=v45Frame;v21Frame=v45Frame;
v41PFrame=function(x,y,w,h,active=false){v45Frame(x,y,w,h,V45.edge,active);};
// v18Frame: khung chung của mọi bảng (T46). Bản V45 là bản chạy thật; các bản V18/V25/V44 trước đây bị ghi đè đã xoá.
function v18Frame(x,y,w,h,opts={}){v45Frame(x,y,w,h,opts.edge||V45.edge,!!opts.active);}

ornament=function(x,y,w,h){v45Frame(x,y,w,h);};
v42HUDShell=function(title,sub){
  g.fillStyle='#071011cc';g.fillRect(0,0,W,H);
  v45Surface(20,21,1240,678,{solid:true});
  v18Title(title,42,52,27,V45.paper);
  if(sub)v33Fit(sub,43,81,818,12,V45.soft);
  v44Rule(42,99,1196,V45.edge);
};
function v45Button(x,y,w,h,label,key,fn,{primary=false,icon=null,id=label,size=13}={}){
  const over=v33Over(x,y,w,h);
  v45Surface(x,y,w,h,{active:primary,edge:over?'#efd599cc':primary?'#d8b37393':V45.edge});
  if(icon)v35Icon(icon,x+17,y+h/2,12,primary||over?V45.gold:V45.soft);
  const kw=key?Math.max(19,key.length*6+8):0,l=icon?34:12;
  v33Fit(label,x+l,y+h/2,w-l-(key?kw+10:8),size,V45.paper,'left',primary||over?'bold':'normal');
  if(key)v44Key(x+w-kw-8,y+(h-19)/2,kw,key,primary?V45.gold:V45.soft);
  buttons.push({x,y,w,h,fn,v35:id});
}
function v45Day(){
  const {hour}=hdSun();
  return String(Math.floor(hour)).padStart(2,'0')+':'+String(Math.floor(hour%1*60)).padStart(2,'0');
}
const V45_HUB={owner:null,combat:false,site:null,townRaster:null};
function v45Hub(){
  return !!(p?.worldMode&&!v36Inside()&&p.mapId==='thon'&&v16InTown(p.x,p.y,60));
}
function v45CombatHUD(){
  return V45_HUB.combat||v42tActive()||!!v34Target()||!!(V26.action||V26.stage||V26.hits);
}
function v45Resource(x,y,w,name,v,max,col){
  text(name,x,y,11,col,'left','bold');
  text(Math.ceil(v)+' / '+Math.ceil(max),x+w,y,12,V45.paper,'right','bold');
  v44Bar(x,y+11,w,8,v,max,col);
}
// v35Identity: định nghĩa duy nhất (gộp 4 lớp ở T02b). T11 (§3): không khung nền lớn,
// tên/cảnh giới/chiến lực tách riêng, HP/MP hai hàng riêng; tu vi và linh thạch/đan
// chuyển xuống đáy (§9/§10). HP/MP ẩn khi chiến đấu, giữ HP/MP của dock gốc.
function v35Identity(s){
  const {x,y,w,h}=V45_BOXES.identity, col=V10_SCHOOLS[p.cls].color;
  // Lưu ý: tọa độ spec là TUYỆT ĐỐI; (x,y) là gốc box (24,24) nên offset = spec − gốc.
  v33Shield(x,y,w,h);
  v41HUDClassPortrait(p.cls,x+32,y+36,32,col);
  circle(x+32,y+36,35,'',V45_SPEC.gold);
  circle(x+54,y+58,11,'#0a1510',V45_SPEC.gold);
  text(String(p.level),x+54,y+58,11,'#fff0c9','center','bold');
  v45Name(p.v8Name||'Vô Danh',x+76,y+20,236);
  // Viền chữ ink 3px (§2, góp ý Claude 07:07 — bóng 1px chưa đủ trên nền sáng).
  v45Text(realm(),x+76,y+48,13,V45_SPEC.jade,'left');
  v45Text('CL '+v41HUDNum(v10FightPower(s)),x+76,y+63,12,V45_SPEC.gold,'left');
  if(!v45CombatHUD()){
    v45HpMpRow('HP',x+76,y+82,p.hp,Math.max(1,s.hp),V45_SPEC.red,'hp');
    v45HpMpRow('MP',x+76,y+102,p.mp,Math.max(1,s.mp),V45_SPEC.jade,'mp');
  }
  buttons.push({x,y,w,h,fn:v10Open,v35:'profile'});
}
// v35Status: định nghĩa duy nhất (gộp 4 lớp ở T02b).
function v35Status(){
  const data=[];
  if(p.poisonT>0)data.push(['Độc',p.poisonT,'#b6d98b']);
  if(p.fireT>0)data.push(['Cháy',p.fireT,V45.red]);
  if((p.v10Guard||p.guardT||0)>0)data.push(['Hộ thể',p.v10Guard||p.guardT,V45.gold]);
  if(v13Init().wardRemain>0)data.push(['Hộ phù',v13Init().wardRemain,V45.blue]);
  const y=140; // T11: ngay dưới cụm danh tính (kết thúc y136), không đè HP/MP nữa.
  data.forEach(([label,t,col],i)=>{
    v44Rect(24+i*64,y,61,20,'#142222ee',V45.edge,4);
    text(label+' '+Math.ceil(t)+'s',54+i*64,y+10,10,col,'center','bold');
  });
  if(p.level<45&&v22AtCap()&&p.xp>=xpNeed()&&p.worldMode)
    v45Button(24,y+(data.length?26:0),211,27,'Đột phá cảnh giới','B',v22Break,{primary:true,id:'break'});
}
function v45Square(x,y,label,id,action){
  const over=v33Over(x,y,23,22);
  v44Rect(x,y,23,22,over?'#3b473a':'#1b2b28',V45.edge,4);
  text(label,x+11.5,y+11,12,V45.paper,'center','bold');
  buttons.push({x,y,w:23,h:22,fn:action,v35:id});
}
// v35Map: định nghĩa duy nhất (gộp 5 lớp ở T02b). T11 (§5): ảnh minimap 100x64,
// thông tin vùng 3 dòng (tên tối đa 2 dòng), một nút Bản đồ 208x24. Bỏ đồng hồ
// và 2 nút phụ khỏi panel nhỏ theo spec (giờ không còn chỗ): phím O vẫn mở
// Khám phá, chuyển vùng/cục bộ xem ở bản đồ lớn (phím M).
function v35Map(){
  const {x,y,w,h}=V45_BOXES.map, s=v34State(), r=REG[p.mapId]||REG.thon, d=V22_REG[r.id];
  v45Surface(x,y,w,h);
  v33Shield(x,y,w,h);
  if(s.local)v34Local(x+12,y+12,100,64);
  else v33Mini(x+12,y+12,100,64);
  v44Label('B',x+62,y+20,10,V45.gold);
  buttons.push({x:x+12,y:y+12,w:100,h:64,fn:()=>openPanel('map'),v35:'bigmap'});
  const [state,col]=v22Danger(d);
  const lines=v45WrapLines(r.name,98,13,2).map(t=>({t,size:13,col:V45.paper}));
  lines.push({t:d.i?state:'Khu an toàn',size:12,col:d.i?col:V45.jade});
  lines.push({t:d.i?('Cấp '+d.min+'–'+d.max):('Cấp '+p.level),size:12,col:V45.soft});
  lines.forEach((L,i)=>v33Fit(L.t,x+122,y+20+i*17,98,L.size,L.col,'left'));
  v45Button(x+12,y+88,208,24,v45Hub()?'Sơ đồ thôn':'Bản đồ','M',()=>openPanel('map'),{id:'map',size:13});
}
function v45Quest(){
  const {x,y}=V45_BOXES.quest, t=v12Tracked(), expanded=v34State().quest;
  const nameLines=t?v45WrapLines(t.goal,208,14,4):[], extra=(nameLines.length-1)*16;
  const h=!expanded?40:(!t?(p.v451Result?132:62):132+extra);
  v45Surface(x,y,232,h);
  v33Shield(x,y,232,h);
  diamond(g,x+11,y+21,3.5,V45.gold);
  v18Title('Thiên mệnh',x+26,y+21,15,V45.gold,'left');
  g.fillStyle='#d8bb8255';g.fillRect(x+12,y+32,208,1);
  v45Square(x+166,y+8,expanded?'−':'+','questFold',()=>{v34State().quest=!expanded;save();});
  v45Square(x+198,y+8,'Q','questJournal',v12Open);
  if(!expanded)return;
  if(!t){
    const complete=p.v12Main>=V12_MAIN.length;
    text(complete?'Chính tuyến đã hoàn thành':'Chưa theo dõi nhiệm vụ',x+12,y+48,13,complete?V45.jade:V45.soft);
    if(p.v451Result)v45Button(x+12,y+96,208,32,'Tổng kết bí cảnh gần nhất',null,()=>modal={kind:'v451Result'},{id:'lastDungeonResult',size:11});
    return;
  }
  nameLines.forEach((ln,i)=>text(ln,x+12,y+48+i*16,14,V45.paper,'left','bold'));
  if(nameLines.join(' ')!==String(t.goal).replace(/\s+/g,' ').trim())v45Tip('questName',x+12,y+40,208,nameLines.length*16,t.goal);
  v44Bar(x+12,y+56+extra,208,5,v42QuestFraction(t),1,V45.gold);
  const q=v12Target(t),a=v36Inside(),training=t.action==='break',ready=training&&v30TrialEligible();
  const progress=t.kill||training||t.action==='skill'?v12Progress(t):a&&t.target===a.id?'Trong phòng':t.state==='active'&&t.target?'Chưa hoàn thành':V12_STATUS[t.state];
  v33Fit(progress,x+12,y+87+extra,208,12,V45_SPEC.jade);
  if(q&&!a)text('Cách '+Math.round(dist(q,p))+' bước',x+12,y+113+extra,12,V45_SPEC.muted);
  const label=t.action==='skill'?'Công pháp':ready?'Vượt thiên kiếp':training?'Đi tu luyện':'Dẫn đường';
  v45Button(x+120,y+100+extra,100,24,label,null,()=>v12Guide(t),{id:'questGuide',size:12});
}
// v35Quest: định nghĩa duy nhất (gộp 5 lớp ở T02b).
function v35Quest(){v45Quest();}


// Bảng mục tiêu: riêng sân luyện kiếm có giao diện V45, còn lại dùng v35TargetNormal. Gộp ở T02b.
function v35Target(){
  const target=v34Target();
  if(!target?.v42Practice||v35Editing())return v35TargetNormal();
  const {x,y,w}=V45_BOXES.target;
  v45Surface(x,y,w,46);
  v33Shield(x,y,w,46);
  text('Hình nhân luyện kiếm',x+13,y+15,15,V45.paper,'left','bold');
  text('Sân Luyện Kiếm',x+w-13,y+16,11,V45.jade,'right');
  text('F6 · Thống kê luyện tập',x+13,y+33,10,V45.soft);
}

// v35Dock: định nghĩa duy nhất (gộp 4 lớp ở T02b).
function v35Dock(s){
  const x=388,y=614,w=504,side=62,gap=8,xx=x+12,sy=y+31;
  const ranks=v11Levels(),cds=v11Cooldowns(),skills=V11_SKILLS[p.cls];
  const actions=[
    {key:'Chuột trái',name:'Đánh thường',icon:0,cd:p.atkCd||0,base:Math.max(.27,.39/s.rate),fn:()=>v33Aim(attack)},
    ...skills.slice(0,4).map((d,i)=>({key:i===0?'Chuột phải':d.key,name:d.name,d,rank:ranks[i],cd:cds[i],base:d.cd,fn:()=>v33Aim(()=>v11Cast(i))})),
    {key:'Space',name:'Khinh công',icon:2,cd:p.dashCd||0,base:s.dashCd,fn:()=>pressed.Space=true},
    {key:'H',name:'Hồi Xuân Đan',icon:3,count:p.pills,fn:heal}
  ];
  const _wg=g.createLinearGradient(0,y-6,0,y+94);_wg.addColorStop(0,'rgba(8,14,12,0)');_wg.addColorStop(1,'rgba(8,14,12,0.66)');g.fillStyle=_wg;g.fillRect(x-8,y-6,w+16,100);g.fillStyle='#d8bb8244';g.fillRect(x,y-2,w,1);
  v33Shield(x,y,w,88);
  v45Resource(x+12,y+10,232,'HP',p.hp,s.hp,V45.red);
  v45Resource(x+260,y+10,232,'MP',p.mp,s.mp,V45.blue);
  let tip=null;
  actions.forEach((a,i)=>{
    const bx=xx+i*(side+gap),cx=bx+side/2,cy=sy+21,col=a.d?.color||V45.gold;
    const locked=!!(a.d&&!a.rank),low=!!(a.d&&p.mp<a.d.cost),empty=a.count===0,cd=Math.max(0,a.cd||0),over=v33Over(bx-2,sy-8,side+4,62);
    const winding=V26.action?.kind==='skill'&&V26.action.i===i-1&&!V26.action.hit;
    const dim=locked||low||empty||cd>0;
    circle(cx,cy,28,'#101d1c',over?'#f6d699':locked?V45.edge:col);
    g.save();g.globalAlpha*=dim?.39:1;
    if(a.d)v11SkillIcon(a.d.kind,cx,cy,20,col);
    else uiIcon(a.icon,cx-19,cy-19,38,dim);
    g.restore();
    if(cd>0){
      const _fr=clamp(cd/Math.max(.01,a.base||cd),0,1);
      g.save();g.fillStyle='rgba(6,12,10,0.72)';g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,28,-Math.PI/2,-Math.PI/2+Math.PI*2*_fr);g.closePath();g.fill();g.restore();
      circle(cx,cy,28,'',col);
      text(cd>=1?Math.ceil(cd):cd.toFixed(1),cx,cy,18,V45.paper,'center','bold');
    }else if(winding){
      g.save();g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.arc(cx,cy,28,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp(V26.action.t/V26.action.impact,0,1));g.stroke();g.restore();
    }else if(locked)text('Khóa',cx,cy,11,V45.soft,'center','bold');
    else if(low)text('Thiếu MP',cx,cy,10,V45.red,'center','bold');
    if(a.count!=null)text('×'+a.count,cx+24,cy-22,10,V45.paper,'right','bold');
    if(a.d&&a.rank)text(String(a.rank),cx+24,cy-22,10,V45.jade,'right','bold');
    v33Fit(a.key,cx,cy+36,side-5,11,dim?V45.soft:V45.paper,'center');
    buttons.push({x:bx-2,y:sy-8,w:side+4,h:62,fn:()=>{if(locked)v11Open();else if(!empty&&!low&&!cd)a.fn();},v35:'skill'+i});
    if(over)tip={a,cx,col,locked,low,cd};
  });
  if(V26.action||V26.stage||V26.hits){
    const a=V26.action;
    v44Label(V26.hits?V26.hits+' liên kích':a?.kind==='skill'?a.d.name:'Liên chiêu',640,595,14,V25_COLOR[p.cls],'center','bold');
  }
  if(tip&&!v35Editing()){
    const {a,cx,col,locked,low,cd}=tip,tw=270,tx=clamp(cx-tw/2,12,W-tw-12),ty=513;
    v45Surface(tx,ty,tw,83,{edge:v42HUDAlpha(col,'85')});
    v33Fit(a.name,tx+13,ty+16,tw-26,15,col,'left','bold');
    const state=locked?'Chưa học · T mở công pháp':low?'Thiếu linh lực':cd>0?'Hồi chiêu '+cd.toFixed(1)+' giây':a.d?a.d.cost+' MP · Hồi chiêu '+a.d.cd+' giây':a.key;
    v33Fit(state,tx+13,ty+37,tw-26,11,V45.soft);
    v12Wrap(a.d?.desc||(a.count!=null?'Hồi sinh mệnh · còn '+a.count+' đan':'Sử dụng khi chiến đấu'),tx+13,ty+57,tw-26,11,V45.paper,14,2);
  }
}
function v45Control(x,y,w,kind,key,label,fn,active=false,h=54){
  const over=v33Over(x,y,w,h),col=active||over?V45.gold:V45.soft;
  v45Surface(x,y,w,h,{active,edge:over?'#d7c18ea0':V45.edge});
  v35Icon(kind,x+w/2,y+Math.round(h*.33),14,col);
  const _nm={menu:'Menu',sword:'Chiêu',auto:'Tự đánh',loot:'Tự nhặt',bag:'Túi đồ',audio:'Âm thanh',mute:'Tắt tiếng',book:'Kỹ năng',scroll:'Nhiệm vụ',hud:'HUD',settings:'Cài đặt'}[kind]||key;
  v33Fit(_nm,x+w/2,y+h-13,w-5,11,col,'center','bold');
  if(_nm!==key)text(key,x+w-6,y+10,8,V45.soft,'right','bold');
  if(active)circle(x+w-7,y+7,2.4,V45.jade);
  buttons.push({x,y,w,h,fn,v35:key});
  if(over&&!v35Editing()){
    const tw=clamp(label.length*7+21,112,284),tx=clamp(x+w/2-tw/2,8,W-tw-8);
    v45Surface(tx,y-34,tw,26);
    v33Fit(label,tx+tw/2,y-21,tw-12,11,V45.paper,'center');
  }
}
v35Control=v45Control;
// v35Left: định nghĩa duy nhất (gộp 4 lớp ở T02b). T11 (§12): nút Menu chỉ còn
// icon 46x46 (không còn chữ MENU/Menu lặp); các nút trái còn lại cao 46.
function v35Left(){
  const hub=v45Hub()&&!v35Editing();
  const y=646;
  v45IconCell(24,y,46,46,'menu',null,'Menu',()=>{V33.menu=!V33.menu;},V33.menu);
  if(hub){
    v45Control(82,y,54,'sword','Chiêu',V45_HUB.combat?'Ẩn thanh kỹ năng':'Hiện thanh kỹ năng',()=>{V45_HUB.combat=!V45_HUB.combat;},V45_HUB.combat,46);
    return;
  }
  v45Control(82,y,54,'auto','F','Tự đánh · '+(auto?'Bật':'Tắt'),()=>{auto=!auto;save();},auto,46);
  v45Control(142,y,54,'loot','X','Tự nhặt · '+(v21State().auto?'Bật':'Tắt'),v21Toggle,v21State().auto,46);
  v45Control(202,y,54,'bag','Z','Nhặt vật phẩm gần',v21PickNear,false,46);
}
// v35Nav: định nghĩa duy nhất (gộp 4 lớp ở T02b). T11 (§11): 6 ô 46x46, không nhãn
// dưới icon, tooltip tên đầy đủ + phím thật; ô Công pháp sáng khi có điểm.
function v35Nav(){
  // Tài nguyên (§10): linh thạch + đan, thuộc nhóm nav, ngay trên dock chức năng.
  v45ResourceCell(950,610,148,'stone',p.stones||0,'linh thạch');
  v45ResourceCell(1108,610,148,'pill',p.pills||0,'Hồi Xuân Đan');
  const enabled=v41AudioEnabled(),cells=[
    [enabled?'audio':'mute',null,'Âm thanh',v41AudioToggle,enabled],
    ['bag','I','Hành trang',()=>openPanel('gear'),false],
    ['book','T','Công pháp',v11Open,v11SkillPoints()>0],
    ['scroll','Q','Nhật ký',v12Open,false],
    ['hud','F2','Tùy chỉnh HUD',v35Open,false],
    ['settings','Esc','Cài đặt',()=>openPanel('settings'),false]
  ];
  cells.forEach(([kind,key,label,fn,active],n)=>v45IconCell(950+n*52,646,46,46,kind,key,label,fn,active));
}
// v35Feed: định nghĩa duy nhất (gộp 4 lớp ở T02b). T11 (§7): 3 dòng, dòng mới
// nhất luôn ở dưới y602; card 300x28, fade 400ms cuối; ẩn tạm khi drawer Đạo
// đồ mở (drawer che khu vực feed), không reset thời gian sự kiện.
function v35Feed(){
  const a=V34.events.filter(e=>elapsed-e.at<7&&e.text!=='Thanh Thạch Thôn · Tự do khám phá').slice(-3);
  if(!v34State().feed&&!v35Editing())return;
  if(V33.menu)return;
  if(!a.length&&v35Editing())a.push({text:'+12 tu vi',col:V45.gold,at:elapsed,n:1});
  a.forEach((e,i)=>{
    const y=602-(a.length-1-i)*29,txt=e.text+(e.n>1?' ×'+e.n:'');
    const lines=v45WrapLines(txt,284,12,2),cut=lines.join(' ')!==txt.replace(/\s+/g,' ').trim();
    const ga=g.globalAlpha;g.globalAlpha=ga*clamp((7-(elapsed-e.at))/.4,0,1);
    v44Rect(24,y,300,28,'#100b13e0',null,4);
    g.fillStyle=V45.gold;g.fillRect(24,y+6,2,16);
    lines.forEach((ln,j)=>text(ln,32,y+7+j*13,12,V45.paper,'left'));
    g.globalAlpha=ga;
    if(cut&&v33Over(24,y,300,28)){
      const id='feed:'+i,t=V45_TIPS[id]||(V45_TIPS[id]=elapsed);
      if(elapsed-t>.35){
        v45Surface(24,508,300,34);
        v45WrapLines(txt,284,12,2).forEach((ln,j)=>text(ln,32,508+10+j*13,12,V45.paper,'left'));
      }
    }else delete V45_TIPS['feed:'+i];
  });
}
// T11 (§8/§8.1): cụm khám phá x414,y638,w452,h36; 3 nút 144x36 (Sơ đồ thôn,
// Sân luyện, Theo nhiệm vụ); gần điểm E hợp lệ thì 2 ô đầu gộp thành một nút
// 425,638,276x36 "Tên điểm [E]", nút Theo nhiệm vụ giữ nguyên vị trí.
function v45HubDock(){
  const t=v12Tracked(),o=owNearest(),x=414,y=638;
  v45Surface(x,y,452,36);
  v33Shield(x,y,452,36);
  if(o){
    v45Button(x+11,y,276,36,o.door?'Vào '+o.name:o.name,'E',()=>v8InteractAt(o),{primary:true,id:'interact'});
  }else{
    v45Button(x,y,144,36,'Sơ đồ thôn','M',()=>openPanel('map'),{primary:true,id:'hubMap'});
    v45Button(x+154,y,144,36,'Sân luyện','F6',v42tOpen,{id:'hubTrain'});
  }
  v45Button(x+308,y,144,36,t?.action==='break'?'Tu luyện & đột phá':t?'Theo nhiệm vụ':'Nhật ký',null,t?()=>v12Guide(t):v12Open,{id:'hubQuest'});
}
// M09b: màn chuyển vùng (splash) trong worldDraw (src/04) vẽ SAU worldHud nên
// che toast ~3,5s. Toast được vẽ lại sau splash trong worldDraw (src/48).
// v45SplashCoversToast() đúng khi khung hình này sẽ vẽ splash: đi đường
// worldDraw (không phải thôn V47T / nội thất / Khám phá), worldTitle>0,
// chưa mở panel, ảnh bản đồ đã sẵn. Dùng chung cho chỗ bỏ qua trong
// v45Location và chỗ vẽ lại sau splash — toast chỉ vẽ đúng 1 lần mỗi khung.
function v45SplashCoversToast(){
  if(v47tIsActive()||v36Inside?.()||V48X.active||modal||!(p?.worldMode&&worldTitle>0))return false;
  const _mi=V22_ORDER.indexOf(p.mapId||'thon');
  return !!imgs['v47map'+(_mi<0?0:_mi)]?.ready;
}
// M09b: vẽ toast (§4.1) x430, y100 (y150 khi có mục tiêu), w420,h36 — tách
// khỏi v45Location để vẽ lại sau splash.
function v45Toast(hub,target){
  const msg=v21NoticeT>0?v21Notice:notify;
  if((notifyT>0||v21NoticeT>0)&&!(hub&&msg==='Thanh Thạch Thôn · Tự do khám phá')){
    const y=target?150:100;
    v44Rect(430,y,420,36,'#100b13e0',V45.edge,5);
    v33Fit(msg,640,y+18,401,12,V45.paper,'center');
  }
}
// v45Location: T11 (§4): trạng thái y33, tên vùng y64, gạch trang trí y88; thôn
// luôn hiện cố định, ngoài thôn fade vào 200ms / ra 400ms theo owTitle
// (owTitle đếm từ 3 nên tổng hiện 3,0s thay vì 2,8s — giá trị 3 nằm ở src/03,
// ngoài phạm vi T11); toast (§4.1) x430, y100 (y150 khi có mục tiêu), w420,h36.
function v45Location(hub,target){
  if(hub&&!target){
    v44Label('Khu vực an toàn',640,33,13,V45_SPEC.jade,'center','bold');
    v18Title('Thanh Thạch Thôn',640,64,30,V45.paper,'center');
    v44Rule(510,88,260,'#e0bd7e98');
  }else if(p.worldMode&&owTitle>0&&!target){
    const [state,col]=v22Danger(V22_REG[(REG[p.mapId]||REG.thon).id]);
    g.save();g.globalAlpha*=clamp((3-owTitle)/.2,0,1)*clamp(owTitle/.4,0,1);
    v44Label(state,640,33,13,col,'center','bold');
    v18Title((REG[p.mapId]||REG.thon).name,640,64,30,V45.paper,'center');
    v44Rule(510,88,260,'#e0bd7e98');g.restore();
  }
  if(!v45SplashCoversToast())v45Toast(hub,target);
}
function v45QuestPin(goal){
  if(!goal)return;
  const z=hdPoint(goal.x,goal.y);
  const x=clamp(z.x,295,966),y=clamp(z.y-43,115,583);
  const onScreen=Math.abs(x-z.x)<1&&Math.abs(y-(z.y-43))<1;
  if(onScreen){v17Marker();return;}
  const px=x-53,py=y-11;
  v44Rect(px,py,106,22,'#202b20eb',V45.edge,4);
  diamond(g,px+11,y,3,V45.gold);
  text(Math.round(dist(goal,p))+' bước',px+22,y,10,V45.gold,'left','bold');
}
function v45WorldPins(){
  if(!v45Hub()){v17Signs();v17Marker();return;}
  const goal=v12Target(v12Tracked());
  const goalDoor=goal?.door?hdPoint(goal.x,goal.y):null;
  if(!goalDoor||goalDoor.x<312||goalDoor.x>1000||goalDoor.y<101||goalDoor.y>590)v45QuestPin(goal);
  for(const r of V36_ROOMS){
    const o=v36Door(r),z=hdPoint(o.x,o.y), here=dist(p,o)<63, marked=goal?.id===r.id, over=V8.hover?.id===r.id||v33Over(z.x-65,z.y-40,130,49);
    if(z.x<40||z.x>W-40||z.y<107||z.y>610)continue;
    const col=marked?V45.gold:r.color;
    const rr=marked?5.5:4;
    g.save();
    g.strokeStyle=v42HUDAlpha(col,marked?'ad':'62');g.lineWidth=1.2;
    g.beginPath();g.ellipse(z.x,z.y,17,5,0,0,TAU);g.stroke();
    diamond(g,z.x,z.y-12,rr,col);
    g.restore();
    // Show the name as the player approaches or points at a building.
    if(!over&&!marked&&!here&&dist(p,o)>276)continue;
    const label=r.name;
    g.font='bold 12px V45Sans,Segoe UI,Arial,sans-serif';
    const w=Math.min(240,g.measureText(label).width+32),x=clamp(z.x-w/2,10,W-w-10),y=z.y-41;
    v44Rect(x,y,w,23,marked?'#362d1bea':'#132322e9',v42HUDAlpha(col,'8f'),5);
    v33Fit(label,x+w/2,y+11.5,w-12,12,marked?'#ffe0a0':V45.paper,'center','bold');
    if(!V42_PHOTO.active)buttons.push({x,y,w,h:26,fn:()=>v8SetGoal(o,{type:'poi',id:r.id}),v35:'hubDoor:'+r.id});
  }
}
// T11 (§13.2): hệ số mờ khi không thao tác — 1 → 0,65 trong 400ms sau 5s
// không di chuyển/chuột/phím, trở về 1 trong 150ms khi có hoạt động; luôn 1
// khi combat, mở panel/F2, HP ≤25% hoặc đang hiện tooltip. Tính một lần mỗi
// khung hình ở đầu v35Render/v47tDraw (V45_IDLE.f), nhân vào alpha nhóm trong
// từng callback vẽ; toast và tên vùng không lấy hệ số này.
const V45_IDLE={f:1,last:0,prev:0,px:0,py:0,mx:0,my:0};
function v45IdleFactor(){
  const now=elapsed,dt=Math.min(.1,Math.max(0,now-(V45_IDLE.prev||now)));V45_IDLE.prev=now;
  if(p.x!==V45_IDLE.px||p.y!==V45_IDLE.py||mouse.x!==V45_IDLE.mx||mouse.y!==V45_IDLE.my||Object.values(pressed).some(Boolean)||Object.values(keys).some(Boolean)||mouse.left||(p.hurt||0)>0)V45_IDLE.last=now;
  V45_IDLE.px=p.x;V45_IDLE.py=p.y;V45_IDLE.mx=mouse.x;V45_IDLE.my=mouse.y;
  if(modal||v35Editing()||v45CombatHUD()||p.hp<=.25*currentStats().hp||Object.keys(V45_TIPS).length){V45_IDLE.last=now;V45_IDLE.f=1;return 1;}
  if(now-V45_IDLE.last>5)V45_IDLE.f=Math.max(.65,V45_IDLE.f-dt/.4*.35);
  else V45_IDLE.f=Math.min(1,V45_IDLE.f+dt/.15*.35);
  return V45_IDLE.f;
}
// v35Render: định nghĩa duy nhất (gộp 2 lớp ở T02b).
function v35Render(world){
  if(!p||mode!=='play')return;
  v35Reset();
  if(V45_HUB.owner!==p)Object.assign(V45_HUB,{owner:p,combat:false,site:null});
  const editing=v35Editing();
  if(modal&&!editing)return;
  const s=currentStats(),hub=world&&v45Hub(),target=!!v34Target();
  V35.rects={};
  v45IdleFactor();
  if(world&&!editing)v45WorldPins();
  v35TargetRing();
  v35Group('identity',()=>{g.globalAlpha*=V45_IDLE.f;v35Identity(s);v35Status();});
  v35Group('map',()=>{g.globalAlpha*=V45_IDLE.f;(world?v35Map:v451Arena)();});
  if(world)v35Group('quest',()=>{g.globalAlpha*=V45_IDLE.f;v35Quest();});
  if(target||editing)v35Group('target',()=>{g.globalAlpha*=V45_IDLE.f;v35Target();});
  const combat=!hub||v45CombatHUD();
  if(combat||editing)v35Group('dock',()=>{g.globalAlpha*=V45_IDLE.f;v35Dock(s);});
  else v35Group('dock',()=>{g.globalAlpha*=V45_IDLE.f;v45HubDock();v45XpBar();});
  v35Group('left',()=>{g.globalAlpha*=V45_IDLE.f;v35Left();});
  v35Group('nav',()=>{g.globalAlpha*=V45_IDLE.f;v35Nav();});
  v35Group('feed',()=>{g.globalAlpha*=V45_IDLE.f;v35Feed();});
  if(editing){
    V35.dragButtons=buttons.filter(b=>b.v35?.startsWith('drag:'));
    buttons=buttons.filter(b=>!b.v35?.startsWith('drag:'));return;
  }
  v45Location(hub,target);
  const o=world?owNearest():null;
  // Gần cổng vùng thì phím E đi cổng (tấm cổng V48 hiển thị), không hiện prompt POI.
  if(o&&combat&&!V26.action&&!V26.stage&&!V26.hits&&!(typeof v48tNearGate==='function'&&v48tNearGate())){
    // T11 (§8.2): nút E ngoài thôn x502,w276,h36; ở combat dời lên y462 để
    // không che tooltip kỹ năng T12 (y512–590), còn lại y552.
    const name=o.door?'Vào '+o.name:o.name;
    v45Button(502,v45CombatHUD()?462:552,276,36,name,'E',()=>v8InteractAt(o),{id:'interact'});
  }
  v33Drawer();
}


const V45_MAP={x:30,y:115,w:853,h:436,rx:901,rw:349};
const V45_SERVICE=[
  ['inn','sect','Chính tuyến'],['herbalist','loot','Linh dược'],['shop','bag','Mua bán'],
  ['wanderer','sword','Hội thoại'],['sentry','hud','Hộ vệ'],
  ['v13_forge','loot','Luyện đan'],['v13_market','bag','Giao dịch'],['v13_board','scroll','Ủy thác'],
  ['v13_farm','loot','Trồng linh thảo'],['training','sword','Luyện chiêu'],['v31_cave','sect','Tu luyện']
];
function v45MapHead(title,sub,local){
  g.fillStyle='#0b1718';g.fillRect(0,0,W,H);
  const top=g.createLinearGradient(0,0,W,240);top.addColorStop(0,'#253830');top.addColorStop(1,'#101a1b');
  g.fillStyle=top;g.fillRect(0,0,W,101);
  v18Title(title,32,43,31,V45.paper);
  v33Fit(sub,34,73,690,12,V45.soft);
  v45Button(847,34,142,37,'Thanh Thạch',null,()=>modal.v16Map='local',{primary:local,icon:'sect',id:'localMap'});
  v45Button(997,34,146,37,'Sơn Hà Đồ',null,()=>modal.v16Map='world',{primary:!local,icon:'map',id:'worldMap'});
  v45Button(1151,34,99,37,'Đóng','Esc',()=>modal=null,{id:'closeMap'});
  v44Rule(30,100,1220,V45.edge);
}
function v45MapFrame(x,y,w,h){
  v44Rect(x-1,y-1,w+2,h+2,'#101e1b','#c4ac768b',6);
  g.save();g.beginPath();g.roundRect(x,y,w,h,5);g.clip();
}
function v45MapUnframe(x,y,w,h){
  g.restore();
  g.save();
  g.strokeStyle='#d8c392a0';g.lineWidth=1.2;
  for(const [xx,yy,sx,sy] of [[x+6,y+6,1,1],[x+w-6,y+6,-1,1],[x+6,y+h-6,1,-1],[x+w-6,y+h-6,-1,-1]]){
    g.beginPath();g.moveTo(xx,yy+sy*17);g.lineTo(xx,yy);g.lineTo(xx+sx*17,yy);g.stroke();
  }
  g.restore();
}
function v45Compass(x,y){
  circle(x,y,21,'#152720de','#d8bc818a');
  g.save();g.translate(x,y);
  v42wPoly(g,[[0,-15],[4,3],[0,0],[-4,3]],'#f6e2af');
  v42wPoly(g,[[0,15],[4,-3],[0,0],[-4,-3]],'#a88b58');
  g.restore();
  text('B',x,y-30,10,V45.paper,'center','bold');
}
function v45AtlasArt(x,y,w,h,{selected=null,labels=true,knownOnly=false,click=null,poi=true}={}){
  const scale=Math.min(w/850,h/436), at=o=>v43MapPoint(x,y,w,h,o), seen=p.discovered||[];
  const now=V41Presentation.clock;
  v45MapFrame(x,y,w,h);
  g.imageSmoothingEnabled=true;
  const art=imgs.v45Atlas.ready?V43_ATLAS_IMG:v43PriorRaster();
  g.drawImage(art,x,y,w,h);
  const shade=g.createLinearGradient(0,y,0,y+h);
  shade.addColorStop(0,'#10222750');shade.addColorStop(.46,'#10261a05');shade.addColorStop(1,'#18192560');
  g.fillStyle=shade;g.fillRect(x,y,w,h);
  if(knownOnly)for(const r of REGIONS){
    if(seen.includes(r.id))continue;
    const z=at(r),rr=w*.125,veil=g.createRadialGradient(z.x,z.y,rr*.21,z.x,z.y,rr);
    veil.addColorStop(0,'#142326e4');veil.addColorStop(1,'#14232600');
    g.fillStyle=veil;g.fillRect(z.x-rr,z.y-rr,2*rr,2*rr);
  }
  g.lineCap='round';g.lineJoin='round';
  for(const [a,b] of ROAD_EDGES){
    const aa=REGIONS[a],bb=REGIONS[b],pts=[at(aa),at(bb)],known=seen.includes(aa.id)&&seen.includes(bb.id);
    g.setLineDash(known?[]:[4*scale,5*scale]);
    v43MapLine(pts,'#172b27b5',3*scale);
    v43MapLine(pts,known?'#f4db9bc9':'#e4d8ab94',scale);
  }
  g.setLineDash([]);
  if(poi&&scale>.7){
    for(const o of v8POIs()){
      if(!p.explored?.[Math.floor(o.x/OW.chunk)+':'+Math.floor(o.y/OW.chunk)])continue;
      if(REGIONS.some(r=>dist(o,r)<310))continue;
      const a=at(o),col=o.kind==='dungeon'?'#e1b7ff':o.kind==='v13node'?'#a9dfad':'#ffe1a0';
      diamond(g,a.x,a.y,2.5*scale,col);
    }
  }
  for(const r of REGIONS){
    const d=V22_REG[r.id],z=at(r),active=selected===r.id,known=seen.includes(r.id);
    const col=active?V45.gold:known?V45.jade:'#d2ceba',rr=Math.max(4,7*scale);
    if(active){
      circle(z.x,z.y,rr+6*scale,null,V45.gold,.75+.25*Math.sin(now*3));
    }
    circle(z.x,z.y,rr,'#172720ed',col);
    if(knownOnly&&!known)text('?',z.x,z.y,Math.max(8,10*scale),col,'center','bold');
    else diamond(g,z.x,z.y,3.4*scale,col);
    const caption=knownOnly&&!known?'Chưa khám phá':r.name,cw=Math.min(163*scale,w/5-8),yy=z.y+13*scale;
    if(labels){
      v44Rect(z.x-cw/2,yy,cw,32*scale,active?'#2d3124f8':'#122322e8',active?'#e9c683dc':'#cbbe8654',4);
      v33Fit(caption,z.x,yy+9*scale,cw-9,Math.max(10,12*scale),V45.paper,'center','bold');
      text(d.i?'Cấp '+d.min+'–'+d.max:'An toàn',z.x,yy+23*scale,Math.max(9,10*scale),col,'center');
    }
    if(click){
      const hitH=labels?55*scale:rr*3;
      buttons.push({x:z.x-cw/2,y:z.y-rr*1.4,w:cw,h:hitH,fn:()=>click(r.id),v33:'v45region:'+r.id});
    }
  }
  const player=p.worldMode?(v36Inside()?v36Door(v36Current()):p):p.v28?.run?.return;
  if(player&&Number.isFinite(player.x)&&Number.isFinite(player.y)){
    const z=at(player);circle(z.x,z.y,Math.max(3,4.2*scale),'#fff5cf','#162b24');
    circle(z.x,z.y,(9+Math.sin(now*4))*scale,null,'#fff4c2',.58);
  }
  const t=v12Target(v12Tracked());
  if(t&&scale>.7){const z=at(t);diamond(g,z.x,z.y-9,4*scale,'#ffdb8b');}
  if(scale>.85)v45Compass(x+w-34,y+h/2);
  v45MapUnframe(x,y,w,h);
}
v43AtlasArt=v45AtlasArt;
// T20 — Sơn Hà Đồ thủy mặc (spec T19 v1.2 + phụ lục ops/specs/world_map_addendum.md).
// v22Atlas: định nghĩa duy nhất (bản V45 cũ đã thay hẳn ở T20). Dữ liệu trình bày:
// DATA.world_map (version 1, 10 vùng, 13 tuyến); số liệu thật: V22_REG, REG, QUALITY,
// p.discovered. Tab "Thanh Thạch" (v45TownMap) không đổi; tab "Sơn Hà Đồ" vẽ ở đây.
// Trạng thái hover/tooltip là UI tạm, không ghi save.
const V22_MAP_UI={hover:null,hoverT:0,fog:{}};
function v22Ink(){ // tạo Image từ ASSETS["world_map_ink"] (data URI) và cache vào imgs
  if(!imgs.world_map_ink){
    const im=new Image();imgs.world_map_ink={img:im,ready:false};
    im.onload=()=>{imgs.world_map_ink.ready=true;};
    im.src=ASSETS["world_map_ink"];
  }
  return imgs.world_map_ink;
}
function v22MapData(){
  const d=typeof DATA!=='undefined'?DATA.world_map:null;
  if(!d||d.version!==1||!Array.isArray(d.places)||d.places.length!==10||!Array.isArray(d.paths)||d.paths.length!==13)return null;
  if(!d.places.every(pl=>pl.region&&pl.label&&pl.seal&&V22_REG[pl.region]))return null;
  return {d,byId:Object.fromEntries(d.places.map(pl=>[pl.region,pl]))};
}
function v22NodeXY(d,pl){ // §2.3: aspect-fill căn giữa, tâm node = gốc ảnh + tỉ lệ × kích thước ảnh
  const s=Math.max(856/d.art.width,536/d.art.height);
  return {x:48+(856-d.art.width*s)/2+pl.x*d.art.width*s,y:106+(536-d.art.height*s)/2+pl.y*d.art.height*s};
}
function v22Ring(cx,cy,r,col,lw){g.save();g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.arc(cx,cy,r,0,TAU);g.stroke();g.restore();}
function v22Corners(x,y,w,h,col){ // góc trang trí kiểu v45MapUnframe (nẹp L 17px)
  g.save();g.strokeStyle=col;g.lineWidth=1.2;
  for(const [xx,yy,sx,sy] of [[x+6,y+6,1,1],[x+w-6,y+6,-1,1],[x+6,y+h-6,1,-1],[x+w-6,y+h-6,-1,-1]]){
    g.beginPath();g.moveTo(xx,yy+sy*17);g.lineTo(xx,yy);g.lineTo(xx+sx*17,yy);g.stroke();
  }
  g.restore();
}
function v22Tab(x,y,w,label,selected,fn){ // tab tiêu đề §2.1: đang chọn nền gold 0.20, còn lại ink 0.85
  const over=v33Over(x,y,w,40);
  box(x,y,w,40,selected?'rgba(227,185,111,0.20)':'rgba(16,11,19,0.85)',selected?'#e3b96f':(over?'#e3b96f':'rgba(227,185,111,0.45)'),6);
  text(label,x+w/2,y+20,14,selected?V45_SPEC.gold:V45_SPEC.paper,'center',selected?'bold':'normal');
  buttons.push({x,y,w,h:40,fn,v35:'mapTab:'+label});
}
function v22ActionBtn(x,y,w,h,label,enabled,fn,id){ // nút hành động §2.5: vàng khi bấm được, ink/muted khi vô hiệu
  const over=enabled&&v33Over(x,y,w,h);
  box(x,y,w,h,enabled?(over?'#e3b96f':'rgba(227,185,111,0.85)'):'rgba(16,11,19,0.85)',enabled?'#e3b96f':'rgba(181,161,139,0.35)',6);
  text(label,x+w/2,y+h/2,16,enabled?V45_SPEC.ink:V45_SPEC.muted,'center','bold');
  if(enabled)buttons.push({x,y,w,h,fn,v35:id});
}
function v22StatusText(id){ // trạng thái §2.5, thứ tự ưu tiên: đang ở đây > an toàn > đã khám phá > chưa khám phá
  if(id===p.mapId)return ['Đang ở đây',V45_SPEC.jade];
  if(id==='thon')return ['Vùng an toàn',V45_SPEC.jade];
  if((p.discovered||[]).includes(id))return ['Đã khám phá',V45_SPEC.jade];
  return ['Chưa khám phá',V45_SPEC.muted];
}
function v22SealOk(ch){ // chữ Hán có glyph trong font hiện có không (thiếu thì vẽ chấm ink, spec §2.4)
  try{return !!(document.fonts&&document.fonts.check('16px V18Serif, "DejaVu Serif", Georgia, serif',ch));}catch(e){return false;}
}
function v22LabelLines(name){ // nhãn 13px đậm, tối đa 2 dòng, rộng chữ ≤120px (khung 136-16)
  const f='bold 13px V45Sans, "Segoe UI", Arial, sans-serif';
  g.save();g.font=f;
  if(g.measureText(name).width<=120){g.restore();return [name];}
  const words=String(name).split(' ');let l1='',i=0;const total=name.length;
  for(;i<words.length;i++){const t=l1?l1+' '+words[i]:words[i];if(l1&&t.length>total/2)break;l1=t;}
  g.restore();return [l1,words.slice(i).join(' ')||words[words.length-1]];
}
function v22Atlas(){
  const seen=p.discovered||[];
  // Khung toàn màn hình + 3 nút tiêu đề (§2.1); phụ đề theo phụ lục: số địa vực đã khám phá.
  g.fillStyle='rgba(16,11,19,0.55)';g.fillRect(0,0,W,H);
  box(24,24,1232,672,'rgba(16,11,19,0.92)','rgba(227,185,111,0.70)',8);
  v22Corners(24,24,1232,672,'#d8c392a0');
  v18Title('Sơn hà đồ',48,55,28,V45_SPEC.gold,'left');
  text('Đã khám phá '+seen.length+' / 10 địa vực',50,86,13,V45_SPEC.muted,'left');
  v22Tab(880,42,112,'Thanh Thạch',false,()=>{modal.v16Map='local';});
  v22Tab(1000,42,116,'Sơn Hà Đồ',true,()=>{modal.v16Map='world';});
  v22Tab(1124,42,108,'Đóng [Esc]',false,()=>{modal=null;});
  const md=v22MapData();
  if(!md){ // dữ liệu thiếu/không hợp lệ (spec §4): báo lỗi, không vẽ địa đồ
    text('Không nạp được dữ liệu bản đồ (DATA.world_map)',476,374,16,V45_SPEC.red,'center');
    return;
  }
  const {d,byId}=md;
  const selId=(v22Selected&&byId[v22Selected])?v22Selected:(byId[p.mapId]?p.mapId:null);
  const sel=selId?byId[selId]:null, q=selId?V22_REG[selId]:null;
  const pts=d.places.map((pl,i)=>({i,...pl,...v22NodeXY(d,pl)}));
  const ptById=Object.fromEntries(pts.map(z=>[z.region,z]));
  // Nhãn: đặt theo thứ tự ưu tiên (hiện tại → đang chọn → hover → thứ tự data), thử
  // trên/dưới/phải/trái, cách nhãn khác ≥4px, giữ trong khung bản đồ.
  const prio=z=>z.region===p.mapId?0:(z.region===selId?1:(z.region===V22_MAP_UI.hover?2:3));
  const placed=[];
  for(const z of [...pts].sort((a,b)=>prio(a)-prio(b)||a.i-b.i)){
    const lines=v22LabelLines(z.label);
    g.save();g.font='bold 13px V45Sans, "Segoe UI", Arial, sans-serif';
    const lw=clamp(Math.max(...lines.map(t=>g.measureText(t).width))+16,48,136);
    g.restore();
    const lh=lines.length>1?38:22;
    const cands=[{x:z.x-lw/2,y:z.y-15-lh},{x:z.x-lw/2,y:z.y+15},{x:z.x+15,y:z.y-lh/2},{x:z.x-15-lw,y:z.y-lh/2}];
    let rect={...cands[0],w:lw,h:lh};
    for(const c of cands){
      const r={x:c.x,y:c.y,w:lw,h:lh};
      if(r.x<48||r.y<106||r.x+r.w>904||r.y+r.h>642)continue;
      if(!placed.some(o=>r.x<o.x+o.w+4&&r.x+r.w+4>o.x&&r.y<o.y+o.h+4&&r.y+r.h+4>o.y)){rect=r;break;}
    }
    z.labelRect={...rect,lines};
    placed.push(z.labelRect);
  }
  // Hover: hitbox 36×36 của ấn hoặc nhãn; trùng nhau lấy tâm gần pointer nhất.
  let hoverId=null,hoverD=Infinity,hoverPr=9;
  for(const z of pts){
    const L=z.labelRect, inLabel=L&&mouse.x>=L.x&&mouse.x<=L.x+L.w&&mouse.y>=L.y&&mouse.y<=L.y+L.h;
    const inNode=Math.abs(mouse.x-z.x)<=18&&Math.abs(mouse.y-z.y)<=18;
    if(!inLabel&&!inNode)continue;
    const dd=Math.hypot(mouse.x-z.x,mouse.y-z.y), pr=prio(z);
    if(dd<hoverD||(dd===hoverD&&pr<hoverPr)){hoverId=z.region;hoverD=dd;hoverPr=pr;}
  }
  if(hoverId!==V22_MAP_UI.hover){V22_MAP_UI.hover=hoverId;V22_MAP_UI.hoverT=Date.now();}
  // Địa đồ: giấy → ảnh → 13 tuyến → fog → ấn/nhãn → vòng hiện tại/chọn/hover (clip trong khung).
  g.save();
  g.beginPath();g.rect(48,106,856,536);g.clip();
  g.fillStyle=V45_SPEC.paper;g.fillRect(48,106,856,536);
  const ink=v22Ink();
  if(ink?.ready){
    const s=Math.max(856/d.art.width,536/d.art.height),dw=d.art.width*s,dh=d.art.height*s;
    g.drawImage(ink.img,48+(856-dw)/2,106+(536-dh)/2,dw,dh);
  }
  g.save();g.setLineDash([6,5]);g.strokeStyle='rgba(16,11,19,0.50)';g.lineWidth=2;g.lineCap='round';
  for(const [a,b] of d.paths){
    const A=ptById[a],B=ptById[b];
    if(!A||!B)continue;
    g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();
  }
  g.restore();
  for(const z of pts){ // fog §2.4: chưa khám phá (trừ vị trí hiện tại), lõi r22 alpha 0.65 → 0 ở r42
    if(z.region===p.mapId||seen.includes(z.region))continue;
    let gr=V22_MAP_UI.fog[z.region];
    if(!gr){gr=g.createRadialGradient(z.x,z.y,0,z.x,z.y,42);gr.addColorStop(0,'rgba(16,11,19,0.65)');gr.addColorStop(22/42,'rgba(16,11,19,0.65)');gr.addColorStop(1,'rgba(16,11,19,0)');V22_MAP_UI.fog[z.region]=gr;}
    g.fillStyle=gr;g.fillRect(z.x-42,z.y-42,84,84);
  }
  for(const z of pts){ // ấn 22×22 (§2.4)
    const isCur=z.region===p.mapId, known=seen.includes(z.region);
    const bg=isCur?V45_SPEC.jade:(known?'rgba(241,132,116,0.85)':'rgba(16,11,19,0.82)');
    g.save();g.beginPath();g.roundRect(z.x-11,z.y-11,22,22,3);
    g.fillStyle=bg;g.fill();
    g.strokeStyle=isCur?'rgba(16,11,19,0.65)':(known?'rgba(16,11,19,0.65)':'#b5a18b');g.lineWidth=1;g.stroke();
    g.restore();
    if(known||isCur){
      if(v22SealOk(z.seal)){
        g.save();g.font='16px V18Serif, "DejaVu Serif", Georgia, serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=V45_SPEC.ink;g.fillText(z.seal,z.x,z.y+1);g.restore();
      }else circle(z.x,z.y,3,V45_SPEC.ink);
    }else text('?',z.x,z.y,16,V45_SPEC.paper,'center','bold');
  }
  for(const z of pts){ // nhãn tên luôn hiện đầy đủ, kể cả vùng chưa khám phá (§2.4)
    const L=z.labelRect;
    v44Rect(L.x,L.y,L.w,L.h,'rgba(241,228,207,0.94)',V45_SPEC.red,3);
    L.lines.forEach((ln,i)=>text(ln,L.x+L.w/2,L.h>22?L.y+10+i*16:L.y+L.h/2,13,V45_SPEC.ink,'center','bold'));
  }
  for(const z of pts){
    if(z.region===p.mapId)v22Ring(z.x,z.y,16,V45_SPEC.gold,2);
    if(z.region===selId){v22Ring(z.x,z.y,18,V45_SPEC.gold,2);v22Ring(z.x,z.y,19,V45_SPEC.ink,1);}
    if(z.region===hoverId)v22Ring(z.x,z.y,16,'rgba(16,11,19,0.75)',1);
  }
  for(const z of pts){ // click ấn hoặc nhãn đều chọn đúng ID
    buttons.push({x:z.x-18,y:z.y-18,w:36,h:36,fn:()=>{v22Selected=z.region;},v35:'v22region:'+z.region});
    const L=z.labelRect;
    buttons.push({x:L.x,y:L.y,w:L.w,h:L.h,fn:()=>{v22Selected=z.region;},v35:'v22regionLabel:'+z.region});
  }
  g.restore();
  // Tooltip (§2.6): sau hover 180ms, cách pointer 14px, clamp trong (56,114)…(896,634).
  const hv=V22_MAP_UI.hover;
  if(hv&&Date.now()-V22_MAP_UI.hoverT>=180){
    const z=ptById[hv], st=v22StatusText(hv);
    const lines=v22LabelLines(z.label);
    g.save();g.font='14px V45Sans, "Segoe UI", Arial, sans-serif';
    const tw=clamp(Math.max(...lines.map(t=>g.measureText(t).width))+24,120,256);
    g.restore();
    const th=lines.length>1?68:44;
    let tx=mouse.x+14, ty=mouse.y+14;
    if(tx+tw>896)tx=mouse.x-14-tw;
    if(ty+th>634)ty=mouse.y-14-th;
    tx=clamp(tx,56,896-tw);ty=clamp(ty,114,634-th);
    box(tx,ty,tw,th,'rgba(16,11,19,0.92)','rgba(227,185,111,0.60)',6);
    lines.forEach((ln,i)=>text(ln,tx+12,ty+(th>44?16+i*16:15),14,V45_SPEC.paper,'left'));
    text(st[0],tx+12,ty+(th>44?50:31),12,st[1],'left');
  }
  // Viền + góc khung bản đồ.
  g.save();g.strokeStyle='rgba(227,185,111,1)';g.lineWidth=1;g.strokeRect(46.5,104.5,860,540);g.restore();
  v22Corners(46,104,860,540,'#d8c392a0');
  // Bảng chi tiết (§2.5 + phụ lục).
  box(924,106,308,536,'rgba(16,11,19,0.92)','rgba(227,185,111,0.45)',6);
  v18Title('Địa danh',944,136,20,V45_SPEC.gold,'left');
  v44Rule(944,158,268,'rgba(227,185,111,0.35)');
  if(!sel){
    text('Chọn địa danh',944,197,20,V45_SPEC.paper,'left');
  }else{
    const nameLines=(()=>{
      const f=s=>'bold '+s+'px V18Serif, "DejaVu Serif", Georgia, serif';
      g.save();g.font=f(24);
      if(g.measureText(sel.label).width<=268){g.restore();return {lines:[sel.label],size:24};}
      g.font=f(20);
      if(g.measureText(sel.label).width<=268){g.restore();return {lines:[sel.label],size:20};}
      const words=sel.label.split(' ');let l1='',i=0;const total=sel.label.length;
      for(;i<words.length;i++){const t=l1?l1+' '+words[i]:words[i];if(l1&&t.length>total/2)break;l1=t;}
      g.restore();return {lines:[l1,words.slice(i).join(' ')||words[words.length-1]],size:20};
    })();
    nameLines.lines.forEach((ln,i)=>v18Title(ln,944,nameLines.lines.length>1?187+i*20:197,nameLines.size,V45_SPEC.paper,'left'));
    const [stTxt,stCol]=v22StatusText(selId);
    text(stTxt,944,241,14,stCol,'left');
    if(q.min>p.level)text('Cấp đề nghị '+q.min+'–'+q.max+' · nguy hiểm',944,266,13,V45_SPEC.red,'left');
    let fy=282;
    const rows=[
      ['Cảnh giới',q.i===0?'Vùng an toàn':q.realm+' · Lv '+q.min+'–'+q.max],
      ['Chiến lực gợi ý',String(q.power)],
      ['Tài nguyên',q.resource],
    ];
    if(q.boss)rows.push(['Boss',q.boss+' · '+(((v22State().bosses[selId]?.ready||0)>p.worldTime)?'Đang hồi sinh':'Sẵn sàng')]);
    rows.push(['Phẩm chất rơi đồ',q.qlo===q.qhi?QUALITY[q.qlo]:QUALITY[q.qlo]+'–'+QUALITY[q.qhi]]);
    for(const [lb,val] of rows){
      if(fy>400)break;
      text(lb,944,fy+10,14,V45_SPEC.muted,'left');
      const lw=g.measureText(lb).width;
      // Giá trị vừa trên 1 dòng thì viết cùng hàng; dài hơn thì xuống dòng
      // lấy đủ rộng 268px (không cắt tên phẩm chất giữa chừng như "Thần / phẩm").
      const one=v45WrapLines(val,268-lw-8,14,1);
      if(one.length===1&&one[0]===val){text(val,944+lw+8,fy+10,14,V45_SPEC.paper,'left');fy+=20;}
      else{
        const vlines=v45WrapLines(val,268,14,2);
        vlines.forEach((ln,i)=>text(ln,944,fy+30+i*20,14,V45_SPEC.paper,'left'));
        fy+=20+20*vlines.length;
      }
    }
    v44Rule(944,414,268,'rgba(227,185,111,0.30)');
    v45WrapLines(sel.desc,268,14,5).forEach((ln,i)=>text(ln,944,438+i*20,14,V45_SPEC.paper,'left'));
    // Phụ lục: 2 nút 130×48 cách 8px. Dẫn đường vô hiệu ở vùng hiện tại (spec);
    // Khám phá không khóa theo cấp/vùng hiện tại (phụ lục), gọi v48xEnter như code cũ.
    v22ActionBtn(944,558,130,48,'Dẫn đường',selId!==p.mapId,()=>{
      modal=null;v8SetGoal(REG[selId]);
      if(q.min>p.level)message('Cẩn thận · '+REG[selId].name+' đề nghị cấp '+q.min);
    },'worldGuide');
    v22ActionBtn(1082,558,130,48,'Khám phá',true,()=>{modal=null;v48xEnter(selId);},'worldExplore');
    text('Chọn địa danh để dẫn đường',944+134,621,12,V45_SPEC.muted,'center');
  }
  // Chú giải (§2.6): đúng 4 nhóm + hướng dẫn bên phải.
  const lg=[['Hiện tại',V45_SPEC.jade],['Đã khám phá',V45_SPEC.red],['Chưa khám phá',V45_SPEC.ink],['Đường đi',null]];
  const lgX=[48,190,390,610];
  lg.forEach(([lb,col],i)=>{
    const x=lgX[i];
    if(col){box(x,663,12,12,col,'',2);if(lb==='Chưa khám phá')text('?',x+6,669,10,V45_SPEC.paper,'center','bold');}
    else{box(x,663,28,12,V45_SPEC.paper,'',2);g.save();g.setLineDash([6,5]);g.strokeStyle='rgba(16,11,19,0.9)';g.lineWidth=2;g.beginPath();g.moveTo(x+2,669);g.lineTo(x+26,669);g.stroke();g.restore();}
    text(lb,x+(col?18:34),669,13,V45_SPEC.paper,'left');
  });
  text('Chọn địa danh · Esc: Đóng',1232,669,13,V45_SPEC.muted,'right');
}

function v45TownLayout(x,y,w,h){
  const b=V16_BOUNDS,s=Math.min((w-86)/b.w,(h-24)/b.h);
  const ox=x+(w-b.w*s)/2,oy=y+(h-b.h*s)/2;
  return {s,at:o=>({x:ox+(o.x-b.x)*s,y:oy+(o.y-b.y)*s})};
}
function v45TownGround(w,h){
  const cache=V45_HUB.townRaster;
  if(cache?.width===w&&cache.height===h)return cache;
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const d=c.getContext('2d'), {at,s}=v45TownLayout(0,0,w,h);
  const grad=d.createLinearGradient(0,0,w,h);grad.addColorStop(0,'#233e37');grad.addColorStop(.56,'#3a5750');grad.addColorStop(1,'#253b37');
  d.fillStyle=grad;d.fillRect(0,0,w,h);
  // The plan uses actual lanes and footprints; the surrounding contours are decorative.
  d.strokeStyle='#b9c4962e';d.lineWidth=1;
  for(let i=0;i<19;i++){
    d.beginPath();
    for(let xx=-30;xx<=w+30;xx+=11){
      const yy=-45+i*32+Math.sin(xx*.008+i*.47)*21+Math.cos(xx*.015+i*.23)*12;
      if(xx===-30)d.moveTo(xx,yy);else d.lineTo(xx,yy);
    }
    d.stroke();
  }
  for(const z of V16_ZONES){
    const pt=at(z),zw=z.w*s,zh=z.h*s;
    d.beginPath();d.roundRect(pt.x-zw/2,pt.y-zh/2,zw,zh,12);
    d.fillStyle=z.id==='plaza'?'#8282678b':z.id==='farm'?'#69835ead':z.id==='training'?'#696350bd':'#52685dbb';
    d.fill();d.strokeStyle='#cdc39868';d.stroke();
    if(z.id==='farm'){
      d.save();d.beginPath();d.rect(pt.x-zw*.44,pt.y-zh*.4,zw*.88,zh*.8);d.clip();
      for(let i=-4;i<=4;i++){
        const xx=pt.x+zw*i*.088;d.strokeStyle=i%2===0?'#a5b37c':'#4a6b50';d.lineWidth=4;
        d.beginPath();d.moveTo(xx-zh*.2,pt.y-zh*.4);d.lineTo(xx+zh*.22,pt.y+zh*.4);d.stroke();
      }
      d.restore();
    }
  }
  d.lineCap='round';
  for(const road of V16_ROADS){
    const [ax,ay,bx,by]=road,a=at({x:ax,y:ay}),b=at({x:bx,y:by});
    d.beginPath();d.moveTo(a.x,a.y);d.lineTo(b.x,b.y);
    d.lineWidth=12;d.strokeStyle='#344940';d.stroke();d.lineWidth=8;d.strokeStyle='#bfb18d';d.stroke();
    d.lineWidth=1;d.strokeStyle='#efe0b590';d.stroke();
  }
  d.fillStyle='#6d8a72';d.strokeStyle='#aac09871';
  for(const [xx,yy] of V16_TREES){
    const q=at({x:xx,y:yy});d.beginPath();d.arc(q.x,q.y,5,0,TAU);d.fill();d.stroke();
  }
  V45_HUB.townRaster=c;return c;
}
function v45TownSites(){
  const poi=v8POIs(), training=v42tZone(), objects=new Map(poi.map(o=>[o.id,o]));
  if(training)objects.set('training',training);
  return V45_SERVICE.flatMap(([id,icon,use])=>{
    const o=objects.get(id);
    if(!o)return [];
    const r=V36_BY_ID[id], person=V8_INFO[id],col=r?.color||V16_STATIONS[id]?.color||V45.jade;
    return [{id,icon,use,o,col,name:r?.name||o.name,sub:person?.name||use}];
  });
}
function v45TownTarget(s){
  if(s.id==='training'){
    modal=null;
    if(v36Inside())v36Leave();
    v42tOpen();
  }else v16Guide(s.id);
}
function v45TownMap(){
  const {x,y,w,h,rx,rw}=V45_MAP,sites=v45TownSites(),picked=sites.find(s=>s.id===V45_HUB.site)||sites[0];
  const {at}=v45TownLayout(x,y,w,h);
  v45MapHead('Thanh Thạch Thôn','Chọn một địa điểm để xem thông tin và lập đường đi',true);
  v45MapFrame(x,y,w,h);
  g.drawImage(v45TownGround(w,h),x,y,w,h);
  for(let i=0;i<V16_HOUSES.length;i++){
    const pos=at(V16_HOUSES[i]),a=imgs['v42house'+i],dw=i===0?104:78;
    if(a?.ready){const im=a.img,dh=dw*im.naturalHeight/im.naturalWidth;g.drawImage(im,pos.x-dw*.5,pos.y-dh*.75,dw,dh);}
  }
  const z=at({x:v17X(1400),y:v17Y(900)});
  v15Sprite('v15prop3',z.x,z.y+10,47);
  v44Label('Cổng Đông',z.x+14,z.y+29,11,V45.paper);
  const start=v36Inside()?v36Door(v36Current()):p, from=at(start);
  if(V8.route.length){
    g.save();g.lineDashOffset=-V41Presentation.clock*9;g.setLineDash([5,5]);
    v43MapLine([from,...V8.route.map(at)],'#fff3bde0',2);
    g.restore();
  }
  const t=v12Target(v12Tracked());
  for(const s of sites){
    const q=at(s.o),sel=picked.id===s.id,over=v33Over(q.x-14,q.y-14,28,28);
    if(sel||over){
      circle(q.x,q.y,15,null,s.col);
      v44Rect(q.x-77,q.y+17,154,23,'#152722f5',v42HUDAlpha(s.col,'a0'),4);
      v33Fit(s.name,q.x,q.y+28.5,141,11,V45.paper,'center','bold');
    }
    circle(q.x,q.y,10,sel?'#4e3e28':'#192b26',s.col);
    v35Icon(s.icon,q.x,q.y,6,s.col);
    if(t?.id===s.id)diamond(g,q.x+12,q.y-12,4,'#ffe1a0');
    buttons.push({x:q.x-11,y:q.y-11,w:22,h:22,v33:'v45site:'+s.id,fn:()=>V45_HUB.site=s.id});
  }
  circle(from.x,from.y,5,'#fff8d9','#293a31');
  circle(from.x,from.y,9+Math.sin(V41Presentation.clock*4),null,'#fff8d9',.63);
  v45Compass(x+45,y+56);
  v45MapUnframe(x,y,w,h);
  v45Surface(rx,y,rw,h,{solid:true});
  text('Địa điểm trong thôn',rx+12,y+18,14,V45.gold,'left','bold');
  sites.forEach((s,i)=>{
    const yy=y+33+i*36,sel=picked.id===s.id,over=v33Over(rx+7,yy,rw-14,32);
    v44Rect(rx+7,yy,rw-14,32,sel?'#4c402d':over?'#2b3d36':'#20312e',sel?'#d8b477a0':null,4);
    v35Icon(s.icon,rx+24,yy+16,9,s.col);
    v33Fit(s.name,rx+40,yy+16,215,12,V45.paper,'left','bold');
    v33Fit(s.use,rx+rw-15,yy+16,76,10,sel?V45.gold:V45.soft,'right');
    buttons.push({x:rx+7,y:yy,w:rw-14,h:32,v33:'v45siteRow:'+s.id,fn:()=>V45_HUB.site=s.id});
  });
  v45Surface(x,565,w,128,{solid:true});
  v18Title(picked.name,x+17,588,23,V45.paper);
  v44Rule(x+16,607,w-32,V45.edge);
  const r=V36_BY_ID[picked.id];
  v33Fit(r?picked.sub+' · '+r.desc:picked.id==='training'?'Tập chiêu với hình nhân và xem thống kê sát thương':picked.use,x+17,628,w-38,13,V45.soft);
  circle(x+21,672,4,'#fff5cb');text('Vị trí của bạn',x+34,672,11,V45.soft);
  diamond(g,x+147,672,4,V45.gold);text('Mục tiêu nhiệm vụ',x+159,672,11,V45.soft);
  v45Surface(rx,565,rw,128,{solid:true});
  text(Math.round(dist(start,picked.o))+' bước',rx+15,590,12,V45.soft);
  v45Button(rx+13,630,rw-26,45,'Dẫn đường',null,()=>v45TownTarget(picked),{primary:true,icon:'map',id:'townGuide'});
}




function v45MenuTitle(){
  v42pBackdrop();
  v41PText('VẠN ĐẠO',75,125,61,V45.paper,'left','serif','bold');
  v41PText('TU TIÊN',75,195,61,V45.paper,'left','serif','bold');
  v44Rule(78,242,352,'#e0bd7e8c');
  diamond(g,439,242,4,V45.gold);
  v41PText('THANH VÂN',78,266,21,V45.gold,'left','serif','bold');
  text(BUILD_VERSION,242,266,11,V45.soft);
}
v42pTitle=v45MenuTitle;
v41PButton=function(x,y,w,h,title,sub,fn,primary=false){
  const over=v33Over(x,y,w,h);
  v45Surface(x,y,w,h,{active:primary||over,edge:over?'#f3d897c0':V45.edge});
  if(primary){g.fillStyle=V45.gold;g.fillRect(x+3,y+5,2,h-10);}
  v33Fit(title,x+15,y+h/2-(sub?8:0),w-39,sub?17:14,V45.paper,'left','bold');
  if(sub)v33Fit(sub,x+15,y+h/2+14,w-39,11,V45.soft);
  text('›',x+w-16,y+h/2,19,V45.gold,'center');
  buttons.push({x,y,w,h,fn:()=>{v41Sound('click');fn();}});
};
v42pHome=function(){
  const saved=v41PSaved();
  v41PButton(78,312,374,61,saved?'Tiếp tục hành trình':'Bắt đầu hành trình',saved?'Mở hồ sơ đang chơi':'Tạo nhân vật tại Thanh Thạch Thôn',()=>{if(saved)resume();else V8.menuPage='create';},true);
  if(saved)v41PButton(78,383,374,43,'Tạo nhân vật mới','',()=>V8.menuPage='create');
  const y=saved?436:383;
  v41PButton(78,y,374,46,'Hướng dẫn điều khiển','',()=>V8.menuPage='help');
  v41PButton(78,y+56,374,46,'Bảo toàn hồ sơ','',v42sOpen);
  v41PButton(78,y+112,173,41,'Âm thanh: '+(v41AudioEnabled()?'Bật':'Tắt'),'',v41AudioToggle);
  v41PButton(259,y+112,193,41,'Đồ họa: '+V41_QUALITY_NAMES[v41Quality()],'',v41QualityToggle);
  text('Chơi offline · Tiến trình lưu trên thiết bị',80,677,12,V45.soft);
};

v36Mini=function(){
  const {x,y,w}=V45_BOXES.map,r=v36Current(),a=v36Inside();
  v45Surface(x,y,w,99);
  v33Shield(x,y,w,99);
  const sx=.103,sy=.107,ox=x+12,oy=y+14, dot=q=>({x:ox+(q.x-252)*sx,y:oy+(q.y-244)*sy});
  v44Rect(ox,oy,80,35,'#26332d',V45.edge,4);
  g.fillStyle='#856c483f';g.fillRect(dot(V36_NPC).x-10,oy+1,20,33);
  for(const f of v37Furniture(r)){const s=dot(f);v44Rect(s.x,s.y,f.w*sx,f.h*sy,'#6b5c42',null,1);}
  const n=dot(V36_NPC), me=dot(a);
  circle(n.x,n.y,2.7,r.color);circle(me.x,me.y,2.7,'#fff8d5','#25342c');
  v33Fit('Khu an toàn',x+105,y+24,w-116,12,V45.jade);
  v33Fit('Trong công trình',x+105,y+43,w-116,10,V45.soft);
  v45Button(x+12,y+60,w-24,27,'Sơ đồ thôn','M',()=>openPanel('map'),{id:'roomMap'});
};
v36HUD=function(){
  v35Reset();V35.rects={};
  const edit=v35Editing(),s=currentStats();
  if(modal&&!edit)return;
  v35Group('identity',()=>{v35Identity(s);v35Status();});
  v35Group('map',v36Mini);
  if(edit){
    v35Group('quest',v35Quest);
    v35Group('target',v35Target);
    v35Group('dock',()=>v35Dock(s));
    v35Group('left',v35Left);v35Group('nav',v35Nav);v35Group('feed',v35Feed);
    V35.dragButtons=buttons.filter(b=>b.v35?.startsWith('drag:'));
    return;
  }
  v35Group('quest',()=>v45Quest());
  v35Group('nav',v35Nav);
  const r=v36Current(),a=v36Inside(),near=dist(a,V36_NPC)<=75;
  v18Title(r.name,640,36,29,V45.paper,'center');v44Rule(582,57,116,'#e0bd7e91');
  v44Label(r.desc,640,74,12,V45.soft);
  const x=428,y=640,w=424;
  v45Surface(x,y,w,62);
  v33Shield(x,y,w,62);
  v45Button(x+8,y+7,232,34,near?'Nói chuyện':'Gặp '+V8_INFO[r.id].name,near?'E':null,near?v36Interact:v36GoNPC,{primary:true,id:'roomNpc'});
  v45Button(x+248,y+7,168,34,'Ra ngoài',null,v36GoExit,{id:'roomExit'});
  v44Label('WASD hoặc nhấp để di chuyển',640,y+51,10,V45.soft);
  if(notifyT>0&&notify&&!/^Đã vào /.test(notify))v44Label(notify,640,94,11,V45.gold);
  v33Drawer();
};

// Localised cast accents use the existing release and hit events. They never
// create extra projectiles, damage, warning zones, or delayed impacts.
const V45_AREA={storm:[1,1.9,.62,.48],fall:[2,1.14,1.72,.65],guard:[3,1.84,1.52,.57],quake:[4,1.9,1.17,.64],crush:[4,1.91,1.35,.71],lightning:[5,1.30,2.05,.83],blizzard:[6,1.92,1.48,.67]};
const V45_RELEASE={blade:[0,.94,.54,.50],fan:[0,1.12,.59,.47],shock:[4,.85,.61,.32],triple:[7,1.10,.48,.59],frost:[6,.61,.55,.44]};
function v45SkillSprite(id,x,y,w,h,opacity,angle=0,flip=false,feet=.5,cut=0){
  const im=V43_FX_IMG;if(!imgs.v45FX.ready||opacity<=.02)return;
  const cellW=im.naturalWidth/4,cellH=im.naturalHeight/2,px=(id%4)*cellW,py=Math.floor(id/4)*cellH;
  g.save();
  g.globalAlpha*=opacity;g.globalCompositeOperation='screen';
  g.translate(x,y);g.rotate(angle);if(flip)g.scale(-1,1);
  const top=clamp(cut,0,.4);
  g.drawImage(im,px+2,py+cellH*top+2,cellW-4,cellH*(1-top)-4,-w/2,h*(top-feet),w,h*(1-top));
  g.restore();
}
function v45SkillArea(f,q,ratio,palette){
  const [id,ws,hs,strength]=V45_AREA[f.style],r=f.r||85, fade=(1-q)**1.5;
  const [col,core]=palette,grow=1-(1-q)**6,bolt=f.style==='fall'||f.style==='lightning';
  const ring=q<.62?Math.sin(Math.PI*q/.78)**.8*(1-q):0;
  if(f.style!=='guard'&&ring>0)v43Wave(r*(.18+.81*grow),ratio,col,core,q*.6,ring*.67);
  if(f.style==='storm'){
    v45SkillSprite(id,0,-2,r*ws*(.78+.22*grow),r*(hs+.28)*ratio,fade*strength,q*1.2);
    g.save();g.scale(1,ratio);
    for(let i=0;i<3;i++){
      const a=q*9+i*TAU/3;
      v42cSlash(r*(.71+i*.1),a,a+1.23,11,[col,core],fade*.75);
    }
    g.restore();
    return;
  }
  const by=bolt?3:f.style==='guard'?0:8,sh=bolt?.85+.15*grow:.70+.30*grow;
  v45SkillSprite(id,0,by,r*ws*(.82+.18*grow),r*hs*sh,fade*strength,0,false,bolt?.92:f.style==='guard'?.8:.82,bolt?q*.28:0);
  if(bolt&&q<.29)v43Flash(0,-3,col,core,r*(.21+.16*q),Math.max(0,1-q/.29)*.48);
  if(f.style==='blizzard'&&q>.22){
    for(let i=0;i<(v42cQuality()?7:3);i++){
      const a=i*2.399+q*.5,rr=r*(.31+.55*v41cHash(i,45)),x=Math.cos(a)*rr,y=Math.sin(a)*rr*ratio;
      v43Shard(x,y,12+(i%3)*7,(i%3-1)*.18,col,core,fade*.74);
    }
  }
}
v42cSkill=function(f,q,ratio){
  const kind=f.style, palette=V42C_COL[kind]||[v42cHex(f.color),'#fff7df'];
  if(V45_AREA[kind]){
    g.save();g.globalAlpha*=.63;v43PriorSkill(f,q,ratio);g.restore();
    v45SkillArea(f,q,ratio,palette);
  }else if(V45_RELEASE[kind]){
    const [id,ws,hs,alpha]=V45_RELEASE[kind],r=f.r||85;
    const fade=(1-q)**2.4,x=18+28*q,y=0;
    v45SkillSprite(id,x,y,r*ws,r*hs,fade*alpha,0,kind==='triple');
    if(q<.35)v43Flash(13,0,palette[0],palette[1],10,fade*.65);
  }else v43PriorSkill(f,q,ratio);
};
const v45OldTrail=v42cDrawTrail;
v42cDrawTrail=function(t,point,world){
  const drew=v45OldTrail(t,point,world);
  if(!drew||V26.clock-t.at>.027)return drew;
  const head=point(t.b),before=point(t.points[Math.max(0,t.points.length-2)]);
  const angle=Math.atan2(head.y-before.y,head.x-before.x),[col,core]=V42C_COL[t.kind]||[t.col,'#fff7e7'];
  g.save();g.translate(head.x,head.y-12);g.rotate(angle);
  if(t.kind==='blade')v43Blade(0,0,31,0,col,core,.83);
  else if(t.kind==='frost')v43Shard(0,0,15,Math.PI/2,col,core,.83);
  else if(t.kind==='shock')v43Flash(0,0,col,core,13,.49);
  else v43Flash(0,0,col,core,8,.48);
  g.restore();return drew;
};

function v451Arena(){
 const run=v28Run();
 if(!run)return v35Arena();
 const m=MAPS[room],rs=v28RoomState(),nodes=v28ActiveNodes();
 const {x,y,w}=V45_BOXES.map,style=v29Difficulty(),loot=v21VisibleLoot().length;
 const rune=m.v28Rune&&!rs.sigil;
 const h=cleared?186:154;
 v45Surface(x,y,w,h);
 v33Shield(x,y,w,h);
 v33Fit(m.name,x+12,y+17,w-24,13,V45.paper,'left','bold');
 const stage=m.v28Stage==='hidden'?'Tầng ẩn':'Tầng '+m.v28Floor+'/5';
 text(stage+' · '+style.name,x+12,y+37,11,style.col);
 text('Bí ấn '+run.sigils.length+'/3',x+w-12,y+37,11,V45.gold,'right','bold');
 v44Rule(x+12,y+49,w-24,V45.edge);
 if(cleared){
  text('Đã dọn phòng · Vật phẩm còn '+loot,x+12,y+66,11,V45.jade);
  text(rune?'Bí ấn ở phía Bắc · E để lấy':'Có thể tiếp tục hành trình',x+12,y+84,11,V45.soft);
  const end=room===LAST||room===LAST-1&&run.sigils.length<3;
  v45Button(x+12,y+101,97,30,'Nhặt gần','Z',v21PickNear,{id:'dungeonPick',size:10});
  v45Button(x+116,y+101,104,30,end?'Tổng kết':'Sang phòng',null,v451DungeonNext,{primary:true,id:'dungeonNext',size:11});
  if(rune)v45Button(x+12,y+144,97,28,'Đến bí ấn',null,()=>v8SetGoal(v28Rune()),{id:'dungeonRune',size:10});
  v45Button(x+116,y+144,104,28,'Rút lui',null,v451Retreat,{id:'dungeonRetreat',size:11});
 }else{
  text('Yêu thú còn '+enemies.filter(e=>!e.dead).length,x+12,y+67,11,V45.paper);
  text(nodes.length?'E · Phá '+nodes.length+' trận nhãn còn lại':'Hạ yêu thú để mở lối đi',x+12,y+85,11,V45.soft);
  if(run.v29){
   const mod=v29Mod();
   v33Fit(mod.name+' · '+mod.hint,x+12,y+102,w-24,10,V45.gold);
  }
  v45Button(x+12,y+116,97,28,'Rút lui',null,v451Retreat,{id:'dungeonRetreat',size:11});
 }
}
function v451Panel(){
 const state=modal;
 if(state.kind==='v451Result'){
  const r=p.v451Result,def=V28_ROUTE[r?.route];
  if(!r||!def){modal=null;return;}
  const d=V29_D[r.difficulty]||V29_D[0];
  const row=v29Record(r.route,r.difficulty);
  v42HUDShell('CHINH PHỤC BÍ CẢNH',def.name+' · '+d.name);
  v45Surface(184,132,912,450,{solid:true});
  v18Title(def.name,640,195,33,V45.paper,'center');
  text(r.hidden?'Đã hạ '+def.hidden:'Đã vượt 5 tầng',640,244,19,V45.gold,'center','bold');
  const time=r.seconds==null?'—':Math.floor(r.seconds/60)+' phút '+(r.seconds%60)+' giây';
  const stats=[['Thời gian',time],['Bí ấn',r.seals+' / 3'],['Số lượt vượt mức này',String(row.clears)]];
  stats.forEach(([label,value],i)=>{
   const x=222+i*285;
   v45Surface(x,290,266,98);
   text(label,x+133,317,12,V45.soft,'center');
   text(value,x+133,352,22,V45.paper,'center','bold');
  });
  text(p.v12Main>=V12_MAIN.length?'Chính tuyến đã hoàn thành':'Chính tuyến '+p.v12Main+' / '+V12_MAIN.length,640,443,14,V45.jade,'center');
  text(p.level>=45?'Hóa Thần đại viên mãn':realm(),640,472,14,V45.soft,'center');
  v45Button(470,517,340,41,'Trở về Cửu Vực','Esc',()=>modal=null,{primary:true,id:'closeDungeonResult'});
  return;
 }
 const run=v28Run();
 if(!run||run.serial!==state.serial||(state.kind==='v451Next'&&state.room!==room)){modal=null;return;}
 const retreat=state.kind==='v451Retreat';
 const loot=v21VisibleLoot().length;
 const missing=MAPS[room].v28Rune&&!v28RoomState().sigil;
 const end=room===LAST||room===LAST-1&&run.sigils.length<3;
 v42HUDShell(retreat?'RÚT LUI KHỎI BÍ CẢNH':end?'KẾT THÚC LƯỢT VƯỢT ẢI':'SANG PHÒNG TIẾP THEO',V28_ROUTE[run.route].name+' · '+MAPS[room].name);
 v45Surface(243,177,794,335,{solid:true});
 const title=retreat?'Trở về vị trí trước khi vào bí cảnh?':'Xác nhận rời căn phòng này';
 v18Title(title,273,221,23,V45.paper);
 const details=retreat?
   ['Lượt hiện tại sẽ kết thúc. Khi vào lại, bạn bắt đầu từ phòng đầu.','Vật phẩm đã nhặt nằm trong hành trang. Vật phẩm trên đất sẽ mất.']:
   [missing?'Bí ấn của phòng này còn ở phía Bắc. Cần đủ 3 bí ấn để mở tầng ẩn.':'Đã thu thập '+run.sigils.length+' / 3 bí ấn trong lượt này.',
    loot?'Còn '+loot+' vật phẩm trên đất. Rời phòng sẽ bỏ lại số vật phẩm này.':'Đã nhặt hết vật phẩm trong phòng.'];
 details.forEach((line,i)=>v12Wrap(line,273,279+i*49,731,14,V45.soft,21,2));
 if(!retreat&&missing)v45Button(273,374,215,36,'Đi đến bí ấn',null,()=>{modal=null;v8SetGoal(v28Rune());},{id:'confirmRune'});
 v45Button(273,439,233,43,'Ở lại','Esc',()=>modal=null,{id:'cancelDungeonAction'});
 v45Button(728,439,279,43,retreat?'Xác nhận rút lui':end?'Kết thúc lượt':'Xác nhận sang phòng',null,
   retreat?()=>v28Finish(false,true):v451DungeonProceed,{primary:true,id:retreat?'confirmRetreat':'confirmDungeonNext'});
}
const V451_PANELS=['v451Next','v451Retreat','v451Result'];

// panel: định nghĩa duy nhất (gộp 18 lớp ở T03). Xét bảng theo đúng thứ tự cũ: lớp mới nhất trước.
function panel(){
  const k=modal?.kind;
  if(V451_PANELS.includes(k))return v451Panel();          // V45.1
  if(k==='v42codex')return v42cxPanel();                   // V42 codex
  if(k==='settings')return v42AccessSettings();            // V42 cài đặt
  if(k==='v42practice')return v42tPanel();                 // V42 sân luyện
  if(k==='v42save')return v42sPanel();                     // V42 sao lưu
  if(k==='v42world')return v42wPanel();                    // V42 thế giới
  if(v35Editing()){buttons.push(...(V35.dragButtons||[]));v35Editor();return;} // V35 tùy chỉnh HUD
  if(k==='v31dao')return v31Panel();                       // V31
  if(k==='v30forge')return v30ForgePanel();                // V30
  if(k==='v30trial')return v30TrialPanel();
  if(k==='v29difficulty')return v29DifficultyPanel();      // V29
  if(k==='v29world')return v29WorldPanel();
  if(k==='v29sets')return v29SetsPanel();
  if(k==='gear'||k==='inventory'){v21Inventory();return;}  // V21 túi đồ hợp nhất
  if(k==='relic21'){modal.kind='inventory';try{panelLegacy();}finally{if(modal)modal.kind='relic21';}return;}
  panelLegacy();
}
// Các bảng V8–V18 + thân gốc, vẽ trong cờ v18UI (giữ đúng hành vi lớp V18).
function panelLegacy(){
  v18UI=true;
  try{
    const k=modal?.kind;
    if(k==='jiang14'){v14Panel();return;}                  // V14
    if(k==='life13'){v13Panel();return;}                   // V13
    if(k==='skill11'){v11SkillPanel();return;}             // V11
    if(k==='stats10'){v10Panel();return;}                  // V10
    if(k==='npc8'){v8Panel();return;}                      // V8
    if(k==='journal8'){v8Journal();return;}
    panelCore();
  }finally{v18UI=false;}
}

// update_L31: lớp 47_v45_v35 (trước đây lưu lớp dưới vào v451PreviousUpdate). Gọi lớp dưới: update_L30.
function update_L31(dt){
 if(mode==='play'&&V451_PANELS.includes(modal?.kind)){
  if(pressed.Escape)modal=null;
  return;
 }
 return update_L30(dt);
}

let last=performance.now();
let v8Accumulator=0;function frame(now){v8Accumulator+=clamp((now-last)/1000,0,.10);last=now;let n=0;while(v8Accumulator>=1/60&&n++<6){update(1/60);v8Accumulator-=1/60;for(const k in pressed)delete pressed[k];}rsPrepare();draw();frameOverlay();requestAnimationFrame(frame);}
window.__VDTT=()=>({mode,room,p,animation:animation.name,enemies:enemies.length,modal:modal?.kind||null,seed,remaining,images:Object.fromEntries(Object.entries(imgs).map(([k,v])=>[k,v.ready]))});
requestAnimationFrame(frame);

// ================= V48 Sơn Hà Khám Phá — chế độ Khám phá bản đồ (Đợt 2q) =================
// Đồ thị đường đi tay vẽ (mặt phẳng 600x400) lấy nguyên văn từ file V48 người dùng gửi.
// Art nền dùng tranh toàn cảnh v47map đã có trong game (không nhúng thêm 10 tranh V48
// để tránh trùng lặp và phình file). Sprite người khám phá (v48idle / v48run*) nhúng
// từ file V48. Tiến độ khám phá lưu riêng key VDTT_V48_explorer, không chạm save chính.
const V48_ROUTES=(()=>{
 const P=(id,x,y,kind='junction',name='',detail='')=>({id,x,y,kind,name,detail});
 const E=(a,b,via=[],width=9,surface='road')=>({a,b,via,width,surface});
 const G=(id,x,y,target,name)=>({...P(id,x,y,'gate',name),target});
 const L=(id,x,y,name,detail)=>P(id,x,y,'landmark',name,detail);
 const S=(id,x,y,name,detail)=>P(id,x,y,'site',name,detail);
 const R=(id,x,y,name,detail)=>P(id,x,y,'resource',name,detail);
 const B=(id,x,y,name,detail)=>P(id,x,y,'trial',name,detail);
 return {
  thon:{ theme:'Thanh bình · làng ven sông', feature:'Phố chợ và sân luyện nối với đại điện bằng đường vòng.', nodes:[
    P('spawn',293,365,'start','Cổng làng'),P('south',293,276),L('hall',293,206,'Thanh Vân Đại Điện','Trưởng lão chỉ lối tu hành.'),P('west',151,174),S('market',111,212,'Phố chợ','Thương nhân, lò rèn và đan phòng.'),S('training',111,87,'Hộ vệ đường','Sân luyện tập của hộ vệ.'),P('shore',391,204),S('bridge',441,190,'Cầu Thanh Thủy','Nối hai bờ sông.'),P('east',490,150),G('next',515,95,'truc','Truyền tống trận')], edges:[E('spawn','south',[[293,330],[290,305]],10),E('south','hall',[],19),E('hall','west',[[220,190]],13),E('west','market',[[118,195]],10),E('west','training',[[128,147],[109,120]],9),E('market','hall',[[152,230],[221,233]],12),E('hall','shore',[[350,207]],13),E('shore','bridge',[],7,'bridge'),E('bridge','east',[[478,194],[490,171]],7,'bridge'),E('east','next',[[510,130]],10)]},
  yeu:{theme:'Hoang sơn · địa hình phân tầng',feature:'Các sườn núi có nhánh săn yêu thú và đường vòng qua cổ kiếm.',nodes:[G('prev',85,354,'truc','Cổng Thanh Trúc'),P('lower',156,312),P('fork',202,240),L('sword',313,218,'Cổ Kiếm Di Tích','Kiếm khổng lồ cắm giữa cổ đàn.'),B('boss',321,74,'Yêu Vương Đài','Khảo sát vị trí chiến đấu boss.'),P('rise',374,143),S('cave',532,199,'Hang yêu thú','Cửa hang trên sườn đá.'),B('arena',464,282,'Bãi chiến sườn núi','Địa hình mở cho giao chiến.'),S('ruins',120,66,'Sơn Nhai Phế Đàn','Nền đàn trên vách núi.'),G('next',531,76,'tram','Cổng Hắc Độc')],edges:[E('prev','lower',[[127,344]],9),E('lower','fork',[[152,287],[162,247]],8),E('lower','sword',[[213,305],[253,302],[293,263]],8,'bridge'),E('fork','sword',[[253,237]],12),E('fork','ruins',[[227,183],[187,140],[156,120],[145,101]],9),E('sword','boss',[[314,170],[320,116]],9),E('sword','rise',[[390,217],[394,173]],10),E('rise','next',[[406,124],[480,108],[508,94]],8),E('sword','arena',[[361,245],[420,251]],12),E('arena','cave',[[477,241],[516,216]],8),E('cave','rise',[[477,217],[411,217]],8)]},
  tuyet:{theme:'Bắc cảnh · tuyết và sông băng',feature:'Đại lộ hẹp xuyên tuyết, cầu băng và nhánh hàn tuyền.',nodes:[G('prev',78,350,'tram','Cổng Hắc Độc'),P('west',127,222),P('fork',188,167),L('palace',291,158,'Hàn Băng Cổ Điện','Bậc thềm trước cổ điện.'),S('ruins',118,83,'Tàn tích Bắc Minh','Các trụ đá cổ phủ tuyết.'),B('arena',287,263,'Hàn Tuyết Chiến Trường','Mặt sân rộng giữa băng.'),P('bridge',417,181),R('spring',520,250,'Hàn Tuyền','Thu thập hàn tinh quanh hồ.'),P('east',511,143),G('next',516,85,'hoa','Cổng Xích Viêm')],edges:[E('prev','west',[[96,305],[118,251]],9,'snow'),E('west','fork',[[152,177]],9,'snow'),E('fork','ruins',[[164,138],[142,110]],8,'snow'),E('fork','palace',[[230,166]],12,'snow'),E('palace','arena',[[291,205]],13,'snow'),E('palace','bridge',[[342,172]],8,'icebridge'),E('bridge','east',[[468,174],[499,155]],7,'icebridge'),E('east','next',[[521,114]],8,'snow'),E('east','spring',[[534,187],[507,213],[493,240]],7,'snow')]},
  hoa:{theme:'Hoang mạc · địa nhiệt',feature:'Tuyến vòng tránh khe nóng, nhiều ngã rẽ trong phế tích.',nodes:[G('prev',73,352,'tuyet','Cổng Bắc Minh'),P('west',118,258),R('well',103,181,'Giếng Cạn','Tìm linh thạch trong giếng.'),P('fork',183,169),S('ruins',110,76,'Cổ Thành Vùi Cát','Khảo sát kiến trúc hoang phế.'),L('altar',293,175,'Xích Viêm Tế Đàn','Hỏa nguyên bốc lên từ đàn.'),P('south',306,238),B('arena',482,276,'Viêm Hỏa Chiến Đài','Đấu trường đá đỏ.'),P('east',393,174),G('next',520,86,'phong','Cổng Thiên Phong')],edges:[E('prev','west',[[101,310]],10,'sand'),E('west','well',[[137,226]],8,'sand'),E('west','fork',[[157,219]],10,'sand'),E('well','fork',[[146,184]],9,'sand'),E('fork','ruins',[[151,143],[114,114]],11,'sand'),E('fork','altar',[[236,166]],11,'sand'),E('altar','south',[[301,214]],10,'heat'),E('south','prev',[[265,265],[210,285],[143,329]],9,'sand'),E('altar','east',[[351,172]],10,'heat'),E('south','arena',[[367,226],[407,218],[418,253]],10,'sand'),E('east','arena',[[413,199],[408,226],[429,253]],8,'sand'),E('east','next',[[412,144],[409,107],[448,89],[482,89]],9,'sand')]},
  phong:{theme:'Phong cốc · vực cao',feature:'Một trục thung lũng, cầu treo hẹp và nhánh đấu trường trên vách.',nodes:[G('prev',68,343,'hoa','Cổng Xích Viêm'),P('fork',138,249),L('platform',266,202,'Phong Linh Đài','Đài đá nơi hội tụ linh phong.'),S('high',93,80,'Sân Luyện Trên Cao','Quảng trường trên vách núi phía tây.'),S('palace',311,126,'Thiên Phong Các','Cổ điện chạm hình mây.'),P('bridge',405,219),P('east',493,210),B('arena',512,302,'Bãi Chiến Vực Gió','Khu vực luyện kiếm bên vách.'),G('next',538,74,'quy','Cổng U Minh')],edges:[E('prev','fork',[[103,310],[117,274]],8),E('fork','platform',[[198,221]],12),E('platform','high',[[185,169],[170,142],[146,119],[112,106]],8),E('platform','palace',[[293,169],[306,148]],9),E('platform','bridge',[[319,221],[353,220]],7,'windbridge'),E('bridge','east',[[453,210]],5,'windbridge'),E('east','arena',[[541,245],[527,273]],10),E('east','next',[[488,177],[495,129],[527,113]],8,'wind')]},
  quy:{theme:'Âm giới · cổ mộ',feature:'Đường mộ bia uốn quanh tế đàn, hầm mộ và đường lên cổ điện.',nodes:[G('prev',81,350,'phong','Cổng Thiên Phong'),P('west',155,267),P('fork',203,184),L('seal',303,193,'Trấn Hồn Tế Đàn','Pháp trận trấn áp oán linh.'),S('crypt',531,255,'Hầm Mộ Cổ','Lối vào hầm đá ở phía đông.'),B('arena',364,301,'Cổ Mộ Chiến Trường','Đất trống quanh bia gãy.'),S('temple',306,100,'U Minh Điện','Bậc thềm điện u linh.'),R('tombs',111,112,'Rừng Bia Mộ','Thu thập âm tinh ven các bia đá.'),P('east',435,147),G('next',532,71,'ma','Cổng Ma Vực')],edges:[E('prev','west',[[108,321],[147,293]],9),E('west','fork',[[158,230],[184,204]],9),E('fork','seal',[[247,179]],10),E('fork','tombs',[[170,147],[145,130]],9),E('seal','temple',[[303,146]],9),E('seal','arena',[[300,245],[275,275]],12),E('arena','crypt',[[434,281],[481,273]],9),E('seal','crypt',[[393,206],[436,215],[459,245]],9),E('seal','east',[[379,172]],10),E('east','next',[[478,126],[514,94]],9)]},
  loi:{theme:'Hoang nguyên · thiên lôi',feature:'Bình nguyên mở với đường vòng, tháp lôi và khu vực lôi kiếp.',nodes:[G('prev',70,328,'ma','Cổng Ma Vực'),P('west',152,257),P('fork',185,215),L('crystal',303,193,'Lôi Tinh Thần Tích','Tinh thạch lớn tỏa điện tím.'),S('tower',302,109,'Tháp Thiên Lôi','Tháp thử luyện lôi hệ.'),R('ruins',125,86,'Phế Tháp','Tinh thạch nằm gần phế tích.'),P('east',419,194),B('arena',489,285,'Tử Lôi Kiếp Đàn','Địa điểm khảo sát boss cuối.'),P('south',315,249),S('reserve',532,74,'Cổng Cổ Bị Phong Ấn','Mốc dự trữ cho chương tiếp theo; không truyền tống.')],edges:[E('prev','west',[[120,305]],10),E('west','fork',[[165,239]],11),E('fork','ruins',[[107,171],[102,143],[111,117]],10),E('fork','crystal',[[234,196]],12),E('crystal','tower',[[302,153]],9),E('crystal','south',[],11,'storm'),E('crystal','east',[[373,199]],10),E('east','reserve',[[421,156],[453,126],[495,108]],8),E('east','arena',[[427,234],[452,252]],11,'storm'),E('south','arena',[[347,283],[390,307],[445,309]],10,'storm')]},
  tram:{theme:'Đầm độc · các đảo biệt lập',feature:'Đường cầu gỗ và đá nổi; nước sâu là vùng cấm đi. Hồ độc phía tây chỉ là cảnh quan.',nodes:[G('prev',77,353,'yeu','Cổng Vạn Yêu'),P('entrybridge',109,299),R('herbs',140,256,'Đảo Linh Dược','Linh thảo mọc quanh đá cổ.'),P('stones',228,236),S('island',285,183,'Đảo Bia Đá','Dấu tích của tu sĩ cũ.'),P('cross',360,174),S('hut',480,181,'Dược Lư','Trạm nghỉ trên đảo thuốc.'),P('southbridge',443,224),B('arena',420,308,'Đảo Chiến Trường','Nền đất khô rộng, tách khỏi lối chính.'),P('northbridge',413,110),L('altar',330,79,'Hắc Độc Cổ Đàn','Đàn đá cổ giữa sương độc.'),P('stepping',468,76),G('next',560,50,'tuyet','Cổng Bắc Minh')],edges:[E('prev','entrybridge',[[84,330]],7,'bridge'),E('entrybridge','herbs',[[121,282]],7,'bridge'),E('herbs','stones',[[171,251],[200,244]],5,'stones'),E('stones','island',[[250,222],[266,204]],6,'stones'),E('island','cross',[[312,176]],7),E('cross','hut',[[395,174],[427,176]],7,'bridge'),E('hut','southbridge',[[465,197]],7,'bridge'),E('southbridge','arena',[[435,248],[421,269]],8),E('hut','northbridge',[[458,150],[438,130]],7,'bridge'),E('northbridge','altar',[[392,94],[365,82]],7,'bridge'),E('altar','stepping',[[387,83],[430,78]],5,'stones'),E('stepping','next',[[502,68],[528,56]],5,'stones')]},
  truc:{theme:'Trúc lâm · đường mòn ven sông',feature:'Đường chữ S, cầu gỗ hẹp, chùa ẩn và nhánh dược viên; không quảng trường tròn.',nodes:[G('prev',79,337,'thon','Cổng Thanh Thạch'),P('bend',127,313),P('shore',131,245),S('bridge',194,215,'Thanh Trúc Kiều','Cầu gỗ là lối qua sông.'),P('fork',295,133),L('temple',182,109,'Thanh Vân Cổ Tự','Cổ tự ẩn khuất bên thác.'),P('north',383,83),P('eastfork',458,88),G('next',489,59,'yeu','Cổng Vạn Yêu'),P('forest',433,158),R('herbs',531,156,'Linh Dược Viên','Linh thảo và nguyên liệu luyện đan.'),B('arena',477,291,'Bãi Yêu Thú','Khoảng đất lớn phía đông nam.')],edges:[E('prev','bend',[[106,336]],8),E('bend','shore',[[132,291],[99,269],[101,258]],9),E('shore','bridge',[[154,228]],7,'bridge'),E('bridge','fork',[[229,205],[255,184],[295,163]],9),E('fork','temple',[[247,121],[218,116]],8),E('fork','north',[[332,106]],10),E('north','eastfork',[[420,81]],9),E('eastfork','next',[[475,72]],10),E('eastfork','forest',[[464,108],[441,137]],7),E('forest','herbs',[[467,169],[514,172]],8),E('forest','arena',[[406,179],[374,210],[364,239],[330,270],[360,298]],9)]}
  ,ma:{theme:'Ma cảnh · hẻm vực tím',feature:'Đường đèo chữ S, hai cầu đá dài; đấu trường boss nằm riêng trên đài cao.',nodes:[G('prev',82,334,'quy','Cổng U Minh'),P('bridgeSouth',199,295),P('junction',306,283),P('bend',343,239),P('center',273,205),L('altar',443,210,'Ma Môn Nghi Lễ','Cổng đồng cổ bị ma khí xâm nhiễm.'),B('boss',130,90,'Huyết Ấn Đài','Đấu trường boss trên vách đá.'),S('shrine',489,330,'Miếu Đổ','Di tích trong nhánh đường cụt.'),P('bendNorth',260,117),P('bridgeNorth',365,73),P('ledge',493,64),G('next',550,53,'loi','Cổng Tử Lôi')],edges:[E('prev','bridgeSouth',[[122,338],[158,315]],7,'bridge'),E('bridgeSouth','junction',[[242,283],[280,280]],7,'bridge'),E('junction','bend',[[318,263],[337,253]],8),E('bend','center',[[328,221],[298,215]],8),E('center','altar',[[329,205],[385,211]],12),E('center','boss',[[227,218],[203,210],[176,185],[150,153],[132,123]],6),E('junction','shrine',[[339,300],[370,313],[384,336],[425,347],[465,340]],9),E('center','bendNorth',[[285,186],[330,164],[336,151],[293,130]],7),E('bendNorth','bridgeNorth',[[288,100],[329,85]],7,'bridge'),E('bridgeNorth','ledge',[[409,58],[450,54]],7,'bridge'),E('ledge','next',[[521,63]],9)]}
};
})();
const V48X_SURFACE={road:1,bridge:.88,stones:.65,snow:.82,icebridge:.7,sand:.88,heat:.75,windbridge:.74,wind:.84,storm:.78};
const V48X_ICONS={start:'⌂',landmark:'◇',site:'◆',resource:'✦',trial:'⚑',gate:'◎'};
const V48X_COLORS={start:'#e8c98b',landmark:'#f0ca76',site:'#e4cc98',resource:'#a8e28d',trial:'#e9a08e',gate:'#87eed5'};
const V48X={active:false,mapId:'thon',x:0,y:0,visited:['thon'],discovered:{},stones:0,path:[],selected:null,zoom:1,cam:{x:0,y:0},view:{scale:1.8,x:100,y:0},showRoutes:false,frame:0,dir:'S',flip:false,moving:false,clock:0,graph:null};
const V48X_GRAPHS={};
function v48xMeta(id){const i=V22_ORDER.indexOf(id),r=V48_ROUTES[id];return{mapId:id,index:i,name:REG[id]?.name||id,theme:r?.theme||'',feature:r?.feature||'',safe:id==='thon'};}
function v48xGraph(id){if(V48X_GRAPHS[id])return V48X_GRAPHS[id];const m=V48_ROUTES[id];if(!m)return null;const verts=m.nodes.map(n=>({...n})),lookup=new Map(verts.map((n,i)=>[n.id,i])),edges=[];for(const e of m.edges){let last=lookup.get(e.a);for(const q of [...e.via,null]){let next;if(q){next=verts.length;verts.push({x:q[0],y:q[1]});}else next=lookup.get(e.b);edges.push({a:last,b:next,width:e.width,surface:e.surface});last=next;}}return V48X_GRAPHS[id]={verts,edges,lookup};}
function v48xProj(pt,a,b){const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy,t=L?clamp(((pt.x-a.x)*dx+(pt.y-a.y)*dy)/L,0,1):0;return{x:a.x+t*dx,y:a.y+t*dy,t};}
function v48xNearest(g,pt){let best=null;for(const e of g.edges){const q=v48xProj(pt,g.verts[e.a],g.verts[e.b]),d=dist(pt,q);if(!best||d<best.d)best={...q,d,e};}return best;}
function v48xAllowed(g,pt){for(const e of g.edges){if(dist(pt,v48xProj(pt,g.verts[e.a],g.verts[e.b]))<=e.width)return true;}return false;}
function v48xPathfind(g,start,end){const from=v48xNearest(g,start),to=v48xNearest(g,end);if(!from||!to||from.d>25||to.d>22)return null;const v=[...g.verts,{x:from.x,y:from.y},{x:to.x,y:to.y}],s=v.length-2,t=v.length-1,adj=v.map(()=>[]);function join(a,b,rate=1){const w=dist(v[a],v[b])/rate;adj[a].push([b,w]);adj[b].push([a,w]);}for(const e of g.edges)join(e.a,e.b,V48X_SURFACE[e.surface]||1);for(const [i,q] of [[s,from],[t,to]]){join(i,q.e.a);join(i,q.e.b);}if(from.e===to.e)join(s,t);let d=v.map(()=>Infinity),prev=v.map(()=>-1),done=new Set();d[s]=0;while(done.size<v.length){let k=-1;for(let i=0;i<v.length;i++)if(!done.has(i)&&(k<0||d[i]<d[k]))k=i;if(k<0||!Number.isFinite(d[k]))break;if(k===t)break;done.add(k);for(const [j,w]of adj[k])if(d[k]+w<d[j]){d[j]=d[k]+w;prev[j]=k;}}if(!Number.isFinite(d[t]))return null;let out=[];for(let i=t;i!==-1;i=prev[i]){out.push({x:v[i].x,y:v[i].y});if(i===s)break;}return out.reverse().filter((pt,i,a)=>!i||dist(pt,a[i-1])>.01);}
function v48xSites(){return V48_ROUTES[V48X.mapId].nodes.filter(n=>n.kind!=='junction'&&n.kind!=='gate'&&n.kind!=='start');}
function v48xExplored(){return new Set(V48X.discovered[V48X.mapId]||[]);}
function v48xGateOpen(n){const dest=V48X_META_BY_ID[n.target];if(!v46CanEnter(n.target).ok)return false;return dest.index<V48X_META_BY_ID[V48X.mapId].index||V48X.visited.includes(dest.mapId)||(v48xExplored().size>=2&&v48xSites().filter(x=>x.kind==='landmark').every(x=>v48xExplored().has(x.id)));}
const V48X_META_BY_ID=Object.fromEntries(V22_ORDER.map(id=>{const m=v48xMeta(id);return[id,m];}));
function v48xSave(){try{localStorage.setItem(v46ExplorerKey(),JSON.stringify({mapId:V48X.mapId,position:{x:V48X.x,y:V48X.y},visited:V48X.visited,discovered:V48X.discovered,stones:V48X.stones}));}catch(e){}}
