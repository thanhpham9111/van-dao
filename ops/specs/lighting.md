# T21 — Ánh sáng, cảnh quan và đồng bộ đồ họa

**Phiên bản:** 1.0 · 21/11/2026 · ChatGPT · REVIEW  
**Ưu tiên:** Chủ dự án phản ánh nền tranh, nhân vật/quái và HUD chưa cùng phong cách (BRIEF 14:00).  
**Tham chiếu:** Design Bible; T10 v1.2; T12 v1.3; T19 v1.2; T28 (HiDPI); T29 (upscale nền gốc).  
**Đích triển khai:** T22 của Muse sau T04, T08 và T21 DONE. Claude chỉ định các điểm gắn render sau T08. Không sửa code ở T21.

## 1. Mục tiêu và tiêu chí hình ảnh

- **Nền và diễn viên cùng ánh sáng:** cùng bộ màu môi trường theo giờ/vùng, nhân vật và quái có bóng tiếp đất mềm và viền sáng cùng hướng. Không còn cảm giác sprite dán nổi trên tranh.
- **Ngày–đêm có bản sắc vùng:** thôn ấm, trúc xanh trầm, tuyết xanh xám nhạt, hoang mạc vàng đất, ma/quỷ vực lạnh tối vừa đủ; chuyển giờ liên tục, không nhảy màu, đèn phát sáng khi trời tối.
- **Tỷ lệ và chiều sâu nhất quán:** chân đặt đúng đường đi, tỷ lệ thân với cửa/nhà được kiểm tại cùng mặt phẳng chân và cùng zoom; sương chỉ ở cảnh xa, hạt nhẹ, không che combat.
- **HUD thủy mặc ấm:** mực, giấy cổ, viền vàng đồng, không khung xanh lạnh. Giữ chữ và màu chỉ số rõ ở ngày/đêm; không đổi vị trí, phím, tùy chỉnh F2, chức năng.
- Chỉ chỉnh trình bày, không thay ảnh nền đang dùng, map/collision/camera/AI/đồng hồ/save. T29 là việc của chủ dự án phóng to nguyên bố cục; T28 là việc HiDPI của Claude. T21 không dùng ảnh AI vẽ lại map hoặc thay đổi tỷ lệ logic.

## 2. Thành phần — hệ màu môi trường

### 2.1. Không gian tọa độ, hợp đồng lớp vẽ

Màn chuẩn Canvas logic 1280×720. Lớp grading ôm toàn viewport (0,0,1280,720); lề 24px chỉ áp dụng UI. Mọi px trong spec là logical px, không phải device px. Mỗi hiệu ứng gắn thế giới dùng cùng phép camera/zoom với đối tượng gốc; tọa độ chân và POI lấy từ renderer hiện hành, không định vị theo ảnh chụp. T28 có thể tăng backing-store tối đa ×2 nhưng hình, hitbox, radius và bảng này giữ px logic; không nhân DPR hai lần.

Phân biệt **scene** (ground, nhà, cây, vật thể, nhân vật, quái, thế giới) với **UI** (HUD/minimap, nhãn tương tác, thanh HP, thoại, modal, menu và dấu chiến đấu cần đọc). Chỉ scene nhận multiply/screen môi trường. HUD ăn tông bằng vật liệu §5, không phủ tấm màu lên mọi chữ/UI.

Thứ tự ghép (giữ thứ tự depth/occlusion của renderer cũ, không vẽ lại nguyên actor lần hai):

| Lớp | Thành phần | Blend / điều kiện |
|---|---|---|
| 0 | Ground, ảnh map, địa hình, các lớp nền xa hiện có | source-over; giữ camera và ảnh gốc |
| 1 | Sương xa §6.1 trên lớp cảnh xa đủ mask | source-over; dưới nhân vật và vật thể tiền cảnh |
| 2 | Vật thể ground, bóng tiếp đất, actor/NPC/quái, occluder theo depth hiện hành | source-over; mỗi bóng vẽ ngay trước actor tương ứng, giữ che khuất của nhà/cây |
| 3 | Grading toàn scene §2.2/2.3 | multiply rồi screen nhẹ, đúng một lần cho toàn scene, cả nền/actor/quái |
| 4 | Viền sáng theo alpha actor §4.3; ánh đèn/ lửa/cửa sổ §3 | screen, chỉ phần scene nhìn thấy, không xuyên occluder; sau nền tối, trước VFX/HUD |
| 5 | Hạt không khí §6.2 | source-over; dưới VFX gameplay và UI |
| 6 | Combat VFX, telegraph, hit flash, số sát thương, HP trên đầu, dấu tương tác | giữ blend/priority T10/T12 và renderer gốc; không grade lần hai, không giảm opacity/contrast |
| 7 | HUD hai đường vẽ, toast, tooltip; modal/thoại/bản đồ/menu | source-over, palette T10/T12/T19; không nhận multiply/screen |

Nếu renderer hiện tại xen kẽ VFX với actor, Claude chỉ định điểm gắn sau T08 để grade scene và giữ telegraph/HP readable; không tách depth bằng cách gom tất cả actor lên trước hoặc sau toàn bộ nhà. Viền sáng chỉ áp vào phần silhouette đang thực sự nhìn thấy, bỏ nếu không có cách mask hiệu quả. Nếu ánh sáng hiện hữu đã được vẽ trong world renderer (bóng/overlay/ngày đêm/lửa/hạt), tận dụng hoặc điều chỉnh **một** hệ, không cộng một overlay thứ hai cùng nhiệm vụ. Hiệu ứng chuyển cảnh/splash/hit-stop/flash gốc giữ riêng, không ghi đè.

**Các màu dưới đây ngoài bảng C là palette mỹ thuật scene đề xuất theo yêu cầu T21**, không thay màu hằng số C hay Design Bible. Chủ dự án duyệt trong REVIEW trước sử dụng; HUD chỉ dùng bảng C hiện có. Không neon, không bloom mạnh hay filter làm mất nét toàn màn.

### 2.2. Chu kỳ màu theo giờ

Nguồn duy nhất `p.worldTime` (0–360 = một ngày theo BRIEF). Dùng đồng hồ gốc, không tăng riêng, không ghi lại save, không đổi độ dài ngày. Bảng thiết kế biểu diễn giờ địa phương bằng t=15 đơn vị/giờ, 0/360 là 00:00; **Claude kiểm tra pha 00:00 và mốc hiển thị giờ thật**. Nếu game dùng offset hoặc quy ước khác, quy đổi giờ hiển thị thực sang t của bảng, không sửa p.worldTime hay điều kiện gameplay. Khi t ngoài miền, wrap 0..360. Trường không hợp lệ dùng mốc 12:00 cho render, không ghi p.worldTime.

Mỗi mốc định nghĩa 4 nhóm: màu bóng trường (multiply) `M` và alpha aM; màu ánh môi trường (screen) `S` và alpha aS; hệ số đèn đêm L; hệ số bóng tiếp đất K. Màu nội suy theo từng kênh RGB sRGB, alpha và hệ số nội suy tuyến tính giữa mốc liền kề (cùng cặp mốc). Không bật/tắt bằng ngưỡng giờ cứng; 360 trùng 0. Không dùng random để đổi màu.

| t | Giờ | Cảnh | M / aM | S / aS | L | K |
|---:|---|---|---|---|---:|---:|
| 0 | 00:00 | Tĩnh dạ | #58617A / 0.58 | #8592AB / 0.035 | 1.00 | 0.60 |
| 60 | 04:00 | Trước bình minh | #697386 / 0.48 | #899CB0 / 0.045 | 0.90 | 0.65 |
| 90 | 06:00 | Bình minh | #C9AD92 / 0.30 | #F1C99E / 0.075 | 0.30 | 0.85 |
| 120 | 08:00 | Sáng | #EEE3CA / 0.15 | #F3DEB4 / 0.035 | 0.00 | 1.00 |
| 180 | 12:00 | Chính ngọ | #F0E8D6 / 0.12 | #F5E6CA / 0.025 | 0.00 | 1.00 |
| 240 | 16:00 | Xế chiều | #E3CEB1 / 0.19 | #F1CD9C / 0.055 | 0.00 | 0.95 |
| 270 | 18:00 | Hoàng hôn | #AF8779 / 0.38 | #E9B188 / 0.075 | 0.55 | 0.78 |
| 300 | 20:00 | Đêm | #697384 / 0.52 | #8795AC / 0.045 | 0.95 | 0.65 |
| 360 | 24:00 | Tĩnh dạ | #58617A / 0.58 | #8592AB / 0.035 | 1.00 | 0.60 |

L là cường độ sáng đèn lồng/cửa sổ; nguồn lửa đang cháy không tắt giữa ngày (xem §3). K nhân alpha và độ lệch bóng tiếp đất, không đổi sprite. Hướng sáng chính screen-space từ trên-trái, vector đơn vị (-0.707,-0.707), thống nhất với tranh thôn đang chụp; giữ hướng cố định cả ngày để không đối nghịch bóng đã vẽ trong nền. Độ dài bóng nhỏ §4, không dựng bóng mặt trời dài theo giờ. Nếu tranh vùng có hướng sáng khác rõ, Claude xác nhận hướng trước khi áp dụng vùng đó; tắt rim nếu không thể đồng nhất, không quay nền.

### 2.3. Màu đặc trưng theo 10 vùng thực

Nguồn id từ `p.mapId` và `REGIONS` (T14/T19). Hàng là lớp nhuộm vùng **bổ sung rất nhẹ** trên bảng giờ. Vùng không có id hợp lệ hoặc scene đặc biệt chưa được xác nhận: profile trung tính Mv=#FFFFFF/aV=0, dùng màu ngày–đêm nếu scene gốc có chu kỳ; không tự nhận sân luyện là vùng ma. Màu sương F và alpha cực đại aF chỉ ở lớp xa; màu hạt P, số hạt N tại mức đầy đủ. Bảng không định nghĩa thêm vùng/điều kiện mở vùng.

| ID / vùng | Mv / aV (multiply) | F / aF (source-over) | P / hạt / N tối đa | Ánh địa phương chủ đạo |
|---|---|---|---|---|
| thon · Thanh Thạch Thôn | #E8D5B6 / 0.10 | #EEE0C9 / 0.11 | #E9CFA3 · bụi vàng nhẹ · 18 | #FFD298 |
| truc · Thanh Trúc Lâm | #BCCDB4 / 0.14 | #D4DECA / 0.14 | #B9C9A2 · lá trúc · 22 | #E1D7AB |
| yeu · Vạn Yêu Sơn | #B7B8A3 / 0.12 | #CEC9B7 / 0.12 | #C4BB9D · bụi rừng · 18 | #E6C49B |
| ma · Ma Vực | #887A8A / 0.17 | #ABA0AB / 0.14 | #AB8C91 · tro nhỏ · 20 | #E8B3A4 |
| tuyet · Bắc Minh Tuyết Vực | #C4D3E0 / 0.11 | #E0E8EA / 0.18 | #E5E9E7 · tuyết mịn · 26 | #D6E4E8 |
| tram · Hắc Độc Trạch | #A5B7A2 / 0.16 | #BBCBB5 / 0.18 | #C3CBAA · hơi nước · 18 | #D5D7AA |
| hoa · Xích Viêm Hoang Mạc | #DDB68D / 0.12 | #DCC6A5 / 0.10 | #DEBC91 · bụi cát · 24 | #FFD0A0 |
| quy · U Minh Quỷ Vực | #A1A8BA / 0.16 | #BFC2CA / 0.17 | #C5C9CF · phù du trắng · 18 | #D5D7E5 |
| phong · Thiên Phong Cốc | #D2DABF / 0.11 | #DDE2D0 / 0.12 | #D0D5B7 · lá/gió · 24 | #ECE0B9 |
| loi · Tử Lôi Hoang Nguyên | #A8AFC0 / 0.14 | #C4CBD6 / 0.12 | #CCD0DE · bụi linh khí · 18 | #D9DCE9 |

Không dùng vùng = mức tối gameplay, nguy hiểm hay cấp đề nghị. Tất cả là trình bày. Không đưa tia chớp toàn màn hoặc độc khí gây tưởng nhầm sát thương thật.

### 2.4. Công thức hòa màu, giới hạn và đổi vùng

Multiply từng kênh màu chuẩn hóa 0–1: hệ số thời điểm = 1−aM+aM×M; hệ số vùng = 1−aV+aV×Mv. Nhân hai hệ số, clamp từng kênh [0.55,1.0] để ban đêm vẫn đọc được đường/nhân vật; nếu hai lớp quá đậm cùng lúc không cộng alpha trực tiếp. Có thể gộp hai multiplier thành **một** fill multiply với màu hệ số đã tính và alpha 1, tương đương 2 pass khi không clamp. Screen màu S với aS theo bảng, alpha không quá 0.075. Dùng cùng công thức cho nền và actor; không nhuộm riêng áo, da, quái bằng tông khác mâu thuẫn. Không apply lần hai qua CSS filter/overlay HUD.

Kiểm bằng mốc thon 12:00: aM 0.12, aV 0.10, tổng hệ số M hiệu dụng xấp xỉ R=0.984, G=0.973, B=0.953 (trước screen); chỉ ấm nhẹ. Thon 00:00: hệ số xấp xỉ R=0.615, G=0.630, B=0.678 trước screen; tối vừa, không đen đặc. Đây là thông số màu tính từ thiết kế, không phải đo ảnh game. Không tăng brightness toàn màn để bù tùy tiện.

Khi `p.mapId` đổi và renderer cảnh mới đã sẵn sàng, nội suy profile vùng từ cũ→mới trong 600ms bằng ease-in-out, đồng hồ giờ vẫn cập nhật. Nếu game đang chuyển cảnh/splash, chỉ cập nhật profile đích một lần lúc cảnh mới hiện và giữ fade gốc, không ghép thêm fade toàn màn; không kéo thêm thời gian chuyển cảnh. Nếu người chơi load/teleport, thiết lập trực tiếp profile đúng save, không flash màu vùng cũ. Nếu giảm chất lượng, giữ màu toàn scene (multiply ưu tiên, screen chỉ bỏ khi cần); không tạo sai khác vùng/camera/input.

## 3. Nguồn sáng địa phương (đèn lồng, cửa sổ, lửa)

Chỉ gắn với nguồn **thật đang được vẽ** bởi renderer POI/decor/scene (sau T08) hoặc metadata có sẵn. Điểm phát world-coordinate là tâm vùng sáng của sprite/đồ vật thật (lantern center, ô cửa, ngọn lửa), được chiếu ra màn hình bằng camera gốc. Không tự tạo tọa độ trên ảnh nền/đo pixel từ T29, không bật đèn ở nhà/vật thể chưa có nguồn. Nếu ảnh nền đã vẽ đèn nhưng chưa có anchor thực, Claude/Muse đánh dấu đúng anchor từ POI trước khi thêm; nếu không xác nhận, bỏ glow địa phương. Không sửa collision hoặc thêm POI tương tác.

| Loại | Màu screen | Bán kính halo (px @zoom chuẩn) | Alpha đỉnh | Điều kiện |
|---|---|---:|---:|---|
| Đèn lồng | #FFD298 | 62 | 0.26 × L | đèn hiện hữu, khi L>0 |
| Cửa sổ sáng | #F1C18D | 48 | 0.18 × L | cửa sổ có ánh sáng/anchor thật, khi L>0 |
| Lửa / lò / đuốc đang cháy | #EFB17E | 76 | 0.14 + 0.12×L | status lửa gốc bật, cả ngày/đêm |
| Linh quang nguồn môi trường có sẵn | màu Ánh địa phương của vùng §2.3 | 44 | 0.12 + 0.06×L | chỉ nguồn môi trường đã có, không thay VFX phép |

Tại tâm bloom tròn mềm, radial falloff: 0%r = alpha đỉnh, 25%r=0.72×đỉnh, 60%r=0.25×đỉnh, 100%r=0. Không viền trắng, không thêm đốm sáng giả lên ảnh. Bán kính scale với camera hiện hữu giống đối tượng (clamp ở logic 24–120px để tránh fill-rate); khi đối tượng offscreen/cạnh ngoài kiểm bounding halo, cull nếu nằm hoàn toàn ngoài viewport. Nếu nguồn bị occluder che, clip phần halo theo layer/mask gốc hoặc bỏ nguồn đó, không chiếu xuyên mái/tường. Không paint lên HUD.

Nhấp sáng nhẹ: đèn lồng/cửa sổ dùng chu kỳ 1800–2600ms, hệ số 0.96–1.04; lửa 700–1100ms, 0.88–1.10; linh quang 2400–3200ms, 0.95–1.05. Pha cố định theo id nguồn (không lấy Math.random gameplay), nội suy sin hoặc đường cong mượt, không giật biến thiên mỗi frame. L<=0.01 thì cull đèn/cửa sổ, lửa vẫn theo trạng thái. Alpha thực = đỉnh × modulation, clamp 0–0.29. Không đổi trạng thái lửa/điều kiện gameplay.

Giới hạn tối đa **6 nguồn** thấy được ở mức đầy đủ; tối đa 2 halo chồng nhau tại cùng vị trí. Xếp nguồn thật theo khoảng cách tới tâm camera, bằng khoảng cách ưu tiên id ổn định; chọn lần lượt, loại ứng viên nếu bounding rect của nó và hai halo đã chọn cùng có phần giao chung (kiểm rect, không đọc pixel). Như vậy không có điểm chịu ba halo. Duy trì lựa chọn cũ nếu thứ tự không đổi đáng kể; fade nguồn vào/ra 150ms, không vượt cap kể cả khi fade. 2 halo alpha đỉnh 0.29 cho screen tổng tối đa khoảng 0.50. Dùng sprite radial cache theo màu/size (64–128px texture logic), không tạo gradient từng frame hoặc đọc pixel toàn canvas. Không dùng blur/filter trên toàn màn. Nguồn ở scene đặc biệt thiếu metadata: off.

## 4. Nhân vật, NPC, quái — tiếp đất, ánh sáng, tỷ lệ

### 4.1. Hợp đồng điểm chân và tỷ lệ

Vấn đề hiện tại: nền HD chi tiết, sprite có thể nhỏ hoặc sắc độ khác, bóng/viền không chung với ánh sáng nền. Dùng anchor chân thật từ `v9HeroBody`, `v9NPCDraw` và renderer quái thật sau T08. Thân sprite nhìn thấy (không tính padding trong suốt, tóc/kiếm/phép vượt dài) lấy W,H và điểm đặt chân (fx,fy). Tọa độ tương tác, hitbox, collision, bán kính đòn, camera, tốc độ không đổi. Anchor chân phải không xê dịch khi idle/run/attack; khi sprite đổi hướng/scale không căn lại center từng frame. Với thực thể bay theo logic thật, bóng ở vị trí tiếp đất gốc, không trôi theo độ cao hình.

Đánh giá tại zoom mặc định của scene, mặt đất/cao độ phối cảnh **cùng vị trí chân**, lấy dựng ảnh T29 không đổi bố cục; không dùng cùng kích thước pixel cho nhân vật ở xa/gần khác zoom. Mốc chính là chiều cao lối cửa người đi thật (không dùng cả mái/gate), đo ảnh gốc tại đúng điểm chân trước khi scale. Chốt hero H mục tiêu = 0.65–0.80 chiều cao ô cửa thường, ưu tiên 0.72; tham chiếu 72–86px khi ô cửa thường khoảng 100–120px ở zoom chuẩn. Không đặt H tuyệt đối khi chưa đo được cửa; nếu nền có nhân vật nghệ thuật vẽ sẵn không dùng làm chuẩn. Cổng lớn/đền: tỷ lệ đỉnh cổng khoảng 2.5–4.0 H hero, chỉ để kiểm mắt, không chỉnh ảnh cổng.

| Đối tượng | H mục tiêu so hero ở cùng mặt phẳng, zoom | Quy tắc |
|---|---:|---|
| Hero | 1.00 (tham chiếu 72–86px) | chuẩn chung quanh cửa |
| NPC người trưởng thành | 0.90–1.10 | không đổi vóc dáng/đặc trưng NPC |
| Quái nhỏ/gần mặt đất | 0.50–0.85 | giữ silhouette từng loại |
| Quái thường | 0.90–1.25 | không để thú cùng loại đổi kích cỡ ngẫu nhiên |
| Quái lớn/elite | 1.30–1.70 | nếu game đã phân biệt vì hình dáng |
| Boss | 1.60–2.10 | là tham chiếu hình ảnh, không áp cứng hoặc thu boss đang thiết kế lớn hơn |

Các khoảng là mục tiêu mỹ thuật, không tạo class dữ liệu mới. Muse đo hero/NPC/quái trước, chọn hệ scale render chung theo asset thật; điều chỉnh tối đa ±10% kích thước vẽ mỗi asset/loại đã được Claude xác nhận, giữ chân, camera và cùng hệ tỷ lệ W:H. Nếu lệch lớn hơn 10%, để nguyên và báo chủ dự án (có thể do ảnh nền/hitbox/tỷ lệ thiết kế gốc). Không kéo dãn trục độc lập, không lấn hitbox combat/telegraph: nếu điều chỉnh hình làm lệch va chạm/đòn, giữ kích thước cũ và chỉ áp dụng bóng/viền. Không tạo trường save/level dựa trên scale; không lấy cấp để phóng kích thước trừ logic gốc.

### 4.2. Bóng tiếp đất mềm (không bóng đen dạng đĩa)

Tọa độ gốc của mỗi bóng tại (fx,fy+1px), trước khi vẽ actor trong nhóm depth tương ứng. Dựa trên W,H thực tế đã render ở logical px, bóng xoay ngang theo mặt đất, không xoay theo hướng mặt nhân vật. Dùng stamp ellipse mềm đã cache (PNG/Canvas nội bộ 64×32, không yêu cầu asset mới) và blend source-over ink `#100b13`. Hai lớp sau là **một** bóng thống nhất, bỏ lớp bóng cứng đã có nếu trùng nhiệm vụ; nếu nền có bóng vẽ sẵn, chỉ thêm bóng actor động.

| Lớp bóng | Kích thước logic | Tâm | Alpha đỉnh | Falloff |
|---|---|---|---|---|
| Contact | w=clamp(0.80W,18,100), h=clamp(0.12H,6,16) | (fx,fy+1) | 0.24×K | ellipse 0–40%r đậm, mềm về 100%r=0 |
| Ambient | w=clamp(1.20W,24,135), h=clamp(0.20H,10,25) | (fx+3K,fy+1+3K) | 0.11×K | đỉnh tâm, mờ mềm toàn biên |

Ví dụ hero W=32,H=80 tại zoom chuẩn, K=1: contact 26×10, ambient 38×16; tâm ambient lệch phải/xuống 3px, ngược hướng sáng trên-trái. Alpha giao tâm cao nhất 1−(1−0.24)(1−0.11)=0.324 (trước grading), đêm K=0.60 còn xấp xỉ 0.20. Không viền đen 1px, không shadow kéo dài tới bánh nhà. Bóng nhận grading scene chung.

Idle/run giữ bóng cùng mặt đất, nếu frame nhấc chân vẫn giữ (fx,fy) của body. Nếu game có nhảy/bay thật: căn theo điểm đất gốc, giảm contact về 0 và ambient alpha ×0.55 theo giá trị cao độ gốc (không suy từ kích thước sprite), hồi 100ms khi tiếp đất. Không tạo cơ chế nhảy mới. Culling bóng khi actor ngoài viewport/không còn vẽ; bóng không bao giờ trở thành hitbox. Tính zoom đúng một lần, không nhân DPR.

### 4.3. Viền ánh sáng nhẹ, cùng hướng

Ánh rim không phải outline toàn thân. Từ silhouette alpha thật của sprite/frame hoặc path vẽ actor hiện tại; lấy dải cạnh trong silhouette hướng trên-trái (vector §2.2) rộng **1.0px** hero/NPC/quái thường, tối đa **1.5px** quái lớn/boss; không vẽ ngoài silhouette quá 0.5px. Chỉ phần phía nguồn sáng, alpha giảm về 0 ở cạnh đối diện. Dải cạnh theo biến đổi sprite và vị trí occluder gốc; không dùng viền vàng quanh toàn bộ khung chữ nhật. Màu rim lấy S mốc giờ §2.2 (RGB nội suy), blend screen. Để cache mask, dùng mask/frame có sẵn hoặc alpha tĩnh theo asset; không đọc pixel toàn sprite mỗi frame, không shadowBlur trên body. Nếu renderer tạo body vector, giữ một đường sáng ở đường biên hướng nguồn (không thêm outline toàn thân). Nếu mask an toàn không có, bỏ rim cho actor đó.

| Pha | Alpha rim đầu | Điều kiện |
|---|---:|---|
| Ngày (08–16) | 0.14 | ảnh sáng, viền giản dị |
| Bình minh/hoàng hôn (06/18) | 0.19 | nội suy theo giờ |
| Đêm (20–04/00) | 0.09 | tránh sprite phát sáng vô cớ |

Nội suy các mốc giờ tương tự §2.2, giá trị tối đa 0.19. Nếu có đèn nguồn thật trong bán kính 62px (dùng khoảng cách camera/world đã transform), cho rim 0.10×(1−distance/radius) bổ sung, màu nguồn đó ở phía hướng nguồn; tổng alpha tối đa 0.24, chọn **một** đèn gần nhất, không cộng nhiều đèn. Trong bóng sâu/che khuất hoặc mất mask, tắt rim cục bộ. Hiệu ứng hit flash, burn/slow, outline target, boss telegraph đã được T12 cài đặt phải ưu tiên, không ghi đè hoặc nhấp rim theo hit. Không thêm rim cho UI chân dung thanh HP hoặc icon.

## 5. HUD — chất liệu giấy/mực vàng ấm, không phá T10/T12

**Không tint toàn HUD theo giờ/vùng.** Vì color grading trên HP/MP, minimap và chữ làm sai màu trạng thái và giảm đọc, để HUD cùng tông bằng chất liệu ấm và bảng C thống nhất. Cố định palette: ink #100b13, paper #f1e4cf, gold #e3b96f, jade #a8d6c5, muted #b5a18b, red #f18474. Thay các màu nền lục/xanh lạnh ở **panel trang trí** bằng ink; các màu jade/trạng thái tốt/MP và red/HP/nguy hiểm giữ đúng semantic T10/T12. Không thay giá trị alpha/điều kiện HUD đã được duyệt, không sửa vị trí T10, không tái tạo khung lớn.

| Vật liệu HUD | Màu / alpha | Geometry / quy tắc |
|---|---|---|
| Nền panel có sẵn | ink 0.88 (hoặc alpha thành phần T10/T12 nếu khác) | bo 6px, dùng box()/ornament(), giữ kích thước/hitbox gốc |
| Viền | gold 1px, alpha 0.45 | hover theo spec gốc; không viền sáng ngoài 2px |
| Chỉ ánh vàng nội viền | gold 1px alpha 0.10 | chỉ cạnh trên và trái bên trong panel, không phủ chữ; bỏ nếu panel gốc không có diện tích |
| Texture giấy/mực ấm | paper alpha 0.025 | tile noise tĩnh 128×128 logical, chấm 1–2px phân bố thưa, clip vào nền panel; không vẽ texture lên text, thanh HP, icon, bản đồ; cache một tile, không random theo frame |
| Chữ chính/phụ | paper / muted, opacity theo spec T10/T12 | V45Sans 12–14px, V18Serif tiêu đề đúng spec; bóng ink 1px trên chữ nổi nền sáng, không làm mờ nét |
| Chân dung / icon hiện có | không grade | giữ màu semantic; viền vàng đồng, không xanh lạnh thay cho màu trạng thái |

Tọa độ mặc định của HUD khóa theo T10 v1.2 (các ví dụ: danh tính x24–336,y24–94; HP/MP khi khám phá hàng y103 và 123, tu vi/linh thạch đúng T10 §9/10; notify x430,y100,w420,h36 hoặc y150 nếu target; nhóm dưới phải x950,y610,w306,h28; menu/dock giữ nguyên). Không override T10/T12: xác nhận cả đường `v47tDraw`/`v471Mini`,`v471Quest`,`v471Dock` trong thôn và `v35Render`/`v35Identity`,`v35Status`,`v35Map`,`v35Quest`,`v35Dock`,`v35Left`,`v35Nav`,`v35Feed` ngoài thôn. `v45CombatHUD()` và T12 quyết định combat; không thay quy tắc ẩn/hiện HP/MP hoặc skill. T25b (ký hiệu cửa) và T27 (minimap quest/event) giữ nguyên gold/semantic, không nhuộm tối. T19 world map giấy cổ đã được duyệt và `world_map_addendum.md`, thoại/menu riêng không thay.

Alpha HUD thực = alpha thành phần × opacity nhóm trong p.v35 × idle (theo T10 §13), áp một lần cho texture/viền/chữ, không ghi đè save p.v35. Idle 5.000ms → 0.65 trong 400ms, khôi phục 150ms; combat/HP thấp/tooltip/modal theo T10/T12. Panel tối/giấy mờ không được tự tăng giảm theo p.worldTime. F2 giữ tùy chỉnh, ẩn nhóm không vẽ tile/hitbox thừa; photo mode giữ quy tắc hiện có. Cả ngày/đêm chữ cảnh giới và CL phải rõ, đặc biệt nền sáng (góp ý T11 tại BRIEF). Không áp grad scene cho modal/minimap/atlas/tooltip hoặc số chiến đấu.

## 6. Khí quyển và hạt cảnh quan

### 6.1. Sương xa (không sương phủ cả màn)

Màu F và alpha aF theo §2.3, nhân hệ số giờ Q: 0/60/90/120/180/240/270/300/360 lần lượt 0.80/0.80/1.00/0.70/0.70/0.70/0.90/0.80/0.80, nội suy theo cùng mốc. Alpha đỉnh không vượt 0.18. Sương ở layer xa của renderer khi có phân lớp/mask thật, không dùng một màn khói che nhân vật/quái/nhà gần; clip không vẽ lên HUD. Với parallax layer xa có sẵn, di chuyển chậm theo camera 0.15× dịch chuyển nền và drift thế giới 3px/s, bắt đầu phase ổn định theo region, tránh cảm giác màn sương gắn vào camera. Hai dải mềm kích thước tham chiếu 480×140 và 640×180 logical, tâm đặt trong layer xa được xác nhận; falloff ellipse 0–100% mờ về biên, không tạo smoke riêng mỗi frame.

Fallback với tranh nền một lớp (V47T/V48): **chỉ khi** Claude xác nhận phần trên ảnh thực sự là phong cảnh xa không có kiến trúc gần, được phép phủ dải nhẹ vùng màn x=0,y=0,w=1280,h=200 trước diễn viên (aF tối đa 0.06, fade từ y=0 tới 200, cường độ 0 ở 200, pan theo camera+mask xa nếu có). Nếu không có phân lớp hay vùng xa được xác nhận, tắt fog, không đặt sương tùy ý lên tranh hoặc vật cản. Không tự vẽ sương foreground. Cache gradient/tile sương 256×64, không filter hoặc blur toàn frame; texture alpha thay đổi chậm theo chu kỳ 8.000ms ±0.015, không nhấp.

### 6.2. Hạt cảnh quan — số lượng và chuyển động

Chỉ trong scene chơi, không chạy particle trang trí ở menu/splash/modal bản đồ/dialogue (giữ nền game theo pause/render gốc), không sinh khi scene chưa sẵn sàng. Hạt vẽ source-over trên scene, dưới telegraph/VFX/HUD, không có hitbox, collider, sát thương hoặc loot. Màu P từ bảng 10 vùng. Tất cả px và vận tốc theo logical viewport, có hệ camera cùng scene nếu world particle; đối với hạt khí quyển nhẹ screen-space cho trôi tương đối với camera 0.30×. Số N là số hạt hiện đồng thời tối đa; không sinh vô hạn.

| Kiểu (vùng) | Kích thước | vx, vy (px/giây) | Vòng đời | Alpha đỉnh |
|---|---|---|---|---:|
| Bụi vàng (thon) / bụi rừng (yeu) | 1–2px | 3–8, −3…2 | 5.000–8.000ms | 0.20 |
| Lá (truc, phong) | 3×5px, xoay chậm 15–35°/s | 8–18, 2–9 (phong 18–32, 4–12) | 5.000–8.000ms | 0.25 |
| Tro (ma) | 1–3px | 3–10, −8…−3 | 4.000–7.000ms | 0.18 |
| Tuyết (tuyet) | 1–3px | −6…6, 9–20 | 5.000–9.000ms | 0.28 |
| Hơi nước (tram) | 2–4px, mềm | 2–6, −3…1 | 5.000–9.000ms | 0.13 |
| Bụi cát (hoa) | 1–3px | 14–26, −2…5 | 3.500–6.500ms | 0.21 |
| Phù du (quy) / bụi linh khí (loi) | 1–3px | 3–9, −5…2 | 5.000–8.000ms | 0.16 |

Spawn vùng x=−24…1304,y=−24…744; hạt mới bắt đầu ngoài viền hoặc fade từ alpha 0 nếu trong scene. Fade-in 400ms, fade-out 700ms cuối đời; cull khi ra ngoài viewport+24px. Pool N cố định theo vùng, tái sử dụng slot, no allocation mỗi frame. Dùng chu kỳ/seed riêng từ region/id hạt, không gọi RNG chung ảnh hưởng gameplay/M04. Khi chuyển vùng, clear hạt cũ sau fade 200ms hoặc khi transition che cảnh, không để tuyết theo vào hoang mạc. Khi chiến đấu (`v45CombatHUD()` true theo T10/T12), giảm cap xuống floor(0.5×N), alpha ×0.6; hiệu ứng combat không bị ảnh hưởng. Không hạt chói đèn, không giả item nhặt, đom đóm khổng lồ hay lightning flash.

## 7. Tương tác, tích hợp và dữ liệu cần

T21 không thêm phím hoặc menu. Giữ cài đặt Đồ họa/Photo mode/F2 hiện có. Claude xác nhận mapping chất lượng thực của game (BRIEF T28 ghi đã có setting Đồ họa) trước T22; không tự tạo tên flag/save. Dùng tier logic dưới như chính sách renderer khi được phép, không thêm mục cài đặt ngoài T22.

| Dữ liệu / điểm gắn | Nguồn thật và giới hạn |
|---|---|
| Đồng hồ | `p.worldTime` (BRIEF: 0–360/ngày), giữ clock/update chain T04; đối chiếu mốc giờ thực §2.2 |
| Vùng | `p.mapId`, `REGIONS` gồm 10 ID T14/T19; scene thôn V47T và map V48 có đường render khác, cả hai phải cùng grade |
| Tính chiến đấu | `v45CombatHUD()` theo T10/T12; dùng để giảm hạt, không thay combat state |
| Điểm chân hero/NPC | `v9HeroBody`, `v9NPCDraw` sau T08; lấy anchor/render transform thật; quái: Claude xác nhận tên hàm/anchor gốc |
| POI, ground/decor | `hdDrawPOI`, `hdGroundChunk`, `hdEffects`, `v24DecorDraw` sau T08; xác định nguồn đèn/lửa, depth/occlusion, tránh overlay/hạt cũ trùng |
| Đường vẽ thôn / ngoài | `v47tDraw`, `v35Render` là entry HUD đã nêu ở T10; Claude chỉ định **đúng điểm vẽ scene trước HUD** trong cả hai đường sau T08, không gắn grading sau v35Render nếu đã là lớp HUD |
| HUD | `C` tại src/01_core.js, `box()/ornament()`, `v35Group`, `p.v35` và điều kiện T10/T12; giữ T25b/T27 |
| Camera/scale/hitbox/zoom | Renderer camera/transform đang dùng của từng scene; T28 giữ logic 1280×720, không tự đặt tên field |
| Asset | `assets/ASSET__v47thon.webp`, `assets/ASSET__v48map0…9.webp` (T29 giữ nguyên bố cục); dùng nền/actor thật, không tạo ảnh map mới hoặc sửa data |

**Trình tự bàn giao Claude/Muse:** (1) T08 xác định các lớp world renderer, overlay ngày đêm/bóng/hạt hiện có, hook trước HUD ở thôn và ngoài; (2) thay/chuẩn hóa grading trước, thử thon 0/90/180/270, giữ UI; (3) bóng và tỷ lệ được xác nhận riêng (đo điểm chân/cửa, không sửa hitbox); (4) rim/đèn, rồi fog/hạt theo nguồn thật; (5) HUD vật liệu phối hợp T11/T13, không ghi đè layout đang DOING; (6) đo hiệu năng/regression, mới bật tier đầy đủ. T22 dự kiến file `src/51_lighting.js` + điểm gọi do Claude chỉ định; không thêm lớp vá/override, không sửa source ở T21. Claude phải đánh dấu rõ nguồn `p.worldTime` phase, camera/scene state, anchor, layer order, setting Đồ họa, và hiệu ứng trùng có thật; không yêu cầu Muse đoán biến.

## 8. Ngân sách hiệu năng và các chế độ

Mục tiêu Design Bible 60fps (16,67ms/frame), không tuyên bố đạt khi chưa đo. M02: thôn 60,6 avg/60 min; map 59,93 avg/49 min; sân luyện chưa đánh 21,3 fps và đánh 20,53 fps. Baseline sân luyện đã thấp trước T21, ưu tiên không làm nặng thêm; M08/T08 tìm nguyên nhân. Đo A/B tại cùng commit T08/T22, cùng scene/camera/giờ/seed/cài đặt DPR, không so trực tiếp với baseline khác máy. T28 HiDPI ×2 tăng số pixel ×4; khi chạy ở DPR cao, cache/light layer nội bộ có thể ở logic 1280×720 hoặc thấp hơn với scale mượt, text/UI vẫn render theo T28.

| Tier trình bày | Grading | Bóng/rim | Đèn | Fog/hạt |
|---|---|---|---|---|
| Đầy đủ | 1 multiply + 1 screen toàn scene | 2 stamp/actor; rim cache nếu hỗ trợ | ≤6 nguồn, ≤2 overlap | fog ≤2 dải; N theo bảng |
| Nhẹ | 1 multiply, screen nếu ngân sách cho phép | 1 contact stamp; rim tắt | ≤3 nguồn | 1 dải xa; floor(N/2) |
| Tối giản | 1 multiply chung duy nhất | contact stamp 1 lớp (chỉ hero/NPC/quái đang thấy) | ≤1 nguồn đang nhìn, hoặc tắt khi chưa đạt ngân sách | off |

Không đổi bảng màu/độ sáng semantic HUD giữa tier; tối giản giữ grade và contact để không quay lại cảm giác dán sprite. Ưu tiên setting Đồ họa gốc; không tự sửa tùy chỉnh đã lưu. Nếu bộ đo thời gian frame hiện có cho phép hạ tier tạm thời: trung bình trượt 2.000ms >22ms, hạ một tier; chỉ nâng khi trung bình <17ms liên tục 5.000ms và không combat/transition; tối thiểu 2.000ms giữa đổi tier. Fade hạt/halo 200ms, không đổi tier trong ảnh kiểm thử cố định (dùng cấu hình tier đã chọn). Nếu game chưa có telemetry/setting phù hợp, dùng tier theo cài đặt có thật và báo Claude, không thêm cơ chế monitor phức tạp.

Ngân sách thêm T22: thôn/ngoài trời ở 1280×720 mục tiêu ≤1,5ms/frame trung bình, p95 ≤2,5ms ở tier đầy đủ (đo M08/profiler cùng cảnh); nếu không đạt dùng tier nhẹ/tối giản. Ở sân luyện baseline thấp, chỉ tier tối giản trước khi T08 tối ưu; không bật fog/rim/particle nặng để thử nghiệm. Giữ tổng 60fps khi baseline cho phép; nếu baseline <60, yêu cầu thêm chi phí tối giản trung bình ≤0,8ms và FPS không giảm quá 5% so với baseline cùng máy. Culling, reuse stamps, cache gradient/texture/mask, nội suy màu ở tối đa 15 lần/giây hoặc khi t/region thay đổi đáng kể; vẽ mỗi frame bằng giá trị đã cache, không getImageData/canvas/filter mới theo frame. Không ảnh full-screen trung gian nhiều hơn một nếu renderer hiện tại cho phép. Tất cả blend/globalAlpha/transform phải khôi phục sau pass, để HUD không nhận multiply.

## 9. Không làm

- Không sửa code src/index, không thực hiện T22/T08/T28/T29, không vẽ lại ảnh map. Không thêm camera, collision, NPC/quái, light interaction, gameplay, weather damage, giờ mới hoặc save field.
- Không đổi bảng C hoặc màu UI semantic, không tint HUD trực tiếp, không đổi bố cục/alpha/phím/F2/Photo của T10/T12/T19/T25b/T27; phối hợp Muse tránh giẫm T11 đang làm.
- Không dùng webgl shader/engine mới, bloom quá mức, filter blur toàn canvas, noise random mỗi frame, ánh sáng chiếu xuyên nhà, đổ bóng dài cứng hoặc kéo dãn ảnh. Không tự đặt anchor/ID/hàm chưa biết.
- Không chỉnh hitbox/tỷ lệ gameplay để ép thẩm mỹ. Không gọi render hai lần hoặc thêm override chồng. Không đánh DONE khi chưa Claude review.

## 10. Checklist nghiệm thu (Claude/Muse trên game thật)

- [ ] Cùng cảnh thôn, seed/vị trí giống nhau tại t=0,90,180,270: màu đúng bảng, nền/hero/NPC/quái đều nhận một lớp grading; chuyển mốc và wrap 360→0 không nhảy. Đồng hồ/save không đổi.
- [ ] So 10 vùng REGIONS ở 12:00 và 00:00: tông khác đúng bảng, không tối đen hoặc neon; đổi vùng 600ms (hoặc đúng transition gốc), không flash màu cũ.
- [ ] Đèn lồng/cửa sổ đang hiện sáng tăng khi tối, lửa thật còn sáng ban ngày, halo đúng anchor, bán kính/alpha/flicker theo bảng, không ánh xuyên mái/tường/HUD; không phát sáng ở nơi không có nguồn thật.
- [ ] Hero đứng/đi/đánh tại 3 mốc gần cửa nhà/cổng: chân không trượt; bóng mềm ôm chân, contact/ambient theo W/H, hướng lệch phải/xuống; không bóng đúp hoặc đĩa đen. NPC/quái theo tỷ lệ hợp lý tại cùng mặt phẳng; không thay hitbox, collision, damage range, camera.
- [ ] Rim chỉ 1–1,5px cạnh hướng sáng, không viền toàn sprite, cùng màu ánh sáng, không che hit flash/telegraph; thiếu mask thì tắt đúng actor.
- [ ] Sương chỉ ở lớp xa/mask thật, không phủ nhân vật/tiền cảnh; nếu thiếu mask dùng fallback có xác nhận hoặc tắt. Hạt đúng loại/màu/cap từng vùng, fade mượt, không dính HUD hoặc đi theo vùng cũ; combat giảm hạt, không làm mờ VFX.
- [ ] So HUD lúc giữa trưa và đêm: bảng mực ấm, viền gold, chữ cảnh giới/CL rõ, HP/MP và màu ngữ nghĩa đúng, không khung xanh lạnh. T10/T12 vị trí/hitbox, F2, idle opacity, minimap quest/event và ký hiệu cửa không đổi.
- [ ] T19 atlas/modal/thoại/menu/tooltip và số sát thương không bị multiply/screen; không click xuyên, không đổi thứ tự depth hoặc pause/resume.
- [ ] 1280×720, 1366×768, 1920×1080, và DPR ×2 sau T28: hiệu ứng/hitbox/chữ đúng logic, không nhân radius/scale hai lần; T29 ảnh đã upscale nếu có vẫn khớp vật cản.
- [ ] So A/B M02/M08 cùng máy và tier: ghi FPS avg/min/p95 frame time, thời gian render thêm; giữ ≤1,5ms trung bình tier đủ hoặc hạ tier, sân luyện ≤0,8ms tier tối giản và FPS giảm ≤5% so baseline; không lặp render/alloc mỗi frame.
- [ ] Chạy M01 và luồng chiến đấu M06 (khi có), 0 lỗi console; kiểm save M07 khi có; không regression gameplay. Không tuyên bố 60fps nếu chưa có kết quả.
- [ ] Claude xác nhận pha clock, renderer/hook sau T08, hướng ánh sáng, anchor/mask, chất lượng đồ họa và palette scene; T21 DONE rồi mới mở T22 khi T04/T08 DONE.
