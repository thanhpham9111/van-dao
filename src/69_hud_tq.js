'use strict';
// HUD kiểu Titan Quest (chủ dự án chọn 22/11/2026) — bản 2 "sát mẫu hơn, gọn hơn":
//  • ĐÁY: một khối đồng-sơn-mài dính mép màn hình. Hai cánh thấp (máu trái / linh lực phải, thanh ống kính có vệt máu trễ),
//    khối giữa nhô cao chứa 7 ô kỹ năng VUÔNG viền đồng, phím ghi nhỏ trong góc ô, không chữ dưới ô. Tu vi là chỉ vàng dưới hàng ô.
//    Đầu hai cánh: nút nhỏ (trái: tự đánh/tự nhặt · phải: nhặt gần/menu).
//  • TRÊN-TRÁI: chân dung viền đồng + tên + cảnh giới; hàng icon nhỏ có đế tối để đọc được trên nền sáng.
//  • TRÊN-PHẢI: bản đồ tròn viền đồng có vạch 4 hướng, biển tên vùng treo dưới; nhiệm vụ còn 1 dòng (bấm = dẫn đường).
//  • Bỏ: chữ "Sinh mệnh/Linh lực", linh thạch/đan dưới thanh, nhãn dưới từng ô, toast giữa màn (đã có ở dòng thông báo),
//    tên thôn cố định giữa đỉnh (chỉ hiện 3,5s khi vào thôn). Thông báo tối đa 2 dòng, tắt sau 5s.
// Giữ tên nhóm v35Group (identity/map/quest/dock/left/nav/feed) nên trình chỉnh HUD F2 vẫn kéo/thu phóng được.
// Tắt toàn bộ: HUD_TQ=false.
const HUD_TQ=true;
const TQ={cx:640,top:642,wing:662,bot:720,l:214,r:1066,cl:446,cr:834,slot:46,gap:6,
 ink:'#120d09',ink2:'#090604',gold:'#d2b071',goldL:'#f3dca2',goldD:'#6e5530',bronze:'#9b7a45',paper:'#efe6d4',soft:'#a99c84',
 red:'#c23a2c',redD:'#4f120d',blue:'#3d7cc0',blueD:'#122b4a',jade:'#8fd18a'};
// Khung nhóm cho F2 khớp bố cục mới (x,y,w,h). left/nav = hai đầu cánh của thanh đáy.
if(HUD_TQ&&typeof V35_GROUPS!=='undefined')Object.entries({identity:[10,8,296,112],map:[1108,4,166,192],quest:[1000,196,272,30],
 dock:[TQ.l,TQ.top-2,TQ.r-TQ.l,76],left:[TQ.l+2,TQ.wing+4,30,52],nav:[TQ.r-32,TQ.wing+4,30,52],feed:[214,594,440,42]})
 .forEach(([k,[x,y,w,h]])=>Object.assign(V35_GROUPS[k],{x,y,w,h}));
const TQS={hp:null,mp:null,hubSeen:-9,hubSince:0};

// ---------- vật liệu
function tqMetal(y0,y1){const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,TQ.goldL);gr.addColorStop(.45,TQ.gold);gr.addColorStop(1,TQ.goldD);return gr;}
function tqShape(){ // viền khối đáy: cánh thấp + khối giữa nhô, vai vát chéo
 const {l,r,cl,cr,top,wing,bot}=TQ;g.beginPath();g.moveTo(l,bot);g.lineTo(l,wing+12);g.quadraticCurveTo(l,wing,l+12,wing);
 g.lineTo(cl-22,wing);g.lineTo(cl,top);g.lineTo(cr,top);g.lineTo(cr+22,wing);g.lineTo(r-12,wing);g.quadraticCurveTo(r,wing,r,wing+12);g.lineTo(r,bot);g.closePath();
}
function tqFrame(){
 g.save();
 g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=14;g.shadowOffsetY=-2;tqShape();
 const gr=g.createLinearGradient(0,TQ.top,0,TQ.bot);gr.addColorStop(0,'#2a1d12');gr.addColorStop(.35,'#17100a');gr.addColorStop(1,'#0a0705');g.fillStyle=gr;g.fill();
 g.shadowColor='transparent';
 g.lineWidth=4;g.strokeStyle='#050302';g.stroke();g.lineWidth=2;g.strokeStyle=tqMetal(TQ.top,TQ.wing+20);g.stroke();
 // chỉ đồng mảnh bên trong
 g.save();g.translate(0,5);g.globalAlpha*=.45;g.lineWidth=1;g.strokeStyle=TQ.bronze;tqShape();g.stroke();g.restore();
 // vân lụa mờ trong lòng khối
 g.save();tqShape();g.clip();g.globalAlpha*=.05;g.strokeStyle=TQ.goldL;g.lineWidth=1;for(let x=TQ.l-80;x<TQ.r;x+=18){g.beginPath();g.moveTo(x,TQ.bot);g.lineTo(x+80,TQ.top);g.stroke();}g.restore();
 g.restore();
 // đinh đồng ở hai vai + ngọc giữa
 for(const x of [TQ.cl-11,TQ.cr+11])tqStud(x,TQ.wing-10+5,3);
 tqStud(TQ.l+8,TQ.wing+8,2.5);tqStud(TQ.r-8,TQ.wing+8,2.5);
 g.save();g.translate(TQ.cx,TQ.top);g.rotate(Math.PI/4);g.fillStyle='#0b0806';g.fillRect(-7,-7,14,14);g.strokeStyle=tqMetal(-7,7);g.lineWidth=1.6;g.strokeRect(-7,-7,14,14);
 g.fillStyle=V25_COLOR?.[p.cls]||TQ.jade;g.globalAlpha*=.9;g.fillRect(-3.5,-3.5,7,7);g.restore();
}
function tqStud(x,y,r){g.save();const gr=g.createRadialGradient(x-r*.4,y-r*.4,0,x,y,r);gr.addColorStop(0,TQ.goldL);gr.addColorStop(1,TQ.goldD);g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();g.restore();}
function tqTip(label,x,y){const tw=clamp(label.length*6.6+22,80,320),tx=clamp(x-tw/2,8,W-tw-8);g.save();g.fillStyle='rgba(10,7,5,.94)';g.fillRect(tx,y,tw,24);g.strokeStyle=TQ.goldD;g.lineWidth=1;g.strokeRect(tx+.5,y+.5,tw-1,23);g.fillStyle=TQ.gold;g.fillRect(tx+6,y,tw-12,1);g.restore();v33Fit(label,tx+tw/2,y+12,tw-12,11,TQ.paper,'center');}
// thanh ống kính: rãnh tối, vệt trễ sáng, phần đầy có bóng, vạch 10%, số ở giữa
function tqTube(x,y,w,h,v,max,lag,col,colD,warn){
 const f=clamp(v/Math.max(1,max),0,1),lf=clamp(lag/Math.max(1,max),0,1);
 g.save();g.fillStyle='#050302';g.fillRect(x-2,y-2,w+4,h+4);g.fillStyle='rgba(255,255,255,.04)';g.fillRect(x,y,w,h);
 if(lf>f){g.fillStyle='rgba(255,236,200,.55)';g.fillRect(x+w*f,y,w*(lf-f),h);}
 const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,col);gr.addColorStop(.55,colD);gr.addColorStop(1,col);g.fillStyle=gr;g.fillRect(x,y,w*f,h);
 g.fillStyle='rgba(255,255,255,.22)';g.fillRect(x,y+1,w*f,h*.3);
 g.fillStyle='rgba(0,0,0,.35)';for(let i=1;i<10;i++)g.fillRect(Math.round(x+w*i/10),y,1,h);
 if(warn){g.globalAlpha=.25+.25*Math.sin(elapsed*7);g.strokeStyle='#ff6a50';g.lineWidth=2;g.strokeRect(x-1,y-1,w+2,h+2);g.globalAlpha=1;}
 g.strokeStyle=tqMetal(y-2,y+h+2);g.lineWidth=1;g.strokeRect(x-2.5,y-2.5,w+5,h+5);g.restore();
 text(Math.ceil(v)+' / '+Math.ceil(max),x+w/2,y+h/2+.5,11,TQ.paper,'center','bold');
}
function tqMouseGlyph(x,y,right){g.save();g.strokeStyle=TQ.paper;g.lineWidth=1;g.beginPath();g.roundRect?g.roundRect(x-3.5,y-5,7,10,3.5):g.rect(x-3.5,y-5,7,10);g.stroke();g.fillStyle=TQ.gold;g.fillRect(right?x:x-3,y-4.5,3,4);g.restore();}
function tqLock(x,y){g.save();g.strokeStyle=TQ.soft;g.lineWidth=1.6;g.beginPath();g.arc(x,y-3,4,Math.PI,0);g.stroke();g.fillStyle=TQ.soft;g.fillRect(x-6,y-2,12,9);g.fillStyle=TQ.ink2;g.fillRect(x-1,y+1,2,3);g.restore();}
function tqRoundBtn(x,y,kind,label,fn,on,id){ // nút nhỏ ở đầu cánh / hàng icon: đế tối tròn + viền đồng
 const over=v33Over(x-12,y-12,24,24);
 g.save();g.fillStyle=over?'rgba(70,52,30,.95)':'rgba(8,6,4,.78)';g.beginPath();g.arc(x,y,11,0,Math.PI*2);g.fill();g.strokeStyle=on?TQ.gold:over?TQ.bronze:'rgba(155,122,69,.55)';g.lineWidth=1.2;g.stroke();g.restore();
 v35Icon(kind,x,y,8.5,on||over?TQ.goldL:TQ.soft);
 buttons.push({x:x-12,y:y-12,w:24,h:24,fn,v35:id});
 return over;
}

function tqFit(t,x,y,maxW,size,col,align='left'){ // chữ có viền tối (đọc được trên nền sáng), tự cắt "…"
 t=String(t);g.save();g.font=size+'px V45Sans, "Segoe UI", Arial, sans-serif';if(g.measureText(t).width>maxW){while(t.length>1&&g.measureText(t+'…').width>maxW)t=t.slice(0,-1);t+='…';}g.restore();v45Text(t,x,y,size,col,align);
}
// ---------- TRÊN-TRÁI: danh tính + hàng icon
function hudTQIdentity(s){
 const col=V10_SCHOOLS[p.cls].color,cx=44,cy=42;
 g.save();const gr=g.createRadialGradient(cx,cy,12,cx+40,cy,220);gr.addColorStop(0,'rgba(8,6,4,.55)');gr.addColorStop(1,'rgba(8,6,4,0)');g.fillStyle=gr;g.fillRect(0,0,320,104);g.restore();
 g.save();g.beginPath();g.arc(cx,cy,29,0,Math.PI*2);g.fillStyle='#050302';g.fill();g.restore();
 v41HUDClassPortrait(p.cls,cx,cy,25,col);
 g.save();g.lineWidth=2.2;g.strokeStyle=tqMetal(cy-28,cy+28);g.beginPath();g.arc(cx,cy,27,0,Math.PI*2);g.stroke();g.lineWidth=1;g.strokeStyle='#050302';g.beginPath();g.arc(cx,cy,29.5,0,Math.PI*2);g.stroke();g.restore();
 g.save();g.translate(cx+19,cy+20);g.rotate(Math.PI/4);g.fillStyle='#0b0806';g.fillRect(-9,-9,18,18);g.strokeStyle=tqMetal(-9,9);g.lineWidth=1.4;g.strokeRect(-9,-9,18,18);g.restore();
 text(String(p.level),cx+19,cy+20.5,10,TQ.goldL,'center','bold');
 v45Name(p.v8Name||'Vô Danh',82,26,220);
 v45Text(realm(),82,46,11,TQ.soft,'left');
 if(v33Over(cx-28,cy-28,56,56)&&!v35Editing())tqTip(V10_SCHOOLS[p.cls].name+' · Chiến lực '+v41HUDNum(v10FightPower(s)),cx+40,cy+34);
 const cells=[['bag','I','Hành trang',()=>openPanel('gear'),false],['book','T','Công pháp',v11Open,v11SkillPoints()>0],['scroll','Q','Nhật ký',v12Open,false],
  ['map','M','Bản đồ',()=>openPanel('map'),false],[v41AudioEnabled()?'audio':'mute',null,'Âm thanh',v41AudioToggle,false],['hud','F2','Tùy chỉnh HUD',v35Open,false],['settings','Esc','Cài đặt',()=>openPanel('settings'),false]];
 let tip=null;
 cells.forEach(([kind,key,label,fn,hot],i)=>{const x=94+i*28,y=74;
  if(tqRoundBtn(x,y,kind==='map'?'scroll':kind,label,fn,false,'nav:'+kind))tip=[label+(key?' · '+key:''),x];
  if(hot)circle(x+8,y-8,3,TQ.jade);});
 if(tip&&!v35Editing())tqTip(tip[0],tip[1],92);
}
// ---------- TRÊN-PHẢI: bản đồ tròn + biển tên vùng
function hudTQMap(){
 const cx=1192,cy=78,r=60,R=REG[p.mapId]||REG.thon,d=V22_REG[R.id],st=v34State();
 g.save();g.beginPath();g.arc(cx,cy,r+6,0,Math.PI*2);g.fillStyle='#050302';g.fill();
 g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.fillStyle='rgba(14,11,8,.92)';g.fill();g.clip();
 if(typeof v47tIsActive==='function'&&v47tIsActive()){v471MapArt(cx-r*1.6,cy-r*.9,r*3.2,r*1.8);v471MapPoints(cx-r*1.6,cy-r*.9,r*3.2,r*1.8);}
 else if(st.local)v34Local(cx-r,cy-r*.65,r*2,r*1.3);else v33Mini(cx-r,cy-r*.65,r*2,r*1.3);
 const vg=g.createRadialGradient(cx,cy,r*.6,cx,cy,r);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.5)');g.fillStyle=vg;g.fillRect(cx-r,cy-r,r*2,r*2);
 g.restore();
 g.save();g.lineWidth=3;g.strokeStyle=tqMetal(cy-r,cy+r);g.beginPath();g.arc(cx,cy,r+2,0,Math.PI*2);g.stroke();
 g.lineWidth=1;g.strokeStyle='rgba(155,122,69,.6)';g.beginPath();g.arc(cx,cy,r-3,0,Math.PI*2);g.stroke();
 for(let i=0;i<4;i++){const a=i*Math.PI/2;g.save();g.translate(cx+Math.sin(a)*(r+2),cy-Math.cos(a)*(r+2));g.rotate(a);g.fillStyle=TQ.gold;g.beginPath();g.moveTo(0,-5);g.lineTo(3.5,1);g.lineTo(-3.5,1);g.closePath();g.fill();g.restore();}
 g.restore();
 circle(cx,cy-r-2,9,'#0b0806',TQ.gold);text('北',cx,cy-r-1.5,10,TQ.goldL,'center','bold');
 buttons.push({x:cx-r,y:cy-r,w:r*2,h:r*2,fn:()=>openPanel('map'),v35:'bigmap'});
 // biển tên vùng
 const [state,col]=v22Danger(d),pw=Math.min(164,Math.max(112,R.name.length*8+34)),px=cx-pw/2,py=cy+r+8;
 g.save();g.fillStyle='rgba(8,6,4,.86)';g.fillRect(px,py,pw,22);g.strokeStyle=TQ.goldD;g.lineWidth=1;g.strokeRect(px+.5,py+.5,pw-1,21);
 g.fillStyle=TQ.gold;g.fillRect(px+8,py,pw-16,1);g.restore();
 circle(px+11,py+11,3.2,d.i?col:TQ.jade);
 v33Fit(R.name,cx+5,py+11,pw-28,12,TQ.paper,'center','bold');
 if(v33Over(px,py,pw,22)&&!v35Editing())tqTip(d.i?state+' · cấp '+d.min+'–'+d.max:'Khu an toàn',cx,py+26);
}
// ---------- dưới biển tên: nhiệm vụ 1 dòng, bấm để dẫn đường
function hudTQQuest(){
 const t=v12Tracked();if(!t)return;
 const prog=v12Progress(t),x=1266,y=211;
 const over=v33Over(1004,y-11,266,22);
 g.save();g.font='11px V45Sans, "Segoe UI", Arial, sans-serif';const pw=g.measureText(prog).width;g.font='12px V45Sans, "Segoe UI", Arial, sans-serif';const gw=Math.min(210,g.measureText(t.goal).width);g.restore();
 v45Text(prog,x,y,11,TQ.soft,'right');
 tqFit(t.goal,x-pw-8,y,210,12,over?TQ.goldL:TQ.paper,'right');
 g.save();g.translate(x-pw-8-gw-10,y);g.rotate(Math.PI/4);g.fillStyle=TQ.gold;g.fillRect(-3,-3,6,6);g.restore();
 buttons.push({x:1004,y:y-11,w:266,h:22,fn:()=>v12Guide(t),v35:'questGuide'});
 if(over&&!v35Editing())tqTip('Thiên mệnh · bấm để dẫn đường',1140,y+14);
}
// ---------- ĐÁY: khối chính
function hudTQBar(s){
 const ranks=v11Levels(),cds=v11Cooldowns(),skills=V11_SKILLS[p.cls];
 const actions=[
  {key:'L',name:'Đánh thường',icon:0,cd:p.atkCd||0,base:Math.max(.27,.39/s.rate),fn:()=>v33Aim(attack)},
  ...skills.slice(0,4).map((d,i)=>({key:i===0?'R':d.key,name:d.name,d,rank:ranks[i],cd:cds[i],base:d.cd,fn:()=>v33Aim(()=>v11Cast(i))})),
  {key:'SPC',name:'Khinh công · Space',icon:2,cd:p.dashCd||0,base:s.dashCd,fn:()=>pressed.Space=true},
  {key:'H',name:'Hồi Xuân Đan',icon:3,count:p.pills,fn:heal}];
 tqFrame();
 // máu (trái) / linh lực (phải) — vệt trễ
 const now=performance.now(),dt=clamp((now-(TQS.t||now))/1000,0,.1);TQS.t=now;
 if(TQS.hp==null||TQS.hp<p.hp)TQS.hp=p.hp;else TQS.hp=Math.max(p.hp,TQS.hp-(s.hp*.6)*dt);
 if(TQS.mp==null||TQS.mp<p.mp)TQS.mp=p.mp;else TQS.mp=Math.max(p.mp,TQS.mp-(s.mp*.6)*dt);
 const by=TQ.wing+19,bh=18;
 tqTube(TQ.l+42,by,TQ.cl-34-(TQ.l+42),bh,p.hp,s.hp,TQS.hp,TQ.red,TQ.redD,p.hp/s.hp<.3);
 tqTube(TQ.cr+34,by,TQ.r-42-(TQ.cr+34),bh,p.mp,s.mp,TQS.mp,TQ.blue,TQ.blueD,false);
 if(v33Over(TQ.l+40,by-4,TQ.cl-TQ.l-70,bh+8)&&!v35Editing())tqTip('Sinh mệnh · Hồi Xuân Đan ×'+(p.pills||0)+' (H)',(TQ.l+TQ.cl)/2,TQ.top-34);
 if(v33Over(TQ.cr+32,by-4,TQ.r-TQ.cr-70,bh+8)&&!v35Editing())tqTip('Linh lực · Linh thạch '+(p.stones||0),(TQ.cr+TQ.r)/2,TQ.top-34);
 // 7 ô vuông
 const S=TQ.slot,G=TQ.gap,sw=7*S+6*G,sx=TQ.cx-sw/2,sy=TQ.top+9;let tip=null;
 actions.forEach((a,i)=>{
  const bx=sx+i*(S+G),cx=bx+S/2,cy=sy+S/2,col=a.d?.color||TQ.gold;
  const locked=!!(a.d&&!a.rank),low=!!(a.d&&p.mp<a.d.cost),empty=a.count===0,cd=Math.max(0,a.cd||0),over=v33Over(bx,sy,S,S);
  const dim=locked||empty||cd>0;
  g.save();g.fillStyle='#050302';g.fillRect(bx-2,sy-2,S+4,S+4);
  const sg=g.createLinearGradient(0,sy,0,sy+S);sg.addColorStop(0,'#211710');sg.addColorStop(1,'#0c0805');g.fillStyle=sg;g.fillRect(bx,sy,S,S);
  g.globalAlpha*=locked?.25:dim?.45:1;if(a.d)v11SkillIcon(a.d.kind,cx,cy,16,col);else uiIcon(a.icon,cx-17,cy-17,34,dim);g.globalAlpha=1;
  if(low&&!locked){g.fillStyle='rgba(30,70,140,.45)';g.fillRect(bx,sy,S,S);}
  if(cd>0){const fr=clamp(cd/Math.max(.01,a.base||cd),0,1);g.save();g.beginPath();g.rect(bx,sy,S,S);g.clip();g.fillStyle='rgba(4,3,2,.72)';g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,S,-Math.PI/2,-Math.PI/2+Math.PI*2*fr);g.closePath();g.fill();g.restore();}
  g.strokeStyle=over?TQ.goldL:locked?'rgba(110,85,48,.7)':tqMetal(sy,sy+S);g.lineWidth=over?2:1.4;g.strokeRect(bx+.5,sy+.5,S-1,S-1);
  if(a.d&&!locked&&!dim&&!low){g.globalAlpha=.35;g.strokeStyle=col;g.lineWidth=1;g.strokeRect(bx+3.5,sy+3.5,S-7,S-7);g.globalAlpha=1;}
  g.restore();
  if(cd>0)text(cd>=1?Math.ceil(cd):cd.toFixed(1),cx,cy,15,TQ.paper,'center','bold');
  else if(locked)tqLock(cx,cy);
  // phím nhỏ góc dưới phải
  if(a.key==='L'||a.key==='R')tqMouseGlyph(bx+S-7,sy+S-8,a.key==='R');else text(a.key,bx+S-4,sy+S-7,9,dim?TQ.soft:TQ.goldL,'right','bold');
  if(a.count!=null)text(String(a.count),bx+4,sy+8,10,TQ.paper,'left','bold');
  if(a.d&&a.rank)text(String(a.rank),bx+4,sy+8,9,TQ.jade,'left','bold');
  buttons.push({x:bx,y:sy,w:S,h:S,fn:()=>{if(locked)v11Open();else if(!empty&&!low&&!cd)a.fn();},v35:'skill'+i});
  if(over)tip=[a,cx];
 });
 if(tip&&!v35Editing()){const a=tip[0];tqTip(locked0(a)?a.name+' · chưa lĩnh ngộ (T)':a.name+(a.d?' · '+a.d.cost+' MP · hồi '+a.d.cd+'s':''),tip[1],TQ.top-34);}
 function locked0(a){return !!(a.d&&!a.rank);}
 // tu vi: chỉ vàng dưới hàng ô
 const need=Math.max(1,xpNeed()),f=clamp((p.xp||0)/need,0,1),xx=sx,xw=sw,xy=sy+S+6;
 g.save();g.fillStyle='#050302';g.fillRect(xx-1,xy-1,xw+2,5);g.fillStyle='rgba(255,255,255,.05)';g.fillRect(xx,xy,xw,3);
 const xg=g.createLinearGradient(xx,0,xx+xw,0);xg.addColorStop(0,TQ.goldD);xg.addColorStop(1,TQ.goldL);g.fillStyle=xg;g.fillRect(xx,xy,xw*f,3);g.restore();
 if(v33Over(xx,xy-4,xw,10)&&!v35Editing())tqTip('Tu vi '+Math.floor(p.xp||0)+' / '+need+' ('+Math.floor(f*100)+'%)',TQ.cx,TQ.top-34);
 if(V26.action||V26.stage||V26.hits){const a=V26.action;v44Label(V26.hits?V26.hits+' liên kích':a?.kind==='skill'?a.d.name:'Liên chiêu',640,TQ.top-100,14,V25_COLOR[p.cls],'center','bold');}
}
// ---------- đầu cánh trái: tự đánh / tự nhặt (thôn: thanh kỹ năng)
function hudTQLeft(){
 const hub=v45Hub()&&!v35Editing(),x=TQ.l+17;let tip=null;
 const items=hub?[['menu','Menu',()=>{V33.menu=!V33.menu;},V33.menu]]:[['auto','Tự đánh · F',()=>{auto=!auto;save();},auto],['loot','Tự nhặt · X',v21Toggle,v21State().auto]];
 items.forEach(([kind,label,fn,on],i)=>{const y=TQ.wing+18+i*26;if(tqRoundBtn(x,y,kind,label,fn,on,'left:'+kind))tip=[label,x];});
 if(tip&&!v35Editing())tqTip(tip[0],tip[1]+60,TQ.top-34);
}
// ---------- đầu cánh phải: nhặt gần / menu
function hudTQNav(){
 const hub=v45Hub()&&!v35Editing(),x=TQ.r-17;let tip=null;
 const items=hub?[]:[['bag','Nhặt gần · Z',v21PickNear,false],['menu','Menu',()=>{V33.menu=!V33.menu;},V33.menu]];
 items.forEach(([kind,label,fn,on],i)=>{const y=TQ.wing+18+i*26;if(tqRoundBtn(x,y,kind,label,fn,on,'left:'+kind))tip=[label,x];});
 if(tip&&!v35Editing())tqTip(tip[0],tip[1]-60,TQ.top-34);
}
// ---------- thông báo: tối đa 2 dòng, tắt sau 5s, trên cánh trái
function hudTQFeed(){
 if(V33.menu)return;
 const a=V34.events.filter(e=>elapsed-e.at<5&&e.text!=='Thanh Thạch Thôn · Tự do khám phá').slice(-2);
 a.forEach((e,i)=>{const y=TQ.wing-24-(a.length-1-i)*18,txt=e.text+(e.n>1?' ×'+e.n:'');
  g.save();g.globalAlpha*=clamp((5-(elapsed-e.at))/.5,0,1)*(i===a.length-1?1:.7);tqFit(txt,TQ.l+4,y,420,12,e.col||TQ.paper,'left');g.restore();});
}
// ---------- nút E nổi trên khối giữa
function tqPrompt(label,fn){
 const tw=clamp(label.length*7.6+52,130,360),x=640-tw/2,y=TQ.top-42,over=v33Over(x,y,tw,26);
 g.save();g.fillStyle=over?'rgba(48,34,20,.94)':'rgba(8,6,4,.84)';g.fillRect(x,y,tw,26);g.strokeStyle=TQ.goldD;g.lineWidth=1;g.strokeRect(x+.5,y+.5,tw-1,25);
 g.fillStyle='#0b0806';g.fillRect(x+6,y+5,16,16);g.strokeStyle=TQ.gold;g.strokeRect(x+6.5,y+5.5,15,15);g.restore();
 text('E',x+14,y+13.5,10,TQ.goldL,'center','bold');v33Fit(label,x+30,y+13,tw-38,12,TQ.paper,'left');
 buttons.push({x,y,w:tw,h:26,fn,v35:'interact'});
}
function hudTQPrompt(){const o=owNearest();if(!o||modal)return;tqPrompt((o.door?'Vào ':'')+o.name,()=>v8InteractAt(o));}
function hudTQTownPrompt(){
 if(modal)return;const n=v471Near(),gt=V47T_MAP.gates[0],near=gt&&dist(gt,V47T)<gt.r+40;if(!n&&!near)return;
 tqPrompt(near?'Cổng · Thanh Trúc Lâm':n.name,v47tInteract);
}
// ---------- tên thôn giữa đỉnh: chỉ hiện 3,5s mỗi lần vào thôn (bản cũ hiện cố định)
function hudTQHubTitleAlpha(){
 if(elapsed-TQS.hubSeen>.5)TQS.hubSince=elapsed;TQS.hubSeen=elapsed;
 const t=elapsed-TQS.hubSince;return clamp(t/.3,0,1)*clamp((3.5-t)/.5,0,1);
}
// ---------- vùng HUD đang chiếm (để nhãn thế giới tự mờ khi nằm dưới HUD)
function hudTQZoneHit(x,y,w,h){
 const Z=[[0,0,312,100],[1100,0,180,232],[TQ.l,TQ.top,TQ.r-TQ.l,TQ.bot-TQ.top]];
 return Z.some(([a,b,c,d])=>x<a+c&&x+w>a&&y<b+d&&y+h>b);
}
// ================= CON TRỎ kiểu Titan Quest =================
// v8Cursor (src/05) chỉ còn tính hover rồi gọi hudTQCursorState; hình vẽ ở FRAME_HOOKS.overlay nên luôn nằm trên mọi lớp (kể cả overlay).
//  mũi tên đồng (mặc định / giao diện / mặt đất) · kiếm (quái) · cuộn thư thoại (NPC) · cửa (nhà/cổng) · túi (vật phẩm rơi).
const TQC={kind:'arrow',x:0,y:0,t:null,at:0,down:0};
function hudTQCursorState(x,y,btn,t){
 let kind='arrow';
 if(t?.type==='enemy')kind='sword';
 else if(t?.type==='poi')kind=V8_INFO[t.id]?'talk':'door';
 else if(!btn&&!modal&&mode==='play'&&p?.worldMode&&typeof hdPoint==='function'&&drops.some(d=>{const q=hdPoint(d.x,d.y);return Math.abs(q.x-x)<22&&Math.abs(q.y-y)<22;}))kind='loot';
 Object.assign(TQC,{kind,x,y,t,at:performance.now()});
}
function tqCurArrow(){
 const P=[[0,0],[0,23],[6,17.5],[10.5,26],[14.5,24],[10.2,15.8],[18,15.4]];
 g.beginPath();P.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();
 const gr=g.createLinearGradient(0,0,14,24);gr.addColorStop(0,'#fff1c4');gr.addColorStop(.4,TQ.gold);gr.addColorStop(1,'#5d4524');
 g.fillStyle=gr;g.fill();g.lineJoin='round';g.lineWidth=2;g.strokeStyle='#120c06';g.stroke();
 g.beginPath();g.moveTo(2,4);g.lineTo(2,18);g.strokeStyle='rgba(255,246,214,.75)';g.lineWidth=1;g.stroke();
 g.save();g.translate(4.6,15.2);g.rotate(Math.PI/4);g.fillStyle='#2f8a6d';g.fillRect(-2,-2,4,4);g.restore();
}
function tqCurSword(){
 g.save();g.rotate(-Math.PI/4); // lưỡi kiếm hướng lên-trái, mũi kiếm = điểm nhấp
 g.beginPath();g.moveTo(0,0);g.lineTo(3.2,5);g.lineTo(3.2,22);g.lineTo(-3.2,22);g.lineTo(-3.2,5);g.closePath();
 const bl=g.createLinearGradient(-3,0,3,0);bl.addColorStop(0,'#8e98a0');bl.addColorStop(.5,'#f4f7f8');bl.addColorStop(1,'#6a737b');
 g.fillStyle=bl;g.fill();g.lineWidth=1.6;g.strokeStyle='#0d0b0a';g.stroke();
 g.beginPath();g.moveTo(0,3);g.lineTo(0,21);g.strokeStyle='rgba(60,70,80,.6)';g.lineWidth=.8;g.stroke();
 g.fillStyle=tqMetal(21,26);g.beginPath();g.moveTo(-8,22);g.lineTo(8,22);g.lineTo(6,26);g.lineTo(-6,26);g.closePath();g.fill();g.strokeStyle='#0d0b0a';g.lineWidth=1.3;g.stroke();
 g.fillStyle='#3a2414';g.fillRect(-2,26,4,8);g.strokeRect(-2,26,4,8);
 circle(0,35.5,2.4,TQ.gold,'');g.strokeStyle='#b8392e';g.lineWidth=1.6;g.beginPath();g.moveTo(0,37);g.quadraticCurveTo(3,41,1,45);g.stroke();
 g.restore();
}
function tqCurTalk(){
 g.beginPath();g.moveTo(0,0);g.lineTo(7,8);g.lineTo(24,8);g.quadraticCurveTo(28,8,28,12);g.lineTo(28,22);g.quadraticCurveTo(28,26,24,26);g.lineTo(9,26);g.quadraticCurveTo(5,26,5,22);g.lineTo(5,10);g.closePath();
 const gr=g.createLinearGradient(0,8,0,26);gr.addColorStop(0,'#fbf1d6');gr.addColorStop(1,'#d9c49a');g.fillStyle=gr;g.fill();g.lineWidth=2;g.strokeStyle='#120c06';g.lineJoin='round';g.stroke();
 g.lineWidth=1;g.strokeStyle=TQ.goldD;g.strokeRect(7.5,10.5,18,13);
 for(let i=0;i<3;i++)circle(11.5+i*5,17,1.5,'#3a2a18','');
}
function tqCurDoor(){
 tqCurArrow();g.save();g.translate(15,17);
 g.beginPath();g.moveTo(0,12);g.lineTo(0,3);g.quadraticCurveTo(0,-2,6,-2);g.quadraticCurveTo(12,-2,12,3);g.lineTo(12,12);g.closePath();
 g.fillStyle='#2a1a10';g.fill();g.lineWidth=1.6;g.strokeStyle=TQ.gold;g.stroke();g.fillStyle='#b8392e';g.fillRect(2.5,3,7,9);circle(8,8,1,TQ.goldL,'');g.restore();
}
function tqCurLoot(){
 tqCurArrow();g.save();g.translate(17,18);
 g.beginPath();g.moveTo(-5,0);g.quadraticCurveTo(-8,10,0,11);g.quadraticCurveTo(8,10,5,0);g.closePath();
 g.fillStyle='#8a4b2a';g.fill();g.lineWidth=1.4;g.strokeStyle='#120c06';g.stroke();
 g.fillStyle=TQ.gold;g.fillRect(-5,-1.5,10,2.5);circle(0,-3.5,2,TQ.goldL,'');
 g.globalAlpha=.6+.4*Math.sin(performance.now()/180);g.fillStyle='#fff3c0';g.save();g.translate(7,-6);g.rotate(Math.PI/4);g.fillRect(-1.5,-1.5,3,3);g.restore();
 g.restore();
}
function hudTQCursor(){
 if(!mouse.inside||performance.now()-TQC.at>150)return;
 const {x,y,kind}=TQC,press=mouse.left||mouse.fire;
 g.save();g.translate(x,y);if(press)g.scale(.9,.9);
 g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=4;g.shadowOffsetX=1.5;g.shadowOffsetY=2;
 if(kind==='sword'){g.save();g.shadowColor='rgba(230,70,50,.75)';g.shadowBlur=8;tqCurSword();g.restore();}
 else if(kind==='talk')tqCurTalk();else if(kind==='door')tqCurDoor();else if(kind==='loot')tqCurLoot();else tqCurArrow();
 g.restore();
 // khung tên khi trỏ vào NPC/nhà
 const t=TQC.t;if(t?.type==='poi'){const d=V8_INFO[t.id],R=typeof V36_BY_ID!=='undefined'?V36_BY_ID[t.id]:null;
  const l1=d?d.name+' · '+d.role:(R?.name||t.o?.name||''),l2=d?'Nhấp để tới gần · '+(t.o.task||'Đối thoại'):'Nhấp để đi vào';if(!l1)return;
  g.save();g.font='bold 12px V45Sans, "Segoe UI", Arial, sans-serif';const w=Math.max(g.measureText(l1).width,g.measureText(l2).width*.92)+24;g.restore();
  const sx=clamp(x+22,8,W-w-8),sy=clamp(y+24,8,H-52);
  g.save();g.fillStyle='rgba(10,7,5,.94)';g.fillRect(sx,sy,w,42);g.strokeStyle=TQ.goldD;g.lineWidth=1;g.strokeRect(sx+.5,sy+.5,w-1,41);g.fillStyle=TQ.gold;g.fillRect(sx+6,sy,w-12,1);g.restore();
  text(l1,sx+12,sy+14,12,d?.trim||TQ.goldL,'left','bold');text(l2,sx+12,sy+30,11,TQ.soft,'left');}
}
if(HUD_TQ&&typeof FRAME_HOOKS!=='undefined')FRAME_HOOKS.overlay.push(hudTQCursor);
