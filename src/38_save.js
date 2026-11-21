'use strict';
// v42_save.js
// V42 save manager. Portable offline saves, preview and explicit replace,
// local recovery snapshot. No telemetry, uploads, or network dependency.
const V42_SAVE_BACKUP=SAVE+'_v42_recovery',V42_SAVE_QUARANTINE=SAVE+'_v42_damaged',V42_SAVE_LIMIT=8*1024*1024;
const V42_SAVE={pending:null,note:'',lastOk:null,count:0,bytes:0,fromMenu:false,source:'',busy:false,cache:new Map()};
function v42sRead(key=SAVE){try{return localStorage.getItem(key)||null;}catch(_){return null;}}
function v42sValidate(raw){
 const fail=reason=>({ok:false,reason});if(typeof raw!=='string'||!raw.length)return fail('Tệp lưu trống.');if(raw.length>V42_SAVE_LIMIT)return fail('Tệp lưu vượt quá 8 MB.');
 let d;try{d=JSON.parse(raw);}catch(_){return fail('Không phải tệp JSON hợp lệ.');}const explorerRaw=d?.explorer;if(d?.format==='van-dao-save-v1')d=d.data;
 const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x),num=(x,min,max)=>Number.isFinite(x)&&x>=min&&x<=max,int=(x,min,max)=>Number.isInteger(x)&&num(x,min,max);
 if(!obj(d)||d.v!==1||!obj(d.p))return fail('Không nhận dạng được hồ sơ Vạn Đạo.');
 // Limit structure size and reject prototype-related keys. Saves are data only.
 let count=0;function safe(x,depth){if(++count>200000||depth>40)return false;if(x===null||typeof x==='boolean')return true;if(typeof x==='string')return x.length<=30000;if(typeof x==='number')return Number.isFinite(x)&&Math.abs(x)<=1e12;if(!obj(x)&&!Array.isArray(x))return false;if(Array.isArray(x)&&x.length>18000)return false;return Object.keys(x).every(k=>!['__proto__','constructor','prototype'].includes(k)&&k.length<250&&safe(x[k],depth+1));}if(!safe(d,0))return fail('Dữ liệu vượt giới hạn hoặc chứa giá trị không hợp lệ.');
 const a=d.p;if(!int(a.cls,0,CLASSES.length-1)||!int(a.level,1,45)||!num(a.hp,0.01,1e8)||!num(a.mp,0,1e8)||!num(a.xp,0,1e8)||!num(a.stones,0,1e9)||!num(a.pills,0,1e9)||!int(a.kills??0,0,1e9))return fail('Hồ sơ nhân vật không hợp lệ.');
 if(!num(d.seed,0,4294967295)||!num(d.rng,-4294967295,4294967295)||!int(d.room,0,Math.max(200,LAST))||!int(d.tower,0,10000))return fail('Thông tin thế giới không hợp lệ.');
 if(!num(a.x,-100,OW.w+400)||!num(a.y,-100,OW.h+400))return fail('Tọa độ nhân vật bất hợp lệ.');
 if(a.worldMode&&(!a.openWorldV6||!REG[a.mapId]||!Array.isArray(a.discovered)||!obj(a.explored)||a.discovered.some(id=>!REG[id])||!num(a.worldTime,0,1e9)))return fail('Cần bản lưu thế giới liên tục từ V6 trở lên.');
 if(!Array.isArray(a.techs)||a.techs.length>100||!Array.isArray(a.relics)||a.relics.length>100||a.techs.some(k=>typeof k!=='string')||a.relics.some(k=>typeof k!=='string'))return fail('Danh sách công pháp hoặc pháp bảo bất hợp lệ.');
 for(const k of ['bonusHp','bonusAtk','bonusDef','bonusMp'])if(!num(a[k],-1e6,1e8))return fail('Chỉ số nhân vật bị thiếu hoặc bất hợp lệ.');
 const goodGear=it=>obj(it)&&int(it.id,0,EQUIPMENT.length-1)&&int(it.quality,0,QUALITY_COL.length-1)&&int(it.up??0,0,100)&&(it.affixes==null||Array.isArray(it.affixes)&&it.affixes.length<=8&&it.affixes.every(f=>obj(f)&&typeof f.k==='string'&&num(f.v,-100000,100000)));
 if(!Array.isArray(a.gear)||a.gear.length>50||!obj(a.worn))return fail('Danh sách trang bị không hợp lệ.');
 for(const it of a.gear)if(!goodGear(it))return fail('Có trang bị không hợp lệ.');
 for(const [slot,i] of Object.entries(a.worn))if(!['weapon','armor','accessory'].includes(slot)||!int(i,0,a.gear.length-1)||gearDef(a.gear[i])?.slot!==slot)return fail('Trang bị đang mặc không hợp lệ.');
 const lists=[d.enemies,a.owEnemies].filter(x=>x!=null);for(const es of lists){if(!Array.isArray(es)||es.length>3000)return fail('Danh sách yêu thú không hợp lệ.');for(const e of es)if(!obj(e)||!int(e.type,0,TYPES.length-1)||!num(e.x,-500,OW.w+500)||!num(e.y,-500,OW.h+500)||!num(e.hp,-1e8,1e8)||!num(e.max,0.01,1e8))return fail('Dữ liệu yêu thú không hợp lệ.');}
 if(a.v36Inside!=null&&(!obj(a.v36Inside)||!V36_BY_ID[a.v36Inside.id]||!num(a.v36Inside.x,0,W)||!num(a.v36Inside.y,0,H)))return fail('Thông tin nội thất không hợp lệ.');
 if(a.v13?.bag&&(!obj(a.v13.bag)||Object.values(a.v13.bag).some(n=>!int(n,0,1e9))))return fail('Tài nguyên trong túi không hợp lệ.');
 if(a.v10Attrs!=null&&(!obj(a.v10Attrs)||Object.values(a.v10Attrs).some(n=>!int(n,0,10000))))return fail('Điểm thuộc tính không hợp lệ.');
 if(a.v11Skills!=null&&(!Array.isArray(a.v11Skills)||a.v11Skills.length!==5||a.v11Skills.some(n=>!int(n,0,5))))return fail('Điểm công pháp không hợp lệ.');
 if(a.v21!=null){if(!obj(a.v21)||!Array.isArray(a.v21.loot)||a.v21.loot.length>18000||!int(a.v21.next,0,1e9))return fail('Dữ liệu chiến lợi phẩm không hợp lệ.');
  const seen=new Set();for(const d of a.v21.loot){if(!obj(d)||!int(d.uid,0,1e9)||seen.has(d.uid)||typeof d.scope!=='string'||!['gear','stone','pill'].includes(d.kind)||!num(d.x,-500,OW.w+500)||!num(d.y,-500,OW.h+500)||(d.kind==='gear'?!goodGear(d.item):!num(d.value,0,1e9)))return fail('Có chiến lợi phẩm không hợp lệ.');seen.add(d.uid);}}
 if(d.drops!=null&&(!Array.isArray(d.drops)||d.drops.some(a=>!obj(a)||!num(a.x,-500,OW.w+500)||!num(a.y,-500,OW.h+500))))return fail('Vật phẩm trên bản đồ không hợp lệ.');
 // Existing modules own schema migration. Keep the raw save format stable.
 const out=JSON.stringify(d);const name=String(a.v8Name||a.name||'Đạo hữu').slice(0,64);
 if(explorerRaw!=null&&!v46ValidExplorer(explorerRaw))return fail('Dữ liệu khám phá không hợp lệ.');
 return {ok:true,data:d,raw:out,preview:{name,cls:CLASSES[a.cls].name,level:a.level,realm:v22LevelName(a.level),area:a.worldMode?(REG[a.mapId]?.name||'Nhân gian'):'Bí cảnh',stones:a.stones,gear:a.gear.length,days:Math.floor((a.worldTime||0)/360)+1},explorer:v46ValidExplorer(explorerRaw)};
}
function v42sCopyBackup(raw){const v=v42sValidate(raw);if(!v.ok)return false;try{localStorage.setItem(V42_SAVE_BACKUP,v.raw);return true;}catch(_){return false;}}
function v42sCached(key=SAVE){const raw=v42sRead(key),had=V42_SAVE.cache.get(key);if(had&&had.raw===raw)return had.value;const value=v42sValidate(raw);V42_SAVE.cache.set(key,{raw,value});return value;}
function v42sPrepare(raw,source='Tệp nhập'){const v=v42sValidate(raw);V42_SAVE.pending=v.ok?v:null;V42_SAVE.source=source;V42_SAVE.note=v.ok?'Đã kiểm tra cấu trúc. Xác nhận để nạp hồ sơ.':v.reason;return v.ok;}
function v42sInstall(){
 const candidate=V42_SAVE.pending;if(!candidate?.ok)return false;
 const beforeMode=mode,beforeP=p,beforeModal=modal,beforePage=V8.menuPage,previous=v42sRead(),oldBackup=v42sRead(V42_SAVE_BACKUP),oldDamaged=v42sRead(V42_SAVE_QUARANTINE);
 const exKey=candidate.data.p.playerId?'VDTT_V48_explorer_'+candidate.data.p.playerId:null,oldEx=exKey?v42sRead(exKey):null;
 const restoreKey=(key,raw)=>{if(raw!==null)localStorage.setItem(key,raw);else localStorage.removeItem(key);};
 const restoreStorage=()=>{restoreKey(SAVE,previous);restoreKey(V42_SAVE_BACKUP,oldBackup);restoreKey(V42_SAVE_QUARANTINE,oldDamaged);if(exKey)restoreKey(exKey,oldEx);};
 // Preserve the old record before replacing it. Never delete a valid save to make space.
 try{if(previous&&previous!==candidate.raw){if(v42sValidate(previous).ok){if(!v42sCopyBackup(previous))throw Error('Không thể sao lưu hồ sơ');}else{localStorage.setItem(V42_SAVE_QUARANTINE,previous);if(v42sRead(V42_SAVE_QUARANTINE)!==previous)throw Error('Không thể lưu dữ liệu hỏng');}}localStorage.setItem(SAVE,candidate.raw);if(v42sRead()!==candidate.raw)throw Error('Không ghi được dữ liệu');if(candidate.explorer&&exKey){const exRaw=JSON.stringify(candidate.explorer);localStorage.setItem(exKey,exRaw);if(v42sRead(exKey)!==exRaw)throw Error('Không ghi được dữ liệu khám phá');}}
 catch(err){try{restoreStorage();}catch(_){}V42_SAVE.note='Không thể ghi hoặc tạo bản dự phòng. Chưa nạp hồ sơ.';return false;}
 try{
  p=null;mode='menu';modal=null;resume();
  if(mode!=='play'||!p||p.cls!==candidate.data.p.cls||p.level!==candidate.data.p.level||!Number.isFinite(currentStats().hp))throw Error('Hồ sơ không thể tiếp tục');
  V42_SAVE.pending=null;V42_SAVE.note='Nạp hồ sơ thành công.';V41Presentation.saved=null;V41Presentation.savedAt=-100;V8.menuPage='home';V41Presentation.transition=.35;message('Khôi phục hồ sơ thành công');if(candidate.explorer)V48X.owner=null;save();return true;
 }catch(err){
  try{restoreStorage();}catch(_){}
  if(beforeMode==='play'&&previous&&v42sValidate(previous).ok){try{p=null;mode='menu';resume();if(mode!=='play'||!p)throw Error('restore');}catch(_){p=beforeP;mode=beforeMode;}}else{p=beforeP;mode=beforeMode;}
  V8.menuPage=beforePage;modal=beforeModal;V42_SAVE.note='Không thể tiếp tục hồ sơ này. Đã phục hồi tiến trình cũ.';return false;
 }
}
function v42sExport(raw){const v=v42sValidate(raw);if(!v.ok){V42_SAVE.note=v.reason;return false;}try{
  let ex=null;try{const eid=v.data.p.playerId;if(eid)ex=JSON.parse(localStorage.getItem('VDTT_V48_explorer_'+eid)||'null');}catch(e){}const b=new Blob([JSON.stringify({format:'van-dao-save-v1',data:v.data,explorer:v46ValidExplorer(ex)},null,2)],{type:'application/json'}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download='Van_Dao_Lv'+v.preview.level+'_Save.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);V42_SAVE.note='Đã yêu cầu tải tệp lưu xuống.';return true;
 }catch(_){V42_SAVE.note='Trình duyệt không hỗ trợ tải xuống trong chế độ này.';return false;}}
function v42sPick(){if(V42_SAVE.busy)return;try{const a=document.createElement('input');a.type='file';a.accept='.json,application/json';a.style.display='none';const clean=()=>{a.remove();V42_SAVE.busy=false;};a.addEventListener('change',async()=>{const f=a.files?.[0];if(!f){clean();return;}V42_SAVE.busy=true;V42_SAVE.note='Đang đọc hồ sơ…';try{if(f.size>V42_SAVE_LIMIT)V42_SAVE.note='Tệp lưu vượt quá 8 MB.';else v42sPrepare(await f.text(),'Tệp nhập');}catch(_){V42_SAVE.note='Không đọc được tệp lưu.';}finally{clean();}});a.addEventListener('cancel',clean);document.body.appendChild(a);a.click();}catch(_){V42_SAVE.note='Không mở được hộp thoại chọn tệp.';}}
function v42sOpen(){V42_SAVE.pending=null;V42_SAVE.note='';V42_SAVE.fromMenu=mode==='menu';if(mode==='menu'){V8.menuPage='backup';return true;}if(!p||mode!=='play')return false;save();v8Cancel();modal={kind:'v42save'};return true;}
function v42sClose(){V42_SAVE.pending=null;V42_SAVE.note='';if(mode==='menu')V8.menuPage='home';else modal=null;}
function v42sPanel(){
 g.fillStyle='#061316f4';g.fillRect(0,0,W,H);v41PFrame(69,53,1142,607,true);v41PText('HỒ SƠ · BẢO TOÀN TIẾN TRÌNH',99,93,27,'#e1c99a','left','serif','bold');v41PText('Dữ liệu ngoại tuyến · Xuất tệp và đem sang máy khác',101,127,13,'#adc4ba','left','sans');v42wButton(1124,74,57,39,'×',v42sClose);v41PLine(99,148,1080,.4);
 const cur=v42sCached(),recover=v42sCached(V42_SAVE_BACKUP),a=cur.ok?cur.preview:null;
 v41PFrame(99,171,509,402,true);v42wText('HỒ SƠ HIỆN TẠI',119,196,13,'#e1c99a','left',true);
 if(a){v41PText(a.name,119,236,27,'#f1e5c6','left','serif','bold');v42wText(a.cls+' · '+a.realm,119,272,15,'#adcfc1');v42wText(a.area+' · Ngày '+a.days,119,305,14);v42wText(a.stones+' linh thạch · '+a.gear+' trang bị',119,338,14);v42wButton(119,374,468,49,'Xuất tệp JSON',()=>v42sExport(v42sRead()),true,true);v42wButton(119,436,468,41,'Tạo bản khôi phục cục bộ',()=>{V42_SAVE.note=v42sCopyBackup(v42sRead())?'Đã tạo bản khôi phục.':'Không tạo được bản khôi phục.';},true);}else{v42wText('Chưa có hồ sơ hợp lệ trên trình duyệt này.',119,240,15,'#adc4ba');}
 v42wText(recover.ok?'Có bản khôi phục · '+recover.preview.realm:'Chưa có bản khôi phục',119,516,12,'#a7c5b7');v42wButton(119,531,468,31,'Xem bản khôi phục',()=>v42sPrepare(v42sRead(V42_SAVE_BACKUP),'Bản khôi phục'),recover.ok);
 v41PFrame(627,171,554,402,!!V42_SAVE.pending);v42wText('NHẬP HỒ SƠ TỪ TỆP',649,196,13,'#e1c99a','left',true);v42wButton(649,217,510,50,'Chọn tệp JSON',v42sPick,true,!V42_SAVE.pending);
 if(V42_SAVE.pending){const q=V42_SAVE.pending.preview;v42wText(V42_SAVE.source+' · Đã kiểm tra',649,293,11,'#aaddc1','left',true);v41PText(q.name,649,331,25,'#f0e0bd','left','serif','bold');v42wText(q.cls+' · '+q.realm+' · '+q.area,649,366,14);v42wText(q.stones+' linh thạch · '+q.gear+' trang bị',649,396,13);v42wText('Hồ sơ hiện tại được giữ trong bản khôi phục.',649,434,12,'#e1be91');v42wButton(649,460,328,47,'Xác nhận nạp và thay thế',v42sInstall,true,true);v42wButton(987,460,172,47,'Hủy chọn',()=>{V42_SAVE.pending=null;V42_SAVE.note='';});}else{wrapText('Chọn tệp đã xuất từ phiên bản trước. Game sẽ kiểm tra trước và yêu cầu xác nhận; hồ sơ hiện tại không bị thay đổi chỉ vì chọn tệp.',649,310,480,15,'#b4c9bf','left',24);}
 v42wText(V42_SAVE.note||'Lưu ý: trình duyệt có thể lưu dữ liệu riêng theo vị trí của file HTML. Hãy xuất bản lưu trước khi nâng cấp.',99,610,13,V42_SAVE.note?'#f0c490':'#b5cbbf');
}
// Replace only the small core persistence routine with the same schema, so errors
// are observable instead of silently dropping data. All existing callers remain valid.
save=function(){if(!p||mode!=='play'||failed)return false;try{const raw=JSON.stringify({v:1,seed,rng,tower,room,p,auto,cleared,enemies:enemies.filter(e=>!e.dead),drops,roomStyle,modal});if(raw.length>V42_SAVE_LIMIT)throw Error('save too large');localStorage.setItem(SAVE,raw);V42_SAVE.lastOk=true;V42_SAVE.count++;V42_SAVE.bytes=raw.length;return true;}catch(_){V42_SAVE.lastOk=false;V42_SAVE.note='Không lưu được tiến trình. Kiểm tra dung lượng và quyền lưu dữ liệu.';return false;}};
// start_L12: lớp 38_save (trước đây lưu lớp dưới vào v42sOldStart). Gọi lớp dưới: start_L11.
function start_L12(...a){const old=v42sRead();if(old)v42sCopyBackup(old);return start_L11(...a);}


// update_L25: lớp 38_save (trước đây lưu lớp dưới vào v42sOldUpdate). Gọi lớp dưới: update_L24.
function update_L25(dt){if(pressed.KeyV){delete pressed.KeyV;if(modal?.kind==='v42save'||mode==='menu'&&V8.menuPage==='backup')v42sClose();else if(!modal||mode==='menu')v42sOpen();}if(pressed.Escape&&(modal?.kind==='v42save'||mode==='menu'&&V8.menuPage==='backup')){delete pressed.Escape;v42sClose();}return update_L24(dt);}


// v42_training.js
// V42 · Sân Luyện Kiếm — real combat practice on the existing village dummies.
// Session statistics are runtime-only. The mộc nhân never die, drop loot, grant
// tu vi or enter save data. All real player casts/cooldowns/mana rules still apply.
const V42T={owner:null,active:false,count:1,armor:false,serial:0,time:0,started:false,total:0,hits:0,crits:0,max:0,casts:0,landed:0,rows:{},log:[],history:[],castInfo:new Map(),nextId:0,source:null};
const V42T_HP=1000000000;
const V42T_KEYS=['atk0','atk1','atk2','skill0','skill1','skill2','skill3','dot','other'];
function v42tZone(){return V16_ZONES.find(z=>z.id==='training');}
function v42tTown(){return !!p?.worldMode&&!v36Inside()&&regionAt(p.x,p.y).id==='thon';}
function v42tNear(pad=0){const z=v42tZone();return !!z&&v42tTown()&&Math.abs(p.x-z.x)<=z.w/2+pad&&Math.abs(p.y-z.y)<=z.h/2+pad;}
function v42tIs(e){return !!e?.v42Practice;}
function v42tActive(){return V42T.active&&V42T.owner===p&&v42tNear(24)&&mode==='play'&&!failed;}
function v42tDummies(){return enemies.filter(e=>v42tIs(e));}
function v42tRows(){return Object.fromEntries(V42T_KEYS.map(k=>[k,{damage:0,hits:0,crits:0,max:0,casts:0,landed:0}]));}
function v42tReset(){
 V42T.serial++;Object.assign(V42T,{time:0,started:false,total:0,hits:0,crits:0,max:0,casts:0,landed:0,rows:v42tRows(),log:[],history:[],source:null});
 V42T.castInfo.clear();for(const e of v42tDummies()){e.burn=e.burnTick=e.slow=e.flash=0;e.hp=e.max=V42T_HP;}
}
function v42tRemove(){
 if(V23.target&&v42tIs(V23.target))V23.target=null;if(V34.target&&v42tIs(V34.target))V34.target=null;
 if(enemies.some(v42tIs))enemies=enemies.filter(e=>!v42tIs(e));
 if(Array.isArray(p?.owEnemies)&&p.owEnemies.some(v42tIs))p.owEnemies=p.owEnemies.filter(e=>!v42tIs(e));
}
function v42tStop(say=true){
 const was=V42T.active;v42tRemove();V42T.active=false;V42T.source=null;V42T.owner=null;
 if(modal?.kind==='v42practice')modal=null;if(was&&say)message('Đã rời Sân Luyện Kiếm · lượt tập kết thúc.');return was;
}
function v42tSpawn(){
 // V39+ transforms the original scene; read the authored decorative dummies
 // instead of hardcoding the old town's coordinates or adding new props.
 v42tRemove();const props=V16_DECOR.filter(o=>o.type==='dummy').sort((a,b)=>a.x-b.x),select=V42T.count===1?[props[Math.floor(props.length/2)]]:props.slice(0,3);
 for(const [i,o] of select.entries()){if(!o||owBlocked(o.x,o.y,12))continue;
  enemies.push({type:V42T.armor?1:0,x:o.x,y:o.y,homeX:o.x,homeY:o.y,region:'thon',hp:V42T_HP,max:V42T_HP,dir:1,state:'patrol',timer:0,cd:10000,flash:0,burn:0,burnTick:0,slow:0,dead:false,angle:0,v42Practice:true,v42Number:i+1});
 }
 return v42tDummies().length;
}
function v42tStart(count=1,armor=false){
 if(!p||mode!=='play'||!v42tNear(0)||failed)return false;
 V42T.owner=p;V42T.active=true;V42T.count=count===3?3:1;V42T.armor=!!armor;
 if(!v42tSpawn()){v42tStop(false);message('Sân luyện chưa sẵn sàng.');return false;}
 v42tReset();message('Bắt đầu luyện kiếm · nhấp mộc nhân để tấn công. F6 xem báo cáo.');return true;
}
function v42tSetup(count,armor){
 if(!v42tActive())return false;V42T.count=count===3?3:1;V42T.armor=!!armor;if(!v42tSpawn()){v42tStop(false);return false;}v42tReset();return true;
}
function v42tGuide(){
 if(!v42tTown()){message('Sân Luyện Kiếm tại Thanh Thạch Thôn. Hãy trở về thôn trước.');return false;}
 const z=v42tZone();if(!z)return false;
 // Walk to a verified open point in the existing yard, not a teleport.
 const pts=[{x:z.x,y:z.y},...[-1,0,1].map(i=>({x:z.x+i*z.w*.16,y:z.y+z.h*.12})),...[-1,1].map(i=>({x:z.x+i*z.w*.24,y:z.y-z.h*.12}))];
 const q=pts.find(a=>!owBlocked(a.x,a.y,16));if(!q){message('Không tìm được lối đến sân.');return false;}
 modal=null;v8SetGoal(q);message('Đang dẫn đường đến Sân Luyện Kiếm · đến nơi nhấn F6.');return true;
}
function v42tReport(){
 if(!v42tActive())return false;v8Cancel();V8.vx=V8.vy=0;V23.target=null;modal={kind:'v42practice'};return true;
}
function v42tOpen(){
 if(modal?.kind==='v42practice'){modal=null;return true;}if(modal&&modal.kind!=='journal8')return false;
 if(v42tActive()){modal=null;return v42tReport();}
 if(!v42tNear(0))return v42tGuide();
 modal=null;return v42tStart();
}
function v42tName(k){
 if(k?.startsWith('atk'))return V26_COMBOS[p.cls]?.[Number(k.slice(-1))]?.name||'Đòn thường';
 if(k?.startsWith('skill'))return V11_SKILLS[p.cls]?.[Number(k.slice(-1))]?.name||'Công pháp';
 return k==='dot'?'Hỏa thương theo thời gian':'Nguồn sát thương khác';
}
function v42tKey(a){return a?.kind==='skill'&&Number.isInteger(a.i)?'skill'+a.i:a?.kind==='attack'?'atk'+Math.max(0,Math.min(2,(a.stage||1)-1)):'other';}
function v42tBeginCast(a){
 if(!v42tActive()||!a)return;const key=v42tKey(a),row=V42T.rows[key]||V42T.rows.other,id=++V42T.nextId;
 const tag={key,id,serial:V42T.serial};a.v42TrainCast=tag;V42T.castInfo.set(id,{key,hit:false});V42T.started=true;V42T.casts++;row.casts++;
 V42T.history.push({key,time:V42T.time,id});if(V42T.history.length>30)V42T.history.shift();if(V42T.castInfo.size>160)V42T.castInfo.delete(V42T.castInfo.keys().next().value);
}
function v42tRecord(dmg,crit,tag=null,key='other'){
 if(!v42tActive()||!Number.isFinite(dmg)||dmg<=0)return;
 if(tag&&tag.serial!==V42T.serial)return;
 const info=tag&&V42T.castInfo.get(tag.id);key=tag?.key||key;
 const row=V42T.rows[key]||V42T.rows.other;V42T.started=true;V42T.total+=dmg;V42T.hits++;row.damage+=dmg;row.hits++;
 if(crit){row.crits++;V42T.crits++;}V42T.max=Math.max(V42T.max,dmg);row.max=Math.max(row.max,dmg);
 if(info&&!info.hit){info.hit=true;V42T.landed++;row.landed++;}
 V42T.log.push({t:V42T.time,damage:dmg});if(V42T.log.length>450)V42T.log.shift();
}
function v42tMetrics(){
 const denom=Math.max(1,V42T.time),live=V42T.log.filter(e=>e.t>=V42T.time-5).reduce((n,e)=>n+e.damage,0);
 return {duration:V42T.time,dps:V42T.total/denom,recentDps:live/Math.min(denom,5),total:V42T.total,hits:V42T.hits,crits:V42T.crits,critRate:V42T.hits?V42T.crits/V42T.hits:0,casts:V42T.casts,landed:V42T.landed,accuracy:V42T.casts?V42T.landed/V42T.casts:0,max:V42T.max};
}
// Track releases, not key presses. Real V26 Normal/Release then execute the
// standard action and projectile casts. Tags are ephemeral, never in p/save.
const v42tNormalOld=v26Normal;v26Normal=function(a){v42tBeginCast(a);return v42tNormalOld(a);};
const v42tReleaseOld=v26Release;v26Release=function(a){v42tBeginCast(a);return v42tReleaseOld(a);};
const v42tProjectileOld=v10Projectile;v10Projectile=function(...args){
 const before=bolts.length,result=v42tProjectileOld(...args);
 if(v42tActive()&&bolts.length>before&&V26.source?.v42TrainCast)bolts.at(-1).v42TrainCast=V26.source.v42TrainCast;return result;
};
const v42tBoltOld=v26BoltHit;v26BoltHit=function(e,b){
 const old=V42T.source;if(v42tIs(e))V42T.source=b?.v42TrainCast||null;
 try{return v42tBoltOld(e,b);}finally{V42T.source=old;}
};
// hit_L09: lớp 38_save (trước đây lưu lớp dưới vào v42tHitOld). Gọi lớp dưới: hit_L08.
function hit_L09(e,dmg,crit=false){
 if(!v42tIs(e))return hit_L08(e,dmg,crit);
 if(!v42tActive()||!enemies.includes(e)||!Number.isFinite(dmg)||dmg<=0)return;
 // Infinite stationary target: normal damage and mitigation still go through
 // the whole established hit pipeline, but poise is deliberately fixed and
 // HP can never fall to zero. Its armour selector uses the real type-1 modifier.
 const reserve=Math.max(V42T_HP,Math.abs(dmg)*2+10000);if(!Number.isFinite(reserve))return;
 e.hp=e.max=reserve;e.dead=false;
 const ai=v27AI(e);ai.mode='patrol';ai.poise=ai.max=V42T_HP;ai.exposed=0;ai.guarded=false;ai.t=0;
 const tag=V42T.source||V26.source?.v42TrainCast||null,key=tag?.key||v42tKey(V26.source);
 const result=hit_L08(e,dmg,crit),actual=reserve-e.hp;
 e.hp=e.max=V42T_HP;e.dead=false;v42tRecord(actual,crit,tag,key);return result;
}
const v42tPushOld=v26Push;v26Push=function(e,...args){if(v42tIs(e))return;return v42tPushOld(e,...args);};
const v42tEnemyOld=owEnemy;owEnemy=function(e,dt){
 if(!v42tIs(e))return v42tEnemyOld(e,dt);
 if(!v42tActive())return;
 e.flash=Math.max(0,(e.flash||0)-dt);e.slow=Math.max(0,(e.slow||0)-dt);e.timer=0;e.x=e.homeX;e.y=e.homeY;e.state='patrol';e.cd=1e6;
 // Existing V27 monsters tick burn independent of hit(). Mirror that exact
 // cadence and actual currentStats().burn, but never use a death path.
 if(e.burn>0){e.burn-=dt;e.burnTick=(e.burnTick||0)-dt;if(e.burnTick<=0){e.burnTick=.65;const burn=currentStats().burn;if(burn>0){floating(e.x,e.y-25,'~'+Math.round(burn),'#ffad6e');v42tRecord(burn,false,null,'dot');}}}
};
// Remove dummies from the serialized enemy roster, even an automatic save
// performed inside another game system. Report UI is never resumed from save.
const v42tSaveOld=save;save=function(...args){
 const a=enemies,m=modal,has=a.some(v42tIs),report=m?.kind==='v42practice';
 if(Array.isArray(p?.owEnemies)&&p.owEnemies.some(v42tIs))p.owEnemies=p.owEnemies.filter(e=>!v42tIs(e));
 if(!has&&!report)return v42tSaveOld(...args);
 if(has)enemies=a.filter(e=>!v42tIs(e));if(report)modal=null;
 try{return v42tSaveOld(...args);}finally{enemies=a;modal=m;}
};
// start_L13: lớp 38_save (trước đây lưu lớp dưới vào v42tStartOld). Gọi lớp dưới: start_L12.
function start_L13(...args){v42tStop(false);v42tReset();return start_L12(...args);}
// resume_L15: lớp 38_save (trước đây lưu lớp dưới vào v42tResumeOld). Gọi lớp dưới: resume_L14.
function resume_L15(...args){v42tStop(false);v42tReset();const r=resume_L14(...args);v42tRemove();if(modal?.kind==='v42practice')modal=null;return r;}
// update_L26: lớp 38_save (trước đây lưu lớp dưới vào v42tUpdateOld). Gọi lớp dưới: update_L25.
function update_L26(dt){
 if(V42T.active&&!v42tActive())v42tStop(false);
 if(p&&mode==='play'&&pressed.F6){delete pressed.F6;v42tOpen();}
 if(modal?.kind==='v42practice'&&pressed.Escape){delete pressed.Escape;modal=null;}
 if(v42tActive()&&!modal&&V42T.started)V42T.time+=dt;
 const r=update_L25(dt);
 if(V42T.active&&!v42tActive())v42tStop(true);return r;
}
// F6 is a convenience only; the primary route is the clickable yard and the
// journal. Cancel the browser's F6 focus shortcut when delivered to the game.
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('keydown',e=>{
 if(e.code==='F6'&&mode==='play'&&p&&e.target?.id!=='heroName')e.preventDefault();
},{capture:true});
// Inactive: a click on one of the existing decorative dummy bodies activates
// the yard, then delegates to normal enemy picking/chasing.
const v42tPointerOld=v8PointerDown;v8PointerDown=function(...args){
 if(!modal&&!V42T.active&&v42tNear(0)){
  const zone=v42tZone(),sign=hdPoint(zone.x,zone.y-zone.h*.26);
  if(Math.abs(sign.x-mouse.x)<108*V11_ZOOM&&Math.abs(sign.y-mouse.y)<19*V11_ZOOM){return v42tStart(1);}
  const hit=V16_DECOR.find(o=>{if(o.type!=='dummy')return false;const z=hdPoint(o.x,o.y);return Math.abs(z.x-mouse.x)<25&&mouse.y<z.y+8&&mouse.y>z.y-61;});
  if(hit){
   if(v42tStart(1)){const a=v42tDummies()[0];a.homeX=a.x=hit.x;a.homeY=a.y=hit.y;return v42tPointerOld(...args);}
  }
 }return v42tPointerOld(...args);
};
// Render the functional targets as labels/feedback above the existing,
// authored decorative dummy sprites. Never draw an overlapping monster.
const v42tHDMonsterOld=hdMonster;hdMonster=function(e,z){
 if(!v42tIs(e))return v42tHDMonsterOld(e,z);if(!v42tActive())return;
 g.save();g.translate(z.x,z.y);const color=V42T.armor?'#f1c982':'#b5eee0';g.globalAlpha=.82;
 v41cRing(22,HD.tilt,color,1.55);
 if(e.flash>0){v41cGlow(0,-31,21,1,color,Math.min(.6,e.flash*3.7));}
 g.globalAlpha=.94;g.fillStyle='#102a28de';g.strokeStyle=color;g.lineWidth=1;g.beginPath();g.roundRect(-46,-71,92,17,4);g.fill();g.stroke();
 text('MỘC NHÂN '+e.v42Number,0,-62.5,13,color,'center','bold');g.restore();
};
const v42tHDEffectsOld=hdEffects;hdEffects=function(v){
 const r=v42tHDEffectsOld(v);if(!v42tNear(100)||modal||v42tActive())return r;
 const z0=v42tZone(),z=hdPoint(z0.x,z0.y-z0.h*.26,v);g.save();g.translate(z.x,z.y);g.globalAlpha=.92;
 g.fillStyle='#142c2aea';g.strokeStyle='#c5b97d';g.lineWidth=1.2;g.beginPath();g.roundRect(-108,-15,216,31,5);g.fill();g.stroke();
 text('SÂN LUYỆN KIẾM · F6',0,-3,15,'#f6e3b3','center','bold');text('Nhấp mộc nhân để thử chiêu',0,9,10,'#c2d9ca','center');g.restore();return r;
};
const v42tTargetOld=v34Target;v34Target=function(){const e=v42tTargetOld();return e|| (v42tActive()?v42tDummies()[0]:null);};

function v42tFmt(n){return Math.round(n).toLocaleString('vi-VN');}
function v42tPanel(){
 if(!v42tActive()){modal=null;return;}
 const m=v42tMetrics(),col='#badbd0',gold='#e6ce9b',muted='#a6c0af',paper='#e8ebdb';
 v34Shell('SÂN LUYỆN KIẾM  /  PHÂN TÍCH','Mộc nhân bất tử · không tu vi, không chiến lợi phẩm · linh lực & hồi chiêu dùng cơ chế thật');
 // Top cards and configuration.
 const cards=[['DPS ĐẾN HIỆN TẠI',v42tFmt(m.dps),'Tổng / thời gian'],['DPS 5 GIÂY',v42tFmt(m.recentDps),'Cửa sổ gần nhất'],['SÁT THƯƠNG',v42tFmt(m.total),m.hits+' lần trúng'],['TRÚNG CHIÊU',Math.round(m.accuracy*100)+'%',m.landed+' / '+m.casts+' lần thi triển'],['CHÍ MẠNG',Math.round(m.critRate*100)+'%',m.crits+' đòn chí mạng']];
 for(let i=0;i<cards.length;i++){const x=35+i*242,[label,val,detail]=cards[i];v35Plate(x,112,233,79,i===0?gold:'#527365');text(label,x+13,127,12,muted,'left','bold');text(val,x+13,151,24,i===0?gold:paper,'left','bold');text(detail,x+13,176,11,muted);}
 const elapsed=Math.floor(m.duration),times=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');
 v35Plate(35,204,1207,51,'#698776');text('LƯỢT TẬP '+times,49,229,14,gold,'left','bold');
 v34Button(216,213,130,33,'1 mộc nhân',()=>v42tSetup(1,V42T.armor),V42T.count===1,'practiceOne');
 v34Button(354,213,130,33,'3 mộc nhân',()=>v42tSetup(3,V42T.armor),V42T.count===3,'practiceThree');
 v34Button(496,213,128,33,'Tiêu chuẩn',()=>v42tSetup(V42T.count,false),!V42T.armor,'practiceNormal');
 v34Button(632,213,128,33,'Giáp dày',()=>v42tSetup(V42T.count,true),V42T.armor,'practiceArmor');
 text('Đổi mẫu sẽ đặt lại báo cáo.',1230,229,12,muted,'right');
 // Dedicated table: every normal chain and learned skill uses the exact
 // actual hit result, with projectiles attributed to their original release.
 const left=35,top=270,w=850,h=366;v35Plate(left,top,w,h,'#8a9d74');text('PHÂN TÍCH XOAY VÒNG CÔNG PHÁP',left+14,top+18,15,gold,'left','bold');
 const headerY=top+42;for(const [str,x,align] of [['Chiêu thức',left+16,'left'],['Thi triển',left+325,'right'],['Trúng',left+408,'right'],['Sát thương',left+558,'right'],['TB / đòn',left+666,'right'],['Tỷ trọng',left+826,'right']])text(str,x,headerY,12,muted,align,'bold');
 V42T_KEYS.forEach((key,i)=>{const a=V42T.rows[key]||{damage:0,hits:0,casts:0,landed:0,crits:0},yy=top+62+i*32,f=m.total?a.damage/m.total:0,locked=key.startsWith('skill')&&!v11Rank(Number(key.slice(-1)));
   box(left+8,yy-10,w-16,30,i%2?'#243b3277':'#172b2677','',2);const c=key.startsWith('atk')?'#bfecd6':key.startsWith('skill')?V11_SKILLS[p.cls][Number(key.slice(-1))].color:'#d7b690';
   diamond(g,left+17,yy+3,4,c);v33Fit(v42tName(key)+(locked?' · chưa học':''),left+28,yy+3,290,13,locked?'#7b9285':paper,'left','bold');
   text(a.casts?String(a.casts):'—',left+325,yy+3,13,paper,'right');text(String(a.hits),left+408,yy+3,13,paper,'right');text(v42tFmt(a.damage),left+558,yy+3,13,paper,'right');text(a.hits?v42tFmt(a.damage/a.hits):'—',left+666,yy+3,13,paper,'right');
   box(left+684,yy-2,92,10,'#11241e','',2);if(f>0)box(left+684,yy-2,92*f,10,c,'',2);text(Math.round(f*100)+'%',left+826,yy+3,12,c,'right','bold');
 });
 const rx=898,rw=344;v35Plate(rx,top,rw,h,'#8a9d74');text('NHỊP RA CHIÊU',rx+14,top+18,15,gold,'left','bold');
 text('10 lần thi triển gần nhất',rx+14,top+40,12,muted);
 const last=V42T.history.slice(-10).reverse();if(!last.length){text('Ra chiêu để thấy trình tự ở đây.',rx+rw/2,top+140,13,muted,'center');}
 for(const [i,a] of last.entries()){
  const yy=top+62+i*25,done=V42T.castInfo.get(a.id)?.hit;
  box(rx+9,yy-10,rw-18,22,i%2?'#223d336e':'#172b266e','',2);diamond(g,rx+18,yy,3,done?'#b2e3ca':'#bf997f');v33Fit(v42tName(a.key),rx+29,yy,223,12,paper);
  text(a.time.toFixed(1)+'s',rx+rw-12,yy,11,muted,'right');
 }
 text('Đòn lớn nhất · '+v42tFmt(m.max),rx+14,top+h-19,13,gold,'left','bold');
 v34Button(35,650,170,34,'Đặt lại báo cáo',v42tReset,false,'practiceReset');
 v34Button(215,650,153,34,'Tạm dừng / luyện',()=>modal=null,false,'practiceContinue');
 v34Button(1063,650,179,34,'Kết thúc luyện tập',()=>v42tStop(true),false,'practiceExit');
 text('Thời gian dừng khi mở bảng. Đặt lại không hồi linh lực/hồi chiêu.',390,667,12,muted);
}

const v42tJournalOld=v8Journal;v8Journal=function(){
 const r=v42tJournalOld();if(p?.worldMode&&!v36Inside()){
   v34Button(905,45,260,39,'F6 · Sân Luyện Kiếm',v42tOpen,false,'practiceJournal');
 }return r;
};


