'use strict';
// M3 (T40) · Thẻ giới thiệu boss + câu thoại boss — src/60_bestiary.js
// Chỉ chen hành vi bằng điểm móc có sẵn: FRAME_HOOKS.update / FRAME_HOOKS.overlay
// (src/01_core.js) và COMBAT_HOOKS.afterHit (gọi ở src/41_codex.js:58).
// Không bọc đè hàm, không sửa file có sẵn, không tạo phím mới.
// Dữ liệu: DATA.bestiary.bosses (data/bestiary.js, nạp bằng PATCH index.html).
// Tên boss lấy theo TYPES[e.type].name (chuẩn); tra bestiary trước theo tên,
// rồi theo type (runtime TYPES đã đẩy thêm boss vùng nên số type có thể lệch
// với bestiary ở boss bí cảnh — tra theo tên là chính).
// Trạng thái chỉ transient (WeakSet theo đúng object địch + scope nạp vùng),
// không ghi save. Thẻ dùng đồng hồ UI thực (performance.now), không chịu game slow.
var V60 = {
  disabled: false,
  warned: false,
  byName: null,   // Map tên boss -> entry bestiary
  byType: null,   // Map type bestiary -> entry (dự phòng)
  shown: null,    // WeakSet: địch đã hiện thẻ intro trong lần nạp vùng này
  phase2: null,   // WeakSet: địch đã phát câu phase2 trong vòng đời này
  owner: null,    // p lúc reset lần cuối
  scope: '',      // v26Scope() lúc reset lần cuối
  card: null,     // {kind,e,boss,t0,total,timing,lines,twoLine,title,name} | null
  queuedPhase: null, // {e,boss} — câu phase2 chờ intro hiện xong
  telegraph: false,  // boss đang ở mode 'wind' (có telegraph) — cache mỗi tick
  ink: null       // cache canvas nền mực {w,h,c} (vẽ 1 lần, dùng lại)
};
V60.shown = new WeakSet();
V60.phase2 = new WeakSet();

// ---- thời gian UI thực ----
function v60Now(){
  try{
    if(typeof performance !== 'undefined' && performance && typeof performance.now === 'function') return performance.now();
  }catch(e){}
  return Date.now();
}
function v60Clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

// ---- dữ liệu ----
function v60InitData(){
  var list = (typeof DATA !== 'undefined' && DATA && DATA.bestiary && DATA.bestiary.bosses) || null;
  if(!list || !list.length){
    if(!V60.warned){
      V60.warned = true;
      try{ console.warn('[V60] DATA.bestiary.bosses thiếu — tắt module thẻ boss.'); }catch(e){}
    }
    V60.disabled = true;
    return false;
  }
  V60.byName = new Map();
  V60.byType = new Map();
  for(var i = 0; i < list.length; i++){
    var b = list[i];
    if(!b) continue;
    if(b.name) V60.byName.set(b.name, b);
    if(typeof b.type === 'number') V60.byType.set(b.type, b);
  }
  return true;
}

// Trả entry bestiary của một địch boss, hoặc null.
function v60Boss(e){
  if(!e || typeof bossType !== 'function' || !bossType(e.type)) return null;
  var t = (typeof TYPES !== 'undefined' && TYPES) ? TYPES[e.type] : null;
  var name = t && t.name;
  var b = (name && V60.byName && V60.byName.get(name)) || null;
  if(!b && V60.byType) b = V60.byType.get(e.type) || null;
  if(!b) return null;
  return { type: e.type, name: name || b.name, title: b.title || '', intro: b.intro || '', phase2: b.phase2 || '', defeat: b.defeat || '', moves: b.moves || {} };
}

// ---- an toàn hiển thị (modal / photo / chuyển vùng / telegraph / nội thất...) ----
function v60SafeNow(){
  if(typeof p === 'undefined' || !p) return false;
  if(typeof mode === 'undefined' || mode !== 'play') return false;
  if(typeof failed !== 'undefined' && failed) return false;
  if(typeof modal !== 'undefined' && modal) return false;
  try{ if(typeof document !== 'undefined' && document && document.hidden) return false; }catch(e){}
  try{ if(typeof V42_PHOTO !== 'undefined' && V42_PHOTO && V42_PHOTO.active) return false; }catch(e){}
  try{ if(typeof worldTitle !== 'undefined' && worldTitle > 0) return false; }catch(e){}
  if(V60.telegraph) return false;
  try{ if(typeof v36Inside === 'function' && v36Inside()) return false; }catch(e){}
  try{ if(typeof V48X !== 'undefined' && V48X && V48X.active) return false; }catch(e){}
  try{ if(typeof v47tIsActive === 'function' && v47tIsActive()) return false; }catch(e){}
  try{ if(typeof v30Trial === 'function' && v30Trial()) return false; }catch(e){}
  return true;
}

// Boss nào đang có telegraph (mode 'wind' + action) — đọc V27 AI live, không bọc đè.
function v60RefreshTelegraph(){
  V60.telegraph = false;
  if(typeof v27AI !== 'function' || typeof enemies === 'undefined' || !enemies) return;
  try{
    for(var i = 0; i < enemies.length; i++){
      var e = enemies[i];
      if(!e || e.dead || !bossType(e.type)) continue;
      var a = v27AI(e);
      if(a && a.mode === 'wind' && a.action){ V60.telegraph = true; return; }
    }
  }catch(e){}
}

// Ưu tiên target hiện tại (v34Target), rồi boss gần nhất trong tầm 650.
function v60Candidate(){
  if(typeof p === 'undefined' || !p || typeof enemies === 'undefined' || !enemies) return null;
  try{
    if(typeof v34Target === 'function'){
      var t = v34Target();
      if(t && !t.dead && bossType(t.type)){
        var bt = v60Boss(t);
        if(bt && dist(t, p) <= 650) return { e: t, boss: bt };
      }
    }
  }catch(e){}
  var best = null, bd = 650;
  for(var i = 0; i < enemies.length; i++){
    var e = enemies[i];
    if(!e || e.dead || !bossType(e.type)) continue;
    var d = dist(e, p);
    if(d > 650 || d >= bd) continue;
    var b = v60Boss(e);
    if(!b) continue;
    best = e; bd = d;
  }
  return best ? { e: best, boss: v60Boss(best) } : null;
}

function v60LiveScope(){
  try{ return (typeof v26Scope === 'function') ? v26Scope() : ''; }catch(e){ return ''; }
}

// ---- thẻ: tạo / tiến trình ----
var V60_TIMING = {
  intro:  { inn: 180, hold: 1000, out: 220 },
  phase:  { inn: 120, hold: 1100, out: 180 },
  defeat: { inn: 160, hold: 1400, out: 220 }
};

function v60Measure(s, font){
  try{
    g.save(); g.font = font;
    var w = g.measureText(String(s)).width;
    g.restore();
    return w;
  }catch(e){ return String(s).length * 7; }
}

function v60Wrap2(s, font, maxW){
  // Gói tối đa 2 dòng; dòng 2 cắt '…' nếu vẫn dài.
  var words = String(s).split(/\s+/).filter(Boolean);
  var lines = [''], li = 0;
  for(var i = 0; i < words.length; i++){
    var trial = lines[li] ? lines[li] + ' ' + words[i] : words[i];
    if(v60Measure(trial, font) <= maxW || !lines[li]){ lines[li] = trial; }
    else if(li === 0){ li = 1; lines[1] = words[i]; }
    else {
      var cut = lines[1];
      while(cut.length > 1 && v60Measure(cut + '…', font) > maxW) cut = cut.slice(0, -1);
      lines[1] = cut + '…';
      return lines;
    }
  }
  return lines;
}

function v60StartCard(kind, e, b){
  var timing = V60_TIMING[kind];
  var card = {
    kind: kind, e: e, boss: b, t0: null, // t0 null = đang chờ cửa sổ an toàn đầu tiên
    scope: v60LiveScope(), // scope lúc tạo: đổi vùng sau đó thì thẻ cũ bị hủy, thẻ tạo sau đổi vùng được giữ
    total: timing.inn + timing.hold + timing.out, timing: timing,
    lines: [], twoLine: false, title: '', name: ''
  };
  if(kind === 'intro'){
    card.title = b.title || '';
    card.name = b.name || '';
    var intro = b.intro || '';
    var f1 = '14px V45Sans, "Segoe UI", Arial, sans-serif';
    if(v60Measure(intro, f1) <= 472){ card.lines = [intro]; card.twoLine = false; }
    else{
      var f2 = '16px V45Sans, "Segoe UI", Arial, sans-serif';
      card.lines = v60Wrap2(intro, f2, 472);
      card.twoLine = card.lines.length > 1;
    }
  } else {
    var s = kind === 'phase' ? (b.phase2 || '') : (b.defeat || '');
    var f = '15px V45Sans, "Segoe UI", Arial, sans-serif';
    card.lines = v60Measure(s, f) <= 440 ? [s] : v60Wrap2(s, f, 440);
  }
  V60.card = card;
}

// ---- nền mực loang (cache 1 lần cho mỗi cỡ, không tạo mỗi frame) ----
function v60Rand(seed){
  var s = seed >>> 0;
  return function(){
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function v60Ink(w, h){
  if(V60.ink && V60.ink.w === w && V60.ink.h === h) return V60.ink.c;
  var c = null;
  try{
    if(typeof document !== 'undefined' && document && typeof document.createElement === 'function'){
      c = document.createElement('canvas');
      c.width = w; c.height = h;
      var q = c.getContext('2d');
      if(!q) return null;
      var rnd = v60Rand(w * 131 + h * 17 + 7);
      // Mảng mực loang ngang: nhiều ellipse chồng, alpha .28–.48, mép rách (không phủ kín).
      for(var i = 0; i < 18; i++){
        var cx = w * (0.05 + 0.90 * rnd()), cy = h * (0.22 + 0.56 * rnd());
        var rx = 90 + rnd() * 135, ry = 15 + rnd() * 27;
        q.fillStyle = 'rgba(16,11,19,' + (0.28 + rnd() * 0.20).toFixed(2) + ')';
        q.beginPath(); q.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); q.fill();
      }
      // Hai nét ngang đỏ mờ (spec boss_intro §2).
      q.fillStyle = 'rgba(241,132,116,0.20)';
      q.fillRect(16, Math.round(h * 0.10), w - 32, 2);
      q.fillRect(16, Math.round(h * 0.88), w - 32, 2);
      V60.ink = { w: w, h: h, c: c };
      return c;
    }
  }catch(e){ return null; }
  return null;
}

// ---- vẽ ----
function v60DrawIntro(c, t){
  var x = 380, y = 202, w = 520, h = c.twoLine ? 116 : 104;
  var reveal = t < c.timing.inn ? v60Clamp(t / c.timing.inn, 0, 1) : 1;
  g.save();
  // Nét cọ reveal ngang 0→520 trong lúc vào (chữ không di chuyển).
  g.beginPath(); g.rect(x, y, Math.max(1, w * reveal), h); g.clip();
  var ink = v60Ink(w, h);
  if(ink) g.drawImage(ink, x, y);
  else { g.fillStyle = 'rgba(20,17,14,0.85)'; g.fillRect(x, y, w, h); }
  g.restore();
  // Danh hiệu (1 dòng, cắt '…' nếu dài).
  var title = c.title, tf = '14px V45Sans, "Segoe UI", Arial, sans-serif';
  if(title){
    while(title.length > 1 && v60Measure(title + '…', tf) > 472) title = title.slice(0, -1);
    if(v60Measure(title, tf) > 472) title = title.slice(0, -1) + '…';
    text(title, 640, 211, 14, '#e3b96f', 'center');
  }
  // Tên boss lớn V18Serif, viền mực 2px, hạ tới 24 nếu dài.
  var size = 30;
  var nf = 'bold ' + size + 'px V18Serif, "DejaVu Serif", Georgia, "Segoe UI", Arial, serif';
  var nw = v60Measure(c.name, nf);
  if(nw > 472){ size = Math.max(24, Math.floor(30 * 472 / nw)); nf = 'bold ' + size + 'px V18Serif, "DejaVu Serif", Georgia, "Segoe UI", Arial, serif'; }
  g.save();
  g.font = nf; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 2; g.strokeStyle = '#14110e';
  g.strokeText(c.name, 640, 234);
  g.fillStyle = '#efe6d4';
  g.fillText(c.name, 640, 234);
  g.restore();
  // Một nét chỉ vàng dưới tên.
  var ry = c.twoLine ? 258 : 262;
  g.fillStyle = '#c9a86a';
  g.fillRect(580, ry, 120, 2);
  // Câu intro.
  if(c.twoLine){
    text(c.lines[0] || '', 640, 272, 16, '#efe6d4', 'center');
    if(c.lines[1]) text(c.lines[1], 640, 292, 16, '#efe6d4', 'center');
  } else {
    text(c.lines[0] || '', 640, 277, 14, '#efe6d4', 'center');
  }
}

function v60DrawLine(c){
  var x = 400, y = 202, w = 480, h = 48;
  g.fillStyle = 'rgba(20,17,14,0.65)';
  g.fillRect(x, y, w, h);
  var col = c.kind === 'phase' ? '#f18474' : '#a8d6c5';
  if(c.lines.length > 1){
    text(c.lines[0], 640, 218, 15, col, 'center');
    text(c.lines[1], 640, 238, 15, col, 'center');
  } else {
    text(c.lines[0] || '', 640, 226, 15, col, 'center');
  }
}

function v60Alpha(c, t){
  var tm = c.timing;
  if(t < tm.inn) return v60Clamp(t / tm.inn, 0, 1);
  if(t < tm.inn + tm.hold) return 1;
  if(t < c.total) return v60Clamp(1 - (t - tm.inn - tm.hold) / tm.out, 0, 1);
  return 0;
}

function v60Draw(){
  if(V60.disabled) return;
  var c = V60.card;
  if(!c || c.t0 === null) return; // chưa từng hiện frame nào -> chờ, không vẽ
  if(!v60SafeNow()) return;      // modal / photo / chuyển vùng / telegraph: ẩn ngay frame này
  var t = v60Now() - c.t0;
  if(t < 0 || t >= c.total) return;
  var a = v60Alpha(c, t);
  if(a <= 0) return;
  try{
    g.save();
    g.globalAlpha = a;
    if(c.kind === 'intro') v60DrawIntro(c, t);
    else v60DrawLine(c);
    g.restore();
  }catch(e){}
}

// ---- update mỗi tick (FRAME_HOOKS.update) ----
function v60Update(){
  if(V60.disabled) return;
  if(typeof p === 'undefined' || !p){ V60.owner = null; return; }
  var scope = v60LiveScope();
  var ownerChanged = (V60.owner !== p);
  if(ownerChanged || V60.scope !== scope){
    // Nạp vùng / nhân vật mới: bộ đánh dấu transient reset.
    // Thẻ tạo SAU khi đổi vùng (scope lúc tạo == scope mới) được giữ lại;
    // thẻ của vùng cũ bị hủy (không hiện ngoài cảnh).
    V60.owner = p; V60.scope = scope;
    V60.shown = new WeakSet();
    V60.phase2 = new WeakSet();
    if(ownerChanged || (V60.card && V60.card.scope !== scope)) V60.card = null;
    if(ownerChanged || (V60.queuedPhase && V60.queuedPhase.scope !== scope)) V60.queuedPhase = null;
  }
  if(typeof mode === 'undefined' || mode !== 'play' || (typeof failed !== 'undefined' && failed)){
    V60.card = null; V60.queuedPhase = null;
    return;
  }
  v60RefreshTelegraph();
  var c = V60.card;
  if(c){
    if(c.e && c.e.dead && c.kind !== 'defeat'){ V60.card = null; V60.queuedPhase = null; c = null; }
    else if(c.t0 === null){
      if(v60SafeNow()) c.t0 = v60Now(); // hiện frame đầu tiên khi cửa sổ an toàn
    } else {
      var t = v60Now() - c.t0;
      if(t >= c.total){
        V60.card = null;
        if(V60.queuedPhase){
          var q = V60.queuedPhase; V60.queuedPhase = null;
          if(q.e && !q.e.dead) v60StartCard('phase', q.e, q.boss);
        }
      }
    }
  }
  if(!V60.card && !V60.queuedPhase){
    var cand = v60Candidate();
    if(cand && !V60.shown.has(cand.e)){
      if(v60SafeNow()){
        V60.shown.add(cand.e);
        v60StartCard('intro', cand.e, cand.boss);
      }
      // Chưa an toàn thì chờ (không đánh dấu đã hiện) — hiện lần đầu khi còn hợp lệ.
    }
  }
}

// ---- móc combat (COMBAT_HOOKS.afterHit) ----
function v60AfterHit(info){
  if(V60.disabled || !info || !info.boss || !info.e) return;
  var b = v60Boss(info.e);
  if(!b) return;
  var e = info.e;
  if(info.killed){
    // Defeat ngắt intro/phase; hai boss chết gần nhau thì câu đầu thắng, câu sau bỏ.
    if(V60.card && V60.card.kind === 'defeat') return;
    V60.queuedPhase = null;
    v60StartCard('defeat', e, b);
    return;
  }
  if(V60.phase2.has(e)) return; // một lần trong vòng đời boss, không lặp khi hồi >50% rồi xuống lại
  var max = e.max || 0;
  if(!max || !info.hp0) return;
  if(info.hp0 / max > 0.5 && e.hp / max <= 0.5 && e.hp > 0){
    V60.phase2.add(e);
    if(V60.card && V60.card.kind === 'intro'){
      V60.queuedPhase = { e: e, boss: b, scope: v60LiveScope() }; // ưu tiên khi intro hoàn tất
    } else if(!V60.card){
      v60StartCard('phase', e, b);
    }
    // Đang hiện phase/defeat khác thì bỏ (không xếp chồng).
  }
}

// ---- đăng ký (chỉ khi DATA.bestiary có) ----
if(typeof FRAME_HOOKS !== 'undefined' && FRAME_HOOKS && typeof COMBAT_HOOKS !== 'undefined' && COMBAT_HOOKS){
  if(v60InitData()){
    FRAME_HOOKS.update.push(v60Update);
    FRAME_HOOKS.overlay.push(v60Draw);
    COMBAT_HOOKS.afterHit.push(v60AfterHit);
  }
}
