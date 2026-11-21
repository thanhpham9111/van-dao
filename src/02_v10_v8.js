'use strict';
addEventListener('pointerup',e=>{if(e.button===0)mouse.left=false;if(e.button===2)mouse.right=false;});
cv.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(e.target?.id==='heroName')return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(e.code))e.preventDefault();if(!e.repeat)pressed[e.code]=true;keys[e.code]=true;if(mode==='menu'&&/^Digit[1-3]$/.test(e.code)&&!e.repeat){V8.menuPage='create';V8.select=Number(e.code.slice(-1))-1;}});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;mouse.left=false;mouse.right=false;});
addEventListener('pagehide',save);

// Tứ giới world layer. All loot, skills, character progress and the original arena share one player state.
const GROUND=600,WORLD_FONT='V45Sans,"Segoe UI",Arial,sans-serif';let worldMap='thon',WORLD=2000,worldTitle=0,worldRespawn=0,worldDanger=false;
const WORLD_MAPS={
  thon:{name:'Thanh Thạch Thôn',sub:'Thanh bình, ấm áp · Thanh Vân Đại Điện',width:3200,right:'truc',
    types:[],max:0,sky:['#2a4a3a','#5a7a6a','#c9b98a'],orb:'#ffe9b0',m1:'#4a6a58',m2:'#33473e',
    ground:'#4a5a42',grass:'#7a9a6a',
    hud:{main:'#c9b98a',frame:'#8a7a5e',alert:'#e8b04b',fx:'petal',speed:1,ov:null}},
  truc:{name:'Thanh Trúc Lâm',sub:'Rừng trúc thanh tĩnh · Bia đá Thanh Vân',width:4800,left:'thon',right:'yeu',
    types:[0,1],max:6,sky:['#1e3a2e','#4a7a5e','#b9c4a0'],orb:'#fffadc',m1:'#3d6a52',m2:'#2a4a3a',
    ground:'#3a5a42',grass:'#6a9a62',
    hud:{main:'#a9d488',frame:'#5fae6a',alert:'#ffd54a',fx:'leaf',speed:1.4,ov:null}},
  yeu:{name:'Vạn Yêu Sơn',sub:'Núi hung hiểm · Cổ kiếm Vạn Yêu',width:4800,left:'truc',right:'tram',
    req(){return p.worldBossDead?null:'Trúc Lang Vương còn trấn giữ đường lên núi. Hãy hạ nó trước.';},
    types:[8,9],max:7,sky:['#3a2a1e','#7a5a3a','#d8b078'],orb:'#ffb070',m1:'#6a4a34',m2:'#4a3428',
    ground:'#4a3a28',grass:'#7a6a42',
    hud:{main:'#e8b04b',frame:'#c9552b',alert:'#ff3b2f',fx:'ember',speed:2.2,ov:'heat'}},
  tram:{name:'Hắc Độc Trạch',sub:'Đầm độc trầm tối · Dược Vương phế đàn',width:4800,left:'yeu',right:'tuyet',
    req(){return p.level>=15?null:'Đầm độc Hắc Độc Trạch hiểm ác. Cần đạt cấp 15 mới chịu nổi độc khí.';},
    types:[5,4],max:7,sky:['#1e2a22','#3a5a3a','#8aa86a'],orb:'#c8e8a0',m1:'#3a4a34',m2:'#26332a',
    ground:'#2e3a28',grass:'#5a7a42',
    hud:{main:'#a8d84a',frame:'#6a9a3a',alert:'#c8e84a',fx:'wisp',speed:1,ov:null}},
  tuyet:{name:'Bắc Minh Tuyết Vực',sub:'Băng tuyết sáng lạnh · Hàn Băng Linh Tuyền',width:5120,left:'tram',right:'hoa',
    req(){return p.level>=19?null:'Bắc Minh Tuyết Vực lạnh thấu xương. Cần đạt cấp 19 mới chịu nổi hàn khí.';},
    types:[1,2],max:7,sky:['#5a7a92','#90b8cb','#e8f0f0'],orb:'#ffffff',m1:'#7a9ab0',m2:'#5a7a92',
    ground:'#8aa0b0',grass:'#c8d8de',
    hud:{main:'#d5f4ff',frame:'#7aa8c8',alert:'#a0d8ff',fx:'petal',speed:1,ov:null}},
  hoa:{name:'Xích Viêm Hoang Mạc',sub:'Khô nóng · Xích Viêm tế đàn',width:5120,left:'tuyet',right:'phong',
    req(){return p.level>=24?null:'Xích Viêm Hoang Mạc khô nóng. Cần đạt cấp 24 mới chịu nổi hỏa khí.';},
    types:[6,9],max:8,sky:['#6a3a24','#b67647','#e8c898'],orb:'#ffb070',m1:'#8a4a30',m2:'#5e3524',
    ground:'#7a4a30',grass:'#b08a5a',
    hud:{main:'#ffb070',frame:'#c9552b',alert:'#ff6a3a',fx:'ember',speed:1.6,ov:'heat'}},
  phong:{name:'Thiên Phong Cốc',sub:'Thung lũng thoáng · Thiên Phong Linh Đài',width:5120,left:'hoa',right:'quy',
    req(){return p.level>=28?null:'Thiên Phong Cốc gió mạnh. Cần đạt cấp 28 mới đứng vững.';},
    types:[0,5],max:8,sky:['#4a6a6e','#7aa8a0','#c8d8c8'],orb:'#fffadc',m1:'#5a8a7e',m2:'#3e5e58',
    ground:'#5a7a62',grass:'#8ab088',
    hud:{main:'#b9eab6',frame:'#6a9a7a',alert:'#e8d84a',fx:'leaf',speed:1.8,ov:null}},
  quy:{name:'U Minh Quỷ Vực',sub:'Cổ mộ huyền bí · Trấn Hồn cổ mộ',width:5120,left:'phong',right:'ma',
    req(){return p.level>=33?null:'U Minh Quỷ Vực âm khí nặng. Cần đạt cấp 33 mới chịu nổi.';},
    types:[2,4],max:8,sky:['#1e2a32','#3a5a6a','#7a9aa8'],orb:'#a8e8d8',m1:'#2e4a58',m2:'#1e323e',
    ground:'#2a3a42',grass:'#4a6a6a',
    hud:{main:'#79bbac',frame:'#4a7a6a',alert:'#a8e8d8',fx:'wisp',speed:1,ov:'void'}},
  ma:{name:'Ma Vực',sub:'Hoang phế · Ma Môn cổ đồng',width:5760,left:'quy',right:'loi',
    req(){return p.level>=37?null:'Ma khí quá nặng. Cần đạt cấp 37 mới chịu nổi Ma Vực.';},
    types:[10,11],max:8,sky:['#0e0a18','#2c1650','#5a3a86'],orb:'#d9b3ff',m1:'#2a1a48',m2:'#1a1030',
    ground:'#1e1826',grass:'#3a2a5c',
    hud:{main:'#b58cff',frame:'#7a4fd0',alert:'#ff4fd8',fx:'wisp',speed:0.8,ov:'void'}},
  loi:{name:'Tử Lôi Hoang Nguyên',sub:'Bình nguyên rộng · Tử Lôi Thần Tích',width:5760,left:'ma',
    req(){return p.level>=41?null:'Tử Lôi Hoang Nguyên lôi kiếp. Cần đạt cấp 41 mới chịu nổi.';},
    types:[11,2],max:9,sky:['#2a2438','#4e506c','#a5b6ca'],orb:'#d8e8ff',m1:'#4a4468',m2:'#322e48',
    ground:'#3a3450',grass:'#6a6288',
    hud:{main:'#c8b8ff',frame:'#7a6ab0',alert:'#a8c8ff',fx:'ember',speed:1.2,ov:'void'}}
};

const WORLD_ORDER=['thon','truc','yeu','tram','tuyet','hoa','phong','quy','ma','loi'];
function legacyWorldSave(){try{const x=JSON.parse(localStorage.getItem('vdtt_save_v1'));return x?.v===1&&x.p?x:null;}catch(e){return null;}}
function migrateWorldSave(){const old=legacyWorldSave();if(!old)return;start(0);const a=old.p;p.level=clamp((a.realm?9:0)+clamp(Math.floor(a.stage||1),1,9),1,18);p.xp=clamp(Number(a.xp)||0,0,xpNeed());p.bonusAtk=Math.max(0,Number(a.bonusAtk)||0);p.bonusHp=Number(a.bonusHp)||0;p.foundation=Number(a.foundation)||0;p.breakFails=Math.max(0,Number(a.fails)||0);p.kills=Math.max(0,Number(a.kills)||0);p.pills=Math.max(0,Number(a.pills)||0);p.worldBossDead=!!old.bossDead;const id=WORLD_MAPS[old.map]?old.map:'thon';const valid=WORLD_MAPS[id].req?.()? 'thon':id;enterWorld(valid,Number(a.x)||160);p.hp=clamp(Number(a.hp)||1,1,currentStats().hp);p.mp=currentStats().mp;save();}
TYPES.push({...TYPES[0],name:'Huyết Lang',spriteType:0,hp:98,atk:19,speed:145,color:'#e9826a'}, {...TYPES[1],name:'Hỏa Thạch Yêu',spriteType:1,hp:175,atk:26,speed:83,color:'#ff9b51'}, {...TYPES[0],name:'U Minh Lang',spriteType:0,hp:122,atk:23,speed:155,color:'#bd8fff'}, {...TYPES[1],name:'Ma Thạch Khôi',spriteType:1,hp:240,atk:32,speed:90,color:'#bc9cff'});
function worldSpawn(type,x){const t=TYPES[type],f=type===3?1:1+Math.min(2,p.level*.065);enemies.push({type,x,y:GROUND,hp:t.hp*f,max:t.hp*f,dir:1,state:'patrol',timer:0,cd:0,flash:0,burn:0,burnTick:0,slow:0,angle:0,dead:false,home:x});}
function enterWorld(id,x){
 if(!WORLD_MAPS[id])id='thon';worldMap=id;WORLD=WORLD_MAPS[id].width;p.worldMode=true;p.mapId=id;p.x=clamp(x??160,30,WORLD-30);p.y=GROUND;p.vy=0;p.vx=0;p.dashT=0;p.atkCd=0;p.attackT=0;p.castT=0;p.hurt=0;p.poisonT=0;p.fireT=0;
 enemies=[];bolts=[];drops=[];fx=[];numbers=[];modal=null;cleared=false;worldTitle=3.5;worldRespawn=2;const m=WORLD_MAPS[id];
 for(let i=0;i<m.max;i++)worldSpawn(m.types[i%m.types.length],650+(WORLD-1400)*(i+.5)/m.max);if(id==='truc'&&!p.worldBossDead)worldSpawn(3,3800);remaining=enemies.length;
 message(m.name+' · '+m.sub);
}
function worldCam(){return clamp(p.x-W/2,0,WORLD-W);}
function worldPortal(){const m=WORLD_MAPS[worldMap];if(m.left&&p.x<210)return {to:m.left,x:WORLD_MAPS[m.left].width-160};if(m.right&&p.x>WORLD-210)return {to:m.right,x:160};if(worldMap==='ma'&&p.x>WORLD-210)return {to:'dungeon'};return null;}
function worldTravel(){const pt=worldPortal();if(!pt){message('Hãy tới gần cổng dịch chuyển tại mép bản đồ.');return;}if(pt.to==='dungeon'){p.worldMode=false;room=0;tower=0;p.visited=[];generateWorld(seed,tower);enterRoom(0);save();return;}const dest=WORLD_MAPS[pt.to],why=dest.req?.();if(why){message(why);return;}enterWorld(pt.to,pt.x);save();}
function worldAim(fn,nearest=false){const ox=mouse.x,oy=mouse.y;const e=nearest?enemies.filter(e=>!e.dead).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0]:null;mouse.x=e?e.x:mouse.inside&&Math.abs(ox+worldCam()-p.x)>12?ox+worldCam():p.x+p.face*150;mouse.y=p.y;fn();mouse.x=ox;mouse.y=oy;}
function worldEnemy(e,dt){if(e.dead)return;const t=TYPES[e.type],d=Math.abs(p.x-e.x),dir=Math.sign(p.x-e.x)||1,boss=bossType(e.type),fury=boss&&e.hp<e.max*.5;e.timer+=dt;e.flash=Math.max(0,e.flash-dt);e.slow=Math.max(0,e.slow-dt);e.cd=Math.max(0,e.cd-dt);
 if(e.burn>0){e.burn-=dt;e.burnTick-=dt;if(e.burnTick<=0){e.burnTick=.65;e.hp-=currentStats().burn;if(e.hp<=0){hit(e,1);return;}}}
 if(e.state==='patrol'){if(Math.abs(e.x-(e.home??e.x))>155)e.dir=-Math.sign(e.x-e.home);e.x+=e.dir*t.speed*.32*dt;if(d<430)e.state='chase';}
 else if(e.state==='chase'){e.dir=dir;if(d<t.range+10&&e.cd<=0){e.state='wind';e.timer=0;e.angle=dir>0?0:Math.PI;}else if(d>800){e.state='patrol';e.home=e.x;}else e.x+=dir*t.speed*(fury?1.35:1)*(e.slow>0?.65:1)*dt;}
 else if(e.state==='wind'){if(e.timer>=t.wind*(fury?.65:1)){e.state='attack';e.timer=0;if(Math.abs(p.y-GROUND)<80&&d<t.range+28)damagePlayer(t.atk*(fury?1.2:1));if(boss&&mode==='play'&&p.mapId!=='thon'){bolts.push({x:e.x,y:GROUND-12,vx:dir*270,vy:0,life:2,r:10,dmg:t.atk,good:false,color:t.color});}}}
 else if(e.state==='attack'){if(e.timer>.24){e.state='recover';e.timer=0;}}
 else if(e.state==='recover'&&e.timer>t.cd*(fury?.6:1)){e.state='chase';e.timer=0;e.cd=.3;}
 e.x=clamp(e.x,32,WORLD-32);
}
function worldUpdate(dt){
 elapsed+=dt;worldTitle=Math.max(0,worldTitle-dt);notifyT=Math.max(0,notifyT-dt);shakes*=Math.pow(.01,dt);
 for(const a of fx)a.life-=dt;fx=fx.filter(a=>a.life>0);for(const a of numbers){a.life-=dt;a.y-=35*dt;}numbers=numbers.filter(a=>a.life>0);
 if(pressed.KeyQ){modal=modal?.kind==='journal8'?null:{kind:'journal8'};v8Cancel();}if(pressed.KeyG)openPanel('gear');if(pressed.KeyI||pressed.Tab)openPanel('inventory');if(pressed.KeyM)openPanel('map');if(pressed.Escape){if(modal&&['gear','inventory','map','settings','fusion'].includes(modal.kind))modal=null;else if(!modal)openPanel('settings');}if(modal){V8.vx=V8.vy=0;v8Cancel();for(let i=0;i<3;i++)if(pressed['Digit'+(i+1)]&&modal.kind!=='npc8')select(i);return;}
 if(pressed.KeyR){fusion();if(modal)return;}if(pressed.KeyF)auto=!auto;if(pressed.KeyE){worldTravel();return;}if(pressed.KeyH)heal();
 if(pressed.KeyB){if(p.level!==9||p.xp<xpNeed())message('Cần Luyện Khí tầng 9 đại viên mãn.');else if(random()<v10BreakChance()){p.level=10;p.xp=0;p.hp=currentStats().hp;p.mp=currentStats().mp;message('ĐỘT PHÁ THÀNH CÔNG · TRÚC CƠ!');effect(p.x,p.y,'#fbe4a5','ring',1,{radius:140});save();}else{p.breakFails=(p.breakFails||0)+1;p.xp=Math.floor(xpNeed()*.6);p.hp=Math.max(1,p.hp*.5);message('Đột phá thất bại · lần sau tăng 10% cơ hội.');save();}}
 const st=currentStats(),safe=worldMap==='thon';p.hp=Math.min(st.hp,p.hp+(safe?12:.7)*dt);p.mp=Math.min(st.mp,p.mp+st.regen*(safe?1.5:1)*dt);
 for(const k of ['atkCd','attackT','castT','dashCd','hurt'])p[k]=Math.max(0,(p[k]||0)-dt);
 let dx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);if(dx)p.face=dx;
 if((pressed.ShiftLeft||pressed.ShiftRight||pressed.KeyK)&&p.dashCd<=0){p.dashT=.17;p.dashCd=st.dashCd;effect(p.x,p.y,'#80d9c6','ring',.25,{radius:40});}
 if(p.dashT>0){p.dashT=Math.max(0,p.dashT-dt);p.x+=p.face*820*dt;p.vy=0;}else{const v=dx*st.speed*1.23;p.vx=(p.vx||0)+clamp(v-(p.vx||0),-2400*dt,2400*dt);p.x+=p.vx*dt;if(p.y>=GROUND&&(pressed.Space||pressed.KeyW||pressed.ArrowUp))p.vy=-700;p.vy=(p.vy||0)+1850*dt;p.y=Math.min(GROUND,p.y+p.vy*dt);if(p.y>=GROUND)p.vy=0;}p.x=clamp(p.x,30,WORLD-30);
 if(mouse.left||mouse.fire||pressed.KeyJ||auto)worldAim(attack,auto||!!pressed.KeyJ);if(mouse.cast||pressed.KeyL)worldAim(cast,!!pressed.KeyL);mouse.fire=mouse.cast=false;
 let an=p.hurt>0?'hurt':p.dashT>0?'dash':p.castT>0?'cast':p.attackT>0?'attack':Math.abs(p.vx||0)>20?'run':'idle';if(an!==animation.name){animation.name=an;animation.t=0;}else animation.t+=dt;
 const oldMap=worldMap;for(const e of enemies)worldEnemy(e,dt);if(oldMap!==worldMap)return;
 for(const b of bolts){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;if(b.good){for(const e of enemies){if(e.dead||b.hit.includes(e))continue;if(Math.abs(b.x-e.x)<TYPES[e.type].r+b.r&&Math.abs(b.y-e.y)<100){b.hit.push(e);v26BoltHit(e,b);if(b.spell)effect(e.x,e.y-10,'#70ceff','beam',.45,{radius:58});if(--b.pierce<=0){b.life=0;break;}}}}else if(dist(b,p)<b.r+24){damagePlayer(b.dmg);b.life=0;}}bolts=bolts.filter(b=>b.life>0&&b.x>0&&b.x<WORLD);if(oldMap!==worldMap)return;
 const oldCount=enemies.length;enemies=enemies.filter(e=>!e.dead);if(enemies.length<oldCount&&random()<.12&&!modal&&worldMap!=='thon'){modal={kind:'reward',items:rewardOptions()};mouse.left=false;}
 for(const d of drops){if(Math.abs(d.x-p.x)<65){if(d.type==='stone')p.stones+=d.value;else p.hp=Math.min(st.hp,p.hp+d.value);d.dead=true;}}drops=drops.filter(d=>!d.dead);
 const m=WORLD_MAPS[worldMap];worldRespawn-=dt;if(m.max>0&&enemies.filter(e=>!bossType(e.type)).length<m.max&&worldRespawn<=0){worldRespawn=3;let x=p.x<WORLD/2?WORLD-650:650;if(Math.abs(x-p.x)>600)worldSpawn(pick(m.types),x);}
 saveTimer+=dt;if(saveTimer>6){saveTimer=0;save();}
}

function rr(n){const r=Math.sin(n*12.9898+78.233)*43758.5453;return r-Math.floor(r);}
function mountains(off,color,spacing,height){g.fillStyle=color;const base=Math.floor(off/spacing);for(let i=-2;i<=Math.ceil(W/spacing)+2;i++){const x=i*spacing-(off%spacing),hh=height*(.62+.38*rr(i+base));g.beginPath();g.moveTo(x-spacing*.62,GROUND);for(let j=0;j<=16;j++){const u=j/16, ridge=Math.pow(Math.sin(u*Math.PI),.8),jag=.80+.20*rr((i+base)*23+j);g.lineTo(x-spacing*.62+u*spacing*1.9,GROUND-hh*ridge*jag);}g.lineTo(x+spacing*1.3,GROUND);g.closePath();g.fill();}}
function tree(x,y,h,seed){g.save();g.translate(x,y);g.strokeStyle='#654a3c';g.lineWidth=12;g.beginPath();g.moveTo(0,0);g.bezierCurveTo(-10,-h*.48,16,-h*.72,0,-h);g.stroke();for(let i=0;i<7;i++){const a=(i%2?1:-1),bx=a*(23+rr(seed+i)*40),by=-h*(.52+.05*i);g.strokeStyle='#584037';g.lineWidth=4;g.beginPath();g.moveTo(0,by+25);g.quadraticCurveTo(bx*.45,by,bx,by-26);g.stroke();for(let k=0;k<14;k++){const xx=bx+(rr(seed+i*20+k)-.5)*68,yy=by-26+(rr(seed+i*20+k+100)-.5)*43,s=7+rr(seed+k)*13;g.fillStyle=['#a76587','#cb8ba6','#e7aec4','#f8d5de'][k%4];g.beginPath();g.arc(xx,yy,s,0,TAU);g.fill();}}g.restore();}
function house(x,w,h){const y=GROUND-h;g.save();g.fillStyle='#3e322a';g.fillRect(x+6,y+5,w,h);g.fillStyle='#b19b79';g.fillRect(x,y,w,h);g.fillStyle='#523b2a';for(let i=0;i<=w;i+=32)g.fillRect(x+i,y,5,h);g.fillRect(x,y+h*.58,w,5);g.fillRect(x,y+h-8,w,8);g.fillStyle='#251d19';g.fillRect(x+w*.43,GROUND-73,w*.18,73);g.fillStyle='#d7a75e';for(const xx of [x+15,x+w-49]){g.fillRect(xx,y+23,31,34);g.fillStyle='#583818';g.fillRect(xx+14,y+23,2,34);g.fillRect(xx,y+39,31,2);g.fillStyle='#d7a75e';}
 const peak=y-70;g.beginPath();g.moveTo(x-30,y+6);g.quadraticCurveTo(x+w*.14,y-15,x+w*.5,peak);g.quadraticCurveTo(x+w*.86,y-15,x+w+30,y+6);g.quadraticCurveTo(x+w*.5,y+19,x-30,y+6);g.fillStyle='#343940';g.fill();g.save();g.clip();g.strokeStyle='#202732';g.lineWidth=2;for(let xx=x-35;xx<x+w+35;xx+=10){g.beginPath();g.moveTo(x+w*.5+(xx-x-w*.5)*.15,peak);g.lineTo(xx,y+20);g.stroke();}for(let yy=peak+13;yy<y+20;yy+=12){g.beginPath();g.moveTo(x-35,yy);g.quadraticCurveTo(x+w*.5,yy+9,x+w+35,yy);g.stroke();}g.restore();g.strokeStyle='#b6a58a';g.lineWidth=4;g.beginPath();g.moveTo(x-30,y+6);g.quadraticCurveTo(x+w*.5,y+19,x+w+30,y+6);g.stroke();g.fillStyle='#8b312b';g.fillRect(x+w*.13,y+3,7,22);g.fillRect(x+w*.84,y+3,7,22);g.restore();}
function bamboo(x,h,seed,col,near){g.save();g.translate(x,GROUND);const sway=Math.sin(elapsed*.7+seed)*3;const width=near?10:6;const trunk=g.createLinearGradient(-width,0,width,0);trunk.addColorStop(0,col);trunk.addColorStop(.55,near?'#7eac6f':'#53796b');trunk.addColorStop(1,col);g.fillStyle=trunk;g.beginPath();g.moveTo(-width/2,0);g.lineTo(sway-width/2,-h);g.lineTo(sway+width/2,-h);g.lineTo(width/2,0);g.closePath();g.fill();for(let y=-35;y>-h;y-=42){g.fillStyle=col;g.fillRect(sway*(-y/h)-width/2-1,y,width+2,3);}for(let i=0;i<5;i++){const yy=-h*(.42+i*.125),dir=i%2?1:-1,bx=dir*(25+rr(seed+i)*40);g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(sway,yy+4);g.quadraticCurveTo(bx*.5,yy-16,bx,yy-19);g.stroke();for(let k=0;k<7;k++){const lx=bx*(.43+k*.12), ly=yy-12-rr(seed+i*13+k)*18;g.fillStyle=near?(k%2?'#477e49':'#63985c'):'#426e63';g.save();g.translate(lx,ly);g.rotate(dir*(.6+rr(seed+k)*.6));g.beginPath();g.ellipse(0,0,13,2.8,0,0,TAU);g.fill();g.restore();}}g.restore();}
function scenery(cam){if(worldMap==='thon'){for(let bx=Math.floor(cam/330)*330-330;bx<cam+W+330;bx+=330){const sx=bx-cam;tree(sx+235,GROUND,145+rr(bx)*65,bx);if(Math.floor(bx/330)%2===0)house(sx+30,180,105+rr(bx+1)*35);}}
 else if(worldMap==='truc'){for(let bx=Math.floor(cam*.75/65)*65-65;bx<cam*.75+W+65;bx+=65){g.globalAlpha=.45;bamboo(bx-cam*.75,270+rr(bx+10)*220,bx,'#304f4c',false);}g.globalAlpha=1;for(let bx=Math.floor(cam/115)*115-115;bx<cam+W+115;bx+=115)bamboo(bx-cam,320+rr(bx+20)*200,bx,'#31563d',true);if(!p.worldBossDead)text('LÃNH ĐỊA TRÚC LANG VƯƠNG',3700-cam,GROUND-330,18,'#dae4c1','center','bold');}
 else if(worldMap==='yeu'){for(let bx=Math.floor(cam/170)*170-170;bx<cam+W+170;bx+=170){const sx=bx-cam,h=120+rr(bx)*220;g.fillStyle='#29171b';g.beginPath();g.moveTo(sx-54,GROUND);g.lineTo(sx-39,GROUND-h*.36);g.lineTo(sx-14,GROUND-h*.55);g.lineTo(sx-19,GROUND-h);g.lineTo(sx+16,GROUND-h*.69);g.lineTo(sx+29,GROUND-h*.45);g.lineTo(sx+66,GROUND);g.closePath();g.fill();g.fillStyle='#57302d';g.beginPath();g.moveTo(sx-19,GROUND-h);g.lineTo(sx+16,GROUND-h*.69);g.lineTo(sx+29,GROUND-h*.45);g.lineTo(sx+5,GROUND-15);g.closePath();g.fill();g.strokeStyle='#ed7845';g.lineWidth=1.5;g.beginPath();g.moveTo(sx+6,GROUND-h*.60);g.lineTo(sx-4,GROUND-h*.29);g.lineTo(sx+13,GROUND-15);g.stroke();g.fillStyle='rgba(255,110,50,'+(.56+.35*Math.sin(elapsed*3+bx))+')';g.fillRect(sx+55,GROUND+12,50,3);}}
 else{for(let bx=Math.floor(cam/260)*260-260;bx<cam+W+260;bx+=260){const sx=bx-cam,h=180+rr(bx)*90;g.fillStyle='#21152f';g.beginPath();g.moveTo(sx-22,GROUND);g.lineTo(sx-15,GROUND-h+22);g.lineTo(sx,GROUND-h-30);g.lineTo(sx+15,GROUND-h+22);g.lineTo(sx+22,GROUND);g.closePath();g.fill();g.fillStyle='#3b2856';g.beginPath();g.moveTo(sx,GROUND-h-30);g.lineTo(sx+15,GROUND-h+22);g.lineTo(sx+22,GROUND);g.lineTo(sx,GROUND);g.closePath();g.fill();for(let y=GROUND-h+29;y<GROUND-20;y+=33){g.strokeStyle='rgba(190,140,255,'+(.35+.28*Math.sin(elapsed*2+y))+')';g.lineWidth=2;g.strokeRect(sx-6,y,12,12);}
 const fy=160+rr(bx+4)*110+Math.sin(elapsed+bx)*8;g.fillStyle='#35244d';g.beginPath();g.ellipse(sx+100,fy,62,16,0,0,TAU);g.fill();g.fillStyle='#211831';g.beginPath();g.moveTo(sx+38,fy);g.lineTo(sx+74,fy+35);g.lineTo(sx+101,fy+72);g.lineTo(sx+135,fy+37);g.lineTo(sx+162,fy);g.closePath();g.fill();g.strokeStyle='#6e4d91';g.lineWidth=2;g.beginPath();g.moveTo(sx+60,fy+5);g.lineTo(sx+92,fy+36);g.lineTo(sx+101,fy+72);g.stroke();}}}
function drawPortal(wx,cam,to){const x=wx-cam;if(x<-150||x>W+150)return;const col=WORLD_MAPS[to].hud.main,y=GROUND-80;g.save();g.globalAlpha=.9;g.fillStyle='#322d31';g.fillRect(x-54,GROUND-140,13,140);g.fillRect(x+41,GROUND-140,13,140);g.beginPath();g.moveTo(x-68,GROUND-140);g.lineTo(x,GROUND-194);g.lineTo(x+68,GROUND-140);g.lineTo(x+57,GROUND-131);g.lineTo(x-57,GROUND-131);g.closePath();g.fill();g.strokeStyle='#ac8b63';g.lineWidth=2;g.stroke();const gr=g.createRadialGradient(x,y,5,x,y,65);gr.addColorStop(0,col+'8f');gr.addColorStop(1,col+'00');g.fillStyle=gr;g.fillRect(x-65,y-65,130,130);g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.ellipse(x,y,34,59,0,elapsed*1.5,elapsed*1.5+4.8);g.stroke();g.beginPath();g.ellipse(x,y,24,43,0,-elapsed*1.2,-elapsed*1.2+4.7);g.stroke();for(let i=0;i<9;i++){const a=elapsed+i*TAU/9;diamond(g,x+Math.cos(a)*36,y+Math.sin(a)*59,2,col);}g.restore();text(WORLD_MAPS[to].name,x,GROUND-208,15,col,'center','bold');}

function worldBackdrop(cam){const m=WORLD_MAPS[worldMap],th=m.hud;const sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,m.sky[0]);sky.addColorStop(.60,m.sky[1]);sky.addColorStop(1,m.sky[2]);g.fillStyle=sky;g.fillRect(0,0,W,H);const glow=g.createRadialGradient(1000,145,12,1000,145,125);glow.addColorStop(0,m.orb+'cc');glow.addColorStop(1,m.orb+'00');g.fillStyle=glow;g.fillRect(875,20,250,250);circle(1000,145,42,m.orb,'',.87);
 mountains(cam*.12,m.m1,420,330);mountains(cam*.30,m.m2,300,215);
 // Distant mist flows independently of camera and foreground.
 for(let i=0;i<8;i++){const x=(i*225+elapsed*13-cam*.12)%(W+280)-140,y=310+i%3*64;g.save();g.translate(x,y);g.scale(3.8,.35);const f=g.createRadialGradient(0,0,1,0,0,65);f.addColorStop(0,'#ffffff22');f.addColorStop(1,'#ffffff00');g.fillStyle=f;g.fillRect(-65,-65,130,130);g.restore();}
 g.fillStyle=m.ground;g.fillRect(0,GROUND,W,H-GROUND);g.fillStyle=m.grass;g.fillRect(0,GROUND,W,8);scenery(cam);
 for(let x=Math.floor(cam/48)*48;x<cam+W+48;x+=48){const px=x-cam;g.fillStyle='#00000025';g.fillRect(px,GROUND+28,46,1);g.fillRect(px+((x/48)%2)*12,GROUND+8,1,42);g.fillStyle='#ffffff12';g.fillRect(px+4,GROUND+11,28,2);}
 if(m.left)drawPortal(110,cam,m.left);if(m.right)drawPortal(WORLD-110,cam,m.right);if(worldMap==='ma'){const x=WORLD-110-cam;if(x>-150&&x<W+150){seal(g,x,GROUND-85,46,'#cfb3ff',elapsed*.18,.85);text('Vạn Giới Bí Cảnh',x,GROUND-153,17,'#ebd8ff','center','bold');}}
}
function worldParticles(){const th=WORLD_MAPS[worldMap].hud;const type=th.fx,count=type==='ember'?38:26;for(let i=0;i<count;i++){const vy=type==='ember'?-66:type==='wisp'?-23:type==='leaf'?40:23;const x=(i*137.27+elapsed*(type==='leaf'?-27:12)+Math.sin(elapsed*.8+i)*30+1e5)%(W+36)-18,y=(i*83.6+elapsed*vy+1e5)%(H+40)-20;g.save();g.translate(x,y);g.rotate(elapsed*(i%2?-.6:.8)+i);g.globalAlpha=type==='wisp'?.22:.36+.18*Math.sin(elapsed+i);g.fillStyle=th.main;g.beginPath();if(type==='leaf'||type==='petal')g.ellipse(0,0,type==='leaf'?5:4,2,0,0,TAU);else g.arc(0,0,type==='wisp'?5:2,0,TAU);g.fill();g.restore();}if(th.ov==='heat'){const h=g.createLinearGradient(0,H-150,0,H);h.addColorStop(0,'#ff5a1e00');h.addColorStop(1,'#ff5a1e42');g.fillStyle=h;g.fillRect(0,H-150,W,150);}else if(th.ov==='void'){const v=g.createRadialGradient(W/2,H/2,300,W/2,H/2,760);v.addColorStop(0,'#21004a00');v.addColorStop(1,'rgba(20,0,40,'+(.46+.09*Math.sin(elapsed*1.2))+')');g.fillStyle=v;g.fillRect(0,0,W,H);}}
function worldHud(){const m=WORLD_MAPS[worldMap],th=m.hud,s=currentStats(),danger=false;const pulse=.45+.55*Math.abs(Math.sin(elapsed*th.speed*(danger?3:1)));g.save();g.strokeStyle=danger?th.alert:th.frame;g.globalAlpha=.35*pulse;g.lineWidth=3;g.strokeRect(2,2,W-4,H-4);g.restore();
 ornament(16,10,360,97,'#161519de');seal(g,49,48,24,th.main,0,.9);text(['KT','TT','PT'][p.cls],49,48,10,'#fff0ce','center','bold');
 const bars=[[81,24,280,16,p.hp/s.hp,'#a63a37','Sinh mệnh '+Math.ceil(p.hp)+'/'+Math.ceil(s.hp)],[81,46,280,13,p.mp/s.mp,'#367d9e','Linh lực '+Math.floor(p.mp)+'/'+Math.floor(s.mp)],[81,64,280,12,p.xp/xpNeed(),'#a58a44','Tu vi '+Math.floor(p.xp)+'/'+xpNeed()]];
 bars.forEach(([x,y,w,h,r,c,label])=>{bladeBar(x,y,w,h,r,c,label);g.save();g.beginPath();g.rect(x+2,y+2,Math.max(0,(w-4)*clamp(r,0,1)),h-4);g.clip();const sx=(elapsed*th.speed*90)%(w*2);g.fillStyle='#ffffff30';g.fillRect(x+sx,y,18,h);g.restore();g.strokeStyle=danger?th.alert:th.frame;g.globalAlpha=pulse*.75;g.strokeRect(x,y,w,h);g.globalAlpha=1;});
 text(realm(),82,91,12,th.main,'left','bold');text('Đan ×'+p.pills+' · Công '+Math.round(s.attack)+' · Thủ '+Math.round(s.def),366,91,11,C.paper,'right');
 ornament(930,10,334,95,'#151721dc');text(m.name,1247,30,21,th.main,'right','bold');text('Linh thạch '+p.stones+' · Yêu thú '+enemies.length,1247,52,12,C.paper,'right');let mx=945,mw=303;g.fillStyle='#08090b';g.fillRect(mx,73,mw,5);g.strokeStyle=th.frame;g.strokeRect(mx,73,mw,5);for(const e of enemies)if(bossType(e.type))diamond(g,mx+mw*e.x/WORLD,75,5,'#ee664f');diamond(g,mx+mw*p.x/WORLD,75,6,th.main);text('M · Bản đồ',1247,91,10,C.muted,'right');
 const boss=enemies.find(e=>bossType(e.type)&&Math.abs(e.x-p.x)<850);if(boss){text(TYPES[boss.type].name.toUpperCase(),180,637,15,th.main,'left','bold');bladeBar(180,647,920,13,boss.hp/boss.max,'#9e3030');}
 const hot=[['LMB','Tấn công',()=>worldAim(attack,true),p.atkCd>0],['RMB',V10_SCHOOLS[p.cls].skill,()=>worldAim(cast,true),p.mp<currentStats().skillCost||(p.v10SkillCd||0)>0],['SHIFT','Lướt',()=>pressed.ShiftLeft=true,p.dashCd>0],['H','Hồi Xuân Đan',heal,p.pills===0],['I','Công pháp',()=>openPanel('inventory')],['R','Dung hợp',fusion],['M','Bản đồ',()=>openPanel('map')],['ESC','Cài đặt',()=>openPanel('settings')]];for(let i=0;i<hot.length;i++){const x=420+i*56,y=671;circle(x+15,y+15,18,'#121318',th.frame);uiIcon(i,x,y,30,!!hot[i][3]);text(hot[i][0],x+15,709,9,th.main,'center','bold');buttons.push({x:x-4,y:y-4,w:38,h:39,fn:hot[i][2]});}
 text('A/D di chuyển · Space nhảy · F tự đánh',16,690,11,C.paper);text('G trang bị · B đột phá · E qua cổng',1263,690,11,C.paper,'right');
 const portal=worldPortal();if(portal){const name=portal.to==='dungeon'?'Vạn Giới Bí Cảnh':WORLD_MAPS[portal.to].name;box(465,610,350,32,'#161319dd',th.frame,5);text('Nhấn E · '+name,640,626,16,th.main,'center','bold');}
 if(p.level===9&&p.xp>=xpNeed())text('B · ĐỘT PHÁ TRÚC CƠ · '+Math.round(v10BreakChance()*100)+'%',640,130,17,'#ffe0a3','center','bold');
 if(notifyT>0){const w=Math.min(900,Math.max(240,g.measureText(notify).width+50));box(640-w/2,145,w,30,'#15121bcc',th.frame,5);text(notify,640,160,13,'#fff0ce','center');}
 if(worldTitle>0){const a=clamp(Math.min(worldTitle,3.5-worldTitle)/.65,0,1);g.save();g.globalAlpha=a;box(330,230,620,120,'#10151aaf','',4);text(m.name,640,270,42,th.main,'center','bold');g.fillStyle=th.main;g.fillRect(640-220*a,300,440*a,2);text(m.sub,640,325,15,C.paper,'center');g.restore();}
}
function worldMapPanel(){const th=WORLD_MAPS[worldMap].hud;for(let i=0;i<WORLD_ORDER.length;i++){const id=WORLD_ORDER[i],m=WORLD_MAPS[id],col=i%5,row=(i/5)|0,x=60+col*236,y=220+row*220;ornament(x,y,216,190,id===worldMap?'#324138':'#1c1820');circle(x+108,y+46,25,m.orb,m.hud.frame);text(m.name,x+108,y+100,17,m.hud.main,'center','bold');text(m.width+' px',x+108,y+127,13,C.muted,'center');const lock=m.req?.();text(id===worldMap?'HIỆN TẠI':lock?'CHƯA MỞ':'ĐÃ MỞ',x+108,y+172,12,lock?C.red:th.main,'center','bold');if(col<4)text('›',x+226,y+105,26,C.gold,'center');}addButton(525,665,230,40,'Đóng bản đồ · ESC',()=>modal=null);}
function worldDraw(){buttons=[];const cam=worldCam();worldBackdrop(cam);g.save();g.translate(-cam,0);for(const d of drops)circle(d.x,d.y-4,6,d.type==='stone'?C.gold:'#8fd7ac');for(const e of enemies){if(e.x<cam-180||e.x>cam+W+180)continue;monsterSprite(e);if(e.type>=8){circle(e.x,e.y-4,16,'',TYPES[e.type].color,.40);}if(e.type>=8||bossType(e.type))text(TYPES[e.type].name,e.x,e.y-(bossType(e.type)?145:88),12,TYPES[e.type].color,'center','bold');}heroSprite(p.x,p.y);renderEffects();g.restore();worldParticles();worldHud();if(modal){buttons=[];panel();}if(mouse.inside)circle(mouse.x,mouse.y,4,C.gold);}

