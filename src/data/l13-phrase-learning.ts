import type { DialogueTopic } from "@/lib/phrase-dialogue-learning";
export const l13PhraseLearning: readonly DialogueTopic[] = [
  {
    "id": "L13-R001",
    "objective": "L13-R001",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ความรู้สึกต่อ Berlin",
          "ชอบ"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Berlin gefällt mir.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันชอบเบอร์ลิน",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความรู้สึกต่อ Berlin",
              "ชอบ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R001"
    ],
    "tasks": [
      {
        "id": "L13-R001-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความรู้สึกต่อ Berlin",
              "ชอบ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ความรู้สึกต่อ Berlin คือ ชอบ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R001-learn-dialogue-v1-response",
          "targetId": "L13-R001",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Berlin gefällt mir.",
          "meaning": "ฉันชอบเบอร์ลิน"
        },
        "options": [
          "Ich liebe die Natur.",
          "Berlin gefällt mir.",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R002",
    "objective": "L13-R002",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ความรู้สึกต่อ Berlin",
          "ชอบมาก"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Berlin gefällt mir sehr.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันชอบเบอร์ลินมาก",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความรู้สึกต่อ Berlin",
              "ชอบมาก"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R002"
    ],
    "tasks": [
      {
        "id": "L13-R002-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความรู้สึกต่อ Berlin",
              "ชอบมาก"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ความรู้สึกต่อ Berlin คือ ชอบมาก จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R002-learn-dialogue-v1-response",
          "targetId": "L13-R002",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Berlin gefällt mir sehr.",
          "meaning": "ฉันชอบเบอร์ลินมาก"
        },
        "options": [
          "Ich liebe die Natur.",
          "Berlin gefällt mir sehr.",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R003",
    "objective": "L13-R003",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "B ชี้ไปที่สวน",
          "ชอบสิ่งนี้เป็นพิเศษ"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Das gefällt mir besonders gut.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันชอบสิ่งนั้นเป็นพิเศษ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "B ชี้ไปที่สวน",
              "ชอบสิ่งนี้เป็นพิเศษ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R003"
    ],
    "tasks": [
      {
        "id": "L13-R003-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "B ชี้ไปที่สวน",
              "ชอบสิ่งนี้เป็นพิเศษ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า B ชี้ไปที่สวน คือ ชอบสิ่งนี้เป็นพิเศษ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R003-learn-dialogue-v1-response",
          "targetId": "L13-R003",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Das gefällt mir besonders gut.",
          "meaning": "ฉันชอบสิ่งนั้นเป็นพิเศษ"
        },
        "options": [
          "Ich liebe die Natur.",
          "Das gefällt mir besonders gut.",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R004",
    "objective": "L13-R004",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ความคิดเห็นต่อเมือง",
          "เยี่ยมมาก"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Ich finde die Stadt toll.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันคิดว่าเมืองนี้ยอดเยี่ยม",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความคิดเห็นต่อเมือง",
              "เยี่ยมมาก"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R004"
    ],
    "tasks": [
      {
        "id": "L13-R004-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความคิดเห็นต่อเมือง",
              "เยี่ยมมาก"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ความคิดเห็นต่อเมือง คือ เยี่ยมมาก จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R004-learn-dialogue-v1-response",
          "targetId": "L13-R004",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Ich finde die Stadt toll.",
          "meaning": "ฉันคิดว่าเมืองนี้ยอดเยี่ยม"
        },
        "options": [
          "Ich liebe die Natur.",
          "Ich finde die Stadt toll.",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R005",
    "objective": "L13-R005",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ความคิดเห็นต่อ Berlin",
          "น่าสนใจ"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Ich finde Berlin interessant.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันคิดว่าเบอร์ลินน่าสนใจ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความคิดเห็นต่อ Berlin",
              "น่าสนใจ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R005"
    ],
    "tasks": [
      {
        "id": "L13-R005-learn-dialogue-v1",
        "kind": "order",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความคิดเห็นต่อ Berlin",
              "น่าสนใจ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ความคิดเห็นต่อ Berlin คือ น่าสนใจ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L13-R005-learn-dialogue-v1-response",
          "targetId": "L13-R005",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Ich finde Berlin interessant.",
          "meaning": "ฉันคิดว่าเบอร์ลินน่าสนใจ"
        },
        "tokens": [
          "interessant.",
          "Berlin",
          "finde",
          "Ich"
        ]
      }
    ]
  },
  {
    "id": "L13-R006",
    "objective": "L13-R006",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "เมื่อเทียบกับเมืองอื่น",
          "แตกต่าง"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Die Stadt ist einfach anders.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "เมืองนี้แตกต่างจริง ๆ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "เมื่อเทียบกับเมืองอื่น",
              "แตกต่าง"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R006"
    ],
    "tasks": [
      {
        "id": "L13-R006-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "เมื่อเทียบกับเมืองอื่น",
              "แตกต่าง"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า เมื่อเทียบกับเมืองอื่น คือ แตกต่าง จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R006-learn-dialogue-v1-response",
          "targetId": "L13-R006",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Die Stadt ist einfach anders.",
          "meaning": "เมืองนี้แตกต่างจริง ๆ"
        },
        "options": [
          "Ich liebe die Natur.",
          "Die Stadt ist einfach anders.",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R007",
    "objective": "L13-R007",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ขนาดเมือง",
          "ใหญ่เกินไป"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Die Stadt ist zu groß.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "เมืองนี้ใหญ่เกินไป",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ขนาดเมือง",
              "ใหญ่เกินไป"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R007"
    ],
    "tasks": [
      {
        "id": "L13-R007-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ขนาดเมือง",
              "ใหญ่เกินไป"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ขนาดเมือง คือ ใหญ่เกินไป จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R007-learn-dialogue-v1-response",
          "targetId": "L13-R007",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Die Stadt ist zu groß.",
          "meaning": "เมืองนี้ใหญ่เกินไป"
        },
        "options": [
          "Ich liebe die Natur.",
          "Die Stadt ist zu groß.",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R008",
    "objective": "L13-R008",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ปฏิกิริยาของ B",
          "เห็นด้วยอย่างชื่นชม"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie findest du das?",
        "reply": "Das ist super!",
        "questionMeaning": "เธอคิดว่าเป็นอย่างไร",
        "replyMeaning": "นั่นยอดเยี่ยมมาก!",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ปฏิกิริยาของ B",
              "เห็นด้วยอย่างชื่นชม"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R008"
    ],
    "tasks": [
      {
        "id": "L13-R008-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie findest du das?",
        "promptMeaning": "เธอคิดว่าเป็นอย่างไร",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ปฏิกิริยาของ B",
              "เห็นด้วยอย่างชื่นชม"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ปฏิกิริยาของ B คือ เห็นด้วยอย่างชื่นชม จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R008-learn-dialogue-v1-response",
          "targetId": "L13-R008",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Das ist super!",
          "meaning": "นั่นยอดเยี่ยมมาก!"
        },
        "options": [
          "Ich liebe die Natur.",
          "Das ist super!",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R009",
    "objective": "L13-R009",
    "title": "แสดงความคิดเห็นต่อสถานที่",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ปฏิกิริยาของ B",
          "ชื่นชมแบบเป็นกันเอง"
        ]
      ]
    },
    "note": [
      "ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)",
      "ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie findest du das?",
        "reply": "Das ist cool!",
        "questionMeaning": "เธอคิดว่าเป็นอย่างไร",
        "replyMeaning": "นั่นเจ๋งมาก!",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ปฏิกิริยาของ B",
              "ชื่นชมแบบเป็นกันเอง"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R009"
    ],
    "tasks": [
      {
        "id": "L13-R009-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Wie findest du das?",
        "promptMeaning": "เธอคิดว่าเป็นอย่างไร",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ปฏิกิริยาของ B",
              "ชื่นชมแบบเป็นกันเอง"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ปฏิกิริยาของ B คือ ชื่นชมแบบเป็นกันเอง จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R009-learn-dialogue-v1-response",
          "targetId": "L13-R009",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Das ist cool!",
          "meaning": "นั่นเจ๋งมาก!"
        },
        "options": [
          "Ich liebe die Natur.",
          "Das ist cool!",
          "Es gibt viele Kirchen."
        ]
      }
    ]
  },
  {
    "id": "L13-R010",
    "objective": "L13-R010",
    "title": "สิ่งที่มีในเมือง",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "A ต้องการทราบ",
          "สถานที่ที่มีอยู่แถวนี้"
        ]
      ]
    },
    "note": [
      "ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ",
      "เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gibt es hier?",
        "reply": "Hier gibt es einen Park.",
        "questionMeaning": "ที่นี่มีอะไรบ้าง",
        "replyMeaning": "ที่นี่มีสวนสาธารณะ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สถานที่ที่มีอยู่แถวนี้"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R010"
    ],
    "tasks": [
      {
        "id": "L13-R010-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Hier gibt es einen Park.",
        "promptMeaning": "ที่นี่มีสวนสาธารณะ",
        "responseSpeaker": "A",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สถานที่ที่มีอยู่แถวนี้"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า A ต้องการทราบ คือ สถานที่ที่มีอยู่แถวนี้ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R010-learn-dialogue-v1-response",
          "targetId": "L13-R010",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Was gibt es hier?",
          "meaning": "ที่นี่มีอะไรบ้าง"
        },
        "options": [
          "Was ist Ihr Lieblingsort?",
          "Was gibt es hier?",
          "Wie finden Sie Berlin?"
        ]
      }
    ]
  },
  {
    "id": "L13-R011",
    "objective": "L13-R011",
    "title": "สิ่งที่มีในเมือง",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "สถานที่มีอยู่",
          "สวนสาธารณะ 1 แห่ง"
        ]
      ]
    },
    "note": [
      "ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ",
      "เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gibt es hier?",
        "reply": "Hier gibt es einen Park.",
        "questionMeaning": "ที่นี่มีอะไรบ้าง",
        "replyMeaning": "ที่นี่มีสวนสาธารณะ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่มีอยู่",
              "สวนสาธารณะ 1 แห่ง"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R011"
    ],
    "tasks": [
      {
        "id": "L13-R011-learn-dialogue-v1",
        "kind": "order",
        "prompt": "Was gibt es hier?",
        "promptMeaning": "ที่นี่มีอะไรบ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่มีอยู่",
              "สวนสาธารณะ 1 แห่ง"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า สถานที่มีอยู่ คือ สวนสาธารณะ 1 แห่ง จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L13-R011-learn-dialogue-v1-response",
          "targetId": "L13-R011",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Hier gibt es einen Park.",
          "meaning": "ที่นี่มีสวนสาธารณะ"
        },
        "tokens": [
          "Park.",
          "einen",
          "es",
          "gibt",
          "Hier"
        ]
      }
    ]
  },
  {
    "id": "L13-R012",
    "objective": "L13-R012",
    "title": "สิ่งที่มีในเมือง",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "สถานที่มีอยู่",
          "โบสถ์หลายแห่ง"
        ]
      ]
    },
    "note": [
      "ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ",
      "เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gibt es hier?",
        "reply": "Es gibt viele Kirchen.",
        "questionMeaning": "ที่นี่มีอะไรบ้าง",
        "replyMeaning": "มีโบสถ์หลายแห่ง",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่มีอยู่",
              "โบสถ์หลายแห่ง"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R012"
    ],
    "tasks": [
      {
        "id": "L13-R012-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was gibt es hier?",
        "promptMeaning": "ที่นี่มีอะไรบ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่มีอยู่",
              "โบสถ์หลายแห่ง"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า สถานที่มีอยู่ คือ โบสถ์หลายแห่ง จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R012-learn-dialogue-v1-response",
          "targetId": "L13-R012",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Es gibt viele Kirchen.",
          "meaning": "มีโบสถ์หลายแห่ง"
        },
        "options": [
          "Mein Lieblingsort ist der Park.",
          "Es gibt viele Kirchen.",
          "Ich finde Berlin interessant."
        ]
      }
    ]
  },
  {
    "id": "L13-R013",
    "objective": "L13-R013",
    "title": "สิ่งที่มีในเมือง",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ข้อมูลเพิ่มเติม",
          "มีคาเฟ่ด้วย"
        ]
      ]
    },
    "note": [
      "ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ",
      "เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gibt es hier?",
        "reply": "Es gibt auch ein Café.",
        "questionMeaning": "ที่นี่มีอะไรบ้าง",
        "replyMeaning": "มีคาเฟ่ด้วย",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ข้อมูลเพิ่มเติม",
              "มีคาเฟ่ด้วย"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R013"
    ],
    "tasks": [
      {
        "id": "L13-R013-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was gibt es hier?",
        "promptMeaning": "ที่นี่มีอะไรบ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ข้อมูลเพิ่มเติม",
              "มีคาเฟ่ด้วย"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ข้อมูลเพิ่มเติม คือ มีคาเฟ่ด้วย จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R013-learn-dialogue-v1-response",
          "targetId": "L13-R013",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Es gibt auch ein Café.",
          "meaning": "มีคาเฟ่ด้วย"
        },
        "options": [
          "Mein Lieblingsort ist der Park.",
          "Es gibt auch ein Café.",
          "Ich finde Berlin interessant."
        ]
      }
    ]
  },
  {
    "id": "L13-R014",
    "objective": "L13-R014",
    "title": "สิ่งที่มีในเมือง",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ใกล้จุดที่ยืน",
          "มีทะเลสาบ"
        ]
      ]
    },
    "note": [
      "ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ",
      "เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gibt es hier?",
        "reply": "In der Nähe gibt es auch einen See.",
        "questionMeaning": "ที่นี่มีอะไรบ้าง",
        "replyMeaning": "บริเวณใกล้เคียงมีทะเลสาบด้วย",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ใกล้จุดที่ยืน",
              "มีทะเลสาบ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R014"
    ],
    "tasks": [
      {
        "id": "L13-R014-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was gibt es hier?",
        "promptMeaning": "ที่นี่มีอะไรบ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ใกล้จุดที่ยืน",
              "มีทะเลสาบ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ใกล้จุดที่ยืน คือ มีทะเลสาบ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R014-learn-dialogue-v1-response",
          "targetId": "L13-R014",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "In der Nähe gibt es auch einen See.",
          "meaning": "บริเวณใกล้เคียงมีทะเลสาบด้วย"
        },
        "options": [
          "Mein Lieblingsort ist der Park.",
          "In der Nähe gibt es auch einen See.",
          "Ich finde Berlin interessant."
        ]
      }
    ]
  },
  {
    "id": "L13-R015",
    "objective": "L13-R015",
    "title": "สิ่งที่มีในเมือง",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "สถานที่ที่ขาดไป",
          "ท่าเรือ"
        ]
      ]
    },
    "note": [
      "ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ",
      "เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gibt es hier?",
        "reply": "Leider gibt es keinen Hafen.",
        "questionMeaning": "ที่นี่มีอะไรบ้าง",
        "replyMeaning": "น่าเสียดายที่ไม่มีท่าเรือ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่ที่ขาดไป",
              "ท่าเรือ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R015"
    ],
    "tasks": [
      {
        "id": "L13-R015-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was gibt es hier?",
        "promptMeaning": "ที่นี่มีอะไรบ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่ที่ขาดไป",
              "ท่าเรือ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า สถานที่ที่ขาดไป คือ ท่าเรือ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R015-learn-dialogue-v1-response",
          "targetId": "L13-R015",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Leider gibt es keinen Hafen.",
          "meaning": "น่าเสียดายที่ไม่มีท่าเรือ"
        },
        "options": [
          "Mein Lieblingsort ist der Park.",
          "Leider gibt es keinen Hafen.",
          "Ich finde Berlin interessant."
        ]
      }
    ]
  },
  {
    "id": "L13-R016",
    "objective": "L13-R016",
    "title": "สิ่งที่มีในเมือง",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "สถานที่ที่ขาดไป",
          "ย่านเมืองเก่า"
        ]
      ]
    },
    "note": [
      "ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ",
      "เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gibt es hier?",
        "reply": "Es gibt keine Altstadt.",
        "questionMeaning": "ที่นี่มีอะไรบ้าง",
        "replyMeaning": "ไม่มีย่านเมืองเก่า",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่ที่ขาดไป",
              "ย่านเมืองเก่า"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R016"
    ],
    "tasks": [
      {
        "id": "L13-R016-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was gibt es hier?",
        "promptMeaning": "ที่นี่มีอะไรบ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่ที่ขาดไป",
              "ย่านเมืองเก่า"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า สถานที่ที่ขาดไป คือ ย่านเมืองเก่า จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R016-learn-dialogue-v1-response",
          "targetId": "L13-R016",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Es gibt keine Altstadt.",
          "meaning": "ไม่มีย่านเมืองเก่า"
        },
        "options": [
          "Mein Lieblingsort ist der Park.",
          "Es gibt keine Altstadt.",
          "Ich finde Berlin interessant."
        ]
      }
    ]
  },
  {
    "id": "L13-R017",
    "objective": "L13-R017",
    "title": "สถานที่โปรด",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "A ต้องการทราบ",
          "สถานที่โปรดของ B"
        ]
      ]
    },
    "note": [
      "เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น",
      "kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was ist Ihr Lieblingsort?",
        "reply": "Mein Lieblingsort ist der Park.",
        "questionMeaning": "สถานที่โปรดของคุณคือที่ไหน",
        "replyMeaning": "สถานที่โปรดของฉันคือสวนสาธารณะ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สถานที่โปรดของ B"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R017"
    ],
    "tasks": [
      {
        "id": "L13-R017-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Mein Lieblingsort ist der Park.",
        "promptMeaning": "สถานที่โปรดของฉันคือสวนสาธารณะ",
        "responseSpeaker": "A",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สถานที่โปรดของ B"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า A ต้องการทราบ คือ สถานที่โปรดของ B จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R017-learn-dialogue-v1-response",
          "targetId": "L13-R017",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Was ist Ihr Lieblingsort?",
          "meaning": "สถานที่โปรดของคุณคือที่ไหน"
        },
        "options": [
          "Was gibt es hier?",
          "Was ist Ihr Lieblingsort?",
          "Wie finden Sie Berlin?"
        ]
      }
    ]
  },
  {
    "id": "L13-R018",
    "objective": "L13-R018",
    "title": "สถานที่โปรด",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "สถานที่โปรดของ B",
          "สวนสาธารณะ"
        ]
      ]
    },
    "note": [
      "เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น",
      "kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was ist Ihr Lieblingsort?",
        "reply": "Mein Lieblingsort ist der Park.",
        "questionMeaning": "สถานที่โปรดของคุณคือที่ไหน",
        "replyMeaning": "สถานที่โปรดของฉันคือสวนสาธารณะ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่โปรดของ B",
              "สวนสาธารณะ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R018"
    ],
    "tasks": [
      {
        "id": "L13-R018-learn-dialogue-v1",
        "kind": "order",
        "prompt": "Was ist Ihr Lieblingsort?",
        "promptMeaning": "สถานที่โปรดของคุณคือที่ไหน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่โปรดของ B",
              "สวนสาธารณะ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า สถานที่โปรดของ B คือ สวนสาธารณะ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L13-R018-learn-dialogue-v1-response",
          "targetId": "L13-R018",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Mein Lieblingsort ist der Park.",
          "meaning": "สถานที่โปรดของฉันคือสวนสาธารณะ"
        },
        "tokens": [
          "Park.",
          "der",
          "ist",
          "Lieblingsort",
          "Mein"
        ]
      }
    ]
  },
  {
    "id": "L13-R019",
    "objective": "L13-R019",
    "title": "สถานที่โปรด",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "สิ่งที่ B ชอบ",
          "ธรรมชาติ"
        ]
      ]
    },
    "note": [
      "เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น",
      "kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was mögen Sie?",
        "reply": "Ich liebe die Natur.",
        "questionMeaning": "คุณชอบอะไร",
        "replyMeaning": "ฉันรักธรรมชาติ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สิ่งที่ B ชอบ",
              "ธรรมชาติ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R019"
    ],
    "tasks": [
      {
        "id": "L13-R019-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was mögen Sie?",
        "promptMeaning": "คุณชอบอะไร",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สิ่งที่ B ชอบ",
              "ธรรมชาติ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า สิ่งที่ B ชอบ คือ ธรรมชาติ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R019-learn-dialogue-v1-response",
          "targetId": "L13-R019",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Ich liebe die Natur.",
          "meaning": "ฉันรักธรรมชาติ"
        },
        "options": [
          "Es gibt keine Altstadt.",
          "Ich liebe die Natur.",
          "Die Stadt ist zu groß."
        ]
      }
    ]
  },
  {
    "id": "L13-R020",
    "objective": "L13-R020",
    "title": "สถานที่โปรด",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "กิจกรรมที่ทำได้",
          "เดินเล่น"
        ]
      ]
    },
    "note": [
      "เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น",
      "kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was kann man dort machen?",
        "reply": "Dort kann man spazieren gehen.",
        "questionMeaning": "ที่นั่นทำอะไรได้บ้าง",
        "replyMeaning": "ที่นั่นสามารถเดินเล่นได้",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "กิจกรรมที่ทำได้",
              "เดินเล่น"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R020"
    ],
    "tasks": [
      {
        "id": "L13-R020-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was kann man dort machen?",
        "promptMeaning": "ที่นั่นทำอะไรได้บ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "กิจกรรมที่ทำได้",
              "เดินเล่น"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า กิจกรรมที่ทำได้ คือ เดินเล่น จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R020-learn-dialogue-v1-response",
          "targetId": "L13-R020",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Dort kann man spazieren gehen.",
          "meaning": "ที่นั่นสามารถเดินเล่นได้"
        },
        "options": [
          "Es gibt keine Altstadt.",
          "Dort kann man spazieren gehen.",
          "Die Stadt ist zu groß."
        ]
      }
    ]
  },
  {
    "id": "L13-R021",
    "objective": "L13-R021",
    "title": "สถานที่โปรด",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "กิจกรรมเพิ่มเติม",
          "ตกปลา"
        ]
      ]
    },
    "note": [
      "เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น",
      "kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was kann man dort machen?",
        "reply": "Dort kann man auch angeln.",
        "questionMeaning": "ที่นั่นทำอะไรได้บ้าง",
        "replyMeaning": "ที่นั่นสามารถตกปลาได้ด้วย",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "กิจกรรมเพิ่มเติม",
              "ตกปลา"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R021"
    ],
    "tasks": [
      {
        "id": "L13-R021-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was kann man dort machen?",
        "promptMeaning": "ที่นั่นทำอะไรได้บ้าง",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "กิจกรรมเพิ่มเติม",
              "ตกปลา"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า กิจกรรมเพิ่มเติม คือ ตกปลา จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R021-learn-dialogue-v1-response",
          "targetId": "L13-R021",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Dort kann man auch angeln.",
          "meaning": "ที่นั่นสามารถตกปลาได้ด้วย"
        },
        "options": [
          "Es gibt keine Altstadt.",
          "Dort kann man auch angeln.",
          "Die Stadt ist zu groß."
        ]
      }
    ]
  },
  {
    "id": "L13-R022",
    "objective": "L13-R022",
    "title": "สถานที่โปรด",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "B กับเพื่อน",
          "นัดพบกันที่นั่น"
        ]
      ]
    },
    "note": [
      "เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น",
      "kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was macht ihr dort?",
        "reply": "Dort treffen wir Freunde.",
        "questionMeaning": "พวกเธอทำอะไรที่นั่น",
        "replyMeaning": "พวกเราพบเพื่อนที่นั่น",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "B กับเพื่อน",
              "นัดพบกันที่นั่น"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R022"
    ],
    "tasks": [
      {
        "id": "L13-R022-learn-dialogue-v1",
        "kind": "order",
        "prompt": "Was macht ihr dort?",
        "promptMeaning": "พวกเธอทำอะไรที่นั่น",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "B กับเพื่อน",
              "นัดพบกันที่นั่น"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า B กับเพื่อน คือ นัดพบกันที่นั่น จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L13-R022-learn-dialogue-v1-response",
          "targetId": "L13-R022",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Dort treffen wir Freunde.",
          "meaning": "พวกเราพบเพื่อนที่นั่น"
        },
        "tokens": [
          "Freunde.",
          "wir",
          "treffen",
          "Dort"
        ]
      }
    ]
  },
  {
    "id": "L13-R023",
    "objective": "L13-R023",
    "title": "สถานที่โปรด",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "สถานที่ที่อยากมี",
          "สนามฟุตบอล แต่ที่นี่ไม่มี"
        ]
      ]
    },
    "note": [
      "เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น",
      "kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was fehlt Ihnen?",
        "reply": "Leider gibt es keinen Fußballplatz.",
        "questionMeaning": "คุณรู้สึกว่าขาดอะไร",
        "replyMeaning": "น่าเสียดายที่ไม่มีสนามฟุตบอล",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่ที่อยากมี",
              "สนามฟุตบอล แต่ที่นี่ไม่มี"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R023"
    ],
    "tasks": [
      {
        "id": "L13-R023-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Was fehlt Ihnen?",
        "promptMeaning": "คุณรู้สึกว่าขาดอะไร",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "สถานที่ที่อยากมี",
              "สนามฟุตบอล แต่ที่นี่ไม่มี"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า สถานที่ที่อยากมี คือ สนามฟุตบอล แต่ที่นี่ไม่มี จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R023-learn-dialogue-v1-response",
          "targetId": "L13-R023",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Leider gibt es keinen Fußballplatz.",
          "meaning": "น่าเสียดายที่ไม่มีสนามฟุตบอล"
        },
        "options": [
          "Es gibt keine Altstadt.",
          "Leider gibt es keinen Fußballplatz.",
          "Die Stadt ist zu groß."
        ]
      }
    ]
  },
  {
    "id": "L13-R024",
    "objective": "L13-R024",
    "title": "ถามและแลกเปลี่ยนความคิดเห็น",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "A ต้องการทราบ",
          "ความคิดเห็นของ B ต่อ Berlin"
        ]
      ]
    },
    "note": [
      "ถามความเห็นด้วย Wie finden Sie …? แล้วตอบให้ตรงกับสิ่งที่ถูกถาม",
      "Ich glaube และ Ich finde ใช้เกริ่นความคิดเห็น; แต่ละประโยคย่อยมีประธานและกริยาของตนเอง"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Ich finde Berlin interessant.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันคิดว่าเบอร์ลินน่าสนใจ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "ความคิดเห็นของ B ต่อ Berlin"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R024"
    ],
    "tasks": [
      {
        "id": "L13-R024-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Ich finde Berlin interessant.",
        "promptMeaning": "ฉันคิดว่าเบอร์ลินน่าสนใจ",
        "responseSpeaker": "A",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "ความคิดเห็นของ B ต่อ Berlin"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า A ต้องการทราบ คือ ความคิดเห็นของ B ต่อ Berlin จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R024-learn-dialogue-v1-response",
          "targetId": "L13-R024",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Wie finden Sie Berlin?",
          "meaning": "คุณคิดอย่างไรกับเบอร์ลิน"
        },
        "options": [
          "Was gibt es hier?",
          "Wie finden Sie Berlin?",
          "Was ist Ihr Lieblingsort?"
        ]
      }
    ]
  },
  {
    "id": "L13-R025",
    "objective": "L13-R025",
    "title": "ถามและแลกเปลี่ยนความคิดเห็น",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "A ต้องการ",
          "ชวน B ไปเยือน Berlin"
        ]
      ]
    },
    "note": [
      "ถามความเห็นด้วย Wie finden Sie …? แล้วตอบให้ตรงกับสิ่งที่ถูกถาม",
      "Ich glaube และ Ich finde ใช้เกริ่นความคิดเห็น; แต่ละประโยคย่อยมีประธานและกริยาของตนเอง"
    ],
    "audio": "",
    "models": [
      {
        "question": "Möchten Sie Berlin besuchen?",
        "reply": "Ja, gern.",
        "questionMeaning": "คุณอยากไปเที่ยวเบอร์ลินไหม",
        "replyMeaning": "ได้เลย ยินดี",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการ",
              "ชวน B ไปเยือน Berlin"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R025"
    ],
    "tasks": [
      {
        "id": "L13-R025-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Ja, gern.",
        "promptMeaning": "ได้เลย ยินดี",
        "responseSpeaker": "A",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการ",
              "ชวน B ไปเยือน Berlin"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า A ต้องการ คือ ชวน B ไปเยือน Berlin จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R025-learn-dialogue-v1-response",
          "targetId": "L13-R025",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Möchten Sie Berlin besuchen?",
          "meaning": "คุณอยากไปเที่ยวเบอร์ลินไหม"
        },
        "options": [
          "Was gibt es hier?",
          "Möchten Sie Berlin besuchen?",
          "Was ist Ihr Lieblingsort?"
        ]
      }
    ]
  },
  {
    "id": "L13-R026",
    "objective": "L13-R026",
    "title": "ถามและแลกเปลี่ยนความคิดเห็น",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "B ยังไม่เคยไป",
          "คิดว่า Berlin น่าสนใจมาก"
        ]
      ]
    },
    "note": [
      "ถามความเห็นด้วย Wie finden Sie …? แล้วตอบให้ตรงกับสิ่งที่ถูกถาม",
      "Ich glaube และ Ich finde ใช้เกริ่นความคิดเห็น; แต่ละประโยคย่อยมีประธานและกริยาของตนเอง"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Ich glaube, Berlin ist sehr interessant.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันคิดว่าเบอร์ลินน่าสนใจมาก",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "B ยังไม่เคยไป",
              "คิดว่า Berlin น่าสนใจมาก"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R026"
    ],
    "tasks": [
      {
        "id": "L13-R026-learn-dialogue-v1",
        "kind": "order",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "B ยังไม่เคยไป",
              "คิดว่า Berlin น่าสนใจมาก"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า B ยังไม่เคยไป คือ คิดว่า Berlin น่าสนใจมาก จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L13-R026-learn-dialogue-v1-response",
          "targetId": "L13-R026",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Ich glaube, Berlin ist sehr interessant.",
          "meaning": "ฉันคิดว่าเบอร์ลินน่าสนใจมาก"
        },
        "tokens": [
          "interessant.",
          "sehr",
          "ist",
          "Berlin",
          "glaube,",
          "Ich"
        ]
      }
    ]
  },
  {
    "id": "L13-R027",
    "objective": "L13-R027",
    "title": "ถามและแลกเปลี่ยนความคิดเห็น",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "ความคิดเห็นของ B",
          "เมืองใหญ่เกินไป"
        ]
      ]
    },
    "note": [
      "ถามความเห็นด้วย Wie finden Sie …? แล้วตอบให้ตรงกับสิ่งที่ถูกถาม",
      "Ich glaube และ Ich finde ใช้เกริ่นความคิดเห็น; แต่ละประโยคย่อยมีประธานและกริยาของตนเอง"
    ],
    "audio": "",
    "models": [
      {
        "question": "Wie finden Sie Berlin?",
        "reply": "Ich finde die Stadt zu groß.",
        "questionMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "replyMeaning": "ฉันคิดว่าเมืองนี้ใหญ่เกินไป",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความคิดเห็นของ B",
              "เมืองใหญ่เกินไป"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R027"
    ],
    "tasks": [
      {
        "id": "L13-R027-learn-dialogue-v1",
        "kind": "order",
        "prompt": "Wie finden Sie Berlin?",
        "promptMeaning": "คุณคิดอย่างไรกับเบอร์ลิน",
        "responseSpeaker": "B",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "ความคิดเห็นของ B",
              "เมืองใหญ่เกินไป"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า ความคิดเห็นของ B คือ เมืองใหญ่เกินไป จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "supplied-words"
        ],
        "unit": {
          "id": "L13-R027-learn-dialogue-v1-response",
          "targetId": "L13-R027",
          "subskill": "phrase_word_order",
          "difficulty": 2,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Ich finde die Stadt zu groß.",
          "meaning": "ฉันคิดว่าเมืองนี้ใหญ่เกินไป"
        },
        "tokens": [
          "groß.",
          "zu",
          "Stadt",
          "die",
          "finde",
          "Ich"
        ]
      }
    ]
  },
  {
    "id": "L13-R028",
    "objective": "L13-R028",
    "title": "ถามและแลกเปลี่ยนความคิดเห็น",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "A ต้องการทราบ",
          "สิ่งที่ B ชอบเป็นพิเศษ"
        ]
      ]
    },
    "note": [
      "ถามความเห็นด้วย Wie finden Sie …? แล้วตอบให้ตรงกับสิ่งที่ถูกถาม",
      "Ich glaube และ Ich finde ใช้เกริ่นความคิดเห็น; แต่ละประโยคย่อยมีประธานและกริยาของตนเอง"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was gefällt Ihnen besonders?",
        "reply": "Das gefällt mir besonders gut.",
        "questionMeaning": "คุณชอบอะไรเป็นพิเศษ",
        "replyMeaning": "ฉันชอบสิ่งนั้นเป็นพิเศษ",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สิ่งที่ B ชอบเป็นพิเศษ"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R028"
    ],
    "tasks": [
      {
        "id": "L13-R028-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Das gefällt mir besonders gut.",
        "promptMeaning": "ฉันชอบสิ่งนั้นเป็นพิเศษ",
        "responseSpeaker": "A",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สิ่งที่ B ชอบเป็นพิเศษ"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า A ต้องการทราบ คือ สิ่งที่ B ชอบเป็นพิเศษ จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R028-learn-dialogue-v1-response",
          "targetId": "L13-R028",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Was gefällt Ihnen besonders?",
          "meaning": "คุณชอบอะไรเป็นพิเศษ"
        },
        "options": [
          "Was gibt es hier?",
          "Was gefällt Ihnen besonders?",
          "Was ist Ihr Lieblingsort?"
        ]
      }
    ]
  },
  {
    "id": "L13-R029",
    "objective": "L13-R029",
    "title": "ถามและแลกเปลี่ยนความคิดเห็น",
    "modelVisual": {
      "kind": "facts",
      "rows": [
        [
          "A ต้องการทราบ",
          "สิ่งที่ B รู้สึกว่ายังขาดไป"
        ]
      ]
    },
    "note": [
      "ถามความเห็นด้วย Wie finden Sie …? แล้วตอบให้ตรงกับสิ่งที่ถูกถาม",
      "Ich glaube และ Ich finde ใช้เกริ่นความคิดเห็น; แต่ละประโยคย่อยมีประธานและกริยาของตนเอง"
    ],
    "audio": "",
    "models": [
      {
        "question": "Was fehlt Ihnen?",
        "reply": "Leider gibt es keinen Fußballplatz.",
        "questionMeaning": "คุณรู้สึกว่าขาดอะไร",
        "replyMeaning": "น่าเสียดายที่ไม่มีสนามฟุตบอล",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สิ่งที่ B รู้สึกว่ายังขาดไป"
            ]
          ]
        }
      }
    ],
    "legacyIds": [
      "L13-R029"
    ],
    "tasks": [
      {
        "id": "L13-R029-learn-dialogue-v1",
        "kind": "choice",
        "prompt": "Leider gibt es keinen Fußballplatz.",
        "promptMeaning": "น่าเสียดายที่ไม่มีสนามฟุตบอล",
        "responseSpeaker": "A",
        "visual": {
          "kind": "facts",
          "rows": [
            [
              "A ต้องการทราบ",
              "สิ่งที่ B รู้สึกว่ายังขาดไป"
            ]
          ]
        },
        "audio": null,
        "explanation": "ข้อมูลที่ให้ระบุว่า A ต้องการทราบ คือ สิ่งที่ B รู้สึกว่ายังขาดไป จึงเลือกสำนวนให้ตรงกับเจตนานี้",
        "assistance": [
          "prior-model",
          "provided-context",
          "reply-options"
        ],
        "unit": {
          "id": "L13-R029-learn-dialogue-v1-response",
          "targetId": "L13-R029",
          "subskill": "phrase_dialogue_response",
          "difficulty": 1,
          "rationale": "ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ",
          "answer": "Was fehlt Ihnen?",
          "meaning": "คุณรู้สึกว่าขาดอะไร"
        },
        "options": [
          "Was gibt es hier?",
          "Was fehlt Ihnen?",
          "Was ist Ihr Lieblingsort?"
        ]
      }
    ]
  }
];
