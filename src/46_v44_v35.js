'use strict';
// V44 · Mặc Ngọc — restrained, context-aware UI. Existing actions and gameplay remain authoritative.
const V44UI={ivory:'#f4eee2',muted:'#b4b1a8',gold:'#d8bb82',gold2:'#89754f',jade:'#a5d8bf',red:'#ee987c',blue:'#85c4df',edge:'#ffffff25',dark:'#17191c',surface:'#202226'};
Object.assign(H35,{gold:V44UI.gold,gold2:V44UI.gold2,paper:V44UI.ivory,muted:V44UI.muted,jade:V44UI.jade,ink:V44UI.dark,edge:V44UI.edge});
Object.assign(H33,{gold:V44UI.gold,bright:V44UI.ivory,jade:V44UI.jade,muted:V44UI.muted,edge:V44UI.edge,ink:V44UI.dark});
Object.assign(H34,{gold:V44UI.gold,paper:V44UI.ivory,muted:V44UI.muted,jade:V44UI.jade,line:V44UI.edge});
Object.assign(V42HUD,{bronze:V44UI.gold,bright:'#f2d6a4',paper:V44UI.ivory,jade:V44UI.jade,muted:V44UI.muted,edge:V44UI.edge,red:V44UI.red,ink:V44UI.dark});
Object.assign(V21,{gold:V44UI.gold,paper:V44UI.ivory,muted:V44UI.muted,silver:V44UI.edge,green:V44UI.jade,red:V44UI.red});
const V44GROUPS={
 identity:{x:16,y:14,w:267,h:130},map:{x:1054,y:14,w:210,h:173},quest:{x:1024,y:198,w:240,h:95},
 target:{x:408,y:14,w:464,h:83},dock:{x:411,y:626,w:458,h:82},left:{x:16,y:663,w:201,h:43},
 nav:{x:975,y:663,w:289,h:43},feed:{x:16,y:548,w:280,h:99}
};
for(const [k,b] of Object.entries(V44GROUPS))Object.assign(V35_GROUPS[k],b);
const v44StateOld=v35State;
v35State=function(){
  const a=v44StateOld();if(!a.v44Style){
    // New HUD size and anchors; keep preferences for hidden panels, not stale screen coordinates.
    for(const s of Object.values(a.groups))Object.assign(s,{dx:0,dy:0,scale:1,alpha:1});
    a.accessScale=1;a.v44Style=1;
  }return a;
};
function v44Rect(x,y,w,h,fill,stroke=null,r=6){
  g.save();g.beginPath();g.roundRect(x,y,Math.max(.1,w),Math.max(.1,h),Math.max(0,Math.min(r,w/2,h/2)));g.fillStyle=fill;g.fill();
  if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke();}g.restore();
}
function v44Rule(x,y,w,col='#ffffff19'){g.save();g.fillStyle=col;g.fillRect(x,y,w,1);g.restore();}
function v44Title(s,x,y,n=20,col=V44UI.ivory,align='left'){v18Title(s,x,y,n,col,align);}
const V46_FRAME_CACHE=new Map();
function v44Frame(x,y,w,h,edge=V44UI.edge,active=false){
  // Quiet, flat surfaces. One hairline, no double bevels or ornate corner motifs.
  const _fk=y+'|'+h+'|'+(active?1:0);let grad=V46_FRAME_CACHE.get(_fk);if(!grad){grad=g.createLinearGradient(x,y,x,y+h);grad.addColorStop(0,active?'#35302aef':'#29292df2');grad.addColorStop(1,active?'#25231ff7':'#15171bf5');V46_FRAME_CACHE.set(_fk,grad);}
  const stroke=active?'#d8bb8290':edge===V44UI.edge||edge===H35.edge?'#ffffff1e':v42HUDAlpha(edge,'65');
  v44Rect(x,y,w,h,grad,stroke,Math.min(8,h*.18));
}
v42HUDFrame=v44Frame;v35Plate=v44Frame;v34Panel=v44Frame;v21Frame=v44Frame;
// Older dialogue/menu/utility panels share the same material instead of retaining
// the previous thick jade-and-brass border. No button callbacks are replaced.
v41PFrame=function(x,y,w,h,active=false){v44Frame(x,y,w,h,V44UI.edge,active);};
v41PButton=function(x,y,w,h,title,sub,cb,primary=false){
  const over=v33Over(x,y,w,h);
  v44Rect(x,y,w,h,primary?'#544631ef':over?'#3c3934ef':'#24262bed',over?'#d8bb829e':primary?'#d8bb8270':'#ffffff24',6);
  if(primary){g.fillStyle=V44UI.gold;g.fillRect(x+2,y+4,3,h-8);}
  v33Fit(title,x+17,y+h/2-(sub?8:0),w-47,sub?19:15,primary?'#ffe8bc':V44UI.ivory,'left','bold');
  if(sub)v33Fit(sub,x+17,y+h/2+14,w-47,11,V44UI.muted);
  text('›',x+w-19,y+h/2,20,V44UI.gold,'center');
  buttons.push({x,y,w,h,fn:()=>{v41Sound('click');cb();}});
};
v18Frame=function(x,y,w,h,opts={}){v44Frame(x,y,w,h,opts.edge||V44UI.edge,!!opts.active);};
v18Rule=function(x,y,w){v44Rule(x,y,w,'#c8ab733f');};
ornament=function(x,y,w,h,fill){v44Frame(x,y,w,h,V44UI.edge);};
v42HUDShell=function(title,sub){
  g.save();g.fillStyle='#111216e8';g.fillRect(0,0,W,H);g.restore();
  v44Rect(20,21,1240,678,'#1b1c20','#ffffff25',10);
  g.fillStyle='#d8bb82';g.fillRect(34,40,3,42);v44Title(title,50,52,26,V44UI.ivory);
  v33Fit(sub,50,80,790,13,V44UI.muted);
  v44Rule(34,99,1212,'#ffffff25');
  v42HUDButton(1198,43,40,40,'×',()=>{modal=null;},'close');
};
v34Shell=v42HUDShell;
v42HUDSection=function(label,x,y,w,meta=''){
  text(label,x,y,13,V44UI.gold,'left','bold');
  if(meta)v33Fit(meta,x+w,y,w*.48,12,V44UI.muted,'right');
  v44Rule(x,y+13,w);
};
v42HUDButton=function(x,y,w,h,label,fn,id,active=false,enabled=true,sub=''){
  const over=enabled&&v33Over(x,y,w,h);
  v44Rect(x,y,w,h,active?'#594c36':over?'#3a3835':enabled?'#2b2c30':'#242529',active?'#d8bb828a':over?'#e7d3ac70':'#ffffff16',5);
  if(active){g.fillStyle=V44UI.gold;g.fillRect(x+2,y+3,2,h-6);}
  v33Fit(label,x+w/2,y+h/2-(sub?6:0),w-12,14,enabled?V44UI.ivory:'#777a7c','center',active||over?'bold':'normal');
  if(sub)v33Fit(sub,x+w/2,y+h/2+11,w-12,11,V44UI.muted,'center');
  buttons.push({x,y,w,h,fn:()=>{if(enabled)fn();},v33:id});
};
v33Button=function(x,y,w,h,label,fn,active=false,edge=H33.edge,id=label){
  const over=v33Over(x,y,w,h);v44Rect(x,y,w,h,active?'#584b37':over?'#39383a':'#25272a',active?'#d8bb8280':'#ffffff24',5);
  v33Fit(label,x+w/2,y+h/2,w-9,h>25?12:10,active||over?V44UI.ivory:V44UI.muted,'center',active||over?'bold':'normal');
  buttons.push({x,y,w,h,fn,v33:id});
};
function v44Bar(x,y,w,h,value,max,col){
  v44Rect(x,y,w,h,'#ffffff13',null,h/2);
  const fill=clamp(value/Math.max(1,max),0,1)*w;if(fill>0)v44Rect(x,y,fill,h,col,null,h/2);
}
function v44Key(x,y,w,k,col=V44UI.ivory){
  v44Rect(x,y,w,19,'#15171ce8','#ffffff32',4);v33Fit(k,x+w/2,y+9.5,w-4,10,col,'center','bold');
}
function v44Label(s,x,y,n=12,c=V44UI.ivory,align='center',weight='normal'){
  g.save();g.shadowColor='#0a0b0c';g.shadowBlur=5;g.shadowOffsetY=1;text(s,x,y,n,c,align,weight);g.restore();
}
v35Identity=function(s){
  const {x,y,w}=V44GROUPS.identity,col=V10_SCHOOLS[p.cls].color,inside=!!v36Inside(),h=inside?119:108;
  v44Rect(x,y,w,h,'#16171be8','#ffffff20',9);
  v33Shield(x,y,w,h);
  v41HUDClassPortrait(p.cls,x+37,y+34,25,col);
  v44Rect(x+20,y+54,34,18,'#a68a55','#e3c78d80',5);text(String(p.level),x+37,y+63,11,'#fff5df','center','bold');
  v33Fit(p.v8Name||'Vô Danh',x+75,y+19,143,18,V44UI.ivory,'left','bold');
  v33Fit(realm(),x+75,y+40,167,11,col,'left');
  text('CL '+v41HUDNum(v10FightPower(s)),x+w-10,y+19,10,V44UI.gold,'right','bold');
  text('• '+v41HUDNum(p.stones||0)+' linh thạch',x+75,y+60,10,V44UI.muted);
  v44Rule(x+12,y+76,w-24);
  const bx=x+12,bw=w-24;
  if(inside){
    const half=(bw-12)/2;
    text('HP '+Math.ceil(p.hp)+'/'+Math.ceil(s.hp),bx,y+84,10,V44UI.ivory);
    text('MP '+Math.ceil(p.mp)+'/'+Math.ceil(s.mp),bx+half+12,y+84,10,V44UI.ivory);
    v44Bar(bx,y+93,half,4,p.hp,s.hp,'#e37c68');v44Bar(bx+half+12,y+93,half,4,p.mp,s.mp,'#71b4d5');
    v44Bar(bx,y+108,bw,3,p.xp,xpNeed(),V44UI.gold);
  }else{
    text('Tu vi',bx,y+85,10,V44UI.gold);
    text(Math.floor(p.xp)+' / '+xpNeed(),x+w-12,y+85,10,V44UI.muted,'right');
    v44Bar(bx,y+96,bw,4,p.xp,xpNeed(),V44UI.gold);
  }
  // Numbers on demand remain accessible without consuming the game field.
  if(v33Over(x,y,w,h)&&!v35Editing()){
    v44Frame(x,y+123,w,43);text('HP '+Math.ceil(p.hp)+'/'+Math.ceil(s.hp)+'  ·  MP '+Math.ceil(p.mp)+'/'+Math.ceil(s.mp),x+12,y+136,11,V44UI.ivory);
    text('Tu vi '+Math.floor(p.xp)+'/'+xpNeed()+'  ·  C mở hồ sơ',x+12,y+153,10,V44UI.muted);
  }
  if(v10Points()>0)text('+'+v10Points()+' điểm',x+w-11,y+60,10,V44UI.jade,'right','bold');
  buttons.push({x,y,w,h,fn:v10Open,v35:'profile'});
};
v35Status=function(){
  const a=[];if(p.poisonT>0)a.push(['Độc',p.poisonT,'#b6d98b']);if(p.fireT>0)a.push(['Cháy',p.fireT,V44UI.red]);
  if((p.v10Guard||p.guardT||0)>0)a.push(['Hộ thể',p.v10Guard||p.guardT,V44UI.gold]);if(v13Init().wardRemain>0)a.push(['Hộ phù',v13Init().wardRemain,V44UI.blue]);
  a.forEach(([l,t,c],i)=>{const x=16+i*66,y=138;v44Rect(x,y,62,20,'#15171ce8','#ffffff22',4);text(l+' '+Math.ceil(t)+'s',x+31,y+10,10,c,'center','bold');});
  if(p.level<45&&v22AtCap()&&p.xp>=xpNeed()&&p.worldMode)v34Button(16,a.length?163:138,211,26,'B · Đột phá cảnh giới',v22Break,true,'break');
};
v35Map=function(){
  const st=v34State(),r=REG[p.mapId]||REG.thon,d=V22_REG[p.mapId]||V22_REG.thon,[status,col]=v22Danger(d),x=1054,y=14,w=210,cx=x+105,cy=y+69,rad=59;
  // Circular minimap without a large rectangular backdrop or redundant borders.
  v44Rect(x,y,w,173,'#16171bdd','#ffffff1b',9);v33Shield(x,y,w,173);
  circle(cx,cy,rad+2,'#12161b','#d8bb8275');
  g.save();g.beginPath();g.arc(cx,cy,rad,0,TAU);g.clip();if(st.local)v34Local(cx-rad,cy-rad,rad*2,rad*2);else v33Mini(cx-rad,cy-rad,rad*2,rad*2);g.restore();
  v44Label('B',cx,cy-rad+7,10,V44UI.ivory,'center','bold');
  const hour=hdSun().hour,dt=String(Math.floor(hour)).padStart(2,'0')+':'+String(Math.floor(hour%1*60)).padStart(2,'0');
  text(dt,x+11,y+15,10,V44UI.muted);
  v42HUDButton(x+8,y+43,28,25,'O',()=>v42OpenWorld(),'expedition');
  v42HUDButton(x+w-35,y+43,28,25,'M',()=>openPanel('map'),'map');
  buttons.push({x:cx-rad,y:cy-rad,w:rad*2,h:rad*2,fn:()=>openPanel('map'),v35:'bigmap'});
  v42HUDButton(x+8,y+76,28,24,st.local?'K':'T',()=>{st.local=!st.local;save();},'mapMode');
  v33Fit(r.name,cx,y+139,w-18,14,V44UI.ivory,'center','bold');
  text(d.i?'Lv '+d.min+'–'+d.max+' · '+status:'Khu vực an toàn',cx,y+158,10,col,'center');
};
function v44QuestAt(x,y,w=240){
  const t=v12Tracked(),s=v34State();v44Rect(x,y,w,s.quest?95:31,'#17191de4','#ffffff18',7);
  v33Shield(x,y,w,s.quest?95:31);
  text('THIÊN MỆNH',x+12,y+15,11,V44UI.gold,'left','bold');
  v42HUDButton(x+w-32,y+4,24,23,s.quest?'−':'+',()=>{s.quest=!s.quest;save();},'questToggle');
  if(!s.quest)return;
  v44Rule(x+11,y+30,w-22);
  if(t){
    v33Fit(t.goal,x+12,y+43,w-24,13,V44UI.ivory,'left','bold');
    v44Bar(x+12,y+55,w-24,3,v42QuestFraction(t),1,V44UI.gold);
    const q=v12Target(t),indoor=v36Inside(),msg=indoor?(t.target===indoor.id?'Trong phòng':'Bên ngoài')+' · '+v12Progress(t):q?Math.round(dist(q,p))+' bước · '+v12Progress(t):v12Progress(t);
    v33Fit(msg,x+12,y+77,w-122,10,V44UI.muted);
    v42HUDButton(x+w-102,y+64,90,23,'Dẫn đường',()=>v12Guide(t),'guide');
  }else v42HUDButton(x+12,y+43,w-24,38,'Nhật ký  ·  Q',v12Open,'journal');
}
v35Quest=function(){v44QuestAt(1024,198);};
v35Target=function(){
 const e=v34Target(),edit=v35Editing();if(!e&&!edit)return;
 const a=e?v27AI(e):null,boss=e?bossType(e.type):true,x=408,y=14,w=464,col=boss?V44UI.gold:V44UI.ivory;
 g.fillStyle='#0a0a0ce8';g.fillRect(x,y,w,76);g.fillStyle='#d8bb8266';g.fillRect(x,y+76,w,1);v33Shield(x,y,w,76);
 v33Fit(e?TYPES[e.type].name:'Mục tiêu mẫu',x+12,y+15,w-146,18,col,'left','bold');
 text(e?'Lv '+v22EnemyLevel(e)+' · '+(boss?'THỦ LĨNH':e.elite?'TINH ANH':'YÊU THÚ'):'THỦ LĨNH',x+w-12,y+15,11,V44UI.muted,'right');
 const hp=e?.hp??78,max=e?.max??100;v44Bar(x+12,y+28,w-24,10,hp,max,'#d46f61');
 text(Math.ceil(hp)+' / '+Math.ceil(max),x+12,y+45,11,V44UI.ivory);
 text('Thế',x+155,y+45,11,V44UI.muted);v44Bar(x+183,y+42,w-195,6,a?.poise??67,a?.max??100,V44UI.gold);
 const phase=a?.mode==='stagger'?'PHÁ THẾ · +25% sát thương':a?.mode==='wind'&&a.action?a.action.name+' · '+(a.step+1)+'/'+a.plan.length:a?.mode==='recover'?'Hồi chiêu · cơ hội phản công':boss?'Giai đoạn '+(a?.phase??1):'Chiến đấu';
 v33Fit(phase,x+12,y+63,w-24,12,a?.mode==='wind'?V44UI.red:V44UI.jade,'left','bold');
 if(a?.mode==='wind'&&a.action)v44Bar(x+240,y+61,w-252,3,a.t,a.action.wind,V44UI.red);
};
v35Dock=function(s){
  const x=411,y=626,w=458,slot=47,gap=7,x0=x+43,sy=y+20,ranks=v11Levels(),cds=v11Cooldowns(),skills=V11_SKILLS[p.cls];
  const list=[{key:'LMB',name:'Đánh thường',icon:0,cd:p.atkCd||0,base:Math.max(.27,.39/s.rate),fn:()=>v33Aim(attack)},...skills.slice(0,4).map((d,i)=>({key:d.key,name:d.name,d,rank:ranks[i],cd:cds[i],base:d.cd,fn:()=>v33Aim(()=>v11Cast(i))})),{key:'SPACE',name:'Khinh công · né đòn',icon:2,cd:p.dashCd||0,base:s.dashCd,fn:()=>pressed.Space=true},{key:'H',name:'Hồi Xuân Đan',icon:3,count:p.pills,fn:heal}];
  // No slab: a compact translucent band and two separated resource lines.
  const half=(w-14)/2;v44Bar(x,y+12,half,4,p.hp,s.hp,'#e37c68');v44Bar(x+half+14,y+12,half,4,p.mp,s.mp,'#71b4d5');
  v44Label('HP '+Math.ceil(p.hp)+' / '+Math.ceil(s.hp),x,y+3,10,V44UI.ivory,'left','bold');
  v44Label('MP '+Math.ceil(p.mp)+' / '+Math.ceil(s.mp),x+w,y+3,10,V44UI.ivory,'right','bold');
  let tip=null;
  list.forEach((a,i)=>{
    const xx=x0+i*(slot+gap),cx=xx+slot/2,cy=sy+22,locked=!!(a.d&&!a.rank),low=!!(a.d&&p.mp<a.d.cost),empty=a.count===0,cd=Math.max(0,a.cd||0),dim=locked||low||empty||cd>0,over=v33Over(xx,sy,slot,61),col=a.d?.color||V44UI.gold;
    v44Rect(xx,sy,slot,46,'#14171ce9',over?'#fff0cbbb':locked?'#ffffff19':v42HUDAlpha(col,'80'),6);
    g.save();g.globalAlpha*=dim?.42:1;if(a.d)v11SkillIcon(a.d.kind,cx,cy,19,col);else uiIcon(a.icon,cx-18,cy-18,36,dim);g.restore();
    if(cd>0){g.save();g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,21,-Math.PI/2,-Math.PI/2+TAU*clamp(cd/Math.max(.01,a.base||cd),0,1));g.closePath();g.fillStyle='#0c0d13cf';g.fill();g.restore();text(cd>=1?Math.ceil(cd):cd.toFixed(1),cx,cy,16,V44UI.ivory,'center','bold');}
    else if(locked)text('KHÓA',cx,cy,10,V44UI.muted,'center','bold');else if(low)text('MP',cx,cy,10,V44UI.red,'center','bold');
    if(a.count!=null)text('×'+a.count,xx+slot-3,sy+6,9,V44UI.ivory,'right','bold');
    if(a.d&&a.rank)text(String(a.rank),xx+slot-4,sy+6,9,V44UI.jade,'right','bold');
    v44Key(cx-Math.min(38,Math.max(20,a.key.length*7+7))/2,sy+43,Math.min(38,Math.max(20,a.key.length*7+7)),a.key,dim?V44UI.muted:V44UI.ivory);
    buttons.push({x:xx,y:sy,w:slot,h:61,fn:()=>{if(locked)v11Open();else if(!empty&&!low&&!cd)a.fn();},v35:'skill'+i});
    if(over)tip={a,x:xx,col,locked,low,cd};
  });
  if(V26.hits||V26.stage||V26.action){const a=V26.action,col=V25_COLOR[p.cls];v44Label(V26.hits?V26.hits+' LIÊN KÍCH':a?.kind==='skill'?a.d.name:'Liên chiêu',640,604,13,col,'center','bold');}
  if(tip&&!v35Editing()){const {a,col,locked,low,cd}=tip,tw=270,tx=clamp(tip.x+slot/2-tw/2,8,W-tw-8),ty=517;
    v44Frame(tx,ty,tw,92,col);v33Fit(a.name,tx+12,ty+15,tw-22,14,col,'left','bold');v33Fit(a.d?(locked?'Chưa học · T mở công pháp':low?'Thiếu linh lực':cd>0?'Hồi chiêu '+cd.toFixed(1)+'s':a.d.cost+' MP · '+a.d.cd+'s · Sẵn sàng'):(a.key+' · '+(cd?'Hồi chiêu '+cd.toFixed(1)+'s':'Sẵn sàng')),tx+12,ty+36,tw-22,11,V44UI.muted);v44Rule(tx+12,ty+46,tw-24);v12Wrap(a.d?.desc||(a.count!=null?'Hồi sinh mệnh · còn '+a.count+' đan':'Sử dụng trực tiếp khi chiến đấu'),tx+12,ty+62,tw-24,11,V44UI.muted,15,2);
  }
};
// Smaller nav buttons have visible keycaps and a tooltip; icons and actions remain unchanged.
v35Control=function(x,y,w,kind,key,label,fn,active=false){
  const over=v33Over(x,y,w,43),col=active?V44UI.gold:over?V44UI.ivory:V44UI.muted;
  v44Rect(x,y,w,43,active?'#383128e9':'#181a1edc',over?'#e0cfab70':'#ffffff20',6);
  v35Icon(kind,x+w/2,y+15,12,col);text(key,x+w/2,y+34,9,col,'center','bold');
  if(active)circle(x+w-6,y+6,2.5,V44UI.jade);
  buttons.push({x,y,w,h:43,fn,v35:key});
  if(over&&!v35Editing()){const tw=clamp(label.length*6.8+22,112,300),tx=clamp(x+w/2-tw/2,5,W-tw-5);v44Frame(tx,y-30,tw,24);v33Fit(label,tx+tw/2,y-18,tw-12,11,V44UI.ivory,'center');}
};
v35Left=function(){const y=663;v35Control(16,y,45,'menu','MENU','Đạo đồ · Menu',()=>V33.menu=!V33.menu,V33.menu);v35Control(68,y,45,'auto','F','Tự đánh · '+(auto?'Bật':'Tắt'),()=>{auto=!auto;save();},auto);v35Control(120,y,45,'loot','X','Tự nhặt · '+(v21State().auto?'Bật':'Tắt'),v21Toggle,v21State().auto);v35Control(172,y,45,'bag','Z','Nhặt vật phẩm gần',v21PickNear);};
v35Nav=function(){const y=663,enabled=v41AudioEnabled();[[975,'audio','ÂM','Âm thanh',v41AudioToggle,enabled],[1024,'bag','I','Hành trang',()=>openPanel('gear'),false],[1073,'book','T','Công pháp',v11Open,v11SkillPoints()>0],[1122,'scroll','Q','Nhật ký',v12Open,false],[1171,'hud','F2','Chỉnh HUD',v35Open,false],[1220,'settings','ESC','Cài đặt',()=>openPanel('settings'),false]].forEach(([x,kind,key,label,fn,act])=>v35Control(x,y,44,kind==='audio'&&!enabled?'mute':kind,key,label,fn,act));};
v35Feed=function(){const st=v34State();if(!st.feed&&!v35Editing())return;const a=V34.events.filter(e=>elapsed-e.at<7).slice(-3);if(!a.length&&v35Editing())a.push({text:'Thông báo mẫu · +12 tu vi',col:H35.gold,at:elapsed,n:1});a.forEach((e,i)=>{const y=548+i*27;g.save();g.globalAlpha*=clamp((7-(elapsed-e.at))/2,.1,1);v44Rect(16,y,266,24,'#17191cab',null,4);g.fillStyle=e.col;g.fillRect(16,y+4,2,16);v33Fit(e.text+(e.n>1?' ×'+e.n:''),26,y+12,248,11,e.col);g.restore();});};
// Indoor HUD: safe spaces show relevant movement, conversation and exit only.
v36Mini=function(){
 const r=v36Current(),x=1054,y=14,w=210;v44Rect(x,y,w,63,'#17191dea','#ffffff20',7);
 text('NỘI THẤT',x+12,y+15,10,V44UI.gold,'left','bold');circle(x+15,y+35,3,V44UI.jade);
 text('Khu vực an toàn',x+25,y+35,12,V44UI.ivory);text('Không chiến đấu',x+12,y+51,10,V44UI.muted);
};
v36HUD=function(){
 v35Reset();V35.rects={};const edit=v35Editing(),s=currentStats();if(modal&&!edit)return;
 v35Group('identity',()=>{v35Identity(s);v35Status();});
 v35Group('map',v36Mini);
 if(edit){v35Group('quest',v35Quest);v35Group('dock',()=>v35Dock(s));v35Group('nav',v35Nav);v35Group('left',v35Left);v35Group('feed',v35Feed);V35.dragButtons=buttons.filter(b=>b.v35?.startsWith('drag:'));return;}
 if(!v35State().groups.quest.hidden)v44QuestAt(1024,86);
 v35Group('nav',v35Nav);
 const r=v36Current(),a=v36Inside(),close=dist(a,V36_NPC)<=75,out=dist(a,V36_EXIT)<42;
 v44Title(r.name,640,32,25,V44UI.ivory,'center');v44Rule(586,50,108,'#d8bb827a');
 v44Label(r.desc,640,64,11,V44UI.muted);
 // One context strip in the empty bottom margin, away from the walkable room.
 v44Rect(436,642,408,64,'#17191df2','#ffffff20',8);
 v44Key(449,650,23,close?'E':'→',V44UI.gold);text(close?'Nói chuyện':'Đến gặp '+V8_INFO[r.id].name,480,660,12,V44UI.ivory,'left','bold');
 v44Label('WASD / Click · Di chuyển',640,695,10,V44UI.muted);
 v42HUDButton(647,648,185,31,'Rời công trình  →',v36GoExit,'exit36');
 buttons.push({x:444,y:644,w:192,h:39,fn:close?v36Interact:v36GoNPC,v35:'indoorAction'});
 if(notifyT>0&&notify&&!/^Đã vào /.test(notify))v44Label(notify,640,83,11,V44UI.gold);
 v33Drawer();
};
// Draw the room using unchanged collision and actor positions, but remove huge nameplates.
v36Draw=function(){
 const a=v36Inside(),r=v36Current(),npc={id:r.id,dir:v9Dir(a.x-V36_NPC.x,a.y-V36_NPC.y,2,false,0),walking:false,gait:0};buttons=[];g.drawImage(v36Backdrop(r),0,0);v41RoomLive(r);
 if(!modal&&V36.route.length){g.save();g.strokeStyle='#ead4a5';g.lineWidth=1.5;g.globalAlpha=.7;g.setLineDash([4,7]);g.beginPath();g.moveTo(a.x,a.y);for(const q of V36.route)g.lineTo(q.x,q.y);g.stroke();g.restore();}
 hdEllipse(g,640,558,28,8,'#d6df9630');g.save();g.strokeStyle='#dfca91a0';g.lineWidth=1.4;g.beginPath();g.ellipse(640,558,27,8,0,0,TAU);g.stroke();g.restore();
 const actor=()=>{hdEllipse(g,640,310,18,6,'#1b201b77');v9NPCDraw(V8_INFO[r.id],npc,V36_NPC);},hero=()=>hdHero({x:a.x,y:a.y});
 const things=[{y:310,draw:actor},{y:a.y,draw:hero},...v37Furniture(r).map(f=>({y:f.y+f.h,draw:()=>v37FurnDraw(f)}))];things.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());
 if(!modal){
   const q=V8_INFO[r.id];v44Rect(583,201,114,35,'#18191cbb',null,5);v44Label(q.name,640,211,14,V44UI.ivory,'center','bold');v44Label(q.role,640,226,10,V44UI.gold);
   if(v12Tracked()?.target===r.id)diamond(g,640,192+Math.sin(elapsed*4)*3,5,V44UI.gold);
   if(dist(a,V36_NPC)<=75){v44Key(602,326,22,'E',V44UI.gold);v44Label('Nói chuyện',630,336,12,V44UI.ivory,'left');buttons.push({x:596,y:320,w:112,h:32,fn:v36Interact,v35:'talk36'});}
   const out=dist(a,V36_EXIT)<42;if(out){v44Key(601,568,22,'E',V44UI.gold);v44Label('Ra ngoài',630,578,12,V44UI.ivory,'left');}
   buttons.push({x:606,y:543,w:68,h:31,fn:v36GoExit,v35:'doorout36'});
 }
 v36HUD();if(modal){buttons=[];panel();}
};


