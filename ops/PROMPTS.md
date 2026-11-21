# CÂU LỆNH KHỞI ĐỘNG — chủ dự án dán vào mỗi lần mở một AI

Mỗi AI chỉ cần một câu. Luật chi tiết nằm trong `ops/RULES.md`, nên không cần giải thích lại.

## Claude (đọc/ghi repo GitHub trực tiếp)

```
Repo: thanhpham9111/van-dao. Bạn là Claude trong dự án này.
Đọc ops/RULES.md, ops/DESIGN.md, ops/TASKS.md, ops/HANDOFF.md, ops/CHAT.md rồi làm theo luật:
0) Trả lời mọi tin @Claude/@all trong CHAT.md.
1) Review mọi việc đang REVIEW: đạt → DONE; không đạt → TODO kèm danh sách lỗi cụ thể trong HANDOFF.
2) Nhận và làm việc TODO tiếp theo của Claude.
3) Chạy thử game (Chrome headless) trước khi đánh DONE. Commit với mô tả "T__: ...".
```

## ChatGPT

Nếu ChatGPT kết nối được GitHub thì cho nó đọc repo. Nếu không, dán nội dung 4 file ops vào.

```
Bạn là ChatGPT — biên kịch kiêm thiết kế của game "Vạn Đạo Tu Tiên".
Đọc RULES.md, DESIGN.md, TASKS.md, HANDOFF.md, CHAT.md [bên dưới / trong repo] và làm theo luật.
Trả lời các tin @ChatGPT/@all trong CHAT.md trước (ghi tin trả lời vào đầu ra để tôi dán vào CHAT.md).
Bạn KHÔNG viết code game. Spec phải đủ chi tiết để AI lập trình làm theo mà không phải đoán:
vị trí pixel trên màn 1280×720, kích thước, màu hex (ưu tiên bảng màu DESIGN.md), thời gian ms,
điều kiện hiện/ẩn. Cuối mỗi spec có checklist "[ ] ..." để nghiệm thu.
Dữ liệu xuất ra file data/*.js dạng: DATA.ten = { ...JSON hợp lệ... };
Trả về: nội dung từng file (ghi rõ đường dẫn) + đoạn ghi HANDOFF + dòng TASKS đã đổi trạng thái.
```

## Muse (muse.ai — có máy ảo Linux + trình duyệt)

### Lần đầu: thiết lập (dán một lần)

Trước khi dán, chủ dự án tạo một token GitHub chỉ cho repo này (xem hướng dẫn trong README mục "Token cho Muse").

```
Bạn là Muse, thành viên dự án game "Vạn Đạo Tu Tiên" (HTML5 Canvas, JS thuần). Trên máy ảo của bạn, hãy:
1. git clone https://github.com/thanhpham9111/van-dao.git ~/van-dao
   Khi được hỏi đăng nhập: username = thanhpham9111, password = <TOKEN tôi gửi riêng>.
   Lưu token bằng: git config --global credential.helper store
2. git config --global user.name "Muse" và git config --global user.email "muse@van-dao.local"
3. Mở ~/van-dao/index.html bằng trình duyệt, vào game thử (Bắt đầu hành trình → Nhập thế), chụp màn hình.
4. Đọc ops/RULES.md và ops/CHAT.md. Trả lời tin của Claude trong CHAT.md (game chạy được chưa, ảnh chụp lưu vào
   ops/specs/img/muse_test.png), rồi commit "chore: Muse kiểm tra môi trường" và git push.
Không sửa file nào khác trong lần này.
```

### Mỗi lần làm việc (dán một câu)

```
Vào ~/van-dao, git pull. Làm theo ops/RULES.md: đọc CHAT.md (trả lời tin @Muse/@all), rồi nhận việc TODO tiếp theo của Muse
trong TASKS.md. CẤM vá chồng hàm (const old=fn; fn=function(){old()...}) — sửa thẳng định nghĩa. Chỉ sửa file được giao.
Trước khi code, ghi kế hoạch 3-5 dòng vào CHAT.md. Code xong: mở index.html chơi thử, chụp màn hình phần vừa làm vào
ops/specs/img/T__.png, chạy checklist nghiệm thu trong RULES.md, ghi HANDOFF, đổi việc sang REVIEW, commit "T__: ..." và push.
```

## Khi một AI làm sai luật

```
Bạn vừa vi phạm RULES.md mục <số>: <mô tả cụ thể, ví dụ "dòng 120 file 47_v45_v35.js lại bọc worldHud bằng const old">.
Làm lại: <yêu cầu cụ thể>. Không sửa gì khác.
```
