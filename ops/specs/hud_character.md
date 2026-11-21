# T10 — HUD NHÂN VẬT (Wandering Sword)

Dự án: Vạn Đạo Tu Tiên · Canvas 1280×720 · 21/11/2026
Phiên bản 1.1 — Nộp REVIEW theo BRIEF mới; T02b đã DONE.

## 1. Mục tiêu

- HUD khám phá tối giản, ưu tiên cảnh quan thủy mặc HD; giữ chức năng/phím cũ.
- Sửa đủ năm lỗi V47.1: tu vi chồng cảnh giới, khung đen lớn, mắt chồng địa danh, dock cắt nhãn/menu trùng chữ và tiêu đề vùng chồng trạng thái (khung đen thuộc lỗi thứ nhất).
- Dành vùng dưới giữa cho giao diện chiến đấu T12, không đổi gameplay hay save.

## 2. Quy chuẩn chung

- Canvas logic 1280×720, lề an toàn 24px (x24–1256, y24–696). Mọi rect trong spec là x,y,w,h theo góc trái trên; scale toàn Canvas và hitbox cùng phép biến đổi.
- Palette Design Bible: ink #100b13 (nền panel 88% opacity), paper #f1e4cf (chữ), gold #e3b96f (viền/nổi bật), jade #a8d6c5 (thông tin tốt/MP), muted #b5a18b (chữ phụ), red #f18474 (HP/nguy hiểm). Không thêm màu mới.
- Tiêu đề V18Serif, số/UI V45Sans, tối thiểu 12px. Viền 1px gold opacity 45%, bo 6px. Dùng ornament()/box() hiện có. Chữ nổi trên ảnh có bóng ink 1px, không tạo khung đen lớn.
- Chỉ một vùng hitbox cho mỗi điều khiển, chỉ nhận input khi hiển thị/kích hoạt; panel modal ưu tiên, không click xuyên xuống world.

## 3. Cụm danh tính (trên trái)

Vùng x24,y24,w312,h112; không có panel nền bao toàn cụm.

| Thành phần | x | y | w | h | Kiểu/nguồn |
|---|---:|---:|---:|---:|---|
| Chân dung tròn | 24 | 28 | 64 | 64 | Viền gold 2px, ảnh hiện có |
| Badge cấp | 67 | 71 | 22 | 22 | Nền ink, chữ 12px paper, p.level |
| Tên nhân vật | 100 | 24 | 236 | 40 | Serif 20px, p.v8Name (Vô Danh nếu rỗng) |
| Cảnh giới | 100 | 64 | 236 | 16 | Sans 13px jade, realm() |
| Chiến lực | 100 | 80 | 236 | 14 | Sans 12px gold, v10FightPower(currentStats()) |
| Hàng HP | 100 | 98 | 236 | 16 | Sans 12px |
| Hàng MP | 100 | 118 | 236 | 16 | Sans 12px |

Tên tối đa hai dòng line-height 20px, nếu một dòng căn giữa dọc. Nếu dài, dùng font 18→12px và tooltip tên đầy đủ; không xóa tên thật, không đè cảnh giới. Cảnh giới/chiến lực hai dòng riêng. Không có tu vi ở đây.

HP/MP: nhãn x100,w24; thanh x128,w116,h6 tại y103/y123; số x252,w84, căn phải, ghi hiện tại/tối đa, font 12px. Nền ink alpha 75%, HP red, MP jade, bo 3px. Tỷ lệ clamp 0–1, max không hợp lệ thì thanh rỗng. Dữ liệu p.hp, p.mp, currentStats().hp/.mp. Số cập nhật ngay, độ dài nội suy 180ms. HP ≤25% nhấp nhẹ viền 1.200ms; không nhấp cả HUD.

Trong combat T12, danh tính y24–94 giữ nguyên; HP/MP chuyển sang thanh dài trong cùng trục x24–336. T11 không tạo HUD HP/MP thứ hai trong chế độ khám phá; giữ combat dock gốc đến khi T13 tích hợp.

## 4. Tên vùng (trên giữa)

| Thành phần | x | y | w | h |
|---|---:|---:|---:|---:|
| Trạng thái vùng | 384 | 24 | 512 | 18 |
| Tên khu vực | 384 | 46 | 512 | 36 |
| Đường trang trí | 510 | 88 | 260 | 1 |

Căn giữa; trạng thái Sans 13px, an toàn jade/nguy hiểm red; tên Serif 30px paper, đường gold alpha 65%. Không panel nền lớn. Hai vùng text cách 4px. Nếu tên dài hạ xuống tối thiểu 18px; không chồng trạng thái.

Hiện khi nhân vật nhập thế, tải nhân vật hoặc chuyển khu vực/map (không kích hoạt lại mỗi frame). Fade-in 200ms, giữ 2.200ms, fade-out 400ms; ẩn sau 2.800ms. Nguồn p.mapId và metadata vùng hiện có; giữ tên an toàn/nguy hiểm theo game thật. Sau khi ẩn, minimap vẫn hiện thông tin.

## 5. Minimap (trên phải)

Panel x1024,y24,w232,h124.

| Thành phần | x | y | w | h |
|---|---:|---:|---:|---:|
| Ảnh minimap | 1036 | 36 | 100 | 64 |
| Thông tin vùng | 1146 | 36 | 98 | 64 |
| Nút Bản đồ | 1036 | 112 | 208 | 24 |

Tên vùng 13px paper, trạng thái 12px jade/red, cấp vùng 12px muted; line-height 17px. Tên dài wrap tối đa hai dòng trong vùng 64px, không cắt nhãn; các dòng phụ vẫn hiện đủ. Tái sử dụng marker và phép biến đổi minimap hiện có, không sửa thuật toán minimap.

Nút Bản đồ: Sans 13px, chữ căn trái inset 8px, M căn phải inset 8px, hover viền gold 120ms. Giữ hành vi phím M và click cũ.

## 6. Thiên mệnh / nhiệm vụ (trên phải)

Panel x1024,y160,w232,h132. Tiêu đề x1036,y172,w144,h18 Serif 15px gold. Nút thu gọn x1190,y168,w22,h22; nút nhật ký Q x1222,y168,w22,h22.

- Tên nhiệm vụ x1036,y200,w208,h36, Sans 14px đậm, line-height 16px, hai dòng; tiến độ x1036,y240,w208,h14, Sans 12px jade.
- Khoảng cách x1036,y266,w102,h16, Sans 12px muted. Nút Dẫn đường x1144,y260,w100,h24, Sans 12px. Nút chỉ hiện nếu nhiệm vụ có dẫn đường hợp lệ.
- Nếu tên nhiệm vụ dài hơn hai dòng: thêm hàng cao 16px, tối đa thêm 48px; dời tiến độ/khoảng cách/nút xuống đúng mức thêm, panel cao tối đa 180px. Tooltip tên đầy đủ nếu vẫn quá dài. Không cắt nhãn nút.
- Thu gọn panel còn h40, ẩn các hàng nội dung/hitbox; chuyển chiều cao 180ms. Nếu không theo dõi, hiện tiêu đề và hàng “Chưa theo dõi nhiệm vụ”, panel h62; giữ Q mở nhật ký. Dữ liệu, trạng thái, dẫn đường dùng nguồn nhiệm vụ hiện có, không thêm nhiệm vụ.

## 7. Nhãn vị trí và mắt (dưới trái)

- Nhãn x24,y548,w276,h54, inset 10px, 13px Sans paper; hai dòng tên vùng và địa điểm cục bộ, line-height 17px. Ví dụ Thanh Thạch Thôn / Thanh Vân Đại Điện.
- Nút mắt x306,y548,w44,h44, icon 24px, độc lập và cách panel 6px. Giữ action cũ của mắt. Tooltip tên action thực, không đặt icon bên trong vùng chữ.
- Tên dài wrap trong panel; nếu vượt quá hai dòng tăng h lên tối đa 70px về phía trên (giữ đáy y602), tooltip tên đầy đủ; không chạy ngang vào nút mắt.
- Ẩn khi game không có vị trí tương ứng; nếu chỉ có tên vùng dùng một dòng căn giữa dọc. Không thêm POI giả.

## 8. Cụm hành động khám phá (dưới giữa)

Vùng x414,y638,w452,h36 (chừa 2px cho nhãn tu vi bên dưới). 

| Nút | x | y | w | h |
|---|---:|---:|---:|---:|
| Sơ đồ thôn | 414 | 638 | 144 | 36 |
| Sân luyện | 568 | 638 | 144 | 36 |
| Theo nhiệm vụ | 722 | 638 | 144 | 36 |

Sans 13px, phím thật ở góc phải nếu có (M/F6 theo chức năng hiện hành), hover viền sáng 120ms, nhấn scale 0,97 trong 80ms. Chỉ hiện nút nếu hành động khả dụng; giữ từng slot cố định để không có nút nhảy vị trí. Không sửa hành vi đi tới.

Khi v45CombatHUD() trả true, cụm này ẩn và ngừng nhận input; dock chiến đấu hiện có tiếp tục hoạt động đủ 7 ô đến T13. T12 bố trí 7 ô tại x421–859,y602–658; T10 không xóa/đổi phím bất kỳ ô combat nào. Khi thoát combat, hiện lại cụm sau fade 200ms; không tồn tại hai hitbox cùng lúc.

## 9. Tu vi (dưới cùng)

- Nhãn x414,y676,w452,h14; căn giữa, Sans 12px paper, ví dụ “Tu vi 12 / 40”.
- Thanh x414,y692,w452,h4; nền ink, fill gold, bo 2px. Hai vùng nhãn/thanh không chồng; đáy y696.
- Nguồn p.xp/xpNeed(). Tỷ lệ clamp 0–1; max không hợp lệ hiển thị rỗng. Nội suy thanh 250ms; khi mới đủ tu vi phát sáng gold 600ms một lần, không tự đột phá.
- T13 giữ tu vi khi combat thường; khi thanh boss xuất hiện thì ẩn tu vi, phục hồi đúng nguồn sau khi boss ẩn. Không thay đổi XP.

## 10. Tài nguyên (dưới phải)

Vùng x950,y610,w306,h28. Linh thạch x950,y610,w148,h28 (p.stones); đan dược x1108,y610,w148,h28 (p.pills). Icon 18px, số Sans 13px paper; dùng icon sẵn có. Số quá dài giảm font tới 12px, tooltip đầy đủ. Trong T13, khi ô Hồi Xuân Đan combat đã hiện số lượng p.pills, ẩn riêng nhóm đan dược dưới phải (không ẩn linh thạch), khôi phục khi khám phá. Không tạo tài nguyên mới.

## 11. Dock chức năng (dưới phải)

Vùng x950,y646,w306,h46, 6 ô 46×46px, cách 6px.

| Ô | x | y | Chức năng |
|---|---:|---:|---|
| 1 | 950 | 646 | Âm thanh |
| 2 | 1002 | 646 | Túi đồ |
| 3 | 1054 | 646 | Kỹ năng (hoặc tên đầy đủ của action thực) |
| 4 | 1106 | 646 | Nhiệm vụ |
| 5 | 1158 | 646 | HUD |
| 6 | 1210 | 646 | Cài đặt |

Icon 24×24px căn giữa; badge phím góc trên phải 12px nếu có. Viền gold 1px, nền ink 88%, bo 6px. Không ghi nhãn dưới icon (loại bỏ Âm t…, Kỳ n…, Nhiệ…, Cài đ…). Tooltip hover 350ms, fade-in 120ms/out 100ms, h28,y574, rộng theo chữ tối đa 180px, căn theo ô và clamp x24–1256. Nếu tên vượt 180px, wrap hai dòng, h42 và y560. Tooltip đầy đủ tên chức năng và phím thật; giữ action thật, không đoán phím.

Dock này là dock chức năng góc phải, khác dock 7 ô chiến đấu dưới giữa. Nếu một action trong code cũ bị V45 chuyển chỗ, Claude xác nhận mapping; không xóa action có sẵn. Không đăng ký trùng listener.

## 12. Menu (dưới trái)

Nút x24,y646,w46,h46, icon 24px căn giữa, viền gold. Không có cả chữ MENU và Menu bên dưới. Tooltip “Menu” hover 350ms (x24,y610,w92,h28); giữ action mở menu và phím cũ. Không đổi nội dung menu.

## 13. HUD tự mờ khi khám phá

- Sau 5.000ms không di chuyển, không thao tác chuột/phím, không panel mở và v45CombatHUD() false: opacity cụm HUD từ 100%→65% trong 400ms; opacity panel vẫn nhân với alpha gốc. Không tự mờ thanh HP ≤25% hoặc tooltip đang tương tác.
- Khôi phục 100% trong 150ms khi di chuyển, input, hover HUD, nhận sát thương, nhiệm vụ mới hoặc combat true. Không đổi hitbox do opacity.
- Photo mode tiếp tục ẩn HUD theo cơ chế hiện có; không xóa trạng thái nhân vật. Không đè modal.

## 14. T25 — ký hiệu cửa nhà (chưa duyệt)

Mặc định TẮT. Nếu chủ dự án duyệt T25: dùng v39POIDraw hiện có; icon cửa 22×22px, gold, tâm nằm cao hơn điểm tương tác cửa 28px, fade-in/out 180ms. Chỉ hiện cửa có thể tương tác, trong bán kính tương tác hiện có, không hiện combat. Không thêm điểm cửa mới. T11 không tự bật khi T25 còn TODO.

## 15. Dữ liệu và tích hợp T11

| Thành phần | Nguồn / yêu cầu |
|---|---|
| Danh tính/HP/MP/tu vi | p.v8Name, p.level, realm(), v10FightPower(currentStats()), p.hp, p.mp, currentStats().hp/.mp, p.xp, xpNeed() |
| Tài nguyên | p.stones, p.pills |
| Vùng | p.mapId và metadata vùng thật |
| Combat/khám phá | v45CombatHUD(), v45Hub() theo review T12; không tự xác định combat theo timer mới |
| Nhiệm vụ, minimap, click nút, mắt | Dùng nguồn và handler hiện có, Claude xác nhận tên thật tại review; không tự tạo field/phím mới |

T02b đã DONE, theo BRIEF 12:48 T11 sửa trong src/47_v45_v35.js (v35Identity, v35Status, v35Map, v35Quest, v35Dock, v35Left, v35Nav, v35Feed, v35Render) và src/48_v48_v47.js (v471Mini, v471Quest, v471Dock). Claude xác nhận chỗ cập nhật hitbox. Không thêm lớp override; không đăng ký listener mỗi frame; cache thành phần tĩnh/font. Thứ tự vẽ: cảnh → nhân vật → HUD → tooltip → modal. Scale theo Canvas ở 3 kích thước kiểm thử; mục tiêu 60fps. T11 không làm T13.

## 16. Không làm

- Không viết lại cơ chế chiến đấu, AI, nhiệm vụ, minimap, save, chỉ số hay input.
- Không bật T25 nếu chưa duyệt. Không thêm tiền tệ, vật phẩm, POI hoặc dữ liệu mới.
- Không sửa ảnh nền/map, hệ thống nội thất, công pháp hay luật đột phá.
- HUD combat chi tiết thuộc T12/T13. T10 chỉ thiết lập hợp đồng bố cục và giữ nguyên combat đến khi T13 hoàn tất.

## 17. Checklist nghiệm thu

- [ ] HUD trong lề 24px, không chồng/cắt chữ ở 1280×720, 1366×768 và 1920×1080.
- [ ] Cụm danh tính không còn nền đen lớn; tên/cảnh giới/chiến lực tách riêng.
- [ ] Tu vi dưới đáy; nhãn không chồng thanh; tỷ lệ đúng p.xp/xpNeed().
- [ ] Trạng thái vùng và tên vùng không đè nhau; fade đúng 2.800ms.
- [ ] Icon mắt không chồng địa danh; tên dài/địa danh dài vẫn đọc được.
- [ ] Dock icon/tooltip tên đầy đủ; Menu không chữ lặp; mọi action/phím cũ hoạt động.
- [ ] Minimap, Q, dẫn đường, thu gọn nhiệm vụ đúng; không click xuyên panel.
- [ ] HP/MP, cấp, linh thạch, đan dược đúng nguồn; HP thấp không bị mờ.
- [ ] HUD tự mờ sau 5s, hiện lại 150ms; combat không mờ; photo mode đúng.
- [ ] Cụm hành động khám phá ẩn khi combat; đủ 7 chức năng combat gốc được giữ.
- [ ] Ký hiệu cửa vẫn tắt nếu T25 chưa duyệt.
- [ ] Không override HUD mới; không lỗi Console (M01 8 kịch bản), save cũ không đổi, FPS so với M02 không giảm đáng kể.
