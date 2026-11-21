# GÓI VIỆC 05 CHO CHATGPT — Bộ ảnh giao diện vẽ tay + spec HUD mực đêm + soát bảng giấy

Giao 22/11/2026 bởi Claude. Làm theo thứ tự B1 → B4. Hết chỗ: nộp `BATCH_05_part1.zip`, `part2`…

## Kết quả GÓI 04 (để biết)
DONE — 50/50 PATCH áp khớp, 5 module chạy đúng trên trình duyệt, test_suite 12/12. Bạn đúng về `openEvent()` còn dùng trong bí cảnh.

## Bối cảnh: đổi giao diện (chủ dự án đã chốt)
Giao diện cũ bị chê "đặc AI" (khung xanh ngọc kính mờ, viền vàng 1px bo tròn). Hướng chốt **"A + B"** (đọc `ops/DESIGN.md` mục "Hướng giao diện CHỐT"):
- **Bảng (modal) = A · Giấy dó mực tàu** — đã làm giai đoạn 1: nền giấy ngà, chữ mực, phông Noto Serif CJK + Lora, chữ Hán trang trí. Ảnh hiện tại: `anh_hien_tai/bang_*.png`. Ảnh mẫu đích: `mau/ui_mock_A_giay.png`.
- **HUD + menu ngoài trận = B · Mực đêm kim tuyến** — CHƯA làm: HUD vẫn xanh ngọc (`anh_hien_tai/hud.png`, `menu.png`, `tao_nhan_vat.png`). Ảnh mẫu đích: `mau/ui_mock_B_muc.png`.
Hiện mọi khung/vân đều vẽ bằng code nên còn "sạch quá". B1 cần **ảnh vẽ tay thật** để thay.

## Cách nộp
`BATCH_05.zip`: `assets/ui/*.png` (B1), `ops/specs/hud_ink.md` (B2), `ops/specs/menu_ink.md` (B3), `ops/specs/paper_qa.md` (B4), `BATCH_05_REPORT.md`.

---

## B1 — Bộ ảnh giao diện vẽ tay (`assets/ui/`)
Tất cả **PNG nền trong suốt** (trừ chỗ ghi khác), không chữ, không logo, cùng một tay vẽ: mực tàu + màu nước, nét bút lông thật (đậm nhạt, khô ướt, xơ giấy). Tên file đúng như dưới. Tạo được bao nhiêu nộp bấy nhiêu, ưu tiên theo thứ tự.

| # | File | Kích thước | Mô tả |
|---|---|---|---|
| 1 | `paper_sheet.png` | 2480×1356 (bảng 1240×678 ×2) | Tờ giấy dó ngà **mép xé tự nhiên** 4 cạnh (sợi giấy lởm chởm), vân sợi + vết ố nhẹ, góc hơi sẫm; trong suốt ngoài mép. Lòng giấy phẳng, sáng đều (để chữ đọc rõ) — màu gần `#e8dcc2`. |
| 2 | `paper_card.png` | 800×500 | Mảnh giấy nhỏ hơn, mép xé nhẹ, hơi sẫm hơn tờ lớn — làm nền khối con (ô chi tiết, thẻ nhiệm vụ). Sẽ kéo giãn 9 mảnh: 4 góc ~60px không được có chi tiết lệch. |
| 3 | `seal_square.png`, `seal_round.png`, `seal_oval.png` | 256×256 | Ấn son đỏ `#a5322a` **trống chữ ở giữa** (khung ấn + vân mực loang, mép mòn) — game tự viết chữ vào. |
| 4 | `brush_line_1..4.png` | 1200×48 | 4 nét bút lông ngang mực đen (đậm → nhạt, có nét khô xơ cuối) — gạch chân tiêu đề / đường chia. |
| 5 | `brush_red_1..2.png` | 600×40 | 2 nét son đỏ ngắn — gạch chân tab đang chọn. |
| 6 | `brush_button.png`, `brush_button_hover.png` | 520×120 | Vệt mực quét ngang làm nền nút trên giấy (thường: mực nhạt 30%; hover: đậm hơn + loang). |
| 7 | `slot_paper.png`, `slot_paper_sel.png` | 160×160 | Ô đồ trên giấy: khung vuông nét mực vẽ tay (không thẳng tuyệt đối); bản `sel` có thêm vòng son. |
| 8 | `ink_wash_1..3.png` | 1024×512 | 3 mảng mực loang đen (mép tan vào trong suốt) — nền các cụm HUD kiểu B (thay ô xanh ngọc). |
| 9 | `gold_corner.png`, `gold_divider.png` | 256×256, 1024×64 | Hoạ tiết **tường vân** chỉ vàng mảnh `#c9a86a` (góc khung + đường chia giữa có mây cuộn) — dùng tiết chế trên HUD/menu B. |
| 10 | `icon_*.png` (8 cái) | 128×128 | Biểu tượng thanh dock HUD, nét bút lông màu giấy `#efe6d4` trên nền trong suốt (sẽ đặt trên mực tối): `icon_bag` túi, `icon_skill` công pháp, `icon_journal` nhật ký, `icon_map` bản đồ, `icon_world` Sơn Hà Ký (cuộn sách), `icon_settings` bánh xe/la bàn, `icon_sound` chuông, `icon_hud` khung chỉnh. Cùng độ dày nét, cùng khung 128 (chừa lề 12px). |

## B2 — Spec HUD mực đêm (`ops/specs/hud_ink.md`, ≤ 120 dòng)
Chuyển HUD hiện tại (`anh_hien_tai/hud.png`, spec cũ `hud_character.md` T10 + `hud_combat.md` T12) sang kiểu B **mà giữ nguyên bố cục, chức năng, phím**:
- Bảng màu B (hex): mực nền, mực nhạt, chữ giấy, chữ phụ, chỉ vàng, son, ngọc (HP/MP giữ đỏ/xanh nhưng hạ độ "neon").
- Từng cụm: danh tính (chân dung tròn + tên + HP/MP), mini map, theo dõi nhiệm vụ, thanh dock icon, thanh tu vi, nút nhanh dưới (Sơ đồ thôn / Sân luyện / Theo nhiệm vụ), toast — nói rõ dùng ảnh B1 nào (`ink_wash_*`, `gold_*`, `icon_*`), độ trong, có/không viền.
- Quy tắc: không khung bo tròn 1px vàng quanh mọi thứ; mảng mực loang thay hộp; chỉ vàng chỉ ở 1–2 điểm nhấn; chữ tên dùng V18Serif.

## B3 — Spec Menu chính + Tạo nhân vật kiểu B (`ops/specs/menu_ink.md`, ≤ 80 dòng)
Cập nhật `menu_ui.md` (T37) theo B: nút dạng chữ + nét bút lông dưới (không hộp), ảnh nền `menu_keyart` giữ, mảng mực loang trái làm nền khối nút, thẻ 3 phái dạng tranh dọc viền mực. Ảnh hiện tại: `menu.png`, `tao_nhan_vat.png`.

## B4 — Soát 11 bảng giấy (`ops/specs/paper_qa.md`)
Xem `anh_hien_tai/bang_*.png` (I, C, Q, T, N, J, P, O, L, M…). Liệt kê **từng chỗ** màu/độ tương phản/bố cục chưa hợp với kiểu giấy dó, dạng bảng: `bảng | vùng (toạ độ x,y,w,h ước lượng) | vấn đề | đề xuất (màu hex / thay bằng ảnh B1 nào)`. Ví dụ đã biết: thanh tiến độ thành tựu ở O còn xanh ngọc; bản đồ M chưa đổi. Ưu tiên 1–3.

---

## Khuôn `BATCH_05_REPORT.md`
```
# BATCH_05 — ChatGPT
## B1 — danh sách ảnh đã có (file · kích thước · nền trong suốt có/không)
## B2, B3 — quyết định chính
## B4 — số vấn đề theo bảng, 5 vấn đề ưu tiên 1
## Câu hỏi mở
## CHAT / HANDOFF
```
