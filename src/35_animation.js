'use strict';
// v42_animation.js
// V42 · Linh Thể đại thành. Newly illustrated directional atlases and action
// poses, distance-based motion, grounded transitions, role-specific NPC movement.
// Rendering only: all movement, AI, hit timing, guard, dash and death logic stay
// in the existing systems. Load v42_actor_assets.js directly before this file.
const V42A={owner:null,scope:'',lastPhase:0,lastStep:0,contacts:[],heroMove:false,deadAt:null,npcActivity:new Map(),stats:{run:0,idle:0,action:0,verticalAction:0,verticalPainted:0,npc:0,npcWalk:0}};
for(const [key,url] of Object.entries(V42_ACTOR_ASSETS)){
 const img=new Image();imgs[key]={img,ready:false};img.onload=()=>{imgs[key].ready=true;};img.src=url;
}
const V42A_IDLE=[0,1,2,1,0,3,4,3],V42A_SIDE=new Set([0,1,3,4,5,7]);
const v42aReady=key=>!!(imgs[key]?.ready&&imgs[key]?.img?.naturalWidth);
const v42a01=x=>Math.max(0,Math.min(1,x));
const v42aCos=q=>.5-.5*Math.cos(Math.PI*v42a01(q));
const v42aSize=world=>124*(world&&!v36Inside()?.78:1);
const v42aFrame=(phase)=>((Math.floor(phase)%12)+12)%12;
const v42aContactFrame=phase=>(Math.round(phase/6)*6)%12;
const v42aSheetKey=(cls,dir)=>cls===0?'v25run'+V25_DIR[dir]:V25_DIR[dir]==='E'?'v25run'+(cls===1?'B':'M'):'v42run'+(cls===1?'B':'M')+V25_DIR[dir];
const v42aActionKey=(cls,dir)=>'v42action'+cls+(dir===2?'F':dir===6?'B':'');
const v42aPreviousRunKey=v25RunKey;
v25RunKey=function(cls,dir){const k=v42aSheetKey(cls,dir);return v42aReady(k)?k:v42aPreviousRunKey(cls,dir);};

// Draw anchored idle (no vertical bob in the contact foot). The shared atlas
// baseline is (128,224) for every stance. Breath originates at the ground.
const v42aPreviousIdle=v25Idle;
v25Idle=function(cls,dir,x,y,size,alpha=1,breath=0){
 const key='v42idle'+cls;if(!v42aReady(key))return v42aPreviousIdle(cls,dir,x,y,size,alpha,breath);
 const scale=1+Math.max(-.025,Math.min(.025,breath/Math.max(1,size)));
 return v25Cell(key,V42A_IDLE[dir]??2,3,2,x,y,size,V9_FLIP[dir]??1,alpha,0,1,scale,0);
};
const v42aPreviousRigCell=v41aRigCell;
v41aRigCell=function(cls,dir,x,y,size,m,breath=0){
 const key='v42idle'+cls;if(!v42aReady(key))return v42aPreviousRigCell(cls,dir,x,y,size,m,breath);
 const im=imgs[key].img,i=V42A_IDLE[dir]??2,sw=im.naturalWidth/3,sh=im.naturalHeight/2;
 v41aRig(im,i%3*sw,Math.floor(i/3)*sh,sw,sh,x,y,size,size,.875,V9_FLIP[dir]??1,m.phase,m.blend,breath,m.lean);V42A.stats.idle++;return true;
};
const v42aPreviousHeroRun=v41aHeroRun;
v41aHeroRun=function(cls,dir,x,y,size,m){
 const key=v42aSheetKey(cls,dir);if(!v42aReady(key))return v42aPreviousHeroRun(cls,dir,x,y,size,m);
 const phase=m.phase,effort=Math.max(0,Math.min(1,m.blend)),wave=v41aWave(phase);
 // A player easing off a direction lands on the nearest contact pose rather
 // than freezing in mid-air. Never reset the underlying travel phase on turns.
 const landing=effort<.39&&m.speed<38,frame=landing?v42aContactFrame(phase):v42aFrame(phase);
 const stretch=(1-Math.abs(wave))*.008*effort;
 const ok=v25Cell(key,frame,4,3,x,y,size,V9_FLIP[dir]??1,1,0,1+stretch,1-stretch*.55,m.lean*(V9_FLIP[dir]??1));
 if(ok)V42A.stats.run++;return ok;
};

// Distinct actions per class. Atlas pose keys:
// 0 ready, 1 light wind-up, 2 light hit, 3 recovery, 4 heavy charge,
// 5 heavy release, 6 spell charge, 7 spell release, 8 dash crouch,
// 9 dash flight, 10 stagger, 11 fall/kneel. Switching keys is tied to
// V26's existing visual clock and impact moment, never to a render count.
function v42aAction(a){
 const q=v42a01(a.vis/Math.max(.001,a.dur)),i=v42a01(a.impact/Math.max(.001,a.dur)),wind=q<i,u=wind?q/Math.max(.001,i):(q-i)/Math.max(.001,1-i);
 const cast=a.kind==='skill',stage=a.stage||1,heavy=stage===3||(!cast&&a.d?.kind==='heavy'),k53=wind?v42aCos(u):0,kHit=wind?0:Math.sin(Math.PI*Math.min(1,u*1.25)),rec=wind?0:v42aCos((u-.40)/.60);
 const power=cast?(a.cls===2?.63:.80):.72+stage*.10;
 let index=0;if(a.d?.kind==='guard')index=6;
 else if(cast)index=wind?(u<.14?0:6):(u<.50?7:u<.92?3:0);
 else if(heavy)index=wind?(u<.16?0:4):(u<.62?5:u<.94?3:0);
 else index=wind?(u<.23?0:1):(u<.54?2:u<.94?3:0);
 // Impact remains visible even during the hit-stop. No teleporting bodies.
 const pull=(cast?2:3.2+stage*.35)*k53,reach=(cast?4:7+stage)*kHit*power;
 return {index,q,u,wind,stage,cast,heavy,step:reach-pull,lift:heavy&&!wind?2.8*kHit:0,sx:1+.012*k53+.025*kHit*power,sy:1-.035*k53+.020*kHit-.010*rec,tilt:-.035*k53+.040*kHit};
}
function v42aChargeFX(x,y,a,world,size){
 if(a.kind==='skill'&&!a.hit){g.save();g.translate(x,y);g.scale(size/124,size/124);g.translate(-x,-y);v26Charge(x,y,a,world);g.restore();}
}
function v42aGuard(x,y,size){
 if(p.v10Guard>0){g.save();g.globalAlpha*=.33;g.strokeStyle='#f1d1a0';g.lineWidth=1.3;g.beginPath();g.ellipse(x,y-size*.23,size*.193,size*.323,0,0,TAU);g.stroke();g.restore();}
}
function v42aDrawAction(a,x,y,world,cls,dir,size){
 const r=v42aAction(a),ang=a.a??0,projection=world&&!v36Inside()?HD.tilt:1,dx=Math.cos(ang),dy=Math.sin(ang)*projection,hitDir=v9Dir(dx,Math.sin(ang),dir,world&&!v36Inside(),0),flip=dx<0?-1:1;
 // Distinct front and rear action artwork for north/south, and lateral action
 // art for the four diagonals and E/W. If an atlas is still decoding,
 // articulate the direction-correct idle; never show an unrelated costume.
 const key=v42aActionKey(cls,hitDir),side=V42A_SIDE.has(hitDir);
 if(v42aReady(key)){
  const facing=side?flip:1,ok=v25Cell(key,r.index,4,3,x+dx*r.step,y+dy*r.step,size,facing,1,r.lift,r.sx,r.sy,r.tilt*facing*(side?1:.38));
  if(!ok)return false;if(side)V42A.stats.action++;else{V42A.stats.verticalAction++;V42A.stats.verticalPainted++;}
 }else {
  const idle='v42idle'+cls;if(!v42aReady(idle))return false;
  const phase=r.wind?r.u*3:r.u*6+6,lean=r.wind?-.018:.023,blend=r.wind?.17:.30;
  g.save();g.translate(x+dx*r.step,y+dy*r.step-r.lift);g.scale(r.sx,r.sy);g.translate(-x,-y);
  v41aRigCell(cls,hitDir,x,y,size,{phase,blend,lean},r.wind?-.018:.013*Math.sin(Math.PI*r.u));g.restore();if(!side)V42A.stats.verticalAction++;
 }
 v42aChargeFX(x,y,a,world,size);v42aGuard(x,y,size);return true;
}
function v42aDrawDash(x,y,world,cls,size,m){
 const d=V26.dash;if(!d)return false;const dir=d.dir??V8.dir??2,q=v42a01(1-p.dashT/V26_DASH_DUR),key=v42aActionKey(cls,dir),phase=V8.phase+q*10,flip=V9_FLIP[dir],flight=Math.sin(Math.PI*q),lift=21*flight;
 v41aGroundShadow(x,y,18+q*4,5,1-flight*.34);
 // Actual dash poses for four cardinal headings; preserve dedicated
 // directional run art in diagonals. Account for the lift already painted.
 if(dir%2===0&&v42aReady(key)){const index=q<.18?8:q<.83?9:3,painted=(224-(V42_ACTOR_META[key]?.frames[index]?.y1??224))*size/256;return v25Cell(key,index,4,3,x,y,size,flip,1,Math.max(0,lift-painted),1+.04*flight,1-.03*flight,.022*flip*flight);}
 return v25Cell(v25RunKey(cls,dir),v42aFrame(phase),4,3,x,y,size,flip,1,lift,1+.04*flight,1-.03*flight,.022*flip*flight);
}
function v42aDrawHurt(x,y,world,cls,dir,size){
 const h=V26.hurt;if(!h)return false;const key=v42aActionKey(cls,dir),q=v42a01((V26.clock-h.at)/Math.max(.001,h.dur)),f=Math.sin(Math.PI*q),ang=h.a??0,proj=world&&!v36Inside()?HD.tilt:1;
 const xx=x+Math.cos(ang)*7*f,yy=y+Math.sin(ang)*4*f*proj;
 if(v42aReady(key)&&q<.84)return v25Cell(key,10,4,3,xx,yy,size,V9_FLIP[dir],.88+.12*q,1.5*f,1+.04*f,1-.045*f,.06*f*V9_FLIP[dir]);
 if(v42aReady('v42idle'+cls)){g.save();g.translate(xx,yy);g.scale(1+.03*f,1-.048*f);g.translate(-x,-y);const r=v25Idle(cls,dir,x,y,size,.88+.12*q);g.restore();return r;}return false;
}
const v42aPreviousHero=v9HeroBody;
v9HeroBody=function(x,y,world){
 if(!p)return v42aPreviousHero(x,y,world);v41aEnsure();const cls=p.cls??0,dir=V8.dir??V41A.hero.dir??2,size=v42aSize(world),m=V41A.hero,a=V26.action;
 // Arena defeat is represented by a painted kneeling silhouette. Overworld
 // revival is instantaneous by design; never display the old corpse in town.
 if(mode==='dead'&&v42aReady(v42aActionKey(cls,dir))){const ok=v25Cell(v42aActionKey(cls,dir),11,4,3,x,y,size,V9_FLIP[dir],1,-2);if(ok)return;}
 if(p.dashT>0&&v42aDrawDash(x,y,world,cls,size,m))return;
 if(p.hurt>0&&v42aDrawHurt(x,y,world,cls,dir,size))return;
 if(a&&p.hurt<=0&&v42aDrawAction(a,x,y,world,cls,dir,size))return;
 if(!p.attackT&&!p.castT&&!p.dashT&&!p.hurt&&!a){
  const moving=m.blend>.31||(animation.name==='run'&&m.speed>5),land=V26.dash?.land?Math.max(0,1-(V26.clock-V26.dash.land)/.16):0;
  const breath=.005*Math.sin(V41A.clock*2.35+cls*.7)-.019*Math.sin(Math.PI*land);
  const ok=moving?v41aHeroRun(cls,dir,x,y,size,m):v41aRigCell(cls,dir,x,y,size,{...m,blend:Math.min(.31,m.blend)},breath);
  if(ok){v42aGuard(x,y,size);return;}
 }
 return v42aPreviousHero(x,y,world);
};

// Role-specific gesture envelopes for actual NPCs. Existing portrait art is
// retained for named characters. These layered deformations are procedural,
// not additional hand-painted animation frames. The pivot is the foot point;
// painted roofs, pathing and collision never depend on this transform.
const v42aNPC=v9NPCDraw;
function v42aNPCGesture(d,n,id,now){
 let a=V42A.npcActivity.get(id);
 if(!a){a={at:now,talk:0,walk:0,greet:0,phase:0};V42A.npcActivity.set(id,a);}
 const dt=Math.min(.10,Math.max(0,now-a.at)),talk=modal?.npc===d.id,walking=!!n.walking,near=Math.hypot(n.x-(p?.x??n.x),n.y-(p?.y??n.y))<95;
 a.talk=v41aEase(a.talk,talk?1:0,12,dt);a.walk=v41aEase(a.walk,walking?1:0,12,dt);a.greet=v41aEase(a.greet,near&&!walking&&!talk?1:0,7,dt);a.at=now;a.phase+=dt*(talk?5:2);
 const role=v15NPCIndex(d),f=1-a.walk,heavy=[0,4,6,13].includes(role),phase=a.phase+(role*1.37)%TAU;
 const nod=Math.sin(phase)*a.talk,resp=Math.sin(now*(heavy?1.48:2.05)+role*.54),welcome=Math.sin(phase*.65)*a.greet;
 return{sx:1+.008*f*resp+.006*a.talk,sy:1+.004*f*resp-.012*a.talk*(.50+.5*nod),tilt:f*(.005*resp+.009*welcome+.013*nod)*(V9_FLIP[n.dir??2]??1),walk:a.walk,role};
}
function v42aNPCWalkKey(role,dir){return 'v42npcWalk'+role+(dir>=5?'B':'F');}
function v42aDrawNPCWalk(d,n,z,pose){
 const dir=n.dir??2,role=pose.role,key=v42aNPCWalkKey(role,dir),m=V42_ACTOR_META[key];
 // Generic swordsmen intentionally keep the same prior custom identity;
 // roles 1–4 otherwise use their own merchant/guard/herbalist/wanderer sheet.
 if(!m||!v42aReady(key)||d.id.startsWith('v14_roam_')&&d.style==='swordsman'||!n.walking&&pose.walk<.38)return false;
 const phase=Number.isFinite(n.gait)?n.gait:0,f=n.walking?v42aFrame(phase):v42aContactFrame(phase);
 const sc=p.worldMode&&!v36Inside()?.86:1,size=85*sc*256/m.height,flip=V9_FLIP[dir]??1;
 // All twelve poses feature their own planted/raised feet and moving cloth.
 // The distance-driven gait comes from the existing pathfinding system.
 if(!v25Cell(key,f,4,3,z.x,z.y,size,flip,1,0,1,1,0))return false;
 V42A.stats.npcWalk++;const actor=v14Actor(d.id);if(actor?.sect&&dist(n,p)<390)hdEllipse(g,z.x,z.y+2,10,2,V14_S[actor.sect].color);return true;
}
v9NPCDraw=function(d,n,z){
 if(!p||!d||!n||!z||typeof d.id!=='string')return v42aNPC(d,n,z);
 v41aEnsure();const id=(v36Inside()?'room:':'world:')+d.id,pose=v42aNPCGesture(d,n,id,V41A.clock);
 g.save();g.translate(z.x,z.y);g.scale(pose.sx,pose.sy);g.rotate(pose.tilt);g.translate(-z.x,-z.y);try{V42A.stats.npc++;if(v42aDrawNPCWalk(d,n,z,pose))return;return v42aNPC(d,n,z);}finally{g.restore();}
};

// More deliberate species-specific anticipation and recoil without changing
// AI attack timings or duplicating V42 combat particles.
const v42aPreviousMobPose=v41aMobPose;
v41aMobPose=function(e,m,d,world){
 const pose=v42aPreviousMobPose(e,m,d,world),ai=V27.ai.get(e),state=ai?.mode||e.state,t=ai?.t??e.timer??0,phase=v41aMod(m.phase)*TAU/12,stride=m.blend;
 if(state==='chase'||state==='patrol'||state==='idle'){
  if(d.serpent){pose.sx*=1+.022*Math.sin(phase*2)*stride;pose.tilt+=.027*Math.sin(phase)*stride;}
  else if(d.ghost){pose.yy-=Math.sin(V41A.clock*2.1+(e.x||0)*.012)*1.8;pose.sx*=1+.014*Math.sin(phase);}
  else if(d.quad){pose.sy*=1+.012*Math.sin(phase*2)*stride;pose.sx*=1-.015*Math.sin(phase*2)*stride;}
  else{pose.tilt+=.013*Math.sin(phase)*stride;pose.sy*=1+.010*Math.cos(phase*2)*stride;}
 }else if(state==='wind'){
  const u=v42a01(t/Math.max(.15,ai?.action?.wind||d.t.wind||.4)),pulse=Math.sin(Math.PI*u);
  pose.sx*=1+(d.boss?.014:d.quad?.035:.022)*pulse;pose.sy*=1-.019*pulse;
 }else if(state==='attack'){
  const u=v42a01(t/.22),pulse=Math.sin(Math.PI*u);pose.sx*=1+(d.boss?.022:.033)*pulse;pose.sy*=1-.016*pulse;
 }
 return pose;
};

// Track contact boundaries for diagnostics and future audio integration. No
// added particles or audio duplication: V41/V42 already own environments and
// footstep sound. Contact count is distance-driven and resets only on a
// genuine actor/map change. No state is added to the save game.

// update_L22: lớp 35_animation (trước đây lưu lớp dưới vào v42aPreviousUpdate). Gọi lớp dưới: update_L21.
function update_L22(dt){
 const r=update_L21(dt);if(!p||mode!=='play')return r;
 const m=V41A.hero,scope=V41A.scope;if(!m)return r;
 if(V42A.owner!==p||V42A.scope!==scope){V42A.owner=p;V42A.scope=scope;V42A.lastPhase=m.phase;V42A.lastStep=Math.floor(m.phase/6);V42A.contacts=[];V42A.npcActivity.clear();return r;}
 const delta=(m.phase-V42A.lastPhase+12000)%12000,prev=Math.floor(V42A.lastPhase/6),next=Math.floor((V42A.lastPhase+delta)/6);
 if(delta>.001&&delta<15&&next>prev){for(let k=prev+1;k<=next;k++)V42A.contacts.push({phase:k*6%12,dir:m.dir,at:V41A.clock});if(V42A.contacts.length>16)V42A.contacts.splice(0,V42A.contacts.length-16);}
 V42A.lastPhase=m.phase;V42A.lastStep=next;
 if(V42A.npcActivity.size>100)for(const [k,v]of V42A.npcActivity)if(V41A.clock-v.at>35)V42A.npcActivity.delete(k);
 return r;
}


// v42_combat.js
// V42: refined combat choreography, time-sampled projectile wakes and
// explicit danger cues. Runtime presentation only: no damage, AI or save edits.
const V42C={owner:null,scope:'',clock:-1,trails:new Map(),decals:[],stats:{events:0,particles:0,trails:0,decals:0},danger:null};
const V42C_COL={blade:['#65cfbf','#effff8'],fan:['#52decc','#effff8'],storm:['#cfddb0','#fff6cc'],fall:['#78d9f5','#edffff'],shock:['#f1ab64','#fff0c8'],guard:['#ecc785','#fff1c5'],quake:['#dc9259','#ffe4bb'],crush:['#e3ba76','#fff5dd'],triple:['#b49deb','#faf0ff'],frost:['#78d3f5','#e8ffff'],lightning:['#c099ef','#fbf2ff'],blizzard:['#83cfe8','#eaffff']};
function v42cQuality(){return typeof v41Quality==='function'?v41Quality():1;}
function v42cReset(){V42C.owner=p;V42C.scope=p?v26Scope():'';V42C.clock=V26.clock;V42C.trails.clear();V42C.decals.length=0;V42C.danger=null;}
function v42cEnsure(){if(V42C.owner!==p||V42C.scope!==(p?v26Scope():'')||V26.clock<V42C.clock-.001)v42cReset();V42C.clock=V26.clock;}
function v42cWorldOK(){return p&&mode==='play'&&!(p.worldMode&&typeof v36Inside==='function'&&v36Inside());}
function v42cHex(s,f='#bce8d9'){return /^#[0-9a-f]{6}$/i.test(s||'')?s:f;}
function v42cRatio(world){return world?HD.tilt:.66;}
function v42cScreen(v,world){return e=>world?hdPoint(e.x,e.y,v):e;}
function v42cVisible(z,world,pad=230){return z.x>-pad&&z.y>-pad&&z.x<W/(world?V11_ZOOM:1)+pad&&z.y<H/(world?V11_ZOOM:1)+pad;}
function v42cPulse(q,t=.28){return Math.max(0,1-Math.abs(q-t)/Math.max(t,1-t));}
function v42cPath(pts){if(!pts.length)return;g.beginPath();g.moveTo(pts[0].x,pts[0].y);for(const v of pts.slice(1))g.lineTo(v.x,v.y);}
function v42cArcGlow(r,a0,a1,color,core,width,alpha=1){if(r<1||a1<=a0)return;g.save();g.globalAlpha*=alpha;g.strokeStyle=color;g.lineWidth=width*2.6;g.globalAlpha*=.22;g.beginPath();g.arc(0,0,r,a0,a1);g.stroke();g.globalAlpha/=.22;g.lineWidth=width;g.stroke();g.strokeStyle=core;g.lineWidth=Math.max(1.05,width*.38);g.stroke();g.restore();}
// Higher-contrast, crisp white leading edge with restrained luminous wake.
function v42cSlash(r,a0,a1,width,pal,alpha=1){
 g.save();g.globalAlpha*=alpha;v41cRibbon(r,a0,a1,width,pal[0],pal[1],.98);
 v42cArcGlow(r,a0+(a1-a0)*.13,a1-(a1-a0)*.05,pal[0],pal[1],3.6,.94);
 v41cRibbon(r-width*.36,a0+.19,a1-.26,width*.31,pal[0],pal[1],.35);g.restore();
}
function v42cBurst(q,r,col,core,angle,n=14,spread=TAU,seed=0,ratio=.7,kind='spark'){
 const budget=Math.max(0,Math.min(n,V41_COMBAT.budget));V41_COMBAT.budget-=budget;
 const life=1-q,near=Math.max(.03,q),ease=1-life**2.5;g.save();
 for(let i=0;i<budget;i++){
   const j=v41cHash(i+5,seed),a=angle+(v41cHash(i+20,seed)-.5)*spread,rr=r*(.13+ease*(.28+.70*j)),x=Math.cos(a)*rr,y=Math.sin(a)*rr*ratio-(kind==='stone'?20:10)*Math.sin(near*Math.PI)*j,l=(3+18*life*j),s=.7+2.7*j*life;
   g.globalAlpha=life**.85*(.62+.38*j);
   if(kind==='stone'){g.save();g.translate(x,y);g.rotate(a+near*2);g.fillStyle=i%3===0?core:col;g.beginPath();g.moveTo(-s,s*.3);g.lineTo(-s*.25,-s);g.lineTo(s,-s*.12);g.lineTo(s*.55,s);g.closePath();g.fill();g.restore();}
   else if(kind==='ice'){v41cDiamond(x,y,s*1.7,i%3===0?core:col,a);}
   else{v41cLine(x,y,x-Math.cos(a)*l,y-Math.sin(a)*l*ratio,col,s*.70);if(i%4===0){v41cLine(x,y,x-Math.cos(a)*l*.45,y-Math.sin(a)*l*.45*ratio,core,1);v41cDiamond(x,y,s*1.1,core,a);}}
 }g.restore();
}
function v42cImpact(f,q,r,angle,ratio,cls){
 const col=v42cHex(f.color),pal=v41cPalette(cls),core=f.crit?'#fff5c7':pal[1],heavy=f.heavy||f.crit,flash=Math.max(0,1-q*5.0);
 if(flash){v41cGlow(0,0,heavy?39:25,.87,col,.72*flash);g.save();g.globalAlpha*=flash*.95;g.rotate(angle);v41cDiamond(0,0,heavy?17:10,core);v41cLine(-18,0,18,0,core,2.2);v41cLine(0,-9,0,9,col,1.7);g.restore();}
 if(heavy){g.save();g.globalAlpha*=1-q;v41cRing(9+q*39,.63,col,2.2);if(f.crit)v41cRing(12+q*51,.62,core,1);g.restore();}
 v42cBurst(q,r*(heavy?2.45:1.45)+21,col,core,angle,f.crit?21:heavy?14:8,heavy?TAU:3.0,Math.floor(f.at*17)+9,.68,cls===1?'stone':'spark');
}
function v42cStrike(f,q,r,angle,ratio){
 const stage=f.stage||1,cls=f.cls??p.cls??0,pal=v41cPalette(cls),a=-1.46+q*1.08,rr=r*(.68+.40*q),pulse=1-q*.62;
 g.save();g.rotate(angle);
 if(cls===0){g.scale(1,.77);v42cSlash(rr,a,a+2.12+stage*.13,14+stage*6,pal,pulse);
   if(stage>=2)v42cSlash(rr*.83,-1.05-q*.47,.68-q*.47,10,pal,.63);
   if(stage===3){g.rotate(-.5);v42cSlash(rr*1.04,-1.03,1.16,14,['#e6d39a','#fff6ce'],.89);}
   v41cGlow(rr*.72,0,rr*.46,.47,pal[0],.19*(1-q));
 }else if(cls===1){
   for(let j=0;j<=stage;j++)v42cSlash(r*(.39+.55*q)+j*10,-.65-j*.045,.65+j*.045,10,pal,1-j*.12);
   if(stage>=2){g.save();g.translate(rr*.77,0);v41cGlow(0,0,32,.76,pal[0],.35*(1-q));v41cRing(10+q*25,.57,pal[0],1.8);g.restore();}
 }else{
   for(let j=0;j<stage;j++){const x=23+q*70,y=(j-(stage-1)/2)*22;v41cGlow(x,y,21,.9,pal[0],.45);g.save();g.translate(x,y);v41cDiamond(0,0,7,pal[1],q*2+j);v41cRing(13+q*6,.63,pal[0],2.3,q*2.9,q*2.9+Math.PI*1.8);g.restore();}
 }
 v42cBurst(q,r,pal[0],pal[1],0,stage>=3?18:9,2.45,stage,.7,cls===1?'stone':cls===2?'ice':'spark');g.restore();
}
function v42cSkill(f,q,ratio){
 const col=V42C_COL[f.style]||[v42cHex(f.color),'#fff8dd'],r=f.r||85,k=f.style,fade=(1-q)**.70,rot=V26.clock*2.3;
 // V41's independently composed skill artwork remains the base. Secondary
 // stages below add a bright release followed by slower embers, not uniform haze.
 v41cSkill(f,q,ratio);g.save();g.globalAlpha*=fade;
 if(['blade','fan','shock','triple','frost'].includes(k)){
   if(k==='blade'||k==='fan'){for(const j of k==='fan'?[-1,0,1]:[0]){const a=j*.29,x=Math.cos(a)*(26+q*64),y=Math.sin(a)*(26+q*64);v41cGlow(x,y,16,.82,col[0],.35);}}
   else if(k==='shock'){v42cBurst(q,72,col[0],col[1],0,14,1.9,11,ratio,'stone');}
   else v42cBurst(q,58,col[0],col[1],0,9,1.7,6,ratio,'ice');
 }else if(k==='storm'){
   g.save();g.scale(1,ratio);const rr=r*(.65+.34*Math.min(1,q*3));v42cArcGlow(rr,rot,rot+1.55,col[0],col[1],3.4,.9);v42cArcGlow(rr,rot+Math.PI,rot+Math.PI+1.55,'#a3e8d5','#e8fff4',3.4,.92);g.restore();
   for(let i=0;i<5;i++){const a=rot+i*TAU/5;v41cGlow(Math.cos(a)*r*.65,Math.sin(a)*r*.65*ratio-17,14,1,col[0],.4);}
   v42cBurst(q,r*.92,col[0],col[1],0,17,TAU,13,ratio);
 }else if(k==='fall'){
   const hit=1-Math.min(1,Math.abs(q-.28)*3);if(hit>0){v41cGlow(0,-10,55,ratio,col[0],hit*.48);g.save();g.globalAlpha*=hit;v41cRing(r*.88,ratio,col[1],2.1);g.restore();}
   v42cBurst(q,r,col[0],col[1],0,19,TAU,3,ratio);
 }else if(k==='guard'){
   g.save();g.translate(0,-27);v41cRing(r*.53,.95,col[1],1.8,-Math.PI*.76,Math.PI*.76);v41cGlow(0,0,23,1,col[0],.25);g.restore();
 }else if(k==='quake'||k==='crush'){
   const rr=r*(.2+.75*q);g.save();g.scale(1,ratio);v42cArcGlow(rr,rot,rot+Math.PI*1.8,col[0],col[1],3.5,.75);g.restore();
   v42cBurst(q,r,col[0],col[1],0,22,TAU,12,ratio,'stone');
 }else if(k==='lightning'){
   v41cGlow(0,-12,42,.82,col[0],.42*(1-q));v42cBurst(q,r*.8,col[0],col[1],0,17,TAU,7,ratio);
 }else if(k==='blizzard'){
   for(let i=0;i<6;i++){const a=i*TAU/6+rot,rr=r*.70;v41cGlow(Math.cos(a)*rr,Math.sin(a)*rr*ratio,18,.6,col[0],.18);}
   v42cBurst(q,r,col[0],col[1],0,18,TAU,19,ratio,'ice');
 }g.restore();
}
// Capture confirmed gameplay events; decals are not hazards and cannot affect
// collision. Ground residue is subtle and never shown as a warning.
const v42cAddOld=v26Add;
v26Add=function(kind,x,y,color,dur,more={}){
 const result=v42cAddOld(kind,x,y,color,dur,more);if(!p||!v42cWorldOK())return result;
 v42cEnsure();const k=more.style;
 if(kind==='skill'&&['storm','fall','quake','crush','lightning','blizzard'].includes(k)){
   V42C.decals.push({x,y,r:more.r||90,style:k,color:v42cHex(color),at:V26.clock,delay:.13,life:1.1});
 }else if(kind==='impact'&&more.heavy){V42C.decals.push({x,y,r:(more.r||20)*.72,color:v42cHex(color),style:'impact',at:V26.clock,delay:.13,life:.52});}
 if(V42C.decals.length>12)V42C.decals.splice(0,V42C.decals.length-12);return result;
};
function v42cTrack(dt){
 if(!v42cWorldOK()){if(V42C.trails.size||V42C.decals.length)v42cReset();return;}
 v42cEnsure();if(modal)return;
 const q=v42cQuality(),now=V26.clock,cap=[10,22,32][q]||22,max=[4,6,8][q]||6,active=new Set();
 for(const b of bolts){
   if(!b.good||!b.kind||active.size>=cap)continue;active.add(b);let t=V42C.trails.get(b);
   if(!t){if(V42C.trails.size>=cap*2)continue;t={b,kind:b.kind,col:v42cHex(b.color),at:now,points:[],last:-1};V42C.trails.set(b,t);}
   t.at=now;if(now-t.last>=.022||!t.points.length){t.points.push({x:b.x,y:b.y});t.last=now;if(t.points.length>max)t.points.shift();}
 }
 for(const [b,t] of V42C.trails)if(!active.has(b)&&now-t.at>.17)V42C.trails.delete(b);
 V42C.decals=V42C.decals.filter(f=>now-f.at<f.life);
}
// update_L23: lớp 35_animation (trước đây lưu lớp dưới vào v42cUpdateOld). Gọi lớp dưới: update_L22.
function update_L23(dt){const result=update_L22(dt);v42cTrack(dt);return result;}
function v42cDrawTrail(t,point,world){
 if(t.points.length<2)return false;const end=point(t.b);if(!v42cVisible(end,world))return false;
 const age=Math.max(0,V26.clock-t.at),fade=Math.max(0,1-age/.17);if(!fade)return false;
 const pts=t.points.map(point);if(age<.023)pts.push(end);if(pts.length<2)return false;
 const xy=pts.map(a=>({x:a.x,y:a.y-12})),last=xy[xy.length-1],first=xy[0],l=Math.hypot(last.x-first.x,last.y-first.y);if(l<8||l>390)return false;
 const colors=V42C_COL[t.kind]||[t.col,'#f6efff'],col=colors[0],core=colors[1],wid=t.kind==='blade'?8:t.kind==='frost'?9:t.kind==='shock'?13:5;
 g.save();g.globalAlpha=fade*.88;const grad=g.createLinearGradient(first.x,first.y,last.x,last.y);grad.addColorStop(0,col+'00');grad.addColorStop(.52,col+'4e');grad.addColorStop(1,col+'cf');
 const upper=[],lower=[];for(let j=0;j<xy.length;j++){const a=xy[j],prev=xy[Math.max(0,j-1)],nxt=xy[Math.min(xy.length-1,j+1)],dx=nxt.x-prev.x,dy=nxt.y-prev.y,d=Math.max(.01,Math.hypot(dx,dy)),w=wid*(j/(xy.length-1))**.8;upper.push({x:a.x-dy/d*w,y:a.y+dx/d*w});lower.push({x:a.x+dy/d*w,y:a.y-dx/d*w});}
 v42cPath(upper.concat(lower.reverse()));g.closePath();g.fillStyle=grad;g.fill();v42cPath(xy);g.strokeStyle=grad;g.lineWidth=2.4;g.stroke();
 if(t.kind==='frost'||t.kind==='orb'){for(let i=1;i<xy.length;i+=2){const a=xy[i];v41cDiamond(a.x,a.y,1.6+i*.28,core,Math.PI*.25);}}
 g.restore();return true;
}
function v42cDrawDecal(f,point,world,ratio){
 const q=v41c01((V26.clock-f.at-f.delay)/Math.max(.01,f.life-f.delay));if(V26.clock-f.at<f.delay||q>=1)return false;const z=point(f);if(!v42cVisible(z,world))return false;
 const col=(V42C_COL[f.style]||[f.color,'#fff3db'])[0];g.save();g.translate(z.x,z.y);g.globalAlpha=(1-q)*.32;
 if(f.style==='quake'||f.style==='crush'){g.scale(1,ratio);v41cStoneCracks(f.r*.78,q,col);v41cRing(f.r*.86,1,col,.8);}
 else if(f.style==='blizzard'){for(let i=0;i<7;i++){const a=i*2.399,rr=f.r*.71*Math.sqrt((i+1)/7);v41cCrystal(Math.cos(a)*rr,Math.sin(a)*rr*ratio,8+10*(1-q),a*.3,col,'#eaffff');}}
 else if(f.style==='lightning'){g.scale(1,ratio);v41cStoneCracks(f.r*.61,q,col);}
 else if(f.style==='impact'){v41cRing(f.r*(.5+q*.6),ratio,col,1);}
 else {v41cRing(f.r*.84,ratio,col,1.1);for(let j=0;j<5;j++){const a=j*TAU/5+q*.10;v41cDiamond(Math.cos(a)*f.r*.68,Math.sin(a)*f.r*.68*ratio,2.6,col,a);}}
 g.restore();return true;
}
// Enhanced wind-up for skills. Existing pose and cast time stay authoritative.
const v42cChargeOld=v26Charge;
v26Charge=function(x,y,a,world){v42cChargeOld(x,y,a,world);if(!a?.d||a.hit)return;const q=v41c01(a.vis/Math.max(.01,a.impact)),c=V42C_COL[a.d.kind]||v41cPalette(a.cls);if(q<.22)return;
 g.save();g.translate(x,y-2);g.globalAlpha=.26+q*.43;v41cRing(24+q*19,v42cRatio(world),c[1],1.8,0,TAU*q);
 if(a.cls===1)v41cGlow(Math.cos(a.a)*18,-35,20+q*10,1,c[0],.44);else if(a.cls===2)v41cGlow(0,-44,21+q*9,1,c[0],.46);
 g.restore();
};
// Fix V41's low-quality slice(-0) impact overflow. Keep newest skill effects,
// reserve capacity for impacts, then choose within the configured budget.
function v42cSelect(fx,cap,point,world){
 const all=fx.filter(f=>v42cVisible(point(f),world));let primary=all.filter(f=>f.kind!=='impact'),secondary=all.filter(f=>f.kind==='impact');
 const heavy=secondary.filter(f=>f.crit||f.heavy),light=secondary.filter(f=>!f.crit&&!f.heavy);
 const pc=Math.min(primary.length,Math.max(1,Math.floor(cap*.72))),sc=Math.max(0,cap-pc),hc=Math.min(sc,heavy.length),lc=Math.max(0,sc-hc);
 const out=(pc?primary.slice(-pc):[]).concat(hc?heavy.slice(-hc):[],lc?light.slice(-lc):[]);
 // If impact budget is unused, fill with previously omitted primary events.
 const extra=Math.max(0,cap-out.length),first=Math.max(0,primary.length-pc);if(extra&&first)out.unshift(...primary.slice(Math.max(0,first-extra),first));return out;
}
v26Render=function(v){
 if(!v42cWorldOK())return;v42cEnsure();
 const world=!!p.worldMode,point=v42cScreen(v,world),ratio=v42cRatio(world),cls=p.cls??0,qlevel=v42cQuality(),cap=Math.max(1,V41_COMBAT.maxEvents|0);
 V41_COMBAT.budget=Math.max(1,V41_COMBAT.maxParticles|0);V42C.stats={events:0,particles:0,trails:0,decals:0};
 const maxDecals=[4,8,12][qlevel]||8,maxTrails=[10,22,32][qlevel]||22;
 for(const f of V42C.decals.slice(-maxDecals))if(v42cDrawDecal(f,point,world,ratio))V42C.stats.decals++;
 for(const t of [...V42C.trails.values()].slice(-maxTrails))if(v42cDrawTrail(t,point,world))V42C.stats.trails++;
 const d=V26.dash;if(d){const size=124*(world?.78:1),path=d.path;
   for(let i=0;i<path.length;i++){const a=path[i],age=V26.clock-a.at,z=point(a);if(age>.27||!v42cVisible(z,world))continue;
    v25Cell(v25RunKey(cls,d.dir),a.frame,4,3,z.x,z.y,size,V9_FLIP[d.dir],.28*(1-age/.27),a.lift);
    if(i&&age<.20){const prev=point(path[i-1]),col=v41cPalette(cls)[0];g.save();g.globalAlpha=.50*(1-age/.20);v41cLine(prev.x,prev.y-19,z.x,z.y-19,col,2.1);g.restore();}
   }
 }
 v41cAnticipation(v,world);
 const selected=v42cSelect(V26.fx,cap,point,world);V42C.stats.events=V41_COMBAT.lastRenderedCount=selected.length;
 for(const f of selected){const z=point(f),q=v41c01((V26.clock-f.at)/Math.max(.01,f.dur)),r=f.r||65,ag=Math.atan2(Math.sin(f.a||0)*(world?HD.tilt:1),Math.cos(f.a||0));
   g.save();g.translate(z.x,z.y-(f.kind==='impact'?33:f.kind==='strike'||f.kind==='release'?25:0));g.globalAlpha=1-q*.68;
   if(f.kind==='strike')v42cStrike(f,q,r,ag,ratio);
   else if(f.kind==='impact')v42cImpact(f,q,r,ag,ratio,cls);
   else if(f.kind==='skill')v42cSkill(f,q,ratio);
   else if(f.kind==='release'){g.rotate(ag);if(['blade','fan','shock','triple','frost'].includes(f.style))v42cSkill(f,q,ratio);else{v41cGlow(0,0,22,.7,v42cHex(f.color),.36*(1-q));v41cRing(12+q*45,.65,f.color,2);v42cBurst(q,49,v42cHex(f.color),'#fff7dc',0,9,TAU,8,.66);}}
   else if(f.kind==='death'){// V41 animation owns the fallen creature silhouette; VFX only add dust.
      v42cBurst(q,56,v42cHex(f.color),'#e8dfbd',0,11,TAU,4,ratio,'stone');
   }else if(f.kind==='land'||f.kind==='dash'){const col=v42cHex(f.color),pal=v41cPalette(cls);v41cRing(r*(.21+q*.79),ratio,col,1.5);v42cBurst(q,r*.70,'#d3c09a',pal[1],ag+Math.PI,8,Math.PI*1.3,4,ratio,'stone');}
   g.restore();
 }
 V42C.stats.particles=V41_COMBAT.lastParticles=V41_COMBAT.maxParticles-V41_COMBAT.budget;
};
// Danger perimeter is the same v27Path used by the original collision test;
// striped wedge/fan, directional lane and safe inner ring all retain geometry.
const v42cZoneOld=v27Zone;
v27Zone=function(d,z,col,q,world,impact=false){
 if(!d||!z||!Number.isFinite(d.reach)||d.reach<=0)return;q=v41c01(q);
 if(impact){v42cZoneOld(d,z,col,q,world,true);return;}
 const ratio=world?HD.tilt:1,r=d.reach,ang=d.angle||0,c=v42cHex(col,'#ff9179'),sector=d.shape==='sector'||d.shape==='fan',start=sector?-d.arc:0,span=sector?d.arc*2:TAU,late=q>.72,pulse=late?.12*Math.sin(q*36)+.12:0;
 g.save();g.translate(z.x,z.y);g.scale(1,ratio);g.rotate(ang);v27Path(d);g.fillStyle=c;g.globalAlpha=.12+.11*q+pulse*.4;g.fill('evenodd');
 g.save();g.clip('evenodd');g.strokeStyle=c;g.lineWidth=1.35;g.globalAlpha=.17+.14*q;for(let i=-r*2,s=Math.max(29,r/7);i<r*2;i+=s){g.beginPath();g.moveTo(i,-r);g.lineTo(i+r*2,r);g.stroke();}
 g.globalAlpha=.12+.14*q;g.fillStyle=c;if(d.shape==='line')g.fillRect(0,-d.width,r*q,d.width*2);else{g.beginPath();g.moveTo(0,0);g.arc(0,0,r,start,start+span*q);g.closePath();g.fill();}
 g.restore();
 v27Path(d);g.globalAlpha=.97;g.strokeStyle='#302425';g.lineWidth=5.7;g.stroke();g.strokeStyle=c;g.lineWidth=late?3.4:2.6;g.stroke();
 g.globalAlpha=.96;g.strokeStyle='#fff2c7';g.lineWidth=3.0;g.lineCap='round';g.beginPath();
 if(d.shape==='line'){g.moveTo(0,-d.width);g.lineTo(r*q,-d.width);g.moveTo(0,d.width);g.lineTo(r*q,d.width);}
 else{g.arc(0,0,r,start,start+span*q);if(d.shape==='ring'){g.moveTo(d.inner,0);g.arc(0,0,d.inner,0,TAU*q);}}g.stroke();
 // Shape-specific directional markers keep the intent clear on busy terrain.
 g.globalAlpha=.58+.22*q;
 if(d.shape==='line'){
   for(let i=1;i<=4;i++){const x=r*i/5,w=Math.min(12,d.width*.40);g.beginPath();g.moveTo(x-w,-w);g.lineTo(x+w,0);g.lineTo(x-w,w);g.strokeStyle=i/5<=q?'#fff1d5':c;g.lineWidth=2.4;g.stroke();}
 }else if(sector){
   // Inset chevrons or arc indicate direction without falsely changing range.
   const rr=r*.74;for(const a of [-d.arc*.58,0,d.arc*.58]){const x=Math.cos(a)*rr,y=Math.sin(a)*rr;g.save();g.translate(x,y);g.rotate(a);g.strokeStyle=c;g.lineWidth=2;g.beginPath();g.moveTo(-9,-7);g.lineTo(1,0);g.lineTo(-9,7);g.stroke();g.restore();}
 }else if(d.shape==='ring'){
   g.save();g.globalAlpha=.64;g.strokeStyle='#b7f1d4';g.lineWidth=1.5;if(g.setLineDash)g.setLineDash([7,5]);g.beginPath();g.arc(0,0,Math.max(0,d.inner-5),0,TAU);g.stroke();g.restore();
 }else{for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])v41cLine(Math.cos(a)*r*.80,Math.sin(a)*r*.80,Math.cos(a)*r*.96,Math.sin(a)*r*.96,'#fff3cf',1.8);}
 g.restore();
};
// Extra wind-up and resolve feedback for real telegraphed enemy actions.
const v42cBossRenderOld=v27Render;
v27Render=function(v){
 v42cBossRenderOld(v);if(!v42cWorldOK())return;
 const world=!!p.worldMode,point=v42cScreen(v,world),ratio=v42cRatio(world);let danger=null;
 for(const e of enemies){if(e.dead||dist(e,p)>650)continue;const a=V27.ai.get(e);if(!a||a.mode!=='wind'||!a.action)continue;const d=a.action,t=Math.max(0,d.wind-a.t);
   if(!v27Inside(d,p)||t>.90)continue;if(!danger||t<danger.time)danger={time:t,col:d.breakGuard?'#ffd07a':'#ff907b'};
 }
 V42C.danger=danger;
 if(danger&&!modal&&p.hurt<=0){const z=point(p),t=danger.time,cc=danger.col;
   g.save();g.translate(z.x,z.y);g.globalAlpha=.95;v41cRing(14,ratio,cc,2.3);v41cRing(20,ratio,cc,1.5,0,TAU*Math.max(.10,t/.9));
   const caption='NÉ  '+t.toFixed(1)+'s',w=84,h=20,y=16;
   g.fillStyle='#261c20e5';g.strokeStyle=cc;g.lineWidth=1.2;g.beginPath();g.roundRect(-w/2,y,w,h,5);g.fill();g.stroke();text(caption,0,y+h/2,14,'#fff2d8','center','bold');g.restore();
 }
 // Preserve V41's elemental impacts; add high-readability lunge and sweep
 // silhouettes, plus poise-break shatter. At most 7 recent boss events.
 const saved=V41_COMBAT.budget;V41_COMBAT.budget=[16,28,42][v42cQuality()]||28;
 for(const f of V27.fx.slice(-7)){const z=point(f);if(!v42cVisible(z,world))continue;const q=v41c01((V27.clock-f.at)/Math.max(.01,f.life)),d=f.attack,c=v42cHex(f.col,'#f5c694');
   g.save();g.translate(z.x,z.y);g.globalAlpha=(1-q)**.80;
   if(f.kind==='break'){v41cGlow(0,-8,32,.76,c,.40*(1-q));v42cBurst(q,63,c,'#fff1cf',0,18,TAU,8,ratio,'stone');}
   else if(f.kind==='strike'&&d){
     if(d.shape==='line'){g.scale(1,world?HD.tilt:1);g.rotate(d.angle||0);const gr=g.createLinearGradient(0,0,d.reach,0);gr.addColorStop(0,c+'00');gr.addColorStop(.52,c+'b0');gr.addColorStop(1,'#ffeed3');g.strokeStyle=gr;g.lineWidth=3.4;for(let i=-1;i<=1;i++)v41cLine(0,i*d.width*.58,d.reach*(.35+.65*q),i*d.width*.58,gr,3);v42cBurst(q,d.reach*.64,c,'#fff0d4',0,12,1.3,7,.85);}
     else if(d.shape==='sector'&&d.id!=='fire'){g.scale(1,world?HD.tilt:1);g.rotate(d.angle||0);v42cSlash(d.reach*(.7+.28*q),-d.arc,d.arc,18,[c,'#fff4dc'],.75);}
   }g.restore();
 }V41_COMBAT.budget=saved;
};


