# Phụ lục: Thôn tân thủ kiểu 2.5D (tranh 2D có chiều sâu) + tương tác — v1.0 (Claude, 22/11/2026)

Chủ dự án chốt **kiểu 1** (như Hades / Children of Morta): ảnh 2D vẽ tay, nhìn 3/4 từ trên, nhưng **có chiều sâu và sống động** — không còn cảm giác "một ảnh dán vào". Đọc cùng `newbie_map.md` (quy ước vẽ mục 2 vẫn giữ nguyên).

## 1. Chiều sâu (ai làm: ChatGPT vẽ lớp, Claude code camera/ánh sáng)
- **4 lớp:** (a) nền xa — núi mây trượt chậm 0,25× camera; (b) nền giữa — đồi, rừng xa 0,55×; (c) **thế giới** — nền lát + nhà/cây/người y-sort (1×); (d) **tiền cảnh** — cành lá/trúc/mái hiên sát mép màn hình trượt nhanh 1,35× và mờ nhẹ, che một phần khung hình.
- **Bóng đổ** mềm theo hướng nắng, đổi theo giờ (sáng dài về tây, trưa ngắn, chiều dài về đông); đêm chỉ còn bóng quanh nguồn sáng.
- **Ánh sáng ngày–đêm** 4 mốc (bình minh, ngày, hoàng hôn, đêm): lớp màu phủ + **nguồn sáng thật** (đèn lồng, lò rèn, cửa sổ, đom đóm) toả quầng ấm, bật lúc chiều tối.
- **Độ mờ xa:** lớp nền xa/giữa hơi nhoè + nhạt (phối cảnh khí quyển); sương sớm trôi thành dải.

## 2. Sống động & tương tác (ai làm: Muse code, Gemini/ChatGPT vẽ sprite nhỏ)
- **Dân làng đi lại** (4–6 người, không phải NPC nhiệm vụ): đi theo đường, dừng ở chợ/giếng/ruộng theo giờ trong ngày, đêm về nhà; tránh người chơi; thỉnh thoảng hiện bong bóng thoại 1 câu khi đi ngang (lấy từ danh sách câu).
- **Động vật:** gà mổ thóc quanh ruộng, chó/mèo nằm hiên, vịt bơi trên sông, **chim đậu đất bay vụt lên khi người chơi lại gần**, bướm ban ngày, đom đóm ban đêm.
- **Cỏ/bụi/trúc phản ứng:** rung rạp khi người chơi đi qua; cả cây đung đưa nhẹ theo gió (đỉnh lắc, gốc đứng).
- **Nước:** gợn sáng chạy trên mặt sông, **vòng sóng lan ra** khi người chơi đi qua cầu/bờ, cá thỉnh thoảng nhảy.
- **Hạt & khí quyển:** lá/cánh anh đào bay theo gió, khói bếp từ ống khói, tàn lửa lò rèn, bụi dưới chân khi chạy trên đường đất, **dấu chân** mờ dần trên đất.
- **Vật tương tác (nhấn E):** đọc bảng ủy thác (đã có), **ngồi ghế đá** (hồi máu nhanh hơn, camera lùi nhẹ), **rung chuông đại điện** (âm thanh + chim bay), **múc nước giếng**, **thả câu** ở bến sông (mini-game đơn giản, ra cá = nguyên liệu bán được), **cửa nhà mở/đóng** khi lại gần.
- **Phản hồi chuyển động** (Claude, cùng bộ xương): bụi lướt khi Shift, vết trượt khi dừng gấp, nghiêng người vào cua, chậm lại khi lên bậc đá.

## 3. Ảnh cần thêm (ngoài danh sách `newbie_map.md` mục 4)
| Ai | File | Ghi chú |
|---|---|---|
| ChatGPT | `bg_far` (3200×700), `bg_mid` (3200×600) | nền xa/giữa, mép dưới tan trong suốt |
| ChatGPT | `fg_branch_1..3`, `fg_bamboo_1..2`, `fg_eave_1` (600–900 rộng) | tiền cảnh, nền trong suốt |
| ChatGPT | `p_bench_stone`, `p_bell` (chuông lớn), `p_pier` (bến gỗ), `p_chimney_smoke` (mảng khói mềm) | đạo cụ tương tác |
| ChatGPT | `light_glow` (512×512 quầng sáng ấm, tâm sáng tan dần) | Claude dùng cho nguồn sáng |
| Gemini | dân làng × 4 (ông lão, bà bán hàng, em bé, nông dân) — **cùng bộ bộ phận** như nhân vật chính, 3 hướng | dùng chung bộ xương |
| Gemini | động vật: gà, chó, mèo, vịt, chim sẻ, bướm — mỗi con 3–4 khung (đứng/đi/vụt bay) | nền trong suốt, cùng tỉ lệ nhân vật 104 px |

## 4. Mốc nghiệm thu thôn mới
1. Bố cục khối màu đi lại được, va chạm + chiều sâu đúng (Muse M1–M2).
2. Ảnh thật thay khối màu (ChatGPT) + 4 lớp chiều sâu + ánh sáng ngày–đêm (Claude).
3. Nhân vật chính đi/chạy bằng bộ xương (Gemini + Claude).
4. Dân làng, động vật, phản ứng cỏ/nước, hạt, vật tương tác (Muse M3 + Gemini sprite).
5. FPS thôn ≥ 50 trên máy ảo 1280×720 (máy thật sẽ cao hơn).
