# T19 — Bản đồ thế giới thủy mặc (Mịch Trường Sinh)

**Phiên bản:** 1.2 · 21/11/2026 · ChatGPT · REVIEW  
**Đích triển khai:** T20 (Muse), sau T06 và T19 DONE.  
**Tham chiếu:** BRIEF 21/11/2026 13:37; `ops/specs/world_map_review.md` (review lần 2); schema T14 §0 và §4; Design Bible; T10 v1.2; T12 v1.3.  
**Tài nguyên:** `assets/world_map_ink.webp`, 1586×992 px, đã nạp trong repo qua `ASSETS["world_map_ink"]`.  
**Dữ liệu:** `data/world_map.js` (`DATA.world_map`, `version: 1`), 10 vùng và 13 tuyến đúng dữ liệu game.

**Thay đổi v1.2:** chép nguyên bảng review (tọa độ, ấn, realmHint, 13 cặp ROAD_EDGES); giữ 3 nút đầu bảng và bản đồ thôn; thay “Đi tới” bằng “Dẫn đường” không khóa theo cấp; dùng V22_REG, QUALITY và p.discovered thật. Tên vùng chưa khám phá vẫn hiện; chọn và dẫn đường bình thường. Không tạo ảnh mới.

## 1. Mục tiêu

- Trình bày địa đồ trên giấy cổ, sơn thủy cách điệu, ấn triện địa danh, sương mực tại các vùng chưa khám phá, đường nối nét đứt.
- Cho người chơi thấy vị trí hiện tại, chọn bất cứ vùng nào và xem thông tin thật, nhận cảnh báo nếu dưới cấp đề nghị, dẫn đường bằng chức năng hiện có.
- Chỉ đổi trình bày và tương tác trong `worldMapPanel` sau T06. Giữ địa lý, kết nối, luật dẫn đường, tab địa đồ Thanh Thạch, minimap theo T10 v1.2, save và HUD chiến đấu T12 v1.3.

## 2. Thành phần & bố cục

### 2.1. Khung toàn màn hình và ba nút tiêu đề

Tọa độ theo Canvas logic 1280×720, gốc trái-trên; kích thước w×h tính bằng pixel. Scale và hitbox theo phép chuyển pointer hiện có. Không dùng tọa độ DOM làm tọa độ logic.

| Thành phần | x, y | w×h | Quy cách |
|---|---:|---:|---|
| Lớp phủ nền | 0, 0 | 1280×720 | ink alpha 0.55 trên cảnh/HUD |
| Khung chính | 24, 24 | 1232×672 | `box()`, ink alpha 0.92, viền gold alpha 0.70, 1px; góc `ornament()` |
| Tiêu đề | 48, 38 | 824×34 | “Sơn hà đồ”, V18Serif đậm 28px, gold, căn trái giữa dọc |
| Phụ đề | 50, 76 | 822×20 | “Địa đồ thiên hạ”, V45Sans 13px, muted |
| Tab Thanh Thạch | 880, 42 | 112×40 | “Thanh Thạch”, `modal.v16Map='local'` |
| Tab Sơn Hà Đồ | 1000, 42 | 116×40 | “Sơn Hà Đồ”, `modal.v16Map='world'` |
| Nút Đóng | 1124, 42 | 108×40 | “Đóng [Esc]”, đóng modal |
| Khung bản đồ | 46, 104 | 860×540 | Viền gold 1px, góc trang trí chung |
| Ảnh nền + clip | 48, 106 | 856×536 | `ASSETS["world_map_ink"]`, clip tất cả lớp địa đồ |
| Bảng chi tiết | 924, 106 | 308×536 | ink alpha 0.92, viền gold alpha 0.45 |
| Chú giải + hướng dẫn | 48, 654 | 1184×30 | §2.6, V45Sans 12–13px |

Ba nút dùng V45Sans 14px, căn giữa cả hai trục, bo và khung theo `box()`: nút thường nền ink alpha 0.85, viền gold alpha 0.45, chữ paper; tab đang chọn nền gold alpha 0.20, viền gold 1px alpha 1, chữ gold đậm; hover tăng viền gold lên alpha 1 trong 80ms, nhấn phản hồi 80ms. Khoảng cách nút 8px. Cụm nút giữ nguyên thứ tự khi chuyển tab; trạng thái chọn lấy từ `modal.v16Map`. Tab Thanh Thạch hiển thị đúng bản đồ thôn cũ; không ép nền thủy mặc, node hay bảng chi tiết thế giới vào tab local, không sửa nội dung/tương tác local. Tab Sơn Hà Đồ mới hiện lớp địa đồ §2.2–2.6. Khi đang ở local, dùng tiêu đề/phụ đề local vốn có và giữ đủ ba nút. Đóng [Esc] thay cho nút × cũ; không tạo nút đóng thứ hai.

Modal nằm trên HUD, nhận input trước cảnh/HUD, không click xuyên. Không thay các điều kiện mở modal hiện có hoặc pause/resume. Lề an toàn 24px, giữ nguyên Canvas scale. Các tọa độ §2.2–2.6 chỉ áp dụng khi `modal.v16Map='world'`.

### 2.2. Màu, chữ và tài nguyên

Dùng bảng màu Design Bible: ink `#100b13`, paper `#f1e4cf`, gold `#e3b96f`, jade `#a8d6c5`, muted `#b5a18b`, red `#f18474`. Không thêm màu UI. Tiêu đề V18Serif; chữ UI V45Sans, tối thiểu 12px. Chữ trên giấy ưu tiên ink.

`assets/world_map_ink.webp` (1586×992) đã vào repo; dùng đối tượng ảnh hiện có `ASSETS["world_map_ink"]`. Không nạp thêm PNG, không thay asset hoặc chạy build chỉ vì sửa spec. Ảnh sơn thủy là lớp trang trí, không dùng hình núi/rừng/đền để suy ra địa lý hoặc POI. Hiển thị aspect-fill căn giữa trong (48,106,856,536), không méo. Nếu ảnh chưa sẵn sàng, nền paper vẫn hiện đúng node/tuyến, có tương tác. Cache ảnh và lớp tĩnh.

### 2.3. Tọa độ 10 địa danh và 13 đường nối

**Bảng nguyên văn từ world_map_review.md, mục 1.** Tọa độ từ `REGIONS` (8000×4480) đã fit vào vùng node 744×440 tâm (476,370), sau đó đổi sang tỷ lệ ảnh. Địa lý thật là 2 hàng × 5 cột: trên Thôn · Trúc Lâm · Vạn Yêu · Ma Vực · Thiên Phong; dưới Tuyết Vực · Độc Trạch · Hoang Mạc · Quỷ Vực · Tử Lôi.

| id | Tên | x | y | Tâm canvas | Ấn | realmHint (từ `V22_REG`) |
|---|---|---:|---:|---|---|---|
| `thon` | Thanh Thạch Thôn | 0.158 | 0.260 | (183,245) | 村 | Vùng an toàn |
| `truc` | Thanh Trúc Lâm | 0.326 | 0.251 | (327,241) | 竹 | Luyện Khí · Lv 1–9 |
| `yeu` | Vạn Yêu Sơn | 0.505 | 0.251 | (481,241) | 妖 | Trúc Cơ · Lv 10–14 |
| `ma` | Ma Vực | 0.671 | 0.260 | (623,245) | 魔 | Hóa Thần · Lv 37–40 |
| `tuyet` | Bắc Minh Tuyết Vực | 0.158 | 0.702 | (183,483) | 雪 | Kim Đan · Lv 19–23 |
| `tram` | Hắc Độc Trạch | 0.326 | 0.702 | (327,483) | 毒 | Trúc Cơ · Lv 15–18 |
| `hoa` | Xích Viêm Hoang Mạc | 0.505 | 0.702 | (481,483) | 炎 | Kim Đan · Lv 24–27 |
| `quy` | U Minh Quỷ Vực | 0.671 | 0.702 | (623,483) | 鬼 | Nguyên Anh · Lv 33–36 |
| `phong` | Thiên Phong Cốc | 0.846 | 0.264 | (773,247) | 風 | Nguyên Anh · Lv 28–32 |
| `loi` | Tử Lôi Hoang Nguyên | 0.846 | 0.702 | (773,483) | 雷 | Hóa Thần · Lv 41–45 |

`paths` (13 cặp, đúng `ROAD_EDGES`):

```json
[["thon", "truc"], ["truc", "yeu"], ["yeu", "ma"], ["thon", "tuyet"], ["truc", "tram"], ["yeu", "hoa"], ["ma", "quy"], ["tuyet", "tram"], ["tram", "hoa"], ["hoa", "quy"], ["ma", "phong"], ["quy", "loi"], ["phong", "loi"]]
```

- `DATA.world_map.art`: asset `world_map_ink`, width 1586, height 992. Tỉ lệ aspect-fill s = max(856/1586, 536/992); gốc ảnh sau căn giữa = (48 + (856−1586×s)/2, 106 + (536−992×s)/2). Tâm node = gốc ảnh + (places.x×1586×s, places.y×992×s). Dùng chung phép biến đổi cho đường, fog, node, hitbox, nhãn. Tỷ lệ trong bảng làm tròn 3 chữ số nên tâm hiển thị có thể lệch tối đa 1px so với tâm canvas tham chiếu; không sửa số review để ép khớp số làm tròn. Không fit/normalize lại theo node, không thay bố trí khi khám phá.
- Vẽ cả 13 cặp theo thứ tự trong data, đường ink alpha 0.50, 2px, dash 6px/gap 5px; dưới fog và node. Phần đi qua fog vẫn mờ theo lớp fog. Không thêm bất kỳ cạnh nào ngoài `ROAD_EDGES`; không vẽ đường thẳng giả từ vị trí nhân vật đến điểm chọn. Đây là tuyến trình bày, không mở/khóa vùng, không tính đường đi, chi phí hoặc thời gian.
- Khi đã chọn, chỉ nhấn vòng ấn và nhãn, không dựng tuyến hoạt động giả. Nếu game hiện có tuyến dẫn đường thật để hiển thị thì giữ hành vi cũ, dùng gold 3px, viền ink alpha 0.30 rộng 5px; không tự tạo thuật toán tìm đường.

### 2.4. Ấn triện, sương mực và khám phá

Mỗi node có tâm (cx,cy) theo §2.3. Ấn 22×22px, bo 3px, viền ink 1px alpha 0.65, nền red alpha 0.85 đối với đã khám phá. Chữ Hán từ `places[].seal` căn giữa, ink, 16px serif (V18Serif nếu hỗ trợ, fallback serif có glyph; nếu thiếu glyph dùng chấm ink đường kính 6px). Hitbox 36×36px, tâm trùng node, bấm được cả ấn, dấu hỏi và nhãn. 

Nhãn **luôn ưu tiên hiện tên đầy đủ của cả vùng chưa khám phá** (không giấu tên theo fog); dùng `places[].label`, V45Sans 13px đậm, ink, nền paper alpha 0.94, viền red 1px. Kích thước theo độ rộng chữ +16px, tối thiểu 48px, tối đa 136px để phù hợp lưới 2×5; h=22px một dòng hoặc 38px hai dòng, line-height 16px. Căn giữa trên ấn, đáy nhãn cách đỉnh ấn 4px (y=cy−15−h). Thử vị trí dưới/phải/trái cách mép ấn 4px nếu vướng nhãn/node. Ưu tiên hiện tại, đã chọn, hover, rồi thứ tự data; cách nhãn khác ≥4px. Nếu tên dài, xuống dòng theo cụm từ, không cắt chữ; trường hợp đặc biệt không đủ chỗ, giữ ấn và hiện toàn bộ tên bằng tooltip/bảng chi tiết (không ẩn vì chưa khám phá).

| Trạng thái ấn | Hình thức | Điều kiện |
|---|---|---|
| Hiện tại | Ấn jade 22×22, viền ink, ký tự ấn; vòng gold ngoài 32px, 2px | region === p.mapId, ưu tiên hơn mọi trạng thái |
| Đã khám phá | Ấn red 22×22, ký tự Hán ink | region nằm trong `p.discovered` và không phải vùng hiện tại |
| Chưa khám phá | Ấn ink alpha 0.82, viền muted 1px; dấu “?” paper 16px, fog phía dưới; nhãn tên vẫn hiện | region không nằm trong `p.discovered` và không phải vùng hiện tại |
| Đang chọn | Vòng gold 36px, 2px, đường viền ink ngoài 1px | ID đang chọn, bất kể đã/chưa khám phá |
| Hover | Vòng ink 1px alpha 0.75, đường kính 32px; tooltip sau 180ms | Pointer trên hitbox node/nhãn bất kỳ |

**Fog:** dùng `p.discovered` là mảng ID thật. Vùng chưa khám phá (trừ vị trí hiện tại) phủ mực ink alpha 0.65 tại lõi bán kính 22px, giảm mềm tới alpha 0 ở bán kính 42px quanh node. Clip trong (48,106,856,536). Không phủ lên ấn/nhãn của chính node hoặc vòng hiện tại (vẽ ấn/nhãn sau fog); loại trừ vòng r=22px quanh node đã khám phá/hiện tại nếu fog giao nhau. Không tạo mask địa lý mới. Khi ID vào `p.discovered`, bỏ fog ngay frame kế tiếp, đổi “?” sang ấn thật (không ghi save hoặc đặt cờ khi chỉ chọn). Nếu save cũ chưa có mảng, đọc như mảng rỗng để trình bày, không ghi đè; vị trí hiện tại vẫn không fog. Tất cả 10 vùng luôn có thể chọn, tất cả vùng khác vùng hiện tại đều dẫn đường được, không phụ thuộc fog hoặc cấp.

Thứ tự vẽ: giấy → 13 tuyến → fog → ấn/nhãn cho cả 10 địa danh → ấn hiện tại và vòng chọn/hover → tooltip → khung. Hitbox nếu chồng nhau ưu tiên tâm gần pointer nhất, bằng nhau ưu tiên hiện tại/đang chọn, rồi thứ tự data; click nhãn nhận đúng ID tương ứng.

### 2.5. Bảng chi tiết — trường thật của V22_REG

Tất cả trường dưới đây lấy theo ID đang chọn, không phụ thuộc vùng khám phá hay cấp người chơi. Dùng formatter/tên hiển thị đang có ở game đối với tài nguyên, boss, phẩm chất. Không thêm cấp, chiến lực, tên boss/tài nguyên giả.

| Thành phần | x, y | w×h | Nội dung / màu |
|---|---:|---:|---|
| Nhãn | 944, 124 | 268×24 | “Địa danh”, V18Serif 20px gold |
| Phân cách | 944, 158 | 268×1 | gold alpha 0.35 |
| Tên | 944, 170 | 268×54 | label, V18Serif 24px paper, tối đa 2 dòng; nếu cần 20px |
| Trạng thái | 944, 230 | 268×22 | V45Sans 14px, theo thứ tự ưu tiên bên dưới |
| Cảnh báo dưới cấp | 944, 256 | 268×20 | red 13px “Cấp đề nghị X–Y · nguy hiểm” khi dưới min; ẩn khi không thỏa |
| Các trường V22_REG | 944, 282 | 268×128 | V45Sans 14px, line-height 20px, nhãn muted, giá trị paper/jade; nội dung có thể cuộn |
| Phân cách | 944, 414 | 268×1 | gold alpha 0.30 |
| Mô tả | 944, 428 | 268×106 | `places[].desc`, V45Sans 14px paper, line-height 20px, xuống dòng |
| Nút Dẫn đường | 944, 558 | 268×48 | V45Sans 16px đậm, nền gold alpha 0.85, chữ ink; viền gold 1px |
| Hướng dẫn | 944, 612 | 268×18 | V45Sans 12px muted, căn giữa “Chọn địa danh để dẫn đường” |

**Trạng thái (chỉ một dòng, thứ tự ưu tiên):**
1. “Đang ở đây” — jade, nếu ID bằng `p.mapId`.
2. “Vùng an toàn” — jade, nếu ID là `thon` và không phải vị trí hiện tại.
3. “Đã khám phá” — jade, nếu ID thuộc `p.discovered`.
4. “Chưa khám phá” — muted, các vùng còn lại.

**Nội dung V22_REG**, từng dòng theo thứ tự, x=944, y bắt đầu 282, cách 20px (nếu xuống dòng, tăng thêm đúng 20px và cuộn trong vùng 128px, không đè mô tả/nút):

| Nhãn hiển thị | Nguồn thực | Quy tắc |
|---|---|---|
| Cảnh giới | `V22_REG[id].realm`, `.min`, `.max`; đối chiếu `places[].realmHint` | Hiện đúng “realm · Lv min–max” như bảng §2.3; thôn hiện “Vùng an toàn”. realmHint là bản sao dùng trình bày, chỉ update nếu metadata thật đổi; không dùng để khóa. |
| Chiến lực gợi ý | `V22_REG[id].power` | Số hoặc định dạng thực của game, không tính thay theo CL người chơi |
| Tài nguyên | `V22_REG[id].resource` | Tên/giá trị hiển thị thật; xuống dòng nếu dài |
| Boss | `V22_REG[id].boss` | Hiện tên thật, **thôn không có boss nên ẩn dòng** |
| Phẩm chất rơi đồ | `V22_REG[id].qlo`–`.qhi`, tên lấy từ `QUALITY[]` theo formatter hiện có | Hiện tên phẩm chất thấp–cao, nếu hai giá trị giống nhau chỉ hiện một; không tự đặt tên phẩm/giá trị |

Nếu thiếu dữ liệu một trường thì ẩn riêng dòng đó, xếp dòng tiếp theo lên, không hiển thị undefined/null. Tôn trọng trường giá trị 0 hợp lệ. Không áp điều kiện khám phá cho các trường này.

**Cảnh báo:** nếu `V22_REG[id].min > p.level`, hiển thị red “Cấp đề nghị X–Y · nguy hiểm” (X=min, Y=max); giữ nút Dẫn đường sáng và bấm được, không phủ lớp khóa. Với thôn không có đề nghị cấp, không thêm cảnh báo. Cảnh báo là dòng riêng, không thay trạng thái khám phá. Đọc số liệu thật, không suy từ chuỗi realmHint.

**Nút:** nhãn luôn “Dẫn đường”; chỉ vô hiệu khi ID đang chọn là `p.mapId` (nền ink alpha 0.85, viền muted alpha 0.35, chữ muted). Nếu chưa chọn được ID hợp lệ (chẳng hạn p.mapId không có trong 10 vùng), ẩn nút, hiện “Chọn địa danh” ở vùng tên, dòng trạng thái và thông tin để trống; chọn một node thì hiện nút theo quy tắc trên. Không có trạng thái vô hiệu theo cấp hoặc khám phá.

Mặc định khi vào world, chọn `p.mapId` nếu là ID thuộc places. Chiều cao/nút cố định khi đổi vùng. Mô tả luôn lấy desc trong data, không ghi điều kiện. Với nội dung dài hơn vùng cho phép, wrap/scroll cục bộ; wheel chỉ tác động phần đang hover, không cuộn cảnh.

### 2.6. Chú giải và tooltip

Chú giải bắt buộc đúng 4 nhóm: icon 12×12px tâm y=669, cách chữ 6px, V45Sans 13px paper.
- x=48: “Hiện tại” (jade).
- x=190: “Đã khám phá” (red).
- x=390: “Chưa khám phá” (ink, dấu “?” paper).
- x=610: “Đường đi” (mẫu nét đứt ink trên ô paper 28×12).
- x=866, y=655, w=366, h=28: “Chọn địa danh · Esc: Đóng”, căn phải; M vẫn theo dispatcher gốc.

Tooltip cho cả 10 node, kể cả “?”: 120–256px rộng, 44px cao (tên + trạng thái), tối đa 68px khi tên xuống 2 dòng; ink alpha 0.92, viền gold alpha 0.60, tên paper 14px, trạng thái 12px jade hoặc muted theo §2.5. Xuất hiện sau hover 180ms, fade 100ms. Đặt cách pointer 14px phải/dưới, lật hướng nếu tràn, clamp vào (56,114)…(896,634). Không bắt input, ẩn khi rời hitbox, đổi node/tab hoặc đóng modal. Tên chưa khám phá vẫn hiện đầy đủ.

## 3. Tương tác và hoạt ảnh

| Hành động | Kết quả | Thời gian |
|---|---|---:|
| M / nút Bản đồ hiện có | Mở `worldMapPanel` theo dispatcher và tab mặc định gốc; khi vào world chọn p.mapId nếu hợp lệ | Fade 120ms ease-out; chặn input nền ngay |
| Thanh Thạch | Đặt `modal.v16Map='local'`, hiển thị bản đồ thôn gốc; ẩn chi tiết/tuyến world, xóa hover | Tab phản hồi 80ms, đổi nội dung ngay |
| Sơn Hà Đồ | Đặt `modal.v16Map='world'`, hiện địa đồ; mặc định chọn p.mapId nếu hợp lệ | Tab phản hồi 80ms, đổi nội dung ngay |
| Click node / nhãn (đã hoặc chưa khám phá) | Chọn ID, đổi bảng chi tiết, không di chuyển | Cập nhật cùng frame, viền 100ms |
| Click “Dẫn đường” (ID khác p.mapId) | Đóng modal, giao goal thật cho `v8SetGoal`, thông báo cảnh báo nếu dưới min | Thực thi ngay một lần; không hoãn để chạy fade |
| Click Dẫn đường tại vùng hiện tại | Không phát lệnh, nút vô hiệu | 0ms |
| Hover | Vòng hover 80ms; tooltip sau 180ms, fade 100ms | Như §2.6 |
| Click nền giấy trống | Giữ lựa chọn, không đi/đóng | 0ms |
| Đóng [Esc] / Esc / M nếu dispatcher gốc hỗ trợ đóng | Đóng modal, bỏ UI chọn/hover; không thay goal đang có | Đóng logic ngay; fade trang trí 100ms nếu không ảnh hưởng input |
| p.mapId / p.discovered / p.level đổi | Cập nhật vị trí, fog, cảnh báo và nút ở frame kế tiếp | Không đổi data/save |

**Hợp đồng dẫn đường (theo review mục 2.1):** Với ID hợp lệ khác vị trí hiện tại, hành vi code thật là `modal=null; v8SetGoal({x:REG[id].x, y:REG[id].y})`. Nếu `V22_REG[id].min > p.level`, giữ đúng thông báo gốc `message('Cẩn thận! … cấp đề nghị X')` (X là min, nội dung đầy đủ dùng cách format hiện tại). Luôn dẫn đường, kể cả cấp thấp hoặc chưa khám phá. Không có handler từ chối, không yêu cầu xác nhận, không thêm khóa cấp/điều kiện, không teleport hoặc tự gán p.mapId. Không dùng tỷ lệ art làm x/y goal. Phát lệnh đúng một lần cho mỗi click nút hợp lệ; modal đóng tức thì nên không nhận click thứ hai. Nút phản hồi 80ms chỉ là trang trí nếu còn frame hiển thị, không trì hoãn hành động.

Mọi trạng thái hover/chọn là UI tạm, không ghi save. Không sửa hành động của tab local. Không tự đánh dấu đã khám phá khi chọn hoặc dẫn đường; game hiện có cập nhật p.discovered theo luồng riêng. Tránh click xuyên xuống cảnh/dock/minimap/quest/kỹ năng khi mở và khi đóng modal. Giữ nguyên quy tắc input, pause, tiếp tục game sau T03/T06. Không thêm zoom/pan mới. Cache ảnh, tuyến, fog; chỉ invalidation khi dữ liệu/tình trạng khám phá hoặc hệ tọa độ thay đổi, không tạo canvas/ảnh/gradient liên tục. Mục tiêu 60fps, Muse đo thực tế, không công bố đạt khi chưa test.

## 4. Dữ liệu cần — đối chiếu review

| Ý nghĩa | Nguồn |
|---|---|
| Vị trí | `p.mapId` |
| Đã khám phá | `p.discovered` (mảng ID thật); không thêm field save |
| Cấp nhân vật | `p.level`; so với `V22_REG[id].min` để cảnh báo, không để khóa |
| Node / tên / ấn / mô tả / hint | `DATA.world_map.places` đúng bảng §2.3; desc ≤90 ký tự, hint ≤24 ký tự, dữ liệu hiển thị |
| Địa lý | `REGIONS` (nguồn tọa độ đã dùng trong review), `REG[id].x/y` dùng cho goal thực; không dùng tỷ lệ art |
| Đường nối | `ROAD_EDGES`, đúng 13 cặp trong `DATA.world_map.paths`; không đổi đường thật |
| Thông tin chi tiết | `V22_REG[id].realm/min/max/power/resource/boss/qlo/qhi` và `QUALITY[]` |
| Điều hướng | `modal=null`; `v8SetGoal({x:REG[id].x, y:REG[id].y})`; `message(...)` khi cấp thấp |
| Chuyển tab | `modal.v16Map='local'` hoặc `'world'`, dispatcher worldMapPanel |
| Minimap | `owMiniMap` sau T06, giữ T10 v1.2 |
| Ảnh | `ASSETS["world_map_ink"]` (assets/world_map_ink.webp, 1586×992), asset khai báo không có đuôi |

**Nạp data:** `data/world_map.js` chỉ gồm một phép gán `DATA.world_map = {...};` với JSON hợp lệ, version:1, đúng schema T14. Muse thêm thẻ nạp dưới `data/00_init.js` trong index.html tại T20. Đọc data một lần, xác nhận đủ 10 ID/tên/ấn, 13 cạnh khớp ROAD_EDGES, x/y và hint đúng review. Nếu dữ liệu thiếu/không hợp lệ, giữ bản đồ cũ, thông báo lỗi khởi tạo; không đổi quy tắc điều hướng. Khi code thực thay đổi, cập nhật data trình bày theo code đã xác nhận; không dùng data để sửa luật game.

Review v1.2 đã có tất cả số liệu/biến/hàm cần thiết từ Claude. T20 chỉ bắt đầu sau T06 và T19 DONE; cần test thực trong trò chơi trước nghiệm thu, không có code game được sửa ở T19.

## 5. Không làm

- Không sửa src/, index.html, gameplay map, HUD, minimap, quest, dock; không làm T06 hoặc T20.
- Không thêm vùng, cửa dịch chuyển, tuyến, khóa cấp, phí, cơ chế khám phá, save, fast travel hay điều kiện dẫn đường.
- Không thay ảnh WebP đã tích hợp hoặc tạo bản đồ thứ hai song song; không thay địa lý thật theo ảnh.
- Không đổi bảng màu hoặc font Design Bible, không phá tab local, khung dùng chung hoặc phím gốc.

## 6. Checklist nghiệm thu (Claude/Muse trên bản chơi)

- [ ] 1280×720 có khung (24,24,1232,672), ảnh (48,106,856,536), bảng (924,106,308,536), đúng 3 nút Thanh Thạch / Sơn Hà Đồ / Đóng [Esc], không chồng/cắt chữ.
- [ ] 1366×768 và 1920×1080: scale đúng Canvas, hitbox, nhãn và bảng không lệch/tràn, click đúng ID.
- [ ] M/nút Bản đồ mở đúng panel; click Thanh Thạch đặt modal.v16Map='local' và giữ đầy đủ bản đồ thôn gốc; Sơn Hà Đồ đặt 'world'; tab đang chọn nổi đúng, đóng qua nút/Esc.
- [ ] Ảnh dùng ASSETS["world_map_ink"] từ WebP 1586×992; không méo, cache đúng; nếu thiếu ảnh vẫn tương tác được.
- [ ] data JSON hợp lệ, version 1, đủ 10 ID, x/y/ấn/realmHint đúng nguyên văn review; lưới 2×5 đúng, sai số render tối đa 1px do tỷ lệ 3 chữ số; không đổi địa lý khi khám phá.
- [ ] Có đúng 13 cặp đường nối theo ROAD_EDGES; không tự vẽ cạnh khác; các đường nét đứt dưới fog và node.
- [ ] Node hiện tại jade đúng p.mapId, đã khám phá red có ấn; chưa khám phá có fog và “?” nhưng vẫn có nhãn tên, tooltip, chọn và Dẫn đường được.
- [ ] Sau khi game thêm ID vào p.discovered, fog được bỏ và ấn hiện lại đúng, không phải do click node tự ghi save.
- [ ] Bảng chi tiết đúng thứ tự trạng thái, V22_REG realm/min/max/power/resource/boss/qlo/qhi, QUALITY[] và desc; thôn không có dòng boss; không hiện undefined hoặc số giả.
- [ ] Chọn vùng có min > p.level: dòng red “Cấp đề nghị X–Y · nguy hiểm”, nút Dẫn đường vẫn bấm được; click đóng modal, đặt đúng goal REG[id].x/y và cảnh báo message gốc. Không có khóa hoặc từ chối theo cấp/khám phá.
- [ ] Chọn vùng khác đã khám phá và chưa khám phá: click Dẫn đường gọi đúng 1 lần v8SetGoal, không teleport; vùng hiện tại nút vô hiệu; chỉ click node không đổi goal.
- [ ] Chú giải 4 nhóm “Hiện tại / Đã khám phá / Chưa khám phá / Đường đi”; tooltip 180ms, không che bảng; nhãn không cắt, không glyph lỗi.
- [ ] Đóng hoặc chuyển tab không reset đường dẫn, save hay combat; không click/scroll xuyên xuống HUD/cảnh.
- [ ] Test console không lỗi và kiểm hồi quy phím M M01; đo FPS mở địa đồ, mục tiêu 60fps, không nạp ảnh mỗi frame.
