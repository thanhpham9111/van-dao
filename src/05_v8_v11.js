'use strict';
// V8 — Nhân gian sống. Original real-time implementation.
// Design reference (not copied code/assets): Cultivation World Simulator,
// https://github.com/4thfever/cultivation-world-simulator
// Target-based actions, approach before interaction, named avatar profiles.
const V8={vx:0,vy:0,phase:0,route:[],target:null,goal:null,stuck:0,lastDist:Infinity,owner:null,npcs:new Map(),hover:null,menuPage:'home',select:0,menuArt:null,walked:0};
const V8_PEOPLE=[
 ['inn','Thanh Thạch','Trưởng lão','Trúc Cơ · tầng 3','Thanh Vân Tông','#aab8a4','#324e50','#ead6aa','elder','Người chỉ dẫn tân tu, trấn giữ Thanh Thạch Thôn.','Hãy tìm Thanh Trúc Lâm, hạ Trúc Lang Vương rồi đột phá Trúc Cơ.'],
 ['shop','Linh Dược','Dược thương','Luyện Khí · tầng 6','Vạn Bảo Các','#b27b50','#603c35','#e6c17b','merchant','Thu mua linh dược và bán đan dược.','Đạo hữu cần chuẩn bị đan dược trước khi vào vùng yêu thú.'],
 ['sentry','Lục Thanh','Hộ vệ','Luyện Khí · tầng 8','Thanh Vân Tông','#638b9a','#263e50','#afc9d4','guard','Tuần tra đường vào thôn.','Cẩn thận yêu thú ngoài rừng. Quan sát tư thế của chúng và lướt né đúng nhịp.'],
 ['herbalist','Mộc Tử Y','Dược sư','Luyện Khí · tầng 5','Bách Thảo Đường','#91ad75','#385c4f','#f1de9c','woman','Thu hái thảo dược và luyện đan.','Linh dược Hắc Độc Trạch chứa linh khí rất mạnh.'],
 ['wanderer','Tạ Vô Nhai','Tán tu kiếm khách','Trúc Cơ · tầng 1','Tán tu','#6c778e','#313846','#d1d8ec','swordsman','Du hành giữa thôn và đường trúc.','Kiếm ý không đến từ lời nói; hãy tự mình trải nghiệm rừng trúc.'],
 ['bambooKeeper','Vân Tịch','Đệ tử nội môn','Luyện Khí · tầng 9','Thanh Vân Tông','#9cc6aa','#2e6255','#eddfad','woman','Tĩnh tu và canh bia đá Thanh Vân.','Bia đá Thanh Vân còn lưu lại một đoạn đạo vận cổ xưa.'],
 ['mountainHunter','Hàn Liệt','Thợ săn yêu thú','Trúc Cơ · tầng 2','Tán tu','#b29372','#4b3b35','#dacc91','hunter','Săn yêu thú ở Vạn Yêu Sơn.','Cổ kiếm trong núi không thuộc về kẻ thiếu kiên nhẫn.'],
 ['snowHermit','Bạch Vân','Ẩn sĩ','Trúc Cơ · tầng 5','Bắc Minh Sơn','#d2e1e8','#56768b','#d7f0fa','elder','Ẩn tu bên suối lạnh.','Hàn Băng Linh Tuyền có thể củng cố đạo tâm.'],
 ['swampMedic','Đường Uyển','Y tu','Trúc Cơ · tầng 1','Bách Thảo Đường','#88a887','#354941','#e4cfc5','woman','Nghiên cứu linh độc ở đầm lầy.','Linh dược trong đầm quý hiếm, nhưng yêu thú rất hung dữ.'],
 ['desertSmith','Thiết Nham','Luyện khí sư','Trúc Cơ · tầng 4','Thiên Công Các','#bc8561','#5b423b','#f1bd72','hunter','Tìm khoáng thạch luyện pháp bảo.','Xích Viêm Thạch là thử thách đầu tiên của người luyện khí.'],
 ['demonWatcher','Mạc Ly','Trấn vực giả','Trúc Cơ · tầng 7','Huyền Minh Điện','#9a83af','#3c304f','#c8adfa','guard','Canh giữ đường vào trận pháp Vạn Giới.','Trận pháp chỉ mở khi ngươi đã vượt qua Trúc Lang Vương và đạt Trúc Cơ.'],
 ['ghostSeer','U Lan','Linh môi','Trúc Cơ · tầng 6','U Minh Điện','#779c9f','#354c59','#c5efe9','woman','Lắng nghe tàn hồn nơi cổ tích.','Tàn hồn cổ tu chờ một người đủ duyên để lĩnh ngộ.']
].map(([id,name,role,realm,sect,robe,dark,trim,style,bio,line])=>({id,name,role,realm,sect,robe,dark,trim,style,bio,line}));
const V8_INFO=Object.fromEntries(V8_PEOPLE.map(n=>[n.id,n]));
for(const [id,region,x,y] of [['sentry','thon',758,860],['herbalist','thon',906,1088],['wanderer','thon',1150,860],['bambooKeeper','truc',2230,990],['mountainHunter','yeu',3890,990],['snowHermit','tuyet',850,3370],['swampMedic','tram',2290,3420],['desertSmith','hoa',3970,3340],['demonWatcher','ma',5480,1030],['ghostSeer','quy',5470,3390]]) OW_POI.push({id,kind:'npc',region,x,y,name:V8_INFO[id].name});
function v8Cancel(){V8.route=[];V8.target=null;V8.goal=null;V8.lastDist=Infinity;V8.stuck=0;if(!V46_NO_NAV_CLEAR){V46_NAV.active=false;V46_NAV.q=null;V46_NAV.target=null;}}
function v8Reset(){v8Cancel();V8.vx=V8.vy=V8.phase=0;V8.owner=p;V8.npcs.clear();if(p){p.v8Relations??={};p.v8Quests??={};p.v8Name??='Vô Danh';}}
const v8NameInput=document.getElementById('heroName');
function v8PlayerName(){return v8NameInput?.value?.trim().slice(0,18)||'Vô Danh';}
// start_L01: lớp 05_v8_v11 (trước đây lưu lớp dưới vào v8Start). Gọi lớp dưới: start_L00.
function start_L01(cls){const name=v8PlayerName();start_L00(cls);v8Reset();p.v8Name=name;save();}
// resume_L02: lớp 05_v8_v11 (trước đây lưu lớp dưới vào v8Resume). Gọi lớp dưới: resume_L01.
function resume_L02(){resume_L01();if(p){v8Reset();p.vx=p.vy=0;}}
const v8Enter=enterWorld;enterWorld=function(...args){v8Enter(...args);v8Reset();};
const v8EnterRoom=enterRoom;enterRoom=function(...args){v8EnterRoom(...args);v8Reset();};
function v8NPC(o){let n=V8.npcs.get(o.id);if(!n){n={...o,homeX:o.x,homeY:o.y,face:1,phase:0,walking:false,task:'Tĩnh tu',wait:1,way:null};V8.npcs.set(o.id,n);}return n;}
function v8POIs(){return OW_POI.map(o=>V8_INFO[o.id]?v8NPC(o):o);}
function v8NPCUpdate(dt){
 for(const o of OW_POI){const d=V8_INFO[o.id];if(!d||o.kind==='v14roamer'||V16_NPCS[o.id])continue;const n=v8NPC(o);if(dist(n,p)>1000)continue;
  if(dist(n,p)<88||V8.target?.id===n.id||modal?.npc===n.id){n.walking=false;n.face=p.x<n.x?-1:1;n.task='Trò chuyện';continue;}
  const day=(p.worldTime%360)/15;const stationary=d.style==='elder'||d.style==='merchant';
  n.wait-=dt;if(!n.way&&n.wait<=0){const ang=hashOW(n.homeX|0,n.homeY|0,Math.floor(p.worldTime/5)+37)*TAU,rr=stationary?20:58+hashOW(n.homeY|0,n.homeX|0,5)*34;const q={x:n.homeX+Math.cos(ang)*rr,y:n.homeY+Math.sin(ang)*rr};if(!owBlocked(q.x,q.y,10)&&v8Line(n,q,10,true))n.way=q;else n.wait=2+hashOW(n.homeX,n.homeY,3)*4;}
  if(n.way){const dx=n.way.x-n.x,dy=n.way.y-n.y,l=Math.hypot(dx,dy);if(l<3){n.way=null;n.wait=2.8+hashOW(n.homeX,n.homeY,17)*5;n.walking=false;}else{const sp=stationary?30:52;const xx=n.x,yy=n.y;owMove(n,n.x+dx/l*Math.min(l,sp*dt),n.y+dy/l*Math.min(l,sp*dt),10);n.walking=Math.hypot(n.x-xx,n.y-yy)>.15;n.phase+=dt*2.0;if(Math.abs(dx)>2)n.face=Math.sign(dx);if(!n.walking){n.way=null;n.wait=2;}}}
  else n.walking=false;n.task=n.walking?'Đang di chuyển':day<6||day>20?'Tĩnh tu':stationary?'Chờ đạo hữu':d.style==='guard'?'Tuần tra':d.style==='woman'?'Thu thập linh khí':'Nghỉ chân';
 }
}
owNearest=function(){let near=null,best=113;for(const o of v8POIs()){const d=dist(o,p);if(d<best){near=o;best=d;}}return near;};
const v8OldInteract=owInteract;
owInteract=function(){const o=owNearest();v8Cancel();V8.vx=V8.vy=0;if(o&&V8_INFO[o.id]){v8Talk(o);return;}v8OldInteract();};
function v8Talk(o){v8Cancel();V8.vx=V8.vy=0;mouse.left=mouse.fire=false;const d=V8_INFO[o.id];if(!d)return;p.v8Relations??={};p.v8Quests??={};modal={kind:'npc8',npc:o.id,line:d.line};}
function v8Bond(id,n=5){p.v8Relations[id]=clamp((p.v8Relations[id]||0)+n,0,100);save();}
function v8Chat(id){const d=V8_INFO[id];modal.line=d.line+' '+(p.v8Relations[id]>=30?'Gặp lại đạo hữu thật vui.':'Hữu duyên ắt sẽ gặp lại.');if(!p.v8Quests['met:'+id]){p.v8Quests['met:'+id]=true;v8Bond(id,8);}}
const V8_TASKS={inn:['worldBossDead','Trúc Lang Vương','Hạ Trúc Lang Vương'],herbalist:['swampherb','Linh dược Hắc Trạch','Thu thập Linh Dược Hắc Trạch'],wanderer:['truc','Thanh Trúc Lâm','Khám phá Thanh Trúc Lâm'],bambooKeeper:['trucaltar','Bia đá Thanh Vân','Lĩnh ngộ Bia đá Thanh Vân'],mountainHunter:['yuealtar','Cổ kiếm Vạn Yêu','Lĩnh ngộ Cổ kiếm Vạn Yêu'],snowHermit:['snowaltar','Hàn Băng Linh Tuyền','Lĩnh ngộ Hàn Băng Linh Tuyền'],swampMedic:['swampherb','Linh dược Hắc Trạch','Thu thập Linh Dược Hắc Trạch'],desertSmith:['firealtar','Xích Viêm Thạch','Lĩnh ngộ Xích Viêm Thạch'],demonWatcher:['worldBossDead','Trận pháp Vạn Giới','Hạ Trúc Lang Vương và đạt Trúc Cơ'],ghostSeer:['ghostrune','Tàn Hồn Cổ Tu','Lĩnh ngộ Tàn Hồn Cổ Tu'],sentry:['truc','Thanh Trúc Lâm','Khám phá Thanh Trúc Lâm']};
function v8Quest(id){const task=V8_TASKS[id];if(!task)return;const [flag,title,desc]=task,key='quest:'+id,done=flag==='worldBossDead'?p.worldBossDead&&(id!=='demonWatcher'||p.level>=10):flag==='truc'?p.discovered.includes('truc'):p.claimed[flag];if(p.v8Quests[key]===2){modal.line='Đạo hữu đã hoàn thành '+title+'. Ta ghi nhớ công lao này.';return;}if(!p.v8Quests[key]){p.v8Quests[key]=1;modal.line='Đã nhận nhiệm vụ: '+desc+'. Khi hoàn thành hãy quay lại gặp ta.';save();return;}if(!done){modal.line='Nhiệm vụ đang thực hiện: '+desc+'.';return;}p.v8Quests[key]=2;p.stones+=10;p.pills++;gainXP(20);v8Bond(id,20);modal.line='Hoàn thành! +10 linh thạch, +1 Hồi Xuân Đan, +20 tu vi.';save();}
function v8Shop(){if(p.stones<5){modal.line='Chưa đủ linh thạch. Mỗi 2 Hồi Xuân Đan cần 5 linh thạch.';return;}p.stones-=5;p.pills+=2;modal.line='Giao dịch thành công. Đạo hữu nhận 2 Hồi Xuân Đan.';save();}
// Path planning with diagonal neighbors, no corner cutting, line-of-sight smoothing.
function v8Blocked(x,y,r=14,world=p?.worldMode){if(world)return owBlocked(x,y,r);return x<AREA.l+24||x>AREA.r-24||y<AREA.t+24||y>AREA.b-24||(BLOCKS[room]||[]).some(b=>Math.hypot(x-b.x,y-b.y)<b.r+r);}
function v8Line(a,b,r=14,world=p?.worldMode){const d=dist(a,b),steps=Math.max(1,Math.ceil(d/15));for(let i=1;i<=steps;i++){const t=i/steps;if(v8Blocked(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,r,world))return false;}return true;}
function v8Path(a,b,world=p?.worldMode){
 const step=40,r=15,limit=world?{l:16,r:OW.w-16,t:16,b:OW.h-16}:{l:AREA.l+24,r:AREA.r-24,t:AREA.t+24,b:AREA.b-24};
 b={x:clamp(b.x,limit.l,limit.r),y:clamp(b.y,limit.t,limit.b)};
 if(v8Line(a,b,r,world))return [b];
 const ix=t=>Math.round(t/step),key=(x,y)=>x+':'+y,pt=(x,y)=>({x:x*step,y:y*step}),cache=new Map();
 const free=(x,y)=>{const k=key(x,y);if(!cache.has(k))cache.set(k,!v8Blocked(x*step,y*step,r,world));return cache.get(k);};
 const nearest=q=>{let best=null,dd=Infinity;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){let x=ix(q.x)+dx,y=ix(q.y)+dy,z=pt(x,y),d=dist(q,z);if(d<dd&&free(x,y)&&(q!==a||v8Line(a,z,r,world))){best={x,y};dd=d;}}return best;};
 const from=nearest(a),to=nearest(b);if(!from||!to)return [];
 const h=(x,y)=>Math.hypot(to.x-x,to.y-y),nodes=new Map(),heap=[];
 function push(n){let i=heap.length;heap.push(n);while(i>0){let j=(i-1)>>1;if(heap[j].f<=n.f)break;heap[i]=heap[j];i=j;}heap[i]=n;}
 function pop(){const n=heap[0],t=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].f<heap[j].f)j++;if(heap[j].f>=t.f)break;heap[i]=heap[j];i=j;}heap[i]=t;}return n;}
 const root={...from,g:0,f:h(from.x,from.y),prev:null};nodes.set(key(root.x,root.y),root);push(root);let end=null,iter=0;
 while(heap.length&&iter++<12000){const n=pop();if(nodes.get(key(n.x,n.y))!==n)continue;if(n.x===to.x&&n.y===to.y){end=n;break;}for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=n.x+dx,y=n.y+dy;if(!free(x,y)||dx&&dy&&(!free(n.x+dx,n.y)||!free(n.x,n.y+dy)))continue;const g=n.g+(dx&&dy?Math.SQRT2:1),k=key(x,y);if(nodes.has(k)&&nodes.get(k).g<=g)continue;const q={x,y,g,f:g+h(x,y),prev:n};nodes.set(k,q);push(q);}}
 if(!end)return [];let raw=[];for(let n=end;n;n=n.prev)raw.push(pt(n.x,n.y));raw.reverse();if(v8Line(raw.at(-1),b,r,world))raw.push(b);let out=[],at=a,i=0;while(i<raw.length){let j=raw.length-1;while(j>i&&!v8Line(at,raw[j],r,world))j--;out.push(raw[j]);at=raw[j];i=j+1;}return out;
}
function v8InteractAt(o){if(!o)return;if(V8_INFO[o.id]){v8Talk(o);return;}const near=owNearest;owNearest=()=>o;try{v8OldInteract()}finally{owNearest=near}}
function v8SetGoal(q,target=null){v8Cancel();V8.target=target;let dest=q;if(target){const d=dist(p,q);if(d<86){if(target.type==='poi'){const actual=v8POIs().find(o=>o.id===target.id);v8Cancel();V8.vx=V8.vy=0;v8InteractAt(actual);}else{V8.target=null;mouse.fire=true;}return;}const a=Math.atan2(p.y-q.y,p.x-q.x);const opts=[0,.7,-.7,1.4,-1.4,Math.PI].map(t=>({x:q.x+Math.cos(a+t)*67,y:q.y+Math.sin(a+t)*67}));dest=opts.find(z=>!v8Blocked(z.x,z.y))||q;}
 V8.route=v8Path(p,dest);V8.goal={...dest};if(!V8.route.length){v8Cancel();message('Không tìm thấy lối đi. Hãy chọn vị trí khác.');}}
function v8Pick(){if(!p||mode!=='play'||modal)return null;let best=null,score=Infinity;if(p.worldMode){for(const o of v8POIs()){const q=hdPoint(o.x,o.y),npc=!!V8_INFO[o.id],dy=mouse.y-(q.y-(npc?40:20)*V11_ZOOM),dx=mouse.x-q.x,v=Math.hypot(dx,dy);if(Math.abs(dx)<(npc?30:40)*V11_ZOOM+5&&dy>-45*V11_ZOOM-5&&dy<49*V11_ZOOM+5&&v<score){best={type:'poi',id:o.id,o};score=v;}}}
 for(const e of enemies){if(e.dead)continue;const q=p.worldMode?hdPoint(e.x,e.y):e,t=TYPES[e.type],scale=p.worldMode?V11_ZOOM:V11_ARENA_SCALE,dx=mouse.x-q.x,dy=mouse.y-(q.y-t.scale*.26*scale),v=Math.hypot(dx,dy);if(Math.abs(dx)<Math.max(t.r,26)*scale+5&&Math.abs(dy)<t.scale*.45*scale+5&&v<score){best={type:'enemy',e};score=v;}}return best;}
function v8PointerDown(){const t=v8Pick();if(t?.type==='poi'){v8SetGoal(t.o,{type:'poi',id:t.id});return;}if(t?.type==='enemy'){v8Cancel();mouse.left=mouse.fire=true;return;}const q=p.worldMode?hdUnproject(mouse.x,mouse.y):{x:mouse.x,y:mouse.y};v8SetGoal(q);}
function v8Input(dt,s,world){if(V8.owner!==p)v8Reset();let dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),dy=(keys.KeyS||keys.ArrowDown?1:0)-(keys.KeyW||keys.ArrowUp?1:0);let len=Math.hypot(dx,dy);
 if(len){v8Cancel();if(world)dy/=HD.tilt;len=Math.hypot(dx,dy);dx/=len;dy/=len;}
 else if(V8.route.length){let q=V8.route[0],d=dist(p,q);if(d<11){V8.route.shift();q=V8.route[0];}if(q){d=dist(p,q);const rate=V8.route.length===1?clamp(d/48,.16,1):1;dx=(q.x-p.x)/Math.max(d,1)*rate;dy=(q.y-p.y)/Math.max(d,1)*rate;}}
 let vx=dx*s.speed,vy=dy*s.speed,rate=(Math.hypot(dx,dy)>0?1850:2350)*dt;const ax=vx-V8.vx,ay=vy-V8.vy,l=Math.hypot(ax,ay);if(l<=rate){V8.vx=vx;V8.vy=vy;}else{V8.vx+=ax/l*rate;V8.vy+=ay/l*rate;}
 if(Math.abs(V8.vx)>26)p.face=Math.sign(V8.vx);return {dx,dy,l:Math.hypot(dx,dy),mx:V8.vx*dt,my:V8.vy*dt};}
function v8AfterMove(dt,oldX,oldY,s){v9Travel(dt,oldX,oldY,s);
 if(V8.route.length){const d=dist(p,V8.route[0]);if(d>V8.lastDist-.4)V8.stuck+=dt;else V8.stuck=0;V8.lastDist=d;if(V8.stuck>.75){const goal=V8.goal,target=V8.target;if(goal){v8SetGoal(goal,target);V8.stuck=0;}else v8Cancel();}}
 if(V8.target?.type==='poi'){const o=v8POIs().find(n=>n.id===V8.target.id);if(o&&dist(o,p)<86){v8Cancel();V8.vx=V8.vy=0;v8InteractAt(o);}else if(o&&!V8.route.length)v8SetGoal(o,V8.target);}
 else if(!V8.route.length)V8.goal=null;
}
function v8Anim(dt){const state=p.hurt>0?'hurt':p.dashT>0?'dash':p.castT>0?'cast':p.attackT>0?'attack':V8.walked>12?'run':'idle';if(animation.name!==state){animation.name=state;animation.t=0;}else animation.t+=dt;if(state==='run')animation.t=V8.phase/24;}
// NPCs use original articulated vector sprites, shared anchor at boot contact.
function v8Figure(d,x,y,scale=1,face=1,phase=0,walking=false){const art=imgs['npc_'+d.id];if(art?.ready){g.save();g.translate(x,y);g.scale(scale*face,scale);const motion=walking?Math.sin(phase*TAU):0,bob=walking?Math.abs(motion)*1.4:Math.sin(elapsed*1.7)*.35;g.rotate(motion*.023);g.imageSmoothingEnabled=true;g.drawImage(art.img,-42,-85-bob,84,90);g.restore();return;}g.save();g.translate(x,y);g.scale(scale*face,scale);const k=walking?Math.sin(phase*TAU)*7:0,bob=walking?Math.abs(Math.sin(phase*TAU))*1.8:Math.sin(elapsed*1.7)*.5;const skin='#e4bd94',hair=d.style==='elder'?'#d1d5d0':'#283036';
 const P=(pts,c,s=null,w=1)=>hdPoly(g,pts,c,s,w);
 for(const t of [-1,1]){let dx=t*7+t*k*.55;P([[t*6-5,-22],[t*6+5,-22],[dx+4,-2],[dx+9,0],[dx+9,3],[dx-5,3],[dx-6,-2]],d.dark,'#28323a');}
 g.translate(0,-bob);
 if(d.style==='swordsman'||d.style==='guard'){hdLine(g,[-15,-62],[18,-4],'#2d2833',6);hdLine(g,[-15,-64],[19,-6],d.trim,2);hdLine(g,[-20,-62],[-10,-68],d.trim,3);}
 P([[-12,-48],[-20,-32],[-23,-11],[-8,-16],[0,-25],[8,-16],[23,-11],[20,-33],[11,-48]],d.dark,'#263238');
 P([[-13,-44],[-10,-31],[-20,-4],[-9,-1],[0,-6],[11,1],[20,-4],[10,-31],[13,-44]],d.robe,d.dark);
 P([[-8,-45],[2,-33],[-6,-8],[2,-8],[11,-35],[8,-44]],d.trim);
 P([[-10,-32],[10,-32],[13,-27],[-13,-27]],d.dark,d.trim,.8);
 P([[-12,-43],[-18,-42],[-26,-23],[-17,-19],[-11,-32]],d.robe,d.dark);
 P([[12,-43],[18,-41],[23,-24-k*.45],[15,-20-k*.45],[9,-34]],d.robe,d.dark);
 hdEllipse(g,-18,-20,4,4,skin);hdEllipse(g,17,-22-k*.45,4,4,skin);
 P([[-6,-49],[-6,-42],[5,-42],[5,-49]],skin);
 hdEllipse(g,0,-57,11,14,hair);hdEllipse(g,1,-56,8.5,11,skin);P([[-10,-62],[-6,-69],[5,-69],[11,-64],[7,-59],[1,-64],[-2,-58],[-9,-55]],hair);
 g.fillStyle='#342d31';g.fillRect(-4,-56,2.6,1.7);g.fillRect(3,-56,2.6,1.7);hdLine(g,[0,-54],[1,-51],'#b98b73',.8);hdLine(g,[-2,-49],[3,-49],'#9f675c',.8);
 if(d.style==='elder'){P([[-8,-51],[-3,-43],[0,-35],[6,-46],[8,-52],[2,-48],[-2,-49]],'#d8d9ce');P([[-13,-68],[-9,-76],[7,-76],[13,-68]],d.dark,d.trim);hdLine(g,[-18,-68],[18,-68],d.trim,3);hdLine(g,[-23,-42],[-23,2],'#806447',3);hdEllipse(g,-23,-44,4,4,d.trim);}
 else if(d.style==='merchant'){P([[-21,-64],[-5,-78],[7,-78],[23,-64]],'#ad8955','#604834');hdLine(g,[-24,-64],[24,-64],d.trim,3);P([[15,-33],[25,-36],[28,-21],[20,-16],[13,-20]],'#bdac81',d.dark);}
 else if(d.style==='woman'){hdEllipse(g,-8,-68,6,8,hair);hdEllipse(g,5,-72,7,5,hair);hdLine(g,[-10,-69],[14,-75],d.trim,2);hdEllipse(g,11,-69,3,4,'#f4dba0');P([[-10,-65],[-14,-48],[-9,-36],[-5,-51]],hair);}
 else if(d.style==='hunter'){hdLine(g,[-13,-65],[12,-65],d.trim,4);P([[-17,-40],[-24,-35],[-19,-23],[-12,-29]],'#bc9a78');}
 else{P([[0,-70],[-5,-77],[3,-79],[7,-70]],hair);hdLine(g,[-7,-70],[8,-70],d.trim,2);}
 g.restore();}
const v8OldPOI=hdDrawPOI;hdDrawPOI=function(o,z){const d=V8_INFO[o.id];if(!d){v8OldPOI(o,z);return;}const hovered=V8.hover?.id===o.id,near=dist(o,p)<245;hdEllipse(g,z.x,z.y+1,16,5,'#17232c80');if(hovered||V8.target?.id===o.id){hdEllipse(g,z.x,z.y+1,24,8,'#d7dba02a');g.strokeStyle='#f5d48a';g.lineWidth=1.4;g.beginPath();g.ellipse(z.x,z.y+1,24,8,0,0,TAU);g.stroke();}
 v9NPCDraw(d,o,z);if(near||hovered){box(z.x-69,z.y-106,138,23,'#142a2bd9',hovered?'#e8d197':'#53756c',3);text(d.name+' · '+d.role,z.x,z.y-94,11,hovered?'#fff0b8':'#dce9dd','center','bold');if(V8_TASKS[o.id]&&p.v8Quests?.['quest:'+o.id]!==2)text('◆',z.x,z.y-117,12,C.gold,'center');}};
function v8DrawRoute(){if(!V8.route.length||modal)return;const pts=[p,...V8.route].map(q=>p.worldMode?hdPoint(q.x,q.y):q);g.save();g.strokeStyle='#c3e9cc90';g.lineWidth=2;g.setLineDash([4,9]);g.beginPath();g.moveTo(pts[0].x,pts[0].y);pts.slice(1).forEach(q=>g.lineTo(q.x,q.y));g.stroke();g.setLineDash([]);const z=pts.at(-1);g.strokeStyle='#e7e8b9';g.beginPath();g.ellipse(z.x,z.y,13+3*Math.sin(elapsed*4),8,0,0,TAU);g.stroke();diamond(g,z.x,z.y,4,'#dbe8aa');g.restore();}
function v8Panel(){const d=V8_INFO[modal.npc];if(!d){modal=null;return;}g.fillStyle='#061319aa';g.fillRect(0,0,W,H);ornament(135,143,1010,434,'#13282cee');box(160,168,260,382,'#16282c','#c9a86a',6);
 const grad=g.createRadialGradient(290,335,15,290,335,150);grad.addColorStop(0,'#52665d');grad.addColorStop(1,'#142126');g.fillStyle=grad;g.fillRect(168,176,244,282);seal(g,290,319,106,d.trim,.12,.4);v8Figure(d,290,440,3.18,1,0,false);text(d.name,290,480,24,d.trim,'center','bold');text(d.realm+' · '+d.sect,290,510,13,C.paper,'center');
 text(d.role,453,190,12,C.gold,'left','bold');text(d.name,453,222,31,C.paper,'left','bold');text('Hảo cảm '+(p.v8Relations[d.id]||0)+'/100',1100,199,13,C.jade,'right');bar(932,218,168,10,(p.v8Relations[d.id]||0)/100,'#8db89b','');wrapText(d.bio,454,259,620,15,C.muted,'left',22);
 box(449,287,655,116,'#2b2417','#c9a86a',5);wrapText(modal.line,470,314,610,19,C.paper,'left',27);
 addButton(453,424,195,46,'Trò chuyện',()=>v8Chat(d.id),true);
 if(d.id==='shop')addButton(660,424,444,41,'Mua 2 Hồi Xuân Đan · 5 linh thạch',v8Shop,true);
 else if(V8_TASKS[d.id])addButton(660,424,444,41,p.v8Quests['quest:'+d.id]===2?'Đã hoàn thành':p.v8Quests['quest:'+d.id]?'Báo cáo nhiệm vụ':'Nhận nhiệm vụ',()=>v8Quest(d.id),true);
 text('Linh thạch: '+p.stones+'   ·   Đan: '+p.pills,455,506,14,C.gold);addButton(900,490,204,46,'Rời đi · ESC',()=>modal=null);}
function v8Journal(){g.fillStyle='#061319bb';g.fillRect(0,0,W,H);ornament(175,105,930,510,'#14282ded');text('NHẬT KÝ TU TIÊN',640,145,27,C.gold,'center','bold');text(p.v8Name+' · '+realm(),640,182,14,C.jade,'center');const tasks=Object.entries(V8_TASKS).filter(([id])=>p.v8Quests['quest:'+id]);if(!tasks.length){text('Chưa nhận nhiệm vụ nào. Hãy gặp các NPC trên bản đồ.',640,300,17,C.paper,'center');}else tasks.slice(0,11).forEach(([id,t],i)=>{const y=218+i*28;box(210,y,860,25,i%2?'#243f40':'#1b3538','',3);text(V8_INFO[id].name+' · '+t[2],225,y+12,12,C.paper);text(p.v8Quests['quest:'+id]===2?'Đã hoàn thành':'Đang thực hiện',1050,y+12,12,p.v8Quests['quest:'+id]===2?C.jade:C.gold,'right');});addButton(535,566,210,32,'Đóng · ESC',()=>modal=null);}


// A bespoke entrance screen; no online credentials or network.
function v8MenuBackdrop(){if(imgs.v8Title?.ready){g.imageSmoothingEnabled=true;const im=imgs.v8Title.img,r=Math.max(W/im.naturalWidth,H/im.naturalHeight),dw=im.naturalWidth*r,dh=im.naturalHeight*r;g.drawImage(im,(W-dw)/2,(H-dh)/2,dw,dh);const dark=g.createLinearGradient(0,0,W,0);dark.addColorStop(0,'#071923e8');dark.addColorStop(.48,'#0b20289c');dark.addColorStop(.83,'#10242b00');g.fillStyle=dark;g.fillRect(0,0,W,H);for(let i=0;i<27;i++){const x=(i*131.6+elapsed*(5+i%3))%W,y=(i*89.3-elapsed*5+H*10)%H;circle(x,y,1.4+(i%3)*.45,'#e2dbaf','',.28+.16*Math.sin(i+elapsed));}return;}const grad=g.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#102d39');grad.addColorStop(.52,'#79958a');grad.addColorStop(1,'#132e35');g.fillStyle=grad;g.fillRect(0,0,W,H);const moon=g.createRadialGradient(930,128,10,930,128,155);moon.addColorStop(0,'#f8e6ad');moon.addColorStop(.26,'#e6d5a0b8');moon.addColorStop(1,'#dfce9b00');g.fillStyle=moon;g.fillRect(775,-20,310,310);
 for(let l=0;l<5;l++){const y=224+l*78,sl=18+l*8,col=['#8aa59b','#658c84','#426e6c','#2c5159','#17393e'][l];g.fillStyle=col;g.beginPath();g.moveTo(0,H);g.lineTo(0,y);for(let x=0;x<=W+40;x+=24){const a=Math.sin(x/(90+l*16)+l*2.6),b=Math.sin(x/47+l*3.1),peak=Math.abs(Math.sin(x/(160-l*12)+l*.8));g.lineTo(x,y-a*sl-b*sl*.45-peak*(90+l*4));}g.lineTo(W,H);g.closePath();g.fill();}
 for(let j=0;j<5;j++){const y=110+j*95,x=(elapsed*4+j*340)%(W+500)-250,f=g.createRadialGradient(x,y,0,x,y,255);f.addColorStop(0,'#deead332');f.addColorStop(1,'#deead300');g.fillStyle=f;g.fillRect(x-255,y-100,510,200);}
 for(let i=0;i<19;i++){const x=760+i*32,y=648-(i%7)*8;g.fillStyle='#142e33';g.fillRect(x,y-110-(i%4)*17,4,200);for(let j=0;j<5;j++){const off=13+3*j, yy=y-105+j*17;hdPoly(g,[[x,yy-33],[x-off,yy+6],[x+off,yy+6]],i%2?'#1b4445':'#1a383c');}}
 // Pavilion on the ridge, warm lanterns.
 const x=1004,y=500;hdPoly(g,[[x-125,y+8],[x-100,y-8],[x+105,y-8],[x+130,y+8],[x+100,y+27],[x-100,y+27]],'#4d6158','#93a18b');for(const a of [-70,-23,23,70]){g.fillStyle='#634937';g.fillRect(x+a-5,y-83,10,90);g.fillStyle='#e4c38a';g.fillRect(x+a-3,y-67,6,28);}hdPoly(g,[[x-121,y-78],[x-86,y-91],[x,y-153],[x+86,y-91],[x+121,y-78],[x+70,y-72],[x,y-91],[x-70,y-72]],'#243c43','#a1ad99',2);for(let i=0;i<5;i++)hdLine(g,[x-93+i*11,y-79-i*8],[x+93-i*11,y-79-i*8],'#77918a',1.2);for(const a of [-72,72]){hdGlow(x+a,y-51,39,'#ffb56c',.55);g.fillStyle='#f0c58c';g.fillRect(x+a-4,y-56,8,15);}
 const shade=g.createLinearGradient(0,0,W,0);shade.addColorStop(0,'#081b26f5');shade.addColorStop(.45,'#0b2028c9');shade.addColorStop(.83,'#10242b18');shade.addColorStop(1,'#10242b00');g.fillStyle=shade;g.fillRect(0,0,W,H);
 for(let i=0;i<27;i++){const x=(i*131.6+elapsed*(5+i%3))%W,y=(i*89.3-elapsed*5+H*10)%H;circle(x,y,1.4+(i%3)*.45,'#e2dbaf','',.28+.16*Math.sin(i+elapsed));}}
function v8MenuButton(x,y,w,h,a,b,fn,primary=false){const over=mouse.inside&&mouse.x>=x&&mouse.x<x+w&&mouse.y>=y&&mouse.y<y+h;box(x,y,w,h,over?'#415a50':primary?'#344f48':'#142e34d9',over?'#f3df9e':primary?'#cbb37a':'#778779',4);text(a,x+20,y+h*.5-(b?8:0),18,primary?'#f5e3ae':'#e6e9db','left','bold');if(b)text(b,x+20,y+h*.5+13,11,'#b8c8bc');text('›',x+w-22,y+h/2,25,'#d9c48d','center');buttons.push({x,y,w,h,fn});}

function v8Cursor(){if(!mouse.inside)return;const x=mouse.x,y=mouse.y,btn=buttons.some(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h),t=(!btn&&!modal&&mode==='play')?v8Pick():null;V8.hover=t;const col=t?.type==='enemy'?'#f09a82':t?.type==='poi'?'#c8f5cf':'#f9e7b1';g.save();g.translate(x,y);g.shadowColor='#102328';g.shadowBlur=5;
 if(t?.type==='enemy'){g.strokeStyle=col;g.lineWidth=1.8;g.beginPath();g.arc(0,0,10,0,TAU);g.stroke();for(let i=0;i<4;i++){g.save();g.rotate(i*Math.PI/2);hdLine(g,[0,-16],[0,-7],col,2);g.restore();}diamond(g,0,0,3,col);}
 else if(t?.type==='poi'){g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.roundRect(-12,-9,26,18,4);g.stroke();hdPoly(g,[[-5,9],[-8,16],[3,9]],col);for(let i=-5;i<=5;i+=5)circle(i,0,1.5,col);}
 else if(btn||modal||mode!=='play'){hdPoly(g,[[0,0],[4,22],[9,15],[16,24],[21,20],[13,12],[23,10]],col,'#203337',1.5);}
 else{g.strokeStyle=col;g.lineWidth=1.5;g.beginPath();g.ellipse(0,0,10,6,0,0,TAU);g.stroke();diamond(g,0,0,4,col);hdLine(g,[0,-11],[0,-6],col,1.5);hdLine(g,[-13,0],[-8,0],col,1.5);hdLine(g,[13,0],[8,0],col,1.5);}g.restore();
 if(t?.type==='poi'){const d=V8_INFO[t.id];if(d){const sx=clamp(x+18,8,W-210),sy=clamp(y+18,8,H-60);box(sx,sy,200,47,'#132c31f2','#91ac95',4);text(d.name+' · '+d.role,sx+10,sy+14,12,d.trim,'left','bold');text('Nhấp để tới gần · '+(t.o.task||'Đối thoại'),sx+10,sy+32,11,C.paper);}}}
const v8Draw=draw;draw=function(){v8Draw();v8Cursor();if(v8NameInput?.style){const show=mode==='menu'&&V8.menuPage==='create';v8NameInput.style.display=show?'block':'none';if(show){const r=cv.getBoundingClientRect(),sx=r.width/W,sy=r.height/H;Object.assign(v8NameInput.style,{left:(r.left+162*sx)+'px',top:(r.top+596*sy)+'px',width:300*sx+'px',height:36*sy+'px',fontSize:Math.max(11,15*sy)+'px'});}}};

// Original arena assets and gameplay are preserved.
