"""Profile CPU game Van Dao Tu Tien (M08 — G01-3).

Chay bang Playwright Chromium headless ngay trong may ao:
    python3 tools/profile.py [--url URL] [--profile SEC] [--fps SEC]
    python3 tools/profile.py            # mac dinh: profile 10s, fps 10s

Can chay san server o thu muc goc repo truoc khi chay:
    python3 -m http.server 8123 --bind 127.0.0.1

CHI DO, KHONG SUA CODE GAME. Chi doc trang thai trong trang (evaluate)
va goi ham co san cua game (v41ApplyQuality de doi cai dat Do hoa).

1) Profile CPU (CDP Profiler, V8 sampling profiler):
   - 10 giay dung yen o thon Thanh Thach Thon (1280x720).
   - 10 giay dung yen o San Luyen Kiem, phien luyen tap da bat dau
     nhung CHUA danh (V42T.active=true, hits=0) — de tach "scene san
     luyen nang" khoi "hieu ung danh nhau nang" (M02: san luyen 21,3 fps
     du chua danh, thon 60,6 fps).
   - Moi mau (~1ms) ghi node dang chay; self = tong thoi gian mau cua
     chinh node; total = tong thoi gian mau cua node + tat ca con chau
     (tinh bang cach cong thoi gian mau len toan bo to tien cua node
     duoc lay mau). Gom theo (ten ham, file, dong). File:dong lay tu
     callFrame cua CDP (lineNumber + 1 vi CDP dem dong tu 0).
   - Ghi ro ham nao nam trong ops/OVERRIDES.md (ham bi va chong).

2) FPS o 1920x1080 (sau T28, canvas co dan theo RS.k):
   - Cai dat Do hoa Can bang (q=1, RS.k toi da 1,5) va Cao (q=2,
     RS.k toi da 2) — dat qua v41ApplyQuality(q) trong console.
   - Moi cai dat: dung yen 10s o thon + dung yen 10s o san luyen
     (phien da bat dau, khong danh), dem khung hinh bang vong rAF
     (window.__fps.buckets) giong tools/perf.py.
   - Ghi lai RS.k thuc te quan sat duoc: o 1920x1080, ti le hien thi
     1920/1280 = 1,5 nen k = 1,5 o ca hai cai dat (Cao chi tang gioi
     han len 2, khong tang ti le hien thi); khac nhau giua Can bang
     va Cao o day la maxParticles/maxEvents [78/116] va [22/26].

Ghi bao cao tests/perf_profile.md + in bang ra stdout.
"""
import argparse
import statistics
import sys
import time
from collections import defaultdict
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tests" / "out"
REPORT = ROOT / "tests" / "perf_profile.md"
OVERRIDES = ROOT / "ops" / "OVERRIDES.md"
URL = "http://localhost:8123/index.html"

SEED = 20261121
SEED_JS = f"""() => {{
  let s = {SEED} >>> 0;
  Math.random = function() {{
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }};
}}"""

FPS_JS = """() => {
  if (window.__fps) return true;
  window.__fps = {buckets: [], n: 0, last: performance.now()};
  const loop = (t) => {
    const f = window.__fps;
    f.n++;
    if (t - f.last >= 1000) {
      f.buckets.push(f.n); f.n = 0; f.last = t;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return true;
}"""

STATE_JS = """() => {
  const d = (typeof v42tDummies === 'function')
    ? v42tDummies().map(e => ({x: Math.round(e.x), y: Math.round(e.y)})) : null;
  return {
    mode, menuPage: (typeof V8 !== 'undefined' ? V8.menuPage : null),
    mapId: p?.mapId ?? null,
    modal: modal?.kind ?? null,
    canResume: (typeof canResume === 'function') ? canResume() : null,
    v47t: (typeof V47T !== 'undefined' && V47T.active)
      ? {x: Math.round(V47T.x), y: Math.round(V47T.y)} : null,
    p: p ? {x: Math.round(p.x), y: Math.round(p.y)} : null,
    near: (typeof v42tNear === 'function') ? v42tNear(0) : null,
    active: (typeof V42T !== 'undefined') ? V42T.active : null,
    hits: (typeof V42T !== 'undefined') ? V42T.hits : null,
    quality: (typeof v41Quality === 'function') ? v41Quality() : null,
    rsk: (typeof RS !== 'undefined') ? RS.k : null,
    cv: (typeof cv !== 'undefined') ? {w: cv.width, h: cv.height} : null,
    dpr: window.devicePixelRatio || 1,
    rect: (typeof cv !== 'undefined')
      ? (() => { const r = cv.getBoundingClientRect();
                 return {w: Math.round(r.width), h: Math.round(r.height)}; })()
      : null,
  };
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


def summarize_profile(profile):
    """Gom mau CDP Profiler thanh self/total theo (ten ham, file, dong).

    Tra ve (rows, total_ms, n_samples) voi rows la list dict:
    {name, file, line, self_ms, total_ms, self_pct, total_pct,
     samples, override}.
    """
    nodes = {n["id"]: n for n in profile.get("nodes", [])}
    parent = {}
    for n in profile.get("nodes", []):
        for c in n.get("children", []):
            parent[c] = n["id"]
    samples = profile.get("samples", [])
    deltas = profile.get("timeDeltas", [])  # micro giay
    self_us = defaultdict(float)
    total_us = defaultdict(float)
    total_time_us = 0.0
    for i, node_id in enumerate(samples):
        dt = deltas[i] if i < len(deltas) else 0
        total_time_us += dt
        self_us[node_id] += dt
        # Cong len toan bo to tien (total = node + con chau).
        cur = node_id
        seen = set()
        while cur is not None and cur not in seen:
            seen.add(cur)
            total_us[cur] += dt
            cur = parent.get(cur)
    agg = {}
    for node_id, node in nodes.items():
        cf = node.get("callFrame", {})
        name = cf.get("functionName") or "(anonymous)"
        url = cf.get("url", "")
        fname = url.rsplit("/", 1)[-1] if url else "(native)"
        line = cf.get("lineNumber", -1) + 1
        key = (name, fname, line)
        a = agg.setdefault(key, {"self_us": 0.0, "total_us": 0.0,
                                 "samples": 0})
        a["self_us"] += self_us.get(node_id, 0.0)
        a["total_us"] += total_us.get(node_id, 0.0)
        a["samples"] += node.get("hitCount", 0)
    total_ms = total_time_us / 1000.0
    rows = []
    for (name, fname, line), a in agg.items():
        rows.append({
            "name": name, "file": fname, "line": line,
            "self_ms": round(a["self_us"] / 1000.0, 1),
            "total_ms": round(a["total_us"] / 1000.0, 1),
            "self_pct": round(100 * a["self_us"] / total_time_us, 2)
            if total_time_us else 0,
            "total_pct": round(100 * a["total_us"] / total_time_us, 2)
            if total_time_us else 0,
            "samples": a["samples"],
        })
    return rows, total_ms, len(samples)


class Profiler:
    def __init__(self, page, url):
        self.page = page
        self.url = url
        self.errors = []
        self.results = []  # cac dict profile + fps

    def state(self):
        return self.page.evaluate(STATE_JS)

    def wait_state(self, pred, timeout=10.0, poll=0.25):
        deadline = time.time() + timeout
        last = None
        while time.time() < deadline:
            last = self.state()
            try:
                if pred(last):
                    return last
            except Exception:
                pass
            self.page.wait_for_timeout(int(poll * 1000))
        return last

    def click_logical(self, lx, ly):
        """Click toa do logic 1280x720, quy doi theo rect canvas thuc."""
        st = self.state()
        rect = st["rect"] or {"w": 1280, "h": 720}
        sx = rect["w"] / 1280.0
        sy = rect["h"] / 720.0
        self.page.mouse.click(lx * sx, ly * sy)

    def enter_world(self, cls_index=0):
        """Menu -> tao nhan vat (Kiem Tu) -> vao thon. Giong test_suite,
        nhung click theo toa do logic (quy doi theo cove viewport)."""
        self.page.goto(self.url, wait_until="load", timeout=60000)
        self.page.wait_for_timeout(3000)
        st = self.wait_state(lambda s: s["mode"] == "menu", timeout=10)
        if st["mode"] != "menu":
            raise RuntimeError(f"khong vao duoc menu: {st}")
        x, y = (265, 404) if st["canResume"] else (265, 342)
        self.click_logical(x, y)
        st = self.wait_state(lambda s: s["menuPage"] == "create", timeout=5)
        if st["menuPage"] != "create":
            raise RuntimeError(f"khong vao duoc man tao nhan vat: {st}")
        self.click_logical(253, 551)  # "Nhap the"
        self.page.wait_for_timeout(600)
        st = self.state()
        if st["menuPage"] == "create":  # lan 1 chi bat xac nhan (co save)
            self.click_logical(253, 551)
        st = self.wait_state(
            lambda s: s["mode"] == "play", timeout=10)
        if st["mode"] != "play":
            raise RuntimeError(f"khong vao duoc thon: {st}")
        return st

    def start_training(self, timeout=40.0):
        """F6 dan duong toi San Luyen Kiem roi bat dau luyen tap.
        Tra ve (thoi gian cho, state)."""
        t0 = time.time()
        self.page.keyboard.press("F6")
        last_press = t0
        while time.time() - t0 < timeout:
            st = self.state()
            if st["active"]:
                return time.time() - t0, st
            if st["near"] and time.time() - last_press >= 1.5:
                self.page.keyboard.press("F6")
                last_press = time.time()
            self.page.wait_for_timeout(500)
        return time.time() - t0, self.state()

    def fps_buckets(self):
        return list(self.page.evaluate("() => window.__fps.buckets"))

    def measure_fps(self, seconds, label):
        before = len(self.fps_buckets())
        deadline = time.time() + seconds
        while time.time() < deadline:
            self.page.wait_for_timeout(200)
        buckets = self.fps_buckets()[before:]
        result = {
            "label": label, "seconds": seconds, "buckets": buckets,
            "frames": sum(buckets),
            "avg": round(statistics.mean(buckets), 2) if buckets else 0,
            "min": min(buckets) if buckets else 0,
            "max": max(buckets) if buckets else 0,
        }
        print(f"[FPS] {label}: avg={result['avg']} min={result['min']} "
              f"max={result['max']} frames={result['frames']} {buckets}")
        return result

    def profile_seconds(self, seconds, label, cdp):
        """Profile CPU trong `seconds` giay, tra ve dict ket qua."""
        cdp.send("Profiler.start")
        deadline = time.time() + seconds
        while time.time() < deadline:
            self.page.wait_for_timeout(500)
        # Profiler.stop tra ve {"profile": {...}} — lay phan profile.
        prof = cdp.send("Profiler.stop").get("profile", {})
        rows, total_ms, n = summarize_profile(prof)
        over = load_override_names()
        for r in rows:
            r["override"] = r["name"] in over
        result = {
            "label": label, "seconds": seconds, "rows": rows,
            "total_ms": round(total_ms, 1), "samples": n,
        }
        self.results.append(result)
        top = sorted(rows, key=lambda r: -r["self_ms"])[:5]
        print(f"[PROFILE] {label}: {n} mau, tong {total_ms:.0f}ms "
              f"trong {seconds}s")
        for r in top:
            print(f"   self {r['self_ms']:>8.1f}ms ({r['self_pct']:>5.2f}%) "
                  f"total {r['total_ms']:>8.1f}ms "
                  f"{r['name']} {r['file']}:{r['line']}"
                  f"{' [OVERRIDES]' if r['override'] else ''}")
        return result


def run_fps_at_quality(pw, url, quality, seconds, errors):
    """Mot lan chay rieng: viewport 1920x1080, dat chat luong q,
    do FPS thon + san luyen (khong danh). Tra ve dict ket qua."""
    browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.add_init_script(SEED_JS)
    prof = Profiler(page, url)
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    page.on("console", lambda m: errors.append(f"console.error: {m.text}")
    if m.type == "error" else None)
    out = {"quality": quality, "name": ["Tiết kiệm", "Cân bằng", "Cao"][quality]}
    try:
        st = prof.enter_world()
        print(f"Vao thon (1920x1080, q={quality}): v47t={st['v47t']} "
              f"p={st['p']} rect={st['rect']}")
        page.evaluate(FPS_JS)
        # Dat chat luong Do hoa (ham co san cua game, chi do).
        page.evaluate(f"() => v41ApplyQuality({quality})")
        page.wait_for_timeout(1000)
        st = prof.state()
        out["rsk"] = st["rsk"]
        out["cv"] = st["cv"]
        out["dpr"] = st["dpr"]
        out["quality_actual"] = st["quality"]
        print(f"  chat luong thuc te={st['quality']} RS.k={st['rsk']} "
              f"canvas={st['cv']} dpr={st['dpr']}")
        page.wait_for_timeout(2000)
        out["village"] = prof.measure_fps(
            seconds, f"thon 1920x1080 q={quality}")
        wait_s, st = prof.start_training(timeout=40)
        print(f"  San luyen: cho bat dau {wait_s:.1f}s, "
              f"active={st['active']} hits={st['hits']}")
        if not st["active"]:
            print("  LOI: khong bat dau duoc San Luyen Kiem")
            out["training"] = None
        else:
            page.wait_for_timeout(1000)
            st2 = prof.state()
            out["rsk_training"] = st2["rsk"]
            out["training"] = prof.measure_fps(
                seconds, f"san luyen (khong danh) 1920x1080 q={quality}")
            out["hits"] = st2["hits"]
    finally:
        browser.close()
    return out


def main():
    ap = argparse.ArgumentParser(description="M08: profile CPU + FPS")
    ap.add_argument("--url", default=URL)
    ap.add_argument("--profile", type=float, default=10)
    ap.add_argument("--fps", type=float, default=10)
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    errors = []
    ok = True
    profiles = []
    fps_runs = []
    with sync_playwright() as pw:
        # --- P1: profile 1280x720, chat luong mac dinh (Can bang) ---
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.add_init_script(SEED_JS)
        prof = Profiler(page, args.url)
        page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
        page.on("console", lambda m: errors.append(f"console.error: {m.text}")
        if m.type == "error" else None)
        cdp = page.context.new_cdp_session(page)
        cdp.send("Profiler.enable")
        try:
            st = prof.enter_world()
            print(f"Vao thon (1280x720): v47t={st['v47t']} p={st['p']}")
            page.evaluate(FPS_JS)
            page.wait_for_timeout(2000)
            st = prof.state()
            print(f"  chat luong={st['quality']} RS.k={st['rsk']} "
                  f"canvas={st['cv']}")
            profiles.append(prof.profile_seconds(
                args.profile, "thon (1280x720)", cdp))
            wait_s, st = prof.start_training(timeout=40)
            print(f"San luyen: cho bat dau {wait_s:.1f}s, "
                  f"active={st['active']} hits={st['hits']}")
            if not st["active"]:
                print("LOI: khong bat dau duoc San Luyen Kiem")
                ok = False
            else:
                page.wait_for_timeout(1000)
                st = prof.state()
                print(f"  truoc profile san luyen: hits={st['hits']} "
                      f"RS.k={st['rsk']}")
                profiles.append(prof.profile_seconds(
                    args.profile, "san luyen, khong danh (1280x720)", cdp))
                st = prof.state()
                print(f"  sau profile san luyen: hits={st['hits']}")
                if (st["hits"] or 0) != 0:
                    print("CANH BAO: hits != 0 trong luc profile "
                          "(khong danh nhung co the bi danh?)")
        finally:
            browser.close()

        # --- P2: FPS 1920x1080, Can bang (q=1) roi Cao (q=2) ---
        for q in (1, 2):
            fps_runs.append(run_fps_at_quality(
                pw, args.url, q, args.fps, errors))

    # --- Bao cao ---
    print()
    print("=== M08: KET QUA ===")
    for r in fps_runs:
        v = r.get("village")
        t = r.get("training")
        print(f"{r['name']} (q={r['quality']}, RS.k={r.get('rsk')}): "
              f"thon avg={v['avg'] if v else '-'} min={v['min'] if v else '-'}; "
              f"san luyen avg={t['avg'] if t else '-'} "
              f"min={t['min'] if t else '-'}")
    print(f"Loi console/pageerror: {len(errors)}")
    for msg in errors:
        print(f"  {msg}")

    lines = ["# M08 — Profile CPU: thủ phạm tụt FPS ở Sân Luyện Kiếm",
             "",
             f"Chạy lúc: {time.strftime('%Y-%m-%d %H:%M:%S %Z')} · "
             f"URL: {args.url} · Playwright Chromium headless trong máy ảo",
             "",
             "## Bối cảnh (M02)",
             "",
             "- Thôn Thanh Thạch Thôn: 60,6 fps; Sân Luyện Kiếm: 21,3 fps "
             "dù CHƯA ĐÁNH (đánh nhau 20,53 fps) — xem `tests/perf.md`.",
             "- Câu hỏi: cái gì trong scene sân luyện (hoặc chế độ luyện "
             "tập) ăn hết khung hình?",
             "",
             "## Phương pháp đo",
             "",
             "- CDP `Profiler` (V8 sampling profiler) qua Playwright "
             "(`page.context.new_cdp_session`, `Profiler.enable/start/stop`): "
             "lấy mẫu ~1ms/lần trong 10 giây ở mỗi nơi.",
             "- self = tổng thời gian mẫu của chính hàm đó; total = tổng "
             "thời gian mẫu của hàm + tất cả hàm con cháu (cộng thời gian "
             "mẫu lên toàn bộ tổ tiên của node được lấy mẫu).",
             "- Gom theo (tên hàm, file, dòng); dòng = "
             "`callFrame.lineNumber + 1` (CDP đếm dòng từ 0). Hàm không "
             "tên ghi `(anonymous)`; khung không thuộc file game ghi "
             "`(native)`.",
             "- Cột ★ = hàm có trong `ops/OVERRIDES.md` (hàm bị vá chồng, "
             "Claude đang gộp ở T07/T08/T09).",
             "- `Math.random` seed cố định 20261121 (giống test_suite) để "
             "lần chạy tái lập được.",
             "- FPS đo bằng vòng `requestAnimationFrame` đếm khung hình "
             "(`window.__fps.buckets`), giống `tools/perf.py`.",
             "",
             "## Giới hạn",
             "",
             "- Đo trên máy ảo chia sẻ CPU/RAM, headless Chromium — số "
             "tuyệt đối chỉ có ý nghĩa so sánh tương đối trong cùng môi "
             "trường, không phải trên máy người chơi.",
             "- Profiler lấy mẫu ~1kHz nên hàm chạy <1ms có thể không "
             "xuất hiện; hàm ngắn nhưng gọi rất nhiều lần vẫn hiện qua "
             "tổng số mẫu.",
             "- Bản thân profiler và vòng đếm rAF thêm một ít tải; số "
             "profile ở hai nơi đo cùng một cách nên vẫn so sánh được.",
             "- Headless Chromium chạy rAF theo vsync ảo (~60Hz) nên trần "
             "FPS khoảng 60.",
             "- Ở 1920×1080, tỉ lệ hiển thị 1920/1280 = 1,5 nên RS.k = 1,5 "
             "ở cả Cân bằng và Cao (Cao chỉ nâng giới hạn lên 2); muốn "
             "k = 2 cần viewport rộng ≥ 2560. Khác nhau giữa Cân bằng và "
             "Cao ở đây là maxParticles [78/116] và maxEvents [22/26] "
             "(xem `v41ApplyQuality` ở `src/31_v41_v8.js:6`).",
             "",
             "## 1. Profile CPU 10 giây (1280×720, Đồ họa Cân bằng)",
             ""]
    for r in profiles:
        lines += [f"### {r['label']}",
                  "",
                  f"- Tổng thời gian profile: {r['total_ms']}ms "
                  f"({r['samples']} mẫu, {r['seconds']}s).",
                  "",
                  "| # | Hàm | File:dòng | Self (ms) | Self % | Total (ms) | "
                  "Total % | ★ |",
                  "|---|---|---|---|---|---|---|---|"]
        top_self = sorted(r["rows"], key=lambda x: -x["self_ms"])[:15]
        for i, row in enumerate(top_self, 1):
            lines.append(
                f"| {i} | `{row['name']}` | `{row['file']}:{row['line']}` | "
                f"{row['self_ms']} | {row['self_pct']}% | "
                f"{row['total_ms']} | {row['total_pct']}% | "
                f"{'★' if row['override'] else ''} |")
        lines += ["",
                  "**Top 15 theo total:**",
                  "",
                  "| # | Hàm | File:dòng | Total (ms) | Total % | Self (ms) | "
                  "Self % | ★ |",
                  "|---|---|---|---|---|---|---|"]
        top_total = sorted(r["rows"], key=lambda x: -x["total_ms"])[:15]
        for i, row in enumerate(top_total, 1):
            lines.append(
                f"| {i} | `{row['name']}` | `{row['file']}:{row['line']}` | "
                f"{row['total_ms']} | {row['total_pct']}% | "
                f"{row['self_ms']} | {row['self_pct']}% | "
                f"{'★' if row['override'] else ''} |")
        lines.append("")
    lines += ["## 2. FPS ở 1920×1080 (Đồ họa Cân bằng / Cao)",
              "",
              "| Cài đặt | RS.k thực tế | Thôn (avg/min/max) | "
              "Sân luyện, không đánh (avg/min/max) |",
              "|---|---|---|---|"]
    for r in fps_runs:
        v = r.get("village") or {}
        t = r.get("training") or {}
        lines.append(
            f"| {r['name']} (q={r['quality']}) | {r.get('rsk')} | "
            f"{v.get('avg', '-')} / {v.get('min', '-')} / "
            f"{v.get('max', '-')} | "
            f"{t.get('avg', '-')} / {t.get('min', '-')} / "
            f"{t.get('max', '-')} |")
    lines += ["",
              "So sánh với M02 (1280×720, Cân bằng): thôn 60,6 fps, "
              "sân luyện không đánh 21,3 fps.",
              "",
              "Chi tiết bucket/giây:"]
    for r in fps_runs:
        for key in ("village", "training"):
            d = r.get(key)
            if d:
                lines.append(f"- {r['name']} {d['label']}: {d['buckets']}")
    lines += ["",
              f"**Lỗi console/pageerror: {len(errors)}**"]
    for msg in errors:
        lines.append(f"- {msg}")
    lines += ["",
              "## 3. Kết luận (để Claude dùng cho T08)",
              ""]
    # Tu dong tom tat: ham self cao nhat o san luyen so voi thon.
    if len(profiles) == 2:
        vil = { (r["name"], r["file"], r["line"]): r
                for r in profiles[0]["rows"] }
        tr = profiles[1]["rows"]
        top_tr = sorted(tr, key=lambda x: -x["self_ms"])[:5]
        lines.append("Top 5 self ở sân luyện (kèm self cùng hàm ở thôn):")
        lines.append("")
        for row in top_tr:
            v = vil.get((row["name"], row["file"], row["line"]))
            vself = v["self_ms"] if v else 0
            lines.append(
                f"- `{row['name']}` `{row['file']}:{row['line']}`: "
                f"sân luyện self {row['self_ms']}ms "
                f"({row['self_pct']}%), thôn self {vself}ms"
                f"{' ★ OVERRIDES' if row['override'] else ''}.")
        lines.append("")
    lines.append("(Kết luận bằng tay — xem bảng trên; điền sau khi đọc "
                 "số liệu.)")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Báo cáo: tests/perf_profile.md")
    if errors:
        ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
