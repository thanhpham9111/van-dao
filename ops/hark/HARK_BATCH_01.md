# GÓI VIỆC 01 CHO HARK — Tìm âm thanh thật cho game + tư liệu tham khảo + lời thoại sơn môn

Chào Hark. Bạn vào nhóm làm game HTML5 tu tiên **"Vạn Đạo Tu Tiên"** (2D nhìn 3/4 kiểu ARPG, chủ dự án người Việt). Nhóm hiện có: Claude (code chính, ghép mọi thứ), ChatGPT (vẽ map/kiến trúc), Gemini (vẽ nhân vật), Muse (code nháp). **Bạn được giao vì bạn duyệt web và tải file được**: game hiện **chưa có một file âm thanh nào**, toàn bộ nhạc và tiếng động đang tổng hợp bằng code nên nghe rất "máy". Thôn tân thủ vừa đổi thành **ngoại môn một tông môn tiên hiệp** (ảnh `tham_chieu/son_mon_concept.jpg`).

Làm theo thứ tự H1 → H3. Làm được phần nào nộp phần đó.

---

## H1 — Âm thanh miễn phí bản quyền (ƯU TIÊN)
Tìm trên các kho âm thanh miễn phí có giấy phép rõ ràng (ví dụ Freesound, OpenGameArt, Pixabay Audio, Kenney, Sonniss GDC bundle…).

**Giấy phép bắt buộc:** ưu tiên **CC0 / Public Domain / Pixabay License**. CC-BY chấp nhận được nếu ghi đủ tác giả. **Không lấy** CC-BY-NC, CC-BY-ND, "chỉ dùng cá nhân", hay file không ghi giấy phép.
**Định dạng:** `.ogg` hoặc `.mp3` (hoặc `.wav` để Claude tự chuyển). Tiếng động ≤ 3 giây, nhạc nền vòng lặp 1–3 phút, cắt đầu cuối liền mạch nếu được.

| Nhóm | Cần | Mô tả âm thanh |
|---|---|---|
| Nhạc nền | 4 | (1) thôn/sơn môn yên bình: cổ cầm/sáo trúc/đàn tranh, (2) rừng trúc thám hiểm, (3) chiến đấu nhịp nhanh có trống, (4) menu chính trang trọng. Phong cách Trung Hoa cổ, **không lời hát**. |
| Môi trường | 5 | gió nhẹ qua rừng trúc; suối/sông chảy; chim hót buổi sáng; dế + ếch đêm; tiếng chuông chùa lớn ngân xa |
| Chiến đấu | 8 | vung kiếm (2 kiểu), kiếm chém trúng thịt, kiếm chạm kim loại, phép nước/băng bắn ra, phép lửa nổ, bị đánh trúng (rên ngắn), quái chết |
| Di chuyển | 4 | bước chân trên đất, trên đá lát, trên gỗ (cầu), lướt nhanh (whoosh) |
| Giao diện | 6 | bấm nút (gỗ/giấy), mở bảng (cuộn giấy), đóng bảng, nhặt vật phẩm (leng keng), lên cấp (chuông ngân + âm sáng), thông báo nhiệm vụ |
| Tương tác | 4 | múc nước giếng, thắp hương, lò rèn đập búa, cá quẫy nước |

**Nộp H1:**
- `HARK_01_audio.zip`: các file đặt tên theo mã: `bgm_thon`, `bgm_truc`, `bgm_combat`, `bgm_menu`, `amb_wind`, `amb_river`, `amb_birds`, `amb_night`, `amb_bell`, `sfx_swing_1`, `sfx_swing_2`, `sfx_hit_flesh`, `sfx_hit_metal`, `sfx_spell_water`, `sfx_spell_fire`, `sfx_hurt`, `sfx_enemy_die`, `step_dirt`, `step_stone`, `step_wood`, `sfx_dash`, `ui_click`, `ui_open`, `ui_close`, `ui_pickup`, `ui_levelup`, `ui_quest`, `sfx_well`, `sfx_incense`, `sfx_forge`, `sfx_fish`.
- `HARK_01_audio_credits.csv` với cột: `mã, tên gốc, tác giả, giấy phép, link trang nguồn, link tải, thời lượng (s)`. **Mỗi file đều phải có dòng này.** Không chắc giấy phép thì bỏ file đó.
- Nếu không tải được file về: nộp bảng CSV với **link tải trực tiếp**, chủ dự án sẽ tự tải.

## H2 — Tư liệu tham khảo (ngắn)
Tìm 15–20 ảnh chụp màn hình thật (link trang + link ảnh) của game 2D/2.5D nhìn từ trên xuống, chủ đề tu tiên/kiếm hiệp, ở **khu tông môn / làng khởi đầu** và **HUD**. Gợi ý: Tale of Immortal, Immortal Life, Wandering Sword, Gujian, Sands of Salzaar, Titan Quest, Children of Morta. Mỗi dòng: `game | link ảnh | điều nên học (1 câu: bố cục, ánh sáng, đổ bóng, mật độ đồ trang trí, cách vẽ đường đi…)`.
Nộp `HARK_01_references.md`.

## H3 — Lời thoại & nhiệm vụ ngoại môn (tiếng Việt, giọng tiên hiệp)
Viết đúng định dạng JSON dưới (file `HARK_01_sect_text.json`):
```json
{
  "chatter": ["30 câu đệ tử ngoại môn nói khi đi ngang người chơi, mỗi câu ≤ 60 ký tự, đời thường trong tông môn: quét sân, luyện kiếm, hái thuốc, sợ trưởng lão, đồn đại về động phủ…"],
  "instructor": ["6 câu của giáo đầu sân luyện kiếm (nghiêm, ngắn, có khích lệ)"],
  "elder_greet": ["4 câu trưởng lão ngoại môn chào đệ tử mới"],
  "spring": ["3 câu khi uống linh tuyền"],
  "incense": ["3 câu khi thắp hương trước Đại điện"],
  "seal": ["3 câu khi chạm phù ấn động phủ còn phong (gợi ý phải lập công trước)"],
  "daily_tasks": [
    {"id":"om_1","name":"tên ≤ 16 ký tự","desc":"≤ 90 ký tự, việc vặt ngoại môn: quét Tàng kinh các, tưới dược viên, gánh nước linh tuyền, đánh 20 nhát mộc nhân, đưa thư lên Đại điện, nhặt lá ở quảng trường…","type":"talk|visit|train|gather","target":"inn|shop|herbalist|wanderer|sentry|v13_forge|v13_market|v13_board|v13_farm|training|well_1|bell_1","need":1,"merit":5,"stones":10}
  ]
}
```
`daily_tasks`: 10 nhiệm vụ. `target` chỉ được lấy trong danh sách đã ghi. Không dùng tên riêng của game/phim/truyện có thật.

---
## Lưu ý chung
- Không gửi mật khẩu hay tài khoản. Không trả tiền mua tài nguyên.
- Nếu một kho đòi đăng nhập mới tải được, ghi link vào CSV, không tạo tài khoản.
- Nộp: `HARK_01_audio.zip` (hoặc chỉ CSV), `HARK_01_references.md`, `HARK_01_sect_text.json`, kèm `HARK_01_REPORT.md` (đã làm gì, chỗ nào chưa chắc).
