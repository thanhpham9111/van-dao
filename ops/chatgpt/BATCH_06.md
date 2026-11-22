# GÓI VIỆC 06 CHO CHATGPT — Vẽ linh kiện map tân thủ mới + bộ phận nhân vật (ƯU TIÊN TRƯỚC GÓI 05)

Giao 22/11/2026 bởi Claude. Chủ dự án yêu cầu: **làm lại toàn bộ map tân thủ** (map cũ "không ăn nhập") và **chuyển động nhân vật** (đang cứng, giả). Phân vai: **bạn vẽ** (bạn tạo ảnh được), **Claude code** (ghép map, chiều sâu, va chạm, bộ xương 2D, vật lý vạt áo).
Nếu đang làm GÓI 05: dừng, làm GÓI 06 trước; GÓI 05 làm sau.

**Đọc kỹ `ops/specs/newbie_map.md`** — quy ước vẽ chung (mục 2: góc nhìn 3/4 từ nam ~35°, sáng trên-trái, nhân vật 104 px, nền trong suốt, đáy ảnh = chân công trình, nền lát liền mạch) là bắt buộc cho MỌI ảnh, để mọi thứ khớp nhau.

Tham khảo trong gói: `tham_chieu/map_cu.jpg` (map cũ — vì sao bị chê: tranh isometric kéo giãn, tỉ lệ lệch), `tham_chieu/hero_kiemtu.png` + `tham_chieu/walk_cu.png` (nhân vật hiện tại — giữ đúng ngoại hình), `tham_chieu/portrait_*.png` + `tham_chieu/menu_keyart.jpg` (phong cách màu đã duyệt).

## Thứ tự làm
1. **B1 — Thử khớp (nộp sớm nếu được):** `tile_grass_a`, `tile_stone`, `tile_dirt`, `b_inn`, `b_shop`, `t_pine_1`, `p_lantern_1` + **tờ bộ phận Kiếm Tu hướng trước (S)** + `rig_ref_S`. Claude ghép thử ngay để chốt tỉ lệ/góc nhìn trước khi bạn vẽ hết.
2. **B2 — Bộ phận nhân vật** 2 hướng còn lại (N, E) + `rig_ref_N`, `rig_ref_E` + bảng điểm xoay.
3. **B3 — Đủ linh kiện map** theo bảng mục 4 của spec.
Tạo được bao nhiêu nộp bấy nhiêu, theo thứ tự trên; mỗi lần nộp một zip `BATCH_06_partN.zip`.

## Cách nộp
`assets/map/*.png`, `assets/rig/kiemtu_<S|N|E>.png`, `assets/rig/rig_ref_<S|N|E>.png`, `BATCH_06_REPORT.md`:
```
# BATCH_06 — ChatGPT
## Ảnh đã có (file · kích thước · nền trong suốt? · lát liền mạch?)
## Bộ phận nhân vật: với mỗi tờ, bảng [bộ phận | khung x,y,w,h trên tờ | điểm xoay x,y | nối vào bộ phận nào]
## Chỗ chưa chắc / câu hỏi
```
