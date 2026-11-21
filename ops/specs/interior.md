# T23 — Nhà & nội thất v1.2

21/11/2026 · B3 Gói 01 · Cho T24 (Muse). Tham chiếu T10 §14, T15 và phụ lục, T21 §3–4. Bản đầu ưu tiên inn; 4 phòng còn lại dùng cùng bố cục/hệ vẽ, triển khai sau khi inn đạt.

## 1. Mục tiêu

Nâng cấp đúng 5 cảnh V36 hiện có (`v36Inside()`): người chơi bước vào một gian nhà tiên hiệp góc 3/4, thấy vật thể có tỷ lệ và bóng nhất quán, phân biệt vật có chức năng và trang trí. Không thêm phòng, NPC, cơ chế sản xuất/nghỉ, không đổi đường vào/ra, va chạm, vị trí NPC/cửa hoặc save. Bố cục sau là thiết kế logical px 1280×720, không phải xác nhận tọa độ world hiện tại: Claude/Muse đối chiếu V36 trước khi triển khai; nếu lệch anchor/collision, giữ tọa độ thực và chuyển bố trí mỹ thuật tương đối, không tự dời rào/cửa/NPC.

## 2. Khung và vật liệu chung

| Thành phần | Rect / hình học | Thiết kế |
|---|---|---|
| Khung cảnh | 128,96,1024,526 | Clip tranh phòng; bên ngoài ink #100b13, không đen đặc che HUD |
| Tường hậu | 148,112,984,136 | gỗ/cột; nhìn thấy mặt trước, không mái che nhân vật |
| Tường bên trái/phải | 148,248,74,314 và 1058,248,74,314 | mỏng, mở mặt tiền để đọc sàn; không là collision mới |
| Sàn | đa giác (222,238),(1058,238),(1132,584),(148,584) | ván/đá phối cảnh nhẹ; tông paper #f1e4cf pha ink .24 |
| Lối đi trung tâm | 542,324,196,246 | giữ trống, chỉ thảm phẳng không collision; kết thúc trước bàn tiếp kiến y310, cách bàn 14px |
| Lối vào/ra | 566,570,148,40 | ký hiệu ngưỡng cửa; lấy vị trí cửa thật thay nếu lệch |
| Cột hậu | 230,112,34,150 và 1016,112,34,150 | gỗ sơn đỏ trầm red #f18474 phủ ink .62 |
| Cột cửa trước | 186,510,32,74 và 1062,510,32,74 | chỉ vẽ nếu không che anchor lối ra; depth theo chân cột; đặt ngoài cụm đồ |
| Đèn tường | 204,152,22,42 và 1058,152,22,42 | nguồn tại (215,173) và (1069,173), nếu vật thật vẽ được; tách khỏi kệ, NPC; không tương tác |
| Tên phòng | 460,46,360,30 | V18Serif 23px paper, bóng ink 1px, căn giữa; nếu renderer có tên vùng thì thay nội dung trong slot tên vùng cũ, không thêm tiêu đề; hiện theo thời lượng title cũ khi vào phòng |

Góc camera nhìn từ phía trước hơi cao, tường sau và mặt trên đồ thấy rõ; đường sàn hội tụ nhẹ lên phía hậu, mặt đứng vẫn thẳng. Vật thể chia layer: sàn/tường/thảm tĩnh → bóng và vật thể thấp → sắp xếp NPC, player, đồ/cột che khuất theo điểm chân thật → nguồn sáng theo T21 → HUD T10/T12, tooltip, dialogue T15. Không vẽ lại nền thôn hoặc dùng ảnh concept thay tọa độ collider. Vật thể chỉ một lớp bóng: theo T21 §4.2 (contact 0.8W×0.12H, clamp 18–100×6–16, alpha .24K; ambient 1.2W×0.20H clamp 24–135×10–25, alpha .11K, lệch phải/xuống 3K; ink #100b13). Anchor mỗi vật ở tâm đáy rect; cạnh gỗ có sáng từ trên trái, bóng mềm, thớ không quá dày. Vật thể tĩnh đã có bóng trong tranh không đổ bóng lại.

Cách dùng tông: gỗ paper #f1e4cf pha ink #100b13 (alpha .55–.75), sơn đỏ red pha ink .62, đồng gold #e3b96f, ngọc jade #a8d6c5, bóng ink; 5 màu nhấn V36 giữ nguyên (bảng dưới), chỉ dùng trên rèm, đệm, viền chủ đề, 10–20% diện tích. Không thêm màu UI ngoài C. Kích thước người theo sprite thật T21, không scale riêng ở nhà.

## 3. Bố cục 5 nội thất

Mỗi rect mô tả bounding box vẽ (x,y,w,h), không tạo hitbox. Điểm chân mặc định x+w/2,y+h; NPC/điểm tương tác lấy anchor thật, tuyệt đối không tự tạo từ tọa độ trang trí. Tất cả rect nằm trong (128,96,1024,526). Vật cao ở tường, vật thấp sát cạnh, lối giữa 196px sạch từ y324 tới cửa. Các vùng đệm/trải sàn phẳng cho phép đi qua nếu nền gốc cho phép.

**Quy tắc đặt đồ khi ghép V36:** chỉ vẽ vật thể khối (bàn, kệ, rương, giường, cột) trên footprint cản đi đã có hoặc vùng ngoài sàn đi được. Không vẽ một vật đặc giữa vùng đi được khiến người chơi xuyên qua đồ; nếu vị trí đề xuất va lối đi thật, ưu tiên đổi sang vật phẳng sát tường, dời within khung tới footprint có sẵn hoặc bỏ vật trang trí. Không tạo collider mới và không đẩy hero/NPC. Anchor NPC/điểm E và đoạn từ điểm spawn tới cửa được ưu tiên hơn toàn bộ rect mỹ thuật. Thảm, hoa văn sàn không có bóng tiếp đất riêng. Kiểm chân vật nằm trong đa giác sàn hoặc chạm hậu/tường (không nổi giữa khoảng trống).

### 3.1 inn — Thanh Vân Đại Điện (hall, #e9ce93)

Đại điện trang trọng, không xa hoa: bình phong sau, bàn gỗ thấp và bồ đoàn, kệ sách. Thảm mỏng chạy từ cửa vào đại sảnh.

| Vật thể | Rect | Tác dụng |
|---|---|---|
| Bình phong 3 tấm, tranh núi không chữ | 470,120,340,128 | Trang trí |
| Bàn tiếp kiến | 500,248,280,62 | Chỉ gợi vị trí NPC inn, thoại qua NPC thật |
| Kệ thư quyển trái | 276,172,170,120 | Trang trí |
| Kệ cuộn phải | 834,172,170,120 | Trang trí |
| Bàn trà trái | 276,366,160,72 | Trang trí |
| Bồ đoàn trái/phải | 452,372,70,46 và 758,372,70,46 | Trang trí, không tạo tu luyện |
| Thảm phẳng | 555,310,170,250 | Chỉ họa tiết, không khóa lối |
| Ghế dài phải | 858,380,166,64 | Nghỉ về mặt mỹ thuật, hồi HP theo cơ chế thôn sẵn có |

Trưởng lão hiện ở điểm V36/NPC inn đã có, không vẽ chân dung hay người vào nền. Bàn sau không che NPC. Khi NPC thật không ở trong cảnh thì bàn không có prompt. Nếu bàn chặn anchor NPC hoặc lối tới NPC, dời/bỏ bàn thay vì dời NPC. Khoảng tiếp kiến ở trước mép bàn y310, giữa x542–738 từ y324; giữ trống, không đặt ghế vào đây.

### 3.2 herbalist — Bách Thảo Dược Đường (herb, #b7dfa2)

Tủ thuốc, khay rễ cây, giấy gói, lò nhỏ và bàn nghiên cứu; ánh sáng kín đáo; không chữ trên đồ.

| Vật thể | Rect | Tác dụng |
|---|---|---|
| Tủ thuốc nhiều ngăn | 274,126,390,132 | Trang trí |
| Giá lọ dược | 768,138,258,120 | Trang trí |
| Bàn bốc thuốc | 280,310,208,84 | Gợi NPC herbalist; E NPC → thoại |
| Lò đan | 832,308,112,116 | Nếu scene đã có điểm sinh hoạt, E điểm thật → v13Open |
| Khay thảo mộc | 816,454,200,56 | Trang trí |
| Rổ thuốc | 322,458,112,56 | Trang trí |

### 3.3 shop — Vạn Bảo Phường (trade, #e9bd81)

Kệ hàng, quầy, hộp bảo vật đóng; không tạo quầy mua bán thứ hai.

| Vật thể | Rect | Tác dụng |
|---|---|---|
| Kệ hàng trái | 276,130,226,130 | Trang trí |
| Kệ hàng phải | 778,130,226,130 | Trang trí |
| Quầy giao dịch trái | 280,286,224,88 | Gợi NPC shop → thoại T15 / mua bán theo phụ lục T16 |
| Tủ bảo vật thấp | 808,298,196,94 | Trang trí |
| Rương đóng | 288,454,126,70 | Trang trí, không nhặt |
| Bàn trà khách | 842,458,164,68 | Trang trí |

### 3.4 wanderer — Kiếm Tu Quán (sword, #b8cde8)

Không gian võ quán tĩnh: ống kiếm, giá kiếm và bàn lau kiếm, giữ sàn rộng, không tạo sân chiến đấu.

| Vật thể | Rect | Tác dụng |
|---|---|---|
| Giá kiếm tường trái | 276,134,190,116 | Trang trí |
| Bình phong trơn | 490,122,300,116 | Trang trí |
| Kệ sách võ phổ | 832,138,172,116 | Trang trí |
| Bàn lau kiếm | 276,318,214,80 | E điểm NPC wanderer thật → thoại |
| Ghế dài | 834,336,180,64 | Trang trí / hồi phục thôn nếu được cơ chế cũ áp dụng |
| Giá binh khí thấp | 864,462,136,74 | Trang trí |

### 3.5 sentry — Đông Môn Hộ Vệ Đường (guard, #a9d8df)

Trạm trực giản dị: giá giáp, bàn trực, giường nghỉ và hòm, không cờ nhiệm vụ mới.

| Vật thể | Rect | Tác dụng |
|---|---|---|
| Giá giáo trái | 276,134,178,126 | Trang trí |
| Giá giáp phải | 826,134,178,130 | Trang trí |
| Bàn trực | 272,298,218,74 | E NPC sentry thật → thoại |
| Giường gỗ | 816,312,204,112 | Mỹ thuật nghỉ; chỉ hồi HP theo thôn |
| Hòm vật tư | 308,464,146,64 | Trang trí |
| Ghế dài | 836,464,168,60 | Trang trí |

## 4. Tương tác, ánh sáng, chuyển cảnh

### 4.1 Mặt bằng và anchor kiểm tra

Mặt bằng đọc từ hậu (y112) xuống tiền sảnh (y584). Ba dải x: trái 222–530, giữa 542–738, phải 750–1058. Các tên dưới đây chỉ vị trí đồ theo §3, không thay rect bằng lưới.

| Phòng | Hậu trái / giữa / phải | Giữa trái / giữa / phải | Tiền trái / giữa / phải |
|---|---|---|---|
| inn | Kệ sách / bình phong + bàn tiếp kiến / kệ cuộn | Bàn trà + bồ đoàn / tiếp kiến, thảm / bồ đoàn + ghế | Trống / thảm → cửa / trống |
| herbalist | Tủ thuốc / mép tủ sát hậu / giá lọ | Bàn bốc thuốc / lối đi / lò | Rổ thuốc / cửa / khay thảo mộc |
| shop | Kệ trái / tường trống / kệ phải | Quầy / lối đi / tủ thấp | Rương / cửa / bàn trà |
| wanderer | Giá kiếm / bình phong / kệ võ phổ | Bàn lau kiếm / lối đi / ghế dài | Trống / cửa / giá binh khí |
| sentry | Giá giáo / tường trống / giá giáp | Bàn trực / lối đi / giường | Hòm / cửa / ghế |

| Phòng | Chân NPC dự kiến (x,y) | Vùng đối thoại dự kiến (x,y,w,h) | Mốc dẫn từ spawn đến vùng đứng |
|---|---|---|---|
| inn | (640,318) | 590,324,100,46 | (640,554) → (640,372) |
| herbalist | (510,398) | 494,406,44,36 | (640,554) → (640,424) → (538,424) |
| shop | (516,374) | 506,382,34,42 | (640,554) → (640,403) → (540,403) |
| wanderer | (510,398) | 494,406,44,36 | (640,554) → (640,424) → (538,424) |
| sentry | (510,372) | 494,380,44,42 | (640,554) → (640,401) → (538,401) |

Điểm spawn minh họa chung (640,554), mốc ra (640,590); lò herbalist có vùng đứng minh họa (790,424) chỉ khi hook thật tồn tại. Đây là tọa độ **thiết kế mỹ thuật**, không phải anchor hay đường đi gameplay: trước khi vẽ, lập bảng đối chiếu room id → scene/khung thực → spawn/cửa thật → chân NPC thật → vùng tương tác/collider thật. Ảnh debug phải đánh dấu các anchor thật, kiểm đường từ spawn tới NPC và cửa; dời đồ/đổi decor phẳng nếu chồng. Không thêm hitbox hoặc thay spawn để ép khớp bảng. Không bắt actor đi theo tuyến minh họa.

### 4.2 Hợp đồng phân lớp

| Lớp | Nội dung | Quy tắc |
|---|---|---|
| 0 | Sàn, tường hậu/bên | Cache theo phòng/scale; không bake người, prompt, đồ có thể che người |
| 1 | Họa tiết sàn, thảm | Phẳng, đi xuyên được nếu nền gốc cho phép |
| 2 | Bóng mềm và sprite đồ khối | Bóng một lần; bóng nằm trên sàn, không lên tường; mỗi đồ giữ điểm chân |
| 3 | NPC, player, đồ khối, cột | Depth sort chung theo y chân thật; khi bằng y, giữ thứ tự ổn định theo renderer cũ |
| 4 | Phần che tiền cảnh nếu có | Tách phần trên cột/đồ khỏi nền, chỉ che khi actor đứng sau; không tạo lớp phủ kín phòng |
| 5 | Ánh sáng thế giới T21 và HUD | Ánh sáng chỉ một pass, HUD/tooltip/dialogue vẽ cuối, không tint |

Footprint tham khảo đồ khối: x+0,08w, y+0,8h, 0,84w, 0,2h (silhouette tiếp sàn, không collider). Chỉ chấp nhận nếu footprint thuộc vùng cản thật/ngoài sàn đi được; kiểm bằng overlay debug theo V36. Nếu V36 không có footprint/collision phù hợp, dùng decor phẳng/sát tường hoặc bỏ. Trước T22 (triển khai T21) dùng ánh sáng V36 cũ, không thêm glow/grade mới; khi T22 sẵn sàng dùng một pass T21. Trước T16 giữ thoại NPC cũ, không tự tạo panel hoặc E mới.

### 4.3 Hành vi và ánh sáng

| Điểm/hành động | Nguồn thật | Khi hiện / hành vi |
|---|---|---|
| Vào/ra | 5 cửa V36, handler E/điểm ra đã có | Dùng nguyên điều kiện/cảnh/anchor/hitbox; không thêm hotkey. T10 §14 và T25b giữ bán kính 125px, prompt cửa ngoại thất chỉ khi gần, không combat |
| Tiếp kiến/nói chuyện | NPC id inn, herbalist, shop, wanderer, sentry | E theo điều kiện tương tác gốc; mở T15/T30 (T16), trước T16 giữ hộp NPC cũ; giữ nhiệm vụ phụ |
| Lò/bàn sinh hoạt | điểm chính thức gắn v13Open | Chỉ khi V36 có hook/điểm sinh hoạt hợp lệ, E gọi handler v13Open vốn có; nếu không có thì decor, không hiện prompt |
| Mua bán | hành động NPC shop đã có | Không mở panel shop mới; T15 + phụ lục T16 giữ chọn mua hàng, nhiệm vụ NPC cũ |
| Ghế, giường, bồ đoàn | hồi HP nhanh ở thôn hiện hữu | Không E, không bấm ngủ/tu luyện; chỉ nghỉ tự nhiên nếu V36 đang được cơ chế thôn cấp hồi. Không tăng hồi, không tua giờ |

Prompt tương tác duy nhất dùng vùng và renderer [E] đã có ở T10, không tạo prompt nổi trùng. Nếu thiết kế cần nhãn tại đồ, chỉ tooltip gần anchor thật khi đủ điều kiện tương tác: rect tối đa 220×28 ở (anchorX−110,anchorY−56), clamp x24..1036 y96..584, ink .88 viền gold .45; chữ V45Sans 13px paper, fade 180ms. Nếu chồng prompt T10/NPC/đối thoại, bỏ tooltip; vật decor không icon, không cursor tương tác. Không tự thêm marker E cho lò nếu chưa xác nhận điểm thật. Enter/exit giữ transition gốc; nếu chưa có fade, đề xuất fade ink 160ms vào + 160ms ra, opacity 0→1→0, chỉ chuyển scene đúng một lần ở giữa, giữ vị trí spawn gốc. Khi dialogue/modal hiện: ẩn tooltip và chặn E thế giới theo quy tắc panel hiện hành, không mở modal chồng.

Ánh sáng: dùng đúng T21 §3, không cộng overlay ngày–đêm thứ hai; nguồn đèn tại 2 đèn thật được renderer vẽ, không dùng tọa độ concept để phát glow. Halo screen #FFD298 62px, alpha đỉnh 0.26×L, nhấp 1800–2600ms ±4%; cửa sổ thật #F1C18D 48px 0.18×L; lò đang cháy thật #EFB17E 76px 0.14+0.12L, 700–1100ms hệ số 0.88–1.10. Nguồn chưa có anchor hoặc trạng thái thì không glow động; không vẽ ánh xuyên tường/cột. Tối đa 6 nguồn, tối đa 2 halo chồng, fade 150ms; cull/clip theo T21. Trong phòng không có nguồn thật thì chỉ grading hiện hành; giữ màu giao diện. Sàn/tường và đồ ở hậu không che actor cache theo room id, xây lại khi đổi cảnh/scale; đồ có overlap actor giữ riêng layer/sprite để depth sort theo chân, không bake cả phòng đè người. Không render thớ động mỗi frame.

## 5. Ngoại thất

Giữ nguyên nền thôn V47T đang dùng (T29 phóng nét riêng), tuyệt đối không vẽ lại nhà làm lệch cửa. Mái ngói cong, đầu đao, cột gỗ đỏ trầm, nền đá be và đèn lồng vàng theo tranh hiện tại; nếu renderer có sprite/decor nhà thay được, sơn/viền nhẹ theo các màu §2, không dịch chân cột hoặc silhouette ảnh. Nếu đã baked trong ảnh, giữ nguyên và chỉ đặt halo lên đèn đã xác nhận anchor bằng POI thật (T21). Không thêm cửa/cột collision. Icon cửa thuộc T10 §14/T25b, giữ màu nhấn từng phòng đã có, bán kính 125, cao hơn điểm cửa 28px, 22px và fade 180ms, không combat. Không ép tên NPC thành tên phòng nếu renderer đang dùng tên NPC.

## 6. Dữ liệu và phạm vi

Nguồn duy nhất: `v36Inside()`, room id/theme/màu V36, NPC ID T14, `v13Open`, handler enter/exit/E hiện hành, `p.worldTime`, scene/camera thật, `p.hp/currentStats().hp` và logic hồi ở thôn. Không thêm field save. Claude xác nhận kích thước phòng, cửa, vị trí chân NPC/colliders, v13Open có hợp lệ trong phòng nào, đường mua hàng T16, nguồn sáng thật. Nếu khung phòng hiện có khác, chuyển tỷ lệ từng rect theo khung thật một lần, sau đó giữ mọi anchor thật; không vẽ vật chắn đường. Không suy tên biến chưa có.

Concept `assets/interior_inn_concept.png`: tham chiếu phương hướng mỹ thuật góc 3/4 cho inn; không dùng làm nền gameplay/collider tự động. Tranh thủ công HD tiên hiệp, gỗ thông ấm, bình phong núi, kệ sách, bàn tiếp kiến phía hậu, thảm nhạt, hai bồ đoàn, bàn trà, ghế, hai đèn. Không chữ, không người, không UI. Đồ trong spec mới là bố cục chuẩn thiết kế; phối cảnh concept minh họa không dùng làm tọa độ pixel thật.

Không làm phòng mới, NPC mới, rest buff, ngủ tua giờ, chế tạo mới, kho riêng, minigame, nhiệm vụ, floor collision, camera, đổi tỷ lệ actor, thay ảnh thôn, code game. T24 ưu tiên dựng inn và kiểm vào/ra trước; 4 phòng theo cùng hợp đồng sau review.

## 7. Checklist nghiệm thu

- [ ] Vào/ra đúng 5 cửa cũ, spawn/anchor/collision/quest giữ nguyên; không phòng thứ sáu, không NPC mới.
- [ ] Inn góc 3/4 giống concept; 4 phòng phân biệt chủ đề, tọa độ rect trong khung, lối giữa không bị chắn, player không lọt dưới sàn.
- [ ] Hero và NPC cùng tỷ lệ, chân/bóng khớp; đồ mềm bóng, không bóng đen kép; layer che khuất đúng chân.
- [ ] Ngày/đêm chuyển mượt, đèn/lò đúng nguồn thật, không halo xuyên tường/HUD, ≤6 nguồn; không thay hệ sáng T21.
- [ ] Chỉ NPC/điểm thật có E; đồ décor không prompt, gần/xa cửa T25b đúng; dialogue T15/T30 không đè prompt.
- [ ] v13Open chỉ gọi khi có hook hiện hữu, shop không thêm panel mới, nghỉ không tạo hồi mới; save không thay.
- [ ] Ngoại thất và collider nền thôn không đổi, giữ mái/cột/đèn và màu phòng V36; 1280×720/HiDPI không cắt HUD, Esc/E xử lý đúng.
- [ ] FPS ổn định, không cache rebuild per frame, không lỗi console; mở/đóng nhiều lần không kẹt scene.
- [ ] Thử đi sát mỗi bàn/kệ/giường/cột, ra/vào và tiếp cận NPC từ các hướng: không xuyên đồ đặc, không đổi collision/anchor; bỏ hoặc dời decor nếu footprint thật không khớp; tên phòng không chồng HUD tên vùng.
- [ ] Từng phòng có ảnh debug 1280×720 ghi spawn, exit, NPC, điểm E, collider thật; kiểm đường spawn → NPC → exit từ hai phía, không dựa vào tọa độ minh họa; chụp ảnh trước/sau khi actor đi ngang đồ cao. T22/T16 chưa xong thì fallback đúng quy định §4.2.
