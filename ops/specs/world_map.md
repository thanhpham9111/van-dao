# T19 — Bản đồ thế giới thủy mặc (Mịch Trường Sinh)

**Phiên bản:** 1.0 · 21/11/2026 · ChatGPT · REVIEW  
**Đích triển khai:** T20 (Muse), sau T06 và T19 DONE.  
**Tham chiếu:** BRIEF 21/11/2026 13:14; Design Bible; T10 v1.2; T12 v1.3.  
**Tài nguyên:** `assets/world_map_ink.png` (PNG RGB, 1586×992 px).

## 1. Mục tiêu

- Thay phần trình bày bản đồ thế giới hiện có bằng một tấm địa đồ giấy cổ, sơn thủy cách điệu, ấn triện địa danh, vùng chưa khám phá phủ mực và đường nối nét đứt.
- Cho người chơi thấy mình đang ở đâu, chọn điểm đến, biết vì sao điểm đến khả dụng hoặc bị hạn chế, dùng thao tác đi tới hiện có của game.
- Chỉ thay lớp trình bày và tương tác của `worldMapPanel` đã gộp ở T06; không thay địa hình thật, liên kết vùng, luật di chuyển hay save. Minimap giữ quy chuẩn T10 v1.2.

## 2. Thành phần & bố cục

### 2.1. Khung toàn màn hình

Tất cả tọa độ theo Canvas logic 1280×720, gốc trái-trên; kích thước `w×h` tính bằng pixel. Áp dụng đúng phép đổi tọa độ pointer hiện có của Canvas khi cửa sổ co giãn. Không dùng tọa độ DOM làm tọa độ logic.

| Thành phần | x, y | w×h | Quy cách |
|---|---:|---:|---|
| Lớp phủ nền | 0, 0 | 1280×720 | `#100b13` alpha 0.55, trên cảnh/HUD |
| Khung chính | 24, 24 | 1232×672 | `box()` nền ink alpha 0.92, viền gold alpha 0.70, 1px; góc `ornament()` hiện có |
| Tiêu đề | 48, 38 | 836×34 | “Sơn hà đồ” — V18Serif đậm 28px, gold, căn trái giữa dọc |
| Phụ đề | 50, 76 | 836×20 | “Địa đồ thiên hạ” — V45Sans 13px, muted |
| Nút đóng | 1188, 42 | 44×40 | `×` 24px paper, viền gold alpha 0.5, tooltip “Đóng” |
| Khung bản đồ | 46, 104 | 860×540 | Viền gold 1px, góc trang trí hiện có |
| Ảnh nền + vùng clip | 48, 106 | 856×536 | `world_map_ink.png`, clip toàn bộ lớp địa đồ |
| Bảng chi tiết | 924, 106 | 308×536 | ink alpha 0.92, viền gold alpha 0.45 |
| Chú giải + hướng dẫn | 48, 654 | 1184×30 | Bố cục §2.6, V45Sans 12–13px |

Lề trong tối thiểu 24px tính từ mép khung ngoài (các đường viền trang trí riêng không tính là nội dung). Khung không kéo giãn vật lý theo cửa sổ; dùng hệ scale chung của Canvas. Modal nằm trên toàn bộ HUD và phải nhận input trước HUD/cảnh; không click xuyên vào game. Không đóng/mở riêng minimap để tạo hiệu ứng.

### 2.2. Bảng màu, chữ, tài nguyên

Dùng nguyên bảng màu Design Bible: ink `#100b13`, paper `#f1e4cf`, gold `#e3b96f`, jade `#a8d6c5`, muted `#b5a18b`, red `#f18474`. Không bổ sung màu UI mới; sắc xám–lục và nâu của tranh chỉ là màu mỹ thuật bitmap. Tiêu đề V18Serif; mọi nhãn, số liệu, tooltip và nút V45Sans; cỡ chữ nhỏ nhất 12px. Chữ trên giấy dùng ink thay vì muted/gold để dễ đọc.

Ảnh nền `assets/world_map_ink.png`: tranh giấy cổ, núi sông và kiến trúc thủy mặc ở rìa, khoảng thoáng giữa bản đồ. Đây là **lớp trang trí**, không biểu thị vị trí địa danh hoặc tính đi được của địa hình. Không dùng kiến trúc vẽ sẵn như nút đi tới. Ảnh không có chữ, ấn, đường nối hay sương khóa dựng sẵn. Hiển thị aspect-fill căn giữa 856×536, không méo; tỉ lệ gốc 1586:992 gần khớp, cắt tối thiểu ở hai mép. Nếu chưa nạp ảnh, dùng nền paper, vẫn hiển thị đủ node/tuyến và thao tác. Claude nạp tài nguyên qua `tools/build_assets.py` theo quy trình dự án, kiểm tra trong `assets.js` trước khi giao T20. Không nạp ảnh mới mỗi frame.

**Prompt mỹ thuật đã dùng:** nền atlas tiên hiệp giấy ivory ấm, sơn thủy thủy mặc vẽ tay, nét bút mảnh, núi xa/rừng/sông ẩn hiện quanh chu vi, khoảng giấy sáng thoáng ở giữa; phối xám xanh dịu và sepia; không UI, không chữ, không ấn, không tuyến nối, không đường biên hành chính. Tạo bằng công cụ tạo ảnh, một PNG không trong suốt.

### 2.3. Hệ tọa độ địa danh và tuyến

**Không tự đặt tên, tọa độ hay tuyến mới.** Lấy tất cả ID, tên hiển thị, tọa độ và liên kết từ nguồn đang dùng bởi `worldMapPanel` sau T06. `p.mapId` xác định vị trí hiện tại. Claude xác nhận cụ thể tên bảng/hàm trước khi duyệt (xem §4).

- Vùng đặt tâm node: x=104…848, y=150…590 (744×440). Giữ thứ tự, hướng tương đối và tỷ lệ khoảng cách của toàn bộ sơ đồ gốc; dùng cùng một hệ quy chiếu cho node, tuyến, hitbox và vùng fog. Không dùng tọa độ nhân vật trên map cục bộ cho địa đồ tổng.
- Nếu panel gốc có khung tọa độ riêng: lấy bounding box ổn định của các điểm gốc, fit đồng tỷ lệ vào vùng 744×440, padding đối xứng. Tâm điểm sau fit = tâm vùng `(476,370)` cộng độ lệch của tọa độ gốc so với tâm bounding box nhân cùng hệ số fit (min của hai tỷ lệ). Trục y/hướng theo quy ước gốc. Nếu chỉ một điểm, đặt tại tâm; chiều có độ trải bằng 0 không tham gia tính tỷ lệ. Dùng bounding box của tất cả điểm gốc có tọa độ, không tái fit khi khám phá thêm/đổi lựa chọn.
- Nếu gốc dùng tọa độ màn hình, giữ vị trí tương đối theo chính hệ tọa độ đó. Nếu chỉ có danh sách và không có tọa độ địa đồ thực, Claude phải xác nhận sơ đồ bố trí theo nguồn có thật trước T20; không suy từ tranh nền hoặc tự bịa quan hệ địa lý. Khi chưa có dữ liệu, dùng danh sách địa danh nguyên bản thay vì nút đặt giả.
- Tuyến chỉ vẽ từ liên kết thực được panel hiện tại biểu thị. Đường ink alpha 0.50, 2px, dash 6px / gap 5px; dưới node và label. Nếu biết chiều di chuyển từ dữ liệu, giữ đúng chiều/hạn chế; tuyến không phải điều kiện mở khóa. Nếu thiếu graph, không vẽ tuyến đoán.
- Khi đã chọn điểm đến, chỉ nhấn tuyến thực mà hệ thống hiện có xác nhận có thể dùng: gold 3px, viền ink alpha 0.30 rộng 5px bên dưới. Không vẽ một đường thẳng giả từ người chơi đến mục tiêu. Không dùng khoảng cách trên giấy để tính bước, thời gian hoặc chi phí.

### 2.4. Node / ấn triện / sương mực

Mỗi node có tâm `(cx,cy)` xác định theo §2.3, độc lập với nhãn. Dấu ấn 22×22px, bo 3px; nền red alpha 0.85, viền ink 1px alpha 0.65. Trong ấn có chấm ink đường kính 6px. Hitbox tối thiểu 36×36px, tâm trùng node; clip trong vùng bản đồ. Nhãn đặt mặc định giữa ngang, trên ấn: x=`cx − w/2`, y=`cy − 37`, h=22px, w theo chữ + 16px, 48–176px. Nền paper alpha 0.94, viền red 1px, chữ ink 13px đậm. Tên lấy từ game, không viết tắt tùy ý, tối đa 2 dòng (h=38px, căn giữa, line-height 16px); tên dài hơn hiện đầy đủ trong tooltip/bảng chi tiết, trên bản đồ đổi thành chỉ ấn (không cắt bằng “… ”).

| Trạng thái | Hình thức | Điều kiện |
|---|---|---|
| Hiện tại | Ấn jade 22×22, viền ink; vòng gold 32px ngoài, 2px; nhãn “Đang ở đây” trong tooltip | ID khớp `p.mapId` |
| Khả dụng | Ấn red 22×22, nhãn tên như trên | Dữ liệu gốc cho phép hiển thị, chọn và đi theo điều kiện hiện hành |
| Đã biết nhưng chưa thể đến | Ấn paper alpha 0.78, viền ink 1px, khóa 12×12 ink; nhãn tên chỉ nếu nguồn cho phép | Đã biết vị trí, hiện tại không đủ điều kiện thực |
| Chưa khám phá (nếu game có dữ liệu) | Vùng mực tối, dấu hỏi muted 18px thay node nếu điểm được phép biết vị trí; không tên/tooltip tiết lộ | Nguồn dữ liệu thật xác nhận chưa khám phá và cho phép/mức độ hiện tại |
| Đang chọn | Viền gold 2px quanh ấn với vòng ink 1px bên ngoài; nhãn rõ | ID đang chọn, kể cả điểm đã biết bị khóa |
| Hover | Vòng ink 1px alpha 0.75 đường kính 32px; tooltip sau 180ms | Pointer nằm trong hitbox node/nhãn khả dụng |

**Fog:** Vẽ lớp mực ink alpha 0.65 ở lõi, nhòe dần về alpha 0 tại rìa 24px; nếu nguồn có vùng chưa khám phá thật, phủ đúng mask vùng, clip toàn bộ trong địa đồ. Nếu chỉ có cờ chưa khám phá theo node, vùng mực tròn mềm bán kính 42px quanh tâm node, lõi bán kính 22px; không lan vào dấu hiện tại/điểm đã khám phá (loại trừ vòng r=22px quanh chúng). Không dựng vùng fog dựa vào cấp hoặc vị trí ước đoán. Nếu game chưa lưu trạng thái khám phá, không tự tạo field save; chỉ hiển thị các khóa/giới hạn hiện hữu và bỏ lớp fog khám phá không có căn cứ. Ẩn tên, tuyến và thông tin liên quan khi nguồn gốc vốn không cho người chơi biết. Fog tĩnh, cache khi trạng thái thực thay đổi, không vẽ nhiễu ngẫu nhiên mỗi frame.

**Thứ tự vẽ:** giấy → tuyến cơ bản → fog → nhấn tuyến hợp lệ/đã biết → ấn/nhãn đã biết → ấn hiện tại → vòng chọn/hover → tooltip → khung/bảng điều khiển. Địa danh cạnh nhau: ưu tiên nhãn hiện tại, đã chọn, hover, còn lại theo thứ tự ID ổn định; thử trên, dưới, phải, trái (cách mép ấn 4px), thêm khoảng trống 4px giữa nhãn. Chỉ đặt nhãn trong clip, không đè node khác; nếu không đủ chỗ ẩn nhãn kém ưu tiên, giữ ấn và tooltip đầy đủ. Nếu hitbox trùng nhau, điểm gần tâm pointer nhất được ưu tiên, bằng khoảng cách thì điểm hiện tại/đang chọn trước, rồi thứ tự ID. Bảng chi tiết không bị tooltip che.

### 2.5. Bảng chi tiết bên phải

| Thành phần | x, y | w×h | Nội dung / màu |
|---|---:|---:|---|
| Nhãn | 944, 124 | 268×24 | “Địa danh” V18Serif 20px gold |
| Đường phân cách | 944, 158 | 268×1 | gold alpha 0.35 |
| Tên | 944, 174 | 268×62 | V18Serif 24px paper, 2 dòng; xuống dòng tự nhiên |
| Trạng thái | 944, 246 | 268×24 | V45Sans 14px jade (đang ở/đi được), muted (không rõ), red (hạn chế) |
| Thông tin | 944, 286 | 268×104 | V45Sans 14px, line-height 22px; chỉ trường có thật: loại vùng, cấp khuyến nghị, điều kiện thực nếu có |
| Phân cách | 944, 402 | 268×1 | gold alpha 0.30 |
| Mô tả / lý do | 944, 418 | 268×116 | V45Sans 14px paper/muted, line-height 20px, xuống dòng; vùng cuộn nếu nội dung dài, wheel chỉ tác động vùng này |
| Nút hành động | 944, 558 | 268×48 | “Đi tới” V45Sans 16px đậm, nền gold alpha 0.85 + ink; viền gold 1px |
| Hướng dẫn | 944, 612 | 268×18 | V45Sans 12px muted, cân giữa |

Mặc định khi mở: chọn `p.mapId` nếu có node, trạng thái “Đang ở đây”, nút vô hiệu; nếu không có node tương ứng, không chọn, tên “Chọn địa danh”, trạng thái trống, mô tả “Chọn một địa danh trên địa đồ.” Không giả định tên vùng dữ liệu thiếu. Với điểm khả dụng, nút “Đi tới”; với điểm khóa, nút vô hiệu “Chưa thể tới” và hiển thị lý do thực nếu nguồn cho biết, không tự suy đoán. Với điểm hiện tại, nút vô hiệu “Đang ở đây”. Nút vô hiệu ink alpha 0.85, viền muted alpha 0.35, chữ muted; không nhận lệnh. Nếu lý do vắng, câu trung tính “Hiện chưa thể đi tới địa danh này.”

Thông tin không có trường thật thì ẩn dòng, không điền “Cấp 1”, phần trăm khám phá, thời gian, phí hay tên thế lực giả. Tên dài hơn 2 dòng dùng cỡ 20px, tối đa 3 dòng trong vùng tên; nếu vẫn không đủ thì dùng vùng mô tả hiển thị nguyên tên và render tên ngắn theo tên hiển thị chính thức (nếu có), không tạo biệt danh. Nội dung không chồng nút.

### 2.6. Chú giải, hướng dẫn, tooltip

Chú giải đáy: mọi icon 12×12, tâm y=669, giữa icon và chữ 6px, V45Sans 13px paper. Các nhóm x=48 “Hiện tại” (jade), x=170 “Địa danh” (red), x=310 “Chưa thể tới” (paper/khóa), x=490 “Chưa khám phá” (ink/muted), x=680 “Đường đi” (đường đứt gold). Bỏ nhóm chưa khám phá nếu không có dữ liệu khám phá; bỏ đường đi nếu không có liên kết. Vùng x=866, y=655, w=366, h=28: “Chọn địa danh · M / Esc: Đóng”, căn phải; chỉ hiển thị phím đang được dispatcher gốc hỗ trợ. Không thêm phím nếu trái với điều khiển hiện tại.

Tooltip chỉ khi pointer ở hitbox đã biết: rộng 120–256px theo chữ, cao 44px (tên + trạng thái), tối đa 68px nếu cần 2 dòng tên. Nền ink alpha 0.92, viền gold alpha 0.60, chữ paper 14px, trạng thái jade/muted/red 12px. Ưu tiên đặt cách pointer 14px về phải/dưới, nếu tràn thì lật hướng, clamp vào (56,114)…(896,634). Không bắt pointer, không che dấu đang hover nếu vị trí khác còn chỗ. Ẩn ngay khi rời hitbox, đổi node, đóng modal hay chuyển map.

## 3. Tương tác và hoạt ảnh

| Hành động | Kết quả | Thời gian |
|---|---|---:|
| M / nút Bản đồ hiện có | Mở đúng `worldMapPanel` theo dispatcher hiện hành, chọn vùng hiện tại | Fade overlay/khung 120ms ease-out; lập tức chặn input dưới modal |
| Click node / nhãn đã biết | Chọn ID, làm nổi ấn, cập nhật bảng chi tiết đồng frame | Viền chọn fade 100ms; không dịch chuyển nhân vật |
| Click “Đi tới” | Kiểm tra lại điều kiện thực và gọi đúng hành động di chuyển của panel cũ, một lần | Phản hồi nhấn 80ms; đóng theo đúng hành vi thành công của giao thức cũ |
| Điểm hiện tại / bị khóa | Xem chi tiết nếu được phép; không gọi di chuyển | Nút vô hiệu tức thì |
| Di chuột | Hover ấn/nhãn và nút; tooltip sau 180ms | Fade viền 80ms; tooltip xuất hiện 100ms |
| Click vùng giấy trống | Giữ lựa chọn; không di chuyển nhân vật, không đóng modal | 0ms |
| × / M / Esc (nếu dispatcher hỗ trợ) | Đóng, bỏ lựa chọn UI và tooltip; không đổi đích đang dẫn đường nếu chỉ đóng | Fade 100ms, giữ chặn input xuyên tới hết lượt đóng |
| Dữ liệu hoặc vùng hiện tại đổi | Cập nhật dấu hiện tại, kiểm tra nút; ID chọn hết hiệu lực thì chọn lại vùng hiện tại hoặc bỏ chọn | Trong frame kế tiếp |

Luồng chủ đạo: mở → chọn địa danh → đọc thông tin/điều kiện → click “Đi tới”; tách việc xem khỏi thực hiện hành động. Handler di chuyển gốc quyết định dẫn đường, đổi vùng hoặc cơ chế đang dùng; T19 không thêm teleport, không tự gán `p.mapId`, không trừ tài nguyên hoặc tự xác lập lộ trình. Nếu handler từ chối, giữ modal và hiển thị lý do thực tại vùng mô tả; không báo đã tới. Chặn double-click và lệnh lặp khi yêu cầu đang chờ, giải chặn khi handler trả kết quả hoặc modal đóng; không tự đặt thời gian chờ gây sai cơ chế cũ.

Trạng thái modal dùng cơ chế `panel`/dispatcher đã gộp T03/T06; không tạo modal song song. Khi mở bảng, không thao tác xuyên xuống cảnh, quest, dock, minimap, ô kỹ năng; không cưỡng ép pause/resume hoặc reset combat/HUD nếu game đang có quy tắc riêng. Trong chiến đấu hoặc modal khác, tôn trọng điều kiện mở sẵn có; không thêm quyền mở. Mọi trạng thái hover/chọn chỉ tồn tại trong UI, không ghi save. Không có zoom/pan ở v1.0; nếu panel gốc có tính năng đó thì giữ nguyên chức năng và đồng bộ phép biến đổi node/tuyến/fog/hitbox, không tự xóa.

Hiệu năng: cache ảnh đã scale và fog/tuyến tĩnh khi dữ liệu, kích thước logic hoặc trạng thái khám phá đổi; chỉ cập nhật khi cần, không tạo ảnh/gradient/đọc pixel từng frame. Fade thuộc UI; không chạy vòng animation riêng liên tục. Mục tiêu 60fps theo Design Bible, kiểm tra bằng công cụ đo của Muse, không tuyên bố đạt khi chưa chạy. Nút & hitbox hoạt động ngay cả khi ảnh không tải.

## 4. Dữ liệu cần và đối chiếu với code thật

| Ý nghĩa | Nguồn / quy tắc |
|---|---|
| Vùng hiện tại | `p.mapId` (BRIEF xác nhận). So bằng ID thực, không so chuỗi tên. |
| Bảng địa danh / tọa độ / tên | Nguồn `worldMapPanel` sau T06, Claude ghi tên biến hoặc hàm chính xác khi review. Không thêm `DATA` hoặc ID mới. |
| Quy tắc truy cập, liên kết, trạng thái biết địa danh | Cùng nguồn/điều kiện mà panel cũ dùng. Nếu có cờ đã khám phá/đã ghé/mở khóa thật thì lấy đúng ý nghĩa; không đồng nhất “đã ghé” với “mở khóa” và không thay đổi schema save. |
| Chi tiết vùng, điều kiện và lý do | Metadata thật hoặc thông báo từ handler gốc; dòng không có dữ liệu ẩn. |
| Hành động Đi tới | Handler chọn/đi tới hiện có của `worldMapPanel`, Claude xác nhận tên và điều kiện chính xác trước T20. |
| Mở/đóng modal | Các điểm gọi M, nút Bản đồ và hệ `panel` gốc sau T03/T06. |
| Minimap | `owMiniMap` và tuyến HUD thực sau T06; T10 v1.2 vẫn là chuẩn tọa độ HUD, T19 không sửa phần này. |
| Ảnh | `assets/world_map_ink.png` → danh mục `assets.js` theo build assets của dự án. |

**Điểm bắt buộc Claude xác nhận khi REVIEW:** (1) nguồn ID/tên/tọa độ và graph thật; (2) field khám phá và phân biệt khóa; nếu không tồn tại thì chốt fallback §2.4; (3) tên handler đi tới, quy tắc thành công/thất bại/đóng panel, dispatcher M/Esc; (4) đường vẽ duy nhất sau T06 và tài nguyên nạp được. BRIEF không chứa mã repo hay sơ đồ tọa độ địa danh, vì vậy không khẳng định tên field chưa được cung cấp. Nếu thiếu tọa độ thực, Claude cung cấp bố trí được duyệt rồi bổ sung spec trước khi DONE/T20. Không yêu cầu T14 hoàn thành để T19 trình REVIEW.

## 5. Không làm

- Không sửa `src/`, `index.html`, bản đồ gameplay, HUD T10/T12, minimap/quest/dock; không làm code T20 hoặc gộp T06.
- Không thêm vùng, NPC, portal, đường đi, cơ chế khám phá, khóa cấp, tiền phí, fast travel, nhiệm vụ, dữ liệu save, logic di chuyển hay cơ chế bản đồ ngoài phạm vi hiện có.
- Không dùng tranh nền để quyết định topology; không biến núi/rừng/đền trên tranh thành POI thật; không thêm dữ liệu địa danh tự nghĩ.
- Không đổi màu/font Design Bible, không thiết kế lại khung UI chung, không vẽ lớp HUD trùng hay tạo bản đồ thứ hai cạnh panel cũ.

## 6. Checklist nghiệm thu (Claude/Muse kiểm tra trên bản chơi)

- [ ] M và nút Bản đồ gốc mở cùng modal, ở thôn và ngoài thôn đúng điều kiện cũ; đóng bằng × và phím hợp lệ, HUD trở lại như trước.
- [ ] 1280×720: khung (24,24,1232,672), ảnh (48,106,856,536), bảng phải (924,106,308,536); viền, lề, chữ và nút đúng kích thước; không che/cắt chữ hoặc tràn màn hình.
- [ ] 1366×768 và 1920×1080: scale theo Canvas, click đúng node, không lệch hitbox, không chồng panel, không click xuyên vào HUD/cảnh.
- [ ] PNG thủy mặc được nạp một lần, hiển thị cân đối, không kéo méo; mất ảnh vẫn có bản đồ hoạt động trên nền giấy.
- [ ] Địa danh đúng ID/tên/tọa độ tương đối của nguồn thật; đổi khám phá không xê dịch cả sơ đồ; không có node/tuyến tự tạo.
- [ ] Dấu jade đánh đúng node theo `p.mapId`; mở lại sau khi đổi vùng cập nhật đúng. Không có ID hợp lệ thì trạng thái không chọn rõ ràng.
- [ ] Tuyến nét đứt đúng graph thật; tuyến nhấn không bịa liên kết hay hành trình. Nếu không có graph, không vẽ tuyến giả.
- [ ] Fog đúng vùng/cờ thật; điểm chưa khám phá không lộ tên, liên kết hoặc tooltip bị cấm; điểm đã biết không bị fog che; nếu không có field thật dùng fallback đã duyệt.
- [ ] Nhãn ấn đỏ dễ đọc, không chồng nhau; node gần nhau chọn đúng theo quy tắc; tooltip 180ms, nằm trong clip, không che bảng phải.
- [ ] Click node chỉ chọn; click “Đi tới” gọi một lần hành động gốc sau kiểm tra điều kiện; điểm đang ở/khóa không phát lệnh. Lỗi di chuyển không báo thành công; lý do không bịa.
- [ ] Khi modal mở, click/scroll không tác động vào cảnh, quest, minimap, dock hay chiến đấu; đóng/mở không đổi save, không làm sai pause/resume hoặc luật mở panel.
- [ ] Test render/console không lỗi, không gọi nạp ảnh mỗi frame; đo FPS mở địa đồ và kiểm tra hồi quy phím M trong bộ test M01; mục tiêu 60fps theo Design Bible.
- [ ] Claude xác nhận các tên biến/hàm và dữ liệu chưa có trong BRIEF trước khi đánh DONE; Muse chỉ bắt đầu T20 sau T06 + T19 DONE.
