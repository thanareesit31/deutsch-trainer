import type { DialogueTopic } from "@/lib/phrase-dialogue-learning";
export const l02PhraseDiscovery = [
  {
    "id": "work",
    "title": "อาชีพและที่ทำงาน",
    "objective": "L02-COMM-01",
    "note": [
      "als ตามด้วยอาชีพ ส่วน bei ตามด้วยชื่อที่ทำงาน",
      "ใช้ du กับคนที่คุยกันเอง และ Sie เมื่อพูดสุภาพ"
    ],
    "models": [
      {
        "question": "Was machst du beruflich?",
        "reply": "Ich arbeite als Friseurin. Ich arbeite bei Haarfit.",
        "questionMeaning": "เธอทำงานอะไร",
        "replyMeaning": "ฉันทำงานเป็นช่างทำผม ฉันทำงานที่ร้านฮาร์ฟิต"
      },
      {
        "question": "Was machen Sie beruflich?",
        "reply": "Ich bin Lehrerin.",
        "questionMeaning": "คุณทำงานอะไร",
        "replyMeaning": "ฉันเป็นครู"
      }
    ],
    "audio": "/audio/l02/model-work.m4a",
    "legacyIds": [
      "L02-pattern-profession"
    ],
    "tasks": [
      {
        "id": "L02-UX-PROF-01",
        "kind": "choice",
        "prompt": "Was macht ihr beruflich?",
        "promptMeaning": "พวกเธอทำงานอะไร",
        "visual": {
          "kind": "image",
          "src": "/images/lektion-2-profession-pairs/hairdresser.webp",
          "alt": "ช่างทำผมสองคนถืออุปกรณ์ทำผม",
          "caption": "ทั้งคู่ทำงานที่ร้าน Haarfit"
        },
        "audio": null,
        "explanation": "ถามอาชีพของคนสองคน จึงตอบด้วย Wir arbeiten als …",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-PROF-01-response",
          "targetId": "L02-UX-PROF-01-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Wir arbeiten als Friseure.",
          "meaning": "พวกเราทำงานเป็นช่างทำผม"
        },
        "options": [
          "Wir wohnen in Berlin.",
          "Wir arbeiten als Friseure.",
          "Wir kommen aus Thailand."
        ]
      },
      {
        "id": "L02-UX-WORK-01",
        "kind": "order",
        "prompt": "Wo arbeitest du?",
        "promptMeaning": "เธอทำงานที่ไหน",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora"
            ],
            [
              "สถานที่ทำงาน",
              "Haarfit"
            ]
          ]
        },
        "audio": null,
        "explanation": "ใช้ bei ตามด้วยชื่อสถานที่ทำงาน ส่วน als ใช้บอกอาชีพ",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L02-UX-WORK-01-response",
          "targetId": "L02-UX-WORK-01-target",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich arbeite bei Haarfit.",
          "meaning": "ฉันทำงานที่ร้านฮาร์ฟิต"
        },
        "tokens": [
          "bei",
          "Haarfit.",
          "Ich",
          "arbeite"
        ]
      },
      {
        "id": "L02-UX-PROF-02",
        "kind": "choice",
        "prompt": "Was machen Sie beruflich?",
        "promptMeaning": "คุณทำงานอะไร",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Mali"
            ],
            [
              "อาชีพ",
              "ครูผู้หญิง"
            ]
          ]
        },
        "audio": null,
        "explanation": "คำถามแบบสุภาพถามอาชีพของคุณ ตอบด้วย Ich bin … ได้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-PROF-02-response",
          "targetId": "L02-UX-PROF-02-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich bin Lehrerin.",
          "meaning": "ฉันเป็นครู"
        },
        "options": [
          "Ich heiße Nora.",
          "Ich wohne in Berlin.",
          "Ich bin Lehrerin."
        ]
      }
    ],
    "modelVisual": {
      "kind": "image",
      "src": "/images/lektion-2-profession-pairs/hairdresser.webp",
      "alt": "ช่างทำผมในร้าน",
      "caption": "ตัวอย่างสถานที่ทำงาน: ร้านทำผม"
    }
  },
  {
    "id": "status",
    "title": "สถานะการทำงาน",
    "objective": "L02-COMM-01",
    "note": [
      "Ich mache ein Praktikum. = ฉันกำลังฝึกงาน",
      "Ich bin angestellt. = ฉันเป็นลูกจ้าง",
      "Ich bin freiberuflich. / Ich bin selbstständig. = ฉันทำงานอิสระ",
      "Ich bin arbeitslos. = ฉันว่างงาน ส่วน Ich arbeite nicht. = ฉันไม่ได้ทำงาน"
    ],
    "models": [
      {
        "question": "Was machst du beruflich?",
        "reply": "Ich mache ein Praktikum.",
        "questionMeaning": "เธอทำงานอะไร",
        "replyMeaning": "ฉันกำลังฝึกงาน"
      },
      {
        "question": "Und du?",
        "reply": "Ich bin angestellt.",
        "questionMeaning": "แล้วเธอล่ะ",
        "replyMeaning": "ฉันเป็นลูกจ้าง"
      },
      {
        "question": "Arbeitest du?",
        "reply": "Ich arbeite im Moment nicht.",
        "questionMeaning": "เธอทำงานหรือเปล่า",
        "replyMeaning": "ตอนนี้ฉันไม่ได้ทำงาน"
      }
    ],
    "audio": "/audio/l02/model-status.m4a",
    "legacyIds": [
      "L02-status-praktikum",
      "L02-status-arbeitslos",
      "L02-status-nicht-arbeiten",
      "L02-status-freiberuflich",
      "L02-status-selbststaendig",
      "L02-status-angestellt"
    ],
    "tasks": [
      {
        "id": "L02-UX-STATUS-01",
        "kind": "choice",
        "prompt": "Was machst du im Moment?",
        "promptMeaning": "ช่วงนี้เธอทำอะไร",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Tim"
            ],
            [
              "ตอนนี้",
              "กำลังฝึกงาน"
            ]
          ]
        },
        "audio": null,
        "explanation": "สถานการณ์กำหนดว่ากำลังฝึกงาน จึงใช้ mache ein Praktikum",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-STATUS-01-response",
          "targetId": "L02-UX-STATUS-01-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich mache ein Praktikum.",
          "meaning": "ฉันกำลังฝึกงาน"
        },
        "options": [
          "Ich mache ein Praktikum.",
          "Ich bin arbeitslos.",
          "Ich bin verheiratet."
        ]
      },
      {
        "id": "L02-UX-STATUS-02",
        "kind": "choice",
        "prompt": "Wie arbeitest du?",
        "promptMeaning": "เธอทำงานแบบไหน",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora"
            ],
            [
              "การทำงาน",
              "เป็นลูกจ้างบริษัท"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลระบุว่าเป็นพนักงานของบริษัท จึงตอบ angestellt",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-STATUS-02-response",
          "targetId": "L02-UX-STATUS-02-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich bin angestellt.",
          "meaning": "ฉันเป็นลูกจ้าง"
        },
        "options": [
          "Ich bin Single.",
          "Ich bin angestellt.",
          "Ich mache ein Praktikum."
        ]
      },
      {
        "id": "L02-UX-STATUS-03",
        "kind": "order",
        "prompt": "Arbeitest du im Moment?",
        "promptMeaning": "ตอนนี้เธอทำงานไหม",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Tim"
            ],
            [
              "ตอนนี้",
              "ไม่ได้ทำงาน"
            ]
          ]
        },
        "audio": null,
        "explanation": "วางกริยา arbeite หลัง Ich และใช้ nicht ปฏิเสธการทำงานในประโยคนี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L02-UX-STATUS-03-response",
          "targetId": "L02-UX-STATUS-03-target",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich arbeite im Moment nicht.",
          "meaning": "ตอนนี้ฉันไม่ได้ทำงาน"
        },
        "tokens": [
          "nicht.",
          "Moment",
          "Ich",
          "im",
          "arbeite"
        ]
      }
    ],
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ตัวอย่างที่ 1",
          "กำลังฝึกงาน"
        ],
        [
          "ตัวอย่างที่ 2",
          "เป็นลูกจ้าง"
        ],
        [
          "ตัวอย่างที่ 3",
          "ตอนนี้ไม่ได้ทำงาน"
        ]
      ]
    }
  },
  {
    "id": "age",
    "title": "ถามและบอกอายุ",
    "objective": "L02-COMM-03",
    "note": [
      "Wie alt bist du? ใช้ถามอายุ",
      "บอกอายุด้วย Ich bin … Jahre alt."
    ],
    "models": [
      {
        "question": "Wie alt bist du?",
        "reply": "Ich bin vierundzwanzig Jahre alt.",
        "questionMeaning": "เธออายุเท่าไร",
        "replyMeaning": "ฉันอายุ 24 ปี"
      }
    ],
    "audio": "/audio/l02/model-age.m4a",
    "legacyIds": [],
    "tasks": [
      {
        "id": "L02-UX-AGE-AUDIO-01",
        "kind": "digits",
        "prompt": "ฟังแล้วใส่อายุ",
        "promptMeaning": "",
        "visual": null,
        "audio": "/audio/l02/l02-ux-age-audio-01.m4a",
        "explanation": "ในเสียงตอบ einunddreißig จึงใส่ 31",
        "assistance": [
          "prior-model",
          "replayable-two-speaker-audio"
        ],
        "unit": {
          "id": "L02-UX-AGE-AUDIO-01-response",
          "targetId": "L02-UX-AGE-AUDIO-01-target",
          "subskill": "age_listening",
          "difficulty": 3,
          "rationale": "ฟังข้อมูลที่ไม่มีคำตอบเขียนให้ แล้วใส่ตัวเลข; มีเสียงซ้ำและตัวอย่างก่อนหน้า",
          "answer": "31",
          "meaning": "อายุ 31 ปี"
        },
        "maxLength": 3,
        "label": "อายุ"
      },
      {
        "id": "L02-UX-AGE-ORDER-01",
        "kind": "order",
        "prompt": "Wie alt bist du?",
        "promptMeaning": "เธออายุเท่าไร",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora"
            ],
            [
              "อายุ",
              "28"
            ]
          ]
        },
        "audio": null,
        "explanation": "เริ่มด้วย Ich bin ตามด้วยอายุ แล้วจบด้วย Jahre alt",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L02-UX-AGE-ORDER-01-response",
          "targetId": "L02-UX-AGE-ORDER-01-target",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich bin 28 Jahre alt.",
          "meaning": "ฉันอายุ 28 ปี"
        },
        "tokens": [
          "alt.",
          "28",
          "bin",
          "Jahre",
          "Ich"
        ]
      }
    ],
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "อายุผู้ตอบ B",
          "24"
        ]
      ]
    }
  },
  {
    "id": "home",
    "title": "อาศัยอยู่ที่ไหน",
    "objective": "L02-COMM-02",
    "note": [
      "Wo wohnst du? ถามคนเดียว ตอบ Ich wohne in …",
      "Wo wohnt ihr? ถามหลายคน ตอบ Wir wohnen in …"
    ],
    "models": [
      {
        "question": "Wo wohnst du?",
        "reply": "Ich wohne in München.",
        "questionMeaning": "เธออาศัยอยู่ที่ไหน",
        "replyMeaning": "ฉันอาศัยอยู่ที่มิวนิก"
      },
      {
        "question": "Wo wohnt ihr?",
        "reply": "Wir wohnen in Berlin.",
        "questionMeaning": "พวกเธออาศัยอยู่ที่ไหน",
        "replyMeaning": "พวกเราอาศัยอยู่ที่เบอร์ลิน"
      }
    ],
    "audio": "/audio/l02/model-home.m4a",
    "legacyIds": [],
    "tasks": [
      {
        "id": "L02-UX-HOME-01",
        "kind": "order",
        "prompt": "Wo wohnst du?",
        "promptMeaning": "เธออาศัยอยู่ที่ไหน",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora"
            ],
            [
              "เมืองที่อาศัยอยู่",
              "Bangkok"
            ]
          ]
        },
        "audio": null,
        "explanation": "ใช้ in ตามด้วยชื่อเมืองเพื่อบอกที่อยู่อาศัย",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L02-UX-HOME-01-response",
          "targetId": "L02-UX-HOME-01-target",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich wohne in Bangkok.",
          "meaning": "ฉันอาศัยอยู่ที่กรุงเทพฯ"
        },
        "tokens": [
          "Bangkok.",
          "wohne",
          "Ich",
          "in"
        ]
      },
      {
        "id": "L02-UX-HOME-02",
        "kind": "choice",
        "prompt": "Wo wohnt ihr?",
        "promptMeaning": "พวกเธออาศัยอยู่ที่ไหน",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora + Tim"
            ],
            [
              "เมืองที่อาศัยอยู่",
              "Berlin"
            ]
          ]
        },
        "audio": null,
        "explanation": "ผู้ถามใช้ ihr ถามคนสองคน ผู้ตอบจึงใช้ Wir",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-HOME-02-response",
          "targetId": "L02-UX-HOME-02-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Wir wohnen in Berlin.",
          "meaning": "พวกเราอาศัยอยู่ที่เบอร์ลิน"
        },
        "options": [
          "Ich heiße Tim.",
          "Wir wohnen in Berlin.",
          "Wir kommen aus Thailand."
        ]
      }
    ],
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ตัวอย่างคนเดียว",
          "München"
        ],
        [
          "ตัวอย่างเป็นคู่",
          "Berlin"
        ]
      ]
    }
  },
  {
    "id": "couple",
    "title": "ชีวิตคู่และลูก",
    "objective": "L02-COMM-04",
    "note": [
      "อยู่ด้วยกัน แต่งงาน และมีลูก เป็นคนละข้อมูล",
      "nicht ปฏิเสธ verheiratet; keine Kinder บอกว่าไม่มีลูก"
    ],
    "models": [
      {
        "question": "Lebt ihr zusammen?",
        "reply": "Ja, wir leben zusammen.",
        "questionMeaning": "พวกเธออยู่ด้วยกันไหม",
        "replyMeaning": "ใช่ พวกเราอยู่ด้วยกัน"
      },
      {
        "question": "Seid ihr verheiratet?",
        "reply": "Nein, wir sind nicht verheiratet.",
        "questionMeaning": "พวกเธอแต่งงานกันแล้วไหม",
        "replyMeaning": "ไม่ พวกเราไม่ได้แต่งงานกัน"
      },
      {
        "question": "Habt ihr Kinder?",
        "reply": "Nein, wir haben keine Kinder.",
        "questionMeaning": "พวกเธอมีลูกไหม",
        "replyMeaning": "ไม่ พวกเราไม่มีลูก"
      }
    ],
    "audio": "/audio/l02/model-couple.m4a",
    "legacyIds": [],
    "tasks": [
      {
        "id": "L02-UX-TOGETHER-01",
        "kind": "choice",
        "prompt": "Lebt ihr zusammen?",
        "promptMeaning": "พวกเธออยู่ด้วยกันไหม",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora + Tim"
            ],
            [
              "อยู่ด้วยกัน",
              "ใช่"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลระบุว่าอยู่ด้วยกัน จึงตอบ Ja, wir leben zusammen.",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-TOGETHER-01-response",
          "targetId": "L02-UX-TOGETHER-01-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ja, wir leben zusammen.",
          "meaning": "ใช่ พวกเราอยู่ด้วยกัน"
        },
        "options": [
          "Nein, wir leben nicht zusammen.",
          "Ja, wir leben zusammen.",
          "Wir sind verheiratet."
        ]
      },
      {
        "id": "L02-UX-COUPLE-01",
        "kind": "choice",
        "prompt": "Seid ihr verheiratet?",
        "promptMeaning": "พวกเธอแต่งงานกันแล้วไหม",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora + Tim"
            ],
            [
              "อยู่ด้วยกัน",
              "ใช่"
            ],
            [
              "แต่งงานแล้ว",
              "ไม่ใช่"
            ]
          ]
        },
        "audio": null,
        "explanation": "การอยู่ด้วยกันไม่ได้แปลว่าแต่งงาน ข้อมูลคู่นี้ระบุว่ายังไม่ได้แต่งงาน",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-COUPLE-01-response",
          "targetId": "L02-UX-COUPLE-01-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Nein, wir sind nicht verheiratet.",
          "meaning": "ไม่ พวกเราไม่ได้แต่งงานกัน"
        },
        "options": [
          "Ja, wir sind verheiratet.",
          "Nein, wir sind nicht verheiratet.",
          "Wir wohnen in Berlin."
        ]
      },
      {
        "id": "L02-UX-CHILDREN-01",
        "kind": "order",
        "prompt": "Habt ihr Kinder?",
        "promptMeaning": "พวกเธอมีลูกไหม",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Nora + Tim"
            ],
            [
              "มีลูก",
              "ไม่มี"
            ]
          ]
        },
        "audio": null,
        "explanation": "ใช้ keine กับ Kinder เพื่อบอกว่าไม่มีลูก",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L02-UX-CHILDREN-01-response",
          "targetId": "L02-UX-CHILDREN-01-target",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Wir haben keine Kinder.",
          "meaning": "พวกเราไม่มีลูก"
        },
        "tokens": [
          "Kinder.",
          "haben",
          "Wir",
          "keine"
        ]
      }
    ],
    "modelVisual": {
      "kind": "image",
      "src": "/images/lektion-2-vocabulary/zusammenleben-v2.webp",
      "alt": "คนสองคนใช้ชีวิตร่วมกัน",
      "caption": "Nora และ Tim อยู่ด้วยกัน"
    }
  },
  {
    "id": "dream",
    "title": "อาชีพในฝัน",
    "objective": "L02-COMM-01",
    "note": [
      "beruflich ถามงานปัจจุบัน ส่วนคำว่าอาชีพในฝันถามงานที่อยากทำ",
      "อาชีพปัจจุบันกับอาชีพในฝันอาจเป็นคนละอาชีพ"
    ],
    "models": [
      {
        "question": "Was machst du beruflich?",
        "reply": "Ich arbeite als Verkäufer.",
        "questionMeaning": "เธอทำงานอะไร",
        "replyMeaning": "ฉันทำงานเป็นพนักงานขาย"
      },
      {
        "question": "Und was ist dein Traumberuf?",
        "reply": "Mein Traumberuf ist Arzt.",
        "questionMeaning": "แล้วอาชีพในฝันของเธอคืออะไร",
        "replyMeaning": "อาชีพในฝันของฉันคือหมอ"
      }
    ],
    "audio": "/audio/l02/model-dream.m4a",
    "legacyIds": [
      "L02-traumberuf"
    ],
    "tasks": [
      {
        "id": "L02-UX-DREAM-01",
        "kind": "choice",
        "prompt": "Was ist dein Traumberuf?",
        "promptMeaning": "อาชีพในฝันของเธอคืออะไร",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Tim"
            ],
            [
              "งานปัจจุบัน",
              "พนักงานขาย"
            ],
            [
              "อาชีพในฝัน",
              "หมอ"
            ]
          ]
        },
        "audio": null,
        "explanation": "คำถามถามงานที่อยากทำ จึงตอบอาชีพในฝัน ไม่ใช่งานปัจจุบัน",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-DREAM-01-response",
          "targetId": "L02-UX-DREAM-01-target",
          "subskill": "current_vs_dream_meaning",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Mein Traumberuf ist Arzt.",
          "meaning": "อาชีพในฝันของฉันคือหมอ"
        },
        "options": [
          "Ich arbeite als Verkäufer.",
          "Mein Traumberuf ist Arzt.",
          "Ich wohne in Berlin."
        ]
      },
      {
        "id": "L02-UX-DREAM-02",
        "kind": "choice",
        "prompt": "Was machst du beruflich?",
        "promptMeaning": "เธอทำงานอะไร",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ผู้ตอบ B",
              "Tim"
            ],
            [
              "งานปัจจุบัน",
              "พนักงานขาย"
            ],
            [
              "อาชีพในฝัน",
              "หมอ"
            ]
          ]
        },
        "audio": null,
        "explanation": "beruflich ถามงานปัจจุบัน ข้อมูลบอกว่า Tim เป็นพนักงานขาย",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-DREAM-02-response",
          "targetId": "L02-UX-DREAM-02-target",
          "subskill": "current_vs_dream_meaning",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Ich arbeite als Verkäufer.",
          "meaning": "ฉันทำงานเป็นพนักงานขาย"
        },
        "options": [
          "Mein Traumberuf ist Arzt.",
          "Ich arbeite als Verkäufer.",
          "Ich bin 28 Jahre alt."
        ]
      }
    ],
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "งานปัจจุบัน",
          "พนักงานขาย"
        ],
        [
          "อาชีพในฝัน",
          "หมอ"
        ]
      ]
    }
  },
  {
    "id": "contact",
    "title": "ติดต่อและแนะนำตัว",
    "objective": "L02-COMM-05",
    "note": [
      "Wie ist deine Handynummer? ใช้ถามเบอร์โทรศัพท์มือถือ",
      "ฟังตัวเลขทีละตัว อย่าสลับลำดับ",
      "แนะนำตัวโดยเลือกข้อมูลชื่อ อายุ เมือง และงานที่ต้องการบอก"
    ],
    "models": [
      {
        "question": "Wie ist deine Handynummer?",
        "reply": "Meine Handynummer ist null eins zwei drei vier fünf sechs.",
        "questionMeaning": "เบอร์มือถือของเธอคืออะไร",
        "replyMeaning": "เบอร์มือถือของฉันคือ 0123456"
      }
    ],
    "audio": "/audio/l02/model-contact.m4a",
    "legacyIds": [
      "L02-pattern-phone"
    ],
    "tasks": [
      {
        "id": "L02-UX-PHONE-QUESTION-01",
        "kind": "choice",
        "prompt": "เลือกคำถามเพื่อขอเบอร์มือถือ",
        "promptMeaning": "",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ต้องการทราบ",
              "เบอร์โทรศัพท์มือถือ"
            ]
          ]
        },
        "audio": null,
        "explanation": "คำถามนี้ถามเบอร์โทรศัพท์มือถือ จึงใช้ขอข้อมูลติดต่อ",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L02-UX-PHONE-QUESTION-01-response",
          "targetId": "L02-UX-PHONE-QUESTION-01-target",
          "subskill": "phrase_dialogue_response",
          "difficulty": 2,
          "rationale": "ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ",
          "answer": "Wie ist deine Handynummer?",
          "meaning": "เบอร์มือถือของเธอคืออะไร"
        },
        "options": [
          "Wie alt bist du?",
          "Wo wohnst du?",
          "Wie ist deine Handynummer?"
        ]
      },
      {
        "id": "L02-UX-PHONE-01",
        "kind": "digits",
        "prompt": "ฟังแล้วใส่เบอร์มือถือ",
        "promptMeaning": "",
        "visual": null,
        "audio": "/audio/l02/l02-ux-phone-01.m4a",
        "explanation": "ฟังเลขทีละตัวและคงเลข 0 ตัวหน้าไว้",
        "assistance": [
          "prior-model",
          "replayable-two-speaker-audio"
        ],
        "unit": {
          "id": "L02-UX-PHONE-01-response",
          "targetId": "L02-UX-PHONE-01-target",
          "subskill": "phone_digit_listening",
          "difficulty": 3,
          "rationale": "ฟังข้อมูลที่ไม่มีคำตอบเขียนให้ แล้วใส่ตัวเลข; มีเสียงซ้ำและตัวอย่างก่อนหน้า",
          "answer": "0301234567",
          "meaning": "เบอร์ที่ได้ยินคือ 0301234567"
        },
        "maxLength": 15,
        "label": "เบอร์มือถือ"
      },
      {
        "id": "L02-UX-PROFILE-01",
        "kind": "profile",
        "prompt": "เติมข้อมูลของ Nora",
        "promptMeaning": "",
        "visual": {
          "kind": "reading",
          "text": "Ich heiße Nora. Ich bin 28 Jahre alt. Ich wohne in Berlin. Ich arbeite bei Haarfit."
        },
        "audio": null,
        "explanation": "Jahre alt บอกอายุ ส่วน wohne in บอกเมือง และ arbeite bei บอกที่ทำงาน",
        "assistance": [
          "prior-model",
          "visible-reading"
        ],
        "fields": [
          {
            "label": "อายุ",
            "unit": {
              "id": "L02-UX-PROFILE-01-age",
              "targetId": "L02-UX-PROFILE-01-age-target",
              "subskill": "person_detail_reading",
              "difficulty": 2,
              "rationale": "อ่านหาข้อมูลแต่ละฟิลด์จากข้อความ; แยกหลักฐานรายช่อง ไม่ใช่การฟังหรือผลิตภาษา",
              "answer": "28",
              "meaning": "อายุ 28 ปี"
            }
          },
          {
            "label": "เมืองที่อาศัยอยู่",
            "unit": {
              "id": "L02-UX-PROFILE-01-home",
              "targetId": "L02-UX-PROFILE-01-home-target",
              "subskill": "person_detail_reading",
              "difficulty": 2,
              "rationale": "อ่านหาข้อมูลแต่ละฟิลด์จากข้อความ; แยกหลักฐานรายช่อง ไม่ใช่การฟังหรือผลิตภาษา",
              "answer": "Berlin",
              "meaning": "อาศัยอยู่ที่เบอร์ลิน"
            }
          },
          {
            "label": "สถานที่ทำงาน",
            "unit": {
              "id": "L02-UX-PROFILE-01-work",
              "targetId": "L02-UX-PROFILE-01-work-target",
              "subskill": "person_detail_reading",
              "difficulty": 2,
              "rationale": "อ่านหาข้อมูลแต่ละฟิลด์จากข้อความ; แยกหลักฐานรายช่อง ไม่ใช่การฟังหรือผลิตภาษา",
              "answer": "Haarfit",
              "meaning": "ทำงานที่ร้านฮาร์ฟิต"
            }
          }
        ]
      }
    ],
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "เบอร์ตัวอย่าง",
          "0123456"
        ]
      ]
    }
  }
] satisfies readonly DialogueTopic[];
