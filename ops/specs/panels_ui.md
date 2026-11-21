# T36 — Hành trang & Hồ sơ tu sĩ v1.2

21/11/2026 · B5 Gói 02 · tham chiếu ảnh `tui_do_I.png`, `nhan_vat_C.png`, T21 §5, T31 v1.2 và phụ lục Gói 01. Mục tiêu: ngôn ngữ Wandering Sword ấm, gọn, có chiều sâu chất liệu thay khung xanh đen web app; **không thay chức năng**. Spec này ưu tiên bố cục I 24 ô/trang đúng V47 hiện tại, thay layout I 48 ô cùng lúc của T31; giữ hợp đồng học/nâng, slot, bonus, save, xác suất và tab T của T31, không thêm modal thứ ba. Claude xác nhận hợp nhất trước T18/T36.

## 1. Vật liệu chung

1280×720 tọa độ logic, lề an toàn 24. Khung I/C (24,24,1232,672), dùng `ornament()/box()` gốc, nền ink #100b13 .92, viền gold #e3b96f .68 1px + đường trong cách 5px alpha .22, nền vùng con ink pha paper #f1e4cf .045. Nền giấy/lụa: vân giấy paper .04, sợi ngang nhẹ .025, dải gỗ sơn mài ink + red #f18474 .07 ở cạnh 8px (không đỏ đặc), gờ gold .30. Vùng số dùng nền ink .5, chữ paper, tốt jade #a8d6c5, giảm red, phụ muted #b5a18b. Tạo texture/cache 1 lần mỗi DPI/scale; không tint theo ngày/đêm. T21 light/world pass trước panel; không bloom trên chữ. Khung/nhãn trên nền tối; không dùng paper sáng chói toàn modal.

V18Serif 28 title, 20 tên nhân vật/món, 16 tiêu đề vùng; V45Sans 14 thân, 16 số, tối thiểu 12 chú thích. Không ellipsis nút dài; dùng đo chữ thật rồi wrap hoặc hạ tới 12px. Hover 100ms nền gold .10 + viền .65, chọn viền 2px và nền .14, đang mặc nhãn jade, khóa ink .45 + muted + lý do (không chỉ màu); nhấn 80ms, tab fade 140ms, modal fade vào 180ms/ra 120ms (alpha, giữ vị trí), khóa hitbox khi đóng. Tooltip hover 300ms, ra 100ms, pointer qua tooltip không kích hoạt world. Một panel/modal hiện; click, cuộn, phím đóng theo handler cũ. Không thay pause/combat gate.

## 2. Hành trang I (gear)

Ảnh thật có 2/48, 3 ô mặc, 24 ô/trang, Bộ trang bị/Pháp bảo/Nguyên liệu, Giám định, Tự nhặt. Giữ từng đường tương tác (I/G đóng theo footer ảnh, Esc nếu handler hiện hữu). Nút/phím cũ giữ tên, nếu handler runtime khác ảnh ưu tiên code và ghi review. Không đổi dữ liệu.

| Khối | Rect x,y,w,h | Nội dung |
|---|---|---|
| Tiêu đề | 42,36,652,30 | LINH BẢO · HÀNH TRANG, V18Serif 28 |
| Phụ đề | 42,70,650,19 | Trang bị · Giám định · So sánh · Luyện khí |
| Ba tab | 712,44,168,40 / 888,44,168,40 / 1064,44,172,40 | Bộ trang bị, Pháp bảo · số, Nguyên liệu |
| Cột Trang bị | 34,110,280,532 | 3 ô thực và portrait |
| Cột Túi | 324,110,516,532 | lọc/lưới/phân trang |
| Cột Giám định | 850,110,396,532 | Chi tiết, so sánh, hành động |
| Footer | 34,650,1212,36 | tiền/đan, tự nhặt, phím đóng |

### 2.1 Nhân vật và đồ đang mặc

Nhãn (48,120,252,20) Trang bị + realm bên phải. Portrait (48,154,252,146), dùng sprite/ảnh nhân vật thật, không thêm ảnh mới; trong nền tranh thủy mặc mờ từ asset hiện có, clip rect, paper .07 + ink, vòng vàng alpha .25 đặt dưới chân, không chữ đè mặt. Nhân vật giữ đúng phái, căn thân giữa x174, chân y294; nếu không có full body dùng portrait sẵn, không kéo méo. Tên (48,304,252,26), phái/cấp (48,332,252,18). CL (48,356,252,40) ngọc/dải gỗ, số 24 gold từ v10FightPower(currentStats()).

Ba dòng Vũ khí, Y phục, Linh sức ở (48,404+i×58,252,52), i0..2; icon 40×40 x54/y+6, tên x100,y+23,w194,h20; ô trống ghi “Linh sức · Chưa trang bị” trong (100,y+10,194,32), wrap 2 dòng 14px, không dấu ba chấm, số +n nhỏ góc. Dòng Công/Thủ (48,584,252,20), HP/MP (48,610,252,20), dùng currentStats và p.hp/mp. Click ô đã mặc chọn đúng instance và chi tiết; ô rỗng chỉ lọc slot nếu hành vi cũ có, không chế swap mới.

### 2.2 Túi, lọc và phân trang

Nhãn (338,120,488,18), count thật bag/48 (không đổi số). 4 filter loại (338+i×122,148,116,30), i0..3: Tất cả / Vũ khí / Y phục / Linh sức; 3 filter hàng hai (338,184,160,30)/(504,184,158,30)/(668,184,158,30) “Mọi phẩm chất”, “Tất cả” (giữ chính xác ý nghĩa filter thứ hai hiện có), “Lưới 24 ô” (giữ toggle mode nếu có; không phát minh mode). Mỗi dropdown đúng lựa chọn runtime, max 6 dòng 30px, mở dưới hoặc lên trên trong cột; input chặn list, đóng click ngoài, không click xuyên.

**Lưới 6 cột ×4 hàng:** x338+c×82, y230+r×82, w76,h76 (c0..5,r0..3), icon 48×48 giữa x+14,y+8; tên phẩm không cắt ở tooltip, +n góc (x+48,y+3,24,16), đang mặc label (x+3,y+59,70,14) 12px. Viền `QUALITY_COL` giá trị thật theo phẩm runtime (không đặt hex mới, đây là màu đã có; nếu thiếu key dùng muted). Chọn gold 2px viền ngoài, phẩm vẫn viền trong 1px, khóa phủ ink, trống dấu + muted alpha .35 không phải nút mua. Cache icon từ sheet sẵn, không dùng asset fallback giả. Filter và sort không mutate mảng save; chỉ chọn danh sách index/instance thật. Khi đổi filter/sort, về trang hợp lệ đầu nếu trang hiện vượt; giữ selection nếu còn trong kết quả, nếu mất thì clear. Phân trang 24 mục (2 trang khi 48, có thể 1 nếu lọc). Nút trước (338,568,46,34), nhãn (390,568,100,34), sau (496,568,46,34), “Sắp: …” (550,568,276,34), hoặc dropdown lựa chọn gốc; disabled ở trang biên. Dòng gợi ý (338,610,488,22) số vật phẩm phù hợp + click chọn/bỏ chọn. Cuộn chỉ ở list/filter/tooltip, không cuộn world. Mục “Lưới 24 ô” không đổi 48 capacity.

### 2.3 Giám định và so sánh

Nhãn (864,120,368,22) Giám định. Khi không chọn: dùng ấn Thái Cực sẵn 136×136 tại (980,222), chữ “Chọn linh bảo” ở (864,380,368,32), hướng dẫn 2 dòng (864,424,368,42); không tạo action giả. Khi chọn:

| Khối | Rect | Nội dung |
|---|---|---|
| Icon/tên | 864,150,72,72 / 948,150,284,44 | V18Serif 20, tên dài 2 dòng |
| Phẩm/loại/+n | 948,200,284,22 | QUALITY_COL, slot, reqLevel nếu có data |
| Chỉ số + đối chiếu | 864,234,368,116 | công/thủ và chỉ số thực, so với đúng món cùng slot, hàng 24px |
| Desc/lore | 864,356,368,80 | 14px wrap, scroll riêng nếu vượt, lore từ DATA.lore.equipment[index] hoặc DATA.equipment mới |
| Hành động | 864,444,368,36 | nút mặc/tháo/giám định theo hành vi cũ, nút thật chia đều, không thêm chức năng |
| Cường hóa | 864,486,368,144 | +n, giá, xác suất, nút 864,586,368,36 (khi T18 tích hợp); các action thật khác giữ theo handler |

So sánh: hiển thị 2 cột số cũ/mới và Δ, tốt ↑ jade #a8d6c5, giảm ↓ red #f18474, bằng — muted (đảo dấu tốt/xấu nếu chỉ số giảm là có lợi theo runtime; không tự giả loại stat). Không chỉ màu. Món chưa mặc: so đúng slot; slot trống dùng baseline thật, ghi “Chưa trang bị”; đang mặc ghi hiện tại, không tự so với chính nó. Nếu không tính được hiệu ứng style/set/relic, ghi “Chỉ số cơ bản; xem hiệu lực thật ở C”, không giả DPS. Tooltip hover w300,h180, thử 3 vị trí theo thứ tự: (x+80,y), (x−304,y), (x,y−184); clamp x24..956, y24..516. Loại ứng viên giao rect ô đang hover, nút hành động hiện hữu hoặc footer; nếu không có vị trí an toàn, không hiện hover, dùng chi tiết khi click. Tooltip chỉ xem nhanh, không có hitbox, không chặn nút; click mới lock chi tiết. Khi chọn nhiều lần, cùng ID theo index/instance, không nhầm đồ đổi trang. Không show vượt mức +10, giá/rate/commit theo T31/phụ lục, thất bại giữ cấp. Giám định thật, bán/tháo/các chức năng ở code giữ nguyên, nút chỉ hiện đúng điều kiện, không thêm giá.

### 2.4 Bộ trang bị, Pháp bảo, Nguyên liệu và footer

Bộ trang bị giữ renderer và hành vi nút/tab thật (nếu runtime là mở overlay thì chuyển panel theo đúng handler, không tự đổi thành tab): hiển thị bộ đang sở hữu/đang mặc, 2/3 món và hiệu ứng gốc V29_SETS; không coi món mới BATCH01 thuộc bộ nếu chưa có dữ liệu. Trong vùng giữa (338,148,488,408) list cuộn; cột phải chi tiết bộ (864,150,368,480), giữ action gốc. Pháp bảo: 4 slot relic thật đặt (338+i×118,154,110,80), i0..3; list (338,248,488,308); chi tiết phải như trên, dùng RELICS/DATA.lore.relics, T31 synergy/điều kiện gốc, không đổi số ô. Nguyên liệu: vùng (338,148,488,408), lưới hoặc danh sách theo renderer thật, số vật phẩm V13_ITEMS, không thêm chế tạo trong I. Nếu tab chưa có chi tiết ảnh, Muse liệt kê toàn bộ nút/handler thật rồi chuyển vị trí vào vùng, không bỏ nút để ép layout. Footer tài nguyên (42,657,476,22) lấy p.stones/p.pills; “Tự nhặt BẬT/TẮT” (534,655,180,26) giữ toggle thật, khi hover ghi trạng thái, không tự bật; nghe phím/hướng dẫn (734,657,504,22) căn phải, I/G đúng ảnh, click chọn/bỏ chọn.

## 3. Hồ sơ C (Đạo thể)

| Khối | Rect | Nội dung |
|---|---|---|
| Tiêu đề | 42,36,850,34 | ĐẠO THỂ · HỒ SƠ TU SĨ, phụ đề ở y72 |
| Đạo thể trái | 34,110,280,532 | portrait, tên, cảnh giới, phái, CL, XP, kill |
| Thuộc tính giữa | 326,110,444,532 | 6 hàng + điểm còn lại + hoàn lại |
| Chi tiết phải | 782,110,464,532 | Chiến đấu/Tu luyện/Trang bị |
| Footer | 34,650,1212,36 | Công pháp · T, Tông môn · N, C/Esc |

Đạo thể: nhãn cấp (48,120,252,22); portrait (48,154,252,230) như I, chân y374, nền thủy mặc/họa tiết vàng; tên (48,388,252,30), cảnh giới (48,424,252,22), phái (48,450,252,20); CL (48,478,252,60) số 30, nhãn 12; tu vi (54,552,240,22), bar (54,578,240,10) jade, tỷ lệ p.xp/xpNeed clamp, max cấp theo logic thật; “Đã hạ N yêu thú” (48,602,252,22) lấy biến thống kê runtime, không đoán tên biến.

Thuộc tính: heading (340,120,416,22) điểm còn lại bên phải. 6 hàng rect (340,154+i×66,416,58), i0..5. Nhãn tắt/icon (348,y+17,34,24), tên (394,y+5,196,20) V45Sans 15; diễn giải (394,y+26,196,30) wrap 2 dòng 12, số điểm (594,y+12,30,32), nút −/(+1)/(+5) (628,y+15,34,30)/(668,y+15,36,30)/(710,y+15,36,30). Nút disabled khi không đủ điểm/theo luật cũ, +5 đúng handler thực (không tự suy nếu thiếu 5), − và Hoàn lại theo điều kiện gốc. Điểm cập nhật ngay, flash gold 180ms, không mutate nếu khóa. Dòng 6 điểm khởi đầu/+3 mỗi cấp theo ảnh chỉ nếu runtime xác nhận; (340,554,416,22). Hoàn lại điểm (340,586,416,40), giữ xác nhận/chi phí thật; không đổi luật.

| Hàng | Tên | Mô tả từ ảnh hiện tại (giữ dữ liệu thực) |
|---|---|---|
| 0 | Căn cốt (CC) | +12 sinh mệnh · +2 phòng ngự |
| 1 | Lực đạo (LĐ) | +3 công kích |
| 2 | Linh thức (LT) | +6 linh lực · +0,5 hồi/giây · +2% pháp lực |
| 3 | Thân pháp (TP) | +3 tốc độ · +1% tốc đánh · −0,015s hồi lướt |
| 4 | Ngộ tính (NT) | +3% tu vi nhận · +1% cơ hội đột phá |
| 5 | Khí vận (KV) | +1% chí mạng · +0,5% cơ hội linh thạch |

Không ghi các hệ số này vào save/code từ spec; xác minh label hiện hữu và giữ runtime nếu đã chỉnh. Dòng Linh thức/Thân pháp phải wrap tối đa hai dòng 15px trong 196×30, nếu cần tooltip chi tiết 260×92 xuất hiện sau 300ms, không cắt mất ý. Số điểm 0–N, không dùng màu riêng ngoài C; icon có chữ CC/LĐ/LT/TP/NT/KV.

Chi tiết phải: tab (794+i×146,122,138,38), i0..2 Chiến đấu/Tu luyện/Trang bị. Chiến đấu 13 hàng (794,174+i×31,440,30); nhãn x802 w300, số x1110 w116 căn phải; tên dài “Sát thương kỹ năng cơ sở” 14px nằm riêng, không cắt. Các nhãn đúng ảnh: Sinh mệnh, Linh lực, Công kích, Phòng ngự, Giảm sát thương, Sát thương kỹ năng cơ sở, Tỷ lệ chí mạng, Sát thương chí mạng, Tốc đánh (hệ số), Di chuyển, Tầm đòn cơ bản, Hồi linh mỗi giây, Hồi khinh công. Giá trị từ currentStats và derivation runtime, không thêm công thức; đơn vị %, ×, px/s, px, giây giữ như ảnh. Footer phụ (802,610,424,20) “Chỉ số hiện tại, chưa trừ phòng ngự đối phương.” Tu luyện và Trang bị giữ đủ dòng thực, cùng hàng 31px, scroll vùng (794,174,440,428) nếu >13; không tự thêm stat hoặc action. Nút footer Công pháp · T (34,651,284,34), Tông môn · N (328,651,284,34); chuyển panel đúng handler, C/Esc đóng (right aligned 900,651,338,34). Không mở chồng panel T/N.

## 4. Phát triển trải nghiệm quản lý đồ và thuộc tính

### 4.1. Trạng thái I khi người chơi thu thập, thay đồ, cường hóa

Mỗi trạng thái là biến thể của các khối §2, không thêm nút, luật túi hoặc hotkey. Mọi số trước/sau đọc lại từ instance thật sau handler, không đổi trước khi giao dịch thành công.

| Tình huống | Trình bày ngay trong bố cục hiện có | Điều kiện |
|---|---|---|
| Túi rỗng | Khối (338,378,488,54): “Chưa có trang bị” / “Vật phẩm nhặt được sẽ hiện trong hành trang.” 16/13px muted | Bag thật bằng 0, lưới trống vẫn nhìn thấy |
| Lọc không khớp | Cùng vị trí: “Không có vật phẩm phù hợp” / “Hãy chọn bộ lọc khác.” | Bag >0, kết quả lọc bằng 0; không báo túi trống |
| Túi đầy | Thay nhãn count (338,120,488,18) bằng “48/48 · Hành trang đã đầy”, red #f18474, icon ! | Chỉ khi đúng capacity thực; không tự bán/hủy vật phẩm |
| Đang mặc | Dấu jade #a8d6c5 + chữ “Đang mặc” ở slot và ô; không hiện so với chính nó | Cùng instance, không so sánh chỉ theo EQUIPMENT index |
| Chưa đủ cấp/điều kiện | Giữ nút gốc disabled; trong vùng (864,404,368,30) hiển thị lý do thật 12–14px red/muted | Chỉ có dữ liệu điều kiện thực; không đoán reqLevel |
| Cường hóa chờ xử lý | Vẫn hiển thị +n và giá đã xác nhận từ handler; nút (864,586,368,36) khóa nhấp kép | Sau click hợp lệ tới khi kết quả thật |
| Cường hóa thành công | Viền 2px gold flash 220ms, +n đổi sau commit, số tài nguyên đọc lại | T18 handler thành công |
| Cường hóa thất bại | Viền red flash 220ms, giữ +n, cập nhật giá/linh thạch thật, dòng kết quả trong (864,550,368,30) | T18 handler thất bại, không giả kết quả trước RNG |

**Luồng so sánh**: click món → xác thực instance/slot → đọc món đang mặc → render chỉ số trực tiếp của đồ từ dữ liệu → nếu game có preview currentStats không mutate, mới cho thấy thay đổi nhân vật → click action thật → xác thực lại instance và điều kiện → commit → đọc lại bag/slot/CL. Tách rõ “Món hiện tại” / “Món đang xem” / “Chênh lệch”; 3 cột tại (864,234,368,116) chia 138/110/120 px. Trường tăng tốt dùng ↑, giảm dùng ↓ kèm số dấu; không chỉ dùng màu. Nếu không có preview hợp lệ, chỉ so chỉ số cơ bản của món và ghi “Hiệu ứng bộ/pháp bảo xem ở C”. Không hứa CL dự đoán, không cộng trùng perk.

Thứ tự hitbox: dropdown đang mở > xác nhận/modal hiện hữu > hành động cột phải > lưới/slot > nền. Passive tooltip không bắt pointer và không che nút. Sau thao tác phát sinh thay đổi inventory, kiểm selection theo instance ngay; nếu đã bán/tháo/mất instance, xóa selection, không chuyển sang item trùng index bất kỳ. Nếu không có handler bán/khóa, không vẽ nút mới. Tooltip lore lấy index 0–62 từ DATA.lore, 63–82 từ DATA.equipment đã append; nếu không có text, bỏ hàng lore thay vì chọn nhầm mục.

### 4.2. C — giải thích chỉ số và hỗ trợ phân bổ

Người chơi mới cần biết vì sao một điểm thuộc tính có ích. Không thêm preset hoặc tự cộng điểm; giữ bảng 6 hàng hiện tại, dùng mô tả F12/ảnh thực §3. Khi hover biểu tượng CC/LĐ/LT/TP/NT/KV sau 300ms, nhãn tooltip 260×92 dùng màu paper, viền gold .45, body 13px. Đặt ưu tiên cạnh phải hàng nếu còn chỗ, clamp vào vùng panel và không che nút +1/+5/−; nếu vướng, hiển thị 2 dòng hiện có trong hàng và không mở tooltip.

| Phái | Gợi ý xây dựng trong trang tạo nhân vật/miêu tả, không phải preset |
|---|---|
| Kiếm Tu | Đòn nhanh, chí mạng; xem Lực đạo, Thân pháp, Khí vận trước khi phân điểm. |
| Thể Tu | Cận chiến bền bỉ; cân nhắc Căn cốt và Lực đạo theo chỉ số hiện tại. |
| Pháp Tu | Đánh xa, dùng pháp thuật; xem Linh thức và khả năng giữ khoảng cách. |

Nếu điểm bằng 0, giữ 6 thuộc tính, chỉ disable hành động theo luật thật; không hiện “mua điểm”. Nếu cộng một điểm, dòng số mới từ currentStats fade 180ms rất nhẹ, chưa có preview thì không vẽ chênh lệch giả. Nếu người chơi chọn Hoàn lại điểm, dùng xác nhận/giá/runtime gốc; không thêm chi phí, không khóa trường phái. Dòng trợ giúp phụ ở (802,610,424,20) đổi giữa “Xem chỉ số hiện tại” và hướng dẫn gốc của tab; không thay label 13 hàng. Khi từ C sang T/N, đóng C trước, giữ vị trí/điểm thật, tránh hai modal cùng vẽ.

## 5. Hợp đồng dữ liệu và không làm

p.v8Name, p.level, p.cls, realm(), p.xp/xpNeed(), p.hp/mp, currentStats(), v10FightPower(currentStats()), p.stones/p.pills; EQUIPMENT index 0–62 không đổi, BATCH01 63–82 append theo T14; QUALITY_COL, RELICS, V29_SETS, V13_ITEMS, filter/sort/page/autoLoot, attribute/points/refund và instance save lấy trường thực sau T03. Không tạo field mới, không đổi công thức/stat, tooltip tính phi runtime, giới hạn túi/slot, giá/sort/cường hóa/quy tắc loot. T36 chỉ đổi presentation. Nếu module T18 chưa sẵn dùng chức năng gốc, không vẽ nút nâng giả.

## 6. Checklist nghiệm thu

- [ ] I 6×4 ô đúng 24/trang, 48 tổng, 3 slot, filter/sort/pagination, Bộ trang bị, Pháp bảo, Nguyên liệu, Giám định, Tự nhặt và mọi action cũ còn đủ; I/G/Esc theo gốc.
- [ ] C 6 thuộc tính, −/+1/+5, điểm còn lại, Hoàn lại, 3 tab, nút T/N, C/Esc; điểm và stat không đổi khi chỉ xem.
- [ ] “Linh sức · Chưa trang bị”, “Sát thương kỹ năng cơ sở” không cắt; chạy font thật 1280×720, 1366×768, 1920×1080 DPR≤2.
- [ ] Đồ viền QUALITY_COL, chọn/khóa/đang mặc dễ phân biệt; so sánh có mũi tên/số, tooltip không che action, không đổi instance khi lọc/sort/chuyển trang.
- [ ] UI vẫn đọc tốt trên nền sáng/tối; ấm giấy/lụa/gỗ, title serif, không tint T21/khung HUD chồng, 60fps mục tiêu. Save và gameplay không thay, test mở đóng, click kép, hết chỗ, đủ/thiếu điểm.
- [ ] Test túi trống/đầy/lọc rỗng, hai instance cùng index, không đủ cấp, trang cuối hụt sau giao dịch, item đã mất; không xuất hiện action giả.
- [ ] Xem lore đúng index gốc hoặc đồ nối thêm; so sánh không đoán CL; +1/+5/− và hoàn điểm dùng chỉ số/điều kiện thật, không cộng sẵn theo phái.
