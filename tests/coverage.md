# M05 — Bản đồ code chết (Coverage)

Chạy lúc: 2026-11-21 11:34:39 UTC · URL: http://localhost:8123/index.html · cửa sổ 1280x720 · Playwright Chromium headless trong máy ảo
Math.random seed=20261121 (add_init_script, giống test_suite); sân luyện 15s, đánh quái thế giới mở 12s

## Các bước đã chạy

- **8 kich ban M01**: 8/8 DAT; loi console/pageerror toi nay: 0
- **danh moc nhan san luyen**: cho bat dau 17.3s; V42T.hits 0 -> 72, tong sat thuong 0 -> 1501, click 20 lan trong 15s
- **tai lai + tiep tuc ve thon**: mode=play mapId=thon V47T={'x': 2590, 'y': 1002}
- **mo/dong F2**: editing=True modal=hud35
- **ra the gioi mo qua cong thon**: gate={'ok': True, 'gate': {'x': 2888.7272727272725, 'y': 596.1227786752827, 'to': 'truc'}}; mapId=truc V47T=None p=(1790,850)
- **di bo o Thanh Truc Lam**: p=(2021,842) mapId=truc
- **ban do the gioi (M -> Son Ha Do)**: da mo tab Son Ha Do, anh cov_worldmap.png
- **danh quai the gioi mo**: quai gan nhat type=5 cach 139px, 171 quai quanh; mau HP muc tieu theo click: [113, 82, 86, 86, 86, 86, 55, 24, 46, 127, 94, 55, 56, 3142, 3142, 3142, 3076, 2988, 2943]; lay mau 2s/lan: [97hp/lv1/12xp/0kill/171quai/truc; 88hp/lv1/34xp/1kill/170quai/truc; 78hp/lv1/34xp/1kill/170quai/truc; 114hp/lv3/7xp/4kill/167quai/truc; 115hp/lv3/21xp/5kill/167quai/truc; 117hp/lv3/21xp/5kill/167quai/truc]; 18 click (trai + phai xen ke) trong 12s; HP nguoi choi 107 -> 117; kills 0->5; cap 1->3 tu vi 12->21; quai song 171->167
- **dung yen cho quai danh lai**: HP nguoi choi 117 -> 121 (sau 6s dung yen)

**Lỗi console/pageerror: 0**

## Phương pháp đo

- Dùng CDP `Profiler.startPreciseCoverage` (`callCount: true, detailed: true`) qua `page.context.new_cdp_session(page)` — Playwright Python không có `page.coverage` nên gọi CDP trực tiếp (cùng cách tools/profile.py dùng CDP `Profiler`). Bật trước khi trang nạp; lấy mẫu ở cuối mỗi giai đoạn (trước reload và cuối cùng) rồi gộp theo URL (lấy count lớn nhất mỗi range), vì reload tạo scriptId mới cho cùng URL.
- Hàm "đã chạy" ⇔ `ranges[0].count > 0` (range đầu là range của chính hàm). Byte "đã chạy": hàm 1 range thì lấy cả range đó; hàm nhiều range thì chỉ lấy các block range (ranges[1:]) có count>0 — vì ranges[0] của hàm top-level bao cả file, tính cả nó thì mọi file đều 100%. Rồi TRỪ ĐI span của mọi hàm khác trong cùng file, vì block range của hàm cha bao trọn câu lệnh khai báo hàm con (kể cả hàm con viết 1 dòng) — không trừ thì thân hàm của hàm chưa bao giờ chạy vẫn bị tính là đã chạy (lần chạy đầu do vậy báo 97,6% trong khi 841 hàm chưa chạy; đã sửa và chạy lại).
- Hàm "không bao giờ chạy" xác định bằng cách quét định nghĩa hàm trong file nguồn (regex) rồi đối chiếu với dữ liệu CDP theo (tên hàm, startOffset). Hàm không có mục CDP tương ứng liệt kê riêng (V8 chưa biên dịch — thường cũng là chưa chạy).
- ★ = hàm có trong `ops/OVERRIDES.md` (bị vá chồng, Claude đang gộp ở T07/T08/T09).

## Tổng hợp

- File `src/`: 51 · tổng 1208858 byte · đã chạy 527405 byte (**43.6%**).
- Hàm quét được: 1956 · đã chạy: 931 · **không chạy: 886** · không có dữ liệu CDP: 139 (trong đó ★ OVERRIDES chưa chạy: 203).

## % code đã chạy theo file `src/` (xếp từ thấp lên cao)

| File | Byte | Đã chạy (byte) | % | Coverable (byte) |
|---|---|---|---|---|
| `42_cultivation_ui.js` | 25015 | 842 | 3.4% | 23746 |
| `43_sect_ui.js` | 17668 | 713 | 4.0% | 16628 |
| `45_v43_v42.js` | 13619 | 1776 | 13.0% | 13611 |
| `36_hud.js` | 26458 | 4199 | 15.9% | 15964 |
| `31_v41_v8.js` | 16590 | 2911 | 17.5% | 16153 |
| `20_v30_v21.js` | 22087 | 3953 | 17.9% | 21263 |
| `23_v34_v21.js` | 21169 | 4224 | 20.0% | 19915 |
| `29_v41_v25.js` | 16273 | 3334 | 20.5% | 13732 |
| `02_v10_v8.js` | 23465 | 4938 | 21.0% | 23025 |
| `12_v18_v17.js` | 15079 | 3295 | 21.9% | 14939 |
| `22_v33_v32.js` | 30018 | 7884 | 26.3% | 27352 |
| `41_codex.js` | 24260 | 6651 | 27.4% | 22101 |
| `09_v13_v8.js` | 21532 | 6437 | 29.9% | 20368 |
| `06_v10_v9.js` | 23184 | 6944 | 30.0% | 22560 |
| `16_v26_v25.js` | 29255 | 8802 | 30.1% | 25039 |
| `37_equipment_assets.js` | 41514 | 12980 | 31.3% | 38764 |
| `03_v8_v22.js` | 25345 | 8590 | 33.9% | 20685 |
| `26_v38_v37.js` | 18060 | 6143 | 34.0% | 17726 |
| `13_v21_v18.js` | 17526 | 6090 | 34.7% | 16434 |
| `21_v31_v30.js` | 21179 | 7433 | 35.1% | 20267 |
| `40_audio.js` | 29556 | 10883 | 36.8% | 27825 |
| `25_v36_v37.js` | 19707 | 7549 | 38.3% | 19265 |
| `18_v28_v21.js` | 16484 | 6692 | 40.6% | 15127 |
| `46_v44_v35.js` | 14113 | 5770 | 40.9% | 12231 |
| `01_core.js` | 58337 | 24750 | 42.4% | 53982 |
| `07_v11_v10.js` | 16164 | 7298 | 45.1% | 15713 |
| `44_photo.js` | 27929 | 12874 | 46.1% | 25359 |
| `38_save.js` | 32009 | 15017 | 46.9% | 27838 |
| `30_v41_v35.js` | 26116 | 12560 | 48.1% | 21083 |
| `19_v29_v28.js` | 15764 | 7920 | 50.2% | 15110 |
| `11_v16_v15.js` | 18981 | 9720 | 51.2% | 18302 |
| `15_v25_v24.js` | 17898 | 9756 | 54.5% | 15636 |
| `47_v45_v35.js` | 88446 | 48212 | 54.5% | 69629 |
| `05_v8_v11.js` | 26600 | 14611 | 54.9% | 24372 |
| `33_atmosphere.js` | 15307 | 8477 | 55.4% | 12525 |
| `35_animation.js` | 33633 | 18728 | 55.7% | 21851 |
| `10_v14_v15.js` | 24580 | 13695 | 55.7% | 22220 |
| `28_v41_v25.js` | 17559 | 9977 | 56.8% | 14230 |
| `08_v12_v8.js` | 18250 | 10512 | 57.6% | 16588 |
| `04_v11_v46.js` | 24319 | 14117 | 58.0% | 20347 |
| `24_v35_v34.js` | 11957 | 7043 | 58.9% | 11558 |
| `48_v48_v47.js` | 62125 | 37135 | 59.8% | 59116 |
| `17_v27_v26.js` | 16530 | 10203 | 61.7% | 11995 |
| `14_v22_v23.js` | 23235 | 14343 | 61.7% | 21566 |
| `27_v41_v16.js` | 23456 | 15191 | 64.8% | 20303 |
| `39_campaign_fixes.js` | 16089 | 10624 | 66.0% | 15117 |
| `32_env_assets.js` | 22414 | 16533 | 73.8% | 20351 |
| `99_boot_ready.js` | 169 | 146 | 86.4% | 146 |
| `00_boot_gate.js` | 1772 | 1545 | 87.2% | 1663 |
| `53_render_scale.js` | 1187 | 1046 | 88.1% | 1046 |
| `34_actor_assets.js` | 38876 | 36339 | 93.5% | 36557 |

Ghi chú: % tính trên tổng byte file (gồm comment/khoảng trắng nên là cận dưới); cột Coverable là tổng byte nằm trong các range CDP (byte thực thi được).

## Hàm KHÔNG BAO GIỜ chạy (tên + file:dòng)

Tổng **886** hàm (trong đó ★ OVERRIDES: 203). Hàm bị vá chồng (lớp cũ bị lớp sau ghi đè) không chạy là bình thường — đó là đối tượng gộp của Claude. Hàm chỉ có 1 định nghĩa mà chưa chạy thì xem lại đường đi chơi trước khi kết luận chết (xem Giới hạn).

### `00_boot_gate.js` — 2 hàm

- `setTimeout` — `00_boot_gate.js:16`
- `setInterval` — `00_boot_gate.js:17`

### `01_core.js` — 39 hàm (11 ★)

- `rnd` — `01_core.js:82`
- `pick` — `01_core.js:82`
- `gearIcon` — `01_core.js:157`
- `equip` — `01_core.js:159`
- `upgradeGear` — `01_core.js:160`
- `blockCollision` — `01_core.js:174`
- `xpNeed` — `01_core.js:197`
- `gainXP` — `01_core.js:198` ★
- `realm` — `01_core.js:199`
- `spawn` — `01_core.js:206` ★
- `enterRoom` — `01_core.js:209` ★
- `resume_L00` — `01_core.js:226`
- `attack` — `01_core.js:256` ★
- `cast` — `01_core.js:262` ★
- `updateEnemy` — `01_core.js:269` ★
- `rewardOptions` — `01_core.js:290`
- `openEvent` — `01_core.js:302`
- `select` — `01_core.js:303`
- `fusion` — `01_core.js:321`
- `advance` — `01_core.js:324` ★
- `travel` — `01_core.js:324`
- `heal` — `01_core.js:325`
- `swapRelic` — `01_core.js:327`
- `sprite` — `01_core.js:373`
- `heroSprite` — `01_core.js:379` ★
- `monsterSprite` — `01_core.js:388` ★
- `themeFor` — `01_core.js:401`
- `buildFloor` — `01_core.js:413`
- `paintScene` — `01_core.js:431`
- `renderEffects` — `01_core.js:447` ★
- `ornament` — `01_core.js:459` ★
- `hotkey` — `01_core.js:469`
- `aimNearest` — `01_core.js:473`
- `bladeBar` — `01_core.js:477`
- `hud` — `01_core.js:480`
- `addButton` — `01_core.js:486`
- `fn` — `01_core.js:500`
- `fn` — `01_core.js:513`
- `endScreen` — `01_core.js:537`

### `02_v10_v8.js` — 28 hàm (3 ★)

- `req` — `02_v10_v8.js:21`
- `req` — `02_v10_v8.js:26`
- `req` — `02_v10_v8.js:31`
- `req` — `02_v10_v8.js:36`
- `req` — `02_v10_v8.js:41`
- `req` — `02_v10_v8.js:46`
- `req` — `02_v10_v8.js:51`
- `req` — `02_v10_v8.js:56`
- `legacyWorldSave` — `02_v10_v8.js:63`
- `migrateWorldSave` — `02_v10_v8.js:64`
- `worldSpawn` — `02_v10_v8.js:66`
- `enterWorld` — `02_v10_v8.js:67` ★
- `worldCam` — `02_v10_v8.js:73`
- `worldPortal` — `02_v10_v8.js:74`
- `worldTravel` — `02_v10_v8.js:75`
- `worldAim` — `02_v10_v8.js:76`
- `worldEnemy` — `02_v10_v8.js:77`
- `worldUpdate` — `02_v10_v8.js:86` ★
- `rr` — `02_v10_v8.js:107`
- `mountains` — `02_v10_v8.js:108`
- `tree` — `02_v10_v8.js:109`
- `house` — `02_v10_v8.js:110`
- `bamboo` — `02_v10_v8.js:112`
- `scenery` — `02_v10_v8.js:113`
- `drawPortal` — `02_v10_v8.js:118`
- `worldBackdrop` — `02_v10_v8.js:120`
- `worldParticles` — `02_v10_v8.js:128`
- `worldDraw` — `02_v10_v8.js:131` ★

### `03_v8_v22.js` — 15 hàm (5 ★)

- `roadDistance` — `03_v8_v22.js:24` ★
- `isBridge` — `03_v8_v22.js:26`
- `flatHashOW` — `03_v8_v22.js:33`
- `makeFlatCanvas` — `03_v8_v22.js:34`
- `owMove` — `03_v8_v22.js:45`
- `owSeedEnemies` — `03_v8_v22.js:47`
- `owNearest` — `03_v8_v22.js:55` ★
- `owInteract` — `03_v8_v22.js:56` ★
- `owAim` — `03_v8_v22.js:57`
- `owEnemy` — `03_v8_v22.js:58` ★
- `owProp` — `03_v8_v22.js:75`
- `owHouse` — `03_v8_v22.js:80`
- `owPOIDraw` — `03_v8_v22.js:81`
- `owWeather` — `03_v8_v22.js:82`
- `worldDraw` — `03_v8_v22.js:87` ★

### `04_v11_v46.js` — 10 hàm (8 ★)

- `hdView` — `04_v11_v46.js:9` ★
- `hdPoint` — `04_v11_v46.js:10`
- `hdUnproject` — `04_v11_v46.js:11`
- `hdHouseArt` — `04_v11_v46.js:40` ★
- `hdShadow` — `04_v11_v46.js:46` ★
- `hdDrawProp` — `04_v11_v46.js:47` ★
- `hdHero` — `04_v11_v46.js:48` ★
- `hdMonster` — `04_v11_v46.js:49` ★
- `hdAtmosphere` — `04_v11_v46.js:53` ★
- `draw` — `04_v11_v46.js:65` ★ (định nghĩa thứ 2 cùng dòng)

### `05_v8_v11.js` — 17 hàm (11 ★)

- `enterRoom` — `05_v8_v11.js:32` ★
- `v8NPCUpdate` — `05_v8_v11.js:35` ★
- `owNearest` — `05_v8_v11.js:44` ★
- `owInteract` — `05_v8_v11.js:46` ★
- `v8Talk` — `05_v8_v11.js:47` ★
- `v8Bond` — `05_v8_v11.js:48`
- `v8Chat` — `05_v8_v11.js:49`
- `v8Quest` — `05_v8_v11.js:51`
- `v8Shop` — `05_v8_v11.js:52`
- `v8InteractAt` — `05_v8_v11.js:71` ★
- `v8PointerDown` — `05_v8_v11.js:76` ★
- `v8Input` — `05_v8_v11.js:77` ★
- `v8Anim` — `05_v8_v11.js:87`
- `v8Figure` — `05_v8_v11.js:89` ★
- `v8Panel` — `05_v8_v11.js:113` ★
- `v8Journal` — `05_v8_v11.js:121` ★
- `v8MenuButton` — `05_v8_v11.js:133`

### `06_v10_v9.js` — 28 hàm (10 ★)

- `v9Travel` — `06_v10_v9.js:14`
- `v9DrawCell` — `06_v10_v9.js:18` ★
- `v9HeroBody` — `06_v10_v9.js:24` ★
- `heroSprite` — `06_v10_v9.js:42` ★
- `v9NPCUpdate` — `06_v10_v9.js:47`
- `v9NPCDraw` — `06_v10_v9.js:75` ★
- `v10Budget` — `06_v10_v9.js:105`
- `v10Spent` — `06_v10_v9.js:106`
- `v10Points` — `06_v10_v9.js:107`
- `v10BreakChance` — `06_v10_v9.js:110`
- `gainXP` — `06_v10_v9.js:111` ★
- `v10Preserve` — `06_v10_v9.js:112`
- `v10Add` — `06_v10_v9.js:113`
- `v10Reset` — `06_v10_v9.js:114`
- `v10Open` — `06_v10_v9.js:115`
- `v10Fmt` — `06_v10_v9.js:117`
- `v10Panel` — `06_v10_v9.js:118`
- `v10HudButton` — `06_v10_v9.js:138`
- `attack` — `06_v10_v9.js:153` ★
- `cast` — `06_v10_v9.js:158` ★
- `v10Variant` — `06_v10_v9.js:168`
- `v9DrawCell` — `06_v10_v9.js:173` ★
- `sprite` — `06_v10_v9.js:174`
- `v10Focus` — `06_v10_v9.js:175`
- `v9HeroBody` — `06_v10_v9.js:176` ★
- `renderEffects` — `06_v10_v9.js:178` ★
- `v10CreateCards` — `06_v10_v9.js:180`
- `v10SkillHud` — `06_v10_v9.js:181`

### `07_v11_v10.js` — 16 hàm (6 ★)

- `hdUnproject` — `07_v11_v10.js:7`
- `heroSprite` — `07_v11_v10.js:8` ★
- `monsterSprite` — `07_v11_v10.js:9` ★
- `v11SkillChange` — `07_v11_v10.js:23`
- `v11SkillReset` — `07_v11_v10.js:24`
- `v11AttrMinus` — `07_v11_v10.js:25`
- `v10Reset` — `07_v11_v10.js:26`
- `v11Open` — `07_v11_v10.js:28`
- `v11SkillPanel` — `07_v11_v10.js:29` ★
- `v11SkillIcon` — `07_v11_v10.js:32`
- `v11SkillHud` — `07_v11_v10.js:35`
- `v11Blast` — `07_v11_v10.js:38`
- `v11Cast` — `07_v11_v10.js:40`
- `cast` — `07_v11_v10.js:42` ★
- `attack` — `07_v11_v10.js:43` ★
- `renderEffects` — `07_v11_v10.js:49` ★

### `08_v12_v8.js` — 17 hàm (2 ★)

- `done` — `08_v12_v8.js:5`
- `done` — `08_v12_v8.js:6`
- `done` — `08_v12_v8.js:7`
- `done` — `08_v12_v8.js:8`
- `done` — `08_v12_v8.js:9`
- `done` — `08_v12_v8.js:10`
- `done` — `08_v12_v8.js:11`
- `done` — `08_v12_v8.js:14`
- `done` — `08_v12_v8.js:15`
- `done` — `08_v12_v8.js:16`
- `done` — `08_v12_v8.js:17`
- `v12Reward` — `08_v12_v8.js:21`
- `v8Talk` — `08_v12_v8.js:48` ★
- `v12Guide` — `08_v12_v8.js:91`
- `v8Journal` — `08_v12_v8.js:114` ★
- `v12Tracker` — `08_v12_v8.js:124`
- `v12Marker` — `08_v12_v8.js:125`

### `09_v13_v8.js` — 32 hàm (5 ★)

- `v13Day` — `09_v13_v8.js:31`
- `v13Log` — `09_v13_v8.js:37`
- `v13Event` — `09_v13_v8.js:38`
- `v13Near` — `09_v13_v8.js:39`
- `v13Route` — `09_v13_v8.js:40`
- `v13Inventory` — `09_v13_v8.js:41`
- `v13Adjust` — `09_v13_v8.js:42`
- `v13Collect` — `09_v13_v8.js:43`
- `v13CanCraft` — `09_v13_v8.js:44`
- `v13Craft` — `09_v13_v8.js:45`
- `v13Farm` — `09_v13_v8.js:46`
- `v13Memory` — `09_v13_v8.js:47`
- `v13Gift` — `09_v13_v8.js:48`
- `v8Chat` — `09_v13_v8.js:49`
- `v13BuyPrice` — `09_v13_v8.js:50`
- `v13Trade` — `09_v13_v8.js:51`
- `v13Use` — `09_v13_v8.js:52`
- `v13JobState` — `09_v13_v8.js:59`
- `v13JobProgress` — `09_v13_v8.js:60`
- `v13JobAction` — `09_v13_v8.js:61`
- `v13JobGuide` — `09_v13_v8.js:62`
- `v13Draft` — `09_v13_v8.js:65`
- `v13Register` — `09_v13_v8.js:66`
- `v13Open` — `09_v13_v8.js:68`
- `v8Talk` — `09_v13_v8.js:69` ★
- `v8Panel` — `09_v13_v8.js:70` ★
- `v8InteractAt` — `09_v13_v8.js:71` ★
- `owInteract` — `09_v13_v8.js:72` ★
- `v8NPCUpdate` — `09_v13_v8.js:74` ★
- `v13Cost` — `09_v13_v8.js:76`
- `v13Header` — `09_v13_v8.js:77`
- `v13Panel` — `09_v13_v8.js:78`

### `10_v14_v15.js` — 17 hàm (4 ★)

- `v14Rank` — `10_v14_v15.js:19`
- `v14SectName` — `10_v14_v15.js:21`
- `v14Move` — `10_v14_v15.js:48` ★
- `v14RemoveEvent` — `10_v14_v15.js:54`
- `v14EventFinish` — `10_v14_v15.js:55`
- `v14Claim` — `10_v14_v15.js:62`
- `v14Join` — `10_v14_v15.js:65`
- `v14SectGuide` — `10_v14_v15.js:66`
- `v14Tribute` — `10_v14_v15.js:67`
- `v14Mediate` — `10_v14_v15.js:68`
- `v14Guide` — `10_v14_v15.js:69`
- `v8InteractAt` — `10_v14_v15.js:72` ★
- `owInteract` — `10_v14_v15.js:73` ★
- `v8Panel` — `10_v14_v15.js:74` ★
- `v14Open` — `10_v14_v15.js:76`
- `v14NPCGuide` — `10_v14_v15.js:77`
- `v14Panel` — `10_v14_v15.js:78`

### `11_v16_v15.js` — 14 hàm (9 ★)

- `v8Figure` — `11_v16_v15.js:10` ★
- `v9NPCDraw` — `11_v16_v15.js:12` ★
- `hdDrawProp` — `11_v16_v15.js:25` ★
- `hdHouseArt` — `11_v16_v15.js:27` ★
- `hdGroundChunk` — `11_v16_v15.js:33` ★
- `v15AtlasRaster` — `11_v16_v15.js:41`
- `v14Panel` — `11_v16_v15.js:49`
- `roadDistance` — `11_v16_v15.js:71` ★
- `hdHouseArt` — `11_v16_v15.js:83` ★
- `v16DrawDecor` — `11_v16_v15.js:93` ★
- `v8NPCUpdate` — `11_v16_v15.js:95` ★
- `v16Signs` — `11_v16_v15.js:100`
- `v16MapDraw` — `11_v16_v15.js:102`
- `v16Guide` — `11_v16_v15.js:111`

### `12_v18_v17.js` — 18 hàm (6 ★)

- `v17House` — `12_v18_v17.js:3` ★
- `v17Signs` — `12_v18_v17.js:10` ★
- `v17HudButton` — `12_v18_v17.js:11`
- `v17Quest` — `12_v18_v17.js:12`
- `v17Hotbar` — `12_v18_v17.js:14`
- `v17Menu` — `12_v18_v17.js:16`
- `v18Path` — `12_v18_v17.js:24`
- `v18Frame` — `12_v18_v17.js:25` ★
- `v18Rule` — `12_v18_v17.js:26`
- `ornament` — `12_v18_v17.js:30` ★
- `addButton` — `12_v18_v17.js:33`
- `hdAtmosphere` — `12_v18_v17.js:36` ★
- `hdGroundChunk` — `12_v18_v17.js:41` ★
- `v18GemBar` — `12_v18_v17.js:43`
- `v18HudButton` — `12_v18_v17.js:44`
- `v17Hotbar` — `12_v18_v17.js:46`
- `v17Quest` — `12_v18_v17.js:47`
- `v8MenuButton` — `12_v18_v17.js:51`

### `13_v21_v18.js` — 15 hàm (4 ★)

- `v21DeathLoot` — `13_v21_v18.js:19` ★
- `v21Pick` — `13_v21_v18.js:24`
- `v21PickNear` — `13_v21_v18.js:25`
- `v21ClickLoot` — `13_v21_v18.js:26`
- `v21Toggle` — `13_v21_v18.js:27`
- `v21Frame` — `13_v21_v18.js:28`
- `v21Button` — `13_v21_v18.js:29`
- `fn` — `13_v21_v18.js:31`
- `v21Diff` — `13_v21_v18.js:34`
- `v21Tooltip` — `13_v21_v18.js:35` ★
- `v21Inventory` — `13_v21_v18.js:36` ★
- `v21SalvageValue` — `13_v21_v18.js:44`
- `v21Salvage` — `13_v21_v18.js:45`
- `v8PointerDown` — `13_v21_v18.js:50` ★
- `v21Hud` — `13_v21_v18.js:51`

### `14_v22_v23.js` — 16 hàm (11 ★)

- `v22BreakChance` — `14_v22_v23.js:28`
- `v22Break` — `14_v22_v23.js:30` ★
- `spawn` — `14_v22_v23.js:35` ★
- `owEnemy` — `14_v22_v23.js:44` ★
- `equip` — `14_v22_v23.js:49`
- `v8InteractAt` — `14_v22_v23.js:52` ★
- `owInteract` — `14_v22_v23.js:53` ★
- `v13Collect` — `14_v22_v23.js:54`
- `hdMonster` — `14_v22_v23.js:59` ★
- `v9HeroBody` — `14_v22_v23.js:77` ★
- `v14Move` — `14_v22_v23.js:85` ★
- `v9NPCDraw` — `14_v22_v23.js:87` ★
- `v23Point` — `14_v22_v23.js:89`
- `v23Patch` — `14_v22_v23.js:90`
- `hdGroundChunk` — `14_v22_v23.js:91` ★
- `hdAtmosphere` — `14_v22_v23.js:105` ★

### `15_v25_v24.js` — 9 hàm (8 ★)

- `v24Textures` — `15_v25_v24.js:7` ★
- `hdShadow` — `15_v25_v24.js:43` ★
- `v24Water` — `15_v25_v24.js:44` ★
- `hdDrawProp` — `15_v25_v24.js:46` ★
- `hdAtmosphere` — `15_v25_v24.js:61` ★
- `v18Frame` — `15_v25_v24.js:67` ★
- `v17Signs` — `15_v25_v24.js:69` ★
- `v24Blade` — `15_v25_v24.js:71`
- `renderEffects` — `15_v25_v24.js:74` ★

### `16_v26_v25.js` — 22 hàm (12 ★)

- `v25Idle` — `16_v26_v25.js:17`
- `v25RunKey` — `16_v26_v25.js:20`
- `v9HeroBody` — `16_v26_v25.js:33` ★
- `v10Focus` — `16_v26_v25.js:52`
- `v25NPCArt` — `16_v26_v25.js:57`
- `v8Figure` — `16_v26_v25.js:71` ★
- `v9NPCDraw` — `16_v26_v25.js:72` ★
- `v25MonsterBody` — `16_v26_v25.js:77` ★
- `monsterSprite` — `16_v26_v25.js:108` ★
- `renderEffects` — `16_v26_v25.js:114` ★
- `v26Push` — `16_v26_v25.js:148` ★
- `v26Blast` — `16_v26_v25.js:165`
- `v26DashStep` — `16_v26_v25.js:197`
- `v9HeroBody` — `16_v26_v25.js:233` ★
- `v25MonsterBody` — `16_v26_v25.js:243` ★
- `v26Sword` — `16_v26_v25.js:248`
- `v26Crescent` — `16_v26_v25.js:249`
- `v26Charge` — `16_v26_v25.js:250` ★
- `v26DrawSkill` — `16_v26_v25.js:256`
- `v26Render` — `16_v26_v25.js:267` ★
- `renderEffects` — `16_v26_v25.js:280` ★
- `v26HUD` — `16_v26_v25.js:281`

### `17_v27_v26.js` — 5 hàm (4 ★)

- `updateEnemy` — `17_v27_v26.js:65` ★
- `v26Push` — `17_v27_v26.js:76` ★
- `v27Zone` — `17_v27_v26.js:79` ★
- `renderEffects` — `17_v27_v26.js:88` ★
- `v27BossHUD` — `17_v27_v26.js:91`

### `18_v28_v21.js` — 25 hàm (5 ★)

- `v28State` — `18_v28_v21.js:9`
- `v28RoomState` — `18_v28_v21.js:17`
- `v28Nodes` — `18_v28_v21.js:18`
- `v28Rune` — `18_v28_v21.js:19`
- `v28ActiveNodes` — `18_v28_v21.js:20`
- `v28BossKey` — `18_v28_v21.js:21`
- `v28TagBoss` — `18_v28_v21.js:23`
- `enterRoom` — `18_v28_v21.js:24` ★
- `v28Enter` — `18_v28_v21.js:25`
- `v8InteractAt` — `18_v28_v21.js:26` ★
- `v28Finish` — `18_v28_v21.js:31`
- `v28InteractRoom` — `18_v28_v21.js:64`
- `advance` — `18_v28_v21.js:66` ★
- `v451DungeonNext` — `18_v28_v21.js:72`
- `v451DungeonProceed` — `18_v28_v21.js:81`
- `v451Retreat` — `18_v28_v21.js:90`
- `v28Formation` — `18_v28_v21.js:98`
- `v28FormationZone` — `18_v28_v21.js:99`
- `v28Owner` — `18_v28_v21.js:104`
- `v28CleanSummons` — `18_v28_v21.js:109`
- `v28SealDraw` — `18_v28_v21.js:113`
- `v28Render` — `18_v28_v21.js:114`
- `renderEffects` — `18_v28_v21.js:116` ★
- `v28HUD` — `18_v28_v21.js:117`
- `v21Tooltip` — `18_v28_v21.js:120` ★

### `19_v29_v28.js` — 16 hàm (4 ★)

- `v29Layout` — `19_v29_v28.js:17`
- `v29Config` — `19_v29_v28.js:18`
- `v29Record` — `19_v29_v28.js:19`
- `v29Unlocked` — `19_v29_v28.js:20`
- `v29Mod` — `19_v29_v28.js:22`
- `v29Enter` — `19_v29_v28.js:23`
- `v8InteractAt` — `19_v29_v28.js:25` ★
- `spawn` — `19_v29_v28.js:30` ★
- `v28Finish` — `19_v29_v28.js:32`
- `v29SetDrop` — `19_v29_v28.js:58`
- `v29PanelBase` — `19_v29_v28.js:81`
- `v29DifficultyPanel` — `19_v29_v28.js:82`
- `v29WorldPanel` — `19_v29_v28.js:84`
- `v29SetsPanel` — `19_v29_v28.js:86`
- `v21Inventory` — `19_v29_v28.js:87` ★
- `v21Tooltip` — `19_v29_v28.js:88` ★

### `20_v30_v21.js` — 47 hàm (5 ★)

- `v30Item` — `20_v30_v21.js:21`
- `v30CostText` — `20_v30_v21.js:22`
- `v30Can` — `20_v30_v21.js:23`
- `v30Pay` — `20_v30_v21.js:24`
- `v30ForgeAllowed` — `20_v30_v21.js:25`
- `v30ForgeOpen` — `20_v30_v21.js:26`
- `v30Notice` — `20_v30_v21.js:27`
- `v30UpgradeCost` — `20_v30_v21.js:28`
- `v30UpgradeChance` — `20_v30_v21.js:29`
- `upgradeGear` — `20_v30_v21.js:30`
- `v30Refinable` — `20_v30_v21.js:31`
- `v30RefCost` — `20_v30_v21.js:32`
- `v30RollRef` — `20_v30_v21.js:33`
- `v30AcceptRef` — `20_v30_v21.js:34`
- `v30SocketMax` — `20_v30_v21.js:35`
- `v30SocketCost` — `20_v30_v21.js:36`
- `v30OpenSocket` — `20_v30_v21.js:37`
- `v30GemCost` — `20_v30_v21.js:38`
- `v30CraftGem` — `20_v30_v21.js:39`
- `v30Insert` — `20_v30_v21.js:40`
- `v30Remove` — `20_v30_v21.js:41`
- `v30AscCost` — `20_v30_v21.js:42`
- `v30AscReady` — `20_v30_v21.js:43`
- `v30Ascend` — `20_v30_v21.js:44`
- `v30CraftRelic` — `20_v30_v21.js:46`
- `v30ActivateRelic` — `20_v30_v21.js:47`
- `v21Salvage` — `20_v30_v21.js:51`
- `v30TrialMap` — `20_v30_v21.js:55`
- `v30TrialEligible` — `20_v30_v21.js:57`
- `v22Break` — `20_v30_v21.js:58` ★
- `v30TrialStart` — `20_v30_v21.js:59`
- `v30TrialZone` — `20_v30_v21.js:60`
- `v30TrialEnd` — `20_v30_v21.js:61`
- `v30TrialTick` — `20_v30_v21.js:62`
- `advance` — `20_v30_v21.js:67` ★
- `renderEffects` — `20_v30_v21.js:71` ★
- `v30Button` — `20_v30_v21.js:75`
- `v30Aff` — `20_v30_v21.js:76`
- `v30ForgePanel` — `20_v30_v21.js:77`
- `v30EnhancePanel` — `20_v30_v21.js:80`
- `v30RefinePanel` — `20_v30_v21.js:81`
- `v30GemPanel` — `20_v30_v21.js:82`
- `v30AscPanel` — `20_v30_v21.js:83`
- `v30RelicPanel` — `20_v30_v21.js:84`
- `v30TrialPanel` — `20_v30_v21.js:85`
- `v21Inventory` — `20_v30_v21.js:87` ★
- `v21Tooltip` — `20_v30_v21.js:88` ★

### `21_v31_v30.js` — 52 hàm (3 ★)

- `apply` — `21_v31_v30.js:5`
- `apply` — `21_v31_v30.js:6`
- `apply` — `21_v31_v30.js:7`
- `apply` — `21_v31_v30.js:8`
- `passive` — `21_v31_v30.js:21`
- `passive` — `21_v31_v30.js:22`
- `passive` — `21_v31_v30.js:23`
- `passive` — `21_v31_v30.js:24`
- `apply` — `21_v31_v30.js:27`
- `apply` — `21_v31_v30.js:28`
- `apply` — `21_v31_v30.js:29`
- `apply` — `21_v31_v30.js:30`
- `apply` — `21_v31_v30.js:31`
- `apply` — `21_v31_v30.js:34`
- `apply` — `21_v31_v30.js:35`
- `apply` — `21_v31_v30.js:36`
- `apply` — `21_v31_v30.js:37`
- `v31Notice` — `21_v31_v30.js:41`
- `v31InTown` — `21_v31_v30.js:42`
- `v31Open` — `21_v31_v30.js:43`
- `v31Promote` — `21_v31_v30.js:45`
- `v31AcceptTask` — `21_v31_v30.js:46`
- `v31ClaimTask` — `21_v31_v30.js:47`
- `v31Stipend` — `21_v31_v30.js:48`
- `v31Recruit` — `21_v31_v30.js:49`
- `v31Dispatch` — `21_v31_v30.js:50`
- `v31ClaimDisc` — `21_v31_v30.js:51`
- `v31TrainDisc` — `21_v31_v30.js:52`
- `v31CaveCost` — `21_v31_v30.js:53`
- `v31CaveUpgrade` — `21_v31_v30.js:54`
- `v31CaveClaim` — `21_v31_v30.js:55`
- `v31CaveRest` — `21_v31_v30.js:56`
- `v31Bond` — `21_v31_v30.js:57`
- `v31Summon` — `21_v31_v30.js:58`
- `v31FeedCost` — `21_v31_v30.js:59`
- `v31Feed` — `21_v31_v30.js:60`
- `v31RootCost` — `21_v31_v30.js:61`
- `v31ChooseRoot` — `21_v31_v30.js:62`
- `v31RootUp` — `21_v31_v30.js:63`
- `v31BloodCost` — `21_v31_v30.js:64`
- `v31Awaken` — `21_v31_v30.js:65`
- `v31BloodUp` — `21_v31_v30.js:66`
- `heroSprite` — `21_v31_v30.js:73` ★
- `v8InteractAt` — `21_v31_v30.js:77` ★
- `owInteract` — `21_v31_v30.js:78` ★
- `v31Btn` — `21_v31_v30.js:87`
- `v31Panel` — `21_v31_v30.js:88`
- `v31SectPanel` — `21_v31_v30.js:89`
- `v31DiscPanel` — `21_v31_v30.js:92`
- `v31CavePanel` — `21_v31_v30.js:93`
- `v31PetPanel` — `21_v31_v30.js:95`
- `v31TalentPanel` — `21_v31_v30.js:96`

### `22_v33_v32.js` — 24 hàm (5 ★)

- `v32NamedIndex` — `22_v33_v32.js:20`
- `v32StrideCell` — `22_v33_v32.js:21`
- `v9NPCDraw` — `22_v33_v32.js:24` ★
- `v32Poly` — `22_v33_v32.js:31`
- `hdGroundChunk` — `22_v33_v32.js:32` ★
- `v24Water` — `22_v33_v32.js:45` ★
- `v33Box` — `22_v33_v32.js:59`
- `fn` — `22_v33_v32.js:60`
- `v33Button` — `22_v33_v32.js:61` ★
- `v33Bar` — `22_v33_v32.js:63`
- `v33Player` — `22_v33_v32.js:64`
- `v33Statuses` — `22_v33_v32.js:65`
- `v33Mini` — `22_v33_v32.js:67`
- `v33WorldInfo` — `22_v33_v32.js:68`
- `v33ArenaInfo` — `22_v33_v32.js:69`
- `v33Boss` — `22_v33_v32.js:70`
- `v33Aim` — `22_v33_v32.js:71`
- `v33SkillBar` — `22_v33_v32.js:72`
- `v33Controls` — `22_v33_v32.js:73`
- `v33Drawer` — `22_v33_v32.js:74` ★
- `v33Feedback` — `22_v33_v32.js:75`
- `v33Context` — `22_v33_v32.js:76`
- `v33ArenaCompact` — `22_v33_v32.js:77`
- `v33HUD` — `22_v33_v32.js:78`

### `23_v34_v21.js` — 14 hàm (2 ★)

- `v34Panel` — `23_v34_v21.js:7`
- `v34Bar` — `23_v34_v21.js:10`
- `v34Portrait` — `23_v34_v21.js:11`
- `v33Player` — `23_v34_v21.js:12`
- `v33WorldInfo` — `23_v34_v21.js:15`
- `v33Boss` — `23_v34_v21.js:20`
- `v34Feed` — `23_v34_v21.js:24`
- `v33SkillBar` — `23_v34_v21.js:26`
- `v33Controls` — `23_v34_v21.js:28`
- `v33Feedback` — `23_v34_v21.js:29`
- `v33HUD` — `23_v34_v21.js:30`
- `v34Shell` — `23_v34_v21.js:32`
- `v21Inventory` — `23_v34_v21.js:34` ★
- `v11SkillPanel` — `23_v34_v21.js:38` ★

### `24_v35_v34.js` — 7 hàm (2 ★)

- `fn` — `24_v35_v34.js:13`
- `v35Plate` — `24_v35_v34.js:16` ★
- `v35Line` — `24_v35_v34.js:17`
- `v35Control` — `24_v35_v34.js:19` ★
- `v35Orb` — `24_v35_v34.js:27`
- `v35Notifications` — `24_v35_v34.js:32`
- `v35Arena` — `24_v35_v34.js:36`

### `25_v36_v37.js` — 24 hàm (7 ★)

- `v36Current` — `25_v36_v37.js:14`
- `v36Enter` — `25_v36_v37.js:17`
- `v36Leave` — `25_v36_v37.js:18` ★
- `v8InteractAt` — `25_v36_v37.js:22` ★
- `owInteract` — `25_v36_v37.js:23` ★
- `v8Talk` — `25_v36_v37.js:24` ★
- `v36Blocked` — `25_v36_v37.js:31`
- `v36Line` — `25_v36_v37.js:32`
- `v36Path` — `25_v36_v37.js:33`
- `v36Go` — `25_v36_v37.js:34`
- `v36GoNPC` — `25_v36_v37.js:35`
- `v36GoExit` — `25_v36_v37.js:36`
- `v36Interact` — `25_v36_v37.js:37`
- `v12Guide` — `25_v36_v37.js:38`
- `v36Backdrop` — `25_v36_v37.js:41` ★
- `v36Mini` — `25_v36_v37.js:60` ★
- `v36HUD` — `25_v36_v37.js:61` ★
- `v36Draw` — `25_v36_v37.js:62`
- `KeyI` — `25_v36_v37.js:67`
- `KeyG` — `25_v36_v37.js:67`
- `Tab` — `25_v36_v37.js:67`
- `KeyJ` — `25_v36_v37.js:67`
- `KeyL` — `25_v36_v37.js:67`
- `KeyM` — `25_v36_v37.js:67`

### `26_v38_v37.js` — 15 hàm (10 ★)

- `v17House` — `26_v38_v37.js:5` ★
- `hdGroundChunk` — `26_v38_v37.js:21` ★
- `v37Furniture` — `26_v38_v37.js:26`
- `v37FurnDraw` — `26_v38_v37.js:27`
- `v36Backdrop` — `26_v38_v37.js:29` ★
- `v24Textures` — `26_v38_v37.js:50` ★
- `v9HeroBody` — `26_v38_v37.js:53` ★
- `v9NPCDraw` — `26_v38_v37.js:54` ★
- `v17House` — `26_v38_v37.js:56` ★
- `hdAtmosphere` — `26_v38_v37.js:60` ★
- `v35Orb` — `26_v38_v37.js:66`
- `v35Plate` — `26_v38_v37.js:67` ★
- `v38Aura` — `26_v38_v37.js:72`
- `v26DrawSkill` — `26_v38_v37.js:79`
- `v26Charge` — `26_v38_v37.js:80` ★

### `27_v41_v16.js` — 9 hàm (4 ★)

- `v24Textures` — `27_v41_v16.js:66` ★
- `v41eHouseArt` — `27_v41_v16.js:88`
- `v17House` — `27_v41_v16.js:101` ★
- `v41eChunkWithin` — `27_v41_v16.js:134`
- `v41eGroundLine` — `27_v41_v16.js:135`
- `v41ePlaza` — `27_v41_v16.js:138`
- `hdGroundChunk` — `27_v41_v16.js:201` ★
- `v41eShadowArt` — `27_v41_v16.js:229`
- `hdShadow` — `27_v41_v16.js:242` ★

### `28_v41_v25.js` — 7 hàm (3 ★)

- `v41aFrame` — `28_v41_v25.js:25`
- `v41aRigCell` — `28_v41_v25.js:50`
- `v41aHeroRun` — `28_v41_v25.js:55`
- `v41aActionPose` — `28_v41_v25.js:65`
- `v9HeroBody` — `28_v41_v25.js:73` ★
- `updateEnemy` — `28_v41_v25.js:122` ★
- `renderEffects` — `28_v41_v25.js:176` ★

### `29_v41_v25.js` — 6 hàm (1 ★)

- `v41cSword` — `29_v41_v25.js:48`
- `v41cStoneCracks` — `29_v41_v25.js:54`
- `v41cCrystal` — `29_v41_v25.js:58`
- `v41cLightning` — `29_v41_v25.js:69`
- `v41cSkill` — `29_v41_v25.js:97`
- `v26Render` — `29_v41_v25.js:152` ★

### `30_v41_v35.js` — 19 hàm (5 ★)

- `v41AudioToggle` — `30_v41_v35.js:74`
- `v36Enter` — `30_v41_v35.js:93`
- `v36Leave` — `30_v41_v35.js:94` ★
- `v21Pick` — `30_v41_v35.js:95`
- `heal` — `30_v41_v35.js:96`
- `v41AudioAmbience` — `30_v41_v35.js:98`
- `v41HUDRound` — `30_v41_v35.js:141`
- `v41HUDCorner` — `30_v41_v35.js:145`
- `v35Plate` — `30_v41_v35.js:150` ★
- `v33Box` — `30_v41_v35.js:163`
- `v33Button` — `30_v41_v35.js:164` ★
- `v41HUDPercent` — `30_v41_v35.js:183`
- `v41HUDTag` — `30_v41_v35.js:185`
- `v41HUDResources` — `30_v41_v35.js:209`
- `v35Control` — `30_v41_v35.js:217` ★
- `v35Notifications` — `30_v41_v35.js:240`
- `close` — `30_v41_v35.js:263`
- `v36Mini` — `30_v41_v35.js:289` ★
- `v33ArenaInfo` — `30_v41_v35.js:299`

### `31_v41_v8.js` — 10 hàm (4 ★)

- `v41QualityToggle` — `31_v41_v8.js:8`
- `v41PLine` — `31_v41_v8.js:12`
- `v41PFrame` — `31_v41_v8.js:13` ★
- `v41PButton` — `31_v41_v8.js:14` ★
- `v41PTitle` — `31_v41_v8.js:15`
- `menuV41` — `31_v41_v8.js:23`
- `v41RoomRand` — `31_v41_v8.js:49`
- `v36Backdrop` — `31_v41_v8.js:51` ★
- `v41RoomLive` — `31_v41_v8.js:65`
- `v8Panel` — `31_v41_v8.js:74` ★

### `32_env_assets.js` — 5 hàm (3 ★)

- `v41PerfCounters` — `32_env_assets.js:8`
- `hdShadow` — `32_env_assets.js:25` ★
- `draw` — `32_env_assets.js:267` ★
- `v42eTileFill` — `32_env_assets.js:273`
- `v36Backdrop` — `32_env_assets.js:281` ★

### `33_atmosphere.js` — 4 hàm

- `v42aReflectionArt` — `33_atmosphere.js:104`
- `v42aBank` — `33_atmosphere.js:117`
- `v42aRiverClip` — `33_atmosphere.js:123`
- `v42aReflectionCandidates` — `33_atmosphere.js:128`

### `34_actor_assets.js` — 1 hàm

- `v42AtmoDiagnostics` — `34_actor_assets.js:31`

### `35_animation.js` — 4 hàm (1 ★)

- `v25RunKey` — `35_animation.js:21`
- `v42aDrawDash` — `35_animation.js:89`
- `v42cPulse` — `35_animation.js:204`
- `v42cSkill` — `35_animation.js:245` ★

### `36_hud.js` — 14 hàm (2 ★)

- `v42HUDFrame` — `36_hud.js:20`
- `v42HUDSection` — `36_hud.js:35`
- `v42HUDButton` — `36_hud.js:40`
- `v42HUDShell` — `36_hud.js:47` ★
- `v42HUDStatRow` — `36_hud.js:58`
- `v42HUDGearValue` — `36_hud.js:62`
- `fn` — `36_hud.js:88`
- `v42HUDDiff` — `36_hud.js:90`
- `fn` — `36_hud.js:119`
- `v42HUDSlotArt` — `36_hud.js:217`
- `v42QuestGuidePage` — `36_hud.js:243`
- `fn` — `36_hud.js:274`
- `v11SkillPanel` — `36_hud.js:310` ★
- `fn` — `36_hud.js:364`

### `37_equipment_assets.js` — 44 hàm (2 ★)

- `v42MaterialIcon` — `37_equipment_assets.js:28`
- `v42MatCount` — `37_equipment_assets.js:30`
- `v42MatRecipeOut` — `37_equipment_assets.js:31`
- `v42MatProgress` — `37_equipment_assets.js:32`
- `v42MatTrade` — `37_equipment_assets.js:33`
- `v13Panel` — `37_equipment_assets.js:40`
- `v42wExterior` — `37_equipment_assets.js:133`
- `v42wName` — `37_equipment_assets.js:134`
- `v42wLog` — `37_equipment_assets.js:135`
- `v42wRep` — `37_equipment_assets.js:136`
- `v42wTier` — `37_equipment_assets.js:137`
- `v42wWithin` — `37_equipment_assets.js:138`
- `v42wWaystone` — `37_equipment_assets.js:152`
- `v42wEventPOI` — `37_equipment_assets.js:153`
- `v42wKey` — `37_equipment_assets.js:154`
- `v42wNotice` — `37_equipment_assets.js:179`
- `v42wClose` — `37_equipment_assets.js:180`
- `v42OpenWorld` — `37_equipment_assets.js:181`
- `v42wGuide` — `37_equipment_assets.js:182`
- `v42wCanInteract` — `37_equipment_assets.js:183`
- `v42wActivate` — `37_equipment_assets.js:184`
- `v42wFightNearby` — `37_equipment_assets.js:185`
- `v42wTravelCost` — `37_equipment_assets.js:186`
- `v42wCurrentWay` — `37_equipment_assets.js:187`
- `v42wTravel` — `37_equipment_assets.js:188`
- `V42_REG_SAFE` — `37_equipment_assets.js:193`
- `v42wEventNear` — `37_equipment_assets.js:195`
- `v42wComplete` — `37_equipment_assets.js:196`
- `v42wSolve` — `37_equipment_assets.js:203`
- `v42wHuntStart` — `37_equipment_assets.js:204`
- `v42wRewardMilestone` — `37_equipment_assets.js:212`
- `v8InteractAt` — `37_equipment_assets.js:221` ★
- `owInteract` — `37_equipment_assets.js:222` ★
- `v42wFrame` — `37_equipment_assets.js:257`
- `v42wText` — `37_equipment_assets.js:258`
- `v42wButton` — `37_equipment_assets.js:259`
- `v42wRule` — `37_equipment_assets.js:260`
- `v42wTab` — `37_equipment_assets.js:262`
- `v42wRegionList` — `37_equipment_assets.js:263`
- `v42wEventPanel` — `37_equipment_assets.js:264`
- `v42wWayPanel` — `37_equipment_assets.js:279`
- `v42wMilestonePanel` — `37_equipment_assets.js:287`
- `v42wHistoryPanel` — `37_equipment_assets.js:288`
- `v42wPanel` — `37_equipment_assets.js:289`

### `38_save.js` — 17 hàm (1 ★)

- `fail` — `38_save.js:9`
- `v42sCached` — `38_save.js:39`
- `v42sPrepare` — `38_save.js:40`
- `v42sInstall` — `38_save.js:41`
- `v42sExport` — `38_save.js:60`
- `v42sPick` — `38_save.js:63`
- `v42sOpen` — `38_save.js:64`
- `v42sClose` — `38_save.js:65`
- `v42sPanel` — `38_save.js:66`
- `v42tSetup` — `38_save.js:129`
- `v42tGuide` — `38_save.js:132`
- `v42tReport` — `38_save.js:140`
- `v42tName` — `38_save.js:149`
- `v42tMetrics` — `38_save.js:169`
- `v26Push` — `38_save.js:198` ★
- `v42tFmt` — `38_save.js:264`
- `v42tPanel` — `38_save.js:265`

### `39_campaign_fixes.js` — 6 hàm (1 ★)

- `v13Gift` — `39_campaign_fixes.js:7`
- `v42CampaignLine` — `39_campaign_fixes.js:29`
- `v42CampaignPath` — `39_campaign_fixes.js:34`
- `v42CampaignDense` — `39_campaign_fixes.js:54`
- `spawn` — `39_campaign_fixes.js:157` ★
- `v42EliteGlyph` — `39_campaign_fixes.js:197`

### `40_audio.js` — 17 hàm (1 ★)

- `v42wComplete` — `40_audio.js:52`
- `v42wActivate` — `40_audio.js:53`
- `v42wTravel` — `40_audio.js:54`
- `v22Break` — `40_audio.js:55` ★
- `v42pTitle` — `40_audio.js:76`
- `v42pHome` — `40_audio.js:79`
- `v42pHelp` — `40_audio.js:90`
- `v42AccessPersist` — `40_audio.js:102`
- `v42AccessVolume` — `40_audio.js:110`
- `v42AccessHUDScale` — `40_audio.js:113`
- `v42AccessHUDScaleMatch` — `40_audio.js:125`
- `v42AccessQuality` — `40_audio.js:126`
- `v42AccessToggleLine` — `40_audio.js:127`
- `v42AccessLevelLine` — `40_audio.js:131`
- `v42AccessSettings` — `40_audio.js:136`
- `v42AccessSources` — `40_audio.js:181`
- `v42AccessProfile` — `40_audio.js:191`

### `41_codex.js` — 16 hàm

- `v42cxInt` — `41_codex.js:11`
- `v42cxEntry` — `41_codex.js:34`
- `v42cxOpen` — `41_codex.js:69`
- `v42cxClose` — `41_codex.js:70`
- `v42cxKnownSites` — `41_codex.js:75`
- `v42cxCardArt` — `41_codex.js:76`
- `v42cxTypeIds` — `41_codex.js:80`
- `v42cxLootIcon` — `41_codex.js:81`
- `v42cxFilterIds` — `41_codex.js:82`
- `v42cxGuide` — `41_codex.js:83`
- `v42cxDetails` — `41_codex.js:85`
- `v42cxBestiary` — `41_codex.js:109`
- `v42cxMapArt` — `41_codex.js:119`
- `v42cxAtlas` — `41_codex.js:137`
- `v42cxPanel` — `41_codex.js:159`
- `v42wPanel` — `41_codex.js:167`

### `42_cultivation_ui.js` — 27 hàm

- `v42fReset` — `42_cultivation_ui.js:9`
- `v42fClip` — `42_cultivation_ui.js:10`
- `v42fValue` — `42_cultivation_ui.js:11`
- `v42fSelect` — `42_cultivation_ui.js:12`
- `v42fIcon` — `42_cultivation_ui.js:13`
- `v42fItemReady` — `42_cultivation_ui.js:14`
- `v30ForgeOpen` — `42_cultivation_ui.js:16`
- `v42fItems` — `42_cultivation_ui.js:17`
- `v42fSymbol` — `42_cultivation_ui.js:18`
- `v42fCostRows` — `42_cultivation_ui.js:19`
- `v42fCosts` — `42_cultivation_ui.js:20`
- `v42fPreview` — `42_cultivation_ui.js:24`
- `v42fRelicPreview` — `42_cultivation_ui.js:34`
- `v42fDeltas` — `42_cultivation_ui.js:36`
- `v42fCompare` — `42_cultivation_ui.js:37`
- `v42fWallet` — `42_cultivation_ui.js:42`
- `v42fNav` — `42_cultivation_ui.js:45`
- `v42fList` — `42_cultivation_ui.js:46`
- `v42fItemHeader` — `42_cultivation_ui.js:55`
- `v42fAction` — `42_cultivation_ui.js:61`
- `v42fEnhance` — `42_cultivation_ui.js:62`
- `v42fRefine` — `42_cultivation_ui.js:70`
- `v42fGems` — `42_cultivation_ui.js:77`
- `v42fAsc` — `42_cultivation_ui.js:89`
- `v42fRelics` — `42_cultivation_ui.js:97`
- `v30ForgePanel` — `42_cultivation_ui.js:105`
- `v30TrialPanel` — `42_cultivation_ui.js:110`

### `43_sect_ui.js` — 14 hàm

- `v42dReset` — `43_sect_ui.js:7`
- `v31Open` — `43_sect_ui.js:8`
- `v42dTime` — `43_sect_ui.js:9`
- `v42dReq` — `43_sect_ui.js:10`
- `v42dSeal` — `43_sect_ui.js:11`
- `v42dStat` — `43_sect_ui.js:12`
- `v42dHeader` — `43_sect_ui.js:13`
- `v42dSect` — `43_sect_ui.js:14`
- `v42dListTitle` — `43_sect_ui.js:20`
- `v42dDisc` — `43_sect_ui.js:21`
- `v42dCave` — `43_sect_ui.js:29`
- `v42dPet` — `43_sect_ui.js:36`
- `v42dTalent` — `43_sect_ui.js:41`
- `v31Panel` — `43_sect_ui.js:48`

### `44_photo.js` — 23 hàm

- `v42PhotoReady` — `44_photo.js:7`
- `v42PhotoRelease` — `44_photo.js:8`
- `v42PhotoToggle` — `44_photo.js:9`
- `v42PhotoLight` — `44_photo.js:14`
- `v42PhotoRender` — `44_photo.js:16`
- `v42PhotoCapture` — `44_photo.js:33`
- `v42PerfActual` — `44_photo.js:207`
- `v42PerfTransientQuality` — `44_photo.js:208`
- `v42PerfSetAdaptive` — `44_photo.js:217`
- `v41ApplyQuality` — `44_photo.js:228`
- `v41QualityToggle` — `44_photo.js:231`
- `v42PerfObserveCadence` — `44_photo.js:233`
- `v42PerfQualityStatus` — `44_photo.js:246`
- `v42PerfStats` — `44_photo.js:248`
- `v42PerfCacheStats` — `44_photo.js:249`
- `v42PerfDiagnostics` — `44_photo.js:250`
- `v46SampleFps` — `44_photo.js:290`
- `v42PerfDrawFps` — `44_photo.js:314`
- `v42PerfMissingChunks` — `44_photo.js:338`
- `v42PerfLoadingDraw` — `44_photo.js:350`
- `v42PerfWarmupTick` — `44_photo.js:363`
- `frame` — `44_photo.js:396`
- `__VDTT_PERF` — `44_photo.js:409`

### `45_v43_v42.js` — 16 hàm (1 ★)

- `v43MapPoint` — `45_v43_v42.js:5`
- `v43MapLine` — `45_v43_v42.js:6`
- `v43MapPlate` — `45_v43_v42.js:7`
- `v43MapCompass` — `45_v43_v42.js:8`
- `v43AtlasArt` — `45_v43_v42.js:9`
- `v42cxMapArt` — `45_v43_v42.js:33`
- `v15AtlasRaster` — `45_v43_v42.js:36`
- `v43Texture` — `45_v43_v42.js:42`
- `v43Stroke` — `45_v43_v42.js:57`
- `v43Energy` — `45_v43_v42.js:58`
- `v43Wave` — `45_v43_v42.js:60`
- `v43Blade` — `45_v43_v42.js:61`
- `v43Bolt` — `45_v43_v42.js:64`
- `v43Shard` — `45_v43_v42.js:65`
- `v43KineticSkill` — `45_v43_v42.js:66`
- `v42cSkill` — `45_v43_v42.js:101` ★

### `46_v44_v35.js` — 14 hàm (8 ★)

- `v44Title` — `46_v44_v35.js:50`
- `v44Frame` — `46_v44_v35.js:52`
- `v41PFrame` — `46_v44_v35.js:61` ★
- `v41PButton` — `46_v44_v35.js:62` ★
- `v18Frame` — `46_v44_v35.js:71` ★
- `v18Rule` — `46_v44_v35.js:72`
- `ornament` — `46_v44_v35.js:73` ★
- `v42HUDShell` — `46_v44_v35.js:74` ★
- `fn` — `46_v44_v35.js:94`
- `v44QuestAt` — `46_v44_v35.js:114`
- `v35Control` — `46_v44_v35.js:146` ★
- `v36Mini` — `46_v44_v35.js:158` ★
- `v36HUD` — `46_v44_v35.js:163` ★
- `v36Draw` — `46_v44_v35.js:183`

### `47_v45_v35.js` — 36 hàm (3 ★)

- `cut` — `47_v45_v35.js:48`
- `v18Frame` — `47_v45_v35.js:162` ★
- `v45Day` — `47_v45_v35.js:180`
- `fn` — `47_v45_v35.js:249`
- `fn` — `47_v45_v35.js:306`
- `fn` — `47_v45_v35.js:307`
- `fn` — `47_v45_v35.js:308`
- `fn` — `47_v45_v35.js:338`
- `v45HubDock` — `47_v45_v35.js:428`
- `v45QuestPin` — `47_v45_v35.js:479`
- `fn` — `47_v45_v35.js:512`
- `v45MapFrame` — `47_v45_v35.js:587`
- `v45MapUnframe` — `47_v45_v35.js:591`
- `v45Compass` — `47_v45_v35.js:600`
- `v45AtlasArt` — `47_v45_v35.js:608`
- `fn` — `47_v45_v35.js:829`
- `fn` — `47_v45_v35.js:831`
- `v45TownLayout` — `47_v45_v35.js:920`
- `v45TownGround` — `47_v45_v35.js:925`
- `v45TownSites` — `47_v45_v35.js:969`
- `v45TownTarget` — `47_v45_v35.js:979`
- `v45TownMap` — `47_v45_v35.js:986`
- `v36Mini` — `47_v45_v35.js:1078` ★
- `v36HUD` — `47_v45_v35.js:1092` ★
- `v45SkillArea` — `47_v45_v35.js:1135`
- `v451Arena` — `47_v45_v35.js:1186`
- `v451Panel` — `47_v45_v35.js:1218`
- `__VDTT` — `47_v45_v35.js:1310`
- `v48xGraph` — `47_v45_v35.js:1346`
- `v48xNearest` — `47_v45_v35.js:1348`
- `v48xAllowed` — `47_v45_v35.js:1349`
- `v48xPathfind` — `47_v45_v35.js:1350`
- `v48xSites` — `47_v45_v35.js:1351`
- `v48xExplored` — `47_v45_v35.js:1352`
- `v48xGateOpen` — `47_v45_v35.js:1353`
- `v48xSave` — `47_v45_v35.js:1355`

### `48_v48_v47.js` — 33 hàm (1 ★)

- `v48xLoad` — `48_v48_v47.js:2`
- `v48xActivate` — `48_v48_v47.js:3`
- `v48xEnter` — `48_v48_v47.js:4`
- `v48xExit` — `48_v48_v47.js:5`
- `v48xGo` — `48_v48_v47.js:6`
- `v48xNear` — `48_v48_v47.js:7`
- `v48xInteract` — `48_v48_v47.js:8`
- `v48xUpdateView` — `48_v48_v47.js:9`
- `v48xUpdate` — `48_v48_v47.js:10`
- `v48xClick` — `48_v48_v47.js:18`
- `v48xDrawHero` — `48_v48_v47.js:19`
- `v48xDrawMarker` — `48_v48_v47.js:20`
- `v48xDraw` — `48_v48_v47.js:21`
- `v48tTravel` — `48_v48_v47.js:50`
- `owMiniMap` — `48_v48_v47.js:113`
- `owMiniMapAtlas` — `48_v48_v47.js:128`
- `v46ExplorerKey` — `48_v48_v47.js:143`
- `v46EnsurePlayerId` — `48_v48_v47.js:167`
- `v47tBlocked` — `48_v48_v47.js:210`
- `v47tInteractNPC` — `48_v48_v47.js:237`
- `v47tInteract` — `48_v48_v47.js:241`
- `v47tMapGoal` — `48_v48_v47.js:249`
- `v47tClick` — `48_v48_v47.js:258`
- `v47tUpdate` — `48_v48_v47.js:269`
- `v47tDrawHero` — `48_v48_v47.js:299`
- `v47tDraw` — `48_v48_v47.js:310`
- `v36Leave` — `48_v48_v47.js:411` ★
- `v47tClick` — `48_v48_v47.js:417`
- `v48xDrawHero` — `48_v48_v47.js:431`
- `v48xUpdate` — `48_v48_v47.js:432`
- `v48xEnter` — `48_v48_v47.js:433`
- `v42PerfWarmupTick` — `48_v48_v47.js:434`
- `fn` — `48_v48_v47.js:454`

## Hàm không có dữ liệu CDP (V8 chưa biên dịch trong lần chạy này)

Tổng **139** hàm. Phần lớn là hàm chỉ được định nghĩa trong nhánh/đối tượng chưa từng chạm tới, hoặc tên CDP không khớp mẫu quét (vd `img.onload`). Coi như chưa chạy cho tới khi có bằng chứng ngược.

### `01_core.js` — 1 hàm

- `dustRand` — `01_core.js:421`

### `03_v8_v22.js` — 5 hàm

- `draw` — `03_v8_v22.js:87`
- `draw` — `03_v8_v22.js:89`
- `draw` — `03_v8_v22.js:89` (định nghĩa thứ 2 cùng dòng)
- `draw` — `03_v8_v22.js:90`
- `draw` — `03_v8_v22.js:90` (định nghĩa thứ 2 cùng dòng)

### `05_v8_v11.js` — 2 hàm

- `owNearest` — `05_v8_v11.js:71`
- `P` — `05_v8_v11.js:90`

### `06_v10_v9.js` — 4 hàm

- `fn` — `06_v10_v9.js:129`
- `fn` — `06_v10_v9.js:129` (định nghĩa thứ 2 cùng dòng)
- `fn` — `06_v10_v9.js:132`
- `fn` — `06_v10_v9.js:180`

### `07_v11_v10.js` — 5 hàm

- `fn` — `07_v11_v10.js:30`
- `fn` — `07_v11_v10.js:30` (định nghĩa thứ 2 cùng dòng)
- `sword` — `07_v11_v10.js:32`
- `orb` — `07_v11_v10.js:32`
- `fn` — `07_v11_v10.js:35`

### `08_v12_v8.js` — 1 hàm

- `fn` — `08_v12_v8.js:118`

### `10_v14_v15.js` — 1 hàm

- `fn` — `10_v14_v15.js:79`

### `11_v16_v15.js` — 3 hàm

- `draw` — `11_v16_v15.js:93`
- `tx` — `11_v16_v15.js:102`
- `ty` — `11_v16_v15.js:102`

### `12_v18_v17.js` — 9 hàm

- `fn` — `12_v18_v17.js:11`
- `fn` — `12_v18_v17.js:12`
- `fn` — `12_v18_v17.js:14`
- `fn` — `12_v18_v17.js:14` (định nghĩa thứ 2 cùng dòng)
- `fn` — `12_v18_v17.js:17`
- `fn` — `12_v18_v17.js:44`
- `fn` — `12_v18_v17.js:46`
- `fn` — `12_v18_v17.js:46` (định nghĩa thứ 2 cùng dòng)
- `fn` — `12_v18_v17.js:47`

### `13_v21_v18.js` — 2 hàm

- `fn` — `13_v21_v18.js:37`
- `fn` — `13_v21_v18.js:40`

### `14_v22_v23.js` — 1 hàm

- `inRoad` — `14_v22_v23.js:96`

### `16_v26_v25.js` — 1 hàm

- `point` — `16_v26_v25.js:267`

### `19_v29_v28.js` — 1 hàm

- `fn` — `19_v29_v28.js:82`

### `20_v30_v21.js` — 3 hàm

- `fn` — `20_v30_v21.js:78`
- `fn` — `20_v30_v21.js:82`
- `fn` — `20_v30_v21.js:82` (định nghĩa thứ 2 cùng dòng)

### `22_v33_v32.js` — 8 hàm

- `fn` — `22_v33_v32.js:68`
- `fn` — `22_v33_v32.js:68` (định nghĩa thứ 2 cùng dòng)
- `fn` — `22_v33_v32.js:72`
- `fn` — `22_v33_v32.js:72` (định nghĩa thứ 2 cùng dòng)
- `fn` — `22_v33_v32.js:72` (định nghĩa thứ 3 cùng dòng)
- `fn` — `22_v33_v32.js:72` (định nghĩa thứ 4 cùng dòng)
- `close` — `22_v33_v32.js:74`
- `fn` — `22_v33_v32.js:76`

### `23_v34_v21.js` — 7 hàm

- `fn` — `23_v34_v21.js:26`
- `fn` — `23_v34_v21.js:26` (định nghĩa thứ 2 cùng dòng)
- `fn` — `23_v34_v21.js:26` (định nghĩa thứ 3 cùng dòng)
- `fn` — `23_v34_v21.js:26` (định nghĩa thứ 4 cùng dòng)
- `fn` — `23_v34_v21.js:35`
- `fn` — `23_v34_v21.js:36`
- `fn` — `23_v34_v21.js:38`

### `24_v35_v34.js` — 1 hàm

- `fn` — `24_v35_v34.js:32`

### `25_v36_v37.js` — 8 hàm

- `key` — `25_v36_v37.js:33`
- `rect` — `25_v36_v37.js:42`
- `poly` — `25_v36_v37.js:42`
- `ellipse` — `25_v36_v37.js:42`
- `fn` — `25_v36_v37.js:61`
- `actor` — `25_v36_v37.js:62`
- `hero` — `25_v36_v37.js:62`
- `draw` — `25_v36_v37.js:62`

### `26_v38_v37.js` — 5 hàm

- `rect` — `26_v38_v37.js:30`
- `line` — `26_v38_v37.js:30`
- `poly` — `26_v38_v37.js:30`
- `ell` — `26_v38_v37.js:30`
- `grad` — `26_v38_v37.js:30`

### `27_v41_v16.js` — 1 hàm

- `point` — `27_v41_v16.js:140`

### `29_v41_v25.js` — 3 hàm

- `path` — `29_v41_v25.js:72`
- `point` — `29_v41_v25.js:154`
- `onscreen` — `29_v41_v25.js:157`

### `30_v41_v35.js` — 1 hàm

- `fn` — `30_v41_v35.js:251`

### `31_v41_v8.js` — 4 hàm

- `fn` — `31_v41_v8.js:14`
- `fn` — `31_v41_v8.js:33`
- `rect` — `31_v41_v8.js:51`
- `line` — `31_v41_v8.js:51`

### `32_env_assets.js` — 2 hàm

- `rect` — `32_env_assets.js:286`
- `ln` — `32_env_assets.js:287`

### `33_atmosphere.js` — 1 hàm

- `flush` — `33_atmosphere.js:125`

### `36_hud.js` — 2 hàm

- `fn` — `36_hud.js:45`
- `fn` — `36_hud.js:332`

### `37_equipment_assets.js` — 2 hàm

- `fn` — `37_equipment_assets.js:259`
- `fn` — `37_equipment_assets.js:263`

### `38_save.js` — 3 hàm

- `restoreKey` — `38_save.js:45`
- `restoreStorage` — `38_save.js:46`
- `clean` — `38_save.js:63`

### `39_campaign_fixes.js` — 7 hàm

- `key` — `39_campaign_fixes.js:55`
- `pt` — `39_campaign_fixes.js:55`
- `free` — `39_campaign_fixes.js:56`
- `edge` — `39_campaign_fixes.js:57`
- `h` — `39_campaign_fixes.js:61`
- `push` — `39_campaign_fixes.js:62`
- `pop` — `39_campaign_fixes.js:63`

### `40_audio.js` — 9 hàm

- `place` — `40_audio.js:115`
- `w` — `40_audio.js:116`
- `h` — `40_audio.js:116`
- `right` — `40_audio.js:117`
- `bottom` — `40_audio.js:117`
- `fmt` — `40_audio.js:217`
- `pct` — `40_audio.js:217`
- `sign` — `40_audio.js:225`
- `fn` — `40_audio.js:229`

### `41_codex.js` — 3 hàm

- `fn` — `41_codex.js:114`
- `fn` — `41_codex.js:134`
- `fn` — `41_codex.js:149`

### `42_cultivation_ui.js` — 9 hàm

- `fn` — `42_cultivation_ui.js:52`
- `fn` — `42_cultivation_ui.js:78`
- `fn` — `42_cultivation_ui.js:79`
- `fn` — `42_cultivation_ui.js:81`
- `fn` — `42_cultivation_ui.js:82`
- `fn` — `42_cultivation_ui.js:83`
- `fn` — `42_cultivation_ui.js:84`
- `fn` — `42_cultivation_ui.js:85`
- `fn` — `42_cultivation_ui.js:98`

### `43_sect_ui.js` — 4 hàm

- `fn` — `43_sect_ui.js:21`
- `fn` — `43_sect_ui.js:29`
- `fn` — `43_sect_ui.js:36`
- `fn` — `43_sect_ui.js:41`

### `44_photo.js` — 6 hàm

- `worldHud` — `44_photo.js:22`
- `text` — `44_photo.js:22`
- `v41PText` — `44_photo.js:22`
- `v8DrawRoute` — `44_photo.js:22`
- `v8Cursor` — `44_photo.js:22`
- `d` — `44_photo.js:347`

### `45_v43_v42.js` — 2 hàm

- `at` — `45_v43_v42.js:10`
- `fn` — `45_v43_v42.js:24`

### `46_v44_v35.js` — 4 hàm

- `fn` — `46_v44_v35.js:69`
- `actor` — `46_v44_v35.js:187`
- `hero` — `46_v44_v35.js:187`
- `draw` — `46_v44_v35.js:188`

### `47_v45_v35.js` — 8 hàm

- `at` — `47_v45_v35.js:609`
- `fn` — `47_v45_v35.js:657`
- `nameLines` — `47_v45_v35.js:861`
- `fn` — `47_v45_v35.js:1016`
- `fn` — `47_v45_v35.js:1030`
- `dot` — `47_v45_v35.js:1082`
- `V48_ROUTES` — `47_v45_v35.js:1318`
- `join` — `47_v45_v35.js:1350`

## Giới hạn (đọc trước khi xóa code)

- Hàm chỉ chạy qua một nhánh khác: V8 tính cả hàm "đã chạy" nếu được gọi dù 1 lần, dù các nhánh khác trong hàm chưa bao giờ chạy. Ngược lại, hàm được gọi nhưng return sớm vẫn tính là đã chạy. Vì vậy "chưa chạy" đáng tin hơn "đã chạy" — danh sách hàm chết mới là phần chắc chắn nhất.
- Các đường đi chưa chạy trong lần này: nhân vật phái khác chỉ chạy qua menu (không vào sâu), boss các vùng, bí cảnh, nội thất, nhiệm vụ tuyến sau, chế độ Khám phá (V48X), cửa hàng/đổi đồ, trang bị/công pháp chi tiết, cài đặt đồ họa... — hàm của chúng hiện là "chưa chạy" không có nghĩa là code chết vĩnh viễn.
- Quét định nghĩa bằng regex nên có thể sót method viết kiểu lạ, hoặc nhận nhầm (đã loại từ khóa điều khiển); đối chiếu CDP theo tên + offset nên hàm ẩn danh/không tên rõ có thể rơi vào mục "không có dữ liệu".
- Đo trên máy ảo headless Chromium, seed ngẫu nhiên cố định — đường đi của NPC/quái có thể khác đôi chút mỗi lần chạy; chạy lại có thể làm vài hàm đổi trạng thái.

## Việc tiếp theo

- Theo gói G01: làm M03 (soát lỗi hiển thị ở 3 cỡ màn hình) tiếp.
- Claude dùng bảng này cho T07/T08/T09 (gộp hàm): ưu tiên các hàm ★ chưa chạy, rồi tới file có % thấp nhất.

