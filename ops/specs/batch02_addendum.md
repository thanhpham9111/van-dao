# Phụ lục GÓI 02 (T32–T38, T23b) — Claude trả lời câu hỏi mở + quyết định tích hợp (21/11/2026)

Đọc cùng spec tương ứng khi làm T39–T45. Ở đâu phụ lục khác spec, **theo phụ lục**.

## 1. Chính tuyến / phụ tuyến (`data/quests.js`, spec `story.md`) → T39
- **Lưu trữ:** giữ `p.v12Main` làm con trỏ. Chỉ số 0–7 = 8 bước cũ (`V12_MAIN`, điều kiện/thưởng không đổi); chỉ số 8 trở đi = `DATA.quests.main[i-8]`. Save cũ đang ở 8 (đã xong bí cảnh đầu) sẽ tự sang `m09`. Không cần hash/ID.
- **Chữ 8 bước cũ:** khi nạp, ghi đè `name`/`desc` của `V12_MAIN[index]` bằng `legacyText`; không đụng `done`, thưởng, `goal` cũ.
- **Nhận việc:** giống V12 hiện tại — bước kế **tự kích hoạt** khi bước trước xong, và **tự hoàn thành** ở bất cứ đâu (không phải quay về `giver`). `giver` chỉ để hiển thị: khi bước kích hoạt hiện `lineStart` (toast + Q), khi xong hiện `lineDone`. Bước có `minLevel` > cấp hiện tại: hiện trạng thái "Chưa mở — cần cấp N" (dùng `V12_STATUS.locked`).
- **Điều kiện từng loại** (đã thoả từ trước thì xong ngay khi kích hoạt — chấp nhận, không softlock):
  `talk` → `p.v12Talk[npc]` · `discover` → `p.discovered.includes(region)` · `kill` → `v12Count(region) - base ≥ count`, `base` = `v12Count(region)` lúc kích hoạt, lưu `p.qKillBase[id]` · `boss` → `region==='truc' ? p.worldBossDead : v22State().bosses[region]?.kills>0` · `level` → `p.level ≥ min` · `claim` → `!!p.claimed[poi]` · `sect` (chưa bước nào dùng) → bỏ qua.
- **Phụ tuyến:** hiện trong Q khi `p.level ≥ minLevel` **và** đã gặp `giver` (`p.v12Talk[giver]`); tự hoàn thành như trên; trạng thái lưu `p.qSide[id]` (`active/done`), thưởng đúng 1 lần.
- **Kiểm trước khi bật:** lúc nạp, chạy kiểm dữ liệu (mọi npc/region/poi tồn tại, loại goal hợp lệ). Lỗi → `console.warn` và **chỉ chạy 8 bước cũ**, không bật một phần.

## 2. Yêu thú chí + thẻ boss (`data/bestiary.js`, spec `boss_intro.md`) → T40
- `regions` của quái chỉ dùng cho lore/yêu thú chí, không ảnh hưởng spawn/rơi đồ — đúng.
- Boss 7, 20–24 không có vùng: giữ `null`/`[]`. Thẻ boss vẫn hiện khi gặp chúng trong bí cảnh.
- Câu `phase2` là câu thoại 50% HP, không đổi AI — đúng. Lấy cái chết boss từ hook sau T07 (Claude ghi điểm móc ở HANDOFF T07).

## 3. Kỳ ngộ (`data/events.js`) → T41 — **SỬA 21/11 20:50, thay bản trước**
Bản trước của mục này sai: Claude chỉ thấy `openEvent()` (src/01_core.js) là code chết mà bỏ sót **hệ kỳ ngộ đang chạy của Sơn Hà Ký** (`src/37_equipment_assets.js`, bảng O): mỗi vùng đã khám phá có 1 kỳ ngộ mỗi ngày game (`v42wGenerate(id, day)`), hiện thành điểm `v42event` trên bản đồ, theo dõi ở tab Kỳ ngộ, 3 loại `shrine` (giải cổ trận chọn hệ), `hunt` (hạ 3 yêu thú), `supply` (giao vật phẩm). **Không làm dấu "?" + bộ đếm 150 giây nữa.** T41 làm thế này:
- Thêm loại thứ 4 **`story`** vào vòng quay của `v42wGenerate`: vùng ngoài thôn quay `['shrine','hunt','supply','story']` theo `(day+i)%4` (thôn giữ nguyên). Tên điểm trên bản đồ = `title` của sự kiện.
- Chọn sự kiện khi sinh kỳ ngộ: lọc `DATA.events` theo `when.regions` chứa vùng đó, `minLevel ≤ p.level`, rồi theo `weight`; không lặp sự kiện trong 6 lần gần nhất (`p.evRecent`). Lưu `eventId` vào bản ghi kỳ ngộ để save/tải lại giữ nguyên. `night`: kiểm lúc người chơi mở (giờ = `(p.worldTime % 360) / 15`, đêm khi ≥ 19 hoặc < 5); sai giờ thì hiện câu "Cảnh này chỉ hiện ra vào ban đêm/ban ngày" và giữ điểm.
- Tới gần nhấn **E** (đường tương tác `v42event` sẵn có) → modal lựa chọn (dùng lại khung `kind:'event'` cũ); chọn xong gọi `v42wComplete(e)` để tính vào thành tựu "Hữu duyên nhân"/"Hộ đạo sơn hà" như mọi kỳ ngộ khác, nhưng **không** cộng thêm `e.reward/e.xp` mặc định — thưởng chỉ lấy từ `effects`.
- 3 sự kiện cũ trong `EVENT_POOL` gộp vào pool như `when.regions` = mọi vùng ngoài thôn, `weight` 4; xoá `openEvent()` chết.
- **Hiệu ứng:** tung xác suất 1 lần lúc bấm. `hurt` kẹp để HP còn ≥ 1. `buff`: `attack`/`def`/`crit` là tỉ lệ (0,1 = +10%), `speed` px/giây, `regen` MP/giây cộng thêm; lưu `p.evBuffs` (stat, value, hết hạn theo `p.worldTime`), cùng stat thì làm mới thời gian lấy giá trị lớn hơn, áp trong `currentStats()`.
- Vẫn chờ T09 (đường tương tác) của Claude.

## 4. Văn bản thế giới (`data/lore.js`) → T42
- `regions.*.verse`: 2 câu hiện dưới tên vùng ở màn chuyển vùng (cùng chỗ `owTitle`, 3 giây). `intro`: hiện trong bản đồ M khi rê vào vùng (T20).
- `tips`: xoay vòng ở màn tải (`src/44`) và màn chuyển vùng; mỗi lần 1 mẹo.
- `equipment`/`relics`/`techs`/`sets`: 1 dòng chữ nghiêng màu `muted` cuối tooltip đồ (sau T46).

## 5. Giao diện I/C (spec `panels_ui.md`) → T43 · Menu (spec `menu_ui.md`) → T44
- Bảng I = `modal.kind==='gear'` vẽ bởi `v21Inventory`; tooltip `v21Tooltip`; khung chung `v18Frame`; bảng C = `modal.kind==='stats10'`. Ba hàm đầu đang vá chồng → **Claude gộp trước (T46)**, sau đó Muse làm T43.
- Bộ lọc "Tất cả" thứ hai trong ảnh là **lọc ô trang bị theo tình trạng** (tất cả/đang mặc/chưa mặc) — giữ nguyên chức năng, chỉ đổi giao diện; Muse đọc code để lấy đúng nhãn.
- Menu đã gộp ở T03 (`menu` + `menuV41`, file 41/43): Muse sửa thẳng. Nền dùng `ASSETS["menu_keyart"]` (1920×1080, trái tối sẵn để đặt menu).

## 6. Thiên kiếp (spec `breakthrough.md`) → T45
- Vòng `ring` có tâm (640, 35x) trong sân Lôi Đài; bán kính/độ rộng/khoảng nghỉ giữa đợt lấy **nguyên từ** `v30TrialZone`/`v30TrialTick` (src/20) — không đổi.
- Cảnh mở đầu: chạy **trước** khi `v30TrialStart()` đặt `t.zone` đầu tiên (đồng hồ đợt chỉ bắt đầu khi cảnh mở đầu xong/bị bỏ qua). Space/Esc chỉ bỏ qua cảnh mở đầu, không truyền xuống handler khác trong lúc đó.
- Thắng/thua: móc vào `v30TrialEnd(ok)`. Không đổi sát thương, số đợt.

## 7. Ảnh
- Đã nạp: `menu_keyart`, `interior_{herbalist,shop,wanderer,sentry}_concept` (WebP). Năm ảnh phòng dùng chung bố cục với `inn` → T24 làm được cả 5 phòng với cùng toạ độ vật cản `V36_FURN` (đối chiếu từng ảnh).
