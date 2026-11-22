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

// v35State: trạng thái bố cục HUD lưu trong save + chuỗi nâng cấp bố cục cũ.
// Gộp ở T02b từ 4 lớp (V35 gốc → V38 → V41 → V44). Thứ tự các bước phải giữ nguyên vì save cũ chạy qua lần lượt.
function v35State(){
  // Bước V35: tạo/chuẩn hoá dữ liệu nhóm HUD.
  p.v35??={groups:{},profile:0};const a=p.v35;a.groups??={};a.profile??=0;
  for(const k of Object.keys(V35_GROUPS)){const s=a.groups[k]??=( {dx:0,dy:0,scale:1,alpha:1,hidden:false});s.scale=clamp(Number(s.scale)||1,.7,1.3);s.alpha=clamp(Number(s.alpha)||1,.45,1);s.dx=Number(s.dx)||0;s.dy=Number(s.dy)||0;}
  // Bước V38: bố cục mặc định thu nhỏ (chỉ một lần, chỉ khi người chơi chưa chỉnh).
  if(!a.v38Style){const defaults=Object.values(a.groups).every(s=>s.scale===1&&s.dx===0&&s.dy===0&&s.alpha===1);if(defaults){const layout={identity:[.84,0,0,.91],map:[.78,45,0,.94],quest:[.78,56,-45,.81],target:[.87,33,0,.95],dock:[.78,72,24,1],left:[.78,0,14,.92],nav:[.78,60,14,.92],feed:[.85,0,40,.75]};for(const [k,v] of Object.entries(layout))Object.assign(a.groups[k],{scale:v[0],dx:v[1],dy:v[2],alpha:v[3]});}a.v38Style=true;}
  // Bước V41: nâng bố cục "nhà máy" cũ lên bố cục V41, không đụng chỉnh tay của người chơi.
  if(!a.v41Style){
    const legacy=(s,v)=>['scale','dx','dy','alpha'].every((k,i)=>Math.abs(s[k]-v[i])<.001);
    const factory=Object.keys(V41HUD_LEGACY).every(k=>legacy(a.groups[k],V41HUD_LEGACY[k])||legacy(a.groups[k],[1,0,0,1]));
    if(factory){
      for(const s of Object.values(a.groups))Object.assign(s,{dx:0,dy:0,scale:1,alpha:1});
      Object.assign(a.groups.identity,{scale:.96,alpha:.96});
      Object.assign(a.groups.map,{scale:.94,dx:12,alpha:.96});
      Object.assign(a.groups.quest,{scale:.94,dx:14,dy:-8,alpha:.94});
      Object.assign(a.groups.dock,{scale:.92,dx:20,dy:8,alpha:1});
      Object.assign(a.groups.left,{scale:.91,dy:4});
      Object.assign(a.groups.nav,{scale:.91,dx:25,dy:4});
      Object.assign(a.groups.feed,{scale:.93,dy:7,alpha:.9});
      Object.assign(a.groups.target,{scale:.96,dx:9});
    }
    a.v41Style=V41HUD.version;
  }
  // Bước V44: HUD cỡ mới — đặt lại toạ độ/tỉ lệ (giữ cờ ẩn nhóm).
  if(!a.v44Style){for(const s of Object.values(a.groups))Object.assign(s,{dx:0,dy:0,scale:1,alpha:1});a.accessScale=1;a.v44Style=1;}
  return a;
}
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

// Bản hiển thị thường của bảng mục tiêu (trước là lớp V44, được V45 gọi qua v45TargetOld). Gộp ở T02b.
function v35TargetNormal(){
 const e=v34Target(),edit=v35Editing();if(!e&&!edit)return;
 if(e&&!edit&&bossType(e.type)&&!e.dead)return; // (T13/M2) Boss sống chỉ hiện ở thanh boss đáy màn hình (src/62_combat_hud.js, spec §5), không vẽ trùng bảng mục tiêu trên. Mục tiêu thường và bản mẫu lúc F2 vẫn vẽ như cũ.
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
}

// Smaller nav buttons have visible keycaps and a tooltip; icons and actions remain unchanged.
v35Control=function(x,y,w,kind,key,label,fn,active=false){
  const over=v33Over(x,y,w,43),col=active?V44UI.gold:over?V44UI.ivory:V44UI.muted;
  v44Rect(x,y,w,43,active?'#383128e9':'#181a1edc',over?'#e0cfab70':'#ffffff20',6);
  v35Icon(kind,x+w/2,y+15,12,col);text(key,x+w/2,y+34,9,col,'center','bold');
  if(active)circle(x+w-6,y+6,2.5,V44UI.jade);
  buttons.push({x,y,w,h:43,fn,v35:key});
  if(over&&!v35Editing()){const tw=clamp(label.length*6.8+22,112,300),tx=clamp(x+w/2-tw/2,5,W-tw-5);v44Frame(tx,y-30,tw,24);v33Fit(label,tx+tw/2,y-18,tw-12,11,V44UI.ivory,'center');}
};



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


