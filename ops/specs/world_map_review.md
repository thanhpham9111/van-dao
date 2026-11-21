# Review T19 — Bản đồ thế giới v1.0 (Claude, 21/11/2026)

**Kết luận: GẦN ĐẠT, trả về sửa 4 điểm (v1.1).** Bố cục, ấn triện, fog, quy tắc nhãn chồng, tooltip, "không bịa dữ liệu", hiệu năng đều tốt. Dưới đây là 4 điểm ChatGPT nhờ xác nhận (mục 4) và chỗ cần chỉnh theo code thật.

## A. Xác nhận mục 4 — tên thật trong code

| Điểm | Code thật |
|---|---|
| (1) Nguồn địa danh | `REGIONS` (10 vùng: `id`, `name`, `x`, `y` theo toạ độ thế giới mở 0…`OW.w` × 0…`OW.h`), thứ tự hiển thị `V22_ORDER`, metadata `V22_REG[id]`: `min`, `max` (cấp đề nghị), `realm` (tên cảnh giới), `power` (chiến lực gợi ý), `desc` (mô tả), `resource` (tài nguyên), `boss` (tên boss), `qlo/qhi` (phẩm chất rơi đồ), `color`. Vùng 0 (`thon`) là vùng an toàn. |
| (1) Đường nối | `ROAD_EDGES`: danh sách cặp chỉ số trong `REGIONS`. Có thật, vẽ được. |
| (2) Khám phá | `p.discovered`: mảng id vùng đã đặt chân tới (thêm khi vào vùng, `owDiscover`). Không có cờ "biết vị trí nhưng chưa tới". |
| (2) Khoá | Bản đồ hiện tại **không khoá**: vùng thiếu cấp vẫn dẫn đường được, chỉ cảnh báo "Cẩn thận! … cấp đề nghị X". Hàm `v46CanEnter(id)` → `{ok, reason}` là luật **qua cổng** (cấp tối thiểu + điều kiện riêng), không phải luật của bản đồ. |
| (3) Hành động | Nút "Dẫn đường tới vùng": `modal=null; v8SetGoal({x:REG[id].x, y:REG[id].y})`, thêm `message('Cẩn thận! …')` nếu `V22_REG[id].min > p.level`. Không dịch chuyển, không trừ gì, luôn thành công. |
| (3) Mở/đóng | Phím M / nút Bản đồ → `openPanel('map')` → `panel()` → `worldMapPanel()`. Đầu bảng có 3 nút: **"Thanh Thạch"** (bản đồ thôn, `modal.v16Map='local'`), **"Sơn Hà Đồ"** (bản đồ thế giới, `modal.v16Map='world'`), **"Đóng [Esc]"**. Trong thôn mặc định mở bản đồ thôn. |
| (4) Đường vẽ | `worldMapPanel` (đang 8 lớp vá, T06 sẽ gộp): thế giới → `v22Atlas()` (`src/14_v22_v23.js`); thôn → `v45TownMap()` / bản đồ thôn V47T (`src/48`). T19 chỉ thay phần **Sơn Hà Đồ** (`v22Atlas`). |
| Ảnh | ĐÃ NẠP: `assets/world_map_ink.webp` (1586×992, 190 KB, chuyển từ PNG 2,5 MB) → trong code dùng `ASSETS["world_map_ink"]`. Spec v1.1 đổi tên file cho khớp. |

## B. Cần sửa (v1.1)

1. **Nút hành động:** đổi "Đi tới" → **"Dẫn đường"** (đúng bản chất: đặt đích, nhân vật tự đi). Không có trạng thái "Chưa thể tới" khoá nút. Vùng dưới cấp đề nghị: nút vẫn bấm được, hiện dòng cảnh báo red "Cấp đề nghị X–Y · nguy hiểm" ở bảng chi tiết (giữ luật cũ). Chỉ vô hiệu nút khi đang ở chính vùng đó ("Đang ở đây"). Bỏ phần "handler từ chối / chờ kết quả" vì `v8SetGoal` luôn thành công.
2. **Giữ 3 nút đầu bảng:** "Thanh Thạch" (chuyển sang bản đồ thôn), "Sơn Hà Đồ" (đang chọn), "Đóng [Esc]". Đặt chỗ cho chúng trong khung (ví dụ hàng tiêu đề bên phải, trước nút ×; hoặc thay nút × bằng "Đóng [Esc]").
3. **Bảng chi tiết — trường có thật** (thay cho câu chung chung ở §2.5): tên vùng; trạng thái ("Đang ở đây" / "Vùng an toàn" / "Đã khám phá" / "Chưa khám phá"); `realm · Lv min–max`; chiến lực gợi ý `power`; `desc`; tài nguyên `resource`; boss `boss` (vùng 0 không có); phẩm chất rơi đồ `qlo–qhi`. Vùng **chưa khám phá**: chọn được nhưng chỉ hiện "Vùng chưa khám phá", cấp đề nghị, và vẫn cho Dẫn đường (giống game hiện tại, không làm khó người chơi); tên thật hiện hay ẩn — bạn chọn và ghi rõ.
4. **Không cần `data/world_map.js`.** Toạ độ lấy `REGIONS.x/y` fit vào vùng node theo §2.3 (dùng khung cố định 0…`OW.w` × 0…`OW.h` thay vì bounding box, để giữ đúng tỉ lệ thế giới); mô tả lấy `V22_REG.desc`. Chỉ thêm vào spec **một bảng chữ trong ấn triện** cho 10 vùng (`thon truc yeu ma tuyet tram hoa quy phong loi`), mỗi vùng 1–2 chữ.

## C. Nhỏ

- Chú giải: bỏ "Chưa thể tới" (không có trạng thái này), giữ "Hiện tại / Đã khám phá / Chưa khám phá / Đường đi".
- §3 dòng "Dữ liệu hoặc vùng hiện tại đổi": giữ, đúng.
