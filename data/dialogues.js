DATA.dialogues = {
  "version": 1,
  "npcs": {
    "inn": {
      "portrait": null,
      "meetings": [
        {
          "id": "inn_1",
          "when": { "talkedBefore": false },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Tiểu hữu mới đến Thanh Thạch Thôn chăng? Ta trông khí tức của ngươi, hẳn vừa bước vào con đường tu hành.", "next": "a1" },
            "a1": { "speaker": "player", "text": "Đệ tử mới nhập thế, mong được trưởng lão chỉ giáo.", "next": "b" },
            "b": { "speaker": "npc", "text": "Tu đạo quý ở bền tâm. Ngươi có điều gì muốn hỏi lão phu?", "choices": [
              { "text": "Đệ tử xin trưởng lão chỉ giáo.", "next": "c" },
              { "text": "Thanh Thạch Thôn là nơi nào?", "next": "d" },
              { "text": "Đa tạ trưởng lão, đệ tử xin cáo từ.", "next": "e" }
            ] },
            "c": { "speaker": "npc", "text": "Trước hết hãy vững căn cơ. Khi ra ngoài thôn, quan sát yêu thú, giữ đủ linh lực và chớ khinh địch.", "effects": { "talked": true, "favor": 5 }, "next": null },
            "d": { "speaker": "npc", "text": "Đây là Thanh Thạch Thôn, nơi người mới tìm chốn an thân. Hãy làm quen với dân trong thôn trước khi lên đường.", "effects": { "talked": true, "favor": 3 }, "next": null },
            "e": { "speaker": "npc", "text": "Được. Trên đường hành đạo, nhớ lấy hai chữ cẩn trọng. Khi cần, cứ trở lại tìm ta.", "effects": { "talked": true }, "next": null }
          }
        },
        {
          "id": "inn_2",
          "when": { "talkedBefore": true, "notFlag": "inn_second_done" },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Lại gặp tiểu hữu. Đường tu không chỉ cần công pháp, mà còn cần biết tiến lui đúng lúc.", "next": "b" },
            "b": { "speaker": "npc", "text": "Ngươi đã chuẩn bị gì cho chuyến đi xa chưa?", "choices": [
              { "text": "Xin chỉ cách giữ an toàn khi giao chiến.", "next": "c" },
              { "text": "[Thiện cảm ≥ 5] Xin hỏi về Thanh Trúc Lâm.", "cond": { "favorMin": 5 }, "next": "d" },
              { "text": "Đệ tử sẽ tự rèn luyện. Xin cáo từ.", "next": "e" }
            ] },
            "c": { "speaker": "npc", "text": "Khi sinh lực suy kiệt, đừng cố ham thắng. Tạm lui, hồi phục rồi mới tìm cơ hội phản công.", "effects": { "setFlag": "inn_second_done", "favor": 5 }, "next": null },
            "d": { "speaker": "npc", "text": "Thanh Trúc Lâm là đất của Trúc Lang Vương. Đừng vội đối đầu khi căn cơ còn yếu, hãy quan sát thế trận trước.", "effects": { "setFlag": "inn_second_done", "favor": 5 }, "next": null },
            "e": { "speaker": "npc", "text": "Có chí là tốt. Nhớ rằng tự lượng sức cũng là một phần của đạo tâm.", "effects": { "setFlag": "inn_second_done" }, "next": null }
          }
        },
        {
          "id": "inn_3",
          "when": { "talkedBefore": true, "flag": "inn_second_done" },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Trở về thôn rồi sao? Dù đi được bao xa, cũng đừng quên cái tâm thuở ban đầu.", "choices": [
              { "text": "Xin trưởng lão nhắc lại đạo lý tu hành.", "next": "b" },
              { "text": "[Thiện cảm ≥ 8] Xin lĩnh hội lời khuyên về Trúc Lang Vương.", "cond": { "favorMin": 8 }, "next": "c" },
              { "text": "Đệ tử ghi nhớ. Xin cáo từ.", "next": "d" }
            ] },
            "b": { "speaker": "npc", "text": "Căn cơ vững, tâm không loạn, biết dừng đúng lúc. Ba điều ấy theo ngươi qua mọi cảnh giới.", "next": null },
            "c": { "speaker": "npc", "text": "Đối với lang vương, thắng bại không chỉ ở sức mạnh. Hãy giữ khoảng cách hợp với sở trường và để dành đường lui.", "next": null },
            "d": { "speaker": "npc", "text": "Đi đi. Mong ngày gặp lại, đạo tâm của ngươi vẫn sáng như hôm nay.", "next": null }
          }
        }
      ]
    },
    "shop": {
      "portrait": null,
      "meetings": [
        {
          "id": "shop_1",
          "when": { "notFlag": "shop_intro_done" },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Khách quan ghé Linh Dược sao? Ta là dược thương nơi đây. Trước lúc xuất hành, nên xem trong túi còn đủ đan dược hay không.", "next": "b" },
            "b": { "speaker": "npc", "text": "Khách quan cần xem hàng hay muốn nghe đôi lời về việc chuẩn bị hành trang?", "choices": [
              { "text": "Cho ta xem hàng.", "effects": { "setFlag": "shop_intro_done", "favor": 3, "openShop": true }, "next": null },
              { "text": "Xin chủ tiệm chỉ cách chuẩn bị hành trang.", "next": "c" },
              { "text": "Ta chỉ ghé thăm. Xin cáo từ.", "next": "d" }
            ] },
            "c": { "speaker": "npc", "text": "Đan dược để lúc cần, linh thạch để lúc thiếu. Hãy kiểm tra túi đồ trước khi đi xa, đừng đợi lâm nguy mới nhớ.", "effects": { "setFlag": "shop_intro_done", "favor": 3 }, "next": null },
            "d": { "speaker": "npc", "text": "Khách quan cứ thong thả. Khi cần đan dược, mời ghé lại.", "effects": { "setFlag": "shop_intro_done" }, "next": null }
          }
        },
        {
          "id": "shop_2",
          "when": { "flag": "shop_intro_done", "notFlag": "shop_second_done" },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Ồ, khách quen! Hôm nay muốn sắm thêm dược phẩm hay hỏi đôi điều trước chuyến đi?", "choices": [
              { "text": "Cho ta xem hàng.", "effects": { "setFlag": "shop_second_done", "favor": 3, "openShop": true }, "next": null },
              { "text": "Khi thiếu sinh lực, nên làm gì?", "next": "b" },
              { "text": "Ta chưa cần mua thêm. Hẹn gặp lại.", "next": "c" }
            ] },
            "b": { "speaker": "npc", "text": "Đừng đợi đến khi hết sạch sinh lực. Hãy rời nơi nguy hiểm, hồi phục theo khả năng của mình rồi mới tiếp tục.", "effects": { "setFlag": "shop_second_done", "favor": 4 }, "next": null },
            "c": { "speaker": "npc", "text": "Được thôi. Hành trang đầy đủ thì lòng cũng bớt lo, khách quan nhớ giữ gìn.", "effects": { "setFlag": "shop_second_done" }, "next": null }
          }
        },
        {
          "id": "shop_3",
          "when": { "flag": "shop_second_done" },
          "start": "a",
          "nodes": {
            "a": { "speaker": "npc", "text": "Khách quan lại tới rồi. Tiệm vẫn mở cửa, hôm nay cần gì cứ nói.", "choices": [
              { "text": "Cho ta xem hàng.", "effects": { "openShop": true }, "next": null },
              { "text": "[Thiện cảm ≥ 5] Xin nghe kinh nghiệm của chủ tiệm.", "cond": { "favorMin": 5 }, "next": "b" },
              { "text": "Để lần sau vậy. Xin cáo từ.", "next": "c" }
            ] },
            "b": { "speaker": "npc", "text": "Đi xa không nhất thiết mang thật nhiều. Cần nhất là đủ dùng, biết chừa phần dự phòng và đừng mua quá khả năng.", "next": null },
            "c": { "speaker": "npc", "text": "Hẹn ngày tái ngộ. Chúc khách quan lên đường bình an.", "next": null }
          }
        }
      ]
    }
  }
};
