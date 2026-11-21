# T33 — Yêu thú chí và thẻ danh hiệu boss v1.2

21/11/2026 · B2 Gói 02 · F1/F2, T12 v1.3 §5, T10 v1.2. Mục tiêu: nhấn uy áp boss theo Warm Snow, không thay AI, HP, đòn, pha, loot, tốc độ game. Dữ liệu là danh xưng/lời thoại, không phải enemy config.

## 1. Điều kiện và dữ liệu

Đọc DATA.bestiary.monsters theo field `type` (map lookup, không phụ thuộc sort); tên gốc TYPES[e.type].name luôn là chuẩn. Boss lấy bossType(e.type) và đối tượng sống hợp lệ; vị trí player/địch world thực, khoảng cách Euclid ≤650 world px như fallback v34Target() T12. Thẻ giới thiệu tối đa **một lần trong mỗi lần nạp vùng/instance bí cảnh**, chỉ ở cảnh chiến đấu thực (không menu/test preview), lần đầu vừa vào tầm hoặc spawn trong tầm. Nếu nhiều boss đồng thời, ưu tiên target v34Target(), rồi gần nhất, tie theo thứ tự runtime; không phát lại khi đổi target/ra vào 650 trong cùng load. Bộ đánh dấu transient, reset đúng khi nạp vùng/instance mới, không ghi save. Khi modal, Photo/F2 target ẩn, chuyển cảnh hoặc nhân vật chết: ẩn thẻ; nếu chưa từng hiện và còn hợp lệ khi đóng modal, có thể hiện lần đầu; đã hiện không lặp. Không phát thẻ tại map load overlay.

Boss bí cảnh/ẩn type 7,20–24 không có mapId thật trong FACTS: region null, monsters.regions []; match type tại instance thực, không lọc theo region giả. Element chỉ phục vụ văn bản, không tạo kháng hệ. Hints không xác nhận máu/công/tốc tăng theo pha; không sửa stats. Moves map 3 mã trong F1 hoặc bộ đề bài bí cảnh; chỉ dùng label nếu handler hiện có báo đúng mã, không đoán mã từ animation.

## 2. Bố cục thẻ (logic 1280×720)

Khung thẻ cách toast giữa trên (y100 hoặc 150, h36), không chạm boss T12 (x360,y664,w560 vùng bar), không chạm HP y24–145. Không kéo camera hay di chuyển target. V18Serif và V45Sans. Dùng C: ink #100b13, paper #f1e4cf, gold #e3b96f, muted #b5a18b, red #f18474, jade #a8d6c5.

| Thành phần | Rect | Kiểu |
|---|---|---|
| Nét mực cọ nền | 380,202,520,104 | ink .70, cạnh rách alpha feather 18px, hai nét ngang red .20; cache mask, không black toàn màn |
| Danh hiệu | 404,211,472,20 | V45Sans 14 gold, căn giữa, 1 dòng |
| Tên boss | 404,234,472,38 | V18Serif 30 paper, stroke ink 2px, hạ tới 24 nếu dài |
| Lời intro | 404,277,472,20 | V45Sans 14 paper; nếu dài, wrap 2 dòng 16px trong 472×32 và mở nền h116 tới y318 |
| Pha / bại trận | 400,202,480,48 | Nền ink .65, câu V45Sans 15, tối đa 2 dòng; pha red/gold, defeat jade |

Không dùng panel/card opaque toàn giữa; người vẫn thấy địch/telegraph. Intro vào 180ms (alpha 0→1; nét cọ reveal ngang 0→520, không di chuyển chữ), giữ 1000ms, ra 220ms; tổng 1400ms. Không slow motion (0ms), không đóng băng, không hit-stop thêm. Alpha tối đa nền .70. Khi telegraph đang hoạt động giao với rect thẻ (kể cả chữ), ẩn thẻ ngay trong frame đó; không chỉ giảm nền. Không dời thẻ vào một vùng HUD khác. Nếu chưa hiển thị dù chỉ một frame, có thể chờ cửa sổ an toàn trong cùng load; nếu đã phát thì không replay. Ưu tiên target HUD, toàn bộ telegraph, chỉ dẫn chiến đấu, toast hệ thống. Nếu không thể đọc telegraph, ẩn thẻ tức thời thay vì dùng offset che HP/boss. F2 ẩn nhóm target thì ẩn cả card; không thêm phím/hitbox, không nhận input.

## 3. Lời pha và chiến thắng

- `phase2` một lần khi tỷ lệ e.hp/e.max từ >0,5 sang ≤0,5 và còn sống; nếu load đã ≤0,5, không giả một transition. Đây chỉ là câu thoại 50% theo BATCH, **không thay** v27AI(e).phase và không gọi nó là pha thật nếu khác. Thanh T12 vẫn lấy pha runtime. Fade in 120ms, giữ 1100ms, out 180ms. Nếu intro đang hiện, ưu tiên lời pha mới khi intro hoàn tất, bỏ nếu boss đã chết/chuyển map. Không lặp khi heal >50% rồi xuống lại trong vòng đời boss. Dedupe theo instance/spawn thật, không theo type; đòn từ >50% xuống 0 chỉ phát defeat, không phát phase2.
- `defeat` từ handler boss death thật, 160/1400/220ms; ngắt intro/phase, ở slot pha x400,y202. Không dùng boss HP 0 render nhiều frame để phát lại. Nếu đã chuyển cảnh ngay, chỉ đưa câu vào nhật ký combat/notify thật khi renderer có đường phù hợp, không hiện ngoài cảnh. Không thêm thoại bắt bấm. Boss chết và reload không tái trả thưởng. Nếu hai boss chết gần nhau, 1 câu hiện, câu còn lại chỉ ghi log nếu log có sẵn.
- Mã chiêu (tên tiếng Việt) là nhãn bổ trợ trong yêu thú chí/tooltip đã có (nếu chưa có chỉ lưu data, không tạo panel). Không phát tên chiêu dựa trên suy đoán. Không ghi chỉ số/lore vào TYPES.

## 4. Nhận diện mười dạng đòn — tài liệu chuẩn bị trước trận

Không đưa mẹo thành cơ chế: hình báo, phạm vi, thời gian, số đạn, độ trễ và AI lấy runtime T12/V27; bảng F1 chỉ xác nhận tên dạng đòn. Câu hướng dẫn đọc trước trận hoặc trong yêu thú chí thật, không gọi boss đang đánh chiêu chỉ dựa vào HP/animation.

| Mã | Hình ảnh nhận dạng từ FACTS | Mẹo an toàn (≤70 ký tự) |
|---|---|---|
| pounce | Vồ tới | Quan sát hướng vồ; giữ chỗ lùi sang bên. |
| sweep | Quét ngang | Lùi ra ngoài vùng quét trước khi phản kích. |
| ring | Vòng sóng quanh thân | Đọc rìa vòng; chỉ bước qua khi có khoảng an toàn thật. |
| crush | Đập đất | Rời vùng đập khi có dấu báo; không đứng sát cố đánh. |
| poison | Vũng độc | Tránh vũng độc đang hiện, giữ một lối di chuyển sạch. |
| fan | Quạt đạn | Nhìn đường đạn, tìm khe; không lướt mù về phía boss. |
| ice | Băng | Đọc dấu băng và né ra ngoài vùng đã báo. |
| fire | Lửa | Tránh vùng lửa thật, chờ khoảng trống để đánh. |
| burst | Nổ quanh thân | Giữ khoảng cách với vùng bùng nổ quanh địch. |
| lightning | Sét giáng | Rời dấu báo sét trước khi tia sét giáng xuống. |

**Thẻ chuẩn bị trong nhật ký:** chỉ khi đang chọn quest boss đã mở (m10/m12/m14/m16/m18/m20/m23/m26), thay phần gợi ý bước kế (520,490,690,42) trong Q v1.2 bằng ba ô (520,490,220,42), (755,490,220,42), (990,490,220,42). Từng ô ghi tên chiêu thật từ data, 14px paper; mã 12px muted nếu hữu ích, viền gold #e3b96f .35; hover 300ms hiển thị mẹo trong vùng mục tiêu hiện có (520,438,690,42), rời hover trả gợi ý vùng. Click không phát chiêu/không thay target. Nếu boss type không map đúng từ region, giữ nội dung Q gốc; không tìm bằng chuỗi tên gần giống. Không lộ hồ sơ boss chưa mở.

Trong combat, VFX telegraph hiện hữu luôn ưu tiên. Nếu có hook báo mã đòn chuẩn, nhãn tên chiêu 12px trong vùng boss HUD đã có, chỉ tích hợp khi T12 xác nhận còn chỗ (không tự cấp slot mới); nếu thiếu hook hoặc chỗ trống, không hiện nhãn realtime. Không thêm vòng giả, màu hệ giả, âm báo có thể lệch đòn, hoặc gợi ý khoảng né cố định.

## 5. Layer, dữ liệu và checklist

Render thế giới + ánh sáng T21 → thẻ transient → VFX cảnh báo và đòn T12 → HUD T10/T12/toast → modal. Mask/ẩn thẻ khi telegraph giao rect; thứ tự ưu tiên modal/chuyển cảnh > cảnh báo > HUD/toast > defeat > phase2 > intro. Không giữ queue câu thoại qua load. Chữ không bị tint ngày–đêm, không rung với camera. Thẻ dùng thời gian UI thực (không chịu game slow), không bố trí lại HUD. Nếu renderer không có callback spawn/death, dùng event hợp lệ Claude xác nhận, không đo từ text.

- [ ] 25 type 0–24 và 15 boss, tên y nguyên TYPES, 3 mã đòn đúng; lore ≤160, hint ≤90, title ≤24, thoại ≤70.
- [ ] Vào tầm 650, rời rồi quay lại không lặp thẻ trong load; nạp lại vùng có thể hiện mới; đối tượng xa hoặc chết không hiện.
- [ ] 1280×720/HiDPI: thẻ không chồng toast y100/150, HP góc trái, tên boss y664; không block input, không làm chậm game.
- [ ] HP qua 50% phát thoại đúng một lần, không can thiệp pha AI; defeat đúng sự kiện, không replay khi đổi target/save.
- [ ] Test boss bí cảnh/ẩn theo type; không suy map; modal/Photo/F2/chuyển cảnh/telegraph được ưu tiên. Không đổi combat, XP/loot, boss HP.
- [ ] Q: 8 boss đã mở có đúng 3 tên chiêu tương ứng, 10 dạng mẹo dùng đúng ý F1; ẩn với quest khóa, boss ẩn thiếu map hoặc hook, không phát tên đòn suy đoán.
