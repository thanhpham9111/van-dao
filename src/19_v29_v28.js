'use strict';
// V29 · randomized expeditions, four difficulties, 11 three-piece boss sets, world events.
const V29_D=[
 {name:'Thường',col:'#a7d8bd',hp:1,atk:1,loot:1,q:0,lv:0,prev:-1},
 {name:'Khó',col:'#84c9e9',hp:1.35,atk:1.22,loot:1.5,q:1,lv:3,prev:0},
 {name:'Ác Mộng',col:'#c5a0ef',hp:1.8,atk:1.5,loot:2.1,q:2,lv:6,prev:1},
 {name:'Địa Ngục',col:'#ff9a74',hp:2.5,atk:1.9,loot:3,q:3,lv:9,prev:2}
];
const V29_MOD=[
 {name:'Linh khí dồi dào',hint:'Linh thạch +25%',hp:1,atk:1,loot:1.25,col:'#9adbb7'},
 {name:'Thiết Bì',hint:'Quái +25% sinh lực',hp:1.25,atk:1,loot:1.15,col:'#a6c5e5'},
 {name:'Huyết Sát',hint:'Quái +20% công kích',hp:1,atk:1.2,loot:1.2,col:'#ed9c85'},
 {name:'Tinh Anh',hint:'Quái tinh anh +18% sinh lực',hp:1.18,atk:1.08,loot:1.25,col:'#dfc18d'}
];
const V29={config:null,choice:0,tick:0,tracked:null};
function v29State(){if(!p.v29){p.v29={records:{},events:{},serial:0};for(const [key,h] of Object.entries(p.v28?.history||{}))p.v29.records[key+':0']={clears:h.clears||0,hidden:h.hidden||0,best:null};}p.v29.records??={};p.v29.events??={};return p.v29;}
function v29Layout(){const r=v28Run();return V29.config||r?.v29||{regions:V28_ROUTE[V28.layout].regions,diff:0,mods:Array(5).fill(-1)};}
function v29Config(route,diff,serial){const r=v21Seeded(((seed||1)^Math.imul(serial+1,1597334677))>>>0),regions=V28_ROUTE[route].regions.slice();for(let i=regions.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[regions[i],regions[j]]=[regions[j],regions[i]];}const last=v29State().lastLayouts?.[route];if(last&&last.join()===regions.join())regions.push(regions.shift());const mods=regions.map(()=>Math.floor(r()*V29_MOD.length));return {regions,diff,mods,layoutSeed:Math.floor(r()*4294967295)};}
function v29Record(route,diff){return v29State().records[route+':'+diff]||{clears:0,hidden:0,best:null};}
function v29Unlocked(route,diff){const d=V29_D[diff],lv=Math.min(45,V28_ROUTE[route].level+d.lv);return p.worldBossDead&&p.level>=lv&&(d.prev<0||v29Record(route,d.prev).clears>0);}
function v29Difficulty(){return V29_D[v28Run()?.v29?.diff??0];}
function v29Mod(){const r=v28Run(),m=MAPS[room];return V29_MOD[r?.v29?.mods?.[m?.v28Floor-1]]||V29_MOD[0];}
function v29Enter(route,o,diff){if(!v29Unlocked(route,diff)){message('Chưa đủ điều kiện độ khó');return false;}const s=v29State(),serial=(p.v28?.serial||0)+1;V29.config=v29Config(route,diff,serial);s.lastLayouts??={};s.lastLayouts[route]=V29.config.regions.slice();modal=null;const ok=v28Enter(route,o);V29.config=null;if(ok){message(V28_ROUTE[route].name+' · '+V29_D[diff].name+' · cảnh giới ngẫu nhiên');save();}return ok;}
const v29InteractOld=v8InteractAt;
v8InteractAt=function(o){if(o?.kind!=='dungeon')return v29InteractOld(o);const route=o.id==='dungeon'?'ma':'intro';if(!v29Unlocked(route,0)){message('Cần Lv '+V28_ROUTE[route].level+' và hạ Trúc Lang Vương');return false;}V29.choice=0;modal={kind:'v29difficulty',route,gate:o.id};v8Cancel();return true;};

// resume_L10: lớp 19_v29_v28 (trước đây lưu lớp dưới vào v29ResumeOld). Gọi lớp dưới: resume_L09.
function resume_L10(){let data;try{data=JSON.parse(localStorage.getItem(SAVE)||'null');}catch{}const r=data?.p?.v28?.run;V29.config=r?.active?r.v29||null:null;resume_L09();V29.config=null;if(p){v29State();if(p.worldMode)v29WorldTick(true);save();}}
const v29SpawnOld=spawn;
spawn=function(...a){const n=enemies.length;v29SpawnOld(...a);if(enemies.length<=n||!v28Run()?.v29)return;const e=enemies.at(-1),d=v29Difficulty(),m=v29Mod();e.max=Math.round(e.max*d.hp*m.hp);e.hp=e.max;e.v22Atk=Math.round(e.v22Atk*d.atk*m.atk);};
const v29FinishOld=v28Finish;
v28Finish=function(success=true,retreat=false){const r=v28Run();if(r&&success){const s=v29State(),key=r.route+':'+(r.v29?.diff||0),h=s.records[key]??={clears:0,hidden:0,best:null};h.clears++;if(r.bosses.includes('hidden_'+r.route))h.hidden++;if(r.v29){const sec=Math.round(r.v29.seconds||0);if(h.best===null||sec<h.best)h.best=sec;p.stones+=Math.round(20*v29Difficulty().loot);}}return v29FinishOld(success,retreat);};

// Every guardian supplies a full set; V28 original gear remains a valid part.
const V29_SET_NAMES={truc:'Thanh Trúc Lang',yeu:'Huyết Lang',tram:'Hắc Độc',tuyet:'Bắc Minh',hoa:'Xích Viêm',phong:'Thiên Phong',quy:'U Minh',ma:'Ma Vực',loi:'Tử Lôi',hidden_intro:'Cổ Linh',hidden_ma:'Vô Cực'};
const V29_SET_BONUS={
 truc:{two:'Công +12%',three:'Sinh lực +75 · tốc đánh +12%',a:{attackPct:.12},b:{hp:75,ratePct:.12}},
 yeu:{two:'Công +10% · hồi máu +5',three:'Chí mạng +8% · sinh lực +65',a:{attackPct:.10,leech:5},b:{crit:.08,hp:65}},
 tram:{two:'Thủ +22',three:'Sinh lực +110 · hồi linh +3',a:{def:22},b:{hp:110,regen:3}},
 tuyet:{two:'Chí mạng +7%',three:'Công +18% · thủ +18',a:{crit:.07},b:{attackPct:.18,def:18}},
 hoa:{two:'Công +15%',three:'Thiêu đốt +12 · chí mạng +6%',a:{attackPct:.15},b:{burn:12,crit:.06}},
 phong:{two:'Thân pháp +30',three:'Tốc đánh +20% · công +15%',a:{speed:30},b:{ratePct:.2,attackPct:.15}},
 quy:{two:'Linh lực +60',three:'Hồi linh +6 · công +20%',a:{mp:60},b:{regen:6,attackPct:.2}},
 ma:{two:'Thủ +35',three:'Sinh lực +180 · công +15%',a:{def:35},b:{hp:180,attackPct:.15}},
 loi:{two:'Chí mạng +10%',three:'Công +25% · tốc đánh +18%',a:{crit:.10},b:{attackPct:.25,ratePct:.18}},
 hidden_intro:{two:'Công +15% · thủ +15',three:'Sinh lực +120 · hồi linh +5',a:{attackPct:.15,def:15},b:{hp:120,regen:5}},
 hidden_ma:{two:'Công +22% · chí mạng +5%',three:'Tốc đánh +25% · sinh lực +150',a:{attackPct:.22,crit:.05},b:{ratePct:.25,hp:150}}
};
const V29_SETS={};
for(const [key,name] of Object.entries(V29_SET_NAMES)){
 const base=EQUIPMENT[V28_GEAR[key]],region=V22_REG[key],lv=region?.min??(key==='hidden_ma'?37:10),ids=[base.id];base.v29Set=key;
 for(const slot of ['weapon','armor','accessory'])if(slot!==base.slot){const id=EQUIPMENT.length,weapon=slot==='weapon',armor=slot==='armor',atk=weapon?Math.round(14+lv*.66):armor?Math.round(2+lv*.14):Math.round(8+lv*.28),def=weapon?0:armor?Math.round(13+lv*.73):Math.round(3+lv*.24);EQUIPMENT.push({id,name:name+' '+(weapon?'Kiếm':armor?'Pháp Y':'Linh Hoàn'),slot,element:base.element,sheet:weapon?'divine':'gear',index:weapon?8:armor?1:7,atk,def,style:weapon?base.style:'',v28Boss:key,v29Set:key});ids.push(id);}
 V29_SETS[key]={key,name,ids,...V29_SET_BONUS[key]};
}
function v29EquippedSets(){const c={};for(const i of Object.values(p.worn||{})){const k=gearDef(p.gear[i])?.v29Set;if(k)c[k]=(c[k]||0)+1;}return c;}
const v29EquipStatsOld=equipStats;
equipStats=function(s){v29EquipStatsOld(s);for(const [key,n] of Object.entries(v29EquippedSets())){const d=V29_SETS[key];for(const b of [n>=2?d.a:null,n>=3?d.b:null])if(b)for(const [k,v] of Object.entries(b)){if(k==='attackPct')s.attack*=1+v;else if(k==='ratePct')s.rate*=1+v;else s[k]=(s[k]||0)+v;}}};
function v29SetDrop(e,key,quality){const set=V29_SETS[key];if(!set)return;const owned=new Set(p.gear.map(it=>it.id));for(const a of v21VisibleLoot())if(a.item)owned.add(a.item.id);let pool=set.ids.filter(id=>!owned.has(id));if(!pool.length)pool=set.ids;const id=pool[Math.floor(random()*pool.length)],item={id,quality,up:0,req:Math.min(45,v22EnemyLevel(e)),origin:key,v28Exclusive:true};v21Prepare(item);const fixed=EQUIPMENT[id].v28Affix;if(fixed){item.affixes=item.affixes.filter(a=>a.k!==fixed.k);item.affixes.unshift({...fixed});}v21MakeLoot('gear',e.x+37,e.y+40,item);effect(e.x+37,e.y+40,QUALITY_COL[quality],'beam',1,{radius:42});v21Say('TRANG BỊ BỘ · '+EQUIPMENT[id].name);}
const v29DeathOld=v21DeathLoot;
v21DeathLoot=function(e,stats){if(e.v28Summon)return;const state=v21State(),n=state.loot.length;v29DeathOld(e,stats);const r=v28Run(),d=v29Difficulty(),m=r?.v29?v29Mod():{loot:1};if(r?.v29)for(const a of state.loot.slice(n)){if(a.kind==='stone')a.value=Math.round(a.value*d.loot*m.loot);if(a.item&&d.q){a.item.quality=Math.min(7,a.item.quality+d.q);const fixed=gearDef(a.item)?.v28Affix;delete a.item.affixes;v21Prepare(a.item);if(fixed){a.item.affixes=a.item.affixes.filter(x=>x.k!==fixed.k);a.item.affixes.unshift({...fixed});}}}if(bossType(e.type)){const k=v28BossKey(e),base=state.loot.slice(n).find(a=>a.item?.id===V28_GEAR[k]),q=clamp((base?.item?.quality??3)+(e.v29World?2:0),2,7);if(e.v29World||r?.v29?.diff>0||random()<.65)v29SetDrop(e,k,q);if(e.v29World){const ev=v29Event(e.v29World);ev.ready=(p.worldTime||0)+V29_WORLD[e.v29World].respawn;ev.kills++;ev.x=ev.y=null;v21MakeLoot('stone',e.x,e.y-38,null,90+v22EnemyLevel(e)*3);v21Say('THIÊN KIẾP · '+TYPES[e.type].name+' đã bị tiêu diệt');}}save();};

// World bosses are independent of regional guardians, on active play time, persisted after reload.
const V29_WORLD={
 truc:{name:'Vạn Mộc Cự Linh',region:'truc',wait:30,respawn:180,level:12,col:'#b7ed9d',sprite:4},
 hoa:{name:'Cửu U Hỏa Long',region:'hoa',wait:60,respawn:240,level:28,col:'#ffb273',sprite:6},
 loi:{name:'Thiên Lôi Ma Thần',region:'loi',wait:90,respawn:300,level:45,col:'#c4b1ff',sprite:7}
};
for(const [key,d] of Object.entries(V29_WORLD)){d.type=TYPES.length;TYPES.push({...TYPES[7],name:d.name,boss:true,spriteType:d.sprite,color:d.col});imgs['v25mob'+d.type]=imgs['v25mob'+d.sprite]||imgs.v25mob7;imgs['v25mobHit'+d.type]=imgs['v25mobHit'+d.sprite]||imgs.v25mobHit7;}
function v29Event(key){const s=v29State(),d=V29_WORLD[key];return s.events[key]??={ready:(p.worldTime||0)+d.wait,kills:0,x:null,y:null};}
function v29WorldPos(d){const r=REG[d.region];for(let i=0;i<80;i++){const a=i*2.399,rad=360+Math.floor(i/10)*40,x=r.x+Math.cos(a)*rad,y=r.y+Math.sin(a)*rad;if(regionAt(x,y).id===d.region&&!owBlocked(x,y,24)&&!enemies.some(e=>!e.dead&&bossType(e.type)&&dist(e,{x,y})<145))return {x,y};}return null;}
function v29WorldTick(force=false){if(!p?.worldMode||mode!=='play')return;for(const [key,d] of Object.entries(V29_WORLD)){const s=v29Event(key),alive=enemies.find(e=>!e.dead&&e.v29World===key);if(alive){s.x=alive.homeX??alive.x;s.y=alive.homeY??alive.y;continue;}if((p.worldTime||0)<s.ready)continue;const z=v29WorldPos(d);if(!z)continue;const n=enemies.length;owSpawn(d.type,z.x,z.y);if(enemies.length<=n)continue;const e=enemies.at(-1);e.v29World=key;e.v28OwnerId='world29:'+key+':'+s.kills;e.v22Lv=d.level;e.max=e.hp=Math.round((480+d.level*77+d.level*d.level*.4)*2.15);e.v22Atk=Math.round((15+d.level*2.9)*1.45);s.x=z.x;s.y=z.y;message('THIÊN KIẾP GIÁNG LÂM · '+d.name);save();}}



// update_L12: lớp 19_v29_v28 (trước đây lưu lớp dưới vào v29TickOld). Gọi lớp dưới: update_L11.
function update_L12(dt){if(modal?.kind?.startsWith('v29')&&pressed.Escape){modal=null;delete pressed.Escape;}if(p&&mode==='play'&&!modal&&v28Run()?.v29)v28Run().v29.seconds=(v28Run().v29.seconds||0)+dt;update_L11(dt);if(p&&mode==='play'&&p.worldMode&&!modal){V29.tick+=dt;if(V29.tick>=1){V29.tick=0;v29WorldTick();}}}
// start_L08: lớp 19_v29_v28 (trước đây lưu lớp dưới vào v29StartOld). Gọi lớp dưới: start_L07.
function start_L08(...a){V29.config=null;V29.tick=0;start_L07(...a);v29WorldTick(true);save();}

// UI: choose risk, see actual bonuses and use the independent world event board.
function v29PanelBase(title,sub){g.fillStyle='#040a10e9';g.fillRect(0,0,W,H);v21Frame(74,58,1132,604,V21.gold);v18Title(title,104,91,27,V21.gold);text(sub,105,120,12,V21.muted);v21Button(1121,77,62,33,'×',()=>modal=null);}
function v29DifficultyPanel(){const route=modal.route,def=V28_ROUTE[route],i=V29.choice,d=V29_D[i];v29PanelBase('BÍ CẢNH · '+def.name,'5 tầng · 10 phòng · 3 bí ấn mở Boss ẩn · mỗi lượt đổi thứ tự và thuộc tính');V29_D.forEach((a,j)=>{const x=105+j*270,un=v29Unlocked(route,j),record=v29Record(route,j);v21Frame(x,148,250,240,a.col,i===j);text(a.name.toUpperCase(),x+125,177,20,a.col,'center','bold');text('Sinh lực quái ×'+a.hp,x+125,215,13,V21.paper,'center');text('Công kích quái ×'+a.atk,x+125,243,13,V21.paper,'center');text('Linh thạch ×'+a.loot,x+125,271,13,a.col,'center');text('Phẩm chất +'+a.q+' bậc',x+125,298,12,V21.paper,'center');text('Mở từ cấp '+Math.min(45,def.level+a.lv)+' · '+(j?'qua '+V29_D[j-1].name:'hạ Trúc Lang Vương'),x+125,326,11,V21.muted,'center');text(un?'Đã mở · '+record.clears+' lượt':'CHƯA MỞ',x+125,360,12,un?a.col:V21.red,'center','bold');buttons.push({x,y:148,w:250,h:240,fn:()=>V29.choice=j});});v21Frame(105,410,1060,117,d.col);text('ĐỘ KHÓ: '+d.name,125,433,16,d.col,'left','bold');text('Quái trong 10 phòng cấp '+def.level+'–'+Math.min(45,def.level+9)+' · Tầng ẩn cấp '+Math.min(45,def.level+10),125,465,13,V21.paper);
 text('Độ khó tăng sinh lực và sát thương. Vượt mức trước để mở mức tiếp theo.',125,495,12,V21.muted);v21Button(793,555,372,61,v29Unlocked(route,i)?'KHAI MỞ BÍ CẢNH':'CHƯA ĐỦ ĐIỀU KIỆN',()=>{const o=OW_POI.find(o=>o.id===modal.gate);if(o)v29Enter(route,o,i);},v29Unlocked(route,i));text('Vượt ải lần trước: '+v29Record(route,i).clears+' · Boss ẩn: '+v29Record(route,i).hidden,105,582,13,V21.paper);}
function v29WorldPanel(){v29PanelBase('THIÊN KIẾP · BOSS THẾ GIỚI','Độc lập với Boss thủ hộ vùng · thời gian tính khi đang chơi ngoài Cửu Vực');Object.entries(V29_WORLD).forEach(([key,d],i)=>{const ev=v29Event(key),e=enemies.find(a=>!a.dead&&a.v29World===key),x=105+i*357,sec=Math.max(0,Math.ceil(ev.ready-p.worldTime));v21Frame(x,153,337,398,d.col);text(d.name,x+168,183,21,d.col,'center','bold');text(REG[d.region].name+' · Lv '+d.level,x+168,219,13,V21.paper,'center');const im=imgs['v25mob'+d.type];if(im?.ready){const pic=im.img,f=Math.min(168/pic.naturalWidth,124/pic.naturalHeight),w=pic.naturalWidth*f,h=pic.naturalHeight*f;g.drawImage(pic,x+168-w/2,239+(124-h)/2,w,h);}text(e?'ĐANG XUẤT HIỆN':sec?'Còn '+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0'):'Đang thức tỉnh',x+168,377,15,e?d.col:V21.muted,'center','bold');text('Bộ '+V29_SETS[key].name+' · phẩm cao',x+168,411,12,V21.paper,'center');text('Đã hạ '+ev.kills+' lần · '+(e?'X '+Math.round(e.homeX)+'  Y '+Math.round(e.homeY):'Hồi sinh '+d.respawn/60+' phút'),x+168,439,12,V21.muted,'center');v21Button(x+16,479,305,47,e?'Theo dõi trên bản đồ':'Xem khu vực',()=>{V29.tracked=key;v22Selected=d.region;modal={kind:'map',v16Map:'world'};},!!e);});text('Boss thế giới mạnh hơn thủ hộ thường; có triệu hồi quái, liên chiêu và cuồng bạo.',105,591,13,V21.muted);}

function v29SetsPanel(){v29PanelBase('LINH BẢO · CỘNG HƯỞNG BỘ','2 món kích hoạt cộng hưởng · 3 món mở toàn bộ sức mạnh');const equipped=v29EquippedSets();Object.values(V29_SETS).forEach((a,i)=>{const x=103+(i%3)*359,y=145+Math.floor(i/3)*120,n=equipped[a.key]||0;v21Frame(x,y,345,110,n>=2?V21.gold:'#647b7b',n===3);text(a.name+' · '+n+'/3',x+12,y+16,14,n>=2?V21.gold:V21.paper,'left','bold');text('2 món: '+a.two,x+12,y+42,11,n>=2?V21.green:V21.muted);text('3 món: '+a.three,x+12,y+65,11,n>=3?V21.green:V21.muted);text('Đã sở hữu '+a.ids.filter(id=>p.gear.some(it=>it.id===id)).length+'/3',x+12,y+89,11,V21.paper);});}
const v29InvOld=v21Inventory;v21Inventory=function(){v29InvOld();v21Button(683,55,210,32,'Bộ trang bị · cộng hưởng',()=>modal={kind:'v29sets'});};
const v29TooltipOld=v21Tooltip;v21Tooltip=function(item,x,y,w,ground=false){v29TooltipOld(item,x,y,w,ground);const k=gearDef(item)?.v29Set;if(k){const n=v29EquippedSets()[k]||0;v21Frame(x+w-168,y+70,157,18,'#baaa70',n>=2);text('BỘ '+V29_SETS[k].name.toUpperCase()+' · '+n+'/3',x+w-89,y+79,9,n>=2?V21.green:V21.gold,'center','bold');}};



