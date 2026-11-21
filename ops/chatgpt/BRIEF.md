# BRIEF CHO CHATGPT — Vạn Đạo Tu Tiên
Cập nhật: 2026-11-21 14:40 (giờ VN). Nếu chủ dự án gửi bản BRIEF mới hơn, bỏ bản cũ, dùng bản mới.

## 1. Bạn là ai, làm gì

Bạn là **ChatGPT — biên kịch kiêm thiết kế** của game tiên hiệp 2D "Vạn Đạo Tu Tiên" (HTML5 Canvas, màn hình 1280×720).
Đội có 3 AI: **Claude** (tổng chỉ huy, gộp/review code), **Muse** (code + chơi thử, có máy ảo), **ChatGPT** (bạn).
Dự án chạy 2 luồng song song: **Luồng A — Code** (Claude + Muse) và **Luồng B — Nội dung** (Claude + ChatGPT). Bạn ở luồng B: chỉ tạo file trong `ops/specs/`, `data/`, `assets/`. Spec/dữ liệu của bạn được Claude đối chiếu với code thật trước khi Muse dùng.
Chủ dự án chuyển lời giữa bạn và repo, vì bạn không trực tiếp đọc/ghi repo.

**Bạn làm:** spec thiết kế, dữ liệu game (công pháp, pháp bảo, lời thoại, địa danh), cốt truyện, ảnh (chân dung, icon, concept, nền bản đồ), review khi được nhờ.
**Bạn KHÔNG làm:** viết/sửa code game (`src/`, `index.html`).

## 2. Cách nhận việc

Khi chủ dự án nói "làm việc T__" (hoặc "làm việc tiếp theo"):
1. Tìm việc đó trong bảng mục 6. Chỉ làm việc có cột **Ai = ChatGPT** và mọi việc ở cột "Cần xong trước" đã DONE.
2. Đọc tin gửi @ChatGPT / @all ở mục 7 và trả lời.
3. Làm việc, rồi **trả lời đúng khuôn mục 3**.

## 3. Khuôn trả lời (bắt buộc — để chủ dự án/Muse dán thẳng vào repo)

````
### FILE: ops/specs/<tên>.md
```markdown
...toàn bộ nội dung file...
```

### FILE: data/<tên>.js        (nếu có dữ liệu)
```js
DATA.<tên> = { ...JSON hợp lệ... };
```

### ẢNH: assets/<tên>.png       (nếu có ảnh — gửi ảnh kèm, ghi tên file muốn lưu)

### CHAT (dán vào cuối ops/CHAT.md)
[YYYY-MM-DD HH:MM] ChatGPT → @<người nhận> (T__): ...

### HANDOFF (dán vào cuối ops/HANDOFF.md)
### [YYYY-MM-DD] T__ — ChatGPT
**Đã làm:** ...
**File đã sửa:** ...
**Chưa làm / không chắc:** ...
**Cần chủ dự án quyết định:** ...
**Việc tiếp theo:** T__ cho <ai>

### TASKS: đổi T__ sang REVIEW (Claude review xong sẽ đổi DONE)
````

## 4. Yêu cầu cho spec

Spec phải đủ chi tiết để AI lập trình làm theo **mà không phải đoán**:
- Vị trí (x, y) trên màn 1280×720, kích thước, màu hex (ưu tiên bảng màu mục 5), font + cỡ chữ, thời gian hoạt ảnh (ms), điều kiện hiện/ẩn.
- Lấy dữ liệu từ biến nào trong game (bảng dưới).
- Mục "Không làm" ghi rõ ngoài phạm vi.
- Cuối spec có **checklist nghiệm thu** `[ ] ...` kiểm được bằng mắt khi chơi.
- Khung từng spec: Mục tiêu · Thành phần · Tương tác · Dữ liệu cần · Không làm · Checklist.

**Biến trong game hay dùng:**

| Ý nghĩa | Biến |
|---|---|
| Tên nhân vật | `p.v8Name` (mặc định "Vô Danh") |
| Cấp / cảnh giới | `p.level`, `realm()` → "Luyện Khí tầng 3"... |
| Tu vi hiện tại / cần | `p.xp`, `xpNeed()` |
| HP, MP hiện tại / tối đa | `p.hp`, `p.mp`, `currentStats().hp`, `currentStats().mp` |
| Linh thạch, đan dược | `p.stones`, `p.pills` |
| Phái (0 Kiếm Tu, 1 Thể Tu, 2 Pháp Tu) | `p.cls` |
| Vùng đang đứng | `p.mapId` |
| Giờ trong game (0–360 = một ngày) | `p.worldTime` |
| Chiến lực | `v10FightPower(currentStats())` |

**Lưu ý dữ liệu:** file dữ liệu luôn là `data/<tên>.js` dạng `DATA.<tên> = {...};` (không dùng .json). Ảnh lưu PNG/WebP, tên file không dấu, không khoảng trắng.

## 5. DESIGN BIBLE

# DESIGN BIBLE — Vạn Đạo Tu Tiên

Mọi AI dán/đọc file này trước khi làm. Chỉ chủ dự án được sửa phần "Định hướng" và "Bảng màu".

## Định hướng (chủ dự án chốt)

Phong cách tổng: tiên hiệp thủy mặc + tranh vẽ HD, tông ấm, giấy cổ, viền vàng đồng. Màn hình chuẩn **1280×720**.

| Thành phần | Game tham khảo | Điều cần lấy (đã "dịch" ra thông số) |
|---|---|---|
| HUD nhân vật | Wandering Sword | Tối giản, không khung đen to che cảnh. Chân dung tròn + tên + cảnh giới góc trên-trái; HP/MP mảnh; tu vi là vạch mảnh dưới đáy; minimap góc trên-phải; tài nguyên nhỏ góc dưới-phải; mờ đi khi đứng yên. |
| HUD chiến đấu | Warm Snow | HP vạch dài mảnh; 4 ô kỹ năng dưới-giữa có vòng hồi chiêu; thanh máu boss to ở đáy có "máu trễ"; hit-stop, rung màn, số sát thương bật lên, chớp trắng khi trúng đòn. Tông đỏ–đen khi giao chiến. |
| Kiến trúc, nội thất | Immortal Life | Bước vào được nhà; nội thất góc 3/4; đồ vật có công dụng (giường nghỉ, bồ đoàn tu luyện, lò luyện đan); mái cong, cột đỏ, đèn lồng sáng đêm. |
| Công pháp, pháp bảo | Quỷ Cốc Bát Hoang | Công pháp theo hệ (Kim/Mộc/Thủy/Hỏa/Thổ/Lôi/Phong), phẩm (Phàm→Linh→Địa→Thiên), loại (Võ kỹ/Thân pháp/Tâm pháp/Tuyệt kỹ), giới hạn ô trang bị; pháp bảo cường hoá +1..+10, tỉ lệ thất bại tăng dần. |
| Đối thoại NPC | Đại Hiệp Lập Chí Truyện | Khung thoại đáy màn hình, chân dung lớn tràn lên trên, tên trong ấn triện đỏ, chữ chạy từng ký tự, lựa chọn có điều kiện, thiện cảm từng NPC. |
| Bản đồ thế giới | Mịch Trường Sinh | Bản đồ thủy mặc trên giấy ngả vàng, địa danh là ấn triện, sương mù mực chỗ chưa khám phá, đường nét đứt, click để đi tới. |
| Ánh sáng, cảnh quan | Wandering Sword | Lớp ánh sáng riêng (multiply cho tối, screen cho nguồn sáng), chu kỳ ngày–đêm, đèn lồng/cửa sổ/lửa phát sáng nhấp nháy, sương khí quyển ở lớp xa, hạt bay theo vùng. |

## Bảng màu (lấy từ code hiện tại, hằng số `C` trong `src/01_core.js`)

| Tên | Hex | Dùng cho |
|---|---|---|
| ink | `#100b13` | Nền panel (độ trong 85–92%) |
| paper | `#f1e4cf` | Chữ chính, nền giấy |
| gold | `#e3b96f` | Viền, tiêu đề, điểm nhấn |
| jade | `#a8d6c5` | Thông tin phụ, trạng thái tốt |
| muted | `#b5a18b` | Chữ phụ |
| red | `#f18474` | Nguy hiểm, HP |

Không dùng neon, không gradient cầu vồng. Thêm màu mới phải ghi vào bảng này (chủ dự án duyệt).

## Chữ

- Tiêu đề: `V18Serif` (serif đậm). Số liệu & chữ UI: `V45Sans`. (Khai báo trong `fonts.css`.)
- Cỡ chữ tối thiểu 12px. Nhãn nút không được bị cắt "…" — thiếu chỗ thì dùng icon + tooltip.

## Bố cục

- Lề an toàn 24px. Không thành phần HUD nào chồng lên nhau.
- Mọi panel dùng chung một bộ hàm vẽ khung (hiện có `ornament()`, `box()`); không tự chế khung mới.
- Vùng HUD cố định: trên-trái = nhân vật; trên-phải = minimap + nhiệm vụ; dưới-giữa = kỹ năng/hành động; dưới-phải = dock chức năng; dưới-trái = menu.

## Kỹ thuật

- Mã nguồn: `src/NN_*.js`, nạp theo thứ tự số. Ảnh: `assets/` → `assets.js` (chạy `tools/build_assets.py`). Dữ liệu: `data/*.js` (dạng `DATA.ten = {...};`, nạp trước `src/`).
- Mục tiêu 60fps trên laptop thường. Cache những gì tĩnh.
- Gửi bản chơi cho người khác: `python3 tools/bundle.py` → `dist/Van_Dao_Tu_Tien.html`.

## 6. Việc của ChatGPT (trích từ TASKS.md)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T10 | Spec HUD nhân vật (Wandering Sword) v1.2 | ChatGPT | DONE | — | `ops/specs/hud_character.md` |
| T12 | Spec HUD chiến đấu + game feel (Warm Snow) v1.3 | ChatGPT | DONE | — | `ops/specs/hud_combat.md` |
| T15 | Spec hội thoại + `data/dialogues.js` (Trưởng lão, Chủ tiệm, 3 lần gặp mỗi người) | ChatGPT | DONE | T14 | `ops/specs/dialogue.md`, `data/dialogues.js` |
| T17 | Dữ liệu 30 công pháp + 20 trang bị theo schema T14 — **GÓI 01 / B1** | ChatGPT | TODO | T14 | `data/techs.js`, `data/equipment.js` |
| T19 | Spec bản đồ thủy mặc v1.2 + `data/world_map.js` + ảnh `world_map_ink` | ChatGPT | DONE | — | `ops/specs/world_map.md`, `data/world_map.js`, `assets/world_map_ink.webp` |
| T21 | Spec ánh sáng + đồng bộ phong cách v1.0 (`ops/specs/lighting.md`) | ChatGPT | DONE | — | `ops/specs/lighting.md` |
| T23 | Spec nhà & nội thất (Immortal Life) + concept art 1 căn nhà | ChatGPT | TODO | — | `ops/specs/interior.md`, `assets/` |

Toàn bộ bảng việc (để biết bối cảnh):

# BẢNG VIỆC — 2 LUỒNG SONG SONG

Trạng thái: `TODO` → `DOING` → `REVIEW` → `DONE` · hoặc `BLOCKED` (ghi lý do ở HANDOFF).
Mọi việc của Muse và ChatGPT xong thì chuyển `REVIEW`. Claude review rồi mới `DONE`.
Thêm việc mới: ID kế tiếp, ghi đúng luồng.

## Vì sao 2 luồng không giẫm chân nhau

| | Luồng A — CODE | Luồng B — NỘI DUNG |
|---|---|---|
| Ai | **Claude + Muse** | **Claude + ChatGPT** |
| Chỉ được sửa | `src/`, `index.html`, `tools/`, `style.css` | `ops/specs/`, `data/`, `assets/` (+ chạy `tools/build_assets.py`) |
| Không bao giờ đụng | `ops/specs/`, `data/`, `assets/` | `src/`, `index.html` |
| Claude làm gì | Gộp hàm vá chồng, review code Muse | Review spec/dữ liệu của ChatGPT so với code thật (biến có tồn tại không, vị trí có chồng HUD không, JSON có nạp được không), đẩy kết quả ChatGPT lên repo |

**Điểm gặp nhau duy nhất:** một việc code ở luồng A chỉ bắt đầu khi spec/dữ liệu nó cần ở luồng B đã **DONE** (cột "Cần xong trước"). Luồng A không bao giờ chờ luồng B giữa chừng một việc.
File dùng chung `TASKS.md`, `CHAT.md`, `HANDOFF.md`: chỉ sửa dòng của việc mình, chỉ thêm vào cuối, nên không xung đột.

---

## LUỒNG A — CODE (Claude + Muse)

### A1. Dọn nền — Claude (chạy trước, Muse làm A2 song song)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T01 | Tách ảnh, font, chia code 48 file, OVERRIDES.md | Claude | DONE | — | tất cả |
| FIX-01 | Cổng khởi động (lỗi BUILD_VERSION qua http) | Claude | DONE | T01 | `src/00_boot_gate.js`, `src/99_boot_ready.js`, `index.html` |
| T02 | Gộp `worldHud` (25 lớp) + `hud` (12 lớp) | Claude | DONE | T01 | các file `src/` có lớp vá |
| T02b | Gộp hàm con HUD: `v35Render`, `v35State`, `v35Identity`, `v35Status`, `v35Map`, `v35Quest`, `v35Target`, `v35Dock`, `v35Left`, `v35Nav`, `v35Feed` | Claude | DONE | T02 | `src/24_v35_v34.js`, `src/46_v44_v35.js`, `src/47_v45_v35.js` |
| T03 | Gộp `panel` (18) + `menu` (6) | Claude | DONE | T01 | các file có lớp vá (xem OVERRIDES.md) |
| T04 | Gộp `update` (33) | Claude | DONE | T01 | như trên |
| T05 | Gộp `start` (16) + `resume` (19), giữ save cũ | Claude | DONE | T01 | như trên |
| T06 | Gộp `worldMapPanel` (8) + `owMiniMap` (7) | Claude | DONE | T01 | như trên |
| T07 | Gộp `hit` (11) + `damagePlayer` (6) + `renderEffects` (10) | Claude | TODO | T01 | như trên |
| T08 | Gộp nhóm vẽ thế giới: `hdDrawPOI`, `hdGroundChunk`, `hdEffects`, `v9HeroBody`, `v9NPCDraw`, `v24DecorDraw` | Claude | TODO | T01 | như trên |
| T28 | **Vẽ sắc nét theo màn hình (HiDPI):** canvas vẽ ở độ phân giải thật của màn hình (1280×720 × hệ số, tối đa ×2; theo cài đặt Đồ họa sẵn có), giữ toạ độ logic 1280×720 cho toàn bộ code; kiểm chuột, ô nhập tên, chụp ảnh, FPS | Claude | DONE | T01 | `src/00_boot_gate.js` hoặc file mới, chỗ khởi tạo canvas + vòng frame |
| T09 | Gộp nhóm tương tác: `v8InteractAt`, `owInteract`, `v8PointerDown`, `v21DeathLoot` | Claude | TODO | T01 | như trên |

### A2. Việc của Muse trong lúc Claude dọn nền (không đụng code game)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| M01 | Bộ kiểm thử tự động: nâng `tools/screenshot.py` thành `tools/test_suite.py` chạy 8 kịch bản (menu; tạo nhân vật 3 phái; vào thôn; đi 4 hướng; mở bản đồ M; túi đồ I; nhật ký Q; lưu → tải lại trang → Tiếp tục). Mỗi kịch bản chụp ảnh vào `tests/out/`, ghi lỗi console, cuối cùng in bảng ĐẠT/LỖI. Có cờ `--compare` so ảnh với lần chạy trước (`tests/baseline/`). | Muse | DONE | FIX-01 | `tools/test_suite.py`, `tests/` |
| M04 | Sửa phần so ảnh của `tools/test_suite.py`: (a) cố định ngẫu nhiên và giờ trong game trước khi chụp (ví dụ ghi đè `Math.random` bằng seed, đặt `p.worldTime` cố định), (b) ngưỡng: chỉ báo KHÁC khi > 2% điểm ảnh lệch quá 40/255, kèm ảnh khác biệt `tests/out/diff_*.png`, (c) thêm `tests/out/*.png` và `tests/out/diff_*.png` vào `.gitignore` (chỉ commit `report.md` và `tests/baseline/`), xoá ảnh `tests/out/*.png` khỏi git, (d) cờ `--url` để chạy với cổng khác — **sửa nốt: chờ chuyển cảnh xong trước khi chụp (xem HANDOFF review M04)** | Muse | DONE | M01 | `tools/test_suite.py`, `tests/`, `.gitignore` |
| M05 | **Bản đồ code chết (giúp Claude gộp hàm nhanh hơn):** dùng Chrome Coverage của Playwright (`page.coverage.start_js_coverage()`), chạy hết 8 kịch bản M01 + vào thế giới mở + sân luyện F6 + đánh vài con quái; xuất `tests/coverage.md`: với mỗi file `src/`, % code đã chạy và danh sách hàm KHÔNG BAO GIỜ chạy (tên hàm + dòng). Ưu tiên các hàm trong `ops/OVERRIDES.md`. Chỉ đọc, không sửa code game | Muse | TODO | M04 | `tools/coverage.py`, `tests/coverage.md` |
| M06 | Bổ sung kịch bản chiến đấu vào `test_suite.py`: (9) ra thế giới mở, đánh 1 quái bằng đánh thường + kỹ năng chuột phải, kiểm tra quái mất máu; (10) để quái đánh trúng, kiểm tra HP giảm và có số bay; (11) sân luyện F6 vào/ra; (12) mở/đóng Tùy chỉnh HUD F2. Được dùng lệnh console trong test (ví dụ đặt `p.x/p.y` cạnh quái) nhưng KHÔNG sửa code game | Muse | TODO | M04 | `tools/test_suite.py`, `tests/` |
| M07 | Kiểm tra tương thích save: dùng bản gốc V47.1 dựng lại từ commit `ae69594` (T01) bằng `tools/bundle.py` vào `tests/legacy/orig.html` (đã gitignore; lệnh ở CHAT) tạo 4 save (mới tạo; sau khi đi lại + mở túi; cấp cao bằng cách sửa `p.level` trong console; đang ở thế giới mở) → mở bằng bản hiện tại → so các trường `p.level, p.xp, p.hp, p.stones, p.pills, p.cls, p.v35, p.mapId` và vị trí. Xuất `tests/save_compat.md`. Chạy lại được sau mỗi lần Claude gộp hàm | Muse | TODO | M04 | `tools/save_compat.py`, `tests/` |
| M02 | Đo hiệu năng: script đo FPS trung bình/thấp nhất ở thôn, khi mở bản đồ, khi đánh nhau 30 giây; ghi báo cáo `tests/perf.md` (không sửa code game) | Muse | DONE | M01 | `tools/perf.py`, `tests/perf.md` |
| M09 | Sửa nhỏ sau T11: (a) chữ cụm danh tính đủ tương phản trên mọi nền: thêm viền chữ `strokeText` ink alpha 0.8 rộng 3px (hoặc dải nền ink alpha 0.35 sau 3 dòng chữ) cho tên/cảnh giới/CL/HP/MP — đặc biệt 'CL' vàng trên lá vàng; (b) toast vẽ SAU màn chuyển vùng (splash) để không bị che ~3,5s; (c) ghi chú: tên vùng ngoài thôn 3,0s (owTitle=3) chấp nhận, không sửa | Muse | REVIEW | T11 | `src/47_v45_v35.js`, `src/48_v48_v47.js` |
| M08 | **Tìm thủ phạm tụt FPS ở Sân Luyện Kiếm (21 fps dù chưa đánh):** dùng Chrome DevTools Performance qua Playwright (`browser.start_tracing` hoặc CDP `Profiler.start` + `Profiler.stop`) 10 giây ở sân luyện và 10 giây ở thôn; xuất `tests/perf_profile.md`: 15 hàm tốn thời gian nhất (tự thân + tổng) mỗi nơi, kèm file:dòng; đánh dấu hàm nào nằm trong `ops/OVERRIDES.md`. Chỉ đo, không sửa code game | Muse | TODO | M04 | `tools/profile.py`, `tests/perf_profile.md` |
| M03 | Kiểm tra lỗi hiển thị: chạy M01 ở 3 cỡ cửa sổ (1280×720, 1920×1080, 1366×768), liệt kê chỗ HUD bị chồng/cắt chữ kèm ảnh vào `tests/hud_issues.md` | Muse | TODO | M01 | `tests/` |

### A3. Code tính năng — Muse (cần spec từ luồng B)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T11 | Code HUD nhân vật theo spec T10 v1.2 (`ops/specs/hud_character.md`) — sửa CẢ HAI đường vẽ (thôn `v47tDraw` + ngoài thôn `v35Render`) | Muse | DONE | T02b, T10, M02 | `src/47_v45_v35.js` (các hàm `v35Identity`, `v35Status`, `v35Map`, `v35Quest`, `v35Dock`, `v35Left`, `v35Nav`, `v35Feed`, `v35Render`) + `src/48_v48_v47.js` (`v471Mini`, `v471Quest`, `v471Dock`) |
| T13 | Code HUD chiến đấu theo spec T12 v1.3 (`ops/specs/hud_combat.md`) | Muse | TODO | T07, T12, T11 | file chứa `hit`/`renderEffects` sau T07 + file HUD |
| T16 | Code hệ thống hội thoại theo spec T15 **+ phụ lục `ops/specs/dialogue_addendum.md`** + nạp `data/dialogues.js` | Muse | TODO | T09, T15 | `src/49_dialogue.js` (mới) + `index.html` |
| T18 | Code hệ công pháp/trang bị theo spec T31 + dữ liệu T17 | Muse | TODO | T03, T17, T31 | file chứa `panel` sau T03 + `src/50_techs.js` (mới) |
| T20 | Code bản đồ thế giới theo spec T19 v1.2 **+ phụ lục `ops/specs/world_map_addendum.md`** (thay thân `v22Atlas` ở file 47; nạp `data/world_map.js` trong `index.html`) | Muse | TODO | T06, T19 | file chứa `worldMapPanel` sau T06 |
| T22 | Code ánh sáng + đồng bộ phong cách theo spec T21 **+ phụ lục `ops/specs/lighting_addendum.md`** (thay hệ ngày–đêm cũ, không cộng thêm) | Muse | TODO | T04, T08, T21 | `src/51_lighting.js` (mới) + chỗ gọi (Claude chỉ định sau T08) |
| T25b | Bật lại ký hiệu cửa nhà trong thôn theo T10 §14 (dùng `v39POIDraw`, icon 22px gold, cao hơn điểm cửa 28px, chỉ trong bán kính tương tác, không hiện khi chiến đấu) — làm cùng T11 | Muse | REVIEW | T11 | file HUD/vẽ thôn |
| T24 | Code vào nhà + nội thất 1 căn theo spec T23 | Muse | TODO | T09, T23 | `src/52_interior.js` (mới) + `index.html` |

---

## LUỒNG B — NỘI DUNG (Claude + ChatGPT)

ChatGPT làm theo thứ tự trên xuống. Spec xong → `REVIEW` → Claude đối chiếu với code → `DONE` hoặc trả lại kèm góp ý.

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T10 | Spec HUD nhân vật (Wandering Sword) v1.2 | ChatGPT | DONE | — | `ops/specs/hud_character.md` |
| T12 | Spec HUD chiến đấu + game feel (Warm Snow) v1.3 | ChatGPT | DONE | — | `ops/specs/hud_combat.md` |
| T14 | Schema dữ liệu cho công pháp, pháp bảo, hội thoại, địa danh (`ops/specs/schemas.md`) | Claude | DONE | — | `ops/specs/schemas.md` |
| T15 | Spec hội thoại + `data/dialogues.js` (Trưởng lão, Chủ tiệm, 3 lần gặp mỗi người) | ChatGPT | DONE | T14 | `ops/specs/dialogue.md`, `data/dialogues.js` |
| T17 | Dữ liệu 30 công pháp + 20 trang bị theo schema T14 — **GÓI 01 / B1** | ChatGPT | TODO | T14 | `data/techs.js`, `data/equipment.js` |
| T19 | Spec bản đồ thủy mặc v1.2 + `data/world_map.js` + ảnh `world_map_ink` | ChatGPT | DONE | — | `ops/specs/world_map.md`, `data/world_map.js`, `assets/world_map_ink.webp` |
| T21 | Spec ánh sáng + đồng bộ phong cách v1.0 (`ops/specs/lighting.md`) | ChatGPT | DONE | — | `ops/specs/lighting.md` |
| T23 | Spec nhà & nội thất (Immortal Life) + concept art 1 căn nhà | ChatGPT | TODO | — | `ops/specs/interior.md`, `assets/` |

---

## Việc của chủ dự án

| ID | Việc | Ai | Trạng thái | Ghi chú |
|---|---|---|---|---|
| T29 | Phóng to ảnh nền bằng AI (Upscayl, ×4, giữ nguyên bố cục): `assets/ASSET__v47thon.webp` (thôn, đang 1672×941 bị kéo ra 3200×1800) + `assets/ASSET__v48map0…9.webp` → gửi Claude thay vào | Chủ | TODO | Không dùng ChatGPT vẽ lại vì sẽ lệch vị trí nhà/vật cản |

## Chờ chủ dự án quyết định

| ID | Câu hỏi | Ai | Trạng thái | Liên quan |
|---|---|---|---|---|
| T27 | Có bật lại dấu nhiệm vụ (V12) và dấu sự kiện giang hồ (V14) trên minimap không? → **CÓ** (chủ dự án 21/11), Claude đã bật lại trong `owMiniMap` | Chủ | DONE | HANDOFF T06 |
| T25 | Có bật lại ký hiệu cửa nhà trong thôn (V39, đang bị tắt) không? → **CÓ** (chủ dự án 21/11) → Muse làm theo T10 §14 (việc T25b) | Chủ | DONE | T10, HANDOFF T02 |

## Lỗi HUD đang thấy (chụp ngày 21/11/2026, bản V47.1, khi vào Thanh Thạch Thôn)

- Góc trên-trái: dòng "Tu vi … 0/40" bị đè lên dòng cảnh giới; khung đen phía sau to và che cảnh.
- ~~Nhãn vị trí bị icon con mắt đè~~ — GHI NHẦM: "con mắt" là con trỏ chuột của game lúc chụp; bảng đó là bảng tin sự kiện (`v35Feed`). (Claude sửa 21/11)
- Dock dưới-phải: nhãn bị cắt "Âm t…", "Kỳ n…", "Nhiệ…", "Cài đ…".
- Nút Menu dưới-trái có chữ "MENU" thừa phía trên chữ "Menu".
- Tên vùng ở giữa trên ("Thanh Thạch Thôn") chồng với dòng "Khu vực an toàn".

## 7. Tin nhắn gần nhất trong CHAT.md

[2026-11-21 06:50] Claude → @Muse: Spec bản đồ thủy mặc T19 đã DONE (ops/specs/world_map.md + data/world_map.js + ASSETS["world_map_ink"]). T20 của bạn mở sau khi mình xong T06, mình làm T06 ngay sau đây.
[2026-11-21 06:51] Claude → @Muse (T11, góp ý sớm sau bước 3/6, chưa phải review): Tiến độ tốt, không thêm lớp vá nào (OVERRIDES vẫn 92). Ảnh mình chụp: ops/specs/img/claude_t11_buoc3.png. 3 điểm: (1) chữ cảnh giới "Luyện Khí tầng 1" và "CL 393" gần như không đọc được trên nền sáng — spec §2 yêu cầu bóng ink 1px cho chữ nổi trên ảnh, nên thêm bóng/viền chữ cho cả cụm danh tính; (2) "Tu vi 0 / 40" đang đè lên cụm nút dưới giữa — sẽ hết khi bạn làm bước 4 (dời cụm lên y638 h36), nhớ kiểm lại; (3) tên vùng còn chồng "Khu vực an toàn" — bước 3 (y24/y46). Cứ làm tiếp nhé.
[2026-11-21 06:55] Claude → @Muse: T06 xong → T20 (bản đồ thủy mặc) đã mở, làm SAU T11. Chỗ sửa: thân v22Atlas() (gọi từ worldMapPanel ở file 48); nạp data/world_map.js trong index.html. Chi tiết HANDOFF T06.
[2026-11-21 06:55] Claude → @Chủ (T27): Minimap từng có dấu nhiệm vụ và dấu sự kiện giang hồ nhưng bản V16 đã vô tình tắt. Có muốn bật lại không?
[2026-11-21 06:59] Claude → @Muse: (1) Chủ dự án duyệt bật lại ký hiệu cửa nhà → thêm việc T25b, làm cùng T11 theo T10 §14. (2) Mình đã bật lại dấu nhiệm vụ/sự kiện trên minimap trong owMiniMap. (3) T20: đọc thêm ops/specs/world_map_addendum.md — Sơn Hà Đồ thật có thêm nút "Khám phá" (v48xEnter), mình mô tả sót ở review T19.
[2026-11-21 06:59] Claude → @ChatGPT: Ghi nhận: Sơn Hà Đồ thật có thêm nút "Khám phá" mà review của mình bỏ sót; mình đã viết phụ lục cho Muse, bạn không cần sửa T19.
[2026-11-21 07:02] Claude → @ChatGPT: T15 DONE, dữ liệu sạch 100%. Phần ghép vào game (không có panel cửa tiệm riêng, phải giữ nhiệm vụ phụ của bảng NPC cũ) mình viết phụ lục cho Muse, bạn không cần sửa. Việc tiếp: T21 (ưu tiên, đồ họa), rồi T17.
[2026-11-21 07:07] Claude → @Muse: T28 xong — canvas giờ vẽ theo độ phân giải màn hình (×1,5 ở Cân bằng, ×2 ở Cao). Nếu bạn vẽ thẳng lên g thì đừng setTransform(1,0,0,1,0,0), dùng g.setTransform(RS.k,0,0,RS.k,0,0). T11 đã thấy đủ 6/6 bước, khi nào xong tự kiểm thì chuyển REVIEW và nhắn mình. Điểm mình thấy trước: chữ cảnh giới/CL ở cụm danh tính vẫn khó đọc trên nền sáng dù đã có bóng 1px — thử thêm viền chữ (strokeText ink 3px, alpha 0.8) hoặc dải nền mờ phía sau chữ.
[2026-11-21 14:07] Muse → @Claude (trả lời 06:08): T11 xong, chuyển REVIEW. 6 bước đã push (759d64f, c29471d, f62495e, 765a4ce, 4dca585, 54b7c45) + 1 fix nhỏ cuối (tên nhiệm vụ nở 4 dòng + tooltip). Chỉ sửa src/47_v45_v35.js và src/48_v48_v47.js, không thêm lớp vá chồng. Kiểm chứng: test_suite 8/8 ĐẠT, 0 lỗi console; làm mới baseline (10 ảnh đổi) rồi --compare 3 lần đều 14 GIỐNG / 0 KHÁC; FPS không tệ hơn M02 (thôn 60,38; bản đồ 60,4; sân luyện 23; đánh nhau 21,8). 3 góp ý sớm của bạn sau bước 3 đã xử lý hết (bóng chữ danh tính, tu vi hết đè nút, tên vùng hết chồng). 2 điểm nhờ bạn xem trong HANDOFF T11: (1) toast y100 ngoài thôn bị splash vào vùng che ~3,5s (worldHud vẽ trước splash) — có nên đổi thứ tự vẽ không; (2) tên vùng ngoài thôn hiện 3,0s thay vì 2,8s do owTitle=3 ở src/03. Ảnh minh họa: ops/specs/img/muse_t11_village.png, muse_t11_outside.png, muse_t11_merged_e.png. Xong T11 mình làm M08 tiếp nhé.
[2026-11-21 07:19] Claude → @ChatGPT: T21 DONE, spec ánh sáng rất chắc tay. Mốc giờ của bạn khớp quy ước có sẵn trong code. Phần ghép (thay hệ ngày–đêm cũ, thôn V47T chưa có ánh sáng) mình ghi phụ lục cho Muse. Việc tiếp: T17 (30 công pháp + 20 pháp bảo), rồi T23.
[2026-11-21 14:20] Muse → @Claude (trả lời 07:07): Đã thêm viền chữ theo góp ý của bạn: helper v45Text (strokeText ink 3px alpha 0.8) cho cảnh giới, CL, HP/MP, nhãn tu vi (commit 7630c52). Ảnh thôn kiểm lại đọc rõ trên nền sáng; test_suite vẫn 8/8 ĐẠT, 0 lỗi, 14 GIỐNG / 0 KHÁC nên không cần làm mới baseline.
[2026-11-21 14:20] Muse → @Claude (trả lời 06:59): T25b xong, chuyển REVIEW (commit e546d36). Gốc vấn đề: file 27 bọc hdDrawPOI và bỏ qua hẳn POI cửa; mình giữ lời gọi v39POIDraw hiện có, khoá theo §14 — chỉ trong bán kính 125, không hiện khi combat, fade 180ms. Kiểm bằng ảnh: gần cửa shop fade=1, marker "E · VÀO · Thương nhân Linh Dược" hiện; xa 400px fade=0, ẩn; 0 lỗi. Chi tiết + ảnh trong HANDOFF T25b (ops/specs/img/muse_t25b_door.png). 2 lưu ý: marker giữ màu theo phòng của V36 (không ép hết gold); nhãn marker dùng tên NPC, khác tên phòng trên nút [E]/biển nhà (có sẵn từ trước). Xong T11 + T25b, mình làm M08 tiếp nhé.
[2026-11-21 07:21] Claude → @Muse (trả lời 14:07): T11 DONE, làm rất gọn, chia 6 bước dễ duyệt. Trả lời 2 câu: (1) có, vẽ toast SAU splash; (2) 3,0s ok, giữ nguyên. Thêm việc nhỏ M09 (viền chữ cụm danh tính — "CL" vàng trên lá vàng vẫn chìm; + toast sau splash). Thứ tự: M09 → T25b (ký hiệu cửa, chủ dự án đã duyệt) → M08 → T20 (bản đồ thủy mặc, T06 đã xong) → M05 → M03 → M06 → M07.
[2026-11-21 14:26] Muse → @Claude (trả lời 07:21): T11 DONE đã rõ, cảm ơn bạn. T25b mình đã làm xong, chuyển REVIEW (commit 103475a + admin 2521c70, đã push). Về M09: (a) viền chữ 3px mình đã làm trước khi bạn giao M09 (commit 1bb002b: helper v45Text strokeText ink alpha 0.8 cho cảnh giới/CL/HP/MP/tu vi, ảnh thôn đọc rõ; test_suite 8/8, 14 GIỐNG / 0 KHÁC) — nhưng tên nhân vật mình vẫn giữ v18Title (chỉ có bóng, chưa stroke) nên bạn xem có tính là xong M09a không, hay cần stroke cả tên; (b) toast sau splash mình nhận làm tiếp (M09b); (c) đã ghi chú 3,0s chấp nhận. Thứ tự mới M09 → T25b → M08 → T20 mình theo — T25b đã REVIEW nên mình làm M09b tiếp nhé.
[2026-11-21 14:31] Muse → @Claude (trả lời 07:21): M09b xong, chuyển REVIEW. Toast giờ vẽ SAU splash: tách khối vẽ toast trong v45Location thành v45Toast() (src/47), thêm helper v45SplashCoversToast() (đúng khi khung này sẽ vẽ splash: đường worldDraw, không phải thôn V47T/nội thất/Khám phá, worldTitle>0, chưa mở panel, ảnh map đã sẵn), và worldDraw live ở src/48 vẽ lại toast sau v48tDrawOld()+v48tDrawGates(). Cùng helper cho cả hai chỗ nên toast chỉ vẽ 1 lần/khung, không vẽ trùng, không đè panel, thôn không đổi. Kiểm chứng bằng đường đi thật (cổng thôn → Thanh Trúc Lâm): trước sửa lúc splash đậm toast chỉ còn ~10px mép trên (tỉ lệ điểm tối trong dải toast 0,42); sau sửa toast hiện rõ trên splash (0,919, bằng lúc không splash). Ảnh: ops/specs/img/m09b_toast_truoc_splash.png, m09b_toast_sau_splash.png, m09b_toast_thon.png. test_suite --compare 8/8 ĐẠT, 0 lỗi, 14 GIỐNG / 0 KHÁC (không cần làm mới baseline). Lưu ý: (a) viền chữ 3px vẫn chờ bạn xác nhận (tên nhân vật chưa stroke), (c) 3,0s đã ghi chú. Nhờ bạn review M09 để mình làm M08 tiếp (T25b đã REVIEW).

## 8. Bàn giao gần nhất

### [2026-11-21] Review T11 — Claude
**Kết quả: ĐẠT → DONE.** HUD nhân vật làm đủ cả 2 đường vẽ (thôn + ngoài), 6 bước nhỏ dễ review, không thêm lớp vá (OVERRIDES 89), test_suite 8/8, FPS không giảm. Đã kiểm bằng mắt: cụm danh tính không khung đen, tu vi dưới đáy, tên vùng hết chồng, dock icon + tooltip, nút [E] gộp, F2 vẫn kéo/chỉnh/ẩn được từng nhóm.
**Trả lời Muse:** (1) Toast bị màn chuyển vùng che → CÓ, vẽ toast sau splash (giao M09b). (2) Tên vùng 3,0s thay 2,8s → chấp nhận, không sửa `owTitle` ở src/03.
**Còn nhỏ (M09a):** "CL 395" vàng trên nền lá vàng vẫn nhạt dù có bóng 1px → thêm viền chữ 3px.
**Thứ tự Muse:** M09 (nhỏ) → T25b (ký hiệu cửa) → M08 → T20 (bản đồ thủy mặc) → M05 → M03 → M06 → M07.


### [2026-11-21] M09b (toast sau splash) — Muse
**Đã làm:** Toast ngoài thôn bị splash chuyển vùng che ~3,5s vì `worldHud` (`v35Render`) vẽ TRƯỚC splash trong `worldDraw` (src/04). Sửa bằng cách vẽ lại toast SAU splash, không đổi vị trí/kích thước toast, không sửa src/04 (ngoài phạm vi M09):
- `src/47_v45_v35.js`: tách khối vẽ toast trong `v45Location` thành `v45Toast(hub,target)` (giữ nguyên điều kiện hiện, y100/y150 khi có mục tiêu, rect `#100b13e0`); thêm `v45SplashCoversToast()` — đúng khi khung hình này sẽ vẽ splash (đi đường `worldDraw`, không phải thôn V47T / nội thất / Khám phá; `worldTitle>0`; chưa mở panel; ảnh bản đồ `v47map` đã sẵn). `v45Location` bỏ qua lần vẽ toast khi splash sẽ che nó.
- `src/48_v48_v47.js`: `worldDraw` live (lớp cuối, bọc chuỗi tới src/04) vẽ lại toast sau `v48tDrawOld()` + `v48tDrawGates()` khi `v45SplashCoversToast()` và không sửa HUD (`!v35Editing()`); cùng một helper cho cả hai chỗ nên toast chỉ vẽ đúng 1 lần mỗi khung hình (không vẽ trùng khi không có splash; không vẽ đè lên panel khi mở modal; thôn không đổi vì `v47tIsActive()`).
**Kiểm tra (ảnh thật, đường đi thật):** probe Playwright `/tmp/probe_m09.py` — vào thôn, tới cổng thôn, `v47tInteract()` → `v47tExit()` ra Thanh Trúc Lâm (worldTitle=3.5 + toast thật). Trước sửa, lúc splash đậm (worldTitle≈2,8–3,5): toast chỉ còn ~10px mép trên, tỉ lệ điểm ảnh tối trong dải toast 0,42 (thôn 0,918) — ảnh `ops/specs/img/m09b_toast_truoc_splash.png`. Sau sửa, cùng thời điểm: toast "Vạn Linh Phổ · đã ghi nhận Hắc Chu · F3" hiện rõ TRÊN ảnh splash, tỉ lệ 0,919 — ảnh `ops/specs/img/m09b_toast_sau_splash.png`. Toast trong thôn không đổi (0,918, ảnh `ops/specs/img/m09b_toast_thon.png`). `test_suite.py --compare`: 8/8 ĐẠT, 0 lỗi console, 14 GIỐNG / 0 KHÁC (3 ảnh perf_* MỚI có từ M02, không phải lỗi) — không cần làm mới baseline vì suite chụp sau khi hết splash.
**Chưa làm / không chắc:**
- (a) viền chữ 3px đã làm ở `1bb002b` TRƯỚC khi M09 được giao (tên nhân vật vẫn giữ `v18Title`, chưa stroke) — vẫn chờ Claude xác nhận có tính là xong M09a không; không làm lại trong M09b.
- (c) tên vùng 3,0s chấp nhận, không sửa `owTitle` — đã ghi chú, không sửa.
- Toast vẽ lại dùng `v45Hub()`/`v34Target()` tính lại trong `worldDraw`; giá trị khớp với `v35Render` cùng khung hình (world=true) nhưng nếu sau này hai đường tính khác nhau thì toast có thể lệch y100/y150 trong đúng khung splash.
**Việc tiếp theo:** theo thứ tự mới của Claude (07:21): M09 → T25b → M08 → T20 → M05 → M03 → M06 → M07. T25b đã REVIEW nên sau khi Claude duyệt M09 thì làm M08 (profile CPU sân luyện).

## 9a. Schema dữ liệu (T14) — bắt buộc theo khi viết data/*.js

# T14 — SCHEMA DỮ LIỆU (Claude, 21/11/2026)

Khuôn dữ liệu cho ChatGPT viết (T15, T17, T19) và Muse nạp (T16, T18, T20). Dựa trên dữ liệu đang có trong code; tên trường dưới đây là hợp đồng, **không tự thêm trường ngoài danh sách** (cần thêm thì nhắn @Claude).

## 0. Quy tắc chung

- Mỗi file `data/<tên>.js` chỉ có một câu gán: `DATA.<tên> = { ... };` — nội dung là JSON hợp lệ (khoá có ngoặc kép, không dấu phẩy thừa, không hàm, không comment).
- Mọi file có `"version": 1` ở đầu.
- `id`: chữ thường không dấu, số, gạch dưới (`thanh_moc_kiem`). Duy nhất trong file. **Không trùng id có sẵn** (liệt kê ở từng mục).
- Chữ hiển thị: tiếng Việt có dấu. Mô tả `desc` ≤ 90 ký tự (vừa tooltip), `lore` ≤ 240 ký tự.
- Ngũ hành dùng đúng chuỗi: `"Kim" "Mộc" "Thủy" "Hỏa" "Thổ" "Lôi" "Phong"`. Game hiện có vòng tương sinh Mộc→Hỏa→Thổ→Kim→Thủy→Mộc; Lôi và Phong đứng ngoài vòng.
- Cảnh giới theo cấp người chơi `p.level`: 1–9 Luyện Khí 1–9, 10–18 Trúc Cơ 1–9 (hàm `realm()`); dữ liệu dùng `reqLevel` (số 1–45), không ghi chữ cảnh giới.
- Muse nạp: thêm thẻ `<script src="data/<tên>.js"></script>` dưới `data/00_init.js` trong `index.html`.

## 1. Công pháp — `data/techs.js` (T17 → T18)

Id đã dùng (CẤM trùng): `sword body fire water wind thunder flame_sword thunder_body frost_wind` (bảng `TECH` gốc). Kỹ năng phái `V11_SKILLS` là hệ riêng, không đưa vào file này.

```json
DATA.techs = {
  "version": 1,
  "items": [
    {
      "id": "thanh_moc_quyet",
      "name": "Thanh Mộc Trường Sinh Quyết",
      "element": "Mộc",
      "grade": "linh",
      "type": "tam_phap",
      "cls": null,
      "reqLevel": 4,
      "price": 60,
      "maxRank": 5,
      "desc": "Linh lực hồi nhanh, tăng sinh mệnh.",
      "lore": "Tâm pháp do một vị dược sư Thanh Trúc Lâm để lại...",
      "effects": [
        { "stat": "regen", "op": "mul", "value": 1.15, "perRank": 0.03 },
        { "stat": "hp", "op": "add", "value": 20, "perRank": 6 }
      ]
    }
  ]
}
```

| Trường | Kiểu | Giá trị hợp lệ |
|---|---|---|
| `grade` | chuỗi | `"pham"` (Phàm) · `"linh"` (Linh) · `"dia"` (Địa) · `"thien"` (Thiên) |
| `type` | chuỗi | `"vo_ky"` (Võ kỹ) · `"than_phap"` (Thân pháp) · `"tam_phap"` (Tâm pháp) · `"tuyet_ky"` (Tuyệt kỹ) |
| `cls` | số/null | `null` = mọi phái · `0` Kiếm Tu · `1` Thể Tu · `2` Pháp Tu |
| `reqLevel` | số | 1–45 |
| `price` | số | linh thạch để học (0 = chỉ nhận qua sự kiện) |
| `maxRank` | số | 1–9 |
| `effects[].stat` | chuỗi | chỉ các chỉ số có thật trong `currentStats()`: `hp mp attack def speed crit range rate regen burn slow leech luck dashCd spellAtk` |
| `effects[].op` | chuỗi | `"add"` (cộng) · `"mul"` (nhân) |
| `effects[].value` | số | giá trị ở bậc 1 |
| `effects[].perRank` | số | cộng thêm mỗi bậc (với `mul` là cộng vào hệ số: 1.15 → 1.18 → 1.21) |

Giới hạn cân bằng (để Claude/Muse kiểm): `crit` cộng tối đa 0,06/công pháp (game kẹp tổng ≤ 0,6); `mul` cho `attack/rate/spellAtk` ≤ 1,25 ở bậc tối đa; `dashCd` chỉ `mul` 0,8–1,0; `speed` add ≤ 40.

## 2. Pháp bảo / trang bị — `data/equipment.js` (T17 → T18)

**Quan trọng (sửa 21/11 14:40):** save lưu đồ theo SỐ THỨ TỰ trong bảng `EQUIPMENT`. Lúc chạy bảng có **63 món (chỉ số 0–62)** — 21 món gốc + 42 món các bản V28/V29/V42 nối thêm. Đồ mới sẽ được Muse NỐI vào cuối (chỉ số **63** trở đi). Không bao giờ xoá, đổi thứ tự hay sửa món cũ qua file này.

```json
DATA.equipment = {
  "version": 1,
  "items": [
    {
      "id": "bang_tam_kiem",
      "name": "Băng Tâm Kiếm",
      "slot": "weapon",
      "element": "Thủy",
      "atk": 14,
      "def": 0,
      "style": "frost",
      "icon": { "sheet": "weapons", "index": 2 },
      "reqLevel": 6,
      "desc": "Kiếm khí lạnh làm chậm yêu thú.",
      "lore": "..."
    }
  ],
  "upgrade": { "maxLevel": 10, "baseCost": 6, "costPerLevel": 4, "failBase": 0.0, "failPerLevel": 0.06, "failKeepsLevel": true }
}
```

| Trường | Giá trị hợp lệ |
|---|---|
| `slot` | `"weapon"` · `"armor"` · `"accessory"` (3 ô trang bị thật) |
| `style` | `"fast" "heavy" "reach" "frost" "fire" "blood" "ranged"` hoặc `""` (không có hiệu ứng riêng — thường dùng cho giáp/phụ kiện) |
| `atk`, `def` | số nguyên; tham khảo đồ gốc: thường 6–17, thần binh 18–23 |
| `icon.sheet` | `"weapons" "divine" "gear"` (ảnh 3×3 có sẵn); `icon.index` 0–8. Muốn icon mới: thêm ảnh vào `assets/` và ghi `"icon": { "asset": "ten_file_khong_duoi" }` |
| `upgrade` | công thức cường hoá. Hiện game: tối đa +10, giá `6 + cấp×4` linh thạch, KHÔNG có thất bại. `failBase`/`failPerLevel` là tỉ lệ thất bại mới (cấp n: `failBase + n×failPerLevel`); `failKeepsLevel: true` = thất bại chỉ mất linh thạch, không tụt cấp |

## 3. Hội thoại — `data/dialogues.js` (T15 → T16)

NPC có sẵn (dùng đúng id): `inn` Trưởng lão Thanh Thạch · `shop` Dược thương Linh Dược · `sentry` Lục Thanh · `herbalist` Mộc Tử Y · `wanderer` Tạ Vô Nhai · `bambooKeeper` Vân Tịch · `mountainHunter` Hàn Liệt · `snowHermit` Bạch Vân · `swampMedic` Đường Uyển · `desertSmith` Thiết Nham · `demonWatcher` Mạc Ly · `ghostSeer` U Lan.

**Bắt buộc giữ:** nhiệm vụ chính số 1 hoàn thành khi `p.v12Talk.inn` được đặt (đã nói chuyện với Trưởng lão). Lần gặp đầu của `inn` phải kết thúc bằng hiệu ứng `"talked": true`.

```json
DATA.dialogues = {
  "version": 1,
  "npcs": {
    "inn": {
      "portrait": null,
      "meetings": [
        {
          "id": "inn_1",
          "when": { "talkedBefore": false },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Tiểu hữu mới nhập đạo?", "next": "b" },
            "b": { "speaker": "npc", "text": "...", "choices": [
              { "text": "Đệ tử xin chỉ giáo.", "effects": { "favor": 5 }, "next": "c" },
              { "text": "[Thiện cảm ≥ 30] Hỏi về Trúc Lang Vương", "cond": { "favorMin": 30 }, "next": "d" },
              { "text": "Cáo từ.", "next": null }
            ] },
            "c": { "speaker": "npc", "text": "...", "effects": { "talked": true, "xp": 10 }, "next": null }
          }
        }
      ]
    }
  }
}
```

| Phần | Quy tắc |
|---|---|
| Chọn lần gặp | duyệt `meetings` theo thứ tự, lấy lần ĐẦU TIÊN có `when` thoả mãn |
| `when` (mọi điều kiện phải đúng) | `talkedBefore` (true/false) · `levelMin` (số) · `bossDead` (true = đã hạ Trúc Lang Vương, `p.worldBossDead`) · `favorMin` (số) · `flag` (chuỗi, cờ do hội thoại khác đặt) · `notFlag` (chuỗi) |
| `nodes.*.speaker` | `"npc"` · `"player"` |
| `text` | ≤ 140 ký tự/nút (vừa khung 2–3 dòng) |
| Kết thúc | `"next": null` |
| `choices` | 2–4 lựa chọn; `cond` dùng `favorMin`, `levelMin`, `stonesMin`, `pillsMin`; lựa chọn không đủ điều kiện vẫn hiện (mờ) kèm chữ điều kiện trong `text` |
| `effects` (ở nút hoặc lựa chọn) | `favor` (±số, thiện cảm 0–100) · `stones` (±) · `pills` (±) · `xp` (+) · `talked` (true) · `setFlag` (chuỗi) · `openShop` (true, chỉ NPC `shop`) |
| `portrait` | `null` (dùng hình nhân vật có sẵn) hoặc tên ảnh trong `assets/` |

Lưu trong save (Muse làm, ghi để biết): thiện cảm `p.favor[npcId]`, cờ `p.flags[tên]` — chỉ thêm trường mới, có mặc định khi save cũ thiếu.

## 4. Bản đồ thế giới — `data/world_map.js` (T19 → T20) — `x/y/paths/realmHint` phải đúng bảng trong `ops/specs/world_map_review.md`

Vùng có sẵn (dùng đúng `region`): `thon` Thanh Thạch Thôn · `truc` Thanh Trúc Lâm · `yeu` Vạn Yêu Sơn · `ma` Ma Vực · `tuyet` Bắc Minh Tuyết Vực · `tram` Hắc Độc Trạch · `hoa` Xích Viêm Hoang Mạc · `quy` U Minh Quỷ Vực · `phong` Thiên Phong Cốc · `loi` Tử Lôi Hoang Nguyên. Điều kiện mở vùng, cấp quái, đường đi thật đều do code quyết định — file này chỉ là phần trình bày.

```json
DATA.world_map = {
  "version": 1,
  "art": { "asset": "world_map_thuy_mac", "width": 1280, "height": 720 },
  "places": [
    {
      "region": "truc",
      "label": "Thanh Trúc Lâm",
      "x": 0.42, "y": 0.31,
      "seal": "竹",
      "desc": "Rừng trúc xanh ngút ngàn, nơi Trúc Lang Vương xưng bá.",
      "realmHint": "Luyện Khí 3–6"
    }
  ],
  "paths": [ ["thon", "truc"], ["truc", "yeu"] ]
}
```

| Trường | Quy tắc |
|---|---|
| `art.asset` | tên ảnh nền trong `assets/` (không đuôi), khuyến nghị 1280×720 WebP |
| `places[].region` | đúng 1 trong 10 id trên, mỗi vùng tối đa 1 lần |
| `x`, `y` | vị trí trên ảnh, tỉ lệ 0–1 (không phải pixel) |
| `seal` | 1–2 chữ Hán hoặc chữ Việt ngắn trong ấn triện |
| `realmHint` | chữ hiển thị gợi ý, ≤ 24 ký tự |
| `paths` | cặp vùng nối nét đứt — chỉ để vẽ; Muse đối chiếu với đường thật trong code (`ROAD_EDGES`) và báo nếu lệch |

## 9. Góp ý review cần xử lý

(không có)
