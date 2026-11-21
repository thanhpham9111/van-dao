# Spec từng module

ChatGPT viết, chủ dự án duyệt, Muse làm theo. Mỗi spec một file, tên ghi trong cột "File được sửa" của TASKS.md.

Khung bắt buộc cho mỗi spec:

1. **Mục tiêu**: 1–2 câu, game tham khảo nào, lấy điều gì.
2. **Thành phần**: với từng thành phần ghi vị trí (x, y trên 1280×720), kích thước, màu hex, font/cỡ chữ, khi nào hiện/ẩn, hoạt ảnh (thời gian ms).
3. **Tương tác**: chuột, phím tắt, trạng thái hover/nhấn.
4. **Dữ liệu cần**: lấy từ biến nào trong game (ví dụ `p.hp`, `currentStats().hp`, `realm()`), hoặc file `data/` nào.
5. **Không làm**: những gì nằm ngoài phạm vi.
6. **Checklist nghiệm thu**: các dòng `[ ] ...` kiểm được bằng mắt khi chơi thử.

Có ảnh mockup thì để vào `ops/specs/img/` và nhúng vào spec.
