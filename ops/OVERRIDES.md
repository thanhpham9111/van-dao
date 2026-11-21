# BẢN ĐỒ HÀM BỊ VÁ CHỒNG

Tự sinh bởi tools/overrides.py từ thư mục src/ — KHÔNG sửa tay.
Mỗi dòng "gán lại" là một lớp vá kiểu `const old = fn; fn = function(){ old(); ... }`.
Phiên bản CHẠY THẬT là chuỗi các lớp, lớp cuối (file số lớn nhất) bọc ngoài cùng.
Gộp = đọc từ lớp đầu tới lớp cuối, viết lại thành MỘT định nghĩa duy nhất có hành vi y hệt, đặt ở vị trí lớp cuối, xoá các lớp trước.

Tổng: 92 hàm có từ 2 lớp vá trở lên.

| Hàm | Số lớp | Khai báo gốc | Lớp cuối (đang chạy) |
|---|---|---|---|
| `hdDrawPOI` | 12 | 04_v11_v46.js:50 | 37_equipment_assets.js:238 |
| `hit` | 11 | 01_core.js:233 | 41_codex.js:54 |
| `renderEffects` | 10 | 01_core.js:447 | 28_v41_v25.js:176 |
| `hdGroundChunk` | 10 | 04_v11_v46.js:16 | 44_photo.js:167 |
| `hdEffects` | 10 | 04_v11_v46.js:55 | 38_save.js:256 |
| `v8InteractAt` | 9 | 05_v8_v11.js:71 | 37_equipment_assets.js:221 |
| `worldMapPanel` | 8 | 02_v10_v8.js:130 | 48_v48_v47.js:425 |
| `owInteract` | 8 | 03_v8_v22.js:56 | 37_equipment_assets.js:222 |
| `v8PointerDown` | 8 | 05_v8_v11.js:76 | 44_photo.js:276 |
| `v9HeroBody` | 8 | 06_v10_v9.js:24 | 35_animation.js:104 |
| `v9NPCDraw` | 8 | 06_v10_v9.js:75 | 35_animation.js:148 |
| `v21DeathLoot` | 8 | 13_v21_v18.js:19 | 41_codex.js:56 |
| `owMiniMap` | 7 | 03_v8_v22.js:84 | 48_v48_v47.js:108 |
| `v24DecorDraw` | 7 | 15_v25_v24.js:58 | 33_atmosphere.js:169 |
| `damagePlayer` | 6 | 01_core.js:245 | 30_v41_v35.js:97 |
| `draw` | 6 | 01_core.js:545 | 44_photo.js:329 |
| `worldDraw` | 6 | 02_v10_v8.js:131 | 48_v48_v47.js:96 |
| `hdAtmosphere` | 6 | 04_v11_v46.js:53 | 27_v41_v16.js:334 |
| `v8SetGoal` | 6 | 05_v8_v11.js:72 | 48_v48_v47.js:388 |
| `currentStats` | 5 | 01_core.js:186 | 21_v31_v30.js:68 |
| `owChunk` | 5 | 03_v8_v22.js:31 | 32_env_assets.js:58 |
| `owEnemy` | 5 | 03_v8_v22.js:58 | 38_save.js:199 |
| `hdShadow` | 5 | 04_v11_v46.js:46 | 44_photo.js:188 |
| `hdDrawProp` | 5 | 04_v11_v46.js:47 | 26_v38_v37.js:57 |
| `hdMonster` | 5 | 04_v11_v46.js:49 | 38_save.js:248 |
| `v17House` | 5 | 12_v18_v17.js:3 | 32_env_assets.js:232 |
| `v21Inventory` | 5 | 13_v21_v18.js:36 | 36_hud.js:221 |
| `v24Material` | 5 | 15_v25_v24.js:10 | 32_env_assets.js:108 |
| `equipStats` | 4 | 01_core.js:156 | 20_v30_v21.js:45 |
| `spawn` | 4 | 01_core.js:206 | 39_campaign_fixes.js:157 |
| `attack` | 4 | 01_core.js:256 | 16_v26_v25.js:147 |
| `cast` | 4 | 01_core.js:262 | 16_v26_v25.js:164 |
| `heroSprite` | 4 | 01_core.js:379 | 21_v31_v30.js:73 |
| `ornament` | 4 | 01_core.js:459 | 47_v45_v35.js:146 |
| `owNearest` | 4 | 03_v8_v22.js:55 | 25_v36_v37.js:21 |
| `hdView` | 4 | 04_v11_v46.js:9 | 32_env_assets.js:75 |
| `hdHero` | 4 | 04_v11_v46.js:48 | 26_v38_v37.js:69 |
| `v8NPCUpdate` | 4 | 05_v8_v11.js:35 | 22_v33_v32.js:9 |
| `v8Talk` | 4 | 05_v8_v11.js:47 | 25_v36_v37.js:24 |
| `v8Panel` | 4 | 05_v8_v11.js:113 | 31_v41_v8.js:74 |
| `v8Journal` | 4 | 05_v8_v11.js:121 | 38_save.js:304 |
| `v16DrawDecor` | 4 | 11_v16_v15.js:101 | 32_env_assets.js:263 |
| `v18Frame` | 4 | 12_v18_v17.js:25 | 47_v45_v35.js:145 |
| `v21Tooltip` | 4 | 13_v21_v18.js:35 | 20_v30_v21.js:88 |
| `v22Atlas` | 4 | 14_v22_v23.js:57 | 47_v45_v35.js:596 |
| `v24Textures` | 4 | 15_v25_v24.js:7 | 32_env_assets.js:80 |
| `v24Water` | 4 | 15_v25_v24.js:44 | 33_atmosphere.js:162 |
| `v26Charge` | 4 | 16_v26_v25.js:250 | 35_animation.js:322 |
| `v27Render` | 4 | 17_v27_v26.js:80 | 39_campaign_fixes.js:203 |
| `v36Backdrop` | 4 | 25_v36_v37.js:41 | 32_env_assets.js:281 |
| `v36Mini` | 4 | 25_v36_v37.js:60 | 47_v45_v35.js:794 |
| `generateWorld` | 3 | 01_core.js:143 | 20_v30_v21.js:56 |
| `text` | 3 | 01_core.js:175 | 44_photo.js:22 |
| `gainXP` | 3 | 01_core.js:198 | 14_v22_v23.js:27 |
| `enterRoom` | 3 | 01_core.js:209 | 18_v28_v21.js:24 |
| `save` | 3 | 01_core.js:219 | 38_save.js:209 |
| `updateEnemy` | 3 | 01_core.js:269 | 28_v41_v25.js:122 |
| `advance` | 3 | 01_core.js:324 | 20_v30_v21.js:67 |
| `monsterSprite` | 3 | 01_core.js:388 | 16_v26_v25.js:108 |
| `enterWorld` | 3 | 02_v10_v8.js:67 | 05_v8_v11.js:31 |
| `worldUpdate` | 3 | 02_v10_v8.js:86 | 48_v48_v47.js:98 |
| `roadDistance` | 3 | 03_v8_v22.js:24 | 44_photo.js:101 |
| `owSpawn` | 3 | 03_v8_v22.js:46 | 39_campaign_fixes.js:156 |
| `owDiscover` | 3 | 03_v8_v22.js:50 | 40_audio.js:51 |
| `hdHouseArt` | 3 | 04_v11_v46.js:40 | 11_v16_v15.js:91 |
| `v8Reset` | 3 | 05_v8_v11.js:24 | 14_v22_v23.js:69 |
| `v8NPC` | 3 | 05_v8_v11.js:33 | 22_v33_v32.js:17 |
| `v8Input` | 3 | 05_v8_v11.js:77 | 39_campaign_fixes.js:93 |
| `v8Figure` | 3 | 05_v8_v11.js:89 | 16_v26_v25.js:71 |
| `v9DrawCell` | 3 | 06_v10_v9.js:18 | 16_v26_v25.js:26 |
| `v11SkillPanel` | 3 | 07_v11_v10.js:29 | 36_hud.js:310 |
| `v14Move` | 3 | 10_v14_v15.js:48 | 22_v33_v32.js:16 |
| `v16LandmarkArt` | 3 | 11_v16_v15.js:94 | 32_env_assets.js:258 |
| `v17Signs` | 3 | 12_v18_v17.js:10 | 27_v41_v16.js:348 |
| `v21Scope` | 3 | 13_v21_v18.js:17 | 20_v30_v21.js:68 |
| `v22Break` | 3 | 14_v22_v23.js:30 | 40_audio.js:55 |
| `v25MonsterBody` | 3 | 16_v26_v25.js:77 | 28_v41_v25.js:153 |
| `v26Add` | 3 | 16_v26_v25.js:128 | 35_animation.js:276 |
| `v26Push` | 3 | 16_v26_v25.js:148 | 38_save.js:198 |
| `v26Render` | 3 | 16_v26_v25.js:267 | 35_animation.js:337 |
| `v27Tick` | 3 | 17_v27_v26.js:43 | 39_campaign_fixes.js:185 |
| `v27Zone` | 3 | 17_v27_v26.js:79 | 35_animation.js:368 |
| `v33Button` | 3 | 22_v33_v32.js:61 | 46_v44_v35.js:96 |
| `v33Drawer` | 3 | 22_v33_v32.js:74 | 36_hud.js:355 |
| `v35Plate` | 3 | 24_v35_v34.js:16 | 30_v41_v35.js:150 |
| `v35Control` | 3 | 24_v35_v34.js:19 | 46_v44_v35.js:146 |
| `v36Leave` | 3 | 25_v36_v37.js:18 | 48_v48_v47.js:390 |
| `v36HUD` | 3 | 25_v36_v37.js:61 | 47_v45_v35.js:808 |
| `v41PFrame` | 3 | 31_v41_v8.js:13 | 47_v45_v35.js:144 |
| `v41PButton` | 3 | 31_v41_v8.js:14 | 47_v45_v35.js:773 |
| `v42cSkill` | 3 | 35_animation.js:245 | 47_v45_v35.js:876 |
| `v42HUDShell` | 3 | 36_hud.js:47 | 47_v45_v35.js:147 |

## Vị trí mọi lớp (file:dòng, theo thứ tự chạy) — 30 hàm nặng nhất

### `hdDrawPOI` — 12 lớp
04_v11_v46.js:50, 05_v8_v11.js:110, 09_v13_v8.js:75, 10_v14_v15.js:71, 11_v16_v15.js:30, 11_v16_v15.js:104, 12_v18_v17.js:9, 21_v31_v30.js:79, 22_v33_v32.js:51, 25_v36_v37.js:29, 27_v41_v16.js:20, 37_equipment_assets.js:238

### `hit` — 11 lớp
01_core.js:233, 08_v12_v8.js:49, 10_v14_v15.js:63, 14_v22_v23.js:43, 16_v26_v25.js:184, 17_v27_v26.js:68, 18_v28_v21.js:111, 23_v34_v21.js:18, 28_v41_v25.js:167, 38_save.js:185, 41_codex.js:54

### `renderEffects` — 10 lớp
01_core.js:447, 06_v10_v9.js:178, 07_v11_v10.js:49, 15_v25_v24.js:74, 16_v26_v25.js:114, 16_v26_v25.js:280, 17_v27_v26.js:88, 18_v28_v21.js:116, 20_v30_v21.js:71, 28_v41_v25.js:176

### `hdGroundChunk` — 10 lớp
04_v11_v46.js:16, 11_v16_v15.js:33, 12_v18_v17.js:41, 14_v22_v23.js:94, 15_v25_v24.js:27, 22_v33_v32.js:32, 26_v38_v37.js:21, 27_v41_v16.js:190, 32_env_assets.js:212, 44_photo.js:167

### `hdEffects` — 10 lớp
04_v11_v46.js:55, 06_v10_v9.js:178, 07_v11_v10.js:49, 14_v22_v23.js:107, 15_v25_v24.js:73, 16_v26_v25.js:114, 16_v26_v25.js:280, 17_v27_v26.js:88, 28_v41_v25.js:175, 38_save.js:256

### `v8InteractAt` — 9 lớp
05_v8_v11.js:71, 09_v13_v8.js:71, 10_v14_v15.js:72, 14_v22_v23.js:52, 18_v28_v21.js:26, 19_v29_v28.js:25, 21_v31_v30.js:77, 25_v36_v37.js:22, 37_equipment_assets.js:221

### `worldMapPanel` — 8 lớp
02_v10_v8.js:130, 03_v8_v22.js:85, 03_v8_v22.js:95, 11_v16_v15.js:55, 11_v16_v15.js:120, 14_v22_v23.js:61, 47_v45_v35.js:756, 48_v48_v47.js:425

### `owInteract` — 8 lớp
03_v8_v22.js:56, 05_v8_v11.js:46, 09_v13_v8.js:72, 10_v14_v15.js:73, 14_v22_v23.js:53, 21_v31_v30.js:78, 25_v36_v37.js:23, 37_equipment_assets.js:222

### `v8PointerDown` — 8 lớp
05_v8_v11.js:76, 13_v21_v18.js:50, 14_v22_v23.js:82, 23_v34_v21.js:17, 25_v36_v37.js:39, 38_save.js:236, 44_photo.js:51, 44_photo.js:276

### `v9HeroBody` — 8 lớp
06_v10_v9.js:24, 06_v10_v9.js:176, 14_v22_v23.js:80, 16_v26_v25.js:33, 16_v26_v25.js:233, 26_v38_v37.js:53, 28_v41_v25.js:73, 35_animation.js:104

### `v9NPCDraw` — 8 lớp
06_v10_v9.js:75, 11_v16_v15.js:12, 14_v22_v23.js:90, 16_v26_v25.js:72, 22_v33_v32.js:24, 26_v38_v37.js:54, 28_v41_v25.js:95, 35_animation.js:148

### `v21DeathLoot` — 8 lớp
13_v21_v18.js:19, 14_v22_v23.js:48, 18_v28_v21.js:110, 19_v29_v28.js:60, 20_v30_v21.js:49, 21_v31_v30.js:69, 37_equipment_assets.js:223, 41_codex.js:56

### `owMiniMap` — 7 lớp
03_v8_v22.js:84, 03_v8_v22.js:94, 08_v12_v8.js:126, 10_v14_v15.js:86, 11_v16_v15.js:47, 11_v16_v15.js:117, 48_v48_v47.js:108

### `v24DecorDraw` — 7 lớp
15_v25_v24.js:58, 26_v38_v37.js:19, 26_v38_v37.js:58, 27_v41_v16.js:16, 27_v41_v16.js:280, 32_env_assets.js:244, 33_atmosphere.js:169

### `damagePlayer` — 6 lớp
01_core.js:245, 06_v10_v9.js:163, 09_v13_v8.js:53, 14_v22_v23.js:45, 16_v26_v25.js:194, 30_v41_v35.js:97

### `draw` — 6 lớp
01_core.js:545, 05_v8_v11.js:141, 31_v41_v8.js:42, 32_env_assets.js:37, 44_photo.js:39, 44_photo.js:329

### `worldDraw` — 6 lớp
02_v10_v8.js:131, 03_v8_v22.js:87, 04_v11_v46.js:57, 22_v33_v32.js:47, 25_v36_v37.js:63, 48_v48_v47.js:96

### `hdAtmosphere` — 6 lớp
04_v11_v46.js:53, 12_v18_v17.js:36, 14_v22_v23.js:108, 15_v25_v24.js:61, 26_v38_v37.js:60, 27_v41_v16.js:334

### `v8SetGoal` — 6 lớp
05_v8_v11.js:72, 14_v22_v23.js:83, 25_v36_v37.js:25, 39_campaign_fixes.js:77, 48_v48_v47.js:104, 48_v48_v47.js:388

### `currentStats` — 5 lớp
01_core.js:186, 06_v10_v9.js:109, 06_v10_v9.js:151, 07_v11_v10.js:27, 21_v31_v30.js:68

### `owChunk` — 5 lớp
03_v8_v22.js:31, 11_v16_v15.js:89, 27_v41_v16.js:12, 27_v41_v16.js:34, 32_env_assets.js:58

### `owEnemy` — 5 lớp
03_v8_v22.js:58, 14_v22_v23.js:44, 17_v27_v26.js:65, 28_v41_v25.js:121, 38_save.js:199

### `hdShadow` — 5 lớp
04_v11_v46.js:46, 15_v25_v24.js:43, 27_v41_v16.js:231, 32_env_assets.js:25, 44_photo.js:188

### `hdDrawProp` — 5 lớp
04_v11_v46.js:47, 11_v16_v15.js:25, 15_v25_v24.js:46, 22_v33_v32.js:48, 26_v38_v37.js:57

### `hdMonster` — 5 lớp
04_v11_v46.js:49, 14_v22_v23.js:62, 16_v26_v25.js:107, 37_equipment_assets.js:253, 38_save.js:248

### `v17House` — 5 lớp
12_v18_v17.js:3, 26_v38_v37.js:5, 26_v38_v37.js:56, 27_v41_v16.js:90, 32_env_assets.js:232

### `v21Inventory` — 5 lớp
13_v21_v18.js:36, 19_v29_v28.js:87, 20_v30_v21.js:87, 23_v34_v21.js:34, 36_hud.js:221

### `v24Material` — 5 lớp
15_v25_v24.js:10, 26_v38_v37.js:52, 27_v41_v16.js:39, 27_v41_v16.js:107, 32_env_assets.js:108

### `equipStats` — 4 lớp
01_core.js:156, 13_v21_v18.js:14, 19_v29_v28.js:57, 20_v30_v21.js:45

### `spawn` — 4 lớp
01_core.js:206, 14_v22_v23.js:35, 19_v29_v28.js:30, 39_campaign_fixes.js:157

