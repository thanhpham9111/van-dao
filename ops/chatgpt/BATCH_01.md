# GÓI VIỆC 01 CHO CHATGPT — làm liền một mạch, nộp một lần

Giao ngày 21/11/2026 14:40 bởi Claude. Làm **theo thứ tự B1 → B4**. Mỗi việc có sẵn **dữ liệu thật lấy từ game** ở dưới — dùng đúng, KHÔNG đoán. Chỗ nào thật sự thiếu thông tin: ghi vào "Câu hỏi mở" trong báo cáo rồi chọn phương án an toàn nhất, không dừng cả gói.

## Cách nộp

Một file **`BATCH_01.zip`** gồm:
```
data/techs.js                     (B1)
data/equipment.js                 (B1)
ops/specs/techs_ui.md             (B2)
ops/specs/interior.md             (B3)
assets/interior_inn_concept.png   (B3 — ảnh concept, nếu tạo được)
data/dialogues.js                 (B4 — BẢN ĐẦY ĐỦ: giữ nguyên inn + shop đã duyệt, thêm 10 NPC)
BATCH_01_REPORT.md                (báo cáo, khuôn ở cuối file này)
```
Trước khi nén, tự kiểm theo mục "Tự kiểm" của từng việc (đặc biệt: JSON hợp lệ).

---

## B1 — T17: Dữ liệu 30 công pháp + 20 trang bị

Theo **schema T14** (`ops/specs/schemas.md` §1, §2 — có trong BRIEF). ĐÃ SỬA 14:40: trang bị có **3 ô** `weapon`/`armor`/`accessory`; `style` có thể `""`; đồ mới nối từ chỉ số 63.

**Công pháp có sẵn (CẤM trùng id, nên khác tên):**

| id | Tên | Hệ | Mô tả |
|---|---|---|---|
| `sword` | Thanh Vân Kiếm Quyết | Kim | Tăng 20% công kích và tầm đòn. |
| `body` | Huyền Thạch Luyện Thể | Thổ | Tăng 14 phòng ngự và 25 sinh mệnh. |
| `fire` | Xích Viêm Tâm Pháp | Hỏa | Đòn đánh thiêu đốt mục tiêu. |
| `water` | Hàn Nguyệt Quyết | Thủy | Thủy khí làm chậm yêu thú, +20 linh lực. |
| `wind` | Lưu Phong Thân Pháp | Mộc | Tăng tốc chạy và tốc độ chém. |
| `thunder` | Lôi Minh Quyết | Lôi | Bạo kích tăng 12%, kiếm khí mạnh. |
| `flame_sword` | Liệt Diễm Thanh Vân | Kim · Hỏa | Kiếm khí hỏa diễm, tăng sát thương, thiêu đốt mạnh. |
| `thunder_body` | Lôi Kiếp Thần Thể | Thổ · Lôi | Thần thể mạnh, bạo kích và phòng ngự cao. |
| `frost_wind` | Hàn Phong Linh Quyết | Thủy · Mộc | Khinh công linh hoạt, làm chậm và tăng linh lực. |

**Linh bảo (relic) có sẵn — tham khảo để không trùng ý tưởng:**

| id | Tên | Hệ | Mô tả |
|---|---|---|---|
| `jade` | Ngọc Bội Tụ Linh | Thủy | Linh lực hồi nhanh hơn 50%. |
| `blade` | Kiếm Tâm Thạch | Kim | Công kích tăng 18%. |
| `blood` | Huyết Liên Tử | Hỏa | Hồi sinh mệnh khi tiêu diệt quái. |
| `shell` | Huyền Vũ Giáp | Thổ | Tăng 10 phòng ngự, +20 sinh mệnh. |
| `feather` | Thanh Phong Vũ | Mộc | Giảm hồi chiêu lướt và tăng tốc đánh. |
| `coin` | Thiên Cơ Tiền | Kim | Tăng phúc duyên và linh thạch nhận được. |
| `lantern` | U Minh Đăng | Hỏa | Tăng công kích và thiêu đốt. |
| `bone` | Bạch Cốt Hoàn | Thổ | Tăng phòng ngự 15. |
| `frost` | Hàn Ngọc | Thủy | Đòn đánh làm chậm yêu thú. |
| `pearl` | Lôi Châu | Kim | Tăng 10% bạo kích. |
| `v30_lotus` | Tam Sinh Liên Đài | Mộc | +90 sinh lực · +12 phòng ngự |
| `v30_sword` | Thái Hư Kiếm Ấn | Kim | Công kích +20% · chí mạng +5% |
| `v30_bell` | Huyền Thiên Chung | Thổ | Phòng ngự +35 · sinh lực +120 |
| `v30_mirror` | Cửu Tiêu Lôi Kính | Lôi | Tốc đánh +22% · công kích +18% |

**63 trang bị đang có (chỉ số 0–62) — tham khảo mức chỉ số, không trùng tên:**

| # | Tên | Ô | Hệ | Công | Thủ | Style | Icon (sheet:index) |
|---|---|---|---|---:|---:|---|---|
| 0 | Thanh Mộc Phi Tiêu | weapon | Mộc | 6 | 0 | ranged | weapons:0 |
| 1 | Diệp Vũ Loan Đao | weapon | Mộc | 9 | 0 | fast | weapons:1 |
| 2 | Hàn Nha Kiếm | weapon | Thủy | 12 | 0 | frost | weapons:2 |
| 3 | Toái Sơn Nha | weapon | Thổ | 17 | 0 | heavy | weapons:3 |
| 4 | Huyết Ẩm Đoản Đao | weapon | Hỏa | 12 | 0 | blood | weapons:5 |
| 5 | Trạch Nha Thương | weapon | Mộc | 11 | 0 | reach | weapons:6 |
| 6 | Liệp Yêu Đao | weapon | Kim | 8 | 0 | fast | weapons:7 |
| 7 | Tử Điện Kiếm | weapon | Lôi | 13 | 0 | fast | weapons:8 |
| 8 | Đại Hạ Long Tước | weapon | Kim | 23 | 0 | reach | divine:0 |
| 9 | Bích Ngọc Long Kiếm | weapon | Thủy | 18 | 0 | frost | divine:1 |
| 10 | Xích Kim Tiên Kiếm | weapon | Hỏa | 22 | 0 | heavy | divine:2 |
| 11 | Thanh Long Ngự Kiếm | weapon | Kim | 21 | 0 | reach | divine:3 |
| 12 | Lam Hải Thần Kiếm | weapon | Thủy | 22 | 0 | frost | divine:5 |
| 13 | Thiên Long Kiếm | weapon | Kim | 24 | 0 | reach | divine:6 |
| 14 | Huyền Ngọc Kiếm | weapon | Thổ | 20 | 0 | heavy | divine:7 |
| 15 | Cửu Thiên Long Kiếm | weapon | Lôi | 26 | 0 | fast | divine:8 |
| 16 | Huyền Thiết Kiếm | weapon | Kim | 12 | 0 | reach | gear:0 |
| 17 | Bách Thú Văn Khải | armor | Thổ | 0 | 16 | — | gear:1 |
| 18 | Phần Thiên Hỏa Kiếm | weapon | Hỏa | 24 | 0 | fire | gear:2 |
| 19 | Huyền Băng Thuẫn | armor | Thủy | 0 | 22 | — | gear:3 |
| 20 | Phượng Vũ Tiên Y | armor | Hỏa | 4 | 14 | — | gear:5 |
| 21 | Vô Phong Cự Kiếm | weapon | Thổ | 27 | 0 | heavy | gear:6 |
| 22 | Huyết Tâm Ngọc | accessory | Hỏa | 7 | 4 | blood | gear:7 |
| 23 | Lôi Đình Tế Kiếm | weapon | Lôi | 19 | 0 | fast | gear:8 |
| 24 | Thanh Vân Kiếm | weapon | Mộc | 10 | 0 | fast | weapons:1 |
| 25 | Thanh Vân đạo bào | armor | Hỏa | 0 | 5 | — | gear:5 |
| 26 | Toái Sơn Quyền Giáp | weapon | Thổ | 12 | 0 | heavy | weapons:3 |
| 27 | Huyền Thạch chiến y | armor | Thổ | 0 | 8 | — | gear:1 |
| 28 | Hàn Nguyệt Linh Trượng | weapon | Mộc | 8 | 0 | ranged | weapons:0 |
| 29 | Tử Nguyệt pháp y | armor | Thủy | 0 | 3 | — | gear:3 |
| 30 | Trúc Lang Nha Kiếm | weapon | Mộc | 18 | 0 | reach | divine:8 |
| 31 | Huyết Lang Hộ Uyển | accessory | Hỏa | 12 | 5 | blood | gear:7 |
| 32 | Hắc Độc Chu Ti | armor | Mộc | 3 | 21 | — | gear:1 |
| 33 | Băng Quân Hàn Kiếm | weapon | Thủy | 27 | 0 | frost | divine:8 |
| 34 | Xích Viêm Xà Tâm | accessory | Hỏa | 18 | 7 | fire | gear:7 |
| 35 | Thiên Phong Vũ Y | armor | Kim | 8 | 28 | fast | gear:1 |
| 36 | U Minh Hồn Ngọc | accessory | Thủy | 20 | 10 | — | gear:7 |
| 37 | Ma Vực Trấn Giáp | armor | Thổ | 7 | 38 | — | gear:1 |
| 38 | Tử Lôi Thiên Kiếm | weapon | Lôi | 42 | 0 | fast | divine:8 |
| 39 | Cổ Linh Thiên Ấn | accessory | Mộc | 24 | 14 | blood | gear:7 |
| 40 | Vô Cực Ma Kiếm | weapon | Lôi | 48 | 0 | heavy | divine:8 |
| 41 | Thanh Trúc Lang Pháp Y | armor | Mộc | 2 | 14 | — | gear:1 |
| 42 | Thanh Trúc Lang Linh Hoàn | accessory | Mộc | 8 | 3 | — | gear:7 |
| 43 | Huyết Lang Kiếm | weapon | Hỏa | 21 | 0 | blood | divine:8 |
| 44 | Huyết Lang Pháp Y | armor | Hỏa | 3 | 20 | — | gear:1 |
| 45 | Hắc Độc Kiếm | weapon | Mộc | 24 | 0 | — | divine:8 |
| 46 | Hắc Độc Linh Hoàn | accessory | Mộc | 12 | 7 | — | gear:7 |
| 47 | Bắc Minh Pháp Y | armor | Thủy | 5 | 27 | — | gear:1 |
| 48 | Bắc Minh Linh Hoàn | accessory | Thủy | 13 | 8 | — | gear:7 |
| 49 | Xích Viêm Kiếm | weapon | Hỏa | 30 | 0 | fire | divine:8 |
| 50 | Xích Viêm Pháp Y | armor | Hỏa | 5 | 31 | — | gear:1 |
| 51 | Thiên Phong Kiếm | weapon | Kim | 32 | 0 | fast | divine:8 |
| 52 | Thiên Phong Linh Hoàn | accessory | Kim | 16 | 10 | — | gear:7 |
| 53 | U Minh Kiếm | weapon | Thủy | 36 | 0 | — | divine:8 |
| 54 | U Minh Pháp Y | armor | Thủy | 7 | 37 | — | gear:1 |
| 55 | Ma Vực Kiếm | weapon | Thổ | 38 | 0 | — | divine:8 |
| 56 | Ma Vực Linh Hoàn | accessory | Thổ | 18 | 12 | — | gear:7 |
| 57 | Tử Lôi Pháp Y | armor | Lôi | 8 | 43 | — | gear:1 |
| 58 | Tử Lôi Linh Hoàn | accessory | Lôi | 19 | 13 | — | gear:7 |
| 59 | Cổ Linh Kiếm | weapon | Mộc | 21 | 0 | blood | divine:8 |
| 60 | Cổ Linh Pháp Y | armor | Mộc | 3 | 20 | — | gear:1 |
| 61 | Vô Cực Pháp Y | armor | Lôi | 7 | 40 | — | gear:1 |
| 62 | Vô Cực Linh Hoàn | accessory | Lôi | 18 | 12 | — | gear:7 |

**Yêu cầu:**
- 30 công pháp: mỗi phẩm (`pham/linh/dia/thien`) ≥5; mỗi loại (`vo_ky/than_phap/tam_phap/tuyet_ky`) ≥5; đủ 7 hệ. `reqLevel` trải 1–45 (phẩm cao → cấp cao). Khoảng 1/3 riêng phái (`cls` 0/1/2, mỗi phái ≥3), còn lại `null`.
- 20 trang bị: 8 vũ khí, 6 giáp, 6 phụ kiện; `reqLevel` trải 1–45; chỉ số tăng theo cấp, đỉnh không vượt đồ mạnh nhất đang có quá 20%. Icon dùng `sheet`/`index` có sẵn (bảng trên cho thấy ô ảnh nào là loại gì).
- Tên Hán Việt; `desc` ≤ 90 ký tự nói rõ tác dụng; `lore` ≤ 240 ký tự.
- **Tự kiểm:** JSON hợp lệ; id duy nhất, không trùng bảng trên; mọi `stat` thuộc danh sách schema §1; đúng giới hạn cân bằng; đếm đủ số lượng theo phẩm/loại/hệ/ô.

## B2 — T31 (MỚI): Spec giao diện Công pháp & Trang bị (cho Muse làm T18)

Game hiện có 2 bảng liên quan — spec phải **nâng cấp chúng**, không tạo bảng thứ ba:
- **"CÔNG PHÁP · KỸ NĂNG"** (phím **T**, `modal.kind='skill11'`, khung 80,73,1120×576): kỹ năng phái 5 ô, cộng điểm (`v11SkillPoints()`). Kỹ năng phái:

| Phái | Kỹ năng (cấp học · MP · hồi chiêu · phím) |
|---|---|
| Kiếm Tu | Vạn Kiếm Xuyên Tâm (cấp 1, 18 MP, 1.25s, phím RMB) · Liên Hoàn Kiếm (cấp 2, 24 MP, 2.5s, phím 1) · Thanh Vân Kiếm Vũ (cấp 4, 30 MP, 4.5s, phím 2) · Thiên Kiếm Lạc (cấp 7, 42 MP, 7s, phím 3) · Kiếm Tâm (cấp 3, 0 MP, 0s, phím —) |
| Thể Tu | Chấn Sơn Băng Quyền (cấp 1, 22 MP, 2.6s, phím RMB) · Thiết Sơn Hộ Thể (cấp 2, 22 MP, 6s, phím 1) · Bát Hoang Chấn (cấp 4, 30 MP, 4.3s, phím 2) · Kim Cương Trấn Địa (cấp 7, 42 MP, 7s, phím 3) · Kim Cương Thể (cấp 3, 0 MP, 0s, phím —) |
| Pháp Tu | Hàn Nguyệt Tam Tinh (cấp 1, 26 MP, 2s, phím RMB) · Hàn Băng Linh Cầu (cấp 2, 25 MP, 3s, phím 1) · Tử Lôi Pháp Ấn (cấp 4, 34 MP, 4.5s, phím 2) · Băng Hà Vạn Trượng (cấp 7, 44 MP, 7s, phím 3) · Linh Hải (cấp 3, 0 MP, 0s, phím —) |

- **"LINH BẢO • TÚI TRANG BỊ"** (phím **I**, `modal.kind='gear'`): túi tối đa 48 món, mặc theo 3 ô, cường hoá +1…+10 (giá `6 + cấp×4` linh thạch, hiện không thất bại); nút "Linh bảo" (tối đa 4 relic, 2 relic kề nhau tương sinh → +7% công, +2 thủ); nút "Nguyên liệu".
- Công pháp đang có của người chơi: mảng `p.techs` (id trong `TECH`); dung hợp 2 công pháp tương thích (phím **R**, bảng `FUSIONS`).

**Spec cần có:**
1. Tab mới **"Công pháp"** trong bảng phím T (cạnh tab kỹ năng phái): danh sách thẻ bên trái (lọc phẩm/loại/hệ), chi tiết bên phải (mô tả, lore, hiệu ứng theo bậc, cấp yêu cầu, giá); trạng thái Đã học / Học được / Chưa đủ cấp / Không hợp phái; **giới hạn ô công pháp** theo cảnh giới (ghi con số cụ thể); màu viền theo phẩm.
2. **Nguồn nhận công pháp mới** — đề xuất cụ thể, chỉ dùng thứ có sẵn (ví dụ học tại Trưởng lão bằng linh thạch `price`; một số rơi từ boss vùng). Không thêm NPC/cửa tiệm.
3. **Cường hoá có tỉ lệ thất bại** theo `upgrade` của data B1: hiện % thành công trước khi bấm, hiệu ứng thành công/thất bại, không tụt cấp.
4. Đủ khuôn spec: toạ độ trên 1280×720, kích thước, màu hex, font, thời gian ms, điều kiện, checklist. Bảng màu Design Bible; chất liệu giấy/mực ấm (T21 §5).
- **Tự kiểm:** không dùng phím đã có (T, I, R, Q, M, F2, F6, Esc, E, H, Space, 1–3, C, J, L, N, P, B, O, G, U, Y, V, Tab); chỉ thêm trường save mới có giá trị mặc định.

## B3 — T23: Spec nội thất (Immortal Life) — XÂY TRÊN HỆ CÓ SẴN

Game ĐÃ có 5 ngôi nhà vào được trong thôn (hệ V36, `v36Inside()`), mỗi nhà một chủ đề:

| id | Tên | Mô tả | Chủ đề | Màu nhấn |
|---|---|---|---|---|
| `inn` | Thanh Vân Đại Điện | Nơi trưởng lão tiếp kiến đệ tử | hall | #e9ce93 |
| `herbalist` | Bách Thảo Dược Đường | Bốc thuốc, nghiên cứu linh dược | herb | #b7dfa2 |
| `shop` | Vạn Bảo Phường | Mua bán đan dược và bảo vật | trade | #e9bd81 |
| `wanderer` | Kiếm Tu Quán | Nơi kiếm khách nghỉ chân | sword | #b8cde8 |
| `sentry` | Đông Môn Hộ Vệ Đường | Trạm nghỉ và trực ban của hộ vệ | guard | #a9d8df |

**Spec cần có:** nâng cấp nội thất 5 phòng theo phong cách Immortal Life (góc 3/4, đồ vật có bóng mềm theo T21 §4.2, ánh đèn theo T21 §3); bố cục từng phòng (toạ độ đồ vật trong khung phòng); **đồ vật tương tác** chỉ map về chức năng CÓ SẴN (ví dụ: lò luyện đan / bàn chế tạo → `v13Open` sinh hoạt-chế tạo; bàn NPC → hội thoại T15/T30; nghỉ → thôn đã tự hồi máu nhanh) — không tạo cơ chế mới; ngoại thất (mái cong, cột đỏ, đèn lồng sáng đêm theo T21). Kèm **1 ảnh concept** phòng `inn` (Thanh Vân Đại Điện) góc 3/4, khớp phong cách tranh thôn hiện tại, không chữ, PNG.
- **Tự kiểm:** không thêm phòng/NPC; mọi tương tác ghi rõ chức năng có sẵn nào; toạ độ nằm trong khung phòng.

## B4 — T30 (MỚI): Hội thoại 10 NPC còn lại

Bổ sung vào `data/dialogues.js`, giữ NGUYÊN `inn` và `shop` đã duyệt. Mỗi NPC **2 lần gặp**: lần đầu (`"when": {"talkedBefore": false}`, mọi nhánh kết thúc có `"talked": true`) và lần lặp (`"when": {"talkedBefore": true}`, không thưởng). Bám tính cách và tiểu sử; mỗi lần gặp 3–6 nút, 2–3 lựa chọn, ≥1 lựa chọn cần thiện cảm.

| id | Tên | Vai | Cảnh giới · môn phái | Tiểu sử | Gợi ý đang dùng trong game |
|---|---|---|---|---|---|
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |
| `None` | None | None | None · None | None | None |

- `effects` chỉ dùng `favor`, `talked`, `setFlag` (không phát linh thạch/đan/tu vi, không `openShop`).
- **Tự kiểm:** như T15 — JSON hợp lệ, mọi nhánh có kết thúc, chữ ≤ 140, đúng enum schema §3, id lần gặp duy nhất (`<npc>_1`, `<npc>_2`).

---

## Khuôn `BATCH_01_REPORT.md`

```
# BATCH_01 — ChatGPT
## B1 T17 — tóm tắt (đếm theo phẩm/loại/hệ/ô) · tự kiểm ĐẠT/LỖI
## B2 T31 — tóm tắt, quyết định chính (số ô công pháp, nguồn nhận, % cường hoá)
## B3 T23 — tóm tắt, ảnh concept có/không
## B4 T30 — tóm tắt (10 NPC × 2 lần gặp) · tự kiểm
## Câu hỏi mở (thiếu gì + phương án đã chọn)
## CHAT (dán vào ops/CHAT.md)
## HANDOFF (dán vào ops/HANDOFF.md)
```
