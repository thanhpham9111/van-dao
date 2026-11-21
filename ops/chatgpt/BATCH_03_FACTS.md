# DỮ LIỆU THẬT CHO GÓI 03 (trích từ game lúc chạy, 21/11/2026)

Dùng kèm `BATCH_02_FACTS.md` (vùng, quái, NPC, tông môn, phím…). Ảnh hiện tại của từng bảng nằm trong thư mục `anh_hien_tai/` của gói.

## G1. Các bảng giao diện đang có (phím → modal)

| Phím | Tên bảng | `modal.kind` | Tab / nội dung chính | Ảnh |
|---|---|---|---|---|
| T | Công pháp · Đạo thống | skill11 | trận đồ 5 nút kỹ năng phái, chi tiết + điều kiện, Hoàn lại điểm, −1/+1 bậc, điểm còn | ky_nang_T.png |
| N | Vạn Đạo · Đạo nghiệp | v31dao | Tông môn · Đệ tử · Động phủ · Linh thú · Linh căn & Huyết mạch; hàng tài nguyên 6 ô; 4 thẻ tông môn (Dẫn đến người tiếp dẫn / Gia nhập · 10 linh thạch) | tong_mon_N.png |
| J | Nhân gian · Sinh hoạt tu tiên | life13 | Túi nguyên liệu · Luyện đan · Linh điền · Giao dịch · Ủy thác · Nhật ký · Phối phương | phim_J.png, tram_thon_1..3.png |
| L | Phong Vân · Giang hồ sống | jiang14 | Tu sĩ giang hồ (32 tu sĩ du hành, phân trang) · Tông môn · Sự kiện · Thiên cơ ký | phim_L.png |
| P | Thiên Công Phường | v30forge | Cường hoá +1…+20 · Tinh luyện · Khảm linh thạch · Tiến hoá/Thức tỉnh · Pháp bảo | phim_P.png |
| O | Sơn Hà Ký | v42world | Kỳ ngộ · Linh đài (trạm dịch chuyển) · Thành tựu · Nhật ký; danh sách 10 vùng | phim_O.png |
| I / C | Hành trang / Hồ sơ | gear / stats10 | đã có spec T36 `panels_ui.md` | — |
| Y | Cài đặt | settings | — | phim_Y.png |
| V | Lưu trữ | v42save | — | phim_V.png |

Khung chung mọi bảng hiện nay: nền xanh đen phẳng, viền mảnh, nút xám — cùng vấn đề "trông như web app" đã nêu ở T36. Ngôn ngữ thị giác đích: theo `panels_ui.md` §1 (giấy/lụa ấm, gỗ sơn mài, thư pháp, khung đồng).

## G2. Tông môn (`V31_SECT`, `V31_RANKS`, `V31_TASKS`)

| id | Tên | Đạo | Thưởng theo bậc |
|---|---|---|---|
| `cloud` | Thanh Vân Tông | Kiếm đạo | Công kích +5% / bậc |
| `herb` | Bách Thảo Đường | Đan đạo | Sinh lực +25 / bậc |
| `forge` | Thiên Công Các | Luyện khí | Phòng ngự +5 / bậc |
| `shadow` | Huyền Minh Điện | Pháp đạo | Sát thương kỹ năng +6% / bậc |

Bậc (tên, cấp tối thiểu, công trạng cần): Ký danh (cấp 2, 0 công) · Ngoại môn (cấp 5, 12 công) · Nội môn (cấp 10, 35 công) · Chân truyền (cấp 19, 80 công) · Trưởng lão (cấp 28, 150 công).
Nhiệm vụ tông môn hiện có: `hunt` Trừ yêu hộ đạo (cần 6 yêu thú, +10 công, +24 linh thạch) · `boss` Thảo phạt thủ hộ (cần 1 boss, +18 công, +45 linh thạch). Trạng thái lưu `p.v31` (rank, merit, task, stipend, disciples, cave).

## G3. Sinh hoạt (`V13_JOBS`, trạm, Phối phương lò rèn `V30_RECIPES`, linh thạch khảm `V30_GEMS`)

Ủy thác hiện có (chỉ 3):
- `gather` **Dược sư cần linh thảo** — loại `carry`, vật phẩm `herb`, cần 4, thưởng 14 linh thạch. Giao 4 linh thảo cho Bảng Ủy Thác.
- `hunt` **Yêu thú quấy rối** — loại `kill`, vùng `truc`, cần 4, thưởng 20 linh thạch. Hạ 4 yêu thú thường tại Thanh Trúc Lâm sau khi nhận.
- `ore` **Đúc pháp khí** — loại `carry`, vật phẩm `ore`, cần 3, thưởng 18 linh thạch. Giao 3 huyền thiết cho Bảng Ủy Thác.

Luyện đan (ảnh `tram_thon_1.png`): Hồi Xuân Đan ×2 (2 linh thảo) · Tụ Linh Đan ×1 (2 linh thảo + 1 linh tinh) · Hộ Thân Phù ×1 (1 linh mộc + 1 huyền thiết + 1 linh tinh) · Tinh chế hạt giống ×3 (2 linh thảo). Linh điền: 4 luống (2 mở sẵn). Giao dịch: mua/bán ×1/×5/×10, giá theo hảo cảm.

| Pháp bảo luyện ở lò rèn | Hệ | Hiệu ứng | Nguyên liệu | Linh thạch | Tinh hoa | Cấp |
|---|---|---|---|---:|---:|---:|
| Tam Sinh Liên Đài | Mộc | +90 sinh lực · +12 phòng ngự | herb 6, wood 4, crystal 3 | 70 | 1 | 10 |
| Thái Hư Kiếm Ấn | Kim | Công kích +20% · chí mạng +5% | ore 8, crystal 5 | 120 | 2 | 19 |
| Huyền Thiên Chung | Thổ | Phòng ngự +35 · sinh lực +120 | ore 10, wood 5, crystal 6 | 180 | 3 | 28 |
| Cửu Tiêu Lôi Kính | Lôi | Tốc đánh +22% · công kích +18% | ore 12, crystal 9 | 260 | 5 | 37 |

Linh thạch khảm: Hỏa Linh Thạch (attack +9) · Thanh Linh Thạch (hp +48) · Hàn Linh Thạch (def +12) · Lôi Linh Thạch (crit +0.035) · Nguyệt Linh Thạch (regen +2.2).
Cường hoá (ảnh `phim_P.png`): +1…+20, mỗi cấp +12% hệ số chỉ số gốc, thất bại không tụt cấp và +12% cơ hội lần sau.

## G4. Sơn Hà Ký — kỳ ngộ hằng ngày + thành tựu (`src/37`)

Mỗi vùng đã khám phá có 1 kỳ ngộ mỗi ngày game (1 ngày = 360 giây chơi), hiện thành điểm trên bản đồ. Loại: `shrine` Cổ trận thất truyền (chọn đúng hệ trong 3 lần) · `hunt` Yêu khí dị động (hạ 3 yêu thú) · `supply` Tiếp tế lữ nhân (giao vật phẩm). Từ T41 thêm loại `story` = 24 kỳ ngộ của GÓI 02. Linh đài = trạm dịch chuyển mỗi vùng.

Thành tựu hiện có (`V42_MILESTONES`, chỉ 6):
- `walk1` Bước đầu hành đạo — 1 linh đài → 8 linh thạch, 12 tu vi
- `walk3` Tiểu hành giả — 3 linh đài → 24 linh thạch, 30 tu vi
- `walk6` Sơn hà tri kỷ — 6 linh đài → 55 linh thạch, 70 tu vi
- `walk10` Vạn vực hành giả — 10 linh đài → 130 linh thạch, 140 tu vi
- `event3` Hữu duyên nhân — 3 kỳ ngộ → 25 linh thạch, 35 tu vi
- `event12` Hộ đạo sơn hà — 12 kỳ ngộ → 70 linh thạch, 90 tu vi

## G5. Số đếm có thật trong save (dùng cho điều kiện thành tựu / hướng dẫn)

| Mã | Nghĩa | Lấy từ |
|---|---|---|
| `level` | cấp hiện tại (1–45) | p.level |
| `discover` | số vùng đã khám phá (1–10) | p.discovered.length |
| `claim` | số điểm cơ duyên đã lĩnh ngộ (0–8) | p.claimed |
| `kills` | tổng yêu thú đã hạ | p.kills |
| `boss` | số boss vùng đã hạ (0–9) | v22State().bosses + p.worldBossDead |
| `events` | số kỳ ngộ đã hoàn thành | Sơn Hà Ký total |
| `waystones` | số linh đài đã mở (0–10) | Sơn Hà Ký stones |
| `sectRank` | bậc tông môn (0 Ký danh … 4 Trưởng lão) | p.v31.rank |
| `relics` | số linh bảo đang có | p.relics.length |
| `techs` | số công pháp đã học | p.techs.length |
| `main` | bước chính tuyến đã qua (0–26) | p.v12Main |
| `stones` | linh thạch đang giữ | p.stones |
| `pets` | số linh thú đã mở (0–4) | Động phủ / Linh thú |
| `forge` | cấp cường hoá cao nhất trên 1 món (0–20) | lò rèn |

## G6. Ảnh tham chiếu đi kèm

- `anh_hien_tai/*.png` — ảnh chụp các bảng ở G1.
- `tham_chieu/npc_*.png` — 12 hình NPC đang dùng trong game (toàn thân, nền trong suốt): màu áo/kiểu tóc/đạo cụ để vẽ chân dung khớp.
- `tham_chieu/vung_*.jpg` — ảnh thu nhỏ nền 10 vùng đang dùng (`v47thumb0–9`, thứ tự: thon, truc, yeu, tram, tuyet, hoa, phong, quy, ma, loi — Claude đã đối chiếu; nếu ảnh trông lệch tên, ghi vào Câu hỏi mở).

