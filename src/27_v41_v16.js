'use strict';
// V39 — larger architecture and landscape, with matching walkable footprints.
const V39_HOUSE_LAYOUT=[[850,596,1.42],[390,635,1.45],[1312,642,1.45],[308,1125,1.48],[1394,1120,1.48]];
for(let i=0;i<V16_HOUSES.length;i++){
 const h=V16_HOUSES[i],[x,y,s]=V39_HOUSE_LAYOUT[i];h.x=x;h.y=y;h.w*=s;h.h*=s;
 if(i<3){const zone=V16_ZONES[i];zone.x=x;zone.y=y+30;zone.w*=1.14;zone.h*=1.10;V16_SIGNS[i].x=x;V16_SIGNS[i].y=y-12;}
}
// Reconnect the enlarged buildings to the existing street network.
V16_ROADS.splice(V16_ROADS.length-5,5);
for(const r of V36_ROOMS){const h=V16_HOUSES[r.house],d=v36Door(r),y=v17Y(r.house<=2?800:1060);V16_ROADS.push([d.x,d.y,d.x,y]);const end=[850,v17X(556),v17X(1147),v17X(550),v17X(1140)][r.house];if(Math.abs(d.x-end)>1)V16_ROADS.push([d.x,y,end,y]);}
// Exterior scenery and solid prop radii grow together. New cache entries use the same scale.
const v39ChunkOld=owChunk;owChunk=function(cx,cy){const c=v39ChunkOld(cx,cy);if(c.v39)return c;c.v39=true;for(const o of c.props){o.scale*=1.35;o.radius*=1.16;}return c;};
for(const o of V24_GARDEN){o.h*=1.35;if(o.r)o.r*=1.13;}
for(const o of V32_TOWN_DECOR)o.h*=1.32;
const v39LandmarkOld=v16LandmarkArt;v16LandmarkArt=function(type,z){g.save();g.translate(z.x,z.y);g.scale(1.35,1.35);v39LandmarkOld(type,{x:0,y:0});g.restore();};
const v39DecorOld=v24DecorDraw;v24DecorDraw=function(o,z){if(!o.key37&&o.id===1&&o.h===45)o={...o,h:60};return v39DecorOld(o,z);};
// The room's actual solid furniture rectangles are enlarged, not just painted larger.
for(const f of V36_FURN){const w=f.w*1.20,h=f.h*1.18;f.x+=(f.w-w)/2;f.y+=f.h-h;f.w=w;f.h=h;}
// Keep door markers legible even beneath a larger canopy or foreground roof.
const v39POIDraw=hdDrawPOI;hdDrawPOI=function(o,z){if(!o.door)return v39POIDraw(o,z);};
const v39HUD=worldHud;worldHud=function(){if(!modal&&p?.worldMode&&!v36Inside()&&v16InTown(p.x,p.y,450))for(const r of V36_ROOMS){const d=v36Door(r),z=hdPoint(d.x,d.y);if(z.x<30||z.x>W-30||z.y<50||z.y>H-65)continue;g.save();g.translate(z.x,z.y);g.scale(V11_ZOOM,V11_ZOOM);v39POIDraw(d,{x:0,y:0});g.restore();}return v39HUD();};

// V40 — open grounds: a few carefully placed perimeter trees, clear courtyards and paths.
V16_TREES.splice(0,V16_TREES.length,...[[224,464,4],[513,370,5],[1165,368,6],[1545,475,5],[200,1330,4],[502,1398,5],[1200,1398,6],[1555,1325,4]]);
// Keep the two ornamental ponds, resting pavilion, stone ornaments, two shrubs and one tree.
const V40_GARDEN_KEEP=new Set([0,1,4,16,17,20,21,22]);
const v40KeptGarden=V37_GARDEN.filter((o,i)=>V40_GARDEN_KEEP.has(i));
V37_GARDEN.splice(0,V37_GARDEN.length,...v40KeptGarden);
V24_GARDEN.splice(0,V24_GARDEN.length,...v40KeptGarden,...v37Farm);
// Deliberately sparse, low decorative flowers instead of layered bushes along the streets.
const v40TownLow=V32_TOWN_DECOR.filter((o,i)=>o.id===5||i%4===0&&o.id===0);
V32_TOWN_DECOR.splice(0,V32_TOWN_DECOR.length,...v40TownLow);
const v40Green=o=>['tree','bamboo','swamp','snow'].includes(o.kind);
const v40ChunkOld=owChunk;owChunk=function(cx,cy){const c=v40ChunkOld(cx,cy);if(c.v40)return c;c.v40=true;c.v40Before=c.props.length;
 c.props=c.props.filter(o=>{if(o.v16art!=null)return true;const near=v16InTown(o.x,o.y,260),q=hashOW(Math.round(o.x),Math.round(o.y),40001);if(near){if(v40Green(o))return q<.14;return q<.64;}if(v40Green(o)){const grove=hdNoise(o.x,o.y,420,40002);return q<(.34+grove*.20);}return q<.83;});return c;};
// Fewer small accents outside town. Preserve the farms, buildings, rivers and rock formations.
const v40WildDecorOld=v32WildDecor;v32WildDecor=function(cx,cy){return v40WildDecorOld(cx,cy).filter(o=>hashOW(Math.round(o.x),Math.round(o.y),40003)<(v16InTown(o.x,o.y,260)?.20:.48));};
// Make the large open areas feel curated: less dense forest-floor texture and clear paved routes.
const v40MaterialOld=v24Material;v24Material=function(x,y){const a=v40MaterialOld(x,y);if(v16InTown(x,y,25)){a[2]*=.25;const path=Math.min(...V16_ROADS.map(r=>v16Segment(x,y,r))),court=1-v24Ease((v24RoundSDF(x,y,V16_ZONES.find(z=>z.id==='plaza'),48)-3)/26),lane=(1-v24Ease((path-30)/30))*.76;const newStone=Math.max(a[1],court*.92,lane);a[0]=Math.min(a[0],1-newStone);a[1]=newStone;}else if(v16InTown(x,y,285)){a[2]*=.48;}else{a[2]*=.74;}return a;};


// integrated: v41_environment.js
// V41 • Sơn Hà Quang Ảnh: authored landscape composition and dynamic environment.
// Rendering only; no pathfinding, POI, collision, loot or save-state mutations.
// The material atlas and architectural ground details are prepared once per cached chunk.
const V41E={atlasSource:null,atlas:null,shadow:null,houses:new Map(),haze:new Map(),grade:null,gradeKey:'',quality:2};
function v41eSetQuality(q){V41E.quality=clamp(Math.round(Number(q)||0),0,2);}
const v41eMod=(a,b)=>((a%b)+b)%b;
const v41eRgb=(r,g,b,a)=>`rgba(${r},${g},${b},${clamp(a,0,1)})`;

// Art direction: natural jade grass, warm dusty soil and cool granite. Lift the
// crushed shadow values of V38's painted atlas without turning the world into
// a bright flat wash. Never mutate the shared (asynchronously loaded) source.
const v41eTextureOld=v24Textures;
v24Textures=function(){
 const src=v41eTextureOld();
 if(!src)return src;
 if(src===V41E.atlasSource)return V41E.atlas;
 V41E.atlasSource=src;
 V41E.atlas=src.map((im,i)=>{
  const out=new Uint8ClampedArray(im.length);
  const grade=i===0?[.83,1.04,[3,8,-2]]:i===1?[.88,1.02,[8,5,1]]:i===2?[.84,.79,[4,7,10]]:[.88,1.05,[1,5,0]];
  const [gamma,saturation,offset]=grade,lookup=new Float32Array(256);
  for(let k=0;k<256;k++)lookup[k]=255*(k/255)**gamma;
  for(let k=0;k<im.length;k+=4){
   const r=lookup[im[k]],g=lookup[im[k+1]],b=lookup[im[k+2]],l=.299*r+.587*g+.114*b;
   out[k]=l+(r-l)*saturation+offset[0];
   out[k+1]=l+(g-l)*saturation+offset[1];
   out[k+2]=l+(b-l)*saturation+offset[2];out[k+3]=im[k+3];
  }return out;
 });return V41E.atlas;
};

// Enliven all five painted architectural silhouettes using their existing art,
// retaining alpha, anchor and collision geometry exactly. Restore roof grain
// and timber highlights from shadow; no per-frame filter or image resize.
function v41eHouseArt(key){
 const a=imgs[key];if(!a?.ready)return null;
 const im=a.img,old=V41E.houses.get(key);if(old?.src===im)return old.c;
 const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;
 const d=c.getContext('2d');d.drawImage(im,0,0);
 const raw=d.getImageData(0,0,c.width,c.height),px=raw.data,gamma=new Float32Array(256);
 for(let i=0;i<256;i++)gamma[i]=Math.min(255,255*(i/255)**.82+2);
 for(let i=0;i<px.length;i+=4){if(!px[i+3])continue;const r=gamma[px[i]],g=gamma[px[i+1]],b=gamma[px[i+2]],l=.299*r+.587*g+.114*b;
  px[i]=r+(r-l)*.035+3;px[i+1]=g+(g-l)*.035+1;px[i+2]=b+(b-l)*.035;
 }
 d.putImageData(raw,0,0);V41E.houses.set(key,{src:im,c});return c;
}
const v41eHouseOld=v17House;
v17House=function(h,z){
 const i=V16_HOUSES.indexOf(h),art=v41eHouseArt('v38house'+i);if(!art)return v41eHouseOld(h,z);
 const w=h.w*(i===0?1.64:1.53),hh=w*art.height/art.width;
 g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(art,z.x-w/2,z.y-hh,w,hh);g.restore();
};

// Widen the developed lanes visually and mark clear stone courts with a softly
// feathered boundary, while retaining their original walkable footprints.
const v41eMaterialOld=v24Material;
function v41eBiomeMix(x,y){
 // Match regionAt's distance metric, but smooth the grass/mineral boundary
 // symmetrically across both neighboring biomes (no hard green/snow seam).
 let first=REGIONS[0],second=first,a=Infinity,b=Infinity;
 for(const r of REGIONS){const d=((x-r.x)/1550)**2+((y-r.y)/2200)**2;if(d<a){b=a;second=first;a=d;first=r;}else if(d<b){b=d;second=r;}}
 const lush=r=>['village','bamboo','swamp'].includes(r.kind)?1:0,k=.5*(1-v24Ease((b-a)/.54));
 return lush(first)*(1-k)+lush(second)*k;
}
v24Material=function(x,y){
 const a=v41eMaterialOld(x,y);
 if(v16InTown(x,y,20)){
  const plaza=V16_ZONES.find(z=>z.id==='plaza'),train=V16_ZONES.find(z=>z.id==='training');
  const road=Math.min(...V16_ROADS.map(r=>v16Segment(x,y,r)));
  const court=1-v24Ease((v24RoundSDF(x,y,plaza,36)-6)/28);
  const lane=1-v24Ease((road-39)/19);
  const stone=Math.max(a[1],court*.96,lane*.91)*(1-a[4]*.12);
  a[1]=stone;a[0]=Math.min(a[0],1-stone);a[2]*=.58;
  if(train){const training=1-v24Ease((v24RoundSDF(x,y,train,31)+14)/30);a[0]=Math.max(a[0],training*.49*(1-stone)*(1-a[4]));}
 }else if(v16InTown(x,y,255))a[2]*=.72;
 a[3]=v41eBiomeMix(x,y);const mineral=1-a[3];a[6]+=8*mineral;a[7]+=9*mineral;a[8]+=9*mineral;
 return a;
};

const v41eGroundOld=hdGroundChunk;
function v41eChunkWithin(cx,cy,x,y,pad=0){return x>=cx*OW.chunk-pad&&x<=(cx+1)*OW.chunk+pad&&y>=cy*OW.chunk-pad&&y<=(cy+1)*OW.chunk+pad;}
function v41eGroundLine(d,cx,cy,x1,y1,x2,y2,col,width){
 const a=v32P(cx,cy,x1,y1),b=v32P(cx,cy,x2,y2);hdLine(d,a,b,col,width);
}
function v41ePlaza(d,cx,cy){
 const a=V16_ZONES.find(z=>z.id==='plaza');if(!a||!v41eChunkWithin(cx,cy,a.x,a.y,125))return;
 const point=(r,t)=>v32P(cx,cy,a.x+Math.cos(t)*r,a.y+Math.sin(t)*r);
 // A permanent carved medallion: interrupted geometric rings with a wind compass.
 // Kept below the V32 live seal so each has a distinct scale and purpose.
 for(const [r,c,lw] of [[78,'#414d4970',3],[82,'#d9cfaaab',2],[89,'#687b7180',2]]){
  d.beginPath();for(let i=0;i<=64;i++){const z=point(r,i/64*TAU);if(i)d.lineTo(...z);else d.moveTo(...z);}d.strokeStyle=c;d.lineWidth=lw;d.stroke();
 }
 for(let i=0;i<24;i++){
  const t=i/24*TAU;hdLine(d,point(i%3===0?70:78,t),point(83,t),i%3===0?'#e1d6b698':'#56695d66',i%3===0?2:1);
 }
 for(let i=0;i<8;i++){
  const t=i*TAU/8;hdPoly(d,[point(65,t),point(55,t+.10),point(50,t),point(55,t-.10)],i%2?'#72867880':'#e0d3ae88','#59655c75',1);
 }
}
// Render the continuous river and believable riverbanks instead of the legacy
// square terrain-cell shore. Same river center, same bridge collision geometry;
// all coastline detail is baked into the existing chunk bitmap, once.
function v41eRiverGround(d,cx,cy){
 const ox=cx*OW.chunk,oy=cy*OW.chunk,edge=ox+OW.chunk,ts=[];
 for(let x=ox;x<=edge;x+=8)ts.push(x);if(ts.at(-1)!==edge)ts.push(edge);
 const ys=ts.map(x=>riverAt(x));if(Math.max(...ys)+109<oy||Math.min(...ys)-109>oy+OW.chunk)return;
 const pt=(x,y)=>v32P(cx,cy,x,y),bank=(x,width,side,wave=1)=>riverAt(x)+side*(width+Math.sin(x*.035+side)*2.2*wave);
 function band(width,col,wave=1){
  const points=ts.map(x=>pt(x,bank(x,width,-1,wave))).concat([...ts].reverse().map(x=>pt(x,bank(x,width,1,wave))));
  hdPoly(d,points,col);
 }
 d.save();d.globalCompositeOperation='source-atop';
 // Paint a broad softly feathered sand-and-silt transition over the coarse
 // original water boundary; color remains quiet at forest and snow borders.
 for(const [w,col] of [[108,'#a6aa8b20'],[100,'#a0a98d5a'],[94,'#8f9f84bc'],[87,'#7c9384']])band(w,col);
 // Continuous aquamarine water body, deeper and cooler toward its middle.
 band(81,'#648d91');
 for(let i=0;i<9;i++)band(75-i*5,hdMix('#599096','#286877',i/8)+'50',.66);
 // Wet edges, sediment and static moving-water grain. Deterministic world
 // anchors keep details stable as adjacent cached chunks become visible.
 for(const side of [-1,1])for(let x=Math.ceil(ox/17)*17;x<edge;x+=17){
  const q=hashOW(x,side,4177),y=bank(x,83+q*9,side),a=pt(x,y),b=pt(x+8,y+Math.sin(x*.07)*2);
  if(q>.24)hdLine(d,a,b,'#d3d8b66a',.9+q*.45);
  const qx=x+q*6,qy=riverAt(qx)+side*(88+q*11),z=pt(qx,qy);
  if(q>.68)hdEllipse(d,z[0],z[1],1.3+q*1.8,.75,'#657e598a');
 }
 for(let k=0;k<65;k++){
  const x=ox+hashOW(cx,k,4182)*OW.chunk,y=riverAt(x)+(hashOW(cx,k,4183)-.5)*140;if(isBridge(x))continue;
  const z=pt(x,y),q=hashOW(cx,k,4184),len=7+q*16;
  hdLine(d,[z[0]-len*.5,z[1]],[z[0]+len*.5,z[1]+q*.52],q>.60?'#b0d4c52a':'#1e53622e',.8);
 }
 // Individual timber planks follow each crossing; beams and end ramps are
 // solid visual surfaces but retain the original isBridge/isWater semantics.
 for(const r of REGIONS.filter(r=>r.y<2000&&r.x+111>ox&&r.x-111<edge)){
  const lx=r.x-105,rx=r.x+105,ys=[riverAt(lx),riverAt(r.x),riverAt(rx)],by=Math.max(...ys)+88,ty=Math.min(...ys)-88;
  function slab(x0,y0,x1,y1,col,stroke){hdPoly(d,[pt(x0,y0),pt(x1,y0),pt(x1,y1),pt(x0,y1)],col,stroke,1);}
  slab(lx-5,ty-4,rx+5,by+4,'#514b39a8');slab(lx,ty,rx,by,'#6f5944','#4e4a38');
  for(let y=ty+4,i=0;y<by-1;y+=10,i++){
   const q=hashOW(r.x,i,4188),end=Math.min(y+9,by-2);slab(lx+4,y,rx-4,end,hdMix('#847054','#b9a079',q*.78),'#6f604a');
   const a=pt(lx+6,y+1),b=pt(rx-6,y+1);hdLine(d,a,b,'#e2cb9565',.7);
   for(let j=0;j<3;j++){const x=lx+12+hashOW(i,j,4191)*(rx-lx-37),len=11+hashOW(i,j,4193)*25;hdLine(d,pt(x,y+3+j*1.5),pt(Math.min(rx-6,x+len),y+3+j*1.5),'#6d543f63',.65);}
  }
  for(const x of [lx+6,rx-11])slab(x,ty-1,x+5,by+1,'#584d3b','#c8ae797f');
  for(const y of [ty-2,by-2])slab(lx-2,y,rx+2,y+5,'#b8a588','#706c59');
 }
 d.restore();
}
hdGroundChunk=function(cx,cy){
 const a=v41eGroundOld(cx,cy);if(a.v41e)return a;a.v41e=true;
 const ox=cx*OW.chunk,oy=cy*OW.chunk,d=a.c.getContext('2d');
 v41eRiverGround(d,cx,cy);
 if(!v16InTown(ox+OW.chunk*.5,oy+OW.chunk*.5,OW.chunk*.80))return a;
 const plaza=V16_ZONES.find(z=>z.id==='plaza');
 d.save();d.globalCompositeOperation='source-atop';
 // Border stones follow existing road segments. Omit borders at an intersection
 // or where a road blends into the central plaza; never close a traversable lane.
 for(const path of V16_ROADS){
  const [x0,y0,x1,y1]=path,dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy);if(l<15)continue;
  const ux=dx/l,uy=dy/l,nx=-uy,ny=ux;
  for(let j=13;j<l-10;j+=25)for(const side of [-1,1]){
   const x=x0+ux*j+nx*side*41,y=y0+uy*j+ny*side*41;
   if(!v41eChunkWithin(cx,cy,x,y,27)||!v16InTown(x,y,8)||v24RoundSDF(x,y,plaza,36)<15)continue;
   if(V16_ROADS.some(r=>r!==path&&v16Segment(x,y,r)<34))continue;
   const p1=[x-ux*9-nx*3,y-uy*9-ny*3],p2=[x+ux*9-nx*3,y+uy*9-ny*3],p3=[x+ux*9+nx*3,y+uy*9+ny*3],p4=[x-ux*9+nx*3,y-uy*9+ny*3];
   const q=hashOW(Math.floor(x),Math.floor(y),4110);
   hdPoly(d,[p1,p2,p3,p4].map(p=>v32P(cx,cy,...p)),hdMix('#7f887e','#b9b8a2',q*.72)+'cf','#495b4c85',.9);
   v41eGroundLine(d,cx,cy,...p1,...p2,'#e9dfbc96',1);
  }
 }
 v41ePlaza(d,cx,cy);
 d.restore();return a;
};

// Cached penumbra: a tighter contact patch plus a large smooth directional
// silhouette on façades and tall trees. Sun direction changes with world clock.
function v41eShadowArt(){
 if(V41E.shadow)return V41E.shadow;
 const c=document.createElement('canvas');c.width=c.height=128;const d=c.getContext('2d'),r=d.createRadialGradient(64,64,0,64,64,64);
 r.addColorStop(0,'#162526e6');r.addColorStop(.26,'#172828b3');r.addColorStop(.58,'#1c313267');r.addColorStop(.85,'#21373820');r.addColorStop(1,'#24393900');
 d.fillStyle=r;d.fillRect(0,0,128,128);return V41E.shadow=c;
}
function v41eHazeArt(r,g,b,radius,ratio=1){
 const key=`${r}:${g}:${b}:${radius}:${ratio}`;if(V41E.haze.has(key))return V41E.haze.get(key);
 const c=document.createElement('canvas');c.width=Math.ceil(radius*2);c.height=Math.ceil(radius*ratio*2);const d=c.getContext('2d');
 d.save();d.scale(1,ratio);const v=d.createRadialGradient(radius,radius,3,radius,radius,radius);
 v.addColorStop(0,v41eRgb(r,g,b,1));v.addColorStop(.48,v41eRgb(r,g,b,.62));v.addColorStop(1,v41eRgb(r,g,b,0));
 d.fillStyle=v;d.fillRect(0,0,c.width,radius*2);d.restore();V41E.haze.set(key,c);return c;
}
hdShadow=function(x,y,w,h,sun){
 const pen=v41eShadowArt(),night=1-sun.day,s=clamp(h/Math.max(1,w),.4,3),dx=sun.dx*(.3+sun.len*1.1),l=1+Math.min(1.45,s*.35)*sun.len;
 if(V41E.quality>0&&w>28||w>50){g.save();g.imageSmoothingEnabled=false;g.globalAlpha=.33+sun.day*.23;g.translate(x+dx*w*.45,y+w*.14+sun.len*Math.min(h,w)*.12);g.drawImage(pen,-w*l,-w*.39,w*l*2,w*.78);g.restore();}
 g.save();g.imageSmoothingEnabled=false;g.globalAlpha=.62-night*.08;g.drawImage(pen,x-w*.81,y-w*.22,w*1.62,w*.44);g.restore();
};

// Broad, barely perceptible drifting cloud shadows are world-space anchored;
// there are at most two visible passes, not a screen full of moving foliage.
function v41eCloudLight(v,vw,vh,sun){
 if(sun.day<.38||V41E.quality<2)return;
 const r=REG[p.mapId]||REG.thon;
 if(['crystal','snow','ruin','desert'].includes(r.kind))return;
 for(let i=0;i<1;i++){
  const cell=1750,x=v41eMod(415+i*1067+elapsed*(15+i*4)-v.x,cell)-180,y=v41eMod(185+i*576-v.y*.65,vh+440)-100;
  if(x<-350||x>vw+350||y<-190||y>vh+190)continue;
  g.save();g.imageSmoothingEnabled=false;const radius=310,art=v41eHazeArt(27,46,52,radius,.48);
  g.globalAlpha=.10*sun.day;g.drawImage(art,x-art.width*.5,y-art.height*.5);g.restore();
 }
}

// Real river geometry gives depth and a slow coherent downstream motion. No
// random frame-to-frame jitter and no highlights drawn on bridge decks.
v24Water=function(v,minX,maxX,vh,sun){
 v41eCloudLight(v,maxX-minX,vh,sun);
 g.save();g.lineCap='round';g.lineJoin='round';
 const step=V41E.quality===0?86:V41E.quality===1?62:49;
 for(let x=Math.floor(minX/step)*step;x<maxX+step;x+=step){
  if(isBridge(x)||isBridge(x+36))continue;
  const y=riverAt(x),base=hdPoint(x,y,v);if(base.y<-90||base.y>vh+90)continue;
  // Foamy points catch on both banks; subtle, broken instead of dashed neon lines.
  for(const side of [-1,1]){
   const a=hdPoint(x,y+side*73,v),b=hdPoint(x+39,riverAt(x+39)+side*73,v);
   g.globalAlpha=.13+.07*sun.day;g.strokeStyle='#d3e8d7';g.lineWidth=1.5;
   g.beginPath();g.moveTo(a.x,a.y);g.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2+Math.sin(x*.062+elapsed*.55)*1.7,b.x,b.y);g.stroke();
  }
  for(let j=0;j<3;j++){
   const p=x+Math.sin(elapsed*.52+x*.028+j*1.7)*10,q=riverAt(p)-44+j*43+Math.sin(elapsed*.8+x*.051+j*2)*5;
   if(isBridge(p-12)||isBridge(p+18))continue;
   const a=hdPoint(p,q,v),len=18+11*Math.sin(elapsed*.42+x*.044+j)**2;
   g.globalAlpha=.09+sun.day*.14;g.strokeStyle=j===1?'#e0f6e6':'#7ebcc5';g.lineWidth=j===1?1.4:.9;
   g.beginPath();g.moveTo(a.x-len*.5,a.y);g.quadraticCurveTo(a.x,a.y+Math.sin(elapsed+x*.04)*1.9,a.x+len*.5,a.y+.4);g.stroke();
   if(j===1&&sun.day>.50&&V41E.quality===2){g.globalAlpha=Math.max(0,Math.sin(elapsed*.82+x*.137))*.37*sun.day;g.fillStyle='#e4fff5';g.fillRect(a.x+len*.16,a.y-1,4,1);}
  }
 }g.restore();
};

// Garden water uses a few expanding concentric ripples, kept on the painted
// pond surface and compatible with the V37 garden sprite composition.
const v41eDecorOld=v24DecorDraw;
v24DecorDraw=function(o,z){
 v41eDecorOld(o,z);
 if(o.i!==0||!o.key37)return;
 const im=imgs[o.key37]?.img;if(!im?.naturalHeight)return;
 const w=o.h*im.naturalWidth/im.naturalHeight,cx=z.x+w*.035,cy=z.y-o.h*.21;
 g.save();g.strokeStyle='#ecfff0';g.lineWidth=.8;
 for(let k=0;k<2;k++){const t=v41eMod(elapsed*.22+k*.5+o.x*.019,1);g.globalAlpha=(1-t)*.34;g.beginPath();g.ellipse(cx,cy,5+t*w*.16,1.8+t*o.h*.057,0,0,TAU);g.stroke();}
 g.restore();
};

// All atmospheric grading is before the HUD, so labels and hitboxes stay clear.
// Regional effects are low-density and use a bounded deterministic animation
// budget, independent of terrain generation, frame rate and save-state.
function v41eWeather(r,sun){
 const kind=r.kind,night=1-sun.day,view=hdView(),phase=elapsed;
 let n=0,colour='#d8e7b7',sx=8,sy=14,radius=1.4;
 if(kind==='snow'){n=26;colour='#e9f7ff';sx=13;sy=22;radius=1.6;}
 else if(kind==='desert'){n=17;colour='#ffcf9d';sx=44;sy=3;radius=1.2;}
 else if(kind==='crystal'){n=14;colour='#dfc0ff';sx=6;sy=-9;radius=1.4;}
 else if(kind==='swamp'){n=11;colour='#d5e9a1';sx=3;sy=-4;radius=1;}
 else if(kind==='bamboo'){n=10;colour='#dce7ab';sx=15;sy=11;radius=1.2;}
 else if(kind==='village'&&night>.32){n=9;colour='#f7e69d';sx=4;sy=-3;radius=1.1;}
 n=Math.round(n*[0,.55,1][V41E.quality]);if(!n)return;
 g.save();g.fillStyle=colour;
 for(let i=0;i<n;i++){
  const q=hdRand(i,4127),a=(i+1)*2.399;
  const x=v41eMod(q*1497+phase*sx*(.55+q)+Math.sin(a+phase*.68)*22-view.x*V11_ZOOM*.22,W+60)-30;
  const y=v41eMod(hdRand(i,4128)*(H+60)+phase*sy*(.65+q)+Math.cos(a+phase*.7)*13-view.y*V11_ZOOM*.17,H+60)-30;
  const flicker=.5+.5*Math.sin(a+phase*(.61+q));
  g.globalAlpha=(kind==='snow'?.27:kind==='village'?.16:.12)+(kind==='snow'?.34:.24)*flicker;
  if(kind==='bamboo'){g.save();g.translate(x,y);g.rotate(a+phase*.75);g.beginPath();g.ellipse(0,0,3+q*1.7,1,0,0,TAU);g.fill();g.restore();}
  else {g.beginPath();g.arc(x,y,radius*(.6+q*.7),0,TAU);g.fill();}
 }
 g.restore();
}

function v41eGrade(sun,cold){
 // Quantize the slowly changing world clock so full-screen radial gradients
 // are rasterized only at new light levels; one cached transparent light layer.
 const day=Math.round(sun.day*36)/36,warm=Math.round(sun.warm*36)/36,night=1-day,key=[day,warm,sun.dx,cold,W,H].join(':');
 if(V41E.gradeKey===key&&V41E.grade)return V41E.grade;
 const c=V41E.grade||document.createElement('canvas');if(c.width!==W)c.width=W;if(c.height!==H)c.height=H;
 const d=c.getContext('2d');d.clearRect(0,0,W,H);
 // Cool blue shadows at night; warm raking sunlight at dawn and sundown.
 if(night>.12){d.fillStyle=v41eRgb(16,30,57,.43*night);d.fillRect(0,0,W,H);}
 const lx=sun.dx>0?0:W,ly=-H*.30,light=d.createRadialGradient(lx,ly,H*.08,lx,ly,W*.92);
 light.addColorStop(0,v41eRgb(cold?209:255,cold?235:229,cold?255:180,.09*day+.15*warm));
 light.addColorStop(.48,v41eRgb(cold?207:252,cold?230:223,cold?249:174,.035*day+.04*warm));light.addColorStop(1,'rgba(255,225,181,0)');
 d.fillStyle=light;d.fillRect(0,0,W,H);
 const vignette=d.createRadialGradient(W/2,H*.49,H*.35,W/2,H*.49,Math.hypot(W,H)*.59);
 vignette.addColorStop(0,'#071b2300');vignette.addColorStop(.79,'#071b2307');vignette.addColorStop(1,v41eRgb(6,23,31,.15+night*.10));
 d.fillStyle=vignette;d.fillRect(0,0,W,H);
 V41E.grade=c;V41E.gradeKey=key;return c;
}
hdAtmosphere=function(sun){
 const r=REG[p.mapId]||REG.thon,kind=r.kind;
 g.save();g.imageSmoothingEnabled=false;g.drawImage(v41eGrade(sun,kind==='snow'||kind==='crystal'),0,0);
 // Distinct mist profiles: thin at the clear village, dense at marshes only.
 const fog=kind==='swamp'?[178,212,185,.10]:kind==='snow'?[224,239,249,.085]:kind==='crystal'?[181,164,222,.065]:kind==='ruin'?[203,216,199,.07]:kind==='bamboo'?[210,228,198,.035]:null;
 if(fog&&V41E.quality>0)for(let i=0;i<(V41E.quality===2&&kind!=='bamboo'?2:1);i++){
  const x=v41eMod(elapsed*(9+i*3)+i*670,W+620)-310,y=75+i*320,radius=290+i*34,art=v41eHazeArt(fog[0],fog[1],fog[2],radius,.65);
  g.globalAlpha=fog[3];g.drawImage(art,x-art.width*.5,y-art.height*.5);
 }
 g.restore();v41eWeather(r,sun);
};

// Keep landmark captions distinct from the quest-tracking diamond. Placement
// is calculated in screen space; sign anchors, POIs and quest target are intact.
v17Signs=function(){
 if(modal||!v16InTown(p.x,p.y,280))return;
 const target=v12Target(v12Tracked()),marker=target?hdPoint(target.x,target.y):null;
 const mx=marker?clamp(marker.x,24,W-24):0,my=marker?clamp(marker.y-48,101,H-104):0;
 for(const s of V16_SIGNS){
  const z=hdPoint(s.x,s.y);if(z.x<30||z.x>W-30||z.y<96||z.y>H-105||dist(p,s)>710)continue;
  let y=z.y-3;const span=s.t.length*3.5+12;
  if(marker&&Math.abs(z.x-mx)<span&&Math.abs(y-my)<16)y-=23;
  if(y<87)y=z.y+17;
  g.save();g.shadowColor='#071a19';g.shadowBlur=3;g.shadowOffsetY=1;text(s.t,z.x,y,12,'#fff1ce','center','bold');g.restore();
 }
};


// integrated: v41_animation.js
