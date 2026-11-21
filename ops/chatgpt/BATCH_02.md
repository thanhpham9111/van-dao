# GÓI VIỆC 02 CHO CHATGPT — 8 việc, làm liền một mạch, nộp một lần

Giao ngày 21/11/2026 bởi Claude. Làm **theo thứ tự B1 → B8** (chữ/dữ liệu trước, ảnh sau cùng).
Mọi số liệu, id, tên thật của game nằm ở **`BATCH_02_FACTS.md`** (mục F1–F12) — dùng đúng, KHÔNG đoán, KHÔNG đổi id/chỉ số đang có.
Thiếu thông tin: ghi vào "Câu hỏi mở" trong báo cáo, chọn phương án an toàn nhất rồi làm tiếp, không dừng cả gói.
Nếu hết chỗ trong một lượt trả lời: nộp thành nhiều phần (`BATCH_02_part1.zip`, `part2`…), mỗi phần đủ file trọn vẹn.

## Cách nộp

Một file **`BATCH_02.zip`**:
```
data/quests.js                    (B1)
ops/specs/story.md                (B1)
data/bestiary.js                  (B2)
ops/specs/boss_intro.md           (B2)
data/events.js                    (B3)
data/lore.js                      (B4)
ops/specs/panels_ui.md            (B5)
ops/specs/menu_ui.md              (B6)
assets/menu_keyart.png            (B6 — nếu tạo được)
ops/specs/breakthrough.md         (B7)
assets/interior_herbalist_concept.png, interior_shop_concept.png,
assets/interior_wanderer_concept.png, interior_sentry_concept.png   (B8 — nếu tạo được)
BATCH_02_REPORT.md                (khuôn ở cuối file)
```
Mọi `data/*.js` theo dạng `DATA.<tên> = { ... };` — bên trong là **JSON hợp lệ** (khoá có ngoặc kép, không dấu phẩy cuối, không comment, không hàm). Chữ hiển thị tiếng Việt có dấu, mỗi chuỗi ≤ 140 ký tự trừ khi ghi khác.

---

## B1 — T32: Chính tuyến chương 1–5 + phụ tuyến (`data/quests.js`, `ops/specs/story.md`)

Hiện chính tuyến chỉ có 8 bước khô khan, dừng ở cấp 10 (F6), trong khi bản đồ kéo tới cấp 45 (F1). Cần **một câu chuyện tu tiên xuyên suốt 10 vùng**.

**`story.md`:** cốt truyện (≤ 600 chữ): mâu thuẫn chính, phản diện, vì sao đi từ thôn qua từng vùng, vai trò 4 tông môn (F4) và 12 NPC (F3), kết chương 5 ở Tử Lôi Hoang Nguyên. Mỗi chương: tên, vùng, cảnh giới, 2–3 câu tóm tắt.

**`data/quests.js`:**
```json
DATA.quests = {
  "version": 1,
  "chapters": [ {"id": "c1", "title": "…", "summary": "…", "regions": ["thon","truc"]} ],
  "legacyText": [ {"index": 0, "name": "…", "desc": "…"} ],
  "main": [ {
    "id": "m09", "chapter": "c2", "name": "…", "desc": "…", "giver": "inn",
    "goal": {"type": "kill", "region": "yeu", "count": 6},
    "minLevel": 10,
    "reward": {"stones": 30, "pills": 3, "xp": 200},
    "lineStart": "…", "lineDone": "…"
  } ],
  "side": [ { "id": "s01", "…": "cùng khuôn main, thêm \"region\" nơi nhận" } ]
};
```
- `legacyText`: viết lại **chữ** (name, desc) cho 8 bước cũ chỉ số 0–7 cho hợp cốt truyện, **giữ nguyên ý mục tiêu và mọi chỉ dẫn phím** (T, B, E, WASD, chuột, Shift, H). Không đổi điều kiện/thưởng.
- `main`: **16–20 bước mới**, id `m09`… nối tiếp, chương 2–5, đi qua `yeu → tram → tuyet → hoa → phong → quy → ma → loi` theo đúng dải cấp F1. Mỗi vùng có ít nhất 1 bước hạ boss vùng.
- `side`: **10 nhiệm vụ phụ**, mỗi cái gắn 1 NPC khác nhau (ngoài `inn`), 1 bước, không trùng `V8_TASKS` (F6).
- `goal.type` CHỈ được dùng: `talk` {npc} · `discover` {region} · `kill` {region, count 3–12} · `boss` {region ≠ thon} · `level` {min 1–45} · `claim` {poi: chỉ id loại altar/herb ở F7} · `sect` {sect: id F4, rank 1–5 theo F4}. Không tạo loại mới.
- `giver`: id NPC có ở F3 (NPC ngoài thôn chỉ giao việc ở vùng của họ — xem tiểu sử).
- Thưởng theo cấp: `stones` ≈ 10 + 2×minLevel, `pills` 1–4, `xp` ≈ 40% tu vi cần ở minLevel (công thức F1). Boss: ×1,5.
- **Tự kiểm:** id duy nhất; minLevel tăng dần không giảm trong `main`; mọi npc/region/poi/sect tồn tại ở FACTS; không bước nào yêu cầu vùng có cấp thấp nhất > minLevel + 2.

## B2 — T33: Yêu thú chí + màn giới thiệu boss (`data/bestiary.js`, `ops/specs/boss_intro.md`)

Theo phong cách **Warm Snow**: boss xuất hiện có thẻ tên + danh hiệu, đổi pha có câu thoại.

**`data/bestiary.js`:**
```json
DATA.bestiary = {
  "version": 1,
  "monsters": [ {"type": 0, "name": "Trúc Lang", "element": "Mộc", "regions": ["truc"],
                 "lore": "…", "hint": "…"} ],
  "bosses": [ {"type": 3, "name": "Trúc Lang Vương", "title": "…", "region": "truc",
               "intro": "…", "phase2": "…", "defeat": "…",
               "moves": {"pounce": "…", "sweep": "…", "ring": "…"}} ]
};
```
- `monsters`: đủ **25 mục** theo F2 (`type` = chỉ số, `name` y nguyên). `lore` ≤ 160 ký tự, `hint` = mẹo đánh ≤ 90 ký tự (chỉ nói cơ chế có thật: né bằng Shift, đánh xa, giữ khoảng cách…). `element` một trong Kim/Mộc/Thủy/Hỏa/Thổ/Lôi.
- `bosses`: 15 boss (F2 cột "boss"): `title` danh hiệu ≤ 24 ký tự (VD "Chúa tể rừng trúc"); `intro` ≤ 70 (hiện cùng thẻ tên); `phase2` ≤ 70 (khi còn 50% HP); `defeat` ≤ 70. `moves`: đặt **tên chiêu tiếng Việt** cho đúng 3 mã đòn của vùng đó (F1); boss bí cảnh/ẩn (7, 20–24) dùng bộ `["crush","fan","burst"]`.

**`boss_intro.md`:** thẻ giới thiệu boss trên 1280×720: thời điểm (lần đầu vào tầm 650px của boss, mỗi lần nạp vùng tối đa 1 lần), bố cục (tên lớn + danh hiệu + nét mực cọ), thời gian vào/ra (ms), có làm chậm thời gian hay không (đề xuất ≤ 0,4 giây, không khoá điều khiển), câu `phase2` hiện ở đâu, câu `defeat` ở đâu. **Không chồng thanh boss của T12** (tên boss x360,y664,w322 — xem `hud_combat.md` §5) và vùng giữa trên của toast.
- **Tự kiểm:** 25 + 15 mục; không đổi tên; ≤ giới hạn ký tự; mọi mã đòn khớp F1.

## B3 — T34: 24 kỳ ngộ mới (`data/events.js`)

Hiện chỉ có 3 kỳ ngộ (F8), chơi vài lần là lặp. Viết **24 sự kiện** rải đủ 9 vùng ngoài thôn (mỗi vùng ≥ 2), mỗi sự kiện 2–3 lựa chọn, có lựa chọn rủi ro.
```json
DATA.events = {
  "version": 1,
  "events": [ {"id": "e01", "title": "…", "desc": "…",
    "when": {"regions": ["truc"], "minLevel": 1, "night": false, "weight": 10},
    "options": [ {"name": "…", "desc": "…", "effects": [ {"type": "stones", "value": 6} ],
                  "chance": 1.0, "fail": [ {"type": "hurt", "value": 20} ]} ] } ]
};
```
- `effects`/`fail` CHỈ dùng: `stones` · `pills` · `xp` · `heal` (HP hiện tại) · `hurt` (HP hiện tại, không bao giờ làm chết — ghi rõ trong desc) · `mat` {item: herb|wood|ore|crystal, value} · `favor` {npc, value 1–5} · `buff` {stat: attack|def|speed|crit|regen, value, seconds 60–300; attack/def tính %, ≤ 15%; crit ≤ 0,05} · `setFlag` {flag}.
- **KHÔNG** tăng chỉ số vĩnh viễn, không phát trang bị/công pháp (đã có đường nhận riêng).
- Quy mô thưởng: `stones` ≤ 6 + minLevel; `xp` ≤ 30% tu vi cần ở minLevel; `pills` ≤ 3.
- `night`: `true` chỉ xảy ra ban đêm, `false` chỉ ban ngày, bỏ trống = bất kỳ. `chance` < 1 thì phải có `fail`. `desc` của lựa chọn ghi rõ hậu quả (người chơi được biết trước).
- **Tự kiểm:** 24 sự kiện, id `e01`–`e24`, mỗi vùng ≥ 2, mọi effect đúng enum và giới hạn.

## B4 — T35: Văn bản thế giới (`data/lore.js`)

```json
DATA.lore = {
  "version": 1,
  "equipment": {"0": "…", "1": "…"},
  "relics": {"jade": "…"},
  "techs": {"sword": "…"},
  "sets": {"truc": "…"},
  "regions": {"truc": {"verse": ["…", "…"], "intro": "…"}},
  "sects": {"cloud": "…"},
  "schools": {"Kiếm Tu": "…"},
  "tips": ["…"]
};
```
- `equipment`: **63 mục** khoá "0"–"62" theo F10, mỗi câu ≤ 110 ký tự, giọng cổ phong, gợi nguồn gốc món đồ, khớp hệ/style. Không nhắc chỉ số.
- `relics` 14, `techs` 9 (công pháp cũ F9), `sets` 11: ≤ 110 ký tự.
- `regions` 10: `verse` = 2 câu thơ 6–8 chữ (hiện dưới tên vùng khi vào vùng), `intro` ≤ 140.
- `sects` 4, `schools` 3: ≤ 140.
- `tips`: **40 mẹo** màn tải ≤ 90 ký tự, chỉ nói cơ chế CÓ THẬT (phím F12, đột phá F11, tông môn, linh thú, linh căn, ủy thác, lò đan…). Không bịa tính năng.
- **Tự kiểm:** đủ số lượng; không lặp câu; mẹo không dùng phím ngoài F12.

## B5 — T36: Spec bảng Hành trang (I) + Hồ sơ tu sĩ (C) theo Wandering Sword (`ops/specs/panels_ui.md`)

Ảnh hiện tại: `tui_do_I.png`, `nhan_vat_C.png` (kèm trong gói). Hai bảng đúng chức năng nhưng trông như web app: khung xanh đen phẳng, nút xám, chữ sans. Cần **đổi sang ngôn ngữ thị giác Wandering Sword**: giấy/lụa ấm, viền gỗ sơn mài, tiêu đề thư pháp, ô đồ khung đồng, phân cấp phẩm chất bằng màu viền (`QUALITY_COL` có sẵn), nhân vật đứng trên nền tranh thủy mặc.
- **Giữ nguyên mọi chức năng, nút, tab, phím** đang có trong ảnh (Bộ trang bị, Pháp bảo, Nguyên liệu, lọc, sắp xếp, phân trang 24 ô, Giám định, Tự nhặt; 6 thuộc tính gốc +1/+5/−, 3 tab Chiến đấu/Tu luyện/Trang bị, Hoàn lại điểm, nút Công pháp·T, Tông môn·N).
- Spec đủ: toạ độ khối trên 1280×720, màu hex (bảng màu Design Bible trong BRIEF), font, trạng thái hover/chọn/khoá, kích thước ô đồ, tooltip so sánh đồ (mũi tên xanh/đỏ), hiệu ứng mở/đóng (ms). Dùng ánh sáng/chất liệu T21 §5.
- **Tự kiểm:** không bỏ chức năng nào; chữ dài nhất ("Linh sức · Chưa trang bị", "Sát thương kỹ năng cơ sở") vừa khung.

## B6 — T37: Spec Menu chính + Tạo nhân vật + 1 ảnh key art (`ops/specs/menu_ui.md`)

Ảnh hiện tại: `menu.png`, `tao_nhan_vat.png`. Đây là ấn tượng đầu tiên của game — cần đẹp nhất.
- Giữ chức năng: Bắt đầu hành trình / Tiếp tục / Tạo nhân vật mới / Cài đặt…, ô nhập tên, chọn 3 phái (F5), nút Nhập thế. Không thêm chế độ chơi.
- Spec: bố cục 1280×720, chuyển động nền nhẹ (mây/sương trôi, lá rơi — ghi tốc độ px/s), âm hưởng ánh sáng T21, hover nút, cách hiện 3 phái (thẻ tranh dọc, chỉ số dạng thanh mực), xác nhận ghi đè save.
- **Ảnh `menu_keyart.png`** 16:9 (≥ 1920×1080): núi non thủy mặc, tu sĩ nhỏ đứng trên vách nhìn biển mây, có khoảng trống bên trái cho menu; **không chữ**, không logo, cùng phong cách tranh thôn hiện tại.
- **Tự kiểm:** nút đủ như ảnh; chữ không đè lên tâm điểm ảnh nền.

## B7 — T38: Spec Thiên kiếp đột phá (`ops/specs/breakthrough.md`)

Cơ chế thật ở F11 — **giữ nguyên luật chơi** (số đợt, 3 dạng vùng sét, thời gian báo trước, thắng/thua). Chỉ thêm phần trình diễn cho xứng khoảnh khắc lớn nhất của tu tiên:
- Cảnh mở đầu khi nhấn B (≤ 2,5 giây, bỏ qua được bằng Space/Esc): mây kiếp tụ, câu thoại theo cảnh giới sắp lên (4 câu: lên Trúc Cơ / Kim Đan / Nguyên Anh / Hóa Thần).
- Báo trước vùng sét rõ ràng theo Warm Snow: hình dạng, màu, nhấp nháy theo thời gian còn lại.
- Thành công: hiệu ứng thăng cảnh giới (vầng sáng, chữ cảnh giới mới kiểu thư pháp, ≤ 3 giây), câu chúc của Trưởng lão (4 câu theo cảnh giới). Thất bại: câu an ủi + gợi ý (≤ 70 ký tự, 2 câu).
- Spec đủ toạ độ, màu, ms, thứ tự lớp vẽ; tôn trọng HUD T12 (không che thanh HP người chơi).
- **Tự kiểm:** không đổi số liệu F11; mọi chữ ≤ 70 ký tự.

## B8 — Ảnh concept 4 phòng còn lại (bổ sung T23)

Cùng khuôn ảnh `interior_inn_concept` đã duyệt (góc 3/4, không chữ, ấm, khớp tranh thôn): `herbalist` Bách Thảo Dược Đường · `shop` Vạn Bảo Phường · `wanderer` Kiếm Tu Quán · `sentry` Đông Môn Hộ Vệ Đường (chủ đề + màu nhấn ở `interior.md`). NPC đứng giữa-trên, lối ra giữa-dưới, 4 khối đồ lớn ở 2 bên như bố cục trong `interior.md` (để code khớp vật cản). Tạo được bao nhiêu nộp bấy nhiêu.

---

## Khuôn `BATCH_02_REPORT.md`
```
# BATCH_02 — ChatGPT
## B1 T32 — số chương/bước/phụ tuyến · tự kiểm ĐẠT/LỖI
## B2 T33 — 25 quái + 15 boss · tự kiểm
## B3 T34 — 24 kỳ ngộ, đếm theo vùng · tự kiểm
## B4 T35 — đếm từng mục · tự kiểm
## B5 T36 — quyết định chính
## B6 T37 — quyết định chính · ảnh có/không
## B7 T38 — quyết định chính
## B8 — ảnh nào đã có
## Câu hỏi mở (thiếu gì + phương án đã chọn)
## CHAT (dán vào ops/CHAT.md)
## HANDOFF (dán vào ops/HANDOFF.md)
```
