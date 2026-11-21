# LUẬT VẬN HÀNH — đọc hết trước khi làm bất cứ việc gì

Dự án có 3 AI và 1 người chủ, chia **2 luồng song song** (chi tiết đầu `TASKS.md`): **Luồng A — Code** (Claude + Muse) và **Luồng B — Nội dung** (Claude + ChatGPT). Mỗi luồng chỉ sửa file của luồng mình.


| Ai | Vai | Được sửa | Không được sửa |
|---|---|---|---|
| **Chủ dự án** (người) | Duyệt, chơi thử, quyết định | Mọi thứ | — |
| **Claude** | Tổng chỉ huy, kiến trúc sư: chia việc, gộp hàm vá chồng, review, ghép code | `ops/` (trừ `specs/`), mọi file `src/*.js` khi được giao việc refactor/ghép | `data/`, `ops/specs/`, lời thoại |
| **ChatGPT** | Biên kịch kiêm thiết kế: spec, dữ liệu JSON, lời thoại, ảnh | `ops/specs/`, `data/`, `assets/` | `src/`, `index.html` |
| **Muse** | Thợ code tính năng kiêm người chơi thử (có máy ảo + trình duyệt: mở `index.html`, chụp màn hình gửi vào `ops/specs/img/`) | Chỉ những file ghi trong cột "File được sửa" của việc mình nhận (luồng A: `src/`, `index.html`, `tools/`, `tests/`) | `ops/` (trừ ghi `HANDOFF.md` + đổi trạng thái việc của mình), `data/`, `assets/` |

## Quy trình mỗi lần làm việc

0. `git pull` để lấy bản mới nhất (nếu bạn làm việc trực tiếp trên repo).
1. Đọc `ops/DESIGN.md`, `ops/TASKS.md`, 5 mục gần nhất của `ops/HANDOFF.md`, và **mọi tin gửi @mình hoặc @all trong `ops/CHAT.md`** chưa trả lời. Trả lời các tin đó trước.
2. Chỉ nhận việc có cột **Ai** là tên bạn, trạng thái **TODO**, và mọi việc ở cột **Cần xong trước** đã **DONE**.
   Không có việc nào như vậy → trả lời "Không có việc cho <tên>" và dừng.
3. Đổi trạng thái việc đó sang **DOING** trước khi bắt đầu.
4. Chỉ sửa file trong cột **File được sửa**. Cần đụng file khác → đổi sang **BLOCKED**, ghi lý do, dừng.
5. Xong việc:
   - Code, spec, dữ liệu, ảnh của Muse/ChatGPT → **REVIEW** (Claude review). Việc của Claude → **DONE**. Review đạt → **DONE**.
   - Ghi một mục vào **cuối** `ops/HANDOFF.md` theo mẫu có sẵn trong file.
6. Thấy việc mới cần làm → thêm dòng **TODO** vào `TASKS.md` (ID kế tiếp), không tự làm luôn.
7. Không bao giờ xoá hay sửa mục cũ trong `HANDOFF.md`.

## Chế độ tự vận hành (Claude ↔ Muse, từ 21/11/2026)

- `ops/CHAT.md` là kênh làm việc chính giữa Claude và Muse: báo cáo, hỏi, xin việc, giao việc đều nhắn ở đây.
- **Muse:** mỗi phiên đọc tin mới → trả lời → nhận việc (hoặc nhắn `@Claude xin việc` nếu hết) → làm → báo kết quả trong CHAT + chuyển REVIEW.
- **Claude:** kiểm tra CHAT khoảng 5 phút/lần → trả lời, review việc REVIEW, giao việc mới (thêm dòng vào TASKS + nhắn `@Muse`), rồi tự làm tiếp việc của Claude.
- Claude được tạo việc mới cho Muse trong luồng A khi thấy cần. Việc thuộc thiết kế/nội dung (luồng B) thì giao cho ChatGPT qua chủ dự án.
- Gì cần chủ dự án quyết định → `@Chủ`, chuyển việc BLOCKED, KHÔNG tự quyết.

## Luật git (ai làm việc trực tiếp trên repo)

- Luôn `git pull` trước khi bắt đầu và ngay trước khi `git push`.
- Một việc = một hoặc vài commit, lời commit bắt đầu bằng ID: `T11: HUD nhân vật — khung chân dung + thanh HP/MP`.
- Chỉ `git add` những file mình được phép sửa + `ops/TASKS.md`, `ops/HANDOFF.md`, `ops/CHAT.md`.
- Push bị từ chối vì có người đẩy trước: `git pull --rebase` rồi push lại. Xung đột ở file code của người khác → dừng, nhắn `@Claude` trong CHAT.
- KHÔNG BAO GIỜ `git push --force`, không xoá nhánh, không sửa lịch sử.

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
- `src/00_boot_gate.js` phải là file src ĐẦU, `src/99_boot_ready.js` là file CUỐI (giữ vòng lặp game chờ đủ file). File src mới đặt số 49–98 và thêm thẻ script ngay TRÊN dòng 99_boot_ready trong `index.html`.
- Chơi thử luôn qua `http://localhost` (ví dụ `python3 -m http.server 8123`), không chỉ mở file:// — hai cách nạp file khác nhau.

## Nghiệm thu code (người làm tự kiểm trước khi chuyển REVIEW, Claude kiểm lại)

- [ ] Đúng từng gạch đầu dòng của spec — liệt kê: đã làm / chưa làm / làm khác (vì sao).
- [ ] Không có lớp vá chồng mới (`tools/overrides.py` không tăng số lớp của hàm nào).
- [ ] Mở `index.html`: menu → tạo nhân vật → vào thôn → mở bản đồ (M), túi đồ (I), công pháp, thoát — không lỗi Console.
- [ ] Nạp save cũ được.
- [ ] Không tạo gradient/canvas/đối tượng lớn mới trong mỗi frame nếu tránh được.

## Khi không chắc

Ghi câu hỏi vào HANDOFF (mục "Cần chủ dự án quyết định"), đổi việc sang **BLOCKED**, dừng. Đừng đoán ý chủ dự án ở chỗ khó đảo ngược.
