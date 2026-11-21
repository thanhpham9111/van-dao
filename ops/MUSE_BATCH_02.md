# GÓI VIỆC 02 CHO MUSE — 7 việc, làm liền một mạch, không chờ Claude duyệt từng việc

Giao 21/11/2026 20:30 bởi Claude. Gói 01 đã duyệt xong (xem HANDOFF "Review GÓI 01 Muse"). Mọi việc dưới đây **làm được ngay**. Làm theo thứ tự.

## Cách làm (giống gói 01)

1. Đầu mỗi việc: `git pull --rebase`. Cuối mỗi việc: chạy `tools/test_suite.py` (12/12 ĐẠT, 0 lỗi console — kịch bản 09 được phép lỗi cho tới khi xong G02-2), ghi HANDOFF, đổi việc sang **REVIEW**, commit `G02-<ID>: …`, push, nhắn 1 dòng trong `ops/CHAT.md` (giờ VN thật: `TZ=UTC-7 date`).
2. **Không chờ** Claude duyệt — chuyển ngay việc kế. Việc bị trả TODO thì sửa sau việc đang làm.
3. **Không sửa** các hàm Claude đang gộp: `hit`, `damagePlayer`, `renderEffects` (T07) · `hdDrawPOI`, `hdGroundChunk`, `hdEffects`, `v9HeroBody`, `v9NPCDraw`, `v24DecorDraw` (T08) · `v8InteractAt`, `owInteract`, `v8PointerDown`, `v21DeathLoot` (T09) · `v21Inventory`, `v21Tooltip`, `v18Frame` (T46). Xung đột git ở file code → nhắn `@Claude`, không tự giải quyết đè.
4. Hàm có nhiều lớp (xem `ops/OVERRIDES.md`): chỉ sửa **lớp cuối đang chạy** (cột cuối của bảng), không thêm lớp bọc mới (`const old=fn; fn=function…`). Không đổi save cũ; trường mới trong `p` phải có mặc định khi tải save cũ. Vẽ thẳng lên `g` thì reset bằng `g.setTransform(RS.k,0,0,RS.k,0,0)`.
5. Dữ liệu mới nạp bằng thẻ `<script src="data/….js">` trong `index.html`, ngay dưới `data/00_init.js` (đúng thứ tự file `src/`). Ảnh lấy từ `ASSETS["tên"]` (data URI) — tạo `Image` một lần và cache.
6. Máy lỗi ghi file/Chromium như hôm nay → dừng, báo chủ dự án mở phiên mới, đừng thử vòng lặp. Phòng ngừa: cuối mỗi việc xoá `tests/out/*.png`, file trace/profile, thư mục profile Chrome tạm trong `/tmp`; mỗi việc đẩy lên GitHub ngay khi xong, không để dồn trên máy.
7. Hết gói → nhắn `@Claude xin việc`.

---

## G02-1 · M07 — Kiểm tra tương thích save (còn lại từ gói 01)
Như `MUSE_BATCH_01.md` G01-8. Thêm 1 save đã ở bước chính tuyến 8 (`p.v12Main=8`) để làm mốc cho G02-5.

## G02-2 · M10 — Sửa bộ kiểm thử (nhỏ)
- (a) Kịch bản 09: máy Claude chạy ra **LỖI "chưa bắn được kỹ năng"** (11/12). Đổi cách bắn: trước mỗi lần chuột phải, **đợi theo trạng thái** (`hurt===0`, MP ≥ chi phí, không modal) bằng vòng `page.wait_for_function` tối đa 3 giây thay cho thử mù 6 lần; xác nhận bằng số đếm/hiệu ứng của `v11Cast`. Chạy 5 lần liên tiếp phải 5/5 ĐẠT.
- (b) Ảnh mốc phụ thuộc máy (máy Claude ra 5 KHÁC vì khác font). Thêm cờ `--baseline-dir` (mặc định `tests/baseline`), và `--make-baseline` ghi vào thư mục đó. Claude sẽ dùng `tests/baseline_claude/` riêng.

## G02-3 · M11 — Sửa tụt FPS ở Sân Luyện Kiếm (dựa trên kết quả M08 của bạn)
- Mục tiêu: sân luyện ≥ 45 fps ở 1920×1080 Cân bằng (hiện 14), thôn không tụt.
- Thủ phạm theo `tests/perf_profile.md`: `v17House` (lớp cuối `src/32_env_assets.js:232`) gọi save/restore dày đặc, rồi `v41aRig`, `v42eSprite`. Cách gợi ý: **vẽ sẵn mỗi nhà ra canvas phụ** (khoá theo id nhà + chất lượng + `RS.k`), mỗi khung chỉ `drawImage`; làm lại khi đổi Đồ họa hoặc `RS.k`. Với nhân vật/rối: bỏ cặp save/restore không cần thiết (đặt lại `globalAlpha`/transform trực tiếp).
- Quyền: được sửa `v17House` (lớp cuối) và `v41aRig`/`v42eSprite` — các hàm này không thuộc nhóm Claude.
- Nghiệm thu: bảng FPS trước/sau (thôn + sân luyện, Cân bằng + Cao) trong `tests/perf_profile.md`; `test_suite --compare` không thêm KHÁC nào ở ảnh thôn.

## G02-4 · T44 — Giao diện Menu chính + Tạo nhân vật
- Spec: `ops/specs/menu_ui.md` + phụ lục `ops/specs/batch02_addendum.md` §5. Nền `ASSETS["menu_keyart"]` (1920×1080, vùng trái tối sẵn).
- Code: `menu`/`menuV41` (file 41/43, đã gộp ở T03 — sửa thẳng). Giữ nguyên mọi nút và hành vi (Bắt đầu/Tiếp tục/Tạo mới/Cài đặt, ô tên, 3 phái, Nhập thế, xác nhận ghi đè save). Kịch bản 01, 02, 08 của test_suite phải vẫn ĐẠT (cập nhật ảnh mốc menu sau khi chủ dự án/Claude duyệt).
- Nghiệm thu: checklist cuối spec; ảnh menu + tạo nhân vật ở 1280×720 và 1920×1080 → `ops/specs/img/t44_*.png`.

## G02-5 · T39 — Chính tuyến 5 chương + 10 phụ tuyến
- Dữ liệu `data/quests.js` (đã duyệt); spec `ops/specs/story.md`; **làm theo `batch02_addendum.md` §1** (con trỏ `p.v12Main`, 8 bước cũ giữ nguyên chỉ đổi chữ, bước mới tự kích hoạt/tự hoàn thành, `p.qKillBase`, `p.qSide`, kiểm dữ liệu trước khi bật).
- Code: hệ V12 `src/08_v12_v8.js` (`V12_MAIN`, `v12Check`, `v12Count`, thưởng) + nhật ký Q ở lớp cuối `v8Journal` (`src/38_save.js:304`).
- Nghiệm thu: dùng save mốc ở G02-1 (`v12Main=8`) → thấy `m09`; lệnh console đặt điều kiện từng loại goal (talk/discover/kill/boss/level/claim) → bước tự xong, thưởng đúng 1 lần; save cũ ở bước 0–7 vẫn chạy y như trước. Ảnh nhật ký Q (bước chính + phụ tuyến) → `ops/specs/img/t39_*.png`.

## G02-6 · T42 — Thơ vùng + mẹo màn tải (phần không cần tooltip)
- Dữ liệu `data/lore.js`; làm theo `batch02_addendum.md` §4: `regions.*.verse` 2 dòng dưới tên vùng ở màn chuyển vùng (`worldTitle`), 3 giây; `tips` xoay vòng ở màn tải (`src/44`) và màn chuyển vùng. **Chưa** làm lore trong tooltip (chờ T46 của Claude).
- Nghiệm thu: ảnh chuyển vùng vào Thanh Trúc Lâm + ảnh màn tải có mẹo.

## G02-7 · T45 — Trình diễn Thiên kiếp đột phá
- Spec `ops/specs/breakthrough.md` + **`batch02_addendum.md` §6**. Code: `v30TrialStart`, `v30TrialTick`, `v30TrialZone`, `v30TrialEnd` (`src/20_v30_v21.js`); phím B đi qua `v22Break` (lớp cuối `src/40_audio.js:55`).
- Không đổi luật chơi (số đợt, dạng vùng, thời gian báo trước, sát thương, thắng/thua). Cảnh mở đầu chạy trước đợt đầu, Space/Esc bỏ qua.
- Nghiệm thu: lệnh console đưa nhân vật lên cấp 9 đầy tu vi → B → ảnh cảnh mở đầu, báo trước 3 dạng vùng sét, thăng cảnh giới; thắng → cấp 10; thua → quay lại thế giới mở, `p.breakFails` tăng.

---

## Việc chưa mở (KHÔNG làm trong gói này)
| Việc | Chờ |
|---|---|
| T13 HUD chiến đấu, T40 thẻ boss | T07 (Claude) |
| T16 Hội thoại, T24 Nội thất, T41 Kỳ ngộ | T09 (Claude) |
| T18 Công pháp & trang bị | T07 + T09 (Claude) |
| T22 Ánh sáng | T08 (Claude) |
| T43 Giao diện I/C, lore trong tooltip (T42 phần 2) | T46 (Claude) |
