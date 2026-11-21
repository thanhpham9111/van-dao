'use strict';
// V9 direction-aware locomotion. Direction indices match the projected screen plane.
// 0 E, 1 SE, 2 S, 3 SW, 4 W, 5 NW, 6 N, 7 NE.
const V9_DIRS=['E','SE','S','SW','W','NW','N','NE'];
const V9_RUN=['run9_E','run9_SE','run9_S','run9_SE','run9_E','run9_NE','run9_N','run9_NE'];
const V9_FLIP=[1,1,1,-1,-1,-1,1,1];
const V9_NPC_ORDER=['inn','shop','sentry','herbalist','wanderer','bambooKeeper','mountainHunter','snowHermit','swampMedic','desertSmith','demonWatcher','ghostSeer'];
function v9Dir(dx,dy,last=0,world=true,margin=5){
 const sy=dy*(world?HD.tilt:1);if(Math.hypot(dx,sy)<.12)return last;
 const deg=(Math.atan2(sy,dx)*180/Math.PI+360)%360,delta=Math.abs(((deg-last*45+540)%360)-180);
 return delta<=22.5+margin?last:Math.round(deg/45)%8;
}
const v9OldReset=v8Reset;v8Reset=function(){v9OldReset();V8.dir=Number.isInteger(p?.v9Facing)?p.v9Facing:2;V8.walked=0;};
function v9Travel(dt,x,y,s){let dx=p.x-x,dy=p.y-y,d=Math.hypot(dx,dy),speed=d/Math.max(dt,.001);
 if(speed>11){V8.dir=v9Dir(dx,dy,V8.dir??2,!!p.worldMode);p.v9Facing=V8.dir;if(Math.abs(dx)>.12)p.face=Math.sign(dx);V8.phase+=d/Math.max(7.8,(s.speed||230)/24);}
 V8.walked=speed;
}
function v9DrawCell(id,index,cols,rows,x,y,size,flip=1,alpha=1,breath=0){
 const a=imgs[id];if(!a?.ready)return false;const sw=a.img.naturalWidth/cols,sh=a.img.naturalHeight/rows;
 g.save();g.translate(x,y);g.scale(flip,1);g.globalAlpha=alpha;g.imageSmoothingEnabled=true;
 const h=size*(sh/sw)*(1+breath);
 g.drawImage(a.img,index%cols*sw,Math.floor(index/cols)*sh,sw,sh,-size*.5,-h*.875,size,h);g.restore();return true;
}
function v9HeroBody(x,y,world){
 const dir=V8.dir??p.v9Facing??2,alpha=p.hurt>0&&Math.floor(p.hurt*22)%2===0?.55:1,frame=Math.floor(V8.phase)%12;
 if(animation.name==='run'||animation.name==='dash'){
  // Corresponding frame indices across directions preserve the stride phase on turns.
  const id=V9_RUN[dir],flip=V9_FLIP[dir];
  if(animation.name==='dash')v9DrawCell(id,frame,4,3,x-p.dx*26,y-p.dy*(world?18:26),122,flip,.18);
  if(v9DrawCell(id,frame,4,3,x,y,124,flip,alpha))return;
  sprite('run',frame,4,3,x,y,112,p.face,.95,alpha);return;
 }
 if(animation.name==='idle'){
  const idleFrame=[2,3,4,5,6,7,0,1][dir];
  if(v9DrawCell('idle9',idleFrame,4,2,x,y,124,1,alpha,.003*Math.sin(elapsed*2.2)))return;
  sprite('action',0,4,3,x,y,112,p.face,.95,alpha);return;
 }
 // Attack and cast use the original authored action frames; keep their timing.
 let i=animation.name==='attack'?(p.attackT>.20?6:p.attackT>.08?7:8):animation.name==='cast'?10:animation.name==='hurt'?11:0;
 sprite('action',i,4,3,x,y,112,p.face,.95,alpha);
}
heroSprite=function(x,y){hdEllipse(g,x,y+1,19,7,'#101b1c80');v9HeroBody(x,y,false);};
hdHero=function(z){hdEllipse(g,z.x,z.y-1,19,7,'#101b1c80');v9HeroBody(z.x,z.y,true);};

// NPC locomotion: smooth acceleration and deceleration, direction retained on stop,
// independent step phase from distance traveled. Conversation stops and turns NPC.
function v9NPCUpdate(dt){
 for(const o of OW_POI){const d=V8_INFO[o.id];if(!d||o.kind==='v14roamer'||V16_NPCS[o.id])continue;const n=v8NPC(o);
  n.dir??=1;n.gait??=0;n.vx??=0;n.vy??=0;
  if(dist(n,p)>1000){n.vx=n.vy=0;n.walking=false;continue;}
  const close=dist(n,p)<88||V8.target?.id===n.id||modal?.npc===n.id;
  if(close){n.walking=false;n.vx=n.vy=0;n.dir=v9Dir(p.x-n.x,p.y-n.y,n.dir,true,0);n.face=V9_FLIP[n.dir];n.task='Trò chuyện';continue;}
  const day=(p.worldTime%360)/15,stationary=d.style==='elder'||d.style==='merchant',sp=stationary?31:d.style==='guard'?57:47;
  n.wait-=dt;if(!n.way&&n.wait<=0){const ang=hashOW(n.homeX|0,n.homeY|0,Math.floor(p.worldTime/5)+37)*TAU,rr=stationary?24:68+hashOW(n.homeY|0,n.homeX|0,5)*38;
    const q={x:n.homeX+Math.cos(ang)*rr,y:n.homeY+Math.sin(ang)*rr};
    if(!owBlocked(q.x,q.y,10)&&v8Line(n,q,10,true))n.way=q;else n.wait=2+hashOW(n.homeX,n.homeY,3)*4;}
  let tx=0,ty=0;if(n.way){let dx=n.way.x-n.x,dy=n.way.y-n.y,l=Math.hypot(dx,dy);if(l<2.5){n.way=null;n.wait=2.8+hashOW(n.homeX,n.homeY,17)*5;}else{let pace=sp*Math.min(1,l/18);tx=dx/l*pace;ty=dy/l*pace;}}
  const ax=tx-n.vx,ay=ty-n.vy,mag=Math.hypot(ax,ay),step=(n.way?180:270)*dt;
  if(mag<=step){n.vx=tx;n.vy=ty;}else{n.vx+=ax/mag*step;n.vy+=ay/mag*step;}
  const xx=n.x,yy=n.y;owMove(n,n.x+n.vx*dt,n.y+n.vy*dt,10);const dx=n.x-xx,dy=n.y-yy,travel=Math.hypot(dx,dy);
  n.walking=travel/Math.max(dt,.001)>3;
  if(n.walking){n.dir=v9Dir(dx,dy,n.dir,true,3);n.face=V9_FLIP[n.dir];n.gait+=travel/(stationary?2.7:3.3);n.phase=n.gait/12;}
  else if(n.way&&Math.hypot(n.vx,n.vy)>8){n.way=null;n.wait=2;n.vx=n.vy=0;}
  n.task=n.walking?'Đang di chuyển':day<6||day>20?'Tĩnh tu':stationary?'Chờ đạo hữu':d.style==='guard'?'Tuần tra':d.style==='woman'?'Thu thập linh khí':'Nghỉ chân';
 }
}
v8NPCUpdate=v9NPCUpdate;
// NPC atlas contains two independently painted stride keys per front/rear 3/4 view.
// Intermediate six samples of each half-cycle are derived by a continuous band warp,
// not ghosted image blending. Feet remain referenced to the same fixed contact anchor.
const V9_NPC_GAIT=[
 [1,0,0],[.76,.6,-.25],[.51,1.2,-.5],[.39,1.7,-.25],[.58,1.1,.2],[.84,.4,.35],
 [1,0,0],[.76,.6,.25],[.51,1.2,.5],[.39,1.7,.25],[.58,1.1,-.2],[.84,.4,-.35]
];
function v9NPCDraw(d,n,z){
 const dir=n.dir??1,back=dir===5||dir===6||dir===7,flip=V9_FLIP[dir],phase=((Math.floor(n.gait??0)%12)+12)%12;
 const frontAtlas='npc9_front_'+(phase<6?'A':'B'),backAtlas='npc9_back_'+(phase<6?'A':'B'),id=back?backAtlas:frontAtlas;
 if(!n.walking&&(dir===0||dir===4)){v8Figure(d,z.x,z.y,1,flip,0,false);return;}
 const a=imgs[id];const index=V9_NPC_ORDER.indexOf(d.id);if(!a?.ready||index<0){v8Figure(d,z.x,z.y,1,flip,0,!!n.walking);return;}
 const [stride,bob,sway]=n.walking?V9_NPC_GAIT[phase]:[.40,0,0];
 const sw=a.img.naturalWidth/4,sh=a.img.naturalHeight/3,sx=index%4*sw,sy=Math.floor(index/4)*sh;
 const w=99,h=100,base=sh*.875,segments=12;g.save();g.translate(z.x,z.y);g.scale(flip,1);g.imageSmoothingEnabled=true;
 for(let k=0;k<segments;k++){
  const y0=sh*k/segments,y1=sh*(k+1)/segments,mid=(y0+y1)/2/sh;
  // Contract only the distance between lower limbs during the passing pose.
  const lower=clamp((mid-.57)/.36,0,1),factor=1-(1-stride)*.34*lower;
  const dy0=(y0-base)*h/sh-bob*(1-clamp((y0/sh-.57)/.305,0,1));
  const dy1=(y1-base)*h/sh-bob*(1-clamp((y1/sh-.57)/.305,0,1));
  const shift=sway*(1-lower)*2.2;
  g.drawImage(a.img,sx,sy+y0,sw,y1-y0,-w*factor/2+shift,dy0,w*factor,Math.max(.25,dy1-dy0+.25));
 }
 g.restore();
}

// V10 — six permanent attributes; point budget follows level, including old saves.
const V10_ATTRS=[
 {key:'body',name:'Căn cốt',glyph:'CC',desc:'+12 sinh mệnh · +2 phòng ngự',color:'#e7a58e'},
 {key:'power',name:'Lực đạo',glyph:'LĐ',desc:'+3 công kích',color:'#e9c47e'},
 {key:'spirit',name:'Linh thức',glyph:'LT',desc:'+6 linh lực · +0,5 hồi/giây · +2% pháp lực',color:'#96cde0'},
 {key:'agility',name:'Thân pháp',glyph:'TP',desc:'+3 tốc độ · +1% tốc đánh · -0,015s hồi lướt',color:'#a2d6a9'},
 {key:'wisdom',name:'Ngộ tính',glyph:'NT',desc:'+3% tu vi nhận · +1% cơ hội đột phá',color:'#d4b5ed'},
 {key:'fortune',name:'Khí vận',glyph:'KV',desc:'+1% chí mạng · +0,5% cơ hội linh thạch',color:'#f6df97'}
];
function v10Attributes(){if(!p.v10Attrs||typeof p.v10Attrs!=='object')p.v10Attrs=Object.fromEntries(V10_ATTRS.map(a=>[a.key,0]));return p.v10Attrs;}
function v10Budget(){return 6+Math.max(0,p.level-1)*3;}
function v10Spent(){const a=v10Attributes();return V10_ATTRS.reduce((n,d)=>n+Math.max(0,Math.floor(Number(a[d.key])||0)),0);}
function v10Points(){return Math.max(0,v10Budget()-v10Spent());}
const v10OldStats=currentStats;
currentStats=function(){const s=v10OldStats(),a=v10Attributes(),num=k=>Math.max(0,Number(a[k])||0);s.hp+=12*num('body');s.def+=2*num('body');s.attack+=3*num('power');s.mp+=6*num('spirit');s.regen+=.5*num('spirit');s.speed+=3*num('agility');s.rate*=1+.01*num('agility');s.dashCd=Math.max(.40,s.dashCd-.015*num('agility'));s.crit=clamp(s.crit+.01*num('fortune'),0,.6);s.luck+=.05*num('fortune');s.spellAtk=s.attack*1.65*(1+.02*num('spirit'));s.xpBonus=.03*num('wisdom');s.breakBonus=.01*num('wisdom');return s;};
function v10BreakChance(){return clamp(.45+(p.foundation||0)+.10*(p.breakFails||0)+currentStats().breakBonus,.05,.95);}
const v10OldGainXP=gainXP;gainXP=function(q){const old=p.level;v10OldGainXP(Math.round(q*(1+currentStats().xpBonus)));if(p.level>old){message('Tu vi tinh tiến · +'+3*(p.level-old)+' điểm thuộc tính · C');save();}};
function v10Preserve(old){const now=currentStats();p.hp=clamp(p.hp/old.hp*now.hp,1,now.hp);p.mp=clamp(p.mp/old.mp*now.mp,0,now.mp);}
function v10Add(key,n=1){if(!p||modal?.kind!=='stats10'||!V10_ATTRS.some(a=>a.key===key))return;const q=Math.min(v10Points(),Math.max(0,Math.floor(n)));if(!q)return;const old=currentStats(),a=v10Attributes();a[key]=(Number(a[key])||0)+q;v10Preserve(old);save();}
function v10Reset(){if(modal?.kind!=='stats10'||!v10Spent()||p.stones<10)return;const old=currentStats();p.stones-=10;p.v10Attrs=Object.fromEntries(V10_ATTRS.map(a=>[a.key,0]));v10Preserve(old);save();}
function v10Open(){openPanel('stats10');v8Cancel();V8.vx=V8.vy=0;}
function v10FightPower(s){return Math.round(s.attack*4+s.def*3+s.hp*.45+s.mp*.3+s.spellAtk*.8+s.crit*100+s.rate*25);}
function v10Fmt(x,n=0){return Number(x).toLocaleString('vi-VN',{minimumFractionDigits:n,maximumFractionDigits:n});}
function v10Panel(){
 g.fillStyle='#061319bb';g.fillRect(0,0,W,H);ornament(80,75,1120,570,'#12282ded');
 text('HỒ SƠ TU SĨ',110,110,25,C.gold,'left','bold');text('THUỘC TÍNH · CHIẾN LỰC · TU LUYỆN',110,139,11,'#a7c5b2','left','bold');
 addButton(1125,93,48,34,'×',()=>modal=null);
 const a=v10Attributes(),s=currentStats(),pts=v10Points();
 // Left: identity and calculated battle rating, not an additional damage multiplier.
 box(108,165,245,446,'#112026','#58786d',5);const gr=g.createRadialGradient(230,304,8,230,304,120);gr.addColorStop(0,'#55746a');gr.addColorStop(1,'#14262d');g.fillStyle=gr;g.fillRect(116,173,229,226);seal(g,230,289,77,'#c7ad78',.05,.38);v9DrawCell('idle9',4,4,2,230,390,238);
 text(p.v8Name||'Vô Danh',230,418,21,C.paper,'center','bold');text(CLASSES[p.cls].name+' · '+realm(),230,445,13,C.jade,'center');
 text('CHIẾN LỰC',230,482,12,C.gold,'center','bold');text(v10Fmt(v10FightPower(s)),230,510,34,'#f3d38f','center','bold');text('Cấp '+p.level+' · Hạ '+(p.kills||0)+' yêu thú',230,546,12,C.muted,'center');text('Linh thạch: '+p.stones,230,574,12,C.gold,'center');
 // Middle: permanent allocations.
 box(369,165,435,446,'#152b30','#58786d',5);text('THUỘC TÍNH GỐC',389,190,15,C.gold,'left','bold');text('Điểm còn lại: '+pts,786,190,15,pts?'#f6dc94':C.muted,'right','bold');
 V10_ATTRS.forEach((d,i)=>{const y=212+i*54;box(381,y,411,49,i%2?'#203d40':'#1b3438','',4);circle(399,y+24,12,'#172a30',d.color);text(d.glyph,399,y+24,13,d.color,'center','bold');text(d.name,418,y+13,14,d.color,'left','bold');text(d.desc,418,y+35,10,C.paper);text(String(a[d.key]||0),693,y+24,18,C.paper,'right','bold');const bx=708;box(bx,y+8,34,32,pts?'#31534c':'#273437',pts?'#b6d5ad':'#586565',4);text('+1',bx+17,y+24,12,pts?C.paper:C.muted,'center','bold');if(pts)buttons.push({x:bx,y:y+8,w:34,h:32,fn:()=>v10Add(d.key)});box(bx+39,y+8,35,32,a[d.key]>0?'#493d40':'#273437',a[d.key]>0?'#d2a88c':'#586565',4);text('−1',bx+56,y+24,12,a[d.key]>0?C.paper:C.muted,'center','bold');if(a[d.key]>0)buttons.push({x:bx+39,y:y+8,w:35,h:32,fn:()=>v11AttrMinus(d.key)});});
 text('6 điểm ban đầu · +3 điểm mỗi cấp',388,559,12,'#a7bcb1');if(v10Spent())addButton(389,572,394,27,'Hoàn toàn bộ điểm miễn phí',v10Reset);else{text('Có thể cộng / trừ điểm bất cứ lúc nào',588,585,12,C.muted,'center');}
 // Right: current actual derived values (includes all gear, techniques and relics).
 box(820,165,352,446,'#152b30','#58786d',5);const detail=modal.statTab||0;for(let i=0;i<2;i++){const x=832+i*161;box(x,175,157,28,detail===i?'#35534d':'#192d33',detail===i?'#c7b478':'#59766a',3);text(i?'TU LUYỆN / KHÁC':'CHIẾN ĐẤU',x+78,189,12,C.gold,'center','bold');buttons.push({x,y:175,w:157,h:28,fn:()=>modal.statTab=i});}
 const rows=detail?[['Tu vi nhận thêm','+'+v10Fmt(s.xpBonus*100)+'%'],['Đột phá kế tiếp',p.level>=45?'Viên mãn':'Vượt lôi kiếp'],['Rơi thêm linh thạch',v10Fmt(clamp(.30+s.luck*.1,0,1)*100,1)+'%'],['Hồi linh lực / giây',v10Fmt(s.regen,1)],['Hồi lướt',v10Fmt(s.dashCd,2)+'s'],['Hồi máu khi hạ quái',v10Fmt(s.leech,1)],['Thiêu đốt / nhịp',v10Fmt(s.burn,1)],['Làm chậm yêu thú',v10Fmt(s.slow*100,1)+'%'],['Linh thạch',v10Fmt(p.stones)],['Đan dược',v10Fmt(p.pills)],['Yêu thú đã hạ',v10Fmt(p.kills||0)],['Cấp hiện tại',''+p.level],['Tu vi',v10Fmt(p.xp)+' / '+xpNeed()]]:[['Sinh mệnh',v10Fmt(p.hp)+' / '+v10Fmt(s.hp)],['Linh lực',v10Fmt(p.mp)+' / '+v10Fmt(s.mp)],['Công kích',v10Fmt(s.attack)],['Phòng ngự',v10Fmt(s.def)],['Giảm sát thương',v10Fmt(s.damageReduction*100,1)+'%'],['Sát thương kỹ năng*',v10Fmt(s.spellAtk)],['Chí mạng đòn thường',v10Fmt(s.crit*100,1)+'%'],['Sát thương chí mạng',v10Fmt(s.critMultiplier*100)+'%'],['Tấn công / giây',v10Fmt(s.rate/.39,2)],['Di chuyển',v10Fmt(s.speed)+' px/s'],['Tầm đòn cơ bản',v10Fmt(s.range)+' px'],['Linh lực mỗi kỹ năng',v10Fmt(s.skillCost)],['Hồi chiêu kỹ năng',v10Fmt(s.skillCd,2)+'s']];
 rows.forEach(([k,v],i)=>{const y=214+i*28;box(832,y,328,25,i%2?'#203a3d':'#193135','',3);text(k,842,y+12,12,C.paper);text(v,1149,y+12,13,i>=10?C.gold:'#cbe5cf','right','bold');});
 text('C / ESC · Đóng bảng   |   *Sát thương kỹ năng cơ sở, trước phòng ngự hoặc chia pháp cầu',640,628,11,'#b7c9b8','center');
}
const v10OldPanel=panel;panel=function(){if(modal?.kind==='stats10'){v10Panel();return;}v10OldPanel();};
function v10HudButton(x,y,w){const n=v10Points();box(x,y,w,31,'#102324ef',n?'#e5c27c':'#658c78',4);text('C · Hồ sơ tu sĩ',x+12,y+15,13,C.paper,'left','bold');text(n?'+'+n+' điểm':'Chiến lực '+v10FightPower(currentStats()),x+w-12,y+15,12,n?C.gold:C.muted,'right','bold');buttons.push({x,y,w,h:31,fn:v10Open});}
const v10WorldHud=worldHud;worldHud=function(){v10WorldHud();v10HudButton(12,151,320);};
const v10ArenaHud=hud;hud=function(){v10ArenaHud();v10HudButton(12,110,320);};

// Three distinct schools: starting gear, stat profiles, attacks, active skills and outfit palette.
const V10_SCHOOLS=[
 {name:'Kiếm Tu',title:'Thanh Vân Kiếm Khách',color:'#7fc4b2',robe:'Thanh Vân đạo bào',normal:'Thanh Vân Trảm',skill:'Vạn Kiếm Xuyên Tâm',cost:18,cd:1.25,role:'Cận chiến nhanh · chí mạng',atkDesc:'Kiếm trảm hình cung',skillDesc:'Kiếm khí xuyên 2 mục tiêu',weapon:'Thanh Vân Kiếm',base:{hp:110,mp:70,attack:25,def:7,speed:245,crit:.19,range:123,rate:1.08},ids:[1,20]},
 {name:'Thể Tu',title:'Huyền Thạch Võ Giả',color:'#c99a5e',robe:'Huyền Thạch chiến y',normal:'Huyền Thạch Quyền',skill:'Chấn Sơn Băng Quyền',cost:22,cd:2.6,role:'Chịu đòn · sát thương cận thân',atkDesc:'Quyền chấn, đẩy lùi',skillDesc:'Sóng chấn xuyên 3 · hộ thể 2,6s',weapon:'Toái Sơn Quyền Giáp',base:{hp:168,mp:53,attack:33,def:16,speed:222,crit:.07,range:94,rate:.90},ids:[3,17]},
 {name:'Pháp Tu',title:'Hàn Nguyệt Linh Sư',color:'#9a8fe0',robe:'Tử Nguyệt pháp y',normal:'Linh Châu',skill:'Hàn Nguyệt Tam Tinh',cost:26,cd:2.0,role:'Đánh xa · pháp thuật khống chế',atkDesc:'Linh châu tầm xa',skillDesc:'3 pháp cầu · làm chậm',weapon:'Hàn Nguyệt Linh Trượng',base:{hp:94,mp:110,attack:23,def:5,speed:235,crit:.10,range:370,rate:.92},ids:[0,19]}
];
V10_SCHOOLS.forEach((d,i)=>{CLASSES[i].stats={...d.base};CLASSES[i].description=d.role;const w=EQUIPMENT[d.ids[0]],ar=EQUIPMENT[d.ids[1]];d.weaponId=EQUIPMENT.length;EQUIPMENT.push({...w,id:d.weaponId,name:d.weapon,atk:[10,12,8][i],style:['fast','heavy','ranged'][i]});d.armorId=EQUIPMENT.length;EQUIPMENT.push({...ar,id:d.armorId,name:d.robe,atk:0,def:[5,8,3][i]});});
function v10StarterKit(cls){const d=V10_SCHOOLS[cls];addGear(d.weaponId,0);addGear(d.armorId,0);p.pills=[2,3,2][cls];p.stones=[5,3,5][cls];p.v10SkillCd=0;p.v10Guard=0;}
const v10ClassStats=currentStats;
currentStats=function(){const s=v10ClassStats(),d=V10_SCHOOLS[p.cls];s.spellAtk=s.attack*[1.75,1.55,1.90][p.cls]*(1+.02*(v10Attributes().spirit||0));s.skillCost=d.cost;s.skillCd=d.cd;s.damageReduction=s.def/(100+s.def);s.critMultiplier=1.8;return s;};
function v10Projectile(a,speed,life,r,dmg,kind,pierce=1,spell=false){bolts.push({x:p.x+Math.cos(a)*23,y:p.y+Math.sin(a)*23,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life,r,dmg,kind,color:V10_SCHOOLS[p.cls].color,good:true,pierce,hit:[],spell});}
attack=function(){if(p.atkCd>0||p.dashT>0)return;const s=currentStats(),d=V10_SCHOOLS[p.cls],a=targetAngle();p.face=Math.cos(a)<0?-1:1;p.attackAngle=a;p.atkCd=.39/s.rate;p.attackT=.28;p.v10Action=a;const c=p.cls;
 if(c===2){const crit=random()<s.crit;v10Projectile(a,530,s.range/530,10,s.attack*(crit?s.critMultiplier:1),'orb');bolts.at(-1).crit=crit;effect(p.x,p.y,d.color,'castseal',.22,{radius:24});return;}
 const power=c===1?1.10:1,reach=s.range,arc=c===1?1.20:1.03;effect(p.x,p.y,d.color,c===1?'punch':'slash',.28,{a,radius:reach});
 for(const e of enemies){if(e.dead)continue;let ea=Math.atan2(e.y-p.y,e.x-p.x);if(dist(p,e)<reach+TYPES[e.type].r&&Math.abs(angleDelta(ea,a))<arc){const crit=random()<s.crit;hit(e,s.attack*power*(crit?s.critMultiplier:1),crit);e.x+=Math.cos(a)*(c===1?23:11);e.y+=Math.sin(a)*(c===1?23:11);}}
};
cast=function(){const s=currentStats(),d=V10_SCHOOLS[p.cls];if(p.mp<d.cost){message('Không đủ linh lực');return;}if(p.castT>0||p.dashT>0||(p.v10SkillCd||0)>0)return;const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);p.mp-=d.cost;p.castT=.40;p.v10SkillCd=d.cd;p.face=Math.cos(a)<0?-1:1;p.v10Action=a;
 if(p.cls===0){v10Projectile(a,680,1.1,13,s.spellAtk,'blade',2,true);effect(p.x,p.y,d.color,'slash',.33,{a,radius:58});}
 else if(p.cls===1){p.v10Guard=2.6;v10Projectile(a,470,.47,33,s.spellAtk,'shock',3,true);effect(p.x,p.y,d.color,'punch',.4,{a,radius:110});}
 else{for(const k of [-1,0,1])v10Projectile(a+k*.23,500,1.08,12,s.spellAtk*.58,'orb',1,true);effect(p.x,p.y,d.color,'castseal',.5,{radius:52});}
};
const v10Damage=damagePlayer;damagePlayer=function(n){return v10Damage(n*((p?.v10Guard||0)>0?.65:1));};
const v10Tick=update;update=function(dt){if(p&&mode==='play'&&!modal){p.v10SkillCd=Math.max(0,(p.v10SkillCd||0)-dt);p.v10Guard=Math.max(0,(p.v10Guard||0)-dt);}v10Tick(dt);};
// Runtime fabric colouring, retaining the original body, foot anchor and all twelve authored frames.
let v10PreviewClass=null;
function v10Variant(id,cls){if(!cls||!['action','run','idle9',...V9_RUN].includes(id))return id;const k=id+'_school'+cls;if(imgs[k])return k;const src=imgs[id];if(!src?.ready)return id;const im=src.img,cv2=document.createElement('canvas');cv2.width=im.naturalWidth;cv2.height=im.naturalHeight;const ct=cv2.getContext('2d');ct.drawImage(im._img||im,0,0);const a=ct.getImageData(0,0,cv2.width,cv2.height),b=a.data;
 for(let j=0;j<b.length;j+=4){if(b[j+3]<20)continue;const r=b[j],g=b[j+1],bl=b[j+2],l=(r+g+bl)/3,spread=Math.max(r,g,bl)-Math.min(r,g,bl); // preserve warm skin and dark hair
 if(l<47||r>bl*1.20&&r>g*1.12||spread>83)continue;const blend=clamp((l-47)/72,0,.90),mul=cls===1?[1.16,.78,.48]:[.91,.72,1.18];b[j]=clamp(r*(1-blend+mul[0]*blend),0,255);b[j+1]=clamp(g*(1-blend+mul[1]*blend),0,255);b[j+2]=clamp(bl*(1-blend+mul[2]*blend),0,255);}
 ct.putImageData(a,0,0);cv2.naturalWidth=cv2.width;cv2.naturalHeight=cv2.height;imgs[k]={img:cv2,ready:true};return k;
}
const v10Cell=v9DrawCell;v9DrawCell=function(id,...rest){return v10Cell(v10Variant(id,v10PreviewClass??p?.cls??0),...rest);};
const v10Sprite=sprite;sprite=function(id,...rest){return v10Sprite(v10Variant(id,v10PreviewClass??p?.cls??0),...rest);};
function v10Focus(x,y,size,cls,phase=0){const d=V10_SCHOOLS[cls];g.save();g.translate(x,y);if(cls===1){for(const w of [-1,1]){g.fillStyle='#ba8a55';g.strokeStyle='#f1c782';g.lineWidth=1.3;g.beginPath();g.roundRect(w*size*.145-5,-size*.40,10,13,3);g.fill();g.stroke();}}else if(cls===2){const ox=Math.cos(phase)*size*.22,oy=-size*.45+Math.sin(phase)*size*.04;g.shadowBlur=12;g.shadowColor=d.color;diamond(g,ox,oy,5,d.color);circle(ox,oy,10,'',d.color,.5);}g.restore();}
const v10Hero=v9HeroBody;v9HeroBody=function(x,y,world){const cls=p.cls,dir=V8.dir??2,act=p.attackT>0||p.castT>0;if(cls===1&&act&&animation.name!=='hurt'){let j=p.castT>0?7:p.attackT>.15?0:3;v9DrawCell(V9_RUN[dir],j,4,3,x,y,124,V9_FLIP[dir]);}else if(cls===2&&act&&animation.name!=='hurt'){sprite('action',10,4,3,x,y,112,p.face,.95,1);}else v10Hero(x,y,world);if(cls)v10Focus(x,y,124,cls,elapsed*3);if(p.v10Guard>0){g.save();g.globalAlpha=.5;g.strokeStyle='#e9ad69';g.lineWidth=2;g.beginPath();g.ellipse(x,y-26,24,38,0,0,TAU);g.stroke();g.restore();}};
function v10CombatEffects(v){for(const f of fx){if(!['punch','castseal'].includes(f.kind))continue;const z=p.worldMode?hdPoint(f.x,f.y,v):f,q=1-f.life/f.max;g.save();g.translate(z.x,z.y-12);g.scale(1,p.worldMode?HD.tilt:1);g.globalAlpha=(1-q)*.9;g.strokeStyle=f.color;g.shadowColor=f.color;g.shadowBlur=10;if(f.kind==='punch'){g.rotate(f.a||0);for(let i=0;i<3;i++){g.lineWidth=4-i;g.beginPath();g.arc(0,0,(f.radius||70)*(.25+q*.65)+i*11,-.66,.66);g.stroke();}for(let i=0;i<5;i++){const ang=(i-2)*.26,r=(f.radius||70)*(.5+q*.5);diamond(g,r*Math.cos(ang),r*Math.sin(ang),3,f.color);}}else{seal(g,0,0,12+q*(f.radius||40),f.color,q*2,1-q);circle(0,0,7+q*15,'',f.color,.8);}g.restore();}}
const v10HDfx=hdEffects;hdEffects=function(v){v10HDfx(v);v10CombatEffects(v);};const v10ArenaFx=renderEffects;renderEffects=function(){v10ArenaFx();v10CombatEffects();};
// Enrollment selection shows each school's character, specialty, equipment and named attacks.
function v10CreateCards(){const y=302;for(let i=0;i<3;i++){const d=V10_SCHOOLS[i],x=78+i*181,sel=V8.select===i;box(x,y,169,205,sel?'#35544e':'#142c35ef',sel?d.color:'#719382',5);v10PreviewClass=i;v9DrawCell('idle9',4,4,2,x+84,y+97,114);v10Focus(x+84,y+97,114,i,0);v10PreviewClass=null;text(d.name,x+84,y+108,17,d.color,'center','bold');text(d.role,x+84,y+128,10,C.paper,'center');text('HP '+(d.base.hp+7+(i===1?25:0)+2*EQUIPMENT[d.armorId].def)+' · MP '+(d.base.mp+(i===2?20:0)),x+84,y+148,11,C.paper,'center');text(d.normal,x+84,y+169,10,d.color,'center','bold');text(d.skill,x+84,y+188,10,d.color,'center');buttons.push({x,y,w:169,h:205,fn:()=>V8.select=i});}const d=V10_SCHOOLS[V8.select];box(630,306,360,219,'#122b33e8',d.color,5);text(d.title,650,336,20,d.color,'left','bold');text('Trang phục: '+d.robe,650,372,13,C.paper);text('Vũ khí: '+d.weapon,650,397,13,C.paper);text('LMB · '+d.atkDesc,650,433,13,C.paper);text('RMB · '+d.skillDesc,650,460,12,d.color);text('Linh lực '+d.cost+' · Hồi '+d.cd+'s',650,491,12,C.muted);}
function v10SkillHud(){const d=V10_SCHOOLS[p.cls],cool=p.v10SkillCd||0;box(12,188,320,27,'#102324df','#658c78',4);text('RMB · '+d.skill,23,201,11,d.color,'left','bold');text(cool>0?cool.toFixed(1)+'s':d.cost+' MP',321,201,11,cool>0?C.muted:C.paper,'right');}
const v10Hud2=worldHud;worldHud=function(){v10Hud2();v10SkillHud();};

