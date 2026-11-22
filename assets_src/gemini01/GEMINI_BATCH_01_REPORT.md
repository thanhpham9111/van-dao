# BÁO CÁO NỘP GÓI 01 — KIẾM TU (`kiemtu`) CHUẨN 2.5D

## 1. Danh sách tệp trong gói
- `assets/rig/rig_ref_S.png` (`1024×1024`, nền trong suốt RGBA, nhân vật cao `900 px`, góc nhìn 2.5D 3/4 từ trên xuống ~35°, kèm khung xương & điểm xoay).
- `assets/rig/kiemtu_S.png` (`2048×2048`, nền trong suốt RGBA, `21` bộ phận tách rời hoàn toàn, cách nhau `≥ 48 px`, bo tròn đầu khớp và vẽ đủ lớp lót trong tà áo).
- `assets/rig/kiemtu_S.txt` (Bảng khung cắt `x,y,w,h` và tọa độ điểm xoay `x,y` chuẩn pixel trên tờ `2048×2048` để ghép trực tiếp vào bộ xương 2D).
- `assets/rig/kiemtu_25d_combat_sheet.png` (Bảng 4 tư thế hành động & tung chiêu 2.5D: Thủ thế rút kiếm, Tấn công thường Lưu Phong Trảm, Tung chiêu Thanh Long Toàn Phong, Đại chiêu Vạn Kiếm Quy Tông).
- `preview/*.png` (Các bản xem trước nền xám chuẩn studio cho cả hai phiên bản 2.5D và 2D thẳng).

## 2. Bảng tọa độ điểm xoay (`kiemtu_S.png` — `2048×2048`)

| Bộ phận | Mã bone/slot | Khung `x,y,w,h` | Điểm xoay `x,y` | Bộ phận cha |
| :--- | :--- | :---: | :---: | :--- |
| Đầu + tóc mái + trâm | `dau` | `56,56,187,319` | `150,327` | `co` |
| Tóc mái trước | `toc_mai` | `291,56,165,203` | `374,107` | `dau` |
| Cổ | `co` | `504,56,65,77` | `536,118` | `than_tren` |
| Tóc sau + dải lụa | `toc_sau` | `617,56,445,400` | `937,112` | `dau` |
| Thân trên (ngực + cổ áo) | `than_tren` | `1110,56,300,338` | `1260,360` | `dai_lung` |
| Đai lưng ngọc (gốc hông) | `dai_lung` | `1458,56,216,109` | `1566,110` | `root` |
| Giáp vai phải (gần camera) | `giap_vai_phai` | `1722,56,151,175` | `1820,152` | `than_tren` |
| Giáp vai trái (xa camera) | `giap_vai_trai` | `56,512,142,168` | `106,604` | `than_tren` |
| Tay trên phải (gần camera) | `tay_tren_phai` | `246,512,126,220` | `315,552` | `giap_vai_phai` |
| Tay trên trái (xa camera) | `tay_tren_trai` | `420,512,126,220` | `477,552` | `giap_vai_trai` |
| Cẳng tay phải | `cang_tay_phai` | `594,512,94,177` | `641,537` | `tay_tren_phai` |
| Cẳng tay trái | `cang_tay_trai` | `736,512,90,177` | `781,537` | `tay_tren_trai` |
| Bàn tay phải | `ban_tay_phai` | `874,512,86,138` | `917,537` | `cang_tay_phai` |
| Bàn tay trái | `ban_tay_trai` | `1008,512,83,138` | `1050,537` | `cang_tay_trai` |
| Bao kiếm | `bao_kiem` | `1139,512,78,457` | `1178,613` | `than_tren / dai_lung` |
| Vạt áo trước (giữa) | `vat_ao_truoc` | `1265,512,262,554` | `1391,556` | `dai_lung` |
| Vạt áo lụa phải (gần camera) | `vat_ao_ben_phai` | `1575,512,264,602` | `1781,554` | `dai_lung` |
| Vạt áo lụa trái (xa camera) | `vat_ao_ben_trai` | `56,1170,220,583` | `104,1211` | `dai_lung` |
| Đùi + cẳng chân + ủng phải | `chan_phai` | `324,1170,168,541` | `411,1219` | `dai_lung` |
| Đùi + cẳng chân + ủng trái | `chan_trai` | `540,1170,225,513` | `634,1216` | `dai_lung` |
| Kiếm thần | `kiem` | `813,1170,142,619` | `884,1325` | `bao_kiem / ban_tay_phai` |

## 3. Đặc tả chuyển động mềm mại (Soft-Body & Action States)
1. **`idle_25d` (Đứng thở 2.5D — Loop 60f):** Nhún nhẹ hông `-3.5 px`, thân nghiêng S-curve `±2°`, tóc sau và dải lụa dao động hình sin trễ pha `+5 frames`.
2. **`walk_25d` (Di chuyển 2.5D — Loop 24f):** Vector bước nghiêng góc `35°`, hông nhấp nhô `±5 px`, tà áo lụa trước và sau uốn sóng mềm theo nhịp chân.
3. **`combat_idle_25d` (Thủ thế rút kiếm — Loop 45f):** Hạ trọng tâm `-16 px`, tay phải đặt lên chuôi kiếm, vòng linh khí xanh ngọc xoay elip dưới chân.
4. **`attack_basic_25d` (Tấn công thường: Lưu Phong Trảm — 36f):** Lướt chéo góc 2.5D, chém vệt kiếm khí lưỡi liềm xanh ngọc, tóc và vạt áo văng ngược quán tính.
5. **`skill_01_25d` (Tung chiêu: Thanh Long Toàn Phong — 48f):** Xoay vòng quét kiếm hất lên tạo lốc kiếm khí xoắn ốc.
6. **`ultimate_25d` (Đại chiêu: Vạn Kiếm Quy Tông — 75f):** Khai mở trận pháp Bát Quái dưới mặt đất 2.5D, bay lơ lửng `+42 px`, triệu hồi vòng 12 thanh linh kiếm sau lưng.
