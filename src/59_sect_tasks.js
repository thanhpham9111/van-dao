'use strict';
// T57 — share the original 1-task slot; specific tasks count from real kill baselines.
const B04_SECTS=(()=>{
 const data=typeof DATA!=='undefined'&&DATA.sect?.sects,ids=new Set(V31_TASKS.map(t=>t.id));
 if(data&&Object.keys(V14_S).every(k=>{const d=data[k];return d&&Array.isArray(d.rankLines)&&d.rankLines.length===5&&Array.from(d.rankLines).every(v=>typeof v==='string')&&Array.isArray(d.tasks)&&d.tasks.length===3&&Array.from(d.tasks).every(t=>t&&/^[a-z]+_t\d+$/.test(t.id)&&!ids.has(t.id)&&ids.add(t.id)&&typeof t.name==='string'&&typeof t.desc==='string'&&['hunt','boss'].includes(t.type)&&Object.hasOwn(V22_REG,t.region)&&[t.need,t.merit,t.stones].every(n=>Number.isSafeInteger(n)&&n>0)&&Number.isInteger(t.minRank)&&t.minRank>=0&&t.minRank<=4);}))return data;
 console.warn('[T57] DATA.sect thiếu hoặc không hợp lệ; giữ nhiệm vụ chung.');return null;
})();
function b04SectTasks(){const k=p?.v14?.sect;return [...V31_TASKS,...(B04_SECTS?.[k]?.tasks||[]).map(d=>({...d,boss:d.type==='boss',batch04:true,sect:k}))];}
function b04SectGate(d,s=v31State()){return !!d&&(!d.batch04||(p.v14?.sect===d.sect&&s.rank>=d.minRank&&p.level>=V22_REG[d.region].min));}
function b04SectCount(d){const n=d.type==='boss'?Math.max(v22State().bosses[d.region]?.kills||0,d.region==='truc'&&p.worldBossDead?1:0):v12Count(d.region);return Number.isSafeInteger(n)&&n>=0?n:0;}
function b04SectAcceptRecord(d){return d.batch04?{id:d.id,sect:d.sect,base:b04SectCount(d),count:0}:{id:d.id,count:0};}
function b04SectProgress(t,d){if(!t||!d||t.id!==d.id)return 0;if(!d.batch04)return Number.isFinite(t.count)?clamp(Math.floor(t.count),0,d.need):0;if(t.sect!==d.sect)return 0;const n=b04SectCount(d);if(!Number.isSafeInteger(t.base)||t.base<0||t.base>n){t.base=n;t.count=0;save();}return clamp(n-t.base,0,d.need);}
// Preserve tasks from a temporarily unavailable data pack without blocking legacy work.
function b04SectReconcile(s=v31State()){const all=b04SectTasks(),t=s.task;if(t?.sect&&!V31_TASKS.some(d=>d.id===t.id)&&!all.some(d=>d.id===t.id&&d.sect===t.sect)){const parked=Array.isArray(s.batch04SuspendedTasks)?s.batch04SuspendedTasks:[];if(!parked.some(q=>q?.id===t.id&&q.sect===t.sect))parked.push(t);s.batch04SuspendedTasks=parked;s.task=null;save();}
 if(!s.task&&Array.isArray(s.batch04SuspendedTasks)){const i=s.batch04SuspendedTasks.findIndex(q=>all.some(d=>d.batch04&&q?.id===d.id&&q.sect===d.sect));if(i>=0){s.task=s.batch04SuspendedTasks.splice(i,1)[0];save();}}return s;}
function b04SectRankLine(s){return B04_SECTS?.[p.v14?.sect]?.rankLines[s.rank]||'';}
const B04_SECT_VIEW={owner:null,sect:null,active:null,page:0};
function b04SectPage(){const a=B04_SECT_VIEW,all=b04SectTasks(),id=v31State().task?.id;if(a.owner!==p||a.sect!==p.v14?.sect||a.active!==id){a.owner=p;a.sect=p.v14?.sect;a.active=id;a.page=Math.max(0,Math.floor(all.findIndex(d=>d.id===id)/2));}return a.page=clamp(a.page,0,Math.ceil(all.length/2)-1);}
function b04SectRows(){const n=b04SectPage();return b04SectTasks().slice(n*2,n*2+2);}
function b04SectPager(x,y,w){const page=b04SectPage(),pages=Math.ceil(b04SectTasks().length/2);if(pages<=1)return;v42HUDButton(x+18,y+371,55,26,'‹',()=>B04_SECT_VIEW.page--,'daoPrev',false,page>0);text((page+1)+' / '+pages,x+109,y+384,12,V42D_COL.paper,'center');v42HUDButton(x+145,y+371,55,26,'›',()=>B04_SECT_VIEW.page++,'daoNext',false,page<pages-1);text('2 nhiệm vụ / trang',x+w-20,y+384,11,V42D_COL.muted,'right');}
