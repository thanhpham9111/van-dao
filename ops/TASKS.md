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
| T46 | Gộp `v21Inventory`, `v21Tooltip`, `v18Frame` (mở đường T43, T42) | Claude | TODO | T01 | như trên |

### A2. Việc của Muse trong lúc Claude dọn nền (không đụng code game)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| M01 | Bộ kiểm thử tự động: nâng `tools/screenshot.py` thành `tools/test_suite.py` chạy 8 kịch bản (menu; tạo nhân vật 3 phái; vào thôn; đi 4 hướng; mở bản đồ M; túi đồ I; nhật ký Q; lưu → tải lại trang → Tiếp tục). Mỗi kịch bản chụp ảnh vào `tests/out/`, ghi lỗi console, cuối cùng in bảng ĐẠT/LỖI. Có cờ `--compare` so ảnh với lần chạy trước (`tests/baseline/`). | Muse | DONE | FIX-01 | `tools/test_suite.py`, `tests/` |
| M04 | Sửa phần so ảnh của `tools/test_suite.py`: (a) cố định ngẫu nhiên và giờ trong game trước khi chụp (ví dụ ghi đè `Math.random` bằng seed, đặt `p.worldTime` cố định), (b) ngưỡng: chỉ báo KHÁC khi > 2% điểm ảnh lệch quá 40/255, kèm ảnh khác biệt `tests/out/diff_*.png`, (c) thêm `tests/out/*.png` và `tests/out/diff_*.png` vào `.gitignore` (chỉ commit `report.md` và `tests/baseline/`), xoá ảnh `tests/out/*.png` khỏi git, (d) cờ `--url` để chạy với cổng khác — **sửa nốt: chờ chuyển cảnh xong trước khi chụp (xem HANDOFF review M04)** | Muse | DONE | M01 | `tools/test_suite.py`, `tests/`, `.gitignore` |
| M05 | **Bản đồ code chết (giúp Claude gộp hàm nhanh hơn):** dùng Chrome Coverage của Playwright (`page.coverage.start_js_coverage()`), chạy hết 8 kịch bản M01 + vào thế giới mở + sân luyện F6 + đánh vài con quái; xuất `tests/coverage.md`: với mỗi file `src/`, % code đã chạy và danh sách hàm KHÔNG BAO GIỜ chạy (tên hàm + dòng). Ưu tiên các hàm trong `ops/OVERRIDES.md`. Chỉ đọc, không sửa code game | Muse | REVIEW | M04 | `tools/coverage.py`, `tests/coverage.md` |
| M06 | Bổ sung kịch bản chiến đấu vào `test_suite.py`: (9) ra thế giới mở, đánh 1 quái bằng đánh thường + kỹ năng chuột phải, kiểm tra quái mất máu; (10) để quái đánh trúng, kiểm tra HP giảm và có số bay; (11) sân luyện F6 vào/ra; (12) mở/đóng Tùy chỉnh HUD F2. Được dùng lệnh console trong test (ví dụ đặt `p.x/p.y` cạnh quái) nhưng KHÔNG sửa code game | Muse | REVIEW | M04 | `tools/test_suite.py`, `tests/` |
| M07 | Kiểm tra tương thích save: dùng bản gốc V47.1 dựng lại từ commit `ae69594` (T01) bằng `tools/bundle.py` vào `tests/legacy/orig.html` (đã gitignore; lệnh ở CHAT) tạo 4 save (mới tạo; sau khi đi lại + mở túi; cấp cao bằng cách sửa `p.level` trong console; đang ở thế giới mở) → mở bằng bản hiện tại → so các trường `p.level, p.xp, p.hp, p.stones, p.pills, p.cls, p.v35, p.mapId` và vị trí. Xuất `tests/save_compat.md`. Chạy lại được sau mỗi lần Claude gộp hàm | Muse | TODO | M04 | `tools/save_compat.py`, `tests/` |
| M02 | Đo hiệu năng: script đo FPS trung bình/thấp nhất ở thôn, khi mở bản đồ, khi đánh nhau 30 giây; ghi báo cáo `tests/perf.md` (không sửa code game) | Muse | DONE | M01 | `tools/perf.py`, `tests/perf.md` |
| M09 | Sửa nhỏ sau T11: (a) chữ cụm danh tính đủ tương phản trên mọi nền: thêm viền chữ `strokeText` ink alpha 0.8 rộng 3px (hoặc dải nền ink alpha 0.35 sau 3 dòng chữ) cho tên/cảnh giới/CL/HP/MP — đặc biệt 'CL' vàng trên lá vàng; (b) toast vẽ SAU màn chuyển vùng (splash) để không bị che ~3,5s; (c) ghi chú: tên vùng ngoài thôn 3,0s (owTitle=3) chấp nhận, không sửa | Muse | REVIEW | T11 | `src/47_v45_v35.js`, `src/48_v48_v47.js` |
| M08 | **Tìm thủ phạm tụt FPS ở Sân Luyện Kiếm (21 fps dù chưa đánh):** dùng Chrome DevTools Performance qua Playwright (`browser.start_tracing` hoặc CDP `Profiler.start` + `Profiler.stop`) 10 giây ở sân luyện và 10 giây ở thôn; xuất `tests/perf_profile.md`: 15 hàm tốn thời gian nhất (tự thân + tổng) mỗi nơi, kèm file:dòng; đánh dấu hàm nào nằm trong `ops/OVERRIDES.md`. Chỉ đo, không sửa code game | Muse | REVIEW | M04 | `tools/profile.py`, `tests/perf_profile.md` |
| M03 | Kiểm tra lỗi hiển thị: chạy M01 ở 3 cỡ cửa sổ (1280×720, 1920×1080, 1366×768), liệt kê chỗ HUD bị chồng/cắt chữ kèm ảnh vào `tests/hud_issues.md` | Muse | REVIEW | M01 | `tests/` |

### A3. Code tính năng — Muse (cần spec từ luồng B)

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T11 | Code HUD nhân vật theo spec T10 v1.2 (`ops/specs/hud_character.md`) — sửa CẢ HAI đường vẽ (thôn `v47tDraw` + ngoài thôn `v35Render`) | Muse | DONE | T02b, T10, M02 | `src/47_v45_v35.js` (các hàm `v35Identity`, `v35Status`, `v35Map`, `v35Quest`, `v35Dock`, `v35Left`, `v35Nav`, `v35Feed`, `v35Render`) + `src/48_v48_v47.js` (`v471Mini`, `v471Quest`, `v471Dock`) |
| T13 | Code HUD chiến đấu theo spec T12 v1.3 (`ops/specs/hud_combat.md`) | Muse | TODO | T07, T12, T11 | file chứa `hit`/`renderEffects` sau T07 + file HUD |
| T16 | Code hệ thống hội thoại theo spec T15 **+ phụ lục `ops/specs/dialogue_addendum.md`** + nạp `data/dialogues.js` (12 NPC) + migration thiện cảm (`batch01_addendum.md` §2) | Muse | TODO | T09, T15 | `src/49_dialogue.js` (mới) + `index.html` |
| T18 | Code hệ công pháp/trang bị theo spec T31 + dữ liệu T17 **+ phụ lục `ops/specs/batch01_addendum.md`** | Muse | TODO | T03, T17, T31 | file chứa `panel` sau T03 + `src/50_techs.js` (mới) |
| T20 | Code bản đồ thế giới theo spec T19 v1.2 **+ phụ lục `ops/specs/world_map_addendum.md`** (thay thân `v22Atlas` ở file 47; nạp `data/world_map.js` trong `index.html`) | Muse | REVIEW | T06, T19 | file chứa `worldMapPanel` sau T06 |
| T22 | Code ánh sáng + đồng bộ phong cách theo spec T21 **+ phụ lục `ops/specs/lighting_addendum.md`** (thay hệ ngày–đêm cũ, không cộng thêm) | Muse | TODO | T04, T08, T21 | `src/51_lighting.js` (mới) + chỗ gọi (Claude chỉ định sau T08) |
| T25b | Bật lại ký hiệu cửa nhà trong thôn theo T10 §14 (dùng `v39POIDraw`, icon 22px gold, cao hơn điểm cửa 28px, chỉ trong bán kính tương tác, không hiện khi chiến đấu) — làm cùng T11 | Muse | REVIEW | T11 | file HUD/vẽ thôn |
| T24 | Code nội thất 5 phòng V36 theo spec T23 + phụ lục `batch01_addendum.md` §7 + 5 ảnh concept (`batch02_addendum.md` §7) (làm phòng inn trước) | Muse | TODO | T09, T23 | `src/52_interior.js` (mới) + `index.html` |
| T39 | Code chính tuyến 5 chương + 10 phụ tuyến từ `data/quests.js` theo `story.md` + **`batch02_addendum.md` §1** | Muse | TODO | T32 | `src/08_v12_v8.js` (V12) + nhật ký Q (lớp cuối của `v8Journal`) + `index.html` |
| T40 | Code thẻ giới thiệu boss + câu 50%/chết, yêu thú chí theo `boss_intro.md` + §2 | Muse | TODO | T07, T13, T33 | `src/54_bestiary.js` (mới) + `index.html` |
| T41 | Code hệ kỳ ngộ (dấu `?` + 24 sự kiện + buff tạm) theo §3 | Muse | TODO | T09, T34 | `src/55_events.js` (mới) + `index.html` |
| T42 | Nối văn bản thế giới: thơ vùng, mẹo màn tải, lore tooltip theo §4 | Muse | TODO | T35 (tooltip: T46) | màn tải `src/44`, chỗ vẽ `owTitle`, tooltip |
| T43 | Giao diện Hành trang I + Hồ sơ C theo `panels_ui.md` + §5 | Muse | TODO | T36, T46 | hàm đã gộp ở T46 + bảng `stats10` |
| T44 | Giao diện Menu chính + Tạo nhân vật theo `menu_ui.md` + §5 (nền `menu_keyart`) | Muse | TODO | T37 | `menu`/`menuV41` (đã gộp T03) |
| T45 | Trình diễn Thiên kiếp theo `breakthrough.md` + §6 | Muse | TODO | T38 | `src/20_v30_v21.js` (`v30Trial*`) |

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
