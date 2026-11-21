# Phụ lục GÓI 01 (T17, T31, T23, T30) — trả lời câu hỏi mở + số liệu thật cho Muse (Claude, 21/11/2026)

Bắt buộc đọc cùng spec khi làm T18 (công pháp/trang bị), T24 (nội thất), T16 (hội thoại).

## 1. NPC — dữ liệu thật (bảng trong BATCH_01 bị trống do lỗi trích xuất của Claude)

| id | Tên | Vai | Cảnh giới · môn phái | Tiểu sử | Câu thoại đang dùng |
|---|---|---|---|---|---|
| `inn` | Thanh Thạch | Trưởng lão | Trúc Cơ · tầng 3 · Thanh Vân Tông | Người chỉ dẫn tân tu, trấn giữ Thanh Thạch Thôn. | Hãy tìm Thanh Trúc Lâm, hạ Trúc Lang Vương rồi đột phá Trúc Cơ. |
| `shop` | Linh Dược | Dược thương | Luyện Khí · tầng 6 · Vạn Bảo Các | Thu mua linh dược và bán đan dược. | Đạo hữu cần chuẩn bị đan dược trước khi vào vùng yêu thú. |
| `sentry` | Lục Thanh | Hộ vệ | Luyện Khí · tầng 8 · Thanh Vân Tông | Tuần tra đường vào thôn. | Cẩn thận yêu thú ngoài rừng. Quan sát tư thế của chúng và lướt né đúng nhịp. |
| `herbalist` | Mộc Tử Y | Dược sư | Luyện Khí · tầng 5 · Bách Thảo Đường | Thu hái thảo dược và luyện đan. | Linh dược Hắc Độc Trạch chứa linh khí rất mạnh. |
| `wanderer` | Tạ Vô Nhai | Tán tu kiếm khách | Trúc Cơ · tầng 1 · Tán tu | Du hành giữa thôn và đường trúc. | Kiếm ý không đến từ lời nói; hãy tự mình trải nghiệm rừng trúc. |
| `bambooKeeper` | Vân Tịch | Đệ tử nội môn | Luyện Khí · tầng 9 · Thanh Vân Tông | Tĩnh tu và canh bia đá Thanh Vân. | Bia đá Thanh Vân còn lưu lại một đoạn đạo vận cổ xưa. |
| `mountainHunter` | Hàn Liệt | Thợ săn yêu thú | Trúc Cơ · tầng 2 · Tán tu | Săn yêu thú ở Vạn Yêu Sơn. | Cổ kiếm trong núi không thuộc về kẻ thiếu kiên nhẫn. |
| `snowHermit` | Bạch Vân | Ẩn sĩ | Trúc Cơ · tầng 5 · Bắc Minh Sơn | Ẩn tu bên suối lạnh. | Hàn Băng Linh Tuyền có thể củng cố đạo tâm. |
| `swampMedic` | Đường Uyển | Y tu | Trúc Cơ · tầng 1 · Bách Thảo Đường | Nghiên cứu linh độc ở đầm lầy. | Linh dược trong đầm quý hiếm, nhưng yêu thú rất hung dữ. |
| `desertSmith` | Thiết Nham | Luyện khí sư | Trúc Cơ · tầng 4 · Thiên Công Các | Tìm khoáng thạch luyện pháp bảo. | Xích Viêm Thạch là thử thách đầu tiên của người luyện khí. |
| `demonWatcher` | Mạc Ly | Trấn vực giả | Trúc Cơ · tầng 7 · Huyền Minh Điện | Canh giữ đường vào trận pháp Vạn Giới. | Trận pháp chỉ mở khi ngươi đã vượt qua Trúc Lang Vương và đạt Trúc Cơ. |
| `ghostSeer` | U Lan | Linh môi | Trúc Cơ · tầng 6 · U Minh Điện | Lắng nghe tàn hồn nơi cổ tích. | Tàn hồn cổ tu chờ một người đủ duyên để lĩnh ngộ. |

Đã đối chiếu: lời thoại T30 khớp vai trò từng NPC → giữ nguyên, không cần sửa.

## 2. Migration thiện cảm cho save cũ (ChatGPT đề xuất) — DUYỆT
Khi tải save: với 10 NPC mới, nếu `p.v12Talk[npc]` đã `true` và `p.favor` chưa có khoá NPC đó (`!Object.hasOwn(p.favor,npc)`) → đặt `p.favor[npc]=5` đúng một lần. Không đụng `inn`/`shop`, không thưởng gì khác. Làm trong T16 (lớp resume tường minh: thêm `resume_L19` gọi `resume_L18`, đổi điểm vào `resume()` — xem cách T05).

## 3. Đơn vị chỉ số `currentStats()` (cho T18)
Gốc theo phái (`CLASSES[p.cls].stats`) + `regen:11, burn:0, slow:0, leech:0, luck:0, dashCd:0.9`, rồi cộng cấp, công pháp cũ (`TECH[id].apply`), linh bảo (4 ô), trang bị; cuối cùng `crit` kẹp 0–0,6.
| stat | Nghĩa / đơn vị | Gốc (Kiếm/Thể/Pháp) |
|---|---|---|
| hp, mp | tối đa | 110/160/95 · 70/50/105 (+7 hp mỗi cấp) |
| attack | công vật lý | 25/30/23 (+2 mỗi cấp) |
| def | thủ (giảm sát thương `100/(100+def)`) | 7/14/5 |
| speed | px/giây | 245/222/236 |
| crit | tỉ lệ 0–1 | 0,18/0,08/0,12 |
| range | tầm đòn px | 124/110/138 |
| rate | hệ số tốc đánh (hồi đòn thường = `max(.27,.39/rate)` giây) | 1,03/0,85/0,93 |
| regen | MP hồi mỗi giây | 11 |
| dashCd | hồi khinh công (giây) | 0,9 |
| burn | sát thương thiêu mỗi giây lên quái | 0 |
| slow | tỉ lệ làm chậm quái 0–1 | 0 |
| leech | HP hồi mỗi lần hạ quái | 0 |
| luck | phúc duyên (tăng rơi đồ/linh thạch) | 0 |
| spellAtk | công pháp thuật (V10, dùng cho kỹ năng) | tính từ attack |
Công thức ngưỡng mềm/trần của spec T31 §3.3 áp lên **phần cộng thêm từ công pháp mới**, sau khi tính công pháp cũ — đúng như spec.

## 4. Trang bị mới — cách nối vào `EQUIPMENT`
Lúc chạy `EQUIPMENT` là mảng **đối tượng** có `id` = chỉ số (0–62), một số món có thêm `v28Boss`, `v28Affix`, `v29Set`. T18 nối 20 món theo đúng thứ tự file: `EQUIPMENT.push({id:EQUIPMENT.length, key:<id chuỗi trong data>, name, sheet:icon.sheet, index:icon.index, slot, element, atk, def, style, reqLevel, desc, lore})` → chỉ số 63–82. Kiểm `EQUIPMENT.length===63` trước khi nối; nếu khác → KHÔNG nối, báo lỗi (tránh lệch save). Không đổi 0–62.

## 5. Công pháp mới — lưu riêng, không trộn `TECH`
Giữ `TECH` + `p.techs` như cũ. Công pháp mới đọc từ `DATA.techs`, trạng thái lưu ở `p.techRanks` (id → bậc) và `p.techEquipped` (mảng id) như spec — mặc định `{}`/`[]`. Hiệu ứng áp trong `currentStats()` sau phần `TECH` cũ (sửa thẳng hàm, không bọc lớp). `FUSIONS` chỉ dùng id cũ.

## 6. Nguồn nhận
- Học tại Trưởng lão (`inn`): thêm vào bảng NPC/hội thoại của inn một lựa chọn "Tàng kinh — học công pháp" mở tab Công pháp (không thêm NPC).
- 4 món boss: boss vùng là `V22_REG[id].boss`, trạng thái hồi sinh `v22State().bosses[id]`. Muse tìm chỗ boss vùng chết (grep `v22State().bosses`) để trao đúng 1 lần, lưu cờ trong `p.flags['tech_boss_'+id]`.
- Trang bị mới rơi theo vùng: nối vào pool rơi đồ có sẵn của vùng (Muse tìm theo `V22_REG[id].qlo/qhi` và hàm rơi đồ), không đổi tỉ lệ đồ cũ.

## 7. Nội thất (T24) — toạ độ thật của hệ V36
Phòng vẽ trong khung logic; NPC đứng tại `V36_NPC = {x:640,y:310}`, lối ra `V36_EXIT = {x:640,y:558}`, vật cản hiện có `V36_FURN` = 4 khối `(301,254,186×65) (793,254,186×65) (307,390,160×56) (813,390,160×56)` (src/25). 33 rect trong spec T23 là minh hoạ: khi dựng, đồ vật nào chắn đường phải khớp/cập nhật `V36_FURN` có chủ ý (ghi HANDOFF), còn lại là decor phẳng. Ảnh concept: `ASSETS["interior_inn_concept"]` (đã nạp, 1672×941).

## 8. Cường hoá — dùng Thiên Công Phường có sẵn (bổ sung 21/11 20:55, áp cho T18)
Game đã có lò rèn **Thiên Công Phường** (phím P, `modal.kind==='v30forge'`, `src/20_v30_v21.js`): Cường hoá +1…+20 (mỗi cấp +12% hệ số chỉ số gốc; thất bại không tụt cấp, cộng 12% cơ hội lần sau), Tinh luyện, Khảm linh thạch, Tiến hoá/Thức tỉnh, Pháp bảo. Spec T31 §cường hoá (nút trong bảng I, tối đa +10, khối `upgrade` trong `data/equipment.js`) **trùng hệ này** → quyết định: **chỉ giữ Thiên Công Phường**. T18 KHÔNG thêm nút cường hoá vào bảng I, bỏ qua khối `DATA.equipment.upgrade`; 20 trang bị mới cường hoá qua lò rèn có sẵn như 63 món cũ. Phần giao diện lò rèn sẽ có spec riêng (GÓI 03 ChatGPT).
