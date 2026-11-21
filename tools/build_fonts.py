"""Tạo lại fonts.js (phông nhúng, SIL OFL). Cần fontTools + phông hệ thống Noto Serif CJK + Lora.
python3 tools/build_fonts.py   → ghi fonts.js ở gốc repo."""
import base64, glob, subprocess, pathlib, tempfile
from fontTools.varLib import instancer
from fontTools.ttLib import TTFont
ROOT = pathlib.Path(__file__).resolve().parent.parent
HAN = '行囊道法劍剑心武仙天地山海卷冊册印丹煉炼宗門门器修命記记江湖圖图寶宝誌志天機机閣阁坊工錄录典籍藏經经陣阵靈灵雲云風风雷火水金木土月日夜書书院堂殿峰谷林城鎮镇村身言'
chars = set()
for f in glob.glob(str(ROOT / 'src/*.js')) + glob.glob(str(ROOT / 'data/*.js')):
    chars |= set(open(f, encoding='utf-8').read())
base = {chr(c) for c in [*range(0x20, 0x7f), *range(0xa0, 0x180), *range(0x1ea0, 0x1efa), *range(0x300, 0x324)]}
keep = sorted(c for c in chars | base | set(HAN) if (ord(c) < 0x3000 or c in HAN) and ord(c) >= 0x20)
tmp = pathlib.Path(tempfile.mkdtemp()); uni = tmp / 'uni.txt'; uni.write_text('\n'.join('U+%04X' % ord(c) for c in keep))
def sub(src, out, extra=()):
    subprocess.run(['pyftsubset', src, f'--unicodes-file={uni}', '--flavor=woff', f'--output-file={out}', *extra], check=True)
sub('/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc', tmp / 'title.woff', ['--font-number=2', "--layout-features=*"])
for w, src, key in [(400, 'Lora-Variable.ttf', 'b400'), (700, 'Lora-Variable.ttf', 'b700'), (400, 'Lora-Italic-Variable.ttf', 'b400i')]:
    f = TTFont('/usr/share/fonts/truetype/google-fonts/' + src); instancer.instantiateVariableFont(f, {'wght': w}, inplace=True)
    f.save(tmp / f'{key}.ttf'); sub(str(tmp / f'{key}.ttf'), tmp / f'{key}.woff')
d = {k: base64.b64encode((tmp / f'{k}.woff').read_bytes()).decode() for k in ['title', 'b400', 'b700', 'b400i']}
old = (ROOT / 'fonts.js').read_text(encoding='utf-8')
head = old[:old.index('const FONT_DATA=')]; tail = old[old.index(';\n(function(){'):]
(ROOT / 'fonts.js').write_text(head + 'const FONT_DATA={' + ','.join(f'{k}:"{v}"' for k, v in d.items()) + '}' + tail, encoding='utf-8')
print('fonts.js:', len(keep), 'ký tự')
