# M08 — Profile CPU: thủ phạm tụt FPS ở Sân Luyện Kiếm

Chạy lúc: 2026-11-21 07:51:51 UTC · URL: http://localhost:8123/index.html · Playwright Chromium headless trong máy ảo

## Bối cảnh (M02)

- Thôn Thanh Thạch Thôn: 60,6 fps; Sân Luyện Kiếm: 21,3 fps dù CHƯA ĐÁNH (đánh nhau 20,53 fps) — xem `tests/perf.md`.
- Câu hỏi: cái gì trong scene sân luyện (hoặc chế độ luyện tập) ăn hết khung hình?

## Phương pháp đo

- CDP `Profiler` (V8 sampling profiler) qua Playwright (`page.context.new_cdp_session`, `Profiler.enable/start/stop`): lấy mẫu ~1ms/lần trong 10 giây ở mỗi nơi.
- self = tổng thời gian mẫu của chính hàm đó; total = tổng thời gian mẫu của hàm + tất cả hàm con cháu (cộng thời gian mẫu lên toàn bộ tổ tiên của node được lấy mẫu).
- Gom theo (tên hàm, file, dòng); dòng = `callFrame.lineNumber + 1` (CDP đếm dòng từ 0). Hàm không tên ghi `(anonymous)`; khung không thuộc file game ghi `(native)`.
- Cột ★ = hàm có trong `ops/OVERRIDES.md` (hàm bị vá chồng, Claude đang gộp ở T07/T08/T09).
- `Math.random` seed cố định 20261121 (giống test_suite) để lần chạy tái lập được.
- FPS đo bằng vòng `requestAnimationFrame` đếm khung hình (`window.__fps.buckets`), giống `tools/perf.py`.

## Giới hạn

- Đo trên máy ảo chia sẻ CPU/RAM, headless Chromium — số tuyệt đối chỉ có ý nghĩa so sánh tương đối trong cùng môi trường, không phải trên máy người chơi.
- Profiler lấy mẫu ~1kHz nên hàm chạy <1ms có thể không xuất hiện; hàm ngắn nhưng gọi rất nhiều lần vẫn hiện qua tổng số mẫu.
- Bản thân profiler và vòng đếm rAF thêm một ít tải; số profile ở hai nơi đo cùng một cách nên vẫn so sánh được.
- Headless Chromium chạy rAF theo vsync ảo (~60Hz) nên trần FPS khoảng 60.
- Ở 1920×1080, tỉ lệ hiển thị 1920/1280 = 1,5 nên RS.k = 1,5 ở cả Cân bằng và Cao (Cao chỉ nâng giới hạn lên 2); muốn k = 2 cần viewport rộng ≥ 2560. Khác nhau giữa Cân bằng và Cao ở đây là maxParticles [78/116] và maxEvents [22/26] (xem `v41ApplyQuality` ở `src/31_v41_v8.js:6`).

## 1. Profile CPU 10 giây (1280×720, Đồ họa Cân bằng)

### thon (1280x720)

- Tổng thời gian profile: 10291.9ms (9277 mẫu, 10s).

| # | Hàm | File:dòng | Self (ms) | Self % | Total (ms) | Total % | ★ |
|---|---|---|---|---|---|---|---|
| 1 | `(idle)` | `(native):0` | 4986.6 | 48.45% | 4986.6 | 48.45% |  |
| 2 | `(program)` | `(native):0` | 4332.5 | 42.1% | 4332.5 | 42.1% |  |
| 3 | `(garbage collector)` | `(native):0` | 52.7 | 0.51% | 52.7 | 0.51% |  |
| 4 | `text` | `01_core.js:175` | 51.0 | 0.5% | 80.2 | 0.78% | ★ |
| 5 | `fillText` | `(native):0` | 44.3 | 0.43% | 44.3 | 0.43% |  |
| 6 | `save` | `(native):0` | 39.1 | 0.38% | 39.1 | 0.38% | ★ |
| 7 | `v33Fit` | `22_v33_v32.js:62` | 36.3 | 0.35% | 80.9 | 0.79% |  |
| 8 | `fill` | `(native):0` | 36.2 | 0.35% | 36.2 | 0.35% |  |
| 9 | `measureText` | `(native):0` | 34.7 | 0.34% | 34.7 | 0.34% |  |
| 10 | `update_L11` | `18_v28_v21.js:101` | 25.5 | 0.25% | 142.5 | 1.38% |  |
| 11 | `drawImage` | `(native):0` | 25.5 | 0.25% | 25.5 | 0.25% |  |
| 12 | `hdView` | `32_env_assets.js:75` | 24.1 | 0.23% | 24.1 | 0.23% | ★ |
| 13 | `v14Move` | `22_v33_v32.js:16` | 21.1 | 0.21% | 42.3 | 0.41% | ★ |
| 14 | `v8Pick` | `05_v8_v11.js:74` | 18.0 | 0.18% | 68.5 | 0.67% |  |
| 15 | `dist` | `01_core.js:81` | 17.2 | 0.17% | 17.2 | 0.17% |  |

**Top 15 theo total:**

| # | Hàm | File:dòng | Total (ms) | Total % | Self (ms) | Self % | ★ |
|---|---|---|---|---|---|---|
| 1 | `(root)` | `(native):0` | 10291.9 | 100.0% | 0.0 | 0.0% |  |
| 2 | `(idle)` | `(native):0` | 4986.6 | 48.45% | 4986.6 | 48.45% |  |
| 3 | `(program)` | `(native):0` | 4332.5 | 42.1% | 4332.5 | 42.1% |  |
| 4 | `frame` | `47_v45_v35.js:1100` | 920.2 | 8.94% | 16.2 | 0.16% |  |
| 5 | `draw` | `44_photo.js:329` | 687.2 | 6.68% | 3.2 | 0.03% | ★ |
| 6 | `draw` | `44_photo.js:39` | 682.9 | 6.64% | 0.0 | 0.0% | ★ |
| 7 | `draw` | `32_env_assets.js:37` | 682.9 | 6.64% | 2.2 | 0.02% | ★ |
| 8 | `draw` | `31_v41_v8.js:42` | 680.7 | 6.61% | 0.0 | 0.0% | ★ |
| 9 | `draw` | `05_v8_v11.js:141` | 680.7 | 6.61% | 8.6 | 0.08% | ★ |
| 10 | `draw` | `01_core.js:545` | 589.3 | 5.73% | 1.1 | 0.01% | ★ |
| 11 | `v47tDraw` | `48_v48_v47.js:460` | 587.2 | 5.71% | 8.6 | 0.08% |  |
| 12 | `v35Group` | `30_v41_v35.js:132` | 491.8 | 4.78% | 3.2 | 0.03% |  |
| 13 | `v35Group` | `24_v35_v34.js:13` | 488.6 | 4.75% | 9.7 | 0.09% |  |
| 14 | `(anonymous)` | `48_v48_v47.js:461` | 463.9 | 4.51% | 16.3 | 0.16% |  |
| 15 | `update_L31` | `47_v45_v35.js:1091` | 190.9 | 1.85% | 0.0 | 0.0% |  |

### san luyen, khong danh (1280x720)

- Tổng thời gian profile: 10106.6ms (9274 mẫu, 10s).

| # | Hàm | File:dòng | Self (ms) | Self % | Total (ms) | Total % | ★ |
|---|---|---|---|---|---|---|---|
| 1 | `restore` | `(native):0` | 7510.3 | 74.31% | 7510.3 | 74.31% |  |
| 2 | `(program)` | `(native):0` | 1456.7 | 14.41% | 1456.7 | 14.41% |  |
| 3 | `save` | `(native):0` | 120.9 | 1.2% | 120.9 | 1.2% | ★ |
| 4 | `drawImage` | `(native):0` | 114.2 | 1.13% | 114.2 | 1.13% |  |
| 5 | `fillRect` | `(native):0` | 52.1 | 0.52% | 52.1 | 0.52% |  |
| 6 | `text` | `01_core.js:175` | 49.4 | 0.49% | 80.8 | 0.8% | ★ |
| 7 | `addColorStop` | `(native):0` | 36.5 | 0.36% | 36.5 | 0.36% |  |
| 8 | `fillText` | `(native):0` | 33.6 | 0.33% | 33.6 | 0.33% |  |
| 9 | `hdHeight` | `32_env_assets.js:10` | 28.2 | 0.28% | 28.2 | 0.28% |  |
| 10 | `fill` | `(native):0` | 25.8 | 0.26% | 25.8 | 0.26% |  |
| 11 | `worldDraw` | `04_v11_v46.js:57` | 25.1 | 0.25% | 8459.9 | 83.71% | ★ |
| 12 | `(garbage collector)` | `(native):0` | 24.5 | 0.24% | 24.5 | 0.24% |  |
| 13 | `measureText` | `(native):0` | 22.7 | 0.22% | 22.7 | 0.22% |  |
| 14 | `v33Fit` | `22_v33_v32.js:62` | 17.7 | 0.18% | 53.3 | 0.53% |  |
| 15 | `(anonymous)` | `25_v36_v37.js:20` | 14.0 | 0.14% | 14.0 | 0.14% |  |

**Top 15 theo total:**

| # | Hàm | File:dòng | Total (ms) | Total % | Self (ms) | Self % | ★ |
|---|---|---|---|---|---|---|
| 1 | `(root)` | `(native):0` | 10106.6 | 100.0% | 0.0 | 0.0% |  |
| 2 | `frame` | `47_v45_v35.js:1100` | 8617.9 | 85.27% | 3.2 | 0.03% |  |
| 3 | `draw` | `44_photo.js:329` | 8509.7 | 84.2% | 0.0 | 0.0% | ★ |
| 4 | `draw` | `44_photo.js:39` | 8507.5 | 84.18% | 0.0 | 0.0% | ★ |
| 5 | `draw` | `32_env_assets.js:37` | 8507.5 | 84.18% | 0.0 | 0.0% | ★ |
| 6 | `draw` | `31_v41_v8.js:42` | 8507.5 | 84.18% | 0.0 | 0.0% | ★ |
| 7 | `draw` | `05_v8_v11.js:141` | 8506.4 | 84.17% | 1.1 | 0.01% | ★ |
| 8 | `draw` | `01_core.js:545` | 8480.6 | 83.91% | 2.2 | 0.02% | ★ |
| 9 | `worldDraw` | `48_v48_v47.js:99` | 8478.4 | 83.89% | 1.1 | 0.01% | ★ |
| 10 | `worldDraw` | `25_v36_v37.js:63` | 8468.8 | 83.8% | 1.1 | 0.01% | ★ |
| 11 | `worldDraw` | `22_v33_v32.js:47` | 8467.8 | 83.78% | 1.3 | 0.01% | ★ |
| 12 | `worldDraw` | `04_v11_v46.js:57` | 8459.9 | 83.71% | 25.1 | 0.25% | ★ |
| 13 | `restore` | `(native):0` | 7510.3 | 74.31% | 7510.3 | 74.31% |  |
| 14 | `v15Sprite` | `11_v16_v15.js:7` | 3404.1 | 33.68% | 13.6 | 0.13% |  |
| 15 | `draw` | `04_v11_v46.js:61` | 3386.8 | 33.51% | 6.3 | 0.06% | ★ |

## 2. FPS ở 1920×1080 (Đồ họa Cân bằng / Cao)

| Cài đặt | RS.k thực tế | Thôn (avg/min/max) | Sân luyện, không đánh (avg/min/max) |
|---|---|---|---|
| Cân bằng (q=1) | 1.5 | 59.33 / 58 / 61 | 14.2 / 14 / 15 |
| Cao (q=2) | 1.5 | 58.9 / 53 / 61 | 15.5 / 14 / 16 |

So sánh với M02 (1280×720, Cân bằng): thôn 60,6 fps, sân luyện không đánh 21,3 fps.

Chi tiết bucket/giây:
- Cân bằng thon 1920x1080 q=1: [58, 60, 60, 58, 58, 59, 61, 60, 60]
- Cân bằng san luyen (khong danh) 1920x1080 q=1: [14, 14, 14, 14, 14, 14, 14, 14, 15, 15]
- Cao thon 1920x1080 q=2: [60, 61, 60, 59, 61, 53, 60, 60, 55, 60]
- Cao san luyen (khong danh) 1920x1080 q=2: [16, 15, 14, 15, 16, 15, 16, 16, 16, 16]

**Lỗi console/pageerror: 0**

## 3. Kết luận (để Claude dùng cho T08)

### Thủ phạm: `CanvasRenderingContext2D.restore()` — 74,3% thời gian CPU

| | Thôn (V47T) | Sân Luyện Kiếm (thôn cũ) |
|---|---|---|
| `restore` self / 10s | 6,7ms | **7510,3ms (74,31%)** |
| `save` self / 10s | 39,1ms | 120,9ms |
| Số cặp save/restore mỗi khung hình | ~96 | **~415** |
| Số `drawImage` mỗi khung hình | ~5 | **~151** |
| `frame` total / 10s | 920ms (9%) | 8618ms (85%) |
| `worldDraw` total / 10s | — (vẽ bằng `v47tDraw`, total 587ms) | 8460ms (84%) |

- Ở thôn, luồng chính rảnh ~90% thời gian (`(idle)` 48% + `(program)` 42%); ở sân luyện, luồng chính bận 85% (`frame` total 85%) và riêng `restore()` đã chiếm 74%.
- Không phải hiệu ứng đánh nhau: profile đo lúc `V42T.active=true`, `hits=0` (chưa đánh), khớp M02 (đứng yên ở sân luyện đã 21,3 fps).

### Ai gọi `restore()` nhiều nhất (probe riêng, profile 10s ở sân luyện)

Quy về hàm JS nằm ngay trên `restore()` trên stack:

| Hàm JS gọi restore() | File:dòng | Thời gian trong restore() |
|---|---|---|
| `v17House` | `src/32_env_assets.js:232` | **4813ms** |
| `v41aRig` | `src/28_v41_v25.js:31` | 1596ms |
| `v42eSprite` | `src/32_env_assets.js:239` | 611ms |
| `v42PerfSoftEllipse` | `src/44_photo.js:181` | 33ms |
| `v15Sprite` | `src/11_v16_v15.js:7` | 20ms |

- `v17House` (★ OVERRIDES, 5 lớp): mỗi nhà mỗi khung hình làm `g.save()` → đặt `imageSmoothingEnabled/Quality`, `globalAlpha` → `drawImage` ảnh nhà lớn → `g.restore()`, cộng thêm 1 cặp save/restore cho đèn đêm khi trời tối. `v41aRig` (vẽ nhân vật: save → translate/scale → 7 dải `drawImage` + 2 chân → restore). `v42eSprite` (vẽ đạo cụ/cột mốc: save → drawImage → restore).
- Chuỗi gọi nặng nhất theo total: `frame` → `draw` (×6 lớp vá) → `worldDraw` → `draw` (`src/04_v11_v46.js:61`, total 3387ms) → `v15Sprite` (total 3404ms) → save/restore.

### Điểm lạ cần soi thêm: không chỉ số lượng, mà mỗi lần `restore()` cũng đắt hơn

- Số mẫu `restore` 6084 trong 10s, `save` chỉ 69 mẫu — lệch nhau ~88 lần, dù số lần gọi save/restore bằng nhau (đếm trực tiếp: 40664 lần mỗi loại trong 5s ở sân luyện).
- Tính ra: mỗi lần `restore()` ở sân luyện tốn ~86µs, ở thôn chỉ ~0,1µs. Tức là ngoài việc có gấp 4,3 lần số cặp save/restore mỗi khung hình (415 so với 96), bản thân mỗi lần `restore()` trong đường vẽ thôn cũ cũng đắt hơn hẳn — có thể do nội dung state được lưu/khôi phục khác nhau (ảnh lớn, `imageSmoothingQuality`, `globalAlpha`, `globalCompositeOperation='screen'` ở đèn đêm) hoặc do raster bị dồn lại và xả ra ở `restore()`. Đây là câu hỏi mở cho T08, chưa xác minh được bằng profile lấy mẫu.
- Gợi ý hướng sửa (chỉ gợi ý, không sửa trong M08): giảm số cặp save/restore mỗi khung hình ở đường vẽ thôn cũ (đặt transform/alpha trực tiếp rồi trả lại bằng tay thay vì save/restore, hoặc gộp các lần vẽ cùng state), và kiểm tra riêng chi phí mỗi lần `restore()` của `v17House`/`v41aRig` (ví dụ bỏ `imageSmoothingQuality='low'` hoặc vẽ nhà không qua save/restore rồi đo lại).
- Lưu ý: đo trên headless Chromium (raster phần mềm SwiftShader) nên chi phí state của canvas có thể bị phóng đại so với máy thật có GPU — nên kiểm chứng lại bằng FPS thật (F7) trên máy người chơi sau khi T08 sửa.
