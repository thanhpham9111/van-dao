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
    },
    "sentry": {
      "portrait": null,
      "meetings": [
        {
          "id": "sentry_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Khoan đã, tiểu hữu. Đừng xem cổng là một vạch đá; bước qua nó là tự chịu lấy an nguy.",
              "next": "a1"
            },
            "b": {
              "speaker": "npc",
              "text": "Hãy xem Sơn Hà Đồ bằng phím M trước khi đi. Nhớ rõ cổng thôn, để khi cần còn biết đường trở lại.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Đừng đứng giữa bầy. Chừa một đường lùi; cứu được thân mình rồi mới tính chuyện trừ yêu.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Ừ. Đông Môn còn đây, giữ bình an mà trở lại.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "a1": {
              "speaker": "player",
              "text": "Lục huynh nhắc đúng. Ta chưa quen đường ngoài thôn.",
              "next": "a2"
            },
            "a2": {
              "speaker": "npc",
              "text": "Vậy hãy hỏi điều ngươi cần. Ta thà chậm một khắc còn hơn để người đi lạc.",
              "choices": [
                {
                  "text": "Xin hỏi đường ra ngoài thôn.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin chỉ cách giữ mình khi gặp yêu thú.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Đa tạ Lục huynh, ta xin đi.",
                  "next": "d"
                }
              ]
            }
          }
        },
        {
          "id": "sentry_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Lại qua Đông Môn rồi. Lần này, ta muốn nghe ngươi đã chuẩn bị đường về chưa.",
              "choices": [
                {
                  "text": "Ta muốn hỏi việc đề phòng.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin nghe lời khuyên khi bị thương.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Khi giao chiến, hãy nhìn cả lối ra. Địch mạnh hơn dự liệu thì rút, không cần cố thủ.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Sinh mệnh đã hao thì lui về thôn. Nơi an toàn mới thích hợp chỉnh đốn sức lực.",
              "next": null
            }
          }
        }
      ]
    },
    "herbalist": {
      "portrait": null,
      "meetings": [
        {
          "id": "herbalist_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Mùi dược thảo có vị đắng, vị thanh; phân biệt sai một rễ, phí cả công phu. Tiểu hữu muốn hỏi gì?",
              "choices": [
                {
                  "text": "Xin hỏi cách dùng đan dược.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin chỉ giáo về thảo mộc.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta chỉ ghé thăm, xin cáo từ.",
                  "next": "d"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Ta phân thuốc theo lúc cần, không theo giá quý. Thân thể không phải nơi để thử vận may.",
              "next": "b1"
            },
            "c": {
              "speaker": "npc",
              "text": "Nhặt được linh dược, hãy xem mục Nguyên liệu trong túi. Hiểu vật trong tay mới biết dùng chỗ nào.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Chúc tiểu hữu giữ được thân tâm an ổn.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "b1": {
              "speaker": "npc",
              "text": "Nhìn sinh mệnh và linh lực trước khi dùng đan; chừa chút dự phòng cho đường về.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            }
          }
        },
        {
          "id": "herbalist_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Ngồi một lát đi. Mùi thuốc đắng, nhưng lời hỏi thăm không nhất thiết phải đắng theo.",
              "choices": [
                {
                  "text": "Ta muốn hỏi trước chuyến đi xa.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin nghe một lời dưỡng khí.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Đan dược có đủ dùng không? Đồ cần đem đã chọn chưa? Đừng vội ra khỏi thôn khi chưa kiểm lại.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Cây thuốc còn cần thời gian bén rễ, tu sĩ cũng vậy. Khi linh lực hao hụt, đừng cố thúc thêm.",
              "next": null
            }
          }
        }
      ]
    },
    "wanderer": {
      "portrait": null,
      "meetings": [
        {
          "id": "wanderer_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Kiếm pháp không bắt đầu ở mũi kiếm. Nó bắt đầu khi người cầm kiếm biết dừng.",
              "next": "a2"
            },
            "b": {
              "speaker": "npc",
              "text": "Muốn luyện tay, thử vào Sân Luyện Kiếm bằng F6. Luyện cho rõ nhịp đánh và thời gian hồi chiêu.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Nhìn đòn địch trước, đợi sơ hở rồi xuất thủ. Một đường kiếm chắc hơn mười đường vội.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Hữu duyên gặp lại. Chớ phụ thời gian luyện tập.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "a2": {
              "speaker": "npc",
              "text": "Nếu tiểu hữu muốn học, ta có thể luận về một chiêu, không cần nói tới trăm chiêu.",
              "choices": [
                {
                  "text": "Xin hỏi về kiếm đạo.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin luận về thời cơ xuất kiếm.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta xin cáo từ.",
                  "next": "d"
                }
              ]
            }
          }
        },
        {
          "id": "wanderer_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Tạ Vô Nhai vẫn ở đây. Tay ngươi đã quen nhịp đòn chưa?",
              "choices": [
                {
                  "text": "Ta còn chưa quen kỹ năng.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi về thân pháp.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Hẹn ngày khác luận đạo.",
                  "next": "d"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Mở bảng kỹ năng bằng T, xem chiêu nào đã học và còn điểm để luyện. Hiểu chiêu rồi mới dùng.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Người chỉ biết tiến thường quên chân mình cũng cần một lối lui.",
              "next": "c1"
            },
            "d": {
              "speaker": "npc",
              "text": "Được. Chúc ngươi tiến bộ.",
              "next": null
            },
            "c1": {
              "speaker": "npc",
              "text": "Giữ lượt lướt cho lúc địch ra đòn hiểm. Thân pháp cứu người trước khi thắng địch.",
              "next": null
            }
          }
        }
      ]
    },
    "bambooKeeper": {
      "portrait": null,
      "meetings": [
        {
          "id": "bambooKeeper_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Nghe lá trúc thì dễ, đọc động tĩnh dưới tán trúc mới khó. Tiểu hữu muốn vào Thanh Trúc Lâm chăng?",
              "choices": [
                {
                  "text": "Xin hỏi rừng trúc.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi về Trúc Lang Vương.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta xin nhập rừng sau, cáo từ.",
                  "next": "d"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Đây là vùng Luyện Khí. Tập quan sát yêu thú và tiến từng đoạn, đừng vội vào sâu.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Trúc Lang Vương không phải chứng vật để người tu khoe dũng. Ta quý người biết sống giữa rừng hơn người chỉ muốn thắng.",
              "next": "c1"
            },
            "d": {
              "speaker": "npc",
              "text": "Chúc tiểu hữu biết tiến biết lui.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "c1": {
              "speaker": "npc",
              "text": "Hãy chuẩn bị sinh mệnh, linh lực, quan sát rồi mới đối đầu với Trúc Lang Vương.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            }
          }
        },
        {
          "id": "bambooKeeper_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Nghe kìa, lá trúc lại reo. Rừng chẳng thúc giục ai; tiểu hữu cũng chớ tự thúc mình.",
              "choices": [
                {
                  "text": "Xin nhắc ta cách đi trong rừng.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi lúc nào nên đối đầu Trúc Lang Vương.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Mở Sơn Hà Đồ để nhìn các lối nối từ Thanh Trúc Lâm. Đừng nhầm đường đi thật với chốn mình muốn đến.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Đợi khi đủ sức rồi quan sát động tác của nó. Đừng dồn tất cả chiêu thức vào lúc chưa rõ thế địch.",
              "next": null
            }
          }
        }
      ]
    },
    "mountainHunter": {
      "portrait": null,
      "meetings": [
        {
          "id": "mountainHunter_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Dừng chân. Ta nhìn đường trước khi nhìn binh khí của người đến.",
              "next": "a1"
            },
            "b": {
              "speaker": "npc",
              "text": "Vạn Yêu Sơn thuộc dải Trúc Cơ. Nếu chưa vững căn cơ, quay về vùng thấp hơn còn hơn liều mạng.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Nhìn con đứng xa nhất trước khi ra tay với con gần nhất. Chớ tự rước cả bầy vào trận.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Đi cẩn thận. Chớ cậy sức mà quên đường về.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "a1": {
              "speaker": "player",
              "text": "Hàn huynh thấy đường núi khó đi sao?",
              "next": "a2"
            },
            "a2": {
              "speaker": "npc",
              "text": "Khó hay dễ tùy căn cơ. Hỏi đi, ta nói thẳng.",
              "choices": [
                {
                  "text": "Xin hỏi cách đi đường núi.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi kinh nghiệm đối phó yêu thú.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta đã hiểu, xin cáo từ.",
                  "next": "d"
                }
              ]
            }
          }
        },
        {
          "id": "mountainHunter_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Lại tới đường núi? Tốt. Nhưng hôm nay cũng phải nhìn đường như lần đầu.",
              "choices": [
                {
                  "text": "Ta muốn hỏi về đường rút.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi khi nhiều yêu thú tới gần.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta xin đi tiếp.",
                  "next": "d"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Kẻ đi núi phải nhớ nơi đã đứng vững, không chỉ nơi muốn đến.",
              "next": "b1"
            },
            "c": {
              "speaker": "npc",
              "text": "Tìm nơi thoáng, giữ khoảng trống để lướt tránh. Đừng cố chen qua giữa bầy.",
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Ừ, chúc thuận đường.",
              "next": null
            },
            "b1": {
              "speaker": "npc",
              "text": "Nhìn bản đồ nhỏ và ghi nhớ hướng cổng. Lúc nguy cấp sẽ đỡ rối.",
              "next": null
            }
          }
        }
      ]
    },
    "snowHermit": {
      "portrait": null,
      "meetings": [
        {
          "id": "snowHermit_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Bạch tuyết phủ cả đường cũ lẫn đường mới. Người ham tiến thường chỉ nhìn phía trước.",
              "next": "a1"
            },
            "b": {
              "speaker": "npc",
              "text": "Bắc Minh Tuyết Vực thuộc dải Kim Đan. Hãy xem cấp tu hành của mình, rồi mới quyết định tiến xa.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Lấy hơi thở làm thước đo nhịp, chứ đừng lấy ý ham thắng làm thước đo sức.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Đường tuyết dài, mong tiểu hữu bình an.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "a1": {
              "speaker": "player",
              "text": "Ta muốn hiểu cách đi mà không lạc tâm.",
              "next": "a2"
            },
            "a2": {
              "speaker": "npc",
              "text": "Vậy nghe một lời ngắn. Tuyết không gấp, người cũng không cần gấp.",
              "choices": [
                {
                  "text": "Xin hỏi tuyết vực.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin luận cách giữ tâm tĩnh.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta xin cáo lui.",
                  "next": "d"
                }
              ]
            }
          }
        },
        {
          "id": "snowHermit_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Tuyết lại phủ dấu chân cũ. Ta không hỏi ngươi thắng bao nhiêu trận, chỉ hỏi tâm còn yên không.",
              "choices": [
                {
                  "text": "Ta sợ lạc hướng giữa tuyết.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin luận một chữ nhẫn.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Đừng chỉ theo màu cảnh vật. Hãy dựa vào bản đồ và ghi nhớ mốc đường đã đi qua.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Nhẫn chẳng phải chịu đòn. Nhẫn là đợi địch lộ sơ hở rồi mới dùng hết sức.",
              "next": null
            }
          }
        }
      ]
    },
    "swampMedic": {
      "portrait": null,
      "meetings": [
        {
          "id": "swampMedic_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Hắc Độc Trạch lắm chỗ khuất; dược sư cũng chẳng thích liều mình đi giữa sương. Tiểu hữu đã chuẩn bị đủ chưa?",
              "choices": [
                {
                  "text": "Xin hỏi cần mang gì.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi khi lâm nguy.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta xin cáo từ.",
                  "next": "d"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Ta lo nhất người giấu thương tích vì ngại quay về. Nơi này không cần ai chứng tỏ gan lớn.",
              "next": "b1"
            },
            "c": {
              "speaker": "npc",
              "text": "Tránh giao chiến trước, hồi phục sau. Đứng lại vì tiếc một con yêu thú có thể hại cả chuyến đi.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Chớ vì vội vàng mà quên bảo trọng.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "b1": {
              "speaker": "npc",
              "text": "Xem sinh mệnh và số đan dược; giữ một phần dự phòng cho chặng về.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            }
          }
        },
        {
          "id": "swampMedic_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Lần này đừng chỉ nói còn sức. Hãy nhìn thật vào sinh lực và linh lực của mình.",
              "choices": [
                {
                  "text": "Ta muốn biết khi nào nên về.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi cách giữ linh lực.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Sinh mệnh đã thấp, đường còn dài thì quay về thôn dưỡng sức. Đừng lấy một cuộc săn đổi an nguy.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Xem lượng MP và hồi chiêu trước mỗi trận. Đừng tung hết chiêu chỉ vì gặp một đối thủ yếu.",
              "next": null
            }
          }
        }
      ]
    },
    "desertSmith": {
      "portrait": null,
      "meetings": [
        {
          "id": "desertSmith_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Một món binh khí hợp tay đáng giá hơn món quý chỉ để ngắm.",
              "next": "a2"
            },
            "b": {
              "speaker": "npc",
              "text": "Mở túi bằng I, xem công, thủ và kiểu binh khí. Chọn đúng ô và cách đánh của mình.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Cường hoá phải xét giá trước từng bậc. Đừng dành hết linh thạch cho một món mà bỏ quên đường xa.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Ừ, nhớ giữ binh khí cho chắc tay.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "a2": {
              "speaker": "npc",
              "text": "Nói ta nghe, ngươi đang tìm thứ giúp mình đánh tốt hay chỉ muốn ánh vàng trên vỏ kiếm?",
              "choices": [
                {
                  "text": "Xin hỏi cách chọn trang bị.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi về cường hoá.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta chỉ ghé qua, xin cáo từ.",
                  "next": "d"
                }
              ]
            }
          }
        },
        {
          "id": "desertSmith_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Thiết Nham đây. Binh khí hôm nay còn thuận tay không?",
              "choices": [
                {
                  "text": "Ta muốn so sánh hai món đồ.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi về linh bảo.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Xin cáo từ.",
                  "next": "d"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Vũ khí quý ở công kích, giáp quý ở phòng ngự, phụ kiện bổ chỗ thiếu. Đừng chỉ nhìn tên đẹp.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Linh bảo cũng như đồ nghề, đứng cạnh đúng thứ thì mới phát huy sở trường.",
              "next": "c1"
            },
            "d": {
              "speaker": "npc",
              "text": "Đi đi, bảo trọng.",
              "next": null
            },
            "c1": {
              "speaker": "npc",
              "text": "Xem cặp linh bảo kề nhau có tương sinh không; lựa theo thứ ngươi đang thiếu.",
              "next": null
            }
          }
        }
      ]
    },
    "demonWatcher": {
      "portrait": null,
      "meetings": [
        {
          "id": "demonWatcher_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Đến Ma Vực, kẻ giữ tỉnh táo còn có đường về. Chớ vội lấy tu vi làm lời bảo đảm. Tiểu hữu muốn hỏi gì?",
              "choices": [
                {
                  "text": "Xin hỏi nên lưu tâm điều gì.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi cách tránh hoảng loạn.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Xin cáo từ.",
                  "next": "d"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Ma Vực thuộc dải Hóa Thần. Nếu cảnh giới còn thấp, chớ vội đối đầu hiểm địch chỉ vì tò mò.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Trong hiểm cảnh, điều ta sợ nhất không phải bóng tối mà là người tự để cơn giận dẫn đường.",
              "next": "c1"
            },
            "d": {
              "speaker": "npc",
              "text": "Giữ tâm vững. Chớ tự đặt mình vào hiểm cảnh.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "c1": {
              "speaker": "npc",
              "text": "Nhìn dấu hiệu đòn địch trước khi xuất thủ; hãy để quyết định của mình đi trước nỗi sợ.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            }
          }
        },
        {
          "id": "demonWatcher_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Mạc Ly đây. Ta không đo lòng can đảm bằng số lần người tiến vào Ma Vực.",
              "choices": [
                {
                  "text": "Ta muốn hỏi việc đối đầu kẻ mạnh.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin nghe lời khuyên giữ tâm.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                }
              ]
            },
            "b": {
              "speaker": "npc",
              "text": "Nhớ giữ đủ linh lực và lượt lướt để thoát hiểm. Chỉ dùng tuyệt chiêu lúc địch lộ sơ hở.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Ma khí làm cảnh vật u ám; tâm ngươi hãy sáng. Chọn hành động vì hiểu địch, không vì giận địch.",
              "next": null
            }
          }
        }
      ]
    },
    "ghostSeer": {
      "portrait": null,
      "meetings": [
        {
          "id": "ghostSeer_1",
          "when": {
            "talkedBefore": false
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "Ở chốn này, tiếng chân người nghe rõ hơn tiếng nói. Xin tiểu hữu dừng một nhịp.",
              "next": "a2"
            },
            "b": {
              "speaker": "npc",
              "text": "Hãy xem Sơn Hà Đồ và nhớ lối nối vùng. Đừng để sương mờ khiến ngươi quên hướng về.",
              "effects": {
                "talked": true,
                "favor": 6
              },
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Biết sợ để biết thận trọng, chẳng phải để mất can đảm. Nhận rõ hiểm rồi mới bước.",
              "effects": {
                "talked": true,
                "favor": 8
              },
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Mong người giữ được lòng sáng.",
              "effects": {
                "talked": true,
                "favor": 5
              },
              "next": null
            },
            "a2": {
              "speaker": "npc",
              "text": "Ta có thể nói về đường đi, hoặc về điều khiến lòng người không muốn bước tiếp.",
              "choices": [
                {
                  "text": "Xin hỏi đường trong quỷ vực.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin hỏi về nỗi sợ.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta xin cáo từ.",
                  "next": "d"
                }
              ]
            }
          }
        },
        {
          "id": "ghostSeer_2",
          "when": {
            "talkedBefore": true
          },
          "start": "a",
          "nodes": {
            "a": {
              "speaker": "npc",
              "text": "U Lan hỏi một câu: khi bóng tối kéo dài, ngươi tìm đường trước hay tìm người để trấn an mình?",
              "next": "a2"
            },
            "b": {
              "speaker": "npc",
              "text": "Tìm lại nơi vừa đi qua, đối chiếu bản đồ. Đừng tự lao vào chỗ tối khi chưa xác định hướng.",
              "next": null
            },
            "c": {
              "speaker": "npc",
              "text": "Mắt thấy cảnh đổi, tâm vẫn có thể tĩnh. Không biết thì dừng, biết rồi thì tiến.",
              "next": null
            },
            "d": {
              "speaker": "npc",
              "text": "Hẹn gặp lại khi hữu duyên.",
              "next": null
            },
            "a2": {
              "speaker": "npc",
              "text": "Không cần đáp vội. Chọn điều ngươi muốn nghe.",
              "choices": [
                {
                  "text": "Ta muốn biết khi không rõ đường.",
                  "next": "b"
                },
                {
                  "text": "[Thiện cảm ≥ 5] Xin nghe lời khuyên về tâm cảnh.",
                  "cond": {
                    "favorMin": 5
                  },
                  "next": "c"
                },
                {
                  "text": "Ta xin đi trước.",
                  "next": "d"
                }
              ]
            }
          }
        }
      ]
    }
  }
};
