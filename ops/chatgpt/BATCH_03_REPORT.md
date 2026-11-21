# BATCH_03 v2.0 — ChatGPT

Vạn Đạo Tu Tiên · 21/11/2026 · T47–T55 · Nộp REVIEW (Claude duyệt mới DONE).

Nguồn thiết kế: BRIEF.md bản 20:42, BATCH_03.md, BATCH_03_FACTS.md G1–G6, BATCH_02_FACTS.md F1–F12; đối chiếu ảnh hiện tại trong gói, T36/T31/T21/T10/T12/T33. BRIEF cũ đã được thay nguyên byte bằng BRIEF trong gói (SHA256 a3cc92c23d5e638fdc888e0df9f639843fbad208514570aae01efe481d020364), không tự sửa TASKS. V2 đối chiếu thêm **V47.1 Refactor** bản 10:17 để chạy kiểm thử baseline, không coi đó là nhánh đã tích hợp T47–T55. Không đụng mã trò chơi, index, rules hoặc cân bằng. Nội dung mới chỉ nối pool tương thích sau review.

## Vòng nâng cấp v2.0 — đọc trước khi review

| Mục | V1 → V2 | Bằng chứng / quyết định |
|---|---|---|
| Art direction | Spec thuần chữ → 6 mẫu giao diện 1280×720, nền mực ấm, gỗ/đồng, serif, 4 màu tông, kệ, đĩa ngọc, trang sách | `ops/specs/img/batch03_v2_{T,N,J,P,O,L}.png`. Mẫu tĩnh, dùng crop icon nguồn để minh họa; không dùng crop làm asset game. |
| T | Label cắt ngắn ở V47.1 → tên đầy đủ, cấp khóa và key tách dòng, năm thoi, đường trang trí không chạy qua chữ | 3 phái: 15 tên thật; khóa, hoàn/reset và bậc nền i0=1. |
| N | Hợp đồng nhiệm vụ rõ rank, vùng và loại kill, giữ hai nhiệm vụ gốc | V47.1 `v31AcceptTask` chưa có minRank/region; adapter cần kiểm tại handler, không chỉ UI. |
| J | 5 trạng thái linh điền, bổ sung tưới; giao dịch preflight; guide job gốc; cost lệch baseline | V47.1 `mana` 1 herb + 1 crystal, G3 mới 2 herb + 1 crystal: giữ G3, Claude xác nhận nhánh mới/cost thật. |
| P | Pity theo từng instance, preview không mutate, hai pha tinh luyện, một CTA; thiếu có/cần | Thực chạy +0 thiếu/đủ, cap +20, thất bại +15 giữ mức/+12 điểm %. |
| O/L | Phân cấp vùng/trang/CTA; ảnh vùng chỉ khi đã khám phá; dossier giữ ID | Milestone cũ nhận bằng `count(s)` hàm; data mới mã chuỗi, cần adapter 14 counter. |
| T53 | Nêu ca test thời gian, ưu tiên, cạnh trigger và ẩn modal | Gói mới chưa có runtime hook, tiếp tục giữ 4s/8s/1 lần. |
| Data/asset | Sửa 8 mô tả hunt tông để chỉ rõ số, vùng, mục tiêu; tên forge_t1 phù hợp linh mộc | Giữ mọi ID, số liệu, schema v1, thưởng, 22 ảnh B8/B9 nguyên byte. Không đổi luật hay stat. |

### Kiểm thử thực thi — baseline V47.1 (không phải build v2)

Chạy 8 script classic theo thứ tự index (assets/world/combat/hud/ui_panels/npc/render_scene/core) trong Node VM, Canvas 2D thật bằng @napi-rs/canvas ở 1280×720, font DejaVu tương đương, DOM/localStorage fixture riêng, ảnh bất đồng bộ không nạp (không kiểm chất lượng render baseline). Khởi tạo bằng hàm `start(cls)` thật; phím qua `pressed.Key*` và `update(1/60)` thật; renderer thật, handler thật. Fixture điều khiển vị trí, worldTime, vật liệu và seed chỉ trong bộ nhớ kiểm thử; không ghi vào mã hoặc save người dùng. Chromium không khởi động do hệ điều hành báo `socket() failed: Operation not permitted`; không tuyên bố browser PASS, DPI/FPS/interaction trình duyệt chưa đo. Các ca dưới đây không phải mock kết quả giao dịch, chạy trực tiếp hàm gốc.

| Nhóm kiểm thử | Số ca | Kết quả | Chi tiết |
|---|---:|---|---|
| Khởi tạo | 1 | PASS | start class 0, mode play, cấp 1, worldMode=true, 5 đá |
| Phím mở/vẽ/Esc | 6 | PASS | T skill11 (8 nút), N v31dao (14), J life13 (10), P v30forge (16), O v42world (18), L jiang14 (16); Esc đóng về null |
| Render tab hiện có | 25 | PASS | N 5, J 7, P 5, O 4, L 4; render mỗi tab bằng state và hàm thật, không lỗi |
| T 3 phái | 3 | PASS | i0 − tại 1 và i1+ cấp 1 bị chặn, +1 hợp lệ dùng 1 điểm, reset [1,0,0,0,0] |
| J | 3 | PASS | gieo→tưới→thu, thu sớm bị chặn, +3 herb/+1 seed; thiếu 1 đá mua ×5 không mua lẻ; nhận/trả gather một lần, +14 đá |
| N | 1 | PASS | không tông từ chối, nhận trùng/claim sớm/claim lần 2 bị chặn, 6 kill fixture → +24 đá, thăng Ngoại môn |
| P | 2 | PASS | thiếu 1 đá không trừ, +0→+1 giá 6, +20 cap; seed kiểm thử cho roll fail +15: giữ +15, pity 1, chance 43→55%, trừ đúng phí |
| O | 1 | PASS | mốc walk1 thiếu chặn, đủ nhận +8 đá, lần 2 bị chặn |
| Runtime facts / data namespace | 3 | PASS | đọc V11/V13/V31/V42, nguồn cũ vẫn đúng số lượng; 4 DATA.* đánh giá độc lập không đè state |
| **Tổng** | **45** | **45/45 PASS** | 0 lỗi trong VM; không đánh đồng browser QA hoặc tích hợp T47–T55 |

### Điều kiện phát hành sau khi Claude/Muse tích hợp

- Bắt buộc chạy trên build mới ở 1280×720, 1366×768, 1920×1080 và DPR 2; ảnh screenshot từng tab (khác với mẫu ở trên), kiểm chữ, tooltip/hitbox và modal không xuyên.
- So sánh save cũ→mới; test 12 nhiệm vụ, 12 ủy thác, 30 thành tựu, 18 trigger, 22 asset thật; các nội dung mới không thể thực thi trực tiếp trong V47.1 nếu chưa có adapter. Kiểm tất cả click có state, tài nguyên, tiến độ và save sau commit; không cho thưởng lặp.
- Test U/Y, cost mana, rank gate, count mapping, Pity, story chung daily: chỉ DONE khi có bằng chứng build mới. Các ca baseline là hàng rào regression cho hành vi gốc, không thay nghiệm thu sản phẩm mới.

## B1–B5 — quyết định chính và thành phần chung

| B / Task | File | Quyết định chính · tái dùng T36 | Thành phần bổ sung dùng chung |
|---|---|---|---|
| B1 T47 | ops/specs/skills_ui.md | La bàn ngọc 5 ấn, đủ tên/điểm/bậc; hai tab Kỹ năng phái/Công pháp cùng T; không tạo prerequisite giả | Ấn bậc 5 hạt, tuyến đủ điều kiện thực; có thể dùng ở skill tree, không phải nút cast |
| B2 T48 | ops/specs/dao_ui.md | 4 hoành phi theo tông, 5 tab, 6 tài nguyên; rank và nhiệm vụ mới theo save gốc | Ô tài nguyên 194×44 dùng chung P/N; cổng sơn môn chỉ là trang trí, khung/nút T36 |
| B3 T49 | ops/specs/life_ui.md | 7 tab; kệ 3×3, lò đồng, 4 luống, sạp, 3 kích thước mua bán, bảng ủy thác | Dòng có/cần + nhãn lý do dùng chung P; đất/lò cache tĩnh |
| B4 T50 | ops/specs/forge_ui.md | 20 ấn nâng cấp, một nguồn luật G3, preview/giá thật, 5 tab, 4 pháp bảo; dẹp bản +10 cũ trong I | Chuỗi ấn tiến độ, bar tỷ lệ có số %, phản hồi giao dịch T31 |
| B5 T51 | ops/specs/world_log_ui.md | Du ký O 2 trang; thay slot daily bằng 4 loại; cáo thị L 32/8, 4 tab | Gáy sổ phi tương tác, thẻ portrait clip; append 30 thành tựu |

Tất cả spec giữ ornament()/box(), vân giấy/lụa, gỗ sơn mài, palette C/QUALITY_COL; tọa độ logic 1280×720, V18Serif/V45Sans ≥12px, hover 100ms, nhấn 80ms, tab 140ms, mở/đóng 180/120ms, tooltip 300/100ms; không tạo bộ widget hoặc màu mới. Không thêm pause, hotkey, modal. 5 spec lần lượt 55/63/61/71/72 dòng, nhỏ hơn 140 dòng; spec tutorial 55 dòng.

## B2 data — 4 tông × 3 nhiệm vụ

| Tông | 3 id | Vùng/loại/need | minRank tương ứng | Công / đá |
|---|---|---|---|---|
| cloud | cloud_t1, t2, t3 | truc hunt8; yeu boss1; phong hunt12 | 0/2/4 | 12/30; 19/48; 16/46 |
| herb | herb_t1, t2, t3 | truc hunt6; tram boss1; tuyet hunt10 | 0/3/3 | 10/26; 22/54; 14/40 |
| forge | forge_t1, t2, t3 | truc hunt7; yeu hunt10; hoa boss1 | 1/2/4 | 11/28; 14/38; 24/60 |
| shadow | shadow_t1, t2, t3 | truc hunt4; tuyet boss1; phong hunt12 | 0/3/4 | 8/20; 21/52; 16/46 |

12 task distinct: 8 hunt + 4 boss; 4 motto, 4 intro, 20 rankLines. Kiểm minLevel vùng ≤ cấp tối thiểu rank G2, hunt 4–12/8–16 công/đá ≤10+3N; boss need1/15–25 công/≤60 đá; JSON/field/Unicode/độ dài PASS. Không đổi bậc hay 2 task cũ V31_TASKS.

## B3 data — 12 ủy thác

| ID | Loại | Item/vùng | Need | Cấp | Đá | NPC |
|---|---|---|---:|---:|---:|---|
| j01 | carry | wood | 4 | 1 | 18 | Lục Thanh |
| j02 | carry | herb | 6 | 2 | 24 | Mộc Tử Y |
| j03 | carry | crystal | 3 | 10 | 15 | Thiết Nham |
| j04 | kill | truc | 5 | 2 | 24 | Vân Tịch |
| j05 | kill | yeu | 6 | 10 | 38 | Hàn Liệt |
| j06 | kill | tram | 6 | 15 | 46 | Đường Uyển |
| j07 | kill | tuyet | 7 | 19 | 54 | Bạch Vân |
| j08 | kill | hoa | 8 | 24 | 70 | Thiết Nham |
| j09 | kill | phong | 8 | 28 | 80 | Tạ Vô Nhai |
| j10 | kill | quy | 9 | 33 | 90 | U Lan |
| j11 | kill | ma | 10 | 37 | 105 | Mạc Ly |
| j12 | kill | loi | 10 | 41 | 115 | Thanh Thạch |

Phủ đúng 9/9 vùng ngoài thôn, 3 carry + 9 kill, 12/12 NPC thật F3 (người đăng có thể trùng), giá ≤6+3N (+2×minLevel khi kill). Cấp tương ứng F1, không đè gather/hunt/ore G3. Không yêu cầu đi tìm NPC để trả nếu Bảng Ủy Thác là cơ chế hiện có.

## B6 — 30 thành tựu

| Dễ (8–25) | Vừa (30–70) | Khó (80–150, có danh hiệu) |
|---|---|---|
| lv5, discover2, claim1, kills20, boss1, events1, waystones2, sectRank1, stones50, main4 | lv19, discover5, claim4, kills150, boss3, events6, pets2, sectRank2, relics2, forge5 | lv45, discover10, claim8, kills500, boss9, events24, sectRank4, techs8, main26, forge20 |

10/10/10; 10 danh hiệu độc nhất ≤12 ký tự, 20 title rỗng. Đủ 14 mã count G5, 30 điều kiện khác nhau, không trùng 6 achievement cũ theo cặp count/need. Tất cả ngưỡng bounded nằm trong G5, relics2/techs8 trong F9; XP/reward 1–1,2. Tổng tối đa nếu lĩnh đủ 30 lần thưởng mới: 1.867 linh thạch, 2.189 tu vi (không phải thưởng cùng lúc). Không dùng ID cũ hoặc thay thưởng cũ. Những counter giảm là “đang sở hữu/giữ” đúng save, không giả tích lũy. Khi nhận cần cờ claim độc lập id và không thưởng lại; Claude map chính xác counter.

## B7 — lời nhắc

18/18 trigger đúng danh sách BATCH03; priority 1: firstEnemyNear, lowHp, breakReady, firstDeath, bagFull, firstBossNear (6); priority 2: firstLoot, skillPoint, nearNpc, nearGate, firstKyNgo, sectReady, petReady (7); priority 3: firstNight, firstMaterial, forgeReady, newRegion, idle60 (5). Mỗi trigger 1 lần, text ≤70, key thuộc F12. Tutorial 4s, ≥8s sau thẻ trước; 1 thẻ; priority/FIFO; ẩn khi modal, toast/telegraph/boss có va chạm; setting Y tắt. Không tăng quest hay khoá input.

## B8 — chân dung đã có

12/12 PNG độc lập, tất cả 1086×1448 (3:4), alpha thật (không opaque), không chữ/khung. Đã xem montage trên nền #1a1410 và đối chiếu từng sprite. 5/5 NPC ưu tiên đủ.

| File trong assets/ | NPC · nhận diện đối chiếu |
|---|---|
| portrait_inn.png | Thanh Thạch · trưởng lão tóc/râu bạc, mũ, đạo bào xanh kem, gậy gỗ ngọc |
| portrait_shop.png | Linh Dược · thương nhân râu, áo nâu kem, giỏ dược, túi thuốc |
| portrait_herbalist.png | Mộc Tử Y · áo xanh xô thơm/kem, hoa trên tóc, giỏ thảo dược |
| portrait_wanderer.png | Tạ Vô Nhai · áo lam xám, khăn cổ và kiếm lớn |
| portrait_sentry.png | Lục Thanh · giáp lam/đồng, mũ tua xanh, kiếm |
| portrait_bambooKeeper.png | Vân Tịch · áo xanh ngọc nhạt/kem, trâm tóc và kiếm |
| portrait_mountainHunter.png | Hàn Liệt · áo lông nâu, cung và bao tên |
| portrait_snowHermit.png | Bạch Vân · râu tóc bạc, áo trắng lam băng, lông vai |
| portrait_swampMedic.png | Đường Uyển · áo ô liu/kem, búi tóc/trâm hoa và túi y dược |
| portrait_desertSmith.png | Thiết Nham · lực lưỡng râu đen, áo da nâu, búa rèn |
| portrait_demonWatcher.png | Mạc Ly · áo tím đen/giáp đồng, thương, tóc dài |
| portrait_ghostSeer.png | U Lan · áo xanh lam nhạt/kem, dải lụa bay và trang sức linh môi |

Prompt chung (một ảnh độc lập/NPC): production individual dialogue portrait for Vietnamese xianxia RPG, reference Image 1 preserves clothing, age, hair, distinctive prop and identity; warm muted ink-and-watercolor hand-painted wuxia, semi-realistic; soft lighting upper left; 3:4 waist-up, head upper third, face 3/4 right, unobstructed head; transparent alpha (flat #1a1410 fallback), no text/frame/UI. Đối chiếu sprite `tham_chieu/npc_<id>.png`. T15 giữ slot tranh (40,192,288,456), fit contain theo tỷ lệ 3:4, căn đáy, để đầu không bị cắt; runtime ưu tiên portrait đúng ID nếu có asset, không đổi DATA.dialogues schema/câu thoại. Nếu thiếu dùng fallback T15. Không gán ảnh khác ID.

## B9 — tranh vùng đã có

10/10 PNG, đúng thứ tự F1/G6, 1920×1080 (16:9) sau chuẩn hóa từ nguồn sinh 1672×941 (≈1,148×, không tuyên bố gốc native Full HD). Đã xem montage từng ảnh, không chữ/UI/khung, motif và nhân vật nhỏ hoặc boss ở xa, đáy mờ tối. Thước đo grayscale mean 0–1: đáy 25% luôn có mean thấp hơn toàn ảnh, SD đáy ≤0,075; đây là QA bố cục, không phải đo contrast chữ trong game.

| File trong assets/ | Vùng · motif/chủ sắc | Mean ảnh / đáy 25% |
|---|---|---:|
| loading_thon.png | Thanh Thạch Thôn · quảng trường, đại điện, mái ngói, cổng ngọc, vàng ấm/xanh | .498/.303 |
| loading_truc.png | Thanh Trúc Lâm · tre, bia, đình nhỏ, xanh ngọc | .455/.259 |
| loading_yeu.png | Vạn Yêu Sơn · núi đá, cổ kiếm, đồng vàng sẫm | .442/.240 |
| loading_tram.png | Hắc Độc Trạch · nước đầm, cầu gỗ, phế đàn, nhện xa, ô liu | .362/.210 |
| loading_tuyet.png | Bắc Minh Tuyết Vực · địa hình băng, đền tuyết, trắng lam | .536/.276 |
| loading_hoa.png | Xích Viêm Hoang Mạc · sa thạch, tế đàn tròn, hỏa xà xa, cam đồng | .394/.197 |
| loading_phong.png | Thiên Phong Cốc · bậc đá, thung lũng, cầu dây, xanh xám | .534/.335 |
| loading_quy.png | U Minh Quỷ Vực · cổ mộ, bia, trận trấn hồn, lam xám | .383/.234 |
| loading_ma.png | Ma Vực · cổng cổ, khe nứt, đen than/chàm | .319/.190 |
| loading_loi.png | Tử Lôi Hoang Nguyên · thần tích, tháp vàng, giông tím | .383/.215 |

Ảnh tham chiếu không lệch tên theo G6. Hình là tranh tải, không dùng làm tile/bản đồ gameplay hoặc vị trí hitbox. Kiểm đủ 22 tên file đúng case ID, PNG đọc được, format/ratio đúng. Không có asset placeholder.

Prompt chung (một ảnh độc lập/vùng): in-game region reference for landforms/architecture/palette, menu_keyart BATCH02 for hand-painted cinematic atmospheric aerial perspective and warm antiqued watercolor/oil style; 16:9 panorama at 1920×1080+, tiny cultivator/boss far away, distinctive motifs above 75% of canvas; bottom 25% low-contrast natural dark mist/rocks/silhouette, no letters/logo/frame/UI/loading bar; not literal game screenshot. Khi tích hợp, vẽ cover vào 1280×720, không kéo dãn méo; phần mẹo và thanh tải nằm y540–720, dùng chữ paper và nền ink dự phòng theo renderer. Không thay duration/điều kiện tải hay gameplay. Ảnh render ở tỷ lệ gần 16:9 được resample cơ học Lanczos về đúng 1920×1080 nếu nguồn nhỏ hơn, không nhận là độ phân giải sinh gốc.

## Kiểm tra độc lập và tình huống hồi quy

Chạy Node.js đọc chính file nộp bằng regex wrapper + JSON.parse, kiểm schema/key/id/Unicode NFC/giới hạn độ dài, cross-check F1/F3/G2/G4/G5/F12, số lượng, cap, thưởng, phân bố, title và spec. V1 phát hiện title forge20 vượt 12 ký tự → sửa “Thiên Công”; nhập độc lập các rect lặp từ spec và kiểm containment/overlap, đối chiếu slot hint mặc định với HUD T10/T12/T33. V2 chạy lại **1.821 assertion PASS, 0 fail**. Đây là kiểm tĩnh tọa độ, không thay cho đo actual font/hitbox. 6 spec dưới 140 dòng; không có mã trò chơi trong ZIP. 45 ca runtime V47.1 nêu ở đầu báo cáo; test trên build mới vẫn là điều kiện DONE.

| Kịch bản hồi quy (cần test trong game) | Kỳ vọng |
|---|---|
| Tskill 3 phái, bậc 0/5, điểm 0, hoàn lại, đổi T tab nhanh | Không cast/tốn điểm ngoài handler, 5 nút thật |
| Tông chưa gia nhập/đã gia nhập, thiếu 10 đá/cấp; task boss đã chết | Không nhận/trả sai, không tạo nhiệm vụ không thể hoàn thành |
| J ngoài trạm và tại trạm; mua 10 thiếu tiền; 44/48 bag; 4 luống | Không thao tác từ xa, không giao dịch một phần hoặc mở luống 5 |
| P +0/+19/+20; RNG fail/critical result; chuyển I/P | Giữ +n khi fail, bảo hiểm +12 điểm % thật, một roll; I không còn +10 |
| O vùng khóa/có daily story, đổi ngày/reload; L chọn trang 4 | Không leak/nhân đôi kỳ ngộ, thưởng không lặp, đúng ID |
| Thành tựu threshold−1/threshold/threshold+1; save cũ; counter giảm | Nhận theo handler, không nhận trùng, 6 cũ không đổi |
| Tutorial 3 trigger đồng thời, HUD F2, boss, teleport, tắt/bật | Một hint, ≥8s, không che/khóa input, seen bền |
| 1280×720 / 1366×768 / 1920×1080; DPR≤2 | Độ tương phản, không cắt chữ, đúng hitbox; cache nền, không tụt FPS do new loop |

## Câu hỏi mở

1. V11 prerequisite giữa 5 kỹ năng chưa có bảng code: không vẽ liên kết giả; tuyến điều kiện cấp vào vòng ngọc. Muse dùng field thực.
2. T48/T49/T50/T51 thiếu ảnh các tab con, thiếu chính xác field state sinh hoạt/tinh luyện/lò/tu sĩ; dùng toàn bộ handler/action thật, bảo toàn bố cục vùng, không thêm nút. Kiểm NPC tiếp dẫn theo vị trí thật (herbalist trong thôn nhưng tông herb vùng tram).
3. V31 nhiệm vụ boss đã chết: nếu không respawn, không đưa boss không thể đánh lại vào pool nhận; Claude xác nhận cách nhận sau khi kill và reset theo engine. Không suy từ cấp hay nhận thưởng hồi tố.
4. V47.1 xác nhận pity theo instance, thành công reset 0, thất bại +1 tương đương 12 điểm %, cap 100%. Nhánh mới phải giữ handler thực tế; “Tinh hoa” recipe vs “Tinh phách” thanh tài nguyên cần đối chiếu nhãn/key.
5. F12 thiếu F3 nhưng ảnh O có Vạn Linh Phổ · F3: giữ nút/handler hiện có, không gán phím mới. 
6. G5 claim lấy p.claimed (F7 nói map cờ), đếm điểm thật không dùng .length mù; các mã boss/waystones/events, main và counters còn lại phải map theo G5, không đếm trùng. Danh hiệu chưa gắn HUD tới Claude chốt.
7. T53 forgeReady cần lịch sử “chưa cường hoá lần nào”, không chỉ max hiện tại=0. Nếu không có history tin cậy, tạm không bật trigger trên save cũ; Claude chọn hook. Seen namespace và setting theo lưu hiện hành, không thay p.v35.
8. V47.1 VM 45/45 PASS; Chromium bị chặn socket. Mockup đã duyệt mắt với font DejaVu thay thế, chưa đo trên font nhúng/build mới; Muse nghiệm thu pixel, resize, click và FPS sau tích hợp. G3 mana khác baseline, Claude quyết định theo nhánh thực.

## CHAT (dán vào ops/CHAT.md)

[2026-11-21 21:18] ChatGPT → @Claude @Muse (T47–T55): Nộp BATCH_03. B1–B7 đủ spec/data, đối chiếu ảnh G1 và số liệu G1–G6/F1–F12; 12 task tông, 12 ủy thác phủ 9 vùng, 30 thành tựu 10/10/10, 18 hint. Kiểm tự động 1.821/1.821 PASS. Không sửa src/index; giữ T36; story chung daily O, cường hoá thật P +20, bỏ nâng +10 I. B8 đủ 12 chân dung alpha; B9 đủ 10 tranh tải 1920×1080, chuẩn hóa nguồn 1672×941, đáy tối. Nhờ review dữ liệu, hook, UI và asset trước khi DONE.

[2026-11-21] ChatGPT → @Claude @Muse (T47–T55): Nộp lại BATCH_03 v2.0; 6 mockup 1280×720, sửa T/N/J/P/O/L và tutorial theo runtime; 1.821 kiểm tĩnh + 45 ca baseline V47.1 VM PASS. Bổ sung tưới luống, chặn rank/vùng ở handler, map 14 counter, pity riêng instance, guide job gốc; G3 mana 2 herb khác baseline 1 herb cần chốt theo nhánh mới. Không sửa game code, Chromium bị chặn socket, build tích hợp chưa test. Giữ REVIEW; Muse cần nghiệm thu lại trên build mới.

## HANDOFF (dán vào ops/HANDOFF.md)

### [2026-11-21] T47–T55 — ChatGPT (GÓI 03)
**Đã làm:** B1–B7 spec và dữ liệu v2.0, B8 đủ 12 chân dung, B9 đủ 10 tranh tải; BRIEF thay bản 20:42, giữ nguyên bản nguồn; 1821 assertion tĩnh PASS, 45 ca V47.1 VM PASS; 6 mockup PNG full-size. Không tuyên bố build mới đã chạy.
**File:** ops/specs/skills_ui.md, dao_ui.md, life_ui.md, forge_ui.md, world_log_ui.md, tutorial.md; data/sect.js, jobs.js, milestones.js, tutorial.js; assets/portrait_*.png, assets/loading_*.png theo danh mục; BATCH_03_REPORT.md.
**Chưa làm / không chắc:** câu hỏi mở 1–8; runtime integration/QA còn chờ Claude/Muse.
**Cần chủ dự án quyết định:** duyệt nội dung/ảnh, Claude xác nhận các hook, hiển thị danh hiệu, mốc nghiệm thu. 
**Việc tiếp theo:** Claude review T47–T55 theo BATCH_03; Muse tích hợp sau khi DONE. 
**TASKS:** đề nghị T47–T55 REVIEW, không tự chuyển DONE.
