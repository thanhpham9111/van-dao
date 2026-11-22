# BATCH 07 — Sprite kiến trúc sơn môn

Bộ ảnh theo art direction của ảnh tham chiếu: môi trường 2.5D vẽ tay nhiều lớp, mái ngói xanh ngọc, gỗ son, đá sáng, cây hoa điểm màu và ánh sáng ấm. PNG RGBA trong suốt; sprite dùng góc nhìn 3/4 từ phía nam; chân asset neo sát mép dưới. Kích thước file là 2× kích thước map ghi trong bảng.

## Asset inventory

| Nhóm | Tên file | Kích thước map (px) | Nội dung |
|---|---|---:|---|
| A | `b_sect_hall.png` | 1040 × 820 | Đại điện hai tầng |
| A | `b_sect_gate.png` | 640 × 560 | Cổng sơn môn tam gian |
| A | `p_lion_statue.png` | 150 × 190 | Kỳ lân đá hộ pháp |
| A | `p_spirit_spring.png` | 300 × 230 | Bồn linh tuyền |
| A | `p_incense_burner.png` | 150 × 160 | Lư hương đồng ba chân |
| A | `p_banner_sect.png` | 90 × 220 | Cờ tông môn |
| A | `p_lantern_stone.png` | 80 × 110 | Đèn đá |
| B | `b_scripture_pavilion.png` | 560 × 760 | Tàng kinh các |
| B | `b_outer_dormitory.png` | 720 × 480 | Xá đệ tử ngoại môn |
| B | `b_bell_tower.png` | 380 × 560 | Lầu chuông |
| B | `b_alchemy_pavilion.png` | 560 × 520 | Đình luyện đan |
| B | `s_covered_corridor_1.png` | 600 × 260 | Hành lang ngang |
| B | `s_covered_corridor_2.png` | 260 × 520 | Hành lang dọc |
| C | `p_cave_seal_closed.png` | 260 × 300 | Bùa phong ấn – đóng |
| C | `p_cave_seal_open.png` | 260 × 300 | Bùa phong ấn – mở |
| C | `s_herb_bed_1.png` | 420 × 260 | Luống dược thảo lam tím |
| C | `s_herb_bed_2.png` | 420 × 260 | Luống dược thảo ngọc vàng |
| C | `p_target.png` | 120 × 170 | Bia tập |
| C | `s_terrace_wall.png` | 600 × 120 | Tường kè lặp ngang |
| C | `s_stone_stairs_1.png` | 220 × 180 | Bậc đá chính |
| C | `s_stone_stairs_2.png` | 140 × 120 | Bậc đá phụ |
| C | `d_flowers_1.png` | 120 × 80 | Hoa cỏ điểm xuyết |
| C | `d_grass_1.png` | 120 × 80 | Bụi cỏ |
| C | `p_lotus_1.png` | 90 × 60 | Cụm sen nổi |
| C | `p_waterfall.png` | 240 × 360 | Thác nước |

## Phạm vi

Có 25 sprite PNG: nhóm A (7), nhóm B (6), nhóm C (12). Hai trạng thái phong ấn dùng cùng tỉ lệ đứng dọc để đổi trạng thái; thác là một frame tĩnh. Hoa, cỏ và sen có một biến thể chính; có thể tạo thêm biến thể sau khi Claude ghép thử. Gói chỉ gồm art map, không gồm HUD hay nhân vật.

## Cấu trúc

`assets/map/*.png` là đường dẫn trực tiếp để ghép vào dự án. `BATCH_07_preview.png` là contact sheet để xem nhanh.
