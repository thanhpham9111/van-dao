# T14 — SCHEMA DỮ LIỆU (Claude, 21/11/2026)

Khuôn dữ liệu cho ChatGPT viết (T15, T17, T19) và Muse nạp (T16, T18, T20). Dựa trên dữ liệu đang có trong code; tên trường dưới đây là hợp đồng, **không tự thêm trường ngoài danh sách** (cần thêm thì nhắn @Claude).

## 0. Quy tắc chung

- Mỗi file `data/<tên>.js` chỉ có một câu gán: `DATA.<tên> = { ... };` — nội dung là JSON hợp lệ (khoá có ngoặc kép, không dấu phẩy thừa, không hàm, không comment).
- Mọi file có `"version": 1` ở đầu.
- `id`: chữ thường không dấu, số, gạch dưới (`thanh_moc_kiem`). Duy nhất trong file. **Không trùng id có sẵn** (liệt kê ở từng mục).
- Chữ hiển thị: tiếng Việt có dấu. Mô tả `desc` ≤ 90 ký tự (vừa tooltip), `lore` ≤ 240 ký tự.
- Ngũ hành dùng đúng chuỗi: `"Kim" "Mộc" "Thủy" "Hỏa" "Thổ" "Lôi" "Phong"`. Game hiện có vòng tương sinh Mộc→Hỏa→Thổ→Kim→Thủy→Mộc; Lôi và Phong đứng ngoài vòng.
- Cảnh giới theo cấp người chơi `p.level`: 1–9 Luyện Khí 1–9, 10–18 Trúc Cơ 1–9 (hàm `realm()`); dữ liệu dùng `reqLevel` (số 1–45), không ghi chữ cảnh giới.
- Muse nạp: thêm thẻ `<script src="data/<tên>.js"></script>` dưới `data/00_init.js` trong `index.html`.

## 1. Công pháp — `data/techs.js` (T17 → T18)

Id đã dùng (CẤM trùng): `sword body fire water wind thunder flame_sword thunder_body frost_wind` (bảng `TECH` gốc). Kỹ năng phái `V11_SKILLS` là hệ riêng, không đưa vào file này.

```json
DATA.techs = {
  "version": 1,
  "items": [
    {
      "id": "thanh_moc_quyet",
      "name": "Thanh Mộc Trường Sinh Quyết",
      "element": "Mộc",
      "grade": "linh",
      "type": "tam_phap",
      "cls": null,
      "reqLevel": 4,
      "price": 60,
      "maxRank": 5,
      "desc": "Linh lực hồi nhanh, tăng sinh mệnh.",
      "lore": "Tâm pháp do một vị dược sư Thanh Trúc Lâm để lại...",
      "effects": [
        { "stat": "regen", "op": "mul", "value": 1.15, "perRank": 0.03 },
        { "stat": "hp", "op": "add", "value": 20, "perRank": 6 }
      ]
    }
  ]
}
```

| Trường | Kiểu | Giá trị hợp lệ |
|---|---|---|
| `grade` | chuỗi | `"pham"` (Phàm) · `"linh"` (Linh) · `"dia"` (Địa) · `"thien"` (Thiên) |
| `type` | chuỗi | `"vo_ky"` (Võ kỹ) · `"than_phap"` (Thân pháp) · `"tam_phap"` (Tâm pháp) · `"tuyet_ky"` (Tuyệt kỹ) |
| `cls` | số/null | `null` = mọi phái · `0` Kiếm Tu · `1` Thể Tu · `2` Pháp Tu |
| `reqLevel` | số | 1–45 |
| `price` | số | linh thạch để học (0 = chỉ nhận qua sự kiện) |
| `maxRank` | số | 1–9 |
| `effects[].stat` | chuỗi | chỉ các chỉ số có thật trong `currentStats()`: `hp mp attack def speed crit range rate regen burn slow leech luck dashCd spellAtk` |
| `effects[].op` | chuỗi | `"add"` (cộng) · `"mul"` (nhân) |
| `effects[].value` | số | giá trị ở bậc 1 |
| `effects[].perRank` | số | cộng thêm mỗi bậc (với `mul` là cộng vào hệ số: 1.15 → 1.18 → 1.21) |

Giới hạn cân bằng (để Claude/Muse kiểm): `crit` cộng tối đa 0,06/công pháp (game kẹp tổng ≤ 0,6); `mul` cho `attack/rate/spellAtk` ≤ 1,25 ở bậc tối đa; `dashCd` chỉ `mul` 0,8–1,0; `speed` add ≤ 40.

## 2. Pháp bảo / trang bị — `data/equipment.js` (T17 → T18)

**Quan trọng:** save lưu đồ theo SỐ THỨ TỰ trong bảng `EQUIPMENT` gốc (21 món, chỉ số 0–20). Đồ mới sẽ được Muse NỐI vào cuối bảng (chỉ số 21 trở đi). Không bao giờ xoá, đổi thứ tự hay sửa món cũ qua file này.

```json
DATA.equipment = {
  "version": 1,
  "items": [
    {
      "id": "bang_tam_kiem",
      "name": "Băng Tâm Kiếm",
      "slot": "weapon",
      "element": "Thủy",
      "atk": 14,
      "def": 0,
      "style": "frost",
      "icon": { "sheet": "weapons", "index": 2 },
      "reqLevel": 6,
      "desc": "Kiếm khí lạnh làm chậm yêu thú.",
      "lore": "..."
    }
  ],
  "upgrade": { "maxLevel": 10, "baseCost": 6, "costPerLevel": 4, "failBase": 0.0, "failPerLevel": 0.06, "failKeepsLevel": true }
}
```

| Trường | Giá trị hợp lệ |
|---|---|
| `slot` | `"weapon"` · `"accessory"` (game hiện chỉ có 2 loại này) |
| `style` | `"fast" "heavy" "reach" "frost" "fire" "blood" "ranged"` (mỗi style đã có hiệu ứng trong `equipStats`) |
| `atk`, `def` | số nguyên; tham khảo đồ gốc: thường 6–17, thần binh 18–23 |
| `icon.sheet` | `"weapons" "divine" "gear" "books"` (ảnh 3×3 có sẵn); `icon.index` 0–8. Muốn icon mới: thêm ảnh vào `assets/` và ghi `"icon": { "asset": "ten_file_khong_duoi" }` |
| `upgrade` | công thức cường hoá. Hiện game: tối đa +10, giá `6 + cấp×4` linh thạch, KHÔNG có thất bại. `failBase`/`failPerLevel` là tỉ lệ thất bại mới (cấp n: `failBase + n×failPerLevel`); `failKeepsLevel: true` = thất bại chỉ mất linh thạch, không tụt cấp |

## 3. Hội thoại — `data/dialogues.js` (T15 → T16)

NPC có sẵn (dùng đúng id): `inn` Trưởng lão Thanh Thạch · `shop` Dược thương Linh Dược · `sentry` Lục Thanh · `herbalist` Mộc Tử Y · `wanderer` Tạ Vô Nhai · `bambooKeeper` Vân Tịch · `mountainHunter` Hàn Liệt · `snowHermit` Bạch Vân · `swampMedic` Đường Uyển · `desertSmith` Thiết Nham · `demonWatcher` Mạc Ly · `ghostSeer` U Lan.

**Bắt buộc giữ:** nhiệm vụ chính số 1 hoàn thành khi `p.v12Talk.inn` được đặt (đã nói chuyện với Trưởng lão). Lần gặp đầu của `inn` phải kết thúc bằng hiệu ứng `"talked": true`.

```json
DATA.dialogues = {
  "version": 1,
  "npcs": {
    "inn": {
      "portrait": null,
      "meetings": [
        {
          "id": "inn_1",
          "when": { "talkedBefore": false },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Tiểu hữu mới nhập đạo?", "next": "b" },
            "b": { "speaker": "npc", "text": "...", "choices": [
              { "text": "Đệ tử xin chỉ giáo.", "effects": { "favor": 5 }, "next": "c" },
              { "text": "[Thiện cảm ≥ 30] Hỏi về Trúc Lang Vương", "cond": { "favorMin": 30 }, "next": "d" },
              { "text": "Cáo từ.", "next": null }
            ] },
            "c": { "speaker": "npc", "text": "...", "effects": { "talked": true, "xp": 10 }, "next": null }
          }
        }
      ]
    }
  }
}
```

| Phần | Quy tắc |
|---|---|
| Chọn lần gặp | duyệt `meetings` theo thứ tự, lấy lần ĐẦU TIÊN có `when` thoả mãn |
| `when` (mọi điều kiện phải đúng) | `talkedBefore` (true/false) · `levelMin` (số) · `bossDead` (true = đã hạ Trúc Lang Vương, `p.worldBossDead`) · `favorMin` (số) · `flag` (chuỗi, cờ do hội thoại khác đặt) · `notFlag` (chuỗi) |
| `nodes.*.speaker` | `"npc"` · `"player"` |
| `text` | ≤ 140 ký tự/nút (vừa khung 2–3 dòng) |
| Kết thúc | `"next": null` |
| `choices` | 2–4 lựa chọn; `cond` dùng `favorMin`, `levelMin`, `stonesMin`, `pillsMin`; lựa chọn không đủ điều kiện vẫn hiện (mờ) kèm chữ điều kiện trong `text` |
| `effects` (ở nút hoặc lựa chọn) | `favor` (±số, thiện cảm 0–100) · `stones` (±) · `pills` (±) · `xp` (+) · `talked` (true) · `setFlag` (chuỗi) · `openShop` (true, chỉ NPC `shop`) |
| `portrait` | `null` (dùng hình nhân vật có sẵn) hoặc tên ảnh trong `assets/` |

Lưu trong save (Muse làm, ghi để biết): thiện cảm `p.favor[npcId]`, cờ `p.flags[tên]` — chỉ thêm trường mới, có mặc định khi save cũ thiếu.

## 4. Bản đồ thế giới — `data/world_map.js` (T19 → T20) — `x/y/paths/realmHint` phải đúng bảng trong `ops/specs/world_map_review.md`

Vùng có sẵn (dùng đúng `region`): `thon` Thanh Thạch Thôn · `truc` Thanh Trúc Lâm · `yeu` Vạn Yêu Sơn · `ma` Ma Vực · `tuyet` Bắc Minh Tuyết Vực · `tram` Hắc Độc Trạch · `hoa` Xích Viêm Hoang Mạc · `quy` U Minh Quỷ Vực · `phong` Thiên Phong Cốc · `loi` Tử Lôi Hoang Nguyên. Điều kiện mở vùng, cấp quái, đường đi thật đều do code quyết định — file này chỉ là phần trình bày.

```json
DATA.world_map = {
  "version": 1,
  "art": { "asset": "world_map_thuy_mac", "width": 1280, "height": 720 },
  "places": [
    {
      "region": "truc",
      "label": "Thanh Trúc Lâm",
      "x": 0.42, "y": 0.31,
      "seal": "竹",
      "desc": "Rừng trúc xanh ngút ngàn, nơi Trúc Lang Vương xưng bá.",
      "realmHint": "Luyện Khí 3–6"
    }
  ],
  "paths": [ ["thon", "truc"], ["truc", "yeu"] ]
}
```

| Trường | Quy tắc |
|---|---|
| `art.asset` | tên ảnh nền trong `assets/` (không đuôi), khuyến nghị 1280×720 WebP |
| `places[].region` | đúng 1 trong 10 id trên, mỗi vùng tối đa 1 lần |
| `x`, `y` | vị trí trên ảnh, tỉ lệ 0–1 (không phải pixel) |
| `seal` | 1–2 chữ Hán hoặc chữ Việt ngắn trong ấn triện |
| `realmHint` | chữ hiển thị gợi ý, ≤ 24 ký tự |
| `paths` | cặp vùng nối nét đứt — chỉ để vẽ; Muse đối chiếu với đường thật trong code (`ROAD_EDGES`) và báo nếu lệch |
