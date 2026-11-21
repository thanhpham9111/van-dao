"""Dựng lại assets.js từ các ảnh trong assets/.
Chạy từ thư mục gốc repo:  python3 tools/build_assets.py

- Tên file (bỏ đuôi) = khoá trong code: assets/v15npc0.webp  →  ASSETS["v15npc0"]
  (file cũ có dạng NHÓM__khoá, ví dụ ASSET__forest.webp → ASSETS["ASSET__forest"]).
- Thay ảnh: ghi đè file cùng tên rồi chạy lại script.
- Thêm ảnh mới: thả file vào assets/, chạy script, rồi trong code dùng ASSETS["tên_file"].

Vì sao không nạp thẳng PNG/WebP bằng đường dẫn? Game dùng getImageData; khi mở index.html
bằng cách nhấp đúp (file://), Chrome coi ảnh nạp theo đường dẫn là "khác nguồn" và chặn lệnh đó.
Ảnh nằm trong assets.js dạng data URI thì không bị chặn.
"""
import base64, json, os

MIME = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif'}
items = []
for f in sorted(os.listdir('assets')):
    name, ext = os.path.splitext(f)
    if ext.lower() not in MIME:
        continue
    data = base64.b64encode(open(os.path.join('assets', f), 'rb').read()).decode()
    items.append(f'{json.dumps(name)}:{json.dumps("data:" + MIME[ext.lower()] + ";base64," + data)}')
with open('assets.js', 'w') as out:
    out.write('// TỰ SINH bởi tools/build_assets.py — KHÔNG sửa tay. Sửa ảnh trong assets/ rồi chạy lại script.\n')
    out.write('const ASSETS={\n' + ',\n'.join(items) + '\n};\n')
print(f'assets.js: {len(items)} ảnh')
