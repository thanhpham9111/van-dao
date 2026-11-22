'use strict';
// HUD kiểu Titan Quest (chủ dự án chọn 22/11/2026) chuyển sang chất liệu tu tiên:
//  • ĐÁY GIỮA: một thanh sơn mài viền chỉ vàng — máu (trái) · 7 ô kỹ năng (giữa) · linh lực (phải), tu vi là đường mảnh dưới đáy thanh.
//  • TRÊN-TRÁI: chân dung nhỏ + cấp + tên/cảnh giới + hàng icon chức năng nhỏ (không hộp).
//  • TRÊN-PHẢI: bản đồ tròn + tên vùng; nhiệm vụ là chữ không nền ngay dưới.
//  • Thông báo: chữ không nền phía trên-trái thanh đáy. Nút E nổi giữa trên thanh.
// Giữ nguyên tên nhóm v35Group (identity/map/quest/dock/left/nav/feed) nên trình chỉnh HUD F2 vẫn kéo/thu phóng được.
const HUD_TQ=true;
// Khung nhóm cho F2 (kéo/thu phóng) khớp bố cục mới — chỉ đổi số, giữ nhãn.
if(HUD_TQ&&typeof V35_GROUPS!=='undefined')Object.entries({identity:[12,10,292,110],map:[1124,8,146,176],quest:[1064,186,206,82],dock:[252,630,776,86],left:[126,680,128,34],feed:[256,566,440,58]}).forEach(([k,[x,y,w,h]])=>Object.assign(V35_GROUPS[k],{x,y,w,h}));
const TQ={x:256,y:640,w:768,h:72,ink:'#14100c',ink2:'#0b0806',gold:'#c9a86a',goldD:'#7d6538',paper:'#efe6d4',soft:'#b3a68e',red:'#b8392e',redD:'#5a1712',blue:'#3f74ad',blueD:'#16304d'};

function tqPanel(x,y,w,h,r=10){ // khối sơn mài: nền mực ấm + chỉ vàng trên + gờ tối dưới
 g.save();const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'rgba(34,24,16,.94)');gr.addColorStop(1,'rgba(12,9,6,.96)');
 g.fillStyle=gr;g.beginPath();g.roundRect?g.roundRect(x,y,w,h,r):g.rect(x,y,w,h);g.fill();
 g.strokeStyle=TQ.goldD;g.lineWidth=1;g.stroke();
 g.fillStyle=TQ.gold;g.fillRect(x+r,y,w-2*r,1.2);g.restore();
}
function tqCurl(x,y,dir){ // hoạ tiết mây cuộn ở hai đầu thanh
 g.save();g.strokeStyle=TQ.gold;g.lineWidth=1.6;g.beginPath();
 g.arc(x,y,9,dir>0?Math.PI*.5:-Math.PI*.5,dir>0?Math.PI*2.1:Math.PI*1.1,dir<0);g.stroke();
 g.beginPath();g.arc(x+dir*6,y+2,4,0,Math.PI*2);g.stroke();g.restore();
}
function tqBar(x,y,w,h,v,max,col,colD,label){
 g.save();g.fillStyle='rgba(0,0,0,.55)';g.fillRect(x,y,w,h);
 const f=clamp(v/Math.max(1,max),0,1),gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,col);gr.addColorStop(1,colD);
 g.fillStyle=gr;g.fillRect(x,y,w*f,h);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(x,y,w*f,h*.35);
 g.strokeStyle=TQ.goldD;g.lineWidth=1;g.strokeRect(x+.5,y+.5,w-1,h-1);g.restore();
 text(Math.ceil(v)+' / '+Math.ceil(max),x+w/2,y+h/2+.5,12,TQ.paper,'center','bold');
 if(label)text(label,x+4,y-7,10,TQ.soft,'left');
}
function tqTip(label,x,y){const tw=clamp(label.length*7+20,90,280),tx=clamp(x-tw/2,8,W-tw-8);g.save();g.fillStyle='rgba(12,9,6,.92)';g.fillRect(tx,y,tw,24);g.fillStyle=TQ.gold;g.fillRect(tx,y,tw,1);g.restore();v33Fit(label,tx+tw/2,y+12,tw-10,11,TQ.paper,'center');}

// ---------- TRÊN-TRÁI: danh tính + hàng icon
function hudTQIdentity(s){
 const col=V10_SCHOOLS[p.cls].color;
 g.save();const gr=g.createRadialGradient(60,46,10,90,46,230);gr.addColorStop(0,'rgba(12,9,6,.62)');gr.addColorStop(1,'rgba(12,9,6,0)');g.fillStyle=gr;g.fillRect(0,0,340,110);g.restore();
 v41HUDClassPortrait(p.cls,44,42,26,col);circle(44,42,28,'',TQ.gold);
 circle(64,62,10,TQ.ink2,TQ.gold);text(String(p.level),64,62,10,'#fff0c9','center','bold');
 v45Name(p.v8Name||'Vô Danh',82,26,220);
 v45Text(realm()+' · CL '+v41HUDNum(v10FightPower(s)),82,48,12,TQ.soft,'left');
 const cells=[['bag','I','Hành trang',()=>openPanel('gear'),false],['book','T','Công pháp',v11Open,v11SkillPoints()>0],['scroll','Q','Nhật ký',v12Open,false],
  ['map','M','Bản đồ',()=>openPanel('map'),false],[v41AudioEnabled()?'audio':'mute',null,'Âm thanh',v41AudioToggle,false],['hud','F2','Tùy chỉnh HUD',v35Open,false],['settings','Esc','Cài đặt',()=>openPanel('settings'),false]];
 cells.forEach(([kind,key,label,fn,hot],i)=>{const x=82+i*30,y=60,over=v33Over(x,y,26,26);
  if(over){g.save();g.fillStyle='rgba(201,168,106,.18)';g.fillRect(x,y,26,26);g.restore();}
  v35Icon(kind==='map'?'scroll':kind,x+13,y+13,10,over?TQ.gold:hot?'#e8d08a':TQ.soft);
  if(hot)circle(x+22,y+4,2.6,'#8fd18a');
  buttons.push({x,y,w:26,h:26,fn,v35:'nav:'+kind});
  if(over&&!v35Editing())tqTip(label+(key?' · '+key:''),x+13,y+30);
 });
}
// ---------- TRÊN-PHẢI: bản đồ tròn + vùng
function hudTQMap(){
 const cx=1192,cy=82,r=62,R=REG[p.mapId]||REG.thon,d=V22_REG[R.id],st=v34State();
 g.save();g.beginPath();g.arc(cx,cy,r,0,Math.PI*2);g.fillStyle='rgba(12,9,6,.85)';g.fill();g.clip();
 if(typeof v47tIsActive==='function'&&v47tIsActive()){v471MapArt(cx-r*1.6,cy-r*.9,r*3.2,r*1.8);v471MapPoints(cx-r*1.6,cy-r*.9,r*3.2,r*1.8);}
 else if(st.local)v34Local(cx-r,cy-r*.65,r*2,r*1.3);else v33Mini(cx-r,cy-r*.65,r*2,r*1.3);
 g.restore();
 circle(cx,cy,r,'',TQ.gold);circle(cx,cy,r+4,'',TQ.goldD);
 text('北',cx,cy-r-9,10,TQ.gold,'center','bold');
 buttons.push({x:cx-r,y:cy-r,w:r*2,h:r*2,fn:()=>openPanel('map'),v35:'bigmap'});
 const [state,col]=v22Danger(d);
 v45Text(R.name,cx,cy+r+18,14,TQ.paper,'center');
 v45Text(d.i?state+' · cấp '+d.min+'–'+d.max:'Khu an toàn',cx,cy+r+34,11,d.i?col:'#8fd18a','center');
}
// ---------- dưới bản đồ: nhiệm vụ (chữ không nền)
function hudTQQuest(){
 const t=v12Tracked(),x=1252,y=196;if(!t)return;
 v45Text('◆ Thiên mệnh',x,y,12,TQ.gold,'right');
 const lines=v45WrapLines(t.goal,230,14,2);lines.forEach((ln,i)=>v45Text(ln,x,y+18+i*17,14,TQ.paper,'right'));
 const yy=y+20+lines.length*17,prog=v12Progress(t);v45Text(prog,x,yy,11,TQ.soft,'right');
 const bw=86,bx=x-bw,by=yy+8,over=v33Over(bx,by,bw,20);
 g.save();g.fillStyle=over?'rgba(201,168,106,.28)':'rgba(12,9,6,.6)';g.fillRect(bx,by,bw,20);g.fillStyle=TQ.gold;g.fillRect(bx,by+19,bw,1);g.restore();
 text('Dẫn đường',bx+bw/2,by+10,11,over?TQ.gold:TQ.paper,'center');
 buttons.push({x:bx,y:by,w:bw,h:20,fn:()=>v12Guide(t),v35:'questGuide'});
}
// ---------- ĐÁY: thanh chính
function hudTQBar(s){
 const {x,y,w,h}=TQ,side=48,gap=8,n=7,sw=n*side+(n-1)*gap,sx=x+(w-sw)/2,sy=y+12;
 const ranks=v11Levels(),cds=v11Cooldowns(),skills=V11_SKILLS[p.cls];
 const actions=[
  {key:'Chuột trái',name:'Đánh thường',icon:0,cd:p.atkCd||0,base:Math.max(.27,.39/s.rate),fn:()=>v33Aim(attack)},
  ...skills.slice(0,4).map((d,i)=>({key:i===0?'Chuột phải':d.key,name:d.name,d,rank:ranks[i],cd:cds[i],base:d.cd,fn:()=>v33Aim(()=>v11Cast(i))})),
  {key:'Space',name:'Khinh công',icon:2,cd:p.dashCd||0,base:s.dashCd,fn:()=>pressed.Space=true},
  {key:'H',name:'Hồi Xuân Đan',icon:3,count:p.pills,fn:heal}];
 tqPanel(x,y,w,h,12);tqCurl(x+14,y+h/2,1);tqCurl(x+w-14,y+h/2,-1);
 // máu (trái) / linh lực (phải)
 tqBar(x+30,y+22,sx-x-46,20,p.hp,s.hp,TQ.red,TQ.redD,'Sinh mệnh');
 const mx=sx+sw+16;tqBar(mx,y+22,x+w-30-mx,20,p.mp,s.mp,TQ.blue,TQ.blueD,'Linh lực');
 // tài nguyên nhỏ dưới hai thanh
 text('◆ '+(p.stones||0)+' linh thạch',x+30,y+56,10,TQ.soft,'left');
 text('✚ '+(p.pills||0)+' đan',x+w-30,y+56,10,TQ.soft,'right');
 // tu vi: đường mảnh đáy thanh
 const need=Math.max(1,xpNeed()),f=clamp((p.xp||0)/need,0,1);
 g.save();g.fillStyle='rgba(0,0,0,.6)';g.fillRect(x+12,y+h-5,w-24,3);g.fillStyle='#d8b56a';g.fillRect(x+12,y+h-5,(w-24)*f,3);g.restore();
 if(v33Over(x+12,y+h-10,w-24,12))tqTip('Tu vi '+Math.floor(p.xp||0)+' / '+need,x+w/2,y-30);
 // 7 ô kỹ năng
 let tip=null;
 actions.forEach((a,i)=>{
  const bx=sx+i*(side+gap),cx=bx+side/2,cy=sy+side/2-4,col=a.d?.color||TQ.gold;
  const locked=!!(a.d&&!a.rank),low=!!(a.d&&p.mp<a.d.cost),empty=a.count===0,cd=Math.max(0,a.cd||0),over=v33Over(bx,sy-6,side,side+8);
  const dim=locked||low||empty||cd>0;
  circle(cx,cy,22,TQ.ink2,over?'#f6d699':locked?TQ.goldD:col);
  g.save();g.globalAlpha*=dim?.4:1;if(a.d)v11SkillIcon(a.d.kind,cx,cy,15,col);else uiIcon(a.icon,cx-15,cy-15,30,dim);g.restore();
  if(cd>0){const fr=clamp(cd/Math.max(.01,a.base||cd),0,1);g.save();g.fillStyle='rgba(6,4,2,.7)';g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,22,-Math.PI/2,-Math.PI/2+Math.PI*2*fr);g.closePath();g.fill();g.restore();
   text(cd>=1?Math.ceil(cd):cd.toFixed(1),cx,cy,14,TQ.paper,'center','bold');}
  else if(locked)text('Khóa',cx,cy,10,TQ.soft,'center','bold');
  else if(low)text('MP',cx,cy,10,'#e08a7a','center','bold');
  if(a.count!=null)text('×'+a.count,cx+20,cy-17,10,TQ.paper,'right','bold');
  if(a.d&&a.rank)text(String(a.rank),cx+20,cy-17,10,'#8fd18a','right','bold');
  v33Fit(a.key,cx,sy+side+2,side+6,9,dim?TQ.soft:TQ.paper,'center');
  buttons.push({x:bx,y:sy-6,w:side,h:side+8,fn:()=>{if(locked)v11Open();else if(!empty&&!low&&!cd)a.fn();},v35:'skill'+i});
  if(over)tip=a;
 });
 if(tip&&!v35Editing())tqTip(tip.name+(tip.d?' · '+tip.d.cost+' MP · hồi '+tip.d.cd+'s':''),sx+sw/2,y-30);
 if(V26.action||V26.stage||V26.hits){const a=V26.action;v44Label(V26.hits?V26.hits+' liên kích':a?.kind==='skill'?a.d.name:'Liên chiêu',640,y-46,14,V25_COLOR[p.cls],'center','bold');}
}
// ---------- hai đầu thanh: menu + bật/tắt tự đánh/tự nhặt + nhặt gần
function hudTQLeft(){
 const hub=v45Hub()&&!v35Editing(),y=TQ.y+TQ.h-28;
 const items=[['menu','Menu',()=>{V33.menu=!V33.menu;},V33.menu]];
 if(hub)items.push(['sword','Thanh kỹ năng',()=>{V45_HUB.combat=!V45_HUB.combat;},V45_HUB.combat]);
 else items.push(['auto','Tự đánh · F',()=>{auto=!auto;save();},auto],['loot','Tự nhặt · X',v21Toggle,v21State().auto],['bag','Nhặt gần · Z',v21PickNear,false]);
 items.forEach(([kind,label,fn,on],i)=>{const x=TQ.x-34-i*30,over=v33Over(x,y,26,26);
  g.save();g.fillStyle=over?'rgba(201,168,106,.25)':'rgba(12,9,6,.72)';g.beginPath();g.arc(x+13,y+13,13,0,Math.PI*2);g.fill();g.strokeStyle=on?TQ.gold:TQ.goldD;g.lineWidth=1;g.stroke();g.restore();
  v35Icon(kind,x+13,y+13,9,on||over?TQ.gold:TQ.soft);buttons.push({x,y,w:26,h:26,fn,v35:'left:'+kind});
  if(over&&!v35Editing())tqTip(label,x+13,y-30);});
}
// ---------- thông báo: chữ không nền, trên-trái thanh đáy
function hudTQFeed(){
 if(V33.menu)return;
 const a=V34.events.filter(e=>elapsed-e.at<7&&e.text!=='Thanh Thạch Thôn · Tự do khám phá').slice(-3);
 a.forEach((e,i)=>{const y=TQ.y-24-(a.length-1-i)*19,txt=e.text+(e.n>1?' ×'+e.n:'');
  g.save();g.globalAlpha*=clamp((7-(elapsed-e.at))/.4,0,1)*(i===a.length-1?1:.72);v45Text(txt,TQ.x+4,y,12,e.col||TQ.paper,'left');g.restore();});
}
// ---------- nút E nổi (thôn): thay thanh 3 nút cũ
function hudTQPrompt(){
 const o=owNearest();if(!o||modal)return;
 const label=(o.door?'Vào ':'')+o.name,tw=clamp(label.length*8+60,140,360),x=640-tw/2,y=TQ.y-58,over=v33Over(x,y,tw,28);
 g.save();g.fillStyle=over?'rgba(40,28,18,.92)':'rgba(12,9,6,.82)';g.fillRect(x,y,tw,28);g.fillStyle=TQ.gold;g.fillRect(x,y,tw,1);g.restore();
 g.save();g.strokeStyle=TQ.gold;g.lineWidth=1;g.strokeRect(x+8.5,y+6.5,18,15);g.restore();
 text('E',x+17.5,y+14,11,TQ.gold,'center','bold');v33Fit(label,x+34,y+14,tw-42,13,TQ.paper,'left');
 buttons.push({x,y,w:tw,h:28,fn:()=>v8InteractAt(o),v35:'interact'});
}
// ---------- nút E nổi trong thôn V47T (thay v471Dock)
function hudTQTownPrompt(){
 if(modal)return;const n=v471Near(),gt=V47T_MAP.gates[0],near=gt&&dist(gt,V47T)<gt.r+40;if(!n&&!near)return;
 const label=near?'Cổng · Thanh Trúc Lâm':n.name,tw=clamp(label.length*8+60,140,360),x=640-tw/2,y=TQ.y-58,over=v33Over(x,y,tw,28);
 g.save();g.fillStyle=over?'rgba(40,28,18,.92)':'rgba(12,9,6,.82)';g.fillRect(x,y,tw,28);g.fillStyle=TQ.gold;g.fillRect(x,y,tw,1);g.strokeStyle=TQ.gold;g.lineWidth=1;g.strokeRect(x+8.5,y+6.5,18,15);g.restore();
 text('E',x+17.5,y+14,11,TQ.gold,'center','bold');v33Fit(label,x+34,y+14,tw-42,13,TQ.paper,'left');
 buttons.push({x,y,w:tw,h:28,fn:v47tInteract,v35:'interact'});
}
