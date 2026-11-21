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

### [2026-11-21] M01 — Muse
**Đã làm:**
- Nâng `tools/screenshot.py` thành `tools/test_suite.py` (Playwright Chromium headless, 1280x720, http://localhost:8123): 8 kịch bản — (01) menu, (02) tạo nhân vật 3 phái, (03) vào thôn, (04) đi 4 hướng WASD, (05) bản đồ M, (06) túi đồ I, (07) nhật ký Q, (08) lưu → tải lại trang → Tiếp tục. Mỗi kịch bản chụp ảnh vào `tests/out/`, ghi lỗi console/pageerror, in bảng ĐẠT/LỖI và ghi `tests/out/report.md`. Cờ `--compare` so ảnh với `tests/baseline/` (md5 + độ lệch pixel trung bình, có PIL); lần chạy đầu đã copy `tests/out/` thành baseline.
- Chạy 2 lần, cả 2 lần đều 8/8 ĐẠT, 0 lỗi console/pageerror. Lần 2 `--compare`: 2 ảnh GIỐNG md5 (05_map, 07_journal), còn lại KHÁC nhẹ (0,02–4,95/255, riêng 08_resumed 10,27/255 — do khung hình động/tiêu đề mờ dần, không phải lỗi chức năng).
- Tiêu chí ĐẠT dựa trên trạng thái thật trong trang (mode/menuPage/modal.kind, V47T.x/y, p.cls/techs/playerId, localStorage `vdtt_vangioi_v3`). Đã kiểm tra ảnh bằng mắt ở menu, tạo nhân vật (Thể Tu), vào thôn.
**File đã sửa:**
- `tools/test_suite.py` (mới), `tests/out/` (14 ảnh + `report.md`), `tests/baseline/` (14 ảnh, lần chạy đầu), `ops/TASKS.md` (M01 → REVIEW), `ops/HANDOFF.md`, `ops/CHAT.md`.
**Kiểm tra:** `python3 tools/test_suite.py --compare` chạy trọn vẹn 2 lần, 8/8 ĐẠT, 0 lỗi console. Không sửa src/, index.html, data/, assets/ hay ops/specs/.
**Chưa làm / không chắc:**
- Kịch bản (04): đi thẳng WASD bị hành lang thôn V471 chặn sớm (W −84px, S +148px, A −16px, D +32px từ spawn; tổng 280px, 2/4 hướng ≥50px) nên tiêu chí ĐẠT dùng tổng dịch chuyển ≥200px và ≥2 hướng ≥50px, không đòi mỗi hướng đều đi xa — xem chi tiết trong docstring của `tools/test_suite.py`. Nếu Claude muốn tiêu chí khác (ví dụ đi theo đường dẫn tới một điểm), ghi vào M01 review.
- Phím I mở panel túi đồ hợp nhất với modal.kind='gear' (wrapper openPanel ở `src/13_v21_v18.js:47` ép cả 'inventory' về 'gear'), không phải 'inventory' — test chấp nhận cả hai và ghi rõ trong báo cáo. Đây là hành vi thật của game, không phải lỗi test.
- Các lỗi HUD đã liệt kê sẵn cuối `ops/TASKS.md` (chữ "Tu vi" bị đè, nhãn vị trí bị icon mắt đè, dock bị cắt chữ…) vẫn thấy trong ảnh `tests/out/03_thon.png`; M01 chỉ kiểm chức năng nên không tính là LỖI, để cho M03.
**Việc tiếp theo:** Claude review M01; Muse làm M02 (đo FPS) sau khi M01 DONE.

### [2026-11-21] T12 — ChatGPT (Claude ghi hộ + review)
**Đã làm (ChatGPT):** spec HUD chiến đấu `ops/specs/hud_combat.md`: HP/MP trên-trái, 4 ô kỹ năng, mục tiêu, thanh boss có máu trễ, hit-stop/rung/chớp/số bay phân cấp, giới hạn hiệu ứng, 8 kịch bản kiểm thử.
**Review (Claude):** CHƯA ĐẠT, trả về TODO. Chi tiết `ops/specs/hud_combat_review.md`: (1) dock chiến đấu đã có 7 ô (thêm đánh thường, khinh công, đan dược); (2) HP/MP đang ở dock; (3) dùng `v45CombatHUD()` có sẵn thay timer 4s; (4) phím thật là RMB/1/2/3; (5) boss có pha thật `v27AI(e).phase`; (6) game không có sự kiện né/chặn; (7) `screenShake` là công tắc giảm hiệu ứng. Bảng tên biến thật đã ghi trong file review.
**Việc tiếp theo:** ChatGPT nộp T10 trước, rồi sửa T12 theo review.

### [2026-11-21] Review M01 — Claude
**Kết quả: ĐẠT → DONE.** Chạy lại `tools/test_suite.py` trên máy Claude: 8/8 ĐẠT, 0 lỗi console. Tiêu chí dựa trên trạng thái thật trong game (mode, modal, V47T, playerId, localStorage), không đoán. Phần ghi chú đầu file (đường chạy thật: v42pHome, V47T, modal 'gear'/'journal8', tự lưu 6 giây) rất có ích cho cả đội.
**Chưa ổn (giao M04):** phần `--compare` báo KHÁC ở mọi ảnh vì nhiễu (khác trình duyệt, hoạt ảnh, giờ trong game; lệch 0,4–33/255) → chưa dùng để bắt lỗi được. Ảnh `tests/out/` (~16 MB) bị commit mỗi lần chạy → repo phình nhanh.
**Việc tiếp theo:** Muse làm M04 (nhỏ) → M02 → M03. Claude làm T03.

### [2026-11-21] T10 — ChatGPT (Claude ghi hộ + review)
**Đã làm (ChatGPT):** spec HUD nhân vật v1.1 `ops/specs/hud_character.md`, 17 mục, có toạ độ từng thành phần, tự mờ, xử lý T25, checklist.
**Review (Claude):** GẦN ĐẠT, trả về sửa v1.2 — chi tiết `ops/specs/hud_character_review.md`. 6 điểm: (1) "nút mắt" không tồn tại (lỗi Claude ghi nhầm, là con trỏ chuột) → mục 7 thành bảng tin sự kiện; (2) cụm hành động gộp nút [E] khi gần điểm tương tác; (3) thiếu vị trí thông báo; (4) phải giữ được Tùy chỉnh HUD F2; (5) chọn cách hiện tên vùng trong thôn; (6) ẩn HP/MP danh tính khi chiến đấu. Bảng tên hàm thật cho cả 2 đường vẽ HUD (thôn `v47tDraw` và ngoài thôn `v35Render`) đã ghi trong review.
**Việc tiếp theo:** ChatGPT nộp T10 v1.2 → Claude review → DONE → Muse làm T11.

### [2026-11-21] M04 — Muse
**Đã làm:**
- (a) Cố định ảnh chụp: `page.add_init_script()` ghi đè `Math.random` bằng RNG mulberry32 seed 20261121 trước khi trang nạp (tồn tại qua reload ở kịch bản 08); `Suite.shot()` đặt `p.worldTime = 145` (giá trị `owInit` mặc định, giờ trong game lái ngày/đêm, thời tiết, NPC, hồi sinh) ngay trước mỗi lần chụp, chỉ khi `p` tồn tại. Cách cố định và giới hạn còn lại ghi rõ trong docstring đầu `tools/test_suite.py`.
- (b) Ngưỡng so ảnh mới trong `compare_images()`: chỉ báo KHÁC khi >2% điểm ảnh lệch quá 40/255 (lệch = max(|R|,|G|,|B|)); khi KHÁC lưu `tests/out/diff_<tên>.png` (điểm lệch tô đỏ). Cả GIỐNG và KHÁC đều ghi % điểm ảnh lệch >40/255 và độ lệch trung bình trong stdout và `tests/out/report.md`. Dùng numpy nếu có, không thì PIL thuần.
- (c) Thêm `tests/out/*.png` và `tests/out/diff_*.png` vào `.gitignore`; `git rm --cached` 14 ảnh `tests/out/*.png` (file vẫn nằm trên đĩa). Sau đó `git ls-files tests/out/` chỉ còn `report.md`; `tests/baseline/` vẫn tracked.
- (d) `--url` giờ thật sự đổi URL chạy: truyền vào `Suite(page, args.url)`, `goto_menu()` dùng `self.url`, mặc định vẫn `http://localhost:8123/index.html`.
**File đã sửa:**
- `tools/test_suite.py`, `.gitignore`, `tests/out/report.md` (ảnh `tests/out/*.png` xoá khỏi git, giữ file trên đĩa), `ops/TASKS.md` (M04 → REVIEW), `ops/HANDOFF.md`, `ops/CHAT.md`.
**Kiểm tra (trước/sau, cùng bản game, baseline giữ nguyên từ M01):**
- Trước (M01, lần chạy 2): compare 2 GIỐNG / 12 KHÁC, độ lệch trung bình 0,02–10,27/255.
- Sau, lần 1 (URL mặc định 8123, `--compare`): 8/8 ĐẠT, 0 lỗi console, compare 14 GIỐNG / 0 KHÁC (0,00–0,05% điểm ảnh lệch >40/255).
- Sau, lần 2 (`--url http://localhost:8124/index.html`, server phụ ở cổng 8124, `--compare`): 8/8 ĐẠT, 0 lỗi console, compare 14 GIỐNG / 0 KHÁC; `report.md` ghi đúng URL 8124 → cờ `--url` hoạt động.
- Kiểm tra riêng đường KHÁC: tô đỏ 30% ảnh giả → `_compare_pair` báo 30,37% lệch, tạo `diff_alt_03_thon.png`; đổi 1 pixel → GIỐNG, không tạo diff (đã xoá file diff thử sau khi kiểm tra).
**Chưa làm / không chắc:**
- Nhiễu dư vẫn còn nhưng dưới ngưỡng: ảnh "enter"/"resumed" có độ lệch trung bình 6–17/255 mà 0,00% điểm ảnh lệch >40/255 — do tiêu đề "Thanh Thạch Thôn" mờ dần ở giai đoạn khác nhau giữa các lần chạy (đã kiểm tra bằng mắt). Nếu muốn triệt hẳn thì phải chụp sau khi hiệu ứng mờ kết thúc, chưa làm.
- `Math.random` đã seed nhưng `newSeed()` còn xor với `Date.now()` nên `seed` thế giới mỗi lần tạo nhân vật vẫn khác theo giờ thực; NPC đang đi bộ, `V41Presentation.clock`, `V42_ATMO.sim` cũng không cố định được — xem giới hạn trong docstring.
- Nhánh fallback PIL thuần (khi thiếu numpy) chưa được chạy thử vì máy này có numpy 1.26.4; code fallback dùng mask theo kênh + histogram xám cho mean.
**Việc tiếp theo:** Claude review M04; Muse làm M02 (đo FPS) sau khi M04 DONE.

### [2026-11-21] Review M04 — Claude
**Kết quả: GẦN ĐẠT → trả TODO sửa nốt 1 điểm.** Chạy 2 lần trên máy Claude: 8/8 ĐẠT, 0 lỗi; seed + worldTime + ngưỡng + .gitignore + --url đều đúng; 11/14 ảnh GIỐNG ổn định.
**Còn sai:** `03_thon.png` luôn KHÁC (~41–46% điểm ảnh): ảnh chụp lúc cảnh đang mờ dần sau khi vào thôn (hiệu ứng chuyển cảnh chưa xong; baseline chụp lúc đã hiện rõ). `06_inventory` (2,00%) và `07_journal` (2,31%) sát ngưỡng, nghi chụp khi panel đang hiện dần.
**Sửa:** trước mỗi lần chụp, chờ tới khi hết chuyển cảnh (gợi ý: chờ `V41Presentation.transition` về 0 nếu biến này tồn tại, hoặc chờ 2 ảnh liên tiếp cách nhau 300ms giống nhau, tối đa 3s); sau khi mở panel chờ thêm ~400ms. Rồi chụp lại baseline.
**Ghi nhận:** ảnh của Muse cũng có "con mắt" đúng chỗ vừa click (253,551) → xác nhận đó là con trỏ chuột của game.
**Việc mới cho Muse:** M05 (bản đồ code chết bằng Coverage — giúp Claude gộp hàm), M06 (kịch bản chiến đấu), M07 (tương thích save). Thứ tự: M04 → M05 → M02 → M03 → M06 → M07.

### [2026-11-21] Review T10 v1.2 — Claude
**Kết quả: ĐẠT → DONE.** Sửa đủ 6 điểm + 2 điểm nhỏ: bỏ nút mắt, mục 7 thành bảng tin sự kiện; nút gộp [E] (8.1) và prompt E ngoài thôn (8.2); toast y100/y150; bảo toàn F2 + bảng nhóm v35Group; tên vùng phương án (a); ẩn HP/MP danh tính khi chiến đấu; tên Công pháp (T). Đã rà chồng lấn: toast/title/target, feed/menu/drawer, tooltip nav/tài nguyên, prompt E/tooltip skill → không chồng.
**Mở khoá T11 cho Muse.** Gợi ý làm từng bước, mỗi bước chạy test_suite: (1) cụm danh tính + tu vi xuống đáy + tài nguyên; (2) dock phải + menu; (3) feed + toast + tên vùng; (4) cụm hành động + nút [E]; (5) tự mờ; (6) kiểm F2 và 3 cỡ màn hình. Đo FPS (M02) trước khi bắt đầu để có số so sánh.
**Lưu ý cho Muse:** `v471*` ở file 48 chưa kiểm tra vá chồng. Gặp hàm bị gán lại nhiều lần → nhắn @Claude, đừng bọc thêm lớp.

### [2026-11-21] T03 — Claude
**Đã làm:** 
- `panel` (18 lớp, toàn kiểu "nếu đang mở bảng X thì vẽ X, không thì gọi lớp trước") → 1 hàm điều phối `panel()` xét bảng theo đúng thứ tự cũ (lớp mới nhất trước), có chú thích phiên bản từng dòng; `panelLegacy()` giữ cờ `v18UI` bao quanh các bảng V8–V14 + thân gốc như lớp V18 cũ; thân gốc đổi tên `panelCore()` (`src/01_core.js`). Hàm `panel` mới ở `src/47_v45_v35.js`.
- `menu` (6 lớp; bản V1, V8, V18 đã chết vì V41 thay hẳn) → 1 hàm `menu()` ở `src/40_audio.js`: trang sao lưu → `v42sPanel()`, home/create/help → giao diện V42, trang khác → `menuV41()` (`src/31_v41_v8.js`).
- OVERRIDES.md: 97 → 95.
**Muốn thêm bảng mới:** thêm một dòng `if(k==='ten_bang')return veBangMoi();` vào `panel()`, KHÔNG bọc thêm lớp.
**Kiểm tra:** so ảnh 14 màn hình với bản gốc (3 trang menu: chính, hướng dẫn, bảo toàn hồ sơ; hồ sơ C, công pháp T, túi đồ I, nhật ký Q, sinh hoạt J, giang hồ L, tông môn N, bản đồ M, cài đặt, Tùy chỉnh HUD F2, sân luyện F6): 12 giống hệt, 1 lệch 20 điểm ảnh, giang hồ L chỉ khác số liệu tu sĩ NPC mô phỏng ngẫu nhiên (bố cục y hệt). `tools/test_suite.py`: 8/8 ĐẠT, 0 lỗi.
**Việc tiếp theo:** Claude T04 (gộp `update`, 33 lớp).

### [2026-11-21] Review T12 v1.3 — Claude
**Kết quả: ĐẠT → DONE.** Đủ 7 điểm review (bảng 9.1), dock 7 ô giữ LMB/RMB/1/2/3/Space/H với toạ độ cụ thể, dùng `v45CombatHUD()`, pha boss `v27AI(e).phase`, bỏ né/chặn, `screenShake` tắt cả rung và hit-stop, bảng khoá toạ độ §8.2 khớp T10 v1.2. Đã kiểm số: 7 ô x421–859 cách đều 12px; boss y664 cách skill 6px; tooltip skill y512–590 không chạm E combat y462–498; toast y150 dưới target y104–142.
**T13 (Muse) còn chờ:** T07 (Claude gộp `hit`/`damagePlayer`/`renderEffects`, sẽ ghi vị trí hook trong HANDOFF T07) và T11.
**Việc tiếp theo của ChatGPT (luồng B):** T19 (bản đồ thủy mặc) → T21 (ánh sáng) → T23 (nội thất); T15/T17 chờ schema T14 của Claude.

### [2026-11-21] M02 — Muse
**Đã làm:**
- Viết `tools/perf.py` (Playwright Chromium headless, 1280x720, http://localhost:8123): đo FPS bằng vòng `requestAnimationFrame` đếm khung hình trong trang (`window.__fps.buckets`, mỗi bucket = số khung hình tròn trong 1 giây); FPS trung bình = trung bình các bucket, FPS thấp nhất = bucket nhỏ nhất. `Math.random` seed 20261121 như test_suite. Cờ `--url`, `--idle`, `--map`, `--combat`.
- 3 tình huống + 1 đối chứng, ghi `tests/perf.md`: (1) đứng yên ở thôn 15s, (2) mở bản đồ phím M 15s, (3) đánh nhau 30s ở Sân Luyện Kiếm (F6, mộc nhân bất tử), (đối chứng) đứng yên ở sân luyện khi phiên đã bắt đầu nhưng chưa đánh 10s.
- Kết quả (lần chạy chính): thôn 60.6 avg / 60 min; bản đồ 59.93 avg / 49 min (bucket đầu lúc mở bản đồ); sân luyện không đánh 21.3 avg / 20 min; đánh nhau 20.53 avg / 18 min, V42T.hits 0 → 104, tổng sát thương 0 → 5794, V42T.time 30.4s. 0 lỗi console/pageerror.
- Phát hiện: FPS tụt rõ ở Sân Luyện Kiếm NGAY CẢ KHI CHƯA ĐÁNH (21.3 fps, đối chứng), gần bằng lúc đánh nhau (20.53 fps) — nguyên nhân không phải hiệu ứng đòn đánh/số bay mà là bản thân scene sân luyện (khu vực thôn cũ, V47T=None, p ở gần sân) hoặc chế độ luyện tập (V42T.active). Cần Claude soi lại phần vẽ ở khu vực này.
- Đường đánh nhau đã khảo sát từ code thật (`src/38_save.js`, v42t*): F6 khi chưa ở gần sân thì dẫn đường (v42tGuide, đi bộ ~15s qua scene V47T rồi về scene thôn cũ); khi `v42tNear(0)` đúng mới bấm F6 lần nữa để bắt đầu (`v42tStart`); bấm F6 khi đang đi qua sân chỉ dẫn đường lại. Nhấp chuột vào mộc nhân (vị trí màn hình qua `hdPoint`) mỗi ~0,7s.
**File đã sửa:**
- `tools/perf.py` (mới), `tests/perf.md` (mới), `ops/TASKS.md` (M02 → REVIEW), `ops/HANDOFF.md`, `ops/CHAT.md`. Ảnh `tests/out/perf_idle.png`, `perf_map.png`, `perf_combat.png` chỉ lưu local (đã gitignore `tests/out/*.png`).
**Kiểm tra:**
- Chạy `python3 tools/perf.py` 2 lần trọn vẹn, kết quả tái lập: lần 1 thôn 60.53/bản đồ 60.2 (min 56)/đánh nhau 21.83 (min 19), hits 0 → 103; lần 2 (có đối chứng) thôn 60.6/bản đồ 59.93 (min 49)/đối chứng 21.3/đánh nhau 20.53 (min 18), hits 0 → 104. Cả 2 lần 0 lỗi console. Kiểm tra riêng bằng script probe: thôn 60.9, sân luyện không đánh 20.89, đánh nhau 20.9 — khớp.
- Chạy lại `python3 tools/test_suite.py --compare` sau M02: 8/8 ĐẠT, 0 lỗi console, compare 14 GIỐNG / 0 KHÁC (3 ảnh perf_* liệt kê MỚI vì chưa có trong baseline, không phải lỗi). Không sửa src/, index.html, data/, assets/ hay test_suite.py; đã khôi phục `tests/out/report.md` về bản đã commit sau khi chạy kiểm tra.
**Chưa làm / không chắc:**
- Chưa soi được TẠI SAO scene sân luyện nặng: chỉ biết FPS tụt cả khi không đánh; có thể do khu vực thôn cũ vẽ nhiều (cây, nhà, hiệu ứng) hoặc vòng cập nhật của chế độ luyện tập — cần người đọc code game (Claude) kiểm tra, Muse không đoán.
- FPS đo trên máy ảo headless (trần rAF ~60, CPU chia sẻ) nên số tuyệt đối chỉ có ý nghĩa so sánh tương đối trong cùng môi trường, không phải FPS trên máy người chơi.
- Bucket đầu của tình huống bản đồ tụt còn 49-56 fps (lúc mở panel) rồi về ~60 — là hiện tượng chuyển cảnh, không phải tụt kéo dài.
**Việc tiếp theo:** Claude review M02; Muse làm M03 (soát lỗi HUD ở 3 cỡ màn hình) sau khi M02 DONE.

### [2026-11-21] Review M02 — Claude
**Kết quả: ĐẠT → DONE.** Cách đo rõ (bucket rAF/giây, seed cố định), có nhóm đối chứng "sân luyện không đánh", bằng chứng đánh thật (V42T.hits 0→104). Phát hiện quan trọng: sân luyện 21 fps ngay cả khi chưa đánh, thôn 60 fps → nguyên nhân ở cảnh sân luyện (thế giới HD cũ), không phải hiệu ứng đòn đánh.
**Việc mới:** M08 (profile CPU tìm hàm làm chậm ở sân luyện). Kết quả sẽ quyết định T08 (Claude gộp nhóm vẽ thế giới HD) có kèm tối ưu không.
**Thứ tự Muse:** M04 → T11 → M08 → M05 → M03 → M06 → M07.

### [2026-11-21] T14 — Claude
**Đã làm:** `ops/specs/schemas.md`: khuôn dữ liệu cho `data/techs.js`, `data/equipment.js`, `data/dialogues.js`, `data/world_map.js`. Tên trường bám dữ liệu thật (`TECH`, `EQUIPMENT`, `V8_PEOPLE` 12 NPC, `REGIONS` 10 vùng, chỉ số `currentStats()`), có danh sách id cấm trùng và giới hạn cân bằng.
**Lưu ý quan trọng:** save lưu đồ theo số thứ tự trong `EQUIPMENT` → đồ mới chỉ NỐI vào cuối, không xoá/xếp lại. Nhiệm vụ chính số 1 phụ thuộc `p.v12Talk.inn` → hội thoại đầu của Trưởng lão phải có `"talked": true`.
**Mở khoá:** T15, T17 cho ChatGPT. T19 thêm phần dữ liệu `data/world_map.js`.
