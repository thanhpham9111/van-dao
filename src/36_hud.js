'use strict';
// v42_hud.js
// V42 · Đạo Đồ: a unified premium RPG interface. All buttons act on the existing systems.
const V42HUD={
  bronze:'#B88961',bright:'#F0E6D2',paper:'#F0E6D2',jade:'#A2B299',muted:'#8fa08e',
  edge:'#B88961',red:'#e39280',ink:'#182724',
  owner:null,grid:24,filter:0,sort:0,detail:0,diff:null,diffAt:0,diffKey:'',
  views:['Tất cả','Chưa khóa','Đã khóa','Đang mặc'],sizes:[24,48]
};
Object.assign(H35,{gold:V42HUD.bronze,gold2:'#8a7752',paper:V42HUD.paper,jade:V42HUD.jade,muted:V42HUD.muted,edge:V42HUD.edge});
Object.assign(H34,{gold:V42HUD.bronze,paper:V42HUD.paper,jade:V42HUD.jade,muted:V42HUD.muted,line:V42HUD.edge,red:V42HUD.red});
Object.assign(V21,{gold:V42HUD.bronze,paper:V42HUD.paper,muted:V42HUD.muted,silver:V42HUD.edge,green:V42HUD.jade,red:V42HUD.red});
function v42HUDReset(){
  if(V42HUD.owner!==p){Object.assign(V42HUD,{owner:p,filter:0,sort:0,detail:0,diff:null,diffAt:0,diffKey:''});v21Page=0;v21Filter='all';v34Rare=0;}
}
function v42HUDTitle(s,x,y,size,col=V42HUD.bright,align='left'){
  if(typeof v41PText==='function')return v41PText(s,x,y,size,col,align,'serif','bold');
  text(s,x,y,size,col,align,'bold');
}
function v42HUDFrame(x,y,w,h,edge=V42HUD.edge,active=false){
  g.save();
  const gr=g.createLinearGradient(x,y,x+w*.65,y+h);
  gr.addColorStop(0,active?'#35544a':'#233b34');gr.addColorStop(.38,active?'#263f34':'#1a2b27');gr.addColorStop(1,'#101d1bed');
  v41HUDRound(x+.5,y+.5,w-1,h-1,h>95?9:5);g.fillStyle=gr;g.fill();g.strokeStyle=edge;g.lineWidth=active?1.6:1;g.stroke();
  if(w>54&&h>35){
    v41HUDRound(x+3.5,y+3.5,w-7,h-7,4);g.strokeStyle='#d1c79531';g.lineWidth=.7;g.stroke();
    if(w>125&&h>60){
      for(const [sx,sy,kx,ky] of [[x+5,y+5,1,1],[x+w-5,y+5,-1,1],[x+5,y+h-5,1,-1],[x+w-5,y+h-5,-1,-1]])v41HUDCorner(sx,sy,kx,ky,active?'#f1d79b':edge,12);
    }
    if(active){g.fillStyle='#ecdeaa15';g.fillRect(x+5,y+5,w-10,Math.min(6,h-10));}
  }
  g.restore();
}
v35Plate=v42HUDFrame;v34Panel=v42HUDFrame;v21Frame=v42HUDFrame;
function v42HUDSection(label,x,y,w,meta=''){
  text(label,x,y,13,V42HUD.bright,'left','bold');
  if(meta)v33Fit(meta,x+w,y,w*.45,11,V42HUD.muted,'right','bold');
  v41HUDLine(x,y+13,w,'#b7a27263');
}
function v42HUDButton(x,y,w,h,label,fn,id,active=false,enabled=true,sub=''){
  const over=v33Over(x,y,w,h),edge=!enabled?'#58655a':active||over?V42HUD.bright:V42HUD.edge;
  v42HUDFrame(x,y,w,h,edge,enabled&&(active||over));
  v33Fit(label,x+w/2,y+h/2-(sub?7:0),w-12,13,enabled?V42HUD.paper:'#86958c','center','bold');
  if(sub)v33Fit(sub,x+w/2,y+h/2+11,w-12,10,V42HUD.muted,'center');
  buttons.push({x,y,w,h,fn:()=>{if(enabled)fn();},v33:id});
}
function v42HUDShell(title,sub){
  g.save();g.fillStyle='#07110ee0';g.fillRect(0,0,W,H);g.restore();
  v42HUDFrame(20,21,1240,678,V42HUD.bronze);
  const gr=g.createLinearGradient(34,34,1246,96);gr.addColorStop(0,'#365149');gr.addColorStop(.54,'#1e352e');gr.addColorStop(1,'#13221d');
  g.fillStyle=gr;g.fillRect(32,33,1216,65);
  v41HUDLine(36,98,1208,'#ceb784a0');
  diamond(g,47,53,5,V42HUD.bronze);v42HUDTitle(title,62,52,24);
  v33Fit(sub,62,79,625,12,V42HUD.muted);
  v42HUDButton(1198,45,40,39,'×',()=>{modal=null;},'close');
}
v34Shell=v42HUDShell;
function v42HUDStatRow(label,value,x,y,w,color=V42HUD.paper){
  text(label,x,y,13,V42HUD.muted);
  v33Fit(value,x+w,y,w*.49,14,color,'right','bold');v41HUDLine(x,y+12,w,'#c9be951b');
}
function v42HUDGearValue(it){
  if(!it)return 0;const d=gearDef(it);return d?((d.atk||0)+(d.def||0))* (1+it.quality*.18+it.up*.12):0;
}
function v42HUDWorn(it){return Object.values(p.worn||{}).includes(p.gear.indexOf(it));}
function v42HUDAlpha(c,a){
  if(/^#[0-9a-f]{3}$/i.test(c))c='#'+c.slice(1).split('').map(v=>v+v).join('');
  return /^#[0-9a-f]{6}$/i.test(c)?c+a:c;
}
function v42HUDTag(label,x,y,w,c=V42HUD.bronze){
  v42HUDFrame(x,y,w,23,c,false);v33Fit(label,x+w/2,y+11.5,w-9,11,c,'center','bold');
}
function v42HUDSlot(it,x,y,w,h,id){
  const c=it?QUALITY_COL[it.quality]: '#43564c',sel=it&&it.uid===v21Selected,over=it&&v33Over(x,y,w,h);
  v42HUDFrame(x,y,w,h,sel?V42HUD.bright:over?V42HUD.paper:c,!!(over||sel));
  if(!it){g.save();g.strokeStyle='#7e917947';g.lineWidth=1;g.beginPath();g.moveTo(x+w*.5-3,y+h*.5);g.lineTo(x+w*.5+3,y+h*.5);g.moveTo(x+w*.5,y+h*.5-3);g.lineTo(x+w*.5,y+h*.5+3);g.stroke();g.restore();return;}
  const d=gearDef(it),large=w>68,size=Math.min(w-10,h-15);
  g.save();const gr=g.createRadialGradient(x+w/2,y+h*.44,2,x+w/2,y+h*.44,w*.55);gr.addColorStop(0,v42HUDAlpha(c,'48'));gr.addColorStop(1,v42HUDAlpha(c,'00'));g.fillStyle=gr;g.fillRect(x+4,y+4,w-8,h-8);g.restore();
  gearIcon(d,x+(w-size)/2,y+4,size);
  if(it.up)text('+'+it.up,x+w-5,y+9,12,V42HUD.bright,'right','bold');
  if(it.lock){g.save();g.strokeStyle=V42HUD.bright;g.lineWidth=1.3;g.strokeRect(x+6,y+8,7,6);g.beginPath();g.arc(x+9.5,y+8,3,Math.PI,0);g.stroke();g.restore();}
  if(v42HUDWorn(it)){
    g.fillStyle='#18513cfa';g.fillRect(x+3,y+h-15,w-6,12);text('ĐANG MẶC',x+w/2,y+h-9,10,V42HUD.jade,'center','bold');
  }else{
    g.fillStyle=c;g.fillRect(x+5,y+h-6,w-10,2.5);
    if(large)v33Fit(QUALITY[it.quality],x+w/2,y+h-13,w-8,11,c,'center','bold');
  }
  buttons.push({x,y,w,h,fn:()=>{v21Selected=v21Selected===it.uid?null:it.uid;v21Confirm=null;V42HUD.diffKey='';},v33:id});
}
function v42HUDDiff(it){
  const key=[it.uid,it.up,it.quality,it.v30?.asc,p.level,p.cls,p.worn[gearDef(it).slot],JSON.stringify(it.affixes||[]),JSON.stringify(it.v30?.sockets||[])].join('|');
  if(V42HUD.diffKey!==key||!V42HUD.diff||elapsed-V42HUD.diffAt>.25){
    V42HUD.diff=v21Diff(it);V42HUD.diffKey=key;V42HUD.diffAt=elapsed;
  }
  return V42HUD.diff;
}
function v42HUDInventoryLeft(s){
  const x=34,y=111,w=279,h=535,c=V10_SCHOOLS[p.cls].color;
  v42HUDFrame(x,y,w,h);v42HUDSection('TRANG BỊ',x+15,y+19,w-30,realm());
  const px=x+12,py=y+43,pw=w-24,ph=151,cx=x+w/2;
  g.save();const glow=g.createRadialGradient(cx,py+79,4,cx,py+79,120);glow.addColorStop(0,'#688b72');glow.addColorStop(.60,'#334c3d');glow.addColorStop(1,'#14221c');
  g.fillStyle=glow;g.fillRect(px,py,pw,ph);
  seal(g,cx,py+117,62,V42HUD.bronze,elapsed*.025,.38);
  g.save();g.strokeStyle='#d5c38c33';g.strokeRect(px+.5,py+.5,pw-1,ph-1);g.restore();
  v9DrawCell('idle9',4,4,2,cx,py+151,188);g.restore();
  v42HUDTitle(p.v8Name||'Vô Danh',cx,y+208,17,V42HUD.paper,'center');
  text(V10_SCHOOLS[p.cls].name+' · Lv '+p.level,cx,y+229,13,c,'center','bold');
  v42HUDFrame(x+13,y+244,w-26,42,V42HUD.bronze,true);
  text('CHIẾN LỰC',x+25,y+265,13,V42HUD.muted,'left','bold');
  v42HUDTitle(String(v10FightPower(s)),x+w-25,y+265,24,V42HUD.bright,'right');
  let yy=y+296;
  for(const [slot,name] of Object.entries(V21_SLOTS)){
    const it=p.gear[p.worn[slot]],d=gearDef(it),col=it?QUALITY_COL[it.quality]:V42HUD.edge;
    v42HUDFrame(x+13,yy,w-26,53,col,it&&it.uid===v21Selected);
    if(it){
      gearIcon(d,x+19,yy+5,43);text(name,x+69,yy+13,11,V42HUD.muted);
      v33Fit(d.name+(it.up?' +'+it.up:''),x+69,yy+31,w-91,14,col,'left','bold');
      if(it.lock)text('◆',x+w-23,yy+10,11,V42HUD.bright,'center');
      buttons.push({x:x+13,y:yy,w:w-26,h:53,fn:()=>{v21Selected=it.uid;v21Confirm=null;V42HUD.diffKey='';},v33:'worn'+slot});
    }else{v35Icon(slot==='weapon'?'sword':'bag',x+43,yy+27,18,V42HUD.edge);text(name+' · Chưa trang bị',x+69,yy+27,13,V42HUD.muted);}
    yy+=59;
  }
  text('CÔNG '+v21Fmt('attack',s.attack),x+18,y+491,13,V42HUD.paper,'left','bold');
  text('THỦ '+v21Fmt('def',s.def),x+w-18,y+491,13,V42HUD.paper,'right','bold');
  text('HP '+Math.ceil(s.hp),x+18,y+514,13,V42HUD.muted);
  text('MP '+Math.ceil(s.mp),x+w-18,y+514,13,V42HUD.muted,'right');
}
function v42HUDInventoryGrid(){
  const x=323,y=111,w=517,h=535;
  v42HUDFrame(x,y,w,h);
  v42HUDSection('TÚI HÀNH TRANG',x+15,y+19,w-30,p.gear.length+'/48 ô');
  const filters=[['all','Tất cả'],['weapon','Vũ khí'],['armor','Y phục'],['accessory','Linh sức']];
  filters.forEach(([id,label],i)=>v42HUDButton(x+13+i*123,y+37,116,29,label,()=>{v21Filter=id;v21Page=0;},'filter'+id,v21Filter===id));
  v42HUDButton(x+13,y+73,160,29,v34Rare?'Từ '+QUALITY[v34Rare]:'Mọi phẩm chất',()=>{v34Rare=(v34Rare+1)%8;v21Page=0;},'rarity',v34Rare>0);
  v42HUDButton(x+180,y+73,160,29,V42HUD.views[V42HUD.filter],()=>{V42HUD.filter=(V42HUD.filter+1)%V42HUD.views.length;v21Page=0;},'filterState',V42HUD.filter>0);
  v42HUDButton(x+347,y+73,157,29,'Lưới '+V42HUD.grid+' ô',()=>{V42HUD.grid=V42HUD.grid===24?48:24;v21Page=0;},'gridMode');
  let entries=p.gear.filter(it=>(v21Filter==='all'||gearDef(it).slot===v21Filter)&&it.quality>=v34Rare)
    .filter(it=>V42HUD.filter===0||V42HUD.filter===1&&!it.lock||V42HUD.filter===2&&it.lock||V42HUD.filter===3&&v42HUDWorn(it));
  const sort=V42HUD.sort;
  if(sort)entries=entries.slice().sort((a,b)=>sort===1?(b.quality-a.quality||b.up-a.up||a.uid-b.uid):(v42HUDGearValue(b)-v42HUDGearValue(a)||b.quality-a.quality||a.uid-b.uid));
  const n=V42HUD.grid,cols=n===24?6:8,rows=n/cols,gap=5,cell=Math.floor((w-26-gap*(cols-1))/cols),hh=n===24?79:51,
    x0=x+(w-(cols*cell+(cols-1)*gap))/2,y0=y+119;
  const pages=Math.max(1,Math.ceil(entries.length/n));v21Page=clamp(v21Page,0,pages-1);
  let hovered=null;
  for(let i=0;i<n;i++){
    const index=v21Page*n+i,it=entries[index],xx=x0+(i%cols)*(cell+gap),yy=y0+Math.floor(i/cols)*(hh+gap);
    v42HUDSlot(it,xx,yy,cell,hh,'item'+index);
    if(it&&v33Over(xx,yy,cell,hh))hovered=it;
  }
  const py=y+462;
  v42HUDButton(x+13,py,46,32,'‹',()=>{v21Page=Math.max(0,v21Page-1);},'pagePrev',false,v21Page>0);
  text('Trang '+(v21Page+1)+'/'+pages,x+115,py+16,13,V42HUD.paper,'center','bold');
  v42HUDButton(x+171,py,46,32,'›',()=>{v21Page=Math.min(pages-1,v21Page+1);},'pageNext',false,v21Page<pages-1);
  v42HUDButton(x+225,py,w-238,32,'Sắp: '+['Thứ tự nhặt','Phẩm chất','Chỉ số cơ bản'][sort],()=>{V42HUD.sort=(sort+1)%3;v21Sort=V42HUD.sort===1;v21Page=0;},'sort',sort>0);
  text(entries.length+' vật phẩm phù hợp · '+(hovered?gearDef(hovered).name:'Click vật phẩm để khóa vào bảng chi tiết'),x+w/2,y+515,12,V42HUD.muted,'center');
  return hovered;
}
function v42HUDInventoryDetail(hovered){
  const x=850,y=111,w=396,h=535,pinned=p.gear.find(it=>it.uid===v21Selected),it=pinned||hovered;
  if(!it){
    v42HUDFrame(x,y,w,h);v42HUDSection('GIÁM ĐỊNH',x+15,y+19,w-30);
    g.save();g.globalAlpha=.4;seal(g,x+w/2,y+197,82,V42HUD.bronze,elapsed*.05,1);g.restore();
    v42HUDTitle('Chọn linh bảo',x+w/2,y+287,25,V42HUD.bright,'center');
    text('Rê chuột để xem nhanh chỉ số',x+w/2,y+326,13,V42HUD.muted,'center');
    text('Click để mở so sánh và thao tác',x+w/2,y+349,13,V42HUD.paper,'center');
    return;
  }
  const d=gearDef(it),col=QUALITY_COL[it.quality],idx=p.gear.indexOf(it),eq=p.worn[d.slot]===idx;
  v42HUDFrame(x,y,w,h,col);v42HUDSection('GIÁM ĐỊNH',x+14,y+19,w-28,pinned?'Đang chọn':'Xem nhanh');
  v42HUDSlotArt(it,x+15,y+40,73,79,col);
  v33Fit(d.name+(it.up?' +'+it.up:''),x+99,y+53,w-114,19,col,'left','bold');
  v33Fit(QUALITY[it.quality]+' · '+V21_SLOTS[d.slot]+' · '+d.element,x+99,y+79,w-114,13,V42HUD.muted);
  v42HUDTag(eq?'ĐANG MẶC':it.req>p.level?'CẦN CẤP '+it.req:'CẤP '+(it.req||1),x+99,y+93,104,eq?V42HUD.jade:it.req>p.level?V42HUD.red:V42HUD.bronze);
  if(it.lock)v42HUDTag('ĐÃ KHÓA',x+210,y+93,79,V42HUD.bronze);
  v42HUDButton(x+13,y+131,179,31,'Thuộc tính',()=>{V42HUD.detail=0;},'itemProperties',V42HUD.detail===0);
  v42HUDButton(x+201,y+131,182,31,'So sánh',()=>{V42HUD.detail=1;},'itemCompare',V42HUD.detail===1);
  const left=x+18,right=w-36;
  if(V42HUD.detail===0){
    const m=1+it.quality*.18+it.up*.12;
    v42HUDSection('CHỈ SỐ CƠ BẢN',left,y+181,right);
    text('CÔNG '+v21Fmt('attack',d.atk*m),left,y+208,14,V42HUD.paper,'left','bold');
    text('THỦ '+v21Fmt('def',d.def*m),x+w-18,y+208,14,V42HUD.paper,'right','bold');
    v33Fit(V21_STYLE[d.style]||'Không có nội tại riêng',left,y+229,right,12,V42HUD.muted);
    v42HUDSection('THUỘC TÍNH NGẪU NHIÊN',left,y+251,right);
    let yy=y+273;
    if(!it.affixes?.length){text('Không có thuộc tính ngẫu nhiên.',left,yy,13,V42HUD.muted);yy+=21;}
    else for(const a of it.affixes.slice(0,5)){v42HUDStatRow(V21_AFFIX[a.k]?.[0]||a.k,v21Fmt(a.k,a.v,true),left,yy,right,col);yy+=21;}
    const set=V29_SETS[d.v29Set],sockets=it.v30?.sockets||[];
    let extra=y+389;
    if(set){text('BỘ '+set.name+'  ·  '+(v29EquippedSets()[set.key]||0)+'/3',left,extra,13,V42HUD.bright,'left','bold');extra+=23;}
    const gemText=sockets.length?sockets.map(k=>k?V30_GEMS[k]?.name||k:'Lỗ trống').join(' · '):'Chưa mở';
    v33Fit('Khảm: '+gemText,left,extra,right,12,V42HUD.jade);
    if(it.v30?.asc)v33Fit('Tiến hóa: '+['','Thông Linh','Hóa Thần','Chí Tôn'][it.v30.asc],left,extra+19,right,12,V42HUD.bright);
  }else{
    const worn=p.gear[p.worn[d.slot]],diff=v42HUDDiff(it);
    v42HUDSection('SO VỚI TRANG BỊ HIỆN TẠI',left,y+181,right);
    v33Fit(eq?'Đang sử dụng':worn?gearDef(worn).name:'Ô trang bị trống',left,y+207,right,14,V42HUD.muted,'left','bold');
    text('THUỘC TÍNH',left,y+233,12,V42HUD.bright,'left','bold');
    text('SAU KHI MẶC',x+w-18,y+233,12,V42HUD.bright,'right','bold');
    const s=currentStats();let yy=y+256;
    if(eq||!diff.length)text(eq?'Đây là trang bị đang mặc.':'Không thay đổi các chỉ số chính.',left,yy,13,V42HUD.muted);
    else for(const a of diff.slice(0,8)){
      text(a.label,left,yy,13,V42HUD.paper);
      v33Fit(v21Fmt(a.k,(s[a.k]||0)+a.v)+'  ('+v21Fmt(a.k,a.v,true)+')',x+w-18,yy,197,13,a.v>0?V42HUD.jade:V42HUD.red,'right','bold');
      v41HUDLine(left,yy+11,right,'#c9be9520');yy+=21;
    }
    if(diff.length>8)text('Còn '+(diff.length-8)+' thuộc tính thay đổi khác',left,y+427,12,V42HUD.muted);
  }
  if(pinned){
    const allowed=!it.req||p.level>=it.req,forge=v30ForgeAllowed(),salvage=!eq&&!it.lock;
    v42HUDButton(x+13,y+451,180,34,eq?'Đang mặc':allowed?'Trang bị':'Chưa đủ cấp',()=>{if(equip(idx)!==false){v21Say('Đã trang bị '+d.name);V42HUD.diffKey='';}},'equip',!eq&&allowed,!eq&&allowed);
    v42HUDButton(x+201,y+451,182,34,forge?'Luyện khí · +'+it.up+'/20':'Luyện khí tại thôn',()=>v30ForgeOpen(it.uid),'forge',false,forge);
    v42HUDButton(x+13,y+492,180,34,it.lock?'Mở khóa':'Khóa vật phẩm',()=>{it.lock=!it.lock;v21Confirm=null;save();},'lock',it.lock);
    v42HUDButton(x+201,y+492,182,34,eq?'Đang mặc · Đã bảo vệ':it.lock?'Đã khóa · Đã bảo vệ':v21Confirm===it.uid?'XÁC NHẬN PHÂN GIẢI':'Phân giải · +'+v21SalvageValue(it)+' ◈',()=>v21Salvage(it),'salvage',v21Confirm===it.uid,salvage);
  }else text('Click ô vật phẩm để thao tác',x+w/2,y+500,14,V42HUD.jade,'center','bold');
}
function v42HUDSlotArt(it,x,y,w,h,c){
  v42HUDFrame(x,y,w,h,c);gearIcon(gearDef(it),x+4,y+4,Math.min(w-8,h-8));
  g.fillStyle=c;g.fillRect(x+5,y+h-5,w-10,2);
}
// v21Inventory: bảng Hành trang I (modal 'gear') (T46). Bản 36_hud là bản chạy thật; các lớp V21/V29/V30/V34 trước đây bị ghi đè đã xoá.
function v21Inventory(){
  v21Init();v42HUDReset();
  v42HUDShell('LINH BẢO · HÀNH TRANG','Trang bị · Giám định · So sánh · Luyện khí');
  v42HUDButton(713,45,145,39,'Bộ trang bị',()=>{modal={kind:'v29sets'};},'sets');
  v42HUDButton(866,45,145,39,'Pháp bảo · '+p.relics.length,()=>{modal={kind:'relic21'};},'relic');
  v42HUDButton(1019,45,171,39,'Nguyên liệu',()=>{modal=null;v13Open(0);},'materials');
  const s=currentStats();
  v42HUDInventoryLeft(s);const it=v42HUDInventoryGrid();v42HUDInventoryDetail(it);
  v42HUDFrame(34,655,1212,31);diamond(g,48,670,4,V42HUD.bronze);
  text(p.stones+' linh thạch  ·  Hồi Xuân Đan ×'+p.pills,59,671,14,V42HUD.bright,'left','bold');
  v42HUDButton(535,659,181,23,'Tự nhặt '+(v21State().auto?'BẬT':'TẮT'),v21Toggle,'inventoryLoot',v21State().auto);
  text('I / G · Đóng túi    |    Click · Chọn / bỏ chọn',1232,671,12,V42HUD.muted,'right');
}

// A journal with explicit active, ready, locked states; the existing reward/route engine does all mutations.
const V42QUEST_COL={done:'#a0c49a',ready:'#e6c879',available:'#9dd2bc',active:'#efd799',locked:'#89958c'};
function v42QuestFraction(t){
  if(t.state==='done'||t.state==='ready')return 1;
  if(t.state==='available'||t.state==='locked')return 0;
  if(t.kill)return clamp(v12Count(t.region)/Math.max(1,t.kill),0,1);
  if(t.action==='break')return clamp((p.level-1+Math.min(1,p.xp/xpNeed()))/9,0,.99);
  return 0;
}
function v42QuestGuidePage(){
  const a=[
    ['01 · Di chuyển','WASD / phím mũi tên hoặc click đất. Click vào NPC hoặc công trình để tìm đường.'],
    ['02 · Chiến đấu','Chuột trái tấn công, chuột phải và 1–3 thi triển công pháp. Space né; H hồi sinh mệnh.'],
    ['03 · Tu luyện','T học công pháp; C cộng chỉ số; I hành trang; B đột phá; P luyện khí ở thôn.'],
    ['04 · Dẫn đường','Chọn nhiệm vụ, theo dõi hoặc dẫn đường. Dấu vàng trên bản đồ chỉ mục tiêu. WASD hủy tự đi.'],
    ['05 · Đạo nghiệp','N quản lý tông môn, linh thú, động phủ. Q mở nhật ký; F2 tùy chỉnh HUD.']
  ];
  for(let i=0;i<a.length;i++){
    const y=172+i*94;v42HUDFrame(34,y,1212,83,V42HUD.edge);diamond(g,55,y+22,5,V42HUD.bronze);v42HUDTitle(a[i][0],74,y+22,17);
    v12Wrap(a[i][1],74,y+52,1148,14,V42HUD.paper,18,2);
  }
}
v8Journal=function(){
  v12Init();const all=v12Entries(),tab=modal.tab??=0;
  v42HUDShell('THIÊN MỆNH · NHẬT KÝ','Chính tuyến '+p.v12Main+'/'+V12_MAIN.length+' · '+realm()+' · '+all.filter(t=>t.state==='done').length+' nhiệm vụ đã hoàn thành');
  const counts=[all.filter(t=>t.id.startsWith('main:')).length,all.filter(t=>!t.id.startsWith('main:')&&t.state!=='done').length,all.filter(t=>t.state==='done').length];
  ['Chính tuyến','Nhiệm vụ phụ','Đã hoàn thành','Hướng dẫn'].forEach((label,i)=>v42HUDButton(34+i*305,111,297,42,label+(i<3?' · '+counts[i]:''),()=>{modal.tab=i;modal.page=0;modal.selected=null;},'questTab'+i,tab===i));
  if(tab===3){v42QuestGuidePage();text('Q / ESC · Đóng bảng',1230,672,12,V42HUD.muted,'right');return;}
  const list=all.filter(t=>tab===0?t.id.startsWith('main:'):tab===1?!t.id.startsWith('main:')&&t.state!=='done':t.state==='done');
  const pages=Math.max(1,Math.ceil(list.length/8)),page=modal.page=clamp(modal.page||0,0,pages-1),visible=list.slice(page*8,page*8+8);
  let sel=visible.find(t=>t.id===modal.selected)||visible.find(t=>t.state==='active')||visible[0];
  if(sel)modal.selected=sel.id;
  const lx=34,ly=164,lw=439,lh=481,rx=485,rw=761;
  v42HUDFrame(lx,ly,lw,lh);v42HUDSection('DANH SÁCH NHIỆM VỤ',lx+15,ly+19,lw-30,list.length+' nhiệm vụ');
  visible.forEach((t,i)=>{
    const x=lx+12,y=ly+40+i*48,w=lw-24,h=44,c=V42QUEST_COL[t.state],tracked=t.id===v12Tracked()?.id,select=sel===t;
    v42HUDFrame(x,y,w,h,select?V42HUD.bright:tracked?V42HUD.bronze:V42HUD.edge,select);
    diamond(g,x+14,y+21,6,c);v33Fit(t.name,x+29,y+13,w-112,14,V42HUD.paper,'left','bold');
    text(V12_STATUS[t.state],x+29,y+31,11,c);
    if(tracked)v42HUDTag('THEO DÕI',x+w-81,y+12,73,V42HUD.jade);
    buttons.push({x,y,w,h,fn:()=>{modal.selected=t.id;},v33:'quest'+(page*8+i)});
  });
  if(!visible.length)text('Chưa có nhiệm vụ ở mục này.',lx+lw/2,ly+201,15,V42HUD.muted,'center');
  v42HUDButton(lx+12,ly+436,96,33,'‹ Trước',()=>{modal.page=Math.max(0,page-1);modal.selected=null;},'questPrev',false,page>0);
  text('Trang '+(page+1)+' / '+pages,lx+lw/2,ly+453,13,V42HUD.muted,'center');
  v42HUDButton(lx+lw-108,ly+436,96,33,'Sau ›',()=>{modal.page=Math.min(pages-1,page+1);modal.selected=null;},'questNext',false,page<pages-1);
  v42HUDFrame(rx,ly,rw,lh);
  if(!sel){v42HUDTitle('Chọn một nhiệm vụ',rx+rw/2,ly+240,21,V42HUD.muted,'center');return;}
  const sx=rx+23,ww=rw-46,c=V42QUEST_COL[sel.state],tracked=sel.id===v12Tracked()?.id;
  text(sel.id.startsWith('main:')?'CHÍNH TUYẾN':sel.id.startsWith('side:')?'DU HÀNH':'NHIỆM VỤ NHÂN VẬT',sx,ly+22,11,V42HUD.bronze,'left','bold');
  v42HUDTitle(sel.name,sx,ly+57,26,V42HUD.bright);
  v42HUDTag(V12_STATUS[sel.state],sx,ly+82,125,c);if(tracked)v42HUDTag('ĐANG THEO DÕI',sx+135,ly+82,125,V42HUD.jade);
  v41HUDLine(sx,ly+116,ww);
  v12Wrap(sel.desc,sx,ly+144,ww,15,V42HUD.paper,22,4);
  v42HUDSection('MỤC TIÊU',sx,ly+237,ww);
  v12Wrap(sel.goal,sx,ly+265,ww,16,V42HUD.paper,21,2);
  v41HUDBar(sx,ly+317,ww,14,v42QuestFraction(sel),1,c);
  v33Fit(v12Progress(sel),sx,ly+349,ww,13,c,'left','bold');
  const q=sel.state!=='locked'&&sel.state!=='done'?v12Target(sel):null;
  if(q)v33Fit('Vị trí: '+q.label+' · '+Math.round(dist(q,p))+' bước',sx,ly+372,ww,12,V42HUD.muted);
  v41HUDLine(sx,ly+386,ww);
  text('THƯỞNG',sx,ly+403,11,V42HUD.bright,'left','bold');
  v42HUDTag('◈ '+sel.stones+' linh thạch',sx+91,ly+393,147,V42HUD.bronze);
  v42HUDTag('Đan ×'+sel.pills,sx+249,ly+393,105,V42HUD.jade);
  if(sel.xp)v42HUDTag('+'+sel.xp+' tu vi',sx+365,ly+393,105,V42HUD.bronze);
  const inactive=['done','locked'].includes(sel.state),isSide=sel.id.startsWith('side:'),action=isSide&&['available','ready'].includes(sel.state);
  if(!inactive){
    v42HUDButton(sx,ly+433,224,35,action?(sel.state==='available'?'Nhận nhiệm vụ':'Nhận thưởng'):tracked?'Đang theo dõi':'Theo dõi',()=>{
      if(action){const k=sel.id.slice(5);if(sel.state==='available'){p.v12Side[k]=1;p.v12Track=sel.id;}else if(p.v12Side[k]===1&&V12_SIDE.find(t=>t.id===k).done()){p.v12Side[k]=2;v12Reward(sel);if(p.v12Track===sel.id)p.v12Track='main';}}
      else p.v12Track=sel.id.startsWith('main:')?'main':sel.id;save();},'questTrack',true,action||!tracked);
    v42HUDButton(sx+234,ly+433,224,35,'Dẫn đường',()=>v12Guide(sel),'questGuide');
  }
  v42HUDButton(rx+rw-23-224,ly+433,224,35,'Đóng · ESC',()=>{modal=null;},'questClose');
  text('Q · Mở hoặc đóng nhật ký    |    Dẫn đường tự động, WASD hủy',34,673,12,V42HUD.muted);
};
// Skill development: connected technique cards rather than miniature rows; preserve true ranks and level gates.
v11SkillPanel=function(){
  const school=V10_SCHOOLS[p.cls],skills=V11_SKILLS[p.cls],ranks=v11Levels(),pts=v11SkillPoints();
  v42HUDShell('CÔNG PHÁP · ĐẠO THỐNG',school.title+' · '+school.role+' · '+realm());
  v42HUDFrame(934,43,256,43,school.color,true);text('ĐIỂM CÒN',950,64,12,V42HUD.muted,'left','bold');v42HUDTitle(String(pts),1172,64,25,school.color,'right');
  const lx=34,ly=111,lw=742,lh=535,rx=786,rw=460;
  v42HUDFrame(lx,ly,lw,lh);v42HUDSection('TRẬN ĐỒ CÔNG PHÁP',lx+16,ly+19,lw-32,'Chọn một nút trên trận đồ để xem chi tiết');
  
  const _fx=lx+371,_fy=ly+267,_fr=155;
  const _nodes=[[0,_fx,_fy-_fr],[1,_fx+_fr,_fy],[2,_fx,_fy+_fr],[3,_fx-_fr,_fy]];
  g.save();g.strokeStyle='#d4c08d44';g.lineWidth=1.4;g.setLineDash([3,4]);g.beginPath();g.arc(_fx,_fy,_fr,0,TAU);g.stroke();g.restore();
  for(const [i,nx,ny] of _nodes){
    g.save();g.strokeStyle='#d4c08d55';g.lineWidth=1.4;g.beginPath();g.moveTo(_fx,_fy);g.lineTo(nx,ny);g.stroke();g.restore();
    diamond(g,(_fx+nx)/2,(_fy+ny)/2,4,'#d4c08d');
  }
  skills.forEach((d,i)=>{
    const passive=i===4,rank=ranks[i],locked=p.level<d.lv,col=locked?V42HUD.muted:d.color,sel=v34SkillFocus===i;
    const cx=passive?_fx:_nodes[i][1],cy=passive?_fy:_nodes[i][2],r=passive?44:40;
    if(sel){g.save();g.strokeStyle=V42HUD.bright;g.lineWidth=2;g.beginPath();g.arc(cx,cy,r+15,0,TAU);g.stroke();g.restore();}
    g.save();const aura=g.createRadialGradient(cx,cy,1,cx,cy,r*1.55);aura.addColorStop(0,col+'51');aura.addColorStop(1,col+'00');g.fillStyle=aura;g.fillRect(cx-r*1.55,cy-r*1.55,r*3.1,r*3.1);
    circle(cx,cy,r+6,'#12291f',col);g.globalAlpha=locked?.45:1;v11SkillIcon(d.kind,cx,cy,r,col);g.restore();circle(cx,cy,r+10,'',col);
    v33Fit(d.name,cx,cy+r+22,150,14,col,'center','bold');
    for(let j=0;j<5;j++)diamond(g,cx-50+j*25,cy+r+42,8,j<rank?col:'#3c5449',col);
    buttons.push({x:cx-60,y:cy-60,w:120,h:120,fn:()=>{v34SkillFocus=i;},v33:'focus'+i});
  });
  const i=clamp(v34SkillFocus,0,4),d=skills[i],rank=ranks[i],x=rx,y=ly;
  v42HUDFrame(x,y,rw,lh,d.color);v42HUDSection('CHI TIẾT CÔNG PHÁP',x+17,y+19,rw-34);
  g.save();const gr=g.createRadialGradient(x+rw/2,y+129,4,x+rw/2,y+129,110);gr.addColorStop(0,d.color+'55');gr.addColorStop(1,'#101e1c');g.fillStyle=gr;g.fillRect(x+15,y+36,rw-30,174);circle(x+rw/2,y+124,72,'#142c25',d.color);v11SkillIcon(d.kind,x+rw/2,y+124,65,d.color);g.restore();circle(x+rw/2,y+124,77,'',d.color);
  v42HUDTitle(d.name,x+rw/2,y+232,23,d.color,'center');
  text('Bậc '+rank+'/5 · '+(i===4?'Nội tại liên tục':d.key+' · '+d.cost+' MP · '+d.cd+' giây'),x+rw/2,y+260,14,V42HUD.muted,'center');
  v41HUDLine(x+17,y+282,rw-34);
  v12Wrap(d.desc,x+17,y+307,rw-34,15,V42HUD.paper,22,4);
  v42HUDSection('ĐIỀU KIỆN',x+17,y+407,rw-34);
  text('Cấp yêu cầu '+d.lv+' · '+(p.level<d.lv?'Chưa mở khóa':rank>=5?'Đã đạt tối đa':'Có thể nâng nếu còn điểm'),x+17,y+433,14,p.level<d.lv?V42HUD.red:V42HUD.jade);
  v42HUDButton(x+17,y+470,rw-34,39,'Hoàn lại điểm kỹ năng',()=>v11SkillReset(),'resetSkills');
  const _minus=rank>(i===0?1:0),_plus=p.level>=d.lv&&rank<5&&pts>0;
  v42HUDButton(x+17,y+520,(rw-34)/2-4,36,'−1 Bậc',()=>v11SkillChange(i,-1),'minusDetail',false,_minus);
  v42HUDButton(x+17+(rw-34)/2+4,y+520,(rw-34)/2-4,36,'+1 Bậc',()=>v11SkillChange(i,1),'plusDetail',_plus,_plus);
  text('T / ESC · Đóng  |  +1 điểm mỗi cấp  |  Hoàn điểm miễn phí',34,670,13,V42HUD.muted);
};
// The tracker carries actual quest progress and distance without introducing extra persistent widgets.

// Expedition is available from a contextual map affordance and the feature directory.


const v42HUDDrawerOld=v33Drawer;
v33Drawer=function(){
  v42HUDDrawerOld();
  if(!V33.menu||V33.group!==2||typeof v42OpenWorld!=='function')return;
  const x=22,y=562,w=299,h=37,over=v33Over(x,y,w,h),old=buttons.findIndex(b=>b.v33==='drawer4');
  if(old>=0)buttons.splice(old,1);
  v42HUDFrame(x,y,w,h,over?V42HUD.bright:V42HUD.edge,over);
  v35Icon('map',x+19,y+h/2,12,V42HUD.bronze);
  v33Fit('Đạo ký · Viễn chinh',x+38,y+h/2,w-102,12,V42HUD.paper,'left','bold');
  v41HUDTag(x+w-55,y+8,47,'O',V42HUD.bronze);
  buttons.push({x,y,w,h,fn:()=>{V33.menu=false;v42OpenWorld();},v33:'drawer4'});
};


