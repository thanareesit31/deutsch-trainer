import type { DialogueTopic } from "@/lib/phrase-dialogue-learning";
export const a11PhraseDialogues: Readonly<Record<string, readonly DialogueTopic[]>> = {
  "L03": [
    {
      "id": "L03-COMM-01",
      "objective": "L03-COMM-01",
      "title": "คนในครอบครัว",
      "modelVisual": {
        "kind": "board",
        "theme": "family",
        "title": "ครอบครัวของ Anna",
        "rows": [
          [
            "Lena",
            "น้องสาวของ Anna"
          ]
        ]
      },
      "note": [
        "แยกคนเดียวด้วย das ist กับหลายคนด้วย das sind",
        "ระบุความสัมพันธ์จากข้อมูลครอบครัว ไม่เดาจากอายุหรือหน้าตา"
      ],
      "audio": "/audio/l03/model-l03-comm-01.m4a",
      "models": [
        {
          "question": "Ist das deine Mutter?",
          "reply": "Nein, das ist meine Schwester Lena.",
          "questionMeaning": "นั่นคือแม่ของเธอใช่ไหม",
          "replyMeaning": "ไม่ นั่นคือน้องสาวของฉันชื่อเลนา",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "ครอบครัวของ Anna",
            "rows": [
              [
                "Lena",
                "น้องสาวของ Anna"
              ]
            ]
          }
        },
        {
          "question": "Sind das deine Eltern?",
          "reply": "Ja, das sind meine Eltern.",
          "questionMeaning": "นั่นคือพ่อแม่ของเธอใช่ไหม",
          "replyMeaning": "ใช่ นั่นคือพ่อแม่ของฉัน",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "ครอบครัวของผู้ตอบ B",
            "rows": [
              [
                "บุคคลที่กำลังพูดถึง",
                "พ่อและแม่ของ B"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L03-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Ist das deine Mutter?",
          "promptMeaning": "นั่นคือแม่ของเธอใช่ไหม",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "ครอบครัวของ Anna",
            "rows": [
              [
                "Lena",
                "น้องสาวของ Anna"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลกำหนดว่า Lena เป็นน้องสาว จึงแก้ความเข้าใจด้วย Nein แล้วบอกความสัมพันธ์ที่ถูก",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L03-COMM-01-D01-learn-v1-response",
            "targetId": "L03-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, das ist meine Schwester Lena.",
            "meaning": "ไม่ นั่นคือน้องสาวของฉันชื่อเลนา"
          },
          "options": [
            "Nein, das ist meine Schwester Lena.",
            "Ja, das ist meine Mutter.",
            "Das ist mein Vater."
          ]
        },
        {
          "id": "L03-COMM-01-D02-learn-v1",
          "kind": "order",
          "prompt": "Sind das deine Eltern?",
          "promptMeaning": "นั่นคือพ่อแม่ของเธอใช่ไหม",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "ครอบครัวของผู้ตอบ B",
            "rows": [
              [
                "บุคคลที่กำลังพูดถึง",
                "พ่อและแม่ของ B"
              ]
            ]
          },
          "audio": null,
          "explanation": "เมื่อพูดถึงพ่อกับแม่สองคน ใช้ das sind",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L03-COMM-01-D02-learn-v1-response",
            "targetId": "L03-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ja, das sind meine Eltern.",
            "meaning": "ใช่ นั่นคือพ่อแม่ของฉัน"
          },
          "tokens": [
            "das",
            "meine",
            "Ja,",
            "sind",
            "Eltern."
          ]
        },
        {
          "id": "L03-COMM-01-PROFILE-learn-v1",
          "kind": "profile",
          "prompt": "อ่านแล้วเติมข้อมูล",
          "promptMeaning": "",
          "visual": {
            "kind": "reading",
            "text": "Lena ist Annas Schwester. Lena spricht Thai und Deutsch."
          },
          "audio": null,
          "explanation": "หาข้อมูลเฉพาะของแต่ละช่องจากข้อความ โดยเก็บผลแยกกัน",
          "assistance": [
            "prior-model",
            "visible-reading"
          ],
          "fields": [
            {
              "label": "ชื่อน้องสาวของ Anna",
              "unit": {
                "id": "L03-COMM-01-PROFILE-learn-v1-name-response",
                "targetId": "L03-COMM-01-PROFILE-learn-v1-name-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "Lena",
                "meaning": "น้องสาวชื่อเลนา"
              }
            },
            {
              "label": "ภาษาอื่นนอกจากไทย",
              "unit": {
                "id": "L03-COMM-01-PROFILE-learn-v1-language-response",
                "targetId": "L03-COMM-01-PROFILE-learn-v1-language-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "Deutsch",
                "meaning": "พูดภาษาเยอรมัน"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "L03-COMM-02",
      "objective": "L03-COMM-02",
      "title": "ใช่หรือไม่ใช่",
      "modelVisual": {
        "kind": "board",
        "theme": "family",
        "title": "บุคคลที่กำลังพูดถึง",
        "rows": [
          [
            "ผู้ตอบคิดว่า",
            "เป็นแม่ของ Jan"
          ],
          [
            "ความมั่นใจ",
            "ยังไม่แน่ใจ"
          ]
        ]
      },
      "note": [
        "Doch ใช้ยืนยันสิ่งที่คำถามปฏิเสธไว้",
        "Ich glaube … บอกว่ายังเป็นการคาดเดา"
      ],
      "audio": "/audio/l03/model-l03-comm-02.m4a",
      "models": [
        {
          "question": "Wer ist das?",
          "reply": "Ich glaube, das ist Jans Mutter.",
          "questionMeaning": "นั่นคือใคร",
          "replyMeaning": "ฉันคิดว่านั่นคือแม่ของยาน",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "บุคคลที่กำลังพูดถึง",
            "rows": [
              [
                "ผู้ตอบคิดว่า",
                "เป็นแม่ของ Jan"
              ],
              [
                "ความมั่นใจ",
                "ยังไม่แน่ใจ"
              ]
            ]
          }
        },
        {
          "question": "Ist das nicht deine Mutter?",
          "reply": "Doch, das ist meine Mutter.",
          "questionMeaning": "นั่นไม่ใช่แม่ของเธอเหรอ",
          "replyMeaning": "ใช่ นั่นคือแม่ของฉัน",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "บุคคลที่กำลังพูดถึง",
            "rows": [
              [
                "ความสัมพันธ์กับ B",
                "แม่"
              ]
            ]
          }
        },
        {
          "question": "Ist das nicht dein Vater?",
          "reply": "Nein, das ist mein Onkel.",
          "questionMeaning": "นั่นไม่ใช่พ่อของเธอเหรอ",
          "replyMeaning": "ไม่ใช่ นั่นคือลุงของฉัน",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "บุคคลที่กำลังพูดถึง",
            "rows": [
              [
                "ความสัมพันธ์กับ B",
                "ลุง ไม่ใช่พ่อ"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L03-COMM-02-D01-learn-v1",
          "kind": "order",
          "prompt": "Wer ist das?",
          "promptMeaning": "นั่นคือใคร",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "บุคคลที่กำลังพูดถึง",
            "rows": [
              [
                "ผู้ตอบคิดว่า",
                "เป็นแม่ของ Jan"
              ],
              [
                "ความมั่นใจ",
                "ยังไม่แน่ใจ"
              ]
            ]
          },
          "audio": null,
          "explanation": "เติม Ich glaube เพื่อแสดงว่ายังไม่มั่นใจ",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L03-COMM-02-D01-learn-v1-response",
            "targetId": "L03-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich glaube, das ist Jans Mutter.",
            "meaning": "ฉันคิดว่านั่นคือแม่ของยาน"
          },
          "tokens": [
            "glaube,",
            "ist",
            "Mutter.",
            "Ich",
            "das",
            "Jans"
          ]
        },
        {
          "id": "L03-COMM-02-D02-learn-v1",
          "kind": "choice",
          "prompt": "Ist das nicht deine Mutter?",
          "promptMeaning": "นั่นไม่ใช่แม่ของเธอเหรอ",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "บุคคลที่กำลังพูดถึง",
            "rows": [
              [
                "ความสัมพันธ์กับ B",
                "แม่"
              ]
            ]
          },
          "audio": null,
          "explanation": "คำถามปฏิเสธว่าไม่ใช่แม่ แต่จริง ๆ เป็นแม่ จึงยืนยันด้วย Doch",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L03-COMM-02-D02-learn-v1-response",
            "targetId": "L03-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Doch, das ist meine Mutter.",
            "meaning": "ใช่ นั่นคือแม่ของฉัน"
          },
          "options": [
            "Nein, das ist meine Mutter.",
            "Ja, das ist mein Vater.",
            "Doch, das ist meine Mutter."
          ]
        },
        {
          "id": "L03-COMM-02-D03-learn-v1",
          "kind": "choice",
          "prompt": "Ist das nicht dein Vater?",
          "promptMeaning": "นั่นไม่ใช่พ่อของเธอเหรอ",
          "visual": {
            "kind": "board",
            "theme": "family",
            "title": "บุคคลที่กำลังพูดถึง",
            "rows": [
              [
                "ความสัมพันธ์กับ B",
                "ลุง ไม่ใช่พ่อ"
              ]
            ]
          },
          "audio": null,
          "explanation": "จริง ๆ เป็นลุง จึงปฏิเสธว่าไม่ใช่พ่อแล้วบอกความสัมพันธ์ที่ถูก",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L03-COMM-02-D03-learn-v1-response",
            "targetId": "L03-COMM-02-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, das ist mein Onkel.",
            "meaning": "ไม่ใช่ นั่นคือลุงของฉัน"
          },
          "options": [
            "Nein, das ist mein Onkel.",
            "Doch, das ist mein Vater.",
            "Ja, das ist mein Vater."
          ]
        }
      ]
    },
    {
      "id": "L03-COMM-03",
      "objective": "L03-COMM-03",
      "title": "พูดภาษาอะไรได้บ้าง",
      "modelVisual": {
        "kind": "board",
        "theme": "ability",
        "title": "ภาษาของ B",
        "rows": [
          [
            "ไทย",
            "ดีมาก"
          ],
          [
            "เยอรมัน",
            "เล็กน้อย"
          ]
        ]
      },
      "note": [
        "บอกระดับได้ด้วย sehr gut / ein bisschen / gar nicht",
        "คำถาม Sie ใช้กับคู่สนทนาอย่างสุภาพ"
      ],
      "audio": "/audio/l03/model-l03-comm-03.m4a",
      "models": [
        {
          "question": "Welche Sprachen sprichst du?",
          "reply": "Ich spreche sehr gut Thai und ein bisschen Deutsch.",
          "questionMeaning": "เธอพูดภาษาอะไรบ้าง",
          "replyMeaning": "ฉันพูดไทยได้ดีมากและพูดเยอรมันได้เล็กน้อย",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ภาษาของ B",
            "rows": [
              [
                "ไทย",
                "ดีมาก"
              ],
              [
                "เยอรมัน",
                "เล็กน้อย"
              ]
            ]
          }
        },
        {
          "question": "Sprechen Sie Französisch?",
          "reply": "Nein, gar nicht.",
          "questionMeaning": "คุณพูดภาษาฝรั่งเศสได้ไหม",
          "replyMeaning": "ไม่ได้เลย",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ภาษาของ B",
            "rows": [
              [
                "ฝรั่งเศส",
                "พูดไม่ได้เลย"
              ]
            ]
          }
        },
        {
          "question": "Sprechen Sie Englisch?",
          "reply": "Ja, ein bisschen.",
          "questionMeaning": "คุณพูดภาษาอังกฤษได้ไหม",
          "replyMeaning": "ได้เล็กน้อย",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ภาษาของ B",
            "rows": [
              [
                "อังกฤษ",
                "พูดได้เล็กน้อย"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L03-COMM-03-D01-learn-v1",
          "kind": "order",
          "prompt": "Welche Sprachen sprichst du?",
          "promptMeaning": "เธอพูดภาษาอะไรบ้าง",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ภาษาของ B",
            "rows": [
              [
                "ไทย",
                "ดีมาก"
              ],
              [
                "เยอรมัน",
                "เล็กน้อย"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ sehr gut กับภาษาไทย และ ein bisschen กับภาษาเยอรมันตามข้อมูล",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L03-COMM-03-D01-learn-v1-response",
            "targetId": "L03-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich spreche sehr gut Thai und ein bisschen Deutsch.",
            "meaning": "ฉันพูดไทยได้ดีมากและพูดเยอรมันได้เล็กน้อย"
          },
          "tokens": [
            "spreche",
            "gut",
            "und",
            "bisschen",
            "Ich",
            "sehr",
            "Thai",
            "ein",
            "Deutsch."
          ]
        },
        {
          "id": "L03-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "Sprechen Sie Französisch?",
          "promptMeaning": "คุณพูดภาษาฝรั่งเศสได้ไหม",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ภาษาของ B",
            "rows": [
              [
                "ฝรั่งเศส",
                "พูดไม่ได้เลย"
              ]
            ]
          },
          "audio": null,
          "explanation": "gar nicht บอกว่าพูดภาษาที่ถามไม่ได้เลย",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L03-COMM-03-D02-learn-v1-response",
            "targetId": "L03-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, gar nicht.",
            "meaning": "ไม่ได้เลย"
          },
          "options": [
            "Nein, gar nicht.",
            "Ja, sehr gut.",
            "Ja, ein bisschen."
          ]
        },
        {
          "id": "L03-COMM-03-D03-learn-v1",
          "kind": "choice",
          "prompt": "Sprechen Sie Englisch?",
          "promptMeaning": "คุณพูดภาษาอังกฤษได้ไหม",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ภาษาของ B",
            "rows": [
              [
                "อังกฤษ",
                "พูดได้เล็กน้อย"
              ]
            ]
          },
          "audio": null,
          "explanation": "ein bisschen บอกว่าพูดได้เล็กน้อย",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L03-COMM-03-D03-learn-v1-response",
            "targetId": "L03-COMM-03-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ja, ein bisschen.",
            "meaning": "ได้เล็กน้อย"
          },
          "options": [
            "Nein, gar nicht.",
            "Ja, ein bisschen.",
            "Ja, sehr gut."
          ]
        },
        {
          "id": "L03-COMM-03-AUDIO-learn-v1",
          "kind": "choice",
          "prompt": "ฟังแล้วเลือกภาษาที่พูดได้เล็กน้อย",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l03/l03-comm-03-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "reply-options"
          ],
          "unit": {
            "id": "L03-COMM-03-AUDIO-learn-v1-response",
            "targetId": "L03-COMM-03-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "Englisch.",
            "meaning": "พูดอังกฤษได้เล็กน้อย"
          },
          "options": [
            "Deutsch.",
            "Englisch.",
            "Französisch."
          ]
        }
      ]
    }
  ],
  "L04": [
    {
      "id": "L04-COMM-01",
      "objective": "L04-COMM-01",
      "title": "ถามราคา",
      "modelVisual": {
        "kind": "image",
        "src": "/images/lektion-04-vocabulary/V044-isolated-v2.jpg",
        "alt": "เก้าอี้",
        "caption": "19,99 € · ราคาพิเศษ"
      },
      "note": [
        "บอกราคาตามป้ายและแยก Euro กับ Cent",
        "ใช้ er / sie / es ตามคำนามที่กำลังพูดถึง"
      ],
      "audio": "/audio/l04/model-l04-comm-01.m4a",
      "models": [
        {
          "question": "Was kostet der Stuhl?",
          "reply": "Er kostet 19 Euro 99. Das ist ein Sonderangebot.",
          "questionMeaning": "เก้าอี้ตัวนี้ราคาเท่าไร",
          "replyMeaning": "ราคา 19 ยูโร 99 เซนต์ เป็นราคาพิเศษ",
          "visual": {
            "kind": "image",
            "src": "/images/lektion-04-vocabulary/V044-isolated-v2.jpg",
            "alt": "เก้าอี้",
            "caption": "19,99 € · ราคาพิเศษ"
          }
        },
        {
          "question": "Wie viel kostet die Lampe?",
          "reply": "Sie kostet 35 Euro.",
          "questionMeaning": "โคมไฟนี้ราคาเท่าไร",
          "replyMeaning": "ราคา 35 ยูโร",
          "visual": {
            "kind": "image",
            "src": "/images/lektion-04-vocabulary/V046.jpg",
            "alt": "โคมไฟ",
            "caption": "35,00 €"
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L04-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Was kostet der Stuhl?",
          "promptMeaning": "เก้าอี้ตัวนี้ราคาเท่าไร",
          "visual": {
            "kind": "image",
            "src": "/images/lektion-04-vocabulary/V044-isolated-v2.jpg",
            "alt": "เก้าอี้",
            "caption": "19,99 € · ราคาพิเศษ"
          },
          "audio": null,
          "explanation": "ราคา 19,99 € อ่านว่า 19 Euro 99 และป้ายระบุว่าเป็นราคาพิเศษ",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L04-COMM-01-D01-learn-v1-response",
            "targetId": "L04-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Er kostet 19 Euro 99. Das ist ein Sonderangebot.",
            "meaning": "ราคา 19 ยูโร 99 เซนต์ เป็นราคาพิเศษ"
          },
          "options": [
            "Er kostet 99 Euro.",
            "Er kostet 19 Euro 99. Das ist ein Sonderangebot.",
            "Er kostet 35 Euro."
          ]
        },
        {
          "id": "L04-COMM-01-D02-learn-v1",
          "kind": "order",
          "prompt": "Wie viel kostet die Lampe?",
          "promptMeaning": "โคมไฟนี้ราคาเท่าไร",
          "visual": {
            "kind": "image",
            "src": "/images/lektion-04-vocabulary/V046.jpg",
            "alt": "โคมไฟ",
            "caption": "35,00 €"
          },
          "audio": null,
          "explanation": "die Lampe ใช้ sie และตามด้วยราคา 35 Euro",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L04-COMM-01-D02-learn-v1-response",
            "targetId": "L04-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Sie kostet 35 Euro.",
            "meaning": "ราคา 35 ยูโร"
          },
          "tokens": [
            "kostet",
            "Euro.",
            "Sie",
            "35"
          ]
        },
        {
          "id": "L04-COMM-01-AUDIO-learn-v1",
          "kind": "digits",
          "prompt": "ฟังแล้วใส่ราคาเป็นยูโร",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l04/l04-comm-01-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio"
          ],
          "unit": {
            "id": "L04-COMM-01-AUDIO-learn-v1-response",
            "targetId": "L04-COMM-01-AUDIO-learn-v1-target",
            "subskill": "price_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "42",
            "meaning": "ราคา 42 ยูโร"
          },
          "label": "ราคา (ยูโร)",
          "maxLength": 4
        }
      ]
    },
    {
      "id": "L04-COMM-02",
      "objective": "L04-COMM-02",
      "title": "ชอบแบบไหน",
      "modelVisual": {
        "kind": "board",
        "theme": "object",
        "title": "ขนาดตู้และห้อง",
        "rows": [
          [
            "ความกว้างของตู้",
            "140 cm"
          ],
          [
            "พื้นที่ว่างในห้อง",
            "90 cm"
          ]
        ]
      },
      "note": [
        "zu groß / zu klein บอกว่าใหญ่หรือเล็กเกินไป",
        "sehr / wirklich เพิ่มระดับความเห็น"
      ],
      "audio": "/audio/l04/model-l04-comm-02.m4a",
      "models": [
        {
          "question": "Der Schrank ist schön, oder?",
          "reply": "Nein, er ist zu groß.",
          "questionMeaning": "ตู้นี้สวยใช่ไหม",
          "replyMeaning": "ไม่ มันใหญ่เกินไป",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ขนาดตู้และห้อง",
            "rows": [
              [
                "ความกว้างของตู้",
                "140 cm"
              ],
              [
                "พื้นที่ว่างในห้อง",
                "90 cm"
              ]
            ]
          }
        },
        {
          "question": "Wie findest du das Bett?",
          "reply": "Ich finde es wirklich schön. Es ist sehr modern.",
          "questionMeaning": "เธอคิดว่าเตียงนี้เป็นอย่างไร",
          "replyMeaning": "ฉันคิดว่ามันสวยจริง ๆ และทันสมัยมาก",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ความเห็นของ B",
            "rows": [
              [
                "เตียงนี้",
                "ชอบมาก"
              ],
              [
                "รูปแบบ",
                "ทันสมัย"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L04-COMM-02-D01-learn-v1",
          "kind": "choice",
          "prompt": "Der Schrank ist schön, oder?",
          "promptMeaning": "ตู้นี้สวยใช่ไหม",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ขนาดตู้และห้อง",
            "rows": [
              [
                "ความกว้างของตู้",
                "140 cm"
              ],
              [
                "พื้นที่ว่างในห้อง",
                "90 cm"
              ]
            ]
          },
          "audio": null,
          "explanation": "ตู้กว้างกว่าพื้นที่ว่าง จึงใหญ่เกินไปสำหรับห้องนี้",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L04-COMM-02-D01-learn-v1-response",
            "targetId": "L04-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, er ist zu groß.",
            "meaning": "ไม่ มันใหญ่เกินไป"
          },
          "options": [
            "Nein, er ist zu klein.",
            "Ja, er ist genau richtig.",
            "Nein, er ist zu groß."
          ]
        },
        {
          "id": "L04-COMM-02-D02-learn-v1",
          "kind": "order",
          "prompt": "Wie findest du das Bett?",
          "promptMeaning": "เธอคิดว่าเตียงนี้เป็นอย่างไร",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ความเห็นของ B",
            "rows": [
              [
                "เตียงนี้",
                "ชอบมาก"
              ],
              [
                "รูปแบบ",
                "ทันสมัย"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ wirklich schön และ sehr modern ให้ตรงความเห็นที่กำหนด",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L04-COMM-02-D02-learn-v1-response",
            "targetId": "L04-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich finde es wirklich schön. Es ist sehr modern.",
            "meaning": "ฉันคิดว่ามันสวยจริง ๆ และทันสมัยมาก"
          },
          "tokens": [
            "finde",
            "wirklich",
            "Es",
            "sehr",
            "Ich",
            "es",
            "schön.",
            "ist",
            "modern."
          ]
        }
      ]
    },
    {
      "id": "L04-COMM-03",
      "objective": "L04-COMM-03",
      "title": "เห็นด้วยไหม",
      "modelVisual": {
        "kind": "board",
        "theme": "object",
        "title": "ความเห็นของ B",
        "rows": [
          [
            "โซฟานี้",
            "สวย"
          ],
          [
            "ต้องการตอบ",
            "เห็นด้วยกับ A"
          ]
        ]
      },
      "note": [
        "Das finde ich auch. ใช้เห็นด้วย",
        "Das finde ich nicht. ใช้ไม่เห็นด้วย ส่วน Findest du? ใช้ถามความเห็นกลับ"
      ],
      "audio": "/audio/l04/model-l04-comm-03.m4a",
      "models": [
        {
          "question": "Das Sofa ist schön.",
          "reply": "Das finde ich auch.",
          "questionMeaning": "โซฟานี้สวย",
          "replyMeaning": "ฉันก็คิดอย่างนั้น",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ความเห็นของ B",
            "rows": [
              [
                "โซฟานี้",
                "สวย"
              ],
              [
                "ต้องการตอบ",
                "เห็นด้วยกับ A"
              ]
            ]
          }
        },
        {
          "question": "Der Schrank ist praktisch.",
          "reply": "Das finde ich nicht. Er ist zu klein.",
          "questionMeaning": "ตู้นี้ใช้สะดวก",
          "replyMeaning": "ฉันไม่คิดอย่างนั้น มันเล็กเกินไป",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ความเห็นของ B",
            "rows": [
              [
                "ตู้",
                "เล็กเกินไปสำหรับใช้งาน"
              ],
              [
                "ต้องการตอบ",
                "ไม่เห็นด้วยกับ A"
              ]
            ]
          }
        },
        {
          "question": "Das Bild ist schön.",
          "reply": "Findest du?",
          "questionMeaning": "ภาพนี้สวย",
          "replyMeaning": "เธอคิดอย่างนั้นเหรอ",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "เพื่อนชมภาพ",
            "rows": [
              [
                "ต้องการตอบ",
                "ถามกลับด้วยความสนใจ"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L04-COMM-03-D01-learn-v1",
          "kind": "choice",
          "prompt": "Das Sofa ist schön.",
          "promptMeaning": "โซฟานี้สวย",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ความเห็นของ B",
            "rows": [
              [
                "โซฟานี้",
                "สวย"
              ],
              [
                "ต้องการตอบ",
                "เห็นด้วยกับ A"
              ]
            ]
          },
          "audio": null,
          "explanation": "ต้องการเห็นด้วยจึงใช้ Das finde ich auch.",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L04-COMM-03-D01-learn-v1-response",
            "targetId": "L04-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Das finde ich auch.",
            "meaning": "ฉันก็คิดอย่างนั้น"
          },
          "options": [
            "Das finde ich auch.",
            "Das finde ich nicht.",
            "Nein, er ist zu klein."
          ]
        },
        {
          "id": "L04-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "Der Schrank ist praktisch.",
          "promptMeaning": "ตู้นี้ใช้สะดวก",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ความเห็นของ B",
            "rows": [
              [
                "ตู้",
                "เล็กเกินไปสำหรับใช้งาน"
              ],
              [
                "ต้องการตอบ",
                "ไม่เห็นด้วยกับ A"
              ]
            ]
          },
          "audio": null,
          "explanation": "ต้องการไม่เห็นด้วยและบอกเหตุผลว่าตู้เล็กเกินไป",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L04-COMM-03-D02-learn-v1-response",
            "targetId": "L04-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Das finde ich nicht. Er ist zu klein.",
            "meaning": "ฉันไม่คิดอย่างนั้น มันเล็กเกินไป"
          },
          "options": [
            "Das finde ich auch.",
            "Das finde ich nicht. Er ist zu klein.",
            "Er ist sehr groß."
          ]
        },
        {
          "id": "L04-COMM-03-D03-learn-v1",
          "kind": "choice",
          "prompt": "Das Bild ist schön.",
          "promptMeaning": "ภาพนี้สวย",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "เพื่อนชมภาพ",
            "rows": [
              [
                "ต้องการตอบ",
                "ถามกลับด้วยความสนใจ"
              ]
            ]
          },
          "audio": null,
          "explanation": "โจทย์ให้ถามความเห็นกลับ จึงใช้ Findest du?",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L04-COMM-03-D03-learn-v1-response",
            "targetId": "L04-COMM-03-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Findest du?",
            "meaning": "เธอคิดอย่างนั้นเหรอ"
          },
          "options": [
            "Das finde ich auch.",
            "Das finde ich nicht.",
            "Findest du?"
          ]
        }
      ]
    }
  ],
  "L05": [
    {
      "id": "L05-COMM-01",
      "objective": "L05-COMM-01",
      "title": "เรียกเป็นภาษาเยอรมันว่าอะไร",
      "modelVisual": {
        "kind": "image",
        "src": "/images/phrase-contexts/umbrella.svg",
        "alt": "ร่มกางอยู่",
        "caption": ""
      },
      "note": [
        "ถามคำเรียกด้วย Wie heißt das auf Deutsch?",
        "ขอให้สะกดด้วย Wie schreibt man …?"
      ],
      "audio": "/audio/l05/model-l05-comm-01.m4a",
      "models": [
        {
          "question": "Entschuldigung, wie heißt das auf Deutsch?",
          "reply": "Das ist ein Schirm.",
          "questionMeaning": "ขอโทษนะ สิ่งนี้เรียกว่าอะไรในภาษาเยอรมัน",
          "replyMeaning": "นี่คือร่ม",
          "visual": {
            "kind": "image",
            "src": "/images/phrase-contexts/umbrella.svg",
            "alt": "ร่มกางอยู่",
            "caption": ""
          }
        },
        {
          "question": "Wie schreibt man Schirm?",
          "reply": "S-C-H-I-R-M.",
          "questionMeaning": "คำว่า Schirm สะกดอย่างไร",
          "replyMeaning": "เอส เซ ฮา อี แอร์ เอ็ม",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ฝึกสะกดคำ",
            "rows": [
              [
                "คำที่ถาม",
                "der Schirm"
              ]
            ]
          }
        },
        {
          "question": "Wie heißt das auf Deutsch?",
          "reply": "Ich weiß nicht.",
          "questionMeaning": "สิ่งนี้เรียกว่าอะไรในภาษาเยอรมัน",
          "replyMeaning": "ฉันไม่รู้",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "สิ่งของที่ไม่คุ้นเคย",
            "rows": [
              [
                "ผู้ตอบ B",
                "ไม่รู้คำเรียกภาษาเยอรมัน"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L05-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Entschuldigung, wie heißt das auf Deutsch?",
          "promptMeaning": "ขอโทษนะ สิ่งนี้เรียกว่าอะไรในภาษาเยอรมัน",
          "visual": {
            "kind": "image",
            "src": "/images/phrase-contexts/umbrella.svg",
            "alt": "ร่มกางอยู่",
            "caption": ""
          },
          "audio": null,
          "explanation": "สิ่งที่กางกันฝนคือร่ม ใช้ ein Schirm ในประโยคนี้",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L05-COMM-01-D01-learn-v1-response",
            "targetId": "L05-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Das ist ein Schirm.",
            "meaning": "นี่คือร่ม"
          },
          "options": [
            "Das ist eine Tasche.",
            "Das ist eine Flasche.",
            "Das ist ein Schirm."
          ]
        },
        {
          "id": "L05-COMM-01-D03-learn-v1",
          "kind": "choice",
          "prompt": "Wie heißt das auf Deutsch?",
          "promptMeaning": "สิ่งนี้เรียกว่าอะไรในภาษาเยอรมัน",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "สิ่งของที่ไม่คุ้นเคย",
            "rows": [
              [
                "ผู้ตอบ B",
                "ไม่รู้คำเรียกภาษาเยอรมัน"
              ]
            ]
          },
          "audio": null,
          "explanation": "ผู้ตอบไม่รู้คำศัพท์จึงตอบ Ich weiß nicht.",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L05-COMM-01-D03-learn-v1-response",
            "targetId": "L05-COMM-01-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich weiß nicht.",
            "meaning": "ฉันไม่รู้"
          },
          "options": [
            "Das ist ein Schirm.",
            "Ich weiß nicht.",
            "Danke schön."
          ]
        },
        {
          "id": "L05-COMM-01-SPELLING-learn-v1",
          "kind": "text",
          "prompt": "ฟังแล้วพิมพ์คำที่สะกด",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l05/l05-comm-01-spelling-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "supplied-noun-article"
          ],
          "unit": {
            "id": "L05-COMM-01-SPELLING-learn-v1-response",
            "targetId": "L05-COMM-01-SPELLING-learn-v1-target",
            "subskill": "word_spelling_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "Schirm",
            "meaning": "ร่ม",
            "nounLabel": "der Schirm"
          },
          "label": "คำที่สะกด",
          "maxLength": 30
        }
      ]
    },
    {
      "id": "L05-COMM-02",
      "objective": "L05-COMM-02",
      "title": "สีและวัสดุ",
      "modelVisual": {
        "kind": "board",
        "theme": "object",
        "title": "คุณสมบัติสิ่งของ",
        "rows": [
          [
            "วัสดุ",
            "แก้ว"
          ],
          [
            "สี",
            "เขียว"
          ]
        ]
      },
      "note": [
        "ใช้ aus บอกวัสดุ",
        "ใช้ ist ตามด้วยคำบอกสี เมื่อทายคุณสมบัติของสิ่งของ"
      ],
      "audio": "/audio/l05/model-l05-comm-02.m4a",
      "models": [
        {
          "question": "Ist es aus Plastik?",
          "reply": "Nein, es ist aus Glas.",
          "questionMeaning": "มันทำจากพลาสติกใช่ไหม",
          "replyMeaning": "ไม่ มันทำจากแก้ว",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "คุณสมบัติสิ่งของ",
            "rows": [
              [
                "วัสดุ",
                "แก้ว"
              ],
              [
                "สี",
                "เขียว"
              ]
            ]
          }
        },
        {
          "question": "Ist es blau?",
          "reply": "Nein, es ist grün.",
          "questionMeaning": "มันเป็นสีฟ้าใช่ไหม",
          "replyMeaning": "ไม่ มันเป็นสีเขียว",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "คุณสมบัติสิ่งของ",
            "rows": [
              [
                "สี",
                "เขียว"
              ],
              [
                "วัสดุ",
                "แก้ว"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L05-COMM-02-D01-learn-v1",
          "kind": "choice",
          "prompt": "Ist es aus Plastik?",
          "promptMeaning": "มันทำจากพลาสติกใช่ไหม",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "คุณสมบัติสิ่งของ",
            "rows": [
              [
                "วัสดุ",
                "แก้ว"
              ],
              [
                "สี",
                "เขียว"
              ]
            ]
          },
          "audio": null,
          "explanation": "วัสดุเป็นแก้ว จึงใช้ aus Glas แทน Plastik",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L05-COMM-02-D01-learn-v1-response",
            "targetId": "L05-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, es ist aus Glas.",
            "meaning": "ไม่ มันทำจากแก้ว"
          },
          "options": [
            "Nein, es ist aus Glas.",
            "Ja, es ist aus Plastik.",
            "Nein, es ist aus Holz."
          ]
        },
        {
          "id": "L05-COMM-02-D02-learn-v1",
          "kind": "choice",
          "prompt": "Ist es blau?",
          "promptMeaning": "มันเป็นสีฟ้าใช่ไหม",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "คุณสมบัติสิ่งของ",
            "rows": [
              [
                "สี",
                "เขียว"
              ],
              [
                "วัสดุ",
                "แก้ว"
              ]
            ]
          },
          "audio": null,
          "explanation": "สีที่ให้คือเขียว จึงแก้จาก blau เป็น grün",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L05-COMM-02-D02-learn-v1-response",
            "targetId": "L05-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, es ist grün.",
            "meaning": "ไม่ มันเป็นสีเขียว"
          },
          "options": [
            "Ja, es ist blau.",
            "Nein, es ist grün.",
            "Nein, es ist rot."
          ]
        }
      ]
    },
    {
      "id": "L05-COMM-03",
      "objective": "L05-COMM-03",
      "title": "ฟังไม่ชัดและขอบคุณ",
      "modelVisual": {
        "kind": "board",
        "theme": "phone",
        "title": "ฟังคำศัพท์ไม่ชัด",
        "rows": [
          [
            "ต้องการ",
            "ขอให้พูดอีกครั้ง"
          ]
        ]
      },
      "note": [
        "Noch einmal, bitte. ใช้ขอให้พูดอีกครั้ง",
        "Danke schön. ใช้ขอบคุณ และ Bitte, sehr gern. ใช้ตอบรับ"
      ],
      "audio": "/audio/l05/model-l05-comm-03.m4a",
      "models": [
        {
          "question": "Das ist ein Schirm.",
          "reply": "Noch einmal, bitte.",
          "questionMeaning": "นี่คือร่ม",
          "replyMeaning": "ขออีกครั้งได้ไหม",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ฟังคำศัพท์ไม่ชัด",
            "rows": [
              [
                "ต้องการ",
                "ขอให้พูดอีกครั้ง"
              ]
            ]
          }
        },
        {
          "question": "S-C-H-I-R-M.",
          "reply": "Danke schön.",
          "questionMeaning": "เอส เซ ฮา อี แอร์ เอ็ม",
          "replyMeaning": "ขอบคุณมาก",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "อีกคนช่วยสะกดให้แล้ว",
            "rows": [
              [
                "ต้องการ",
                "ขอบคุณ"
              ]
            ]
          }
        },
        {
          "question": "Danke schön.",
          "reply": "Bitte, sehr gern.",
          "questionMeaning": "ขอบคุณมาก",
          "replyMeaning": "ยินดีเลย",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ได้รับคำขอบคุณ",
            "rows": [
              [
                "ต้องการ",
                "ตอบรับอย่างเป็นกันเอง"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L05-COMM-03-D01-learn-v1",
          "kind": "choice",
          "prompt": "Das ist ein Schirm.",
          "promptMeaning": "นี่คือร่ม",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ฟังคำศัพท์ไม่ชัด",
            "rows": [
              [
                "ต้องการ",
                "ขอให้พูดอีกครั้ง"
              ]
            ]
          },
          "audio": null,
          "explanation": "ฟังไม่ชัดจึงขอให้พูดซ้ำด้วย Noch einmal, bitte.",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L05-COMM-03-D01-learn-v1-response",
            "targetId": "L05-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Noch einmal, bitte.",
            "meaning": "ขออีกครั้งได้ไหม"
          },
          "options": [
            "Bitte, sehr gern.",
            "Noch einmal, bitte.",
            "Danke schön."
          ]
        },
        {
          "id": "L05-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "S-C-H-I-R-M.",
          "promptMeaning": "เอส เซ ฮา อี แอร์ เอ็ม",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "อีกคนช่วยสะกดให้แล้ว",
            "rows": [
              [
                "ต้องการ",
                "ขอบคุณ"
              ]
            ]
          },
          "audio": null,
          "explanation": "อีกคนช่วยแล้วจึงขอบคุณด้วย Danke schön.",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L05-COMM-03-D02-learn-v1-response",
            "targetId": "L05-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Danke schön.",
            "meaning": "ขอบคุณมาก"
          },
          "options": [
            "Noch einmal, bitte.",
            "Ich weiß nicht.",
            "Danke schön."
          ]
        },
        {
          "id": "L05-COMM-03-D03-learn-v1",
          "kind": "choice",
          "prompt": "Danke schön.",
          "promptMeaning": "ขอบคุณมาก",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ได้รับคำขอบคุณ",
            "rows": [
              [
                "ต้องการ",
                "ตอบรับอย่างเป็นกันเอง"
              ]
            ]
          },
          "audio": null,
          "explanation": "ผู้ถามขอบคุณ ผู้ตอบจึงรับด้วย Bitte, sehr gern.",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L05-COMM-03-D03-learn-v1-response",
            "targetId": "L05-COMM-03-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Bitte, sehr gern.",
            "meaning": "ยินดีเลย"
          },
          "options": [
            "Bitte, sehr gern.",
            "Noch einmal, bitte.",
            "Ich weiß nicht."
          ]
        }
      ]
    },
    {
      "id": "L05-COMM-04",
      "objective": "L05-COMM-04",
      "title": "บอกอีเมล",
      "modelVisual": {
        "kind": "board",
        "theme": "phone",
        "title": "ข้อมูลติดต่อสมมติ",
        "rows": [
          [
            "อีเมล",
            "mali_87@example.com"
          ]
        ]
      },
      "note": [
        "แยกเครื่องหมาย @ จุด และขีดล่างเมื่อบอกอีเมล",
        "ข้อมูลในกิจกรรมเป็นข้อมูลสมมติ"
      ],
      "audio": "/audio/l05/model-l05-comm-04.m4a",
      "models": [
        {
          "question": "Wie ist deine E-Mail-Adresse?",
          "reply": "M-A-L-I Unterstrich 87 at example Punkt com.",
          "questionMeaning": "อีเมลของเธอคืออะไร",
          "replyMeaning": "เอ็ม เอ แอล ไอ ขีดล่าง 87 แอต example จุด com",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ข้อมูลติดต่อสมมติ",
            "rows": [
              [
                "อีเมล",
                "mali_87@example.com"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L05-COMM-04-AUDIO-learn-v1",
          "kind": "text",
          "prompt": "ฟังแล้วใส่อีเมล",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l05/l05-comm-04-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio"
          ],
          "unit": {
            "id": "L05-COMM-04-AUDIO-learn-v1-response",
            "targetId": "L05-COMM-04-AUDIO-learn-v1-target",
            "subskill": "email_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "nora_42@example.com",
            "meaning": "อีเมล nora_42@example.com"
          },
          "label": "อีเมล",
          "maxLength": 80
        }
      ]
    }
  ],
  "L06": [
    {
      "id": "L06-COMM-01",
      "objective": "L06-COMM-01",
      "title": "รับสายและขอสาย",
      "modelVisual": {
        "kind": "board",
        "theme": "phone",
        "title": "สายเข้า",
        "rows": [
          [
            "บริษัท",
            "Nord"
          ],
          [
            "ผู้รับสาย B",
            "Anna Weber"
          ]
        ]
      },
      "note": [
        "รับสายด้วยชื่อบริษัทและชื่อผู้รับสาย",
        "ผู้โทรแนะนำตัวก่อนขอสายคนที่ต้องการ"
      ],
      "audio": "/audio/l06/model-l06-comm-01.m4a",
      "models": [
        {
          "question": "Guten Tag.",
          "reply": "Firma Nord, guten Tag. Hier ist Anna Weber.",
          "questionMeaning": "สวัสดี",
          "replyMeaning": "บริษัทนอร์ด สวัสดีค่ะ อันนา เวเบอร์รับสายค่ะ",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "สายเข้า",
            "rows": [
              [
                "บริษัท",
                "Nord"
              ],
              [
                "ผู้รับสาย B",
                "Anna Weber"
              ]
            ]
          }
        },
        {
          "question": "Firma Nord, Anna Weber, guten Tag.",
          "reply": "Guten Tag, Paul Klein hier. Ist Frau Meier da?",
          "questionMeaning": "บริษัทนอร์ด อันนา เวเบอร์รับสาย สวัสดีค่ะ",
          "replyMeaning": "สวัสดีครับ พอล ไคลน์พูดครับ คุณไมเออร์อยู่ไหมครับ",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "โทรออก",
            "rows": [
              [
                "ผู้โทร B",
                "Paul Klein"
              ],
              [
                "ต้องการคุยกับ",
                "Frau Meier"
              ]
            ]
          }
        },
        {
          "question": "Guten Tag, Paul Klein hier.",
          "reply": "Guten Tag, Herr Klein. Was kann ich für Sie tun?",
          "questionMeaning": "สวัสดีครับ พอล ไคลน์พูดครับ",
          "replyMeaning": "สวัสดีค่ะ คุณไคลน์ มีอะไรให้ช่วยคะ",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "รับสายลูกค้า",
            "rows": [
              [
                "ผู้โทร A",
                "Paul Klein"
              ],
              [
                "ขั้นต่อไปของ B",
                "ถามว่าต้องการให้ช่วยอะไร"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L06-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Guten Tag.",
          "promptMeaning": "สวัสดี",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "สายเข้า",
            "rows": [
              [
                "บริษัท",
                "Nord"
              ],
              [
                "ผู้รับสาย B",
                "Anna Weber"
              ]
            ]
          },
          "audio": null,
          "explanation": "กำลังรับสายบริษัท จึงบอกชื่อบริษัทและผู้รับสาย",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L06-COMM-01-D01-learn-v1-response",
            "targetId": "L06-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Firma Nord, guten Tag. Hier ist Anna Weber.",
            "meaning": "บริษัทนอร์ด สวัสดีค่ะ อันนา เวเบอร์รับสายค่ะ"
          },
          "options": [
            "Firma Nord, guten Tag. Hier ist Anna Weber.",
            "Auf Wiederhören.",
            "Einen Moment bitte."
          ]
        },
        {
          "id": "L06-COMM-01-D02-learn-v1",
          "kind": "order",
          "prompt": "Firma Nord, Anna Weber, guten Tag.",
          "promptMeaning": "บริษัทนอร์ด อันนา เวเบอร์รับสาย สวัสดีค่ะ",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "โทรออก",
            "rows": [
              [
                "ผู้โทร B",
                "Paul Klein"
              ],
              [
                "ต้องการคุยกับ",
                "Frau Meier"
              ]
            ]
          },
          "audio": null,
          "explanation": "ผู้โทรแนะนำตัวแล้วถามว่าคนที่ต้องการคุยอยู่ไหม",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L06-COMM-01-D02-learn-v1-response",
            "targetId": "L06-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Guten Tag, Paul Klein hier. Ist Frau Meier da?",
            "meaning": "สวัสดีครับ พอล ไคลน์พูดครับ คุณไมเออร์อยู่ไหมครับ"
          },
          "tokens": [
            "Tag,",
            "Klein",
            "Ist",
            "Meier",
            "Guten",
            "Paul",
            "hier.",
            "Frau",
            "da?"
          ]
        },
        {
          "id": "L06-COMM-01-D03-learn-v1",
          "kind": "choice",
          "prompt": "Guten Tag, Paul Klein hier.",
          "promptMeaning": "สวัสดีครับ พอล ไคลน์พูดครับ",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "รับสายลูกค้า",
            "rows": [
              [
                "ผู้โทร A",
                "Paul Klein"
              ],
              [
                "ขั้นต่อไปของ B",
                "ถามว่าต้องการให้ช่วยอะไร"
              ]
            ]
          },
          "audio": null,
          "explanation": "ฟังชื่อผู้โทรแล้วจึงถามว่ามีอะไรให้ช่วย",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L06-COMM-01-D03-learn-v1-response",
            "targetId": "L06-COMM-01-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Guten Tag, Herr Klein. Was kann ich für Sie tun?",
            "meaning": "สวัสดีค่ะ คุณไคลน์ มีอะไรให้ช่วยคะ"
          },
          "options": [
            "Auf Wiederhören.",
            "Vielen Dank.",
            "Guten Tag, Herr Klein. Was kann ich für Sie tun?"
          ]
        }
      ]
    },
    {
      "id": "L06-COMM-02",
      "objective": "L06-COMM-02",
      "title": "ให้รอและจบสาย",
      "modelVisual": {
        "kind": "board",
        "theme": "phone",
        "title": "กำลังต่อสาย",
        "rows": [
          [
            "ผู้โทรขอสาย",
            "Frau Meier"
          ],
          [
            "การดำเนินการ",
            "ขอให้รอระหว่างตรวจสอบ"
          ]
        ]
      },
      "note": [
        "Einen Moment bitte. ขอให้รอสักครู่",
        "ใช้ Auf Wiederhören. ลาทางโทรศัพท์"
      ],
      "audio": "/audio/l06/model-l06-comm-02.m4a",
      "models": [
        {
          "question": "Ist Frau Meier da?",
          "reply": "Einen Moment bitte.",
          "questionMeaning": "คุณไมเออร์อยู่ไหม",
          "replyMeaning": "กรุณารอสักครู่",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "กำลังต่อสาย",
            "rows": [
              [
                "ผู้โทรขอสาย",
                "Frau Meier"
              ],
              [
                "การดำเนินการ",
                "ขอให้รอระหว่างตรวจสอบ"
              ]
            ]
          }
        },
        {
          "question": "Ist Frau Meier da?",
          "reply": "Frau Meier ist leider nicht da.",
          "questionMeaning": "คุณไมเออร์อยู่ไหม",
          "replyMeaning": "น่าเสียดาย คุณไมเออร์ไม่อยู่",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ผลการตรวจสอบ",
            "rows": [
              [
                "Frau Meier",
                "ไม่อยู่"
              ]
            ]
          }
        },
        {
          "question": "Frau Meier ist leider nicht da.",
          "reply": "Vielen Dank. Auf Wiederhören.",
          "questionMeaning": "น่าเสียดาย คุณไมเออร์ไม่อยู่",
          "replyMeaning": "ขอบคุณมาก สวัสดีครับ",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ขอสายแล้วแต่ไม่อยู่",
            "rows": [
              [
                "B ต้องการ",
                "ขอบคุณและจบสาย"
              ]
            ]
          }
        },
        {
          "question": "Vielen Dank. Auf Wiederhören.",
          "reply": "Sehr gern. Auf Wiederhören, Herr Klein.",
          "questionMeaning": "ขอบคุณมาก สวัสดีครับ",
          "replyMeaning": "ยินดีค่ะ สวัสดีค่ะ คุณไคลน์",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ก่อนวางสาย",
            "rows": [
              [
                "ผู้โทร A",
                "Paul Klein"
              ],
              [
                "ผู้รับสาย B",
                "ตอบรับคำขอบคุณและบอกลา"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L06-COMM-02-D01-learn-v1",
          "kind": "choice",
          "prompt": "Ist Frau Meier da?",
          "promptMeaning": "คุณไมเออร์อยู่ไหม",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "กำลังต่อสาย",
            "rows": [
              [
                "ผู้โทรขอสาย",
                "Frau Meier"
              ],
              [
                "การดำเนินการ",
                "ขอให้รอระหว่างตรวจสอบ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ยังต้องตรวจสอบก่อน จึงขอให้รอสักครู่ ไม่แจ้งว่าไม่อยู่ทันที",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L06-COMM-02-D01-learn-v1-response",
            "targetId": "L06-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Einen Moment bitte.",
            "meaning": "กรุณารอสักครู่"
          },
          "options": [
            "Frau Meier ist leider nicht da.",
            "Einen Moment bitte.",
            "Vielen Dank. Auf Wiederhören."
          ]
        },
        {
          "id": "L06-COMM-02-D02-learn-v1",
          "kind": "choice",
          "prompt": "Ist Frau Meier da?",
          "promptMeaning": "คุณไมเออร์อยู่ไหม",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ผลการตรวจสอบ",
            "rows": [
              [
                "Frau Meier",
                "ไม่อยู่"
              ]
            ]
          },
          "audio": null,
          "explanation": "ตรวจแล้วว่าไม่อยู่ จึงแจ้ง leider nicht da",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L06-COMM-02-D02-learn-v1-response",
            "targetId": "L06-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Frau Meier ist leider nicht da.",
            "meaning": "น่าเสียดาย คุณไมเออร์ไม่อยู่"
          },
          "options": [
            "Ja, Frau Meier ist da.",
            "Guten Morgen, Frau Meier.",
            "Frau Meier ist leider nicht da."
          ]
        },
        {
          "id": "L06-COMM-02-D03-learn-v1",
          "kind": "order",
          "prompt": "Frau Meier ist leider nicht da.",
          "promptMeaning": "น่าเสียดาย คุณไมเออร์ไม่อยู่",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ขอสายแล้วแต่ไม่อยู่",
            "rows": [
              [
                "B ต้องการ",
                "ขอบคุณและจบสาย"
              ]
            ]
          },
          "audio": null,
          "explanation": "ทราบแล้วว่าไม่อยู่ จึงขอบคุณและลาทางโทรศัพท์",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L06-COMM-02-D03-learn-v1-response",
            "targetId": "L06-COMM-02-D03-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Vielen Dank. Auf Wiederhören.",
            "meaning": "ขอบคุณมาก สวัสดีครับ"
          },
          "tokens": [
            "Dank.",
            "Wiederhören.",
            "Vielen",
            "Auf"
          ]
        },
        {
          "id": "L06-COMM-02-D04-learn-v1",
          "kind": "choice",
          "prompt": "Vielen Dank. Auf Wiederhören.",
          "promptMeaning": "ขอบคุณมาก สวัสดีครับ",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ก่อนวางสาย",
            "rows": [
              [
                "ผู้โทร A",
                "Paul Klein"
              ],
              [
                "ผู้รับสาย B",
                "ตอบรับคำขอบคุณและบอกลา"
              ]
            ]
          },
          "audio": null,
          "explanation": "ก่อนจบสายตอบรับคำขอบคุณ แล้วใช้ Auf Wiederhören",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L06-COMM-02-D04-learn-v1-response",
            "targetId": "L06-COMM-02-D04-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Sehr gern. Auf Wiederhören, Herr Klein.",
            "meaning": "ยินดีค่ะ สวัสดีค่ะ คุณไคลน์"
          },
          "options": [
            "Ist Frau Meier da?",
            "Sehr gern. Auf Wiederhören, Herr Klein.",
            "Was kann ich für Sie tun?"
          ]
        },
        {
          "id": "L06-COMM-02-AUDIO-learn-v1",
          "kind": "choice",
          "prompt": "ฟังแล้วเลือกสถานะคนที่ขอสาย",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l06/l06-comm-02-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "reply-options"
          ],
          "unit": {
            "id": "L06-COMM-02-AUDIO-learn-v1-response",
            "targetId": "L06-COMM-02-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "Frau Meier ist nicht da.",
            "meaning": "คุณไมเออร์ไม่อยู่"
          },
          "options": [
            "Frau Meier ist da.",
            "Frau Meier ist nicht da.",
            "Frau Meier spricht gerade."
          ]
        }
      ]
    },
    {
      "id": "L06-COMM-03",
      "objective": "L06-COMM-03",
      "title": "ขอของใช้ในสำนักงาน",
      "modelVisual": {
        "kind": "board",
        "theme": "object",
        "title": "ของที่ B ต้องการ",
        "rows": [
          [
            "ของใช้",
            "ปากกา"
          ]
        ]
      },
      "note": [
        "Was brauchst du? ถามว่าต้องการอะไร",
        "บอกว่าไม่มีด้วย keinen กับ Stift ในประโยคนี้"
      ],
      "audio": "/audio/l06/model-l06-comm-03.m4a",
      "models": [
        {
          "question": "Was brauchst du?",
          "reply": "Ich brauche einen Stift.",
          "questionMeaning": "เธอต้องการอะไร",
          "replyMeaning": "ฉันต้องการปากกา",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ของที่ B ต้องการ",
            "rows": [
              [
                "ของใช้",
                "ปากกา"
              ]
            ]
          }
        },
        {
          "question": "Hast du einen Stift?",
          "reply": "Nein, ich habe keinen Stift.",
          "questionMeaning": "เธอมีปากกาไหม",
          "replyMeaning": "ไม่ ฉันไม่มีปากกา",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ของใช้ของ B",
            "rows": [
              [
                "ปากกา",
                "ไม่มี"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L06-COMM-03-E01-learn-v1",
          "kind": "choice",
          "prompt": "Was brauchst du?",
          "promptMeaning": "เธอต้องการอะไร",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ของที่ B ต้องการ",
            "rows": [
              [
                "ของใช้",
                "ปากกา"
              ]
            ]
          },
          "audio": null,
          "explanation": "บอกสิ่งที่ต้องการด้วย Ich brauche …",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L06-COMM-03-E01-learn-v1-response",
            "targetId": "L06-COMM-03-E01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich brauche einen Stift.",
            "meaning": "ฉันต้องการปากกา"
          },
          "options": [
            "Ich brauche einen Stift.",
            "Ich brauche einen Computer.",
            "Ich brauche eine Tasche."
          ]
        },
        {
          "id": "L06-COMM-03-E02-learn-v1",
          "kind": "order",
          "prompt": "Hast du einen Stift?",
          "promptMeaning": "เธอมีปากกาไหม",
          "visual": {
            "kind": "board",
            "theme": "object",
            "title": "ของใช้ของ B",
            "rows": [
              [
                "ปากกา",
                "ไม่มี"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ keinen ปฏิเสธคำนาม Stift ในประโยคนี้",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L06-COMM-03-E02-learn-v1-response",
            "targetId": "L06-COMM-03-E02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, ich habe keinen Stift.",
            "meaning": "ไม่ ฉันไม่มีปากกา"
          },
          "tokens": [
            "ich",
            "keinen",
            "Nein,",
            "habe",
            "Stift."
          ]
        }
      ]
    }
  ],
  "L07": [
    {
      "id": "L07-COMM-01",
      "objective": "L07-COMM-01",
      "title": "ทำอะไรได้บ้าง",
      "modelVisual": {
        "kind": "board",
        "theme": "ability",
        "title": "ความสามารถของ B",
        "rows": [
          [
            "ว่ายน้ำ",
            "ทำได้เล็กน้อย"
          ]
        ]
      },
      "note": [
        "บอกระดับความสามารถ ไม่ใช่แค่ทำได้หรือไม่ได้",
        "ich kann … แต่ wir können …"
      ],
      "audio": "/audio/l07/model-l07-comm-01.m4a",
      "models": [
        {
          "question": "Kannst du schwimmen?",
          "reply": "Ja, ein bisschen.",
          "questionMeaning": "เธอว่ายน้ำเป็นไหม",
          "replyMeaning": "เป็นเล็กน้อย",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของ B",
            "rows": [
              [
                "ว่ายน้ำ",
                "ทำได้เล็กน้อย"
              ]
            ]
          }
        },
        {
          "question": "Kannst du gut kochen?",
          "reply": "Nein, ich kann nicht so gut kochen.",
          "questionMeaning": "เธอทำอาหารเก่งไหม",
          "replyMeaning": "ไม่ ฉันทำอาหารไม่ค่อยเก่ง",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของ B",
            "rows": [
              [
                "ทำอาหาร",
                "ทำได้แต่ยังไม่เก่ง"
              ]
            ]
          }
        },
        {
          "question": "Könnt ihr Tennis spielen?",
          "reply": "Ja, wir können Tennis spielen.",
          "questionMeaning": "พวกเธอเล่นเทนนิสเป็นไหม",
          "replyMeaning": "เป็น พวกเราเล่นเทนนิสได้",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของผู้ตอบ",
            "rows": [
              [
                "ผู้ตอบ B",
                "สองคน"
              ],
              [
                "เทนนิส",
                "เล่นได้ทั้งคู่"
              ]
            ]
          }
        },
        {
          "question": "Können Sie reiten?",
          "reply": "Ja, ich kann reiten.",
          "questionMeaning": "คุณขี่ม้าเป็นไหม",
          "replyMeaning": "เป็น ฉันขี่ม้าได้",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของ B",
            "rows": [
              [
                "ขี่ม้า",
                "ทำได้"
              ],
              [
                "ผู้ถาม",
                "ใช้ภาษาสุภาพ"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L07-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Kannst du schwimmen?",
          "promptMeaning": "เธอว่ายน้ำเป็นไหม",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของ B",
            "rows": [
              [
                "ว่ายน้ำ",
                "ทำได้เล็กน้อย"
              ]
            ]
          },
          "audio": null,
          "explanation": "ว่ายน้ำได้เล็กน้อยจึงตอบ ein bisschen ไม่ใช่ sehr gut",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-01-D01-learn-v1-response",
            "targetId": "L07-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ja, ein bisschen.",
            "meaning": "เป็นเล็กน้อย"
          },
          "options": [
            "Ja, sehr gut.",
            "Ja, ein bisschen.",
            "Nein, gar nicht."
          ]
        },
        {
          "id": "L07-COMM-01-D02-learn-v1",
          "kind": "order",
          "prompt": "Kannst du gut kochen?",
          "promptMeaning": "เธอทำอาหารเก่งไหม",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของ B",
            "rows": [
              [
                "ทำอาหาร",
                "ทำได้แต่ยังไม่เก่ง"
              ]
            ]
          },
          "audio": null,
          "explanation": "ทำอาหารได้แต่ยังไม่เก่ง จึงใช้ nicht so gut",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L07-COMM-01-D02-learn-v1-response",
            "targetId": "L07-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, ich kann nicht so gut kochen.",
            "meaning": "ไม่ ฉันทำอาหารไม่ค่อยเก่ง"
          },
          "tokens": [
            "ich",
            "nicht",
            "gut",
            "Nein,",
            "kann",
            "so",
            "kochen."
          ]
        },
        {
          "id": "L07-COMM-01-D03-learn-v1",
          "kind": "order",
          "prompt": "Könnt ihr Tennis spielen?",
          "promptMeaning": "พวกเธอเล่นเทนนิสเป็นไหม",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของผู้ตอบ",
            "rows": [
              [
                "ผู้ตอบ B",
                "สองคน"
              ],
              [
                "เทนนิส",
                "เล่นได้ทั้งคู่"
              ]
            ]
          },
          "audio": null,
          "explanation": "ผู้ตอบเป็นสองคนจึงใช้ wir können",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L07-COMM-01-D03-learn-v1-response",
            "targetId": "L07-COMM-01-D03-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ja, wir können Tennis spielen.",
            "meaning": "เป็น พวกเราเล่นเทนนิสได้"
          },
          "tokens": [
            "wir",
            "Tennis",
            "Ja,",
            "können",
            "spielen."
          ]
        },
        {
          "id": "L07-COMM-01-D04-learn-v1",
          "kind": "choice",
          "prompt": "Können Sie reiten?",
          "promptMeaning": "คุณขี่ม้าเป็นไหม",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "ความสามารถของ B",
            "rows": [
              [
                "ขี่ม้า",
                "ทำได้"
              ],
              [
                "ผู้ถาม",
                "ใช้ภาษาสุภาพ"
              ]
            ]
          },
          "audio": null,
          "explanation": "คำถามสุภาพถามคนเดียว ตอบด้วย ich kann",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-01-D04-learn-v1-response",
            "targetId": "L07-COMM-01-D04-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ja, ich kann reiten.",
            "meaning": "เป็น ฉันขี่ม้าได้"
          },
          "options": [
            "Nein, ich kann nicht reiten.",
            "Ja, ich kann reiten.",
            "Ja, wir können Tennis spielen."
          ]
        },
        {
          "id": "L07-COMM-01-AUDIO-learn-v1",
          "kind": "choice",
          "prompt": "ฟังแล้วเลือกระดับความสามารถ",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l07/l07-comm-01-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-01-AUDIO-learn-v1-response",
            "targetId": "L07-COMM-01-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "Sehr gut.",
            "meaning": "ว่ายน้ำได้ดีมาก"
          },
          "options": [
            "Gar nicht.",
            "Ein bisschen.",
            "Sehr gut."
          ]
        }
      ]
    },
    {
      "id": "L07-COMM-02",
      "objective": "L07-COMM-02",
      "title": "ชมและขอบคุณ",
      "modelVisual": {
        "kind": "board",
        "theme": "ability",
        "title": "หลังแสดงการเต้น",
        "rows": [
          [
            "A",
            "ชม B"
          ],
          [
            "B ต้องการ",
            "ขอบคุณ"
          ]
        ]
      },
      "note": [
        "คำชมเรื่องความสามารถตอบรับด้วยการขอบคุณได้",
        "ไม่ต้องปฏิเสธคำชมถ้าโจทย์ไม่ได้ให้ทำเช่นนั้น"
      ],
      "audio": "/audio/l07/model-l07-comm-02.m4a",
      "models": [
        {
          "question": "Du kannst wirklich toll tanzen!",
          "reply": "Oh, danke!",
          "questionMeaning": "เธอเต้นเก่งจริง ๆ",
          "replyMeaning": "ขอบใจนะ",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "หลังแสดงการเต้น",
            "rows": [
              [
                "A",
                "ชม B"
              ],
              [
                "B ต้องการ",
                "ขอบคุณ"
              ]
            ]
          }
        },
        {
          "question": "Sie können sehr gut malen!",
          "reply": "Herzlichen Dank!",
          "questionMeaning": "คุณวาดภาพเก่งมาก",
          "replyMeaning": "ขอบคุณมาก",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "หลังวาดภาพ",
            "rows": [
              [
                "A",
                "ชม B อย่างสุภาพ"
              ],
              [
                "B ต้องการ",
                "ขอบคุณ"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L07-COMM-02-D01-learn-v1",
          "kind": "choice",
          "prompt": "Du kannst wirklich toll tanzen!",
          "promptMeaning": "เธอเต้นเก่งจริง ๆ",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "หลังแสดงการเต้น",
            "rows": [
              [
                "A",
                "ชม B"
              ],
              [
                "B ต้องการ",
                "ขอบคุณ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ได้รับคำชมและต้องการขอบคุณจึงตอบ Oh, danke!",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-02-D01-learn-v1-response",
            "targetId": "L07-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Oh, danke!",
            "meaning": "ขอบใจนะ"
          },
          "options": [
            "Nein, gar nicht.",
            "Ich spiele manchmal Tennis.",
            "Oh, danke!"
          ]
        },
        {
          "id": "L07-COMM-02-D02-learn-v1",
          "kind": "choice",
          "prompt": "Sie können sehr gut malen!",
          "promptMeaning": "คุณวาดภาพเก่งมาก",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "หลังวาดภาพ",
            "rows": [
              [
                "A",
                "ชม B อย่างสุภาพ"
              ],
              [
                "B ต้องการ",
                "ขอบคุณ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ได้รับคำชมอย่างสุภาพจึงขอบคุณด้วย Herzlichen Dank!",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-02-D02-learn-v1-response",
            "targetId": "L07-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Herzlichen Dank!",
            "meaning": "ขอบคุณมาก"
          },
          "options": [
            "Herzlichen Dank!",
            "Nein, gar nicht.",
            "Ich fahre nie Ski."
          ]
        }
      ]
    },
    {
      "id": "L07-COMM-03",
      "objective": "L07-COMM-03",
      "title": "งานอดิเรก",
      "modelVisual": {
        "kind": "board",
        "theme": "ability",
        "title": "งานอดิเรกของ B",
        "rows": [
          [
            "อย่างที่ 1",
            "ว่ายน้ำ"
          ],
          [
            "อย่างที่ 2",
            "ปั่นจักรยาน"
          ]
        ]
      },
      "note": [
        "บอกงานอดิเรกหรือกิจกรรมที่ชอบในเวลาว่าง",
        "gern ใช้บอกว่าชอบทำสิ่งนั้น"
      ],
      "audio": "/audio/l07/model-l07-comm-03.m4a",
      "models": [
        {
          "question": "Was sind deine Hobbys?",
          "reply": "Meine Hobbys sind Schwimmen und Radfahren.",
          "questionMeaning": "งานอดิเรกของเธอคืออะไร",
          "replyMeaning": "งานอดิเรกของฉันคือว่ายน้ำและปั่นจักรยาน",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "งานอดิเรกของ B",
            "rows": [
              [
                "อย่างที่ 1",
                "ว่ายน้ำ"
              ],
              [
                "อย่างที่ 2",
                "ปั่นจักรยาน"
              ]
            ]
          }
        },
        {
          "question": "Was machst du in deiner Freizeit?",
          "reply": "Ich spiele gern Fußball. Das macht Spaß.",
          "questionMeaning": "เธอทำอะไรในเวลาว่าง",
          "replyMeaning": "ฉันชอบเล่นฟุตบอล มันสนุกดี",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "เวลาว่างของ B",
            "rows": [
              [
                "กิจกรรมที่ชอบ",
                "เล่นฟุตบอล"
              ],
              [
                "ความรู้สึก",
                "สนุก"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L07-COMM-03-D01-learn-v1",
          "kind": "order",
          "prompt": "Was sind deine Hobbys?",
          "promptMeaning": "งานอดิเรกของเธอคืออะไร",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "งานอดิเรกของ B",
            "rows": [
              [
                "อย่างที่ 1",
                "ว่ายน้ำ"
              ],
              [
                "อย่างที่ 2",
                "ปั่นจักรยาน"
              ]
            ]
          },
          "audio": null,
          "explanation": "งานอดิเรกสองอย่างเชื่อมด้วย und",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L07-COMM-03-D01-learn-v1-response",
            "targetId": "L07-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Meine Hobbys sind Schwimmen und Radfahren.",
            "meaning": "งานอดิเรกของฉันคือว่ายน้ำและปั่นจักรยาน"
          },
          "tokens": [
            "Hobbys",
            "Schwimmen",
            "Radfahren.",
            "Meine",
            "sind",
            "und"
          ]
        },
        {
          "id": "L07-COMM-03-D02-learn-v1",
          "kind": "order",
          "prompt": "Was machst du in deiner Freizeit?",
          "promptMeaning": "เธอทำอะไรในเวลาว่าง",
          "visual": {
            "kind": "board",
            "theme": "ability",
            "title": "เวลาว่างของ B",
            "rows": [
              [
                "กิจกรรมที่ชอบ",
                "เล่นฟุตบอล"
              ],
              [
                "ความรู้สึก",
                "สนุก"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ gern บอกว่าชอบเล่น และ Das macht Spaß บอกว่าสนุก",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L07-COMM-03-D02-learn-v1-response",
            "targetId": "L07-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich spiele gern Fußball. Das macht Spaß.",
            "meaning": "ฉันชอบเล่นฟุตบอล มันสนุกดี"
          },
          "tokens": [
            "spiele",
            "Fußball.",
            "macht",
            "Ich",
            "gern",
            "Das",
            "Spaß."
          ]
        }
      ]
    },
    {
      "id": "L07-COMM-04",
      "objective": "L07-COMM-04",
      "title": "ทำบ่อยแค่ไหน",
      "modelVisual": {
        "kind": "board",
        "theme": "calendar",
        "title": "นิสัยของ B",
        "rows": [
          [
            "อ่านหนังสือ",
            "บ่อย"
          ]
        ]
      },
      "note": [
        "immer = เสมอ · oft = บ่อย · manchmal = บางครั้ง · nie = ไม่เคย",
        "เลือกตามความถี่ที่กำหนด ไม่เดาจากภาพกิจกรรม"
      ],
      "audio": "/audio/l07/model-l07-comm-04.m4a",
      "models": [
        {
          "question": "Wie oft liest du?",
          "reply": "Ich lese oft.",
          "questionMeaning": "เธออ่านหนังสือบ่อยแค่ไหน",
          "replyMeaning": "ฉันอ่านบ่อย",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "อ่านหนังสือ",
                "บ่อย"
              ]
            ]
          }
        },
        {
          "question": "Wie oft fährst du Ski?",
          "reply": "Ich fahre nie Ski.",
          "questionMeaning": "เธอเล่นสกีบ่อยแค่ไหน",
          "replyMeaning": "ฉันไม่เคยเล่นสกี",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "เล่นสกี",
                "ไม่เคย"
              ]
            ]
          }
        },
        {
          "question": "Wie oft spielst du Tennis?",
          "reply": "Ich spiele manchmal Tennis.",
          "questionMeaning": "เธอเล่นเทนนิสบ่อยแค่ไหน",
          "replyMeaning": "ฉันเล่นเทนนิสเป็นบางครั้ง",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "เล่นเทนนิส",
                "บางครั้ง"
              ]
            ]
          }
        },
        {
          "question": "Wie oft hörst du in deiner Freizeit Musik?",
          "reply": "Ich höre in meiner Freizeit immer Musik.",
          "questionMeaning": "ในเวลาว่างเธอฟังเพลงบ่อยแค่ไหน",
          "replyMeaning": "ฉันฟังเพลงเสมอในเวลาว่าง",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "ฟังเพลงในเวลาว่าง",
                "เสมอ"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L07-COMM-04-D01-learn-v1",
          "kind": "choice",
          "prompt": "Wie oft liest du?",
          "promptMeaning": "เธออ่านหนังสือบ่อยแค่ไหน",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "อ่านหนังสือ",
                "บ่อย"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลระบุว่าบ่อย จึงใช้ oft",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-04-D01-learn-v1-response",
            "targetId": "L07-COMM-04-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich lese oft.",
            "meaning": "ฉันอ่านบ่อย"
          },
          "options": [
            "Ich lese nie.",
            "Ich lese oft.",
            "Ich lese selten."
          ]
        },
        {
          "id": "L07-COMM-04-D02-learn-v1",
          "kind": "choice",
          "prompt": "Wie oft fährst du Ski?",
          "promptMeaning": "เธอเล่นสกีบ่อยแค่ไหน",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "เล่นสกี",
                "ไม่เคย"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลระบุว่าไม่เคย จึงใช้ nie",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-04-D02-learn-v1-response",
            "targetId": "L07-COMM-04-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich fahre nie Ski.",
            "meaning": "ฉันไม่เคยเล่นสกี"
          },
          "options": [
            "Ich fahre oft Ski.",
            "Ich fahre immer Ski.",
            "Ich fahre nie Ski."
          ]
        },
        {
          "id": "L07-COMM-04-D03-learn-v1",
          "kind": "choice",
          "prompt": "Wie oft spielst du Tennis?",
          "promptMeaning": "เธอเล่นเทนนิสบ่อยแค่ไหน",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "เล่นเทนนิส",
                "บางครั้ง"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลระบุว่าบางครั้ง จึงใช้ manchmal",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-04-D03-learn-v1-response",
            "targetId": "L07-COMM-04-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich spiele manchmal Tennis.",
            "meaning": "ฉันเล่นเทนนิสเป็นบางครั้ง"
          },
          "options": [
            "Ich spiele manchmal Tennis.",
            "Ich spiele nie Tennis.",
            "Ich spiele immer Tennis."
          ]
        },
        {
          "id": "L07-COMM-04-D04-learn-v1",
          "kind": "choice",
          "prompt": "Wie oft hörst du in deiner Freizeit Musik?",
          "promptMeaning": "ในเวลาว่างเธอฟังเพลงบ่อยแค่ไหน",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นิสัยของ B",
            "rows": [
              [
                "ฟังเพลงในเวลาว่าง",
                "เสมอ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลระบุว่าเสมอ จึงใช้ immer",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L07-COMM-04-D04-learn-v1-response",
            "targetId": "L07-COMM-04-D04-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich höre in meiner Freizeit immer Musik.",
            "meaning": "ฉันฟังเพลงเสมอในเวลาว่าง"
          },
          "options": [
            "Ich höre nie Musik.",
            "Ich höre in meiner Freizeit immer Musik.",
            "Ich höre selten Musik."
          ]
        }
      ]
    }
  ],
  "L08": [
    {
      "id": "L08-COMM-01",
      "objective": "L08-COMM-01",
      "title": "ชวนและนัดหมาย",
      "modelVisual": {
        "kind": "board",
        "theme": "calendar",
        "title": "แผนเย็นนี้",
        "rows": [
          [
            "กิจกรรมที่ B อยากเสนอ",
            "ไปโรงหนัง"
          ]
        ]
      },
      "note": [
        "ใช้คำถามเพื่อชวนทำกิจกรรมหรือนัดเวลา",
        "um ตามด้วยเวลาเมื่อนัดหมาย"
      ],
      "audio": "/audio/l08/model-l08-comm-01.m4a",
      "models": [
        {
          "question": "Was machen wir heute Abend?",
          "reply": "Gehen wir ins Kino?",
          "questionMeaning": "เย็นนี้เราทำอะไรกันดี",
          "replyMeaning": "เราไปโรงหนังกันไหม",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "แผนเย็นนี้",
            "rows": [
              [
                "กิจกรรมที่ B อยากเสนอ",
                "ไปโรงหนัง"
              ]
            ]
          }
        },
        {
          "question": "Wann treffen wir uns?",
          "reply": "Um vier Uhr.",
          "questionMeaning": "เราจะเจอกันเมื่อไร",
          "replyMeaning": "ตอนสี่โมงเย็น",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นัดไปโรงหนัง",
            "rows": [
              [
                "เวลาเจอกัน",
                "16:00"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L08-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Was machen wir heute Abend?",
          "promptMeaning": "เย็นนี้เราทำอะไรกันดี",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "แผนเย็นนี้",
            "rows": [
              [
                "กิจกรรมที่ B อยากเสนอ",
                "ไปโรงหนัง"
              ]
            ]
          },
          "audio": null,
          "explanation": "ผู้ตอบต้องการชวนไปโรงหนัง จึงใช้ Gehen wir ins Kino?",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-01-D01-learn-v1-response",
            "targetId": "L08-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Gehen wir ins Kino?",
            "meaning": "เราไปโรงหนังกันไหม"
          },
          "options": [
            "Gehen wir ins Restaurant?",
            "Spielen wir Tennis?",
            "Gehen wir ins Kino?"
          ]
        },
        {
          "id": "L08-COMM-01-D02-learn-v1",
          "kind": "order",
          "prompt": "Wann treffen wir uns?",
          "promptMeaning": "เราจะเจอกันเมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "นัดไปโรงหนัง",
            "rows": [
              [
                "เวลาเจอกัน",
                "16:00"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ um vier Uhr สำหรับเวลานัด 16:00",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L08-COMM-01-D02-learn-v1-response",
            "targetId": "L08-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Um vier Uhr.",
            "meaning": "ตอนสี่โมงเย็น"
          },
          "tokens": [
            "vier",
            "Um",
            "Uhr."
          ]
        },
        {
          "id": "L08-COMM-01-AUDIO-learn-v1",
          "kind": "choice",
          "prompt": "ฟังแล้วเลือกเวลานัด",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l08/l08-comm-01-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-01-AUDIO-learn-v1-response",
            "targetId": "L08-COMM-01-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "17:30",
            "meaning": "เวลานัด 17:30"
          },
          "options": [
            "16:30",
            "17:30",
            "18:30"
          ]
        }
      ]
    },
    {
      "id": "L08-COMM-02",
      "objective": "L08-COMM-02",
      "title": "ว่างไหม ไปได้ไหม",
      "modelVisual": {
        "kind": "board",
        "theme": "calendar",
        "title": "ตารางของ B",
        "rows": [
          [
            "เย็นนี้",
            "ว่าง"
          ],
          [
            "โรงหนัง",
            "อยากไป"
          ]
        ]
      },
      "note": [
        "ตอบรับ ปฏิเสธ หรือยังไม่แน่ใจ ให้ตรงตารางของผู้ตอบ",
        "เมื่อไม่ว่าง สามารถเสนอวันใหม่ได้"
      ],
      "audio": "/audio/l08/model-l08-comm-02.m4a",
      "models": [
        {
          "question": "Gehen wir heute Abend ins Kino?",
          "reply": "Ja, gern. Gute Idee!",
          "questionMeaning": "เย็นนี้เราไปโรงหนังกันไหม",
          "replyMeaning": "ได้เลย เป็นความคิดที่ดี",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "เย็นนี้",
                "ว่าง"
              ],
              [
                "โรงหนัง",
                "อยากไป"
              ]
            ]
          }
        },
        {
          "question": "Hast du heute Abend Zeit?",
          "reply": "Tut mir leid, heute Abend habe ich keine Zeit. Vielleicht morgen?",
          "questionMeaning": "เย็นนี้เธอว่างไหม",
          "replyMeaning": "ขอโทษนะ เย็นนี้ฉันไม่ว่าง พรุ่งนี้ดีไหม",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "เย็นนี้",
                "ไม่ว่าง"
              ],
              [
                "พรุ่งนี้",
                "ว่าง"
              ]
            ]
          }
        },
        {
          "question": "Kannst du am Samstag?",
          "reply": "Das weiß ich noch nicht.",
          "questionMeaning": "วันเสาร์เธอมาได้ไหม",
          "replyMeaning": "ฉันยังไม่รู้เลย",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "วันเสาร์",
                "ยังไม่ทราบว่าจะว่างไหม"
              ]
            ]
          }
        },
        {
          "question": "Treffen wir uns um sieben Uhr?",
          "reply": "Tut mir leid, ich kann leider nicht. Ich arbeite am Abend.",
          "questionMeaning": "เราเจอกันตอนหนึ่งทุ่มไหม",
          "replyMeaning": "ขอโทษนะ ฉันไปไม่ได้ ฉันทำงานตอนเย็น",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "19:00",
                "ต้องทำงาน"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L08-COMM-02-D01-learn-v1",
          "kind": "choice",
          "prompt": "Gehen wir heute Abend ins Kino?",
          "promptMeaning": "เย็นนี้เราไปโรงหนังกันไหม",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "เย็นนี้",
                "ว่าง"
              ],
              [
                "โรงหนัง",
                "อยากไป"
              ]
            ]
          },
          "audio": null,
          "explanation": "ผู้ตอบว่างและเห็นด้วย จึงตอบรับอย่างชัดเจน",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-02-D01-learn-v1-response",
            "targetId": "L08-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ja, gern. Gute Idee!",
            "meaning": "ได้เลย เป็นความคิดที่ดี"
          },
          "options": [
            "Ja, gern. Gute Idee!",
            "Tut mir leid, ich kann nicht.",
            "Das weiß ich noch nicht."
          ]
        },
        {
          "id": "L08-COMM-02-D02-learn-v1",
          "kind": "order",
          "prompt": "Hast du heute Abend Zeit?",
          "promptMeaning": "เย็นนี้เธอว่างไหม",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "เย็นนี้",
                "ไม่ว่าง"
              ],
              [
                "พรุ่งนี้",
                "ว่าง"
              ]
            ]
          },
          "audio": null,
          "explanation": "วันนี้ไม่ว่างแต่พรุ่งนี้ว่าง จึงปฏิเสธวันนี้และเสนอพรุ่งนี้",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L08-COMM-02-D02-learn-v1-response",
            "targetId": "L08-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Tut mir leid, heute Abend habe ich keine Zeit. Vielleicht morgen?",
            "meaning": "ขอโทษนะ เย็นนี้ฉันไม่ว่าง พรุ่งนี้ดีไหม"
          },
          "tokens": [
            "mir",
            "heute",
            "habe",
            "keine",
            "Vielleicht",
            "Tut",
            "leid,",
            "Abend",
            "ich",
            "Zeit.",
            "morgen?"
          ]
        },
        {
          "id": "L08-COMM-02-D03-learn-v1",
          "kind": "choice",
          "prompt": "Kannst du am Samstag?",
          "promptMeaning": "วันเสาร์เธอมาได้ไหม",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "วันเสาร์",
                "ยังไม่ทราบว่าจะว่างไหม"
              ]
            ]
          },
          "audio": null,
          "explanation": "ยังไม่ทราบตาราง จึงไม่ตอบรับหรือปฏิเสธแน่นอน",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-02-D03-learn-v1-response",
            "targetId": "L08-COMM-02-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Das weiß ich noch nicht.",
            "meaning": "ฉันยังไม่รู้เลย"
          },
          "options": [
            "Ja, gern.",
            "Tut mir leid, ich kann nicht.",
            "Das weiß ich noch nicht."
          ]
        },
        {
          "id": "L08-COMM-02-D04-learn-v1",
          "kind": "choice",
          "prompt": "Treffen wir uns um sieben Uhr?",
          "promptMeaning": "เราเจอกันตอนหนึ่งทุ่มไหม",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "ตารางของ B",
            "rows": [
              [
                "19:00",
                "ต้องทำงาน"
              ]
            ]
          },
          "audio": null,
          "explanation": "เวลาเสนอทับกับงาน ผู้ตอบจึงปฏิเสธพร้อมเหตุผล",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-02-D04-learn-v1-response",
            "targetId": "L08-COMM-02-D04-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Tut mir leid, ich kann leider nicht. Ich arbeite am Abend.",
            "meaning": "ขอโทษนะ ฉันไปไม่ได้ ฉันทำงานตอนเย็น"
          },
          "options": [
            "Tut mir leid, ich kann leider nicht. Ich arbeite am Abend.",
            "Ja, ich habe Zeit.",
            "Gute Idee!"
          ]
        }
      ]
    },
    {
      "id": "L08-COMM-03",
      "objective": "L08-COMM-03",
      "title": "ตอนนี้กี่โมง",
      "modelVisual": {
        "kind": "clock",
        "hour": 15,
        "minute": 30
      },
      "note": [
        "halb vier คืออีกครึ่งชั่วโมงจะถึงสี่โมง",
        "nach = หลังเวลา · vor = ก่อนเวลา"
      ],
      "audio": "/audio/l08/model-l08-comm-03.m4a",
      "models": [
        {
          "question": "Wie spät ist es?",
          "reply": "Es ist halb vier.",
          "questionMeaning": "กี่โมงแล้ว",
          "replyMeaning": "บ่ายสามโมงครึ่ง",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 30
          }
        },
        {
          "question": "Wie viel Uhr ist es?",
          "reply": "Es ist Viertel nach drei.",
          "questionMeaning": "กี่โมงแล้ว",
          "replyMeaning": "บ่ายสามโมงสิบห้า",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 15
          }
        },
        {
          "question": "Wie spät ist es?",
          "reply": "Es ist Viertel vor vier.",
          "questionMeaning": "กี่โมงแล้ว",
          "replyMeaning": "บ่ายสามโมงสี่สิบห้า",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 45
          }
        },
        {
          "question": "Wie spät ist es?",
          "reply": "Es ist fünf nach halb vier.",
          "questionMeaning": "กี่โมงแล้ว",
          "replyMeaning": "บ่ายสามโมงสามสิบห้า",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 35
          }
        },
        {
          "question": "Wie spät ist es?",
          "reply": "Es ist fünf vor halb vier.",
          "questionMeaning": "กี่โมงแล้ว",
          "replyMeaning": "บ่ายสามโมงยี่สิบห้า",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 25
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L08-COMM-03-D01-learn-v1",
          "kind": "choice",
          "prompt": "Wie spät ist es?",
          "promptMeaning": "กี่โมงแล้ว",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 30
          },
          "audio": null,
          "explanation": "halb vier คืออีกครึ่งชั่วโมงถึงสี่โมง หรือ 15:30 ในบริบทนี้",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-03-D01-learn-v1-response",
            "targetId": "L08-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Es ist halb vier.",
            "meaning": "บ่ายสามโมงครึ่ง"
          },
          "options": [
            "Es ist halb drei.",
            "Es ist halb vier.",
            "Es ist halb fünf."
          ]
        },
        {
          "id": "L08-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "Wie viel Uhr ist es?",
          "promptMeaning": "กี่โมงแล้ว",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 15
          },
          "audio": null,
          "explanation": "Viertel nach drei คือผ่านสามโมงมา 15 นาที",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-03-D02-learn-v1-response",
            "targetId": "L08-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Es ist Viertel nach drei.",
            "meaning": "บ่ายสามโมงสิบห้า"
          },
          "options": [
            "Es ist Viertel vor drei.",
            "Es ist Viertel nach vier.",
            "Es ist Viertel nach drei."
          ]
        },
        {
          "id": "L08-COMM-03-D03-learn-v1",
          "kind": "choice",
          "prompt": "Wie spät ist es?",
          "promptMeaning": "กี่โมงแล้ว",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 45
          },
          "audio": null,
          "explanation": "Viertel vor vier คืออีก 15 นาทีถึงสี่โมง",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L08-COMM-03-D03-learn-v1-response",
            "targetId": "L08-COMM-03-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Es ist Viertel vor vier.",
            "meaning": "บ่ายสามโมงสี่สิบห้า"
          },
          "options": [
            "Es ist Viertel vor vier.",
            "Es ist Viertel nach vier.",
            "Es ist Viertel vor drei."
          ]
        },
        {
          "id": "L08-COMM-03-D04-learn-v1",
          "kind": "order",
          "prompt": "Wie spät ist es?",
          "promptMeaning": "กี่โมงแล้ว",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 35
          },
          "audio": null,
          "explanation": "fünf nach halb vier คือเลย 15:30 มา 5 นาที",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L08-COMM-03-D04-learn-v1-response",
            "targetId": "L08-COMM-03-D04-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Es ist fünf nach halb vier.",
            "meaning": "บ่ายสามโมงสามสิบห้า"
          },
          "tokens": [
            "ist",
            "nach",
            "vier.",
            "Es",
            "fünf",
            "halb"
          ]
        },
        {
          "id": "L08-COMM-03-D05-learn-v1",
          "kind": "order",
          "prompt": "Wie spät ist es?",
          "promptMeaning": "กี่โมงแล้ว",
          "visual": {
            "kind": "clock",
            "hour": 15,
            "minute": 25
          },
          "audio": null,
          "explanation": "fünf vor halb vier คือก่อน 15:30 อยู่ 5 นาที",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L08-COMM-03-D05-learn-v1-response",
            "targetId": "L08-COMM-03-D05-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Es ist fünf vor halb vier.",
            "meaning": "บ่ายสามโมงยี่สิบห้า"
          },
          "tokens": [
            "ist",
            "vor",
            "vier.",
            "Es",
            "fünf",
            "halb"
          ]
        }
      ]
    }
  ],
  "L09": [
    {
      "id": "L09-COMM-01",
      "objective": "L09-COMM-01",
      "title": "ชอบกินอะไร",
      "modelVisual": {
        "kind": "board",
        "theme": "menu",
        "title": "อาหารเช้าที่ B ชอบ",
        "rows": [
          [
            "อาหาร",
            "ขนมปังกับแยม"
          ]
        ]
      },
      "note": [
        "gern / besonders gern ใช้บอกความชอบ",
        "ข้อมูลความชอบเป็นของผู้ตอบ ไม่ใช่รายการที่ร้านมี"
      ],
      "audio": "/audio/l09/model-l09-comm-01.m4a",
      "models": [
        {
          "question": "Was isst du gern zum Frühstück?",
          "reply": "Zum Frühstück esse ich gern Brot mit Marmelade.",
          "questionMeaning": "เธอชอบกินอะไรเป็นอาหารเช้า",
          "replyMeaning": "อาหารเช้าฉันชอบกินขนมปังกับแยม",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "อาหารเช้าที่ B ชอบ",
            "rows": [
              [
                "อาหาร",
                "ขนมปังกับแยม"
              ]
            ]
          }
        },
        {
          "question": "Was magst du besonders gern?",
          "reply": "Ich mag besonders gern Schokolade.",
          "questionMeaning": "เธอชอบอะไรเป็นพิเศษ",
          "replyMeaning": "ฉันชอบช็อกโกแลตเป็นพิเศษ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "ความชอบของ B",
            "rows": [
              [
                "ชอบเป็นพิเศษ",
                "ช็อกโกแลต"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L09-COMM-01-D01-learn-v1",
          "kind": "order",
          "prompt": "Was isst du gern zum Frühstück?",
          "promptMeaning": "เธอชอบกินอะไรเป็นอาหารเช้า",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "อาหารเช้าที่ B ชอบ",
            "rows": [
              [
                "อาหาร",
                "ขนมปังกับแยม"
              ]
            ]
          },
          "audio": null,
          "explanation": "บอกอาหารที่ชอบตอนเช้าด้วย Zum Frühstück esse ich gern …",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L09-COMM-01-D01-learn-v1-response",
            "targetId": "L09-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Zum Frühstück esse ich gern Brot mit Marmelade.",
            "meaning": "อาหารเช้าฉันชอบกินขนมปังกับแยม"
          },
          "tokens": [
            "Frühstück",
            "ich",
            "Brot",
            "Marmelade.",
            "Zum",
            "esse",
            "gern",
            "mit"
          ]
        },
        {
          "id": "L09-COMM-01-D02-learn-v1",
          "kind": "choice",
          "prompt": "Was magst du besonders gern?",
          "promptMeaning": "เธอชอบอะไรเป็นพิเศษ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "ความชอบของ B",
            "rows": [
              [
                "ชอบเป็นพิเศษ",
                "ช็อกโกแลต"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลระบุว่าชอบช็อกโกแลตเป็นพิเศษ จึงใช้ besonders gern",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L09-COMM-01-D02-learn-v1-response",
            "targetId": "L09-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich mag besonders gern Schokolade.",
            "meaning": "ฉันชอบช็อกโกแลตเป็นพิเศษ"
          },
          "options": [
            "Ich mag Schokolade nicht.",
            "Ich mag besonders gern Schokolade.",
            "Ich mag besonders gern Käse."
          ]
        }
      ]
    },
    {
      "id": "L09-COMM-03",
      "objective": "L09-COMM-03",
      "title": "สั่งอาหาร",
      "modelVisual": {
        "kind": "board",
        "theme": "menu",
        "title": "รายการที่ลูกค้า B ต้องการ",
        "rows": [
          [
            "เครื่องดื่ม",
            "กาแฟ 1 ถ้วย"
          ],
          [
            "ขนม",
            "เค้ก 1 ชิ้น"
          ]
        ]
      },
      "note": [
        "บอกสิ่งที่ต้องการแล้วเติม bitte เพื่อความสุภาพ",
        "ปฏิเสธข้อเสนอได้ด้วย Nein, danke."
      ],
      "audio": "/audio/l09/model-l09-comm-03.m4a",
      "models": [
        {
          "question": "Guten Tag! Sie wünschen?",
          "reply": "Eine Tasse Kaffee und einen Kuchen, bitte.",
          "questionMeaning": "สวัสดีค่ะ รับอะไรดีคะ",
          "replyMeaning": "ขอกาแฟหนึ่งถ้วยกับเค้กหนึ่งชิ้นครับ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "รายการที่ลูกค้า B ต้องการ",
            "rows": [
              [
                "เครื่องดื่ม",
                "กาแฟ 1 ถ้วย"
              ],
              [
                "ขนม",
                "เค้ก 1 ชิ้น"
              ]
            ]
          }
        },
        {
          "question": "Möchten Sie einen Kuchen?",
          "reply": "Nein, danke.",
          "questionMeaning": "รับเค้กไหมคะ",
          "replyMeaning": "ไม่ครับ ขอบคุณ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "ความต้องการของ B",
            "rows": [
              [
                "เค้ก",
                "ไม่ต้องการ"
              ],
              [
                "การตอบ",
                "ปฏิเสธอย่างสุภาพ"
              ]
            ]
          }
        },
        {
          "question": "Was möchten Sie?",
          "reply": "Ich möchte einen Salat, bitte.",
          "questionMeaning": "คุณต้องการอะไรคะ",
          "replyMeaning": "ขอสลัดครับ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "รายการที่ลูกค้า B ต้องการ",
            "rows": [
              [
                "อาหาร",
                "สลัด"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L09-COMM-03-D01-learn-v1",
          "kind": "order",
          "prompt": "Guten Tag! Sie wünschen?",
          "promptMeaning": "สวัสดีค่ะ รับอะไรดีคะ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "รายการที่ลูกค้า B ต้องการ",
            "rows": [
              [
                "เครื่องดื่ม",
                "กาแฟ 1 ถ้วย"
              ],
              [
                "ขนม",
                "เค้ก 1 ชิ้น"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ eine Tasse กับ Kaffee และ einen กับ Kuchen ในคำสั่งนี้",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L09-COMM-03-D01-learn-v1-response",
            "targetId": "L09-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Eine Tasse Kaffee und einen Kuchen, bitte.",
            "meaning": "ขอกาแฟหนึ่งถ้วยกับเค้กหนึ่งชิ้นครับ"
          },
          "tokens": [
            "Tasse",
            "und",
            "Kuchen,",
            "Eine",
            "Kaffee",
            "einen",
            "bitte."
          ]
        },
        {
          "id": "L09-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "Möchten Sie einen Kuchen?",
          "promptMeaning": "รับเค้กไหมคะ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "ความต้องการของ B",
            "rows": [
              [
                "เค้ก",
                "ไม่ต้องการ"
              ],
              [
                "การตอบ",
                "ปฏิเสธอย่างสุภาพ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ลูกค้าไม่ต้องการเค้ก จึงปฏิเสธด้วย Nein, danke.",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L09-COMM-03-D02-learn-v1-response",
            "targetId": "L09-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, danke.",
            "meaning": "ไม่ครับ ขอบคุณ"
          },
          "options": [
            "Nein, danke.",
            "Ja, gern.",
            "Einen Kuchen, bitte."
          ]
        },
        {
          "id": "L09-COMM-03-D03-learn-v1",
          "kind": "order",
          "prompt": "Was möchten Sie?",
          "promptMeaning": "คุณต้องการอะไรคะ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "รายการที่ลูกค้า B ต้องการ",
            "rows": [
              [
                "อาหาร",
                "สลัด"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ Ich möchte … bitte สั่งสลัดอย่างสุภาพ",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L09-COMM-03-D03-learn-v1-response",
            "targetId": "L09-COMM-03-D03-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich möchte einen Salat, bitte.",
            "meaning": "ขอสลัดครับ"
          },
          "tokens": [
            "möchte",
            "Salat,",
            "Ich",
            "einen",
            "bitte."
          ]
        },
        {
          "id": "L09-COMM-03-AUDIO-learn-v1",
          "kind": "choice",
          "prompt": "ฟังแล้วเลือกรายการที่ลูกค้าสั่ง",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l09/l09-comm-03-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "reply-options"
          ],
          "unit": {
            "id": "L09-COMM-03-AUDIO-learn-v1-response",
            "targetId": "L09-COMM-03-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "Eine Tasse Kaffee und einen Kuchen.",
            "meaning": "กาแฟกับเค้ก"
          },
          "options": [
            "Eine Tasse Tee und einen Kuchen.",
            "Eine Tasse Kaffee und einen Kuchen.",
            "Eine Tasse Kaffee und einen Salat."
          ]
        },
        {
          "id": "L09-COMM-03-PROFILE-learn-v1",
          "kind": "profile",
          "prompt": "อ่านแล้วเติมข้อมูล",
          "promptMeaning": "",
          "visual": {
            "kind": "reading",
            "text": "Nora möchte einen Salat. Tim möchte einen Kuchen. Beide möchten Kaffee."
          },
          "audio": null,
          "explanation": "หาข้อมูลเฉพาะของแต่ละช่องจากข้อความ โดยเก็บผลแยกกัน",
          "assistance": [
            "prior-model",
            "visible-reading",
            "supplied-noun-articles"
          ],
          "fields": [
            {
              "label": "Nora ต้องการอาหารอะไร",
              "unit": {
                "id": "L09-COMM-03-PROFILE-learn-v1-nora-response",
                "targetId": "L09-COMM-03-PROFILE-learn-v1-nora-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "Salat",
                "meaning": "นอร่าต้องการสลัด",
                "nounLabel": "der Salat"
              }
            },
            {
              "label": "Tim ต้องการอาหารอะไร",
              "unit": {
                "id": "L09-COMM-03-PROFILE-learn-v1-tim-response",
                "targetId": "L09-COMM-03-PROFILE-learn-v1-tim-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "Kuchen",
                "meaning": "ทิมต้องการเค้ก",
                "nounLabel": "der Kuchen"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "L09-COMM-04",
      "objective": "L09-COMM-04",
      "title": "เมื่อของหมด",
      "modelVisual": {
        "kind": "board",
        "theme": "menu",
        "title": "หน้าร้านวันนี้",
        "rows": [
          [
            "เค้กช็อกโกแลต",
            "หมด"
          ],
          [
            "เค้กแอปเปิล",
            "ยังมี"
          ],
          [
            "ลูกค้า B",
            "ยอมเลือกเค้กแอปเปิลแทน"
          ]
        ]
      },
      "note": [
        "kein … mehr บอกว่าของนั้นหมดแล้ว",
        "เมื่อของหมด ให้เลือกสิ่งอื่นที่ร้านยังมี"
      ],
      "audio": "/audio/l09/model-l09-comm-04.m4a",
      "models": [
        {
          "question": "Tut mir leid, wir haben keinen Schokoladenkuchen mehr.",
          "reply": "Schade, dann nehme ich einen Apfelkuchen.",
          "questionMeaning": "ขอโทษค่ะ เค้กช็อกโกแลตหมดแล้ว",
          "replyMeaning": "เสียดายจัง งั้นผมเอาเค้กแอปเปิลครับ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "หน้าร้านวันนี้",
            "rows": [
              [
                "เค้กช็อกโกแลต",
                "หมด"
              ],
              [
                "เค้กแอปเปิล",
                "ยังมี"
              ],
              [
                "ลูกค้า B",
                "ยอมเลือกเค้กแอปเปิลแทน"
              ]
            ]
          }
        },
        {
          "question": "Ein Eis, bitte.",
          "reply": "Tut mir leid, wir haben kein Eis mehr.",
          "questionMeaning": "ขอไอศกรีมครับ",
          "replyMeaning": "ขอโทษค่ะ ไอศกรีมหมดแล้ว",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "หน้าร้านวันนี้",
            "rows": [
              [
                "ไอศกรีม",
                "หมด"
              ],
              [
                "ผู้ตอบ B",
                "พนักงาน"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L09-COMM-04-D01-learn-v1",
          "kind": "choice",
          "prompt": "Tut mir leid, wir haben keinen Schokoladenkuchen mehr.",
          "promptMeaning": "ขอโทษค่ะ เค้กช็อกโกแลตหมดแล้ว",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "หน้าร้านวันนี้",
            "rows": [
              [
                "เค้กช็อกโกแลต",
                "หมด"
              ],
              [
                "เค้กแอปเปิล",
                "ยังมี"
              ],
              [
                "ลูกค้า B",
                "ยอมเลือกเค้กแอปเปิลแทน"
              ]
            ]
          },
          "audio": null,
          "explanation": "เค้กช็อกโกแลตหมดและลูกค้ายอมเปลี่ยน จึงเลือกเค้กแอปเปิล",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L09-COMM-04-D01-learn-v1-response",
            "targetId": "L09-COMM-04-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Schade, dann nehme ich einen Apfelkuchen.",
            "meaning": "เสียดายจัง งั้นผมเอาเค้กแอปเปิลครับ"
          },
          "options": [
            "Schade, dann nehme ich einen Apfelkuchen.",
            "Dann nehme ich einen Schokoladenkuchen.",
            "Dann nehme ich ein Eis."
          ]
        },
        {
          "id": "L09-COMM-04-D02-learn-v1",
          "kind": "choice",
          "prompt": "Ein Eis, bitte.",
          "promptMeaning": "ขอไอศกรีมครับ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "หน้าร้านวันนี้",
            "rows": [
              [
                "ไอศกรีม",
                "หมด"
              ],
              [
                "ผู้ตอบ B",
                "พนักงาน"
              ]
            ]
          },
          "audio": null,
          "explanation": "พนักงานแจ้งว่าไอศกรีมหมด ใช้ kein Eis mehr",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L09-COMM-04-D02-learn-v1-response",
            "targetId": "L09-COMM-04-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Tut mir leid, wir haben kein Eis mehr.",
            "meaning": "ขอโทษค่ะ ไอศกรีมหมดแล้ว"
          },
          "options": [
            "Ja, wir haben Eis.",
            "Tut mir leid, wir haben kein Eis mehr.",
            "Eine Tasse Kaffee, bitte."
          ]
        }
      ]
    },
    {
      "id": "L09-COMM-02",
      "objective": "L09-COMM-02",
      "title": "ขอให้อร่อย",
      "modelVisual": {
        "kind": "board",
        "theme": "menu",
        "title": "ก่อนเริ่มมื้ออาหาร",
        "rows": [
          [
            "A และ B",
            "กำลังจะกินอาหารทั้งคู่"
          ],
          [
            "B ต้องการ",
            "ขอบคุณและอวยพรกลับ"
          ]
        ]
      },
      "note": [
        "Guten Appetit! ใช้ก่อนเริ่มกินอาหาร",
        "เมื่ออีกคนกำลังจะกินด้วย ตอบ Danke, gleichfalls! เพื่ออวยพรกลับได้"
      ],
      "audio": "/audio/l09/model-l09-comm-02.m4a",
      "models": [
        {
          "question": "Guten Appetit!",
          "reply": "Danke, gleichfalls!",
          "questionMeaning": "ขอให้อร่อยนะ",
          "replyMeaning": "ขอบคุณ เช่นกันนะ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "ก่อนเริ่มมื้ออาหาร",
            "rows": [
              [
                "A และ B",
                "กำลังจะกินอาหารทั้งคู่"
              ],
              [
                "B ต้องการ",
                "ขอบคุณและอวยพรกลับ"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L09-COMM-02-E01-learn-v1",
          "kind": "choice",
          "prompt": "Guten Appetit!",
          "promptMeaning": "ขอให้อร่อยนะ",
          "visual": {
            "kind": "board",
            "theme": "menu",
            "title": "ก่อนเริ่มมื้ออาหาร",
            "rows": [
              [
                "A และ B",
                "กำลังจะกินอาหารทั้งคู่"
              ],
              [
                "B ต้องการ",
                "ขอบคุณและอวยพรกลับ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ทั้งคู่กำลังจะกิน จึงขอบคุณและอวยพรกลับด้วย gleichfalls",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L09-COMM-02-E01-learn-v1-response",
            "targetId": "L09-COMM-02-E01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Danke, gleichfalls!",
            "meaning": "ขอบคุณ เช่นกันนะ"
          },
          "options": [
            "Tut mir leid, wir haben kein Eis mehr.",
            "Auf Wiederhören.",
            "Danke, gleichfalls!"
          ]
        }
      ]
    }
  ],
  "L10": [
    {
      "id": "L10-COMM-01",
      "objective": "L10-COMM-01",
      "title": "ขึ้นรถ เปลี่ยนรถ และนัดรับ",
      "modelVisual": {
        "kind": "board",
        "theme": "transport",
        "title": "ขบวนไป Stuttgart",
        "rows": [
          [
            "ชานชาลา",
            "4"
          ]
        ]
      },
      "note": [
        "แยกจุดออกเดินทาง จุดเปลี่ยนรถ และการไปรับ",
        "ตอบจากข้อมูลการเดินทางที่กำหนด"
      ],
      "audio": "/audio/l10/model-l10-comm-01.m4a",
      "models": [
        {
          "question": "Wo fährt der Zug nach Stuttgart ab?",
          "reply": "Von Gleis vier.",
          "questionMeaning": "รถไฟไปชตุทท์การ์ทออกจากที่ไหน",
          "replyMeaning": "จากชานชาลาที่สี่",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ขบวนไป Stuttgart",
            "rows": [
              [
                "ชานชาลา",
                "4"
              ]
            ]
          }
        },
        {
          "question": "Wo steigst du um?",
          "reply": "Am Hamburger Hauptbahnhof.",
          "questionMeaning": "เธอเปลี่ยนรถที่ไหน",
          "replyMeaning": "ที่สถานีรถไฟหลักฮัมบูร์ก",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "จุดเปลี่ยนรถ",
            "rows": [
              [
                "สถานี",
                "Hamburg Hauptbahnhof"
              ]
            ]
          }
        },
        {
          "question": "Kannst du mich abholen?",
          "reply": "Natürlich. Ich hole dich ab.",
          "questionMeaning": "เธอมารับฉันได้ไหม",
          "replyMeaning": "ได้แน่นอน ฉันจะไปรับเธอ",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "นัดรับที่สนามบิน",
            "rows": [
              [
                "ผู้ตอบ B",
                "ไปรับได้และตกลง"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L10-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Wo fährt der Zug nach Stuttgart ab?",
          "promptMeaning": "รถไฟไปชตุทท์การ์ทออกจากที่ไหน",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ขบวนไป Stuttgart",
            "rows": [
              [
                "ชานชาลา",
                "4"
              ]
            ]
          },
          "audio": null,
          "explanation": "ดูชานชาลาของขบวนไป Stuttgart คือ 4",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L10-COMM-01-D01-learn-v1-response",
            "targetId": "L10-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Von Gleis vier.",
            "meaning": "จากชานชาลาที่สี่"
          },
          "options": [
            "Von Gleis zwei.",
            "Von Gleis vier.",
            "Von Gleis fünf."
          ]
        },
        {
          "id": "L10-COMM-01-D02-learn-v1",
          "kind": "order",
          "prompt": "Wo steigst du um?",
          "promptMeaning": "เธอเปลี่ยนรถที่ไหน",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "จุดเปลี่ยนรถ",
            "rows": [
              [
                "สถานี",
                "Hamburg Hauptbahnhof"
              ]
            ]
          },
          "audio": null,
          "explanation": "ตอบสถานีที่เปลี่ยนรถด้วย am ตามด้วยชื่อสถานี",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L10-COMM-01-D02-learn-v1-response",
            "targetId": "L10-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Am Hamburger Hauptbahnhof.",
            "meaning": "ที่สถานีรถไฟหลักฮัมบูร์ก"
          },
          "tokens": [
            "Hamburger",
            "Am",
            "Hauptbahnhof."
          ]
        },
        {
          "id": "L10-COMM-01-D03-learn-v1",
          "kind": "choice",
          "prompt": "Kannst du mich abholen?",
          "promptMeaning": "เธอมารับฉันได้ไหม",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "นัดรับที่สนามบิน",
            "rows": [
              [
                "ผู้ตอบ B",
                "ไปรับได้และตกลง"
              ]
            ]
          },
          "audio": null,
          "explanation": "ผู้ตอบตกลงไปรับ จึงใช้ Ich hole dich ab",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L10-COMM-01-D03-learn-v1-response",
            "targetId": "L10-COMM-01-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Natürlich. Ich hole dich ab.",
            "meaning": "ได้แน่นอน ฉันจะไปรับเธอ"
          },
          "options": [
            "Natürlich. Ich hole dich ab.",
            "Tut mir leid, ich kann dich nicht abholen.",
            "Ich steige um."
          ]
        }
      ]
    },
    {
      "id": "L10-COMM-02",
      "objective": "L10-COMM-02",
      "title": "เข้าใจแล้ว แน่ใจไหม",
      "modelVisual": {
        "kind": "board",
        "theme": "transport",
        "title": "เที่ยวบินของ A",
        "rows": [
          [
            "เวลาออก",
            "05:00"
          ],
          [
            "B ต้องการ",
            "ถามยืนยันเพราะเช้ามาก"
          ]
        ]
      },
      "note": [
        "Bist du sicher? ใช้ถามยืนยัน",
        "Verstehe. / Alles klar. ใช้บอกว่าเข้าใจ"
      ],
      "audio": "/audio/l10/model-l10-comm-02.m4a",
      "models": [
        {
          "question": "Mein Flug startet um fünf Uhr.",
          "reply": "So früh? Bist du sicher?",
          "questionMeaning": "เที่ยวบินของฉันออกตอนตีห้า",
          "replyMeaning": "เช้าขนาดนั้นเลยเหรอ เธอแน่ใจไหม",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "เที่ยวบินของ A",
            "rows": [
              [
                "เวลาออก",
                "05:00"
              ],
              [
                "B ต้องการ",
                "ถามยืนยันเพราะเช้ามาก"
              ]
            ]
          }
        },
        {
          "question": "Mein Handy hat keinen Akku mehr.",
          "reply": "Verstehe. Alles klar.",
          "questionMeaning": "โทรศัพท์ฉันแบตหมด",
          "replyMeaning": "เข้าใจแล้ว ได้เลย",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ข้อความจาก A",
            "rows": [
              [
                "แบตมือถือ",
                "หมด"
              ],
              [
                "B ต้องการ",
                "บอกว่าเข้าใจแล้ว"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L10-COMM-02-D01-learn-v1",
          "kind": "choice",
          "prompt": "Mein Flug startet um fünf Uhr.",
          "promptMeaning": "เที่ยวบินของฉันออกตอนตีห้า",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "เที่ยวบินของ A",
            "rows": [
              [
                "เวลาออก",
                "05:00"
              ],
              [
                "B ต้องการ",
                "ถามยืนยันเพราะเช้ามาก"
              ]
            ]
          },
          "audio": null,
          "explanation": "เที่ยวบินเช้ามากและต้องการยืนยัน จึงถาม Bist du sicher?",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L10-COMM-02-D01-learn-v1-response",
            "targetId": "L10-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "So früh? Bist du sicher?",
            "meaning": "เช้าขนาดนั้นเลยเหรอ เธอแน่ใจไหม"
          },
          "options": [
            "Gute Nacht!",
            "Vielen Dank für das Interview.",
            "So früh? Bist du sicher?"
          ]
        },
        {
          "id": "L10-COMM-02-D02-learn-v1",
          "kind": "choice",
          "prompt": "Mein Handy hat keinen Akku mehr.",
          "promptMeaning": "โทรศัพท์ฉันแบตหมด",
          "visual": {
            "kind": "board",
            "theme": "phone",
            "title": "ข้อความจาก A",
            "rows": [
              [
                "แบตมือถือ",
                "หมด"
              ],
              [
                "B ต้องการ",
                "บอกว่าเข้าใจแล้ว"
              ]
            ]
          },
          "audio": null,
          "explanation": "ต้องการบอกว่าเข้าใจ จึงใช้ Verstehe. Alles klar.",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L10-COMM-02-D02-learn-v1-response",
            "targetId": "L10-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Verstehe. Alles klar.",
            "meaning": "เข้าใจแล้ว ได้เลย"
          },
          "options": [
            "Verstehe. Alles klar.",
            "So früh? Bist du sicher?",
            "Gute Nacht!"
          ]
        }
      ]
    },
    {
      "id": "L10-COMM-03",
      "objective": "L10-COMM-03",
      "title": "หวังว่าจะได้เจอกัน",
      "modelVisual": {
        "kind": "board",
        "theme": "transport",
        "title": "กำหนดถึงของ B",
        "rows": [
          [
            "เวลา",
            "09:00"
          ],
          [
            "ความหวัง",
            "ไม่ล่าช้า"
          ]
        ]
      },
      "note": [
        "Hoffentlich … ใช้บอกความหวัง",
        "Ich freue mich auf … ใช้บอกว่าดีใจที่จะได้พบ"
      ],
      "audio": "/audio/l10/model-l10-comm-03.m4a",
      "models": [
        {
          "question": "Wann kommst du an?",
          "reply": "Um neun Uhr. Hoffentlich haben wir keine Verspätung.",
          "questionMeaning": "เธอจะมาถึงเมื่อไร",
          "replyMeaning": "ตอนเก้าโมง หวังว่าเครื่องบินจะไม่ล่าช้า",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "กำหนดถึงของ B",
            "rows": [
              [
                "เวลา",
                "09:00"
              ],
              [
                "ความหวัง",
                "ไม่ล่าช้า"
              ]
            ]
          }
        },
        {
          "question": "Ich freue mich auf dich!",
          "reply": "Ich freue mich auch auf dich!",
          "questionMeaning": "ฉันดีใจที่จะได้เจอเธอ",
          "replyMeaning": "ฉันก็ดีใจที่จะได้เจอเธอเหมือนกัน",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "กำลังจะได้พบกัน",
            "rows": [
              [
                "A และ B",
                "ต่างดีใจที่จะได้เจอกัน"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L10-COMM-03-D01-learn-v1",
          "kind": "order",
          "prompt": "Wann kommst du an?",
          "promptMeaning": "เธอจะมาถึงเมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "กำหนดถึงของ B",
            "rows": [
              [
                "เวลา",
                "09:00"
              ],
              [
                "ความหวัง",
                "ไม่ล่าช้า"
              ]
            ]
          },
          "audio": null,
          "explanation": "บอกเวลาถึงก่อน แล้วใช้ Hoffentlich แสดงความหวังว่าจะไม่ช้า",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L10-COMM-03-D01-learn-v1-response",
            "targetId": "L10-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Um neun Uhr. Hoffentlich haben wir keine Verspätung.",
            "meaning": "ตอนเก้าโมง หวังว่าเครื่องบินจะไม่ล่าช้า"
          },
          "tokens": [
            "neun",
            "Hoffentlich",
            "wir",
            "Verspätung.",
            "Um",
            "Uhr.",
            "haben",
            "keine"
          ]
        },
        {
          "id": "L10-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "Ich freue mich auf dich!",
          "promptMeaning": "ฉันดีใจที่จะได้เจอเธอ",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "กำลังจะได้พบกัน",
            "rows": [
              [
                "A และ B",
                "ต่างดีใจที่จะได้เจอกัน"
              ]
            ]
          },
          "audio": null,
          "explanation": "อีกคนดีใจที่จะได้พบ ผู้ตอบก็ดีใจเช่นกันจึงใช้ auch",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L10-COMM-03-D02-learn-v1-response",
            "targetId": "L10-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich freue mich auch auf dich!",
            "meaning": "ฉันก็ดีใจที่จะได้เจอเธอเหมือนกัน"
          },
          "options": [
            "Tut mir leid, ich habe keine Zeit.",
            "Ich freue mich auch auf dich!",
            "Einen Moment bitte."
          ]
        }
      ]
    },
    {
      "id": "L10-COMM-04",
      "objective": "L10-COMM-04",
      "title": "อ่านและฟังประกาศ",
      "modelVisual": {
        "kind": "board",
        "theme": "transport",
        "title": "Intercity 642 → Salzburg",
        "rows": [
          [
            "ชานชาลา",
            "5"
          ]
        ]
      },
      "note": [
        "อ่านชื่อขบวนหรือปลายทางก่อนหาชานชาลาหรือทางออก",
        "การอ่านประกาศกับการฟังประกาศเก็บผลคนละทักษะ"
      ],
      "audio": "/audio/l10/model-l10-comm-04.m4a",
      "models": [
        {
          "question": "Wo fährt der Intercity 642 ab?",
          "reply": "Von Bahnsteig fünf.",
          "questionMeaning": "รถไฟอินเตอร์ซิตี 642 ออกจากที่ไหน",
          "replyMeaning": "จากชานชาลาที่ห้า",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "Intercity 642 → Salzburg",
            "rows": [
              [
                "ชานชาลา",
                "5"
              ]
            ]
          }
        },
        {
          "question": "Welcher Ausgang?",
          "reply": "Am Ausgang B48.",
          "questionMeaning": "ทางออกไหน",
          "replyMeaning": "ที่ทางออก B48",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "Flug → Zürich",
            "rows": [
              [
                "ทางออก",
                "B48"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L10-COMM-04-D01-learn-v1",
          "kind": "choice",
          "prompt": "Wo fährt der Intercity 642 ab?",
          "promptMeaning": "รถไฟอินเตอร์ซิตี 642 ออกจากที่ไหน",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "Intercity 642 → Salzburg",
            "rows": [
              [
                "ชานชาลา",
                "5"
              ]
            ]
          },
          "audio": null,
          "explanation": "ประกาศขบวน Intercity 642 ระบุ Bahnsteig 5",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L10-COMM-04-D01-learn-v1-response",
            "targetId": "L10-COMM-04-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Von Bahnsteig fünf.",
            "meaning": "จากชานชาลาที่ห้า"
          },
          "options": [
            "Von Bahnsteig vier.",
            "Von Bahnsteig fünf.",
            "Von Bahnsteig sechs."
          ]
        },
        {
          "id": "L10-COMM-04-D02-learn-v1",
          "kind": "choice",
          "prompt": "Welcher Ausgang?",
          "promptMeaning": "ทางออกไหน",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "Flug → Zürich",
            "rows": [
              [
                "ทางออก",
                "B48"
              ]
            ]
          },
          "audio": null,
          "explanation": "ต้องคงทั้งตัวอักษรและลำดับตัวเลข B48 ไม่สลับเป็น B84",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L10-COMM-04-D02-learn-v1-response",
            "targetId": "L10-COMM-04-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Am Ausgang B48.",
            "meaning": "ที่ทางออก B48"
          },
          "options": [
            "Am Ausgang B84.",
            "Am Ausgang A48.",
            "Am Ausgang B48."
          ]
        },
        {
          "id": "L10-COMM-04-AUDIO-learn-v1",
          "kind": "digits",
          "prompt": "ฟังประกาศแล้วใส่ชานชาลา",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l10/l10-comm-04-audio-learn-v1.m4a",
          "explanation": "ประกาศระบุ Gleis sechs จึงใส่ 6; ผลข้อนี้เป็นการฟัง แยกจากการอ่านกระดาน",
          "assistance": [
            "prior-model",
            "replayable-german-audio"
          ],
          "unit": {
            "id": "L10-COMM-04-AUDIO-learn-v1-response",
            "targetId": "L10-COMM-04-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "6",
            "meaning": "ชานชาลา 6"
          },
          "label": "ชานชาลา",
          "maxLength": 2
        }
      ]
    }
  ],
  "L11": [
    {
      "id": "L11-COMM-01",
      "objective": "L11-COMM-01",
      "title": "เล่าอดีตด้วย Perfekt",
      "modelVisual": {
        "kind": "board",
        "theme": "timeline",
        "title": "กิจกรรมของ B",
        "rows": [
          [
            "กิจกรรม",
            "ทำอาหาร"
          ]
        ]
      },
      "note": [
        "Perfekt ใช้เล่าเหตุการณ์ที่เกิดขึ้นแล้ว (อดีต)",
        "โครงสร้างบอกเล่า: ประธาน + กริยาช่วย (ผันตามประธาน) + Partizip II",
        "วาง Partizip II ไว้ท้ายประโยค"
      ],
      "audio": "/audio/l11/model-l11-comm-01.m4a",
      "models": [
        {
          "question": "Was hast du gemacht?",
          "reply": "Ich habe gekocht.",
          "questionMeaning": "เธอทำอะไรมา?",
          "replyMeaning": "ฉันทำอาหารแล้ว",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "กิจกรรมของ B",
            "rows": [
              [
                "กิจกรรม",
                "ทำอาหาร"
              ]
            ]
          },
          "questionSentences": [
            [
              {
                "text": "Was",
                "role": "question",
                "label": "คำถาม",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "hast",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "du",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gemacht?",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยค"
              }
            ]
          ],
          "replySentences": [
            [
              {
                "text": "Ich",
                "role": "subject",
                "label": "ประธาน",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "habe",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "gekocht.",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยค"
              }
            ]
          ]
        },
        {
          "question": "Was hast du gemacht?",
          "reply": "Ich habe gelesen.",
          "questionMeaning": "เธอทำอะไรมา?",
          "replyMeaning": "ฉันอ่านแล้ว",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "กิจกรรมของ B",
            "rows": [
              [
                "กิจกรรม",
                "อ่านหนังสือ"
              ]
            ]
          },
          "questionSentences": [
            [
              {
                "text": "Was",
                "role": "question",
                "label": "คำถาม",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "hast",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "du",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gemacht?",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยค"
              }
            ]
          ],
          "replySentences": [
            [
              {
                "text": "Ich",
                "role": "subject",
                "label": "ประธาน",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "habe",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "gelesen.",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยค"
              }
            ]
          ]
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L11-COMM-01-D01-learn-v1",
          "kind": "choice",
          "prompt": "Hast du gestern gekocht?",
          "promptMeaning": "เมื่อวานเธอทำอาหารไหม",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "เมื่อวานของ B",
            "rows": [
              [
                "กิจกรรม",
                "อ่านหนังสือพิมพ์"
              ],
              [
                "ทำอาหาร",
                "ไม่ได้ทำ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลบอกว่าไม่ได้ทำอาหาร จึงตอบ Nein; จากนั้นใช้ Perfekt เล่าสิ่งที่ทำแทน",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L11-COMM-01-D01-learn-v1-response",
            "targetId": "L11-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, ich habe Zeitung gelesen.",
            "meaning": "ไม่ ฉันอ่านหนังสือพิมพ์"
          },
          "options": [
            "Ja, ich habe gekocht.",
            "Nein, ich habe gearbeitet.",
            "Nein, ich habe Zeitung gelesen."
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-01-d01.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Hast",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "du",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "gestern",
                  "role": "time",
                  "label": "คำบอกเวลา"
                },
                {
                  "text": "gekocht?",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยค"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Nein,",
                  "role": "other",
                  "label": "ตอบปฏิเสธ"
                },
                {
                  "text": "ich",
                  "role": "subject",
                  "label": "ประธาน",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "habe",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "Zeitung",
                  "role": "other",
                  "label": "กรรม"
                },
                {
                  "text": "gelesen.",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยค"
                }
              ]
            ]
          }
        },
        {
          "id": "L11-COMM-01-D02-learn-v1",
          "kind": "order",
          "prompt": "Was hast du letzten Samstag gemacht?",
          "promptMeaning": "วันเสาร์ที่แล้วเธอทำอะไร",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "เสาร์ที่แล้วของ B",
            "rows": [
              [
                "กิจกรรม",
                "พบเพื่อน"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลระบุว่าวันเสาร์ที่แล้วพบเพื่อน จึงใช้ Freunde getroffen เล่าเหตุการณ์นั้น",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L11-COMM-01-D02-learn-v1-response",
            "targetId": "L11-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich habe Freunde getroffen.",
            "meaning": "ฉันพบเพื่อน"
          },
          "tokens": [
            "habe",
            "getroffen.",
            "Ich",
            "Freunde"
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-01-d02.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Was",
                  "role": "question",
                  "label": "คำถาม",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "hast",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "du",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "letzten Samstag",
                  "role": "time",
                  "label": "คำบอกเวลา"
                },
                {
                  "text": "gemacht?",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยค"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Ich",
                  "role": "subject",
                  "label": "ประธาน",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "habe",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "Freunde",
                  "role": "other",
                  "label": "กรรม"
                },
                {
                  "text": "getroffen.",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยค"
                }
              ]
            ]
          }
        }
      ],
      "grammarPatterns": [
        {
          "id": "statement",
          "title": "ประโยคบอกเล่า",
          "present": "Ich arbeite.",
          "past": "Ich habe gearbeitet.",
          "presentMeaning": "ฉันทำงาน",
          "pastMeaning": "ฉันทำงานแล้ว",
          "parts": [
            {
              "text": "Ich",
              "role": "subject",
              "position": "ประธาน · ตำแหน่ง 1"
            },
            {
              "text": "habe",
              "role": "auxiliary",
              "position": "กริยาช่วย (ผันแล้ว) · ตำแหน่ง 2"
            },
            {
              "text": "gearbeitet.",
              "role": "participle",
              "position": "Partizip II · ท้ายประโยค"
            }
          ],
          "structure": [
            "ประธาน + กริยาช่วย (ผันตามประธาน) + Partizip II"
          ],
          "presentParts": [
            {
              "text": "Ich",
              "role": "subject",
              "label": "ประธาน",
              "position": "ตำแหน่ง 1"
            },
            {
              "text": "arbeite.",
              "role": "verb",
              "label": "กริยาหลัก (ผันแล้ว)",
              "position": "ตำแหน่ง 2"
            }
          ],
          "pastParts": [
            {
              "text": "Ich",
              "role": "subject",
              "label": "ประธาน",
              "position": "ตำแหน่ง 1"
            },
            {
              "text": "habe",
              "role": "auxiliary",
              "label": "กริยาช่วย (ผันแล้ว)",
              "position": "ตำแหน่ง 2"
            },
            {
              "text": "gearbeitet.",
              "role": "participle",
              "label": "กริยาหลัก · Partizip II",
              "position": "ท้ายประโยค"
            }
          ],
          "audio": "/audio/l11/perfekt-statement.m4a"
        },
        {
          "id": "w-question",
          "title": "W-Frage",
          "present": "Wo lernst du Deutsch?",
          "past": "Wo hast du Deutsch gelernt?",
          "presentMeaning": "เธอเรียนภาษาเยอรมันที่ไหน",
          "pastMeaning": "เธอเรียนภาษาเยอรมันที่ไหนมา",
          "parts": [
            {
              "text": "Wo",
              "role": "question",
              "position": "คำถาม · ตำแหน่ง 1"
            },
            {
              "text": "hast",
              "role": "auxiliary",
              "position": "กริยาช่วย (ผันแล้ว) · ตำแหน่ง 2"
            },
            {
              "text": "du",
              "role": "subject",
              "position": "ประธาน"
            },
            {
              "text": "Deutsch",
              "role": "other"
            },
            {
              "text": "gelernt?",
              "role": "participle",
              "position": "Partizip II · ท้ายประโยค"
            }
          ],
          "structure": [
            "คำถาม + กริยาช่วย (ผันแล้ว) + ประธาน + ส่วนอื่น + Partizip II"
          ],
          "presentParts": [
            {
              "text": "Wo",
              "role": "question",
              "label": "คำถาม",
              "position": "ตำแหน่ง 1"
            },
            {
              "text": "lernst",
              "role": "verb",
              "label": "กริยาหลัก (ผันแล้ว)",
              "position": "ตำแหน่ง 2"
            },
            {
              "text": "du",
              "role": "subject",
              "label": "ประธาน"
            },
            {
              "text": "Deutsch?",
              "role": "other",
              "label": "สิ่งที่เรียน"
            }
          ],
          "pastParts": [
            {
              "text": "Wo",
              "role": "question",
              "label": "คำถาม",
              "position": "ตำแหน่ง 1"
            },
            {
              "text": "hast",
              "role": "auxiliary",
              "label": "กริยาช่วย (ผันแล้ว)",
              "position": "ตำแหน่ง 2"
            },
            {
              "text": "du",
              "role": "subject",
              "label": "ประธาน"
            },
            {
              "text": "Deutsch",
              "role": "other",
              "label": "ส่วนอื่น"
            },
            {
              "text": "gelernt?",
              "role": "participle",
              "label": "กริยาหลัก · Partizip II",
              "position": "ท้ายประโยค"
            }
          ],
          "audio": "/audio/l11/perfekt-w-question.m4a"
        },
        {
          "id": "yes-no-question",
          "title": "Ja-/Nein-Frage",
          "present": "Macht ihr die Hausaufgaben?",
          "past": "Habt ihr die Hausaufgaben gemacht?",
          "presentMeaning": "พวกเธอทำการบ้านไหม",
          "pastMeaning": "พวกเธอทำการบ้านแล้วหรือยัง",
          "parts": [
            {
              "text": "Habt",
              "role": "auxiliary",
              "position": "กริยาช่วย (ผันแล้ว) · ตำแหน่ง 1"
            },
            {
              "text": "ihr",
              "role": "subject",
              "position": "ประธาน"
            },
            {
              "text": "die Hausaufgaben",
              "role": "other"
            },
            {
              "text": "gemacht?",
              "role": "participle",
              "position": "Partizip II · ท้ายประโยค"
            }
          ],
          "structure": [
            "กริยาช่วย (ผันแล้ว) + ประธาน + ส่วนอื่น + Partizip II"
          ],
          "presentParts": [
            {
              "text": "Macht",
              "role": "verb",
              "label": "กริยาหลัก (ผันแล้ว)",
              "position": "ตำแหน่ง 1"
            },
            {
              "text": "ihr",
              "role": "subject",
              "label": "ประธาน"
            },
            {
              "text": "die Hausaufgaben?",
              "role": "other",
              "label": "กรรม"
            }
          ],
          "pastParts": [
            {
              "text": "Habt",
              "role": "auxiliary",
              "label": "กริยาช่วย (ผันแล้ว)",
              "position": "ตำแหน่ง 1"
            },
            {
              "text": "ihr",
              "role": "subject",
              "label": "ประธาน"
            },
            {
              "text": "die Hausaufgaben",
              "role": "other",
              "label": "ส่วนอื่น"
            },
            {
              "text": "gemacht?",
              "role": "participle",
              "label": "กริยาหลัก · Partizip II",
              "position": "ท้ายประโยค"
            }
          ],
          "audio": "/audio/l11/perfekt-yes-no-question.m4a"
        }
      ]
    },
    {
      "id": "L11-COMM-02",
      "objective": "L11-COMM-02",
      "title": "บอกช่วงเวลาและลำดับในอดีต",
      "modelVisual": {
        "kind": "board",
        "theme": "timeline",
        "title": "เมื่อวานของ B",
        "rows": [
          [
            "09:00–17:00",
            "ทำงาน"
          ],
          [
            "หลังจากนั้น",
            "ทำอาหาร"
          ]
        ]
      },
      "note": [
        "เริ่มจาก Ich habe gearbeitet. = ฉันทำงานแล้ว",
        "ถ้าต้องการบอกว่าเมื่อไร ให้วางวลีเวลาไว้ต้นประโยคแทน ich: วลีเวลา + habe + ich + Partizip II",
        "วลีเวลาทั้งกลุ่มนับเป็นตำแหน่งที่ 1 ไม่ได้นับทีละคำ; habe จึงยังอยู่ตำแหน่งที่ 2 และ ich ตามหลัง",
        "Danach / Dann ใช้ขึ้นต้นประโยคถัดไป เพื่อเล่าว่าทำอะไรต่อ"
      ],
      "audio": "/audio/l11/model-l11-comm-02.m4a",
      "models": [
        {
          "question": "Was hast du gestern gemacht?",
          "reply": "Von neun bis siebzehn Uhr habe ich gearbeitet. Danach habe ich gekocht.",
          "questionMeaning": "เมื่อวานเธอทำอะไร",
          "replyMeaning": "ฉันทำงานตั้งแต่เก้าโมงถึงห้าโมงเย็น หลังจากนั้นฉันทำอาหาร",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "เมื่อวานของ B",
            "rows": [
              [
                "09:00–17:00",
                "ทำงาน"
              ],
              [
                "หลังจากนั้น",
                "ทำอาหาร"
              ]
            ]
          },
          "teachingIntro": [
            "von … bis … = ตั้งแต่ … ถึง … ใช้บอกช่วงเวลา"
          ],
          "replyTeaching": {
            "focus": [
              "Von neun bis siebzehn Uhr",
              "habe",
              "gearbeitet",
              "Danach",
              "gekocht"
            ],
            "structure": [
              "Von neun bis siebzehn Uhr = ตั้งแต่ 9 ถึง 17 นาฬิกา",
              "ขึ้นต้นด้วยช่วงเวลา → habe อยู่ตำแหน่งที่ 2",
              "Danach = หลังจากนั้น → habe อยู่ตำแหน่งที่ 2 เช่นกัน",
              "gearbeitet / gekocht (Partizip II) อยู่ท้ายแต่ละประโยค"
            ]
          },
          "replySentences": [
            [
              {
                "text": "Von neun bis siebzehn Uhr",
                "role": "time",
                "label": "ช่วงเวลา",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "habe",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2 เสมอ"
              },
              {
                "text": "ich",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gearbeitet.",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยคเสมอ"
              }
            ],
            [
              {
                "text": "Danach",
                "role": "sequence",
                "label": "คำบอกลำดับ",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "habe",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2 เสมอ"
              },
              {
                "text": "ich",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gekocht.",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยคเสมอ"
              }
            ]
          ],
          "audio": "/audio/l11/model-l11-comm-02-card-01.m4a",
          "questionSentences": [
            [
              {
                "text": "Was",
                "role": "question",
                "label": "คำถาม",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "hast",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "du",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gestern",
                "role": "time",
                "label": "คำบอกเวลา"
              },
              {
                "text": "gemacht?",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยค"
              }
            ]
          ]
        },
        {
          "question": "Was hast du gestern Abend gemacht?",
          "reply": "Ab halb sechs habe ich gelesen.",
          "questionMeaning": "เมื่อวานตอนเย็นเธอทำอะไร",
          "replyMeaning": "ฉันอ่านหนังสือตั้งแต่ห้าโมงครึ่ง",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "เมื่อวานของ B",
            "rows": [
              [
                "17:30 เป็นต้นไป",
                "อ่านหนังสือ"
              ]
            ]
          },
          "teachingIntro": [
            "ab + เวลา = ตั้งแต่เวลานั้น ใช้บอกจุดเริ่มต้น"
          ],
          "replyTeaching": {
            "focus": [
              "Ab halb sechs",
              "habe",
              "gelesen"
            ],
            "structure": [
              "Ab halb sechs = ตั้งแต่ 17:30",
              "วลีเวลาอยู่ต้นประโยค → habe อยู่ตำแหน่งที่ 2",
              "gelesen (Partizip II) อยู่ท้ายประโยค"
            ]
          },
          "replySentences": [
            [
              {
                "text": "Ab halb sechs",
                "role": "time",
                "label": "จุดเริ่มต้นของเวลา",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "habe",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2 เสมอ"
              },
              {
                "text": "ich",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gelesen.",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยคเสมอ"
              }
            ]
          ],
          "audio": "/audio/l11/model-l11-comm-02-card-02.m4a",
          "questionSentences": [
            [
              {
                "text": "Was",
                "role": "question",
                "label": "คำถาม",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "hast",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "du",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gestern Abend",
                "role": "time",
                "label": "คำบอกเวลา"
              },
              {
                "text": "gemacht?",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยค"
              }
            ]
          ]
        },
        {
          "question": "Was hast du am Sonntag gemacht?",
          "reply": "Am Morgen habe ich gefrühstückt. Dann habe ich Freunde getroffen.",
          "questionMeaning": "วันอาทิตย์เธอทำอะไร",
          "replyMeaning": "ตอนเช้าฉันกินอาหารเช้า แล้วฉันก็พบเพื่อน",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "วันอาทิตย์ของ B",
            "rows": [
              [
                "1 ตอนเช้า",
                "กินอาหารเช้า"
              ],
              [
                "2 หลังจากนั้น",
                "พบเพื่อน"
              ]
            ]
          },
          "teachingIntro": [
            "Am Morgen = ตอนเช้า · Dann = หลังจากนั้น"
          ],
          "replyTeaching": {
            "focus": [
              "Am Morgen",
              "habe",
              "gefrühstückt",
              "Dann",
              "getroffen"
            ],
            "structure": [
              "Am Morgen / Dann อยู่ต้นประโยค → habe อยู่ตำแหน่งที่ 2",
              "gefrühstückt / getroffen (Partizip II) อยู่ท้ายแต่ละประโยค"
            ]
          },
          "replySentences": [
            [
              {
                "text": "Am Morgen",
                "role": "time",
                "label": "คำบอกเวลา",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "habe",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2 เสมอ"
              },
              {
                "text": "ich",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "gefrühstückt.",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยคเสมอ"
              }
            ],
            [
              {
                "text": "Dann",
                "role": "sequence",
                "label": "คำบอกลำดับ",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "habe",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2 เสมอ"
              },
              {
                "text": "ich",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "Freunde",
                "role": "other",
                "label": "ส่วนขยาย"
              },
              {
                "text": "getroffen.",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยคเสมอ"
              }
            ]
          ],
          "audio": "/audio/l11/model-l11-comm-02-card-03.m4a",
          "questionSentences": [
            [
              {
                "text": "Was",
                "role": "question",
                "label": "คำถาม",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "hast",
                "role": "auxiliary",
                "label": "กริยาช่วย (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "du",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "am Sonntag",
                "role": "time",
                "label": "คำบอกเวลา"
              },
              {
                "text": "gemacht?",
                "role": "participle",
                "label": "กริยาหลัก · Partizip II",
                "position": "ท้ายประโยค"
              }
            ]
          ]
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L11-COMM-02-D01-learn-v1",
          "kind": "order",
          "prompt": "Was hast du gestern gemacht?",
          "promptMeaning": "เมื่อวานเธอทำอะไร",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "เมื่อวานของ B",
            "rows": [
              [
                "09:00–17:00",
                "ทำงาน"
              ],
              [
                "หลังจากนั้น",
                "ทำอาหาร"
              ]
            ]
          },
          "audio": null,
          "explanation": "ทำงานตั้งแต่ 09:00 ถึง 17:00 แล้วจึงทำอาหาร จึงใช้ Danach เชื่อมเหตุการณ์ที่เกิดขึ้นถัดไป",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L11-COMM-02-D01-learn-v1-response",
            "targetId": "L11-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Von neun bis siebzehn Uhr habe ich gearbeitet. Danach habe ich gekocht.",
            "meaning": "ฉันทำงานตั้งแต่เก้าโมงถึงห้าโมงเย็น หลังจากนั้นฉันทำอาหาร"
          },
          "tokens": [
            "neun",
            "siebzehn",
            "habe",
            "gearbeitet.",
            "habe",
            "gekocht.",
            "Von",
            "bis",
            "Uhr",
            "ich",
            "Danach",
            "ich"
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-02-d01.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Was",
                  "role": "question",
                  "label": "คำถาม",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "hast",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "du",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "gestern",
                  "role": "time",
                  "label": "คำบอกเวลา"
                },
                {
                  "text": "gemacht?",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยค"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Von neun bis siebzehn Uhr",
                  "role": "time",
                  "label": "ช่วงเวลา",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "habe",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2 เสมอ"
                },
                {
                  "text": "ich",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "gearbeitet.",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยคเสมอ"
                }
              ],
              [
                {
                  "text": "Danach",
                  "role": "sequence",
                  "label": "คำบอกลำดับ",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "habe",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2 เสมอ"
                },
                {
                  "text": "ich",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "gekocht.",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยคเสมอ"
                }
              ]
            ]
          }
        },
        {
          "id": "L11-COMM-02-D02-learn-v1",
          "kind": "choice",
          "prompt": "Was hast du gestern Abend gemacht?",
          "promptMeaning": "เมื่อวานตอนเย็นเธอทำอะไร",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "เมื่อวานของ B",
            "rows": [
              [
                "17:30 เป็นต้นไป",
                "อ่านหนังสือ"
              ]
            ]
          },
          "audio": null,
          "explanation": "ab = ตั้งแต่เวลานั้น ใช้บอกจุดเริ่ม\nhalb sechs ในบริบทนี้คือ 17:30",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L11-COMM-02-D02-learn-v1-response",
            "targetId": "L11-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ab halb sechs habe ich gelesen.",
            "meaning": "ฉันอ่านหนังสือตั้งแต่ห้าโมงครึ่ง"
          },
          "options": [
            "Ab halb fünf habe ich gelesen.",
            "Ab halb sechs habe ich gelesen.",
            "Bis halb sechs habe ich gelesen."
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-02-d02.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Was",
                  "role": "question",
                  "label": "คำถาม",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "hast",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "du",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "gestern Abend",
                  "role": "time",
                  "label": "คำบอกเวลา"
                },
                {
                  "text": "gemacht?",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยค"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Ab halb sechs",
                  "role": "time",
                  "label": "จุดเริ่มต้นของเวลา",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "habe",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2 เสมอ"
                },
                {
                  "text": "ich",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "gelesen.",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยคเสมอ"
                }
              ]
            ]
          }
        },
        {
          "id": "L11-COMM-02-D03-learn-v1",
          "kind": "order",
          "prompt": "Was hast du am Sonntag gemacht?",
          "promptMeaning": "วันอาทิตย์เธอทำอะไร",
          "visual": {
            "kind": "board",
            "theme": "timeline",
            "title": "วันอาทิตย์ของ B",
            "rows": [
              [
                "1 ตอนเช้า",
                "กินอาหารเช้า"
              ],
              [
                "2 หลังจากนั้น",
                "พบเพื่อน"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลเรียงจากกินอาหารเช้าไปสู่การพบเพื่อน จึงเล่าด้วย Am Morgen แล้วตามด้วย Dann",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L11-COMM-02-D03-learn-v1-response",
            "targetId": "L11-COMM-02-D03-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Am Morgen habe ich gefrühstückt. Dann habe ich Freunde getroffen.",
            "meaning": "ตอนเช้าฉันกินอาหารเช้า แล้วฉันก็พบเพื่อน"
          },
          "tokens": [
            "Morgen",
            "ich",
            "Dann",
            "ich",
            "getroffen.",
            "Am",
            "habe",
            "gefrühstückt.",
            "habe",
            "Freunde"
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-02-d03.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Was",
                  "role": "question",
                  "label": "คำถาม",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "hast",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "du",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "am Sonntag",
                  "role": "time",
                  "label": "คำบอกเวลา"
                },
                {
                  "text": "gemacht?",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยค"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Am Morgen",
                  "role": "time",
                  "label": "คำบอกเวลา",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "habe",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2 เสมอ"
                },
                {
                  "text": "ich",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "gefrühstückt.",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยคเสมอ"
                }
              ],
              [
                {
                  "text": "Dann",
                  "role": "sequence",
                  "label": "คำบอกลำดับ",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "habe",
                  "role": "auxiliary",
                  "label": "กริยาช่วย (ผันแล้ว)",
                  "position": "ตำแหน่ง 2 เสมอ"
                },
                {
                  "text": "ich",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "Freunde",
                  "role": "other",
                  "label": "ส่วนขยาย"
                },
                {
                  "text": "getroffen.",
                  "role": "participle",
                  "label": "กริยาหลัก · Partizip II",
                  "position": "ท้ายประโยคเสมอ"
                }
              ]
            ]
          }
        }
      ]
    },
    {
      "id": "L11-COMM-03",
      "objective": "L11-COMM-03",
      "title": "เปิดปิดและเริ่มเมื่อไร",
      "modelVisual": {
        "kind": "board",
        "theme": "calendar",
        "title": "เวลาเปิดคลินิก",
        "rows": [
          [
            "วัน",
            "จันทร์–ศุกร์"
          ],
          [
            "เวลา",
            "09:00–17:00"
          ]
        ]
      },
      "note": [
        "แยกข้อมูลวัน เวลาเปิด ปิด และเวลาเริ่มกิจกรรม",
        "am + วัน: am Mittwoch = วันพุธ",
        "um + เวลา: um acht Uhr = เวลา 8 โมง"
      ],
      "audio": "/audio/l11/model-l11-comm-03.m4a",
      "models": [
        {
          "question": "Wann ist die Praxis geöffnet?",
          "reply": "Von Montag bis Freitag, von neun bis siebzehn Uhr.",
          "questionMeaning": "คลินิกเปิดเมื่อไร",
          "replyMeaning": "ตั้งแต่วันจันทร์ถึงศุกร์ เวลาเก้าโมงถึงห้าโมงเย็น",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "เวลาเปิดคลินิก",
            "rows": [
              [
                "วัน",
                "จันทร์–ศุกร์"
              ],
              [
                "เวลา",
                "09:00–17:00"
              ]
            ]
          },
          "questionTeaching": {
            "focus": [
              "Wann"
            ],
            "structure": [
              "Wann ถามเวลา; ใช้คำตอบบอกวันและช่วงเวลา"
            ]
          },
          "replyTeaching": {
            "focus": [
              "Von Montag bis Freitag",
              "von neun bis siebzehn Uhr"
            ],
            "structure": [
              "von … bis … ใช้บอกช่วงเวลา: ตั้งแต่ … ถึง …"
            ]
          },
          "audio": "/audio/l11/model-l11-comm-03-card-01.m4a",
          "questionSentences": [
            [
              {
                "text": "Wann",
                "role": "question",
                "label": "ถามเวลา",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "ist",
                "role": "verb",
                "label": "กริยา sein (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "die Praxis",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "geöffnet?",
                "role": "other",
                "label": "สภาพ: เปิด"
              }
            ]
          ],
          "replySentences": [
            [
              {
                "text": "Von Montag bis Freitag,",
                "role": "time",
                "label": "ช่วงวัน"
              },
              {
                "text": "von neun bis siebzehn Uhr.",
                "role": "time",
                "label": "ช่วงเวลา"
              }
            ]
          ]
        },
        {
          "question": "Wann beginnt der Unterricht?",
          "reply": "Am Mittwoch um acht Uhr.",
          "questionMeaning": "ชั้นเรียนเริ่มเมื่อไร",
          "replyMeaning": "วันพุธตอนแปดโมง",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "เริ่มชั้นเรียน",
            "rows": [
              [
                "วัน",
                "พุธ"
              ],
              [
                "เวลา",
                "08:00"
              ]
            ]
          },
          "questionTeaching": {
            "focus": [
              "Wann"
            ],
            "structure": [
              "Wann ถามเวลาที่เริ่ม"
            ]
          },
          "replyTeaching": {
            "focus": [
              "Am Mittwoch",
              "um acht Uhr"
            ],
            "structure": [
              "am + วัน: am Mittwoch = วันพุธ",
              "um + เวลา: um acht Uhr = เวลา 8 โมง"
            ]
          },
          "audio": "/audio/l11/model-l11-comm-03-card-02.m4a",
          "questionSentences": [
            [
              {
                "text": "Wann",
                "role": "question",
                "label": "ถามเวลา",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "beginnt",
                "role": "verb",
                "label": "กริยาหลัก (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "der Unterricht?",
                "role": "subject",
                "label": "ประธาน"
              }
            ]
          ],
          "replySentences": [
            [
              {
                "text": "Am Mittwoch",
                "role": "time",
                "label": "วัน"
              },
              {
                "text": "um acht Uhr.",
                "role": "time",
                "label": "เวลา"
              }
            ]
          ]
        },
        {
          "question": "Wann ist die Praxis geschlossen?",
          "reply": "Am Samstag und am Sonntag.",
          "questionMeaning": "คลินิกปิดเมื่อไร",
          "replyMeaning": "วันเสาร์กับวันอาทิตย์",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "วันปิดคลินิก",
            "rows": [
              [
                "เสาร์",
                "ปิด"
              ],
              [
                "อาทิตย์",
                "ปิด"
              ]
            ]
          },
          "questionTeaching": {
            "focus": [
              "Wann"
            ],
            "structure": [
              "Wann ถามวันที่ปิด"
            ]
          },
          "replyTeaching": {
            "focus": [
              "Am Samstag",
              "am Sonntag"
            ],
            "structure": [
              "am + วัน: am Samstag / am Sonntag = วันเสาร์ / วันอาทิตย์"
            ]
          },
          "audio": "/audio/l11/model-l11-comm-03-card-03.m4a",
          "questionSentences": [
            [
              {
                "text": "Wann",
                "role": "question",
                "label": "ถามเวลา",
                "position": "ตำแหน่ง 1"
              },
              {
                "text": "ist",
                "role": "verb",
                "label": "กริยา sein (ผันแล้ว)",
                "position": "ตำแหน่ง 2"
              },
              {
                "text": "die Praxis",
                "role": "subject",
                "label": "ประธาน"
              },
              {
                "text": "geschlossen?",
                "role": "other",
                "label": "สภาพ: ปิด"
              }
            ]
          ],
          "replySentences": [
            [
              {
                "text": "Am Samstag",
                "role": "time",
                "label": "วันเสาร์"
              },
              {
                "text": "und",
                "role": "other",
                "label": "เชื่อมข้อมูล"
              },
              {
                "text": "am Sonntag.",
                "role": "time",
                "label": "วันอาทิตย์"
              }
            ]
          ]
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L11-COMM-03-D01-learn-v1",
          "kind": "choice",
          "prompt": "Wann ist die Praxis geöffnet?",
          "promptMeaning": "คลินิกเปิดเมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "เวลาเปิดคลินิก",
            "rows": [
              [
                "วัน",
                "จันทร์–ศุกร์"
              ],
              [
                "เวลา",
                "09:00–17:00"
              ]
            ]
          },
          "audio": null,
          "explanation": "ป้ายระบุวันเปิดและช่วงเวลาแยกกัน\nVon Montag bis Freitag = ตั้งแต่วันจันทร์ถึงวันศุกร์\nvon neun bis siebzehn Uhr = ตั้งแต่ 9 ถึง 17 นาฬิกา",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L11-COMM-03-D01-learn-v1-response",
            "targetId": "L11-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Von Montag bis Freitag, von neun bis siebzehn Uhr.",
            "meaning": "ตั้งแต่วันจันทร์ถึงศุกร์ เวลาเก้าโมงถึงห้าโมงเย็น"
          },
          "options": [
            "Am Samstag und am Sonntag.",
            "Von Montag bis Freitag, von neun bis siebzehn Uhr.",
            "Von Montag bis Freitag, von acht bis siebzehn Uhr."
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-03-d01.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Wann",
                  "role": "question",
                  "label": "ถามเวลา",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "ist",
                  "role": "verb",
                  "label": "กริยา sein (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "die Praxis",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "geöffnet?",
                  "role": "other",
                  "label": "สภาพ: เปิด"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Von Montag bis Freitag,",
                  "role": "time",
                  "label": "ช่วงวัน"
                },
                {
                  "text": "von neun bis siebzehn Uhr.",
                  "role": "time",
                  "label": "ช่วงเวลา"
                }
              ]
            ]
          }
        },
        {
          "id": "L11-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "Wann beginnt der Unterricht?",
          "promptMeaning": "ชั้นเรียนเริ่มเมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "เริ่มชั้นเรียน",
            "rows": [
              [
                "วัน",
                "พุธ"
              ],
              [
                "เวลา",
                "08:00"
              ]
            ]
          },
          "audio": null,
          "explanation": "am + วัน: am Mittwoch = วันพุธ\num + เวลา: um acht Uhr = เวลา 8 โมง",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L11-COMM-03-D02-learn-v1-response",
            "targetId": "L11-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Am Mittwoch um acht Uhr.",
            "meaning": "วันพุธตอนแปดโมง"
          },
          "options": [
            "Am Montag um acht Uhr.",
            "Am Mittwoch um neun Uhr.",
            "Am Mittwoch um acht Uhr."
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-03-d02.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Wann",
                  "role": "question",
                  "label": "ถามเวลา",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "beginnt",
                  "role": "verb",
                  "label": "กริยาหลัก (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "der Unterricht?",
                  "role": "subject",
                  "label": "ประธาน"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Am Mittwoch",
                  "role": "time",
                  "label": "วัน"
                },
                {
                  "text": "um acht Uhr.",
                  "role": "time",
                  "label": "เวลา"
                }
              ]
            ]
          }
        },
        {
          "id": "L11-COMM-03-D03-learn-v1",
          "kind": "choice",
          "prompt": "Wann ist die Praxis geschlossen?",
          "promptMeaning": "คลินิกปิดเมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "calendar",
            "title": "วันปิดคลินิก",
            "rows": [
              [
                "เสาร์",
                "ปิด"
              ],
              [
                "อาทิตย์",
                "ปิด"
              ]
            ]
          },
          "audio": null,
          "explanation": "โจทย์ถามวันปิด จึงเลือกวันเสาร์และวันอาทิตย์",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L11-COMM-03-D03-learn-v1-response",
            "targetId": "L11-COMM-03-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Am Samstag und am Sonntag.",
            "meaning": "วันเสาร์กับวันอาทิตย์"
          },
          "options": [
            "Am Samstag und am Sonntag.",
            "Am Montag und am Dienstag.",
            "Von Montag bis Freitag."
          ],
          "feedbackAudio": "/audio/l11/feedback-l11-comm-03-d03.m4a",
          "feedbackDialogue": {
            "question": [
              [
                {
                  "text": "Wann",
                  "role": "question",
                  "label": "ถามเวลา",
                  "position": "ตำแหน่ง 1"
                },
                {
                  "text": "ist",
                  "role": "verb",
                  "label": "กริยา sein (ผันแล้ว)",
                  "position": "ตำแหน่ง 2"
                },
                {
                  "text": "die Praxis",
                  "role": "subject",
                  "label": "ประธาน"
                },
                {
                  "text": "geschlossen?",
                  "role": "other",
                  "label": "สภาพ: ปิด"
                }
              ]
            ],
            "reply": [
              [
                {
                  "text": "Am Samstag",
                  "role": "time",
                  "label": "วันเสาร์"
                },
                {
                  "text": "und",
                  "role": "other",
                  "label": "เชื่อมข้อมูล"
                },
                {
                  "text": "am Sonntag.",
                  "role": "time",
                  "label": "วันอาทิตย์"
                }
              ]
            ]
          }
        },
        {
          "id": "L11-COMM-03-AUDIO-learn-v1",
          "kind": "choice",
          "prompt": "ฟังแล้วเลือกเวลาเริ่มเรียน",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l11/l11-comm-03-audio-learn-v1.m4a",
          "explanation": "ในเสียงบอกว่า Am Mittwoch um sieben Uhr. คำว่า um sieben Uhr หมายถึงเวลา 07:00",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "reply-options"
          ],
          "unit": {
            "id": "L11-COMM-03-AUDIO-learn-v1-response",
            "targetId": "L11-COMM-03-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "07:00",
            "meaning": "เริ่มเรียนเวลา 07:00"
          },
          "options": [
            "07:00",
            "08:00",
            "09:00"
          ]
        },
        {
          "id": "L11-COMM-03-PROFILE-learn-v1",
          "kind": "profile",
          "prompt": "อ่านแล้วเติมข้อมูล",
          "promptMeaning": "",
          "visual": {
            "kind": "reading",
            "text": "Die Praxis ist von Montag bis Freitag von 9 bis 17 Uhr geöffnet. Am Samstag und am Sonntag ist sie geschlossen."
          },
          "audio": null,
          "explanation": "von 9 bis 17 Uhr บอกช่วงเวลาเปิด: เปิดเวลา 9 นาฬิกา และปิดเวลา 17 นาฬิกา",
          "assistance": [
            "prior-model",
            "visible-reading"
          ],
          "fields": [
            {
              "label": "เวลาเปิด (ชั่วโมง)",
              "unit": {
                "id": "L11-COMM-03-PROFILE-learn-v1-open-response",
                "targetId": "L11-COMM-03-PROFILE-learn-v1-open-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "9",
                "meaning": "เปิดเวลา 9 นาฬิกา"
              }
            },
            {
              "label": "เวลาปิด (ชั่วโมง)",
              "unit": {
                "id": "L11-COMM-03-PROFILE-learn-v1-close-response",
                "targetId": "L11-COMM-03-PROFILE-learn-v1-close-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "17",
                "meaning": "ปิดเวลา 17 นาฬิกา"
              }
            }
          ]
        }
      ]
    }
  ],
  "L12": [
    {
      "id": "L12-COMM-01",
      "objective": "L12-COMM-01",
      "title": "ทริปที่ผ่านมา",
      "modelVisual": {
        "kind": "board",
        "theme": "transport",
        "title": "ทริปของ B",
        "rows": [
          [
            "เดินทางกับ",
            "ครอบครัว"
          ],
          [
            "ความรู้สึก",
            "ดีมาก"
          ]
        ]
      },
      "note": [
        "เล่าทริปทั้งคนที่ไปด้วย อากาศ และความรู้สึก",
        "ใช้ war / hatte เมื่อเล่าสภาพหรือประสบการณ์ในอดีต"
      ],
      "audio": "/audio/l12/model-l12-comm-01.m4a",
      "models": [
        {
          "question": "Wie war deine Reise?",
          "reply": "Ich war mit meiner Familie unterwegs. Es war schön.",
          "questionMeaning": "ทริปของเธอเป็นอย่างไรบ้าง",
          "replyMeaning": "ฉันเดินทางไปกับครอบครัว มันดีมาก",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ทริปของ B",
            "rows": [
              [
                "เดินทางกับ",
                "ครอบครัว"
              ],
              [
                "ความรู้สึก",
                "ดีมาก"
              ]
            ]
          }
        },
        {
          "question": "Wie war die Reise?",
          "reply": "Ich hatte Glück mit dem Wetter. Ich hatte viel Spaß.",
          "questionMeaning": "ทริปเป็นอย่างไรบ้าง",
          "replyMeaning": "ฉันโชคดีเรื่องอากาศ และสนุกมาก",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ทริปของ B",
            "rows": [
              [
                "อากาศ",
                "ดี"
              ],
              [
                "ความรู้สึก",
                "สนุก"
              ]
            ]
          }
        },
        {
          "question": "Ich glaube, du hattest Glück mit dem Wetter.",
          "reply": "Nein, das Wetter war nicht so schön.",
          "questionMeaning": "ฉันคิดว่าเธอคงโชคดีเรื่องอากาศ",
          "replyMeaning": "ไม่ อากาศไม่ค่อยดี",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ทริปของ B",
            "rows": [
              [
                "อากาศจริง",
                "ไม่ค่อยดี"
              ],
              [
                "A คิดว่า",
                "อากาศดี"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L12-COMM-01-D01-learn-v1",
          "kind": "order",
          "prompt": "Wie war deine Reise?",
          "promptMeaning": "ทริปของเธอเป็นอย่างไรบ้าง",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ทริปของ B",
            "rows": [
              [
                "เดินทางกับ",
                "ครอบครัว"
              ],
              [
                "ความรู้สึก",
                "ดีมาก"
              ]
            ]
          },
          "audio": null,
          "explanation": "ตอบทั้งเดินทางกับใครและความรู้สึกต่อทริปตามข้อมูล",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L12-COMM-01-D01-learn-v1-response",
            "targetId": "L12-COMM-01-D01-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich war mit meiner Familie unterwegs. Es war schön.",
            "meaning": "ฉันเดินทางไปกับครอบครัว มันดีมาก"
          },
          "tokens": [
            "war",
            "meiner",
            "unterwegs.",
            "war",
            "Ich",
            "mit",
            "Familie",
            "Es",
            "schön."
          ]
        },
        {
          "id": "L12-COMM-01-D02-learn-v1",
          "kind": "choice",
          "prompt": "Wie war die Reise?",
          "promptMeaning": "ทริปเป็นอย่างไรบ้าง",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ทริปของ B",
            "rows": [
              [
                "อากาศ",
                "ดี"
              ],
              [
                "ความรู้สึก",
                "สนุก"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ hatte Glück กับเรื่องอากาศ และ hatte viel Spaß กับความสนุก",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L12-COMM-01-D02-learn-v1-response",
            "targetId": "L12-COMM-01-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich hatte Glück mit dem Wetter. Ich hatte viel Spaß.",
            "meaning": "ฉันโชคดีเรื่องอากาศ และสนุกมาก"
          },
          "options": [
            "Ich hatte Pech mit dem Wetter.",
            "Ich hatte Glück mit dem Wetter. Ich hatte viel Spaß.",
            "Ich hatte keinen Spaß."
          ]
        },
        {
          "id": "L12-COMM-01-D03-learn-v1",
          "kind": "choice",
          "prompt": "Ich glaube, du hattest Glück mit dem Wetter.",
          "promptMeaning": "ฉันคิดว่าเธอคงโชคดีเรื่องอากาศ",
          "visual": {
            "kind": "board",
            "theme": "transport",
            "title": "ทริปของ B",
            "rows": [
              [
                "อากาศจริง",
                "ไม่ค่อยดี"
              ],
              [
                "A คิดว่า",
                "อากาศดี"
              ]
            ]
          },
          "audio": null,
          "explanation": "ความจริงอากาศไม่ดี จึงปฏิเสธการคาดเดาของ A",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L12-COMM-01-D03-learn-v1-response",
            "targetId": "L12-COMM-01-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Nein, das Wetter war nicht so schön.",
            "meaning": "ไม่ อากาศไม่ค่อยดี"
          },
          "options": [
            "Ja, das Wetter war sehr schön.",
            "Ich hatte Glück mit dem Wetter.",
            "Nein, das Wetter war nicht so schön."
          ]
        }
      ]
    },
    {
      "id": "L12-COMM-02",
      "objective": "L12-COMM-02",
      "title": "วันเกิดของคุณ",
      "modelVisual": {
        "kind": "board",
        "theme": "celebration",
        "title": "วันเกิดของ B",
        "rows": [
          [
            "เดือน",
            "มกราคม"
          ],
          [
            "อ้างอิงฤดูกาล",
            "เยอรมนี"
          ]
        ]
      },
      "note": [
        "im ตามด้วยเดือนหรือฤดูกาล",
        "ข้อมูลฤดูกาลในตัวอย่างอ้างอิงเยอรมนี"
      ],
      "audio": "/audio/l12/model-l12-comm-02.m4a",
      "models": [
        {
          "question": "Wann hast du Geburtstag?",
          "reply": "Ich habe im Januar Geburtstag, im Winter.",
          "questionMeaning": "วันเกิดของเธอเมื่อไร",
          "replyMeaning": "วันเกิดฉันอยู่ในเดือนมกราคม ในฤดูหนาว",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "วันเกิดของ B",
            "rows": [
              [
                "เดือน",
                "มกราคม"
              ],
              [
                "อ้างอิงฤดูกาล",
                "เยอรมนี"
              ]
            ]
          }
        },
        {
          "question": "Wann haben Sie Geburtstag?",
          "reply": "Ich habe im Mai Geburtstag.",
          "questionMeaning": "วันเกิดของคุณเมื่อไร",
          "replyMeaning": "วันเกิดฉันอยู่ในเดือนพฤษภาคม",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "วันเกิดของ B",
            "rows": [
              [
                "เดือน",
                "พฤษภาคม"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L12-COMM-02-D01-learn-v1",
          "kind": "choice",
          "prompt": "Wann hast du Geburtstag?",
          "promptMeaning": "วันเกิดของเธอเมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "วันเกิดของ B",
            "rows": [
              [
                "เดือน",
                "มกราคม"
              ],
              [
                "อ้างอิงฤดูกาล",
                "เยอรมนี"
              ]
            ]
          },
          "audio": null,
          "explanation": "มกราคมเป็นฤดูหนาวในเยอรมนี ใช้ im กับเดือนและฤดู",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L12-COMM-02-D01-learn-v1-response",
            "targetId": "L12-COMM-02-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich habe im Januar Geburtstag, im Winter.",
            "meaning": "วันเกิดฉันอยู่ในเดือนมกราคม ในฤดูหนาว"
          },
          "options": [
            "Ich habe im Mai Geburtstag, im Frühling.",
            "Ich habe im Januar Geburtstag, im Winter.",
            "Ich habe im Juli Geburtstag, im Sommer."
          ]
        },
        {
          "id": "L12-COMM-02-D02-learn-v1",
          "kind": "order",
          "prompt": "Wann haben Sie Geburtstag?",
          "promptMeaning": "วันเกิดของคุณเมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "วันเกิดของ B",
            "rows": [
              [
                "เดือน",
                "พฤษภาคม"
              ]
            ]
          },
          "audio": null,
          "explanation": "ตอบเดือนพฤษภาคมด้วย im Mai",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L12-COMM-02-D02-learn-v1-response",
            "targetId": "L12-COMM-02-D02-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich habe im Mai Geburtstag.",
            "meaning": "วันเกิดฉันอยู่ในเดือนพฤษภาคม"
          },
          "tokens": [
            "habe",
            "Mai",
            "Ich",
            "im",
            "Geburtstag."
          ]
        },
        {
          "id": "L12-COMM-02-AUDIO-learn-v1",
          "kind": "choice",
          "prompt": "ฟังแล้วเลือกเดือนเกิด",
          "promptMeaning": "",
          "visual": null,
          "audio": "/audio/l12/l12-comm-02-audio-learn-v1.m4a",
          "explanation": "ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ",
          "assistance": [
            "prior-model",
            "replayable-german-audio",
            "reply-options"
          ],
          "unit": {
            "id": "L12-COMM-02-AUDIO-learn-v1-response",
            "targetId": "L12-COMM-02-AUDIO-learn-v1-target",
            "subskill": "detail_listening",
            "difficulty": 3,
            "rationale": "ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้",
            "answer": "Im Juni.",
            "meaning": "เกิดเดือนมิถุนายน"
          },
          "options": [
            "Im Januar.",
            "Im Juni.",
            "Im Juli."
          ]
        }
      ]
    },
    {
      "id": "L12-COMM-03",
      "objective": "L12-COMM-03",
      "title": "คุยเรื่องเทศกาล",
      "modelVisual": {
        "kind": "board",
        "theme": "celebration",
        "title": "das Stadtfest",
        "rows": [
          [
            "เดือน",
            "พฤษภาคม"
          ],
          [
            "ระยะเวลา",
            "3 วัน"
          ]
        ]
      },
      "note": [
        "แยกเดือน ระยะเวลา ปีเริ่มจัด และจำนวนผู้ร่วมงาน",
        "seit ตามด้วยปีที่เริ่มมีงานนั้น"
      ],
      "audio": "/audio/l12/model-l12-comm-03.m4a",
      "models": [
        {
          "question": "Wann ist das Stadtfest und wie lange dauert es?",
          "reply": "Es ist im Mai und dauert drei Tage.",
          "questionMeaning": "งานเทศกาลเมืองจัดเมื่อไรและนานเท่าไร",
          "replyMeaning": "จัดเดือนพฤษภาคมและนานสามวัน",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "das Stadtfest",
            "rows": [
              [
                "เดือน",
                "พฤษภาคม"
              ],
              [
                "ระยะเวลา",
                "3 วัน"
              ]
            ]
          }
        },
        {
          "question": "Seit wann gibt es das Stadtfest?",
          "reply": "Das Stadtfest gibt es seit 2000.",
          "questionMeaning": "งานเทศกาลเมืองมีมาตั้งแต่เมื่อไร",
          "replyMeaning": "งานเทศกาลเมืองมีมาตั้งแต่ปี 2000",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "das Stadtfest",
            "rows": [
              [
                "เริ่มจัดครั้งแรก",
                "2000"
              ]
            ]
          }
        },
        {
          "question": "Wie viele Besucher hat das Fest?",
          "reply": "Es hat ungefähr tausend Besucher.",
          "questionMeaning": "งานเทศกาลนี้มีผู้มาเยือนกี่คน",
          "replyMeaning": "มีผู้มาเยือนประมาณหนึ่งพันคน",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "das Stadtfest",
            "rows": [
              [
                "ผู้มาเยือน",
                "ประมาณ 1,000 คน"
              ]
            ]
          }
        },
        {
          "question": "Wo hast du Weihnachten gefeiert?",
          "reply": "Ich habe Weihnachten in Düsseldorf gefeiert.",
          "questionMeaning": "เธอฉลองคริสต์มาสที่ไหน",
          "replyMeaning": "ฉันฉลองคริสต์มาสที่ดึสเซลดอร์ฟ",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "คริสต์มาสปีที่แล้วของ B",
            "rows": [
              [
                "เมืองที่ฉลอง",
                "Düsseldorf"
              ]
            ]
          }
        }
      ],
      "legacyIds": [],
      "tasks": [
        {
          "id": "L12-COMM-03-D01-learn-v1",
          "kind": "choice",
          "prompt": "Wann ist das Stadtfest und wie lange dauert es?",
          "promptMeaning": "งานเทศกาลเมืองจัดเมื่อไรและนานเท่าไร",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "das Stadtfest",
            "rows": [
              [
                "เดือน",
                "พฤษภาคม"
              ],
              [
                "ระยะเวลา",
                "3 วัน"
              ]
            ]
          },
          "audio": null,
          "explanation": "ข้อมูลกำหนดเดือนพฤษภาคมและระยะเวลาสามวัน ต้องตอบทั้งสองอย่าง",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L12-COMM-03-D01-learn-v1-response",
            "targetId": "L12-COMM-03-D01-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Es ist im Mai und dauert drei Tage.",
            "meaning": "จัดเดือนพฤษภาคมและนานสามวัน"
          },
          "options": [
            "Es ist im März und dauert drei Tage.",
            "Es ist im Mai und dauert zwei Tage.",
            "Es ist im Mai und dauert drei Tage."
          ]
        },
        {
          "id": "L12-COMM-03-D02-learn-v1",
          "kind": "choice",
          "prompt": "Seit wann gibt es das Stadtfest?",
          "promptMeaning": "งานเทศกาลเมืองมีมาตั้งแต่เมื่อไร",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "das Stadtfest",
            "rows": [
              [
                "เริ่มจัดครั้งแรก",
                "2000"
              ]
            ]
          },
          "audio": null,
          "explanation": "seit 2000 บอกว่ามีงานนี้มาตั้งแต่ปี 2000",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L12-COMM-03-D02-learn-v1-response",
            "targetId": "L12-COMM-03-D02-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Das Stadtfest gibt es seit 2000.",
            "meaning": "งานเทศกาลเมืองมีมาตั้งแต่ปี 2000"
          },
          "options": [
            "Das Stadtfest gibt es seit 2000.",
            "Das Stadtfest gibt es seit 2020.",
            "Das Stadtfest gibt es seit 2010."
          ]
        },
        {
          "id": "L12-COMM-03-D03-learn-v1",
          "kind": "choice",
          "prompt": "Wie viele Besucher hat das Fest?",
          "promptMeaning": "งานเทศกาลนี้มีผู้มาเยือนกี่คน",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "das Stadtfest",
            "rows": [
              [
                "ผู้มาเยือน",
                "ประมาณ 1,000 คน"
              ]
            ]
          },
          "audio": null,
          "explanation": "ungefähr บอกจำนวนโดยประมาณ ข้อมูลคือหนึ่งพันคน",
          "assistance": [
            "prior-model",
            "provided-context",
            "reply-options"
          ],
          "unit": {
            "id": "L12-COMM-03-D03-learn-v1-response",
            "targetId": "L12-COMM-03-D03-learn-v1-target",
            "subskill": "phrase_dialogue_response",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Es hat ungefähr tausend Besucher.",
            "meaning": "มีผู้มาเยือนประมาณหนึ่งพันคน"
          },
          "options": [
            "Es hat ungefähr hundert Besucher.",
            "Es hat ungefähr tausend Besucher.",
            "Es hat ungefähr zehntausend Besucher."
          ]
        },
        {
          "id": "L12-COMM-03-D04-learn-v1",
          "kind": "order",
          "prompt": "Wo hast du Weihnachten gefeiert?",
          "promptMeaning": "เธอฉลองคริสต์มาสที่ไหน",
          "visual": {
            "kind": "board",
            "theme": "celebration",
            "title": "คริสต์มาสปีที่แล้วของ B",
            "rows": [
              [
                "เมืองที่ฉลอง",
                "Düsseldorf"
              ]
            ]
          },
          "audio": null,
          "explanation": "ใช้ habe … gefeiert เล่าเหตุการณ์ที่ผ่านมา และ in Düsseldorf บอกเมือง",
          "assistance": [
            "prior-model",
            "provided-context",
            "supplied-words"
          ],
          "unit": {
            "id": "L12-COMM-03-D04-learn-v1-response",
            "targetId": "L12-COMM-03-D04-learn-v1-target",
            "subskill": "phrase_word_order",
            "difficulty": 2,
            "rationale": "ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ",
            "answer": "Ich habe Weihnachten in Düsseldorf gefeiert.",
            "meaning": "ฉันฉลองคริสต์มาสที่ดึสเซลดอร์ฟ"
          },
          "tokens": [
            "habe",
            "in",
            "gefeiert.",
            "Ich",
            "Weihnachten",
            "Düsseldorf"
          ]
        },
        {
          "id": "L12-COMM-03-PROFILE-learn-v1",
          "kind": "profile",
          "prompt": "อ่านแล้วเติมข้อมูล",
          "promptMeaning": "",
          "visual": {
            "kind": "reading",
            "text": "Das Stadtfest ist im Mai. Es dauert drei Tage. Das Fest gibt es seit 2000."
          },
          "audio": null,
          "explanation": "หาข้อมูลเฉพาะของแต่ละช่องจากข้อความ โดยเก็บผลแยกกัน",
          "assistance": [
            "prior-model",
            "visible-reading"
          ],
          "fields": [
            {
              "label": "เดือนที่จัดงาน",
              "unit": {
                "id": "L12-COMM-03-PROFILE-learn-v1-month-response",
                "targetId": "L12-COMM-03-PROFILE-learn-v1-month-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "Mai",
                "meaning": "จัดเดือนพฤษภาคม"
              }
            },
            {
              "label": "ปีที่เริ่มจัดงาน",
              "unit": {
                "id": "L12-COMM-03-PROFILE-learn-v1-year-response",
                "targetId": "L12-COMM-03-PROFILE-learn-v1-year-target",
                "subskill": "information_reading",
                "difficulty": 2,
                "rationale": "อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ",
                "answer": "2000",
                "meaning": "เริ่มจัดตั้งแต่ปี 2000"
              }
            }
          ]
        }
      ]
    }
  ]
};
