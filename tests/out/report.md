# M01 — Báo cáo kiểm thử tự động

Chạy lúc: 2026-11-21 12:47:59 UTC · URL: http://localhost:8123/index.html · cửa sổ 1280x720 · Playwright Chromium headless
M04: Math.random seed=20261121 (add_init_script) · p.worldTime=145 trước mỗi lần chụp · chờ chuyển cảnh xong trước khi chụp (transition==0, worldTitle==0 ở play, + kiểm tra 2 ảnh cách 300ms) · ngưỡng compare: KHÁC khi >2% điểm ảnh lệch >40/255

| ID | Kịch bản | Kết quả | Bằng chứng | Ảnh |
|----|----------|---------|------------|-----|
| 01 | menu | ĐẠT | mode=menu menuPage=home buttons=5 canResume=False | 01_menu.png |
| 02 | tạo nhân vật 3 phái | ĐẠT | Kiếm Tu: select=0 cls=0 techs=['sword'] mode=play mapId=thon -> ok; Thể Tu: select=1 cls=1 techs=['body'] mode=play mapId=thon -> ok; Pháp Tu: select=2 cls=2 techs=['water'] mode=play mapId=thon -> ok | 02_enter_cls2_spell.png |
| 03 | vào thôn | ĐẠT | mode=play mapId=thon worldMode=True V47T={'x': 672, 'y': 1626} p=(471,1345) | 03_thon.png |
| 04 | đi 4 hướng (WASD, mỗi hướng giữ 0,9s) | ĐẠT | tổng |d|=280px, huong >=50px: 2/4; W: (672,1626)->(672,1542) dx=0 dy=-84; S: (672,1542)->(672,1690) dx=0 dy=148; A: (672,1690)->(656,1690) dx=-16 dy=0; D: (656,1690)->(688,1690) dx=32 dy=0 | 04_move.png |
| 05 | mở bản đồ phím M | ĐẠT | phim m: modal=map (mong doi ['map']) | 05_map.png |
| 06 | túi đồ phím I | ĐẠT | phim i: modal=gear (mong doi ['gear', 'inventory']); live: modal='gear' (tui do hop nhat, v21Inventory 'LINH BAO - TUI TRANG BI') | 06_inventory.png |
| 07 | nhật ký phím Q | ĐẠT | phim q: modal=journal8 (mong doi ['journal8']) | 07_journal.png |
| 08 | lưu → tải lại → Tiếp tục | ĐẠT | truoc: cls=2 lv=1 V47T={'x': 688, 'y': 1690} save_len=31244 saved_ok=True; sau resume: cls=2 lv=1 playerId_khop=True V47T={'x': 688, 'y': 1690} lech_vi_tri=0.5px | 08_resumed.png |
| 09 | ra thế giới mở đánh 1 quái (thường + kỹ năng chuột phải) | ĐẠT | cổng truc; mapId=truc p=(1790,850); quái gần nhất type=0 HP 86 (mẫu HP quái đang click: [86, 86, 86, 86, 86, 66, 66, 35, 4, 129, 104, 79, 41, 129, 129, 74, 16]); 16 click (trái + phải xen kẽ); kỹ năng đã nổ (lần thử 4): V26.action=skill, castT sau 200ms=0.23, hồi chiêu sau 600ms=1.55s, MP 130 -> 110; kills 0->4; tu vi 49; MP lúc đầu 130; hồi HP 3 lần (giữ nhân vật sống) | 09_fight.png |
| 10 | đứng yên để quái đánh trúng (HP giảm + số bay) | ĐẠT | đã hồi đầy HP đầu kịch bản (HP < 60 sau trận 9); quái type=0 HP 27/66 cách 418px; HP lúc đứng yên 46, thấp nhất 38; số bay ['-10', '-8'] | 10_monster_hits.png |
| 11 | sân luyện F6 vào/ra | ĐẠT | cổng prev về thon; mapId=thon V47T={'x': 2767, 'y': 646}; vào sân sau 13.6s; đánh mộc nhân 8 click, hits 0->27, tổng sát thương 636; ra: đã bấm 'Kết thúc luyện tập': active=False modal=None V47T={'x': 2589, 'y': 1012} mapId=thon | 11_training.png |
| 12 | mở/đóng Tùy chỉnh HUD F2 | ĐẠT | mở: editing=True modal=hud35; đóng bằng ESC: modal=None editing=False (đã đóng hud35) | 12_hud_edit.png |

**Tổng: 12/12 ĐẠT**

**Lỗi console/pageerror: 0**

**Compare vs tests/baseline/ (ngưỡng: KHÁC khi >2% điểm ảnh lệch >40/255): GIỐNG 15 · KHÁC 0 · ĐỘNG (không so) 3 · tổng 18**
- 01_menu.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.45/255)
- 02_create_cls0_sword.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.51/255)
- 02_create_cls1_body.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.09/255)
- 02_create_cls2_spell.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.14/255)
- 02_enter_cls0_sword.png: GIỐNG (0.22% điểm ảnh lệch >40/255 · độ lệch trung bình 0.45/255)
- 02_enter_cls1_body.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 1.09/255)
- 02_enter_cls2_spell.png: GIỐNG (0.22% điểm ảnh lệch >40/255 · độ lệch trung bình 0.77/255)
- 03_thon.png: GIỐNG (0.18% điểm ảnh lệch >40/255 · độ lệch trung bình 0.19/255)
- 04_move.png: GIỐNG (0.27% điểm ảnh lệch >40/255 · độ lệch trung bình 0.27/255)
- 05_map.png: GIỐNG (md5 khớp · 0,00% điểm ảnh lệch >40/255 · độ lệch trung bình 0,00/255)
- 06_inventory.png: GIỐNG (0.04% điểm ảnh lệch >40/255 · độ lệch trung bình 0.06/255)
- 07_journal.png: GIỐNG (md5 khớp · 0,00% điểm ảnh lệch >40/255 · độ lệch trung bình 0,00/255)
- 08_menu_after_reload.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.42/255)
- 08_resumed.png: GIỐNG (0.49% điểm ảnh lệch >40/255 · độ lệch trung bình 1.67/255)
- 09_fight.png: ĐỘNG (cảnh chiến đấu động — không so pixel (xem DYNAMIC_SHOTS))
- 10_monster_hits.png: ĐỘNG (cảnh chiến đấu động — không so pixel (xem DYNAMIC_SHOTS))
- 11_training.png: ĐỘNG (cảnh chiến đấu động — không so pixel (xem DYNAMIC_SHOTS))
- 12_hud_edit.png: GIỐNG (0.01% điểm ảnh lệch >40/255 · độ lệch trung bình 0.01/255)
