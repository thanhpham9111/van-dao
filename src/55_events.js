'use strict';
// T41 — Sơn Hà Ký story events. All choices are committed once by v42wComplete.
const B04_BUFF_STATS=['attack','def','crit','speed','regen'];
function b04EventEffectValid(x){
 if(!x||typeof x!=='object'||!Number.isFinite(x.value)||x.value<0)return false;
 if(x.type==='buff')return B04_BUFF_STATS.includes(x.stat)&&Number.isFinite(x.seconds)&&x.seconds>0;
 if(!Number.isInteger(x.value))return false;
 if(x.type==='mat')return Object.hasOwn(V13_ITEMS,x.item);
 if(x.type==='favor')return Object.hasOwn(V8_INFO,x.npc);
 return ['hurt','heal','xp','stones','pills'].includes(x.type);
}
const B04_EVENTS=(()=>{
 const a=typeof DATA!=='undefined'&&DATA.events?.events,ids=new Set();
 if(!Array.isArray(a)||a.length!==24||!Array.from(a).every(d=>d&&/^e\d+$/.test(d.id)&&!ids.has(d.id)&&ids.add(d.id)&&typeof d.title==='string'&&typeof d.desc==='string'&&Array.isArray(d.when?.regions)&&d.when.regions.length>0&&Array.from(d.when.regions).every(k=>Object.hasOwn(V22_REG,k))&&Number.isInteger(d.when.minLevel)&&d.when.minLevel>=1&&Number.isFinite(d.when.weight)&&d.when.weight>0&&(d.when.night===undefined||typeof d.when.night==='boolean')&&Array.isArray(d.options)&&d.options.length===3&&Array.from(d.options).every(o=>o&&typeof o.name==='string'&&typeof o.desc==='string'&&Number.isFinite(o.chance)&&o.chance>=0&&o.chance<=1&&Array.isArray(o.effects)&&Array.from(o.effects).every(b04EventEffectValid)&&(o.fail===undefined||Array.isArray(o.fail)&&Array.from(o.fail).every(b04EventEffectValid))))||!Number.isFinite(a.reduce((n,d)=>n+d.when.weight,0))){
  console.warn('[T41] DATA.events thiếu hoặc không hợp lệ; giữ vòng quay kỳ ngộ cũ.');return [];
 }
 return [...a,...EVENT_POOL.map((d,i)=>({...d,id:'legacy_event_'+(i+1),when:{regions:V22_ORDER.filter(k=>k!=='thon'),minLevel:1,weight:4},options:d.options.map(o=>({...o,chance:1,legacy:true}))}))];
})();
function b04EventDef(id){return B04_EVENTS.find(d=>d.id===id);}
function b04EventRecent(){if(!Array.isArray(p.evRecent))p.evRecent=[];return p.evRecent;}
function b04EventChoose(region){
 if(!B04_EVENTS.length)return null;const recent=b04EventRecent(),eligible=B04_EVENTS.filter(d=>d.when.regions.includes(region)&&d.when.minLevel<=p.level&&!recent.slice(-6).includes(d.id));
 if(!eligible.length)return null;
 let n=random()*eligible.reduce((s,d)=>s+d.when.weight,0);for(const d of eligible){n-=d.when.weight;if(n<0)return d;}return eligible.at(-1);
}
function b04EventRemember(id){p.evRecent=[...b04EventRecent().filter(k=>typeof k==='string'),id].slice(-6);}
function b04EventTime(d){const hour=((p.worldTime||0)%360)/15,night=hour>=19||hour<5;return d.when.night===undefined||d.when.night===night;}
function b04EventRecordValid(e,d=b04EventDef(e?.eventId)){
 if(!d||e?.kind!=='story'||e.status!=='offered'||e.goal!==1||!Object.hasOwn(V22_REG,e.region)||!v42wExterior()||v47tIsActive()||V48X.active||V42_PHOTO.active||p.mapId!==e.region||regionAt(p.x,p.y).id!==e.region)return false;
 const q=v42wEventPOI(e.region);return !!(q&&q.region===e.region&&q.x===e.x&&q.y===e.y&&Number.isFinite(e.x)&&Number.isFinite(e.y)&&v42wEvent(e.region)===e&&e.day===v42wDay()&&d.when.regions.includes(e.region)&&p.level>=d.when.minLevel&&v42wEventNear(e.region)&&dist(p,e)<=115);
}
function b04EventOpen(e){
 const d=b04EventDef(e?.eventId);if(!b04EventRecordValid(e,d)){v42wNotice('Cơ duyên chưa thể tiếp cận.');return false;}
 if(!b04EventTime(d)){v42wNotice('Cảnh này chỉ hiện ra vào ban '+(d.when.night?'đêm':'ngày')+'.');return false;}
 v8Cancel();V8.vx=V8.vy=0;mouse.left=mouse.fire=false;modal={kind:'event',batch04Story:true,region:e.region,day:e.day,eventId:d.id};return true;
}
function b04EventBuffs(){if(!Array.isArray(p.evBuffs))p.evBuffs=[];return p.evBuffs;}
function b04EventBuff(x){
 const now=p.worldTime||0,a=b04EventBuffs(),prior=a.filter(b=>b?.stat===x.stat&&Number.isFinite(b.value)&&b.value>=0&&Number.isFinite(b.expires)&&b.expires>now);
 p.evBuffs=a.filter(b=>b?.stat!==x.stat);p.evBuffs.push({stat:x.stat,value:Math.max(x.value,...prior.map(b=>b.value)),expires:now+x.seconds});
}
function b04EventApplyStats(a){
 if(!B04_EVENTS.length||!p)return a;const now=p.worldTime||0,values={};
 for(const b of Array.isArray(p.evBuffs)?p.evBuffs:[])if(b&&B04_BUFF_STATS.includes(b.stat)&&Number.isFinite(b.value)&&b.value>=0&&Number.isFinite(b.expires)&&b.expires>now)values[b.stat]=Math.max(values[b.stat]||0,b.value);
 a.attack*=1+(values.attack||0);a.spellAtk*=1+(values.attack||0);a.def*=1+(values.def||0);a.crit+=values.crit||0;a.speed+=values.speed||0;a.regen+=values.regen||0;return a;
}
function b04EventPrune(){
 if(!B04_EVENTS.length||!p||mode!=='play'||!Array.isArray(p.evBuffs))return;
 const now=p.worldTime||0,a=p.evBuffs.filter(b=>b&&B04_BUFF_STATS.includes(b.stat)&&Number.isFinite(b.value)&&b.value>=0&&Number.isFinite(b.expires)&&b.expires>now);
 if(a.length!==p.evBuffs.length){p.evBuffs=a;save();}
}
function b04EventXP(n){const oldLevel=p.level,oldXP=p.xp;gainXP(n);return p.level>oldLevel?'Tăng '+(p.level-oldLevel)+' cấp tu luyện':p.xp>oldXP?'Tu vi +'+(p.xp-oldXP):'Tu vi đã viên mãn';}
function b04EventEffects(effects){
 const details=[];
 for(const x of effects)switch(x.type){
  case 'mat':if(v13Adjust(x.item,x.value)&&x.value)details.push(V13_ITEMS[x.item][0]+' +'+x.value);break;
  case 'hurt':p.hp=Math.max(1,p.hp-x.value);break;
  case 'heal':p.hp=Math.min(currentStats().hp,p.hp+x.value);break;
  case 'xp':if(x.value)details.push(b04EventXP(x.value));break;
  case 'stones':p.stones+=x.value;break;
  case 'pills':p.pills+=x.value;break;
  case 'favor':{p.v8Relations??={};const before=Number(p.v8Relations[x.npc])||0;p.v8Relations[x.npc]=clamp(before+x.value,0,100);const delta=p.v8Relations[x.npc]-before;if(delta>0)details.push('Thiện cảm +'+delta);break;}
  case 'buff':{b04EventBuff(x);const label={attack:'Công kích',def:'Phòng ngự',crit:'Bạo kích',speed:'Tốc độ',regen:'Hồi nội lực'}[x.stat];const b=p.evBuffs.find(b=>b.stat===x.stat);const formatted=['attack','def','crit'].includes(x.stat)?Math.round(b.value*1000)/10+'%':b.value;details.push(label+' +'+formatted+' ('+x.seconds+' giây)');break;}
 }
 return details;
}
function b04EventLegacy(action){
 // Preserve the three original events' effects without calling select()/saving mid-commit.
 switch(action){
  case 'blade':p.bonusAtk+=16;p.hp=Math.max(1,p.hp-20);return ['Công kích +16'];
  case 'insight':{const hint=b04EventXP(42);p.stones+=3;return [hint];}
  case 'mercy':p.bonusHp+=25;p.hp+=25;return ['HP tối đa +25'];
  case 'fire':{const learned=!p.techs.includes('fire');if(learned)p.techs.push('fire');p.mp=0;return learned?['Lĩnh ngộ công pháp Hỏa','Nội lực cạn']:['Nội lực cạn'];}
  case 'study':return [b04EventXP(35)];
  case 'guard':p.bonusDef+=8;return ['Phòng ngự +8'];
  case 'heal':p.hp=Math.min(currentStats().hp,p.hp+60);break;
  case 'pills':p.pills+=3;break;
  case 'stones':p.stones+=10;break;
 }
 return [];
}
function b04EventCommit(e,index){
 const d=b04EventDef(e?.eventId),m=modal,o=d?.options[index];
 if(!Number.isInteger(index)||!o||!m?.batch04Story||m.region!==e?.region||m.eventId!==e.eventId||m.day!==e.day)return false;
 if(!b04EventRecordValid(e,d)){modal=null;v42wNotice('Cơ duyên đã khép lại hoặc ngoài tầm tiếp cận.');return false;}
 if(!b04EventTime(d)){v42wNotice('Cảnh này chỉ hiện ra vào ban '+(d.when.night?'đêm':'ngày')+'.');modal=null;return false;}
 const success=random()<o.chance,s=v42wState();e.status='done';e.count=e.goal;s.total++;
 if(s.tracked===e.region)s.tracked=null;V42_WORLD.dirty=true;modal=null;
 const before={hp:p.hp,stones:p.stones,pills:p.pills};
 const details=o.legacy?b04EventLegacy(o.action):b04EventEffects(success?o.effects:o.fail||[]);
 for(const [k,label] of [['hp','HP'],['stones','Linh thạch'],['pills','Đan dược']]){const n=Math.round((p[k]-before[k])*10)/10;if(n)details.push(label+' '+(n>0?'+':'')+n);}
 e.result={choice:o.name,success,details:details.join(' · ')};
 v42wLog(e.region,'Hoàn thành '+e.name+' · '+o.name+(success?'':' (bất thành)')+(e.result.details?' · '+e.result.details:''));
 v42wNotice((success?'Kỳ ngộ hoàn thành':'Cơ duyên bất thành')+' · '+(e.result.details||o.name));
 effect(e.x,e.y,'#ffdda4','ring',.8,{radius:64});save();return true;
}
function b04EventPanel(){
 const m=modal,e=v42wEvent(m.region),d=b04EventDef(m.eventId);
 g.fillStyle='#071417e9';g.fillRect(0,0,W,H);v42wFrame(225,82,830,555,true);v42wButton(988,99,44,35,'×',()=>modal=null);
 if(!b04EventRecordValid(e,d)){v42wText('Cơ duyên đã khép lại.',640,260,18,V42_WC.muted,'center');return;}
 v42wText('SƠN HÀ KÝ · KỲ NGỘ',253,118,13,V42_WC.gold,'left',true);v41PText(d.title,253,155,26,V42_WC.paper,'left','serif','bold');
 v45WrapLines(d.desc,770,15,3).forEach((line,i)=>text(line,254,190+i*20,15,V42_WC.paper));
 d.options.forEach((o,i)=>{const y=268+i*110;v42wFrame(251,y,778,100);v42wText(o.name,268,y+22,16,V42_WC.gold,'left',true);v45WrapLines(o.desc,545,13,3).forEach((line,i)=>text(line,268,y+48+i*17,13,V42_WC.paper));v42wButton(843,y+29,167,42,'Lựa chọn',()=>v42wComplete(e,i),true,true);});
 v42wText('ESC · Rời đi, chưa chọn sẽ không mất kỳ ngộ',253,613,12,V42_WC.muted);
}
function b04EventWorldPanel(e,o,id){
 const d=b04EventDef(e.eventId);v42wText('KỲ NGỘ · CƠ DUYÊN',406,226,11,V42_WC.gold,'left',true);
 v33Fit(e.name,405,257,775,23,V42_WC.paper,'left','bold');v42wText((e.status==='done'?'Đã hoàn thành':e.status==='expired'?'Đã khép lại':'Chờ đạo hữu')+' · Ngày '+(e.day+1),405,287,12,V42_WC.muted);
 if(!d){v42wText('Dữ liệu kỳ ngộ chưa sẵn sàng.',406,321,14,V42_WC.muted);return;}
 v45WrapLines(d.desc,760,15,3).forEach((line,i)=>text(line,406,328+i*22,15,V42_WC.paper));
 if(e.status==='done'||e.status==='expired'){if(e.result&&typeof e.result.choice==='string'){v33Fit('Đã chọn: '+e.result.choice+' · '+(e.result.success===true?'Thành công':'Bất thành'),406,404,760,14,V42_WC.gold);if(typeof e.result.details==='string'&&e.result.details)v33Fit(e.result.details,406,430,760,14,V42_WC.jade);}v42wText('Kỳ ngộ mới sẽ xuất hiện ngày tiếp theo.',406,462,14,V42_WC.muted);return;}
 if(!b04EventTime(d))v42wText('Cảnh này chỉ hiện ra vào ban '+(d.when.night?'đêm':'ngày')+'.',406,414,14,V42_WC.amber);
 const near=v42wEventNear(id);v42wButton(405,451,264,42,near?'Xem kỳ ngộ':'Dẫn đường tới kỳ ngộ',()=>near?b04EventOpen(e):v42wGuide(o),near?b04EventRecordValid(e,d):!!o,true);
 const s=v42wState();v42wButton(682,451,180,42,s.tracked===id?'Đang theo dõi':'Theo dõi kỳ ngộ',()=>{s.tracked=s.tracked===id?null:id;save();},true,s.tracked===id);
}
FRAME_HOOKS.update.push(b04EventPrune);
