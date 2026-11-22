# GÓI VIỆC 01 CHO GEMINI — Bộ phận nhân vật cho bộ xương chuyển động (game "Vạn Đạo Tu Tiên")

Chào Gemini. Bạn tham gia nhóm làm game HTML5 tu tiên "Vạn Đạo Tu Tiên" cùng Claude (code chính), ChatGPT (vẽ map) và Muse (code nháp). Việc của bạn: **vẽ nhân vật thành các bộ phận rời** để Claude dựng bộ xương 2D (kiểu Spine) — chân bước thật, tay vung, tóc/đai/vạt áo đung đưa. Bạn được chọn vì giữ ngoại hình nhân vật nhất quán giữa các ảnh tốt.

## Nhân vật: Kiếm Tu (làm trước)
Ảnh gốc `tham_chieu/hero_kiemtu.png` (toàn thân, đứng) và `tham_chieu/walk_cu.png` (4 khung đi cũ — bị lỗi, chỉ để xem trang phục). Giữ đúng: thanh niên tóc đen búi cao cài trâm vàng có tua, áo bào trắng ngọc thêu mây vàng, tay áo rộng, đai lưng xanh ngọc có dải buông, giày trắng thêu, kiếm vỏ đen chuôi vàng có tua đeo chéo sau lưng. Phong cách: màu nước + nét mực, bán tả thực, ánh sáng từ trên-trái (như `tham_chieu/portrait_inn.png`).

## Cần nộp (theo thứ tự, nộp được phần nào gửi phần đó)
1. **`rig_ref_S.png`** — toàn thân **hướng trước** (nhìn thẳng, hơi 3/4 từ trên xuống ~35°), tư thế đứng trung tính: hai chân hơi tách, hai tay buông thả cách thân một chút (không che thân), nền trong suốt, cao ~900 px trên khổ 1024×1024.
2. **`kiemtu_S.png`** — cùng nhân vật, cùng tỉ lệ, các bộ phận **tách rời trên một tờ 2048×2048 nền trong suốt, không chồng lên nhau, cách nhau ≥ 24 px**:
   đầu (gồm tóc mái + trâm) · búi/đuôi tóc + tua trâm · thân trên (ngực + đai lưng, không tay) · tay trên trái · tay trên phải (gồm tay áo rộng) · cẳng tay + bàn tay trái · cẳng tay + bàn tay phải · vạt áo trước (từ eo xuống) · vạt áo sau · đùi trái · đùi phải · cẳng chân + giày trái · cẳng chân + giày phải · kiếm trong vỏ · dải đai buông · tua kiếm.
   Mỗi bộ phận **vẽ dư phần khớp** (đầu tròn ở vai, khuỷu, hông, gối) để khi xoay không lộ khe.
3. **`rig_ref_N.png` + `kiemtu_N.png`** — hướng sau (nhìn lưng), cùng danh sách bộ phận.
4. **`rig_ref_E.png` + `kiemtu_E.png`** — hướng nghiêng phải (nhìn ngang), cùng danh sách (tay/chân xa có thể sẫm hơn một chút).
5. Sau khi Claude duyệt Kiếm Tu: **Thể Tu** (`tham_chieu/hero_thetu.png`) và **Pháp Tu** (`tham_chieu/hero_phaptu.png`), cùng cách.

## Kèm theo mỗi tờ bộ phận: bảng toạ độ (dán vào chat hoặc file `kiemtu_S.txt`)
`bộ phận | khung x,y,w,h trên tờ 2048 | điểm xoay x,y (khớp nối với bộ phận cha) | bộ phận cha`
Ví dụ: `tay trên phải | 1310,120,180,330 | 1400,140 (vai) | thân trên`. Điểm xoay của thân trên = hông giữa.

## Lưu ý
- Không chữ, không khung, không bóng đổ xuống đất. Không thêm chi tiết khác bản gốc.
- Bộ phận trên tờ phải **cùng tỉ lệ** với `rig_ref` (ghép lại phải khớp đúng ảnh ref).
- Nếu tách tay áo rộng khó: vẽ tay trên kèm phần tay áo, cẳng tay chỉ là cổ tay + bàn tay thò ra từ tay áo.

## Thêm (22/11): sau Kiếm Tu — dân làng + động vật cho thôn tân thủ
Đọc `newbie_map_25d.md` mục 3. Dân làng × 4 (ông lão, bà bán hàng, em bé, nông dân) vẽ **cùng cách tách bộ phận** như Kiếm Tu (3 hướng) để dùng chung bộ xương. Động vật (gà, chó, mèo, vịt, chim sẻ, bướm): mỗi con 3–4 khung (đứng / đi / chạy hoặc vụt bay) trên một tờ ngang, nền trong suốt, cùng tỉ lệ với nhân vật cao 104 px trên map.
