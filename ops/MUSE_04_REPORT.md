# MUSE_04 — Muse (code nháp qua zip): MAP TÂN THỦ MỚI

Giao 22/11/2026 bởi Claude. Làm qua file zip, không dùng git/repo. Base đã gồm GÓI 03 đã ghép
(index.html đã nạp `data/lore.js`, `data/bestiary.js` và `src/60/62/63/64`).
Ảnh map CHƯA có — mọi sprite vẽ khối màu giữ chỗ đúng kích thước khai báo; khi ảnh về
chỉ việc đăng ký vào `ASSETS` đúng khóa phẳng là thay, không sửa code.

## Nộp

- `data/town_layout.js` — M1 (11.809 byte; sau M3: 13.913 byte, thêm chatter/sway/smoke/points kind mới)
- `src/65_town_map.js` — M2 (22.504 byte)
- `src/67_town_life.js` — M3 (30.411 byte)
- `ops/patches/MUSE_04.json` — 12 PATCH (8 của M2 + 4 của M3)
- `MUSE_04_REPORT.md` — file này

File nháp KHÔNG đưa vào zip: `check_M1.js`, `check_M2.js`, `check_M3.js`,
`ops/patches/MUSE_04_M2.json`, `ops/patches/MUSE_04_M3.json` (đã gộp xong vào `MUSE_04.json`).

---

## M1 — Bố cục thôn mới → `data/town_layout.js`

Dữ liệu thuần, `'use strict'` ở đầu, một dòng gán `DATA.town_layout = {...}` (JSON hợp lệ).
`{version:1, w:3200, h:1800, spawn:{x:1600,y:1180}, tiles, decals, objects, paths, water, blocks, points, gates}`.

### Nội dung

- **87 objects**: 10 nhà/công trình đúng tên asset §4 (`b_inn` Đại điện 960×760,
  `b_cave` Động phủ, `b_herbalist` Dược đường, `b_wanderer` Tán tu, `b_forge` Lò rèn,
  `b_shop` Thương nhân, `b_board` Bảng ủy thác 180×220, `b_well` giếng 180×180,
  `b_gate` cổng chào 560×520, `b_sentry` Hộ vệ đường), 3 sạp chợ `s_stall_1..3`,
  2 cầu (`s_bridge_stone` 440×240, `s_bridge_wood` 380×200), ruộng `s_field` 440×300,
  3 hình nộm `s_dummy_1..3` (120×180) + giá binh khí `s_rack` (220×170) ở sân luyện,
  **43 cây** (trúc 19 + thông 11 + anh đào 8 + liễu 5), 2 đèn lồng, 6 đoạn hàng rào gỗ /
  lan can đá quanh quảng trường (chừa lối ra 4 hướng), 6 bụi, 5 đá, 2 thùng + 1 thùng rượu, 2 cờ.
- **13 paths** (đường đất 70–90px + bậc đá 90px): trục đông–tây qua Lò rèn–Thương nhân–
  Chợ–spawn–Sân luyện; bậc đá lên Đại điện; nhánh tới Dược đường, Tán tu, Động phủ,
  Bảng ủy thác, Chợ; đường qua 2 cầu sang bờ nam tới Linh điền, Hộ vệ đường, cổng;
  đường bờ nam nối Linh điền–Hộ vệ đường.
- **tiles 7** (mặc định `grass_a`; 3 mảng `grass_b`, bãi cát 2 bờ sông, ruộng `tile_soil`,
  quảng trường `tile_stone` 1300–1900 × 850–1250), **decals 6**, **water 3 đa giác**,
  **blocks 6**, **points 11** (giữ đúng id + tên trong `V471_NODES`), **gates 1**
  (`{to:"truc", x:2960, y:1680, r:90}`).
- Quy ước `foot`: nhà foot ≈ 80% w, cao 50px, đáy foot cách đáy sprite 20px — nhờ đó các
  point đúng toạ độ §3 (nằm ngay tại chân nhà) vẫn đứng NGOÀI foot, cách 20px về phía nam.
  Cầu và ruộng foot 0×0 (đi được / đứng được). Cây foot nhỏ 50×25 ở gốc.
- Quy ước sông/cầu: water vẽ thành đúng 3 đa giác x 0–1080, 1520–1910, 2290–3200,
  y 1340–1460. Lỗ hổng đúng vị trí 2 cầu: cầu đá (1300,1400) phủ x 1080–1520,
  cầu gỗ (2100,1400) phủ x 1910–2290. Cầu foot 0×0 nên đi qua được; kiểm va chạm chỉ
  cần xét water (không cần ngoại lệ cầu riêng vì water đã chừa lỗ).
- Rừng trúc tây: 19 cây trúc x<300, tránh dải sông (không cây nào có foot trong
  y 1340–1460) và tránh foot Lò rèn; block rừng tây x<120 chồng lên gốc trúc là cố ý.
- Giếng + Bảng ủy thác chắn đường lên Đại điện: bậc đá không đi thẳng x=1600 mà vòng
  tây qua (1350,1010)–(1350,860) rồi chéo lên (1600,700); hàng rào bắc chừa khe
  1380–1750 đúng chỗ bậc đá cắt qua.
- **Lưu ý cho M2/Claude**: sprite Đại điện 960×760 đặt tại y=520 nên đỉnh sprite tràn
  lên trên mép map (y=-240); sprite cổng chào (2960,1680, w560) tràn 40px qua mép đông
  (x tới 3240) nhưng foot (2764–3156) vẫn trong map.

### Hàm/biến game đã dùng

- Không dùng hàm game nào (dữ liệu thuần). Tên + id điểm lấy từ `V471_NODES`
  (`src/48_v48_v47.js:378`): `inn` 'Đại điện · Trưởng lão', `shop` 'Thương nhân',
  `herbalist` 'Đan phòng', `wanderer` 'Tán tu', `sentry` 'Hộ vệ đường',
  `v13_forge` 'Lò rèn', `v13_market` 'Chợ linh vật', `v13_board` 'Bảng ủy thác',
  `v13_farm` 'Linh điền', `training` 'Sân luyện', `v31_cave` 'Động phủ'.

### PATCH: không có. Trường save mới: không có.

### Tự kiểm Node (`node --check` OK + `node check_M1.js`)

- **TOTAL: 31 PASS / 0 FAIL** — BFS lưới 16px từ spawn tới được cả 11 points + 1 gate
  (17.928/22.600 ô tới được); 0 cặp foot chồng nhau (84 foot rắn); không point/gate nào
  nằm trong foot/water/blocks.

---

## M2 — Bộ ghép map + va chạm → `src/65_town_map.js`

`'use strict'` ở đầu, script cổ điển. `const TOWN_NEW = true;` ở đầu file
(`src/65_town_map.js:41`) — `false` thì dùng lại map cũ y nguyên.

### Hàm mới trong file

- `townLayout()` (:52), `townLayoutValid(L)` (:56), `townMapReady()` (:65) —
  kiểm `DATA.town_layout`, `console.warn` đúng 1 lần khi thiếu rồi tắt module (fallback map cũ).
- `townApplyLayout(nodes)` (:77) — áp points/gates/spawn từ layout vào `V471_NODES` /
  `V47T_MAP`, giữ id + name.
- `townInPoly` (:96), `townProj` (:104), `townDistToSeg` (:111), `townSnap(q)` (:116).
- `townBlocked(x,y,r)` (:132) — foot + water (trừ cầu) + blocks + biên map.
- `townImg(asset)` (:155) — cache `Image` một lần khi `ASSETS[asset]` có; thiếu thì
  trả null để vẽ khối màu giữ chỗ.
- `townDrawObject(o)` (:174) — vẽ sprite thật nếu có ảnh, không thì khối màu đúng w/h
  (nhà = hộp + mái tam giác, cây = tán tròn + thân, cầu = dải nâu nhạt + lan can…).
- `townGroundTile(tx,ty)` (:237) — cache nền theo ô 512px ra canvas phụ (cỏ + tiles +
  đường + nước + decals + đốm), vẽ một lần, dùng lại.
- `townNPCs()` (:301), `townSortDrawList(list)` (:316), `townBuildDrawList(...)` (:320) —
  một danh sách y-sort chung objects + người chơi + NPC theo y chân tăng dần.
- `townRectsOverlap` (:335), `townDrawWorld()` (:340) — vẽ thế giới mới, clip vào rect
  map (0,0,3200,1800) để xử lý tràn mép Đại điện / cổng chào; nhà/cây che người chơi
  thì làm mờ phần che (alpha .5).
- `townFrameStats()` (:401), `townDrawMapBg(x,y,w,h)` (:408),
  `townDrawMapPoints(x,y,w,h,labels)` (:441) — bản đồ M + bản đồ nhỏ vẽ thu nhỏ từ layout.
- Dòng cuối file (:463): nếu `TOWN_NEW` thì `townMapReady()` (áp lười ở lần dùng đầu).

### Quy ước ảnh đã chốt

`ASSETS[asset]` — khóa phẳng, KHÔNG tiền tố `map_` (căn cứ `ASSETS_LIST.txt` dòng 1:
`ASSETS["loading_truc"]`, `ASSETS["portrait_inn"]`; giá trị là URL chuỗi theo mẫu
`src/63_lore.js:91-95`, cache `Image` một lần). Có ảnh → `drawImage`; thiếu → khối màu
giữ chỗ đúng w/h. Khi ảnh thật về, đăng ký đúng khóa phẳng (`"b_inn"`,
`"tile_grass_a"`, …) là thay, không sửa code.

### Hàm/biến game đã dùng (tên + file:dòng)

- `V47T_MAP` (`src/48_v48_v47.js:203`), `V471_NODES` (:378), `V471_SPAWN` (:379),
  `V471_SEG` (:381–382), `V47T` (:208), `V47T_MAP.gates[0]`, `V47T.cam`.
- `v47tBlocked` live (:383) — bản :210 (vòng tròn `V47T_OBSTACLES`) đã chết, không đụng.
- `v47tDraw` live (:460), `v471MapArt` (:443), `v471MapPoints` (:444), `v471Snap` (:384),
  `v471Route` (:402), `v47tUpdate` (:269), `v47tDrawHero` (:299) → `v471Hero(V47T,110)`
  (:430–431), `v46CanEnter` (:146).
- `dist`, `clamp`, `TAU`, `circle` (`src/01_core.js:189`), `v33Fit`
  (`src/22_v33_v32.js:62`), `V45.paper`, `g`/`W`/`H`, `DATA.town_layout`.
- **Không dùng `V47T_NPCS` (:205)**: chỉ còn được tham chiếu bởi các hàm cũ đã bị gán đè,
  và tọa độ cũ (1600,1400)/(640,1420) nằm **giữa sông** ở layout mới. NPC trong y-sort
  lấy từ điểm layout: Trưởng lão (inn +40y), Thương nhân (shop +40y).
- `v47tMapGoal` (:407), `v471Near` (:386), `v36Leave` (:411), `v42tOpen` (:413) không sửa —
  chạy nguyên nhờ `V471_NODES` giữ id/tên.

### PATCH — 8 cái, toàn bộ vào `src/48_v48_v47.js` (`ops/patches/MUSE_04.json`)

| # | Chỗ patch | Nội dung |
|---|---|---|
| 1 | `v47tBlocked` live (:383) | `if(TOWN_NEW&&townMapReady())return townBlocked(x,y,r);` rồi logic cũ. Va chạm thôn mới (foot + nước trừ cầu + blocks) khi TOWN_NEW; false thì chạy hành lang cũ y nguyên. |
| 2 | Khởi tạo spawn/gates (:379) | Giữ dòng cũ + `if(typeof TOWN_NEW!=='undefined'&&TOWN_NEW&&typeof townApplyLayout==='function')townApplyLayout(V471_NODES);` — `typeof`-guard vì dòng này chạy lúc nạp src/48, trước khi src/65 tồn tại; việc áp thật do init cuối src/65 + `townMapReady()` (áp lười) đảm nhiệm. |
| 3 | `v47tDraw` live (:460) | Mở khối `else{...}` quanh khối vẽ thế giới cũ: mới → `townDrawWorld()`, cũ → `v471MapArt` + cổng + điểm + `v47tDrawHero()` y nguyên. |
| 4 | Đóng khối else của PATCH 3 | Khi TOWN_NEW, hero đã vẽ trong y-sort của `townDrawWorld` nên không vẽ lại. |
| 5 | `v471MapArt` (:443) | Mới → `townDrawMapBg()`, cũ → tranh `v47thon`. Nền bản đồ M + bản đồ nhỏ từ layout. |
| 6 | `v471MapPoints` (:444) | Mới → `townDrawMapPoints()` (cổng vẽ hình thoi để phân biệt), cũ → giữ nguyên. |
| 7 | `v471Snap` (:384) | Mới → `townSnap()` (bám đường layout) khi TOWN_NEW, rồi fallback snap cũ. Lý do: một số đầu mút hành lang cũ nằm trong sông ở layout mới (vd (1623,1390)). |
| 8 | `v471Route` (:402) | Thêm ~55 nút điểm đường layout vào đồ thị Dijkstra khi TOWN_NEW. **Bắt buộc, phát hiện từ test**: chỉ dùng đầu mút cũ thì Hộ vệ đường (2520,1600) và cổng Trúc (2960,1680) báo "Không tìm được lối đi" (đường thẳng qua sông bị nước chặn). |

### Trường save mới: không có.

### Tự kiểm Node (`node --check` OK cả 2 file mới + `node check_M2.js`)

- **TOTAL: 51 PASS / 0 FAIL** (nạp code thật trong VM + canvas giả):
  1. **y-sort**: mẫu nhà 600 / cây 500 / hero 550 / NPC 580 → đúng 500,550,580,600;
     `townBuildDrawList` thật xếp y tăng dần, có hero + 2 NPC.
  2. **townBlocked**: trong nhà = chặn; giữa đường = không; cầu đá (1300,1400) +
     cầu gỗ (2100,1400) = không; giữa sông (1000,1400)/(1700,1400) = chặn;
     rừng tây x=60 = chặn; ngoài biên = chặn; spawn = không; **11/11 điểm + cổng
     đi được với r=28**; mép cầu (1090,1400) = không.
  3. **TOWN_NEW=false**: `V471_NODES`/spawn giữ tọa độ cũ, `v47tBlocked` cũ chạy
     (giữa hành lang đi được, ngoài hành lang chặn), không warn.
  4. **DATA thiếu**: `townMapReady()=false`, `console.warn` đúng 1 lần, không crash,
     fallback logic cũ.
  5. **Hiệu năng, camera mẫu (1000,800)**: frame 1 vẽ **37/87 objects + 12 ô nền**
     (tổng 28 ô); frame 2 **không tạo canvas phụ mới** (groundCreated 12→12);
     hero vẽ 1 lần/frame; che khuất: hero trước cửa Đại điện → `occluded=1`
     (mờ alpha .5); bản đồ M vẽ từ layout không lỗi; có `ASSETS["b_inn"]` →
     `drawImage`, thiếu → khối màu.
  6. **Dẫn đường thật `v471Route`**: 11/11 điểm + cổng tới được (cần PATCH 8 mới được;
     trước đó sentry + cổng FAIL).
- Cách đạt hiệu năng: nền vẽ 1 lần vào cache canvas 512px (cỏ + tiles + đường + nước +
  decals + đốm), mỗi frame chỉ `drawImage` ô trong khung camera (+lề 200px); vật thể
  cũng chỉ vẽ khi chạm khung.

---

## Kiểm tra gộp của điều phối viên (chạy lại độc lập)

- 2 file mới đều `'use strict'` ở đầu, `node --check` OK, không có mẫu bọc đè hàm.
- Chạy lại cả 2 bộ kiểm Node: **M1 31/31 PASS, M2 51/51 PASS — tổng 82/82, exit 0**.
- 8 PATCH trong file gộp: mỗi `old` xuất hiện đúng 1 lần trong `src/48_v48_v47.js`
  (đếm lại từ file gộp); áp tuần tự cả 8 trong bộ nhớ: OK, không chồng `old`,
  file sau khi áp `vm.Script` parse OK.
- `ops/patches/MUSE_04.json` = 8 PATCH của M2 (M1 không có PATCH).

## Rủi ro / chỗ cần Claude kiểm trên trình duyệt

1. **Chi phí dẫn đường**: đồ thị mới ~95 đỉnh → `v471Route` mất **118–437ms/lần bấm**
   trong VM Node (đồ thị cũ 106ms). Một lần mỗi lần đặt đích, không phải mỗi frame,
   nhưng cần đo trên trình duyệt thật; nếu lag, có thể cắt nút đường chỉ còn các đường
   qua sông/vùng nam.
2. **Va chạm — nới 12px**: `townBlocked` chỉ nới foot/blocks tối đa 12px (không nới nước,
   chỉ chặn khi điểm nằm trong đa giác). Lý do: code cũ không nới vật cản theo r, và các
   điểm đứng cách foot 20px — nới >20px sẽ làm 7/11 điểm + cổng bị chặn, `v471Route`
   từ chối. Người chơi có thể đứng sát chân nhà 12px (sprite đè nhau thì y-sort + mờ
   alpha .5 xử lý) — cần nhìn mắt kiểm.
3. **Cổng về thôn (ax/ay)**: tự chọn (2800,1680) = cổng lùi 160px về phía tây, chưa có
   trong layout; kiểm tra điểm hồi thôn từ Trúc về không kẹt (điểm này đi được theo
   `townBlocked`, nhưng chưa chạy `v47tEnter(fromGate)` thật).
4. **Tràn mép**: Đại điện (đỉnh y=-240) và cổng chào (x tới 3240) được xử lý bằng clip
   toàn lớp thế giới vào rect map (0,0,3200,1800) trong `townDrawWorld` — cần nhìn mắt
   kiểm không còn vẽ lấn ra ngoài.
5. **NPC**: vị trí NPC là suy luận của M2 (điểm +40y), không có trong layout;
   `v47tInteractNPC` live dùng `v471Legacy` theo node nên tương tác không phụ thuộc
   vị trí vẽ này — nhưng Claude nên xác nhận NPC đứng đúng chỗ cửa.
6. **Bố cục có hợp mắt không khi chưa có ảnh thật**: màu khối giữ chỗ, độ đẹp bản đồ M,
   hiệu ứng mờ che khuất, và cảm giác di chuyển qua cầu/sông đều cần Claude xem trên
   trình duyệt. Y-sort/che khuất và va chạm cầu/sông chưa kiểm bằng mắt.
7. **Thứ tự nạp**: `data/town_layout.js` phải nạp trước `src/65_town_map.js` (Claude thêm
   thẻ `<script>` — data/ đã đứng trước src/ trong `index.html`, và `townMapReady()` có
   áp lười nên lệch thứ tự vẫn đúng; PATCH 2 có `typeof`-guard nên không vỡ nếu 65
   chưa nạp).

## Ghi chú máy

Ghi file bằng công cụ ghi file + shell đều chạy được trong phiên này; không dùng
Python/git/Chromium; Node dùng để tự kiểm, in ra màn hình, không ghi file từ Node.

---

## M3 — Thôn sống động + tương tác → `src/67_town_life.js` (thêm 22/11 11:35)

`'use strict'` ở đầu, script cổ điển. Đăng ký `FRAME_HOOKS.update.push(townLifeTick)`
ở cuối file (:644). Ảnh dân làng/động vật chưa có → vẽ giữ chỗ (người = elip thân +
tròn đầu cao 104 px, gà/chim = chấm nhỏ có cánh đập) nhưng đủ hành vi. Chỉ làm §2
Sống động & tương tác của `ops/newbie_map_25d.md`; §1 chiều sâu 4 lớp/ánh sáng là việc
của Claude/ChatGPT, KHÔNG làm.

### Nội dung

- **5 dân làng** đi theo `paths` trong layout, lịch theo giờ
  (`(p.worldTime%360)/15`: 5–9 chợ, 9–12 giếng, 12–15 ruộng, 15–19 chợ, đêm về nhà),
  tránh người chơi (46px, 70px/s) + va chạm `townBlocked`, bong bóng thoại 1 câu khi
  đi ngang (từ `DATA.town_layout.chatter`, 20 câu đời thường tiếng Việt).
- **Động vật:** gà quanh ruộng, chó/mèo hiên nhà, vịt trên sông, chim bay vụt khi người
  chơi < 140px (đáp lại sau), bướm chỉ ngày / đom đóm chỉ đêm (đêm = giờ ≥19 hoặc <5,
  theo `b04EventTime` src/55:27).
- **Cỏ/bụi rung** khi người chơi đi qua gần (đối tượng `sway:true`); gió lắc đỉnh cây.
- **Nước:** vòng sóng khi người chơi ở bờ/cầu, gợn sáng chạy, cá nhảy ngẫu nhiên.
- **Hạt:** lá/cánh hoa theo gió, khói 3 ống khói, tàn lửa lò rèn, bụi chân khi chạy trên
  đất, dấu chân mờ dần (tối đa 40). Hạt tối đa 120, chỉ cập nhật trong khung camera
  + 300px.
- **Vật tương tác (nhấn E, qua points kind mới):** ghế đá ngồi hồi **36 máu/giây**
  (= ×3 mức 12 máu/giây ở thôn trong `worldUpdate`, src/03:67), đứng dậy khi di
  chuyển/mở bảng; chuông (chim bay + thông báo); giếng +10 MP, 3 lần/ngày; câu cá
  (thả câu → phao chìm trong 1,5–4s → E trong 0,9s → +1 linh thảo qua
  `v13Adjust('herb',1)`, 5 lần/ngày); cửa nhà mở khi lại gần <160px.
- Mọi thứ vẽ qua danh sách y-sort chung của M2 (không dùng overlay). Trạng thái chạy
  (dân làng, hạt, ngồi/câu) chỉ trong bộ nhớ, không lưu.

### Hàm mới trong file

- `townLifeActive()` (:47), `townLifeState()` (:57), `townLifeInit()` (:102).
- `townLifeDestFor()` (:159, lịch theo giờ), `townLifePickPath()` (:170),
  `townLifeTryStep()` (:76) / `townLifeStepAny()` (:85) / `townLifeMove()` (:91,
  va chạm + thoát kẹt).
- `townLifeNear()` (:194), `townLifeInteract()` (:224), `townLifeTick()` (:276).
- `townLifeDrawEntries()` (:450) / `townLifeDrawEntry()` (:484, vẽ giữ chỗ).

### Hàm/biến game đã dùng (tên + file:dòng)

- `FRAME_HOOKS.update` (src/01_core.js:8); `TOWN_NEW`, `townMapReady()`, `townLayout()`,
  `townBlocked(x,y,r)`, `townBuildDrawList()`, `townDrawWorld()`, `townStats`
  (src/65_town_map.js:41,65,52,132,320,340).
- `v47tIsActive()` (src/48:385), `v47tInteract` (:416), `v471Dock` (:459),
  `v471Near()` (:386).
- `V47T` (x, y, cam, moving), `V471_NODES`, `V47T_MAP`, `W/H`, `TAU`, `dist`,
  `message()`, `save()`, `currentStats()`, `modal`.
- Giờ/ngày theo code có sẵn: giờ `(p.worldTime%360)/15` (src/04 `hdSun`), ngày
  `Math.floor(p.worldTime/360)` (= `v13Day()`, src/09:31), đêm = giờ ≥19 hoặc <5.
- `v13Adjust('herb',1)` (src/09) cho thưởng câu cá.

### Layout đã bổ sung (sửa thẳng `data/town_layout.js` — file của mình, không PATCH)

- `chatter`: 20 câu đời thường tiếng Việt.
- `sway:true` trên 6 bụi `p_bush_*` + 19 trúc `t_bamboo_*` (25 đối tượng).
- `smoke`: 3 ống khói — lò rèn (380,830), đan phòng (640,420), tiệm (760,780).
- 6 points kind mới (11 điểm cổ điển giữ nguyên id): `bench_1` ghế đá (1330,1160),
  `bell_1` chuông (1790,600), `well_1` giếng (1600,1030), `fishing_1` bến câu
  (2100,1400 — trên cầu gỗ), `door_inn` (1600,545), `door_shop` (760,1000).
  Cả 6 đều đi được (BFS + `townBlocked` đều PASS).
- An toàn với M1/M2: `townApplyLayout` chỉ map `points` theo id trùng với `V471_NODES`
  nên 6 điểm kind mới KHÔNG lọt vào dock E/bản đồ M/BFS cũ — đã kiểm bằng chạy lại
  harness M1/M2 (xem dưới). Harness cũ chỉnh nhỏ theo đúng spec: `check_M1.js` kiểm
  điểm đổi thành "11 cổ điển + 6 kind"; `check_M2.js` 2 chuỗi log "11/11" đổi thành
  đếm động theo `L.points.length`. Không sửa logic kiểm nào khác.

### PATCH — 4 cái của M3 (`ops/patches/MUSE_04.json`, gộp chung với 8 PATCH M2 = 12)

| # | Chỗ patch | Nội dung |
|---|---|---|
| 9 | `townBuildDrawList` (src/65:332) | Thêm `townLifeDrawEntries(list,…)` trước `return` — mục M3 vào y-sort chung của M2. `typeof`-guard vì src/67 nạp sau src/65. |
| 10 | `townDrawWorld` (src/65:366) | Thêm nhánh `if(e.kind==='life'){ townLifeDrawEntry(e); … continue; }` sau nhánh NPC — vẽ mục M3 trong lớp thế giới. |
| 11 | `v47tInteract` (src/48:416) | Kiểm `townLifeNear()` trước `v471Near()` — E tới ghế/chuông/giếng/bến câu qua đúng luồng E hiện có; cổng vẫn ưu tiên nhất, xa mọi điểm thì thông báo cũ y nguyên. |
| 12 | `v471Dock` (src/48:459) | Dock hiện tên điểm M3 khi đứng gần (vd "Ghế đá quảng trường"). Không đổi hành vi khi không có điểm M3 gần. |

### Trường save mới

- `p.townLife = {day, well, fish}` — duy nhất; khởi tạo mặc định khi thiếu, reset đếm
  khi ngày đổi; không đổi/xoá trường cũ.

### Tự kiểm Node (`node --check` OK + `node check_M3.js`, chạy 3 lần)

- **TOTAL: 63 PASS / 0 FAIL, chạy 3 lần liên tiếp đều 63/63** (harness nạp layout +
  src/48 đã áp PATCH M2+M3 trong bộ nhớ + src/65 đã áp PATCH M3 + src/67; stub ghi rõ
  trong đầu file). Bao phủ: dân làng di chuyển dọc paths + không xuyên va chạm; lịch
  theo giờ đổi điểm đến; chim bay <140px + đáp lại; bướm chỉ ngày/đom đóm chỉ đêm;
  hạt ≤120 (đo 30), dấu chân ≤40 (đo 17) + mờ dần; ghế ngồi hồi ~36 máu/s + đứng dậy
  khi di chuyển; giếng 3 lần/ngày + reset qua ngày; câu cá (thả → phao chìm → E trúng
  +1 herb qua `v13Adjust`, 5 lần/ngày, E sớm không tính); chuông (5/5 chim bay); cửa
  mở khi gần / đóng khi xa; E xa mọi điểm → thông báo cũ; save cũ không `p.townLife`
  vẫn chạy; dock hiện tên điểm M3; `TOWN_NEW=false` → không vẽ/không chạy; DATA thiếu
  → warn `[M3]` đúng 1 lần, không crash.
- **Chạy lại sau M3: `node check_M1.js` 43/43 PASS** (gồm BFS tới cả 6 điểm kind mới),
  **`node check_M2.js` 51/51 PASS** (gồm route tới cả 17 điểm) — M3 + bổ sung layout
  không làm hỏng M1/M2.

### Lỗi thật đã tìm và sửa trong lúc kiểm (ghi để Claude khỏi mò lại)

- `townLifeTryStep` từng tính cả bước "không đổi" là thành công → dân làng kẹt trong
  khe 1–2px giữa hàng rào và bảng ủy thác (1392,838) không thoát được; đã sửa chỉ tính
  thành công khi vị trí thật sự đổi + fallback 8 hướng dùng chung cho di chuyển và
  tránh người chơi.
- Nhà Cô Lan cũ (760,1060) nằm trong foot tiệm → spawn có khi rơi vào va chạm (tái
  hiện 2/8 lượt); đã dời nhà + thêm fallback snap spawn về mốc đường gần nhất.
- Nhánh `console.warn [M3]` trong `townLifeTick` ban đầu không tới được (do
  `townLifeActive()` return sớm khi thiếu layout); đã đảo thứ tự kiểm tra.

### Kiểm tra gộp M3 của điều phối viên (chạy lại độc lập)

- File mới `'use strict'` ở đầu, `node --check` OK, không có mẫu bọc đè hàm (chỉ có
  function expression cục bộ, không gán đè hàm game).
- Chạy lại cả 3 bộ kiểm: **M3 63/63, M1 43/43, M2 51/51 — tổng 157/157, exit 0**.
- 12 PATCH trong file gộp (8 M2 + 4 M3): mỗi `old` xuất hiện đúng 1 lần trong file
  đích (đếm lại từ file gộp); áp tuần tự cả 12 trong bộ nhớ: OK, không chồng `old`;
  file sau khi áp (`src/48`, `src/65`) `node --check` OK.
- Layout sau bổ sung đã kiểm bằng Node: chatter 20, smoke 3, sway 25 objects,
  6 kind points + 11 classic points, gate truc nguyên; `townApplyLayout` chỉ map
  theo id trùng `V471_NODES` nên điểm kind mới không lọt vào hệ cũ.

### Rủi ro M3 / chỗ cần Claude kiểm trên trình duyệt

1. **Dân làng có tự nhiên không:** đi theo paths nhưng đoạn chuyển đường đi thẳng cắt
   góc qua quảng trường (không bám đường cong); đã có trượt tường + thoát kẹt, nhưng
   mắt thường mới thấy có "cắt sân" hay đứng chờ lâu ở điểm đến không. Bong bóng thoại
   + tên chỉ hiện khi gần (<230px/<260px).
2. **E tương tác có ăn không:** đã kiểm bằng Node qua `v47tInteract` thật (đã PATCH),
   nhưng chưa kiểm bằng mắt: nút dock hiện tên điểm M3 chưa, ngồi ghế có thấy nhân
   vật ngồi không (hiện chỉ hồi máu + thông báo, KHÔNG đổi tư thế nhân vật — cần
   Claude/ChatGPT xem có cần pose ngồi không).
3. **Hiệu năng hạt:** giới hạn 120 hạt + culling camera+300 đã có, nhưng danh sách
   y-sort mỗi frame thêm ~70 mục life (đo ở camera mẫu: 70/111 mục) — cần đo FPS thôn
   thật (mốc ≥50 ở 1280×720).
4. **Ngày reset đếm có đúng không:** logic dùng đúng `Math.floor(worldTime/360)` như
   `v13Day()`; giếng/câu reset đã PASS bằng Node khi nhảy `worldTime` 120→480, nhưng
   chưa kiểm reset khi chơi qua nửa đêm thật (worldTime tăng dần từng giây,
   1 ngày = 360 giây game).
5. **Vị trí ống khói:** khói vẽ tại tọa độ ước lượng trên mái (chưa có asset nhà thật
   nên chưa biết đỉnh mái/ống khói thật ở đâu) — khi ảnh thật về cần chỉnh lại `smoke`.
6. Chưa kiểm bằng mắt/trình duyệt cho toàn bộ M3 (máy này không chạy Chromium theo
   quy định gói).
