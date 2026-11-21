"""Gói lại thành MỘT file HTML duy nhất (để gửi người khác chơi hoặc chơi offline).
Chạy từ thư mục gốc repo:  python3 tools/bundle.py
Kết quả: dist/Van_Dao_Tu_Tien.html — KHÔNG sửa file này, chỉ sửa trong src/ rồi bundle lại.
"""
import os, re

html = open('index.html', encoding='utf-8').read()

def css(m):
    return '<style>\n' + open(m.group(1), encoding='utf-8').read() + '\n</style>'

def js(m):
    code = open(m.group(1), encoding='utf-8').read().replace('</script', '<\\/script')
    return '<script>\n' + code + '\n</script>'

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', js, html)
os.makedirs('dist', exist_ok=True)
open('dist/Van_Dao_Tu_Tien.html', 'w', encoding='utf-8').write(html)
print('dist/Van_Dao_Tu_Tien.html', round(len(html.encode()) / 1e6, 1), 'MB')
