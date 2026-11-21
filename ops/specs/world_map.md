# T19 — Bản đồ thế giới thủy mặc (Mịch Trường Sinh)

**Phiên bản:** 1.1 · 21/11/2026 · ChatGPT · REVIEW  
**Đích triển khai:** T20 (Muse), sau T06 và T19 DONE.  
**Tham chiếu:** BRIEF 21/11/2026 13:20; schema T14 §0 và §4; Design Bible; T10 v1.2; T12 v1.3.  
**Tài nguyên:** `assets/world_map_ink.png` (PNG RGB, 1586×992 px, giữ nguyên ảnh v1.0).  
**Dữ liệu:** `data/world_map.js` (`DATA.world_map`, version 1, đủ 10 vùng `REGIONS`).

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

**Tọa độ trình bày theo schema T14.** `DATA.world_map.places` là lớp trình bày, không phải tọa độ địa hình/nhân vật. Đủ 10 ID có thật trong `REGIONS`, giữ nguyên tên chuẩn. `p.mapId` xác định vùng hiện tại. Vị trí mỹ thuật đề xuất dưới đây không tạo thêm vùng, không quyết định quan hệ địa lý hoặc khả năng đi tới.

- `art.width=1586`, `art.height=992`, `art.asset="world_map_ink"`. Với khung ảnh (48,106,856,536), scale aspect-fill là max(856/1586,536/992); ảnh căn giữa. Tâm node = điểm gốc ảnh đã căn giữa + (x×1586×scale, y×992×scale), với x/y là tỷ lệ 0–1. Làm tròn khi vẽ; tuyến, fog, nhãn, hitbox dùng cùng tâm. Không normalize lần hai theo bounding box, không tái fit khi mở khóa hay chọn vùng. Nếu mất ảnh, vẫn dùng kích thước art khai báo làm hệ tọa độ trên nền giấy.
- Tọa độ đề xuất cố định; bảng dưới làm tròn pixel ở 1280×720. Claude kiểm tra bố trí nếu panel gốc có bản đồ địa lý chính xác khác; chỉnh duy nhất data nếu cần, không đổi vị trí UI.

| ID | Địa danh | x | y | Tâm canvas (x,y) | Ấn |
|---|---|---:|---:|---|---|
| thon | Thanh Thạch Thôn | 0.25 | 0.43 | (262,336) | 村 |
| truc | Thanh Trúc Lâm | 0.50 | 0.43 | (476,336) | 竹 |
| yeu | Vạn Yêu Sơn | 0.77 | 0.43 | (707,336) | 妖 |
| ma | Ma Vực | 0.64 | 0.80 | (596,535) | 魔 |
| tuyet | Bắc Minh Tuyết Vực | 0.16 | 0.19 | (185,208) | 雪 |
| tram | Hắc Độc Trạch | 0.16 | 0.70 | (185,481) | 毒 |
| hoa | Xích Viêm Hoang Mạc | 0.40 | 0.82 | (390,546) | 炎 |
| quy | U Minh Quỷ Vực | 0.83 | 0.68 | (759,470) | 鬼 |
| phong | Thiên Phong Cốc | 0.43 | 0.19 | (416,208) | 風 |
| loi | Tử Lôi Hoang Nguyên | 0.72 | 0.19 | (665,208) | 雷 |

- `paths` gồm hai cặp ví dụ có sẵn trong T14 (`thon–truc`, `truc–yeu`). Chưa có đủ bảng `ROAD_EDGES` trong BRIEF nên không tự nối các vùng còn lại. **`ROAD_EDGES` là nguồn sự thật duy nhất về tuyến.** Trước DONE, Claude đối chiếu đủ danh sách tuyến thật, sửa/bổ sung `paths` theo bảng đó và báo nếu cặp mẫu lệch. Khi chạy, chỉ vẽ cặp được xác thực bởi `ROAD_EDGES` và được phép hiển thị theo logic gốc; nếu thiếu cặp trong data, lấy cặp hợp lệ từ `ROAD_EDGES` với hai đầu đều có `places`. Loại cặp trùng (kể cả đảo đầu nếu tuyến vô hướng), cặp thiếu node, cặp không có thật. Nếu thiếu graph, không vẽ tuyến đoán. Đường ink alpha 0.50, 2px, dash 6px/gap 5px; dưới node/label. Giữ đúng chiều và hạn chế gốc. Tuyến trình bày không cấp quyền di chuyển.
- Khi đã chọn điểm đến, chỉ nhấn tuyến thực mà hệ thống hiện có xác nhận có thể dùng: gold 3px, viền ink alpha 0.30 rộng 5px bên dưới. Không vẽ một đường thẳng giả từ người chơi đến mục tiêu. Không dùng khoảng cách trên giấy để tính bước, thời gian hoặc chi phí.

### 2.4. Node / ấn triện / sương mực

Mỗi node có tâm `(cx,cy)` xác định theo §2.3, độc lập với nhãn. Dấu ấn 22×22px, bo 3px; nền red alpha 0.85, viền ink 1px alpha 0.65. Ký tự `places[].seal` căn giữa, ink, 16px serif có glyph Hán (V18Serif nếu hỗ trợ, fallback font serif hệ thống có glyph; nếu thiếu glyph, dùng chấm ink đường kính 6px, không ô vuông lỗi). Với trạng thái khóa, biểu tượng khóa thay ký tự; fog thay bằng dấu hỏi theo bảng dưới. Hitbox tối thiểu 36×36px, tâm trùng node; clip trong vùng bản đồ. Nhãn đặt mặc định giữa ngang, trên ấn: x=`cx − w/2`, y=`cy − 37`, h=22px, w theo chữ + 16px, 48–176px. Nền paper alpha 0.94, viền red 1px, chữ ink 13px đậm. Tên lấy từ `places[].label`, đối chiếu `REGIONS`, không viết tắt tùy ý, tối đa 2 dòng (h=38px, căn giữa, line-height 16px); tên dài hơn hiện đầy đủ trong tooltip/bảng chi tiết, trên bản đồ đổi thành chỉ ấn (không cắt bằng “… ”).

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
| Thông tin | 944, 286 | 268×104 | V45Sans 14px, line-height 22px; loại vùng/điều kiện thực từ `REGIONS`/code; `realmHint` chỉ là gợi ý trình bày đã duyệt, không phải điều kiện |
| Phân cách | 944, 402 | 268×1 | gold alpha 0.30 |
| Mô tả / lý do | 944, 418 | 268×116 | V45Sans 14px paper/muted, line-height 20px, xuống dòng; vùng cuộn nếu nội dung dài, wheel chỉ tác động vùng này |
| Nút hành động | 944, 558 | 268×48 | “Đi tới” V45Sans 16px đậm, nền gold alpha 0.85 + ink; viền gold 1px |
| Hướng dẫn | 944, 612 | 268×18 | V45Sans 12px muted, cân giữa |

Mặc định khi mở: chọn `p.mapId` nếu có node, trạng thái “Đang ở đây”, nút vô hiệu; nếu không có node tương ứng, không chọn, tên “Chọn địa danh”, trạng thái trống, mô tả “Chọn một địa danh trên địa đồ.” Không giả định tên vùng dữ liệu thiếu. Với điểm khả dụng, nút “Đi tới”; với điểm khóa, nút vô hiệu “Chưa thể tới” và hiển thị lý do thực nếu nguồn cho biết, không tự suy đoán. Với điểm hiện tại, nút vô hiệu “Đang ở đây”. Nút vô hiệu ink alpha 0.85, viền muted alpha 0.35, chữ muted; không nhận lệnh. Nếu lý do vắng, câu trung tính “Hiện chưa thể đi tới địa danh này.”

Hiện `places[].desc` trong vùng mô tả nếu địa danh được phép biết; đây là văn miêu tả, không chứa chỉ dẫn điều kiện/quyền truy cập. Với điểm bị khóa, ưu tiên lý do thật ở dòng đầu, mô tả sau. `realmHint` chỉ hiện khi có giá trị khác rỗng và được Claude đối chiếu cấp vùng; ghi “Gợi ý: …”. Chỉ Thanh Trúc Lâm có hint mẫu T14 (“Luyện Khí 3–6”), tám vùng khác và thôn để rỗng vì BRIEF chưa cung cấp cấp thật. Nếu hint không khớp, sửa/xóa trong data trước DONE; không lấy hint thay cho điều kiện code. Thông tin không có trường thật thì ẩn dòng, không điền “Cấp 1”, phần trăm khám phá, thời gian, phí hay tên thế lực giả. Tên dài hơn 2 dòng dùng cỡ 20px, tối đa 3 dòng trong vùng tên; nếu vẫn không đủ thì dùng vùng mô tả hiển thị nguyên tên và render tên ngắn theo tên hiển thị chính thức (nếu có), không tạo biệt danh. Nội dung không chồng nút.

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

Trạng thái modal dùng cơ chế `panel`/dispatcher đã gộp T03/T06; không tạo modal song song. Khi mở bảng, không thao tác xuyên xuống cảnh, quest, dock, minimap, ô kỹ năng; không cưỡng ép pause/resume hoặc reset combat/HUD nếu game đang có quy tắc riêng. Trong chiến đấu hoặc modal khác, tôn trọng điều kiện mở sẵn có; không thêm quyền mở. Mọi trạng thái hover/chọn chỉ tồn tại trong UI, không ghi save. Không thêm zoom/pan ở v1.1; nếu panel gốc có tính năng đó thì giữ nguyên chức năng và đồng bộ phép biến đổi node/tuyến/fog/hitbox, không tự xóa.

Hiệu năng: cache ảnh đã scale và fog/tuyến tĩnh khi dữ liệu, kích thước logic hoặc trạng thái khám phá đổi; chỉ cập nhật khi cần, không tạo ảnh/gradient/đọc pixel từng frame. Fade thuộc UI; không chạy vòng animation riêng liên tục. Mục tiêu 60fps theo Design Bible, kiểm tra bằng công cụ đo của Muse, không tuyên bố đạt khi chưa chạy. Nút & hitbox hoạt động ngay cả khi ảnh không tải.

## 4. Dữ liệu cần và đối chiếu với code thật

| Ý nghĩa | Nguồn / quy tắc |
|---|---|
| Vùng hiện tại | `p.mapId` (BRIEF xác nhận). So bằng ID thực, không so chuỗi tên. |
| Bảng địa danh / tọa độ / tên | `DATA.world_map.places` (schema T14): đúng 10 ID `REGIONS`; `x/y` là tỷ lệ ảnh, `label`, `seal`, `desc`, `realmHint` là trình bày. Không thêm region mới. |
| Quy tắc truy cập, liên kết, trạng thái biết địa danh | `REGIONS`, `ROAD_EDGES` (T14); điều kiện truy cập và khám phá từ panel cũ. `DATA.world_map.paths` không quyết định gameplay. Nếu có cờ đã khám phá/đã ghé/mở khóa thật thì lấy đúng ý nghĩa; không đồng nhất “đã ghé” với “mở khóa” và không thay đổi schema save. |
| Chi tiết vùng, điều kiện và lý do | `desc`, `realmHint` để hiển thị theo §2.5; dữ liệu gameplay/điều kiện thật từ `REGIONS` hoặc handler gốc; dòng không có dữ liệu ẩn. |
| Hành động Đi tới | Handler chọn/đi tới hiện có của `worldMapPanel`, Claude xác nhận tên và điều kiện chính xác trước T20. |
| Mở/đóng modal | Các điểm gọi M, nút Bản đồ và hệ `panel` gốc sau T03/T06. |
| Minimap | `owMiniMap` và tuyến HUD thực sau T06; T10 v1.2 vẫn là chuẩn tọa độ HUD, T19 không sửa phần này. |
| Ảnh | `DATA.world_map.art` → `assets/world_map_ink.png` → danh mục `assets.js` theo build assets của dự án. |

**Nạp và kiểm tra data:** `data/world_map.js` chỉ gồm phép gán `DATA.world_map = {...};` với JSON hợp lệ, `version:1`, không bổ sung trường ngoài T14. Muse thêm thẻ nạp dưới `data/00_init.js` trong `index.html` ở T20 theo hợp đồng T14. Nếu data thiếu/không hợp lệ, giữ panel/dữ liệu gốc và ghi cảnh báo khi khởi tạo; không hỏng save. Đọc data một lần, kiểm đủ region duy nhất, miền x/y, ký tự ấn, kích thước art, cặp tuyến hợp lệ.

**Điểm bắt buộc Claude xác nhận khi REVIEW:** (1) 10 region trong `REGIONS`; thống nhất tọa độ mỹ thuật và **điền/hiệu chỉnh đầy đủ `paths` theo `ROAD_EDGES` thật**, đối chiếu `realmHint` mẫu Thanh Trúc Lâm; (2) field khám phá và phân biệt khóa; nếu không tồn tại thì chốt fallback §2.4; (3) tên handler đi tới, quy tắc thành công/thất bại/đóng panel, dispatcher M/Esc; (4) đường vẽ duy nhất sau T06 và tài nguyên nạp được. T14 đã DONE, nhưng BRIEF không chứa giá trị `ROAD_EDGES` đầy đủ hoặc cấp vùng, nên data trình REVIEW ghi rõ giới hạn xác minh. Không bắt đầu T20 khi chưa DONE.

## 5. Không làm

- Không sửa `src/`, `index.html`, bản đồ gameplay, HUD T10/T12, minimap/quest/dock; không làm code T20 hoặc gộp T06.
- Không thêm vùng, NPC, portal, đường đi, cơ chế khám phá, khóa cấp, tiền phí, fast travel, nhiệm vụ, dữ liệu save, logic di chuyển hay cơ chế bản đồ ngoài phạm vi hiện có.
- Không dùng tranh nền để quyết định topology; không biến núi/rừng/đền trên tranh thành POI thật; chỉ thêm lớp trình bày 10 địa danh có thật theo schema T14.
- Không đổi màu/font Design Bible, không thiết kế lại khung UI chung, không vẽ lớp HUD trùng hay tạo bản đồ thứ hai cạnh panel cũ.

## 6. Checklist nghiệm thu (Claude/Muse kiểm tra trên bản chơi)

- [ ] M và nút Bản đồ gốc mở cùng modal, ở thôn và ngoài thôn đúng điều kiện cũ; đóng bằng × và phím hợp lệ, HUD trở lại như trước.
- [ ] 1280×720: khung (24,24,1232,672), ảnh (48,106,856,536), bảng phải (924,106,308,536); viền, lề, chữ và nút đúng kích thước; không che/cắt chữ hoặc tràn màn hình.
- [ ] 1366×768 và 1920×1080: scale theo Canvas, click đúng node, không lệch hitbox, không chồng panel, không click xuyên vào HUD/cảnh.
- [ ] PNG thủy mặc được nạp một lần, hiển thị cân đối, không kéo méo; mất ảnh vẫn có bản đồ hoạt động trên nền giấy.
- [ ] Data parse đúng JSON trong phép gán, version 1, đủ 10 ID duy nhất của `REGIONS`; khớp ảnh thật 1586×992; không có trường ngoài T14.
- [ ] Địa danh đúng ID/tên, tâm đúng bảng tọa độ §2.3; đổi khám phá không xê dịch cả sơ đồ; nhãn và ấn không có glyph lỗi.
- [ ] Dấu jade đánh đúng node theo `p.mapId`; mở lại sau khi đổi vùng cập nhật đúng. Không có ID hợp lệ thì trạng thái không chọn rõ ràng.
- [ ] Claude đối chiếu và hoàn thiện `paths` theo `ROAD_EDGES` trước DONE; tuyến nét đứt đúng graph thật, thiếu cặp data có fallback đồ thị thật; tuyến nhấn không bịa liên kết/hành trình. Nếu không có graph, không vẽ tuyến giả.
- [ ] Mô tả đúng dữ liệu; `realmHint` rỗng ẩn, hint mẫu Thanh Trúc Lâm được duyệt trước phát hành, không dùng hint để khóa vùng.
- [ ] Fog đúng vùng/cờ thật; điểm chưa khám phá không lộ tên, liên kết hoặc tooltip bị cấm; điểm đã biết không bị fog che; nếu không có field thật dùng fallback đã duyệt.
- [ ] Nhãn ấn đỏ dễ đọc, không chồng nhau; node gần nhau chọn đúng theo quy tắc; tooltip 180ms, nằm trong clip, không che bảng phải.
- [ ] Click node chỉ chọn; click “Đi tới” gọi một lần hành động gốc sau kiểm tra điều kiện; điểm đang ở/khóa không phát lệnh. Lỗi di chuyển không báo thành công; lý do không bịa.
- [ ] Khi modal mở, click/scroll không tác động vào cảnh, quest, minimap, dock hay chiến đấu; đóng/mở không đổi save, không làm sai pause/resume hoặc luật mở panel.
- [ ] Test render/console không lỗi, không gọi nạp ảnh mỗi frame; đo FPS mở địa đồ và kiểm tra hồi quy phím M trong bộ test M01; mục tiêu 60fps theo Design Bible.
- [ ] Claude xác nhận các tên biến/hàm và dữ liệu chưa có trong BRIEF trước khi đánh DONE; Muse chỉ bắt đầu T20 sau T06 + T19 DONE.
