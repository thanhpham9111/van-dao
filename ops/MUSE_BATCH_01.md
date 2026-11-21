# GÓI VIỆC 01 CHO MUSE — làm liền một mạch, không cần chờ Claude duyệt từng việc

Giao 21/11/2026 14:45 bởi Claude. Mọi việc dưới đây **đã đủ điều kiện làm ngay** (không chờ ai). Làm theo thứ tự.

## Cách làm

1. Đầu mỗi việc: `git pull --rebase`. Cuối mỗi việc: chạy `tools/test_suite.py` (phải 8/8 ĐẠT, 0 lỗi console), ghi HANDOFF, đổi việc sang **REVIEW**, commit `G01-<ID>: …`, push, nhắn 1 dòng trong `ops/CHAT.md`.
2. **Không chờ** Claude duyệt — chuyển ngay sang việc kế tiếp. Claude duyệt dần; việc nào bị trả TODO thì sửa xong việc đang làm rồi quay lại sửa.
3. Claude đang làm song song T07 (`hit`/`damagePlayer`/`renderEffects`), T08 (nhóm vẽ thế giới), T09 (nhóm tương tác) — các hàm này rải ở nhiều file. **Không sửa các hàm đó.** Nếu `git pull` báo xung đột ở file code → nhắn `@Claude`, đừng tự giải quyết đè lên.
4. Vẫn đúng RULES: không vá chồng (`const old=fn; fn=function…`), không đổi save cũ, vẽ thẳng lên `g` thì reset bằng `g.setTransform(RS.k,0,0,RS.k,0,0)` (T28 HiDPI).
5. Hết gói → nhắn `@Claude xin việc`.

---

## G01-1 · M09 — Sửa nhỏ sau T11 (nhỏ, ~30 phút)
- (a) Chữ cụm danh tính đủ tương phản trên mọi nền: viền chữ `strokeText` ink `#100b13` alpha 0.8 rộng 3px (vẽ viền trước, chữ sau) cho tên / cảnh giới / CL / HP / MP. Kiểm riêng "CL" vàng trên lá vàng ở thôn.
- (b) Toast (`notify`/`v21Notice`) vẽ SAU màn chuyển vùng (splash `worldTitle`) để không bị che ~3,5s.
- Nghiệm thu: ảnh chụp cụm danh tính ở 3 nền (sáng, tối, lá vàng) → `ops/specs/img/m09_*.png`.

## G01-2 · T25b — Bật lại ký hiệu cửa nhà trong thôn (chủ dự án đã duyệt)
- Spec: T10 §14 (`ops/specs/hud_character.md`).
- Thông tin code: 5 nhà vào được `V36_ROOMS` (id `inn`, `herbalist`, `shop`, `wanderer`, `sentry`), `V36_BY_ID[id]`, điểm cửa `v36Door(room)` (src/25), hàm vẽ cũ `v39POIDraw` (src/27, tìm bằng grep). Trong thôn V47T các nhà tương ứng nút `V471_NODES` cùng id (src/48).
- Hiện icon cửa 22×22 gold, tâm cao hơn điểm cửa 28px, fade 180ms, chỉ khi người chơi trong bán kính tương tác hiện có, ẩn khi `v45CombatHUD()` true. Làm ở CẢ thôn V47T (`v47tDraw`) và thôn cũ (`v35Render`, thế giới).
- Nghiệm thu: ảnh đứng gần cửa Đại Điện ở V47T.

## G01-3 · M08 — Tìm thủ phạm tụt FPS ở Sân Luyện Kiếm
- Như mô tả trong TASKS: profile CPU 10s ở sân luyện và 10s ở thôn (CDP `Profiler.start/stop` qua Playwright), xuất `tests/perf_profile.md`: 15 hàm tốn nhất (self + total) mỗi nơi, kèm file:dòng, đánh dấu hàm có trong `ops/OVERRIDES.md`.
- Đo thêm FPS ở cài đặt Đồ họa **Cân bằng** và **Cao** (sau T28, canvas ×1,5/×2) ở 1920×1080.
- Chỉ đo, không sửa code game. Kết quả này Claude dùng cho T08.

## G01-4 · T20 — Bản đồ thủy mặc (Sơn Hà Đồ)
- Spec: `ops/specs/world_map.md` v1.2 **+ BẮT BUỘC** `ops/specs/world_map_addendum.md` (có nút "Khám phá" → `v48xEnter(id)`, phụ đề "Đã khám phá N/10 địa vực", trạng thái boss hồi sinh).
- Chỗ sửa: thân `v22Atlas()` ở `src/47_v45_v35.js` (đã gộp còn 1 định nghĩa). Gọi từ `worldMapPanel()` ở `src/48_v48_v47.js` khi tab "Sơn Hà Đồ". Tab "Thanh Thạch" (bản đồ thôn) giữ nguyên.
- Dữ liệu: `data/world_map.js` (đã duyệt, khớp game) — thêm thẻ `<script src="data/world_map.js"></script>` ngay dưới `data/00_init.js` trong `index.html`. Ảnh: `ASSETS["world_map_ink"]` (đã nạp; cần tạo `Image` từ data URI và cache, giống cách các ảnh khác được nạp vào `imgs`).
- Nghiệm thu: checklist §6 của spec; ảnh 3 trạng thái (đang ở thôn; chọn vùng chưa khám phá; chọn vùng dưới cấp đề nghị có cảnh báo đỏ).

## G01-5 · M05 — Bản đồ code chết (Coverage)
- Như TASKS: Chrome Coverage qua Playwright, chạy 8 kịch bản M01 + vào thế giới mở + sân luyện + đánh vài quái; xuất `tests/coverage.md`: % code chạy mỗi file `src/`, danh sách hàm KHÔNG BAO GIỜ chạy (tên + file:dòng), ưu tiên hàm trong `ops/OVERRIDES.md`. Chỉ đọc.

## G01-6 · M03 — Soát lỗi hiển thị ở 3 cỡ màn hình
- Chạy kịch bản M01 ở 1280×720, 1366×768, 1920×1080 (và Đồ họa Cao ở 1920×1080); liệt kê chỗ chồng/cắt chữ kèm ảnh vào `tests/hud_issues.md`. Chỉ báo cáo; lỗi nào của HUD mới (T11) thì tự sửa luôn ở file HUD và ghi lại.

## G01-7 · M06 — Kịch bản chiến đấu cho bộ kiểm thử
- Như TASKS: thêm vào `tools/test_suite.py` kịch bản (9) ra thế giới mở đánh 1 quái bằng đánh thường + kỹ năng chuột phải, kiểm quái mất máu; (10) bị quái đánh, HP giảm + có số bay; (11) sân luyện F6 vào/ra; (12) mở/đóng F2. Được dùng lệnh console trong test, không sửa code game.

## G01-8 · M07 — Kiểm tra tương thích save
- Như TASKS: bản gốc dựng lại từ commit `ae69594` bằng `tools/bundle.py` vào `tests/legacy/orig.html` (đã gitignore). Tạo 4 save bằng bản gốc → mở bằng bản hiện tại → so `p.level, p.xp, p.hp, p.stones, p.pills, p.cls, p.v35, p.mapId` + vị trí. Xuất `tests/save_compat.md` và `tools/save_compat.py` chạy lại được.

---

## Việc chưa mở (để biết trước, KHÔNG làm trong gói này)
| Việc | Chờ |
|---|---|
| T13 HUD chiến đấu | T07 (Claude) |
| T16 Hội thoại | T09 (Claude) — spec + phụ lục đã sẵn |
| T18 Công pháp & trang bị | T17 + T31 (ChatGPT, gói 01) + T03 (xong) |
| T22 Ánh sáng & đồng bộ phong cách | T08 (Claude) — spec + phụ lục đã sẵn |
| T24 Nội thất | T09 + T23 (ChatGPT, gói 01) |
