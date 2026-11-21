"""Bo kiem thu tu dong cho game Van Dao Tu Tien (M01).

Chay bang Playwright Chromium headless ngay trong may ao, cua so 1280x720:
    python3 tools/test_suite.py [--compare]
    python3 tools/test_suite.py --compare   # so anh voi tests/baseline/

Can chay san server o thu muc goc repo truoc khi chay:
    python3 -m http.server 8123 --bind 127.0.0.1

8 kich ban:
  (1) menu, (2) tao nhan vat 3 phai, (3) vao thon, (4) di 4 huong,
  (5) mo ban do phim M, (6) tui do phim I, (7) nhat ky phim Q,
  (8) luu -> tai lai trang -> Tiep tuc.
Moi kich ban chup anh vao tests/out/, ghi loi console/pageerror,
cuoi cung in bang DAT/LOI va ghi tests/out/report.md.
Lan chay dau (chua co tests/baseline/): copy tests/out/ thanh baseline
va ghi ro trong bao cao.

Tieu chi DAT dua tren bang chung quan sat duoc trong trang (trang thai
mode/menuPage/modal, vi tri V47T, p.cls/level/playerId, localStorage),
khong ghi DAT gia. Neu game loi that thi ghi LOI kem bang chung.

Ghi chu ve duong live da khao sat (khong sua code game):
- Menu that dang chay: v42pHome/v42pCreate (src/40_audio.js, ghi de
  o src/47_v45_v35.js); the phai o (78+i*181, 304, 169, 205),
  nut "Nhap the" (78,525,350,52); neu da co save thi click "Nhap the"
  lan 1 chi bat xac nhan, can click lan 2 moi tao moi.
- Thon that dang chay: scene V47T (src/48_v48_v47.js, v47tUpdate);
  vi tri nhan vat o V47T.x/y, spawn (672,1626). Di chuyen WASD theo
  hanh lang V471 (v47tBlocked): duong thang co the bi chan som, nen
  kich ban (4) danh gia tong do dich chuyen chu khong doi moi huong
  deu di du 200px.
- Phim I mo panel tui do hop nhat, modal.kind='gear' (wrapper
  openPanel o src/13_v21_v18.js:47 ep ca 'inventory' ve 'gear',
  ve bang v21Inventory "LINH BAO - TUI TRANG BI"). Phim M mo
  modal.kind='map', phim Q mo modal.kind='journal8' (v12Open).
- Luu: SAVE='vdtt_vangioi_v3' trong localStorage; v47tUpdate tu luu
  moi 6 giay; resume khoi phuc vi tri qua p.v47TownPos.
"""
import argparse
import hashlib
import json
import math
import shutil
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tests" / "out"
BASELINE = ROOT / "tests" / "baseline"
URL = "http://localhost:8123/index.html"
VIEWPORT = {"width": 1280, "height": 720}

CLASSES = [
    {"id": "sword", "name": "Kiếm Tu", "tech": "sword"},
    {"id": "body", "name": "Thể Tu", "tech": "body"},
    {"id": "spell", "name": "Pháp Tu", "tech": "water"},
]

STATE_JS = """() => {
  const st = {mode, menuPage: (typeof V8 !== 'undefined' ? V8.menuPage : null),
    select: (typeof V8 !== 'undefined' ? V8.select : null),
    cls: p?.cls ?? null, level: p?.level ?? null, xp: p?.xp ?? null,
    stones: p?.stones ?? null, pills: p?.pills ?? null,
    playerId: p?.playerId ?? null,
    techs: p ? [...p.techs] : null,
    mapId: p?.mapId ?? null, worldMode: !!p?.worldMode,
    px: p ? Math.round(p.x) : null, py: p ? Math.round(p.y) : null,
    v47t: (typeof V47T !== 'undefined' && V47T.active)
      ? {x: Math.round(V47T.x), y: Math.round(V47T.y)} : null,
    modal: modal?.kind ?? null,
    canResume: (typeof canResume === 'function') ? canResume() : null,
    buttons: (typeof buttons !== 'undefined' ? buttons.length : null),
    saveLen: (localStorage.getItem('vdtt_vangioi_v3') || '').length};
  return st;
}"""


class Suite:
    def __init__(self, page):
        self.page = page
        self.errors = []  # (scenario, message)
        self.current = "-"
        self.results = []  # (id, name, ok, evidence, shot)

    def state(self):
        return self.page.evaluate(STATE_JS)

    def shot(self, name):
        path = OUT / name
        self.page.screenshot(path=str(path))
        return name

    def wait_state(self, pred, timeout=8.0, poll=0.25):
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

    def record(self, sid, name, ok, evidence, shot_name=""):
        self.results.append((sid, name, ok, evidence, shot_name))
        print(f"[{'ĐẠT' if ok else 'LỖI'}] {sid} {name}: {evidence}")

    # -- helpers ---------------------------------------------------------
    def goto_menu(self):
        self.page.goto(URL, wait_until="load", timeout=60000)
        self.page.wait_for_timeout(3000)
        return self.wait_state(lambda s: s["mode"] == "menu", timeout=10)

    def go_to_create(self):
        """Tu menu home -> man tao nhan vat. Tra ve True neu toi create."""
        st = self.state()
        if st["mode"] != "menu":
            self.goto_menu()
            st = self.state()
        if st["menuPage"] == "create":
            return True
        # Co save: nut "Tao nhan vat moi" (78,383,374,43); chua co save:
        # nut "Bat dau hanh trinh" (78,312,374,61) cung dan toi create.
        x, y = (265, 404) if st["canResume"] else (265, 342)
        self.page.mouse.click(x, y)
        st = self.wait_state(lambda s: s["menuPage"] == "create", timeout=5)
        return st["menuPage"] == "create"

    def enter_world(self, cls_index):
        """Click 'Nhap the' (co the can 2 lan neu da co save de xac nhan).
        Tra ve state sau khi cho vao play."""
        self.page.mouse.click(253, 551)
        self.page.wait_for_timeout(600)
        st = self.state()
        if st["menuPage"] == "create":  # lan 1 chi bat xac nhan tao moi
            self.page.mouse.click(253, 551)
        return self.wait_state(
            lambda s: s["mode"] == "play" and s["cls"] == cls_index, timeout=10
        )

    def close_modal(self):
        self.page.keyboard.press("Escape")
        return self.wait_state(lambda s: s["modal"] is None, timeout=3)

    # -- scenarios -------------------------------------------------------
    def sc01_menu(self):
        self.current = "01"
        st = self.goto_menu()
        shot = self.shot("01_menu.png")
        ok = (
            st["mode"] == "menu"
            and st["menuPage"] == "home"
            and (st["buttons"] or 0) > 0
        )
        self.record(
            "01", "menu",
            ok,
            f"mode={st['mode']} menuPage={st['menuPage']} "
            f"buttons={st['buttons']} canResume={st['canResume']}",
            shot,
        )

    def sc02_create_three_classes(self):
        self.current = "02"
        details = []
        all_ok = True
        for i, c in enumerate(CLASSES):
            if not self.go_to_create():
                details.append(f"{c['name']}: KHONG vao duoc man tao nhan vat")
                all_ok = False
                continue
            cx, cy = 78 + i * 181 + 84, 304 + 102
            self.page.mouse.click(cx, cy)
            self.page.wait_for_timeout(400)
            st = self.state()
            selected_ok = st["select"] == i
            self.shot(f"02_create_cls{i}_{c['id']}.png")
            st = self.enter_world(i)
            entered_ok = (
                st["mode"] == "play"
                and st["cls"] == i
                and c["tech"] in (st["techs"] or [])
            )
            self.shot(f"02_enter_cls{i}_{c['id']}.png")
            ok_i = selected_ok and entered_ok
            all_ok = all_ok and ok_i
            details.append(
                f"{c['name']}: select={st['select']} "
                f"cls={st['cls']} techs={st['techs']} mode={st['mode']} "
                f"mapId={st['mapId']} -> {'ok' if ok_i else 'LOI'}"
            )
            if i < 2:
                # Ve menu de tao phai tiep theo (save van con trong
                # cung browser context).
                self.goto_menu()
        self.record("02", "tạo nhân vật 3 phái", all_ok, "; ".join(details),
                    "02_enter_cls2_spell.png")

    def sc03_enter_village(self):
        self.current = "03"
        st = self.state()
        shot = self.shot("03_thon.png")
        ok = (
            st["mode"] == "play"
            and st["mapId"] == "thon"
            and st["worldMode"]
            and st["v47t"] is not None
        )
        self.record(
            "03", "vào thôn",
            ok,
            f"mode={st['mode']} mapId={st['mapId']} worldMode={st['worldMode']} "
            f"V47T={st['v47t']} p=({st['px']},{st['py']})",
            shot,
        )

    def sc04_move_four_directions(self):
        self.current = "04"
        moves = []
        total = 0
        big = 0
        for name, key in [("W", "KeyW"), ("S", "KeyS"),
                          ("A", "KeyA"), ("D", "KeyD")]:
            before = self.state()["v47t"]
            self.page.keyboard.down(key)
            self.page.wait_for_timeout(900)
            self.page.keyboard.up(key)
            self.page.wait_for_timeout(300)
            after = self.state()["v47t"]
            if before is None or after is None:
                moves.append(f"{name}: khong co vi tri V47T")
                continue
            dx, dy = after["x"] - before["x"], after["y"] - before["y"]
            d = abs(dx) + abs(dy)
            total += d
            big += 1 if d >= 50 else 0
            moves.append(f"{name}: ({before['x']},{before['y']})->"
                         f"({after['x']},{after['y']}) dx={dx} dy={dy}")
        shot = self.shot("04_move.png")
        # Hanh lang V471 chan duong thang (v47tBlocked): khong doi moi
        # huong deu di xa tu mot diem. DAT khi tong dich chuyen lon va
        # it nhat 2 huong di >=50px, khong loi console.
        ok = total >= 200 and big >= 2
        self.record(
            "04", "đi 4 hướng (WASD, mỗi hướng giữ 0,9s)",
            ok,
            f"tổng |d|={total}px, huong >=50px: {big}/4; " + "; ".join(moves),
            shot,
        )

    def _panel(self, sid, name, key, expect, shot_name, note=""):
        self.current = sid
        self.page.keyboard.press(key)
        st = self.wait_state(
            lambda s: s["modal"] is not None, timeout=3)
        opened = st["modal"]
        shot = self.shot(shot_name)
        ok_open = opened in expect
        st2 = self.close_modal()
        ok_close = st2["modal"] is None
        ok = ok_open and ok_close
        ev = f"phim {key}: modal={opened} (mong doi {sorted(expect)})" + (
            f"; dong bang ESC: modal={st2['modal']}" if not ok_close else "")
        if note:
            ev += f"; {note}"
        self.record(sid, name, ok, ev, shot)
        return ok

    def sc05_map(self):
        self._panel("05", "mở bản đồ phím M", "m", {"map"}, "05_map.png")

    def sc06_inventory(self):
        # Live: I mo panel hop nhat, modal.kind='gear' (wrapper openPanel
        # o src/13_v21_v18.js:47), ve bang v21Inventory.
        self._panel("06", "túi đồ phím I", "i", {"gear", "inventory"},
                    "06_inventory.png",
                    note="live: modal='gear' (tui do hop nhat, "
                    "v21Inventory 'LINH BAO - TUI TRANG BI')")

    def sc07_journal(self):
        self._panel("07", "nhật ký phím Q", "q", {"journal8"},
                    "07_journal.png")

    def sc08_save_reload_continue(self):
        self.current = "08"
        before = self.state()
        # Cho autosave cua v47tUpdate (moi 6 giay) ghi save moi nhat.
        self.page.wait_for_timeout(7000)
        raw = self.page.evaluate(
            "() => localStorage.getItem('vdtt_vangioi_v3') || ''")
        saved_ok = False
        saved_pos = None
        try:
            data = json.loads(raw)
            sp = data.get("p", {})
            saved_ok = (
                sp.get("playerId") == before["playerId"]
                and sp.get("cls") == before["cls"]
                and sp.get("level") == before["level"]
            )
            saved_pos = sp.get("v47TownPos") or {
                "x": before["v47t"]["x"], "y": before["v47t"]["y"]}
        except Exception as e:
            saved_pos = None
            raw = f"<khong doc duoc save: {e}>"
        self.page.reload(wait_until="load", timeout=60000)
        self.page.wait_for_timeout(3000)
        st = self.state()
        shot = self.shot("08_menu_after_reload.png")
        menu_ok = (
            st["mode"] == "menu" and st["menuPage"] == "home"
            and st["canResume"])
        if not menu_ok:
            self.record("08", "lưu → tải lại → Tiếp tục", False,
                        f"sau reload: mode={st['mode']} "
                        f"menuPage={st['menuPage']} canResume={st['canResume']} "
                        f"save_len={len(raw)} saved_ok={saved_ok}", shot)
            return
        # Nut "Tiep tuc hanh trinh" o menu home (78,312,374,61).
        self.page.mouse.click(265, 342)
        st = self.wait_state(lambda s: s["mode"] == "play", timeout=10)
        shot2 = self.shot("08_resumed.png")
        resumed = st["v47t"]
        dist = None
        if resumed and saved_pos:
            dist = math.hypot(resumed["x"] - saved_pos["x"],
                              resumed["y"] - saved_pos["y"])
        ok = (
            saved_ok and menu_ok and st["mode"] == "play"
            and st["playerId"] == before["playerId"]
            and st["cls"] == before["cls"]
            and st["level"] == before["level"]
            and dist is not None and dist <= 80
        )
        self.record(
            "08", "lưu → tải lại → Tiếp tục", ok,
            f"truoc: cls={before['cls']} lv={before['level']} "
            f"V47T={before['v47t']} save_len={len(raw)} saved_ok={saved_ok}; "
            f"sau resume: cls={st['cls']} lv={st['level']} "
            f"playerId_khop={st['playerId'] == before['playerId']} "
            f"V47T={resumed} lech_vi_tri={dist if dist is None else round(dist, 1)}px",
            shot2,
        )


def compare_images():
    """So tests/out/ voi tests/baseline/ (md5 + ti le pixel lech neu co PIL).
    Tra ve (baseline_created, [(ten, ket_qua, chi_tiet), ...])."""
    if not BASELINE.exists():
        shutil.copytree(OUT, BASELINE)
        return True, []
    try:
        from PIL import Image, ImageChops
        have_pil = True
    except Exception:
        have_pil = False
    rows = []
    for path in sorted(OUT.glob("*.png")):
        base = BASELINE / path.name
        if not base.exists():
            rows.append((path.name, "MỚI", "chưa có trong baseline"))
            continue
        same_md5 = (hashlib.md5(path.read_bytes()).hexdigest()
                    == hashlib.md5(base.read_bytes()).hexdigest())
        if same_md5:
            rows.append((path.name, "GIỐNG", "md5 khớp"))
            continue
        detail = "md5 khác"
        if have_pil:
            try:
                a = Image.open(path).convert("RGB")
                b = Image.open(base).convert("RGB")
                if a.size != b.size:
                    detail = f"kích thước khác {b.size} -> {a.size}"
                else:
                    import numpy as np  # noqa: F401  (chi khi co san)
                    raise ImportError
            except ImportError:
                try:
                    a = Image.open(path).convert("L")
                    b = Image.open(base).convert("L")
                    diff = ImageChops.difference(a, b)
                    hist = diff.histogram()
                    total = sum(hist)
                    mean = sum(i * n for i, n in enumerate(hist)) / max(total, 1)
                    detail = f"độ lệch pixel trung bình {mean:.2f}/255"
                except Exception:
                    pass
            except Exception:
                pass
        rows.append((path.name, "KHÁC", detail))
    return False, rows


def main():
    ap = argparse.ArgumentParser(description="M01: bo kiem thu tu dong")
    ap.add_argument("--compare", action="store_true",
                    help="so anh tests/out/ voi tests/baseline/")
    ap.add_argument("--url", default=URL)
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    suite_holder = {}

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport=VIEWPORT)
        suite = Suite(page)
        suite_holder["suite"] = suite

        def on_error(e):
            suite.errors.append((suite.current, f"pageerror: {e}"))

        def on_console(m):
            if m.type == "error":
                suite.errors.append((suite.current, f"console.error: {m.text}"))

        page.on("pageerror", on_error)
        page.on("console", on_console)

        try:
            suite.sc01_menu()
            suite.sc02_create_three_classes()
            suite.sc03_enter_village()
            suite.sc04_move_four_directions()
            suite.sc05_map()
            suite.sc06_inventory()
            suite.sc07_journal()
            suite.sc08_save_reload_continue()
        finally:
            browser.close()

    passed = sum(1 for r in suite.results if r[2])
    total = len(suite.results)
    print()
    print("=== M01: BANG KET QUA ===")
    print(f"{'ID':<4} {'Kich ban':<42} {'Ket qua':<6} Bang chung")
    for sid, name, ok, ev, shot in suite.results:
        print(f"{sid:<4} {name:<42} {'ĐẠT' if ok else 'LỖI':<6} {ev}"
              + (f" [{shot}]" if shot else ""))
    print(f"Tổng: {passed}/{total} ĐẠT")
    print(f"Lỗi console/pageerror: {len(suite.errors)}")
    for sc, msg in suite.errors:
        print(f"  [{sc}] {msg}")

    baseline_created, cmp_rows = (False, [])
    if args.compare:
        baseline_created, cmp_rows = compare_images()
        print()
        if baseline_created:
            print("COMPARE: chưa có tests/baseline/ -> đã copy tests/out/ "
                  "thành baseline (lần chạy đầu, chưa so được).")
        else:
            print("=== COMPARE vs tests/baseline/ ===")
            for name, res, detail in cmp_rows:
                print(f"  {name}: {res} ({detail})")

    # Bao cao markdown.
    lines = ["# M01 — Báo cáo kiểm thử tự động",
             "",
             f"Chạy lúc: {time.strftime('%Y-%m-%d %H:%M:%S %Z')} · "
             f"URL: {args.url} · cửa sổ 1280x720 · Playwright Chromium headless",
             "",
             "| ID | Kịch bản | Kết quả | Bằng chứng | Ảnh |",
             "|----|----------|---------|------------|-----|"]
    for sid, name, ok, ev, shot in suite.results:
        lines.append(f"| {sid} | {name} | {'ĐẠT' if ok else 'LỖI'} | {ev} | {shot} |")
    lines += ["", f"**Tổng: {passed}/{total} ĐẠT**",
              "", f"**Lỗi console/pageerror: {len(suite.errors)}**"]
    for sc, msg in suite.errors:
        lines.append(f"- [{sc}] {msg}")
    if args.compare:
        lines.append("")
        if baseline_created:
            lines.append("**Compare:** lần chạy đầu — đã copy `tests/out/` "
                         "thành `tests/baseline/`, chưa có gì để so.")
        else:
            lines.append("**Compare vs tests/baseline/:**")
            for name, res, detail in cmp_rows:
                lines.append(f"- {name}: {res} ({detail})")
    (OUT / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Báo cáo: tests/out/report.md")
    if args.compare and baseline_created:
        print("Baseline mới: tests/baseline/")
    return 0 if passed == total and not suite.errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
