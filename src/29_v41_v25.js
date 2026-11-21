'use strict';
// V41 — cinematic, readable combat art. All timing, hit geometry, damage and
// movement remain owned by V26/V27; these functions never advance the simulation.
const V41_COMBAT={
  palette:[['#82d8cc','#eafff1','#287f78'],['#e9b178','#fff0c8','#aa603c'],['#c9acff','#f2edff','#7469bc']],
  budget:0,maxParticles:116,maxEvents:26,
  lastRenderedCount:0,lastParticles:0
};
function v41c01(t){return Math.max(0,Math.min(1,t));}
function v41cPalette(cls){return V41_COMBAT.palette[cls]||V41_COMBAT.palette[0];}
function v41cHash(i,s=0){const n=Math.sin(i*91.73+s*317.53)*43758.5453;return n-Math.floor(n);}
function v41cLine(x1,y1,x2,y2,c,w=1){g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
function v41cRing(r,ratio,c,w=1,a0=0,a1=TAU){
  if(r<=.1||a1<=a0)return;
  g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.ellipse(0,0,r,Math.max(.1,r*ratio),0,a0,a1);g.stroke();
}
function v41cGlow(x,y,rx,ratio,c,alpha=.22){
  if(rx<=1||alpha<=0)return;g.save();g.translate(x,y);g.scale(1,ratio);g.globalAlpha*=alpha;
  const gr=g.createRadialGradient(0,0,0,0,0,rx);gr.addColorStop(0,c);gr.addColorStop(.36,c+'66');gr.addColorStop(1,c+'00');
  g.fillStyle=gr;g.fillRect(-rx,-rx,2*rx,2*rx);g.restore();
}
function v41cDiamond(x,y,s,c,rot=0){
  if(!Number.isFinite(s)||s<=0)return;g.save();g.translate(x,y);g.rotate(rot);
  g.fillStyle=c;g.beginPath();g.moveTo(-s,0);g.lineTo(0,-s*.58);g.lineTo(s,0);g.lineTo(0,s*.58);g.closePath();g.fill();g.restore();
}
function v41cParticles(q,r,col,angle,count=12,spread=TAU,ratio=.72,seed=0,dust=false){
  const n=Math.min(count,V41_COMBAT.budget);V41_COMBAT.budget-=n;
  g.save();g.lineCap='round';const fade=(1-q)**1.15;
  for(let i=0;i<n;i++){
    const jitter=v41cHash(i+4,seed),a=angle+(v41cHash(i+27,seed)-.5)*spread;
    const speed=.36+.70*jitter,rr=r*(.06+speed*(1-(1-q)**2));
    const x=Math.cos(a)*rr,y=Math.sin(a)*rr*ratio-(dust?4:18)*Math.sin(q*Math.PI)*jitter;
    const size=.9+(1-q)*2.2*jitter;g.globalAlpha=fade*(dust?.38:.95);
    if(dust){g.fillStyle=col;g.beginPath();g.ellipse(x,y,size*(1+q),size*.65,0,0,TAU);g.fill();}
    else if(i%4===0){v41cDiamond(x,y,size*1.8,'#fff8da',a);}
    else v41cLine(x,y,x-Math.cos(a)*(3+13*(1-q)*jitter),y-Math.sin(a)*(3+13*(1-q)*jitter)*ratio,col,size*.8);
  }g.restore();
}
// Ribbon width follows a taper at both ends rather than a solid blunt streak.
function v41cRibbon(r,a0,a1,w,col,core,alpha=1){
  if(r<1||a1<=a0)return;g.save();g.globalAlpha*=alpha;
  const steps=25,grad=g.createRadialGradient(0,0,Math.max(0,r-w),0,0,r*1.01);
  grad.addColorStop(0,col+'00');grad.addColorStop(.40,col+'36');grad.addColorStop(.82,col);grad.addColorStop(1,core);g.fillStyle=grad;
  g.beginPath();for(let i=0;i<=steps;i++){let u=i/steps,a=a0+(a1-a0)*u,rr=r*(.985+.015*Math.sin(Math.PI*u));if(i===0)g.moveTo(rr*Math.cos(a),rr*Math.sin(a));else g.lineTo(rr*Math.cos(a),rr*Math.sin(a));}
  for(let i=steps;i>=0;i--){let u=i/steps,a=a0+(a1-a0)*u,rr=Math.max(0,r-w*Math.sin(Math.PI*u)**.65);g.lineTo(rr*Math.cos(a),rr*Math.sin(a));}g.closePath();g.fill();
  g.strokeStyle=core;g.lineWidth=1.35;g.beginPath();g.arc(0,0,r*.996,a0+(a1-a0)*.08,a1-(a1-a0)*.08);g.stroke();g.restore();
}
function v41cSword(x,y,a,l,col,core,alpha=1){
  g.save();g.translate(x,y);g.rotate(a);g.globalAlpha*=alpha;
  const gr=g.createLinearGradient(-l*.8,0,l*.58,0);gr.addColorStop(0,col+'00');gr.addColorStop(.40,col+'66');gr.addColorStop(.88,core);gr.addColorStop(1,col);
  g.fillStyle=gr;g.beginPath();g.moveTo(l*.57,0);g.lineTo(-l*.19,-l*.068);g.lineTo(-l*.72,0);g.lineTo(-l*.19,l*.068);g.closePath();g.fill();
  v41cLine(-l*.17,0,l*.49,0,core,1.2);v41cLine(-l*.25,-l*.11,-l*.25,l*.11,col,2);g.restore();
}
function v41cStoneCracks(r,q,col){
  g.save();g.globalAlpha*=.5*(1-q);g.strokeStyle=col;g.lineWidth=1.8;
  for(let i=0;i<10;i++){const a=i*TAU/10;g.beginPath();for(let j=0;j<6;j++){const t=(j+1)/6,x=Math.cos(a+(j%2-.5)*.15)*r*t,y=Math.sin(a+(j%2-.5)*.15)*r*t;if(j===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();}g.restore();
}
function v41cCrystal(x,y,h,a,col,core){
  g.save();g.translate(x,y);g.rotate(a);const w=h*.18;g.fillStyle=col;g.beginPath();g.moveTo(0,-h);g.lineTo(w,-h*.3);g.lineTo(w*.7,0);g.lineTo(-w,0);g.lineTo(-w,-h*.3);g.closePath();g.fill();
  g.fillStyle=core;g.beginPath();g.moveTo(0,-h);g.lineTo(0,0);g.lineTo(-w,-h*.3);g.closePath();g.fill();g.restore();
}
function v41cSigil(r,rotation,col,core,ratio=.65,n=6,alpha=.66){
  g.save();g.globalAlpha*=alpha;g.scale(1,ratio);g.rotate(rotation);
  v41cRing(r,1,col,1.8);v41cRing(r*.87,1,core,1);v41cRing(r*.40,1,col,.65);
  g.strokeStyle=col;g.lineWidth=1.2;g.beginPath();for(let i=0;i<=n;i++){const a=i*TAU/n,x=Math.cos(a)*r*.86,y=Math.sin(a)*r*.86;if(!i)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
  for(let i=0;i<n*2;i++){let a=i*TAU/(n*2),x=Math.cos(a),y=Math.sin(a);v41cLine(x*r*.90,y*r*.90,x*r*.99,y*r*.99,core,i%2?1:2);}
  for(let i=0;i<n;i++){const a=i*TAU/n;v41cDiamond(Math.cos(a)*r*.59,Math.sin(a)*r*.59,Math.max(1,r*.035),core,a);}g.restore();
}
function v41cLightning(x,h,seed,col,core,alpha=1){
  g.save();g.globalAlpha*=alpha;const pts=[];
  for(let i=0;i<=8;i++){const t=i/8;pts.push([x+(1-t)*(v41cHash(i,seed)-.5)*44,-h*(1-t)]);}
  const path=()=>{g.beginPath();g.moveTo(...pts[0]);for(const q of pts.slice(1))g.lineTo(...q);};
  path();g.strokeStyle=col;g.lineWidth=13;g.globalAlpha*=.24;g.stroke();g.globalAlpha/=.24;path();g.lineWidth=6;g.strokeStyle=col;g.stroke();path();g.lineWidth=2.9;g.strokeStyle=core;g.stroke();
  for(let i=2;i<7;i+=3){let pt=pts[i];v41cLine(pt[0],pt[1],pt[0]+(v41cHash(i+4,seed)-.5)*65,pt[1]+h*.18,col,1.3);}
  g.restore();
}
// Retire the uniform V38 aura: each spell uses its own silhouette and a
// restrained warm/cool signature, making simultaneous VFX distinguishable.
v26Charge=function(x,y,a,world){
  if(!a?.d||a.hit)return;
  const q=v41c01(a.vis/Math.max(.01,a.impact)),k=a.d.kind,col=a.d.color,core=v41cPalette(a.cls)[1],ratio=world?HD.tilt:.65;
  g.save();g.translate(x,y);g.globalAlpha=(.45+.45*q);
  v41cGlow(0,-7,25+q*12,ratio,col,.24);
  const r=20+q*20;
  if(a.cls===0){
    g.save();g.translate(0,-38);for(let i=0;i<3;i++){const phi=V26.clock*7+i*TAU/3;v41cSword(Math.cos(phi)*r,Math.sin(phi)*r*.35,phi+Math.PI*.46,35+q*13,col,core,.7);}g.restore();
    v41cRing(r,ratio,col,1.5,-q*2,TAU-q*2);
  }else if(a.cls===1){
    g.save();g.scale(1,ratio);v41cRing(r,1,col,2);v41cRing(r*.82,1,core,1);v41cStoneCracks(r,q*.6,col);g.restore();
    g.save();g.translate(Math.cos(a.a)*13,-38);v41cGlow(0,0,18+q*10,1,col,.68);v41cDiamond(0,0,6+q*7,core,q*3);g.restore();
  }else{
    v41cSigil(r, V26.clock*1.4,col,core,ratio,k==='lightning'?5:6,.9);
    g.save();g.translate(0,-41);v41cGlow(0,0,18+q*12,1,col,.5);
    for(let i=0;i<3;i++){let t=i*TAU/3+V26.clock*5;v41cDiamond(Math.cos(t)*r*.8,Math.sin(t)*r*.35,4+q*3,core,t);}g.restore();
  }g.restore();
};
function v41cSkill(f,q,ratio){
  const r=f.r||85,k=f.style,col=f.color,fade=(1-q)**.76,core=k==='lightning'?'#faedff':k==='blizzard'||k==='frost'?'#efffff':v41cPalette(k==='quake'||k==='crush'||k==='guard'||k==='shock'?1:0)[1],phase=V26.clock*1.8;
  if(k==='blade'||k==='fan'){
    for(const j of k==='fan'?[-1,0,1]:[0]){const a=j*.29;v41cSword((20+q*78)*Math.cos(a),(20+q*78)*Math.sin(a),a,65,col,core,fade);}
  }else if(k==='triple'||k==='frost'){
    const n=k==='triple'?3:1;for(let i=0;i<n;i++){const x=18+q*69,y=(i-(n-1)/2)*(17+q*12),rr=k==='frost'?18:11;v41cGlow(x,y,rr*1.4,.89,col,.44*fade);g.save();g.translate(x,y);g.globalAlpha*=fade;v41cDiamond(0,0,rr*.45,core,phase);v41cRing(rr,.55,col,1.5,phase,phase+Math.PI*1.76);g.restore();}
  }else if(k==='shock'){
    for(let i=0;i<3;i++)v41cRibbon(r*(.37+q*.6)+i*12,-.66,.66,8+i*2,col,core,fade/(1+i*.2));
  }else if(k==='storm'){
    // Thanh Vân Kiếm Vũ: a full Tai Chi sword formation inspired by classical
    // swordplay choreography. The outer seal follows the actual blast radius.
    const rr=r*(.65+.34*Math.min(1,q*3)),gold='#e9db92',jade='#9ee5cd',phi=phase*.75;
    v41cGlow(0,0,rr,ratio,col,.25*fade);
    g.save();g.scale(1,ratio);g.rotate(phi);g.save();g.globalAlpha*=.25;
    for(let i=0;i<2;i++){g.rotate(Math.PI);g.fillStyle=i?jade:gold;g.beginPath();g.arc(0,0,rr*.83,-Math.PI/2,Math.PI/2);g.bezierCurveTo(-rr*.59,rr*.83,-rr*.59,0,0,0);g.bezierCurveTo(rr*.59,0,rr*.59,-rr*.83,0,-rr*.83);g.closePath();g.fill();}
    g.restore();g.save();g.globalAlpha*=.84;g.strokeStyle='#f0f2ce';g.lineWidth=2.1;g.beginPath();g.moveTo(0,-rr*.83);g.bezierCurveTo(rr*.59,-rr*.83,rr*.59,0,0,0);g.bezierCurveTo(-rr*.59,0,-rr*.59,rr*.83,0,rr*.83);g.stroke();g.restore();
    v41cRing(rr*.88,1,jade,1.8);v41cRing(rr*.97,1,gold,1.6);v41cRing(rr,1,'#fff5ca',1.1);
    v41cRibbon(rr,0,Math.PI*.91,13,gold,'#fff8d7',fade);v41cRibbon(rr,Math.PI,Math.PI*1.91,13,jade,'#e6fff3',fade);
    for(let i=0;i<24;i++){const a=i*TAU/24,l=i%3===0?.10:.045;v41cLine(Math.cos(a)*rr*(.92-l),Math.sin(a)*rr*(.92-l),Math.cos(a)*rr*.92,Math.sin(a)*rr*.92,i%2?jade:gold,i%3===0?1.7:.8);}
    g.fillStyle=gold;g.beginPath();g.arc(0,rr*.42,rr*.055,0,TAU);g.fill();g.fillStyle=jade;g.beginPath();g.arc(0,-rr*.42,rr*.055,0,TAU);g.fill();g.restore();
    const swords=['#ecc672','#9be1b5','#d9fbf5','#91ccea','#e3a99b'];
    for(let i=0;i<5;i++){const a=i*TAU/5+phase*2,sr=rr*(.52+.27*q);v41cSword(Math.cos(a)*sr,Math.sin(a)*sr*ratio-16,a+Math.PI*.5,75,swords[i],core,.92);}
    v41cParticles(q,r,col,0,18,TAU,ratio,7);
  }else if(k==='fall'){
    v41cGlow(0,0,r,ratio,col,.19*fade);v41cSigil(r*.87,phase*.8,col,core,ratio,8,.65*fade);
    for(const i of [-1,0,1]){const x=i*r*.28,y=-Math.max(0,1-q*3)*184;v41cSword(x,y-44,Math.PI*.5,i?87:122,col,core,fade);}
    v41cParticles(q,r,col,0,16,TAU,ratio,8);
  }else if(k==='quake'||k==='crush'){
    const rr=r*(.18+.81*q);v41cGlow(0,0,rr,ratio,col,.12*fade);
    g.save();g.scale(1,ratio);v41cStoneCracks(rr,q,col);v41cRing(rr,1,col,3);v41cRing(rr*.92,1,core,1.4);g.restore();
    if(k==='crush')for(const i of [-1,0,1]){const hh=105*(1-q),x=i*r*.18;v41cLine(x,-hh,x,0,col,7*(1-q)+1);v41cLine(x,-hh,x,0,core,1.8);}
    v41cParticles(q,r,col,0,18,TAU,ratio,9,true);v41cParticles(q,r*.8,col,0,10,TAU,ratio,3);
  }else if(k==='guard'){
    v41cGlow(0,-25,r,.95,col,.21*fade);v41cSigil(r*.90,phase*.3,col,core,.75,6,.83*fade);
    g.save();g.translate(0,-28);v41cRing(r*.46,.96,col,2,-Math.PI*.90,Math.PI*.90);v41cRing(r*.38,1,core,1,-Math.PI*.62,Math.PI*.62);g.restore();
  }else if(k==='lightning'){
    v41cGlow(0,0,r,ratio,col,.35*fade);v41cSigil(r*.88,-phase,col,core,ratio,5,.72*fade);v41cGlow(0,-12,31,.9,core,.42*(1-q));
    for(let i=-1;i<=1;i++)v41cLightning(i*r*.30,165+Math.abs(i)*18,i+12,col,core,fade);v41cParticles(q,r,col,0,16,TAU,ratio,10);
  }else if(k==='blizzard'){
    v41cGlow(0,0,r,ratio,col,.17*fade);v41cRing(r*.97,ratio,col,1.8);
    for(let i=0;i<15;i++){const a=i*2.399+phase*.22,rr=r*.92*Math.sqrt((i+1)/15),x=Math.cos(a)*rr,y=Math.sin(a)*rr*ratio;g.save();g.globalAlpha*=fade*.87;v41cCrystal(x,y,13+v41cHash(i)*30*(1-q*.7),a*.2,col,core);g.restore();}
    v41cParticles(q,r*.9,col,0,16,TAU,ratio,15);
  }
}
// Render a thinner continuous wind-up stroke before the active impact. The
// sprite animation retains V26's hit-stop and gameplay timing.
function v41cAnticipation(v,world){
  const a=V26.action;if(!a||a.kind!=='attack'||a.cls!==0||a.hit)return;
  const q=v41c01(a.vis/Math.max(.01,a.impact));if(q<.30)return;
  const z=world?hdPoint(p.x,p.y,v):p,r=a.s.range*.77,ag=Math.atan2(Math.sin(a.a)*(world?HD.tilt:1),Math.cos(a.a));
  g.save();g.translate(z.x,z.y-26);g.rotate(ag);g.scale(1,.68);g.globalAlpha=.18+q*.22;
  v41cRibbon(r,-1.58,-1.58+q*.90,8,'#82d8cc','#d8fff0');g.restore();
}
// All active effects are rendered in one bounded pass. Extra impacts in mass
// fights are omitted first; newer cast releases and death silhouettes remain.
v26Render=function(v){
  if(!p||mode!=='play')return;
  const world=!!p.worldMode,ratio=world?HD.tilt:.66,point=f=>world?hdPoint(f.x,f.y,v):f,cls=p.cls??0;
  const width=W/(world?V11_ZOOM:1),height=H/(world?V11_ZOOM:1);
  V41_COMBAT.budget=V41_COMBAT.maxParticles;V41_COMBAT.lastRenderedCount=0;
  const onscreen=z=>z.x>-260&&z.y>-260&&z.x<width+260&&z.y<height+260;
  const d=V26.dash;if(d){const path=d.path;
    for(let i=0;i<path.length;i++){
      const a=path[i],age=V26.clock-a.at;if(age>=.27)continue;const z=point(a);if(!onscreen(z))continue;
      v25Cell(v25RunKey(cls,d.dir),a.frame,4,3,z.x,z.y,124,V9_FLIP[d.dir],.24*(1-age/.27),a.lift);
      if(i&&age<.18){const prev=point(path[i-1]),col=v41cPalette(cls)[0];g.save();g.globalAlpha=.42*(1-age/.18);v41cLine(prev.x,prev.y-17,z.x,z.y-17,col,1.6);g.restore();}
    }
  }
  v41cAnticipation(v,world);
  const events=V26.fx.filter(f=>onscreen(point(f))),nonImpact=events.filter(f=>f.kind!=='impact'),impacts=events.filter(f=>f.kind==='impact');
  const selected=nonImpact.slice(-18).concat(impacts.slice(-Math.max(0,V41_COMBAT.maxEvents-Math.min(18,nonImpact.length))));V41_COMBAT.lastRenderedCount=selected.length;
  for(const f of selected){
    const z=point(f),q=v41c01((V26.clock-f.at)/Math.max(.01,f.dur)),fade=(1-q)**.70,r=f.r||65,ag=Math.atan2(Math.sin(f.a||0)*(world?HD.tilt:1),Math.cos(f.a||0)),pal=v41cPalette(f.cls??cls),core=f.crit?'#fff5ce':pal[1];
    g.save();g.translate(z.x,z.y-(f.kind==='impact'?33:f.kind==='strike'||f.kind==='release'?25:0));g.globalAlpha=fade;
    if(f.kind==='strike'){
      g.rotate(ag);const stage=f.stage||1,rr=r*(.60+.48*q);
      if(f.cls===0){g.scale(1,.74);const start=-1.50+q*1.08,span=2.10+stage*.15;v41cGlow(rr*.66,0,rr*.63,.46,pal[0],.16);v41cRibbon(rr,start,start+span,13+stage*5,pal[0],core,.91);if(stage>=2)v41cRibbon(rr*.79,-1.22-q*.5,.70-q*.5,9,pal[0],core,.52);if(stage===3){g.rotate(-.62);v41cRibbon(rr*1.02,-1.1,1.0,14,'#e8d294','#fff7dd',.82);}}
      else if(f.cls===1){for(let i=0;i<stage+1;i++)v41cRibbon(r*(.37+q*.57)+i*9,-.65-i*.05,.65+i*.05,10,pal[0],core,1-i*.14);v41cGlow(rr*.58,0,rr*.60,.60,pal[0],.20);}
      else for(let i=0;i<stage;i++){const y=(i-(stage-1)/2)*20,x=15+q*75;v41cGlow(x,y,16,.82,pal[0],.44);v41cDiamond(x,y,5,core,q*3+i);g.save();g.translate(x,y);v41cRing(10+q*4,.55,pal[0],1.4);g.restore();}
      v41cParticles(q,r,pal[0],0,stage===3?14:8,2.3,.65,stage);
    }else if(f.kind==='impact'){
      const a=(f.heavy?1:.6)*(1-q);v41cGlow(0,0,(f.heavy?32:20)*(1+q*.9),.85,f.color,.62*a);
      g.save();g.rotate(ag);g.globalAlpha*=a;v41cLine(-20*a,0,20*a,0,core,f.heavy?2.7:1.8);v41cLine(0,-12*a,0,12*a,f.color,1.2);g.restore();
      if(f.heavy)v41cRing(8+q*33,.67,f.color,1.8);
      v41cParticles(q,r*(f.heavy?2:1.3)+22,f.color,ag,f.crit?16:f.heavy?12:7,f.heavy?TAU:3.4,.74,6+Math.round(f.at*5));
    }else if(f.kind==='skill'){
      v41cSkill(f,q,ratio);
    }else if(f.kind==='release'){
      g.rotate(ag);if(['blade','fan','shock','triple','frost'].includes(f.style))v41cSkill(f,q,ratio);
      else{v41cRing(12+q*47,.62,f.color,1.5);v41cParticles(q,53,f.color,0,8,TAU,.65,3);}
    }else if(f.kind==='death'){
      const im=imgs['v25mob'+f.type]?.img;if(im?.naturalWidth){const h=Math.min(bossType(f.type)?163:103,TYPES[f.type].scale*.66),w=h*im.naturalWidth/im.naturalHeight;g.save();g.globalAlpha*=.48;g.scale(f.dir<0?-1:1,1);g.drawImage(im,-w/2,-h+9*q,w,h);g.restore();}
      v41cParticles(q,57,f.color||'#e1c18f',0,9,TAU,ratio,5,true);
    }else if(f.kind==='land'||f.kind==='dash'){
      v41cRing(r*(.22+q*.77),ratio,f.color,1.3);v41cParticles(q,r*.8,'#d7c9a3',ag+Math.PI,8,Math.PI*1.3,ratio,5,true);
    }g.restore();
  }
  // Existing projectile cores remain; add only a slim fading wake in travel
  // direction. No giant glow or duplicate projectile silhouette.
  let n=0;for(const b of bolts){if(!b.good||!b.kind||++n>30)continue;const z=point(b);if(!onscreen(z))continue;const a=Math.atan2(b.vy*ratio,b.vx),l=b.kind==='blade'?76:b.kind==='shock'?52:39,c=b.color||v41cPalette(cls)[0];if(!/^#[0-9a-f]{6}$/i.test(c))continue;
    g.save();g.translate(z.x,z.y-13);g.rotate(a);const gr=g.createLinearGradient(-l,0,-9,0);gr.addColorStop(0,c+'00');gr.addColorStop(1,c+'a6');g.strokeStyle=gr;g.lineWidth=1.8;g.beginPath();g.moveTo(-l,0);g.lineTo(-8,0);g.stroke();g.restore();
  }
  V41_COMBAT.lastParticles=V41_COMBAT.maxParticles-V41_COMBAT.budget;
};
