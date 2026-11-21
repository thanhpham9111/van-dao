# Review T12 — HUD chiến đấu (Claude, 21/11/2026)

**Kết luận: CHƯA DONE. Trả về ChatGPT sửa 7 điểm dưới đây.** Phần lớn spec tốt (thông số hit-stop/shake/flash, máu trễ boss, giới hạn hạt, kịch bản kiểm thử). Chỗ lệch chủ yếu vì spec giả định HUD chiến đấu chưa có, trong khi game ĐÃ có sẵn dock chiến đấu.

## A. Trả lời mục 9 — tên thật trong code

| Nhu cầu | Tên thật | Ghi chú |
|---|---|---|
| Đang chiến đấu? | `v45CombatHUD()` → true khi `V45_HUB.combat`, đang ở sân luyện (`v42tActive()`), có mục tiêu (`v34Target()`), hoặc đang ra chiêu (`V26.action/stage/hits`) | **Đã có sẵn** → dùng hàm này, KHÔNG dùng cửa sổ 4.000ms tự đặt. Ở thôn an toàn: `v45Hub()` = true |
| Lần đánh trúng gần nhất | `V34.lastHit` (giây, cùng đồng hồ `elapsed`) | |
| HP/MP | `p.hp`, `p.mp`, `currentStats().hp/.mp` | đúng như spec |
| Kỹ năng | `V11_SKILLS[p.cls][i]` (i = 0..3 hiển thị; dữ liệu có 5) → `{name, desc, lv, cost, cd, kind, color, key}` | `cost` = MP, `cd` = hồi chiêu tổng (giây) |
| Phím kỹ năng | `key`: ô 1 = **Chuột phải (RMB)**, ô 2 = `1`, ô 3 = `2`, ô 4 = `3` | KHÔNG phải 1–4 |
| Cấp kỹ năng / khoá | `v11Levels()[i]` (0 = chưa học → khoá) | |
| Hồi chiêu còn lại | `v11Cooldowns()[i]` (giây) | |
| Thi triển | `v11Cast(i)` (đã tự từ chối khi thiếu MP / đang hồi / chưa học) | |
| Đánh thường | chuột trái, hồi `p.atkCd`, tổng `max(.27, .39/currentStats().rate)` | |
| Khinh công | phím Space, hồi `p.dashCd`, tổng `currentStats().dashCd` | |
| Đan dược | phím H, số lượng `p.pills`, gọi `heal()` | |
| Mục tiêu | `v34Target()` → quái đang nhắm (`V23.target`/`V34.target`), nếu không có thì boss gần nhất trong 650px | |
| HP quái | `e.hp`, `e.max`; tên `TYPES[e.type].name`; cấp `v22EnemyLevel(e)`; tinh anh `e.elite`; boss `bossType(e.type)` | |
| Pha boss | `v27AI(e).phase` (1–3, pha 3 = "Cuồng nộ") | **Đã có pha thật** |
| Kết quả trúng | `hit(e, dmg, crit)` → có cờ `crit`. Lượng trừ thật = `amount` trong `hit` | `hit` còn 11 lớp vá → chờ T07 |
| Người chơi nhận đòn | `damagePlayer(n)`; lượng thật `d` | không có cờ chí mạng |
| Né/chặn | **KHÔNG có sự kiện.** Đang lướt (`p.dashT>0`) hay đang bất tử (`p.hurt>0`) thì `damagePlayer` lặng lẽ bỏ qua | |
| Số bay | `floating(x,y,text,color)` → mảng `numbers`, sống 0,85s | đã có, nâng cấp thay vì làm mới |
| Rung màn | biến `shakes` (đặt 6 khi bị đánh) + công tắc người chơi `screenShake` (Cài đặt → "Rung màn hình", lưu ở `v42-access`) | |
| Hit-stop | **chưa có** | làm mới, chỉ ở lớp trình diễn như spec |

## B. Cần sửa

1. **Dock chiến đấu đã có 7 ô, không phải 4.** `v35Dock` (x388, y614, w504) đang hiện: Đánh thường (chuột trái) · 4 kỹ năng · Khinh công (Space) · Hồi Xuân Đan (H), kèm thanh HP/MP ngay trên. Spec phải nói rõ số phận 3 ô ngoài kỹ năng: giữ (đề xuất: 4 kỹ năng ở giữa, đánh thường + khinh công + đan dược nhỏ hơn hai bên), hay chuyển đi đâu. Không được làm mất khinh công/đan dược khỏi màn hình chiến đấu.
2. **HP/MP đang nằm trong dock dưới-giữa.** Spec chuyển lên trên-trái. Được, nhưng ghi rõ là *bỏ* HP/MP khỏi dock để không hiện 2 lần, và vị trí phải khớp T10.
3. **Trạng thái chiến đấu:** thay mục 2 "cửa sổ 4.000ms" bằng `v45CombatHUD()` có sẵn (bảng A). Chỉ giữ hiệu ứng fade 200ms khi chuyển.
4. **Phím:** ô 1 là Chuột phải, ô 2–4 là phím 1, 2, 3. Sửa mọi chỗ ghi 1–4.
5. **Boss có pha thật** (`v27AI(e).phase`, pha 3 "Cuồng nộ"). Thêm nhãn pha nhỏ cạnh tên boss (ví dụ "II", "III · Cuồng nộ") thay cho câu "không thêm phase". Vẫn không chia thanh máu theo phân đoạn giả.
6. **Bỏ "Né tránh"/"Đỡ đòn"** ở mục 6, 7, 12 vì game không có sự kiện này. Ghi vào "Không làm".
7. **Giảm hiệu ứng:** ghi rõ khi `screenShake === false` thì tắt cả rung lẫn hit-stop (mục 6 đang viết chung chung "nếu game đã có thiết lập").

## C. Phụ thuộc

- T12 dựa nhiều vào T10 (toạ độ cụm nhân vật x24–336, thanh tu vi đáy, cụm nút hành động). **T10 chưa nộp** → nộp T10 trước, rồi rà lại toạ độ T12 cho khớp.
- Code T13 còn chờ T07 (gộp `hit`/`damagePlayer`/`renderEffects`, Claude làm).
