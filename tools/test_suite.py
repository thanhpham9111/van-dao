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

M04 — co dinh anh chup de so anh het nhieu (khong sua code game):
- Ngau nhien: page.add_init_script() ghi de Math.random bang RNG
  mulberry32 seed co dinh (SEED=20261121) TRUOC khi trang nap, nen ca
  code game luc nap cung dung RNG da seed. add_init_script ton tai
  qua reload trong cung page (kich ban 08 tai lai trang van dung seed
  cu). Luu y: newSeed() o src/01_core.js con xor voi Date.now() nen
  `seed` the gioi moi lan tao nhan vat van khac nhau theo gio thuc;
  chi Math.random thi co dinh, khong co dinh duoc Date.now (khong
  dong vao Date.now vi playerId/save dung no).
- Gio trong game: p.worldTime la dong ho the gioi — ngay/dem
  (hdSun, owWeather), thoi tiet (v42AtmoWeather, chu ky 70s),
  NPC doi muc tieu (hashOW voi floor(worldTime/5)), hoi sinh quai
  (worldTime+45), boss ready deu theo no. Truoc moi lan chup,
  Suite.shot() dat p.worldTime = WORLD_TIME (145, gia tri owInit
  mac dinh o src/03_v8_v22.js) qua page.evaluate, chi khi p ton tai
  (o menu p co the null -> bo qua, an toan). Dong ho van chay binh
  thuong giua cac lan chup (dt moi khung hinh), chi co dinh tai
  thoi diem chup, nen anh sang/thoi tiet/NPC o cung pha moi lan.
  Gioi han con lai (khong co dinh duoc): dong ho hoat anh menu
  (V41Presentation.clock), animation.t, V42_ATMO.sim (hat bui/vet
  chan chay theo dt), NPC dang di bo, hieu ung mo dan cua tieu de
  (08_resumed), va `seed` theo Date.now nhu tren. Vi vay nguong
  so anh (b) van can de chiu duoc nhieu nho con lai.
- Nguong so anh: chi bao KHAC khi >2% diem anh lech qua 40/255
  (lech = max(|R|,|G|,|B|) giua 2 anh). Khi KHAC thi luu anh khac
  biet tests/out/diff_<ten>.png (diem lech to do). Ca GIONG va KHAC
  deu ghi ti le % diem anh lech >40/255 va do lech trung binh.
- Anh tests/out/*.png khong commit (xem .gitignore); chi commit
  tests/out/report.md va tests/baseline/.
- Co --url: URL chay duoc truyen vao Suite (khong dung hang URL
  toan cuc), mac dinh http://localhost:8123/index.html.

M04 (sua not) — cho chuyen canh xong truoc khi chup (xem HANDOFF
"Review M04"): anh thon luon KHAC (~41-46%) tren may Claude vi chup
luc canh dang mo dan. Co 2 hieu ung mo dan that trong code game:
(1) V41Presentation.transition (src/31_v41_v8.js:40-41): khi doi
scope (menu -> the gioi...), draw() dat transition=.39, update()
tru dan theo dt, draw() ve lop toi alpha toi da .55 khi transition>0
va khong co modal — het sau ~0.4-0.6s. (2) worldTitle (src/48:
v47tEnter dat 3.5, v47tUpdate tru dan theo dt): tieu de "Thanh Thach
Thon" mo dan theo alpha = clamp((3.5-worldTitle)*4,0,1) *
clamp(worldTitle,0,1) — hien ro tu ~0.25s, mo dan het trong 1s cuoi,
het han o 3.5s. Probe do thuc (sau click "Nhap the"): transition
0.39 -> 0 sau ~0.7s; worldTitle 3.48 -> 0 sau ~3.8s. Vi vay
Suite.shot() goi wait_settled() truoc moi lan chup: doi
transition==0 VA (o menu thi thoi, o play thi doi them worldTitle==0),
toi da 6s; roi kiem tra anh on dinh: chup 2 anh cach nhau 300ms,
doi do lech trung binh <= 2.0/255, thu toi da 3 lan. Neu het thoi
gian ma chua on dinh thi van chup va in canh bao (khong lam hong
kich ban). Sau khi mo panel (M/I/Q) cho them 400ms truoc khi chup.
Gioi han: chi o play moi doi worldTitle (o menu no khong giam);
cac hoat anh lien tuc (NPC di bo, V47T.clock, V41Presentation.clock)
van chay, nguong 2%/>40 hap thu nhieu con lai. Baseline cu (M01,
chup luc tieu de/lop toi o pha khac nhau) khong con dung duoc cho
anh vao thon — lam moi bang co --refresh-baseline (chi copy 14 anh
cua 8 kich ban, khong copy anh perf_* hay diff_*), roi chay lai
--compare tren baseline moi.

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

# M04 (a): seed co dinh cho Math.random; gia tri p.worldTime co dinh
# truoc moi lan chup (xem docstring o dau file).
SEED = 20261121
WORLD_TIME = 145
SEED_JS = f"""() => {{
  let s = {SEED} >>> 0;
  Math.random = function() {{
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }};
}}"""

# M04 (b): nguong so anh — KHAC khi >2% diem anh lech qua 40/255.
DIFF_THRESHOLD = 40
DIFF_PCT_LIMIT = 2.0

CLASSES = [
    {"id": "sword", "name": "Kiếm Tu", "tech": "sword"},
    {"id": "body", "name": "Thể Tu", "tech": "body"},
    {"id": "spell", "name": "Pháp Tu", "tech": "water"},
]

# M04 (sua not): tin hieu chuyen canh that trong game.
# - V41Presentation.transition: lop toi khi doi scope, .39 -> 0.
# - worldTitle: tieu de vung, 3.5 -> 0 (chi giam khi o play).
SETTLE_JS = """() => ({
  mode: (typeof mode !== 'undefined' ? mode : null),
  transition: (typeof V41Presentation !== 'undefined'
    ? V41Presentation.transition : null),
  worldTitle: (typeof worldTitle !== 'undefined' ? worldTitle : null),
})"""


def _mean_diff_bytes(a, b):
    """Do lech trung binh (/255) giua 2 anh PNG dang bytes (anh xam).
    Tra ve None neu khong doc duoc."""
    try:
        import io
        from PIL import Image, ImageChops
        ia = Image.open(io.BytesIO(a)).convert("L")
        ib = Image.open(io.BytesIO(b)).convert("L")
        if ia.size != ib.size:
            return None
        hist = ImageChops.difference(ia, ib).histogram()
        total = sum(hist)
        return sum(i * n for i, n in enumerate(hist)) / max(total, 1)
    except Exception:
        return None


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
    def __init__(self, page, url=URL):
        self.page = page
        self.url = url  # M04 (d): --url that su doi URL chay
        self.errors = []  # (scenario, message)
        self.current = "-"
        self.results = []  # (id, name, ok, evidence, shot)
        self.shots = []  # ten moi anh da chup (de --refresh-baseline)

    def state(self):
        return self.page.evaluate(STATE_JS)

    def freeze_time(self):
        """M04 (a): dat p.worldTime co dinh ngay truoc khi chup.
        Chi khi p ton tai (o menu p co the null -> bo qua). Dong bo
        ca V42_ATMO.worldTime neu truy cap duoc; loi nao cung bo qua
        de khong lam hong kich ban."""
        try:
            self.page.evaluate(
                "() => {"
                "  if (typeof p !== 'undefined' && p) p.worldTime = "
                f"{WORLD_TIME};"
                "  try { if (typeof V42_ATMO !== 'undefined' && V42_ATMO)"
                f" V42_ATMO.worldTime = {WORLD_TIME}; }} catch (e) {{}}"
                "  return (typeof p !== 'undefined' && p)"
                " ? p.worldTime : null; }")
        except Exception:
            pass

    def wait_settled(self, timeout=6.0):
        """M04 (sua not): cho chuyen canh xong truoc khi chup.
        Doi V41Presentation.transition==0 va (o play) worldTitle==0,
        toi da `timeout` giay; roi kiem tra anh on dinh: 2 anh cach
        nhau 300ms, do lech trung binh <= 2.0/255, thu toi da 3 lan.
        Tra ve (settled, stable). Het thoi gian thi tra ve False va
        nguoi goi van chup binh thuong (khong lam hong kich ban)."""
        deadline = time.time() + timeout
        settled = False
        while time.time() < deadline:
            try:
                s = self.page.evaluate(SETTLE_JS)
            except Exception:
                break
            trans = s.get("transition")
            wt = s.get("worldTitle")
            if ((trans is None or trans <= 0)
                    and (s.get("mode") != "play"
                         or wt is None or wt <= 0)):
                settled = True
                break
            self.page.wait_for_timeout(100)
        stable = False
        for _ in range(3):
            try:
                a = self.page.screenshot()
                self.page.wait_for_timeout(300)
                b = self.page.screenshot()
                mean = _mean_diff_bytes(a, b)
            except Exception:
                break
            if mean is None or mean <= 2.0:
                stable = True
                break
        return settled, stable

    def shot(self, name):
        settled, stable = self.wait_settled()
        if not (settled and stable):
            print(f"  [canh bao] anh {name} chup khi canh chua on dinh "
                  f"han: settled={settled} stable={stable}")
        self.freeze_time()
        path = OUT / name
        self.page.screenshot(path=str(path))
        if name not in self.shots:
            self.shots.append(name)
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
        self.page.goto(self.url, wait_until="load", timeout=60000)
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
        # M04 (sua not): panel co the dang hien dan — cho them 400ms
        # truoc khi chup (shot() con cho chuyen canh on dinh).
        self.page.wait_for_timeout(400)
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


def _compare_pair(path, base):
    """So 1 cap anh RGB. Tra ve (pct_lech, mean_lech, diff_path|None).
    - lech: diem anh co max(|R|,|G|,|B|) > DIFF_THRESHOLD (40/255).
    - pct_lech: % diem anh lech; mean_lech: trung binh max-lech
      tren toan anh (/255). KHAC khi pct_lech > DIFF_PCT_LIMIT (2%).
    - Khi KHAC: luu tests/out/diff_<ten>.png, diem lech to do.
    Dung numpy neu co; neu khong thi PIL thuan (mask theo tung kenh
    + histogram cua anh lech xam cho mean — xem ghi chu trong code)."""
    from PIL import Image, ImageChops

    a = Image.open(path).convert("RGB")
    b = Image.open(base).convert("RGB")
    if a.size != b.size:
        return None, None, None  # kich thuoc khac: goi o ngoai
    try:
        import numpy as np
        arr_a = np.asarray(a, dtype=np.int16)
        arr_b = np.asarray(b, dtype=np.int16)
        per_px = np.abs(arr_a - arr_b).max(axis=2)  # (h, w) 0..255
        mask = per_px > DIFF_THRESHOLD
        total = mask.size
        pct = float(mask.sum()) / total * 100.0
        mean = float(per_px.mean())
        if pct <= DIFF_PCT_LIMIT:
            return pct, mean, None
        out = np.asarray(a).copy()
        out[mask] = (255, 0, 0)
        diff_path = OUT / f"diff_{path.name}"
        Image.fromarray(out).save(diff_path)
        return pct, mean, diff_path
    except ImportError:
        # Khong co numpy: dung PIL thuan. Mask lech = hop cua 3 kenh
        # vuot nguong; mean lay tu histogram anh lech xam (xap xi).
        diff = ImageChops.difference(a, b)
        masks = [ch.point(lambda v: 255 if v > DIFF_THRESHOLD else 0)
                 for ch in diff.split()]
        mask = masks[0]
        for m in masks[1:]:
            mask = ImageChops.lighter(mask, m)
        total = mask.size[0] * mask.size[1]
        pct = sum(1 for v in mask.getdata() if v) / total * 100.0
        hist = diff.convert("L").histogram()
        mean = sum(i * n for i, n in enumerate(hist)) / max(total, 1)
        if pct <= DIFF_PCT_LIMIT:
            return pct, mean, None
        red = Image.new("RGB", a.size, (255, 0, 0))
        out = a.copy()
        out.paste(red, mask=mask)
        diff_path = OUT / f"diff_{path.name}"
        out.save(diff_path)
        return pct, mean, diff_path


def compare_images():
    """So tests/out/ voi tests/baseline/ theo nguong M04 (b).
    Tra ve (baseline_created, [(ten, ket_qua, chi_tiet), ...]).
    Bo qua diff_*.png (anh khac biet cua lan chay truoc, khong phai
    anh chup). Lan chay dau (chua co baseline): chi copy anh chup
    (khong copy diff_*.png) thanh baseline."""
    if not BASELINE.exists():
        BASELINE.mkdir(parents=True, exist_ok=True)
        for path in sorted(OUT.glob("*.png")):
            if path.name.startswith("diff_"):
                continue
            shutil.copy2(path, BASELINE / path.name)
        return True, []
    rows = []
    for path in sorted(OUT.glob("*.png")):
        if path.name.startswith("diff_"):
            continue
        base = BASELINE / path.name
        if not base.exists():
            rows.append((path.name, "MỚI", "chưa có trong baseline"))
            continue
        if (hashlib.md5(path.read_bytes()).hexdigest()
                == hashlib.md5(base.read_bytes()).hexdigest()):
            rows.append((path.name, "GIỐNG",
                         "md5 khớp · 0,00% điểm ảnh lệch >40/255 · "
                         "độ lệch trung bình 0,00/255"))
            continue
        try:
            from PIL import Image
            if Image.open(path).size != Image.open(base).size:
                rows.append((path.name, "KHÁC",
                             f"kích thước khác "
                             f"{Image.open(base).size} -> "
                             f"{Image.open(path).size}"))
                continue
        except Exception:
            rows.append((path.name, "KHÁC", "không đọc được ảnh"))
            continue
        pct, mean, diff_path = _compare_pair(path, base)
        detail = (f"{pct:.2f}% điểm ảnh lệch >40/255 · "
                  f"độ lệch trung bình {mean:.2f}/255")
        if pct > DIFF_PCT_LIMIT:
            detail += f" · diff: tests/out/diff_{path.name}"
            rows.append((path.name, "KHÁC", detail))
        else:
            rows.append((path.name, "GIỐNG", detail))
    return False, rows


def main():
    ap = argparse.ArgumentParser(description="M01: bo kiem thu tu dong")
    ap.add_argument("--compare", action="store_true",
                    help="so anh tests/out/ voi tests/baseline/")
    ap.add_argument("--refresh-baseline", action="store_true",
                    help="lam moi tests/baseline/ tu anh vua chup "
                    "(chi 14 anh cua 8 kich ban) roi bo qua --compare; "
                    "chi dung co chu dich sau khi sua cach chup")
    ap.add_argument("--url", default=URL)
    args = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    suite_holder = {}

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport=VIEWPORT)
        # M04 (a): seed Math.random truoc khi trang nap (ca code game
        # luc nap cung dung RNG da seed; ton tai qua reload).
        page.add_init_script(SEED_JS)
        suite = Suite(page, args.url)
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

    refreshed_baseline = False
    if args.refresh_baseline:
        # M04 (sua not): baseline cu chup luc tieu de/lop toi o pha
        # khac nhau nen khong dung duoc nua — lam moi tu anh vua chup
        # (chi 14 anh cua 8 kich ban, khong copy perf_*/diff_*).
        if BASELINE.exists():
            for old in BASELINE.glob("*.png"):
                old.unlink()
        BASELINE.mkdir(parents=True, exist_ok=True)
        n = 0
        # Copy TAT CA anh da chup trong lan chay (14 anh), khong chi
        # anh dai dien cua moi kich ban trong results (8 anh).
        for shot_name in suite.shots:
            src = OUT / shot_name
            if src.exists():
                shutil.copy2(src, BASELINE / shot_name)
                n += 1
        refreshed_baseline = True
        print(f"BASELINE: da lam moi tests/baseline/ tu {n} anh vua chup "
              f"(baseline cu chup luc chuyen canh chua xong).")

    baseline_created, cmp_rows = (False, [])
    if args.compare and not refreshed_baseline:
        baseline_created, cmp_rows = compare_images()
        print()
        if baseline_created:
            print("COMPARE: chưa có tests/baseline/ -> đã copy tests/out/ "
                  "thành baseline (lần chạy đầu, chưa so được).")
        else:
            n_same = sum(1 for r in cmp_rows if r[1] == "GIỐNG")
            n_diff = sum(1 for r in cmp_rows if r[1] == "KHÁC")
            print("=== COMPARE vs tests/baseline/ "
                  f"(ngưỡng: KHÁC khi >{DIFF_PCT_LIMIT:.0f}% điểm ảnh "
                  f"lệch >{DIFF_THRESHOLD}/255) ===")
            print(f"  GIỐNG: {n_same} · KHÁC: {n_diff} · "
                  f"tổng: {len(cmp_rows)}")
            for name, res, detail in cmp_rows:
                print(f"  {name}: {res} ({detail})")

    # Bao cao markdown.
    lines = ["# M01 — Báo cáo kiểm thử tự động",
             "",
             f"Chạy lúc: {time.strftime('%Y-%m-%d %H:%M:%S %Z')} · "
             f"URL: {args.url} · cửa sổ 1280x720 · Playwright Chromium headless",
             f"M04: Math.random seed={SEED} (add_init_script) · "
             f"p.worldTime={WORLD_TIME} trước mỗi lần chụp · "
             f"chờ chuyển cảnh xong trước khi chụp (transition==0, "
             f"worldTitle==0 ở play, + kiểm tra 2 ảnh cách 300ms) · "
             f"ngưỡng compare: KHÁC khi >{DIFF_PCT_LIMIT:.0f}% điểm ảnh "
             f"lệch >{DIFF_THRESHOLD}/255",
             "",
             "| ID | Kịch bản | Kết quả | Bằng chứng | Ảnh |",
             "|----|----------|---------|------------|-----|"]
    for sid, name, ok, ev, shot in suite.results:
        lines.append(f"| {sid} | {name} | {'ĐẠT' if ok else 'LỖI'} | {ev} | {shot} |")
    lines += ["", f"**Tổng: {passed}/{total} ĐẠT**",
              "", f"**Lỗi console/pageerror: {len(suite.errors)}**"]
    for sc, msg in suite.errors:
        lines.append(f"- [{sc}] {msg}")
    if refreshed_baseline:
        lines.append("")
        lines.append("**Baseline:** đã làm mới `tests/baseline/` từ ảnh "
                     "vừa chụp (baseline cũ chụp lúc chuyển cảnh chưa "
                     "xong — tieu đề/lớp tối ở pha khác nhau). Chạy lại "
                     "với `--compare` để so trên baseline mới.")
    if args.compare and not refreshed_baseline:
        lines.append("")
        if baseline_created:
            lines.append("**Compare:** lần chạy đầu — đã copy `tests/out/` "
                         "thành `tests/baseline/`, chưa có gì để so.")
        else:
            n_same = sum(1 for r in cmp_rows if r[1] == "GIỐNG")
            n_diff = sum(1 for r in cmp_rows if r[1] == "KHÁC")
            lines.append(
                f"**Compare vs tests/baseline/ "
                f"(ngưỡng: KHÁC khi >{DIFF_PCT_LIMIT:.0f}% điểm ảnh "
                f"lệch >{DIFF_THRESHOLD}/255): "
                f"GIỐNG {n_same} · KHÁC {n_diff} · tổng {len(cmp_rows)}**")
            for name, res, detail in cmp_rows:
                lines.append(f"- {name}: {res} ({detail})")
    (OUT / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Báo cáo: tests/out/report.md")
    if args.compare and baseline_created:
        print("Baseline mới: tests/baseline/")
    return 0 if passed == total and not suite.errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
