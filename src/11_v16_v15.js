'use strict';
// V15: original HD-2D environment sprite atlas and geographic relief map.
// Game art inspiration: Wandering Sword (wuxia landscapes), Tale of Immortal (cultivator identities).
for(const [key,url] of Object.entries(V15_ASSETS)){const img=new Image();imgs[key]={img,ready:false};img.onload=()=>imgs[key].ready=true;img.src=url;}
const V15_CLASS=['cloud','herb','forge','shadow'];
function v15NPCIndex(d){const main=V9_NPC_ORDER.indexOf(d.id);if(main>=0)return main;const k=Number(d.id.replace('v14_roam_',''));return Number.isFinite(k)?[13,12,5,4,15,10,11,6,8,14,3,9,5,12,13,14,11,4,15,10][k%20]:4;}
function v15Sprite(key,x,y,h,flip=1,alpha=1,sway=0){const a=imgs[key];if(!a?.ready)return false;const im=a.img,w=h*im.naturalWidth/im.naturalHeight;g.save();g.translate(x,y);g.scale(flip,1);g.globalAlpha*=alpha;g.imageSmoothingEnabled=true;g.rotate(sway);g.drawImage(im,-w/2,-h,w,h);g.restore();return true;}
// Consistent artwork in dialogue and on the map; old authored frames remain a fallback.
const v15FigureOld=v8Figure;
v8Figure=function(d,x,y,scale=1,face=1,phase=0,walking=false){const id=v15NPCIndex(d);if(v15Sprite('v15npc'+id,x,y,78*scale,face,1,walking?Math.sin(phase*TAU)*.015:0))return;v15FigureOld(d,x,y,scale,face,phase,walking);};
const v15NPCDrawOld=v9NPCDraw;
v9NPCDraw=function(d,n,z){const k=V9_NPC_ORDER.indexOf(d.id);
 const dir=n.dir??2,back=dir>=5,phase=(n.gait||0)%12,flip=V9_FLIP[dir],id=v15NPCIndex(d);let key=(back&&imgs['v15back'+id]?.ready?'v15back':'v15npc')+id;
 if(k>=0&&back&&!imgs['v15back'+id]?.ready){v15NPCDrawOld(d,n,z);return;}
 const a=imgs[key];if(!a?.ready){v15NPCDrawOld(d,n,z);return;}const im=a.img,h=73,w=h*im.naturalWidth/im.naturalHeight,bob=n.walking?Math.abs(Math.sin(phase*Math.PI/6))*1.1:Math.sin(elapsed*2.2+n.x*.05)*.25;
 g.save();g.translate(z.x,z.y);g.scale(flip,1);g.imageSmoothingEnabled=true;
 // Twelve evenly spaced gait samples; fixed foot anchor and subtle lower-body deformation.
 const slices=12;for(let i=0;i<slices;i++){const top=i/slices,bottom=(i+1)/slices,lower=clamp((top-.55)/.45,0,1),sway=n.walking?Math.sin(phase*Math.PI/6)*1.7*lower:0;g.drawImage(im,0,top*im.naturalHeight,im.naturalWidth,(bottom-top)*im.naturalHeight,-w/2+sway,-h+top*h-bob*(1-lower),w,h/slices+.28);}
 g.restore();const actor=v14Actor(d.id);if(actor?.sect&&dist(n,p)<360){const c=V14_S[actor.sect].color;g.save();g.globalAlpha=.75;hdEllipse(g,z.x,z.y+2,10,2,c);g.restore();}
};
// Prop selection is seeded and does not change the collision map or resource coordinates.
function v15PropIndex(o){const s=o.seed,r=o.region;switch(o.kind){case 'tree':return s<.18?4:s<.85?5:6;case 'bamboo':return s<.24?5:7;case 'snow':return s<.42?8:16;case 'rock':return s<.2?5:12;case 'crystal':return s<.72?9:19;case 'swamp':return s<.56?10:17;case 'desert':return s<.18?14:s<.69?13:15;case 'ruin':return s<.4?10:s<.68?11:18;default:return 5;}}
const V15_PROP_H=[132,166,95,118,137,151,120,145,111,118,104,106,108,105,113,95,146,65,92,125];
const v15PropOld=hdDrawProp;
hdDrawProp=function(o,z,sun){const i=v15PropIndex(o),a=imgs['v15prop'+i];if(!a?.ready){v15PropOld(o,z,sun);return;}const h=V15_PROP_H[i]*o.scale*(.93+(o.seed||0)*.15),im=a.img,w=h*im.naturalWidth/im.naturalHeight,hero=HD.heroScreen||hdPoint(p.x,p.y),occlude=z.y>hero.y&&z.y-hero.y<h*.91&&Math.abs(z.x-hero.x)<w*.42;g.save();g.translate(z.x,z.y);g.scale(o.seed>.5?-1:1,1);g.globalAlpha=occlude?.48:1;g.imageSmoothingEnabled=true;if(['tree','bamboo','swamp'].includes(o.kind))g.rotate(Math.sin(elapsed*.8+o.seed*11)*.008);g.drawImage(im,-w/2,-h,w,h);g.restore();};
const v15HouseOld=hdHouseArt, V15_HOUSE_CACHE=new Map();
hdHouseArt=function(h){const i=OW_HOUSES.indexOf(h),idx=[0,2,0,0,1,3][i]??0,key=i+':'+h.w+':'+h.h,a=imgs['v15prop'+idx];if(!a?.ready)return v15HouseOld(h);if(V15_HOUSE_CACHE.has(key))return V15_HOUSE_CACHE.get(key);const c=document.createElement('canvas');c.width=240;c.height=230;const ctx=c.getContext('2d'),im=a.img,ww=Math.min(218,h.w*1.35),hh=ww*im.naturalHeight/im.naturalWidth;ctx.imageSmoothingEnabled=true;ctx.drawImage(im,120-ww/2,185-hh,ww,hh);V15_HOUSE_CACHE.set(key,c);return c;};
// Give the existing altars, gates and ruins a distinct old-world silhouette. No collision changes.
const v15POIOld=hdDrawPOI;
hdDrawPOI=function(o,z){if(['altar','dungeon'].includes(o.kind)){const type=o.kind==='dungeon'?3:o.region==='quy'?11:o.region==='ma'||o.region==='loi'?9:11;v15Sprite('v15prop'+type,z.x,z.y-3,72,1,.85);}v15POIOld(o,z);};
// More richly textured continuous ground tiles. These details are cached per chunk.
const v15GroundOld=hdGroundChunk;
hdGroundChunk=function(cx,cy){const a=v15GroundOld(cx,cy);if(a.v15)return a;a.v15=true;const d=a.c.getContext('2d'),x0=cx*OW.chunk,y0=cy*OW.chunk;
 for(let k=0;k<270;k++){const x=x0+6+hashOW(cx,cy,3100+k*2)*(OW.chunk-12),y=y0+6+hashOW(cx,cy,3101+k*2)*(OW.chunk-12),r=regionAt(x,y),rd=roadDistance(x,y),bank=Math.abs(y-riverAt(x)),q=hashOW(k,cx+cy,913),xx=x-x0,yy=(y-y0)*HD.tilt-hdHeight(x,y)+HD.lift;if(bank<86)continue;
  if(rd<48){if(q<.26){d.fillStyle='#514b3944';d.beginPath();d.ellipse(xx,yy,3+q*6,1.2,0,0,TAU);d.fill();d.fillStyle='#e2c79755';d.fillRect(xx-1,yy-1,2,1);}continue;}
  if(r.kind==='snow'){if(q>.58){d.fillStyle='#edf5ee77';d.fillRect(xx,yy,2+q*4,1.2);}}else if(['rock','desert','crystal','ruin'].includes(r.kind)){if(q>.54){hdPoly(d,[[xx-3,yy],[xx-1,yy-3],[xx+2,yy-2],[xx+4,yy],[xx,yy+1]],r.dark+'96');d.fillStyle=r.light+'90';d.fillRect(xx-1,yy-2,3,.9);}}else{if(q>.36){const color=r.kind==='swamp'?'#90a56b99':'#a5b77ca0';for(let j=0;j<3;j++)hdLine(d,[xx+j-1,yy],[xx+(j-1)*2,yy-2.5-q*3],color,1);if(q>.95){d.fillStyle=r.id==='thon'?'#f1c2be':'#d7c991';d.fillRect(xx,yy-4,2,2);}}}
 }return a;};

// Geographic atlas: derive every height/color/road from the real world, not a decorative fake map.
let v15Atlas=null,v15AtlasSeed=null;
function v15AtlasRaster(){if(v15Atlas&&seed===v15AtlasSeed)return v15Atlas;const c=document.createElement('canvas');c.width=440;c.height=246;const d=c.getContext('2d'),sx=OW.w/c.width,sy=OW.h/c.height;
 for(let y=0;y<c.height;y+=2)for(let x=0;x<c.width;x+=2){const wx=(x+1)*sx,wy=(y+1)*sy,r=regionAt(wx,wy),h=hdHeight(wx,wy),q=hdNoise(wx,wy,170,492),rise=clamp((hdHeight(wx-50,wy-50)-h)/10,-.3,.26);let col=terrainColor(wx,wy,r);col=hdMix(col,q>.5?r.light:r.dark,Math.abs(q-.5)*.76);col=hdMix(col,rise>0?'#f4e6bd':'#1b2832',Math.abs(rise)*.8);if(Math.abs(wy-riverAt(wx))<82&&!isBridge(wx))col='#4d838c';d.fillStyle=col;d.fillRect(x,y,2,2);}
 // Elevation hachures and soft contour-like strokes, subtle paper texture.
 for(let k=0;k<1050;k++){const x=hashOW(k,5,42)*c.width,y=hashOW(k,6,43)*c.height,wx=x*sx,wy=y*sy;if(Math.abs(wy-riverAt(wx))<130||roadDistance(wx,wy)<100)continue;const r=regionAt(wx,wy);d.fillStyle=r.dark+'65';d.fillRect(x,y,1.5,1);if(['rock','snow','desert','crystal'].includes(r.kind)&&k%5===0)hdLine(d,[x,y],[x+2,y-1.5],r.light+'75',.6);}
 v15AtlasSeed=seed;return v15Atlas=c;}
const V15_MAP_ICON={thon:1,truc:7,yeu:12,ma:19,tuyet:8,tram:17,hoa:13,quy:11,phong:5,loi:9};
owMiniMap=function(x,y,w,h,full=false){const sx=w/OW.w,sy=h/OW.h,c=v15AtlasRaster();g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.imageSmoothingEnabled=true;g.drawImage(c,x,y,w,h);
 // Unexplored terrain is visible in outline; explored chunks recover their full color.
 for(let yy=0;yy<OW.h;yy+=OW.chunk)for(let xx=0;xx<OW.w;xx+=OW.chunk)if(!p.explored[Math.floor(xx/OW.chunk)+':'+Math.floor(yy/OW.chunk)]){g.fillStyle=full?'#14232b60':'#13222b7a';g.fillRect(x+xx*sx,y+yy*sy,OW.chunk*sx+.25,OW.chunk*sy+.25);}
 g.lineCap='round';g.strokeStyle='#a0d2cb';g.lineWidth=full?1.8:1;g.beginPath();for(let xx=0;xx<=OW.w;xx+=70){const yy=y+riverAt(xx)*sy;xx?g.lineTo(x+xx*sx,yy):g.moveTo(x+xx*sx,yy);}g.stroke();g.strokeStyle='#e0c895aa';g.lineWidth=full?1.5:.7;g.setLineDash(full?[4,3]:[]);for(const [aa,bb] of ROAD_EDGES){const r=REGIONS[aa],t=REGIONS[bb];g.beginPath();g.moveTo(x+r.x*sx,y+r.y*sy);g.lineTo(x+t.x*sx,y+t.y*sy);g.stroke();}g.setLineDash([]);
 if(full)for(const r of REGIONS){const px=x+r.x*sx,py=y+r.y*sy,seen=p.discovered.includes(r.id);v15Sprite('v15prop'+V15_MAP_ICON[r.id],px,py-1,39,1,seen?1:.70);circle(px,py,4,seen?r.accent:'#a6ac9f','#263740');box(px-71,py+7,142,20,seen?'#13292bbd':'#233039c0','',3);text(r.name,px,py+17,10,seen?'#f9e8c4':'#c1c9c0','center','bold');}
 for(const o of v8POIs()){if(!p.explored[Math.floor(o.x/OW.chunk)+':'+Math.floor(o.y/OW.chunk)])continue;const col=o.kind==='v14event'?'#d5a7ff':o.kind==='v13node'?'#abdb9e':V8_INFO[o.id]?'#f3d18e':o.kind==='dungeon'?'#bd93ec':'#e3c79a';diamond(g,x+o.x*sx,y+o.y*sy,full?2.7:1.6,col);}
 for(const e of p.v14?.events||[])if(e.state==='active')diamond(g,x+e.x*sx,y+e.y*sy,full?5:3,'#d8afff');
 const q=hdView();g.strokeStyle='#f7e8b8';g.lineWidth=full?1.5:1;g.strokeRect(x+q.x*sx,y+Math.max(0,q.y/HD.tilt)*sy,W/V11_ZOOM*sx,H/V11_ZOOM/HD.tilt*sy);circle(x+p.x*sx,y+p.y*sy,full?6:3.8,'#fff2b9','#253b3c');if(full){text('N',x+w-22,y+14,11,'#f6edc6','center','bold');hdPoly(g,[[x+w-22,y+24],[x+w-28,y+38],[x+w-22,y+34],[x+w-16,y+38]],'#f4dfb2');}g.restore();g.strokeStyle='#bda16b';g.lineWidth=1;g.strokeRect(x,y,w,h);};
worldMapPanel=function(){g.fillStyle='#061319d8';g.fillRect(0,0,W,H);ornament(100,65,1080,590,'#152a30f7');text('VẠN LÝ SƠN HÀ',640,104,28,C.gold,'center','bold');text('Bản đồ địa hình · '+p.discovered.length+'/'+REGIONS.length+' vùng đã khám phá',640,138,13,C.jade,'center');owMiniMap(156,164,968,420,true);
 circle(165,603,4,'#fff2b9');text('Nhân vật',175,603,12,C.paper);diamond(g,257,603,4,'#f3d18e');text('NPC / địa điểm',267,603,12,C.paper);diamond(g,380,603,4,'#abdb9e');text('Linh vật',390,603,12,C.paper);diamond(g,468,603,4,'#d5a7ff');text('Kỳ ngộ',478,603,12,C.paper);text('Chọn tên vùng để dẫn đường',1120,603,12,C.jade,'right');for(const r of REGIONS){const x=156+r.x/OW.w*968,y=164+r.y/OW.h*420;buttons.push({x:x-71,y:y+7,w:142,h:20,fn:()=>{modal=null;v8SetGoal({x:r.x,y:r.y});}});}addButton(1060,80,86,31,'Đóng ×',()=>modal=null);};
const v15JiangOld=v14Panel;v14Panel=function(){v15JiangOld();if((modal.tab??0)!==0)return;const d=V8_INFO[modal.selected],a=v14Actor(modal.selected);if(!d||!a)return;const col=V14_S[a.sect]?.color||C.gold;seal(g,1100,276,45,col,0,.38);v15Sprite('v15npc'+v15NPCIndex(d),1101,333,112);};

// V16: hand-authored starter settlement, service locations and interactive local atlas.
const V16_BOUNDS={x:325,y:450,w:1110,h:900};
const V16_NPCS={inn:{x:850,y:735,tag:'Trưởng lão',color:'#f7d78e'},shop:{x:1147,y:774,tag:'Dược thương',color:'#f2ca8b'},herbalist:{x:563,y:772,tag:'Dược sư',color:'#b5e5a8'},wanderer:{x:557,y:1086,tag:'Kiếm khách',color:'#c0d0ff'},sentry:{x:1290,y:966,tag:'Hộ vệ',color:'#98d4eb'}};
const V16_STATIONS={v13_forge:{x:465,y:898,tag:'Lò đan',color:'#f2aa76'},v13_market:{x:1248,y:847,tag:'Giao dịch',color:'#f1cc83'},v13_board:{x:847,y:1030,tag:'Ủy thác',color:'#f4d990'},v13_farm:{x:1130,y:1138,tag:'Linh điền',color:'#a4e091'}};
const V16_ZONES=[
 {id:'hall',name:'Thanh Vân Đại Điện',x:850,y:623,w:320,h:235,art:1,color:'#e7cf92',desc:'Trưởng lão · khai môn, chính tuyến'},
 {id:'herbal',name:'Bách Thảo Dược Đường',x:556,y:699,w:245,h:230,art:0,color:'#b5d699',desc:'Mộc Tử Y · linh dược, luyện đan'},
 {id:'market',name:'Vạn Bảo Phường',x:1157,y:714,w:315,h:240,art:2,color:'#efd092',desc:'Linh Dược · mua bán, vật phẩm'},
 {id:'plaza',name:'Quảng Trường Thanh Thạch',x:850,y:897,w:282,h:185,art:null,color:'#e6d5aa',desc:'Điểm xuất phát · bảng ủy thác'},
 {id:'training',name:'Sân Luyện Kiếm',x:550,y:1100,w:285,h:237,art:null,color:'#b9c8e8',desc:'Tạ Vô Nhai · học cách chiến đấu'},
 {id:'farm',name:'Linh Điền',x:1140,y:1143,w:302,h:238,art:null,color:'#a8d59e',desc:'Gieo trồng và thu hoạch linh thảo'}
];
const V16_HOUSES=[{x:850,y:620,w:156,h:100,art:1},{x:555,y:675,w:133,h:85,art:0},{x:1147,y:685,w:145,h:82,art:2},{x:470,y:1000,w:108,h:76,art:0},{x:1226,y:991,w:112,h:80,art:0}];
const V16_ROADS=[[325,900,1435,900],[850,450,850,1350],[556,800,556,900],[1147,800,1147,900],[550,900,550,1200],[1140,900,1140,1270],[556,800,850,800],[850,800,1147,800],[550,1060,850,1060],[850,1060,1140,1060]];
const V16_TREES=[[370,520,4],[430,510,5],[680,493,6],[1010,492,5],[1310,510,4],[1370,680,5],[380,690,6],[360,1050,5],[380,1245,4],[690,1270,6],[1015,1305,5],[1330,1300,5],[1380,1100,4],[700,1120,6],[1000,1100,6],[691,640,5],[1008,620,5]];
const V17_SCALE=1.3;function v17X(x){return 850+(x-850)*V17_SCALE;}function v17Y(y){return 900+(y-900)*V17_SCALE;}function v17Pos(o){o.x=v17X(o.x);o.y=v17Y(o.y);return o;}
v17Pos(V16_BOUNDS);V16_BOUNDS.w*=V17_SCALE;V16_BOUNDS.h*=V17_SCALE;for(const o of [...Object.values(V16_NPCS),...Object.values(V16_STATIONS),...V16_ZONES,...V16_HOUSES]){v17Pos(o);if(o.w){o.w*=V17_SCALE;o.h*=V17_SCALE;}}for(const r of V16_ROADS){r[0]=v17X(r[0]);r[1]=v17Y(r[1]);r[2]=v17X(r[2]);r[3]=v17Y(r[3]);}for(const t of V16_TREES){t[0]=v17X(t[0]);t[1]=v17Y(t[1]);}
function v16InTown(x,y,pad=0){const b=V16_BOUNDS;return x>=b.x-pad&&x<=b.x+b.w+pad&&y>=b.y-pad&&y<=b.y+b.h+pad;}
function v16Rect(x,y,r){return Math.abs(x-r.x)<r.w/2&&Math.abs(y-r.y)<r.h/2;}
function v16Segment(x,y,r){const [a,b,c,d]=r,dx=c-a,dy=d-b,t=clamp(((x-a)*dx+(y-b)*dy)/(dx*dx+dy*dy),0,1);return Math.hypot(x-a-dx*t,y-b-dy*t);}
const v16RoadOld=roadDistance;roadDistance=function(x,y){const d=v16RoadOld(x,y);if(!v16InTown(x,y,80))return d;return Math.min(d,...V16_ROADS.map(r=>v16Segment(x,y,r)+17));};
// Move the existing service NPCs and interactive stations; preserve all IDs and quests.
for(const o of OW_POI)if(V16_NPCS[o.id])Object.assign(o,V16_NPCS[o.id]);
for(const o of V13_STATIONS)if(V16_STATIONS[o.id])Object.assign(o,V16_STATIONS[o.id]);
// Existing four town resources are placed in accessible peripheral clearings.
const V16_NODE_POS=[[1380,1035],[1030,1280],[380,1080],[1000,530]].map(([x,y])=>[v17X(x),v17Y(y)]);
for(let i=0;i<4;i++){const o=V13_NODES[i];[o.x,o.y]=V16_NODE_POS[i];}
OW_HOUSES.splice(0,OW_HOUSES.length,...V16_HOUSES);
const v16PlaceOld=v13Place;v13Place=function(o){if(V16_STATIONS[o.id])return {...o,...V16_STATIONS[o.id]};return v16PlaceOld(o);};
// Remove randomly generated vegetation inside developed streets. Add a curated perimeter orchard.
const v16ChunkOld=owChunk;owChunk=function(cx,cy){const c=v16ChunkOld(cx,cy);if(c.v16)return c;c.v16=true;c.props=c.props.filter(o=>!v16InTown(o.x,o.y));for(const [x,y,art] of V16_TREES)if(Math.floor(x/OW.chunk)===cx&&Math.floor(y/OW.chunk)===cy)c.props.push({x,y,kind:'tree',region:'thon',seed:((x+y)%123)/124,scale:.86,radius:23,v16art:art});return c;};
const v16PropOld=v15PropIndex;v15PropIndex=function(o){return o.v16art??v16PropOld(o);};
const v16HouseOld=hdHouseArt,V16_HOUSE_ART=new Map();hdHouseArt=function(h){if(h.art==null)return v16HouseOld(h);const a=imgs['v15prop'+h.art];if(!a?.ready)return v16HouseOld(h);if(V16_HOUSE_ART.has(h))return V16_HOUSE_ART.get(h);const c=document.createElement('canvas');c.width=240;c.height=230;const d=c.getContext('2d'),im=a.img,w=Math.min(h.w*1.36,225),z=w*im.naturalHeight/im.naturalWidth;d.drawImage(im,120-w/2,185-z,w,z);V16_HOUSE_ART.set(h,c);return c;};
// Pavement, foundations, garden beds and training yard are drawn onto the terrain surface.
// Integrated world-scale props: directional gate and street signs plus training equipment.
function v16LandmarkArt(type,z){g.save();g.translate(z.x,z.y);if(type==='gate'){v15Sprite('v15prop3',0,0,193);}
 else if(type==='dummy'){hdEllipse(g,0,0,14,5,'#28362b80');hdLine(g,[0,0],[0,-46],'#714b33',7);hdLine(g,[-15,-29],[15,-29],'#86583b',6);hdPoly(g,[[-10,-42],[10,-42],[11,-18],[-11,-18]],'#b79a66','#694c36',1.5);circle(0,-34,5,'#925843');}
 else if(type==='lamp'){hdLine(g,[0,0],[0,-33],'#624936',4);box(-9,-45,18,15,'#f7bf73','#8c5538',2);hdPoly(g,[[-12,-45],[0,-52],[12,-45]],'#5b4438');}
 else if(type==='well'){hdEllipse(g,0,1,25,12,'#3d4746');hdEllipse(g,0,-5,22,11,'#90988d');hdEllipse(g,0,-6,13,6,'#345e5f');hdLine(g,[-20,-5],[-20,-39],'#634b3a',4);hdLine(g,[20,-5],[20,-39],'#634b3a',4);hdPoly(g,[[-29,-38],[0,-55],[29,-38],[22,-32],[-22,-32]],'#48666b','#32494d',2);}
 g.restore();}
const V16_DECOR=[{x:1400,y:900,type:'gate'},{x:500,y:1175,type:'dummy'},{x:575,y:1175,type:'dummy'},{x:648,y:1175,type:'dummy'},{x:750,y:930,type:'well'},...[[725,810],[975,810],[725,995],[975,995],[1310,860],[1310,1040],[426,860],[426,1040]].map(([x,y])=>({x,y,type:'lamp'}))];
for(const o of V16_DECOR)v17Pos(o);
function v16DrawDecor(items,v,visible){for(const o of V16_DECOR)if(visible(o.x,o.y,180)){const z=hdPoint(o.x,o.y,v);items.push({y:z.y,draw:()=>v16LandmarkArt(o.type,z)});}}
// Stationary service actors have distinct posts, while the guard walks a short patrol.
const v16NpcUpdateOld=v8NPCUpdate;v8NPCUpdate=function(dt){v16NpcUpdateOld(dt);for(const o of OW_POI){const a=V16_NPCS[o.id];if(!a)continue;const n=v8NPC(o),close=dist(n,p)<100||V8.target?.id===n.id||modal?.npc===n.id;n.dir??=2;n.gait??=0;n.walking=false;if(close){n.dir=v9Dir(p.x-n.x,p.y-n.y,n.dir,true,0);continue;}if(o.id==='sentry'){const x=a.x+Math.sin((p.worldTime||0)*.22)*31,y=a.y,dx=x-n.x,dy=y-n.y,l=Math.hypot(dx,dy);if(l>2){const xx=n.x,yy=n.y;owMove(n,n.x+dx/l*Math.min(l,35*dt),n.y+dy/l*Math.min(l,35*dt),10);const moved=dist(n,{x:xx,y:yy});n.dir=v9Dir(n.x-xx,n.y-yy,n.dir,true);n.walking=moved>.03;n.gait+=moved/3;}}else{n.x=a.x;n.y=a.y;}n.task=o.id==='sentry'?'Tuần tra cổng thôn':a.tag;n.v13Task=n.task;}};
const v16POIOld=hdDrawPOI;hdDrawPOI=function(o,z){const a=V16_NPCS[o.id];if(!a||!V8_INFO[o.id])return v16POIOld(o,z);const d=V8_INFO[o.id],hovered=V8.hover?.id===o.id;hdEllipse(g,z.x,z.y+1,16,5,'#17232c80');if(hovered||V8.target?.id===o.id)hdEllipse(g,z.x,z.y+1,22,7,'#e5cc7960');v9NPCDraw(d,o,z);box(z.x-67,z.y-99,134,23,'#10292dee',hovered?'#ffeda8':a.color,4);text(d.name+' · '+a.tag,z.x,z.y-87,11,a.color,'center','bold');if(v12Tracked()?.target===o.id)diamond(g,z.x,z.y-111,6,'#f9d471');};
// District signage is anchored to walkable world positions (not screen-space decoration).
const V16_SIGNS=[{x:850,y:514,t:'THANH VÂN ĐẠI ĐIỆN'},{x:556,y:590,t:'BÁCH THẢO DƯỢC ĐƯỜNG'},{x:1150,y:597,t:'VẠN BẢO PHƯỜNG'},{x:850,y:950,t:'QUẢNG TRƯỜNG'},{x:550,y:1245,t:'SÂN LUYỆN KIẾM'},{x:1140,y:1260,t:'LINH ĐIỀN'},{x:1400,y:815,t:'ĐÔNG MÔN → THANH TRÚC LÂM'}];
for(const o of V16_SIGNS)v17Pos(o);
function v16Signs(){if(!v16InTown(p.x,p.y,500)||modal)return;for(const s of V16_SIGNS){const z=hdPoint(s.x,s.y);if(z.x<340||z.x>1000||z.y<100||z.y>550)continue;const w=s.t.length*6.2+18;box(z.x-w/2,z.y-14,w,21,'#152c2bea','#a89363',3);text(s.t,z.x,z.y-3,11,'#f4ddb1','center','bold');}}
// A small local map always shows all service posts, so new players do not need to guess.
const v16WorldMini=owMiniMap;function v16MapDraw(x,y,w,h,full=false){const b=V16_BOUNDS,sx=w/b.w,sy=h/b.h,tx=a=>x+(a-b.x)*sx,ty=a=>y+(a-b.y)*sy;g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle='#314e43';g.fillRect(x,y,w,h);for(const r of V16_ZONES){box(tx(r.x-r.w/2),ty(r.y-r.h/2),r.w*sx,r.h*sy,r.id==='plaza'?'#a8a08a':r.id==='farm'?'#6d8150':r.id==='training'?'#8d7d62':'#536b58','#8d9b7b',2);}
 g.lineCap='round';for(const r of V16_ROADS){g.strokeStyle='#9f967e';g.lineWidth=full?16:5;g.beginPath();g.moveTo(tx(r[0]),ty(r[1]));g.lineTo(tx(r[2]),ty(r[3]));g.stroke();g.strokeStyle='#c4b99b';g.lineWidth=full?10:3;g.stroke();}
 for(const [xx,yy,art] of V16_TREES){if(full)v15Sprite('v15prop'+art,tx(xx),ty(yy),27);else circle(tx(xx),ty(yy),2.8,'#9ba86e');}
 for(const h0 of V16_HOUSES){if(full)v15Sprite('v15prop'+h0.art,tx(h0.x),ty(h0.y),h0.art===1?98:76);else box(tx(h0.x)-h0.w*sx*.4,ty(h0.y)-5,h0.w*sx*.8,8,'#a69b80','#435456',1);}
 if(full){for(const r of V16_ZONES){const yy=ty(r.y-r.h*.44)+9,xx=tx(r.x),ww=r.name.length*6.7+18;box(xx-ww/2,yy-9,ww,19,'#233e37','#a8a078',3);text(r.name,xx,yy,11,'#f9eac5','center','bold');}v15Sprite('v15prop3',tx(v17X(1400)),ty(v17Y(900)),44);}
 for(const o of v8POIs()){const a=V16_NPCS[o.id]||V16_STATIONS[o.id];if(!a)continue;const px=tx(o.x),py=ty(o.y);circle(px,py,full?7:3.5,'#182e32',a.color,2);circle(px,py,full?3.4:2,a.color);if(full){const label=V16_NPCS[o.id]?V8_INFO[o.id].name:a.tag;box(px-46,py+10,92,16,'#12292be7','',3);text(label,px,py+18,10,a.color,'center','bold');}}
 if(V8.route.length){g.strokeStyle='#f8dfa0';g.lineWidth=full?2:1;g.setLineDash([4,4]);g.beginPath();g.moveTo(tx(p.x),ty(p.y));for(const q of V8.route)g.lineTo(tx(q.x),ty(q.y));g.stroke();g.setLineDash([]);}if(v16InTown(p.x,p.y))circle(tx(p.x),ty(p.y),full?6:4,'#ffffff','#263d3f',2);const target=v12Target(v12Tracked());if(target&&v16InTown(target.x,target.y))diamond(g,tx(target.x),ty(target.y)-9,full?5:3,'#fff1af');g.restore();g.strokeStyle='#bda16b';g.strokeRect(x,y,w,h);}
owMiniMap=function(x,y,w,h,full=false){if(!full&&v16InTown(p.x,p.y,120)){v16MapDraw(x,y,w,h,false);return;}v16WorldMini(x,y,w,h,full);};
const v16WorldMapOld=worldMapPanel;
function v16Guide(id){const o=v8POIs().find(a=>a.id===id);if(!o)return;modal=null;v8SetGoal(o,{type:'poi',id});}
worldMapPanel=function(){const local=modal?.v16Map==='local'||(modal?.v16Map!=='world'&&v16InTown(p.x,p.y,150));if(!local){v16WorldMapOld();addButton(127,81,177,31,'Thôn tân thủ',()=>modal.v16Map='local');return;}g.fillStyle='#061319e7';g.fillRect(0,0,W,H);ornament(52,48,1176,620,'#142c32');text('THANH THẠCH THÔN',80,90,27,C.gold,'left','bold');text('Bản đồ tân thủ · chọn người hoặc địa điểm để tự tìm đường',80,120,13,C.jade);addButton(1008,75,173,34,'Bản đồ thế giới',()=>modal.v16Map='world');addButton(1189,75,27,34,'×',()=>modal=null);
 v16MapDraw(78,151,735,473,true);text('NPC & DỊCH VỤ',832,151,14,C.gold,'left','bold');const ids=['inn','herbalist','shop','wanderer','sentry','v13_forge','v13_market','v13_board','v13_farm'];ids.forEach((id,i)=>{const rowY=168+i*47,a=V16_NPCS[id]||V16_STATIONS[id],o=v8POIs().find(q=>q.id===id);box(831,rowY,366,43,'#1c393d',a.color,4);if(V16_NPCS[id])v15Sprite('v15npc'+v15NPCIndex(V8_INFO[id]),854,rowY+40,37);else diamond(g,854,rowY+21,8,a.color);text(V16_NPCS[id]?V8_INFO[id].name+' · '+a.tag:o?.name||a.tag,879,rowY+13,13,a.color,'left','bold');text(o?Math.round(dist(p,o))+' bước · Nhấn để dẫn đường':'Đang tải',879,rowY+30,10,C.muted);buttons.push({x:831,y:rowY,w:366,h:43,fn:()=>v16Guide(id)});});
 const b=V16_BOUNDS;for(const id of ids){const o=v8POIs().find(q=>q.id===id);if(!o)continue;const px=78+(o.x-b.x)*735/b.w,py=151+(o.y-b.y)*473/b.h;buttons.push({x:px-13,y:py-13,w:26,h:31,fn:()=>v16Guide(id)});}
 text('● Vị trí hiện tại',81,642,12,C.paper);text('Đường đá nối các khu · Cổng đông dẫn tới Thanh Trúc Lâm',809,642,11,C.jade,'right');};

// Relocate old save metadata for permanent service actors; keep all progression and relationships.
function v16Init(){if(!p)return;for(const id of Object.keys(V16_NPCS)){const a=v14Actor(id),b=V16_NPCS[id];if(a){a.x=b.x;a.y=b.y;}const o=OW_POI.find(q=>q.id===id);if(o&&V8.npcs.has(id)){const n=V8.npcs.get(id);n.x=b.x;n.y=b.y;n.homeX=b.x;n.homeY=b.y;n.way=null;}}if(p.worldMode&&v16InTown(p.x,p.y)&&owBlocked(p.x,p.y,14)){let at=null;for(let r=20;r<=160&&!at;r+=20)for(let i=0;i<12&&!at;i++){const x=p.x+Math.cos(i*TAU/12)*r,y=p.y+Math.sin(i*TAU/12)*r;if(!owBlocked(x,y,15))at={x,y};}if(at)Object.assign(p,at);}p.v16Village=true;p.v17Village=true;}
const v16Start=start;start=function(...a){v16Start(...a);v16Init();save();};const v16Resume=resume;resume=function(){v16Resume();if(p)v16Init();};

