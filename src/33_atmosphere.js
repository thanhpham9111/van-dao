'use strict';
// v42_atmosphere.js
// V42 · KHÍ TƯỢNG SƠN HÀ — dynamic but quiet environmental animation.
// No collision, combat, resource, inventory or save mutation. All particle
// state is bounded/runtime-only; weather follows the existing world clock.
const V42_ATMO={owner:null,seed:null,sim:0,worldTime:null,last:null,step:0,foot:0,serial:0,tracks:[],dust:[],reflectionArt:new Map(),reflectChunks:new WeakMap(),bankY:new Map(),metrics:{weather:0,water:0,reflections:0,tracks:0,dust:0,emitted:0}};
const V42_ATMO_FRONTS={
 village:['clear','clear','clear','rain','mist'],
 bamboo:['clear','rain','gust','rain','clear'],
 swamp:['mist','rain','mist','spirit','rain'],
 snow:['clear','snow','snow','gust','snow'],
 desert:['clear','dust','clear','gust','dust'],
 rock:['clear','gust','rain','gust','clear'],
 ruin:['mist','spirit','clear','gust','mist'],
 crystal:['spirit','clear','mist','spirit','gust']
};
const V42_ATMO_WEATHER={clear:['Trời quang','#f2edca'],rain:['Mưa phùn','#b6d4e3'],snow:['Tuyết bay','#f5faff'],gust:['Gió lộng','#ded8b2'],dust:['Cát bay','#e7c293'],mist:['Sương mỏng','#c3dade'],spirit:['Linh khí','#d9c6f8']};
const v42aQuality=()=>clamp(typeof V41E==='object'?V41E.quality:1,0,2);
const v42aWrap=(n,s)=>((n%s)+s)%s;
const v42aUnit=(n,s)=>hdRand(n,s);
function v42aClock(){return V42_ATMO.owner===p&&Number.isFinite(V42_ATMO.worldTime)?V42_ATMO.worldTime:Number(p?.worldTime)||0;}
// Deterministic from seed, region and simulation time, with a 7-second
// transition on both ends of the forecast window. No random flickering.
function v42AtmoWeather(r=(REG[p?.mapId]||REG.thon),time=v42aClock()){
 const cycle=70,offset=hashOW(r.x,r.y,42911)*cycle,t=Math.max(0,time)+offset,slot=Math.floor(t/cycle),local=t-slot*cycle;
 const dates=V42_ATMO_FRONTS[r.kind]||V42_ATMO_FRONTS.rock;
 const idx=Math.floor(hashOW(r.x+slot*177,r.y-slot*31,42912)*dates.length),type=dates[Math.min(dates.length-1,idx)],meta=V42_ATMO_WEATHER[type];
 const envelope=v24Ease(Math.min(local,cycle-local)/7),intensity=type==='clear'?0:envelope*(.58+hashOW(r.x,slot,42913)*.42);
 return {type,name:meta[0],color:meta[1],intensity,region:r.id,next:cycle-local,slot};
}

// Ground reactions follow actual post-collision movement. Teleporting or
// changing realm/room never creates a long trail across unrelated maps.
function v42aSurface(x,y,weather){
 const r=regionAt(x,y),bridge=Math.abs(y-riverAt(x))<92&&isBridge(x);
 if(bridge)return weather.type==='rain'&&weather.intensity>.25?'wetwood':'wood';
 if(r.kind==='snow')return 'snow';
 if(weather.type==='rain'&&weather.intensity>.25)return 'wet';
 if(r.kind==='desert')return 'sand';
 if(v16InTown(x,y,12)){
  const paved=typeof V42E_COURT==='object'&&v24RoundSDF(x,y,V42E_COURT,30)<0||typeof V42E_FORECOURTS==='object'&&V42E_FORECOURTS.some(z=>v24RoundSDF(x,y,z,24)<0);
  return paved||roadDistance(x,y)<75?'stone':'grass';
 }
 return roadDistance(x,y)<65?'soil':r.kind==='swamp'?'mud':'grass';
}
const V42_ATMO_SURFACES={
 snow:{mark:'#718e9689',edge:'#f6fff2bd',dust:'#f2feff',life:6.4,emit:3},
 sand:{mark:'#a1764d82',edge:'#dbc59692',dust:'#d8af77',life:4.6,emit:3},
 soil:{mark:'#76624750',edge:'#d3b9864f',dust:'#bea686',life:3.1,emit:2},
 wet:{mark:'#223e485c',edge:'#b8d3ca51',dust:'#b7e0f2',life:3.8,emit:3},
 wetwood:{mark:'#20373d5e',edge:'#ccdbdc51',dust:'#c3e0e3',life:2.7,emit:2},
 mud:{mark:'#4a514485',edge:'#8c9d8150',dust:'#9eab91',life:4.1,emit:2},
 grass:{mark:'#31462d32',edge:'#b6c77a32',dust:'#d6db9d',life:1.9,emit:1},
 stone:{mark:'#665d4725',edge:'#e4dab920',dust:'#dcd6bf',life:1.5,emit:1},
 wood:{mark:'#52402e3b',edge:'#d4ae8042',dust:'#d1b69a',life:1.3,emit:1}
};
function v42aReset(){const a=V42_ATMO;if(a.seed!==seed){a.bankY.clear();a.reflectChunks=new WeakMap();}a.owner=p;a.seed=seed;a.sim=0;a.worldTime=Number(p?.worldTime)||0;a.last=null;a.step=0;a.foot=0;a.serial=0;a.tracks.length=0;a.dust.length=0;}
function v42aEmit(x,y,dx,dy,weather,q){
 const a=V42_ATMO,kind=v42aSurface(x,y,weather),s=V42_ATMO_SURFACES[kind],an=Math.atan2(dy,dx),side=(a.foot++&1)?1:-1,px=x-dy*side*4,py=y+dx*side*4;
 const life=s.life*(q===1?.78:1);a.tracks.push({x:px,y:py,an,life,max:life,kind,side});
 const limit=[0,22,36][q];if(a.tracks.length>limit)a.tracks.splice(0,a.tracks.length-limit);
 const n=Math.max(1,s.emit-(q===1?1:0));
 for(let i=0;i<n;i++){
  const serial=a.serial++,u=v42aUnit(serial,42914),w=v42aUnit(serial,42915),wet=kind==='wet'||kind==='wetwood',life=.27+u*.34;
  a.dust.push({x:px+dy*(u-.5)*8,y:py-dx*(u-.5)*8,vx:-dx*(7+w*21)+dy*(u-.5)*35,vy:-dy*(7+w*21)-dx*(u-.5)*35,z:0,vz:wet?18+u*19:9+w*16,life,max:life,r:1.25+w*2.1,col:s.dust,wet});
 }
 const dustLimit=[0,20,38][q];if(a.dust.length>dustLimit)a.dust.splice(0,a.dust.length-dustLimit);a.metrics.emitted++;
}
function v42aTick(dt){
 const a=V42_ATMO;if(a.owner!==p||a.seed!==seed)v42aReset();
 if(!p?.worldMode||mode!=='play'||v36Inside()){a.last=null;a.step=0;a.tracks.length=0;a.dust.length=0;return;}
 if(modal)return;if(!Number.isFinite(dt)||dt<=0)return;dt=Math.min(dt,.12);a.sim+=dt;a.worldTime=Number(p.worldTime)||0;
 const q=v42aQuality(),next={x:p.x,y:p.y,region:p.mapId};
 if(!q){a.tracks.length=0;a.dust.length=0;a.last=next;a.step=0;return;}
 for(const t of a.tracks)t.life-=dt;a.tracks=a.tracks.filter(t=>t.life>0);
 for(const t of a.dust){t.life-=dt;t.x+=t.vx*dt;t.y+=t.vy*dt;t.z=Math.max(0,t.z+t.vz*dt);t.vz-=58*dt;t.vx*=Math.exp(-dt*2.5);t.vy*=Math.exp(-dt*2.5);}
 a.dust=a.dust.filter(t=>t.life>0);
 // Prune immediately even if the player stands still after a quality drop.
 if(a.tracks.length>[0,22,36][q])a.tracks.splice(0,a.tracks.length-[0,22,36][q]);if(a.dust.length>[0,20,38][q])a.dust.splice(0,a.dust.length-[0,20,38][q]);
 const prev=a.last;a.last=next;
 if(!prev||prev.region!==next.region){a.step=0;return;}
 const dx=next.x-prev.x,dy=next.y-prev.y,d=Math.hypot(dx,dy);if(d>180){a.step=0;return;}if(d<.02)return;
 const spacing=34,weather=v42AtmoWeather(),ux=dx/d,uy=dy/d;let left=d,until=spacing-a.step,advanced=0,produced=0;
 while(left>=until&&produced<4){advanced+=until;left-=until;v42aEmit(prev.x+ux*advanced,prev.y+uy*advanced,ux,uy,weather,q);produced++;a.step=0;until=spacing;}
 a.step=Math.min(spacing-.001,a.step+left);
}
const v42aUpdateOld=update;
update=function(dt){const out=v42aUpdateOld(dt);v42aTick(dt);return out;};

function v42aDrawTracks(v,vw,vh){
 const a=V42_ATMO,q=v42aQuality();a.metrics.tracks=a.metrics.dust=0;if(!q||!a.tracks.length&&!a.dust.length)return;
 g.save();for(const t of a.tracks){const z=hdPoint(t.x,t.y,v);if(z.x<-12||z.x>vw+12||z.y<-15||z.y>vh+15)continue;const s=V42_ATMO_SURFACES[t.kind],u=Math.min(1,t.life/t.max*1.4),angle=Math.atan2(Math.sin(t.an)*HD.tilt,Math.cos(t.an));
  const rot=angle+Math.PI*.5+t.side*.08,x=z.x+Math.sin(rot),y=z.y-Math.cos(rot);g.globalAlpha=u*.82;g.fillStyle=s.mark;g.beginPath();g.ellipse(x,y,2.45,5.7,rot,0,TAU);g.fill();g.strokeStyle=s.edge;g.lineWidth=.65;g.beginPath();g.ellipse(x,y,2.5,5.7,rot,Math.PI*.10,Math.PI*1.08);g.stroke();a.metrics.tracks++;
  if((t.kind==='wet'||t.kind==='wetwood')&&t.life>t.max-.30){const k=clamp((t.max-t.life)/.30,0,1);g.globalAlpha=(1-k)*.31;g.strokeStyle='#b7e0da';g.lineWidth=.6;g.beginPath();g.ellipse(z.x,z.y,2+k*9,1+k*3,0,0,TAU);g.stroke();}
 }
 for(const t of a.dust){const z=hdPoint(t.x,t.y,v);if(z.x<-10||z.x>vw+10||z.y<-10||z.y>vh+10)continue;const a0=clamp(t.life/t.max,0,1);g.globalAlpha=a0*(t.wet?.50:.36);g.fillStyle=t.col;g.beginPath();g.ellipse(z.x,z.y-t.z,t.r*(1+(1-a0)*.6),t.r*(t.wet?.72:.56),0,0,TAU);g.fill();a.metrics.dust++;}
 g.restore();
}

// Mirror the real alpha silhouette of nearby tree/rock art into a tiny,
// desaturated reflection atlas. This is cached once per sprite, not a copy
// of the framebuffer. River clipping prevents reflected art crossing land.
function v42aReflectionArt(o){
 const i=v15PropIndex(o),im=imgs['v15prop'+i];if(!im?.ready)return null;
 const key=i+'|'+(o.kind==='snow'?'frost':'land'),a=V42_ATMO;if(a.reflectionArt.has(key))return a.reflectionArt.get(key);
 const src=im.img;if(!src.naturalWidth||!src.naturalHeight)return null;const h=72,w=Math.max(16,Math.round(h*src.naturalWidth/src.naturalHeight)),c=document.createElement('canvas');c.width=w;c.height=h;const d=c.getContext('2d');
 d.save();d.translate(0,h);d.scale(1,-1);d.drawImage(src,0,0,w,h);d.restore();
 d.globalCompositeOperation='source-in';d.fillStyle=o.kind==='snow'?'#8aaeb2':'#305f56';d.fillRect(0,0,w,h);
 d.globalCompositeOperation='destination-in';const gr=d.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ffffffd0');gr.addColorStop(.5,'#ffffff9e');gr.addColorStop(1,'#ffffff00');d.fillStyle=gr;d.fillRect(0,0,w,h);
 // Tiny horizontal transparent cuts suggest uneven flow without raster
 // warping or separate expensive image draw calls for every ripple.
 d.globalCompositeOperation='destination-out';d.fillStyle='#ffffff66';for(let y=9;y<h;y+=7){const off=Math.round(v42aUnit(y,i)*w*.26);d.fillRect(off,y,w-off,1);}
 d.globalCompositeOperation='source-over';a.reflectionArt.set(key,c);if(a.reflectionArt.size>32)a.reflectionArt.delete(a.reflectionArt.keys().next().value);return c;
}
function v42aRiverVisible(v,minX,maxX,vh){for(let x=minX-32;x<=maxX+160;x+=220){const q=hdPoint(clamp(x,0,OW.w),riverAt(clamp(x,0,OW.w)),v);if(q.y>-145&&q.y<vh+145)return true;}return false;}
function v42aBank(x,side,v){
 // Camera-independent bank projection at fixed 24-unit sample positions;
 // the clip path only subtracts the moving camera, never resamples terrain.
 const key=x+'|'+side,a=V42_ATMO;if(a.bankY.has(key))return {x:x-v.x,y:a.bankY.get(key)-v.y};
 const y=riverAt(x)+side*70,py=y*HD.tilt-hdHeight(x,y);a.bankY.set(key,py);if(a.bankY.size>768)a.bankY.delete(a.bankY.keys().next().value);return {x:x-v.x,y:py-v.y};
}
function v42aRiverClip(v,minX,maxX){
 g.beginPath();const left=Math.max(0,Math.floor(minX/24)*24-24),right=Math.min(OW.w,maxX+24);let segment=[];
 const flush=()=>{if(segment.length<2){segment=[];return;}for(let i=0;i<segment.length;i++){const z=v42aBank(segment[i],-1,v);if(i)g.lineTo(z.x,z.y);else g.moveTo(z.x,z.y);}for(let i=segment.length-1;i>=0;i--){const z=v42aBank(segment[i],1,v);g.lineTo(z.x,z.y);}g.closePath();segment=[];};
 for(let x=left;x<=right;x+=24){if(isBridge(x-12)||isBridge(x+12)){flush();continue;}segment.push(x);}flush();g.clip();
}
function v42aReflectionCandidates(v,minX,maxX,vh,q){
 const out=[];const c0=Math.max(0,Math.floor((minX-120)/OW.chunk)),c1=Math.min(Math.ceil(OW.w/OW.chunk)-1,Math.floor((maxX+120)/OW.chunk));
 for(let cx=c0;cx<=c1;cx++){
  // Read only already-visible chunk objects. Never force generation of
  // distant terrain because a reflection happens to be near an edge.
  const x0=cx*OW.chunk,ys=[riverAt(x0),riverAt(x0+OW.chunk*.5),riverAt(x0+OW.chunk)],lo=Math.max(0,Math.floor((Math.min(...ys)-325)/OW.chunk)),hi=Math.min(Math.ceil(OW.h/OW.chunk)-1,Math.floor((Math.max(...ys)-100)/OW.chunk));
  for(let cy=lo;cy<=hi;cy++){
   const c=owCache.get(seed+':'+cx+':'+cy);if(!c)continue;let rows=V42_ATMO.reflectChunks.get(c);
   if(!rows){rows=[];for(const o of c.props){if(!['tree','bamboo','swamp','snow','rock'].includes(o.kind)||isBridge(o.x))continue;const gap=riverAt(o.x)-o.y;if(gap<80||gap>310)continue;const i=v15PropIndex(o),h=V15_PROP_H[i]*o.scale*(.93+(o.seed||0)*.15),rh=h*.82;if(gap*HD.tilt<=rh+55)rows.push({o,h:rh,rank:gap-.25*h});}V42_ATMO.reflectChunks.set(c,rows);}
   for(const row of rows){const {o,h}=row;if(o.x<minX-120||o.x>maxX+120)continue;const z=hdPoint(o.x,o.y,v);if(z.y<=vh+75&&z.y+h>=-30)out.push({...row,z});}
  }
 }
 out.sort((a,b)=>a.rank-b.rank);return out.slice(0,[0,3,6][q]);
}
function v42aReflections(v,minX,maxX,vh,sun,visible=v42aRiverVisible(v,minX,maxX,vh)){
 const a=V42_ATMO,q=v42aQuality();a.metrics.reflections=0;if(!q||!visible)return;
 const list=v42aReflectionCandidates(v,minX,maxX,vh,q);if(!list.length)return;g.save();v42aRiverClip(v,minX,maxX);
 g.globalAlpha=.30+sun.day*.11;g.imageSmoothingEnabled=false;
 for(const item of list){const {o,z,h}=item,im=v42aReflectionArt(o);if(!im)continue;const w=h*im.width/im.height*1.10,sway=Math.sin(V42_ATMO.sim*.85+o.seed*17)*3;
  g.save();g.translate(z.x+sway,z.y);if(o.seed>.5)g.scale(-1,1);g.drawImage(im,-w*.5,0,w,h);g.restore();a.metrics.reflections++;
 }
 g.restore();
}

// Water reaction to weather. A small, world-anchored set of droplets slides
// slowly downstream. Never draw on bridges or outside the true river water.
function v42aRiverRain(v,minX,maxX,vh,weather,q,visible=v42aRiverVisible(v,minX,maxX,vh)){
 const a=V42_ATMO;a.metrics.water=0;if(weather.type!=='rain'||weather.intensity<.15||!q||!visible)return;
 const step=q===2?76:120,clock=a.sim;g.save();g.strokeStyle='#d2f1ea';g.lineWidth=.78;
 for(let x=Math.floor(minX/step)*step;x<maxX+step&&a.metrics.water<[0,12,21][q];x+=step){const k=x/step,u=v42aUnit(k,42920),t=v42aWrap(clock*(.77+u*.25)+u,1),xx=x+v42aUnit(k,42921)*step*.75+13*t,y=riverAt(xx)+(v42aUnit(k,42922)-.5)*108;if(isBridge(xx-12)||isBridge(xx+12))continue;
  const z=hdPoint(xx,y,v);if(z.y<-20||z.y>vh+20)continue;g.globalAlpha=(1-t)*weather.intensity*.50;g.beginPath();g.ellipse(z.x,z.y,1.7+t*10,0.8+t*3.2,0,0,TAU);g.stroke();a.metrics.water++;
 }g.restore();
}
const v42aWaterOld=v24Water;
v24Water=function(v,minX,maxX,vh,sun){const q=v42aQuality(),weather=v42AtmoWeather(),visible=q>0&&v42aRiverVisible(v,minX,maxX,vh);v42aReflections(v,minX,maxX,vh,sun,visible);v42aWaterOld(v,minX,maxX,vh,sun);v42aRiverRain(v,minX,maxX,vh,weather,q,visible);};
const v42aBridgeOld=hdBridge;
hdBridge=function(v,sun){v42aBridgeOld(v,sun);v42aDrawTracks(v,W/V11_ZOOM,H/V11_ZOOM);};

// Pond koi and floating petals. Tiny animated shapes are constrained to the
// real painted water ellipse, no decorative object covers a walking route.
const v42aPondOld=v24DecorDraw;
v24DecorDraw=function(o,z){
 v42aPondOld(o,z);const q=v42aQuality();if(!q||o.i!==0||!imgs.v42prop0?.ready)return;
 const src=imgs.v42prop0.img,w=Math.max(93,(o.r||34)*2.55),h=w*src.naturalHeight/src.naturalWidth;if(h<12)return;
 const cx=z.x+w*.015,cy=z.y-h*.58,rx=w*.23,ry=h*.145,t=V42_ATMO.sim+o.x*.013;
 g.save();g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,TAU);g.clip();
 for(let i=0;i<q;i++){const a=t*(i?.39:.51)+i*3.71,x=cx+Math.cos(a)*rx*.68,y=cy+Math.sin(a)*ry*.57,dir=Math.atan2(Math.cos(a)*ry*.57,-Math.sin(a)*rx*.68);g.save();g.translate(x,y);g.rotate(dir);g.globalAlpha=.42;g.fillStyle='#c17b4d';g.beginPath();g.ellipse(0,0,4.0,1.45,0,0,TAU);g.fill();g.fillStyle='#f4d5b2';g.beginPath();g.ellipse(1,0,1.65,1.1,0,0,TAU);g.fill();g.fillStyle='#b3794b';g.beginPath();g.moveTo(-3.7,0);g.lineTo(-6,-1.6+Math.sin(t*9+i)*.8);g.lineTo(-5.2,1.6);g.closePath();g.fill();g.restore();}
 const weather=v42AtmoWeather();if(weather.type==='rain'&&weather.intensity>.24)for(let i=0;i<3;i++){const f=v42aWrap(t*.82+i*.33,1),x=cx+(v42aUnit(i,42925)-.5)*rx*1.35,y=cy+(v42aUnit(i,42926)-.5)*ry;g.globalAlpha=(1-f)*weather.intensity*.45;g.strokeStyle='#e3f5e9';g.lineWidth=.65;g.beginPath();g.ellipse(x,y,1+f*5,.6+f*1.8,0,0,TAU);g.stroke();}
 g.restore();
};

// Replace the tiny universal motes with distinct weather animation only
// while one weather front is active. Clear weather retains the old subtle
