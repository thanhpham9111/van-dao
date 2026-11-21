# T15 — Hệ thống hội thoại NPC (Đại Hiệp Lập Chí Truyện)

**Phiên bản:** 1.0 · 21/11/2026 · ChatGPT · REVIEW  
**Tham chiếu:** BRIEF 21/11/2026 13:50, schema T14 §0 và §3, Design Bible, T10 v1.2, T12 v1.3.  
**File dữ liệu:** `data/dialogues.js` (`DATA.dialogues`, version 1).  
**Đích triển khai:** T16 của Muse, chỉ sau T09 và T15 DONE. Không sửa code game ở T15.

## 1. Mục tiêu

- Hội thoại cổ phong, rõ ràng: chân dung NPC lớn tràn lên trên khung đáy, tên trong ấn triện đỏ, chữ xuất hiện dần, lựa chọn có điều kiện và thiện cảm riêng từng NPC.
- Sáu lần gặp cho hai NPC hiện có tại Thanh Thạch Thôn: `inn` (Trưởng lão Thanh Thạch), `shop` (Dược thương Linh Dược). Lần 3 là hội thoại lặp lại, không phát thưởng lặp.
- Bảo toàn nhiệm vụ chính số 1: hoàn tất hội thoại đầu với Trưởng lão phải đặt `p.v12Talk.inn` để game nhận đã nói chuyện. Không đổi nhiệm vụ hay tự phát thưởng nhiệm vụ.
- Bảo toàn cửa tiệm: lựa chọn “Cho ta xem hàng.” luôn có ở mọi lần gặp Dược thương, gọi đúng chức năng cửa tiệm gốc; không khóa bằng thiện cảm, cấp hay tài nguyên.

## 2. Thành phần, vị trí và mỹ thuật

### 2.1. Khung thoại trên Canvas 1280×720

Tọa độ dưới đây là pixel logic; x/y ở góc trái-trên, w×h kích thước. Dùng phép scale/hit-test Canvas hiện hành. Đây là modal phủ HUD, không phải một HUD thường trực; không đổi tọa độ T10 hoặc T12. Khung và nút dùng `box()`/`ornament()` chung.

| Thành phần | x, y | w×h px | Màu, font và quy tắc |
|---|---:|---:|---|
| Lớp phủ cảnh | 0, 0 | 1280×720 | `#100b13` alpha 0.45; chặn tương tác với cảnh/HUD |
| Nền khung thoại | 24, 408 | 1232×288 | ink `#100b13` alpha 0.92; viền gold `#e3b96f` alpha 0.70, 1px |
| Vùng tranh NPC | 40, 192 | 288×456 | Chân dung đứng, aspect contain, không kéo méo; chân/dưới ảnh y=648; không đè cột văn bản |
| Đế tranh | 48, 648 | 272×24 | ink alpha 0.75; viền gold alpha 0.35 |
| Tên người nói | 344, 382 | 392×38 | Ấn triện red `#f18474` alpha 0.90, viền gold 1px; V18Serif 20px đậm, ink; padding 12px |
| Thiện cảm | 900, 382 | 264×38 | ink alpha 0.92, viền gold alpha 0.45, V45Sans 14px jade `#a8d6c5` |
| Nút đóng | 1172, 382 | 60×38 | “Esc”, V45Sans 14px paper `#f1e4cf`, viền gold alpha 0.55 |
| Nội dung thoại | 344, 434 | 864×66 | V45Sans 18px paper, line-height 22px, tối đa 3 dòng, căn trái |
| Lựa chọn 1 | 344, 510 | 864×34 | V45Sans 14px, nền ink alpha 0.90, viền gold alpha 0.45 |
| Lựa chọn 2 | 344, 548 | 864×34 | Như trên |
| Lựa chọn 3 | 344, 586 | 864×34 | Như trên |
| Lựa chọn 4 | 344, 624 | 864×34 | Như trên; chỉ khi node có 4 lựa chọn |
| Nút Tiếp / Kết thúc | 1036, 602 | 172×48 | Chỉ với node không có choices; nền gold alpha 0.88, chữ ink 16px đậm |
| Hướng dẫn | 344, 668 | 864×18 | V45Sans 12px muted `#b5a18b` |

Tất cả thành phần nằm trong vùng an toàn 24px; chân dung có thể tràn lên trên khung nhưng clip trong vùng tranh riêng (40,192,288,456). Khi modal mở, các thành phần HUD phía sau không nhận input; không chuyển vị trí, không lưu trạng thái HUD vì hội thoại. Nếu dispatcher gốc có quy tắc ẩn HUD khi mở modal, giữ nguyên và không vẽ HUD lần hai. Khi đóng, khôi phục đúng hành vi trước đó.

### 2.2. Chân dung và tên

- `DATA.dialogues.npcs[id].portrait = null`: dùng ảnh NPC đã có trong game, nhận diện theo đúng `V8_PEOPLE` và id. T16 cần Claude xác nhận nguồn asset/renderer gốc; không tự đoán tên file ảnh. Nếu chỉ có sprite nhỏ, căn giữa vùng tranh với tỉ lệ nguyên, giới hạn phóng tối đa 2× ảnh/sprite gốc để tránh mờ; đặt đế tranh làm nền, không vẽ sprite kéo to 288×456. Nếu không tìm được ảnh, hiện đế tranh và ấn chữ “長” (inn) hoặc “藥” (shop) cỡ 44px gold, không hiện ô ảnh lỗi. Không phát sinh yêu cầu vẽ portrait mới.
- NPC nói: tên hiển thị “Trưởng lão Thanh Thạch” hoặc “Dược thương Linh Dược” (đối chiếu tên hiện có trong `V8_PEOPLE`), chân dung opacity 1.0. Người chơi nói: tên `p.v8Name` hoặc “Vô Danh” mặc định; ảnh NPC opacity 0.72, không đổi nhân vật thành NPC chủ khác; chuyển opacity 100ms. Tên giữ đầy đủ tiếng Việt, khung có thể hạ cỡ 18px nếu tên dài; nếu vẫn không vừa, wrap 2 dòng cỡ 16px, line-height 18px trong 38px, không cắt chữ. Tooltip tên đầy đủ nếu tên tùy chỉnh quá dài.
- Thanh thiện cảm luôn là của NPC đang trò chuyện (kể cả khi người chơi nói): vùng x=912 y=392 w=164 h=20, “Thiện cảm: N/100”, jade, V45Sans 14px; thanh tiến độ x=1082 y=400 w=68 h=5 nền muted alpha 0.30, fill jade theo N/100. Đọc `p.favor[npcId]`, mặc định 0; clamp 0–100. Không tự đặt “thân thiết” hoặc khóa shop. Chỉ đổi sau khi effects đã commit.

### 2.3. Chữ chạy và lựa chọn

- Nội dung `nodes.*.text` ≤140 ký tự, hiển thị theo cụm Unicode để không làm rời dấu tiếng Việt. Reveal 28ms/cụm ký tự, ngắt câu có thể thêm 70ms sau dấu chấm/dấu hỏi (tối đa 4,5 giây cho một node). Không dùng bộ đếm theo FPS. Wrap theo toàn bộ text ngay từ đầu để chữ không nhảy dòng khi lộ dần. Nếu text dài bất thường, wrap và hạ từ 18 xuống 16px (line-height 20px); không dưới 12px, không cắt bằng “…”.
- Trong lúc chữ chạy: ẩn choices và nút Tiếp/Kết thúc; hướng dẫn “Click / Enter / Space: hiện hết · Esc: đóng”. Một thao tác chỉ hoàn tất reveal, không được đồng thời chọn hoặc chuyển node. Sau khi hiện hết, choices xuất hiện 100ms và bắt đầu nhận input ngay khi hiện rõ; với node thường, nút Tiếp xuất hiện (hoặc Kết thúc nếu `next:null`). Không tự chuyển khi hết thời gian.
- Lựa chọn: ghép số hiển thị 1–4 ngoài text tại x=356 w=24; text x=388 w=800, căn trái, V45Sans 14px paper. Viền gold 1px alpha 0.45; hover/focus viền gold alpha 1, nền gold alpha 0.12 trong 80ms; nhấn 80ms trang trí. Dòng có điều kiện không đủ: nền ink alpha 0.92, text muted alpha 0.65, viền muted alpha 0.30, không kích hoạt. Dòng điều kiện giữ nguyên tiền tố `[Thiện cảm ≥ 5]`, `[Thiện cảm ≥ 8]` trong data; hiển thị đầy đủ (không thu gọn/cắt). Dù mờ vẫn đọc được, không ẩn, không đảo thứ tự.
- Eval `cond` khi vẽ và kiểm tra lại khi nhận click/phím; không đủ thì không đổi node, không effect. Điều kiện hợp lệ theo T14: `favorMin`, `levelMin`, `stonesMin`, `pillsMin`, mọi điều kiện đồng thời đúng. T15 chỉ dùng `favorMin`; không phát sinh chi phí mua bán cho hội thoại.
- Khi node có choices, số lựa chọn đúng dữ liệu, 2–4; các hàng thừa ẩn và bỏ hitbox; không hiện đồng thời nút Tiếp/Kết thúc. Khi node không có choices, chỉ có nút Tiếp nếu `next` là ID, hoặc Kết thúc nếu `next:null`. Hướng dẫn khi có choices: “Click hoặc 1–4: chọn · Esc: đóng”. Khi không có choices: “Enter / Space: Tiếp” hoặc “Enter / Space: Kết thúc”.

## 3. Tương tác, tiến trình và hiệu ứng

### 3.1. Mở, chuyển, đóng

| Thao tác | Kết quả | Thời gian |
|---|---|---:|
| Tương tác NPC bằng hành động gốc (E/click nếu game hỗ trợ) | Qua handler hiện có sau T09; mở thoại nếu NPC id là inn hoặc shop, không đổi bán kính tương tác | fade modal 120ms ease-out; chặn input nền ngay |
| Chữ đang chạy + click vào nội dung, Enter hoặc Space | Reveal hết node hiện tại | 0ms, không chạy effect, không chuyển node |
| Chữ hoàn tất, node không choices + click Tiếp / Enter / Space | Commit effect của node một lần rồi sang `next` | chuyển node ngay, reveal mới bắt đầu sau 60ms |
| Chữ hoàn tất, node có choices + click hàng / phím 1–4 | Kiểm `cond`; nếu đạt, commit effect theo §3.3 và sang next hoặc kết thúc | cập nhật một lần; 80ms phản hồi trang trí |
| Nút Kết thúc / Enter / Space ở node terminal | Commit effects một lần, đóng modal, thông báo/tiệm nếu có | đóng logic ngay; fade 120ms nếu không ảnh hưởng dispatcher |
| Esc/nút Esc bất kỳ lúc nào | Hủy phần chưa commit, đóng; không tự coi như đã hoàn thành | đóng logic ngay; fade 120ms trang trí |
| Click vùng phủ tối ngoài khung | Không đóng, không di chuyển | 0ms |
| Tiệm (openShop=true) | Commit flag/favor, kết thúc hội thoại, mở shop gốc một lần | ngay cùng lượt, không đợi fade, không có hai modal chồng |

Enter/Space khi lựa chọn đã hiện không tự chọn đáp án đầu; phải click/phím số. Không dùng E để tiến lời thoại (tránh lặp phím vừa mở) và không dùng 1–4 kích hoạt skill khi modal đang mở. Chỉ nhận cạnh nhấn mới (không auto-repeat khi giữ phím); consume pointer/keyboard của lượt mở/đóng tại dispatcher để không xuyên vào cảnh hoặc shop vừa mở. Không tự thay cơ chế tạm dừng world/combat; dùng modal và điều kiện hiện có, không cho mở từ các tình huống bị code gốc cấm. Không có thao tác click nền hoặc phím tắt mới tác động gameplay.

### 3.2. Chọn lần gặp — thứ tự đúng schema T14

Duyệt `meetings` đúng thứ tự file, lấy lần ĐẦU TIÊN thỏa tất cả `when`. Chốt meeting và start node khi mở, không reevaluate meeting giữa hội thoại vì vừa đổi flag/favor. Lần 3 có thể lặp; không cấp thưởng ở lần 3. Không dùng counter mới hoặc `visitCount` ngoài schema. Bảng sau phản ánh chính xác data:

| NPC / meeting | when | Nội dung và hiệu ứng tiến trình |
|---|---|---|
| `inn_1` | `talkedBefore:false` | Gặp lần đầu, hỏi về tu đạo/thôn hoặc cáo từ; mọi nhánh đến node kết thúc có `talked:true`; thiện cảm +5/+3/+0 tùy nhánh. |
| `inn_2` | `talkedBefore:true`, `notFlag:"inn_second_done"` | Sinh tồn/gợi ý Thanh Trúc Lâm (thiện cảm ≥5), hoặc cáo từ; terminal đặt `inn_second_done`, thiện cảm +5/+5/+0. |
| `inn_3` | `talkedBefore:true`, `flag:"inn_second_done"` | Hội thoại lặp, lời khuyên về tu hành/boss (thiện cảm ≥8), hoặc cáo từ; không effect. |
| `shop_1` | `notFlag:"shop_intro_done"` | Chào hỏi; xem hàng (+3), lời khuyên (+3), cáo từ (+0). Mọi đường kết thúc đặt `shop_intro_done`; xem hàng mở shop ngay. |
| `shop_2` | `flag:"shop_intro_done"`, `notFlag:"shop_second_done"` | Xem hàng (+3), hỏi hồi phục (+4) hoặc cáo từ (+0). Mọi đường kết thúc đặt `shop_second_done`. |
| `shop_3` | `flag:"shop_second_done"` | Xem hàng, lời khuyên (thiện cảm ≥5), cáo từ. Chỉ mở shop, không thêm phần thưởng. |

`talkedBefore` = trạng thái thật của `p.v12Talk[npcId]` theo quy ước gốc; với Trưởng lão, lấy truthy của `p.v12Talk.inn`. `flag` đúng khi `p.flags[key] === true`; `notFlag` đúng khi chưa có hoặc không true. Nếu dữ liệu save cũ thiếu `p.favor`/`p.flags`, đọc 0/false và khởi tạo đối tượng chỉ khi cần ghi. Save cũ đã nói chuyện inn sẽ vào `inn_2` (không quay lại inn_1), còn shop chưa có cờ hội thoại mới thì vào `shop_1`, mọi lần vẫn xem hàng được. Nếu cấu trúc dữ liệu thiếu/mất, fallback tương tác gốc, không để NPC im lặng hoặc chặn nhiệm vụ/tiệm.

### 3.3. Điểm commit effect và chống cộng lặp

- Trạng thái node gồm đang reveal, sẵn sàng nhận input và đã commit; thuộc phiên UI tạm, không ghi save. Mỗi lần tiếp/chọn/kết thúc hợp lệ chỉ xử lý một lần. `effects` ở node không chạy lúc draw, khi hover, khi reveal hoặc ngay khi vào node; chạy khi người chơi xác nhận rời node (Tiếp/Kết thúc/chọn lựa chọn). `effects` trên choice chạy lúc lựa chọn được chấp nhận; nếu cả node và choice có effects, kiểm điều kiện trước và commit node rồi choice đúng một lượt; data T15 chỉ đặt effects ở terminal node hoặc lựa chọn terminal trực tiếp mở shop, không có thưởng trung gian.
- Khi terminal có `next:null`: commit effects và kết thúc cùng một lượt input. Khi choice có `next:null` (VD xem hàng), effect choice và đóng xảy ra cùng lượt. Esc trước commit không phát effects/flag/talked. Nếu đóng sớm thì mở lại đúng lần chưa hoàn thành; không thể nhận thiện cảm trước commit và lặp để farm. Giữ các cập nhật đã commit trên phiên cũ; không reset sau Esc.
- `favor`: cộng và clamp [0,100] riêng npcId. Sau commit nếu tăng, hiện phản hồi nhẹ “Thiện cảm +N” jade, V45Sans 13px, tại vùng x=900 y=354 w=264 h=20 trong 900ms, fade-out 200ms; chỉ khi modal còn hiện. Nếu modal đã đóng, không mở thêm modal; để feedback gốc của hệ thống thông báo nếu cần. Không phát thưởng ở inn_3/shop_3.
- `talked:true`: phải gọi/cập nhật đúng cơ chế hiện hữu khiến `p.v12Talk.inn` truthy. Tất cả terminal của `inn_1` (kể cả lựa chọn cáo từ) đều có `talked:true`. Đặc biệt không tạo tên field khác, không thay quest ID hoặc tự cấp phần thưởng quest. Không ghi đè truthy cũ, không xử lý hai lần nếu handler gốc đã đặt cờ; Claude xác minh vị trí kích hoạt quest và cách gỡ/cô lập đường gọi thoại cũ của hai NPC để không commit nhiệm vụ sớm hoặc lặp.
- `setFlag`: đặt `p.flags[key]=true` đúng tên data. `openShop:true` chỉ NPC `shop`, thực hiện sau commit dữ liệu, chuyển đúng panel tiệm gốc. Không thêm điều kiện thiện cảm hoặc giữ một modal thoại phía dưới shop; giá, giao dịch và vật phẩm shop giữ nguyên. Claude xác nhận tên handler mở tiệm thật trước T16 nếu BRIEF chưa nêu.
- Schema còn cho phép `stones`, `pills`, `xp` nhưng 6 lần gặp T15 không dùng các effects đó; không tự tặng linh thạch/tu vi/đan dược, không gọi handler mua bán ngoài shop. Trong T16 khi hỗ trợ các effect schema, giữ hệ thống XP/tài nguyên hiện hữu, kiểm chi phí trước commit, không cho số dư âm, không thực thi trường ngoài schema. Không tự thay cân bằng.
- Save theo cơ chế gốc: chỉ bổ sung `p.favor` và `p.flags` như T14, không đổi schema cũ khác; giữ `p.v12Talk` và mọi field cũ. UI không lưu node/reveal/session. Save cũ không có 2 field mới vẫn mở bình thường; sau lưu/tải lại, flag/favor duy trì và lần gặp tiếp tục đúng. Không ghi save mỗi frame.

## 4. Dữ liệu cần và ánh xạ

| Ý nghĩa | Nguồn / quy tắc |
|---|---|
| Nội dung thoại | `DATA.dialogues.npcs.inn`, `.shop` trong `data/dialogues.js`; `portrait`, `meetings`, `when`, `start`, `nodes`, `speaker`, `text`, `next`, `choices`, `cond`, `effects` đúng schema T14. |
| NPC | ID/metadata từ `V8_PEOPLE` (`inn`, `shop`). Mọi NPC khác giữ tương tác gốc. |
| Tên người chơi | `p.v8Name` (mặc định Vô Danh) |
| Cấp | `p.level` (điều kiện schema levelMin; data T15 không dùng) |
| Đã trò chuyện | `p.v12Talk.inn`, đặc biệt giữ nhiệm vụ chính 1; với NPC khác đọc đúng `p.v12Talk[npcId]` nếu có. |
| Thiện cảm | `p.favor[npcId]` (T14, mặc định 0, clamp 0–100) |
| Cờ | `p.flags[key]` (T14, mặc định false); ba cờ: `inn_second_done`, `shop_intro_done`, `shop_second_done` |
| Boss | `p.worldBossDead` (schema `bossDead`; data T15 không dùng điều kiện vì không yêu cầu đã hạ boss) |
| Các điều kiện tài nguyên | `p.stones`, `p.pills`; chỉ đọc khi cond tương ứng xuất hiện. |
| Hành động mở hội thoại | Điểm tương tác NPC thật sau T09 (`v8InteractAt`/`owInteract`/`v8PointerDown` theo BRIEF); Claude xác nhận đường dẫn đúng của inn/shop. |
| Điều phối modal | `panel` sau T03, dispatcher gốc cho input. Không tạo modal song song; `src/49_dialogue.js` là công việc T16. |
| Mở shop | Handler/panel tiệm đã có tại NPC `shop`. Không tự đặt tên hàm chưa được cung cấp. |

**Nạp dữ liệu:** Muse thêm script `data/dialogues.js` dưới `data/00_init.js` trong index.html (T16), trước `src/`. File data đúng một phép gán `DATA.dialogues = { ... };`, JSON hợp lệ, `version:1`, không có trường lạ, không code thực thi khác. Khi nạp: kiểm id NPC, meeting ID duy nhất, start và mọi next trỏ node có thật hoặc null, các node có điểm kết thúc, choice 2–4, text ≤140 ký tự, cond/effects đúng enum, `openShop` chỉ shop. Nếu data lỗi tại NPC, ghi cảnh báo một lần và giữ luồng gốc cho NPC đó; không làm lỗi boot hoặc mất quest/shop. Cache data, layout và text wrap theo node; không vẽ lại ảnh hoặc tạo tài nguyên mỗi frame.

**Điểm Claude cần xác nhận ở REVIEW:** (1) hành vi thật của `p.v12Talk.inn` và thời điểm nhiệm vụ 1 nhận hoàn tất, không kích hoạt sớm/đúp; (2) chỗ vào tương tác inn/shop và handler mở tiệm thật sau T09; (3) nguồn portrait/sprite gốc cho `portrait:null`; (4) modal dispatcher và phím Esc/Enter/Space/1–4 không đụng gameplay, đảm bảo đường tương tác của 10 NPC khác và các dịch vụ gốc của inn/shop (nếu có) không mất. Không khẳng định đã kiểm code repo khi BRIEF chỉ cung cấp schema; T16 phải đối chiếu các điểm trên trước khi triển khai.

## 5. Không làm

- Không code `src/`, `index.html`, T09 hoặc T16; chỉ spec và data.
- Không thêm NPC, nhiệm vụ, phần thưởng nhiệm vụ, công pháp, pháp bảo, cửa hàng, vật phẩm, dịch vụ hay vùng mới.
- Không sửa công thức mua bán, giá, khóa tiệm, combat, map, HUD T10/T12, renderer thế giới hoặc schema save cũ. Không tự thêm trường schema T14.
- Không vẽ ảnh mới; portrait null tận dụng tài nguyên đã có. Không dùng màu neon, chữ nhỏ dưới 12px, không nhãn bị cắt.

## 6. Checklist nghiệm thu (Claude/Muse kiểm trên bản chơi)

- [ ] Data parse hợp lệ, đúng schema T14; đủ hai NPC × ba lần gặp, toàn bộ next/choices hợp lệ, mỗi nhánh có điểm kết thúc; không lỗi console.
- [ ] Khung (24,408,1232,288), tranh (40,192,288,456), tên ấn đỏ, thiện cảm và bốn hàng lựa chọn đúng vị trí; ở 1280×720, 1366×768, 1920×1080 không cắt chữ, không chồng cột hoặc sai hitbox.
- [ ] Chân dung đúng NPC, player dùng tên p.v8Name, fallback không có ô lỗi. Chữ Việt có dấu reveal 28ms/cụm; click/Enter/Space đầu chỉ hiện hết, click sau mới chuyển.
- [ ] Inn lần đầu: từng nhánh kết thúc (kể cả cáo từ) đặt p.v12Talk.inn truthy, nhiệm vụ chính 1 hoàn tất theo logic thật; Esc trước commit không tự nhận hoàn tất, không nhân phần thưởng.
- [ ] Inn lần 2: đúng điều kiện đã nói chuyện, nhánh thiện cảm ≥5 mờ khi thiếu; lựa chọn không đủ không chạy effect. Lần 2 hoàn tất đặt inn_second_done; lần 3 mở đúng, nhánh ≥8 đúng điều kiện; lặp lần 3 không tăng thiện cảm.
- [ ] Shop cả ba lần đều có “Cho ta xem hàng.” hoạt động ngay, thiện cảm 0 vẫn mở được; mở tiệm gốc một lần, không modal chồng, không thay giá/vật phẩm. Kể cả nhánh cáo từ hoặc hỏi chuyện, flag tương ứng đặt đúng khi kết thúc.
- [ ] Giữ phím/nhấp nhanh, đóng/mở lại khi text đang chạy hoặc trước terminal: không nhân effect, không ghi flag trước xác nhận. p.favor luôn 0–100, độc lập cho inn và shop.
- [ ] Save cũ đã nói chuyện inn không quay lại inn_1; save cũ thiếu flags/favor tải được; lưu→tải lại giữ đúng cờ và thiện cảm, không đổi các field cũ.
- [ ] Không có XP/linh thạch/đan dược phát thêm từ thoại; không làm sai tiến trình quest cũ hoặc các dịch vụ của inn/shop. 10 NPC khác vẫn tương tác như trước.
- [ ] Click/phím khi modal mở không xuyên xuống scene/HUD/skill; mở/đóng giữ hành vi pause/resume gốc; Esc đóng sạch. Không tự auto-advance.
- [ ] Kiểm lại M01, nhiệm vụ Gặp trưởng lão và luồng mở tiệm; đo hiệu năng mở thoại, hướng tới 60fps, không tạo asset/gradient mỗi frame.
- [ ] Claude review xong → T15 DONE; Muse chỉ bắt đầu T16 sau T09 và T15 DONE.
