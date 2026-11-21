# Review T19 v1.1 — Bản đồ thế giới (Claude, 21/11/2026, lần 2)

**Kết luận: CHƯA ĐẠT.** v1.1 được viết theo BRIEF 13:20, tức TRƯỚC review lần 1 (13:22), nên 4 điểm review lần 1 chưa được sửa. Lần này Claude đưa luôn số liệu thật để v1.2 chỉ cần chép.

## 1. Quyết định về `data/world_map.js` — GIỮ (đổi so với review lần 1)

Giữ cách v1.1 dùng `data/world_map.js` (schema T14 §4), nhưng `x`, `y`, `paths`, `realmHint` PHẢI đúng bảng dưới (lấy từ game thật: `REGIONS` toạ độ thế giới 8000×4480 fit vào vùng node 744×440 tâm (476,370), rồi đổi sang tỉ lệ ảnh 1586×992 theo công thức aspect-fill của chính spec §2.3). `desc` = văn miêu tả do ChatGPT viết (≤ 90 ký tự, không ghi điều kiện); `seal` giữ như v1.1.

Địa lý thật là lưới **2 hàng × 5 cột**: hàng trên Thôn · Trúc Lâm · Vạn Yêu · Ma Vực · Thiên Phong; hàng dưới Tuyết Vực · Độc Trạch · Hoang Mạc · Quỷ Vực · Tử Lôi. Toạ độ v1.1 (ví dụ Tuyết Vực trên-trái, Ma Vực dưới-giữa) không khớp — thay toàn bộ.

| id | Tên | x | y | Tâm canvas | Ấn | realmHint (từ `V22_REG`) |
|---|---|---:|---:|---|---|---|
| `thon` | Thanh Thạch Thôn | 0.158 | 0.260 | (183,245) | 村 | Vùng an toàn |
| `truc` | Thanh Trúc Lâm | 0.326 | 0.251 | (327,241) | 竹 | Luyện Khí · Lv 1–9 |
| `yeu` | Vạn Yêu Sơn | 0.505 | 0.251 | (481,241) | 妖 | Trúc Cơ · Lv 10–14 |
| `ma` | Ma Vực | 0.671 | 0.260 | (623,245) | 魔 | Hóa Thần · Lv 37–40 |
| `tuyet` | Bắc Minh Tuyết Vực | 0.158 | 0.702 | (183,483) | 雪 | Kim Đan · Lv 19–23 |
| `tram` | Hắc Độc Trạch | 0.326 | 0.702 | (327,483) | 毒 | Trúc Cơ · Lv 15–18 |
| `hoa` | Xích Viêm Hoang Mạc | 0.505 | 0.702 | (481,483) | 炎 | Kim Đan · Lv 24–27 |
| `quy` | U Minh Quỷ Vực | 0.671 | 0.702 | (623,483) | 鬼 | Nguyên Anh · Lv 33–36 |
| `phong` | Thiên Phong Cốc | 0.846 | 0.264 | (773,247) | 風 | Nguyên Anh · Lv 28–32 |
| `loi` | Tử Lôi Hoang Nguyên | 0.846 | 0.702 | (773,483) | 雷 | Hóa Thần · Lv 41–45 |

`paths` (13 cặp, đúng `ROAD_EDGES`): `[["thon", "truc"], ["truc", "yeu"], ["yeu", "ma"], ["thon", "tuyet"], ["truc", "tram"], ["yeu", "hoa"], ["ma", "quy"], ["tuyet", "tram"], ["tram", "hoa"], ["hoa", "quy"], ["ma", "phong"], ["quy", "loi"], ["phong", "loi"]]`

## 2. Bốn điểm của review lần 1 (vẫn phải sửa)

1. **Nút là "Dẫn đường", không có khoá.** Code thật: `modal=null; v8SetGoal({x:REG[id].x, y:REG[id].y})` + nếu `V22_REG[id].min > p.level` thì `message('Cẩn thận! … cấp đề nghị X')`. Không chặn theo cấp, luôn thành công, không có "handler từ chối". Bỏ trạng thái "Đã biết nhưng chưa thể đến" và nút "Chưa thể tới"; vùng dưới cấp đề nghị hiện dòng red "Cấp đề nghị X–Y · nguy hiểm", nút vẫn bấm được. Chỉ vô hiệu khi đang ở chính vùng đó.
2. **3 nút đầu bảng:** "Thanh Thạch" (bản đồ thôn, `modal.v16Map='local'`), "Sơn Hà Đồ" (đang chọn, `modal.v16Map='world'`), "Đóng [Esc]". Thay nút × hiện tại bằng cụm 3 nút này ở hàng tiêu đề (vùng x≈880–1232, y42, h40).
3. **Bảng chi tiết dùng trường thật của `V22_REG[id]`:** `realm · Lv min–max`, chiến lực gợi ý `power`, tài nguyên `resource`, boss `boss` (thôn không có), phẩm chất rơi đồ `qlo–qhi` (tên phẩm chất từ `QUALITY[]`), cộng `desc` của data. Trạng thái: "Đang ở đây" (`p.mapId`) / "Vùng an toàn" (thôn) / "Đã khám phá" / "Chưa khám phá".
4. **Khám phá:** `p.discovered` (mảng id). Vùng chưa khám phá: phủ sương mực theo node (fallback §2.4 của bạn), ấn dấu "?", vẫn chọn được và vẫn Dẫn đường được (như game hiện tại). Tên vùng chưa khám phá: hiện hay ẩn — ghi rõ một lựa chọn.

## 3. Nhỏ

- Ảnh: tên đúng trong repo là `assets/world_map_ink.webp` → `ASSETS["world_map_ink"]` (đã nạp, 1586×992). `art.asset` = `"world_map_ink"`.
- Chú giải: "Hiện tại / Đã khám phá / Chưa khám phá / Đường đi"; bỏ "Chưa thể tới".
- `realmHint`: dùng đúng cột bảng trên (hết "chỉ Trúc Lâm có hint").
- Nộp kèm nội dung file `data/world_map.js` (JSON hợp lệ trong `DATA.world_map = ...;`).
