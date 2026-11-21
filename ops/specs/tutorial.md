# T53 — Lời nhắc tân thủ theo ngữ cảnh, v2.0

B7 · 21/11/2026 · REVIEW · DATA.tutorial, G5, F6/F12, T10/T12/T33.

## Mục tiêu
Một lời nhắc nhẹ kiểu Warm Snow, không tutorial modal, không giữ chân. Main 0–7 vẫn nguyên; lời nhắc bổ trợ chứ không cấp thưởng, không tự nhận nhiệm vụ hay bắt bấm.

## Thành phần và vị trí
Rect logic 1280×720. Thẻ duy nhất (430,350,420,82), không hitbox, icon 28×28 (440,360), nhãn “Gợi ý” (476,358,362,18) V18Serif 16 gold #e3b96f; text (476,380,362,42) V45Sans 14 paper #f1e4cf, 2 dòng 18px; nếu có key, badge (784,356,54,24) V45Sans 12 gold, nhãn Gợi ý thu w300, đủ “Space”. Nếu text dài wrap tối đa 2 dòng, giảm 12px nếu font thật cần; nếu vẫn dài mở 3 dòng 14px trong 42px. Nền ink #100b13 alpha .86, viền gold .55 1px, phụ muted #b5a18b; ưu tiên 1 có chấm red #f18474, không flashing; jade #a8d6c5 cho nhãn phím tốt. Dùng box T36; no tint T21.

T10 toast (430,100/150,420,36), T12 mục tiêu y104–142, T33 thẻ boss khoảng y202–318, E prompt combat (502,462,276,36)/khám phá y552, tooltips y512–590, dock y602+, thanh boss y664: rect lời nhắc y350–432 cách mọi vùng mặc định. Kiểm actual rect sau transform F2; không ghi tọa độ vào p.v35 hoặc thêm nhóm. Nếu rect giao HUD, tooltip, telegraph, nhân vật/địch gần ngay trung tâm, prompt, thẻ boss hay hiệu ứng cảnh báo, thử ứng viên thứ 2 (430,196,420,82) CHỈ khi không có thẻ boss/toast/target thực; nếu cả hai không trống, hoãn, không đè. Khi thẻ T33 xuất hiện, hoãn hint toàn bộ dù rect tách; ưu tiên telegraph/đòn. Nếu chưa có rect runtime tin cậy, hoãn lúc boss/combat mạnh thay vì đoán. Vị trí cố định lúc hiện; không nhảy qua lại giữa frame. 

Mở 160ms alpha 0→1, giữ 3680ms, ra 160ms (4000ms tổng thời gian nhìn thấy). Được tắt, bị chặn thì ẩn ngay, không ảnh hưởng movement/action/keypress. Cooldown tối thiểu 8000ms từ lúc **kết thúc/ẩn** thẻ trước tới bắt đầu thẻ kế; đồng hồ UI chỉ đếm lúc gameplay hợp lệ, không chạy khi pause. Không kéo dài state combat. Text không bị camera shake.

## Trigger và nối dữ liệu
Mỗi id 1 lần/nhân vật (18/18 trigger). Nhận từ event/state thật, không dò text hoặc đếm mỗi frame thành lời nhắc mới.
| Trigger | Cạnh phát sinh, dữ liệu/điều kiện |
|---|---|
| firstEnemyNear | yêu thú sống/địch thường đầu tiên hợp lệ trong 300px (khoảng cách thế giới), ngoài khu an toàn |
| lowHp | p.hp/currentStats().hp <0,35, HP >0; nếu hết đan vẫn gợi lùi, không tự dùng H |
| firstLoot | handler thêm trang bị vào túi thành công lần đầu; không nhầm nguyên liệu |
| skillPoint | v11SkillPoints()>0 và p.level≥2 |
| nearNpc | lần đầu vào phạm vi tương tác thật NPC, dùng điều kiện E gốc |
| firstNight | chuyển sang trạng thái đêm đầu theo T21/worldTime; không lấy giờ máy |
| nearGate | lần đầu gần cổng ra vùng theo phạm vi tương tác thật, không tự qua |
| breakReady | p.level ∈9/18/27/36, p.xp≥xpNeed(), thế giới mở và điều kiện B thật |
| firstMaterial | handler nhận nguyên liệu V13_ITEMS lần đầu, không tính linh thạch/đan |
| firstDeath | sau khi hồi sinh và gameplay ổn định, không hiển thị trên màn chết |
| firstKyNgo | lần đầu thấy điểm kỳ ngộ daily hợp lệ trong vùng khám phá, gồm story |
| sectReady | cấp ≥2, chưa thuộc tông; không giả đủ 10 linh thạch |
| bagFull | bag count ≥44/48 từ renderer thật; không tự xóa/bán |
| firstBossNear | boss vùng sống vào phạm vi đe dọa thực; nếu thiếu hook dùng fallback boss gần 650px theo T12 v34Target() |
| forgeReady | p.stones≥20 và không cường hoá món nào lần nào (dựa cờ lịch sử thật, xem câu hỏi mở) |
| petReady | lần đầu đạt/đã cấp ≥5 và linh thú đầu có thể xem/mở; không tự mở |
| newRegion | sự kiện lần đầu khám phá vùng ngoài thôn, p.discovered thay đổi; một lần tổng |
| idle60 | 60 giây game đứng yên ngoài thôn, reset khi di chuyển/chuyển map/chết; không tích lúc pause |

## Hàng đợi, lưu và tắt
Đề xuất cờ mở rộng save riêng theo id (Claude chốt namespace tương thích; không ghi đè p.v35/quest/state cũ): map seen, pending chỉ bộ nhớ UI, tắt/bật từ cài đặt hiện tại. Nếu save cũ thiếu cờ, khởi tạo rỗng; không retro-fire event một lần đã qua (loot/death/night/newRegion), state ngưỡng chỉ khởi tạo pending nếu đang thật sự cần. Trigger được đánh dấu seen sau khi đủ 1000ms thực hiển thị; nếu bị che trước, trả pending với cùng id, không đánh dấu; nếu từng đủ 1000ms, không replay. Chỉ save seen qua handler save thật, không save từng frame. Xoá queue lúc đổi nhân vật, load map/chết (trừ firstDeath sau hồi sinh); state hiện hành có thể phát lại nếu chưa seen. Event qua map không đem nhắc lỗi ngữ cảnh.
Hàng đợi tối đa 18 id unique; priority 1 trước 2 trước 3; bằng nhau FIFO theo event time, rồi thứ tự file. Khi nhiều đồng thời, đưa tất cả hợp lệ vào queue, pop ứng viên còn đúng ngữ cảnh; lowHp/bagFull/breakReady/nearEnemy/nearGate/nearNpc/boss hết điều kiện thì hủy pending chưa thấy để lần tới có thể phát; sự kiện firstLoot/material/ngày đêm hết ngữ cảnh (đổi vùng/load) bỏ, main đã dạy và tương tác hoàn tất có thể hủy nếu không còn hữu ích. Không preempt một thẻ đang hiện bằng thẻ khác (trừ mất an toàn: ẩn); priority cao được chọn ở lượt kế. 1 thẻ/màn hình; >=8 giây nghỉ sau thẻ. Trong combat chỉ gợi ý liên quan nếu cả telegraph/HUD an toàn; hoãn nếu intro/defeat/pha T33 hiện. 
Ẩn ngay khi mở modal/drawer/F2, thoại, menu/pause, cutscene/chuyển vùng/loading/thiên kiếp, death screen; không nhận click, không ngăn nút H/Space. Ẩn khi Y “Tắt hướng dẫn” bật. Thêm setting được phép tại tab Hiển thị & âm thanh của Y: hành động toggle rect (42,576,556,36) nếu slot trống sau layout thật, nếu không ghép vào cuối list bên trái và dùng scroll T36 (không đè Mở trình chỉnh HUD F2); label 14px paper, BẬT/TẮT 12/14, mặc định chưa tắt; không ảnh hưởng tooltip/quest. Khi tắt, clear pending/chặn trigger; khi bật lại chỉ nhắc id chưa seen và điều kiện thật. Setting lưu theo cơ chế Y, không reset seen. 

## Dữ liệu và không làm
DATA.tutorial.hints, p.hp, currentStats().hp, p.level, p.xp/xpNeed(), v11SkillPoints(), p.discovered, p.stones, G5, F12; các hook inventory/boss/event/đêm/vị trí/forge/settings phải dùng tên thật do Claude xác nhận. Badge key chỉ nhãn, không nhận input; phím Space/H/I/T/E/M/B/J/O/N/P đúng F12. Không đổi hệ kỹ năng/quest/rule, không pause, không thêm hotkey, overlay không nhận input; nếu thiếu hook forge lịch sử thì chỉ bật sau khi có nguồn chính xác, không suy từ món hiện tại +0.

## V2 — Acceptance theo thời gian và mức độ ưu tiên
Không hiển thị tutorial khi modal đang mở; mở T/N/J/P/O/L/E tương tự benchmark. Nếu firstBossNear, lowHp cùng tick: priority 1, FIFO; không gắn khóa Space vào cả hai nếu có thể gây hiểu nhầm. Badge chỉ phím trong lời nhắc, không phải nút. Dấu “!” gold không nhấp nháy; pulse 160ms vào/ra như trên, tắt chuyển động chỉ giữ alpha, không thay 4s/8s.
Kịch bản cần chạy sau tích hợp: t=0 phát 3 trigger; firstEnemyNear bị che trước 1000ms → chưa seen; t=1200 mở modal → ẩn ngay; sau khi đóng chờ ≥8000ms hợp lệ rồi chọn pending đúng ngữ cảnh, không trả lại trigger đã seen. Reload trong fade không đưa state cũ vào nhân vật khác. Đặt ngưỡng 35% HP: 34,99% mới trigger, 35% không; kiểm hết đan không kích H tự động. Không có binding DATA.tutorial trong V47.1, chưa test thực thi mới, phải nghiệm thu sau Claude nối hook.

## Checklist
- [ ] 18 trigger lần đầu, đủ/thiếu điều kiện; sát mốc 35%, 300px, 44/48, cấp 5, 20 linh thạch, 60s.
- [ ] 3 trigger cùng frame: priority rồi FIFO, chỉ 1 thẻ, ≥8 giây sau khi ẩn; tắt/bật không replay seen.
- [ ] Lưu/tải/đổi nhân vật; main 0–7 không đổi; save cũ không lỗi và không tràn lời nhắc.
- [ ] HUD T10/T12 ở mặc định và F2 tùy chỉnh; boss T33/telegraph, toast, prompt E, modal không chồng; không mất input/chuyển động.
- [ ] 1280/1366/1920, chữ ≥12, badge Space, DPI 2; tắt hướng dẫn không ảnh hưởng frame/quest.
