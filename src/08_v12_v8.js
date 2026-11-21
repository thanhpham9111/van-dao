'use strict';
// V12 — Thiên Mệnh. Original illustrations and quest progression.
const V12_MAIN=[
 {name:'Nhập đạo Thanh Thạch',desc:'Mở hội thoại với trưởng lão Thanh Thạch tại Thanh Vân Đại Điện để bắt đầu chính tuyến.',goal:'Gặp trưởng lão',target:'inn',done:()=>!!p.v12Talk.inn,stones:10,pills:1,xp:40},
 {name:'Lĩnh ngộ công pháp',desc:'Mở bảng kỹ năng (T), dùng ít nhất 1 điểm để học hoặc tăng bậc công pháp môn phái.',goal:'Cộng một điểm kỹ năng',done:()=>v11Levels().reduce((a,b)=>a+b,0)>1,action:'skill',stones:10,pills:1,xp:50},
 {name:'Bước chân giang hồ',desc:'Rời thôn, đi về phía đông tới Thanh Trúc Lâm. Có thể đi theo đường vàng hoặc dùng WASD.',goal:'Khám phá Thanh Trúc Lâm',region:'truc',done:()=>p.discovered.includes('truc'),stones:8,pills:1,xp:60},
 {name:'Trừ yêu hộ thôn',desc:'Hạ 3 yêu thú thường trong Thanh Trúc Lâm. Chuột trái tấn công, chuột phải thi triển; Shift lướt né, H dùng đan.',goal:'Hạ yêu thú Thanh Trúc Lâm',region:'truc',kill:3,done:()=>v12Count('truc')>=3,stones:12,pills:2,xp:80},
 {name:'Thanh Trúc yêu vương',desc:'Tìm và đánh bại Trúc Lang Vương. Nâng kỹ năng và trang bị trước khi giao chiến.',goal:'Hạ Trúc Lang Vương',region:'truc',boss:true,done:()=>!!p.worldBossDead,stones:20,pills:3,xp:120},
 {name:'Trúc Cơ đại đạo',desc:'Săn yêu thú Thanh Trúc Lâm cho đến khi đầy tu vi ở Luyện Khí tầng 9. Sau đó nhấn B để vào Cửu Tiêu Lôi Đài. C mở hồ sơ, T nâng công pháp.',goal:'Đạt Trúc Cơ',action:'break',done:()=>p.level>=10,stones:25,pills:3,xp:150},
 {name:'Vạn Giới mở cửa',desc:'Đến trận pháp Vạn Giới Bí Cảnh nhập môn tại Vạn Yêu Sơn. Tương tác E hoặc nhấp chuột vào trận pháp.',goal:'Tiến vào Vạn Giới Bí Cảnh',target:'dungeon_intro',done:()=>!!p.v12Entered,stones:30,pills:3,xp:180},
 {name:'Thí luyện đầu tiên',desc:'Tiêu diệt toàn bộ yêu thú ở phòng đầu của Vạn Giới Bí Cảnh. Nhận thưởng, kiểm tra bí ấn và vật phẩm rồi sang phòng tiếp theo.',goal:'Vượt phòng đầu Vạn Giới',target:'dungeon_intro',done:()=>!!p.v12Cleared,stones:35,pills:3,xp:220}
];
const V12_SIDE=[
 {id:'wind',name:'Gió qua Thiên Phong',desc:'Du hành đến Thiên Phong Cốc và khám phá vùng đất phía đông.',goal:'Khám phá Thiên Phong Cốc',region:'phong',done:()=>p.discovered.includes('phong'),stones:15,pills:2,xp:25},
 {id:'windaltar',name:'Thiên Phong đạo vận',desc:'Lĩnh ngộ Thiên Phong Linh Đài trong thung lũng.',goal:'Tương tác Thiên Phong Linh Đài',target:'phongaltar',done:()=>!!p.claimed.phongaltar,stones:20,pills:2,xp:30},
 {id:'thunder',name:'Lôi vực hành giả',desc:'Hạ 5 yêu thú thường ở Tử Lôi Hoang Nguyên.',goal:'Hạ yêu thú Tử Lôi',region:'loi',kill:5,done:()=>v12Count('loi')>=5,stones:25,pills:3,xp:40},
 {id:'thunderaltar',name:'Di tích lôi thần',desc:'Tiếp cận và lĩnh ngộ Tử Lôi Thần Tích.',goal:'Tương tác Tử Lôi Thần Tích',target:'loialtar',done:()=>!!p.claimed.loialtar,stones:25,pills:3,xp:35}
];
function v12Init(){if(!p)return;p.v12Main??=0;p.v12Track??='main';p.v12Talk??={};p.v12Kills??={};p.v12Side??={};if(p.v8Quests?.['met:inn'])p.v12Talk.inn=true;}
function v12Count(id){return p.v12Kills?.[id]||0;}
function v12Reward(t){p.stones+=t.stones;p.pills+=t.pills;if(t.xp)gainXP(t.xp);}
function v12Migrate(){
 if(!p)return;
 v12Init();
 if(p.v451Quest>=2)return;
 const run=p.v28?.run, history=p.v28?.history?.intro;
 const completed=history?.clears>0||Object.entries(p.v29?.records||{}).some(([key,r])=>key.startsWith('intro:')&&r.clears>0);
 const intro=run?.route==='intro';
 const clearInRun=intro&&(Object.keys(run.rooms||{}).some(n=>Number(n)>0)||run.sigils?.includes(0)||
   (v28Run()===run&&room===0&&(cleared||(remaining===0&&modal?.kind==='reward'))));
 p.v12Entered=!!(intro||completed||history?.fails>0||history?.retreats>0);
 // A V45.1 player can clear room zero, retreat and then start another run.
 // Preserve that verified milestone when the old expedition has been replaced.
 const priorClear=p.v451Quest===1&&p.v12Entered&&p.v12Cleared&&p.v12Main===8&&p.v12RewardedThrough>=8;
 p.v12Cleared=!!(completed||clearInRun||priorClear);
 // Legacy saves could grant steps 7 and 8 during a lightning trial. Keep
 // their old reward cursor and rebuild the quest cursor from dungeon records.
 p.v12RewardedThrough=Math.max(p.v12RewardedThrough||0,p.v12Main);
 if(p.v12Main>6&&!p.v12Entered)p.v12Main=6;
 else if(p.v12Main>7&&!p.v12Cleared)p.v12Main=7;
 p.v451Quest=2;
 save();
}
// start_L02: lớp 08_v12_v8 (trước đây lưu lớp dưới vào v12StartOld). Gọi lớp dưới: start_L01.
function start_L02(...a){start_L01(...a);v12Init();p.v451Quest=2;p.v12RewardedThrough=0;save();}
// resume_L04: lớp 08_v12_v8 (trước đây lưu lớp dưới vào v12ResumeOld). Gọi lớp dưới: resume_L03.
function resume_L04(){resume_L03();v12Migrate();}
const v12TalkOld=v8Talk;v8Talk=function(o){v12TalkOld(o);if(modal?.kind==='npc8'&&o){v12Init();p.v12Talk[o.id]=true;v12Check();save();}};
// hit_L01: lớp 08_v12_v8 (trước đây lưu lớp dưới vào v12HitOld). Gọi lớp dưới: hit_L00.
function hit_L01(e,...a){const alive=!e.dead;hit_L00(e,...a);if(alive&&e.dead&&p.worldMode&&!bossType(e.type)&&!e.v28Summon){v12Init();const id=e.region||regionAt(e.x,e.y).id;p.v12Kills[id]=v12Count(id)+1;save();}}
function v12Check(){
 v12Init();
 const run=v28Run();
 if(run?.route==='intro'){
  p.v12Entered=true;
  if(room===0&&(cleared||(remaining===0&&modal?.kind==='reward')))p.v12Cleared=true;
 }
 if(p.v12Track.startsWith('old:')&&p.v8Quests?.['quest:'+p.v12Track.slice(4)]===2){p.v12Track='main';save();}
 const index=p.v12Main,t=V12_MAIN[index];
 if(!t||!t.done())return;
 const award=(p.v12RewardedThrough??index)<=index;
 if(award)v12Reward(t);
 p.v12Main=index+1;
 p.v12RewardedThrough=Math.max(p.v12Main,p.v12RewardedThrough??0);
 message('Hoàn thành: '+t.name+(award?' · +'+t.stones+' linh thạch · +'+t.pills+' đan':''));
 save();
}
function v12OldDone(id){const flag=V8_TASKS[id][0];return flag==='worldBossDead'?p.worldBossDead&&(id!=='demonWatcher'||p.level>=10):flag==='truc'?p.discovered.includes('truc'):!!p.claimed[flag];}
function v12Old(id){const [flag,name,goal]=V8_TASKS[id],state=p.v8Quests?.['quest:'+id]||0,done=v12OldDone(id);return {id:'old:'+id,name,goal:state===0?'Gặp '+V8_INFO[id].name+' để nhận':state===1&&done?'Báo cáo '+V8_INFO[id].name:goal,desc:goal+' · Người giao nhiệm vụ: '+V8_INFO[id].name+'. Khi hoàn thành, quay lại gặp người giao nhiệm vụ để nhận thưởng.',state:state===2?'done':state===0?'available':done?'ready':'active',stones:10,pills:1,xp:20,target:state===0||done?id:flag==='worldBossDead'?undefined:flag==='truc'?undefined:flag,region:state===1&&!done&&(flag==='truc'||flag==='worldBossDead')?'truc':undefined,boss:flag==='worldBossDead'&&state===1&&!done&&!p.worldBossDead,action:id==='demonWatcher'&&state===1&&p.worldBossDead&&p.level<10?'break':undefined};}
function v12Entries(){v12Init();return [...V12_MAIN.map((t,i)=>({...t,id:'main:'+i,state:i<p.v12Main?'done':i===p.v12Main?'active':'locked'})),...Object.keys(V8_TASKS).map(v12Old),...V12_SIDE.map(t=>({...t,id:'side:'+t.id,state:p.v12Side[t.id]===2?'done':!p.v12Side[t.id]?'available':t.done()?'ready':'active'}))];}
function v12Tracked(){const a=v12Entries();return p.v12Track==='main'?a.find(t=>t.id==='main:'+p.v12Main):a.find(t=>t.id===p.v12Track&&t.state!=='done');}
function v12Progress(t){if(t.state==='done')return 'Hoàn thành';if(t.state==='locked')return 'Chưa mở khóa';if(t.state==='available')return 'Chưa nhận';if(t.state==='ready')return 'Có thể nhận thưởng';if(t.kill)return Math.min(t.kill,v12Count(t.region))+' / '+t.kill+' yêu thú';if(t.action==='break')return 'Cấp '+p.level+' / 10 · Tu vi '+Math.floor(p.xp)+' / '+xpNeed();if(t.action==='skill')return 'Điểm kỹ năng còn lại: '+v11SkillPoints();return '0 / 1';}
function v12Target(t){
 if(!t||!p.worldMode||t.state==='done'||t.state==='locked'||t.action==='skill')return null;
 if(t.target){
  const o=v8POIs().find(a=>a.id===t.target);
  return o?{...o,label:o.name,poi:true}:null;
 }
 const training=t.action==='break';
 if(training&&(p.level>=10||v30TrialEligible()))return null;
 const r=REG[training?'truc':t.region];
 if(!r)return null;
 if(t.boss||t.kill||training){
  const type=V22_REG[r.id].bossType;
  const es=enemies.filter(e=>!e.dead&&!e.v42Practice&&!e.v28Summon&&(e.region||regionAt(e.x,e.y).id)===r.id&&
    (t.boss?e.type===type&&!e.v29World:!bossType(e.type)));
  es.sort((a,b)=>dist(a,p)-dist(b,p));
  if(es[0])return {x:es[0].x,y:es[0].y,label:training?'Yêu thú để tích tu vi':TYPES[es[0].type].name,enemy:true};
 }
 return {...r,label:r.name};
}
function v12Guide(t=v12Tracked()){
 if(!t)return;
 p.v12Track=t.id.startsWith('main:')?'main':t.id;
 modal=null;
 save();
 if(t.action==='skill'){v11Open();return;}
 if(t.action==='break'&&v30TrialEligible()){v22Break();return;}
 const q=v12Target(t);
 if(!q){message(p.worldMode?'Theo dõi tiến độ trong nhật ký.':'Tiêu diệt toàn bộ yêu thú trong phòng.');return;}
 if(q.poi)v8SetGoal(q,{type:'poi',id:q.id});
 else if(q.enemy){
  if(dist(p,q)<=112){v8Cancel();message('Mục tiêu ở gần · '+q.label);return;}
  const a=Math.atan2(p.y-q.y,p.x-q.x);
  const nearby=[0,.65,-.65,1.25,-1.25].map(d=>({x:q.x+Math.cos(a+d)*100,y:q.y+Math.sin(a+d)*100}));
  v8SetGoal(nearby.find(z=>!owBlocked(z.x,z.y,16))||q);
 }else v8SetGoal(q);
 if(V8.route.length)message('Đang dẫn đường · '+q.label);
}
function v12Open(){if(modal?.kind==='journal8'){modal=null;return;}v8Cancel();V8.vx=V8.vy=0;const t=v12Tracked(),tab=p.v12Track==='main'?0:1,items=v12Entries().filter(a=>tab===0?a.id.startsWith('main:'):!a.id.startsWith('main:')&&a.state!=='done'),page=Math.floor(Math.max(0,items.findIndex(a=>a.id===t?.id))/8);modal={kind:'journal8',tab,page,selected:t?.id};}
// update_L03: lớp 08_v12_v8 (trước đây lưu lớp dưới vào v12UpdateOld). Gọi lớp dưới: update_L02.
function update_L03(dt){if(mode==='play'&&p){if(pressed.KeyQ){v12Open();delete pressed.KeyQ;}if(pressed.Escape&&modal?.kind==='journal8'){modal=null;delete pressed.Escape;}}update_L02(dt);if(mode==='play'&&p)v12Check();}
function v12Wrap(str,x,y,w,size,col,step=21,max=4){let lines=[],line='';g.font=size+'px Arial';for(const word of str.split(' ')){const n=line?line+' '+word:word;if(g.measureText(n).width>w&&line){lines.push(line);line=word;}else line=n;}if(line)lines.push(line);lines.slice(0,max).forEach((s,i)=>text(s,x,y+i*step,size,col));return y+Math.min(max,lines.length)*step;}
const V12_STATUS={active:'Đang thực hiện',ready:'Chờ báo cáo',available:'Có thể nhận',done:'Hoàn thành',locked:'Chưa mở'};
v8Journal=function(){g.fillStyle='#071319d4';g.fillRect(0,0,W,H);ornament(75,60,1130,600,'#14292f');text('THIÊN MỆNH · NHẬT KÝ NHIỆM VỤ',105,100,25,C.gold,'left','bold');text('Chính tuyến '+p.v12Main+'/'+V12_MAIN.length+'   ·   '+realm(),105,130,13,C.jade);addButton(1130,83,48,38,'×',()=>modal=null);
const tabs=['Chính tuyến','Nhiệm vụ phụ','Đã hoàn thành','Hướng dẫn'];modal.tab??=0;modal.page??=0;tabs.forEach((t,i)=>addButton(104+i*265,151,248,38,t,()=>{modal.tab=i;modal.page=0;modal.selected=null;},modal.tab===i));
if(modal.tab===3){const a=[['01 · DI CHUYỂN','WASD / phím mũi tên hoặc nhấp đất. Click NPC để tự tiến đến và trò chuyện.'],['02 · CHIẾN ĐẤU','Chuột trái đánh thường, chuột phải và 1–3 thi triển công pháp, Shift lướt né, H dùng đan.'],['03 · TU LUYỆN','T học và hoàn điểm kỹ năng miễn phí; C cộng/trừ chỉ số; G trang bị; B đột phá khi đủ tu vi.'],['04 · DẪN ĐƯỜNG','Chọn nhiệm vụ, nhấn Theo dõi hoặc Dẫn đường. Dấu vàng trên bản đồ nhỏ chỉ vị trí mục tiêu; WASD hủy tự đi.'],['05 · NHIỆM VỤ','Chính tuyến tự hoàn thành khi đạt mục tiêu. Nhiệm vụ NPC phải nhận và báo cáo tại NPC; nhiệm vụ du hành nhận thưởng trong nhật ký.']];a.forEach(([title,desc],i)=>{const y=217+i*78;box(105,y,1068,65,'#1d373b','#456961',4);text(title,126,y+18,15,C.gold,'left','bold');v12Wrap(desc,126,y+43,1020,13,C.paper,18,2);});return;}
const all=v12Entries(),list=all.filter(t=>modal.tab===0?t.id.startsWith('main:'):modal.tab===1?!t.id.startsWith('main:')&&t.state!=='done':t.state==='done'),pages=Math.max(1,Math.ceil(list.length/8));modal.page=clamp(modal.page,0,pages-1);const visible=list.slice(modal.page*8,modal.page*8+8);let sel=visible.find(t=>t.id===modal.selected)||visible.find(t=>t.state==='active')||visible[0];if(sel)modal.selected=sel.id;
visible.forEach((t,i)=>{const y=208+i*47,color=t.state==='done'?C.jade:t.state==='locked'?C.muted:C.gold;box(105,y,425,42,sel===t?'#31504a':'#1b3339',sel===t?C.gold:'#46635f',4);text(t.name,119,y+14,13,color,'left','bold');text(V12_STATUS[t.state],119,y+31,10,C.muted);if(t.id===v12Tracked()?.id)text('◆',508,y+21,15,C.gold,'center');buttons.push({x:105,y,w:425,h:42,fn:()=>modal.selected=t.id});});if(!visible.length)text('Chưa có nhiệm vụ ở mục này.',120,255,14,C.muted);
addButton(105,595,105,35,'‹ Trước',()=>modal.page=Math.max(0,modal.page-1));text((modal.page+1)+' / '+pages,315,613,13,C.paper,'center');addButton(425,595,105,35,'Sau ›',()=>modal.page=Math.min(pages-1,modal.page+1));
box(550,208,624,422,'#1a353b','#65877a',5);if(!sel){text('Chọn nhiệm vụ để xem chi tiết.',862,403,16,C.muted,'center');return;}
text(sel.name,573,244,22,C.gold,'left','bold');text(V12_STATUS[sel.state],573,274,13,C.jade);v12Wrap(sel.desc,573,309,575,14,C.paper,23,4);text('MỤC TIÊU',573,411,13,C.gold,'left','bold');v12Wrap(sel.goal,573,440,575,15,C.paper,21,2);text(v12Progress(sel),573,479,14,C.jade,'left','bold');text('THƯỞNG · '+sel.stones+' linh thạch · '+sel.pills+' Hồi Xuân Đan'+(sel.xp?' · '+sel.xp+' tu vi':''),573,521,13,C.gold);
const inactive=['done','locked'].includes(sel.state);if(!inactive){const isSide=sel.id.startsWith('side:');if(isSide&&(sel.state==='available'||sel.state==='ready')){addButton(573,563,184,39,sel.state==='available'?'Nhận nhiệm vụ':'Nhận thưởng',()=>{const k=sel.id.slice(5);if(sel.state==='available'){p.v12Side[k]=1;p.v12Track=sel.id;}else if(p.v12Side[k]===1&&V12_SIDE.find(t=>t.id===k).done()){p.v12Side[k]=2;v12Reward(sel);if(p.v12Track===sel.id)p.v12Track='main';}save();},true);}else{addButton(573,563,184,39,'Theo dõi',()=>{p.v12Track=sel.id.startsWith('main:')?'main':sel.id;save();},true);}addButton(771,563,184,39,'Dẫn đường',()=>v12Guide(sel));}addButton(969,563,183,39,'Đóng · ESC',()=>modal=null);
};
function v12Tracker(world){if(modal)return;const t=v12Tracked();const x=1015,y=world?193:198,w=253,h=147;ornament(x,y,w,h,'#0d2028ed');text('◆  THIÊN MỆNH',x+13,y+18,12,C.gold,'left','bold');text('Q',x+w-16,y+18,12,C.jade,'right','bold');if(t){v12Wrap(t.name,x+13,y+40,w-26,14,C.paper,17,2);v12Wrap(t.goal,x+13,y+73,w-26,12,C.jade,16,2);text(v12Progress(t),x+13,y+105,11,C.gold);addButton(x+12,y+118,111,23,'Dẫn đường',()=>v12Guide(t),true);addButton(x+130,y+118,111,23,'Nhật ký',v12Open);}else{text('Chọn nhiệm vụ để theo dõi.',x+13,y+55,12,C.paper);addButton(x+12,y+118,229,23,'Nhật ký · Q',v12Open);}}
function v12Marker(){if(modal||!p.worldMode)return;const t=v12Tracked(),q=v12Target(t);if(!q)return;const z=hdPoint(q.x,q.y),edge=z.x<345||z.x>1000||z.y<116||z.y>560,x=clamp(z.x,345,1000),y=clamp(z.y-39,116,560);g.save();g.shadowBlur=9;g.shadowColor='#f4c765';diamond(g,x,y,edge?8:7,'#f6d374');g.restore();if(edge){const a=Math.atan2(z.y-y,z.x-x);g.save();g.translate(x,y);g.rotate(a);hdPoly(g,[[11,0],[1,-5],[1,5]],'#f9e8a3');g.restore();}text(Math.round(dist(q,p))+' bước',x,y-14,10,'#ffedb2','center','bold');}


// Original illustrated skill icons: 5×3 atlas, one row per school.
const v12IconOld=v11SkillIcon;v11SkillIcon=function(kind,x,y,r,col){const a=imgs.v12SkillAtlas;if(!a?.ready||!p){v12IconOld(kind,x,y,r,col);return;}const idx=V11_SKILLS[p.cls].findIndex(s=>s.kind===kind);if(idx<0){v12IconOld(kind,x,y,r,col);return;}const im=a.img||a,iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height;if(!iw||!ih){v12IconOld(kind,x,y,r,col);return;}const sw=iw/5,sh=ih/3;g.save();g.imageSmoothingEnabled=true;g.beginPath();g.rect(x-r,y-r,2*r,2*r);g.clip();g.drawImage(im,idx*sw+2,p.cls*sh+2,sw-4,sh-4,x-r,y-r,2*r,2*r);g.restore();};
const v12UiIconOld=uiIcon;uiIcon=function(i,x,y,size=44,dim=false){if(i===1&&mode==='play'&&p){const s=V11_SKILLS[p.cls][0];g.save();if(dim)g.globalAlpha=.4;v11SkillIcon(s.kind,x+size/2,y+size/2,size/2,s.color);g.restore();return;}v12UiIconOld(i,x,y,size,dim);};
const v12EffectsOld=v11Effects;v11Effects=function(v){v12EffectsOld(v);for(const f of fx){if(f.kind!=='v11burst'||!['storm','blizzard','quake','crush','guard'].includes(f.style))continue;const z=p.worldMode?hdPoint(f.x,f.y,v):f,q=clamp(1-f.life/f.max,0,1),r=f.radius||70,tilt=p.worldMode?HD.tilt:1;g.save();g.translate(z.x,z.y-13);g.globalAlpha=Math.sin(Math.PI*Math.min(.99,q+.11))*.92;g.shadowColor=f.color;g.shadowBlur=4;for(let j=0;j<(f.style==='guard'?6:12);j++){const a=j*TAU/(f.style==='guard'?6:12)+q*.8,rr=r*(.25+.65*q),x=Math.cos(a)*rr,y=Math.sin(a)*rr*tilt;g.save();g.translate(x,y);g.rotate(a);if(f.style==='storm'){hdPoly(g,[[32,0],[8,-5],[-18,0],[8,5]],f.color);hdLine(g,[-13,0],[29,0],'#fff',2);hdLine(g,[-8,-7],[-8,7],f.color,2);}else if(f.style==='blizzard'){hdPoly(g,[[16,0],[3,-8],[-14,0],[3,8]],'#ace7ff');hdLine(g,[-10,0],[13,0],'#fff',2);hdLine(g,[3,-7],[3,7],'#f3fbff',1.5);}else if(f.style==='guard'){hdPoly(g,[[0,-14],[10,-8],[8,8],[0,14],[-8,8],[-10,-8]],'#fbe4a0');hdPoly(g,[[0,-8],[5,-4],[4,5],[0,8],[-4,5],[-5,-4]],'#8b6338');}else{hdLine(g,[-18,0],[0,-5],f.color,4);hdLine(g,[0,-5],[18,5],f.color,3);hdPoly(g,[[4,-18],[13,-7],[4,-3],[-7,-9]],'#e8a85e');}g.restore();}g.restore();}};

