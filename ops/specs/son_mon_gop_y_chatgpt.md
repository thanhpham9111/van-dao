# Góp ý Claude — tích hợp map sơn môn tiên hiệp

## Mục tiêu

Chuyển map thôn tân thủ thành **khu ngoại môn của một tông môn tiên hiệp**. Dùng ảnh concept “Bản đồ sơn môn tiên hiệp” làm tham chiếu bố cục và ngôn ngữ kiến trúc. Ảnh concept không phải nền game cuối: hãy lắp cảnh từ tile, sprite và các lớp riêng để nhân vật di chuyển, tương tác và bị che khuất đúng cách.

## Bố cục đề xuất

- **Phía nam — sơn môn và điểm xuất hiện:** cổng nằm trọn trong khung chơi. Tuyến chính đi qua cầu đá đến quảng trường.
- **Trung tâm — quảng trường ngoại môn:** đặt bảng nhiệm vụ và linh tuyền ở vị trí dễ nhìn. Giữ khoảng trống cho nhân vật và NPC.
- **Phía bắc — đại điện:** đặt trên nền cao, làm mốc kiến trúc chính; dẫn lên bằng bậc đá có thể đi được.
- **Tây và tây bắc — dược viên, luyện đan, tàng kinh các, xá đệ tử:** các công trình phụ thấp hơn đại điện, nối bằng hành lang có khoảng hở rõ.
- **Phía đông — sân luyện kiếm và lò luyện khí:** gom hình nộm, giá kiếm và bia tập trong một sân có ranh giới; có lối quay lại quảng trường.
- **Đông bắc — động phủ:** đặt sau cổng/phù ấn phong tỏa; chỉ mở sau nhiệm vụ phù hợp.
- **Lầu chuông:** đặt gần tuyến bậc lên đại điện, làm mốc phụ; không cao hoặc sáng hơn đại điện.

Giữ một đường chính dễ đọc và các nhánh phụ ngắn. Cầu gỗ phụ chỉ nên giữ nếu dẫn đến khu vực có mục đích riêng.

## Kiến trúc cần bổ sung thành sprite riêng

Các mã dưới đây là đề xuất mới, vì ảnh concept có những công trình chưa có trong bộ asset map hiện tại:

- `b_sect_hall`: đại điện tông môn.
- `b_scripture_pavilion`: tàng kinh các nhiều tầng.
- `b_outer_dormitory`: dãy xá đệ tử bao quanh sân nhỏ.
- `b_bell_tower`: lầu chuông hai tầng.
- `s_covered_corridor_1..2`: hành lang có mái nối các sân.
- `s_stone_stairs_1..2`: bậc đá và chiếu nghỉ giữa các cao độ.
- `p_cave_seal`: phù ấn/cổng phong động phủ, có trạng thái đóng và mở.

Tiếp tục dùng các asset sẵn có cho cổng, bảng nhiệm vụ, giếng, nhà dịch vụ, dược liệu, đá, cây và đạo cụ. Không kéo giãn nhà trọ hoặc cửa tiệm để thay cho đại điện/tàng kinh các.

## Yêu cầu tích hợp 2.5D

- Giữ góc nhìn 3/4 từ phía nam khoảng 35°, ánh sáng trên-trái và cùng hệ phối cảnh giữa công trình, đường, cầu, cây.
- Dùng lớp xa / giữa / khu chơi / tiền cảnh theo parallax lần lượt khoảng `0.25× / 0.55× / 1× / 1.35×`.
- Căn sprite theo chân đế; sắp xếp trước/sau theo điểm chân. Tạo collision ở chân công trình và mask mái riêng để nhân vật có thể đi sau nhà.
- Bậc, cầu, cổng và hành lang phải nối thật với vùng đi được; không dùng hình trang trí để giả đường đi.
- Giữ chuẩn nhân vật cao 104 px; cửa và bậc cần đủ tỷ lệ để nhìn rõ điểm vào.
- Nhân vật dùng asset của Gemini; không tạo hoặc sửa bộ phận nhân vật trong gói map.

## Tương tác và tiêu chí đạt

1. Vừa vào từ cổng, người chơi nhìn thấy hoặc nhận chỉ dẫn rõ tới bảng nhiệm vụ.
2. Từ quảng trường, người chơi tìm được các dịch vụ mà không phải băng qua sân tập hay đường cụt.
3. Sân tập có huấn luyện viên/điểm tương tác, hình nộm và lối quay về quảng trường.
4. Dược viên có vùng thu thập riêng; lò luyện khí có tương tác; phù ấn động phủ đổi trạng thái theo tiến trình nhiệm vụ.
5. Cửa nhà, cầu và lối chính không bị cây, cột, tiền cảnh hoặc collision chặn.
6. Kiểm tra ở camera gameplay thật: giữ quảng trường thoáng, đại điện là mốc chính, kiến trúc phụ không tranh tiêu điểm.
