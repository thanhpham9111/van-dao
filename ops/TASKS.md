# BẢNG VIỆC

Trạng thái: `TODO` → `DOING` → `REVIEW` → `DONE` · hoặc `BLOCKED` (ghi lý do ở HANDOFF).
Mọi việc code của Muse xong thì chuyển `REVIEW`; Claude review rồi mới `DONE` (không cần dòng review riêng).
Thêm việc mới: ID kế tiếp, cuối bảng của giai đoạn tương ứng.

## Giai đoạn 1 — Dọn nền (Claude). Chưa xong thì không ai được code tính năng đụng vào các hàm này.

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T01 | Tách ảnh ra `assets/`+`assets.js`, tách font/CSS, chia code thành 48 file `src/`, sửa tiêu đề V47.1, lập `OVERRIDES.md` | Claude | DONE | — | tất cả |
| T02 | Gộp `worldHud` (25 lớp) + `hud` (12 lớp) thành một định nghĩa mỗi hàm | Claude | TODO | T01 | các file `src/` có lớp của 2 hàm này (xem OVERRIDES.md) |
| T03 | Gộp `panel` (18 lớp) + `menu` (6 lớp) | Claude | TODO | T01 | như trên |
| T04 | Gộp `update` (33 lớp) | Claude | TODO | T01 | như trên |
| T05 | Gộp `start` (16) + `resume` (19) — cẩn thận save cũ | Claude | TODO | T01 | như trên |
| T06 | Gộp `worldMapPanel` (8) + `owMiniMap` (7) | Claude | TODO | T01 | như trên |
| T07 | Gộp `hit` (11) + `damagePlayer` (6) + `renderEffects` (10) | Claude | TODO | T01 | như trên |
| T08 | Gộp nhóm vẽ thế giới: `hdDrawPOI`, `hdGroundChunk`, `hdEffects`, `v9HeroBody`, `v9NPCDraw`, `v24DecorDraw` | Claude | TODO | T01 | như trên |
| T09 | Gộp nhóm tương tác: `v8InteractAt`, `owInteract`, `v8PointerDown`, `v21DeathLoot` | Claude | TODO | T01 | như trên |

## Giai đoạn 2 — HUD

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T10 | Spec HUD nhân vật (Wandering Sword) — phải xử lý các lỗi đang thấy, ghi ở cuối bảng | ChatGPT | TODO | T01 | `ops/specs/hud_character.md` |
| T11 | Code HUD nhân vật theo spec T10 | Muse | TODO | T02, T10 | file chứa `worldHud` sau T02 (Claude ghi rõ trong HANDOFF khi xong T02) |
| T12 | Spec HUD chiến đấu + game feel (Warm Snow) | ChatGPT | TODO | T01 | `ops/specs/hud_combat.md` |
| T13 | Code HUD chiến đấu theo spec T12 | Muse | TODO | T07, T12 | file chứa `hit`/`renderEffects` sau T07 + file HUD sau T02 |

## Giai đoạn 3 — Nội dung & hệ thống

| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |
|---|---|---|---|---|---|
| T14 | Thiết kế cấu trúc dữ liệu (schema) cho công pháp, pháp bảo, hội thoại, địa danh — dựa trên `TECHS`/`EQUIPMENT` hiện có | Claude | TODO | T01 | `ops/specs/schemas.md` |
| T15 | Spec hội thoại + `data/dialogues.js` (Trưởng lão, Chủ tiệm, 3 lần gặp mỗi người) | ChatGPT | TODO | T14 | `ops/specs/dialogue.md`, `data/dialogues.js` |
| T16 | Code hệ thống hội thoại (Đại Hiệp Lập Chí Truyện) + nạp `data/dialogues.js` | Muse | TODO | T09, T15 | file mới `src/49_dialogue.js` + `index.html` (thêm thẻ script) |
| T17 | Dữ liệu 30 công pháp + 20 pháp bảo theo schema T14 | ChatGPT | TODO | T14 | `data/techs.js`, `data/equipment.js` |
| T18 | Code hệ công pháp/pháp bảo (Quỷ Cốc Bát Hoang) dùng dữ liệu T17 | Muse | TODO | T03, T17 | file chứa `panel` sau T03 + file mới `src/50_techs.js` |
| T19 | Spec bản đồ thủy mặc + vẽ ảnh nền bản đồ (Mịch Trường Sinh) | ChatGPT | TODO | T01 | `ops/specs/world_map.md`, `assets/` |
| T20 | Code bản đồ thế giới theo spec T19 | Muse | TODO | T06, T19 | file chứa `worldMapPanel` sau T06 |
| T21 | Spec ánh sáng & cảnh quan (Wandering Sword): bảng màu theo giờ và theo vùng | ChatGPT | TODO | T01 | `ops/specs/lighting.md` |
| T22 | Code lớp ánh sáng + chu kỳ ngày đêm theo spec T21 | Muse | TODO | T04, T08, T21 | file mới `src/51_lighting.js` + chỗ gọi trong hàm vẽ (Claude chỉ định khi xong T08) |
| T23 | Spec nhà & nội thất (Immortal Life) + concept art 1 căn nhà người chơi | ChatGPT | TODO | T01 | `ops/specs/interior.md`, `assets/` |
| T24 | Code vào nhà + nội thất 1 căn theo spec T23 | Muse | TODO | T09, T23 | file mới `src/52_interior.js` + `index.html` |

## Lỗi HUD đang thấy (chụp ngày 21/11/2026, bản V47.1, khi vào Thanh Thạch Thôn)

- Góc trên-trái: dòng "Tu vi … 0/40" bị đè lên dòng cảnh giới; khung đen phía sau to và che cảnh.
- Nhãn vị trí "Thanh Thạch Thôn · Thanh Vân Đại Điện" (trái, giữa màn hình) bị icon con mắt đè lên chữ.
- Dock dưới-phải: nhãn bị cắt "Âm t…", "Kỳ n…", "Nhiệ…", "Cài đ…".
- Nút Menu dưới-trái có chữ "MENU" thừa phía trên chữ "Menu".
- Tên vùng ở giữa trên ("Thanh Thạch Thôn") chồng với dòng "Khu vực an toàn".
