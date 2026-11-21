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
