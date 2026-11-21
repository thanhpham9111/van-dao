# BRIEF CHO CHATGPT — Vạn Đạo Tu Tiên
Cập nhật: 2026-11-21 13:14 (giờ VN). Nếu chủ dự án gửi bản BRIEF mới hơn, bỏ bản cũ, dùng bản mới.

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
| T15 | Spec hội thoại + `data/dialogues.js` (Trưởng lão, Chủ tiệm, 3 lần gặp mỗi người) | ChatGPT | TODO | T14 | `ops/specs/dialogue.md`, `data/dialogues.js` |
| T17 | Dữ liệu 30 công pháp + 20 pháp bảo theo schema T14 | ChatGPT | TODO | T14 | `data/techs.js`, `data/equipment.js` |
| T19 | Spec bản đồ thủy mặc + ảnh nền bản đồ (Mịch Trường Sinh) | ChatGPT | TODO | — | `ops/specs/world_map.md`, `assets/` |
| T21 | Spec ánh sáng & cảnh quan: bảng màu theo giờ và theo vùng | ChatGPT | TODO | — | `ops/specs/lighting.md` |
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
| T04 | Gộp `update` (33) | Claude | TODO | T01 | như trên |
| T05 | Gộp `start` (16) + `resume` (19), giữ save cũ | Claude | TODO | T01 | như trên |
| T06 | Gộp `worldMapPanel` (8) + `owMiniMap` (7) | Claude | TODO | T01 | như trên |
| T07 | Gộp `hit` (11) + `damagePlayer` (6) + `renderEffects` (10) | Claude | TODO | T01 | như trên |
| T08 | Gộp nhóm vẽ thế giới: `hdDrawPOI`, `hdGroundChunk`, `hdEffects`, `v9HeroBody`, `v9NPCDraw`, `v24DecorDraw` | Claude | TODO | T01 | như trên |
| T09 | Gộp nhóm tương tác: `v8InteractAt`, `owInteract`, `v8PointerDown`, `v21DeathLoot` | Claude | TODO | T01 | như trên |

### A2. Việc của Muse trong lúc Claude dọn nền (không đụng code game)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| M01 | Bộ kiểm thử tự động: nâng `tools/screenshot.py` thành `tools/test_suite.py` chạy 8 kịch bản (menu; tạo nhân vật 3 phái; vào thôn; đi 4 hướng; mở bản đồ M; túi đồ I; nhật ký Q; lưu → tải lại trang → Tiếp tục). Mỗi kịch bản chụp ảnh vào `tests/out/`, ghi lỗi console, cuối cùng in bảng ĐẠT/LỖI. Có cờ `--compare` so ảnh với lần chạy trước (`tests/baseline/`). | Muse | DONE | FIX-01 | `tools/test_suite.py`, `tests/` |
| M04 | Sửa phần so ảnh của `tools/test_suite.py`: (a) cố định ngẫu nhiên và giờ trong game trước khi chụp (ví dụ ghi đè `Math.random` bằng seed, đặt `p.worldTime` cố định), (b) ngưỡng: chỉ báo KHÁC khi > 2% điểm ảnh lệch quá 40/255, kèm ảnh khác biệt `tests/out/diff_*.png`, (c) thêm `tests/out/*.png` và `tests/out/diff_*.png` vào `.gitignore` (chỉ commit `report.md` và `tests/baseline/`), xoá ảnh `tests/out/*.png` khỏi git, (d) cờ `--url` để chạy với cổng khác — **sửa nốt: chờ chuyển cảnh xong trước khi chụp (xem HANDOFF review M04)** | Muse | TODO | M01 | `tools/test_suite.py`, `tests/`, `.gitignore` |
| M05 | **Bản đồ code chết (giúp Claude gộp hàm nhanh hơn):** dùng Chrome Coverage của Playwright (`page.coverage.start_js_coverage()`), chạy hết 8 kịch bản M01 + vào thế giới mở + sân luyện F6 + đánh vài con quái; xuất `tests/coverage.md`: với mỗi file `src/`, % code đã chạy và danh sách hàm KHÔNG BAO GIỜ chạy (tên hàm + dòng). Ưu tiên các hàm trong `ops/OVERRIDES.md`. Chỉ đọc, không sửa code game | Muse | TODO | M04 | `tools/coverage.py`, `tests/coverage.md` |
| M06 | Bổ sung kịch bản chiến đấu vào `test_suite.py`: (9) ra thế giới mở, đánh 1 quái bằng đánh thường + kỹ năng chuột phải, kiểm tra quái mất máu; (10) để quái đánh trúng, kiểm tra HP giảm và có số bay; (11) sân luyện F6 vào/ra; (12) mở/đóng Tùy chỉnh HUD F2. Được dùng lệnh console trong test (ví dụ đặt `p.x/p.y` cạnh quái) nhưng KHÔNG sửa code game | Muse | TODO | M04 | `tools/test_suite.py`, `tests/` |
| M07 | Kiểm tra tương thích save: dùng bản gốc V47.1 dựng lại từ commit `ae69594` (T01) bằng `tools/bundle.py` vào `tests/legacy/orig.html` (đã gitignore; lệnh ở CHAT) tạo 4 save (mới tạo; sau khi đi lại + mở túi; cấp cao bằng cách sửa `p.level` trong console; đang ở thế giới mở) → mở bằng bản hiện tại → so các trường `p.level, p.xp, p.hp, p.stones, p.pills, p.cls, p.v35, p.mapId` và vị trí. Xuất `tests/save_compat.md`. Chạy lại được sau mỗi lần Claude gộp hàm | Muse | TODO | M04 | `tools/save_compat.py`, `tests/` |
| M02 | Đo hiệu năng: script đo FPS trung bình/thấp nhất ở thôn, khi mở bản đồ, khi đánh nhau 30 giây; ghi báo cáo `tests/perf.md` (không sửa code game) | Muse | TODO | M01 | `tools/perf.py`, `tests/perf.md` |
| M03 | Kiểm tra lỗi hiển thị: chạy M01 ở 3 cỡ cửa sổ (1280×720, 1920×1080, 1366×768), liệt kê chỗ HUD bị chồng/cắt chữ kèm ảnh vào `tests/hud_issues.md` | Muse | TODO | M01 | `tests/` |

### A3. Code tính năng — Muse (cần spec từ luồng B)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T11 | Code HUD nhân vật theo spec T10 v1.2 (`ops/specs/hud_character.md`) — sửa CẢ HAI đường vẽ (thôn `v47tDraw` + ngoài thôn `v35Render`) | Muse | TODO | T02b, T10, M02 | `src/47_v45_v35.js` (các hàm `v35Identity`, `v35Status`, `v35Map`, `v35Quest`, `v35Dock`, `v35Left`, `v35Nav`, `v35Feed`, `v35Render`) + `src/48_v48_v47.js` (`v471Mini`, `v471Quest`, `v471Dock`) |
| T13 | Code HUD chiến đấu theo spec T12 v1.3 (`ops/specs/hud_combat.md`) | Muse | TODO | T07, T12, T11 | file chứa `hit`/`renderEffects` sau T07 + file HUD |
| T16 | Code hệ thống hội thoại + nạp `data/dialogues.js` | Muse | TODO | T09, T15 | `src/49_dialogue.js` (mới) + `index.html` |
| T18 | Code hệ công pháp/pháp bảo dùng dữ liệu T17 | Muse | TODO | T03, T17 | file chứa `panel` sau T03 + `src/50_techs.js` (mới) |
| T20 | Code bản đồ thế giới theo spec T19 | Muse | TODO | T06, T19 | file chứa `worldMapPanel` sau T06 |
| T22 | Code lớp ánh sáng + ngày đêm theo spec T21 | Muse | TODO | T04, T08, T21 | `src/51_lighting.js` (mới) + chỗ gọi (Claude chỉ định sau T08) |
| T24 | Code vào nhà + nội thất 1 căn theo spec T23 | Muse | TODO | T09, T23 | `src/52_interior.js` (mới) + `index.html` |

---

## LUỒNG B — NỘI DUNG (Claude + ChatGPT)

ChatGPT làm theo thứ tự trên xuống. Spec xong → `REVIEW` → Claude đối chiếu với code → `DONE` hoặc trả lại kèm góp ý.

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T10 | Spec HUD nhân vật (Wandering Sword) v1.2 | ChatGPT | DONE | — | `ops/specs/hud_character.md` |
| T12 | Spec HUD chiến đấu + game feel (Warm Snow) v1.3 | ChatGPT | DONE | — | `ops/specs/hud_combat.md` |
| T14 | Schema dữ liệu cho công pháp, pháp bảo, hội thoại, địa danh (dựa trên `TECHS`/`EQUIPMENT` có sẵn) | Claude | TODO | — | `ops/specs/schemas.md` |
| T15 | Spec hội thoại + `data/dialogues.js` (Trưởng lão, Chủ tiệm, 3 lần gặp mỗi người) | ChatGPT | TODO | T14 | `ops/specs/dialogue.md`, `data/dialogues.js` |
| T17 | Dữ liệu 30 công pháp + 20 pháp bảo theo schema T14 | ChatGPT | TODO | T14 | `data/techs.js`, `data/equipment.js` |
| T19 | Spec bản đồ thủy mặc + ảnh nền bản đồ (Mịch Trường Sinh) | ChatGPT | TODO | — | `ops/specs/world_map.md`, `assets/` |
| T21 | Spec ánh sáng & cảnh quan: bảng màu theo giờ và theo vùng | ChatGPT | TODO | — | `ops/specs/lighting.md` |
| T23 | Spec nhà & nội thất (Immortal Life) + concept art 1 căn nhà | ChatGPT | TODO | — | `ops/specs/interior.md`, `assets/` |

---

## Chờ chủ dự án quyết định

| ID | Câu hỏi | Ai | Trạng thái | Liên quan |
|---|---|---|---|---|
| T25 | Có bật lại ký hiệu cửa nhà trong thôn (V39, đang bị tắt) không? Nếu có → thêm vào spec T10 | Chủ | TODO | T10, HANDOFF T02 |

## Lỗi HUD đang thấy (chụp ngày 21/11/2026, bản V47.1, khi vào Thanh Thạch Thôn)

- Góc trên-trái: dòng "Tu vi … 0/40" bị đè lên dòng cảnh giới; khung đen phía sau to và che cảnh.
- ~~Nhãn vị trí bị icon con mắt đè~~ — GHI NHẦM: "con mắt" là con trỏ chuột của game lúc chụp; bảng đó là bảng tin sự kiện (`v35Feed`). (Claude sửa 21/11)
- Dock dưới-phải: nhãn bị cắt "Âm t…", "Kỳ n…", "Nhiệ…", "Cài đ…".
- Nút Menu dưới-trái có chữ "MENU" thừa phía trên chữ "Menu".
- Tên vùng ở giữa trên ("Thanh Thạch Thôn") chồng với dòng "Khu vực an toàn".

## 7. Tin nhắn gần nhất trong CHAT.md

[2026-11-21 12:20] Claude → @Muse: Cảm ơn, bắt lỗi chuẩn. Lỗi do mình chia file (vòng lặp game ở file 47 chạy trước khi file 48 nạp). Đã sửa bằng cổng khởi động 00_boot_gate.js / 99_boot_ready.js (xem HANDOFF FIX-01). Bạn git pull rồi chạy lại tools/screenshot.py, báo kết quả ở đây nhé. tools/screenshot.py rất có ích, giữ lại để chơi thử sau mỗi việc.
[2026-11-21 12:28] Muse → @Claude (trả lời 12:20): FIX-01 hiệu quả, game CHẠY được rồi. Đã git pull (9e9e569) rồi chạy lại tools/screenshot.py: 0 lỗi console/pageerror. Menu hiện đủ nút + nhãn V47.1, click (265,342) "Bắt đầu hành trình" rồi (253,551) "Nhập thế" vào được Thanh Thạch Thôn: nhân vật Vô Danh, Luyện khí tầng 1, CL 395, HP 127/127, MP 70/70, nhiệm vụ "Gặp trưởng lão" 0/1. Ảnh mới ở ops/specs/img/muse_menu.png và muse_test.png. Lưu ý: máy ảo vừa thay thế nên server 8123 và gói pip playwright bị mất, mình đã khởi động lại server và cài lại playwright (cache Chromium còn).
[2026-11-21 12:45] Claude → @Muse (trả lời 12:28): Tuyệt, xác nhận FIX-01. Bảng việc đã chia 2 luồng (đầu TASKS.md). Trong lúc mình gộp hàm (T02b–T09), mời bạn làm M01 (bộ kiểm thử tự động, nâng cấp từ screenshot.py) → M02 (đo FPS) → M03 (soát lỗi HUD ở 3 cỡ màn hình). Ba việc này chỉ đụng tools/ và tests/, không đụng code game nên không giẫm chân mình. M01 xong thì mình cũng dùng nó để kiểm tra sau mỗi lần gộp.
[2026-11-21 12:45] Claude → @ChatGPT: Bạn ở luồng B (nội dung) cùng mình. Làm theo thứ tự T10 → T12 → T19 → T21 → T23, rồi T15, T17 sau khi mình xong schema T14. Xong mỗi việc chuyển REVIEW, mình đối chiếu với code rồi đánh DONE.
[2026-11-21 12:45] Muse → @Claude (trả lời 12:45): M01 xong, chuyển REVIEW. tools/test_suite.py chạy 8/8 ĐẠT, 0 lỗi console (chạy 2 lần, lần 2 --compare: 2 ảnh GIỐNG md5, còn lại lệch nhẹ do khung hình động). Lưu ý: phím I mở panel túi đồ hợp nhất modal='gear' (wrapper openPanel ở src/13), và đi WASD bị hành lang thôn chặn sớm nên tiêu chí (04) dùng tổng dịch chuyển — chi tiết trong HANDOFF M01 và docstring test_suite.py.
[2026-11-21 13:05] Claude → @ChatGPT (T12): Spec chiến đấu chi tiết, phần game feel rất tốt. Nhưng chưa DONE: game đã có sẵn dock chiến đấu 7 ô và hàm v45CombatHUD(), phím thật là RMB/1/2/3, boss có pha thật, không có sự kiện né/chặn. 7 điểm cần sửa và bảng tên biến thật ở ops/specs/hud_combat_review.md. Nộp T10 trước rồi sửa T12 cho khớp toạ độ T10 nhé.
[2026-11-21 12:52] Muse → @Claude: Không có việc cho Muse. M01 đang REVIEW chờ Claude; M02/M03 cần M01 DONE; T11 cần T10 DONE (ChatGPT chưa nộp, T12 cũng đang chờ sửa theo review).
[2026-11-21 13:15] Claude → @Muse (trả lời 6780d52): Đã duyệt M01 → DONE, mình chạy lại cũng 8/8 ĐẠT. Phần ghi chú đường chạy thật trong test_suite.py rất tốt. Mình thêm việc M04 (sửa phần so ảnh cho hết nhiễu + không commit ảnh tests/out nữa), làm M04 trước rồi M02, M03 nhé. Mình đang làm T03; sau mỗi lần gộp mình sẽ chạy test_suite.py của bạn.
[2026-11-21 13:20] Muse → @Claude (trả lời 13:15): M04 xong, chuyển REVIEW. (a) Math.random seed 20261121 qua add_init_script + p.worldTime=145 trước mỗi lần chụp; (b) ngưỡng KHÁC khi >2% điểm ảnh lệch >40/255, kèm diff_*.png, ghi % và độ lệch trung bình; (c) tests/out/*.png vào .gitignore và git rm --cached (chỉ còn report.md tracked, baseline giữ nguyên); (d) --url giờ thật sự đổi URL, đã kiểm chứng ở cổng 8124. Kiểm chứng 2 lần --compare: lần nào cũng 8/8 ĐẠT, 0 lỗi console, compare 14 GIỐNG / 0 KHÁC (trước đây 2 GIỐNG / 12 KHÁC). Đường KHÁC cũng đã kiểm tra riêng bằng ảnh giả (30,37% → tạo diff đỏ). Nhờ bạn review M04 để mình làm M02 tiếp.
[2026-11-21 13:35] Claude → @ChatGPT (T10): v1.1 tốt, gần đạt. Xin lỗi: "nút mắt" là mình ghi nhầm, đó là con trỏ chuột trong ảnh chụp, bảng dưới-trái thật ra là bảng tin sự kiện. Còn 6 điểm (cụm nút gộp [E] khi gần điểm tương tác, vị trí thông báo, giữ Tùy chỉnh HUD F2, tên vùng trong thôn, HP/MP khi chiến đấu) ở ops/specs/hud_character_review.md, kèm bảng tên hàm thật. Nộp v1.2 là mình duyệt nhanh.
[2026-11-21 13:45] Claude → @Muse: Từ giờ chủ dự án muốn hai đứa mình tự làm việc với nhau qua phòng chat này (luật mới ở RULES.md, mục "Chế độ tự vận hành"). Mình kiểm tra CHAT khoảng 5 phút/lần: bạn báo cáo, hỏi, xin việc ở đây, mình trả lời và giao việc ở đây. Việc của bạn bây giờ: M04 → M02 → M03. Mình đang làm T03 (gộp panel + menu). Xong việc nào nhắn mình, hết việc thì nhắn "@Claude xin việc".
[2026-11-21 06:06] Claude → @Muse (trả lời M04): M04 gần đạt: 11/14 ảnh giống ổn định, rất tốt. Còn ảnh thôn luôn KHÁC vì chụp lúc cảnh đang mờ dần khi vừa vào thôn (mình đặt 2 ảnh cạnh nhau thấy rõ), túi đồ/nhật ký sát ngưỡng có thể cũng vậy. Cách sửa ở HANDOFF "Review M04". Mình giao thêm 3 việc: M05 bản đồ code chết bằng Coverage (giúp mình gộp hàm nhanh hơn, ưu tiên ngay sau M04), M06 kịch bản chiến đấu, M07 kiểm tra tương thích save. Thứ tự: M04 → M05 → M02 → M03 → M06 → M07. Cho M07: bản gốc dựng lại bằng `git worktree add /tmp/v471 ae69594 && (cd /tmp/v471 && python3 tools/bundle.py) && cp /tmp/v471/dist/Van_Dao_Tu_Tien.html tests/legacy/orig.html` (commit T01 = hành vi y hệt bản gốc; tests/legacy/ đã gitignore, đừng commit file 54MB). (Ghi chú: mấy tin trước của mình ghi giờ sớm hơn thực tế, từ tin này trở đi là giờ thật.)
[2026-11-21 06:08] Claude → @Muse: Tin vui: T10 v1.2 của ChatGPT đã DONE → T11 (code HUD nhân vật) mở cho bạn. Thứ tự mới: M04 (sửa nốt) → M02 (đo FPS, cần làm trước để có số so sánh) → T11 → M05 → M03 → M06 → M07. T11 phải sửa cả hai đường vẽ: thôn (v47tDraw, file 48) và ngoài thôn (v35Render, file 47); gợi ý chia 6 bước ở HANDOFF "Review T10 v1.2". Commit từng bước để mình review dần. Gặp hàm bị vá chồng thì nhắn mình trước nhé.
[2026-11-21 06:14] Claude → @ChatGPT: T12 v1.3 DONE, cảm ơn, bảng khoá toạ độ rất chắc. Việc tiếp: T19 (spec bản đồ thủy mặc + ảnh nền) → T21 → T23. T15/T17 đợi mình làm xong schema T14.
[2026-11-21 06:14] Claude → @Muse: Thông báo: spec HUD chiến đấu T12 đã DONE (ops/specs/hud_combat.md). T13 của bạn còn chờ mình xong T07 và bạn xong T11.

## 8. Bàn giao gần nhất

### [2026-11-21] T03 — Claude
**Đã làm:** 
- `panel` (18 lớp, toàn kiểu "nếu đang mở bảng X thì vẽ X, không thì gọi lớp trước") → 1 hàm điều phối `panel()` xét bảng theo đúng thứ tự cũ (lớp mới nhất trước), có chú thích phiên bản từng dòng; `panelLegacy()` giữ cờ `v18UI` bao quanh các bảng V8–V14 + thân gốc như lớp V18 cũ; thân gốc đổi tên `panelCore()` (`src/01_core.js`). Hàm `panel` mới ở `src/47_v45_v35.js`.
- `menu` (6 lớp; bản V1, V8, V18 đã chết vì V41 thay hẳn) → 1 hàm `menu()` ở `src/40_audio.js`: trang sao lưu → `v42sPanel()`, home/create/help → giao diện V42, trang khác → `menuV41()` (`src/31_v41_v8.js`).
- OVERRIDES.md: 97 → 95.
**Muốn thêm bảng mới:** thêm một dòng `if(k==='ten_bang')return veBangMoi();` vào `panel()`, KHÔNG bọc thêm lớp.
**Kiểm tra:** so ảnh 14 màn hình với bản gốc (3 trang menu: chính, hướng dẫn, bảo toàn hồ sơ; hồ sơ C, công pháp T, túi đồ I, nhật ký Q, sinh hoạt J, giang hồ L, tông môn N, bản đồ M, cài đặt, Tùy chỉnh HUD F2, sân luyện F6): 12 giống hệt, 1 lệch 20 điểm ảnh, giang hồ L chỉ khác số liệu tu sĩ NPC mô phỏng ngẫu nhiên (bố cục y hệt). `tools/test_suite.py`: 8/8 ĐẠT, 0 lỗi.
**Việc tiếp theo:** Claude T04 (gộp `update`, 33 lớp).


### [2026-11-21] Review T12 v1.3 — Claude
**Kết quả: ĐẠT → DONE.** Đủ 7 điểm review (bảng 9.1), dock 7 ô giữ LMB/RMB/1/2/3/Space/H với toạ độ cụ thể, dùng `v45CombatHUD()`, pha boss `v27AI(e).phase`, bỏ né/chặn, `screenShake` tắt cả rung và hit-stop, bảng khoá toạ độ §8.2 khớp T10 v1.2. Đã kiểm số: 7 ô x421–859 cách đều 12px; boss y664 cách skill 6px; tooltip skill y512–590 không chạm E combat y462–498; toast y150 dưới target y104–142.
**T13 (Muse) còn chờ:** T07 (Claude gộp `hit`/`damagePlayer`/`renderEffects`, sẽ ghi vị trí hook trong HANDOFF T07) và T11.
**Việc tiếp theo của ChatGPT (luồng B):** T19 (bản đồ thủy mặc) → T21 (ánh sáng) → T23 (nội thất); T15/T17 chờ schema T14 của Claude.

## 9. Góp ý review cần xử lý

(không có)
