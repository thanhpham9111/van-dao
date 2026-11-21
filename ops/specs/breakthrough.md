# T38 — Cửu Tiêu Thiên Kiếp v1.3

21/11/2026 · B7 Gói 02 · F11, T12 v1.3, T21. Nâng trình diễn, **không đổi luật V30**. Kích hoạt bằng B khi cấp 9/18/27/36, đầy tu vi, ở thế giới mở và `v30TrialStart` chấp nhận. Không kích hoạt từ menu/nhà, không thay đột phá gốc hoặc xác suất. Tên map Cửu Tiêu Lôi Đài, phụ đề “Thiên kiếp đột phá · tránh vùng sét”.

## 1. Hợp đồng số liệu F11

`rank = floor(cấp/9)`, `waves = rank+2`. Đợt target tròn quanh người chơi bán kính 135+9×rank; line dải ngang rộng 54+6×rank; ring vòng quanh tâm sân (bán kính/bề dày lấy hình học V30 thật, không suy thêm). Báo trước max(0,85;1,55−0,11×rank) giây. Chuỗi dạng và vị trí do V30 chọn, không đặt lại bằng VFX. Bảng để QA (logical/world geometry giữ nguyên):

| Cấp → cảnh giới | rank | Đợt | Target bán kính | Line rộng | Báo trước |
|---|---:|---:|---:|---:|---:|
| 9 → Trúc Cơ | 1 | 3 | 144 | 60 | 1440ms |
| 18 → Kim Đan | 2 | 4 | 153 | 66 | 1330ms |
| 27 → Nguyên Anh | 3 | 5 | 162 | 72 | 1220ms |
| 36 → Hóa Thần | 4 | 6 | 171 | 78 | 1110ms |

Thắng: lên cấp, XP=0, nhận tinh hoa theo handler. Thua: quay lại thế giới, tăng p.breakFails theo handler. Không sửa HP/damage/telegraph hitbox, miễn thương, thời gian interval, số lần thử, vật phẩm, save, stat, cooldown, logic thắng/thua.

## 2. Trình diễn mở đầu

Sau khi B được chấp nhận, và chuyển vào arena thành công, chạy cut-in **1800ms tối đa** (0–250 mây tụ, 250–1400 giữ lời, 1400–1800 tan). Nếu có hook trước khi bắt đầu đếm đợt, trình diễn trước khi V30 khởi tạo timer, không thêm đợt/không tiêu thời gian báo trước. Nếu V30 đã bắt đầu timer khi đổi map, chạy cut-in dạng overlay song song, không pause/đảo timer, thu gọn/ẩn ngay khi telegraph thật xuất hiện. Không chặn điều khiển/né. Space/Esc bỏ lớp trình diễn: chỉ consume khi cut-in thật sự ở hook pre-timer và phím không thuộc thao tác gameplay/modal đang chạy. Nếu timer V30 đã chạy, không consume phím; ẩn overlay ngay rồi chuyển event cho handler gốc, không chặn né/thoát gốc. Không tạo hành vi thoát trial mới. B lặp không tạo arena thứ hai. Mỗi trial instance một lần; retry hợp lệ có thể hiện mới. Dedupe intro/kết quả theo instance và outcome đã commit; thắng/thua lấy từ handler thật, không suy từ timer, HP hoặc frame render. Khi chuyển cảnh/abort xóa toàn bộ overlay và callback cũ.

| Thành phần | Rect | Vẽ / thời gian |
|---|---|---|
| Mây kiếp | 0,0,1280,340 | ink #100b13 .28, paper #f1e4cf .08 trên mép mây; cache haze, co opacity 250ms, tan 400ms, không tối vùng HP |
| Nét mực đầu | 368,202,544,108 | ink .68 nhòe cạnh; fade 180ms, không tương tác |
| Tên cảnh | 390,211,500,34 | V18Serif 28 gold #e3b96f, căn giữa, stroke ink 2px |
| Lời dẫn | 390,251,500,40 | V45Sans 16 paper, 2 dòng, 18px line height |
| Bỏ qua | 490,296,300,20 | V45Sans 12 muted #b5a18b “Space / Esc · Bỏ qua” chỉ pre-timer khi không xung đột; overlay song song không hiện nhắc phím, tự ẩn khi người chơi điều khiển hoặc telegraph bắt đầu |

| Lên cảnh giới | Lời mở đầu (≤70) | Lời chúc Thanh Thạch khi thắng (≤70) |
|---|---|---|
| Trúc Cơ | Linh khí hội tụ, xin tiểu hữu lấy tâm vững làm nền đạo. | Căn cơ đã vững. Tiểu hữu hãy giữ tâm như buổi đầu học đạo. |
| Kim Đan | Hàn hỏa cùng quy, một niệm kết đan giữa tiếng lôi. | Kim Đan đã thành. Đừng để ánh vàng che mất đạo tâm. |
| Nguyên Anh | Tâm thần vượt vỏ cũ, đừng để sợ hãi lấn nhịp thở. | Nguyên Anh khai sáng. Hãy để hiểu biết dẫn đường, không phải kiêu tâm. |
| Hóa Thần | Trời đất thử lòng người; giữ một niệm sáng qua thiên lôi. | Hóa Thần rồi. Vạn đạo rộng lớn, lòng người vẫn cần khiêm nhường. |

Không gọi NPC thật vào arena; lời chúc là lời kể của Trưởng lão, không tạo p.v12Talk mới. Nếu modal/transition khác, ẩn cut-in; HUD HP/MP T12 toàn vẹn, toast y100/150 vẫn dùng cũ. Không chồng boss intro T33; thiên kiếp ưu tiên.

## 3. Telegraph ba dạng

Dữ liệu vùng nguy hiểm V30 thật (target center, line endpoints, ring center/radius/thickness, timer) là nguồn chuẩn. Vẽ camera/world transform thật, không lấy tâm màn hình thay tâm arena. Tỷ lệ thời gian còn lại t=clamp(remaining/warnDuration,0..1), chỉ thay màu/alpha, không đổi geometry. Vẽ cả viền và hoa văn để phân biệt qua màu: target vòng tròn + dấu tâm; line hai cạnh song song + nét chéo thưa; ring viền trong/ngoài + chấm mực, giữa ring rỗng đúng vùng an toàn thật (không tô toàn bộ đĩa). Không dùng đỏ phủ cả màn.

| Pha báo trước (thời gian còn) | Fill | Stroke | Hành vi |
|---|---|---|---|
| >50% | red #f18474 .15 | red .65 2px | viền ổn định, chỉ dấu thời gian ở rìa |
| >20% đến ≤50% | red .24 | red .85 3px | pulse 360ms ±.06, hoa văn alpha .28 |
| 0% đến ≤20%, warning còn active | red .34 | paper .90 3px + red | pulse 360ms ±.08, giữ viền sáng ổn định, không chớp toàn màn |
| Impact thật (ưu tiên hơn mọi tỷ lệ timer) | paper .40 tối đa 80ms trong vùng; red fade | − | sét đi xuống trong vùng thật, không khởi damage từ animation; còn active mà timer=0 giữ viền cuối cho đến event impact/hủy thật |

Không kéo warnDuration theo FPS; lấy đồng hồ V30, clamp, frame tụt vẫn khớp hit. Nếu renderer V30 có hazard có sẵn thì thay style cùng shape, không duplicate telegraph. Khi đợt kết thúc, tắt fill/viền theo event thật, tia sét 120ms rồi khói coin nhỏ 180ms chỉ VFX (không tồn dư hitbox). Không tăng hit-stop, rung màn chỉ T12 existing, không áp vào HUD. Thanh đợt tại (430,194,420,28) khi cut-in ẩn, nền ink .62 viền gold .4, nhãn V45Sans 14 paper “Thiên kiếp · Đợt x/y” lấy chỉ số thật, progress small (440,218,400,3) chỉ nếu runtime có remaining; nếu chưa rõ index 0/1 thì xác minh, không đoán. Không đè toast, position y194; nếu telegraph giao rect thanh đợt/progress, ẩn toàn thanh ngay, không chỉ giảm nền. Đếm lượt, không hiện "đã thắng" khi chưa có handler thắng.

## 4. Thăng cấp và thất bại

Chỉ sau handler thắng thật, dùng cảnh giới mới từ realm()/p.level. Vòng sáng quanh chân actor thật, rad 24→112px trong 560ms, gold .55→0; 12 hạt paper/gold ≤4px trong 600ms; chỉ trên VFX world, không hồi HP, không thay collision. Nếu handler đã teleport, dùng vị trí nhân vật sau chuyển cảnh; không vẽ ở map cũ. Thư pháp “TRÚC CƠ / KIM ĐAN / NGUYÊN ANH / HÓA THẦN” từ bảng cấp mới, (360,226,560,58), V18Serif 42 gold có stroke ink 3px; nền ink .55 (344,212,592,124), lời chúc (376,295,528,36) V45Sans 16 paper. 220ms fade/hold 1680ms/out 300ms = 2200ms; ≤3s, input vẫn chạy. Không flash toàn màn, không thêm thưởng. Nếu toast level gốc đang hiện, giữ toast ở y100/150, không duplicate thông báo cấp trong cùng vùng. Khi chuyển vùng/đăng nhập, không replay hiệu ứng đã hoàn thành.

Thua sau handler thật: (392,214,496,94), title “Thiên kiếp chưa qua” V18Serif 22 muted; hai câu 14px paper/red, tối đa 70 ký tự từng câu:

- Đạo tâm còn đó, một lần thất bại chưa phải tận đường.
- Nhìn dấu báo sét, giữ lối thoát và dùng Shift đúng lúc.

Fade 160/1500/220ms, chỉ tại cảnh quay lại đã ổn định, không khóa input. Không ghi p.breakFails lần hai, không bắt buộc hồi HP hoặc trừ thêm. Trước khi chuyển cảnh nếu chưa có chỗ phù hợp, đưa lời vào notify hiện hữu sau load. Không xử lỗi B không hợp lệ bằng cảnh thua.

## 5. Phát triển khả năng học và đọc thiên kiếp

### 5.1. Trước khi vào thiên kiếp

Khi chọn nhiệm vụ khóa cấp tại Q (T32) hoặc xem tu vi C (T36), nếu cấp đúng 9/18/27/36 và p.xp đạt xpNeed(), dùng hướng dẫn duy nhất “Đầy tu vi · B ở thế giới mở để đột phá”. Ở C chỉ hiện ở tooltip chủ động của thanh XP (54,552,240,36), dùng w260,h60, clamp vào khung và không che nút thuộc tính; ở Q dùng vùng gợi ý (520,438,690,42). Font 13–14 V45Sans, gold #e3b96f / paper #f1e4cf, hover 300ms, tắt khi đổi mục. Không thay điều kiện handler, không đưa B thành click action, không auto mở arena; nếu ở trong nhà/modal, nói “Ra thế giới mở trước khi nhấn B” chỉ khi cảnh thật xác định được. Chưa đủ XP ghi số runtime thay vì hiện hướng dẫn nhấn B.

### 5.2. Trong thiên kiếp

Nếu V30 báo mã dạng nguy hiểm thực, thanh đợt §3 có thể thay nhãn bằng “Đợt x/y · Vùng tròn / Dải ngang / Vòng sét” tùy shape thật, vẫn trong (430,194,420,28). Không hiển thị shape kỳ tiếp theo, không tạo số countdown ngoài timer thật. Nếu quá dài, giữ nhãn “Đợt x/y” và không cắt chữ. Độ dài mini-progress tỷ lệ remaining/warnDur đúng runtime; không hứa vùng an toàn cố định. Khi telegraph giao rect, ẩn cả thanh. Mẹo chuẩn bị trước trận (không hiện đè trên chiến đấu):

| Dạng | Gợi ý |
|---|---|
| target | Rời vùng tròn đã báo; vị trí tâm lấy từ dấu thật. |
| line | Ra khỏi hai cạnh dải ngang theo khoảng trống thực tế. |
| ring | Tránh dải giữa viền trong và viền ngoài; đọc vùng rỗng thật. |

Ở 30fps hoặc khi frame rơi, vẫn dùng remaining của V30; không chuyển warning thành animation thứ hai. Khi low graphics, giữ viền/hình dạng, chỉ bỏ hạt/mây. Viền tối/sáng tương phản trên nền sáng/tối; không yêu cầu phân biệt riêng màu đỏ.

### 5.3. Sau thất bại và quay lại

Hai câu thất bại §4 giữ nguyên (≤70 ký tự), không thêm penalty, không auto retry. Nếu người chơi chủ động mở Q/C và hiện vẫn đủ điều kiện đột phá, dùng gợi ý chuẩn bị §5.1; nếu chưa đủ thì theo trạng thái thật. Không hiển thị “B thử ngay” trong arena khi chưa rời, hoặc “né thất bại do ring” khi không có dữ liệu nguyên nhân thực. Nếu p.breakFails được renderer gốc dùng, giữ số thực của game; không tự tăng lần hai, không suy bonus hoặc miễn sát thương từ đó. Luồng thử lại giữ dụng cụ, XP và trạng thái theo handler V30.

## 6. Layer / dữ liệu / Không làm

Thế giới nền → grade T21 một pass → mây/haze VFX → presentation slot (ẩn toàn bộ nếu telegraph giao rect) → telegraph và actor combat đúng thứ tự renderer V30 (viền luôn đọc được) → tia sét/vầng sáng → HUD T10/T12 và notify → modal. Các rect UI 1280×720 không nhân DPR, tông C; không tint HUD/HP. Cache gradient/text mask, ≤12 hạt, low graphics chỉ giảm hạt/mây, không giảm viền dấu cảnh báo. Dữ liệu `v30TrialStart`, rank/wave/shape/remaining handler V30, p.level/p.xp/xpNeed(), realm(), p.breakFails, currentStats, arena camera. Nếu không biết tên field nội bộ, Claude xác nhận, không đặt field save mới. Không code game.

## 7. Checklist nghiệm thu

- [ ] Test cấp 9/18/27/36 đầy XP trong open world; đúng 3/4/5/6 đợt, 144/153/162/171px target, line 60/66/72/78px, warn 1440/1330/1220/1110ms; ring theo V30 thật.
- [ ] B không đủ điều kiện không mở cut-in; intro ≤1800ms bỏ bằng Space/Esc, không tự tạo hành vi thoát trial, không nuốt phím gameplay khi timer chạy; điều khiển vẫn hoạt động.
- [ ] 3 shape nổi rõ ở ngày/đêm, không che HP/MP T12; thử 30/60FPS và HiDPI, hit khớp shape, không nháy full screen.
- [ ] Thắng tăng cấp, XP=0/tinh hoa theo flow gốc một lần; effect 2200ms, đúng 4 lời chúc, thua tăng breakFails một lần và 2 câu gợi ý.
- [ ] Save/load, retry, chết, chuyển cảnh, modal/F2: không treo layer/cut-in; không thay gameplay hoặc hotkey ngoài skip đang diễn.
- [ ] Q/C chỉ gợi ý B khi đủ điều kiện, không tạo nút mới; nhãn 3 shape lấy mã thật, bỏ khi thiếu hook hoặc giao telegraph. Thất bại và thử lại không tạo thêm XP/thưởng/penalty.
