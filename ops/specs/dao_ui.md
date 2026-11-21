# T48 — Vạn Đạo · Đạo nghiệp (N), v2.0

B2 · 21/11/2026 · REVIEW · G1/G2/F3/F4/F9, tong_mon_N.png.

## Mục tiêu
Tạo bốn sơn môn khác biệt nhưng thống nhất bộ khung T36. Giữ modal v31dao, 5 tab, 6 tài nguyên, mọi handler và giới hạn. Không tách modal mới.

## Thành phần chung
Rect logic 1280×720. Khung ornament()/box() T36 §1 (24,24,1232,672); ink #100b13 .92, vân paper #f1e4cf .04, gỗ ink + red #f18474 .07, viền gold #e3b96f .68, tốt jade #a8d6c5, phụ muted #b5a18b, chữ paper. V18Serif 28 title/20 tên/16 mục; V45Sans 14 thân, 16 số, ≥12. Hover 100ms gold .10; chọn gold 2px .14; khóa ink .45 + chữ; thiếu tài nguyên red có số/điều kiện; click 80ms, tab fade 140ms, mở 180ms/đóng 120ms, tooltip 300ms/100ms. Dùng lại nút/tab/scroll T36, clipping và hitbox theo rect; T21 ánh sáng trước UI.

| Khối | Rect | Nội dung |
|---|---|---|
| Tiêu đề | 42,36,1160,34 | VẠN ĐẠO · ĐẠO NGHIỆP |
| Phụ đề | 42,72,1160,20 | Tán tu/tông môn · cảnh giới thực |
| Sáu tài nguyên | 38+i×202,100,194,44; i=0..5 | Linh thạch, Huyền thiết, Linh tinh, Tinh phách, Linh thảo, Linh mộc |
| 5 tab | 38+i×242,153,234,40 | Tông môn · Đệ tử · Động phủ · Linh thú · Linh căn & Huyết mạch |
| Nội dung | 38,205,1202,429 | Clip riêng |
| Footer | 38,646,1202,38 | mô tả gốc + Trở về hành trình · Esc (1020,646,220,38) |

Tab dài nhất “Linh căn & Huyết mạch” 14px, giảm 12px hoặc wrap 2 dòng, không cắt. Tài nguyên có icon gốc 28×28 tại x+8,y+8, nhãn x+43,w98 ở y+5, số căn phải x+104,w78 y+22; số cực dài dùng 12px, tooltip số đầy đủ. Không tạo icon tài nguyên hay đơn vị mới.

## Tông môn — 4 cổng sơn môn
Khi chưa gia nhập, 2×2 thẻ (38+c×606,205+r×216,596,208) theo thứ tự cloud/herb/forge/shadow. Hoành phi (x+12,y+8,572,34) chữ serif 21; gờ gỗ 6px hai bên, ấn tông từ icon gốc (x+14,y+49,84,84). Màu là phối palette hiện có: cloud jade .25 + gold; herb jade .50 + paper; forge gold .30 + red .12; shadow ink + muted .50/gold .30. Màu gốc riêng của tông nếu renderer có thì giữ; không thêm hex. Không giả màu phẩm chất.
Tên/đạo/thưởng: (x+110,y+46,470,24)/(x+110,y+72,470,20); motto DATA.sect (x+110,y+94,470,22) 14px; vùng/điều kiện (x+110,y+118,470,45) 3 dòng 14–15px: cấp 2, 10 linh thạch, gặp người tiếp dẫn, giá trị hiện tại/thực tế bên phải. Intro vào tooltip/mở chi tiết từ vùng hoành phi nếu chỉ là đọc, không tạo action join mới; tooltip w350 h110 wrap, ưu tiên trong khung không đè nút. Nút Dẫn đến người tiếp dẫn (x+12,y+166,278,34), Gia nhập · 10 linh thạch (x+298,y+166,286,34). Khóa lý do thật, không hiển thị đích chưa xác định, không tự chuyển vùng.

| id | Sơn môn · đạo | Thưởng/bậc (G2) | Người tiếp dẫn theo F4; vùng |
|---|---|---|---|
| cloud | Thanh Vân Tông · Kiếm đạo | Công kích +5% | inn · thon |
| herb | Bách Thảo Đường · Đan đạo | Sinh lực +25 | herbalist · tram |
| forge | Thiên Công Các · Luyện khí | Phòng ngự +5 | desertSmith · hoa |
| shadow | Huyền Minh Điện · Pháp đạo | Sát thương kỹ năng +6% | demonWatcher · ma |

Không suy vị trí NPC từ vùng tông; dẫn theo vị trí NPC thật, nhất là herbalist ở thôn trong ảnh. Khoảng cách từ handler thật; nếu runtime có tên tiếp dẫn khác, giữ code và Claude đối chiếu. Điều kiện gia nhập chính xác handler. Ấn đã chọn viền gold 2px; hover 100ms, khóa nút vẫn đọc được, không dùng màu riêng để thay nhãn.

### Sau gia nhập
Khung vẫn cùng tab; bố cục cổng tông hiện tại (38,205,440,429), intro/đạo/thưởng (54,262,408,78), bậc/công trạng (54,346,408,28). Năm bậc (54,382+i×35,408,32), tên/level/công trạng thật: Ký danh 2/0, Ngoại môn 5/12, Nội môn 10/35, Chân truyền 19/80, Trưởng lão 28/150. Dấu đã đạt jade, bậc hiện viền gold, chưa đạt muted, thiếu cấp/công ghi red. rankLines chỉ phát sau rank thật tăng, dùng dòng trạng thái trong vùng (54,570,408,50), wrap; không thưởng lần hai khi tải.
Cột phải (488,205,752,429): nhiệm vụ hiện hành (500,220,728,114); tiến độ/công/linh thạch theo p.v31.task; hành động gốc (500,302,728,32). Danh sách nhiệm vụ khả dụng (500,344,728,204), 3 hàng 64px, cuộn nếu có cả 2 nhiệm vụ cũ; tên 16, mô tả 14 tối đa 2 dòng, điều kiện rank/vùng và thưởng 12. Nút nhận/trả theo trạng thái gốc trong hàng (1042,y+16,176,34); footer quyền lợi/lương bổng (500,556,728,64), giữ mọi nút hiện có, chia đều trong hàng thứ hai. Nếu nhiều action thật hơn, cuộn vùng nội dung, không bỏ. 
DATA.sect chỉ nối 12 nhiệm vụ tương thích type hunt/boss vào pool hiện tại sau Claude duyệt; giữ 2 nhiệm vụ chung, không đổi max số nhiệm vụ đang nhận, không tự giao task, không thay tiến độ task cũ. minRank đối chiếu cấp G2 và vùng F1; yêu cầu thật là bậc đủ, không chạy auto rank. Hạ sau khi nhận theo event gốc; boss đã chết không nhận nếu không thể tái đấu (giữ quy tắc thật). Nhận/trả xác thực lại id, rank, trạng thái, trả đúng một lần và đọc số từ save. 

## Bốn tab còn lại
Giữ đủ các action của renderer hiện hữu; ảnh chỉ có tab Tông môn. Dùng vùng chung, chia 3 cột/thẻ theo số thật; mỗi tên dài wrap 2 dòng, scroll clip nếu > vùng. Không phát minh nút/mốc/tab.
| Tab | Rect trái | Rect phải | Hướng bố cục |
|---|---|---|---|
| Đệ tử | 38,205,704,429 | 754,205,486,429 | danh sách/p.v31.disciples; chi tiết/điều kiện & thao tác gốc |
| Động phủ | 38,205,560,429 | 610,205,630,429 | hình kiến trúc mờ cache; cấp/hạng mục theo p.v31.cave, giá/hành động thật |
| Linh thú | 38,205,704,429 | 754,205,486,429 | 4 thẻ 2×2 trong trái: x52+c×344,y219+r×196,w330,h182; chi tiết/đeo/tháo theo handler; cấp 5/10/19/28 F9 |
| Linh căn & Huyết mạch | 38,205,704,429 | 754,205,486,429 | 5 linh căn V31_ROOTS, hiệu ứng thật F9; huyết mạch và hành động theo runtime |
Khung phải header x+14,y+14,w−28,h28; thân scroll x+14,y+48,w−28,h270; action x+14,y+326,w−28,h88 chia đều thành hàng 36px. Khi thiếu/khóa, lý do ở ngay cạnh giá, không cắt tên. 

## Dữ liệu/không làm
V31_SECT, V14_SECTS, V31_RANKS, V31_TASKS, p.v31.{rank,merit,task,stipend,disciples,cave}, V31_PETS, V31_ROOTS, p.stones, p.level, realm(), V13_ITEMS, số tài nguyên từ renderer gốc; DATA.sect. Không đổi buff, giá 10, rank/cấp, phép mở linh thú, điều kiện tiếp dẫn hay save. Không tạo cơ chế phản môn, nhiệm vụ ngày, tông thứ năm. 

## V2 — Bản sắc 4 cổng và hợp đồng nhiệm vụ
Mẫu `img/batch03_v2_N.png`: gờ gỗ đồng 1px + hoành phi serif 21, icon 84×84. Vân trang trí theo đạo ở vùng x+12,y+46,92,116: cloud mây gió (nét cong gold/jade .12), herb lá đôi jade .12, forge nét đe/gân đồng gold .16, shadow vòng âm dương muted .13; dưới icon, không thêm icon gameplay. Có thể dùng ảnh loading vùng thực thu nhỏ khi art đã duyệt, không gợi đã khám phá hay đổi địa chỉ NPC. Dòng điều kiện 3 dòng 12–14, trái yêu cầu, phải hiện có/cần; đỏ khi thiếu, đủ dùng jade + ✓. Footer text không chạm CTA.
V47.1 thực đo: `v31Open` → `v31dao`; v31Panel có daoTab0…4, daoGuide0…3, daoJoin0…3, daoExit. Rank qua `v31Promote`, nhiệm vụ qua `v31AcceptTask(id)` và `v31ClaimTask()`, p.v31.task chỉ một nhiệm vụ, cống hiến p.v14.contrib được v31Sync chuyển vào merit. Không tự cộng/trừ merit trong UI.
Adapter DATA.sect: giữ hai nhiệm vụ `hunt`/`boss` gốc (không region). V47.1 accept chưa kiểm minRank; trước khi nối 12 mục mới vào pool, Claude phải mở rộng điều kiện sect id/minRank và bộ đếm vùng. Hunt chỉ tăng khi normal kill đúng region; boss chỉ boss vùng đúng region; không tính trước nhận. Kiểm tại handler khi accept/claim, không chỉ disable UI. Task cũ không mất count; unknown id không thưởng. Sau gia nhập, hiện nhiệm vụ đang làm trên đầu, mục khóa ghi “Cần Nội môn”/“Cần Chân truyền” rõ. Test load giữ tiến độ, báo cáo một lần, không thay rank hoặc bổng lộc.

## Checklist
- [ ] 6 tài nguyên, 5 tab, 4 cổng đúng id/tên/đạo/thưởng; tên dài không cắt.
- [ ] Gia nhập/dẫn đường đúng người, cấp, 10 linh thạch, khoảng cách; khóa/thiếu thể hiện chữ.
- [ ] Đã gia nhập: đủ 5 bậc, tiến độ, quyền lợi, nhiệm vụ cũ và mới; không nhận trùng, không thưởng lại khi load.
- [ ] 4 tab còn lại giữ tất cả hành vi thật, không thêm hệ thống; scroll không click xuyên.
- [ ] T36 animation/font/scale 1280, 1366, 1920, không tint ngày đêm.
