# GÓI VIỆC 08B CHO CHATGPT — Vẽ lại 8 mảnh nền còn trống + sửa vầng nắng

Giao 23/11/2026 bởi Claude. GÓI 08 đã ghép đủ 20 mảnh, khớp bố cục rất tốt, cận cảnh trong game đẹp (xem `anh_hien_tai/`). Còn 2 việc để gần concept hơn:

## Lỗi cần tránh (áp cho mọi mảnh vẽ lại)
1. **Không vẽ vầng nắng/lens glow ở góc ảnh.** Bản cũ mảnh nào cũng có một đốm nắng vàng ở góc trái trên → ghép 20 mảnh thành 20 đốm lặp đều. Ánh sáng phải **đều trên toàn mảnh** (nắng trên-trái chỉ thể hiện qua mặt sáng/tối của từng hòn đá, búi cỏ).
2. **Không vàng gắt.** Màu cỏ theo mảnh chuẩn đã cân màu `tham_chieu/mau_chuan_gp_c2_r1.webp` (xanh lục tươi, ít vàng hơn bản gốc của bạn).

## Việc chính — vẽ lại 8 mảnh đang là cỏ trơn
`gp_c0_r0, gp_c0_r1, gp_c0_r2, gp_c1_r0, gp_c3_r0, gp_c4_r0, gp_c4_r1, gp_c4_r2`
(ảnh hướng dẫn `huong_dan/guide_*.jpg`, bản cũ của bạn `ban_cu/*.webp`, toàn cảnh có khoanh vùng `tham_chieu/vung_can_lam_day.jpg`).

Giữ nguyên mọi đường đất, mảng đá, thềm, bậc đúng chỗ như bản cũ. **Chỗ cỏ trống phải làm dày như concept** (`tham_chieu/son_mon_concept.png`), tất cả đều thấp sát đất (≤ đầu gối người), không bóng đổ dài:
- cụm đá cảnh 3–5 hòn có rêu, viền cỏ quanh chân;
- luống hoa thấp viền đá (tím oải hương, hồng, vàng), khóm cẩm tú cầu thấp;
- lối đá bước chân (stepping stones) nối từ đường chính vào các khoảng trống;
- suối nhỏ/rãnh nước hẹp có đá cuội (chỉ ở c0_r1–c0_r2, chảy xuống phía nam về sông, rộng ≤ 80 px);
- thảm cỏ nhiều tông, mảng đất lộ, sỏi, cánh hoa anh đào rơi rải rác;
- mép map (nửa ngoài cột 0 và cột 4): bụi cỏ rậm + đá tảng thấp + gốc trúc non, tối dần ra mép.
Mật độ: không để mảng cỏ trơn nào lớn hơn ~250×250 px.
KHÔNG vẽ: nhà, cây có thân, cột, đèn, người, thứ cao hơn đầu gối, vầng nắng.

## Việc phụ (nếu còn lượt) — biến thể sprite thiếu từ GÓI 07
`s_herb_bed_3` (420×260 map, luống thảo đỏ cam), `p_lotus_2` (90×60, chỉ lá sen + nụ), `d_flowers_2`, `d_flowers_3`, `d_grass_2`, `d_grass_3` (120×80). Vẽ ×2 cỡ map như GÓI 07, nền trong suốt, không bóng.

## Nộp
`BATCH_08B.zip` gồm `assets/map/gp_c*_r*.png` (1536×1024, đúng tên) + biến thể (nếu có) + `BATCH_08B_REPORT.md`. Hết lượt thì nộp phần đã xong.
