'use strict';
// T61 — state/event hints, no input capture. Time is seconds (fixed frame dt).
const B04_HINT_TRIGGERS=['firstEnemyNear','lowHp','firstLoot','skillPoint','nearNpc','firstNight','nearGate','breakReady','firstMaterial','firstDeath','firstKyNgo','sectReady','bagFull','firstBossNear','forgeReady','petReady','newRegion','idle60'];
const B04_HINTS=(()=>{
 const a=typeof DATA!=='undefined'&&DATA.tutorial?.hints;
 if(Array.isArray(a)&&a.length===18&&new Set(a.map(d=>d?.id)).size===18&&B04_HINT_TRIGGERS.every(k=>a.some(d=>d?.trigger===k))&&Array.from(a).every(d=>d&&/^h\d+$/.test(d.id)&&typeof d.text==='string'&&typeof d.key==='string'&&[1,2,3].includes(d.priority)))return a;
 console.warn('[T61] DATA.tutorial thiếu hoặc không hợp lệ; tắt hướng dẫn.');return [];
})();
const B04_TUT={owner:null,scope:null,queue:[],active:null,wait:0,serial:0,night:null,regions:new Set(),x:0,y:0,idle:0,death:false,signals:new Set()};
function b04TutorialState(){
 if(!p||!B04_HINTS.length)return null;
 if(!p.tutorial||typeof p.tutorial!=='object'||Array.isArray(p.tutorial))p.tutorial={seen:{},off:false};
 if(!p.tutorial.seen||typeof p.tutorial.seen!=='object'||Array.isArray(p.tutorial.seen))p.tutorial.seen={};
 p.tutorial.off=p.tutorial.off===true;return p.tutorial;
}
function b04TutorialToggle(){const s=b04TutorialState();if(!s)return false;s.off=!s.off;B04_TUT.queue=[];B04_TUT.signals.clear();B04_TUT.death=false;b04TutorialHide(false);save();return true;}
function b04TutorialNight(){const h=((p.worldTime||0)%360)/15;return h>=19||h<5;}
function b04TutorialSignal(k){const s=b04TutorialState();if(s&&!s.off&&B04_TUT.owner===p&&mode==='play'&&!s.seen[B04_HINTS.find(h=>h.trigger===k)?.id])B04_TUT.signals.add(k);}
function b04TutorialDeath(){if(B04_HINTS.length&&B04_TUT.owner===p&&!b04TutorialState()?.off){const a=B04_TUT;b04TutorialHide(false);a.queue=[];a.signals.clear();a.idle=0;a.death=true;}}
function b04TutorialScope(){return p.worldMode?'world:'+p.mapId+':'+(v36Inside()?.id||'out'):'room:'+room;}
function b04TutorialPos(){return v47tIsActive()?V47T:p;}
function b04TutorialReset(){const a=B04_TUT,q=b04TutorialPos();Object.assign(a,{owner:p,scope:b04TutorialScope(),queue:[],active:null,wait:0,serial:0,night:b04TutorialNight(),regions:new Set(p.discovered||[]),x:q.x,y:q.y,idle:0,death:false,signals:new Set()});}
function b04TutorialConditions(){
 const town=v47tIsActive(),outer=p.worldMode&&!v36Inside(),near=outer&&(town?v471Near():owNearest()),npc=near&&(town?!!V8_INFO[near.id]:near.kind==='npc'||near.kind==='shop'||!!V8_INFO[near.id]);
 const gate=outer&&(town?dist(V47T,V47T_MAP.gates[0])<V47T_MAP.gates[0].r+40:!!v48tNearGate());
 const mobs=outer&&p.mapId!=='thon'&&!town;
 const event=outer?v42wEvent(p.mapId):null;
 return {firstEnemyNear:mobs&&enemies.some(e=>!e.dead&&!e.v28Summon&&!bossType(e.type)&&dist(e,p)<=300),lowHp:p.hp>0&&p.hp/currentStats().hp<.35,skillPoint:p.level>=2&&v11SkillPoints()>0,nearNpc:!!npc,nearGate:!!gate,breakReady:outer&&v30TrialEligible(),firstKyNgo:outer&&!!v42wEventPOI(p.mapId)&&['offered','hunt','ready'].includes(event?.status)&&p.discovered?.includes(p.mapId),sectReady:p.level>=2&&!p.v14?.sect,bagFull:p.gear.length>=44,firstBossNear:mobs&&enemies.some(e=>!e.dead&&bossType(e.type)&&dist(e,p)<=650),forgeReady:p.stones>=20&&p.gear.every(it=>!(it.up>0)),petReady:p.level>=5&&!Object.keys(p.v31?.pets||{}).length,idle60:outer&&p.mapId!=='thon'&&B04_TUT.idle>=60};
}
function b04TutorialValid(){return !!p&&mode==='play'&&!document.hidden&&!modal&&!failed&&!v17Drawer&&!v36Inside()&&!v30Trial()&&!V42_PHOTO.active&&!V48X.active&&!V42_PERF.warm.active&&!V41Presentation.transition&&!(p.worldMode&&worldTitle>0&&!v47tIsActive());}
function b04TutOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function b04TutorialSafe(r){
 if(!b04TutorialValid())return false;
 const target=v34Target();if(target&&bossType(target.type))return false;
 if(enemies.some(e=>!e.dead&&dist(e,p)<650&&['wind','attack'].includes(e.state)))return false;
 if(r.y===196&&(target||notifyT>0||v21NoticeT>0))return false;
 const rects=Object.values(V35.rects||{});
 // First frame after a load: do not assume the user's draggable HUD geometry.
 if(!rects.length)return false;
 if(rects.some(b=>b04TutOverlap(r,b)))return false;
 const town=v47tIsActive(),project=(e)=>town?{x:V47T.x-V47T.cam.x,y:V47T.y-V47T.cam.y}:p.worldMode?hdPoint(e.x,e.y):e;
 return ![p,...(town?[]:enemies.filter(e=>!e.dead&&dist(e,p)<450))].some(e=>{const q=project(e);return b04TutOverlap(r,{x:q.x-35,y:q.y-85,w:70,h:105});});
}
function b04TutorialEnqueue(k,cond){const a=B04_TUT,s=b04TutorialState(),h=B04_HINTS.find(x=>x.trigger===k);if(!h||!s||s.off||s.seen[h.id]||a.active?.h.id===h.id||a.queue.some(q=>q.h.id===h.id))return;a.queue.push({h,cond,order:a.serial++});}
function b04TutorialHide(requeue){const a=B04_TUT,c=a.active;if(!c)return;a.active=null;a.wait=8;if(requeue&&!b04TutorialState()?.seen[c.h.id])a.queue.push({h:c.h,cond:c.cond,order:c.order});}
function b04TutorialTick(dt){
 if(!p||!B04_HINTS.length)return;const a=B04_TUT,s=b04TutorialState();if(a.owner!==p)b04TutorialReset();
 const scope=b04TutorialScope(),q=b04TutorialPos(),changed=scope!==a.scope;if(changed){b04TutorialHide(false);a.queue=[];a.signals.clear();a.scope=scope;a.idle=0;}
 const night=b04TutorialNight(),regions=new Set(p.discovered||[]);if(!changed&&night&&!a.night)b04TutorialSignal('firstNight');if([...regions].some(k=>k!=='thon'&&!a.regions.has(k)))b04TutorialSignal('newRegion');a.night=night;a.regions=regions;
 const valid=b04TutorialValid();if(!changed&&valid&&p.worldMode&&p.mapId!=='thon'&&Math.hypot(q.x-a.x,q.y-a.y)<.01)a.idle+=dt;else if(changed||Math.hypot(q.x-a.x,q.y-a.y)>=.01)a.idle=0;a.x=q.x;a.y=q.y;
 if(s.off){a.queue=[];a.signals.clear();a.death=false;b04TutorialHide(false);return;}
 if(!a.active&&B04_HINTS.every(h=>s.seen[h.id])){a.queue=[];a.signals.clear();a.death=false;return;}
 if(a.death&&valid){a.signals.add('firstDeath');a.death=false;}
 if(!valid){b04TutorialHide(true);return;}
 const conditions=b04TutorialConditions();
 for(const k of B04_HINT_TRIGGERS){if(a.signals.has(k))b04TutorialEnqueue(k,false);else if(conditions[k])b04TutorialEnqueue(k,true);}
 // T33 takes precedence over the hint. After crossing the 650px trigger,
 // retain the pending boss hint only while retreating within the target's
 // existing 720px tracking radius; never show it over the actual boss card.
 a.signals.clear();a.queue=a.queue.filter(c=>!c.cond||conditions[c.h.trigger]||c.h.trigger==='firstBossNear'&&p.worldMode&&p.mapId!=='thon'&&enemies.some(e=>!e.dead&&bossType(e.type)&&dist(e,p)<=720));
 if(a.active){const c=a.active;if(c.cond&&!s.seen[c.h.id]&&!conditions[c.h.trigger]&&!(c.h.trigger==='firstBossNear'&&p.worldMode&&enemies.some(e=>!e.dead&&bossType(e.type)&&dist(e,p)<=720))){b04TutorialHide(false);return;}if(!b04TutorialSafe(c.rect)){b04TutorialHide(true);return;}if(c.t>=4){b04TutorialHide(false);return;}c.pending=Math.min(.1,(c.pending||0)+Math.max(0,dt));return;}
 a.wait=Math.max(0,a.wait-dt);if(a.wait>1e-8||!a.queue.length)return;
 const rect=[{x:430,y:350,w:420,h:82},{x:430,y:196,w:420,h:82}].find(b04TutorialSafe);if(!rect)return;
 a.queue.sort((x,y)=>x.h.priority-y.h.priority||x.order-y.order);a.active={...a.queue.shift(),rect,t:0,pending:0,drawn:false};
}
function b04TutorialDraw(){
 const c=B04_TUT.active;if(!c)return;if(!b04TutorialSafe(c.rect)){b04TutorialHide(true);return;}const {x,y,w,h}=c.rect,d=c.h;
 // Credit only frames actually painted, not simulation-only ticks or skipped draws.
 if(c.drawn)c.t+=Math.min(.1,c.pending||0);c.drawn=true;c.pending=0;
 const s=b04TutorialState();if(c.t>=1-1e-8&&!s.seen[d.id]){s.seen[d.id]=true;save();}
 if(c.t>=4-1e-8){b04TutorialHide(false);return;}
 g.globalAlpha*=clamp(Math.min(c.t/.16,(4-c.t)/.16),0,1);box(x,y,w,h,'#100b13db','#e3b96f8c',5);
 box(x+10,y+10,28,28,'#332a27','#e3b96f88',4);text('!',x+24,y+24,19,d.priority===1?'#f18474':'#e3b96f','center','bold');
 text('Gợi ý',x+46,y+17,16,'#e3b96f','left','bold');if(d.key){box(x+354,y+6,54,24,'#243735','#a8d6c577',3);text(d.key,x+381,y+18,12,'#a8d6c5','center','bold');}
 let size=14,lines=v45WrapLines(d.text,362,size,10);if(lines.length>2){size=12;lines=v45WrapLines(d.text,362,size,10);}
 lines.slice(0,3).forEach((l,i)=>text(l,x+46,y+37+i*(lines.length>2?14:18),size,'#f1e4cf'));
}
FRAME_HOOKS.update.push(b04TutorialTick);
FRAME_HOOKS.overlay.push(b04TutorialDraw);
