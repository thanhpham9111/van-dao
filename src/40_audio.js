'use strict';
// v42_audio.js
// V42 original regional soundscape. Procedural pentatonic phrases, room
// ambience and event cues; no audio assets, network, or third-party melodies.
const V42_AUDIO={scope:'',step:0,nextWind:0,motif:'',motifAt:-99,ambientVoices:0};
const V42_AUDIO_THEMES={
 menu:[146.83,[0,4,7,9,12],3.2,.033,'calm'],thon:[174.61,[0,2,5,7,9],3.4,.030,'town'],
 truc:[196,[0,2,5,7,10],3.5,.029,'forest'],yeu:[130.81,[0,3,5,7,10],3.1,.028,'stone'],
 tram:[146.83,[0,3,5,7,10],4.4,.027,'water'],tuyet:[220,[0,2,5,7,9],4.5,.024,'snow'],
 hoa:[123.47,[0,3,5,7,10],3.1,.031,'ember'],phong:[196,[0,2,4,7,9],3.4,.028,'wind'],
 quy:[110,[0,2,3,7,10],4.3,.024,'haunt'],ma:[98,[0,3,5,6,10],3.9,.026,'haunt'],
 loi:[146.83,[0,3,5,7,10],3.0,.030,'storm'],interior:[196,[0,2,4,7,9],3.9,.026,'room'],
 arena:[110,[0,3,5,7,10],2.7,.032,'arena'],danger:[110,[0,3,5,7,10],1.65,.033,'combat']
};
const V42_AUDIO_PHRASES=[[0,2,1,4,3,2,0,1],[0,1,3,2,4,3,1,0],[2,4,1,3,0,2,3,1],[0,3,1,2,4,2,1,0]];
function v42SoundScope(){
 if(mode==='menu')return 'menu';if(!p)return 'menu';if(v36Inside())return 'interior';
 if(!modal&&enemies.some(e=>!e.dead&&!e.v42Practice&&dist(e,p)<220&&['attack','wind','chase','recover'].includes(e.state)))return 'danger';
 return p.worldMode?(V42_AUDIO_THEMES[p.mapId]?p.mapId:'thon'):'arena';
}
function v42SoundAmbience(dur,volume,bands){
 const a=V41AudioState,c=a.ctx;if(!a.enabled||!c||c.state!=='running'||a.voices>=16||V42_AUDIO.ambientVoices>=2||!a.noise)return;
 try{
  const t=c.currentTime,n=c.createBufferSource(),f=c.createBiquadFilter(),v=c.createGain();n.buffer=a.noise;n.loop=true;f.type='bandpass';f.Q.value=.42;f.frequency.setValueAtTime(bands[0],t);f.frequency.linearRampToValueAtTime(bands[1],t+dur*.62);
  v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(volume,t+dur*.33);v.gain.exponentialRampToValueAtTime(.0001,t+dur);
  n.connect(f);f.connect(v);v.connect(a.music);a.voices++;V42_AUDIO.ambientVoices++;n.onended=()=>{V42_AUDIO.ambientVoices=Math.max(0,V42_AUDIO.ambientVoices-1);a.voices=Math.max(0,a.voices-1);n.disconnect();f.disconnect();v.disconnect();};n.start(t,0);n.stop(t+dur+.025);
 }catch(_){}
}
function v42SoundMotif(kind){
 const a=V41AudioState,c=a.ctx;if(!a.enabled||!c||c.state!=='running'||a.voices>=15)return;
 const t=c.currentTime;if(V42_AUDIO.motif===kind&&t-V42_AUDIO.motifAt<.85)return;V42_AUDIO.motif=kind;V42_AUDIO.motifAt=t;
 const motifs={discover:[293.66,440,587.33],complete:[261.63,392,523.25,659.25],way:[392,493.88,587.33],travel:[293.66,440,659.25],breakthrough:[196,293.66,392,587.33]};
 const notes=motifs[kind];if(!notes)return;notes.forEach((f,i)=>v41Tone(f,.65+.14*i,.052/(1+i*.1),'sine',f,i*.115,false));
}
v41AudioAmbience=function(){
 const a=V41AudioState,c=a.ctx;if(!a.enabled||!c||c.state!=='running')return;const now=c.currentTime,scope=v42SoundScope(),theme=V42_AUDIO_THEMES[scope]||V42_AUDIO_THEMES.thon;
 if(V42_AUDIO.scope!==scope){V42_AUDIO.scope=scope;V42_AUDIO.step=0;a.next=now+.28;V42_AUDIO.nextWind=now+.8;}
 const [root,notes,pace,vol,style]=theme;
 if(now>=a.next){
  const i=V42_AUDIO.step++,pattern=V42_AUDIO_PHRASES[(Math.floor(i/8)+Object.keys(V42_AUDIO_THEMES).indexOf(scope))%4],degree=pattern[i%8];const f=root*Math.pow(2,notes[degree]/12),night=!!p&&p.worldMode&&((p.worldTime||0)%360<55||(p.worldTime||0)%360>285),v=vol*(night?.83:1);
  const danger=scope==='danger';v41Tone(f,danger?1.18:2.7,v,'sine',f,0,true);v41Tone(f*2,danger?.55:1.65,v*.38,'triangle',f*2,.011,true);
  if(i%4===0&&!danger)v41Tone(root*.5,4.1,v*.30,'sine',root*.5,.02,true);
  if(i%4===2&&!danger){const n=root*Math.pow(2,notes[(degree+2)%5]/12)*2;v41Tone(n,2.35,v*.29,'sine',n,.48,true);}
  a.next=now+pace+(i%3)*.15;
 }
 if(now>=V42_AUDIO.nextWind){
  const env={town:[.013,[350,620],2.5,12],forest:[.027,[740,1280],3.6,8],stone:[.015,[190,430],3.0,12],water:[.022,[330,520],3.9,8],snow:[.029,[620,940],4.2,7],ember:[.018,[150,330],2.4,9],wind:[.030,[740,1340],4.4,7],haunt:[.018,[130,360],4.8,10],storm:[.018,[230,720],3.5,8],room:[.008,[320,540],2.5,16],arena:[.017,[140,400],3.0,9],combat:[.022,[120,220],.6,4],calm:[.018,[350,620],3.2,9]}[style];
  v42SoundAmbience(env[2],env[0],env[1]);V42_AUDIO.nextWind=now+env[3];
 }
};
const v42SoundOldDiscover=owDiscover;owDiscover=function(){const old=p?.discovered?.length||0,r=v42SoundOldDiscover();if((p?.discovered?.length||0)>old)v42SoundMotif('discover');return r;};
const v42SoundOldComplete=v42wComplete;v42wComplete=function(e,index){const r=v42SoundOldComplete(e,index);if(r)v42SoundMotif('complete');return r;};
const v42SoundOldActivate=v42wActivate;v42wActivate=function(id){const r=v42SoundOldActivate(id);if(r)v42SoundMotif('way');return r;};
const v42SoundOldTravel=v42wTravel;v42wTravel=function(id){const r=v42SoundOldTravel(id);if(r)v42SoundMotif('travel');return r;};
const v42SoundOldBreak=v22Break;v22Break=function(){const old=p?.level||0,r=v42SoundOldBreak();if((p?.level||0)>old)v42SoundMotif('breakthrough');return r;};


// v42_title_art.webp
const V42_TITLE_ASSET=ASSETS["V42_TITLE_ASSET"];

// v42_presentation.js
// V42 art direction – original scenic key art, compact menu and clearer first-run UX.
// V42_TITLE_ASSET is embedded by build_v42.cjs; fallback remains available.
if(typeof V42_TITLE_ASSET!=='undefined'){const im=new Image();imgs.v42Title={img:im,ready:false};im.onload=()=>imgs.v42Title.ready=true;im.src=V42_TITLE_ASSET;}
const V42_PRESENT={last:'',help:0};
function v42pBackdrop(){
 const a=imgs.v42Title;if(!a?.ready)return v8MenuBackdrop();
 const i=a.img,t=V41Presentation.clock,scale=Math.max(W/i.naturalWidth,H/i.naturalHeight)*(1.006+Math.sin(t*.045)*.004),w=i.naturalWidth*scale,h=i.naturalHeight*scale;
 g.save();g.imageSmoothingEnabled=true;g.drawImage(i,(W-w)/2+Math.sin(t*.06)*3,(H-h)/2,w,h);
 const shade=g.createLinearGradient(0,0,W,0);shade.addColorStop(0,'#071c25b8');shade.addColorStop(.43,'#0a253068');shade.addColorStop(.7,'#09151c00');g.fillStyle=shade;g.fillRect(0,0,W,H);
 const bottom=g.createLinearGradient(0,H*.65,0,H);bottom.addColorStop(0,'#081b2100');bottom.addColorStop(1,'#07171fc9');g.fillStyle=bottom;g.fillRect(0,0,W,H);
 // A delicate atmospheric drift across the distant cliffs, not a video loop.
 for(let k=0;k<3;k++){const x=730+(t*7+k*171)%550,y=202+k*96,rad=112+k*23,gr=g.createRadialGradient(x,y,0,x,y,rad);gr.addColorStop(0,'#f0e1a80a');gr.addColorStop(1,'#f0e1a800');g.fillStyle=gr;g.fillRect(x-rad,y-rad,rad*2,rad*2);}
 g.strokeStyle='#bfa57088';g.lineWidth=1;g.strokeRect(16.5,16.5,W-33,H-33);g.strokeStyle='#d6c89736';g.strokeRect(21.5,21.5,W-43,H-43);g.restore();
}
function v42pTitle(){v42pBackdrop();const copper='#d8b875',pearl='#fff0c8';v41PText('VẠN ĐẠO STUDIO  /  PHONG VÂN KHỞI HÀNH',77,49,10,'#c5c7a9','left','sans','bold');v41PLine(77,67,367,.55);v41PText('VẠN ĐẠO',74,122,58,pearl,'left','serif','bold');v41PText('TU TIÊN',76,191,58,pearl,'left','serif','bold');
 g.save();g.strokeStyle='#d1b378aa';g.lineWidth=1;g.beginPath();g.moveTo(77,238);g.lineTo(393,238);g.stroke();diamond(g,410,238,5,copper);g.beginPath();g.moveTo(425,238);g.lineTo(510,238);g.stroke();g.restore();
 v41PText('MẶC NGỌC',80,263,21,copper,'left','serif','bold');v41PText('Một hành trình · Vạn vực chờ khám phá',81,287,13,'#c2d7cf','left','sans');v41PFrame(1083,35,158,34);v41PText('GIAO DIỆN MẶC NGỌC / V44',1162,52,11,'#e2c786','center','sans','bold');}
function v42pHome(){const saved=v41PSaved();v41PButton(78,312,392,65,'Tiếp tục hành trình',saved?'Khôi phục đạo thể và tiến trình đã lưu':'Bắt đầu hành trình đầu tiên',()=>{if(saved)resume();else V8.menuPage='create';},true);v41PButton(78,391,392,62,'Khởi tạo nhân vật','Lựa chọn đạo thống và bước vào nhân gian',()=>V8.menuPage='create');
 v41PButton(78,469,392,56,'Hướng dẫn điều khiển','',()=>V8.menuPage='help');
 v41PButton(78,536,191,41,v41AudioEnabled()?'Âm thanh: BẬT':'Âm thanh: TẮT','',()=>v41AudioToggle());v41PButton(278,536,192,41,'Đồ họa: '+V41_QUALITY_NAMES[v41Quality()],'',()=>v41QualityToggle());v41PButton(78,585,392,43,'Bảo toàn hồ sơ · V','',()=>v42sOpen());
 v41PText('KHÔNG CẦN KẾT NỐI MẠNG  ·  LƯU TIẾN TRÌNH CỤC BỘ',79,682,10,'#cdd5be','left','sans','bold');
 g.save();const grad=g.createLinearGradient(760,0,1230,0);grad.addColorStop(0,'#071e2600');grad.addColorStop(.25,'#071e2688');grad.addColorStop(1,'#071e26c0');g.fillStyle=grad;g.fillRect(760,606,481,66);g.restore();v41PText('BƯỚC QUA SƠN MÔN',1225,628,15,'#f4deab','right','serif','bold');v41PText('Cảnh giới · Công pháp · Kỳ ngộ · Đạo lữ',1225,652,12,'#d7e2d5','right','sans');}
function v42pCreate(){const saved=v41PSaved(),labels=['Kiếm đạo','Thể đạo','Pháp đạo'],colors=['#b1dce9','#d7c4a0','#d1bdf0'];for(let i=0;i<3;i++){const c=CLASSES[i],x=78+i*181,y=304,selected=V8.select===i;v41PFrame(x,y,169,205,selected);const _sp=imgs['v46splash'+i];if(_sp?.ready){g.drawImage(_sp.img,0,0,560,682,x+5,y+5,159,195);g.fillStyle='rgba(8,16,14,0.62)';g.fillRect(x+5,y+122,159,78);}else{const q=Math.sin(V41Presentation.clock*1.8+i)*1.5;const grad=g.createRadialGradient(x+84,y+98,4,x+84,y+98,70);grad.addColorStop(0,colors[i]+'29');grad.addColorStop(1,colors[i]+'00');g.fillStyle=grad;g.fillRect(x+5,y+18,159,130);sprite('action',i===1?6:i===2?10:0,4,3,x+84,y+114+q,126,1,.95);}v41PText(c.name,x+84,y+139,18,selected?'#f6dd9d':'#e1e7da','center','serif','bold');v41PText(labels[i].toUpperCase(),x+84,y+159,9,colors[i],'center','sans','bold');wrapText(c.description,x+84,y+181,148,10,'#b9d0c5','center',12);buttons.push({x,y,w:169,h:205,fn:()=>{v41Sound('click');V8.select=i;V41Presentation.confirm=false;}});}
 const c=CLASSES[V8.select],x=647,y=304;v41PFrame(x,y,381,204,true);v41PText('ĐẠO THỐNG · '+c.name.toUpperCase(),x+18,y+24,13,colors[V8.select],'left','sans','bold');const attrs=[['Sinh lực',c.stats.hp,180],['Linh lực',c.stats.mp,120],['Công kích',c.stats.attack,35],['Thân pháp',c.stats.speed,270]];attrs.forEach(([label,n,max],i)=>{const yy=y+55+i*36;v41PText(label,x+18,yy,12,'#dbe5d7','left','sans');v41PText(n,x+362,yy,12,'#f1dba4','right','sans','bold');v42wBar(x+115,yy-4,212,8,n,max,colors[V8.select]);});
 v41PButton(78,525,350,52,V41Presentation.confirm?'Xác nhận tạo mới':'Nhập thế · '+c.name,'',()=>{if(saved&&!V41Presentation.confirm){V41Presentation.confirm=true;return;}V41Presentation.saved=null;start(V8.select);},true);v41PButton(440,525,170,52,'Quay lại','',()=>V8.menuPage='home');v41PText('Đạo hiệu:',78,614,15,'#e2c28e','left','sans','bold');v41PFrame(162,596,300,36);if(saved)v41PText(V41Presentation.confirm?'Xác nhận lần nữa. Bản lưu cũ được giữ làm bản khôi phục.':'Lưu ý: khởi tạo thay thế hồ sơ đang chơi; có bản khôi phục.',78,650,12,'#f0c49c','left','sans');}
const V42_HELP=[[
 ['WASD / ↑ ↓ ← →','Di chuyển'],['Chuột trái','Đi đến điểm chọn · tấn công · tương tác'],['Chuột phải / 1–3','Thi triển công pháp đã học'],['Space / Shift','Khinh công · né đòn'],['E / Z / H','Tương tác · nhặt vật phẩm · dùng Hồi Xuân Đan'],['F / X','Bật tự động chiến đấu · tự động nhặt đồ']
],[['M / O / F3','Bản đồ · Sơn Hà Ký · yêu quái chí'],['Q / T / I','Nhật ký · công pháp · hành trang'],['N / P / J','Tông môn · luyện khí · sinh hoạt'],['C / B / F6','Hồ sơ · thiên kiếp · sân luyện kiếm'],['V / ESC / F9','Bảo toàn hồ sơ · đóng bảng · chụp ảnh'],['F2 / F4 / F8','Tùy chỉnh HUD · chất lượng · thích ứng']]];
function v42pHelp(){v41PFrame(78,304,618,270,true);const page=V42_PRESENT.help;V42_HELP[page].forEach((a,i)=>{const y=328+i*39;v41PText(a[0],98,y,11,'#dfc58d','left','sans','bold');v41PText(a[1],267,y,13,'#deeadc','left','sans');if(i!==5)v41PLine(98,y+17,578,.19);});v41PButton(78,588,235,47,'Quay về','',()=>V8.menuPage='home');v41PButton(325,588,371,47,page?'Chiến đấu & khám phá':'Quản lý & hệ thống','',()=>V42_PRESENT.help=1-page);v41PText('Trang '+(page+1)+' / 2',686,649,11,'#d9d1ab','right','sans');}
// menu: định nghĩa duy nhất (gộp 6 lớp ở T03). Trang sao lưu → v42sPanel; home/create/help → giao diện V42; trang khác → menuV41.
function menu(){const page=V8.menuPage;if(page==='backup')return v42sPanel();if(!['home','create','help'].includes(page))return menuV41();if(page!==V41Presentation.lastPage){V41Presentation.lastPage=page;V41Presentation.menuSince=V41Presentation.clock;V41Presentation.confirm=false;V41Presentation.saved=null;}v42pTitle();if(page==='home')v42pHome();else if(page==='create')v42pCreate();else v42pHelp();}


// v42_hud_access.js
// V42 · Tinh chỉnh đạo thể & trải nghiệm. Full working character/settings pages,
// no asynchronous model mutations or mock control bindings.
const V42ACCESS={owner:null,statsTab:0,settingsTab:0,analysis:null,analysisAt:-100,music:100,sfx:100,audioNode:null,note:'',preset:null};
try{
 const r=localStorage.getItem('v42-access');if(r){const a=JSON.parse(r);V42ACCESS.music=clamp(Number(a.music)||0,0,100);V42ACCESS.sfx=clamp(Number(a.sfx)||0,0,100);screenShake=a.shake!==false;}
}catch(_){}
function v42AccessPersist(){try{localStorage.setItem('v42-access',JSON.stringify({music:V42ACCESS.music,sfx:V42ACCESS.sfx,shake:screenShake}));}catch(_){} }
function v42AccessAudio(){
 if(typeof V41AudioState==='undefined'||!V41AudioState.ctx||!V41AudioState.music||!V41AudioState.sfx)return;
 const t=V41AudioState.ctx.currentTime;
 V41AudioState.music.gain.setTargetAtTime(.43*V42ACCESS.music/100,t,.04);
 V41AudioState.sfx.gain.setTargetAtTime(.76*V42ACCESS.sfx/100,t,.04);
 V42ACCESS.audioNode=V41AudioState.ctx;
}
function v42AccessVolume(k,v){V42ACCESS[k]=clamp(Math.round(v),0,100);v42AccessAudio();v42AccessPersist();}
// Recenter and size each independent HUD group as a deliberate preset. Preserve
// visibility and opacity settings. Bottom groups are packed with safe gaps.
function v42AccessHUDScale(v){
 const a=v35State(),scale=clamp(Number(v)||1,.85,1.08);
 const place=(k,x,y)=>{const d=V35_GROUPS[k],s=a.groups[k];s.scale=scale;s.dx=x-d.x;s.dy=y-d.y;v35Clamp(k);};
 const w=k=>V35_GROUPS[k].w*scale,h=k=>V35_GROUPS[k].h*scale;
 const right=k=>W-12-w(k),bottom=k=>H-10-h(k);
 place('identity',12,12);place('map',right('map'),12);place('quest',right('quest'),12+h('map')+7);
 place('target',(W-w('target'))/2,12);
 const l=8,r=W-8-w('nav'),dockX=clamp((W-w('dock'))/2,l+w('left')+4,r-w('dock')-4);
 place('left',l,bottom('left'));place('nav',r,bottom('nav'));place('dock',dockX,bottom('dock'));
 place('feed',12,bottom('left')-h('feed')-12);
 a.accessScale=scale;V42ACCESS.preset=scale;save();
}
function v42AccessHUDScaleMatch(v){return Math.abs((v35State().accessScale||1)-v)<.001&&Object.values(v35State().groups).every(g=>Math.abs(g.scale-v)<.001);}
function v42AccessQuality(){return typeof v42PerfQualityStatus==='function'?v42PerfQualityStatus():{requested:v41Quality(),actual:v41Quality(),adaptive:false,avgFrameMs:0};}
function v42AccessToggleLine(x,y,w,name,desc,value,fn,id){
 text(name,x,y,14,V42HUD.paper,'left','bold');v33Fit(desc,x,y+22,w-134,11,V42HUD.muted);
 v42HUDButton(x+w-113,y-11,113,43,value?'BẬT':'TẮT',fn,id,value,true);v41HUDLine(x,y+42,w,'#b7a27244');
}
function v42AccessLevelLine(x,y,w,label,value,action,id){
 text(label,x,y,14,V42HUD.paper,'left','bold');
 text(value+'%',x+w,y,15,V42HUD.jade,'right','bold');
 const row=y+22,bw=(w-59)/6;[0,20,40,60,80,100].forEach((v,i)=>v42HUDButton(x+i*(bw+10),row,bw,31,String(v),()=>action(v),id+v,v===value));
}
function v42AccessSettings(){
 const tab=modal.accessTab??V42ACCESS.settingsTab,q=v42AccessQuality();V42ACCESS.settingsTab=tab;
 v42HUDShell('THIÊN CÔNG · TÙY CHỈNH','Hiển thị · Điều khiển · Bảo toàn hành trình');
 ['Hiển thị & âm thanh','Điều khiển','Lưu tiến trình'].forEach((t,i)=>v42HUDButton(34+i*406,111,396,43,t,()=>{modal.accessTab=i;V42ACCESS.note='';},'accessTab'+i,tab===i));
 if(tab===0){
  const x=34,y=165,w=592,h=477,X=638,Wd=608;
  v42HUDFrame(x,y,w,h);v42HUDFrame(X,y,Wd,h);v42HUDSection('CHẤT LƯỢNG & GIAO DIỆN',x+22,185,w-44);v42HUDSection('ÂM THANH & TIỆN ÍCH',X+22,185,Wd-44);
  text('Mức đồ họa',x+22,223,14,V42HUD.paper,'left','bold');
  ['Tiết kiệm','Cân bằng','Cao'].forEach((n,i)=>v42HUDButton(x+22+i*185,241,174,44,n,()=>v41ApplyQuality(i),'accessQuality'+i,q.requested===i));
  const actual='Đang hiển thị: '+V41_QUALITY_NAMES[q.actual]+(q.adaptive&&q.actual!==q.requested?' · tự điều chỉnh':'');
  text(actual,x+22,305,12,V42HUD.jade,'left','bold');
  v42AccessToggleLine(x+22,344,w-44,'Điều chỉnh đồ họa tự động','Hạ hiệu ứng khi tốc độ khung hình thấp.',q.adaptive,()=>{if(typeof v42PerfSetAdaptive==='function')v42PerfSetAdaptive(!q.adaptive);},'accessAdaptive');
  v42AccessToggleLine(x+22,411,w-44,'Rung màn hình','Tắt để hạn chế rung khi giao chiến.',screenShake,()=>{screenShake=!screenShake;v42AccessPersist();},'accessShake');
  text('Cỡ HUD & vị trí tiêu chuẩn',x+22,471,14,V42HUD.paper,'left','bold');
  [.85,1,1.08].forEach((v,i)=>v42HUDButton(x+22+i*185,490,174,40,['Nhỏ · 85%','Chuẩn · 100%','Lớn · 108%'][i],()=>v42AccessHUDScale(v),'accessScale'+i,v42AccessHUDScaleMatch(v)));
  text('Áp dụng sẽ đặt lại vị trí và kích thước các khung.',x+22,552,12,V42HUD.muted);
  v42HUDButton(x+22,562,w-44,33,'Mở trình chỉnh HUD · F2',()=>v35Open(),'accessEditor',true,true);
  if(B04_HINTS.length){text('Hướng dẫn tân thủ',x+22,615,14,V42HUD.paper,'left','bold');v42HUDButton(x+w-135,600,113,31,b04TutorialState().off?'TẮT':'BẬT',b04TutorialToggle,'accessTutorial',!b04TutorialState().off,true);}
  v42AccessToggleLine(X+22,225,Wd-44,'Âm thanh tổng','Alt + M · Bật/tắt toàn bộ âm thanh.',v41AudioEnabled(),()=>v41AudioToggle(),'accessAudio');
  v42AccessLevelLine(X+22,294,Wd-44,'Nhạc nền',V42ACCESS.music,v=>v42AccessVolume('music',v),'accessMusic');
  v42AccessLevelLine(X+22,379,Wd-44,'Hiệu ứng chiến đấu',V42ACCESS.sfx,v=>v42AccessVolume('sfx',v),'accessSFX');
  v41HUDLine(X+22,455,Wd-44,'#b7a27244');
  v42AccessToggleLine(X+22,482,Wd-44,'Tự động đánh','F · Tu sĩ tự đánh kẻ địch gần.',auto,()=>{auto=!auto;save();},'accessAuto');
  v42AccessToggleLine(X+22,555,Wd-44,'Tự động nhặt đồ','X · Nhặt chiến lợi phẩm trong tầm.',v21State().auto,v21Toggle,'accessPickup');
 }else if(tab===1){
  const groups=[['DI CHUYỂN & CHIẾN ĐẤU',[
   ['W A S D / ↑ ↓ ← →','Di chuyển tự do'],['Chuột trái','Điểm đến / đánh thường'],['Chuột phải / 1 – 3','Thi triển kỹ năng'],['SPACE / SHIFT / K','Khinh công né đòn'],['H','Dùng Hồi Xuân Đan'],['F','Bật / tắt tự động đánh'],['E','Vào nhà / đối thoại'],['Z','Nhặt vật phẩm lân cận'],['U / Y','Tụ Linh Đan / Hộ Thân Phù'],['ALT','Hiện tên chiến lợi phẩm']]],['ĐẠO THỐNG & KHÁM PHÁ',[
   ['C','Hồ sơ & phân bổ thuộc tính'],['T','Công pháp và điểm kỹ năng'],['I / G','Hành trang & trang bị'],['Q','Nhật ký nhiệm vụ'],['M / O','Bản đồ / Sơn Hà Ký'],['F3','Vạn Linh Phổ · yêu thú & địa đồ'],['R','Dung hợp công pháp'],['B','Đột phá cảnh giới'],['F6','Sân luyện kiếm / báo cáo']]],['TIỆN ÍCH & QUẢN LÝ',[
   ['N','Tông môn, linh thú, động phủ'],['L','Giang hồ'],['J / P','Sinh hoạt / Thiên Công Phường'],['X','Tự động nhặt đồ'],['F2 / F4','Chỉnh HUD / đồ họa'],['F8','Đồ họa tự điều chỉnh'],['F7','Hiện FPS / thời gian vẽ'],['F9','Chế độ ngắm cảnh / chụp ảnh'],['ALT + M','Bật / tắt âm thanh'],['V / ESC','Quản lý hồ sơ / cài đặt']]]];
  groups.forEach(([title,arr],i)=>{const x=34+i*406,y=165,w=396;v42HUDFrame(x,y,w,477);v42HUDSection(title,x+18,y+20,w-36);arr.forEach(([key,label],j)=>{const yy=y+44+j*42;v42HUDTag(key,x+15,yy,145,V42HUD.bronze);v12Wrap(label,x+172,yy+10,w-187,12,V42HUD.paper,14,2);v41HUDLine(x+15,yy+37,w-30,'#b7a27233');});});
 }else{
  v42HUDFrame(34,165,592,477);v42HUDFrame(638,165,608,477);v42HUDSection('HỒ SƠ TU SĨ',56,185,548);v42HUDSection('TIẾN TRÌNH AN TOÀN',660,185,564);
  v42HUDTitle(p.v8Name||'Vô Danh',56,238,29);text(V10_SCHOOLS[p.cls].name+' · '+realm(),56,278,16,V42HUD.jade,'left','bold');
  [['Khu vực',p.worldMode?(REG[p.mapId]?.name||'Nhân gian'):'Bí cảnh'],['Ngày tu hành',String(Math.floor((p.worldTime||0)/360)+1)],['Chiến lực',v10Fmt(v10FightPower(currentStats()))],['Hành trang',p.gear.length+'/48 ô'],['Linh thạch',v10Fmt(p.stones)],['Yêu thú đã hạ',v10Fmt(p.kills||0)]].forEach(([k,v],i)=>v42HUDStatRow(k,v,56,326+i*40,548));
  v12Wrap('Game lưu tự động trong trình duyệt. Để bảo toàn tiến trình khi chuyển máy hoặc cập nhật phiên bản HTML, hãy chủ động xuất hồ sơ JSON.',660,231,564,15,V42HUD.paper,24,4);
  v42HUDButton(660,348,564,63,'Lưu ngay · Hành trình hiện tại',()=>{const ok=save();V42ACCESS.note=ok===true?'Đã ghi hồ sơ thành công.':ok===false?'Chưa lưu được. Hãy thử lại hoặc xuất hồ sơ.':'Đã gửi yêu cầu lưu hồ sơ.';},'accessSaveNow',true,true);
  v42HUDButton(660,429,564,63,'Quản lý hồ sơ · V',()=>{if(typeof v42sOpen==='function')v42sOpen();},'accessBackup',false,typeof v42sOpen==='function','Xuất · nhập · xem bản khôi phục');
  if(V42ACCESS.note)v12Wrap(V42ACCESS.note,660,523,564,14,V42HUD.jade,22,2);
  text('Không cần tài khoản hay kết nối Internet.',660,605,12,V42HUD.muted);
 }
 v42HUDButton(596,655,319,31,'Chọn lại nhân vật',()=>{save();mode='menu';modal=null;p=null;V8.menuPage='create';},'accessReselect',false);v42HUDButton(927,655,319,31,'Tiếp tục hành trình · ESC',()=>modal=null,'accessContinue',true);
 if(v28Run())v42HUDButton(34,655,205,31,'Rút lui khỏi bí cảnh',v451Retreat,'retreatSettings');
 else text('THAY ĐỔI CÀI ĐẶT ĐƯỢC ÁP DỤNG NGAY',36,670,11,V42HUD.muted,'left','bold');
}
// Marginal equipment contributions use the real stat function, including set
// resonance, sockets and ascension. No item is removed from the actual inventory.
function v42AccessSources(s){
 const worn=p.worn,owned=Object.entries(worn||{}).filter(([k,i])=>gearDef(p.gear[i]));
 const key=[p.level,p.cls,JSON.stringify(p.v10Attrs||{}),JSON.stringify(p.v11Skills||[]),JSON.stringify(worn),JSON.stringify(owned.map(([k,i])=>p.gear[i])),s.attack,s.def,s.hp,s.mp,s.crit,s.rate].join('|');
 if(V42ACCESS.analysis?.key===key&&elapsed-V42ACCESS.analysisAt<.6)return V42ACCESS.analysis;
 let base,items=[];try{
  p.worn={};base=currentStats();
  for(const [slot,i] of owned){p.worn={...worn};delete p.worn[slot];const a=currentStats();items.push({slot,it:p.gear[i],delta:{attack:s.attack-a.attack,def:s.def-a.def,hp:s.hp-a.hp,mp:s.mp-a.mp,power:v10FightPower(s)-v10FightPower(a)}});}
 }finally{p.worn=worn;}
 V42ACCESS.analysisAt=elapsed;return V42ACCESS.analysis={key,base,items};
}
function v42AccessProfile(){
 const s=currentStats(),a=v10Attributes(),pts=v10Points(),tab=modal.accessStatTab??0;
 v42HUDShell('ĐẠO THỂ · HỒ SƠ TU SĨ','Thuộc tính · Căn cơ · Nguồn sức mạnh');
 const x=34,y=111,w=280,h=535,X=326,Wd=444,rx=782,rw=464;
 v42HUDFrame(x,y,w,h);v42HUDFrame(X,y,Wd,h);v42HUDFrame(rx,y,rw,h);
 v42HUDSection('ĐẠO THỂ',x+14,y+18,w-28,'CẤP '+p.level);
 const cx=x+w/2,px=x+13,py=y+44,pw=w-26,ph=232;
 g.save();const grad=g.createRadialGradient(cx,py+110,3,cx,py+110,145);grad.addColorStop(0,'#6a8c77');grad.addColorStop(.55,'#324d3f');grad.addColorStop(1,'#13261e');g.fillStyle=grad;g.fillRect(px,py,pw,ph);seal(g,cx,py+163,88,V42HUD.bronze,elapsed*.02,.43);v9DrawCell('idle9',4,4,2,cx,py+230,265);g.restore();
 v42HUDTitle(p.v8Name||'Vô Danh',cx,y+295,21,V42HUD.paper,'center');text(realm(),cx,y+321,13,V42HUD.jade,'center','bold');text(V10_SCHOOLS[p.cls].name,cx,y+344,12,V42HUD.muted,'center');
 v42HUDFrame(x+14,y+363,w-28,66,V42HUD.bronze,true);text('CHIẾN LỰC',cx,y+380,11,V42HUD.muted,'center','bold');v42HUDTitle(v10Fmt(v10FightPower(s)),cx,y+405,29,V42HUD.bright,'center');
 text('Tu vi · '+v10Fmt(p.xp)+' / '+v10Fmt(xpNeed()),cx,y+451,12,V42HUD.paper,'center','bold');
 v41HUDBar(x+20,y+465,w-40,12,p.xp,xpNeed(),V42HUD.bronze);
 text('Đã hạ '+v10Fmt(p.kills||0)+' yêu thú',cx,y+497,12,V42HUD.muted,'center');
 v42HUDSection('THUỘC TÍNH GỐC',X+15,y+18,Wd-30,pts+' ĐIỂM CÒN LẠI');
 V10_ATTRS.forEach((d,i)=>{const xx=X+14,yy=y+43+i*66,ww=Wd-28,n=a[d.key]||0;
  v42HUDFrame(xx,yy,ww,59,n?d.color:V42HUD.edge);v42HUDTag(d.glyph,xx+9,yy+19,34,d.color);
  text(d.name,xx+55,yy+14,14,d.color,'left','bold');v12Wrap(d.desc,xx+55,yy+33,204,11,V42HUD.muted,13,2);
  v42HUDTitle(String(n),xx+278,yy+26,19,V42HUD.paper,'right');
  v42HUDButton(xx+289,yy+15,35,30,'−',()=>{v11AttrMinus(d.key);V42ACCESS.analysis=null;},'attrMinus'+i,false,n>0);
  v42HUDButton(xx+329,yy+15,35,30,'+1',()=>{v10Add(d.key);V42ACCESS.analysis=null;},'attrPlus'+i,pts>0,pts>0);
  v42HUDButton(xx+369,yy+15,37,30,'+5',()=>{v10Add(d.key,5);V42ACCESS.analysis=null;},'attrMany'+i,false,pts>0);
 });
 text('6 điểm khởi đầu · +3 điểm mỗi cấp',X+14,y+459,12,V42HUD.muted);
 v42HUDButton(X+14,y+478,Wd-28,39,'Hoàn lại điểm thuộc tính',()=>{v10Reset();V42ACCESS.analysis=null;},'attrReset',false,v10Spent()>0);
 ['Chiến đấu','Tu luyện','Trang bị'].forEach((t,i)=>v42HUDButton(rx+12+i*146,y+12,140,37,t,()=>{modal.accessStatTab=i;},'profileTab'+i,tab===i));
 v41HUDLine(rx+13,y+61,rw-26);
 const fmt=(v,n=1)=>v10Fmt(v,n),pct=(v,n=1)=>fmt(v*100,n)+'%';
 if(tab<2){const rows=tab===0?[
  ['Sinh mệnh',v10Fmt(p.hp)+' / '+v10Fmt(s.hp)],['Linh lực',v10Fmt(p.mp)+' / '+v10Fmt(s.mp)],['Công kích',fmt(s.attack)],['Phòng ngự',fmt(s.def)],['Giảm sát thương',pct(s.damageReduction)],['Sát thương kỹ năng cơ sở',fmt(s.spellAtk)],['Tỷ lệ chí mạng',pct(s.crit)],['Sát thương chí mạng',pct(s.critMultiplier)],['Tốc đánh (hệ số)',fmt(s.rate,2)+'×'],['Di chuyển',fmt(s.speed)+' px/s'],['Tầm đòn cơ bản',fmt(s.range)+' px'],['Hồi linh mỗi giây',fmt(s.regen)],['Hồi khinh công',fmt(s.dashCd,2)+' giây']]:[
  ['Tu vi nhận thêm','+'+pct(s.xpBonus)],['Giảm sát thương thiên kiếp',pct(Math.min(.35,(p.breakFails||0)*.07+(s.breakBonus||0)*.35))],['Đột phá cảnh giới · B',p.level>=45?'Đại viên mãn':v30TrialEligible()?'Đủ thử thiên kiếp':'Chưa đủ điều kiện'],['Phúc duyên',fmt(s.luck,2)],['Hồi máu khi diệt địch',fmt(s.leech)],['Thiêu đốt',fmt(s.burn)],['Làm chậm',pct(s.slow)],['Linh thạch',v10Fmt(p.stones)],['Đan dược',v10Fmt(p.pills)],['Công pháp',v10Fmt(p.techs.length)],['Pháp bảo',v10Fmt(p.relics.length)],['Trang bị trong túi',p.gear.length+'/48'],['Điểm kỹ năng còn lại',v11SkillPoints()+' điểm']];
  rows.forEach(([k,v],i)=>{const yy=y+80+i*32;v42HUDStatRow(k,v,rx+20,yy,rw-40,i<4?V42HUD.jade:V42HUD.paper);});
  text(tab===0?'Chỉ số hiện tại, chưa trừ phòng ngự đối phương.':'Tỷ lệ và chỉ số phụ lấy từ hệ thống tu luyện.',rx+20,y+511,11,V42HUD.muted);
 }else{
  const out=v42AccessSources(s);text('TỔNG ẢNH HƯỞNG KHI MẶC ĐỒ',rx+20,y+80,12,V42HUD.bright,'left','bold');
  const sign=v=>(v>0?'+':'')+fmt(v),cols=[['Công',s.attack-out.base.attack],['Thủ',s.def-out.base.def],['HP',s.hp-out.base.hp],['MP',s.mp-out.base.mp]];
  cols.forEach(([name,num],i)=>{const xx=rx+19+i*108;v42HUDFrame(xx,y+95,103,58);text(name,xx+51,y+112,11,V42HUD.muted,'center','bold');v42HUDTitle(sign(num),xx+51,y+135,17,num>=0?V42HUD.jade:V42HUD.red,'center');});
  text('ẢNH HƯỞNG TỪNG Ô (NẾU THÁO RA)',rx+20,y+178,12,V42HUD.bright,'left','bold');
  if(!out.items.length)text('Chưa có trang bị đang mặc.',rx+20,y+218,13,V42HUD.muted);
  out.items.forEach(({slot,it,delta},i)=>{const d=gearDef(it),yy=y+192+i*78,c=QUALITY_COL[it.quality];v42HUDFrame(rx+17,yy,rw-34,70,c);gearIcon(d,rx+24,yy+7,50);v33Fit(d.name+(it.up?' +'+it.up:''),rx+86,yy+16,rw-190,13,c,'left','bold');text('CL '+(delta.power>=0?'+':'')+delta.power,rx+rw-28,yy+16,12,V42HUD.bright,'right','bold');v33Fit('Công '+sign(delta.attack)+' · Thủ '+sign(delta.def)+' · HP '+sign(delta.hp)+' · MP '+sign(delta.mp),rx+86,yy+43,rw-116,11,V42HUD.jade);buttons.push({x:rx+17,y:yy,w:rw-34,h:70,fn:()=>{modal={kind:'gear'};v21Selected=it.uid;V42HUD.diffKey='';},v33:'profileGear'+i});});
  v12Wrap('Các ô có thể ảnh hưởng lẫn nhau thông qua cộng hưởng bộ. Không cộng trực tiếp các hàng. Bấm vào trang bị để giám định.',rx+20,y+439,rw-40,11,V42HUD.muted,16,3);
  v42HUDButton(rx+18,y+485,rw-36,36,'Mở hành trang · I',()=>{modal={kind:'gear'};},'profileInventory',true);
 }
 v42HUDButton(34,655,284,31,'Công pháp · T',()=>{modal=null;v11Open();},'profileSkills');
 v42HUDButton(328,655,284,31,'Tông môn · N',()=>{modal=null;v31Open();},'profileSect',false,p.worldMode);
 text('C / ESC · Đóng hồ sơ',1246,670,11,V42HUD.muted,'right');
}
v10Panel=v42AccessProfile;



// update_L27: lớp 40_audio (trước đây lưu lớp dưới vào v42AccessUpdateOld). Gọi lớp dưới: update_L26.
function update_L27(dt){if(p!==V42ACCESS.owner){V42ACCESS.owner=p;V42ACCESS.analysis=null;V42ACCESS.note='';}if(typeof V41AudioState!=='undefined'&&V41AudioState.ctx!==V42ACCESS.audioNode)v42AccessAudio();return update_L26(dt);}


