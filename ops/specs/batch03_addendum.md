# Phụ lục GÓI 03 (T47–T55) — Claude trả lời câu hỏi mở + quyết định tích hợp (21/11/2026)

Đọc cùng spec tương ứng khi làm T56–T61. Ở đâu phụ lục khác spec, **theo phụ lục**.

## 0. Phong cách — ảnh mẫu là khung bố cục
6 ảnh `ops/specs/img/batch03_v2_*.png` là **mẫu bố cục** (vị trí khối, phân cấp chữ, nút). Chất liệu khi code theo T36 `panels_ui.md` §1: nền ink + vân giấy/lụa, dải gỗ sơn mài, gờ đồng — vẽ texture một lần rồi cache. Hai vật thể riêng: O = sổ du ký giấy nâu (vân paper .13, gáy giữa), L = bảng cáo thị gỗ. Mọi bảng dùng chung bộ khung/tab/nút/thanh cuộn của T36 (sau T46).

## 1. Trả lời câu hỏi mở
1. **Liên kết giữa 5 kỹ năng (T):** code không có bảng điều kiện trước–sau giữa các kỹ năng, chỉ có cấp yêu cầu → không vẽ đường điều kiện giả; vòng ngọc chỉ thể hiện cấp mở. Đúng như spec.
2. **Tab con/handler:** dùng đúng handler/action đang có trong `update_L04` (J, src/09), `update_L14` (N, src/21), `v30forge` (P, src/20), `v42world` (O, src/37), `jiang14` (L, src/10). Người tiếp dẫn tông môn lấy vị trí thật trong code (nút "Dẫn đến người tiếp dẫn"), không suy từ vùng tông.
3. **Nhiệm vụ tông loại `boss`:** boss vùng **hồi sinh sau 3 phút** (`v22State().bosses[id].ready = worldTime + 180`) → nhiệm vụ boss luôn làm được. Đếm như chính tuyến: chỉ tính lần hạ **sau khi nhận** (lưu mốc `kills` lúc nhận). `minRank`/`region` kiểm tại handler nhận việc, không chỉ ở UI.
4. **Bảo hiểm cường hoá:** theo code thật (mỗi món riêng, thành công về 0, thất bại +12 điểm %, trần 100%). "Tinh hoa" trong công thức pháp bảo và "Tinh phách" trên thanh tài nguyên là **cùng một thứ** (`p.v30.ess`) → hiển thị thống nhất là **"Tinh phách"**.
5. **F3 Vạn Linh Phổ:** phím có sẵn, Claude sót trong danh sách F12. Giữ nguyên nút và phím.
6. **Đếm thành tựu (G5):** `claim` = số id F7 (8 altar/herb) có `p.claimed[id]` true — không đếm `.length` thô; `boss` = số vùng có `v22State().bosses[id].kills > 0` cộng `p.worldBossDead` cho `truc`; `events` = `v42wState().total`; `waystones` = số khoá `v42wState().stones`; `techs` = `p.techs.length` (công pháp cũ, tối đa 9); `pets` = số linh thú đã mở theo bảng Động phủ; `forge` = cấp cường hoá cao nhất trong `p.gear`. Nhận thưởng lưu cờ riêng theo id (`p.msClaimed[id]`), 6 thành tựu cũ giữ nguyên handler cũ.
   **Danh hiệu:** người chơi chọn trong tab Thành tựu (`p.titleSel`); hiện ở bảng C dưới tên và một dòng nhỏ dưới tên ở cụm danh tính HUD (T10 §1, cỡ 12, muted). Chưa đạt thì không chọn được.
7. **`forgeReady`:** chỉ bật khi mọi món trong `p.gear` đang +0 và `p.stones ≥ 20`. Save cũ đã có món +1 trở lên thì coi như đã biết, không nhắc.
8. **Giá Tụ Linh Đan:** theo code thật **1 linh thảo + 1 linh tinh**. G3 của Claude ghi nhầm (đọc "2/1" — có 2/cần 1 — thành cần 2). Không đổi giá.

## 2. Ảnh
- 12 chân dung → `assets/portrait_<id>.webp` (600×800, nền trong suốt). T16: hội thoại ưu tiên `ASSETS["portrait_"+id]`, không có thì dùng hình cũ `npc_<id>`; đặt vừa ô tranh T15 (contain, căn đáy). Phong Vân L dùng lại cho NPC chính.
- 10 tranh vùng → `assets/loading_<vùng>.webp` (1600×900). T42: màn tải/chuyển vùng vẽ phủ (cover) 1280×720, mẹo + thanh tải ở dải y 540–720.

## 3. Báo cáo "45/45 PASS" của ChatGPT
Chạy trên một bản V47.1 cũ (8 file), không phải repo hiện tại → chỉ tham khảo. Nghiệm thu thật làm trên repo khi code (test_suite + ảnh).
