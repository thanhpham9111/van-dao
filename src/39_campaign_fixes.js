'use strict';
// v42_campaign_fixes.js
// V42 campaign regressions: NPCs relocated indoors in V36, but legacy gifting
// still measured the exterior coordinates. Use the true interior interaction
// anchor without mutating player position, economy formulas, or outdoor NPCs.
const v42CampaignGiftOld=v13Gift;
v13Gift=function(id){
 if(!V36_BY_ID[id])return v42CampaignGiftOld(id);
 const a=v36Inside();
 if(modal?.kind!=='npc8'||modal.npc!==id||a?.id!==id||dist(a,V36_NPC)>75)return false;
 const m=v13Memory(id);
 if(m.giftDay===v13Day()||!v13Adjust('herb',-1)){
  modal.line='Cần 1 linh thảo. Mỗi ngày chỉ tặng quà một lần.';return false;
 }
 m.giftDay=v13Day();m.gifts++;
 v8Bond(id,10);v13Event('gift',{});v13Log('Tặng quà '+V8_INFO[id].name);
 modal.line='Đa tạ đạo hữu! Ta sẽ nhớ ân tình này.';save();return true;
};

// V8 reroutes when blocked. Its legacy retry passes the already offset approach
// coordinate back into v8SetGoal; for newly generated landmarks this can drift
// a second time away from the objective. Always resolve the canonical landmark,
// which is guaranteed to have a free collision anchor, on every retry.
const v42CampaignGoalOld=v8SetGoal;
const v42CampaignLandmark=t=>t?.type==='poi'&&typeof t.id==='string'&&/^v42_(way|event)_/.test(t.id);
// Water/prop seams can be only six pixels wide. The old 15px LOS sample
// may miss one; an adjacent grid tile can also be free despite the edge
// between tiles being blocked. Validate every segment at 3px intervals.
function v42CampaignLine(a,b,r=16){
 const n=Math.max(1,Math.ceil(dist(a,b)/3));
 for(let i=1;i<=n;i++){const t=i/n;if(owBlocked(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,r))return false;}
 return true;
}
function v42CampaignPath(a,b){
 const d=dist(a,b);if(d<86)return [];
 const direct={x:b.x+(a.x-b.x)/d*68,y:b.y+(a.y-b.y)/d*68};
 if(v42CampaignLine(a,direct))return [direct];
 if(v42CampaignLine(a,b))return [b];
 // The coarse planner is fast for long journeys. Keep its route only when
 // every segment is demonstrably safe and the last point is in interaction
 // range; invoke denser A* only for genuinely problematic routes.
 for(const goal of [direct,b]){
  const coarse=v8Path(a,goal,true);let at=a,ok=coarse.length>0&&dist(coarse.at(-1),b)<=72;const repaired=[];
  for(const q of coarse){
   if(!ok)break;
   if(v42CampaignLine(at,q,14))repaired.push(q);
   else{const segment=v42CampaignDense(at,q,true,3000);if(!segment.length){ok=false;break;}repaired.push(...segment);}
   at=q;
  }
  if(ok)return repaired;
 }
 return v42CampaignDense(a,b,false,d>1600?6000:12000);
}
function v42CampaignDense(a,b,exact=false,maxNodes=12000){
 const step=24,key=(x,y)=>x+':'+y,pt=(x,y)=>({x:x*step,y:y*step}),cache=new Map(),edges=new Map();
 const free=(x,y)=>{const k=key(x,y);if(!cache.has(k))cache.set(k,!owBlocked(x*step,y*step,16));return cache.get(k);};
 const edge=(x,y,u,v)=>{const ka=key(x,y),kb=key(u,v),k=ka<kb?ka+'|'+kb:kb+'|'+ka;if(!edges.has(k))edges.set(k,v42CampaignLine(pt(x,y),pt(u,v)));return edges.get(k);};
 let from=null,near=Infinity;const gx=Math.round(a.x/step),gy=Math.round(a.y/step);
 for(let y=gy-4;y<=gy+4;y++)for(let x=gx-4;x<=gx+4;x++){const q=pt(x,y),s=dist(a,q);if(s<near&&free(x,y)&&v42CampaignLine(a,q,14)){near=s;from={x,y};}}
 if(!from)return [];
 const h=(x,y)=>Math.max(0,(dist(pt(x,y),b)-(exact?30:68))/step),heap=[],seen=new Map();
 function push(n){let i=heap.length;heap.push(n);while(i){const j=(i-1)>>1;if(heap[j].f<=n.f)break;heap[i]=heap[j];i=j;}heap[i]=n;}
 function pop(){const n=heap[0],t=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].f<heap[j].f)j++;if(heap[j].f>=t.f)break;heap[i]=heap[j];i=j;}heap[i]=t;}return n;}
 const root={...from,g:0,f:h(from.x,from.y),prev:null};seen.set(key(root.x,root.y),root);push(root);let end=null;
 for(let i=0;heap.length&&i<maxNodes;i++){
  const n=pop();if(seen.get(key(n.x,n.y))!==n)continue;if(h(n.x,n.y)===0&&(!exact||v42CampaignLine(pt(n.x,n.y),b,14))){end=n;break;}
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
   const x=n.x+dx,y=n.y+dy;if(!free(x,y)||dx&&dy&&(!free(n.x+dx,n.y)||!free(n.x,n.y+dy))||!edge(n.x,n.y,x,y))continue;
   const g=n.g+(dx&&dy?Math.SQRT2:1),k=key(x,y);if(seen.has(k)&&seen.get(k).g<=g)continue;const q={x,y,g,f:g+h(x,y),prev:n};seen.set(k,q);push(q);
  }
 }
 if(!end)return [];
 const raw=[];for(let n=end;n;n=n.prev)raw.push(pt(n.x,n.y));raw.reverse();if(exact&&dist(raw.at(-1),b)>1)raw.push(b);const out=[];let at=a,i=0;
 while(i<raw.length){let j=raw.length-1;while(j>i&&!v42CampaignLine(at,raw[j],14))j--;out.push(raw[j]);at=raw[j];i=j+1;}
 return out;
}
v8SetGoal=function(q,target=null){
 if(!p?.worldMode||!v42CampaignLandmark(target))return v42CampaignGoalOld(q,target);
 const point=v8POIs().find(o=>o.id===target.id&&(o.kind==='v42way'||o.kind==='v42event'));
 if(!point)return v42CampaignGoalOld(q,target);
 if(v36Inside())v36Leave();
 if(dist(p,point)<86)return v42CampaignGoalOld(point,target);
 const retries=target===V8.target?(target.v42Retry||0)+1:0;
 if(retries>3){v8Cancel();V8.vx=V8.vy=0;message('Lối đi tới '+point.name+' bị cản. Hãy chọn đường khác.');return;}
 V23.target=null;v8Cancel();V8.vx=V8.vy=0;V8.route=v42CampaignPath(p,point);
 if(V8.route.length){V8.target={type:'poi',id:point.id,v42Retry:retries};V8.goal={x:point.x,y:point.y};}
 else message('Không tìm thấy lối đi tới '+point.name+'. Hãy đến gần hơn.');
};
// A* vertices are real turning points, not permission to cut a corner.
// Preserve manual movement/chase/dash, but ease to each vertex of a guided
// route before turning. Never alter world position or skip collision.
const v42CampaignInputOld=v8Input;
v8Input=function(dt,s,world){
 if(!world||!v42CampaignLandmark(V8.target)||!V8.route.length||v23Manual()||V8.owner!==p||p.dashT>0)return v42CampaignInputOld(dt,s,world);
 let q=V8.route[0],d=dist(p,q);
 if(d<5){V8.route.shift();V8.vx=V8.vy=0;q=V8.route[0];if(!q)return {dx:0,dy:0,l:0,mx:0,my:0};d=dist(p,q);}
 const cap=s.speed*((keys.ControlLeft||keys.ControlRight)?.49:1),pace=Math.min(cap,Math.sqrt(2*1250*Math.max(0,d-2)),d/Math.max(.001,dt)),dx=(q.x-p.x)/Math.max(1,d),dy=(q.y-p.y)/Math.max(1,d);
 v23Velocity(V8,dx*pace,dy*pace,2200,dt);
 if(!v42CampaignLine(p,{x:p.x+V8.vx*dt,y:p.y+V8.vy*dt},14)){V8.vx=dx*pace;V8.vy=dy*pace;}
 if(Math.abs(V8.vx)>22)p.face=Math.sign(V8.vx);
 return {dx:dx*pace/cap,dy:dy*pace/cap,l:pace/cap,mx:V8.vx*dt,my:V8.vy*dt};
};


// v42_elites.js
// V42 · Yêu thú tinh anh. Deterministic encounter modifiers share the real
// V27 AI, collision geometry, damage, interruption and loot pipeline. No new
// XP/drop bonuses, HP inflation, spawned adds or repeatable reward flags.
const V42ELITE={cache:new WeakMap(),counts:{plans:0,chains:0,guards:0,dodges:0}};
const V42ELITE_DEFS={
 thorn:{name:'Mộc Ấn',color:'#b8df92',icon:'M',role:'guard',moves:['rootSeal','rootStrike'],combo:0,hint:'Vòng ấn có tâm an toàn · phá thế'},
 blood:{name:'Huyết Nha',color:'#f3a092',icon:'H',role:'swift',moves:['bloodLunge','bloodClaw'],combo:2,hint:'Dưới 55% máu: liên kích · né ngang'},
 venom:{name:'Độc Trạch',color:'#c0e47c',icon:'Đ',role:'ranged',moves:['venomMiasma','venomFan'],combo:3,hint:'Rời vùng độc rồi tránh tia tán xạ'},
 frost:{name:'Hàn Liên',color:'#adcffb',icon:'B',role:'ranged',moves:['frostLotus','frostRing'],combo:3,hint:'Không đứng trên hoa băng · vòng trong an toàn'},
 flame:{name:'Xích Diễm',color:'#ffb77c',icon:'L',role:'ranged',moves:['flameBreath','flameBurst'],combo:3,hint:'Né bên sườn → lùi khỏi vùng hỏa'},
 wind:{name:'Phong Ảnh',color:'#a1e8db',icon:'P',role:'swift',moves:['windPierce','windSweep'],combo:3,hint:'Di chuyển ngang · đánh lúc hồi chiêu'},
 ghost:{name:'U Hồn',color:'#cbbaf6',icon:'U',role:'ranged',moves:['ghostSigil','ghostPulse'],combo:2,hint:'Áp sát khi hồi chiêu · tránh tâm ấn'},
 iron:{name:'Thiết Giáp',color:'#ead7a1',icon:'T',role:'guard',moves:['ironCrush','ironSweep'],combo:3,hint:'Vòng ra sau khi thủ · vàng là phá hộ thể'},
 storm:{name:'Lôi Ấn',color:'#d4b5fc',icon:'S',role:'ranged',moves:['stormMark','stormFan'],combo:2,hint:'Rời điểm lôi · né tiếp loạt tia'}
};
// Primary region identity and a secondary tactical variant. All nonboss
// enemies keep their authored sprites; the readable seal denotes their affinity.
const V42ELITE_REG={truc:['thorn','blood'],yeu:['blood','iron'],tram:['venom','thorn'],tuyet:['frost','iron'],hoa:['flame','blood'],phong:['wind','frost'],quy:['ghost','venom'],ma:['iron','ghost'],loi:['storm','wind']};
const V42ELITE_MOVES={
 rootSeal:{...V27_BOOK.ring,name:'Mộc Ấn Hoàn Trận',reach:175,inner:62,wind:1.12,mul:1.03},
 rootStrike:{...V27_BOOK.claw,name:'Linh Mộc Trảm',reach:114,arc:.97,wind:.82,mul:1.02},
 bloodLunge:{...V27_BOOK.pounce,name:'Huyết Nha Xung',reach:212,width:29,wind:.92,mul:1.10},
 bloodClaw:{...V27_BOOK.sweep,name:'Huyết Trảo Phản Kích',reach:126,arc:.99,wind:.78,mul:1.02},
 venomMiasma:{...V27_BOOK.poison,name:'Độc Vụ Trận',reach:102,wind:1.24,mul:.98},
 venomFan:{...V27_BOOK.fan,name:'Hắc Độc Tán Châm',reach:275,arc:.57,count:3,speed:240,wind:1.02,mul:.88,status:'poison'},
 frostLotus:{...V27_BOOK.ice,name:'Băng Liên Tỏa Ấn',reach:106,wind:1.20,mul:1.06},
 frostRing:{...V27_BOOK.ring,name:'Sương Hàn Vòng Ấn',reach:190,inner:69,wind:1.22,mul:1.07},
 flameBreath:{...V27_BOOK.fire,name:'Xích Diễm Phún Tức',reach:205,arc:.68,wind:1.03,mul:1.12},
 flameBurst:{...V27_BOOK.burst,name:'Hỏa Tâm Bạo Liệt',reach:135,wind:1.12,mul:1.02,status:'fire'},
 windPierce:{...V27_BOOK.pounce,name:'Phong Ảnh Xuyên Phong',reach:235,width:27,wind:.98,mul:1.07},
 windSweep:{...V27_BOOK.sweep,name:'Phong Luân Trảm',reach:146,arc:1.07,wind:.87,mul:1.02},
 ghostSigil:{...V27_BOOK.ice,name:'U Minh Hồn Ấn',reach:91,wind:1.25,mul:1.02},
 ghostPulse:{...V27_BOOK.burst,name:'Hồn Khí Chấn Động',reach:139,wind:1.15,mul:1.01},
 ironCrush:{...V27_BOOK.crush,name:'Thiết Chùy Phá Hộ',reach:128,wind:1.23,mul:1.17},
 ironSweep:{...V27_BOOK.sweep,name:'Thiết Giáp Hoành Tảo',reach:147,arc:1.18,wind:1.10,mul:1.06},
 stormMark:{...V27_BOOK.lightning,name:'Tử Lôi Định Ấn',reach:98,wind:1.28,mul:1.13},
 stormFan:{...V27_BOOK.fan,name:'Lôi Mang Tam Xạ',reach:320,arc:.43,count:3,speed:280,wind:1.04,mul:.87}
};
Object.assign(V27_BOOK,V42ELITE_MOVES);
function v42EliteHash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);h^=h>>>16;h=Math.imul(h,0x7feb352d);h^=h>>>15;h=Math.imul(h,0x846ca68b);return (h^(h>>>16))>>>0;}
function v42EliteExcluded(e){return !e||e.dead||!p||!TYPES[e.type]||bossType(e.type)||e.v28Summon||e.v29World||e.v42Event||e.v42Practice||(p.worldMode&&e.region==='thon');}
function v42EliteRegion(e,world=!!p?.worldMode){if(world)return e.region||regionAt(e.homeX??e.x,e.homeY??e.y).id;const region=MAPS[room]?.v28Region;if(V42ELITE_REG[region])return region;const lv=v22EnemyLevel(e);return V22_ORDER.find(k=>V42ELITE_REG[k]&&lv>=V22_REG[k].min&&lv<=V22_REG[k].max)||'truc';}
function v42EliteSerial(e,world=!!p?.worldMode){
 if(Number.isInteger(e.v42EliteSerial)&&e.v42EliteSerial>=0&&e.v42EliteSerial<=4294967295)return e.v42EliteSerial;
 const loc=world?`${Math.round((e.homeX??e.x)*4)}:${Math.round((e.homeY??e.y)*4)}`:`${tower}:${room}:${p.v28?.run?.serial||0}:${Math.round(e.x*4)}:${Math.round(e.y*4)}`;
 return e.v42EliteSerial=v42EliteHash(`${seed}:${world?'w':'a'}:${loc}:${e.type}`);
}
// Stamp at creation, but delay affix assignment until post-spawn tags (e.g.
// encounter quest mobs and boss summons) have been populated by their owners.
const v42EliteOWSpawnOld=owSpawn, v42EliteSpawnOld=spawn;
owSpawn=function(...args){const n=enemies.length,r=v42EliteOWSpawnOld(...args);if(enemies.length>n&&p)v42EliteSerial(enemies.at(-1),true);return r;};
spawn=function(...args){const n=enemies.length,r=v42EliteSpawnOld(...args);if(enemies.length>n&&p)v42EliteSerial(enemies.at(-1),false);return r;};
function v42EliteGet(e){
 if(v42EliteExcluded(e))return null;
 if(V42ELITE.cache.has(e))return V42ELITE.cache.get(e);
 const region=v42EliteRegion(e),pool=V42ELITE_REG[region],n=v42EliteSerial(e),threshold=p.worldMode?(region==='truc'?12:17):15;
 // e.elite is never altered; base game reward odds and counters stay unchanged.
 const key=pool&&(!!e.elite||n%100<threshold)?pool[(n>>>8)%100<68?0:1]:null;
 const a=key?{...V42ELITE_DEFS[key],key,region,serial:n}:null;V42ELITE.cache.set(e,a);return a;
}
// Read-only accessor for kill journals after the core has already set dead.
// It never stamps a new serial or changes reward eligibility for a corpse.
function v42EliteKnown(e){return e?V42ELITE.cache.get(e)||null:null;}
const v42EliteAIOld=v27AI;
v27AI=function(e){const a=v42EliteAIOld(e),d=v42EliteGet(e);if(d&&!a.v42Elite){a.v42Elite=d.key;a.role=d.role;a.pattern=d.moves.slice();a.guardCd=Math.min(a.guardCd,1.15);a.dodgeCd=Math.min(a.dodgeCd,1.08);}return a;};
const v42ElitePlanOld=v27Plan;
v27Plan=function(e,a){const d=v42EliteGet(e);if(!d)return v42ElitePlanOld(e,a);
 const cycle=a.cycle++;let seq=[d.moves[cycle%2]];
 if(d.key==='blood'){if(e.hp/e.max<=.55)seq=d.moves.slice();}
 else if(d.combo&&cycle%d.combo===d.combo-1)seq=d.moves.slice();
 a.plan=seq;a.step=0;V42ELITE.counts.plans++;if(seq.length>1)V42ELITE.counts.chains++;return v27Start(e,a,seq[0]);
};
const v42EliteStartOld=v27Start;
v27Start=function(e,a,id){const r=v42EliteStartOld(e,a,id);if(V42ELITE_MOVES[id]&&a.action){
 // Each chained attack remains separately telegraphed. Reduce per-strike
 // damage for chains, rather than multiplying enemy attack or HP.
 if(a.plan.length>1)a.action.mul*=.72;a.action.wind=Math.max(.80,a.action.wind);
 }return r;};
const v42EliteTickOld=v27Tick;
v27Tick=function(e,dt,world){const d=v42EliteGet(e);if(!d)return v42EliteTickOld(e,dt,world);
 v27Ensure();const a=v27AI(e),before=a.mode;
 const r=v42EliteTickOld(e,dt,world);
 if(e.dead||a.mode==='leash'||a.mode==='patrol')return r;
 // More frequent but still finite evasions/guards for the matching elite only.
 // Their real state machine applies evade frames and frontal counter attack.
 if(before!=='guard'&&a.mode==='guard'&&['iron','thorn'].includes(d.key)){a.guardCd=2.6;V42ELITE.counts.guards++;}
 if(before!=='dodge'&&a.mode==='dodge'&&d.key==='wind'){a.dodgeCd=2.35;V42ELITE.counts.dodges++;}
 if(d.key==='blood'&&!a.v42Blood&&e.hp/e.max<=.55){a.v42Blood=true;v27Label(e,'HUYẾT NHA · LIÊN KÍCH',d.color);v27FX(e,'rage',d.color,.78,{r:TYPES[e.type].r+18});}
 return r;};
// Compact, intentionally non-flashing affinity signals appear beside the body
// and at its feet, not over its health, name or ground attack geometry.
function v42EliteGlyph(e,z,d,world){const r=Math.max(19,TYPES[e.type].r),ratio=world?HD.tilt:1,a=V27.ai.get(e),live=a?.mode!=='patrol'&&a?.mode!=='leash';g.save();g.translate(z.x,z.y);
 g.globalAlpha=live?.78:.45;g.strokeStyle=d.color;g.lineWidth=1.5;g.beginPath();g.ellipse(0,3,r+6,Math.max(8,(r+6)*ratio*.69),0,0,TAU);g.stroke();
 // Distinct single-letter crest with a dark backplate; visible even without color.
 const x=r+12,y=-30,s=9;g.globalAlpha=.97;g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s,y);g.lineTo(x,y+s);g.lineTo(x-s,y);g.closePath();g.fillStyle='#152021';g.fill();g.strokeStyle=d.color;g.lineWidth=1.6;g.stroke();text(d.icon,x,y+.6,10,d.color,'center','bold');g.restore();
}
const v42EliteRenderOld=v27Render;
v27Render=function(v){const r=v42EliteRenderOld(v);if(!p||mode!=='play'||modal||(p.worldMode&&v36Inside()))return r;
 const world=!!p.worldMode,els=[];for(const e of enemies){if(e.dead||dist(e,p)>560)continue;const a=v42EliteGet(e);if(!a)continue;const z=world?hdPoint(e.x,e.y,v):e;if(z.x<-40||z.y<-40||z.x>W+40||z.y>H+40)continue;els.push({e,z,a});}
 els.sort((a,b)=>dist(a.e,p)-dist(b.e,p));for(const q of els.slice(0,12))v42EliteGlyph(q.e,q.z,q.a,world);return r;
};




