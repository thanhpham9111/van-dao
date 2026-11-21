# NHẬT KÝ BÀN GIAO

Chỉ thêm mục mới ở CUỐI file. Không sửa/xoá mục cũ.

## Mẫu

```
### [YYYY-MM-DD] T__ — <tên AI>
**Đã làm:** (3-5 dòng)
**File đã sửa:**
**Chưa làm / không chắc:**
**Cần chủ dự án quyết định:** (nếu có, kèm việc chuyển BLOCKED)
**Việc tiếp theo:** T__ cho <ai>
```

---

### [2026-11-21] T01 — Claude
**Đã làm:**
- Tách 320 ảnh (WebP) nhúng base64 ra `assets/`; khi chạy game nạp qua `assets.js` (tự sinh bằng `tools/build_assets.py`). Code gọi ảnh bằng `ASSETS["tên"]`.
- Tách 3 font ra `fonts.css`, CSS còn lại ra `style.css`.
- Chia 1,2 MB code thành 48 file `src/NN_*.js` (15–60 KB/file), giữ nguyên thứ tự chạy, mỗi điểm cắt đã kiểm cú pháp. Tên file ghi phiên bản chiếm đa số trong file (ví dụ `36_hud.js` = phần v42_hud gốc).
- Sửa `<title>` V46.1 → V47.1. Thêm `data/00_init.js` (kho `DATA` cho dữ liệu sau này).
- Lập `ops/OVERRIDES.md`: 109 hàm bị vá chồng ≥2 lớp (nặng nhất: `update` 33, `worldHud` 25, `resume` 19, `panel` 18, `start` 16).
- Công cụ: `tools/build_assets.py`, `tools/overrides.py`, `tools/bundle.py` (gói lại thành 1 file HTML ở `dist/`).

**Kiểm tra:** Chạy Chrome tự động cả bản gốc và bản mới: menu, tạo nhân vật, vào thôn, di chuyển, mở bản đồ, túi đồ. Ảnh chụp trùng khớp, 0 lỗi Console. Bản `dist/` gói lại cũng chạy giống bản gốc.

**Chưa làm / không chắc:** CHƯA gộp hàm nào — hành vi giữ y nguyên bản gốc kể cả các lỗi hiện có. Save cũ: Chrome thường dùng chung localStorage cho mọi file mở bằng file://, nhưng nên xuất hồ sơ ("Bảo toàn hồ sơ") ở bản cũ trước cho chắc.

**Việc tiếp theo:** T02–T09 cho Claude (dọn nền); song song T10, T12, T19, T21, T23 cho ChatGPT (spec không phụ thuộc code).

### [2026-11-21] T02 — Claude
**Đã làm:**
- Gộp `worldHud` (25 lớp) và `hud` (12 lớp). Phát hiện chuỗi vá đã bị đặt lại từ đầu ở V33 rồi V35, nên các lớp V8–V31 không còn chạy (code chết). Hành vi thật chỉ là `worldHud → v35Render(true)`, `hud → v35Render(false)`.
- Giữ một khai báo duy nhất mỗi hàm (`src/01_core.js` cho `hud`, `src/02_v10_v8.js` cho `worldHud`), thân gọi thẳng `v35Render`. Xoá 31 câu gán lại + 26 biến lưu tạm ở 22 file bằng trình phân tích cú pháp (acorn), không sửa tay.
- Giữ nguyên chỗ tạm tắt HUD của chế độ chụp ảnh (`44_photo.js`), vì đó không phải lớp vá.
- OVERRIDES.md: 109 → 107 hàm.

**Kiểm tra:** So bản gốc và bản mới bằng Chrome tự động: vào thôn, bản đồ, túi đồ, nhật ký, giang hồ, sân luyện F6. 0 lỗi Console; ảnh trùng khớp, chỉ lệch ở hình đang xoay và số liệu NPC tự tu luyện (bản gốc chạy 2 lần cũng lệch như vậy).

**Phát hiện cần biết:**
- HUD thật được vẽ bởi các hàm con `v35*` (bản đang chạy của `v35Render` ở `src/47_v45_v35.js`), các hàm con này còn 4–6 lớp vá → thêm việc **T02b**. Muse chưa nên làm T11 trước khi T02b xong.
- Lớp V39 (vẽ ký hiệu cửa các ngôi nhà trong thôn khi đến gần) đã bị V45 vô tình tắt từ trước. Mình xoá theo đúng hành vi hiện tại. Hàm `v39POIDraw` vẫn còn nếu muốn bật lại.

**Cần chủ dự án quyết định:** Có muốn bật lại ký hiệu cửa nhà (V39) không? Nếu có, thêm vào spec T10.

**Việc tiếp theo:** T02b cho Claude. ChatGPT làm song song T10, T12, T19, T21, T23.

### [2026-11-21] FIX-01 — Claude (lỗi Muse báo)
**Lỗi:** Mở game qua http://localhost thì menu không hiện nút, console báo `BUILD_VERSION is not defined` (src/47_v45_v35.js:652). Muse phát hiện khi kiểm tra môi trường.
**Nguyên nhân (do T01 chia file):** file 47 khởi động vòng lặp game (`requestAnimationFrame(frame)`, dòng 875) trước khi file 48 nạp. Bản 1 file gốc không có kẽ hở này; bản chia file thì giữa hai file trình duyệt có thể chạy khung hình đầu → lỗi → vòng lặp dừng. Mở bằng file:// nạp quá nhanh nên lần kiểm tra T01 không bắt được.
**Đã sửa:** thêm `src/00_boot_gate.js` (giữ lại requestAnimationFrame/setTimeout/setInterval khi đang nạp) và `src/99_boot_ready.js` (mở cổng sau khi nạp đủ). Không sửa dòng code game nào.
**Kiểm tra:** làm chậm file cuối 2 giây qua http: bản cũ chạy lọt 1 khung hình → đúng lỗi Muse báo; bản mới 0 khung hình trước khi mở cổng, vào game bình thường, 0 lỗi. Qua file:// ảnh chụp vẫn khớp bản gốc.
**Luật mới (RULES.md):** file src mới phải đặt trước 99_boot_ready; luôn chơi thử qua http://localhost.
**Việc tiếp theo:** @Muse chạy lại tools/screenshot.py để xác nhận. Claude làm T02b.

### [2026-11-21] T02b — Claude
**Đã làm:** Gộp 11 hàm con của HUD, mỗi hàm còn đúng 1 định nghĩa:
- 9 hàm chuỗi "thay hẳn" (`v35Render`, `v35Identity`, `v35Status`, `v35Map`, `v35Quest`, `v35Dock`, `v35Left`, `v35Nav`, `v35Feed`): giữ bản cuối (V45, `src/47_v45_v35.js`), đổi thành `function`; xoá các bản V35/V41/V42/V44 đã chết.
- `v35Target`: bản V45 chỉ thêm giao diện riêng cho sân luyện kiếm, còn lại gọi bản V44 → tách bản V44 thành hàm phụ `v35TargetNormal` (`src/46_v44_v35.js`), `v35Target` gọi thẳng hàm này.
- `v35State` (nâng cấp bố cục HUD lưu trong save, 4 lớp V35→V38→V41→V44): viết lại thành 1 hàm chạy lần lượt 4 bước, có chú thích từng bước (`src/46_v44_v35.js`).
- OVERRIDES.md: 107 → 97 hàm.

**Kiểm tra:** (1) `v35State` bản gốc vs bản gộp trên 7 kiểu save mẫu → giống hệt. (2) Save tạo ở bản gốc → mở bằng bản mới: đúng vị trí, đúng bố cục HUD, 0 lỗi. (3) Ảnh chụp 6 màn hình (thôn, bản đồ, túi đồ, nhật ký, sân luyện, sinh hoạt) trùng từng điểm ảnh với bản gốc. (4) Bảng mục tiêu: lệnh vẽ ở sân luyện và khi không có mục tiêu giống hệt; khi nhắm quái chỉ khác số cấp do vị trí quái ngẫu nhiên.

**Cho Muse (T11):** HUD nhân vật nằm ở `src/47_v45_v35.js` (các hàm `v35*`, sửa thẳng ở đó) và `src/48_v48_v47.js` (`v471Mini`, `v471Quest`, `v471Dock`). `v471*` chưa kiểm tra vá chồng. Nếu cần sửa mà thấy bị gán lại nhiều lần thì báo @Claude trước.
**Việc tiếp theo:** Claude làm T03. Muse làm M01 → M03, rồi T11 khi T10 của ChatGPT DONE.
