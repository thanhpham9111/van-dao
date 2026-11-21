# BATCH_02 — ChatGPT

Ngày 21/11/2026 · Vạn Đạo Tu Tiên · **GÓI 02 v1.3 (kiểm thử lại v1.2)** · BRIEF 15:37.
Đã dùng BRIEF mới trong GOI_02_ChatGPT.zip thay bản cũ, đối chiếu nguyên byte. BATCH_02_FACTS.md F1–F12 là nguồn ID/tên, chỉ số và cơ chế; ảnh hiện tại Q/I/C/Menu/Tạo nhân vật dùng để giữ chức năng. Thực hiện B1→B8, chữ/dữ liệu trước, 5 ảnh sau. Không sửa src/, index.html, hệ thống save hay dữ liệu Gói 01. Bàn giao: **REVIEW**, không tự chuyển DONE.

## B1 T32 — Chính tuyến và phụ tuyến

**File:** data/quests.js, ops/specs/story.md.

- 5 chương, 10 vùng, cốt truyện khoảng 470 từ (≤600). Mâu thuẫn xuyên suốt: linh mạch bị cưỡng dẫn, giải rõ ở U Minh và khép tại Tử Lôi Hoang Nguyên. Vai trò đủ 12 NPC và 4 tông môn theo F3/F4. Không tạo boss/NPC/cổng vùng mới.
- 8 legacyText index 0–7: chỉ đổi chữ, giữ mục tiêu và chỉ dẫn T, B, E, WASD, chuột, Shift, H, giữ nguyên điều kiện/thưởng V12_MAIN. C1 vẫn kết sau thí luyện Vạn Giới cũ, không thêm yêu cầu Ma Vực cấp cao vào bước 6.
- 18 main m09–m26, minLevel tăng dần 10→44, 8 boss vùng theo thứ tự F1. 10 side s01–s10, 10 NPC khác nhau ngoài inn, mục tiêu mới không sao chép V8_TASKS. Lấy NPC/POI đúng F3/F7; quest giao tại vùng thật, inn dẫn qua nhật ký khi ở xa.

| Chương | Vùng | Main mới | Cấp main mới |
|---|---|---:|---|
| C1 Thanh Trúc khởi đạo | thon, truc | 0 (8 legacy) | 1–10 legacy |
| C2 Vạn Yêu lạc mạch | yeu, tram | 4 | 10–17 |
| C3 Hàn hỏa đồng nguyên | tuyet, hoa | 4 | 19–26 |
| C4 Phong minh u ảnh | phong, quy | 4 | 28–35 |
| C5 Vạn Giới quy chân | ma, loi | 6 | 37–44 |

Thưởng làm tròn từ 10+2L, XP 40%×(32+12(L−1)), boss ×1,5, đan 1–4. Tổng 18 main: 1468 linh thạch, 54 đan, 3169 tu vi; không gồm 8 bước cũ hoặc phụ tuyến. Chỉ là thưởng thiết kế, thu nhập/game balance thật cần Muse kiểm. Có spec nhật ký Q theo screenshot, ghi nhận quest, kiểm save/claim/boss, khóa cấp và không phát thưởng hai lần.

**Rà soát v1.1:** boss nhận ở cấp 12/17/21/26/30/35/39/44 thay cho các mốc sát cuối vùng, không thay sức boss/cổng vùng. S04 và s10 đổi từ kill lặp sang chuyển lời (4 talk, 6 kill toàn bộ side); side nhận tại NPC địa phương, về NPC đích chỉ khi tự chọn. Nếu đã nhập v1.0, giữ snapshot quest active và ID/trạng thái đã hoàn thành, không cấp lại thưởng. Với F1, tổng XP cần từ cấp 10 tới 45 là 12.040, main mới đóng góp tối đa 3.169 (26,3%, chưa trừ XP có thể dư khi đầy/cap); toàn bộ side mới 819 XP. Không đủ lên cấp chỉ nhờ nhiệm vụ: cần XP chiến đấu/nguồn có sẵn, chưa đo được thời gian luyện. Mốc boss cuối trước cap để thưởng còn cơ hội có ích; không đổi công thức BATCH. Preflight cả 8 boss/7 POI trước C2, tự nhận main theo điều kiện và nguồn xác thực; không reset cờ, không bắt quay thôn vì giver inn.

**Tự kiểm tĩnh ĐẠT:** 5/8/18/10 mục, 28 ID nhiệm vụ mới duy nhất, minLevel không giảm, NPC/region/POI và cấp vùng hợp lệ, 8 mục boss theo thứ tự F1, reward đúng công thức. Chưa chạy engine.

**Phát triển v1.2:** 36 câu lineStart/lineDone được viết lại theo từng manh mối, từ cổ kiếm đổi hướng, linh độc, hàn hỏa, tàn hồn tới Thiên Tôn; 18 quest giữ ID, goal, giver, minLevel, reward như v1.1. Spec story §4 bổ sung hồ sơ tám vùng, 8 dải XP và khoảng thiếu XP chính xác, 5 tóm lược chương, gợi ý hoạt động có thật theo mức tiến trình và hướng dẫn B đúng điều kiện. Không tạo nhiệm vụ mới, phần recap chỉ trình bày sau hoàn thành.

## B2 T33 — Yêu thú chí và thẻ danh hiệu boss

**File:** data/bestiary.js, ops/specs/boss_intro.md.

- 25 monsters type 0–24, tên y nguyên F2; 15 bosses type 3,7,12–24. Hệ là phân loại văn bản, không gán kháng hệ hay sửa HP/công/tốc. 45 tên chiêu (đúng 3 mã mỗi boss), 15 danh hiệu/45 câu intro–phase2–defeat.
- 9 boss vùng theo F1; 6 boss ẩn/bí cảnh dùng crush/fan/burst theo BATCH, region null/regions [] do thiếu mapId thật. Type 10 U Minh Lang chưa xác nhận vùng, regions []; các vùng quái thường dùng mô tả F1 (không phải spawn pool).
- Thẻ x380,y202,w520,h104, ngoài toast y100/150 và bar boss y664, fade 180/1000/220ms, không slow/khóa input. Tối đa một lần mỗi load khi vào 650px; lời 50% chỉ trình diễn, không sửa v27AI(e).phase, bại trận theo death event thật.

**Tự kiểm tĩnh ĐẠT:** 25+15, đúng tên, 45 mã đòn, độ dài trong giới hạn, chỉ 9 region ID chuẩn. Cần kiểm hook và mapId bí cảnh trước Tích hợp.

**Phát triển v1.2:** 10 dạng nhận diện đòn theo F1; Q boss quest đã mở có 3 ô tên chiêu, hover 300ms lấy mẹo tương ứng. Chỉ dùng nhãn realtime khi có hook và T12 còn chỗ, không sửa telegraph, không đoán shape/timer.

## B3 T34 — 24 kỳ ngộ mới

**File:** data/events.js. Không đổi 3 EVENT_POOL cũ, không thưởng trang bị/công pháp/chỉ số vĩnh viễn.

| Vùng | truc | yeu | tram | tuyet | hoa | phong | quy | ma | loi |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Kỳ ngộ | 3 | 3 | 3 | 3 | 3 | 3 | 2 | 2 | 2 |

24 ID e01–e24; 72 lựa chọn (24 kỳ ngộ đều có đúng 3 lựa chọn), 24 nhánh rủi ro (chance 0,60–0,75), lựa chọn an toàn chắc chắn. Mỗi lựa chọn ghi xác suất và hệ quả, hurt luôn ghi “không gây chết”. Loot nguyên liệu/tài nguyên/thiện cảm/heal/tu vi và buff tạm 120–180 giây; 24 nhánh thất bại mất HP hiện tại (clamp tối thiểu 1 HP); 4 nhánh còn nhận nguyên liệu khác phần thưởng an toàn. Chỉ roll một lần. buff attack/def/crit dùng phân số (.10 = 10%, .04 = 4 điểm %); speed/regen theo đơn vị hiển thị ảnh C: +18 px/s và +2 MP/giây; phải xác nhận mapper currentStats, không đưa thành vĩnh viễn. Nếu mapper chưa rõ đơn vị, không bật sự kiện buff đó. Hết hạn gỡ đúng buff, không stack: buff mạnh hơn thay cả giá trị và thời hạn; bằng nhau lấy expiry lớn hơn; yếu hơn bỏ qua, không kéo dài buff mạnh. Chỉ thời gian chơi thực, không áp offline; giữ quy tắc timer gốc nếu đã xác nhận. Không cấp thưởng mỗi frame, không farm click; giữ cơ chế chọn sự kiện và tần suất gốc khi tích hợp. night bám giờ game thật, không tự định nghĩa offset khác T21.

**Hợp đồng xử lý kỳ ngộ (v1.1):** giữ trigger/cooldown và 3 EVENT_POOL cũ; lọc ứng viên mới theo region/minLevel/night rồi chọn weight tương đối. Mỗi vùng có ít nhất một sự kiện không giới hạn đêm/ngày ngay cấp vào vùng; kiểm đủ 90 tổ hợp vùng × cấp trong dải × ngày/đêm. e24 mở cấp 44 thay 45, giữ điều kiện đêm. Khi event thực phát sinh, cố định ID/token đời event; chọn đúng một lần, cố định RNG và commit toàn bộ effects/fail vào giao dịch save hiện hữu theo token, cả reload/nhấp đúp không reroll hoặc nhận lại. Nếu không có cách lưu pending event an toàn, đóng pending khi load không cấp lại; Claude duyệt trước khi bật. HP hiện tại chỉ clamp khi sống, heal không hồi sinh, cap maxHP; favor clamp 0–100 theo T15. Không tăng stats vĩnh viễn, không đổi tốc độ xuất hiện. Rủi ro khi HP rất thấp ít tốn HP do luật nonlethal: bảo toàn quy tắc, không tự thêm cổng HP; phần thất bại không cho đúng phần thưởng chắc chắn cùng loại, cần kiểm tần suất thực để chống farm. Khi effect mapper/token chưa an toàn, không bật kỳ ngộ mới chứa effect đó.

**Tự kiểm tĩnh ĐẠT:** đủ 24, đủ 9 vùng ≥2, minLevel trong vùng, enum đúng, mọi risk có fail, reward không quá cap stones/xp/pills, buff đúng giới hạn/tg, không effect lạ, không câu vượt 140 ký tự.

### Phát triển v1.2 — ba phương án kỳ ngộ và spec tương tác

Giữ nguyên 24 sự kiện và 24 lựa chọn rủi ro của v1.1. Bổ sung 16 lựa chọn chắc chắn để mỗi sự kiện có một nhánh mạo hiểm và hai nhánh an toàn khác mục tiêu. Không sửa reward/roll/weight cũ. Danh sách thứ ba mới:

| ID | Phương án thêm | Kết quả |
|---|---|---|
| e01 | Quan sát nhịp gió | 8 XP |
| e02 | Lấy gói thuốc rơi | 1 Hồi Xuân Đan |
| e04 | Ghi dấu móng thú | +2 thiện cảm Hàn Liệt |
| e06 | Lắng nghe khí huyết | 28 XP |
| e07 | Ép lá thuốc ven bờ | Hồi 25 HP |
| e08 | Hái thảo dược bên rễ | 1 Linh thảo |
| e10 | Ngắm vân băng | 32 XP |
| e11 | Trú gió bên sườn núi | Hồi 45 HP |
| e13 | Ghi lại vỉa quặng | +2 thiện cảm Thiết Nham |
| e14 | Hơ ấm kinh mạch | Hồi 40 HP |
| e16 | Ngộ nhịp gió | 42 XP |
| e17 | Quan sát ánh phong đăng | 48 XP |
| e19 | Nghỉ ngoài cổ mộ | Hồi 52 HP |
| e20 | Nhặt mảnh huyền thiết | 1 Huyền thiết |
| e21 | Đọc vết khắc trụ đá | 52 XP |
| e23 | Nghỉ sau tảng đá | Hồi 60 HP |

So sánh minh họa, không tính thành loot mới: e01 rủi ro 75% × 2 Linh thảo = 1,5 Linh thảo kỳ vọng, 25% × 12 = 3 HP mất kỳ vọng trước clamp; hai lựa chọn an toàn là hồi 18 HP hoặc 8 XP. e03 mạo hiểm 70% × 29 = 20,3 XP kỳ vọng so với 12 XP chắc chắn, đổi lấy nguy cơ mất 20 HP. e24 mạo hiểm 65% × 160 = 104 XP kỳ vọng, hoặc hồi 65 HP/18 linh thạch. Do các tài nguyên khác đơn vị, không quy đổi ra giá trị tiền giả, cân bằng runtime cần tần suất xuất hiện và giá kinh tế thật.

**Thiết kế bảng kỳ ngộ (1280×720, chỉ áp dụng modal kỳ ngộ hiện hữu, không thêm route mới)**

| Thành phần | Rect | Đặc tả |
|---|---|---|
| Khung | 280,112,720,496 | ornament/box, ink #100b13 .92, viền gold #e3b96f .65, bóng mờ, backdrop ink .40 |
| Tên sự kiện | 304,126,672,38 | V18Serif 26 gold, 1 dòng; giảm tới 20 nếu cần |
| Bối cảnh | 304,172,672,60 | V45Sans 15 paper #f1e4cf, wrap tối đa 3 dòng 18px |
| Phương án 1 | 304,246,672,84 | Tên 17; mô tả 14, 2–3 dòng; nhãn “Mạo hiểm” red #f18474 |
| Phương án 2 | 304,338,672,84 | Tên 17; mô tả 14; nhãn “Chắc chắn” jade #a8d6c5 |
| Phương án 3 | 304,430,672,84 | Như phương án 2; nhãn rõ, không chỉ phụ thuộc màu |
| Hướng dẫn | 304,528,672,42 | “Chọn một phương án. Kết quả được ghi nhận một lần.” |
| Kết quả | 304,246,672,268 | Chỉ replace 3 phương án sau commit thật; số được áp dụng, tối đa 4 dòng 16px |

Ba hàng dùng cùng kích thước/hitbox: tên tại x+16,y+8 w440 h22, badge bên phải x+510,y+8,w146,h22, desc x+16,y+33,w640,h48, line-height 16px. Nếu renderer font thật wrap vượt 3 dòng, hạ desc tới 13px hoặc cuộn trong hàng, không cắt phần thất bại. Không đổi thứ tự lựa chọn đang hiển thị trong một token. Hover 100ms nền gold .12, chọn 80ms viền 2px, khóa toàn bộ ba hàng ngay khi chọn cho đến khi handler trả kết quả. Fade mở 160ms/đóng 120ms theo modal gốc, không flash toàn màn. Nếu runtime có nút đóng/bỏ qua thì giữ handler thật, thay vùng hướng dẫn bằng nút chân bảng; không thêm chức năng hủy kiếm roll mới. Nếu event renderer không có modal, Claude quyết định cách ghép vào hộp thoại hiện hữu, không tạo luồng tương tác mới khi chưa duyệt.

**Chốt ranh giới RNG và giao dịch (v1.3):** với chance <1, draw U trong [0,1), thành công khi U < chance; đúng U=chance là fail. Chance=1 không cần roll. Khóa lựa chọn, token và nhánh đã chọn trước khi áp effect. Nếu ghi save/commit lỗi, không công bố thành công và không tạo token mới để reroll; giữ kết quả pending đã chọn nếu flow có thể khôi phục nguyên tử, khôi phục tài nguyên/điểm trạng thái từ giao dịch cũ, dùng lỗi thật và chờ xử lý. Nếu không có cơ chế commit và khôi phục an toàn, chưa bật event mới (không đoán tên field lưu). Không áp heal/hurt cho nhân vật đã chết, không hồi sinh. Kết quả clamp hiển thị số delta thực, kể cả HP đầy/thiện cảm 100. 

Kết quả chỉ công bố sau commit: Success dùng “Cơ duyên đã thành” gold/jade; fail dùng “Cơ duyên chưa trọn” muted/red; số thực nhận từ handler (heal có thể thấp hơn bởi maxHP, hurt không chết, favor clamp). Không tự đoán số đã nhận từ preview. Dòng 1 tên sự kiện, dòng 2 kết quả, dòng 3 cảnh báo/ghi nhận thật; tự đóng chỉ nếu flow gốc có auto-close, không tự thêm nút. Khi combat/hazard/modal ưu tiên đang chiếm UI, giữ renderer gốc; chỉ hoãn mở nếu trigger cung cấp pending an toàn và vẫn đúng token, không phát sinh event thứ hai. Không dùng backdrop che gameplay đang bắt buộc né nếu modal gốc không dừng tương tác. Không sửa spawn/cooldown, F2, clock T21, save. 

- [ ] 24×3 hàng đủ tên, xác suất và hậu quả; kiểm mô tả dài nhất bằng font thật, không rơi nhánh 3 ra ngoài.
- [ ] Có 24 risk, 48 lựa chọn chắc chắn; chỉ một commit/token, không đúp click/đóng mở/reroll, kết quả hiển thị hiệu lực thực.
- [ ] Test 9 vùng đầu dải ngày/đêm, HP=1/maxHP, favor=100, cấp 45, buff cùng stat; không tạo vật phẩm ngoài enum.

## B4 T35 — Văn bản thế giới

**File:** data/lore.js.

| Mục | Số lượng |
|---|---:|
| Trang bị (index 0–62) | 63 |
| Linh bảo | 14 |
| Công pháp cũ | 9 |
| Bộ | 11 |
| Vùng (2 câu thơ + intro) | 10 |
| Tông môn | 4 |
| Phái | 3 |
| Mẹo màn tải | 40 |

Lore cổ phong, không ghi chỉ số trang bị; khớp thứ tự F10, không dịch EQUIPMENT. 20 câu thơ 6–8 chữ và 10 intro vùng. Tips dùng phím trong F12 có ý nghĩa được xác nhận từ FACTS/BRIEF/ảnh, cảnh giới/F11, bộ, linh thú, linh căn, trạm thôn. Không quảng bá hệ chưa triển khai T18; không đổi lore mới của BATCH01.

**Tự kiểm tĩnh ĐẠT:** key số 0–62 liên tục, ID relics/techs/sets đúng F9, 10 region đúng F1, số lượng đủ; 174 chuỗi lore/thơ/mẹo khác nhau, mỗi loại trong giới hạn. 4 file DATA đều parse JSON nghiêm ngặt và nạp VM độc lập, version 1, string dài nhất 100 ký tự.

**Phát triển v1.2 — sử dụng lore:** giữ 174 chuỗi/đúng số lượng; gộp hai cặp tip thú và mốc đột phá để thêm 4 mẹo về nguồn Linh tinh, boss Trúc Lang Vương, kết quả thiên kiếp và đọc cảnh báo. Hướng dẫn tích hợp không thêm hệ sưu tập/achievement:
- I: desc/lore trong vùng (864,356,368,80) của panel v1.2, xâu chuỗi theo index đúng; đồ 63–82 lấy lore trong DATA.equipment, không áp nhầm 0–62.
- M: intro vùng đã mở hiển thị trong khu chi tiết hiện hữu của T19; vùng chưa khám phá giữ fog/điều kiện, không lộ thông tin chưa biết. Verse đề xuất rect (384,98,512,42) dưới title T10 y24–89, hai dòng 13px paper, căn giữa; cùng nhịp owTitle 200/2200/400ms ngoài thôn. Nếu giao target y104–142, toast y100/150, hazard hoặc modal, ẩn toàn thơ; không kéo dài owTitle. Trong thôn title cố định giữ nguyên, chỉ hiện thơ lúc entry nếu có hook entry riêng đã xác nhận, nếu không chỉ đọc ở chi tiết M.
- T/N: lore công pháp/linh bảo/bộ/tông môn/phái chỉ trong tooltip hoặc chi tiết đang có; không ghi text thay chỉ số.
- Màn tải: chỉ khi có loading thật, chọn một trong 40 mẹo lúc mở, hiển thị V45Sans 14 paper trong vùng footer loading hiện có (đề xuất (280,650,720,36), ẩn nếu giao progress), 1–2 dòng; không kéo dài loading, không đổi mẹo mỗi frame. Không gọi tip về tính năng chưa triển khai hoặc phím chưa xác nhận.

## B5 T36 — Hành trang I và Hồ sơ tu sĩ C

**File:** ops/specs/panels_ui.md. Tọa độ logic nằm trong 1280×720. Giữ mọi nút/tab/phím thực theo ảnh; giấy/lụa ấm trên ink, viền đồng/gỗ sơn mài, title V18Serif, chữ V45Sans, QUALITY_COL có sẵn, portrait đứng nền thủy mặc. I giữ 48 capacity, lưới 24 ô 6×4, lọc/sort/phân trang/giám định/tự nhặt/bộ/pháp bảo/nguyên liệu. C giữ 6 thuộc tính −/+1/+5, 3 tab, hoàn điểm, T/N. Định nghĩa tooltip so sánh Δ và mũi tên jade/red, không giả hiệu ứng net khi chưa có currentStats preview. Giữ luật T31; thay bố cục I 48 ô một trang bằng 24 ô đúng ảnh V47, cần Claude hợp nhất T18. Hai chuỗi dài được bố trí w194 wrap, w300 một dòng tương ứng; kiểm kích thước logic, còn phải đo font renderer thực. Không thay hệ số, handler, save.

**Phát triển v1.2:** 8 trạng thái túi/giám định, quy tắc hitbox và selection theo instance, so sánh trực tiếp/preview phân biệt, 3 gợi ý thuộc tính theo phái; không preset hay công thức mới. Kiểm trạng thái rỗng/đầy/lọc rỗng, hai instance tương tự, thiếu cấp, cường hóa thành công/thất bại sau commit.

## B6 T37 — Menu chính & tạo nhân vật

**File:** ops/specs/menu_ui.md; assets/menu_keyart.png **CÓ**. PNG 1920×1080 16:9, ảnh gốc sinh 1672×941, upscale Lanczos và crop tối thiểu để đúng kích thước, không tuyên bố native 1920. Đã xem nội dung ảnh: tu sĩ nhỏ trên vách phải, biển mây núi, trái tối sạch dành title/menu, không chữ/UI. Bám phong cách screenshot và Design Bible.

Tọa độ logic trong khung; menu giữ Bắt đầu/Tiếp tục/Tạo mới/Hướng dẫn/Bảo toàn hồ sơ/Âm thanh/Đồ họa/Cài đặt nếu handler có. Tạo nhân vật giữ 3 artwork phái, 4 số preview thật, tên input DOM, Nhập thế/Quay lại. Xác nhận ghi đè chỉ khi Nhập thế với save cũ; hủy giữ nguyên save. Sương 5/9 px/s, lá nhẹ, low graphics giảm VFX; nền đã có vùng tối nên veil nhẹ không đè kép. Không thêm mode/slot/giới tính.

**Phát triển v1.2:** 3 lời hướng dẫn phái, triện “Đã chọn”, metadata Tiếp tục đọc-only nếu có, bảng Hướng dẫn 4 nhóm phím/cấp V30; không tutorial bắt buộc, không save mới. 

## B7 T38 — Thiên kiếp đột phá

**File:** ops/specs/breakthrough.md. Giữ nguyên F11, 4 rank tương ứng 3–6 đợt; target r144/153/162/171, line 60/66/72/78, warn 1440/1330/1220/1110ms. Ring lấy hình học thật không đoán. Intro ≤1800ms, Space/Esc bỏ lớp diễn, không consume phím gameplay khi timer đã chạy, không tạo hành vi thoát trial mới; không trùng hitbox/timer. Warn 3 pha theo % thời gian còn, giữ geometry/damage. Thắng: thăng cảnh giới 2200ms và lời chúc theo 4 cảnh giới, thua 2 câu, không trao thưởng/chỉnh breakFails thêm. Tọa độ logic trong khung, lời 4 mở đầu/4 chúc ≤70 ký tự, 2 câu thua ≤70, thời gian đúng. HUD T12 không bị phủ, không giả các hook chưa có.

**Phát triển v1.2:** gợi ý trước thiên kiếp trong Q/C đúng XP và cấp, nhãn 3 shape chỉ từ hook thật, hướng dẫn sau thua và điều kiện thử lại; không thêm penalty/timer/đợt/luật thắng thua.

## B8 — Concept 4 phòng (T23b)

| File | Phòng | Kích thước |
|---|---|---|
| assets/interior_herbalist_concept.png | Bách Thảo Dược Đường | 1672×941 |
| assets/interior_shop_concept.png | Vạn Bảo Phường | 1672×941 |
| assets/interior_wanderer_concept.png | Kiếm Tu Quán | 1671×941 |
| assets/interior_sentry_concept.png | Đông Môn Hộ Vệ Đường | 1672×941 |

**Đủ 4/4.** Cùng camera/cấu trúc/cột gỗ/sàn/ánh sáng ấm với inn đã duyệt, đồ phân nhóm 2 bên theo T23: tủ thuốc và lò, kệ và quầy, giá kiếm/bàn, giá giáo/bàn trực/giường. Chừa không gian đứng NPC trên giữa và lối ra dưới giữa, không bake NPC để giữ sprite/anchor thật; thảm là nền phẳng; không chữ, không UI. Ảnh concept không phải collider hay nền tự động: T24 dùng rect/footprint thực trong phụ lục Gói 01 đã duyệt, tách actor/đồ che khuất, không bake vật cản gây xuyên, không thêm chức năng lò/giường/kiếm. Claude có thể dựng sprite theo concept và nén WebP sau duyệt.

### Phát triển v1.2 — bản đồ thị giác và sinh hoạt phòng

Ảnh giữ nguyên 4 concept đã kiểm. Phân lớp theo T23/T21: sàn/decor phẳng → đồ khối có footprint thật + actor sort theo chân y → cột/che khuất theo renderer → ánh sáng một pass → prompt E/HUD. Mỗi phòng có 1 nhận diện thị giác từ đồ có sẵn; không biến một món đồ trang trí thành cơ chế chưa được duyệt.
 
| Phòng | Nhận diện / ánh sáng | Điểm người chơi cần thấy | Phản hồi |
|---|---|---|---|
| herbalist | Kệ thuốc gỗ trái, bình sứ phải, điểm lò ấm | Mộc Tử Y và đường tiếp cận; mùi thuốc gợi qua decor, không tạo debuff | T15 đúng NPC; lò/vật tương tác chỉ nếu hook thật có |
| shop | Quầy giao dịch trái, kệ hộp ngọc phải, vàng đồng dịu | Linh Dược, đường giữa trống tới quầy | T15/openShop thật giữ giá và lựa chọn; không tạo nút bán mới |
| wanderer | Giá kiếm và bàn lau kiếm, nhấn xanh xám | Tạ Vô Nhai và khoảng trống luyện kiếm | Lời thoại/quest thật; không mở chế độ đấu luyện mới |
| sentry | Giá giáo/giáp, bàn trực, giường phía phải | Lục Thanh và đường ra cửa | Đối thoại/hộ vệ thật; không auto nghỉ/hồi HP từ giường decor |

Cùng chiều cao avatar, camera và sàn V36 hiện hữu. Tại anchor thật, glow đèn chỉ khi T21 và renderer xác nhận nguồn sáng; màu gold #e3b96f alpha .12–.22, nhịp nhẹ 1600–2200ms (không nháy nhanh), không tint chữ. Bàn/lò/giá kiếm không có icon hay hitbox mới; chỉ prompt T10 hiện hữu 22px nếu có tương tác thật đang đủ tầm, không tự sinh prompt từ ảnh. Vùng đi giữa giữ thông và cửa ở trước; bốn nhóm lớn hai bên phải được kiểm overlay footprint thật, không đặt đồ đè cửa/NPC. Dùng bản ảnh concept tham chiếu, không biến phối cảnh thành tọa độ collider. 

- [ ] Mỗi căn có dấu nhận diện riêng, lối giữa không bị đồ chặn từ spawn → NPC → cửa; actor che khuất hợp lý.
- [ ] Test E đúng NPC, lại gần đồ decor không có prompt giả; ngày/đêm và low graphics không nhân đôi ánh sáng.

**Prompt ảnh:** 5 ảnh sinh bằng công cụ sinh ảnh tích hợp từ tham chiếu screenshot menu hoặc concept inn đã duyệt. Nội dung prompt dùng:

- menu: Use case: stylized-concept. Asset type: title-screen key art for a warm HD hand-painted Chinese xianxia RPG, requested 1920x1080 or larger 16:9 landscape, no text. Reference screenshot is ONLY for art style, not the UI. Vast ink-wash mountains meeting a luminous pale-gold sea of clouds, late afternoon sunlight, a little lone robed cultivator on a rocky ledge at 75% width and 64% height gazing toward the distant mountains. Winding pine and tasteful distant temple roof in right half, painterly fine ink-wash texture and warm antique pigments, cinematic spatial depth. IMPORTANT left 0-48% clean low-detail dark mist blue-brown/charcoal negative space for separate menu and title overlay, no foreground character or architectural detail there. Keep focal character small on right, far upper peaks. Warm subdued ivory, ochre, muted jade, no neon. 16:9 wide, not portrait, no text, letters, logo, frame, interface, watermark.
- herbalist: Use case: stylized-concept. Asset type: painted 2D xianxia RPG interior environment concept, landscape 16:9. Reference image is the APPROVED hall, match exactly its camera angle/height, handpainted HD texture, warm sunlight, antique wooden architecture red lacquer posts, open-front cutaway with no roof, soft contact shadows. Show tops of furniture clearly. Keep a broad CLEAR central walkable aisle from the foreground center threshold to upper-middle standing area, zero furniture in aisle. Front centered exit stairs, no rail across opening. Four large furnishing groups to left/right, center-top free for a separate NPC game sprite (do not bake people into art, leave standing position empty). No UI, lettering, writing, symbols or watermark. No extra rooms, no modern furniture. Room: Bách Thảo Dược Đường, herbalist pharmacy. Rear left tall medicinal chest with many unlabeled drawers; rear right shelf of ceramic jars; middle left dispensing table; middle right small antique bronze alchemy stove, not a huge fire; low herb tray and herb basket tucked close to sides. Green jade herb accents, cream paper, wooden surfaces, sunlight. Keep left of center upper standing space near dispensing desk unobstructed, and leave middle and exit completely open.
- shop: Use case: stylized-concept. Asset type: painted 2D xianxia RPG interior environment concept, landscape 16:9. Reference image is the APPROVED hall, match exactly its camera angle/height, handpainted HD texture, warm sunlight, antique wooden architecture red lacquer posts, open-front cutaway with no roof, soft contact shadows. Show tops of furniture clearly. Keep a broad CLEAR central walkable aisle from the foreground center threshold to upper-middle standing area, zero furniture in aisle. Front centered exit stairs, no rail across opening. Four large furnishing groups to left/right, center-top free for a separate NPC game sprite (do not bake people into art, leave standing position empty). No UI, lettering, writing, symbols or watermark. No extra rooms, no modern furniture. Room: Vạn Bảo Phường, antique treasure and medicine merchant. Rear left and right display shelves with closed boxes, jars and unmarked jade; left middle transaction counter; right middle low precious goods cupboard, closed chest low left and tea bench right. Warm gold/ochre accents, lacquered wood, bronze fittings; modest village shop, not luxury palace. Empty upper-middle standing space adjacent to left counter, broad clear center aisle.
- wanderer: Use case: stylized-concept. Asset type: painted 2D xianxia RPG interior environment concept, landscape 16:9. Reference image is the APPROVED hall, match exactly its camera angle/height, handpainted HD texture, warm sunlight, antique wooden architecture red lacquer posts, open-front cutaway with no roof, soft contact shadows. Show tops of furniture clearly. Keep a broad CLEAR central walkable aisle from the foreground center threshold to upper-middle standing area, zero furniture in aisle. Front centered exit stairs, no rail across opening. Four large furnishing groups to left/right, center-top free for a separate NPC game sprite (do not bake people into art, leave standing position empty). No UI, lettering, writing, symbols or watermark. No extra rooms, no modern furniture. Room: Kiếm Tu Quán, a quiet sword cultivator lodge. Rear left wall sword rack with several sheathed swords, rear middle plain landscape folding screen flush to wall, rear right martial scroll shelf; middle left low sword maintenance table, middle/right long bench, low weapon stand right side. Restrained muted pale slate-blue accents on fabric, weathered wood. No swords on floor, no training figures. Broad empty middle-upper standing area and straight central aisle.
- sentry: Use case: stylized-concept. Asset type: painted 2D xianxia RPG interior environment concept, landscape 16:9. Reference image is the APPROVED hall, match exactly its camera angle/height, handpainted HD texture, warm sunlight, antique wooden architecture red lacquer posts, open-front cutaway with no roof, soft contact shadows. Show tops of furniture clearly. Keep a broad CLEAR central walkable aisle from the foreground center threshold to upper-middle standing area, zero furniture in aisle. Front centered exit stairs, no rail across opening. Four large furnishing groups to left/right, center-top free for a separate NPC game sprite (do not bake people into art, leave standing position empty). No UI, lettering, writing, symbols or watermark. No extra rooms, no modern furniture. Room: Đông Môn Hộ Vệ Đường, village guard station. Rear left spear rack, rear right armor rack; middle left modest duty desk, middle right simple wooden bed, low locked supply chest front left and bench front right. Restrained muted cyan/jade fabric accents, brown timber, worn practical guard room. No combat figures or weapons on aisle. Empty upper middle standing area near duty desk, broad straight clear center exit.

## Rà soát phản biện v1.1 — cổng nghiệm thu tích hợp (giữ trong v1.2)

| Rủi ro | Xử lý v1.1 | Test runtime bắt buộc |
|---|---|---|
| Boss/POI đạt trước nhận, nguồn cờ thiếu | Preflight cả tuyến, đọc p.claimed; boss lặp được chỉ tính kill thật | Save cũ sau bước 7; đủ/thiếu cờ boss; reload giữa nhận/thưởng; không reset legacy |
| Gate boss và XP phí ở cap | 8 gate đều trước cuối dải F1, finale Lv44 | Lv44/Lv45, XP đầy, không đổi sức boss hoặc cấp vùng |
| Kỳ ngộ bị rỗng đầu vùng | 9 sự kiện mở cả ngày đêm; 90 tổ hợp đạt | Spawn ngày/đêm đầu vùng, một event/token, nhấp đúp, reload pending |
| Buff/HP/favor | Nonlethal/không hồi sinh, clamp, cùng stat không cộng dồn | HP=1; heal full; buff mạnh→yếu→hết hạn; favor=99/100 |
| Chồng boss card và VFX | Ẩn card khi vùng báo giao rect, phase và defeat dedupe instance | Boss spawn trong tầm, đánh >50% xuống 0, hai boss, đổi vùng/Photo |
| I/C | Chọn vị trí tooltip không đè action, giữ handler Bộ trang bị và instance | Filter/sort/đổi trang, đổi tab, hover mọi ô, +1/+5/−, Hoàn điểm |
| Ghi đè save | Chỉ commit khi start thành công, giữ bản cũ khi lỗi | Tạo mới/hủy, lưu lỗi, Enter/IME, nhấp hai lần, tiếp tục/backup |
| Thiên kiếp | Không nuốt phím khi timer chạy, không che telegraph | 4 rank, 3 shape, skip, timer, retry/thắng/thua/modal/chuyển map |
| 5 ảnh | Xem trực quan lại toàn bộ: chủ thể phải, menu trái; 4 phòng lối giữa thông | Căn sàn/cửa/collider thật, NPC riêng, thử đường spawn → NPC → cửa |

B8: concept phòng được giữ nguyên byte. Theo T23, kiểm neo mỹ thuật chân NPC herbalist/wanderer (510,398), shop (516,374), sentry (510,372), spawn (640,554), cửa (640,590) trên khung 1280×720; đây chỉ là mốc để overlay khi căn art. Ảnh không phải 1:1 silhouette collider, nhóm đồ phụ về sát tường/decor phẳng hoặc bỏ nếu vướng đường thật. Không dời NPC/spawn/collider theo ảnh. 

Kiểm lại JSON/VM, enum/ID, count, giới hạn, thưởng công thức, xác suất hiển thị, HP nonlethal trong desc, 90 trạng thái kỳ ngộ, 174 chuỗi lore duy nhất, PNG/dimensions và cấu trúc archive: ĐẠT tĩnh. Chưa chạy code engine vì không có repo thực thi trong gói; cột test runtime là điều kiện bàn giao REVIEW, không tuyên bố DONE.

## Phản biện v1.2 — kế hoạch chạy thử theo mốc

**Kiểm đối chiếu v1.1→v1.2 (ĐẠT tĩnh):** 36 câu lineStart/lineDone đổi, các trường khác của 18 main, 8 legacy, 10 side và 5 chương không đổi. 16 lựa chọn mới được nối cuối; tất cả lựa chọn đã có, ID, title và when/weight cũ giữ nguyên; mỗi sự kiện đúng 1 rủi ro + 2 chắc chắn. Lore chỉ chỉnh 40 tips, phần còn lại và DATA.bestiary giữ nguyên. Năm PNG trùng byte bản cũ. Bốn DATA parse JSON/VM, 90 trạng thái eligible ngày/đêm, 72 lựa chọn, 174 chuỗi lore không trùng; tổng thưởng main không đổi (1468/54/3169). 165 literal rect trong 5 spec + báo cáo có kích thước dương và nằm trong 1280×720 (không thay test overlap động, font, DPR thật). BRIEF nguyên byte nguồn giao việc.

| Kịch bản | Kết quả quan sát mong đợi |
|---|---|
| Lv1→9: tạo 3 phái, gặp inn, T/E/WASD, đánh quái | Không mất save, hướng dẫn đúng phím; tám legacy giữ nguyên mục tiêu/thưởng |
| Lv9 đầy XP, thắng/thua V30 | Không nuốt Shift/Space/Esc khi timer chạy; thứ tự đợt/shape/timer F11; Q/C không ép trial |
| Lv10→18 | m09–m12 tự nhận đúng điều kiện, cờ POI cũ đọc lại, hai manh mối; e04–09 đủ ba lựa chọn |
| Lv19→27 | m13–m16 nối hàn hỏa; Q chỉ tên chiêu boss đã mở; I/C không lỗi lọc hoặc đổi instance |
| Lv28→36 | m17–m20 reveal Thiên Tôn sau m19; tiếp tục chính tuyến khi xa inn; không buộc V12_SIDE |
| Lv37→45 | m21–m26, cuối từ Lv44; vẫn đi lại sau kết truyện; không cấp lại thưởng khi load |
| Kiểm độc lập e01–24 | 24×3 lựa chọn, một commit, 90 trạng thái eligible; HP thấp, maxHP, favor 100, buff và XP cap |
| Vào/ra 4 phòng | Sprite/NPC/hitbox thật, không collider do concept, dấu E đúng nơi, không nhân ánh sáng |

Ưu tiên tích hợp: kiểm data/mapper/save và các hook trước; tích hợp Q tuyến mới và kỳ ngộ chỉ khi preflight đạt; rồi nối boss card, lore, I/C/menu; cuối cùng trình diễn V30 và concept phòng theo phụ thuộc BRIEF. Mốc trên là kế hoạch kiểm thử cho Claude/Muse, không phải tuyên bố đã chơi game hoàn chỉnh.

## QA v1.3 — kiểm thử độc lập trên dữ liệu trong archive

Ngày 21/11/2026. Đọc chính các DATA từ ZIP v1.2, so schema và FACTS, chạy mô hình tham chiếu độc lập (không nạp hoặc sửa src game). Không dùng kết quả mô phỏng làm bằng chứng runtime.

| Phép kiểm | Số trường hợp / kết quả |
|---|---|
| Chính tuyến: 17 bước có chứng cứ boss/claim/discover; xét mọi tập chứng cứ ở Lv45, chưa hạ quái sau nhận m22 | 131.072 tập trạng thái: ĐẠT mô hình; không nhảy qua m22, không nhận lại thưởng hoặc đảo thứ tự |
| Điều kiện chính tuyến ở cấp 1–45, bộ đếm m22 = 0/7/8/9 | 180 tổ hợp: ĐẠT mô hình |
| Kỳ ngộ: 72 nhánh success +24 fail; HP 1/2/60/127, thiện cảm 0/99/100, cấp vào vùng/45, commit lặp | 2.304 tình huống: clamp, delta tài nguyên, chống lặp ĐẠT mô hình |
| RNG đúng tại U=0, dưới ngưỡng, bằng ngưỡng, trên ngưỡng; chance=1 | 192 điểm: ĐẠT quy ước U < chance |
| Toàn bộ vùng × cấp 1–45 × thời điểm ngày/đêm | 900 trạng thái: ĐẠT điều kiện lọc data; không pool mới trong thôn, dưới cấp vào vùng không eligible, từ cấp vào vùng luôn có ứng viên |
| Buff cùng stat mạnh/yếu/bằng, expiry | ĐẠT mô hình không cộng dồn và không kéo dài buff mạnh nhờ buff yếu |
| V30 4 rank; 7 mốc tỷ lệ remaining × 2 trạng thái impact | 56 mẫu: ĐẠT công thức và không mơ hồ biên 50%, 20%, 0%; impact thật ưu tiên |
| Đo text bằng DejaVu Sans thay thế (không có V18Serif/V45Sans thật) | 9 nhóm chuỗi: vừa giới hạn số dòng đề xuất; event desc tối đa 1 dòng, Q desc+lineStart 2, thuộc tính dài 2; cần renderer thật xác nhận |
| 5 PNG trong ZIP | Giải mã/verify PNG ĐẠT, kích thước theo báo cáo |
| Hình học sau bổ sung v1.3 | 168 rect số trong 5 spec + báo cáo, kích thước dương và nằm trong 1280×720; F6/hàng theo dõi không vượt panel |
| B1–B4 | Schema exact keys, JSON/VM, F1–F12, 5/8/18/10 quest, 25+15 boss, 72 option, 174 chuỗi, thưởng/enum/giới hạn ĐẠT |

### Các điểm sửa sau lần test

1. **Q thiếu nút F6** trong spec cũ: bổ sung vị trí Sân Luyện Kiếm từ ảnh Q, giữ handler; badge theo dõi cấp dòng và thanh tiến độ, số đếm 8/26 tùy module bật, nhiệm vụ phụ đếm thật. Fallback 8 legacy không đọc lineStart/lineDone không tồn tại.
2. **Nhận quest có chứng cứ cũ**: preflight 17 bước có thể hoàn thành trước nhận, xử lý theo thứ tự/ID sau commit, claim không trả lại loot POI, khám phá p.discovered hoặc map thật, m22 chỉ kill sau nhận. Save lỗi không lặp thưởng.
3. **Kiểm tuyến địa đồ**: 13 ROAD_EDGES đúng bản T19 đã duyệt; phong chỉ nối ma/loi trên bản đồ mực, nhưng review T19 ghi rõ dẫn đường không khóa cấp và nét nối không phải đường bắt buộc. Không suy đường thật từ graph, không ép qua vùng 37/41 ở cấp 28. Muse phải chạy thử hoa→phong và phong→quy với v8SetGoal thực; nếu bị chặn, báo Claude trước khi bật tuyến.
4. **Kỳ ngộ**: ranh giới roll, trạng thái pending khi save lỗi, bảo toàn một token, desc cao 48px/3 dòng 16px trong hàng 84px; không cấp lại hoặc báo thành công trước commit.
5. **Thiên kiếp**: 3 pha warning không chồng ngưỡng; khi remaining=0 và vẫn active giữ dấu cuối đến event impact/hủy thật. Giảm tần số pulse cuối từ 180ms xuống 360ms, chỉ alpha local, giữ độ sáng cảnh báo không đổi thời gian V30.

Không đổi DATA, thưởng, 5 ảnh, ID hoặc mục tiêu game v1.2; chỉ sửa story.md, breakthrough.md và báo cáo. Đối chiếu BRIEF 15:37 và ảnh thật Q/I/C/Menu; chưa có engine, font game, hook save/combat thật nên chưa chấm PASS runtime. Điều kiện bàn giao vẫn REVIEW, ưu tiên test thực 5 điểm ở trên.

## Câu hỏi mở

1. **Nhiệm vụ:** cần Claude xác nhận storage/handler V12_MAIN mới, cách ghép ID/hash tiến độ, auto nhận với giver inn xa thôn, cờ boss/discover/claim trước nhận và chiến thắng boss đã đánh một lần. Ghi mục tiêu/thưởng đúng BATCH, không tự reset legacy hay claim; preflight toàn tuyến; nếu thiếu nguồn xác thực và mục tiêu không thể lặp lại, chưa bật cả tuyến mới, không bật từng phần gây softlock. F6 chỉ cung cấp mục tiêu, không full desc từng legacy; đã giữ mọi chỉ dẫn phím trong đề và mục tiêu, cần đối chiếu wording cũ.
2. **Yêu thú:** F2 đủ tên nhưng F1 không liệt kê spawn pool chi tiết; vùng quái là tham chiếu lore, không dùng lọc loot/spawn. 6 boss ẩn/bí cảnh và type 10 thiếu mapId xác thực, để null/[] thay vì gán map giả; cần mapping runtime. Phase câu 50% không thay pha AI, không tạo boss phase mới.
3. **Kỳ ngộ:** cần nối EVENT_POOL và mapper effects đúng schema; xác định night theo clock thật, các đơn vị buff, nonlethal, RNG một lần, giới hạn buff/refresh/claim và giữ tốc độ xuất hiện cũ. Đề xuất chỉ buff tạm, không lưu vĩnh viễn. Chưa đo kinh tế game hoặc tỷ lệ rơi/thời gian farm. 
4. **UI:** cần Claude/Muse rà T36/T18 không trùng layout, tên handler I/C/menu thật, filter “Tất cả” thứ hai, tab chưa có ảnh, QUALITY_COL, data stat/preview/class/start/resume/backup. Spec bảo toàn hành vi gốc và không ép code đoán. Chụp M01/M03 + test save/tooltip.
5. **Thiên kiếp:** F11 không có ring radius/width, wave interval, timer start callback: dùng shape/timer nguyên bản; skip chỉ consume ở pre-timer an toàn; nếu không có hook pre-timer thì overlay song song, bỏ khi warn và chuyển nguyên phím cho handler gốc. Không sửa damage hay thắng/thua.
6. **Art:** đã kiểm ảnh bằng mắt, chưa tích hợp camera V36, no new collision. Menu được upscale từ ảnh sinh gốc. Cần thật sự chạy gameplay để xác nhận 60fps, tương phản, layout, save, quest, không đè telegraph. Không có repo code trực tiếp trong gói, test ở đây là dữ liệu/spec/asset tĩnh; chưa phải kiểm game.

## CHAT (dán vào ops/CHAT.md)

[2026-11-21] ChatGPT → @Claude (GÓI 02 / T32–T38,T23b): Nộp BATCH_02.zip v1.3 thay v1.2 đủ 15 file, kiểm lại chính tuyến, RNG, HP/stats, UI, dữ liệu và ảnh, phát triển 36 câu dẫn chính tuyến, hồ sơ tám vùng, 5 recap, 10 dạng đòn, 72 lựa chọn kỳ ngộ, hướng dẫn I/C/menu/thiên kiếp và thiết kế sinh hoạt nội thất; giữ toàn bộ luật và ID hiện hữu. 5 chương/8 legacy text/18 main/10 side; 25 quái/15 boss/45 mã; 24 kỳ ngộ đủ 9 vùng với 72 lựa chọn; lore 63+14+9+11+10+4+3+40; spec I/C, menu, thiên kiếp; key art 1920×1080 và 4 concept phòng. JSON/ID/count/reward/enum/length/geometry tĩnh ĐẠT. BRIEF 15:37 dùng nguyên bản. Nhờ Claude review các câu hỏi mở (save quest, region boss ẩn, buff, hợp nhất T18/T36, hook V30 và asset) rồi giao Muse; không sửa src.

## HANDOFF (dán vào ops/HANDOFF.md)

### [2026-11-21] BATCH_02 v1.3 — ChatGPT
**Đã làm:** B1 T32 → B2 T33 → B3 T34 → B4 T35 → B5 T36 → B6 T37 → B7 T38 → B8 T23b. v1.2 mở rộng chiều sâu gameplay trong các file đã giao; không đổi số lượng quest/event, không thêm file ngoài cấu trúc.

**File đã tạo:** data/quests.js, ops/specs/story.md, data/bestiary.js, ops/specs/boss_intro.md, data/events.js, data/lore.js, ops/specs/panels_ui.md, ops/specs/menu_ui.md, assets/menu_keyart.png, ops/specs/breakthrough.md, assets/interior_herbalist_concept.png, assets/interior_shop_concept.png, assets/interior_wanderer_concept.png, assets/interior_sentry_concept.png, BATCH_02_REPORT.md. BRIEF.md thay bằng bản gốc 15:37 từ gói giao việc, không đưa vào ZIP nộp.

**Chưa làm / không chắc:** tích hợp game, cờ quest và event matcher, mapping region boss ẩn, V30 timer/ring, handler tab, cân bằng runtime, font/DPR/FPS. Không đổi data gói 01 hoặc code.

**Cần chủ dự án quyết định:** Claude review các câu hỏi mở và giao Muse triển khai theo thứ tự/phụ thuộc hiện hữu; không tự đổi trạng thái DONE.

**Việc tiếp theo:** Claude review, Muse triển khai theo việc code được giao; T24 có thể nhận 4 concept sau review T23b, ưu tiên inn theo Gói 01. 

### TASKS

T32, T33, T34, T35, T36, T37, T38, T23b → REVIEW. Chờ Claude đối chiếu và duyệt DONE.
