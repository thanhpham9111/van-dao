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

`assets.js` nặng khoảng 52 MB. GitHub cảnh báo với file trên 50 MB nhưng vẫn nhận (giới hạn cứng là 100 MB). Thư mục `dist/` không đưa lên (đã có trong `.gitignore`).

## Token cho Muse

Muse làm việc trên máy ảo của nó, cần token để đẩy code lên repo này. Tạo token chỉ có quyền với đúng repo `van-dao`:

1. GitHub → ảnh đại diện → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Token name: `muse-van-dao` · Expiration: 90 ngày · Repository access: **Only select repositories** → `van-dao`.
3. Permissions → Repository permissions → **Contents: Read and write** (để nguyên mọi quyền khác).
4. Generate, chép token (chỉ hiện một lần), gửi cho Muse khi nó hỏi mật khẩu lúc `git clone`.

Token này chỉ đụng được repo `van-dao`. Nghi bị lộ thì vào lại trang đó bấm **Revoke**.
