'use strict';
// v42_equipment_assets.js
// Original 32 equipment and cultivation book icons, same legacy IDs.
const V42_NEW_EQUIP_ATLASES={"weapons":ASSETS["V42_NEW_EQUIP_ATLASES__weapons"],"divine":ASSETS["V42_NEW_EQUIP_ATLASES__divine"],"gear":ASSETS["V42_NEW_EQUIP_ATLASES__gear"],"books":ASSETS["V42_NEW_EQUIP_ATLASES__books"]};


// v42_equipment_icons.js
// V42 equipment art replaces only the four original 3x3 art sheets. Item index,
// slot, attack, affixes, drops and unlock conditions remain exactly unchanged.
const V42_EQ_ICONS={};
for(const [name,src] of Object.entries(V42_NEW_EQUIP_ATLASES)){
 const rec={ready:false,img:new Image()};V42_EQ_ICONS[name]=rec;rec.img.onload=()=>{rec.ready=true;};rec.img.src=src;
}
const v42GearIconLegacy=gearIcon;
gearIcon=function(d,x,y,size=48){if(!d)return;const a=V42_EQ_ICONS[d.sheet];if(!a?.ready||!Number.isInteger(d.index)||d.index<0||d.index>8||d.index===4)return v42GearIconLegacy(d,x,y,size);const w=a.img.naturalWidth/3,h=a.img.naturalHeight/3;g.save();g.imageSmoothingEnabled=true;g.drawImage(a.img,d.index%3*w,Math.floor(d.index/3)*h,w,h,x,y,size,size);g.restore();};


// v42_material_assets.js
// Nine original high-resolution material icons.
const V42_MATERIAL_ATLAS=ASSETS["V42_MATERIAL_ATLAS"];


// v42_materials.js
// V42 · Linh vật & Sinh hoạt. New illustrated material inventory and workshop,
// backed by V13's actual inventory, recipes, station gates and transaction logic.
const V42MAT={keys:['herb','wood','ore','crystal','seed','elixir','ward','pill','stone'],img:new Image(),loaded:false,qty:1,owner:null,logPage:0};
V42MAT.img.onload=()=>V42MAT.loaded=true;V42MAT.img.src=V42_MATERIAL_ATLAS;
function v42MaterialIcon(k,x,y,size=48){const i=V42MAT.keys.indexOf(k);if(i<0)return false;if(V42MAT.loaded){const w=V42MAT.img.naturalWidth/3,h=V42MAT.img.naturalHeight/3;g.save();g.imageSmoothingEnabled=true;g.drawImage(V42MAT.img,i%3*w,Math.floor(i/3)*h,w,h,x,y,size,size);g.restore();}else circle(x+size/2,y+size/2,size*.28,V13_ITEMS[k]?.[1]||'#e9cc94');return true;}
const V42MATINFO={herb:['Linh thảo','Hồi Xuân Đan, Tụ Linh Đan · hái hoặc trồng'],wood:['Linh mộc','Hộ Thân Phù, mở luống · thu thập'],ore:['Huyền thiết','Luyện khí, linh điền · khai thác'],crystal:['Linh tinh','Luyện đan, hộ phù · khoáng mạch'],seed:['Hạt linh thảo','Gieo trồng ở linh điền'],elixir:['Tụ Linh Đan','U · Hồi 50% linh lực'],ward:['Hộ Thân Phù','Y · Giảm sát thương 8 giây'],pill:['Hồi Xuân Đan','H · Hồi 40% sinh mệnh'],stone:['Linh thạch','Giao dịch và nâng cấp']};
function v42MatCount(k){return k==='stone'?p.stones:k==='pill'?p.pills:v13Inventory(k);}
function v42MatRecipeOut(r){return r.pills?'pill':r.gain?Object.keys(r.gain)[0]:r.plot?'seed':'crystal';}
function v42MatProgress(x,y,w,h,t,c=V42HUD.jade){g.fillStyle='#0d1c17';g.fillRect(x,y,w,h);g.fillStyle=c;g.fillRect(x,y,Math.max(0,Math.min(1,t))*w,h);g.strokeStyle='#6a8470';g.strokeRect(x+.5,y+.5,w-1,h-1);}
function v42MatTrade(k,buy,n){
 n=Math.max(1,Math.min(10,Math.floor(n)));if(!v13Near('market')||!(k in V13_PRICE))return false;
 const cost=(buy?v13BuyPrice(k):V13_PRICE[k])*n;if(buy?p.stones<cost:v13Inventory(k)<n)return false;
 // One real existing transaction per unit. Full quantity is preflighted.
 let done=0;for(let i=0;i<n;i++){if(!v13Trade(k,buy))break;done++;}return done===n;
}
const v42MatOldLife=v13Panel;
v13Panel=function(){
 const s=v13Init(),tab=modal.tab||0;if(tab<0||tab>=V13_TABS.length)return v42MatOldLife();
 if(V42MAT.owner!==p){V42MAT.owner=p;V42MAT.qty=1;V42MAT.logPage=0;}
 v42HUDShell('NHÂN GIAN · SINH HOẠT TU TIÊN','Ngày '+(v13Day()+1)+' · Thu thập, chế tạo, giao dịch và trồng linh dược');
 v42MaterialIcon('stone',780,38,51);text(Math.floor(p.stones).toLocaleString('vi-VN'),835,52,15,V42HUD.bright,'left','bold');text('Linh thạch',835,75,11,V42HUD.muted);
 v42MaterialIcon('pill',1000,38,48);text('×'+p.pills,1050,52,15,V42HUD.bright,'left','bold');text('Hồi xuân',1050,75,11,V42HUD.muted);
 V13_TABS.forEach((t,i)=>v42HUDButton(39+i*172,112,167,44,t,()=>modal.tab=i,'life_tab_'+i,tab===i));
 if(tab===0){
  v42HUDSection('TÚI LINH VẬT',54,189,1170,'7 nguyên liệu · 2 tài sản');
  V42MAT.keys.forEach((k,i)=>{const d=V42MATINFO[k],x=49+i%3*396,y=215+Math.floor(i/3)*132,have=v42MatCount(k),col=V13_ITEMS[k]?.[1]||V42HUD.bright;v42HUDFrame(x,y,383,119,have>0?V42HUD.edge:'#4e5d54');
   v42HUDFrame(x+13,y+13,82,88,col);v42MaterialIcon(k,x+17,y+17,74);v33Fit(d[0],x+111,y+26,205,17,V42HUD.paper,'left','bold');v33Fit('× '+have,x+363,y+29,100,20,col,'right','bold');
   wrapText(d[1],x+111,y+54,251,13,V42HUD.muted,'left',20);if(k in V13_PRICE)text('Giá bán '+V13_PRICE[k]+' ◈ / đơn vị',x+111,y+96,12,V42HUD.jade);
  });
  v42HUDButton(49,625,230,40,'Đến lò đan',()=>v13Route('forge'),'life_forge',false,p.worldMode);v42HUDButton(296,625,230,40,'Đến linh điền',()=>v13Route('farm'),'life_farm',false,p.worldMode);v42HUDButton(543,625,230,40,'Đến Vạn Bảo Sạp',()=>v13Route('market'),'life_market',false,p.worldMode);
  text('Tài nguyên thu được lưu cùng hồ sơ nhân vật.',1224,647,13,V42HUD.muted,'right');
 }else if(tab===1){
  const near=v13Near('forge');v42HUDSection('LÒ ĐAN THANH THẠCH',54,189,1170,near?'Đang đứng cạnh lò':'Cần đến lò đan');if(!near)v42HUDButton(995,168,222,34,'Dẫn đường đến lò đan',()=>v13Route('forge'),'life_guideforge');
  V13_RULES.filter(r=>r.station==='forge').forEach((r,i)=>{const y=216+i*99,ready=v13CanCraft(r);v42HUDFrame(49,y,1182,91,ready?'#8fc9ac':V42HUD.edge,ready);
   const k=v42MatRecipeOut(r);v42MaterialIcon(k,62,y+11,69);v33Fit(r.name,143,y+23,278,17,V42HUD.bright,'left','bold');wrapText(r.desc,143,y+43,282,12,V42HUD.muted,'left',19);
   const costs=Object.entries(r.cost);costs.forEach(([mat,n],j)=>{const x=445+j*132,have=v42MatCount(mat);v42MaterialIcon(mat,x,y+9,47);text(have+'/'+n,x+55,y+25,14,have>=n?V42HUD.jade:V42HUD.red,'left','bold');v33Fit(V42MATINFO[mat][0],x+55,y+48,77,11,V42HUD.muted);});
   v42HUDButton(1000,y+19,212,49,ready?'Chế tạo ngay':near?'Thiếu nguyên liệu':'Chưa đến lò',()=>v13Craft(r.id),'life_recipe_'+r.id,ready,ready);
  });text('Chỉ trừ nguyên liệu sau khi đáp ứng toàn bộ điều kiện.',61,638,13,V42HUD.muted);
 }else if(tab===3){
  const near=v13Near('market');v42HUDSection('VẠN BẢO SẠP',54,189,1170,near?'Đang đứng tại sạp':'Cần đến sạp');
  text('Số lượng mỗi giao dịch',55,219,11,V42HUD.muted);[1,5,10].forEach((n,i)=>v42HUDButton(205+i*65,204,59,31,'×'+n,()=>V42MAT.qty=n,'life_qty_'+n,V42MAT.qty===n));if(!near)v42HUDButton(981,204,236,31,'Dẫn đường đến Vạn Bảo Sạp',()=>v13Route('market'),'life_guidemarket');
  const qty=V42MAT.qty;Object.entries(V13_ITEMS).forEach(([k,d],i)=>{const y=246+i*56,have=s.bag[k],buy=v13BuyPrice(k)*qty,sell=V13_PRICE[k]*qty;v42HUDFrame(49,y,1182,51,V42HUD.edge);v42MaterialIcon(k,57,y+3,45);text(d[0],113,y+25,15,d[1],'left','bold');text('Có '+have,359,y+25,14,V42HUD.paper);text('Giá mua '+buy+' ◈',551,y+25,14,V42HUD.bright);text('Giá bán '+sell+' ◈',739,y+25,14,V42HUD.jade);
   v42HUDButton(918,y+6,139,39,'Mua '+qty,()=>v42MatTrade(k,true,qty),'life_buy_'+k,near&&p.stones>=buy,near&&p.stones>=buy);v42HUDButton(1066,y+6,149,39,'Bán '+qty,()=>v42MatTrade(k,false,qty),'life_sell_'+k,false,near&&have>=qty);
  });text('Giá giao dịch phản ánh hảo cảm hiện tại. Giao dịch đủ số lượng hoặc không thực hiện.',58,658,13,V42HUD.muted);
 }else if(tab===2){
  const near=v13Near('farm');v42HUDSection('LINH ĐIỀN · VƯỜN LINH DƯỢC',54,189,1170,s.plots.length+'/4 luống đã mở');if(!near)v42HUDButton(1000,168,217,34,'Dẫn đường đến linh điền',()=>v13Route('farm'),'life_guidefarm');
  for(let i=0;i<4;i++){const x=49+i%2*598,y=215+Math.floor(i/2)*167,a=s.plots[i],locked=i>=s.plots.length,ready=!!a?.wet&&a.ready<=v13Clock(),t=a?.wet?clamp(1-(a.ready-v13Clock())/30,0,1):0;
   v42HUDFrame(x,y,584,155,ready?V42HUD.jade:V42HUD.edge,ready);v42HUDFrame(x+14,y+15,116,124,ready?V42HUD.jade:V42HUD.edge);
   v42MaterialIcon(locked?'stone':!a?'seed':'herb',x+29,y+30,86);
   v42HUDTitle('Luống '+(i+1),x+148,y+26,17);text(locked?'Chưa mở':!a?'Đất trống':!a.wet?'Đã gieo · chờ tưới':ready?'Linh thảo đã chín':'Đang sinh trưởng',x+149,y+53,14,ready?V42HUD.jade:V42HUD.muted,'left','bold');
   if(a?.wet){v42MatProgress(x+149,y+75,230,10,t);text(ready?'Thu hoạch +3 linh thảo, +1 hạt':'Còn '+Math.max(1,Math.ceil(a.ready-v13Clock()))+' giây chơi',x+149,y+103,12,V42HUD.muted);}
   else text(locked?'Cần mở thêm một luống':!a?'Tốn 1 hạt giống · đang có '+s.bag.seed:'Tưới xong cần 30 giây chơi',x+149,y+79,13,V42HUD.muted);
   if(!locked){const can=near&&(!a&&s.bag.seed>0||!!a&&!a.wet||ready);v42HUDButton(x+397,y+103,172,42,!a?'Gieo hạt':ready?'Thu hoạch':a.wet?'Đang lớn':'Tưới nước',()=>v13Farm(i),'life_plot_'+i,ready,can);}
  }
  const r=V13_RULES.find(q=>q.id==='plot'),can=v13CanCraft(r);v42HUDFrame(49,553,1182,95,V42HUD.edge);v42HUDTitle('MỞ RỘNG LINH ĐIỀN',64,576,16);text('Mỗi lần mở thêm 1 luống, tối đa 4.',64,608,12,V42HUD.muted);Object.entries({...r.cost,stone:r.stones}).forEach(([k,n],i)=>{const x=420+i*148;v42MaterialIcon(k,x,570,48);text(v42MatCount(k)+'/'+n,x+52,592,13,v42MatCount(k)>=n?V42HUD.jade:V42HUD.red,'left','bold');});v42HUDButton(1000,575,212,50,s.plots.length>=4?'Đã mở tối đa':'Mở thêm luống',()=>v13Craft('plot'),'life_expandplot',can,can);
 }else if(tab===4){
  const near=v13Near('board');v42HUDSection('ỦY THÁC · NGÀY '+(v13Day()+1),54,189,1170,near?'Đang ở bảng ủy thác':'Nhận và báo cáo tại bảng');if(!near)v42HUDButton(1000,168,217,34,'Đến bảng ủy thác',()=>v13Route('board'),'life_guideboard');
  V13_JOBS.forEach((d,i)=>{const y=216+i*132,j=v13JobState(d),n=v13JobProgress(d),done=j.state==='done',off=j.state==='offered',ready=!off&&!done&&n>=d.need,can=near&&(off||ready);v42HUDFrame(49,y,1182,122,done||ready?V42HUD.jade:V42HUD.edge,ready);
   v42MaterialIcon(d.kind==='carry'?d.item:'stone',64,y+24,76);v42HUDTitle(d.name,148,y+25,18);v33Fit(d.desc,148,y+49,470,14,V42HUD.muted);text('Thưởng '+d.reward+' linh thạch · +18 tu vi',148,y+91,13,V42HUD.jade,'left','bold');
   text(done?'ĐÃ HOÀN THÀNH':off?'CHƯA NHẬN':ready?'CÓ THỂ BÁO CÁO':'ĐANG THỰC HIỆN',662,y+29,13,done||ready?V42HUD.jade:V42HUD.muted,'left','bold');v42MatProgress(660,y+52,270,14,done?1:Math.min(1,n/d.need));text(done?d.need+'/'+d.need:Math.min(n,d.need)+'/'+d.need,660,y+82,14,V42HUD.paper);
   v42HUDButton(972,y+19,238,44,done?'Đã nhận thưởng':off?'Nhận ủy thác':ready?'Báo cáo nhận thưởng':'Chưa đủ tiến độ',()=>v13JobAction(d.id),'life_job_'+d.id,ready,can);if(!done)v42HUDButton(972,y+66,238,44,'Dẫn đường',()=>v13JobGuide(d),'life_jobguide_'+d.id);
  });text('Ủy thác làm mới khi sang ngày. Phần thưởng chỉ nhận một lần.',58,655,13,V42HUD.muted);
 }else if(tab===5){
  const count=s.log.length,pages=Math.max(1,Math.ceil(count/10));V42MAT.logPage=clamp(V42MAT.logPage,0,pages-1);v42HUDSection('NHẬT KÝ SINH HOẠT',54,189,1170,count+' hoạt động gần nhất');
  if(!count){v42HUDFrame(49,215,1182,215);v42HUDTitle('Hành trình của đạo hữu mới bắt đầu',640,290,22,V42HUD.jade,'center');text('Hoạt động thực tế sẽ tự được ghi lại tại đây.',640,330,14,V42HUD.muted,'center');}
  s.log.slice(V42MAT.logPage*10,V42MAT.logPage*10+10).forEach((r,i)=>{const y=215+i*41;v42HUDFrame(49,y,1182,36);text('Ngày '+r.day,68,y+18,13,V42HUD.jade,'left','bold');v33Fit(r.line,200,y+18,985,14,V42HUD.paper);});v42HUDButton(465,638,150,36,'‹ Trang trước',()=>V42MAT.logPage--,'life_prevlog',false,V42MAT.logPage>0);text((V42MAT.logPage+1)+'/'+pages,640,656,13,V42HUD.paper,'center');v42HUDButton(665,638,150,36,'Trang sau ›',()=>V42MAT.logPage++,'life_nextlog',false,V42MAT.logPage<pages-1);
 }else{
  const near=v13Near('forge');modal.a??=0;modal.b??=1;modal.product??=0;const a=V13_MATS[modal.a],b=V13_MATS[modal.b],key=V13_PRODUCTS[modal.product],draft=v13Draft(a,b,key),known=s.formulas||[];
  v42HUDSection('TỰ PHỐI PHƯƠNG',54,189,1170,known.length+'/4 công thức');if(!near)v42HUDButton(1000,168,217,34,'Dẫn đường đến lò đan',()=>v13Route('forge'),'life_guideformula');
  const selectors=[['Chủ dược ×2',a,()=>modal.a=(modal.a+1)%4],['Phụ dược ×1',b,()=>modal.b=(modal.b+1)%4],['Sản phẩm',key==='heal'?'pill':key,()=>modal.product=(modal.product+1)%3]];
  selectors.forEach(([l,k,fn],i)=>{const x=49+i*396;v42HUDFrame(x,215,383,108);v42MaterialIcon(k,x+14,230,70);text(l,x+102,239,11,V42HUD.muted);v42HUDButton(x+96,257,268,45,V42MATINFO[k][0]+' ›',fn,'life_formula_select_'+i);});
  const can=!!draft&&near&&p.stones>=3&&known.length<4;v42HUDFrame(49,335,1182,78,draft?V42HUD.jade:V42HUD.edge);v33Fit(draft?draft.name:'Không hợp lệ · hai loại khác nhau, đủ giá trị, chưa trùng công thức',66,355,805,16,draft?V42HUD.jade:V42HUD.red,'left','bold');text(draft?v13Cost(draft)+' · Phí nghiên cứu 3 linh thạch':'Thay nguyên liệu hoặc sản phẩm để thử lại.',66,386,13,V42HUD.muted);v42HUDButton(978,351,236,46,'Nghiên cứu công thức',()=>v13Register(a,b,key),'life_formula_register',can,can);
  known.forEach((r,i)=>{const y=425+i*54,can=v13CanCraft(r);v42HUDFrame(49,y,1182,48);v42MaterialIcon(v42MatRecipeOut(r),61,y+4,40);v33Fit(r.name,111,y+16,423,14,V42HUD.paper,'left','bold');v33Fit(v13Cost(r),111,y+33,710,12,V42HUD.muted);v42HUDButton(1034,y+6,180,36,can?'Chế tạo':'Thiếu điều kiện',()=>v13Craft(r.id),'life_formula_craft_'+i,can,can);});
  text('Tự phối phương chỉ tạo quy tắc công thức có sẵn; không chạy mã tùy ý.',58,668,13,V42HUD.muted);
 }
};


// v42_world.js
// V42 – Sơn Hà Ký. Saved regional expeditions, genuine encounters, waystones,
// progression milestones and a discoverable atlas. Additive; V41 saves remain valid.
const V42_WORLD={owner:null,seed:null,day:-1,region:null,tick:0,dirty:true,tab:0,focus:null,note:'',pois:[],activeCount:0};
const V42_LORE={
 thon:['Thanh Thạch dịch trạm','Nơi người đi xa trở về, dưới mái ngói cũ và ngọn đèn không tắt.','herb','Mộc'],
 truc:['Trúc âm cổ đạo','Tiếng gió qua rừng trúc tựa tiếng kiếm ngân; linh thú giữ một lời thề cổ xưa.','wood','Mộc'],
 yeu:['Vạn Yêu thạch trận','Vết tích một trận chiến đập vỡ sơn hà, còn linh quang trong từng thớ đá.','ore','Kim'],
 tram:['Hắc Trạch linh đài','Dưới mặt nước đen là những luồng linh khí đang ngủ say.','herb','Thủy'],
 tuyet:['Tuyết sơn băng tâm','Đỉnh tuyết lưu giữ lời truyền của những người vượt qua mùa đông vĩnh cửu.','crystal','Thủy'],
 hoa:['Xích Viêm cổ lô','Ngọn lửa trong lòng đất là di sản của những luyện khí sư cuối cùng.','ore','Hỏa'],
 phong:['Thiên Phong vọng đài','Gió luân chuyển như kiếm trận, chỉ người tĩnh tâm mới nghe được hướng đi.','wood','Mộc'],
 quy:['U Minh minh giới','Linh hồn chưa siêu thoát tụ lại quanh cổ mộ, đợi một người giải thế cục.','crystal','Thổ'],
 ma:['Ma Vực phong ấn','Cổ trận giữ ranh giới chính tà, mỗi vết nứt ẩn chứa một mảnh pháp tắc.','crystal','Hỏa'],
 loi:['Tử Lôi thiên trụ','Lôi đình thử thách ý chí, nơi dấu chân tiền nhân đã được khắc vào đá.','ore','Kim']
};
const V42_ELEMENTS=['Kim','Mộc','Thủy','Hỏa','Thổ'];
const V42_ELEMENT_CLUES={Kim:'Tiếng kim loại ngân vang, sắc trắng như kiếm quang.',Mộc:'Mầm xanh xuyên đá, hơi thở của sinh trưởng.',Thủy:'Dòng chảy đổi hình, lạnh và mềm nhưng không ngừng.',Hỏa:'Ánh đỏ bùng lên, nhiệt và tro tàn quấn quanh.',Thổ:'Vững như núi, nặng như đất, giữ mọi vật đứng yên.'};
const V42_TIERS=['Vô danh','Hữu duyên','Được tin cậy','Hộ đạo','Truyền kỳ'];
function v42wInt(n,min,max,d=0){return Number.isFinite(n)?clamp(Math.floor(n),min,max):d;}
function v42wPlain(x){return x&&typeof x==='object'&&!Array.isArray(x);}
function v42wState(){
 if(!p)return null;
 if(!v42wPlain(p.v42world)||p.v42world.version!==1)p.v42world={version:1,stones:{},events:{},rep:{},history:[],milestones:{},total:0,tracked:null};
 const s=p.v42world;
 for(const k of ['stones','events','rep','milestones'])if(!v42wPlain(s[k]))s[k]={};
 if(!Array.isArray(s.history))s.history=[];
 return s;
}
function v42wMigrate(){const s=v42wState();if(!s)return;const allowed=['offered','hunt','ready','done','expired'];for(const id of Object.keys(s.events)){const e=s.events[id];if(!V42_LORE[id]||!v42wPlain(e)||!allowed.includes(e.status)||!Number.isFinite(e.day)||!Number.isFinite(e.x)||!Number.isFinite(e.y)||!['shrine','supply','hunt'].includes(e.kind)||!Number.isFinite(e.goal)||e.goal<1||e.goal>5)delete s.events[id];else{e.count=v42wInt(e.count,0,e.goal);e.attempts=v42wInt(e.attempts,0,3);}}for(const id of Object.keys(s.stones))if(!V42_LORE[id]||s.stones[id]!==true)delete s.stones[id];for(const id of Object.keys(s.rep))if(!V42_LORE[id])delete s.rep[id];else s.rep[id]=v42wInt(s.rep[id],0,1000);s.total=v42wInt(s.total,0,1000000);s.history=s.history.filter(a=>v42wPlain(a)&&typeof a.line==='string').slice(0,40).map(a=>({day:v42wInt(a.day,1,1000000,1),line:a.line.slice(0,180),region:V42_LORE[a.region]?a.region:'thon'}));if(!V42_LORE[s.tracked])s.tracked=null;V42_WORLD.owner=p;V42_WORLD.seed=seed;V42_WORLD.dirty=true;V42_WORLD.day=-1;V42_WORLD.region=null;}
function v42wDay(){return Math.max(0,Math.floor((p?.worldTime||0)/360));}
function v42wExterior(){return !!p?.worldMode&&!v36Inside()&&mode==='play';}
function v42wName(id){return REG[id]?.name||'Chưa rõ';}
function v42wLog(id,line){const s=v42wState();s.history.unshift({day:v42wDay()+1,line,region:id});s.history=s.history.slice(0,40);}
function v42wRep(id,n){const s=v42wState();s.rep[id]=clamp((s.rep[id]||0)+n,0,1000);}
function v42wTier(id){const n=v42wState().rep[id]||0;return V42_TIERS[n>=200?4:n>=100?3:n>=35?2:n>=10?1:0];}
function v42wWithin(o,n=95){return v42wExterior()&&!!o&&dist(p,o)<=n;}
function v42wHash(id,n,salt){return hashOW(REG[id].x+n*17,REG[id].y+n*31,salt+(seed%8191));}
function v42wPoint(id,salt,origin=null,min=250,max=470,radius=22){
 const r=REG[id];if(!r)return null;const a0=v42wHash(id,salt,421)*TAU,root=origin||r;
 for(let i=0;i<108;i++){
   const a=a0+i*2.39996323,rr=min+(max-min)*((i*19%53)/52),x=Math.round(root.x+Math.cos(a)*rr),y=Math.round(root.y+Math.sin(a)*rr);
   if(x<40||y<40||x>OW.w-40||y>OW.h-40||regionAt(x,y).id!==id||owBlocked(x,y,radius))continue;
   if(OW_POI.some(o=>!o.id.startsWith('v42_')&&dist(o,{x,y})<105))continue;
   if(V42_WORLD.pois.some(o=>dist(o,{x,y})<100))continue;
   if(![0,1,2,3].some(k=>!owBlocked(x+Math.cos(k*Math.PI/2)*55,y+Math.sin(k*Math.PI/2)*55,15)))continue;
   return {x,y};
 }
 return null;
}
function v42wWaystone(id){return V42_WORLD.pois.find(o=>o.id==='v42_way_'+id);}
function v42wEventPOI(id){return V42_WORLD.pois.find(o=>o.id==='v42_event_'+id);}
function v42wKey(e){return e.region+':'+e.day+':'+e.kind;}
function v42wGenerate(id,day){
 const lore=V42_LORE[id],i=V22_REG[id].i,kind=(id==='thon'?['supply','shrine']:['shrine','hunt','supply'])[(day+i)% (id==='thon'?2:3)];
 const q=v42wPoint(id,day+400+i*19,null,id==='thon'?330:245,520,24);if(!q)return null;
 const names={shrine:'Cổ trận thất truyền',hunt:'Yêu khí dị động',supply:'Tiếp tế lữ nhân'};
 return {...q,region:id,day,kind,name:names[kind],goal:kind==='hunt'?3:kind==='supply'?2+Math.floor(i/3):1,count:0,attempts:0,status:'offered',expires:0,item:lore[2],element:lore[3],reward:kind==='hunt'?18+i*4:kind==='supply'?14+i*4:10+i*3,xp:kind==='hunt'?32+i*10:18+i*8};
}
function v42wRefresh(force=false){
 if(!p?.worldMode||mode!=='play')return;
 const s=v42wState(),day=v42wDay(),id=p.mapId;
 if(V42_WORLD.owner!==p||V42_WORLD.seed!==seed){v42wMigrate();force=true;}
 if(!force&&!V42_WORLD.dirty&&V42_WORLD.day===day&&V42_WORLD.region===id)return;
 for(let i=OW_POI.length-1;i>=0;i--)if(OW_POI[i].id.startsWith('v42_'))OW_POI.splice(i,1);
 V42_WORLD.pois=[];V42_WORLD.day=day;V42_WORLD.region=id;V42_WORLD.dirty=false;
 for(const id of V22_ORDER){const lore=V42_LORE[id],q=v42wPoint(id,42,null,id==='thon'?345:220,470,22);if(q){const o={id:'v42_way_'+id,kind:'v42way',type:'way',name:lore[0],region:id,...q};V42_WORLD.pois.push(o);OW_POI.push(o);}}
 for(const id of V22_ORDER){const discovered=p.discovered?.includes(id);if(!discovered)continue;let e=s.events[id];
  if(e&&(e.status==='hunt'||e.status==='ready')&&e.expires>0&&(p.worldTime||0)>=e.expires){e.status='expired';v42wLog(id,'Kỳ ngộ đã tan biến: '+e.name);}
  if(!e||((e.status==='offered'||e.status==='done'||e.status==='expired')&&e.day!==day))e=s.events[id]=v42wGenerate(id,day);
  if(!e||e.status==='done'||e.status==='expired')continue;
  if(owBlocked(e.x,e.y,20)||regionAt(e.x,e.y).id!==id){const q=v42wPoint(id,e.day+400+V22_REG[id].i*19);if(!q)continue;Object.assign(e,q);}
  const o={id:'v42_event_'+id,kind:'v42event',type:e.kind,name:e.name,region:id,x:e.x,y:e.y};V42_WORLD.pois.push(o);OW_POI.push(o);
 }
 V42_WORLD.activeCount=Object.values(s.events).filter(e=>e?.status==='hunt'||e?.status==='ready').length;
 for(const e of enemies)if(e.v42Event&&!e.dead){const a=s.events[e.region];if(!a||a.status!=='hunt'||v42wKey(a)!==e.v42Event)e.dead=true;}
}
function v42wNotice(s){V42_WORLD.note=s;v21Say(s);}
function v42wClose(){modal=null;V42_WORLD.note='';}
function v42OpenWorld(tab=0,id=p?.mapId){if(!p||mode!=='play'){return false;}if(!p.worldMode){message('Sơn Hà Ký chỉ mở ngoài bí cảnh.');return false;}v42wRefresh();V42_WORLD.tab=clamp(tab,0,3);V42_WORLD.focus=V42_LORE[id]?id:'thon';V42_WORLD.note='';v8Cancel();modal={kind:'v42world'};return true;}
function v42wGuide(o){if(!o||!p?.worldMode)return false;modal=null;v8SetGoal(o,{type:'poi',id:o.id});return true;}
function v42wCanInteract(id){return p.level>=V22_REG[id].min;}
function v42wActivate(id){const a=v42wWaystone(id),s=v42wState();if(!v42wWithin(a,115)||!v42wCanInteract(id)||s.stones[id])return false;s.stones[id]=true;v42wRep(id,10);const xp=12+V22_REG[id].i*4;gainXP(xp);v42wLog(id,'Khai mở '+V42_LORE[id][0]);v42wNotice('Khai mở linh đài · +'+xp+' tu vi · +10 danh vọng');effect(p.x,p.y,'#a7eadd','ring',.7,{radius:60});save();return true;}
function v42wFightNearby(){return enemies.some(e=>!e.dead&&dist(e,p)<235&&['chase','wind','attack','recover'].includes(e.state));}
function v42wTravelCost(dst){return 5+2*V22_REG[dst].i;}
function v42wCurrentWay(){return V42_WORLD.pois.find(o=>o.kind==='v42way'&&v42wState().stones[o.region]&&v42wWithin(o,115));}
function v42wTravel(dst){
 const s=v42wState(),a=v42wCurrentWay(),b=v42wWaystone(dst),cost=V42_REG_SAFE(dst)?v42wTravelCost(dst):Infinity;
 if(!a||!b||!s.stones[dst]||a.region===dst||!v42wCanInteract(dst)||p.stones<cost||v42wFightNearby()||owBlocked(b.x,b.y,18))return false;
 p.stones-=cost;v8Cancel();V8.vx=V8.vy=0;p.x=b.x;p.y=b.y;p.dashT=p.attackT=p.castT=0;p.hurt=0;bolts=[];fx=[];numbers=[];owCamera={x:clamp(p.x-W/2,0,OW.w-W),y:clamp(p.y-H/2,0,OW.h-H)};modal=null;owDiscover();V42_WORLD.dirty=true;v42wLog(dst,'Truyền tống từ '+v42wName(a.region)+' tới '+v42wName(dst));v42wNotice('Linh đài chuyển dời · '+v42wName(dst));effect(p.x,p.y,'#a5f3d5','ring',.85,{radius:75});save();return true;
}
function V42_REG_SAFE(id){return Object.prototype.hasOwnProperty.call(V22_REG,id);}
function v42wEvent(id){return v42wState()?.events[id]||null;}
function v42wEventNear(id){return v42wWithin(v42wEventPOI(id),115)&&v42wCanInteract(id);}
function v42wComplete(e){
 if(!e||e.status==='done'||e.status==='expired'||!v42wEventNear(e.region))return false;
 if(e.kind==='hunt'&&e.count<e.goal)return false;
 if(e.kind==='supply'){if(v13Inventory(e.item)<e.goal||!v13Adjust(e.item,-e.goal))return false;}
 e.status='done';e.count=e.goal;const s=v42wState();s.total++;p.stones+=e.reward;gainXP(e.xp);v42wRep(e.region,e.kind==='hunt'?18:12);if(e.kind==='hunt')p.pills++;
 v42wLog(e.region,'Hoàn thành '+e.name+' · '+e.reward+' linh thạch');if(s.tracked===e.region)s.tracked=null;V42_WORLD.dirty=true;v42wNotice('Kỳ ngộ hoàn thành · +'+e.reward+' linh thạch · +'+e.xp+' tu vi');effect(e.x,e.y,'#ffdda4','ring',.8,{radius:64});save();return true;
}
function v42wSolve(id,element){const e=v42wEvent(id);if(!e||e.kind!=='shrine'||e.status!=='offered'||!v42wEventNear(id)||!V42_ELEMENTS.includes(element))return false;if(element===e.element)return v42wComplete(e);e.attempts++;if(e.attempts>=3){e.status='expired';V42_WORLD.dirty=true;v42wLog(id,'Cổ trận khép lại sau ba lần giải sai');v42wNotice('Cổ trận đã khép lại.');}else v42wNotice('Linh khí chưa hòa hợp · còn '+(3-e.attempts)+' lần thử');save();return false;}
function v42wHuntStart(id){
 const e=v42wEvent(id),r=REG[id];if(!e||e.kind!=='hunt'||e.status!=='offered'||!v42wEventNear(id)||id==='thon'||!r.pool.length)return false;
 const placed=[];for(let i=0;i<90&&placed.length<e.goal;i++){const a=(i*2.39996323)+v42wHash(id,e.day,123)*TAU,rr=125+(i%13)*8,x=Math.round(e.x+Math.cos(a)*rr),y=Math.round(e.y+Math.sin(a)*rr);if(regionAt(x,y).id===id&&!owBlocked(x,y,22)&&dist({x,y},p)>85&&!placed.some(q=>dist(q,{x,y})<75)&&!enemies.some(q=>!q.dead&&dist(q,{x,y})<50))placed.push({x,y});}
 if(placed.length<e.goal){v42wNotice('Yêu khí bất ổn · hãy thử lại sau.');return false;}
 const spawned=[];for(let i=0;i<placed.length;i++){const q=placed[i],n=enemies.length;owSpawn(r.pool[(i+e.day)%r.pool.length],q.x,q.y);if(enemies.length>n){const mob=enemies.at(-1);mob.v42Event=v42wKey(e);mob.v42EventSlot=i;mob.state='patrol';mob.homeX=q.x;mob.homeY=q.y;spawned.push(mob);}}
 if(spawned.length!==e.goal){for(const a of spawned)a.dead=true;v42wNotice('Yêu khí bất ổn · chưa mở trận.');return false;}
 e.status='hunt';e.expires=(p.worldTime||0)+260;e.count=0;v42wState().tracked=id;V42_WORLD.activeCount++;v42wLog(id,'Mở kỳ ngộ '+e.name);modal=null;v42wNotice('Trừ '+e.goal+' yêu thú kỳ ngộ, sau đó trở lại linh đài');save();return true;
}
function v42wRewardMilestone(k){const s=v42wState(),d=V42_MILESTONES.find(x=>x.id===k);if(!d||s.milestones[k]||d.count(s)<d.need)return false;s.milestones[k]=true;p.stones+=d.reward;gainXP(d.xp);v42wLog('thon','Đạt thiên mệnh '+d.name);v42wNotice('Thành tựu · '+d.name+' · +'+d.reward+' linh thạch');save();return true;}
const V42_MILESTONES=[{id:'walk1',name:'Bước đầu hành đạo',need:1,count:s=>Object.keys(s.stones).length,reward:8,xp:12},{id:'walk3',name:'Tiểu hành giả',need:3,count:s=>Object.keys(s.stones).length,reward:24,xp:30},{id:'walk6',name:'Sơn hà tri kỷ',need:6,count:s=>Object.keys(s.stones).length,reward:55,xp:70},{id:'walk10',name:'Vạn vực hành giả',need:10,count:s=>Object.keys(s.stones).length,reward:130,xp:140},{id:'event3',name:'Hữu duyên nhân',need:3,count:s=>s.total,reward:25,xp:35},{id:'event12',name:'Hộ đạo sơn hà',need:12,count:s=>s.total,reward:70,xp:90}];

// Integrate through existing pathfinding, exact normal combat pipeline and saving.
const v42wPrevStart=start;start=function(...a){v42wPrevStart(...a);v42wMigrate();v42wRefresh(true);save();};
const v42wPrevResume=resume;resume=function(...a){v42wPrevResume(...a);if(p&&mode==='play'){v42wMigrate();v42wRefresh(true);save();}};
const v42wPrevDiscover=owDiscover;owDiscover=function(){const prior=p?.discovered?.length;v42wPrevDiscover();if(prior!==p?.discovered?.length)V42_WORLD.dirty=true;};
const v42wPrevInteract=v8InteractAt;v8InteractAt=function(o){if(o?.kind==='v42way'&&v42wWithin(o,115)){if(!v42wState().stones[o.region])v42wActivate(o.region);return v42OpenWorld(1,o.region);}if(o?.kind==='v42event'&&v42wWithin(o,115))return v42OpenWorld(0,o.region);return v42wPrevInteract(o);};
const v42wPrevOw=owInteract;owInteract=function(){const o=owNearest();if(o?.kind==='v42way'||o?.kind==='v42event'){v8Cancel();V8.vx=V8.vy=0;return v8InteractAt(o);}return v42wPrevOw();};
const v42wPrevDeath=v21DeathLoot;v21DeathLoot=function(e,stats){v42wPrevDeath(e,stats);if(e.v42Event){const a=v42wEvent(e.region);if(a?.status==='hunt'&&v42wKey(a)===e.v42Event&&!e.v42EventCredited){e.v42EventCredited=true;a.count=Math.min(a.goal,a.count+1);if(a.count===a.goal){a.status='ready';a.expires=0;v42wNotice('Trận đã phá · trở lại điểm kỳ ngộ nhận thưởng');}else v42wNotice('Yêu thú kỳ ngộ '+a.count+'/'+a.goal);save();}}};
const v42wPrevUpdate=update;update=function(dt){
 if(p&&mode==='play'){
  if(pressed.KeyO){delete pressed.KeyO;if(modal?.kind==='v42world')v42wClose();else if(!modal)v42OpenWorld();}
  if(modal?.kind==='v42world'&&pressed.Escape){delete pressed.Escape;v42wClose();}
 }
 const result=v42wPrevUpdate(dt);
 if(!p||mode!=='play'||!p.worldMode)return result;
 V42_WORLD.tick+=dt;if(V42_WORLD.tick>=.45){V42_WORLD.tick=0;const s=v42wState();if(Object.values(s.events).some(e=>e?.status==='hunt'&&e.expires>0&&e.expires<=(p.worldTime||0)))V42_WORLD.dirty=true;v42wRefresh();}
 return result;
};

// Physical world markers are quiet, distinct objects; they do not obscure paths.
function v42wPoly(ctx,pts,fill,stroke){ctx.beginPath();ctx.moveTo(...pts[0]);for(const q of pts.slice(1))ctx.lineTo(...q);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}}
const v42wPrevPOI=hdDrawPOI;hdDrawPOI=function(o,z){
 if(o.kind!=='v42way'&&o.kind!=='v42event')return v42wPrevPOI(o,z);
 const s=v42wState(),active=o.kind==='v42way'?s.stones[o.region]:v42wEvent(o.region)?.status==='ready',col=o.kind==='v42way'?(active?'#98e4d7':'#a9ac96'):o.type==='hunt'?'#f3a886':o.type==='shrine'?'#c8b7f0':'#e9cf91',pulse=.5+.5*Math.sin(elapsed*2.5);
 g.save();g.translate(z.x,z.y);hdEllipse(g,0,2,31,11,'#111e1d85');
 if(o.kind==='v42way'){
  v42wPoly(g,[[-27,3],[0,-8],[27,3],[0,13]],'#6c7768','#324b45');v42wPoly(g,[[-22,-5],[0,-14],[22,-5],[0,4]],'#9caa92','#d2caa2');
  v42wPoly(g,[[-9,-8],[-9,-62],[0,-68],[0,-3]],'#748f7a','#486c61');v42wPoly(g,[[0,-3],[0,-68],[9,-61],[9,-8]],'#456e66','#9fbbae');
  v42wPoly(g,[[-13,-62],[0,-76],[13,-62],[0,-56]],active?'#a9e6d4':'#d1cf9d','#e9d9b5');g.fillStyle='#e5dd9655';g.fillRect(-3,-56,2,43);if(active){g.shadowColor=col;g.shadowBlur=8;diamond(g,0,-70,6,col);}
 }else{
  seal(g,0,-2,24,col,elapsed*.13,.5+pulse*.25);g.shadowColor=col;g.shadowBlur=8;diamond(g,0,-34+Math.sin(elapsed*2)*3,9,col);g.shadowBlur=0;
  if(o.type==='hunt'){g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(-11,-25);g.lineTo(10,-43);g.moveTo(-9,-43);g.lineTo(10,-25);g.stroke();}
 }
 g.restore();
 if(!(typeof V42_PHOTO!=='undefined'&&V42_PHOTO.active)&&(dist(o,p)<245||s.tracked===o.region&&o.kind==='v42event')){const near=dist(o,p)<115;g.save();g.fillStyle='#071f25df';const w=o.kind==='v42way'?174:157,xx=z.x-w/2,yy=z.y-(o.kind==='v42way'?97:65);g.fillRect(xx,yy,w,19);g.strokeStyle=col+'88';g.strokeRect(xx+.5,yy+.5,w-1,18);text(near?'E · '+o.name:o.name,z.x,yy+10,10,col,'center','bold');g.restore();}
};
const v42wPrevMonster=hdMonster;hdMonster=function(e,z){v42wPrevMonster(e,z);if(e.v42Event&&!e.dead&&dist(p,e)<440){g.save();diamond(g,z.x,z.y-91,5,'#f5cd8e');g.restore();}};

// Shared journal screen, scaled to the actual 1280×720 logical canvas.
const V42_WC={gold:'#d5bf8d',paper:'#ede9d7',muted:'#9eb6ac',jade:'#a1d9bb',amber:'#f2be8b',ink:'#0c2328',line:'#496a65'};
function v42wFrame(x,y,w,h,active=false){v41PFrame(x,y,w,h,active);}
function v42wText(t,x,y,sz=13,col=V42_WC.paper,a='left',bold=false){v41PText(String(t),x,y,sz,col,a,'sans',bold?'bold':'normal');}
function v42wButton(x,y,w,h,label,fn,ok=true,active=false){v42wFrame(x,y,w,h,active||ok&&v21Over(x,y,w,h));v42wText(label,x+w/2,y+h/2,12,ok?V42_WC.paper:'#536c69','center',true);if(ok)buttons.push({x,y,w,h,fn:()=>{v41Sound('click');fn();}});}
function v42wRule(x,y,w){v41PLine(x,y,w,.32);}
function v42wBar(x,y,w,h,n,max,col){g.fillStyle='#071a1e';g.fillRect(x,y,w,h);g.fillStyle=col;g.fillRect(x,y,w*clamp(n/Math.max(1,max),0,1),h);g.strokeStyle='#54726b';g.strokeRect(x+.5,y+.5,w-1,h-1);}
function v42wTab(i){V42_WORLD.tab=i;V42_WORLD.note='';}
function v42wRegionList(){const s=v42wState();v42wFrame(57,150,305,490);v42wText('CỬU VỰC · KHAI PHÁ',76,175,12,V42_WC.gold,'left',true);for(const [i,id] of V22_ORDER.entries()){const y=194+i*43,sel=V42_WORLD.focus===id,seen=p.discovered.includes(id),r=V22_REG[id];v42wFrame(69,y,281,38,sel);diamond(g,86,y+19,5,s.stones[id]?V42_WC.jade:seen?r.color:'#536762');v42wText(seen?v42wName(id):'Vùng chưa khám phá',102,y+13,12,seen?r.color:'#78918b','left',true);v42wText('Lv '+r.min+(r.min===r.max?'':'–'+r.max)+(s.stones[id]?' · Đã khai mở':''),102,y+27,10,V42_WC.muted);v42wText(i+1,331,y+18,11,V42_WC.gold,'right');buttons.push({x:69,y,w:281,h:38,fn:()=>{V42_WORLD.focus=id;V42_WORLD.note='';}});}}
function v42wEventPanel(id){
 const s=v42wState(),seen=p.discovered.includes(id),e=v42wEvent(id),o=v42wEventPOI(id),d=V22_REG[id];
 v42wFrame(376,150,847,490);v41PText(seen?v42wName(id):'Vùng đất bí ẩn',404,178,27,seen?d.color:V42_WC.muted,'left','serif','bold');v42wText('Danh vọng · '+v42wTier(id)+'  /  '+(s.rep[id]||0),1197,178,12,V42_WC.gold,'right');v42wRule(403,203,794);
 if(!seen){wrapText('Chưa từng đặt chân đến vùng này. Khám phá bản đồ thế giới để mở kỳ ngộ và linh đài khu vực.',407,250,730,15,V42_WC.muted,'left',22);v42wButton(404,310,235,42,'Mở bản đồ thế giới',()=>{modal={kind:'map',v16Map:'world'};});return;}
 if(!e){v42wText('Chưa có kỳ ngộ. Hãy trở lại sau.',406,238,15,V42_WC.muted);return;}
 const title=e.kind==='shrine'?'Lĩnh ngộ ngũ hành':e.kind==='hunt'?'Trừ yêu hộ đạo':'Tiếp tế qua đường',col=e.kind==='hunt'?V42_WC.amber:e.kind==='shrine'?'#c6b7ed':V42_WC.jade;
 v42wText(title.toUpperCase(),406,226,11,col,'left',true);v41PText(e.name,405,257,23,V42_WC.paper,'left','serif','bold');v42wText((e.status==='done'?'Đã hoàn thành':e.status==='expired'?'Đã khép lại':e.status==='hunt'?'Đang diễn ra':e.status==='ready'?'Có thể nhận thưởng':'Chờ đạo hữu')+' · Ngày '+(e.day+1),405,287,12,V42_WC.muted);
 v42wFrame(405,310,786,67,true);v42wText('PHẦN THƯỞNG',423,329,10,V42_WC.gold,'left',true);v42wText(e.reward+' linh thạch  ·  '+e.xp+' tu vi  ·  '+(e.kind==='hunt'?18:12)+' danh vọng'+(e.kind==='hunt'?'  ·  1 Hồi Xuân Đan':''),423,354,15,V42_WC.paper);
 if(e.status==='done'||e.status==='expired'){v42wText('Kỳ ngộ mới sẽ xuất hiện vào ngày tiếp theo trong game.',405,419,15,V42_WC.muted);return;}
 if(!v42wCanInteract(id)){v42wText('Yêu cầu Lv '+d.min+' · '+d.realm,405,412,15,V42_WC.amber);return;}
 const near=v42wEventNear(id);if(!near){v42wText('Phải đến điểm kỳ ngộ để tương tác.',405,405,14,V42_WC.muted);v42wButton(405,431,264,42,'Dẫn đường tới kỳ ngộ',()=>v42wGuide(o),!!o,true);v42wButton(682,431,180,42,s.tracked===id?'Đang theo dõi':'Theo dõi kỳ ngộ',()=>{s.tracked=s.tracked===id?null:id;save();},true,s.tracked===id);return;}
 if(e.kind==='shrine'){wrapText(V42_ELEMENT_CLUES[e.element],405,406,750,15,V42_WC.paper,'left',21);v42wText('Chọn linh lực phù hợp với câu đố · còn '+(3-e.attempts)+' lần thử',405,447,12,V42_WC.muted);V42_ELEMENTS.forEach((a,i)=>v42wButton(405+i*157,470,148,46,a,()=>v42wSolve(id,a),true));}
 if(e.kind==='supply'){v42wText('Giao '+V13_ITEMS[e.item][0]+' ×'+e.goal+' · đang có '+v13Inventory(e.item),405,408,15,V42_WC.paper);v42wButton(405,444,260,46,'Giao vật phẩm',()=>v42wComplete(e),v13Inventory(e.item)>=e.goal,true);}
 if(e.kind==='hunt'){v42wText(e.status==='offered'?'Phá ổ yêu thú gần linh đài. Kỳ hạn 260 giây.':e.status==='hunt'?'Còn '+Math.max(0,Math.ceil(e.expires-p.worldTime))+' giây · Đã trừ '+e.count+'/'+e.goal:'Yêu thú đã bị trừ diệt. Nhận linh thạch và tu vi.',405,407,14,V42_WC.paper);if(e.status!=='offered')v42wBar(405,432,600,12,e.count,e.goal,col);v42wButton(405,462,270,46,e.status==='offered'?'Mở trận trừ yêu':e.status==='ready'?'Nhận thưởng':'Tiếp tục chiến đấu',()=>e.status==='offered'?v42wHuntStart(id):e.status==='ready'?v42wComplete(e):v42wClose(),true,true);}
}
function v42wWayPanel(id){const s=v42wState(),seen=p.discovered.includes(id),d=V22_REG[id],a=v42wCurrentWay(),o=v42wWaystone(id);v42wFrame(376,150,847,490);v41PText(seen?V42_LORE[id][0]:'Linh đài chưa biết',404,180,27,seen?d.color:V42_WC.muted,'left','serif','bold');v42wText('Khai mở '+Object.keys(s.stones).length+'/10',1195,180,13,V42_WC.gold,'right');v42wRule(405,208,790);
 if(!seen){v42wText('Hãy tới khu vực để khám phá linh đài.',405,245,15,V42_WC.muted);return;}
 wrapText(V42_LORE[id][1],405,238,740,16,V42_WC.paper,'left',24);v42wText(s.stones[id]?'ĐÃ KHAI MỞ · '+v42wTier(id):'CHƯA KHAI MỞ · Lv '+d.min,405,307,13,s.stones[id]?V42_WC.jade:V42_WC.gold,'left',true);
 v42wButton(405,340,305,46,'Dẫn đường tới linh đài',()=>v42wGuide(o),!!o,true);
 if(!s.stones[id])v42wButton(722,340,267,46,'Khai mở linh đài',()=>v42wActivate(id),v42wWithin(o,115)&&v42wCanInteract(id));
 else if(a&&a.region!==id){const cost=v42wTravelCost(id);v42wButton(722,340,290,46,'Truyền tống · '+cost+' linh thạch',()=>{if(!v42wTravel(id))v42wNotice('Chưa thể truyền tống · kiểm tra giao tranh và linh thạch');},p.stones>=cost&&!v42wFightNearby()&&v42wCanInteract(id));}
 v42wFrame(405,418,784,128);v42wText('ĐIỀU KIỆN TRUYỀN TỐNG',422,439,12,V42_WC.gold,'left',true);v42wText('• Đã khai mở cả linh đài đi và đến, đứng gần linh đài hiện tại.',422,468,13,V42_WC.paper);v42wText('• Đủ cảnh giới, linh thạch và không đang giao tranh.',422,495,13,V42_WC.paper);v42wText(a?'Đang ở '+a.name:'Chưa ở gần linh đài đã khai mở.',422,523,12,V42_WC.muted);
}
function v42wMilestonePanel(){const s=v42wState();v42wFrame(57,150,1166,490);v42wText('THIÊN MỆNH · THÀNH TỰU CÓ THƯỞNG',76,175,13,V42_WC.gold,'left',true);V42_MILESTONES.forEach((d,i)=>{const x=77+i%3*378,y=199+Math.floor(i/3)*203,n=d.count(s),claimed=!!s.milestones[d.id];v42wFrame(x,y,362,187,n>=d.need&&!claimed);v42wText(d.name,x+16,y+24,17,V42_WC.paper,'left',true);v42wText('Tiến độ '+Math.min(n,d.need)+' / '+d.need,x+16,y+55,13,V42_WC.muted);v42wBar(x+16,y+77,329,10,n,d.need,claimed?V42_WC.jade:V42_WC.gold);v42wText('Thưởng '+d.reward+' linh thạch · '+d.xp+' tu vi',x+16,y+111,12,V42_WC.gold);v42wButton(x+16,y+137,329,35,claimed?'Đã nhận':n>=d.need?'Nhận thành tựu':'Đang thực hiện',()=>v42wRewardMilestone(d.id),!claimed&&n>=d.need);});}
function v42wHistoryPanel(){const s=v42wState();v42wFrame(57,150,1166,490);v42wText('NHẬT KÝ HÀNH ĐẠO · '+s.total+' KỲ NGỘ HOÀN THÀNH',76,175,13,V42_WC.gold,'left',true);const page=clamp(modal.page||0,0,Math.max(0,Math.ceil(s.history.length/10)-1));if(!s.history.length)v42wText('Chưa có sự kiện. Mỗi linh đài và kỳ ngộ sẽ được ghi vào sổ.',76,240,15,V42_WC.muted);s.history.slice(page*10,page*10+10).forEach((a,i)=>{const y=204+i*37;v42wText('Ngày '+a.day,77,y,12,V42_WC.gold);v42wText(v42wName(a.region),174,y,12,V22_REG[a.region].color);v42wText(a.line,365,y,13,V42_WC.paper);v42wRule(76,y+17,1120);});v42wButton(77,596,123,31,'Trước',()=>modal.page=page-1,page>0);v42wButton(210,596,123,31,'Sau',()=>modal.page=page+1,(page+1)*10<s.history.length);v42wText('Trang '+(page+1)+' / '+Math.max(1,Math.ceil(s.history.length/10)),351,611,12,V42_WC.muted);}
function v42wPanel(){const s=v42wState();g.fillStyle='#071417e9';g.fillRect(0,0,W,H);v42wFrame(34,30,1212,660,true);v41PText('SƠN HÀ KÝ',57,60,29,V42_WC.gold,'left','serif','bold');v42wText('Sổ khám phá · Kỳ ngộ · Linh đài · Danh vọng',58,91,12,V42_WC.muted);v42wText('Ngày '+(v42wDay()+1)+'    ·    '+p.stones+' linh thạch',1125,63,14,V42_WC.gold,'right',true);v42wButton(1166,44,56,36,'×',v42wClose,true);['Kỳ ngộ','Linh đài','Thành tựu','Nhật ký'].forEach((a,i)=>v42wButton(57+i*292,106,280,35,a,()=>v42wTab(i),true,V42_WORLD.tab===i));const id=V42_WORLD.focus||p.mapId;if(V42_WORLD.tab<2){v42wRegionList();if(V42_WORLD.tab===0)v42wEventPanel(id);else v42wWayPanel(id);}else if(V42_WORLD.tab===2)v42wMilestonePanel();else v42wHistoryPanel();v42wText(V42_WORLD.note||'O · mở/đóng Sơn Hà Ký    |    ESC · trở lại    |    Kỳ ngộ được làm mới theo ngày trong game',58,662,12,V42_WORLD.note?V42_WC.amber:V42_WC.muted);}
const v42wPrevPanel=panel;panel=function(){if(modal?.kind==='v42world')return v42wPanel();return v42wPrevPanel();};


