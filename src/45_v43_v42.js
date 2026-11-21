'use strict';
// V43 · illustrated geography. All markers use authoritative world coordinates.
const V43_ATLAS_IMG=imgs.v45Atlas.img;
const V43_MAP={x:48,y:116,w:846,h:424,rx:910,rw:322};
function v43MapPoint(x,y,w,h,r){return {x:x+r.x/OW.w*w,y:y+r.y/OW.h*h};}
function v43MapLine(pts,color,width){g.strokeStyle=color;g.lineWidth=width;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();}
function v43MapPlate(x,y,w,h,fill='#0b2024eb',stroke='#b8a578',radius=5){g.beginPath();g.roundRect(x,y,w,h,radius);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke();}}
function v43MapCompass(x,y){g.save();g.translate(x,y);g.strokeStyle='#e3d5a3a0';g.lineWidth=.8;g.beginPath();g.arc(0,0,20,0,TAU);g.stroke();g.rotate(Math.PI/4);g.beginPath();g.moveTo(0,-24);g.lineTo(0,24);g.moveTo(-24,0);g.lineTo(24,0);g.stroke();g.rotate(-Math.PI/4);for(let i=0;i<4;i++){g.rotate(Math.PI/2);g.fillStyle=i===3?'#fff3bf':'#918668';g.beginPath();g.moveTo(0,-20);g.lineTo(4,0);g.lineTo(0,5);g.lineTo(-4,0);g.closePath();g.fill();}text('B',0,-30,10,'#fff3c9','center','bold');g.restore();}
function v43AtlasArt(x,y,w,h,{selected=null,labels=true,knownOnly=false,click=null,poi=true}={}){
 const sx=w/OW.w,sy=h/OW.h,scale=Math.min(w/846,h/424),seen=p.discovered||[],at=r=>v43MapPoint(x,y,w,h,r),t=performance.now()/1000;
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.imageSmoothingEnabled=true;
 const art=V43_ATLAS_IMG.naturalWidth?V43_ATLAS_IMG:v15AtlasRaster();g.drawImage(art,x,y,w,h);
 // Soft regional mist replaces the distracting square fog-of-war grid.
 for(const r of REGIONS)if(!seen.includes(r.id)){const z=at(r),rr=w*.128,gr=g.createRadialGradient(z.x,z.y,rr*.16,z.x,z.y,rr);gr.addColorStop(0,knownOnly?'#102126eb':'#1021267a');gr.addColorStop(.63,knownOnly?'#17272cbb':'#17272c55');gr.addColorStop(1,'#10212600');g.fillStyle=gr;g.fillRect(z.x-rr,z.y-rr,2*rr,2*rr);}
 const shade=g.createLinearGradient(x,y,x,y+h);shade.addColorStop(0,'#0b141c48');shade.addColorStop(.48,'#10222605');shade.addColorStop(1,'#07171d44');g.fillStyle=shade;g.fillRect(x,y,w,h);
 // Roads remain real connections, with a dark outline and fine gold inlay.
 g.lineCap='round';g.lineJoin='round';
 for(const [a,b] of ROAD_EDGES){const aa=REGIONS[a],bb=REGIONS[b],u=at(aa),v=at(bb),enabled=seen.includes(aa.id)&&seen.includes(bb.id),pts=[u,v];v43MapLine(pts,'#152827c9',3.3*scale);g.setLineDash(enabled?[]:[4*scale,5*scale]);v43MapLine(pts,enabled?'#dec58fb0':'#c6c0a070',1.15*scale);g.setLineDash([]);}
 if(poi&&scale>.75)for(const o of v8POIs()){if(!p.explored?.[Math.floor(o.x/OW.chunk)+':'+Math.floor(o.y/OW.chunk)])continue;const z=at(o);if(REGIONS.some(r=>Math.hypot(z.x-at(r).x,z.y-at(r).y)<23*scale))continue;const col=o.kind==='dungeon'?'#d9afff':o.kind==='v13node'?'#a9dfad':'#ffe1a0';diamond(g,z.x,z.y,2.6*scale,col);}
 const target=typeof v12Target==='function'?v12Target(v12Tracked()):null;if(target&&Number.isFinite(target.x)&&Number.isFinite(target.y)){const z=at(target);diamond(g,z.x,z.y,6*scale,'#ffe4a2');}
 for(const r of REGIONS){const d=V22_REG[r.id],z=at(r),isSel=selected===r.id,isKnown=seen.includes(r.id),isHere=p.mapId===r.id,cc=isKnown?d.color:'#b4b8aa',rr=11*scale;g.save();g.translate(z.x,z.y);if(isSel||isHere){g.strokeStyle=isSel?'#ffe6a6':'#8ce9d1';g.globalAlpha=.6+.25*Math.sin(t*4);g.lineWidth=1.5;g.beginPath();g.arc(0,0,rr+5+2*Math.sin(t*3),0,TAU);g.stroke();g.globalAlpha=1;}
   circle(0,0,rr+2,'#071c24d9',isSel?'#f5de9f':cc);circle(0,0,rr-2,'#172c32',cc);text(knownOnly&&!isKnown?'?':String(d.i),0,0,Math.max(9,12*scale),isSel?'#fff0b7':cc,'center','bold');g.restore();
   if(labels){const ww=Math.min(149*scale,w/5-4),hh=35*scale,py=z.y+17*scale;v43MapPlate(z.x-ww/2,py,ww,hh,isSel?'#193533f5':'#071d24d9',isSel?'#f6d493':'#b9ae7855',4);v33Fit(knownOnly&&!isKnown?'Chưa khám phá':r.name,z.x,py+10*scale,ww-8,Math.max(9,12*scale),isSel?'#ffe7ad':'#f4edda','center','bold');text(d.i===0?'AN TOÀN':`Lv ${d.min}–${d.max}`,z.x,py+25*scale,Math.max(8,10*scale),isKnown?cc:'#b6b6a7','center');}
   if(click)buttons.push({x:z.x-72*scale,y:z.y-18*scale,w:144*scale,h:73*scale,v33:'v43Map'+r.id,fn:()=>click(r.id)});
 }
 const player=p.worldMode?(typeof v36Inside==='function'&&v36Inside()?REG[p.mapId]:p):p.v28?.run?.return;if(player&&Number.isFinite(player.x)&&Number.isFinite(player.y)){const z=at(player);circle(z.x,z.y,4.5*scale,'#fff5cf','#172a2c');g.strokeStyle='#fff6c8';g.globalAlpha=.55;g.lineWidth=1;g.beginPath();g.arc(z.x,z.y,(8+2*Math.sin(t*4))*scale,0,TAU);g.stroke();g.globalAlpha=1;}
 if(typeof V29!=='undefined'&&V29.tracked){const e=enemies.find(a=>!a.dead&&a.v29World===V29.tracked);if(e){const z=at({x:e.homeX,y:e.homeY});circle(z.x,z.y,8*scale,'#4a1f42','#ffc5ed');text('!',z.x,z.y,10,'#fff1da','center','bold');}}
 if(scale>.75)v43MapCompass(x+w-28,y+h/2);g.restore();g.strokeStyle='#c4ad76';g.lineWidth=1.2;g.strokeRect(x,y,w,h);
}
// Larger main map; avoid the previous nested box layout and duplicate markers.
v22Atlas=function(){
 const {x,y,w,h,rx,rw}=V43_MAP,d=V22_REG[v22Selected||p.mapId]||V22_REG.thon,r=REG[d.id],[state,col]=v22Danger(d);
 g.fillStyle='#081b20f7';g.fillRect(0,0,W,H);v21Frame(25,25,1230,670,V21.silver);v18Title('SƠN HÀ ĐỊA ĐỒ',48,58,29,V21.gold);text('CỬU VỰC  /  '+realm()+'  ·  Chiến lực '+v10FightPower(currentStats())+'  ·  Khám phá '+p.discovered.length+'/10',49,92,13,'#bcccc2');
 v21Button(947,48,166,36,'Thôn tân thủ',()=>modal.v16Map='local');v21Button(1122,48,108,36,'Đóng ×',()=>modal=null);
 v43AtlasArt(x,y,w,h,{selected:d.id,click:id=>v22Selected=id});
 v43MapPlate(x,y+h+8,w,27,'#102b30','#7b8b7455');circle(x+17,y+h+21.5,4,'#fff1b4');text('Vị trí đạo hữu',x+28,y+h+21.5,11,'#e2ddc5');diamond(g,x+165,y+h+21.5,4,'#ffe1a0');text('Địa điểm',x+176,y+h+21.5,11,'#e2ddc5');diamond(g,x+264,y+h+21.5,4,'#a9dfad');text('Linh vật',x+275,y+h+21.5,11,'#e2ddc5');text('Chọn địa vực để xem thông tin và dẫn đường',x+w-10,y+h+21.5,11,'#b8c8bc','right');
 v43MapPlate(rx,y,rw,451,'#102629','#9a906e');text('CẢNH GIỚI & ĐỊA VỰC',rx+13,y+18,13,V21.gold,'left','bold');
 V22_ORDER.forEach((id,i)=>{const a=V22_REG[id],z=REG[id],yy=y+34+i*40,active=d.id===id,know=p.discovered.includes(id);v43MapPlate(rx+8,yy,rw-16,36,active?'#2b463b':'#102126',active?a.color:'#52686066');circle(rx+24,yy+18,9,'#152a2e',a.color);text(i,rx+24,yy+18,10,a.color,'center','bold');text(z.name,rx+40,yy+11,12,active?'#fff1c6':'#e7e5d1','left','bold');text(a.i?'Lv '+a.min+'–'+a.max+' · '+a.realm:'An toàn',rx+40,yy+26,10,a.color);text(p.mapId===id?'HIỆN TẠI':know?'ĐÃ ĐẾN':p.level<a.min?'VƯỢT CẤP':'CHƯA ĐẾN',rx+rw-16,yy+11,9,p.mapId===id?'#ffdf99':p.level<a.min?'#f1a19b':'#a1aca3','right');buttons.push({x:rx+8,y:yy,w:rw-16,h:36,v33:'v43List'+id,fn:()=>v22Selected=id});});
 v43MapPlate(x,583,1184,91,'#10272b',d.color);text(r.name,x+15,603,20,d.color,'left','bold');text(state,x+15,631,11,col,'left','bold');text(d.i?`${d.realm} · Lv ${d.min}–${d.max}  ·  Chiến lực ${d.power}`:'Vùng an toàn · dịch vụ và hồi phục',x+15,651,12,'#dcdac2');
 v33Fit(d.desc,x+285,603,650,13,'#d8e3d9','left','bold');v33Fit('Linh vật: '+d.resource,x+285,625,650,12,'#b9d7c8');v33Fit(d.boss?'Boss: '+d.boss+' · Lv '+d.max+' · '+((v22State().bosses[d.id]?.ready||0)>p.worldTime?'Đang hồi sinh':'Sẵn sàng'):'Không có yêu thú / boss',x+285,647,650,12,d.color);
 v21Button(1042,608,175,42,'Dẫn đường tới vùng',()=>{modal=null;v8SetGoal({x:r.x,y:r.y});if(d.min>p.level)message('Cẩn thận! '+r.name+' · cấp đề nghị '+d.min);},true);
};
// The field codex uses the same artwork, with stricter discovery masking.
v42cxMapArt=function(x,y,w,h){v43AtlasArt(x,y,w,h,{selected:V42CODEX.region,knownOnly:true,click:id=>{V42CODEX.region=id;V42CODEX.poi=null;},poi:false});};
// Keep regional minimaps and local village geometry unchanged; only the
// overview raster used by the old world overview gets the new illustration.
const v43PriorRaster=v15AtlasRaster;v15AtlasRaster=function(){return V43_ATLAS_IMG.naturalWidth?V43_ATLAS_IMG:v43PriorRaster();};

// V43 · elemental skill choreography. Visual only, all gameplay hit frames and
// radius remain owned by V26/V42. No random mutations in rendering code.
const V43_FX_IMG=imgs.v45FX.img;
const V43_FX_ID={blade:0,fan:0,storm:1,fall:2,guard:3,shock:4,quake:4,crush:4,lightning:5,blizzard:6,triple:7,frost:6};
function v43Texture(f,q,ratio){
 const id=V43_FX_ID[f.style],im=V43_FX_IMG;if(id===undefined||!im.naturalWidth||q>=.98||!Number.isFinite(q))return;
 const r=f.r||85,w=im.naturalWidth/4,h=im.naturalHeight/2,env=(1-q)**1.1*Math.min(1,.30+q*8),kind=f.style;
 let size=r*2.12,ww=size,hh=size*.73,xx=0,yy=-hh*.18,angle=0,opacity=.76;
 if(id===0||id===7){ww=r*1.67;hh=r*.93;xx=28+q*66;yy=0;angle=0;opacity=.72;}
 if(id===1){ww=r*2.30;hh=r*2.3*ratio;yy=-10;angle=q*.75;}
 if(id===2){ww=r*1.3;hh=r*2.0;yy=-hh*.43-(1-Math.min(1,q*4))*49;opacity=.83;}
 if(id===3){ww=r*1.82;hh=r*1.82;yy=-25;opacity=.60;}
 if(id===4){ww=r*2.03;hh=r*1.35;yy=-hh*.23;opacity=.68;if(kind==='shock'){ww=r*1.4;hh=r*.75;xx=48+q*29;yy=0;}}
 if(id===5){ww=r*1.56;hh=r*2.20;yy=-hh*.43;opacity=.91;}
 if(id===6){ww=r*2.12;hh=r*1.65;yy=-hh*.24;opacity=.72;if(kind==='frost'){ww=r*.75;hh=r*.75;xx=28+q*70;yy=0;opacity=.73;}}
 const grow=.62+.38*Math.min(1,q*4);ww*=grow;hh*=grow;
 const sx=(id%4)*w,sy=Math.floor(id/4)*h,margin=2;
 g.save();g.globalCompositeOperation='screen';g.globalAlpha*=env*opacity*(v42cQuality()===0?.72:1);g.translate(xx,yy);g.rotate(angle);if(id===7)g.scale(-1,1);g.drawImage(im,sx+margin,sy+margin,w-margin*2,h-margin*2,-ww/2,-hh/2,ww,hh);g.restore();
}
function v43Stroke(points,col,width,alpha=1){g.save();g.globalAlpha*=alpha;g.strokeStyle=col;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';v42cPath(points);g.stroke();g.restore();}
function v43Energy(points,col,core,width,alpha=1){v43Stroke(points,col,width*4,alpha*.12);v43Stroke(points,col,width*1.8,alpha*.44);v43Stroke(points,core,width,alpha*.96);}
function v43Flash(x,y,col,core,size,alpha){if(alpha<=.01)return;g.save();g.translate(x,y);g.globalAlpha*=alpha;v41cGlow(0,0,size*2,.8,col,.62);g.fillStyle=core;g.beginPath();g.moveTo(-size,0);g.quadraticCurveTo(-size*.11,-size*.12,0,-size*.68);g.quadraticCurveTo(size*.14,-size*.10,size,0);g.quadraticCurveTo(size*.12,size*.11,0,size*.68);g.quadraticCurveTo(-size*.11,size*.13,-size,0);g.fill();g.restore();}
function v43Wave(r,ratio,col,core,phase,alpha=1){g.save();g.globalAlpha*=alpha;g.scale(1,ratio);v42cArcGlow(r,phase,phase+TAU-.12,col,core,2.5,.8);v41cRing(r*.89,1,col,1);g.restore();}
function v43Blade(x,y,len,angle,col,core,alpha){g.save();g.translate(x,y);g.rotate(angle);g.globalAlpha*=alpha;
 const tail=g.createLinearGradient(-len,0,len*.35,0);tail.addColorStop(0,col+'00');tail.addColorStop(.48,col+'55');tail.addColorStop(.85,col+'dd');tail.addColorStop(1,core);g.fillStyle=tail;g.beginPath();g.moveTo(-len,-2);g.quadraticCurveTo(-len*.3,-14,len*.37,0);g.quadraticCurveTo(-len*.26,14,-len,2);g.fill();
 g.fillStyle=core;g.beginPath();g.moveTo(len*.44,0);g.lineTo(len*.09,-4);g.lineTo(-len*.35,-2);g.lineTo(-len*.43,0);g.lineTo(-len*.35,2);g.lineTo(len*.09,4);g.closePath();g.fill();v43Flash(len*.17,0,col,core,8,.62);g.restore();}
function v43Bolt(x,y,hh,col,core,idx,q,alpha){const pts=[];for(let i=0;i<=9;i++){const f=i/9,j=i===0||i===9?0:(v41cHash(i,idx+Math.floor(q*10))-.5)*32;pts.push({x:x+j*Math.sin(f*Math.PI),y:y-hh*(1-f)});}v43Energy(pts,col,core,2.8,alpha);if(v42cQuality()>0)for(const i of [3,6]){const p=pts[i],sign=i===3?-1:1;v43Energy([p,{x:p.x+sign*17,y:p.y+20},{x:p.x+sign*35,y:p.y+31}],col,core,1.1,alpha*.56);} }
function v43Shard(x,y,h,angle,col,core,alpha){g.save();g.translate(x,y);g.rotate(angle);g.globalAlpha*=alpha;const w=h*.22;g.fillStyle=col;g.beginPath();g.moveTo(0,-h);g.lineTo(w,-h*.32);g.lineTo(w*.48,0);g.lineTo(-w*.52,0);g.lineTo(-w,-h*.31);g.closePath();g.fill();g.fillStyle=core;g.beginPath();g.moveTo(0,-h);g.lineTo(w,-h*.32);g.lineTo(0,-h*.09);g.lineTo(-w*.26,-h*.33);g.closePath();g.fill();g.restore();}
function v43KineticSkill(f,q,ratio){
 const k=f.style,r=f.r||85,pal=V42C_COL[k]||[v42cHex(f.color),'#fff6d9'],[col,core]=pal,fade=Math.pow(1-q,.7),hit=Math.max(0,1-q*3.8),phase=q*TAU,qual=v42cQuality();
 g.save();
 if(k==='blade'||k==='fan'){
   const arcs=k==='fan'?[-.32,0,.32]:[0],speed=28+q*100;
   for(const a of arcs){const x=Math.cos(a)*speed,y=Math.sin(a)*speed;v43Blade(x,y,64+(k==='blade'?24:0),a,col,core,fade);if(qual>0)v43Stroke([{x:x-50*Math.cos(a),y:y-50*Math.sin(a)},{x:x-12*Math.cos(a),y:y-12*Math.sin(a)}],core,1.4,fade*.7);}
   v43Flash(23,0,col,core,19,hit);
 }else if(k==='storm'){
   const rr=r*(.71+.29*Math.min(1,q*3));g.save();g.scale(1,ratio);for(let i=0;i<3;i++){const a=phase*1.65+i*TAU/3;v42cSlash(rr*(.78+i*.08),a,a+1.75,13,[i===1?'#b6f1da':'#eed08d',core],fade*.92);}g.restore();
   for(let i=0;i<(qual===0?4:8);i++){const a=i*TAU/(qual===0?4:8)+phase*1.65;v43Blade(Math.cos(a)*rr*.81,Math.sin(a)*rr*.81*ratio-15,41,a+Math.PI*.5,col,core,fade*.8);}
   v43Wave(r*(.45+.55*q),ratio,col,core,phase,fade*.66);v43Flash(0,-20,col,core,38,hit*.6);
 }else if(k==='fall'){
   const drop=Math.min(1,q*3.6),power=1-Math.min(1,Math.abs(q-.29)*4.0);
   for(let i=-1;i<=1;i++){const x=i*r*.30,y=-154*(1-drop)-23;if(drop<.99){v43Blade(x,y,96,Math.PI/2,col,core,fade);v43Energy([{x,y:y-110},{x,y:y+12}],col,core,2.4,fade*.75);}else{v43Energy([{x,y:-150*(1-q)},{x,y:0}],col,core,3.5,power*.78);v43Flash(x,0,col,core,22,power);}}
   if(q>.2)v43Wave(r*Math.min(1,.25+(q-.2)*1.5),ratio,col,core,phase,fade*.82);
 }else if(k==='shock'){
   g.save();g.scale(1,.8);for(let i=0;i<3;i++){const rr=r*(.36+.60*q)+i*13;v42cSlash(rr,-.76,.76,14-i*3,[col,core],fade*(1-i*.18));}g.restore();v43Flash(r*.45,0,col,core,22,hit);
 }else if(k==='quake'||k==='crush'){
   const rr=r*(.26+.73*q);v43Wave(rr,ratio,col,core,phase,fade);if(q>.12)v43Wave(rr*.62,ratio,col,core,-phase,fade*.65);
   for(let i=0;i<(qual===0?5:10);i++){const a=i*2.399,rad=rr*(.52+.42*v41cHash(i,15)),x=Math.cos(a)*rad,y=Math.sin(a)*rad*ratio;v43Shard(x,y,(20+v41cHash(i,7)*21)*Math.sin(Math.PI*Math.min(.95,q+.10)),a*.12,'#af774a','#ffe4b6',fade);}
   if(k==='crush'){for(let i=-1;i<=1;i++){const x=i*r*.25;v43Energy([{x,y:-115*(1-q)},{x,y:0}],col,core,5,hit*.9);}}v43Flash(0,-4,col,core,34,hit);
 }else if(k==='guard'){
   g.save();g.translate(0,-25);const rr=r*.58;g.globalAlpha*=fade;for(let i=0;i<6;i++){const a=i*TAU/6+phase*.3,pts=[{x:Math.cos(a)*rr,y:Math.sin(a)*rr},{x:Math.cos(a+TAU/6)*rr,y:Math.sin(a+TAU/6)*rr}];v43Energy(pts,col,core,1.6,.78);}g.restore();v43Wave(r*.80,ratio,col,core,phase,fade*.72);
 }else if(k==='triple'||k==='frost'){
   const n=k==='triple'?3:1;for(let i=0;i<n;i++){const x=25+q*95,y=(i-(n-1)/2)*(23+q*15);v43Blade(x,y,k==='frost'?66:36,0,col,core,fade);v43Shard(x,y,22,Math.PI/2,col,core,fade*.84);v43Flash(x,y,col,core,k==='frost'?15:9,fade*.65);}
 }else if(k==='lightning'){
   const strike=Math.max(0,1-Math.abs(q-.12)*3.5);for(let i=-1;i<=1;i++)v43Bolt(i*r*.27,0,170+18*Math.abs(i),col,core,15+i,q,strike);v43Wave(r*(.4+.59*q),ratio,col,core,phase,fade*.77);v43Flash(0,-4,col,core,35,strike);
 }else if(k==='blizzard'){
   const n=qual===0?6:12;for(let i=0;i<n;i++){const a=i*2.399+phase*.25,rr=r*(.22+.69*Math.sqrt((i+1)/n)),x=Math.cos(a)*rr,y=Math.sin(a)*rr*ratio,progress=Math.max(0,Math.min(1,q*4-i*.035));v43Shard(x,y,(27+v41cHash(i,7)*27)*progress,-.18+v41cHash(i,13)*.36,col,core,fade);}
   g.save();g.scale(1,ratio);for(let i=0;i<3;i++)v42cArcGlow(r*(.7+i*.1),phase+i*2,phase+i*2+1.5,col,core,2.5,fade);g.restore();
 }
 g.restore();
}
// Retain the established cast, particles and charge visuals. Additional geometry
// is bounded by quality level and matches the existing effects' active duration.
const v43PriorSkill=v42cSkill;v42cSkill=function(f,q,ratio){v43Texture(f,q,ratio);v43PriorSkill(f,q,ratio);v43KineticSkill(f,q,ratio);};
const v43PriorStrike=v42cStrike;v42cStrike=function(f,q,r,a,ratio){v43PriorStrike(f,q,r,a,ratio);if((f.cls??p.cls)!==0)return;const pal=v41cPalette(0);g.save();g.rotate(a);g.scale(1,.77);const rr=r*(.70+.38*q);v42cSlash(rr,-1.25+q*.86,.80+q*.86,9,pal,(1-q)*.88);g.restore();};


