# BATCH_01 — ChatGPT

Ngày 21/11/2026 · Vạn Đạo Tu Tiên · BRIEF cập nhật 14:40 (giờ VN).
**BATCH_01 v1.2 — hoàn thiện tổng thể sau phản biện, thay thế v1.1.** B1 → B2 → B3 → B4. Schema DATA giữ version:1 đúng T14; phiên bản gói khác phiên bản schema. Trạng thái **REVIEW**. Không sửa src/, index.html hay save thật.

## B1 T17 — Dữ liệu công pháp và trang bị

**File:** data/techs.js, data/equipment.js.

| Phẩm | Phàm | Linh | Địa | Thiên | Tổng |
|---|---:|---:|---:|---:|---:|
| Công pháp | 8 | 8 | 7 | 7 | 30 |

| Loại | Võ kỹ | Thân pháp | Tâm pháp | Tuyệt kỹ |
|---|---:|---:|---:|---:|
| Công pháp | 8 | 7 | 7 | 8 |

| Hệ | Kim | Mộc | Thủy | Hỏa | Thổ | Lôi | Phong |
|---|---:|---:|---:|---:|---:|---:|---:|
| Công pháp | 4 | 5 | 5 | 4 | 4 | 3 | 5 |
| Trang bị | 3 | 3 | 3 | 2 | 3 | 3 | 3 |

| Phái | Kiếm Tu 0 | Thể Tu 1 | Pháp Tu 2 | Mọi phái null |
|---|---:|---:|---:|---:|
| Công pháp | 4 | 4 | 4 | 18 |

- Mỗi phái có đúng 1 công pháp riêng mỗi phẩm, tổng 12 món riêng, 18 món chung; ba phái đều có lựa chọn cuối game. Thiên Nham Ấn thiên về thủ và HP, dành Thể Tu; Thái Thanh Ấn dành Pháp Tu. Bốn công pháp cũ có hiệu ứng tấn công được giảm mức để hạn chế build giá rẻ quá mạnh: Bách Luyện Khí, Linh Chiếu Ấn, Kim Tịch Ấn, Nham Tâm Ấn. Không đổi 30 ID, phẩm/loại và cấp.
- 26 món trả phí: từ 12 tới 480 linh thạch theo tiến trình, bốn món boss miễn phí; maxRank Phàm 3, Linh 4, Địa/Thiên 5. Không thêm trường schema.
- Trang bị 8 weapon, 6 armor, 6 accessory; index 63–70, 71–76, 77–82. Giữ toàn bộ ID/mapping v1.1, không thay 0–62. Ngân Lan Y (73) yêu cầu Lv19, Ngân Phong Hoàn (79) Lv20, bổ sung vùng tuyết còn trống. Mỗi vùng có ít nhất một trang bị mới (số lượng theo thứ tự T19: 6,1,1,2,3,1,2,1,3).

| Ô | Đỉnh công/thủ cũ | Đỉnh mới | Chênh |
|---|---:|---:|---|
| Vũ khí | 48/0 | 50/0 | +4,17% công |
| Giáp | 8/43 | 8/44 | +2,33% thủ |
| Phụ kiện | 24/14 | 24/14 | Không đổi |

**Tự kiểm tĩnh: ĐẠT.** Parse JSON nghiêm ngặt, nạp trong DATA trống, 50 ID duy nhất, không trùng tên đồ đã liệt kê hoặc ID TECH/relic BATCH, key đúng schema; enum, cấp, độ dài desc/lore và icon đúng tổ hợp sheet/index/slot đã dùng. 249 cặp hiệu ứng–bậc đạt giới hạn T14 (crit ≤0,06, attack/rate/spellAtk ≤1,25, dashCd 0,8–1, speed ≤40). Cả 20 ID theo thứ tự giống v1.1, upgrade không đổi. ID của 63 món cũ không được cung cấp: Claude kiểm trên repo trước import.

## B2 T31 — Spec UI công pháp và trang bị

**File:** ops/specs/techs_ui.md v1.2. Hai modal T/I cùng khung 80,73,1120×576; giữ 15 kỹ năng phái, R/FUSIONS, 48 ô túi, 3 slot vật lý, 4 relic, nguyên liệu. Không thêm modal/phím/handler combat. 2/3/4/5/6 ô công pháp mới theo cảnh giới, chỉ tính công pháp đang trang bị, legacy giữ nguyên.
 
### Kinh tế và đường nhận

| Phẩm | Giá học trả phí | Chi phí từng bậc | Tổng nâng | Tổng học + nâng |
|---|---:|---|---:|---:|
| Phàm | 12–45 | 8,12 | 20 | 32–65 |
| Linh | 60–130 | 16,24,32 | 72 | 132–202 |
| Địa | 150–240 | 28,42,56,70 | 196 | 346–436 |
| Thiên | 300–480 | 45,65,85,105 | 300 | 600–780 |

Nâng chắc chắn, tại Trưởng lão; bậc boss cũng dùng chi phí phẩm, không còn nâng gần như miễn phí ở phẩm cao. Học 26 tại inn, 4 món boss truc/tuyet/hoa/loi chỉ trao một lần từ handler thật; không giả cờ. Whitelist 20 trang bị theo chín vùng, chỉ nối pool thật, không đổi loot cố định. Mục tiêu đo kinh tế: 3 lượt farm 10 phút mỗi cảnh giới, trung vị thu nhập ròng/phút; học một món 3–8 phút và tối đa bậc 8–25 phút là mục tiêu thiết kế, chưa phải số đo.

Cường hóa giữ đúng T14: giá 6+4n, thành công 100/94/88/82/76/70/64/58/52/46% (n=0..9). +10 khóa, thất bại giữ cấp. Kỳ vọng chi phí +5 là 83,45/món, +10 là 390,47/món; cả ba ô +10 là 1171,40 (giả định roll độc lập, không tụt cấp). Không chỉnh xác suất/thu nhập ngoài đề bài.

### Cân bằng và hiệu lực

Cộng delta hệ số công pháp mới, không nhân chồng; dùng ngưỡng mềm S và trần H theo từng cảnh giới: y=min(H,min(x,S)+0,35×max(0,x−S)). Sau S chỉ còn 35% tăng, H là giới hạn cứng. Legacy tính như cũ. Trần crit tổng game vẫn 0,60. Tất cả ngưỡng nêu rõ trong spec. UI hiển thị phái, thụ động, raw/chênh thực, trường hợp đổi ô giả lập và xác nhận inline “Nâng dự trữ” nếu bậc mới không có hiệu lực; không mutate save.

**Mô phỏng tĩnh:** duyệt 366.312 tập hợp từ 0 đến số ô tối đa tại Lv9/18/27/36/45 cho cả ba phái, từng món maxRank. Cực trị mỗi stat độc lập (không phải cùng một build), không vượt H; bậc thấp hơn không thể cho raw cao hơn maxRank do hiệu ứng đơn điệu. Bảng là phần tăng có hiệu lực, dash là % giảm thời gian hồi.

| Lv | Công | Pháp công | Tốc đánh | Dash giảm | Speed | HP | MP | Thủ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 9 | 8% | 13,4% | 6,35% | 6,05% | 26,75 | 20 | 16,9 | 5 |
| 18 | 25,93% | 25,75% | 14,98% | 16% | 49,1 | 56,75 | 41,55 | 11,85 |
| 27 | 38,28% | 38,1% | 18,88% | 24% | 70,75 | 60 | 70 | 20 |
| 36 | 42,5% | 53,25% | 29,08% | 29,98% | 85,4 | 122 | 100 | 25,25 |
| 45 | 62,63% | 69,8% | 39,98% | 36% | 110 | 210,75 | 135 | 36 |

Lv45 crit tối đa từ phần mới +13,57 điểm %, range +39,45, regen +33,05%. Ví dụ Lv25 Kiếm Tu: Thiết Chỉ Kình bậc 3 + Bách Luyện Khí bậc 2 + Kim Tịch Ấn bậc 1 + Nham Tâm Ấn bậc 5, giả định đã nhận boss. V1.1 tốn 439 linh thạch, raw công ×1,51294, kẹp ×1,5; v1.2 tốn 438, công ×1,335. Không còn đạt trần công bằng build này ở giữa game; trần H tăng theo cảnh giới, để công pháp cao phẩm vẫn có giá trị. Không suy DPS thực khi chưa có tốc đánh/đòn/AI runtime.

### An toàn giao dịch và save

- Giữ p.techs và toàn bộ dữ liệu cũ; hai trường đề xuất p.techRanks/p.techEquipped, mặc định an toàn. Preview không ghi save, tháo đồ clamp HP/MP, không hồi miễn phí. Mọi lookup TECH/R phải lọc ID mới an toàn, không cộng kép.
- Khoá 450ms, kiểm số dư, điều kiện, ID và instance/slot thật trước commit, roll đúng một lần, save một lần. Không coi bag index đã đổi là cùng instance. Nếu nạp v1.0/v1.1, đối chiếu toàn bộ index 63–82 rồi thay metadata, không append lần nữa, giữ cấp nâng; chưa xác thực mapping thì dừng import. Không tự sửa 0–62 hoặc cấp lại đồ.
- **Tự kiểm tĩnh: ĐẠT:** 47 rect nằm trong hai khung, 10 bước giá/xác suất, phép tính kinh tế và 366.312 tập hợp. Chưa kiểm runtime, save/load thật, hiệu năng, tooltip font thực, cân bằng loot.

## B3 T23 — Nội thất

**File:** ops/specs/interior.md v1.2; assets/interior_inn_concept.png, **có** (PNG RGB 1672×941, giữ concept đã chọn; byte giống v1.1).

Đủ năm phòng V36 inn/hall #e9ce93, herbalist/herb #b7dfa2, shop/trade #e9bd81, wanderer/sword #b8cde8, sentry/guard #a9d8df. Mặt bằng hậu/giữa/tiền theo ba dải x, 33 rect, vị trí minh họa chân NPC, spawn, exit, vùng đứng và tuyến tiếp cận từng phòng; dùng để Muse dựng mỹ thuật chứ không áp vào gameplay. Phân lớp sàn/tường, thảm, bóng, sprite đồ, actor theo y chân, che tiền cảnh, ánh sáng/HUD. Footprint mỹ thuật chỉ hợp lệ khi khớp collider gốc; không khớp thì đổi sang decor phẳng/dời/bỏ đồ. T22 chưa triển khai dùng ánh sáng cũ, không glow kép; T16 chưa triển khai giữ thoại gốc.

E chỉ map tới điểm đã có: NPC, cửa, v13Open nếu có hook, nghỉ chỉ dùng hồi HP hiện hữu. Không thêm phòng/NPC/tương tác/collider hoặc sửa nền thôn. T24 dựng inn trước, chụp debug từng phòng, test đường spawn→NPC→exit và đi sát đồ, sau đó mới nhân các phòng.

**Tự kiểm tĩnh: ĐẠT.** 33 rect trong khung 128,96,1024×526; 32 rect không phải thảm không cắt lối giữa. Xác nhận ảnh concept nguyên byte, đúng PNG. Chưa có khung/collider/NPC/cửa/đèn thật V36, các anchor là minh họa, không được coi là tọa độ đã xác thực.

Prompt ảnh bản chọn:

> Use case: stylized-concept. Wide landscape 16:9 visual development illustration for a 2D xianxia RPG. True elevated top-down THREE-QUARTER game camera, looking diagonally from front-left down into a single open-front ancient Chinese elder reception hall; camera pitched downward 50 degrees, off-axis 20 degrees, like an isometric room cutaway from a hand-painted world map. See tops of furniture clearly, a large trapezoidal visible walkable floor, walls in upper half, NO eye-level frontal architectural photograph. Painterly HD warm antique village environment art, fine ink wash texture on wooden surfaces. Back center three-panel landscape screen, low reception desk, scroll shelves left/right, two amber wall lanterns, muted cinnabar pillars, golden stone floor, narrow plain rug central aisle, left tea table & cushion, right cushion & low bench. Clear broad center walkable route to foreground entrance. Warm sunlight from upper left, soft contact shadows. Quiet humble cultivation village, not royal palace, no rooftop obscuring view. No people, no lettering, no signage, no game UI, no watermark. Make the elevated diagonal three-quarter view unmistakable.

## B4 T30 — Hội thoại 10 NPC

**File:** data/dialogues.js, giữ nguyên inn/shop T15 đã duyệt. Tên NPC: sentry Lục Thanh, herbalist Mộc Tử Y, wanderer Tạ Vô Nhai, bambooKeeper Vân Tịch, mountainHunter Hàn Liệt, snowHermit Bạch Vân, swampMedic Đường Uyển, desertSmith Thiết Nham, demonWatcher Mạc Ly, ghostSeer U Lan.

- 20 lần mới (10×2), 91 nút, 54 lựa chọn/nhánh kết thúc, 20 lựa chọn thiện cảm ≥5. Mỗi lần có 3–6 nút và 2–3 lựa chọn; có đoạn đối đáp player, nhánh đối thoại nhiều bước và nhịp mở đầu khác nhau; lời thoại ấm hoặc cộc tùy vai trò, không đặt tiểu sử chưa có nguồn. Giữ gợi ý M/T/I/F6, bản đồ/cảnh giới, tương sinh relic.
- Lần đầu: 3 lựa chọn, 2 không khóa, tất cả 30 terminal talked:true và favor +5/+6/+8. Lần lặp: 2 hoặc 3 lựa chọn, 24 terminal không thưởng. Không thưởng ngoài favor, không tiền/đan/tu vi/openShop mới. Portrait null. Hậu tố _1/_2 kèm ID NPC camelCase gốc theo BATCH.
- Giữ nguyên 6 lần inn/shop: đối chiếu deep equality và phần văn bản tiền tố với T15_v1.0.zip; tổng 12 NPC, 26 lần gặp.
- T16 chốt talkedBefore trước handler cũ, commit terminal một lần, Esc trước terminal không nhận thưởng; nhiệm vụ phụ/shop/quest gốc giữ nguyên. Lần lặp của save mới mở nhánh thiện cảm vì mọi nhánh lần đầu tăng ≥5.
- **Đề xuất migration riêng, chỉ nếu Claude duyệt:** chỉ tại load save xác thực là trước T30, nếu p.v12Talk[npc] đã true và p.favor chưa có own property NPC đó, khởi tạo 5 đúng một lần; không đổi giá trị 0 rõ ràng, không đổi inn/shop, không cấp reward theo lần gặp; lưu bằng đường hiện hữu, không thêm flag. Nếu không nhận diện được save cũ hoặc chưa duyệt, giữ mặc định 0 như T15 và nhánh vẫn khóa. Không sửa save từ file thoại.

**Tự kiểm tĩnh: ĐẠT.** Parse/nạp DATA, 26 ID duy nhất, DFS 20 graph: mọi start/next tồn tại, 91 nút reachable, 54 terminal, không cycle/mồ côi; chữ dài nhất 118 ký tự ≤140; 20 cond hợp lệ; lần đầu mọi nhánh talked, lần lặp không effects. Kiểm inn/shop nguyên dữ liệu T15.

## Câu hỏi mở

1. **NPC:** bảng NPC trong BATCH bị None toàn bộ. Đã dùng ID/tên chính thức T14, vai trò/vùng có căn cứ; không gán cảnh giới, môn phái hay biến cố cá nhân. Cần Claude cung cấp bảng thật để kiểm giọng và duyệt migration favor save cũ.
2. **B1/B2:** xác nhận EQUIPMENT 63 món và ID thật, icon/style, alias import v1.0 nếu có. Cần xác nhận đơn vị regen/rate/range và currentStats, công thức cộng delta, ngưỡng cảnh giới, hai field save, đường lọc TECH/FUSIONS. Không bật học/trao khi thiếu ánh xạ stat/hook. Đo thu nhập ròng và DPS/tồn tại mỗi cảnh giới rồi hiệu chỉnh giá/hiệu ứng nếu cần.
3. **Nguồn nhận:** kiểm boss truc/tuyet/hoa/loi và cờ thật, inn điều kiện hợp lệ, pool trang bị, handler nâng theo instance hay loại, các cấu trúc save. Giữ phương án khóa thay vì giả hook.
4. **B3:** đo V36 khung thật/collider/anchor NPC/cửa/đèn; xác nhận điều kiện E/v13Open, hồi HP và T22/T16; không dùng anchor minh họa làm collision.
5. **Tích hợp:** chưa có repo game thật, chưa thể xác nhận save/load, FPS, độ cân bằng thực, quest/hook, giao diện và va chạm. Claude review, Muse T18/T24/T16 kiểm checklist khi đủ phụ thuộc. Không đánh dấu DONE.

## CHAT (dán vào ops/CHAT.md)

[2026-11-21 15:17] ChatGPT → @Claude (BATCH_01 v1.2 / T17 T31 T23 T30): Nộp bản hoàn thiện tổng thể thay v1.1. B1 phân đều mỗi phái bốn phẩm, giá học/nâng mới, đủ chín vùng loot, giữ index. B2 cap mềm/cứng theo cảnh giới, xem trước hiệu lực thực, xử lý nâng dự trữ, chi phí kỳ vọng cường hóa, import/save. B3 mặt bằng/anchor minh họa/layer 5 phòng, giữ concept inn. B4 20 lần/91 nút/54 nhánh, giữ inn/shop. Tự kiểm tĩnh 249 cặp hiệu ứng–bậc, 366.312 tổ hợp, 47 rect modal, 33 rect đồ, graph ĐẠT. Nhờ duyệt các câu hỏi mở, không coi kiểm tĩnh là gameplay đã chạy.

## HANDOFF (dán vào ops/HANDOFF.md)

### [2026-11-21] BATCH_01 v1.2 — ChatGPT

**Đã làm:** T17/B1 → T31/B2 → T23/B3 → T30/B4, hoàn thiện theo phản biện.

**File:** data/techs.js; data/equipment.js; ops/specs/techs_ui.md; ops/specs/interior.md; assets/interior_inn_concept.png; data/dialogues.js; BATCH_01_REPORT.md. ZIP chứa đúng 7 file ở root theo cấu trúc BATCH.

**Chưa làm / không chắc:** runtime, schema/ID thật chưa đối chiếu, hook boss/loot/inn, migration save, NPC nguồn None, tọa độ V36, thu nhập và combat thực; không viết code game.

**Cần chủ dự án quyết định:** duyệt công thức, giá/ngưỡng, nguồn nhận, save, migration favor, dữ liệu NPC và anchor thật theo Câu hỏi mở.

**Việc tiếp theo:** Claude review T17/T31/T23/T30; Muse T18 khi T03/T17/T31 DONE, T24 khi T09/T23 DONE, T16 khi đủ phụ thuộc + T30 đã duyệt, giữ phụ lục T15.

### TASKS

T17, T31, T23, T30 → REVIEW. Nếu chưa có dòng T31/T30 thì Claude bổ sung; chưa chuyển DONE.
