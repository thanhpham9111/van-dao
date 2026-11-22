"""Sinh data/town_layout.js bản 2 (Claude, 22/11/2026): thôn 4400x2600, bố cục lại cho thoáng.
Chạy: python3 tools/gen_town_layout.py   (giữ nguyên câu thoại 'chatter' của bản cũ)
Ý đồ bố cục (bắc ở trên, nhìn 3/4 từ nam):
- Mép bắc: dãy vách núi liền (bg_cliff_*). Đại điện dựa lưng vào núi ở giữa; Động phủ khoét vào vách ở đông bắc.
- Giữa: đường đá từ bậc Đại điện xuống quảng trường lát đá (giếng, bảng ủy thác, ghế, đèn lồng).
- Tây: Đan phòng (tây bắc), Thương nhân + 3 sạp chợ dọc đường cái, Lò rèn (tây); rừng trúc dọc mép tây.
- Đông: nhà Tán tu, Sân luyện (hình nộm + giá binh khí).
- Sông chảy tây→đông ở phần nam, 2 cầu (đá ở giữa, gỗ ở đông), bến câu bờ bắc.
- Nam sông: ruộng linh điền (tây nam), trạm Hộ vệ + Cổng ra Thanh Trúc Lâm (đông nam).
Cây không đặt trên đường/cầu/chân nhà (script tự kiểm và báo).
"""
import json, re, math, random
random.seed(7)
W, H = 4400, 2600
RIVER = (1960, 2090)          # mép bắc / nam của nước
objs, pts = [], []
def ob(id, asset, x, y, w, h, foot=None, **kw):
    if foot is None: foot = {"x": -round(w*0.4), "y": -80, "w": round(w*0.8), "h": 64}
    d = {"id": id, "asset": asset, "x": x, "y": y, "w": w, "h": h, "foot": foot}; d.update(kw); objs.append(d); return d
small = lambda w: {"x": -round(w/2), "y": -22, "w": w, "h": 20}
none = {"x": 0, "y": 0, "w": 0, "h": 0}

# --- nền rừng mây phía sau dãy núi (vẽ trước mọi thứ: back=True)
for n, bx in enumerate([900, 2300, 3700]):
    ob(f"backdrop_{n}", "bg_mid", bx, 470, 2000, 470, foot=none, back=True, flip=bool(n % 2))
# --- dãy vách núi bắc (chân y 400–470), đá chồng 2 lớp cho dày
x = -120; i = 0
while x < W + 200:
    k = i % 4 + 1
    ob(f"cliff_b{i}", f"bg_cliff_{k}", x, 360 + (i % 3) * 18, 640, 420, foot=none, flip=bool(i % 2)); x += 470; i += 1
x = 120; j = 0
while x < W:
    k = (j + 2) % 4 + 1
    if not (1700 < x < 2700):   # sau Đại điện để trống cho mái nổi lên
        ob(f"cliff_f{j}", f"bg_cliff_{k}", x, 470 + (j % 2) * 22, 600, 400, foot=none, flip=bool((j + 1) % 2))
    x += 560; j += 1
# Động phủ khoét vào vách: hai bên có vách đè sát
ob("b_cave", "b_cave", 3560, 640, 700, 520, foot={"x": -330, "y": -150, "w": 660, "h": 120})
ob("cliff_cave_l", "bg_cliff_2", 3150, 610, 520, 360, foot={"x": -240, "y": -120, "w": 480, "h": 100})
ob("cliff_cave_r", "bg_cliff_4", 3990, 600, 540, 370, foot={"x": -250, "y": -120, "w": 500, "h": 100}, flip=True)
ob("t_pine_cave", "t_pine_1", 3830, 470, 260, 300, foot=none)

# --- Đại điện + quảng trường
ob("b_inn", "b_inn", 2200, 800, 960, 760, foot={"x": -400, "y": -110, "w": 800, "h": 90})
ob("b_well", "b_well", 2200, 1260, 180, 180, foot={"x": -70, "y": -60, "w": 140, "h": 50})
ob("b_board", "b_board", 1930, 1180, 180, 220, foot={"x": -60, "y": -30, "w": 120, "h": 26})
for n, (lx, ly) in enumerate([(2080, 960), (2320, 960), (1860, 1460), (2540, 1460), (1200, 1450), (3000, 1450), (3600, 1450)]):
    ob(f"p_lantern_{n}", "p_lantern_2", lx, ly, 90, 150, foot=small(30))
ob("p_rail_l", "p_rail_stone", 1930, 1060, 220, 100, foot={"x": -110, "y": -30, "w": 220, "h": 26})
ob("p_rail_r", "p_rail_stone", 2470, 1060, 220, 100, foot={"x": -110, "y": -30, "w": 220, "h": 26})

# cờ + thùng (GÓI 06 bổ sung)
for n, (bx, by, a) in enumerate([(2060, 1080, "p_banner_1"), (2340, 1080, "p_banner_1"), (3860, 2470, "p_banner_2"), (3170, 1290, "p_banner_2"), (3600, 1250, "p_banner_1")]):
    ob(f"banner_{n}", a, bx, by, 80, 150, foot=small(26))
# --- tây
ob("b_herbalist", "b_herbalist", 1150, 980, 560, 360)
ob("b_shop", "b_shop", 1250, 1400, 580, 360)
for n, sx in enumerate([1450, 1680, 1910]):   # dãy chợ phía nam đường cái
    ob(f"s_stall_{n+1}", f"s_stall_{n+1}", sx, 1700, 200, 170, foot={"x": -85, "y": -45, "w": 170, "h": 38})
ob("b_forge", "b_forge", 620, 1400, 560, 380)
ob("p_crate_1", "p_crate", 900, 1440, 70, 70, foot=small(50))
ob("p_crate_2", "p_crate", 1560, 1410, 70, 70, foot=small(50))
ob("p_barrel_1", "p_barrel", 860, 1370, 70, 80, foot=small(50))
ob("p_barrel_2", "p_barrel", 1600, 1370, 66, 76, foot=small(48))
ob("p_barrel_3", "p_barrel", 3000, 1940, 62, 72, foot=small(46))

# --- đông
ob("b_wanderer", "b_wanderer", 3250, 1230, 540, 360)
for n, dx in enumerate([3700, 3830, 3960]):
    ob(f"s_dummy_{n+1}", f"s_dummy_{n+1}", dx, 1300, 120, 180, foot=small(40))
ob("s_rack", "s_rack", 4080, 1420, 220, 170, foot={"x": -100, "y": -40, "w": 200, "h": 34})

# --- sông + cầu + bến
ob("s_bridge_stone", "s_bridge_stone", 2200, 2080, 440, 240, foot=none)
ob("s_bridge_wood", "s_bridge_wood", 3700, 2070, 380, 200, foot=none)
ob("p_pier", "p_pier", 2900, 1990, 200, 180, foot=none)

# --- nam sông
ob("s_field_1", "s_field", 900, 2420, 440, 300, foot=none)
ob("s_field_2", "s_field", 1360, 2420, 440, 300, foot=none)
ob("p_fence_1", "p_fence_wood", 660, 2470, 200, 100, foot={"x": -100, "y": -24, "w": 200, "h": 22})
ob("p_fence_2", "p_fence_wood", 1600, 2470, 200, 100, foot={"x": -100, "y": -24, "w": 200, "h": 22})
ob("b_sentry", "b_sentry", 3420, 2420, 520, 340)
ob("b_gate", "b_gate", 4060, 2540, 560, 520, foot={"x": -280, "y": -70, "w": 120, "h": 60})

# --- đường
paths = [
  {"tile": "stone", "width": 120, "points": [[2200, 820], [2200, 1100]]},
  {"tile": "dirt", "width": 120, "points": [[260, 1520], [1000, 1520], [1800, 1530], [2600, 1530], [3400, 1540], [4250, 1520]]},
  {"tile": "dirt", "width": 110, "points": [[2200, 1440], [2200, 1960]]},
  {"tile": "dirt", "width": 110, "points": [[2200, 2200], [2200, 2300], [3000, 2330], [3700, 2300], [4060, 2520]]},
  {"tile": "dirt", "width": 100, "points": [[2200, 2300], [1700, 2300], [1130, 2250]]},
  {"tile": "dirt", "width": 90, "points": [[3700, 1540], [3700, 1960]]},
  {"tile": "dirt", "width": 90, "points": [[3700, 2180], [3700, 2300]]},
  {"tile": "dirt", "width": 90, "points": [[1880, 1260], [1500, 1120], [1150, 1000]]},
  {"tile": "dirt", "width": 90, "points": [[2520, 1180], [2950, 900], [3560, 660]]},
  {"tile": "dirt", "width": 80, "points": [[3000, 1530], [3250, 1260]]},
  {"tile": "dirt", "width": 80, "points": [[620, 1430], [620, 1520]]},
  {"tile": "dirt", "width": 80, "points": [[1250, 1420], [1250, 1520]]},
  {"tile": "dirt", "width": 70, "points": [[2900, 1540], [2900, 1940]]},
  {"tile": "dirt", "width": 80, "points": [[3160, 2320], [3160, 2480], [3420, 2480]]},   # vòng ra cửa trước trạm Hộ vệ
]
tiles = [
  {"tile": "stone", "poly": [[1820, 1090], [2580, 1090], [2620, 1470], [1780, 1470]]},
  {"tile": "grass_b", "poly": [[3580, 1180], [4250, 1180], [4250, 1470], [3580, 1470]]},
  {"tile": "grass_b", "poly": [[600, 700], [1500, 700], [1500, 820], [600, 820]]},
  {"tile": "sand", "poly": [[0, RIVER[0]-50], [W, RIVER[0]-50], [W, RIVER[0]], [0, RIVER[0]]]},
  {"tile": "sand", "poly": [[0, RIVER[1]], [W, RIVER[1]], [W, RIVER[1]+50], [0, RIVER[1]+50]]},
]
# nước: chừa lỗ ở hai cầu
gaps = [(2010, 2390), (3530, 3870)]
water = []; x0 = 0
for a, b in gaps:
    water.append([[x0, RIVER[0]], [a, RIVER[0]], [a, RIVER[1]], [x0, RIVER[1]]]); x0 = b
water.append([[x0, RIVER[0]], [W, RIVER[0]], [W, RIVER[1]], [x0, RIVER[1]]])
blocks = [{"x": 0, "y": 0, "w": W, "h": 520}, {"x": 0, "y": 0, "w": 40, "h": H}, {"x": W-40, "y": 0, "w": 40, "h": H},
          {"x": 0, "y": H-30, "w": W, "h": 30}, {"x": 0, "y": 0, "w": 260, "h": H}, {"x": 4220, "y": 2470, "w": 120, "h": 60}]

def segd(px, py, ax, ay, bx, by):
    dx, dy = bx-ax, by-ay; L2 = dx*dx+dy*dy or 1; t = max(0, min(1, ((px-ax)*dx+(py-ay)*dy)/L2))
    return math.hypot(px-(ax+t*dx), py-(ay+t*dy))
def clear(x, y, pad):
    if y < 560 or x < 40 or x > W-40 or y > H-40: return False
    if RIVER[0]-80 < y < RIVER[1]+70: return False
    for p in paths:
        q = p["points"]
        for k in range(1, len(q)):
            if segd(x, y, *q[k-1], *q[k]) < p["width"]/2 + pad: return False
    for o in objs:
        f = o["foot"]
        if o["asset"].startswith(("t_", "bg_cliff")) and not f["w"]: continue
        bx0, by0 = o["x"]-o["w"]/2, o["y"]-min(o["h"], 260)
        if bx0-pad < x < o["x"]+o["w"]/2+pad and by0-pad*.5 < y < o["y"]+pad*.6: return False
    for t in tiles[:1]:
        xs = [a for a, _ in t["poly"]]; ys = [b for _, b in t["poly"]]
        if min(xs)-pad < x < max(xs)+pad and min(ys)-pad < y < max(ys)+pad: return False
    return True
def tree(id, asset, x, y, w, h, pad=70, **kw):
    if clear(x, y, pad):
        ob(id, asset, x, y, w, h, foot={"x": -22, "y": -24, "w": 44, "h": 22}, **kw); return True
    return False

# rừng trúc mép tây (sau khối chặn x<260)
n = 0
for yy in range(620, 2560, 95):
    for xx in (70, 170, 260):
        jx, jy = random.randint(-25, 25), random.randint(-20, 20)
        ob(f"t_bamboo_{n:02d}", f"t_bamboo_{n%3+1}", xx+jx, yy+jy, 150, 400 + (n % 3)*30, foot=none, sway=True); n += 1
# cây có chủ ý (thử từng chỗ, chỗ vướng thì bỏ)
want = [
 ("t_cherry_1", 1640, 900, 200, 400), ("t_cherry_2", 2780, 930, 200, 400), ("t_pine_2", 1450, 760, 190, 430),
 ("t_pine_1", 2960, 760, 180, 400), ("t_cherry_1", 1700, 1250, 190, 360), ("t_cherry_2", 2700, 1300, 190, 360),
 ("t_willow", 700, 1880, 220, 420), ("t_willow", 1150, 1890, 220, 420), ("t_willow", 2600, 1880, 220, 420), ("t_willow", 3300, 1890, 220, 420),
 ("t_willow", 4150, 1880, 220, 420), ("t_pine_2", 520, 1050, 190, 430), ("t_pine_1", 820, 760, 180, 400),
 ("t_cherry_2", 3600, 1050, 190, 380), ("t_pine_2", 4200, 1000, 190, 430), ("t_pine_1", 4250, 760, 180, 400),
 ("t_cherry_1", 600, 2250, 190, 380), ("t_pine_2", 1900, 2480, 190, 430), ("t_cherry_2", 2650, 2480, 190, 380),
 ("t_pine_1", 3000, 2500, 180, 400), ("t_willow", 4300, 2250, 220, 420), ("t_cherry_1", 2500, 2280, 190, 360),
 ("t_pine_2", 3950, 820, 190, 430), ("t_cherry_2", 1000, 1200, 180, 340),
]
for k, (a, x, y, w, h) in enumerate(want):
    if not tree(f"tree_{k:02d}", a, x, y, w, h):
        print("bỏ cây (vướng):", a, x, y)
# đá + bụi rải rác
for k, (a, x, y, w, h) in enumerate([("r_rock_3", 2720, 640, 120, 80), ("r_rock_1", 1500, 620, 70, 100), ("r_rock_5", 4300, 1700, 130, 90),
     ("r_rock_2", 450, 2400, 130, 85), ("r_rock_4", 2500, 2500, 120, 80), ("r_rock_3", 3350, 1700, 110, 70), ("r_rock_1", 1000, 1880, 60, 90)]):
    tree(f"rock_{k}", a, x, y, w, h, pad=40)
bush_spots = [(1480, 1000), (870, 990), (1500, 1430), (2960, 1260), (3530, 1270), (820, 1720), (2560, 1700), (3150, 2450), (3700, 2460), (1850, 2400), (420, 1300), (4200, 1300), (2850, 1740), (1350, 1760)]
for k, (x, y) in enumerate(bush_spots):
    tree(f"bush_{k}", f"p_bush_{k%6+1}", x, y, 110, 90, pad=30, sway=True)

pts += [
 {"id": "inn", "name": "Đại điện · Trưởng lão", "x": 2200, "y": 830},
 {"id": "shop", "name": "Thương nhân", "x": 1250, "y": 1420},
 {"id": "herbalist", "name": "Đan phòng", "x": 1150, "y": 1000},
 {"id": "wanderer", "name": "Tán tu", "x": 3250, "y": 1250},
 {"id": "sentry", "name": "Hộ vệ đường", "x": 3420, "y": 2450},
 {"id": "v13_forge", "name": "Lò rèn", "x": 620, "y": 1420},
 {"id": "v13_market", "name": "Chợ linh vật", "x": 1680, "y": 1740},
 {"id": "v13_board", "name": "Bảng ủy thác", "x": 1930, "y": 1210},
 {"id": "v13_farm", "name": "Linh điền", "x": 1130, "y": 2250},
 {"id": "training", "name": "Sân luyện", "x": 3830, "y": 1380},
 {"id": "v31_cave", "name": "Động phủ", "x": 3560, "y": 680},
 {"id": "bench_1", "kind": "bench", "name": "Ghế đá quảng trường", "x": 2450, "y": 1400},
 {"id": "bell_1", "kind": "bell", "name": "Chuông đại điện", "x": 2700, "y": 860},
 {"id": "well_1", "kind": "well", "name": "Giếng làng", "x": 2200, "y": 1290},
 {"id": "fishing_1", "kind": "fishing", "name": "Bến câu cá", "x": 2900, "y": 1930},
 {"id": "door_inn", "kind": "door", "name": "Cửa đại điện", "x": 2200, "y": 830},
 {"id": "door_shop", "kind": "door", "name": "Cửa tiệm linh dược", "x": 1250, "y": 1300},
]
gates = [{"to": "truc", "x": 4060, "y": 2510, "r": 90, "ax": 3960, "ay": 2340}]  # ax,ay: chỗ đứng khi từ rừng về (trên đường, ngoài chân cột cổng)
smoke = [{"x": 1060, "y": 690}, {"x": 520, "y": 1110}, {"x": 1400, "y": 1150}]
old = open("data/town_layout.js", encoding="utf-8").read()
chat = re.search(r"\"?chatter\"?:(\[.*?\]),\n", old, re.S).group(1)
L = {"version": 2, "w": W, "h": H, "spawn": {"x": 2200, "y": 1560}, "life": {"river_y": sum(RIVER)//2, "river": list(RIVER)}}
body = ",\n".join([
 '"version":2', f'"w":{W}', f'"h":{H}', '"spawn":{"x":2200,"y":1560}', f'"life":{json.dumps(L["life"])}',
 '/* M3: câu thoại đời thường của dân làng (bong bóng thoại khi đi ngang người chơi). */\n"chatter":' + chat,
 '"smoke":' + json.dumps(smoke, ensure_ascii=False), '"tiles":' + json.dumps(tiles), '"decals":[]',
 '"objects":[\n' + ",\n".join(json.dumps(o, ensure_ascii=False) for o in objs) + "\n]",
 '"paths":' + json.dumps(paths), '"water":' + json.dumps(water), '"blocks":' + json.dumps(blocks),
 '"points":[\n' + ",\n".join(json.dumps(p, ensure_ascii=False) for p in pts) + "\n]", '"gates":' + json.dumps(gates)])
open("data/town_layout.js", "w", encoding="utf-8").write(
 "'use strict';\n/* TỰ SINH bởi tools/gen_town_layout.py (bản 2, 4400x2600) — sửa script rồi chạy lại, không sửa tay. */\nDATA.town_layout = {\n" + body + "\n};\n")
print("objects", len(objs), "points", len(pts))
