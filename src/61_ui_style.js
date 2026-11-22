'use strict';
// Phong cách giao diện "Giấy dó · mực tàu" cho mọi bảng (modal) — chủ dự án chọn hướng A+B ngày 22/11/2026:
// bảng = giấy dó mực tàu (A), HUD + menu ngoài trận = mực đêm (B, giữ nền tối).
// Cách làm: trong lúc vẽ bảng, đổi màu theo quy tắc mực–giấy ngay tại ngữ cảnh `g`:
//  • màu tối, ít sắc (nền khung cũ) → tông giấy (càng tối càng sáng ra);
//  • màu sáng (chữ cũ) → mực (giữ sắc độ: vàng → đồng sẫm, ngọc → lục sẫm, đỏ → son);
//  • màu trung tính vừa → giữ, đậm thêm một chút.
// Ảnh (icon, chân dung) không bị đổi. Nền mờ toàn màn hình giữ nguyên màu gốc.
const UI_PAPER={on:false,cache:new Map(),rawFill:null,
 paper:[232,220,194],ink:[42,32,24],seal:'#a5322a',edgeInk:'#3a2c20'};

function uiParseColor(s){
 if(typeof s!=='string')return null;s=s.trim();
 let m=/^#([0-9a-f]{3,8})$/i.exec(s);
 if(m){let h=m[1];if(h.length===3||h.length===4)h=[...h].map(c=>c+c).join('');const n=parseInt(h.slice(0,6),16);return [n>>16&255,n>>8&255,n&255,h.length===8?parseInt(h.slice(6),16)/255:1];}
 m=/^rgba?\(([^)]+)\)$/i.exec(s);
 if(m){const a=m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);return [a[0],a[1],a[2],a.length>3?a[3]:1];}
 return null;
}
function uiHsl(r,g2,b){r/=255;g2/=255;b/=255;const mx=Math.max(r,g2,b),mn=Math.min(r,g2,b),l=(mx+mn)/2;let h=0,s=0;
 if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?((g2-b)/d+(g2<b?6:0)):mx===g2?(b-r)/d+2:(r-g2)/d+4;h/=6;}return [h,s,l];}
function uiRgb(h,s,l){if(!s){const v=Math.round(l*255);return [v,v,v];}const q=l<.5?l*(1+s):l+s-l*s,p2=2*l-q,f=t=>{t=(t%1+1)%1;return t<1/6?p2+(q-p2)*6*t:t<.5?q:t<2/3?p2+(q-p2)*(2/3-t)*6:p2;};return [f(h+1/3),f(h),f(h-1/3)].map(v=>Math.round(v*255));}
function uiMix(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t));}
// Đổi một màu sang hệ giấy–mực.
function uiInk(col,stroke=false){
 if(!UI_PAPER.on||typeof col!=='string')return col;
 const key=stroke?'s|'+col:col,hit=UI_PAPER.cache.get(key);if(hit!==undefined)return hit;
 const c=uiParseColor(col);let out=col;
 if(c){
  const [r,g2,b,a]=c,[h,s,l]=uiHsl(r,g2,b);let rgb;
  if(l<.36&&s<.55&&stroke){ // viền tối → nét mực nâu nhạt (để khung/ô trống còn thấy)
   rgb=[150,124,92];
  }else if(l<.36&&s<.55){ // nền tối → giấy: tối nhất = giấy sáng nhất
   rgb=uiMix(UI_PAPER.paper,[214,198,166],Math.min(1,l/.36));
  }else if(l>.62){ // chữ sáng → mực
   rgb=s>.28?uiRgb(h,Math.min(.75,s*1.1),.30):uiMix(UI_PAPER.ink,[92,74,54],Math.min(1,(1-l)/.38));
  }else{ // trung tính / nhấn
   rgb=uiRgb(h,s,Math.max(.22,l*.78));
  }
  out=a<1?`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`:`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  UI_PAPER.norm??=document.createElement('canvas').getContext('2d');UI_PAPER.norm.fillStyle=out;out=UI_PAPER.norm.fillStyle; // dạng chuẩn hoá của canvas
 }
 UI_PAPER.cache.set(key,out);UI_PAPER.cache.set(stroke?'s|'+out:out,out); // màu đã đổi đọc lại rồi gán lại không bị đổi lần hai
 return out;
}
// Bật/tắt chế độ giấy trên ngữ cảnh chính g (chỉ trong lúc vẽ bảng).
(function(){
 const P=CanvasRenderingContext2D.prototype,fillD=Object.getOwnPropertyDescriptor(P,'fillStyle'),strokeD=Object.getOwnPropertyDescriptor(P,'strokeStyle'),shadowD=Object.getOwnPropertyDescriptor(P,'shadowColor');
 const origFillRect=P.fillRect,origLinear=P.createLinearGradient,origRadial=P.createRadialGradient;
 function wrapGrad(gr){const add=gr.addColorStop;gr.addColorStop=function(o,c){return add.call(this,o,uiInk(c));};return gr;}
 window.uiPaperBegin=function(){
  if(UI_PAPER.on||!g)return;UI_PAPER.on=true;
  Object.defineProperty(g,'fillStyle',{configurable:true,get(){return fillD.get.call(this);},set(v){UI_PAPER.rawFill=v;fillD.set.call(this,uiInk(v));}});
  Object.defineProperty(g,'strokeStyle',{configurable:true,get(){return strokeD.get.call(this);},set(v){strokeD.set.call(this,uiInk(v,true));}});
  g.fillRect=function(x,y,w,h){ // nền mờ toàn màn hình: giữ màu gốc (làm tối thế giới phía sau)
   if(w>=W*.95&&h>=H*.95&&typeof UI_PAPER.rawFill==='string'){const k=fillD.get.call(this);fillD.set.call(this,UI_PAPER.rawFill);origFillRect.call(this,x,y,w,h);fillD.set.call(this,k);return;}
   return origFillRect.call(this,x,y,w,h);};
  Object.defineProperty(g,'shadowColor',{configurable:true,get(){return shadowD.get.call(this);},set(){shadowD.set.call(this,'rgba(0,0,0,0)');}}); // giấy: không đổ bóng chữ/khung
  g.createLinearGradient=function(...a){return wrapGrad(origLinear.apply(this,a));};
  g.createRadialGradient=function(...a){return wrapGrad(origRadial.apply(this,a));};
  // màu đang đặt sẵn cũng đổi theo
  fillD.set.call(g,uiInk(fillD.get.call(g)));strokeD.set.call(g,uiInk(strokeD.get.call(g),true));shadowD.set.call(g,'rgba(0,0,0,0)');
 };
 window.uiPaperEnd=function(){
  if(!UI_PAPER.on)return;UI_PAPER.on=false;
  delete g.fillStyle;delete g.strokeStyle;delete g.shadowColor;delete g.fillRect;delete g.createLinearGradient;delete g.createRadialGradient;
 };
})();

// Vân giấy (nhân lên toàn bảng): hạt, sợi ngang, vết ố — vẽ một lần rồi cache.
function uiPaperTexture(){
 if(UI_PAPER.tex)return UI_PAPER.tex;
 const c=document.createElement('canvas');c.width=W;c.height=H;const d=c.getContext('2d');
 d.fillStyle='#fff';d.fillRect(0,0,W,H);
 let seed=20261122;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<5;i++){const x=rnd()*W,y=rnd()*H,r=120+rnd()*260,gr=d.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(196,170,120,.20)');gr.addColorStop(1,'rgba(196,170,120,0)');d.fillStyle=gr;d.fillRect(0,0,W,H);}
 for(let i=0;i<900;i++){d.fillStyle=`rgba(120,96,64,${(.05+rnd()*.10).toFixed(3)})`;d.fillRect(rnd()*W,rnd()*H,1+rnd()*1.5,1+rnd()*1.5);}
 d.lineWidth=.6;for(let i=0;i<240;i++){const y=rnd()*H,x=rnd()*W,l=30+rnd()*140;d.strokeStyle=`rgba(140,112,76,${(.04+rnd()*.07).toFixed(3)})`;d.beginPath();d.moveTo(x,y);d.quadraticCurveTo(x+l/2,y+(rnd()-.5)*4,x+l,y+(rnd()-.5)*3);d.stroke();}
 const v=d.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);v.addColorStop(0,'rgba(150,120,80,0)');v.addColorStop(1,'rgba(150,120,80,.22)');d.fillStyle=v;d.fillRect(0,0,W,H);
 return UI_PAPER.tex=c;
}
// Chữ Hán trang trí mờ góc dưới phải theo từng bảng.
const UI_PAPER_GLYPH={gear:'囊',inventory:'囊',relic21:'寶',journal8:'卷',skill11:'法',stats10:'身',v31dao:'道',life13:'丹',v30forge:'煉',v30trial:'雷',v42world:'記',jiang14:'湖',npc8:'言',v42codex:'錄',v29sets:'器',map:'圖',settings:'機',v42save:'藏',v42practice:'劍'};
function uiPaperDecor(kind){
 g.save();g.setTransform(RS.k,0,0,RS.k,0,0);
 g.globalCompositeOperation='multiply';g.drawImage(uiPaperTexture(),0,0);
 const ch=UI_PAPER_GLYPH[kind];
 if(ch){g.globalAlpha=.05;g.fillStyle='#2a2018';g.font='900 300px V18Serif, serif';g.textAlign='right';g.textBaseline='alphabetic';g.fillText(ch,1236,676);}
 g.restore();
}

// Vẽ một đoạn KHÔNG theo kiểu giấy (vd ảnh bản đồ + nhãn/điểm đặt trên ảnh) rồi bật lại.
function uiNoPaper(fn){if(!UI_PAPER.on)return fn();uiPaperEnd();try{return fn();}finally{uiPaperBegin();}}
