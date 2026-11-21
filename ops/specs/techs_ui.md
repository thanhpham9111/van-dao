# T31 — Công pháp & trang bị v1.2

Ngày 21/11/2026 · B2 Gói 01 · Phụ thuộc T14, T17 · Cho T18 (Muse).

## 1. Mục tiêu

Nâng cấp đúng hai modal hiện hữu: T `skill11` và I `gear`. Người chơi thấy rõ điều kiện học, hiệu ứng thực tế, ô đang dùng, trang bị và rủi ro cường hoá. Giữ nguyên kỹ năng phái, dung hợp R, linh bảo, nguyên liệu, túi và chỉ số đồ cũ. Các số thiết kế dưới đây là logical pixel 1280×720, không nhân DPR. Claude đối chiếu code thật trước khi DONE.

## 2. Thành phần chung

Khung T giữ nguyên (80,73,1120,576); khung I đề xuất cùng rect để đồng bộ. Dùng `ornament()/box()` đang có, nền ink #100b13 alpha .92, viền gold #e3b96f alpha .55 1px, bo theo helper hiện có; inset 12px. Vân giấy cổ paper #f1e4cf alpha .035, cache tĩnh; không tint UI theo giờ (T21 §5). Mỗi tọa độ dưới dạng x,y,w,h tuyệt đối. Tiêu đề V18Serif 24px đậm, thân V45Sans 14px, số 16px, phụ 12px, chữ chính paper, phụ muted #b5a18b, tốt jade #a8d6c5, cảnh báo red #f18474. Không dùng màu mới.

| Thành phần | Rect | Ghi chú |
|---|---|---|
| Tiêu đề | 100,86,820,34 | T: CÔNG PHÁP · KỸ NĂNG; I: LINH BẢO • TÚI TRANG BỊ |
| Tài nguyên | 922,90,210,26 | Linh thạch từ p.stones; căn phải |
| Đóng | 1144,86,40,32 | X, Esc theo handler cũ |
| Dải tab | 100,132,1080,38 | Tab đang chọn viền gold 2px + nền gold .12; khác paper .8 |
| Nội dung | 100,182,1080,410 | Clip từng vùng; không đè khung ngoài |
| Chân bảng | 100,602,1080,33 | Hướng dẫn ngắn, trạng thái/toast dự phòng |

Hover 100ms, chọn tab 140ms (fade nội dung, không chạy nền), nhấn 90ms. Modal mở/đóng theo hệ hiện hành; nếu chưa có fade thì 180ms/120ms, chỉ alpha, dừng nhận click khi đóng. Mọi hitbox khớp rect logic; một click một hành động, pointer modal chặn đánh/di chuyển thế giới. Chỉ một modal hiện; giữ quy tắc mở/đóng, pause và điều kiện combat vốn có. Không cưỡng ép đổi vị trí HUD.

## 3. Bảng T — kỹ năng phái và công pháp

### 3.1 Tab Kỹ năng phái (mặc định)

Nút (100,132,206,38) Kỹ năng phái; (314,132,206,38) Công pháp. Giữ tab mặc định lúc mới vào; đổi tab bằng chuột, không dùng Tab bàn phím. Giữ toàn bộ hành vi 5 ô, cộng điểm và `v11SkillPoints()`. Nút cộng hiện khi đủ điểm và đủ cấp theo code gốc, không tiêu linh thạch. Ví dụ layout 5 dòng (108,190+i×76,1064,68), i=0..4; icon 48×48 tại x120/y+10; tên x182/y+8 18px; cấp/MP/CD x182/y+35; phím x795/y+12 58×36; điểm/cộng x1004/y+12 148×36. Dùng dữ liệu thực `V11_SKILLS`, không copy vào DATA.techs.

| Phái | Tên | Cấp | MP | CD ms | Phím |
|---|---|---:|---:|---:|---|
| Kiếm Tu | Vạn Kiếm Xuyên Tâm | 1 | 18 | 1250 | RMB |
| Kiếm Tu | Liên Hoàn Kiếm | 2 | 24 | 2500 | 1 |
| Kiếm Tu | Thanh Vân Kiếm Vũ | 4 | 30 | 4500 | 2 |
| Kiếm Tu | Thiên Kiếm Lạc | 7 | 42 | 7000 | 3 |
| Kiếm Tu | Kiếm Tâm | 3 | 0 | 0 | — |
| Thể Tu | Chấn Sơn Băng Quyền | 1 | 22 | 2600 | RMB |
| Thể Tu | Thiết Sơn Hộ Thể | 2 | 22 | 6000 | 1 |
| Thể Tu | Bát Hoang Chấn | 4 | 30 | 4300 | 2 |
| Thể Tu | Kim Cương Trấn Địa | 7 | 42 | 7000 | 3 |
| Thể Tu | Kim Cương Thể | 3 | 0 | 0 | — |
| Pháp Tu | Hàn Nguyệt Tam Tinh | 1 | 26 | 2000 | RMB |
| Pháp Tu | Hàn Băng Linh Cầu | 2 | 25 | 3000 | 1 |
| Pháp Tu | Tử Lôi Pháp Ấn | 4 | 34 | 4500 | 2 |
| Pháp Tu | Băng Hà Vạn Trượng | 7 | 44 | 7000 | 3 |
| Pháp Tu | Linh Hải | 3 | 0 | 0 | — |

Chỉ hiện 5 dòng đúng p.cls (0/1/2); bị khóa hiển thị cấp yêu cầu, giữ tooltip cũ. Không sửa sát thương, MP, hồi chiêu, keybind hay điểm học; ưu tiên giá trị runtime nếu đã đổi cân bằng.

### 3.2 Tab Công pháp

| Vùng | Rect | Nội dung |
|---|---|---|
| Bộ lọc | 108,190,488,34 | 3 nút thả: phẩm (x108,w148), loại (x264,w156), hệ (x428,w168) |
| Danh sách | 108,232,488,352 | 5 thẻ 476×64, cách 6px; cuộn đúng vùng; thanh cuộn x586,w8 |
| Chi tiết | 608,190,564,294 | Tên, nhãn hệ/phẩm/loại, bậc, cấp, giá, mô tả, lore, hiệu ứng |
| Thao tác | 616,492,548,45 | Học/Nâng bậc x616,w180; Trang bị/Tháo x804,w180; nguồn x992,w172 |
| Ô đang dùng | 616,544,548,40 | 6 ô 64×40 cách 8px; nhãn số ô ở x1052 |

Nhãn đầu chi tiết gồm phái (Kiếm/Thể/Pháp/Mọi phái), ghi rõ “Thụ động · chỉ hiệu lực khi trang bị” cho cả 4 loại; Tuyệt kỹ không phải phím chiến đấu. Dòng hiệu ứng có 3 cột: stat (624,388,156,84), bậc hiện/kế (788,388,176,84), hiệu lực đổi thực tế (972,388,184,84); so sánh khi đang mặc bằng bộ công pháp thật, khi chưa mặc và có ô trống bằng giả lập thêm, khi đầy ghi “Chọn ô cần tháo để so sánh” (click ô để xem thay thế, không tự swap). Mỗi hàng hiển thị raw và chênh hiệu lực với baseline hiện tại; nếu nhiều hơn 3 hàng cuộn trong vùng. Không có tăng thực tế vì trần: nút “Nâng dự trữ”; nhấn lần đầu hiện xác nhận inline ở chân bảng (100,602,1080,33), nút Xác nhận (904,604,132,29), Hủy (1044,604,132,29), hết 5 giây/đổi lựa chọn/đóng modal thì huỷ; không thêm modal. Lần xác nhận mới commit đủ điều kiện, hiển thị “Chưa tăng hiệu lực ở cảnh giới hiện tại”.

Filter mặc định “Tất cả”; phẩm Phàm/Linh/Địa/Thiên; loại Võ kỹ/Thân pháp/Tâm pháp/Tuyệt kỹ; hệ đủ 7. Bộ lọc kết hợp AND; mỗi menu mở tại x của nút, y=224, rộng bằng nút, hàng 32px, cao tối đa 256px (8 dòng), nằm trên danh sách, đóng khi chọn hoặc click ngoài (click đó không xuyên xuống thẻ). Danh sách dữ liệu mới 30 món sắp reqLevel tăng dần rồi thứ tự file; filter đổi đưa scroll về 0, giữ chọn nếu còn, nếu không chọn thẻ đầu; không có kết quả ghi “Không có công pháp phù hợp.” Chi tiết rỗng và nút khoá. Cuộn theo chuột ở list, 70px/nấc; không cuộn camera. Scroll giới hạn 0..max(0,70×số thẻ−6−352); thẻ bị clip chỉ nhận click phần đang thấy. 

Thẻ: (x+8,y+8,46,46) ấn chữ hệ + viền phẩm, tên x+64,y+8 cỡ 16, dòng hệ/loại/cấp x+64,y+34 cỡ 12. Trạng thái căn phải vùng 124px, 12px. Viền Phàm muted #b5a18b 1px, Linh jade #a8d6c5 1px, Địa paper #f1e4cf 2px, Thiên gold #e3b96f 2px + viền trong 1px cách 3px. Mỗi thẻ luôn ghi tên phẩm bằng chữ. Chọn thẻ nền gold .12, không đổi nghĩa phẩm.

Chi tiết: tên (624,202,532,28) V18Serif 20; nhãn (624,232,532,20); bậc/cấp/giá (624,258,532,24); desc (624,288,532,36) 14px tối đa 2 dòng; lore (624,328,532,54) 13px tối đa 3 dòng; hiệu ứng (624,388,532,84) hàng 24px: tên chỉ số, bậc đang xem, giá trị bậc kế. Chữ dài wrap trong rect; lore quá 3 dòng cuộn nội bộ 18px/nấc; không cắt bằng dấu ba chấm. Với chưa học, xem bậc 1; đã học xem bậc thật; tối đa ghi “Đã đạt tối đa”. Công thức từng effect tại bậc r: giá trị = value + (r−1)×perRank. add hiển thị số cộng (crit đổi sang điểm phần trăm); mul hiển thị hệ số hoặc % thay đổi so với 1 (dashCd âm nghĩa giảm hồi chiêu). Không làm tròn trước khi tính thật; hiển thị tối đa 2 chữ số thập phân.

Trạng thái (mỗi thẻ đúng một nhãn, theo thứ tự): Đã học nếu có ID trong p.techs; nếu chưa học, Không hợp phái (cls khác p.cls), Chưa đủ cấp (p.level < reqLevel), Nhận từ boss (price=0), Học được (còn lại). Khi thiếu linh thạch vẫn ghi Học được + khóa nút và lý do “Thiếu N linh thạch”; nếu chưa gần Trưởng lão, ghi “Đến gặp Trưởng lão”. Với save bất thường đã học mà không hợp cấp/phái: giữ nhãn Đã học + lý do đỏ, cho tháo nhưng không trang bị/nâng. Màu trạng thái Đã học jade, học được gold, thiếu cấp/phái muted; lý do khóa red. 

Trong thẻ, vùng tên tối đa 276px (từ x+64 tới x+340), trạng thái x+344..x+468; đo bằng font thật, tên dài xuống dòng thứ hai, thông tin phẩm/hệ/loại/cấp ở hàng cuối y+46, chữ tối thiểu 12px. Tooltip tên đầy đủ nếu không đủ chiều rộng; không cắt nhãn nút. Chi tiết cập nhật theo lựa chọn clip tại rect; scroll lore chỉ khi pointer nằm trong rect lore, không cuộn list. 

Nút trái Học/Nâng bậc hiện giá thao tác và khóa nếu không đủ điều kiện; giá học gốc chỉ hiện ở mục chi tiết, không nhầm với giá nâng bậc. Với price=0 chưa sở hữu, nút “Chưa nhận được” khóa, trừ trường hợp nhận miễn phí từ cờ boss thật tại inn nêu ở §3.3; nguồn bên phải là thông tin không bấm, wrap tên boss/vùng. Ô giữa “Trang bị” nếu đã học và chưa mặc; “Tháo” nếu đang mặc, kể cả không còn hợp cấp/phái. Trạng thái không hợp lệ không cho click xuyên. Khi đã đạt maxRank, nút trái ghi “Đã viên mãn”, khóa.

### 3.3 Học, nâng bậc, trang bị và nguồn nhận

- 26 món có price>0 mua học một lần tại NPC `inn` Trưởng lão Thanh Thạch: vào vùng tương tác hợp lệ đã có của NPC, mở T và chọn Công pháp; không thêm NPC/shop. Tự kiểm khoảng cách/cảnh/điều kiện tương tác từ handler gốc, không dựa vào rect mỹ thuật. Có thể mở bảng ngoài đó để xem, trang bị và tháo, nhưng học/nâng bậc chỉ tại Trưởng lão. Trừ đúng price, ghi id vào p.techs, bậc 1; không tự chiếm ô. Click khi đủ tiền/cấp/phái và chưa học mới hợp lệ.
- 4 món price=0 nhận một lần qua thưởng boss hiện có, không xuất hiện như món mua, không thu phí học. Bảng ánh xạ nguồn đề xuất: Trúc Ảnh Bộ (`truc_anh_bo`) → boss `truc` (Trúc Lang Vương); Tuyết Tịch Kiếm Phổ (`tuyet_tich_kiem`) → boss `tuyet`; Nham Tâm Ấn (`nham_tam_an`) → boss `hoa`; Lôi Tịch Bộ (`loi_tich_bo`) → boss `loi`. Chỉ gắn vào handler thưởng boss thật, trao nếu chưa có ID và đúng phái (Kiếm Tu ở Tuyết Tịch); nhận trước cấp thì giữ, không trang bị tới đủ cấp. Không đổi boss/loot hiện hành, không tạo boss mới. Với save cũ, nếu cờ hạ đúng boss đã được game lưu và xác thực, cho nhận miễn phí tại inn một lần (chỉ ID chưa có, đúng phái), dùng nút “Nhận công pháp”; nếu không có cờ tin cậy hay boss có thể tái sinh, giữ nguyên luồng thắng boss kế tiếp, không suy từ cấp. Nếu boss không thể đánh lại và thiếu cờ, Claude phải chốt nguồn trước khi bật. Không thêm cờ save ngoài ID sở hữu; nếu chưa xác nhận hook thì chỉ ghi “Nguồn chờ xác nhận” (khóa nhận).
- Nâng bậc tại Trưởng lão, chỉ món đã học đủ phái/cấp và r<maxRank. Chi phí B+S×(r−1), r là bậc hiện tại; 100% thành công, mỗi click tăng đúng 1, kể cả công pháp nhận boss. Không dùng điểm kỹ năng. Claude duyệt trước khi T18 áp dụng.

| Phẩm | B/S (linh thạch) | Bậc tối đa | Tổng nâng từ 1 | Tổng học + nâng (món trả phí) |
|---|---:|---:|---:|---:|
| Phàm | 8/4 | 3 | 20 | 32–65 |
| Linh | 16/8 | 4 | 72 | 132–202 |
| Địa | 28/14 | 5 | 196 | 346–436 |
| Thiên | 45/20 | 5 | 300 | 600–780 |

Mục tiêu kinh tế đề xuất: đo 3 lượt farm 10 phút ở mỗi dải cảnh giới (không thêm loot, loại thu nhập một lần), lấy trung vị linh thạch ròng/phút; mục tiêu mua 1 món phù hợp 3–8 phút, học và nâng tối đa 8–25 phút. Nếu lệch, điều chỉnh giá/cost sau đo và duyệt, không tự sửa loot hiện tại. Không cam kết thời gian khi chưa có số liệu runtime.
- Ô mới giới hạn theo cảnh giới: Luyện Khí Lv1–9: 2; Trúc Cơ Lv10–18: 3; Kim Đan Lv19–27: 4; Nguyên Anh Lv28–36: 5; Hóa Thần Lv37–45: 6. Hiện tất cả 6 ô; ô chưa mở màu muted .4 + khóa, trống viền vàng .35, có món hiện ấn hệ + bậc. Tooltip tên đầy đủ khi hover 300ms, tối đa 260×90; click ô có món chọn chi tiết. Trang bị cần đã học/đủ cấp/phái/ô trống, không trùng ID; hết ô báo “Hãy tháo một công pháp trước.” Tháo bất kỳ lúc được phép mở modal; không xoá sở hữu, không hoàn tiền.
- Feedback học/nâng/trang bị: flash viền jade .45 trong 240ms, text chân bảng 1800ms; lỗi viền red .35 220ms + thông báo 1800ms. Không phát hiệu ứng thành công nếu không thực hiện giao dịch. Mỗi lần click, xác thực lại id/rank/slot/tiền ở thời điểm commit, cập nhật sở hữu và tiền trong một giao dịch rồi save một lần; khóa nút 450ms như cường hoá, kể cả chuyển thẻ/tab hoặc mở lại bảng. Không áp thay đổi nếu giao dịch không hợp lệ, không trừ tiền rồi mới dò ID. Dung hợp chỉ nhận ID/cặp đã khai báo trong FUSIONS; không tự dùng ID mới làm nguyên liệu.

## 4. Bảng I — túi trang bị, linh bảo, nguyên liệu

Giữ 3 ô trang bị thật, 48 món tối đa và chỉ số lưu dạng số. Ba tab hiện hữu/nút nâng cấp: Trang bị (100,132,180,38), Linh bảo (288,132,180,38), Nguyên liệu (476,132,180,38). Tab Trang bị mặc định; giữ nguyên dữ liệu và thao tác các tab cũ. Không tạo modal thứ ba.

| Thành phần | Rect | Nội dung |
|---|---|---|
| 3 ô đang mặc | 108,190,300,190 | mỗi hàng 300×56, y190/252/314; icon 44×44, tên/cấp ở x164 |
| Chỉ số | 108,388,300,196 | công/thủ từ currentStats(), so sánh chênh lệch nếu chọn món túi |
| Túi 48 ô | 420,190,400,336 | lưới 8 cột ×6 hàng, mỗi ô 46×52, bước 50×56; icon 32×32, +n ở góc dưới |
| Dung lượng | 420,538,400,30 | số món /48, chú thích |
| Chi tiết | 832,190,340,394 | tên 18px, ô/hệ/cấp, atk/def/style, desc/lore, nút mặc/tháo và cường hoá |

Nền ô trống ink .75, viền muted .35. Đang chọn gold 2px; đang mặc jade 1px + nhãn “Đang mặc”; chưa đủ cấp phủ ink .45, icon khóa nhưng vẫn xem. Chi tiết: tên (844,202,316,40), loại/hệ/cấp (844,246,316,24), công/thủ (844,274,316,24), desc (844,304,316,42), lore (844,350,316,52) wrap/scroll; nút Mặc/Tháo (844,410,316,32). Bảng cường hoá (844,450,316,126) có dòng +n → +(n+1) y456, giá y480, tỷ lệ thành công y504, nút (844,534,316,38). Mặc đúng slot, kiểm reqLevel chỉ với 20 món mới; không áp điều kiện mới lên đồ 0–62. Món được chọn trong túi hoặc ô mặc; quy tắc swap, túi đầy và đối tượng được cường hoá theo handler cũ (không tạo bản sao). Không đủ chỗ để tháo: giữ nguyên, báo lý do.

### 4.1 Cường hoá

Đọc DATA.equipment.upgrade: n là cấp cường hoá HIỆN TẠI (0..9); giá 6+4n, thất bại 0+0.06n, thành công 1−thất bại. +10 không cho bấm. Bảng hiển thị trước khi bấm, từ cùng số liệu dùng để tính thật:

| Từ → đến | Linh thạch | Thành công | Thất bại |
|---|---:|---:|---:|
| +0 → +1 | 6 | 100% | 0% |
| +1 → +2 | 10 | 94% | 6% |
| +2 → +3 | 14 | 88% | 12% |
| +3 → +4 | 18 | 82% | 18% |
| +4 → +5 | 22 | 76% | 24% |
| +5 → +6 | 26 | 70% | 30% |
| +6 → +7 | 30 | 64% | 36% |
| +7 → +8 | 34 | 58% | 42% |
| +8 → +9 | 38 | 52% | 48% |
| +9 → +10 | 42 | 46% | 54% |

Tỷ lệ text jade nếu ≥70%, gold 50–69%, red <50%, luôn có % và dòng “Thất bại không tụt cấp”; không chỉ dựa màu. Nút “Cường hoá” tắt nếu thiếu tiền, không có món hợp lệ, +10 hoặc đang xử lý 450ms. Sau click kiểm lại món, n và số dư; trừ đúng giá một lần; thực hiện đúng một roll trong handler cũ được nâng cấp. Thành công tăng đúng 1 theo logic tăng chỉ số vốn có (không thay công thức cộng chỉ số); thất bại mất số linh thạch đã trừ, giữ nguyên cấp/món/vị trí. Lưu ngay theo đường save hiện hành ở cả hai kết quả. Thành công viền gold 300ms + text jade “Cường hoá thành công · +N” 1800ms; thất bại viền red 200ms, text red “Cường hoá thất bại · Giữ +N” 1800ms; không rung cả màn. Cập nhật giá và xác suất ngay khi giao dịch xong. Không tạo bảo hiểm, vật liệu, phí mới, xác nhận modal hoặc cách gacha.

### 4.2 Linh bảo và nguyên liệu

Kỳ vọng chi phí nâng từ +0 tới +5: 83,45 linh thạch/món; tới +10 khoảng 390,47/món (tổng giá từng bước chia xác suất thành công, không tụt cấp; giả định roll độc lập). Ba ô +10 khoảng 1171,40, chỉ là kỳ vọng, không bảo đảm. Nút giữ nguyên giá/rate T14; đo ngân sách farm trước khi khuyến nghị nâng. Tại +5 thử cả ba slot và đối chiếu sức mạnh thực, không thêm vật phẩm bảo hiểm.

Linh bảo giữ tối đa 4 relic, chỉ số/điều kiện mở/đổi/lưu cũ. Đề xuất 4 ô (108+i×112,190,104,82), i=0..3; đường nối giữa 2 ô kề nhau 8px gold khi tương sinh, muted khi không; tooltip “Tương sinh: +7% công, +2 thủ” cho cặp đúng vòng đã có. Không nối ô cuối về đầu nếu code không có. Giữ nguyên thuật toán cộng buff cũ, Lôi/Phong ngoài vòng. Dưới (108,286,708,298) là danh sách relic hiện có, chi tiết (832,190,340,394); không gộp relic vào 3 slot vật lý. Nguyên liệu: danh sách (108,190,708,394), chi tiết (832,190,340,394); giữ thao tác nguyên liệu hiện hữu, số lượng và nguồn của game; không invent chế tạo mới. Hai tab này chỉ bố trí lại trong modal gear.

### 4.3 Nguồn trang bị mới (đề xuất cho Claude)

Whitelist chỉ số theo vùng (mỗi ID đúng một vùng): truc 63,64,71,72,77,78; yeu 65; tram 66; tuyet 73,79; hoa 67,74,80; phong 68; quy 75,81; ma 69; loi 70,76,82. Lv19 Ngân Lan Y và Lv20 Ngân Phong Hoàn bổ sung Tuyết vực, không dịch chỉ số. Chỉ kích hoạt khi nối được pool cũ, không tự tạo pool mới.

Không mở cửa tiệm mới, không thay thưởng boss cố định và không phát trang bị chỉ vì nạp data. Khi xác nhận pool loot trang bị có sẵn, chỉ nối ứng viên theo chỉ số 63–82 và cấp vùng tương ứng: Lv1–9 truc, 10–14 yeu, 15–18 tram, 19–23 tuyet, 24–27 hoa, 28–32 phong, 33–36 quy, 37–40 ma, 41–45 loi (dải vùng đã duyệt T19, không thay cổng/level quái). Giữ cơ chế xác suất rơi và túi đầy đã có; chỉ thêm ứng viên vào pool đúng slot/cấp, không thêm tỉ lệ hay bảo đảm mới. Nếu pool hiện hành không hỗ trợ lọc theo vùng, Claude phải xác nhận đường nhận trước khi bật phân phối, không đưa toàn bộ đồ Lv45 vào loot Lv1. T18 có thể kiểm UI qua save test ở mức phù hợp. Giá mua/bán nếu có lấy cơ chế gốc; schema không có price cho gear, không tự thêm trường.

## 5. Dữ liệu & tương thích save

| Nguồn | Hợp đồng |
|---|---|
| DATA.techs.items | 30 mục mới đúng schema T14; không sửa TECH 9 id có sẵn |
| DATA.equipment.items | 20 món append đúng thứ tự file vào EQUIPMENT chỉ số 63–82; phải xác nhận length=63 trước append, nạp một lần. Không sort/xóa/sửa 0–62 |
| p.techs | Mảng ID sở hữu; giữ đủ ID cũ, không biến thành mảng trang bị |
| p.techRanks (mới, đề xuất) | object ID mới → bậc; mặc định {}. Nếu ID mới đã sở hữu mà thiếu rank, đọc 1; clamp 1..maxRank |
| p.techEquipped (mới, đề xuất) | mảng ID mới đang trang bị; mặc định []; loại trùng/ID lạ hoặc không sở hữu khi đọc, không sửa ID cũ |
| p.cls, p.level, p.stones, realm(), currentStats(), V11_SKILLS, v11SkillPoints() | Dùng thật, không giả biến mới cho dữ liệu cũ |
| EQUIPMENT, bag/equipped/relic/material/upgrade | Dùng đúng trường save/handler hiện tại do Claude xác nhận, không tự đặt tên thay thế |
| TECH, FUSIONS, phím R | Giữ công pháp gốc và dung hợp cũ; không thêm công thức R hay tiêu hao công pháp mới |

Công pháp cũ đã sở hữu tiếp tục có hiệu ứng như trước, không chiếm ô mới, không chuyển hệ thống cũ sang giới hạn mới. Trong tab Công pháp thêm nhãn chân bảng “Công pháp gốc & dung hợp: giữ nguyên (R)”; chi tiết công pháp gốc vẫn theo đường UI cũ được bảo toàn, không bắt học lại. Hệ mới chỉ áp dụng tác dụng của ID mới đang trang bị hợp lệ, rank hiện tại. Khi thêm ID mới vào p.techs, mọi đường đọc p.techs/TECH gốc (kể cả R, tooltip, save, currentStats) phải nhận diện ID mới an toàn hoặc lọc riêng phần cũ; không tra thuộc tính của TECH[id] chưa tồn tại. Không đăng ký hiệu ứng mới vào đường tự kích hoạt của TECH rồi cộng lại lần hai. Nếu không thể tách an toàn, chưa bật học/trao công pháp mới. 

**Cân bằng cộng dồn v1.2 (chờ Claude duyệt trước T18):** giữ baseline legacy. Với mỗi stat, raw x là tổng các add, hoặc tổng (v−1) của mul tăng, hoặc tổng (1−v) riêng dashCd. Không nhân chồng hệ số của các công pháp mới. Phần hiệu lực y = min(H, min(x,S)+0,35×max(0,x−S)); S là ngưỡng mềm, H là trần cứng. Áp add = baseline+y, mul tăng = baseline×(1+y), dashCd = baseline×(1−y); crit thực vẫn clamp ≤0,60. Không làm tròn khi tính. Chỉ dùng các công pháp mới đủ điều kiện đang trang bị; không sửa legacy.

| Stat | Luyện Khí 1–9 | Trúc Cơ 10–18 | Kim Đan 19–27 | Nguyên Anh 28–36 | Hóa Thần 37–45 |
|---|---:|---:|---:|---:|---:|
| attack / spellAtk (mỗi stat) | 12/18% | 24/34% | 36/50% | 48/65% | 60/80% |
| rate | 6/10% | 12/18% | 18/26% | 24/34% | 30/42% |
| dashCd (giảm) | 5/8% | 10/16% | 15/24% | 20/30% | 25/36% |
| regen | 5/8% | 10/15% | 15/22% | 20/28% | 25/35% |
| speed | 25/35 | 40/55 | 55/75 | 70/90 | 85/110 |
| crit (điểm %) | 2/3 | 4/6 | 6/9 | 8/12 | 10/15 |
| range (đơn vị runtime) | 6/10 | 12/18 | 18/27 | 24/36 | 30/45 |
| hp | 20/30 | 55/80 | 90/125 | 125/170 | 160/220 |
| mp | 12/20 | 30/45 | 50/70 | 70/100 | 95/135 |
| def | 3/5 | 8/12 | 14/20 | 20/28 | 26/36 |

Mỗi ô S/H; phần trăm đổi về số thập phân khi tính. Khi vượt S, hiển thị “Hiệu lực giảm dần (35%)”; khi chạm H, “Đạt giới hạn cảnh giới”. Xem trước raw và y theo cùng công thức, không giả định mọi bậc đều tăng hiệu lực. Lên cảnh giới tự cập nhật ngưỡng, không mua lại. Nếu stat chưa xác nhận đơn vị/ý nghĩa (regen/rate/range), không mở bán/trao công pháp đó cho đến khi Claude xác nhận. Không thay ý nghĩa stat theo suy đoán.

Không cộng buff mới vào dữ liệu gốc vĩnh viễn. Khi tháo/mất điều kiện phải tính lại, clamp HP/MP hiện tại vào tối đa mới, không hồi miễn phí. So sánh đồ trong preview qua dữ liệu hiện tại không được mutate p, bag, tiền, HP/MP hoặc save.

Save cũ thiếu field: giữ p.techs, số đồ, p.level, XP, tiền, quest, relic và mọi dữ liệu khác; thêm mặc định cho hai trường. Save bị giảm level hiếm gặp: chỉ tính những ô/ID hợp lệ theo thứ tự mảng, phần vượt cap không kích hoạt, cho tháo. Không xóa sở hữu. Không tự thêm khóa save ngoài hai trường đề xuất.

Nạp an toàn: kiểm version và ID trước khi biến đổi runtime. Nếu EQUIPMENT đã chứa đúng 20 mục mới tại 63–82, không append lần nữa; nếu length khác 63 và không khớp toàn bộ mapping này, bỏ bước append và báo Claude, không sửa/xóa đồ. Nếu data lỗi, giữ hệ cũ chạy, ghi cảnh báo một lần; không bật UI học/trao/mua dữ liệu lỗi. Chỉ dùng field mới có mặc định. Không ghi save trong lúc vẽ; không sửa mảng 0–62 để lọc hay sort.

Nếu đã nhập BATCH v1.0/v1.1, đối chiếu đúng danh sách 20 index, nhận diện alias v1.0 tại 63/66 bằng mapping đã duyệt trước, sau đó thay metadata trong 63–82 đúng v1.2 một lần; không đổi index hay mức nâng, không cấp lại đồ/công pháp. Nếu không xác thực được toàn bộ mapping thì dừng import. Chỉ số 73/79 đổi cấp: món đã mặc từ v1.1 nhưng thiếu cấp cho xem/tháo, không kích hoạt bonus mới cho đến khi đủ cấp; không mất món, không tự đẩy vào túi đầy. Claude xác nhận trước khi chạy migration. Cường hoá giữ định danh instance thật (hoặc theo loại nếu handler gốc dùng nâng theo loại), xác thực lại slot/bag index và identity lúc commit, nếu đã swap/di chuyển thì huỷ giao dịch không trừ tiền; không tự thêm identity vào save.

## 6. Tương tác / Không làm

Giữ T, I, R, Esc và các phím cũ như Q M F2 F6 E H Space 1–3 C J L N P B O G U Y V Tab. Tab nội bộ đổi bằng chuột; không chiếm hotkey mới; không thay đường vào NPC cũ, không đổi điểm nhiệm vụ hay panel dialogue. Tính dữ liệu/format hiệu ứng khi chọn thẻ hoặc thay rank, cache icon/khung; không spawn canvas mỗi frame. Không tạo thêm NPC, cửa tiệm, kỹ năng combat chủ động, hệ nguyên tố mới, slot vật lý thứ tư, icon mới hay sửa HUD T10/T12. Không viết code ở T31.

## 7. Checklist nghiệm thu

- [ ] 1280×720/HiDPI cùng tọa độ; cả hai modal không tràn/cắt chữ, nền ấm, T I R Esc hoạt động đúng, không mở modal thứ ba.
- [ ] Ba phái đúng 15 kỹ năng ở bảng trên, chỉ 5 kỹ năng/phái, cộng điểm và phím đánh như cũ.
- [ ] 30 công pháp mới, lọc AND đúng, 4 màu phẩm, mô tả/lore đọc được, cuộn không kéo camera, trạng thái/cấp/phái/giá chính xác.
- [ ] Luyện Khí 2 ô, Trúc Cơ 3, Kim Đan 4, Nguyên Anh 5, Hóa Thần 6; không trang bị trùng/vượt cap; tháo trả chỉ số.
- [ ] Học đúng tại Trưởng lão, thiếu tiền/cấp/phái hoặc xa NPC không trừ; boss trao đúng một lần, giá 0 không mua; nâng bậc hiện đúng cost và effect.
- [ ] Đồ 0–62 giữ nguyên cả thứ tự/lưu; 20 món mới ở 63–82; túi đủ 48, 3 slot, đồ mới kiểm cấp; old save và R vẫn hoạt động.
- [ ] 4 relic và synergy +7%/+2 đúng code, nguyên liệu không mất, không tạo slot hoặc tab thứ tư.
- [ ] +0→+1 100%, +9→+10 46%; thử roll thất bại: chỉ mất giá, không tụt cấp/không mất món; +10 khóa; double-click không trừ hai lần.
- [ ] Save/load cả save trước T18 và save mới: rank/ô/upgrade/tiền đúng, không áp hiệu ứng hai lần; không lỗi console; FPS không tụt do vẽ panel.
- [ ] Test 2–6 công pháp cùng stat tại cả năm cảnh giới, soft/hard cap v1.2 đúng, baseline cũ không đổi; xem trước raw/hiệu lực và báo giảm dần/giới hạn; tháo/đổi món đúng và không hồi miễn phí.
- [ ] Nạp file 2 lần và thử length EQUIPMENT sai: không append trùng, không dịch chỉ số; ID mới trong p.techs không gây lỗi R/tooltip/công thức cũ; save thiếu/sai rank không crash.
- [ ] Save cũ đã hạ boss: chỉ nhận miễn phí nếu cờ thật xác nhận; thử hết tiền, đổi tab/đóng-mở liên tục, click kép học/nâng/cường hoá không trừ hai lần.
- [ ] Preview bậc và trang bị đầy ô không mutate save, nhãn thụ động/phái đúng; nâng dự trữ cần xác nhận kèm giá, hết hạn không trừ; kiểm instance bị swap và import thử v1.0/v1.1 không mất cấp nâng.
