'use strict';
// V25: all replaced actor artwork is independent from terrain and gameplay data.
for(const [key,url] of Object.entries(V25_ASSETS)){
 const img=new Image();imgs[key]={img,ready:false};img.onload=()=>{imgs[key].ready=true;};img.src=url;
}
const V25_DIR=['E','SE','S','SE','E','NE','N','NE'];
const V25_IDLE_COL=[1,0,0,0,1,2,3,2];
const V25_COLOR=['#a7ece0','#e9b16c','#d3b0ff'];
const v25PrevCell=v9DrawCell,v25PrevHero=v9HeroBody;
function v25Cell(key,index,c,r,x,y,size,flip=1,alpha=1,bob=0,sx=1,sy=1,tilt=0){
 const a=imgs[key];if(!a?.ready||!a.img.naturalWidth)return false;
 const sw=a.img.naturalWidth/c,sh=a.img.naturalHeight/r;
 g.save();g.translate(x,y-bob);g.scale(flip*sx,sy);g.rotate(tilt);g.globalAlpha*=alpha;
 g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 g.drawImage(a.img,(index%c)*sw,Math.floor(index/c)*sh,sw,sh,-size/2,-size*.875,size,size);g.restore();return true;
}
function v25Idle(cls,dir,x,y,size,alpha=1,breath=0){
 return v25Cell('v25idle',cls*4+V25_IDLE_COL[dir],4,3,x,y,size,V9_FLIP[dir],alpha,breath);
}
function v25RunKey(cls,dir){
 const same='v25run'+(cls===1?'B':cls===2?'M':V25_DIR[dir]);
 if(imgs[same]?.ready)return same;
 return 'v25run'+V25_DIR[dir];
}
// Preserve menu creation and the character panel: use the same new models everywhere.
v9DrawCell=function(id,i,cols,rows,x,y,size,flip=1,alpha=1,breath=0){
 const cls=v10PreviewClass??p?.cls??0;
 if(id==='idle9'&&imgs.v25idle?.ready){const dir=[6,7,0,1,2,3,4,5][i]??2;if(v25Idle(cls,dir,x,y,size,alpha,breath*size))return true;}
 if(V9_RUN.includes(id)){const d=V9_RUN.indexOf(id);if(v25Cell(v25RunKey(cls,d),i,4,3,x,y,size,flip,alpha))return true;}
 return v25PrevCell(id,i,cols,rows,x,y,size,flip,alpha,breath);
};
// Fixed anchor, phase carried across turns, and no animation-dependent collision offsets.
v9HeroBody=function(x,y,world){
 const cls=p.cls??0,dir=V8.dir??2,frame=((Math.floor(V8.phase)%12)+12)%12;
 const state=animation.name,alpha=p.hurt>0&&Math.floor(p.hurt*22)%2===0?.66:1;
 const size=124,flip=V9_FLIP[dir],runKey=v25RunKey(cls,dir);let ok=false;
 if(state==='run'||state==='dash'){
  if(state==='dash'){for(let j=3;j>=1;j--)v25Cell(runKey,frame,4,3,x-p.dx*13*j,y-p.dy*(world?10:13)*j,size,flip,.08+.055*(4-j));}
  ok=v25Cell(runKey,frame,4,3,x,y,size,flip,alpha);
 }else if(state==='attack'||state==='cast'){
  const cast=state==='cast',q=clamp(animation.t/(cast?.38:.28),0,.999),index=q<.125?0:q<.34?1:q<.76?2:3;
  const a=p.v10Action??p.attackAngle??(p.face<0?Math.PI:0),s=Math.cos(a)<0?-1:1;
  const reach=Math.sin(Math.PI*q)*(cast?3:6);
  ok=v25Cell('v25attack',cls*4+index,4,3,x+Math.cos(a)*reach,y+Math.sin(a)*reach*(world?HD.tilt:1),size,s,alpha);
 }else if(state==='hurt'){
  ok=v25Idle(cls,dir,x,y,size,alpha,-.6);
 }else ok=v25Idle(cls,dir,x,y,size,alpha,Math.sin(elapsed*2.1)*.33);
 if(!ok){v25PrevHero(x,y,world);return;}
 // Existing shield status has a restrained jade/amber rim, with no artificial weapon overlays.
 if(p.v10Guard>0){g.save();g.globalAlpha=.37;g.strokeStyle='#f3d09b';g.lineWidth=1.5;g.beginPath();g.ellipse(x,y-29,24,40,0,0,TAU);g.stroke();g.restore();}
};
const old25Focus=v10Focus;v10Focus=function(x,y,s,c,t){if(!imgs.v25idle?.ready)old25Focus(x,y,s,c,t);};

// Separate portrait-quality NPCs. Facing uses rear artwork if present; stride is an
// anchored deformation rather than sliding the whole figure over the terrain.
const v25OldFigure=v8Figure,v25OldNPC=v9NPCDraw;
function v25NPCArt(d,x,y,size,face=1,phase=0,walk=false,back=false){
 const i=v15NPCIndex(d),key=(back&&imgs['v25npcBack'+i]?.ready?'v25npcBack':'v25npc')+i,a=imgs[key];if(!a?.ready)return false;
 const im=a.img,h=size,w=h*im.naturalWidth/im.naturalHeight;
 const phi=phase*TAU,bob=walk?1.7*Math.abs(Math.sin(phi)):Math.sin(elapsed*1.8+i)*.3;
 g.save();g.translate(x,y);g.scale(face,1);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 for(let j=0;j<16;j++){
   const lo=j/16,hi=(j+1)/16,lower=clamp((lo-.57)/.43,0,1),l2=clamp((hi-.57)/.43,0,1);
   const phaseShift=walk?Math.sin(phi)*lower*1.7:0;
   const y0=-h+lo*h-bob*(1-lower),y1=-h+hi*h-bob*(1-l2);
   const k=1-(walk?.09*Math.abs(Math.sin(phi))*lower:0);
   g.drawImage(im,0,lo*im.naturalHeight,im.naturalWidth,(hi-lo)*im.naturalHeight,-w*k/2+phaseShift,y0,w*k,Math.max(.1,y1-y0+.22));
 }
 g.restore();return true;
}
v8Figure=function(d,x,y,scale=1,face=1,phase=0,walking=false){if(!v25NPCArt(d,x,y,78*scale,face,phase,walking))v25OldFigure(d,x,y,scale,face,phase,walking);};
v9NPCDraw=function(d,n,z){const dir=n.dir??2,phase=(n.gait||0)/12;if(!v25NPCArt(d,z.x,z.y,76,V9_FLIP[dir],phase,!!n.walking,dir>=5)){v25OldNPC(d,n,z);return;}const actor=v14Actor(d.id);if(actor?.sect&&dist(n,p)<360)hdEllipse(g,z.x,z.y+2,10,2,V14_S[actor.sect].color);};

// Distinct monster species: one image per true monster type, with state-driven
// visual anticipation, impact, recoil and locomotion. Combat timing is unchanged.
const v25OldWorldMonster=hdMonster,v25OldArenaMonster=monsterSprite;
function v25MonsterBody(e,z,world){
 const t=TYPES[e.type],boss=bossType(e.type),key='v25mob'+e.type,a=imgs[key];if(!a?.ready)return false;
 const im=a.img,ranged=t.ranged||e.type===2,quad=[0,3,5,8,10,12,13,16].includes(e.type),serpent=[6,15].includes(e.type),ghost=[2,10,17].includes(e.type);
 const h=boss?Math.min(163,t.scale*.68):Math.min(103,t.scale*.66),w=h*im.naturalWidth/im.naturalHeight;
 let xx=0,yy=0,sx=1,sy=1,tilt=0,flash=e.flash>0;
 const ang=e.angle??(e.dir<0?Math.PI:0),flip=e.dir<0?-1:1;
 if(e.state==='wind'){
   const q=clamp(e.timer/Math.max(.2,t.wind),0,1);sx=1+.045*q;sy=1-.13*q;tilt=-flip*.055*q;xx=-Math.cos(ang)*q*(boss?8:4);
 }else if(e.state==='attack'){
   const q=clamp(e.timer/.24,0,1),hit=Math.sin(Math.PI*Math.min(1,q*1.13));
   xx=Math.cos(ang)*hit*(ranged?3:boss?17:11);yy=Math.sin(ang)*hit*(world?HD.tilt:1)*7;sy=1+.07*hit;sx=1+.10*hit;tilt=flip*.09*hit;
 }else if(e.state==='recover'){
   const q=clamp(e.timer/Math.max(.1,t.cd),0,1);sy=1-.065*(1-q);tilt=-flip*.04*(1-q);
 }else if(e.state==='chase'||e.state==='patrol'){
   const q=elapsed*(quad?10:7.5)+e.x*.027;yy=-Math.abs(Math.sin(q))*(quad?2.4:1.1);sy=1+Math.sin(q)*.021;tilt=Math.sin(q)*.027;
 }else sy=1+.012*Math.sin(elapsed*2.3+e.x*.02);
 if(ghost)yy-=2+Math.sin(elapsed*3+e.y)*1.5;
 if(serpent)sx*=1+Math.sin(elapsed*3+e.x*.02)*.025;
 hdEllipse(g,z.x,z.y+(ghost?3:1),t.r*.92,t.r*.34,'#101b1c91');
 g.save();g.translate(z.x+xx,z.y+yy);g.scale(flip*sx,sy);g.rotate(tilt);g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.globalAlpha=flash?.77:1;
 // Authored strike poses are selected during impact when available.
 const action=imgs['v25mobHit'+e.type];
 const selected=e.state==='attack'&&action?.ready?action.img:im,sw=h*selected.naturalWidth/im.naturalHeight,sh=h*selected.naturalHeight/im.naturalHeight;
 g.drawImage(selected,-sw/2,-sh,sw,sh);g.restore();
 if(e.burn>0)circle(z.x,z.y-17,8,'#f59a57','',.35);
 const labelY=z.y-h-10,bw=boss?112:48;
 if(!boss)bar(z.x-bw/2,labelY,bw,4,e.hp/e.max,'#a86453','');else text('✦',z.x,labelY-8,13,C.gold,'center','bold');
 if(world&&dist(e,p)<=550){const d=v22Region(e),lv=v22EnemyLevel(e),col=lv>p.level+4?'#ff9992':lv<p.level-5?'#a2b8a6':d.color;g.save();g.shadowColor='#081116';g.shadowBlur=4;text((boss?t.name+' · ':'')+'Lv '+lv,z.x,labelY-(boss?22:10),12,col,'center','bold');g.restore();}
 return true;
}
hdMonster=function(e,z){if(!v25MonsterBody(e,z,true))v25OldWorldMonster(e,z);};
monsterSprite=function(e){if(!v25MonsterBody(e,e,false))v25OldArenaMonster(e);};

// Refined directional attack visuals: small particles keyed to real effects.
function v25ImpactDetails(v){for(const f of fx){if(!['punch','castseal','v11burst','v11cut','slash'].includes(f.kind))continue;const q=clamp(1-f.life/f.max,0,1);if(q>.78)continue;const z=p.worldMode?hdPoint(f.x,f.y,v):f,ang=f.a||0,col=f.color||V25_COLOR[p.cls??0];g.save();g.translate(z.x,z.y-28);g.scale(1,p.worldMode?HD.tilt:1);g.rotate(ang);g.globalAlpha=(1-q)*.75;
 for(let i=0;i<6;i++){const a=(i-2.5)*.32,rad=(f.radius||50)*(.33+q*.65),xx=rad*Math.cos(a),yy=rad*Math.sin(a);g.strokeStyle=i%2?'#fff1ce':col;g.lineWidth=1.1;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx-7*(1-q),yy*.90);g.stroke();}g.restore();}}
const v25WorldFx=hdEffects,v25ArenaFx=renderEffects;
hdEffects=function(v){v25WorldFx(v);v25ImpactDetails(v);};renderEffects=function(){v25ArenaFx();v25ImpactDetails();};

// V26 — layered combat choreography, fixed simulation ticks and V25's original art.
// No combat state is persisted: loading or crossing between world/arena cancels actions.
const V26={owner:null,scope:'',clock:0,stage:0,chainUntil:0,hits:0,hitUntil:0,action:null,source:null,fx:[],reactions:new WeakMap(),hurt:null,dash:null,queued:null,freeze:0};
const V26_COMBOS=[
 [{name:'Thanh Phong Trảm',dur:.32,at:.105,mul:.91,arc:1.05,reach:1,knock:8},{name:'Lưu Vân Hồi Kiếm',dur:.34,at:.115,mul:1.04,arc:1.22,reach:1.04,knock:12},{name:'Phá Vân Tam Trảm',dur:.47,at:.18,mul:1.40,arc:1.30,reach:1.15,knock:27}],
 [{name:'Khai Sơn Quyền',dur:.32,at:.105,mul:1,arc:1.10,reach:1,knock:13},{name:'Liệt Địa Chưởng',dur:.36,at:.13,mul:1.15,arc:1.18,reach:1.06,knock:20},{name:'Kim Cương Bạo Quyền',dur:.49,at:.19,mul:1.53,arc:1.28,reach:1.17,knock:40}],
 [{name:'Linh Tinh Chỉ',dur:.33,at:.11,mul:.94},{name:'Song Nguyệt Phù',dur:.37,at:.13,mul:1.13},{name:'Tam Tinh Tụ Linh',dur:.49,at:.18,mul:1.46}]
];
const V26_SKILL_TIMING={blade:[.43,.17],fan:[.46,.19],storm:[.56,.23],fall:[.65,.31],shock:[.46,.18],guard:[.44,.15],quake:[.56,.25],crush:[.64,.30],triple:[.45,.19],frost:[.48,.21],lightning:[.60,.27],blizzard:[.66,.31]};
function v26Scope(){return p?(p.worldMode?'world':'arena:'+room+':'+tower):'';}
function v26Reset(){Object.assign(V26,{owner:p,scope:v26Scope(),clock:0,stage:0,chainUntil:0,hits:0,hitUntil:0,action:null,source:null,fx:[],reactions:new WeakMap(),hurt:null,dash:null,queued:null,freeze:0});}
function v26Ensure(){if(V26.owner!==p||V26.scope!==v26Scope())v26Reset();}
function v26Add(kind,x,y,color,dur,more={}){if(V26.fx.length>=120)V26.fx.shift();V26.fx.push({kind,x,y,color,at:V26.clock,dur,...more});}
function v26Face(a){p.face=Math.cos(a)<0?-1:1;p.attackAngle=p.v10Action=a;V8.dir=v9Dir(Math.cos(a),Math.sin(a),V8.dir??2,!!p.worldMode,0);p.v9Facing=V8.dir;}
function v26CanAct(){return p&&mode==='play'&&!modal&&!failed&&p.hp>0&&p.dashT<=0&&p.hurt<=0;}
function v26Cancel(resetChain=true){
 const a=V26.action;
 if(a?.kind==='attack')p.attackT=0;
 else if(a?.kind==='skill'){
  p.castT=0;
  if(!a.hit&&mode==='play'&&!modal)message('Đã ngắt vận chiêu · linh lực được giữ lại');
 }
 V26.action=null;V26.queued=null;V26.freeze=0;
 if(resetChain){V26.stage=0;V26.chainUntil=0;}
}
function v26TryAttack(a,buffer=true){v26Ensure();if(!v26CanAct())return false;
 if(V26.action||p.atkCd>0||p.castT>0){if(buffer&&V26.action?.kind==='attack'&&V26.action.hit&&V26.action.dur-V26.action.t<.18)V26.queued={a,until:V26.clock+.24};return false;}
 const cls=p.cls??0,stage=V26.clock<=V26.chainUntil?V26.stage%3+1:1,d=V26_COMBOS[cls][stage-1],s=currentStats(),rate=clamp(s.rate,.65,2.2),dur=d.dur/rate;
 V26.stage=stage;V26.chainUntil=V26.clock+dur+.62;V26.action={kind:'attack',cls,stage,a,d,t:0,vis:0,dur,impact:d.at/rate,hit:false,s};
 p.attackT=dur;p.atkCd=dur;v26Face(a);animation.name='attack';animation.t=0;return true;
}
attack=function(){return v26TryAttack(targetAngle());};
function v26Push(e,a,amount){if(e.dead||!amount)return;const k=bossType(e.type)?.18:1,x=e.x+Math.cos(a)*amount*k,y=e.y+Math.sin(a)*amount*k;
 if(p.worldMode)owMove(e,x,y,Math.max(8,TYPES[e.type].r*.5));else{e.x=clamp(x,AREA.l+15,AREA.r-15);e.y=clamp(y,AREA.t+15,AREA.b-15);blockCollision(e,TYPES[e.type].r*.65);}}
function v26Normal(a){const {cls,stage,d,s}=a,col=V25_COLOR[cls],ang=a.a;
 v26Add('strike',p.x,p.y,col,stage===3?.45:.32,{a:ang,cls,stage,r:s.range*(d.reach||1)});
 if(cls===2){const spreads=stage===1?[0]:stage===2?[-.075,.075]:[-.13,0,.13];for(const da of spreads){const crit=random()<s.crit;v10Projectile(ang+da,530+stage*25,s.range/530+.08,10+stage*2,s.attack*d.mul*(crit?s.critMultiplier:1)/spreads.length,'orb',1);const b=bolts.at(-1);b.crit=crit;b.v26Stage=stage;b.v26Slow=stage===3?.65:0;}return;}
 for(const e of enemies){if(e.dead)continue;const t=TYPES[e.type],ea=Math.atan2(e.y-p.y,e.x-p.x);if(dist(p,e)>s.range*d.reach+t.r||Math.abs(angleDelta(ea,ang))>d.arc)continue;
  if(p.worldMode&&!v8Line(p,e,5,true))continue;
  const crit=random()<s.crit;hit(e,s.attack*d.mul*(crit?s.critMultiplier:1),crit);v26Push(e,ang,d.knock);}
}
// Commit mana and cooldown when the skill is released.
v11Cast=function(i=0){v26Ensure();if(!p||i<0||i>3)return false;const d=V11_SKILLS[p.cls][i],n=v11Rank(i);if(!n){message('Chưa học kỹ năng · T');return false;}if(p.mp<d.cost){message('Không đủ linh lực');return false;}if(!v26CanAct()||p.castT>0||v11Cooldowns()[i]>0)return false;
 if(V26.action){if(V26.action.kind!=='attack'||!V26.action.hit)return false;v26Cancel(false);}
 const a=Math.atan2(mouse.y-p.y,mouse.x-p.x),m=V26_SKILL_TIMING[d.kind],point=v11AimPoint(a,d.kind==='crush'?260:d.kind==='fall'?400:d.kind==='lightning'?440:410),s=currentStats();
 p.castT=m[0];v26Face(a);
 V26.action={kind:'skill',cls:p.cls,i,a,d,n,s,point,t:0,vis:0,dur:m[0],impact:m[1],hit:false};animation.name='cast';animation.t=0;return true;
};
cast=function(){v11Cast(0);};
function v26Blast(x,y,r,dmg,kind,col,knock=0,slow=0){v26Add('skill',x,y,col,.76,{style:kind,r});for(const e of enemies){if(e.dead||dist(e,{x,y})>r+TYPES[e.type].r*.5)continue;const a=Math.atan2(e.y-y,e.x-x);hit(e,dmg);if(slow)e.slow=Math.max(e.slow||0,slow);v26Push(e,a,knock);}}
function v26Release(a){const {d,n,s,i,point}=a,col=d.color,dmg=s.spellAtk*(1+.18*(n-1)),ang=a.a;
 const launch=(speed,life,r,damage,kind,pierce,angle=ang)=>{v11Shot(angle,speed,life,r,damage,kind,pierce,col);const b=bolts.at(-1);b.v26Stage=3;b.v26Slow=d.kind==='frost'?1.8:d.kind==='triple'?.8:0;};
 v26Add('release',p.x,p.y,col,.42,{style:d.kind,a:ang,cls:p.cls,r:85});
 switch(d.kind){
  case'blade':launch(700,1.08,14,dmg,'blade',2);break;
  case'fan':for(const j of [-1,0,1])launch(680,.85,12,dmg*.64,'blade',2,ang+j*.18);break;
  case'storm':v26Blast(p.x,p.y,162,dmg*1.28,'storm',col);break;
  case'fall':v26Blast(point.x,point.y,126,dmg*1.85,'fall',col);break;
  case'shock':p.v10Guard=2.6;launch(470,.47,33,dmg,'shock',3);break;
  case'guard':p.v10Guard=4+.35*(n-1);p.hp=Math.min(s.hp,p.hp+s.hp*(.08+.02*(n-1)));v26Add('skill',p.x,p.y,col,.75,{style:'guard',r:62});break;
  case'quake':v26Blast(p.x,p.y,148,dmg*1.35,'quake',col,75);break;
  case'crush':v26Blast(point.x,point.y,155,dmg*1.85,'crush',col,90);break;
  case'triple':for(const j of [-1,0,1])launch(530,1.05,12,dmg*.58,'orb',1,ang+j*.23);break;
  case'frost':launch(420,1.1,26,dmg*1.3,'frost',2);break;
  case'lightning':v26Blast(point.x,point.y,138,dmg*1.45,'lightning',col,0,2);break;
  case'blizzard':v26Blast(point.x,point.y,190,dmg*1.65,'blizzard',col,0,3.2);break;
 }
}
const v26OldHit=hit;hit=function(e,dmg,crit=false){if(e.dead)return;v26Ensure();const hp=e.hp,x=e.x,y=e.y,angle=Math.atan2(y-p.y,x-p.x),heavy=V26.source?.stage===3||V26.source?.kind==='skill'||crit;
 v26OldHit(e,dmg,crit);if(!(e.hp<hp))return;
 if(V26.clock>V26.hitUntil)V26.hits=0;V26.hits++;V26.hitUntil=V26.clock+1.6;
 V26.reactions.set(e,{at:V26.clock,dur:heavy?.25:.17,a:angle,heavy});
 if(heavy&&!bossType(e.type)&&!e.dead){e.state='recover';e.timer=0;e.cd=Math.max(e.cd||0,.25);}
 const col=crit?'#ffe593':V25_COLOR[p.cls??0];v26Add('impact',x,y,col,.36,{a:angle,heavy,crit,r:TYPES[e.type].r});
 if(e.dead)v26Add('death',x,y,TYPES[e.type].color,.46,{type:e.type,dir:e.dir});
 if(heavy){V26.freeze=Math.max(V26.freeze,.045);shakes=Math.max(shakes,crit?4:2.8);}
};
function v26BoltHit(e,b){const old=V26.source;V26.source={kind:b.spell?'skill':'attack',stage:b.v26Stage||1};try{hit(e,b.dmg,!!b.crit);if(b.v26Slow&&!e.dead)e.slow=Math.max(e.slow||0,b.v26Slow);}finally{V26.source=old;}}
const v26OldDamage=damagePlayer;damagePlayer=function(n){if(!p)return;v26Ensure();const owner=p,hp=p.hp,x=p.x,y=p.y;const r=v26OldDamage(n);if(p===owner&&p.hp<hp&&p.hurt>0&&Math.hypot(p.x-x,p.y-y)<200){const e=enemies.filter(e=>!e.dead).sort((a,b)=>dist(a,p)-dist(b,p))[0];V26.hurt={at:V26.clock,a:e?Math.atan2(y-e.y,x-e.x):Math.PI,dur:.28};v26Cancel();v26Add('impact',x,y,'#ffb299',.3,{a:V26.hurt.a,heavy:true,r:19});}return r;};
// A swept dash follows collision geometry; only the rendered sprite rises off the ground.
const V26_DASH_DUR=.26;
function v26DashStep(dt,world){v26Ensure();if(!V26.dash||V26.dash.land){v26Cancel();V26.dash={start:V26.clock,path:[],last:V26.clock,world,dir:v9Dir(p.dx,p.dy,V8.dir??2,world,0),land:0};v26Add('dash',p.x,p.y,V25_COLOR[p.cls],.36,{a:Math.atan2(p.dy,p.dx),r:43});}
 const d=V26.dash,step=Math.min(dt,p.dashT),q=clamp(1-p.dashT/V26_DASH_DUR,0,1),speed=(world?158:145)/V26_DASH_DUR*(.63+.58*Math.sin(Math.PI*q));const x=p.x,y=p.y;
 if(world)owMove(p,p.x+p.dx*speed*step,p.y+p.dy*speed*step,17);else{const n=Math.max(1,Math.ceil(speed*step/7));for(let i=0;i<n;i++){p.x=clamp(p.x+p.dx*speed*step/n,AREA.l+24,AREA.r-24);p.y=clamp(p.y+p.dy*speed*step/n,AREA.t+24,AREA.b-24);blockCollision(p,17);}}
 p.dashT=Math.max(0,p.dashT-step);V8.dir=d.dir;p.v9Facing=d.dir;const lift=25*Math.sin(Math.PI*q);
 if(d.path.length===0||V26.clock-d.last>=.032){d.path.push({x,y,lift,at:V26.clock,frame:Math.floor(V8.phase+q*11)%12});d.last=V26.clock;if(d.path.length>9)d.path.shift();}
 if(p.dashT<=.00001){p.dashT=0;d.land=V26.clock;v26Add('land',p.x,p.y,V25_COLOR[p.cls],.42,{r:48,a:Math.atan2(p.dy,p.dx)});}
}
// One action clock, physics updates remain at 60 ticks/sec; no damage in draw().
const v26OldUpdate=update;update=function(dt){if(!p||mode!=='play')return v26OldUpdate(dt);v26Ensure();const owner=p,scope=v26Scope(),beforeX=p.x,beforeY=p.y;
 if(!modal){V26.clock+=dt;V26.fx=V26.fx.filter(f=>V26.clock-f.at<f.dur);V26.freeze=Math.max(0,V26.freeze-dt);if(V26.clock>V26.chainUntil&&!V26.action)V26.stage=0;if(V26.clock>V26.hitUntil)V26.hits=0;
  if(V26.dash?.land&&V26.clock-V26.dash.land>.30)V26.dash=null;
  const dashPressed=(pressed.Space||pressed.ShiftLeft||pressed.ShiftRight||pressed.KeyK)&&p.dashCd<=0;
  if(p.hurt>0||p.dashT>0||dashPressed)v26Cancel();
  const a=V26.action;if(a){a.t+=dt;if(V26.freeze<=0)a.vis=Math.min(a.dur,a.vis+dt);
    if(!a.hit&&a.t>=a.impact){
     if(a.kind==='skill'&&p.mp<a.d.cost){
       v26Cancel();message('Không đủ linh lực để thi triển');
     }else{
       a.hit=true;
       if(a.kind==='skill'){
         p.mp-=a.d.cost;v11Cooldowns()[a.i]=a.d.cd;
         if(a.i===0)p.v10SkillCd=a.d.cd;
       }
       V26.source=a;
       try{if(a.kind==='attack')v26Normal(a);else v26Release(a);}finally{V26.source=null;}
     }
   }
    if(a.t>=a.dur){V26.action=null;if(a.kind==='attack')p.attackT=0;else p.castT=0;}
  }
  if(!V26.action&&V26.queued){const q=V26.queued;if(q.until<V26.clock)V26.queued=null;else if(p.atkCd<=dt+.001&&p.castT<=0){V26.queued=null;p.atkCd=0;v26TryAttack(q.a,false);}}
 }
 const r=v26OldUpdate(dt);if(p!==owner||v26Scope()!==scope||Math.hypot(p.x-beforeX,p.y-beforeY)>1000)v26Reset();return r;
};

// Actor choreography: same anchored art, distinct timing, silhouette and motion for each chain.
const v26OldHero=v9HeroBody;v9HeroBody=function(x,y,world){v26Ensure();const cls=p.cls??0,dir=V8.dir??2,flip=V9_FLIP[dir],a=V26.action;
 if(p.dashT>0&&V26.dash){const d=V26.dash,q=clamp(1-p.dashT/V26_DASH_DUR,0,1),lift=25*Math.sin(Math.PI*q),k=v25RunKey(cls,d.dir),f=Math.floor(V8.phase+q*11)%12;
  hdEllipse(g,x,y,17+q*7,5,'#101b1c65');v25Cell(k,f,4,3,x,y,124,V9_FLIP[d.dir],1,lift,1.04,.99,.03*V9_FLIP[d.dir]);return;}
 if(a&&p.hurt<=0){const q=clamp(a.vis/a.dur,0,.999),impact=a.impact/a.dur,u=q<impact?q/impact:(q-impact)/(1-impact),wind=q<impact,idx=wind?(u<.3?0:1):(u<.52?2:3),s=Math.cos(a.a)<0?-1:1;
  const stretch=wind?-.045*Math.sin(Math.PI*u):.07*Math.sin(Math.PI*u),step=(wind?-3*Math.sin(Math.PI*u):((a.stage||1)*2+5)*Math.sin(Math.PI*u)),tilt=(a.kind==='skill'?.018:a.stage===2?-.09:.065)*Math.sin(Math.PI*q)*s;
  if(a.d?.kind==='guard')v25Idle(cls,dir,x,y,124,1,2*Math.sin(Math.PI*q));else v25Cell('v25attack',cls*4+idx,4,3,x+Math.cos(a.a)*step,y+Math.sin(a.a)*step*(world?HD.tilt:1),124,s,1,a.stage===3?4*Math.sin(Math.PI*q):0,1+stretch,1-stretch*.6,tilt);
  if(a.kind==='skill'&&!a.hit)v26Charge(x,y,a,world);return;}
 if(p.hurt>0&&V26.hurt){const u=clamp((V26.clock-V26.hurt.at)/V26.hurt.dur,0,1),r=Math.sin(Math.PI*u),ang=V26.hurt.a;v25Cell('v25idle',cls*4+V25_IDLE_COL[dir],4,3,x+Math.cos(ang)*9*r,y+Math.sin(ang)*5*r,124,flip,.86+.14*u,0,1+.08*r,1-.06*r,.1*r*flip);return;}
 v26OldHero(x,y,world);
};
const v26OldMob=v25MonsterBody;v25MonsterBody=function(e,z,world){const a=V26.reactions.get(e);if(!a)return v26OldMob(e,z,world);const u=clamp((V26.clock-a.at)/a.dur,0,1);if(u>=1)return v26OldMob(e,z,world);const k=Math.sin(Math.PI*u)*(a.heavy?11:5)*(bossType(e.type)?.35:1),x=Math.cos(a.a)*k,y=Math.sin(a.a)*k*(world?HD.tilt:1);g.save();g.translate(x,y);const ok=v26OldMob(e,z,world);g.restore();return ok;};

// Painted-style energy using tapered geometry rather than blocks or opaque additive overlays.
function v26Line(a,b,col,w=1){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
function v26Ellipse(r,ratio,col,w=2,rot=0){g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.ellipse(0,0,Math.max(1,r),Math.max(1,r*ratio),rot,0,TAU);g.stroke();}
function v26Sword(x,y,ang,l,col,alpha=1){g.save();g.translate(x,y);g.rotate(ang);g.globalAlpha*=alpha;const gr=g.createLinearGradient(-l*.7,0,l*.5,0);gr.addColorStop(0,col+'00');gr.addColorStop(.55,col);gr.addColorStop(1,'#ffffff');g.fillStyle=gr;g.beginPath();g.moveTo(l*.58,0);g.lineTo(-l*.28,-l*.055);g.lineTo(-l*.70,0);g.lineTo(-l*.28,l*.055);g.closePath();g.fill();v26Line([-l*.25,0],[l*.46,0],'#ffffff',1.4);v26Line([-l*.30,-l*.11],[-l*.30,l*.11],col,2);g.restore();}
function v26Crescent(r,a0,a1,width,col,alpha=1){g.save();g.globalAlpha*=alpha;const steps=32;g.fillStyle=col;g.beginPath();for(let i=0;i<=steps;i++){const u=i/steps,a=a0+(a1-a0)*u;const point=[Math.cos(a)*r,Math.sin(a)*r];if(i===0)g.moveTo(...point);else g.lineTo(...point);}for(let i=steps;i>=0;i--){const u=i/steps,a=a0+(a1-a0)*u,rr=r-width*Math.sin(Math.PI*u)**.68;g.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}g.closePath();g.fill();g.strokeStyle='#fff9e7';g.lineWidth=1.6;g.beginPath();g.arc(0,0,r,a0,a1);g.stroke();g.restore();}
function v26Charge(x,y,a,world){const q=clamp(a.t/a.impact,0,1),col=a.d.color;g.save();g.translate(x,y-48);g.globalAlpha=.36+.6*q;g.shadowColor=col;g.shadowBlur=9;
 if(a.cls===0){for(let i=0;i<3;i++){const t=V26.clock*5+i*TAU/3;v26Sword(Math.cos(t)*(37-10*q),Math.sin(t)*14,t+.7,40,col,.65);} }
 else if(a.cls===1){g.translate(Math.cos(a.a)*18,4);v26Ellipse(12+19*q,.8,col,2);v26Ellipse(7+13*q,.8,'#fff4c7',1.4);for(let i=0;i<6;i++){const t=i*TAU/6+q;v26Line([Math.cos(t)*32,Math.sin(t)*16],[Math.cos(t)*18,Math.sin(t)*9],col,1.5);}}
 else{v26Ellipse(23+q*11,.66,col,1.6,V26.clock);for(let i=0;i<3;i++){let t=V26.clock*4+i*TAU/3;circle(Math.cos(t)*25,Math.sin(t)*15,3+3*q,col,'#fff');}}
 g.restore();}
function v26Sparks(q,r,col,ang,count=10){for(let i=0;i<count;i++){const a=ang+(i/count-.5)*3.6,rr=r*(.18+.78*q)*(1+(i%3)*.15);const x=Math.cos(a)*rr,y=Math.sin(a)*rr*.76;v26Line([x,y],[x-Math.cos(a)*(8+10*(1-q)),y-Math.sin(a)*8],i%3===0?'#fffbe7':col,i%3===0?1.8:1);}}
function v26DrawSkill(f,q){const col=f.color,r=f.r||85,k=f.style,fade=1-q;g.shadowColor=col;g.shadowBlur=8;
 if(k==='blade'||k==='fan'){for(const j of k==='fan'?[-1,0,1]:[0])v26Sword((25+q*88)*Math.cos(j*.25),(25+q*88)*Math.sin(j*.25),j*.25,64,col,fade);}
 else if(k==='storm'){for(let i=0;i<8;i++){const a=i*TAU/8+q*2.9,rr=r*(.32+.69*q);v26Sword(Math.cos(a)*rr,Math.sin(a)*rr*.65,a+Math.PI/2,68,col,fade);}g.scale(1,.67);v26Crescent(r*(.4+.65*q),q*4,q*4+2.5,18,col,fade);}
 else if(k==='fall'){for(const i of [-1,0,1]){const x=i*r*.34,y=-155*(1-Math.min(1,q*2.6));v26Sword(x,y-38,Math.PI/2,105,col,fade);}v26Ellipse(r*(.15+.75*q),.62,col,3);v26Sparks(q,r,col,Math.PI/2,15);}
 else if(k==='shock'){g.scale(1,.70);for(let i=0;i<3;i++)v26Crescent(r*(.34+q*.67)+i*12,-.72,.72,12-i*2,col,fade);}
 else if(k==='guard'){g.globalAlpha*=.84;for(let j=0;j<2;j++)v26Ellipse(r*(.65+.27*q+j*.18),.9,col,j?1:3,q*.5);for(let i=0;i<6;i++){const t=i*TAU/6;v26Line([Math.cos(t)*r*.81,Math.sin(t)*r*.81],[Math.cos(t+TAU/6)*r*.81,Math.sin(t+TAU/6)*r*.81],col,2);}}
 else if(k==='quake'||k==='crush'){const rr=r*(.17+.85*q);v26Ellipse(rr,.61,col,3);v26Ellipse(Math.max(1,rr-17),.61,'#fff3cd',1.4);for(let i=0;i<9;i++){const a=i*TAU/9+.14,xx=Math.cos(a)*rr,yy=Math.sin(a)*rr*.62;g.strokeStyle=col;g.lineWidth=1.8;g.beginPath();g.moveTo(xx*.2,yy*.2);g.lineTo(xx*.5+6,yy*.47-8);g.lineTo(xx*.7-4,yy*.71+7);g.lineTo(xx,yy);g.stroke();}if(k==='crush')for(const j of [-1,0,1])v26Line([j*23,-120*(1-q)],[j*23,0],j?'#ffcb78':'#fff6cc',j?3:7);v26Sparks(q,r,col,.8,16);}
 else if(k==='triple'||k==='frost'){const n=k==='triple'?3:1;for(let i=0;i<n;i++){const x=28+q*66,y=(i-(n-1)/2)*(20+q*13);g.save();g.translate(x,y);const rr=k==='frost'?18:9;circle(0,0,rr,col,'#f4ffff');v26Ellipse(rr*1.4,.48,'#fff',1.3,q*5);g.restore();}}
 else if(k==='lightning'){for(let i=-1;i<=1;i++){const x=i*r*.34,pts=[[x+8,-175],[x-12,-130],[x+18,-91],[x-9,-47],[x+6,-24],[x,0]];g.beginPath();g.moveTo(...pts[0]);for(const pt of pts.slice(1))g.lineTo(...pt);g.strokeStyle=col;g.lineWidth=7*(1-q)+1;g.stroke();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();}v26Ellipse(r*(.3+.65*q),.6,col,2);}
 else if(k==='blizzard'){v26Ellipse(r*(.4+.60*q),.6,col,2);for(let i=0;i<18;i++){const a=i*2.399+q*.6,rr=r*Math.sqrt((i+1)/18),x=Math.cos(a)*rr,y=Math.sin(a)*rr*.6;g.save();g.translate(x,y-12*(1-q));g.rotate(a);g.fillStyle=col;g.beginPath();g.moveTo(0,-22-12*(1-q));g.lineTo(5,-4);g.lineTo(0,5);g.lineTo(-5,-4);g.closePath();g.fill();v26Line([0,-16],[0,2],'#fff',1);g.restore();}}
}
function v26Render(v){if(!p)return;const world=!!p.worldMode,point=f=>world?hdPoint(f.x,f.y,v):f,cls=p.cls??0;
 // Historical positions, not repeated copies sliding behind the current position.
 const d=V26.dash;if(d){for(const t of d.path){const age=V26.clock-t.at;if(age>.27)continue;const z=point(t);v25Cell(v25RunKey(cls,d.dir),t.frame,4,3,z.x,z.y,124,V9_FLIP[d.dir],.33*(1-age/.27),t.lift);}}
 for(const f of V26.fx){const z=point(f),q=clamp((V26.clock-f.at)/f.dur,0,1);if(z.x<-250||z.y<-250||z.x>W/(world?V11_ZOOM:1)+250||z.y>H/(world?V11_ZOOM:1)+250)continue;
  g.save();g.translate(z.x,z.y-(f.kind==='impact'?35:f.kind==='strike'||f.kind==='release'?28:0));g.globalAlpha=(1-q)**.66;g.shadowColor=f.color;g.shadowBlur=6;
  const r=f.r||70,ang=Math.atan2(Math.sin(f.a||0)*(world?HD.tilt:1),Math.cos(f.a||0));if(f.kind==='strike'){g.rotate(ang);if(f.cls===0){g.scale(1,.75);const start=-1.17+q*.8,rr=r*(.65+.50*q);v26Crescent(rr,start,start+1.9,18+f.stage*3,f.color,.78);if(f.stage===2)v26Crescent(rr*.86,-.95-q*.3,.52-q*.3,12,'#c5f8ff',.65);if(f.stage===3){g.rotate(-.52);v26Crescent(rr*1.03,-.95,1.15,13,'#fff4be',.80);}}else if(f.cls===1){for(let i=0;i<f.stage+1;i++){const rr=r*(.38+q*.61)+i*12;v26Crescent(rr,-.58,.58,8,f.color,.8);}v26Sparks(q,r,f.color,0,9);}else{for(let i=0;i<f.stage;i++){let y=(i-(f.stage-1)/2)*22;g.save();g.translate(20+q*72,y);v26Ellipse(12+4*q,.7,f.color,2);circle(0,0,5,f.color,'#fff');g.restore();}}}
  else if(f.kind==='impact'){v26Sparks(q,r*(f.heavy?2.7:1.8)+16,f.color,ang,f.heavy?14:8);g.rotate(ang);v26Line([-13*(1-q),0],[13*(1-q),0],'#fff6d6',f.heavy?3:1.7);if(f.heavy)v26Ellipse(7+q*23,.76,f.color,1.7);}
  else if(f.kind==='death'){const im=imgs['v25mob'+f.type]?.img;if(im?.naturalWidth){const h=Math.min(bossType(f.type)?163:103,TYPES[f.type].scale*.66),w=h*im.naturalWidth/im.naturalHeight;g.globalAlpha*=.5;g.scale(f.dir<0?-1:1,1);g.drawImage(im,-w/2,-h+9*q,w,h);}}
  else if(f.kind==='land'||f.kind==='dash'){v26Ellipse(r*(.3+q*.9),.45,f.color,2);g.rotate(ang);v26Sparks(q,r*.9,'#d8dac0',0,6);}
  else if(f.kind==='release'){g.rotate(ang);if(['blade','fan','shock','triple','frost'].includes(f.style))v26DrawSkill(f,q);else{v26Ellipse(18+q*48,.7,f.color,2);v26Sparks(q,60,f.color,0,8);}}
  else if(f.kind==='skill')v26DrawSkill(f,q);g.restore();
 }
}
const v26OldHD=hdEffects,v26OldFX=renderEffects;hdEffects=function(v){v26OldHD(v);v26Render(v);};renderEffects=function(){v26OldFX();v26Render();};
function v26HUD(){if(!p||modal||mode!=='play'||(!V26.stage&&!V26.hits&&!V26.action))return;const a=V26.action,cls=p.cls??0,col=V25_COLOR[cls],name=a?.kind==='skill'?a.d.name:V26.stage?V26_COMBOS[cls][V26.stage-1].name:'Liên kích';
 const x=W/2,y=127;g.save();g.shadowColor='#101a1a';g.shadowBlur=6;text(name,x,y,16,col,'center','bold');g.shadowBlur=0;for(let i=0;i<3;i++){const xx=x-26+i*26;diamond(g,xx,y+22,6,i<V26.stage?col:'#485e5c');}if(V26.hits)text(V26.hits+' LIÊN KÍCH',x,y+41,12,'#ffe7af','center','bold');if(a&&!a.hit){box(x-62,y+53,124,4,'#253531aa',null,2);box(x-62,y+53,124*clamp(a.t/a.impact,0,1),4,col,null,2);}g.restore();}
const v26WorldHUD=worldHud,v26ArenaHUD=hud;worldHud=function(){v26WorldHUD();v26HUD();};hud=function(){v26ArenaHUD();v26HUD();};

