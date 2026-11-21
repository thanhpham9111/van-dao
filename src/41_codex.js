'use strict';
// v42_codex.js
// V42 · Vạn Linh Phổ: observation-driven bestiary and field atlas. No rewards,
// no invented drop percentages, no remote teleportation or training credit.
const V42CODEX={owner:null,tick:0,observed:new WeakSet(),defeated:new WeakSet(),filter:0,page:0,selected:null,region:'thon',poi:null,affix:null,dropPage:0,map:null,mapKey:'',note:''};
const V42CX_ROLE={swift:'Cận chiến · cơ động',guard:'Cận chiến · hộ giáp',ranged:'Tấn công tầm xa',boss:'Thủ lĩnh · nhiều giai đoạn'};
const V42CX_SHAPE={sector:'Hình quạt',line:'Đường thẳng',circle:'Vùng tròn',ring:'Vòng chấn',target:'Tại điểm mục tiêu',fan:'Pháp đạn'};
const V42CX_TIP={sector:'Di chuyển sang bên sườn trước khi ra đòn.',line:'Lướt ngang khỏi đường lao tới.',circle:'Lùi ra khỏi vùng tròn được đánh dấu.',ring:'Tránh vành sáng, vào trong tâm hoặc lùi xa.',target:'Rời vị trí có vòng cảnh báo trước khi giáng xuống.',fan:'Lách giữa các hướng pháp đạn, giữ khoảng cách.'};
const V42CX_ELEMENT={poison:'Độc',fire:'Hỏa',ice:'Băng',lightning:'Lôi'};
const V42CX_SHORT={thon:'Thanh Thạch',truc:'Thanh Trúc',yeu:'Vạn Yêu',tram:'Hắc Độc',tuyet:'Bắc Minh',hoa:'Xích Viêm',phong:'Thiên Phong',quy:'U Minh',ma:'Ma Vực',loi:'Tử Lôi'};
function v42cxInt(n,min=0,max=10000000){return Number.isFinite(n)?clamp(Math.floor(n),min,max):min;}
function v42cxPlain(o){return !!o&&typeof o==='object'&&!Array.isArray(o);}
function v42cxReal(e){return !!(e&&!e.v42Practice&&!e.v28Summon&&!e.v42Training&&Number.isInteger(e.type)&&TYPES[e.type]);}
function v42cxRegion(e){const id=p.worldMode?(e.region||regionAt(e.x,e.y).id):(e.v28Region||MAPS[room]?.v28Region);return V22_REG[id]?id:null;}
function v42cxProfile(e){const d=v27Profile(e);return {role:d.role,pattern:d.pattern.filter(k=>V27_BOOK[k]).slice(0,6)};}
function v42cxBlank(){return {kills:0,eliteKills:0,first:0,last:0,lo:0,hi:0,hp:0,atk:0,role:'',pattern:[],affinities:[],sites:{},drops:{},stones:0,pills:0,dropKills:0};}
function v42cxDay(){return Math.floor((p.worldTime||0)/360)+1;}
function v42cxHistorical(type,count,id){if(!TYPES[type]||!count)return;const e=v42cxBlank();e.kills=v42cxInt(count);e.lo=e.hi=V22_REG[id]?.max||0;e.role='boss';e.pattern=(V27_BOSS[id]||[]).slice();p.v42codex.entries[type]=e;}
function v42cxMigrate(){
 const existed=v42cxPlain(p.v42codex)&&p.v42codex.version===1;
 if(!existed){p.v42codex={version:1,entries:{}};for(const [id,a] of Object.entries(p.v22?.bosses||{}))if(V22_REG[id]?.bossType!=null)v42cxHistorical(V22_REG[id].bossType,a?.kills,id);for(const [id,a] of Object.entries(p.v29?.events||{}))if(V29_WORLD[id])v42cxHistorical(V29_WORLD[id].type,a?.kills,id);}
 const s=p.v42codex;if(!v42cxPlain(s.entries))s.entries={};
 for(const [key,r] of Object.entries(s.entries)){const i=Number(key);if(!Number.isInteger(i)||String(i)!==key||!TYPES[i]||!v42cxPlain(r)){delete s.entries[key];continue;}
  const z=v42cxBlank();for(const k of ['kills','eliteKills','first','last','stones','pills','dropKills'])z[k]=v42cxInt(r[k]);z.eliteKills=Math.min(z.eliteKills,z.kills);z.lo=v42cxInt(r.lo,0,45);z.hi=Math.max(z.lo,v42cxInt(r.hi,0,45));z.hp=v42cxInt(r.hp);z.atk=v42cxInt(r.atk);z.role=V42CX_ROLE[r.role]?r.role:'';z.pattern=Array.isArray(r.pattern)?[...new Set(r.pattern.filter(k=>typeof k==='string'&&V27_BOOK[k]))].slice(0,6):[];
  z.affinities=typeof V42ELITE_DEFS!=='undefined'&&Array.isArray(r.affinities)?[...new Set(r.affinities.filter(k=>typeof k==='string'&&Object.hasOwn(V42ELITE_DEFS,k)))].slice(0,9):[];
  if(v42cxPlain(r.sites))for(const [k,q] of Object.entries(r.sites))if(v42cxPlain(q)&&((k.startsWith('w:')&&V22_REG[k.slice(2)])||['d:intro','d:ma','a'].includes(k))){if(k.startsWith('w:')&&Number.isFinite(q.x)&&Number.isFinite(q.y)&&q.x>=0&&q.x<=OW.w&&q.y>=0&&q.y<=OW.h)z.sites[k]={x:q.x,y:q.y};else if(!k.startsWith('w:'))z.sites[k]={};}
  if(v42cxPlain(r.drops))for(const [k,d] of Object.entries(r.drops)){const j=Number(k);if(Number.isInteger(j)&&String(j)===k&&EQUIPMENT[j]&&v42cxPlain(d))z.drops[k]={n:v42cxInt(d.n,1),q:v42cxInt(d.q,0,QUALITY.length-1)};}
  s.entries[key]=z;
 }
 V42CODEX.owner=p;V42CODEX.observed=new WeakSet();V42CODEX.defeated=new WeakSet();V42CODEX.tick=0;V42CODEX.map=null;V42CODEX.mapKey='';V42CODEX.selected=null;V42CODEX.affix=null;V42CODEX.region=p.mapId||'thon';V42CODEX.poi=null;V42CODEX.note='';
 return s;
}
function v42cxState(){if(!p)return null;if(V42CODEX.owner!==p||!v42cxPlain(p.v42codex)||p.v42codex.version!==1)return v42cxMigrate();return p.v42codex;}
function v42cxEntry(i){return v42cxState()?.entries[i]||null;}
function v42cxRecord(e){
 if(!p||mode!=='play'||!v42cxReal(e))return {r:null,changed:false,newEntry:false};
 const s=v42cxState(),prior=s.entries[e.type],r=s.entries[e.type]??=v42cxBlank(),old=JSON.stringify(r),d=v42cxProfile(e),lv=v22EnemyLevel(e),id=v42cxRegion(e),spot=p.worldMode&&id?'w:'+id:v28Run()?'d:'+v28Run().route:'a';
 r.role=d.role;r.pattern=[...new Set([...r.pattern,...d.pattern])].slice(0,6);r.first=r.first||v42cxDay();r.last=v42cxDay();r.lo=Math.min(r.lo||lv,lv);r.hi=Math.max(r.hi,lv);r.hp=Math.max(r.hp,Math.round(e.max||TYPES[e.type].hp));r.atk=Math.max(r.atk,Math.round(e.v22Atk||TYPES[e.type].atk));
 const aff=e.dead?(typeof v42EliteKnown==='function'?v42EliteKnown(e):null):(typeof v42EliteGet==='function'?v42EliteGet(e):null);if(aff?.key&&!r.affinities.includes(aff.key))r.affinities.push(aff.key);
 if(spot.startsWith('w:'))r.sites[spot]={x:Math.round(e.homeX??e.x),y:Math.round(e.homeY??e.y)};else r.sites[spot]={};
 return {r,changed:!prior||old!==JSON.stringify(r),newEntry:!prior};
}
function v42cxObserve(e){
 if(!v42cxReal(e)||e.dead||V42CODEX.observed.has(e))return false;
 V42CODEX.observed.add(e);const a=v42cxRecord(e);if(a.newEntry)v21Say('Vạn Linh Phổ · đã ghi nhận '+TYPES[e.type].name+' · F3');return a.changed;
}
function v42cxScan(dt){
 if(!p||mode!=='play'||modal||p.worldMode&&v36Inside())return;
 v42cxState();V42CODEX.tick+=dt;if(V42CODEX.tick<.45)return;V42CODEX.tick=0;let changed=false;
 for(const e of enemies){if(!v42cxReal(e)||e.dead||V42CODEX.observed.has(e)||dist(e,p)>(p.worldMode?420:560))continue;if(p.worldMode&&!v8Line(p,e,4,true))continue;changed=v42cxObserve(e)||changed;}
 if(changed)save();
}

// hit_L10: lớp 41_codex (trước đây lưu lớp dưới vào v42cxHitOld). Gọi lớp dưới: hit_L09.
function hit_L10(e,...args){if(v42cxReal(e)&&!e.dead){v42cxState();if(v42cxObserve(e))save();}return hit_L09(e,...args);}
// hit: điểm vào duy nhất (T04). Thứ tự lớp: hit_L10 → … → hit_L00. Muốn đổi hành vi: sửa đúng lớp, KHÔNG gán đè hit.
function hit(...a){const e=a[0],alive=!!e&&!e.dead,hp0=e?.hp;const r=hit_L10(...a);
 if(e&&COMBAT_HOOKS.afterHit.length){const info={e,dmg:a[1],crit:!!a[2],hp0,lost:Math.max(0,(hp0||0)-Math.max(0,e.hp||0)),killed:alive&&!!e.dead,boss:!!bossType(e.type)};for(const f of COMBAT_HOOKS.afterHit){try{f(info);}catch(err){console.error('afterHit',err);}}}
 return r;}
const v42cxDeathOld=v21DeathLoot;
v21DeathLoot=function(e,...args){
 if(!v42cxReal(e)||!e.dead||V42CODEX.defeated.has(e))return v42cxDeathOld(e,...args);
 const s=v42cxState();V42CODEX.defeated.add(e);const a=v42cxRecord(e),loot=v21State().loot,n=loot.length,result=v42cxDeathOld(e,...args);
 if(a.r){a.r.kills++;if(e.elite||(typeof v42EliteKnown==='function'&&v42EliteKnown(e)))a.r.eliteKills++;let recorded=false;for(const q of v21State().loot.slice(n)){
   if(q.kind==='gear'&&gearDef(q.item)){const d=a.r.drops[q.item.id]??={n:0,q:0};d.n++;d.q=Math.max(d.q,q.item.quality||0);recorded=true;}
   else if(q.kind==='stone'){a.r.stones+=q.value||0;recorded=true;}else if(q.kind==='pill'){a.r.pills+=q.value||0;recorded=true;}
  }if(recorded)a.r.dropKills++;save();}
 return result;
};
// start_L14: lớp 41_codex (trước đây lưu lớp dưới vào v42cxStartOld). Gọi lớp dưới: start_L13.
function start_L14(...args){const r=start_L13(...args);if(p){v42cxState();save();}return r;}
// resume_L16: lớp 41_codex (trước đây lưu lớp dưới vào v42cxResumeOld). Gọi lớp dưới: resume_L15.
function resume_L16(...args){const r=resume_L15(...args);if(p&&mode==='play'){v42cxState();save();}return r;}
function v42cxOpen(tab=0,region=null,type=null){if(!p||mode!=='play')return false;v42cxState();v8Cancel();V8.vx=V8.vy=0;mouse.left=mouse.fire=false;V33.menu=false;V42CODEX.filter=0;V42CODEX.page=0;V42CODEX.affix=null;V42CODEX.dropPage=0;V42CODEX.note='';if(region&&V22_REG[region])V42CODEX.region=region;if(type!=null&&TYPES[type]){V42CODEX.selected=type;V42CODEX.page=Math.max(0,Math.floor(v42cxTypeIds(tab).indexOf(type)/7));}modal={kind:'v42codex',tab:clamp(tab,0,2)};return true;}
function v42cxClose(){modal=null;V42CODEX.note='';}
// update_L28: lớp 41_codex (trước đây lưu lớp dưới vào v42cxUpdateOld). Gọi lớp dưới: update_L27.
function update_L28(dt){if(p&&mode==='play'&&pressed.F3){delete pressed.F3;if(modal?.kind==='v42codex')v42cxClose();else if(!modal)v42cxOpen();}if(modal?.kind==='v42codex'&&pressed.Escape){delete pressed.Escape;v42cxClose();}const r=update_L27(dt);v42cxScan(dt);return r;}
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('keydown',e=>{if(e.code==='F3'&&mode==='play'&&p&&e.target?.id!=='heroName')e.preventDefault();},{capture:true});
// Atlas + bestiary helpers.
function v42cxKnownSites(i){const r=v42cxEntry(i);return Object.entries(r?.sites||{}).map(([id,q])=>({id,q,label:id.startsWith('w:')?REG[id.slice(2)].name:id.startsWith('d:')?V28_ROUTE[id.slice(2)].name:'Bí cảnh'}));}
function v42cxCardArt(i,x,y,w,h,known=true){const t=TYPES[i],col=known?t.color:V42HUD.edge;
 v42HUDFrame(x,y,w,h,col,false);g.save();const gr=g.createRadialGradient(x+w/2,y+h*.55,2,x+w/2,y+h*.55,Math.max(w,h)*.62);gr.addColorStop(0,v42HUDAlpha(col,known?'5d':'28'));gr.addColorStop(1,'#111c1900');g.fillStyle=gr;g.fillRect(x+5,y+5,w-10,h-10);
 if(known){const a=imgs['v25mob'+i]?.img;if(a?.naturalWidth){const ratio=a.naturalWidth/a.naturalHeight,s=Math.min((w-8)/ratio,h-8),ww=ratio*s;g.drawImage(a,x+w/2-ww/2,y+h*.5-s*.5,ww,s);}}
 else{v42HUDTitle('?',x+w/2,y+h/2,Math.min(h*.68,70),V42HUD.muted,'center');}g.restore();}
function v42cxTypeIds(tab){return TYPES.map((_,i)=>i).filter(i=>!!bossType(i)===(tab===1));}
function v42cxLootIcon(d,x,y,size=48){return gearIcon(d,x,y,size);}
function v42cxFilterIds(tab){return v42cxTypeIds(tab).filter(i=>V42CODEX.filter===0||V42CODEX.filter===1&&v42cxEntry(i)||V42CODEX.filter===2&&!v42cxEntry(i));}
function v42cxGuide(q){if(!p.worldMode||v36Inside()||!q||!Number.isFinite(q.x)||!Number.isFinite(q.y))return false;if(owBlocked(q.x,q.y,14)){const a=Array.from({length:8},(_,i)=>({x:q.x+Math.cos(i*TAU/8)*40,y:q.y+Math.sin(i*TAU/8)*40})).find(t=>!owBlocked(t.x,t.y,14));if(!a){V42CODEX.note='Không có điểm tới an toàn. Hãy chọn vị trí khác.';return false;}q=a;}
 v8SetGoal(q);if(!V8.route.length){V42CODEX.note='Không tìm được đường. Thử đến một vị trí gần hơn.';return false;}modal=null;message('Đã lập lộ trình · có thể hủy bằng WASD');return true;}
function v42cxDetails(i){
 const x=444,y=163,w=802,h=483,r=v42cxEntry(i),t=TYPES[i];v42HUDFrame(x,y,w,h,r?t.color:V42HUD.edge);
 if(!r){v42cxCardArt(i,x+24,y+24,230,215,false);v42HUDTitle('Bút tích chưa được khai mở',x+281,y+75,26,V42HUD.muted);v12Wrap('Đi vào vùng có yêu thú và quan sát từ đủ gần. Đánh bại để ghi lại chiến lợi phẩm thực tế. Những mục chưa gặp sẽ không tiết lộ tên hay kỹ năng.',x+281,y+119,w-310,15,V42HUD.paper,24,5);return;}
 const variants=typeof V42ELITE_DEFS!=='undefined'?r.affinities.filter(k=>V42ELITE_DEFS[k]):[],aff=variants.includes(V42CODEX.affix)?V42ELITE_DEFS[V42CODEX.affix]:null;
 v42cxCardArt(i,x+17,y+15,193,154,true);v42HUDTitle(t.name,x+227,y+29,25,t.color);v42HUDTag(V42CX_ROLE[aff?.role||r.role]||'Đã gặp',x+227,y+51,200,V42HUD.jade);
 if(variants.length)v42HUDButton(x+445,y+49,337,27,(aff?'Tinh anh · '+aff.name:'Thường · '+variants.length+' dạng tinh anh')+'  ›',()=>{V42CODEX.affix=variants[variants.indexOf(V42CODEX.affix)+1]||null;},'cxAffinity',!!aff,true);
 const tags=[['ĐÃ HẠ',r.kills],['CẤP ĐÃ GẶP',r.lo?(r.lo===r.hi?String(r.hi):r.lo+'–'+r.hi):'—'],['HP CAO NHẤT',r.hp||'—'],['CÔNG CAO NHẤT',r.atk||'—']];
 tags.forEach(([n,v],j)=>{const xx=x+227+j*137;v42HUDFrame(xx,y+84,128,74);text(n,xx+64,y+102,10,V42HUD.muted,'center','bold');v42HUDTitle(typeof v==='number'?v10Fmt(v):v,xx+64,y+133,20,V42HUD.paper,'center');});
 const skills=(aff?aff.moves:r.pattern).filter(k=>V27_BOOK[k]);const element=[...new Set(skills.map(k=>V42CX_ELEMENT[k]||V42CX_ELEMENT[V27_BOOK[k].status]).filter(Boolean))];
 v42HUDSection('CHIÊU THỨC & CHIẾN THUẬT',x+20,y+191,445,element.length?'Dấu hiệu '+element.join(' · '):'');
 if(!skills.length)text('Chưa có ghi chép về chiêu thức.',x+20,y+226,13,V42HUD.muted);
 skills.slice(0,3).forEach((k,j)=>{const d=V27_BOOK[k],yy=y+214+j*43;v42HUDTag(V42CX_SHAPE[d.shape]||d.shape,x+20,yy,105,t.color);v33Fit(d.name+' · '+d.wind+'s',x+137,yy+7,310,13,V42HUD.paper,'left','bold');v33Fit(V42CX_TIP[d.shape]||'',x+137,yy+24,310,11,V42HUD.muted);});
 if(aff) {v33Fit(aff.hint,x+20,y+319,445,12,aff.color,'left','bold');}else if(r.eliteKills>0)text('Đã hạ '+v10Fmt(r.eliteKills)+' tinh anh',x+20,y+338,11,V42HUD.muted);
 v42HUDSection('ĐỊA VỰC ĐÃ GHI NHẬN',x+479,y+191,303,r.first?'Ngày '+r.first:'Bản cũ');
 const sites=v42cxKnownSites(i),worldSites=sites.filter(o=>o.id.startsWith('w:'));if(!sites.length)text('Chưa có tọa độ quan sát.',x+479,y+226,12,V42HUD.muted);
 sites.slice(0,3).forEach((a,j)=>{const yy=y+222+j*27;v33Fit(a.label,x+479,yy,287,13,V42HUD.paper);});
 if(worldSites.length){const a=worldSites.find(q=>q.id==='w:'+p.mapId)||worldSites[0];v42HUDButton(x+479,y+300,303,37,'Dẫn tới nơi ghi nhận',()=>v42cxGuide(a.q),'cxGuide',false,p.worldMode&&!v36Inside());}
 else if(t.boss)text('Boss bí cảnh / chưa định vị.',x+479,y+310,12,V42HUD.muted);
 v41HUDLine(x+18,y+348,w-36);text('CHIẾN LỢI PHẨM ĐÃ THẤY',x+20,y+364,12,V42HUD.bright,'left','bold');text(r.stones+' linh thạch · '+r.pills+' đan · '+r.dropKills+' lần ghi nhận',x+w-20,y+364,11,V42HUD.muted,'right');
 const drops=Object.entries(r.drops).sort((a,b)=>b[1].q-a[1].q||b[1].n-a[1].n),max=Math.max(1,Math.ceil(drops.length/5));V42CODEX.dropPage=clamp(V42CODEX.dropPage,0,max-1);
 if(!drops.length)text('Chưa quan sát được trang bị rơi. Chiến lợi phẩm thực tế thay đổi theo cấp và độ khó.',x+20,y+420,12,V42HUD.muted);
 drops.slice(V42CODEX.dropPage*5,V42CODEX.dropPage*5+5).forEach(([id,d],j)=>{const a=EQUIPMENT[id],xx=x+20+j*146,c=QUALITY_COL[d.q];v42HUDFrame(xx,y+381,138,87,c);v42cxLootIcon(a,xx+11,y+385,48);text('×'+d.n,xx+130,y+395,10,V42HUD.paper,'right','bold');v33Fit(a.name,xx+7,y+444,124,10,c,'left','bold');v33Fit(QUALITY[d.q],xx+7,y+460,124,10,V42HUD.muted);});
 if(max>1){v42HUDButton(x+w-45,y+389,28,27,'›',()=>V42CODEX.dropPage=(V42CODEX.dropPage+1)%max,'cxDropNext');text((V42CODEX.dropPage+1)+'/'+max,x+w-30,y+443,10,V42HUD.muted,'center');}
}
function v42cxBestiary(tab){
 const x=34,y=163,w=396,h=483,items=v42cxFilterIds(tab),all=v42cxTypeIds(tab),n=items.length,known=all.filter(v42cxEntry).length;
 v42HUDFrame(x,y,w,h);v42HUDSection('MỤC LỤC LINH THÚ',x+15,y+20,w-30,known+'/'+all.length+' mục');
 ['Tất cả','Đã biết','Chưa biết'].forEach((t,i)=>v42HUDButton(x+13+i*124,y+39,119,32,t,()=>{V42CODEX.filter=i;V42CODEX.page=0;},'cxFilter'+i,V42CODEX.filter===i));
 const max=Math.max(1,Math.ceil(n/7));V42CODEX.page=clamp(V42CODEX.page,0,max-1);const page=items.slice(V42CODEX.page*7,V42CODEX.page*7+7);if(!page.includes(V42CODEX.selected))V42CODEX.selected=page.find(v42cxEntry)??page[0]??null;
 page.forEach((id,j)=>{const r=v42cxEntry(id),t=TYPES[id],yy=y+83+j*50,sel=id===V42CODEX.selected;v42HUDFrame(x+13,yy,w-26,45,sel?V42HUD.bright:r?t.color:V42HUD.edge,sel);v42cxCardArt(id,x+18,yy+4,40,37,!!r);v33Fit(r?t.name:'Linh thú chưa biết · '+String(id+1).padStart(2,'0'),x+67,yy+13,w-85,12,r?t.color:V42HUD.muted,'left','bold');text(r?'Đã hạ '+r.kills+' lần'+(r.affinities.length?' · '+r.affinities.length+' dạng tinh anh':''):'Chưa ghi nhận',x+67,yy+32,10,V42HUD.muted);if(r?.kills)diamond(g,x+w-26,yy+22,4,V42HUD.bronze);buttons.push({x:x+13,y:yy,w:w-26,h:45,v33:'cxEnemy'+id,fn:()=>{V42CODEX.selected=id;V42CODEX.affix=null;V42CODEX.dropPage=0;}});});
 if(!n)v12Wrap('Chưa có mục phù hợp. Thay đổi bộ lọc hoặc tiếp tục khám phá.',x+24,y+119,w-48,14,V42HUD.muted,22,3);
 v42HUDButton(x+14,y+442,88,28,'‹',()=>V42CODEX.page--,'cxPrev',false,V42CODEX.page>0);text('Trang '+(V42CODEX.page+1)+' / '+max,x+w/2,y+456,11,V42HUD.muted,'center');v42HUDButton(x+w-102,y+442,88,28,'›',()=>V42CODEX.page++,'cxNext',false,V42CODEX.page<max-1);
 if(V42CODEX.selected!=null)v42cxDetails(V42CODEX.selected);else{v42HUDFrame(444,163,802,483);v42HUDTitle('Hãy chọn một mục để khám phá',845,375,26,V42HUD.muted,'center');}
}
function v42cxMapArt(x,y,w,h){
 const seen=p.explored||{},key=[seed,w,h,Object.keys(seen).sort().join('|')].join(':');if(V42CODEX.mapKey!==key){const c=document.createElement('canvas');c.width=w;c.height=h;const d=c.getContext('2d'),sx=w/OW.w,sy=h/OW.h,cs=OW.chunk;
  // Relief from the current world height function, with softly feathered
  // edges that never reveal terrain in chunks the player has not explored.
  const img=d.createImageData(w,h),cols=w,rows=h;
  for(let yy=0;yy<rows;yy+=2)for(let xx=0;xx<cols;xx+=2){const wx=(xx+.5)/sx,wy=(yy+.5)/sy,cx=Math.floor(wx/cs),cy=Math.floor(wy/cs),tx=wx-cx*cs,ty=wy-cy*cs,has=!!seen[cx+':'+cy];let rgb=[28,44,38];const grain=hashOW(xx>>1,yy>>1,307)-.5,stipple=2.5*Math.sin(xx*.17+Math.cos(yy*.12)*2)+2*Math.cos(yy*.15+Math.sin(xx*.13));
   if(has){let f=1;for(const [dx,dy,dist] of [[-1,0,tx],[1,0,cs-tx],[0,-1,ty],[0,1,cs-ty]])if(!seen[(cx+dx)+':'+(cy+dy)])f=Math.min(f,clamp(dist/110,0,1));f=f*f*(3-2*f);const r=regionAt(wx,wy),base=parseInt(r.base.slice(1),16),z=hdHeight(wx,wy),slope=hdHeight(wx+35,wy+35)-z,contour=Math.abs(z/17-Math.round(z/17))<.052?8:0,shade=clamp(slope*.7,-22,22)-contour;rgb=[16,8,0].map((k,i)=>rgb[i]*(1-f*.83)+f*.83*(base>>k&255)+shade*f);}
   for(let oy=0;oy<2&&yy+oy<rows;oy++)for(let ox=0;ox<2&&xx+ox<cols;ox++){const i=((yy+oy)*cols+xx+ox)*4;for(let k=0;k<3;k++)img.data[i+k]=clamp(rgb[k]+grain*6+stipple,0,255);img.data[i+3]=255;}
  }d.putImageData(img,0,0);
  d.strokeStyle='#6d99a488';d.lineWidth=3;d.beginPath();for(let xx=0;xx<=OW.w;xx+=80){const yy=riverAt(xx)*sy;xx?d.lineTo(xx*sx,yy):d.moveTo(xx*sx,yy);}d.stroke();d.strokeStyle='#d4b78388';d.lineWidth=1.2;d.setLineDash([4,4]);for(const [i,j] of ROAD_EDGES){const a=REGIONS[i],b=REGIONS[j];d.beginPath();d.moveTo(a.x*sx,a.y*sy);d.lineTo(b.x*sx,b.y*sy);d.stroke();}d.setLineDash([]);
  const fade=d.createRadialGradient(w/2,h/2,h*.2,w/2,h/2,w*.58);fade.addColorStop(0,'#07130e00');fade.addColorStop(1,'#07130e9a');d.fillStyle=fade;d.fillRect(0,0,w,h);
  d.strokeStyle='#b9ad7755';d.strokeRect(.5,.5,w-1,h-1);V42CODEX.map=c;V42CODEX.mapKey=key;}
 g.drawImage(V42CODEX.map,x,y,w,h);const sx=w/OW.w,sy=h/OW.h;
 // Compact directional seal and distance ruler use actual atlas scaling.
 g.save();g.strokeStyle='#ddc88d88';g.fillStyle='#ddc88dbe';g.lineWidth=1;g.beginPath();g.arc(x+w-23,y+23,15,0,TAU);g.stroke();g.beginPath();g.moveTo(x+w-23,y+8);g.lineTo(x+w-28,y+27);g.lineTo(x+w-23,y+24);g.lineTo(x+w-18,y+27);g.closePath();g.fill();text('B',x+w-23,y+42,10,V42HUD.muted,'center','bold');g.beginPath();g.moveTo(x+15,y+h-18);g.lineTo(x+15+1000*sx,y+h-18);g.moveTo(x+15,y+h-22);g.lineTo(x+15,y+h-14);g.moveTo(x+15+1000*sx,y+h-22);g.lineTo(x+15+1000*sx,y+h-14);g.stroke();text('1000 bước',x+15,y+h-30,10,V42HUD.muted);g.restore();
 for(const id of V22_ORDER){const r=REG[id],v=V22_REG[id],xx=x+r.x*sx,yy=y+r.y*sy,seen=p.discovered?.includes(id),sel=id===V42CODEX.region;circle(xx,yy,sel?16:12,seen?'#23362d':'#1b2a26',sel?V42HUD.bright:seen?v.color:'#68746a');text(seen?String(v.i):'?',xx,yy,12,seen?V42HUD.paper:V42HUD.muted,'center','bold');if(seen)v33Fit(r.name,xx,yy-24,128,11,sel?V42HUD.bright:V42HUD.paper,'center','bold');buttons.push({x:xx-33,y:yy-36,w:66,h:66,fn:()=>{V42CODEX.region=id;V42CODEX.poi=null;},v33:'cxMap'+id});}
 const q=p.worldMode?(v36Inside()?REG[p.mapId]:p):p.v28?.run?.return;if(q&&Number.isFinite(q.x)&&Number.isFinite(q.y)){circle(x+q.x*sx,y+q.y*sy,4,'#fff2bf','#223b32');}
}
function v42cxAtlas(){
 const x=34,y=163,w=714,h=483,id=V42CODEX.region,r=REG[id]||REG.thon,d=V22_REG[r.id],seen=p.discovered?.includes(r.id),rx=762,rw=484;
 v42HUDFrame(x,y,w,h);v42HUDSection('CỬU VỰC · ĐỊA ĐỒ',x+15,y+20,w-30,(p.discovered?.length||0)+'/10 đã biết');
 v42cxMapArt(x+15,y+41,w-30,332);text('◆ Điểm hiện tại   ·   ? Chưa khám phá   ·   Click vào vòng vùng để chọn',x+15,y+393,11,V42HUD.muted);
 V22_ORDER.forEach((id,i)=>{const a=V22_REG[id],know=p.discovered?.includes(id),xx=x+15+(i%5)*137,yy=y+407+Math.floor(i/5)*32;v42HUDButton(xx,yy,130,27,know?V42CX_SHORT[id]:'Vực '+i+' · ?',()=>{V42CODEX.region=id;V42CODEX.poi=null;},'cxAtlas'+id,V42CODEX.region===id,true);});
 v42HUDFrame(rx,y,rw,h,seen?d.color:V42HUD.edge);
 v42HUDTitle(seen?r.name:'Địa vực chưa khám phá',rx+20,y+31,24,seen?d.color:V42HUD.muted);
 if(!seen){text('Cần tự đi đến khu vực để mở ghi chép.',rx+20,y+70,13,V42HUD.muted);return;}
 const [danger,col]=v22Danger(d);text('Cấp '+d.min+'–'+d.max+' · '+danger,rx+20,y+67,13,col,'left','bold');v12Wrap(d.desc,rx+20,y+94,rw-40,13,V42HUD.paper,20,2);
 text('Linh vật · '+d.resource,rx+20,y+136,12,V42HUD.jade,'left','bold');
 const ids=[...new Set([...r.pool,...(d.bossType!=null?[d.bossType]:[])])].filter(i=>TYPES[i]),known=ids.filter(i=>v42cxEntry(i));v42HUDSection('YÊU VẬT BẢN ĐỊA',rx+20,y+162,rw-40,known.length+'/'+ids.length+' ghi nhận');
 if(!ids.length)text('Khu vực an toàn, không có yêu thú tự nhiên.',rx+20,y+193,12,V42HUD.muted);
 ids.slice(0,4).forEach((i,j)=>{const a=v42cxEntry(i),xx=rx+20+j*111;v42cxCardArt(i,xx,y+177,104,60,!!a);v33Fit(a?TYPES[i].name:'Chưa biết',xx+52,y+249,100,10,a?TYPES[i].color:V42HUD.muted,'center','bold');if(a)buttons.push({x:xx,y:y+177,w:104,h:82,v33:'cxAtlasEnemy'+i,fn:()=>v42cxOpen(bossType(i)?1:0,null,i)});});
 const pois=OW_POI.filter(o=>o.region===id&&p.explored?.[Math.floor(o.x/OW.chunk)+':'+Math.floor(o.y/OW.chunk)]&&!o.kind?.startsWith('v42event')&&!o.kind?.startsWith('v13node')).slice(0,4);
 v42HUDSection('ĐỊA ĐIỂM ĐÃ KHÁM PHÁ',rx+20,y+278,rw-40,pois.length+' điểm');
 if(!pois.length)text('Chưa ghi nhận điểm tương tác ở vùng này.',rx+20,y+310,12,V42HUD.muted);
 if(!pois.some(o=>o.id===V42CODEX.poi))V42CODEX.poi=pois[0]?.id||null;
 pois.forEach((o,j)=>{const yy=y+292+j*30;v42HUDButton(rx+20,yy,rw-40,27,o.name,()=>{V42CODEX.poi=o.id;},'cxPOI'+j,V42CODEX.poi===o.id);});
 const q=pois.find(o=>o.id===V42CODEX.poi)||(typeof v42wWaystone==='function'?v42wWaystone(id):null)||r;
 text('Tọa độ X '+Math.round(q.x)+' · Y '+Math.round(q.y)+'  |  '+(p.worldMode?Math.round(dist(p,q))+' bước':'Đang ở bí cảnh'),rx+20,y+428,11,V42HUD.muted);
 v42HUDButton(rx+20,y+441,rw-40,29,'Dẫn đường tới '+(pois.length?'địa điểm':'khu vực'),()=>v42cxGuide(q),'cxAtlasGuide',true,p.worldMode&&!v36Inside());
}
function v42cxPanel(){
 const s=v42cxState(),known=Object.keys(s.entries).length;v42HUDShell('VẠN LINH PHỔ · CỬU VỰC','Ghi chép yêu thú · Chiến lợi phẩm đã gặp · Địa đồ khảo sát '+known+'/'+TYPES.length);
 ['Yêu thú','Thủ hộ & Boss','Địa đồ Cửu Vực'].forEach((t,i)=>v42HUDButton(34+i*406,111,396,43,t,()=>{modal.tab=i;V42CODEX.filter=0;V42CODEX.page=0;V42CODEX.dropPage=0;V42CODEX.note='';},'cxTab'+i,modal.tab===i));
 if(modal.tab===2)v42cxAtlas();else v42cxBestiary(modal.tab);
 if(V42CODEX.note)text(V42CODEX.note,36,671,12,V42HUD.red);else text('F3 · Mở/đóng   |   Ghi nhận khi tiếp xúc thực tế; luyện tập và quái triệu hồi không tính.',36,671,11,V42HUD.muted);
 v42HUDButton(1014,655,232,31,'Sơn Hà Ký · O',()=>{if(typeof v42OpenWorld==='function')v42OpenWorld(0,V42CODEX.region);},'cxWorld',false,p.worldMode&&typeof v42OpenWorld==='function');
}

if(typeof v42wPanel==='function'){const v42cxWorldPanel=v42wPanel;v42wPanel=function(){v42cxWorldPanel();v42HUDButton(678,48,220,36,'Vạn Linh Phổ · F3',()=>v42cxOpen(0,V42_WORLD.focus),'cxWorldLink',false,true);};}


