# MUSE_05 — báo cáo (code nháp qua zip, không dùng git/repo)

Giao 22/11/2026 bởi Claude. Làm trong `/home/hatch/workspace/vdtt-g05/` (base đã gồm GÓI 04 đã ghép + HUD TQ `src/69_hud_tq.js`). M1 ưu tiên tuyệt đối, M2 tiếp theo, M3 làm đủ — cả 3 đều xong, nộp đủ `MUSE_05.zip` (không cần bản part1).

**Lượt bổ sung 22/11 chiều (theo lời dặn chủ dự án):** M1b — bóng đổi hướng + độ dài theo giờ (chủ dự án đã tự làm hệ bóng, Muse chỉ lo hướng/độ dài + hàm `depthLightSun()`); M4 — 6 tương tác sơn môn (`src/72_sect_life.js`); đính chính PATCH thẻ script 68/71/72. `MUSE_05.json` nay 18 PATCH, tự kiểm 228/228 PASS.

## M1 — T73+T22: chiều sâu 2.5D + ánh sáng ngày–đêm cho thôn (`src/68_depth_light.js`, 40.958 byte ở lượt đầu; 43.168 byte sau M1b)

**Hàm/biến game đã dùng:** `townDrawWorld()` (src/65:341), `townBuildDrawList` (src/65:320), `townDrawObject` (src/65:174), `townFrameStats()` (src/65:403), `townMapReady()`, `townLayout()`, `townNPCs()`, `townImg` (quy ước khóa phẳng `ASSETS[]`), `TOWN_NEW` (src/65); `v41Quality()` (src/31:5, qua `V41E.quality` 0/1/2); `hudTQZoneHit()` (src/69:217); `v47tIsActive()` (src/48:388); `V47T` (`x/y/cam/clock`); `p.worldTime` (giờ = `(p.worldTime%360)/15`); `W/H/TAU/g`; `DATA.town_layout` (đèn `p_lantern_*`, lò `v13_forge`, cửa sổ nhà `b_*`, ống khói `smoke`); `townLife` (src/67: dân làng + đom đóm, chỉ đọc). Ảnh (có thì dùng, không thì giữ chỗ vẽ tay): `ASSETS["map_bg_far"/"map_bg_mid"/"fg_branch_1"/"fg_bamboo_1"/"fg_eave_1"/"light_glow"]`.

**PATCH — 5 cái, đều vào `src/65_town_map.js`:**
1. Sau vòng nền `townDrawWorld` → gọi `depthLightDrawBack()` — gắn lớp sau (parallax xa/giữa + sương sớm + bóng đổ), ngay sau nền, trước danh sách y-sort.
2. Cuối `townDrawWorld`, trước `g.restore()` → gọi `depthLightDrawFront()` — gắn lớp trước (grading multiply/screen + lớp tối đục lỗ + quầng sáng + bụi + tiền cảnh), sau mọi vẽ thế giới; HUD vẽ sau nên không bị phủ màu.
3. Cuối `townDrawObject`, trước `return 'place'` → gọi `depthLightObjectDetail(o,x,y,w,h)` — họa tiết giữ chỗ pro cho vật thể; chỉ chạy khi thiếu ảnh thật (có ảnh đã `return 'img'` trước đó).
4. Trong vòng tiles `townGroundTile` → `depthLightStoneJoints(d,t.poly)` khi `tile==='stone'` — đá lát có mạch, vẽ một lần vào cache ô nền.
5. Trong vòng nước `townGroundTile` → `depthLightWaterGlints(d,poly)` — nước có gợn sáng, vẽ một lần vào cache ô nền.

**Trường save mới:** không có. **Cờ:** `DEPTH_LIGHT=true` đầu file; 3 mức theo `v41Quality()`: thấp = chỉ lớp màu phủ; vừa = thêm parallax + bóng; cao = đủ cả. `TOWN_NEW=false` → không làm gì.

**Nội dung:** 4 lớp parallax (xa 0,25× / giữa 0,55× / thế giới 1× y-sort / tiền cảnh 1,35×, alpha .85, mờ còn 40% khi người chơi đứng sau); bóng đổ theo giờ (sáng dài về tây, trưa ngắn, chiều dài về đông, đêm chỉ bóng quanh nguồn sáng), cache cả lô bóng vào một canvas phụ theo phút game; ánh sáng 4 mốc đúng bảng `lighting.md` (nội suy tuyến tính giữa mốc liền kề, 360 trùng 0, không random đổi màu) + nguồn sáng thật từ chiều tối (12 cửa sổ + 2 đèn lồng + 1 lò rèn r=76 + 3 ống khói + tối đa 3 đom đóm), quầng `lighter` (ảnh `light_glow` nếu có, không thì `createRadialGradient`), nhấp nháy nhẹ, lớp tối đục lỗ bằng `destination-out`; phối cảnh khí quyển (nền xa/giữa nhạt + hơi xanh lam, sương sớm 5h–8h trôi 2–3 dải mờ ngang). Mọi lớp vẽ trong `townDrawWorld`, trước khi `v47tDraw` vẽ thanh tiêu đề/prompt E nên HUD không bị phủ màu; không dùng `FRAME_HOOKS`/`COMBAT_HOOKS`; không bọc đè hàm.

**Họa tiết nâng cấp pro so với khối phẳng G04 (yêu cầu riêng của chủ dự án):** núi xa 3 lớp đường cong mềm + rặng chi tiết + tuyết đỉnh + sương khí quyển nhạt dần theo xa (xanh lam nhạt dần); dải rừng xa 64 cụm tán biến thiên (mặt sáng trên/mặt tối dưới/thân xa) thay vì 1 màu; tiền cảnh: mái hiên có hàng ngói vảy + cành có cụm lá 6 lá/gân lá + trúc có đốt + lá dài (nền trong, alpha .85); nhà: hàng ngói vảy 3 hàng theo sườn mái + sống mái + vân gỗ lượn + cửa sổ 2 ô sáng ấm theo L (ngày kính tối, đêm `#F1C18D`); cây: cụm lá phụ biến thiên + đốt/lá trúc; cầu: ván; ruộng: mầm linh thảo theo luống; đèn lồng: tua + lõi sáng theo L; đá: mặt cắt + highlight; hàng rào/thùng/cờ/bụi/sạp đều có nét riêng; đá lát: lưới mạch 64px kẹp poly; nước: 7 gợn sáng lượn sóng cố định theo poly. Tất cả họa tiết tĩnh cache canvas phụ một lần (núi/rừng/tiền cảnh/bóng tĩnh theo phút game/lớp tối theo phút+camera/grading bake nửa phân giải); nét detail gom 1 path mỗi loại; danh sách nguồn sáng cache theo camera; cổng detail cache 100 ms.

## M2 — T16: hội thoại NPC thật 12 người × 3 lần gặp (`src/70_dialogue.js`, 20.268 byte)

**Hàm/biến game đã dùng:** `v8Talk` (src/05_v8_v11.js:47, điểm chèn duy nhất); `V8_INFO`/`V8_PEOPLE` (src/05:7–21); `v8Shop`/`v8Chat` (src/05:49–52); `v8Cancel` (src/05); `panel`/`panelLegacy` (src/47_v45_v35.js:1274/1302); `v35Render` (src/47:536–539, HUD ẩn khi modal mở); `update()` (src/48:441, gọi `frameHooksUpdate` sau update, trước khi `pressed` bị xoá); `FRAME_HOOKS.update` (src/01_core.js:8–9); `text/box/addButton/wrapText` (src/01_core.js:183/186/496/491); `clamp/save/gainXP/message` (src/01_core.js:227/206); `C` (src/01_core.js:88); `buttons` + `pointerdown` (src/01_core.js:570–573); `v12Check`/`v12Init` (src/08_v12_v8.js:48,55); `resume()`/`resume_L18` (src/48:442–445); `v47tInteractNPC`→`v471Legacy`→`v8InteractAt`→`v8Talk` (src/48:418/390, src/05:71 — thôn mới V47T đi qua đúng `v8Talk` đã PATCH nên mở được hội thoại này, không cần PATCH thêm); `V36_BY_ID` (src/25:10); `hudTQZoneHit` (src/69:217).

**PATCH — 5 cái:**
1. `index.html` — thêm `<script src="data/dialogues.js">` sau `data/quests.js`: nạp `DATA.dialogues` trước các file `src`.
2. `index.html` — thêm `<script src="src/70_dialogue.js">` sau `src/69_hud_tq.js`: nạp module trước `99_boot_ready`.
3. `src/05_v8_v11.js` — `v8Talk`: `if(typeof dlgTryOpen==='function'&&dlgTryOpen(o))return;` trước khi đặt modal `npc8` (điểm chèn duy nhất, dialogue_addendum §1; dữ liệu + ảnh hợp lệ thì mở modal kind `dialogue`, không thì giữ bảng `npc8` cũ).
4. `src/47_v45_v35.js` — `panelLegacy`: `if(k==='dialogue'){...dlgDraw();return;}` trước dòng `npc8` (vẽ qua `dlgDraw()` trong `uiPaperBegin` của `panel()`, kiểu giấy A; guard `typeof` để game vẫn chạy nếu src/70 chưa nạp).
5. `src/48_v48_v47.js` — `resume()`: chuyển sang `resume_L19` (gọi `resume_L18` rồi migration thiện cảm batch01_addendum §2 trên `p.v8Relations`; guard `typeof` để resume cũ vẫn chạy nếu src/70 chưa nạp).

**Trường save mới:** không có. Thiện cảm dùng `p.v8Relations` có sẵn (như `v8Bond`/`v8Panel`); `p.favor` trong spec T15/batch01_addendum §2 được hiểu là kho thiện cảm đã có này, không bịa thêm. Migration `resume_L19`: 10 NPC mới, nếu `p.v12Talk[npc]===true` và `p.v8Relations` chưa có khoá đó → `=5` đúng một lần; không đụng `inn`/`shop`; save cũ thiếu trường thì khởi tạo `{}` rồi mới đọc.

**Ánh xạ id NPC → portrait (đã xác minh):** `data/dialogues.js` ghi `portrait:null` cho **cả 12 NPC** — nghĩa là "dùng ảnh game", không phải "không có ảnh". Ánh xạ dùng là `ASSETS["portrait_<id>"]`, đủ 12 cái trong `ops/ASSETS_LIST.txt` (portrait_bambooKeeper, portrait_demonWatcher, portrait_desertSmith, portrait_ghostSeer, portrait_herbalist, portrait_inn, portrait_mountainHunter, portrait_sentry, portrait_shop, portrait_snowHermit, portrait_swampMedic, portrait_wanderer). **Riêng `inn` xử lý như 11 NPC còn lại** — `portrait:null` → `ASSETS["portrait_inn"]`, không có ngoại lệ. Chuỗi fallback: `ASSETS["portrait_"+id]` (URL chuỗi hoặc object ảnh) → `imgs["npc_"+id]` (sprite, vẽ tối đa 2×) → không có cả hai thì `dlgTryOpen` trả `false` để giữ bảng `npc8` cũ. Dữ liệu không có tặng vật phẩm (`stones`/`pills`/`xp` chỉ hỗ trợ sẵn theo schema, không dùng) và không có `openShop` ngoài `shop`.

**Hành vi:** khung giấy A qua `panel()`; chân dung contain 40,192,288×456; tên NPC = role + name (người chơi nói thì `p.v8Name`, chân dung mờ 0.72); thiện cảm `p.v8Relations` + thanh bar; chữ chạy 28ms/cụm grapheme (Intl.Segmenter, +70ms sau dấu kết câu, tối đa 4,5s), dòng ngắt sẵn từ đầu; bấm/Space lần đầu chỉ hiện hết, lần sau mới chuyển; 2–4 lựa chọn đánh số 1–4, lựa chọn thiếu điều kiện mờ + không kích hoạt (kiểm lại `cond` lúc nhận input); `modal.kind='dialogue'`; ESC đóng không commit; Tab + nút "Việc khác [Tab]" (1036,382,128×38, ô thiện cảm dời sang 772,382,256×38) đóng không commit rồi mở bảng `npc8` cũ qua `v8Talk` thật (có cờ suppress chống mở lại hội thoại); `openShop` = commit rồi mở bảng `npc8` của shop (game không có panel tiệm riêng); effect chỉ commit khi xác nhận rời node (node rồi choice, một lượt, chống farm bằng ESC/mở lại). Lần gặp: duyệt `meetings` theo thứ tự file, chốt lúc mở, không reevaluate giữa chừng — `inn`/`shop` có 3 meeting, 10 NPC còn lại có 2 meeting nên **lần gặp thứ 3 lặp lại meeting `_2`** (không effect, không tăng thiện cảm), đúng dữ liệu. Module không đăng ký overlay nên con trỏ TQ luôn nằm trên cùng, không cần `unshift`.

## M3 — T24: nội thất quán trọ (`src/71_interior.js`, 12.818 byte)

**Hàm/biến game đã dùng:** `v36Backdrop` (src/26:29, PATCH nhánh inn) → wrapper src/31:51 vẫn phủ khung/tia nắng/bậc cửa lên trên; `V36.roomCache` (src/25:11); `v36Current`/`v36Inside` (src/25:15–16); `V36_NPC` (640,310), `V36_EXIT` (640,558) (src/25:13); `v36Blocked` (src/25:31, PATCH); `v36Draw` live (src/46:186–191, PATCH mảng `things`); `v37Furniture`/`v37FurnDraw` (src/26:26–27, đồ cũ vẫn vẽ y-sort); `v41RoomLive` (src/31:65–70, quầng đèn 478/802, y180); `W/H/TAU` (src/01:86–87); `V36_ROOMS` (src/25:3).

**PATCH — 3 cái:**
1. `src/25_v36_v37.js` — nối `|| interiorInnBlocked(x,y)` vào `v36Blocked`: thêm va chạm foot quầy, chỉ phòng inn.
2. `src/26_v38_v37.js` — đầu `v36Backdrop`: nếu inn + `INTERIOR_NEW` thì trả `interiorInnBackdrop(r)`, còn lại nhánh cũ.
3. `src/46_v44_v35.js` — trong `v36Draw` live: chèn `interiorInnDeskEntry(r)` vào mảng `things` trước khi sort (quầy vẽ sau NPC nên chủ quán đứng sau quầy; 4 phòng kia entry=null nên không đổi).

**Trường save mới:** không có (đã kiểm so sánh `Object.keys(p)`). **Cờ:** `INTERIOR_NEW=true`; 4 phòng kia giữ nguyên.

**Nội dung (khớp ảnh concept `assets/interior_inn_concept.webp` đã xem):** backdrop inn cache trong `V36.roomCache` — tường hậu ván gỗ có vân thớ, bình phong 3 tấm vẽ núi + thác + tùng + sương (470–810, y140–246), cửa sổ song gỗ sáng ấm hai bên, 4 cột đỏ trầm có đai vàng/đế đá, sàn đá phối cảnh (hàng ngắn dần về hậu, từng viên lệch tông + vân), thảm dài giữa (548,312,184,254) dệt sọc + trám vàng, vệt nắng xiên, bóng mềm dưới quầy (219 fillRect, có gradient — không khối phẳng). Quầy tiếp kiến (`interiorInnDeskCanvas` 280×72 + `interiorInnDeskEntry`): mặt gỗ vân ngang, vải phủ thêu cành, chồng sách/ống bút/cuộn thư/lư hương (né vùng NPC x595–685), mặt trước chạm khắc + đinh đồng; chèn vào y-sort của `v36Draw` live: NPC vẽ trước, quầy vẽ sau → chủ quán đứng sau quầy; hero y400 vẽ sau quầy. Va chạm foot quầy (`interiorInnBlocked`): khối (500,248,280,62) nới như đồ cũ (±14/−13/+13), chỉ phòng inn; đứng sát quầy (640,323) cách NPC 13px vẫn E nói chuyện được; đường `v36GoNPC` không xuyên quầy. Đèn dầu: đèn lồng vẽ đúng anchor quầng thật của `v41RoomLive` — (478,180) và (802,180); không tự tạo pass glow mới, không phủ màu lên HUD. Không vẽ gì vào 3 vùng HUD TQ (đã kiểm bằng `hudTQZoneHit` src/69:217). Không phím mới, không dùng ảnh concept làm nền gameplay (spec §6).

## M1b — bóng đổi hướng + độ dài theo giờ (sửa tại chỗ `src/68_depth_light.js`, nay 43.168 byte)

Chủ dự án đã tự làm hệ bóng, nên phần này chỉ lo **hướng/độ dài theo giờ** và đưa ra một hàm để hệ bóng sẵn có đọc. Không PATCH (`ops/patches/MUSE_05_M1b.json = []`), không đổi API khác.

**`depthLightShadowVec(hour)` — liên tục, không cắt cứng:**
- Mặt trời mọc 5h30 phía đông, lặn 18h30 phía tây (`DL_SUNRISE`/`DL_SUNSET`). Tiến độ `f=(h−5,5)/13` kẹp [0,1].
- Phương vị bóng `phi=π·(1−f)`: 180° (về tây) → 90° (xuống màn hình) → 0° (về đông). `dx=cos(phi)·len`, `dy=0,35·sin(phi)·len` (ban ngày dy dương nhỏ). 22h–3h hướng quay êm đông→tây (alpha=0 nên không thấy) để qua nửa đêm cũng không nhảy.
- Độ dài theo độ cao mặt trời: `len=0,18+1,42·(1−sin(π·f))` ∈ [0,18 trưa; 1,6 lúc mọc/lặn].
- `alpha = smoothstep(5;6,5)·(1−smoothstep(17,5;19))`; đêm 0 (chỉ còn bóng tiếp đất như cũ).
- Trả `{dx,dy,len,alpha,angle=atan2(dy,dx),night=alpha<=0}`.

| giờ | dx | dy | len | alpha |
|---|---|---|---|---|
| 6h | −1,418 | 0,060 | 1,429 | 0,741 |
| 9h | −0,356 | 0,141 | 0,537 | 1 |
| 12h | 0,000 | 0,063 | 0,180 | 1 |
| 15h | 0,356 | 0,141 | 0,537 | 1 |
| 17h | 1,025 | 0,136 | 1,096 | 1 |
| 18h30 | 1,600 | 0,000 | 1,600 | 0,259 |
| 22h | 1,600 | 0,000 | 1,600 | 0 |

Quét 1440 phút game (kể cả 23:59→0:00): chênh lớn nhất giữa 2 phút liền kề Δdx 0,025, Δdy 0,006, Δlen 0,006, Δalpha 0,017.

**`dlDrawOneShadow`:** elip tiếp đất giữ nguyên (độ đậm `0,5+0,5·alpha`, đêm vẫn 0,5 như trước). Bóng dài chỉ vẽ khi `alpha>0,01 && len>0,2`, độ đậm nhân alpha, **elip xoay theo `vec.angle`**, tâm ở giữa đoạn chân→điểm lệch nên bóng bắt đầu từ chân; ~11h20–12h40 chỉ còn bóng tiếp đất. Bóng sống (hero/NPC/dân làng) dùng cùng vec; cache bóng tĩnh vẫn theo phút game.

**Cách dùng cho hệ bóng sẵn có của chủ dự án — `depthLightSun()`** (trả vec của giờ hiện tại; chưa có `p` → giờ 0, alpha 0):
```js
const s = depthLightSun();
offsetX = s.dx * chiềuCaoVật * 0.55;
offsetY = s.dy * chiềuCaoVật * 0.55;
độĐậm  *= s.alpha;                         // 0 ban đêm → bỏ bóng dài
ctx.ellipse(cx, cy, rx, ry, s.angle, 0, 2*Math.PI);   // xoay theo hướng bóng
```

**Đề xuất (chưa sửa, cần duyệt PATCH riêng):** hệ bóng thế giới mở `hdSun()` ở `src/04_v11_v46.js:45` lật `dx` cứng lúc 12h (và hướng ngược chuẩn mới: sáng +1 = về đông), không tắt về đêm; `hdShadow()` `src/04:46` bị gán lại ở `src/15:43`, `src/27:242`, `src/32:25`, `src/44_photo.js:188` (bản live có lẽ là src/44 — phải xác minh trước). Có thể cho `hdSun` lấy dx/dy/len/alpha/angle từ `depthLightShadowVec(hour)` và `hdShadow` live dùng `rotate(sun.angle)` + nhân alpha.

## M4 — tương tác sơn môn (`src/72_sect_life.js`, 34.863 byte, 606 dòng, cờ `SECT_LIFE=true`)

Trụ sở Thanh Vân Tông chính là thôn V47T (V14_SECTS cloud có leader `inn` = "Đại điện · Trưởng lão"), nên 6 tương tác đặt cạnh đúng công trình trong thôn. Nhấn **E** qua đường sẵn có `v47tInteract` (src/48:419) → `townLifeNear()` → `townLifeInteract()`; dock hiện tên điểm. Điểm định nghĩa trong 72 (không sửa data), mỗi điểm `{id,kind:'sect',act,name,x,y}`.

| id | Tên | x,y | Gần nhất (point/node/cổng khác) |
|---|---|---|---|
| ward | Bùa động phủ | 2470,490 | v31_cave 122px |
| herb_1 | Khóm dược thảo | 740,1560 | v13_farm 152px |
| herb_2 | Khóm dược thảo | 1020,1700 | v13_farm 161px |
| herb_3 | Khóm dược thảo | 400,1600 | herb_1 342px |
| spring | Linh tuyền | 2200,620 | v31_cave 212px |
| furnace | Lò luyện khí | 530,1240 | v13_forge 162px |
| master | Giáo đầu sân luyện | 2600,1235 | training 132px |
| incense | Đỉnh hương Đại điện | 1600,690 | door_inn 145px |

Cả 8 điểm không bị `townBlocked(x,y,28)`, cách mọi point/V471 node (sau `townApplyLayout`)/cổng ≥110px nên không cướp phím E của NPC/công trình, và đi tới được (BFS lưới 16px từ spawn bằng `v47tBlocked` live).

**Hành động + giới hạn** (mọi thông báo kèm "(n/N hôm nay)", đổi trạng thái thì `save()`):
1. **Bùa động phủ** — 1 lần/ngày. Có Hộ Thân Phù → `v13Adjust('ward',-1)` dán phù, +45 tu vi; không có → vẽ bùa giấy, +20. Bùa sáng nhẹ trên cửa Động phủ tới hết ngày.
2. **Hái dược thảo** (3 khóm quanh Linh điền/bìa rừng) — tổng 6 lần/ngày; mỗi khóm +1 linh thảo (`v13Adjust('herb',1)` → cộng tay `p.v13.bag` → +3 linh thạch, như câu cá), mọc lại sau 30 đơn vị worldTime (2 giờ game); vừa hái vẽ thành mầm, chưa mọc thì báo còn bao lâu.
3. **Uống linh tuyền** — 2 lần/ngày: linh lực đầy, máu +30% (kẹp `currentStats()`), lần đầu trong ngày +10 tu vi; có gợn nước + hơi nước bốc.
4. **Lò luyện khí** — `v30ForgeAllowed()` → mở Thiên Công Phường có sẵn qua `v30ForgeOpen()` (không làm hệ chế tạo mới, đúng batch01_addendum §8); không được phép → báo ngắn. Mỗi lần nhấn lửa bùng 1,5s + đốm lửa.
5. **Giáo đầu sân luyện** — NPC khối như dân làng 67 + nhãn "Giáo đầu". Lần đầu mỗi ngày "chỉ điểm" +15 tu vi + 1 trong 8 câu khuyên xoay vòng (bong bóng 5s); các lần sau gọi `v42tOpen()`. **Hệ quả:** giáo đầu cách node training 132px (>90px của `v42tOpen` live ở src/48:416) nên lần 2+ game tự dẫn vài bước "Đang đến sân luyện."; tới nơi nhấn E ở Sân luyện như cũ (đã kiểm node training vẫn nhận E).
6. **Thắp hương** (đỉnh hương trước Đại điện) — 1 lần/ngày, +10 tu vi + câu chúc; hương cháy 30 đơn vị worldTime, khói ≤12 hạt, đốm đỏ đầu nhang, đêm có quầng ấm.

**Trường save mới:** `p.sectLife = {day, ward, wardDay, wardKind:'phu'|'giay'|'', herb, regrow:{herb_1:wt,…}, spring, master, tip, incense, incenseUntil}` (trong save hiện có, không key mới). Save cũ thiếu/sai kiểu → điền mặc định. Đổi ngày (`Math.floor(p.worldTime/360)`) chỉ reset bộ đếm; `regrow`/`incenseUntil` là mốc tuyệt đối nên giữ.

**Tick:** `FRAME_HOOKS.update.push(sectLifeTick)` (không bọc đè hàm), dt kẹp ≤0,1s, chỉ chạy khi `sectLifeActive()`; hạt ≤40, khói ≤12, gợn ≤8. **Đồ họa:** 8 họa tiết thủ tục (đỉnh hương, lò, khóm thảo, mầm, suối, cọc bùa, lá bùa, giáo đầu) cache canvas phụ 1 lần/loại; nhãn mực đêm `rgba(20,17,14,.85)` + chữ `#efe6d4` + viền `#c9a86a` nhạt, không xanh ngọc. Module tắt khi `SECT_LIFE=false`, `TOWN_NEW=false` hoặc thiếu `DATA.town_layout` (warn `[M4]` đúng 1 lần).

**PATCH M4 (4, đều `src/67_town_life.js`):**
1. `townLifePoints` — nối `.concat((typeof sectLifePoints==='function')?sectLifePoints():[])`.
2. Đầu `townLifeInteract` — `if(pt&&pt.kind==='sect'&&typeof sectLifeInteract==='function') return sectLifeInteract(pt);`
3. Cuối `townLifeDrawEntries` — `if(typeof sectLifeDrawEntries==='function') sectLifeDrawEntries(push,inside);`
4. `townLifeDrawEntry` sau `if(!it) return;` — `if(it.type==='sect'&&typeof sectLifeDrawEntry==='function'){ sectLifeDrawEntry(it); return; }`

## Đính chính thẻ script (lỗi gói trước)

Bản MUSE_05 trước chỉ ghi trong báo cáo việc thêm `<script src="src/68_depth_light.js">` và `src/71_interior.js`, **chưa có PATCH**. Nay thêm 1 PATCH `index.html` với `old` = `<!-- thêm file src mới ngay TRÊN dòng 99_boot_ready -->`, chèn trước nó 3 dòng: `src/68_depth_light.js`, `src/71_interior.js`, `src/72_sect_life.js`. Thứ tự src cuối sau khi áp: … 65 → 67 → 69 → 70 → 68 → 71 → 72 → 99_boot_ready (68 phụ thuộc 65 chỉ qua guard `typeof` nên đứng sau 70 không sao). Mục M1.5 và M3.4 bên dưới nay đã được PATCH này thay thế.

## Tự kiểm Node (lệnh + kết quả)

**Lượt bổ sung (M1b + M4), chạy lại độc lập bởi điều phối viên trên `MUSE_05.json` đã gộp:** `check_M1.js` **65/65 PASS** (bỏ 4 kiểm tra bóng cũ, thêm 12 kiểm tra mới: mẫu 6h/9h/12h/15h/17h/18h30/22h, len ≤1,6, liên tục cả ngày, `depthLightSun()`, elip xoay ~166° lúc 8h, 22h chỉ còn bóng tiếp đất); `check_M2.js` **26/26 PASS**; `check_M3.js` **49/49 PASS**; `check_M4.js` **88/88 PASS** (PATCH ×1 tuần tự và trùng phần src/67 trong file gộp; không bọc đè; vị trí/BFS/`townLifeNear`/dock 8 điểm; từng hành động, giới hạn/ngày, reset ngày; mọc lại đúng 30 (29 thì chưa); 2 nhánh fallback herb; `v30ForgeOpen` có/không gọi theo `v30ForgeAllowed`; `v42tOpen` lần 2+; ward tiêu đúng 1, XP 45/20; linh tuyền kẹp; vẽ ngày 8h + đêm 21h; save cũ; ghế/chuông/giếng/câu cá 67 vẫn chạy; `SECT_LIFE=false`; `TOWN_NEW=false`; thiếu layout). **Tổng mới: 228/228 PASS.** `ops/patches/MUSE_05.json` = **18 PATCH** (13 cũ giữ nguyên thứ tự + 1 index.html + 4 M4), áp tuần tự trong bộ nhớ: mọi `old` đúng 1 lần; 8 file JS bị PATCH sau khi áp đều qua kiểm cú pháp; 4 file mới `'use strict'` dòng đầu, `node --check` OK, không mẫu bọc đè.

*Kết quả lượt đầu (giữ để đối chiếu):*

Chạy lại độc lập bởi điều phối viên, exit 0. Harness nháp `check_M1.js` / `check_M2.js` / `check_M3.js` (không đưa vào zip nộp); VM Node + canvas giả, stub ghi rõ trong đầu mỗi file harness.

- `node check_M1.js` — **57/57 PASS** (chạy 2 lần đều đạt): bảng mốc giờ 8/8 mẫu đúng lighting.md §2.2 (M/aM/L/K), nội suy t=45 → aM 0.505, t=150 → 0.135, wrap 360 = 0; hệ số multiply thôn 12:00 = (0.984, 0.973, 0.953) và 00:00 = (0.615, 0.630, 0.678) khớp §2.4; sương sớm 6h30 alpha 0.110, 12h/9h = 0; bóng 6h dx −1.50/len 1.50 về tây, 12h len 0.15/dx 0, 17h dx +0.96/len 1.15 về đông, 22h len 0; nguồn sáng tổng 18 (12 cửa sổ + 2 đèn lồng + 1 lò rèn r=76 + 3 ống khói), thấy được tối đa 6 + tối đa 3 đom đóm; 3 mức quality; `TOWN_NEW=false` và thiếu `DATA` → không làm gì, không crash; `townDrawWorld` qua PATCH chạy đủ (hero=1, objects=38, groundTiles=16); tiền cảnh né cả 3 vùng HUD; có/thiếu `ASSETS["light_glow"]` đều sáng; cache: 2 frame cùng phút+camera không rebuild bóng/lớp tối, sang phút game mới hoặc đổi camera thì rebuild đúng 1 lần.
- `node check_M2.js` — **26/26 PASS** (chạy lại độc lập lần 2 vẫn 26/26): dữ liệu (đủ 12 NPC, meetings 3/2, next hợp lệ, text ≤140 trong 188 node+choice, cond/effect đúng enum); fallback (thiếu DATA/NPC/dữ liệu hỏng/thiếu ảnh → `npc8`; sprite `imgs` và ASSETS dạng URL chuỗi vẫn mở được); đi hết 12 NPC × 3 lần gặp theo nhánh đầu tiên, đối chiếu với bộ đi độc lập trên dữ liệu thô (meeting, thiện cảm, flag, talked đều khớp; tổng thiện cảm inn 10, shop 6, 10 NPC còn lại mỗi người 6; `inn_second_done`/`shop_intro_done`/`shop_second_done` đủ); reveal/click/Tab/ESC/openShop/lựa chọn khoá (favor<5)/tên Vô Danh/toast/migration (đúng 1 lần, trừ inn/shop).
- `node check_M3.js` — **49/49 PASS**: nạp thật src/25 + 26 + 31 + 46 (đã áp PATCH trong bộ nhớ) + src/71 trong VM Node + canvas giả; vào/ra inn (spawn 640,530); backdrop inn chi tiết + cache 2 lớp; va chạm quầy (giữa/đầu quầy chặn, mép/điểm tiếp kiến/spawn/cửa đi được); 4 phòng kia backdrop cũ + không quầy + collider cũ; y-sort NPC < quầy < hero + 4 đồ cũ; `v36GoNPC` không xuyên quầy; E sát quầy gọi `v8Talk('inn')`; không đè vùng HUD TQ; không thêm trường save; `INTERIOR_NEW=false` tắt sạch module.
- **Tổng: 132/132 PASS.** Kiểm tra gộp của điều phối viên: 3 file mới đều `'use strict'` ở đầu, `node --check` OK, không có mẫu bọc đè hàm; 13 PATCH trong `ops/patches/MUSE_05.json` (M1 5, M2 5, M3 3), mỗi `old` xuất hiện đúng 1 lần trong file đích (đếm lại từ file gộp), áp tuần tự cả 13 trong bộ nhớ OK, không chồng `old`, 7 file sau khi áp đều `node --check` OK.

## Hiệu năng M1 (FPS trước/sau)

Chưa đo được FPS thật trên trình duyệt (máy này không chạy được Chromium). Số đo bằng stub trong `check_M1.js` (ctx cùng realm VM, 200 frame, đã warm-up): có M1 0,970 ms/khung, không M1 0,225 ms/khung → **M1 thêm ~0,63–0,75 ms/khung JS** (ngân sách <1 ms/khung, ≈6% khung hình 60fps). Lưu ý: % chênh stub (~293–306%) bị thổi phồng vì gốc stub không có chi phí GPU (ctx no-op); số tuyệt đối +0,75 ms mới là số có ý nghĩa. 2 fill fullscreen đã bake thành 2 drawImage canvas nửa phân giải (lighting.md §8 cho phép). **FPS thôn thật vẫn cần Claude đo lại (mốc ≥50, tụt ≤10%).** M3: backdrop + quầy đều cache canvas phụ (chỉ vẽ 1 lần), `v36Draw` thêm 1 `drawImage`/khung nên chi phí không đáng kể, nhưng chưa chạy trên Chromium thật.

## Rủi ro / chỗ cần Claude xem trên trình duyệt

**M1:**
1. FPS thật + nhìn mắt là bắt buộc: stub không đo được GPU.
2. Viễn cảnh là dải haze ở đỉnh màn hình, không phải bầu trời đục: vì map mới lát kín viewport (khác art cũ offset y=300), lớp xa/giữa vẽ mờ (alpha .55/.6, mờ dần mép dưới) phía trên mặt đất — cần xem mắt có bị "núi đè lên mái nhà phía bắc" không; nếu xấu, phương án khác là chừa dải trời thật bằng cách dời map xuống (đổi layout, chưa làm).
3. *(Đã thay bởi M1b: hướng + độ dài bóng nay quét liên tục theo giờ, có alpha bình minh/hoàng hôn, xem mục M1b.)* Ghi chú cũ: Hướng bóng theo giờ là theo lệnh M1 (sáng về tây → chiều về đông), khác lighting.md §2.2/§4.2 (hướng cố định trên-trái, bóng ngắn). Đã theo đúng lệnh gói 05; nếu chủ dự án muốn theo T21 thì đổi `depthLightShadowVec` sang hướng cố định.
4. Chưa kiểm bằng mắt: màu grading 4 mốc, quầng đèn, sương sớm, tiền cảnh che HUD — cần ảnh chụp 0h/6h/12h/18h/22h.
5. *(Đã có PATCH index.html — xem "Đính chính thẻ script".)* Ghi chú cũ: Gắn script: thêm `<script src="src/68_depth_light.js">` sau `src/69_hud_tq.js` (thứ tự linh hoạt nhờ guard `typeof`, nhưng phải sau src/65 và trước frame đầu tiên vào thôn).
6. Đom đóm chỉ xuất hiện khi `townLife` (src/67) đã init; vị trí ống khói vẫn là ước lượng của G04.

**M2:**
1. Chưa kiểm bằng mắt/trình duyệt. Cần chơi thật: vào nhà gặp `inn` (V36) lần 1/2/3, gặp `shop` xem hàng 3 lần, gặp 1 NPC ngoài thôn (vd `bambooKeeper` ở Trúc), bấm Tab "Việc khác", ESC giữa chừng rồi mở lại (phải vào đúng lần chưa xong).
2. Khung thoại che vùng dock HUD theo hình học (khung y408–696, dock y642–720; chân dung chỉ chạm dock đúng 6px đáy y642–648) — nhưng đây là modal phủ HUD theo đúng layout spec §2.1, và HUD không được vẽ khi modal mở (`v35Render` src/47:539, vẽ thôn src/48:464) nên thực tế không có gì bị che. Nếu Claude muốn chặt hơn thì phải đổi layout spec, không tự sửa trong M2.
3. Toast "Thiện cảm +N" không có đường nào kích hoạt với data v1 (mọi effect thiện cảm đều ở node kết/choice đóng hoặc mở shop) — code đã làm đúng spec §3.3 và đã kiểm đường vẽ trực tiếp, nhưng trên trình duyệt sẽ không bao giờ thấy toast này cho tới khi data có effect thiện cảm ở node giữa.
4. Chân dung thật chưa thấy (gói zip không kèm `assets.js`): code chấp nhận cả ASSETS dạng URL chuỗi lẫn object `{img,ready}` (theo mẫu `v63Img`), nhưng kích thước/tỉ lệ thật của `portrait_*` chỉ xác nhận được trên trình duyệt — nếu ảnh là chân dung dọc hẹp thì contain vẫn đúng, chỉ để lại khoảng trống hai bên.
5. "Việc khác" khi đang ở trong phòng V36 đi qua đúng chuỗi `v8Talk` (lớp V36 kiểm tra khoảng cách tới NPC) — đã lý luận là qua được vì cùng đường mở thoại, nhưng cần bấm thật một lần để chắc.
6. `dlgUpdate` đọc `pressed` trong `FRAME_HOOKS.update` — phụ thuộc `update()` ở src/48:441 chạy `frameHooksUpdate` sau `update_L32` (đã đọc code, đúng); nếu sau này thứ tự này đổi thì phím thoại sẽ trễ một tick.

**M3:**
1. Bố cục so với ảnh concept là điểm cần mắt người nhất: concept là đại điện mở có hiên/bậc đá ngoài trời, còn khung V36 là phòng kín (tường hậu y134–251, sàn y251–580) nên đã chuyển bố cục tương đối theo spec interior.md §3.1 (bình phong sau quầy, kệ hai bên, thảm giữa, bàn trà/ghế do art `v37furn` cũ đảm nhiệm). Cần chụp 1280×720 trong game để xem: bình phong có bị bảng tên NPC (583,201,114,35) che quá nhiều không; quầy có che thân dưới NPC đúng ý không (sprite NPC cao bao nhiêu thì chưa biết — nếu NPC thấp hơn ~70px, quầy sẽ che gần hết người, cần hạ chiều cao mặt quầy); kệ sách art `v37furn5` có chồng lên cột đỏ ở x452/806 gây rối không.
2. Đèn lồng: quầng sáng do `v41RoomLive` vẽ sau backdrop nên sẽ khớp anchor, nhưng độ sáng/tone trên nền tường mới chưa kiểm bằng mắt.
3. Chưa đo FPS: backdrop + quầy đều cache canvas phụ, `v36Draw` thêm 1 `drawImage`/khung, chưa chạy trên Chromium thật.
4. *(Thẻ script nay đã có trong PATCH index.html.)* Lưu ý kỹ thuật khi ghép: thêm `<script src="src/71_interior.js">` sau `src/69_hud_tq.js`, trước `src/99_boot_ready.js`; áp `MUSE_05_M3.json` bằng đúng `old` (đã xác minh ×1); đừng patch `v36Draw` ở src/25 (đã chết, live là src/46:186).

**M1b:**
1. Chưa kiểm bằng mắt/trình duyệt: cần chụp thôn lúc 6h, 9h, 12h, 15h, 17h, 18h30 xem bóng xoay đúng hướng, không quá dài lúc 6h/18h30 (len 1,4–1,6 × chiều cao vật × 0,55), mờ dần mượt lúc bình minh/hoàng hôn.
2. Hệ bóng riêng của chủ dự án chưa nối với `depthLightSun()` — nếu cả hai cùng vẽ sẽ có 2 lớp bóng; chọn một (hoặc tắt bóng dài trong 68).
3. `hdSun`/`hdShadow` ở thế giới mở vẫn lật cứng lúc 12h và hướng ngược chuẩn mới — chỉ là đề xuất, chưa sửa.

**M4:**
1. Chưa kiểm bằng mắt/trình duyệt, chưa đo FPS (thêm ≤8 đồ vật + ≤60 hạt; mọi hình đã cache).
2. Đỉnh hương (1600,690) nằm giữa trục đường đá lên Đại điện, không có va chạm (không sửa layout) → người chơi/dân làng đi xuyên hình.
3. Bùa trên cửa Động phủ vẽ ở khoảng (2350,352), đoán theo kích thước sprite — cần xem có trùng cửa thật của ảnh `b_cave` không.
4. Lò luyện khí (530,1240) có thể che một phần thân người chơi khi đi dọc đường đất y≈1170.
5. Giáo đầu ở 132px khỏi node Sân luyện → lần 2+ `v42tOpen` dẫn vài bước tới sân luyện thay vì mở ngay (đánh đổi để không cướp phím E của Sân luyện).
6. Linh tuyền đặt trên mảng cỏ cạnh đường lên Động phủ; khóm thảo có thể lẫn với gà quanh ruộng. Toàn bộ là họa tiết thủ tục, chưa có sprite thật.

## Ghi chú máy

Ghi file bằng công cụ ghi file + shell đều chạy được trong phiên này; không dùng Python/git/Chromium; Node dùng để tự kiểm, in ra màn hình, không ghi file từ Node (file gộp `MUSE_05.json` và báo cáo này viết bằng công cụ ghi file). File nháp không đưa vào zip: `check_M1.js`, `check_M2.js`, `check_M3.js`, `check_M4.js`, `ops/patches/MUSE_05_M1.json`, `MUSE_05_M1b.json`, `MUSE_05_M2.json`, `MUSE_05_M3.json`, `MUSE_05_M4.json` (đã gộp xong vào `MUSE_05.json`). File nộp lượt bổ sung: `src/68_depth_light.js` (đã sửa), `src/70_dialogue.js`, `src/71_interior.js`, `src/72_sect_life.js` (mới), `ops/patches/MUSE_05.json` (18 PATCH), `MUSE_05_REPORT.md`.
