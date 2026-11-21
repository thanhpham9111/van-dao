# T37 — Menu chính & Tạo nhân vật v1.2

21/11/2026 · B6 Gói 02 · ảnh menu.png, tao_nhan_vat.png · F5, T21 §5. Mục tiêu: ấn tượng đầu tiên là tranh núi tiên hiệp HD + thư pháp giản dị, phái rõ tính cách. Giữ mọi hành động hiện hữu, không thêm chế độ chơi.

## 1. Key art và lớp nền

`assets/menu_keyart.png`: PNG 16:9 ≥1920×1080, núi đá thủy mặc phủ biển mây, tu sĩ nhỏ đứng trên vách đá bên phải nhìn về núi xa, nét vẽ HD tông ấm khớp thôn, không chữ/logo/UI. Vùng an toàn UI trái 0–48% ít chi tiết, nhân vật ở x khoảng 0,75W, y 0,62H, không bị title che. Canvas vẽ cover 1280×720, crop cân giữa nếu ảnh đúng tỷ lệ; không zoom quá 1,02 lần. Nếu thiếu ảnh dùng nền menu V47 hiện có, không thay asset đã chạy.

Lớp order: nền key art tĩnh → haze mỏng → hạt lá → veil tương phản → ornament + UI → modal xác nhận. Key art nộp đã có nền tối trái, chỉ phủ ink #100b13 tối đa .22 ở x0 xuống .08 ở x420, 0 tại x680. Khi fallback ảnh menu V47 cũ chưa có veil, dùng .72/.38/.08/0 ở x0/420/680/900; không cộng cả hai hoặc phủ tâm điểm ảnh. Trên toàn nền paper #f1e4cf .035 (vân giấy) + gold #e3b96f .06 ở rìa sáng; không dùng grade ngày/đêm gameplay, không tạo nguồn sáng tương tác. Viền kép (24,24,1232,672), inset 5px, gold .28/.12 1px. T21 vật liệu ấm, cache texture và gradient; chữ không tint. Cạnh ngang mảnh, cọ mực đen mờ, không neon.

Mây/sương: 2 dải alpha .08/.11 paper, rộng 400–680px, y160–370 và 410–510, dịch ngang 5/9px/s, wrap ngoài khung, fade rìa 80px; chỉ là lớp phủ, không nhân đôi mây baked. Lá nhỏ 3–5 hạt (4–8px) màu muted #b5a18b/gold, trôi 12–18px/s ngang và 9–16px/s xuống, xoay 12°/s, alpha ≤.35, chỉ ở x>650. Tùy đồ họa gốc, low giảm bỏ hạt, haze tĩnh; không thêm cài đặt. Không jitter/chuyển động camera mạnh; 60fps mục tiêu. Menu và tạo nhân vật dùng cùng nền, chuyển opacity 180ms, không tải lại ảnh giữa hai màn.

## 2. Menu chính (1280×720)

| Khối | Rect x,y,w,h | Thiết kế |
|---|---|---|
| Logo chữ | 76,65,480,138 | hai dòng VẠN ĐẠO / TU TIÊN, V18Serif 60px, line 67, paper, bóng ink 2px, không logo trong ảnh |
| Dòng ấn | 80,212,440,38 | THANH VÂN (V18Serif 22 gold), version từ BUILD_VERSION 12 muted, nét ngang gold .45 |
| Nút chính | 80,280,374,52 | Bắt đầu hành trình (chưa save) hoặc Tiếp tục (save hợp lệ) |
| Nút tạo mới | 80,340,374,44 | Tạo nhân vật mới (chỉ khi có save); chưa save không để hàng rỗng |
| Hướng dẫn | 80,392,374,44 | Hướng dẫn điều khiển |
| Bảo toàn | 80,444,374,44 | Bảo toàn hồ sơ (giữ cơ chế xuất/nhập/backup gốc, không đoán action) |
| Cài đặt | 80,496,174,42 / 262,496,192,42 | Âm thanh: Bật/Tắt và Đồ họa: mức thật; giữ đường Cài đặt… nếu runtime có |
| Footer | 80,654,424,24 | Chơi offline · Tiến trình lưu trên thiết bị |

Không có save: ẩn nút Tạo nhân vật mới vì Bắt đầu đã dẫn tới tạo mới; dồn ba hàng còn lại lên 52px (Hướng dẫn y340, Bảo toàn y392, cài đặt y444). Có save: Tiếp tục + tạo mới đều hiện; không chặn menu khi save lỗi, dùng thông báo/khôi phục gốc, không tự xóa. Nếu nút Cài đặt… riêng đã tồn tại ở runtime, dùng (80,548,374,42), không thay hai nút ảnh hiện tại. Tiêu đề giữ bên trái, tâm điểm tranh x>800 y>300 không có chữ đè.

Nút ornament/box: ink .80, viền gold .36, text paper V45Sans 16, action chính nền gold .14, dấu triện nhỏ gold bên trái 3×28 ở x+4,y+12; mũi tên cuối x+w−24. Hover 120ms chuyển viền gold .8 + nền gold .16; press 90ms hạ 1px, focus/điều hướng theo handler cũ. Disabled ink .5, text muted, lý do khi hover; không bấm xuyên nền. Tiêu đề fade 420ms một lần khi vào menu; các nút cùng tương tác ngay khi nhận input, không chờ animation.

## 3. Tạo nhân vật

Giữ ba phái `V10_SCHOOLS`, p.cls 0/1/2; thẻ là lựa chọn phái ban đầu, không phải tông môn. Giữ artwork 3 phái hiện có, không tạo tranh làm thay đổi giới tính/ngoại hình save. Nền cùng key art, overlay sau card ink .58 ở x56–860, giảm opacity ở mép phải.

| Khối | Rect | Thiết kế |
|---|---|---|
| Tiêu đề gọn | 80,54,650,70 | V18Serif 38 “Vạn Đạo Tu Tiên”; dòng 18 “Chọn đạo thống” |
| 3 thẻ dọc | 80+i×182,150,170,250 (i0..2) | Ảnh clip 162×190 x+4,y+4, tên y+184, role y+213 (2 dòng) |
| Thông tin phái | 642,150,382,250 | tên, danh hiệu, 4 thanh chỉ số thực và hai chiêu gốc |
| Đạo hiệu | 80,424,100,36 / 184,424,350,36 | label + input DOM hiện hữu, V45Sans 16, viền gold, placeholder “Nhập đạo hiệu (tùy chọn)” |
| Nhập thế | 80,482,350,52 | “Nhập thế · [tên phái]” |
| Quay lại | 442,482,170,52 | giữ nút ảnh hiện tại |
| Ghi chú | 80,548,532,42 | role ngắn/đạo hiệu tùy chọn; không có điểm phân bổ mới |

Ảnh thẻ chọn: nền ink .82, viền gold 2px + góc triện 14×14, ảnh sáng 1.0; thẻ khác viền muted .45, ảnh alpha .79; hover 120ms. Tên V18Serif 20 paper, role V45Sans 12/14. Click chỉ chọn p.cls dự kiến trong staging, chưa ghi save. Phái hiện mặc định theo logic V47, nếu chưa có mặc định dùng lựa chọn gốc, không tự tạo lớp thứ 4.

| Phái | Danh hiệu / đánh thường / kỹ năng | Vai |
|---|---|---|
| Kiếm Tu | Thanh Vân Kiếm Khách / Thanh Vân Trảm / Vạn Kiếm Xuyên Tâm | Cận chiến nhanh · chí mạng |
| Thể Tu | Huyền Thạch Võ Giả / Huyền Thạch Quyền / Chấn Sơn Băng Quyền | Chịu đòn · sát thương cận thân |
| Pháp Tu | Hàn Nguyệt Linh Sư / Linh Châu / Hàn Nguyệt Tam Tinh | Đánh xa · pháp thuật khống chế |

Panel phái: danh hiệu (656,162,354,24) serif18; 4 hàng Sinh lực/Linh lực/Công kích/Thân pháp ở y204+i×32, nhãn x656 w100, thanh mực (762,y+9,192,9) đậm jade .9 trên nền ink .6/viền gold .3; số x960 w48 căn phải. Lấy 4 số preview runtime thật của từng phái, không dùng currentStats của save đang chơi, không hardcode screenshot; dùng cùng max 3 phái trên từng hàng để so sánh, clamp 0..1, nếu max 0 không fill; hiển thị đúng đơn vị gốc. Hai dòng đánh thường/kỹ năng (656,338,354,50), 13px wrap. Tab đổi thẻ click, fade detail 120ms, không tạo hotkey. Thẻ có nhãn role đủ, không cắt chữ. DOM input giữ tên giới hạn/trim/IME và fallback Vô Danh theo start hiện tại, tọa độ logic map sang CSS screen theo T28; khi gõ tiếng Việt không trigger hotkey combat/menu, Enter chỉ theo handler sẵn có.

## 4. Save, xác nhận và tương tác

Chưa có save: Nhập thế gọi start/create hiện hữu đúng một lần; chỉ khi thành công chuyển sang thôn/cảnh gốc, fade ink 180ms vào + 180ms ra nếu không có transition. Có save: tạo mới mở màn chọn phái **không xóa save**; khi Nhập thế mới xác nhận ghi đè, modal (404,232,472,256), ink .94, viền gold .70; backdrop ink .52 toàn canvas; title “Ghi đè hồ sơ?” (428,250,424,32), nội dung (428,294,424,74) “Hành trình cũ sẽ bị thay thế khi nhập thế. Hãy bảo toàn hồ sơ trước nếu cần.”; Hủy (428,410,200,44), “Ghi đè và nhập thế” (642,410,210,44). Hủy/Esc đóng xác nhận, giữ phái/tên đang chọn; click ngoài không đồng ý. Không dùng mặc định Enter tự xác nhận nếu handler chưa có. Confirmation alpha 160/120ms; modal bắt input, hủy click xuyên xuống nền. Khóa double-submit ngay khi click và đến khi handler hoàn tất (ít nhất 450ms). Staging tên/phái không sửa save. Chỉ commit khi khởi tạo và ghi dữ liệu mới thành công qua flow hiện hữu bảo đảm dữ liệu cũ còn khôi phục được nếu ghi thất bại; không xóa trước. Nếu chưa xác thực giao dịch an toàn, tạm khóa nút xác nhận ghi đè (giữ Tiếp tục/Bảo toàn hồ sơ), yêu cầu Claude/Muse kiểm handler. Khi lỗi, báo bằng handler thật và không ghi đè lần thứ hai tự động. Không tự backup/xóa save, không ép ghi đè trước chọn phái. Tiếp tục gọi resume và giữ tiến trình, không dùng start; Bảo toàn hồ sơ giữ đúng hành động thực. Cài đặt âm thanh/đồ họa giữ giá trị hiện hữu và lưu gốc; không reset khi tạo mới.

## 5. Lần nhập thế đầu tiên và trở về hành trình

Mục tiêu: người chơi hiểu khác biệt của ba phái trong 30 giây đầu mà không cần đọc bảng dài. Giữ các thẻ, 4 thanh số thật, kỹ năng và lựa chọn §3. Không thêm tutorial bắt buộc, không tạo nhiệm vụ hoặc quà đăng nhập.

| Phái | Dòng hướng dẫn ngắn (ghi chú §3, 2 dòng) | Người chơi hiểu được |
|---|---|---|
| Kiếm Tu | Kiếm phong sắc bén. Áp sát, đánh nhanh, giữ đường lùi. | Cận chiến, chí mạng, cần đọc khoảng cách |
| Thể Tu | Căn cơ vững chắc. Lấy sức bền và nắm đấm mở đường. | Chịu đòn, cận chiến, không đồng nghĩa bất tử |
| Pháp Tu | Linh châu dẫn pháp. Giữ cự ly, đọc hướng địch mà ra chiêu. | Đánh xa, khống chế theo F5, không hứa kỹ năng mới |

Dòng chọn phái tại (80,548,532,42) ghi “Đường tu đã chọn: [phái]” 14px gold + câu gợi ý 13px paper, tối đa 2 dòng, fade 120ms. Click thẻ chuyển cả tên, artwork, số preview, kỹ năng và mô tả trong cùng frame; không giữ trạng thái phái cũ ở một phần panel. Mỗi card đang chọn có triện “Đã chọn” 12px ở (x+8,y+8,76,22), nền ink .75, không dựa riêng vào màu. Gõ tên IME không đổi card khi nhận chữ; hủy/Quay lại không commit tên.

**Tiếp tục:** nếu handler đã cung cấp metadata save hợp lệ mà không load/mutate, dùng khoảng trống (80,596,424,46) dưới menu ghi “Tên · Cảnh giới” và “Vùng cuối: [tên vùng]” từ snapshot thật, gold/paper 14/12px. Ẩn khi thiếu metadata, save lỗi hoặc không có save; không đọc tên/cấp từ p tạm. Không mở save đang chơi chỉ để lấy preview, không tạo slot hoặc lịch sử mới. Thông báo save lỗi dùng đúng đường khôi phục gốc, không thay “Tiếp tục” bằng hành động xóa.

**Hướng dẫn điều khiển**: nếu nút hiện hữu mở bảng help, tái bố trí cùng handler, không thêm modal thứ hai. Khung (312,100,656,520), ink #100b13 .92, viền gold .65, heading (336,120,608,36) V18Serif 26. Bốn nhóm (336,174,608,76), (336,258,608,76), (336,342,608,76), (336,426,608,76), heading 16 và 2 dòng 14px; nút đóng (744,550,200,40) gọi handler gốc. Nội dung xác thực F6/F12:

| Nhóm | Nội dung |
|---|---|
| Hành tẩu | WASD di chuyển · E tương tác · M xem bản đồ · Q theo dõi nhiệm vụ |
| Giao chiến | Chuột trái/phải tấn công/kỹ năng · Shift né · H dùng Hồi Xuân Đan |
| Tu hành | T kỹ năng · I hành trang · C hồ sơ · N tông môn |
| Thiên kiếp | Cấp 9/18/27/36 đầy tu vi, B ở thế giới mở; nhìn dấu báo rồi tránh |

Fade 160ms vào/120ms ra; hitbox modal chặn click xuyên nút menu; Esc/đóng đúng handler. Nếu Hướng dẫn runtime hoạt động khác, chỉ giữ nội dung và đường tương tác gốc, không ép một dialog mới. Lần sau người chơi vẫn chọn help chủ động, không pop-up bắt buộc khi Tiếp tục.

## 6. Dữ liệu / Không làm / Checklist

Nguồn: V10_SCHOOLS, p.v8Name, p.cls, preview 4 thuộc tính runtime, BUILD_VERSION nếu đã có, save validity/backup/settings/start/resume và input DOM thật. Không viết code game, không thêm slot save, chế độ online, độ khó, giới tính/phái, phím mới, nhạc/asset chưa có, video intro, tài nguyên gameplay. Không thay ảnh menu cũ nếu art chưa duyệt.

- [ ] Menu có đủ Bắt đầu/Tiếp tục, Tạo nhân vật mới, Hướng dẫn, Bảo toàn hồ sơ, Cài đặt/Âm thanh/Đồ họa; trạng thái có/không save đúng.
- [ ] 3 thẻ phái khớp F5, 4 thanh theo số thật, tên tiếng Việt IME, Nhập thế/Quay lại, không đổi game balance.
- [ ] Save cũ: tạo mới rồi hủy không làm mất dữ liệu, ghi đè cần click rõ, Tiếp tục phục hồi đúng nhân vật; lỗi start không mất save.
- [ ] 1280×720, 1366×768, 1920×1080 HiDPI: chữ không cắt, không che tu sĩ/tâm cảnh ở menu, input DOM khớp chuột.
- [ ] Art 16:9 ≥1920×1080 không chữ; nền sương/lá nhẹ, low graphics không tụt FPS; vân giấy đồng bộ T21, không bật hiệu ứng khi modal che nền nếu không cần.
- [ ] Ba thẻ nhập thế đổi đầy đủ preview cùng lúc, dấu chọn rõ; guide không thay phím, metadata save được lấy từ snapshot đọc-only hoặc ẩn khi thiếu. Quay lại, nhập tiếng Việt và save lỗi đều không ghi dữ liệu ngoài ý muốn.
