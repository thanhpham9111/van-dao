'use strict';
// V27: deterministic monster state machines; actions own their telegraph and hit geometry.
const V27={owner:null,scope:'',ai:new WeakMap(),fx:[],clock:0};
const V27_BOOK={
 claw:{name:'Liệt Trảo',shape:'sector',reach:96,arc:.86,wind:.64,mul:.92},
 pounce:{name:'Lang Ảnh Đột Kích',shape:'line',reach:218,width:31,wind:.85,mul:1.12,lunge:true},
 sweep:{name:'Hoành Tảo',shape:'sector',reach:153,arc:1.26,wind:.92,mul:1.12},
 crush:{name:'Phá Giáp Trấn Địa',shape:'circle',reach:116,wind:1.06,mul:1.24,breakGuard:true},
 burst:{name:'Linh Khí Bạo Phát',shape:'circle',reach:151,wind:1.12,mul:1.18},
 ring:{name:'Hoàn Nguyệt Chấn',shape:'ring',reach:212,inner:76,wind:1.1,mul:1.18},
 shot:{name:'Linh Mang',shape:'fan',reach:320,arc:.14,wind:.78,mul:.91,count:1,speed:260},
 fan:{name:'Vạn Mang Tán Xạ',shape:'fan',reach:350,arc:.64,wind:1.0,mul:.91,count:5,speed:255},
 poison:{name:'Độc Vân Hãm Địa',shape:'target',reach:96,wind:1.06,mul:1.03,status:'poison'},
 ice:{name:'Băng Liên Nở Rộ',shape:'target',reach:117,wind:1.12,mul:1.1},
 fire:{name:'Xích Viêm Phún Tức',shape:'sector',reach:220,arc:.56,wind:.98,mul:1.18,status:'fire'},
 lightning:{name:'Tử Lôi Thiên Giáng',shape:'target',reach:105,wind:1.18,mul:1.3,breakGuard:true},
 counter:{name:'Phản Kích',shape:'sector',reach:124,arc:1.0,wind:.59,mul:1.04},
};
// Each existing guardian has its own sequence. Phase III mixes consecutive skills.
const V27_BOSS={truc:['pounce','sweep','ring'],yeu:['sweep','pounce','crush'],tram:['poison','fan','ring'],tuyet:['ice','ring','fan'],hoa:['fire','crush','ring'],phong:['pounce','fan','sweep'],quy:['fan','poison','burst'],ma:['crush','sweep','burst'],loi:['lightning','fan','ring']};
function v27Reset(){Object.assign(V27,{owner:p,scope:v26Scope(),ai:new WeakMap(),fx:[],clock:0});}
function v27Ensure(){if(V27.owner!==p||V27.scope!==v26Scope())v27Reset();}
function v27Profile(e){const t=TYPES[e.type],st=t.spriteType??e.type;if(bossType(e.type)){const id=p.worldMode?v22Region(e).id:(e.type===3?'truc':'ma');return {role:'boss',pattern:V27_BOSS[id]||V27_BOSS.ma};}if(st===1||st===4)return {role:'guard',pattern:['claw','crush']};if(t.ranged||[2,5,6].includes(st))return {role:'ranged',pattern:st===5?['shot','poison']:st===6?['fire','shot']:['shot','fan']};return {role:'swift',pattern:['claw','pounce']};}
function v27AI(e){let a=V27.ai.get(e);if(!a){const profile=v27Profile(e),max=profile.role==='boss'?100:profile.role==='guard'?72:profile.role==='swift'?48:42;a={...profile,phase:1,mode:e.state==='patrol'?'patrol':'chase',t:0,cd:Math.max(0,e.cd||0),guardCd:1.35,dodgeCd:1.2,poise:max,max,plan:[],action:null,step:0,cycle:0,homeX:e.homeX??e.x,homeY:e.homeY??e.y,exposed:0,quiet:0,side:hashOW(Math.round(e.x),Math.round(e.y),e.type)>.5?1:-1,guarded:false};V27.ai.set(e,a);}return a;}
function v27State(e,a,mode){a.mode=mode;a.t=0;e.timer=0;const visual={patrol:'patrol',chase:'chase',wind:'wind',attack:'attack',dodge:'chase',guard:'wind',stagger:'recover',recover:'recover',rage:'wind',leash:'patrol'};e.state=visual[mode]||'recover';}
function v27Move(e,x,y,world){const r=Math.max(10,TYPES[e.type].r*.56);if(world)owMove(e,x,y,r);else{const dx=x-e.x,dy=y-e.y,n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/8));for(let k=0;k<n;k++){e.x=clamp(e.x+dx/n,AREA.l+r,AREA.r-r);e.y=clamp(e.y+dy/n,AREA.t+r,AREA.b-r);blockCollision(e,r);}}}
function v27FX(e,kind,col,life=.65,extra={}){if(V27.fx.length>=85)V27.fx.shift();V27.fx.push({kind,x:e.x,y:e.y,col,at:V27.clock,life,...extra});}
function v27Label(e,name,col){floating(e.x,e.y-72,name,col);}
function v27Start(e,a,id){const d=V27_BOOK[id],boss=a.role==='boss',scale=boss?1.12:1,wind=Math.max(.52,d.wind*(a.phase===3?.80:a.phase===2?.9:1)),angle=Math.atan2(p.y-e.y,p.x-e.x);let x=e.x,y=e.y;
 if(d.shape==='target'){const cap=boss?330:260,r=Math.min(dist(e,p),cap);x=e.x+Math.cos(angle)*r;y=e.y+Math.sin(angle)*r;}
 a.action={...d,id,reach:d.reach*scale,inner:(d.inner||0)*scale,width:(d.width||0)*scale,x,y,ox:e.x,oy:e.y,angle,wind,fired:false};e.angle=angle;e.dir=Math.cos(angle)<0?-1:1;v27State(e,a,'wind');}
function v27Plan(e,a){let seq;if(a.role==='boss'){const k=a.cycle++,pat=a.pattern;if(a.phase===1)seq=[pat[k%2]];else if(a.phase===2)seq=k%2?[pat[0],pat[1]]:[pat[2]];else seq=k%2?[pat[2],pat[0],pat[1]]:[pat[1],pat[2]];}else seq=[a.pattern[(a.cycle++)%a.pattern.length]];a.plan=seq;a.step=0;v27Start(e,a,seq[0]);}
function v27Inside(d,target,r=12){const dx=target.x-d.x,dy=target.y-d.y,l=Math.hypot(dx,dy),forward=dx*Math.cos(d.angle)+dy*Math.sin(d.angle),side=Math.abs(-dx*Math.sin(d.angle)+dy*Math.cos(d.angle));if(d.shape==='line')return forward>=-r&&forward<=d.reach+r&&side<=d.width+r;if(d.shape==='ring')return l<=d.reach+r&&l>=d.inner-r;if(d.shape==='sector'||d.shape==='fan')return l<=d.reach+r&&(l<=r||Math.abs(angleDelta(Math.atan2(dy,dx),d.angle))<=d.arc+Math.asin(Math.min(1,r/l)));return l<=d.reach+r;}
function v27Damage(n,breakGuard=false,status=''){if(!p||p.dashT>0||p.hurt>0||failed||(p.worldMode&&regionAt(p.x,p.y).id==='thon'))return false;const owner=p,hp=p.hp,oldx=p.x,oldy=p.y;if(breakGuard&&(p.v10Guard||0)>0){p.v10Guard=0;v27Label(p,'HỘ THỂ VỠ','#ffc783');v27FX(p,'guard','#ffbc6b',.55);}damagePlayer(n);const hit=p===owner&&(p.hp<hp||Math.hypot(p.x-oldx,p.y-oldy)>1000);if(hit&&p.hp<hp){if(status==='poison')p.poisonT=3.5;if(status==='fire')p.fireT=3.5;}return hit;}
function v27BoltDamage(b){return v27Damage(b.dmg,!!b.v27Break,b.effect);}
function v27Execute(e,a,world){const d=a.action;if(!d||d.fired)return;d.fired=true;const t=TYPES[e.type],boss=a.role==='boss',base=e.v22Atk??t.atk*(world?1:1+room*.10),damage=base*d.mul*(a.phase===3?1.18:a.phase===2?1.06:1),col=d.breakGuard?'#ffd381':a.phase===3?'#fb7761':t.color;
 v27FX({x:d.x,y:d.y},'strike',col,.52,{attack:{...d},phase:a.phase});
 if(d.shape==='fan'){const count=d.count+(boss&&a.phase===3?2:0);for(let i=0;i<count;i++){const angle=d.angle+(count===1?0:(i/(count-1)*2-1)*d.arc);enemyFire(e,angle,d.speed*(a.phase===3?1.12:1));const b=bolts.at(-1);b.x=d.ox;b.y=d.oy;b.dmg=damage;b.life=d.reach/d.speed/(a.phase===3?1.12:1);b.effect=d.status||t.effect||'';b.v27Break=!!d.breakGuard;}}
 else if(v27Inside(d,p)&&(d.shape==='target'||!world||v8Line(e,p,4,true)))v27Damage(damage,!!d.breakGuard,d.status);
 if(d.lunge){d.travel=0;d.lungeDistance=Math.min(d.reach*.78,Math.max(0,dist(e,p)-24));}
 v27State(e,a,'attack');}
function v27Threat(e,a){const d=dist(e,p),act=V26.action;return (act&&!act.hit&&d<(act.s?.range||130)+80&&Math.abs(angleDelta(Math.atan2(e.y-p.y,e.x-p.x),act.a))<1.0)||bolts.some(b=>b.good&&dist(b,e)<90&&((e.x-b.x)*b.vx+(e.y-b.y)*b.vy)>0);}
function v27Tick(e,dt,world){if(e.dead||!p||failed||mode!=='play')return;v27Ensure();const a=v27AI(e),t=TYPES[e.type],boss=a.role==='boss',d=dist(e,p),ang=Math.atan2(p.y-e.y,p.x-e.x);a.t+=dt;e.timer=a.t;e.flash=Math.max(0,(e.flash||0)-dt);e.slow=Math.max(0,(e.slow||0)-dt);for(const key of ['cd','guardCd','dodgeCd','exposed'])a[key]=Math.max(0,a[key]-dt);e.cd=a.cd;
 if(e.burn>0){e.burn-=dt;e.burnTick=(e.burnTick||0)-dt;if(e.burnTick<=0){e.burnTick=.65;const burn=currentStats().burn;if(e.hp<=burn){v27RawHit(e,Math.max(1,burn*2));return;}e.hp-=burn;floating(e.x,e.y-25,'~'+Math.round(burn),'#ffad6e');}}
 const home={x:a.homeX,y:a.homeY},safe=world&&regionAt(p.x,p.y).id==='thon';if(world&&(safe||dist(e,home)>580||dist(p,home)>690||a.mode==='leash')){if(a.mode!=='leash'){a.action=null;a.plan=[];v27State(e,a,'leash');}const h=dist(e,home);if(h>12){const k=Math.min(1,dt*145/h);v27Move(e,e.x+(home.x-e.x)*k,e.y+(home.y-e.y)*k,true);}else{a.cd=.5;v27State(e,a,'patrol');}return;}
 if(boss){const phase=e.hp/e.max<=.30?3:e.hp/e.max<=.65?2:1;if(phase>a.phase&&a.mode!=='stagger'){a.phase=phase;a.plan=[];a.action=null;a.poise=a.max;a.exposed=0;v27State(e,a,'rage');v27Label(e,phase===3?'CUỒNG BẠO':'BIẾN CHIÊU','#ffad73');v27FX(e,'rage','#ff785d',.95,{r:t.r+50});}}
 if(a.mode==='rage'){if(a.t>=.85){a.cd=.12;v27State(e,a,'chase');}return;}
 if(a.mode==='stagger'){if(a.t>=1.26){a.poise=a.max*.65;a.cd=.38;v27State(e,a,'recover');}return;}
 if(a.mode==='wind'){if(a.t>=a.action.wind)v27Execute(e,a,world);return;}
 if(a.mode==='attack'){const move=a.action;if(move?.lunge&&move.travel<move.lungeDistance){const step=Math.min(move.lungeDistance-move.travel,move.lungeDistance*dt/.18);v27Move(e,e.x+Math.cos(move.angle)*step,e.y+Math.sin(move.angle)*step,world);move.travel+=step;}if(a.t>=.26){if(a.step+1<a.plan.length){a.step++;v27Start(e,a,a.plan[a.step]);}else{a.action=null;a.plan=[];v27State(e,a,'recover');}}return;}
 if(a.mode==='recover'){a.poise=Math.min(a.max,a.poise+dt*11);if(a.t>=(boss?.85:t.cd*.9)*(a.phase===3?.82:1)){a.cd=.18;v27State(e,a,'chase');}return;}
 if(a.mode==='guard'){if(a.t>=.58){if(a.guarded){a.plan=['counter'];a.step=0;v27Start(e,a,'counter');}else{a.cd=.12;v27State(e,a,'chase');}}return;}
 if(a.mode==='dodge'){const speed=240,da=a.dodgeAngle;v27Move(e,e.x+Math.cos(da)*speed*dt,e.y+Math.sin(da)*speed*dt,world);if(a.t>=.26){a.cd=.12;v27State(e,a,'chase');}return;}
 if(a.mode==='patrol'){if(d<(boss?390:330)&&(!world||v8Line(e,p,5,true))){v27State(e,a,'chase');}else{const xx=home.x+Math.cos(elapsed*.25+e.type)*48,yy=home.y+Math.sin(elapsed*.25+e.type)*48,ag=Math.atan2(yy-e.y,xx-e.x);e.dir=Math.cos(ag)<0?-1:1;if(Math.hypot(xx-e.x,yy-e.y)>5)v27Move(e,e.x+Math.cos(ag)*t.speed*.20*dt,e.y+Math.sin(ag)*t.speed*.20*dt,world);return;}}
 e.dir=Math.cos(ang)<0?-1:1;e.angle=ang;a.poise=Math.min(a.max,a.poise+dt*(a.exposed?0:7));
 if(!boss&&a.role==='guard'&&a.guardCd===0&&d<175&&v27Threat(e,a)){a.guardCd=3.4;a.guarded=false;v27State(e,a,'guard');v27Label(e,'THỦ THẾ','#f4d597');return;}
 if(!boss&&a.role!=='guard'&&a.dodgeCd===0&&d<270&&v27Threat(e,a)){a.dodgeCd=3.2;a.dodgeAngle=ang+a.side*Math.PI*.62;a.side*=-1;v27State(e,a,'dodge');v27FX(e,'dodge',t.color,.33);return;}
 const ranged=a.role==='ranged',attackRange=boss?Math.max(180,t.range+45):ranged?Math.max(190,t.range):Math.max(80,t.range+20);if(d<attackRange&&a.cd===0&&(!world||v8Line(e,p,5,true))){v27Plan(e,a);return;}
 const speed=t.speed*(a.phase===3?1.24:a.phase===2?1.1:1)*(e.slow>0?.6:1),comfortable=ranged?attackRange*.68:attackRange*.68;let mx=0,my=0;
 if(d>comfortable){mx=Math.cos(ang);my=Math.sin(ang);}else if(ranged&&d<comfortable*.60){mx=-Math.cos(ang);my=-Math.sin(ang);}else if(a.role==='swift'&&a.cd>0){mx=Math.cos(ang+a.side*Math.PI/2)*.65;my=Math.sin(ang+a.side*Math.PI/2)*.65;}
 v27Move(e,e.x+mx*speed*dt,e.y+my*speed*dt,world);
 // Compact local separation prevents crowd stacking without moving a telegraphed attack.
 for(const o of enemies){if(o===e||o.dead)continue;const dx=e.x-o.x,dy=e.y-o.y,dd=Math.hypot(dx,dy),rr=(t.r+TYPES[o.type].r)*.65;if(dd>.01&&dd<rr)v27Move(e,e.x+dx/dd*(rr-dd)*.10,e.y+dy/dd*(rr-dd)*.10,world);}
}
owEnemy=function(e,dt){v27Tick(e,dt,true);};updateEnemy=function(e,dt){v27Tick(e,dt,false);};
// Guard mitigation and posture break are applied before the original loot/damage pipeline.
const v27RawHit=hit;
hit=function(e,dmg,crit=false){if(e.dead)return;delete e.v27NoPush;v27Ensure();const a=v27AI(e),src=V26.source,boss=a.role==='boss',heavy=src?.stage===3||src?.kind==='skill'||crit,angle=Math.atan2(p.y-e.y,p.x-e.x),frontal=Math.abs(angleDelta(angle,e.angle??angle))<1.3;
 if(a.mode==='dodge'&&a.t<.18){e.v27NoPush=true;v27Label(e,'NÉ TRÁNH','#c4efe4');return;}
 const guarding=a.mode==='guard'&&frontal&&!a.exposed,poise=(heavy?24:11)+(crit?5:0),staggered=a.mode==='stagger';if(!staggered)a.poise=Math.max(0,a.poise-poise*(guarding?1.35:1));a.quiet=0;
 if(a.poise<=0&&!staggered){a.action=null;a.plan=[];a.exposed=2.15;a.poise=0;v27State(e,a,'stagger');v27FX(e,'break','#ffe5aa',.82,{r:TYPES[e.type].r+28});v27Label(e,'PHÁ THẾ','#ffe5aa');}
 else if(guarding){a.guarded=true;dmg*=.28;e.v27NoPush=true;v27FX(e,'guard','#e4ca82',.42);v27Label(e,'ĐỠ ĐÒN','#e4ca82');}
 else if(!boss&&heavy&&a.mode==='wind'){a.action=null;a.plan=[];v27State(e,a,'recover');v27Label(e,'GIÁN ĐOẠN','#f4dfb1');}
 if(!guarding&&a.exposed>0)dmg*=1.25;const visual=e.state,et=e.timer;v27RawHit(e,dmg,crit);if(!e.dead){e.state=visual;e.timer=et;}
};
const v27PushOld=v26Push;v26Push=function(e,angle,amount){if(e.v27NoPush){delete e.v27NoPush;return;}const a=V27.ai.get(e);if(a&&['wind','attack','rage'].includes(a.mode)&&a.role==='boss')return;v27PushOld(e,angle,amount);};
// Draw warnings in the same coordinate and geometry used by the actual hit test.
function v27Path(d){g.beginPath();if(d.shape==='line'){g.rect(0,-d.width,d.reach,d.width*2);}else if(d.shape==='sector'||d.shape==='fan'){g.moveTo(0,0);g.arc(0,0,d.reach,-d.arc,d.arc);g.closePath();}else{g.arc(0,0,d.reach,0,TAU);if(d.shape==='ring'){g.moveTo(d.inner,0);g.arc(0,0,d.inner,0,TAU,true);}}}
function v27Zone(d,z,col,q,world,impact=false){g.save();g.translate(z.x,z.y);g.scale(1,world?HD.tilt:1);g.rotate(d.angle);v27Path(d);g.fillStyle=col;g.globalAlpha=impact?.19*(1-q):.16+.16*q;g.fill('evenodd');g.globalAlpha=impact?.75*(1-q):.72;g.strokeStyle='#291e23';g.lineWidth=impact?5:4;g.stroke();g.globalAlpha=impact?.85*(1-q):.94;g.strokeStyle=col;g.lineWidth=impact?3:2;g.stroke();if(!impact){g.globalAlpha=.9;g.strokeStyle='#fff0c0';g.lineWidth=3;g.beginPath();if(d.shape==='line')g.moveTo(0,-d.width),g.lineTo(d.reach*q,-d.width);else g.arc(0,0,d.reach,d.shape==='sector'||d.shape==='fan'?-d.arc:0,(d.shape==='sector'||d.shape==='fan'?-d.arc:0)+(d.shape==='sector'||d.shape==='fan'?2*d.arc:TAU)*q);g.stroke();}g.restore();}
function v27Render(v){if(!p||mode!=='play')return;const world=!!p.worldMode,point=o=>world?hdPoint(o.x,o.y,v):o;
 for(const e of enemies){if(e.dead||dist(e,p)>620)continue;const a=V27.ai.get(e);if(!a)continue;const z=point(e),t=TYPES[e.type],boss=a.role==='boss';if(a.mode==='wind'&&a.action){const d=a.action,q=clamp(a.t/d.wind,0,1),col=d.breakGuard?'#ffd378':'#ff8172';v27Zone(d,point(d),col,q,world);g.save();g.shadowBlur=4;g.shadowColor='#192228';text((a.step+1)+'/'+a.plan.length+' · '+d.name,z.x,z.y-(boss?142:94),12,col,'center','bold');g.restore();}
  if(a.mode==='guard'||a.mode==='stagger'||a.mode==='rage'){const col=a.mode==='stagger'?'#ffe5aa':a.mode==='rage'?'#ff775d':'#e4ca82';g.save();g.globalAlpha=.75;g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.ellipse(z.x,z.y,t.r+9,(t.r+9)*.5,0,0,TAU);g.stroke();g.restore();if(a.mode==='stagger')text('PHÁ THẾ',z.x,z.y-t.scale*.63-28,12,col,'center','bold');}
  if(boss&&a.phase===3){g.save();g.globalAlpha=.65;for(let i=0;i<5;i++){const phi=elapsed*2+i*TAU/5;circle(z.x+Math.cos(phi)*(t.r+10),z.y+Math.sin(phi)*(t.r+10)*.48,2.5,'#ffb072');}g.restore();}
  if(!boss&&(a.mode!=='patrol'&&a.mode!=='leash')){const y=z.y-Math.min(103,t.scale*.66)-3,w=44;box(z.x-w/2,y,w,3,'#253637','',1);if(a.poise>0)box(z.x-w/2,y,w*a.poise/a.max,3,'#e8cf8f','',1);}
 }
 for(const f of V27.fx){const q=clamp((V27.clock-f.at)/f.life,0,1),z=point(f);if(f.kind==='strike'){v27Zone(f.attack,z,f.col,q,world,true);g.save();g.translate(z.x,z.y);g.globalAlpha=(1-q)*.65;v26Sparks(q,Math.min(f.attack.reach,150),f.col,f.attack.angle,12);g.restore();}else{g.save();g.translate(z.x,z.y);g.globalAlpha=(1-q)*.8;v26Ellipse((f.r||38)*(.4+q*.85),.54,f.col,2.5);if(f.kind==='break')v26Sparks(q,65,f.col,0,12);g.restore();}}
}
const v27OldHD=hdEffects,v27OldFX=renderEffects;hdEffects=function(v){v27OldHD(v);v27Render(v);};renderEffects=function(){v27OldFX();v27Render();};
// update_L10: lớp 17_v27_v26 (trước đây lưu lớp dưới vào v27OldUpdate). Gọi lớp dưới: update_L09.
function update_L10(dt){if(p&&mode==='play'){v27Ensure();if(!modal){V27.clock+=dt;V27.fx=V27.fx.filter(f=>V27.clock-f.at<f.life);}}return update_L09(dt);}
function v27BossHUD(){if(!p||modal||mode!=='play')return;const e=enemies.filter(e=>!e.dead&&bossType(e.type)&&dist(e,p)<650).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(!e)return;const a=v27AI(e),name=a.phase===3?'III · CUỒNG BẠO':a.phase===2?'II · BIẾN CHIÊU':'I · THĂM DÒ',col=a.phase===3?'#ff9b7c':a.phase===2?'#e6c47b':'#a7ded3';v21Frame(410,12,460,79,a.phase===3?'#e17c65':'#ba9d6d');text(TYPES[e.type].name,640,25,14,'#f4e7c8','center','bold');v18GemBar(431,35,418,10,e.hp/e.max,'#d65d56');box(431,49,418,5,'#273b3a','',1);if(a.poise>0)box(431,49,418*a.poise/a.max,5,'#e9cb88','',1);text(name,431,70,11,col,'left','bold');text(a.mode==='stagger'?'PHÁ THẾ · +25% sát thương':a.action&&a.mode==='wind'?a.action.name+' · '+(a.step+1)+'/'+a.plan.length:'THANH THẾ',849,70,11,'#f5dca0','right','bold');}


