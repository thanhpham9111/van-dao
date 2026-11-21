# T50 — Thiên Công Phường (P), v2.0

B4 · 21/11/2026 · REVIEW · phim_P.png, G1/G3, F9/F10, T31/T36.

## Mục tiêu
Xưởng luyện khí: món đồ trên đe, lửa lò nhỏ và dãy ấn triện +1…+20. UI v30forge là nơi cường hoá duy nhất, bỏ khối nâng +10 trong I/T31/T36. Giữ 5 tab và mọi hành động/giá/roll/code thật.

## Thành phần chung
Rect logic 1280×720. T36 ornament()/box() (24,24,1232,672), ink #100b13 .92, vân paper #f1e4cf .04, gỗ ink+red #f18474 .07, gold #e3b96f .68, jade #a8d6c5, muted #b5a18b, chữ paper. V18Serif 28 title/20 tên/16 mục; V45Sans 14 thân/16 số/12 tối thiểu. Hover 100ms gold .10, chọn gold 2px .14, khóa ink .45 + chữ, thiếu red có số; nhấn 80ms, tab fade 140ms, mở/đóng 180/120ms, tooltip 300/100ms. Scroll/tab/nút T36, không tint T21. 

| Khối | Rect | Nội dung |
|---|---|---|
| Title/phụ đề | 42,36,884,34 / 42,72,884,20 | THIÊN CÔNG PHƯỜNG · Lò luyện khí · vùng thật |
| Đi Hành trang | 966,42,230,38 | Hành trang · I |
| 6 tài nguyên | 38+i×202,100,194,44 | Linh thạch, huyền thiết, linh tinh, tinh phách, linh thảo, linh mộc |
| 5 tab | 38+i×242,154,234,40 | Cường hoá · Tinh luyện · Khảm linh thạch · Tiến hoá / Thức tỉnh · Pháp bảo |
| Chọn món | 38,206,330,426 | filter/list/page |
| Chi tiết | 380,206,862,426 | tùy tab |
| Footer | 38,646,1204,38 | Nguồn nguyên liệu, Rời lò luyện · Esc (1010,646,232,38) |

Tài nguyên dùng ô T48/T36, tên 12px, số bên phải 16px; tab dài nhất “Tiến hoá / Thức tỉnh” wrap nếu cần, không cắt. Chuyển I đóng P trước; bảo toàn chọn instance thật khi sang P. Phím/điều kiện vào xưởng giữ nguyên handler.

## 1. Cường hoá
Trái: heading (50,218,304,22) kèm count n/tổng; filter Tất cả/Đang mặc/Có đề nghị (50+i×102,246,96,30); sort (50,282,304,30) “Thứ tự túi đồ” và các giá trị thật; list (50,320,304,254) 5 hàng 48px cách 3px, icon 40, tên 14 + phẩm/đang mặc/khảm 12; pagination (50,586,304,34) nút trước/sau 72×34, count giữa. Giữ số/trang thật; clip và scroll khi renderer có, không đổi thứ tự túi. Khi rỗng/không khớp ghi lý do, không tự chọn instance khác sau mutation.

Hero sản phẩm (392,218,838,94): đe đồng vẽ cache ink/gold .18 trong rect (400,224,126,82), icon thật 72×72 giữa x427,y225, tên (538,226,490,30), phẩm/slot/Phàm khí (538,258,490,20), tinh luyện · khảm (538,282,490,20), ĐANG MẶC (1050,226,168,24) nếu đúng instance. Lửa 2 nét red/gold alpha .08 chỉ trang trí cạnh đe, chu kỳ 1600ms, tắt khi tiết kiệm/chuyển tab. Không thay icon bằng ảnh ngẫu nhiên.

| Khối | Rect | Nội dung |
|---|---|---|
| Hành trình | 398,320,500,102 | nhãn +n/+20, 20 ấn hai hàng |
| Tỉ lệ | 910,320,308,76 | xác suất thật %, bảo hiểm thật |
| Chỉ số dự kiến | 398,430,500,124 | stat và CL nếu preview gốc |
| Nguyên liệu | 910,404,308,146 | có/cần, thiếu |
| Giải thích | 398,562,500,56 | +12% mỗi cấp, giữ cấp khi thất bại |
| Action | 910,566,308,52 | Cường hoá +n kế / Thiếu / Đã +20 |

Ấn cấp k=1..20: (398+50×((k−1)%10),348+34×floor((k−1)/10),46,30). Đã đạt jade, cấp kế gold 2px, tương lai muted; chỉ là chỉ báo, không click bỏ qua cấp. Cap 20: tất cả đạt, action khóa; xác suất/giá kế ẩn, ghi “Đã viên mãn +20”. 
Tỉ lệ hình hương/đồng hồ: bar (922,353,96,10) nền ink, fill gold tỉ lệ thật 0..1, số lớn (1026,331,180,32) 26px; nhãn bảo hiểm (922,374,284,18) đọc đúng điểm phần trăm runtime. Từ T31 ≥70% jade, 50–69% gold, <50% red; luôn có số %. Không tạo RNG từ hương, không dùng giá/rate hay DATA.equipment.upgrade +10. Giữ luật G3 +12% hệ số chỉ số gốc/cấp, thất bại không tụt, +12 điểm % cơ hội lần sau; đọc cap/làm tròn/bảo hiểm reset/giá và nguyên liệu từ handler hiện hành. Không giả định bảo hiểm theo món hay toàn cục khi chưa đối chiếu.
Preview thẻ stat (398+c×164,458,158,94) tối đa 3 cột, số thay đổi 20px, cũ→mới 13px. Nếu nhiều hơn 3, cuộn ngang trong rect; không cộng set/style trùng; CL dự kiến chỉ từ preview runtime không mutate. Chữ “Kết quả áp dụng ngay cho chỉ số hiện tại” chỉ khi đúng instance đang mặc. Danh sách nguyên liệu hàng 30px clip nếu >4, đang có/cần căn phải; đủ ✓ jade, thiếu đỏ + Thiếu N.
Thành công: flash gold 300ms + chữ jade “Cường hoá thành công · +N” 1800ms vào vùng giải thích, đổi cấp chỉ sau commit. Thất bại: flash red 200ms + “Cường hoá thất bại · Giữ +N” 1800ms; cập nhật bảo hiểm/giá/số dư thật; không rung màn. Giữ lock 450ms T31 (UI debounce, không sửa cooldown gameplay); kiểm lại instance, mức, chi phí tại handler, một click một roll/trừ/save; chỉ hiện kết quả thật. Không thêm phí, pity, xác nhận hoặc hiệu ứng khi click khóa.

## 2. Tinh luyện · 3. Khảm linh thạch · 4. Tiến hoá/Thức tỉnh
Giữ cột trái/hero nếu renderer có chọn trang bị; phần dưới (398,320,500,238) hiện preview, danh sách hành động và/nguyên liệu, cột phải (910,320,308,238) điều kiện/chi phí/tỉ lệ thật; nút chính (910,566,308,52), dòng mô tả (398,566,500,52). 
- Tinh luyện: số tinh luyện hiện tại/kế, chỉ số thật, chi phí và nút gốc; không gộp chung +20.
- Khảm: số ô khảm thật theo món, slot hình ấn 56×56 cách 10px trong preview; nếu nhiều thì wrap, hiển thị viên đã khảm, danh sách đá thật 5 loại ở (398,398,500,160) hàng 30px hoặc cuộn. G3 Hỏa +9 attack, Thanh +48 hp, Hàn +12 def, Lôi +0.035 crit (3,5 điểm %), Nguyệt +2.2 regen; đọc V30_GEMS, không đổi hệ/chỉ số/ô hoặc thêm tháo/đập đá nếu không có. 
- Tiến hoá/Thức tỉnh: status phẩm/cấp/điều kiện, xem trước nếu handler có; chỉ hiện nút tương ứng đang tồn tại, nếu có hai nút chia rect thành 2 hàng 24px. Không áp tỷ lệ cường hoá vào tinh luyện/khảm/thức tỉnh. Thiếu ảnh tab: giữ toàn bộ handler gốc; Claude kiểm danh sách cụ thể trước triển khai.

## 5. Pháp bảo
Không cần chọn trang bị: dùng cột trái danh sách 4 recipe (50,244+i×82,304,76), heading (50,218,304,22). Cột phải hero và nguyên liệu; tên dài wrap, effect 14–16, condition cấp; nút luyện gốc. Dùng V30_RECIPES với 4 id F9, không đổi recipe.
| Tên · ID | Cấp | Hiệu ứng | Nguyên liệu · linh thạch · tinh hoa |
|---|---:|---|---|
| Tam Sinh Liên Đài · v30_lotus | 10 | Mộc · +90 sinh lực, +12 phòng ngự | herb 6, wood 4, crystal 3 · 70 · 1 |
| Thái Hư Kiếm Ấn · v30_sword | 19 | Kim · +20% công, +5% chí mạng | ore 8, crystal 5 · 120 · 2 |
| Huyền Thiên Chung · v30_bell | 28 | Thổ · +35 phòng ngự, +120 sinh lực | ore 10, wood 5, crystal 6 · 180 · 3 |
| Cửu Tiêu Lôi Kính · v30_mirror | 37 | Lôi · +22% tốc đánh, +18% công | ore 12, crystal 9 · 260 · 5 |
Hiển thị nguyên liệu tới 5 hàng (910,404,308,150); phân biệt Tinh hoa công thức và Tinh phách thanh trên, lấy nhãn/tài nguyên thực sau Claude đối chiếu, không tự coi cùng key. Đã sở hữu/khóa/cấp/thiếu/đủ → hiển thị theo luật gốc, không chế bản sao hay thay giới hạn 4 relic.

## Dữ liệu và không làm
EQUIPMENT 0–62 giữ index, DATA.equipment.items 63–82 append một lần theo T14/T17, style thật đọc từ data (nếu không có thì bỏ), phẩm QUALITY_COL, V29_SETS nhóm theo id/món thực. Dòng style/set (1050,254,168,44) wrap 12px hai–ba dòng, ví dụ “Thế: Nhanh” và “Bộ: Thiên Phong 2/3”; label Việt theo style runtime; nếu dài hơn, dùng tooltip 300ms tại hero, hiển thị nguyên tên. Không gán bộ giả cho 20 món mới. Preview 2/3 chỉ theo số đang mặc và code. Tên/style/set ở hero/tooltip đầy đủ, không thay stat. p.stones, p.level, RELICS, V30_RECIPES, V30_GEMS, V13_ITEMS, instance/roll/giá/tinh luyện/khảm/save từ handler thật; không đoán tên biến. Không làm code, không đổi luật/chỉ số, không dùng khối upgrade T17 đã bỏ.

## V2 — Hình ảnh sản phẩm và quyền sở hữu giao dịch
Mẫu `img/batch03_v2_P.png`: vùng hero nền gỗ đồng tối, đe 126×82, tên serif 23, trạng thái đang mặc jade. 20 ấn chỉ báo, không có affordance nút click; nét tương lai .22, mức kế gold 2px. Chỉ một CTA tiến mức, thiếu 1 linh thạch hiện ở hàng và nút, vẫn đủ tương phản. Viền gold trên tỷ lệ, đường phân cách nguyên liệu; không trang trí lấp số. Giữ source icon/chất lượng, không dùng crop mẫu làm asset thật.
V47.1 `v42fEnhance` → `v30UpgradeCost`/`v30UpgradeChance`/`v42fPreview`/`upgradeGear(index)`; `v42fAction` kiểm v30ForgeAllowed, v42fItemReady. Pity theo instance `it.v30.pity` (+12 điểm %, cap 100). Phí đầu 6 đá, tiếp theo lấy handler, không hardcode phí. Mẫu +0 với 5/6 đá là trạng thái không thể giao dịch; 100% không đồng nghĩa đủ nguyên liệu. Nếu món đổi trang/xóa/đổi slot giữa chọn và commit, lấy lại index theo đúng instance, không thực thi index cũ.
Tinh luyện giữ hai pha `v30RollRef` (giá/đề nghị một lần) và `v30AcceptRef(it,yes)` (giữ mới/cũ, xóa offer); không gộp với cường hóa. Khảm giữ `v30SocketMax` theo phẩm, mở ô/khảm/chế đá đúng handler; không khảm tiếp vào ô đã có đá. Preview stat từ bản sao `v42fPreview`, không mutate. Khi pending offer, mở/đóng đọc offer thật, không reroll/trả phí. Test +0 đủ/thiếu, +5/+10/+15 đổi tỷ lệ/chi phí, +19/+20 giới hạn, pity riêng item, click xem ấn không tốn tài nguyên, I→P→I, đủ/thiếu và save sau kết quả thật.

## Checklist
- [ ] 6 tài nguyên, 5 tab, I/Esc, filter/sort/page và 20 ấn đúng.
- [ ] +0→+1, +19→+20, +20 khóa; đủ/thiếu, thành công/thất bại, bảo hiểm thật; không trừ hai lần.
- [ ] 5 đá/4 recipe/chi phí đúng G3; tab còn lại đủ action gốc, không thêm hệ.
- [ ] Đồ mới 63–82, style, set, instance, CL chỉ số đúng, I không còn action +10.
- [ ] T36 hover/clip/scroll, không cắt nhãn, không đổi tiền khi chỉ xem, 1280–1920.
