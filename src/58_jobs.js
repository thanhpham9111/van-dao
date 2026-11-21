'use strict';
// T58 — stable by game day; accepted work survives day changes.
const B04_JOBS=(()=>{
 const list=typeof DATA!=='undefined'&&DATA.jobs?.jobs,ids=new Set(V13_JOBS.map(d=>d.id));
 if(Array.isArray(list)&&list.length===12&&Array.from(list).every(d=>d&&/^j\d+$/.test(d.id)&&!ids.has(d.id)&&ids.add(d.id)&&typeof d.name==='string'&&typeof d.desc==='string'&&[d.minLevel,d.need,d.reward].every(n=>Number.isSafeInteger(n)&&n>0)&&(d.kind==='carry'&&Object.hasOwn(V13_ITEMS,d.item)||d.kind==='kill'&&Object.hasOwn(V22_REG,d.region))))return list;
 console.warn('[T58] DATA.jobs thiếu hoặc không hợp lệ; giữ 3 ủy thác cũ.');return [];
})();
function b04JobHash(id,day){let h=((seed||0)^Math.imul(day+1,0x9e3779b1))>>>0;for(const c of id)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;h^=h>>>16;h=Math.imul(h,0x85ebca6b);return (h^(h>>>13))>>>0;}
function b04JobEligible(d){return (d.minLevel||1)<=p.level;}
function b04JobCount(d){const n=v12Count(d.region);return Number.isSafeInteger(n)&&n>=0?n:0;}
function b04JobState(d){const s=v13Init(),day=v13Day();let j=s.jobs[d.id];if(!j||!['offered','active','done'].includes(j.state)||(j.day!==day&&j.state!=='active'))return s.jobs[d.id]={day,state:'offered',base:b04JobCount(d)};
 if(j.state==='active'&&(!Number.isSafeInteger(j.base)||j.base<0||j.base>b04JobCount(d))){j.base=b04JobCount(d);save();}return j;}
function b04JobProgress(d){const j=b04JobState(d);if(j.state==='done')return d.need;const n=d.kind==='carry'?v13Inventory(d.item):j.state==='active'?b04JobCount(d)-j.base:0;return Number.isFinite(n)?clamp(Math.floor(n),0,d.need):0;}
function b04JobTrackAfterClaim(id){const s=v13Init();if(s.trackedJob!==id&&s.jobs[s.trackedJob]?.state==='active')return;s.trackedJob=b04JobsToday().find(d=>s.jobs[d.id]?.state==='active')?.id||null;}
function b04JobsToday(){
 if(!B04_JOBS.length)return V13_JOBS;
 const s=v13Init(),day=v13Day(),all=[...V13_JOBS,...B04_JOBS],byId=new Map(all.map(d=>[d.id,d])),cached=s.batch04Day;
 const active=all.filter(d=>s.jobs[d.id]?.state==='active'),done=all.filter(d=>s.jobs[d.id]?.state==='done'&&s.jobs[d.id].day===day);
 const ids=[];const add=d=>{if(d&&ids.length<3&&!ids.includes(d.id))ids.push(d.id);};
 if(cached?.day===day&&Array.isArray(cached.ids)){
  // Keep the day's card order too, not merely the same three IDs.
  const required=[...active,...done];
  if(required.length>3||required.some(d=>!cached.ids.includes(d.id)))required.forEach(add);
  cached.ids.forEach(k=>{const d=byId.get(k);if(d&&(b04JobEligible(d)||s.jobs[k]?.state==='active'||s.jobs[k]?.state==='done'&&s.jobs[k].day===day))add(d);});
 }
 else {
  active.forEach(add);done.forEach(add);
  // Old save's existing today's entries take precedence; then deterministic draw.
  all.filter(d=>s.jobs[d.id]?.day===day&&b04JobEligible(d)).forEach(add);
  all.filter(d=>(d.minLevel||1)<=p.level).sort((a,b)=>b04JobHash(a.id,day)-b04JobHash(b.id,day)||a.id.localeCompare(b.id)).forEach(add);
 }
 // Repair a malformed cached shortlist without losing accepted work.
 if(ids.length<3)all.filter(d=>(d.minLevel||1)<=p.level).sort((a,b)=>b04JobHash(a.id,day)-b04JobHash(b.id,day)).forEach(add);
 if(cached?.day!==day||JSON.stringify(cached.ids)!==JSON.stringify(ids)){s.batch04Day={day,ids};save();}
 return ids.map(k=>byId.get(k));
}
