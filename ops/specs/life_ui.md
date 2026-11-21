# T49 — Nhân gian · Sinh hoạt tu tiên (J), v2.0

B3 · 21/11/2026 · REVIEW · phim_J.png, tram_thon_1–3.png, G1/G3, F7.

## Mục tiêu
Không gian đời thường theo Immortal Life: túi linh vật như kệ, lò đồng, thửa đất, chợ gỗ. Giữ modal life13, 7 tab, tác vụ tại trạm và điều kiện vị trí; không thêm nguyên liệu/recipe/điều khiển.

## Thành phần chung
Rect x,y,w,h logic 1280×720. T36 §1 ornament()/box() (24,24,1232,672), ink #100b13 .92, paper #f1e4cf .04 vân, gỗ ink + red #f18474 .07, gold #e3b96f .68, jade #a8d6c5, muted #b5a18b, chữ paper. V18Serif 28 title/20 tên/16 mục; V45Sans 14 thân/16 số/12 tối thiểu. Hover 100ms gold .10, chọn gold 2px .14, khóa ink .45 + lý do chữ, thiếu tài nguyên red + số đang có/cần, nhấn 80ms; tab fade 140ms, mở 180ms/đóng 120ms; tooltip 300ms/100ms. Dùng lại thanh cuộn/nút/tab T36, không tint UI theo T21. Vẽ chi tiết trang trí sau nền trước chữ, cache tĩnh.

| Khối | Rect | Nội dung |
|---|---|---|
| Tiêu đề | 42,36,890,34 | NHÂN GIAN · SINH HOẠT TU TIÊN |
| Phụ đề | 42,72,880,20 | Ngày game · thu thập, chế tạo, giao dịch, trồng linh dược |
| Tiền/đan | 944,40,138,44 / 1090,40,146,44 | p.stones/p.pills |
| 7 tab | 38+i×172,104,164,40 | Túi nguyên liệu · Luyện đan · Linh điền · Giao dịch · Ủy thác · Nhật ký · Phối phương |
| Nội dung | 38,156,1204,476 | Clip từng vùng |
| Footer | 38,646,1204,38 | Thông tin/điều hướng thật, J/Esc theo gốc |

## 1. Túi nguyên liệu
Heading (50,164,1178,24) TÚI LINH VẬT; 9 kệ (50+c×394,198+r×128,382,116), 3×3. Icon thật (x+12,y+14,84,84), tên (x+110,y+9,256,25), số (x+296,y+39,70,24) căn phải; mô tả (x+110,y+40,176,48) wrap 2–3 dòng; giá bán thực (x+110,y+89,256,19). Giữ đúng thứ tự ảnh: herb, wood, ore, crystal, seed, elixir, ward, Hồi Xuân Đan, Linh thạch; 7 nguyên liệu + 2 tài sản. Mục 0 vẫn hiện muted; không cho bán từ túi nếu không có hành vi cũ. Ba nút (50+i×210,591,200,34): Đến lò đan, Đến linh điền, Đến Vạn Bảo Sạp. Đọc vị trí trạm thật, không tự truyền tống; hết mục/unknown item không giả số.

## 2. Luyện đan
Heading (50,164,720,24), nút Dẫn đường đến lò đan (1010,164,218,30). Minh họa lò đồng cache trong góc heading/viền bên trái: ink/gold .3, làn khói jade .10; chu kỳ opacity 2400ms chỉ khi mở tab, tối đa 3 nét, tắt tiết kiệm/chuyển tab. 4 dòng (50,208+i×99,1178,90); icon (x+10,y+9,72,72), tên/mô tả (x+96,y+8,330,72), nguyên liệu x+438, rộng 476 (tối đa 3 ô 150×56, gap 8); nút (x+926,y+27,238,36). 
| Sản phẩm | Chi phí theo G3 |
|---|---|
| Hồi Xuân Đan ×2 | herb 2 |
| Tụ Linh Đan ×1 | herb 2 + crystal 1 |
| Hộ Thân Phù ×1 | wood 1 + ore 1 + crystal 1 |
| Tinh chế hạt giống ×3 | herb 2 |
Mỗi input hiển thị có/cần + tên; thiếu red, đủ jade. Chưa tới lò ghi “Chưa đến lò” và dẫn đường; đủ điều kiện đổi nhãn sản xuất theo handler, không thực thi từ xa. Không thay sản lượng, giá, công dụng, điều kiện; sau commit đọc số mới, flash jade 240ms/toast 1800ms, thất bại red 220ms; không tự tạo thêm RNG.

## 3. Linh điền
Heading (50,164,720,24) LINH ĐIỀN · VƯỜN LINH DƯỢC; Dẫn đường đến linh điền (1010,164,218,30). 4 luống (50+c×594,204+r×153,584,143) 2×2; nền ô đất ink + gold .13, luống có họa tiết đường cày 1px, 2 luống đầu mở sẵn; icon hạt/mầm thật (x+14,y+28,80,80), tên (x+110,y+15,450,25), trạng thái (x+110,y+46,450,25); tiến độ hoặc điều kiện (x+110,y+76,230,20), action (x+346,y+94,224,34). 
Luống trống ghi “Đất trống”, hạt đang có/cần; trồng theo vị trí/handler thật, không gieo tự động. Đang lớn hiển thị thanh progress (x+110,y+102,220,8) và thời gian từ timer hiện có, không dùng thời gian hiệu ứng để tăng trưởng. Chín ghi “Có thể thu hoạch” + nút thật. Luống khóa ghi “Chưa mở”, không gieo/thu. Mở rộng rect (50,510,1178,104); tài nguyên x230–910, nút (1010,548,204,44) Mở thêm luống. Giữ giá và số lượng gốc; ảnh lần đầu cần wood 3/ore 2/8 linh thạch, đọc theo runtime, tối đa 4 luống. Khi đủ 4 khóa, không tạo luống thứ 5. Không dùng progress giả.

## 4. Giao dịch
Heading (50,164,460,24); 3 nút ×1/×5/×10 (200+i×58,194,52,32), Dẫn đường đến Vạn Bảo Sạp (980,190,248,34). Sạp gỗ là nền header/nẹp 6px, không che số. Danh sách 7 hàng như tram_thon_3: (50,234+i×53,1178,48), V13_ITEMS theo thứ tự gốc. Icon (x+8,y+5,38,38), tên x+54,w230, số có x+294,w120, giá mua x+426,w168, giá bán x+604,w168; mua (x+788,y+7,178,34), bán (x+976,y+7,190,34). Giá và hảo cảm lấy đúng runtime; nhãn giá đơn vị vs tổng tiền theo handler gốc, không suy giá từ ảnh. Nút ghi “Mua 10”/“Bán 10” theo lượng đang chọn; thiếu tài nguyên/không gần sạp khóa ghi lý do. Giao đủ số hoặc không thực hiện; không tự chia thành giao dịch con, không mua/bán tự động. Footer ghi giá phản ánh hảo cảm hiện tại, không thay luật.

## 5. Ủy thác
Heading (50,164,1178,24) BẢNG ỦY THÁC; bảng cáo thị trái (50,200,682,414), chi tiết phải (744,200,484,414). Dùng list cuộn 5 thẻ 76px (x62,y212+i×80,w654,h76), 12 data mới + 3 gốc G3; tên 16, người đăng/mô tả ngắn 14, điều kiện cấp 12; thẻ chọn gold. Cột phải tên (758,214,456,28), desc (758,246,456,88) wrap, mục tiêu/tiến độ (758,342,456,68), thưởng/cấp (758,418,456,48), khu vực action gốc (758,478,456,116), các nút 36px x758..1214. Trạng thái chưa nhận/đang làm/đủ/trả rồi, khóa cấp/vị trí trạm; nhận/trả một lần theo cơ chế thật, giữ giới hạn nhận và reset cũ, không thêm deadline/repeat. DATA.jobs dùng namespace id j01..j12, không đè gather/hunt/ore. Carry đọc đúng item/need; kill đếm yêu thú thường đúng vùng sau nhận (như hunt G3), không tính boss hoặc kill trước. MinLevel không thay cấp vùng; các kill đủ F1. Dẫn đến Bảng Ủy Thác theo handler hiện hữu, không tạo nút truy dấu quái nếu chưa có.

## 6. Nhật ký và 7. Phối phương
Nhật ký: heading (50,164,1178,26), list (50,202,1178,412) hàng 48px gồm ngày/loại/nội dung thật; scroll clip, wrap tối đa 2 dòng rồi tooltip. Không biến nhật ký thành nhiệm vụ hoặc log mới. 
Phối phương: list (50,202,620,412), detail (682,202,546,412), thẻ 70px, icon/name/recipe/điều kiện thật, detail mô tả + input có/cần + nút thật nếu runtime có; không chế tác từ tab này nếu chỉ là sổ tra cứu. Ẩn action không hiện trong renderer; giữ đủ thao tác gốc.

## Dữ liệu và không làm
V13_ITEMS, V13_STATIONS (v13_forge/farm/board/market), V13_JOBS, DATA.jobs, p.stones/p.pills, p.level, p.worldTime; tồn kho, luống, tâm giao dịch/hảo cảm, recipe, log lấy trực tiếp state/handler (chưa có schema save chính xác). F3 là NPC người đăng nội dung, trả tại Bảng Ủy Thác như gốc. Không thêm economy, phím, công thức, thu hoạch, timer, vật phẩm, giá hoặc trạng thái save mới ngoài nối data đã giao.

## V2 — Chu trình nghề nghiệp rõ ràng và QA tích hợp
Mẫu `img/batch03_v2_J.png`: kệ gỗ 3×3, icon thật trong ô 88×88 viền gold .36, mặt kệ ink + paper .07, chữ serif 18 tại x+110,y+9. Số 21px căn phải, zero muted vẫn đọc được; mô tả không đi vào cột số, 176px wrap tối đa 3 dòng. Gờ gỗ 2px ở y+h−5. Không tạo hitbox cho các ô chỉ xem. Giữ icon source, crop trong mẫu không phải asset đưa vào game.
**Bổ sung trạng thái bắt buộc cho §3:** Chu trình `v13Farm(i)` V47.1: trống → gieo (−1 seed) → cần tưới (`wet:false`) → tưới (`wet:true`, `ready=v13Clock()+30` giây) → đang lớn → chín → thu (herb +3, seed +1) → trống. Đã gieo chưa tưới ghi “Cần tưới nước”, nút Tưới, không countdown. Vẽ 5 trạng thái chữ/ấn (mầm, giọt, mầm lớn, cây chín, khóa), không gộp thao tác. Số 30s là chứng cứ baseline, thời gian/sản lượng thực đọc runtime. Ngoài 125px trạm (baseline `v13Near`) hiện Dẫn đường, không tiêu hao.
`v13Craft(id)` và `v13CanCraft`: V47.1 có `mana` herb=1, crystal=1, nhưng G3 bản mới ghi herb=2, crystal=1. **Giữ G3 làm nguồn thiết kế**; Claude kiểm nhánh hiện tại trước tích hợp; không âm thầm sửa cost trong UI. Render giá từ recipe chạy thật sau khi chốt. `v42MatTrade` preflight đủ toàn lượng rồi gọi v13Trade từng đơn vị; giữ cơ chế này, không tự viết loop UI hoặc thêm xác nhận; không chia lẻ khi thiếu tiền/hàng.
`v13JobState` reset theo ngày, `v13JobAction` nhận/trả, `v13JobProgress` theo tồn kho/kill delta, `v13JobGuide` có dẫn: giữ Dẫn việc gốc nếu hợp lệ. Adapter minLevel kiểm tại handler, không chỉ hiển thị khóa. Không thêm hạn mới, không replay thưởng do đổi tab/load cùng ngày. List 15 mục giữ ID khi lọc/chuyển tab; nhận xong không cuộn về đầu. Guide chọn đúng trạm nếu đủ mục tiêu, đúng node/yêu thú nếu đang làm, không target boss cho kill thường.

## Checklist
- [ ] 7 tab/9 linh vật, ba nút trạm; 4 recipe đúng; ở xa khóa, đủ/thiếu vật liệu rõ.
- [ ] 4 luống đúng 2 mở, mở rộng/thời gian/thu hoạch thật; không trừ hạt khi bị khóa.
- [ ] Mua/bán ×1/5/10 đúng giá/hảo cảm/không chia lẻ; kiểm 0 tiền, 0 hàng.
- [ ] 15 ủy thác (3 cũ + 12 mới), 9 vùng kill, đúng NPC/tiến độ/trả; reload không thưởng lặp.
- [ ] Nhật ký, phối phương đủ tác vụ cũ; font ≥12, không cắt, không click xuyên, HiDPI.
