'use strict';
// V27's warning path is also used by challenges and heavenly lightning. Keep
// exactly the original coordinate transform and geometry, including safe ring.
// Amber border = guard-break; coral = danger; purple trial warnings remain.
v27Zone=function(d,z,col,q,world,impact=false){
  if(!d||!z||!Number.isFinite(d.reach)||d.reach<=0)return;q=v41c01(q);
  g.save();g.translate(z.x,z.y);g.scale(1,world?HD.tilt:1);g.rotate(d.angle||0);
  const r=d.reach,span=d.shape==='sector'||d.shape==='fan'?2*d.arc:TAU,start=d.shape==='sector'||d.shape==='fan'?-d.arc:0;
  if(impact){
    v27Path(d);g.fillStyle=col;g.globalAlpha=.15*(1-q);g.fill('evenodd');
    g.globalAlpha=.66*(1-q);g.strokeStyle=col;g.lineWidth=3;g.stroke();g.globalAlpha=.78*(1-q);g.strokeStyle='#fff2da';g.lineWidth=1;g.stroke();
    g.restore();return;
  }
  // Fill + clipped directional hatching guides the player without obscuring
  // terrain or entities; the border stays bright against both dark and light maps.
  v27Path(d);g.globalAlpha=.10+.10*q;g.fillStyle=col;g.fill('evenodd');
  g.save();g.clip('evenodd');g.globalAlpha=.14+.10*q;g.strokeStyle=col;g.lineWidth=1.5;
  for(let i=-r*2,step=Math.max(26,r/9);i<r*2;i+=step){g.beginPath();g.moveTo(i,-r);g.lineTo(i+r*2,r);g.stroke();}
  g.globalAlpha=.16;g.fillStyle=col;if(d.shape==='line')g.fillRect(0,-d.width,r*q,d.width*2);else{g.beginPath();g.moveTo(0,0);g.arc(0,0,r,start,start+span*q);g.closePath();g.fill();}
  g.restore();
  v27Path(d);g.globalAlpha=.93;g.strokeStyle='#38292b';g.lineWidth=4.5;g.stroke();
  g.globalAlpha=.93;g.strokeStyle=col;g.lineWidth=2;g.stroke();
  // Segmented time bar attached to boundary and contrasting inner ring.
  g.globalAlpha=.97;g.strokeStyle='#fff3ce';g.lineWidth=2.6;g.lineCap='round';g.beginPath();
  if(d.shape==='line'){g.moveTo(0,-d.width);g.lineTo(r*q,-d.width);g.moveTo(0,d.width);g.lineTo(r*q,d.width);}
  else{g.arc(0,0,r,start,start+span*q);if(d.shape==='ring'){g.moveTo(d.inner,0);g.arc(0,0,d.inner,0,TAU*q);}}g.stroke();
  if(d.shape==='target'||d.shape==='circle'){
    g.globalAlpha=.50;g.strokeStyle='#ffefd7';g.lineWidth=1.2;for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])v41cLine(Math.cos(a)*r*.84,Math.sin(a)*r*.84,Math.cos(a)*r*.97,Math.sin(a)*r*.97,'#ffefd7',1.2);
  }g.restore();
};
const v41cBossOld=v27Render;
v27Render=function(v){
  v41cBossOld(v);if(!p||mode!=='play')return;
  const world=!!p.worldMode,ratio=world?HD.tilt:.65,point=e=>world?hdPoint(e.x,e.y,v):e;
  // Phase transformation aura is grounded and localized: no whole-screen red
  // flash, no active effect during ordinary phase-I patrol.
  for(const e of enemies){if(e.dead||dist(e,p)>580)continue;const a=V27.ai.get(e);if(!a||a.role!=='boss'||a.phase<2)continue;
    const z=point(e),r=(TYPES[e.type].r||24)+13,c=a.phase===3?'#ffa568':'#d9ca92',t=V27.clock*1.6;
    g.save();g.translate(z.x,z.y);g.globalAlpha=a.mode==='rage'?.85:.48;
    if(a.mode==='rage'){const q=v41c01(a.t/.85);v41cGlow(0,-10,r*(1+q*1.2),ratio,c,.25*(1-q));v41cRing(r*(1+q*.95),ratio,c,2.6);v41cRing(r*(.81+q*.95),ratio,'#fff0da',1.1);}
    else{v41cRing(r,ratio,c,1.6,t,t+Math.PI*.73);v41cRing(r,ratio,c,1.6,t+Math.PI,t+Math.PI*1.73);}
    for(let i=0;i<(a.phase===3?5:3);i++){const phi=t+i*TAU/5,rr=r*.84;v41cDiamond(Math.cos(phi)*rr,Math.sin(phi)*rr*ratio,2.8,c,phi);}g.restore();
  }
  // Element-specific boss impact silhouettes after the danger marker resolves.
  // Render at most 8 newest events so crowded encounters remain bounded.
  const saved=V41_COMBAT.budget;V41_COMBAT.budget=32;
  for(const f of V27.fx.slice(-8)){if(f.kind!=='strike')continue;const d=f.attack;const q=v41c01((V27.clock-f.at)/f.life),z=point(f),rr=d.reach,c=f.col;
    g.save();g.translate(z.x,z.y);g.globalAlpha=(1-q)**.9;
    if(d.id==='lightning'){v41cLightning(0,140,19,c,'#fff4d7',(1-q));v41cRing(rr*(.31+.69*q),ratio,c,2);}
    else if(d.id==='ice'){for(let i=0;i<9;i++){const a=i*TAU/9;v41cCrystal(Math.cos(a)*rr*.61,Math.sin(a)*rr*.61*ratio,36*(1-q*.42),a*.23,'#b9efff','#f7ffff');}}
    else if(d.id==='fire'){g.scale(1,ratio);g.rotate(d.angle);v41cRibbon(rr*(.67+.32*q),-d.arc,d.arc,32,'#ffbe78','#fff0c5',.80);v41cParticles(q,rr,'#ffad69',0,9,d.arc*2,.85,6);}
    else if(['ring','burst','crush'].includes(d.id)){g.scale(1,ratio);v41cRing(rr*(.26+.74*q),1,c,3.2);if(d.id==='crush')v41cStoneCracks(rr,q,c);}
    else if(d.id==='poison'){v41cGlow(0,0,rr,ratio,'#9dc58c',.25*(1-q));v41cParticles(q,rr*.8,'#b9d5a2',0,10,TAU,ratio,8,true);}
    g.restore();
  }V41_COMBAT.budget=saved;
};


// integrated: v41_audio.js
// V41 — original procedural audio soundscape. No media download or account required.
const V41AudioState={ctx:null,master:null,music:null,sfx:null,noise:null,enabled:true,next:0,voices:0,events:new Map(),index:0,state:'',lastFoot:0,wasMoving:false};
try{V41AudioState.enabled=localStorage.getItem('v41-audio')!=='0';}catch(_){}
function v41AudioEnabled(){return V41AudioState.enabled;}
function v41AudioWake(){
 if(!V41AudioState.enabled)return false;
 if(!V41AudioState.ctx){const AC=typeof window!=='undefined'&&(window.AudioContext||window.webkitAudioContext);if(!AC)return false;try{
  const c=V41AudioState.ctx=new AC(),m=V41AudioState.master=c.createGain();m.gain.value=.47;
  const limiter=c.createDynamicsCompressor();limiter.threshold.value=-16;limiter.ratio.value=6;limiter.attack.value=.005;limiter.release.value=.15;m.connect(limiter);limiter.connect(c.destination);
  V41AudioState.music=c.createGain();V41AudioState.music.gain.value=.43;V41AudioState.music.connect(m);V41AudioState.sfx=c.createGain();V41AudioState.sfx.gain.value=.76;V41AudioState.sfx.connect(m);
  let b=c.createBuffer(1,Math.floor(c.sampleRate*.7),c.sampleRate),a=b.getChannelData(0);let n=0;for(let i=0;i<a.length;i++){n=.72*n+.28*(Math.random()*2-1);a[i]=n;}V41AudioState.noise=b;
 }catch(e){V41AudioState.ctx=null;return false;}}
 if(V41AudioState.ctx.state==='suspended')V41AudioState.ctx.resume().catch(()=>{});return true;
}
function v41AudioToggle(){V41AudioState.enabled=!V41AudioState.enabled;try{localStorage.setItem('v41-audio',V41AudioState.enabled?'1':'0');}catch(_){}if(V41AudioState.enabled)v41AudioWake();if(V41AudioState.master)V41AudioState.master.gain.setTargetAtTime(V41AudioState.enabled?.47:0,V41AudioState.ctx.currentTime,.06);if(typeof message==='function')message(V41AudioState.enabled?'Âm thanh đã bật':'Âm thanh đã tắt');return V41AudioState.enabled;}
if(typeof document!=='undefined'&&document.addEventListener){document.addEventListener('pointerdown',v41AudioWake,{passive:true});document.addEventListener('keydown',e=>{v41AudioWake();if(e.altKey&&e.code==='KeyM'){e.preventDefault();e.stopPropagation();v41AudioToggle();}},{capture:true});document.addEventListener('visibilitychange',()=>{if(document.hidden&&V41AudioState.ctx)V41AudioState.ctx.suspend().catch(()=>{});});}
function v41Tone(freq,duration,volume=.075,kind='sine',end=freq,offset=0,music=false){const c=V41AudioState.ctx;if(!V41AudioState.enabled||!c||c.state!=='running'||V41AudioState.voices>=22)return;try{const t=c.currentTime+offset,o=c.createOscillator(),v=c.createGain();o.type=kind;o.frequency.setValueAtTime(Math.max(22,freq),t);o.frequency.exponentialRampToValueAtTime(Math.max(22,end),t+duration);v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+Math.min(.045,duration*.22));v.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(v);v.connect(music?V41AudioState.music:V41AudioState.sfx);V41AudioState.voices++;o.onended=()=>{V41AudioState.voices--;o.disconnect();v.disconnect();};o.start(t);o.stop(t+duration+.025);}catch(_){} }
function v41Noise(dur,vol,low=200,high=1800,offset=0){const c=V41AudioState.ctx;if(!V41AudioState.enabled||!c||c.state!=='running'||V41AudioState.voices>=20||!V41AudioState.noise)return;try{const t=c.currentTime+offset,n=c.createBufferSource(),f=c.createBiquadFilter(),v=c.createGain();n.buffer=V41AudioState.noise;f.type='bandpass';f.Q.value=.75;f.frequency.setValueAtTime(high,t);f.frequency.exponentialRampToValueAtTime(low,t+dur);v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(vol,t+.009);v.gain.exponentialRampToValueAtTime(.0001,t+dur);n.connect(f);f.connect(v);v.connect(V41AudioState.sfx);V41AudioState.voices++;n.onended=()=>{V41AudioState.voices--;n.disconnect();f.disconnect();v.disconnect();};n.start(t);n.stop(t+dur+.01);}catch(_){} }
function v41Sound(name,cls=0,heavy=false){const c=V41AudioState.ctx;if(!V41AudioState.enabled||!c||c.state!=='running')return;let now=c.currentTime,last=V41AudioState.events.get(name)??-100;if(now-last<(name==='impact'?.055:name==='foot'?.15:.09))return;V41AudioState.events.set(name,now);switch(name){
 case'strike':v41Noise(.22,.17,380,cls===1?1000:4200);v41Tone(cls===1?135:cls===2?620:360,.2,.065,cls===1?'triangle':'sine',cls===1?65:180);break;
 case'impact':v41Noise(heavy?.21:.12,heavy?.29:.13,160,heavy?2500:1300);v41Tone(heavy?120:165,.13,heavy?.12:.06,'triangle',44);break;
 case'release':v41Noise(.43,.11,600,5400);[293.66,440,587.33].forEach((f,i)=>v41Tone(f*(cls===2?1.5:1),.56,.055,'sine',f*.75,i*.04));break;
 case'dash':v41Noise(.22,.14,350,3100);break;
 case'death':v41Tone(165,.24,.055,'triangle',46);break;
 case'loot':v41Tone(660,.22,.08,'sine');v41Tone(990,.32,.055,'sine',990,.07);break;
 case'gear':v41Tone(392,.38,.06,'triangle');v41Tone(587.33,.51,.075,'sine',587.33,.08);v41Tone(784,.62,.05,'sine',784,.16);break;
 case'door':v41Noise(.25,.045,110,750);v41Tone(440,.28,.055,'sine');v41Tone(587.33,.42,.045,'sine',587.33,.08);break;
 case'heal':v41Tone(293.66,.35,.06);v41Tone(440,.44,.07,'sine',440,.12);v41Tone(523,.42,.055,'sine',523,.18);break;
 case'foot':v41Noise(.075,.045,230,730);break;
 case'hurt':v41Noise(.19,.2,180,900);v41Tone(100,.2,.065,'triangle',40);break;
 case'click':v41Tone(880,.065,.034,'sine',620);break;
 }}
const v41AudioOldAdd=v26Add;v26Add=function(kind,x,y,color,dur,more={}){const r=v41AudioOldAdd(kind,x,y,color,dur,more);if(['strike','impact','release','dash','death'].includes(kind))v41Sound(kind,p?.cls??0,!!more.heavy);return r;};
const v41AudioOldEnter=v36Enter;v36Enter=function(r){const ok=v41AudioOldEnter(r);if(ok)v41Sound('door');return ok;};
const v41AudioOldLeave=v36Leave;v36Leave=function(){const inside=v36Inside();const r=v41AudioOldLeave();if(inside&&!v36Inside())v41Sound('door');return r;};
const v41AudioOldPick=v21Pick;v21Pick=function(a,quiet=false){const ok=v41AudioOldPick(a,quiet);if(ok)v41Sound(a.kind==='gear'?'gear':'loot');return ok;};
const v41AudioOldHeal=heal;heal=function(){const hp=p?.hp??0,r=v41AudioOldHeal();if((p?.hp??0)>hp)v41Sound('heal');return r;};
const v41AudioOldDamage=damagePlayer;damagePlayer=function(n){const owner=p,hp=p?.hp,r=v41AudioOldDamage(n);if(p===owner&&p&&p.hp<hp)v41Sound('hurt');return r;};
function v41AudioAmbience(){const c=V41AudioState.ctx;if(!V41AudioState.enabled||!c||c.state!=='running')return;const t=c.currentTime,inside=mode==='play'&&p?.worldMode&&v36Inside(),near=mode==='play'&&p&&!modal&&enemies.some(e=>!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<200),state=mode==='menu'?'menu':near?'danger':inside?'interior':'wild';if(V41AudioState.state!==state){V41AudioState.state=state;V41AudioState.next=Math.min(V41AudioState.next,t+.2);V41AudioState.index=0;}if(t<V41AudioState.next)return;
 // Quiet original five-note soundscape: plucked harmonics and spacious chimes.
 const scale=[146.83,174.61,196,220,261.63,293.66,349.23,392],phrase=[0,4,2,6,1,5,3,7,2,4,0,5],i=V41AudioState.index++,f=scale[phrase[i%phrase.length]];let v=state==='danger'?.034:.045;
 v41Tone(f*(state==='danger'?.5:1),state==='danger'?1.4:2.8,v,'sine',f*(state==='danger'?.5:1),0,true);v41Tone(f*2,1.4,v*.52,'sine',f*2,.018,true);if(i%3===0)v41Tone(scale[(phrase[i%phrase.length]+2)%scale.length]*2,2.6,.023,'triangle',scale[(phrase[i%phrase.length]+2)%scale.length]*2,.55,true);
 V41AudioState.next=t+(state==='danger'?1.7:state==='interior'?3.6:4.3)+(i%3)*.23;
}
const v41AudioOldUpdate=update;update=function(dt){const old=p,position=p&&{x:p.v36Inside?.x??p.x,y:p.v36Inside?.y??p.y};const r=v41AudioOldUpdate(dt);if(V41AudioState.ctx&&V41AudioState.enabled&&p&&old===p&&position&&mode==='play'&&!modal){const dx=(p.v36Inside?.x??p.x)-position.x,dy=(p.v36Inside?.y??p.y)-position.y;if(Math.hypot(dx,dy)>.15&&Math.hypot(dx,dy)<20&&p.dashT<=0){V41AudioState.lastFoot+=dt;if(V41AudioState.lastFoot>.30){v41Sound('foot');V41AudioState.lastFoot=0;}}else V41AudioState.lastFoot=Math.min(V41AudioState.lastFoot,.19);}v41AudioAmbience();return r;};


// integrated: v41_hud.js
// V41 · Thiên Bàn: classic RPG interface, real-time combat information and accessible modular HUD.
// This module is intentionally append-only: V35 owns persisted configuration and input transforms.
const V41HUD={
  version:1, gold:'#d2b67f', goldSoft:'#97835d', ivory:'#f6edda',
  faint:'#c2beaa', jade:'#a8d0b4', red:'#f17a64', blue:'#76bfd2',
  muted:'#b4b8a7', dark:'#121c1a', line:'#746d53', last:new WeakMap()
};
Object.assign(H35,{gold:V41HUD.gold,gold2:V41HUD.goldSoft,ink:V41HUD.dark,jade:V41HUD.jade,paper:V41HUD.ivory,muted:V41HUD.muted,edge:V41HUD.line});
Object.assign(H33,{gold:V41HUD.gold,bright:V41HUD.ivory,jade:V41HUD.jade,muted:V41HUD.muted,edge:V41HUD.line,ink:V41HUD.dark});
const V41HUD_BASE={
  identity:{x:12,y:12,w:292,h:152},map:{x:1064,y:12,w:204,h:212},
  quest:{x:1012,y:232,w:256,h:88},target:{x:404,y:12,w:472,h:83},
  dock:{x:394,y:602,w:492,h:113},left:{x:12,y:658,w:216,h:52},
  nav:{x:935,y:658,w:333,h:52},feed:{x:12,y:520,w:286,h:119}
};
for(const [k,b] of Object.entries(V41HUD_BASE))Object.assign(V35_GROUPS[k],b);
const V41HUD_LEGACY={
  identity:[.84,0,0,.91],map:[.78,45,0,.94],quest:[.78,56,-45,.81],target:[.87,33,0,.95],
  dock:[.78,72,24,1],left:[.78,0,14,.92],nav:[.78,60,14,.92],feed:[.85,0,40,.75]
};


const v41HUDGroupOld=v35Group;
v35Group=function(k,fn){
  // In an instance the "map" card shows objective/tribulation progress, so it is essential.
  // Do not mutate the saved exploration layout or user-selected minimal profile.
  if(k==='map'&&p&&!p.worldMode&&!v35Editing()){
    const s=v35State().groups.map,was=s.hidden;
    try{s.hidden=false;return v41HUDGroupOld(k,fn);}finally{s.hidden=was;}
  }
  return v41HUDGroupOld(k,fn);
};
function v41HUDRound(x,y,w,h,cut=5){
  cut=Math.min(cut,h*.25,w*.2);g.beginPath();g.moveTo(x+cut,y);g.lineTo(x+w-cut,y);g.lineTo(x+w,y+cut);
  g.lineTo(x+w,y+h-cut);g.lineTo(x+w-cut,y+h);g.lineTo(x+cut,y+h);g.lineTo(x,y+h-cut);g.lineTo(x,y+cut);g.closePath();
}
function v41HUDCorner(x,y,sx,sy,col,size=11){
  g.save();g.translate(x,y);g.scale(sx,sy);g.strokeStyle=col;g.lineWidth=1;
  g.beginPath();g.moveTo(0,size);g.lineTo(0,0);g.lineTo(size,0);g.stroke();
  g.beginPath();g.moveTo(3,8);g.lineTo(3,3);g.lineTo(8,3);g.stroke();g.restore();
}
v35Plate=function(x,y,w,h,edge=H35.edge,active=false){
  g.save();const gr=g.createLinearGradient(x,y,x,y+h);
  gr.addColorStop(0,active?'#3f4c3df5':'#253129f5');gr.addColorStop(.52,active?'#22372dec':'#18221eea');gr.addColorStop(1,'#101817f6');
  v41HUDRound(x+.5,y+.5,w-1,h-1,6);g.fillStyle=gr;g.fill();g.strokeStyle=edge;g.lineWidth=1;g.stroke();
  if(w>=48&&h>=28){
    v41HUDRound(x+3,y+3,w-6,h-6,4);g.lineWidth=.7;g.strokeStyle='#c6bc7e39';g.stroke();
    if(w>105&&h>45){
      v41HUDCorner(x+4,y+4,1,1,H35.gold2);v41HUDCorner(x+w-4,y+4,-1,1,H35.gold2);
      v41HUDCorner(x+4,y+h-4,1,-1,H35.gold2);v41HUDCorner(x+w-4,y+h-4,-1,-1,H35.gold2);
    }
  }
  g.restore();
};
v33Box=(x,y,w,h,edge=H33.edge,active=false)=>v35Plate(x,y,w,h,edge,active);
v33Button=function(x,y,w,h,label,fn,active=false,edge=H33.edge,id=label){
  const over=v33Over(x,y,w,h);v35Plate(x,y,w,h,over?H35.paper:active?H35.gold:edge,active||over);
  v33Fit(label,x+w/2,y+h/2,w-9,h>25?12:10,active||over?H35.paper:H35.muted,'center','bold');
  buttons.push({x,y,w,h,fn,v33:id});
};
function v41HUDLine(x,y,w,color='#b9a47650'){
  g.save();g.strokeStyle=color;g.lineWidth=1;g.beginPath();g.moveTo(x,y+.5);g.lineTo(x+w,y+.5);g.stroke();g.restore();
}
const V46_HUDBAR_CACHE=new Map();
function v41HUDBar(x,y,w,h,val,max,col,caption='',warn=false){
  const f=clamp(Number(val)/Math.max(1,Number(max))||0,0,1),fill=Math.round((w-4)*f);
  g.save();g.fillStyle='#09100f';g.fillRect(x,y,w,h);g.strokeStyle=warn?V41HUD.red:'#a9986e79';g.strokeRect(x+.5,y+.5,w-1,h-1);
  if(fill>0){const _hk=x+'|'+y+'|'+h+'|'+col+'|'+(warn?1:0);let gr=V46_HUDBAR_CACHE.get(_hk);if(!gr){gr=g.createLinearGradient(x,y,x,y+h);gr.addColorStop(0,col);gr.addColorStop(.48,col);gr.addColorStop(1,warn?'#9a4539':'#273126');V46_HUDBAR_CACHE.set(_hk,gr);}
    g.fillStyle=gr;g.fillRect(x+2,y+2,fill,h-4);g.fillStyle='#f4eed929';g.fillRect(x+2,y+2,fill,1);
    if(fill>1){g.fillStyle='#fff5cf6e';g.fillRect(x+1+fill,y+2,1,h-4);}
  }
  if(caption){g.shadowColor='#081010';g.shadowBlur=3;v33Fit(caption,x+w/2,y+h/2,w-12,11,H35.paper,'center','bold');}
  g.restore();
}
function v41HUDPercent(val,max){return Math.round(clamp(val/Math.max(1,max),0,1)*100);}
function v41HUDNum(n){n=Math.ceil(n||0);return n>=1000000?(n/1000000).toFixed(1)+'tr':n>=10000?(n/1000).toFixed(1)+'k':String(n);}
function v41HUDTag(x,y,w,label,col,active=false){
  v35Plate(x,y,w,21,col,active);v33Fit(label,x+w/2,y+10.5,w-8,11,col,'center','bold');
}
const V46_PORTRAIT_CACHE=new Map();
function v41HUDClassPortrait(cls,x,y,r,col){
  const art=imgs.v25idle;
  if(!art?.ready||!art.img.naturalWidth){v34Portrait('idle9',x,y,r,col);return;}
  const _pk=cls+'|'+r+'|'+col;let c=V46_PORTRAIT_CACHE.get(_pk);
  if(!c){c=document.createElement('canvas');c.width=c.height=r*2+2;const d=c.getContext('2d'),im=art.img,sw=im.naturalWidth/4,sh=im.naturalHeight/3,cx=r+1,cy=r+1;
  d.beginPath();d.arc(cx,cy,r,0,TAU);d.fillStyle='#182a25';d.fill();d.strokeStyle=col;d.lineWidth=2;d.stroke();
  d.save();d.beginPath();d.arc(cx,cy,r-1,0,TAU);d.clip();
  const light=d.createRadialGradient(cx-r*.15,cy-r*.25,0,cx,cy,r);light.addColorStop(0,'#a9b59b');light.addColorStop(.45,'#557b68');light.addColorStop(1,'#16241e');
  d.fillStyle=light;d.fillRect(cx-r,cy-r,r*2,r*2);
  d.imageSmoothingEnabled=true;d.imageSmoothingQuality='high';
  d.drawImage(im,sw*.25,sh*(cls+.075),sw*.56,sh*.56,cx-r,cy-r,r*2,r*2);
  d.restore();d.beginPath();d.arc(cx,cy,r,0,TAU);d.strokeStyle=col;d.lineWidth=2;d.stroke();
  V46_PORTRAIT_CACHE.set(_pk,c);}
  g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(c,x-r-1,y-r-1);
}





function v41HUDResources(s,x,y,w){
  const half=(w-10)/2,low=p.hp/s.hp<.26;
  text('SINH MỆNH',x,y-8,10,low?V41HUD.red:H35.paper,'left','bold');
  text('LINH LỰC',x+half+10,y-8,10,H35.paper,'left','bold');
  v41HUDBar(x,y,half,17,p.hp,s.hp,'#d66d55',Math.ceil(p.hp)+' / '+Math.ceil(s.hp),low);
  v41HUDBar(x+half+10,y,half,17,p.mp,s.mp,'#5daec5',Math.floor(p.mp)+' / '+Math.ceil(s.mp));
}

v35Control=function(x,y,w,kind,key,label,fn,active=false){
  const over=v33Over(x,y,w,52),col=active?H35.jade:over?H35.paper:H35.gold;
  v35Plate(x,y,w,52,over?H35.paper:active?H35.jade:H35.edge,active||over);
  v35Icon(kind,x+w/2,y+18,14,col);
  text(key,x+w/2,y+42,11,over||active?H35.paper:H35.muted,'center','bold');
  if(active)circle(x+w-7,y+7,3,'#9ed9b2');
  buttons.push({x,y,w,h:52,fn,v35:key});
  if(over&&!v35Editing()){
    const tw=clamp(label.length*7+23,125,300),tx=clamp(x+w/2-tw/2,4,W-tw-4);
    v35Plate(tx,y-33,tw,27,H35.gold);v33Fit(label,tx+tw/2,y-19,tw-16,12,H35.paper,'center','bold');
  }
};

const v41HUDIconOld=v35Icon;
v35Icon=function(kind,x,y,r,col){
  if(kind!=='audio'&&kind!=='mute')return v41HUDIconOld(kind,x,y,r,col);
  g.save();g.translate(x,y);g.scale(r/16,r/16);g.strokeStyle=col;g.lineWidth=1.8;g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.moveTo(-11,-4);g.lineTo(-5,-4);g.lineTo(2,-10);g.lineTo(2,10);g.lineTo(-5,4);g.lineTo(-11,4);g.closePath();g.stroke();
  g.beginPath();if(kind==='audio'){g.arc(1,0,8,-.74,.74);g.stroke();g.beginPath();g.arc(1,0,13,-.65,.65);}
  else{g.moveTo(7,-4);g.lineTo(13,4);g.moveTo(13,-4);g.lineTo(7,4);}g.stroke();g.restore();
};


v35Notifications=function(hasTarget){
  if(notifyT>0||v21NoticeT>0){const msg=v21NoticeT>0?v21Notice:notify,y=hasTarget?103:16;
    v35Plate(421,y,438,30,H35.gold);diamond(g,434,y+15,4,H35.gold);v33Fit(msg,640,y+15,410,12,H35.paper,'center','bold');
  }
  if(p.worldMode&&owTitle>0){g.save();g.globalAlpha=clamp(owTitle/.6,0,1)*clamp((3-owTitle)/.4,0,1);
    v18Title((REG[p.mapId]||REG.thon).name.toUpperCase(),640,155,23,H35.paper,'center');g.restore();}
  const o=p.worldMode?owNearest():null;
  if(o&&!V26.action&&!V26.stage&&!V26.hits){
    const label=o.name,w=Math.min(340,Math.max(175,label.length*7+56)),x=640-w/2,y=565;
    v35Plate(x,y,w,29,H35.gold);v41HUDTag(x+5,y+4,23,'E',H35.gold,true);
    v33Fit(label,x+35,y+14.5,w-43,12,H35.paper,'left','bold');
    buttons.push({x,y,w,h:29,fn:()=>v8InteractAt(o),v35:'interact'});
  }
};
// Full feature directory, organized by player intent rather than a dozen persistent icons.
v33Drawer=function(){
  if(!V33.menu)return;
  const x=12,y=315,w=319,h=331,world=p.worldMode,grp=clamp(V33.group,0,2);V33.group=grp;
  v35Plate(x,y,w,h,H35.gold);v33Shield(x,y,w,h);
  v35Icon('menu',x+17,y+20,10,H35.gold);
  text('ĐẠO ĐỒ',x+35,y+19,15,H35.gold,'left','bold');
  text('CHỨC NĂNG',x+w-12,y+19,10,H35.muted,'right','bold');
  ['Nhân vật','Đạo nghiệp','Thế giới'].forEach((t,i)=>v33Button(x+10+i*100,y+34,96,30,t,()=>{V33.group=i;},grp===i,H35.gold2,'tab'+i));
  const close=fn=>()=>{V33.menu=false;fn();};
  const pages=[
    [['bag','C','Hồ sơ nhân vật',v10Open,true,'+'+v10Points()+' điểm'],['book','T','Công pháp',v11Open,true,'+'+v11SkillPoints()+' điểm'],
     ['bag','I / G','Hành trang',()=>openPanel('gear'),true,p.gear.length+'/48'],['loot','R','Dung hợp',()=>fusion(),true,''],
     ['sect','B','Đột phá cảnh giới',v22Break,true,realm()]],
    [['sect','N','Tông môn & đạo nghiệp',()=>v31Open(),world,''],['sword','L','Giang hồ',()=>v14Open(),world,''],
     ['scroll','J','Sinh hoạt / chế tạo',()=>v13Open(),world,''],['loot','P','Thiên Công Phường',()=>v30ForgeOpen(),v30ForgeAllowed(),''],
     ['sect','N','Linh thú · Động phủ',()=>v31Open(3),world,'']],
    [['scroll','Q','Nhật ký nhiệm vụ',v12Open,true,''],['map','M','Bản đồ',()=>openPanel('map'),true,''],
     ['sword','BOSS','Boss thế giới · Thiên Kiếp',()=>{modal={kind:'v29world'};},world,''],['settings','ESC','Cài đặt',()=>openPanel('settings'),true,''],
     ['hud','F2','Tùy chỉnh HUD',v35Open,true,'']]
  ];
  pages[grp].forEach(([icon,key,label,fn,enabled,detail],i)=>{
    const rx=x+10,ry=y+75+i*43,rw=w-20,rh=37,over=v33Over(rx,ry,rw,rh),edge=over?H35.paper:'#88795b';
    v35Plate(rx,ry,rw,rh,enabled?edge:'#4b534a',over&&enabled);
    const col=enabled?H35.gold:H35.edge;
    v35Icon(icon,rx+19,ry+18.5,12,col);
    v33Fit(label,rx+38,ry+(detail?12:18),rw-103,12,enabled?H35.paper:H35.muted,'left','bold');
    if(detail)v33Fit(detail,rx+38,ry+27,rw-103,10,H35.jade);
    v41HUDTag(rx+rw-55,ry+8,47,key,col,over&&enabled);
    buttons.push({x:rx,y:ry,w:rw,h:rh,fn:enabled?close(fn):()=>message('Chức năng chỉ mở tại khu vực phù hợp'),v33:'drawer'+i});
  });
  v41HUDLine(x+10,y+294,w-20);
  text('WASD / Click · Đi  |  E · Tương tác  |  Space · Né',x+w/2,y+311,11,H35.muted,'center');
};
// Interior compass uses the same group and dimensions, not a separate floating overlay.
v36Mini=function(){
  const r=v36Current(),a=v36Inside(),x=1064,y=12,w=204,h=183;v35Plate(x,y,w,h,r.color);v33Shield(x,y,w,h);
  text('NỘI THẤT',x+w/2,y+17,11,H35.gold,'center','bold');
  g.save();g.translate(x+12,y+31);g.scale(180/778,100/329);g.translate(-251,-251);
  box(251,251,778,329,'#8b7854','#d1bb85',3);
  for(const f of V36_FURN)box(f.x,f.y,f.w,f.h,'#44382b','#9c8967',2);
  circle(V36_NPC.x,V36_NPC.y,14,r.color);circle(a.x,a.y,14,'#fff1c6','#173b3a');g.restore();
  v33Fit(r.name,x+w/2,y+145,w-18,13,H35.paper,'center','bold');text('Khu vực an toàn',x+w/2,y+165,11,H35.jade,'center');
};
// Instance card is anchored to the same map group and maintains original mechanics (trial, dungeon, floor).
v33ArenaInfo=function(){
  const t=v30Trial(),r=v28Run(),m=MAPS[room],x=1064,y=12,w=204;if(!m)return;
  const h=t?127:r?157:89;v35Plate(x,y,w,h,t?'#c5a7db':H35.gold);v33Shield(x,y,w,h);
  v33Fit(t?'CỬU TIÊU THIÊN KIẾP':m.name,x+11,y+16,w-22,13,H35.paper,'left','bold');v41HUDLine(x+10,y+29,w-20);
  if(t){text('Lôi kiếp '+Math.min(t.total,t.wave+1)+' / '+t.total,x+11,y+44,13,H35.jade,'left','bold');
    const advance=Math.min(25,174/Math.max(1,t.total));for(let i=0;i<t.total;i++)circle(x+17+i*advance,y+69,6,i<t.wave?'#80bd94':i===t.wave?'#cfa6e1':'#343b35','#c5a7db');
    v33Fit('Space · Né sét  |  H · Hồi máu',x+11,y+100,w-22,11,H35.muted);return;}
  if(r){
    const left=v28ActiveNodes().length,rs=v28RoomState(),d=v29Difficulty(),mod=v29Mod();
    text((m.v28Stage==='hidden'?'Tầng ẩn':'Tầng '+m.v28Floor+'/5')+' · '+(r.v29?d.name:'Bí cảnh'),x+11,y+44,12,d.col,'left','bold');
    for(let i=0;i<5;i++){const xx=x+11+i*37;v35Plate(xx,y+56,33,21,room>=i*2+2?H35.jade:m.v28Floor===i+1?H35.gold:H35.edge,m.v28Floor===i+1);text(i+1,xx+16.5,y+66,11,H35.paper,'center','bold');}
    v33Fit('Bí ấn '+r.sigils.length+'/3 · '+(left?'Trận nhãn '+left+' · E phá':'Quái '+enemies.filter(e=>!e.dead).length),x+11,y+91,w-22,11,H35.jade,'left','bold');
    v33Fit(r.v29?mod.name+' · '+mod.hint:cleared?'E · Tiến tầng':m.v28Rune&&!rs.sigil?'Bí ấn phía Bắc':'Hạ toàn bộ yêu thú',x+11,y+116,w-22,11,H35.muted);
    v33Fit(cleared?'E · Tiến tầng / rời bí cảnh':'Phòng '+(room+1)+'/'+MAPS.length,x+11,y+139,w-22,11,H35.gold);return;
  }
  text('Phòng '+(room+1)+'/'+MAPS.length+' · Quái '+enemies.filter(e=>!e.dead).length,x+11,y+45,12,H35.jade);
  text(cleared?'E · Qua cổng':'Tiêu diệt yêu thú',x+11,y+69,11,H35.muted);
};


// integrated: v41_presentation.js
