# T47 — Công pháp · Đạo thống (T), v2.0

21/11/2026 · B1 · REVIEW · G1, ảnh ky_nang_T.png, T31, T36, T21.

## Mục tiêu và phạm vi
Trận đồ như la bàn ngọc khắc mực vàng, đủ 5 kỹ năng phái; tên đầy đủ và điều kiện đọc được ngay. Giữ modal `skill11`, phím T/Esc, điểm và giao dịch gốc; gộp tab Công pháp T31 vào cùng khung, không sinh modal thứ hai.

## Thành phần
Mọi rect là x,y,w,h logic 1280×720. Kế thừa T36 §1: ornament()/box(), ink #100b13 .92, paper #f1e4cf .04 vân, gỗ sơn mài ink pha red #f18474 .07, viền gold #e3b96f .68, jade #a8d6c5, muted #b5a18b; chữ paper. V18Serif 28 tiêu đề, 20 tên; V45Sans 14 thân/16 số/12 tối thiểu. Không tint theo T21. Hover 100ms gold .10, chọn viền gold 2px + nền .14, khóa ink .45 + chữ lý do muted/red, nhấn 80ms, tab fade 140ms, mở 180ms, đóng 120ms alpha; tooltip T36 hover 300ms/ra 100ms. Thiếu điểm/MP/tiền ghi red + số, không chỉ màu. T36 scroll, tab, box, button tận dụng nguyên mẫu; không thêm palette.

| Khối | Rect | Nội dung |
|---|---|---|
| Khung | 24,24,1232,672 | Modal duy nhất |
| Header | 42,36,830,34 | CÔNG PHÁP · ĐẠO THỐNG |
| Phái/cảnh giới | 42,72,830,20 | Tên/phái từ p.cls, realm() |
| Điểm còn | 958,40,270,44 | số v11SkillPoints(), số 24 gold |
| Hai tab | 42,100,220,40 / 270,100,220,40 | Kỹ năng phái / Công pháp |
| Trận đồ | 38,152,738,480 | La bàn chính |
| Thẻ tre | 788,152,454,480 | Chi tiết và thao tác |
| Footer | 38,644,1204,38 | T/Esc · +1 điểm mỗi cấp · Hoàn điểm miễn phí theo ảnh |

### Trận đồ
Tâm (407,397), đĩa ngọc r225; vòng đồng r222/r211 stroke 1px, jade alpha .09 trên ink; 8 vạch chia hướng r205→217, motif mây/cache tĩnh. Không góc quay động; năm ấn có icon thật (80×80 trong nút d92), nền chìm ink .70/vòng gold .25 nếu chưa học. Bậc 1–5 bằng 5 hạt hình thoi 10×8 cách 3, đầy gold/jade, rỗng muted .3; chính vòng skill hiện rõ trạng thái đã học khác được học. Giảm bão hòa khi khóa, dấu khóa và dòng yêu cầu thay mô tả phụ. Không vẽ ấn thành phím thi triển.

| i V11_SKILLS[p.cls] | Tâm x,y | Rect nhãn x,y,w,h | Chú thích |
|---|---|---|---|
| 0 | 407,223 | 292,272,230,36 | RMB |
| 1 | 586,394 | 506,443,160,36 | 1 |
| 2 | 407,535 | 292,584,230,30 | 2 |
| 3 | 228,394 | 148,443,160,36 | 3 |
| 4 | 407,394 | 317,443,180,36 | Nội tại, không phím |

Nhãn i0–i4 V18Serif 16, wrap 2 dòng 16px, năm hạt đặt theo mục V2 bên dưới. Tên đầy đủ “Vạn Kiếm Xuyên Tâm”, “Băng Hà Vạn Trượng” wrap tối đa hai dòng, giảm tới 14; đo font thật, không cắt. Vẽ nút trước chữ, chữ không phủ icon khác; icon chọn ring gold 2px + hào quang jade alpha .16, 160ms từ lúc chọn. Đường nối chỉ vẽ dependency thực của V11; nếu chỉ có điều kiện cấp, mỗi ấn tỏa một đoạn ngắn từ mép nút tới vòng ngọc (không nối sang kỹ năng khác), solid gold .75 khi đủ cấp, muted .38 đứt 5/5 khi thiếu cấp, ghi “Cấp yêu cầu n” khi chọn. Vòng ngọc nét mờ, không mũi tên giả. Nếu dependency tồn tại, route quanh rect nhãn và dùng cùng trạng thái điều kiện, tooltip giải thích yêu cầu thật. Đường nằm dưới ấn và chữ.

### Thẻ tre chi tiết
Nền giấy mờ theo T36, 3 nan tre 1px gold .18, không chứa art mới; (802,162,426,20) CHI TIẾT CÔNG PHÁP; icon (960,190,110,110), tên (802,306,426,30) 20px; bậc/phím (802,340,426,22), MP/hồi chiêu (802,366,426,22) 16px, lấy cost/cd giây từ V11, không đổi đơn vị. Nội tại ghi “Nội tại”, không bịa CD/phím.
Mô tả (802,397,426,76) 14px dòng 18, scroll nếu dài; điều kiện (802,480,426,54) 13px, cấp thực và điều kiện từ handler, ghi ✓/Khóa hoặc “Đã viên mãn 5/5”. Hoàn lại điểm (802,542,426,36); −1 Bậc (802,586,208,36), +1 Bậc (1020,586,208,36). Khi tăng/giảm điểm cập nhật bậc và điểm từ trạng thái thật, viền jade 240ms; lỗi red 220ms và thông báo trong footer 1800ms. Không thêm phí hoặc điều kiện xác nhận mới. Khóa −/+ theo handler gốc, max 5; chỉ hành động khi có điểm, đủ điều kiện. MP thiếu khi thi triển không khóa thao tác nâng điểm nếu runtime cho phép.

### Tab Công pháp (T31)
Giữ T31 §3.2–3.3 nguyên vị trí nội dung (tọa độ T31 nằm trong modal T47), dời header/tab về trên; filter (108,190,488,34), list (108,232,488,352), chi tiết (608,190,564,294), thao tác (616,492,548,45), 6 ô (616,544,548,40), xác nhận inline T31 (100,602,1080,33). Dòng link R gốc và footer T47 y644 không đè nhau. Giữ 30 DATA.techs, 26 học tại inn/4 nhận boss, học/nâng/đeo/tháo, điều kiện phái/cấp/ô, chất lượng QUALITY_COL nếu có key, preview hiệu ứng và công pháp cũ/dung hợp R; tuyệt đối không đổi luật/slot theo T31. Tab mặc định là Kỹ năng phái; đổi tab qua click, không gán Tab. Vị trí và selection của mỗi tab giữ khi đổi, reset an toàn khi mở nhân vật khác. Khi tab Công pháp, Điểm còn ẩn (không dùng điểm kỹ năng); có thể hiển thị p.stones ở rect đó. Không triển khai phần cường hoá T31 trong T/I; P là nơi duy nhất T50.

## Tương tác và dữ liệu
Chọn đúng i, không cast. Từ C bấm T đóng C trước; click đóng không xuyên world; chữ/icon/hitbox cùng logic; khóa input khi fade đóng. Dùng V11_SKILLS[p.cls], v11Levels(), v11SkillPoints(), p.level, realm(), p.cls, p.stones, p.techs, DATA.techs, QUALITY_COL. Topology điều kiện nếu chưa xác minh: vòng trang trí; ưu tiên code gốc nếu ảnh khác. Không suy cap, phím hoặc prerequisite từ thẩm mỹ. Không sửa điểm, MP, CD, save hay công thức T31.

## V2 — Art direction và hợp đồng runtime
Mẫu 1280×720 `img/batch03_v2_T.png` (thiết kế, không phải ảnh game tích hợp). Bố cục như cổ vật: khắc hai viền đồng mảnh, 24 vạch 1px, 4 vòng phụ gold .15–.35 trong trận đồ; ấn thật clip tròn, không kéo méo bitmap. Góc khung motif gấp vuông 28×20px tại x29/y29 và đối xứng, stroke 2px gold .68; không che heading. Nền thẻ nâu mực sắc giấy ấm, không xanh web; gradient tĩnh ink→ink+paper .07, vân 1px opacity .04. Nhấn chọn vòng gold 2px, không đổi màu phẩm.
Nhãn ngay dưới node: tên 14–16 serif, dòng phụ key/“Đã học” hoặc “Cấp n” 12, rồi 5 thoi. Tại i2 tên y585, phụ y604, thoi y623, đáy ≤627. Các ấn khác tên y+50, phụ y+69, thoi y+88. Khi tên dài wrap hai dòng trong nhãn; chuyển key sang thẻ phải nếu không đủ chiều cao; không ellipsis. Vầng sáng và nét đồng không chạy qua chữ. Khóa vẫn xem được, không khóa việc đọc.
V47.1 xác nhận `v11SkillPanel`/`v11SkillChange(i,delta)`/`v11SkillReset()`, action IDs focus0…4/resetSkills/minusDetail/plusDetail. Trừ bậc i0 chỉ tới 1, i1–4 tới 0; cấp yêu cầu 1/2/4/7/3 cả 3 phái. Khi handler từ chối, giữ nguyên state. Tab Công pháp mới chưa có trong benchmark, là spec chờ tích hợp. Test 3 phái: i0 − tại 1, i1 khóa cấp 1, i0 + khi có điểm, reset về [1,0,0,0,0], chọn ấn không cast. Đọc nguyên tên “Chấn Sơn Băng Quyền”, “Băng Hà Vạn Trượng”.

## Checklist
- [ ] 3 phái × 5 nút, đúng index/nhãn/key; tên 5 kỹ năng đầy đủ, đọc được ở 1280×720/DPR 2.
- [ ] Điểm hết/đủ, bậc 0/1/5, yêu cầu cấp, hoàn điểm và −/+ không sai hành vi; không cast khi bấm.
- [ ] Đường nối không gợi ý sai điều kiện; đường không đè icon/chữ.
- [ ] Hai tab trong T, R và 30 công pháp T31 giữ chức năng; không có nút cường hoá ở T hoặc I.
- [ ] Không click xuyên, không đổi stat khi xem; không vẽ đồng thời hai modal, animation đúng T36.
