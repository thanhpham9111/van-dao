# M03 — Soát lỗi hiển thị ở 3 cỡ màn hình

Chạy ngày 2026-11-21 (bản V47.1, HEAD 0cb3c0e). Probe `/tmp/probe_m03.py`
(tái dùng `Suite` của `tools/test_suite.py`: seed `Math.random` 20261121,
`p.worldTime = 145` trước mỗi lần chụp, chờ `transition == 0` +
`worldTitle == 0` + kiểm tra ảnh ổn định; click theo tọa độ logic 1280×720
đổi sang CSS px qua rect thật của canvas — canvas letterbox 16:9, căn giữa).

## Cấu hình đã chạy (0 lỗi console/pageerror ở cả 4)

| Cấu hình | Cửa sổ | Đồ họa | Ảnh (7 màn: menu, tạo nhân vật, thôn, bản đồ thôn, Sơn Hà Đồ, túi đồ, nhật ký) |
|---|---|---|---|
| 1280 | 1280×720 | Cân bằng (q=1, mặc định) | `tests/out/m03/m03_1280_*.png` |
| 1366 | 1366×768 | Cân bằng (q=1) | `tests/out/m03/m03_1366_*.png` |
| 1920 | 1920×1080 | Cân bằng (q=1) | `tests/out/m03/m03_1920_*.png` |
| 1920q2 | 1920×1080 | Cao (q=2, `v41ApplyQuality(2)`) | `tests/out/m03/m03_1920q2_*.png` |

Tổng 28 ảnh chính + 6 ảnh hover dock (1280) + 4 ảnh kiểm tra toast theo
thời gian (1920/1280, t0/t6). Ảnh gốc ở `tests/out/m03/` (gitignored);
ảnh chứng cứ đã copy vào `ops/specs/img/m03_*.png`.

Kết luận trước: **không còn lỗi chồng/cắt chữ nào trong các màn M01 ở cả
3 cỡ màn hình.** 5 lỗi đã biết đều đã hết (xem §1). Không sửa code game.

## §1. Đối chiếu 5 lỗi HUD đã biết (mục "Lỗi HUD đang thấy", TASKS.md)

| # | Lỗi đã biết | 1280 | 1366 | 1920 | 1920 Cao | Kết luận |
|---|---|---|---|---|---|---|
| 1 | "Tu vi … 0/40" đè lên dòng cảnh giới; khung đen sau cụm danh tính to, che cảnh | Hết | Hết | Hết | Hết | **Đã sửa (T11).** Cụm danh tính không còn khung đen; "Tu vi 0 / 40" + thanh tiến độ nằm giữa đáy, dưới 3 nút hành động ("Sơ đồ thôn / Sân luyện / Theo nhiệm vụ"). |
| 2 | Nhãn vị trí bị icon "con mắt" đè | — | — | — | — | **Không phải lỗi** (đã ghi trong TASKS: "con mắt" là con trỏ chuột của game; bảng đó là bảng tin `v35Feed`). Không thấy gì bất thường. |
| 3 | Dock dưới-phải: nhãn bị cắt "Âm t…", "Kỳ n…", "Nhiệ…", "Cài đ…" | Hết | Hết | Hết | Hết | **Đã sửa theo hướng thiết kế mới (T11):** dock chỉ còn icon + huy hiệu phím (I / T / Q / F2 / Esc), không còn nhãn dưới icon nên không còn gì để cắt. Nhãn đầy đủ hiện trong tooltip khi hover — đã kiểm chứng ở 1280: hover icon loa → "Âm thanh", hover icon bánh răng → "Cài đặt · Esc" (`ops/specs/img/m03_tooltip_caidat.png`). |
| 4 | Nút Menu dưới-trái có chữ "MENU" thừa phía trên chữ "Menu" | Hết | Hết | Hết | Hết | **Đã sửa (T11).** Nút chỉ còn icon hamburger (☰), không còn chữ nào. |
| 5 | Tên vùng giữa-trên ("Thanh Thạch Thôn") chồng với dòng "Khu vực an toàn" | Hết | Hết | Hết | Hết | **Đã sửa (T11).** "Khu vực an toàn" là một dòng riêng PHÍA TRÊN tên vùng, không chồng lên nhau ở cả 4 cấu hình. |

Ảnh chứng cứ thôn 3 cỡ: `ops/specs/img/m03_1280_village.png`,
`m03_1366_village.png`, `m03_1920_village.png`.

## §2. Lỗi mới: không có

Đã xem toàn bộ 28 ảnh chính (menu, tạo nhân vật 3 thẻ phái + bảng chỉ số,
thôn, bản đồ thôn 11 địa điểm, Sơn Hà Đồ 10 vùng + panel chi tiết, túi đồ
3 cột, nhật ký 8 nhiệm vụ chính tuyến): không phát hiện chỗ nào chồng chữ,
cắt chữ, tràn khung hay lệch nút ở bất kỳ cỡ nào. Layout HUD vẽ theo tọa độ
logic 1280×720 rồi scale theo `RS.k` nên giống nhau ở mọi cỡ; khác nhau chỉ
là độ sắc nét (1920 sắc hơn 1280; 1366 không lệch gì dù canvas thực tế
1365,3px — 0,7px hẹp hơn cửa sổ do letterbox 16:9).

## §3. Ghi chú mỹ thuật / hành vi (không phải lỗi, không sửa)

- **C1 — Chú giải "Đường đi" sát mép khung (Sơn Hà Đồ).** Hàng chú giải
  dưới cùng của bản đồ Sơn Hà Đồ ("Hiện tại · Đã khám phá · ? Chưa khám phá ·
  Đường đi") nằm sát mép dưới của khung ở cả 3 cỡ (đã ghi chú từ T20).
  Chữ vẫn đọc đủ, không bị cắt. Ảnh: `ops/specs/img/m03_1280_worldmap.png`.
- **C2 — Nhãn địa điểm trên ảnh bản đồ thôn tương phản thấp ở 1280.**
  Các nhãn trắng trên ảnh bản đồ ("Đại điện · Trưởng lão", "Đan phòng",
  "Thương nhân", "Lò rèn", "Chợ linh vật", "Cổng Thanh Trúc Lâm") ở 1280 hơi
  khó đọc chỗ nền sáng — rõ nhất là "Cổng Thanh Trúc Lâm" đè lên quầng sáng
  cổng dịch chuyển. Ở 1920 đọc rõ hơn. Đây là chữ trên ảnh nền, không phải
  chữ HUD bị cắt; ghi lại để Claude/ChatGPT cân nhắc khi vẽ lại ảnh bản đồ.
- **C3 — HUD mờ dần khi không thao tác (T11 bước 6) — đã xác minh bằng
  thời gian.** Ở 1920, ảnh chụp ngay khi `worldTitle` vừa về 0 thì HUD đủ
  độ đậm + toast vị trí ("Thanh Thạch Thôn · Thanh Vân Đại Điện") còn hiện;
  sau 6 giây không thao tác, toàn bộ HUD (cụm danh tính, minimap, quest,
  dock, nút hành động) mờ đi rõ rệt và toast biến mất
  (`ops/specs/img/m03_1920_hud_fade.png`). Đây là tính năng (mờ HUD để lộ
  cảnh), KHÔNG phải lỗi hiển thị — nhưng nó làm nhiễm ảnh kiểm thử: ảnh thôn
  1920 trong đợt chạy chính cũng rơi vào trạng thái mờ này (chỉ do chụp
  chậm, không phải do cỡ màn hình), đúng như vụ baseline Thể Tu ở T20.
  Đề xuất lặp lại từ HANDOFF T20: suite/probe nên quơ chuột hoặc chờ HUD
  hết mờ trước khi chụp (hiện `wait_settled` chỉ đợi transition/worldTitle).
- **C4 — Đồ họa Cao (q=2) không đổi gì ở thôn lúc đứng yên.** Ảnh thôn
  1920q2 giống hệt 1920 q=1 từng byte (md5 `cb38aa8178914a8230d2ef85bb7c53d7`).
  Đúng với code `v41ApplyQuality`: q chỉ đổi `maxParticles`/`maxEvents`
  (78/116, 22/26), không đổi layout; `RS.k` ở 1920 vẫn là 1,5 ở cả hai mức
  (k=2 cần viewport ≥ 2560). Vì vậy các panel ở 1920q2 không chụp riêng —
  không có gì khác để xem.

## §4. Hạn chế của đợt soát này

- Chỉ soát các màn của kịch bản M01 (menu, tạo nhân vật, thôn, bản đồ,
  túi đồ, nhật ký). Chưa soát: màn chiến đấu ngoài thôn (HUD chiến đấu T12),
  sân luyện, nội thất, màn hình tạo nhân vật ở phái Thể Tu/Pháp Tu (chỉ chụp
  mặc định Kiếm Tu — thẻ phái và bảng chỉ số 3 phái đều hiện trên cùng màn
  tạo nhân vật nên đã thấy đủ), tooltip của minimap/quest, F2 tùy chỉnh HUD.
- Không đo FPS ở các cỡ (M02/M08 đã đo: thôn ~60 ở 1280, ~59 ở 1920).
- Ảnh 1920q2 các panel không chụp riêng (xem C4).
