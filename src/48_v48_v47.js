'use strict';
function v48xLoad(){if(V48X.owner!==p?.playerId){v48xReset();V48X.owner=p?.playerId||null;}try{const s=JSON.parse(localStorage.getItem(v46ExplorerKey())||'null');if(s&&V48_ROUTES[s.mapId]&&Array.isArray(s.visited)&&s.discovered&&Number.isFinite(s.stones)){V48X.visited=s.visited;V48X.discovered=s.discovered;V48X.stones=s.stones;return s;}}catch(e){}return null;}
function v48xActivate(mapId,point){const m=V48X_META_BY_ID[mapId];if(!m)return;V48X.mapId=mapId;V48X.graph=v48xGraph(mapId);const g=V48X.graph;const safe=point&&Number.isFinite(point.x)&&Number.isFinite(point.y)&&v48xAllowed(g,point);const origin=safe?point:V48_ROUTES[mapId].nodes.find(n=>n.kind==='start')||V48_ROUTES[mapId].nodes.find(n=>n.id==='prev')||V48_ROUTES[mapId].nodes[0];V48X.x=origin.x;V48X.y=origin.y;V48X.cam={x:origin.x,y:origin.y};V48X.path=[];V48X.selected=null;if(!V48X.visited.includes(mapId))V48X.visited.push(mapId);v48xSave();}
function v48xEnter(mapId){if(!V48_ROUTES[mapId])return;const chk=v46CanEnter(mapId);if(!chk.ok){message(chk.reason);return;}const saved=v48xLoad();modal=null;V48X.active=true;V48X.showRoutes=false;V48X.zoom=1;const start=(saved&&saved.mapId===mapId&&saved.position)?saved.position:null;v48xActivate(mapId,start);message('Khám phá · '+V48X_META_BY_ID[mapId].name+' — WASD/click để đi, E để khảo sát, ESC để thoát');}
function v48xExit(){V48X.active=false;V48X.path=[];v48xSave();message('Đã rời chế độ Khám phá — quay lại thế giới');}
function v48xGo(q,id){const path=v48xPathfind(V48X.graph,{x:V48X.x,y:V48X.y},q);if(!path){message('Không có lối đi an toàn đến vị trí này.');return false;}V48X.path=path;V48X.selected=id||null;return true;}
function v48xNear(){let best=null;for(const n of V48_ROUTES[V48X.mapId].nodes)if(n.kind!=='junction'&&n.kind!=='start'&&dist({x:V48X.x,y:V48X.y},n)<16&&(!best||dist({x:V48X.x,y:V48X.y},n)<dist({x:V48X.x,y:V48X.y},best)))best=n;return best;}
function v48xInteract(){const n=v48xNear();if(!n){message('Hãy đến gần địa điểm hoặc cổng trước.');return;}if(n.kind==='gate'){const chk=v46CanEnter(n.target);if(!chk.ok){message(chk.reason);return;}if(!v48xGateOpen(n)){message('Khảo sát địa danh chính và ít nhất 2 địa điểm để mở cổng.');return;}const dest=V48X_META_BY_ID[n.target],back=V48_ROUTES[dest.mapId].nodes.find(x=>x.kind==='gate'&&x.target===V48X.mapId);if(!back){message('Lỗi cổng đối ứng.');return;}v48xActivate(dest.mapId,back);message('Đã đến '+dest.name);return;}const seen=v48xExplored();if(seen.has(n.id)){message(n.detail||n.name);return;}seen.add(n.id);V48X.discovered[V48X.mapId]=[...seen];const gain=n.kind==='resource'?15:n.kind==='trial'?20:5;p.stones=(p.stones||0)+gain;message(n.name+' · +'+gain+' linh thạch');v48xSave();save();}
function v48xUpdateView(){const base=Math.min(W/600,H/400),vw=W,vh=H;V48X.view.scale=base*V48X.zoom;const maxX=600-vw/(2*V48X.view.scale),minX=vw/(2*V48X.view.scale),maxY=400-vh/(2*V48X.view.scale),minY=vh/(2*V48X.view.scale);const tx=minX>maxX?300:clamp(V48X.x,minX,maxX),ty=minY>maxY?200:clamp(V48X.y,minY,maxY);V48X.cam.x=tx;V48X.cam.y=ty;V48X.view.x=vw/2-V48X.cam.x*V48X.view.scale;V48X.view.y=vh/2-V48X.cam.y*V48X.view.scale;}
function v48xUpdate(dt){notifyT=Math.max(0,notifyT-dt);V48X.clock+=dt;const g=V48X.graph;if(!g)return;if(pressed.Escape){delete pressed.Escape;v48xExit();return;}if(pressed.KeyE){delete pressed.KeyE;v48xInteract();}
 let dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),dy=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);
 const rate=V48X_SURFACE[v48xNearest(g,{x:V48X.x,y:V48X.y})?.e.surface]||1,step=60*rate*dt;let old={x:V48X.x,y:V48X.y};V48X.moving=false;
 if(dx||dy){V48X.path=[];const k=Math.hypot(dx,dy);dx*=step/k;dy*=step/k;const cand={x:V48X.x+dx,y:V48X.y+dy};if(v48xAllowed(g,cand)){V48X.x=cand.x;V48X.y=cand.y;}else{const q=v48xNearest(g,cand);if(q&&q.d<q.e.width+step+1){const d=dist({x:V48X.x,y:V48X.y},q);if(d<step*1.6){V48X.x=q.x;V48X.y=q.y;}}}}
 else if(V48X.path.length){let remain=step;while(V48X.path.length&&remain>0){const q=V48X.path[0],d=dist({x:V48X.x,y:V48X.y},q);if(d<=remain){V48X.x=q.x;V48X.y=q.y;V48X.path.shift();remain-=d;}else{V48X.x+=(q.x-V48X.x)*remain/d;V48X.y+=(q.y-V48X.y)*remain/d;remain=0;}}}
 V48X.moving=dist({x:V48X.x,y:V48X.y},old)>.04;
 if(V48X.moving){const ddx=V48X.x-old.x,ddy=V48X.y-old.y;V48X.flip=ddx<0;V48X.dir=Math.abs(ddx)<Math.abs(ddy)*.45?(ddy<0?'N':'S'):(ddy<0?'NE':'SE');V48X.frame=(V48X.frame+dt*24)%12;}else V48X.frame=(V48X.frame+dt*6)%12;
 v48xUpdateView();}
function v48xClick(){if(!V48X.active)return;const q={x:(mouse.x-V48X.view.x)/V48X.view.scale,y:(mouse.y-V48X.view.y)/V48X.view.scale};if(q.x<0||q.x>600||q.y<0||q.y>400)return;const n=V48_ROUTES[V48X.mapId].nodes.filter(n=>n.kind!=='junction'&&dist(q,n)<13).sort((a,b)=>dist(q,a)-dist(q,b))[0];if(n&&dist({x:V48X.x,y:V48X.y},n)<16){v48xInteract();return;}v48xGo(n||q,n?n.id:null);}
function v48xDrawHero(){const m=V48X_META_BY_ID[V48X.mapId];const spriteKey=V48X.moving?({N:'v48runBN',NE:'v48runBNE',S:'v48runBS',SE:'v48runBSE'}[V48X.dir]||'v48runBS'):'v48idle';const sp=imgs[spriteKey];const idx=V48X.moving?Math.floor(V48X.frame)%12:Math.floor(V48X.frame)%6,cols=V48X.moving?4:3;g.save();g.translate(V48X.x,V48X.y);g.fillStyle='#10101488';g.beginPath();g.ellipse(0,1,8,3.4,0,0,TAU);g.fill();g.strokeStyle='#dce8bbab';g.lineWidth=.9;g.beginPath();g.ellipse(0,0,6,2.6,0,0,TAU);g.stroke();if(sp?.ready){if(V48X.moving&&V48X.flip)g.scale(-1,1);const size=34;g.drawImage(sp.img,(idx%cols)*256,Math.floor(idx/cols)*256,256,256,-size/2,-size*224/256,size,size);}else{g.fillStyle='#eee4bc';g.beginPath();g.arc(0,-6,4,0,TAU);g.fill();}g.restore();}
function v48xDrawMarker(n){const isGate=n.kind==='gate',color=V48X_COLORS[n.kind]||'#fff',done=v48xExplored().has(n.id);const close=dist({x:V48X.x,y:V48X.y},n)<27,rad=close?7.5:6.5;g.save();g.translate(n.x,n.y);if(isGate){g.strokeStyle=v48xGateOpen(n)?'#75e8d6':'#c89469';g.lineWidth=1.2;g.globalAlpha=.7+Math.sin(V48X.clock*3)*.25;g.beginPath();g.ellipse(0,0,12+Math.sin(V48X.clock*3)*1.5,6.5,0,0,TAU);g.stroke();g.globalAlpha=1;}g.fillStyle='#142727f2';g.strokeStyle=done?'#92dcb2':color;g.lineWidth=1.1;g.beginPath();g.arc(0,-9,rad,0,TAU);g.fill();g.stroke();g.fillStyle=done?'#8ad6a8':color;g.font='bold 9px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText(done?'✓':V48X_ICONS[n.kind]||'·',0,-8.7);if(close||V48X.selected===n.id||V48X.showRoutes||V48X.zoom<=1.1){const t=n.name;g.font='600 9px system-ui';const w=g.measureText(t).width+12;g.fillStyle='#0d191be6';g.strokeStyle='#c59b61';g.lineWidth=.8;g.fillRect(-w/2,-28,w,13);g.strokeRect(-w/2,-28,w,13);g.fillStyle='#fff2d0';g.fillText(t,0,-21.5);}g.restore();}
function v48xDraw(){const m=V48X_META_BY_ID[V48X.mapId],g2=V48X.graph;g.save();g.fillStyle='#101b1b';g.fillRect(0,0,W,H);g.save();g.translate(V48X.view.x,V48X.view.y);g.scale(V48X.view.scale,V48X.view.scale);const art=imgs['v48map'+m.index];if(art?.ready)g.drawImage(art.img,0,0,600,400);else{g.fillStyle='#253d35';g.fillRect(0,0,600,400);}g.save();g.beginPath();g.rect(0,0,600,400);g.clip();if(V48X.showRoutes){g.lineCap='round';g.setLineDash([4,3]);g.lineWidth=1.1;g.strokeStyle='rgba(232,201,139,.85)';for(const e of g2.edges){const a=g2.verts[e.a],b=g2.verts[e.b];g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}g.setLineDash([]);}if(V48X.path.length){g.lineWidth=1.3;g.strokeStyle='#f2d797';g.setLineDash([3,4]);g.lineDashOffset=-V48X.clock*17;g.beginPath();g.moveTo(V48X.x,V48X.y);for(const q of V48X.path)g.lineTo(q.x,q.y);g.stroke();g.setLineDash([]);const q=V48X.path[V48X.path.length-1];g.strokeStyle='#ffdc92';g.beginPath();g.arc(q.x,q.y,5.5,0,TAU);g.stroke();}if(!m.safe){for(let j=0;j<28;j++){const x=((j*83.81+V48X.clock*(m.mapId==='tuyet'?5:1.4))%600+600)%600,y=(j*53.13+V48X.clock*(m.mapId==='tuyet'?12:2))%400;g.fillStyle=m.mapId==='tuyet'?'#daedff80':m.mapId==='hoa'?'#fda85c64':m.mapId==='ma'||m.mapId==='loi'?'#b1a3ff60':'#d6e99a58';g.beginPath();g.arc(x,y,j%4===0?.75:.42,0,TAU);g.fill();}}for(const n of V48_ROUTES[V48X.mapId].nodes)if(n.kind!=='junction')v48xDrawMarker(n);v48xDrawHero();g.restore();g.restore();
 // HUD (tọa độ màn hình)
 const seen=v48xExplored(),sites=v48xSites();
 box(16,12,560,58,'#101b1bcc','#53635c',8);text(m.name,32,36,20,'#e8c98b','left','bold');text(m.theme,32,58,12,'#94a99d','left');text('ĐỊA VỰC '+String(m.index+1).padStart(2,'0')+(m.safe?' · AN TOÀN':' · KHÁM PHÁ'),560,32,12,'#8dd7c0','right');text('Khám phá '+seen.size+'/'+sites.length+' · Linh thạch '+(p?.stones||0),560,54,12,'#eee8d9','right');
 addButton(1000,16,86,30,V48X.showRoutes?'Ẩn đường':'Hiện đường',()=>{V48X.showRoutes=!V48X.showRoutes;},false);
 addButton(1092,16,36,30,'+',()=>{V48X.zoom=clamp(V48X.zoom+.25,1,2.65);},false);
 addButton(1132,16,36,30,'-',()=>{V48X.zoom=clamp(V48X.zoom-.25,1,2.65);},false);
 addButton(1172,16,92,30,'Thoát · ESC',()=>{v48xExit();},true);
 const near=v48xNear();let hint='Click địa điểm hoặc dùng WASD để khám phá';if(V48X.path.length)hint='Đang di chuyển theo tuyến đường an toàn…';else if(near)hint=(near.kind==='gate'?(v48xGateOpen(near)?'Truyền tống · '+V48X_META_BY_ID[near.target].name:near.name+' · Chưa đủ điều kiện'):(v48xExplored().has(near.id)?'Xem lại':'Khảo sát')+' · '+near.name)+' — nhấn E';
 box(340,676,600,30,'#101b1bcc','#53635c',8);text(hint,640,694,13,'#eee8d9','center');
 if(notifyT>0&&notify){g.save();g.font='600 13px system-ui';const w=g.measureText(notify).width+24;g.fillStyle='#101b1bcc';g.fillRect(640-w/2,640,w,26);g.fillStyle='#e8c98b';g.textAlign='center';g.textBaseline='middle';g.fillText(notify,640,653);g.restore();}
 g.restore();}


// ===== Dot2t — Tách thế giới chính thành 10 map nhỏ, đi lại bằng cổng dịch chuyển =====
const V48T_CHAIN=['thon','truc','yeu','tram','tuyet','hoa','phong','quy','ma','loi'];
const V48T_HW=700,V48T_HH=1100;
function v48tBounds(id){const r=REG[id]||REG.thon;let x=Math.max(0,r.x-V48T_HW),y=Math.max(0,r.y-V48T_HH),w=V48T_HW*2,h=V48T_HH*2;if(x+w>OW.w)w=OW.w-x;if(y+h>OW.h)h=OW.h-y;return{x,y,w,h,cx:r.x,cy:r.y};}
function v48tGates(id){const i=V48T_CHAIN.indexOf(id),b=v48tBounds(id),out=[];
if(i>0)out.push({side:'prev',to:V48T_CHAIN[i-1],x:b.x+64,y:b.cy});
if(i<V48T_CHAIN.length-1)out.push({side:'next',to:V48T_CHAIN[i+1],x:b.x+b.w-64,y:b.cy});
return out;}
function v48tNearGate(){if(!p?.worldMode)return null;
for(const gt of v48tGates(p.mapId||'thon'))if(Math.abs(p.x-gt.x)<95&&Math.abs(p.y-gt.y)<120)return gt;
return null;}
function v48tClamp(){const b=v48tBounds(p.mapId||'thon');
p.x=clamp(p.x,b.x+28,b.x+b.w-28);p.y=clamp(p.y,b.y+28,b.y+b.h-28);
owCamera.x=clamp(owCamera.x,b.x,Math.max(b.x,b.x+b.w-W));
owCamera.y=clamp(owCamera.y,b.y,Math.max(b.y,b.y+b.h-H));}
function v48tTravel(){const gt=v48tNearGate();
if(!gt){message('Hãy tới gần cổng dịch chuyển tại mép bản đồ.');return;}
const dest=WORLD_MAPS[gt.to],chk=v46CanEnter(gt.to);
if(!chk.ok){message(chk.reason);return;}
if(gt.to==='thon'){const q=V46_NAV.q,t=V46_NAV.target;v47tEnter(null,null,true);if(V46_NAV.active&&q)v8SetGoal(q,t);save();return;}
const b=v48tBounds(gt.to),sx=gt.side==='next'?b.x+90:b.x+b.w-90;
p.mapId=gt.to;worldMap=gt.to;owRegion=gt.to;
p.x=sx;p.y=b.cy;p.vx=0;p.vy=0;p.dashT=0;
owCamera.x=clamp(p.x-W/2,b.x,Math.max(b.x,b.x+b.w-W));
owCamera.y=clamp(p.y-H/2,b.y,Math.max(b.y,b.y+b.h-H));
worldTitle=3.5;message(dest.name+' · '+dest.sub);save();V8.route=[];V8.goal=null;V8.target=null;V8.vx=0;V8.vy=0;V8.stuck=0;V8.lastDist=Infinity;if(V46_NAV.active&&V46_NAV.q){const nq=V46_NAV.q,nt=V46_NAV.target;V46_NAV.active=false;V46_NAV.q=null;V46_NAV.target=null;v8SetGoal(nq,nt);}}
function v48tDrawGates(){if(!p?.worldMode||mode!=='play'||V48X.active||v36Inside?.())return;
const v=hdView(),labels=[];
g.save();g.scale(V11_ZOOM,V11_ZOOM);
for(const gt of v48tGates(p.mapId||'thon')){
const z=hdPoint(gt.x,gt.y,v),dest=WORLD_MAPS[gt.to],locked=!v46CanEnter(gt.to).ok,col=locked?'#e8a0a0':'#7df0d8';
// tall beacon beam (world space, scaled)
const beam=g.createLinearGradient(0,z.y-260,0,z.y);
beam.addColorStop(0,'rgba(125,240,216,0)');
beam.addColorStop(1,locked?'rgba(232,160,160,.55)':'rgba(125,240,216,.55)');
g.fillStyle=beam;g.fillRect(z.x-9,z.y-260,18,260);
// soft ground glow
const glow=g.createRadialGradient(z.x,z.y-14,4,z.x,z.y-14,64);
glow.addColorStop(0,locked?'rgba(232,160,160,.5)':'rgba(125,240,216,.5)');
glow.addColorStop(1,'rgba(125,240,216,0)');
g.fillStyle=glow;g.beginPath();g.ellipse(z.x,z.y-14,64,26,0,0,TAU);g.fill();
// ground ring (bigger, pulsing)
g.save();g.globalAlpha=.75+.25*Math.sin(elapsed*3);g.strokeStyle=col;g.lineWidth=3;
g.beginPath();g.ellipse(z.x,z.y-14,44,22,0,0,TAU);g.stroke();g.restore();
labels.push({sx:z.x*V11_ZOOM,sy:z.y*V11_ZOOM,locked,dest});}
g.restore();
// labels in SCREEN space (unscaled) so they stay readable and sit above the HUD
for(const L of labels){
g.font='bold 14px system-ui';g.textAlign='center';g.textBaseline='middle';
const label='Cổng · '+L.dest.name,w=g.measureText(label).width+20;
g.fillStyle='#0d191bf2';g.fillRect(L.sx-w/2,L.sy-72,w,24);
g.strokeStyle='#e8c98b';g.lineWidth=1.5;g.strokeRect(L.sx-w/2,L.sy-72,w,24);
g.fillStyle=L.locked?'#f1a19b':'#ffe9b0';g.fillText(label,L.sx,L.sy-60);}
const near=v48tNearGate();
if(near){const dest=WORLD_MAPS[near.to],label='Nhấn E · '+dest.name;
g.font='bold 15px system-ui';g.textAlign='center';g.textBaseline='middle';
const w=g.measureText(label).width+36,gy=v45CombatHUD()?462:552; // T11 (§8.2): khỏi y610 để không đè hàng HP/MP của dock combat
g.fillStyle='#161319dd';g.fillRect(640-w/2,gy,w,32);
g.strokeStyle='#c59b61';g.lineWidth=1;g.strokeRect(640-w/2,gy,w,32);
g.fillStyle='#ffe9b0';g.fillText(label,640,gy+16);}}
const v48tDrawOld=worldDraw;
worldDraw=function(){v48tDrawOld();v48tDrawGates();};
const v48tUpdateOld=worldUpdate;
worldUpdate=function(dt){
if(!p?.worldMode||v36Inside?.()||V48X.active||modal)return v48tUpdateOld(dt);
worldTitle=Math.max(0,worldTitle-dt);
if(pressed.KeyE&&v48tNearGate()){v48tTravel();delete pressed.KeyE;if(v47tIsActive())return;}
v48tUpdateOld(dt);if(!v47tIsActive())v48tClamp();};
const v48tSetGoalOld=v8SetGoal;
v8SetGoal=function(q,target=null){ if(v47tIsActive()&&q&&typeof q.x==='number'&&typeof q.y==='number'){const tq=v47tMapGoal(q,target);if(tq){if(tq.gate){V46_NAV.active=true;V46_NAV.q=q;V46_NAV.target=target;}else{V46_NAV.active=false;V46_NAV.q=null;V46_NAV.target=null;}V47T.goal={x:tq.x,y:tq.y};V47T.goalNPC=tq.npc||null;return true;}} if(q&&typeof q.x==='number'&&typeof q.y==='number'&&p?.worldMode&&!v36Inside?.()&&!V48X.active){ const cur=p.mapId||'thon',tr=regionAt(q.x,q.y); if(tr&&tr.id!==cur){const ci=V48T_CHAIN.indexOf(cur),ti=V48T_CHAIN.indexOf(tr.id); if(ci>=0&&ti>=0){const side=ti>ci?'next':'prev',gt=v48tGates(cur).find(g=>g.side===side); if(gt){message('Dẫn đường tới cổng · '+WORLD_MAPS[gt.to].name); V46_NO_NAV_CLEAR=true;let r;try{r=v48tSetGoalOld({x:gt.x,y:gt.y},null);}finally{V46_NO_NAV_CLEAR=false;} V46_NAV.active=true;V46_NAV.q=q;V46_NAV.target=target;return r;}}} else{const isGateRepath=V46_NAV.active&&v48tGates(cur).some(g=>Math.abs(g.x-q.x)<1&&Math.abs(g.y-q.y)<1); if(!isGateRepath){V46_NAV.active=false;V46_NAV.q=null;V46_NAV.target=null;}}} V46_NO_NAV_CLEAR=true;let r2;try{r2=v48tSetGoalOld(q,target);}finally{V46_NO_NAV_CLEAR=false;}return r2;};

// Dot2u — đánh dấu cổng dịch chuyển trên minimap/bản đồ.

// owMiniMap: định nghĩa duy nhất (gộp 7 lớp ở T06). Trong thôn (không phải bản to) → sơ đồ thôn V16; ngoài → atlas V16;
// sau đó V48 vẽ cổng qua vùng (đỏ = chưa vào được). Lưu ý: dấu nhiệm vụ (V12) và sự kiện giang hồ (V14) đã bị V16 tắt từ trước.
function owMiniMap(x,y,w,h,full=false){
  if(!full&&v16InTown(p.x,p.y,120))v16MapDraw(x,y,w,h,false);
  else owMiniMapAtlas(x,y,w,h,full);
  // T27 (chủ dự án duyệt 21/11): bật lại dấu nhiệm vụ đang theo dõi (V12) và sự kiện giang hồ đang diễn ra (V14) — trước bị V16 vô tình tắt.
  const q=v12Target(v12Tracked());
  if(q){const qx=x+q.x/OW.w*w,qy=y+q.y/OW.h*h;g.save();g.shadowColor='#ffe5a0';g.shadowBlur=5;diamond(g,qx,qy,full?8:5,'#fff2a5');g.restore();}
  if(p.v14)for(const e of p.v14.events.filter(e=>e.state==='active'))diamond(g,x+e.x/OW.w*w,y+e.y/OW.h*h,full?6:4,'#d5a7ff');
  if(!p?.worldMode)return;
  const sx=w/OW.w,sy=h/OW.h;
  for(const id of V48T_CHAIN)for(const gt of v48tGates(id)){
    const locked=!v46CanEnter(gt.to).ok;
    diamond(g,x+gt.x*sx,y+gt.y*sy,full?6:3.5,locked?'#e8a0a0':'#7df0d8');
  }
}
// Atlas thế giới mở của minimap (thân lớp V16, trước đây gán đè owMiniMap ở src/11_v16_v15.js).
function owMiniMapAtlas(x,y,w,h,full=false){const sx=w/OW.w,sy=h/OW.h,c=v15AtlasRaster();g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.imageSmoothingEnabled=true;g.drawImage(c,x,y,w,h);
 // Unexplored terrain is visible in outline; explored chunks recover their full color.
 for(let yy=0;yy<OW.h;yy+=OW.chunk)for(let xx=0;xx<OW.w;xx+=OW.chunk)if(!p.explored[Math.floor(xx/OW.chunk)+':'+Math.floor(yy/OW.chunk)]){g.fillStyle=full?'#14232b60':'#13222b7a';g.fillRect(x+xx*sx,y+yy*sy,OW.chunk*sx+.25,OW.chunk*sy+.25);}
 g.lineCap='round';g.strokeStyle='#a0d2cb';g.lineWidth=full?1.8:1;g.beginPath();for(let xx=0;xx<=OW.w;xx+=70){const yy=y+riverAt(xx)*sy;xx?g.lineTo(x+xx*sx,yy):g.moveTo(x+xx*sx,yy);}g.stroke();g.strokeStyle='#e0c895aa';g.lineWidth=full?1.5:.7;g.setLineDash(full?[4,3]:[]);for(const [aa,bb] of ROAD_EDGES){const r=REGIONS[aa],t=REGIONS[bb];g.beginPath();g.moveTo(x+r.x*sx,y+r.y*sy);g.lineTo(x+t.x*sx,y+t.y*sy);g.stroke();}g.setLineDash([]);
 if(full)for(const r of REGIONS){const px=x+r.x*sx,py=y+r.y*sy,seen=p.discovered.includes(r.id);v15Sprite('v15prop'+V15_MAP_ICON[r.id],px,py-1,39,1,seen?1:.70);circle(px,py,4,seen?r.accent:'#a6ac9f','#263740');box(px-71,py+7,142,20,seen?'#13292bbd':'#233039c0','',3);text(r.name,px,py+17,10,seen?'#f9e8c4':'#c1c9c0','center','bold');}
 for(const o of v8POIs()){if(!p.explored[Math.floor(o.x/OW.chunk)+':'+Math.floor(o.y/OW.chunk)])continue;const col=o.kind==='v14event'?'#d5a7ff':o.kind==='v13node'?'#abdb9e':V8_INFO[o.id]?'#f3d18e':o.kind==='dungeon'?'#bd93ec':'#e3c79a';diamond(g,x+o.x*sx,y+o.y*sy,full?2.7:1.6,col);}
 for(const e of p.v14?.events||[])if(e.state==='active')diamond(g,x+e.x*sx,y+e.y*sy,full?5:3,'#d8afff');
 const q=hdView();g.strokeStyle='#f7e8b8';g.lineWidth=full?1.5:1;g.strokeRect(x+q.x*sx,y+Math.max(0,q.y/HD.tilt)*sy,W/V11_ZOOM*sx,H/V11_ZOOM/HD.tilt*sy);circle(x+p.x*sx,y+p.y*sy,full?6:3.8,'#fff2b9','#253b3c');if(full){text('N',x+w-22,y+14,11,'#f6edc6','center','bold');hdPoly(g,[[x+w-22,y+24],[x+w-28,y+38],[x+w-22,y+34],[x+w-16,y+38]],'#f4dfb2');}g.restore();g.strokeStyle='#bda16b';g.lineWidth=1;g.strokeRect(x,y,w,h);}


// ==== V46.2 (Kế hoạch V46-V52) ====
// B01: id nhân vật ổn định (lưu trong save chính vdtt_vangioi_v3, tự sinh khi tạo mới
//      hoặc khi tải save cũ chưa có). Khóa lưu Khám phá gắn theo id này nên nhân vật
//      mới không kế thừa visited/claim của nhân vật khác.
function v46NewPlayerId(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);}
function v46ExplorerKey(){v46EnsurePlayerId();return 'VDTT_V48_explorer_'+(p?.playerId||'nochar');}
// B02/B05: một hàm duy nhất kiểm tra được vào vùng hay không (cấp V22_DATA + boss/điều
//      kiện WORLD_MAPS.req). Dùng chung ở cổng dịch chuyển, Khám phá, dẫn đường.
function v46CanEnter(id){const m=WORLD_MAPS[id];if(!m)return{ok:false,reason:'Vùng không tồn tại.'};
const min=(V22_DATA[id]&&V22_DATA[id][0])||1;
if((p?.level||1)<min)return{ok:false,reason:'Cần đạt cấp '+min+' để vào '+m.name+'.'};
const why=m.req?.();if(why)return{ok:false,reason:why};return{ok:true};}
// B04: ý định dẫn đường liên vùng — giữ đích thật (tọa độ OW + target nhiệm vụ) để
//      sau mỗi lần qua cổng thì tính lại đường ở map mới thay vì mất đích.
const V46_NAV={active:false,q:null,target:null};
// Sao lưu 1 lần bản lưu Khám phá dùng khóa toàn cục cũ (không gán cho nhân vật nào).
(function(){try{const old=localStorage.getItem('VDTT_V48_explorer');
if(old&&!localStorage.getItem('VDTT_V48_explorer_backup'))localStorage.setItem('VDTT_V48_explorer_backup',old);}catch(e){}})();

// ==== V46.3 (Báo cáo playtest V46.2 — vá B01-B07) ====
// B01: cổng Khám phá dùng chung v46CanEnter (sửa trong v48xGateOpen/v48xInteract).
// B02: reset V48X khi đổi nhân vật/không có save (v48xLoad + v48xReset).
// B03: playerId ở nhánh resume thế giới; v46ExplorerKey không còn fallback 'default'.
// B04: export/import gồm dữ liệu Khám phá; bỏ tự cộng linh thạch từ khóa cũ.
// B05: hủy dẫn đường (v8Cancel/WASD/ESC/đổi hồ sơ) xóa V46_NAV; cờ V46_NO_NAV_CLEAR bảo vệ khi đặt mục tiêu mới.
// B06: màu cổng/minimap dùng v46CanEnter (sửa trong v48tDrawGates/owMiniMap).
// B07: nhãn bản dùng BUILD_VERSION duy nhất.
const BUILD_VERSION='V47.1';
let V46_NO_NAV_CLEAR=false;
function v46EnsurePlayerId(){if(!p)return;if(!p.playerId)p.playerId=v46NewPlayerId();}
function v48xReset(){V48X.visited=['thon'];V48X.discovered={};V48X.stones=0;V48X.path=[];V48X.selected=null;V48X.mapId='thon';V48X.x=0;V48X.y=0;}
function v46ValidExplorer(x){
  if(!x||typeof x!=='object'||Array.isArray(x))return null;
  if(!Array.isArray(x.visited)||!x.visited.every(id=>typeof id==='string'&&REG[id]))return null;
  if(!x.discovered||typeof x.discovered!=='object'||Array.isArray(x.discovered))return null;
  for(const [id,nodes] of Object.entries(x.discovered)){
    if(!REG[id]||!Array.isArray(nodes)||!nodes.every(n=>typeof n==='string'))return null;
  }
  if(!Number.isFinite(x.stones)||x.stones<0||x.stones>1e9)return null;
  const mapId=(typeof x.mapId==='string'&&REG[x.mapId])?x.mapId:'thon';
  const pos=(x.position&&Number.isFinite(x.position.x)&&Number.isFinite(x.position.y))?{x:x.position.x,y:x.position.y}:null;
  return {mapId,position:pos,visited:[...x.visited],discovered:JSON.parse(JSON.stringify(x.discovered)),stones:x.stones};
}
// start_L15: lớp 48_v48_v47 (trước đây lưu lớp dưới vào v46StartOldW). Gọi lớp dưới: start_L14.
function start_L15(cls){V46_NAV.active=false;V46_NAV.q=null;V46_NAV.target=null;v48xReset();return start_L14(cls);}
// start: điểm vào duy nhất (T04). Thứ tự lớp: start_L15 → … → start_L00. Muốn đổi hành vi: sửa đúng lớp, KHÔNG gán đè start.
function start(...a){return start_L15(...a);}
// resume_L17: lớp 48_v48_v47 (trước đây lưu lớp dưới vào v46ResumeOldW). Gọi lớp dưới: resume_L16.
function resume_L17(){const r=resume_L16();V46_NAV.active=false;V46_NAV.q=null;V46_NAV.target=null;return r;}

// ==== V46.4 (Báo cáo playtest V46.3 — vá B09-B12; T05/T06 FAIL) ====
// B09: v42sExport lấy ID từ hồ sơ được xuất (v.data.p.playerId), không dùng nhân vật đang chơi.
// B10: v42sInstall ghi dữ liệu Khám phá + nhân vật đồng bộ trong cùng khối có bảo vệ, xác nhận bằng đọc lại, hoàn tác cả hai nếu ghi thất bại.
// B11: v42sValidate từ chối nhập khi dữ liệu khám phá có mặt nhưng không hợp lệ (thay vì âm thầm bỏ qua).
// B12: ESC mở Cài đặt gọi v8Cancel() — xóa cả đường di chuyển, mục tiêu và V46_NAV nên không còn tự chạy sau khi đóng Cài đặt.

/* ==== V47.0 pilot — Thanh Thach Thon as an independent map (kit registry) ====
   MapRegistry (V47_REGISTRY) is the kit's map_registry.json, compacted; unlock rules
   still come from V46.4 (v46CanEnter / WORLD_MAPS req), never from the registry's
   recommended levels. Only Thon has a live scene in this pilot; the other 9 regions
   stay in the OW world until their own V47 batches. The Thon scene is a self-contained
   mode like Exploration (V48X): own local coords 3200x2400, own update/draw/click,
   own gate + NPCs. Entry points: owEnter('thon'), v48tTravel to Thon, OW resume with
   mapId 'thon'. Exit: the NE gate -> OW Truc (v46CanEnter checked, V46_NAV resumed). */
const V47_REGISTRY={"thon":{"name":"Thanh Thạch Thôn","w":3200,"h":2400,"spawn":[1600,2064],"safe":true,"landmark":"Thanh Vân Đại Điện","gates":[{"id":"thon_to_truc","to":"truc","gate":"truc_to_thon","side":"NE","x":2688,"y":480,"ax":2560,"ay":608,"r":96}],"nodes":[{"id":"thon_poi_01","name":"Cổng thôn và điểm xuất phát","x":1600,"y":2064,"kind":"start"},{"id":"thon_poi_02","name":"Quảng trường đại điện","x":1600,"y":1248,"kind":"area"},{"id":"thon_poi_03","name":"Phố chợ, đan phòng, lò rèn","x":640,"y":1320,"kind":"area"},{"id":"thon_poi_04","name":"Hộ vệ đường và sân luyện","x":704,"y":552,"kind":"area"},{"id":"thon_poi_05","name":"Bờ sông, cầu đá","x":2304,"y":1344,"kind":"area"},{"id":"thon_poi_06","name":"Truyền tống trận","x":2688,"y":480,"kind":"gate"}],"edges":[["thon_poi_01","thon_poi_02"],["thon_poi_02","thon_poi_03"],["thon_poi_02","thon_poi_04"],["thon_poi_02","thon_poi_05"],["thon_poi_05","thon_poi_06"],["thon_poi_03","thon_poi_04"]],"palette":["#657755","#A99B7E","#3B7779","#CDBA89"]},"truc":{"name":"Thanh Trúc Lâm","w":4800,"h":3200,"spawn":[800,2432],"safe":false,"landmark":"Bia đá Thanh Vân","gates":[{"id":"truc_to_thon","to":"thon","gate":"thon_to_truc","side":"SW","x":672,"y":2560,"ax":800,"ay":2432,"r":96},{"id":"truc_to_yeu","to":"yeu","gate":"yeu_to_truc","side":"NE","x":4032,"y":640,"ax":3904,"ay":768,"r":96}],"nodes":[{"id":"truc_poi_01","name":"Cổng về thôn","x":672,"y":2560,"kind":"gate"},{"id":"truc_poi_02","name":"Lối trúc và cầu đá","x":1344,"y":1888,"kind":"area"},{"id":"truc_poi_03","name":"Thanh Vân cổ tự","x":1440,"y":736,"kind":"area"},{"id":"truc_poi_04","name":"Bãi yêu thú","x":2448,"y":1472,"kind":"area"},{"id":"truc_poi_05","name":"Vườn linh dược","x":3744,"y":2048,"kind":"area"},{"id":"truc_poi_06","name":"Cổng Vạn Yêu Sơn","x":4032,"y":640,"kind":"gate"}],"edges":[["truc_poi_01","truc_poi_02"],["truc_poi_02","truc_poi_03"],["truc_poi_02","truc_poi_04"],["truc_poi_03","truc_poi_05"],["truc_poi_04","truc_poi_05"],["truc_poi_05","truc_poi_06"],["truc_poi_03","truc_poi_06"]],"palette":["#617B53","#99B091","#587D73","#B9A47D"]},"yeu":{"name":"Vạn Yêu Sơn","w":4800,"h":3200,"spawn":[800,2432],"safe":false,"landmark":"Cổ kiếm Vạn Yêu","gates":[{"id":"yeu_to_truc","to":"truc","gate":"truc_to_yeu","side":"SW","x":672,"y":2560,"ax":800,"ay":2432,"r":96},{"id":"yeu_to_tram","to":"tram","gate":"tram_to_yeu","side":"NE","x":4032,"y":640,"ax":3904,"ay":768,"r":96}],"nodes":[{"id":"yeu_poi_01","name":"Đèo vào núi","x":672,"y":2560,"kind":"gate"},{"id":"yeu_poi_02","name":"Cổ kiếm trung tâm","x":2448,"y":1536,"kind":"area"},{"id":"yeu_poi_03","name":"Bãi chiến sườn núi","x":1536,"y":896,"kind":"area"},{"id":"yeu_poi_04","name":"Hang yêu thú","x":3696,"y":1376,"kind":"area"},{"id":"yeu_poi_05","name":"Phế đàn","x":3120,"y":2304,"kind":"area"},{"id":"yeu_poi_06","name":"Cổng Hắc Độc Trạch","x":4032,"y":640,"kind":"gate"}],"edges":[["yeu_poi_01","yeu_poi_02"],["yeu_poi_02","yeu_poi_03"],["yeu_poi_02","yeu_poi_04"],["yeu_poi_03","yeu_poi_05"],["yeu_poi_04","yeu_poi_05"],["yeu_poi_05","yeu_poi_06"]],"palette":["#8B7952","#5F6260","#B9975A","#777D61"]},"tram":{"name":"Hắc Độc Trạch","w":4800,"h":3200,"spawn":[800,2432],"safe":false,"landmark":"Dược Vương phế đàn","gates":[{"id":"tram_to_yeu","to":"yeu","gate":"yeu_to_tram","side":"SW","x":672,"y":2560,"ax":800,"ay":2432,"r":96},{"id":"tram_to_tuyet","to":"tuyet","gate":"tuyet_to_tram","side":"NE","x":4032,"y":640,"ax":3904,"ay":768,"r":96}],"nodes":[{"id":"tram_poi_01","name":"Bến cổng vào","x":672,"y":2560,"kind":"gate"},{"id":"tram_poi_02","name":"Cầu gỗ và đường đá","x":1680,"y":2112,"kind":"area"},{"id":"tram_poi_03","name":"Đảo dược phòng","x":1824,"y":768,"kind":"area"},{"id":"tram_poi_04","name":"Bãi chiến khô","x":2688,"y":1600,"kind":"area"},{"id":"tram_poi_05","name":"Hồ độc và linh dược","x":3648,"y":2112,"kind":"area"},{"id":"tram_poi_06","name":"Cổng Bắc Minh Tuyết Vực","x":4032,"y":640,"kind":"gate"}],"edges":[["tram_poi_01","tram_poi_02"],["tram_poi_02","tram_poi_03"],["tram_poi_02","tram_poi_04"],["tram_poi_03","tram_poi_05"],["tram_poi_04","tram_poi_05"],["tram_poi_05","tram_poi_06"]],"palette":["#4C5D39","#293B36","#8CA840","#78684A"]},"tuyet":{"name":"Bắc Minh Tuyết Vực","w":5120,"h":3840,"spawn":[844,2944],"safe":false,"landmark":"Hàn Băng Linh Tuyền","gates":[{"id":"tuyet_to_tram","to":"tram","gate":"tram_to_tuyet","side":"SW","x":716,"y":3072,"ax":844,"ay":2944,"r":96},{"id":"tuyet_to_hoa","to":"hoa","gate":"hoa_to_tuyet","side":"NE","x":4300,"y":768,"ax":4172,"ay":896,"r":96}],"nodes":[{"id":"tuyet_poi_01","name":"Cổng chân núi","x":716,"y":3072,"kind":"gate"},{"id":"tuyet_poi_02","name":"Sông băng và cầu đá","x":1382,"y":2265,"kind":"area"},{"id":"tuyet_poi_03","name":"Hàn Băng cổ điện","x":2457,"y":960,"kind":"area"},{"id":"tuyet_poi_04","name":"Sân tuyết chiến đấu","x":3225,"y":2073,"kind":"area"},{"id":"tuyet_poi_05","name":"Hàn tuyền, hang băng","x":3891,"y":2611,"kind":"area"},{"id":"tuyet_poi_06","name":"Cổng Xích Viêm Hoang Mạc","x":4300,"y":768,"kind":"gate"}],"edges":[["tuyet_poi_01","tuyet_poi_02"],["tuyet_poi_02","tuyet_poi_03"],["tuyet_poi_02","tuyet_poi_04"],["tuyet_poi_03","tuyet_poi_05"],["tuyet_poi_04","tuyet_poi_05"],["tuyet_poi_05","tuyet_poi_06"],["tuyet_poi_03","tuyet_poi_06"]],"palette":["#D5E2E2","#90B8CB","#638398","#C7A96A"]},"hoa":{"name":"Xích Viêm Hoang Mạc","w":5120,"h":3840,"spawn":[844,2944],"safe":false,"landmark":"Xích Viêm tế đàn","gates":[{"id":"hoa_to_tuyet","to":"tuyet","gate":"tuyet_to_hoa","side":"SW","x":716,"y":3072,"ax":844,"ay":2944,"r":96},{"id":"hoa_to_phong","to":"phong","gate":"phong_to_hoa","side":"NE","x":4300,"y":768,"ax":4172,"ay":896,"r":96}],"nodes":[{"id":"hoa_poi_01","name":"Cổng hẻm núi","x":716,"y":3072,"kind":"gate"},{"id":"hoa_poi_02","name":"Đường cồn cát","x":1587,"y":2380,"kind":"area"},{"id":"hoa_poi_03","name":"Tế đàn lửa","x":2560,"y":1459,"kind":"area"},{"id":"hoa_poi_04","name":"Phế tích vùi cát","x":1228,"y":844,"kind":"area"},{"id":"hoa_poi_05","name":"Giếng cạn và bãi chiến","x":3840,"y":2534,"kind":"area"},{"id":"hoa_poi_06","name":"Cổng Thiên Phong Cốc","x":4300,"y":768,"kind":"gate"}],"edges":[["hoa_poi_01","hoa_poi_02"],["hoa_poi_02","hoa_poi_03"],["hoa_poi_02","hoa_poi_04"],["hoa_poi_03","hoa_poi_05"],["hoa_poi_04","hoa_poi_05"],["hoa_poi_05","hoa_poi_06"],["hoa_poi_03","hoa_poi_06"]],"palette":["#B67647","#D3AF78","#9E4937","#593D34"]},"phong":{"name":"Thiên Phong Cốc","w":5120,"h":3840,"spawn":[844,2944],"safe":false,"landmark":"Thiên Phong Linh Đài","gates":[{"id":"phong_to_hoa","to":"hoa","gate":"hoa_to_phong","side":"SW","x":716,"y":3072,"ax":844,"ay":2944,"r":96},{"id":"phong_to_quy","to":"quy","gate":"quy_to_phong","side":"NE","x":4300,"y":768,"ax":4172,"ay":896,"r":96}],"nodes":[{"id":"phong_poi_01","name":"Cổng thung lũng","x":716,"y":3072,"kind":"gate"},{"id":"phong_poi_02","name":"Đường đá và cầu treo","x":1945,"y":2112,"kind":"area"},{"id":"phong_poi_03","name":"Linh đài phong hệ","x":2560,"y":883,"kind":"area"},{"id":"phong_poi_04","name":"Bãi luyện trên cao","x":3584,"y":2726,"kind":"area"},{"id":"phong_poi_05","name":"Vòm đá và vực gió","x":4147,"y":1689,"kind":"area"},{"id":"phong_poi_06","name":"Cổng U Minh Quỷ Vực","x":4300,"y":768,"kind":"gate"}],"edges":[["phong_poi_01","phong_poi_02"],["phong_poi_02","phong_poi_03"],["phong_poi_02","phong_poi_04"],["phong_poi_03","phong_poi_05"],["phong_poi_04","phong_poi_05"],["phong_poi_05","phong_poi_06"],["phong_poi_03","phong_poi_06"]],"palette":["#8FAD91","#B5B6A2","#6D9898","#788482"]},"quy":{"name":"U Minh Quỷ Vực","w":5120,"h":3840,"spawn":[844,2944],"safe":false,"landmark":"Trấn Hồn cổ mộ","gates":[{"id":"quy_to_phong","to":"phong","gate":"phong_to_quy","side":"SW","x":716,"y":3072,"ax":844,"ay":2944,"r":96},{"id":"quy_to_ma","to":"ma","gate":"ma_to_quy","side":"NE","x":4300,"y":768,"ax":4172,"ay":896,"r":96}],"nodes":[{"id":"quy_poi_01","name":"Cổng âm giới","x":716,"y":3072,"kind":"gate"},{"id":"quy_poi_02","name":"Đường bia mộ","x":1331,"y":2265,"kind":"area"},{"id":"quy_poi_03","name":"Trấn Hồn tế đàn","x":2662,"y":1766,"kind":"area"},{"id":"quy_poi_04","name":"Bãi chiến cổ mộ","x":3584,"y":2457,"kind":"area"},{"id":"quy_poi_05","name":"Cửa hầm mộ","x":1740,"y":921,"kind":"area"},{"id":"quy_poi_06","name":"Cổng Ma Vực","x":4300,"y":768,"kind":"gate"}],"edges":[["quy_poi_01","quy_poi_02"],["quy_poi_02","quy_poi_03"],["quy_poi_02","quy_poi_04"],["quy_poi_03","quy_poi_05"],["quy_poi_04","quy_poi_05"],["quy_poi_05","quy_poi_06"],["quy_poi_03","quy_poi_06"]],"palette":["#4B6673","#293439","#79BBAC","#7E8A88"]},"ma":{"name":"Ma Vực","w":5760,"h":4096,"spawn":[934,3148],"safe":false,"landmark":"Ma Môn cổ đồng","gates":[{"id":"ma_to_quy","to":"quy","gate":"quy_to_ma","side":"SW","x":806,"y":3276,"ax":934,"ay":3148,"r":96},{"id":"ma_to_loi","to":"loi","gate":"loi_to_ma","side":"NE","x":4838,"y":819,"ax":4710,"ay":947,"r":96}],"nodes":[{"id":"ma_poi_01","name":"Cổng cảnh giới","x":806,"y":3276,"kind":"gate"},{"id":"ma_poi_02","name":"Đường đá đen","x":1900,"y":2334,"kind":"area"},{"id":"ma_poi_03","name":"Ma môn nghi lễ","x":2880,"y":1228,"kind":"area"},{"id":"ma_poi_04","name":"Bãi chiến bazan","x":3859,"y":2416,"kind":"area"},{"id":"ma_poi_05","name":"Khe vực và phế tích","x":4550,"y":2908,"kind":"area"},{"id":"ma_poi_06","name":"Cổng Tử Lôi Hoang Nguyên","x":4838,"y":819,"kind":"gate"}],"edges":[["ma_poi_01","ma_poi_02"],["ma_poi_02","ma_poi_03"],["ma_poi_02","ma_poi_04"],["ma_poi_03","ma_poi_05"],["ma_poi_04","ma_poi_05"],["ma_poi_05","ma_poi_06"]],"palette":["#303039","#57495D","#356F71","#854246"]},"loi":{"name":"Tử Lôi Hoang Nguyên","w":5760,"h":4096,"spawn":[934,3148],"safe":false,"landmark":"Tử Lôi Thần Tích","gates":[{"id":"loi_to_ma","to":"ma","gate":"ma_to_loi","side":"SW","x":806,"y":3276,"ax":934,"ay":3148,"r":96}],"nodes":[{"id":"loi_poi_01","name":"Cổng từ Ma Vực","x":806,"y":3276,"kind":"gate"},{"id":"loi_poi_02","name":"Đường bình nguyên","x":1555,"y":2293,"kind":"area"},{"id":"loi_poi_03","name":"Tháp lôi và thần tích","x":2764,"y":983,"kind":"area"},{"id":"loi_poi_04","name":"Lôi kiếp đàn rộng","x":3340,"y":2252,"kind":"area"},{"id":"loi_poi_05","name":"Phế tháp và tinh thạch","x":4377,"y":2703,"kind":"area"},{"id":"loi_poi_06","name":"Cổng dự trữ chương sau","x":4838,"y":819,"kind":"area"}],"edges":[["loi_poi_01","loi_poi_02"],["loi_poi_02","loi_poi_03"],["loi_poi_02","loi_poi_04"],["loi_poi_03","loi_poi_05"],["loi_poi_04","loi_poi_05"],["loi_poi_05","loi_poi_06"],["loi_poi_03","loi_poi_06"]],"palette":["#716C88","#4E506C","#A5B6CA","#B49D72"]}};
const V47T_MAP=V47_REGISTRY.thon;
const V47T_OBSTACLES=[{x:1600,y:1000,r:120},{x:640,y:1180,r:90},{x:704,y:400,r:90}];
const V47T_NPCS=[
 {id:'inn',name:'Trưởng lão Thanh Thạch',x:1600,y:1400,kind:'npc'},
 {id:'shop',name:'Thương nhân Linh Dược',x:640,y:1420,kind:'shop'}];
const V47T_OW_NPC={inn:{x:850,y:795},shop:{x:1020,y:1010}};
const V47T={active:false,x:1600,y:2064,goal:null,goalNPC:null,cam:{x:0,y:0},clock:0,dir:'S',flip:false,moving:false,frame:0,saveT:0};
function v47tBlocked(x,y,r){const m=V47T_MAP;if(x<r||x>m.w-r||y<r||y>m.h-r)return true;for(const o of V47T_OBSTACLES)if(Math.hypot(x-o.x,y-o.y)<o.r+r)return true;return false;}
function v47tEnter(x,y,fromGate){
  let sx,sy;
  if(fromGate){sx=V47T_MAP.gates[0].ax;sy=V47T_MAP.gates[0].ay;}
  else if(Number.isFinite(x)&&Number.isFinite(y)&&!v47tBlocked(x,y,28)){sx=x;sy=y;}
  else{sx=V47T_MAP.spawn[0];sy=V47T_MAP.spawn[1];}
  V47T.active=true;V47T.x=sx;V47T.y=sy;V47T.goal=null;V47T.goalNPC=null;V47T.saveT=0;
  V47T.cam={x:clamp(sx-W/2,0,V47T_MAP.w-W),y:clamp(sy-H/2,0,V47T_MAP.h-H)};
  equipInit();
  p.worldMode=true;p.mapId='thon';worldMap='thon';owRegion='thon';
  p.x=sx;p.y=sy;p.vx=0;p.vy=0;p.dashT=0;p.attackT=0;p.castT=0;p.hurt=0;p.poisonT=0;p.fireT=0;
  enemies=[];drops=[];bolts=[];fx=[];numbers=[];modal=null;cleared=false;
  V8.route=[];V8.goal=null;V8.target=null;V8.vx=0;V8.vy=0;V8.stuck=0;V8.lastDist=Infinity;
  mode='play';failed=false;worldTitle=3.5;
  message('Thanh Thạch Thôn · '+V47T_MAP.landmark);
}
function v47tExit(){
  const chk=v46CanEnter('truc');if(!chk.ok){message(chk.reason);return;}
  V47T.active=false;V47T.goal=null;V47T.goalNPC=null;
  owEnter('truc');
  const b=v48tBounds('truc');p.x=b.x+90;p.y=b.cy;
  owCamera.x=clamp(p.x-W/2,b.x,Math.max(b.x,b.x+b.w-W));
  owCamera.y=clamp(p.y-H/2,b.y,Math.max(b.y,b.y+b.h-H));
  worldTitle=3.5;message(WORLD_MAPS.truc.name+' · '+WORLD_MAPS.truc.sub);save();
  V8.route=[];V8.goal=null;V8.target=null;V8.vx=0;V8.vy=0;V8.stuck=0;V8.lastDist=Infinity;
  if(V46_NAV.active&&V46_NAV.q){const nq=V46_NAV.q,nt=V46_NAV.target;V46_NAV.active=false;V46_NAV.q=null;V46_NAV.target=null;v8SetGoal(nq,nt);}
}
function v47tInteractNPC(n){
  if(n.kind==='npc'){message('Trưởng lão: Hạ Trúc Lang Vương, đạt Trúc Cơ rồi khám phá Vạn Giới Bí Cảnh.');return;}
  if(n.kind==='shop'){if(p.stones<5){message('Hồi Xuân Đan cần 5 linh thạch.');return;}p.stones-=5;p.pills+=2;message('Đổi 5 linh thạch lấy 2 Hồi Xuân Đan');save();return;}
}
function v47tInteract(){
  const gt=V47T_MAP.gates[0];
  if(Math.hypot(V47T.x-gt.x,V47T.y-gt.y)<gt.r+40){v47tExit();return;}
  let best=null,bd=113;
  for(const n of V47T_NPCS){const d=Math.hypot(V47T.x-n.x,V47T.y-n.y);if(d<bd){best=n;bd=d;}}
  if(!best){message('Hãy tới gần trưởng lão, thương nhân hoặc cổng truyền tống.');return;}
  v47tInteractNPC(best);
}
function v47tMapGoal(q,target){
  const tid=target&&target.id;
  for(const n of V47T_NPCS){
    const ow=V47T_OW_NPC[n.id];
    if(tid===n.id||(ow&&Math.hypot(q.x-ow.x,q.y-ow.y)<220))return{x:n.x,y:n.y,npc:n.id};
  }
  const gt=V47T_MAP.gates[0];
  return{x:gt.x,y:gt.y,gate:true};
}
function v47tClick(){
  if(!V47T.active)return;
  const q={x:V47T.cam.x+mouse.x,y:V47T.cam.y+mouse.y};
  if(q.x<0||q.x>V47T_MAP.w||q.y<0||q.y>V47T_MAP.h)return;
  const gt=V47T_MAP.gates[0];
  if(Math.hypot(q.x-gt.x,q.y-gt.y)<gt.r+30){V47T.goal={x:gt.x,y:gt.y};V47T.goalNPC=null;return;}
  let best=null,bd=60;
  for(const n of V47T_NPCS){const d=Math.hypot(q.x-n.x,q.y-n.y);if(d<bd){best=n;bd=d;}}
  if(best){V47T.goal={x:best.x,y:best.y};V47T.goalNPC=best.id;return;}
  if(!v47tBlocked(q.x,q.y,28)){V47T.goal={x:q.x,y:q.y};V47T.goalNPC=null;}
}
function v47tUpdate(dt){
  worldTitle=Math.max(0,worldTitle-dt);
  V47T.clock+=dt;
  if(pressed.Escape){delete pressed.Escape;if(modal){modal=null;}else{v8Cancel();V47T.goal=null;V47T.goalNPC=null;openPanel('settings');}return;}
  if(modal)return;
  if(pressed.KeyE){delete pressed.KeyE;v47tInteract();}
  let dx=0,dy=0;
  if(V47T.goal){
    const gx=V47T.goal.x-V47T.x,gy=V47T.goal.y-V47T.y,d=Math.hypot(gx,gy);
    if(d<44){V47T.goal=null;const npcId=V47T.goalNPC;V47T.goalNPC=null;if(npcId){const n=V47T_NPCS.find(n=>n.id===npcId);if(n)v47tInteractNPC(n);}}
    else{dx=gx/d;dy=gy/d;}
  }else{
    dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
    dy=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);
    if(dx||dy){const k=Math.hypot(dx,dy);dx/=k;dy/=k;}
  }
  const old={x:V47T.x,y:V47T.y};
  if(dx||dy){
    const step=240*dt;
    const nx=V47T.x+dx*step,ny=V47T.y+dy*step;
    if(!v47tBlocked(nx,V47T.y,28))V47T.x=nx;
    if(!v47tBlocked(V47T.x,ny,28))V47T.y=ny;
    p.x=V47T.x;p.y=V47T.y;
  }
  V47T.moving=Math.hypot(V47T.x-old.x,V47T.y-old.y)>.04;
  if(V47T.moving){const ddx=V47T.x-old.x,ddy=V47T.y-old.y;V47T.flip=ddx<0;V47T.dir=Math.abs(ddx)<Math.abs(ddy)*.45?(ddy<0?'N':'S'):(ddy<0?'NE':'SE');V47T.frame=(V47T.frame+dt*24)%12;}else V47T.frame=(V47T.frame+dt*6)%12;
  V47T.cam.x=clamp(V47T.x-W/2,0,V47T_MAP.w-W);
  V47T.cam.y=clamp(V47T.y-H/2,0,V47T_MAP.h-H);
  V47T.saveT+=dt;if(V47T.saveT>6){V47T.saveT=0;save();}
}
function v47tDrawHero(){
  const spriteKey=V47T.moving?({N:'v48runBN',NE:'v48runBNE',S:'v48runBS',SE:'v48runBSE'}[V47T.dir]||'v48runBS'):'v48idle';
  const sp=imgs[spriteKey];
  const idx=V47T.moving?Math.floor(V47T.frame)%12:Math.floor(V47T.frame)%6,cols=V47T.moving?4:3;
  g.save();g.translate(V47T.x,V47T.y);
  g.fillStyle='#10101488';g.beginPath();g.ellipse(0,1,14,6,0,0,TAU);g.fill();
  g.strokeStyle='#dce8bbab';g.lineWidth=1.2;g.beginPath();g.ellipse(0,0,10,4.4,0,0,TAU);g.stroke();
  if(sp&&sp.ready){if(V47T.moving&&V47T.flip)g.scale(-1,1);const size=64;g.drawImage(sp.img,(idx%cols)*256,Math.floor(idx/cols)*256,256,256,-size/2,-size*224/256,size,size);}
  else{g.fillStyle='#eee4bc';g.beginPath();g.arc(0,-10,7,0,TAU);g.fill();}
  g.restore();
}
function v47tDraw(){
  g.save();
  g.fillStyle='#162622';g.fillRect(0,0,W,H);
  const cam=V47T.cam;
  const gt=V47T_MAP.gates[0];
  const gk=v46CanEnter(gt.to);
  g.save();g.translate(-cam.x,-cam.y);
  const art=imgs['v47thon'];
  if(art&&art.ready){g.drawImage(art.img,0,300,3200,1800);}
  else{g.fillStyle='#253d35';g.fillRect(0,300,3200,1800);}
  const nodes={};for(const n of V47T_MAP.nodes)nodes[n.id]=n;
  g.lineCap='round';g.lineWidth=30;g.strokeStyle='rgba(205,186,137,.5)';
  for(const e of V47T_MAP.edges){const A=nodes[e[0]],B=nodes[e[1]];g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();}
  g.lineWidth=22;g.strokeStyle='rgba(240,230,210,.45)';
  for(const e of V47T_MAP.edges){const A=nodes[e[0]],B=nodes[e[1]];g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();}
  for(const o of V47T_OBSTACLES){g.fillStyle='rgba(16,30,28,.5)';g.beginPath();g.arc(o.x,o.y,o.r,0,TAU);g.fill();g.strokeStyle='rgba(205,186,137,.35)';g.lineWidth=2;g.stroke();}
  const col=gk.ok?'#7df0d8':'#e8a0a0';
  const pulse=1+Math.sin(V47T.clock*3)*.12;
  g.save();g.translate(gt.x,gt.y);
  const beam=g.createLinearGradient(0,-260,0,0);
  beam.addColorStop(0,'rgba(125,240,216,0)');beam.addColorStop(1,gk.ok?'rgba(125,240,216,.55)':'rgba(232,160,160,.5)');
  g.fillStyle=beam;g.fillRect(-14,-260,28,260);
  g.fillStyle=gk.ok?'rgba(125,240,216,.18)':'rgba(232,160,160,.15)';
  g.beginPath();g.ellipse(0,0,70*pulse,26*pulse,0,0,TAU);g.fill();
  g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.ellipse(0,0,44*pulse,20*pulse,0,0,TAU);g.stroke();
  g.fillStyle=col;g.beginPath();g.arc(0,-40,7,0,TAU);g.fill();
  g.restore();
  for(const n of V47T_NPCS){
    g.fillStyle=n.kind==='npc'?'#e8c98b':'#79e3a5';
    g.beginPath();g.arc(n.x,n.y,16,0,TAU);g.fill();
    g.strokeStyle='#101014';g.lineWidth=2;g.stroke();
    g.fillStyle='#f2e5c9';g.font='bold 15px sans-serif';g.textAlign='center';
    g.fillText(n.name,n.x,n.y-26);
  }
  v47tDrawHero();
  if(V47T.goal){g.strokeStyle='#e8c98b';g.lineWidth=2;g.beginPath();g.arc(V47T.goal.x,V47T.goal.y,12,0,TAU);g.stroke();}
  g.restore();
  g.save();
  g.fillStyle='rgba(16,34,34,.72)';g.fillRect(0,0,W,54);
  g.fillStyle='#f2e5c9';g.font='bold 20px sans-serif';g.textAlign='left';
  g.fillText('Thanh Thạch Thôn · '+V47T_MAP.landmark,16,34);
  g.font='15px sans-serif';g.textAlign='right';
  g.fillText('Cấp '+(p&&p.level||1)+' · '+(p&&p.stones||0)+' linh thạch',W-16,33);
  const dGate=Math.hypot(V47T.x-gt.x,V47T.y-gt.y);
  if(dGate<gt.r+120){
    const label=gk.ok?'Nhấn E · Tới Thanh Trúc Lâm':'Khóa · '+gk.reason;
    g.font='bold 16px sans-serif';g.textAlign='center';
    const tw=g.measureText(label).width;
    g.fillStyle='rgba(16,34,34,.85)';g.fillRect(W/2-tw/2-14,H-64,tw+28,36);
    g.strokeStyle='#9A8054';g.lineWidth=1.5;g.strokeRect(W/2-tw/2-14,H-64,tw+28,36);
    g.fillStyle=gk.ok?'#7df0d8':'#e8a0a0';g.fillText(label,W/2,H-40);
  }
  if(worldTitle>0){
    const a=clamp((3.5-worldTitle)*4,0,1)*clamp(worldTitle,0,1);
    g.globalAlpha=a;g.textAlign='center';
    g.fillStyle='#f2e5c9';g.font='bold 34px sans-serif';
    g.fillText('Thanh Thạch Thôn',W/2,110);
    g.font='17px sans-serif';g.fillStyle='#cdba89';
    g.fillText(V47T_MAP.landmark,W/2,140);
    g.globalAlpha=1;
  }
  g.restore();
  g.restore();
}

/* V47.1 — đồng bộ HUD, bản đồ thôn, trạng thái nhân vật. */
// Re-anchor the local scene to the actual painted ground, not the old abstract blockout.
const v471Point=(x,y)=>({x:x*3200/1100,y:y*1800/619});
const V471_NODES=[['inn','Đại điện · Trưởng lão',457,217],['shop','Thương nhân',249,286],['herbalist','Đan phòng',312,247],['wanderer','Tán tu',580,380],['sentry','Hộ vệ đường',915,317],['v13_forge','Lò rèn',176,351],['v13_market','Chợ linh vật',340,429],['v13_board','Bảng ủy thác',520,270],['v13_farm','Linh điền',730,493],['training','Sân luyện',890,348],['v31_cave','Động phủ',630,250]].map(([id,name,x,y])=>({id,name,...v471Point(x,y)}));
V47T_MAP.h=1800;const V471_SPAWN=v471Point(231,559);V47T_MAP.spawn=[V471_SPAWN.x,V471_SPAWN.y];Object.assign(V47T_MAP.gates[0],v471Point(993,205),{ax:v471Point(951,222).x,ay:v471Point(951,222).y});
// Walk corridors trace visible paving, bridges and stairs. No solid water or roof tiles.
const V471_PATHS=[[[231,559],[171,510],[175,446],[198,398],[275,401],[340,429],[385,427],[415,357],[420,280],[457,217]],[[420,280],[312,247],[249,286],[176,351],[198,398]],[[415,357],[530,366],[580,380]],[[420,280],[520,270],[630,250],[710,268],[777,258],[820,265],[900,240],[951,222],[993,205]],[[900,240],[907,279],[915,317],[890,348]],[[385,427],[450,457],[503,476],[558,478],[640,489],[730,493]]];
const V471_SEG=[];for(const path of V471_PATHS)for(let i=1;i<path.length;i++)V471_SEG.push({a:v471Point(...path[i-1]),b:v471Point(...path[i]),w:67});
v47tBlocked=function(x,y,r=28){if(x<r||y<r||x>3200-r||y>1800-r)return true;return !V471_SEG.some(e=>dist({x,y},v48xProj({x,y},e.a,e.b))<=e.w);};
function v471Snap(q){let best=null;for(const e of V471_SEG){const z=v48xProj(q,e.a,e.b),d=dist(q,z);if(!best||d<best.d)best={...z,d};}return best;}
function v47tIsActive(){return !!(p&&mode==='play'&&p.worldMode&&p.mapId==='thon'&&V47T.active&&!V48X.active&&!v36Inside());}
function v471Near(radius=95){return V471_NODES.filter(n=>dist(n,V47T)<radius).sort((a,b)=>dist(a,V47T)-dist(b,V47T))[0]||null;}
function v471Legacy(n){return V36_BY_ID[n.id]?v36Door(V36_BY_ID[n.id]):v8POIs().find(o=>o.id===n.id)||(n.id==='training'?v42tZone():null);}
function v471Sync(){if(!p||p.mapId!=='thon')return;const b=V16_BOUNDS,n=v471Near(),o=n&&v471Legacy(n);p.v47TownPos={x:V47T.x,y:V47T.y};p.x=o?o.x:b.x+b.w*clamp(V47T.x/3200,.12,.88);p.y=o?o.y:b.y+b.h*clamp(V47T.y/1800,.12,.88);p.v9Facing=V47T.facing??2;V8.dir=p.v9Facing;}
const v471EnterOld=v47tEnter;
v47tEnter=function(x,y,fromGate=false,restoring=false){
 const saved=p.v47TownPos,inside=restoring?p.v36Inside:null;
 if(restoring){if(Number.isFinite(saved?.x)&&Number.isFinite(saved?.y)){x=saved.x;y=saved.y;}else{x=y=null;}}if(Number.isFinite(x)&&Number.isFinite(y)&&v47tBlocked(x,y)){const q=v471Snap({x,y});x=q.x;y=q.y;}
 const dir=Number.isInteger(p.v9Facing)?p.v9Facing:2;
 V48X.active=false;v471EnterOld(x,y,fromGate);owInit();WORLD=OW.w;p.v36Inside=inside||null;
 V47T.facing=dir;V47T.moving=false;V47T.frame=0;V47T.stuck=0;V47T.path=[];V47T.clock=0;V47T.dir=['E','SE','S','SW','W','NW','N','NE'][dir];
 if(!p.discovered.includes('thon'))p.discovered.push('thon');v471Sync();owDiscover();
};
const v471CancelOld=v8Cancel;
v8Cancel=function(){v471CancelOld();V47T.goal=null;V47T.goalNPC=null;V47T.path=[];V47T.stuck=0;};
function v471Route(q,npc=null){
 if(!q||v47tBlocked(q.x,q.y,28))return false;V47T.goal={x:q.x,y:q.y};V47T.goalNPC=npc;V47T.path=[];V47T.stuck=0;
 const a={x:V47T.x,y:V47T.y},v=[a,V47T.goal];for(const e of V471_SEG)v.push(e.a,e.b);v.push(v471Snap(a),v471Snap(q));
 const clear=(a,b)=>{const n=Math.max(1,Math.ceil(dist(a,b)/24));for(let i=0;i<=n;i++)if(v47tBlocked(a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n))return false;return true;};
 const d=v.map(()=>Infinity),prev=v.map(()=>-1),used=new Set();d[0]=0;for(let i=0;i<v.length;i++){let u=-1;for(let j=0;j<v.length;j++)if(!used.has(j)&&(u<0||d[j]<d[u]))u=j;if(u<0||!Number.isFinite(d[u]))break;if(u===1)break;used.add(u);for(let j=1;j<v.length;j++)if(!used.has(j)&&clear(v[u],v[j])){const nd=d[u]+dist(v[u],v[j]);if(nd<d[j]){d[j]=nd;prev[j]=u;}}}
 if(!Number.isFinite(d[1])){V47T.goal=null;V47T.goalNPC=null;message('Không tìm được lối đi.');return false;}for(let i=1;i>0;i=prev[i])V47T.path.unshift(v[i]);return true;
}
v47tMapGoal=function(q,target){const n=V471_NODES.find(n=>n.id===(target?.id||q.id));if(n)return {...n,npc:n.id};if(regionAt(q.x,q.y).id!=='thon'){const z=V47T_MAP.gates[0];return {x:z.x,y:z.y,gate:true};}const b=V16_BOUNDS;return v471Snap({x:clamp((q.x-b.x)/b.w*3200,40,3160),y:clamp((q.y-b.y)/b.h*1800,40,1760)});};
const v471SetGoalOld=v8SetGoal;
v8SetGoal=function(q,target=null){if(!v47tIsActive())return v471SetGoalOld(q,target);const t=v47tMapGoal(q,target);v8Cancel();if(!v471Route(t,t.npc||null))return false;if(t.gate){V46_NAV.active=true;V46_NAV.q=q;V46_NAV.target=target;}return true;};
const v471LeaveOld=v36Leave;
v36Leave=function(){const a=v36Inside();const r=v471LeaveOld();if(a&&p?.mapId==='thon'&&!v36Inside()){const n=V471_NODES.find(n=>n.id===a.id);if(n){v47tEnter(n.x,n.y+22);save();}}return r;};
const v471TrainOld=v42tOpen;let V471_TRAIN_OWNER=null;
v42tOpen=function(){if(!v47tIsActive())return v471TrainOld();const n=V471_NODES.find(n=>n.id==='training');if(dist(n,V47T)>90){v8Cancel();v471Route(n,n.id);message('Đang đến sân luyện.');return true;}const z=v42tZone();if(!z)return false;v471Sync();V47T.active=false;V47T.goal=null;V47T.path=[];p.x=z.x;p.y=z.y;owCamera={x:p.x-W/2,y:p.y-H/2};const r=v471TrainOld();if(v42tActive())V471_TRAIN_OWNER=p;else v47tEnter(n.x,n.y);return r;};
const v471TrainStopOld=v42tStop;v42tStop=function(say=true){const back=say&&V471_TRAIN_OWNER===p&&p?.mapId==='thon'&&mode==='play';const r=v471TrainStopOld(say);V471_TRAIN_OWNER=null;if(back){const n=V471_NODES.find(n=>n.id==='training');v47tEnter(n.x,n.y);save();}return r;};
v47tInteractNPC=function(n){if(n.id==='training')return v42tOpen();const o=v471Legacy(n);if(!o){message('Địa điểm chưa mở.');return;}p.x=o.x;p.y=o.y;p.v47TownPos={x:V47T.x,y:V47T.y};v8InteractAt(o);};
v47tInteract=function(){const gate=V47T_MAP.gates[0];if(dist(gate,V47T)<gate.r+40){v47tExit();return;}const n=v471Near();if(n)v47tInteractNPC(n);else message('Tiến đến công trình hoặc cổng truyền tống để tương tác.');};
v47tClick=function(){if(!v47tIsActive()||modal)return;const q={x:mouse.x+V47T.cam.x,y:mouse.y+V47T.cam.y};const gt=V47T_MAP.gates[0],n=V471_NODES.find(n=>dist(n,q)<50);v8Cancel();if(n){if(dist(n,V47T)<95)v47tInteractNPC(n);else v471Route(n,n.id);}else if(dist(gt,q)<gt.r+30)v471Route(gt);else v471Route(q);};
v47tUpdate=function(dt){
 elapsed+=dt;notifyT=Math.max(0,notifyT-dt);worldTitle=Math.max(0,worldTitle-dt);V47T.clock+=dt;
 if(pressed.Escape){delete pressed.Escape;v8Cancel();if(modal)modal=null;else openPanel('settings');return;}
 if(pressed.KeyC)v10Open();if(pressed.KeyI||pressed.Tab)openPanel('inventory');if(pressed.KeyG)openPanel('gear');if(pressed.KeyM)openPanel('map');
 if(modal){v8Cancel();V47T.moving=false;return;}if(pressed.KeyE){delete pressed.KeyE;v47tInteract();if(!v47tIsActive()||modal)return;}
 const s=currentStats();p.mp=Math.min(s.mp,p.mp+s.regen*dt);p.hp=Math.min(s.hp,p.hp);for(const k of ['atkCd','dashCd','attackT','castT','hurt','poisonT','fireT'])p[k]=Math.max(0,(p[k]||0)-dt);
 let dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),dy=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);const manual=!!(dx||dy),old={x:V47T.x,y:V47T.y};
 if(manual&&V47T.goal)v8Cancel();if(!manual&&V47T.goal){if(!V47T.path?.length){const target=V47T.goal,npc=V47T.goalNPC;v471Route(target,npc);}let q=V47T.path?.[0];if(q&&dist(q,V47T)<12){V47T.path.shift();q=V47T.path[0];}if(q){dx=q.x-V47T.x;dy=q.y-V47T.y;}else if(V47T.goal){const id=V47T.goalNPC;V47T.goal=null;V47T.goalNPC=null;const n=V471_NODES.find(n=>n.id===id);if(n)v47tInteractNPC(n);if(!v47tIsActive()||modal)return;}}
 const len=Math.hypot(dx,dy);if(len){const step=Math.min(240*dt,manual?Infinity:len);const nx=V47T.x+dx/len*step,ny=V47T.y+dy/len*step;if(!v47tBlocked(nx,V47T.y,28))V47T.x=nx;if(!v47tBlocked(V47T.x,ny,28))V47T.y=ny;}
 const was=V47T.moving,ddx=V47T.x-old.x,ddy=V47T.y-old.y;V47T.moving=Math.hypot(ddx,ddy)>.04;if(V47T.moving){V47T.facing=v9Dir(ddx,ddy,V47T.facing??2,false,0);V47T.dir=['E','SE','S','SW','W','NW','N','NE'][V47T.facing];V47T.frame=was?(V47T.frame+dt*24)%12:0;V47T.stuck=0;}else{V47T.frame=0;if(V47T.goal&&(V47T.stuck+=dt)>1){v8Cancel();message('Lối đi bị chặn. Hãy chọn hướng khác.');}}
 v471Sync();V47T.cam.x=clamp(V47T.x-W/2,0,V47T_MAP.w-W);V47T.cam.y=clamp(V47T.y-H/2,0,V47T_MAP.h-H);V47T.saveT+=dt;if(V47T.saveT>6){V47T.saveT=0;save();}
};
function v471Hero(a,size){const dir=a.facing??2,cls=p.cls,sz=size,phase=a.frame||0;v41aGroundShadow(a.x,a.y,sz*.19,sz*.065);let ok;if(!a.moving)ok=v25Idle(cls,dir,a.x,a.y,sz);else if(cls===0)ok=v25Cell('v25run'+V25_DIR[dir],Math.floor(phase)%12,4,3,a.x,a.y,sz,V9_FLIP[dir]);else if(dir===0||dir===4)ok=v25Cell('v25run'+(cls===1?'B':'M'),Math.floor(phase)%12,4,3,a.x,a.y,sz,V9_FLIP[dir]);else ok=v41aRigCell(cls,dir,a.x,a.y,sz,{phase,blend:1,lean:0});if(!ok)v25Idle(cls,dir,a.x,a.y,sz);}
v47tDrawHero=function(){v471Hero(V47T,110);};v48xDrawHero=function(){v471Hero(V48X,42);};
const v471ExploreUpdate=v48xUpdate;v48xUpdate=function(dt){const x=V48X.x,y=V48X.y,id=V48X.mapId,was=V48X.moving;v471ExploreUpdate(dt);if(!V48X.active||id!==V48X.mapId){V48X.facing=2;V48X.frame=0;return;}if(V48X.moving){V48X.facing=v9Dir(V48X.x-x,V48X.y-y,V48X.facing??2,false,0);if(!was)V48X.frame=0;}else V48X.frame=0;};
const v471ExploreEnter=v48xEnter;v48xEnter=function(...args){const r=v471ExploreEnter(...args);V48X.facing=p?.v9Facing??2;V48X.frame=0;V48X.moving=false;buttons=[];return r;};
const v471WarmOld=v42PerfWarmupTick;v42PerfWarmupTick=function(now){if(v47tIsActive()||V48X.active){const w=V42_PERF.warm;w.active=false;w.inWorld=false;w.queue=[];return false;}return v471WarmOld(now);};
// update_L32: lớp 48_v48_v47 (trước đây lưu lớp dưới vào v471UpdateOld). Gọi lớp dưới: update_L31.
function update_L32(dt){if(V48X.active&&mode==='play'){v48xUpdate(dt);return;}update_L31(dt);if(v47tIsActive())v471Sync();}
// update: điểm vào duy nhất (T04). Thứ tự lớp: update_L32 → … → update_L00. Muốn đổi hành vi: sửa đúng lớp, KHÔNG gán đè update.
function update(...a){return update_L32(...a);}
// resume_L18: lớp 48_v48_v47 (trước đây lưu lớp dưới vào v471Resume). Gọi lớp dưới: resume_L17.
function resume_L18(){V48X.active=false;V47T.active=false;V471_TRAIN_OWNER=null;return resume_L17();}
// resume: điểm vào duy nhất (T04). Thứ tự lớp: resume_L18 → … → resume_L00. Muốn đổi hành vi: sửa đúng lớp, KHÔNG gán đè resume.
function resume(...a){return resume_L18(...a);}
function v471MapArt(x,y,w,h){const art=imgs.v47thon;g.fillStyle='#263832';g.fillRect(x,y,w,h);if(art?.ready)g.drawImage(art.img,x,y,w,h);}
function v471MapPoints(x,y,w,h,labels=false){const project=n=>({x:x+n.x/3200*w,y:y+n.y/1800*h});for(const n of [...V471_NODES,V47T_MAP.gates[0]]){const z=project(n);circle(z.x,z.y,labels?5:2.5,n.to?'#75e8d6':'#e2bf80','#132421');if(labels)v33Fit(n.name||'Cổng Thanh Trúc Lâm',z.x,z.y-12,135,11,V45.paper,'center');}const z=project(V47T);circle(z.x,z.y,labels?6:3,'#fff7c9','#102c2b');}

// worldMapPanel: định nghĩa duy nhất (gộp 8 lớp ở T06).
// Ngoài cảnh thôn V47T, hoặc đang chọn tab "Sơn Hà Đồ" → bản đồ thôn cũ (v45TownMap) khi tab local/đang trong thôn, còn lại Sơn Hà Đồ (v22Atlas).
// Trong cảnh thôn V47T và không ở tab world → bản đồ địa phương V47T.1 bên dưới.
function worldMapPanel(){
  if(!v47tIsActive()||modal?.v16Map==='world'){
    if(modal?.v16Map==='local'||(modal?.v16Map!=='world'&&v16InTown(p.x,p.y,150)))return v45TownMap();
    v22Atlas();return;
  }
  v45MapHead('Thanh Thạch Thôn','Bản đồ địa phương · chọn địa điểm để dẫn đường',true);const x=35,y=145,w=850,h=478;v471MapArt(x,y,w,h);v471MapPoints(x,y,w,h,true);v45Surface(900,112,348,565);text('Địa điểm trong thôn',922,137,17,V45.gold);let i=0;for(const n of [...V471_NODES,{...V47T_MAP.gates[0],name:'Cổng Thanh Trúc Lâm'}]){const yy=157+i++*40;v45Button(914,yy,320,34,n.name+' · '+Math.round(dist(n,V47T))+' bước',null,()=>{modal=null;v8Cancel();v471Route(n,n.to?null:n.id);},{id:'town:'+n.id,size:12});const px=x+n.x/3200*w,py=y+n.y/1800*h;buttons.push({x:px-10,y:py-10,w:20,h:20,fn:()=>{modal=null;v8Cancel();v471Route(n,n.to?null:n.id);}});}
}

function v471Mini(){const {x,y,w,h}=V45_BOXES.map;v45Surface(x,y,w,h);v33Shield(x,y,w,h);v471MapArt(x+12,y+12,100,64);v471MapPoints(x+12,y+12,100,64);const lines=v45WrapLines('Thanh Thạch Thôn',98,13,2).map(t=>({t,size:13,col:V45.paper}));lines.push({t:'Khu an toàn',size:12,col:V45.jade});lines.push({t:'Cấp '+p.level,size:12,col:V45.soft});lines.forEach((L,i)=>v33Fit(L.t,x+122,y+20+i*17,98,L.size,L.col,'left'));v45Button(x+12,y+88,208,24,'Bản đồ','M',()=>openPanel('map'),{id:'hubMap',size:13});}
function v471Quest(){const {x,y}=V45_BOXES.quest,t=v12Tracked(),expanded=v34State().quest;const nameLines=t?v45WrapLines(t.goal,208,14,4):[],extra=(nameLines.length-1)*16;const h=!expanded?40:(!t?(p.v451Result?132:62):132+extra);v45Surface(x,y,232,h);v33Shield(x,y,232,h);diamond(g,x+11,y+21,3.5,V45.gold);v18Title('Thiên mệnh',x+26,y+21,15,V45.gold,'left');g.fillStyle='#d8bb8255';g.fillRect(x+12,y+32,208,1);v45Square(x+166,y+8,expanded?'−':'+','questFold',()=>{v34State().quest=!expanded;save();});v45Square(x+198,y+8,'Q','questJournal',v12Open);if(!expanded)return;if(!t){const complete=p.v12Main>=V12_MAIN.length;text(complete?'Chính tuyến đã hoàn thành':'Chưa theo dõi nhiệm vụ',x+12,y+48,13,complete?V45.jade:V45.soft);if(p.v451Result)v45Button(x+12,y+96,208,32,'Tổng kết bí cảnh gần nhất',null,()=>modal={kind:'v451Result'},{id:'lastDungeonResult',size:11});return;}nameLines.forEach((ln,i)=>text(ln,x+12,y+48+i*16,14,V45.paper,'left','bold'));if(nameLines.join(' ')!==String(t.goal).replace(/\s+/g,' ').trim())v45Tip('questName',x+12,y+40,208,nameLines.length*16,t.goal);v44Bar(x+12,y+56+extra,208,5,v42QuestFraction(t),1,V45.gold);const q=v12Target(t),z=q&&v47tMapGoal(q,{id:q.id});v33Fit(v12Progress(t),x+12,y+87+extra,208,12,V45_SPEC.jade);if(z)text('Cách '+Math.round(dist(z,V47T))+' bước',x+12,y+113+extra,12,V45_SPEC.muted);v45Button(x+120,y+100+extra,100,24,t.action==='skill'?'Công pháp':'Dẫn đường',null,()=>v12Guide(t),{id:'questGuide',size:12});}
function v471Dock(){const x=414,y=638,n=v471Near(),gt=V47T_MAP.gates[0],near=dist(gt,V47T)<gt.r+40;v45Surface(x,y,452,36);v33Shield(x,y,452,36);if(n||near)v45Button(x+11,y,276,36,near?'Cổng · Thanh Trúc Lâm':n.name,'E',v47tInteract,{primary:true,id:'interact'});else{v45Button(x,y,144,36,'Sơ đồ thôn','M',()=>openPanel('map'),{primary:true,id:'hubMap'});v45Button(x+154,y,144,36,'Sân luyện','F6',v42tOpen,{id:'hubTrain'});}v45Button(x+308,y,144,36,'Theo nhiệm vụ',null,()=>v12Guide(),{id:'hubQuest'});}
v47tDraw=function(){buttons=[];g.save();g.fillStyle='#263832';g.fillRect(0,0,W,H);g.save();g.translate(-V47T.cam.x,-V47T.cam.y);v471MapArt(0,0,3200,1800);const gt=V47T_MAP.gates[0];g.strokeStyle=v46CanEnter(gt.to).ok?'#7df0d8':'#e8a0a0';g.lineWidth=3;g.beginPath();g.ellipse(gt.x,gt.y,46+Math.sin(V47T.clock*3)*4,21,0,0,TAU);g.stroke();for(const n of V471_NODES){circle(n.x,n.y,7,'#dfc18b','#213731');if(dist(n,V47T)<370){g.font='bold 15px sans-serif';g.textAlign='center';g.strokeStyle='#152723';g.lineWidth=4;g.strokeText(n.name,n.x,n.y-23);g.fillStyle='#fff1d4';g.fillText(n.name,n.x,n.y-23);}}if(V47T.path?.length){g.save();g.setLineDash([6,7]);g.strokeStyle='#f1d99b';g.lineWidth=2;g.beginPath();g.moveTo(V47T.x,V47T.y);for(const q of V47T.path)g.lineTo(q.x,q.y);g.stroke();g.restore();}v47tDrawHero();g.restore();g.restore();
 v35Reset();V35.rects={};const edit=v35Editing(),s=currentStats();v45IdleFactor();if(!modal||edit){v35Group('identity',()=>{g.globalAlpha*=V45_IDLE.f;v35Identity(s);v35Status();});v35Group('map',()=>{g.globalAlpha*=V45_IDLE.f;v471Mini();});v35Group('quest',()=>{g.globalAlpha*=V45_IDLE.f;v471Quest();});v35Group('dock',()=>{g.globalAlpha*=V45_IDLE.f;v471Dock();if(!edit)v45XpBar();});v35Group('nav',()=>{g.globalAlpha*=V45_IDLE.f;v35Nav();});v35Group('left',()=>{g.globalAlpha*=V45_IDLE.f;v45IconCell(24,646,46,46,'menu',null,'Menu',()=>{V33.menu=!V33.menu;},V33.menu);});v35Group('feed',()=>{g.globalAlpha*=V45_IDLE.f;v35Feed();});if(edit){V35.dragButtons=buttons.filter(b=>b.v35?.startsWith('drag:'));buttons=buttons.filter(b=>!b.v35?.startsWith('drag:'));}else{v45Location(true,false);v33Drawer();}}if(modal){if(!edit)buttons=[];panel();}
};


