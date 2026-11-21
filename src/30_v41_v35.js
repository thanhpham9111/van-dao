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
const v41HUDStateOld=v35State;
v35State=function(){
  const a=v41HUDStateOld();
  if(a.v41Style)return a;
  // Upgrade the old factory positions only, never a player's manual scale/drag/opacity choices.
  // Preserve hidden flags, profile and all custom groups; V35 reset still restores the new design.
  const legacy=(s,v)=>['scale','dx','dy','alpha'].every((k,i)=>Math.abs(s[k]-v[i])<.001);
  const factory=Object.keys(V41HUD_LEGACY).every(k=>legacy(a.groups[k],V41HUD_LEGACY[k])||legacy(a.groups[k],[1,0,0,1]));
  if(factory){
    for(const s of Object.values(a.groups))Object.assign(s,{dx:0,dy:0,scale:1,alpha:1});
    Object.assign(a.groups.identity,{scale:.96,alpha:.96});
    Object.assign(a.groups.map,{scale:.94,dx:12,alpha:.96});
    Object.assign(a.groups.quest,{scale:.94,dx:14,dy:-8,alpha:.94});
    Object.assign(a.groups.dock,{scale:.92,dx:20,dy:8,alpha:1});
    Object.assign(a.groups.left,{scale:.91,dy:4});
    Object.assign(a.groups.nav,{scale:.91,dx:25,dy:4});
    Object.assign(a.groups.feed,{scale:.93,dy:7,alpha:.9});
    Object.assign(a.groups.target,{scale:.96,dx:9});
  }
  a.v41Style=V41HUD.version;return a;
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
v35Identity=function(s){
  const x=12,y=12,w=292,h=91,col=V10_SCHOOLS[p.cls].color,low=p.hp/s.hp<.28;
  v35Plate(x,y,w,h,low?'#e17a65':H35.gold);v33Shield(x,y,w,h);
  // A warm, engraved medallion and level badge. Name and realm never overlap.
  circle(x+43,y+41,34,'#131c17',H35.gold);
  circle(x+43,y+41,32,'#2b3428',H35.gold2);
  v41HUDClassPortrait(p.cls,x+43,y+41,28,col);
  g.save();g.strokeStyle=H35.gold;g.lineWidth=1.2;g.beginPath();
  for(let i=0;i<16;i++){const a=i*TAU/16;g.moveTo(x+43+Math.cos(a)*31,y+41+Math.sin(a)*31);g.lineTo(x+43+Math.cos(a)*34,y+41+Math.sin(a)*34);}g.stroke();g.restore();
  v41HUDTag(x+23,y+69,40,String(p.level),H35.gold,true);
  v33Fit(p.v8Name||'Vô Danh',x+84,y+16,151,17,H35.paper,'left','bold');
  v33Fit(realm(),x+84,y+36,194,12,col,'left','bold');
  text('CL '+v41HUDNum(v10FightPower(s)),x+w-12,y+16,11,H35.gold,'right','bold');
  v41HUDBar(x+84,y+48,w-97,10,p.xp,xpNeed(),'#d9ad6b');
  v33Fit('TU VI '+Math.floor(p.xp)+'/'+xpNeed()+' · '+v41HUDPercent(p.xp,xpNeed())+'%',x+84,y+66,147,11,H35.muted,'left','bold');
  text(Math.floor(p.stones||0)+' ◈',x+w-12,y+66,12,H35.gold,'right','bold');
  text('C · Hồ sơ',x+84,y+80,10,H35.muted);
  if(v10Points()>0){circle(x+w-14,y+80,4,H35.jade);text('+'+v10Points(),x+w-22,y+80,10,H35.jade,'right','bold');}
  buttons.push({x,y,w,h,fn:v10Open,v35:'profile'});
};
v35Status=function(){
  const a=[];
  if(p.poisonT>0)a.push(['Độc',p.poisonT,'#b6d98b']);
  if(p.fireT>0)a.push(['Cháy',p.fireT,'#ec9376']);
  if((p.v10Guard||0)>0)a.push(['Hộ thể',p.v10Guard,'#ead097']);
  if((p.guardT||0)>0&&!(p.v10Guard>0))a.push(['Hộ thể',p.guardT,'#ead097']);
  if(v13Init().wardRemain>0)a.push(['Hộ phù',v13Init().wardRemain,'#9ccadd']);
  a.forEach(([label,t,col],i)=>v41HUDTag(12+i*73,108,70,label+' '+Math.ceil(t)+'s',col));
  if(p.level<45&&v22AtCap()&&p.xp>=xpNeed()&&p.worldMode)v34Button(12,a.length?134:108,208,27,'B · ĐỘT PHÁ CẢNH GIỚI',v22Break,true,'break',H35.gold);
};
v35Map=function(){
  const st=v34State(),r=REG[p.mapId]||REG.thon,d=V22_REG[p.mapId]||V22_REG.thon,[status,col]=v22Danger(d),cx=1166,cy=96,rr=76;
  // A live circular compass. The map remains the original accurate world/local renderer.
  circle(cx,cy,rr+11,'#121d18e8',H35.gold2);circle(cx,cy,rr+7,'#242d20',H35.gold);
  g.save();g.beginPath();g.arc(cx,cy,rr,0,TAU);g.clip();
  if(st.local)v34Local(cx-rr,cy-rr,rr*2,rr*2);else v33Mini(cx-rr,cy-rr,rr*2,rr*2);
  let vign=V46_MAP_VIGN;if(!vign){vign=g.createRadialGradient(cx,cy,rr*.48,cx,cy,rr);vign.addColorStop(0,'#09140d00');vign.addColorStop(1,'#09140d63');V46_MAP_VIGN=vign;}
  g.fillStyle=vign;g.fillRect(cx-rr,cy-rr,rr*2,rr*2);g.restore();
  circle(cx,cy,rr,'',H35.gold2);
  g.save();g.strokeStyle='#e4c99099';g.lineWidth=1;g.beginPath();
  for(let i=0;i<24;i++){const a=i*TAU/24;if(i%6===0)continue;g.moveTo(cx+Math.cos(a)*(rr+2),cy+Math.sin(a)*(rr+2));g.lineTo(cx+Math.cos(a)*(rr+5),cy+Math.sin(a)*(rr+5));}g.stroke();g.restore();
  for(const [a,t] of [[-Math.PI/2,'B'],[0,'Đ'],[Math.PI/2,'N'],[Math.PI,'T']]){
    const xx=cx+Math.cos(a)*(rr+6),yy=cy+Math.sin(a)*(rr+6);circle(xx,yy,6,'#242b1f',H35.gold2);text(t,xx,yy,10,H35.paper,'center','bold');
  }
  const hour=hdSun().hour,dt=String(Math.floor(hour)).padStart(2,'0')+':'+String(Math.floor(hour%1*60)).padStart(2,'0');
  v41HUDTag(1064,12,49,dt,H35.gold);
  v34Button(1066,159,60,23,st.local?'Khu vực':'Thế giới',()=>{st.local=!st.local;save();},false,'mapMode');
  v34Button(1228,159,38,23,'M',()=>openPanel('map'),false,'map');
  // Button registration follows render order so the small map toggles get priority.
  buttons.push({x:1089,y:25,w:154,h:134,fn:()=>openPanel('map'),v35:'bigmap'});
  v35Plate(1064,183,204,41,H35.edge);v33Shield(1064,183,204,41);
  v33Fit(r.name,cx,194,188,14,H35.paper,'center','bold');
  v33Fit(d.i?'Lv '+d.min+'–'+d.max+' · '+status:status+' · Tân thủ',cx,213,184,11,col,'center','bold');
};
v35Quest=function(){
  const t=v12Tracked(),s=v34State(),x=1012,y=232,w=256,h=s.quest?88:29;
  v35Plate(x,y,w,h,H35.gold2);v33Shield(x,y,w,h);
  diamond(g,x+14,y+14,4,H35.gold);text('THIÊN MỆNH',x+26,y+14,12,H35.gold,'left','bold');
  v34Button(x+w-30,y+4,24,21,s.quest?'−':'+',()=>{s.quest=!s.quest;save();},false,'questToggle');
  if(!s.quest)return;
  v41HUDLine(x+9,y+29,w-18);
  if(t){v33Fit(t.goal,x+12,y+43,w-24,13,H35.paper,'left','bold');
    v33Fit(v12Progress(t),x+12,y+68,145,12,H35.jade,'left','bold');
    v34Button(x+163,y+56,81,27,'Dẫn đường',()=>v12Guide(t),false,'guide',H35.gold2);
  }else v34Button(x+12,y+39,w-24,36,'Q · Nhật ký nhiệm vụ',v12Open,false,'journal');
};
v35Target=function(){
  const e=v34Target(),edit=v35Editing();if(!e&&!edit)return;
  const a=e?v27AI(e):null,boss=e?bossType(e.type):true,col=a?.phase===3?'#e98c76':boss?H35.gold:H35.jade,x=404,y=12,w=472,h=83;
  v35Plate(x,y,w,h,col);v33Shield(x,y,w,h);
  if(e)v34Portrait('v25mob'+e.type,x+34,y+36,25,col,true);
  else{circle(x+34,y+36,27,'#1b3130',H35.gold);v35Icon('sword',x+34,y+36,19,col);}
  v33Fit(e?TYPES[e.type].name:'Mục tiêu mẫu',x+68,y+14,255,15,H35.paper,'left','bold');
  text(e?'Lv '+v22EnemyLevel(e)+' · '+(boss?'THỦ LĨNH':e.elite?'TINH ANH':'YÊU THÚ'):'THỦ LĨNH',x+w-11,y+14,11,col,'right','bold');
  const hp=e?.hp??78,max=e?.max??100,poise=a?.poise??67,poiseMax=a?.max??100;
  v41HUDBar(x+67,y+25,w-79,17,hp,max,V41HUD.red,Math.ceil(hp)+' / '+Math.ceil(max)+'    '+v41HUDPercent(hp,max)+'%');
  // Poise has its own label and value, not an unexplained thin bar.
  text('THẾ',x+67,y+52,9,H35.muted,'left','bold');
  v41HUDBar(x+101,y+47,w-113,9,poise,poiseMax,'#e1bb76');
  const phase=boss?(a?.phase===3?'III · CUỒNG BẠO':a?.phase===2?'II · BIẾN CHIÊU':'I · THĂM DÒ'):e?.elite?'TINH ANH':'CHIẾN ĐẤU';
  text(phase,x+12,y+72,10,col,'left','bold');
  if(a?.mode==='stagger'){v33Fit('PHÁ THẾ · +25% sát thương',x+w-13,y+72,w-155,12,H35.jade,'right','bold');}
  else if(a?.action&&a.mode==='wind'){
    const f=clamp(a.t/Math.max(.01,a.action.wind),0,1),bx=x+162,bw=w-174;
    v41HUDBar(bx,y+63,bw,15,f,1,a.action.breakGuard?'#eac074':'#e2816b',a.action.name+' · '+(a.step+1)+'/'+a.plan.length);
  }else v33Fit(a?.mode==='recover'?'Hồi chiêu · cơ hội phản công':'Quan sát chiêu thức',x+w-13,y+72,w-164,11,H35.muted,'right');
};
function v41HUDResources(s,x,y,w){
  const half=(w-10)/2,low=p.hp/s.hp<.26;
  text('SINH MỆNH',x,y-8,10,low?V41HUD.red:H35.paper,'left','bold');
  text('LINH LỰC',x+half+10,y-8,10,H35.paper,'left','bold');
  v41HUDBar(x,y,half,17,p.hp,s.hp,'#d66d55',Math.ceil(p.hp)+' / '+Math.ceil(s.hp),low);
  v41HUDBar(x+half+10,y,half,17,p.mp,s.mp,'#5daec5',Math.floor(p.mp)+' / '+Math.ceil(s.mp));
}
v35Dock=function(s){
  const x=394,y=602,w=492,slot=55,gap=6,sx=x+36,sy=y+48,ranks=v11Levels(),cds=v11Cooldowns(),skills=V11_SKILLS[p.cls];
  const list=[
    {key:'LMB',name:'Đánh thường',icon:0,cd:p.atkCd||0,base:Math.max(.27,.39/s.rate),fn:()=>v33Aim(attack)},
    ...skills.slice(0,4).map((d,i)=>({key:d.key,name:d.name,d,rank:ranks[i],cd:cds[i],base:d.cd,fn:()=>v33Aim(()=>v11Cast(i))})),
    {key:'SPACE',name:'Khinh công · né đòn',icon:2,cd:p.dashCd||0,base:s.dashCd,fn:()=>pressed.Space=true},
    {key:'H',name:'Hồi Xuân Đan',icon:3,count:p.pills,fn:heal}
  ];
  v35Plate(x,y,w,113,H35.gold);v33Shield(x,y,w,113);
  v41HUDResources(s,x+13,y+22,w-26);
  let tip=null;
  list.forEach((a,i)=>{
    const xx=sx+i*(slot+gap),locked=!!(a.d&&!a.rank),low=!!(a.d&&p.mp<a.d.cost),empty=a.count===0,cd=Math.max(0,a.cd||0),dim=locked||low||empty||cd>0,over=v33Over(xx,sy,slot,58),col=a.d?.color||H35.gold;
    v35Plate(xx,sy,slot,58,over?H35.paper:locked?H35.edge:col,over&&!dim);
    const cx=xx+slot/2,cy=sy+23;
    g.save();g.globalAlpha*=dim?.46:1;if(a.d)v11SkillIcon(a.d.kind,cx,cy,20,col);else uiIcon(a.icon,cx-20,cy-20,40,dim);g.restore();
    if(cd>0){
      const frac=clamp(cd/Math.max(.01,a.base||cd),0,1);g.save();g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,22,-Math.PI/2,-Math.PI/2+TAU*frac);g.closePath();g.fillStyle='#06100fce';g.fill();g.strokeStyle=col;g.lineWidth=1.25;g.stroke();g.restore();
      text(cd>=1?Math.ceil(cd):cd.toFixed(1),cx,cy,16,H35.paper,'center','bold');
    }else if(locked)text('KHÓA',cx,cy,10,H35.muted,'center','bold');
    else if(low)text('MP',cx,cy,11,V41HUD.red,'center','bold');
    if(a.count!=null)text('×'+a.count,xx+slot-4,sy+7,10,H35.paper,'right','bold');
    if(a.d&&a.rank)text(a.rank,xx+slot-5,sy+7,10,H35.jade,'right','bold');
    g.fillStyle='#101817e8';g.fillRect(xx+3,sy+43,slot-6,12);
    text(a.key,cx,sy+49,10,dim?H35.muted:H35.paper,'center','bold');
    buttons.push({x:xx,y:sy,w:slot,h:58,fn:()=>{if(locked)v11Open();else if(!empty&&!low&&!cd)a.fn();},v35:'skill'+i});
    if(over)tip={a,x:xx,col,locked,low,cd};
  });
  // Status indicators only when they matter: clear combo progression and cooldown text.
  if(V26.hits||V26.stage||V26.action){
    const a=V26.action,col=V25_COLOR[p.cls];v35Plate(533,571,214,27,col);
    for(let i=0;i<3;i++)diamond(g,546+i*17,584,4,i<V26.stage?col:H35.edge);
    v33Fit(V26.hits?V26.hits+' LIÊN KÍCH':a?.kind==='skill'?a.d.name:'Liên chiêu',602,584,135,11,col,'left','bold');
  }
  if(tip&&!v35Editing()){
    const {a,col,locked,low,cd}=tip,tw=284,tx=clamp(tip.x+slot/2-tw/2,8,W-tw-8),ty=477;
    const state=a.d?(locked?'Chưa học · T mở công pháp':low?'Thiếu linh lực':cd>0?'Hồi chiêu '+cd.toFixed(1)+'s':'Đã sẵn sàng'):(cd>0?'Hồi chiêu '+cd.toFixed(1)+'s':a.count===0?'Đã hết đan':'Đã sẵn sàng');
    v35Plate(tx,ty,tw,94,col);v33Fit(a.name,tx+12,ty+16,tw-22,14,col,'left','bold');
    v33Fit((a.d?a.d.cost+' MP · '+a.d.cd+'s · ':a.key+' · ')+state,tx+12,ty+36,tw-22,11,locked||low?V41HUD.red:H35.jade);
    v41HUDLine(tx+10,ty+45,tw-20);v12Wrap(a.d?.desc||(a.count!=null?'Hồi sinh mệnh · còn '+a.count+' đan':'Sử dụng trực tiếp khi chiến đấu'),tx+12,ty+62,tw-24,11,H35.muted,15,2);
  }
};
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
v35Left=function(){
  const y=658;
  v35Control(12,y,51,'menu','MENU','Đạo đồ · Menu',()=>V33.menu=!V33.menu,V33.menu);
  v35Control(67,y,51,'auto','F','Tự đánh · '+(auto?'Bật':'Tắt'),()=>{auto=!auto;save();},auto);
  v35Control(122,y,51,'loot','X','Tự nhặt · '+(v21State().auto?'Bật':'Tắt'),v21Toggle,v21State().auto);
  v35Control(177,y,51,'bag','Z','Nhặt vật phẩm gần',v21PickNear);
};
const v41HUDIconOld=v35Icon;
v35Icon=function(kind,x,y,r,col){
  if(kind!=='audio'&&kind!=='mute')return v41HUDIconOld(kind,x,y,r,col);
  g.save();g.translate(x,y);g.scale(r/16,r/16);g.strokeStyle=col;g.lineWidth=1.8;g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.moveTo(-11,-4);g.lineTo(-5,-4);g.lineTo(2,-10);g.lineTo(2,10);g.lineTo(-5,4);g.lineTo(-11,4);g.closePath();g.stroke();
  g.beginPath();if(kind==='audio'){g.arc(1,0,8,-.74,.74);g.stroke();g.beginPath();g.arc(1,0,13,-.65,.65);}
  else{g.moveTo(7,-4);g.lineTo(13,4);g.moveTo(13,-4);g.lineTo(7,4);}g.stroke();g.restore();
};
v35Nav=function(){
  const y=658,enabled=typeof v41AudioEnabled==='function'&&v41AudioEnabled();
  if(typeof v41AudioToggle==='function')v35Control(935,y,51,enabled?'audio':'mute','ÂM','Âm thanh '+(enabled?'bật':'tắt')+' · Alt+M',v41AudioToggle,enabled);
  v35Control(990,y,51,'bag','I','Hành trang '+p.gear.length+'/48',()=>openPanel('gear'));
  v35Control(1045,y,51,'book','T','Công pháp · '+v11SkillPoints()+' điểm',v11Open,v11SkillPoints()>0);
  v35Control(1100,y,51,'scroll','Q','Nhật ký nhiệm vụ',v12Open);
  v35Control(1155,y,51,'hud','F2','Tùy chỉnh HUD',v35Open);
  v35Control(1210,y,51,'settings','ESC','Cài đặt',()=>openPanel('settings'));
};
v35Feed=function(){
  const st=v34State();if(!st.feed&&!v35Editing())return;
  const a=V34.events.filter(e=>elapsed-e.at<7).slice(-3);if(!a.length&&v35Editing())a.push({text:'Thông báo mẫu · +12 tu vi',col:H35.gold,at:elapsed,n:1});
  a.forEach((e,i)=>{const x=12,y=520+i*31,age=elapsed-e.at;g.save();g.globalAlpha*=age>5?clamp((7-age)/2,.12,1):1;v35Plate(x,y,286,26,'#967f534d');g.fillStyle=e.col;g.fillRect(x+2,y+4,2,18);v33Fit(e.text+(e.n>1?' ×'+e.n:''),x+12,y+13,262,11,e.col,'left','bold');g.restore();});
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
