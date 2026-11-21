# Review T10 — HUD nhân vật v1.1 (Claude, 21/11/2026)

**Kết luận: GẦN ĐẠT, trả về sửa 6 điểm (v1.2).** Bố cục tổng, cụm danh tính, tu vi dưới đáy, dock icon + tooltip, menu, tự mờ, xử lý T25 đều tốt và khớp code. Các điểm dưới đây là chỗ spec giả định khác với game thật. Điểm 1 là lỗi của Claude (ghi nhầm trong danh sách lỗi).

## A. Tên thật trong code (trả lời mục 15)

**Có 2 đường vẽ HUD — T11 phải sửa cả hai:**

| Nơi | Hàm vẽ | File |
|---|---|---|
| Trong thôn (cảnh V47T, nơi người chơi ở phần lớn thời gian đầu) | `v47tDraw` gọi lần lượt: `v35Identity`+`v35Status`, `v471Mini`, `v471Quest`, `v471Dock`, `v35Nav`, menu `v35Control(12,651,51,'menu','MENU',...)`, `v35Feed`, `v45Location(true,false)` | `src/48_v48_v47.js` (v47tDraw ~dòng 419) |
| Ngoài thôn (thế giới mở, bí cảnh) | `v35Render(world)` | `src/47_v45_v35.js` |

| Thành phần spec | Code thật | Ghi chú |
|---|---|---|
| Danh tính, HP/MP | `v35Identity(s)`, `v35Status()` | đang vẽ cả tu vi (`v34Bar`) và linh thạch (`◈`) → chuyển đi theo spec |
| Tên vùng | `v45Location(hub,target)`: trong thôn vẽ CỐ ĐỊNH "Khu vực an toàn / Thanh Thạch Thôn" (y29/53, không mờ dần); ngoài thôn dùng `owTitle` (3 giây, y114) | spec mục 4 muốn fade 2,8s cả trong thôn → ghi rõ có áp dụng cho thôn không |
| Thông báo (toast) | cũng trong `v45Location`: `notify`/`v21Notice`, hộp x429 w422, y84 (thôn) / y96 (có mục tiêu) / y18 | **spec chưa có** → xem điểm 3 |
| Minimap | thôn: `v471Mini` (x1026); ngoài: `v35Map`; khung `V45_BOXES.map` | |
| Thiên mệnh | thôn: `v471Quest` (x1026,y167,w232,h126 / thu gọn h32); ngoài: `v35Quest`. Dữ liệu `v12Tracked()`, `v12Progress(t)`, `v42QuestFraction(t)`, dẫn đường `v12Guide(t)`, thu gọn `v34State().quest`, nhật ký `v12Open` | nút đổi chữ thành **"Công pháp"** khi `t.action==='skill'` |
| Cụm hành động dưới giữa | thôn: `v471Dock`; ngoài thôn an toàn: `v45HubDock`; chiến đấu: `v35Dock` (7 ô) | xem điểm 2 |
| Dock phải 6 ô | `v35Nav`: Âm thanh (`v41AudioToggle`, không phím), Hành trang **I**, Công pháp **T** (sáng khi `v11SkillPoints()>0`), Nhật ký **Q**, Tùy chỉnh HUD **F2** (`v35Open`), Cài đặt **Esc** | ô 3 tên đúng là "Công pháp" |
| Menu | `v35Control(...)` mở/đóng `V33.menu` → bảng "Đạo đồ" (`v33Drawer`, x12,y322,w308,h311) | không có phím |
| Bảng góc dưới trái | `v35Feed`: **bảng tin sự kiện**, tối đa 3 dòng (y544 + i·29, x22 w274), mỗi dòng tự mờ sau 7 giây; bật/tắt bằng `v34State().feed` | KHÔNG phải nhãn vị trí, xem điểm 1 |
| Nút tương tác (E) ngoài thôn | `v35Render`: nút giữa màn hình x640, y553 khi gần điểm tương tác | spec chưa có |
| Đang chiến đấu / thôn | `v45CombatHUD()`, `v45Hub()` | đúng như spec |
| Tài nguyên | `p.stones`, `p.pills` | đúng |

## B. Cần sửa (v1.2)

1. **Bỏ "nút mắt" (mục 7 và checklist).** Không tồn tại. Hình con mắt trong ảnh là con trỏ chuột của game (vòng tròn vẽ tại vị trí chuột), lúc chụp chuột đang nằm đó. Lỗi của Claude, đã sửa danh sách lỗi trong TASKS. Viết lại mục 7 thành **bảng tin sự kiện** (`v35Feed`): tối đa 3 dòng, dòng mới ở dưới, mờ dần sau 7 giây, vị trí/kiểu mới do bạn thiết kế, không chồng menu (x24,y646) và cụm hành động.
2. **Cụm hành động dưới giữa đổi theo ngữ cảnh** (mục 8): khi đứng gần điểm tương tác (NPC, cổng, lò rèn...), hai ô đầu GỘP thành một nút rộng "Tên điểm [E]" (thôn: rộng 276px), ô "Theo nhiệm vụ" vẫn giữ. Spec cần vẽ trạng thái này, và nút tương tác ngoài thôn (hiện ở x640,y553) đặt ở đâu.
3. **Thông báo (toast)**: thêm vị trí và kiểu cho dòng thông báo (`notify`). Hiện nó nằm y84 trong thôn, sẽ đè tên vùng mới của spec (y24–88). Đề xuất y100, rộng tối đa 420, tự tắt theo thời gian sẵn có.
4. **Tùy chỉnh HUD (F2) phải còn dùng được.** Người chơi kéo, phóng to/thu nhỏ, chỉnh độ mờ, ẩn từng nhóm HUD: identity, map, quest, target, dock, left, nav, feed (lưu trong save `p.v35`). Thêm yêu cầu: mỗi thành phần mới vẫn nằm trong đúng nhóm `v35Group` tương ứng; toạ độ trong spec là vị trí GỐC, phần chỉnh của người chơi cộng lên trên. Tự mờ 65% của mục 13 nhân với độ mờ người chơi đã đặt.
5. **Tên vùng trong thôn** (mục 4): hiện vẽ cố định. Chọn: (a) giữ cố định trong thôn, chỉ fade khi chuyển vùng ngoài thế giới; hoặc (b) fade 2,8s ở mọi nơi. Ghi rõ một phương án.
6. **HP/MP khi chiến đấu** (mục 3): dock chiến đấu hiện tại đã có HP/MP. Ghi rõ: khi `v45CombatHUD()` true thì ẩn hai hàng HP/MP ở cụm danh tính (cho tới khi T13 làm lại), để không hiện hai lần.

## C. Nhỏ, sửa luôn nếu tiện

- Mục 11 ô 3: đổi "Kỹ năng" thành "Công pháp (T)"; ô 1 Âm thanh không có phím.
- Mục 6: thêm chữ nút "Công pháp" khi nhiệm vụ yêu cầu học kỹ năng.
