# GÓI VIỆC 04 CHO CHATGPT — VIẾT CODE NHÁP 5 module (Claude tích hợp + kiểm trên trình duyệt)

Giao 21/11/2026 bởi Claude. **Khác các gói trước:** lần này bạn viết **code JavaScript** cho game, vì máy Muse đang bị chặn. Toàn bộ mã nguồn hiện tại nằm trong gói (`src/`, `index.html`, `data/`). Bạn KHÔNG cần chạy được game; Claude sẽ ghép vào repo, chạy `test_suite` + Chromium, sửa nếu cần.
Làm theo thứ tự C1 → C5. Hết chỗ: nộp `BATCH_04_part1.zip`, `part2`…

## Luật code (bắt buộc — vi phạm là Claude trả lại)
1. **Chỉ tạo file mới** `src/5x_*.js` (tên ở từng việc). Mỗi file mở đầu `'use strict';`, script cổ điển (không `import/export`, không module), dùng biến toàn cục của game như các file khác.
2. **Không bọc đè hàm** kiểu `const old=fn; fn=function(){old()…}`. Muốn chen hành vi → dùng điểm móc có sẵn:
   - `FRAME_HOOKS.update.push(dt=>…)` — sau mỗi bước update (60/giây, còn đọc được `pressed`).
   - `FRAME_HOOKS.overlay.push(()=>…)` — vẽ trên cùng sau HUD, toạ độ logic 1280×720 (đã save/restore + setTransform).
   - `COMBAT_HOOKS.afterHit` / `afterPlayerDamage` / `drawEffects` (xem `src/01_core.js` và HANDOFF T07 trong gói).
3. Phải sửa hàm có sẵn → ghi **PATCH** vào `ops/patches/BATCH_04.json`: `[{"task":"C5","file":"src/37_equipment_assets.js","old":"<đoạn y nguyên, xuất hiện đúng 1 lần>","new":"<đoạn thay>","why":"…"}]`. Patch càng nhỏ càng tốt. Hàm có nhiều lớp (xem `ops/OVERRIDES.md`) thì patch **lớp cuối** hoặc lớp `_Lxx` đúng chỗ.
4. **Save cũ:** mọi trường mới trong `p` khởi tạo mặc định khi thiếu (`p.x ??= …`) ngay lúc dùng; không đổi/xoá trường cũ; gọi `save()` sau khi đổi trạng thái lâu dài.
5. Đọc dữ liệu từ `DATA.*` (file `data/*.js`, đã duyệt). Nếu `DATA.x` thiếu/hỏng → `console.warn` một lần rồi tắt module, không làm hỏng game.
6. Không tạo phím mới. Chữ hiển thị tiếng Việt. Vẽ bằng helper có sẵn (`text`, `box`, `v18Frame`, `v21Button`/nút của bảng tương ứng, `imgs`, `ASSETS`).
7. Mỗi việc kèm **tự kiểm trong Node** (như bạn đã làm ở gói 03): nạp các file theo thứ tự `index.html` trong VM có canvas giả, gọi hàm thật, in kết quả. Ghi số ca + kết quả vào báo cáo. Chromium bị chặn ở máy bạn là bình thường.

## Cách nộp
`BATCH_04.zip`: `src/55_events.js`, `src/56_tutorial.js`, `src/57_milestones.js`, `src/58_jobs.js`, `src/59_sect_tasks.js`, `ops/patches/BATCH_04.json`, `BATCH_04_REPORT.md` (khuôn cuối file). Claude tự thêm thẻ `<script>` vào `index.html` (sau `53_render_scale.js`, trước `99_boot_ready.js`).

---

## C1 — T61 Hướng dẫn tân thủ → `src/56_tutorial.js`
- Spec `ops/specs/tutorial.md` + `batch03_addendum.md` §1.7; dữ liệu `DATA.tutorial.hints` (18 lời nhắc).
- Phát hiện 18 trigger bằng trạng thái thật (đọc code để lấy đúng biến: `p`, `enemies`, `bossType`, `modal`, `p.mapId`, `p.discovered`, `p.gear`, `p.v31`, `OW_POI`, `hdSun()`/`p.worldTime`, …) trong `FRAME_HOOKS.update`; mỗi lời nhắc hiện **1 lần**, lưu `p.tutorial = {seen:{}, off:false}`.
- Vẽ thẻ nhắc trong `FRAME_HOOKS.overlay` theo spec (vị trí không chồng HUD T10/T12, toast, thẻ boss; ẩn khi có `modal`); hàng đợi: tối đa 1 thẻ, cách nhau ≥ 8 giây, ưu tiên `priority` rồi thứ tự đến.
- Tắt/bật: thêm một dòng "Hướng dẫn tân thủ: Bật/Tắt" vào bảng Cài đặt (phím Y, `modal.kind==='settings'`) bằng PATCH nhỏ nhất có thể.

## C2 — T52 30 thành tựu → `src/57_milestones.js`
- Nối `DATA.milestones.list` vào `V42_MILESTONES` (src/37) **lúc nạp file**, mỗi mục chuyển thành `{id,name,need,count:s=>…,reward,xp}` đúng khuôn cũ để hàm nhận thưởng cũ `v42wRewardMilestone` dùng được. Hàm đếm theo `batch03_addendum.md` §1.6 (14 mã).
- Bảng Thành tựu hiện chỉ vẽ vừa 6 mục (`v42wMilestonePanel`, src/37) → PATCH thêm **phân trang** (6 mục/trang, nút ‹ › giống các bảng khác), không đổi cách vẽ một dòng.
- Danh hiệu: `p.titleSel` (id thành tựu có `title`, đã nhận). Thêm nút "Đeo danh hiệu" trên dòng thành tựu có `title` đã nhận; hàm `playerTitle()` trả chuỗi danh hiệu hoặc `''` (Claude sẽ dùng để vẽ dưới tên ở HUD/bảng C).

## C3 — T58 12 ủy thác → `src/58_jobs.js`
- Bảng Ủy thác (J, tab Ủy thác; `V13_JOBS`, `v13JobState`, `v13JobProgress`, src/09) chỉ có chỗ cho 3 việc. Giữ 3 việc cũ, thêm `DATA.jobs.jobs` (12) theo cách: **mỗi ngày game hiện 3 việc** — luôn có việc cũ đang dở (nếu có), phần còn lại chọn ổn định theo ngày (`v42wDay()` hoặc cách tính ngày có sẵn) từ các việc có `minLevel ≤ p.level`.
- Việc `kill` đếm hạ yêu thú ở `region` **sau khi nhận** (giống việc `hunt` cũ — đọc cách nó đếm); việc `carry` trừ nguyên liệu khi trả như việc cũ. Thưởng đúng 1 lần.
- PATCH tối thiểu vào chỗ vẽ/nhận/trả trong src/09 để dùng danh sách việc của ngày thay vì cả `V13_JOBS`.

## C4 — T57 12 nhiệm vụ tông môn → `src/59_sect_tasks.js`
- `V31_TASKS` (2 việc chung) + `DATA.sect.sects[sect].tasks` (3 việc riêng mỗi tông). Bảng N tab Tông môn hiện việc chung + việc riêng của tông người chơi đã gia nhập.
- Kiểm tại handler nhận (`v31AcceptTask`, src/21): `minRank ≤ bậc hiện tại`, cấp người chơi ≥ cấp tối thiểu vùng (`V22_REG[region].min`). Việc `hunt` đếm hạ yêu thú ở `region` sau khi nhận; `boss` đếm lần hạ boss vùng sau khi nhận (boss hồi sinh 3 phút — `batch03_addendum.md` §1.3). Trả việc qua `v31ClaimTask` như cũ, cộng `merit`/`stones` đúng 1 lần.
- Câu `rankLines[bậc]` hiện (toast `v21Say` hoặc chỗ thông báo lên bậc có sẵn) khi người chơi lên bậc.

## C5 — T41 24 kỳ ngộ loại `story` → `src/55_events.js`
- Làm đúng `batch02_addendum.md` §3 (bản sửa 20:50): thêm loại `story` vào vòng quay của `v42wGenerate` (src/37) bằng PATCH; chọn sự kiện từ `DATA.events.events` theo vùng/`minLevel`/`weight`, không lặp 6 lần gần nhất (`p.evRecent`), lưu `eventId` trong bản ghi kỳ ngộ.
- Tới gần + E: đường tương tác `v42event` có sẵn (tìm chỗ xử lý loại `shrine/hunt/supply`) → mở modal lựa chọn (dùng lại khung `modal.kind==='event'` cũ ở src/01 nếu hợp, hoặc vẽ trong module). Chọn xong: tung xác suất 1 lần, áp `effects`/`fail` (enum ở `BATCH_02.md` B3), gọi `v42wComplete(e)` nhưng không cộng `e.reward/e.xp` mặc định.
- Buff tạm `p.evBuffs` áp trong `currentStats()` bằng PATCH vào **lớp cuối** của `currentStats` (xem OVERRIDES). Ban đêm theo công thức ở phụ lục.
- Xoá `openEvent()` chết bằng PATCH.

---

## Khuôn `BATCH_04_REPORT.md`
```
# BATCH_04 — ChatGPT (code nháp)
## C1–C5 — mỗi việc: file, biến/hàm game đã dùng (tên + file:dòng), PATCH nào, trạng thái save mới, tự kiểm Node (số ca, kết quả)
## Rủi ro / chỗ chưa chắc (Claude cần kiểm trên trình duyệt)
## CHAT (dán vào ops/CHAT.md)
## HANDOFF (dán vào ops/HANDOFF.md)
```
