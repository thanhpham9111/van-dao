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
