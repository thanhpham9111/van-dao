# GÓI VIỆC 07 CHO CHATGPT — Sprite kiến trúc SƠN MÔN TIÊN HIỆP (ưu tiên trước GÓI 05 v2)

Giao 22/11/2026 bởi Claude. Chủ dự án duyệt hướng của bạn: thôn tân thủ → **ngoại môn một tông môn tiên hiệp**, theo ảnh concept của bạn (`tham_chieu/son_mon_concept.jpg`) và góp ý `ops/specs/son_mon_gop_y_chatgpt.md`.

## Claude đã làm xong (xem `tham_chieu/son_mon_layout_v3.jpg` + `anh_hien_tai/*.png`)
- Bố cục mới 4800×3200 theo đúng concept: sơn môn phía nam → cầu đá → quảng trường bát quái → bậc đá lên Đại điện trên thềm cao; Tàng kinh các trên thềm tây bắc, xá đệ tử, đình luyện đan + dược viên phía tây; lò luyện khí + sân luyện kiếm có rào phía đông; lầu chuông trên thềm phụ; động phủ khoét vách đông bắc có phù ấn; cầu gỗ sang linh điền đông nam; ao sen tây nam.
- Thềm cao, mặt tường kè, bậc đá, quảng trường bát quái vẽ bằng code (đi được thật, va chạm thật).
- **Bóng đổ** theo hình sprite (nắng trên-trái) + bóng tiếp đất; cỏ/hoa dại/sỏi rải trên nền cỏ cho đỡ trống.
- Sprite mới **chưa có** đang tạm dùng ảnh cũ gần nhất (`fallback`): Đại điện = `b_inn`, Tàng kinh các = `b_wanderer`, xá đệ tử = `b_shop`, lầu chuông = `p_bell`, đình luyện đan = `b_herbalist`, linh tuyền = `b_well`, sơn môn = `b_gate`. Ảnh của bạn về là tự thay, không cần sửa code.

## Quy ước vẽ (giữ như GÓI 06)
Góc 3/4 từ nam ~35°, nắng trên-trái, PNG nền trong suốt, **đáy ảnh = chân công trình** (điểm đặt), nhân vật cao 104 px trên map. **Không vẽ bóng đổ xuống đất trong ảnh** (code tự đổ bóng theo giờ). Mái ngói xanh lục đồng + gỗ son + đá trắng xám như concept. Cỡ ghi dưới là **cỡ hiển thị trên map**; vẽ ảnh ×1,5–2 lần cỡ đó.

## Danh sách (tên file đúng mã — `assets/map/<mã>.png`)
### Nhóm A — làm trước
| Mã | Cỡ trên map | Mô tả |
|---|---|---|
| `b_sect_hall` | 1040×820 | Đại điện tông môn 2 tầng mái, bậc thềm + lan can đá trước cửa, biển hiệu trống chữ. Đáy ảnh = mép trước thềm của điện. |
| `b_sect_gate` | 640×560 | Sơn môn: cổng chào 3 gian mái cong, biển tròn kiếm ở giữa (không chữ), lối giữa rộng ≥ 300 px cho người đi qua. |
| `p_lion_statue` | 150×190 | Sư tử đá (kỳ lân) trên bệ — vẽ 1 con nhìn sang phải, code tự lật con bên kia. |
| `p_spirit_spring` | 300×230 | Linh tuyền: bồn đá tròn, nước xanh phát sáng nhẹ, hơi linh khí cuộn lên. |
| `p_incense_burner` | 150×160 | Đỉnh hương đồng 3 chân trước điện (khói code vẽ). |
| `p_banner_sect` | 90×220 | Cờ tông môn dọc: cột gỗ son, vải xanh lam ngọc, biểu tượng kiếm trắng. |
| `p_lantern_stone` | 80×110 | Đèn đá kiểu Nhật/Trung thấp (quanh quảng trường). |

### Nhóm B
| Mã | Cỡ trên map | Mô tả |
|---|---|---|
| `b_scripture_pavilion` | 560×760 | Tàng kinh các 3 tầng mái, cửa sổ sáng đèn. |
| `b_outer_dormitory` | 720×480 | Dãy xá đệ tử ngoại môn: nhà dài 1 tầng, hiên trước, cửa giữa. |
| `b_bell_tower` | 380×560 | Lầu chuông 2 tầng, chuông đồng lớn treo tầng trên — **thấp và tối hơn Đại điện**. |
| `b_alchemy_pavilion` | 560×520 | Đình luyện đan: đình mở 4 phía, lò đan lớn giữa, kệ dược liệu. |
| `s_covered_corridor_1` | 600×260 | Hành lang có mái, đoạn thẳng nằm ngang (nối Tàng kinh các ↔ Đại điện). |
| `s_covered_corridor_2` | 260×520 | Hành lang có mái, đoạn chạy dọc (bắc–nam). |

### Nhóm C
| Mã | Cỡ trên map | Mô tả |
|---|---|---|
| `p_cave_seal_closed`, `p_cave_seal_open` | 260×300 | Phù ấn phong động phủ: bùa vàng lớn + xích sáng giăng ngang cửa động (đóng); bản mở: xích đứt rơi, bùa cháy tàn. |
| `s_herb_bed_1..3` | 420×260 | Luống dược thảo có bờ đá: hoa linh thảo phát sáng (tím, xanh, vàng) — 3 kiểu. |
| `p_target` | 120×170 | Bia tập bắn/chém: khung gỗ + bia rơm vòng đỏ. |
| `s_terrace_wall` | 600×120 | Đoạn tường kè đá có lan can trên — **lặp liền mạch theo chiều ngang**. |
| `s_stone_stairs_1` | 220×180 | Bậc đá rộng (bậc lớn lên Đại điện), có má bậc hai bên. |
| `s_stone_stairs_2` | 140×120 | Bậc đá hẹp (lên thềm phụ). |
| `d_flowers_1..3`, `d_grass_1..3` | 120×80 | Decal nền: khóm hoa dại, búi cỏ (rất thấp, gần như phẳng). |
| `p_lotus_1..2` | 90×60 | Lá + hoa sen nổi trên mặt nước. |
| `p_waterfall` | 240×360 | Thác nhỏ từ dược viên đổ xuống sông (4 khung ngang nếu được: `p_waterfall_0..3`). |

## Nộp
`BATCH_07_partN.zip` (`assets/map/*.png`) + `BATCH_07_REPORT.md` (mã · cỡ ảnh · nền trong suốt? · ghi chú). Nhóm A nộp sớm được thì nộp trước để Claude ghép thử.
Sau GÓI 07 mới làm `GOI_05_ChatGPT_v2` (bộ ảnh HUD).
