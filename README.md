# Vạn Đạo Tu Tiên — V47.1

Game tiên hiệp HTML5 Canvas, chơi offline.

## Chơi

Nhấp đúp `index.html` (Chrome/Edge). Muốn gửi người khác một file duy nhất thì chạy `python3 tools/bundle.py`, file nằm ở `dist/Van_Dao_Tu_Tien.html`.

## Cấu trúc

```
index.html        nạp mọi thứ theo thứ tự: assets.js → data/ → src/01..48
style.css         CSS giao diện · fonts.css: 3 font nhúng
assets/           320 ảnh gốc (WebP). Sửa/thêm ảnh ở đây
assets.js         TỰ SINH từ assets/ — chạy tools/build_assets.py, không sửa tay
data/             dữ liệu game dạng DATA.ten = {...};
src/NN_*.js       mã nguồn, số thứ tự = thứ tự chạy
tools/            build_assets.py · overrides.py · bundle.py
ops/              phòng điều hành cho 3 AI: RULES, DESIGN, TASKS, HANDOFF, PROMPTS, OVERRIDES, specs/
```

## Làm việc với AI

Đọc `ops/RULES.md` (ai làm gì) và `ops/PROMPTS.md` (câu lệnh dán cho từng AI). Xem tiến độ ở `ops/TASKS.md`.

## Đưa lên GitHub

Từ 22/11/2026 **`assets.js` không còn đưa lên repo** (nằm trong `.gitignore`): file tự sinh, đã nặng 66 MB, mỗi lần đổi ảnh lại thêm một bản ~60 MB vào lịch sử git, sắp chạm giới hạn 100 MB của GitHub. Ảnh gốc vẫn ở `assets/`.

**Sau khi clone, chạy một lần trước khi mở game:** `python3 tools/build_assets.py` (dựng `assets.js`), rồi `python3 tools/bundle.py` nếu cần file chạy một tệp trong `dist/`. Thư mục `dist/` cũng không đưa lên.

## Token cho Muse

Muse làm việc trên máy ảo của nó, cần token để đẩy code lên repo này. Tạo token chỉ có quyền với đúng repo `van-dao`:

1. GitHub → ảnh đại diện → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Token name: `muse-van-dao` · Expiration: 90 ngày · Repository access: **Only select repositories** → `van-dao`.
3. Permissions → Repository permissions → **Contents: Read and write** (để nguyên mọi quyền khác).
4. Generate, chép token (chỉ hiện một lần), gửi cho Muse khi nó hỏi mật khẩu lúc `git clone`.

Token này chỉ đụng được repo `van-dao`. Nghi bị lộ thì vào lại trang đó bấm **Revoke**.
