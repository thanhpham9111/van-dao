"""M07 — kiểm tra tương thích save giữa bản gốc V47.1 và bản hiện tại.

Bản gốc: dựng lại từ commit ae69594 (T01) bằng tools/bundle.py
thành tests/legacy/orig.html (54MB, gitignored, không commit).
Bản hiện tại: index.html ở cùng origin http://localhost:8123 nên
cùng localStorage — nhưng mỗi bước chạy trong browser context mới,
save được xuất ra file JSON rồi nạp lại bằng tay (setItem + reload)
để 4 save không lẫn nhau và không đụng save thật nào.

4 save tạo bằng bản gốc:
  (1) fresh — mới tạo nhân vật (Kiếm Tu), vào thôn, lưu ngay.
  (2) moved — Thể Tu, đi lại (WASD) + mở túi đồ (I) rồi lưu.
  (3) highlevel — Pháp Tu, sửa p.level=20, p.xp=8500, hồi đầy HP
      theo currentStats() rồi lưu.
  (4) openworld — Kiếm Tu, ra thế giới mở qua cổng thôn thật
      (Thanh Trúc Lâm), đi lại rồi lưu.

Mỗi save được mở ở CẢ HAI bản theo đúng đường người chơi
(seed localStorage -> reload -> menu "Tiếp tục hành trình" ->
resume) và so trạng thái SAU RESUME với nhau — chứ không so raw
JSON với live, vì resume() tự chuẩn hóa một số trường (v22Migrate
kẹp p.xp <= xpNeed(); xem báo cáo).
So các trường: p.level, p.xp, p.hp, p.stones, p.pills, p.cls,
p.v35, p.mapId + vị trí (p.x/p.y, v47TownPos) và thêm playerId,
worldMode, kills, discovered, explored làm bằng chứng phụ.
Không sửa code game — chỉ đọc qua console và gọi hàm có sẵn
(save, resume, v42sValidate, v47tInteract).

Độ tin cậy môi trường: VM này thỉnh thoảng vẫn giết Chromium
bằng SIGTRAP khi khởi động (đã gặp lại trong lúc làm M07).
Mỗi bước chạy với browser mới và thử lại tối đa 3 lần khi
browser chết; lỗi môi trường được ghi rõ, không nhầm với lỗi game.

Chạy:
    python3 -m http.server 8123 --bind 127.0.0.1   # từ gốc repo
    python3 tools/save_compat.py [--only N]
Kết quả: tests/save_compat.md + tests/legacy/save_*.json (save gốc,
bản lưu lại của bản gốc sau resume, bản lưu lại của bản hiện tại).
"""
import argparse
import json
import math
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import test_suite as ts

ROOT = Path(__file__).resolve().parent.parent
LEGACY = ROOT / "tests" / "legacy"
ORIG_URL = "http://localhost:8123/tests/legacy/orig.html"
CUR_URL = ts.URL
SAVE_KEY = "vdtt_vangioi_v3"

# Trường so chính (theo TASKS M07) + trường phụ làm bằng chứng.
COMPARE_FIELDS = ["level", "xp", "hp", "stones", "pills", "cls",
                  "mapId", "worldMode", "playerId", "kills"]
# Vị trí: thôn dùng v47TownPos (khôi phục qua resume, lệch <=80px
# như sc08), thế giới mở dùng p.x/p.y (làm tròn số nguyên).

P_FIELDS_JS = """() => {
  if (typeof p === 'undefined' || !p) return null;
  return {mode, cls: p.cls, level: p.level, xp: p.xp, hp: p.hp,
    mp: p.mp, stones: p.stones, pills: p.pills, mapId: p.mapId,
    worldMode: !!p.worldMode, playerId: p.playerId, kills: p.kills,
    x: Math.round(p.x), y: Math.round(p.y),
    v35: p.v35 ?? null, discovered: p.discovered ?? null,
    explored: p.explored ?? null,
    v47t: (typeof V47T !== 'undefined' && V47T.active)
      ? {x: Math.round(V47T.x), y: Math.round(V47T.y)} : null,
    v47TownPos: p.v47TownPos ?? null};
}"""

RAW_FIELDS_JS = """() => {
  const raw = localStorage.getItem('vdtt_vangioi_v3') || '';
  if (!raw) return null;
  const d = JSON.parse(raw);
  return {level: d.p.level, xp: d.p.xp, hp: d.p.hp, mp: d.p.mp,
    stones: d.p.stones, pills: d.p.pills, cls: d.p.cls,
    mapId: d.p.mapId, worldMode: !!d.p.worldMode,
    playerId: d.p.playerId, kills: d.p.kills,
    x: Math.round(d.p.x), y: Math.round(d.p.y),
    v35: d.p.v35 ?? null, discovered: d.p.discovered ?? null,
    explored: d.p.explored ?? null,
    v47TownPos: d.p.v47TownPos ?? null,
    topKeys: Object.keys(d).sort(),
    pKeys: Object.keys(d.p).sort()};
}"""


def _write_text_retry(path, text, tries=30, pause=2):
    """Ghi file, thử lại khi dính đợt lỗi ghi EPERM của VM (đợt lỗi
    lật theo thang giây–phút; đã làm mất file 2 lần trong lúc làm
    M07: ghi trực tiếp bằng open('w') cắt rỗng file khi write lỗi).
    Kiểm chứng bằng cách đọc lại; trả về True nếu ghi đủ."""
    last = None
    for _ in range(tries):
        try:
            path.write_text(text, encoding="utf-8")
            if path.read_text(encoding="utf-8") == text:
                return True
        except OSError as e:
            last = e
            time.sleep(pause)
    print(f"   [canh bao] không ghi được {path} sau {tries} lần: {last}")
    return False


def _dump(path, obj):
    data = json.dumps(obj, ensure_ascii=False, indent=2)
    if not _write_text_retry(path, data):
        raise OSError(f"không ghi được {path} (EPERM kéo dài)")


def _capture_ls(page):
    """Toàn bộ localStorage (trừ cài đặt đồ họa v41-quality)."""
    return page.evaluate(
        "() => { const o = {}; for (let i = 0; i < localStorage.length; i++) "
        "{ const k = localStorage.key(i); "
        "if (k !== 'v41-quality') o[k] = localStorage.getItem(k); } "
        "return o; }")


def _force_save(page):
    ok = page.evaluate("() => { try { return save(); } catch (e) "
                       "{ return 'ERR:' + e.message; } }")
    page.wait_for_timeout(300)
    return ok


def _force_save_retry(page):
    """save() trả False khi modal đang mở hoặc chưa ở play — đã thấy
    modal bật bất ngờ giữa trận (M06). Đóng modal bằng ESC rồi thử
    lại 1 lần; vẫn False thì trả về False để bên gọi ghi lại."""
    ok = _force_save(page)
    if ok is True:
        return ok
    try:
        page.keyboard.press("Escape")
        page.wait_for_timeout(400)
    except Exception:
        pass
    return _force_save(page)


def _go_to_create_retry(suite, page):
    """Vao man tao nhan vat, thu lai toi 3 lan. File goc 54MB luc
    tai lanh co the chua san sang khi click dau (click roi mat),
    da thay 1 lan o save 1 trong khi chay tay lai duoc ngay."""
    page.wait_for_timeout(1000)
    for _ in range(3):
        if suite.go_to_create():
            return True
        page.wait_for_timeout(1500)
    return False


def _run_with_fresh_browser(pw, fn, *args):
    """Chạy fn(browser, *args) với browser mới; nếu renderer/browser
    chết (SIGTRAP — VM này thỉnh thoảng vẫn vậy) thì thử lại tối đa
    3 lần. Trả về (True, kết quả) hoặc (False, lỗi cuối). Mỗi bước
    tự chứa trong context mới nên thử lại từ đầu là an toàn."""
    last_err = None
    for attempt in range(3):
        browser = None
        try:
            browser = pw.chromium.launch(headless=True,
                                         args=["--no-sandbox"])
            return True, fn(browser, *args)
        except Exception as e:
            last_err = e
            print(f"   [canh bao] browser chet (lan {attempt + 1}/3): "
                  f"{type(e).__name__}: {str(e)[:200]}")
            try:
                if browser is not None:
                    browser.close()
            except Exception:
                pass
            time.sleep(2)
    return False, last_err


def _make_save_once(browser, sid, name, cls_index, actions):
    """Tạo 1 save bằng bản gốc trong context mới. Trả về dict ghi lại."""
    ctx = browser.new_context(viewport=ts.VIEWPORT)
    page = ctx.new_page()
    page.add_init_script(ts.SEED_JS)
    errors = []
    page.on("pageerror", lambda e: errors.append(f"pageerror: {e}"))
    page.on("console", lambda m: errors.append(f"console.{m.type}: {m.text}")
            if m.type == "error" else None)
    suite = ts.Suite(page, ORIG_URL)
    rec = {"id": sid, "name": name, "cls": cls_index, "errors": errors}
    try:
        st = suite.goto_menu()
        assert st["mode"] == "menu", f"không vào được menu gốc: {st}"
        assert _go_to_create_retry(suite, page), \
            "không vào được màn tạo nhân vật gốc"
        cx = 78 + cls_index * 181 + 84
        page.mouse.click(cx, 304 + 102)
        page.wait_for_timeout(400)
        st = suite.enter_world(cls_index)
        assert st["mode"] == "play" and st["cls"] == cls_index, \
            f"không vào được thế giới gốc: {st}"
        note = actions(suite, page)
        rec["actions_note"] = note
        saved = _force_save_retry(page)
        assert saved is True, f"save() bản gốc trả về {saved!r}"
        raw = page.evaluate(
            f"() => localStorage.getItem('{SAVE_KEY}') || ''")
        assert raw, "localStorage trống sau save()"
        rec["raw_len"] = len(raw)
        rec["ls"] = _capture_ls(page)
        rec["orig_live"] = page.evaluate(P_FIELDS_JS)
        rec["orig_raw_fields"] = page.evaluate(RAW_FIELDS_JS)
        rec["validate_orig"] = page.evaluate(
            "() => v42sValidate(localStorage.getItem("
            f"'{SAVE_KEY}')).ok")
        _dump(LEGACY / f"save_{sid}.json",
              {"scenario": name, "raw": json.loads(raw),
               "localStorage": rec["ls"]})
        rec["file"] = f"tests/legacy/save_{sid}.json"
    finally:
        ctx.close()
    return rec


def make_save(pw, sid, name, cls_index, actions):
    return _run_with_fresh_browser(pw, _make_save_once, sid, name,
                                   cls_index, actions)


def act_fresh(suite, page):
    page.wait_for_timeout(1000)
    return "vào thôn, lưu ngay (không di chuyển, không mở panel)."


def act_moved(suite, page):
    # Đi 4 hướng như sc04 (WASD giữ 0,9s mỗi hướng) rồi mở túi đồ.
    for key in ("KeyW", "KeyS", "KeyA", "KeyD"):
        page.keyboard.down(key)
        page.wait_for_timeout(900)
        page.keyboard.up(key)
    page.keyboard.press("KeyI")
    page.wait_for_timeout(800)
    modal = suite.state()["modal"]
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    st = suite.state()
    return (f"đi WASD 4 hướng, mở túi đồ (modal={modal}) rồi đóng; "
            f"V47T={st['v47t']} p=({st['px']},{st['py']}).")


def act_highlevel(suite, page):
    page.evaluate(
        "() => { p.level = 20; p.xp = 8500; "
        "p.hp = Math.round(currentStats().hp); }")
    page.wait_for_timeout(400)
    st = suite.state()
    return (f"sửa console: p.level=20, p.xp=8500, "
            f"p.hp=hồi đầy theo currentStats() ({st.get('level')}, "
            f"hp live xem ở orig_live).")


def act_openworld(suite, page):
    ok, note = suite._exit_village_gate()
    assert ok, f"không ra được cổng thôn: {note}"
    page.wait_for_timeout(1000)
    for key in ("KeyW", "KeyD"):
        page.keyboard.down(key)
        page.wait_for_timeout(900)
        page.keyboard.up(key)
    st = suite.state()
    return (f"{note}; đi thêm W/D ở Thanh Trúc Lâm; "
            f"mapId={st['mapId']} p=({st['px']},{st['py']}) "
            f"v47t={st['v47t']}.")


SCENARIOS = [
    (1, "fresh — mới tạo nhân vật", 0, act_fresh),
    (2, "moved — đi lại + mở túi đồ", 1, act_moved),
    (3, "highlevel — cấp 20 (sửa console)", 2, act_highlevel),
    (4, "openworld — đang ở Thanh Trúc Lâm", 0, act_openworld),
]


def _open_with_build_once(browser, rec, url, tag):
    """Mở save gốc bằng một bản (gốc hoặc hiện tại) theo đường người
    chơi thật: seed localStorage -> reload -> menu "Tiếp tục hành
    trình" -> resume. Trả về dict kết quả (không raise khi không
    tương thích — ghi lại). `tag` = 'orig' hoặc 'current' (đặt tên
    file lưu lại)."""
    out = {"id": rec["id"], "name": rec["name"], "errors": [],
           "tag": tag}
    ctx = browser.new_context(viewport=ts.VIEWPORT)
    page = ctx.new_page()
    page.add_init_script(ts.SEED_JS)
    page.on("pageerror",
            lambda e: out["errors"].append(f"pageerror: {e}"))
    page.on("console", lambda m: out["errors"].append(
        f"console.{m.type}: {m.text}") if m.type == "error" else None)
    suite = ts.Suite(page, url)
    try:
        page.goto(url, wait_until="load", timeout=60000)
        page.wait_for_timeout(2000)
        # Seed toàn bộ localStorage đã xuất từ bản gốc, rồi tải lại
        # để game đọc save như người chơi mở lại sau khi nâng cấp.
        page.evaluate(
            "(ls) => { for (const [k, v] of Object.entries(ls)) "
            "localStorage.setItem(k, v); }", rec["ls"])
        out["validate"] = page.evaluate(
            "() => { try { return v42sValidate(localStorage.getItem("
            "'vdtt_vangioi_v3')).ok; } "
            "catch (e) { return 'ERR:' + e.message; } }")
        out["validate_reason"] = page.evaluate(
            "() => { try { const v = v42sValidate(localStorage.getItem("
            "'vdtt_vangioi_v3')); return v.ok ? '' : v.reason; } "
            "catch (e) { return 'ERR:' + e.message; } }")
        page.reload(wait_until="load", timeout=60000)
        page.wait_for_timeout(3000)
        st = suite.state()
        out["menu_after_reload"] = {
            "mode": st["mode"], "menuPage": st["menuPage"],
            "canResume": st["canResume"]}
        if not (st["mode"] == "menu" and st["canResume"]):
            out["resumed"] = False
            out["fail"] = ("menu sau reload không có Tiếp tục: "
                           f"{out['menu_after_reload']}")
            return out
        # Nút "Tiếp tục hành trình" ở menu home (như sc08).
        page.mouse.click(265, 342)
        st = suite.wait_state(lambda s: s["mode"] == "play", timeout=10)
        out["resumed"] = st["mode"] == "play"
        if not out["resumed"]:
            out["fail"] = f"click Tiếp tục nhưng không vào play: {st}"
            return out
        page.wait_for_timeout(500)
        out["live"] = page.evaluate(P_FIELDS_JS)
        # Bản này lưu lại ngay (autosave ~6s cũng sẽ ghi đè):
        # kiểm tra vòng lưu lại có làm mất/méo trường nào không.
        saved = _force_save_retry(page)
        out["resave_ok"] = saved
        out["raw_fields"] = page.evaluate(RAW_FIELDS_JS)
        out["resave_len"] = page.evaluate(
            f"() => (localStorage.getItem('{SAVE_KEY}') || '').length")
        raw2 = page.evaluate(
            f"() => localStorage.getItem('{SAVE_KEY}') || ''")
        if raw2:
            _dump(LEGACY / f"save_{rec['id']}_{tag}.json",
                  {"scenario": rec["name"], "raw": json.loads(raw2),
                   "note": f"ban {tag} luu lai sau khi mo save goc"})
            out["resave_file"] = f"tests/legacy/save_{rec['id']}_{tag}.json"
    finally:
        ctx.close()
    return out


def open_with_build(pw, rec, url, tag):
    return _run_with_fresh_browser(pw, _open_with_build_once, rec, url,
                                   tag)


def _eq(a, b):
    if a is None and b is None:
        return True
    if isinstance(a, float) or isinstance(b, float):
        try:
            return abs(float(a) - float(b)) < 0.5
        except (TypeError, ValueError):
            return False
    return a == b


def compare_fields(orig, cur):
    """So từng trường. Trả về list (field, orig, cur, ok, note)."""
    rows = []
    for f in COMPARE_FIELDS:
        o, c = orig.get(f), cur.get(f)
        rows.append((f, o, c, _eq(o, c), ""))
    # v35: so JSON (bản gốc đã có sẵn v35 đầy đủ từ T01).
    o35, c35 = orig.get("v35"), cur.get("v35")
    rows.append(("v35", _short(o35), _short(c35), o35 == c35,
                 "" if o35 == c35 else "khác nội dung — xem chi tiết"))
    # Vị trí: thôn so v47TownPos (lệch cho phép <=80px như sc08),
    # thế giới mở so p.x/p.y (lệch <=80px).
    if orig.get("worldMode") and orig.get("mapId") != "thon":
        opos = (orig.get("x"), orig.get("y"))
        cpos = (cur.get("x"), cur.get("y"))
        dist = (math.hypot(opos[0] - cpos[0], opos[1] - cpos[1])
                if None not in opos + cpos else None)
        rows.append(("vị trí p.x/p.y", opos, cpos,
                     dist is not None and dist <= 80,
                     f"lệch {dist:.1f}px" if dist is not None else ""))
    else:
        op, cp = orig.get("v47TownPos"), cur.get("v47TownPos")
        if op and cp:
            dist = math.hypot(op["x"] - cp["x"], op["y"] - cp["y"])
            rows.append(("vị trí v47TownPos", _pos(op), _pos(cp),
                         dist <= 80, f"lệch {dist:.1f}px"))
        else:
            rows.append(("vị trí v47TownPos", _pos(op), _pos(cp),
                         op == cp, ""))
    # discovered / explored (bằng chứng phụ).
    rows.append(("discovered", orig.get("discovered"),
                 cur.get("discovered"),
                 orig.get("discovered") == cur.get("discovered"), ""))
    rows.append(("explored", _short(orig.get("explored")),
                 _short(cur.get("explored")),
                 orig.get("explored") == cur.get("explored"),
                 "" if orig.get("explored") == cur.get("explored")
                 else "khác nội dung — xem chi tiết"))
    return rows


def _short(v):
    if v is None:
        return None
    s = json.dumps(v, ensure_ascii=False, sort_keys=True)
    return s if len(s) <= 90 else s[:87] + "…"


def _pos(p):
    if not p:
        return None
    return (round(p["x"], 1), round(p["y"], 1))


def _fmt(v):
    if v is None:
        return "—"
    if isinstance(v, bool):
        return "có" if v else "không"
    if isinstance(v, (list, dict)):
        return _short(v)
    return str(v)


def build_report(results, started):
    lines = ["# M07 — Kiểm tra tương thích save (bản gốc V47.1 → bản hiện tại)",
             "",
             f"Chạy lúc: {started} · Bản gốc: `tests/legacy/orig.html` "
             "(dựng lại từ commit `ae69594` bằng `tools/bundle.py`, "
             "54,0 MB, gitignored) · Bản hiện tại: `index.html` trên "
             "cùng origin `http://localhost:8123` (cùng localStorage key "
             "`vdtt_vangioi_v3`) · Mỗi bước chạy trong browser context "
             "mới, save xuất ra `tests/legacy/save_*.json` rồi nạp lại "
             "bằng tay (setItem + reload) để 4 save không lẫn nhau.",
             "",
             "## Cách kết luận (quan trọng)",
             "",
             "So sánh **trạng thái sau resume** của cùng một save ở hai "
             "bản — tức \"save gốc mở bằng bản gốc\" với \"save gốc mở "
             "bằng bản hiện tại\" — chứ không so raw JSON với live. Lý "
             "do: `resume()` tự chuẩn hóa một số trường (xem mục chuẩn "
             "hóa dưới đây), nên raw và live có thể lệch nhau mà cả hai "
             "bản vẫn cho kết quả giống hệt nhau.",
             "",
             "## Kết quả tổng",
             "",
             "| Save | Validate (gốc / hiện tại) | Resume (gốc / hiện tại) | "
             "Trường so khớp (sau resume) | Kết luận |",
             "|------|-------------------------|-------------------------"
             "|---------------------------|----------|"]
    n_ok = 0
    for r in results:
        o, c, ro = r["orig"], r["cur"], r["orig_resumed"]
        rows = r.get("rows", [])
        matched = sum(1 for row in rows if row[3])
        total = len(rows)
        ok = bool(c.get("resumed") and ro.get("resumed")) \
            and total > 0 and matched == total
        n_ok += ok
        lines.append(
            f"| {r['id']} {o['name']} | "
            f"{'ĐẠT' if o.get('validate_orig') else 'LỖI'} / "
            f"{'ĐẠT' if c.get('validate') is True else 'LỖI'} | "
            f"{'có' if ro.get('resumed') else 'KHÔNG'} / "
            f"{'có' if c.get('resumed') else 'KHÔNG'} | "
            f"{matched}/{total} | "
            f"{'TƯƠNG THÍCH' if ok else 'LỆCH / CHƯA XÁC ĐỊNH — xem dưới'} |")
    lines += ["",
              f"**Tổng: {n_ok}/{len(results)} save tương thích hoàn toàn "
              f"(sau resume ở cả hai bản).**",
              ""]
    for r in results:
        o, c, ro = r["orig"], r["cur"], r["orig_resumed"]
        lines += [f"## Save {r['id']} — {o['name']}",
                  ""]
        if r.get("failed"):
            lines += [f"- **Không hoàn thành: {r['failed']}**",
                      f"- Lỗi: {r.get('error', '')}",
                      ""]
            continue
        lines += [
            f"- Bản gốc: lớp `{['Kiếm Tu', 'Thể Tu', 'Pháp Tu'][o['cls']]}`"
            f" · save {o['raw_len']} byte · validate trong bản gốc: "
            f"{'ĐẠT' if o['validate_orig'] else 'LỖI'} · "
            f"file `{o['file']}` · lỗi console/pageerror: "
            f"{len(o['errors'])}",
            f"- Hành động: {o['actions_note']}",
            f"- Bản hiện tại validate save gốc: "
            f"{'ĐẠT' if c.get('validate') is True else 'LỖI'}"
            + (f" — {c.get('validate_reason')}"
               if c.get('validate_reason') else ""),
            f"- Resume: bản gốc {'ĐẠT' if ro.get('resumed') else 'LỖI'}"
            + (f" — {ro.get('fail')}" if ro.get('fail') else "")
            + f" · bản hiện tại {'ĐẠT' if c.get('resumed') else 'LỖI'}"
            + (f" — {c.get('fail')}" if c.get('fail') else ""),
            f"- Lỗi console/pageerror: bản gốc "
            f"{len(ro.get('errors', []))} · bản hiện tại "
            f"{len(c.get('errors', []))}",
            f"- Lưu lại sau resume: bản gốc {ro.get('resave_len')} byte"
            + (f" (`{ro['resave_file']}`)" if ro.get('resave_file')
               else "")
            + f" · bản hiện tại {c.get('resave_len')} byte"
            f" (gốc {o['raw_len']} byte)"
            + (f" · file `{c['resave_file']}`"
               if c.get('resave_file') else ""),
            "",
            "| Trường | Sau resume ở bản gốc | Sau resume ở bản hiện tại | Khớp |",
            "|--------|----------------------|---------------------------|------|"]
        for f, ov, cv, ok, note in r.get("rows", []):
            lines.append(f"| {f} | {_fmt(ov)} | {_fmt(cv)} | "
                         f"{'✓' if ok else '✗'}"
                         + (f" ({note})" if note else "") + " |")
        # Chuẩn hóa khi resume: raw khác với sau-resume-ở-bản-gốc.
        norms = [row for row in r.get("norm_rows", []) if not row[3]]
        lines += ["",
                  "**Chuẩn hóa khi resume (raw → sau resume ở bản gốc):**"]
        if not norms:
            lines.append("- Không có: raw giữ nguyên qua resume.")
        for f, ov, cv, ok, note in norms:
            lines.append(f"- {f}: raw={_fmt(ov)} → sau resume={_fmt(cv)}"
                         + (f" ({note})" if note else ""))
        # Khóa thêm/bớt sau khi bản hiện tại lưu lại.
        of = o["orig_raw_fields"]
        cf = c.get("raw_fields") or {}
        added_top = sorted(set(cf.get("topKeys", []))
                           - set(of["topKeys"]))
        removed_top = sorted(set(of["topKeys"])
                             - set(cf.get("topKeys", [])))
        added_p = sorted(set(cf.get("pKeys", [])) - set(of["pKeys"]))
        removed_p = sorted(set(of["pKeys"]) - set(cf.get("pKeys", [])))
        lines += ["",
                  "**Thay đổi cấu trúc sau khi bản hiện tại lưu lại:**",
                  f"- Khóa top-level thêm: {added_top or 'không'} · "
                  f"bớt: {removed_top or 'không'}",
                  f"- Khóa trong `p` thêm: {added_p or 'không'} · "
                  f"bớt: {removed_p or 'không'}",
                  ""]
    lines += ["## Chuẩn hóa khi resume — giải thích cho lệch xp ở save 3",
              "",
              "Save 3 đặt tay `p.xp=8500` ở cấp 20, vượt xa mức tu vi "
              "cần để lên cấp ở cấp đó. Cả hai bản đều chuẩn hóa giống "
              "hệt nhau khi resume: `v22Migrate()` "
              "(`src/14_v22_v23.js:39`, có từ bản gốc T01, gọi trong "
              "`resume_L08`/`start_L06`) làm "
              "`p.xp = Math.min(p.xp, xpNeed())`, với `xpNeed()` ở cấp 20 "
              "là 356 (`40+floor(19*14+floor(19/9)*25)` theo "
              "`src/14_v22_v23.js:25`). Đã kiểm chứng trực tiếp: mở "
              "save 3 bằng bản GỐC cũng cho `xp=356`, ổn định qua 2s. "
              "Trong lối chơi thật `p.xp` không bao giờ vượt `xpNeed()` "
              "vì `gainXP()` tự lên cấp và trừ tu vi, nên đây không phải "
              "hồi quy tương thích — chỉ là giá trị đặt tay ngoài tầm "
              "của gameplay thật.",
              "",
              "## Phương pháp & giới hạn",
              "",
              "- So sánh trên trường `p` TRỰC TIẾP (live sau resume), "
              "không so raw JSON từng byte: `worldTime` vẫn chạy, "
              "`seed`/`rng` khác nhau theo thời gian thực, và thứ tự "
              "khóa không có ý nghĩa.",
              "- `p.x/p.y` là tọa độ thế giới mở (OW); trong thôn vị trí "
              "thật nằm ở `V47T`/`p.v47TownPos` (khôi phục qua resume, "
              "lệch cho phép <=80px như kịch bản 08).",
              "- Save 3 sửa `p.level`/`p.xp` bằng console trong bản gốc "
              "trước khi lưu — chỉ để có một save cấp cao, không phải "
              "hành vi người chơi thật.",
              "- Môi trường: VM thỉnh thoảng giết Chromium bằng SIGTRAP "
              "khi khởi động; script thử lại mỗi bước tối đa 3 lần với "
              "browser mới và ghi rõ lỗi môi trường, tách khỏi lỗi game.",
              "- Chưa kiểm: save có vật phẩm rơi trên bản đồ (drops), "
              "đang ở trong nội thất V36, đang mở Khám phá V48, và "
              "save export định dạng `van-dao-save-v1` (có `explorer` "
              "riêng) — 4 save này chưa chạm các đường đó.",
              ""]
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser(description="M07: kiem tra tuong thich save")
    ap.add_argument("--only", type=int, choices=[1, 2, 3, 4],
                    help="chi chay 1 save (de chay lai nhanh)")
    args = ap.parse_args()
    LEGACY.mkdir(parents=True, exist_ok=True)
    started = time.strftime("%Y-%m-%d %H:%M:%S %Z")
    results = []
    with ts.sync_playwright() as pw:
        for sid, name, cls_i, act in SCENARIOS:
            if args.only and sid != args.only:
                continue
            print(f"== Save {sid}: {name} (ban goc) ==")
            ok, orig = make_save(pw, sid, name, cls_i, act)
            if not ok:
                print(f"   TAO SAVE THAT BAI sau 3 lan: {orig}")
                results.append({"id": sid,
                                "orig": {"name": name, "cls": cls_i,
                                         "raw_len": 0,
                                         "validate_orig": False,
                                         "file": "", "errors": [],
                                         "actions_note": ""},
                                "cur": {}, "orig_resumed": {},
                                "rows": [], "norm_rows": [],
                                "failed": "không tạo được save gốc",
                                "error": str(orig)[:300]})
                continue
            print(f"   save goc {orig['raw_len']} byte, "
                  f"validate={orig['validate_orig']}, "
                  f"loi={len(orig['errors'])}")
            # Cùng một save, mở ở cả hai bản để so trạng thái
            # SAU resume với nhau (xem "Cách kết luận" trong báo cáo).
            print(f"== Save {sid}: mo lai bang ban GOC (doi chieu) ==")
            ok_ro, orig_resumed = open_with_build(pw, orig, ORIG_URL,
                                                  "orig")
            if not ok_ro:
                print(f"   MO LAI BANG BAN GOC THAT BAI sau 3 lan: "
                      f"{orig_resumed}")
                orig_resumed = {"resumed": False,
                                "fail": f"browser chet sau 3 lan: "
                                        f"{orig_resumed}",
                                "errors": []}
            else:
                print(f"   resume_goc={orig_resumed.get('resumed')} "
                      f"validate={orig_resumed.get('validate')} "
                      f"loi={len(orig_resumed.get('errors', []))}")
            print(f"== Save {sid}: mo bang ban hien tai ==")
            ok_cur, cur = open_with_build(pw, orig, CUR_URL, "current")
            if not ok_cur:
                print(f"   MO BANG BAN HIEN TAI THAT BAI sau 3 lan: {cur}")
                cur = {"resumed": False,
                       "fail": f"browser chet sau 3 lan: {cur}",
                       "errors": []}
            rows = []
            if (cur.get("resumed") and cur.get("live")
                    and orig_resumed.get("resumed")
                    and orig_resumed.get("live")):
                rows = compare_fields(orig_resumed["live"], cur["live"])
            # Chuẩn hóa khi resume: raw so với sau-resume-ở-bản-gốc.
            norm_rows = []
            if orig_resumed.get("live"):
                norm_rows = compare_fields(
                    orig["orig_raw_fields"], orig_resumed["live"])
            results.append({"id": sid, "orig": orig, "cur": cur,
                            "orig_resumed": orig_resumed,
                            "rows": rows, "norm_rows": norm_rows})
            matched = sum(1 for row in rows if row[3])
            print(f"   resume_hien_tai={cur.get('resumed')} "
                  f"validate_hien_tai={cur.get('validate')} "
                  f"khop (sau resume)={matched}/{len(rows)} "
                  f"loi={len(cur.get('errors', []))}")
            for row in rows:
                if not row[3]:
                    print(f"   LECH: {row[0]}: goc_sau_resume="
                          f"{_fmt(row[1])} "
                          f"hien_tai={_fmt(row[2])} {row[4]}")
            for row in norm_rows:
                if not row[3]:
                    print(f"   CHUAN HOA khi resume: {row[0]}: "
                          f"raw={_fmt(row[1])} -> "
                          f"sau_resume={_fmt(row[2])} {row[4]}")
    report = build_report(results, started)
    if not _write_text_retry(ROOT / "tests" / "save_compat.md", report):
        print("CANH BAO: khong ghi duoc tests/save_compat.md (EPERM) — "
              "in bao cao ra stdout de khong mat:")
        print(report)
    print()
    n_ok = 0
    for r in results:
        rows = r["rows"]
        matched = sum(1 for row in rows if row[3])
        ok = bool(r["cur"].get("resumed")
                  and r["orig_resumed"].get("resumed")) \
            and rows and matched == len(rows)
        n_ok += ok
        print(f"Save {r['id']} {r['orig']['name']}: "
              f"{'TƯƠNG THÍCH' if ok else 'LỆCH / CHƯA XÁC ĐỊNH'} "
              f"({matched}/{len(rows)})")
    print(f"Tổng: {n_ok}/{len(results)} save tương thích hoàn toàn.")
    print("Báo cáo: tests/save_compat.md")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
