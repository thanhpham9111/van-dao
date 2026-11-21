DATA.events = {
  "version": 1,
  "events": [
    {
      "id": "e01",
      "title": "Trúc diệp đọng sương",
      "desc": "Một giọt linh sương nằm trên lá trúc cao, thân cây rung trong gió.",
      "when": {
        "regions": [
          "truc"
        ],
        "minLevel": 1,
        "weight": 10
      },
      "options": [
        {
          "name": "Trèo hái sương",
          "desc": "75%: Nhận 2 Linh thảo; 25%: Mất 12 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "herb",
              "value": 2
            }
          ],
          "chance": 0.75,
          "fail": [
            {
              "type": "hurt",
              "value": 12
            }
          ]
        },
        {
          "name": "Hứng dưới tán",
          "desc": "Hồi 18 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 18
            }
          ],
          "chance": 1
        },
        {
          "name": "Quan sát nhịp gió",
          "desc": "Nhận 8 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 8
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e02",
      "title": "Lồng đèn lạc lối",
      "desc": "Một lồng đèn cũ soi túi vải mắc giữa rễ cây; dưới chân có gói đan dược còn nguyên.",
      "when": {
        "regions": [
          "truc"
        ],
        "minLevel": 4,
        "night": true,
        "weight": 8
      },
      "options": [
        {
          "name": "Lượm túi vải",
          "desc": "65%: Nhận 9 linh thạch; 35%: Mất 16 HP (không gây chết).",
          "effects": [
            {
              "type": "stones",
              "value": 9
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 16
            }
          ]
        },
        {
          "name": "Dẫn lửa về đường",
          "desc": "Thiện cảm với Lục Thanh +2 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "npc": "sentry",
              "value": 2
            }
          ],
          "chance": 1
        },
        {
          "name": "Lấy gói thuốc rơi",
          "desc": "Nhận 1 Hồi Xuân Đan (chắc chắn).",
          "effects": [
            {
              "type": "pills",
              "value": 1
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e03",
      "title": "Bia rêu vô tự",
      "desc": "Vết mực nước mưa đọng trên một phiến đá không chữ; khí tức phản chiếu theo nhịp thở.",
      "when": {
        "regions": [
          "truc"
        ],
        "minLevel": 7,
        "weight": 9,
        "night": false
      },
      "options": [
        {
          "name": "Thử lĩnh ngộ",
          "desc": "70%: Nhận 29 tu vi; 30%: Mất 20 HP (không gây chết).",
          "effects": [
            {
              "type": "xp",
              "value": 29
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "hurt",
              "value": 20
            }
          ]
        },
        {
          "name": "Ngồi tĩnh tâm",
          "desc": "Nhận 12 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 12
            }
          ],
          "chance": 1
        },
        {
          "name": "Nhặt cành rụng",
          "desc": "Nhận 1 Linh mộc (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "wood",
              "value": 1
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e04",
      "title": "Vết chân trên vách",
      "desc": "Móng thú cào vào vách dốc, làm lộ vỉa khoáng cạnh rễ linh mộc.",
      "when": {
        "regions": [
          "yeu"
        ],
        "minLevel": 10,
        "weight": 10
      },
      "options": [
        {
          "name": "Bám vách nhặt quặng",
          "desc": "70%: Nhận 2 Huyền thiết; 30%: Nhận 1 Linh mộc, mất 15 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "ore",
              "value": 2
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "mat",
              "item": "wood",
              "value": 1
            },
            {
              "type": "hurt",
              "value": 15
            }
          ]
        },
        {
          "name": "Đãi đá dưới chân",
          "desc": "Nhận 1 Huyền thiết (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "ore",
              "value": 1
            }
          ],
          "chance": 1
        },
        {
          "name": "Ghi dấu móng thú",
          "desc": "Thiện cảm với Hàn Liệt +2 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "value": 2,
              "npc": "mountainHunter"
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e05",
      "title": "Túi thợ săn",
      "desc": "Một túi da và mảnh linh mộc rơi cạnh bãi đá; tiếng động phía sau khiến tay người phải chậm lại.",
      "when": {
        "regions": [
          "yeu"
        ],
        "minLevel": 12,
        "weight": 9
      },
      "options": [
        {
          "name": "Kiểm túi sâu",
          "desc": "65%: Nhận 16 linh thạch; 35%: Mất 26 HP (không gây chết).",
          "effects": [
            {
              "type": "stones",
              "value": 16
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 26
            }
          ]
        },
        {
          "name": "Để lại dấu báo",
          "desc": "Thiện cảm với Hàn Liệt +3 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "npc": "mountainHunter",
              "value": 3
            }
          ],
          "chance": 1
        },
        {
          "name": "Nhặt mảnh linh mộc",
          "desc": "Nhận 1 Linh mộc (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "wood",
              "value": 1
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e06",
      "title": "Huyết nguyệt mờ",
      "desc": "Ánh trăng đỏ phủ đỉnh đá, khí huyết dâng nhanh rồi chợt tản.",
      "when": {
        "regions": [
          "yeu"
        ],
        "minLevel": 14,
        "night": true,
        "weight": 7
      },
      "options": [
        {
          "name": "Điều tức dưới trăng",
          "desc": "65%: Tăng công kích 10% trong 120 giây; 35%: Mất 30 HP (không gây chết).",
          "effects": [
            {
              "type": "buff",
              "stat": "attack",
              "value": 0.1,
              "seconds": 120
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 30
            }
          ]
        },
        {
          "name": "Lui vào chỗ kín",
          "desc": "Hồi 30 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 30
            }
          ],
          "chance": 1
        },
        {
          "name": "Lắng nghe khí huyết",
          "desc": "Nhận 28 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 28
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e07",
      "title": "Lá thuốc nổi",
      "desc": "Linh dược nổi bên bùn lầy; một nhánh linh mộc mắc cạnh rễ.",
      "when": {
        "regions": [
          "tram"
        ],
        "minLevel": 15,
        "weight": 10
      },
      "options": [
        {
          "name": "Lội hái lá",
          "desc": "70%: Nhận 3 Linh thảo; 30%: Nhận 1 Linh mộc, mất 18 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "herb",
              "value": 3
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "mat",
              "item": "wood",
              "value": 1
            },
            {
              "type": "hurt",
              "value": 18
            }
          ]
        },
        {
          "name": "Nhặt lá ven bờ",
          "desc": "Nhận 1 Linh thảo (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "herb",
              "value": 1
            }
          ],
          "chance": 1
        },
        {
          "name": "Ép lá thuốc ven bờ",
          "desc": "Hồi 25 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 25
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e08",
      "title": "Đèn đóm đáy trạch",
      "desc": "Lân tinh lấp ló giữa hốc rễ chìm; trên bờ còn một nhánh linh thảo chưa ngập bùn.",
      "when": {
        "regions": [
          "tram"
        ],
        "minLevel": 16,
        "night": true,
        "weight": 8
      },
      "options": [
        {
          "name": "Lần theo lân tinh",
          "desc": "60%: Nhận 20 linh thạch; 40%: Mất 34 HP (không gây chết).",
          "effects": [
            {
              "type": "stones",
              "value": 20
            }
          ],
          "chance": 0.6,
          "fail": [
            {
              "type": "hurt",
              "value": 34
            }
          ]
        },
        {
          "name": "Ghi chú dược tính",
          "desc": "Thiện cảm với Đường Uyển +3 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "npc": "swampMedic",
              "value": 3
            }
          ],
          "chance": 1
        },
        {
          "name": "Hái thảo dược bên rễ",
          "desc": "Nhận 1 Linh thảo (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "value": 1,
              "item": "herb"
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e09",
      "title": "Bình thuốc cũ",
      "desc": "Bên nền đàn đổ có bình gốm, dược khô và mấy viên linh thạch.",
      "when": {
        "regions": [
          "tram"
        ],
        "minLevel": 18,
        "weight": 9,
        "night": false
      },
      "options": [
        {
          "name": "Mở bình thuốc",
          "desc": "65%: Nhận 3 Hồi Xuân Đan; 35%: Mất 30 HP (không gây chết).",
          "effects": [
            {
              "type": "pills",
              "value": 3
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 30
            }
          ]
        },
        {
          "name": "Thu dược khô",
          "desc": "Nhận 2 Linh thảo (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "herb",
              "value": 2
            }
          ],
          "chance": 1
        },
        {
          "name": "Nhặt linh thạch",
          "desc": "Nhận 10 linh thạch (chắc chắn).",
          "effects": [
            {
              "type": "stones",
              "value": 10
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e10",
      "title": "Tinh thạch dưới băng",
      "desc": "Mảnh tinh thạch xanh hiện dưới một lớp băng nứt; mặt băng phản chiếu mây.",
      "when": {
        "regions": [
          "tuyet"
        ],
        "minLevel": 19,
        "weight": 10
      },
      "options": [
        {
          "name": "Cạy lớp băng",
          "desc": "70%: Nhận 2 Linh tinh; 30%: Mất 32 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "crystal",
              "value": 2
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "hurt",
              "value": 32
            }
          ]
        },
        {
          "name": "Giữ hơi ấm",
          "desc": "Hồi 40 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 40
            }
          ],
          "chance": 1
        },
        {
          "name": "Ngắm vân băng",
          "desc": "Nhận 32 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 32
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e11",
      "title": "Tiếng tiêu trong tuyết",
      "desc": "Tiếng tiêu vọng trên triền tuyết, cạnh một hốc đá khuất gió; âm thanh lúc gần lúc xa.",
      "when": {
        "regions": [
          "tuyet"
        ],
        "minLevel": 21,
        "night": true,
        "weight": 8
      },
      "options": [
        {
          "name": "Tĩnh nghe âm vận",
          "desc": "65%: Nhận 75 tu vi; 35%: Mất 36 HP (không gây chết).",
          "effects": [
            {
              "type": "xp",
              "value": 75
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 36
            }
          ]
        },
        {
          "name": "Quay về mốc cũ",
          "desc": "Thiện cảm với Bạch Vân +2 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "npc": "snowHermit",
              "value": 2
            }
          ],
          "chance": 1
        },
        {
          "name": "Trú gió bên sườn núi",
          "desc": "Hồi 45 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 45
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e12",
      "title": "Tuyết kết ngọc",
      "desc": "Giọt nước lạnh kết thành hình ngọc, bên cạnh có mảnh linh tinh; ánh mờ lưu lại trên vạt áo.",
      "when": {
        "regions": [
          "tuyet"
        ],
        "minLevel": 23,
        "weight": 8,
        "night": false
      },
      "options": [
        {
          "name": "Hấp thu hàn khí",
          "desc": "70%: Tăng phòng ngự 12% trong 150 giây; 30%: Mất 40 HP (không gây chết).",
          "effects": [
            {
              "type": "buff",
              "stat": "def",
              "value": 0.12,
              "seconds": 150
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "hurt",
              "value": 40
            }
          ]
        },
        {
          "name": "Thả ngọc về tuyết",
          "desc": "Hồi 35 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 35
            }
          ],
          "chance": 1
        },
        {
          "name": "Thu mảnh linh tinh",
          "desc": "Nhận 1 Linh tinh (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "crystal",
              "value": 1
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e13",
      "title": "Quặng đỏ lộ mạch",
      "desc": "Vỉa huyền thiết nhô khỏi cát nóng, bên vân đá có mảnh linh mộc cháy sém.",
      "when": {
        "regions": [
          "hoa"
        ],
        "minLevel": 24,
        "weight": 10
      },
      "options": [
        {
          "name": "Bới quặng nóng",
          "desc": "65%: Nhận 3 Huyền thiết; 35%: Nhận 1 Linh mộc, mất 25 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "ore",
              "value": 3
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "mat",
              "item": "wood",
              "value": 1
            },
            {
              "type": "hurt",
              "value": 25
            }
          ]
        },
        {
          "name": "Nhặt mảnh nguội",
          "desc": "Nhận 1 Huyền thiết (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "ore",
              "value": 1
            }
          ],
          "chance": 1
        },
        {
          "name": "Ghi lại vỉa quặng",
          "desc": "Thiện cảm với Thiết Nham +2 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "value": 2,
              "npc": "desertSmith"
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e14",
      "title": "Lửa bên cát",
      "desc": "Vệt lửa nhỏ trên cát chiếu bóng mấy cành mộc khô; hơi nóng vẫn còn.",
      "when": {
        "regions": [
          "hoa"
        ],
        "minLevel": 25,
        "night": true,
        "weight": 8
      },
      "options": [
        {
          "name": "Hơ nóng linh mộc",
          "desc": "65%: Tăng công kích 12% trong 120 giây; 35%: Mất 42 HP (không gây chết).",
          "effects": [
            {
              "type": "buff",
              "stat": "attack",
              "value": 0.12,
              "seconds": 120
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 42
            }
          ]
        },
        {
          "name": "Thu cành bên rìa",
          "desc": "Nhận 2 Linh mộc (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "wood",
              "value": 2
            }
          ],
          "chance": 1
        },
        {
          "name": "Hơ ấm kinh mạch",
          "desc": "Hồi 40 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 40
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e15",
      "title": "Đá hỏa vân",
      "desc": "Mảnh đá nóng lên rồi dịu, một vệt sáng chạy qua đường vân cạnh lớp huyền thiết.",
      "when": {
        "regions": [
          "hoa"
        ],
        "minLevel": 27,
        "weight": 9,
        "night": false
      },
      "options": [
        {
          "name": "Đọc hỏa vân",
          "desc": "70%: Nhận 90 tu vi; 30%: Mất 45 HP (không gây chết).",
          "effects": [
            {
              "type": "xp",
              "value": 90
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "hurt",
              "value": 45
            }
          ]
        },
        {
          "name": "Gửi ghi chép thợ rèn",
          "desc": "Thiện cảm với Thiết Nham +3 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "npc": "desertSmith",
              "value": 3
            }
          ],
          "chance": 1
        },
        {
          "name": "Nhặt huyền thiết",
          "desc": "Nhận 1 Huyền thiết (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "ore",
              "value": 1
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e16",
      "title": "Gió đưa cành",
      "desc": "Gió thổi một nhánh linh mộc qua khe, lúc gần tay lúc cuốn đi.",
      "when": {
        "regions": [
          "phong"
        ],
        "minLevel": 28,
        "weight": 10
      },
      "options": [
        {
          "name": "Đuổi theo cành",
          "desc": "70%: Tăng tốc chạy 18 px/s trong 120 giây; 30%: Mất 42 HP (không gây chết).",
          "effects": [
            {
              "type": "buff",
              "stat": "speed",
              "value": 18,
              "seconds": 120
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "hurt",
              "value": 42
            }
          ]
        },
        {
          "name": "Nhặt lá cạnh đường",
          "desc": "Nhận 2 Linh mộc (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "wood",
              "value": 2
            }
          ],
          "chance": 1
        },
        {
          "name": "Ngộ nhịp gió",
          "desc": "Nhận 42 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 42
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e17",
      "title": "Phong đăng mờ",
      "desc": "Một ngọn sáng lập lòe sau màn gió, bên dưới có vài nhánh thảo dược.",
      "when": {
        "regions": [
          "phong"
        ],
        "minLevel": 30,
        "night": true,
        "weight": 8
      },
      "options": [
        {
          "name": "Áp sát nguồn sáng",
          "desc": "65%: Nhận 3 Linh thảo; 35%: Mất 45 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "herb",
              "value": 3
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 45
            }
          ]
        },
        {
          "name": "Chờ gió dịu",
          "desc": "Hồi 50 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 50
            }
          ],
          "chance": 1
        },
        {
          "name": "Quan sát ánh phong đăng",
          "desc": "Nhận 48 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 48
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e18",
      "title": "Vách gió ngân",
      "desc": "Khe đá ngân thành tiếng dài; khí tức chợt thông trong một hơi thở.",
      "when": {
        "regions": [
          "phong"
        ],
        "minLevel": 32,
        "weight": 8,
        "night": false
      },
      "options": [
        {
          "name": "Điều tức theo gió",
          "desc": "70%: Tăng hồi linh 2 MP/giây trong 180 giây; 30%: Mất 49 HP (không gây chết).",
          "effects": [
            {
              "type": "buff",
              "stat": "regen",
              "value": 2,
              "seconds": 180
            }
          ],
          "chance": 0.7,
          "fail": [
            {
              "type": "hurt",
              "value": 49
            }
          ]
        },
        {
          "name": "Nghe một thoáng",
          "desc": "Nhận 37 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 37
            }
          ],
          "chance": 1
        },
        {
          "name": "Tĩnh tọa",
          "desc": "Hồi 45 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 45
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e19",
      "title": "Vệt ngọc cổ mộ",
      "desc": "Một vệt lân quang luồn vào khe đá cũ, phía trong có mảnh linh tinh.",
      "when": {
        "regions": [
          "quy"
        ],
        "minLevel": 33,
        "weight": 9
      },
      "options": [
        {
          "name": "Lần vào khe",
          "desc": "60%: Nhận 3 Linh tinh; 40%: Mất 52 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "crystal",
              "value": 3
            }
          ],
          "chance": 0.6,
          "fail": [
            {
              "type": "hurt",
              "value": 52
            }
          ]
        },
        {
          "name": "Kính lễ ngoài khe",
          "desc": "Thiện cảm với U Lan +3 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "npc": "ghostSeer",
              "value": 3
            }
          ],
          "chance": 1
        },
        {
          "name": "Nghỉ ngoài cổ mộ",
          "desc": "Hồi 52 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 52
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e20",
      "title": "Mực trên phù đá",
      "desc": "Dấu phù mờ như bóng nước; bên cạnh có mảnh huyền thiết lạnh, nét cuối phù đã phai.",
      "when": {
        "regions": [
          "quy"
        ],
        "minLevel": 36,
        "weight": 8,
        "night": false
      },
      "options": [
        {
          "name": "Đọc nét mực",
          "desc": "65%: Chí mạng +4 điểm % trong 120 giây; 35%: Mất 54 HP (không gây chết).",
          "effects": [
            {
              "type": "buff",
              "stat": "crit",
              "value": 0.04,
              "seconds": 120
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 54
            }
          ]
        },
        {
          "name": "Chép nét còn rõ",
          "desc": "Nhận 50 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 50
            }
          ],
          "chance": 1
        },
        {
          "name": "Nhặt mảnh huyền thiết",
          "desc": "Nhận 1 Huyền thiết (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "value": 1,
              "item": "ore"
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e21",
      "title": "Huyền thiết vương bụi",
      "desc": "Bên chân trụ đá có huyền thiết mắc trong khe; nét khắc cổ còn sót dưới lớp bụi đen.",
      "when": {
        "regions": [
          "ma"
        ],
        "minLevel": 37,
        "weight": 9
      },
      "options": [
        {
          "name": "Tách mảnh khỏi đá",
          "desc": "65%: Nhận 3 Huyền thiết; 35%: Mất 58 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "ore",
              "value": 3
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 58
            }
          ]
        },
        {
          "name": "Nhặt mảnh rời",
          "desc": "Nhận 1 Huyền thiết (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "ore",
              "value": 1
            }
          ],
          "chance": 1
        },
        {
          "name": "Đọc vết khắc trụ đá",
          "desc": "Nhận 52 tu vi (chắc chắn).",
          "effects": [
            {
              "type": "xp",
              "value": 52
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e22",
      "title": "Hơi thở Ma Môn",
      "desc": "Luồng khí lạnh thoát qua khe đồng, bên ngoài có mảnh linh tinh lẫn với đá.",
      "when": {
        "regions": [
          "ma"
        ],
        "minLevel": 40,
        "night": true,
        "weight": 7
      },
      "options": [
        {
          "name": "Thử điều tức",
          "desc": "60%: Tăng phòng ngự 15% trong 150 giây; 40%: Mất 60 HP (không gây chết).",
          "effects": [
            {
              "type": "buff",
              "stat": "def",
              "value": 0.15,
              "seconds": 150
            }
          ],
          "chance": 0.6,
          "fail": [
            {
              "type": "hurt",
              "value": 60
            }
          ]
        },
        {
          "name": "Lùi xa báo Mạc Ly",
          "desc": "Thiện cảm với Mạc Ly +4 (chắc chắn).",
          "effects": [
            {
              "type": "favor",
              "npc": "demonWatcher",
              "value": 4
            }
          ],
          "chance": 1
        },
        {
          "name": "Thu tàn tinh",
          "desc": "Nhận 1 Linh tinh (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "crystal",
              "value": 1
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e23",
      "title": "Tinh quang sau sét",
      "desc": "Vệt sét xa để lại ánh sáng trên đá; linh tinh và huyền thiết vẫn còn nóng.",
      "when": {
        "regions": [
          "loi"
        ],
        "minLevel": 41,
        "weight": 9
      },
      "options": [
        {
          "name": "Lấy tinh thạch",
          "desc": "65%: Nhận 3 Linh tinh; 35%: Nhận 1 Huyền thiết, mất 40 HP (không gây chết).",
          "effects": [
            {
              "type": "mat",
              "item": "crystal",
              "value": 3
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "mat",
              "item": "ore",
              "value": 1
            },
            {
              "type": "hurt",
              "value": 40
            }
          ]
        },
        {
          "name": "Đợi đá nguội",
          "desc": "Nhận 1 Linh tinh (chắc chắn).",
          "effects": [
            {
              "type": "mat",
              "item": "crystal",
              "value": 1
            }
          ],
          "chance": 1
        },
        {
          "name": "Nghỉ sau tảng đá",
          "desc": "Hồi 60 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 60
            }
          ],
          "chance": 1
        }
      ]
    },
    {
      "id": "e24",
      "title": "Tiếng lôi trong tâm",
      "desc": "Tiếng sét xa dội như trống; kinh mạch thoắt sáng, dưới chân có mấy viên linh thạch.",
      "when": {
        "regions": [
          "loi"
        ],
        "minLevel": 44,
        "night": true,
        "weight": 7
      },
      "options": [
        {
          "name": "Đón lôi vận",
          "desc": "65%: Nhận 160 tu vi; 35%: Mất 68 HP (không gây chết).",
          "effects": [
            {
              "type": "xp",
              "value": 160
            }
          ],
          "chance": 0.65,
          "fail": [
            {
              "type": "hurt",
              "value": 68
            }
          ]
        },
        {
          "name": "Bình tâm tĩnh tọa",
          "desc": "Hồi 65 HP (chắc chắn).",
          "effects": [
            {
              "type": "heal",
              "value": 65
            }
          ],
          "chance": 1
        },
        {
          "name": "Nhặt linh thạch",
          "desc": "Nhận 18 linh thạch (chắc chắn).",
          "effects": [
            {
              "type": "stones",
              "value": 18
            }
          ],
          "chance": 1
        }
      ]
    }
  ]
};
