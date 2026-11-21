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
