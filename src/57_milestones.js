'use strict';
// T52 — legacy achievements remain in v42wState().milestones.
const B04_MS_COUNTS={
 level:()=>p.level,discover:()=>new Set(p.discovered||[]).size,
 claim:()=>['trucaltar','yuealtar','snowaltar','swampherb','firealtar','ghostrune','phongaltar','loialtar'].filter(k=>p.claimed?.[k]===true).length,
 kills:()=>p.kills||0,boss:()=>V22_ORDER.filter(k=>(v22State().bosses[k]?.kills||0)>0||(k==='truc'&&p.worldBossDead)).length,
 events:s=>s.total,waystones:s=>Object.keys(s.stones).length,sectRank:()=>p.v14?.sect?(p.v31?.rank||0):0,
 stones:()=>p.stones,main:()=>p.v12Main||0,pets:()=>Object.keys(p.v31?.pets||{}).length,
 relics:()=>p.relics.length,forge:()=>Math.max(0,...p.gear.map(it=>it.up||0)),techs:()=>p.techs.length
};
const B04_MS_LIST=(()=>{
 const list=typeof DATA!=='undefined'&&DATA.milestones?.list,ids=new Set(V42_MILESTONES.map(d=>d.id));
 if(Array.isArray(list)&&list.length===30&&Array.from(list).every(d=>d&&typeof d.id==='string'&&/^[a-z][a-zA-Z0-9_]*$/.test(d.id)&&!['constructor','prototype'].includes(d.id)&&!ids.has(d.id)&&ids.add(d.id)&&typeof d.name==='string'&&typeof d.title==='string'&&Object.hasOwn(B04_MS_COUNTS,d.count)&&[d.need,d.reward,d.xp].every(n=>Number.isSafeInteger(n)&&n>=0)&&d.need>0))return list.map(d=>({...d,count:B04_MS_COUNTS[d.count],batch04:true}));
 console.warn('[T52] DATA.milestones thiếu hoặc không hợp lệ; giữ 6 thành tựu cũ.');return [];
})();
V42_MILESTONES.push(...B04_MS_LIST);
function b04MilestoneClaimMap(d,s=v42wState()){if(!d?.batch04)return s.milestones;if(!p.msClaimed||typeof p.msClaimed!=='object'||Array.isArray(p.msClaimed))p.msClaimed={};return p.msClaimed;}
function b04MilestoneClaimed(d,s){return b04MilestoneClaimMap(d,s)[d.id]===true;}
function b04MilestoneCount(d,s){const n=d.count(s);return Number.isFinite(n)&&n>=0?Math.floor(n):0;}
function playerTitle(){if(!p)return '';p.titleSel??='';const d=B04_MS_LIST.find(x=>x.id===p.titleSel);return d?.title&&b04MilestoneClaimed(d)?d.title:'';}
function b04SelectTitle(id){const d=B04_MS_LIST.find(x=>x.id===id);if(!d?.title||!b04MilestoneClaimed(d))return false;p.titleSel=p.titleSel===id?'':id;save();return true;}
const B04_MS_VIEW={owner:null,page:0};
function b04MilestonePage(){if(B04_MS_VIEW.owner!==p){B04_MS_VIEW.owner=p;B04_MS_VIEW.page=0;}return B04_MS_VIEW.page=clamp(B04_MS_VIEW.page,0,Math.ceil(V42_MILESTONES.length/6)-1);}
function b04MilestoneRows(){const i=b04MilestonePage();return V42_MILESTONES.slice(i*6,i*6+6);}
function b04MilestonePager(){const page=b04MilestonePage(),pages=Math.ceil(V42_MILESTONES.length/6);if(pages<=1)return;v42wButton(1010,158,52,31,'‹',()=>B04_MS_VIEW.page--,page>0);v42wText((page+1)+' / '+pages,1090,174,12,V42_WC.paper,'center',true);v42wButton(1121,158,52,31,'›',()=>B04_MS_VIEW.page++,page<pages-1);}
