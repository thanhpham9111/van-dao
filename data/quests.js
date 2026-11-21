DATA.quests = {
  "version": 1,
  "chapters": [
    {
      "id": "c1",
      "title": "Thanh Trúc khởi đạo",
      "summary": "Một tân tu gặp Thanh Thạch, cứu rừng trúc và mở cửa Vạn Giới. Dấu vết linh mạch bất ổn dẫn đường xa.",
      "regions": [
        "thon",
        "truc"
      ]
    },
    {
      "id": "c2",
      "title": "Vạn Yêu lạc mạch",
      "summary": "Cổ kiếm và linh dược giữ dấu vết trận pháp; dẹp yêu vương để hiểu nguồn huyết khí và linh độc.",
      "regions": [
        "yeu",
        "tram"
      ]
    },
    {
      "id": "c3",
      "title": "Hàn hỏa đồng nguyên",
      "summary": "Linh tuyền và hỏa thạch cho thấy hai dòng linh lực cùng bị cưỡng dẫn; tu sĩ phải giải trừ hộ thú.",
      "regions": [
        "tuyet",
        "hoa"
      ]
    },
    {
      "id": "c4",
      "title": "Phong minh u ảnh",
      "summary": "Từ linh đài đến tàn hồn cổ tu, dấu vết quy về kẻ muốn thâu cả thiên địa vào một trận.",
      "regions": [
        "phong",
        "quy"
      ]
    },
    {
      "id": "c5",
      "title": "Vạn Giới quy chân",
      "summary": "Vượt Ma Vực, đối diện Tử Lôi Thiên Tôn và chấm dứt việc cưỡng dẫn linh mạch tại Tử Lôi Hoang Nguyên.",
      "regions": [
        "ma",
        "loi"
      ]
    }
  ],
  "legacyText": [
    {
      "index": 0,
      "name": "Thanh Thạch khai đạo",
      "desc": "Nhấn E gặp Trưởng lão Thanh Thạch tại Thanh Vân Đại Điện, nghe lời dẫn nhập tu hành."
    },
    {
      "index": 1,
      "name": "Nhất niệm khai tâm",
      "desc": "Mở bảng kỹ năng T, cộng ít nhất một điểm kỹ năng để lĩnh hội đạo pháp của phái."
    },
    {
      "index": 2,
      "name": "Lối trúc nhập thế",
      "desc": "Dùng WASD đi ra Thanh Trúc Lâm, khám phá vùng để dò dấu vết linh mạch."
    },
    {
      "index": 3,
      "name": "Trừ yêu hộ thôn",
      "desc": "Hạ 3 yêu thú Thanh Trúc Lâm. Dùng chuột đánh, Shift né, H dùng đan khi cần."
    },
    {
      "index": 4,
      "name": "Lang vương hiện ảnh",
      "desc": "Hạ Trúc Lang Vương ở Thanh Trúc Lâm; chừa đường lùi, tránh đòn bằng Shift."
    },
    {
      "index": 5,
      "name": "Trúc Cơ khai mạch",
      "desc": "Đạt cấp 10 (Trúc Cơ); khi cấp 9 đầy tu vi, nhấn B ở thế giới mở để vượt thiên kiếp."
    },
    {
      "index": 6,
      "name": "Vạn Giới khai môn",
      "desc": "Tiến vào Vạn Giới Bí Cảnh. Tới điểm cửa đã có, tương tác E theo chỉ dẫn."
    },
    {
      "index": 7,
      "name": "Thí luyện tâm đạo",
      "desc": "Vượt phòng đầu Vạn Giới Bí Cảnh; dùng WASD, chuột, Shift và H để giữ sức."
    }
  ],
  "main": [
    {
      "id": "m09",
      "chapter": "c2",
      "name": "Cổ kiếm lưu âm",
      "desc": "Lĩnh ngộ Cổ kiếm Vạn Yêu để tìm dấu vết linh mạch.",
      "giver": "mountainHunter",
      "goal": {
        "type": "claim",
        "poi": "yuealtar"
      },
      "minLevel": 10,
      "reward": {
        "stones": 30,
        "pills": 2,
        "xp": 56
      },
      "lineStart": "Cổ kiếm vốn chỉ về đỉnh núi. Nay mũi kiếm lại hướng về nơi huyết khí tụ.",
      "lineDone": "Kiếm vân hiện dấu máu: linh mạch bị kéo lệch, không phải tự nhiên mà loạn."
    },
    {
      "id": "m10",
      "chapter": "c2",
      "name": "Huyết lang đoạn mạch",
      "desc": "Hạ Huyết Lang Yêu Vương tại Vạn Yêu Sơn.",
      "giver": "mountainHunter",
      "goal": {
        "type": "boss",
        "region": "yeu"
      },
      "minLevel": 12,
      "reward": {
        "stones": 51,
        "pills": 3,
        "xp": 98
      },
      "lineStart": "Lang vương quẩn quanh dấu kiếm ấy. Đừng để cú vồ cắt mất đường lui.",
      "lineDone": "Huyết khí tan, vết linh mạch kéo về Hắc Độc Trạch. Phải tìm Đường Uyển."
    },
    {
      "id": "m11",
      "chapter": "c2",
      "name": "Dược tâm hắc trạch",
      "desc": "Lĩnh ngộ Linh Dược Hắc Trạch, dò nguồn linh độc.",
      "giver": "swampMedic",
      "goal": {
        "type": "claim",
        "poi": "swampherb"
      },
      "minLevel": 15,
      "reward": {
        "stones": 40,
        "pills": 2,
        "xp": 80
      },
      "lineStart": "Cây dược này còn sống giữa vùng độc. Rễ nó biết điều mắt ta chưa thấy.",
      "lineDone": "Dòng khí mang linh độc từ ngoài trạch tới. Hắc Độc Chu Hoàng đang án ngữ lối dò."
    },
    {
      "id": "m12",
      "chapter": "c2",
      "name": "Chu hoàng lạc trận",
      "desc": "Hạ Hắc Độc Chu Hoàng tại Hắc Độc Trạch.",
      "giver": "swampMedic",
      "goal": {
        "type": "boss",
        "region": "tram"
      },
      "minLevel": 17,
      "reward": {
        "stones": 66,
        "pills": 3,
        "xp": 134
      },
      "lineStart": "Đợi vũng độc lắng rồi tiến. Giữ chân mình khỏi nơi tơ đen tụ.",
      "lineDone": "Độc khí đã tản, còn một luồng hàn khí phía bắc. Hãy hỏi ẩn sĩ Bạch Vân."
    },
    {
      "id": "m13",
      "chapter": "c3",
      "name": "Linh tuyền hàn ảnh",
      "desc": "Lĩnh ngộ Hàn Băng Linh Tuyền tại Bắc Minh Tuyết Vực.",
      "giver": "snowHermit",
      "goal": {
        "type": "claim",
        "poi": "snowaltar"
      },
      "minLevel": 19,
      "reward": {
        "stones": 48,
        "pills": 2,
        "xp": 99
      },
      "lineStart": "Linh tuyền vốn lạnh mà trong. Nay đáy nước vẫn ngân một tiếng lạ.",
      "lineDone": "Vân nước ghi dấu hỏa mạch. Hàn tuyết và lửa đỏ đang bị dẫn về cùng một nơi."
    },
    {
      "id": "m14",
      "chapter": "c3",
      "name": "Băng quân vấn đạo",
      "desc": "Hạ Bắc Minh Băng Quân tại Bắc Minh Tuyết Vực.",
      "giver": "snowHermit",
      "goal": {
        "type": "boss",
        "region": "tuyet"
      },
      "minLevel": 21,
      "reward": {
        "stones": 78,
        "pills": 3,
        "xp": 163
      },
      "lineStart": "Băng Quân giữ suối lạnh. Khi băng hiện dấu, hãy tránh trước rồi phản kích.",
      "lineDone": "Lời nước đã rõ. Đến Xích Viêm Hoang Mạc, tìm nửa dấu trận còn lại."
    },
    {
      "id": "m15",
      "chapter": "c3",
      "name": "Hỏa thạch nghịch lưu",
      "desc": "Lĩnh ngộ Xích Viêm Thạch tại Xích Viêm Hoang Mạc.",
      "giver": "desertSmith",
      "goal": {
        "type": "claim",
        "poi": "firealtar"
      },
      "minLevel": 24,
      "reward": {
        "stones": 58,
        "pills": 2,
        "xp": 123
      },
      "lineStart": "Tiểu hữu xem vân Xích Viêm Thạch: lửa đã đổi chiều, không về lòng đất.",
      "lineDone": "Hàn hỏa cùng chỉ về một đại trận; có kẻ đang gom linh lực của các vùng."
    },
    {
      "id": "m16",
      "chapter": "c3",
      "name": "Xích viêm tàn trận",
      "desc": "Hạ Xích Viêm Xà Vương tại Xích Viêm Hoang Mạc.",
      "giver": "desertSmith",
      "goal": {
        "type": "boss",
        "region": "hoa"
      },
      "minLevel": 26,
      "reward": {
        "stones": 93,
        "pills": 3,
        "xp": 199
      },
      "lineStart": "Xà vương án ngữ hỏa mạch. Chớ lao vào vùng lửa chỉ vì một đòn đánh.",
      "lineDone": "Dấu vân cuối đi theo gió. Thiên Phong Linh Đài sẽ cho ta câu trả lời."
    },
    {
      "id": "m17",
      "chapter": "c4",
      "name": "Phong đài vọng khí",
      "desc": "Lĩnh ngộ Thiên Phong Linh Đài tại Thiên Phong Cốc.",
      "giver": "inn",
      "goal": {
        "type": "claim",
        "poi": "phongaltar"
      },
      "minLevel": 28,
      "reward": {
        "stones": 66,
        "pills": 3,
        "xp": 142
      },
      "lineStart": "Lời nhắn Thanh Thạch: gió mang dấu trận đi xa, hãy đọc Thiên Phong Linh Đài.",
      "lineDone": "Gió dẫn về cổ mộ U Minh, nơi tàn hồn còn nhớ kẻ dựng đại trận."
    },
    {
      "id": "m18",
      "chapter": "c4",
      "name": "Phong lang thủ lộ",
      "desc": "Hạ Thiên Phong Lang Vương ở Thiên Phong Cốc.",
      "giver": "inn",
      "goal": {
        "type": "boss",
        "region": "phong"
      },
      "minLevel": 30,
      "reward": {
        "stones": 105,
        "pills": 4,
        "xp": 228
      },
      "lineStart": "Giữ lại khí lực khi Lang Vương áp sát. Tránh quạt đạn rồi tìm đường phản kích.",
      "lineDone": "Đã qua cửa gió. Tìm U Lan; nàng có thể nghe lời những tàn hồn xưa."
    },
    {
      "id": "m19",
      "chapter": "c4",
      "name": "Tàn hồn kể mạch",
      "desc": "Lĩnh ngộ Tàn Hồn Cổ Tu tại U Minh Quỷ Vực.",
      "giver": "ghostSeer",
      "goal": {
        "type": "claim",
        "poi": "ghostrune"
      },
      "minLevel": 33,
      "reward": {
        "stones": 76,
        "pills": 3,
        "xp": 166
      },
      "lineStart": "Tàn hồn quên tên mình, nhưng không quên lời thề của kẻ muốn gom vạn đạo.",
      "lineDone": "Tử Lôi Thiên Tôn muốn chiếm linh mạch. Ma Môn là dấu nối trước lôi nguyên."
    },
    {
      "id": "m20",
      "chapter": "c4",
      "name": "Quỷ hoàng tịch ảnh",
      "desc": "Hạ U Minh Quỷ Hoàng tại U Minh Quỷ Vực.",
      "giver": "ghostSeer",
      "goal": {
        "type": "boss",
        "region": "quy"
      },
      "minLevel": 35,
      "reward": {
        "stones": 120,
        "pills": 4,
        "xp": 264
      },
      "lineStart": "Quỷ Hoàng giữ cổ mộ. Chớ để bóng tối lấn át dấu đòn trước mắt.",
      "lineDone": "Tàn hồn được yên, lời trận còn rõ. Hãy tìm Mạc Ly ở Ma Vực."
    },
    {
      "id": "m21",
      "chapter": "c5",
      "name": "Ma môn hiện thế",
      "desc": "Khám phá Ma Vực để dò đường tới trận pháp Vạn Giới.",
      "giver": "demonWatcher",
      "goal": {
        "type": "discover",
        "region": "ma"
      },
      "minLevel": 37,
      "reward": {
        "stones": 84,
        "pills": 3,
        "xp": 186
      },
      "lineStart": "Ta trấn đường Vạn Giới. Trước khi giao chiến, hãy nhìn nơi trận khí hội tụ.",
      "lineDone": "Đường trận ở ngay Ma Vực. Dẹp bọn yêu thú trước khi đối mặt Tôn Giả."
    },
    {
      "id": "m22",
      "chapter": "c5",
      "name": "Ma khôi hộ trận",
      "desc": "Hạ 8 yêu thú tại Ma Vực.",
      "giver": "demonWatcher",
      "goal": {
        "type": "kill",
        "region": "ma",
        "count": 8
      },
      "minLevel": 38,
      "reward": {
        "stones": 86,
        "pills": 3,
        "xp": 190
      },
      "lineStart": "Ma khôi tụ quanh lối trận. Hãy giữ đường lui, từng bước giảm hiểm họa.",
      "lineDone": "Đã bớt yêu thú chắn lối. Ma Vực Tôn Giả vẫn còn giữ đầu mối cuối."
    },
    {
      "id": "m23",
      "chapter": "c5",
      "name": "Tôn giả đoạn môn",
      "desc": "Hạ Ma Vực Tôn Giả tại Ma Vực.",
      "giver": "demonWatcher",
      "goal": {
        "type": "boss",
        "region": "ma"
      },
      "minLevel": 39,
      "reward": {
        "stones": 132,
        "pills": 4,
        "xp": 293
      },
      "lineStart": "Tôn Giả canh cửa trận; đừng đánh đổi cả sinh mệnh chỉ để tiến thêm một bước.",
      "lineDone": "Ma Môn đã yên. Dấu khí cuối cùng hướng về Tử Lôi Hoang Nguyên."
    },
    {
      "id": "m24",
      "chapter": "c5",
      "name": "Lôi nguyên nhập cảnh",
      "desc": "Khám phá Tử Lôi Hoang Nguyên.",
      "giver": "inn",
      "goal": {
        "type": "discover",
        "region": "loi"
      },
      "minLevel": 41,
      "reward": {
        "stones": 92,
        "pills": 3,
        "xp": 205
      },
      "lineStart": "Lời nhắn Thanh Thạch: lôi nguyên là đầu mối cuối, tiểu hữu đừng vội cầu thắng.",
      "lineDone": "Đã tới lôi nguyên; Tử Lôi Thần Tích còn lưu dấu căn cơ đại trận."
    },
    {
      "id": "m25",
      "chapter": "c5",
      "name": "Thần tích minh tâm",
      "desc": "Lĩnh ngộ Tử Lôi Thần Tích, hiểu dấu vết trận pháp.",
      "giver": "inn",
      "goal": {
        "type": "claim",
        "poi": "loialtar"
      },
      "minLevel": 43,
      "reward": {
        "stones": 96,
        "pills": 3,
        "xp": 214
      },
      "lineStart": "Hãy đọc thần tích. Sức mạnh lớn đến đâu cũng phải có nơi dừng.",
      "lineDone": "Trận pháp thâu linh mạch để nuôi một người. Đạo không nên bắt sinh linh trả giá."
    },
    {
      "id": "m26",
      "chapter": "c5",
      "name": "Vạn Đạo quy chân",
      "desc": "Hạ Tử Lôi Thiên Tôn tại Tử Lôi Hoang Nguyên.",
      "giver": "inn",
      "goal": {
        "type": "boss",
        "region": "loi"
      },
      "minLevel": 44,
      "reward": {
        "stones": 147,
        "pills": 4,
        "xp": 329
      },
      "lineStart": "Thiên Tôn muốn vạn đạo quy về mình. Hãy để thiên địa được tự do lưu chuyển.",
      "lineDone": "Thiên Tôn đã bại. Vạn đạo cùng sinh, mỗi người tự chọn đường tu hành."
    }
  ],
  "side": [
    {
      "id": "s01",
      "chapter": "c1",
      "name": "Hành trang nhập thế",
      "desc": "Gặp Mộc Tử Y để nghe lời về chuẩn bị đan dược.",
      "giver": "shop",
      "region": "thon",
      "goal": {
        "type": "talk",
        "npc": "herbalist"
      },
      "minLevel": 1,
      "reward": {
        "stones": 12,
        "pills": 1,
        "xp": 13
      },
      "lineStart": "Dược sư có thể chỉ khách cách chuẩn bị hành trang.",
      "lineDone": "Khách đã hỏi rõ, ta cũng yên lòng."
    },
    {
      "id": "s02",
      "chapter": "c1",
      "name": "Giữ đường Đông Môn",
      "desc": "Hạ 4 yêu thú ở Thanh Trúc Lâm để giảm hiểm họa gần thôn.",
      "giver": "sentry",
      "region": "thon",
      "goal": {
        "type": "kill",
        "region": "truc",
        "count": 4
      },
      "minLevel": 3,
      "reward": {
        "stones": 16,
        "pills": 1,
        "xp": 22
      },
      "lineStart": "Đường trúc còn yêu thú. Giúp ta giữ an toàn lối vào.",
      "lineDone": "Đường đã bớt hiểm, đa tạ tiểu hữu."
    },
    {
      "id": "s03",
      "chapter": "c1",
      "name": "Dược lòng giữ đạo",
      "desc": "Gặp Tạ Vô Nhai để hỏi cách luyện tập không làm tổn hao sức.",
      "giver": "herbalist",
      "region": "thon",
      "goal": {
        "type": "talk",
        "npc": "wanderer"
      },
      "minLevel": 5,
      "reward": {
        "stones": 20,
        "pills": 1,
        "xp": 32
      },
      "lineStart": "Tạ kiếm khách hiểu nhịp luyện công. Hỏi xem nên nghỉ lúc nào.",
      "lineDone": "Đã hiểu cách giữ sức thì hãy luyện cho bền."
    },
    {
      "id": "s04",
      "chapter": "c1",
      "name": "Trúc ảnh gửi lời",
      "desc": "Gặp Trưởng lão Thanh Thạch để chuyển lời về tình hình Thanh Trúc Lâm.",
      "giver": "bambooKeeper",
      "region": "truc",
      "goal": {
        "type": "talk",
        "npc": "inn"
      },
      "minLevel": 7,
      "reward": {
        "stones": 24,
        "pills": 1,
        "xp": 42
      },
      "lineStart": "Nhờ đạo hữu chuyển lời: linh mạch rừng trúc có dấu hiệu bất thường.",
      "lineDone": "Lời đã tới đúng người. Ta xin cảm tạ."
    },
    {
      "id": "s05",
      "chapter": "c2",
      "name": "Sơn lộ vết chân",
      "desc": "Hạ 6 yêu thú ở Vạn Yêu Sơn.",
      "giver": "mountainHunter",
      "region": "yeu",
      "goal": {
        "type": "kill",
        "region": "yeu",
        "count": 6
      },
      "minLevel": 10,
      "reward": {
        "stones": 30,
        "pills": 2,
        "xp": 56
      },
      "lineStart": "Để mắt cả dấu chân gần lẫn xa.",
      "lineDone": "Đường núi bớt yêu. Làm tốt."
    },
    {
      "id": "s06",
      "chapter": "c2",
      "name": "Dược lộ bình an",
      "desc": "Hạ 5 yêu thú Hắc Độc Trạch.",
      "giver": "swampMedic",
      "region": "tram",
      "goal": {
        "type": "kill",
        "region": "tram",
        "count": 5
      },
      "minLevel": 15,
      "reward": {
        "stones": 40,
        "pills": 2,
        "xp": 80
      },
      "lineStart": "Giúp đường dược thảo bớt hiểm, đừng liều.",
      "lineDone": "Đa tạ. Giữ lại chút đan cho đường về."
    },
    {
      "id": "s07",
      "chapter": "c3",
      "name": "Tuyết tĩnh tâm an",
      "desc": "Hạ 6 yêu thú Bắc Minh Tuyết Vực.",
      "giver": "snowHermit",
      "region": "tuyet",
      "goal": {
        "type": "kill",
        "region": "tuyet",
        "count": 6
      },
      "minLevel": 19,
      "reward": {
        "stones": 48,
        "pills": 2,
        "xp": 99
      },
      "lineStart": "Tuyết che dấu chân, hãy giữ mắt sáng.",
      "lineDone": "Tuyết còn rơi, nhưng ngươi đã biết dừng đúng lúc."
    },
    {
      "id": "s08",
      "chapter": "c3",
      "name": "Hỏa vực hộ khí",
      "desc": "Hạ 7 yêu thú ở Xích Viêm Hoang Mạc.",
      "giver": "desertSmith",
      "region": "hoa",
      "goal": {
        "type": "kill",
        "region": "hoa",
        "count": 7
      },
      "minLevel": 24,
      "reward": {
        "stones": 58,
        "pills": 2,
        "xp": 123
      },
      "lineStart": "Đường đi tìm khoáng lắm yêu thú, nhờ ngươi dẹp bớt.",
      "lineDone": "Đa tạ. Binh khí thuận tay vẫn quý ở người cầm."
    },
    {
      "id": "s09",
      "chapter": "c4",
      "name": "U ảnh an hồn",
      "desc": "Hạ 8 yêu thú U Minh Quỷ Vực.",
      "giver": "ghostSeer",
      "region": "quy",
      "goal": {
        "type": "kill",
        "region": "quy",
        "count": 8
      },
      "minLevel": 33,
      "reward": {
        "stones": 76,
        "pills": 3,
        "xp": 166
      },
      "lineStart": "Tạm dẹp hiểm họa quanh cổ mộ, để người sống có đường đi.",
      "lineDone": "Hơi lạnh đã dịu. Hãy để tàn hồn được yên."
    },
    {
      "id": "s10",
      "chapter": "c5",
      "name": "U minh hồi tín",
      "desc": "Gặp U Lan để chuyển lời Mạc Ly về dấu vết linh mạch tại Ma Vực.",
      "giver": "demonWatcher",
      "region": "ma",
      "goal": {
        "type": "talk",
        "npc": "ghostSeer"
      },
      "minLevel": 37,
      "reward": {
        "stones": 84,
        "pills": 3,
        "xp": 186
      },
      "lineStart": "U Lan từng nghe chuyện trận cổ. Xin chuyển lời ta đến nàng.",
      "lineDone": "Lời đã truyền, mong hai vùng cùng giữ được bình an."
    }
  ]
};
