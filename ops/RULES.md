# LUẬT VẬN HÀNH — đọc hết trước khi làm bất cứ việc gì

Dự án có 3 AI và 1 người chủ:

| Ai | Vai | Được sửa | Không được sửa |
|---|---|---|---|
| **Chủ dự án** (người) | Duyệt, chơi thử, quyết định | Mọi thứ | — |
| **Claude** | Tổng chỉ huy, kiến trúc sư: chia việc, gộp hàm vá chồng, review, ghép code | `ops/` (trừ `specs/`), mọi file `src/*.js` khi được giao việc refactor/ghép | `data/`, `ops/specs/`, lời thoại |
| **ChatGPT** | Biên kịch kiêm thiết kế: spec, dữ liệu JSON, lời thoại, ảnh | `ops/specs/`, `data/`, `assets/` | `src/`, `index.html` |
| **Muse** | Thợ code tính năng | Chỉ những file ghi trong cột "File được sửa" của việc mình nhận | `ops/` (trừ ghi `HANDOFF.md` + đổi trạng thái việc của mình), `data/`, `assets/` |

## Quy trình mỗi lần làm việc

1. Đọc `ops/DESIGN.md`, `ops/TASKS.md`, 5 mục gần nhất của `ops/HANDOFF.md`.
2. Chỉ nhận việc có cột **Ai** là tên bạn, trạng thái **TODO**, và mọi việc ở cột **Cần xong trước** đã **DONE**.
   Không có việc nào như vậy → trả lời "Không có việc cho <tên>" và dừng.
3. Đổi trạng thái việc đó sang **DOING** trước khi bắt đầu.
4. Chỉ sửa file trong cột **File được sửa**. Cần đụng file khác → đổi sang **BLOCKED**, ghi lý do, dừng.
5. Xong việc:
   - Code → **REVIEW** (Claude sẽ review). Spec/dữ liệu/ảnh → **DONE**. Review đạt → **DONE**.
   - Ghi một mục vào **cuối** `ops/HANDOFF.md` theo mẫu có sẵn trong file.
6. Thấy việc mới cần làm → thêm dòng **TODO** vào `TASKS.md` (ID kế tiếp), không tự làm luôn.
7. Không bao giờ xoá hay sửa mục cũ trong `HANDOFF.md`.

## Luật code (Claude và Muse)

- **CẤM vá chồng.** Không viết `const old = fn; fn = function(){ old(); ... }` hay `fn = (...a) => { ...; return old(...a) }`.
  Muốn đổi hàm nào → sửa thẳng định nghĩa đang chạy của hàm đó. Nếu hàm đó còn nằm trong `ops/OVERRIDES.md`
  (nhiều lớp vá), dừng lại và xin việc "gộp hàm" trước (Claude làm).
- Không thêm ảnh base64 vào code. Ảnh mới: ChatGPT/Chủ thả file vào `assets/`, chạy `python3 tools/build_assets.py`,
  code dùng `ASSETS["tên_file"]`.
- Dữ liệu (công pháp, pháp bảo, lời thoại, địa danh) nằm trong `data/*.js`, không viết cứng trong code.
  Mỗi file dữ liệu chỉ có một dòng gán: `DATA.ten = { ...JSON hợp lệ... };`. Không dùng `.json` + `fetch` vì mở game bằng file:// sẽ bị chặn.
- Không đổi khoá lưu game (`vdtt_vangioi_v3`) và không làm hỏng save cũ. Thêm trường mới vào save thì phải có giá trị mặc định khi thiếu.
- Không đổi chỉ số cân bằng khi việc chỉ yêu cầu đổi giao diện.
- Sau khi gộp hàm: chạy `python3 tools/overrides.py` để cập nhật `OVERRIDES.md`.
- Thứ tự file trong `src/` là thứ tự chạy. Không đổi tên/thứ tự file nếu việc không yêu cầu.

## Nghiệm thu code (người làm tự kiểm trước khi chuyển REVIEW, Claude kiểm lại)

- [ ] Đúng từng gạch đầu dòng của spec — liệt kê: đã làm / chưa làm / làm khác (vì sao).
- [ ] Không có lớp vá chồng mới (`tools/overrides.py` không tăng số lớp của hàm nào).
- [ ] Mở `index.html`: menu → tạo nhân vật → vào thôn → mở bản đồ (M), túi đồ (I), công pháp, thoát — không lỗi Console.
- [ ] Nạp save cũ được.
- [ ] Không tạo gradient/canvas/đối tượng lớn mới trong mỗi frame nếu tránh được.

## Khi không chắc

Ghi câu hỏi vào HANDOFF (mục "Cần chủ dự án quyết định"), đổi việc sang **BLOCKED**, dừng. Đừng đoán ý chủ dự án ở chỗ khó đảo ngược.
