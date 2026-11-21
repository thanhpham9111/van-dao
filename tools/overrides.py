"""Sinh ops/OVERRIDES.md: liệt kê các hàm bị gán lại (vá chồng) nhiều lần trong src/.
Chạy từ thư mục gốc repo:  python3 tools/overrides.py
Chạy lại sau mỗi lần gộp hàm để xem còn bao nhiêu lớp vá."""
import re, os, collections

parts = sorted(f for f in os.listdir('src') if f.endswith('.js'))
defs = collections.defaultdict(list)
for f in parts:
    for i, l in enumerate(open('src/' + f, encoding='utf-8').read().split('\n'), 1):
        for m in re.finditer(r'(?:^|[;}\s])function\s+([A-Za-z_$][\w$]*)\s*\(', l):
            defs[m.group(1)].append((f, i, 'khai báo'))
        for m in re.finditer(r'(?:^|[;}\s(])([A-Za-z_$][\w$]*)\s*=\s*(?:function\b|\([^()]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)', l):
            n = m.group(1)
            if n in ('const', 'let', 'var'):
                continue
            kind = 'khai báo' if re.search(r'(const|let|var)\s*$', l[:m.start(1)]) else 'gán lại'
            defs[n].append((f, i, kind))

rows = [(n, v) for n, v in defs.items()
        if sum(1 for x in v if x[2] == 'gán lại') >= 2 and any(x[2] == 'khai báo' for x in v)]
rows.sort(key=lambda r: -len(r[1]))

out = ['# BẢN ĐỒ HÀM BỊ VÁ CHỒNG', '',
       'Tự sinh bởi tools/overrides.py từ thư mục src/ — KHÔNG sửa tay.',
       'Mỗi dòng "gán lại" là một lớp vá kiểu `const old = fn; fn = function(){ old(); ... }`.',
       'Phiên bản CHẠY THẬT là chuỗi các lớp, lớp cuối (file số lớn nhất) bọc ngoài cùng.',
       'Gộp = đọc từ lớp đầu tới lớp cuối, viết lại thành MỘT định nghĩa duy nhất có hành vi y hệt, '
       'đặt ở vị trí lớp cuối, xoá các lớp trước.', '',
       f'Tổng: {len(rows)} hàm có từ 2 lớp vá trở lên.', '',
       '| Hàm | Số lớp | Khai báo gốc | Lớp cuối (đang chạy) |', '|---|---|---|---|']
for n, v in rows:
    d = [x for x in v if x[2] == 'khai báo'][0]
    last = v[-1]
    out.append(f'| `{n}` | {len(v)} | {d[0]}:{d[1]} | {last[0]}:{last[1]} |')
out += ['', '## Vị trí mọi lớp (file:dòng, theo thứ tự chạy) — 30 hàm nặng nhất', '']
for n, v in rows[:30]:
    out += [f'### `{n}` — {len(v)} lớp', ', '.join(f'{f}:{i}' for f, i, _ in v), '']
open('ops/OVERRIDES.md', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(f'{len(rows)} hàm bị vá chồng → ops/OVERRIDES.md')
