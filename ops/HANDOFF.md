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

### [2026-11-21] T19 — ChatGPT (Claude ghi hộ + review)
**Đã làm (ChatGPT):** spec bản đồ thủy mặc v1.0 `ops/specs/world_map.md` + ảnh nền `world_map_ink.png` (1586×992, chưa có trong repo).
**Review (Claude):** GẦN ĐẠT → sửa v1.1 (`ops/specs/world_map_review.md`): nút là "Dẫn đường" (`v8SetGoal`, không khoá theo cấp, chỉ cảnh báo); giữ 3 nút Thanh Thạch / Sơn Hà Đồ / Đóng; liệt kê trường thật của `V22_REG`; không cần `data/world_map.js`, chỉ thêm bảng chữ ấn triện 10 vùng. Đã xác nhận nguồn: `REGIONS`, `V22_ORDER`, `V22_REG`, `ROAD_EDGES`, `p.discovered`, `v22Atlas`.

### [2026-11-21] M04 (sửa nốt) — Muse
**Đã làm:**
- Chờ chuyển cảnh xong trước mỗi lần chụp (`Suite.wait_settled()`, gọi trong `Suite.shot()`): đợi `V41Presentation.transition==0` và (khi ở play) `worldTitle==0`, tối đa 6s; rồi kiểm tra ảnh ổn định — chụp 2 ảnh cách nhau 300ms, độ lệch trung bình <= 2.0/255, thử tối đa 3 lần. Hết thời gian vẫn chụp và in cảnh báo (không làm hỏng kịch bản). Sau khi mở panel (M/I/Q) chờ thêm 400ms trước khi chụp. Đã đo thực bằng probe: sau click "Nhập thế", transition 0.39 → 0 sau ~0.7s, worldTitle 3.48 → 0 sau ~3.8s.
- Phát hiện khi khảo sát code: `worldTitle` không chỉ là tiêu đề mờ dần — khi >0, game vẽ splash toàn màn hình (lớp tối rgba(6,19,25,0.55) phủ hết màn hình + ảnh bản đồ 640x427 ở giữa, src/04_v11_v46.js:67-77). Đó mới là thủ phạm chính gây KHÁC 41-70%: baseline cũ chụp lúc splash đang hiện (cảnh tối), ảnh mới chụp lúc đã hết splash (cảnh sáng). Tiêu đề lớn "Thanh Thạch Thôn" ở giữa trên là HUD thường trực, không phải worldTitle.
- Thêm cờ `--refresh-baseline`: làm mới `tests/baseline/` từ ảnh vừa chụp (chỉ 14 ảnh của 8 kịch bản, không copy perf_*/diff_*), rồi bỏ qua --compare ở lần đó. Sửa một lỗi gặp lúc làm: bản đầu của cờ này chỉ copy 8 ảnh đại diện trong `results` nên baseline thiếu 6 ảnh — đã sửa thành copy từ `Suite.shots` (mọi ảnh đã chụp) và chạy lại.
**File đã sửa:**
- `tools/test_suite.py`, `tests/baseline/` (làm mới 14 ảnh; 12 ảnh đổi, 05_map và 07_journal giữ nguyên md5), `tests/out/report.md`, `ops/TASKS.md` (M04 → REVIEW), `ops/HANDOFF.md`, `ops/CHAT.md`.
**Kiểm tra (cùng bản game):**
- Chạy với code mới, so với baseline CŨ: 8/8 ĐẠT, 0 lỗi console, compare 11 GIỐNG / 3 KHÁC — 03_thon đã GIỐNG (1,79%, trước đây trên máy Claude luôn KHÁC 41-46%); 3 ảnh KHÁC là 02_enter_cls1_body (70,21%), 02_enter_cls2_spell (70,32%), 08_resumed (62,32%), đều do baseline cũ chụp lúc splash chuyển cảnh đang hiện (cảnh tối) trong khi ảnh mới đã hết splash (cảnh sáng) — đã kiểm tra bằng mắt cả 2 phía.
- Làm mới baseline rồi chạy `--compare` 3 lần liên tiếp: lần nào cũng 8/8 ĐẠT, 0 lỗi console, compare 14 GIỐNG / 0 KHÁC (nhiều ảnh md5 khớp; 06_inventory còn 0,07-0,14%, 08_resumed 0,00-0,22%). Tổng thời gian mỗi lần chạy ~85s (chủ yếu do chờ worldTitle 3,5s sau mỗi lần vào thế giới).
**Chưa làm / không chắc:**
- Các hoạt ảnh liên tục (NPC đi bộ, V47T.clock, V41Presentation.clock) vẫn chạy nên ảnh không bao giờ giống từng điểm ảnh tuyệt đối; ngưỡng 2%/>40 vẫn cần. 03_thon ở lần so với baseline cũ là 1,79% — sát ngưỡng, nhưng trên baseline mới đã md5 khớp 2 lần liên tiếp.
- `Suite.shots` chỉ ghi ảnh chụp qua `shot()`; ảnh probe/stability trong `wait_settled()` chụp vào bộ nhớ, không ghi file.
**Việc tiếp theo:** Claude review M04; Muse làm T11 (M02 đã DONE theo mục Review M02 phía trên; thứ tự mới: M04 → T11 → M08 → M05 → M03 → M06 → M07).
### [2026-11-21] T04 — Claude
**Đã làm:** `update` có 32 lớp bọc nối tiếp (không lớp nào thay hẳn) → chuyển thành **chuỗi hàm tường minh**: thân gốc `update_L00` (`src/01_core.js`), mỗi lớp V10…V48 thành `function update_Lnn(dt)` đặt đúng chỗ cũ và gọi thẳng `update_L(nn-1)`; điểm vào duy nhất `function update(...a){return update_L32(...a);}` ở `src/48_v48_v47.js`. Hành vi không đổi (giữ nguyên thứ tự, điều kiện dừng sớm, tham số), nhưng không còn lệnh gán đè `update` nào. Làm bằng công cụ phân tích cú pháp, có kiểm: mỗi biến bọc chỉ dùng trong đúng lớp của nó.
**Vì sao không gộp thành 1 hàm:** 32 lớp, mỗi lớp có việc trước/sau/dừng sớm riêng (chụp ảnh, sân luyện, tự lưu, âm thanh...) → gộp tay rủi ro cao. Chuỗi tường minh cho phép sửa đúng một lớp và dễ gộp dần sau này.
**Muốn đổi hành vi update:** sửa trong lớp liên quan (tìm `update_L` + tên tính năng), hoặc thêm `update_L33` gọi `update_L32` và đổi điểm vào. KHÔNG gán `update=function`.
**Kiểm tra:** so ảnh 7 màn hình (đi lại, hồ sơ, túi đồ, bản đồ, F2, sân luyện, sinh hoạt): 5 giống, 2 lệch do vị trí nhân vật 443/445px — chạy lặp cho thấy cả bản gốc cũng dao động 443/445 (nhịp khung hình), không phải lỗi. `test_suite.py` 8/8 ĐẠT; qua http 0 khung hình lọt trước cổng khởi động. OVERRIDES: 95 → 94.
**Việc tiếp theo:** T05 (`start`/`resume`, cẩn thận save).

### [2026-11-21] T19 v1.1 — ChatGPT (Claude ghi hộ + review lần 2)
**Kết quả:** CHƯA ĐẠT. v1.1 viết theo BRIEF cũ (trước review lần 1) nên 4 điểm chưa sửa; toạ độ tự đặt không khớp địa lý thật. Review lần 2 (`ops/specs/world_map_review.md`) đưa sẵn: bảng 10 vùng với x/y tỉ lệ ảnh tính từ `REGIONS` (lưới 2×5), ấn triện, realmHint từ `V22_REG`, 13 cặp `paths` từ `ROAD_EDGES`. Đổi quyết định: GIỮ `data/world_map.js` (theo cách v1.1) với số liệu bảng trên.

### [2026-11-21] Review M04 (lần 2) — Claude
**Kết quả: ĐẠT → DONE.** `wait_settled()` (chờ transition + worldTitle, kiểm 2 ảnh liên tiếp) sửa đúng gốc: `03_thon` từ KHÁC 41–46% → GIỐNG. Trên máy Muse 14/14 GIỐNG. Trên máy Claude 8/8 ĐẠT, 10/14 GIỐNG, 4 ảnh lệch 2,3–2,7% (sát ngưỡng 2%) do khác máy vẽ font → **baseline gắn với máy tạo ra nó**; quy ước: `--compare` chạy trên máy Muse (baseline trong repo), Claude so ảnh bằng công cụ riêng với bản gốc.
**Phát hiện hay của Muse:** khi `worldTitle>0` game vẽ màn chuyển vùng toàn màn hình (lớp tối + ảnh bản đồ) — ghi nhận cho T20.
**Việc tiếp theo Muse:** T11 (HUD nhân vật).

### [2026-11-21] T05 — Claude
**Đã làm:** `start` (15 lớp bọc) và `resume` (18 lớp bọc) → chuỗi hàm tường minh như T04: `start_L00…start_L15`, `resume_L00…resume_L18`; điểm vào duy nhất `function start(...a)` và `function resume(...a)` ở `src/48_v48_v47.js`. Đã kiểm không có lời gọi `start`/`resume` lúc nạp trang (điểm vào nằm ở file 48 vẫn an toàn).
**Kiểm tra:** `test_suite.py` 8/8 ĐẠT (tạo đủ 3 phái; lưu → tải lại → Tiếp tục khớp playerId và vị trí). Save tạo ở bản gốc mở bằng bản mới: đúng vị trí, cấp, bố cục HUD. So toàn bộ 1.158 trường của nhân vật mới tạo (3 phái) giữa bản gốc và bản mới: cùng cấu trúc; chỗ khác chỉ là trường ngẫu nhiên/đồng hồ (`gear.roll`, `v14.actors`, `v14.rng`, clock, vị trí sự kiện) — bản gốc so với chính nó cũng khác đúng các trường đó. OVERRIDES: 94 → 92.
**Việc tiếp theo:** T06 (`worldMapPanel` + `owMiniMap`), cần cho T20 bản đồ thủy mặc.

### [2026-11-21] Review T19 v1.2 — Claude
**Kết quả: ĐẠT → DONE.** Sửa đủ 4 điểm (Dẫn đường không khoá, 3 nút đầu bảng, trường thật `V22_REG`/`QUALITY`, `p.discovered`); chọn hiện tên vùng chưa khám phá.
**Dữ liệu `data/world_map.js`:** kiểm tự động khớp game thật — JSON hợp lệ, 10 vùng đúng tên `REGIONS`, x/y lệch ≤ 0,0015 so với toạ độ tính từ `REGIONS`, realmHint khớp `V22_REG`, 13 cặp đúng `ROAD_EDGES`, desc ≤ 69 ký tự, không trường lạ. Chưa thêm thẻ script vào `index.html` (việc của Muse ở T20).
**Mở:** T20 cho Muse sau khi Claude xong T06.

### [2026-11-21] T06 — Claude
**Đã làm:**
- `worldMapPanel` (8 lớp; V45 thay hẳn nên V8–V22 chết) → 1 hàm ở `src/48_v48_v47.js`: ngoài cảnh thôn V47T hoặc tab "Sơn Hà Đồ" → `v45TownMap()` (tab local/đang trong thôn cũ) hoặc `v22Atlas()` (Sơn Hà Đồ); trong cảnh V47T → bản đồ địa phương V47T.1 (giữ nguyên code).
- `owMiniMap` (7 lớp; V16 thay hẳn) → 1 hàm `owMiniMap()` + hàm phụ `owMiniMapAtlas()` (thân V16), cùng ở `src/48_v48_v47.js`: trong thôn vẽ sơ đồ thôn `v16MapDraw`, ngoài vẽ atlas, sau đó vẽ cổng qua vùng V48.
- OVERRIDES: 92 → 90.
**Phát hiện (giống vụ V39):** dấu nhiệm vụ trên minimap (V12) và dấu sự kiện giang hồ (V14) đã bị V16 vô tình tắt từ trước; giữ nguyên hành vi hiện tại. Muốn bật lại → chủ dự án quyết định (T27).
**Kiểm tra:** so ảnh 6 màn hình bản đồ (bản đồ thôn V47T, chuyển tab Sơn Hà Đồ, quay về tab thôn, bản đồ ở thôn cũ + tab Sơn Hà Đồ): 5 giống, màn còn lại khác do HUD mới của Muse (T11 đang làm), cảnh/bản đồ giống. test_suite 8/8 ĐẠT.
**Cho Muse (T20):** thay phần thân `v22Atlas()` (Sơn Hà Đồ) — gọi từ `worldMapPanel` ở `src/48_v48_v47.js`; nạp `data/world_map.js`. Tab local (`v45TownMap`, bản đồ V47T) giữ nguyên.

### [2026-11-21] T27 + T25 + T06b — Claude
**Chủ dự án quyết định:** bật lại cả T25 (ký hiệu cửa nhà) và T27 (dấu nhiệm vụ + sự kiện trên minimap).
- T27: Claude thêm lại vào `owMiniMap()` (file 48) — dấu nhiệm vụ đang theo dõi (V12) và sự kiện giang hồ đang diễn ra (V14), đúng code cũ.
- T25: giao Muse (T25b) làm cùng T11 theo T10 §14.
- T06b: Claude phát hiện "Sơn Hà Đồ" thật là bản V45 (có thêm nút **Khám phá** → `v48xEnter(id)`), review T19 đã mô tả nhầm bản V22 → viết `ops/specs/world_map_addendum.md` bắt buộc cho T20. Gộp `v22Atlas` (4 lớp, 3 lớp chết) còn 1 định nghĩa. OVERRIDES: 90 → 89.

### [2026-11-21] Review T15 — Claude
**Kết quả: ĐẠT → DONE.** Spec hội thoại kỹ (chữ chạy theo cụm Unicode, chống cộng thưởng lặp, Esc không commit, save cũ). `data/dialogues.js` kiểm tự động: JSON hợp lệ, 6 lần gặp, mọi nhánh có điểm kết thúc, không node thừa, chữ ≤140, đúng enum schema, cả 3 nhánh kết thúc `inn_1` có `talked:true`, `openShop` chỉ ở shop.
**Phụ lục cho T16** (`ops/specs/dialogue_addendum.md`): đường vào thật `v8Talk`; `talked` = `p.v12Talk[id]=true; v12Check(); save()`; game không có panel cửa tiệm → `openShop` mở bảng NPC cũ (nút mua đan `v8Shop`); thêm nút cố định "Việc khác [Tab]" mở bảng NPC cũ để không mất nhiệm vụ phụ/trò chuyện/quà; chân dung `imgs['npc_'+id]`.
**Phát hiện:** trong thôn V47T, tương tác Trưởng lão/Thương nhân đi qua nút [E] của cụm hành động → bảng NPC cũ; hàm `v47tInteractNPC` bản đầu (chỉ hiện message/đổi đan trực tiếp) đã chết.

### [2026-11-21] T28 — Claude
**Đã làm:** `src/53_render_scale.js`: bộ đệm canvas = 1280×720 × k (k theo cỡ hiển thị × devicePixelRatio, làm tròn 0,25; tối đa theo cài đặt Đồ họa: Tiết kiệm ×1, Cân bằng ×1,5, Cao ×2), `g.setTransform(k)` đầu mỗi khung (`rsPrepare()` trong `frame`, file 47). Màn tải của chế độ hiệu năng (file 44) đổi `setTransform(1…)` → `setTransform(RS.k…)`. Toàn bộ code vẫn dùng toạ độ logic W×H.
**Kiểm tra:** 1920×1080: canvas 1920×1080 (k=1,5), chữ/HUD/chân dung nét hơn rõ (ảnh `ops/specs/img/t28_truoc_sau.png`), click nút Bản đồ trúng; retina dpr2 + Cân bằng: k=1,5; 1280×720 giữ k=1 → test_suite 8/8 ĐẠT; cổng khởi động 0 khung lọt.
**Lưu ý cho mọi người:** vẽ thẳng lên `g` nhớ đừng `setTransform(1,0,0,1,0,0)`; muốn reset dùng `g.setTransform(RS.k,0,0,RS.k,0,0)`. Ảnh nền thôn vẫn mờ vì ảnh gốc nhỏ (T29 — chủ dự án upscale).
**Cho Muse:** đo lại FPS ở Cân bằng/Cao khi làm M08 (k=1,5 → ~2,25× số điểm ảnh).
### [2026-11-21] T11 — Muse
**Đã làm:** Code HUD nhân vật theo spec T10 v1.2, cả hai đường vẽ (thôn `v47tDraw` file 48 + ngoài thôn `v35Render` file 47), 6 bước, mỗi bước 1 commit + 1 fix nhỏ cuối:
- (1/6) `759d64f`: cụm danh tính (§3: không khung đen lớn, tên serif tối đa 2 dòng, cảnh giới/CL dòng riêng, hàng HP/MP, ẩn HP/MP trái khi `v45CombatHUD()`), tu vi xuống đáy (§9: nhãn y676, thanh y692), tài nguyên (§10: linh thạch + đan y610 trong `v35Nav`). Helper mới: `V45_SPEC`, `V45_TIPS`, `v45Tip`, `v45Name`, `v45HpMpRow`, `v45XpBar`, `v45ResourceCell`.
- (2/6) `c29471d`: minimap + nhiệm vụ (§5/§6). Minimap 100×64 + thông tin 3 dòng (tên tối đa 2 dòng) + 1 nút "Bản đồ" (M); quest panel 1024,160,232×132, tiêu đề serif 15px, tên 2 dòng, tiến độ + thanh gold, nút "Dẫn đường"/"Công pháp" 100×24. Helper `v45WrapLines`.
- (3/6) `f62495e`: dock chức năng + menu (§11/§12). Nav 6 ô 46×46 chỉ-icon (badge phím, tooltip tên đầy đủ + phím sau hover 350ms, ô Công pháp sáng khi có điểm kỹ năng), Menu chỉ còn icon 46×46 (hết chữ "MENU"/"Menu" lặp). Helper `v45IconCell`; `v45Control` thêm tham số cao (nút trái h46).
- (4/6) `765a4ce`: feed + toast + tên vùng (§7/§4/§4.1). Feed 3 dòng, dòng mới nhất ở đáy y602, card 300×28, fade 400ms cuối, ẩn tạm khi drawer Đạo đồ mở; tên vùng trạng thái y33 / tên y64 / gạch y88 (thôn luôn hiện cố định, ngoài thôn fade vào 200ms / ra 400ms theo `owTitle`); toast x430,y100,w420,h36 (y150 khi có mục tiêu).
- (5/6) `4dca585`: cụm hành động + nút [E] (§8/§8.1/§8.2). Hub dock y638 h36, 3 nút 144×36; gần điểm E hợp lệ thì 2 ô đầu gộp thành nút 425,638,276×36 "Tên điểm [E]", "Theo nhiệm vụ" giữ chỗ; E prompt ngoài thôn x502,y552,w276,h36 (combat y462); tấm cổng V48 dời khỏi y610 (đè hàng HP/MP của dock combat) về y552; prompt POI ẩn khi gần cổng (E gần cổng ưu tiên đi cổng).
- (6/6) `54b7c45`: idle fade + F2 + 3 cỡ màn hình (§13). Bóng ink 1px cho chữ cụm danh tính + nhãn tu vi (góp ý của Claude sau bước 3 — cảnh giới/CL trước đây dùng `text()` trần nên chìm trên nền sáng); idle fade `V45_IDLE.f` 1→0,65 sau 5s không thao tác, về 1 trong 150ms khi có hoạt động, luôn 1 khi combat/mở panel/F2/HP≤25%/đang hiện tooltip (nhân vào alpha nhóm trong từng callback vẽ; toast + tên vùng không lấy hệ số); F2 mở/đóng được; canvas 1280×720 co giãn theo CSS nên 1920×1080 và 1366×768 giữ nguyên bố cục.
- Fix cuối (cùng commit hoàn tất): tên nhiệm vụ nở tới 4 dòng (panel tối đa 180px) + tooltip tên đầy đủ khi vẫn bị cắt — kiểm bằng `v45WrapLines` với tên dài thật trong trang (3 dòng; quá dài cắt ở 4 dòng).
**File đã sửa:** chỉ `src/47_v45_v35.js` và `src/48_v48_v47.js`. Không thêm lớp vá chồng nào (sửa đúng định nghĩa duy nhất đã gộp ở T02b); không đổi save key, hành vi game, cân bằng; không thêm ảnh base64.
**Kiểm tra:**
- `tools/test_suite.py --compare` trước khi làm mới baseline: 8/8 ĐẠT, 0 lỗi console, 6 ảnh KHÁC là ảnh thôn/thế giới (HUD mới theo spec — đúng như dự kiến).
- Làm mới baseline (`--refresh-baseline`, 10/14 ảnh đổi) rồi chạy `--compare` 3 lần liên tiếp: lần nào cũng 8/8 ĐẠT, 0 lỗi console, **14 GIỐNG / 0 KHÁC**.
- FPS spot-check bằng `tools/perf.py` (số M02 trong ngoặc): thôn 60,38 (60,6); mở bản đồ 60,4 (59,93); sân luyện không đánh 23 (21,3); đánh nhau 30s 21,8 (20,53), hits 0→104 — không tệ hơn M02. `tests/perf.md` không sửa (vẫn là số M02); số trên chỉ ghi ở đây.
- Idle fade đo thật: `V45_IDLE.f` = 1 sau 1s, 0,65 sau 7s không thao tác, về 1 khi di chuột; F2 mở panel "TÙY CHỈNH HUD" rồi đóng lại được, 0 lỗi.
- Ảnh minh họa: `ops/specs/img/muse_t11_village.png` (thôn), `muse_t11_outside.png` (ngoài thôn), `muse_t11_merged_e.png` (nút [E] gộp gần Đại điện). Ảnh idle/F2/2 cỡ màn hình ở `/tmp/t11shots/after6/`.
**Chưa làm / không chắc — nhờ Claude xem:**
- Bảng màu: chữ/vạch mới dùng hex Design Bible qua `V45_SPEC`; mặt phẳng/nút chung (`v45Surface`/`v45Button`) vẫn giữ bảng `V45` cũ vì dùng chung với menu/panel.
- Panel minimap nhỏ bỏ đồng hồ (`v45Day()`), nút "Sơn Hà Ký" (O) và ô vuông chuyển V/G (không đủ chỗ theo bố cục spec); phím O/M vẫn mở bản đồ lớn (tab Thanh Thạch / Sơn Hà Đồ còn nguyên).
- Nút quest: đúng "Công pháp" khi `t.action==='skill'`; các nhãn huấn luyện "Vượt thiên kiếp"/"Đi tu luyện" giữ nguyên theo trạng thái (không phải nhãn spec).
- Toast y100 ngoài thôn bị ảnh splash vào vùng che trong ~3,5s: `worldHud` (`v35Render`) vẽ TRƯỚC splash trong `worldDraw` (src/04), ảnh map splash y110–537 đè lên toast y100–136; trước đây toast ở y18 nên vẫn thấy (chỉ tối đi). Trong thôn toast vẫn thấy (HUD thôn vẽ sau splash chữ). Tên vùng vẫn hiện lớn trên splash nên thông tin không mất — nhưng nếu muốn toast luôn thấy thì cần đổi thứ tự vẽ (ngoài phạm vi T11).
- Tên vùng ngoài thôn hiện tổng 3,0s thay vì 2,8s spec (fade vào 200ms / ra 400ms đã đúng): `owTitle` đếm từ 3, giá trị 3 đặt ở src/03 (ngoài file T11 được sửa).
- Chip trạng thái (`v35Status`, y140) nằm ngay dưới khung kéo F2 của nhóm identity (y24–136) — có sẵn từ trước, không sửa.
- Tu vi ẩn trong combat (đường `v35Dock` không vẽ `v45XpBar`) — theo spec §9 là việc của T13.
- Thay đổi identity/nav cũng ảnh hưởng HUD nội thất `v36HUD` (nó gọi `v35Identity`/`v35Status`/`v35Nav`) — không kiểm bằng mắt trong nội thất.
- Góp ý sớm của Claude sau bước 3 (CHAT 06:51) đã xử lý hết: (1) bóng chữ — xong; (2) tu vi đè cụm nút — hết từ bước 5, đã kiểm bằng ảnh; (3) tên vùng chồng — hết từ bước 4, đã kiểm bằng ảnh.
- T25: chủ đã duyệt bật lại (CHAT 06:59) → T25b giao Muse làm cùng T11 theo §14; chưa làm trong commit này, làm ngay sau khi rebase xong (xem tin CHAT 14:07).
**Việc tiếp theo:** M08 (profile CPU sân luyện) theo thứ tự M04 → T11 → M08 → M05 → M03 → M06 → M07, sau khi Claude duyệt T11.

### [2026-11-21] Review T21 — Claude
**Kết quả: ĐẠT → DONE.** Spec rất kỹ: thứ tự lớp vẽ (scene nhận grading, UI không), bảng màu 9 mốc giờ + 10 vùng, công thức multiply có kẹp, đèn có giới hạn 6 nguồn/2 chồng, bóng 2 lớp tính theo W/H, rim chỉ phía nguồn sáng, HUD đổi chất liệu không tint, 3 tier hiệu năng.
**Phụ lục `ops/specs/lighting_addendum.md`:** mốc giờ spec đúng (`giờ = worldTime%360/15`, như `hdSun`; 1 ngày = 6 phút thật); hệ đêm cũ `owWeather` lệch pha → thay; `hdSun/hdShadow` đổi sang hướng sáng cố định; thôn V47T chưa có ánh sáng, hero dùng `v47tDrawHero`; `v41Quality` 0/1/2 → tier tối giản/nhẹ/đầy đủ; tắt sương fallback ở V47T.
**Còn chờ:** T08 (Claude) để chỉ định điểm gắn render; T22 sau T04 (DONE) + T08.
### [2026-11-21] T11 (bổ sung viền chữ) — Muse
**Đã làm:** Theo góp ý của Claude (CHAT 07:07 — chữ cảnh giới/CL vẫn khó đọc trên nền sáng dù đã có bóng 1px): thêm helper `v45Text` (strokeText ink 3px alpha 0.8 rồi fillText) và dùng cho cảnh giới, CL, nhãn + số HP/MP, nhãn tu vi — thay các khối bóng 1px đã thêm ở bước 6. Tên nhân vật giữ `v18Title` (đã có bóng, chữ lớn).
**File đã sửa:** `src/47_v45_v35.js` (`7630c52`).
**Kiểm tra:** ảnh thôn `/tmp/t11shots/stroke/village.png` — "Luyện Khí tầng 1" / "CL 393" đọc rõ trên nền sáng; `test_suite.py --compare` vẫn 8/8 ĐẠT, 0 lỗi console, 14 GIỐNG / 0 KHÁC (viền chữ đổi <2% pixel nên baseline không cần làm mới).

### [2026-11-21] T25b — Muse
**Đã làm:** Bật lại ký hiệu cửa nhà theo T10 §14 (chủ dự án duyệt 06:59). Vấn đề gốc: `src/27_v41_v16.js:20` bọc `hdDrawPOI` và bỏ qua hẳn mọi POI cửa (`if(!o.door) return v39POIDraw(o,z)`) nên marker V36 (ellipse 22 + nhãn tên) không bao giờ vẽ. Sửa: giữ nguyên lời gọi `v39POIDraw` hiện có cho cửa, nhưng khoá theo §14 — chỉ vẽ khi trong bán kính tương tác (125, cùng ngưỡng nhãn "E · VÀO" của V36), không vẽ khi `v45CombatHUD()`, fade-in/out 180ms theo alpha riêng từng cửa (`V25B_FADE[id]`, tính dt từ `elapsed`). Không thêm điểm cửa mới (dùng 5 cửa `v36Door` sẵn có).
**File đã sửa:** `src/27_v41_v16.js` (`e546d36`).
**Kiểm tra:** dịch tới gần cửa shop trong thôn cũ (OW): fade shop = 1, 4 cửa còn lại = 0; marker "E · VÀO · Thương nhân Linh Dược" + ellipse hiện; dịch xa 400px fade về 0, marker ẩn; 0 lỗi console. Ảnh: `ops/specs/img/muse_t25b_door.png`. `test_suite.py --compare` sau cả hai thay đổi (viền chữ + T25b): 8/8 ĐẠT, 0 lỗi, 14 GIỐNG / 0 KHÁC.
**Chưa làm / không chắc:**
- Marker giữ màu theo từng phòng của V36 (`r.color`, nhãn vàng khi đang theo dõi) chứ không ép hết sang gold như §14 ghi — V36 thiết kế màu theo phòng từ trước, không đổi.
- Nhãn marker dùng tên NPC (`V8_INFO[r.id].name`, vd "Thương nhân Linh Dược") trong khi nút [E] ở dock và biển nhà dùng tên phòng ("Vạn Bảo Phường") — lệch tên có sẵn từ trước, không sửa trong T25b.
- Bán kính hiện marker lấy 125 (ngưỡng "near" của V36); E thật chỉ tác dụng trong 63 (`owNearest`) và vào cửa trong 30 — marker hiện sớm hơn để dẫn đường, đúng ý "chỉ trong bán kính tương tác" theo nghĩa rộng.
**Việc tiếp theo:** theo thứ tự mới của Claude (07:21): M09 → T25b → M08 → T20 → M05 → M03 → M06 → M07. M09a (viền chữ 3px) chính là fix đã làm ở `1bb002b` trước khi M09 được giao — chờ Claude xác nhận có tính là xong M09a không; còn M09b (vẽ toast sau splash) làm tiếp.

### [2026-11-21] Review T11 — Claude
**Kết quả: ĐẠT → DONE.** HUD nhân vật làm đủ cả 2 đường vẽ (thôn + ngoài), 6 bước nhỏ dễ review, không thêm lớp vá (OVERRIDES 89), test_suite 8/8, FPS không giảm. Đã kiểm bằng mắt: cụm danh tính không khung đen, tu vi dưới đáy, tên vùng hết chồng, dock icon + tooltip, nút [E] gộp, F2 vẫn kéo/chỉnh/ẩn được từng nhóm.
**Trả lời Muse:** (1) Toast bị màn chuyển vùng che → CÓ, vẽ toast sau splash (giao M09b). (2) Tên vùng 3,0s thay 2,8s → chấp nhận, không sửa `owTitle` ở src/03.
**Còn nhỏ (M09a):** "CL 395" vàng trên nền lá vàng vẫn nhạt dù có bóng 1px → thêm viền chữ 3px.
**Thứ tự Muse:** M09 (nhỏ) → T25b (ký hiệu cửa) → M08 → T20 (bản đồ thủy mặc) → M05 → M03 → M06 → M07.

### [2026-11-21] M09b (toast sau splash) — Muse
**Đã làm:** Toast ngoài thôn bị splash chuyển vùng che ~3,5s vì `worldHud` (`v35Render`) vẽ TRƯỚC splash trong `worldDraw` (src/04). Sửa bằng cách vẽ lại toast SAU splash, không đổi vị trí/kích thước toast, không sửa src/04 (ngoài phạm vi M09):
- `src/47_v45_v35.js`: tách khối vẽ toast trong `v45Location` thành `v45Toast(hub,target)` (giữ nguyên điều kiện hiện, y100/y150 khi có mục tiêu, rect `#100b13e0`); thêm `v45SplashCoversToast()` — đúng khi khung hình này sẽ vẽ splash (đi đường `worldDraw`, không phải thôn V47T / nội thất / Khám phá; `worldTitle>0`; chưa mở panel; ảnh bản đồ `v47map` đã sẵn). `v45Location` bỏ qua lần vẽ toast khi splash sẽ che nó.
- `src/48_v48_v47.js`: `worldDraw` live (lớp cuối, bọc chuỗi tới src/04) vẽ lại toast sau `v48tDrawOld()` + `v48tDrawGates()` khi `v45SplashCoversToast()` và không sửa HUD (`!v35Editing()`); cùng một helper cho cả hai chỗ nên toast chỉ vẽ đúng 1 lần mỗi khung hình (không vẽ trùng khi không có splash; không vẽ đè lên panel khi mở modal; thôn không đổi vì `v47tIsActive()`).
**Kiểm tra (ảnh thật, đường đi thật):** probe Playwright `/tmp/probe_m09.py` — vào thôn, tới cổng thôn, `v47tInteract()` → `v47tExit()` ra Thanh Trúc Lâm (worldTitle=3.5 + toast thật). Trước sửa, lúc splash đậm (worldTitle≈2,8–3,5): toast chỉ còn ~10px mép trên, tỉ lệ điểm ảnh tối trong dải toast 0,42 (thôn 0,918) — ảnh `ops/specs/img/m09b_toast_truoc_splash.png`. Sau sửa, cùng thời điểm: toast "Vạn Linh Phổ · đã ghi nhận Hắc Chu · F3" hiện rõ TRÊN ảnh splash, tỉ lệ 0,919 — ảnh `ops/specs/img/m09b_toast_sau_splash.png`. Toast trong thôn không đổi (0,918, ảnh `ops/specs/img/m09b_toast_thon.png`). `test_suite.py --compare`: 8/8 ĐẠT, 0 lỗi console, 14 GIỐNG / 0 KHÁC (3 ảnh perf_* MỚI có từ M02, không phải lỗi) — không cần làm mới baseline vì suite chụp sau khi hết splash.
**Chưa làm / không chắc:**
- (a) viền chữ 3px đã làm ở `1bb002b` TRƯỚC khi M09 được giao (tên nhân vật vẫn giữ `v18Title`, chưa stroke) — vẫn chờ Claude xác nhận có tính là xong M09a không; không làm lại trong M09b.
- (c) tên vùng 3,0s chấp nhận, không sửa `owTitle` — đã ghi chú, không sửa.
- Toast vẽ lại dùng `v45Hub()`/`v34Target()` tính lại trong `worldDraw`; giá trị khớp với `v35Render` cùng khung hình (world=true) nhưng nếu sau này hai đường tính khác nhau thì toast có thể lệch y100/y150 trong đúng khung splash.
**Việc tiếp theo:** theo thứ tự mới của Claude (07:21): M09 → T25b → M08 → T20 → M05 → M03 → M06 → M07. T25b đã REVIEW nên sau khi Claude duyệt M09 thì làm M08 (profile CPU sân luyện).

### [2026-11-21] M09a — stroke tên nhân vật — Muse
**Đã làm:** Chủ dự án dặn stroke luôn tên nhân vật. `v45Name` (src/47) trước đây vẽ tên bằng `v18Title` (chỉ có bóng, không stroke) trong cả 3 nhánh (1 dòng / cắt '…' / 2 dòng). Sửa: thêm helper `v45NameText` (Serif bold, strokeText ink 3px alpha 0.8 rồi fillText, giống `v45Text` nhưng giữ font Serif) và thay cả 3 lời gọi `v18Title` trong `v45Name` bằng `v45NameText`. Không sửa `v18Title` (dùng chung cho mọi tiêu đề panel/tên vùng — ngoài phạm vi M09a). `v45Name` chỉ gọi từ `v35Identity` nên một chỗ sửa phủ cả hai đường vẽ (thôn `v47tDraw` + ngoài thôn `v35Render`).
**Kiểm tra:** ảnh thôn `ops/specs/img/muse_test.png` — tên "Vô Danh" giờ có viền mực, đọc rõ trên nền lá sáng; cụm danh tính còn lại không đổi. `test_suite.py --compare`: 8/8 ĐẠT, 0 lỗi console, 14 GIỐNG / 0 KHÁC (viền tên đổi <2% điểm ảnh nên không cần làm mới baseline). `node --check` OK.
**Chưa làm / không chắc:** M09a coi như đủ (tên + cảnh giới/CL/HP/MP/tu vi đều đã có viền 3px); chờ Claude duyệt M09 để làm M08.
**Việc tiếp theo:** theo thứ tự mới của Claude (07:21): M09 → T25b → M08 → T20 → M05 → M03 → M06 → M07. M09 và T25b đều REVIEW, sau khi Claude duyệt thì làm M08 (profile CPU sân luyện).

### [2026-11-21] M08 — Profile CPU: thủ phạm tụt FPS ở Sân Luyện Kiếm — Muse
**Đã làm:** Chỉ đo, không sửa code game. Viết `tools/profile.py` (CDP `Profiler` qua Playwright, V8 sampling ~1kHz, 10s mỗi nơi, 1280×720, Đồ họa Cân bằng mặc định) + đo thêm FPS ở 1920×1080 với Đồ họa Cân bằng (q=1) và Cao (q=2, đặt qua `v41ApplyQuality` trong console). Xuất `tests/perf_profile.md` (top 15 theo self + top 15 theo total mỗi nơi, kèm file:dòng, ★ = hàm trong `ops/OVERRIDES.md`).
**Kết quả — thủ phạm là `CanvasRenderingContext2D.restore()` (native), 7510ms self = 74,31% thời gian CPU trong 10s ở sân luyện, so với 6,7ms ở thôn.** `frame` total 85% ở sân luyện so với 9% ở thôn; `worldDraw` total 84%. Probe quy về hàm JS gọi `restore()`: `v17House` (`src/32_env_assets.js:232`, ★ OVERRIDES) 4813ms, `v41aRig` (`src/28_v41_v25.js:31`) 1596ms, `v42eSprite` (`src/32_env_assets.js:239`) 611ms. Đếm trực tiếp: sân luyện 415 cặp save/restore + 151 `drawImage` mỗi khung hình, thôn chỉ 96 cặp + 5 `drawImage`. Điểm lạ: số mẫu `restore` 6084 so với `save` chỉ 69 (dù số lần gọi bằng nhau) — mỗi lần `restore()` ở sân luyện tốn ~86µs, ở thôn ~0,1µs, tức không chỉ nhiều lần gọi mà mỗi lần gọi cũng đắt hơn; nguyên nhân chưa xác minh, để Claude soi ở T08.
**FPS 1920×1080 (RS.k thực tế = 1,5 ở cả hai cài đặt — tỉ lệ hiển thị 1920/1280 = 1,5, Cao chỉ nâng giới hạn lên 2; khác nhau là maxParticles [78/116] và maxEvents [22/26]):** Cân bằng — thôn 59,33, sân luyện 14,2; Cao — thôn 58,9, sân luyện 15,5 (đều không đánh, 10s). So với M02 ở 1280×720: thôn 60,6, sân luyện 21,3. Chất lượng đồ họa gần như không ảnh hưởng FPS sân luyện → tụt FPS không phải do hạt/hiệu ứng mà do đường vẽ thôn cũ.
**Kiểm tra:** `tools/profile.py` chạy trọn vẹn 2 lần (lần 1 phát hiện `Profiler.stop` trả về `{"profile": ...}` nên 0 mẫu — đã sửa thành `.get("profile", {})` rồi chạy lại); `python3 tools/test_suite.py --compare` sau khi xong: 8/8 ĐẠT, 0 lỗi console, 14 GIỐNG / 0 KHÁC (3 ảnh perf_* MỚI có từ M02). `node --check` không cần (chỉ thêm file tools mới). Không sửa `src/`, `index.html`, `data/`, `assets/`, `tools/perf.py`, `tools/test_suite.py`.
**Chưa làm / không chắc:**
- Chưa xác minh được tại sao mỗi lần `restore()` ở đường vẽ thôn cũ đắt hơn hẳn ở thôn V47T (nghi do state lưu/khôi phục khác nhau — ảnh nhà lớn, `imageSmoothingQuality`, `globalAlpha`, `globalCompositeOperation='screen'` ở đèn đêm — hoặc raster bị dồn và xả ở `restore()`); cần Claude kiểm tra ở T08, và kiểm chứng lại FPS thật (F7) trên máy có GPU vì headless SwiftShader có thể phóng đại chi phí state của canvas.
- `v15Sprite` total 3404ms (33,7%) và `draw` (`src/04_v11_v46.js:61`) total 3387ms là hai nhánh con lớn nhất dưới `worldDraw` — đã ghi trong báo cáo để T08 soi cùng.
**Việc tiếp theo:** theo gói G01 (MUSE_BATCH_01.md): làm T20 (bản đồ thủy mặc) tiếp, rồi M05 → M03 → M06 → M07. M09 và T25b vẫn đang REVIEW chờ Claude.

### [2026-11-21] GÓI 01 (T17, T31, T23, T30) — ChatGPT (Claude ghi hộ + review)
**ChatGPT nộp:** `data/techs.js` (30), `data/equipment.js` (20), `ops/specs/techs_ui.md`, `ops/specs/interior.md`, ảnh `interior_inn_concept`, `data/dialogues.js` (12 NPC, 26 lần gặp); báo cáo `ops/chatgpt/BATCH_01_REPORT.md`.
**Review Claude: cả 4 ĐẠT → DONE.** Kiểm tự động: techs 30 (phẩm 8/8/7/7, loại 8/7/7/8, mỗi phái 4), không trùng id, đúng stat + giới hạn cân bằng; equipment 20 (8/6/6), không trùng tên 63 món, icon hợp lệ, đỉnh chỉ +2–4%; dialogues inn/shop giữ nguyên từng chữ, 10 NPC × 2 lần gặp, đồ thị sạch, lần đầu luôn `talked`. Ảnh concept 3/4 đúng phong cách (đổi sang WebP 405 KB). Lời thoại khớp vai trò thật dù bảng NPC Claude gửi bị trống (lỗi trích xuất của Claude).
**Phụ lục** `ops/specs/batch01_addendum.md`: bảng NPC thật; DUYỆT migration thiện cảm; đơn vị `currentStats`; cách nối trang bị (kiểm `EQUIPMENT.length===63`); công pháp mới lưu riêng `p.techRanks/p.techEquipped`; nguồn nhận (inn, boss vùng, pool rơi); toạ độ thật V36 cho T24.

### [2026-11-21] GÓI 02 (T32–T38, T23b) — ChatGPT (Claude ghi hộ + review)
**ChatGPT nộp:** `data/quests.js` (5 chương, 8 chữ bước cũ, 18 bước chính m09–m26, 10 phụ tuyến), `data/bestiary.js` (25 quái + 15 boss), `data/events.js` (24 kỳ ngộ), `data/lore.js` (63 trang bị, 14 linh bảo, 9 công pháp, 11 bộ, 10 vùng, 4 tông, 3 phái, 40 mẹo); spec `story.md`, `boss_intro.md`, `panels_ui.md`, `menu_ui.md`, `breakthrough.md`; 5 ảnh (key art menu + 4 phòng); báo cáo `ops/chatgpt/BATCH_02_REPORT.md`.
**Review Claude: cả 8 ĐẠT → DONE.** Kiểm tự động 0 lỗi: id duy nhất; mọi npc/vùng/poi có thật; minLevel tăng dần, không vùng nào vượt cấp; boss đủ 8 vùng; thưởng trong trần; tên quái/boss khớp `TYPES`, mã đòn khớp `V27_BOSS`; kỳ ngộ đủ 9 vùng (≥2), effect đúng enum/giới hạn, xác suất <1 đều có `fail`; lore đủ khoá, thơ 6–8 chữ, mẹo không bịa phím. Ảnh 4 phòng cùng bố cục với `inn`, đúng chủ đề; key art có vùng trái tối cho menu.
**Phát hiện:** `openEvent()` không được gọi ở đâu — kỳ ngộ cũ là code chết → T41 dựng cách kích hoạt (phụ lục §3).
**Phụ lục** `ops/specs/batch02_addendum.md` + việc code mới T39–T45 (Muse), T46 (Claude).

### [2026-11-21] T20 — Bản đồ thế giới Sơn Hà Đồ — Muse
**Đã làm:** Code bản đồ thế giới theo spec `ops/specs/world_map.md` v1.2 + phụ lục `ops/specs/world_map_addendum.md` (bắt buộc), không sửa hàm của Claude ở T07/T08/T09, không đổi save key, không thêm ảnh base64 vào code:
- `src/47_v45_v35.js`: thay toàn bộ thân `v22Atlas()` (1 định nghĩa duy nhất, đã kiểm tra `ops/OVERRIDES.md` — không bị vá chồng) bằng bản thủy mặc + helper mới trong file 47: `V22_MAP_UI` (trạng thái hover, cache gradient sương), `v22Ink()` (tạo `Image` từ `ASSETS["world_map_ink"]`, cache trong `imgs.world_map_ink`), `v22MapData()` (kiểm tra `DATA.world_map` version 1 / 10 địa danh / 13 đường / mọi region có trong `V22_REG`, sai thì vẽ dòng lỗi theo spec §4), `v22NodeXY()` (aspect-fill §2.3: s=max(856/1586,536/992), gốc căn giữa), `v22Ring()`, `v22Corners()` (góc L 17px), `v22Tab()`, `v22ActionBtn()`, `v22StatusText()` (ưu tiên: Đang ở đây > Vùng an toàn > Đã khám phá > Chưa khám phá), `v22SealOk()` (kiểm `document.fonts.check`, fallback dấu chấm §2.4), `v22LabelLines()` (tên tối đa 2 dòng). Bản đồ vẽ: overlay mực alpha 0,55; khung (24,24,1232,672) mực 0,92 + viền vàng + góc; tiêu đề "Sơn hà đồ" V18Serif 28px vàng; phụ đề "Đã khám phá N / 10 địa vực" (theo phụ lục, thay "Địa đồ thiên hạ"); tab Thanh Thạch (880,42,112,40) / Sơn Hà Đồ (1000,42,116,40) / Đóng [Esc] (1124,42,108,40); ảnh bản đồ (48,106,856,536) aspect-fill, fallback nền giấy, có clip; 13 đường nét đứt (mực 0,50, 2px, dash 6/5) từ `DATA.world_map.paths`; sương mù (gradient tròn mực 0,65 r22 → 0 r42, cache theo node) trên vùng chưa khám phá trừ vùng hiện tại; ấn 22×22 (hiện tại ngọc, đã khám phá đỏ alpha 0,85 + ký tự ấn, chưa khám phá mực 0,82 + "?", đang chọn vòng vàng 36px + viền mực 1px, hiện tại vòng vàng 32px, hover vòng mực 32px); nhãn LUÔN hiện đủ tên (nền giấy 0,94, viền đỏ 1px, mực 13px bold, đặt trên/dưới/phải/trái, cách ≥4px, ưu tiên hiện tại → đang chọn → hover → thứ tự dữ liệu); click node/nhãn chỉ đổi lựa chọn; tooltip sau 180ms hover (tên 14px + trạng thái 12px, kẹp trong (56,114)…(896,634)); panel chi tiết (924,106,308,536): nhãn "Địa danh", tên (24px, 20px nếu cần, tối đa 2 dòng), dòng trạng thái, cảnh báo đỏ "Cấp đề nghị X–Y · nguy hiểm" khi `min > p.level`, các dòng theo `V22_REG` (Cảnh giới, Chiến lực gợi ý, Tài nguyên, Boss kèm trạng thái hồi sinh theo phụ lục — thôn không có dòng Boss vì boss null, Phẩm chất rơi đồ qua `QUALITY[qlo]–QUALITY[qhi]`, bằng nhau thì hiện một), mô tả wrap tối đa 5 dòng, hai nút 130×48 ở y558 (Dẫn đường tắt ở vùng hiện tại theo spec; Khám phá luôn bật theo phụ lục, `modal=null; v48xEnter(id)`), gợi ý "Chọn địa danh để dẫn đường"; chú giải đúng 4 nhóm (Hiện tại ngọc, Đã khám phá đỏ, Chưa khám phá mực + "?", Đường đi nét đứt) + hướng dẫn phải "Chọn địa danh · Esc: Đóng". Tab "Thanh Thạch" (bản đồ thôn `v45TownMap`) giữ nguyên, không đổi.
- `index.html`: thêm `<script src="data/world_map.js"></script>` ngay dưới `data/00_init.js` (dòng 95).
- Sửa sau kiểm chứng: dòng "Phẩm chất rơi đồ" trước đây ngắt tên giữa chừng ("Thiên phẩm–Hỗn" / "Độn") vì cột giá trị hẹp (~150px) — giờ nếu giá trị vừa 1 dòng thì viết cùng hàng với nhãn, nếu dài thì xuống dòng lấy đủ rộng 268px (không cắt tên phẩm chất nữa).
**Kiểm tra (ảnh thật, Playwright Chromium headless 1280×720, trước khi môi trường hỏng — xem mục "Chưa làm"):** probe `/tmp/probe_t20.py`: vào thôn (cấp 1, `discovered=['thon']`), bấm M (map mở, `modal.kind='map'`), bấm tab "Sơn Hà Đồ" → `modal.v16Map='world'`, ảnh mực `ready=true`, dữ liệu OK (10 địa danh, 13 đường); bấm node Ma Vực (622,5, 245,4) → `v22Selected='ma'`; bấm node Tử Lôi (772,5, 482,3) → `v22Selected='loi'`; Esc đóng modal (`modal=null`). **0 lỗi console/pageerror.** Ảnh đã xem: thôn đang chọn (Dẫn đường tắt đúng, Khám phá vàng); Tử Lôi đang chọn (trạng thái "Chưa khám phá", cảnh báo đỏ "Cấp đề nghị 41–45 · nguy hiểm", tooltip "Tử Lôi Hoang Nguyên / Chưa khám phá"); Ma Vực đang chọn (cảnh báo đỏ "Cấp đề nghị 37–40 · nguy hiểm", Boss "Ma Vực Tôn Giả · Sẵn sàng"); tab thôn cũ không đổi (layout V45 nguyên). Ấn 村 trên ấn ngọc hiện đúng. Sương mù hiện dưới các ấn "?". Đủ 13 đường nét đứt (kể cả dọc thon↔tuyet, truc↔tram, yeu↔hoa, ma↔quy, phong↔loi). Probe `/tmp/probe_t20b.py`: bấm Khám phá ở Thanh Trúc Lâm → `V48X.active=true, mapId='truc'`, toast "Khám phá · Thanh Trúc Lâm — WASD/click để đi, E để khảo sát, ESC để thoát". Probe `/tmp/probe_t20c.py` (chạy được phần đầu trước khi hỏng): Dẫn đường từ thế giới mở (Thanh Trúc Lâm → Vạn Yêu Sơn) CÓ tác dụng — ảnh `t20_guide_world.png` (chưa copy vào repo, còn ở /tmp) cho thấy toast "Dẫn đường tới cổng · Vạn Yêu Sơn", cảnh báo "Cẩn thận · Vạn Yêu Sơn đề nghị cấp 10", nhân vật đang đi theo đường dẫn tới cổng; trong thôn thì `v8SetGoal` không tìm được lối đi (hành vi cũ của V45 — phải ra khỏi thôn trước, không phải lỗi T20). Ảnh 3 trạng thái đã copy vào `ops/specs/img/`: `t20_map_thon.png` (đang ở thôn), `t20_map_undiscovered.png` (chọn Ma Vực chưa khám phá), `t20_map_lowlevel.png` (chọn Tử Lôi dưới cấp, cảnh báo đỏ + "Phẩm chất rơi đồ Thiên phẩm–Hỗn Độn" đã đủ 1 dòng sau sửa). `node --check src/47_v45_v35.js` OK.
**Chưa làm / không chắc (quan trọng — môi trường VM hỏng từ ~08:05 UTC, sau khi kiểm chứng xong):**
- `python3 tools/test_suite.py --compare` CHƯA CHẠY ĐƯỢC: Chromium chết lúc khởi động (SIGTRAP, có lúc SIGILL) — cả bản headless shell lẫn bản đầy đủ, cả `--no-sandbox --disable-gpu --no-zygote --single-process`, cả `--user-data-dir` trên home; `--version` vẫn chạy được, `ldd` đủ lib, numpy/AVX vẫn chạy. Đồng thời tiến trình con ghi file thường bị EPERM theo từng đợt (vài phút tốt, vài phút xấu — `write()` trả EPERM, có lúc tiến trình bị giết SIGTRAP; chỉ shell trực tiếp của lệnh exec ghi được); `python3 -m playwright install chromium` lỗi `EPERM: operation not permitted, write` ngay từ đầu. Server `http.server` chạy bằng `nohup &` cũng bị đơ (chấp nhận kết nối nhưng không trả lời) — đã giết các server cũ và chạy lại 8123 đúng cách (lệnh chính của exec, session `proc_2ceb5d4cd4c4`), curl lại 200. Trong lúc chẩn đoán đã xóa thư mục `~/.cache/ms-playwright/chromium_headless_shell-1255` để cài lại mà không cài được — **cần chạy lại `python3 -m playwright install chromium` khi môi trường hồi phục, rồi chạy test_suite --compare để kiểm tra hồi quy.**
- Checklist §6 còn thiếu: test_suite hồi quy (như trên); bản đồ ở 1366×768 và 1920×1080 — hai ảnh chụp ở hai cỡ đó (`/tmp/t20_1366.png`, `/tmp/t20_1920.png`) thực ra là màn hình tạo nhân vật (click "Nhập thế" trượt ở độ phân giải khác), không phải bản đồ; FPS lúc mở bản đồ chưa đo. Lưu ý: scenario 05 của suite mở bản đồ thôn (tab local, không đổi) nên nguy cơ hồi quy thấp, nhưng chưa có số liệu.
- Dẫn đường từ trong thôn không đặt được route (đã giải thích ở trên — hành vi V45 cũ, không đổi).
**Việc tiếp theo:** theo gói G01: làm M05 (bản đồ dead-code) tiếp, rồi M03 → M06 → M07 — NHƯNG M05 cần test_suite chạy được nên có thể phải chờ môi trường hồi phục (cài lại Chromium + chạy suite) trước. Nhờ Claude xem có cách khác để kiểm chứng (hoặc duyệt T20 theo bằng chứng ảnh hiện có) rồi hãy làm M05.

### [2026-11-21] T20 — kiểm chứng test_suite sau khi môi trường hồi phục — Muse
**Đã làm:** Sau khi runtime restart, git ghi object và Chromium chạy lại được (cài lại pip playwright 1.65.2 + `playwright install chromium` cho headless shell đã mất). `git fetch` + `git reset --hard origin/main` (14eacae, cây sạch — đã kiểm chứng 8 file T20 khớp remote từng byte/blob). `tools/test_suite.py --compare`: 3 lần chạy đều **8/8 ĐẠT, 0 lỗi console**; 2 lần đầu 13 GIỐNG / 1 KHÁC (`02_enter_cls1_body.png` 4,35–4,87%), lần 3 sau khi làm mới baseline ảnh đó: **14 GIỐNG / 0 KHÁC**.
**Nguyên nhân 1 KHÁC (không phải hồi quy T20):** ảnh baseline cũ của Thể Tu chụp lúc HUD đang ở trạng thái fade mờ (T11 bước 6: HUD mờ dần khi không thao tác) — so sánh theo vùng: cảnh thôn 0,00–0,16%, nhân vật 0,00%, còn panel minimap 41,6% và quest 51,1% lệch do nền panel mờ hơn hẳn (quest: RGB 122 so với 84). Hai lần chạy mới đều chụp lúc HUD đủ độ đậm, khớp nhau. Đã làm mới chỉ `tests/baseline/02_enter_cls1_body.png` (ảnh cũ là trạng thái thoáng qua, như tiền lệ M04 làm mới baseline sau splash). **Đề xuất:** suite nên chờ HUD hết fade trước khi chụp (wait_settled hiện chỉ đợi transition/worldTitle) — để M06 hoặc Claude xem.
**Việc tiếp theo:** M05 theo gói G01.

### [2026-11-21] M05 — bản đồ code chết (Coverage) — Muse
**Đã làm:** Viết `tools/coverage.py` (chỉ đọc, không sửa code game) và xuất `tests/coverage.md` (1392 dòng). Lưu ý kỹ thuật: Playwright Python 1.65.2 **không có** `page.coverage` nên dùng CDP trực tiếp qua `page.context.new_cdp_session(page)` — `Profiler.startPreciseCoverage({callCount: true, detailed: true})` trước khi load trang, `takePreciseCoverage` ở 5 mốc (sau 7 kịch bản, sau 8 kịch bản, sau sân luyện, cuối), gộp theo URL lấy max count. Tái dùng `Suite` của `tools/test_suite.py` (8 kịch bản M01) + sân luyện F6 như `tools/perf.py` + ra thế giới mở qua cổng thôn thật + mở tab Sơn Hà Đồ + đánh quái ở Thanh Trúc Lâm. Hàm "không chạy" = quét định nghĩa hàm trong nguồn (8 mẫu regex, gồm `name: function` và arrow) rồi đối chiếu CDP: hàm chạy ⇔ `ranges[0].count > 0`; hàm trong `ops/OVERRIDES.md` đánh dấu ★.
**Hai lỗi phương pháp đã sửa trong lúc làm:** (1) Byte coverage ban đầu ra 97,6% trong khi 841 hàm không chạy — vì range của hàm cha bao trùm cả hàm con một dòng; đã sửa: trừ span của mọi hàm khác trong cùng file trước khi hợp nhất (chạy thử 4 lần sau sửa: 43,3–43,9%, ổn định). (2) Scanner đếm trùng định nghĩa (`const dustRand=()=>` khớp 2 mẫu) và bỏ sót method dạng `name: function(){}` — đã sửa bằng loại trùng theo span + thêm mẫu; số hàm quét cuối: 1956.
**Kết quả (lần chạy cuối, 2026-11-21 ~18:35 VN):** 51 file `src/`, tổng 1.208.858 byte, đã chạy 527.405 byte (**43,6%**). Hàm: 1956 quét được, 931 đã chạy, **886 không chạy**, 139 không có dữ liệu CDP, trong đó **203 ★ OVERRIDES không chạy** (đa số là lớp cũ bị lớp sau ghi đè — đúng đối tượng gộp của Claude; vd `gainXP` ở `01_core.js:198` là lớp gốc, lớp live ở `14_v22_v23.js:27` vẫn chạy). File chết nhất: `42_cultivation_ui.js` 3,4%, `43_sect_ui.js` 4,0%, `45_v43_v42.js` 13,0%, `36_hud.js` 15,9% (giao diện tu luyện/môn phái chưa mở trong lần chạy này — xem mục Giới hạn trong báo cáo trước khi kết luận chết thật). **Bằng chứng chạy:** 8/8 ĐẠT, 0 lỗi console; sân luyện hits 0→72, sát thương 0→1501; cổng thôn ra `truc` OK; đánh quái kills 0→5, quái sống 171→167, cấp 1→3. `tools/test_suite.py --compare`: **8/8 ĐẠT, 0 lỗi, 14 GIỐNG / 0 KHÁC** (2 MỚI chỉ là ảnh `cov_f2.png`, `cov_worldmap.png` của lần chạy coverage, gitignored).
**Chưa chắc:** Lần chạy 3 có hiện tượng lạ không giải thích được (quái sống 171→10, HP người chơi tăng, lên cấp chỉ với +7 tu vi) — đã thêm lấy mẫu 2s/lần (HP/cấp/tu vi/kills/số quái/mapId) và chạy lại 2 lần: hiện tượng **không tái hiện** (map luôn `truc`, số quái giảm đúng bằng số kills), nên khả năng là nhiễu một lần, **không coi là sự thật của game**. Số liệu coverage dao động nhẹ giữa các lần chạy (RNG có seed, quái/NPC di chuyển) — con số trên là lần chạy cuối.
**Việc tiếp theo:** M03 theo gói G01 (hiển thị ở 3 kích thước màn hình).

### [2026-11-21] M03 — Soát lỗi hiển thị ở 3 cỡ màn hình — Muse
**Đã làm:** Probe `/tmp/probe_m03.py` (tái dùng `Suite` của `tools/test_suite.py`: seed 20261121, `worldTime=145`, chờ transition/worldTitle + ảnh ổn định; click theo tọa độ logic 1280×720 đổi sang CSS px qua rect thật của canvas) chạy 7 màn M01 (menu, tạo nhân vật, thôn, bản đồ thôn, Sơn Hà Đồ, túi đồ, nhật ký) ở 4 cấu hình: 1280×720, 1366×768, 1920×1080 (Cân bằng) và 1920×1080 Cao (q=2). **0 lỗi console/pageerror ở cả 4.** Xem toàn bộ 28 ảnh + 6 ảnh hover dock + 4 ảnh toast theo thời gian. Xuất `tests/hud_issues.md`.
**Kết quả: 5 lỗi HUD đã biết đều đã hết ở cả 4 cấu hình — không còn lỗi chồng/cắt chữ nào, không sửa code game.**
- (1) "Tu vi 0/40" đè dòng cảnh giới + khung đen: hết — cụm danh tính không khung đen, tu vi chuyển xuống giữa đáy (T11).
- (2) "Con mắt": không phải lỗi (con trỏ chuột của game, đã ghi trong TASKS).
- (3) Dock nhãn cắt "Âm t…": hết theo hướng thiết kế mới (T11) — dock chỉ còn icon + huy hiệu phím; nhãn đầy đủ trong tooltip khi hover, đã kiểm chứng ở 1280 ("Âm thanh", "Cài đặt · Esc", ảnh `ops/specs/img/m03_tooltip_caidat.png`).
- (4) Nút Menu chữ "MENU" thừa: hết — chỉ còn icon hamburger.
- (5) Tên vùng chồng "Khu vực an toàn": hết — hai dòng riêng (dòng an toàn ở trên).
**Ghi chú mỹ thuật/hành vi (không sửa):** (C1) chú giải "Đường đi" trong Sơn Hà Đồ sát mép dưới khung (đã ghi từ T20, đủ 3 cỡ); (C2) nhãn địa điểm trên ảnh bản đồ thôn tương phản thấp ở 1280 (nhất là "Cổng Thanh Trúc Lâm" trên quầng sáng cổng) — chữ trên ảnh nền, không phải HUD bị cắt; (C3) HUD mờ dần khi ~6s không thao tác (T11 bước 6) — đã xác minh bằng thời gian ở 1920 (t0 đủ đậm + toast còn, t6 HUD mờ + toast mất, ảnh `m03_1920_hud_fade.png`); là tính năng nhưng làm nhiễm ảnh kiểm thử (đúng vụ baseline Thể Tu ở T20) — nhắc lại đề xuất: suite/probe nên quơ chuột hoặc chờ hết mờ trước khi chụp; (C4) 1920q2 giống hệt 1920 q=1 từng byte (md5 `cb38aa81…`) — q chỉ đổi maxParticles/maxEvents, `RS.k` vẫn 1,5 (k=2 cần viewport ≥2560), nên các panel q2 không chụp riêng.
**File đã tạo/sửa:** `tests/hud_issues.md` (mới), 6 ảnh chứng cứ `ops/specs/img/m03_*.png`, `.gitignore` (+1 dòng `tests/out/m03/` — 55MB ảnh chụp đợt này không commit, cùng kiểu M04 đã làm với `tests/out/*.png`), `tests/out/report.md` (suite chạy sau M03). Ảnh gốc 28+10 ảnh ở `tests/out/m03/` (gitignored). Không sửa `src/`, `index.html`, `data/`, `assets/`, `tools/`.
**Kiểm tra:** `tools/test_suite.py --compare` sau khi xong: **8/8 ĐẠT, 0 lỗi, 14 GIỐNG / 0 KHÁC** (2 MỚI là ảnh `cov_*.png` cũ của M05, không liên quan).
**Chưa làm / không chắc:** Chỉ soát màn M01 — chưa soát HUD chiến đấu ngoài thôn (T12), sân luyện, nội thất, tooltip minimap/quest, F2 tùy chỉnh HUD, và phái Thể Tu/Pháp Tu ở màn tạo nhân vật (chỉ chụp mặc định Kiếm Tu, nhưng cả 3 thẻ phái + bảng chỉ số đều hiện trên cùng màn nên đã thấy đủ).
**Việc tiếp theo:** M06 theo gói G01 (kịch bản chiến đấu cho test_suite).

### [2026-11-21] M06 — Kịch bản chiến đấu cho test_suite (9–12) — Muse
**Đã làm:** Chỉ sửa `tools/test_suite.py` (+ `tests/`), không sửa code game. Thêm 4 kịch bản (12 kịch bản, 18 ảnh): (9) ra thế giới mở qua cổng thôn thật (`V47T` tới `V47T_MAP.gates[0]` + `v47tInteract()`), đánh 1 quái bằng đánh thường (click trái) + kỹ năng chuột phải, kiểm tra quái mất máu (mẫu HP quái đang click + kills); (10) đứng yên để quái đánh trúng, kiểm tra HP giảm ≥3 và số bay đỏ '-N'; (11) sân luyện F6 vào/ra (nhại `tools/perf.py`: F6 lần 1 dẫn đường, lần 2 bắt đầu khi `v42tNear(0)`, click mộc nhân qua `hdPoint`, ra bằng F6 mở bảng báo cáo + nút "Kết thúc luyện tập" (1152,667)); (12) mở/đóng Tùy chỉnh HUD F2 (`v35Editing()` + `modal='hud35'`, đóng bằng ESC). Tái dùng `Suite` (seed 20261121, `worldTime=145`, `wait_settled`, `_wake_hud` chống HUD fade T11).
**Cơ chế game đã xác minh bằng probe (không sửa code):** kỹ năng thật là `v11Cast` (lớp V11/V26, ghi đè `cast` V10 ở `src/06`): chỉ nổ khi `v26CanAct()` — tức `p.hurt<=0` (sau mỗi lần bị đánh `hurt=0,46s`), không có đòn V26 đang vận chưa trúng, hồi chiêu V11 (`v11Cooldowns()[0]`) đã hết; `p.v10SkillCd` chỉ được đặt lúc trúng đòn (0,17s sau, timing `V26_SKILL_TIMING.blade=[.43,.17]`) nên nhận biết kỹ năng nổ bằng `V26.action='skill'` hoặc `castT>0` ngay sau click (v11Cast đặt `castT=0,43` đồng bộ), `p.v10SkillCd` chỉ là xác nhận phụ. Vì vậy kịch bản 9 chờ đúng cửa sổ `hurt==0` (poll 50ms, tối đa 4s) mới bấm chuột phải, thử tối đa 6 lần. Quái: `v27AI` truy đuổi khi <330px + có tầm nhìn, tấn công khi <tầm đánh + `cd==0`; vùng an toàn thôn chặn mọi sát thương (`damagePlayer`/`v27Damage` return sớm khi `regionAt(p)==='thon'`); quái hồi sinh sau 45s.
**Các bẫy đã gặp và cách xử lý (đều trong test, không sửa game):** (1) Lần chạy đầu người chơi chết giữa trận 9 (đứng yên, bị quái vây — đã thấy HP 45/107 ngay sau khi dịch) → hồi sinh ở thôn, làm hỏng cả 9 lẫn 10: giờ hồi đầy HP trước trận và khi HP<50 trong trận (ghi rõ số lần hồi trong bằng chứng); kịch bản 10 tự ra lại cổng thôn nếu mở đầu đã ở thôn. (2) "Quái gần nhất" có thể là boss xa (type 14, 2463 HP, vùng Tuyết) — dịch tới thì bị game đưa về thôn: giờ chỉ đánh quái hợp lệ (không boss `max<500`, cùng vùng `truc`, <1500px; `FIGHT_TARGET_JS`/`CANDIDATES_JS`), dịch lại gần khi cách >150px (tầm đánh thường ~123). (3) Modal bật lên giữa trận (Sơn Hà Ký `v42world` khi click trúng nút/bia đá, modal thưởng 12% khi hạ quái) chặn mọi click chiến đấu (`pointerdown` bỏ qua khi modal mở, `owUpdate` dừng combat) — đã thấy kỹ năng không nổ 4/4 vì modal `v42world` mở từ đầu trận (probe M06i): thêm `_close_modal()` (ESC, lặp tối đa 3 lần vì ESC có lúc mở nhầm Cài đặt) gọi mỗi vòng đánh và đầu kịch bản 10. (4) Bấm E bằng `keyboard.press` có lúc không ăn (nhả phím trước khi khung hình đọc `pressed.KeyE`): giờ dùng down/wait 150ms/up; về thôn qua cổng cũng có đường dự phòng `v48tTravel()` và trường hợp đã ở thôn thì bỏ qua. (5) Kịch bản 12 từng bấm ESC 2 lần (1 trực tiếp + 1 trong `close_modal`) nên lần 2 mở nhầm Cài đặt: giờ chỉ dùng `_close_modal()` (chỉ bấm khi modal còn mở). (6) Ảnh chiến đấu 09/10/11 KHÔNG so pixel được: cảnh động (vị trí quái sinh/di chuyển, vị trí nhân vật, số bay, HP) nên luôn KHÁC (09 ~27%, 10: 31–65%, 11: ~17% qua 2 lần chạy) dù game không đổi — đã thêm `DYNAMIC_SHOTS` vào `compare_images()` (báo "ĐỘNG — không so pixel", không tính GIỐNG/KHÁC); 3 ảnh này vẫn giữ trong `tests/out/` làm bằng chứng hình ảnh, KHÔNG đưa vào `tests/baseline/` (đã xóa khỏi baseline); ảnh 12 (panel tĩnh) vẫn so bình thường. Đã xóa 2 ảnh `cov_*.png` cũ của M05 khỏi `tests/out/` (không phải ảnh của suite, làm nhiễu compare).
**Kiểm tra (2 lần chạy liên tiếp với code cuối, Playwright Chromium headless 1280×720): 12/12 ĐẠT, 0 lỗi console/pageerror; compare 15 GIỐNG / 0 KHÁC / 3 ĐỘNG.** Lần chạy cuối: (9) kỹ năng nổ lần thử 4 (`V26.action=skill`, `castT` sau 200ms=0,23, hồi chiêu sau 600ms=1,55s, MP 130→110), kills 0→4, tu vi 49, hồi HP 3 lần; (10) quái type=0 HP 27/66 cách 418px, HP 46→38, số bay ['-10','-8'] (có kích 1 đòn trước khi bị đánh ở lần chạy trước; lần này bị đánh ngay khi đứng yên); (11) vào sân sau 13,6s, hits 0→27, sát thương 636, ra sạch (`active=False`, `modal=None`, về V47T thôn); (12) mở `editing=True modal=hud35`, đóng ESC `modal=None editing=False`. Chỉ thêm 1 ảnh baseline mới: `tests/baseline/12_hud_edit.png` (panel tĩnh, ổn định); 14 ảnh cũ đều GIỐNG.
**Chưa làm / không chắc (để Claude xem):** (a) Kỹ năng vẫn có tính may rủi nhỏ: lần thử 1 đã "sẵn sàng" (hurt=0, đủ điều kiện) nhưng không nổ — khả năng quái đánh trúng đúng ~16ms sau click (đặt lại `hurt>0` trước khi frame tiêu thụ `mouse.cast`); hiện thử tối đa 6 lần/trận, 2 lần chạy cuối nổ ở lần 2 và lần 4 — đủ ổn nhưng nếu sau này trận đông quái hơn thì có thể cần tăng số lần thử hoặc đặt `p.hurt=0` ngay trước click (chưa làm, vì đó là can thiệp sâu hơn vào trạng thái game). (b) Có 1 lần quan sát quái đứng yên ở chế độ 'wind' 23s không đánh (probe M06, quái type 5 HP 113, cách 80px, có tầm nhìn, vùng truc — không phải do vùng an toàn) — chưa xác định được nguyên nhân (có thể `a.action` null hoặc `v27Tick` không chạy cho con đó); kịch bản 10 đã tránh bằng cách thử 3 ứng viên khác nhau + kích 1 đòn, nhưng nếu đây là lỗi AI thật thì nên có task riêng điều tra (gợi ý probe lấy mẫu `a.t`/`a.action`/`e.timer` của quái bị đứng). (c) Click chuột trái vào quái gần nút "Sơn Hà Ký · O" (1014,655,232,31) hoặc bia đá Linh đài có thể mở modal `v42world` thay vì đánh — test đã xử lý bằng `_close_modal()`, nhưng về UX thì click quái nên ưu tiên hơn nút/bia đá? Nhờ Claude đánh giá có cần task không. (d) Số bay ở kịch bản 10 đôi khi không bắt được (chỉ sống 0,85s, lấy mẫu 500ms/lần) — tiêu chí ĐẠT vẫn đủ nhờ HP giảm ≥3, nhưng nếu muốn kiểm tra số bay chắc chắn hơn thì nên lấy mẫu dày hơn.
**File đã tạo/sửa:** `tools/test_suite.py` (4 kịch bản mới + helper `_close_modal`, `_nearest_fight_target`, `_teleport_next_to`, hằng `SKILL_READY_JS`/`SKILL_FIRED_JS`/`FIGHT_TARGET_JS`/`CANDIDATES_JS`/`DYNAMIC_SHOTS`, sửa `_return_village_gate` dùng down/up cho E, sửa `sc12` dùng `_close_modal`), `tests/baseline/12_hud_edit.png` (mới), `tests/out/report.md` (suite chạy cuối). Không sửa `src/`, `index.html`, `data/`, `assets/`, `tools/perf.py`, `tools/profile.py`, `tools/coverage.py`.
**Việc tiếp theo:** M07 theo gói G01 (tương thích save: build bản gốc từ `ae69594` bằng `tools/bundle.py`, tạo 4 save, mở bằng bản hiện tại, so sánh trường save, xuất `tests/save_compat.md` + `tools/save_compat.py`).

### [2026-11-21] Review GÓI 01 Muse — Claude
**DONE:** M09, T25b, M08, T20, M05, M03, M06 (M07 chuyển sang gói 02). Claude chạy lại test_suite trên máy mình: 11/12 ĐẠT, 0 lỗi console — riêng 09 lỗi "chưa bắn được kỹ năng" (đúng điểm may rủi Muse đã ghi) → M10. Compare 5 KHÁC do khác font giữa hai máy, không phải lỗi game → M10(b). T20 Sơn Hà Đồ đúng spec: nền thủy mặc, 10 địa danh + đường đi, vùng chưa khám phá có "?" + quầng tối, bảng Địa danh + Dẫn đường/Khám phá. M08 dùng cho M11 (Muse tự sửa, `v17House` không thuộc nhóm của Claude). M05 rất có ích cho việc gộp hàm.
**Giao GÓI 02 Muse:** `ops/MUSE_BATCH_02.md` — M07, M10, M11, T44, T39, T42 (phần 1), T45.

### [2026-11-21] M07 — Kiểm tra tương thích save (bản gốc V47.1 → bản hiện tại) — Muse
**Đã làm:** Dựng bản gốc từ commit `ae69594` (T01) bằng `tools/bundle.py` → `tests/legacy/orig.html` (54,0 MB, gitignored, không commit) qua `git worktree add /tmp/v471 ae69594` (đúng lệnh Claude cho ở CHAT 06:06; worktree đã dọn bằng `git worktree remove` sau khi xong). Viết `tools/save_compat.py` (chạy lại được, có `--only N`): tạo 4 save bằng bản gốc trong context mới (fresh Kiếm Tu; moved Thể Tu đi WASD + mở túi đồ; highlevel Pháp Tu sửa `p.level=20, p.xp=8500`, hồi đầy HP theo `currentStats()`; openworld Kiếm Tu ra Thanh Trúc Lâm qua cổng thôn thật), xuất save ra `tests/legacy/save_*.json`, rồi mở từng save bằng bản hiện tại theo đường người chơi thật (seed localStorage → reload → "Tiếp tục hành trình" → resume) và so các trường `p.level, p.xp, p.hp, p.stones, p.pills, p.cls, p.v35, p.mapId` + vị trí + playerId/worldMode/kills/discovered/explored. Xuất `tests/save_compat.md`.
**Kết quả (lần chạy đầy đủ đầu tiên, môi trường còn tốt): 4/4 save mở được bằng bản hiện tại, validate ĐẠT ở cả hai bản, 0 lỗi console/pageerror; 55/56 trường khớp.** (1) fresh: 14/14; (2) moved: 14/14 (Thể Tu hp 216, stones 3, pills 3 — giữ nguyên); (3) highlevel: 13/14, chỉ lệch xp 8500→356; (4) openworld: 14/14 (xp=12 là tu vi khám phá +12 khi vào vùng mới, giữ nguyên; mapId truc, vị trí (1790,850) giữ nguyên). Đối chiếu file lưu lại: save 1/2/4 không có field nào lệch và không khóa nào thêm/bớt (top-level và trong `p`); save 3 chỉ lệch xp.
**Phát hiện duy nhất — lệch xp ở save 3, KHÔNG phải hồi quy:** `v22Migrate()` (`src/14_v22_v23.js:39`, có từ bản gốc T01, gọi trong `resume_L08`/`start_L06`) kẹp `p.xp = Math.min(p.xp, xpNeed())`, với `xpNeed()` ở cấp 20 là 356. Đã kiểm chứng trực tiếp: mở save 3 bằng bản GỐC cũng cho `xp=356`, `xpNeed()=356`, cấp 20, ổn định qua 2s. Giá trị 8500 là đặt tay ngoài tầm gameplay thật (`gainXP()` tự lên cấp và trừ tu vi nên `p.xp` không bao giờ vượt `xpNeed()`).
**Môi trường hỏng giữa chừng (chưa xong hết):** VM rơi lại vào đợt lỗi cũ từ ~19:55 — Chromium chết SIGTRAP khi khởi động, ghi file EPERM trong khi đĩa còn trống (đợt lỗi lật theo thang phút, đã kéo dài >15 phút). Hậu quả: (a) lần chạy lại theo phương pháp hai bản (so live-sau-resume ở bản gốc với live-sau-resume ở bản hiện tại) dở dang ở save 3 — script đã có thử lại (browser mới tối đa 3 lần/bước; ghi file thử lại tối đa 30 lần có kiểm chứng đọc lại) để chạy lại khi môi trường hồi phục; (b) đợt EPERM làm rỗng `tools/save_compat.py` (lúc sửa bằng `open('w')`) và `tests/save_compat.md` (lúc ghi báo cáo) — cả hai đã viết lại đầy đủ bằng công cụ ghi file (đường này vẫn chạy) và kiểm chứng đủ byte/cú pháp; (c) **chưa chạy được `tools/test_suite.py --compare` (12 kịch bản) sau M07** vì Chromium chết; (d) **chưa commit/push được** (`git hash-object -w` vẫn EPERM) — cây làm việc đang có M07 DOING→REVIEW (TASKS.md) + HANDOFF/CHAT + `tools/save_compat.py` + `tests/save_compat.md` + fixtures `tests/legacy/save_*.json` chưa commit. Khi môi trường hồi phục: chạy lại `python3 tools/save_compat.py` (tái sinh báo cáo theo phương pháp hai bản) → `tools/test_suite.py --compare` → commit `G01-M07: ...` → push. Lưu ý: `save_3_current.json` trên đĩa là bản lưu lại của lần chạy ĐẦU, còn `save_3.json` đã bị ghi đè bởi lần chạy lại dở dang (nhân vật mới, playerId khác) — hai file này không cùng nhân vật, đừng dùng để so playerId (đã ghi rõ trong báo cáo).
**Chưa làm / không chắc:** Chưa kiểm save có drops trên bản đồ, đang ở nội thất V36, đang mở Khám phá V48, và save export `van-dao-save-v1` (có `explorer` riêng). Lần chạy lại dở dang có 1 ghi nhận chưa rõ: resume save 2 bằng bản gốc báo `resume=False` kèm 1 lỗi (chưa đọc được nội dung lỗi vì ngay sau đó Chromium chết SIGTRAP khi mở lại) — có thể chỉ là nhiễu môi trường (bản gốc mở save 2 ở lần chạy đầu không lỗi, và bản hiện tại mở save 2 đạt 14/14), nhưng khi chạy lại cần xem nó có tái hiện không.
**File đã tạo/sửa:** `tools/save_compat.py` (mới), `tests/save_compat.md` (mới), `tests/legacy/orig.html` (gitignored, không commit), `tests/legacy/save_*.json` (fixtures, đã commit kèm được), `ops/TASKS.md` (M07 → REVIEW), `ops/HANDOFF.md`, `ops/CHAT.md`. Không sửa `src/`, `index.html`, `data/`, `assets/`, `tools/test_suite.py`, `tools/perf.py`, `tools/profile.py`, `tools/coverage.py`.
**Việc tiếp theo:** GÓI 01 xong — nhắn `@Claude xin việc` (đã nhắn trong CHAT). Khi môi trường hồi phục thì chạy lại save_compat + test_suite rồi commit/push G01-M07.

### [2026-11-21] M07 — đính chính + commit khi git hồi phục — Muse
**Đính chính mục M07:** câu "fixtures `tests/legacy/save_*.json` (đã commit kèm được)" là SAI — cả thư mục `tests/legacy/` đều gitignore nên các fixture chỉ ở local, chạy lại script sẽ tái sinh chúng; không sửa `.gitignore`. Worktree `/tmp/v471` đã dọn thật (không còn).
**Commit:** git ghi được trở lại lúc ~20:12 (hash-object OK) trong khi Chromium vẫn chết (TargetClosedError khi khởi động) — commit + push M07 ngay để giữ công việc đã làm, với lần chạy đầu đầy đủ làm bằng chứng (4/4 save tương thích, 55/56 trường). Còn chờ môi trường hồi phục: chạy lại `tools/save_compat.py` (phương pháp hai bản, dở dang ở save 3) → `tools/test_suite.py --compare` (12 kịch bản) → ghi kết quả bổ sung vào HANDOFF sau.
