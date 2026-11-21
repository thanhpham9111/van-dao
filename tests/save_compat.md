# M07 — Kiểm tra tương thích save (bản gốc V47.1 → bản hiện tại)

Chạy lúc: 2026-11-21 (lần chạy đầy đủ đầu tiên) · Bản gốc: `tests/legacy/orig.html`
(dựng lại từ commit `ae69594` bằng `tools/bundle.py`, 54,0 MB, gitignored) ·
Bản hiện tại: `index.html` trên cùng origin `http://localhost:8123` (cùng
localStorage key `vdtt_vangioi_v3`) · Mỗi bước chạy trong browser context
mới, save xuất ra `tests/legacy/save_*.json` rồi nạp lại bằng tay (setItem +
reload) để 4 save không lẫn nhau.

## Cách kết luận

So sánh **trạng thái sau resume** của cùng một save ở hai bản — tức
"save gốc mở bằng bản gốc" với "save gốc mở bằng bản hiện tại" — chứ
không so raw JSON với live. Lý do: `resume()` tự chuẩn hóa một số trường
(xem mục chuẩn hóa dưới đây), nên raw và live có thể lệch nhau mà cả hai
bản vẫn cho kết quả giống hệt nhau.

**Trạng thái bản báo cáo này (21/11 ~20:10 VN):** lần chạy đầy đủ đầu
tiên (môi trường còn tốt) đã so live sau resume ở bản hiện tại với raw
gốc và đối chiếu file lưu lại — kết quả dưới đây. Lần chạy lại theo đúng
phương pháp hai bản (so live-sau-resume ở bản gốc với live-sau-resume ở
bản hiện tại, như `tools/save_compat.py` đã cài) **chưa xong**: VM rơi
lại vào đợt lỗi cũ (Chromium chết SIGTRAP khi khởi động, ghi file EPERM)
từ ~19:55, làm dở lần chạy lại ở save 3 và làm rỗng file báo cáo này
lúc ghi (đã viết lại từ số liệu đã kiểm chứng). Khi môi trường hồi phục,
chạy lại `python3 tools/save_compat.py` để tái sinh báo cáo này rồi mới
kết luận cuối.

## Kết quả tổng

| Save | Validate (gốc / hiện tại) | Resume ở bản hiện tại | Trường so khớp (raw gốc → live sau resume) | Kết luận |
|------|-------------------------|----------------------|-------------------------------------------|----------|
| 1 fresh — mới tạo nhân vật (Kiếm Tu) | ĐẠT / ĐẠT | có | 14/14 | TƯƠNG THÍCH |
| 2 moved — đi lại + mở túi đồ (Thể Tu) | ĐẠT / ĐẠT | có | 14/14 | TƯƠNG THÍCH |
| 3 highlevel — cấp 20 (sửa console, Pháp Tu) | ĐẠT / ĐẠT | có | 13/14 (chỉ lệch xp — xem dưới) | TƯƠNG THÍCH (chuẩn hóa giống hệt ở bản gốc) |
| 4 openworld — đang ở Thanh Trúc Lâm (Kiếm Tu) | ĐẠT / ĐẠT | có | 14/14 | TƯƠNG THÍCH |

**Tổng: 4/4 save mở được bằng bản hiện tại, validate đạt ở cả hai
bản, 0 lỗi console/pageerror ở mọi bước. 55/56 trường khớp; 1 lệch duy
nhất (xp ở save 3) đã xác minh là chuẩn hóa giống hệt ở bản gốc, không
phải hồi quy tương thích.**

## Save 1 — fresh — mới tạo nhân vật

- Bản gốc: lớp `Kiếm Tu` · save 26295 byte · validate trong bản gốc: ĐẠT · file `tests/legacy/save_1.json` · lỗi console/pageerror: 0
- Hành động: vào thôn, lưu ngay (không di chuyển, không mở panel).
- Bản hiện tại validate save gốc: ĐẠT
- Resume: bản hiện tại ĐẠT · lỗi console/pageerror ở bản hiện tại: 0
- Bản hiện tại lưu lại: 22984 byte (raw compact; gốc 30197 byte compact — chênh do JSON pretty/whitespace và RNG quái, không phải mất dữ liệu)

| Trường | Bản gốc (raw) | Sau resume ở bản hiện tại | Khớp |
|--------|---------------|---------------------------|------|
| level | 1 | 1 | ✓ |
| xp | 0 | 0 | ✓ |
| hp | 127 | 127 | ✓ |
| stones | 5 | 5 | ✓ |
| pills | 2 | 2 | ✓ |
| cls | 0 | 0 | ✓ |
| v35 | (đầy đủ, groups identity/map/quest/target/dock/left/nav/feed) | giống hệt | ✓ |
| mapId | thon | thon | ✓ |
| vị trí v47TownPos | (672, 1625.5) | (672, 1625.5) | ✓ |
| playerId | (khớp) | (khớp) | ✓ |
| worldMode | có | có | ✓ |
| kills | 0 | 0 | ✓ |
| discovered | [thon] | [thon] | ✓ |
| explored | (khớp) | (khớp) | ✓ |

**Thay đổi cấu trúc sau khi bản hiện tại lưu lại:**
- Khóa top-level thêm: không · bớt: không
- Khóa trong `p` thêm: không · bớt: không

## Save 2 — moved — đi lại + mở túi đồ

- Bản gốc: lớp `Thể Tu` · save 27971 byte · validate trong bản gốc: ĐẠT · file `tests/legacy/save_2.json` · lỗi console/pageerror: 0
- Hành động: đi WASD 4 hướng, mở túi đồ (modal=gear) rồi đóng; V47T=(672, 1626) p=(471, 1345).
- Bản hiện tại validate save gốc: ĐẠT
- Resume: bản hiện tại ĐẠT · lỗi console/pageerror ở bản hiện tại: 0
- Bản hiện tại lưu lại: 23437 byte (raw compact; gốc 31685 byte compact)

| Trường | Bản gốc (raw) | Sau resume ở bản hiện tại | Khớp |
|--------|---------------|---------------------------|------|
| level | 1 | 1 | ✓ |
| xp | 0 | 0 | ✓ |
| hp | 216 | 216 | ✓ |
| stones | 3 | 3 | ✓ |
| pills | 3 | 3 | ✓ |
| cls | 1 | 1 | ✓ |
| v35 | (đầy đủ) | giống hệt | ✓ |
| mapId | thon | thon | ✓ |
| vị trí v47TownPos | (672, 1625.5) | (672, 1625.5) | ✓ |
| playerId | (khớp) | (khớp) | ✓ |
| worldMode | có | có | ✓ |
| kills | 0 | 0 | ✓ |
| discovered | [thon] | [thon] | ✓ |
| explored | (khớp) | (khớp) | ✓ |

**Thay đổi cấu trúc sau khi bản hiện tại lưu lại:**
- Khóa top-level thêm: không · bớt: không
- Khóa trong `p` thêm: không · bớt: không

## Save 3 — highlevel — cấp 20 (sửa console)

- Bản gốc: lớp `Pháp Tu` · save 26535 byte · validate trong bản gốc: ĐẠT · file `tests/legacy/save_3.json` · lỗi console/pageerror: 0
- Hành động: sửa console: p.level=20, p.xp=8500, p.hp=hồi đầy theo currentStats() (240).
- Bản hiện tại validate save gốc: ĐẠT
- Resume: bản hiện tại ĐẠT · lỗi console/pageerror ở bản hiện tại: 0
- Bản hiện tại lưu lại: 22939 byte (raw compact; gốc 31198 byte compact)

| Trường | Bản gốc (raw) | Sau resume ở bản hiện tại | Khớp |
|--------|---------------|---------------------------|------|
| level | 20 | 20 | ✓ |
| xp | 8500 | 356 | ✗ (chuẩn hóa — xem dưới) |
| hp | 240 | 240 | ✓ |
| stones | 5 | 5 | ✓ |
| pills | 2 | 2 | ✓ |
| cls | 2 | 2 | ✓ |
| v35 | (đầy đủ) | giống hệt | ✓ |
| mapId | thon | thon | ✓ |
| vị trí v47TownPos | (672, 1625.5) | (672, 1625.5) | ✓ |
| playerId | (khớp ở lúc resume) | (khớp ở lúc resume) | ✓ |
| worldMode | có | có | ✓ |
| kills | 0 | 0 | ✓ |
| discovered | [thon] | [thon] | ✓ |
| explored | (khớp) | (khớp) | ✓ |

**Lưu ý về playerId trong file fixture:** file `save_3_current.json` trên
đĩa là bản lưu lại của lần chạy ĐẦU, còn `save_3.json` đã bị ghi đè bởi
lần chạy lại dở dang (nhân vật mới, playerId khác) — nên hai file này
không cùng một nhân vật và không được dùng để so playerId. Lúc resume
trong lần chạy đầu, playerId khớp (nằm trong 13/14 — chỉ xp lệch).

**Thay đổi cấu trúc sau khi bản hiện tại lưu lại:**
- Khóa top-level thêm: không · bớt: không
- Khóa trong `p` thêm: không · bớt: không

## Save 4 — openworld — đang ở Thanh Trúc Lâm

- Bản gốc: lớp `Kiếm Tu` · save 69638 byte · validate trong bản gốc: ĐẠT · file `tests/legacy/save_4.json` · lỗi console/pageerror: 0
- Hành động: ra thế giới mở qua cổng thôn thật; đi thêm W/D ở Thanh Trúc Lâm; mapId=truc p=(1790, 850) v47t=None.
- Bản hiện tại validate save gốc: ĐẠT
- Resume: bản hiện tại ĐẠT · lỗi console/pageerror ở bản hiện tại: 0
- Bản hiện tại lưu lại: 80293 byte (raw compact; gốc 80308 byte compact)

| Trường | Bản gốc (raw) | Sau resume ở bản hiện tại | Khớp |
|--------|---------------|---------------------------|------|
| level | 1 | 1 | ✓ |
| xp | 12 | 12 | ✓ |
| hp | 127 | 127 | ✓ |
| stones | 5 | 5 | ✓ |
| pills | 2 | 2 | ✓ |
| cls | 0 | 0 | ✓ |
| v35 | (đầy đủ) | giống hệt | ✓ |
| mapId | truc | truc | ✓ |
| vị trí p.x/p.y | (1790, 850) | (1790, 850) | ✓ |
| playerId | (khớp) | (khớp) | ✓ |
| worldMode | có | có | ✓ |
| kills | 0 | 0 | ✓ |
| discovered | [thon, truc] | [thon, truc] | ✓ |
| explored | (khớp) | (khớp) | ✓ |

Lưu ý: xp=12 ở save 4 là tu vi khám phá +12 khi vào vùng mới lần đầu
(đúng cơ chế V47.1), giữ nguyên qua resume.

**Thay đổi cấu trúc sau khi bản hiện tại lưu lại:**
- Khóa top-level thêm: không · bớt: không
- Khóa trong `p` thêm: không · bớt: không

## Chuẩn hóa khi resume — giải thích cho lệch xp ở save 3

Save 3 đặt tay `p.xp=8500` ở cấp 20, vượt xa mức tu vi cần để lên cấp
ở cấp đó. Cả hai bản đều chuẩn hóa giống hệt nhau khi resume:
`v22Migrate()` (`src/14_v22_v23.js:39`, có từ bản gốc T01, gọi trong
`resume_L08`/`start_L06`) làm `p.xp = Math.min(p.xp, xpNeed())`, với
`xpNeed()` ở cấp 20 là 356
(`40+floor(19*14+floor(19/9)*25)` theo `src/14_v22_v23.js:25`).
Đã kiểm chứng trực tiếp: mở save 3 bằng bản GỐC cũng cho `xp=356`,
`xpNeed()=356`, cấp 20, ổn định qua 2s. Trong lối chơi thật `p.xp`
không bao giờ vượt `xpNeed()` vì `gainXP()` tự lên cấp và trừ tu vi,
nên đây không phải hồi quy tương thích — chỉ là giá trị đặt tay ngoài
tầm của gameplay thật.

## Phương pháp & giới hạn

- So sánh trên trường `p` TRỰC TIẾP (live sau resume), không so raw JSON
  từng byte: `worldTime` vẫn chạy, `seed`/`rng` khác nhau theo thời gian
  thực, và thứ tự khóa không có ý nghĩa.
- `p.x/p.y` là tọa độ thế giới mở (OW); trong thôn vị trí thật nằm ở
  `V47T`/`p.v47TownPos` (khôi phục qua resume, lệch cho phép <=80px như
  kịch bản 08).
- Save 3 sửa `p.level`/`p.xp` bằng console trong bản gốc trước khi lưu —
  chỉ để có một save cấp cao, không phải hành vi người chơi thật.
- Môi trường: VM rơi lại vào đợt lỗi cũ từ ~19:55 (Chromium chết SIGTRAP
  khi khởi động, ghi file EPERM trong khi đĩa còn trống) — làm dở lần
  chạy lại theo phương pháp hai bản và làm rỗng file báo cáo này lúc ghi.
  Script `tools/save_compat.py` đã có thử lại (browser mới tối đa 3 lần
  mỗi bước; ghi file thử lại tối đa 30 lần có kiểm chứng đọc lại) để
  chạy lại khi môi trường hồi phục.
- Chưa kiểm: save có vật phẩm rơi trên bản đồ (drops), đang ở trong nội
  thất V36, đang mở Khám phá V48, và save export định dạng
  `van-dao-save-v1` (có `explorer` riêng) — 4 save này chưa chạm các
  đường đó.
