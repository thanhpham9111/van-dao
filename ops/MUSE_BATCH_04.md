# GÓI VIỆC 04 CHO MUSE (qua zip) — Code nháp MAP TÂN THỦ MỚI: dữ liệu bố cục + bộ ghép map + va chạm

Giao 22/11/2026 bởi Claude. Ưu tiên của chủ dự án: **làm lại map tân thủ + chuyển động nhân vật**. Phân vai: ChatGPT vẽ linh kiện map, Gemini vẽ bộ phận nhân vật, **bạn code map**, Claude làm bộ xương chuyển động + ghép + kiểm trên trình duyệt.
Cách làm như GÓI 03: nhận zip → viết file mới + PATCH json → nộp `MUSE_04.zip`. Luật code giữ nguyên như `MUSE_BATCH_03.md` (file mới, `'use strict'`, không bọc đè, dùng FRAME_HOOKS, PATCH old/new đúng 1 lần, save cũ có mặc định).

**Đọc kỹ `ops/specs/newbie_map.md`** (bố cục mục 3, danh sách ảnh mục 4, quy ước mục 2). Ảnh map CHƯA có — bạn code với **ảnh giữ chỗ**: thiếu `ASSETS["map_<tên>"]` thì vẽ hình khối màu (nhà = khối hộp có mái tam giác, cây = tròn xanh, đường = dải nâu…) đúng kích thước khai báo, để Claude xem bố cục trước khi có ảnh thật. Khi ảnh về chỉ việc thả vào là thay.

## M1 — `data/town_layout.js`: bố cục thôn mới (dữ liệu, không code vẽ)
`DATA.town_layout = {version:1, w:3200, h:1800, spawn:{x,y}, tiles:[...], decals:[...], objects:[...], paths:[...], water:[...], blocks:[...], points:[...], gates:[...]}` — JSON hợp lệ:
- `tiles`: vùng lát nền `{tile:"grass_a"|..., poly:[[x,y],…]}` (vẽ theo thứ tự, sau đè trước); toàn map mặc định `grass_a`.
- `objects`: mọi nhà/đạo cụ/cây `{id, asset:"b_inn"|..., x, y, w, h, foot:{x,y,w,h}}` — `x,y` = **chân giữa đáy** (điểm y-sort), `w,h` = cỡ vẽ, `foot` = khối va chạm ở chân (tương đối so với x,y). Đặt đủ: 10 nhà/công trình mục 4, 3 sạp chợ, 2 cầu, ruộng, 3 hình nộm + giá binh khí ở sân luyện, ≥ 40 cây (rừng trúc mép tây, thông + anh đào rải rác), đèn lồng dọc đường, hàng rào/lan can đá quanh quảng trường.
- `paths`: đường đất/bậc đá `{tile:"dirt"|"stone", width, points:[[x,y],…]}` nối mọi điểm về quảng trường.
- `water`: đa giác sông (chảy tây→đông y≈1400) — chặn đi trừ trên cầu.
- `blocks`: biên chặn thêm (vách núi bắc, rừng tây, mép map).
- `points`: 11 điểm tương tác **giữ đúng id** (`inn`, `shop`, `herbalist`, `wanderer`, `sentry`, `v13_forge`, `v13_market`, `v13_board`, `v13_farm`, `training`, `v31_cave`) — `{id, name, x, y}` tại cửa/chỗ NPC đứng; `gates`: `[{to:"truc", x, y, r}]`.
- Tự kiểm: mọi điểm đi tới được từ `spawn` (BFS trên lưới 16 px với `foot`+`water`+`blocks`), không vật thể nào chồng `foot` lên nhau, không điểm nào nằm trong khối chặn.

## M2 — `src/65_town_map.js`: ghép + vẽ + va chạm, thay map tranh cũ
- Đọc code V47T hiện tại (`src/48_v48_v47.js`: `v47tDraw`, `v471MapArt`, `v47tBlocked`, `V47T_OBSTACLES`, `V471_NODES`, `V47T_MAP.gates`, `v47tUpdate`, `v471Hero`, `v47tDrawHero`, camera `V47T.cam`) và bản đồ M (`v471MapPoints`, sơ đồ thôn trong `panelInner`).
- **Vẽ:** nền tile (pattern, cache theo từng ô 512 px ra canvas phụ), đường + mép chuyển, nước; rồi **một danh sách y-sort chung**: mọi `objects` + nhân vật người chơi + NPC (vẽ theo `y` chân tăng dần) → người chơi đi ra sau nhà/cây đúng chiều sâu. Nhà/cây che người chơi thì làm mờ phần che (alpha .5) cho dễ nhìn.
- **Va chạm:** `townBlocked(x,y,r)` dùng `foot` + `water` (trừ cầu) + `blocks`; thay vào chỗ `v47tBlocked` dùng (PATCH).
- **Giữ API:** 11 điểm và cổng lấy từ layout mới nhưng giữ id/tên → `V471_NODES`, dẫn đường, nhấn E, nhiệm vụ, hội thoại chạy nguyên (PATCH chỗ khởi tạo `V471_NODES`/gates để đọc layout).
- **Bản đồ M + bản đồ nhỏ:** vẽ thu nhỏ từ layout (nền + khối nhà + điểm) thay ảnh tranh cũ.
- **Cờ so sánh:** `TOWN_NEW = true` (đầu file); `false` thì dùng lại map cũ y nguyên.
- Hiệu năng: chỉ vẽ vật thể trong khung camera (+ lề 200 px); mục tiêu không chậm hơn map cũ.
- Tự kiểm Node: BFS đi được, y-sort đúng thứ tự, `townBlocked` đúng ở mẫu điểm (trong nhà = chặn, giữa đường = không, trên cầu = không, giữa sông = chặn).

## Nộp `MUSE_04.zip`
`data/town_layout.js`, `src/65_town_map.js`, `ops/patches/MUSE_04.json`, `MUSE_04_REPORT.md` (hàm game đã dùng + file:dòng, PATCH, tự kiểm, rủi ro cần Claude xem trên trình duyệt). Claude tự thêm thẻ `<script>`.
