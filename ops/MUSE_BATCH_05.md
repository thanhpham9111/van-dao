# GÓI VIỆC 05 CHO MUSE (qua zip) — Chiều sâu 2.5D + ánh sáng cho thôn tân thủ, hội thoại NPC, nội thất quán trọ

Giao 22/11/2026 bởi Claude. Cách làm như GÓI 04: nhận zip → viết file mới + PATCH json → nộp `MUSE_05.zip`. Luật code giữ nguyên (`MUSE_BATCH_03.md`): file mới, `'use strict'`, không bọc đè hàm người khác, dùng `FRAME_HOOKS`/`COMBAT_HOOKS`, PATCH `{task,file,old,new,why}` với `old` khớp ĐÚNG 1 lần, save cũ thiếu trường thì có mặc định.

## Kết quả GÓI 04 (để biết)
DONE — `data/town_layout.js`, `src/65_town_map.js` (cờ `TOWN_NEW`), `src/67_town_life.js` đã ghép, test_suite 12/12, 0 lỗi console. Map vẫn đang dùng khối giữ chỗ vì ảnh thật của ChatGPT chưa về — code của bạn tự thay khi `ASSETS["map_*"]` có.

## Thay đổi lớn từ lúc bạn nộp GÓI 04 (đọc trước khi code)
- **HUD mới kiểu Titan Quest** (`src/69_hud_tq.js`, cờ `HUD_TQ=true`): một khối đáy đồng-sơn-mài (y 642–720, x 214–1066) chứa máu · 7 ô kỹ năng · linh lực; góc trái trên là chân dung + hàng icon; góc phải trên là bản đồ tròn. **Không vẽ gì đè vào 3 vùng này.** Dùng `hudTQZoneHit(x,y,w,h)` để kiểm tra một khung có nằm dưới HUD không. Ảnh chụp: `anh_hien_tai/hud_tq_*.png`.
- **Con trỏ mới** vẽ ở `FRAME_HOOKS.overlay` (cuối `src/69`). Hook overlay của bạn phải đăng ký TRƯỚC con trỏ, hoặc dùng `FRAME_HOOKS.overlay.unshift(fn)` để con trỏ luôn nằm trên cùng.
- Bảng (modal) vẫn kiểu **A · giấy dó** (`src/61_ui_style.js`, `uiPaperBegin/End`, `uiNoPaper`).

---

## M1 — T73 + T22: `src/68_depth_light.js` — chiều sâu 2.5D + ánh sáng ngày–đêm cho thôn (ƯU TIÊN)
Đọc `ops/specs/newbie_map_25d.md` mục 1, `ops/specs/lighting.md` + `lighting_addendum.md` (chỉ phần áp vào thôn). Gắn vào `townDrawWorld()` của bạn (src/65) bằng PATCH; khi `TOWN_NEW=false` thì không làm gì.

1. **4 lớp parallax:** nền xa trượt 0,25× camera, nền giữa 0,55×, thế giới 1× (y-sort như cũ), tiền cảnh 1,35× (cành/trúc/mái hiên sát mép, alpha .85, mờ đi khi người chơi đứng sau). Ảnh `bg_far`, `bg_mid`, `fg_*` CHƯA có → vẽ giữ chỗ bằng code: dãy núi 2–3 lớp đường cong mềm nhạt dần theo xa, một dải rừng xa, vài cành lá tối ở hai mép. Có ảnh thật (`ASSETS["map_bg_far"]`…) thì dùng ảnh.
2. **Bóng đổ theo giờ:** mỗi vật thể có `foot` đổ một bóng elip/hình bình hành mềm về phía ngược nắng. Độ dài + hướng lấy theo giờ `(p.worldTime%360)/15`: sáng dài về tây, trưa ngắn, chiều dài về đông, đêm chỉ còn bóng quanh nguồn sáng. Vẽ cả lô bóng vào **một canvas phụ cache theo phút game** (không vẽ lại mỗi khung).
3. **Ánh sáng 4 mốc** (bình minh / ngày / hoàng hôn / đêm): một lớp màu phủ (`multiply`) nội suy mượt giữa các mốc, dùng mã màu trong `lighting.md`. **Nguồn sáng thật** bật từ chiều tối: đèn lồng (`p_lantern_*`), lò rèn (`v13_forge`), cửa sổ nhà, ống khói (`smoke` trong layout), đom đóm của `67_town_life`. Mỗi nguồn là một quầng `lighter` (ảnh `light_glow` nếu có, không thì `createRadialGradient`), nhấp nháy nhẹ. Quầng cũng **xoá bớt lớp tối** quanh nó (vẽ lớp tối vào canvas phụ, đục lỗ bằng `destination-out` rồi mới phủ lên).
4. **Phối cảnh khí quyển:** nền xa/giữa nhạt + hơi xanh lam; sương sớm (5h–8h game) trôi thành 2–3 dải mờ ngang.
5. **Hiệu năng:** FPS thôn không được tụt quá 10% so với lúc chưa có M1 (bạn tự đo bằng `townFrameStats()`). Thêm cờ `DEPTH_LIGHT=true` đầu file, kèm 3 mức theo `v41Quality()`: thấp = chỉ lớp màu phủ; vừa = thêm parallax + bóng; cao = đủ cả.
6. **Tự kiểm Node:** hàm tính giờ → mốc sáng + màu nội suy (8 mẫu giờ); hướng/độ dài bóng ở 6h, 12h, 17h, 22h; danh sách nguồn sáng đọc từ layout (đủ đèn lồng + lò rèn + ống khói).

## M2 — T16: Hội thoại NPC thật (12 NPC × 3 lần gặp) — `src/70_dialogue.js`
Dữ liệu đã có: `data/dialogues.js` (ChatGPT, T15). Đọc `ops/specs/dialogue.md` + **`ops/specs/dialogue_addendum.md`** (bắt buộc: cách chèn ở `v8Talk`, `modal.kind='dialogue'`, migration thiện cảm `batch01_addendum.md` §2).
- Mở hội thoại mới khi `DATA.dialogues.npcs[id]` hợp lệ; không thì giữ bảng NPC cũ `npc8` (ảnh `anh_hien_tai/npc_cu.png`).
- Khung **kiểu giấy A** (đi qua `panel()`), chân dung NPC lớn bên trái (`ASSETS["portrait_<id>"]`, đã có 12 ảnh), chữ hiện dần (bấm/Space = hiện hết, bấm lần nữa = câu sau), 2–4 lựa chọn đánh số 1–4, phím ESC đóng.
- Lần gặp 1/2/3 theo `p.v8Relations[id]`; lựa chọn cộng/trừ thiện cảm, mở nhiệm vụ (`v12*`), tặng vật phẩm — đúng như dữ liệu ghi; không bịa hệ mới.
- Ở thôn mới (V47T) nhấn E vào NPC phải mở được hội thoại này (`v47tInteractNPC` → xem chỗ gọi `v8Talk`).
- Tự kiểm Node: đọc đủ 12 NPC, mỗi NPC đi hết 3 lần gặp theo nhánh đầu tiên không lỗi, thiện cảm cập nhật đúng.

## M3 (làm nếu còn chỗ) — T24: Nội thất **quán trọ** (phòng đầu tiên trong 5 phòng V36) — `src/71_interior.js`
Theo `ops/specs/interior.md` + `batch01_addendum.md` §7, ảnh concept `assets/interior_inn_concept.webp` (có trong zip). Code phòng V36 hiện tại: `src/25_v36_v37.js` (`v36Inside`, `V36_ROOMS`, vẽ phòng). Làm phòng inn kiểu 2.5D cùng quy tắc với thôn: nền sàn + tường sau + đồ đạc y-sort + va chạm theo `foot`, quầng đèn dầu, NPC chủ quán đứng sau quầy, cửa ra. Ảnh nội thất chưa cắt sẵn → khối giữ chỗ như GÓI 04, bố cục khớp ảnh concept. Cờ `INTERIOR_NEW=true`; 4 phòng kia giữ nguyên.

---

## Nộp `MUSE_05.zip`
`src/68_depth_light.js`, `src/70_dialogue.js`, `src/71_interior.js` (nếu làm), `ops/patches/MUSE_05.json`, `MUSE_05_REPORT.md`:
```
# MUSE_05 — báo cáo
## M1/M2/M3: hàm game đã dùng (file:dòng), PATCH (số lượng, mỗi cái 1 dòng lý do)
## Tự kiểm Node (lệnh + kết quả)
## Hiệu năng M1 (FPS trước/sau, nếu đo được)
## Rủi ro / chỗ cần Claude xem trên trình duyệt
```
Làm theo thứ tự M1 → M2 → M3; hết chỗ thì nộp `MUSE_05_part1.zip` trước (chỉ cần M1). Claude tự thêm thẻ `<script>` vào `index.html`.
