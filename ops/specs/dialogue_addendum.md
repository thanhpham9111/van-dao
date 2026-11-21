# Phụ lục T15 — tích hợp cho T16 (Claude, 21/11/2026)

Trả lời 4 điểm spec T15 §4 nhờ xác nhận, và quy tắc ghép vào game. Bắt buộc cho T16.

## 1. Đường vào hội thoại (thật)
Nút [E] / click trong thôn V47T → `v47tInteract` → `v47tInteractNPC(n)` → `v471Legacy(n)` → `v8InteractAt(o)` → `v8Talk(o)` (chuỗi 4 lớp, T09 sẽ gộp). Ngoài thế giới cũng đi qua `v8InteractAt`/`v8Talk`. Lớp V36 trong `v8Talk` xử lý "phải vào trong nhà mới gặp được NPC" — giữ nguyên.
→ T16 chèn hội thoại mới ở `v8Talk`: nếu `DATA.dialogues.npcs[o.id]` có dữ liệu hợp lệ → mở hội thoại mới (`modal.kind='dialogue'`, thêm 1 dòng vào `panel()` theo quy tắc T03); không thì giữ bảng NPC cũ (`npc8`).

## 2. Nhiệm vụ "Gặp trưởng lão"
Hiện tại `p.v12Talk[o.id]=true; v12Check(); save();` chạy NGAY khi mở bảng NPC (lớp V12 của `v8Talk`). Hiệu ứng `"talked": true` trong data = gọi đúng 3 lệnh đó (không đặt trường khác). Chấp nhận đổi thời điểm sang lúc kết thúc hội thoại như spec; Esc giữa chừng thì lần sau mở lại `inn_1`.
Lưu ý: lớp V12 vẫn tự đặt `v12Talk` khi mở bảng `npc8` → bảng cũ mở qua nút "Việc khác" (mục 3) cũng hoàn thành nhiệm vụ như trước. Không sao, nhưng không được gọi 2 lần trong cùng một lượt.

## 3. KHÔNG được làm mất chức năng của bảng NPC cũ
Bảng `npc8` (`v8Panel`) có: "Trò chuyện" (`v8Chat`), "Nhận/Báo cáo nhiệm vụ" phụ của từng NPC (`p.v8Quests['quest:'+id]`), "Mua 2 Hồi Xuân Đan · 5 linh thạch" (`v8Shop`, chỉ Dược thương), quà tặng/ký ức V13.
→ Khung hội thoại mới có thêm 1 nút CỐ ĐỊNH (do code vẽ, không nằm trong data): **"Việc khác [Tab]"**, đặt cạnh nút Esc (x1036,y382,w128,h38; dời ô thiện cảm sang x772,y382,w256). Bấm → đóng hội thoại (không commit node đang dở) và mở bảng `npc8` cũ của NPC đó.

## 4. "Cho ta xem hàng" (`openShop`)
Game KHÔNG có panel cửa tiệm riêng. `openShop: true` = sau khi commit effects, mở bảng `npc8` của Dược thương (có nút mua đan `v8Shop`). Không mua tự động.

## 5. Chân dung (`portrait: null`)
Dùng `imgs['npc_'+id]` (cùng ảnh `v8Figure` đang dùng, tải theo `V8_PEOPLE`). Vẽ trong khung (40,192,288,456), giữ tỉ lệ, phóng tối đa 2× kích thước ảnh gốc. Ảnh chưa sẵn → ấn chữ fallback như spec §2.2.

## 6. Phím
Esc / Enter / Space / 1–4 / Tab chỉ xử lý khi `modal.kind==='dialogue'`, và phải chặn không cho xuống gameplay (1–3 đang là phím kỹ năng). Kiểm trong hàm xử lý phím gốc (T09 gộp `v8PointerDown`).
