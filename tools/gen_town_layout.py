"""Sinh data/town_layout.js bản 3 (Claude, 22/11/2026): NGOẠI MÔN SƠN MÔN TIÊN HIỆP, 4800x3200.
Chạy: python3 tools/gen_town_layout.py   (giữ nguyên câu thoại 'chatter' của bản trước)
Theo concept "Bản đồ sơn môn tiên hiệp" + góp ý ops/specs/son_mon_layout.md (bắc ở trên, nhìn 3/4 từ nam):
- NAM: sơn môn (cổng) + điểm xuất hiện → đường đá thẳng → cầu đá qua sông → quảng trường bát quái.
- GIỮA: quảng trường tròn (bảng nhiệm vụ trước-trái, linh tuyền trước-phải), giữ trống cho người.
- BẮC: Đại điện trên THỀM CAO, lên bằng bậc đá lớn; lầu chuông trên thềm phụ đông bắc.
- TÂY/TÂY BẮC: Tàng kinh các (thềm), xá đệ tử, đình luyện đan + dược viên (luống thuốc).
- ĐÔNG: lò luyện khí, sân luyện kiếm có rào (lối vào phía tây quay về quảng trường).
- ĐÔNG BẮC: động phủ khoét vào vách, có phù ấn phong (mở khi động phủ cấp >= 1).
- ĐÔNG NAM: cầu gỗ dẫn tới linh điền (có mục đích riêng). TÂY NAM: ao sen.
Sprite mới chưa có ảnh dùng 'fallback' (ảnh cũ gần nhất, giữ tỉ lệ) cho tới khi ChatGPT nộp GÓI 07.
Thềm cao (terraces) = mặt trên + mặt tường kè + bậc đá đi được; va chạm chặn tường, chừa bậc.
"""
import json, re, math, random
random.seed(11)
W, H = 4800, 3200
RIVER = (2500, 2630)
objs, pts = [], []
def ob(id, asset, x, y, w, h, foot=None, **kw):
    if foot is None: foot = {"x": -round(w*0.4), "y": -80, "w": round(w*0.8), "h": 64}
    d = {"id": id, "asset": asset, "x": x, "y": y, "w": w, "h": h, "foot": foot}; d.update(kw); objs.append(d); return d
small = lambda w: {"x": -round(w/2), "y": -22, "w": w, "h": 20}
none = {"x": 0, "y": 0, "w": 0, "h": 0}

# ---------- thềm cao
terraces = [
  {"id": "main", "x": 1720, "y": 560, "w": 1360, "h": 560, "face": 80, "tile": "stone", "stairs": [{"x": 2290, "w": 220}]},
  {"id": "bell", "x": 3180, "y": 620, "w": 560, "h": 420, "face": 64, "tile": "grass_a", "stairs": [{"x": 3400, "w": 130}]},
  {"id": "scripture", "x": 860, "y": 600, "w": 760, "h": 400, "face": 64, "tile": "grass_a", "stairs": [{"x": 1190, "w": 140}]},
]
plaza = {"x": 2400, "y": 1780, "r": 540}

# ---------- nền rừng mây + dãy vách núi bắc
for n, bx in enumerate([900, 2300, 3700, 5000]):
    ob(f"backdrop_{n}", "bg_mid", bx, 470, 2000, 470, foot=none, back=True, flip=bool(n % 2))
x = -120; i = 0
while x < W + 200:
    ob(f"cliff_b{i}", f"bg_cliff_{i%4+1}", x, 360 + (i % 3) * 18, 640, 420, foot=none, flip=bool(i % 2)); x += 470; i += 1
x = 140; j = 0
while x < W:
    if not (1650 < x < 3150) and not (800 < x < 1700):
        ob(f"cliff_f{j}", f"bg_cliff_{(j+2)%4+1}", x, 480 + (j % 2) * 22, 600, 400, foot=none, flip=bool((j + 1) % 2))
    x += 560; j += 1

# ---------- BẮC: Đại điện trên thềm + lầu chuông
ob("b_sect_hall", "b_sect_hall", 2400, 1010, 1040, 820, fallback="b_inn", foot={"x": -440, "y": -120, "w": 880, "h": 100})
for n, bx in enumerate([2230, 2570]):
    ob(f"hall_banner_{n}", "p_banner_sect", bx, 1100, 90, 220, fallback="p_banner_1", foot=small(26))
for n, (lx, ly) in enumerate([(2250, 1250), (2550, 1250), (1830, 1080), (2970, 1080)]):
    ob(f"stair_lantern_{n}", "p_lantern_2", lx, ly, 90, 150, foot=small(30))
ob("p_incense", "p_incense_burner", 2400, 1095, 150, 160, foot=none)
ob("b_bell_tower", "b_bell_tower", 3460, 960, 380, 560, fallback="p_bell", foot={"x": -120, "y": -70, "w": 240, "h": 60})
# ---------- TÂY BẮC: Tàng kinh các trên thềm + hành lang
ob("b_scripture", "b_scripture_pavilion", 1240, 930, 560, 760, fallback="b_wanderer", foot={"x": -230, "y": -100, "w": 460, "h": 80})
ob("corridor_1", "s_covered_corridor_1", 1670, 900, 220, 220, foot=none)
# ---------- TÂY: xá đệ tử, đình luyện đan, dược viên
ob("b_dorm", "b_outer_dormitory", 1100, 1460, 720, 480, fallback="b_shop", foot={"x": -290, "y": -90, "w": 580, "h": 70})
ob("b_alchemy", "b_alchemy_pavilion", 760, 1980, 560, 520, fallback="b_herbalist", foot={"x": -230, "y": -90, "w": 460, "h": 70})
for n, (fx, fy) in enumerate([(1180, 2330), (1620, 2330)]):
    ob(f"herb_bed_{n}", "s_herb_bed_1", fx, fy, 420, 260, fallback="s_field", foot=none)
ob("b_shop", "b_shop", 1560, 1960, 560, 360, foot={"x": -224, "y": -80, "w": 448, "h": 64})
# ---------- quảng trường
ob("b_board", "b_board", 2140, 2010, 200, 240, fallback=None, foot={"x": -70, "y": -30, "w": 140, "h": 26})
ob("p_spring", "p_spirit_spring", 2680, 2030, 300, 230, fallback="b_well", foot={"x": -90, "y": -60, "w": 180, "h": 50})
for n, a in enumerate(range(0, 360, 45)):
    if a in (90,):  # chừa lối nam ra cầu
        continue
    r = plaza["r"] + 30; lx = plaza["x"] + r*math.cos(math.radians(a)); ly = plaza["y"] + r*math.sin(math.radians(a))*0.62 + (0 if a not in (0, 180) else 0)
    if a == 270: continue   # chừa lối bắc lên bậc
    ob(f"plaza_lantern_{n}", "p_lantern_stone", round(lx), round(ly), 80, 110, fallback="p_lantern_1", foot=small(26))
for n, (sx) in enumerate([1880, 2080]):
    ob(f"s_stall_{n+1}", f"s_stall_{n+1}", sx, 2420, 200, 170, foot={"x": -85, "y": -45, "w": 170, "h": 38})
ob("s_stall_3", "s_stall_3", 2900, 2420, 200, 170, foot={"x": -85, "y": -45, "w": 170, "h": 38})
ob("p_bench_a", "p_bench_stone", 2010, 1620, 130, 70, foot=small(90))
ob("p_bench_b", "p_bench_stone", 2790, 1620, 130, 70, foot=small(90))
# ---------- ĐÔNG: lò luyện khí + sân luyện kiếm có rào
ob("b_forge", "b_forge", 3420, 1560, 600, 420, foot={"x": -240, "y": -90, "w": 480, "h": 70})
ob("p_barrel_1", "p_barrel", 3760, 1520, 70, 80, foot=small(50))
ob("p_crate_1", "p_crate", 3080, 1540, 70, 70, foot=small(50))
YARD = (3560, 1760, 4560, 2260)
tiles_extra = [{"tile": "stone", "poly": [[YARD[0], YARD[1]], [YARD[2], YARD[1]], [YARD[2], YARD[3]], [YARD[0], YARD[3]]]}]
for n, rx in enumerate(range(YARD[0]+110, YARD[2], 220)):
    ob(f"yard_rail_n{n}", "p_rail_stone", rx, YARD[1]+20, 220, 100, foot={"x": -110, "y": -26, "w": 220, "h": 24})
    ob(f"yard_rail_s{n}", "p_rail_stone", rx, YARD[3]+40, 220, 100, foot={"x": -110, "y": -26, "w": 220, "h": 24})
for n, ry in enumerate([YARD[1]+180, YARD[3]-30]):   # rào phía tây: chừa lối giữa (y ~2000)
    ob(f"yard_rail_w{n}", "p_fence_wood", YARD[0], ry, 120, 70, foot={"x": -20, "y": -60, "w": 40, "h": 60})
ob("yard_rail_e", "p_fence_wood", YARD[2], 2010, 120, 70, foot={"x": -20, "y": -240, "w": 40, "h": 480})
for n, dx in enumerate([3860, 4020, 4180]):
    ob(f"s_dummy_{n+1}", f"s_dummy_{n+1}", dx, 1930, 120, 180, foot=small(40))
for n, tx in enumerate([3900, 4140]):
    ob(f"p_target_{n}", "p_target", tx, 2180, 120, 170, fallback="s_dummy_2", foot=small(40))
ob("s_rack", "s_rack", 4400, 2050, 220, 170, foot={"x": -100, "y": -40, "w": 200, "h": 34})
for n, (bx, by) in enumerate([(3640, 1900), (3640, 2150), (4480, 1880)]):
    ob(f"yard_banner_{n}", "p_banner_sect", bx, by, 80, 200, fallback="p_banner_2", foot=small(24))
# ---------- ĐÔNG BẮC: động phủ khoét vào vách + phù ấn
ob("b_cave", "b_cave", 4260, 900, 720, 540, foot={"x": -340, "y": -160, "w": 680, "h": 130})
ob("p_cave_seal", "p_cave_seal", 4260, 905, 260, 300, foot=none, noShadow=True)
ob("cliff_cave_l", "bg_cliff_2", 3860, 860, 520, 360, foot={"x": -240, "y": -120, "w": 480, "h": 100})
ob("cliff_cave_r", "bg_cliff_4", 4680, 850, 540, 370, foot={"x": -250, "y": -120, "w": 500, "h": 100}, flip=True)
ob("cave_stele_l", "r_rock_1", 4040, 990, 90, 130, foot=small(50))
ob("cave_stele_r", "r_rock_1", 4480, 990, 90, 130, foot=small(50), flip=True)
# ---------- sông, cầu, ao sen
ob("s_bridge_stone", "s_bridge_stone", 2400, 2620, 460, 250, foot=none)
ob("s_bridge_wood", "s_bridge_wood", 3960, 2610, 380, 200, foot=none)
ob("p_pier", "p_pier", 3300, 2520, 200, 180, foot=none)
# ---------- ĐÔNG NAM: linh điền
for n, fx in enumerate([3900, 4360]):
    ob(f"s_field_{n+1}", "s_field", fx, 2980, 440, 300, foot=none)
ob("p_fence_1", "p_fence_wood", 3640, 3040, 200, 100, foot={"x": -100, "y": -24, "w": 200, "h": 22})
ob("p_fence_2", "p_fence_wood", 4620, 3040, 200, 100, foot={"x": -100, "y": -24, "w": 200, "h": 22})
# ---------- NAM: sơn môn + trạm hộ vệ
ob("b_gate", "b_sect_gate", 2400, 3150, 640, 560, fallback="b_gate", foot={"x": -320, "y": -70, "w": 140, "h": 60})
for n, gx in enumerate([2130, 2670]):
    ob(f"gate_lion_{n}", "p_lion_statue", gx, 3080, 150, 190, flip=bool(n), foot=small(80))
    ob(f"gate_banner_{n}", "p_banner_sect", gx + (-90 if n == 0 else 90), 3060, 90, 230, fallback="p_banner_1", foot=small(26))
ob("b_sentry", "b_sentry", 1760, 2930, 440, 300)

paths = [
  {"tile": "stone", "width": 150, "points": [[2400, 3120], [2400, 2690]]},
  {"tile": "stone", "width": 150, "points": [[2400, 2440], [2400, 2300]]},
  {"tile": "stone", "width": 120, "points": [[2400, 1250], [2400, 1100]]},
  {"tile": "stone", "width": 110, "points": [[2400, 2965], [1760, 2965]]},
  {"tile": "dirt", "width": 100, "points": [[1880, 1680], [1500, 1600], [1100, 1500]]},
  {"tile": "dirt", "width": 90, "points": [[1500, 1600], [1260, 1300], [1260, 1040]]},
  {"tile": "dirt", "width": 100, "points": [[1870, 1880], [1560, 1980]]},
  {"tile": "dirt", "width": 100, "points": [[1560, 1980], [1100, 2000], [760, 2010]]},
  {"tile": "dirt", "width": 80, "points": [[1100, 2000], [1180, 2100], [1620, 2110]]},
  {"tile": "dirt", "width": 100, "points": [[2935, 1700], [3420, 1600]]},
  {"tile": "dirt", "width": 110, "points": [[2940, 1900], [3300, 2010], [3620, 2010]]},
  {"tile": "dirt", "width": 90, "points": [[2850, 1440], [3200, 1200], [3465, 1100], [3465, 1000]]},
  {"tile": "dirt", "width": 90, "points": [[3200, 1200], [3700, 1150], [4260, 1000]]},
  {"tile": "dirt", "width": 90, "points": [[2780, 2200], [3300, 2340], [3960, 2350], [3960, 2500]]},
  {"tile": "dirt", "width": 80, "points": [[3300, 2340], [3300, 2470]]},
  {"tile": "stone", "width": 90, "points": [[3620, 2010], [4020, 2040]]},
  {"tile": "dirt", "width": 90, "points": [[3960, 2720], [3960, 2780], [4130, 2800]]},
  {"tile": "dirt", "width": 80, "points": [[1980, 2250], [1980, 2380]]},
]
tiles = tiles_extra + [
  {"tile": "grass_b", "poly": [[300, 1700], [520, 1700], [520, 2200], [300, 2200]]},
  {"tile": "sand", "poly": [[0, RIVER[0]-50], [W, RIVER[0]-50], [W, RIVER[0]], [0, RIVER[0]]]},
  {"tile": "sand", "poly": [[0, RIVER[1]], [W, RIVER[1]], [W, RIVER[1]+50], [0, RIVER[1]+50]]},
]
gaps = [(2190, 2610), (3790, 4130)]
water = []; x0 = 0
for a, b in gaps:
    water.append([[x0, RIVER[0]], [a, RIVER[0]], [a, RIVER[1]], [x0, RIVER[1]]]); x0 = b
water.append([[x0, RIVER[0]], [W, RIVER[0]], [W, RIVER[1]], [x0, RIVER[1]]])
water.append([[560, 2700], [1260, 2690], [1340, 2860], [1150, 2960], [640, 2950], [500, 2820]])   # ao sen tây nam
lilies = [[700, 2780], [820, 2860], [960, 2760], [1100, 2850], [760, 2900], [1200, 2760], [900, 2920], [1040, 2720]]
blocks = [{"x": 0, "y": 0, "w": W, "h": 540}, {"x": 0, "y": 0, "w": 40, "h": H}, {"x": W-40, "y": 0, "w": 40, "h": H},
          {"x": 0, "y": H-30, "w": W, "h": 30}, {"x": 0, "y": 0, "w": 260, "h": H}, {"x": 2560, "y": 3080, "w": 140, "h": 60},
          {"x": 3740, "y": 540, "w": 1060, "h": 230}]

def segd(px, py, ax, ay, bx, by):
    dx, dy = bx-ax, by-ay; L2 = dx*dx+dy*dy or 1; t = max(0, min(1, ((px-ax)*dx+(py-ay)*dy)/L2))
    return math.hypot(px-(ax+t*dx), py-(ay+t*dy))
def clear(x, y, pad):
    if y < 600 or x < 40 or x > W-40 or y > H-40: return False
    if RIVER[0]-80 < y < RIVER[1]+70: return False
    if math.hypot(x-plaza["x"], (y-plaza["y"])) < plaza["r"] + pad: return False
    for t in terraces:
        if t["x"]-pad < x < t["x"]+t["w"]+pad and t["y"]-pad < y < t["y"]+t["h"]+t["face"]+pad: return False
    for p in paths:
        q = p["points"]
        for k in range(1, len(q)):
            if segd(x, y, *q[k-1], *q[k]) < p["width"]/2 + pad: return False
    for o in objs:
        f = o["foot"]
        if o["asset"].startswith(("t_", "bg_cliff", "bg_mid")) and not f["w"]: continue
        if o.get("back"): continue
        bx0, by0 = o["x"]-o["w"]/2, o["y"]-min(o["h"], 260)
        if bx0-pad < x < o["x"]+o["w"]/2+pad and by0-pad*.5 < y < o["y"]+pad*.6: return False
    for t in tiles_extra:
        xs = [a for a, _ in t["poly"]]; ys = [b for _, b in t["poly"]]
        if min(xs)-pad < x < max(xs)+pad and min(ys)-pad < y < max(ys)+pad: return False
    for poly in water[-1:]:
        xs = [a for a, _ in poly]; ys = [b for _, b in poly]
        if min(xs)-pad < x < max(xs)+pad and min(ys)-pad < y < max(ys)+pad: return False
    return True
dropped = []
def tree(id, asset, x, y, w, h, pad=70, **kw):
    if clear(x, y, pad):
        ob(id, asset, x, y, w, h, foot={"x": -22, "y": -24, "w": 44, "h": 22}, **kw); return True
    dropped.append((asset, x, y)); return False

n = 0   # rừng trúc mép tây
for yy in range(640, 3150, 95):
    for xx in (70, 170, 260):
        ob(f"t_bamboo_{n:02d}", f"t_bamboo_{n%3+1}", xx+random.randint(-25, 25), yy+random.randint(-20, 20), 150, 400+(n % 3)*30, foot=none, sway=True); n += 1
want = [
 ("t_pine_2", 1690, 1240, 190, 430), ("t_pine_1", 3110, 1240, 180, 400), ("t_cherry_1", 1760, 1420, 200, 380), ("t_cherry_2", 3040, 1420, 200, 380),
 ("t_pine_1", 640, 1080, 180, 400), ("t_cherry_2", 1720, 1080, 190, 360), ("t_pine_2", 3880, 1300, 190, 430), ("t_cherry_1", 4560, 1420, 190, 380),
 ("t_willow", 1000, 2440, 220, 420), ("t_willow", 1500, 2450, 220, 420), ("t_willow", 2900, 2460, 220, 420), ("t_willow", 3600, 2460, 220, 420), ("t_willow", 4600, 2440, 220, 420),
 ("t_cherry_2", 1420, 2760, 190, 380), ("t_pine_2", 3000, 2900, 190, 430), ("t_cherry_1", 3300, 3020, 190, 360), ("t_pine_1", 1300, 3080, 180, 400),
 ("t_cherry_2", 2900, 3080, 180, 340), ("t_cherry_1", 1900, 2780, 180, 340), ("t_pine_2", 4650, 2750, 190, 430), ("t_willow", 480, 2600, 220, 420),
 ("t_pine_1", 2050, 1370, 170, 360), ("t_cherry_2", 2780, 1360, 170, 340), ("t_pine_2", 520, 1500, 190, 430), ("t_cherry_1", 3600, 1250, 180, 340),
]
for k, (a, x, y, w, h) in enumerate(want):
    tree(f"tree_{k:02d}", a, x, y, w, h)
for k, (a, x, y, w, h) in enumerate([("r_rock_3", 2000, 2470, 120, 80), ("r_rock_5", 2800, 2470, 130, 90), ("r_rock_2", 1750, 2680, 130, 85),
     ("r_rock_4", 3080, 2700, 120, 80), ("r_rock_3", 4400, 2700, 110, 70), ("r_rock_2", 1380, 2700, 120, 80), ("r_rock_5", 480, 2380, 130, 90),
     ("r_rock_1", 3700, 1200, 70, 100), ("r_rock_3", 600, 1300, 110, 70), ("r_rock_4", 4500, 1500, 120, 80)]):
    tree(f"rock_{k}", a, x, y, w, h, pad=30)
for k, (x, y) in enumerate([(1500, 1380), (700, 1500), (1900, 1980), (2900, 2000), (3150, 1660), (3700, 1580), (1600, 2200), (980, 2200),
                            (2650, 2860), (2150, 2860), (1500, 3000), (3500, 2950), (4700, 2300), (1450, 1150), (3080, 1100)]):
    tree(f"bush_{k}", f"p_bush_{k%6+1}", x, y, 110, 90, pad=30, sway=True)
print("bỏ (vướng):", len(dropped), dropped[:8])

pts += [
 {"id": "inn", "name": "Đại điện · Trưởng lão", "x": 2400, "y": 1045},
 {"id": "shop", "name": "Thương nhân", "x": 1560, "y": 1990},
 {"id": "herbalist", "name": "Đình luyện đan", "x": 760, "y": 2010},
 {"id": "wanderer", "name": "Xá đệ tử · Tán tu", "x": 1100, "y": 1490},
 {"id": "sentry", "name": "Hộ vệ sơn môn", "x": 1760, "y": 2955},
 {"id": "v13_forge", "name": "Lò luyện khí", "x": 3420, "y": 1600},
 {"id": "v13_market", "name": "Chợ linh vật", "x": 1980, "y": 2460},
 {"id": "v13_board", "name": "Bảng nhiệm vụ", "x": 2140, "y": 2040},
 {"id": "v13_farm", "name": "Linh điền", "x": 4130, "y": 2800},
 {"id": "training", "name": "Sân luyện kiếm", "x": 4020, "y": 2040},
 {"id": "v31_cave", "name": "Động phủ", "x": 4260, "y": 1010},
 {"id": "bench_1", "kind": "bench", "name": "Ghế đá quảng trường", "x": 2010, "y": 1650},
 {"id": "bell_1", "kind": "bell", "name": "Lầu chuông", "x": 3465, "y": 990},
 {"id": "well_1", "kind": "well", "name": "Linh tuyền", "x": 2680, "y": 2060},
 {"id": "fishing_1", "kind": "fishing", "name": "Bến câu cá", "x": 3300, "y": 2460},
 {"id": "door_inn", "kind": "door", "name": "Cửa đại điện", "x": 2400, "y": 1045},
 {"id": "door_shop", "kind": "door", "name": "Cửa tiệm", "x": 1560, "y": 1900},
]
gates = [{"to": "truc", "x": 2400, "y": 3140, "r": 90, "ax": 2400, "ay": 2740}]
smoke = [{"x": 3330, "y": 1260}, {"x": 640, "y": 1600}, {"x": 1700, "y": 1700}]
old = open("data/town_layout.js", encoding="utf-8").read()
chat = re.search(r"\"?chatter\"?:(\[.*?\]),\n", old, re.S).group(1)
life = {"river_y": sum(RIVER)//2, "river": list(RIVER)}
body = ",\n".join([
 '"version":3', f'"w":{W}', f'"h":{H}', '"spawn":{"x":2400,"y":2740}', f'"life":{json.dumps(life)}',
 '/* M3: câu thoại đời thường (bong bóng thoại khi đi ngang người chơi). */\n"chatter":' + chat,
 '"smoke":' + json.dumps(smoke), '"tiles":' + json.dumps(tiles), '"decals":[]',
 '"terraces":' + json.dumps(terraces), '"plaza":' + json.dumps(plaza), '"lilies":' + json.dumps(lilies),
 '"objects":[\n' + ",\n".join(json.dumps(o, ensure_ascii=False) for o in objs) + "\n]",
 '"paths":' + json.dumps(paths), '"water":' + json.dumps(water), '"blocks":' + json.dumps(blocks),
 '"points":[\n' + ",\n".join(json.dumps(p, ensure_ascii=False) for p in pts) + "\n]", '"gates":' + json.dumps(gates)])
open("data/town_layout.js", "w", encoding="utf-8").write(
 "'use strict';\n/* TỰ SINH bởi tools/gen_town_layout.py (bản 3: ngoại môn sơn môn, 4800x3200) — sửa script rồi chạy lại, không sửa tay. */\nDATA.town_layout = {\n" + body + "\n};\n")
print("objects", len(objs), "points", len(pts))
