'use strict';
// V41 — cinematic front end, chapter transitions and safe new-game flow.
const V41Presentation={clock:0,scope:null,transition:0,confirm:false,menuSince:0,lastPage:'',saved:null,savedAt:-100};
const V41_QUALITY_NAMES=['Tiết kiệm','Cân bằng','Cao'];
function v41Quality(){return V41E.quality;}
function v41ApplyQuality(q){q=clamp(Math.round(q),0,2);v41eSetQuality(q);V41_COMBAT.maxParticles=[46,78,116][q];V41_COMBAT.maxEvents=[16,22,26][q];try{localStorage.setItem('v41-quality',String(q));}catch(_){}return q;}
try{const q=localStorage.getItem('v41-quality');v41ApplyQuality(q===null?1:Number(q));}catch(_){v41eSetQuality(1);}
function v41QualityToggle(){const q=v41ApplyQuality((v41Quality()+1)%3);message('Đồ họa · '+V41_QUALITY_NAMES[q]);return q;}
function v41PText(s,x,y,size,col='#eedcaa',align='left',font='serif',weight='normal'){
 g.save();g.font=`${weight} ${size}px ${font==='serif'?'V18Serif, Georgia, "DejaVu Serif", "Segoe UI", Arial, serif':'V45Sans, "Segoe UI", Arial, sans-serif'}`;g.fillStyle=col;g.textAlign=align;g.textBaseline='middle';g.fillText(s,x,y);g.restore();
}
function v41PLine(x,y,w,opacity=.5){g.save();const f=g.createLinearGradient(x,y,x+w,y);f.addColorStop(0,'#c9aa6e00');f.addColorStop(.12,`rgba(216,189,126,${opacity})`);f.addColorStop(.88,`rgba(216,189,126,${opacity})`);f.addColorStop(1,'#c9aa6e00');g.fillStyle=f;g.fillRect(x,y,w,1);g.restore();}
function v41PFrame(x,y,w,h,active=false){g.save();const f=g.createLinearGradient(x,y,x+w,y+h);f.addColorStop(0,active?'#2c5147f5':'#0b252cf0');f.addColorStop(1,active?'#162c2cf3':'#09191eeb');g.fillStyle=f;g.fillRect(x,y,w,h);g.strokeStyle=active?'#d7bd82':'#687d70';g.strokeRect(x+.5,y+.5,w-1,h-1);g.strokeStyle=active?'#b6a27360':'#788e6c35';g.strokeRect(x+4.5,y+4.5,w-9,h-9);g.strokeStyle=active?'#f6ddb1':'#b1b492';for(const [xx,yy,dx,dy] of [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]]){g.beginPath();g.moveTo(xx+dx*16,yy+dy*2);g.lineTo(xx+dx*2,yy+dy*2);g.lineTo(xx+dx*2,yy+dy*16);g.stroke();}g.restore();}
function v41PButton(x,y,w,h,title,sub,cb,primary=false){const hover=mouse.inside&&mouse.x>=x&&mouse.x<=x+w&&mouse.y>=y&&mouse.y<=y+h;v41PFrame(x,y,w,h,hover||primary);g.save();if(hover){const f=g.createLinearGradient(x,y,x+w,y);f.addColorStop(0,'#efdaa624');f.addColorStop(1,'#efdaa600');g.fillStyle=f;g.fillRect(x+4,y+4,w-8,h-8);}let sz=sub?21:18;for(;sz>12;sz--){g.font=`bold ${sz}px V18Serif, Georgia, "DejaVu Serif", "Segoe UI", Arial, serif`;if(g.measureText(title).width<=w-53)break;}g.restore();v41PText(title,x+19,y+h*.5-(sub?8:0),sz,hover||primary?'#ffedbc':'#dfe7d6','left','serif','bold');if(sub)v41PText(sub,x+20,y+h*.5+14,11,'#b5c9c1','left','sans');v41PText('›',x+w-20,y+h*.5,25,'#e4cb96','center','sans');buttons.push({x,y,w,h,fn:()=>{v41Sound('click');cb();}});}
function v41PTitle(){const t=V41Presentation.clock;v8MenuBackdrop();g.save();const sh=g.createLinearGradient(0,H,0,H*.62);sh.addColorStop(0,'#07191deb');sh.addColorStop(.55,'#07191d55');sh.addColorStop(1,'#07191d00');g.fillStyle=sh;g.fillRect(0,0,W,H);const gr=g.createRadialGradient(W*.79,H*.35,80,W*.79,H*.35,650);gr.addColorStop(0,'#b3d9c709');gr.addColorStop(.8,'#06101500');gr.addColorStop(1,'#06101570');g.fillStyle=gr;g.fillRect(0,0,W,H);
 // Light drifting across the artwork, subtle and deterministic.
 for(let i=0;i<4;i++){let x=640+((t*8+i*173)%540),y=270+(i%3)*96,fxg=g.createRadialGradient(x,y,0,x,y,125);fxg.addColorStop(0,'#b9dac313');fxg.addColorStop(1,'#b9dac300');g.fillStyle=fxg;g.fillRect(x-125,y-125,250,250);}g.strokeStyle='#dbbe8050';g.strokeRect(12.5,12.5,W-25,H-25);g.restore();
 v41PText('ĐẠI CẬP NHẬT  /  41',77,50,12,'#c4b583','left','sans','bold');v41PText('VẠN ĐẠO',74,118,60,'#fae8ba','left','serif','bold');v41PText('TU TIÊN',76,187,60,'#fae8ba','left','serif','bold');v41PLine(68,225,462,.8);v41PText('THIÊN CÔNG',80,251,19,'#dec18b','left','serif','bold');v41PText('Hành đạo giữa nhân gian · Vượt thiên kiếp',80,277,13,'#bdd0c7','left','sans');
 v41PFrame(1101,31,146,32);v41PText('THIÊN CÔNG • V41',1174,47,11,'#dac28d','center','sans','bold');
}
function v41PSaved(){if(V41Presentation.clock-V41Presentation.savedAt>.6||V41Presentation.saved===null){V41Presentation.saved=canResume();V41Presentation.savedAt=V41Presentation.clock;}return V41Presentation.saved;}
// Menu V41 (các trang ngoài home/create/help). Từ T03 menu() gọi thẳng hàm này.
function menuV41(){v41PTitle();const page=V8.menuPage;if(page!==V41Presentation.lastPage){V41Presentation.lastPage=page;V41Presentation.menuSince=V41Presentation.clock;V41Presentation.confirm=false;V41Presentation.saved=null;}const saved=v41PSaved();
 if(page==='home'){
  v41PButton(78,312,392,65,'Tiếp tục hành trình',saved?'Khôi phục đạo thể và tiến trình đã lưu':'Bắt đầu hành trình đầu tiên',()=>{if(saved)resume();else V8.menuPage='create';},true);
  v41PButton(78,391,392,62,'Khởi tạo nhân vật','Chọn một trong ba đạo thống',()=>V8.menuPage='create');
  v41PButton(78,469,392,56,'Hướng dẫn điều khiển','',()=>V8.menuPage='help');
  v41PButton(78,543,190,39,v41AudioEnabled()?'Âm thanh: BẬT':'Âm thanh: TẮT','',()=>v41AudioToggle());
  v41PButton(278,543,192,39,'Đồ họa: '+V41_QUALITY_NAMES[v41Quality()],'',()=>v41QualityToggle());
  v41PText('ALT + M  ·  Âm thanh      F4  ·  Đồ họa',78,603,12,'#9ebbb1','left','sans');
  const _sp=imgs['v46splash'+(p?.cls??0)];if(_sp?.ready){g.drawImage(_sp.img,933,355,158,315);g.strokeStyle='#B88961';g.lineWidth=2;g.strokeRect(933,355,158,315);g.strokeStyle='#B8896155';g.lineWidth=1;g.strokeRect(937,359,150,307);}else sprite('action',0,4,3,1012,670,315,1,.95,1);v41PText('THANH VÂN · XUẤT THẾ',1009,686,13,'#e4d8b7','center','serif','bold');
 }else if(page==='create'){
  const labels=['KIẾM ĐẠO','THỂ TU','PHÁP TU'];for(let i=0;i<3;i++){const c=CLASSES[i],x=78+i*181,y=304,selected=V8.select===i;v41PFrame(x,y,169,205,selected);const _sp=imgs['v46splash'+i];if(_sp?.ready){g.drawImage(_sp.img,0,0,560,682,x+5,y+5,159,195);g.fillStyle='rgba(8,16,14,0.62)';g.fillRect(x+5,y+122,159,78);}else{const q=Math.sin(V41Presentation.clock*1.5+i)*2;sprite('action',i===1?6:i===2?10:0,4,3,x+84,y+114+q,126,1,.95);}v41PText(c.name,x+84,y+134,18,selected?'#eed4a0':'#e0e6d8','center','serif','bold');wrapText(c.description,x+84,y+160,151,11,'#b7c9bd','center',14);buttons.push({x,y,w:169,h:205,fn:()=>{v41Sound('click');V8.select=i;V41Presentation.confirm=false;}});}
  v41PButton(78,525,350,52,V41Presentation.confirm?'Xác nhận tạo mới':'Nhập thế · '+CLASSES[V8.select].name,'',()=>{if(saved&&!V41Presentation.confirm){V41Presentation.confirm=true;return;}V41Presentation.saved=null;start(V8.select);},true);v41PButton(440,525,170,52,'Quay lại','',()=>V8.menuPage='home');v41PText('Đạo hiệu:',78,614,15,'#d8bf8f','left','sans','bold');v41PFrame(162,596,300,36);if(saved)v41PText(V41Presentation.confirm?'Xác nhận lần nữa để thay thế tiến trình cũ.':'Lưu ý: khởi tạo sẽ thay thế tiến trình cũ.',78,650,12,'#e6ad8d','left','sans');
 }else{
  v41PFrame(78,302,557,264);const help=[['WASD / MŨI TÊN','Di chuyển tự do'],['CHUỘT TRÁI','Đi đến điểm chọn · tấn công · tương tác gần'],['CHUỘT PHẢI / 1–3','Thi triển công pháp'],['SPACE / SHIFT','Khinh công né tránh'],['E · Z · M','Tương tác · nhặt đồ · bản đồ'],['ESC · ALT+M','Đóng bảng · bật/tắt âm thanh']];help.forEach((a,i)=>{const y=326+i*39;v41PText(a[0],97,y,11,'#dcc38b','left','sans','bold');v41PText(a[1],263,y,13,'#d6e2d5','left','sans');if(i!==5)v41PLine(96,y+19,518,.17);});v41PButton(78,580,270,45,'Quay về','',()=>V8.menuPage='home');
 }
 v41PText('THẾ GIỚI LIỀN MẠCH  ·  HD-2D  ·  CHƠI OFFLINE',78,683,11,'#b8c9bc','left','sans','bold');
}
// update_L20: lớp 31_v41_v8 (trước đây lưu lớp dưới vào v41POldUpdate). Gọi lớp dưới: update_L19.
function update_L20(dt){V41Presentation.clock+=dt;V41Presentation.transition=Math.max(0,V41Presentation.transition-dt);if(pressed.F4){delete pressed.F4;v41QualityToggle();}return update_L19(dt);}
const v41POldDraw=draw;draw=function(){v41POldDraw();const scope=mode==='menu'?'menu':p?.worldMode?('world:'+((p.v36Inside?.id)||'out')):'arena:'+room+':'+tower;if(V41Presentation.scope!==scope){if(V41Presentation.scope!==null)V41Presentation.transition=.39;V41Presentation.scope=scope;}if(V41Presentation.transition>0&&!modal){g.save();g.fillStyle=`rgba(4,11,15,${Math.min(.55,V41Presentation.transition/.39*.55)})`;g.fillRect(0,0,W,H);g.restore();}};


// integrated: v41_interior.js
// V41 — five distinct, walkable architectural interiors. All existing doors and collision geometry retained.
const V41ROOM=new Map();
const V41ROOM_PALETTES={hall:{sun:'#f1cb83',wall:'#5d3d2b',trim:'#d3b080',dark:'#22201b'},herb:{sun:'#bfe5c4',wall:'#344c3b',trim:'#bcc69c',dark:'#192821'},trade:{sun:'#f5ce82',wall:'#785433',trim:'#d9bc75',dark:'#2e211a'},sword:{sun:'#b9dcdf',wall:'#3d5255',trim:'#b7c9bc',dark:'#1b292d'},guard:{sun:'#d6ccad',wall:'#5c4940',trim:'#b6a17a',dark:'#272925'}};
function v41RoomRand(i){let x=Math.sin(i*127.1+97.3)*43758.5453123;return x-Math.floor(x);}
const v41RoomOldBackdrop=v36Backdrop;
v36Backdrop=function(r){const base=v41RoomOldBackdrop(r);if(V41ROOM.has(r.id)&&V41ROOM.get(r.id).base===base)return V41ROOM.get(r.id).c;const c=document.createElement('canvas');c.width=W;c.height=H;const d=c.getContext('2d'),pal=V41ROOM_PALETTES[r.theme]||V41ROOM_PALETTES.hall;d.drawImage(base,0,0);const rect=(x,y,w,h,col)=>{d.fillStyle=col;d.fillRect(x,y,w,h);};const line=(x,y,x2,y2,col,w=1)=>{d.strokeStyle=col;d.lineWidth=w;d.beginPath();d.moveTo(x,y);d.lineTo(x2,y2);d.stroke();};
 // Molded framing and visible wall thickness; leave the entire walkable floor uncluttered.
 for(const [x,x2] of [[230,251],[1028,1050]]){const f=d.createLinearGradient(x,0,x2,0);f.addColorStop(0,pal.dark);f.addColorStop(.4,pal.wall);f.addColorStop(.64,pal.trim);f.addColorStop(1,pal.dark);rect(x,140,x2-x,444,f);for(let y=144;y<580;y+=57){line(x,y,x2,y,'#1e211dcc',2);line(x,y+2,x2,y+2,'#b8aa7d52');}}
 const top=d.createLinearGradient(0,118,0,143);top.addColorStop(0,pal.dark);top.addColorStop(.3,pal.wall);top.addColorStop(.55,pal.trim);top.addColorStop(.59,pal.dark);top.addColorStop(1,pal.wall);rect(228,118,824,17,top);for(const x of [253,502,755,1005]){rect(x,130,17,121,pal.dark);rect(x+3,131,3,119,pal.trim);rect(x+7,140,8,100,pal.wall);rect(x-4,243,25,8,pal.trim);}
 // Smoothed window highlights, dark floor-to-wall contact and fine material wear.
 d.save();d.beginPath();d.rect(252,252,776,327);d.clip();let grad=d.createLinearGradient(0,250,0,303);grad.addColorStop(0,'#0a100e7d');grad.addColorStop(1,'#0a100e00');rect(251,251,778,52,grad);
 for(let i=0;i<2650;i++){let x=253+v41RoomRand(i*4)*772,y=253+v41RoomRand(i*4+1)*323;if(x>525&&x<755)continue;let n=v41RoomRand(i*4+2);rect(x,y,1+v41RoomRand(i*4+3)*4,.6,n>.54?'#f1e0ba15':'#121c1727');}
 for(const [x,y] of [[384,285],[896,285],[640,487]]){const f=d.createRadialGradient(x,y,2,x,y,180);f.addColorStop(0,pal.sun+'25');f.addColorStop(1,pal.sun+'00');rect(x-180,y-180,360,360,f);}
 for(const f of v37Furniture(r)){let x=f.x+f.w*.5,y=f.y+f.h;let gr=d.createRadialGradient(x,y,1,x,y+13,f.w*.64);gr.addColorStop(0,'#07161152');gr.addColorStop(1,'#07161100');d.save();d.translate(0,y);d.scale(1,.38);d.translate(0,-y);rect(x-f.w,y-f.w,f.w*2,f.w*2,gr);d.restore();}d.restore();
 // Refined doorway with individual risers and rim highlight.
 for(let j=0;j<3;j++){const y=580+j*7;let f=d.createLinearGradient(0,y,0,y+6);f.addColorStop(0,'#b8b39b');f.addColorStop(.4,'#8f8e77');f.addColorStop(1,'#514d40');rect(578-j*4,y,124+j*8,6,f);line(578-j*4,y,702+j*4,y,'#d9ca9d7f');}
 d.save();d.strokeStyle=pal.trim+'75';d.strokeRect(227.5,118.5,824,486);d.restore();V41ROOM.set(r.id,{base,c});return c;};
// Subtle moving volumetric sunlight and floating dust; drawn behind actors, furniture and HUD.
const V46_BEAM_CACHE=new Map();
function v41RoomLive(r){const pal=V41ROOM_PALETTES[r.theme]||V41ROOM_PALETTES.hall,t=V41Presentation.clock;g.save();g.beginPath();g.rect(251,139,778,441);g.clip();
 const lightAngle=Math.sin(t*.12)*8;for(const x of [365,915]){const _bk=x+'|'+pal.sun;let f=V46_BEAM_CACHE.get(_bk);if(!f){f=g.createLinearGradient(x-45,219,x+135,462);f.addColorStop(0,pal.sun+'24');f.addColorStop(1,pal.sun+'00');V46_BEAM_CACHE.set(_bk,f);}g.fillStyle=f;g.beginPath();g.moveTo(x-35,227);g.lineTo(x+31,227);g.lineTo(x+147+lightAngle,460);g.lineTo(x+48+lightAngle,460);g.closePath();g.fill();}
 for(const x of [478,802]){const y=180+Math.sin(t*1.8+x)*.4,rr=72+Math.sin(t*2.1+x)*7;const grad=g.createRadialGradient(x,y,1,x,y,rr);grad.addColorStop(0,'#ffe6ac55');grad.addColorStop(.26,'#f8b86826');grad.addColorStop(1,'#f3ae5e00');g.fillStyle=grad;g.fillRect(x-rr,y-rr,rr*2,rr*2);}
 for(let i=0;i<17;i++){const x=315+((v41RoomRand(i*7)*650+t*(1+i%3))%650),y=199+((v41RoomRand(i*7+1)*312-t*(2+i%2)+3120)%312);g.globalAlpha=.12+.13*(1+Math.sin(t*.8+i));g.fillStyle=pal.sun;g.beginPath();g.arc(x,y,.55+v41RoomRand(i*7+2)*.85,0,TAU);g.fill();}
 g.restore();}


// integrated: v41_dialogue.js
// V41 — NPC conversation: character-first cinematic window, all existing quest/shop interactions.
v8Panel=function(){const d=V8_INFO[modal?.npc];if(!d){modal=null;return;}const id=d.id,actor=typeof v14Actor==='function'?v14Actor(id):null,poi=OW_POI.find(o=>o.id===id),npc=poi?v8NPC(poi):null,memory=v13Memory(id),bond=clamp(p.v8Relations[id]||0,0,100),time=V41Presentation.clock;
 const title=actor?v14Rank(actor.rank):d.realm,sect=actor?v14SectName(actor):d.sect,accent=d.trim||'#d6bc82';
 g.save();g.fillStyle='#071214aa';g.fillRect(0,0,W,H);g.restore();v41PFrame(134,110,1012,510);v41PFrame(158,137,280,456);
 // Character portrait and floating seal kept inside its own mask.
 g.save();g.beginPath();g.rect(168,149,260,316);g.clip();let grad=g.createRadialGradient(298,312,22,298,312,180);grad.addColorStop(0,'#4a5a4f');grad.addColorStop(1,'#111e20');g.fillStyle=grad;g.fillRect(168,149,260,316);g.save();g.translate(298,315);g.rotate(time*.04);g.globalAlpha=.54;seal(g,0,0,117,accent,.12,.4);g.restore();v8Figure(d,298,451+Math.sin(time*1.65)*.85,3.25,1,0,false);g.restore();
 v41PLine(170,468,256,.48);v41PText(d.name,298,489,24,accent,'center','serif','bold');v41PText(title+' · '+sect,298,517,12,'#e0ddc8','center','sans');v41PText(npc?.v13Task||'Sinh hoạt',298,544,11,'#aec9b9','center','sans');v41PText('Quà đã nhận: '+(memory.gifts||0),298,568,11,'#c3c7ad','center','sans');
 v41PText('GẶP GỠ  /  '+d.role.toUpperCase(),466,155,11,'#c7b37e','left','sans','bold');v41PText(d.name,465,192,34,'#f4deb0','left','serif','bold');v41PText('Hảo cảm '+bond+'/100',1098,151,12,'#b2d4c0','right','sans','bold');g.save();g.fillStyle='#091c1d';g.fillRect(920,172,178,7);g.fillStyle='#88c1a6';g.fillRect(920,172,178*bond/100,7);g.strokeStyle='#a496645c';g.strokeRect(919.5,171.5,179,8);g.restore();wrapText(d.bio,466,225,622,14,'#c4cebf','left',20);v41PLine(463,250,646,.45);
 v41PFrame(462,267,646,135);v41PText('LỜI ĐỐI THOẠI',479,287,11,'#d9c28f','left','sans','bold');wrapText(modal.line||d.line,480,320,608,17,'#f3ecdb','left',25);
 if(id==='inn'&&p.v12Main===1)v41PText('Đã gặp trưởng lão · mở Công pháp để tiếp tục chính tuyến',479,378,12,'#a8d9bc','left','sans','bold');v41PText('“',1079,385,51,'#b5a07855','center','serif');
 v41PButton(463,416,190,45,'Trò chuyện','',()=>v8Chat(id),true);
 if(id==='shop')v41PButton(664,416,444,45,'Mua 2 Hồi Xuân Đan · 5 linh thạch','',v8Shop,true);
 else if(V8_TASKS[id]){const q=p.v8Quests['quest:'+id];v41PButton(664,416,444,45,q===2?'Đã hoàn thành nhiệm vụ phụ':q?'Báo cáo nhiệm vụ phụ':'Nhận nhiệm vụ phụ','',()=>v8Quest(id),true);}
 else v41PText('Đạo hữu có thể trò chuyện để tăng hảo cảm.',675,438,13,'#b7c4b7','left','sans');
 v41PButton(463,473,245,40,'Tặng 1 linh thảo','',()=>v13Gift(id));v41PButton(920,473,188,40,'Rời đi · ESC','',()=>{modal=null;});
 v41PLine(463,528,646,.35);v41PText('Linh thạch: '+p.stones+'  ·  Đan: '+p.pills,466,550,13,'#d8c395','left','sans','bold');if(actor){const s='Tu vi '+Math.floor(actor.xp)+'/'+v14Need(actor)+' · '+actor.trait+' · '+actor.action;wrapText(s,466,578,622,12,'#a7bdb1','left',16);}else v41PText('Tiến trình được lưu tự động',466,578,12,'#a7bdb1','left','sans');
};


// integrated: v41_perf.js
