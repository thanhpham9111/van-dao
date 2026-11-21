# DỮ LIỆU THẬT CHO GÓI 02 (trích từ game lúc chạy, 21/11/2026)

Dùng đúng id/tên dưới đây. KHÔNG đổi chỉ số có sẵn, KHÔNG đổi id.

## F1. 10 vùng (`V22_REG`) + đòn boss (`V27_BOSS`)

| id | Tên vùng | Cảnh giới | Cấp | Boss vùng | Mô tả | Tài nguyên | 3 đòn boss |
|---|---|---|---|---|---|---|---|
| `thon` | Thanh Thạch Thôn | Tân thủ | 1–1 | — | Thanh Vân Đại Điện · an toàn, NPC, luyện đan | Linh thảo, Linh mộc | — |
| `truc` | Thanh Trúc Lâm | Luyện Khí | 1–9 | Trúc Lang Vương | Bia đá Thanh Vân · đàn sói, thạch yêu | Linh thảo, Linh mộc | pounce, sweep, ring |
| `yeu` | Vạn Yêu Sơn | Trúc Cơ | 10–14 | Huyết Lang Yêu Vương | Cổ kiếm Vạn Yêu · Huyết Lang, Hỏa Thạch Yêu | Huyền thiết, Linh mộc | sweep, pounce, crush |
| `tram` | Hắc Độc Trạch | Trúc Cơ | 15–18 | Hắc Độc Chu Hoàng | Dược Vương phế đàn · Hắc Chu, Bạch Cốt Vệ | Linh thảo, Linh mộc | poison, fan, ring |
| `tuyet` | Bắc Minh Tuyết Vực | Kim Đan | 19–23 | Bắc Minh Băng Quân | Hàn Băng Linh Tuyền · thạch yêu, u hồn | Linh thảo, Linh tinh | ice, ring, fan |
| `hoa` | Xích Viêm Hoang Mạc | Kim Đan | 24–27 | Xích Viêm Xà Vương | Xích Viêm tế đàn · Hỏa Xà, Hỏa Thạch Yêu | Huyền thiết, Linh mộc | fire, crush, ring |
| `phong` | Thiên Phong Cốc | Nguyên Anh | 28–32 | Thiên Phong Lang Vương | Thiên Phong Linh Đài · linh lang, độc trùng | Linh thảo, Linh mộc | pounce, fan, sweep |
| `quy` | U Minh Quỷ Vực | Nguyên Anh | 33–36 | U Minh Quỷ Hoàng | Trấn Hồn cổ mộ · hồn ma, cốt vệ | Huyền thiết, Linh tinh | fan, poison, burst |
| `ma` | Ma Vực | Hóa Thần | 37–40 | Ma Vực Tôn Giả | Ma Môn cổ đồng · Ma Thạch Khôi và ma tướng | Huyền thiết, Linh tinh | crush, sweep, burst |
| `loi` | Tử Lôi Hoang Nguyên | Hóa Thần | 41–45 | Tử Lôi Thiên Tôn | Tử Lôi Thần Tích · quỷ tướng, ma khôi | Huyền thiết, Linh tinh | lightning, fan, ring |

Đòn boss là mã kỹ thuật: `pounce` vồ tới · `sweep` quét ngang · `ring` vòng sóng quanh thân · `crush` đập đất · `poison` vũng độc · `fan` quạt đạn · `ice` băng · `fire` lửa · `burst` nổ quanh thân · `lightning` sét giáng. Ngưỡng cảnh giới: Luyện Khí 1–9, Trúc Cơ 10–18, Kim Đan 19–27, Nguyên Anh 28–36, Hóa Thần 37–45 (cấp tối đa 45). Tu vi cần lên cấp = `32 + 12×(cấp−1)`.

## F2. 25 loại yêu thú (`TYPES`, chỉ số = id)

| id | Tên | HP | Công | Tốc | Ghi chú |
|---|---|---:|---:|---:|---|
| 0 | Trúc Lang | 62 | 15 | 110 | thường |
| 1 | Thạch Yêu | 122 | 27 | 56 | thường |
| 2 | U Hồn | 73 | 15 | 82 | thường |
| 3 | Trúc Lang Vương | 530 | 25 | 102 | boss truc |
| 4 | Bạch Cốt Vệ | 125 | 24 | 93 | thường |
| 5 | Hắc Chu | 94 | 17 | 100 | thường |
| 6 | Hỏa Xà | 145 | 21 | 81 | thường |
| 7 | Quỷ Môn Ma Tướng | 900 | 31 | 96 | boss bí cảnh (Quỷ Môn) |
| 8 | Huyết Lang | 98 | 19 | 145 | thường |
| 9 | Hỏa Thạch Yêu | 175 | 26 | 83 | thường |
| 10 | U Minh Lang | 122 | 23 | 155 | thường |
| 11 | Ma Thạch Khôi | 240 | 32 | 90 | thường |
| 12 | Huyết Lang Yêu Vương | 900 | 31 | 96 | boss yeu |
| 13 | Hắc Độc Chu Hoàng | 530 | 25 | 102 | boss tram |
| 14 | Bắc Minh Băng Quân | 900 | 31 | 96 | boss tuyet |
| 15 | Xích Viêm Xà Vương | 530 | 25 | 102 | boss hoa |
| 16 | Thiên Phong Lang Vương | 900 | 31 | 96 | boss phong |
| 17 | U Minh Quỷ Hoàng | 900 | 31 | 96 | boss quy |
| 18 | Ma Vực Tôn Giả | 900 | 31 | 96 | boss ma |
| 19 | Tử Lôi Thiên Tôn | 900 | 31 | 96 | boss loi |
| 20 | Cổ Linh Thủ Hộ | 1125 | 34.7 | 96 | boss ẩn (Cổ Linh) |
| 21 | Vô Cực Ma Tôn | 1125 | 34.7 | 96 | boss ẩn (Vô Cực) |
| 22 | Vạn Mộc Cự Linh | 900 | 31 | 96 | boss bí cảnh |
| 23 | Cửu U Hỏa Long | 900 | 31 | 96 | boss bí cảnh |
| 24 | Thiên Lôi Ma Thần | 900 | 31 | 96 | boss bí cảnh |

## F3. 12 NPC

| id | Tên | Vai | Cảnh giới · môn phái | Tiểu sử |
|---|---|---|---|---|
| `inn` | Thanh Thạch | Trưởng lão | Trúc Cơ · tầng 3 · Thanh Vân Tông | Người chỉ dẫn tân tu, trấn giữ Thanh Thạch Thôn. |
| `shop` | Linh Dược | Dược thương | Luyện Khí · tầng 6 · Vạn Bảo Các | Thu mua linh dược và bán đan dược. |
| `sentry` | Lục Thanh | Hộ vệ | Luyện Khí · tầng 8 · Thanh Vân Tông | Tuần tra đường vào thôn. |
| `herbalist` | Mộc Tử Y | Dược sư | Luyện Khí · tầng 5 · Bách Thảo Đường | Thu hái thảo dược và luyện đan. |
| `wanderer` | Tạ Vô Nhai | Tán tu kiếm khách | Trúc Cơ · tầng 1 · Tán tu | Du hành giữa thôn và đường trúc. |
| `bambooKeeper` | Vân Tịch | Đệ tử nội môn | Luyện Khí · tầng 9 · Thanh Vân Tông | Tĩnh tu và canh bia đá Thanh Vân. |
| `mountainHunter` | Hàn Liệt | Thợ săn yêu thú | Trúc Cơ · tầng 2 · Tán tu | Săn yêu thú ở Vạn Yêu Sơn. |
| `snowHermit` | Bạch Vân | Ẩn sĩ | Trúc Cơ · tầng 5 · Bắc Minh Sơn | Ẩn tu bên suối lạnh. |
| `swampMedic` | Đường Uyển | Y tu | Trúc Cơ · tầng 1 · Bách Thảo Đường | Nghiên cứu linh độc ở đầm lầy. |
| `desertSmith` | Thiết Nham | Luyện khí sư | Trúc Cơ · tầng 4 · Thiên Công Các | Tìm khoáng thạch luyện pháp bảo. |
| `demonWatcher` | Mạc Ly | Trấn vực giả | Trúc Cơ · tầng 7 · Huyền Minh Điện | Canh giữ đường vào trận pháp Vạn Giới. |
| `ghostSeer` | U Lan | Linh môi | Trúc Cơ · tầng 6 · U Minh Điện | Lắng nghe tàn hồn nơi cổ tích. |

## F4. 4 tông môn (`V14_SECTS`) + bậc môn phái (`V31_RANKS`)

| id | Tên | Chưởng môn (NPC) | Đạo | Vùng |
|---|---|---|---|---|
| `cloud` | Thanh Vân Tông | `inn` | Kiếm đạo · chính đạo | `thon` |
| `herb` | Bách Thảo Đường | `herbalist` | Đan đạo · linh dược | `tram` |
| `forge` | Thiên Công Các | `desertSmith` | Luyện khí · pháp bảo | `hoa` |
| `shadow` | Huyền Minh Điện | `demonWatcher` | Pháp đạo · bí cảnh | `ma` |

Bậc: Ký danh → Ngoại môn → Nội môn → Chân truyền → Trưởng lão.

## F5. 3 phái nhân vật (`V10_SCHOOLS`)

| Phái | Danh hiệu | Đánh thường | Kỹ năng | Vai |
|---|---|---|---|---|
| Kiếm Tu | Thanh Vân Kiếm Khách | Thanh Vân Trảm | Vạn Kiếm Xuyên Tâm | Cận chiến nhanh · chí mạng |
| Thể Tu | Huyền Thạch Võ Giả | Huyền Thạch Quyền | Chấn Sơn Băng Quyền | Chịu đòn · sát thương cận thân |
| Pháp Tu | Hàn Nguyệt Linh Sư | Linh Châu | Hàn Nguyệt Tam Tinh | Đánh xa · pháp thuật khống chế |

## F6. Nhiệm vụ đang có

**Chính tuyến `V12_MAIN` (giữ nguyên cơ chế 8 bước này):**

| # | Tên | Mục tiêu | Điều kiện xong | Thưởng (linh thạch/đan/tu vi) |
|---|---|---|---|---|
| 0 | Nhập đạo Thanh Thạch | Gặp trưởng lão | đã nói chuyện `inn` | 10/1/40 |
| 1 | Lĩnh ngộ công pháp | Cộng một điểm kỹ năng | cộng ≥1 điểm kỹ năng (T) | 10/1/50 |
| 2 | Bước chân giang hồ | Khám phá Thanh Trúc Lâm | khám phá `truc` | 8/1/60 |
| 3 | Trừ yêu hộ thôn | Hạ yêu thú Thanh Trúc Lâm | hạ 3 quái ở `truc` | 12/2/80 |
| 4 | Thanh Trúc yêu vương | Hạ Trúc Lang Vương | hạ boss `truc` | 20/3/120 |
| 5 | Trúc Cơ đại đạo | Đạt Trúc Cơ | đạt cấp 10 | 25/3/150 |
| 6 | Vạn Giới mở cửa | Tiến vào Vạn Giới Bí Cảnh | vào Vạn Giới Bí Cảnh | 30/3/180 |
| 7 | Thí luyện đầu tiên | Vượt phòng đầu Vạn Giới | vượt phòng đầu bí cảnh | 35/3/220 |

**Phụ tuyến `V12_SIDE`:** `wind` Gió qua Thiên Phong (Khám phá Thiên Phong Cốc); `windaltar` Thiên Phong đạo vận (Tương tác Thiên Phong Linh Đài); `thunder` Lôi vực hành giả (Hạ yêu thú Tử Lôi); `thunderaltar` Di tích lôi thần (Tương tác Tử Lôi Thần Tích).

**Việc NPC cũ (`V8_TASKS`, mỗi NPC 1 việc, thưởng 10 linh thạch +1 đan +20 tu vi):** inn → hạ Trúc Lang Vương; herbalist, swampMedic → nhặt Linh Dược Hắc Trạch; wanderer, sentry → khám phá Thanh Trúc Lâm; bambooKeeper → Bia đá Thanh Vân; mountainHunter → Cổ kiếm Vạn Yêu; snowHermit → Hàn Băng Linh Tuyền; desertSmith → Xích Viêm Thạch; demonWatcher → hạ Trúc Lang Vương + Trúc Cơ; ghostSeer → Tàn Hồn Cổ Tu.

## F7. Điểm cơ duyên trên bản đồ (`OW_POI`) — mỗi điểm lĩnh ngộ 1 lần, cờ `p.claimed[id]`

| id | Tên | Loại | Vùng |
|---|---|---|---|
| `inn` | Trưởng lão Thanh Thạch | npc | `thon` |
| `shop` | Thương nhân Linh Dược | shop | `thon` |
| `trucaltar` | Bia đá Thanh Vân | altar | `truc` |
| `yuealtar` | Cổ kiếm Vạn Yêu | altar | `yeu` |
| `snowaltar` | Hàn Băng Linh Tuyền | altar | `tuyet` |
| `swampherb` | Linh Dược Hắc Trạch | herb | `tram` |
| `firealtar` | Xích Viêm Thạch | altar | `hoa` |
| `ghostrune` | Tàn Hồn Cổ Tu | altar | `quy` |
| `dungeon` | Vạn Giới Bí Cảnh | dungeon | `ma` |
| `phongaltar` | Thiên Phong Linh Đài | altar | `phong` |
| `loialtar` | Tử Lôi Thần Tích | altar | `loi` |

Trạm trong thôn (`V13_STATIONS`): `v13_forge` Lò Đan Thanh Thạch · `v13_farm` Linh Điền · `v13_board` Bảng Ủy Thác · `v13_market` Vạn Bảo Sạp. Nguyên liệu (`V13_ITEMS`): `herb` Linh thảo, `wood` Linh mộc, `ore` Huyền thiết, `crystal` Linh tinh (+ `seed`, `elixir` Tụ Linh Đan, `ward` Hộ Thân Phù).

## F8. Kỳ ngộ đang có (`EVENT_POOL`, chỉ 3 sự kiện)

- **Cổ kiếm vô danh** — Trong bia đá vỡ, một thanh cổ kiếm tự phát ra kiếm ý. Lựa chọn: Nhận chủ (+16 công kích, mất 20 sinh mệnh.) / Lĩnh ngộ (+42 tu vi và 3 linh thạch.) / Trả về trận pháp (+25 sinh mệnh tối đa.)
- **Tàn hồn tiền bối** — Một bóng mờ đề nghị truyền thừa đổi lấy chút linh lực. Lựa chọn: Tiếp nhận (Nhận Xích Viêm Tâm Pháp; tiêu hao linh lực.) / Thỉnh giáo (+35 tu vi.) / Siêu độ (+8 phòng ngự.)
- **Linh dược ẩn** — Một linh thảo xanh phát sáng bên dòng suối dưới đất. Lựa chọn: Dùng trực tiếp (Hồi 60 sinh mệnh.) / Luyện đan (+3 Hồi Xuân Đan.) / Bán linh dược (+10 linh thạch.)

## F9. Linh bảo (`RELICS`), công pháp cũ (`TECH`), bộ trang bị (`V29_SETS`), linh thú (`V31_PETS`), linh căn (`V31_ROOTS`)

| Loại | id | Tên | Hệ | Hiệu ứng |
|---|---|---|---|---|
| linh bảo | `jade` | Ngọc Bội Tụ Linh | Thủy | Linh lực hồi nhanh hơn 50%. |
| linh bảo | `blade` | Kiếm Tâm Thạch | Kim | Công kích tăng 18%. |
| linh bảo | `blood` | Huyết Liên Tử | Hỏa | Hồi sinh mệnh khi tiêu diệt quái. |
| linh bảo | `shell` | Huyền Vũ Giáp | Thổ | Tăng 10 phòng ngự, +20 sinh mệnh. |
| linh bảo | `feather` | Thanh Phong Vũ | Mộc | Giảm hồi chiêu lướt và tăng tốc đánh. |
| linh bảo | `coin` | Thiên Cơ Tiền | Kim | Tăng phúc duyên và linh thạch nhận được. |
| linh bảo | `lantern` | U Minh Đăng | Hỏa | Tăng công kích và thiêu đốt. |
| linh bảo | `bone` | Bạch Cốt Hoàn | Thổ | Tăng phòng ngự 15. |
| linh bảo | `frost` | Hàn Ngọc | Thủy | Đòn đánh làm chậm yêu thú. |
| linh bảo | `pearl` | Lôi Châu | Kim | Tăng 10% bạo kích. |
| linh bảo | `v30_lotus` | Tam Sinh Liên Đài | Mộc | +90 sinh lực · +12 phòng ngự |
| linh bảo | `v30_sword` | Thái Hư Kiếm Ấn | Kim | Công kích +20% · chí mạng +5% |
| linh bảo | `v30_bell` | Huyền Thiên Chung | Thổ | Phòng ngự +35 · sinh lực +120 |
| linh bảo | `v30_mirror` | Cửu Tiêu Lôi Kính | Lôi | Tốc đánh +22% · công kích +18% |
| công pháp | `sword` | Thanh Vân Kiếm Quyết | Kim | Tăng 20% công kích và tầm đòn. |
| công pháp | `body` | Huyền Thạch Luyện Thể | Thổ | Tăng 14 phòng ngự và 25 sinh mệnh. |
| công pháp | `fire` | Xích Viêm Tâm Pháp | Hỏa | Đòn đánh thiêu đốt mục tiêu. |
| công pháp | `water` | Hàn Nguyệt Quyết | Thủy | Thủy khí làm chậm yêu thú, +20 linh lực. |
| công pháp | `wind` | Lưu Phong Thân Pháp | Mộc | Tăng tốc chạy và tốc độ chém. |
| công pháp | `thunder` | Lôi Minh Quyết | Lôi | Bạo kích tăng 12%, kiếm khí mạnh. |
| công pháp | `flame_sword` | Liệt Diễm Thanh Vân | Kim · Hỏa | Kiếm khí hỏa diễm, tăng sát thương, thiêu đốt mạnh. |
| công pháp | `thunder_body` | Lôi Kiếp Thần Thể | Thổ · Lôi | Thần thể mạnh, bạo kích và phòng ngự cao. |
| công pháp | `frost_wind` | Hàn Phong Linh Quyết | Thủy · Mộc | Khinh công linh hoạt, làm chậm và tăng linh lực. |
| bộ | `truc` | Thanh Trúc Lang | — | 2 món: Công +12% · 3 món: Sinh lực +75 · tốc đánh +12% (món #30, #41, #42) |
| bộ | `yeu` | Huyết Lang | — | 2 món: Công +10% · hồi máu +5 · 3 món: Chí mạng +8% · sinh lực +65 (món #31, #43, #44) |
| bộ | `tram` | Hắc Độc | — | 2 món: Thủ +22 · 3 món: Sinh lực +110 · hồi linh +3 (món #32, #45, #46) |
| bộ | `tuyet` | Bắc Minh | — | 2 món: Chí mạng +7% · 3 món: Công +18% · thủ +18 (món #33, #47, #48) |
| bộ | `hoa` | Xích Viêm | — | 2 món: Công +15% · 3 món: Thiêu đốt +12 · chí mạng +6% (món #34, #49, #50) |
| bộ | `phong` | Thiên Phong | — | 2 món: Thân pháp +30 · 3 món: Tốc đánh +20% · công +15% (món #35, #51, #52) |
| bộ | `quy` | U Minh | — | 2 món: Linh lực +60 · 3 món: Hồi linh +6 · công +20% (món #36, #53, #54) |
| bộ | `ma` | Ma Vực | — | 2 món: Thủ +35 · 3 món: Sinh lực +180 · công +15% (món #37, #55, #56) |
| bộ | `loi` | Tử Lôi | — | 2 món: Chí mạng +10% · 3 món: Công +25% · tốc đánh +18% (món #38, #57, #58) |
| bộ | `hidden_intro` | Cổ Linh | — | 2 món: Công +15% · thủ +15 · 3 món: Sinh lực +120 · hồi linh +5 (món #39, #59, #60) |
| bộ | `hidden_ma` | Vô Cực | — | 2 món: Công +22% · chí mạng +5% · 3 món: Tốc đánh +25% · sinh lực +150 (món #40, #61, #62) |
| linh thú | `wolf` | Thanh Phong Linh Lang | — | Nhanh nhẹn · cắn xé · mở ở cấp 5 |
| linh thú | `serpent` | Xích Diễm Linh Xà | — | Hỏa diễm · thiêu đốt · mở ở cấp 10 |
| linh thú | `turtle` | Huyền Thạch Linh Vệ | — | Hộ chủ · phòng ngự · mở ở cấp 19 |
| linh thú | `soul` | Tử Điện Linh Hồn | — | Lôi pháp · đánh xa · mở ở cấp 28 |
| linh căn | `metal` | Kim Linh Căn | — | Công kích +5% / bậc |
| linh căn | `wood` | Mộc Linh Căn | — | Sinh lực +35 / bậc |
| linh căn | `water` | Thủy Linh Căn | — | Hồi linh +2 / bậc |
| linh căn | `fire` | Hỏa Linh Căn | — | Thiêu đốt +3 / bậc |
| linh căn | `earth` | Thổ Linh Căn | — | Phòng ngự +7 / bậc |

## F10. 63 trang bị (chỉ số 0–62)

| # | Tên | Ô | Hệ | Công | Thủ | Style | Icon |
|---|---|---|---|---:|---:|---|---|
| 0 | Thanh Mộc Phi Tiêu | weapon | Mộc | 6 | 0 | ranged | weapons:0 |
| 1 | Diệp Vũ Loan Đao | weapon | Mộc | 9 | 0 | fast | weapons:1 |
| 2 | Hàn Nha Kiếm | weapon | Thủy | 12 | 0 | frost | weapons:2 |
| 3 | Toái Sơn Nha | weapon | Thổ | 17 | 0 | heavy | weapons:3 |
| 4 | Huyết Ẩm Đoản Đao | weapon | Hỏa | 12 | 0 | blood | weapons:5 |
| 5 | Trạch Nha Thương | weapon | Mộc | 11 | 0 | reach | weapons:6 |
| 6 | Liệp Yêu Đao | weapon | Kim | 8 | 0 | fast | weapons:7 |
| 7 | Tử Điện Kiếm | weapon | Lôi | 13 | 0 | fast | weapons:8 |
| 8 | Đại Hạ Long Tước | weapon | Kim | 23 | 0 | reach | divine:0 |
| 9 | Bích Ngọc Long Kiếm | weapon | Thủy | 18 | 0 | frost | divine:1 |
| 10 | Xích Kim Tiên Kiếm | weapon | Hỏa | 22 | 0 | heavy | divine:2 |
| 11 | Thanh Long Ngự Kiếm | weapon | Kim | 21 | 0 | reach | divine:3 |
| 12 | Lam Hải Thần Kiếm | weapon | Thủy | 22 | 0 | frost | divine:5 |
| 13 | Thiên Long Kiếm | weapon | Kim | 24 | 0 | reach | divine:6 |
| 14 | Huyền Ngọc Kiếm | weapon | Thổ | 20 | 0 | heavy | divine:7 |
| 15 | Cửu Thiên Long Kiếm | weapon | Lôi | 26 | 0 | fast | divine:8 |
| 16 | Huyền Thiết Kiếm | weapon | Kim | 12 | 0 | reach | gear:0 |
| 17 | Bách Thú Văn Khải | armor | Thổ | 0 | 16 | — | gear:1 |
| 18 | Phần Thiên Hỏa Kiếm | weapon | Hỏa | 24 | 0 | fire | gear:2 |
| 19 | Huyền Băng Thuẫn | armor | Thủy | 0 | 22 | — | gear:3 |
| 20 | Phượng Vũ Tiên Y | armor | Hỏa | 4 | 14 | — | gear:5 |
| 21 | Vô Phong Cự Kiếm | weapon | Thổ | 27 | 0 | heavy | gear:6 |
| 22 | Huyết Tâm Ngọc | accessory | Hỏa | 7 | 4 | blood | gear:7 |
| 23 | Lôi Đình Tế Kiếm | weapon | Lôi | 19 | 0 | fast | gear:8 |
| 24 | Thanh Vân Kiếm | weapon | Mộc | 10 | 0 | fast | weapons:1 |
| 25 | Thanh Vân đạo bào | armor | Hỏa | 0 | 5 | — | gear:5 |
| 26 | Toái Sơn Quyền Giáp | weapon | Thổ | 12 | 0 | heavy | weapons:3 |
| 27 | Huyền Thạch chiến y | armor | Thổ | 0 | 8 | — | gear:1 |
| 28 | Hàn Nguyệt Linh Trượng | weapon | Mộc | 8 | 0 | ranged | weapons:0 |
| 29 | Tử Nguyệt pháp y | armor | Thủy | 0 | 3 | — | gear:3 |
| 30 | Trúc Lang Nha Kiếm | weapon | Mộc | 18 | 0 | reach | divine:8 |
| 31 | Huyết Lang Hộ Uyển | accessory | Hỏa | 12 | 5 | blood | gear:7 |
| 32 | Hắc Độc Chu Ti | armor | Mộc | 3 | 21 | — | gear:1 |
| 33 | Băng Quân Hàn Kiếm | weapon | Thủy | 27 | 0 | frost | divine:8 |
| 34 | Xích Viêm Xà Tâm | accessory | Hỏa | 18 | 7 | fire | gear:7 |
| 35 | Thiên Phong Vũ Y | armor | Kim | 8 | 28 | fast | gear:1 |
| 36 | U Minh Hồn Ngọc | accessory | Thủy | 20 | 10 | — | gear:7 |
| 37 | Ma Vực Trấn Giáp | armor | Thổ | 7 | 38 | — | gear:1 |
| 38 | Tử Lôi Thiên Kiếm | weapon | Lôi | 42 | 0 | fast | divine:8 |
| 39 | Cổ Linh Thiên Ấn | accessory | Mộc | 24 | 14 | blood | gear:7 |
| 40 | Vô Cực Ma Kiếm | weapon | Lôi | 48 | 0 | heavy | divine:8 |
| 41 | Thanh Trúc Lang Pháp Y | armor | Mộc | 2 | 14 | — | gear:1 |
| 42 | Thanh Trúc Lang Linh Hoàn | accessory | Mộc | 8 | 3 | — | gear:7 |
| 43 | Huyết Lang Kiếm | weapon | Hỏa | 21 | 0 | blood | divine:8 |
| 44 | Huyết Lang Pháp Y | armor | Hỏa | 3 | 20 | — | gear:1 |
| 45 | Hắc Độc Kiếm | weapon | Mộc | 24 | 0 | — | divine:8 |
| 46 | Hắc Độc Linh Hoàn | accessory | Mộc | 12 | 7 | — | gear:7 |
| 47 | Bắc Minh Pháp Y | armor | Thủy | 5 | 27 | — | gear:1 |
| 48 | Bắc Minh Linh Hoàn | accessory | Thủy | 13 | 8 | — | gear:7 |
| 49 | Xích Viêm Kiếm | weapon | Hỏa | 30 | 0 | fire | divine:8 |
| 50 | Xích Viêm Pháp Y | armor | Hỏa | 5 | 31 | — | gear:1 |
| 51 | Thiên Phong Kiếm | weapon | Kim | 32 | 0 | fast | divine:8 |
| 52 | Thiên Phong Linh Hoàn | accessory | Kim | 16 | 10 | — | gear:7 |
| 53 | U Minh Kiếm | weapon | Thủy | 36 | 0 | — | divine:8 |
| 54 | U Minh Pháp Y | armor | Thủy | 7 | 37 | — | gear:1 |
| 55 | Ma Vực Kiếm | weapon | Thổ | 38 | 0 | — | divine:8 |
| 56 | Ma Vực Linh Hoàn | accessory | Thổ | 18 | 12 | — | gear:7 |
| 57 | Tử Lôi Pháp Y | armor | Lôi | 8 | 43 | — | gear:1 |
| 58 | Tử Lôi Linh Hoàn | accessory | Lôi | 19 | 13 | — | gear:7 |
| 59 | Cổ Linh Kiếm | weapon | Mộc | 21 | 0 | blood | divine:8 |
| 60 | Cổ Linh Pháp Y | armor | Mộc | 3 | 20 | — | gear:1 |
| 61 | Vô Cực Pháp Y | armor | Lôi | 7 | 40 | — | gear:1 |
| 62 | Vô Cực Linh Hoàn | accessory | Lôi | 18 | 12 | — | gear:7 |

## F11. Thiên kiếp đột phá (hệ V30 — `v30TrialStart`)

Khi đạt tầng 9 của một cảnh giới (cấp 9, 18, 27, 36) và đầy tu vi, ở thế giới mở, người chơi nhấn **B** → vào map **Cửu Tiêu Lôi Đài** ("Thiên kiếp đột phá · tránh vùng sét"). `rank = floor(cấp/9)`, số đợt sét = `rank + 2`. Mỗi đợt một vùng sét lần lượt: `target` (tròn quanh người chơi, bán kính 135+9×rank), `line` (dải ngang rộng 54+6×rank), `ring` (vòng quanh tâm sân). Thời gian báo trước = max(0,85; 1,55 − 0,11×rank) giây. Thắng → lên cấp, tu vi về 0, nhận tinh hoa; thua → quay lại thế giới, tăng `p.breakFails`. Hiện chưa có cảnh mở đầu, lời thoại hay hiệu ứng thăng cấp riêng.

## F12. Phím đã dùng (cấm gán trùng)

WASD, chuột trái/phải, Shift, Space, E, H, T, I, G, R, Q, M, C, J, L, N, P, B, O, U, Y, V, Tab, 1–3, F2, F6, Esc.

