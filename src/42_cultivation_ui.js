'use strict';
// v42_cultivation_ui.js
// V42 · Thiên Công Phường. Exact resource planning and real stat previews.
// The workbench never simulates RNG, charges funds, or changes equipment until
// an existing V30 action is explicitly requested. Preview clones are restored.
const V42FORGE={owner:null,filter:0,sort:0,gemAction:0,recipe:0,relicSlot:0,cache:null};
const V42F_ASC=['Phàm khí','Thông Linh','Hóa Thần','Chí Tôn'];
const V42F_STATS=[['attack','Công'],['def','Thủ'],['hp','Sinh lực'],['mp','Linh lực'],['crit','Chí mạng'],['rate','Tốc đánh'],['regen','Hồi phục'],['luck','Phúc duyên'],['leech','Hút máu'],['burn','Thiêu đốt'],['slow','Làm chậm']];
function v42fReset(){if(V42FORGE.owner!==p){Object.assign(V42FORGE,{owner:p,filter:0,sort:0,gemAction:0,recipe:0,relicSlot:0,cache:null});}}
function v42fClip(t,x,y,w,col=V42HUD.paper,size=12){v33Fit(t,x,y,w,size,col,'left','bold');}
function v42fValue(k,n,plus=false){return Number.isFinite(n)?v21Fmt(k,n,plus):'—';}
function v42fSelect(a){V30.item=a.uid;V30.affix=0;V30.socket=0;V42FORGE.cache=null;}
function v42fIcon(d,x,y,size){return gearIcon(d,x,y,size);}
function v42fItemReady(it){return v30ForgeAllowed()&&p.gear.includes(it)&&!!gearDef(it);}
const v42fOpenOld=v30ForgeOpen;
v30ForgeOpen=function(uid=null){const r=v42fOpenOld(uid);if(r){v42fReset();V42FORGE.filter=0;V42FORGE.gemAction=0;V42FORGE.cache=null;V30.note='';const i=v42fItems().findIndex(a=>a.uid===V30.item);V30.page=Math.max(0,Math.floor(i/6));}return r;};
function v42fItems(){let arr=p.gear.filter(a=>gearDef(a)&&(V42FORGE.filter===0||V42FORGE.filter===1&&v42HUDWorn(a)||V42FORGE.filter===2&&a.v30?.offer));if(V42FORGE.sort)arr=arr.slice().sort((a,b)=>b.quality-a.quality||b.up-a.up||String(a.uid).localeCompare(String(b.uid)));return arr;}
function v42fSymbol(key,x,y,size,col){if(key&&typeof v42MaterialIcon==='function')v42MaterialIcon(key,x-size/2,y-size/2,size);else diamond(g,x,y,size*.24,col);}
function v42fCostRows(c={},extras=[]){return [...(c.stones?[{key:'stone',name:'Linh thạch',have:p.stones,need:c.stones,col:V42HUD.bright}]:[]),...Object.entries(c.mat||{}).filter(([,n])=>n).map(([k,n])=>({key:k,name:V13_ITEMS[k]?.[0]||k,have:v13Inventory(k),need:n,col:V13_ITEMS[k]?.[1]||V42HUD.paper})),...(c.ess?[{name:'Tinh phách Boss',have:v30State().ess,need:c.ess,col:'#dfb8fa'}]:[]),...extras];}
function v42fCosts(c,x,y,w,extras=[],title='NGUYÊN LIỆU CẦN'){const rows=v42fCostRows(c,extras);v42HUDSection(title,x,y,w,rows.length?rows.filter(r=>r.have>=r.need).length+'/'+rows.length+' đủ':'');
 if(!rows.length){text('Không tiêu tốn nguyên liệu.',x,y+39,13,V42HUD.jade);return;}
 text('Đang có / cần',x+w-2,y+29,10,V42HUD.muted,'right');rows.forEach((r,i)=>{const yy=y+48+i*33,col=r.have>=r.need?V42HUD.jade:V42HUD.red;v42fSymbol(r.key,x+10,yy,20,r.col);v42fClip(r.name,x+25,yy,w*.57, V42HUD.paper,12);v33Fit(v10Fmt(r.have)+' / '+v10Fmt(r.need),x+w,yy,w*.36,14,col,'right','bold');text(r.have>=r.need?'Còn '+v10Fmt(r.have-r.need):'Thiếu '+v10Fmt(r.need-r.have),x+w,yy+14,10,col,'right');v41HUDLine(x,yy+17,w,'#b7a27244');});
}
function v42fPreview(it,mutator=null,key='base'){
 if(!it||!gearDef(it)||!p.gear.includes(it))return null;const idx=p.gear.indexOf(it),slot=gearDef(it).slot,worn=p.worn,gear=p.gear;
 // A candidate not yet worn is tested in its real equipment slot. Neither
 // this nor the upgrade affects current HP/MP, inventory IDs, or persistence.
 const sig=key+'|'+it.uid+'|'+JSON.stringify(gear)+'|'+JSON.stringify(worn)+'|'+p.level+'|'+p.cls+'|'+JSON.stringify(p.relics)+'|'+JSON.stringify(p.v10Attrs||{});
 V42FORGE.cache??=new Map();if(V42FORGE.cache.has(sig))return V42FORGE.cache.get(sig);
 const active=currentStats(),copy=JSON.parse(JSON.stringify(it));let before,after;
 try{p.worn={...worn,[slot]:idx};before=currentStats();if(mutator)mutator(copy);gear[idx]=copy;after=currentStats();}finally{gear[idx]=it;p.worn=worn;}
 const value={active,before,after,worn:v42HUDWorn(it)};V42FORGE.cache.set(sig,value);if(V42FORGE.cache.size>8)V42FORGE.cache.delete(V42FORGE.cache.keys().next().value);return value;
}
function v42fRelicPreview(r,slot=0){const original=p.relics,idx=original.indexOf(r.id),arr=original.slice(),old=currentStats();if(idx<0){if(arr.length<4)arr.push(r.id);else{arr.push(r.id);[arr[slot],arr[arr.length-1]]=[arr[arr.length-1],arr[slot]];}}else if(idx>=4){[arr[slot],arr[idx]]=[arr[idx],arr[slot]];}
 let after;try{p.relics=arr;after=currentStats();}finally{p.relics=original;}return {before:old,after};}
function v42fDeltas(a,baseline='before'){if(!a)return [];return [...V42F_STATS.map(([k,label])=>({k,label,before:a[baseline][k]||0,after:a.after[k]||0})),{k:'power',label:'Chiến lực',before:v10FightPower(a[baseline]),after:v10FightPower(a.after)}].map(d=>({...d,delta:d.after-d.before})).filter(d=>Math.abs(d.delta)>.001);}
function v42fCompare(a,x,y,w,title='TÁC ĐỘNG LÊN TU SĨ',baseline='before',n=4){const d=v42fDeltas(a,baseline);v42HUDSection(title,x,y,w,a?.worn===false?'Giả sử trang bị':'');
 if(!d.length){text('Không đổi chỉ số đang xét.',x,y+39,12,V42HUD.muted);return;}
 let relevant=d.filter(o=>o.k!=='power');if(d.some(o=>o.k==='power'))relevant=[...relevant.slice(0,n-1),d.find(o=>o.k==='power')];else relevant=relevant.slice(0,n);
 const ww=(w-8*(n-1))/n;relevant.forEach((r,j)=>{const xx=x+j*(ww+8),yy=y+23,c=r.delta>0?V42HUD.jade:V42HUD.red;v42HUDFrame(xx,yy,ww,69,c);text(r.label.toUpperCase(),xx+ww/2,yy+12,10,V42HUD.muted,'center','bold');v33Fit(v42fValue(r.k,r.delta,true),xx+ww/2,yy+33,ww-10,17,c,'center','bold');v33Fit(v42fValue(r.k,r.before)+' → '+v42fValue(r.k,r.after),xx+ww/2,yy+54,ww-10,10,V42HUD.paper,'center');});
}
function v42fWallet(){const s=v30State(),data=[['stone','Linh thạch',p.stones,V42HUD.bright],['ore','Huyền thiết',v13Inventory('ore'),V13_ITEMS.ore[1]],['crystal','Linh tinh',v13Inventory('crystal'),V13_ITEMS.crystal[1]],[null,'Tinh phách',s.ess,'#dfb8fa'],['herb','Linh thảo',v13Inventory('herb'),V13_ITEMS.herb[1]],['wood','Linh mộc',v13Inventory('wood'),V13_ITEMS.wood[1]]];
 data.forEach(([key,name,n,col],i)=>{const x=34+i*203;v42HUDFrame(x,111,196,48,col);v42fSymbol(key,x+21,135,28,col);text(name,x+40,127,11,V42HUD.muted);v42HUDTitle(v10Fmt(n),x+182,136,19,col,'right');});
}
function v42fNav(){v42HUDShell('THIÊN CÔNG PHƯỜNG','Lò luyện khí · Nguồn nguyên liệu · Chỉ số dự kiến · Thanh Thạch Thôn');v42HUDButton(966,49,216,31,'Hành trang · I',()=>{v21Selected=V30.item;modal={kind:'gear'};},'forgeBag');v42fWallet();['Cường hóa','Tinh luyện','Khảm linh thạch','Tiến hóa / Thức tỉnh','Pháp bảo'].forEach((t,i)=>v42HUDButton(34+i*244,171,236,36,t,()=>{V30.tab=i;V30.note='';V42FORGE.cache=null;},'forgeTab'+i,V30.tab===i));}
function v42fList(){const x=34,y=218,w=334,h=429,items=v42fItems(),max=Math.max(1,Math.ceil(items.length/6));V30.page=clamp(V30.page,0,max-1);const page=items.slice(V30.page*6,V30.page*6+6);
 if(!items.some(a=>a.uid===V30.item))V30.item=page[0]?.uid??null;
 v42HUDFrame(x,y,w,h);v42HUDSection('CHỌN TRANG BỊ',x+12,y+18,w-24,items.length+'/'+p.gear.length);
 ['Tất cả','Đang mặc','Có đề nghị'].forEach((t,i)=>v42HUDButton(x+12+i*104,y+35,100,29,t,()=>{V42FORGE.filter=i;V30.page=0;},'forgeFilter'+i,V42FORGE.filter===i));
 v42HUDButton(x+12,y+70,w-24,22,V42FORGE.sort?'Độ hiếm cao trước ⇅':'Thứ tự túi đồ ⇅',()=>{V42FORGE.sort=1-V42FORGE.sort;V30.page=0;},'forgeSort',false,true);
 if(!page.length)text('Không có vật phẩm phù hợp.',x+w/2,y+140,13,V42HUD.muted,'center');
 page.forEach((a,i)=>{const d=gearDef(a),yy=y+100+i*47,col=QUALITY_COL[a.quality],sel=V30.item===a.uid;v42HUDFrame(x+12,yy,w-24,43,sel?V42HUD.bright:col,sel);v42fIcon(d,x+18,yy+1,42);v42fClip(d.name+(a.up?' +'+a.up:''),x+68,yy+12,w-96,col,13);v33Fit((v42HUDWorn(a)?'Đang mặc · ':'')+QUALITY[a.quality]+' · Khảm '+a.v30.sockets.filter(Boolean).length,x+68,yy+30,w-96,10,V42HUD.muted);if(a.v30.offer)diamond(g,x+w-25,yy+22,4,V42HUD.bright);buttons.push({x:x+12,y:yy,w:w-24,h:43,fn:()=>v42fSelect(a),v33:'forgeItem'+i});});
 v42HUDButton(x+12,y+385,80,29,'‹',()=>{V30.page--;},'forgePrev',false,V30.page>0);text((V30.page+1)+' / '+max,x+w/2,y+400,11,V42HUD.muted,'center');v42HUDButton(x+w-92,y+385,80,29,'›',()=>{V30.page++;},'forgeNext',false,V30.page<max-1);
}
function v42fItemHeader(it){const d=gearDef(it),x=380,y=218,w=866,col=QUALITY_COL[it.quality];v42HUDFrame(x,y,w,429,col);v42HUDFrame(x+10,y+11,91,83,col);v42fIcon(d,x+18,y+18,76);v42fClip(d.name+(it.up?' +'+it.up:''),x+116,y+29,450,col,22);text(QUALITY[it.quality]+' · '+V21_SLOTS[d.slot]+' · '+V42F_ASC[it.v30.asc||0],x+116,y+56,12,V42HUD.muted);
 text('Tinh luyện '+it.v30.ref+' · Khảm '+it.v30.sockets.filter(Boolean).length+'/'+v30SocketMax(it),x+116,y+77,11,V42HUD.muted);
 if(it.v30.offer)v42HUDTag('ĐỀ NGHỊ TINH LUYỆN ĐANG CHỜ',x+575,y+15,268,V42HUD.bright);else v42HUDTag(v42HUDWorn(it)?'ĐANG MẶC':'CHƯA TRANG BỊ',x+675,y+15,168,v42HUDWorn(it)?V42HUD.jade:V42HUD.muted);
 if(!v42HUDWorn(it)){const a=v42fPreview(it),delta=a?Math.round(v10FightPower(a.before)-v10FightPower(a.active)):0;text('Nếu mặc: chiến lực '+(delta>0?'+':'')+v10Fmt(delta),x+w-22,y+57,13,delta>0?V42HUD.jade:delta<0?V42HUD.red:V42HUD.muted,'right','bold');const old=p.gear[p.worn[d.slot]];if(old)v33Fit('Thay '+gearDef(old).name+' +'+old.up,x+w-22,y+77,250,11,V42HUD.muted,'right');}else text('Kết quả áp dụng ngay cho chỉ số hiện tại',x+w-22,y+59,11,V42HUD.jade,'right');
 v41HUDLine(x+14,y+101,w-28,'#b7a27277');
}
function v42fAction(label,fn,id,ok,sub=''){v42HUDButton(898,587,326,42,label,()=>{if(v30ForgeAllowed()){fn();V42FORGE.cache=null;}},id,true,ok&&v30ForgeAllowed(),sub);}
function v42fEnhance(it){const n=it.up,ch=v30UpgradeChance(it),c=v30UpgradeCost(it),max=n>=20,ok=!max&&v30Can(c)&&v42fItemReady(it);
 v42HUDSection('HÀNH TRÌNH CƯỜNG HÓA',402,337,474,'+'+n+' / +20');for(let j=1;j<=20;j++){const x=402+(j-1)%10*47.4,y=360+Math.floor((j-1)/10)*31,done=j<=n,now=j===n+1;v42HUDFrame(x,y,43,27,done?V42HUD.jade:now?V42HUD.bright:V42HUD.edge,now||done);text('+'+j,x+21,y+13,11,done?V42HUD.jade:now?V42HUD.bright:V42HUD.muted,'center','bold');}
 const a=v42fPreview(it,b=>{if(!max)b.up++;},'up');v42fCompare(a,402,437,474,max?'ĐÃ HOÀN THÀNH':'CHỈ SỐ NẾU CƯỜNG HÓA THÀNH CÔNG');
 v12Wrap(max?'Trang bị đã đạt giới hạn +20.':'Mỗi cấp tăng 12% hệ số chỉ số cơ bản; khi thất bại không tụt cấp, tăng 12 điểm % cơ hội lần sau.',402,553,474,12,V42HUD.muted,18,3);
 v42HUDFrame(898,326,326,62,V42HUD.bronze,true);text('XÁC SUẤT THÀNH CÔNG',912,344,10,V42HUD.muted,'left','bold');v42HUDTitle(max?'Tối đa':Math.round(ch*100)+'%',1209,356,24,V42HUD.bright,'right');text('Bảo hiểm +'+(it.v30.pity||0)*12+' điểm %',912,374,11,V42HUD.jade);
 if(!max)v42fCosts(c,898,409,326);else text('Không cần cường hóa thêm.',898,434,13,V42HUD.jade);
 v42fAction(max?'ĐÃ TỐI ĐA':'Cường hóa +'+(n+1),()=>upgradeGear(p.gear.indexOf(it)),'forgeUpgrade',ok,max?'':ok?'Thanh toán khi thực hiện':'Thiếu nguyên liệu');
}
function v42fRefine(it){const list=v30Refinable(it),offer=it.v30.offer,possible=list.length||it.affixes.length<5,canAdd=!list.length&&it.affixes.length<5;if(!list.some(a=>a.i===V30.affix))V30.affix=list[0]?.i??it.affixes.length;const rows=it.affixes.map((a,i)=>({a,i,ok:list.some(d=>d.i===i)}));if(canAdd)rows.push({a:null,i:it.affixes.length,ok:true});
 v42HUDSection('DÒNG THUỘC TÍNH',402,337,474,it.affixes.length+'/5');rows.slice(0,5).forEach(({a,i,ok},j)=>{const yy=359+j*37,sel=i===(offer?.idx??V30.affix);v42HUDButton(402,yy,474,33,(a?v30Aff(a):'Tạo dòng thuộc tính mới')+(ok?'':' · Cố định Boss'),()=>{V30.affix=i;},'forgeAffix'+i,sel,ok&&!offer);});
 v12Wrap('Thuộc tính cố định Boss không bị thay đổi. Tinh luyện tốn nguyên liệu khi tạo đề nghị; có thể giữ dòng cũ nhưng không hoàn phí.',402,562,474,12,V42HUD.muted,18,3);
 v42HUDSection('ĐỀ NGHỊ THUỘC TÍNH',898,337,326,offer?'Đã thanh toán':'Chưa rút');const old=it.affixes[offer?.idx??V30.affix];v42HUDFrame(898,360,326,44,V42HUD.edge);text('CŨ',910,371,10,V42HUD.muted);v42fClip(v30Aff(old),910,390,300,V42HUD.paper,14);v42HUDFrame(898,411,326,44,offer?V42HUD.jade:V42HUD.edge,!!offer);text('MỚI',910,422,10,V42HUD.muted);v42fClip(offer?v30Aff(offer.affix):'Chưa có đề nghị',910,441,300,offer?V42HUD.jade:V42HUD.muted,14);
 if(offer){const a=v42fPreview(it,b=>{b.affixes[offer.idx]={...offer.affix};},'ref');v42fCompare(a,898,474,326,'NẾU NHẬN DÒNG MỚI','before',3);v42HUDButton(898,587,157,42,'Giữ dòng cũ',()=>{if(v42fItemReady(it))v30AcceptRef(it,false);},'forgeReject',false,v42fItemReady(it));v42HUDButton(1063,587,161,42,'Nhận dòng mới',()=>{if(v42fItemReady(it))v30AcceptRef(it,true);},'forgeAccept',true,v42fItemReady(it));}
 else{const c=v30RefCost(it);v42fCosts(c,898,474,326);v42fAction(possible?'Tinh luyện':'Đã đủ thuộc tính',()=>v30RollRef(it,V30.affix),'forgeRoll',!!possible&&v30Can(c)&&v42fItemReady(it),'Tạo đề nghị ngẫu nhiên');}
}
function v42fGems(it){const s=v30State(),sockets=it.v30.sockets,max=v30SocketMax(it);V30.socket=clamp(V30.socket,0,Math.max(0,sockets.length-1));const k=V30.gem||'ruby',gem=V30_GEMS[k];
 v42HUDSection('LỖ KHẢM',402,337,474,sockets.length+'/'+max+' mở');for(let i=0;i<3;i++){const key=sockets[i],a=V30_GEMS[key],opened=i<sockets.length,x=402+i*159;v42HUDFrame(x,359,155,62,a?a.col:opened?V42HUD.bronze:V42HUD.edge,V30.socket===i&&opened);text(a?'◆':opened?'◇':i<max?'○':'×',x+20,381,19,a?a.col:V42HUD.muted,'center','bold');v33Fit(a?a.name:opened?'Lỗ trống':i<max?'Chưa mở':'Giới hạn phẩm',x+35,380,114,12,a?a.col:V42HUD.paper,'left','bold');text('Lỗ '+(i+1),x+35,403,11,V42HUD.muted);if(opened)buttons.push({x,y:359,w:155,h:62,fn:()=>{V30.socket=i;},v33:'forgeSocket'+i});}
 v42HUDSection('CHỌN LINH THẠCH',402,437,474,'Tổng '+Object.values(s.gems).reduce((a,b)=>a+b,0));Object.entries(V30_GEMS).forEach(([key,a],i)=>{const y=457+i*34;v42HUDFrame(402,y,474,30,a.col,key===k);diamond(g,416,y+15,5,a.col);v42fClip(a.name,432,y+15,181,a.col,12);v42fClip(V21_AFFIX[a.key][0]+' '+v21Fmt(a.key,a.value,true),610,y+15,170,V42HUD.paper,11);text('×'+(s.gems[key]||0),866,y+15,12,V42HUD.muted,'right','bold');buttons.push({x:402,y,w:474,h:30,fn:()=>{V30.gem=key;},v33:'forgeGem'+key});});
 const mode=V42FORGE.gemAction,chosen=sockets[V30.socket],canSelect=V30.socket<sockets.length;['Mở lỗ','Luyện đá','Khảm','Tháo'].forEach((t,i)=>v42HUDButton(898+i*83,326,78,33,t,()=>{V42FORGE.gemAction=i;},'forgeGemMode'+i,mode===i));
 let c={},extra=[],ok=false,name='',note='',fn=()=>{},a=null;
 if(mode===0){c=v30SocketCost(it);ok=sockets.length<max&&v30Can(c);name='Mở lỗ khảm';note=sockets.length>=max?'Đã đạt số lỗ tối đa theo phẩm.':'Mở lỗ trống để có thể gắn linh thạch.';fn=()=>v30OpenSocket(it);}
 if(mode===1){c=v30GemCost();ok=v30Can(c);name='Luyện '+gem.name;note='Tạo 1 viên trong kho linh thạch; chưa cộng chỉ số.';fn=()=>v30CraftGem(k);}
 if(mode===2){extra=[{name:gem.name,have:s.gems[k]||0,need:1,col:gem.col}];ok=canSelect&&!chosen&&!!s.gems[k];name='Khảm lỗ '+(V30.socket+1);note=!canSelect?'Hãy mở một lỗ trước.':chosen?'Lỗ đang có đá. Hãy tháo trước khi khảm.':'Gắn đá vào lỗ đã chọn.';fn=()=>v30Insert(it,V30.socket,k);if(canSelect&&!chosen)a=v42fPreview(it,b=>b.v30.sockets[V30.socket]=k,'gem'+k+':'+V30.socket);}
 if(mode===3){c={stones:6};ok=!!chosen&&v30Can(c);name='Tháo & thu hồi';note=chosen?'Thu hồi nguyên vẹn 1 '+V30_GEMS[chosen].name+'.':'Không có viên đá nào trong lỗ đã chọn.';fn=()=>v30Remove(it,V30.socket);if(chosen)a=v42fPreview(it,b=>b.v30.sockets[V30.socket]=null,'remove'+V30.socket);}
 v42fCosts(c,898,378,326,extra);v12Wrap(note,898,522,326,11,ok?V42HUD.paper:V42HUD.muted,15,2);if(a){const d=v42fDeltas(a);v33Fit(d.map(z=>z.label+' '+v42fValue(z.k,z.delta,true)).join(' · '),898,562,326,12,mode===3?V42HUD.red:V42HUD.jade,'left','bold');}
 v42fAction(name,fn,'forgeGemCommit',ok&&v42fItemReady(it));
}
function v42fAsc(it){const n=it.v30.asc||0,req=Math.min(18,12+n*3),c=v30AscCost(it),max=n>=3,sockets=it.v30.sockets.filter(Boolean).length,ok=v30AscReady(it)&&v30Can(c)&&v42fItemReady(it);v42HUDSection('THẦN KHÍ THỨC TỈNH',402,337,474,V42F_ASC[n]);
 for(let i=1;i<=3;i++){const x=402+(i-1)*159,col=i<=n?V42HUD.jade:i===n+1?V42HUD.bright:'#9d8cc7';v42HUDFrame(x,359,155,59,col,i<=n+1);text(V42F_ASC[i].toUpperCase(),x+78,374,12,col,'center','bold');text('+'+(i*15)+'% chỉ số gốc',x+78,392,11,V42HUD.paper,'center');text('+'+(i*2)+'% chí mạng',x+78,407,10,V42HUD.muted,'center');}
 const reqs=[['Thần phẩm / Hỗn Độn',it.quality>=6,QUALITY[it.quality]],['Cường hóa +'+Math.min(req,18),it.up>=req,'+'+it.up],['Khảm 2 viên',sockets>=2,sockets+'/2']];reqs.forEach(([label,pass,v],i)=>{const y=436+i*24;diamond(g,407,y,4,pass?V42HUD.jade:V42HUD.red);text(label,420,y,12,V42HUD.paper);text(v+(pass?' · Đủ':' · Thiếu'),876,y,12,pass?V42HUD.jade:V42HUD.red,'right','bold');});
 const a=v42fPreview(it,b=>{if(!max)b.v30.asc++;},'asc');v42fCompare(a,402,512,474,max?'ĐÃ CHÍ TÔN':'CHỈ SỐ NẾU THỨC TỈNH');
 if(!max)v42fCosts(c,898,337,326);else text('Đã đạt giới hạn thức tỉnh.',898,365,13,V42HUD.jade);
 v12Wrap('Giữ nguyên phẩm chất, dòng thuộc tính, lỗ khảm và cấp cường hóa. Không có xác suất thất bại nếu đủ điều kiện.',898,532,326,11,V42HUD.muted,16,3);
 v42fAction(max?'ĐÃ CHÍ TÔN':'Thức tỉnh · '+V42F_ASC[n+1],()=>v30Ascend(it),'forgeAscend',ok,max?'':ok?'Đủ điều kiện':'Kiểm tra yêu cầu & nguyên liệu');
}
function v42fRelics(){const x=34,y=218,w=334,h=429,rx=380,rw=866,r=V30_RECIPES[V42FORGE.recipe],idx=p.relics.indexOf(r.id),active=idx>=0&&idx<4,have=idx>=0,c={stones:r.stones,mat:r.cost,ess:r.ess};v42HUDFrame(x,y,w,h);v42HUDSection('ĐỒ PHỔ PHÁP BẢO',x+12,y+18,w-24,p.relics.length+' sở hữu');
 V30_RECIPES.forEach((a,j)=>{const i=p.relics.indexOf(a.id),yy=y+39+j*84,col=a.element==='Mộc'?'#9ed2bc':a.element==='Kim'?'#f1d9a9':a.element==='Thổ'?'#c5b18a':'#d4b4ff';v42HUDFrame(x+12,yy,w-24,75,col,V42FORGE.recipe===j);diamond(g,x+28,yy+19,7,col);v42fClip(a.name,x+45,yy+20,w-75,col,15);text('Lv '+a.lv+' · '+a.element,x+45,yy+42,11,V42HUD.muted);text(i<0?p.level<a.lv?'Chưa đủ cấp':'Chưa sở hữu':i<4?'Đang kích hoạt · Ô '+(i+1):'Trong kho',x+45,yy+61,11,i<4&&i>=0?V42HUD.jade:V42HUD.muted);buttons.push({x:x+12,y:yy,w:w-24,h:75,fn:()=>{V42FORGE.recipe=j;},v33:'forgeRecipe'+j});});
 v42HUDFrame(rx,y,rw,h,V42HUD.bronze);v42HUDTitle(r.name,rx+20,y+34,24,V42HUD.bright);text(r.element+' hệ · Yêu cầu cấp '+r.lv,rx+20,y+62,13,p.level>=r.lv?V42HUD.jade:V42HUD.red);v12Wrap(r.desc,rx+20,y+86,rw-40,14,V42HUD.paper,20,2);v41HUDLine(rx+15,y+106,rw-30,'#b7a27277');
 v42HUDSection('BỐN Ô ĐANG KÍCH HOẠT',402,337,474,Math.min(4,p.relics.length)+'/4');V42FORGE.relicSlot=clamp(V42FORGE.relicSlot,0,3);for(let j=0;j<4;j++){const a=RELICS.find(a=>a.id===p.relics[j]),yy=359+j*42,sel=V42FORGE.relicSlot===j;v42HUDButton(402,yy,474,36,'Ô '+(j+1)+' · '+(a?a.name:'Chưa kích hoạt'),()=>{V42FORGE.relicSlot=j;},'forgeRelicSlot'+j,sel,!!a);}
 const a=v42fRelicPreview(r,V42FORGE.relicSlot);v42fCompare(a,402,538,474,active?'ĐANG KÍCH HOẠT':p.relics.length<4?'CHỈ SỐ KHI KÍCH HOẠT':'CHỈ SỐ NẾU THAY Ô '+(V42FORGE.relicSlot+1));
 if(!have){v42fCosts(c,898,337,326);text('Cấp yêu cầu: '+r.lv+' · Hiện tại '+p.level,898,542,12,p.level>=r.lv?V42HUD.jade:V42HUD.red,'left','bold');text(p.relics.length<4?'Chế xong tự vào ô trống.':'Chế xong để trong kho, kích hoạt sau.',898,565,11,V42HUD.muted);v42fAction('Luyện chế pháp bảo',()=>v30CraftRelic(r.id),'forgeCraftRelic',p.level>=r.lv&&v30Can(c));}
 else{v42HUDSection('TRẠNG THÁI',898,337,326);v12Wrap(active?'Đang phát huy hiệu quả. Bốn pháp bảo đầu tiên được kích hoạt; tương sinh theo ô kề nhau.':'Chọn một ô đang kích hoạt để thay đổi. Pháp bảo cũ được đưa về kho, không tiêu hao nguyên liệu.',898,374,326,13,V42HUD.paper,21,5);v42fAction(active?'ĐANG KÍCH HOẠT':'Kích hoạt ô '+(V42FORGE.relicSlot+1),()=>v30ActivateRelic(r.id,V42FORGE.relicSlot),'forgeActivateRelic',!active&&V42FORGE.relicSlot<Math.min(4,p.relics.length));}
}
v30ForgePanel=function(){v42fReset();v42fNav();if(V30.tab===4)v42fRelics();else{v42fList();const it=v30Item();if(!it){v42HUDFrame(380,218,866,429);v42HUDTitle('Hãy chọn trang bị để luyện khí',813,420,24,V42HUD.muted,'center');}else{v42fItemHeader(it);if(V30.tab===0)v42fEnhance(it);if(V30.tab===1)v42fRefine(it);if(V30.tab===2)v42fGems(it);if(V30.tab===3)v42fAsc(it);}}
 v33Fit(V30.note||'Thu thập · Boss · Phân giải trang bị cung cấp linh tinh, huyền thiết và tinh phách.',36,666,920,12,V30.note?V42HUD.jade:V42HUD.muted,'left','bold');v42HUDButton(1015,654,231,31,'Rời lò luyện · ESC',()=>modal=null,'forgeExit',false,true);
};

// A deterministic survival trial, not the obsolete pre-V30 random breakout.
v30TrialPanel=function(){const rank=clamp(Math.floor(p.level/9),1,4),s=currentStats(),eligible=v30TrialEligible(),wave=rank+2,wait=Math.max(.85,1.55-.11*rank),base=65+rank*55,mit=Math.min(.35,(p.breakFails||0)*.07+(s.breakBonus||0)*.35);v42HUDShell('CỬU TIÊU LÔI ĐÀI','Thiên kiếp đột phá · Kỹ năng di chuyển và sinh tồn');
 v42HUDFrame(34,111,782,535,'#bfa6ec');v42HUDFrame(828,111,418,535,V42HUD.bronze);v42HUDTitle(realm()+' → '+V22_REALMS[rank]+' tầng 1',55,140,22,'#d9c7f8');v42HUDSection('THIÊN LÔI GIÁNG THẾ',55,170,740,wave+' đợt');
 for(let i=0;i<wave;i++){const x=77+i*(710/wave),yy=202,w=690/wave;v42HUDFrame(x,yy,w-8,75,'#9e88cf',true);text('LÔI '+(i+1),x+(w-8)/2,yy+15,11,'#dfc8ff','center','bold');text(['Truy kích','Lôi tuyến','Vòng lôi'][i%3],x+(w-8)/2,yy+36,13,V42HUD.paper,'center','bold');text(wait.toFixed(2)+' giây báo trước',x+(w-8)/2,yy+58,10,V42HUD.muted,'center');}
 const hints=[['Sét truy kích','Rời khỏi vòng tròn ngay khi xuất hiện. Vị trí không bám theo sau khi vẽ.'],['Lôi tuyến','Di chuyển lệch khỏi dải ngang; dùng khinh công để thoát nhanh.'],['Vòng lôi','Vào vùng tâm an toàn hoặc vượt ra ngoài vành sáng.']];hints.forEach(([title,desc],i)=>{const y=301+i*91,x=61;v42HUDFrame(x,y,733,81,'#7d72a9');g.save();g.strokeStyle='#d5bbff';g.lineWidth=2;const cx=x+51,cy=y+40;g.beginPath();if(i===0)g.arc(cx,cy,24,0,TAU);if(i===1)g.rect(cx-35,cy-10,70,20);if(i===2){g.arc(cx,cy,31,0,TAU);g.moveTo(cx+12,cy);g.arc(cx,cy,12,0,TAU);}g.stroke();g.restore();v42fClip(title,x+110,y+20,600,'#ddc8fc',16);v12Wrap(desc,x+110,y+45,600,13,V42HUD.paper,20,2);});
 text('Không gieo xác suất: sống sót toàn bộ đợt lôi = đột phá thành công.',61,616,12,V42HUD.jade,'left','bold');
 v42HUDSection('CHUẨN BỊ VƯỢT KIẾP',850,137,374,eligible?'ĐỦ':'CHƯA ĐỦ');
 const conditions=[['Tầng 9 viên mãn',v22AtCap(),'Cảnh giới hiện tại'],['Đầy tu vi',p.xp>=xpNeed(),v10Fmt(p.xp)+' / '+v10Fmt(xpNeed())],['Ngoài bí cảnh',p.worldMode,p.worldMode?'Đang ở Cửu Vực':'Đang trong bí cảnh']];conditions.forEach(([label,ok,detail],i)=>{const y=159+i*48;v42HUDFrame(850,y,374,43,ok?V42HUD.jade:V42HUD.red);diamond(g,863,y+13,4,ok?V42HUD.jade:V42HUD.red);text(label,876,y+12,12,V42HUD.paper,'left','bold');text(ok?'Đủ':'Thiếu',1212,y+12,12,ok?V42HUD.jade:V42HUD.red,'right','bold');text(detail,876,y+30,10,V42HUD.muted);});
 v42HUDStatRow('Sinh lực',Math.ceil(p.hp)+' / '+Math.ceil(s.hp),850,320,374);v42HUDStatRow('Hồi Xuân Đan · H',String(p.pills),850,347,374);v42HUDStatRow('Lần thất bại trước',String(p.breakFails||0),850,374,374);v42HUDStatRow('Giảm sát thương thiên kiếp',Math.round(mit*100)+'%',850,401,374,V42HUD.jade);v42HUDStatRow('Sát thương gốc mỗi lôi',String(base),850,428,374);v42HUDStatRow('Sau giảm kiếp, trước thủ',String(Math.round(base*(1-mit))),850,455,374,V42HUD.bright);
 v12Wrap('Thất bại giữ cảnh giới, còn 75% tu vi. Mỗi lần thử lại hỗ trợ giảm sát thương kiếp thêm 7 điểm % (tổng tối đa 35%).',850,489,374,13,V42HUD.muted,20,4);
 v42HUDButton(850,575,374,55,'Tiến vào lôi đài',()=>{if(v30TrialEligible())v30TrialStart();},'trialBegin',true,eligible,wave+' đợt · H để hồi phục');v42HUDButton(34,654,260,31,'Chuẩn bị thêm · ESC',()=>modal=null,'trialBack');text('WASD · SPACE · H   |   Lôi kiếp được lưu từng đợt',314,670,12,V42HUD.muted);
};


