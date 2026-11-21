# M02 — Báo cáo hiệu năng (FPS)

Chạy lúc: 2026-11-21 06:13:47 UTC · URL: http://localhost:8123/index.html · cửa sổ 1280x720 · Playwright Chromium headless trong máy ảo

## Môi trường đo

- Chromium headless (Playwright, cache `~/.cache/ms-playwright/`), viewport 1280x720, máy ảo chia sẻ CPU/RAM với hệ thống — số FPS chỉ có ý nghĩa so sánh tương đối trong cùng môi trường, không phải FPS trên máy người chơi.
- Headless Chromium chạy requestAnimationFrame theo vsync ảo (~60Hz) nên trần FPS khoảng 60.

## Cách đo

- Cài vòng `requestAnimationFrame` đếm khung hình trong trang (`window.__fps.buckets`: số khung hình tròn trong mỗi giây).
- FPS trung bình = trung bình các bucket/giây trong cửa sổ đo; FPS thấp nhất = bucket nhỏ nhất; tổng khung hình = tổng các bucket. Chỉ tính bucket tròn giây đầy đủ.
- `Math.random` được seed cố định (20261121, giống test_suite) để lần chạy tái lập được.

## Kết quả

| Tình huống | Thời gian đo | FPS trung bình | FPS thấp nhất | FPS cao nhất | Tổng khung hình |
|---|---|---|---|---|---|
| dung yen o thon | 15s | 60.6 | 60 | 61 | 909 |
| mo ban do (M) | 15s | 59.93 | 49 | 61 | 899 |
| san luyen, khong danh (doi chung) | 10s | 21.3 | 20 | 22 | 213 |
| danh nhau 30 giay (San Luyen Kiem, F6) | 30s | 20.53 | 18 | 22 | 616 |

Chi tiết bucket/giây:
- dung yen o thon: [61, 61, 60, 61, 60, 61, 61, 60, 61, 61, 60, 61, 60, 61, 60]
- mo ban do (M): [49, 61, 60, 61, 61, 61, 61, 60, 61, 61, 61, 60, 61, 61, 60]
- san luyen, khong danh (doi chung): [20, 21, 22, 22, 20, 22, 22, 22, 21, 21]
- danh nhau 30 giay (San Luyen Kiem, F6): [19, 21, 22, 21, 20, 21, 21, 21, 18, 21, 21, 20, 20, 19, 21, 21, 21, 20, 19, 20, 20, 21, 20, 21, 21, 21, 21, 21, 21, 22]

## Cách tái lập trận đánh (San Luyen Kiem, F6)

- Vào thôn, bấm F6: game dẫn đường tới Sân Luyện Kiếm (v42tGuide). Trong thử nghiệm, người chơi đi bộ ~10-12s (qua scene V47T rồi về scene thôn cũ) mới tới sân.
- Khi `v42tNear(0)` đúng và phiên chưa bắt đầu, bấm F6 lần nữa để bắt đầu (`v42tStart`): mộc nhân xuất hiện, `V42T.active=true`. Bấm F6 khi đang đi qua sân chỉ dẫn đường lại, không bắt đầu được — script chờ tới khi ở gần ổn định rồi mới bấm, cooldown 1,5s, tối đa 40s.
- Thời gian chờ bắt đầu trong lần chạy này: 15.4s.
- Trong 30s đo: nhấp chuột vào mộc nhân (vị trí màn hình lấy qua `hdPoint`) mỗi ~0,7s. Mộc nhân bất tử, không rơi đồ, không tu vi — đánh liên tục được.
- Bằng chứng đánh thật: V42T.hits 0 → 104, tổng sát thương 0 → 5794, số lần thi triển 104, V42T.time 30.4s; số lần phục hồi phiên giữa chừng: 0.

**Lỗi console/pageerror: 0**

## Nhận xét

- FPS trung bình các tình huống: 60.6, 59.93, 21.3, 20.53; thấp nhất từng tình huống: 60, 49, 20, 18.
- Bucket thấp nhất toàn bộ: 18 fps (danh nhau 30 giay (San Luyen Kiem, F6)).
- TỤT FPS RÕ ở Sân Luyện Kiếm: đứng yên ở thôn 60.6 fps, nhưng ở sân luyện chỉ 21.3 fps dù CHƯA ĐÁNH (V42T.hits=0), và đánh nhau 20.53 fps — gần như nhau. Vậy nguyên nhân không phải hiệu ứng đòn đánh/số bay, mà là bản thân scene sân luyện (khu vực thôn cũ, V47T=None, p ở gần sân) hoặc chế độ luyện tập (V42T.active) tốn khung hình. Cần Claude/đội code soi lại phần vẽ ở khu vực này (xem HANDOFF M02).
- Ảnh minh họa (không commit, chỉ lưu local): `tests/out/perf_idle.png`, `perf_map.png`, `perf_combat.png`.
