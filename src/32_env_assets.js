'use strict';
// V41 performance pass — exact display-only projection cache and conservative
// off-screen shadow rejection. Append after world/animation/combat/HUD layers.
// No simulation timestep, collision geometry or gameplay values are changed.
const V41_PERF={depth:0,heightCache:new Map(),heightCount:0,heightSeed:undefined,
 heightHits:0,heightMisses:0,cacheResets:0,shadowDrawn:0,shadowCulled:0,maxHeightEntries:24000};
function v41PerfClearHeight(){V41_PERF.heightCache.clear();V41_PERF.heightCount=0;V41_PERF.heightSeed=seed;V41_PERF.cacheResets++;}
function v41PerfCounters(){const s=V41_PERF;return {heightHits:s.heightHits,heightMisses:s.heightMisses,heightEntries:s.heightCount,cacheResets:s.cacheResets,shadowDrawn:s.shadowDrawn,shadowCulled:s.shadowCulled};}
const v41PerfRawHeight=hdHeight;
hdHeight=function(x,y){
 // Height is deterministic for a given seed and fixed world geometry. Keep
 // exact numeric coordinates; do not quantize moving entities or pathfinding.
 // Outside render, call the original directly: gameplay remains unchanged.
 if(!V41_PERF.depth||!Number.isFinite(x+y))return v41PerfRawHeight(x,y);
 if(V41_PERF.heightSeed!==seed)v41PerfClearHeight();
 let row=V41_PERF.heightCache.get(x),val=row?.get(y);
 if(val!==undefined){V41_PERF.heightHits++;return val;}
 val=v41PerfRawHeight(x,y);V41_PERF.heightMisses++;
 if(V41_PERF.heightCount>=V41_PERF.maxHeightEntries){v41PerfClearHeight();row=null;}
 if(!row){row=new Map();V41_PERF.heightCache.set(x,row);}
 row.set(y,val);V41_PERF.heightCount++;
 return val;
};
const v41PerfRawShadow=hdShadow;
hdShadow=function(x,y,w,h,sun){
 // World canvas is scaled by V11_ZOOM. Use an intentionally generous local
 // bounding box (larger than all current soft penumbrae and contact shadows).
 // This only removes shadow pixels which would have been clipped completely.
 if(v11DrawingWorld&&w>0&&Number.isFinite(x+y+w)){
  const marginX=w*4+8,marginY=w*3+8,vw=W/V11_ZOOM,vh=H/V11_ZOOM;
  if(x+marginX<0||y+marginY<0||x-marginX>vw||y-marginY>vh){V41_PERF.shadowCulled++;return;}
 }
 V41_PERF.shadowDrawn++;
 return v41PerfRawShadow(x,y,w,h,sun);
};
const v41PerfDraw=draw;
draw=function(){V41_PERF.depth++;try{return v41PerfDraw.apply(this,arguments)}finally{V41_PERF.depth--;}};


// v42_env_assets.json
const V42_ENV_ASSETS={"v42house0":ASSETS["V42_ENV_ASSETS__v42house0"],"v42house1":ASSETS["V42_ENV_ASSETS__v42house1"],"v42house2":ASSETS["V42_ENV_ASSETS__v42house2"],"v42house3":ASSETS["V42_ENV_ASSETS__v42house3"],"v42house4":ASSETS["V42_ENV_ASSETS__v42house4"],"v42house5":ASSETS["V42_ENV_ASSETS__v42house5"],"v42prop0":ASSETS["V42_ENV_ASSETS__v42prop0"],"v42prop1":ASSETS["V42_ENV_ASSETS__v42prop1"],"v42prop2":ASSETS["V42_ENV_ASSETS__v42prop2"],"v42prop3":ASSETS["V42_ENV_ASSETS__v42prop3"],"v42prop4":ASSETS["V42_ENV_ASSETS__v42prop4"],"v42prop5":ASSETS["V42_ENV_ASSETS__v42prop5"],"v42tile0":ASSETS["V42_ENV_ASSETS__v42tile0"],"v42tile1":ASSETS["V42_ENV_ASSETS__v42tile1"],"v42tile2":ASSETS["V42_ENV_ASSETS__v42tile2"],"v42tile3":ASSETS["V42_ENV_ASSETS__v42tile3"],"v42room0":ASSETS["V42_ENV_ASSETS__v42room0"],"v42room1":ASSETS["V42_ENV_ASSETS__v42room1"],"v42room2":ASSETS["V42_ENV_ASSETS__v42room2"],"v42room3":ASSETS["V42_ENV_ASSETS__v42room3"]};

// v42_environment.js
// V42 · NGỌC KINH — complete new authored 2.5D courtyard art direction.
// Existing world/room coordinates, doors, region boundaries, pathfinding and
// save data remain authoritative. Wild vegetation density is reduced in the
// shared prop list, so the visible and physical landscapes always agree.
const V42E={ground:null,roomCache:new Map(),spriteCache:new Map(),stats:{ground:0,rooms:0}};
const V42E_KEYS=typeof V42_ENV_ASSETS==='object'?Object.keys(V42_ENV_ASSETS):[];
for(const key of V42E_KEYS){const img=new Image();imgs[key]={img,ready:false};img.onload=()=>{imgs[key].ready=true;if(key.startsWith('v42tile')&&[0,1,2,3].every(i=>imgs['v42tile'+i]?.ready)){V42E.ground=null;V24.tiles.clear();}if(key.startsWith('v42room'))V42E.roomCache.clear();};img.src=V42_ENV_ASSETS[key];}
const v42eReady=key=>!!imgs[key]?.ready;
const v42eMod=(v,n)=>((v%n)+n)%n;

// More open vistas, not merely transparent obstacles. Every visual tree that
// is thinned also disappears from the shared owProps collision source. Keep
// all authored village trees and all mineral/quest structure geometry intact.
const v42eChunkOld=owChunk;
owChunk=function(cx,cy){
 const c=v42eChunkOld(cx,cy);if(c.v42e)return c;c.v42e=true;
 const greens=new Set(['tree','bamboo','swamp','snow']),chosen=[];
 c.props=c.props.filter(o=>{
  if(o.v16art!=null){chosen.push(o);return true;}
  if(!greens.has(o.kind))return true;
  const n=hashOW(Math.round(o.x),Math.round(o.y),42141),grove=hdNoise(o.x,o.y,340,42142),near=v16InTown(o.x,o.y,285);
  const keep=near?.50:(o.kind==='snow'?.57:.64)+grove*.16;
  if(n>keep||roadDistance(o.x,o.y)<64||chosen.some(k=>Math.hypot(k.x-o.x,k.y-o.y)<(o.kind==='snow'?91:77)))return false;
  chosen.push(o);return true;
 });
 return c;
};

// Shift the local village camera toward the palace roofs without changing the
// zoom or screen/world conversions. The shift smoothly vanishes in wilderness.
const v42eViewOld=hdView;
hdView=function(){const v=v42eViewOld();if(p?.worldMode){const w=clamp(1-dist(p,{x:850,y:900})/720,0,1);v.y=Math.max(0,v.y-74*w);}return v;};

// Authored terrain swatches: the existing continuous-material solver uses the
// four new actual painted textures, not stretched UI background images.
const v42eTexturesOld=v24Textures;
v24Textures=function(){
 if(![0,1,2,3].every(i=>v42eReady('v42tile'+i)))return v42eTexturesOld();
 if(V42E.ground)return V42E.ground;
 return V42E.ground=[0,1,2,3].map(i=>{
  const c=document.createElement('canvas');c.width=c.height=384;const d=c.getContext('2d');d.drawImage(imgs['v42tile'+i].img,0,0,384,384);const p=d.getImageData(0,0,384,384).data;
  // Tone down strong yellow cast while retaining subtle color distinction; no
  // global black wash and no loss of detail in shaded tiles.
  const exposure=[.93,.86,.94,.94][i],sat=[.91,.90,.77,.94][i];
  for(let k=0;k<p.length;k+=4){const r=p[k],g=p[k+1],b=p[k+2],l=.299*r+.587*g+.114*b;p[k]=(l+(r-l)*sat)*exposure+1;p[k+1]=(l+(g-l)*sat)*exposure+3;p[k+2]=(l+(b-l)*sat)*exposure+2;}
  return p;
 });
};

// A spacious ceremonial central courtyard and individual service forecourts.
// Compound boundaries are inlaid paving only, never invisible barriers.
const V42E_COURT={x:850,y:902,w:786,h:302};
const V42E_FORECOURTS=V36_ROOMS.map(r=>{const d=v36Door(r),h=V16_HOUSES[r.house];return {x:d.x,y:d.y+24,w:r.house===0?385:Math.max(230,h.w*.97),h:r.house===0?186:139,id:r.id};});
function v42eRegionTint(a,x,y){
 let r=REGIONS[0],other=r,da=Infinity,db=Infinity;
 for(const k of REGIONS){const d=((x-k.x)/1550)**2+((y-k.y)/2200)**2;if(d<da){db=da;other=r;da=d;r=k;}else if(d<db){db=d;other=k;}}
 const gap=db-da;if(!Number.isFinite(gap)||gap>1.18)return;
 const k=.5*(1-v24Ease(gap/(.84+hdNoise(x,y,280,42152)*.34))),old=.5*(1-v24Ease(gap/.54)),lush=z=>['village','bamboo','swamp'].includes(z.kind)?1:0;
 const grass=lush(r)*(1-k)+lush(other)*k,previous=lush(r)*(1-old)+lush(other)*old;
 a[3]=grass;
 const c=parseInt(r.base.slice(1),16),d=parseInt(other.base.slice(1),16),oldTint=clamp(.5-gap*1.2,0,.5);
 for(let i=0;i<3;i++){const sh=16-i*8;a[6+i]+=(((d>>sh)&255)-((c>>sh)&255))*(k-oldTint)+(previous-grass)*[8,9,9][i];}
}
const v42eMaterialOld=v24Material;
v24Material=function(x,y){
 const a=v42eMaterialOld(x,y);
 if(v16InTown(x,y,28)){
  const dist=(z,r=28)=>v24RoundSDF(x,y,z,r),court=1-v24Ease((dist(V42E_COURT,45)+8)/24);
  let fore=0;
  for(const k of V42E_FORECOURTS){if(Math.abs(x-k.x)>k.w*.5+36||Math.abs(y-k.y)>k.h*.5+36)continue;fore=Math.max(fore,1-v24Ease((dist(k)+4)/23));}
  let lane=0;
  for(let i=0;i<V16_ROADS.length;i++){const rd=v16Segment(x,y,V16_ROADS[i]),width=i<2?51:33;lane=Math.max(lane,1-v24Ease((rd-width)/22));}
  const stone=Math.min(1,Math.max(a[1],court*.985,fore*.96,lane*.87)*(1-a[4]*.15));
  a[1]=stone;a[0]=Math.min(a[0],1-a[1]);a[2]*=.41;
  // Keep the field and sparring soil purposeful, reduce stray random dirt in
  // garden margins so courtyard paving has a readable hierarchy.
  const training=V16_ZONES.find(z=>z.id==='training'),farm=V16_ZONES.find(z=>z.id==='farm');
  if(!v16Rect(x,y,training)&&!v16Rect(x,y,farm)&&lane<.1)a[0]*=.55;
 } else {
  // Broad, coherent relief instead of repetitive dirt clearings: mineral
  // regions keep their canonical region palette and smooth biome blending.
  v42eRegionTint(a,x,y);
  const q=hdNoise(x,y,290,42031)-.5,grain=hdNoise(x,y,82,42032)-.5,relief=(q*13+grain*5)*(1-a[3]);
  a[6]+=relief;a[7]+=relief;a[8]+=relief;
 }
 return a;
};

const v42eGroundOld=hdGroundChunk;
function v42eWithin(cx,cy,x,y,r=0){return x>=cx*OW.chunk-r&&x<=(cx+1)*OW.chunk+r&&y>=cy*OW.chunk-r&&y<=(cy+1)*OW.chunk+r;}
function v42eLine(d,cx,cy,x,y,X,Y,col,w=1){hdLine(d,v32P(cx,cy,x,y),v32P(cx,cy,X,Y),col,w);}
function v42ePoly(d,cx,cy,pts,col,edge,ww=1){hdPoly(d,pts.map(p=>v32P(cx,cy,...p)),col,edge,ww);}
function v42eRect(d,cx,cy,x,y,w,h,col,edge,ww=1){v42ePoly(d,cx,cy,[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],col,edge,ww);}
function v42eRing(d,cx,cy,x,y,rx,ry,col,width,segments=56){
 d.beginPath();for(let i=0;i<=segments;i++){const a=i/segments*TAU,q=v32P(cx,cy,x+Math.cos(a)*rx,y+Math.sin(a)*ry);if(i)d.lineTo(...q);else d.moveTo(...q);}d.closePath();d.strokeStyle=col;d.lineWidth=width;d.stroke();
}

// Elegant stepped granite edge courses. Skip out-of-chunk segments; all work
// is on cached terrain once, never per-frame geometry generation.
function v42eBorderCourse(d,cx,cy,court,main=false){
 if(!v42eWithin(cx,cy,court.x,court.y,Math.max(court.w,court.h)*.5+20))return;
 const lx=court.x-court.w*.5+11,rx=court.x+court.w*.5-11,ty=court.y-court.h*.5+11,by=court.y+court.h*.5-11;
 for(const [x,y,X,Y] of [[lx,ty,rx,ty],[lx,by,rx,by],[lx,ty,lx,by],[rx,ty,rx,by]]){
  const L=Math.hypot(X-x,Y-y),ux=(X-x)/L,uy=(Y-y)/L,nx=-uy,ny=ux;
  for(let k=3;k<L-5;k+=29){const px=x+ux*k,py=y+uy*k;
   if(!v42eWithin(cx,cy,px,py,33))continue;
   if(V16_ROADS.some(r=>v16Segment(px,py,r)<(main?42:30)))continue;
   const q=hashOW(Math.floor(px),Math.floor(py),42011),w=main?5:3,p1=[px-nx*w,py-ny*w],p2=[px+ux*27-nx*w,py+uy*27-ny*w],p3=[px+ux*27+nx*w,py+uy*27+ny*w],p4=[px+nx*w,py+ny*w];
   v42ePoly(d,cx,cy,[p1,p2,p3,p4],hdMix('#7f8f89','#bdbaa4',q*.70)+'e8','#51595291',1.1);
   v42eLine(d,cx,cy,...p1,...p2,'#ece0c0a0',.9);
  }
 }
}

function v42ePlazaArt(d,cx,cy){
 const court=V42E_COURT;if(!v42eWithin(cx,cy,court.x,court.y,165))return;
 // Restrained large eight-direction stone medallion, not a permanent spell.
 // Existing live player/quest circles remain inside this outer paving inlay.
 const x=court.x,y=court.y,r=116,point=(a,rad)=>[x+Math.cos(a)*rad,y+Math.sin(a)*rad];
 for(const [rr,c,w] of [[r+4,'#6f7772b0',3],[r,'#d5c9a580',2],[r-6,'#65776d90',2],[r-22,'#b0aea077',1.4],[r-36,'#69756b70',1]])v42eRing(d,cx,cy,x,y,rr,rr,c,w,64);
 for(let i=0;i<8;i++){
  const a=i*TAU/8,v=[point(a,r-9),point(a+.099,r-31),point(a,r-60),point(a-.099,r-31)];
  v42ePoly(d,cx,cy,v,i%2?'#7589808c':'#b5aa8e9a','#5b726189',1);v42eLine(d,cx,cy,...v[0],...v[2],'#e7d6af88',1);
 }
 for(let i=0;i<48;i++){
  const a=i*TAU/48,v1=point(a,r-(i%4===0?18:8)),v2=point(a,r-5);v42eLine(d,cx,cy,...v1,...v2,i%4===0?'#d5c59bba':'#666e5e80',i%4===0?1.7:.8);
 }
 // Four dignified corner stones, laid into the central court and traversable.
 for(const dx of [-1,1])for(const dy of [-1,1]){const px=x+dx*(court.w*.5-38),py=y+dy*(court.h*.5-38);if(!v42eWithin(cx,cy,px,py,45))continue;
  v42ePoly(d,cx,cy,[[px,py-19],[px+19,py],[px,py+19],[px-19,py]],'#7c8b8170','#d8cfad95',1.1);
 }
}

function v42eTrainingArt(d,cx,cy){const z=V16_ZONES.find(q=>q.id==='training');if(!v42eWithin(cx,cy,z.x,z.y,130))return;
 const x=z.x,y=z.y+13,r=Math.min(z.w,z.h)*.31;
 v42eRing(d,cx,cy,x,y,r,r,'#aaa3928e',3,8);v42eRing(d,cx,cy,x,y,r-7,r-7,'#d5c5a66c',1.2,8);v42eRing(d,cx,cy,x,y,r*.17,r*.17,'#6d725d7c',2,24);
 for(let i=0;i<8;i++){const a=i*TAU/8;v42eLine(d,cx,cy,x+Math.cos(a)*r*.79,y+Math.sin(a)*r*.79,x+Math.cos(a)*r*.95,y+Math.sin(a)*r*.95,'#d8cba083',1);}
}

function v42eThresholds(d,cx,cy){for(const r of V36_ROOMS){const q=v36Door(r),h=V16_HOUSES[r.house];if(!v42eWithin(cx,cy,q.x,q.y,145))continue;
 const rad=Math.min(91,h.w*.42),x=q.x-rad,y=q.y-42;
 for(let i=0;i<3;i++){v42eRect(d,cx,cy,x-i*4,y+i*10,rad*2+i*8,9,i%2?'#a7ab9d6a':'#d1c8ad71','#606e6490',.9);v42eLine(d,cx,cy,x-i*4,y+i*10,x+rad*2+i*4,y+i*10,'#ddd4bcb0',.9);}
 for(const side of [-1,1]){const xx=q.x+side*(rad+9);v42eRect(d,cx,cy,xx-4,q.y-41,8,42,'#758981aa','#b2c2aaa0',.8);}
 }}

// Quiet authored geographic micro-detail outside town. Uses existing ground
// collision sampling predicates; it never places new impassable objects.
function v42eWildGround(d,cx,cy){
 const ox=cx*OW.chunk,oy=cy*OW.chunk,r=regionAt(ox+OW.chunk*.5,oy+OW.chunk*.5),kind=r.kind;
 if(!['snow','desert','rock','crystal','ruin','swamp'].includes(kind))return;
 for(let i=0;i<37;i++){
  const x=ox+14+hashOW(cx,cy,42100+i*2)*(OW.chunk-28),y=oy+14+hashOW(cx,cy,42101+i*2)*(OW.chunk-28),q=hashOW(i,cx+cy,42102);
  if(regionAt(x,y).kind!==kind||roadDistance(x,y)<58||Math.abs(y-riverAt(x))<120||v16InTown(x,y,100))continue;
  const [xx,yy]=v32P(cx,cy,x,y);
  if(kind==='snow'||kind==='desert'){
   const len=10+q*26,dy=kind==='snow'?1.1:2.8;d.strokeStyle=kind==='snow'?'#edf4f047':'#c1a27746';d.lineWidth=.8;d.beginPath();d.moveTo(xx-len*.5,yy);d.quadraticCurveTo(xx,yy+dy,xx+len*.5,yy-1);d.stroke();
  }else if(kind==='crystal'||kind==='ruin'){
   const col=kind==='crystal'?'#c2b5df60':'#a0a69948',size=3+q*6;
   v42ePoly(d,cx,cy,[[x-size,y],[x-1,y-size*.7],[x+size,y+1],[x+1,y+2]],col,'#444c5d32',.6);
  }else if(kind==='swamp'){
   hdEllipse(d,xx,yy,4+q*9,1.3+q*.65,'#5d7d6243');
  }else if(q>.55){const l=9+q*10;hdLine(d,[xx-l*.5,yy],[xx+5,yy-3],'#c3af8444',1);}
 }
}

// Recompose the static terrain on top of V24's high-quality continuous
// raster. Bypass older V32/V37 duplicate paving overlays (otherwise two stone
// grids conflict), then preserve V41's smooth water/bridge surface explicitly.
hdGroundChunk=function(cx,cy){
 if(!V42E.ground&&![0,1,2,3].every(i=>v42eReady('v42tile'+i)))return v42eGroundOld(cx,cy);
 const a=v32GroundOld(cx,cy);if(a.v42e)return a;
 a.v42e=true;a.v41e=true;V42E.stats.ground++;const d=a.c.getContext('2d'),x=cx*OW.chunk+OW.chunk*.5,y=cy*OW.chunk+OW.chunk*.5;
 v41eRiverGround(d,cx,cy);d.save();d.globalCompositeOperation='source-atop';
 if(v16InTown(x,y,OW.chunk*.82)){v42eBorderCourse(d,cx,cy,V42E_COURT,true);for(const z of V42E_FORECOURTS)v42eBorderCourse(d,cx,cy,z);v42ePlazaArt(d,cx,cy);v42eTrainingArt(d,cx,cy);v42eThresholds(d,cx,cy);}else v42eWildGround(d,cx,cy);
 d.restore();return a;
};

// Crop-normalized, real alpha silhouettes. The lower stairs anchor to their
// existing house positions; wider roof overhangs are purely visual (walkers
// underneath fade the occluding silhouette instead of changing pathing).
const V42E_HOUSE_ANCHOR=[.47,.43,.43,.43,.43];
const V42E_HOUSE_WIDTH=[1.76,1.68,1.66,1.70,1.64];
// A shallow orthographic roof pitch keeps the tall two-storey silhouettes
// within the northern world bound, even when the camera cannot pan farther.
const V42E_HOUSE_Y=[.84,.97,.84,1,1];
const V42E_HOUSE_LAMPS=[[[.32,.58],[.62,.55]],[[.38,.67]],[[.20,.64],[.72,.68]],[[.39,.68]],[[.45,.70]]];
function v42eHouseFade(z,w,h,left){const hero=HD.heroScreen||hdPoint(p.x,p.y),dy=z.y-hero.y;return dy>0&&dy<h*.80&&hero.x>left+w*.12&&hero.x<left+w*.88?Math.max(.42,1-v24Ease((h*.8-dy)/(h*.27))*.54):1;}
const v42eHouseOld=v17House;
v17House=function(h,z){
 const i=V16_HOUSES.indexOf(h),asset=imgs['v42house'+i];if(!asset?.ready)return v42eHouseOld(h,z);
 const im=asset.img,w=h.w*V42E_HOUSE_WIDTH[i],hh=w*im.naturalHeight/im.naturalWidth*V42E_HOUSE_Y[i],left=z.x-w*V42E_HOUSE_ANCHOR[i],top=z.y-hh;
 g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='low';g.globalAlpha=v42eHouseFade(z,w,hh,left);g.drawImage(im,left,top,w,hh);g.restore();
 const night=1-hdSun().day;if(night>.40&&V41E.quality>0){const art=v41eHazeArt(255,187,81,36,.82);g.save();g.globalCompositeOperation='screen';g.imageSmoothingEnabled=false;g.globalAlpha=(night-.34)*.34;for(const [lx,ly] of V42E_HOUSE_LAMPS[i]){const x=left+w*lx,y=top+hh*ly;g.drawImage(art,x-art.width*.5,y-art.height*.5);}g.restore();}
};

function v42eSprite(key,z,h,fade=1,wOverride=null){const a=imgs[key];if(!a?.ready)return false;const im=a.img,w=wOverride||h*im.naturalWidth/im.naturalHeight,hh=wOverride?w*im.naturalHeight/im.naturalWidth:h;g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='low';g.globalAlpha=fade;g.drawImage(im,z.x-w*.5,z.y-hh,w,hh);g.restore();return {w,h:hh};}
function v42eLamp(z,h){const a=v42eSprite('v42prop2',z,h);if(!a)return false;
 const n=1-hdSun().day;if(n>.15){const art=v41eHazeArt(255,190,87,27,.9),alpha=(.12+n*.38)*(1+.07*Math.sin(elapsed*2+z.x*.031));g.save();g.imageSmoothingEnabled=false;g.globalAlpha=alpha;g.globalCompositeOperation='screen';g.drawImage(art,z.x-art.width*.5,z.y-a.h*.68-art.height*.5);g.restore();}return true;
}
const v42eDecorOld=v24DecorDraw;
v24DecorDraw=function(o,z){
 if(!o.key37&&o.id===1){if(v42eLamp(z,63))return;}
 if(o.i===5){if(v42eLamp(z,Math.max(58,o.h)))return;}
 if(o.i===0&&v42eReady('v42prop0')){
  const a=v42eSprite('v42prop0',z,o.h,1,Math.max(93,(o.r||34)*2.55));
  g.save();g.strokeStyle='#d4f4e2';g.lineWidth=.75;for(let k=0;k<2;k++){const t=v42eMod(elapsed*.24+k*.5+o.x*.017,1);g.globalAlpha=(1-t)*.41;g.beginPath();g.ellipse(z.x+a.w*.07,z.y-a.h*.62,3+t*a.w*.14,1+t*a.h*.074,0,0,TAU);g.stroke();}g.restore();return;
 }
 if(o.i===6&&v42eReady('v42prop1')){const im=imgs.v42prop1.img,h=o.h,w=h*im.naturalWidth/im.naturalHeight;v42eSprite('v42prop1',z,h,v42eHouseFade(z,w,h,z.x-w*.5));return;}
 if(o.i===4&&v42eSprite('v42prop4',z,Math.min(43,o.h*.7)))return;
 if(o.i===1&&v42eSprite('v42prop5',z,Math.min(67,o.h*.77)))return;
 return v42eDecorOld(o,z);
};

const v42eLandmarkOld=v16LandmarkArt;
v16LandmarkArt=function(type,z){if(type==='gate'&&v42eSprite('v42house5',z,168))return;if(type==='well'&&v42eSprite('v42prop5',z,57))return;return v42eLandmarkOld(type,z);};

// Balustrade side panels are pushed into the existing solid temple footprint;
// their projection never creates a newly blocked route or crosses door axis.
const v42eDecorLayerOld=v16DrawDecor;
v16DrawDecor=function(items,v,visible){
 v42eDecorLayerOld(items,v,visible);if(!v42eReady('v42prop3'))return;
 const h=V16_HOUSES[0];for(const side of [-1,1]){
  const x=h.x+side*h.w*.43,y=h.y-3;
  if(!visible(x,y,75)||!owBlocked(x,y,6))continue;const z=hdPoint(x,y,v);items.push({y:z.y-.5,draw:()=>v42eSprite('v42prop3',z,32)});
 }
};

// High-quality material-matched interiors: original furniture and exact
// collision rectangles stay intact; only the static room canvas is recomposed.
function v42eTileFill(d,key,x,y,w,h,tw,th,alpha=1){
 const a=imgs[key];if(!a?.ready)return false;d.save();d.globalAlpha=alpha;d.beginPath();d.rect(x,y,w,h);d.clip();
 for(let row=0,yy=y;yy<y+h;yy+=th,row++)for(let col=0,xx=x;xx<x+w;xx+=tw,col++){
  d.save();d.translate(xx+((col&1)?tw:0),yy+((row&1)?th:0));d.scale(col&1?-1:1,row&1?-1:1);d.drawImage(a.img,0,0,tw,th);d.restore();
 }d.restore();return true;
}
const V42E_ROOMS={hall:{floor:0,rug:2,border:'#d0b27b',tint:'#6c3f1a',sun:'#f9d49a'},herb:{floor:0,rug:3,border:'#b2c6a5',tint:'#374936',sun:'#d5e6a8'},trade:{floor:0,rug:2,border:'#cfb56d',tint:'#715025',sun:'#f8d690'},sword:{floor:1,rug:3,border:'#bac9bd',tint:'#425353',sun:'#cde4e5'},guard:{floor:1,rug:3,border:'#b5ba97',tint:'#5a5842',sun:'#e6d7af'}};
const v42eRoomOld=v36Backdrop;
v36Backdrop=function(r){
 const base=v42eRoomOld(r),pal=V42E_ROOMS[r.theme]||V42E_ROOMS.hall;
 if(![pal.floor,pal.rug].every(i=>v42eReady('v42room'+i)))return base;
 const known=V42E.roomCache.get(r.id);if(known?.base===base)return known.c;
 const c=document.createElement('canvas');c.width=W;c.height=H;const d=c.getContext('2d');d.drawImage(base,0,0);
 const rect=(x,y,w,h,col)=>{d.fillStyle=col;d.fillRect(x,y,w,h);};
 const ln=(x,y,X,Y,col,w=1)=>{d.strokeStyle=col;d.lineWidth=w;d.beginPath();d.moveTo(x,y);d.lineTo(X,Y);d.stroke();};
 v42eTileFill(d,'v42room'+pal.floor,252,252,776,326,pal.floor?305:462,pal.floor?214:205,.98);
 rect(252,252,776,326,pal.tint+'20');
 // Deep dark contact shading under the north wall; a thin jade baseboard
 // makes the wall/floor junction look substantial without obstructing actors.
 const north=d.createLinearGradient(0,251,0,314);north.addColorStop(0,'#08121392');north.addColorStop(1,'#08121300');rect(252,251,776,64,north);
 rect(252,249,776,5,'#292f2a');rect(252,249,776,1,pal.border+'b9');rect(252,253,776,2,'#141d1baa');
 // Handwoven runner rug with subtle ornament; no repeating UI-like circles.
 rect(527,254,226,324,'#171e1b8c');v42eTileFill(d,'v42room'+pal.rug,533,257,214,321,214,152,1);
 for(const [x,y,w,h] of [[535,258,210,318],[541,264,198,306]]){d.strokeStyle=pal.border;d.lineWidth=x===535?2:.8;d.strokeRect(x,y,w,h);}
 for(let x=540;x<741;x+=5){ln(x,576,x,581,pal.border+'9f',.7);}
 // Raised decorative panel/pilaster trim behind existing furniture and actual
 // interactive NPCs; no foreground clipping or additional solid rectangles.
 for(const x of [272,493,753,974]){if(x>490&&x<760)continue;const q=d.createLinearGradient(x,0,x+32,0);q.addColorStop(0,'#342b24');q.addColorStop(.48,'#8f744d');q.addColorStop(.68,'#c5a471');q.addColorStop(1,'#42372b');rect(x,142,25,100,q);rect(x-4,139,33,5,pal.border+'d8');rect(x-3,241,31,5,'#4a4431');}
 for(const x of [258,1018]){rect(x,258,8,315,'#17272478');ln(x+1,260,x+1,569,pal.border+'68',1);}
 for(const f of v37Furniture(r)){const x=f.x+f.w*.5,y=f.y+f.h,q=d.createRadialGradient(x,y,2,x,y,f.w*.64);q.addColorStop(0,'#0e17145c');q.addColorStop(1,'#0e171400');d.save();d.translate(0,y);d.scale(1,.27);d.translate(0,-y);rect(x-f.w,y-f.w,f.w*2,f.w*2,q);d.restore();}
 // Gentle rectangular sunlight reflections onto the textured floor, cached.
 d.save();d.beginPath();d.rect(252,254,776,324);d.clip();for(const [x,y] of [[375,314],[905,314],[640,522]]){const q=d.createRadialGradient(x,y,12,x,y,163);q.addColorStop(0,pal.sun+'23');q.addColorStop(1,pal.sun+'00');rect(x-163,y-163,326,326,q);}d.restore();
 V42E.roomCache.set(r.id,{base,c});V42E.stats.rooms++;return c;
};


