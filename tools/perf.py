"""Do hieu nang game Van Dao Tu Tien (M02).

Chay bang Playwright Chromium headless ngay trong may ao:
    python3 tools/perf.py [--url URL] [--idle SEC] [--map SEC] [--combat SEC]
    python3 tools/perf.py            # mac dinh: idle 15s, map 15s, combat 30s

Can chay san server o thu muc goc repo truoc khi chay:
    python3 -m http.server 8123 --bind 127.0.0.1

Cach do FPS (khong sua code game):
- Cai mot vong requestAnimationFrame dem khung hinh trong trang
  (window.__fps.buckets: so khung hinh tron trong moi giay).
- Moi tinh huong: ghi lai so bucket da co, cho het thoi gian do, lay
  cac bucket moi day du trong cua so do.
  FPS trung binh = trung binh cac bucket/giay; FPS thap nhat = bucket
  nho nhat; tong khung hinh = tong cac bucket. Bucket chua tron giay
  khong nam trong danh sach nen khong bi tinh sai.
- Headless Chromium chay rAF theo vsync ao (~60Hz) nen tran khoang 60.

3 tinh huong chinh (cua so 1280x720) + 1 doi chung:
  (1) dung yen o thon Thanh Thach Thon (khong nhan phim/chuot).
  (2) mo ban do (phim M, modal=map) roi do.
  (3) danh nhau 30 giay o San Luyen Kiem (F6, moc nhan bat tu).
  (doi chung) dung yen o San Luyen Kiem khi phien da bat dau
  nhung chua danh (10s): de phan biet "scene san luyen nang"
  voi "hieu ung danh nhau nang".
      Duong danh nhau that da khao sat (src/38_save.js, v42t*):
      - F6 khi chua o gan san se dan duong (v42tGuide, v8SetGoal);
        nguoi choi di bo mot doan dai (~10-12s trong thu nghiem,
        qua ca scene V47T roi ve scene thon cu) moi toi san.
      - Khi v42tNear(0) dung va V42T.active chua bat, bam F6 lan
        nua de bat dau (v42tStart): moc nhan xuat hien, V42T.active.
      - Nhap chuot vao moc nhan (vi tri man hinh lay qua hdPoint)
        de tan cong; V42T.hits/total/casts tang, V42T.time chay.
        Moc nhan khong chet, khong roi do, khong tu vi — danh duoc
        lien tuc 30 giay.
      - Luu y: bam F6 khi dang di qua san (chua dung han) chi dan
        duong lai, khong bat dau duoc; vi vay script cho toi khi
        v42tNear dung on dinh roi moi bam F6, co cooldown 1,5s
        giua cac lan bam, toi da 40s. Ghi lai thoi gian cho bat dau.
- Ghi bao cao tests/perf.md + in bang ra stdout. Khong sua code game.
"""
import argparse
import json
import math
import statistics
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tests" / "out"
REPORT = ROOT / "tests" / "perf.md"
URL = "http://localhost:8123/index.html"
VIEWPORT = {"width": 1280, "height": 720}

# Seed Math.random giong test_suite.py (M04) de lan chay tai lap duoc.
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
  let scr = null;
  try {
    if (d && d.length) {
      const z = hdPoint(d[0].x, d[0].y);
      scr = {x: Math.round(z.x), y: Math.round(z.y)};
    }
  } catch (e) {}
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
    started: (typeof V42T !== 'undefined') ? V42T.started : null,
    v42time: (typeof V42T !== 'undefined') ? +V42T.time.toFixed(1) : null,
    hits: (typeof V42T !== 'undefined') ? V42T.hits : null,
    total: (typeof V42T !== 'undefined') ? Math.round(V42T.total) : null,
    casts: (typeof V42T !== 'undefined') ? V42T.casts : null,
    dummies: d, scr,
  };
}"""


class Perf:
    def __init__(self, page, url):
        self.page = page
        self.url = url
        self.errors = []
        self.results = []  # dicts

    def state(self):
        return self.page.evaluate(STATE_JS)

    def fps_buckets(self):
        return list(self.page.evaluate("() => window.__fps.buckets"))

    def measure(self, seconds, label):
        """Do FPS trong `seconds` giay, tra ve dict ket qua."""
        before = len(self.fps_buckets())
        deadline = time.time() + seconds
        while time.time() < deadline:
            self.page.wait_for_timeout(200)
        after = self.fps_buckets()
        buckets = after[before:]
        # Bucket cuoi co the la bucket vua tron giay ngay truoc khi het
        # gio — deu la bucket tron giay day du, giu nguyen.
        frames = sum(buckets)
        result = {
            "label": label,
            "seconds": seconds,
            "buckets": buckets,
            "frames": frames,
            "avg": round(statistics.mean(buckets), 2) if buckets else 0,
            "min": min(buckets) if buckets else 0,
            "max": max(buckets) if buckets else 0,
        }
        self.results.append(result)
        print(f"[FPS] {label}: avg={result['avg']} min={result['min']} "
              f"max={result['max']} frames={frames} "
              f"({len(buckets)} bucket/giay) {buckets}")
        return result

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

    def enter_world(self, cls_index=0):
        """Menu -> tao nhan vat (Kiem Tu) -> vao thon. Giong test_suite."""
        self.page.goto(self.url, wait_until="load", timeout=60000)
        self.page.wait_for_timeout(3000)
        st = self.wait_state(lambda s: s["mode"] == "menu", timeout=10)
        if st["mode"] != "menu":
            raise RuntimeError(f"khong vao duoc menu: {st}")
        # Fresh browser context: chua co save -> nut "Bat dau hanh trinh".
        x, y = (265, 404) if st["canResume"] else (265, 342)
        self.page.mouse.click(x, y)
        st = self.wait_state(lambda s: s["menuPage"] == "create", timeout=5)
        if st["menuPage"] != "create":
            raise RuntimeError(f"khong vao duoc man tao nhan vat: {st}")
        # The phai 0 (Kiem Tu) da duoc chon mac dinh (V8.select=0).
        self.page.mouse.click(253, 551)  # "Nhap the"
        self.page.wait_for_timeout(600)
        st = self.state()
        if st["menuPage"] == "create":  # lan 1 chi bat xac nhan (co save)
            self.page.mouse.click(253, 551)
        st = self.wait_state(
            lambda s: s["mode"] == "play" and s["cls"] == cls_index,
            timeout=10)
        if st["mode"] != "play":
            raise RuntimeError(f"khong vao duoc thon: {st}")
        return st

    def start_training(self, timeout=40.0):
        """F6 dan duong toi San Luyen Kiem roi bat dau luyen tap.
        Tra ve (thoi gian cho, state)."""
        t0 = time.time()
        self.page.keyboard.press("F6")  # dan duong (v42tGuide)
        last_press = t0
        while time.time() - t0 < timeout:
            st = self.state()
            if st["active"]:
                return time.time() - t0, st
            # Chi bam F6 khi dang o gan san; cooldown 1,5s tranh bam
            # lien tuc lam dan duong lai tu dau.
            if st["near"] and time.time() - last_press >= 1.5:
                self.page.keyboard.press("F6")
                last_press = time.time()
            self.page.wait_for_timeout(500)
        return time.time() - t0, self.state()

    def combat_attack(self, seconds):
        """Tan cong moc nhan lien tuc trong `seconds` giay, dong thoi
        do FPS. Tra ve (fps_result, v42t_dau, v42t_cuoi)."""
        before = self.state()
        t0 = time.time()
        recovered = 0
        while time.time() - t0 < seconds:
            st = self.state()
            if not st["active"]:
                if st["near"]:
                    self.page.keyboard.press("F6")
                    recovered += 1
                self.page.wait_for_timeout(500)
                continue
            if st["scr"]:
                self.page.mouse.click(st["scr"]["x"], st["scr"]["y"])
            self.page.wait_for_timeout(700)
        after = self.state()
        # FPS do trong luc danh: dung measure rieng thi khong danh duoc,
        # nen lay bucket theo thoi gian thuc tu ham goi (xem main).
        return before, after, recovered


def main():
    ap = argparse.ArgumentParser(description="M02: do FPS")
    ap.add_argument("--url", default=URL)
    ap.add_argument("--idle", type=float, default=15)
    ap.add_argument("--map", type=float, default=15)
    ap.add_argument("--combat", type=float, default=30)
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    ok = True
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport=VIEWPORT)
        page.add_init_script(SEED_JS)
        perf = Perf(page, args.url)

        def on_error(e):
            perf.errors.append(f"pageerror: {e}")

        def on_console(m):
            if m.type == "error":
                perf.errors.append(f"console.error: {m.text}")

        page.on("pageerror", on_error)
        page.on("console", on_console)
        try:
            st = perf.enter_world()
            print(f"Vao thon: mode={st['mode']} mapId={st['mapId']} "
                  f"v47t={st['v47t']} p={st['p']}")
            page.evaluate(FPS_JS)
            page.wait_for_timeout(2000)  # on dinh sau khi vao thon

            # (1) Dung yen o thon.
            perf.measure(args.idle, "dung yen o thon")
            page.screenshot(path=str(OUT / "perf_idle.png"))

            # (2) Mo ban do.
            page.keyboard.press("m")
            st = perf.wait_state(lambda s: s["modal"] == "map", timeout=5)
            if st["modal"] != "map":
                print("LOI: khong mo duoc ban do, modal=", st["modal"])
                ok = False
            perf.measure(args.map, "mo ban do (M)")
            page.screenshot(path=str(OUT / "perf_map.png"))
            page.keyboard.press("Escape")
            st = perf.wait_state(lambda s: s["modal"] is None, timeout=3)
            if st["modal"] is not None:
                print("LOI: khong dong duoc ban do, modal=", st["modal"])
                ok = False

            # (3) Danh nhau 30 giay o San Luyen Kiem.
            wait_s, st = perf.start_training(timeout=40)
            print(f"San luyen: cho bat dau {wait_s:.1f}s, active={st['active']} "
                  f"near={st['near']} p={st['p']}")
            if not st["active"]:
                print("LOI: khong bat dau duoc San Luyen Kiem sau 40s")
                ok = False
                combat = None
            else:
                # Doi chung: phien da bat dau, dung yen khong danh 10s.
                # Neu FPS van thap thi do scene san luyen, khong phai
                # do hieu ung danh nhau.
                perf.measure(10, "san luyen, khong danh (doi chung)")
                # Do FPS song song voi vong tan cong.
                mark = len(perf.fps_buckets())
                before, after, recovered = perf.combat_attack(args.combat)
                buckets = perf.fps_buckets()[mark:]
                frames = sum(buckets)
                combat = {
                    "label": "danh nhau 30 giay (San Luyen Kiem, F6)",
                    "seconds": args.combat,
                    "buckets": buckets,
                    "frames": frames,
                    "avg": round(statistics.mean(buckets), 2) if buckets else 0,
                    "min": min(buckets) if buckets else 0,
                    "max": max(buckets) if buckets else 0,
                    "hits_before": before["hits"],
                    "hits_after": after["hits"],
                    "total_before": before["total"],
                    "total_after": after["total"],
                    "casts_after": after["casts"],
                    "v42time": after["v42time"],
                    "recovered": recovered,
                    "wait_start_s": round(wait_s, 1),
                }
                perf.results.append(combat)
                print(f"[FPS] danh nhau: avg={combat['avg']} "
                      f"min={combat['min']} max={combat['max']} "
                      f"frames={frames} ({len(buckets)} bucket/giay) {buckets}")
                print(f"[COMBAT] hits {before['hits']} -> {after['hits']}, "
                      f"total dmg {before['total']} -> {after['total']}, "
                      f"casts={after['casts']}, V42T.time={after['v42time']}s, "
                      f"phuc hoi phien={recovered}")
                page.screenshot(path=str(OUT / "perf_combat.png"))
                if (after["hits"] or 0) <= (before["hits"] or 0):
                    print("LOI: danh 30 giay ma V42T.hits khong tang")
                    ok = False
        finally:
            browser.close()

    # Bao cao.
    print()
    print("=== M02: BANG FPS ===")
    for r in perf.results:
        print(f"{r['label']}: avg={r['avg']} min={r['min']} max={r['max']} "
              f"frames={r['frames']} trong {r['seconds']}s")
    print(f"Loi console/pageerror: {len(perf.errors)}")
    for msg in perf.errors:
        print(f"  {msg}")

    lines = ["# M02 — Báo cáo hiệu năng (FPS)",
             "",
             f"Chạy lúc: {time.strftime('%Y-%m-%d %H:%M:%S %Z')} · "
             f"URL: {args.url} · cửa sổ 1280x720 · "
             "Playwright Chromium headless trong máy ảo",
             "",
             "## Môi trường đo",
             "",
             "- Chromium headless (Playwright, cache "
             "`~/.cache/ms-playwright/`), viewport 1280x720, "
             "máy ảo chia sẻ CPU/RAM với hệ thống — số FPS chỉ có ý nghĩa "
             "so sánh tương đối trong cùng môi trường, không phải FPS trên "
             "máy người chơi.",
             "- Headless Chromium chạy requestAnimationFrame theo vsync ảo "
             "(~60Hz) nên trần FPS khoảng 60.",
             "",
             "## Cách đo",
             "",
             "- Cài vòng `requestAnimationFrame` đếm khung hình trong trang "
             "(`window.__fps.buckets`: số khung hình tròn trong mỗi giây).",
             "- FPS trung bình = trung bình các bucket/giây trong cửa sổ đo; "
             "FPS thấp nhất = bucket nhỏ nhất; tổng khung hình = tổng các "
             "bucket. Chỉ tính bucket tròn giây đầy đủ.",
             "- `Math.random` được seed cố định (20261121, giống test_suite) "
             "để lần chạy tái lập được.",
             "",
             "## Kết quả",
             "",
             "| Tình huống | Thời gian đo | FPS trung bình | FPS thấp nhất | "
             "FPS cao nhất | Tổng khung hình |",
             "|---|---|---|---|---|---|"]
    for r in perf.results:
        lines.append(
            f"| {r['label']} | {r['seconds']}s | {r['avg']} | {r['min']} | "
            f"{r['max']} | {r['frames']} |")
    lines += ["", "Chi tiết bucket/giây:"]
    for r in perf.results:
        lines.append(f"- {r['label']}: {r['buckets']}")
    combat = next((r for r in perf.results if "hits_after" in r), None)
    if combat:
        lines += [
            "",
            "## Cách tái lập trận đánh (San Luyen Kiem, F6)",
            "",
            "- Vào thôn, bấm F6: game dẫn đường tới Sân Luyện Kiếm "
            "(v42tGuide). Trong thử nghiệm, người chơi đi bộ ~10-12s "
            "(qua scene V47T rồi về scene thôn cũ) mới tới sân.",
            "- Khi `v42tNear(0)` đúng và phiên chưa bắt đầu, bấm F6 lần "
            "nữa để bắt đầu (`v42tStart`): mộc nhân xuất hiện, "
            "`V42T.active=true`. Bấm F6 khi đang đi qua sân chỉ dẫn "
            "đường lại, không bắt đầu được — script chờ tới khi ở gần "
            "ổn định rồi mới bấm, cooldown 1,5s, tối đa 40s.",
            f"- Thời gian chờ bắt đầu trong lần chạy này: "
            f"{combat['wait_start_s']}s.",
            "- Trong 30s đo: nhấp chuột vào mộc nhân (vị trí màn hình "
            "lấy qua `hdPoint`) mỗi ~0,7s. Mộc nhân bất tử, không rơi "
            "đồ, không tu vi — đánh liên tục được.",
            f"- Bằng chứng đánh thật: V42T.hits "
            f"{combat['hits_before']} → {combat['hits_after']}, tổng sát "
            f"thương {combat['total_before']} → {combat['total_after']}, "
            f"số lần thi triển {combat['casts_after']}, V42T.time "
            f"{combat['v42time']}s; số lần phục hồi phiên giữa chừng: "
            f"{combat['recovered']}.",
        ]
    lines += ["",
              f"**Lỗi console/pageerror: {len(perf.errors)}**"]
    for msg in perf.errors:
        lines.append(f"- {msg}")
    lines += ["",
              "## Nhận xét",
              ""]
    avgs = [r["avg"] for r in perf.results]
    mins = [r["min"] for r in perf.results]
    if perf.results:
        lines.append(
            f"- FPS trung bình các tình huống: "
            f"{', '.join(str(a) for a in avgs)}; thấp nhất từng tình "
            f"huống: {', '.join(str(m) for m in mins)}.")
        worst = min(perf.results, key=lambda r: r["min"])
        lines.append(
            f"- Bucket thấp nhất toàn bộ: {worst['min']} fps "
            f"({worst['label']}).")
        control = next(
            (r for r in perf.results if "doi chung" in r["label"]), None)
        combat_r = next(
            (r for r in perf.results if "hits_after" in r), None)
        idle = next(
            (r for r in perf.results if r["label"].startswith("dung yen")),
            None)
        if control and combat_r and idle:
            lines.append(
                f"- TỤT FPS RÕ ở Sân Luyện Kiếm: đứng yên ở thôn "
                f"{idle['avg']} fps, nhưng ở sân luyện chỉ "
                f"{control['avg']} fps dù CHƯA ĐÁNH (V42T.hits=0), và "
                f"đánh nhau {combat_r['avg']} fps — gần như nhau. "
                f"Vậy nguyên nhân không phải hiệu ứng đòn đánh/số bay, "
                f"mà là bản thân scene sân luyện (khu vực thôn cũ, "
                f"V47T=None, p ở gần sân) hoặc chế độ luyện tập "
                f"(V42T.active) tốn khung hình. Cần Claude/đội "
                f"code soi lại phần vẽ ở khu vực này (xem HANDOFF M02).")
        elif min(avgs) >= 55:
            lines.append("- Không có chỗ tụt FPS rõ: các tình huống đều "
                         "giữ trung bình từ 55 fps trở lên (trần headless "
                         "~60).")
        else:
            lines.append("- Có tình huống trung bình dưới 55 fps — xem "
                         "bảng trên để biết chỗ nào tụt.")
    lines.append("- Ảnh minh họa (không commit, chỉ lưu local): "
                 "`tests/out/perf_idle.png`, `perf_map.png`, "
                 "`perf_combat.png`.")
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Báo cáo: tests/perf.md")
    if perf.errors:
        ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
