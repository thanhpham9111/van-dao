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
