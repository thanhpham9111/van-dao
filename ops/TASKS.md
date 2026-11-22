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
| T13 | Code HUD chiến đấu theo spec T12 v1.3 (`ops/specs/hud_combat.md`) + móc `COMBAT_HOOKS` — **G02-8** — **MUSE GÓI 03 / M2** | Muse nháp (zip) → Claude ghép | DONE | T07 ✓, T12 ✓, T11 ✓ | file chứa `hit`/`renderEffects` sau T07 + file HUD |
| T16 | Code hệ thống hội thoại theo spec T15 **+ phụ lục `ops/specs/dialogue_addendum.md`** + nạp `data/dialogues.js` (12 NPC) + migration thiện cảm (`batch01_addendum.md` §2) | Muse | DONE 22/11 (MUSE_05 M2: hội thoại 12 NPC, chân dung, chữ chạy, lựa chọn) | T09, T15 | `src/49_dialogue.js` (mới) + `index.html` |
| T18 | Code hệ công pháp/trang bị theo spec T31 + dữ liệu T17 **+ phụ lục `ops/specs/batch01_addendum.md`** | Muse | TODO | T03, T17, T31 | file chứa `panel` sau T03 + `src/50_techs.js` (mới) |
| T20 | Code bản đồ thế giới theo spec T19 v1.2 **+ phụ lục `ops/specs/world_map_addendum.md`** (thay thân `v22Atlas` ở file 47; nạp `data/world_map.js` trong `index.html`) | Muse | DONE | T06, T19 | file chứa `worldMapPanel` sau T06 |
| T22 | Code ánh sáng + đồng bộ phong cách theo spec T21 **+ phụ lục `ops/specs/lighting_addendum.md`** (thay hệ ngày–đêm cũ, không cộng thêm) | Muse | gộp vào T73 → **MUSE GÓI 05 / M1** | T04, T08, T21 | `src/51_lighting.js` (mới) + chỗ gọi (Claude chỉ định sau T08) |
| T25b | Bật lại ký hiệu cửa nhà trong thôn theo T10 §14 (dùng `v39POIDraw`, icon 22px gold, cao hơn điểm cửa 28px, chỉ trong bán kính tương tác, không hiện khi chiến đấu) — làm cùng T11 | Muse | DONE | T11 | file HUD/vẽ thôn |
| T24 | Code nội thất 5 phòng V36 theo spec T23 + phụ lục `batch01_addendum.md` §7 + 5 ảnh concept (`batch02_addendum.md` §7) (làm phòng inn trước) | Muse | MỘT PHẦN 22/11 (MUSE_05 M3: quầy + nền phòng Đại điện; 4 phòng kia chưa) | T09, T23 | `src/52_interior.js` (mới) + `index.html` |
| T39 | Code chính tuyến 5 chương + 10 phụ tuyến từ `data/quests.js` theo `story.md` + **`batch02_addendum.md` §1** | Claude (thay Muse) | DONE | T32 | `src/08_v12_v8.js` (V12) + nhật ký Q (lớp cuối của `v8Journal`) + `index.html` |
| T40 | Code thẻ giới thiệu boss + câu 50%/chết, yêu thú chí theo `boss_intro.md` + §2 — **MUSE GÓI 03 / M3** | Muse nháp (zip) → Claude ghép | DONE | T13, T33 (T07 xong) | `src/60_bestiary.js` (mới) + `index.html` |
| T41 | Code kỳ ngộ loại `story` (24 sự kiện) trong hệ Sơn Hà Ký có sẵn + buff tạm theo §3 (bản sửa 20:50) — **GÓI 04 ChatGPT / C5** | ChatGPT nháp → Claude ghép | DONE | T09, T34 | `src/55_events.js` (mới) + `index.html` |
| T42 | Nối văn bản thế giới: thơ vùng, mẹo màn tải, lore tooltip theo §4 — **MUSE GÓI 03 / M1** | Muse nháp (zip) → Claude ghép | DONE | T35 (tooltip: T46) | màn tải `src/44`, chỗ vẽ `owTitle`, tooltip |
| T43 | Giao diện Hành trang I + Hồ sơ C theo `panels_ui.md` + §5 | Muse | TODO | T36, T46 | hàm đã gộp ở T46 + bảng `stats10` |
| T44 | Giao diện Menu chính + Tạo nhân vật theo `menu_ui.md` + §5 (nền `menu_keyart`) — **chờ spec kiểu B T65** | Muse | TODO | T37, T65 | `menu`/`menuV41` (đã gộp T03) |
| T45 | Trình diễn Thiên kiếp theo `breakthrough.md` + §6 — **MUSE GÓI 03 / M4** | Muse nháp (zip) → Claude ghép | DONE | T38 | `src/20_v30_v21.js` (`v30Trial*`) |
| T56 | Giao diện bảng T (kỹ năng phái + tab Công pháp) theo `skills_ui.md` + `batch03_addendum.md` | Muse | TODO | T46, T18 | lớp cuối `v11SkillPanel` |
| T57 | Giao diện bảng N + 12 nhiệm vụ tông `data/sect.js` (§1.3) — **GÓI 04 ChatGPT / C4** | ChatGPT nháp → Claude ghép | DONE | T46 | `src/21_v31_v30.js` |
| T58 | Giao diện bảng J (7 tab) + 12 ủy thác `data/jobs.js` — **GÓI 04 ChatGPT / C3** | ChatGPT nháp → Claude ghép | DONE | T46 | `src/09_v13_v8.js` |
| T59 | Giao diện Thiên Công Phường P theo `forge_ui.md` (§1.4) | Muse | TODO | T46 | `src/20_v30_v21.js` |
| T60 | Giao diện Sơn Hà Ký O + Phong Vân L — phần 30 thành tựu + chọn danh hiệu ĐÃ XONG (GÓI 04 / C2); còn: hiện danh hiệu dưới tên ở HUD/bảng C | Muse | DONE (danh hiệu hiện cạnh cảnh giới ở HUD TQ, 22/11) | T46 | `src/37_equipment_assets.js`, `src/10_v14_v15.js` |
| T61 | Hướng dẫn tân thủ `data/tutorial.js` theo `tutorial.md` (§1.7) — **GÓI 04 ChatGPT / C1** | ChatGPT nháp → Claude ghép | DONE | T07 (xong), T09 | file mới `src/56_tutorial.js` |
| T62 | Sửa lớp vẽ: nhãn cổng/điểm thế giới (vd "Cổng · Thanh Thạch Thôn") đang vẽ ĐÈ lên bảng modal | Claude | MỘT PHẦN — nhãn cổng không vẽ khi có bảng (HUD_TQ); còn nhãn điểm khác | — | tìm hàm vẽ nhãn sau `panel()` |

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
| T63 | Bộ ảnh giao diện vẽ tay (giấy xé, ấn son trống, nét bút lông, nút, ô đồ, mực loang, tường vân, 8 icon dock) — **GÓI 05 / B1** | ChatGPT | SỬA 22/11: mục 8–10 thay bằng bộ ảnh HUD Titan Quest (B1b) — sau GÓI 06 | DESIGN "Hướng giao diện CHỐT" | `assets/ui/*.png` |
| T64 | Spec HUD mực đêm (B) — **GÓI 05 / B2** | ChatGPT | BỎ — thay bằng B2b soát HUD Titan Quest (`hud_tq_qa.md`) | T10, T12 | `ops/specs/hud_ink.md` |
| T65 | Spec Menu + Tạo nhân vật kiểu B — **GÓI 05 / B3** | ChatGPT | TODO | T37 | `ops/specs/menu_ink.md` |
| T66 | Soát 11 bảng giấy — **GÓI 05 / B4** | ChatGPT | TODO | giao diện giai đoạn 1 | `ops/specs/paper_qa.md` |
| T67 | Vẽ linh kiện map tân thủ mới (nền lát, nhà, cây, đạo cụ, nền xa) theo `newbie_map.md` — **GÓI 06** (ưu tiên) | ChatGPT | DONE 22/11 (78/81 ảnh đã ghép; còn `p_barrel`, `p_banner_1..2`) | — | `assets/map/*.png` |
| T68 | Vẽ bộ phận nhân vật Kiếm Tu 3 hướng + điểm xoay (rồi Thể Tu, Pháp Tu) — **GEMINI GÓI 01** | Gemini | TRẢ LẠI 22/11 — sai ngoại hình (chủ dự án chọn vẽ lại như bản gốc); kỹ thuật tách/toạ độ tốt, ghép thử khớp → `GEMINI_BATCH_01_SUA.md` | — | `assets/rig/*.png` |
| T69 | Code map tân thủ mới: bố cục `data/town_layout.js` + `src/65_town_map.js` (nền tile, y-sort, va chạm, giữ API V47T, ảnh giữ chỗ) — **MUSE GÓI 04** | Muse nháp (zip) → Claude ghép | DONE (khối giữ chỗ) | spec newbie_map | `src/65_town_map.js` |
| T70 | Code bộ xương 2D + chu kỳ đi/chạy/thở/lướt/chém + vật lý vạt áo/tóc | Claude | TODO | T68 (B1 để thử) | `src/66_rig.js` |
| T71 | HUD chiến đấu: dời thanh boss lên trên dock (đang đè hàng kỹ năng y≈664), bỏ HP/MP khỏi dock theo spec T12 §3, hit-stop 28–60ms — làm cùng đợt HUD mực đêm (T64) | Claude | DONE — HUD Titan Quest: thanh boss lên đỉnh, HP/MP ở cánh khối đáy; hit-stop đã có ở V26 | T64 | src/62, src/47 |
| T72 | Thôn sống động: dân làng, động vật, cỏ/nước phản ứng, hạt, vật tương tác (ghế, chuông, giếng, câu cá, cửa) — **MUSE GÓI 04 / M3** | Muse nháp (zip) → Claude ghép | DONE (khối giữ chỗ) | T69 | `src/67_town_life.js` |
| T73 | 2.5D: 4 lớp parallax, bóng đổ theo giờ, ánh sáng ngày–đêm + nguồn sáng, độ mờ xa (thôn tân thủ) | Claude | DONE 22/11 (MUSE_05 M1, Claude chỉnh: bóng dùng chung TOWN_SUN theo giờ, viễn cảnh chỉ ở dải trời, tắt tiền cảnh dán màn hình) | T69, T67 | `src/68_depth_light.js` |
| T75 | HUD kiểu Titan Quest + con trỏ (src/69_hud_tq.js) | Claude | DONE (22/11) | — | `src/69_hud_tq.js` |
| T76 | Thôn → NGOẠI MÔN SƠN MÔN (bố cục bản 3, thềm + bậc + quảng trường bát quái, bóng đổ, cỏ hoa) | Claude | DONE (22/11) | — | `tools/gen_town_layout.py`, `src/65_town_map.js` |
| T77 | Sprite kiến trúc sơn môn (đại điện, sơn môn, tàng kinh các, xá, lầu chuông, hành lang, linh tuyền, phù ấn…) — **GÓI 07** | ChatGPT | DONE 22/11 (25 sprite đã ghép; còn thiếu biến thể s_herb_bed_3, p_lotus_2, d_flowers_2..3, d_grass_2..3; s_covered_corridor_2 chưa dùng) | T76 | `assets/map/*.png` |
| T78 | Tương tác sơn môn (phù ấn động phủ, dược viên, linh tuyền, lò luyện khí, giáo đầu, đỉnh hương) — **MUSE GÓI 05 / M4** | Muse | DONE 22/11 (MUSE_05 M4 src/72; Claude dời điểm theo bố cục bản 3, bỏ hình thủ tục chỗ đã có sprite) | T76 | `src/72_sect_interact.js` |
| T79 | Đệ tử ngoại môn ×2, giáo đầu, trưởng lão, hạc trắng (bộ phận rig) — **GEMINI phụ lục** | Gemini | TODO | Kiếm Tu duyệt | `assets/rig/` |
| T80 | Âm thanh thật (31 file nhạc/tiếng động CC0 + credits), tư liệu tham khảo, lời thoại + 10 nhiệm vụ ngoại môn — **HARK GÓI 01** | Hark | TODO | — | `assets/audio/`, `data/` |
| T81 | NỀN VẼ TAY sơn môn 20 mảnh `gp_c*_r*` (hướng 2) — **GÓI 08**, vẽ hết 20 mảnh một lần (mẫu chuẩn c2_r1) | ChatGPT | TODO | T76 | `assets/map/gp_*.png` |
| T74 | Sprite dân làng ×4 (bộ phận rig) + động vật ×6 — **GEMINI GÓI 01 (thêm)** | Gemini | TODO | T68 | `assets/rig/`, `assets/map/` |

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
