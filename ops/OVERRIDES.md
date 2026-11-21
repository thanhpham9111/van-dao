# BẢN ĐỒ HÀM BỊ VÁ CHỒNG

Tự sinh bởi tools/overrides.py từ thư mục src/ — KHÔNG sửa tay.
Mỗi dòng "gán lại" là một lớp vá kiểu `const old = fn; fn = function(){ old(); ... }`.
Phiên bản CHẠY THẬT là chuỗi các lớp, lớp cuối (file số lớn nhất) bọc ngoài cùng.
Gộp = đọc từ lớp đầu tới lớp cuối, viết lại thành MỘT định nghĩa duy nhất có hành vi y hệt, đặt ở vị trí lớp cuối, xoá các lớp trước.

Tổng: 109 hàm có từ 2 lớp vá trở lên.

| Hàm | Số lớp | Khai báo gốc | Lớp cuối (đang chạy) |
|---|---|---|---|
| `update` | 33 | 01_core.js:326 | 48_v48_v47.js:410 |
| `worldHud` | 25 | 02_v10_v8.js:129 | 47_v45_v35.js:644 |
| `resume` | 19 | 01_core.js:224 | 48_v48_v47.js:411 |
| `panel` | 18 | 01_core.js:520 | 47_v45_v35.js:862 |
| `start` | 16 | 01_core.js:200 | 48_v48_v47.js:160 |
| `hud` | 12 | 01_core.js:477 | 24_v35_v34.js:38 |
| `hdDrawPOI` | 12 | 04_v11_v46.js:50 | 37_equipment_assets.js:235 |
| `hit` | 11 | 01_core.js:231 | 41_codex.js:54 |
| `renderEffects` | 10 | 01_core.js:444 | 28_v41_v25.js:176 |
| `hdGroundChunk` | 10 | 04_v11_v46.js:16 | 44_photo.js:166 |
| `hdEffects` | 10 | 04_v11_v46.js:55 | 38_save.js:251 |
| `v8InteractAt` | 9 | 05_v8_v11.js:69 | 37_equipment_assets.js:219 |
| `worldMapPanel` | 8 | 02_v10_v8.js:143 | 48_v48_v47.js:415 |
| `owInteract` | 8 | 03_v8_v22.js:55 | 37_equipment_assets.js:220 |
| `v8PointerDown` | 8 | 05_v8_v11.js:74 | 44_photo.js:275 |
| `v9HeroBody` | 8 | 06_v10_v9.js:24 | 35_animation.js:104 |
| `v9NPCDraw` | 8 | 06_v10_v9.js:75 | 35_animation.js:148 |
| `v21DeathLoot` | 8 | 13_v21_v18.js:19 | 41_codex.js:56 |
| `owMiniMap` | 7 | 03_v8_v22.js:83 | 48_v48_v47.js:108 |
| `v24DecorDraw` | 7 | 15_v25_v24.js:58 | 33_atmosphere.js:168 |
| `damagePlayer` | 6 | 01_core.js:243 | 30_v41_v35.js:97 |
| `menu` | 6 | 01_core.js:507 | 40_audio.js:91 |
| `draw` | 6 | 01_core.js:572 | 44_photo.js:327 |
| `worldDraw` | 6 | 02_v10_v8.js:144 | 48_v48_v47.js:96 |
| `hdAtmosphere` | 6 | 04_v11_v46.js:53 | 27_v41_v16.js:334 |
| `v8SetGoal` | 6 | 05_v8_v11.js:70 | 48_v48_v47.js:384 |
| `v35Target` | 6 | 24_v35_v34.js:25 | 47_v45_v35.js:163 |
| `currentStats` | 5 | 01_core.js:186 | 21_v31_v30.js:68 |
| `owChunk` | 5 | 03_v8_v22.js:31 | 32_env_assets.js:58 |
| `owEnemy` | 5 | 03_v8_v22.js:57 | 38_save.js:197 |
| `hdShadow` | 5 | 04_v11_v46.js:46 | 44_photo.js:187 |
| `hdDrawProp` | 5 | 04_v11_v46.js:47 | 26_v38_v37.js:57 |
| `hdMonster` | 5 | 04_v11_v46.js:49 | 38_save.js:243 |
| `v17House` | 5 | 12_v18_v17.js:3 | 32_env_assets.js:232 |
| `v21Inventory` | 5 | 13_v21_v18.js:36 | 36_hud.js:221 |
| `v24Material` | 5 | 15_v25_v24.js:10 | 32_env_assets.js:108 |
| `v35Map` | 5 | 24_v35_v34.js:23 | 47_v45_v35.js:115 |
| `v35Quest` | 5 | 24_v35_v34.js:24 | 47_v45_v35.js:160 |
| `equipStats` | 4 | 01_core.js:156 | 20_v30_v21.js:45 |
| `spawn` | 4 | 01_core.js:205 | 39_campaign_fixes.js:157 |
| `attack` | 4 | 01_core.js:254 | 16_v26_v25.js:147 |
| `cast` | 4 | 01_core.js:260 | 16_v26_v25.js:164 |
| `heroSprite` | 4 | 01_core.js:376 | 21_v31_v30.js:73 |
| `ornament` | 4 | 01_core.js:456 | 47_v45_v35.js:34 |
| `owNearest` | 4 | 03_v8_v22.js:54 | 25_v36_v37.js:21 |
| `hdView` | 4 | 04_v11_v46.js:9 | 32_env_assets.js:75 |
| `hdHero` | 4 | 04_v11_v46.js:48 | 26_v38_v37.js:69 |
| `v8NPCUpdate` | 4 | 05_v8_v11.js:33 | 22_v33_v32.js:9 |
| `v8Talk` | 4 | 05_v8_v11.js:45 | 25_v36_v37.js:24 |
| `v8Panel` | 4 | 05_v8_v11.js:111 | 31_v41_v8.js:72 |
| `v8Journal` | 4 | 05_v8_v11.js:119 | 38_save.js:307 |
| `v16DrawDecor` | 4 | 11_v16_v15.js:101 | 32_env_assets.js:263 |
| `v18Frame` | 4 | 12_v18_v17.js:31 | 47_v45_v35.js:33 |
| `v21Tooltip` | 4 | 13_v21_v18.js:35 | 20_v30_v21.js:85 |
| `v22Atlas` | 4 | 14_v22_v23.js:55 | 47_v45_v35.js:478 |
| `v24Textures` | 4 | 15_v25_v24.js:7 | 32_env_assets.js:80 |
| `v24Water` | 4 | 15_v25_v24.js:44 | 33_atmosphere.js:161 |
| `v26Charge` | 4 | 16_v26_v25.js:249 | 35_animation.js:320 |
| `v27Render` | 4 | 17_v27_v26.js:80 | 39_campaign_fixes.js:203 |
| `v35State` | 4 | 24_v35_v34.js:6 | 46_v44_v35.js:16 |
| `v35Identity` | 4 | 24_v35_v34.js:20 | 47_v45_v35.js:67 |
| `v35Status` | 4 | 24_v35_v34.js:21 | 47_v45_v35.js:95 |
| `v35Dock` | 4 | 24_v35_v34.js:28 | 47_v45_v35.js:174 |
| `v35Left` | 4 | 24_v35_v34.js:29 | 47_v45_v35.js:242 |
| `v35Nav` | 4 | 24_v35_v34.js:30 | 47_v45_v35.js:254 |
| `v35Feed` | 4 | 24_v35_v34.js:31 | 47_v45_v35.js:265 |
| `v36Backdrop` | 4 | 25_v36_v37.js:41 | 32_env_assets.js:281 |
| `v36Mini` | 4 | 25_v36_v37.js:60 | 47_v45_v35.js:676 |
| `generateWorld` | 3 | 01_core.js:143 | 20_v30_v21.js:56 |
| `text` | 3 | 01_core.js:175 | 44_photo.js:22 |
| `gainXP` | 3 | 01_core.js:198 | 14_v22_v23.js:27 |
| `enterRoom` | 3 | 01_core.js:208 | 18_v28_v21.js:24 |
| `save` | 3 | 01_core.js:218 | 38_save.js:207 |
| `updateEnemy` | 3 | 01_core.js:267 | 28_v41_v25.js:122 |
| `advance` | 3 | 01_core.js:322 | 20_v30_v21.js:65 |
| `monsterSprite` | 3 | 01_core.js:385 | 16_v26_v25.js:108 |
| `enterWorld` | 3 | 02_v10_v8.js:67 | 05_v8_v11.js:29 |
| `worldUpdate` | 3 | 02_v10_v8.js:86 | 48_v48_v47.js:98 |
| `roadDistance` | 3 | 03_v8_v22.js:24 | 44_photo.js:100 |
| `owSpawn` | 3 | 03_v8_v22.js:46 | 39_campaign_fixes.js:156 |
| `owDiscover` | 3 | 03_v8_v22.js:50 | 40_audio.js:51 |
| `hdHouseArt` | 3 | 04_v11_v46.js:40 | 11_v16_v15.js:91 |
| `v8Reset` | 3 | 05_v8_v11.js:24 | 14_v22_v23.js:66 |
| `v8NPC` | 3 | 05_v8_v11.js:31 | 22_v33_v32.js:17 |
| `v8Input` | 3 | 05_v8_v11.js:75 | 39_campaign_fixes.js:93 |
| `v8Figure` | 3 | 05_v8_v11.js:87 | 16_v26_v25.js:71 |
| `v9DrawCell` | 3 | 06_v10_v9.js:18 | 16_v26_v25.js:26 |
| `v11SkillPanel` | 3 | 07_v11_v10.js:28 | 36_hud.js:310 |
| `v14Move` | 3 | 10_v14_v15.js:48 | 22_v33_v32.js:16 |
| `v16LandmarkArt` | 3 | 11_v16_v15.js:94 | 32_env_assets.js:258 |
| `v17Signs` | 3 | 12_v18_v17.js:10 | 27_v41_v16.js:348 |
| `v21Scope` | 3 | 13_v21_v18.js:17 | 20_v30_v21.js:66 |
| `v22Break` | 3 | 14_v22_v23.js:30 | 40_audio.js:55 |
| `v25MonsterBody` | 3 | 16_v26_v25.js:77 | 28_v41_v25.js:153 |
| `v26Add` | 3 | 16_v26_v25.js:128 | 35_animation.js:275 |
| `v26Push` | 3 | 16_v26_v25.js:148 | 38_save.js:196 |
| `v26Render` | 3 | 16_v26_v25.js:266 | 35_animation.js:335 |
| `v27Tick` | 3 | 17_v27_v26.js:43 | 39_campaign_fixes.js:185 |
| `v27Zone` | 3 | 17_v27_v26.js:79 | 35_animation.js:366 |
| `v33Button` | 3 | 22_v33_v32.js:61 | 46_v44_v35.js:74 |
| `v33Drawer` | 3 | 22_v33_v32.js:74 | 36_hud.js:377 |
| `v35Plate` | 3 | 24_v35_v34.js:16 | 30_v41_v35.js:168 |
| `v35Control` | 3 | 24_v35_v34.js:19 | 46_v44_v35.js:197 |
| `v36Leave` | 3 | 25_v36_v37.js:18 | 48_v48_v47.js:386 |
| `v36HUD` | 3 | 25_v36_v37.js:61 | 47_v45_v35.js:690 |
| `v41PFrame` | 3 | 31_v41_v8.js:13 | 47_v45_v35.js:32 |
| `v41PButton` | 3 | 31_v41_v8.js:14 | 47_v45_v35.js:655 |
| `v42cSkill` | 3 | 35_animation.js:244 | 47_v45_v35.js:758 |
| `v42HUDShell` | 3 | 36_hud.js:47 | 47_v45_v35.js:35 |

## Vị trí mọi lớp (file:dòng, theo thứ tự chạy) — 30 hàm nặng nhất

### `update` — 33 lớp
01_core.js:326, 06_v10_v9.js:164, 07_v11_v10.js:43, 08_v12_v8.js:108, 09_v13_v8.js:91, 10_v14_v15.js:88, 13_v21_v18.js:48, 14_v22_v23.js:62, 14_v22_v23.js:82, 16_v26_v25.js:205, 17_v27_v26.js:89, 18_v28_v21.js:98, 19_v29_v28.js:74, 20_v30_v21.js:67, 21_v31_v30.js:82, 22_v33_v32.js:80, 24_v35_v34.js:39, 25_v36_v37.js:65, 28_v41_v25.js:179, 30_v41_v35.js:104, 31_v41_v8.js:39, 33_atmosphere.js:88, 35_animation.js:178, 35_animation.js:295, 37_equipment_assets.js:222, 38_save.js:82, 38_save.js:216, 40_audio.js:240, 41_codex.js:69, 44_photo.js:41, 44_photo.js:277, 47_v45_v35.js:864, 48_v48_v47.js:410

### `worldHud` — 25 lớp
02_v10_v8.js:129, 03_v8_v22.js:85, 05_v8_v11.js:121, 06_v10_v9.js:139, 06_v10_v9.js:181, 07_v11_v10.js:35, 08_v12_v8.js:124, 09_v13_v8.js:89, 10_v14_v15.js:85, 11_v16_v15.js:124, 12_v18_v17.js:18, 12_v18_v17.js:55, 13_v21_v18.js:51, 14_v22_v23.js:61, 14_v22_v23.js:106, 16_v26_v25.js:282, 17_v27_v26.js:91, 19_v29_v28.js:72, 20_v30_v21.js:86, 21_v31_v30.js:95, 22_v33_v32.js:79, 24_v35_v34.js:38, 27_v41_v16.js:21, 44_photo.js:22, 47_v45_v35.js:644

### `resume` — 19 lớp
01_core.js:224, 03_v8_v22.js:53, 05_v8_v11.js:28, 07_v11_v10.js:11, 08_v12_v8.js:45, 09_v13_v8.js:90, 10_v14_v15.js:87, 11_v16_v15.js:127, 14_v22_v23.js:40, 18_v28_v21.js:27, 19_v29_v28.js:27, 20_v30_v21.js:63, 21_v31_v30.js:81, 25_v36_v37.js:64, 37_equipment_assets.js:217, 38_save.js:215, 41_codex.js:66, 48_v48_v47.js:161, 48_v48_v47.js:411

### `panel` — 18 lớp
01_core.js:520, 05_v8_v11.js:120, 06_v10_v9.js:137, 07_v11_v10.js:33, 09_v13_v8.js:88, 10_v14_v15.js:84, 12_v18_v17.js:40, 13_v21_v18.js:46, 19_v29_v28.js:82, 20_v30_v21.js:83, 21_v31_v30.js:94, 24_v35_v34.js:35, 37_equipment_assets.js:287, 38_save.js:81, 38_save.js:306, 40_audio.js:238, 41_codex.js:163, 47_v45_v35.js:862

### `start` — 16 lớp
01_core.js:200, 05_v8_v11.js:27, 08_v12_v8.js:44, 09_v13_v8.js:90, 10_v14_v15.js:87, 11_v16_v15.js:127, 14_v22_v23.js:40, 18_v28_v21.js:28, 19_v29_v28.js:75, 20_v30_v21.js:64, 21_v31_v30.js:80, 37_equipment_assets.js:216, 38_save.js:79, 38_save.js:214, 41_codex.js:65, 48_v48_v47.js:160

### `hud` — 12 lớp
01_core.js:477, 06_v10_v9.js:140, 07_v11_v10.js:35, 08_v12_v8.js:124, 13_v21_v18.js:51, 16_v26_v25.js:282, 17_v27_v26.js:91, 18_v28_v21.js:115, 19_v29_v28.js:86, 20_v30_v21.js:69, 22_v33_v32.js:79, 24_v35_v34.js:38

### `hdDrawPOI` — 12 lớp
04_v11_v46.js:50, 05_v8_v11.js:108, 09_v13_v8.js:75, 10_v14_v15.js:71, 11_v16_v15.js:30, 11_v16_v15.js:104, 12_v18_v17.js:9, 21_v31_v30.js:79, 22_v33_v32.js:51, 25_v36_v37.js:29, 27_v41_v16.js:20, 37_equipment_assets.js:235

### `hit` — 11 lớp
01_core.js:231, 08_v12_v8.js:47, 10_v14_v15.js:63, 14_v22_v23.js:41, 16_v26_v25.js:184, 17_v27_v26.js:68, 18_v28_v21.js:108, 23_v34_v21.js:18, 28_v41_v25.js:167, 38_save.js:183, 41_codex.js:54

### `renderEffects` — 10 lớp
01_core.js:444, 06_v10_v9.js:177, 07_v11_v10.js:47, 15_v25_v24.js:74, 16_v26_v25.js:114, 16_v26_v25.js:279, 17_v27_v26.js:88, 18_v28_v21.js:113, 20_v30_v21.js:68, 28_v41_v25.js:176

### `hdGroundChunk` — 10 lớp
04_v11_v46.js:16, 11_v16_v15.js:33, 12_v18_v17.js:47, 14_v22_v23.js:90, 15_v25_v24.js:27, 22_v33_v32.js:32, 26_v38_v37.js:21, 27_v41_v16.js:190, 32_env_assets.js:212, 44_photo.js:166

### `hdEffects` — 10 lớp
04_v11_v46.js:55, 06_v10_v9.js:177, 07_v11_v10.js:47, 14_v22_v23.js:103, 15_v25_v24.js:73, 16_v26_v25.js:114, 16_v26_v25.js:279, 17_v27_v26.js:88, 28_v41_v25.js:175, 38_save.js:251

### `v8InteractAt` — 9 lớp
05_v8_v11.js:69, 09_v13_v8.js:71, 10_v14_v15.js:72, 14_v22_v23.js:50, 18_v28_v21.js:26, 19_v29_v28.js:25, 21_v31_v30.js:77, 25_v36_v37.js:22, 37_equipment_assets.js:219

### `worldMapPanel` — 8 lớp
02_v10_v8.js:143, 03_v8_v22.js:84, 03_v8_v22.js:98, 11_v16_v15.js:55, 11_v16_v15.js:120, 14_v22_v23.js:59, 47_v45_v35.js:638, 48_v48_v47.js:415

### `owInteract` — 8 lớp
03_v8_v22.js:55, 05_v8_v11.js:44, 09_v13_v8.js:72, 10_v14_v15.js:73, 14_v22_v23.js:51, 21_v31_v30.js:78, 25_v36_v37.js:23, 37_equipment_assets.js:220

### `v8PointerDown` — 8 lớp
05_v8_v11.js:74, 13_v21_v18.js:49, 14_v22_v23.js:79, 23_v34_v21.js:17, 25_v36_v37.js:39, 38_save.js:231, 44_photo.js:50, 44_photo.js:275

### `v9HeroBody` — 8 lớp
06_v10_v9.js:24, 06_v10_v9.js:175, 14_v22_v23.js:77, 16_v26_v25.js:33, 16_v26_v25.js:232, 26_v38_v37.js:53, 28_v41_v25.js:73, 35_animation.js:104

### `v9NPCDraw` — 8 lớp
06_v10_v9.js:75, 11_v16_v15.js:12, 14_v22_v23.js:86, 16_v26_v25.js:72, 22_v33_v32.js:24, 26_v38_v37.js:54, 28_v41_v25.js:95, 35_animation.js:148

### `v21DeathLoot` — 8 lớp
13_v21_v18.js:19, 14_v22_v23.js:46, 18_v28_v21.js:107, 19_v29_v28.js:59, 20_v30_v21.js:49, 21_v31_v30.js:69, 37_equipment_assets.js:221, 41_codex.js:56

### `owMiniMap` — 7 lớp
03_v8_v22.js:83, 03_v8_v22.js:97, 08_v12_v8.js:123, 10_v14_v15.js:86, 11_v16_v15.js:47, 11_v16_v15.js:117, 48_v48_v47.js:108

### `v24DecorDraw` — 7 lớp
15_v25_v24.js:58, 26_v38_v37.js:19, 26_v38_v37.js:58, 27_v41_v16.js:16, 27_v41_v16.js:280, 32_env_assets.js:244, 33_atmosphere.js:168

### `damagePlayer` — 6 lớp
01_core.js:243, 06_v10_v9.js:163, 09_v13_v8.js:53, 14_v22_v23.js:43, 16_v26_v25.js:194, 30_v41_v35.js:97

### `menu` — 6 lớp
01_core.js:507, 05_v8_v11.js:132, 12_v18_v17.js:63, 31_v41_v8.js:22, 38_save.js:80, 40_audio.js:91

### `draw` — 6 lớp
01_core.js:572, 05_v8_v11.js:143, 31_v41_v8.js:40, 32_env_assets.js:37, 44_photo.js:39, 44_photo.js:327

### `worldDraw` — 6 lớp
02_v10_v8.js:144, 03_v8_v22.js:90, 04_v11_v46.js:57, 22_v33_v32.js:47, 25_v36_v37.js:63, 48_v48_v47.js:96

### `hdAtmosphere` — 6 lớp
04_v11_v46.js:53, 12_v18_v17.js:42, 14_v22_v23.js:104, 15_v25_v24.js:61, 26_v38_v37.js:60, 27_v41_v16.js:334

### `v8SetGoal` — 6 lớp
05_v8_v11.js:70, 14_v22_v23.js:80, 25_v36_v37.js:25, 39_campaign_fixes.js:77, 48_v48_v47.js:104, 48_v48_v47.js:384

### `v35Target` — 6 lớp
24_v35_v34.js:25, 30_v41_v35.js:288, 38_save.js:258, 39_campaign_fixes.js:208, 46_v44_v35.js:158, 47_v45_v35.js:163

### `currentStats` — 5 lớp
01_core.js:186, 06_v10_v9.js:109, 06_v10_v9.js:151, 07_v11_v10.js:26, 21_v31_v30.js:68

### `owChunk` — 5 lớp
03_v8_v22.js:31, 11_v16_v15.js:89, 27_v41_v16.js:12, 27_v41_v16.js:34, 32_env_assets.js:58

### `owEnemy` — 5 lớp
03_v8_v22.js:57, 14_v22_v23.js:42, 17_v27_v26.js:65, 28_v41_v25.js:121, 38_save.js:197

