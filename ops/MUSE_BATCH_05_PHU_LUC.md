# PHỤ LỤC GÓI 05 CHO MUSE — thôn đổi thành NGOẠI MÔN SƠN MÔN (22/11/2026, Claude)

Nếu đang làm GÓI 05: **làm tiếp, không bỏ phần nào**. Chỉ cần biết 3 thay đổi dưới và làm thêm M4.

## 1. Bố cục đổi (bản 3)
- `data/town_layout.js` giờ là **file tự sinh** bởi `tools/gen_town_layout.py` (Claude giữ): map **4800×3200**, `version:3`. Đừng sửa tay file layout; cần thêm dữ liệu thì ghi vào báo cáo, Claude thêm vào script.
- Trường mới: `terraces` (thềm cao: `x,y,w,h,face,tile,stairs[{x,w}]`), `plaza` (`x,y,r`), `lilies`, `life.river_y`, `gates[0].ax/ay` (chỗ đứng khi về). Object có thể có `fallback` (ảnh tạm), `back:true` (nền xa vẽ trước), `noShadow`, `flip`.
- Ảnh concept + toàn cảnh mới: `tham_chieu/son_mon_concept.jpg`, `tham_chieu/son_mon_layout_v3.jpg`.

## 2. Bóng đổ ĐÃ CÓ (Claude, src/65)
`townDrawShadow(o)` vẽ bóng theo hình sprite + bóng tiếp đất, tham số chung `TOWN_SUN={sx,sy,alpha}`. **M1 của bạn: không viết hệ bóng thứ hai** — chỉ cập nhật `TOWN_SUN` theo giờ (sáng: bóng dài về tây = `sx` dương; trưa ngắn; chiều dài về đông = `sx` âm; đêm `alpha` rất thấp, bóng quanh nguồn sáng do lớp ánh sáng lo). Phần parallax, ánh sáng 4 mốc, nguồn sáng, sương sớm giữ như đề.

## 3. Dân làng → đệ tử ngoại môn
Trong `67_town_life.js` đổi tên/câu thoại cho hợp sơn môn (đệ tử quét sân, luyện kiếm ở sân tập lúc sáng, hái thuốc ở dược viên lúc trưa, về xá đệ tử ban đêm). Vị trí lấy theo `points` (Claude đã sửa phần toạ độ cứng sang đọc layout).

## M4 (mới) — tương tác sơn môn (file mới `src/72_sect_interact.js`)
1. **Phù ấn động phủ** (`p_cave_seal`): đóng khi `v31State().cave.lv===0` → nhấn E ở cửa động hiện thông báo điều kiện mở (lấy theo nhiệm vụ tông môn hiện có, không bịa hệ mới); khi mở chạy hiệu ứng xích đứt 1 lần (lưu `p.sectSealSeen`). Hàm hiện tại: `townSealOpen()`, `townDrawSeal()` ở src/65.
2. **Dược viên** (2 luống `herb_bed_*`): đứng trong luống nhấn E giữ 1,5 s → +1 `herb` (dùng vật phẩm có sẵn), tối đa 6 lần/ngày, lưu `p.sectHerb`.
3. **Linh tuyền** (`well_1`): uống → hồi 30% HP + MP, 3 lần/ngày (thay chức năng giếng cũ, giữ đếm cũ).
4. **Lò luyện khí** (`v13_forge`): nhấn E mở bảng P (`v30ForgeOpen()`).
5. **Giáo đầu sân luyện**: điểm NPC ở cửa tây sân (`training`) — hội thoại 1 câu + 2 nút "Luyện 1 mộc nhân / 3 mộc nhân" gọi `v42tStart(1|3)`.
6. **Đỉnh hương trước điện** (`p_incense`): khói hương bay lên (hạt), thắp hương nhấn E → buff nhỏ 5 phút (dùng hệ buff tạm của kỳ ngộ `src/55_events.js` nếu có hàm dùng chung; không có thì chỉ hiệu ứng + thông báo).
Tự kiểm Node như các gói trước; nộp chung vào `MUSE_05.zip` (hoặc `MUSE_05_part2.zip`).
