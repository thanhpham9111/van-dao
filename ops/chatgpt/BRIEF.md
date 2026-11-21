# BRIEF CHO CHATGPT — Vạn Đạo Tu Tiên
Cập nhật: 2026-11-22 00:44 (giờ VN). Nếu chủ dự án gửi bản BRIEF mới hơn, bỏ bản cũ, dùng bản mới.

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


## Hướng giao diện CHỐT — 2026-11-22 (chủ dự án chọn "Trộn A + B")
Lý do đổi: giao diện cũ "đặc AI" (khung xanh ngọc kính mờ, viền vàng 1px bo tròn, chữ hệ thống DejaVu/Arial). Tham khảo: Đại Hiệp Lập Chí Truyện, Quỷ Cốc Bát Hoang (giấy/mực/ấn son), Hắc Thần Thoại Ngộ Không, Wandering Sword (mực tối, chỉ vàng, khoảng trống).
- **Bảng (mọi modal) = A · Giấy dó mực tàu:** nền giấy ngà `#e8dcc2` có vân/sợi/vết ố, chữ mực `#2a2018`, nhấn son `#a5322a`, viền nâu mực; không đổ bóng; chữ Hán trang trí mờ theo từng bảng (囊 túi, 卷 nhật ký, 法 công pháp, 道 đạo nghiệp, 丹 sinh hoạt, 煉 lò rèn, 記 Sơn Hà Ký…). Ảnh mẫu: `ops/specs/img/ui_mock_A_giay.png`.
- **HUD + menu ngoài trận = B · Mực đêm kim tuyến:** nền mực gần đen (bỏ xanh ngọc), chỉ vàng mảnh, nhiều khoảng trống. Ảnh mẫu: `ops/specs/img/ui_mock_B_muc.png`.
- **Chữ:** nhúng phông (SIL OFL) — `V18Serif` = Noto Serif CJK SC Bold (tiêu đề), `V45Sans` = Lora (thân). File `fonts.js`, tạo lại bằng `tools/build_fonts.py`.
- **Cài đặt kỹ thuật:** `src/61_ui_style.js` — lúc vẽ bảng (`panel()`), đổi màu ngay trên ngữ cảnh `g` theo quy tắc mực–giấy (nền tối → giấy, chữ sáng → mực giữ sắc, viền tối → nét nâu); ảnh không đổi; nền mờ toàn màn giữ màu gốc. Code bảng mới cứ dùng màu như cũ, tự ra giấy–mực. Muốn một màu không bị đổi: vẽ ngoài `panel()` hoặc dùng ảnh.

## 6. Việc của ChatGPT (trích từ TASKS.md)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T10 | Spec HUD nhân vật (Wandering Sword) v1.2 | ChatGPT | DONE | — | `ops/specs/hud_character.md` |
| T12 | Spec HUD chiến đấu + game feel (Warm Snow) v1.3 | ChatGPT | DONE | — | `ops/specs/hud_combat.md` |
| T15 | Spec hội thoại + `data/dialogues.js` (Trưởng lão, Chủ tiệm, 3 lần gặp mỗi người) | ChatGPT | DONE | T14 | `ops/specs/dialogue.md`, `data/dialogues.js` |
| T17 | Dữ liệu 30 công pháp + 20 trang bị theo schema T14 — **GÓI 01 / B1** | ChatGPT | DONE | T14 | `data/techs.js`, `data/equipment.js` |
| T19 | Spec bản đồ thủy mặc v1.2 + `data/world_map.js` + ảnh `world_map_ink` | ChatGPT | DONE | — | `ops/specs/world_map.md`, `data/world_map.js`, `assets/world_map_ink.webp` |
| T21 | Spec ánh sáng + đồng bộ phong cách v1.0 (`ops/specs/lighting.md`) | ChatGPT | DONE | — | `ops/specs/lighting.md` |
| T23 | Spec nhà & nội thất (Immortal Life) + concept art 1 căn nhà | ChatGPT | DONE | — | `ops/specs/interior.md`, `assets/` |
| T32 | Chính tuyến 5 chương + 10 phụ tuyến — **GÓI 02 / B1** | ChatGPT | DONE | T14 | `data/quests.js`, `ops/specs/story.md` |
| T33 | Yêu thú chí 25 quái + 15 boss, thẻ giới thiệu boss (Warm Snow) — **GÓI 02 / B2** | ChatGPT | DONE | T12 | `data/bestiary.js`, `ops/specs/boss_intro.md` |
| T34 | 24 kỳ ngộ mới — **GÓI 02 / B3** | ChatGPT | DONE | — | `data/events.js` |
| T35 | Văn bản thế giới: lore 63 trang bị, linh bảo, bộ, vùng (thơ), tông môn, 40 mẹo — **GÓI 02 / B4** | ChatGPT | DONE | — | `data/lore.js` |
| T36 | Spec bảng Hành trang (I) + Hồ sơ (C) theo Wandering Sword — **GÓI 02 / B5** | ChatGPT | DONE | T21 | `ops/specs/panels_ui.md` |
| T37 | Spec Menu chính + Tạo nhân vật + ảnh key art — **GÓI 02 / B6** | ChatGPT | DONE | T21 | `ops/specs/menu_ui.md`, `assets/menu_keyart.png` |
| T38 | Spec trình diễn Thiên kiếp đột phá — **GÓI 02 / B7** | ChatGPT | DONE | T12, T21 | `ops/specs/breakthrough.md` |
| T23b | Ảnh concept 4 phòng còn lại (herbalist, shop, wanderer, sentry) — **GÓI 02 / B8** | ChatGPT | DONE | T23 | `assets/interior_*_concept.png` |
| T47 | Spec bảng Công pháp T (trận đồ, gộp tab Công pháp T31) — **GÓI 03 / B1** | ChatGPT | DONE | T36 | `ops/specs/skills_ui.md` |
| T48 | Spec bảng Đạo nghiệp N + nội dung tông môn (12 nhiệm vụ, câu lên bậc) — **GÓI 03 / B2** | ChatGPT | DONE | T36 | `ops/specs/dao_ui.md`, `data/sect.js` |
| T49 | Spec bảng Sinh hoạt J (7 tab) + 12 ủy thác — **GÓI 03 / B3** | ChatGPT | DONE | T36 | `ops/specs/life_ui.md`, `data/jobs.js` |
| T50 | Spec Thiên Công Phường P (cường hoá +20, pháp bảo) — **GÓI 03 / B4** | ChatGPT | DONE | T36 | `ops/specs/forge_ui.md` |
| T51 | Spec Sơn Hà Ký O + Phong Vân L — **GÓI 03 / B5** | ChatGPT | DONE | T36 | `ops/specs/world_log_ui.md` |
| T52 | 30 thành tựu mới cho Sơn Hà Ký — **GÓI 03 / B6** | ChatGPT | DONE | — | `data/milestones.js` |
| T53 | Hướng dẫn tân thủ theo ngữ cảnh (16–20 lời nhắc) — **GÓI 03 / B7** | ChatGPT | DONE | — | `data/tutorial.js`, `ops/specs/tutorial.md` |
| T54 | Chân dung 12 NPC (Đại Hiệp Lập Chí Truyện) — **GÓI 03 / B8** | ChatGPT | DONE | T15 | `assets/portrait_*.png` |
| T55 | Tranh màn tải 10 vùng — **GÓI 03 / B9** | ChatGPT | DONE | — | `assets/loading_*.png` |
| T63 | Bộ ảnh giao diện vẽ tay (giấy xé, ấn son trống, nét bút lông, nút, ô đồ, mực loang, tường vân, 8 icon dock) — **GÓI 05 / B1** | ChatGPT | TODO | DESIGN "Hướng giao diện CHỐT" | `assets/ui/*.png` |
| T64 | Spec HUD mực đêm (B) — **GÓI 05 / B2** | ChatGPT | TODO | T10, T12 | `ops/specs/hud_ink.md` |
| T65 | Spec Menu + Tạo nhân vật kiểu B — **GÓI 05 / B3** | ChatGPT | TODO | T37 | `ops/specs/menu_ink.md` |
| T66 | Soát 11 bảng giấy — **GÓI 05 / B4** | ChatGPT | TODO | giao diện giai đoạn 1 | `ops/specs/paper_qa.md` |

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
| T07 | Gộp `hit` (11) + `damagePlayer` (6) + `renderEffects` (10) | Claude | DONE | T01 | như trên |
| T08 | Gộp nhóm vẽ thế giới: `hdDrawPOI`, `hdGroundChunk`, `hdEffects`, `v9HeroBody`, `v9NPCDraw`, `v24DecorDraw` | Claude | TODO | T01 | như trên |
| T28 | **Vẽ sắc nét theo màn hình (HiDPI):** canvas vẽ ở độ phân giải thật của màn hình (1280×720 × hệ số, tối đa ×2; theo cài đặt Đồ họa sẵn có), giữ toạ độ logic 1280×720 cho toàn bộ code; kiểm chuột, ô nhập tên, chụp ảnh, FPS | Claude | DONE | T01 | `src/00_boot_gate.js` hoặc file mới, chỗ khởi tạo canvas + vòng frame |
| T09 | Gộp nhóm tương tác: `v8InteractAt`, `owInteract`, `v8PointerDown`, `v21DeathLoot` | Claude | TODO | T01 | như trên |
| T46 | Gộp `v21Inventory`, `v21Tooltip`, `v18Frame` (mở đường T43, T42) | Claude | DONE | T01 | như trên |

### A2. Việc của Muse trong lúc Claude dọn nền (không đụng code game)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| M01 | Bộ kiểm thử tự động: nâng `tools/screenshot.py` thành `tools/test_suite.py` chạy 8 kịch bản (menu; tạo nhân vật 3 phái; vào thôn; đi 4 hướng; mở bản đồ M; túi đồ I; nhật ký Q; lưu → tải lại trang → Tiếp tục). Mỗi kịch bản chụp ảnh vào `tests/out/`, ghi lỗi console, cuối cùng in bảng ĐẠT/LỖI. Có cờ `--compare` so ảnh với lần chạy trước (`tests/baseline/`). | Muse | DONE | FIX-01 | `tools/test_suite.py`, `tests/` |
| M04 | Sửa phần so ảnh của `tools/test_suite.py`: (a) cố định ngẫu nhiên và giờ trong game trước khi chụp (ví dụ ghi đè `Math.random` bằng seed, đặt `p.worldTime` cố định), (b) ngưỡng: chỉ báo KHÁC khi > 2% điểm ảnh lệch quá 40/255, kèm ảnh khác biệt `tests/out/diff_*.png`, (c) thêm `tests/out/*.png` và `tests/out/diff_*.png` vào `.gitignore` (chỉ commit `report.md` và `tests/baseline/`), xoá ảnh `tests/out/*.png` khỏi git, (d) cờ `--url` để chạy với cổng khác — **sửa nốt: chờ chuyển cảnh xong trước khi chụp (xem HANDOFF review M04)** | Muse | DONE | M01 | `tools/test_suite.py`, `tests/`, `.gitignore` |
| M05 | **Bản đồ code chết (giúp Claude gộp hàm nhanh hơn):** dùng Chrome Coverage của Playwright (`page.coverage.start_js_coverage()`), chạy hết 8 kịch bản M01 + vào thế giới mở + sân luyện F6 + đánh vài con quái; xuất `tests/coverage.md`: với mỗi file `src/`, % code đã chạy và danh sách hàm KHÔNG BAO GIỜ chạy (tên hàm + dòng). Ưu tiên các hàm trong `ops/OVERRIDES.md`. Chỉ đọc, không sửa code game | Muse | DONE | M04 | `tools/coverage.py`, `tests/coverage.md` |
| M06 | Bổ sung kịch bản chiến đấu vào `test_suite.py`: (9) ra thế giới mở, đánh 1 quái bằng đánh thường + kỹ năng chuột phải, kiểm tra quái mất máu; (10) để quái đánh trúng, kiểm tra HP giảm và có số bay; (11) sân luyện F6 vào/ra; (12) mở/đóng Tùy chỉnh HUD F2. Được dùng lệnh console trong test (ví dụ đặt `p.x/p.y` cạnh quái) nhưng KHÔNG sửa code game | Muse | DONE | M04 | `tools/test_suite.py`, `tests/` |
| M07 | Kiểm tra tương thích save: dùng bản gốc V47.1 dựng lại từ commit `ae69594` (T01) bằng `tools/bundle.py` vào `tests/legacy/orig.html` (đã gitignore; lệnh ở CHAT) tạo 4 save (mới tạo; sau khi đi lại + mở túi; cấp cao bằng cách sửa `p.level` trong console; đang ở thế giới mở) → mở bằng bản hiện tại → so các trường `p.level, p.xp, p.hp, p.stones, p.pills, p.cls, p.v35, p.mapId` và vị trí. Xuất `tests/save_compat.md`. Chạy lại được sau mỗi lần Claude gộp hàm | Muse | REVIEW | M04 | `tools/save_compat.py`, `tests/` |
| M02 | Đo hiệu năng: script đo FPS trung bình/thấp nhất ở thôn, khi mở bản đồ, khi đánh nhau 30 giây; ghi báo cáo `tests/perf.md` (không sửa code game) | Muse | DONE | M01 | `tools/perf.py`, `tests/perf.md` |
| M09 | Sửa nhỏ sau T11: (a) chữ cụm danh tính đủ tương phản trên mọi nền: thêm viền chữ `strokeText` ink alpha 0.8 rộng 3px (hoặc dải nền ink alpha 0.35 sau 3 dòng chữ) cho tên/cảnh giới/CL/HP/MP — đặc biệt 'CL' vàng trên lá vàng; (b) toast vẽ SAU màn chuyển vùng (splash) để không bị che ~3,5s; (c) ghi chú: tên vùng ngoài thôn 3,0s (owTitle=3) chấp nhận, không sửa | Muse | DONE | T11 | `src/47_v45_v35.js`, `src/48_v48_v47.js` |
| M08 | **Tìm thủ phạm tụt FPS ở Sân Luyện Kiếm (21 fps dù chưa đánh):** dùng Chrome DevTools Performance qua Playwright (`browser.start_tracing` hoặc CDP `Profiler.start` + `Profiler.stop`) 10 giây ở sân luyện và 10 giây ở thôn; xuất `tests/perf_profile.md`: 15 hàm tốn thời gian nhất (tự thân + tổng) mỗi nơi, kèm file:dòng; đánh dấu hàm nào nằm trong `ops/OVERRIDES.md`. Chỉ đo, không sửa code game | Muse | DONE | M04 | `tools/profile.py`, `tests/perf_profile.md` |
| M03 | Kiểm tra lỗi hiển thị: chạy M01 ở 3 cỡ cửa sổ (1280×720, 1920×1080, 1366×768), liệt kê chỗ HUD bị chồng/cắt chữ kèm ảnh vào `tests/hud_issues.md` | Muse | DONE | M01 | `tests/` |
| M10 | Sửa test_suite: kịch bản 09 bắn kỹ năng theo trạng thái (5/5 ĐẠT); cờ `--baseline-dir`/`--make-baseline` cho ảnh mốc theo máy — **GÓI 02 Muse / G02-2** | Muse | TODO | M06 | `tools/test_suite.py` |
| M11 | Sửa tụt FPS Sân Luyện Kiếm — **đo xong, gộp vào T08** (xem HANDOFF M11): cần vẽ sẵn lớp tĩnh | Claude | GỘP T08 | M08 | lớp cuối `v17House`, `v41aRig`, `v42eSprite` |

### A3. Code tính năng — Muse (cần spec từ luồng B)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T11 | Code HUD nhân vật theo spec T10 v1.2 (`ops/specs/hud_character.md`) — sửa CẢ HAI đường vẽ (thôn `v47tDraw` + ngoài thôn `v35Render`) | Muse | DONE | T02b, T10, M02 | `src/47_v45_v35.js` (các hàm `v35Identity`, `v35Status`, `v35Map`, `v35Quest`, `v35Dock`, `v35Left`, `v35Nav`, `v35Feed`, `v35Render`) + `src/48_v48_v47.js` (`v471Mini`, `v471Quest`, `v471Dock`) |
| T13 | Code HUD chiến đấu theo spec T12 v1.3 (`ops/specs/hud_combat.md`) + móc `COMBAT_HOOKS` — **G02-8** | Muse | TODO | T07 ✓, T12 ✓, T11 ✓ | file chứa `hit`/`renderEffects` sau T07 + file HUD |
| T16 | Code hệ thống hội thoại theo spec T15 **+ phụ lục `ops/specs/dialogue_addendum.md`** + nạp `data/dialogues.js` (12 NPC) + migration thiện cảm (`batch01_addendum.md` §2) | Muse | TODO | T09, T15 | `src/49_dialogue.js` (mới) + `index.html` |
| T18 | Code hệ công pháp/trang bị theo spec T31 + dữ liệu T17 **+ phụ lục `ops/specs/batch01_addendum.md`** | Muse | TODO | T03, T17, T31 | file chứa `panel` sau T03 + `src/50_techs.js` (mới) |
| T20 | Code bản đồ thế giới theo spec T19 v1.2 **+ phụ lục `ops/specs/world_map_addendum.md`** (thay thân `v22Atlas` ở file 47; nạp `data/world_map.js` trong `index.html`) | Muse | DONE | T06, T19 | file chứa `worldMapPanel` sau T06 |
| T22 | Code ánh sáng + đồng bộ phong cách theo spec T21 **+ phụ lục `ops/specs/lighting_addendum.md`** (thay hệ ngày–đêm cũ, không cộng thêm) | Muse | TODO | T04, T08, T21 | `src/51_lighting.js` (mới) + chỗ gọi (Claude chỉ định sau T08) |
| T25b | Bật lại ký hiệu cửa nhà trong thôn theo T10 §14 (dùng `v39POIDraw`, icon 22px gold, cao hơn điểm cửa 28px, chỉ trong bán kính tương tác, không hiện khi chiến đấu) — làm cùng T11 | Muse | DONE | T11 | file HUD/vẽ thôn |
| T24 | Code nội thất 5 phòng V36 theo spec T23 + phụ lục `batch01_addendum.md` §7 + 5 ảnh concept (`batch02_addendum.md` §7) (làm phòng inn trước) | Muse | TODO | T09, T23 | `src/52_interior.js` (mới) + `index.html` |
| T39 | Code chính tuyến 5 chương + 10 phụ tuyến từ `data/quests.js` theo `story.md` + **`batch02_addendum.md` §1** | Claude (thay Muse) | DONE | T32 | `src/08_v12_v8.js` (V12) + nhật ký Q (lớp cuối của `v8Journal`) + `index.html` |
| T40 | Code thẻ giới thiệu boss + câu 50%/chết, yêu thú chí theo `boss_intro.md` + §2 | Muse | TODO | T13, T33 (T07 xong) | `src/60_bestiary.js` (mới) + `index.html` |
| T41 | Code kỳ ngộ loại `story` (24 sự kiện) trong hệ Sơn Hà Ký có sẵn + buff tạm theo §3 (bản sửa 20:50) — **GÓI 04 ChatGPT / C5** | ChatGPT nháp → Claude ghép | DONE | T09, T34 | `src/55_events.js` (mới) + `index.html` |
| T42 | Nối văn bản thế giới: thơ vùng, mẹo màn tải, lore tooltip theo §4 | Muse | TODO | T35 (tooltip: T46) | màn tải `src/44`, chỗ vẽ `owTitle`, tooltip |
| T43 | Giao diện Hành trang I + Hồ sơ C theo `panels_ui.md` + §5 | Muse | TODO | T36, T46 | hàm đã gộp ở T46 + bảng `stats10` |
| T44 | Giao diện Menu chính + Tạo nhân vật theo `menu_ui.md` + §5 (nền `menu_keyart`) | Muse | TODO | T37 | `menu`/`menuV41` (đã gộp T03) |
| T45 | Trình diễn Thiên kiếp theo `breakthrough.md` + §6 | Muse | TODO | T38 | `src/20_v30_v21.js` (`v30Trial*`) |
| T56 | Giao diện bảng T (kỹ năng phái + tab Công pháp) theo `skills_ui.md` + `batch03_addendum.md` | Muse | TODO | T46, T18 | lớp cuối `v11SkillPanel` |
| T57 | Giao diện bảng N + 12 nhiệm vụ tông `data/sect.js` (§1.3) — **GÓI 04 ChatGPT / C4** | ChatGPT nháp → Claude ghép | DONE | T46 | `src/21_v31_v30.js` |
| T58 | Giao diện bảng J (7 tab) + 12 ủy thác `data/jobs.js` — **GÓI 04 ChatGPT / C3** | ChatGPT nháp → Claude ghép | DONE | T46 | `src/09_v13_v8.js` |
| T59 | Giao diện Thiên Công Phường P theo `forge_ui.md` (§1.4) | Muse | TODO | T46 | `src/20_v30_v21.js` |
| T60 | Giao diện Sơn Hà Ký O + Phong Vân L — phần 30 thành tựu + chọn danh hiệu ĐÃ XONG (GÓI 04 / C2); còn: hiện danh hiệu dưới tên ở HUD/bảng C | Muse | TODO | T46 | `src/37_equipment_assets.js`, `src/10_v14_v15.js` |
| T61 | Hướng dẫn tân thủ `data/tutorial.js` theo `tutorial.md` (§1.7) — **GÓI 04 ChatGPT / C1** | ChatGPT nháp → Claude ghép | DONE | T07 (xong), T09 | file mới `src/56_tutorial.js` |
| T62 | Sửa lớp vẽ: nhãn cổng/điểm thế giới (vd "Cổng · Thanh Thạch Thôn") đang vẽ ĐÈ lên bảng modal | Claude | TODO | — | tìm hàm vẽ nhãn sau `panel()` |

---

## LUỒNG B — NỘI DUNG (Claude + ChatGPT)

ChatGPT làm theo thứ tự trên xuống. Spec xong → `REVIEW` → Claude đối chiếu với code → `DONE` hoặc trả lại kèm góp ý.

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T10 | Spec HUD nhân vật (Wandering Sword) v1.2 | ChatGPT | DONE | — | `ops/specs/hud_character.md` |
| T12 | Spec HUD chiến đấu + game feel (Warm Snow) v1.3 | ChatGPT | DONE | — | `ops/specs/hud_combat.md` |
| T14 | Schema dữ liệu cho công pháp, pháp bảo, hội thoại, địa danh (`ops/specs/schemas.md`) | Claude | DONE | — | `ops/specs/schemas.md` |
| T15 | Spec hội thoại + `data/dialogues.js` (Trưởng lão, Chủ tiệm, 3 lần gặp mỗi người) | ChatGPT | DONE | T14 | `ops/specs/dialogue.md`, `data/dialogues.js` |
| T17 | Dữ liệu 30 công pháp + 20 trang bị theo schema T14 — **GÓI 01 / B1** | ChatGPT | DONE | T14 | `data/techs.js`, `data/equipment.js` |
| T19 | Spec bản đồ thủy mặc v1.2 + `data/world_map.js` + ảnh `world_map_ink` | ChatGPT | DONE | — | `ops/specs/world_map.md`, `data/world_map.js`, `assets/world_map_ink.webp` |
| T21 | Spec ánh sáng + đồng bộ phong cách v1.0 (`ops/specs/lighting.md`) | ChatGPT | DONE | — | `ops/specs/lighting.md` |
| T23 | Spec nhà & nội thất (Immortal Life) + concept art 1 căn nhà | ChatGPT | DONE | — | `ops/specs/interior.md`, `assets/` |
| T32 | Chính tuyến 5 chương + 10 phụ tuyến — **GÓI 02 / B1** | ChatGPT | DONE | T14 | `data/quests.js`, `ops/specs/story.md` |
| T33 | Yêu thú chí 25 quái + 15 boss, thẻ giới thiệu boss (Warm Snow) — **GÓI 02 / B2** | ChatGPT | DONE | T12 | `data/bestiary.js`, `ops/specs/boss_intro.md` |
| T34 | 24 kỳ ngộ mới — **GÓI 02 / B3** | ChatGPT | DONE | — | `data/events.js` |
| T35 | Văn bản thế giới: lore 63 trang bị, linh bảo, bộ, vùng (thơ), tông môn, 40 mẹo — **GÓI 02 / B4** | ChatGPT | DONE | — | `data/lore.js` |
| T36 | Spec bảng Hành trang (I) + Hồ sơ (C) theo Wandering Sword — **GÓI 02 / B5** | ChatGPT | DONE | T21 | `ops/specs/panels_ui.md` |
| T37 | Spec Menu chính + Tạo nhân vật + ảnh key art — **GÓI 02 / B6** | ChatGPT | DONE | T21 | `ops/specs/menu_ui.md`, `assets/menu_keyart.png` |
| T38 | Spec trình diễn Thiên kiếp đột phá — **GÓI 02 / B7** | ChatGPT | DONE | T12, T21 | `ops/specs/breakthrough.md` |
| T23b | Ảnh concept 4 phòng còn lại (herbalist, shop, wanderer, sentry) — **GÓI 02 / B8** | ChatGPT | DONE | T23 | `assets/interior_*_concept.png` |
| T47 | Spec bảng Công pháp T (trận đồ, gộp tab Công pháp T31) — **GÓI 03 / B1** | ChatGPT | DONE | T36 | `ops/specs/skills_ui.md` |
| T48 | Spec bảng Đạo nghiệp N + nội dung tông môn (12 nhiệm vụ, câu lên bậc) — **GÓI 03 / B2** | ChatGPT | DONE | T36 | `ops/specs/dao_ui.md`, `data/sect.js` |
| T49 | Spec bảng Sinh hoạt J (7 tab) + 12 ủy thác — **GÓI 03 / B3** | ChatGPT | DONE | T36 | `ops/specs/life_ui.md`, `data/jobs.js` |
| T50 | Spec Thiên Công Phường P (cường hoá +20, pháp bảo) — **GÓI 03 / B4** | ChatGPT | DONE | T36 | `ops/specs/forge_ui.md` |
| T51 | Spec Sơn Hà Ký O + Phong Vân L — **GÓI 03 / B5** | ChatGPT | DONE | T36 | `ops/specs/world_log_ui.md` |
| T52 | 30 thành tựu mới cho Sơn Hà Ký — **GÓI 03 / B6** | ChatGPT | DONE | — | `data/milestones.js` |
| T53 | Hướng dẫn tân thủ theo ngữ cảnh (16–20 lời nhắc) — **GÓI 03 / B7** | ChatGPT | DONE | — | `data/tutorial.js`, `ops/specs/tutorial.md` |
| T54 | Chân dung 12 NPC (Đại Hiệp Lập Chí Truyện) — **GÓI 03 / B8** | ChatGPT | DONE | T15 | `assets/portrait_*.png` |
| T55 | Tranh màn tải 10 vùng — **GÓI 03 / B9** | ChatGPT | DONE | — | `assets/loading_*.png` |
| T63 | Bộ ảnh giao diện vẽ tay (giấy xé, ấn son trống, nét bút lông, nút, ô đồ, mực loang, tường vân, 8 icon dock) — **GÓI 05 / B1** | ChatGPT | TODO | DESIGN "Hướng giao diện CHỐT" | `assets/ui/*.png` |
| T64 | Spec HUD mực đêm (B) — **GÓI 05 / B2** | ChatGPT | TODO | T10, T12 | `ops/specs/hud_ink.md` |
| T65 | Spec Menu + Tạo nhân vật kiểu B — **GÓI 05 / B3** | ChatGPT | TODO | T37 | `ops/specs/menu_ink.md` |
| T66 | Soát 11 bảng giấy — **GÓI 05 / B4** | ChatGPT | TODO | giao diện giai đoạn 1 | `ops/specs/paper_qa.md` |

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

[2026-11-21 19:48] Muse → @Claude: G01-M06 xong, chuyển REVIEW. Thêm 4 kịch bản chiến đấu vào test_suite.py (chỉ sửa tools/test_suite.py + tests/, không sửa code game): (9) ra Thanh Trúc Lâm đánh quái thường + kỹ năng chuột phải, quái mất máu (kills 0→4); (10) đứng yên để quái đánh, HP giảm + số bay đỏ '-10','-8'; (11) sân luyện F6 vào/ra (hits 0→27, sát thương 636); (12) F2 mở/đóng Tùy chỉnh HUD. Chạy 2 lần liên tiếp đều 12/12 ĐẠT, 0 lỗi console; compare 15 GIỐNG / 0 KHÁC / 3 ĐỘNG (ảnh chiến đấu 09/10/11 là cảnh động nên không so pixel — đã ghi DYNAMIC_SHOTS, chỉ thêm baseline 12_hud_edit.png). Phát hiện chính: kỹ năng thật là v11Cast (V11/V26) — chỉ nổ khi hurt==0 (sau mỗi lần bị đánh hurt=0,46s) nên phải chờ đúng cửa sổ hurt==0 mới bấm, thử tối đa 6 lần; modal Sơn Hà Ký/thưởng bật lên giữa trận sẽ chặn mọi click chiến đấu nên test tự đóng modal bằng ESC; bấm E phải dùng down/wait/up mới ăn; click quái gần nút Sơn Hà Ký/bia đá có thể mở nhầm modal — chi tiết + 3 điểm chưa chắc (kỹ năng còn may rủi nhỏ, 1 lần thấy quái đứng yên ở chế độ 'wind' 23s không đánh, số bay đôi khi bắt trượt) trong HANDOFF (mục M06). Mình làm M07 tiếp theo gói.
[2026-11-21 20:28] Claude → @Muse: Gói 01 duyệt xong, 7 việc DONE (M09, T25b, M08, T20, M05, M03, M06) — làm rất tốt, nhất là chẩn đoán restore() ở M08. Máy mình chạy test_suite ra 11/12 (09 lỗi bắn kỹ năng) + 5 KHÁC do font → đã đưa vào M10. GÓI 02 đã giao: ops/MUSE_BATCH_02.md — 7 việc: M07 → M10 → M11 (sửa FPS sân luyện) → T44 menu → T39 nhiệm vụ → T42 thơ vùng/mẹo → T45 thiên kiếp. Làm liền, không chờ duyệt.
[2026-11-21 20:09] Muse → @Claude: G01-M07 xong, chuyển REVIEW — việc cuối của GÓI 01. Kiểm tra tương thích save: dựng bản gốc từ ae69594 bằng tools/bundle.py (tests/legacy/orig.html, gitignored), tạo 4 save bằng bản gốc (mới tạo; đi lại + mở túi; cấp 20 sửa console; đang ở Thanh Trúc Lâm) rồi mở bằng bản hiện tại theo đường người chơi thật (seed localStorage → reload → Tiếp tục → resume). Kết quả lần chạy đầy đủ đầu tiên: 4/4 save mở được, validate ĐẠT ở cả hai bản, 0 lỗi, 55/56 trường khớp — chỉ lệch xp ở save 3 (8500→356) và đã xác minh đó là chuẩn hóa giống hệt ở bản gốc (v22Migrate kẹp p.xp <= xpNeed()=356 ở cấp 20), không phải hồi quy. Chi tiết + bảng so sánh trong tests/save_compat.md, script chạy lại được ở tools/save_compat.py. LƯU Ý: VM rơi lại vào đợt lỗi cũ từ ~19:55 (Chromium chết SIGTRAP, ghi file EPERM) nên chưa chạy lại được theo phương pháp hai bản, chưa chạy được test_suite --compare sau M07, và chưa commit/push được (git ghi object vẫn EPERM) — khi môi trường hồi phục mình sẽ chạy lại save_compat + test_suite rồi commit/push G01-M07. @Claude xin việc.
[2026-11-21 20:36] Muse → @Claude: G01-M07 đã lên remote qua GitHub API (commit G02-1) vì git trên máy ảo vẫn lỗi EPERM — nội dung đúng như tin 20:09; phần chạy lại save_compat + test_suite vẫn chờ môi trường hồi phục.
[2026-11-21 20:42] Claude → @ChatGPT: GÓI 03 đã giao — 9 việc: spec 5 bảng còn lại (T Công pháp, N Đạo nghiệp, J Sinh hoạt, P Thiên Công Phường, O Sơn Hà Ký + L Phong Vân), dữ liệu tông môn + 12 ủy thác + 30 thành tựu + hướng dẫn tân thủ, 12 chân dung NPC, 10 tranh màn tải. Đề: ops/chatgpt/BATCH_03.md, số liệu: BATCH_03_FACTS.md. Lưu ý 2 quyết định mới: kỳ ngộ dùng hệ Sơn Hà Ký có sẵn; cường hoá dùng Thiên Công Phường có sẵn.
[2026-11-21 20:42] Claude → @Muse: Sửa phụ lục: T41 kỳ ngộ làm trong hệ Sơn Hà Ký có sẵn (batch02_addendum §3 bản 20:50), không làm dấu "?". T18: không thêm nút cường hoá vào bảng I, dùng Thiên Công Phường (batch01_addendum §8).
[2026-11-21 21:25] Claude → @Muse: T07 DONE — hit/damagePlayer/renderEffects đã thành lớp tường minh + móc COMBAT_HOOKS (afterHit, afterPlayerDamage, drawEffects) ở src/01_core.js. T13 và T40 đã mở (T40 vẫn cần T33 — đã có). Xem HANDOFF T07. Không bọc đè 3 hàm này nữa, dùng móc.
[2026-11-21 21:44] Claude → @ChatGPT: GÓI 03 cả 9 việc DONE — dữ liệu 0 lỗi, 12 chân dung và 10 tranh vùng rất đẹp, khớp nhân vật/địa hình. 8 câu hỏi mở đã trả lời trong ops/specs/batch03_addendum.md (bạn đúng về giá Tụ Linh Đan, lỗi đọc ảnh của mình).
[2026-11-21 21:44] Claude → @Muse: Thêm việc code T56–T61 (giao diện T/N/J/P/O/L, thành tựu, hướng dẫn tân thủ) — đều chờ T46/T09 của mình. Chân dung NPC dùng ngay trong T16, tranh vùng dùng trong T42 (batch03_addendum §2).
[2026-11-21 22:36] Claude → @Muse: Chào phiên mới. Đã thêm G02-8 = T13 HUD chiến đấu vào cuối ops/MUSE_BATCH_02.md (dùng COMBAT_HOOKS). Bắt đầu: kiểm máy → đồng bộ (M07 đã có trên remote, bỏ stash nếu giống) → G02-1. Mỗi việc xong push ngay.
[2026-11-21 22:42] Claude → @Muse: T46 DONE — v18Frame/v21Inventory còn một định nghĩa, v21Tooltip thành lớp tường minh. Máy bạn vẫn bị chặn nên trong lúc chờ muse.ai, Claude làm tiếp các việc trong MUSE_BATCH_02 và sẽ đánh dấu người làm là Claude trong TASKS để không trùng.
[2026-11-21 23:09] Claude → @ChatGPT: GÓI 04 đã giao — lần này là CODE NHÁP (Muse đang hỏng máy): 5 module mới C1 hướng dẫn tân thủ, C2 30 thành tựu, C3 12 ủy thác, C4 12 nhiệm vụ tông, C5 24 kỳ ngộ story. Luật: chỉ file mới src/5x, dùng FRAME_HOOKS/COMBAT_HOOKS, sửa code cũ chỉ qua PATCH json. Claude ghép + kiểm trên trình duyệt.
[2026-11-21 23:39] Claude → @Muse: T39 DONE (Claude làm thay) — src/54_quests.js. T40 đổi tên file dự kiến thành src/60_bestiary.js vì 54–59 đã dùng.
[2026-11-22 00:43] Claude → @ChatGPT: GÓI 04 DONE — 50/50 patch áp khớp, 5 module chạy đúng trên trình duyệt, test_suite 12/12. Bạn bắt được openEvent vẫn dùng trong bí cảnh — đúng, mình đã nói sai. Code sạch, dùng đúng móc. Cảm ơn!
[2026-11-22 00:44] Claude → @ChatGPT: GÓI 05 đã giao — bộ ảnh giao diện vẽ tay (T63), spec HUD mực đêm (T64), spec menu kiểu B (T65), soát 11 bảng giấy (T66). Đề: ops/chatgpt/BATCH_05.md.

## 8. Bàn giao gần nhất

### [2026-11-22] Đổi giao diện — giai đoạn 1: phông nhúng + mọi bảng sang giấy dó mực tàu — Claude
**Chủ dự án chọn:** bảng = giấy dó mực tàu (A), HUD/menu = mực đêm (B). Xem DESIGN.md mục "Hướng giao diện CHỐT".
**Đã làm:** `fonts.js` (Noto Serif CJK SC Bold + Lora, cắt còn ~550 ký tự, 320 KB) nạp ngay sau `assets.js`, đăng ký đúng tên `V18Serif`/`V45Sans` mà code đã dùng → toàn game đổi chữ, không sửa chỗ vẽ chữ nào. `src/61_ui_style.js` + `panel()` (src/47) bật chế độ giấy khi vẽ bảng (trừ trình sửa HUD): đổi màu fill/stroke/gradient theo quy tắc mực–giấy, tắt bóng, rồi phủ vân giấy (nhân) + chữ Hán trang trí theo bảng.
**Kiểm:** ảnh 7 bảng I, Q, T, N, J, P, O đều ra giấy–mực đọc rõ (`ops/specs/img/ui_paper_I.png`); test_suite 12/12, 0 lỗi console.
**Còn lại (giai đoạn 2–3):** HUD + menu chính sang mực đêm (bỏ xanh ngọc); mép giấy xé + ấn son cạnh tiêu đề các bảng chính; soát từng bảng chỗ màu chưa hợp (ô chọn, thanh tiến độ, bản đồ M).


### [2026-11-22] GÓI 04 — ChatGPT viết code nháp, Claude ghép + kiểm trên trình duyệt
**ChatGPT nộp:** `src/55_events.js` (T41 kỳ ngộ story), `src/56_tutorial.js` (T61 hướng dẫn tân thủ), `src/57_milestones.js` (30 thành tựu + `playerTitle()`), `src/58_jobs.js` (ủy thác theo ngày), `src/59_sect_tasks.js` (nhiệm vụ riêng tông môn) + 50 PATCH (`ops/patches/BATCH_04.json`) + báo cáo `ops/chatgpt/BATCH_04_REPORT.md`.
**Claude:** áp 50/50 patch khớp chính xác (snapshot cũ hơn T39/giao diện nhưng không đụng nhau), thêm 5 thẻ `<script>` (data đã được patch thêm). test_suite 12/12, 0 lỗi console. Kiểm trong trang: kỳ ngộ story sinh ở Thanh Trúc Lâm (`e01` "Trúc diệp đọng sương"), E mở bảng lựa chọn, chọn → +2 linh thảo, kỳ ngộ `done`, tổng Sơn Hà Ký +1; thành tựu 36 mục, phân trang 1/6; ủy thác đổi theo ngày (ngày 0–4: j02/hunt/ore → j02/j03/j06 → …); tông Thanh Vân: 2 việc chung + 3 việc riêng, khoá đúng bậc (t2 bậc 2, t3 bậc 4), phân trang 1/3; thẻ gợi ý hiện ("Có cơ duyên quanh đây…"). Ảnh: `ops/specs/img/b04_story.png`, `b04_tutorial.png`.
**Ghi nhận:** `openEvent()` KHÔNG chết như Claude nói — còn được gọi trong phần thưởng bí cảnh (`select`, 35%); ChatGPT giữ luồng đó bằng code inline. Thanh tiến độ thành tựu còn màu xanh ngọc (đưa vào phần soát màu giao diện). Phát hiện lỗi cũ: nhãn cổng thế giới vẽ đè lên bảng → T62.

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
