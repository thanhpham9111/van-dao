# T12 — HUD CHIẾN ĐẤU VÀ GAME FEEL

Dự án: Vạn Đạo Tu Tiên · Canvas 1280×720 · 21/11/2026
Tham chiếu định hướng: Warm Snow; đồng bộ T10 và Design Bible.
Trạng thái: REVIEW. T13 triển khai sau khi T07, T11 và T12 DONE.

## 1. Mục tiêu

- Đọc được HP, MP, hồi chiêu và HP boss trong lúc di chuyển/ra đòn.
- Đòn trúng có cảm giác chắc, đòn mạnh nổi bật; giữ rõ vị trí quái và vùng nguy hiểm.
- Phân biệt đánh thường, kỹ năng, chí mạng, sát thương nhận vào và phòng thủ nếu game đã hỗ trợ.
- Không thay đổi cơ chế chiến đấu, cân bằng, phím tắt hoặc lưu game.

## 2. Quy chuẩn và trạng thái HUD

Tọa độ x/y tính từ góc trái trên của Canvas logic 1280×720; scale theo viewport, hitbox dùng cùng phép biến đổi. Lề an toàn 24px. Dùng box()/ornament() hiện có; V18Serif cho tiêu đề, V45Sans cho số liệu, tối thiểu 12px.

Palette: ink #100b13 (nền 88%), paper #f1e4cf (chữ/chớp sáng), gold #e3b96f (viền/chí mạng), jade #a8d6c5 (MP/hồi phục), muted #b5a18b (vô hiệu/máu trễ), red #f18474 (HP/nguy hiểm). Không tạo màu UI mới; hiệu ứng dùng alpha.

| Trạng thái | Điều kiện | HUD |
|---|---|---|
| Khám phá | Không có combat đang hoạt động | T10 nguyên trạng |
| Chiến đấu | Game xác nhận đánh hoặc bị đánh, hoặc vào trận đang hoạt động | HUD T12; không tự mờ |
| Boss | Đang giao chiến với boss hợp lệ còn sống | T12 + thanh boss |
| Kết thúc | Trận kết thúc theo state hiện có | Giữ phản hồi kết liễu 400ms, fade HUD về khám phá 200ms |

Ưu tiên state combat có sẵn. Nếu không có cờ ở thế giới mở, chỉ dùng cửa sổ hiển thị 4.000ms kể từ lần đánh/bị đánh hợp lệ gần nhất; không dùng timer này để thay đổi AI, trạng thái trận hay hồi chiêu. Trận boss/chế độ arena đang diễn ra không tự thoát HUD do timer. Khi chuyển map, chết hoặc tải lại, xóa state hiển thị tạm và hiệu ứng cũ. Panel modal hoặc photo mode ưu tiên theo T10; không nhận input tấn công xuyên panel.

## 3. HUD người chơi (trên trái)

Giữ chân dung, tên, cấp, cảnh giới, chiến lực của T10 tại x24–336, y24–94. Thay hai hàng HP/MP của T10 trong combat bằng thanh dài, mảnh:

| Thành phần | x | y | w | h | Kiểu |
|---|---:|---:|---:|---:|---|
| Nhãn HP + số hiện tại/tối đa | 24 | 98 | 312 | 14 | 12px, trái nhãn/phải số |
| Thanh HP | 24 | 114 | 312 | 7 | red, nền ink |
| Nhãn MP + số hiện tại/tối đa | 24 | 125 | 312 | 14 | 12px, jade |
| Thanh MP | 24 | 141 | 312 | 4 | jade, nền ink |

Tỷ lệ thanh clamp 0–1; max không hợp lệ → thanh rỗng. Số liệu cập nhật ngay; phần HP/MP hiển thị nội suy 120ms, không can thiệp số thật. HP ≤25%: viền HP đỏ nhấp nhẹ chu kỳ 1.200ms; dừng khi HP >25%. Khi nhận sát thương, nhãn HP scale 1.08 rồi về 1 trong 150ms. Không rung HUD.

Nguồn: p.hp, p.mp, currentStats().hp, currentStats().mp; danh tính lấy theo T10.

## 4. Kỹ năng (dưới giữa)

Combat ẩn cụm ba nút hành động T10; giữ menu, dock, minimap, nhiệm vụ ở đúng vị trí T10. Thiết kế 4 ô 56×56px, cách 10px, y602, tâm toàn cụm x640. Tọa độ:

| Ô | x | y | w | h |
|---|---:|---:|---:|---:|
| 1 | 513 | 602 | 56 | 56 |
| 2 | 579 | 602 | 56 | 56 |
| 3 | 645 | 602 | 56 | 56 |
| 4 | 711 | 602 | 56 | 56 |

- Viền gold 1px, bo 6px, nền ink 88%. Icon kỹ năng 44×44px, inset 6px; nếu thiếu ảnh dùng ký hiệu sẵn có và tooltip, không tạo ảnh mới.
- Badge phím thật ở góc trên trái (x+2,y+2,w18,h16), font 12px; tuyệt đối không gán cứng 1–4 nếu phím hiện có khác.
- Số hồi chiêu ở tâm ô: 16px đậm, paper, một chữ số thập phân khi còn dưới 10 giây, số nguyên làm tròn lên khi ≥10 giây.
- Vòng hồi chiêu: tâm (x+28,y+28), bán kính 22px, stroke 3px; phần cung còn lại = remaining/total, từ 12 giờ theo chiều kim đồng hồ; overlay ink 65% khi hồi chiêu. Không tự giảm cooldown theo timer HUD độc lập.

| Trạng thái ô | Hiển thị | Tương tác |
|---|---|---|
| Sẵn sàng | Icon rõ, viền gold | Gọi hành động kỹ năng hiện có |
| Đang hồi | Vòng + số, icon mờ | Không thi triển; phản hồi nhỏ 100ms |
| Thiếu MP | Veil ink 55%, chữ/badge “MP” red | Không thi triển nếu game từ chối |
| Bị khóa/không có kỹ năng | Icon muted 45% hoặc ô rỗng | Không thi triển |
| Thi triển được xác nhận | Viền sáng 160ms, scale 0,94 trong 80ms rồi về 1 trong 100ms | Không kích hoạt thêm lần |
| Hồi chiêu vừa hết | Viền gold sáng 180ms, một lần | Không tự thi triển |

Ưu tiên trạng thái khóa > hồi chiêu > thiếu MP > sẵn sàng. Tooltip khi hover 350ms, không bật trong lúc nhấn giữ tấn công; size 248×78px, y512, x căn giữa ô và clamp trong vùng x384–896; font 13px, chứa tên đầy đủ, phím, MP cost và cooldown thật nếu có. Ẩn ngay khi rời ô/đóng HUD. Nếu tên dài, wrap hai dòng. Giữ đúng input hiện có; click chỉ được dùng nếu hệ thống hiện hành có hành động tương đương và không phát input xuống bản đồ.

## 5. Mục tiêu và boss

### Mục tiêu thường được chọn

- Vùng x440,y104,w400,h38, chỉ khi có mục tiêu địch sống hợp lệ đang chọn; không chọn tự động mục tiêu mới.
- Tên địch x440,y104,w400,h18, V18Serif 16px căn giữa; cấp (nếu có) font 12px bên cạnh tên, không chồng chữ.
- Thanh HP x460,y128,w360,h6, red; nền ink 85%. Tỷ lệ đúng HP thật; số % không bắt buộc hiển thị ngoài tooltip.
- Ẩn khi mục tiêu chết, mất chọn, chuyển map, hoặc mục tiêu chính là boss có thanh riêng.

### Thanh boss (dưới cùng)

Boss hiện khi state trận/đối tượng đang giao chiến xác nhận boss, còn sống. Không dùng boss gần đó nhưng chưa giao chiến. Nếu nhiều boss, hiện boss đang được chọn hợp lệ; nếu không có lựa chọn, giữ boss chính của trận, không đổi mỗi frame.

| Thành phần | x | y | w | h |
|---|---:|---:|---:|---:|
| Tên boss + % HP | 360 | 664 | 560 | 18 |
| Khung thanh | 360 | 684 | 560 | 12 |
| Thanh fill bên trong | 362 | 686 | 556 | 8 |

Tên V18Serif 16px, paper; phần trăm V45Sans 12px, căn phải; nếu tên dài dùng vùng tên w480 và tự wrap lên trên chỉ khi không chồng ô kỹ năng — phương án mặc định giảm tên xuống 13px, tooltip tên đầy đủ. Viền gold 1px. Máu thật red; máu trễ muted, alpha 90%, vẽ phía sau máu thật. Trên mỗi đòn trúng: HP thật cập nhật ngay, máu trễ giữ 220ms rồi giảm về HP thật trong 400ms. Đòn liên tục chỉ giữ tối đa 350ms kể từ lần đầu chưa bắt kịp (tránh thanh trễ treo vô hạn). Khi hồi máu, cả hai thanh cập nhật theo HP mới trong 120ms; không tạo vệt sát thương giả. Thanh giảm về 0 khi boss chết, giữ 400ms rồi fade-out 200ms. Không thêm phân đoạn/phase giả.

Khi hiện boss: ẩn thanh tu vi T10 (cùng vùng đáy). Khi hết boss, phục hồi thanh tu vi từ p.xp/xpNeed() thực tế, không mất XP. Khi combat không có boss, thanh tu vi T10 vẫn hiện dưới các ô kỹ năng. Không chồng lên dock x950 trở đi.

## 6. Game feel — phản hồi đòn trúng

Chỉ kích hoạt sau khi lệnh hit/damagePlayer hiện có xác nhận một kết quả thật. Đòn đánh hụt không có hit-stop, shake hoặc số sát thương dương. Không tính lại damage hay chí mạng. Mọi thông số dưới đây là thời gian trình diễn, không thay đổi cooldown, AI, hitbox, tốc độ di chuyển hoặc damage.

| Kết quả | Hit-stop trình diễn | Shake camera | Chớp sáng đối tượng | Số bay |
|---|---:|---|---:|---:|
| Đánh thường trúng | 28ms | 1,5px / 90ms | 65ms | 580ms |
| Kỹ năng trúng | 42ms | 3px / 140ms | 80ms | 680ms |
| Chí mạng hoặc kết liễu | 60ms | 5px / 180ms | 100ms | 760ms |
| Người chơi nhận damage | 28ms | 2,5px / 120ms | 65ms | 620ms |
| Chặn/né nếu có | 0ms | 0px | 0ms | 500ms |

Hit-stop: ngưng nhịp của sprite ra đòn và sprite bị trúng ở lớp trình diễn tối đa 60ms; logic, thời gian game, input, thanh hồi chiêu vẫn chạy. Không dừng requestAnimationFrame, không dùng sleep, không bù hitbox sau khi kết thúc. Chỉ áp dụng đối tượng đang trên màn hình; nếu đối tượng đổi trạng thái/chết, kết thúc pose freeze sớm. Cooldown hiệu ứng hit-stop toàn màn hình 100ms; nếu nhiều nguồn trúng cùng lúc, lấy mức mạnh nhất, không cộng thời gian.

Shake: dịch lớp thế giới/camera theo offset giảm dần về 0 trong thời lượng bảng, giới hạn biên độ tổng 5px. Không dịch Canvas HUD, không đổi camera logic, hướng click hay tọa độ va chạm. Nếu game đã có thiết lập giảm hiệu ứng, tôn trọng thiết lập đó: tắt shake/hit-stop visual khi giảm tối đa. Không thêm thiết lập mới trong T13.

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
| Né/chặn | “Né tránh” / “Đỡ đòn” nếu kết quả thật | 13px muted |

Không xuất hiện số giả khi damage=0; chỉ ghi “Né tránh”/“Đỡ đòn” nếu game trả sự kiện tương ứng. Không suy ra bạo kích từ ngưỡng damage. Đòn nhiều mục tiêu tạo số riêng từng mục tiêu; cùng mục tiêu, cùng loại, trong 80ms có thể gộp tổng damage thật, không trộn chí mạng/nhận damage/hồi phục. Tối đa 36 số bay; nếu vượt, gộp mới cùng loại hoặc bỏ số cũ nhất. Số bay không che HUD: clip ở vùng thế giới bên dưới HUD, không kéo số vào HUD.

### Hiệu ứng va chạm

- Tâm: điểm trúng thật hoặc tâm mục tiêu; đánh thường 16–22px, kỹ năng 24–38px, chí mạng 36–48px. Hướng theo vector tấn công thật nếu có; nếu không dùng hiệu ứng vòng ngắn.
- Vệt kiếm/linh khí: gold hoặc paper alpha tối đa 70%, xuất hiện 0–120ms rồi tan. Tia 4–6 mảnh nhỏ 2–4px, trôi 12–24px, lifetime 160–240ms.
- Thể Tu: ưu tiên xung lực vòng; Kiếm Tu: vệt chém; Pháp Tu: mảnh linh khí. Chỉ biến thể hình ảnh theo p.cls, không suy diễn thuộc tính/ngũ hành mới.
- Dùng effect asset hiện có nếu phù hợp; không tạo ảnh bắt buộc mới trong T12. Không phủ telegraph, hitbox cảnh báo hoặc NPC.
- Giới hạn 64 hạt hiệu ứng va chạm mới cùng lúc; gộp hiệu ứng ở cùng mục tiêu trong 80ms; không tích tụ qua đổi map.

## 8. Thứ tự lớp và chuyển trạng thái

Thế giới → nhân vật/quái với flash cục bộ → hiệu ứng trúng/vệt chém → tín hiệu vùng nguy hiểm hiện có (luôn rõ) → số bay → HUD combat → tooltip → panel modal. Shake chỉ áp dụng các lớp world; HUD giữ cố định. Mọi effect được giải phóng khi hết lifetime; cache hình tĩnh và font, không khởi tạo listener mỗi frame.

Giữ minimap/nhiệm vụ/menu/dock theo T10; không tự mờ HUD khi combat. Nhãn khu vực chỉ hiện đúng chuyển map T10. Không dùng panel đen lớn sau cụm nhân vật. Khi không còn chiến đấu, hủy overlay cooldown và thanh boss; khôi phục các nút hành động T10 sau transition 200ms. Trong 200ms chuyển tiếp, chỉ một bộ hitbox hành động/skill được kích hoạt, không chồng nhau.

## 9. Dữ liệu cần Claude đối chiếu trước khi T12 DONE

| Nhu cầu | Nguồn biết chắc/theo BRIEF | Claude cần xác nhận trong code |
|---|---|---|
| Người chơi | p.hp, p.mp, currentStats().hp/mp, p.cls, p.xp, xpNeed(), realm(), p.mapId | Đơn vị và state chiến đấu hiện hành |
| Bốn kỹ năng | Hệ kỹ năng hiện có | Danh sách slot thực tế, icon, phím, cost, cooldown remaining/total, hành động được phép |
| Địch/boss | Đối tượng quái/trận hiện có | Tên field HP/max, flag boss, target chọn, vị trí hit, trạng thái sống/chết |
| Kết quả trúng | hit / damagePlayer sau T07 | Damage cuối, critical/né/chặn/heal flag nếu có, source, target, loại đòn, ID sự kiện để không vẽ hai lần |
| Effect và camera | renderEffects sau T07 | Điểm neo, camera transform, vị trí chèn hiệu ứng, dấu hiệu modal/photo/reduced effects nếu có |

Tên field chưa rõ là yêu cầu mapping, không phải tên biến được phép tự đặt vào hệ thống game. Claude ghi tên thật trong handoff T07/T11 hoặc bổ sung spec khi review. Nếu chưa có metadata tương ứng, bỏ hiển thị phụ thay vì tạo giá trị giả. Không sửa schema T14 hay save để phục vụ T12.

## 10. Kịch bản kiểm thử T13

1. Thôn an toàn: HUD T10 đúng, không xuất hiện ô combat.
2. Sân luyện/đánh quái: bắt đầu giao chiến, 4 ô skill thay đúng cụm hành động; HP/MP số thật, hitbox đúng.
3. Dùng kỹ năng rồi chờ hồi: vòng/số cooldown đồng bộ với cơ chế thật, không double cast.
4. Đánh hụt, trúng, chí mạng và nhận damage: phản hồi đúng loại; không tạo critical/né giả.
5. Boss mất máu liên tiếp: máu thật cập nhật ngay; vệt trễ không treo, tên/HP boss không đè skills; hết trận hồi tu vi.
6. Đánh đông quái 30 giây: không tích tụ số bay/hạt, HUD không rung, telegraph vẫn rõ. So FPS và Console với baseline M02.
7. Mở/đóng panel, bật photo mode, chuyển map, chết, tải lại: không có HUD/hiệu ứng cũ còn tồn tại, không xuyên input.
8. Chạy tại 1280×720, 1366×768, 1920×1080; xác nhận scale/hitbox khớp, không chồng/cắt nhãn.

## 11. Không làm

- Không viết/sửa code game trong T12. Không thay damage formula, tốc độ đánh, cooldown, AI, cấp quái, phím hiện có hoặc save.
- Không thêm công pháp, trạng thái nguyên tố, boss/phase mới, NPC hoặc vật phẩm.
- Không thiết kế lại bản đồ, HUD khám phá T10, menu, túi đồ hoặc soundtrack.
- Không giả lập thông tin hồi chiêu hoặc damage khi dữ liệu game không có.

## 12. Checklist nghiệm thu

- [ ] HUD combat chỉ hiện đúng trạng thái, khôi phục T10 sau trận; không chồng/cắt chữ.
- [ ] HP/MP dài mảnh, dữ liệu đúng, cảnh báo HP thấp dễ đọc.
- [ ] Tối đa bốn ô skill, phím/icon đúng, ô khóa/thiếu MP/hồi chiêu thể hiện rõ, không đổi gameplay.
- [ ] Vòng cooldown và số khớp thời gian thật; thi triển một lần cho một input hợp lệ.
- [ ] Thanh boss có máu thật/máu trễ, không chồng ô kỹ năng hoặc thanh tu vi; tu vi trở lại đúng giá trị.
- [ ] Đánh thường, skill, chí mạng, đòn nhận vào có phản hồi phân cấp; đòn hụt không vẽ damage dương.
- [ ] Hit-stop trình diễn không làm chậm logic/cooldown; shake không dịch HUD hay hitbox.
- [ ] Flash chỉ trên sprite, không strobe toàn màn; số bay đọc được và không che vùng cảnh báo.
- [ ] Hiệu ứng nhiều quái được giới hạn; không leak listener/hạt/timer, không lỗi Console.
- [ ] Chuyển map, chết, load, modal và photo mode sạch state; kiểm thử đủ ba độ phân giải.
- [ ] Không thay đổi chỉ số, battle outcome, save cũ; đạt mục tiêu 60 FPS hoặc không giảm đáng kể so baseline đã đo.
- [ ] Claude xác nhận mapping dữ liệu thật trong mục 9 trước khi đổi T12 sang DONE.
