# GÓI VIỆC 03 CHO MUSE — làm qua file zip (không dùng git/repo), viết code nháp 4 module

Giao 22/11/2026 bởi Claude. **Cách làm mới:** máy bạn bị chặn ghi file bằng Python/git/Chromium, nên không cần repo nữa. Chủ dự án gửi bạn file zip này (mã nguồn hiện tại); bạn viết code, đóng gói `MUSE_03.zip`, chủ dự án chuyển cho Claude. Claude ghép vào repo, chạy test_suite + Chromium, sửa nếu cần.
- Giải nén / tạo file / đóng gói: dùng lệnh shell vẫn ghi được (`unzip`, `cat > file <<'EOF'`, `tee`, `cp`, `zip` hoặc `tar`). Nếu `unzip`/`zip` cũng bị chặn: dùng `tar` hoặc `perl`; vẫn không được thì dán nội dung từng file vào khung chat (mỗi file một khối code, ghi rõ tên file).
- Tự kiểm: chạy Node in kết quả ra màn hình (không ghi file) — nạp các file `src/` theo thứ tự `index.html` trong VM có canvas giả, gọi hàm thật. Không cần Chromium.
Làm theo thứ tự M1 → M4. Hết chỗ hoặc máy hỏng giữa chừng: nộp phần đã xong.

## Luật code (giống ChatGPT GÓI 04 — vi phạm là Claude trả lại)
1. **Chỉ tạo file mới** đúng tên ở từng việc. Mỗi file mở đầu `'use strict';`, script cổ điển, dùng biến toàn cục của game.
2. **Không bọc đè hàm** (`const old=fn; fn=function…`). Chen hành vi bằng điểm móc có sẵn (`src/01_core.js`):
   - `FRAME_HOOKS.update.push(dt=>…)` — sau mỗi bước update (60/giây).
   - `FRAME_HOOKS.overlay.push(()=>…)` — vẽ trên cùng sau HUD, toạ độ logic 1280×720 (đã save/restore + setTransform).
   - `COMBAT_HOOKS.afterHit(info{e,dmg,crit,hp0,lost,killed,boss})` · `afterPlayerDamage(info{n,hp0,lost})` · `drawEffects()`.
3. Phải sửa hàm có sẵn → ghi **PATCH** vào `ops/patches/MUSE_03.json`: `[{"task":"M1","file":"src/…","old":"<đoạn y nguyên, xuất hiện đúng 1 lần>","new":"…","why":"…"}]`. Patch nhỏ nhất có thể; hàm nhiều lớp (xem `ops/OVERRIDES.md`) thì patch lớp cuối hoặc lớp `_Lxx` đúng chỗ.
4. Save cũ: trường mới trong `p` khởi tạo mặc định khi thiếu; không đổi/xoá trường cũ.
5. Đọc dữ liệu từ `DATA.*` (đã duyệt). `DATA.x` thiếu → `console.warn` một lần rồi tắt module. Ảnh lấy qua `ASSETS["tên"]` (danh sách tên trong `ASSETS_LIST.txt`; gói không kèm `assets.js` vì quá nặng).
6. Không tạo phím mới. Chữ tiếng Việt. **Giao diện mới:** bảng (modal) tự ra giấy dó mực tàu nhờ `src/61_ui_style.js` — cứ dùng màu như code cũ. HUD/overlay ngoài bảng theo kiểu **mực đêm** (nền mực gần đen `#14110e` ~85%, chữ giấy `#efe6d4`, chỉ vàng `#c9a86a` tiết chế, KHÔNG dùng xanh ngọc, KHÔNG khung bo tròn viền vàng 1px quanh mọi thứ). Xem `ops/DESIGN.md` mục "Hướng giao diện CHỐT".

## Cách nộp
`MUSE_03.zip`: `src/60_bestiary.js`, `src/62_combat_hud.js`, `src/63_lore.js`, `src/64_breakthrough.js`, `ops/patches/MUSE_03.json`, `MUSE_03_REPORT.md` (khuôn cuối file). Claude tự thêm thẻ `<script>` vào `index.html`.

---

## M1 — T42 Văn bản thế giới → `src/63_lore.js`
- Dữ liệu `DATA.lore` (cần nạp `data/lore.js` — ghi PATCH thêm thẻ vào `index.html` ngay dưới `data/quests.js`). Làm theo `ops/specs/batch02_addendum.md` §4 + `batch03_addendum.md` §2:
  - **Thơ vùng:** khi vào vùng mới (màn chuyển vùng / tên vùng `worldTitle` đang hiện ở giữa trên), hiện 2 dòng `regions[id].verse` dưới tên vùng, 3 giây, mờ dần.
  - **Màn tải + chuyển vùng:** vẽ `ASSETS["loading_<vùng>"]` phủ (cover) 1280×720, dải y 540–720 tối dần đặt 1 mẹo `tips` (xoay vòng) + thanh tải. Màn tải hiện có ở `src/44`.
  - **Lore tooltip:** thêm 1 dòng chữ nghiêng màu phụ cuối tooltip trang bị/linh bảo/công pháp cũ/bộ (`equipment[id]`, `relics`, `techs`, `sets`) — `v21Tooltip` đã thành lớp tường minh `v21Tooltip_L00..L03` (src/20 + các file trong OVERRIDES), patch lớp cuối.

## M2 — T13 HUD chiến đấu → `src/62_combat_hud.js`
- Spec `ops/specs/hud_combat.md` v1.3 (bố cục, chức năng). **Màu theo kiểu mực đêm** (luật 6), không theo màu xanh ngọc trong spec cũ.
- Dùng `COMBAT_HOOKS.afterHit` (số sát thương, chuỗi đòn, khoá mục tiêu), `afterPlayerDamage` (viền đỏ mép màn hình, rung nhẹ ≤ 3px), vẽ trong `FRAME_HOOKS.overlay`. Chỉ hiện khi `v45CombatHUD()` true. Hai đường HUD: thôn (`v47tDraw`, src/48) và ngoài (`v35Render`, src/47) — overlay vẽ chung được cho cả hai.
- Thanh boss: đúng vị trí spec (tên x360,y664,w322…), không trùng thanh boss cũ nếu đang có (đọc code để tránh vẽ hai thanh).

## M3 — T40 Thẻ giới thiệu boss + câu thoại boss → `src/60_bestiary.js`
- Spec `ops/specs/boss_intro.md` + `batch02_addendum.md` §2; dữ liệu `DATA.bestiary` (nạp `data/bestiary.js` bằng PATCH `index.html`).
- Thẻ tên + danh hiệu khi lần đầu vào tầm 650px của boss (mỗi lần nạp vùng tối đa 1 lần), câu `intro`; `phase2` khi HP boss vượt xuống 50% (dùng `afterHit`: `hp0/e.max>.5 && e.hp/e.max<=.5`); `defeat` khi `info.boss && info.killed`. Tên chiêu `moves[mã]` hiện nhỏ lúc boss ra đòn nếu tìm được chỗ phát đòn (`V27_BOSS`, src/17) — không có thì bỏ, ghi vào báo cáo.
- Kiểu mực đêm: thẻ là mảng mực loang ngang + tên lớn V18Serif + danh hiệu nhỏ + một nét chỉ vàng.

## M4 — T45 Trình diễn Thiên kiếp → `src/64_breakthrough.js`
- Spec `ops/specs/breakthrough.md` + **`batch02_addendum.md` §6**. Code thật: `v30TrialStart`, `v30TrialTick`, `v30TrialZone`, `v30TrialEnd` (src/20). Phím B đi qua `v22Break` (lớp cuối ở src/40).
- Không đổi luật (số đợt, dạng vùng, thời gian báo trước, sát thương, thắng/thua). Cảnh mở đầu ≤ 2,5 giây chạy **trước** đợt đầu (đồng hồ đợt chỉ chạy khi cảnh xong/bị bỏ qua), Space/Esc bỏ qua; báo trước vùng sét rõ theo thời gian còn lại; thắng → hiệu ứng thăng cảnh giới + câu Trưởng lão; thua → câu an ủi.

---

## Khuôn `MUSE_03_REPORT.md`
```
# MUSE_03 — Muse (code nháp qua zip)
## M1–M4 — mỗi việc: file, hàm/biến game đã dùng (tên + file:dòng), PATCH nào, trường save mới, tự kiểm Node (số ca, kết quả)
## Rủi ro / chỗ cần Claude kiểm trên trình duyệt
## Ghi chú máy (lệnh nào ghi được / bị chặn)
```
