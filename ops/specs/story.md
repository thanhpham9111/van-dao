# T32 — Chính tuyến Vạn Đạo Quy Chân v1.3

21/11/2026 · B1 Gói 02 · FACTS F1, F3–F7, F11. Giữ V12_MAIN 0–7 và toàn bộ thưởng/điều kiện hiện hành.

## 1. Cốt truyện (5 chương)

**Chương I — Thanh Trúc khởi đạo** · Thanh Thạch Thôn, Thanh Trúc Lâm · Luyện Khí (1–9), qua Trúc Cơ ở bước cũ. Thôn bình yên nhưng yêu thú bắt đầu tràn ra đường trúc; Trưởng lão Thanh Thạch của Thanh Vân Tông dẫn tân tu nhập đạo, Lục Thanh giữ cổng, Linh Dược chuẩn bị đan, Mộc Tử Y chăm thuốc, Tạ Vô Nhai luyện kiếm và Vân Tịch canh bia đá. Hạ Trúc Lang Vương, đột phá Trúc Cơ rồi vượt phòng đầu Vạn Giới: cửa bí cảnh hé lộ dấu vết trận pháp dẫn linh lực khỏi các vùng; đây là thí luyện cũ, không phải lần bắt buộc chinh phục Ma Vực cấp cao.

**Chương II — Vạn Yêu lạc mạch** · Vạn Yêu Sơn, Hắc Độc Trạch · Trúc Cơ (10–18). Hàn Liệt chỉ dấu vết Cổ kiếm Vạn Yêu, Đường Uyển của Bách Thảo Đường tìm nguyên nhân linh độc quanh dược thảo. Hai yêu vương bị đánh bại, nhưng dấu huyết khí và linh độc chỉ là hệ quả của một dòng khí bị cưỡng dẫn, dấu tiếp theo nằm ở tuyết vực.

**Chương III — Hàn hỏa đồng nguyên** · Bắc Minh Tuyết Vực, Xích Viêm Hoang Mạc · Kim Đan (19–27). Bạch Vân giúp đọc linh tuyền, Thiết Nham của Thiên Công Các đọc vân Xích Viêm Thạch: hàn và hỏa cùng chảy về một đại trận. Hạ Băng Quân và Xà Vương để tiếp cận đường linh mạch, không cần phá bỏ vật thiêng.

**Chương IV — Phong minh u ảnh** · Thiên Phong Cốc, U Minh Quỷ Vực · Nguyên Anh (28–36). Thanh Thạch dẫn lời tới Linh Đài, U Lan nghe tàn hồn cổ tu kể chuyện Tử Lôi Thiên Tôn muốn thâu linh mạch về một trận, lấy vạn đạo làm của riêng. Sau khi hạ hai hộ thú, tu sĩ hiểu Ma Môn là đường nối cuối trước lôi nguyên.

**Chương V — Vạn Giới quy chân** · Ma Vực, Tử Lôi Hoang Nguyên · Hóa Thần (37–45). Mạc Ly của Huyền Minh Điện giúp nhận ra nguy cơ trận Vạn Giới bị lợi dụng; người tu giải trừ Ma Vực Tôn Giả, lĩnh ngộ Tử Lôi Thần Tích rồi đối diện Thiên Tôn. Chiến thắng từ cấp 44 khép mâu thuẫn: kiếm, đan, khí, pháp tuy khác đường nhưng không đạo nào nên lấy sinh linh làm giá; thế giới vẫn mở, không reset hành trình.

Đây là diễn giải truyện đề xuất, không gán biến cố mới thành cơ chế, không đổi tiểu sử F3, không tuyên bố khóa/mở vùng mới. Bốn tông môn là bốn cách góp lời giải, không bắt nhân vật gia nhập hoặc đổi phái. Không thêm phản diện ngoài boss có sẵn.

## 2. Nhiệm vụ và hợp đồng tích hợp Q

- DATA.quests.chapters (5), legacyText (8 index), main (m09–m26, 18), side (s01–s10, 10). Chỉ thay chữ legacy 0–7; code mục tiêu/thưởng và phím giữ nguyên. M09 mở sau bước 7 hoàn thành và cấp ≥10. Thứ tự main theo file; minLevel là mức nhận/hiện tiến trình, không thay cổng vùng. Mỗi vùng boss 1 nhiệm vụ, c5 kết tại boss loi từ cấp 44. Giver ngoài thôn chỉ đúng vùng F3; inn là người dẫn chuyện từ thôn, không tạo NPC bản sao. Mọi main mới tự nhận đúng một lần khi bước trước hoàn thành và đủ minLevel, kể cả khi đang ở vùng xa; giver là nguồn lời dẫn, không buộc gặp NPC lần nữa. Nếu thiếu hook tự nhận, giữ cả tuyến mới chưa bật tới khi Claude xác nhận, không bắt quay thôn hay tạo dịch chuyển.
- Ghi nhận tiến độ boss/claim/discover từ nguồn xác thực đang có. POI claim một lần đọc p.claimed[id], không buộc nhặt lại, không cấp lại loot cơ duyên. Cờ boss và khám phá: đối chiếu save/runtime lâu dài; nếu thiếu cờ tin cậy nhưng mục tiêu lặp được, ghi lần đạt thật tiếp theo sau nhận. Trước khi bật C2, preflight cả 8 boss, 7 POI và 2 bước discover: nếu có mục tiêu không lặp được mà thiếu cờ xác thực, giữ toàn tuyến mới chưa bật, Q ghi “Chờ xác nhận tiến độ”; giữ nguyên legacy và yêu cầu Claude duyệt migration. Discover kiểm p.discovered theo T19; trường thiếu không được suy thành đã khám phá. Nếu người chơi đang đứng đúng vùng ở cảnh mở thật, việc hiện diện là chứng cứ runtime cho bước discover đang nhận; nếu không có nguồn hoặc chứng cứ thì chờ lần vào vùng thật tiếp theo. Không suy từ cấp, không reset POI/boss, không tự cấp cờ hay thưởng. Kill là bộ đếm theo ID vùng tại thời điểm hạ quái sau khi nhận, không giết nhầm boss sang quái nếu handler phân biệt. Hai nhiệm vụ có mục tiêu kill đang chạy cùng vùng đều có thể đếm cùng một kill thật, thưởng từng quest một lần. Talk xác nhận đúng NPC sau khi nhận và giữ quest thoại cũ. Side nhận từ NPC tại region ghi trong data, tùy chọn; s04 trở về inn, s10 trở về ghostSeer, không phải đường bắt buộc chính tuyến. Không sửa V8_TASKS/V12_SIDE/inn talk.
- Các bước mới chỉ dùng loại F6/F7 cho phép. Thưởng làm tròn gần nhất: stones=(10+2L), xp=0,4×(32+12(L−1)), boss ×1,5; đan 1/2/3 theo dải 1–9/10–27/28–45, boss ×1,5 làm tròn và trần 4. Không vượt cấp 45; XP khi max xử lý theo game cũ, không tự đổi thành tiền. Giao dịch hoàn thành một lần, dùng save flow hiện hữu, đề xuất lưu ID hoàn thành + tiến độ active riêng, không ghi đè V12_MAIN hay V8_TASKS; Claude duyệt tên trường trước triển khai.

- Nếu đã tích hợp v1.0: giữ ID, trạng thái hoàn thành và thưởng đã nhận; quest active s04/s10 tiếp tục mục tiêu và thưởng snapshot lúc nhận, quest chưa nhận dùng data hiện hành (mục tiêu/mốc/thưởng từ v1.1, lời dẫn v1.2 giữ nguyên trong v1.3). Không hồi tố thưởng/XP; không tự chuyển active thành hoàn thành. Các boss giảm minLevel nhưng không thay cấp đề nghị vùng hay sức boss; người chơi có thể luyện thêm trước khi đánh.
- Khóa cấp hiện “Cần cấp X” và mục tiêu tiếp theo, không ghi số XP cứng từ đề; hiển thị xpNeed() runtime. Quest chỉ là một nguồn XP, không hứa lên cấp đủ chỉ nhờ quest. Kiểm mục tiêu cấp 44 trước cap 45.
- Quy tắc nối bước đã có chứng cứ: kiểm cấp và predecessor trước khi ghi hoàn thành; mỗi quest dùng ID để commit trạng thái + thưởng cùng nhau, sau commit mới xét bước kế. Nếu nhiều POI/boss cũ đã đạt, xử lý tuần tự theo 18 bước, dừng khi thiếu cấp/chứng cứ; không auto hoàn thành kill m22 dựa vào kill trước nhận. Dừng ngay khi ghi save thất bại hoặc thiếu mapper chứng cứ, không tự chạy vòng lặp thưởng mỗi frame. Khi tải lại, nếu đã commit thì không trả lần hai; nếu chưa commit, khôi phục trạng thái và thử lại đúng ID theo handler, không tự giả thưởng.
- Đối chiếu T19 v1.2 review: 13 ROAD_EDGES là nét trình bày, không phải cổng cấp/cung đường bắt buộc. V22_REG.min/max là cấp đề nghị, dẫn đường qua v8SetGoal vẫn bấm được ở cấp thấp. Đặc biệt phong chỉ nối ma và loi trên bản đồ mực; không buộc đi qua hai vùng cao cấp để nhận m17. Dẫn đường bằng tọa độ REG/runtime thật, không dựng tuyến graph, teleport hoặc thêm cạnh; cảnh báo nguy hiểm hiện hữu khi đi vào vùng vượt cấp. Muse cần thử tới phong ở cấp 28 từ hoa; nếu runtime chặn thì trình Claude trước khi bật tuyến, không tự đổi map hoặc mốc cấp.

## 3. Trình bày tại nhật ký hiện hữu (1280×720)

Ảnh Q: panel (20,21,1240,678) giữ nguyên chức năng. Khung thống nhất ornament/box, ink #100b13 .92, viền gold #e3b96f .55, chữ paper #f1e4cf, jade #a8d6c5, muted #b5a18b, đỏ #f18474. V18Serif 28 tiêu đề, V45Sans 14–16 thân, 12 nhãn. Không sửa HUD T10/T12.

| Khối | Rect x,y,w,h | Nội dung |
|---|---|---|
| Tiêu đề + phụ | 42,35,842,52 | Thiên mệnh · Nhật ký; số tiến trình chính / tổng thực, cấp/cảnh giới, chương mở |
| Sân Luyện Kiếm | 900,35,330,40 | F6 · Sân Luyện Kiếm, giữ nút và handler gốc từ ảnh Q, không thêm điều kiện |
| 4 tab | 34,110,1212,44 | Chính tuyến / Nhiệm vụ phụ / Đã hoàn thành / Hướng dẫn; số đếm thật và thao tác gốc |
| Danh sách | 34,164,439,482 | Tên chương ở (48,176,392,20), 8 hàng (46,204+i×48,415,44); trang trước/sau (46,600,96,34)/(365,600,96,34) |
| Chi tiết | 485,164,761,482 | Chương (508,180,714,20), tên (508,204,714,32), trạng thái (508,246,714,24) |
| Nội dung | 508,292,714,88 | desc và tóm tắt; wrap tối đa 4 dòng, cuộn nội bộ nếu cần |
| Mục tiêu | 508,392,714,150 | mục tiêu, minLevel, tiến độ, đường dẫn thật |
| Thưởng | 508,552,714,30 | stones/pills/xp; xem số thật, nếu đã nhận ghi Đã nhận |
| Theo dõi/dẫn đường/đóng | 508,597,715,36 | 3 nút rộng 224, gap 10; không thêm hotkey |

Khi chọn quest, highlight gold .14/viền 1px, hover 100ms, fade chi tiết 140ms. Đang khóa hiển thị cấp/chương cần trước; không nhận click theo dõi/dẫn đường nếu thiếu mục tiêu thật. Chỉ dùng dẫn đường hiện hữu, không tự phát minh POI NPC. WASD hủy dẫn đường theo ảnh thực; Q/Esc đóng như cũ. lineStart và lineDone hiển thị trong khối mô tả/nhật ký khi nhận/hoàn thành; nếu dùng toast hiện hữu, đợi hết chuyển vùng và không chồng toast khác, 2200ms, không modal mới. Khi chương cuối hoàn thành chỉ ghi kết chương; người chơi vẫn điều khiển và khám phá.

Mỗi hàng x46,y=204+i×48,w415,h44: tên tại x58,y+4,w292,h20 V45Sans 14, trạng thái x58,y+24,w292,h16 12px; ô theo dõi x356,y+8,w94,h28 chỉ khi hành vi gốc cho phép, nhãn “Theo dõi” hoặc “Đang theo dõi”, hạ tới 12px và wrap 2 dòng nếu cần. Dấu gold/jade/muted xác nhận trạng thái không chỉ bằng màu. Click badge theo dõi gọi cùng handler nút chi tiết, không đồng thời chọn/hủy hai lần, click phần còn lại chọn quest. Khi tuyến mới chưa được bật, số chính tuyến là 8 legacy, không đếm 26 nhầm; sau tích hợp đúng 26. Nhiệm vụ phụ lấy tổng thật từ V12_SIDE/V8_TASKS/side mới (ảnh cũ 15, dự kiến 25 nếu cả 10 side thêm được xác nhận). Tab Đã hoàn thành đếm ID thực, không đếm toast.

## 4. Phát triển chiều sâu hành trình — hồ sơ tám vùng

Mỗi vùng có nhịp **đến → đọc dấu tích → tu luyện bên ngoài tuyến → đối đầu → chuyển manh mối**. Vùng không đổi biome, quái, đường nối, cổng và cấp; bảng này là nội dung giải thích trong Q, không phải quest mới hoặc yêu cầu phải làm đủ mọi hoạt động. Kể cả khám phá ngẫu nhiên, chỉ tiết lộ manh mối khi bước tương ứng đã hoàn thành.

| Vùng | Bước / cấp nhận | Manh mối (chỉ hiện khi đã đạt) | Hoạt động tự chọn, không phải điều kiện |
|---|---|---|---|
| Vạn Yêu Sơn | m09–10 / 10,12 | Cổ kiếm đổi hướng, huyết khí bị dẫn tới trạch. | s05, kỳ ngộ e04–06, hái Linh mộc/Huyền thiết theo nguồn gốc |
| Hắc Độc Trạch | m11–12 / 15,17 | Linh dược cho thấy dòng độc khí từ ngoài vùng. | s06, e07–09, Linh thảo, chuẩn bị Trúc Cơ tầng 9 |
| Bắc Minh Tuyết Vực | m13–14 / 19,21 | Linh tuyền lưu vân hỏa mạch, hai khí trái nhau đồng nguồn. | s07, e10–12, Linh tinh, đọc mẹo né băng |
| Xích Viêm Hoang Mạc | m15–16 / 24,26 | Vân Xích Viêm Thạch cho thấy linh lực chảy về đại trận. | s08, e13–15, Huyền thiết, chuẩn bị Kim Đan tầng 9 |
| Thiên Phong Cốc | m17–18 / 28,30 | Linh Đài chỉ về cổ mộ, chuẩn bị gặp U Lan. | e16–18, việc wind/windaltar gốc, Linh mộc |
| U Minh Quỷ Vực | m19–20 / 33,35 | Tàn hồn nói rõ Thiên Tôn muốn thâu vạn đạo. | s09, e19–20, Linh tinh, chuẩn bị Nguyên Anh tầng 9 |
| Ma Vực | m21–23 / 37,38,39 | Mạc Ly xác định Ma Môn là đầu mối cuối trước lôi nguyên. | s10, e21–22, Linh tinh/Huyền thiết |
| Tử Lôi Hoang Nguyên | m24–26 / 41,43,44 | Thần tích chỉ căn nguyên đại trận; hạ Thiên Tôn khép truyện. | e23–24, việc thunder/thunderaltar gốc, hoàn thiện trang bị |

### 4.1. Nhịp tu luyện có kiểm chứng

XP lý thuyết theo F1 từ cấp vào vùng đến cấp vào vùng tiếp theo, riêng loi tới 45. Chỉ cộng thưởng main mới trong khoảng đó, kể cả boss; không tính XP chiến đấu, POI, side, multiplier, overflow hoặc XP bị bỏ khi đột phá. Cột thiếu là khoảng tối thiểu phải lấp bằng nguồn khác trong giả định nhận đủ XP quest, **không phải số quái cần giết**.

| Dải cấp | XP cần | XP quest | Chênh tối thiểu |
|---|---:|---:|---:|
| 10→15 | 820 | 154 | 666 |
| 15→19 | 872 | 214 | 658 |
| 19→24 | 1360 | 262 | 1098 |
| 24→28 | 1304 | 322 | 982 |
| 28→33 | 1900 | 370 | 1530 |
| 33→37 | 1736 | 430 | 1306 |
| 37→41 | 1928 | 669 | 1259 |
| 41→45 | 2120 | 748 | 1372 |
| Tổng | 12040 | 3169 | 8871 |

Nếu người chơi chưa đủ cấp, Q gợi ý hoạt động đã mở trong chính vùng (không tự auto nhận). Nếu ở cấp 9/18/27/36 và đầy XP, ưu tiên hướng dẫn B khi đang ở thế giới mở theo F11, thay vì báo thiếu XP. Không hiển thị số thiếu lý thuyết F1 từ bảng trên cho người chơi, vì XP/bonus thực lấy runtime. Với người Lv45 vẫn hoàn thành tuyến, không ép farm hoặc chuyển thưởng XP sang linh thạch.

### 4.2. Tóm lược chương và gợi ý trong Q

Giữ các rect §3, không thêm tab hay HUD. Khi mở Q và chọn bước chính: nội dung trên cùng (508,292,714,88) hiển thị desc + lineStart tối đa 4 dòng, khi hoàn thành thay bằng lineDone. Trong khối mục tiêu, dành (520,404,690,24) cho tiến độ: số thực 0/1 hoặc n/count tại (520,404,120,24), thanh (650,412,560,6) jade trên ink, clamp 0–1; khóa/không có dữ liệu thì không vẽ tỷ lệ giả. (520,438,690,42) cho điều kiện khóa hoặc gợi ý, (520,490,690,42) cho vị trí/hướng (nếu runtime có khoảng cách thì giữ nhãn “Vị trí … · N bước”; không tính pixel từ ảnh). Với thẻ boss T33, ba ô chiêu thay nội dung dòng dưới; vị trí mục tiêu thật vẫn hiện trong dòng gợi ý trên khi không hover. Wrap 2 dòng 15px. Khi người chơi đang khóa, tên mục tiêu kế tiếp chỉ hiện nếu đã được mở trong nhật ký gốc, không hiện dòng hoàn thành chưa đạt. Gợi ý lấy dữ liệu §4 theo vùng và bước thực, không có nút nhận/dịch chuyển mới. Màu gold #e3b96f cho mục tiêu, jade #a8d6c5 cho đã đạt, muted #b5a18b cho chưa đủ điều kiện. Fade 140ms khi đổi mục, không tween số.

Với 8 legacy và nhiệm vụ phụ cũ không có lineStart/lineDone, giữ desc, chi tiết mục tiêu và trạng thái gốc; không đọc field không tồn tại. Khi chương kết thúc, tab Đã hoàn thành hiển thị tóm tắt đúng chương đã qua trong khối nội dung (không tự mở modal). Không hiện summary chương chưa hoàn thành (nhất là c5 nhắc tên Thiên Tôn); trước khi đạt m19 chỉ hiện tiêu đề chương/điều kiện khóa, không hiển thị lineDone hoặc mô tả kết chương tương lai. Hiển thị lần nữa khi người chơi chủ động xem Q; không phát lại toast, không duplicate thưởng. Các câu tóm lược:

| Chương | Dòng nhật ký khép chương |
|---|---|
| I | Qua thí luyện Vạn Giới, ta nhận ra rừng trúc chỉ là dấu hiệu đầu tiên. |
| II | Huyết khí và linh độc cùng chảy về phía bắc; linh mạch đã bị kéo lệch. |
| III | Hàn tuyết và hỏa mạch đồng nguồn; kẻ giữ đại trận đang ở xa hơn. |
| IV | Tàn hồn U Minh tiết lộ Tử Lôi Thiên Tôn, kẻ muốn thâu vạn đạo. |
| V | Thiên Tôn đã bại. Ta vẫn còn đường để tu hành, không còn bị đại trận dẫn dắt. |

Tông môn gắn vào chất liệu truyện, không thành khóa nhiệm vụ: Thanh Vân giải đọc trận qua kiếm ý, Bách Thảo giải độc qua dược mạch, Thiên Công đọc vân khoáng, Huyền Minh chỉ đường trận. Không suy diễn NPC phát buff/công pháp hoặc đổi thiện cảm qua những câu này.

## 5. Không làm / checklist

Không đổi level gate gốc, spawn, boss, loot, 8 bước V12_MAIN, 4 V12_SIDE, V8_TASKS, NPC, tông môn, phím hoặc code game. Không thêm hệ dialogue/cutscene/trigger chưa duyệt; nội dung không tự kích hoạt sự kiện.

- [ ] Đủ 5 chương 10 vùng, 8 legacyText khớp index, 18 main theo đúng minLevel, 10 side 10 NPC, 8 boss vùng nối tiếp.
- [ ] Save cũ đã xong bước 7 tiếp tục m09; bước 0–7 giữ điều kiện/thưởng/phím, không nhận thưởng lần hai.
- [ ] POI/boss đã đạt trước nhận quest có đường xác nhận hoặc migration được duyệt, không buộc tái spawn giả.
- [ ] Q 1280×720/HiDPI: 4 tab, 8 hàng, phân trang, mục tiêu, thưởng, theo dõi/dẫn đường/đóng; chữ không che HUD; WASD hủy dẫn đường.
- [ ] Kill sai vùng không tính, đúng vùng tính; hoàn thành trước/sau save/load không lặp thưởng. Boss cuối nhận từ Lv44, Lv45 vẫn có thể hoàn thành; không vượt cap hay khóa thế giới.
- [ ] Đọc từng manh mối theo m09→m26: không lộ thủ phạm trước m19, không bắt side/kỳ ngộ, không báo lấp đủ XP bằng quest. Bốn mốc đột phá hiển thị hướng dẫn đúng điều kiện.
- [ ] Tab Đã hoàn thành xem lại 5 recap, không replay thưởng/animation; lưu lại, đổi vùng, khóa cấp và mở Q vẫn giữ tiến độ thật.
- [ ] Giữ nút F6 Sân Luyện Kiếm, badge theo dõi theo dòng, số đếm từ dữ liệu thật, thanh tiến độ. Kiểm Lv28 tới phong không bắt đi qua ma/loi, không thêm khóa vùng giả.
