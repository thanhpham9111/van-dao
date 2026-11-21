# T51 — Sơn Hà Ký (O) & Phong Vân · Giang hồ sống (L), v2.0

B5 · 21/11/2026 · REVIEW · G1/G4/G5, phim_O.png/phim_L.png.

## Mục tiêu và quy chuẩn
O là sổ du ký mở hai trang trên giấy nâu; L là bảng cáo thị giang hồ. Chỉ đổi UI v42world/jiang14, giữ đủ tab/action, không đổi luật thời gian, danh vọng, giao chiến hoặc dịch chuyển.
Rect 1280×720. Cả hai khung T36 (24,24,1232,672), ornament()/box(), ink #100b13 .92, paper #f1e4cf .04 vân, gold #e3b96f .68, jade #a8d6c5, muted #b5a18b, red #f18474. O tăng vân paper trong vùng trang lên .13, sống giấy gold .22; L gỗ ink + red .07 viền 8px. Chữ trên nền giấy tối vẫn paper; không thêm bảng màu, không dùng giấy sáng toàn màn. V18Serif 28 tiêu đề, 20 tên, 16 mục; V45Sans 14 thân/16 số/12 min. Hover 100ms gold .10, chọn gold 2px .14, khóa ink .45 + chữ, thiếu tài nguyên red + số, nhấn 80ms, tab 140ms, mở 180ms/đóng 120ms, tooltip 300/100ms; reuse T36 tab/scroll/box; no tint T21.

## 1. Sơn Hà Ký · O
| Khối | Rect | Nội dung |
|---|---|---|
| Title/phụ đề | 42,36,570,34 / 42,72,570,20 | SƠN HÀ KÝ · Sổ khám phá · Kỳ ngộ · Linh đài · Danh vọng |
| Vạn Linh Phổ | 674,42,214,38 | Nút “Vạn Linh Phổ · F3” có trong ảnh, giữ handler gốc |
| Ngày/tiền | 900,42,250,38 | p.worldTime/day và p.stones |
| X | 1170,42,52,38 | đóng gốc |
| 4 tab | 38+i×301,104,293,40 | Kỳ ngộ · Linh đài · Thành tựu · Nhật ký |
| Trang trái | 38,156,380,476 | 10 vùng / danh sách |
| Gáy sổ | 420,162,12,464 | 2 đường gold alpha .22, bóng ink .22, không hitbox |
| Trang phải | 436,156,806,476 | chi tiết |
| Footer | 38,646,1204,38 | O/Esc và câu làm mới theo ngày |

Không thêm phím F3: ảnh có nút, F12 không liệt kê; giữ đúng đường click và phím thật nếu Claude xác nhận (không xung đột). Không áp phím F3 mới. Ngày 1 = 360 giây chơi, đếm theo state gốc chứ không đồng hồ UI. 

### Kỳ ngộ
Heading trái (50,168,356,22); dòng vùng (50,200+i×41,356,38), i0..9 thon,truc,yeu,tram,tuyet,hoa,phong,quy,ma,loi đúng thứ tự F1. Ấn 18×18; tên và cấp 14/12, thứ tự căn phải; chưa khám phá chỉ “Vùng chưa khám phá” + cấp và ấn muted, không leak địa danh hoặc story. Đã khám phá lấy tên V22_REG; chọn viền gold. 
Trang phải: tên vùng (452,168,520,36) 24px; danh vọng (986,174,240,24) 13px; loại (452,218,774,20), tên (452,244,774,34) serif 22, trạng thái/ngày (452,284,774,22); mô tả (452,312,774,56), reward (452,378,774,72), điều kiện (452,456,774,40); Dẫn đường tới kỳ ngộ (452,508,310,42), Theo dõi kỳ ngộ (774,508,260,42). Dưới (452,558,774,52) trạng thái/nhật ký gốc nếu có. 
| Loại | Hiện |
|---|---|
| shrine | Cổ trận thất truyền; chọn đúng hệ trong 3 lần, không tạo action ngoài điểm tương tác |
| hunt | Yêu khí dị động; tiến độ 3 yêu thú |
| supply | Tiếp tế lữ nhân; vật phẩm cần thật |
| story | Tên DATA.events; một dòng mô tả ngắn từ teaser/đoạn mở thực, chữ wrap tới 2 dòng trong rect nếu dài, nút “Dẫn đường tới kỳ ngộ”; không hiện trước lựa chọn/hậu quả |
Reward cho story theo state/choice thật; nếu chưa biết ghi “Phần thưởng tùy cơ duyên”, không cộng giá trị mọi lựa chọn. Điểm hợp nhất G4: 1 kỳ ngộ/vùng đã khám phá/ngày, 4 loại, không thêm dấu ?, slot riêng hay sự kiện thứ hai. Chưa tới điểm, đã hoàn thành/hết ngày/không có điểm: chỉ trạng thái và action hợp lệ; Theo dõi giữ toggle gốc, dẫn đường tới đúng instance hiện tại, không tự kích hoạt. Đổi ngày cập nhật selection theo vùng và event id mới, bỏ đường cũ theo logic thật; không reset thưởng khi đổi tab/reload.

### Linh đài
Trái giữ 10 vùng, nhãn đã mở/chưa mở từ stones thật, không lộ vùng chưa khám phá. Phải bố cục tên (452,168,774,36), ảnh vùng thực nếu đã mở (452,218,774,212) crop cover hoặc paper vân, chi tiết/trạng thái/chi phí gốc (452,442,774,64), nút dịch chuyển/dẫn đường đúng renderer (452,516,774,42) chia 2 nếu có hai hành động. Không đổi điều kiện trạm, phí hay khóa trong combat.

### Thành tựu
Trái list (50,200,356,410), thẻ 52px, gap 4, scroll (x398,w8), 6 cũ + 30 DATA.milestones sau review; thứ tự gốc rồi file order, tên wrap 2 dòng, nhãn “Đã nhận/Đủ/Chưa đủ”. Phải tên (452,168,774,36), desc (452,218,774,50), tiến độ (452,278,774,50) current/need và bar 8px, thưởng (452,340,774,70), danh hiệu (452,422,774,42) chỉ hiện có và mở khi đạt theo handler, nút nhận (452,496,310,40) nếu có trong cơ chế gốc. Đừng tự thêm nút nhận nếu thưởng tự động; ghi trạng thái thật. Danh hiệu hiển thị trước mắt chỉ trong thẻ; không gắn vào HUD/custom tên khi Claude chưa duyệt. Đếm 14 mã G5; counter có thể giảm (stones/techs/relics), không tước thưởng đã nhận. Không đổi 6 milestone cũ, không trả hai lần hoặc tự nhận bằng UI.

### Nhật ký
Trái nhóm ngày/loại gốc (50,200,356,410), phải list (452,200,774,410) row 64px, ngày/tên/mô tả, wrap hoặc scroll; nếu renderer không phân nhóm thì trái là danh sách bản ghi, phải chi tiết. Không tạo log/điều kiện lọc mới hoặc xóa lịch sử.

## 2. Phong Vân · Giang hồ sống · L
| Khối | Rect | Nội dung |
|---|---|---|
| Header | 42,36,1040,34 / 42,72,1040,20 | số tu sĩ/giao chiến/cơ duyên/tông thật |
| X | 1170,42,52,38 | đóng |
| Tab | 38+i×301,104,293,40 | Tu sĩ giang hồ · Tông môn · Sự kiện · Thiên cơ ký |
| Bảng cáo thị | 38,156,504,476 | 8 tu sĩ/trang, 32 tổng |
| Thẻ tu sĩ | 554,156,688,476 | tình trạng, portrait, tìm |
| Footer | 38,646,1204,38 | L/Esc theo handler, không thêm hotkey |

Tu sĩ giang hồ: 8 hàng (50,170+i×49,480,45), tên 16 serif ở x+10,y+4,w342; cảnh giới/vùng 12 ở x+10,y+25,w342, nhãn “Du hành”/state thật x+360,w110; wrap nếu tên dài (giảm tối thiểu 12, tooltip đầy đủ). Không lộ NPC/vùng bị ẩn theo luật game. Pagination (50,580,480,34) Trước x50 w110, Sau x420 w110, count giữa; 1/4 khi 32; disabled ở biên. Chọn theo ID thực, không đổi do sort; nếu tu sĩ mất, clear selection.
Chi tiết: portrait (1068,174,156,208) 3:4 từ B8 chỉ khi id là NPC chính khớp F3, clip/căn đáy; nếu không, sprite đang dùng trong ảnh kiểu Sở Lăng, không gán sai chân dung. Tên (570,174,486,34), cảnh giới/tông/tính cách (570,212,486,28), hành động (570,248,486,36), tu vi label/bar (570,292,486,20)/(570,316,486,10), HP (570,338,486,20)/(570,362,486,10); tài nguyên (570,400,654,36), đột phá/thắng/hảo cảm (570,442,654,32), đối địch (570,478,654,52), Tìm tu sĩ (570,554,274,42). Mọi thông số đọc trực tiếp tu sĩ đang chọn, không lấy p.player; tỷ lệ clamp, max không hợp lệ rỗng; tìm đúng vị trí hiện tại, không tạo nút teleport. Nếu ID không còn hợp lệ, khóa tìm.
Ba tab còn lại giữ khung trái/phải; Tông môn list tông thật + chi tiết; Sự kiện list theo event thật + chi tiết; Thiên cơ ký list bản ghi + chi tiết; row 64px scroll trong (50,170,480,398), action tại (570,554,654,42) theo renderer hiện có, không tạo chức năng mới. 

## Dữ liệu/không làm
V22_REG, state Sơn Hà Ký G4/G5, V42_MILESTONES, DATA.events, DATA.milestones, p.discovered, p.stones, p.worldTime, tu sĩ/tông/sự kiện state thật của jiang14; không đoán tên biến. QUALITY_COL nếu có phẩm thật. Không đổi nhiệm vụ, phần thưởng, logic daily, danh vọng, mở vùng, waypoint, AI hoặc phím. Click/scroll/modal không xuyên world, giữ pause cũ. 

## V2 — Du ký và cáo thị là hai vật thể khác nhau
Mẫu `img/batch03_v2_O.png`/`img/batch03_v2_L.png`, art tĩnh; O giấy nâu ấm, hai mép gấp 1px + gáy 2 nét; L bảng gỗ sẫm, hàng cáo thị 45px mạch kim loại, khung hồ sơ 3:4. O nhãn vùng số căn phải fixed 24px, tên chưa lộ, ấn chưa khám phá muted. Kỳ ngộ đọc theo vùng → loại → tên → ngày → mục tiêu → thưởng → cách tiếp cận; hai CTA phân cấp (dẫn đường gold, theo dõi secondary). Story chỉ teaser, không spoil. Vùng đã khám phá có minh họa 218×138 tại (1004,221), clip cover/viền gold 1px; tên/mô tả chỉ dùng w536 khi có ảnh, nếu tràn thì ẩn ảnh và trả w774 (ưu tiên chữ). Vùng ẩn không hiện ảnh/tooltip chứa tên.
L mỗi row tên 16 serif, tình trạng 12 cột riêng; không biến thành thẻ giống N. Sprite/portrait trong 156×208 nền ink .6, nẹp gold .36, đúng id. Mẫu Sở Lăng dùng sprite gốc, không gán ảnh NPC chính. HP/tu vi có số thật, “—” nếu max không hợp lệ, không tô 100% khi không biết. Tìm tu sĩ dưới trái, không để ảnh che hitbox; selection giữ id khi AI cập nhật và mất selection an toàn nếu tu sĩ biến mất.
V47.1 O mở `v42world`, L mở `jiang14`; Esc đóng. `v42wState()` dùng p.v42world.{stones,events,rep,history,milestones,total,tracked}; `v42wRewardMilestone(k)` kiểm d.count(s), need, cờ s.milestones[k], cộng đá/XP và save. 14 count codes mới là chuỗi, không append trực tiếp vào mảng vốn kỳ vọng count(s) hàm; Claude phải map 14 mã sang getter tin cậy, bất hợp lệ không thưởng. Giữ 6 mốc gốc và cờ claim; chưa có adapter trong benchmark, chưa test milestone mới.
Test sau tích hợp: 36 mốc (chưa đủ/đủ/đã nhận), 14 counter; giảm stones sau claim vẫn giữ cờ. 10 vùng chưa mở, đổi ngày giữa theo dõi, story chỉ tương tác tại điểm. L trang 1↔4, selection khi sort/tu sĩ đổi vị trí. So sánh save trước/sau chỉ xem: không tự complete hay đổi tài nguyên.

## Checklist
- [ ] O 4 tab, 10 vùng đúng thứ tự/khóa, F3 nút gốc, ngày 360s, không leak tên.
- [ ] 4 loại kỳ ngộ, story 1 slot daily, đường dẫn/theo dõi đúng, không tương tác từ xa.
- [ ] Linh đài thật; 36 milestone, không thưởng lặp; nhật ký giữ nguyên.
- [ ] L 4 tab, 32/8 mỗi trang, 4 trang, prev/next, đúng portrait/nút tìm.
- [ ] Không cắt chữ, trạng thái chữ+màu, T36 animation, thử 1280/1366/1920 và modal mở/đóng liên tục.
