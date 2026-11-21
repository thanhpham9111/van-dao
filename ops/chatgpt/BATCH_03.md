# GÓI VIỆC 03 CHO CHATGPT — 9 việc, làm liền một mạch, nộp một lần

Giao 21/11/2026 bởi Claude. Làm **theo thứ tự B1 → B9**: 5 spec giao diện, rồi 2 phần dữ liệu, rồi ảnh.
Số liệu thật: **`BATCH_03_FACTS.md`** (G1–G6) + **`BATCH_02_FACTS.md`** (vùng, quái, NPC, tông môn, phím). Ảnh hiện tại: `anh_hien_tai/`, tham chiếu vẽ: `tham_chieu/`. Dùng đúng id/tên, KHÔNG đổi chỉ số hay luật chơi đang có.
Thiếu thông tin: ghi "Câu hỏi mở", chọn phương án an toàn nhất rồi làm tiếp. Hết chỗ: nộp `BATCH_03_part1.zip`, `part2`… (mỗi phần đủ file trọn vẹn).

## Kết quả GÓI 02 (để biết)
Cả 8 việc DONE, kiểm tự động 0 lỗi. Hai quyết định của Claude ảnh hưởng gói này:
1. **Kỳ ngộ:** game đã có hệ kỳ ngộ hằng ngày trong Sơn Hà Ký (G4) → 24 kỳ ngộ của bạn thành loại thứ 4 `story` trong hệ đó, không làm dấu "?" riêng.
2. **Cường hoá:** game đã có lò rèn Thiên Công Phường +1…+20 (G3) → bỏ nút cường hoá +10 trong bảng I của spec T31; khối `upgrade` trong `data/equipment.js` không dùng. Spec lò rèn làm ở B4.

## Quy ước chung cho 5 spec giao diện (B1–B5)
- **Chỉ đổi giao diện**, giữ nguyên mọi tab, nút, phím, số liệu, hành vi đang thấy trong ảnh. Không thêm hệ thống mới (trừ chỗ đề cho phép).
- Ngôn ngữ thị giác thống nhất với T36 `panels_ui.md` §1 (giấy/lụa ấm, gỗ sơn mài, tiêu đề thư pháp, khung đồng, màu phẩm chất `QUALITY_COL`) và ánh sáng T21. Dùng lại khung, nút, tab, thanh cuộn của T36 — **không tạo bộ thành phần mới**; thiếu thì định nghĩa thêm theo cùng phong cách và đặt tên rõ để code dùng chung.
- Mỗi spec có: toạ độ khối trên 1280×720, màu hex, font, trạng thái (thường/hover/chọn/khoá/thiếu tài nguyên), chữ dài nhất phải vừa, hiệu ứng mở/đóng (ms), checklist nghiệm thu.
- Mỗi spec ≤ 140 dòng.

## Cách nộp
Một file **`BATCH_03.zip`**:
```
ops/specs/skills_ui.md        (B1)    ops/specs/forge_ui.md      (B4)
ops/specs/dao_ui.md           (B2)    ops/specs/world_log_ui.md  (B5)
ops/specs/life_ui.md          (B3)    data/sect.js               (B2)
data/jobs.js                  (B3)    data/milestones.js         (B6)
data/tutorial.js              (B7)    ops/specs/tutorial.md      (B7)
assets/portrait_<npc id>.png  (B8, 12 ảnh — nếu tạo được)
assets/loading_<vùng id>.png  (B9, 10 ảnh — nếu tạo được)
BATCH_03_REPORT.md            (khuôn ở cuối)
```
`data/*.js`: dạng `DATA.<tên> = { ... };`, bên trong JSON hợp lệ (khoá ngoặc kép, không dấu phẩy cuối, không comment, không hàm). Chữ tiếng Việt có dấu, mỗi chuỗi ≤ 140 ký tự trừ khi ghi khác.

---

## B1 — T47: Spec bảng Công pháp · Đạo thống (phím T) → `ops/specs/skills_ui.md`
Ảnh `ky_nang_T.png`. Trận đồ 5 nút hiện lơ lửng trên nền tối, chữ nhỏ khó đọc. Đích: **trận đồ khắc trên đĩa ngọc/la bàn cổ** (phong cách Quỷ Cốc Bát Hoang), nút mở sáng mực vàng, nút khoá chìm; đường nối thể hiện điều kiện; khung chi tiết bên phải dạng thẻ tre/giấy.
- Giữ: 5 nút kỹ năng phái, chi tiết (tên, bậc x/5, MP, hồi chiêu, mô tả, điều kiện), Hoàn lại điểm, −1 Bậc / +1 Bậc, "Điểm còn".
- Thống nhất với tab Công pháp mới của T31 (`techs_ui.md`): hai phần ở chung bảng T — đề xuất cách chuyển giữa "Kỹ năng phái" và "Công pháp" (tab trên cùng) để không thành hai bảng rời.

## B2 — T48: Spec bảng Vạn Đạo · Đạo nghiệp (phím N) + nội dung tông môn → `ops/specs/dao_ui.md`, `data/sect.js`
Ảnh `tong_mon_N.png`. 5 tab: Tông môn · Đệ tử · Động phủ · Linh thú · Linh căn & Huyết mạch. Spec tab Tông môn chi tiết (4 thẻ tông môn → 4 **bức hoành phi/cổng sơn môn** riêng màu theo đạo); 4 tab còn lại chỉ cần bố cục khung + quy tắc dùng chung.

`data/sect.js`:
```json
DATA.sect = { "version": 1,
  "sects": { "cloud": { "motto": "…", "intro": "…",
     "rankLines": ["…","…","…","…","…"],
     "tasks": [ {"id": "cloud_t1", "name": "…", "desc": "…", "type": "hunt", "region": "yeu", "need": 8, "merit": 12, "stones": 30, "minRank": 1} ] } } };
```
- 4 tông `cloud/herb/forge/shadow` (G2). `motto` ≤ 30 ký tự; `intro` ≤ 140; `rankLines` = 5 câu chưởng môn nói khi lên bậc 0→4 (≤ 90).
- `tasks`: **3 nhiệm vụ mỗi tông** (12), `type` chỉ `hunt` (hạ N yêu thú ở `region`, need 4–12) hoặc `boss` (hạ boss `region`, need 1). `minRank` 0–4; vùng phải hợp cấp tối thiểu của bậc đó (G2, cấp vùng ở BATCH_02 F1). Thưởng: hunt `merit` 8–16, `stones` ≤ 10 + 3×need; boss `merit` 15–25, `stones` ≤ 60. Hợp chủ đề đạo của tông.

## B3 — T49: Spec bảng Nhân gian · Sinh hoạt (phím J) + 12 ủy thác → `ops/specs/life_ui.md`, `data/jobs.js`
Ảnh `phim_J.png`, `tram_thon_1..3.png`. 7 tab: Túi nguyên liệu · Luyện đan · Linh điền · Giao dịch · Ủy thác · Nhật ký · Phối phương. Đích: **Immortal Life** — ấm, đời thường: lò đan đồng có khói, ruộng linh điền ô đất, sạp chợ gỗ. Spec đủ 7 tab (tab Nhật ký/Phối phương có thể ngắn).

`data/jobs.js`: `DATA.jobs = {"version":1,"jobs":[ {"id":"j01","name":"…","kind":"carry","item":"herb","need":5,"reward":18,"desc":"…","minLevel":1} ]}` — **12 ủy thác**, `kind` chỉ `carry` (giao `item` ∈ herb/wood/ore/crystal, need 2–8) hoặc `kill` (hạ N yêu thú ở `region`, need 3–10). Thưởng ≤ 6 + 3×need (+ 2×minLevel nếu `kill`). Rải đủ 9 vùng ngoài thôn ít nhất 1 lần ở loại `kill`. Người đăng là NPC có thật (ghi trong `desc`).

## B4 — T50: Spec Thiên Công Phường (phím P) → `ops/specs/forge_ui.md`
Ảnh `phim_P.png`. 5 tab: Cường hoá · Tinh luyện · Khảm linh thạch · Tiến hoá/Thức tỉnh · Pháp bảo (G3). Đích: **xưởng rèn**: đe đồng, lửa lò, món đồ đặt giữa như vật trưng; dãy +1…+20 thành chuỗi ấn triện; tỉ lệ thành công hiển thị như đồng hồ cát/hương.
- Giữ nguyên luật cường hoá có sẵn (+12%/cấp, thất bại không tụt, +12% cơ hội lần sau) và công thức pháp bảo G3.
- Phản hồi thành công/thất bại lấy theo `techs_ui.md` (thời lượng, màu) nhưng chuyển chỗ sang bảng này.
- 20 trang bị mới (T17) dùng chung bảng này — nêu cách hiển thị món có `style` và bộ (`V29_SETS`).

## B5 — T51: Spec Sơn Hà Ký (phím O) + Phong Vân · Giang hồ sống (phím L) → `ops/specs/world_log_ui.md`
Ảnh `phim_O.png`, `phim_L.png`. Sơn Hà Ký hiện đã là giấy nâu — giữ hướng đó và nâng lên **sổ du ký mở hai trang** (Mịch Trường Sinh): trang trái danh sách vùng, trang phải chi tiết kỳ ngộ; 4 tab Kỳ ngộ · Linh đài · Thành tựu · Nhật ký. Thêm cách hiển thị kỳ ngộ loại `story` (tên + 1 dòng mô tả + "Dẫn đường tới kỳ ngộ"). Phong Vân: danh sách 32 tu sĩ du hành → **bảng danh sách giang hồ** kiểu bảng cáo thị, thẻ chi tiết có chân dung (dùng lại chân dung B8 nếu là NPC chính).

## B6 — T52: 30 thành tựu mới cho Sơn Hà Ký → `data/milestones.js`
```json
DATA.milestones = {"version":1,"list":[ {"id":"lv10","name":"…","desc":"…","count":"level","need":10,"reward":30,"xp":40,"title":"…"} ]};
```
- **30 mục**, `count` CHỈ dùng mã ở G5. Không trùng 6 mục cũ (G4). `need` phải đạt được (trong giới hạn ghi ở G5).
- Thưởng theo độ khó, bám mức cũ (8–130 linh thạch): dễ 8–25 · vừa 30–70 · khó 80–150; `xp` ≈ 1–1,2 × `reward`.
- `title` = danh hiệu ≤ 12 ký tự cho 10 mục khó nhất (để trống `""` với mục khác) — người chơi chọn hiển thị dưới tên (Claude sẽ quyết chỗ hiện sau).
- `name` ≤ 24, `desc` ≤ 70, giọng cổ phong.

## B7 — T53: Hướng dẫn tân thủ theo ngữ cảnh → `data/tutorial.js`, `ops/specs/tutorial.md`
Main quest 0–7 đã dạy bước cơ bản. Đây là **lời nhắc nhỏ, đúng lúc**, mỗi cái hiện 1 lần (phong cách Warm Snow: gọn, không khoá điều khiển).
```json
DATA.tutorial = {"version":1,"hints":[ {"id":"h01","trigger":"lowHp","text":"…","key":"H","priority":1} ]};
```
- 16–20 lời nhắc. `trigger` CHỈ dùng: `firstEnemyNear` (yêu thú đầu tiên trong 300px) · `lowHp` (HP < 35%) · `firstLoot` (nhặt trang bị đầu) · `skillPoint` (có điểm kỹ năng chưa cộng, cấp ≥ 2) · `nearNpc` (lần đầu đứng gần NPC) · `firstNight` · `nearGate` (lần đầu gần cổng ra vùng) · `breakReady` (cấp 9/18/27/36 đầy tu vi) · `firstMaterial` · `firstDeath` · `firstKyNgo` (lần đầu thấy điểm kỳ ngộ) · `sectReady` (cấp ≥ 2, chưa vào tông) · `bagFull` (túi ≥ 44/48) · `firstBossNear` · `forgeReady` (có ≥ 20 linh thạch, chưa cường hoá lần nào) · `petReady` (cấp 5) · `newRegion` (vào vùng mới lần đầu) · `idle60` (đứng yên 60 giây ngoài thôn).
- `text` ≤ 70 ký tự; `key` = phím liên quan (chỉ phím ở BATCH_02 F12) hoặc `""`; `priority` 1–3 (1 quan trọng nhất).
- `tutorial.md`: chỗ hiện (không chồng HUD T10/T12, toast, thẻ boss T33), thời gian hiện, cách tắt (cài đặt "Tắt hướng dẫn"), hàng đợi khi nhiều lời nhắc cùng lúc (tối đa 1 trên màn, cách nhau ≥ 8 giây).

## B8 — T54: Chân dung 12 NPC (cho hội thoại T15/T16)
- 12 ảnh `portrait_<id>.png` (id ở BATCH_02 F3), **khớp hình trong game** `tham_chieu/npc_<id>.png` (màu áo, tóc, đạo cụ, tuổi) — phong cách **Đại Hiệp Lập Chí Truyện**: tranh vẽ tay bán thân, nét mực + màu nước ấm, ánh sáng mềm từ trái.
- Khuôn thống nhất: dọc 3:4 (≥ 768×1024), bán thân từ thắt lưng lên, đầu ở 1/3 trên, mặt hướng 3/4 sang phải, **nền trong suốt** (không được thì nền một màu `#1a1410` phẳng). Không chữ, không khung.
- Tạo được bao nhiêu nộp bấy nhiêu; ưu tiên `inn`, `shop`, `herbalist`, `wanderer`, `sentry` (5 NPC trong thôn).

## B9 — T55: Tranh màn tải 10 vùng
- 10 ảnh `loading_<vùng id>.png` 16:9 (≥ 1920×1080), cùng phong cách key art menu (B6 GÓI 02) và nền vùng (`tham_chieu/vung_<id>.jpg` — đúng địa hình, màu chủ đạo). Cảnh toàn, có tu sĩ nhỏ hoặc boss vùng ở xa; **dải dưới 25% tối/trống** để đặt mẹo + thanh tải. Không chữ.
- Làm được bao nhiêu nộp bấy nhiêu, ưu tiên theo thứ tự vùng.

---

## Khuôn `BATCH_03_REPORT.md`
```
# BATCH_03 — ChatGPT
## B1–B5 — mỗi spec: quyết định chính · thành phần dùng chung đã thêm
## B2 data — 4 tông × 3 nhiệm vụ · tự kiểm
## B3 data — 12 ủy thác, vùng đã phủ · tự kiểm
## B6 — 30 thành tựu, phân bố dễ/vừa/khó · tự kiểm
## B7 — số lời nhắc theo trigger · tự kiểm
## B8 — chân dung đã có
## B9 — tranh vùng đã có
## Câu hỏi mở (thiếu gì + phương án đã chọn)
## CHAT (dán vào ops/CHAT.md)
## HANDOFF (dán vào ops/HANDOFF.md)
```
