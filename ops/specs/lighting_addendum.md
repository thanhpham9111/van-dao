# Phụ lục T21 — xác nhận code cho T22 (Claude, 21/11/2026)

Trả lời các điểm T21 nhờ Claude xác nhận. Điểm gắn render cụ thể (sau T08) sẽ bổ sung vào cuối file này khi T08 xong.

## 1. Đồng hồ — mốc giờ của spec ĐÚNG
- `p.worldTime` tăng `+= dt` (giây thật) trong vòng update → **một ngày = 360 giây = 6 phút thật**. Không wrap trong save (tăng mãi) → luôn dùng `p.worldTime % 360`.
- Quy ước có sẵn: `giờ = (p.worldTime % 360) / 15` — dùng bởi `hdSun()` (src/04) và lịch NPC (src/05). Khớp bảng T21 §2.2 (0 = 00:00, 180 = 12:00). Dùng y nguyên.
- Save mới bắt đầu `p.worldTime = 145` → 09:40 sáng.
- Lớp đêm cũ trong `owWeather()` (src/03) dùng công thức KHÁC (sáng nhất ~03:36): đây là hệ cũ lệch → **T22 thay thế phần tô đêm + ánh đèn nhà của `owWeather`** bằng grading T21 (giữ phần mưa/tuyết/lá của nó nếu không trùng §6.2; nếu trùng thì thay bằng hạt §6.2). Không để 2 hệ ngày–đêm cùng chạy.

## 2. Hệ ánh sáng có sẵn (để thay, không cộng thêm)
| Hệ | Ở đâu | Xử lý trong T22 |
|---|---|---|
| Bóng theo mặt trời `hdSun()` + `hdShadow()` (hướng bóng đổi theo giờ, `dx` lật lúc 12h) | src/04, bộ vẽ thế giới HD | Đổi sang hướng sáng CỐ ĐỊNH trên-trái như T21 §2.2 (bóng lệch phải-xuống), độ dài bóng theo §4.2; không còn lật hướng theo giờ |
| Tô đêm + đèn nhà `owWeather()` | src/03 | Thay bằng grading §2.4 + đèn §3 (đèn nhà = nguồn "cửa sổ sáng", anchor = `OW_HOUSES`) |
| Mưa/tuyết/lá `owWeather()` | src/03 | Gộp vào hệ hạt §6.2 |
| `33_atmosphere.js` (V42) | src/33 | Muse đọc trước, nếu có tô màu/sương toàn màn thì gộp vào T22 |
| Thôn mới V47T (`v47tDraw`, src/48) | — | **Chưa có ngày–đêm/ánh sáng gì** → T22 thêm grading + bóng cho hero tại đây; hero vẽ bằng `v47tDrawHero()` (sprite `v48idle`/`v48run*`), KHÔNG phải `v9HeroBody` |

## 3. Cài đặt Đồ họa → tier T21 §8
`v41Quality()`: `0` Tiết kiệm → **Tối giản** · `1` Cân bằng → **Nhẹ** · `2` Cao → **Đầy đủ**. Không thêm cài đặt mới. Kết hợp HiDPI T28 (`RS.k`): lớp ánh sáng nội bộ có thể vẽ ở 1280×720 rồi scale, như §8 cho phép.

## 4. Hướng sáng
Tranh thôn V47T có đèn/bóng vẽ sẵn hướng trên-trái → giữ vector (-0.707,-0.707) cho mọi vùng. Nếu một vùng thế giới mở có tranh/tile lệch hướng rõ, tắt rim vùng đó (không quay nền) — Muse báo Claude kèm ảnh.

## 5. Sương xa fallback (§6.1)
Tranh thôn V47T: dải trên cùng màn hình là mái nhà/kiến trúc GẦN, không phải phong cảnh xa → **tắt sương fallback ở V47T**. Thế giới mở: chờ T08 xác nhận lớp xa.

## 6. Bảng màu cảnh quan
Bảng màu scene §2.2/§2.3 (ngoài bảng C) — Claude duyệt thay chủ dự án ở mức kỹ thuật (không neon, multiply kẹp ≥0,55, screen ≤0,075). Chủ dự án xem ảnh thử ở T22 rồi quyết định giữ hay chỉnh.
