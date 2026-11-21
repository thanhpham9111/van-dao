# T10 — HUD NHÂN VẬT (Wandering Sword)

Dự án: Vạn Đạo Tu Tiên · Canvas 1280×720 · 21/11/2026
Phiên bản 1.2 — Nộp lại REVIEW; sửa 6 điểm chính và 2 điểm nhỏ theo BRIEF 12:56, mục 9 / hud_character_review.md. T02b đã DONE.

## 1. Mục tiêu

- HUD khám phá tối giản, ưu tiên cảnh quan thủy mặc HD; giữ chức năng/phím cũ.
- Sửa các lỗi HUD V47.1 đã xác nhận: tu vi chồng cảnh giới/khung đen lớn, dock cắt chữ, menu lặp chữ, tiêu đề vùng chồng trạng thái. Không tạo nút mắt: review xác nhận đây là con trỏ chuột, bảng dưới trái là bảng tin sự kiện.
- Dành vùng dưới giữa cho giao diện chiến đấu T12, không đổi gameplay hay save.

## 2. Quy chuẩn chung

- Canvas logic 1280×720, lề an toàn 24px (x24–1256, y24–696). Mọi rect trong spec là vị trí GỐC x,y,w,h theo góc trái trên ở HUD mặc định. Áp biến đổi nhóm v35Group (mục 13) đúng một lần rồi scale toàn Canvas; hitbox dùng cùng phép biến đổi.
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

T11: khi v45CombatHUD() true, ẨN cả hai hàng HP/MP trên trái (kể cả hitbox/tooltip), giữ HP/MP của v35Dock chiến đấu gốc; danh tính y24–94 còn hiện. Khi false, HP/MP trở lại đúng vị trí trong bảng. T13 mới đồng thời bỏ HP/MP ở v35Dock và thay bằng thanh dài trên trái x24–336,y98–145 theo T12; không có giai đoạn vẽ hai cụm. Tu vi và linh thạch đang được v35Identity/v35Status vẽ ở vị trí cũ phải bỏ khỏi đây, chuyển sang mục 9/10.

## 4. Tên vùng (trên giữa)

| Thành phần | x | y | w | h |
|---|---:|---:|---:|---:|
| Trạng thái vùng | 384 | 24 | 512 | 18 |
| Tên khu vực | 384 | 46 | 512 | 36 |
| Đường trang trí | 510 | 88 | 260 | 1 |

Căn giữa; trạng thái Sans 13px, an toàn jade/nguy hiểm red; tên Serif 30px paper, đường gold alpha 65%. Không panel nền lớn. Hai vùng text cách 4px. Nếu tên dài hạ xuống tối thiểu 18px; không chồng trạng thái.

Chọn phương án (a) theo review: trong thôn V47T, v45Location(true,false) luôn hiện cố định “Khu vực an toàn” / “Thanh Thạch Thôn” tại hai vùng trên; không chạy fade tiêu đề theo thời gian, không mất tên khi đứng lâu. Đây là hành vi hiện có được giữ. Ngoài thôn (world/bí cảnh), v45Location(hub,target) dùng owTitle khi nhập thế/tải/chuyển vùng: fade-in 200ms, giữ 2.200ms, fade-out 400ms, tổng 2.800ms, chỉ kích một lần mỗi sự kiện owTitle thật, không reset mỗi frame. Nguồn p.mapId và metadata vùng thật; sau khi ẩn minimap vẫn hiện thông tin. Không sửa logic chuyển vùng. Title thôn vẫn có thể nhân hệ số mờ khám phá ở mục 13, nhưng không biến mất do timeout.

### 4.1. Thông báo (toast) — notify/v21Notice

Tái sử dụng notify/v21Notice trong v45Location, giữ nguyên nội dung, ưu tiên/thời hạn/điều kiện ẩn sẵn có; không thêm queue hay timer dữ liệu. Hộp x430,y100,w420,h36 (căn giữa x640), nền ink 88%, viền gold 1px, bo 6px, padding 8px ngang/4px dọc; chữ Sans 13px paper, tối đa hai dòng line-height 14px. Nếu quá dài, giảm xuống 12px và tooltip đầy đủ, không tràn vào title. Khi có mục tiêu đang hiển thị ở vùng trên giữa, chuyển toast xuống x430,y150,w420,h36 (T12 dành y104–142 cho target). Chọn y trước khi vẽ ngay theo điều kiện target của v45Location; không đè tiêu đề thôn y24–89 hoặc target. Toast dùng thời gian hiện có, fade 180ms ở cuối nếu còn lifetime; không kéo dài thời hạn. Toast luôn đủ alpha, không tự mờ khi idle. Chỉ hiện một thông báo theo cơ chế sẵn có, ẩn khi hết hạn/không có notify.

## 5. Minimap (trên phải)

Panel x1024,y24,w232,h124.

| Thành phần | x | y | w | h |
|---|---:|---:|---:|---:|
| Ảnh minimap | 1036 | 36 | 100 | 64 |
| Thông tin vùng | 1146 | 36 | 98 | 64 |
| Nút Bản đồ | 1036 | 112 | 208 | 24 |

Tên vùng 13px paper, trạng thái 12px jade/red, cấp vùng 12px muted; line-height 17px. Tên dài wrap tối đa hai dòng trong vùng 64px, không cắt nhãn; các dòng phụ vẫn hiện đủ. Tái sử dụng marker và phép biến đổi minimap hiện có, không sửa thuật toán minimap.

Nút Bản đồ: Sans 13px, chữ căn trái inset 8px, M căn phải inset 8px, hover viền gold 120ms. Giữ hành vi phím M và click cũ. Trong thôn sửa v471Mini, ngoài thôn sửa v35Map; khung V45_BOXES.map, nhóm map.

## 6. Thiên mệnh / nhiệm vụ (trên phải)

Panel x1024,y160,w232,h132. Tiêu đề x1036,y172,w144,h18 Serif 15px gold. Nút thu gọn x1190,y168,w22,h22; nút nhật ký Q x1222,y168,w22,h22.

- Tên nhiệm vụ x1036,y200,w208,h36, Sans 14px đậm, line-height 16px, hai dòng; tiến độ x1036,y240,w208,h14, Sans 12px jade.
- Khoảng cách x1036,y266,w102,h16, Sans 12px muted. Nút x1144,y260,w100,h24, Sans 12px: “Dẫn đường” khi hành động dẫn đường hợp lệ; đổi đúng thành “Công pháp” nếu t.action==='skill', giữ action gốc v12Guide(t) tương ứng. Không tạo nút dẫn đường giả, không cắt chữ Công pháp.
- Nếu tên nhiệm vụ dài hơn hai dòng: thêm hàng cao 16px, tối đa thêm 48px; dời tiến độ/khoảng cách/nút xuống đúng mức thêm, panel cao tối đa 180px. Tooltip tên đầy đủ nếu vẫn quá dài. Không cắt nhãn nút.
- Thu gọn panel còn h40, ẩn các hàng nội dung/hitbox; chuyển chiều cao 180ms. Nếu không theo dõi, hiện tiêu đề và hàng “Chưa theo dõi nhiệm vụ”, panel h62. Dữ liệu v12Tracked(), v12Progress(t), v42QuestFraction(t); v34State().quest cho thu gọn; v12Guide(t) cho action; v12Open cho Q/nhật ký, không thêm nhiệm vụ. Thôn: v471Quest; ngoài: v35Quest; nhóm quest.

## 7. Bảng tin sự kiện (dưới trái)

- Đây là v35Feed, không phải địa danh. Không tạo nút/icon mắt hoặc hitbox tương ứng; con trỏ chuột của game giữ nguyên.
- Vùng mặc định x24,y544,w300,h86. Tối đa 3 dòng, mỗi card x24,w300,h28; y544,573,602 (gap 1px). Dòng mới nhất luôn nằm dưới tại y602; có hai dòng dùng y573/602, một dòng dùng y602. Hiển thị đúng dữ liệu event hiện có, không thêm dòng địa danh giả.
- Nền ink 88%, vạch gold 2px ở trái, chữ Sans 12px paper, inset ngang 8px/vert 1px, line-height 13px. Dòng dài wrap tối đa 2 dòng; nếu quá dài, tooltip nguyên văn x24,y508,w300,h34 khi hover 350ms. Không để chữ tràn sang dock trung tâm.
- Giữ vòng đời 7.000ms/dòng từ v35Feed; fade alpha trong 400ms cuối (6.600–7.000ms), hết thời hạn bỏ khỏi hiển thị; khi hết dòng hoặc v34State().feed tắt thì không vẽ/hitbox. Không reset thời gian khi mở F2/đóng drawer. Mặc định nhóm feed. Khi V33.menu mở, drawer Đạo đồ ưu tiên hiển thị trên feed; ẩn tạm feed nếu drawer che khu vực này, giữ thời gian sự kiện. Đáy feed y630, cách menu y646 16px, không chồng cụm hành động x414 trở đi.

## 8. Cụm hành động khám phá (dưới giữa)

Vùng x414,y638,w452,h36 (chừa 2px cho nhãn tu vi bên dưới). 

| Nút | x | y | w | h |
|---|---:|---:|---:|---:|
| Sơ đồ thôn | 414 | 638 | 144 | 36 |
| Sân luyện | 568 | 638 | 144 | 36 |
| Theo nhiệm vụ | 722 | 638 | 144 | 36 |

Sans 13px, phím thật ở góc phải nếu có (M/F6 theo chức năng hiện hành), hover viền sáng 120ms, nhấn scale 0,97 trong 80ms. Chỉ hiện nút nếu hành động khả dụng; giữ từng slot cố định để không có nút nhảy vị trí. Không sửa hành vi đi tới.

### 8.1. Trạng thái gần điểm tương tác trong thôn / hub

Khi v471Dock (thôn) hoặc v45HubDock (ngoài thôn an toàn) xác nhận một điểm E hợp lệ theo điều kiện tương tác hiện có, thay hai ô đầu bằng MỘT nút “Tên điểm [E]”, x425,y638,w276,h36 (căn giữa vùng hai ô x414–712); ô Theo nhiệm vụ vẫn x722,y638,w144,h36. Font 13px paper, viền gold, badge E 12px ở phải, tên điểm từ POI/NPC thật; nếu dài dùng 12px, tooltip đầy đủ, không cắt chữ tên nút. Khi ra khỏi phạm vi, hai ô Sơ đồ thôn/Sân luyện trở lại. Transition 120ms, đổi hitbox ngay theo trạng thái gốc, không để nút ẩn nhận click; gọi đúng action E hiện có, không thêm điểm/radius mới.

### 8.2. Nút E ngoài thôn (world/bí cảnh)

Giữ prompt tương tác hiện có trong v35Render khi điểm E hợp lệ. Khi cụm 8.1 không phụ trách điểm đó: nút x502,y552,w276,h36, tâm x640, chữ “Tên điểm [E]”, gold/ink như nút gộp. Khi combat true nhưng điều kiện tương tác gốc vẫn cho phép, dịch riêng prompt tới x502,y462,w276,h36 để không đè tooltip skill T12 y512–590. Không tự cho phép tương tác khi game không cho. Chỉ một prompt E cho một điểm, không hiện trùng prompt và nút gộp; khi rời phạm vi thì ẩn, fade 120ms. Ưu tiên click E gốc và không click xuyên xuống world. Cả prompt E và cụm dưới giữa thuộc nhóm dock.

Khi v45CombatHUD() trả true, cụm hành động khám phá/gộp ở đáy ẩn và ngừng nhận input; prompt E ngoài thôn chỉ hiện theo điều kiện mục 8.2. Dock chiến đấu hiện có tiếp tục đủ 7 ô đến T13. T12 v1.2 bố trí 7 ô tại x421–859,y602–658; T10 không xóa/đổi phím bất kỳ ô combat nào. Khi thoát combat, hiện lại cụm sau fade 200ms; không tồn tại hai bộ hitbox cùng lúc.

## 9. Tu vi (dưới cùng)

- Nhãn x414,y676,w452,h14; căn giữa, Sans 12px paper, ví dụ “Tu vi 12 / 40”.
- Thanh x414,y692,w452,h4; nền ink, fill gold, bo 2px. Hai vùng nhãn/thanh không chồng; đáy y696.
- Nguồn p.xp/xpNeed(). Tỷ lệ clamp 0–1; max không hợp lệ hiển thị rỗng. Nội suy thanh 250ms; khi mới đủ tu vi phát sáng gold 600ms một lần, không tự đột phá.
- Tu vi thuộc nhóm dock (đi cùng bố cục dưới giữa, không kéo theo chân dung). T13 giữ tu vi khi combat thường; khi thanh boss thực sự được vẽ thì ẩn tu vi, phục hồi đúng nguồn sau khi boss ẩn. Không thay đổi XP.

## 10. Tài nguyên (dưới phải)

Vùng x950,y610,w306,h28, thuộc nhóm nav (cùng dock chức năng). Linh thạch x950,y610,w148,h28 (p.stones); đan dược x1108,y610,w148,h28 (p.pills). Icon 18px, số Sans 13px paper; dùng icon sẵn có. Số quá dài giảm font tới 12px, tooltip đầy đủ. Trong T13, khi ô Hồi Xuân Đan combat thực sự được vẽ số lượng p.pills, ẩn riêng nhóm đan dược dưới phải (không ẩn linh thạch), khôi phục nếu ô H bị ẩn/khám phá. Không tạo tài nguyên mới.

## 11. Dock chức năng (dưới phải)

Vùng x950,y646,w306,h46, 6 ô 46×46px, cách 6px.

| Ô | x | y | Chức năng (v35Nav) | Phím/action |
|---|---:|---:|---|---|
| 1 | 950 | 646 | Âm thanh | Không phím; v41AudioToggle |
| 2 | 1002 | 646 | Hành trang | I |
| 3 | 1054 | 646 | Công pháp | T; sáng khi v11SkillPoints()>0 |
| 4 | 1106 | 646 | Nhật ký | Q |
| 5 | 1158 | 646 | Tùy chỉnh HUD | F2; v35Open |
| 6 | 1210 | 646 | Cài đặt | Esc |

Icon 24×24px căn giữa; badge phím góc trên phải 12px nếu có. Viền gold 1px, nền ink 88%, bo 6px. Không ghi nhãn dưới icon (loại bỏ Âm t…, Kỳ n…, Nhiệ…, Cài đ…). Tooltip hover 350ms, fade-in 120ms/out 100ms, h28,y574, rộng theo chữ tối đa 180px, căn theo ô và clamp x24–1256. Nếu tên vượt 180px, wrap hai dòng, h42 và y560. Tooltip đầy đủ tên chức năng và phím thật; giữ action thật, không đoán phím.

Dock này là dock chức năng nhóm nav, khác dock 7 ô chiến đấu dưới giữa. Giữ đúng v35Nav và handler gốc; ô Công pháp sáng viền gold khi v11SkillPoints()>0, chuyển độ sáng 180ms khi trạng thái điểm thay đổi, không tự học. Ô Âm thanh không có badge phím. F2 phải mở màn hình tùy chỉnh gốc kể cả khi nav bị người chơi ẩn. Không xóa action hay đăng ký trùng listener.

## 12. Menu (dưới trái)

Nút x24,y646,w46,h46, icon 24px căn giữa, viền gold. Không có cả chữ MENU và Menu bên dưới. Tooltip “Menu” hover 350ms (x82,y646,w92,h28; không đè feed). v35Control mở/đóng V33.menu, menu “Đạo đồ” qua v33Drawer, không có phím riêng. Giữ panel drawer và action gốc; nếu mở, panel ưu tiên input/vẽ hơn feed. Nhóm left. Không đổi nội dung menu.

## 13. Tùy chỉnh HUD F2 và tự mờ khi khám phá

### 13.1. Bảo toàn thiết lập HUD

Giữ v35Open (phím F2 và ô nav), toàn bộ tính năng kéo, scale, chỉnh opacity, ẩn/hiện nhóm qua v35Group, save p.v35. Không reset p.v35 khi nâng phiên bản, không ghi tọa độ tuyệt đối mới vào save. Các tọa độ spec là GỐC; áp đúng transform/alpha/visibility nhóm hiện có, tương tự cách v35Group xử lý offset, scale và anchor hiện tại. Chỉ áp một lần cho hình vẽ và hitbox/tooltip; người chơi tự tùy chỉnh có thể thay đổi bố cục mặc định, giữ cơ chế clamp gốc thay vì ép về spec.

| Nhóm v35Group | Thành phần T10/T12 thuộc nhóm |
|---|---|
| identity | Chân dung, tên, cảnh giới, cấp, chiến lực, HP/MP trên trái (T13) |
| map | Minimap, thông tin vùng, nút M |
| quest | Thiên mệnh, thu gọn, Q, Dẫn đường/Công pháp |
| target | Mục tiêu hiện có; T12 gồm mục tiêu thường và thanh boss/pha |
| dock | Nút khám phá, nút E (gộp/prompt ngoài thôn), tu vi, 7 ô combat; HP/MP dock gốc còn ở T11 |
| left | Menu Đạo đồ và điều khiển nhóm left hiện có |
| nav | 6 ô chức năng, linh thạch, số đan ngoài combat |
| feed | Bảng tin sự kiện |

Tên vùng và toast của v45Location giữ cơ chế screen anchor hiện có, không tạo nhóm save thứ chín; không gom chúng vào một nhóm tùy chỉnh không liên quan. Nếu đã có transform cho v45Location trong code, bảo toàn đúng transform gốc. Khi mở F2, toàn bộ nhóm có preview/điều khiển theo logic tùy chỉnh hiện có, không auto fade và không phát input gameplay; đóng F2 phục hồi trạng thái ẩn/hiện và opacity đã lưu.

### 13.2. Tự mờ

- Sau 5.000ms không di chuyển, không thao tác chuột/phím, không panel/F2 mở và v45CombatHUD() false: hệ số idle của HUD từ 1→0,65 trong 400ms. Alpha thực = alpha thành phần × opacity nhóm người chơi đã đặt × hệ số idle. Ví dụ panel 0,88, opacity nhóm 0,8 → 0,4576 khi idle. Không ghi đè p.v35, không hiện nhóm bị ẩn. HP ≤25% hoặc tooltip đang tương tác dùng hệ số idle 1, vẫn tôn trọng opacity/visibility nhóm. Toast không nhân idle.
- Khôi phục hệ số idle 1 trong 150ms khi di chuyển, input, hover HUD, nhận sát thương, nhiệm vụ mới, mở F2 hoặc combat true. Không đổi hitbox do opacity, không ép opacity người chơi thành 100%.
- Photo mode tiếp tục ẩn HUD theo cơ chế hiện có; không xóa trạng thái nhân vật. Không đè modal.

## 14. T25 — ký hiệu cửa nhà (chưa duyệt)

Mặc định TẮT. Nếu chủ dự án duyệt T25: dùng v39POIDraw hiện có; icon cửa 22×22px, gold, tâm nằm cao hơn điểm tương tác cửa 28px, fade-in/out 180ms. Chỉ hiện cửa có thể tương tác, trong bán kính tương tác hiện có, không hiện combat. Không thêm điểm cửa mới. T11 không tự bật khi T25 còn TODO.

## 15. Dữ liệu và tích hợp T11

| Thành phần | Nguồn / yêu cầu |
|---|---|
| Danh tính/HP/MP/tu vi | v35Identity(s), v35Status(), v34Bar; p.v8Name, p.level, realm(), v10FightPower(currentStats()), p.hp, p.mp, currentStats().hp/.mp, p.xp, xpNeed() |
| Tài nguyên | p.stones, p.pills; bỏ phần cũ khỏi v35Identity/v35Status |
| Vùng và toast | v45Location(hub,target), owTitle, notify/v21Notice, p.mapId và metadata vùng thật |
| Minimap | v471Mini (thôn), v35Map (ngoài), V45_BOXES.map |
| Thiên mệnh | v471Quest/v35Quest; v12Tracked(), v12Progress(t), v42QuestFraction(t), v12Guide(t), v34State().quest, v12Open; t.action==='skill' |
| Hành động | v471Dock (thôn), v45HubDock (hub ngoài), v35Dock (combat), E trong v35Render (ngoài thôn) |
| Nav | v35Nav, v41AudioToggle, v11SkillPoints(), v35Open; I/T/Q/F2/Esc theo bảng mục 11 |
| Menu | v35Control, V33.menu, v33Drawer |
| Feed | v35Feed, v34State().feed; tối đa 3 tin, 7s |
| Tùy chỉnh | v35Group, v35Open, p.v35 |
| Combat/khám phá | v45CombatHUD(), v45Hub() theo review T12; không tự xác định combat theo timer mới |

T02b đã DONE. T11 phải cập nhật CẢ HAI đường vẽ HUD, không chỉ v35Render:

| Đường vẽ | File / hàm | Yêu cầu |
|---|---|---|
| Trong thôn V47T | src/48_v48_v47.js: v47tDraw (~419), v471Mini, v471Quest, v471Dock | v47tDraw gọi v35Identity+v35Status, v471Mini/Quest/Dock, v35Nav, v35Control(12,651,51,'menu','MENU',...), v35Feed, v45Location(true,false); chuyển tọa độ/call đúng spec, không bỏ nhánh riêng |
| Ngoài thôn / bí cảnh | src/47_v45_v35.js: v35Render(world) | v35Identity, v35Status, v35Map, v35Quest, v35Dock, v35Left, v35Nav, v35Feed, v45Location, v45HubDock, E prompt; dùng chung quy tắc nhóm và rect với thôn |

Claude đã xác nhận tên hàm theo review; Muse cập nhật hitbox và wrapper v35Group theo cơ chế gốc trong cả hai đường. Không thêm lớp override/listener mỗi frame; cache thành phần tĩnh/font. Thứ tự vẽ cảnh → nhân vật → HUD → toast → tooltip → modal/drawer; không vẽ toast trùng. Scale/hitbox ở 3 kích thước kiểm thử; mục tiêu 60fps. T11 không làm T13.

## 16. Không làm

- Không viết lại cơ chế chiến đấu, AI, nhiệm vụ, minimap, save, chỉ số hay input. Không reset F2/p.v35, không tạo nút mắt, không thay đổi hành vi notify.
- Không bật T25 nếu chưa duyệt. Không thêm tiền tệ, vật phẩm, POI hoặc dữ liệu mới.
- Không sửa ảnh nền/map, hệ thống nội thất, công pháp hay luật đột phá.
- HUD combat chi tiết thuộc T12/T13. T10 chỉ thiết lập hợp đồng bố cục và giữ nguyên combat đến khi T13 hoàn tất.

## 17. Checklist nghiệm thu

- [ ] HUD trong lề 24px, không chồng/cắt chữ ở 1280×720, 1366×768 và 1920×1080.
- [ ] Cụm danh tính không còn nền đen lớn; tên/cảnh giới/chiến lực tách riêng.
- [ ] Tu vi dưới đáy; nhãn không chồng thanh; tỷ lệ đúng p.xp/xpNeed().
- [ ] Tên vùng/trạng thái tách riêng; trong thôn luôn hiện cố định, ngoài thôn fade 2.800ms.
- [ ] v35Feed tối đa 3 dòng, tin mới ở dưới, tự hết sau 7s, không đè menu/cụm hành động; không có nút mắt giả.
- [ ] Notify/v21Notice đúng x430,y100 hoặc y150 khi có target, không chồng title/target, tự ẩn theo timer gốc.
- [ ] Dock icon/tooltip tên đầy đủ; Menu không chữ lặp; mọi action/phím cũ hoạt động.
- [ ] Minimap, Q, dẫn đường, thu gọn nhiệm vụ đúng; nút Công pháp khi t.action==='skill'; không click xuyên panel.
- [ ] Nav 6 chức năng đúng tên/phím: không phím Âm thanh, I/T/Q/F2/Esc; Công pháp sáng khi có điểm.
- [ ] F2 kéo/scale/opacity/ẩn từng nhóm đúng, hitbox khớp, load save p.v35 không mất tùy chỉnh; alpha idle nhân với opacity người chơi.
- [ ] HP/MP, cấp, linh thạch, đan dược đúng nguồn; HP thấp không bị mờ.
- [ ] HUD tự mờ sau 5s, hiện lại 150ms; combat không mờ; photo mode đúng.
- [ ] Gần điểm trong thôn/hub gộp hai ô đầu thành nút Tên điểm [E] rộng 276px; Theo nhiệm vụ giữ vị trí; xa điểm trả hai ô, không hitbox trùng.
- [ ] Prompt E ngoài thôn đúng vị trí, không trùng nút gộp, chỉ hiện khi tương tác thật khả dụng.
- [ ] Cụm hành động khám phá ẩn khi combat; đủ 7 chức năng combat gốc được giữ. T11 ẩn HP/MP trên trái khi combat, chỉ dock hiện HP/MP; T13 chuyển duy nhất lên trái.
- [ ] Kiểm riêng thôn V47T (v47tDraw) và ngoài thôn/bí cảnh (v35Render); cả hai tuân cùng layout và nhóm F2.
- [ ] Ký hiệu cửa vẫn tắt nếu T25 chưa duyệt.
- [ ] Không override HUD mới; không lỗi Console (M01 8 kịch bản), save cũ không đổi, FPS so với M02 không giảm đáng kể.
