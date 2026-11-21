# M01 — Báo cáo kiểm thử tự động

Chạy lúc: 2026-11-21 05:58:56 UTC · URL: http://localhost:8124/index.html · cửa sổ 1280x720 · Playwright Chromium headless
M04: Math.random seed=20261121 (add_init_script) · p.worldTime=145 trước mỗi lần chụp · ngưỡng compare: KHÁC khi >2% điểm ảnh lệch >40/255

| ID | Kịch bản | Kết quả | Bằng chứng | Ảnh |
|----|----------|---------|------------|-----|
| 01 | menu | ĐẠT | mode=menu menuPage=home buttons=5 canResume=False | 01_menu.png |
| 02 | tạo nhân vật 3 phái | ĐẠT | Kiếm Tu: select=0 cls=0 techs=['sword'] mode=play mapId=thon -> ok; Thể Tu: select=1 cls=1 techs=['body'] mode=play mapId=thon -> ok; Pháp Tu: select=2 cls=2 techs=['water'] mode=play mapId=thon -> ok | 02_enter_cls2_spell.png |
| 03 | vào thôn | ĐẠT | mode=play mapId=thon worldMode=True V47T={'x': 672, 'y': 1626} p=(471,1345) | 03_thon.png |
| 04 | đi 4 hướng (WASD, mỗi hướng giữ 0,9s) | ĐẠT | tổng |d|=280px, huong >=50px: 2/4; W: (672,1626)->(672,1542) dx=0 dy=-84; S: (672,1542)->(672,1690) dx=0 dy=148; A: (672,1690)->(656,1690) dx=-16 dy=0; D: (656,1690)->(688,1690) dx=32 dy=0 | 04_move.png |
| 05 | mở bản đồ phím M | ĐẠT | phim m: modal=map (mong doi ['map']) | 05_map.png |
| 06 | túi đồ phím I | ĐẠT | phim i: modal=gear (mong doi ['gear', 'inventory']); live: modal='gear' (tui do hop nhat, v21Inventory 'LINH BAO - TUI TRANG BI') | 06_inventory.png |
| 07 | nhật ký phím Q | ĐẠT | phim q: modal=journal8 (mong doi ['journal8']) | 07_journal.png |
| 08 | lưu → tải lại → Tiếp tục | ĐẠT | truoc: cls=2 lv=1 V47T={'x': 688, 'y': 1690} save_len=29598 saved_ok=True; sau resume: cls=2 lv=1 playerId_khop=True V47T={'x': 688, 'y': 1690} lech_vi_tri=0.5px | 08_resumed.png |

**Tổng: 8/8 ĐẠT**

**Lỗi console/pageerror: 0**

**Compare vs tests/baseline/ (ngưỡng: KHÁC khi >2% điểm ảnh lệch >40/255): GIỐNG 14 · KHÁC 0 · tổng 14**
- 01_menu.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.46/255)
- 02_create_cls0_sword.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.47/255)
- 02_create_cls1_body.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.06/255)
- 02_create_cls2_spell.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.24/255)
- 02_enter_cls0_sword.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.02/255)
- 02_enter_cls1_body.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 11.39/255)
- 02_enter_cls2_spell.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 17.31/255)
- 03_thon.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.02/255)
- 04_move.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.12/255)
- 05_map.png: GIỐNG (md5 khớp · 0,00% điểm ảnh lệch >40/255 · độ lệch trung bình 0,00/255)
- 06_inventory.png: GIỐNG (0.05% điểm ảnh lệch >40/255 · độ lệch trung bình 0.08/255)
- 07_journal.png: GIỐNG (md5 khớp · 0,00% điểm ảnh lệch >40/255 · độ lệch trung bình 0,00/255)
- 08_menu_after_reload.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 0.04/255)
- 08_resumed.png: GIỐNG (0.00% điểm ảnh lệch >40/255 · độ lệch trung bình 14.43/255)
