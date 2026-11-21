"""Ban do code chet (M05 — G01-5).

Chay bang Playwright Chromium headless ngay trong may ao:
    python3 tools/coverage.py [--url URL] [--train-sec 15] [--fight-sec 12]

Can chay san server o thu muc goc repo truoc khi chay:
    python3 -m http.server 8123 --bind 127.0.0.1

CHI DO, KHONG SUA CODE GAME. Chi doc trang thai trong trang (evaluate),
goi ham co san cua game, va bam phim/chuot nhu nguoi choi.

Cac buoc chay (coverage tich luy xuyen suot):
  (1) 8 kich ban M01 (tai dung Suite cua tools/test_suite.py):
      menu, tao nhan vat 3 phai, vao thon, di 4 huong, mo ban do M,
      tui do I, nhat ky Q, luu -> tai lai -> Tiep tuc.
  (2) San Luyen Kiem (F6 dan duong + F6 bat dau, nhu tools/perf.py):
      danh moc nhan ~15s.
  (3) Tai lai + Tiep tuc ve thon, ra the gioi mo qua cong thon that
      (dat V47T vao cong roi v47tInteract, nhu probe M09b/T20).
  (4) O the gioi mo Thanh Truc Lam: di bo, mo ban do M -> tab
      "Son Ha Do" (code T20), danh 1 con quai bang chuot trai +
      ky nang chuot phai, dung yen de quai danh lai; mo/dong F2.

Phuong phap do (Chrome Coverage):
- Playwright Python KHONG co page.coverage (chi co o ban Node), nen
  dung truc tiep CDP qua page.context.new_cdp_session(page), giong
  tools/profile.py (dung Profiler.*): Profiler.enable, roi
  Profiler.startPreciseCoverage({callCount: true, detailed: true})
  TRUOC khi trang nap; lay mau bang Profiler.takePreciseCoverage o
  cuoi moi giai doan (truoc reload va cuoi cung) roi gop theo URL
  (lay count lon nhat cho moi range) — vi reload tao scriptId moi
  cho cung URL.
- takePreciseCoverage tra ve, moi script: functions[]; moi function:
  functionName + ranges[] (startOffset/endOffset/count), isBlockCoverage.
  ranges[0] la range cua chinh ham (count = so lan goi); cac range
  sau (neu co) la block ben trong. Quy tac doc:
  * Ham "da chay" <=> ranges[0].count > 0.
  * Byte duoc tinh la "da chay": neu ham chi co 1 range thi ca range
    do (khi count>0); neu co nhieu range thi chi cac block range
    (ranges[1:]) co count>0 — vi ranges[0] cua ham top-level ("")
    bao ca file, tinh ca no thi moi file deu 100%. Roi TRU DI span
    cua moi ham khac trong cung file (xem covered_bytes_for_file),
    vi block range cua ham cha bao tron cau lenh khai bao ham con.
  * % coverage moi file = so byte da chay / tong so byte file tren dia.
    Comment/khoang trang khong nam trong range nao nen % la can duoi.
- Danh sach ham KHONG BAO GIO chay: quet dinh nghia ham trong file
  nguon bang regex (function NAME(, NAME=function(, NAME=()=>,
  const NAME=function(, const NAME=()=>, method name() { trong
  object literal) roi doi chieu voi du lieu CDP theo (ten ham,
  startOffset). Ham nao khong co muc CDP tuong ung thi liet ke
  rieng "khong co du lieu coverage" (V8 chua bien dich ham do —
  thuong cung la chua chay) chu khong tu cho la da chay.

Gioi han (doc ky truoc khi dung so lieu de xoa code):
- Ham chi chay qua mot nhanh khoac: V8 precise coverage bao ca ham
  "da chay" neu duoc goi du 1 lan, du cac nhanh khac trong ham chua
  bao gio chay. Nguoc lai, ham duoc goi nhung chi chay phan dau
  (return som) van tinh la da chay. Vi vay "chua chay" la tin cay
  hon "da chay" — danh sach ham chet moi la phan chac chan nhat.
- Cac duong di chua chay trong lan do (tao nhan vat phai khac chi
  chay qua menu, boss, bi canh, noi that, nhiem vu sau, che do
  Kham pha...) khien ham cua chung hien la "chua chay" — khong co
  nghia la code chet vinh vien, chi la chua duoc kich ban nay cham toi.
- Ham bi va chong (ops/OVERRIDES.md): lop cu bi lop sau ghi de nen
  khong bao gio chay du code co chay — day la doi tuong chinh de
  Claude gop (danh dau ★). Ham song (chi co 1 dinh nghia) ma chua
  chay thi can xem lai duong di choi truoc khi ket luan chet.
- Anh chup tests/out/*.png khong commit (xem .gitignore).

Xuat tests/coverage.md + in bang ra stdout.
"""
import argparse
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from test_suite import Suite, SEED_JS, URL, VIEWPORT  # noqa: E402

from playwright.sync_api import sync_playwright  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
REPORT = ROOT / "tests" / "coverage.md"
OVERRIDES = ROOT / "ops" / "OVERRIDES.md"

# -- JS helpers (chi doc/dieu khien game qua ham co san, nhu perf.py) -----
TRAIN_JS = """() => {
  const d = (typeof v42tDummies === 'function')
    ? v42tDummies().map(e => ({x: Math.round(e.x), y: Math.round(e.y)}))
    : null;
  let scr = null;
  try {
    if (d && d.length) {
      const z = hdPoint(d[0].x, d[0].y);
      scr = {x: Math.round(z.x), y: Math.round(z.y)};
    }
  } catch (e) {}
  return {
    mode, mapId: p?.mapId ?? null,
    v47t: (typeof V47T !== 'undefined' && V47T.active)
      ? {x: Math.round(V47T.x), y: Math.round(V47T.y)} : null,
    near: (typeof v42tNear === 'function') ? v42tNear(0) : null,
    active: (typeof V42T !== 'undefined') ? V42T.active : null,
    hits: (typeof V42T !== 'undefined') ? V42T.hits : null,
    total: (typeof V42T !== 'undefined') ? Math.round(V42T.total) : null,
    dummies: d, scr,
  };
}"""

NEAREST_JS = """() => {
  if (typeof enemies === 'undefined' || !enemies.length) return null;
  const alive = enemies.filter(e => !e.dead);
  if (!alive.length) return null;
  alive.sort((a, b) => Math.hypot(a.x - p.x, a.y - p.y)
    - Math.hypot(b.x - p.x, b.y - p.y));
  const e = alive[0];
  let scr = null;
  try {
    const z = hdPoint(e.x, e.y);
    scr = {x: Math.round(z.x), y: Math.round(z.y)};
  } catch (err) {}
  return {type: e.type, x: Math.round(e.x), y: Math.round(e.y),
    hp: Math.round(e.hp), max: Math.round(e.max),
    dist: Math.round(Math.hypot(e.x - p.x, e.y - p.y)),
    php: Math.round(p.hp),
    pmax: Math.round((typeof s !== 'undefined' && s) ? s.hp : p.hp),
    n: alive.length, scr};
}"""

GATE_JS = """() => {
  if (typeof V47T === 'undefined' || !V47T.active)
    return {ok: false, why: 'V47T not active'};
  const gt = V47T_MAP.gates[0];
  V47T.x = gt.x; V47T.y = gt.y;
  v47tInteract();
  return {ok: true, gate: {x: gt.x, y: gt.y, to: gt.to}};
}"""


def load_override_names():
    """Tap ten ham trong ops/OVERRIDES.md (bang `ham` ...)."""
    names = set()
    if not OVERRIDES.exists():
        return names
    for line in OVERRIDES.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line.startswith("| `") and line.count("|") >= 4:
            name = line.split("|")[1].strip().strip("`")
            if name:
                names.add(name)
    return names


# -- quet dinh nghia ham trong file nguon ---------------------------------
_FUNC_PATTERNS = [
    # function NAME(
    re.compile(r"function\s+([A-Za-z_$][\w$]*)\s*\("),
    # const/let/var NAME = function(
    re.compile(r"(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?"
               r"function\s*\("),
    # const/let/var NAME = (...) =>   (gom ca async)
    re.compile(r"(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?"
               r"\([^)]*\)\s*=>"),
    # const/let/var NAME = x =>
    re.compile(r"(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?"
               r"[A-Za-z_$][\w$]*\s*=>"),
    # NAME = function(  (gan lai / lop va chong, vd v47tInteract=...)
    re.compile(r"([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?function\s*\("),
    # NAME = (...) =>
    re.compile(r"([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>"),
    # NAME = x =>
    re.compile(r"([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?[A-Za-z_$][\w$]*\s*=>"),
    # NAME: function(  (method dang {name: function(){...}})
    re.compile(r"([A-Za-z_$][\w$]*)\s*:\s*(?:async\s*)?function\s*\("),
    # NAME: (...) =>  (method dang {name: (...=>...)})
    re.compile(r"([A-Za-z_$][\w$]*)\s*:\s*(?:async\s*)?\([^)]*\)\s*=>"),
    # method name(...) { trong object literal (dau dong, thu 2+ khoang)
    re.compile(r"^[ \t]{2,}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{",
               re.MULTILINE),
]
_KEYWORDS = {"if", "for", "while", "switch", "catch", "return", "function",
             "else", "do", "with"}


def scan_definitions(path):
    """Tra ve [{name, line, offset, sig_end}] cho moi dinh nghia ham
    tim thay trong file. Bo qua tu khoa dieu khien.
    SUA sau lan chay dau: cung 1 dinh nghia co the khop 2 mau (vd
    `const dustRand=()=>` khop ca mau `const NAME = ...=>` lan mau
    `NAME = ...=>`) nen phai loai trung: sap xep theo offset roi chi
    giu match nao khong nam trong span cua match da giu truoc do."""
    text = path.read_text(encoding="utf-8", errors="replace")
    raw = []
    for pat in _FUNC_PATTERNS:
        for m in pat.finditer(text):
            name = m.group(1)
            if name in _KEYWORDS:
                continue
            raw.append({"name": name, "offset": m.start(),
                        "sig_end": m.end()})
    raw.sort(key=lambda d: (d["offset"], d["sig_end"]))
    defs = []
    kept_spans = []
    for d in raw:
        if any(s <= d["offset"] < e for s, e in kept_spans):
            continue
        kept_spans.append((d["offset"], d["sig_end"]))
        d["line"] = text.count("\n", 0, d["offset"]) + 1
        defs.append(d)
    defs.sort(key=lambda d: d["offset"])
    # Cung (ten, dong) co the co nhieu dinh nghia that (vd 2 arrow
    # `draw:()=>...` trong 2 object literal khac nhau tren cung 1
    # dong) — danh so lan xuat hien de bao cao phan biet duoc.
    occ_count = {}
    for d in defs:
        k = (d["name"], d["line"])
        occ_count[k] = occ_count.get(k, 0) + 1
        d["occ"] = occ_count[k]
    return defs, text


# -- gop du lieu coverage ---------------------------------------------------
def merge_snapshot_grouped(merged, snapshot):
    """Gop giu nguyen nhom theo ham:
    merged[url] = [ {name, ranges: [(start, end, maxcount)]} ] —
    cac ham trung ten/start duoc gop (lay count lon nhat tung range)."""
    for entry in snapshot:
        url = entry.get("url", "")
        if not url:
            continue
        fns = merged.setdefault(url, [])
        index = {}
        for i, f in enumerate(fns):
            index.setdefault((f["name"], f["ranges"][0][0]
                              if f["ranges"] else -1), i)
        for fn in entry.get("functions", []):
            ranges = [(r["startOffset"], r["endOffset"], r.get("count", 0))
                      for r in fn.get("ranges", [])]
            if not ranges:
                continue
            key = (fn.get("functionName", ""), ranges[0][0])
            if key in index:
                old = fns[index[key]]
                old_map = {(s, e): c for s, e, c in old["ranges"]}
                for s, e, c in ranges:
                    if c > old_map.get((s, e), 0):
                        old_map[(s, e)] = c
                old["ranges"] = sorted(
                    [(s, e, c) for (s, e), c in old_map.items()])
            else:
                index[key] = len(fns)
                fns.append({"name": fn.get("functionName", ""),
                            "ranges": sorted(ranges)})


def _subtract(intervals, spans):
    """Tru cac khoang spans khoi intervals; tra ve list [s, e)."""
    out = []
    for s, e in intervals:
        pieces = [(s, e)]
        for ss, ee in spans:
            new = []
            for a, b in pieces:
                if ee <= a or ss >= b:
                    new.append((a, b))
                else:
                    if a < ss:
                        new.append((a, ss))
                    if ee < b:
                        new.append((ee, b))
            pieces = new
            if not pieces:
                break
        out.extend(p for p in pieces if p[1] > p[0])
    return out


def covered_bytes_for_file(fns):
    """So byte da chay trong 1 file, tu danh sach ham da gop.
    Tra ve (covered_bytes, coverable_bytes).
    QUAN TRONG (sua sau lan chay dau): block range cua ham cha bao
    tron cau lenh khai bao ham con — ke ca ham con viet 1 dong
    (`v47tInteract=function(){...}`) — nen neu khong tru di thi than
    ham cua ham con chua bao gio chay van bi tinh la "da chay" (lan
    chay dau do vay bao 97,6% trong khi 841 ham chua chay). Vi vay:
    lay cac range "cua rieng" moi ham (1 range thi lay ca range do;
    nhieu range thi chi lay block range ranges[1:]) roi TRU DI span
    (ranges[0]) cua moi ham KHAC trong cung file, moi hop nhat.
    Coverable tinh tuong tu nhung lay moi range bat ke count."""
    spans = []
    for fn in fns:
        # Ham top-level ("") bao ca file — khong dua vao danh sach
        # span de tru (no khong phai ham con cua ai).
        if fn["ranges"] and fn["name"] != "":
            spans.append((fn["ranges"][0][0], fn["ranges"][0][1]))
    covered = []
    coverable = []
    for fn in fns:
        ranges = fn["ranges"]
        if not ranges:
            continue
        own_span = (ranges[0][0], ranges[0][1])
        others = [sp for sp in spans if sp != own_span]
        if len(ranges) == 1:
            own_cov = ([(ranges[0][0], ranges[0][1])]
                       if ranges[0][2] > 0 else [])
            own_all = [(ranges[0][0], ranges[0][1])]
        else:
            own_cov = [(s, e) for s, e, c in ranges[1:] if c > 0]
            own_all = [(s, e) for s, e, c in ranges[1:]]
        covered.extend(_subtract(own_cov, others))
        coverable.extend(_subtract(own_all, others))
    return _union_len(covered), _union_len(coverable)


def _union_len(intervals):
    """Do dai hop cua cac khoang [start, end)."""
    if not intervals:
        return 0
    total = 0
    cur_s, cur_e = None, None
    for s, e in sorted(intervals):
        if e <= s:
            continue
        if cur_s is None:
            cur_s, cur_e = s, e
        elif s <= cur_e:
            cur_e = max(cur_e, e)
        else:
            total += cur_e - cur_s
            cur_s, cur_e = s, e
    if cur_s is not None:
        total += cur_e - cur_s
    return total


def match_cdp_entry(fns, name, offset, sig_end):
    """Tim muc CDP cua 1 dinh nghia ham: cung ten (hoac ten CDP ket
    thuc bang '.'+ten, vd img.onload) va startOffset nam trong
    [offset, sig_end+30]. Tra ve muc ham hoac None."""
    best = None
    best_dist = None
    for fn in fns:
        fn_name = fn["name"]
        if fn_name != name and not fn_name.endswith("." + name):
            continue
        if not fn["ranges"]:
            continue
        start = fn["ranges"][0][0]
        if offset <= start <= sig_end + 30:
            d = start - offset
            if best_dist is None or d < best_dist:
                best, best_dist = fn, d
    return best


class Runner:
    def __init__(self, page, url):
        self.page = page
        self.url = url
        self.errors = []
        self.steps = []  # (ten, bang chung)
        self.snapshots = []  # (nhan, du lieu takePreciseCoverage)

    def snap(self, label):
        try:
            res = self.cdp.send("Profiler.takePreciseCoverage")
            self.snapshots.append((label, res.get("result", [])))
            n = sum(len(e.get("functions", []))
                    for e in res.get("result", []))
            print(f"  [snapshot {label}]: "
                  f"{len(res.get('result', []))} script, {n} ham")
        except Exception as e:
            print(f"  [snapshot {label} LOI: {e}]")

    def note(self, name, evidence):
        self.steps.append((name, evidence))
        print(f"[BUOC] {name}: {evidence}")

    # -- san luyen (theo tools/perf.py) ----------------------------------
    def train_state(self):
        return self.page.evaluate(TRAIN_JS)

    def start_training(self, timeout=40.0):
        t0 = time.time()
        self.page.keyboard.press("F6")
        last_press = t0
        while time.time() - t0 < timeout:
            st = self.train_state()
            if st["active"]:
                return time.time() - t0, st
            if st["near"] and time.time() - last_press >= 1.5:
                self.page.keyboard.press("F6")
                last_press = time.time()
            self.page.wait_for_timeout(500)
        return time.time() - t0, self.train_state()

    def fight_dummy(self, seconds):
        before = self.train_state()
        t0 = time.time()
        clicks = 0
        while time.time() - t0 < seconds:
            st = self.train_state()
            if not st["active"]:
                self.page.wait_for_timeout(500)
                continue
            if st["scr"]:
                self.page.mouse.click(st["scr"]["x"], st["scr"]["y"])
                clicks += 1
            self.page.wait_for_timeout(700)
        after = self.train_state()
        return before, after, clicks

    # -- tai lai + tiep tuc ------------------------------------------------
    def reload_resume(self, suite):
        self.page.reload(wait_until="load", timeout=60000)
        self.page.wait_for_timeout(3000)
        st = suite.wait_state(lambda s: s["mode"] == "menu", timeout=10)
        if st["mode"] != "menu":
            return st, "khong ve duoc menu sau reload"
        self.page.mouse.click(265, 342)  # "Tiep tuc hanh trinh"
        st = suite.wait_state(lambda s: s["mode"] == "play", timeout=10)
        if st["mode"] != "play" or not st["v47t"]:
            # Du phong: vao thon truc tiep bang ham game (chi khi
            # resume khong dua ve V47T).
            try:
                self.page.evaluate(
                    "() => { if (typeof v47tEnter === 'function')"
                    " v47tEnter(); return true; }")
                self.page.wait_for_timeout(1500)
                st = suite.state()
            except Exception:
                pass
        return st, (f"mode={st['mode']} mapId={st['mapId']} "
                    f"V47T={st['v47t']}")


def main():
    ap = argparse.ArgumentParser(description="M05: ban do code chet")
    ap.add_argument("--url", default=URL)
    ap.add_argument("--train-sec", type=float, default=15)
    ap.add_argument("--fight-sec", type=float, default=12)
    args = ap.parse_args()

    runner_holder = {}
    ok = True
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport=VIEWPORT)
        page.add_init_script(SEED_JS)
        runner = Runner(page, args.url)
        runner_holder["runner"] = runner
        # CDP precise coverage — bat truoc khi trang nap.
        cdp = page.context.new_cdp_session(page)
        runner.cdp = cdp
        cdp.send("Profiler.enable")
        cdp.send("Profiler.startPreciseCoverage",
                 {"callCount": True, "detailed": True})

        def on_error(e):
            runner.errors.append(f"pageerror: {e}")

        def on_console(m):
            if m.type == "error":
                runner.errors.append(f"console.error: {m.text}")

        page.on("pageerror", on_error)
        page.on("console", on_console)
        try:
            suite = Suite(page, args.url)
            # (1) 8 kich ban M01.
            suite.sc01_menu()
            suite.sc02_create_three_classes()
            suite.sc03_enter_village()
            suite.sc04_move_four_directions()
            suite.sc05_map()
            suite.sc06_inventory()
            suite.sc07_journal()
            runner.snap("sau 7 kich ban (truoc reload)")
            suite.sc08_save_reload_continue()
            passed = sum(1 for r in suite.results if r[2])
            runner.note(
                "8 kich ban M01",
                f"{passed}/{len(suite.results)} DAT; loi console/"
                f"pageerror toi nay: {len(runner.errors)}")
            runner.snap("sau 8 kich ban")

            # (2) San Luyen Kiem: F6 dan duong + danh moc nhan.
            wait_s, st = runner.start_training(timeout=40)
            if not st["active"]:
                runner.note("san luyen F6",
                            f"KHONG bat dau duoc sau {wait_s:.1f}s "
                            f"(near={st['near']} mapId={st['mapId']})")
                ok = False
            else:
                before, after, clicks = runner.fight_dummy(args.train_sec)
                runner.note(
                    "danh moc nhan san luyen",
                    f"cho bat dau {wait_s:.1f}s; V42T.hits "
                    f"{before['hits']} -> {after['hits']}, tong sat "
                    f"thuong {before['total']} -> {after['total']}, "
                    f"click {clicks} lan trong {args.train_sec:.0f}s")
                if (after["hits"] or 0) <= (before["hits"] or 0):
                    runner.note("danh moc nhan",
                                "CANH BAO: hits khong tang")
                    ok = False
            runner.snap("sau san luyen")

            # (3) Tai lai + Tiep tuc ve thon de ra cong.
            st, ev = runner.reload_resume(suite)
            runner.note("tai lai + tiep tuc ve thon", ev)
            if st["mode"] != "play" or not st["v47t"]:
                runner.note("ve thon",
                            "KHONG ve duoc thon V47T — bo qua phan "
                            "the gioi mo")
                ok = False
            else:
                # Mo/dong F2 (tuy chinh HUD) truoc khi ra cong.
                page.keyboard.press("F2")
                page.wait_for_timeout(600)
                f2 = page.evaluate(
                    "() => ({editing: (typeof v35Editing === 'function')"
                    " ? v35Editing() : null, modal: modal?.kind ?? null})")
                page.screenshot(path=str(ROOT / "tests" / "out"
                                         / "cov_f2.png"))
                page.keyboard.press("Escape")
                page.wait_for_timeout(300)
                runner.note("mo/dong F2", f"editing={f2['editing']} "
                            f"modal={f2['modal']}")

                # Ra the gioi mo qua cong thon that.
                gate = page.evaluate(GATE_JS)
                st = suite.wait_state(
                    lambda s: s["mapId"] == "truc" and not s["v47t"],
                    timeout=10)
                runner.note(
                    "ra the gioi mo qua cong thon",
                    f"gate={gate}; mapId={st['mapId']} "
                    f"V47T={st['v47t']} p=({st['px']},{st['py']})")
                if st["mapId"] != "truc":
                    runner.note("ra the gioi mo",
                                "KHONG ra duoc Thanh Truc Lam — bo qua "
                                "phan danh quai")
                    ok = False
                else:
                    # Di bo 4 huong o the gioi mo.
                    for key in ["KeyW", "KeyA", "KeyS", "KeyD"]:
                        page.keyboard.down(key)
                        page.wait_for_timeout(1200)
                        page.keyboard.up(key)
                        page.wait_for_timeout(200)
                    st = suite.state()
                    runner.note("di bo o Thanh Truc Lam",
                                f"p=({st['px']},{st['py']}) "
                                f"mapId={st['mapId']}")
                    # Mo ban do -> tab Son Ha Do (code T20).
                    page.keyboard.press("m")
                    st = suite.wait_state(
                        lambda s: s["modal"] == "map", timeout=5)
                    if st["modal"] == "map":
                        page.wait_for_timeout(400)
                        page.mouse.click(1058, 62)  # tab Son Ha Do
                        page.wait_for_timeout(700)
                        page.screenshot(path=str(
                            ROOT / "tests" / "out" / "cov_worldmap.png"))
                        page.keyboard.press("Escape")
                        suite.wait_state(lambda s: s["modal"] is None,
                                         timeout=3)
                        runner.note("ban do the gioi (M -> Son Ha Do)",
                                    "da mo tab Son Ha Do, anh "
                                    "cov_worldmap.png")
                    else:
                        runner.note("ban do the gioi",
                                    f"khong mo duoc ban do, "
                                    f"modal={st['modal']}")

                    # (4) Danh 1 con quai o the gioi mo.
                    near = page.evaluate(NEAREST_JS)
                    if not near:
                        runner.note("danh quai the gioi mo",
                                    "khong tim thay quai nao (enemies rong)")
                        ok = False
                    else:
                        hp0, php0 = near["hp"], near["php"]
                        tx, ty = near["x"], near["y"]
                        xp0 = page.evaluate(
                            "() => ({lv: p.level, xp: Math.round(p.xp),"
                            " kills: p.kills ?? 0,"
                            " n: enemies.filter(e => !e.dead).length,"
                            " hp: Math.round(p.hp)})")
                        # Lay mau 2s/lan trong luc danh (probe /tmp/
                        # probe_fight.py chung minh: kills 0->4, HP
                        # nguoi choi giam dan, quai song chi giam theo
                        # so quai bi ha — tranh so lieu kho hieu khi
                        # chi do dau/cuoi).
                        # Dich den gan quai de danh duoc.
                        page.evaluate(
                            "() => { const e = enemies.filter"
                            "(x => !x.dead).sort((a,b) => Math.hypot(a.x-p.x,"
                            "a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];"
                            " if (e) { p.x = e.x + 80; p.y = e.y; } }")
                        page.wait_for_timeout(400)
                        # Theo doi HP cua CUNG con quai muc tieu sau
                        # moi click (quai song gan nhat voi vi tri cu
                        # cua no, trong 500px) + lay mau toan canh
                        # 2s/lan. Quai di chuyen/chet nen mau HP muc
                        # tieu co the nhay sang quai khac — bang
                        # chung chac chan nhat la p.kills va so quai
                        # song (xem probe_fight.py).
                        hp_samples = [hp0]
                        series = []
                        hits = 0
                        last_sample = 0.0
                        t0 = time.time()
                        while time.time() - t0 < args.fight_sec:
                            n = page.evaluate(NEAREST_JS)
                            if not n or not n["scr"]:
                                page.wait_for_timeout(400)
                                continue
                            # Cu 4 lan thi chuot phai (ky nang), con
                            # lai chuot trai (danh thuong).
                            btn = ("right" if hits % 4 == 3 else "left")
                            page.mouse.click(n["scr"]["x"], n["scr"]["y"],
                                            button=btn)
                            hits += 1
                            page.wait_for_timeout(500)
                            tgt = page.evaluate(
                                "() => { const alive = enemies.filter"
                                "(e => !e.dead); if (!alive.length)"
                                " return null;"
                                " alive.sort((a,b) => Math.hypot(a.x-%d,"
                                "a.y-%d) - Math.hypot(b.x-%d,b.y-%d));"
                                " const e = alive[0];"
                                " const d = Math.hypot(e.x-%d, e.y-%d);"
                                " return d <= 500 ? Math.round(e.hp)"
                                " : null; }" % (tx, ty, tx, ty, tx, ty))
                            if tgt is not None:
                                hp_samples.append(tgt)
                            if time.time() - last_sample >= 2.0:
                                last_sample = time.time()
                                series.append(page.evaluate(
                                    "() => ({t: Math.round("
                                    "performance.now()/1000),"
                                    " hp: Math.round(p.hp),"
                                    " lv: p.level,"
                                    " xp: Math.round(p.xp),"
                                    " kills: p.kills ?? 0,"
                                    " n: enemies.filter"
                                    "(e => !e.dead).length,"
                                    " map: p.mapId,"
                                    " v47t: (typeof V47T !== 'undefined'"
                                    " && V47T.active)})"))
                        after = page.evaluate(
                            "() => ({php: Math.round(p.hp),"
                            " lv: p.level, xp: Math.round(p.xp),"
                            " kills: p.kills ?? 0,"
                            " n: enemies.filter(e => !e.dead).length})")
                        series_txt = "; ".join(
                            f"{s['hp']}hp/lv{s['lv']}/{s['xp']}xp/"
                            f"{s['kills']}kill/{s['n']}quai/"
                            f"{s['map']}"
                            f"{'/V47T' if s['v47t'] else ''}"
                            for s in series)
                        runner.note(
                            "danh quai the gioi mo",
                            f"quai gan nhat type={near['type']} cach "
                            f"{near['dist']}px, {near['n']} quai quanh; "
                            f"mau HP muc tieu theo click: {hp_samples}; "
                            f"lay mau 2s/lan: [{series_txt}]; {hits} "
                            f"click (trai + phai xen ke) trong "
                            f"{args.fight_sec:.0f}s; HP nguoi choi "
                            f"{php0} -> {after['php']}; kills "
                            f"{xp0['kills']}->{after['kills']}; cap "
                            f"{xp0['lv']}->{after['lv']} tu vi "
                            f"{xp0['xp']}->{after['xp']}; quai song "
                            f"{xp0['n']}->{after['n']}")
                        # Dung yen de quai danh lai (duong dan
                        # damagePlayer / so bay).
                        php_before = (after["php"] if after
                                      else php0)
                        page.wait_for_timeout(6000)
                        st2 = suite.state()
                        php_after = page.evaluate(
                            "() => Math.round(p.hp)")
                        runner.note(
                            "dung yen cho quai danh lai",
                            f"HP nguoi choi {php_before} -> {php_after} "
                            f"(sau 6s dung yen)")
                        # An toan: neu gan chet thi hoi day (de bao
                        # cao con chay tiep, khong phai de gian lan).
                        if php_after < 40:
                            page.evaluate(
                                "() => { p.hp = (typeof s !== 'undefined'"
                                " && s) ? s.hp : 200; }")
                            runner.note("hoi mau an toan",
                                        "HP < 40 nen hoi day bang lenh "
                                        "console de tranh chet giua chung")
            runner.snap("cuoi (sau the gioi mo)")
        finally:
            try:
                cdp.send("Profiler.stopPreciseCoverage")
            except Exception:
                pass
            browser.close()

    # -- phan tich ----------------------------------------------------------
    merged = {}
    for label, snap in runner.snapshots:
        merge_snapshot_grouped(merged, snap)
    overrides = load_override_names()

    src_files = sorted(SRC.glob("*.js"))
    per_file = []  # (ten, bytes, covered, coverable, pct)
    total_bytes = 0
    total_covered = 0
    never_run = {}   # ten file -> [(ten ham, dong, override?)]
    no_data = {}     # ten file -> [(ten ham, dong)]
    ran_count = 0
    scanned_count = 0
    for path in src_files:
        defs, text = scan_definitions(path)
        scanned_count += len(defs)
        fns = merged.get(
            f"http://localhost:8123/src/{path.name}", [])
        # Cung file co the xuat hien duoi URL khac (neu --url khac):
        # gop them bat ky URL nao ket thuc bang /src/<ten>.
        for url, flist in merged.items():
            if url.endswith(f"/src/{path.name}") and flist is not fns:
                fns = fns + flist
        covered, coverable = covered_bytes_for_file(fns)
        size = len(text.encode("utf-8"))
        total_bytes += size
        total_covered += covered
        pct = 100.0 * covered / size if size else 0.0
        per_file.append((path.name, size, covered, coverable, pct))
        for d in defs:
            entry = match_cdp_entry(fns, d["name"], d["offset"],
                                    d["sig_end"])
            if entry is None:
                no_data.setdefault(path.name, []).append(
                    (d["name"], d["line"], d["occ"]))
                continue
            count = entry["ranges"][0][2] if entry["ranges"] else 0
            if count > 0:
                ran_count += 1
            else:
                never_run.setdefault(path.name, []).append(
                    (d["name"], d["line"], d["name"] in overrides,
                     d["occ"]))

    per_file.sort(key=lambda r: r[4])
    overall_pct = 100.0 * total_covered / total_bytes if total_bytes else 0
    n_never = sum(len(v) for v in never_run.values())
    n_nodata = sum(len(v) for v in no_data.values())
    n_over_never = sum(1 for v in never_run.values()
                       for _, _, ov, _ in v if ov)
    print()
    print("=== M05: TONG HOP ===")
    print(f"File src/: {len(src_files)} · tong {total_bytes} byte · "
          f"da chay {total_covered} byte ({overall_pct:.1f}%)")
    print(f"Ham quet duoc: {scanned_count} · da chay: {ran_count} · "
          f"khong chay: {n_never} · khong co du lieu CDP: {n_nodata} "
          f"(trong do ★ OVERRIDES chua chay: {n_over_never})")
    print(f"Loi console/pageerror: {len(runner.errors)}")
    for msg in runner.errors:
        print(f"  {msg}")

    # -- bao cao ------------------------------------------------------------
    lines = ["# M05 — Bản đồ code chết (Coverage)",
             "",
             f"Chạy lúc: {time.strftime('%Y-%m-%d %H:%M:%S %Z')} · "
             f"URL: {args.url} · cửa sổ 1280x720 · Playwright Chromium "
             "headless trong máy ảo",
             f"Math.random seed=20261121 (add_init_script, giống "
             f"test_suite); sân luyện {args.train_sec:.0f}s, đánh quái "
             f"thế giới mở {args.fight_sec:.0f}s",
             "",
             "## Các bước đã chạy",
             ""]
    for name, ev in runner.steps:
        lines.append(f"- **{name}**: {ev}")
    lines += ["",
              f"**Lỗi console/pageerror: {len(runner.errors)}**"]
    for msg in runner.errors:
        lines.append(f"- {msg}")
    lines += ["",
              "## Phương pháp đo",
              "",
              "- Dùng CDP `Profiler.startPreciseCoverage` "
              "(`callCount: true, detailed: true`) qua "
              "`page.context.new_cdp_session(page)` — Playwright Python "
              "không có `page.coverage` nên gọi CDP trực tiếp (cùng cách "
              "tools/profile.py dùng CDP `Profiler`). Bật trước khi trang "
              "nạp; lấy mẫu ở cuối mỗi giai đoạn (trước reload và cuối "
              "cùng) rồi gộp theo URL (lấy count lớn nhất mỗi range), vì "
              "reload tạo scriptId mới cho cùng URL.",
              "- Hàm \"đã chạy\" ⇔ `ranges[0].count > 0` (range đầu là "
              "range của chính hàm). Byte \"đã chạy\": hàm 1 range thì "
              "lấy cả range đó; hàm nhiều range thì chỉ lấy các block "
              "range (ranges[1:]) có count>0 — vì ranges[0] của hàm "
              "top-level bao cả file, tính cả nó thì mọi file đều 100%. "
              "Rồi TRỪ ĐI span của mọi hàm khác trong cùng file, vì "
              "block range của hàm cha bao trọn câu lệnh khai báo hàm "
              "con (kể cả hàm con viết 1 dòng) — không trừ thì thân "
              "hàm của hàm chưa bao giờ chạy vẫn bị tính là đã chạy "
              "(lần chạy đầu do vậy báo 97,6% trong khi 841 hàm chưa "
              "chạy; đã sửa và chạy lại).",
              "- Hàm \"không bao giờ chạy\" xác định bằng cách quét định "
              "nghĩa hàm trong file nguồn (regex) rồi đối chiếu với dữ "
              "liệu CDP theo (tên hàm, startOffset). Hàm không có mục "
              "CDP tương ứng liệt kê riêng (V8 chưa biên dịch — thường "
              "cũng là chưa chạy).",
              "- ★ = hàm có trong `ops/OVERRIDES.md` (bị vá chồng, "
              "Claude đang gộp ở T07/T08/T09).",
              "",
              "## Tổng hợp",
              "",
              f"- File `src/`: {len(src_files)} · tổng {total_bytes} "
              f"byte · đã chạy {total_covered} byte "
              f"(**{overall_pct:.1f}%**).",
              f"- Hàm quét được: {scanned_count} · đã chạy: {ran_count} "
              f"· **không chạy: {n_never}** · không có dữ liệu CDP: "
              f"{n_nodata} (trong đó ★ OVERRIDES chưa chạy: "
              f"{n_over_never}).",
              "",
              "## % code đã chạy theo file `src/` (xếp từ thấp lên cao)",
              "",
              "| File | Byte | Đã chạy (byte) | % | Coverable (byte) |",
              "|---|---|---|---|---|"]
    for name, size, covered, coverable, pct in per_file:
        lines.append(f"| `{name}` | {size} | {covered} | {pct:.1f}% | "
                     f"{coverable} |")
    lines += ["",
              "Ghi chú: % tính trên tổng byte file (gồm comment/khoảng "
              "trắng nên là cận dưới); cột Coverable là tổng byte nằm "
              "trong các range CDP (byte thực thi được).",
              "",
              "## Hàm KHÔNG BAO GIỜ chạy (tên + file:dòng)",
              "",
              f"Tổng **{n_never}** hàm (trong đó ★ OVERRIDES: "
              f"{n_over_never}). Hàm bị vá chồng (lớp cũ bị lớp sau ghi "
              "đè) không chạy là bình thường — đó là đối tượng gộp của "
              "Claude. Hàm chỉ có 1 định nghĩa mà chưa chạy thì xem lại "
              "đường đi chơi trước khi kết luận chết (xem Giới hạn).",
              ""]
    for fname in sorted(never_run):
        rows = never_run[fname]
        ov = sum(1 for _, _, o, _ in rows if o)
        lines.append(f"### `{fname}` — {len(rows)} hàm"
                     + (f" ({ov} ★)" if ov else ""))
        lines.append("")
        for name, line, is_ov, occ in sorted(rows, key=lambda r: r[1]):
            star = " ★" if is_ov else ""
            dup = f" (định nghĩa thứ {occ} cùng dòng)" if occ > 1 else ""
            lines.append(f"- `{name}` — `{fname}:{line}`{star}{dup}")
        lines.append("")
    lines += ["## Hàm không có dữ liệu CDP (V8 chưa biên dịch trong lần "
              "chạy này)",
              "",
              f"Tổng **{n_nodata}** hàm. Phần lớn là hàm chỉ được định "
              "nghĩa trong nhánh/đối tượng chưa từng chạm tới, hoặc tên "
              "CDP không khớp mẫu quét (vd `img.onload`). Coi như chưa "
              "chạy cho tới khi có bằng chứng ngược.",
              ""]
    for fname in sorted(no_data):
        rows = no_data[fname]
        lines.append(f"### `{fname}` — {len(rows)} hàm")
        lines.append("")
        for name, line, occ in sorted(rows, key=lambda r: r[1]):
            dup = f" (định nghĩa thứ {occ} cùng dòng)" if occ > 1 else ""
            lines.append(f"- `{name}` — `{fname}:{line}`{dup}")
        lines.append("")
    lines += ["## Giới hạn (đọc trước khi xóa code)",
              "",
              "- Hàm chỉ chạy qua một nhánh khác: V8 tính cả hàm \"đã "
              "chạy\" nếu được gọi dù 1 lần, dù các nhánh khác trong hàm "
              "chưa bao giờ chạy. Ngược lại, hàm được gọi nhưng return "
              "sớm vẫn tính là đã chạy. Vì vậy \"chưa chạy\" đáng tin "
              "hơn \"đã chạy\" — danh sách hàm chết mới là phần chắc "
              "chắn nhất.",
              "- Các đường đi chưa chạy trong lần này: nhân vật phái "
              "khác chỉ chạy qua menu (không vào sâu), boss các vùng, "
              "bí cảnh, nội thất, nhiệm vụ tuyến sau, chế độ Khám phá "
              "(V48X), cửa hàng/đổi đồ, trang bị/công pháp chi tiết, "
              "cài đặt đồ họa... — hàm của chúng hiện là \"chưa chạy\" "
              "không có nghĩa là code chết vĩnh viễn.",
              "- Quét định nghĩa bằng regex nên có thể sót method viết "
              "kiểu lạ, hoặc nhận nhầm (đã loại từ khóa điều khiển); "
              "đối chiếu CDP theo tên + offset nên hàm ẩn danh/không "
              "tên rõ có thể rơi vào mục \"không có dữ liệu\".",
              "- Đo trên máy ảo headless Chromium, seed ngẫu nhiên cố "
              "định — đường đi của NPC/quái có thể khác đôi chút mỗi "
              "lần chạy; chạy lại có thể làm vài hàm đổi trạng thái.",
              "",
              "## Việc tiếp theo",
              "",
              "- Theo gói G01: làm M03 (soát lỗi hiển thị ở 3 cỡ màn "
              "hình) tiếp.",
              "- Claude dùng bảng này cho T07/T08/T09 (gộp hàm): ưu "
              "tiên các hàm ★ chưa chạy, rồi tới file có % thấp nhất.",
              ""]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Báo cáo: tests/coverage.md")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
