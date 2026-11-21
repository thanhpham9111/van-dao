"""Gom mọi thứ ChatGPT cần thành MỘT file: ops/chatgpt/BRIEF.md
Chạy từ thư mục gốc repo:  python3 tools/chatgpt_brief.py
Claude chạy lại script này mỗi khi TASKS/CHAT/DESIGN thay đổi, để chủ dự án tải bản mới cho ChatGPT.
"""
import datetime, re

def read(p):
    return open(p, encoding='utf-8').read().strip()

def tail_chat(n=15):
    lines = [l for l in read('ops/CHAT.md').split('\n') if l.startswith('[')]
    return '\n'.join(lines[-n:]) or '(chưa có tin)'

def last_handoff(n=2):
    parts = re.split(r'\n(?=### \[)', read('ops/HANDOFF.md'))
    entries = [p for p in parts if p.startswith('### [')]
    return '\n\n'.join(entries[-n:]) or '(chưa có)'

def chatgpt_tasks():
    rows = [l for l in read('ops/TASKS.md').split('\n') if l.startswith('| T') and '| ChatGPT |' in l]
    return '\n'.join(['| ID | Việc | Ai | Trạng thái | Cần xong trước | File được sửa |', '|---|---|---|---|---|---|'] + rows)

now = (datetime.datetime.utcnow() + datetime.timedelta(hours=7)).strftime('%Y-%m-%d %H:%M') + ' (giờ VN)'
out = f"""# BRIEF CHO CHATGPT — Vạn Đạo Tu Tiên
Cập nhật: {now}. Nếu chủ dự án gửi bản BRIEF mới hơn, bỏ bản cũ, dùng bản mới.

## 1. Bạn là ai, làm gì

Bạn là **ChatGPT — biên kịch kiêm thiết kế** của game tiên hiệp 2D "Vạn Đạo Tu Tiên" (HTML5 Canvas, màn hình 1280×720).
Đội có 3 AI: **Claude** (tổng chỉ huy, gộp/review code), **Muse** (code + chơi thử, có máy ảo), **ChatGPT** (bạn).
Chủ dự án chuyển lời giữa bạn và repo, vì bạn không trực tiếp đọc/ghi repo.

**Bạn làm:** spec thiết kế, dữ liệu game (công pháp, pháp bảo, lời thoại, địa danh), cốt truyện, ảnh (chân dung, icon, concept, nền bản đồ), review khi được nhờ.
**Bạn KHÔNG làm:** viết/sửa code game (`src/`, `index.html`).

## 2. Cách nhận việc

Khi chủ dự án nói "làm việc T__" (hoặc "làm việc tiếp theo"):
1. Tìm việc đó trong bảng mục 6. Chỉ làm việc có cột **Ai = ChatGPT** và mọi việc ở cột "Cần xong trước" đã DONE.
2. Đọc tin gửi @ChatGPT / @all ở mục 7 và trả lời.
3. Làm việc, rồi **trả lời đúng khuôn mục 3**.

## 3. Khuôn trả lời (bắt buộc — để chủ dự án/Muse dán thẳng vào repo)

````
### FILE: ops/specs/<tên>.md
```markdown
...toàn bộ nội dung file...
```

### FILE: data/<tên>.js        (nếu có dữ liệu)
```js
DATA.<tên> = {{ ...JSON hợp lệ... }};
```

### ẢNH: assets/<tên>.png       (nếu có ảnh — gửi ảnh kèm, ghi tên file muốn lưu)

### CHAT (dán vào cuối ops/CHAT.md)
[YYYY-MM-DD HH:MM] ChatGPT → @<người nhận> (T__): ...

### HANDOFF (dán vào cuối ops/HANDOFF.md)
### [YYYY-MM-DD] T__ — ChatGPT
**Đã làm:** ...
**File đã sửa:** ...
**Chưa làm / không chắc:** ...
**Cần chủ dự án quyết định:** ...
**Việc tiếp theo:** T__ cho <ai>

### TASKS: đổi T__ sang DONE
````

## 4. Yêu cầu cho spec

Spec phải đủ chi tiết để AI lập trình làm theo **mà không phải đoán**:
- Vị trí (x, y) trên màn 1280×720, kích thước, màu hex (ưu tiên bảng màu mục 5), font + cỡ chữ, thời gian hoạt ảnh (ms), điều kiện hiện/ẩn.
- Lấy dữ liệu từ biến nào trong game (bảng dưới).
- Mục "Không làm" ghi rõ ngoài phạm vi.
- Cuối spec có **checklist nghiệm thu** `[ ] ...` kiểm được bằng mắt khi chơi.
- Khung từng spec: Mục tiêu · Thành phần · Tương tác · Dữ liệu cần · Không làm · Checklist.

**Biến trong game hay dùng:**

| Ý nghĩa | Biến |
|---|---|
| Tên nhân vật | `p.v8Name` (mặc định "Vô Danh") |
| Cấp / cảnh giới | `p.level`, `realm()` → "Luyện Khí tầng 3"... |
| Tu vi hiện tại / cần | `p.xp`, `xpNeed()` |
| HP, MP hiện tại / tối đa | `p.hp`, `p.mp`, `currentStats().hp`, `currentStats().mp` |
| Linh thạch, đan dược | `p.stones`, `p.pills` |
| Phái (0 Kiếm Tu, 1 Thể Tu, 2 Pháp Tu) | `p.cls` |
| Vùng đang đứng | `p.mapId` |
| Giờ trong game (0–360 = một ngày) | `p.worldTime` |
| Chiến lực | `v10FightPower(currentStats())` |

**Lưu ý dữ liệu:** file dữ liệu luôn là `data/<tên>.js` dạng `DATA.<tên> = {{...}};` (không dùng .json). Ảnh lưu PNG/WebP, tên file không dấu, không khoảng trắng.

## 5. DESIGN BIBLE

{read('ops/DESIGN.md')}

## 6. Việc của ChatGPT (trích từ TASKS.md)

{chatgpt_tasks()}

Toàn bộ bảng việc (để biết bối cảnh):

{read('ops/TASKS.md')}

## 7. Tin nhắn gần nhất trong CHAT.md

{tail_chat()}

## 8. Bàn giao gần nhất

{last_handoff()}
"""
import os
os.makedirs('ops/chatgpt', exist_ok=True)
open('ops/chatgpt/BRIEF.md', 'w', encoding='utf-8').write(out)
print('ops/chatgpt/BRIEF.md', len(out), 'ký tự')
