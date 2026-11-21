'use strict';
// T39 — Chính tuyến 5 chương + 10 phụ tuyến từ data/quests.js (story.md + batch02_addendum.md §1).
// Nối thẳng vào hệ V12 có sẵn (V12_MAIN / V12_SIDE, v12Check, nhật ký Q): mỗi bước dữ liệu → một mục V12 có done().
// Con trỏ chính tuyến vẫn là p.v12Main: 0–7 = 8 bước cũ (chỉ đổi chữ), 8 trở đi = DATA.quests.main.
const QUEST_GOALS={
 talk:g=>!!p.v12Talk?.[g.npc],
 discover:g=>!!p.discovered?.includes(g.region),
 kill:null, // đếm theo mốc lúc kích hoạt, xem questDone()
 boss:g=>g.region==='truc'?!!p.worldBossDead:(v22State().bosses?.[g.region]?.kills||0)>0,
 level:g=>p.level>=g.min,
 claim:g=>!!p.claimed?.[g.poi]
};
const QUEST_POIS=['trucaltar','yuealtar','snowaltar','swampherb','firealtar','ghostrune','phongaltar','loialtar'];
const QUEST={ok:false,main:[],side:[]};

function questValid(d){
 const err=[],ids=new Set(),npcs=new Set(Object.keys(V8_INFO||{}));
 if(!d||!Array.isArray(d.main)||!Array.isArray(d.side)||!Array.isArray(d.legacyText))return ['thiếu main/side/legacyText'];
 for(const q of [...d.main,...d.side]){
  const g=q.goal||{};
  if(ids.has(q.id))err.push('trùng id '+q.id);ids.add(q.id);
  if(!(g.type in QUEST_GOALS))err.push(q.id+': loại goal '+g.type);
  if(g.region&&!V22_REG[g.region])err.push(q.id+': vùng '+g.region);
  if(g.type==='talk'&&!npcs.has(g.npc))err.push(q.id+': npc '+g.npc);
  if(g.type==='claim'&&!QUEST_POIS.includes(g.poi))err.push(q.id+': poi '+g.poi);
  if(g.type==='boss'&&g.region==='thon')err.push(q.id+': boss thôn');
  if(!q.reward||!Number.isFinite(q.reward.stones))err.push(q.id+': thưởng');
 }
 return err;
}
function questKillBase(q){p.qKillBase??={};return p.qKillBase[q.id];}
function questDone(q){
 const g=q.goal;if(p.level<(q.minLevel||1))return false;
 if(g.type==='kill'){p.qKillBase??={};if(p.qKillBase[q.id]==null){p.qKillBase[q.id]=v12Count(g.region);save();}return v12Count(g.region)-p.qKillBase[q.id]>=g.count;}
 return QUEST_GOALS[g.type](g);
}
function questGoalText(q){
 const g=q.goal;
 if(g.type==='kill')return 'Hạ '+g.count+' yêu thú ở '+(REG[g.region]?.name||g.region);
 if(g.type==='boss')return 'Hạ '+(V22_REG[g.region]?.boss||'boss')+' · '+(REG[g.region]?.name||g.region);
 if(g.type==='discover')return 'Khám phá '+(REG[g.region]?.name||g.region);
 if(g.type==='claim')return 'Lĩnh ngộ '+(OW_POI.find(o=>o.id===g.poi)?.name||g.poi);
 if(g.type==='talk')return 'Gặp '+(V8_INFO[g.npc]?.name||g.npc);
 if(g.type==='level')return 'Đạt cấp '+g.min;
 return q.name;
}
// Mục V12 (cùng khuôn với V12_MAIN/V12_SIDE) từ một bước dữ liệu.
function questEntry(q,side){
 const g=q.goal,e={qid:q.id,name:q.name,desc:q.desc,goal:questGoalText(q),stones:q.reward.stones,pills:q.reward.pills||0,xp:q.reward.xp||0,
  minLevel:q.minLevel||1,giver:q.giver,lineStart:q.lineStart||'',lineDone:q.lineDone||'',done:()=>questDone(q)};
 if(side)e.id=q.id;
 if(g.type==='talk'||g.type==='claim')e.target=g.type==='talk'?g.npc:g.poi;
 if(g.region)e.region=g.region;
 if(g.type==='kill'){e.kill=g.count;e.killBase=()=>questKillBase(q)??v12Count(g.region);}
 if(g.type==='boss')e.boss=true;
 if(g.type==='level')e.levelGoal=g.min;
 if(side)e.visible=()=>p.level>=(q.minLevel||1)&&(!q.giver||!!p.v12Talk?.[q.giver]);
 return e;
}
(function questInstall(){
 const d=typeof DATA!=='undefined'?DATA.quests:null,err=questValid(d);
 if(err.length){console.warn('T39: data/quests.js lỗi, chỉ chạy 8 bước cũ:',err.slice(0,5));return;}
 for(const t of d.legacyText){const o=V12_MAIN[t.index];if(o){o.name=t.name;o.desc=t.desc;}}
 if(V12_MAIN.length!==8){console.warn('T39: V12_MAIN không còn 8 bước gốc, bỏ qua');return;}
 for(const q of d.main){const e=questEntry(q,false);V12_MAIN.push(e);QUEST.main.push(e);}
 for(const q of d.side){const e=questEntry(q,true);V12_SIDE.push(e);QUEST.side.push(e);}
 QUEST.ok=true;
})();
// Lời NPC: câu kết bước vừa xong rồi câu mở bước kế, lần lượt qua ô thông báo v21Say (mỗi câu ~3 giây).
QUEST.lines=[];
function questSayLine(text,who){if(text)QUEST.lines.push((V8_INFO[who]?.name?V8_INFO[who].name+': ':'')+text);}
function questAfterComplete(t,next){
 questSayLine(t.lineDone,t.giver);
 const n=V12_MAIN[next];if(n&&n.lineStart)questSayLine(n.lineStart,n.giver);
}
FRAME_HOOKS.update.push(()=>{if(QUEST.lines.length&&!(v21NoticeT>0.2))v21Say(QUEST.lines.shift());});
