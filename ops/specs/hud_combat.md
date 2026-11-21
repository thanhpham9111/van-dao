# T12 — HUD CHIẾN ĐẤU VÀ GAME FEEL

Dự án: Vạn Đạo Tu Tiên · Canvas 1280×720 · 21/11/2026
Phiên bản 1.3 — nộp REVIEW theo BRIEF cập nhật 13:08, mục 9. T10 v1.2 đã được Claude duyệt DONE; dùng nguyên bố cục đã duyệt làm chuẩn, không sửa T10. Giữ đủ 7 điểm sửa từ hud_combat_review.md và bổ sung bảng đối chiếu tọa độ/kiểm tra chuyển trạng thái.
Tham chiếu định hướng: Warm Snow; Design Bible. Trạng thái: REVIEW (nộp lại). T13 triển khai sau khi T07, T11 và T12 DONE; T11 phụ thuộc T02b, T10, M02 theo bảng việc mới.

## 1. Mục tiêu

- Đọc được HP, MP, hồi chiêu và HP boss trong lúc di chuyển/ra đòn.
- Đòn trúng có cảm giác chắc, đòn mạnh nổi bật; giữ rõ vị trí quái và vùng nguy hiểm.
- Phân biệt đánh thường, kỹ năng, chí mạng, sát thương nhận vào; giữ đủ bảy chức năng trong dock hiện có.
- Không thay đổi cơ chế chiến đấu, cân bằng, phím tắt hoặc lưu game.

## 2. Quy chuẩn và trạng thái HUD

Tọa độ x/y tính từ góc trái trên của Canvas logic 1280×720; là vị trí GỐC trước transform nhóm v35Group theo T10 v1.2 §13. Áp offset/scale/alpha/visibility từ p.v35 đúng một lần rồi scale theo viewport; hitbox/tooltip dùng cùng phép biến đổi. Lề an toàn 24px ở bố cục mặc định. Dùng box()/ornament() hiện có; V18Serif cho tiêu đề, V45Sans cho UI/số liệu, tối thiểu 12px. Không reset p.v35 hoặc tạo nhóm F2 mới.

Palette: ink #100b13 (nền 88%), paper #f1e4cf (chữ/chớp sáng), gold #e3b96f (viền/chí mạng), jade #a8d6c5 (MP/hồi phục), muted #b5a18b (vô hiệu/máu trễ), red #f18474 (HP/nguy hiểm). Không tạo màu UI mới; hiệu ứng dùng alpha.

| Trạng thái | Điều kiện | HUD |
|---|---|---|
| Khám phá | v45CombatHUD() === false | T10 nguyên trạng |
| Chiến đấu | v45CombatHUD() === true | HUD T12; không tự mờ |
| Boss | v45CombatHUD() true, v34Target() trả về boss sống hợp lệ | T12 + thanh boss |
| Chuyển trạng thái | Giá trị v45CombatHUD() thay đổi | Fade UI 200ms; không tạo state combat mới |

Dùng duy nhất v45CombatHUD() có sẵn; hàm đã xét V45_HUB.combat, v42tActive(), v34Target(), V26.action/stage/hits. v45Hub() nhận diện hub/thôn theo logic gốc, không tự viết điều kiện thay thế. Không thêm cửa sổ combat 4.000ms, không dùng V34.lastHit để tự đặt trạng thái. Fade UI 200ms chỉ là trình diễn, không kéo dài trạng thái chiến đấu. Khi chuyển map, chết hoặc tải lại, xóa hiệu ứng/animation tạm cũ. Panel modal, drawer, F2 editor hoặc photo mode ưu tiên theo T10; không nhận input tấn công xuyên panel. Khi F2 đang mở, giữ trình chỉnh HUD v35Open; xem preview nhóm theo cơ chế hiện có, không phát sinh thao tác chiến đấu. Hai đường v47tDraw (thôn) và v35Render(world) (ngoài thôn/bí cảnh) phải dùng cùng điều kiện và nhóm, không vẽ hai HUD trên một frame.

## 3. HUD người chơi (trên trái)

Giữ chân dung, tên, cấp, cảnh giới, chiến lực của T10 v1.2 tại x24–336, y24–94, nhóm identity. Theo spec T10 đã duyệt, T11 phải ẩn hai hàng HP/MP trên trái khi combat true và giữ HP/MP dock gốc đến T13. T13 thực hiện chuyển đổi đồng thời: **CHỈ vẽ thanh dài ở nhóm identity**, bỏ hoàn toàn HP/MP nằm ngay trên v35Dock chiến đấu cũ và hitbox phụ liên quan nếu có. Vùng identity mở rộng tối đa y145; không hiện đồng thời kiểu khám phá T10 y98–134, kiểu T12 và HP/MP dock gốc. Khi người chơi ẩn identity bằng F2, không ép HP/MP hiện ở vị trí khác; tôn trọng cài đặt đã lưu.

| Thành phần | x | y | w | h | Kiểu |
|---|---:|---:|---:|---:|---|
| Nhãn HP + số hiện tại/tối đa | 24 | 98 | 312 | 14 | 12px, trái nhãn/phải số |
| Thanh HP | 24 | 114 | 312 | 7 | red, nền ink |
| Nhãn MP + số hiện tại/tối đa | 24 | 125 | 312 | 14 | 12px, jade |
| Thanh MP | 24 | 141 | 312 | 4 | jade, nền ink |

Tỷ lệ thanh clamp 0–1; max không hợp lệ → thanh rỗng. Số liệu cập nhật ngay; phần HP/MP hiển thị nội suy 120ms, không can thiệp số thật. HP ≤25%: viền HP đỏ nhấp nhẹ chu kỳ 1.200ms; dừng khi HP >25%. Khi nhận sát thương, nhãn HP scale 1.08 rồi về 1 trong 150ms. Không rung HUD.

Nguồn: p.hp, p.mp, currentStats().hp, currentStats().mp; danh tính lấy theo T10.

## 4. Dock chiến đấu đủ 7 ô (dưới giữa)

Nâng cấp v35Dock hiện có (7 ô), không tạo dock combat thứ hai. Nhóm dock: combat ẩn cụm ba nút khám phá T10 x414–866,y638–674, kể cả trạng thái gộp nút Tên điểm [E] x425,y638,w276,h36 + Theo nhiệm vụ. Không để hitbox nút khám phá hoạt động trong combat. Giữ prompt E ngoài thôn chỉ khi điều kiện tương tác gốc cho phép, tại x502,y462,w276,h36 theo T10 §8.2; không đè tooltip skill y512–590. Giữ menu, dock chức năng góc phải, minimap, nhiệm vụ, feed đúng nhóm/tọa độ T10. Vùng dock chiến đấu x421–859,y602–658, tâm x640; 4 ô kỹ năng lớn ở giữa, 3 ô phụ nhỏ hơn hai bên, các đáy y658, khoảng cách 12px. Giữ thứ tự và chức năng gốc:

| Ô | x | y | w | h | Phím thật | Nguồn |
|---|---:|---:|---:|---:|---|---|
| Đánh thường | 421 | 612 | 46 | 46 | LMB (chuột trái) | p.atkCd |
| Kỹ năng i=0 | 479 | 602 | 56 | 56 | RMB (chuột phải) | V11_SKILLS[p.cls][0] |
| Kỹ năng i=1 | 547 | 602 | 56 | 56 | 1 | V11_SKILLS[p.cls][1] |
| Kỹ năng i=2 | 615 | 602 | 56 | 56 | 2 | V11_SKILLS[p.cls][2] |
| Kỹ năng i=3 | 683 | 602 | 56 | 56 | 3 | V11_SKILLS[p.cls][3] |
| Khinh công | 751 | 612 | 46 | 46 | Space | p.dashCd |
| Hồi Xuân Đan | 809 | 612 | 50 | 46 | H | p.pills, heal() |

- Viền gold 1px, bo 6px, nền ink 88%. Icon kỹ năng 44×44px, inset 6px; ô phụ icon 30×30px căn giữa; nếu thiếu ảnh dùng ký hiệu sẵn có và tooltip, không tạo ảnh mới.
- Badge phím thật ở góc trên trái (x+2,y+2,h16), font 12px, rộng theo chữ + 4px, tối thiểu 18px; Space ghi “Space” ở 12px, không cắt nhãn. 4 kỹ năng lấy field key, đối chiếu RMB/1/2/3. Không đổi handler/phím gốc.
- Số hồi chiêu ở tâm ô: 16px đậm, paper, một chữ số thập phân khi còn dưới 10 giây, số nguyên làm tròn lên khi ≥10 giây.
- Vòng hồi chiêu: kỹ năng tâm (x+28,y+28), r22px, stroke 3px; đánh thường/khinh công tâm (x+23,y+23), r17px, stroke 2px; phần cung còn lại clamp remaining/total từ 0–1, bắt đầu 12 giờ theo chiều kim đồng hồ; overlay ink 65%. Không tự giảm cooldown theo timer HUD độc lập. Khi total <=0 hoặc không hợp lệ, không vẽ vòng giả.

Kỹ năng: dữ liệu từ V11_SKILLS[p.cls][i] cho i=0..3, không xóa phần tử thứ 5 (i=4) khỏi dữ liệu hoặc cơ chế khác. Tooltip dùng name, key, cost (MP), cd (giây), desc nếu vừa; v11Levels()[i] = 0 là chưa học; v11Cooldowns()[i] là thời gian còn lại giây, cd là tổng giây. Thi triển qua v11Cast(i) và handler thật; chính hàm này quyết định từ chối khi chưa học, cooldown hoặc thiếu MP.

Ô đánh thường: LMB, remaining p.atkCd, total max(.27, .39/currentStats().rate), đơn vị giây; vòng nhỏ và số 12px khi đang hồi. Giữ handler chuột trái gốc; không phát thêm một lần đánh từ click HUD. Ô khinh công: Space, remaining p.dashCd, total currentStats().dashCd, giây; vòng nhỏ/số 12px, giữ hành vi lướt. Ô Hồi Xuân Đan: badge H, số p.pills tại góc phải dưới (x+2,y+29,w46,h15), căn phải, 12px; nếu 0 thì icon muted 45%, vẫn thấy ô, gọi heal() qua hành vi gốc khi hợp lệ. Không tự tạo cooldown đan dược. T13 giữ linh thạch nhóm nav tại x950,y610, ẩn riêng số đan dược T10 x1108,y610 CHỈ khi ô H đang thực sự hiện số p.pills trong nhóm dock; nếu F2 ẩn dock/opacity 0 hoặc về khám phá, số đan ở nav trở lại nếu nav được phép hiện. Không sửa p.v35 khi đổi combat.

| Trạng thái ô | Hiển thị | Tương tác |
|---|---|---|
| Sẵn sàng | Icon rõ, viền gold | Gọi hành động kỹ năng hiện có |
| Đang hồi | Vòng + số, icon mờ | Không thi triển; phản hồi nhỏ 100ms |
| Thiếu MP | Veil ink 55%, chữ/badge “MP” red | Không thi triển nếu game từ chối |
| Bị khóa/không có kỹ năng | Icon muted 45% hoặc ô rỗng | Không thi triển |
| Thi triển được xác nhận | Viền sáng 160ms, scale 0,94 trong 80ms rồi về 1 trong 100ms | Không kích hoạt thêm lần |
| Hồi chiêu vừa hết | Viền gold sáng 180ms, một lần | Không tự thi triển |

Ưu tiên trạng thái khóa > hồi chiêu > thiếu MP > sẵn sàng. Tooltip mọi ô hover 350ms, không bật khi nhấn giữ tấn công; box 248×78px, y512, x căn giữa ô rồi clamp cạnh trái trong x384–648 (cạnh phải <=896) ở layout gốc; font 13px. Áp transform dock/tooltip theo T10 §13, clamp tooltip vào canvas sau biến đổi; không hiển thị tooltip khi dock bị ẩn. Tên đầy đủ, phím thật, MP/cooldown thật nếu có; H hiển thị số đan còn, đánh thường/khinh công không bịa MP. Tên dài wrap hai dòng, không dùng dấu cắt ở nhãn. Ẩn ngay khi rời ô/đóng HUD. Click chỉ giữ nếu có handler click tương đương hiện hành; không giả lập phím, không gọi action hai lần, không truyền click xuống world khi trúng hitbox HUD.

## 5. Mục tiêu và boss

### Mục tiêu thường được chọn

- Vùng x440,y104,w400,h38, nhóm target, chỉ khi v45CombatHUD() true và v34Target() trả mục tiêu thường sống hợp lệ; dùng kết quả hàm, không viết thuật toán chọn mới. Thông báo v45Location / notify dùng x430,y150,w420,h36 khi target này hiện; nếu không có target trên giữa, dùng y100 theo T10 §4.1. Không thêm toast thứ hai.
- Tên địch TYPES[e.type].name; x440,y104,w400,h18, V18Serif 16px căn giữa; cấp v22EnemyLevel(e), tinh anh e.elite nếu có, font 12px bên cạnh tên, không chồng chữ.
- Thanh HP x460,y128,w360,h6, red; nền ink 85%. Tỷ lệ đúng HP thật; số % không bắt buộc hiển thị ngoài tooltip.
- Ẩn khi mục tiêu chết, mất chọn, chuyển map, hoặc mục tiêu chính là boss có thanh riêng.

### Thanh boss (dưới cùng)

Boss hiện khi v45CombatHUD() true và v34Target() trả e còn sống, bossType(e.type) đúng; thuộc nhóm target, tôn trọng F2 của nhóm này. Tôn trọng fallback boss gần nhất trong 650px của v34Target() khi không có mục tiêu được chọn; không thêm tiêu chí “đã giao chiến” chặn fallback gốc. Khi target đổi, cập nhật tên/HP/pha ngay và reset máu trễ theo HP của target mới; không chuyển vệt trễ sang quái khác. Không đồng thời vẽ thanh mục tiêu thường cho boss; toast có thể dùng y100 vì không có target trên giữa. Không chuyển boss sang một nhóm F2 khác chỉ vì vị trí ở đáy.

| Thành phần | x | y | w | h |
|---|---:|---:|---:|---:|
| Tên boss | 360 | 664 | 322 | 18 |
| Nhãn pha thật | 692 | 664 | 152 | 18 |
| % HP | 854 | 664 | 66 | 18 |
| Khung thanh | 360 | 684 | 560 | 12 |
| Thanh fill bên trong | 362 | 686 | 556 | 8 |

Tên TYPES[e.type].name, V18Serif 16px paper; giảm đến 12px khi dài, tooltip tên đầy đủ, không wrap lên ô kỹ năng. Phần trăm V45Sans 12px, phải; e.hp/e.max clamp 0–1, max không hợp lệ thì thanh rỗng. Nhãn pha lấy v27AI(e).phase: 1 “I”, 2 “II”, 3 “III · Cuồng nộ”, font 13px, căn giữa; I/II gold, III red, fade chuyển pha 160ms chỉ khi giá trị thật đổi. Nếu phase không hợp lệ, ẩn nhãn. Không chia HP thành phân đoạn pha giả, không tự đặt ngưỡng/pha mới. Viền gold 1px. Máu thật red; máu trễ muted, alpha 90%, vẽ phía sau máu thật. Trên mỗi đòn trúng: HP thật cập nhật ngay, máu trễ giữ 220ms rồi giảm về HP thật trong 400ms. Đòn liên tục chỉ giữ tối đa 350ms kể từ lần đầu chưa bắt kịp (tránh thanh trễ treo vô hạn). Khi hồi máu, HP thật cập nhật ngay theo e.hp, vệt trễ bắt kịp trong 120ms, không tạo vệt sát thương giả. Boss chết: hiển thị HP=0 khi bắt đầu fade-out 200ms; không kéo dài state combat. Nếu đổi target, reset cả HP thật/trễ ngay.

Khi thanh boss nhóm target thực sự hiển thị (group visible, alpha >0): ẩn cả nhãn tu vi T10 nhóm dock x414,y676,w452,h14 và thanh x414,y692,w452,h4, tránh chồng hai thanh ở đáy. Khi thanh boss kết thúc fade 200ms hoặc người chơi ẩn target bằng F2, phục hồi tu vi từ p.xp/xpNeed() thực tế nếu dock được phép hiện; không mất XP và không hiện chồng trong fade. Khi combat không có boss, tu vi T10 vẫn hiện dưới ô kỹ năng nếu nhóm dock visible. Boss kết thúc x920, không chồng dock chức năng từ x950 ở layout mặc định. Không reset offset/scale/opacity người chơi.

## 6. Game feel — phản hồi đòn trúng

Chỉ kích hoạt sau khi lệnh hit/damagePlayer hiện có xác nhận một kết quả thật. Đòn đánh hụt không có hit-stop, shake hoặc số sát thương dương. Không tính lại damage hay chí mạng. Mọi thông số dưới đây là thời gian trình diễn, không thay đổi cooldown, AI, hitbox, tốc độ di chuyển hoặc damage.

| Kết quả | Hit-stop trình diễn | Shake camera | Chớp sáng đối tượng | Số bay |
|---|---:|---|---:|---:|
| Đánh thường trúng | 28ms | 1,5px / 90ms | 65ms | 580ms |
| Kỹ năng trúng | 42ms | 3px / 140ms | 80ms | 680ms |
| Chí mạng hoặc kết liễu | 60ms | 5px / 180ms | 100ms | 760ms |
| Người chơi nhận damage | 28ms | 2,5px / 120ms | 65ms | 620ms |

Hit-stop (mới, chỉ trình diễn): ngưng nhịp của sprite ra đòn và sprite bị trúng ở lớp trình diễn tối đa 60ms; logic, thời gian game, input, thanh hồi chiêu vẫn chạy. Không dừng requestAnimationFrame, không dùng sleep, không bù hitbox sau khi kết thúc. Chỉ áp dụng đối tượng đang trên màn hình; nếu đối tượng đổi trạng thái/chết, kết thúc pose freeze sớm. Cooldown hiệu ứng hit-stop toàn màn hình 100ms; nếu nhiều nguồn trúng cùng lúc, lấy mức mạnh nhất, không cộng thời gian. screenShake === false thì không kích hoạt hit-stop; nếu tắt giữa hiệu ứng, giải phóng pose ngay.

Shake: tái sử dụng biến shakes và công tắc screenShake (Cài đặt → Rung màn hình, lưu v42-access); hiện code có đặt shakes=6 khi bị đánh. T13 thay mức rung ở nguồn trình diễn theo bảng, không áp dụng thêm một lớp shake ngoài rung cũ. Dịch lớp thế giới/camera theo offset giảm dần về 0, giới hạn biên độ tổng 5px. Không dịch HUD, camera logic, hướng click, hitbox. Khi screenShake === false, tắt cả rung (offset=0, không kích hoạt shakes, xóa rung đang chạy) và hit-stop; vẫn giữ số bay/flash cục bộ. Bật lại chỉ có tác dụng cho sự kiện mới. Không thêm thiết lập mới.

Chớp sáng: lớp phủ paper #f1e4cf theo diện tích alpha sprite địch/người chơi, opacity tối đa 55%, fade-out theo bảng; không chớp trắng toàn màn hình. Hit liên tiếp trong 100ms gộp thành một flash, tránh nhấp dồn. Không biến quái thành hình chữ nhật trắng. Giữ artwork gốc và silhouette.

## 7. Số sát thương và hiệu ứng điểm va chạm

### Số bay

Tại điểm hit thực tế nếu có; nếu thiếu thì dùng tâm sprite mục tiêu phía trên 24px. Dùng camera transform hiện tại, neo theo tọa độ world của hit, cộng offset màn hình. Sau 0–100ms bật lên 10px (scale 0,85→1,12→1), từ 100ms tới cuối thời lượng trôi lên tổng 36px; fade-out ở 35% thời lượng cuối. Viền/bóng ink 1px để đọc trên nền sáng.

| Loại | Nội dung | Font / màu |
|---|---|---|
| Gây sát thương thường | Số damage thực tế | 16px paper |
| Chí mạng | Số thật + chữ “Bạo kích” | 20px gold; chữ phụ 12px |
| Sát thương người chơi nhận | Dấu trừ + số thật | 17px red |
| Hồi phục thực tế | Dấu cộng + số thật | 15px jade |

Nâng cấp floating(x,y,text,color) và mảng numbers (lifetime hiện tại 0,85s), không tạo hệ số bay thứ hai. Số chiến đấu dùng lifetime theo mục 6; các loại số khác giữ hành vi cũ. hit(e,dmg,crit) dùng amount thực trong hit; damagePlayer(n) dùng d thực (không dùng n thô), không có cờ chí mạng phía người chơi nhận đòn. Chỉ hiển thị hồi phục nếu heal() thực sự làm HP tăng; dùng delta HP thật. Không xuất hiện số dương khi amount/d = 0, không thêm sự kiện khi damagePlayer bỏ qua do p.dashT>0 hoặc p.hurt>0. Không suy bạo kích từ ngưỡng damage, chỉ crit thật của hit. Đòn nhiều mục tiêu tạo số riêng từng mục tiêu; cùng mục tiêu/cùng loại trong 80ms có thể gộp tổng damage thật, không trộn loại. Giới hạn 36 số bay chiến đấu; nếu vượt, gộp mới cùng loại hoặc bỏ số combat cũ nhất, không xóa số phi chiến đấu. Không vẽ trùng cả số cũ và số mới từ cùng một hit. Số bay không che HUD: vẽ dưới lớp HUD, clip vùng chữ nếu đè vào các rect HUD.

### Hiệu ứng va chạm

- Tâm: điểm trúng thật hoặc tâm mục tiêu; đánh thường 16–22px, kỹ năng 24–38px, chí mạng 36–48px. Hướng theo vector tấn công thật nếu có; nếu không dùng hiệu ứng vòng ngắn.
- Vệt kiếm/linh khí: gold hoặc paper alpha tối đa 70%, xuất hiện 0–120ms rồi tan. Tia 4–6 mảnh nhỏ 2–4px, trôi 12–24px, lifetime 160–240ms.
- Thể Tu: ưu tiên xung lực vòng; Kiếm Tu: vệt chém; Pháp Tu: mảnh linh khí. Chỉ biến thể hình ảnh theo p.cls, không suy diễn thuộc tính/ngũ hành mới.
- Dùng effect asset hiện có nếu phù hợp; không tạo ảnh bắt buộc mới trong T12. Không phủ telegraph, hitbox cảnh báo hoặc NPC.
- Giới hạn 64 hạt hiệu ứng va chạm mới cùng lúc; gộp hiệu ứng ở cùng mục tiêu trong 80ms; không tích tụ qua đổi map.

## 8. Thứ tự lớp và chuyển trạng thái

Thế giới → nhân vật/quái với flash cục bộ → hiệu ứng trúng/vệt chém → tín hiệu vùng nguy hiểm hiện có (luôn rõ) → số bay → HUD combat → tooltip → panel modal. Shake chỉ áp dụng các lớp world; HUD giữ cố định. Mọi effect được giải phóng khi hết lifetime; cache hình tĩnh và font, không khởi tạo listener mỗi frame.

Giữ minimap/nhiệm vụ/menu/dock chức năng/feed theo T10 v1.2. Trong thôn, tên vùng cố định; ngoài thôn fade 2.800ms theo owTitle, toast y100/y150 theo target, không di chuyển title theo shake. Không dùng panel đen lớn sau cụm nhân vật. Khi v45CombatHUD() true, hệ số idle=1 (không tự mờ, nhưng alpha vẫn nhân với opacity người dùng lưu p.v35); không ép nhóm ẩn hiện lại. Khi false, chuyển dock/HP/MP sang khám phá trong 200ms, phục hồi cụm hành động theo ngữ cảnh E và p.pills, đều theo F2.

Chuyển giữa hai bộ thành phần cùng vùng (dock khám phá ↔ dock combat, HP/MP khám phá ↔ HP/MP combat): fade nối tiếp, 0–100ms fade bộ cũ về 0, 100–200ms fade bộ mới lên alpha người dùng. Không crossfade hai khung chồng tọa độ. State gameplay và phím cũ chuyển ngay theo v45CombatHUD(), không đợi fade. Vùng UI cũ đang mờ không nhận action; không truyền click qua vùng UI đang hiển thị xuống world. Hitbox bộ mới chỉ hoạt động khi được vẽ và state thật cho phép. TU VI/HP boss và số đan H/nav dùng quy tắc loại trừ mục 4/5 trong toàn bộ fade. Khi đổi mode giữa fade, hủy transition cũ, giữ bộ hiện tại fade về 0 rồi hiện bộ đích, không để hai bộ cùng xuất hiện; tổng thời gian tối đa 200ms. Không kéo dài state combat.

### 8.1. Hai đường vẽ và hợp đồng F2 của T10

Điều kiện bắt đầu T13: T11 DONE và đã chuẩn hóa v47tDraw trong src/48_v48_v47.js cùng v35Render(world) trong src/47_v45_v35.js. T13 giữ cả hai đường tương thích; v35Dock combat dùng một bộ logic; v471Dock/v45HubDock vẫn phụ trách khám phá. Không thêm lớp override mới. Group identity: danh tính và HP/MP T12; group dock: 7 ô combat, prompt tương tác, tu vi; group target: target thường/boss/pha; group nav: chức năng/tài nguyên. Các group map, quest, left, feed giữ như T10. Tất cả dùng v35Group và p.v35 hiện có (tọa độ gốc + transform một lần); khi F2 mở, preview chỉnh vị trí/scale/opacity/ẩn theo cơ chế hiện hành, không cast, không dùng fade để ghi đè opacity saved. Toast và tên vùng dùng v45Location gốc, giữ anchor màn hình, không đưa vào nhóm mới. Hiệu ứng combat ngoài HUD không bị biến đổi bởi nhóm; screenShake chỉ rung world.

### 8.2. Bảng khóa tọa độ với T10 v1.2 đã DONE

Tất cả là rect gốc (x,y,w,h), không phải tọa độ sau F2. Mọi thành phần giữ nguyên vị trí T10 nếu không có chỉ định thay thế trong T12.

| Vùng | T10 v1.2 | T12 combat | Quy tắc tránh chồng |
|---|---|---|---|
| Identity | (24,24,312,112) | (24,24,312,121), HP/MP y98–145 | Chỉ 1 kiểu HP/MP; dock chiến đấu không có HP/MP nữa |
| Title | (384,24,512,66) tính cả đường trang trí y88 | Giữ | Thôn cố định, ngoài thôn fade |
| Target thường | Nhóm target hiện có | (440,104,400,38) | Không vẽ cùng boss |
| Toast | (430,100,420,36) hoặc (430,150,420,36) | Giữ | y150 khi target trên giữa thực sự hiện; y100 nếu không, kể cả boss dưới đáy |
| Minimap / quest | (1024,24,232,124) / (1024,160,232,132–180) | Giữ | Không mở rộng vào khu trung tâm |
| Feed / menu | (24,544,300,86) / (24,646,46,46) | Giữ | Feed kết thúc y630, cách menu 16px |
| E trong thôn/hub | (425,638,276,36) khi gần POI | Ẩn cùng dock khám phá | Không thay thế kỹ năng trong combat |
| E ngoài thôn | (502,552,276,36) | (502,462,276,36), nếu tương tác gốc cho phép | Cách tooltip skill y512 tối thiểu 14px |
| Tooltip skill | Không có | (x clamp 384–648,512,248,78) | Kết thúc y590, trước dock y602 |
| Dock trung tâm | (414,638,452,36) | (421,602,438,56) đủ 7 ô | Loại trừ nhau, fade nối tiếp 200ms |
| Tu vi | (414,676,452,14) + (414,692,452,4) | Giữ nếu boss không hiển thị | Ẩn khi thanh boss hiển thị, không mất p.xp |
| Boss | Không có | (360,664,560,32) | Cách skill y658 là 6px; đáy y696; không đè nav x950 |
| Tài nguyên / nav | (950,610,306,28) / (950,646,306,46) | Giữ | Ẩn riêng đan ở nav nếu H đang hiện số; linh thạch giữ nguyên |

Hai cụm trung tâm và tu vi/boss là vùng loại trừ theo trạng thái; các vùng còn lại không giao nhau trong bố cục gốc. Bố cục do người chơi kéo/scale qua F2 vẫn dùng transform/clamp sẵn có, không ép reset. Khi Claude/Muse kiểm T13, đối chiếu bảng này với T10 v1.2 trước khi sửa bất kỳ tọa độ nào.

## 9. Mapping dữ liệu code thật — theo review Claude

| Nhu cầu | Tên thật (Claude xác nhận trong hud_combat_review.md) | Quy tắc |
|---|---|---|
| Combat/hub | v45CombatHUD(), v45Hub() | Giữ logic gốc, fade 200ms |
| Hai đường HUD/T10 | v47tDraw (thôn), v35Render(world) (ngoài); v471Dock, v45HubDock, v35Dock | Không xóa combat gốc trước T13; tích hợp cả hai đường |
| Tùy chỉnh HUD | v35Group, v35Open, p.v35 | F2 giữ nguyên, nhóm identity/dock/target/nav như T10 |
| Vùng, thông báo, feed | v45Location(hub,target), owTitle, notify/v21Notice, v35Feed, v34State().feed | Title cố định thôn; toast tránh target; feed giữ 3 dòng/7s |
| Dấu thời gian trúng | V34.lastHit, elapsed | Giây, không tạo timer combat mới |
| Người chơi | p.hp, p.mp, currentStats().hp/.mp, p.cls, p.xp, xpNeed(), realm(), p.mapId | HP/MP duy nhất; T10 |
| Dữ liệu 4 kỹ năng | V11_SKILLS[p.cls][i], i=0..3 (dữ liệu có 5) | name, desc, lv, cost, cd, kind, color, key; cost MP, cd giây |
| Khóa / cooldown / cast | v11Levels()[i], v11Cooldowns()[i], v11Cast(i) | 0 chưa học; cooldown còn lại giây; RMB/1/2/3 |
| Đánh thường | p.atkCd, max(.27, .39/currentStats().rate) | LMB; còn lại/tổng giây |
| Khinh công | p.dashCd, currentStats().dashCd | Space; còn lại/tổng giây |
| Hồi Xuân Đan | p.pills, heal() | H; số đan thật |
| Mục tiêu | v34Target(), V23.target/V34.target | Fallback boss gần nhất trong 650px theo hàm gốc |
| Quái/boss | e.hp, e.max, TYPES[e.type].name, v22EnemyLevel(e), e.elite, bossType(e.type) | Không suy ra từ tên/hình |
| Pha boss | v27AI(e).phase | 1–3, 3 Cuồng nộ |
| Gây damage | hit(e,dmg,crit), amount trong hit | Chỉ amount thực; crit thật |
| Nhận damage | damagePlayer(n), d trong hàm | Chỉ d thật, không cờ crit; p.dashT/p.hurt có thể bỏ qua đòn |
| Số bay | floating(x,y,text,color), numbers | Nâng cấp hệ có sẵn, giữ số khác |
| Shake | shakes, screenShake, v42-access | false tắt cả rung và hit-stop |
| Hit-stop | Chưa có | Chỉ thêm lớp trình diễn, không đổi logic |
| Điểm tích hợp hiệu ứng | hit/damagePlayer/renderEffects sau T07 | Chèn một lần tại điểm đã xác nhận kết quả |

Các tên trên được Claude đối chiếu với code, không phải API tự đặt. T07 cần xác nhận/ghi rõ vị trí hook một lần trong hit/damagePlayer/renderEffects, ID/định danh đối tượng tồn tại, điểm neo world và cách phân biệt nguồn đánh thường/kỹ năng từ action thực (V26.action/stage/hits hoặc dữ liệu hiện hành). Nếu chưa xác định được loại đòn, dùng hiệu ứng mức đánh thường, không suy từ số damage. Không bịa flag mới, xử lý một kết quả thật đúng một lần; không sửa schema T14 hay save.

### 9.1. Đối chiếu 7 điểm review BRIEF mục 9

| Điểm | Yêu cầu Claude | Vị trí giải quyết trong spec |
|---|---|---|
| 1 | Không mất 3 ô phụ của dock 7 ô | §4: LMB, 4 kỹ năng, Space, H; nguồn và tọa độ đầy đủ |
| 2 | Không vẽ HP/MP hai lần, khớp T10 | §3, §8.2: T11 giữ HP/MP dock cũ; T13 chuyển duy nhất lên identity |
| 3 | Chỉ v45CombatHUD(), fade 200ms | §2, §8: không timer combat 4 giây, fade chỉ trình diễn |
| 4 | Phím RMB/1/2/3 | §4, §9: V11_SKILLS, v11Levels, v11Cooldowns, v11Cast đúng nguồn |
| 5 | Pha boss thật | §5: v27AI(e).phase 1–3, III Cuồng nộ; không phân đoạn HP giả |
| 6 | Không có sự kiện né/chặn | §6–7, §11: bỏ trạng thái/số bay né/chặn; dashT/hurt bỏ qua đòn không phát hiệu ứng |
| 7 | screenShake false tắt rung và hit-stop | §6: vô hiệu cả hai ngay khi tắt, không đổi logic, giữ số bay/flash |

T10 v1.2 đã DONE theo BRIEF 13:08. Bảy điểm trên đã được giải quyết trong tài liệu, chờ Claude xác nhận, không tự đổi T12 DONE.

## 10. Kịch bản kiểm thử T13

1. Thôn an toàn (v47tDraw): HUD T10 đúng, title cố định, không xuất hiện ô combat; đến gần NPC có nút E gộp và Theo nhiệm vụ; ra khỏi điểm khôi phục 2 ô đầu. Ngoài thôn (v35Render), title fade và prompt E theo T10.
2. Sân luyện/đánh quái: v45CombatHUD() true thì 7 ô combat thay đúng cụm khám phá; HP/MP duy nhất trên trái; đủ LMB, RMB/1/2/3, Space, H; không mất đánh thường/lướt/đan.
3. Dùng kỹ năng rồi chờ hồi; thử đánh thường và Space, uống đan H/no pills: vòng/số cooldown đồng bộ cơ chế thật, đúng phím, không double cast; kiểm cả ba phái.
4. Đánh hụt, trúng, crit và nhận damage: amount/d thật; không có số dương hoặc chữ trạng thái khi đòn bị bỏ qua bởi dashT/hurt. Tắt Rung màn hình trong cài đặt: cả shake lẫn hit-stop dừng, số bay vẫn đúng.
5. Boss mất máu liên tiếp: máu thật cập nhật ngay; vệt trễ không treo; nhãn I/II/III · Cuồng nộ theo v27AI(e).phase, không có phase giả; chuyển target hoặc hết trận reset vệt, hồi tu vi, không đè ô skill.
6. Đánh đông quái 30 giây: không tích tụ số bay/hạt, HUD không rung, telegraph vẫn rõ. So FPS và Console với baseline M02.
7. Mở/đóng panel, F2, bật photo mode, chuyển map, chết, tải lại: không có HUD/hiệu ứng cũ còn tồn tại, không xuyên input. F2 chỉnh/ẩn identity, dock, target, nav ở khám phá/combat, load lại giữ p.v35; khi ẩn target không mất tu vi, khi ẩn dock không mất số đan ở nav đang hiện. Thử notify cùng target thường/boss, kiểm y100/y150; prompt E combat không chồng tooltip.
8. Chạy tại 1280×720, 1366×768, 1920×1080; xác nhận scale/hitbox khớp, không chồng/cắt nhãn.

Chạy bộ test_suite.py M01 trước/sau T13; dùng baseline FPS M02 (đo trước T11 theo BRIEF mới). Nếu M06/M07 đã DONE, chạy thêm kịch bản chiến đấu 9–12 và save compatibility; nếu chưa, kiểm thủ công các tiêu chí tương đương từ mục 10/12, không biến M06/M07 thành gate T13 mới. Đặc biệt chụp ảnh sau chuyển cảnh và UI fade đã kết thúc theo M04; không đánh dấu lỗi hình do đang fade. T12 chỉ nộp spec, không khẳng định đã chạy game.

## 11. Không làm

- Không viết/sửa code game trong T12. Không thay damage formula, tốc độ đánh, cooldown, AI, cấp quái, phím hiện có hoặc save.
- Không thêm công pháp, trạng thái nguyên tố, boss/phase mới, NPC hoặc vật phẩm.
- Không xây sự kiện né/chặn, không hiển thị chữ “Né tránh”/“Đỡ đòn” vì game không có sự kiện; không sửa damagePlayer chỉ để sinh sự kiện này.
- Không tạo timer combat hoặc setting giảm hiệu ứng riêng; bao gồm không xóa ba ô phụ của dock gốc.
- Không thiết kế lại bản đồ, HUD khám phá T10, menu, túi đồ hoặc soundtrack.
- Không đổi F2, reset p.v35, tạo nhóm HUD mới, đổi logic tương tác E hay cơ chế notify/owTitle/v35Feed.
- Không giả lập thông tin hồi chiêu hoặc damage khi dữ liệu game không có.

## 12. Checklist nghiệm thu

- [ ] HUD combat theo đúng v45CombatHUD(), fade 200ms, khôi phục T10; không timer combat mới, không chồng/cắt chữ.
- [ ] Cả v47tDraw và v35Render dùng cùng bố cục/hành vi thích hợp; không có hai HUD cùng frame; prompt E/thông báo/feed đúng T10 v1.2.
- [ ] F2 bảo toàn nhóm, offset, scale, opacity, visibility và p.v35; không click xuyên, không cast trong editor; idle=1 không ép opacity người chơi. Tắt target/dock bằng F2 không làm mất thông tin tu vi/đan đang được phép hiện trong nhóm còn lại.
- [ ] HP/MP dài mảnh duy nhất trên trái, không vẽ trùng ở dock, dữ liệu đúng, cảnh báo HP thấp dễ đọc.
- [ ] Đủ 7 ô: LMB, RMB/1/2/3, Space, H; bốn kỹ năng lớn, ba ô phụ nhỏ, không mất action/phím; khóa/thiếu MP/hồi chiêu rõ.
- [ ] Vòng cooldown và số khớp thời gian thật; thi triển một lần cho một input hợp lệ.
- [ ] Thanh boss có máu thật/máu trễ và pha thật I/II/III · Cuồng nộ; không chồng ô kỹ năng/tu vi; tu vi trở lại đúng giá trị.
- [ ] Đánh thường, skill, chí mạng, đòn nhận vào có phản hồi phân cấp; đòn hụt không vẽ damage dương.
- [ ] Hit-stop trình diễn không làm chậm logic/cooldown; shake không dịch HUD/hitbox; screenShake === false tắt cả hai ngay.
- [ ] Flash chỉ trên sprite, không strobe toàn màn; số bay đọc được và không che vùng cảnh báo.
- [ ] Hiệu ứng nhiều quái được giới hạn; không leak listener/hạt/timer, không lỗi Console.
- [ ] Chuyển map, chết, load, modal và photo mode sạch state; kiểm thử đủ ba độ phân giải.
- [ ] Không thay đổi chỉ số, battle outcome, save cũ; đạt mục tiêu 60 FPS hoặc không giảm đáng kể so baseline đã đo.
- [ ] Đối chiếu đủ bảy góp ý review; Claude xác nhận ánh xạ mục 9 và vị trí tích hợp sau T07 trước khi Muse triển khai T13.
- [ ] Đối chiếu bảng khóa tọa độ §8.2 với T10 v1.2 đã DONE; trong fade 200ms không xuất hiện hai bộ dock/HP/MP cùng lúc; phím gameplay vẫn đúng và không click xuyên vùng UI đang mờ.
