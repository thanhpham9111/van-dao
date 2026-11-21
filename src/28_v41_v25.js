'use strict';
// V41 · Chuyển động Linh Thể. Runtime animation only: no new combat hits or save data.
// Reuses the existing 12 authored run poses at the 128,224 anchor (4×3 atlas).
// Where directional artwork is absent, the existing same-class portrait is
// animated as a layered procedural rig; these are NOT newly painted frames.
const V41A={owner:null,scope:'',clock:0,hero:null,npcs:new Map(),mobs:new WeakMap(),dead:new WeakSet(),corpses:[],pace:230,paceAt:-1};
const v41a01=x=>Math.max(0,Math.min(1,x));
const v41aMix=(a,b,t)=>a+(b-a)*t;
const v41aSmooth=x=>{x=v41a01(x);return x*x*(3-2*x);};
const v41aMod=x=>((x%12)+12)%12;
const v41aEase=(x,y,k,dt)=>v41aMix(x,y,1-Math.exp(-k*Math.max(0,dt)));
const v41aFoot=[0,.28,.75,1,.62,.16,0,-.28,-.75,-1,-.62,-.16];
function v41aScope(){return v26Scope()+(v36Inside()?':room:'+v36Inside().id:'');}
function v41aPosition(){return v36Inside()||p;}
function v41aNewMotion(dir=2,phase=0){return {dir,phase,blend:0,speed:0,dx:0,dy:0,lean:0,at:V41A.clock,step:0};}
function v41aReset(){V41A.owner=p;V41A.scope=v41aScope();V41A.hero=v41aNewMotion(V8.dir??2,V8.phase??0);V41A.npcs.clear();V41A.mobs=new WeakMap();V41A.dead=new WeakSet();V41A.corpses=[];V41A.paceAt=-1;}
function v41aEnsure(){if(V41A.owner!==p||V41A.scope!==v41aScope()||!V41A.hero)v41aReset();}
function v41aMotion(m,dx,dy,dt,world,dir,pace,canStride=true){
 const d=Math.hypot(dx,dy),projection=Math.hypot(dx,dy*(world?HD.tilt:1)),speed=projection/Math.max(.001,dt),moving=canStride&&speed>5&&d<150;
 m.speed=v41aEase(m.speed,moving?d/Math.max(.001,dt):0,16,dt);m.blend=v41aEase(m.blend,moving?v41a01(m.speed/Math.max(40,pace*.54)):0,moving?16:20,dt);
 if(moving){m.dir=dir;m.phase=(m.phase+d/Math.max(3,pace/24))%12000;m.dx=v41aEase(m.dx,dx/d,17,dt);m.dy=v41aEase(m.dy,dy/d,17,dt);}
 else{if(Number.isInteger(dir))m.dir=dir;m.dx=v41aEase(m.dx,0,18,dt);m.dy=v41aEase(m.dy,0,18,dt);}
 m.lean=v41aEase(m.lean,m.dx*.032*m.blend,16,dt);m.at=V41A.clock;return m;
}
function v41aFrame(phase){return Math.floor(v41aMod(phase));}
function v41aWave(phase){const f=v41aMod(phase),i=Math.floor(f);return v41aMix(v41aFoot[i],v41aFoot[(i+1)%12],f-i);}

// Draw an existing portrait as a softly articulated upper body, robe and two
// alternating legs. Only one leg lifts at a time. The contact leg and shadow
// are anchored at (x,y); never adjust collision or actor position from art.
function v41aRig(im,sx,sy,sw,sh,x,y,w,h,anchor,flip,phase,blend,breath,lean=0){
 const gait=v41aWave(phase)*blend,up=Math.abs(gait),side=flip*(lean||0),base=-h*anchor,foot=anchor;
 g.save();g.translate(x,y);g.scale(flip,1);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 if(blend<.035){g.scale(1+breath*.06,1+breath);g.drawImage(im,sx,sy,sw,sh,-w*.5,base,w,h);g.restore();return;}
 // Top band and torso bend independently; robe hem follows lightly, boots do not.
 const cut=anchor*.73,bands=7;
 for(let j=0;j<bands;j++){const a=j*cut/bands,b=(j+1)*cut/bands;
  const lift=t=>-h*(.018*up+breath)*(1-t/foot),shift=t=>w*(side*.7*(1-t/foot)+gait*.021*Math.sin(Math.PI*t/foot));
  const y0=base+h*a+lift(a),y1=base+h*b+lift(b),wide=1+.014*up*Math.sin(Math.PI*a/cut);
  g.drawImage(im,sx,sy+a*sh,sw,(b-a)*sh,-w*wide*.5+shift((a+b)*.5),y0,w*wide,Math.max(.15,y1-y0+.5));
 }
 // Robe/leg layer is divided in its lower portion. Center overlap hides a seam.
 // Keep the standing contact leg at original y while the swing leg lifts.
 for(const leg of gait>=0?[0,1]:[1,0]){const start=leg===0?0:.49,part=leg===0?.51:.51,off=leg===0?-1:1;
  const lift=Math.max(0,gait*off)*h*.042,dx=off*gait*w*.036,srcH=1-cut;
  g.drawImage(im,sx+sw*start,sy+sh*cut,sw*part,sh*srcH,-w*.5+w*start+dx,base+h*cut-h*.006*up-lift,w*part,h*srcH+h*.006*up);
 }
 g.restore();
}
function v41aRigCell(cls,dir,x,y,size,m,breath=0){const a=imgs.v25idle;if(!a?.ready||!a.img.naturalWidth)return false;
 const im=a.img,sw=im.naturalWidth/4,sh=im.naturalHeight/3,i=cls*4+V25_IDLE_COL[dir];
 v41aRig(im,(i%4)*sw,Math.floor(i/4)*sh,sw,sh,x,y,size,size,.875,V9_FLIP[dir],m.phase,m.blend,breath,m.lean);return true;
}
function v41aGroundShadow(x,y,rx,ry,strength=1){g.save();g.globalAlpha*=strength;hdEllipse(g,x,y,rx,ry,'#101b1c65');hdEllipse(g,x,y+.4,rx*.64,ry*.65,'#101b1c50');g.restore();}
function v41aHeroRun(cls,dir,x,y,size,m){
 // Kiếm Tu has full authored E/SE/S/NE/N atlases + mirrors. Thể Tu and
 // Pháp Tu use their own side atlases for horizontal motion, and their actual
 // front/rear views (procedural stride) for other headings; no wrong costume.
 const _wk=imgs['v46walk'+cls];if(_wk?.ready&&_wk.img.naturalWidth){const _fw=_wk.img.naturalWidth/4,_fh=_wk.img.naturalHeight,_f=v41aFrame(m.phase)%4,_wave=v41aWave(m.phase),_stretch=(1-Math.abs(_wave))*.012*m.blend,_w=size*_fw/_fh,_fl=V9_FLIP[dir];g.save();g.translate(x,y);g.scale(_fl*(1+_stretch),1-_stretch*.65);g.drawImage(_wk.img,_f*_fw,0,_fw,_fh,-_w/2,-size,_w,size);g.restore();return true;}
 const frontal=dir===2||dir===5||dir===6||dir===7,k=cls===0?'v25run'+V25_DIR[dir]:cls===1?'v25runB':'v25runM';
 if(cls&&frontal)return v41aRigCell(cls,dir,x,y,size,m,0);
 const wave=v41aWave(m.phase),effort=m.blend,stretch=(1-Math.abs(wave))*.012*effort;
 return v25Cell(k,v41aFrame(m.phase),4,3,x,y,size,V9_FLIP[dir],1,0,1+stretch,1-stretch*.65,m.lean*V9_FLIP[dir]);
}
function v41aActionPose(a){
 const q=v41a01(a.vis/a.dur),impact=v41a01(a.impact/a.dur),wind=q<impact,u=wind?q/Math.max(.001,impact):(q-impact)/Math.max(.001,1-impact),stage=a.stage||1,cast=a.kind==='skill',cls=a.cls??0;
 const pre=wind?v41aSmooth(u):0,follow=wind?0:Math.sin(Math.PI*Math.min(1,u*1.12)),recover=wind?0:v41aSmooth((u-.45)/.55),hitPower=cast?(cls===2?.66:.90):.74+stage*.13;
 const back=(cast?2.3:3.2+stage*.65)*pre,step=(cast?(cls===2?3:6):6+stage*2.2)*follow*hitPower;
 return {index:wind?(u<.36?0:1):(u<.64?2:3),step:step-back,lift:(stage===3&&!cast?4.5:cast&&cls===2?2:0)*follow,sx:1+.026*pre+.065*follow*hitPower,sy:1-.072*pre+.046*follow*hitPower-.016*recover,tilt:-.043*pre+follow*(cls===1?.095:stage===2?-.09:.065),q};
}

const v41aPrevHero=v9HeroBody;
v9HeroBody=function(x,y,world){
 if(!p||!imgs.v25idle?.ready)return v41aPrevHero(x,y,world);v41aEnsure();
 const m=V41A.hero,inside=!!v36Inside(),size=124*(world&&!inside?.78:1),cls=p.cls??0,dir=V8.dir??m.dir??2,breath=.005*Math.sin(V41A.clock*2.4+cls*.7);
 // Keep the existing action clock, exact impact instant and charge effects;
 // replace only the authored pose timing and anchor-relative anticipation.
 const a=V26.action;if(a&&p.hurt<=0&&p.dashT<=0&&a.d?.kind!=='guard'&&imgs.v25attack?.ready){
  const r=v41aActionPose(a),s=Math.cos(a.a)<0?-1:1,proj=world&&!inside?HD.tilt:1;
  if(v25Cell('v25attack',cls*4+r.index,4,3,x+Math.cos(a.a)*r.step,y+Math.sin(a.a)*r.step*proj,size,s,1,r.lift,r.sx,r.sy,r.tilt*s)){
   if(a.kind==='skill'&&!a.hit){g.save();g.translate(x,y);g.scale(size/124,size/124);g.translate(-x,-y);v26Charge(x,y,a,world);g.restore();}return;
  }
 }
 // Guard, dash and stagger retain the existing dedicated silhouettes and effects.
 if(p.attackT>0||p.castT>0||p.dashT>0||p.hurt>0||a){return v41aPrevHero(x,y,world);}
 let ok=false;
 if(m.blend>.5||animation.name==='run'&&m.speed>8){ok=v41aHeroRun(cls,dir,x,y,size,m);}
 else{const _hs=imgs['v46hero'+cls];if(_hs?.ready&&_hs.img.naturalWidth){const _w=size*_hs.img.naturalWidth/_hs.img.naturalHeight,_bob=Math.sin(V41A.clock*2.4+cls*.7)*1.2;g.drawImage(_hs.img,x-_w/2,y-size+_bob,_w,size);ok=true;}else{const settle=Math.min(.49,m.blend),land=V26.dash?.land?Math.max(0,1-(V26.clock-V26.dash.land)/.16):0;ok=v41aRigCell(cls,dir,x,y,size,{...m,blend:settle},breath-.024*Math.sin(Math.PI*land));}}
 if(!ok)return v41aPrevHero(x,y,world);
 // The shield ring is the existing status indicator, not an extra game effect.
 if(p.v10Guard>0){g.save();g.globalAlpha=.33;g.strokeStyle='#f1d1a0';g.lineWidth=1.3;g.beginPath();g.ellipse(x,y-size*.23,size*.193,size*.323,0,0,TAU);g.stroke();g.restore();}
};

const v41aPrevNPC=v9NPCDraw;
v9NPCDraw=function(d,n,z){
 if(!p||!d||!n||!z||typeof d.id!=='string')return v41aPrevNPC(d,n,z);v41aEnsure();
 const dir=n.dir??2,inside=!!v36Inside(),id=(inside?'room:':'world:')+d.id;
 let m=V41A.npcs.get(id);if(!m){m=v41aNewMotion(dir,n.gait||0);V41A.npcs.set(id,m);}
 const dt=Math.min(.10,Math.max(0,V41A.clock-m.at)),target=n.walking?1:0; // draw calls never advance a gameplay clock
 m.blend=v41aEase(m.blend,target,n.walking?13:18,dt);m.dir=dir;
 if(n.walking&&Number.isFinite(n.gait))m.phase=n.gait;
 m.lean=v41aEase(m.lean,(n.vx||0)*.00048,13,dt);m.at=V41A.clock;
 const sc=p.worldMode&&!inside?.86:1,back=dir>=5,phase=m.phase,generic=d.id.startsWith('v14_roam_')&&d.style==='swordsman';let ok=false;
 if(generic){const k=Math.abs(Number(d.id.split('_').at(-1))||0);g.save();if(k%4===1)g.filter='sepia(0.25) saturate(0.9)';else if(k%4===3)g.filter='hue-rotate(42deg) saturate(0.85)';
  if(m.blend>.55)ok=v41aHeroRun(0,dir,z.x,z.y,103*sc,m);else ok=v41aRigCell(0,dir,z.x,z.y,103*sc,m,.004*Math.sin(V41A.clock*2+k));g.restore();
 }else{
  const i=v15NPCIndex(d),key=(back&&imgs['v25npcBack'+i]?.ready?'v25npcBack':'v25npc')+i,a=imgs[key];
  if(a?.ready&&a.img.naturalWidth){const h=85*sc,w=h*a.img.naturalWidth/a.img.naturalHeight,phaseShift=(i*1.7)%TAU,b=.005*Math.sin(V41A.clock*2+phaseShift);v41aRig(a.img,0,0,a.img.naturalWidth,a.img.naturalHeight,z.x,z.y,w,h,1,V9_FLIP[dir],phase,m.blend,b,m.lean);ok=true;}
 }
 if(!ok)return v41aPrevNPC(d,n,z);
 const actor=v14Actor(d.id);if(actor?.sect&&dist(n,p)<390)hdEllipse(g,z.x,z.y+2,10,2,V14_S[actor.sect].color);
};

// Monster locomotion state is updated from actual displacement, independently
// of the simulation's AI. Distinct profiles: swift beast, serpent, spirit,
// armored biped and heavy boss. It avoids the previous "chase = always bounce".
function v41aMob(e){let m=V41A.mobs.get(e);if(!m){m=v41aNewMotion(e.dir<0?4:0,((e.x||0)*.01+(e.y||0)*.03)%12);m.face=e.dir<0?-1:1;V41A.mobs.set(e,m);}return m;}
function v41aProfile(e){const t=TYPES[e.type];return {t,boss:bossType(e.type),quad:[0,3,5,8,10,12,13,16].includes(e.type),serpent:[6,15].includes(e.type),ghost:[2,10,17].includes(e.type),ranged:!!t.ranged||e.type===2};}
function v41aMobTick(e,dt,world,fn){v41aEnsure();const x=e.x,y=e.y,r=fn(e,dt,world),m=v41aMob(e),d=v41aProfile(e),pace=Math.max(60,d.t.speed||110);v41aMotion(m,e.x-x,e.y-y,dt,world,e.dir<0?4:0,pace,!e.dead);m.face=e.dir<0?-1:1;if(e.dead)v41aDeath(e);return r;}
const v41aPrevOW=owEnemy,v41aPrevArena=updateEnemy;
owEnemy=function(e,dt){return v41aMobTick(e,dt,true,v41aPrevOW);};
updateEnemy=function(e,dt){return v41aMobTick(e,dt,false,v41aPrevArena);};
function v41aMobPose(e,m,d,world){
 const a=V27.ai.get(e),state=a?.mode||e.state,clock=V41A.clock,t=d.t,dir=e.dir<0?-1:1,ang=e.angle??(dir<0?Math.PI:0),proj=world?HD.tilt:1;
 const q=(a?.t??e.timer??0),wave=v41aWave(m.phase),stride=m.blend,phi=v41aMod(m.phase)*TAU/12,breathe=Math.sin(clock*(d.boss?1.3:2.3)+(e.x||0)*.013);
 let xx=0,yy=d.ghost?-(3.3+Math.sin(clock*2.4+e.y*.01)*2):0,sx=1,sy=1+.008*breathe,tilt=0,hitPose=false,alpha=1;
 if(state==='wind'||state==='guard'||state==='rage'){
  const u=v41aSmooth(q/Math.max(.18,state==='rage'?.85:state==='guard'?.58:a?.action?.wind||t.wind));
  sy*=1-.12*u;sx*=1+.055*u;tilt=-dir*.067*u;xx-=Math.cos(ang)*u*(d.boss?8:4);yy-=Math.sin(ang)*u*4*proj;
  if(state==='rage'){sx+=.03*Math.sin(q*14);sy+=.05*Math.sin(q*10);}
 }else if(state==='attack'){
  const u=v41a01(q/.26),impact=Math.sin(Math.PI*Math.min(1,u*1.75)),recover=v41aSmooth((u-.48)/.52),lunge=!!a?.action?.lunge;
  // Actual lunges already move the actor through v27Move; only a modest
  // anticipation offset is added, and no double game displacement.
  xx+=Math.cos(ang)*impact*(lunge?3:d.ranged?4:d.boss?14:9);yy+=Math.sin(ang)*impact*proj*5;
  sy+=.075*impact-.018*recover;sx+=.095*impact;tilt=dir*.10*impact;hitPose=u<.84;
 }else if(state==='recover'||state==='stagger'){
  const u=v41a01(q/(state==='stagger'?1.26:Math.max(.18,d.boss?.85:t.cd*.9))),rest=1-v41aSmooth(u);
  sy-=rest*(state==='stagger'?.15:.055);sx+=.045*rest;tilt=-dir*rest*(state==='stagger'?.145:.040);xx-=Math.cos(ang)*rest*(state==='stagger'?6:2);
 }else if(state==='dodge'){
  const u=v41a01(q/.26),f=Math.sin(Math.PI*u);sy-=f*.13;sx+=f*.10;tilt=-dir*f*.12;yy-=f*3;
 }else if(stride>.03){
  const lift=(1-Math.cos(phi*2))*.5;sy+=wave*(d.boss?.012:d.quad?.028:.017)*stride;
  if(!d.ghost)yy-=lift*(d.quad?2.7:d.serpent?.7:d.boss?1.2:1.6)*stride;
  tilt+=wave*(d.serpent?.020:d.quad?.040:.027)*stride;
  if(d.serpent)sx+=Math.sin(phi)*.026*stride;
 }
 const r=V26.reactions.get(e);if(r){const u=v41a01((V26.clock-r.at)/r.dur),k=Math.sin(Math.PI*u)*(r.heavy?10:5)*(d.boss?.32:1);xx+=Math.cos(r.a)*k;yy+=Math.sin(r.a)*k*proj;sy-=.045*k/10;sx+=.035*k/10;tilt-=dir*k*.012;}
 if(e.flash>0)alpha=.76+.24*v41a01(1-e.flash/.12);
 return {xx,yy,sx,sy,tilt,hitPose,alpha,face:dir};
}
const v41aPrevMob=v25MonsterBody;
v25MonsterBody=function(e,z,world){
 const a=imgs['v25mob'+e.type],base=a?.img;if(!a?.ready||!base?.naturalWidth)return v41aPrevMob(e,z,world);
 const d=v41aProfile(e),t=d.t,h=d.boss?Math.min(163,t.scale*.68):Math.min(103,t.scale*.66),m=v41aMob(e),pose=v41aMobPose(e,m,d,world);
 const hit=imgs['v25mobHit'+e.type],im=pose.hitPose&&hit?.ready?hit.img:base,sw=h*im.naturalWidth/base.naturalHeight,sh=h*im.naturalHeight/base.naturalHeight;
 v41aGroundShadow(z.x,z.y+(d.ghost?3:1),t.r*.92,t.r*.34,d.ghost?.55:1);
 g.save();g.translate(z.x+pose.xx,z.y+pose.yy);g.scale(pose.face*pose.sx,pose.sy);g.rotate(pose.tilt);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.globalAlpha*=pose.alpha;g.drawImage(im,-sw/2,-sh,sw,sh);g.restore();
 if(e.burn>0)circle(z.x,z.y-17,8,'#f59a57','',.35);
 const labelY=z.y-h-10,bw=d.boss?112:48;if(!d.boss)bar(z.x-bw/2,labelY,bw,4,e.hp/e.max,'#a86453','');else text('✦',z.x,labelY-8,13,C.gold,'center','bold');
 if(world&&dist(e,p)<=550){const r=v22Region(e),lv=v22EnemyLevel(e),col=lv>p.level+4?'#ff9992':lv<p.level-5?'#a2b8a6':r.color;g.save();g.shadowColor='#081116';g.shadowBlur=4;text((d.boss?t.name+' · ':'')+'Lv '+lv,z.x,labelY-(d.boss?22:10),12,col,'center','bold');g.restore();}return true;
};

// A short anchored collapse after actual defeat, with subtle spirit fragments.
// Death silhouettes are purely visual and never added to enemies, loot, or save.
function v41aDeath(e){if(!e||!e.dead||V41A.dead.has(e)||!TYPES[e.type])return;V41A.dead.add(e);V41A.corpses.push({x:e.x,y:e.y,type:e.type,face:e.dir<0?-1:1,at:V41A.clock,duration:bossType(e.type)?1.0:.65});if(V41A.corpses.length>40)V41A.corpses.shift();}
const v41aPrevHit=hit;hit=function(e,...args){if(p&&mode==='play')v41aEnsure();if(!e?.dead){const r=v41aPrevHit(e,...args);if(e?.dead)v41aDeath(e);return r;}return v41aPrevHit(e,...args);};
function v41aCorpses(v,world){for(const c of V41A.corpses){const u=v41a01((V41A.clock-c.at)/c.duration),a=imgs['v25mob'+c.type],t=TYPES[c.type];if(!a?.ready||!a.img.naturalWidth||u>=1)continue;const z=world?hdPoint(c.x,c.y,v):c;if(z.x< -160||z.x>W+160||z.y< -200||z.y>H+80)continue;
 const fall=v41aSmooth(u/.63),fade=1-v41aSmooth((u-.28)/.72),h=bossType(c.type)?Math.min(163,t.scale*.68):Math.min(103,t.scale*.66),w=h*a.img.naturalWidth/a.img.naturalHeight;
 g.save();g.globalAlpha*=fade*.83;v41aGroundShadow(z.x,z.y,t.r*(.85+fall*.18),t.r*.30,fade);g.translate(z.x,z.y);g.scale(c.face*(1+fall*.21),1-fall*.74);g.rotate(-c.face*fall*.36);g.drawImage(a.img,-w/2,-h,w,h);g.restore();
 g.save();g.globalAlpha=fade*.54;g.fillStyle=t.color||'#c8ecd7';for(let i=0;i<7;i++){const f=(i*2.399+c.type),r=(8+u*23)*(.65+i%3*.17);g.beginPath();g.ellipse(z.x+Math.cos(f)*r,z.y-9-u*(16+i*4)+Math.sin(f)*r*.4,1+.6*(1-u),1,0,0,TAU);g.fill();}g.restore();
 }}
const v41aPrevHDfx=hdEffects,v41aPrevFX=renderEffects;
function v41aWithDeath(fn){const all=V26.fx;if(!all.some(f=>f.kind==='death'))return fn();V26.fx=all.filter(f=>f.kind!=='death'||!V41A.corpses.some(c=>c.type===f.type&&Math.hypot(c.x-f.x,c.y-f.y)<20));try{return fn();}finally{V26.fx=all;}}
hdEffects=function(v){v41aCorpses(v,true);return v41aWithDeath(()=>v41aPrevHDfx(v));};
renderEffects=function(){v41aCorpses(null,false);return v41aWithDeath(v41aPrevFX);};

const v41aPrevUpdate=update;
update=function(dt){
 if(!p||mode!=='play')return v41aPrevUpdate(dt);v41aEnsure();const owner=p,scope=V41A.scope,pos=v41aPosition(),x=pos.x,y=pos.y,wasDash=p.dashT>0;
 // Capped delta protects the render state from a suspended tab. Game dt is
 // deliberately passed through unchanged to the existing update chain.
 const step=Math.min(.10,Math.max(0,dt));V41A.clock+=step;
 const before=modal?[]:enemies.filter(e=>!e.dead);const r=v41aPrevUpdate(dt);
 if(p!==owner||mode!=='play'||v41aScope()!==scope){if(p)v41aReset();return r;}
 const now=v41aPosition(),move=Math.hypot(now.x-x,now.y-y);if(move>180){v41aReset();return r;}
 const m=V41A.hero,canStride=!wasDash&&p.dashT<=0&&p.attackT<=0&&p.castT<=0&&!modal;
 if(V41A.clock-V41A.paceAt>.25){V41A.pace=currentStats().speed||230;V41A.paceAt=V41A.clock;}const pace=v36Inside()?175:V41A.pace;
 v41aMotion(m,now.x-x,now.y-y,step,!!p.worldMode&&!v36Inside(),V8.dir??m.dir,pace,canStride);
 for(const e of before)if(e.dead)v41aDeath(e);V41A.corpses=V41A.corpses.filter(c=>V41A.clock-c.at<c.duration);
 // NPC render records are transient; old off-screen records are pruned.
 if(V41A.npcs.size>120)for(const [k,n] of V41A.npcs)if(V41A.clock-n.at>30)V41A.npcs.delete(k);
 return r;
};


// integrated: v41_combat.js
