# BATCH_04 — ChatGPT (code nháp)

**Vạn Đạo Tu Tiên · 21/11/2026 · v2.0 — bản nâng cấp sau phản biện, thay v1.0**

Nguồn đối chiếu: `GOI_04_ChatGPT.zip` (snapshot 23:09), `ops/chatgpt/BRIEF.md` bản trong gói, `BATCH_04.md`, `ops/RULES.md`, `ops/OVERRIDES.md`, `ops/specs/tutorial.md`, hai phụ lục `batch02_addendum.md` §3 và `batch03_addendum.md` §1.3, §1.6, §1.7. Dùng chính 51 script gốc trong index của snapshot, không dùng bản V47.1 của lần thử cũ.

### Phản biện v1.0 → v2.0

| Hạng mục | Bất cập v1 | Sửa v2 |
|---|---|---|
| C1 | Tick mô phỏng có thể đánh dấu đã đọc dù không render; death cùng vùng còn queue cũ | Chỉ ghi seen sau frame overlay thực vẽ đủ 1 giây; hết 4 giây có epsilon; giới hạn dt tích lũy 100ms/frame; reset queue khi chết; chặn drawer, tab ẩn, warmup; kiểm lại collision tại draw |
| C2 | NaN/Infinity vượt điều kiện `< need`; cờ truthy sai kiểu mở danh hiệu | Counter hữu hạn, không âm, lấy phần nguyên; cờ claim chính xác `true`; tổng đã nhận và danh hiệu hiện tại ở đầu bảng; card đã claim luôn hoàn thành |
| C3 | Save thiếu base, offered quá cấp, kill chưa nhận có thể sai số; trả việc khác làm mất track | Tái lập mốc từ count hiện tại (không cấp tiến độ lịch sử), lọc cache theo cấp, bảo đảm active trước, giữ tracked active khác, dẫn vùng khi chưa spawn địch |
| C4 | Save thiếu DATA riêng có thể khóa vĩnh viễn slot nhiệm vụ chung; count NaN có thể vượt gate | Tạm lưu `p.v31.batch04SuspendedTasks[]` không hủy dữ liệu; mở lại nhiệm vụ chung; phục hồi nhiệm vụ riêng khi DATA trở lại và slot trống; count hữu hạn; hiện lời giao việc và tách nút khỏi số tiến độ |
| C5 | Cùng tọa độ nhưng sai vùng/POI stale vẫn có thể mở; thiếu phản hồi cụ thể | Xác nhận mode, vùng logic + vùng tọa độ, identity record, tọa độ POI, day, goal, tầm; hủy modal stale không trả thưởng; lưu `e.result={choice,success,details}` gồm hiệu ứng thực, XP còn nhận; theo dõi trạng thái trong O; bỏ buff lỗi vô hạn |
| Fallback | Kiểm `.every` bỏ qua lỗ trống của sparse array | Kiểm cả vị trí rỗng, kiểm id hợp lệ, reward số nguyên an toàn. Mỗi namespace hỏng cảnh báo một lần và giữ module cũ |
| PATCH | Một patch C4 phụ thuộc vào nội dung `new` của patch trước | Hợp nhất vào một patch, kiểm **tất cả** `old` tồn tại đúng một lần cả trên nguồn gốc lẫn khi áp tuần tự |

Giữ 7 entry bắt buộc, giữ nguyên DATA và source gốc. Không dùng lại ZIP v1 hoặc ghép v1 chồng v2. Các patch v2 áp vào đúng snapshot nguyên bản; nếu đã tích hợp v1, Claude cần đối chiếu diff/rollback riêng các đoạn v1 trước khi áp v2, không ghi đè các sửa đổi khác của repo.

## Tổng quan nộp

| Việc | File mới | Kết quả Node |
|---|---|---:|
| C1 · T61 | `src/56_tutorial.js` | 23/23 |
| C2 · T52 | `src/57_milestones.js` | 8/8 |
| C3 · T58 | `src/58_jobs.js` | 12/12 |
| C4 · T57 | `src/59_sect_tasks.js` | 8/8 |
| C5 · T41 | `src/55_events.js` | 17/17 |
| Tích hợp / lưu tải / hồi quy | VM đầy đủ | 8/8 |
| **Tổng** | **5 module + 50 PATCH** | **76/76 PASS** |

Chỉ nộp 7 file đúng mục Cách nộp. Đối chiếu byte toàn bộ **81/81 file** của snapshot gốc với ZIP nguồn: không thay đổi. Tất cả thay đổi tích hợp biểu diễn dưới dạng 50 PATCH JSON trên 9 file, `old` nguyên văn khớp đúng một lần trong source gốc lẫn lúc áp tuần tự. Không thêm phím, không import/export, không tạo wrapper đè hàm. Tất cả file mới bắt đầu bằng `'use strict';`, 5/5 qua `node --check`. Dữ liệu được kiểm tra lúc load; lỗi hoặc thiếu namespace thì cảnh báo đúng một lần và giữ hệ thống cũ. Cờ lưu được khởi tạo lười; không thay schema cũ.

## C1 — T61 · Hướng dẫn tân thủ

**File:** `src/56_tutorial.js`. API nội bộ tiền tố `b04Tutorial*`. Nối `FRAME_HOOKS.update` và `FRAME_HOOKS.overlay`.

### Nguồn trạng thái thật

| Trigger | Nguồn xác định |
|---|---|
| firstEnemyNear | `enemies`, `bossType` (01_core:171), `dist`; sống, không triệu hồi, không boss, ≤300 px, ngoài thôn |
| lowHp | `p.hp/currentStats().hp`, <35% và >0 |
| firstLoot | `addGear` (01_core:166) và **`v21Pick`** (13_v21_v18:24), chỉ nhặt gear thành công |
| skillPoint | `v11SkillPoints` (07_v11_v10:20), Lv≥2 |
| nearNpc | `owNearest` lớp 25_v36_v37:21; thôn riêng dùng `v471Near` (48_v48_v47:386), NPC thật theo `V8_INFO` |
| firstNight | `p.worldTime`, công thức `hdSun` (04_v11_v46:45), cạnh từ ngày sang đêm |
| nearGate | `v48tNearGate` (48:43); thôn dùng bán kính `gate.r+40` như `v47tInteract` (48:416) |
| breakReady | `v30TrialEligible` (20_v30_v21:57), cấp chưa max, đủ tu vi, thế giới |
| firstMaterial | `v13Adjust` (09_v13_v8:42) thành công, delta dương, herb/wood/ore/crystal/seed |
| firstDeath | `damagePlayer_L00` (01_core:255–259), hồi sinh đồng bộ tại thôn; chỉ enqueue sau khi gameplay ổn định |
| firstKyNgo | `v42wEventPOI` + `v42wEvent` (37:151,194), vùng đã khám phá và offered/hunt/ready |
| sectReady | `p.level≥2 && !p.v14.sect` |
| bagFull | `p.gear.length≥44`, túi tối đa 48 (13:24) |
| firstBossNear | boss sống ≤650 px, `v34Target` (23_v34_v21:20, lớp bổ sung 38_save:263) |
| forgeReady | `p.stones≥20` và mọi gear +0, theo phụ lục §1.7 |
| petReady | Lv≥5, chưa sở hữu linh thú trong `p.v31.pets` |
| newRegion | sai khác tập `p.discovered`, bỏ qua thôn, baseline lúc đổi owner |
| idle60 | dt khi đứng yên ngoài thôn 60s; reset theo tọa độ hoặc scope; pause không tích lũy |

Thẻ duy nhất 420×82 tại (430,350), phương án 2 tại (430,196); icon 28×28, nền #100b13db, viền #e3b96f8c, chữ #f1e4cf, key badge #a8d6c5. Alpha 160 ms vào/ra, tổng 4000 ms, nghỉ ≥8000 ms. Nhớ priority/FIFO, mỗi id pending duy nhất; seen sau 1000 ms hiển thị, nếu bị che trước mốc thì trả hàng đợi. Không đè rect thật của HUD F2 (`V35.rects`, 24_v35_v34:13), target/boss/telegraph, người chơi/địch, modal, nội thất, photo, khám phá bản đồ riêng, chuyển cảnh, thiên kiếp. Town dùng tọa độ/camera V47T thực; world dùng `hdPoint` (04:10). Không có hitbox, không chặn input; chặn document.hidden, drawer và warmup.

**PATCH C1 — 6:** index load namespace data đã duyệt (dùng chung C1–C5); 01_core:166 và 13_v21_v18:24 signal loot; 09_v13_v8:42 signal material; 01_core:259 signal death; 40_audio:136–155 rút nút F2 về (56,562,548,33), thêm Hướng dẫn tân thủ/nút BẬT/TẮT (491,600,113,31) trong khung y642.

**Save:** `p.tutorial={seen:{[hintId]:true},off:false}`. Queue, elapsed, baseline night/discovered và death flag là runtime; đổi owner/scope loại ngữ cảnh cũ. Save khi overlay đã thực sự vẽ đủ 1s hoặc đổi toggle; simulation-only không bao giờ ghi seen. Không phát lại loot/night/newRegion đã xảy ra trước khi mở save cũ.

**Node 23/23 PASS:** đủ 18 id; save cũ/toggle; HP sát 35%; addGear thành công/túi đầy; v21Pick gear/coin/túi đầy thực; nhận/trừ nguyên liệu và đan; mốc forge/bag/sect/pet; hồi sinh qua damagePlayer_L00; giờ 05:00/19:00; priority/requeue/cooldown/seen; render setting; NPC/cổng thực V47; địch 300/boss 650 và safe zone; điểm kỹ năng/đột phá; kỳ ngộ/discover; 60s idle và pause; cạnh đêm không retro; HUD/modal collision; mọi chuỗi hint vừa 3 dòng tối đa.

## C2 — T52 · Thành tựu + danh hiệu

**File:** `src/57_milestones.js`. Kiểm 30 định nghĩa từ DATA.milestones, nối đúng khuôn vào 6 mục cũ `V42_MILESTONES` (37_equipment_assets:213) → tổng 36 mục, 6 trang. Không trùng id. Mọi thưởng dùng `v42wRewardMilestone` (37:212) và `gainXP` gốc (14_v22_v23:27). Số trang riêng runtime theo owner; ‹ › ở (1010,158,52,31)/(1121,158,52,31); không đổi lưới 3×2.

14 counter: level = p.level; discover = tập p.discovered; claim = chỉ 8 id F7 (trucaltar, yuealtar, snowaltar, swampherb, firealtar, ghostrune, phongaltar, loialtar) cờ true (03_v8_v22:18); kills = p.kills; boss = vùng có `v22State().bosses[k].kills>0`, OR riêng truc với p.worldBossDead tránh tính đôi (14:21,44); events = s.total; waystones = số khóa s.stones; sectRank = p.v31.rank nếu đã có tông; stones = p.stones; main = p.v12Main (08_v12_v8:19); pets = số key p.v31.pets; relics = p.relics.length; forge = max p.gear.up; techs = p.techs.length.

**PATCH C2 — 4:** 37:212 tách map claim mới/cũ; 37:287 rows 6/trang; 37:287 nút đeo/tháo chỉ khi có title và đã claim. Header bổ sung tổng đã nhận và danh hiệu đang đeo. Nút title nằm tại x+16/y+144/329×29, không tràn thẻ.

**Save:** `p.msClaimed={id:true}`, `p.titleSel=''` hoặc id đã nhận. Giữ nguyên `p.v42world.milestones` đối với 6 mục cũ. `playerTitle()` cho Claude: trả title hoặc chuỗi rỗng nếu chưa nhận/id không hợp lệ. Chọn lại cùng id = tháo; gọi save ngay. Không tự gắn danh hiệu lên HUD/C (BATCH yêu cầu cung cấp API).

**Node 8/8 PASS:** 36 unique, 6/page; claim cũ; claim mới; 14 counter đúng dữ liệu mẫu; danh hiệu khóa/đeo/tháo và render; render đủ 6 trang.

## C3 — T58 · Ủy thác theo ngày

**File:** `src/58_jobs.js`. `b04JobsToday()` lấy 3 cũ `V13_JOBS` (09:55–59) + 12 `DATA.jobs.jobs`, lọc cấp, xếp deterministic hash (seed, v13Day, id). Đã nhận dở giữ qua ngày (không reset base); nếu có danh sách ngày đã lưu thì không đổi tập/thứ tự kể cả lên cấp hoặc nhận job. Done trong ngày không mở lại. 3 việc hiển thị, mỗi ngày có thể khác nhau.

Tiến độ kill dùng `v12Count(region)` (08_v12_v8:20) trừ base lưu khi nhận qua `v13JobAction` (09:62); nguồn đếm là hit_L01 (08:50) chỉ non-boss, không summon, ngoài bí cảnh. Carry dùng v13Inventory/v13Adjust (09:41–42) và trừ nguyên liệu thực lúc báo cáo; handler xác minh gần board (09:39). Giữ thưởng +18 tu vi theo handler gốc. `v13JobGuide` (09:63) vẫn xử lý đường đi.

**PATCH C3 — 13:** 09:60 giữ active cross-day; 09:62 lookup shortlist + đóng day hiện tại; 09:84 renderer gốc; 37:81 renderer thực `v13Panel` lớp cuối; 37:80 dẹp meta đè nút Đến bảng ủy thác; 37:82 wrap mô tả 2 dòng; 37:85 footer nói rõ giữ việc dở. V2 còn chuẩn hóa map jobs, tiến độ/base, thêm guard cấp và track sau claim, dẫn vùng khi chưa spawn. Không đổi giao diện 3 thẻ, phần thưởng hay dữ liệu nguồn.

**Save:** `p.v13.batch04Day={day,ids:[...]}`, và job cũ `p.v13.jobs[id]={day,state,base}` không đổi schema. Tạo shortlist mới gọi save, claim qua save gốc. Cache lỗi được dựng lại; không bỏ job active trong dữ liệu nhất quán (tối đa 3).

**Node 12/12 PASS:** ba việc theo level, ổn định qua level-up; job cũ dở qua ngày và trả carry một lần; kill baseline/sai vùng; chặn id ngoài shortlist/render J; không đổi thứ tự card khi nhận; hit pipeline thực đếm kill đúng vùng; toàn bộ 15 mô tả vừa 2 dòng.

## C4 — T57 · Nhiệm vụ riêng tông môn

**File:** `src/59_sect_tasks.js`. Giữ 2 nhiệm vụ chung `V31_TASKS` (21_v31_v30:10), hiện thêm đúng 3 của tông hiện tại theo DATA.sect (tổng 5), mỗi trang 2 thẻ, 3 trang. Không thêm task mới vào V31_TASKS để không bị legacy death hook (21:69) đếm nhầm mọi vùng. Bậc và cấp được kiểm tại handler, không chỉ khóa nút. Hunt = v12Count(region); boss = v22State().bosses[region].kills, mốc lúc nhận. Trúc Lang Vương migrate từ p.worldBossDead (14:21). Boss hit_L03 (14:44) ghi kills mới + hồi sinh worldTime+180.

**PATCH C4 — 12:** 21:45 rankLines trong v31Promote → v31Notice/v21Say và save; 21:46 kiểm tông/bậc/cấp, lưu baseline; 21:47 claim dùng tiến độ thật rồi xóa slot trước thưởng. 43_sect_ui:19 lớp cuối v42dSect bổ sung trang và điều kiện/vùng, tiến độ đúng, nút khóa, pager; thẻ 145px với khoảng cách 158px, mô tả y+66, thanh y+84 và nút y+103, pager y589–615, chú thích y626. Chỉ một nhiệm vụ đang làm, auto chuyển trang chứa nhiệm vụ vừa nhận, nút claim giữ hành vi v31ClaimTask. `v31Sync` (21:44) cập nhật merit qua contrib như cũ.

**Save:** `p.v31.task` mới dạng `{id,sect,base,count:0}`; count thực được tính lại từ bộ đếm lưu sẵn và base, không phụ thuộc count hiển thị cache. Nhiệm vụ chung vẫn `{id,count}`. Khi DATA thiếu hoặc đổi tông, tạm lưu nhiệm vụ riêng vào `p.v31.batch04SuspendedTasks` và tự phục hồi khi đúng tông/DATA, slot trống. Save từ v31Notice khi nhận, trả và tấn thăng. Không cho đổi nhiệm vụ để nhận nhiều lần khi slot đang bận.

**Node 8/8 PASS:** không tông/4 tông ×5 lựa chọn; rank & level guard; hunt đúng mốc/sai vùng/claim một lần; boss sai vùng/history; rankLines và 3 trang; hit boss thật cập nhật regional kills và 180s respawn.

## C5 — T41 · Kỳ ngộ loại story

**File:** `src/55_events.js`. Pool 24 từ DATA.events.events + 3 từ EVENT_POOL gốc (01_core:307–311), id legacy_event_1..3; mọi vùng ngoài thôn, weight 4. Khi tạo điểm (37:155), ngoài thôn vòng ['shrine','hunt','supply','story'] theo (day+i)%4, thôn không đổi. Lọc region, level, weighted RNG `random` (01:92), không lặp 6 id gần nhất. Nếu cạn pool đủ điều kiện, fallback một trong 3 loại cũ thay vì phá luật recent. Chỉ nhớ id sau khi có q hợp lệ. Refresh (37:161–176) lưu bản ghi cùng recent một lần khi có story.

`b04EventOpen` qua v8InteractAt lớp cuối (37:221), đúng điểm trong 115 px và cấp vùng, id/level/day/giờ hợp lệ. Thời điểm đêm >=19 hoặc <5; sai giờ hiện thông báo chính xác mà không hủy. Modal kind event với flag batch04Story, các lựa chọn card 778×100, nút ở (843,297+i*110,167,42); chỉ mở lựa chọn, ESC được phép rời. O hiển thị thông tin, dẫn đường, theo dõi nhưng không ghi thưởng giả. Phím 1–3 cũ vẫn qua select.

`v42wComplete(e,index)` xác nhận identity modal, record đang active/offered, ngày/level/vùng/tầm tương tác. Tung chance đúng một lần, đóng status done + count + total trước effects, giải track và save, không thưởng e.reward/xp/rep mặc định. Effect enum: mat, hurt (HP≥1), heal (cap currentStats), xp, stones, pills, favor (0..100), buff. Legacy giữ hiệu ứng gốc của 9 lựa chọn (kể cả vĩnh viễn), không cộng thêm thưởng. Scope stats trong FINAL `currentStats` 21:68 (OVERRIDES): attack/def nhân (1+value), attack đồng thời áp vào spellAtk để không bỏ sát thương kỹ năng; crit thêm vào tỉ lệ xác suất, clamp gốc .6; speed px/s và regen MP/s cộng; cùng stat lấy giá trị lớn nhất còn hạn và làm mới hạn now+seconds. Buff không bọc currentStats; hook update dọn hết hạn và save một lần khi thay đổi.

**PATCH C5 — 15:** 37:131 migrate story; 37:155–160 rotation/record; 37:161–176 save khi tạo; 37:196 nhánh completion; **40_audio:52 lớp cuối chuyển tiếp index** (ca chạy đầu phát hiện wrapper âm thanh làm rơi index); 37:221 E; 37:264 O; 47_v45_v35:1267 dispatcher event; 21:68 buff trước crit clamp/DR; 01:312 xóa openEvent, 01:321 giữ khả năng gọi kỳ ngộ trong select reward bí cảnh cũ bằng inline (hàm cũ tuy ghi là chết nhưng thực tế còn một tham chiếu), 01:315 select story theo phím cũ. Không thay event thường.

**Save:** `p.evRecent=[...]` tối đa 6, `p.evBuffs=[{stat,value,expires}]`, record `p.v42world.events[region].eventId` + kind story, dùng status/count/day cũ, lưu thêm result choice/success/details khi đã chọn. Hoàn thành story vẫn tăng tổng kỳ ngộ dùng cho C2. Không xóa các field cũ. Dữ liệu thiếu: quay 3 loại gốc, không xóa story đang lưu chỉ vì data chưa nạp.

**Node 17/17 PASS:** pool/weight/region/level; recent/fallback; rotation và migrate; ngày đêm; E thực + không thưởng mặc định; xác suất fail/hurt≥1/không nhận hai lần; toàn bộ effect và buff/stack/hết hạn; legacy; out-of-range/stale; 72 mô tả DATA vừa 3 dòng (+9 legacy); **105 nhánh commit** gồm 81 lựa chọn của 27 sự kiện và 24 nhánh fail xác suất, kiểm đóng status/total đúng một lần/HP không chết.

## Kiểm thử tích hợp và đối chiếu

- Node v24.22.3, VM classic script; Canvas thật qua @napi-rs/canvas với DOM/storage giả, ASSETS rỗng vì gói nguồn không cung cấp assets.js. Nạp theo thứ tự chính xác của index được PATCH trong bộ nhớ: 51 src gốc + 5 src mới và 7 data; stub ASSETS thay file không có. Boot gate 00 và 99 giữ nguyên thứ tự.
- PATCH được áp tuần tự trong bộ nhớ; assert mỗi old xuất hiện đúng một lần trước khi thay. Không ghi đè file gốc. Nạp file bằng vm.runInContext; API thật `start(0)`, update, draw, frameOverlay, hit, damagePlayer_L00, v21Pick, handlers nhận/trả, v42wComplete, save/resume và v42sValidate.
- 8/8 ca tích hợp: load tất cả script + đếm DATA; start/update/draw; save–resume cờ tất cả module và đổi owner; thiếu 5 DATA namespace đúng 5 warning và giữ hệ cũ; 5 DATA hỏng đúng 5 warning và giữ hệ cũ; sparse arrays 5 namespace đúng 5 warning; 600 update với draw xen kẽ và mở/đóng settings; không có exception bị bắt bởi FRAME_HOOKS.
- Dựng và xem 6 màn Canvas 1280×720: Settings, Thành tựu, J ủy thác, N tông môn, story modal và tutorial. Lần đầu phát hiện meta J đè nút, mô tả dài bị cắt, pager N sát footer; đã chỉnh và render lại. Đây là kiểm layout/fallback với font DejaVu tương thích, không tuyên bố đã kiểm art asset, GPU, tương tác chuột hoặc kích thước cửa sổ trong Chromium.
- Lượt đầu C5 có 3 fail do wrapper âm thanh không chuyển index; thêm PATCH chính xác lớp 40, chạy lại toàn bộ. Ở v2 phát hiện thêm lỗi epsilon 4s tại biên frame và số tiến độ N bị nút che; sửa, render và chạy lại. Lượt cuối: **76/76**, không còn fail, không hook exception.
- Kiểm giao nộp sạch: giải nén snapshot gốc và ZIP v2 vào thư mục tạm mới, trích runner từ chính báo cáo trong ZIP, chạy lại không dùng các file làm việc cũ. Kết quả **76/76 PASS**, khớp toàn bộ nhóm; ZIP đúng 7 entry, kiểm CRC không lỗi.

Output tổng hợp từ runner:

```text
SUMMARY {"integration":{"pass":8,"total":8},"C1":{"pass":23,"total":23},"C2":{"pass":8,"total":8},"C3":{"pass":12,"total":12},"C4":{"pass":8,"total":8},"C5":{"pass":17,"total":17}}
```


### Kết quả từng ca — v2.0

| Nhóm | Ca kiểm tra | Kết quả |
|---|---|---|
| integration | load all scripts / valid data | PASS |
| integration | real start update draw | PASS |
| C1 | old save baseline and toggle | PASS |
| C1 | 18 valid triggers mapped uniquely | PASS |
| C1 | HP strict threshold | PASS |
| C1 | loot successful handler and full bag | PASS |
| C1 | actual v21Pick gear / coin / full bag | PASS |
| C1 | material vs consume/elixir | PASS |
| C1 | forge/bag/sect/pet boundaries | PASS |
| C1 | death through real damage handler | PASS |
| C1 | night exact boundaries | PASS |
| C1 | priority FIFO and interruption / 8s delay | PASS |
| C1 | setting render | PASS |
| C1 | NPC and gate actual town coordinates and ranges | PASS |
| C1 | enemy 300 / boss 650 and safe town exclusion | PASS |
| C1 | skill points and breakthrough real predicate | PASS |
| C1 | daily point in explored region / discovery edge | PASS |
| C1 | idle 60, modal freeze and movement reset | PASS |
| C1 | actual night transition, not retro on new owner | PASS |
| C1 | HUD overlap / telegraph / modal safety | PASS |
| C1 | all hint strings fit in <=3 lines at 12px | PASS |
| C2 | 36 entries, six pages | PASS |
| C2 | legacy claim old flag and idempotence | PASS |
| C2 | new claim only new flag and idempotence | PASS |
| C2 | all 14 actual counters | PASS |
| C2 | title cannot choose before claim / toggle and render | PASS |
| C2 | all pages render | PASS |
| C3 | three eligible stable across refresh and level up | PASS |
| C3 | migration active job and carry exactly once across day | PASS |
| C3 | kill baseline and wrong region | PASS |
| C3 | reject unauthorized id and render J | PASS |
| C3 | accept preserves exact card order / no accidental reshuffle | PASS |
| C3 | real hit pipeline counts ordinary region kill | PASS |
| C3 | all 15 job descriptions fit two rows | PASS |
| C4 | no sect / four sets of five unique tasks | PASS |
| C4 | rank and level guards at handler | PASS |
| C4 | hunt baseline and one payout | PASS |
| C4 | boss count from regional baseline not historic or wrong boss | PASS |
| C4 | rank line / all 3 pages render | PASS |
| C4 | real boss hit increments regional kills and respawn timer | PASS |
| C5 | weighted pool region/minlevel/recent | PASS |
| C5 | six recent and no-repeat fallback | PASS |
| C5 | story rotation and migrant | PASS |
| C5 | day / night boundary and wrong time | PASS |
| C5 | real E interaction / definite effect and no default reward | PASS |
| C5 | choice failure once / HP floor | PASS |
| C5 | all effect types, max stack, expiry in stats | PASS |
| C5 | legacy story effects / no extra rewards | PASS |
| C5 | stale identity and out of range rejected | PASS |
| C5 | all 72 data option desc fit three lines | PASS |
| C5 | all 81 choices and every chance failure branch through complete | PASS |
| integration | save/resume preserves all durable flags and no queued UI from old owner | PASS |
| integration | all five DATA absent fallback boot/old gameplay | PASS |
| integration | all five DATA malformed warn once and fallback | PASS |
| integration | 600 real updates with intermittent draws / no hook exceptions | PASS |
| C1 | simulation without rendering never claims seen | PASS |
| C1 | deferred render blocks on current frame / drawer / hidden tab / warmup | PASS |
| C1 | death while still in town clears old queue and signals | PASS |
| C2 | malformed nonfinite progress cannot mint reward | PASS |
| C2 | truthy corrupt claim cannot unlock title | PASS |
| C3 | corrupt baseline does not count prior kills or emit NaN | PASS |
| C3 | cached offered above level cannot bypass gating | PASS |
| C3 | report keeps a different tracked active job | PASS |
| C3 | offered kill shows 0 even after unrelated historical kills | PASS |
| C4 | common task corrupted count cannot mint reward | PASS |
| C4 | missing data parks active task / legacy still works / restore | PASS |
| C5 | wrong region and stale POI reject even at identical coordinates | PASS |
| C5 | stale day commit closes modal without a reward | PASS |
| C5 | persist outcome / duplicate blocked after resume | PASS |
| C5 | malformed endless buff does not affect currentStats | PASS |
| C5 | outcome reflects actual XP cap and ignores invalid prior buff | PASS |
| C5 | generated world point through nearest E and original numeric choice | PASS |
| C3 | daily selection stress up to 45 levels and 100 game days | PASS |
| C1 | four second painted lifetime and exactly once | PASS |
| integration | sparse DATA arrays disable all five modules gracefully | PASS |
| integration | no trapped hook errors | PASS |

### Trình tự ghép cho Claude

1. Chép đúng 5 file src mới vào repo. Đọc JSON và áp từ đầu đến cuối; tránh áp fuzzy, tránh replace toàn cục. Nếu old không duy nhất so snapshot đã giao, dừng riêng patch đó và đối chiếu lớp cuối.
2. PATCH index thêm nạp các file DATA đã duyệt đang có (snapshot chỉ có data/00_init và world_map). Kiểm không nạp trùng namespace nếu repo mới đã thêm data. Claude thêm script src/55,56,57,58,59 theo đúng thứ tự sau 53_render_scale, trước 99_boot_ready; 99 phải cuối.
3. Chạy `node --check` 5 file; chạy test_suite gốc sau ghép và browser Chromium thật. Test old save→new save→reload; dữ liệu thiếu/hỏng; giữ thành tựu 6 cũ và 3 kỳ ngộ cũ.
4. Nối `playerTitle()` dưới tên HUD/C đúng T10, nếu chưa có; không thêm logic claim ở HUD. Giữ dữ liệu gốc; không chỉnh cân bằng ngoài phạm vi patch.

## Rủi ro / chỗ chưa chắc (Claude cần kiểm trên trình duyệt)

1. **C1 T33:** spec yêu cầu hoãn tuyệt đối khi có boss card, trong khi v34Target tự chọn boss trong 650px. Trigger vẫn được ghi đúng ≤650; chỉ giữ pending trong phạm vi tracking 720px lúc rút lui và card đã hết; không hiện sai ngữ cảnh sau khi boss chết. Cần play-test thực lúc rút lui cũng như lúc cả hai vị trí bị chiếm bởi hero/HUD đã sửa F2. Hints có thể hoãn lâu nếu người chơi đứng giữa màn hình và alt bị target/toast chặn; ưu tiên không che combat.
2. **C1:** kiểm ảnh thật T33/T12, HUD custom scale, photo/transition/nội thất, DPI2; Node chỉ kiểm rect và render thẻ, không phải kiểm chuyển cảnh thực với assets.
3. **C3:** save thông thường có tối đa 3 active; save tùy tay hỏng có >3 việc active không có trong luồng hợp lệ. Không tự hủy các bản ghi này, Claude cân nhắc cảnh báo/repair riêng nếu cần. Việc cũ đã active không bị cấp hiện tại khóa sau khi load.
4. **C4:** kiểm từ tông khác không nhận id tông mình không thuộc, quay lại trang active, boss hồi sinh sau 180 giây thực tế. Count riêng là derived từ mốc, không phụ thuộc cache count=0; nếu sau này cần HUD theo dõi tông môn thì gọi b04SectProgress.
5. **C5:** kiểm spawn đủ chỗ trên bản đồ asset thật; no-repeat giữ được nếu pool cạn bằng fallback loại gốc. Giờ kiểm ở mở lẫn chọn. Khả năng tương tác lịch sử reward bí cảnh vẫn có tham chiếu openEvent trong select, đã inline để không làm hỏng luồng cũ; Claude quyết định xóa cả nhánh nếu xác nhận thật sự unreachable. Kiểm crit theo điểm xác suất và attack buff áp cả spellAtk có đúng cân bằng mong muốn. Kiểm khi mất quyền lưu localStorage: game vẫn dùng save handler hiện hữu; không thể bảo đảm durability nếu môi trường từ chối ghi.
6. Không claim DONE, không cam kết Chromium hoặc test_suite repo đã chạy: snapshot thiếu assets.js và task giao Claude nghiệm thu browser. Mọi thay đổi là nháp REVIEW.

## CHAT (dán vào ops/CHAT.md)

[2026-11-21] ChatGPT → @Claude (T61/T52/T58/T57/T41 — GÓI 04): Bản v2.0 thay v1.0: đã nộp trọn 5 module classic JS + 50 PATCH, không sửa src gốc. Node full snapshot 76/76 PASS; có 105 nhánh lựa chọn kỳ ngộ, real hit/loot, save/resume, missing/malformed DATA. T41 lưu ý lớp âm thanh src/40:52 cần chuyển tiếp index, đã có PATCH. Snapshot index chưa nạp 5 DATA mới, PATCH đầu nạp chúng trước module. Nhờ ghép trước 99, chạy test_suite + Chromium, kiểm T33/F2/resize và nối playerTitle() vào C/HUD.

## HANDOFF (dán vào ops/HANDOFF.md)

### [2026-11-21] GÓI 04 — ChatGPT → Claude

**Đã làm:** C1 T61 18 trigger/queue/settings; C2 T52 30+6 thành tựu/danh hiệu; C3 T58 12+3 ủy thác chọn 3/ngày, giữ active; C4 T57 12 nhiệm vụ riêng/2 chung/rankLines/baseline; C5 T41 24+3 sự kiện story/weighted/no-repeat/modal/effects/buff. QA Node 76/76 (tăng 20 ca), 6 màn Canvas xem nội bộ; runner tái lập đính trong báo cáo.

**File mới:** src/55_events.js, src/56_tutorial.js, src/57_milestones.js, src/58_jobs.js, src/59_sect_tasks.js; ops/patches/BATCH_04.json (50 patch theo thứ tự); BATCH_04_REPORT.md.

**Chưa làm / không chắc:** tích hợp repo thật, test_suite, Chromium, assets, DPI/resize/F2/T33, render danh hiệu trên HUD/C; mục rủi ro ở trên. Không sửa trực tiếp source hay data cũ.

**Cần chủ dự án quyết định:** không có blocker để ghép. Claude xác minh legacy select bí cảnh trước khi loại cả nhánh, và cân bằng attack/crit buff nếu cần.

**Việc tiếp theo:** Claude áp patches, nạp module trước 99, chạy test_suite + Chromium, chỉnh nếu cần; cập nhật TASKS sau nghiệm thu.

### TASKS

Đề nghị T61, T52, T58, T57, T41 → **REVIEW** (chưa DONE).


## Phụ lục — runner Node tái lập (76 ca)

Không thêm file thứ 8 vào ZIP. Trích nguyên khối code dưới đây thành `batch04_qa.cjs` ở thư mục cha của `batch04_work/`. Giải nén snapshot `GOI_04_ChatGPT.zip` vào `batch04_work/`, sau đó giải nén ZIP v2 vào chính thư mục đó (chỉ 7 mục mới). Không áp PATCH trực tiếp trước khi chạy runner: runner tự áp trong bộ nhớ. Cần Node 24 và package `@napi-rs/canvas` (đã có trong môi trường test), font DejaVu là tùy chọn nền tảng. Lệnh `node batch04_qa.cjs` chạy toàn bộ; `B04_CAPTURE=1 node batch04_qa.cjs` thêm 6 ảnh Canvas QA để đối chiếu. Kết quả được xuất ra `batch04_qa_results.json`. VM không thay cho test_suite/Chromium với assets thật.

```javascript
const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),{createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const root='batch04_work/',patches=JSON.parse(fs.readFileSync(root+'ops/patches/BATCH_04.json'));
const overrides=new Map();
for(const q of patches){const s=overrides.get(q.file)??fs.readFileSync(root+q.file,'utf8');assert.equal(s.split(q.old).length-1,1,q.file);overrides.set(q.file,s.replace(q.old,()=>q.new));}
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf','V18Serif');GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','V45Sans');
const errors=[],warns=[],result=[];
function boot(missing=[],broken=false,mutation=''){
 const canvas=(w=1280,h=720)=>{const c=createCanvas(w,h);c.style={};c.addEventListener=()=>{};c.getBoundingClientRect=()=>({left:0,top:0,width:w,height:h});return c;};
 const cv=canvas(),input={style:{},value:'QA',addEventListener(){},blur(){},focus(){},classList:{add(){},remove(){}}};
 const mem=new Map(),localStorage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v),removeItem:k=>mem.delete(k)};
 const doc={hidden:false,body:{appendChild(){},removeChild(){},style:{}},getElementById:id=>id==='game'?cv:input,addEventListener(){},createElement:t=>t==='canvas'?canvas(1,1):{style:{},addEventListener(){},click(){},remove(){},appendChild(){}}};
 const sandbox={console:{...console,error:(...a)=>errors.push(a.map(String).join(' ')),warn:(...a)=>warns.push(a.map(String).join(' '))},document:doc,localStorage,Image:class{constructor(){this.width=0;this.height=0;this.complete=false;}set src(v){this._src=v;}},performance,Date,Math,requestAnimationFrame(){return 1;},cancelAnimationFrame(){},addEventListener(){},setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},clearInterval(){},devicePixelRatio:1,innerWidth:1280,innerHeight:720,navigator:{},URL,Blob,ASSETS:{}};
 sandbox.window=sandbox;sandbox.self=sandbox;const ctx=vm.createContext(sandbox);const ev=(s,file='qa')=>vm.runInContext(s,ctx,{filename:file,timeout:20000});
 const html=overrides.get('index.html'),scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
 scripts.splice(scripts.indexOf('src/99_boot_ready.js'),0,...['55_events','56_tutorial','57_milestones','58_jobs','59_sect_tasks'].map(f=>'src/'+f+'.js'));
 for(const f of scripts){if(f==='assets.js'||missing.includes(f))continue;try{if(f==='src/55_events.js'){if(broken)ev("for(const k of ['events','tutorial','milestones','jobs','sect'])DATA[k]={broken:true}");if(mutation)ev(mutation);}ev(overrides.get(f)??fs.readFileSync(root+f,'utf8'),f);}catch(e){console.error('BOOT',f,e);throw e;}}
 return {ev,cv,mem,scripts};
}
const {ev,cv,scripts}=boot();
function run(group,name,expr){try{const v=typeof expr==='function'?expr():ev(expr);assert.ok(v===true||v?.ok===true,JSON.stringify(v));result.push({group,name,pass:true});console.log('PASS',group,name);}catch(e){result.push({group,name,pass:false,error:String(e)});console.error('FAIL',group,name,String(e));}}
const start="start(0);modal=null;V41Presentation.transition=0;worldTitle=0;notifyT=0;v21NoticeT=0;v17Drawer=false;document.hidden=false;V42_PERF.warm.active=false;V35.rects={identity:{x:10,y:10,w:200,h:100}};b04TutorialTick(0);";
run('integration','load all scripts / valid data',()=>({ok:ev('B04_HINTS.length===18&&B04_MS_LIST.length===30&&B04_JOBS.length===12&&Object.keys(B04_SECTS||{}).length===4&&B04_EVENTS.length===27'),scripts:scripts.length,warns}));
run('integration','real start update draw',`(()=>{${start}update(1/60);rsPrepare();draw();frameOverlay();return {ok:mode==='play'&&p.level===1,errors:0}})()`);
run('C1','old save baseline and toggle',`(()=>{${start}delete p.tutorial;b04TutorialReset();const s=b04TutorialState();const n=Object.keys(s.seen).length===0&&!s.off;return n&&b04TutorialToggle()&&s.off&&b04TutorialToggle()&&!s.off;})()`);
run('C1','18 valid triggers mapped uniquely',`B04_HINT_TRIGGERS.every(k=>B04_HINTS.filter(h=>h.trigger===k).length===1)`);
run('C1','HP strict threshold',`(()=>{${start}p.hp=currentStats().hp*.35;const a=!b04TutorialConditions().lowHp;p.hp-=.001;return a&&b04TutorialConditions().lowHp})()`);
run('C1','loot successful handler and full bag',`(()=>{${start}const a=B04_TUT;a.signals.clear();const id=p.gear[0].id;addGear(id,0);const hit=a.signals.has('firstLoot');a.signals.clear();while(p.gear.length<48)p.gear.push({...p.gear[0]});addGear(id,0);return hit&&!a.signals.has('firstLoot')})()`);
run('C1','actual v21Pick gear / coin / full bag',`(()=>{${start}const a=B04_TUT;a.signals.clear();const loot=v21MakeLoot('gear',p.x,p.y,{id:p.gear[0].id,quality:0,up:0});const hit=v21Pick(loot)&&a.signals.has('firstLoot');a.signals.clear();const coin=v21MakeLoot('stone',p.x,p.y,null,2);const no=v21Pick(coin)&&!a.signals.has('firstLoot');while(p.gear.length<48)p.gear.push({...p.gear[0]});const l=v21MakeLoot('gear',p.x,p.y,{id:p.gear[0].id,quality:0,up:0});return hit&&no&&!v21Pick(l)&&!a.signals.has('firstLoot')&&v21State().loot.includes(l)})()`);
run('C1','material vs consume/elixir',`(()=>{${start}const a=B04_TUT;a.signals.clear();v13Adjust('herb',1);const hit=a.signals.has('firstMaterial');a.signals.clear();v13Adjust('herb',-1);v13Adjust('elixir',1);return hit&&!a.signals.has('firstMaterial')})()`);
run('C1','forge/bag/sect/pet boundaries',`(()=>{${start}p.level=1;p.stones=19;p.gear=p.gear.map(x=>({...x,up:0}));const a=b04TutorialConditions();p.stones=20;p.level=5;while(p.gear.length<44)p.gear.push({...p.gear[0]});const b=b04TutorialConditions();p.gear[0].up=1;return !a.forgeReady&&!a.petReady&&!a.bagFull&&b.forgeReady&&b.petReady&&b.sectReady&&b.bagFull&&!b04TutorialConditions().forgeReady})()`);
run('C1','death through real damage handler',`(()=>{${start}p.hp=1;p.hurt=0;p.dashT=0;damagePlayer_L00(100000);return B04_TUT.death&&p.hp>0&&p.mapId==='thon'})()`);
run('C1','night exact boundaries',`(()=>{${start}p.worldTime=75;const a=!b04TutorialNight();p.worldTime=285;const b=b04TutorialNight();p.worldTime=74.9;return a&&b&&b04TutorialNight()})()`);
run('C1','priority FIFO and interruption / 8s delay',`(()=>{${start}const a=B04_TUT;a.queue=[];a.active=null;a.wait=0;p.stones=0;V47T.x=100;V47T.y=650;V47T.cam={x:0,y:0};p.level=1;b04TutorialEnqueue('firstMaterial',false);b04TutorialEnqueue('firstDeath',false);b04TutorialEnqueue('firstNight',false);b04TutorialTick(.01);let h=a.active?.h.trigger;if(h!=='firstDeath')return {ok:false,h,queue:a.queue.map(x=>x.h.trigger)};b04TutorialTick(.5);modal={kind:'settings'};b04TutorialTick(.1);const interrupted=!a.active&&!p.tutorial.seen.h10&&a.wait===8;modal=null;b04TutorialTick(7.9);const delay=!a.active;b04TutorialTick(.11);const retry=a.active?.h.trigger==='firstDeath';for(let i=0;i<63;i++){b04TutorialTick(1/60);frameOverlay();}const seen=p.tutorial.seen.h10;modal={kind:'settings'};b04TutorialTick(.1);return {ok:interrupted&&delay&&retry&&seen&&!a.queue.some(x=>x.h.id==='h10'),interrupted,delay,retry,seen}})()`);
run('C1','setting render',`(()=>{${start}modal={kind:'settings',accessTab:0};buttons=[];panel();return buttons.some(b=>b.v33==='accessTutorial'||b.id==='accessTutorial')||buttons.some(b=>b.y===600&&b.w===113)})()`);
run('C1','NPC and gate actual town coordinates and ranges',`(()=>{${start}const n=V471_NODES.find(n=>n.id==='inn'),gt=V47T_MAP.gates[0];V47T.x=n.x;V47T.y=n.y;const a=b04TutorialConditions().nearNpc;V47T.x=gt.x;V47T.y=gt.y;const b=b04TutorialConditions().nearGate;V47T.x=gt.x-gt.r-41;return a&&b&&!b04TutorialConditions().nearGate})()`);
run('C1','enemy 300 / boss 650 and safe town exclusion',`(()=>{${start}owEnter('truc');V41Presentation.transition=0;worldTitle=0;enemies=[{type:0,x:p.x+300,y:p.y,dead:false,state:'patrol'},{type:3,x:p.x+650,y:p.y,dead:false,state:'patrol'}];const a=b04TutorialConditions();enemies[0].x+=.1;enemies[1].x+=.1;const b=b04TutorialConditions();p.mapId='thon';const c=b04TutorialConditions();return a.firstEnemyNear&&a.firstBossNear&&!b.firstEnemyNear&&!b.firstBossNear&&!c.firstEnemyNear&&!c.firstBossNear})()`);
run('C1','skill points and breakthrough real predicate',`(()=>{${start}p.level=2;const a=b04TutorialConditions().skillPoint;p.level=9;p.xp=xpNeed()-1;const b=!b04TutorialConditions().breakReady;p.xp++;return a&&b&&b04TutorialConditions().breakReady})()`);
run('C1','daily point in explored region / discovery edge',`(()=>{${start}owEnter('truc');worldTitle=0;V41Presentation.transition=0;B04_TUT.regions=new Set(['thon']);p.discovered=['thon','truc'];V42_WORLD.pois=[{id:'v42_event_truc',region:'truc',kind:'v42event',x:p.x,y:p.y}];v42wState().events.truc={status:'offered'};const a=b04TutorialConditions().firstKyNgo;b04TutorialTick(.016);const b=B04_TUT.queue.some(x=>x.h.trigger==='newRegion')||B04_TUT.active?.h.trigger==='newRegion';v42wState().events.truc.status='done';return a&&b&&!b04TutorialConditions().firstKyNgo})()`);
run('C1','idle 60, modal freeze and movement reset',`(()=>{${start}owEnter('truc');enemies=[];worldTitle=0;V41Presentation.transition=0;B04_TUT.scope=b04TutorialScope();B04_TUT.x=p.x;B04_TUT.y=p.y;B04_TUT.idle=59.9;b04TutorialTick(.09);const a=!b04TutorialConditions().idle60;modal={kind:'settings'};b04TutorialTick(1);const b=!b04TutorialConditions().idle60;modal=null;b04TutorialTick(.02);const c=b04TutorialConditions().idle60;p.x+=1;b04TutorialTick(.01);return a&&b&&c&&!b04TutorialConditions().idle60})()`);
run('C1','actual night transition, not retro on new owner',`(()=>{${start}p.worldTime=284;b04TutorialReset();p.worldTime=285;b04TutorialTick(.02);const a=B04_TUT.queue.some(x=>x.h.trigger==='firstNight')||B04_TUT.active?.h.trigger==='firstNight';b04TutorialReset();b04TutorialTick(.02);return a&&!B04_TUT.queue.some(x=>x.h.trigger==='firstNight')&&B04_TUT.active?.h.trigger!=='firstNight'})()`);
run('C1','HUD overlap / telegraph / modal safety',`(()=>{${start}V47T.x=100;V47T.y=650;V47T.cam={x:0,y:0};const r={x:430,y:350,w:420,h:82};const a=b04TutorialSafe(r);V35.rects.identity={x:450,y:370,w:200,h:100};const b=!b04TutorialSafe(r);V35.rects.identity={x:10,y:10,w:200,h:100};modal={kind:'settings'};return a&&b&&!b04TutorialSafe(r)})()`);
run('C1','all hint strings fit in <=3 lines at 12px',`B04_HINTS.every(h=>v45WrapLines(h.text,362,12,10).length<=3)`);
run('C2','36 entries, six pages',`(()=>{${start}return V42_MILESTONES.length===36&&b04MilestoneRows().length===6&&new Set(V42_MILESTONES.map(x=>x.id)).size===36})()`);
run('C2','legacy claim old flag and idempotence',`(()=>{${start}const s=v42wState();s.stones={thon:true};const b=p.stones;return v42wRewardMilestone('walk1')&&!v42wRewardMilestone('walk1')&&s.milestones.walk1&&p.stones===b+8})()`);
run('C2','new claim only new flag and idempotence',`(()=>{${start}const s=v42wState();p.level=5;const b=p.stones;return v42wRewardMilestone('lv5')&&!v42wRewardMilestone('lv5')&&p.msClaimed.lv5&&!s.milestones.lv5&&p.stones===b+12})()`);
run('C2','all 14 actual counters',`(()=>{${start}const s=v42wState();p.level=19;p.discovered=['thon','truc','yeu'];p.claimed={trucaltar:true,yuealtar:true,inn:true,snowaltar:false};p.kills=57;p.worldBossDead=true;v22State().bosses={truc:{kills:1},yeu:{kills:2}};s.total=4;s.stones={thon:true,truc:true};p.v14.sect='cloud';v31State().rank=2;p.stones=80;p.v12Main=4;v31State().pets={wolf:{}};p.relics=['a','b'];p.gear[0].up=3;p.techs=['a','b','c'];return JSON.stringify(Object.values(B04_MS_COUNTS).map(f=>f(s)))===JSON.stringify([19,3,2,57,2,4,2,2,80,4,1,2,3,3])})()`);
run('C2','title cannot choose before claim / toggle and render',`(()=>{${start}const d=B04_MS_LIST.find(x=>x.title);const no=!b04SelectTitle(d.id);b04MilestoneClaimMap(d)[d.id]=true;const yes=b04SelectTitle(d.id)&&playerTitle()===d.title;modal={kind:'v42world'};B04_MS_VIEW.owner=p;B04_MS_VIEW.page=Math.floor(V42_MILESTONES.indexOf(d)/6);buttons=[];v42wMilestonePanel();const a=buttons.length>0;return no&&yes&&a&&b04SelectTitle(d.id)&&playerTitle()===''})()`);
run('C2','all pages render',`(()=>{${start}modal={kind:'v42world'};B04_MS_VIEW.owner=p;for(let i=0;i<6;i++){B04_MS_VIEW.page=i;buttons=[];v42wMilestonePanel();if(b04MilestoneRows().length!==6)return false;}return true})()`);
run('C3','three eligible stable across refresh and level up',`(()=>{${start}p.worldTime=0;p.level=1;const a=b04JobsToday();p.level=45;const b=b04JobsToday();return a.length===3&&a.every(d=>(d.minLevel||1)<=1)&&a.map(d=>d.id).join()===b.map(d=>d.id).join()})()`);
run('C3','migration active job and carry exactly once across day',`(()=>{${start}const o=OW_POI.find(x=>x.id==='v13_board');p.x=o.x;p.y=o.y;p.worldTime=1;const s=v13Init();s.jobs.gather={day:0,state:'active',base:0};s.bag.herb=4;p.worldTime=365;const b=p.stones,has=b04JobsToday().some(d=>d.id==='gather');const a=v13JobAction('gather'),again=v13JobAction('gather');return has&&a&&!again&&p.stones===b+14&&s.bag.herb===0&&s.jobs.gather.day===1})()`);
run('C3','kill baseline and wrong region',`(()=>{${start}const o=OW_POI.find(x=>x.id==='v13_board');p.x=o.x;p.y=o.y;p.level=10;p.worldTime=2;const s=v13Init();s.batch04Day={day:0,ids:['j04','gather','ore']};p.v12Kills={truc:9};const a=v13JobAction('j04'),d=b04JobsToday().find(x=>x.id==='j04');p.v12Kills.yeu=30;const zero=v13JobProgress(d)===0&&!v13JobAction('j04');p.v12Kills.truc+=5;const b=p.stones;return a&&zero&&v13JobAction('j04')&&!v13JobAction('j04')&&p.stones===b+24})()`);
run('C3','reject unauthorized id and render J',`(()=>{${start}p.level=1;const o=OW_POI.find(x=>x.id==='v13_board');p.x=o.x;p.y=o.y;const no=!v13JobAction('j12');modal={kind:'life13',tab:4};buttons=[];panel();return no&&buttons.length>0})()`);
run('C3','accept preserves exact card order / no accidental reshuffle',`(()=>{${start}p.level=10;const o=OW_POI.find(x=>x.id==='v13_board');p.x=o.x;p.y=o.y;const set=b04JobsToday(),before=set.map(d=>d.id).join();return v13JobAction(set[2].id)&&b04JobsToday().map(d=>d.id).join()===before})()`);
run('C3','real hit pipeline counts ordinary region kill',`(()=>{${start}owEnter('truc');let e=enemies.find(e=>!e.dead&&!bossType(e.type)&&e.region==='truc');if(!e)return false;const n=v12Count('truc');hit(e,1e6,false);return e.dead&&v12Count('truc')===n+1})()`);
run('C3','all 15 job descriptions fit two rows',`[...V13_JOBS,...B04_JOBS].every(d=>v45WrapLines(d.desc,470,13,10).length<=2)`);
run('C4','no sect / four sets of five unique tasks',`(()=>{${start}const a=!v31AcceptTask('hunt');for(const k of Object.keys(B04_SECTS)){p.v14.sect=k;const d=b04SectTasks();if(d.length!==5||d.slice(2).some(x=>x.sect!==k))return false;}return a})()`);
run('C4','rank and level guards at handler',`(()=>{${start}p.v14.sect='cloud';p.level=45;const s=v31State();s.rank=1;const a=!v31AcceptTask('cloud_t2');s.rank=2;p.level=1;const b=!v31AcceptTask('cloud_t2');p.level=45;return a&&b&&v31AcceptTask('cloud_t2')&&!v31AcceptTask('hunt')})()`);
run('C4','hunt baseline and one payout',`(()=>{${start}p.v14.sect='cloud';p.level=10;p.v12Kills={truc:14,yeu:3};const b=p.stones,c=p.v14.contrib;const a=v31AcceptTask('cloud_t1');p.v12Kills.yeu=30;const no=!v31ClaimTask();p.v12Kills.truc+=8;return a&&no&&v31ClaimTask()&&!v31ClaimTask()&&p.stones===b+30&&p.v14.contrib===c+12})()`);
run('C4','boss count from regional baseline not historic or wrong boss',`(()=>{${start}p.v14.sect='cloud';p.level=45;const s=v31State();s.rank=2;v22State().bosses={yeu:{kills:4,ready:100},truc:{kills:5,ready:100}};const a=v31AcceptTask('cloud_t2');v22State().bosses.truc.kills++;const no=!v31ClaimTask();v22State().bosses.yeu.kills++;return a&&no&&v31ClaimTask()&&!v31ClaimTask()})()`);
run('C4','rank line / all 3 pages render',`(()=>{${start}p.v14.sect='cloud';p.level=45;const s=v31State();s.merit=1000;const a=v31Promote()&&V31.note.includes(DATA.sect.sects.cloud.rankLines[1]);modal={kind:'v31dao'};V31.tab=0;b04SectPage();for(let i=0;i<3;i++){B04_SECT_VIEW.page=i;buttons=[];panel();if(!buttons.length)return false;}return a})()`);
run('C4','real boss hit increments regional kills and respawn timer',`(()=>{${start}owEnter('truc');let e=enemies.find(e=>!e.dead&&bossType(e.type)&&e.region==='truc');if(!e)return false;const n=v22State().bosses.truc?.kills||0;hit(e,1e7,false);const b=v22State().bosses.truc;return e.dead&&b.kills===n+1&&Math.abs(b.ready-p.worldTime-180)<.01})()`);
const story=`owEnter('truc');V47T.active=false;worldTitle=0;V41Presentation.transition=0;p.mapId='truc';p.x=REG.truc.x;p.y=REG.truc.y;p.worldTime=150;const d=b04EventDef('e01'),e={region:'truc',day:v42wDay(),kind:'story',eventId:d.id,name:d.title,goal:1,count:0,attempts:0,status:'offered',expires:0,x:p.x,y:p.y,reward:999,xp:999};v42wState().events.truc=e;V42_WORLD.pois=[{id:'v42_event_truc',kind:'v42event',region:'truc',x:p.x,y:p.y}];p.level=10;`;
run('C5','weighted pool region/minlevel/recent',`(()=>{${start}p.level=1;p.evRecent=[];const a=b04EventChoose('truc');if(!a||a.when.minLevel>1||!a.when.regions.includes('truc'))return false;b04EventRemember(a.id);for(let i=0;i<20;i++){const d=b04EventChoose('truc');if(d?.id===a.id)return false;}return !b04EventChoose('thon')&&B04_EVENTS.filter(d=>d.id.startsWith('legacy')).length===3})()`);
run('C5','six recent and no-repeat fallback',`(()=>{${start}p.level=45;const candidates=B04_EVENTS.filter(d=>d.when.regions.includes('truc'));p.evRecent=candidates.slice(0,6).map(d=>d.id);const a=b04EventChoose('truc');if(a&&p.evRecent.includes(a.id))return false;for(let i=0;i<9;i++)b04EventRemember('x'+i);return p.evRecent.length===6&&p.evRecent[0]==='x3'})()`);
run('C5','story rotation and migrant',`(()=>{${start}p.level=45;p.evRecent=[];const day=(3-V22_REG.truc.i+4)%4,e=v42wGenerate('truc',day);if(!e)return {ok:false,reason:'no point'};v42wState().events.truc=e;v42wMigrate();return {ok:e.kind==='story'&&!!e.eventId&&v42wState().events.truc===e,kind:e.kind,id:e.eventId}})()`);
run('C5','day / night boundary and wrong time',`(()=>{${start}${story}const night=B04_EVENTS.find(x=>x.when.night===true);e.eventId=night.id;const a=!b04EventTime(night);p.worldTime=285;return a&&b04EventTime(night)})()`);
run('C5','real E interaction / definite effect and no default reward',`(()=>{${start}${story}const s=v42wState(),total=s.total,stones=p.stones,herb=v13Inventory('herb');const a=v8InteractAt(V42_WORLD.pois[0]);const open=modal?.batch04Story===true;buttons=[];panel();const got=v42wComplete(e,2),again=!v42wComplete(e,2);return {ok:a&&open&&got&&again&&s.total===total+1&&p.stones===stones&&v13Inventory('herb')===herb&&e.status==='done',a,open,got,again,total:s.total}})()`);
run('C5','choice failure once / HP floor',`(()=>{${start}${story}p.hp=3;rng=2147483647;while(((Math.imul(rng,1664525)+1013904223)>>>0)/4294967296<.75)rng++;const a=b04EventOpen(e),b=v42wComplete(e,0);return a&&b&&p.hp===1&&e.status==='done'&&!v42wComplete(e,0)})()`);
run('C5','all effect types, max stack, expiry in stats',`(()=>{${start}const orig=currentStats(),s=p.stones,q=p.pills,m=v13Inventory('wood');p.hp=1;b04EventEffects([{type:'stones',value:4},{type:'pills',value:2},{type:'mat',item:'wood',value:3},{type:'heal',value:9},{type:'favor',npc:'sentry',value:5},{type:'buff',stat:'attack',value:.1,seconds:60},{type:'buff',stat:'def',value:.2,seconds:60},{type:'buff',stat:'crit',value:.05,seconds:60},{type:'buff',stat:'speed',value:20,seconds:60},{type:'buff',stat:'regen',value:2,seconds:60}]);const b=currentStats();b04EventBuff({stat:'attack',value:.05,seconds:90});const c=currentStats();p.worldTime+=91;b04EventPrune();const d=currentStats();return Math.abs(b.attack-orig.attack*1.1)<1e-8&&Math.abs(b.def-orig.def*1.2)<1e-8&&Math.abs(b.crit-orig.crit-.05)<1e-8&&b.speed===orig.speed+20&&b.regen===orig.regen+2&&b.attack===c.attack&&d.attack===orig.attack&&p.evBuffs.length===0&&p.stones===s+4&&p.pills===q+2&&v13Inventory('wood')===m+3&&p.hp===10&&p.v8Relations.sentry===5})()`);
run('C5','legacy story effects / no extra rewards',`(()=>{${start}${story}e.eventId='legacy_event_3';const b=p.stones;return b04EventOpen(e)&&v42wComplete(e,2)&&p.stones===b+10})()`);
run('C5','stale identity and out of range rejected',`(()=>{${start}${story}const a=b04EventOpen(e);p.x+=1000;const b=!v42wComplete(e,1);return a&&b&&e.status==='offered'})()`);
run('C5','all 72 data option desc fit three lines',`B04_EVENTS.every(d=>v45WrapLines(d.desc,770,15,10).length<=3&&d.options.every(o=>v45WrapLines(o.desc,545,13,10).length<=3))`);
run('C5','all 81 choices and every chance failure branch through complete',`(()=>{${start}p.level=45;let tested=0,expected=0;for(const d of B04_EVENTS){for(let idx=0;idx<3;idx++){const opt=d.options[idx];for(const outcome of opt.chance>0&&opt.chance<1?[true,false]:[opt.chance===1]){expected++;const region=d.when.regions[0];p.mapId=region;p.x=REG[region].x;p.y=REG[region].y;V47T.active=false;p.worldTime=d.when.night===true?300:150;p.hp=Math.max(1,p.hp);const e={region,day:v42wDay(),kind:'story',eventId:d.id,name:d.title,goal:1,count:0,status:'offered',x:p.x,y:p.y,reward:999,xp:999};const s=v42wState(),total=s.total;s.events[region]=e;V42_WORLD.pois=[{id:'v42_event_'+region,kind:'v42event',region,x:p.x,y:p.y}];rng=0;while((((Math.imul(rng,1664525)+1013904223)>>>0)/4294967296<opt.chance)!==outcome)rng++;if(!b04EventOpen(e)||!v42wComplete(e,idx)||v42wComplete(e,idx)||s.total!==total+1||e.status!=='done'||p.hp<1)return {ok:false,id:d.id,idx,outcome,tested};tested++;}}}return {ok:tested===expected&&tested>=81,tested}})()`);
run('integration','save/resume preserves all durable flags and no queued UI from old owner',`(()=>{${start}p.tutorial={seen:{h01:true},off:true};p.msClaimed={lv5:true};p.titleSel='lv5';p.evRecent=['e01','e02'];b04EventBuff({stat:'speed',value:20,seconds:90});p.v14.sect='cloud';p.level=10;v31AcceptTask('cloud_t1');const ids=b04JobsToday().map(d=>d.id).join(),before=p;save();const raw=v42sRead();if(!v42sValidate(raw).ok)return {ok:false,reason:v42sValidate(raw).reason};resume();modal=null;b04TutorialTick(0);return {ok:p!==before&&p.tutorial.off&&p.tutorial.seen.h01&&p.msClaimed.lv5&&p.titleSel==='lv5'&&p.evRecent.join()==='e01,e02'&&p.evBuffs.length===1&&v31State().task.id==='cloud_t1'&&b04JobsToday().map(d=>d.id).join()===ids&&B04_TUT.owner===p&&!B04_TUT.active}})()`);
run('integration','all five DATA absent fallback boot/old gameplay',()=>{const before=warns.length;const {ev:e}=boot(['tutorial','milestones','jobs','sect','events'].map(k=>'data/'+k+'.js'));const ok=e("start(0);modal=null;update(1/60);B04_HINTS.length===0&&V42_MILESTONES.length===6&&b04JobsToday().length===3&&b04SectTasks().length===2&&B04_EVENTS.length===0");return {ok:ok&&warns.length-before===5,warnings:warns.slice(before)}});
run('integration','all five DATA malformed warn once and fallback',()=>{const before=warns.length;const {ev:e}=boot([],true);const ok=e("start(0);modal=null;for(let i=0;i<30;i++)update(1/60);B04_HINTS.length===0&&V42_MILESTONES.length===6&&b04JobsToday().length===3&&b04SectTasks().length===2&&B04_EVENTS.length===0");return {ok:ok&&warns.length-before===5,warnings:warns.slice(before)}});
run('integration','600 real updates with intermittent draws / no hook exceptions',`(()=>{${start}for(let i=0;i<600;i++){if(i===120)modal={kind:'settings',accessTab:0};if(i===180)modal=null;update(1/60);if(i%60===0){rsPrepare();draw();frameOverlay();}}return mode==='play'&&Number.isFinite(p.hp)})()`);
run('C1','simulation without rendering never claims seen',`(()=>{${start}const a=B04_TUT;a.queue=[];a.active=null;a.wait=0;V47T.x=100;V47T.y=650;V47T.cam={x:0,y:0};b04TutorialEnqueue('firstDeath',false);for(let i=0;i<240;i++)b04TutorialTick(1/60);const before=!p.tutorial.seen.h10&&a.active?.t===0;frameOverlay();const first=!p.tutorial.seen.h10;for(let i=0;i<65;i++){b04TutorialTick(1/60);frameOverlay();}return before&&first&&p.tutorial.seen.h10===true})()`);
run('C1','deferred render blocks on current frame / drawer / hidden tab / warmup',`(()=>{${start}V47T.x=100;V47T.y=650;V47T.cam={x:0,y:0};const a=B04_TUT;a.queue=[];a.active=null;b04TutorialEnqueue('firstDeath',false);b04TutorialTick(.01);V35.rects.identity={x:430,y:350,w:420,h:82};frameOverlay();const no=!a.active&&!p.tutorial.seen.h10;v17Drawer=true;const drawer=!b04TutorialValid();v17Drawer=false;document.hidden=true;const hidden=!b04TutorialValid();document.hidden=false;V42_PERF.warm.active=true;return no&&drawer&&hidden&&!b04TutorialValid()})()`);
run('C1','death while still in town clears old queue and signals',`(()=>{${start}b04TutorialEnqueue('firstLoot',false);B04_TUT.signals.add('firstMaterial');b04TutorialDeath();return B04_TUT.death&&!B04_TUT.queue.length&&!B04_TUT.signals.size&&!B04_TUT.active})()`);
run('C2','malformed nonfinite progress cannot mint reward',`(()=>{${start}const b=p.stones;p.kills=NaN;const a=!v42wRewardMilestone('kills20');p.kills=Infinity;const c=!v42wRewardMilestone('kills20');return a&&c&&p.stones===b&&b04MilestoneCount(B04_MS_LIST.find(d=>d.id==='kills20'),v42wState())===0})()`);
run('C2','truthy corrupt claim cannot unlock title',`(()=>{${start}const d=B04_MS_LIST.find(x=>x.title);p.msClaimed={[d.id]:'false'};p.titleSel=d.id;return !b04SelectTitle(d.id)&&playerTitle()===''})()`);
run('C3','corrupt baseline does not count prior kills or emit NaN',`(()=>{${start}p.level=10;const d=B04_JOBS.find(d=>d.id==='j04'),s=v13Init();p.v12Kills={truc:40};s.jobs[d.id]={day:v13Day(),state:'active',base:'bad'};const a=v13JobProgress(d)===0&&s.jobs[d.id].base===40;p.v12Kills.truc+=2;return a&&v13JobProgress(d)===2})()`);
run('C3','cached offered above level cannot bypass gating',`(()=>{${start}const s=v13Init();p.level=1;s.jobs.j12={day:v13Day(),state:'offered',base:0};s.batch04Day={day:v13Day(),ids:['j12','gather','ore']};return !b04JobsToday().some(d=>d.id==='j12')})()`);
run('C3','report keeps a different tracked active job',`(()=>{${start}const o=OW_POI.find(x=>x.id==='v13_board');p.x=o.x;p.y=o.y;const s=v13Init();s.bag.herb=4;s.jobs.gather={day:v13Day(),state:'active',base:0};s.jobs.ore={day:v13Day(),state:'active',base:0};s.trackedJob='ore';return v13JobAction('gather')&&s.trackedJob==='ore'})()`);
run('C3','offered kill shows 0 even after unrelated historical kills',`(()=>{${start}p.level=10;p.v12Kills={truc:100};const d=B04_JOBS.find(d=>d.id==='j04');return v13JobProgress(d)===0})()`);
run('C4','common task corrupted count cannot mint reward',`(()=>{${start}p.v14.sect='cloud';const s=v31State();s.task={id:V31_TASKS[0].id,count:NaN};const b=p.stones;return !v31ClaimTask()&&p.stones===b})()`);
run('C4','missing data parks active task / legacy still works / restore',()=>{const a=boot(['data/sect.js']).ev("start(0);p.v14.sect='cloud';p.level=10;v31State().task={id:'cloud_t1',sect:'cloud',base:7,count:0};const accepted=v31AcceptTask('hunt');JSON.stringify({ok:accepted&&v31State().task.id==='hunt'&&v31State().batch04SuspendedTasks[0].base===7,parked:v31State().batch04SuspendedTasks})");const q=JSON.parse(a);return q.ok&&ev(`(()=>{${start}p.v14.sect='cloud';p.level=10;const s=v31State();s.batch04SuspendedTasks=${JSON.stringify(q.parked)};b04SectReconcile(s);return s.task?.id==='cloud_t1'&&s.task.base===7&&s.batch04SuspendedTasks.length===0})()`)});
run('C5','wrong region and stale POI reject even at identical coordinates',`(()=>{${start}${story}p.mapId='thon';const a=!b04EventOpen(e);p.mapId='truc';V42_WORLD.pois[0].x++;const b=!b04EventOpen(e);V42_WORLD.pois[0].x--;return a&&b&&b04EventOpen(e)})()`);
run('C5','stale day commit closes modal without a reward',`(()=>{${start}${story}const a=b04EventOpen(e),n=p.stones,t=v42wState().total;p.worldTime+=360;return a&&!v42wComplete(e,1)&&!modal&&p.stones===n&&v42wState().total===t&&e.status==='offered'})()`);
run('C5','persist outcome / duplicate blocked after resume',`(()=>{${start}${story}const a=b04EventOpen(e)&&v42wComplete(e,2);save();resume();modal=null;const q=v42wEvent('truc');return a&&q.status==='done'&&q.result?.choice===d.options[2].name&&q.result.success===true&&!v42wComplete(q,2)})()`);
run('C5','malformed endless buff does not affect currentStats',`(()=>{${start}const a=currentStats().attack;p.evBuffs=[{stat:'attack',value:100,expires:Infinity}];const b=currentStats().attack;b04EventPrune();return a===b&&p.evBuffs.length===0})()`);
run('C5','outcome reflects actual XP cap and ignores invalid prior buff',`(()=>{${start}p.level=45;p.xp=0;const [line]=b04EventEffects([{type:'xp',value:10}]);p.evBuffs=[{stat:'attack',value:100,expires:Infinity}];b04EventBuff({stat:'attack',value:.1,seconds:60});return line==='Tu vi đã viên mãn'&&p.xp===0&&p.evBuffs.length===1&&p.evBuffs[0].value===.1})()`);
run('C5','generated world point through nearest E and original numeric choice',`(()=>{${start}p.level=45;owEnter('truc');V47T.active=false;p.mapId='truc';worldTitle=0;V41Presentation.transition=0;const day=(3-V22_REG.truc.i+4)%4;p.worldTime=day*360+150;p.discovered=['thon','truc'];v42wState().events={};v42wRefresh(true);const e=v42wEvent('truc');if(!e||e.kind!=='story')return {ok:false,reason:'generated '+e?.kind};const d=b04EventDef(e.eventId);p.worldTime=day*360+(d.when.night===true?300:150);p.x=e.x;p.y=e.y;enemies=[];const near=owNearest();owInteract();const open=modal?.batch04Story===true;select(2);return {ok:near?.id==='v42_event_truc'&&open&&e.status==='done'&&e.result?.choice===d.options[2].name,near:near?.id,open,status:e.status}})()`);
run('C3','daily selection stress up to 45 levels and 100 game days',`(()=>{${start}for(let day=0;day<100;day++){p.worldTime=day*360+1;p.level=1+day%45;const a=b04JobsToday(),b=b04JobsToday();if(a.length!==3||new Set(a.map(d=>d.id)).size!==3||a.some(d=>(d.minLevel||1)>p.level)||a.map(d=>d.id).join()!==b.map(d=>d.id).join())return false;}return true})()`);
run('C1','four second painted lifetime and exactly once',`(()=>{${start}const a=B04_TUT;a.queue=[];a.active=null;a.wait=0;V47T.x=100;V47T.y=650;V47T.cam={x:0,y:0};b04TutorialEnqueue('firstDeath',false);b04TutorialTick(.01);for(let i=0;i<242;i++){b04TutorialTick(1/60);frameOverlay();}const ended=!a.active&&p.tutorial.seen.h10===true&&a.wait>7.9;b04TutorialEnqueue('firstDeath',false);return ended&&!a.queue.some(q=>q.h.id==='h10')})()`);
run('integration','sparse DATA arrays disable all five modules gracefully',()=>{const before=warns.length;const {ev:e}=boot([],false,"delete DATA.tutorial.hints[2];delete DATA.milestones.list[2];delete DATA.jobs.jobs[2];delete DATA.sect.sects.cloud.tasks[2];delete DATA.events.events[2]");return e("start(0);modal=null;update(1/60);B04_HINTS.length===0&&B04_MS_LIST.length===0&&B04_JOBS.length===0&&!B04_SECTS&&B04_EVENTS.length===0")&&warns.length-before===5});
run('integration','no trapped hook errors',()=>({ok:errors.length===0,errors}));
if(process.env.B04_CAPTURE){
 fs.mkdirSync('batch04_evidence',{recursive:true});
 const capture=(name,expr)=>{ev(expr);fs.writeFileSync('batch04_evidence/'+name+'.png',cv.toBuffer('image/png'));};
 capture('settings',`${start}modal={kind:'settings',accessTab:0};buttons=[];panel();`);
 capture('milestones',`${start}modal={kind:'v42world'};V42_WORLD.tab=2;B04_MS_VIEW.owner=p;B04_MS_VIEW.page=5;for(const d of B04_MS_LIST)if(d.title)b04MilestoneClaimMap(d)[d.id]=true;buttons=[];v42wPanel();`);
 capture('jobs',`${start}p.level=45;modal={kind:'life13',tab:4};buttons=[];panel();`);
 capture('sect',`${start}p.v14.sect='cloud';p.level=45;v31State().rank=2;modal={kind:'v31dao'};V31.tab=0;b04SectPage();B04_SECT_VIEW.page=1;buttons=[];panel();`);
 capture('story',`(()=>{${start}${story}b04EventOpen(e);buttons=[];panel();})()`);
 capture('hint',`${start}V47T.x=100;V47T.y=650;V47T.cam={x:0,y:0};B04_TUT.active={h:B04_HINTS[0],rect:{x:430,y:350,w:420,h:82},t:2};g.fillStyle='#38433b';g.fillRect(0,0,W,H);frameOverlay();`);
}
fs.writeFileSync('batch04_qa_results.json',JSON.stringify({results:result,errors,warns},null,2));
const summary={};for(const t of result){summary[t.group]??={pass:0,total:0};summary[t.group].total++;if(t.pass)summary[t.group].pass++;}console.log('SUMMARY',JSON.stringify(summary));if(result.some(x=>!x.pass))process.exitCode=1;

```
