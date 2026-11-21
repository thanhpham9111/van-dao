'use strict';
// V28: persisted five-tier expeditions, seal route, formations and guardian rewards.
const V28={layout:null,serial:0,clock:0};
const V28_ROUTE={intro:{name:'Vạn Giới Bí Cảnh',level:10,regions:['truc','yeu','tram','tuyet','hoa'],hidden:'Cổ Linh Thủ Hộ',hiddenProfile:'quy'},ma:{name:'Ma Vực Thiên Uyên',level:37,regions:['phong','quy','ma','loi','ma'],hidden:'Vô Cực Ma Tôn',hiddenProfile:'loi'}};
const V28_FLOOR={truc:['Thanh Trúc Trận',[0,1,4],0],yeu:['Huyết Lang Đài',[8,9,0],1],tram:['Hắc Độc Trạch',[5,4,10],3],tuyet:['Hàn Băng Cung',[2,1,4],2],hoa:['Xích Viêm Uyên',[6,9,5],5],phong:['Thiên Phong Nhai',[0,8,10],0],quy:['U Minh Cổ Mộ',[2,4,10],6],ma:['Ma Khôi Điện',[11,4,6],7],loi:['Tử Lôi Thiên Đài',[2,11,6],7]};
const V28_ITEMS={truc:['Trúc Lang Nha Kiếm','weapon','Mộc',18,0,'reach','attack',7],yeu:['Huyết Lang Hộ Uyển','accessory','Hỏa',12,5,'blood','leech',5],tram:['Hắc Độc Chu Ti','armor','Mộc',3,21,'','def',7],tuyet:['Băng Quân Hàn Kiếm','weapon','Thủy',27,0,'frost','crit',.035],hoa:['Xích Viêm Xà Tâm','accessory','Hỏa',18,7,'fire','attack',10],phong:['Thiên Phong Vũ Y','armor','Kim',8,28,'fast','speed',18],quy:['U Minh Hồn Ngọc','accessory','Thủy',20,10,'','mp',30],ma:['Ma Vực Trấn Giáp','armor','Thổ',7,38,'','hp',65],loi:['Tử Lôi Thiên Kiếm','weapon','Lôi',42,0,'fast','crit',.05],hidden_intro:['Cổ Linh Thiên Ấn','accessory','Mộc',24,14,'blood','regen',2.8],hidden_ma:['Vô Cực Ma Kiếm','weapon','Lôi',48,0,'heavy','attack',18]};
const V28_GEAR={};for(const [key,v] of Object.entries(V28_ITEMS)){const [name,slot,element,atk,def,style,affix,value]=v,id=EQUIPMENT.length;EQUIPMENT.push({id,name,sheet:slot==='weapon'?'divine':'gear',index:slot==='armor'?1:slot==='accessory'?7:8,slot,element,atk,def,style,v28Boss:key,v28Affix:{k:affix,v:value}});V28_GEAR[key]=id;}
const V28_HIDDEN={};for(const key of ['intro','ma']){const id=TYPES.length,base=TYPES[7];TYPES.push({...base,name:V28_ROUTE[key].hidden,boss:true,spriteType:7,color:key==='intro'?'#d1ba78':'#c98afa',hp:base.hp*1.25,atk:base.atk*1.12});V28_HIDDEN[key]=id;imgs['v25mob'+id]=imgs.v25mob7;imgs['v25mobHit'+id]=imgs.v25mobHit7;}
function v28State(){p.v28??={serial:0,history:{},run:null};p.v28.history??={};return p.v28;}
function v28Run(){return p&&!p.worldMode&&p.v28?.run?.active?p.v28.run:null;}
const v28GenerateOld=generateWorld;
generateWorld=function(sd,floor=0){if(!V28.layout)return v28GenerateOld(sd,floor);const d=V28_ROUTE[V28.layout];MAPS.length=BLOCKS.length=ROOM_NAMES.length=0;const rand=v21Seeded(((sd||1)^Math.imul(V28.serial+1,72583)^(v29Layout().layoutSeed||0))>>>0);
 for(let i=0;i<5;i++){const key=v29Layout().regions[i],f=V28_FLOOR[key],b=BASE_MAPS[f[2]];for(let j=0;j<2;j++){const n=i*2+j,m={...b,name:'Tầng '+(i+1)+' · '+f[0]+(j?' · Thủ hộ':' · Khảo nghiệm'),sub:j?'Phá trận nhãn · hạ thủ hộ':'Tiêu diệt yêu thú · tìm ấn ký',pool:f[1],hazards:[],v28Floor:i+1,v28Region:key,v28Stage:j?'boss':'trial',v28Rune:!j&&[0,2,4].includes(i),secret:false};delete m.boss;if(j)m.boss=V22_REG[key].bossType;MAPS.push(m);ROOM_NAMES.push(m.name);BLOCKS.push(j?[]:[{x:425+rand()*75,y:310,r:28},{x:815+rand()*45,y:310,r:26}]);}}
 const key=d.hiddenProfile,f=V28_FLOOR[key],m={...BASE_MAPS[7],name:'Tầng ẩn · '+d.hidden,sub:'Trận pháp cổ đại · Boss ẩn',pool:f[1],hazards:[],boss:V28_HIDDEN[V28.layout],v28Floor:6,v28Region:key,v28Stage:'hidden',secret:false};MAPS.push(m);ROOM_NAMES.push(m.name);BLOCKS.push([]);LAST=MAPS.length-1;};
// New runs get unique loot scopes, avoiding duplicate drops on repeated expeditions.
const v28ScopeOld=v21Scope;v21Scope=function(){const r=v28Run();return r?'arena28:'+r.serial+':'+room:v28ScopeOld();};
function v28RoomState(){const r=v28Run();if(!r)return null;r.rooms??={};return r.rooms[room]??=( {sigil:false,broken:[],pulse:0,elapsed:0,formed:false,defeated:false});}
function v28Nodes(){const m=MAPS[room],r=v28Run();if(!r||!m)return [];return m.v28Stage==='hidden'?[{x:265,y:245},{x:1015,y:245},{x:640,y:480}]:m.v28Stage==='boss'?[{x:310,y:285},{x:970,y:285}]:[];}
function v28Rune(){return {x:640,y:195};}
function v28ActiveNodes(){const rs=v28RoomState();return rs?v28Nodes().map((p,i)=>({...p,i})).filter(p=>!rs.broken.includes(p.i)):[];}
function v28BossKey(e){return e.v28Hidden?'hidden_'+e.v28Hidden:e.v28Region|| (p.worldMode?v22Region(e).id:e.type===3?'truc':'ma');}
const v28ProfileOld=v27Profile;v27Profile=function(e){if(e.v28Region&&bossType(e.type))return {role:'boss',pattern:V27_BOSS[e.v28Region]||V27_BOSS.ma};return v28ProfileOld(e);};
function v28TagBoss(){const m=MAPS[room];if(!v28Run()||!m?.v28Stage)return;for(const e of enemies){if(!bossType(e.type))continue;e.v28Region=m.v28Region;if(m.v28Stage==='hidden'){e.v28Hidden=V28.layout;e.max=Math.round(e.max*1.24);e.hp=e.max;e.v22Atk=Math.round(e.v22Atk*1.12);}e.v28OwnerId='a'+v28Run().serial+':'+room;e.v28Waves??=0;}}
const v28EnterRoomOld=enterRoom;enterRoom=function(n){v28EnterRoomOld(n);if(v28Run()){v28RoomState();v28TagBoss();save();}};
function v28Enter(route,o){const d=V28_ROUTE[route];if(!p.worldBossDead||p.level<d.level){message('Cần hạ Trúc Lang Vương và đạt Lv '+d.level+' để vào '+d.name);return false;}const s=v28State();s.serial++;s.run={active:true,route,serial:s.serial,sigils:[],rooms:{},bosses:[],return:{id:o.region,x:p.x,y:p.y},started:p.worldTime||0,v29:V29.config};V28.layout=route;V28.serial=s.serial;v22State().dungeonBase=d.level;p.owEnemies=enemies.filter(e=>!e.dead);p.owDrops=drops;p.worldMode=false;room=0;tower=0;p.visited=[];generateWorld(seed,s.serial);enterRoom(0);message(d.name+' · 5 tầng · tìm 3 bí ấn');save();return true;}
const v28InteractOld=v8InteractAt;v8InteractAt=function(o){if(o?.kind==='dungeon')return v28Enter(o.id==='dungeon'?'ma':'intro',o);return v28InteractOld(o);};
const v28ResumeOld=resume;resume=function(){let d;try{d=JSON.parse(localStorage.getItem(SAVE)||'null');}catch{}const r=d?.p?.v28?.run;V28.layout=r?.active&&!d.p.worldMode&&V28_ROUTE[r.route]?r.route:null;V28.serial=r?.serial||0;v28ResumeOld();if(p&&v28Run()){v28State();v28RoomState();save();}};
const v28StartOld=start;start=function(...a){V28.layout=null;return v28StartOld(...a);};
function v28Finish(success=true,retreat=false){
 const r=v28Run();
 if(!r)return;
 const hp=p.hp,mp=p.mp;
 const history=v28State().history[r.route]??={clears:0,hidden:0};
 const hidden=r.bosses.includes('hidden_'+r.route);
 const result=success?{route:r.route,difficulty:r.v29?.diff??0,hidden,seals:r.sigils.length,
   seconds:r.v29?Math.round(r.v29.seconds||0):null}:null;
 if(success){
  history.clears++;
  if(hidden)history.hidden++;
 }else if(retreat)history.retreats=(history.retreats||0)+1;
 else history.fails=(history.fails||0)+1;
 r.active=false;
 const ret=r.return;
 v21State().loot=v21State().loot.filter(a=>!a.scope.startsWith('arena28:'+r.serial+':'));
 V28.layout=null;
 enterWorld(ret?.id||'thon',300);
 if(ret&&regionAt(ret.x,ret.y).id===ret.id&&!owBlocked(ret.x,ret.y,16)){
  p.x=ret.x;p.y=ret.y;
  owCamera={x:clamp(p.x-W/2,0,OW.w-W),y:clamp(p.y-H/2,0,OW.h-H)};
 }
 const stats=currentStats();
 p.hp=retreat?clamp(hp,1,stats.hp):success?Math.min(stats.hp,p.hp+36):Math.round(stats.hp*.5);
 p.mp=retreat?clamp(mp,0,stats.mp):stats.mp;
 if(result){
  p.v451Result=result;
  modal={kind:'v451Result'};
 }
 message(success?'Đã chinh phục '+V28_ROUTE[r.route].name:
   retreat?'Đã rút lui · giữ vật phẩm đã nhặt':'Bí cảnh thất bại · trở về Cửu Vực và giữ vật phẩm đã nhặt');
 save();
}
function v28InteractRoom(){const r=v28Run(),m=MAPS[room],rs=v28RoomState();if(!r)return false;const n=v28ActiveNodes().find(o=>dist(o,p)<78);if(n){rs.broken.push(n.i);effect(n.x,n.y,'#ead8a2','ring',.65,{radius:65});message('Trận nhãn đã phá · '+rs.broken.length+'/'+v28Nodes().length);if(!v28ActiveNodes().length){rs.formed=false;message('TRẬN PHÁP TAN VỠ · Boss mất hộ trận');const e=enemies.find(e=>bossType(e.type)&&!e.dead);if(e){const a=v27AI(e);a.poise=Math.max(0,a.poise-25);}}save();return true;}if(m?.v28Rune&&!rs.sigil&&cleared&&dist(p,v28Rune())<82){rs.sigil=true;if(!r.sigils.includes(room))r.sigils.push(room);effect(640,195,'#ffe7a6','ring',1,{radius:100});message('Bí ấn '+r.sigils.length+'/3 · mở tầng ẩn');save();return true;}return false;}
const v28AdvanceOld=advance;
advance=function(){
 if(!v28Run())return v28AdvanceOld();
 if(modal||v28InteractRoom())return;
 if(!cleared){message('Hạ yêu thú còn lại · E gần trận nhãn để phá trận');return;}
 v451DungeonNext();
};
function v451DungeonNext(){
 const r=v28Run();
 if(!r||modal||!cleared)return;
 const missing=MAPS[room].v28Rune&&!v28RoomState().sigil;
 if(missing||v21VisibleLoot().length){
  v8Cancel();V8.vx=V8.vy=0;
  modal={kind:'v451Next',serial:r.serial,room};
 }else v451DungeonProceed();
}
function v451DungeonProceed(){
 const r=v28Run();
 if(!r||!cleared)return;
 modal=null;
 if(room===LAST||(room===LAST-1&&r.sigils.length<3)){v28Finish();return;}
 v21State().loot=v21State().loot.filter(a=>a.scope!==v21Scope());
 if(room===LAST-1)message('Đã mở phong ấn · Boss ẩn thức tỉnh');
 travel(room+1);
}
function v451Retreat(){
 const r=v28Run();
 if(!r||mode!=='play')return;
 v8Cancel();V8.vx=V8.vy=0;mouse.left=mouse.fire=mouse.cast=false;
 modal={kind:'v451Retreat',serial:r.serial};
}
// Arena layouts are rebuilt on reload with the same expedition serial, not the old random route.
const v28OldTick=update;
function v28Formation(dt){const r=v28Run();if(!r||modal||cleared)return;const rs=v28RoomState(),nodes=v28ActiveNodes();if(!nodes.length||!enemies.some(e=>!e.dead&&bossType(e.type)))return;rs.elapsed+=dt;const cycle=4.6,phase=rs.elapsed%cycle,idx=Math.floor(rs.elapsed/cycle),m=MAPS[room];rs.formed=true;if(phase>=2.6&&rs.pulse<idx+1){rs.pulse=idx+1;const zone=v28FormationZone(m,idx);if(v27Inside(zone,p,12))v27Damage((m.v28Floor===6?28:12+m.v28Floor*3)*(r.route==='ma'?1.55:1)*v29Difficulty().atk,true);effect(zone.x,zone.y,'#f6b66c','ring',.45,{radius:zone.reach});}}
function v28FormationZone(m,idx){const k=(m.v28Floor+idx)%3;if(k===0)return {shape:'ring',x:640,y:355,angle:0,reach:270,inner:100};if(k===1)return {shape:'line',x:190,y:355,angle:0,reach:900,width:64};return {shape:'target',x:idx%2?895:385,y:365,angle:0,reach:142};}
update=function(dt){const r=v28Run();if(p&&mode==='play'&&!modal){V28.clock+=dt;if(r)v28Formation(dt);}v28OldTick(dt);if(r&&mode==='dead'){failed=false;mode='play';v28Finish(false);}};
// Summons are phase-limited and never generate experience, loot, quests or respawn records.
const V28_SUMMON={truc:0,yeu:8,tram:5,tuyet:2,hoa:6,phong:0,quy:4,ma:11,loi:2,hidden_intro:4,hidden_ma:11};
function v28Owner(e){return e.v28OwnerId??=(p.worldMode?'w:'+e.region+':'+e.type+':'+Math.round(e.homeX??e.x)+':'+Math.round(e.homeY??e.y):'a:'+tower+':'+room+':'+e.type);}
function v28Summon(e,world){if(e.dead||!bossType(e.type))return;const a=v27AI(e);if(['patrol','leash','stagger'].includes(a.mode)||dist(e,p)>460)return;const ratio=e.hp/e.max,goal=ratio<=.30?2:ratio<=.65?1:0;if((e.v28Waves||0)>=goal)return;const wave=(e.v28Waves||0)+1,key=v28BossKey(e),type=V28_SUMMON[key]??4,id=v28Owner(e);e.v28Waves=wave;
 const live=enemies.filter(n=>!n.dead&&n.v28Summon===id).length,count=Math.min(wave+1,4-live);for(let j=0;j<count;j++){let q=null;for(let k=0;k<14;k++){const angle=(j+1)*2.399+k*.63,x=e.x+Math.cos(angle)*(70+k*8),y=e.y+Math.sin(angle)*(70+k*8);if(!v8Blocked(x,y,17,world)&&dist({x,y},p)>48){q={x,y};break;}}if(!q)continue;const n=enemies.length;if(world)owSpawn(type,q.x,q.y);else spawn(type,q.x,q.y,false);if(enemies.length>n){const add=enemies.at(-1);add.v28Summon=id;add.hp=add.max=Math.round(add.max*.55);add.v22Atk=Math.round(add.v22Atk*.67);add.state='chase';add.cd=.7;effect(q.x,q.y,'#b9a1e5','ring',.8,{radius:38});}}if(count>0){v27Label(e,'TRIỆU HỒI · ĐỢT '+wave,'#d6b9f7');save();}}
const v28EnemyOld=v27Tick;v27Tick=function(e,dt,world){v28EnemyOld(e,dt,world);if(!e.dead&&mode==='play')v28Summon(e,world);};
// Guaranteed, named Boss loot on the ground. One fixed affix + regular random affixes.
function v28CleanSummons(e){const id=v28Owner(e),r=v28Run();for(const a of enemies)if(a.v28Summon===id&&!a.dead){a.dead=true;effect(a.x,a.y,'#b9a1e5','ring',.45,{radius:40});}if(r)v28RoomState().defeated=true;}
const v28DeathOld=v21DeathLoot;v21DeathLoot=function(e,stats){if(e.v28Summon)return;v28DeathOld(e,stats);if(!bossType(e.type))return;v28CleanSummons(e);const key=v28BossKey(e),id=V28_GEAR[key];if(id==null)return;const def=EQUIPMENT[id],r=v28Run(),region=V22_REG[e.v28Region]||(p.worldMode?v22Region(e):V22_REG[key])||V22_REG.truc,q=e.v28Hidden?(e.v28Hidden==='ma'?7:5):Math.min(7,Math.max(2,region.qlo+1)),req=e.v28Hidden?(e.v28Hidden==='ma'?37:10):Math.min(p.worldMode?region.max:45,v22EnemyLevel(e));const item={id,quality:q,up:0,req,origin:key,v28Exclusive:true};v21Prepare(item);item.affixes=item.affixes.filter(a=>a.k!==def.v28Affix.k);item.affixes.unshift({...def.v28Affix});v21MakeLoot('gear',e.x-38,e.y+24,item);if(r&&!r.bosses.includes(key))r.bosses.push(key);effect(e.x-38,e.y+24,QUALITY_COL[q],'beam',1,{radius:44});v21Say('BOSS RƠI · '+def.name);save();};
const v28HitOld=hit;hit=function(e,dmg,crit=false){if(e.dead)return;const boss=bossType(e.type),r=v28Run();if(boss&&r&&v28ActiveNodes().length)dmg*=.68;v28HitOld(e,dmg,crit);};
// Render formation geometry and interaction points using the existing arena lighting style.
function v28SealDraw(x,y,col,label,active=true){g.save();g.translate(x,y);hdEllipse(g,0,4,28,11,'#111b2190');g.globalAlpha=active?1:.28;g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.ellipse(0,0,31,17,0,0,TAU);g.stroke();seal(g,0,-9,23,col,elapsed*.5,.85);if(active){g.shadowColor=col;g.shadowBlur=9;diamond(g,0,-35+Math.sin(elapsed*3)*4,9,col);g.shadowBlur=0;}text(label,0,30,11,col,'center','bold');g.restore();}
function v28Render(){const r=v28Run(),m=MAPS[room];if(!r||!m)return;const rs=v28RoomState(),nodes=v28Nodes();for(let i=0;i<nodes.length;i++){const n=nodes[i],active=!rs.broken.includes(i);v28SealDraw(n.x,n.y,active?'#c7a7ed':'#859993',active?'TRẬN NHÃN · E':'ĐÃ PHÁ',active);}if(m.v28Rune)v28SealDraw(640,195,rs.sigil?'#83b8ae':'#f7d88a',rs.sigil?'ĐÃ THU ẤN':cleared?'BÍ ẤN · E':'BÍ ẤN · hạ quái',!rs.sigil);
 if(rs.formed&&!cleared&&v28ActiveNodes().length){const phase=rs.elapsed%4.6,idx=Math.floor(rs.elapsed/4.6),zone=v28FormationZone(m,idx);if(phase<3.1)v27Zone(zone,zone,'#f6b66c',phase<2.6?phase/2.6:(phase-2.6)/.5,false,phase>=2.6);}}
const v28RenderOld=renderEffects;renderEffects=function(){v28RenderOld();v28Render();};
function v28HUD(){const r=v28Run(),m=MAPS[room];if(!r||!m||modal)return;const rs=v28RoomState(),nodes=v28Nodes(),left=v28ActiveNodes().length;v21Frame(1004,112,264,136,'#b7a17e');text(m.v28Stage==='hidden'?'TẦNG ẨN · CẤM ĐỊA':'TẦNG '+m.v28Floor+'/5 · '+(m.v28Stage==='boss'?'THỦ HỘ':'KHẢO NGHIỆM'),1016,128,12,'#f4d599','left','bold');for(let i=0;i<5;i++){const x=1025+i*48,done=room>=i*2+2;v21Frame(x,144,39,26,done?'#97c5ac':m.v28Floor===i+1?'#e0bd75':'#5e696a',m.v28Floor===i+1);text(i+1,x+19,157,12,done?'#afdec5':'#ecd8ab','center','bold');}text('Bí ấn: '+r.sigils.length+'/3  '+(r.sigils.length===3?' · ĐÃ MỞ ẨN':'') ,1016,188,12,'#edcb8f');text(nodes.length?'Trận nhãn: '+(nodes.length-left)+'/'+nodes.length+' · E phá':m.v28Rune&&!rs.sigil?'Bí ấn phía Bắc · sau khi dẹp quái':'Hạ toàn bộ yêu thú',1016,210,11,'#c7d9cf');text(cleared?'E · Tiến tầng / rời bí cảnh':left?'Vùng vàng: sát thương trận pháp':'RMB / 1–3 · kỹ năng',1016,231,11,'#cbc6a5');}

// Mark exclusive pieces directly in tooltips and retain fixed affix in the real stats.
const v28ToolOld=v21Tooltip;v21Tooltip=function(item,x,y,w,ground=false){v28ToolOld(item,x,y,w,ground);if(gearDef(item)?.v28Boss){g.save();box(x+w-117,y+74,105,17,'#5b432f','#d8b174',3);text('BOSS ĐỘC QUYỀN',x+w-64,y+82,9,'#fff0b8','center','bold');g.restore();}};

