# GÓI 01 (SỬA) CHO GEMINI — Vẽ lại Kiếm Tu đúng ngoại hình gốc

Claude duyệt bài nộp `GEMINI_BATCH_01_KIEMTU_2.5D` ngày 22/11/2026.

## Phần làm rất tốt (giữ nguyên cách làm)
- Bảng toạ độ **chính xác từng pixel**: Claude đo lại 21 khung bằng máy, khớp đúng với `kiemtu_S.txt`.
- Các bộ phận tách sạch, cách nhau ≥ 48 px, nền trong suốt thật, khớp vai/khuỷu có vẽ dư phần tròn.
- Claude đã **ghép thử** 20 bộ phận lên bộ xương. Kết quả khớp, đứng được thành người (ảnh `nhan_xet/ghep_thu.png`). Như vậy cách tách này dùng được cho game.

## Vì sao phải vẽ lại: sai ngoại hình (chủ dự án quyết định)
Bản nộp là một nhân vật khác: áo xanh đậm, giáp vai bạc, kiếm đeo hông, tóc xoã dài. Kiếm Tu trong game (`tham_chieu/hero_kiemtu.png`, cũng là chân dung + ảnh chọn phái) có ngoại hình như sau, **phải giữ đúng**:
- Áo bào **trắng ngọc** nhiều lớp, **tay áo rất rộng** buông dài, viền và thêu **mây vàng**, có vài chi tiết hạc nhỏ trên tay áo.
- **Đai lưng vải xanh ngọc** thắt nút, một dải buông dài phía trước.
- Quần trắng, **giày vải đen**. **Không có giáp**: không giáp vai, không hộ cổ tay kim loại.
- Tóc đen **búi cao**, cài **trâm ngọc xanh/vàng**, vài lọn mái hai bên má. Không để tóc xoã dài sau lưng.
- **Kiếm vỏ xanh đen, chuôi vàng, đeo chéo SAU LƯNG** (chuôi nhô lên sau vai phải của nhân vật).
- Phong cách: **màu nước + nét mực** mềm như `tham_chieu/hero_kiemtu.png` và `tham_chieu/portrait_inn.png`. Không tô kiểu tranh game bóng loáng.
- Gương mặt thư sinh, hiền, như ảnh gốc.

So sánh: `nhan_xet/so_sanh_kiemtu.png` (trái: gốc · giữa: bản nộp · phải: ghép thử).

## Lỗi kỹ thuật cần sửa trong bản vẽ lại
1. **Không vẽ dấu "+" cam lên bộ phận**, không thêm tia lấp lánh ✦ (xem `nhan_xet/loi_dau_cong.png`, có 14 dấu). Điểm xoay chỉ ghi trong file `.txt`. Nếu muốn có ảnh đánh dấu thì nộp thành ảnh riêng `preview/…`.
2. **Tách chân làm 2 khúc** để gối gập được khi đi/chạy: `dui_phai`, `dui_trai` (đùi trong quần trắng) và `cang_chan_phai`, `cang_chan_trai` (cẳng chân + giày). Bản nộp gộp cả chân một khúc nên không gập gối được.
3. **Cùng một tỉ lệ cho mọi bộ phận.** Claude đo bản nộp thì tay/đầu to khoảng 1,8× so với `rig_ref`, thân 1,46×, chân 1,25×, tức tỉ lệ bị lệch. Lần này: **tờ bộ phận = đúng 2× `rig_ref`** cho tất cả bộ phận (nhân vật cao 900 px trên ref thì ghép lại cao 1800 px trên tờ).
4. **Thêm 1 cột trong `.txt`: "điểm xoay trên rig_ref x,y"**, tức toạ độ khớp đó trên ảnh `rig_ref_S.png` 1024×1024. Ví dụ vai phải ở (448,268). Có cột này Claude đặt bộ phận đúng chỗ ngay, không phải đoán.
5. `rig_ref_S.png` nộp **bản sạch**: không chấm/đường xương, không elip bóng dưới chân. Bản có xương để ở `preview/rig_ref_S_skel.png`.
6. Thêm các bộ phận rời cho chuyển động mềm: **dải đai buông**, **tua kiếm**, **tua trâm**, **đuôi tay áo phải/trái** (phần vải rộng thõng xuống dưới cổ tay, tách khỏi tay trên để lắc theo quán tính). Mỗi bộ phận có điểm xoay ở chỗ nối.

## Danh sách bộ phận hướng trước (S), dùng tên mã này
`dau` · `toc_mai` · `bui_toc` (búi + trâm) · `tua_tram` · `co` · `than_tren` (ngực + cổ áo, không tay) · `dai_lung` · `dai_buong` · `tay_tren_phai/trai` (vai + tay áo phần trên) · `duoi_tay_ao_phai/trai` · `ban_tay_phai/trai` (cổ tay + bàn tay thò ra) · `vat_ao_truoc` · `vat_ao_sau` · `vat_ao_ben_phai/trai` · `dui_phai/trai` · `cang_chan_phai/trai` · `vo_kiem` (đeo lưng, có chuôi) · `kiem` (lưỡi + chuôi, khi rút ra) · `tua_kiem`.

## Thứ tự nộp
1. `rig_ref_S.png` (sạch) + `kiemtu_S.png` + `kiemtu_S.txt` (đủ 4 cột). Nộp phần này trước để Claude ghép thử.
2. Hướng sau (N), rồi nghiêng phải (E), cùng danh sách bộ phận.
3. Tờ 4 tư thế chiến đấu: bản nộp đẹp, giữ làm tham khảo động tác. Khi vẽ lại theo ngoại hình gốc thì để **nền trong suốt**.
4. Sau khi Kiếm Tu được duyệt mới làm Thể Tu, Pháp Tu, dân làng, động vật (như đề cũ).

Nộp: `GEMINI_01_SUA.zip` gồm `assets/rig/…`, `preview/…`, `GEMINI_BATCH_01_REPORT.md` (bảng 5 cột: bộ phận | mã | khung x,y,w,h | điểm xoay trên tờ | điểm xoay trên rig_ref | cha).
