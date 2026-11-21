
'use strict';
// Entire game and original art are embedded in this single offline HTML.
const ASSET={
v47thon:ASSETS["ASSET__v47thon"],
v47map0:ASSETS["ASSET__v47map0"],
v47map1:ASSETS["ASSET__v47map1"],
v47map2:ASSETS["ASSET__v47map2"],
v47map3:ASSETS["ASSET__v47map3"],
v47map4:ASSETS["ASSET__v47map4"],
v47map5:ASSETS["ASSET__v47map5"],
v47map6:ASSETS["ASSET__v47map6"],
v47map7:ASSETS["ASSET__v47map7"],
v47map8:ASSETS["ASSET__v47map8"],
v47map9:ASSETS["ASSET__v47map9"],
v47thumb0:ASSETS["ASSET__v47thumb0"],
v47thumb1:ASSETS["ASSET__v47thumb1"],
v47thumb2:ASSETS["ASSET__v47thumb2"],
v47thumb3:ASSETS["ASSET__v47thumb3"],
v47thumb4:ASSETS["ASSET__v47thumb4"],
v47thumb5:ASSETS["ASSET__v47thumb5"],
v47thumb6:ASSETS["ASSET__v47thumb6"],
v47thumb7:ASSETS["ASSET__v47thumb7"],
v47thumb8:ASSETS["ASSET__v47thumb8"],
v47thumb9:ASSETS["ASSET__v47thumb9"],
v47gate0:ASSETS["ASSET__v47gate0"],
v47gate1:ASSETS["ASSET__v47gate1"],
v47gate2:ASSETS["ASSET__v47gate2"],
v46walk2:ASSETS["ASSET__v46walk2"],
v46walk1:ASSETS["ASSET__v46walk1"],
v46walk0:ASSETS["ASSET__v46walk0"],
v46hero2:ASSETS["ASSET__v46hero2"],
v46hero1:ASSETS["ASSET__v46hero1"],
v46hero0:ASSETS["ASSET__v46hero0"],
v46farm:ASSETS["ASSET__v46farm"],
v46ruin:ASSETS["ASSET__v46ruin"],
v46splash0:ASSETS["ASSET__v46splash0"],
v46splash1:ASSETS["ASSET__v46splash1"],
v46splash2:ASSETS["ASSET__v46splash2"],
v46cave:ASSETS["ASSET__v46cave"],
v45Atlas:ASSETS["ASSET__v45Atlas"],
v45FX:ASSETS["ASSET__v45FX"],
v12SkillAtlas:ASSETS["ASSET__v12SkillAtlas"],
"run9_E":ASSETS["ASSET__run9_E"],
"run9_S":ASSETS["ASSET__run9_S"],
"run9_N":ASSETS["ASSET__run9_N"],
"run9_NE":ASSETS["ASSET__run9_NE"],
"run9_SE":ASSETS["ASSET__run9_SE"],
"idle9":ASSETS["ASSET__idle9"],
"npc9_front_A":ASSETS["ASSET__npc9_front_A"],
"npc9_front_B":ASSETS["ASSET__npc9_front_B"],
"npc9_back_A":ASSETS["ASSET__npc9_back_A"],
"npc9_back_B":ASSETS["ASSET__npc9_back_B"],
"npc_inn":ASSETS["ASSET__npc_inn"],
"npc_shop":ASSETS["ASSET__npc_shop"],
"npc_sentry":ASSETS["ASSET__npc_sentry"],
"npc_herbalist":ASSETS["ASSET__npc_herbalist"],
"npc_wanderer":ASSETS["ASSET__npc_wanderer"],
"npc_bambooKeeper":ASSETS["ASSET__npc_bambooKeeper"],
"npc_mountainHunter":ASSETS["ASSET__npc_mountainHunter"],
"npc_snowHermit":ASSETS["ASSET__npc_snowHermit"],
"npc_swampMedic":ASSETS["ASSET__npc_swampMedic"],
"npc_desertSmith":ASSETS["ASSET__npc_desertSmith"],
"npc_demonWatcher":ASSETS["ASSET__npc_demonWatcher"],
"npc_ghostSeer":ASSETS["ASSET__npc_ghostSeer"],
"v8Title":ASSETS["ASSET__v8Title"],
 weapons:ASSETS["ASSET__weapons"],
 books:ASSETS["ASSET__books"],
 divine:ASSETS["ASSET__divine"],
 gear:ASSETS["ASSET__gear"],

 run:ASSETS["ASSET__run"],
 action:ASSETS["ASSET__action"],
 extra:ASSETS["ASSET__extra"],
 monster:ASSETS["ASSET__monster"],monster2:ASSETS["ASSET__monster2"],forest:ASSETS["ASSET__forest"],guiyu:ASSETS["ASSET__guiyu"],v48idle:ASSETS["ASSET__v48idle"], v48runBN:ASSETS["ASSET__v48runBN"], v48runBNE:ASSETS["ASSET__v48runBNE"], v48runBS:ASSETS["ASSET__v48runBS"], v48runBSE:ASSETS["ASSET__v48runBSE"], v48map0:ASSETS["ASSET__v48map0"],v48map1:ASSETS["ASSET__v48map1"],v48map2:ASSETS["ASSET__v48map2"],v48map3:ASSETS["ASSET__v48map3"],v48map4:ASSETS["ASSET__v48map4"],v48map5:ASSETS["ASSET__v48map5"],v48map6:ASSETS["ASSET__v48map6"],v48map7:ASSETS["ASSET__v48map7"],v48map8:ASSETS["ASSET__v48map8"],v48map9:ASSETS["ASSET__v48map9"],ui:ASSETS["ASSET__ui"]
};
const cv=document.getElementById('game'),g=cv.getContext('2d');
const W=1280,H=720,AREA={l:72,r:1208,t:112,b:610};
const SAVE='vdtt_vangioi_v3',TAU=Math.PI*2;
const C={gold:'#e3b96f',jade:'#a8d6c5',ink:'#100b13',muted:'#b5a18b',paper:'#f1e4cf',red:'#f18474'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const rnd=(a,b)=>a+(b-a)*random(),pick=a=>a[Math.floor(random()*a.length)];
let rng=1;
function random(){rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;}
function newSeed(){return (Date.now()^Math.floor(Math.random()*0xffffffff))>>>0;}
const imgs={};
for(const [k,url] of Object.entries(ASSET)){const img=new Image();imgs[k]={img,ready:false};img.onload=()=>imgs[k].ready=true;img.src=url;}
const keys={},pressed={};
const mouse={x:W/2,y:H/2,left:false,right:false,fire:false,cast:false,inside:false};
let buttons=[],mode='menu',modal=null,room=0,seed=0,p=null,enemies=[],bolts=[],drops=[],fx=[],numbers=[],shakes=0,elapsed=0,notify='',notifyT=0,saveTimer=0,clearDelay=0,cleared=false,auto=false,animation={name:'idle',t:0},runId=0,roomStyle=0,remaining=0,failed=false,screenShake=true,invSelect=-1;
const CLASSES=[
 {id:'sword',name:'Kiếm Tu',icon:'劍',description:'Kiếm khí sắc bén, tốc độ xuất chiêu nhanh.',stats:{hp:110,mp:70,attack:25,def:7,speed:245,crit:.18,range:124,rate:1.03},tech:'sword'},
 {id:'body',name:'Thể Tu',icon:'體',description:'Thân thể cứng cáp, cận chiến và hồi phục.',stats:{hp:160,mp:50,attack:30,def:14,speed:222,crit:.08,range:110,rate:.85},tech:'body'},
 {id:'spell',name:'Pháp Tu',icon:'法',description:'Linh lực dồi dào, kiếm khí mạnh và rộng.',stats:{hp:95,mp:105,attack:23,def:5,speed:236,crit:.12,range:138,rate:.93},tech:'water'}
];
const TECH={
 sword:{name:'Thanh Vân Kiếm Quyết',element:'Kim',desc:'Tăng 20% công kích và tầm đòn.',apply:s=>{s.attack*=1.2;s.range+=10}},
 body:{name:'Huyền Thạch Luyện Thể',element:'Thổ',desc:'Tăng 14 phòng ngự và 25 sinh mệnh.',apply:s=>{s.def+=14;s.hp+=25}},
 fire:{name:'Xích Viêm Tâm Pháp',element:'Hỏa',desc:'Đòn đánh thiêu đốt mục tiêu.',apply:s=>{s.attack*=1.12;s.burn=5}},
 water:{name:'Hàn Nguyệt Quyết',element:'Thủy',desc:'Thủy khí làm chậm yêu thú, +20 linh lực.',apply:s=>{s.mp+=20;s.slow=.27}},
 wind:{name:'Lưu Phong Thân Pháp',element:'Mộc',desc:'Tăng tốc chạy và tốc độ chém.',apply:s=>{s.speed+=28;s.rate*=1.22}},
 thunder:{name:'Lôi Minh Quyết',element:'Lôi',desc:'Bạo kích tăng 12%, kiếm khí mạnh.',apply:s=>{s.crit+=.12;s.attack*=1.10}},
 flame_sword:{name:'Liệt Diễm Thanh Vân',element:'Kim · Hỏa',desc:'Kiếm khí hỏa diễm, tăng sát thương, thiêu đốt mạnh.',apply:s=>{s.attack*=1.43;s.range+=20;s.burn=10}},
 thunder_body:{name:'Lôi Kiếp Thần Thể',element:'Thổ · Lôi',desc:'Thần thể mạnh, bạo kích và phòng ngự cao.',apply:s=>{s.hp+=45;s.def+=20;s.crit+=.19;s.attack*=1.18}},
 frost_wind:{name:'Hàn Phong Linh Quyết',element:'Thủy · Mộc',desc:'Khinh công linh hoạt, làm chậm và tăng linh lực.',apply:s=>{s.speed+=45;s.rate*=1.27;s.mp+=35;s.slow=.45}}
};
const FUSIONS=[{parts:['sword','fire'],result:'flame_sword'},{parts:['body','thunder'],result:'thunder_body'},{parts:['water','wind'],result:'frost_wind'}];
const RELICS=[
 {id:'jade',name:'Ngọc Bội Tụ Linh',element:'Thủy',desc:'Linh lực hồi nhanh hơn 50%.',apply:s=>s.regen*=1.5},
 {id:'blade',name:'Kiếm Tâm Thạch',element:'Kim',desc:'Công kích tăng 18%.',apply:s=>s.attack*=1.18},
 {id:'blood',name:'Huyết Liên Tử',element:'Hỏa',desc:'Hồi sinh mệnh khi tiêu diệt quái.',apply:s=>s.leech+=6},
 {id:'shell',name:'Huyền Vũ Giáp',element:'Thổ',desc:'Tăng 10 phòng ngự, +20 sinh mệnh.',apply:s=>{s.def+=10;s.hp+=20}},
 {id:'feather',name:'Thanh Phong Vũ',element:'Mộc',desc:'Giảm hồi chiêu lướt và tăng tốc đánh.',apply:s=>{s.dashCd*=.8;s.rate*=1.15}},
 {id:'coin',name:'Thiên Cơ Tiền',element:'Kim',desc:'Tăng phúc duyên và linh thạch nhận được.',apply:s=>s.luck+=.4},
 {id:'lantern',name:'U Minh Đăng',element:'Hỏa',desc:'Tăng công kích và thiêu đốt.',apply:s=>{s.attack*=1.08;s.burn+=3}},
 {id:'bone',name:'Bạch Cốt Hoàn',element:'Thổ',desc:'Tăng phòng ngự 15.',apply:s=>s.def+=15},
 {id:'frost',name:'Hàn Ngọc',element:'Thủy',desc:'Đòn đánh làm chậm yêu thú.',apply:s=>s.slow=Math.max(s.slow,.20)},
 {id:'pearl',name:'Lôi Châu',element:'Kim',desc:'Tăng 10% bạo kích.',apply:s=>s.crit+=.10}
];
const TYPES=[
 {name:'Trúc Lang',hp:62,atk:15,speed:110,r:22,range:50,wind:.58,cd:.6,scale:110,color:'#95bda3'},
 {name:'Thạch Yêu',hp:122,atk:27,speed:56,r:30,range:75,wind:.95,cd:1.0,scale:118,color:'#d6be79'},
 {name:'U Hồn',hp:73,atk:15,speed:82,r:21,range:230,wind:.92,cd:1.45,scale:112,color:'#b4eee1'},
 {name:'Trúc Lang Vương',hp:530,atk:25,speed:102,r:48,range:108,wind:.92,cd:1.1,scale:205,color:'#e69179',boss:true},
 {name:'Bạch Cốt Vệ',hp:125,atk:24,speed:93,r:26,range:85,wind:.75,cd:.85,scale:125,color:'#d3e0ca'},
 {name:'Hắc Chu',hp:94,atk:17,speed:100,r:29,range:190,wind:.85,cd:1.5,scale:122,color:'#c6a2e5',ranged:true,effect:'poison'},
 {name:'Hỏa Xà',hp:145,atk:21,speed:81,r:32,range:200,wind:1,cd:1.6,scale:136,color:'#ffae70',ranged:true,effect:'fire'},
 {name:'Quỷ Môn Ma Tướng',hp:900,atk:31,speed:96,r:48,range:118,wind:1.0,cd:1.1,scale:230,color:'#91e3db',boss:true}
];
// Map data: each chamber has its own ecology, palette and terrain hazards.
const MAPS=[
 {name:'Thanh Trúc Lâm',sub:'Rừng tre · nhập môn',colors:['#203b31','#263e32','#536b4b'],pool:[0,0,1],terrain:'forest',hazards:[]},
 {name:'Thanh Thạch Động',sub:'Thạch yêu · đá sụp',colors:['#31383a','#424a43','#677062'],pool:[1,1,4,0],terrain:'forest',hazards:[]},
 {name:'U Minh Mộ',sub:'Vong hồn · âm khí',colors:['#1c3036','#293b40','#526c69'],pool:[2,2,4],terrain:'guiyu',hazards:[{x:380,y:310,r:54,type:'spirit'}]},
 {name:'Hắc Chu Sào',sub:'Độc trùng · hồ độc',colors:['#302d39','#43354a','#796580'],pool:[5,5,4,0],terrain:'guiyu',hazards:[{x:420,y:400,r:70,type:'poison'},{x:890,y:275,r:54,type:'poison'}]},
 {name:'Huyết Trúc Cốc',sub:'Yêu vương · thủ lĩnh',colors:['#392c28','#50372e','#865f45'],pool:[0,4,5],terrain:'forest',hazards:[],boss:3},
 {name:'Hỏa Xà Viêm Địa',sub:'Dung nham · thiêu đốt',colors:['#3c2723','#4d3327','#916248'],pool:[6,6,1,5],terrain:'guiyu',hazards:[{x:390,y:292,r:67,type:'fire'},{x:910,y:460,r:67,type:'fire'}]},
 {name:'Quỷ Vực · Guiyu',sub:'Cổng đồng hoang tàn · âm hồn',colors:['#22282a','#313b3b','#687879'],pool:[2,4,5,6],terrain:'guiyu',hazards:[{x:385,y:340,r:58,type:'spirit'},{x:850,y:370,r:64,type:'poison'}]},
 {name:'Quỷ Môn Đài',sub:'Ma tướng · trận chiến cuối',colors:['#1c272c','#2c3637','#677b7a'],pool:[4,2,6],terrain:'guiyu',hazards:[{x:340,y:340,r:60,type:'spirit'},{x:940,y:340,r:60,type:'spirit'}],boss:7}
];
const BASE_MAPS=MAPS.slice(), ROOM_NAMES=[];let LAST=7,tower=0;
const BIOMES=['Vạn Yêu Lâm','Thượng Cổ Thạch Quật','Quỷ Vực','Hắc Độc Trạch','Cổ Kiếm Trủng','Vô Tận Hỏa Uyên','Hư Không Ma Vực','Thái Cổ Tiên Cung'];
function generateWorld(sd,floor=0){let r=(sd+Math.imul(floor,9973))>>>0;const rand=()=>{r=(Math.imul(r,1664525)+1013904223)>>>0;return r/4294967296};
 const n=8+Math.floor(rand()*13);MAPS.length=0;BLOCKS.length=0;ROOM_NAMES.length=0;LAST=n-1;
 for(let i=0;i<n;i++){const k=i===0?0:i===n-1?7:Math.floor(rand()*7),b=BASE_MAPS[k];const m={...b,name:BIOMES[k]+' · '+(i+1),hazards:b.hazards.map(h=>({...h,x:Math.round(280+rand()*720),y:Math.round(220+rand()*250)})),secret:i>1&&i<n-1&&rand()<.2};if(i!==n-1&&i!==Math.floor(n/2))delete m.boss;else m.boss=i===n-1?7:3;MAPS.push(m);ROOM_NAMES.push(m.name);BLOCKS.push(i>0&&rand()<.7?[{x:350+rand()*580,y:230+rand()*170,r:24+rand()*20}]:[]);}}
const EQUIPMENT=[
 ['Thanh Mộc Phi Tiêu','weapons',0,'weapon','Mộc',6,0,'ranged'],['Diệp Vũ Loan Đao','weapons',1,'weapon','Mộc',9,0,'fast'],['Hàn Nha Kiếm','weapons',2,'weapon','Thủy',12,0,'frost'],['Toái Sơn Nha','weapons',3,'weapon','Thổ',17,0,'heavy'],['Huyết Ẩm Đoản Đao','weapons',5,'weapon','Hỏa',12,0,'blood'],['Trạch Nha Thương','weapons',6,'weapon','Mộc',11,0,'reach'],['Liệp Yêu Đao','weapons',7,'weapon','Kim',8,0,'fast'],['Tử Điện Kiếm','weapons',8,'weapon','Lôi',13,0,'fast'],
 ['Đại Hạ Long Tước','divine',0,'weapon','Kim',23,0,'reach'],['Bích Ngọc Long Kiếm','divine',1,'weapon','Thủy',18,0,'frost'],['Xích Kim Tiên Kiếm','divine',2,'weapon','Hỏa',22,0,'heavy'],['Thanh Long Ngự Kiếm','divine',3,'weapon','Kim',21,0,'reach'],['Lam Hải Thần Kiếm','divine',5,'weapon','Thủy',22,0,'frost'],['Thiên Long Kiếm','divine',6,'weapon','Kim',24,0,'reach'],['Huyền Ngọc Kiếm','divine',7,'weapon','Thổ',20,0,'heavy'],['Cửu Thiên Long Kiếm','divine',8,'weapon','Lôi',26,0,'fast'],
 ['Huyền Thiết Kiếm','gear',0,'weapon','Kim',12,0,'reach'],['Bách Thú Văn Khải','gear',1,'armor','Thổ',0,16,''],['Phần Thiên Hỏa Kiếm','gear',2,'weapon','Hỏa',24,0,'fire'],['Huyền Băng Thuẫn','gear',3,'armor','Thủy',0,22,''],['Phượng Vũ Tiên Y','gear',5,'armor','Hỏa',4,14,''],['Vô Phong Cự Kiếm','gear',6,'weapon','Thổ',27,0,'heavy'],['Huyết Tâm Ngọc','gear',7,'accessory','Hỏa',7,4,'blood'],['Lôi Đình Tế Kiếm','gear',8,'weapon','Lôi',19,0,'fast']
].map((a,id)=>({id,name:a[0],sheet:a[1],index:a[2],slot:a[3],element:a[4],atk:a[5],def:a[6],style:a[7]}));
const BOOK_ICON={sword:0,fire:1,wind:2,body:6,water:7,thunder:3,flame_sword:1,thunder_body:8,frost_wind:5};
const QUALITY=['Phàm phẩm','Linh phẩm','Huyền phẩm','Địa phẩm','Thiên phẩm','Tiên phẩm','Thần phẩm','Hỗn Độn'];
const QUALITY_COL=['#aaaaaa','#73d18c','#65b5f5','#c48aef','#f2c15c','#ef645c','#ff98ed','#fff1b0'];
function equipInit(){p.gear??=[];p.worn??={};p.visited??=[];p.forge??={};}
function gearDef(item){return EQUIPMENT[item?.id]}
function equipStats(s){equipInit();for(const k of Object.keys(p.worn)){const item=p.gear[p.worn[k]],d=gearDef(item);if(!d)continue;const mult=1+item.quality*.18+(item.up||0)*.12;s.attack+=d.atk*mult;s.def+=d.def*mult;if(d.slot==='armor')s.hp+=d.def*mult*2;if(d.style==='fast')s.rate*=1.2;if(d.style==='heavy'){s.rate*=.8;s.attack*=1.13;}if(d.style==='reach')s.range+=35;if(d.style==='frost')s.slow=Math.max(.3,s.slow);if(d.style==='fire')s.burn+=5;if(d.style==='blood')s.leech+=4;}}
function gearIcon(d,x,y,size=48){if(!d)return;const a=imgs[d.sheet];if(!a?.ready)return;const w=a.img.naturalWidth/3,h=a.img.naturalHeight/3;g.save();g.imageSmoothingEnabled=false;g.drawImage(a.img,d.index%3*w,Math.floor(d.index/3)*h,w,h,x,y,size,size);g.restore();}
function addGear(id,q){equipInit();const d=EQUIPMENT[id];if(p.gear.length>=48){p.stones+=5;return;}const i=p.gear.push({id,quality:q,up:0})-1;if(p.worn[d.slot]===undefined)p.worn[d.slot]=i;}
function equip(i){const item=p.gear[i],d=gearDef(item);if(!d)return;p.worn[d.slot]=i;const s=currentStats();p.hp=Math.min(p.hp,s.hp);p.mp=Math.min(p.mp,s.mp);save();}
function upgradeGear(i){const a=p.gear[i];if(!a)return;const cost=6+(a.up||0)*4;if(p.stones<cost){message('Không đủ linh thạch');return;}if(a.up>=10)return;p.stones-=cost;a.up++;save();}
let gearPage=0,gearSel=-1;

const bossType=t=>!!TYPES[t].boss;
const BLOCKS=[
 [],
 [{x:365,y:285,r:37},{x:900,y:405,r:42}],
 [{x:540,y:310,r:31},{x:740,y:445,r:31}],
 [{x:640,y:260,r:39},{x:640,y:450,r:35}],
 [{x:280,y:350,r:34},{x:1000,y:350,r:34}],
 [{x:640,y:350,r:42}],
 [{x:245,y:420,r:42},{x:1020,y:420,r:42},{x:640,y:230,r:36}],
 []
];
function blockCollision(o,r){for(const b of BLOCKS[room]||[]){const dx=o.x-b.x,dy=o.y-b.y,d=Math.hypot(dx,dy),lim=b.r+r;if(d<lim){if(d<.01)o.x+=lim;else{o.x=b.x+dx/d*lim;o.y=b.y+dy/d*lim;}}}}
function text(t,x,y,size=14,color=C.paper,align='left',weight='normal'){
 g.fillStyle=color;const _f=(weight==='normal'?'':weight+' ')+size+'px V45Sans, "Segoe UI", Arial, sans-serif';if(g.font!==_f)g.font=_f;g.textAlign=align;g.textBaseline='middle';g.fillText(String(t),x,y);
}
function box(x,y,w,h,fill,stroke='',r=10){
 g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke();}
}
function circle(x,y,r,fill,stroke='',alpha=1){g.save();g.globalAlpha=alpha;g.beginPath();g.arc(x,y,r,0,TAU);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke()}g.restore();}
function bar(x,y,w,h,ratio,col,label){box(x,y,w,h,'#142126','#2d3c40',5);if(ratio>0)box(x,y,Math.max(2,w*clamp(ratio,0,1)),h,col,'',5);text(label,x+w/2,y+h/2,12,'#fff','center','600');}
function message(s){notify=s;notifyT=3.5;}
function floating(x,y,t,c=C.paper){numbers.push({x,y,t,c,life:.85});}
function effect(x,y,color,kind='ring',life=.35,more={}){fx.push({x,y,color,kind,life,max:life,...more});}
function currentStats(){
 const s={...CLASSES[p.cls].stats,regen:11,burn:0,slow:0,leech:0,luck:0,dashCd:.9};
 s.hp+=p.level*7+p.bonusHp;s.attack+=p.level*2+p.bonusAtk;s.def+=p.bonusDef;s.mp+=p.bonusMp;
 for(const id of p.techs)TECH[id]?.apply(s);
 for(const id of p.relics.slice(0,4))RELICS.find(r=>r.id===id)?.apply(s);
 const elems=p.relics.slice(0,4).map(id=>RELICS.find(r=>r.id===id)?.element);
 const generating={Mộc:'Hỏa',Hỏa:'Thổ',Thổ:'Kim',Kim:'Thủy',Thủy:'Mộc'};
 // Adjacent relics with generating elements form a link buff.
 for(let i=0;i<elems.length-1;i++){if(generating[elems[i]]===elems[i+1]||generating[elems[i+1]]===elems[i]){s.attack*=1.07;s.def+=2;}}
 equipStats(s);s.crit=clamp(s.crit,0,.6);return s;
}
function xpNeed(){return 32+12*(p.level-1);}
function gainXP(q){p.xp+=q;if(p.worldMode&&p.level===9){p.xp=Math.min(p.xp,xpNeed());return;}while(p.xp>=xpNeed()){if(p.worldMode&&p.level===9){p.xp=xpNeed();break;}p.xp-=xpNeed();p.level++;p.hp=Math.min(currentStats().hp,p.hp+20);message('Tu vi tinh tiến — '+realm());}}
function realm(){return p.level<10?'Luyện Khí tầng '+p.level:'Trúc Cơ tầng '+(p.level-9);}
function start(cls){
 seed=newSeed();rng=seed;runId++;room=0;auto=false;failed=false;mode='play';modal=null;
 p={playerId:v46NewPlayerId(),cls,x:640,y:380,face:1,hp:100,mp:60,xp:0,level:1,stones:0,pills:2,techs:[CLASSES[cls].tech],relics:[],bonusHp:0,bonusAtk:0,bonusDef:0,bonusMp:0,atkCd:0,attackT:0,castT:0,dashT:0,dashCd:0,dx:0,dy:0,hurt:0,kills:0,poisonT:0,fireT:0,dotTick:0,hazardCd:0};
 tower=0;generateWorld(seed,tower);equipInit();v10StarterKit(cls);p.hp=currentStats().hp;p.mp=currentStats().mp;enterWorld("thon",160);save();
}
function spawn(type,x,y,elite=false){
 const t=TYPES[type],factor=1+room*.10+tower*.32+(elite?.25:0);enemies.push({type,x,y,hp:t.hp*factor,max:t.hp*factor,dir:1,state:'chase',timer:0,cd:rnd(0,.65),flash:0,burn:0,burnTick:0,slow:0,angle:0,dead:false,elite});
}
function enterRoom(n){
 room=n;equipInit();if(!p.visited.includes(n))p.visited.push(n);cleared=false;clearDelay=0;bolts=[];drops=[];fx=[];numbers=[];enemies=[];modal=null;roomStyle=n;
 p.x=640;p.y=550;p.atkCd=0;p.attackT=0;p.dashT=0;p.castT=0;p.hurt=0;p.poisonT=0;p.fireT=0;p.hazardCd=0;
 const m=MAPS[n];
 if(m.boss!==undefined){spawn(m.boss,640,265,true);for(let i=0;i<3;i++)spawn(pick(m.pool),320+i*320,235);}
 else{
  let count=4+Math.min(7,n);for(let i=0;i<count;i++){const a=i*TAU/count+rnd(-.17,.17),rx=340,ry=185;spawn(pick(m.pool),clamp(640+Math.cos(a)*rx,AREA.l+55,AREA.r-55),clamp(335+Math.sin(a)*ry,AREA.t+55,AREA.b-55),(n===6||v28Run()?.v29?.mods?.[Math.floor(n/2)]===3)&&i===0);}
 }
 remaining=enemies.length;message(ROOM_NAMES[n]+' · Tiêu diệt yêu thú');save();
}
function save(){
 if(!p||mode!=='play'||failed)return;try{
  localStorage.setItem(SAVE,JSON.stringify({v:1,seed,rng,tower,room,p,auto,cleared,enemies:enemies.filter(e=>!e.dead),drops,roomStyle,modal}));
 }catch(e){}
}
function canResume(){try{const d=JSON.parse(localStorage.getItem(SAVE)||'null');return !!(d&&d.v===1&&d.p&&d.p.hp>0)||!!legacyWorldSave();}catch(e){return false;}}
function resume(){
 try{const d=JSON.parse(localStorage.getItem(SAVE)||'null');if(!d||d.v!==1||!d.p||d.p.hp<=0){migrateWorldSave();return;}
 seed=d.seed;rng=d.rng;tower=d.tower||0;generateWorld(seed,tower);room=clamp(d.room,0,LAST);p=d.p;if(!p.playerId)p.playerId=v46NewPlayerId();equipInit();auto=!!d.auto;cleared=!!d.cleared;failed=false;mode='play';roomStyle=d.roomStyle||0;
 enemies=(d.enemies||[]).filter(e=>!e.dead);drops=d.drops||[];bolts=[];fx=[];numbers=[];p.attackT=0;p.castT=0;p.dashT=0;p.hurt=0;
 modal=d.modal&&['reward','event','fusion','inventory','route','gear'].includes(d.modal.kind)?d.modal:null;remaining=enemies.length;if(p.worldMode){if(!WORLD_MAPS[p.mapId]){enterWorld('thon',300);}else{worldMap=p.mapId;WORLD=WORLD_MAPS[worldMap].width;p.x=clamp(p.x,30,WORLD-30);p.y=clamp(p.y,200,GROUND);p.vy=0;worldTitle=3.5;}}message('Tiếp tục hành trình tu tiên');
 }catch(e){message('Không thể tải tiến trình.');}
}
function hit(e,dmg,crit=false){
 if(e.dead)return;const type=TYPES[e.type],s=currentStats();
 const amount=Math.max(1,dmg*(e.type===1?.76:bossType(e.type)?.86:1));e.hp-=amount;e.flash=.12;
 if(s.burn){e.burn=Math.max(e.burn,2.8);e.burnTick=0;}
 if(s.slow)e.slow=1.55;
 floating(e.x,e.y-32,Math.round(amount)+(crit?'!':''),crit?'#ffd369':'#f7f2e2');
 effect(e.x,e.y,C.gold,'hit',.24);if(crit)shakes=Math.max(shakes,3);
 if(e.hp<=0){e.dead=true;if(!e.v28Summon)p.kills++;remaining--;if(p.worldMode&&!p.worldBossDead&&(e.region||regionAt(e.x,e.y).id)==='truc'&&e.type===3){p.worldBossDead=true;p.foundation=(p.foundation||0)+.30;p.pills+=2;message('Trúc Lang Vương đã ngã xuống! Vạn Yêu Sơn mở đường.');}const loot=bossType(e.type)?65:e.type===1?12:e.type===2?9:10;
  if(!e.v28Summon){gainXP(v22KillXP(e,loot));p.hp=Math.min(s.hp,p.hp+s.leech);}v21DeathLoot(e,s);

  effect(e.x,e.y,type.color,'ring',.56,{radius:type.r*2});}
}
function damagePlayer(n){
 if(p.hurt>0||p.dashT>0||failed)return;
 const s=currentStats();const d=Math.max(1,n*100/(100+s.def));
 p.hp=Math.max(0,p.hp-d);p.hurt=.46;shakes=6;floating(p.x,p.y-55,'-'+Math.round(d),C.red);
 if(p.hp<=0&&p.worldMode){p.xp=Math.floor(p.xp*.9);p.hp=currentStats().hp;p.mp=currentStats().mp;enterWorld('thon',300);message('Trọng thương · mất 10% tu vi tầng này · hồi sinh tại thôn');save();return;}if(p.hp<=0){failed=true;mode='dead';modal=null;mouse.left=false;try{localStorage.removeItem(SAVE);}catch(e){}}
}
function angleDelta(a,b){let d=a-b;return Math.atan2(Math.sin(d),Math.cos(d));}
function targetAngle(){
 if(auto&&!mouse.left&&!mouse.fire&&!mouse.cast){const a=enemies.filter(e=>!e.dead).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(a)return Math.atan2(a.y-p.y,a.x-p.x);}
 return Math.atan2(mouse.y-p.y,mouse.x-p.x);
}
function attack(){
 if(p.atkCd>0||p.dashT>0)return;
 const s=currentStats(),a=targetAngle();p.face=Math.cos(a)<0?-1:1;p.atkCd=.39/s.rate;p.attackT=.28;p.attackAngle=a;
 const weapon=gearDef(p.gear[p.worn.weapon]);if(weapon?.style==='ranged'){bolts.push({x:p.x,y:p.y,vx:Math.cos(a)*600,vy:Math.sin(a)*600,life:1.1,r:8,dmg:s.attack,good:true,pierce:1,hit:[]});return;}effect(p.x,p.y,'#d8fff0','slash',.28,{a,radius:s.range});
 for(const e of enemies){if(e.dead)continue;const d=dist(e,p),ea=Math.atan2(e.y-p.y,e.x-p.x);if(d<s.range+TYPES[e.type].r&&Math.abs(angleDelta(ea,a))<1.03){const c=random()<s.crit;hit(e,s.attack*(c?1.8:1),c);e.x+=Math.cos(a)*13;e.y+=Math.sin(a)*13;}}
}
function cast(){
 const s=currentStats();if(p.mp<18||p.castT>0||p.dashT>0){if(p.mp<18)message('Không đủ linh lực');return;}
 const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);p.mp-=18;p.castT=.28;p.face=Math.cos(a)<0?-1:1;
 bolts.push({x:p.x+Math.cos(a)*25,y:p.y+Math.sin(a)*25,vx:Math.cos(a)*550,vy:Math.sin(a)*550,life:1.2,r:13,dmg:s.spellAtk,good:true,pierce:2,hit:[],spell:true});
 effect(p.x,p.y,'#77eede','ring',.35,{radius:46});
}
function enemyFire(e,angle,speed=220){const t=TYPES[e.type];bolts.push({x:e.x,y:e.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:3,r:10,dmg:e.v22Atk??t.atk*(1+room*.07+tower*.16),good:false,effect:t.effect||'',color:t.color});}
function updateEnemy(e,dt){
 if(e.dead)return;
 const t=TYPES[e.type],d=dist(e,p),a=Math.atan2(p.y-e.y,p.x-e.x),boss=bossType(e.type),fury=boss&&e.hp/e.max<.5;
 e.flash=Math.max(0,e.flash-dt);e.cd=Math.max(0,e.cd-dt);e.slow=Math.max(0,e.slow-dt);e.timer+=dt;
 if(e.burn>0){e.burn-=dt;e.burnTick-=dt;if(e.burnTick<=0){e.burnTick=.65;e.hp-=currentStats().burn;floating(e.x,e.y-25,'~'+currentStats().burn,'#ffad6e');if(e.hp<=0){hit(e,1);return;}}}
 if(e.state==='chase'){
  e.dir=Math.cos(a)<0?-1:1;
  if(d<t.range+10&&e.cd<=0){e.state='wind';e.timer=0;e.angle=a;}
  else{const sp=t.speed*(1+room*.035)*(fury?1.33:1)*(e.slow>0?1-currentStats().slow:1);let move=d>t.range*.72?1:((e.type===2||t.ranged)&&d<120?-0.7:0);
    e.x+=Math.cos(a)*sp*dt*move;e.y+=Math.sin(a)*sp*dt*move;}
 }else if(e.state==='wind'){
  if(e.timer>=t.wind*(fury?.64:1)){e.state='attack';e.timer=0;
    if(e.type===2||e.type===5)enemyFire(e,e.angle,e.type===5?205:248);
    else if(e.type===6){for(let i=-1;i<=1;i++)enemyFire(e,e.angle+i*.24,260);}
    else if(boss){const spread=e.type===7?(fury?4:3):2;for(let i=-spread;i<=spread;i++)enemyFire(e,e.angle+i*.27,fury?282:225);if(d<137)damagePlayer(e.v22Atk??t.atk);}
    else if(d<t.range+28)damagePlayer(e.v22Atk??t.atk*(1+room*.10));}
 }else if(e.state==='attack'){if(e.timer>.25){e.state='recover';e.timer=0;}}
 else if(e.state==='recover'){if(e.timer>t.cd*(fury?.64:1)){e.state='chase';e.timer=0;e.cd=.25;}}
 for(const o of enemies){if(o===e||o.dead)continue;const dx=e.x-o.x,dy=e.y-o.y,l=Math.hypot(dx,dy),rr=(t.r+TYPES[o.type].r)*.74;if(l>0.01&&l<rr){const k=(rr-l)*.22;e.x+=dx/l*k;e.y+=dy/l*k;}}
 blockCollision(e,t.r*.68);e.x=clamp(e.x,AREA.l+t.r,AREA.r-t.r);e.y=clamp(e.y,AREA.t+t.r,AREA.b-t.r);
}
function rewardOptions(){
 const pool=[];
 for(const id of Object.keys(TECH).filter(k=>!k.includes('_')&&!p.techs.includes(k)))pool.push({kind:'tech',id,name:TECH[id].name,desc:TECH[id].desc,tag:'CÔNG PHÁP · '+TECH[id].element});
 for(const r of RELICS.filter(a=>!p.relics.includes(a.id)))pool.push({kind:'relic',id:r.id,name:r.name,desc:r.desc,tag:'LINH BẢO · '+r.element});
 pool.push({kind:'boost',id:'atk',name:'Kiếm Tủy Đan',desc:'+8 công kích vĩnh viễn.',tag:'ĐAN DƯỢC'},{kind:'boost',id:'hp',name:'Tẩy Tủy Linh Dịch',desc:'+30 sinh mệnh tối đa; hồi 30 máu.',tag:'CƠ DUYÊN'},{kind:'boost',id:'mp',name:'Tụ Linh Ngọc',desc:'+20 linh lực tối đa và 4 linh thạch.',tag:'TÀI NGUYÊN'});
 const item=pick(EQUIPMENT.filter(a=>!a.v28Boss)),q=Math.min(7,Math.floor(room/4+tower+random()*2));pool.push({kind:'gear',id:item.id,quality:q,name:item.name,desc:'Công +'+item.atk+' · Thủ +'+item.def,tag:QUALITY[q]});const out=[];for(let i=0;i<3&&pool.length;i++){const n=Math.floor(random()*pool.length);out.push(pool.splice(n,1)[0]);}return out;
}
const EVENT_POOL=[
 {title:'Cổ kiếm vô danh',desc:'Trong bia đá vỡ, một thanh cổ kiếm tự phát ra kiếm ý.',options:[{name:'Nhận chủ',desc:'+16 công kích, mất 20 sinh mệnh.',action:'blade'},{name:'Lĩnh ngộ',desc:'+42 tu vi và 3 linh thạch.',action:'insight'},{name:'Trả về trận pháp',desc:'+25 sinh mệnh tối đa.',action:'mercy'}]},
 {title:'Tàn hồn tiền bối',desc:'Một bóng mờ đề nghị truyền thừa đổi lấy chút linh lực.',options:[{name:'Tiếp nhận',desc:'Nhận Xích Viêm Tâm Pháp; tiêu hao linh lực.',action:'fire'},{name:'Thỉnh giáo',desc:'+35 tu vi.',action:'study'},{name:'Siêu độ',desc:'+8 phòng ngự.',action:'guard'}]},
 {title:'Linh dược ẩn',desc:'Một linh thảo xanh phát sáng bên dòng suối dưới đất.',options:[{name:'Dùng trực tiếp',desc:'Hồi 60 sinh mệnh.',action:'heal'},{name:'Luyện đan',desc:'+3 Hồi Xuân Đan.',action:'pills'},{name:'Bán linh dược',desc:'+10 linh thạch.',action:'stones'}]}
];
function openEvent(){const e=pick(EVENT_POOL);modal={kind:'event',items:e.options,title:e.title,desc:e.desc};mouse.left=false;save();}
function select(i){
 if(mode==='menu'){if(i<3)start(i);return;}
 if(!modal)return;const item=modal.items?.[i];if(!item)return;const s=currentStats();
 if(modal.kind==='route'){travel(item.target);return;}if(modal.kind==='reward'){
  if(item.kind==='tech'&&!p.techs.includes(item.id))p.techs.push(item.id);
  else if(item.kind==='relic'&&!p.relics.includes(item.id))p.relics.push(item.id);
  else if(item.kind==='gear')addGear(item.id,item.quality);else if(item.kind==='boost'){if(item.id==='atk')p.bonusAtk+=8;else if(item.id==='hp'){p.bonusHp+=30;p.hp+=30;}else {p.bonusMp+=20;p.stones+=4;}}
  p.hp=Math.min(currentStats().hp,p.hp+Math.max(0,currentStats().hp-s.hp));p.mp=Math.min(currentStats().mp,p.mp+Math.max(0,currentStats().mp-s.mp));
  if(p.worldMode){modal=null;message('Nhận được '+item.name);save();return;}modal=null;cleared=true;message('Nhận được '+item.name+' · Nhấn E tiến vào bí cảnh');if(MAPS[room].secret||random()<.35)openEvent();save();
 }else if(modal.kind==='event'){
  switch(item.action){case'blade':p.bonusAtk+=16;p.hp=Math.max(1,p.hp-20);break;case'insight':gainXP(42);p.stones+=3;break;case'mercy':p.bonusHp+=25;p.hp+=25;break;case'fire':if(!p.techs.includes('fire'))p.techs.push('fire');p.mp=0;break;case'study':gainXP(35);break;case'guard':p.bonusDef+=8;break;case'heal':p.hp=Math.min(currentStats().hp,p.hp+60);break;case'pills':p.pills+=3;break;case'stones':p.stones+=10;break;}
  modal=null;message('Cơ duyên đã kết thúc — E để đi tiếp');save();
 }else if(modal.kind==='fusion'){
  if(p.stones<8||!item.parts.every(k=>p.techs.includes(k)))return;
  const old=currentStats();p.stones-=8;p.techs=p.techs.filter(k=>!item.parts.includes(k));p.techs.push(item.result);
  const ns=currentStats();p.hp=clamp(p.hp+Math.max(0,ns.hp-old.hp),1,ns.hp);p.mp=clamp(p.mp+Math.max(0,ns.mp-old.mp),0,ns.mp);modal=null;message('Dung hợp thành công: '+TECH[item.result].name);save();
 }
}
function fusion(){if(!p||mode!=='play')return;const a=FUSIONS.filter(f=>f.parts.every(k=>p.techs.includes(k)));if(!a.length){message('Cần sở hữu hai công pháp tương thích.');return;}
 if(p.stones<8){message('Cần 8 linh thạch để dung hợp công pháp.');return;}
 modal={kind:'fusion',items:a.map(f=>({...f,name:TECH[f.result].name,tag:'DUNG HỢP · 8 LINH THẠCH',desc:TECH[f.result].desc}))};mouse.left=false;}
function advance(){if(!cleared||modal)return;if(v21VisibleLoot().length){if(v21LeaveWarn!==v21Scope()){v21LeaveWarn=v21Scope();v21Say('Còn chiến lợi phẩm! Nhấn E lần nữa nếu muốn rời đi.');return;}}if(room>=LAST){mode='win';return;}const path=[room+1];if(room+2<LAST&&MAPS[room+1].boss===undefined)path.push(room+2);if(path.length===1){travel(path[0]);return;}modal={kind:'route',title:'CHỌN LỐI ĐI',items:path.map(n=>({name:MAPS[n].name,desc:MAPS[n].secret?'Dấu hiệu cơ duyên ẩn':MAPS[n].sub,tag:'LỐI ĐI',target:n}))};}function travel(n){p.hp=Math.min(currentStats().hp,p.hp+22);p.mp=currentStats().mp;enterRoom(n);}
function heal(){if(!p||mode!=='play'||modal)return;const s=currentStats();if(p.pills>0&&p.hp<s.hp){p.pills--;p.hp=Math.min(s.hp,p.hp+s.hp*.4);p.poisonT=0;p.fireT=0;floating(p.x,p.y-40,'Hồi Xuân Đan','#a5ffc4');}}
function openPanel(kind){if(mode!=='play')return;if(modal?.kind===kind){modal=null;invSelect=-1;}else if(!modal){modal={kind,items:[]};invSelect=-1;mouse.left=false;}}
function swapRelic(i){if(invSelect===-1){if(i<p.relics.length)invSelect=i;return;}if(i<p.relics.length&&i!==invSelect){const s=currentStats();[p.relics[i],p.relics[invSelect]]=[p.relics[invSelect],p.relics[i]];const a=currentStats();p.hp=clamp(p.hp+Math.max(0,a.hp-s.hp),1,a.hp);p.mp=clamp(p.mp+Math.max(0,a.mp-s.mp),0,a.mp);save();}invSelect=-1;}
function update(dt){
 if(V48X.active&&mode==='play'){v48xUpdate(dt);return;}if(v47tIsActive()){v47tUpdate(dt);return;}if(p?.worldMode&&mode==='play'){worldUpdate(dt);return;}elapsed+=dt;notifyT=Math.max(0,notifyT-dt);shakes*=Math.pow(.01,dt);
 for(const f of fx)f.life-=dt;fx=fx.filter(f=>f.life>0);
 for(const f of numbers){f.life-=dt;f.y-=35*dt;}numbers=numbers.filter(f=>f.life>0);
 if(mode!=='play'||!p)return;
 if(pressed.KeyC)v10Open();if(pressed.KeyI||pressed.Tab)openPanel('inventory');
 if(pressed.KeyM)openPanel('map');if(pressed.KeyG)openPanel('gear');
 if(pressed.Escape){if(['inventory','fusion','map','settings','gear','route','stats10','skill11'].includes(modal?.kind))modal=null;else if(!modal)openPanel('settings');}
 if(modal){V8.vx=V8.vy=0;v8Cancel();for(let i=0;i<3;i++)if(pressed['Digit'+(i+1)]&&modal.kind!=='npc8')select(i);return;}
 if(pressed.KeyR){fusion();if(modal)return;}
 if(pressed.KeyE){advance();return;}
 if(pressed.KeyF){auto=!auto;message(auto?'Tự động chém: BẬT':'Tự động chém: TẮT');}
 const s=currentStats();p.atkCd=Math.max(0,p.atkCd-dt);p.attackT=Math.max(0,p.attackT-dt);p.castT=Math.max(0,p.castT-dt);p.dashCd=Math.max(0,p.dashCd-dt);p.hurt=Math.max(0,p.hurt-dt);p.mp=Math.min(s.mp,p.mp+s.regen*dt);
 p.poisonT=Math.max(0,(p.poisonT||0)-dt);p.fireT=Math.max(0,(p.fireT||0)-dt);p.hazardCd=Math.max(0,(p.hazardCd||0)-dt);p.dotTick=Math.max(0,(p.dotTick||0)-dt);
 if((p.poisonT>0||p.fireT>0)&&p.dotTick===0){p.dotTick=.8;damagePlayer(p.fireT>0?9:6);}
 const movement=v8Input(dt,s,false);let {dx,dy,l}=movement;const oldX=p.x,oldY=p.y;
 if((pressed.Space||pressed.ShiftLeft||pressed.ShiftRight)&&p.dashCd<=0){
  if(!l){const a=targetAngle();dx=Math.cos(a);dy=Math.sin(a);}
  p.dx=dx/(Math.hypot(dx,dy)||1);p.dy=dy/(Math.hypot(dx,dy)||1);v8Cancel();V8.vx=V8.vy=0;p.dashT=V26_DASH_DUR;p.dashCd=s.dashCd;
 }
 if(p.dashT>0){v26DashStep(dt,false);}
 else{p.x+=movement.mx;p.y+=movement.my;}
 if(p.dashT<=0)blockCollision(p,17);p.x=clamp(p.x,AREA.l+24,AREA.r-24);p.y=clamp(p.y,AREA.t+24,AREA.b-24);v8AfterMove(dt,oldX,oldY,s);
 if(mouse.left||mouse.fire||pressed.KeyJ||auto)attack();
 if(mouse.cast||pressed.KeyL)cast();mouse.fire=false;mouse.cast=false;
 if(pressed.KeyH)heal();
 if(p.hazardCd===0&&p.dashT<=0){for(const h of MAPS[room].hazards){if(dist(h,p)<h.r){p.hazardCd=1.2;if(h.type==='poison')p.poisonT=3;else if(h.type==='fire')p.fireT=3;else damagePlayer(8);break;}}}
 v8Anim(dt);
 for(const e of enemies)updateEnemy(e,dt);
 for(const b of bolts){
  b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
  if(b.good){for(const e of enemies){if(e.dead||b.hit.includes(e))continue;if(dist(b,e)<b.r+TYPES[e.type].r){b.hit.push(e);v26BoltHit(e,b);if(b.spell)effect(e.x,e.y,'#70ceff','beam',.55,{radius:58});if(--b.pierce<=0){b.life=0;break;}}}}
  else if(dist(b,p)<b.r+16){v27BoltDamage(b);b.life=0;}
  if(b.x<AREA.l||b.x>AREA.r||b.y<AREA.t||b.y>AREA.b)b.life=0;
 }
 bolts=bolts.filter(b=>b.life>0);enemies=enemies.filter(e=>!e.dead);
 for(const d of drops){if(dist(d,p)<56){if(d.type==='stone'){p.stones+=d.value;floating(p.x,p.y-40,'+'+d.value+' linh thạch','#f6cd7a');}else p.hp=Math.min(s.hp,p.hp+d.value);d.dead=true;}}drops=drops.filter(d=>!d.dead);
 if(!v30Trial()&&!failed&&!cleared&&enemies.length===0&&!modal){
  clearDelay+=dt;if(clearDelay>.38){if(room===LAST){cleared=true;message('Bí cảnh đã được chinh phục! Nhặt chiến lợi phẩm, rồi nhấn E để kết thúc.');save();}
  else{modal={kind:'reward',items:rewardOptions()};mouse.left=false;save();}}
 }
 saveTimer+=dt;if(saveTimer>6){saveTimer=0;save();}
}
// ---------- rendering ----------
function sprite(id,index,cols,rows,x,y,size,face=1,anchor=.79,alpha=1){
 const a=imgs[id];if(!a?.ready||!a.img.naturalWidth){circle(x,y-20,size*.22,id==='monster'?'#976f5c':'#a1d1cb');return;}
 const fw=a.img.naturalWidth/cols,fh=a.img.naturalHeight/rows,ratio=fw/fh;
 const dw=size,dh=size/ratio;g.save();g.globalAlpha=alpha;g.translate(x,y);g.scale(face,1);
 g.drawImage(a.img,index%cols*fw,Math.floor(index/cols)*fh,fw,fh,-dw/2,-dh*anchor,dw,dh);g.restore();
}
function heroSprite(x,y){
 let id='action',i=0;const a=animation.t;
 if(animation.name==='run'){id='run';i=Math.floor(a*24)%12;}
 else if(animation.name==='attack')i=p.attackT>.20?6:p.attackT>.08?7:8;
 else if(animation.name==='cast')i=10;else if(animation.name==='dash')i=9;else if(animation.name==='hurt')i=11;else i=Math.floor(a*4)%4;
 circle(x,y+2,23,'#0008','',.75);
 if(p.dashT>0)sprite(id,i,4,3,x-p.dx*30,y-p.dy*30,100,p.face,.96,.25);
 sprite(id,i,4,3,x,y,112,p.face,.95,p.hurt>0&&Math.floor(p.hurt*22)%2===0?.55:1);
}
function monsterSprite(e){
 const t=TYPES[e.type],spriteType=t.spriteType??e.type,row=spriteType%4,boss=bossType(e.type),i=e.state==='wind'?2:e.state==='attack'?3:e.state==='recover'?0:Math.floor(elapsed*7+e.x*.01)%2;
 circle(e.x,e.y+2,t.r*1.05,'#0008','',.8);

 sprite(spriteType<4?'monster':'monster2',row*4+i,4,4,e.x,e.y,t.scale,e.dir,.89,e.flash>0?.65:1);
 if(e.burn>0)circle(e.x,e.y-17,8,'#f59a57','',.35);
 const w=boss?112:48,y=e.y-(boss?125:72);if(!boss)bar(e.x-w/2,y,w,4,e.hp/e.max,'#a86453','');
 if(boss)text('✦',e.x,y-13,13,C.gold,'center','bold');

}
// Native canvas layers: deterministic stonework, moving atmospheric effects and arena seals.
let floorCache=null,floorKey='';
const THEMES=[['#152520','#395948','#b7d194'],['#211d1b','#60513e','#c5a66c'],['#2e080b','#42282d','#bc9564'],['#10221e','#334b34','#a0c46e'],['#161d30','#4b536e','#a7c8ea'],['#390b08','#71412d','#f5a052'],['#1f102d','#4a365d','#c1a0ff'],['#161824','#574e38','#f0d192']];
function themeFor(m){return THEMES[Math.max(0,BIOMES.findIndex(n=>m.name.startsWith(n)))];}
function seal(ctx,x,y,r,c,angle=0,opacity=1){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=opacity;
 const ring=ctx.createRadialGradient(0,0,r*.58,0,0,r);ring.addColorStop(0,'#14100c');ring.addColorStop(.82,'#5e4a32');ring.addColorStop(1,'#b18b51');
 ctx.fillStyle=ring;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();
 ctx.fillStyle='#231e18';ctx.beginPath();ctx.arc(0,0,r*.73,0,TAU);ctx.fill();
 const R=r*.70;ctx.fillStyle='#ad8a50';ctx.beginPath();ctx.arc(0,0,R,-Math.PI/2,Math.PI/2);ctx.arc(0,R/2,R/2,Math.PI/2,-Math.PI/2,true);ctx.arc(0,-R/2,R/2,Math.PI/2,-Math.PI/2);ctx.fill();
 for(const [yy,cc] of [[-R/2,'#241d18'],[R/2,'#ad8a50']]){ctx.fillStyle=cc;ctx.beginPath();ctx.arc(0,yy,R*.12,0,TAU);ctx.fill();}
 for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*TAU/8);ctx.fillStyle=c;for(let j=0;j<3;j++){const yy=-r*.93+j*6;if((i>>j)&1)ctx.fillRect(-12,yy,24,3);else{ctx.fillRect(-12,yy,9,3);ctx.fillRect(3,yy,9,3);}}ctx.restore();}
 ctx.strokeStyle='#2a2015';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r*.76,0,TAU);ctx.stroke();ctx.restore();
}
function diamond(ctx,x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r*1.6,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r*1.6,y);ctx.closePath();ctx.fill();}
function buildFloor(m,theme){
 const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const q=canvas.getContext('2d');const [sky,stone,gold]=theme;
 q.fillStyle=sky;q.fillRect(0,0,W,H);const haze=q.createRadialGradient(640,350,50,640,350,690);haze.addColorStop(0,stone);haze.addColorStop(.6,sky);haze.addColorStop(1,'#020305');q.fillStyle=haze;q.fillRect(0,0,W,H);
 // Abstract cloud ridges outside the suspended platform.
 for(let j=0;j<11;j++){q.fillStyle=j%2?'#0003':'#0005';q.beginPath();q.moveTo(0,120+j*65);for(let i=0;i<=16;i++)q.lineTo(i*80,100+j*65+Math.sin(i*1.7+j*1.3)*23+Math.cos(i*.5-j)*17);q.lineTo(W,H);q.lineTo(0,H);q.closePath();q.fill();}
 q.save();q.beginPath();q.roundRect(AREA.l-5,AREA.t-5,AREA.r-AREA.l+10,AREA.b-AREA.t+10,44);q.clip();q.fillStyle='#201f1d';q.fillRect(0,0,W,H);
 const tile=42;for(let y=AREA.t-7;y<AREA.b+tile;y+=tile)for(let x=AREA.l-7;x<AREA.r+tile;x+=tile){let r=(Math.sin(x*12.9898+y*78.233+room*7+seed)*43758.5453)%1;r=Math.abs(r);q.fillStyle=stone;q.fillRect(x,y,tile,tile);q.fillStyle=r>.5?`rgba(240,220,180,${(r-.5)*.19})`:`rgba(0,0,0,${(.5-r)*.83})`;q.fillRect(x,y,tile,tile);q.fillStyle='#08090a9c';q.fillRect(x,y,tile,1);q.fillRect(x,y,1,tile);q.fillStyle='#ffffff10';q.fillRect(x+1,y+1,tile-2,2);q.fillRect(x+1,y+2,1,tile-3);if(r>.86){q.strokeStyle='#120e0e73';q.lineWidth=1;q.beginPath();q.moveTo(x+4,y+8);q.lineTo(x+21,y+17);q.lineTo(x+29,y+30);q.lineTo(x+39,y+37);q.stroke();}}
 // Fine-grained stone texture, cached once per room, not recalculated every frame.
 let grain=(seed+room*31337+tower*777)>>>0;const dustRand=()=>{grain=(Math.imul(grain,1664525)+1013904223)>>>0;return grain/4294967296;};
 for(let i=0;i<15000;i++){const x=AREA.l+dustRand()*(AREA.r-AREA.l),y=AREA.t+dustRand()*(AREA.b-AREA.t),k=dustRand();q.fillStyle=k>.55?'#ffffff0b':'#00000017';q.fillRect(Math.floor(x),Math.floor(y),1+Math.floor(dustRand()*4),1+Math.floor(dustRand()*3));}
 seal(q,640,363,194,gold,0,.72);const shadow=q.createRadialGradient(640,363,185,640,363,655);shadow.addColorStop(0,'#00000000');shadow.addColorStop(1,'#00000092');q.fillStyle=shadow;q.fillRect(AREA.l,AREA.t,AREA.r-AREA.l,AREA.b-AREA.t);
 // Gold-inlaid inlaid rays, platform trim and corner ornaments.
 q.strokeStyle=gold;q.globalAlpha=.42;q.lineWidth=2;for(let i=0;i<8;i++){const a=i*TAU/8;q.beginPath();q.moveTo(640+Math.cos(a)*196,363+Math.sin(a)*196);q.lineTo(640+Math.cos(a)*235,363+Math.sin(a)*235);q.stroke();}q.globalAlpha=1;
 q.restore();q.beginPath();q.roundRect(AREA.l-6,AREA.t-6,AREA.r-AREA.l+12,AREA.b-AREA.t+12,42);q.strokeStyle='#21170f';q.lineWidth=16;q.stroke();q.lineWidth=9;q.strokeStyle='#785a35';q.stroke();q.lineWidth=2;q.strokeStyle=gold;q.stroke();
 for(let x=115;x<1180;x+=70){diamond(q,x,AREA.t-6,4,gold);diamond(q,x,AREA.b+6,4,gold);}for(let y=155;y<600;y+=65){diamond(q,AREA.l-6,y,4,gold);diamond(q,AREA.r+6,y,4,gold);}
 return canvas;
}
const V46_FOG_CACHE=new Map();const V46_GLOW2_CACHE=new Map();
function paintScene(){
 const m=MAPS[room],base=themeFor(m),theme=m.boss!==undefined?['#37080e','#49433d','#dcb674']:base,[sky,stone,gold]=theme,key=seed+':'+tower+':'+room;
 if(floorKey!==key||!floorCache){floorCache=buildFloor(m,theme);floorKey=key;}g.drawImage(floorCache,0,0);
 // Slowly revolving spiritual seal and breathing perimeter light.
 g.save();g.globalCompositeOperation='screen';g.globalAlpha=.18+.07*Math.sin(elapsed*1.5);g.strokeStyle=gold;g.lineWidth=2;
 g.beginPath();g.arc(640,363,205,elapsed*.11,elapsed*.11+Math.PI*1.25);g.stroke();for(let i=0;i<8;i++){const a=elapsed*.14+i*TAU/8;diamond(g,640+Math.cos(a)*205,363+Math.sin(a)*205,3,gold);}g.restore();
 // Thin animated cloud streams at the rim; remain clear of combat silhouettes.
 for(let i=0;i<14;i++){const x=(i*193+elapsed*(12+i%4*4))%(W+240)-120,y=104+(i%2)*507+Math.sin(elapsed*.6+i)*13;g.save();g.translate(x,y);g.scale(2.7,.36);let fog=V46_FOG_CACHE.get(gold);if(!fog){fog=g.createRadialGradient(0,0,0,0,0,53);fog.addColorStop(0,gold+'24');fog.addColorStop(1,gold+'00');V46_FOG_CACHE.set(gold,fog);}g.fillStyle=fog;g.fillRect(-53,-53,106,106);g.restore();}
 for(let i=0;i<38;i++){const x=AREA.l+((i*119.7+elapsed*(9+i%5))%(AREA.r-AREA.l)),y=AREA.t+((i*63.9-elapsed*(8+i%3)+100000)%(AREA.b-AREA.t));circle(x,y,1+i%3*.5,gold,'',.18+.19*(1+Math.sin(elapsed*1.8+i)));}
 // Stone guardian/forest silhouettes at the four corners, with wisps of light.
 const art=imgs[m.terrain];if(art?.ready){g.save();g.imageSmoothingEnabled=false;g.globalAlpha=.56;g.drawImage(art.img,82,115,172,172);g.drawImage(art.img,1030,115,172,172);g.restore();}
 for(const [x,y] of [[86,150],[1190,150],[86,574],[1190,574]]){circle(x,y,10,'#513a20',gold);const _gk2=x+','+y;let glow=V46_GLOW2_CACHE.get(_gk2);if(!glow){glow=g.createRadialGradient(x,y,2,x,y,33);glow.addColorStop(0,'#ffdf8a99');glow.addColorStop(1,'#ffdf8a00');V46_GLOW2_CACHE.set(_gk2,glow);}g.fillStyle=glow;g.fillRect(x-33,y-33,66,66);circle(x,y+Math.sin(elapsed*4+x)*3,4,'#ffe3a0');}
 for(const h of m.hazards){const col=h.type==='fire'?'#fa7840':h.type==='poison'?'#a9ce55':'#66d8de';const pulse=.5+.15*Math.sin(elapsed*2.8+h.x);circle(h.x,h.y,h.r,col+'26',col,pulse);g.save();g.strokeStyle=col;g.globalAlpha=.6;g.lineWidth=2;g.beginPath();g.arc(h.x,h.y,h.r*.76,elapsed*.8,elapsed*.8+Math.PI*1.5);g.stroke();g.restore();for(let i=0;i<8;i++){const a=i*TAU/8+elapsed*.7;circle(h.x+Math.cos(a)*h.r*.72,h.y+Math.sin(a)*h.r*.72,2,col,'',.75);}}
 for(const b of BLOCKS[room]||[]){circle(b.x,b.y+8,b.r,'#080a0d99');g.fillStyle='#2e2d2e';g.strokeStyle=gold;g.lineWidth=1;g.beginPath();g.moveTo(b.x-b.r,b.y+8);g.lineTo(b.x-b.r*.7,b.y-b.r*.58);g.lineTo(b.x+b.r*.13,b.y-b.r);g.lineTo(b.x+b.r,b.y+5);g.lineTo(b.x+b.r*.22,b.y+b.r*.43);g.closePath();g.fill();g.stroke();}
 if(cleared){const x=640,y=135;circle(x,y,38,'#4cc7b636','#a8ffee',.65+.25*Math.sin(elapsed*3));circle(x,y,28,'#05777c55','#d1f7eb');for(let i=0;i<8;i++){const a=elapsed+i*TAU/8;diamond(g,x+Math.cos(a)*35,y+Math.sin(a)*35,3,'#c5fcdd');}text('QUA CỔNG · E',x,190,13,'#d7edca','center','bold');buttons.push({x:580,y:100,w:120,h:100,fn:advance});}
}
function renderEffects(){
 for(const b of bolts){if(b.good&&b.kind)continue;
  const col=b.good?'#a6fff0':(b.color||'#f58b70');const a=Math.atan2(b.vy,b.vx);
  g.save();g.translate(b.x,b.y);g.rotate(a);g.shadowBlur=14;g.shadowColor=col;g.fillStyle=col;g.beginPath();
  if(b.good){g.moveTo(19,0);g.lineTo(-16,7);g.lineTo(-6,0);g.lineTo(-16,-7);g.closePath();}else g.arc(0,0,8,0,TAU);g.fill();g.restore();}
 for(const f of fx){if(['punch','castseal','v11cut','v11burst','v11cast'].includes(f.kind))continue;let q=1-f.life/f.max;g.save();g.globalAlpha=1-q;
  if(f.kind==='beam'){const a=Math.sin(Math.PI*Math.min(1,q))*1.3;const width=24*(1-q)+4;g.globalCompositeOperation='screen';g.globalAlpha=Math.min(1,a);let beam=g.createLinearGradient(f.x-width*2,0,f.x+width*2,0);beam.addColorStop(0,'#0a67ff00');beam.addColorStop(.35,'#40aaffaa');beam.addColorStop(.5,'#efffff');beam.addColorStop(.65,'#40aaffaa');beam.addColorStop(1,'#0a67ff00');g.fillStyle=beam;g.fillRect(f.x-width*2,0,width*4,f.y+4);circle(f.x,f.y,15+q*55,'','#9cedff',1-q);for(let i=0;i<20;i++){const a=i*TAU/20;const l=10+q*(36+(i%4)*12);g.strokeStyle=i%2?'#f7ffff':'#68c4ff';g.lineWidth=1.6;g.beginPath();g.moveTo(f.x+Math.cos(a)*l,f.y+Math.sin(a)*l);g.lineTo(f.x+Math.cos(a)*(l+13),f.y+Math.sin(a)*(l+13));g.stroke();}}else if(f.kind==='slash'){g.strokeStyle=f.color;g.lineWidth=13*(1-q)+2;g.shadowBlur=12;g.shadowColor='#73d9c9';g.beginPath();g.arc(f.x,f.y,f.radius*.9,f.a-1.0,f.a+1.0);g.stroke();g.lineWidth=2;g.strokeStyle='#fff';g.beginPath();g.arc(f.x,f.y,f.radius*.78,f.a-.78,f.a+.78);g.stroke();}
  else if(f.kind==='hit'){for(let j=0;j<5;j++){const a=j*TAU/5+f.x;g.strokeStyle=f.color;g.lineWidth=2;g.beginPath();g.moveTo(f.x+Math.cos(a)*q*14,f.y+Math.sin(a)*q*14);g.lineTo(f.x+Math.cos(a)*(q*28+4),f.y+Math.sin(a)*(q*28+4));g.stroke();}}
  else {g.strokeStyle=f.color;g.lineWidth=3;g.beginPath();g.arc(f.x,f.y,8+q*(f.radius||50),0,TAU);g.stroke();}g.restore();}
 for(const n of numbers){g.save();g.globalAlpha=clamp(n.life/.3,0,1);text(n.t,n.x,n.y,17,n.c,'center','bold');g.restore();}
}
const V46_ORN_CACHE=new Map();
function ornament(x,y,w,h,fill='#130e15ef'){
 const _ok=x+'|'+y+'|'+h+'|'+fill;let gr=V46_ORN_CACHE.get(_ok);if(!gr){gr=g.createLinearGradient(x,y,x,y+h);gr.addColorStop(0,'#2e2422');gr.addColorStop(.25,fill);gr.addColorStop(1,'#100d14');V46_ORN_CACHE.set(_ok,gr);}
 box(x,y,w,h,gr,'#9d7847',3);box(x+4,y+4,w-8,h-8,'#00000000','#57432f',2);
 for(const [a,b,sx,sy] of [[x+5,y+5,1,1],[x+w-5,y+5,-1,1],[x+5,y+h-5,1,-1],[x+w-5,y+h-5,-1,-1]]){g.strokeStyle='#dcc18a';g.lineWidth=1.6;g.beginPath();g.moveTo(a+sx*22,b);g.lineTo(a+sx*7,b);g.lineTo(a,b+sy*7);g.lineTo(a,b+sy*22);g.stroke();diamond(g,a+sx*5,b+sy*5,3,'#d5ac68');}
}
function uiIcon(i,x,y,size=44,dim=false){
 const a=imgs.ui;if(!a?.ready){circle(x+size/2,y+size/2,size*.45,'#273a38','#ac8d57');return;}
 const fw=a.img.naturalWidth/4,fh=a.img.naturalHeight/2;g.save();g.globalAlpha=dim?.45:1;
 g.drawImage(a.img,(i%4)*fw,Math.floor(i/4)*fh,fw,fh,x,y,size,size);g.restore();
}
function hotkey(i,x,y,key,desc,fn,dim=false){
 uiIcon(i,x,y,40,dim);text(key,x+20,y+46,10,C.gold,'center','bold');
 buttons.push({x,y,w:40,h:43,fn});if(mouse.x>=x&&mouse.x<=x+40&&mouse.y>=y&&mouse.y<=y+43){box(x-56,y-26,152,23,'#071518','#b89b63',4);text(desc,x+20,y-14,12,C.paper,'center');}
}
function aimNearest(){
 const target=enemies.filter(e=>!e.dead).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(target){const x=mouse.x,y=mouse.y;mouse.x=target.x;mouse.y=target.y;return()=>{mouse.x=x;mouse.y=y}}return()=>{};
}
const V46_GRAD_CACHE=new Map();
function bladeBar(x,y,w,h,ratio,color,label=''){
 ratio=clamp(ratio,0,1);g.save();g.beginPath();g.moveTo(x,y);g.lineTo(x+w-8,y);g.lineTo(x+w,y+h/2);g.lineTo(x+w-8,y+h);g.lineTo(x,y+h);g.closePath();g.fillStyle='#08080a';g.fill();g.strokeStyle='#bb9256';g.lineWidth=1.4;g.stroke();g.clip();const _bk=x+'|'+y+'|'+h+'|'+color;let grad=V46_GRAD_CACHE.get(_bk);if(!grad){grad=g.createLinearGradient(x,y,x,y+h);grad.addColorStop(0,'#ffffff33');grad.addColorStop(.4,color);grad.addColorStop(1,'#00000090');V46_GRAD_CACHE.set(_bk,grad);}g.fillStyle=color;g.fillRect(x+2,y+2,(w-4)*ratio,h-4);g.fillStyle=grad;g.fillRect(x+2,y+2,(w-4)*ratio,h-4);g.restore();if(label)text(label,x+12,y+h/2,10,'#fff1d9','left','600');
}
function hud(){/* HUD duy nhất — xem v35Render() — bản đang chạy ở src/47_v45_v35.js. Đã gộp 12 lớp vá cũ (T02). */v35Render(false);}
function wrapText(s,x,y,mw,size,color,align='left',line=22){
 g.font=size+'px V45Sans,"Segoe UI",Arial,sans-serif';let str='',yy=y;
 for(const word of String(s).split(' ')){const next=str?str+' '+word:word;if(g.measureText(next).width>mw&&str){text(str,x,yy,size,color,align);str=word;yy+=line;}else str=next;}
 if(str){text(str,x,yy,size,color,align);yy+=line;}return yy;
}
function addButton(x,y,w,h,label,fn,accent=false){
 const over=mouse.x>=x&&mouse.x<=x+w&&mouse.y>=y&&mouse.y<=y+h;
 box(x,y,w,h,over?'#62442b':accent?'#50341e':'#22191f',over?'#f5d897':accent?'#c59b61':'#765b42',3);text(label,x+w/2,y+h/2,15,accent?C.gold:C.paper,'center','600');buttons.push({x,y,w,h,fn});
}
let V46_MENU_GRAD=null;
function menu(){
 g.fillStyle='#0a151c';g.fillRect(0,0,W,H);
 if(!V46_MENU_GRAD){V46_MENU_GRAD=g.createRadialGradient(640,320,90,640,320,640);V46_MENU_GRAD.addColorStop(0,'#244039');V46_MENU_GRAD.addColorStop(1,'#081119');}g.fillStyle=V46_MENU_GRAD;g.fillRect(0,0,W,H);
 for(let i=0;i<32;i++){const x=(i*137.39)%W,y=(i*91.7+elapsed*7)%H;circle(x,y,1.6,'#d5cba0','',.5);}
 g.strokeStyle='#969b6d55';g.lineWidth=1;for(const r of [195,211,236]){g.beginPath();g.arc(640,320,r,0,TAU);g.stroke();}
 text('VẠN ĐẠO TU TIÊN',640,91,56,'#ecdbc0','center','bold');text('V7 · LINH CẢNH HD-2D',640,144,20,C.gold,'center','600');
 text('Mỗi cơ duyên là một con đường · Mỗi lượt chơi là một vận mệnh',640,186,16,C.muted,'center');
 for(let i=0;i<3;i++){const c=CLASSES[i],x=151+i*329;
  box(x,245,308,250,'#12272be8','#65786a',14);text(c.icon,x+154,300,50,C.gold,'center','bold');text(c.name,x+154,354,26,C.paper,'center','bold');wrapText(c.description,x+154,396,255,15,C.muted,'center');addButton(x+30,445,248,38,'Chọn '+c.name+'  ·  '+(i+1),()=>start(i),true);}
 if(canResume())addButton(510,525,260,44,'Tiếp tục hành trình',resume,true);
 text('WASD di chuyển · Chuột trái/phải chiến đấu · Shift/Space lướt · M bản đồ',640,616,15,C.paper,'center');
 text('Bản thử nghiệm độc lập, không sử dụng mã nguồn hoặc tài nguyên từ Bait Soul',640,674,12,'#7f9a95','center');
}
function panel(){
 if(!modal)return;g.fillStyle='#061016bb';g.fillRect(0,0,W,H);
 ornament(130,124,1020,470,'#1d151bdc');
 const k=modal.kind,title=k==='reward'?'CHỌN CƠ DUYÊN':k==='fusion'?'DUNG HỢP CÔNG PHÁP':k==='route'?'CHỌN LỐI ĐI':k==='gear'?'THẦN BINH & LUYỆN KHÍ':k==='event'?(modal.title||'CƠ DUYÊN BÍ CẢNH'):k==='map'?(p.worldMode?'ĐẠI ĐỊA ĐỒ · VẠN GIỚI':'BẢN ĐỒ BÍ CẢNH'):k==='settings'?'CÀI ĐẶT':'TÚI ĐỒ & CÔNG PHÁP';
 text(title,640,168,29,C.gold,'center','bold');
 if(k==='gear'){
  equipInit();text('Trang bị · '+p.gear.length+'/48   |   Linh thạch '+p.stones,170,206,15,C.jade);
  for(let j=0;j<12;j++){const i=gearPage*12+j,item=p.gear[i],d=gearDef(item),x=165+j%6*102,y=228+Math.floor(j/6)*82;box(x,y,94,74,'#29201e',item?QUALITY_COL[item.quality]:'#6b5036',6);if(item){gearIcon(d,x+12,y+2,52);text('+'+item.up,x+80,y+12,11,C.gold,'right');if(p.worn[d.slot]===i)text('ĐANG DÙNG',x+47,y+64,10,C.jade,'center');buttons.push({x,y,w:94,h:74,fn:()=>gearSel=i});}}
  addButton(165,408,110,35,'Trang trước',()=>gearPage=Math.max(0,gearPage-1));addButton(283,408,110,35,'Trang sau',()=>gearPage=Math.min(3,gearPage+1));text('Trang '+(gearPage+1)+'/4',410,425,13,C.muted);
  const item=p.gear[gearSel],d=gearDef(item);if(item){gearIcon(d,855,225,106);text(d.name,925,343,19,QUALITY_COL[item.quality],'center','bold');text(QUALITY[item.quality]+' · +'+item.up+' · '+d.element,925,371,14,C.paper,'center');text('Công +'+Math.round(d.atk*(1+item.quality*.18+item.up*.12))+'  |  Thủ +'+Math.round(d.def*(1+item.quality*.18+item.up*.12)),925,397,15,C.jade,'center');addButton(810,418,220,36,'Trang bị',()=>equip(gearSel),true);addButton(810,462,220,36,'Cường hóa · '+(6+item.up*4)+' linh thạch',()=>upgradeGear(gearSel));}
  else text('Chọn một vật phẩm để xem',925,355,15,C.muted,'center');
  addButton(515,535,250,35,'Đóng · ESC',()=>modal=null);
 }else if(k==='inventory'){
  const s=currentStats(),left=163,right=600;ornament(left,208,407,300,'#1b292a');text('CÔNG PHÁP · '+p.techs.length,left+17,231,16,C.jade,'left','bold');
  p.techs.slice(0,7).forEach((id,i)=>{gearIcon({sheet:'books',index:BOOK_ICON[id]??8},left+10,250+i*29,27);text(TECH[id]?.name||id,left+41,265+i*29,14,C.paper);text(TECH[id]?.element||'',left+388,265+i*29,12,C.gold,'right');});
  text('Công '+Math.round(s.attack)+'  |  Thủ '+Math.round(s.def)+'  |  Tốc '+Math.round(s.speed),left+17,482,13,C.gold);
  text('LINH BẢO · 4 ô đầu trang bị',right,214,16,C.jade,'left','bold');
  const elementColor={Kim:'#e7bf68',Mộc:'#89cf95',Thủy:'#8ecbfa',Hỏa:'#f9a076',Thổ:'#c1ab91'};
  for(let i=0;i<12;i++){const x=right+(i%4)*125,y=238+Math.floor(i/4)*68,r=RELICS.find(a=>a.id===p.relics[i]);
   box(x,y,113,59,i===invSelect?'#495846':i<4?'#2b4038':'#17282a',i===invSelect?C.gold:i<4?'#b1965d':'#48635d',6);
   if(r){circle(x+18,y+22,11,elementColor[r.element]||C.gold,'#d1b16b');text(r.element,x+18,y+22,9,'#16201b','center','bold');wrapText(r.name,x+32,y+16,76,11,C.paper,'left',13);buttons.push({x,y,w:113,h:59,fn:()=>swapRelic(i)});}
   else{text(i<4?'Trang bị':'Dự trữ',x+56,y+30,11,'#708880','center');}}
  let sel=RELICS.find(r=>r.id===p.relics[invSelect]);text(sel?sel.desc:'Chọn hai ô để đổi vị trí, thay đổi liên kết ngũ hành.',right,458,13,C.gold);
  const gen={Mộc:'Hỏa',Hỏa:'Thổ',Thổ:'Kim',Kim:'Thủy',Thủy:'Mộc'};let links=0;
  for(let i=1;i<Math.min(p.relics.length,4);i++){let a=RELICS.find(x=>x.id===p.relics[i-1]).element,b=RELICS.find(x=>x.id===p.relics[i]).element;if(gen[a]===b||gen[b]===a)links++;}
  text('Liên kết trang bị: '+links+'   ·   mỗi liên kết +7% công kích, +2 thủ',right,484,13,C.jade);
  addButton(525,526,230,40,'Đóng bảng · ESC',()=>{modal=null;invSelect=-1;});
 }else if(k==='map'&&p.worldMode){worldMapPanel();}else if(k==='map'){
  for(let i=0;i<MAPS.length;i++){const x=175+i%5*186,y=215+Math.floor(i/5)*74,m=MAPS[i];ornament(x,y,174,68,i===room?'#24443b':'#1b2c2c');
   const a=imgs[m.terrain];if(a?.ready){g.save();g.globalAlpha=i>room?.40:.90;g.drawImage(a.img,x+4,y+7,50,50);g.restore();}
   wrapText(m.name,x+54,y+15,116,11,i===room?C.gold:C.paper,'left',13);text(i===room?'Hiện tại':p.visited.includes(i)?'Đã qua':'Chưa khám phá',x+54,y+53,10,C.muted);}
  addButton(525,526,230,40,'Đóng bản đồ · ESC',()=>modal=null);
 }else if(k==='settings'){
  addButton(390,248,500,48,'Tự động đánh: '+(auto?'BẬT':'TẮT'),()=>auto=!auto,true);
  addButton(390,311,500,48,'Rung màn hình: '+(screenShake?'BẬT':'TẮT'),()=>screenShake=!screenShake,true);
  addButton(390,374,500,48,'Tiếp tục chơi',()=>modal=null,true);
  text('Tiến trình được lưu tự động trong trình duyệt.',640,465,14,C.muted,'center');
 }else{
  if(modal.desc)wrapText(modal.desc,640,208,930,15,C.muted,'center');
  const arr=modal.items||[],width=286,space=25,left=640-(arr.length*width+(arr.length-1)*space)/2;
  arr.forEach((it,i)=>{const x=left+i*(width+space);box(x,248,width,260,'#1b3333','#607f70',12);text(it.tag||'LỰA CHỌN '+(i+1),x+width/2,272,12,C.jade,'center','bold');if(it.kind==='gear')gearIcon(EQUIPMENT[it.id],x+13,291,50);if(it.kind==='tech')gearIcon({sheet:'books',index:BOOK_ICON[it.id]??8},x+13,291,50);wrapText(it.name,x+width/2,324,width-30,19,C.gold,'center',25);wrapText(it.desc,x+width/2,386,width-32,16,C.paper,'center');addButton(x+24,453,width-48,36,'Chọn · '+(i+1),()=>select(i),true);});
  if(k==='fusion')addButton(535,535,210,36,'Hủy · ESC',()=>modal=null);
 }
}
function endScreen(){
 g.fillStyle='#02080bdc';g.fillRect(0,0,W,H);
 text(mode==='win'?'PHÁ TRẬN THÀNH CÔNG':'ĐẠO TÂM TAN VỠ',640,180,42,mode==='win'?C.gold:C.red,'center','bold');
 text(mode==='win'?'Ngươi đã chinh phục Vạn Giới Bí Cảnh.':'Lần chuyển thế tiếp theo, cơ duyên sẽ đổi khác.',640,240,19,C.paper,'center');
 if(p){text('Cảnh giới: '+realm()+'     ·     Yêu thú đã hạ: '+p.kills+'     ·     Công pháp: '+p.techs.length,640,301,17,C.jade,'center');if(mode==='dead')sprite('extra',11,4,3,640,420,165,1,.89);}
 if(mode==='win')addButton(490,375,300,40,'Trở về Thanh Thạch Thôn',()=>{mode='play';enterWorld('thon',300);save();},true);if(mode==='win')addButton(490,430,300,45,'Vạn Giới Tháp · Tầng '+(tower+1),()=>{tower++;p.visited=[];generateWorld(seed,tower);mode='play';p.hp=currentStats().hp;p.mp=currentStats().mp;enterRoom(0);},true);addButton(500,495,280,48,'Chuyển thế — chơi hành trình mới',()=>{mode='menu';modal=null;p=null;});
 text('Không có hai lần tu tiên hoàn toàn giống nhau.',640,600,14,C.muted,'center');
}
function draw(){
 buttons=[];
 if(mode==='menu'){menu();return;}
 if(!p)return;if(V48X.active){v48xDraw();return;}if(v47tIsActive()){v47tDraw();return;}if(p.worldMode&&mode==='play'){worldDraw();return;}g.save();if(screenShake&&shakes>.2)g.translate(Math.sin(elapsed*80)*shakes,Math.cos(elapsed*67)*shakes);
 paintScene();v8DrawRoute();
 for(const d of drops)circle(d.x,d.y,7,d.type==='stone'?C.gold:'#79e3a5','#fff2bc');
 const chars=[...enemies.map(e=>({y:e.y,e})),{y:p.y,hero:true}].sort((a,b)=>a.y-b.y);
 for(const c of chars)if(c.hero)heroSprite(p.x,p.y);else monsterSprite(c.e);
 renderEffects();g.restore();v21DrawLoot();hud();
 if(modal)panel();if(mode==='dead'||mode==='win')endScreen();

}
function pointer(e){const r=cv.getBoundingClientRect();mouse.x=(e.clientX-r.left)*W/r.width;mouse.y=(e.clientY-r.top)*H/r.height;mouse.inside=true;}
cv.addEventListener('pointermove',pointer);
cv.addEventListener('pointerleave',()=>mouse.inside=false);
cv.addEventListener('pointerdown',e=>{
 pointer(e);e.preventDefault();
 if(e.button===0){for(const b of [...buttons].reverse())if(mouse.x>=b.x&&mouse.x<=b.x+b.w&&mouse.y>=b.y&&mouse.y<=b.y+b.h){mouse.left=false;b.fn();return;}}
 if(V48X.active){if(e.button===0&&!modal)v48xClick();return;}if(v47tIsActive()){if(e.button===0&&!modal)v47tClick();return;}
 if(mode!=='play'||modal)return;
 if(e.button===0){v8PointerDown();}
 else if(e.button===2){mouse.right=true;mouse.cast=true;}
});
