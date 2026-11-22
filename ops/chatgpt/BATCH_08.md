# GÓI VIỆC 08 CHO CHATGPT — VẼ TAY NỀN SƠN MÔN (hướng 2, chủ dự án chọn 22/11/2026)

Mục tiêu chủ dự án: **trong game phải đẹp như ảnh concept của bạn** (`tham_chieu/son_mon_concept.jpg`). Nền hiện tại do code lát (cỏ trơn, đá trơn) nên phẳng và đơn điệu. Giải pháp: **bạn vẽ tay toàn bộ MẶT ĐẤT** thành 20 mảnh ghép theo lưới; nhà, cây, NPC vẫn là sprite rời đặt lên trên (để nhân vật đi ra sau nhà, va chạm, tương tác như cũ).

Code đã sẵn sàng: mảnh nào bạn nộp là game tự thay nền code chỗ đó, mép mảnh tự mờ để ghép liền.

## Lưới (xem `tham_chieu/paint_grid.jpg`)
- Map 4800×3200 px thế giới, chia 5 cột × 4 hàng. Tên mảnh: `gp_c<cột>_r<hàng>` (cột 0–4 trái→phải, hàng 0–3 trên→dưới).
- **Mỗi mảnh = 1 ảnh 1536×1024 PNG** (hoặc JPG chất lượng cao), phủ ô lưới 1200×800 **cộng lề chồng** 90 px trái/phải, 60 px trên/dưới (ô chính là khung trắng đứt trong ảnh hướng dẫn). Phần lề sẽ chồng lên mảnh bên cạnh và mờ dần — vẽ tiếp liền cảnh qua lề như bình thường.
- Tỉ lệ: **1 px thế giới ≈ 1,11 px ảnh. Một người cao ~115 px trong ảnh.** Cột 0 và 4 có nửa nằm ngoài map (vùng tô tối trong ảnh hướng dẫn): vẽ tiếp cảnh rừng trúc/đá/cỏ rậm cho kín.

## Ảnh hướng dẫn (bắt buộc bám theo)
`huong_dan/guide_gp_c<c>_r<r>.jpg` — chính là mảnh nền code hiện tại ở đúng vị trí, có đánh dấu:
- **Đường đất, quảng trường đá, thềm cao + tường kè, bậc đá, sông, ao, bờ cát**: phải nằm **đúng chỗ** trong ảnh hướng dẫn (lệch tối đa ~20 px), vì người chơi đi/va chạm theo đúng các vùng đó.
- **Khung đỏ đứt** = công trình sẽ đặt ở đây (sprite che phủ). Ô đỏ tô mờ = chân móng. Dưới chân công trình chỉ cần vẽ **nền đá/hiên/sân thấp hợp lý**, không vẽ nhà.
- **Chấm xanh lá** = gốc cây (sprite cây đặt lên) → để cỏ/đất thường, không vẽ cây.
- **Ô vàng nhỏ** = đạo cụ nhỏ (đèn, ghế, thùng) đặt lên.
- Chỗ cỏ trống còn lại: **đây là chỗ bạn làm đẹp** — vẽ như concept.

## Vẽ gì / KHÔNG vẽ gì
VẼ (giống concept): cỏ nhiều tông có mảng sáng tối, mép cỏ lấn vào đường, đường lát đá có viền, quảng trường lát đá vân tròn **có hình bát quái + sao 8 cánh ở tâm** như concept, thềm cao bằng đá có tường kè chạm mây + lan can đá thấp ở mép, bậc đá rộng có má bậc, bờ sông xếp đá cuội lớn + cát, nước trong xanh có gợn, lá sen/hoa sen, luống hoa thấp, khóm hoa dại, rêu, sỏi, đá tảng thấp (≤ nửa người), đá bước chân, bụi cỏ thấp, cánh hoa anh đào rơi trên đất.
KHÔNG VẼ: nhà, cổng, cây có thân, cột đèn, cờ, người, động vật, bất cứ thứ gì **cao hơn đầu gối** (những thứ cao sẽ là sprite riêng). **Không đổ bóng của nhà/cây** (code tự đổ). Không chữ, không khung, không viền mảnh.

## Góc nhìn & ánh sáng (giữ giống hệt nhau ở cả 20 mảnh)
- Nhìn chéo 3/4 từ phía nam ~35°, **KHÔNG phối cảnh xa gần** (không thu nhỏ dần về phía trên; mọi chỗ cùng một tỉ lệ) — khác ảnh concept ở điểm này.
- Nắng từ trên-trái, ấm buổi chiều nhẹ; màu sáng tươi như concept (cỏ xanh vàng, đá kem xám, nước ngọc lam).
- Mảnh sau phải cùng tông màu với mảnh thí điểm đã duyệt (gửi kèm mảnh đã duyệt khi vẽ mảnh mới).

## Thứ tự
1. **Thí điểm 2 mảnh trục giữa: `gp_c2_r1` (bậc lên Đại điện + nửa bắc quảng trường) và `gp_c2_r2` (nửa nam quảng trường + bảng nhiệm vụ + linh tuyền).** Nộp `BATCH_08_pilot.zip` → Claude ghép, chụp trong game, chủ dự án duyệt.
2. Duyệt xong: hàng 1–2 còn lại (c0,c1,c3,c4) → hàng 3 (sông, cầu, cổng, ao sen, linh điền) → hàng 0 (vách núi, thềm Tàng kinh các, lầu chuông, động phủ).
3. GÓI 07 (sprite công trình) vẫn cần — làm xen kẽ, ưu tiên `b_sect_hall`, `b_sect_gate`, `p_spirit_spring`, `p_lion_statue`.

## Nộp
`BATCH_08_<tên>.zip` chứa `assets/map/gp_c<c>_r<r>.png` (đúng 1536×1024) + `BATCH_08_REPORT.md` (mảnh nào, có lệch chỗ nào so với hướng dẫn không).
