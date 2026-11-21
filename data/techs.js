DATA.techs = {
  "version": 1,
  "items": [
    {
      "id": "truc_tam_quyet",
      "name": "Trúc Tâm Quyết",
      "element": "Mộc",
      "grade": "pham",
      "type": "tam_phap",
      "cls": null,
      "reqLevel": 1,
      "price": 12,
      "maxRank": 3,
      "desc": "Tăng sinh mệnh và linh lực tối đa.",
      "lore": "Người hái trúc truyền nhau phép giữ tâm tĩnh giữa tiếng lá reo.",
      "effects": [
        {
          "stat": "hp",
          "op": "add",
          "value": 12,
          "perRank": 4
        },
        {
          "stat": "mp",
          "op": "add",
          "value": 6,
          "perRank": 2
        }
      ]
    },
    {
      "id": "thiet_chi_ky",
      "name": "Thiết Chỉ Kình",
      "element": "Kim",
      "grade": "pham",
      "type": "vo_ky",
      "cls": 0,
      "reqLevel": 2,
      "price": 16,
      "maxRank": 3,
      "desc": "Tăng công kích và bạo kích.",
      "lore": "Lấy một điểm phá mặt rộng, ngón tay cứng như mũi kiếm.",
      "effects": [
        {
          "stat": "attack",
          "op": "mul",
          "value": 1.04,
          "perRank": 0.02
        },
        {
          "stat": "crit",
          "op": "add",
          "value": 0.01,
          "perRank": 0.005
        }
      ]
    },
    {
      "id": "yen_hanh_bo",
      "name": "Yến Hành Bộ",
      "element": "Phong",
      "grade": "pham",
      "type": "than_phap",
      "cls": null,
      "reqLevel": 3,
      "price": 20,
      "maxRank": 3,
      "desc": "Tăng tốc di chuyển.",
      "lore": "Bước nhẹ như chim én lướt sát mặt nước.",
      "effects": [
        {
          "stat": "speed",
          "op": "add",
          "value": 8,
          "perRank": 3
        }
      ]
    },
    {
      "id": "sa_thach_an",
      "name": "Sa Thạch Ấn",
      "element": "Thổ",
      "grade": "pham",
      "type": "tuyet_ky",
      "cls": 1,
      "reqLevel": 4,
      "price": 24,
      "maxRank": 3,
      "desc": "Tăng phòng ngự và công kích.",
      "lore": "Nén khí vào gót chân, đứng vững như đá giữa dòng.",
      "effects": [
        {
          "stat": "def",
          "op": "add",
          "value": 3,
          "perRank": 1
        },
        {
          "stat": "attack",
          "op": "mul",
          "value": 1.03,
          "perRank": 0.01
        }
      ]
    },
    {
      "id": "thanh_tuyen_phap",
      "name": "Thanh Tuyền Pháp",
      "element": "Thủy",
      "grade": "pham",
      "type": "tam_phap",
      "cls": 2,
      "reqLevel": 5,
      "price": 28,
      "maxRank": 3,
      "desc": "Tăng linh lực tối đa và pháp công.",
      "lore": "Dẫn linh khí đi một vòng mềm mại như suối quanh đá.",
      "effects": [
        {
          "stat": "mp",
          "op": "add",
          "value": 10,
          "perRank": 3
        },
        {
          "stat": "spellAtk",
          "op": "mul",
          "value": 1.04,
          "perRank": 0.02
        }
      ]
    },
    {
      "id": "dieu_hoa_thu",
      "name": "Điệu Hỏa Thủ",
      "element": "Hỏa",
      "grade": "pham",
      "type": "vo_ky",
      "cls": null,
      "reqLevel": 6,
      "price": 32,
      "maxRank": 3,
      "desc": "Tăng tốc đánh và phòng ngự.",
      "lore": "Điều tức theo nhịp bếp lửa, chậm mà không tắt.",
      "effects": [
        {
          "stat": "rate",
          "op": "mul",
          "value": 1.04,
          "perRank": 0.015
        },
        {
          "stat": "def",
          "op": "add",
          "value": 2,
          "perRank": 1
        }
      ]
    },
    {
      "id": "truc_anh_bo",
      "name": "Trúc Ảnh Bộ",
      "element": "Mộc",
      "grade": "pham",
      "type": "than_phap",
      "cls": null,
      "reqLevel": 7,
      "price": 0,
      "maxRank": 3,
      "desc": "Tăng tốc di chuyển, giảm hồi chiêu lướt.",
      "lore": "Dấu chân nhẹ thoắt ẩn giữa hàng trúc dày.",
      "effects": [
        {
          "stat": "speed",
          "op": "add",
          "value": 10,
          "perRank": 3
        },
        {
          "stat": "dashCd",
          "op": "mul",
          "value": 0.96,
          "perRank": -0.02
        }
      ]
    },
    {
      "id": "kinh_loi_chi",
      "name": "Kinh Lôi Chỉ",
      "element": "Lôi",
      "grade": "pham",
      "type": "tuyet_ky",
      "cls": null,
      "reqLevel": 9,
      "price": 45,
      "maxRank": 3,
      "desc": "Tăng bạo kích và pháp công.",
      "lore": "Một hơi tụ khí, một nhịp phát lực như tiếng sấm xa.",
      "effects": [
        {
          "stat": "crit",
          "op": "add",
          "value": 0.015,
          "perRank": 0.005
        },
        {
          "stat": "spellAtk",
          "op": "mul",
          "value": 1.05,
          "perRank": 0.015
        }
      ]
    },
    {
      "id": "bach_luyen_khi",
      "name": "Bách Luyện Khí",
      "element": "Kim",
      "grade": "linh",
      "type": "tam_phap",
      "cls": null,
      "reqLevel": 10,
      "price": 60,
      "maxRank": 4,
      "desc": "Tăng sinh mệnh và công kích.",
      "lore": "Trăm lần điều khí, mỗi lần gạn bỏ một phần tạp niệm.",
      "effects": [
        {
          "stat": "hp",
          "op": "add",
          "value": 22,
          "perRank": 6
        },
        {
          "stat": "attack",
          "op": "mul",
          "value": 1.05,
          "perRank": 0.015
        }
      ]
    },
    {
      "id": "nguyet_nha_kiem",
      "name": "Nguyệt Nha Kiếm Phổ",
      "element": "Thủy",
      "grade": "linh",
      "type": "vo_ky",
      "cls": 0,
      "reqLevel": 11,
      "price": 70,
      "maxRank": 4,
      "desc": "Tăng tầm đánh và tốc di chuyển.",
      "lore": "Đường kiếm uyển chuyển vẽ một vầng trăng khuyết.",
      "effects": [
        {
          "stat": "range",
          "op": "add",
          "value": 8,
          "perRank": 2
        },
        {
          "stat": "speed",
          "op": "add",
          "value": 6,
          "perRank": 2
        }
      ]
    },
    {
      "id": "van_tung_bo",
      "name": "Vân Tùng Bộ",
      "element": "Phong",
      "grade": "linh",
      "type": "than_phap",
      "cls": null,
      "reqLevel": 12,
      "price": 80,
      "maxRank": 4,
      "desc": "Tăng tốc di chuyển và giảm hồi chiêu lướt.",
      "lore": "Thân tùy mây chuyển, chân vẫn giữ thế gốc tùng.",
      "effects": [
        {
          "stat": "speed",
          "op": "add",
          "value": 14,
          "perRank": 4
        },
        {
          "stat": "dashCd",
          "op": "mul",
          "value": 0.94,
          "perRank": -0.015
        }
      ]
    },
    {
      "id": "hoang_thach_kinh",
      "name": "Hoàng Thạch Kinh",
      "element": "Thổ",
      "grade": "linh",
      "type": "tam_phap",
      "cls": 1,
      "reqLevel": 13,
      "price": 90,
      "maxRank": 4,
      "desc": "Tăng phòng ngự và tốc di chuyển.",
      "lore": "Thể khí dồn về đan điền rồi lan đều khắp kinh mạch.",
      "effects": [
        {
          "stat": "def",
          "op": "add",
          "value": 4,
          "perRank": 2
        },
        {
          "stat": "speed",
          "op": "add",
          "value": 8,
          "perRank": 2
        }
      ]
    },
    {
      "id": "linh_chieu_an",
      "name": "Linh Chiếu Ấn",
      "element": "Hỏa",
      "grade": "linh",
      "type": "tuyet_ky",
      "cls": 2,
      "reqLevel": 14,
      "price": 100,
      "maxRank": 4,
      "desc": "Tăng pháp công và linh lực.",
      "lore": "Tụ hỏa quang vào một điểm rồi khai ấn bằng ý niệm.",
      "effects": [
        {
          "stat": "spellAtk",
          "op": "mul",
          "value": 1.07,
          "perRank": 0.02
        },
        {
          "stat": "mp",
          "op": "add",
          "value": 15,
          "perRank": 5
        }
      ]
    },
    {
      "id": "thanh_dang_thu",
      "name": "Thanh Đằng Thủ",
      "element": "Mộc",
      "grade": "linh",
      "type": "vo_ky",
      "cls": null,
      "reqLevel": 15,
      "price": 110,
      "maxRank": 4,
      "desc": "Tăng tầm đánh và tốc đánh.",
      "lore": "Động tác liên tiếp như dây leo bám qua từng cành.",
      "effects": [
        {
          "stat": "range",
          "op": "add",
          "value": 10,
          "perRank": 3
        },
        {
          "stat": "rate",
          "op": "mul",
          "value": 1.06,
          "perRank": 0.025
        }
      ]
    },
    {
      "id": "dien_quang_bo",
      "name": "Điện Quang Bộ",
      "element": "Lôi",
      "grade": "linh",
      "type": "than_phap",
      "cls": null,
      "reqLevel": 17,
      "price": 120,
      "maxRank": 4,
      "desc": "Giảm hồi chiêu lướt, tăng tốc di chuyển.",
      "lore": "Trước khi sấm vọng, thân đã rời vị trí cũ.",
      "effects": [
        {
          "stat": "dashCd",
          "op": "mul",
          "value": 0.92,
          "perRank": -0.02
        },
        {
          "stat": "speed",
          "op": "add",
          "value": 12,
          "perRank": 4
        }
      ]
    },
    {
      "id": "kim_tich_an",
      "name": "Kim Tịch Ấn",
      "element": "Kim",
      "grade": "linh",
      "type": "tuyet_ky",
      "cls": null,
      "reqLevel": 18,
      "price": 130,
      "maxRank": 4,
      "desc": "Tăng công kích và linh lực tối đa.",
      "lore": "Vẻ ngoài tĩnh lặng, bên trong là khí sắc của kim thạch.",
      "effects": [
        {
          "stat": "attack",
          "op": "mul",
          "value": 1.06,
          "perRank": 0.02
        },
        {
          "stat": "mp",
          "op": "add",
          "value": 8,
          "perRank": 3
        }
      ]
    },
    {
      "id": "han_tuyen_quyet",
      "name": "Hàn Tuyền Quyết",
      "element": "Thủy",
      "grade": "dia",
      "type": "tam_phap",
      "cls": null,
      "reqLevel": 19,
      "price": 150,
      "maxRank": 5,
      "desc": "Tăng linh lực tối đa và tốc hồi linh lực.",
      "lore": "Giữ tâm như mạch nước không đóng băng dưới tầng tuyết.",
      "effects": [
        {
          "stat": "mp",
          "op": "add",
          "value": 24,
          "perRank": 6
        },
        {
          "stat": "regen",
          "op": "mul",
          "value": 1.08,
          "perRank": 0.02
        }
      ]
    },
    {
      "id": "tuyet_tich_kiem",
      "name": "Tuyết Tịch Kiếm Phổ",
      "element": "Thủy",
      "grade": "dia",
      "type": "vo_ky",
      "cls": 0,
      "reqLevel": 20,
      "price": 0,
      "maxRank": 5,
      "desc": "Tăng tầm đánh và bạo kích.",
      "lore": "Kiếm rời vỏ giữa tuyết, tiếng ngân mỏng như sợi tơ.",
      "effects": [
        {
          "stat": "range",
          "op": "add",
          "value": 12,
          "perRank": 3
        },
        {
          "stat": "crit",
          "op": "add",
          "value": 0.02,
          "perRank": 0.008
        }
      ]
    },
    {
      "id": "phong_tuc_bo",
      "name": "Phong Tức Bộ",
      "element": "Phong",
      "grade": "dia",
      "type": "than_phap",
      "cls": null,
      "reqLevel": 23,
      "price": 175,
      "maxRank": 5,
      "desc": "Tăng tốc di chuyển và giảm hồi chiêu lướt.",
      "lore": "Nương chiều gió, lấy hơi thở thay cho sức bật.",
      "effects": [
        {
          "stat": "speed",
          "op": "add",
          "value": 18,
          "perRank": 4
        },
        {
          "stat": "dashCd",
          "op": "mul",
          "value": 0.92,
          "perRank": -0.02
        }
      ]
    },
    {
      "id": "nham_tam_an",
      "name": "Nham Tâm Ấn",
      "element": "Hỏa",
      "grade": "dia",
      "type": "tuyet_ky",
      "cls": null,
      "reqLevel": 25,
      "price": 0,
      "maxRank": 5,
      "desc": "Tăng công kích và pháp công.",
      "lore": "Tàn lửa dưới cát giữ nhiệt tới tận khi bình minh.",
      "effects": [
        {
          "stat": "attack",
          "op": "mul",
          "value": 1.07,
          "perRank": 0.015
        },
        {
          "stat": "spellAtk",
          "op": "mul",
          "value": 1.07,
          "perRank": 0.015
        }
      ]
    },
    {
      "id": "son_mach_kinh",
      "name": "Sơn Mạch Kinh",
      "element": "Thổ",
      "grade": "dia",
      "type": "tam_phap",
      "cls": 1,
      "reqLevel": 27,
      "price": 200,
      "maxRank": 5,
      "desc": "Tăng phòng ngự và tốc hồi linh lực.",
      "lore": "Mỗi nhịp thở chậm như chuyển động của dãy núi.",
      "effects": [
        {
          "stat": "def",
          "op": "add",
          "value": 8,
          "perRank": 2
        },
        {
          "stat": "regen",
          "op": "mul",
          "value": 1.04,
          "perRank": 0.02
        }
      ]
    },
    {
      "id": "moc_an_phap",
      "name": "Mộc Ẩn Pháp",
      "element": "Mộc",
      "grade": "dia",
      "type": "vo_ky",
      "cls": null,
      "reqLevel": 31,
      "price": 220,
      "maxRank": 5,
      "desc": "Tăng tốc đánh và sinh mệnh.",
      "lore": "Mạch khí ẩn sâu như nhựa cây trong thân cổ thụ.",
      "effects": [
        {
          "stat": "rate",
          "op": "mul",
          "value": 1.08,
          "perRank": 0.025
        },
        {
          "stat": "hp",
          "op": "add",
          "value": 30,
          "perRank": 8
        }
      ]
    },
    {
      "id": "thai_am_tich",
      "name": "Thái Âm Tịch Pháp",
      "element": "Thủy",
      "grade": "dia",
      "type": "tuyet_ky",
      "cls": 2,
      "reqLevel": 36,
      "price": 240,
      "maxRank": 5,
      "desc": "Tăng pháp công và linh lực tối đa.",
      "lore": "Lấy tĩnh khí nuôi linh hải, chờ thời khắc phát ấn.",
      "effects": [
        {
          "stat": "spellAtk",
          "op": "mul",
          "value": 1.11,
          "perRank": 0.025
        },
        {
          "stat": "mp",
          "op": "add",
          "value": 32,
          "perRank": 8
        }
      ]
    },
    {
      "id": "kim_uyen_kiem",
      "name": "Kim Uyên Kiếm Kinh",
      "element": "Kim",
      "grade": "thien",
      "type": "vo_ky",
      "cls": 0,
      "reqLevel": 37,
      "price": 300,
      "maxRank": 5,
      "desc": "Tăng công kích và tốc di chuyển.",
      "lore": "Kiếm ý chìm sâu, khi xuất chiêu chỉ còn một đường sáng.",
      "effects": [
        {
          "stat": "attack",
          "op": "mul",
          "value": 1.13,
          "perRank": 0.03
        },
        {
          "stat": "speed",
          "op": "add",
          "value": 9,
          "perRank": 3
        }
      ]
    },
    {
      "id": "cuc_phong_bo",
      "name": "Cực Phong Bộ",
      "element": "Phong",
      "grade": "thien",
      "type": "than_phap",
      "cls": null,
      "reqLevel": 38,
      "price": 330,
      "maxRank": 5,
      "desc": "Tăng tốc di chuyển và giảm hồi chiêu lướt.",
      "lore": "Thân pháp mượn dòng khí quanh người để chuyển hướng.",
      "effects": [
        {
          "stat": "speed",
          "op": "add",
          "value": 20,
          "perRank": 5
        },
        {
          "stat": "dashCd",
          "op": "mul",
          "value": 0.9,
          "perRank": -0.025
        }
      ]
    },
    {
      "id": "van_moc_kinh",
      "name": "Vạn Mộc Tĩnh Kinh",
      "element": "Mộc",
      "grade": "thien",
      "type": "tam_phap",
      "cls": null,
      "reqLevel": 39,
      "price": 360,
      "maxRank": 5,
      "desc": "Tăng sinh mệnh và tốc hồi linh lực.",
      "lore": "Ngàn cành chung một gốc, kinh mạch quy về một hơi.",
      "effects": [
        {
          "stat": "hp",
          "op": "add",
          "value": 50,
          "perRank": 12
        },
        {
          "stat": "regen",
          "op": "mul",
          "value": 1.1,
          "perRank": 0.025
        }
      ]
    },
    {
      "id": "thien_nham_an",
      "name": "Thiên Nham Ấn",
      "element": "Thổ",
      "grade": "thien",
      "type": "tuyet_ky",
      "cls": 1,
      "reqLevel": 40,
      "price": 390,
      "maxRank": 5,
      "desc": "Tăng phòng ngự và sinh mệnh tối đa.",
      "lore": "Thể tu nén khí như nham thạch, lấy thân làm thành lũy, đứng vững trước thế công.",
      "effects": [
        {
          "stat": "def",
          "op": "add",
          "value": 12,
          "perRank": 3
        },
        {
          "stat": "hp",
          "op": "add",
          "value": 45,
          "perRank": 10
        }
      ]
    },
    {
      "id": "loi_tich_bo",
      "name": "Lôi Tịch Bộ",
      "element": "Lôi",
      "grade": "thien",
      "type": "than_phap",
      "cls": null,
      "reqLevel": 42,
      "price": 0,
      "maxRank": 5,
      "desc": "Giảm hồi chiêu lướt và tăng bạo kích.",
      "lore": "Giữa hai tiếng sấm là khoảng tĩnh để đổi thế.",
      "effects": [
        {
          "stat": "dashCd",
          "op": "mul",
          "value": 0.88,
          "perRank": -0.02
        },
        {
          "stat": "crit",
          "op": "add",
          "value": 0.025,
          "perRank": 0.007
        }
      ]
    },
    {
      "id": "hoa_quang_pho",
      "name": "Hỏa Quang Phổ",
      "element": "Hỏa",
      "grade": "thien",
      "type": "vo_ky",
      "cls": null,
      "reqLevel": 44,
      "price": 450,
      "maxRank": 5,
      "desc": "Tăng tốc đánh và bạo kích.",
      "lore": "Hỏa quang đều nhịp, không để khí nóng làm loạn tay.",
      "effects": [
        {
          "stat": "rate",
          "op": "mul",
          "value": 1.1,
          "perRank": 0.025
        },
        {
          "stat": "crit",
          "op": "add",
          "value": 0.02,
          "perRank": 0.008
        }
      ]
    },
    {
      "id": "thai_thanh_an",
      "name": "Thái Thanh Nguyên Ấn",
      "element": "Phong",
      "grade": "thien",
      "type": "tuyet_ky",
      "cls": 2,
      "reqLevel": 45,
      "price": 480,
      "maxRank": 5,
      "desc": "Tăng pháp công và linh lực.",
      "lore": "Tâm thanh khí tĩnh, vạn niệm tụ thành một ấn.",
      "effects": [
        {
          "stat": "spellAtk",
          "op": "mul",
          "value": 1.13,
          "perRank": 0.03
        },
        {
          "stat": "mp",
          "op": "add",
          "value": 40,
          "perRank": 10
        }
      ]
    }
  ]
};
