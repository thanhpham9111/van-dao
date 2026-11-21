DATA.world_map = {
  "version": 1,
  "art": { "asset": "world_map_ink", "width": 1586, "height": 992 },
  "places": [
    { "region": "thon", "label": "Thanh Thạch Thôn", "x": 0.158, "y": 0.260, "seal": "村", "desc": "Thôn nhỏ nép giữa núi xanh, nơi tân tu sĩ bắt đầu bước đường cầu đạo.", "realmHint": "Vùng an toàn" },
    { "region": "truc", "label": "Thanh Trúc Lâm", "x": 0.326, "y": 0.251, "seal": "竹", "desc": "Rừng trúc xanh ngút ngàn, nơi Trúc Lang Vương xưng bá.", "realmHint": "Luyện Khí · Lv 1–9" },
    { "region": "yeu", "label": "Vạn Yêu Sơn", "x": 0.505, "y": 0.251, "seal": "妖", "desc": "Núi non trùng điệp, yêu khí ẩn hiện giữa rừng sâu sương phủ.", "realmHint": "Trúc Cơ · Lv 10–14" },
    { "region": "ma", "label": "Ma Vực", "x": 0.671, "y": 0.260, "seal": "魔", "desc": "Mây đen vần vũ, ma khí bao trùm miền đất hoang lạnh.", "realmHint": "Hóa Thần · Lv 37–40" },
    { "region": "tuyet", "label": "Bắc Minh Tuyết Vực", "x": 0.158, "y": 0.702, "seal": "雪", "desc": "Tuyết phủ ngàn trùng, hàn khí thấu xương giữa trời đất trắng bạc.", "realmHint": "Kim Đan · Lv 19–23" },
    { "region": "tram", "label": "Hắc Độc Trạch", "x": 0.326, "y": 0.702, "seal": "毒", "desc": "Đầm lầy u tịch, hơi nước đục cuộn quanh những gốc cây già.", "realmHint": "Trúc Cơ · Lv 15–18" },
    { "region": "hoa", "label": "Xích Viêm Hoang Mạc", "x": 0.505, "y": 0.702, "seal": "炎", "desc": "Cát đỏ trải dài, nắng thiêu đốt và gió nóng chẳng khi nào dứt.", "realmHint": "Kim Đan · Lv 24–27" },
    { "region": "quy", "label": "U Minh Quỷ Vực", "x": 0.671, "y": 0.702, "seal": "鬼", "desc": "Sương âm mờ mịt, bóng tối phủ lên vùng đất tĩnh lặng như cõi u minh.", "realmHint": "Nguyên Anh · Lv 33–36" },
    { "region": "phong", "label": "Thiên Phong Cốc", "x": 0.846, "y": 0.264, "seal": "風", "desc": "Gió rít qua khe đá, vách núi dựng đứng ôm lấy thung lũng sâu.", "realmHint": "Nguyên Anh · Lv 28–32" },
    { "region": "loi", "label": "Tử Lôi Hoang Nguyên", "x": 0.846, "y": 0.702, "seal": "雷", "desc": "Hoang nguyên rộng lớn, sấm tím in bóng trên nền trời chập chùng mây.", "realmHint": "Hóa Thần · Lv 41–45" }
  ],
  "paths": [
    ["thon", "truc"], ["truc", "yeu"], ["yeu", "ma"], ["thon", "tuyet"], ["truc", "tram"], ["yeu", "hoa"], ["ma", "quy"],
    ["tuyet", "tram"], ["tram", "hoa"], ["hoa", "quy"], ["ma", "phong"], ["quy", "loi"], ["phong", "loi"]
  ]
};
