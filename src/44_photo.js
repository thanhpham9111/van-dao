'use strict';
// v42_photo.js
// V42 scenic capture mode: pause, temporarily light and frame the actual live
// world, clean HUD, export PNG. No changes to progression or saved time.
const V42_PHOTO={active:false,owner:null,light:-1,dx:0,dy:0,hidden:false,note:'',capture:false};
const V42_PHOTO_LIGHT=[['Hiện tại',null],['Bình minh',70],['Chính ngọ',180],['Hoàng hôn',270],['Đêm',338]];
function v42PhotoReady(){return mode==='play'&&p?.worldMode&&!v36Inside()&&!modal&&!failed;}
function v42PhotoRelease(){for(const k in keys)keys[k]=false;for(const k in pressed)delete pressed[k];mouse.left=mouse.right=mouse.cast=mouse.fire=false;}
function v42PhotoToggle(){
 if(V42_PHOTO.active){V42_PHOTO.active=false;V42_PHOTO.owner=null;V42_PHOTO.note='';v42PhotoRelease();return true;}
 if(!v42PhotoReady()||v42wFightNearby()){message('Chỉ chụp Sơn Hà Ảnh khi đứng ngoài trời và an toàn.');return false;}
 Object.assign(V42_PHOTO,{active:true,owner:p,light:0,dx:0,dy:0,hidden:false,note:'',capture:false});v42PhotoRelease();mouse.inside=false;return true;
}
function v42PhotoLight(i){V42_PHOTO.light=clamp(i,0,V42_PHOTO_LIGHT.length-1);V42_PHOTO.note='';}
const v42PhotoOldDraw=draw;
function v42PhotoRender(controls=true){
 if(!V42_PHOTO.active||V42_PHOTO.owner!==p)return v42PhotoOldDraw();
 const a=V42_PHOTO,worldTime=p.worldTime,camera=owCamera,oldHud=worldHud,oldText=text,oldPText=v41PText,oldRoute=v8DrawRoute,oldCursor=v8Cursor,oldMouse=mouse.inside,oldShake=screenShake,transition=V41Presentation.transition;
 try{
  if(a.light>0)p.worldTime=(Math.floor((worldTime||0)/360)*360)+V42_PHOTO_LIGHT[a.light][1];
  owCamera={x:clamp(camera.x+a.dx,0,OW.w-W),y:clamp(camera.y+a.dy,0,OW.h-H)};
  worldHud=()=>{};text=()=>{};v41PText=()=>{};v8DrawRoute=()=>{};v8Cursor=()=>{};mouse.inside=false;screenShake=false;V41Presentation.transition=0;
  v42PhotoOldDraw();
 }finally{p.worldTime=worldTime;owCamera=camera;worldHud=oldHud;text=oldText;v41PText=oldPText;v8DrawRoute=oldRoute;v8Cursor=oldCursor;mouse.inside=oldMouse;screenShake=oldShake;V41Presentation.transition=transition;}
 buttons=[];if(!controls)return;
 if(a.hidden)return;
 v41PFrame(22,20,1236,72,true);v41PText('SƠN HÀ ẢNH',42,42,19,'#e9d7ab','left','serif','bold');v41PText('Chụp khung cảnh thật · tạm dừng thế giới',43,67,11,'#bed1c4','left','sans');
 for(let i=0;i<V42_PHOTO_LIGHT.length;i++)v42wButton(325+i*131,37,124,37,V42_PHOTO_LIGHT[i][0],()=>v42PhotoLight(i),true,a.light===i);
 v42wButton(1002,37,111,37,'Chụp PNG',v42PhotoCapture,true,true);v42wButton(1122,37,112,37,'Thoát · ESC',v42PhotoToggle);
 v41PFrame(22,661,1236,37);v41PText('← ↑ ↓ → · Dời góc nhìn     0 · Ánh sáng gốc     1–4 · Đổi giờ     H · Ẩn điều khiển     ENTER · Chụp ảnh     ESC · Quay lại',44,680,12,'#e5e0c2','left','sans');
 if(a.note)v41PText(a.note,1238,638,13,'#e4c998','right','sans','bold');
}
function v42PhotoCapture(){
 if(!V42_PHOTO.active||V42_PHOTO.capture)return false;
 const a=V42_PHOTO;if(typeof cv.toBlob!=='function'||typeof URL==='undefined'||!document.body){a.note='Môi trường này không hỗ trợ xuất ảnh PNG.';return false;}
 try{a.capture=true;v42PhotoRender(false);cv.toBlob(b=>{a.capture=false;if(!b){a.note='Không thể kết xuất ảnh.';return;}const url=URL.createObjectURL(b),link=document.createElement('a');link.href=url;link.download='Son_Ha_Anh_'+String(p?.mapId||'Tu_Tien')+'_'+Date.now()+'.png';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);a.note='Đã xuất ảnh PNG.';},'image/png');return true;}
 catch(_){a.capture=false;a.note='Không thể xuất ảnh.';return false;}
}
draw=function(){if(V42_PHOTO.active)return v42PhotoRender(true);return v42PhotoOldDraw();};

// update_L29: lớp 44_photo (trước đây lưu lớp dưới vào v42PhotoOldUpdate). Gọi lớp dưới: update_L28.
function update_L29(dt){
 const a=V42_PHOTO;if(pressed.F9){delete pressed.F9;v42PhotoToggle();}
 if(a.active){if(a.owner!==p||!v42PhotoReady()){v42PhotoToggle();return;}if(pressed.Escape){delete pressed.Escape;v42PhotoToggle();return;}if(pressed.KeyH){delete pressed.KeyH;a.hidden=!a.hidden;}if(pressed.Enter){delete pressed.Enter;v42PhotoCapture();}for(let i=0;i<5;i++)if(pressed['Digit'+i]){delete pressed['Digit'+i];v42PhotoLight(i);}
  a.dx=clamp(a.dx+((keys.ArrowRight?1:0)-(keys.ArrowLeft?1:0))*dt*150,-220,220);a.dy=clamp(a.dy+((keys.ArrowDown?1:0)-(keys.ArrowUp?1:0))*dt*150,-190,190);return;
 }return update_L28(dt);
}
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('keydown',e=>{if(e.code==='F9'&&e.target?.id!=='heroName')e.preventDefault();if(V42_PHOTO.active&&['Digit0','Digit1','Digit2','Digit3','Digit4','Enter','KeyH'].includes(e.code))e.preventDefault();},true);
// The original pointer listener still handles actual buttons; suppress false
// movement/attack on the scenic canvas while photo mode owns the camera.
const v42PhotoOldPointer=v8PointerDown;v8PointerDown=function(){if(!V42_PHOTO.active)return v42PhotoOldPointer.apply(this,arguments);};


// v42_perf.js
// V42 • Performance/stability layer. Append after all world/HUD/combat layers.
// No changes to fixed-step simulation, collision dimensions, combat values,
// spawn tables, loot or save schema. Optional adaptive effects are visual only.
const V42_PERF={
 enabled:true,geometry:true,analyticShadows:true,
 pathSegments:null,townSegments:null,bridgeXs:null,geometryLengths:[],
 roadCalls:0,bridgeCalls:0,shadowCalls:0,shadowCulled:0,shadowPasses:0,releasedBaseTiles:0,releasedSurfaces:0,bitmapReady:0,bitmapPending:0,bitmapFailures:0,
 drawSamples:[],updateSamples:[],frameSamples:[],lastFrame:null,rafFrames:0,
 request:typeof v41Quality==='function'?v41Quality():1,adaptive:false,
 avgFrameMs:0,slowFrames:0,fastFrames:0,lastQualityAt:0,qualityChanges:0,showFps:false,
 fpsSince:null,fpsFrames:0,displayFps:null,
 lastDrawMs:0,lastUpdateMs:0,lastScope:'',inputResets:0,
 progressive:true,warm:{active:false,owner:null,seed:null,inWorld:false,
  x:0,y:0,queue:[],index:0,total:0,startedAt:0,lastChunkMs:0,loaded:0,sessions:0}
};
if(typeof v42PerfShouldLazyFlat!=='undefined')v42PerfShouldLazyFlat=()=>V42_PERF.enabled;
const v42PerfRoadOld=roadDistance,v42PerfBridgeOld=isBridge;
// Precompute segment invariants. Distances are still measured with Math.hypot
// for the winning vector; no spatial quantization or approximate collision map.
function v42PerfSegment(x0,y0,x1,y1){
 const dx=x1-x0,dy=y1-y0,n=dx*dx+dy*dy;return {x0,y0,dx,dy,n};
}
function v42PerfInvalidateGeometry(){
 V42_PERF.pathSegments=ROAD_EDGES.map(([a,b])=>v42PerfSegment(REGIONS[a].x,REGIONS[a].y,REGIONS[b].x,REGIONS[b].y));
 V42_PERF.townSegments=V16_ROADS.map(r=>v42PerfSegment(r[0],r[1],r[2],r[3]));
 V42_PERF.bridgeXs=REGIONS.filter(r=>r.y<2000).map(r=>r.x);
 V42_PERF.geometryLengths=[ROAD_EDGES.length,V16_ROADS.length,REGIONS.length];
 if(typeof v41PerfClearHeight==='function')v41PerfClearHeight();
}
function v42PerfGeometryReady(){
 const a=V42_PERF.geometryLengths;
 if(!V42_PERF.pathSegments||a[0]!==ROAD_EDGES.length||a[1]!==V16_ROADS.length||a[2]!==REGIONS.length)v42PerfInvalidateGeometry();
}
function v42PerfNearestSegment(x,y,segments){
 let best2=Infinity,bx=0,by=0,tie=Infinity;
 for(let i=0;i<segments.length;i++){
  const s=segments[i],px=x-s.x0,py=y-s.y0;
  if(!s.n){return NaN;} // a degenerate segment keeps the legacy behavior
  let t=(px*s.dx+py*s.dy)/s.n;if(t<0)t=0;else if(t>1)t=1;
  const xx=px-s.dx*t,yy=py-s.dy*t,d2=xx*xx+yy*yy;
  // Rare equal-distance ties use hypot as the original implementation does.
  if(d2<best2){tie=(best2-d2)<=1e-9?Math.hypot(bx,by):Infinity;best2=d2;bx=xx;by=yy;}
  else if(d2-best2<=1e-9)tie=Math.min(tie,Math.hypot(xx,yy));
 }
 return Math.min(Math.hypot(bx,by),tie);
}
roadDistance=function(x,y){
 if(!V42_PERF.enabled||!V42_PERF.geometry||!Number.isFinite(x+y)||Math.abs(x)>1e7||Math.abs(y)>1e7)return v42PerfRoadOld(x,y);
 v42PerfGeometryReady();V42_PERF.roadCalls++;
 let d=v42PerfNearestSegment(x,y,V42_PERF.pathSegments);
 if(v16InTown(x,y,80)){const t=v42PerfNearestSegment(x,y,V42_PERF.townSegments);d=Math.min(d,t+17);}
 return Number.isFinite(d)?d:v42PerfRoadOld(x,y);
};
isBridge=function(x){
 if(!V42_PERF.enabled||!V42_PERF.geometry||!Number.isFinite(x))return v42PerfBridgeOld(x);
 v42PerfGeometryReady();V42_PERF.bridgeCalls++;
 for(const a of V42_PERF.bridgeXs)if(Math.abs(x-a)<105)return true;
 return false;
};

// Optional exact hot-loop optimization for V24 painterly terrain. The build
// may route the old pixel blend through this helper (legacy loop remains as
// fallback). Horizontal lerps are reused across the 12 rows of each material
// cell; vertical lerps still round into Float32 just as in V24.
function v42PerfBlendTerrain(pixels,field,tx,w,h,ox,oy,step,cols){
 const ix=new Int32Array(w),fx=new Float64Array(w),ixf=new Float64Array(w),texX=new Int32Array(w),phaseX=new Float64Array(w);
 for(let x=0;x<w;x++){ix[x]=Math.floor(x/step);fx[x]=(x%step)/step;ixf[x]=1-fx[x];texX[x]=v24Mirror((ox+x)*1.38);phaseX[x]=(ox+x)/13;}
 let rowA=new Float64Array(w*9),rowB=new Float64Array(w*9),cached=-2;
 const fillRow=(j,out)=>{
  for(let x=0;x<w;x++){const a=(j*cols+ix[x])*9,b=a+9,d=x*9,u=ixf[x],v=fx[x];for(let k=0;k<9;k++)out[d+k]=field[a+k]*u+field[b+k]*v;}
 };
 const q=new Float32Array(9),t0=tx[0],t1=tx[1],t2=tx[2],t3=tx[3];
 for(let y=0;y<h;y++){
  const j=Math.floor(y/step),fy=(y%step)/step,ifY=1-fy,ty=v24Mirror((oy*HD.tilt+y-HD.lift)*1.38),texY=ty*384;
  if(j!==cached){if(j===cached+1){const tmp=rowA;rowA=rowB;rowB=tmp;fillRow(j+1,rowB);}else{fillRow(j,rowA);fillRow(j+1,rowB);}cached=j;}
  const waveY=Math.sin((oy*HD.tilt+y)/51)*.23;
  for(let x=0;x<w;x++){
   const pi=(y*w+x)*4;if(!pixels[pi+3])continue;
   const qi=x*9;for(let k=0;k<9;k++)q[k]=rowA[qi+k]*ifY+rowB[qi+k]*fy;
   const ti=(texY+texX[x])*4,lum=(pixels[pi]+pixels[pi+1]+pixels[pi+2])/3,mat=1-q[0]-q[1],water=q[4],rock=(t2[ti]+t2[ti+1]+t2[ti+2])/3-104;
   const shade=clamp(.89+lum/850,.95,1.09),farm=q[5]>.2,row=farm?Math.sin(phaseX[x]+waveY):0;
   for(let k=0;k<3;k++){
    const grass=t0[ti+k]*(1-q[2])+t3[ti+k]*q[2],earth=t1[ti+k],stone=t2[ti+k];let source=grass*mat+earth*q[0]+stone*q[1];
    const original=pixels[pi+k],natural=source*.87+original*.13,colored=q[6+k]+rock*.43+q[0]*22+(earth-155)*q[0]*.20;
    let value=natural*q[3]+colored*(1-q[3]);if(farm)value=value*(1-q[5]*.10)+row*7*q[5];
    value*=shade;pixels[pi+k]=clamp(value*(1-water)+original*water,0,255);
   }
  }
 }
}
// V24+ stores the final textured terrain canvas separately from the raw HD
// projection. Once a completed final tile has been cached, discard the now
// redundant base tile (the old fallback can always regenerate it).
const v42PerfGroundOld=hdGroundChunk;
function v42PerfReleaseCanvas(out){if(!V42_PERF.enabled||!out?.c||out.c.width<=1&&out.c.height<=1)return;out.v42Disposed=true;if(out.bitmap){out.bitmap.close?.();out.bitmap=null;}out.c.width=1;out.c.height=1;V42_PERF.releasedSurfaces++;}
if(typeof v42PerfReleaseEvicted!=='undefined')v42PerfReleaseEvicted=v42PerfReleaseCanvas;
// Texture/seed invalidation always discards final raster tiles. Explicitly
// shrink these obsolete backing surfaces; leave ordinary LRU touches alone.
const v42PerfClearTiles=V24.tiles.clear.bind(V24.tiles);
V24.tiles.clear=function(){if(V42_PERF.enabled)for(const tile of this.values())v42PerfReleaseCanvas(tile);return v42PerfClearTiles();};
// Modern browsers can use immutable ImageBitmap terrain sources rather than
// resnapshot a mutable Canvas during every draw. Generate once, async, after
// every static art overlay; fall back immediately if API/support fails.
function v42PerfPrepareBitmap(out){
 if(!V42_PERF.enabled||typeof createImageBitmap!=='function'||out.bitmap||out.v42BitmapState||out.v42Disposed)return;
 out.v42BitmapState='pending';V42_PERF.bitmapPending++;
 try{createImageBitmap(out.c,{colorSpaceConversion:'none'}).then(b=>{
   V42_PERF.bitmapPending--;if(out.v42Disposed){b.close?.();return;}
   out.bitmap=b;out.v42BitmapState='ready';V42_PERF.bitmapReady++;
 },()=>{V42_PERF.bitmapPending--;V42_PERF.bitmapFailures++;out.v42BitmapState='failed';});}
 catch(_){V42_PERF.bitmapPending--;V42_PERF.bitmapFailures++;out.v42BitmapState='failed';}
}
hdGroundChunk=function(cx,cy){
 const out=v42PerfGroundOld(cx,cy),id=cx+':'+cy,k=seed+':'+id;
 if(V42_PERF.enabled&&V24.seed===seed&&V24.tiles.get(id)===out){
  const raw=HD.terrain.get(k);if(raw&&raw!==out){HD.terrain.delete(k);v42PerfReleaseCanvas(raw);V42_PERF.releasedBaseTiles++;}
  v42PerfPrepareBitmap(out);
 }
 return out;
};

// Raster sprite resampling was the largest measured V41 warm-render cost.
// Analytic ellipse uses identical geometry/stops and a continuous edge, so
// it is both sharper and substantially cheaper in the native test renderer.
const V42_SHADOW_STOPS=[[0,'#162526e6'],[.26,'#172828b3'],[.58,'#1c313267'],[.85,'#21373820'],[1,'#24393900']];
const v42PerfShadowOld=hdShadow;
function v42PerfSoftEllipse(x,y,rx,ry,alpha){
 if(rx<=0||ry<=0||alpha<=0)return;
 g.save();g.globalAlpha=alpha;g.translate(x,y);g.scale(rx,ry);
 const gr=g.createRadialGradient(0,0,0,0,0,1);
 for(const [t,col] of V42_SHADOW_STOPS)gr.addColorStop(t,col);
 g.fillStyle=gr;g.fillRect(-1,-1,2,2);g.restore();V42_PERF.shadowPasses++;
}
hdShadow=function(x,y,w,h,sun){
 if(!V42_PERF.enabled||!V42_PERF.analyticShadows||!v11DrawingWorld||!Number.isFinite(x+y+w+h)||w<=0||!sun)return v42PerfShadowOld(x,y,w,h,sun);
 V42_PERF.shadowCalls++;
 const night=1-sun.day,s=clamp(h/Math.max(1,w),.4,3),dx=sun.dx*(.3+sun.len*1.1),l=1+Math.min(1.45,s*.35)*sun.len;
 const q=typeof V41E!=='undefined'?V41E.quality:1,dir=(q>0&&w>28)||w>50;
 const sx=x+dx*w*.45,sy=y+w*.14+sun.len*Math.min(h,w)*.12,rx=w*l,ry=w*.39;
 // Exact union of the two unrotated ellipses, plus antialias allowance.
 const minX=Math.min(x-w*.81,dir?sx-rx:Infinity)-2,maxX=Math.max(x+w*.81,dir?sx+rx:-Infinity)+2;
 const minY=Math.min(y-w*.22,dir?sy-ry:Infinity)-2,maxY=Math.max(y+w*.22,dir?sy+ry:-Infinity)+2;
 const vw=W/V11_ZOOM,vh=H/V11_ZOOM;
 if(maxX<0||minX>vw||maxY<0||minY>vh){V42_PERF.shadowCulled++;if(typeof V41_PERF!=='undefined')V41_PERF.shadowCulled++;return;}
 if(typeof V41_PERF!=='undefined')V41_PERF.shadowDrawn++;
 if(dir)v42PerfSoftEllipse(sx,sy,rx,ry,.33+sun.day*.23);
 v42PerfSoftEllipse(x,y,w*.81,w*.22,.62-night*.08);
};

// Quality adaptation is opt-in and preserves the user's selected ceiling.
// Effective quality can drop one level after sustained slow RAF cadence;
// it recovers only after a longer fast window to prevent visual oscillation.
function v42PerfActual(){return typeof v41Quality==='function'?v41Quality():V42_PERF.request;}
function v42PerfTransientQuality(q){
 q=clamp(Math.round(q),0,2);
 if(typeof v41eSetQuality==='function')v41eSetQuality(q);
 if(typeof V41_COMBAT!=='undefined'){V41_COMBAT.maxParticles=[46,78,116][q];V41_COMBAT.maxEvents=[16,22,26][q];}
 // Future V42 renderers may optionally react; no dependency on them.
 if(typeof v42OnEffectiveQuality==='function')v42OnEffectiveQuality(q);
 return q;
}
function v42PerfResetCadence(){V42_PERF.avgFrameMs=0;V42_PERF.slowFrames=0;V42_PERF.fastFrames=0;V42_PERF.lastFrame=null;}
function v42PerfSetAdaptive(on,silent=false){
 V42_PERF.adaptive=!!on;v42PerfResetCadence();
 V42_PERF.lastQualityAt=typeof performance!=='undefined'?performance.now():0;
 if(!V42_PERF.adaptive)v42PerfTransientQuality(V42_PERF.request);
 try{localStorage.setItem('v42-adaptive',V42_PERF.adaptive?'1':'0');}catch(_){}
 if(!silent&&typeof message==='function'&&mode==='play')message('Đồ họa tự động · '+(V42_PERF.adaptive?'BẬT':'TẮT'));
 return V42_PERF.adaptive;
}
try{V42_PERF.adaptive=localStorage.getItem('v42-adaptive')==='1';}catch(_){}
if(typeof v41ApplyQuality==='function'){
 const v42PerfApplyOld=v41ApplyQuality;
 v41ApplyQuality=function(q){q=clamp(Math.round(Number(q)||0),0,2);V42_PERF.request=q;v42PerfResetCadence();return v42PerfApplyOld(q);};
}
if(typeof v41QualityToggle==='function'){
 v41QualityToggle=function(){const q=v41ApplyQuality((V42_PERF.request+1)%3);if(typeof message==='function')message('Đồ họa · '+V41_QUALITY_NAMES[q]);return q;};
}
function v42PerfObserveCadence(ms,now){
 if(!V42_PERF.adaptive||!Number.isFinite(ms)||ms<4||ms>250)return false;
 const a=V42_PERF;a.avgFrameMs=a.avgFrameMs?a.avgFrameMs*.92+ms*.08:ms;
 if(a.avgFrameMs>23){a.slowFrames++;a.fastFrames=0;}else if(a.avgFrameMs<18){a.fastFrames++;a.slowFrames=Math.max(0,a.slowFrames-2);}else{a.slowFrames=Math.max(0,a.slowFrames-1);a.fastFrames=0;}
 const q=v42PerfActual();
 if(a.slowFrames>=45&&q>0&&now-a.lastQualityAt>=4000){
  v42PerfTransientQuality(q-1);a.lastQualityAt=now;a.slowFrames=a.fastFrames=0;a.qualityChanges++;return true;
 }
 if(a.fastFrames>=240&&q<a.request&&now-a.lastQualityAt>=8000){
  v42PerfTransientQuality(q+1);a.lastQualityAt=now;a.slowFrames=a.fastFrames=0;a.qualityChanges++;return true;
 }
 return false;
}
function v42PerfQualityStatus(){return {requested:V42_PERF.request,actual:v42PerfActual(),adaptive:V42_PERF.adaptive,avgFrameMs:V42_PERF.avgFrameMs,qualityChanges:V42_PERF.qualityChanges};}
function v42PerfSample(a,v){if(!Number.isFinite(v)||v<0)return;a.push(v);if(a.length>240)a.shift();}
function v42PerfStats(a){if(!a.length)return null;const b=a.slice().sort((x,y)=>x-y);return {count:b.length,p50:b[Math.floor(b.length*.5)],p95:b[Math.ceil(b.length*.95)-1],max:b.at(-1),mean:b.reduce((x,y)=>x+y,0)/b.length};}
function v42PerfCacheStats(){return {owChunks:owCache.size,hdGround:HD.terrain.size,v24Ground:V24.tiles.size,hdProps:HD.props.size,hdHouses:HD.houses.size,atlas:owAtlasCache.size,legacyFlatRasters:typeof v42PerfFlatRasters==='number'?v42PerfFlatRasters:null,releasedBaseTiles:V42_PERF.releasedBaseTiles,releasedSurfaces:V42_PERF.releasedSurfaces,bitmapReady:V42_PERF.bitmapReady,bitmapPending:V42_PERF.bitmapPending,bitmapFailures:V42_PERF.bitmapFailures,heightEntries:typeof V41_PERF!=='undefined'?V41_PERF.heightCount:null,rooms:typeof V42E!=='undefined'?V42E.roomCache.size:V36.roomCache.size};}
function v42PerfDiagnostics(){const w=V42_PERF.warm;return {quality:v42PerfQualityStatus(),render:v42PerfStats(V42_PERF.drawSamples),update:v42PerfStats(V42_PERF.updateSamples),raf:v42PerfStats(V42_PERF.frameSamples),roadCalls:V42_PERF.roadCalls,bridgeCalls:V42_PERF.bridgeCalls,shadowCalls:V42_PERF.shadowCalls,shadowCulled:V42_PERF.shadowCulled,shadowPasses:V42_PERF.shadowPasses,inputResets:V42_PERF.inputResets,caches:v42PerfCacheStats(),warmup:{active:w.active,index:w.index,total:w.total,loaded:w.loaded,sessions:w.sessions,lastChunkMs:w.lastChunkMs}};}

// Lost focus / canceled pointer must not queue attacks, stuck movement or dash.
function v42PerfReleaseInput(){
 for(const k in keys)keys[k]=false;
 for(const k in pressed)delete pressed[k];
 mouse.left=mouse.right=mouse.fire=mouse.cast=false;mouse.inside=false;
 if(typeof V35!=='undefined'&&V35.drag)V35.drag=null;
 V42_PERF.inputResets++;v42PerfResetCadence();
}
addEventListener('blur',v42PerfReleaseInput);
addEventListener('pointercancel',v42PerfReleaseInput);
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('visibilitychange',()=>{if(document.hidden)v42PerfReleaseInput();});
const v42PerfPointerOld=pointer;
function v42PerfValidPointer(e){const r=cv.getBoundingClientRect();return r.width>0&&r.height>0&&Number.isFinite(e.clientX+e.clientY+r.width+r.height);}
pointer=function(e){
 if(!v42PerfValidPointer(e)){mouse.x=mouse.y=-1e6;mouse.inside=false;return;}
 return v42PerfPointerOld(e);
};
// The original pointermove was registered with a direct function reference,
// so a capture guard is needed in addition to wrapping the global function.
// Suppress invalid viewport events before the old HUD-drag or attack handlers.
function v42PerfPointerCapture(e){if(!v42PerfValidPointer(e)||V42_PERF.warm.active){mouse.x=mouse.y=-1e6;mouse.inside=false;e.stopImmediatePropagation?.();e.preventDefault?.();}}
cv.addEventListener('pointermove',v42PerfPointerCapture,true);
cv.addEventListener('pointerdown',v42PerfPointerCapture,true);
const v42PerfPointerDownOld=v8PointerDown;
v8PointerDown=function(){if(!mouse.inside||V42_PERF.warm.active)return;return v42PerfPointerDownOld.apply(this,arguments);};

// update_L30: lớp 44_photo (trước đây lưu lớp dưới vào v42PerfUpdateOld). Gọi lớp dưới: update_L29.
function update_L30(dt){
 if(pressed.F8){delete pressed.F8;v42PerfSetAdaptive(!V42_PERF.adaptive);}
 const t=performance.now();try{return update_L29(dt);}finally{V42_PERF.lastUpdateMs=performance.now()-t;v42PerfSample(V42_PERF.updateSamples,V42_PERF.lastUpdateMs);}
}
const v42PerfDrawOld=draw;
function v46ResetFps(){
 const a=V42_PERF;
 a.fpsSince=null;
 a.fpsFrames=0;
 a.displayFps=null;
}
function v46SampleFps(now){
 const a=V42_PERF;
 if(!a.showFps||document.hidden)return;
 if(a.fpsSince===null){a.fpsSince=now;return;}
 const span=now-a.fpsSince;
 if(span<=0)return;
 a.fpsFrames++;
 if(span>=400){
  a.displayFps=Math.round(a.fpsFrames*1000/span);
  a.fpsSince=now;
  a.fpsFrames=0;
 }
}
document.addEventListener('keydown',e=>{
 if(e.code!=='F7'||e.target?.id==='heroName')return;
 e.preventDefault();
 e.stopImmediatePropagation();
 if(e.repeat)return;
 V42_PERF.showFps=!V42_PERF.showFps;
 v46ResetFps();
},true);
document.addEventListener('visibilitychange',v46ResetFps);
addEventListener('blur',v46ResetFps);
addEventListener('focus',v46ResetFps);
function v42PerfDrawFps(loading=false){
 const a=V42_PERF;
 const label='FPS '+(a.displayFps??'…')+(loading?' · Đang chuẩn bị bản đồ':
  ' · vẽ '+a.lastDrawMs.toFixed(1)+' ms · cập nhật '+a.lastUpdateMs.toFixed(1)+' ms');
 g.save();
 g.font='bold 11px V45Sans,"Segoe UI",Arial,sans-serif';
 g.textAlign='center';
 g.textBaseline='middle';
 const w=Math.ceil(g.measureText(label).width)+16;
 g.fillStyle='#06110ce8';
 g.fillRect((W-w)/2,H-17,w,16);
 g.fillStyle='#adf0bc';
 g.fillText(label,W/2,H-9);
 g.restore();
}
draw=function(){
 const t=performance.now();let r;try{r=v42PerfDrawOld.apply(this,arguments);}finally{V42_PERF.lastDrawMs=performance.now()-t;v42PerfSample(V42_PERF.drawSamples,V42_PERF.lastDrawMs);}
 if(V42_PERF.showFps)v42PerfDrawFps();
 return r;
};
// Progressive terrain warming. The old first render synchronously generated
// an entire viewport's 25–30 expensive ground chunks before drawing anything.
// RAF-only prewarming keeps presentation responsive, processing one/two chunks
// per frame with explicit progress and no simulation or queued input pulses.
function v42PerfMissingChunks(){
 const v=hdView(),vw=W/V11_ZOOM,vh=H/V11_ZOOM,minY=(v.y-8)/HD.tilt,maxY=(v.y+vh+HD.lift+20)/HD.tilt,minX=v.x,maxX=v.x+vw;
 const w=Math.ceil(OW.w/OW.chunk),h=Math.ceil(OW.h/OW.chunk),ground=[],props=[],needed=new Set();
 for(let cy=Math.max(0,Math.floor(minY/OW.chunk));cy<=Math.min(h-1,Math.floor(maxY/OW.chunk));cy++)for(let cx=Math.max(0,Math.floor(minX/OW.chunk));cx<=Math.min(w-1,Math.floor(maxX/OW.chunk));cx++){
  const k=cx+':'+cy;if(V24.seed!==seed||!V24.tiles.has(k)){ground.push({cx,cy,ground:true});needed.add(k);}
 }
 for(let cy=Math.max(0,Math.floor((minY-180)/OW.chunk));cy<=Math.min(h-1,Math.floor((maxY+180)/OW.chunk));cy++)for(let cx=Math.max(0,Math.floor((minX-140)/OW.chunk));cx<=Math.min(w-1,Math.floor((maxX+140)/OW.chunk));cx++){
  const k=cx+':'+cy;if(!needed.has(k)&&!owCache.has(seed+':'+k))props.push({cx,cy,ground:false});
 }
 const d=o=>Math.abs((o.cx+.5)*OW.chunk-p.x)+Math.abs((o.cy+.5)*OW.chunk-p.y);ground.sort((a,b)=>d(a)-d(b));props.sort((a,b)=>d(a)-d(b));
 return {ground:ground.length,queue:ground.concat(props),x:v.x,y:v.y};
}
function v42PerfLoadingDraw(now){
 const w=V42_PERF.warm,f=w.total?clamp(w.index/w.total,0,1):0;
 buttons=[];g.save();g.setTransform(RS.k,0,0,RS.k,0,0); /* T28: giữ hệ số HiDPI */g.fillStyle='#0a181e';g.fillRect(0,0,W,H);
 const halo=g.createRadialGradient(W*.5,H*.45,40,W*.5,H*.45,540);halo.addColorStop(0,'#1b3f3d');halo.addColorStop(1,'#0a181e');g.fillStyle=halo;g.fillRect(0,0,W,H);
 const cx=W/2,cy=H*.38;g.strokeStyle='#d9c18b55';g.lineWidth=1.5;
 for(const r of [51,71]){g.beginPath();g.ellipse(cx,cy,r,r,0,0,TAU);g.stroke();}
 g.save();g.translate(cx,cy);g.rotate(now*.00065);for(let i=0;i<8;i++){const a=i*TAU/8;g.beginPath();g.moveTo(Math.cos(a)*51,Math.sin(a)*51);g.lineTo(Math.cos(a)*65,Math.sin(a)*65);g.stroke();}g.restore();
 if(typeof v41PText==='function'){v41PText('THIÊN MÔN ĐANG MỞ',cx,cy+108,29,'#f4da9c','center','serif','bold');v41PText('Đang chuẩn bị địa hình và linh khí',cx,cy+155,15,'#bfd8cb','center','sans');}
 else{text('THIÊN MÔN ĐANG MỞ',cx,cy+108,28,'#f4da9c','center','bold');text('Đang chuẩn bị địa hình',cx,cy+155,15,'#bfd8cb','center');}
 const bx=cx-250,by=cy+184,bw=500,bh=12;g.fillStyle='#09171b';g.fillRect(bx,by,bw,bh);g.strokeStyle='#967c4b';g.strokeRect(bx-.5,by-.5,bw+1,bh+1);
 g.fillStyle='#a2d1b5';g.fillRect(bx,by,bw*f,bh);
 text(Math.floor(f*100)+'%  ·  '+w.index+'/'+w.total+' khu vực',cx,by+33,13,'#d8c595','center','bold');g.restore();
}
function v42PerfWarmupTick(now){
 const w=V42_PERF.warm,world=mode==='play'&&p?.worldMode&&!v36Inside()&&!modal;
 if(!V42_PERF.enabled||!V42_PERF.progressive||!world||document.hidden){w.active=false;w.inWorld=false;w.queue=[];return false;}
 if(!w.active){
  const v=hdView(),entered=w.owner!==p||w.seed!==seed||!w.inWorld,jump=Math.hypot(v.x-w.x,v.y-w.y)>OW.chunk*2.1;
  w.owner=p;w.seed=seed;w.inWorld=true;
  if(!entered&&!jump){w.x=v.x;w.y=v.y;return false;}
  const r=v42PerfMissingChunks();w.x=r.x;w.y=r.y;if(r.ground<8)return false;
  w.active=true;w.queue=r.queue;w.total=r.queue.length;w.index=0;w.startedAt=performance.now();w.sessions++;
  v42PerfResetCadence();
  v42PerfLoadingDraw(now);return true; // display zero-progress screen before any costly raster work
 }
 // Wait briefly for asynchronously decoded painterly textures rather than
 // warming obsolete fallback materials that will be invalidated on load.
 const textureReady=typeof V42_ENV_ASSETS!=='undefined'?[0,1,2,3].every(i=>imgs['v42tile'+i]?.ready):(typeof V38_ASSETS==='undefined'||[0,1,2,3].every(i=>imgs['v38tile'+i]?.ready));
 if(!textureReady&&performance.now()-w.startedAt<4000){v42PerfLoadingDraw(now);return true;}
 const at=performance.now();let count=0;
 // Use the existing render-only exact height cache during prewarm, too.
 // The depth guard restores gameplay's original height-evaluation semantics.
 const cache=typeof V41_PERF!=='undefined'?V41_PERF:null;if(cache)cache.depth++;
 try{while(w.index<w.total&&count<2&&(count===0||performance.now()-at<9)){
   const t=w.queue[w.index],a=performance.now();
   if(t.ground)hdGroundChunk(t.cx,t.cy);owChunk(t.cx,t.cy);
   w.lastChunkMs=performance.now()-a;w.index++;w.loaded++;count++;
 }}finally{if(cache)cache.depth--;}
 v42PerfLoadingDraw(now);
 if(w.index>=w.total){w.active=false;w.queue=[];v42PerfReleaseInput();}
 return true;
}
// Wrap RAF itself without replacing the fixed timestep or its six-step cap.
// Ignore menu, overlays and hidden tabs for adaptive decisions.
if(typeof frame==='function'){
 const v42PerfFrameOld=frame;
 frame=function(now){
  const a=V42_PERF,dt=a.lastFrame===null?0:now-a.lastFrame;a.lastFrame=now;a.rafFrames++;
  v46SampleFps(now);
  if(v42PerfWarmupTick(now)){
   if(a.showFps)v42PerfDrawFps(true);
   // No accumulated simulation time for loading; restart at the normal
   // fixed-step cadence when the last chunk has been prepared.
   last=now;v8Accumulator=0;requestAnimationFrame(frame);return;
  }
  if(dt>=4&&dt<=250){v42PerfSample(a.frameSamples,dt);if(mode==='play'&&!modal&&!document.hidden)v42PerfObserveCadence(dt,now);}
  return v42PerfFrameOld(now);
 };
}
if(typeof window!=='undefined')window.__VDTT_PERF=()=>v42PerfDiagnostics();



