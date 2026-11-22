# Spec: Thanh Thạch Thôn MỚI (map tân thủ) + chuyển động nhân vật — v1.0 (Claude, 22/11/2026)

## 0. Vì sao làm lại
- **Map hiện tại:** một bức tranh 1672×941 kéo giãn thành 3200×1800 (mờ, vỡ), góc nhìn isometric của tranh không khớp góc nhìn nhân vật, tỉ lệ nhà/người lệch, nhân vật đi đè lên mái nhà (không có lớp che), điểm tương tác đặt tay lên tranh → "không ăn nhập".
- **Chuyển động hiện tại:** không có khung hình đi thật — code cắt ảnh đứng yên thành 7 dải ngang rồi lắc lệch (`v41aRig`, src/28) → cứng, giả.

## 1. Cách làm mới (phân vai)
- **ChatGPT vẽ** (có tạo ảnh): bộ "linh kiện" map + bộ bộ phận nhân vật, TẤT CẢ cùng một góc nhìn, một hướng sáng, một tỉ lệ (mục 2).
- **Claude code:** ghép map từ linh kiện (nền lát gạch tile + nhà/đạo cụ là sprite riêng), **sắp lớp theo chiều sâu (y-sort)** để nhân vật đi sau mái nhà/cây, va chạm theo khung chân nhà, camera; và **bộ xương 2D** (cutout rig kiểu Spine) cho nhân vật: chu kỳ đi/chạy/đứng thở/lướt/đánh, tóc–dải lưng–tua kiếm–vạt áo đung đưa theo vật lý lò xo.

## 2. Quy ước vẽ chung (bắt buộc cho mọi ảnh)
- **Góc nhìn:** 3/4 từ trên xuống, camera nhìn từ **phía nam**, nghiêng ~35° (thấy mái + mặt tiền phía nam; KHÔNG isometric xoay 45°). Đường ngang của nhà nằm ngang ảnh.
- **Ánh sáng:** từ **trên-trái** (tây bắc), bóng đổ về đông nam, mềm. Không vẽ bóng đổ xuống đất trong ảnh nhà/đạo cụ (code vẽ bóng) — trừ bóng tiếp đất sát chân.
- **Tỉ lệ:** nhân vật cao **104 px** trên map (1:1). Cửa ra vào cao ~120 px. 1 tầng nhà ~150 px. Cây lớn 300–500 px.
- **Phong cách:** tranh màu nước + nét mực, bán tả thực, ấm (khớp chân dung NPC và key art đã duyệt), độ bão hoà vừa. Không viền đen dày kiểu hoạt hình.
- **Nền trong suốt** cho nhà/đạo cụ/bộ phận. Ảnh nền (texture) phải **lát liền mạch** (seamless) 4 cạnh.
- Mỗi sprite nhà/đạo cụ: **đáy ảnh = chân công trình** (điểm tiếp đất ở cạnh dưới, giữa) để code đặt đúng.

## 3. Bố cục map (thế giới 3200×1800, gốc trên-trái)
```
y=0   ┌──────────────── núi + vách đá (dải nền xa) ────────────────┐
      │             [Đại điện 1600,520]          [Động phủ 2350,470]│
y=600 │ [Dược đường 640,760]   bậc đá ↓                             │
      │                  ┌──── quảng trường đá ────┐  [Tán tu 2300,980]
y=900 │ [Lò rèn 380,1180] │ [Bảng ủy thác 1460,900] │                │
      │ [Thương nhân 760,1120]  giếng 1600,1000     │ [Sân luyện 2720,1180]
y=1200│   [Chợ 1100,1220]  └── điểm xuất hiện 1600,1180               │
      │≈≈≈≈≈≈ sông chảy tây→đông y≈1400, cầu đá 1300 · cầu gỗ 2100 ≈≈≈≈│
y=1500│ [Linh điền 880,1620]                   [Hộ vệ đường 2520,1600]│
      │ rừng trúc mép tây                         [Cổng Thanh Trúc Lâm 2960,1680]→
y=1800└──────────────────────────────────────────────────────────────┘
```
- Toạ độ là **chân cửa/điểm tương tác** (nơi NPC đứng hoặc nhấn E). Giữ đúng 11 điểm hiện có: `inn` Đại điện, `shop`, `herbalist` Đan phòng, `wanderer` Tán tu, `sentry` Hộ vệ đường, `v13_forge`, `v13_market`, `v13_board`, `v13_farm`, `training`, `v31_cave` + cổng `truc`.
- Đường đi: đường đất nối mọi điểm về quảng trường; bậc đá lên Đại điện; hai cầu qua sông. Mép map: vách núi (bắc), rừng trúc (tây), sông chảy ra (đông) — chặn bằng va chạm.

## 4. Danh sách ảnh cần vẽ (GÓI 06 ChatGPT)
| Nhóm | File (`assets/map/…`) | Kích thước | Ghi chú |
|---|---|---|---|
| Nền lát (seamless) | `tile_grass_a`, `tile_grass_b` (có hoa nhỏ), `tile_stone` (đá lát quảng trường), `tile_dirt` (đường đất), `tile_soil` (ruộng), `tile_water`, `tile_sand` | 1024×1024 | Phẳng, không chi tiết nổi lớn lặp lộ. |
| Mép chuyển | `edge_dirt_1..4`, `edge_stone_1..2`, `edge_shore_1..3` | 512×256 | Nền trong suốt, mép nhoè cỏ↔đất / cỏ↔đá / bờ sông. |
| Nhà (sprite) | `b_inn` (Đại điện, có bậc), `b_herbalist`, `b_shop`, `b_wanderer`, `b_sentry`, `b_forge` (lán + lò), `b_cave` (cửa động trong vách), `b_gate` (cổng chào Thanh Trúc Lâm), `b_board` (bảng ủy thác), `b_well` | inn 960×760 · nhà 520–600 rộng · cổng 560×520 · bảng 180×220 · giếng 180×180 | Mặt tiền hướng nam, cửa giữa dưới. |
| Công trình | `s_stall_1..3` (sạp chợ), `s_bridge_stone` (440×240), `s_bridge_wood` (380×200), `s_field` (ô ruộng 2×2, 440×300), `s_dummy_1..3` (hình nộm 120×180), `s_rack` (giá binh khí 220×170) | | |
| Cây/đá/đạo cụ | `t_pine_1..2`, `t_willow`, `t_cherry_1..2`, `t_bamboo_1..3`, `r_rock_1..5`, `p_lantern_1..2`, `p_fence_wood`, `p_rail_stone` (đoạn lặp), `p_bush_1..6`, `p_crate`, `p_barrel`, `p_banner_1..2` | cây 300–500 cao | |
| Nền xa | `bg_mountains` (3200×700, núi mây, mép dưới tan vào trong suốt), `bg_cliff_1..4` (vách đá chắn bắc, 600×400) | | Dải xa có thể hơi nhạt (phối cảnh khí quyển). |

## 5. Bộ phận nhân vật — Kiếm Tu trước (GÓI 06 ChatGPT)
- Khớp nhân vật hiện có `v46hero0` (áo trắng ngọc thêu vàng, đai lưng xanh ngọc, búi tóc cài trâm, kiếm đeo lưng).
- 3 hướng: **trước (S)**, **sau (N)**, **nghiêng phải (E)** — hướng chéo code tự xoay/ghép, hướng trái lật E.
- Mỗi hướng là **một tờ** 2048×2048 nền trong suốt, các bộ phận **tách rời, không chồng nhau**, cùng tỉ lệ (nhân vật đầy đủ cao ~900 px nếu ghép): đầu (gồm tóc trước), tóc đuôi/búi, thân trên (ngực + đai), tay trên trái/phải (gồm tay áo rộng), cẳng tay + bàn tay trái/phải, vạt áo trước, vạt áo sau, đùi trái/phải, cẳng chân + giày trái/phải, kiếm (trong vỏ), dải đai buông, tua kiếm.
- Kèm ảnh `rig_ref_<hướng>.png` = toàn thân ghép sẵn đúng tư thế đứng (để Claude căn khớp) và trong báo cáo liệt kê **điểm xoay (pivot)** của từng bộ phận theo toạ độ trên tờ (vai, khuỷu, hông, gối, cổ).

## 6. Code (Claude)
- `src/65_town_map.js` (mới): dữ liệu bố cục (JSON), vẽ nền tile + mép, sprite y-sort chung với nhân vật/NPC, va chạm (hình chữ nhật chân nhà + đa giác sông/vách), camera giữ trong biên, giữ API cũ của V47T (điểm tương tác, cổng, dẫn đường, bản đồ M) để mọi hệ khác chạy nguyên.
- `src/66_rig.js` (mới): bộ xương 2D: khớp + bộ phận + chu kỳ đi (2 bước/chu kỳ, bước dài theo tốc độ thật), chạy, đứng thở, lướt, chém; tăng/giảm tốc mượt, nghiêng người theo hướng chạy; vật lý lò xo cho tóc, đai, tua, vạt áo. Thay `v41aRig` khi có ảnh bộ phận; chưa có ảnh thì giữ cách cũ.
- Bật/tắt: map mới thay map cũ khi đủ ảnh; có cờ quay về map cũ để so sánh.
