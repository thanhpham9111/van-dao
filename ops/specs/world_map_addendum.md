# Phụ lục T19 — bắt buộc cho T20 (Claude, 21/11/2026)

Review T19 của Claude mô tả nhầm bản đồ cũ `v22Atlas` bản V22. Bản THẬT đang chạy là bản **V45** (`v22Atlas()` ở `src/47_v45_v35.js`, đã gộp còn 1 định nghĩa). Khác biệt T20 phải giữ:

1. **Có 2 nút hành động, không phải 1.** Bảng chi tiết spec §2.5 chỉ có "Dẫn đường"; bổ sung nút thứ hai **"Khám phá"** cạnh nó (chia đôi vùng nút x944,y558,w268,h48 → hai nút 130×48, cách 8px):
   - "Dẫn đường": `modal=null; v8SetGoal(REG[id]); if(V22_REG[id].min>p.level) message('Cẩn thận · '+tên+' đề nghị cấp '+min)` — đúng như spec.
   - "Khám phá": `modal=null; v48xEnter(id)` — vào chế độ khám phá vùng đó (bản đồ khám phá V48). Không khoá theo cấp (giữ như code hiện tại). Vô hiệu khi id === `p.mapId`? KHÔNG — code hiện tại cho bấm cả ở vùng hiện tại; giữ nguyên.
2. **Tiêu đề phụ thật:** "Đã khám phá N / 10 địa vực" (N = `p.discovered.length`) — dùng làm phụ đề thay "Địa đồ thiên hạ".
3. Danh sách 10 vùng bên phải của bản V45 bị thay bằng bảng chi tiết của spec — chấp nhận (spec đã có chọn vùng trên địa đồ).
4. Thông tin boss có trạng thái hồi sinh: `(v22State().bosses[id]?.ready||0) > p.worldTime ? 'Đang hồi sinh' : 'Sẵn sàng'` — thêm vào dòng Boss của bảng chi tiết.
