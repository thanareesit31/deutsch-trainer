import type { DialogueAnnotatedPart } from "@/lib/phrase-dialogue-learning";
export const phrasePresentation: Readonly<Record<string, {annotations:Record<string,DialogueAnnotatedPart[][]>;dialogues:Record<string,string>;turns:Record<string,{A?:string;B?:string}>;notes:Record<string,string[]>}>> = {
  "L01": {
    "annotations": {
      "Guten Morgen!": [
        [
          {
            "text": "Guten Morgen!",
            "role": "other",
            "label": "ทักทายตอนเช้า"
          }
        ]
      ],
      "Tschüs!": [
        [
          {
            "text": "Tschüs!",
            "role": "other",
            "label": "ลาแบบเป็นกันเอง"
          }
        ]
      ],
      "Ich heiße Anna. Und wer bist du?": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "heiße",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Anna.",
            "role": "other",
            "label": "ชื่อ"
          }
        ],
        [
          {
            "text": "Und",
            "role": "other",
            "label": "ถามต่อหรือถามกลับ"
          },
          {
            "text": "wer",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich bin Mali.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bin",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Mali.",
            "role": "other",
            "label": "ชื่อ"
          }
        ]
      ],
      "Wer ist das?": [
        [
          {
            "text": "Wer",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Das ist Mali.": [
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Mali.",
            "role": "other",
            "label": "บุคคลที่แนะนำ"
          }
        ]
      ],
      "Wie geht es Ihnen?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "geht",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "Ihnen?",
            "role": "other",
            "label": "ผู้ที่ถามถึง (สุภาพ)"
          }
        ]
      ],
      "Gut, danke. Und Ihnen?": [
        [
          {
            "text": "Gut, danke.",
            "role": "other",
            "label": "บอกว่าสบายดีและขอบคุณ"
          }
        ],
        [
          {
            "text": "Und Ihnen?",
            "role": "other",
            "label": "ถามกลับแบบสุภาพ"
          }
        ]
      ],
      "Wie geht's dir?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "geht's",
            "role": "verb",
            "label": "geht + es (กริยาและประธาน)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "dir?",
            "role": "other",
            "label": "ผู้ที่ถามถึง (เป็นกันเอง)"
          }
        ]
      ],
      "Nicht so gut.": [
        [
          {
            "text": "Nicht so gut.",
            "role": "other",
            "label": "บอกว่าไม่ค่อยสบายดี"
          }
        ]
      ],
      "Woher kommen Sie?": [
        [
          {
            "text": "Woher",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kommen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich komme aus Thailand.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "komme",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "aus Thailand.",
            "role": "other",
            "label": "ประเทศที่มา"
          }
        ]
      ],
      "Woher kommt Anna?": [
        [
          {
            "text": "Woher",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kommt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Anna?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Sie kommt aus Deutschland.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kommt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "aus Deutschland.",
            "role": "other",
            "label": "ประเทศที่มา"
          }
        ]
      ],
      "Ich heiße Mali.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "heiße",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Mali.",
            "role": "other",
            "label": "ชื่อ"
          }
        ]
      ],
      "Entschuldigung. Wie bitte?": [
        [
          {
            "text": "Entschuldigung.",
            "role": "other",
            "label": "ขอโทษก่อนขอให้พูดซ้ำ"
          }
        ],
        [
          {
            "text": "Wie bitte?",
            "role": "other",
            "label": "ขอให้พูดซ้ำ"
          }
        ]
      ],
      "Mali. M-A-L-I.": [
        [
          {
            "text": "Mali.",
            "role": "other",
            "label": "บอกชื่อ"
          }
        ],
        [
          {
            "text": "M-A-L-I.",
            "role": "other",
            "label": "สะกดชื่อทีละตัว"
          }
        ]
      ],
      "Danke.": [
        [
          {
            "text": "Danke.",
            "role": "other",
            "label": "ขอบคุณ"
          }
        ]
      ],
      "Wie ist dein Vorname?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "dein Vorname?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Mein Vorname ist Mali.": [
        [
          {
            "text": "Mein Vorname",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Mali.",
            "role": "other",
            "label": "ชื่อจริง"
          }
        ]
      ],
      "Wie ist dein Familienname?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "dein Familienname?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Mein Familienname ist Sommer.": [
        [
          {
            "text": "Mein Familienname",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sommer.",
            "role": "other",
            "label": "นามสกุล"
          }
        ]
      ],
      "Wie bitte? Wie schreibt man das?": [
        [
          {
            "text": "Wie bitte?",
            "role": "other",
            "label": "ขอให้พูดซ้ำ"
          }
        ],
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "schreibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "man",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "das?",
            "role": "other",
            "label": "สิ่งที่ขอให้สะกด"
          }
        ]
      ],
      "Wie schreibt man das?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "schreibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "man",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "das?",
            "role": "other",
            "label": "สิ่งที่ขอให้สะกด"
          }
        ]
      ],
      "M-A-L-I.": [
        [
          {
            "text": "M-A-L-I.",
            "role": "other",
            "label": "สะกดชื่อทีละตัว"
          }
        ]
      ],
      "Ich heiße Anna.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "heiße",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Anna.",
            "role": "other",
            "label": "ชื่อ"
          }
        ]
      ],
      "Freut mich!": [
        [
          {
            "text": "Freut mich!",
            "role": "other",
            "label": "ยินดีที่ได้รู้จัก"
          }
        ]
      ],
      "Freut mich auch!": [
        [
          {
            "text": "Freut mich auch!",
            "role": "other",
            "label": "ตอบว่ายินดีที่ได้รู้จักเช่นกัน"
          }
        ]
      ],
      "Gute Nacht!": [
        [
          {
            "text": "Gute Nacht!",
            "role": "other",
            "label": "ลาก่อนเข้านอน"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Guten Morgen!\",\"Guten Morgen!\"]": "/audio/phrases/dialogue-06831579103cfccad618.m4a",
      "[\"Tschüs!\",\"Tschüs!\"]": "/audio/phrases/dialogue-b2f3743fd148d33ac271.m4a",
      "[\"Ich heiße Anna. Und wer bist du?\",\"Ich bin Mali.\"]": "/audio/phrases/dialogue-ff39871745abafe01662.m4a",
      "[\"Wer ist das?\",\"Das ist Mali.\"]": "/audio/phrases/dialogue-712e94000d49bfbd4246.m4a",
      "[\"Wie geht es Ihnen?\",\"Gut, danke. Und Ihnen?\"]": "/audio/phrases/dialogue-21c0910ec1bdd630c08c.m4a",
      "[\"Wie geht's dir?\",\"Nicht so gut.\"]": "/audio/phrases/dialogue-63d7664308c95d408c42.m4a",
      "[\"Woher kommen Sie?\",\"Ich komme aus Thailand.\"]": "/audio/phrases/dialogue-cec77a367f8690bfa4b1.m4a",
      "[\"Woher kommt Anna?\",\"Sie kommt aus Deutschland.\"]": "/audio/phrases/dialogue-e794d26000a5cabaa296.m4a",
      "[\"Ich heiße Mali.\",\"Entschuldigung. Wie bitte?\"]": "/audio/phrases/dialogue-ab4dfd7badf02f01d5d5.m4a",
      "[\"Mali. M-A-L-I.\",\"Danke.\"]": "/audio/phrases/dialogue-c191f1d15034ad38f5e4.m4a",
      "[\"Wie ist dein Vorname?\",\"Mein Vorname ist Mali.\"]": "/audio/phrases/dialogue-0be8760a2eb374594856.m4a",
      "[\"Wie ist dein Familienname?\",\"Mein Familienname ist Sommer.\"]": "/audio/phrases/dialogue-b76a48f949d8db5f7f06.m4a",
      "[\"Mein Vorname ist Mali.\",\"Wie bitte? Wie schreibt man das?\"]": "/audio/phrases/dialogue-59c90f3f210f3199305b.m4a",
      "[\"Wie schreibt man das?\",\"M-A-L-I.\"]": "/audio/phrases/dialogue-3f2fab5eb6b95f7b7019.m4a",
      "[\"Ich heiße Anna.\",\"Freut mich!\"]": "/audio/phrases/dialogue-a7078da77f470f315887.m4a",
      "[\"Freut mich!\",\"Freut mich auch!\"]": "/audio/phrases/dialogue-e33b64fe1f8b3317547f.m4a",
      "[\"Tschüs!\",\"Gute Nacht!\"]": "/audio/phrases/dialogue-92ce4d647a760a9187ff.m4a"
    },
    "turns": {
      "Guten Morgen!": {
        "A": "/audio/phrases/turn-cef9227869016cb33d1b.mp3",
        "B": "/audio/phrases/turn-0621b5d95c7f0d93633e.mp3"
      },
      "Tschüs!": {
        "A": "/audio/phrases/turn-0659275c183b43d008f4.mp3",
        "B": "/audio/phrases/turn-d35d161e36ef35a9f818.mp3"
      },
      "Ich heiße Anna. Und wer bist du?": {
        "A": "/audio/phrases/turn-8a396470ef2a937c9d96.mp3"
      },
      "Ich bin Mali.": {
        "B": "/audio/phrases/turn-c6899574c693cd57e560.mp3"
      },
      "Wer ist das?": {
        "A": "/audio/phrases/turn-fffd5feed6f15ba93459.mp3"
      },
      "Das ist Mali.": {
        "B": "/audio/phrases/turn-1f33782a45597d5373e7.mp3"
      },
      "Wie geht es Ihnen?": {
        "A": "/audio/phrases/turn-41d2ad5231f045b2850c.mp3"
      },
      "Gut, danke. Und Ihnen?": {
        "B": "/audio/phrases/turn-06755e55356b6d6896bc.mp3"
      },
      "Wie geht's dir?": {
        "A": "/audio/phrases/turn-b771ba45e49de023ecd4.mp3"
      },
      "Nicht so gut.": {
        "B": "/audio/phrases/turn-98ec91bef1cccac95514.mp3"
      },
      "Woher kommen Sie?": {
        "A": "/audio/phrases/turn-679e853c961a809a898e.mp3"
      },
      "Ich komme aus Thailand.": {
        "B": "/audio/phrases/turn-3c9bced5142c71f60617.mp3"
      },
      "Woher kommt Anna?": {
        "A": "/audio/phrases/turn-fa6f9e8155c17c65991e.mp3"
      },
      "Sie kommt aus Deutschland.": {
        "B": "/audio/phrases/turn-5a70b6b2a782ccb48304.mp3"
      },
      "Ich heiße Mali.": {
        "A": "/audio/phrases/turn-08e0c219cfbe1460ea65.mp3"
      },
      "Entschuldigung. Wie bitte?": {
        "B": "/audio/phrases/turn-d44c76a9daac98cd42e3.mp3"
      },
      "Mali. M-A-L-I.": {
        "A": "/audio/phrases/turn-3c78614c3eab0838f5e6.mp3"
      },
      "Danke.": {
        "B": "/audio/phrases/turn-dff344981a9afb554d8d.mp3"
      },
      "Wie ist dein Vorname?": {
        "A": "/audio/phrases/turn-7836530cf9d8083238c2.mp3"
      },
      "Mein Vorname ist Mali.": {
        "B": "/audio/phrases/turn-4b59471df3b1b83e2eac.mp3",
        "A": "/audio/phrases/turn-fba84f3caac21c0f5cd8.mp3"
      },
      "Wie ist dein Familienname?": {
        "A": "/audio/phrases/turn-facd17ce6bc09bd9f282.mp3"
      },
      "Mein Familienname ist Sommer.": {
        "B": "/audio/phrases/turn-20e432ad1928f1c6394b.mp3"
      },
      "Wie bitte? Wie schreibt man das?": {
        "B": "/audio/phrases/turn-2c2edb301b1427ce8411.mp3"
      },
      "Wie schreibt man das?": {
        "A": "/audio/phrases/turn-0ea8fbfeba8f25430aa0.mp3"
      },
      "M-A-L-I.": {
        "B": "/audio/phrases/turn-3fa589079ba67b5d2b96.mp3"
      },
      "Ich heiße Anna.": {
        "A": "/audio/phrases/turn-09c791797542d86dd6bd.mp3"
      },
      "Freut mich!": {
        "B": "/audio/phrases/turn-9263f1f65244cd7e21f7.mp3",
        "A": "/audio/phrases/turn-b9ce038b7620d463193f.mp3"
      },
      "Freut mich auch!": {
        "B": "/audio/phrases/turn-b45819fb7e12a3734aa5.mp3"
      },
      "Gute Nacht!": {
        "B": "/audio/phrases/turn-58b8b5f2626e6a14d73d.mp3"
      }
    },
    "notes": {}
  },
  "L02": {
    "annotations": {
      "Was machst du beruflich?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "machst",
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
            "text": "beruflich?",
            "role": "other",
            "label": "ถามเรื่องอาชีพ"
          }
        ]
      ],
      "Ich arbeite als Friseurin. Ich arbeite bei Haarfit.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeite",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "als Friseurin.",
            "role": "other",
            "label": "อาชีพ"
          }
        ],
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeite",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "bei Haarfit.",
            "role": "other",
            "label": "ที่ทำงาน"
          }
        ]
      ],
      "Was machen Sie beruflich?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "machen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "beruflich?",
            "role": "other",
            "label": "ถามเรื่องอาชีพ"
          }
        ]
      ],
      "Ich bin Lehrerin.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bin",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Lehrerin.",
            "role": "other",
            "label": "อาชีพ"
          }
        ]
      ],
      "Was macht ihr beruflich?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "macht",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ihr",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "beruflich?",
            "role": "other",
            "label": "ถามเรื่องอาชีพ"
          }
        ]
      ],
      "Wir arbeiten als Friseure.": [
        [
          {
            "text": "Wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeiten",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "als Friseure.",
            "role": "other",
            "label": "อาชีพ"
          }
        ]
      ],
      "Wo arbeitest du?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeitest",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich arbeite bei Haarfit.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeite",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "bei Haarfit.",
            "role": "other",
            "label": "ที่ทำงาน"
          }
        ]
      ],
      "Ich mache ein Praktikum.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "mache",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ein Praktikum.",
            "role": "other",
            "label": "สิ่งที่ทำ: ฝึกงาน"
          }
        ]
      ],
      "Und du?": [
        [
          {
            "text": "Und du?",
            "role": "other",
            "label": "ถามกลับแบบเป็นกันเอง"
          }
        ]
      ],
      "Ich bin angestellt.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bin",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "angestellt.",
            "role": "other",
            "label": "สถานะ: เป็นลูกจ้าง"
          }
        ]
      ],
      "Arbeitest du?": [
        [
          {
            "text": "Arbeitest",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich arbeite im Moment nicht.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeite",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "im Moment",
            "role": "time",
            "label": "คำบอกเวลา"
          },
          {
            "text": "nicht.",
            "role": "other",
            "label": "ปฏิเสธ"
          }
        ]
      ],
      "Was machst du im Moment?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "machst",
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
            "text": "im Moment?",
            "role": "time",
            "label": "คำบอกเวลา"
          }
        ]
      ],
      "Wie arbeitest du?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeitest",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Arbeitest du im Moment?": [
        [
          {
            "text": "Arbeitest",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "im Moment?",
            "role": "time",
            "label": "คำบอกเวลา"
          }
        ]
      ],
      "Wie alt bist du?": [
        [
          {
            "text": "Wie alt",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich bin vierundzwanzig Jahre alt.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bin",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "vierundzwanzig Jahre alt.",
            "role": "other",
            "label": "อายุ"
          }
        ]
      ],
      "Ich bin 28 Jahre alt.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bin",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "28 Jahre alt.",
            "role": "other",
            "label": "อายุ"
          }
        ]
      ],
      "Wo wohnst du?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wohnst",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich wohne in München.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wohne",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "in München.",
            "role": "other",
            "label": "เมืองที่อาศัยอยู่"
          }
        ]
      ],
      "Wo wohnt ihr?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wohnt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ihr?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Wir wohnen in Berlin.": [
        [
          {
            "text": "Wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wohnen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "in Berlin.",
            "role": "other",
            "label": "เมืองที่อาศัยอยู่"
          }
        ]
      ],
      "Ich wohne in Bangkok.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wohne",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "in Bangkok.",
            "role": "other",
            "label": "เมืองที่อาศัยอยู่"
          }
        ]
      ],
      "Lebt ihr zusammen?": [
        [
          {
            "text": "Lebt",
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
            "text": "zusammen?",
            "role": "other",
            "label": "อยู่ด้วยกัน"
          }
        ]
      ],
      "Ja, wir leben zusammen.": [
        [
          {
            "text": "Ja,",
            "role": "other",
            "label": "ตอบรับ"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "leben",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "zusammen.",
            "role": "other",
            "label": "อยู่ด้วยกัน"
          }
        ]
      ],
      "Seid ihr verheiratet?": [
        [
          {
            "text": "Seid",
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
            "text": "verheiratet?",
            "role": "other",
            "label": "สถานะ: แต่งงาน"
          }
        ]
      ],
      "Nein, wir sind nicht verheiratet.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sind",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nicht",
            "role": "other",
            "label": "ปฏิเสธ"
          },
          {
            "text": "verheiratet.",
            "role": "other",
            "label": "สถานะสมรส"
          }
        ]
      ],
      "Habt ihr Kinder?": [
        [
          {
            "text": "Habt",
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
            "text": "Kinder?",
            "role": "other",
            "label": "ลูก (กรรม)"
          }
        ]
      ],
      "Nein, wir haben keine Kinder.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "haben",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "keine Kinder.",
            "role": "other",
            "label": "ไม่มีลูก (กรรม)"
          }
        ]
      ],
      "Wir haben keine Kinder.": [
        [
          {
            "text": "Wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "haben",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "keine Kinder.",
            "role": "other",
            "label": "ไม่มีลูก (กรรม)"
          }
        ]
      ],
      "Ich arbeite als Verkäufer.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeite",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "als Verkäufer.",
            "role": "other",
            "label": "อาชีพ"
          }
        ]
      ],
      "Und was ist dein Traumberuf?": [
        [
          {
            "text": "Und",
            "role": "other",
            "label": "ถามต่อหรือถามกลับ"
          },
          {
            "text": "was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "dein Traumberuf?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Mein Traumberuf ist Arzt.": [
        [
          {
            "text": "Mein Traumberuf",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Arzt.",
            "role": "other",
            "label": "อาชีพในฝัน"
          }
        ]
      ],
      "Was ist dein Traumberuf?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "dein Traumberuf?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Wie ist deine Handynummer?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "deine Handynummer?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Meine Handynummer ist null eins zwei drei vier fünf sechs.": [
        [
          {
            "text": "Meine Handynummer",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "null eins zwei drei vier fünf sechs.",
            "role": "other",
            "label": "หมายเลขโทรศัพท์"
          }
        ]
      ],
      "Berlin": [
        [
          {
            "text": "Berlin",
            "role": "other",
            "label": "ชื่อเมือง"
          }
        ]
      ],
      "Haarfit": [
        [
          {
            "text": "Haarfit",
            "role": "other",
            "label": "ชื่อที่ทำงาน"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Was machst du beruflich?\",\"Ich arbeite als Friseurin. Ich arbeite bei Haarfit.\"]": "/audio/phrases/dialogue-29feaf910a67e597114a.m4a",
      "[\"Was machen Sie beruflich?\",\"Ich bin Lehrerin.\"]": "/audio/phrases/dialogue-6ad995515703668f98ef.m4a",
      "[\"Was macht ihr beruflich?\",\"Wir arbeiten als Friseure.\"]": "/audio/phrases/dialogue-d573466224ebbdf5f5e0.m4a",
      "[\"Wo arbeitest du?\",\"Ich arbeite bei Haarfit.\"]": "/audio/phrases/dialogue-136a6f2aaa427a287265.m4a",
      "[\"Was machst du beruflich?\",\"Ich mache ein Praktikum.\"]": "/audio/phrases/dialogue-9b076679f11ee8ca6f2e.m4a",
      "[\"Und du?\",\"Ich bin angestellt.\"]": "/audio/phrases/dialogue-3242f7a1508f3cc8f9db.m4a",
      "[\"Arbeitest du?\",\"Ich arbeite im Moment nicht.\"]": "/audio/phrases/dialogue-6315293f7bee7adf94a3.m4a",
      "[\"Was machst du im Moment?\",\"Ich mache ein Praktikum.\"]": "/audio/phrases/dialogue-80d1f64dab6f190adb9f.m4a",
      "[\"Wie arbeitest du?\",\"Ich bin angestellt.\"]": "/audio/phrases/dialogue-3ff9fdc8de96514a1a72.m4a",
      "[\"Arbeitest du im Moment?\",\"Ich arbeite im Moment nicht.\"]": "/audio/phrases/dialogue-06c08b8d7f9f2e74d4f8.m4a",
      "[\"Wie alt bist du?\",\"Ich bin vierundzwanzig Jahre alt.\"]": "/audio/phrases/dialogue-1317ad483cee54a89470.m4a",
      "[\"Wie alt bist du?\",\"Ich bin 28 Jahre alt.\"]": "/audio/phrases/dialogue-070b34f56b2c11d5266f.m4a",
      "[\"Wo wohnst du?\",\"Ich wohne in München.\"]": "/audio/phrases/dialogue-c11089389f6f1c3c575c.m4a",
      "[\"Wo wohnt ihr?\",\"Wir wohnen in Berlin.\"]": "/audio/phrases/dialogue-100772b6d1282c73ad07.m4a",
      "[\"Wo wohnst du?\",\"Ich wohne in Bangkok.\"]": "/audio/phrases/dialogue-786ac8710b94750f8208.m4a",
      "[\"Lebt ihr zusammen?\",\"Ja, wir leben zusammen.\"]": "/audio/phrases/dialogue-fb1f4f97aafebfbbda7d.m4a",
      "[\"Seid ihr verheiratet?\",\"Nein, wir sind nicht verheiratet.\"]": "/audio/phrases/dialogue-eb5ae4128251c2a330df.m4a",
      "[\"Habt ihr Kinder?\",\"Nein, wir haben keine Kinder.\"]": "/audio/phrases/dialogue-3194bb418a742ee69475.m4a",
      "[\"Habt ihr Kinder?\",\"Wir haben keine Kinder.\"]": "/audio/phrases/dialogue-a1a38cb887720d934350.m4a",
      "[\"Was machst du beruflich?\",\"Ich arbeite als Verkäufer.\"]": "/audio/phrases/dialogue-fa96b6d53074a87481dc.m4a",
      "[\"Und was ist dein Traumberuf?\",\"Mein Traumberuf ist Arzt.\"]": "/audio/phrases/dialogue-86c2659bed882cc3fc17.m4a",
      "[\"Was ist dein Traumberuf?\",\"Mein Traumberuf ist Arzt.\"]": "/audio/phrases/dialogue-91f47310dcd4e1833915.m4a",
      "[\"Wie ist deine Handynummer?\",\"Meine Handynummer ist null eins zwei drei vier fünf sechs.\"]": "/audio/phrases/dialogue-e26a04235b2bb43d1d25.m4a"
    },
    "turns": {
      "Was machst du beruflich?": {
        "A": "/audio/phrases/turn-3d31fc2e7236e2ac1c16.mp3"
      },
      "Ich arbeite als Friseurin. Ich arbeite bei Haarfit.": {
        "B": "/audio/phrases/turn-fb5e7302a2d532003d62.mp3"
      },
      "Was machen Sie beruflich?": {
        "A": "/audio/phrases/turn-9647ba6a09618d25979d.mp3"
      },
      "Ich bin Lehrerin.": {
        "B": "/audio/phrases/turn-eab94d17ccbe8ab0eae6.mp3"
      },
      "Was macht ihr beruflich?": {
        "A": "/audio/phrases/turn-2a063080a7f475b3c7f9.mp3"
      },
      "Wir arbeiten als Friseure.": {
        "B": "/audio/phrases/turn-2e3a4df6778212316051.mp3"
      },
      "Wo arbeitest du?": {
        "A": "/audio/phrases/turn-854256217bad9fd382b6.mp3"
      },
      "Ich arbeite bei Haarfit.": {
        "B": "/audio/phrases/turn-417c28271f9e9f18b04d.mp3"
      },
      "Ich mache ein Praktikum.": {
        "B": "/audio/phrases/turn-004fc1f578b2ab065c26.mp3"
      },
      "Und du?": {
        "A": "/audio/phrases/turn-467a8ac9b2d6d23021d3.mp3"
      },
      "Ich bin angestellt.": {
        "B": "/audio/phrases/turn-1664e700f38c43af7543.mp3"
      },
      "Arbeitest du?": {
        "A": "/audio/phrases/turn-45eef182a72918eb54a1.mp3"
      },
      "Ich arbeite im Moment nicht.": {
        "B": "/audio/phrases/turn-8b5d8470144a0a1f5295.mp3"
      },
      "Was machst du im Moment?": {
        "A": "/audio/phrases/turn-2ee183a3059923ae793e.mp3"
      },
      "Wie arbeitest du?": {
        "A": "/audio/phrases/turn-e9f4983c77b6262cbe26.mp3"
      },
      "Arbeitest du im Moment?": {
        "A": "/audio/phrases/turn-1b4df54cbed4a0e45292.mp3"
      },
      "Wie alt bist du?": {
        "A": "/audio/phrases/turn-b3c8aa208068214bf9b8.mp3"
      },
      "Ich bin vierundzwanzig Jahre alt.": {
        "B": "/audio/phrases/turn-863e2aabedf0cb91721e.mp3"
      },
      "Ich bin 28 Jahre alt.": {
        "B": "/audio/phrases/turn-fc35e599c2c00774fb37.mp3"
      },
      "Wo wohnst du?": {
        "A": "/audio/phrases/turn-c657f1f8da5babde31dc.mp3"
      },
      "Ich wohne in München.": {
        "B": "/audio/phrases/turn-c372f2264d8ab3d64d6c.mp3"
      },
      "Wo wohnt ihr?": {
        "A": "/audio/phrases/turn-c976dc88dfb151144d2c.mp3"
      },
      "Wir wohnen in Berlin.": {
        "B": "/audio/phrases/turn-390b629d5563d91056e1.mp3"
      },
      "Ich wohne in Bangkok.": {
        "B": "/audio/phrases/turn-975ad24358f2c63b39e0.mp3"
      },
      "Lebt ihr zusammen?": {
        "A": "/audio/phrases/turn-f1b3c967efe71631a0e5.mp3"
      },
      "Ja, wir leben zusammen.": {
        "B": "/audio/phrases/turn-86d6f5fc45793c4d0872.mp3"
      },
      "Seid ihr verheiratet?": {
        "A": "/audio/phrases/turn-6662dcbff4c74b4dea79.mp3"
      },
      "Nein, wir sind nicht verheiratet.": {
        "B": "/audio/phrases/turn-e30277676f2a0c0d10d4.mp3"
      },
      "Habt ihr Kinder?": {
        "A": "/audio/phrases/turn-d46b1023bf47dfa749c3.mp3"
      },
      "Nein, wir haben keine Kinder.": {
        "B": "/audio/phrases/turn-eab815398ff7f06cf036.mp3"
      },
      "Wir haben keine Kinder.": {
        "B": "/audio/phrases/turn-cd71c3db1238dcdc020f.mp3"
      },
      "Ich arbeite als Verkäufer.": {
        "B": "/audio/phrases/turn-ca3697f657b0809fe997.mp3"
      },
      "Und was ist dein Traumberuf?": {
        "A": "/audio/phrases/turn-10b9c4aee01513fbe4f4.mp3"
      },
      "Mein Traumberuf ist Arzt.": {
        "B": "/audio/phrases/turn-22e8b38c58f4e132a282.mp3"
      },
      "Was ist dein Traumberuf?": {
        "A": "/audio/phrases/turn-0989cdd9489eb8e23f60.mp3"
      },
      "Wie ist deine Handynummer?": {
        "A": "/audio/phrases/turn-add09d8852c61f722784.mp3"
      },
      "Meine Handynummer ist null eins zwei drei vier fünf sechs.": {
        "B": "/audio/phrases/turn-6d342b5f28c0c96613fd.mp3"
      }
    },
    "notes": {}
  },
  "L03": {
    "annotations": {
      "Ist das deine Mutter?": [
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "deine Mutter?",
            "role": "other",
            "label": "ความสัมพันธ์ในครอบครัว"
          }
        ]
      ],
      "Nein, das ist meine Schwester Lena.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "meine Schwester Lena.",
            "role": "other",
            "label": "บุคคลและความสัมพันธ์"
          }
        ]
      ],
      "Sind das deine Eltern?": [
        [
          {
            "text": "Sind",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "deine Eltern?",
            "role": "other",
            "label": "ความสัมพันธ์ในครอบครัว"
          }
        ]
      ],
      "Ja, das sind meine Eltern.": [
        [
          {
            "text": "Ja,",
            "role": "other",
            "label": "ตอบรับ"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sind",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "meine Eltern.",
            "role": "other",
            "label": "ความสัมพันธ์ในครอบครัว"
          }
        ]
      ],
      "Lena": [
        [
          {
            "text": "Lena",
            "role": "other",
            "label": "ชื่อบุคคล"
          }
        ]
      ],
      "Deutsch": [
        [
          {
            "text": "Deutsch",
            "role": "other",
            "label": "ชื่อภาษา"
          }
        ]
      ],
      "Wer ist das?": [
        [
          {
            "text": "Wer",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich glaube, das ist Jans Mutter.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธานของประโยคนำ",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "glaube,",
            "role": "verb",
            "label": "กริยาแสดงความเห็น",
            "position": "ตำแหน่ง 2 ของประโยคนำ"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธานของข้อความที่คาดเดา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาของข้อความที่คาดเดา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Jans Mutter.",
            "role": "other",
            "label": "บุคคลที่คาดว่าเป็น"
          }
        ]
      ],
      "Ist das nicht deine Mutter?": [
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "nicht",
            "role": "other",
            "label": "คำถามปฏิเสธ"
          },
          {
            "text": "deine Mutter?",
            "role": "other",
            "label": "ความสัมพันธ์ในครอบครัว"
          }
        ]
      ],
      "Doch, das ist meine Mutter.": [
        [
          {
            "text": "Doch,",
            "role": "other",
            "label": "ยืนยันสิ่งที่คำถามปฏิเสธ"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "meine Mutter.",
            "role": "other",
            "label": "ความสัมพันธ์ในครอบครัว"
          }
        ]
      ],
      "Ist das nicht dein Vater?": [
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "nicht",
            "role": "other",
            "label": "คำถามปฏิเสธ"
          },
          {
            "text": "dein Vater?",
            "role": "other",
            "label": "ความสัมพันธ์ในครอบครัว"
          }
        ]
      ],
      "Nein, das ist mein Onkel.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "mein Onkel.",
            "role": "other",
            "label": "ความสัมพันธ์ในครอบครัว"
          }
        ]
      ],
      "Welche Sprachen sprichst du?": [
        [
          {
            "text": "Welche Sprachen",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sprichst",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich spreche sehr gut Thai und ein bisschen Deutsch.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "spreche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "sehr gut",
            "role": "other",
            "label": "ระดับ: ดีมาก"
          },
          {
            "text": "Thai und ein bisschen Deutsch.",
            "role": "other",
            "label": "ภาษาที่พูด (กรรม)"
          }
        ]
      ],
      "Sprechen Sie Französisch?": [
        [
          {
            "text": "Sprechen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "Französisch?",
            "role": "other",
            "label": "ภาษาที่ถามถึง"
          }
        ]
      ],
      "Nein, gar nicht.": [
        [
          {
            "text": "Nein, gar nicht.",
            "role": "other",
            "label": "ตอบว่าพูดไม่ได้เลย"
          }
        ]
      ],
      "Sprechen Sie Englisch?": [
        [
          {
            "text": "Sprechen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "Englisch?",
            "role": "other",
            "label": "ภาษาที่ถามถึง"
          }
        ]
      ],
      "Ja, ein bisschen.": [
        [
          {
            "text": "Ja, ein bisschen.",
            "role": "other",
            "label": "ตอบว่าพูดได้เล็กน้อย"
          }
        ]
      ],
      "Englisch.": [
        [
          {
            "text": "Englisch.",
            "role": "other",
            "label": "ชื่อภาษา"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Ist das deine Mutter?\",\"Nein, das ist meine Schwester Lena.\"]": "/audio/phrases/dialogue-88376c8f5c988ee7c41c.m4a",
      "[\"Sind das deine Eltern?\",\"Ja, das sind meine Eltern.\"]": "/audio/phrases/dialogue-4c1ee8c108317429de41.m4a",
      "[\"Wer ist das?\",\"Ich glaube, das ist Jans Mutter.\"]": "/audio/phrases/dialogue-9a861513dbe795e97f36.m4a",
      "[\"Ist das nicht deine Mutter?\",\"Doch, das ist meine Mutter.\"]": "/audio/phrases/dialogue-24f225b819eada5d9c67.m4a",
      "[\"Ist das nicht dein Vater?\",\"Nein, das ist mein Onkel.\"]": "/audio/phrases/dialogue-3bb4092cbca3f5943e67.m4a",
      "[\"Welche Sprachen sprichst du?\",\"Ich spreche sehr gut Thai und ein bisschen Deutsch.\"]": "/audio/phrases/dialogue-6dfea20fa126a85b57bd.m4a",
      "[\"Sprechen Sie Französisch?\",\"Nein, gar nicht.\"]": "/audio/phrases/dialogue-eaac5e50503de47ccd20.m4a",
      "[\"Sprechen Sie Englisch?\",\"Ja, ein bisschen.\"]": "/audio/phrases/dialogue-41192e44c6cf174bceb2.m4a"
    },
    "turns": {
      "Ist das deine Mutter?": {
        "A": "/audio/phrases/turn-32c351b2522fa3f6f245.mp3"
      },
      "Nein, das ist meine Schwester Lena.": {
        "B": "/audio/phrases/turn-7eca3685ab648d69e288.mp3"
      },
      "Sind das deine Eltern?": {
        "A": "/audio/phrases/turn-cb2e116c038904ed3763.mp3"
      },
      "Ja, das sind meine Eltern.": {
        "B": "/audio/phrases/turn-c997d86460e0d7f5a9a4.mp3"
      },
      "Wer ist das?": {
        "A": "/audio/phrases/turn-fffd5feed6f15ba93459.mp3"
      },
      "Ich glaube, das ist Jans Mutter.": {
        "B": "/audio/phrases/turn-43a8b5e2806af6b68ae9.mp3"
      },
      "Ist das nicht deine Mutter?": {
        "A": "/audio/phrases/turn-d0bc321b5e37b298c264.mp3"
      },
      "Doch, das ist meine Mutter.": {
        "B": "/audio/phrases/turn-e97f1acb18e42464232b.mp3"
      },
      "Ist das nicht dein Vater?": {
        "A": "/audio/phrases/turn-1c95af7ef86311cd2cc6.mp3"
      },
      "Nein, das ist mein Onkel.": {
        "B": "/audio/phrases/turn-236507032a12968beba4.mp3"
      },
      "Welche Sprachen sprichst du?": {
        "A": "/audio/phrases/turn-79eab116d211558fa1d7.mp3"
      },
      "Ich spreche sehr gut Thai und ein bisschen Deutsch.": {
        "B": "/audio/phrases/turn-8afd0e0f1df0c3997ed3.mp3"
      },
      "Sprechen Sie Französisch?": {
        "A": "/audio/phrases/turn-a512feef8716be3fcda5.mp3"
      },
      "Nein, gar nicht.": {
        "B": "/audio/phrases/turn-07bb04caeffb13416e2d.mp3"
      },
      "Sprechen Sie Englisch?": {
        "A": "/audio/phrases/turn-431b4600912bcc711ab7.mp3"
      },
      "Ja, ein bisschen.": {
        "B": "/audio/phrases/turn-78411ea069113a5fd024.mp3"
      }
    },
    "notes": {}
  },
  "L04": {
    "annotations": {
      "Was kostet der Stuhl?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kostet",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "der Stuhl?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Er kostet 19 Euro 99. Das ist ein Sonderangebot.": [
        [
          {
            "text": "Er",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kostet",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "19 Euro 99.",
            "role": "other",
            "label": "ราคา"
          }
        ],
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ein Sonderangebot.",
            "role": "other",
            "label": "ราคาพิเศษ"
          }
        ]
      ],
      "Wie viel kostet die Lampe?": [
        [
          {
            "text": "Wie viel",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kostet",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Lampe?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Sie kostet 35 Euro.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kostet",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "35 Euro.",
            "role": "other",
            "label": "ราคา"
          }
        ]
      ],
      "Der Schrank ist schön, oder?": [
        [
          {
            "text": "Der Schrank",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "schön,",
            "role": "other",
            "label": "ความเห็นต่อสิ่งของ"
          },
          {
            "text": "oder?",
            "role": "other",
            "label": "ถามยืนยัน"
          }
        ]
      ],
      "Nein, er ist zu groß.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "er",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "zu groß.",
            "role": "other",
            "label": "ใหญ่เกินไป"
          }
        ]
      ],
      "Wie findest du das Bett?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "findest",
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
            "text": "das Bett?",
            "role": "other",
            "label": "สิ่งที่ถามความเห็น (กรรม)"
          }
        ]
      ],
      "Ich finde es wirklich schön. Es ist sehr modern.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finde",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "other",
            "label": "สิ่งที่พูดถึง (กรรม)"
          },
          {
            "text": "wirklich schön.",
            "role": "other",
            "label": "ความเห็น"
          }
        ],
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "sehr modern.",
            "role": "other",
            "label": "คุณสมบัติ"
          }
        ]
      ],
      "Das Sofa ist schön.": [
        [
          {
            "text": "Das Sofa",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "schön.",
            "role": "other",
            "label": "ความเห็นต่อสิ่งของ"
          }
        ]
      ],
      "Das finde ich auch.": [
        [
          {
            "text": "Das",
            "role": "other",
            "label": "สิ่งที่พูดถึง (กรรม)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finde",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "auch.",
            "role": "other",
            "label": "เห็นด้วยเช่นกัน"
          }
        ]
      ],
      "Der Schrank ist praktisch.": [
        [
          {
            "text": "Der Schrank",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "praktisch.",
            "role": "other",
            "label": "ความเห็นต่อสิ่งของ"
          }
        ]
      ],
      "Das finde ich nicht. Er ist zu klein.": [
        [
          {
            "text": "Das",
            "role": "other",
            "label": "สิ่งที่พูดถึง (กรรม)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finde",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "nicht.",
            "role": "other",
            "label": "ไม่เห็นด้วย"
          }
        ],
        [
          {
            "text": "Er",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "zu klein.",
            "role": "other",
            "label": "เล็กเกินไป"
          }
        ]
      ],
      "Das Bild ist schön.": [
        [
          {
            "text": "Das Bild",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "schön.",
            "role": "other",
            "label": "ความเห็นต่อสิ่งของ"
          }
        ]
      ],
      "Findest du?": [
        [
          {
            "text": "Findest",
            "role": "verb",
            "label": "กริยาแสดงความเห็น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Was kostet der Stuhl?\",\"Er kostet 19 Euro 99. Das ist ein Sonderangebot.\"]": "/audio/phrases/dialogue-2e61e973e23eeb9038da.m4a",
      "[\"Wie viel kostet die Lampe?\",\"Sie kostet 35 Euro.\"]": "/audio/phrases/dialogue-b19ce56b29bf05fc187f.m4a",
      "[\"Der Schrank ist schön, oder?\",\"Nein, er ist zu groß.\"]": "/audio/phrases/dialogue-3bec0e846a05ab086a89.m4a",
      "[\"Wie findest du das Bett?\",\"Ich finde es wirklich schön. Es ist sehr modern.\"]": "/audio/phrases/dialogue-aaff2cfdd6d4bfabe8f5.m4a",
      "[\"Das Sofa ist schön.\",\"Das finde ich auch.\"]": "/audio/phrases/dialogue-0fa56122a4c079834adf.m4a",
      "[\"Der Schrank ist praktisch.\",\"Das finde ich nicht. Er ist zu klein.\"]": "/audio/phrases/dialogue-df7c54f3a32b85c04b38.m4a",
      "[\"Das Bild ist schön.\",\"Findest du?\"]": "/audio/phrases/dialogue-cd2d11c9ad2187695bc2.m4a"
    },
    "turns": {
      "Was kostet der Stuhl?": {
        "A": "/audio/phrases/turn-063b17af37c929b637c0.mp3"
      },
      "Er kostet 19 Euro 99. Das ist ein Sonderangebot.": {
        "B": "/audio/phrases/turn-e961b3eca7b327181a73.mp3"
      },
      "Wie viel kostet die Lampe?": {
        "A": "/audio/phrases/turn-732897f810789e161c4e.mp3"
      },
      "Sie kostet 35 Euro.": {
        "B": "/audio/phrases/turn-2f2b3b0c49c36b0697c4.mp3"
      },
      "Der Schrank ist schön, oder?": {
        "A": "/audio/phrases/turn-eafcd2987d7c191fa360.mp3"
      },
      "Nein, er ist zu groß.": {
        "B": "/audio/phrases/turn-0389de316ae355f4e5f7.mp3"
      },
      "Wie findest du das Bett?": {
        "A": "/audio/phrases/turn-eae4424fe66c75afd779.mp3"
      },
      "Ich finde es wirklich schön. Es ist sehr modern.": {
        "B": "/audio/phrases/turn-14a0982f8a6a9cc686f8.mp3"
      },
      "Das Sofa ist schön.": {
        "A": "/audio/phrases/turn-2b0b385eb33861cd016b.mp3"
      },
      "Das finde ich auch.": {
        "B": "/audio/phrases/turn-3cb5f68a405b378b048a.mp3"
      },
      "Der Schrank ist praktisch.": {
        "A": "/audio/phrases/turn-21686b98f8ef9bcc3739.mp3"
      },
      "Das finde ich nicht. Er ist zu klein.": {
        "B": "/audio/phrases/turn-43acf356f27852890464.mp3"
      },
      "Das Bild ist schön.": {
        "A": "/audio/phrases/turn-65cf68efdc7422f246a0.mp3"
      },
      "Findest du?": {
        "B": "/audio/phrases/turn-7c6c7d58d54a609ab4a7.mp3"
      }
    },
    "notes": {}
  },
  "L05": {
    "annotations": {
      "Entschuldigung, wie heißt das auf Deutsch?": [
        [
          {
            "text": "Entschuldigung,",
            "role": "other",
            "label": "ขอรบกวนอย่างสุภาพ"
          },
          {
            "text": "wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "heißt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "auf Deutsch?",
            "role": "other",
            "label": "ภาษาเยอรมัน"
          }
        ]
      ],
      "Das ist ein Schirm.": [
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ein Schirm.",
            "role": "other",
            "label": "คำเรียกสิ่งของ"
          }
        ]
      ],
      "Wie schreibt man Schirm?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "schreibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "man",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "Schirm?",
            "role": "other",
            "label": "คำที่ขอให้สะกด"
          }
        ]
      ],
      "S-C-H-I-R-M.": [
        [
          {
            "text": "S-C-H-I-R-M.",
            "role": "other",
            "label": "สะกดคำทีละตัว"
          }
        ]
      ],
      "Wie heißt das auf Deutsch?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "heißt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "auf Deutsch?",
            "role": "other",
            "label": "ภาษาเยอรมัน"
          }
        ]
      ],
      "Ich weiß nicht.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "weiß",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nicht.",
            "role": "other",
            "label": "ปฏิเสธ: ไม่ทราบ"
          }
        ]
      ],
      "Schirm": [
        [
          {
            "text": "Schirm",
            "role": "other",
            "label": "คำศัพท์ที่สะกด"
          }
        ]
      ],
      "Ist es aus Plastik?": [
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "aus Plastik?",
            "role": "other",
            "label": "วัสดุ"
          }
        ]
      ],
      "Nein, es ist aus Glas.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "aus Glas.",
            "role": "other",
            "label": "วัสดุ"
          }
        ]
      ],
      "Ist es blau?": [
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "blau?",
            "role": "other",
            "label": "สี"
          }
        ]
      ],
      "Nein, es ist grün.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "grün.",
            "role": "other",
            "label": "สี"
          }
        ]
      ],
      "Noch einmal, bitte.": [
        [
          {
            "text": "Noch einmal, bitte.",
            "role": "other",
            "label": "ขอให้พูดซ้ำ"
          }
        ]
      ],
      "Danke schön.": [
        [
          {
            "text": "Danke schön.",
            "role": "other",
            "label": "ขอบคุณ"
          }
        ]
      ],
      "Bitte, sehr gern.": [
        [
          {
            "text": "Bitte, sehr gern.",
            "role": "other",
            "label": "ตอบรับคำขอบคุณ"
          }
        ]
      ],
      "Wie ist deine E-Mail-Adresse?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "deine E-Mail-Adresse?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "M-A-L-I Unterstrich 87 at example Punkt com.": [
        [
          {
            "text": "M-A-L-I Unterstrich 87 at example Punkt com.",
            "role": "other",
            "label": "บอกอีเมลทีละส่วน"
          }
        ]
      ],
      "nora_42@example.com": [
        [
          {
            "text": "nora_42@example.com",
            "role": "other",
            "label": "ที่อยู่อีเมล"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Entschuldigung, wie heißt das auf Deutsch?\",\"Das ist ein Schirm.\"]": "/audio/phrases/dialogue-af2739f0e91340544cd4.m4a",
      "[\"Wie schreibt man Schirm?\",\"S-C-H-I-R-M.\"]": "/audio/phrases/dialogue-55c8bd870b476b537fba.m4a",
      "[\"Wie heißt das auf Deutsch?\",\"Ich weiß nicht.\"]": "/audio/phrases/dialogue-0c4aea4a560e427660cf.m4a",
      "[\"Ist es aus Plastik?\",\"Nein, es ist aus Glas.\"]": "/audio/phrases/dialogue-d3d6d58ee45e6c8f9ade.m4a",
      "[\"Ist es blau?\",\"Nein, es ist grün.\"]": "/audio/phrases/dialogue-f8aa2e2ff02a03c5145b.m4a",
      "[\"Das ist ein Schirm.\",\"Noch einmal, bitte.\"]": "/audio/phrases/dialogue-819b0392e94b2e14fe01.m4a",
      "[\"S-C-H-I-R-M.\",\"Danke schön.\"]": "/audio/phrases/dialogue-c6c19d16d305b07d53b0.m4a",
      "[\"Danke schön.\",\"Bitte, sehr gern.\"]": "/audio/phrases/dialogue-cd6b8582f7a21246c53b.m4a",
      "[\"Wie ist deine E-Mail-Adresse?\",\"M-A-L-I Unterstrich 87 at example Punkt com.\"]": "/audio/phrases/dialogue-b87ac76ac0b7084c9833.m4a"
    },
    "turns": {
      "Entschuldigung, wie heißt das auf Deutsch?": {
        "A": "/audio/phrases/turn-ac90fe03a93e6d55a27f.mp3"
      },
      "Das ist ein Schirm.": {
        "B": "/audio/phrases/turn-dbd78cacaf467ff2e8e2.mp3",
        "A": "/audio/phrases/turn-35b57d55c199569cc67c.mp3"
      },
      "Wie schreibt man Schirm?": {
        "A": "/audio/phrases/turn-b21b0998754e5502aff0.mp3"
      },
      "S-C-H-I-R-M.": {
        "B": "/audio/phrases/turn-f8e9ba10ef109d41a955.mp3",
        "A": "/audio/phrases/turn-76dcf0cfa07c30025084.mp3"
      },
      "Wie heißt das auf Deutsch?": {
        "A": "/audio/phrases/turn-ebe41d080033ebd654e8.mp3"
      },
      "Ich weiß nicht.": {
        "B": "/audio/phrases/turn-f9419f551564ee1fc9c7.mp3"
      },
      "Ist es aus Plastik?": {
        "A": "/audio/phrases/turn-c6b1d8fac9a88ca636e6.mp3"
      },
      "Nein, es ist aus Glas.": {
        "B": "/audio/phrases/turn-1f7276fdebbbc12baf89.mp3"
      },
      "Ist es blau?": {
        "A": "/audio/phrases/turn-8591bd2d8589eceba293.mp3"
      },
      "Nein, es ist grün.": {
        "B": "/audio/phrases/turn-62cbb8f618f99fb20af2.mp3"
      },
      "Noch einmal, bitte.": {
        "B": "/audio/phrases/turn-d6557b6708863f898985.mp3"
      },
      "Danke schön.": {
        "B": "/audio/phrases/turn-fe77ea95fb1d419df9d9.mp3",
        "A": "/audio/phrases/turn-af72ccaf32c1cb7a525d.mp3"
      },
      "Bitte, sehr gern.": {
        "B": "/audio/phrases/turn-308c158f1d7aab7a727a.mp3"
      },
      "Wie ist deine E-Mail-Adresse?": {
        "A": "/audio/phrases/turn-c6e32e613b3cad717cfd.mp3"
      },
      "M-A-L-I Unterstrich 87 at example Punkt com.": {
        "B": "/audio/phrases/turn-e821d2d8fb2989fface7.mp3"
      }
    },
    "notes": {}
  },
  "L06": {
    "annotations": {
      "Guten Tag.": [
        [
          {
            "text": "Guten Tag.",
            "role": "other",
            "label": "ทักทายอย่างสุภาพ"
          }
        ]
      ],
      "Firma Nord, guten Tag. Hier ist Anna Weber.": [
        [
          {
            "text": "Firma Nord, guten Tag.",
            "role": "other",
            "label": "ทักทายและบอกชื่อบริษัท"
          }
        ],
        [
          {
            "text": "Hier",
            "role": "other",
            "label": "แนะนำผู้รับสาย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Anna Weber.",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Firma Nord, Anna Weber, guten Tag.": [
        [
          {
            "text": "Firma Nord, Anna Weber, guten Tag.",
            "role": "other",
            "label": "ผู้รับสายบอกบริษัท ชื่อ และทักทาย"
          }
        ]
      ],
      "Guten Tag, Paul Klein hier. Ist Frau Meier da?": [
        [
          {
            "text": "Guten Tag, Paul Klein hier.",
            "role": "other",
            "label": "ผู้โทรทักทายและบอกชื่อ"
          }
        ],
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Frau Meier",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "da?",
            "role": "other",
            "label": "อยู่รับสายหรือไม่"
          }
        ]
      ],
      "Guten Tag, Paul Klein hier.": [
        [
          {
            "text": "Guten Tag, Paul Klein hier.",
            "role": "other",
            "label": "ผู้โทรทักทายและบอกชื่อ"
          }
        ]
      ],
      "Guten Tag, Herr Klein. Was kann ich für Sie tun?": [
        [
          {
            "text": "Guten Tag, Herr Klein.",
            "role": "other",
            "label": "ทักทายคู่สนทนาอย่างสุภาพ"
          }
        ],
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kann",
            "role": "auxiliary",
            "label": "กริยาช่วย können (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "für Sie",
            "role": "other",
            "label": "ผู้รับความช่วยเหลือ"
          },
          {
            "text": "tun?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ist Frau Meier da?": [
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Frau Meier",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "da?",
            "role": "other",
            "label": "อยู่รับสายหรือไม่"
          }
        ]
      ],
      "Einen Moment bitte.": [
        [
          {
            "text": "Einen Moment bitte.",
            "role": "other",
            "label": "ขอให้รอสักครู่"
          }
        ]
      ],
      "Frau Meier ist leider nicht da.": [
        [
          {
            "text": "Frau Meier",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "leider",
            "role": "other",
            "label": "แสดงความเสียดาย"
          },
          {
            "text": "nicht da.",
            "role": "other",
            "label": "สถานะ: ไม่อยู่"
          }
        ]
      ],
      "Vielen Dank. Auf Wiederhören.": [
        [
          {
            "text": "Vielen Dank.",
            "role": "other",
            "label": "ขอบคุณอย่างสุภาพ"
          }
        ],
        [
          {
            "text": "Auf Wiederhören.",
            "role": "other",
            "label": "ลาทางโทรศัพท์"
          }
        ]
      ],
      "Sehr gern. Auf Wiederhören, Herr Klein.": [
        [
          {
            "text": "Sehr gern.",
            "role": "other",
            "label": "ตอบรับคำขอบคุณ"
          }
        ],
        [
          {
            "text": "Auf Wiederhören, Herr Klein.",
            "role": "other",
            "label": "ลาคู่สนทนาทางโทรศัพท์"
          }
        ]
      ],
      "Frau Meier ist nicht da.": [
        [
          {
            "text": "Frau Meier",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nicht da.",
            "role": "other",
            "label": "สถานะ: ไม่อยู่"
          }
        ]
      ],
      "Was brauchst du?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "brauchst",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Ich brauche einen Stift.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "brauche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "einen Stift.",
            "role": "other",
            "label": "สิ่งที่ต้องการ (กรรม)"
          }
        ]
      ],
      "Hast du einen Stift?": [
        [
          {
            "text": "Hast",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "einen Stift?",
            "role": "other",
            "label": "สิ่งของที่ถามถึง (กรรม)"
          }
        ]
      ],
      "Nein, ich habe keinen Stift.": [
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
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "keinen Stift.",
            "role": "other",
            "label": "ไม่มีปากกา (กรรม)"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Guten Tag.\",\"Firma Nord, guten Tag. Hier ist Anna Weber.\"]": "/audio/phrases/dialogue-e61dfe97eb15c945d500.m4a",
      "[\"Firma Nord, Anna Weber, guten Tag.\",\"Guten Tag, Paul Klein hier. Ist Frau Meier da?\"]": "/audio/phrases/dialogue-648fdd82b7198b21c0ba.m4a",
      "[\"Guten Tag, Paul Klein hier.\",\"Guten Tag, Herr Klein. Was kann ich für Sie tun?\"]": "/audio/phrases/dialogue-16c7d052689dbd13b199.m4a",
      "[\"Ist Frau Meier da?\",\"Einen Moment bitte.\"]": "/audio/phrases/dialogue-636b836f3bf5012a52ba.m4a",
      "[\"Ist Frau Meier da?\",\"Frau Meier ist leider nicht da.\"]": "/audio/phrases/dialogue-29640a2d1e341fcddbc3.m4a",
      "[\"Frau Meier ist leider nicht da.\",\"Vielen Dank. Auf Wiederhören.\"]": "/audio/phrases/dialogue-91576c1ab2605ebae8b6.m4a",
      "[\"Vielen Dank. Auf Wiederhören.\",\"Sehr gern. Auf Wiederhören, Herr Klein.\"]": "/audio/phrases/dialogue-8209931a30c96d08784f.m4a",
      "[\"Was brauchst du?\",\"Ich brauche einen Stift.\"]": "/audio/phrases/dialogue-4d65affcee844427ecd6.m4a",
      "[\"Hast du einen Stift?\",\"Nein, ich habe keinen Stift.\"]": "/audio/phrases/dialogue-ffba58f8ef9e8e7c271a.m4a"
    },
    "turns": {
      "Guten Tag.": {
        "A": "/audio/phrases/turn-35b3bc6a20d4c7cd0b43.mp3"
      },
      "Firma Nord, guten Tag. Hier ist Anna Weber.": {
        "B": "/audio/phrases/turn-0e6b5fd35bd2bc24d15e.mp3"
      },
      "Firma Nord, Anna Weber, guten Tag.": {
        "A": "/audio/phrases/turn-e322c51c1839a3cf7272.mp3"
      },
      "Guten Tag, Paul Klein hier. Ist Frau Meier da?": {
        "B": "/audio/phrases/turn-1113205cffea906aa189.mp3"
      },
      "Guten Tag, Paul Klein hier.": {
        "A": "/audio/phrases/turn-ba8486e5f1f4b5819485.mp3"
      },
      "Guten Tag, Herr Klein. Was kann ich für Sie tun?": {
        "B": "/audio/phrases/turn-9f84b0e87d788a59aca2.mp3"
      },
      "Ist Frau Meier da?": {
        "A": "/audio/phrases/turn-c0f64b7971d9d3acba43.mp3"
      },
      "Einen Moment bitte.": {
        "B": "/audio/phrases/turn-1bb989c1c97ade3fcd8c.mp3"
      },
      "Frau Meier ist leider nicht da.": {
        "B": "/audio/phrases/turn-0e26913c874fe4d01047.mp3",
        "A": "/audio/phrases/turn-5636cdf126ec2cf65a0c.mp3"
      },
      "Vielen Dank. Auf Wiederhören.": {
        "B": "/audio/phrases/turn-02a586545033c8e24b26.mp3",
        "A": "/audio/phrases/turn-501c34a6eac316cc80da.mp3"
      },
      "Sehr gern. Auf Wiederhören, Herr Klein.": {
        "B": "/audio/phrases/turn-1afffd1fdff4cc37e5a2.mp3"
      },
      "Was brauchst du?": {
        "A": "/audio/phrases/turn-fffded64b45ff7c04da3.mp3"
      },
      "Ich brauche einen Stift.": {
        "B": "/audio/phrases/turn-f02920dcd82662d3e33d.mp3"
      },
      "Hast du einen Stift?": {
        "A": "/audio/phrases/turn-76c8f05df17dc0d46f99.mp3"
      },
      "Nein, ich habe keinen Stift.": {
        "B": "/audio/phrases/turn-2046e1766b0222fe63ca.mp3"
      }
    },
    "notes": {}
  },
  "L07": {
    "annotations": {
      "Kannst du schwimmen?": [
        [
          {
            "text": "Kannst",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "schwimmen?",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ja, ein bisschen.": [
        [
          {
            "text": "Ja, ein bisschen.",
            "role": "other",
            "label": "ทำได้เล็กน้อย"
          }
        ]
      ],
      "Kannst du gut kochen?": [
        [
          {
            "text": "Kannst",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "gut",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "kochen?",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Nein, ich kann nicht so gut kochen.": [
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
            "text": "kann",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nicht so gut",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "kochen.",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Könnt ihr Tennis spielen?": [
        [
          {
            "text": "Könnt",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ihr",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "Tennis",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "spielen?",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ja, wir können Tennis spielen.": [
        [
          {
            "text": "Ja,",
            "role": "other",
            "label": "ตอบรับ"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "können",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Tennis",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "spielen.",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Können Sie reiten?": [
        [
          {
            "text": "Können",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "reiten?",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ja, ich kann reiten.": [
        [
          {
            "text": "Ja,",
            "role": "other",
            "label": "ตอบรับ"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kann",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "reiten.",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Sehr gut.": [
        [
          {
            "text": "Sehr gut.",
            "role": "other",
            "label": "ระดับความสามารถดีมาก"
          }
        ]
      ],
      "Du kannst wirklich toll tanzen!": [
        [
          {
            "text": "Du",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kannst",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "wirklich toll",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "tanzen!",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Oh, danke!": [
        [
          {
            "text": "Oh, danke!",
            "role": "other",
            "label": "กล่าวขอบคุณ"
          }
        ]
      ],
      "Sie können sehr gut malen!": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "können",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "sehr gut",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "malen!",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Herzlichen Dank!": [
        [
          {
            "text": "Herzlichen Dank!",
            "role": "other",
            "label": "กล่าวขอบคุณ"
          }
        ]
      ],
      "Was sind deine Hobbys?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sind",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "deine Hobbys?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Meine Hobbys sind Schwimmen und Radfahren.": [
        [
          {
            "text": "Meine Hobbys",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sind",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Schwimmen und Radfahren.",
            "role": "other",
            "label": "ส่วนบอกลักษณะ"
          }
        ]
      ],
      "Was machst du in deiner Freizeit?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "machst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "in deiner Freizeit?",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Ich spiele gern Fußball. Das macht Spaß.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "spiele",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "gern",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "Fußball.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ],
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "macht",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Spaß.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Wie oft liest du?": [
        [
          {
            "text": "Wie oft",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "liest",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Ich lese oft.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "lese",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "oft.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Wie oft fährst du Ski?": [
        [
          {
            "text": "Wie oft",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "fährst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "Ski?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich fahre nie Ski.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "fahre",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nie",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "Ski.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Wie oft spielst du Tennis?": [
        [
          {
            "text": "Wie oft",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "spielst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "Tennis?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich spiele manchmal Tennis.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "spiele",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "manchmal",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "Tennis.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Wie oft hörst du in deiner Freizeit Musik?": [
        [
          {
            "text": "Wie oft",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hörst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "in deiner Freizeit",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "Musik?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich höre in meiner Freizeit immer Musik.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "höre",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "in meiner Freizeit",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "immer",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "Musik.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Kannst du schwimmen?\",\"Ja, ein bisschen.\"]": "/audio/phrases/dialogue-3311b967b7b662c25e13.m4a",
      "[\"Kannst du gut kochen?\",\"Nein, ich kann nicht so gut kochen.\"]": "/audio/phrases/dialogue-d2760baf84d9c1ba746c.m4a",
      "[\"Könnt ihr Tennis spielen?\",\"Ja, wir können Tennis spielen.\"]": "/audio/phrases/dialogue-5e4661412ae2d30218f4.m4a",
      "[\"Können Sie reiten?\",\"Ja, ich kann reiten.\"]": "/audio/phrases/dialogue-feb4140cf59365def8ad.m4a",
      "[\"Du kannst wirklich toll tanzen!\",\"Oh, danke!\"]": "/audio/phrases/dialogue-0036bbe83a93658a052b.m4a",
      "[\"Sie können sehr gut malen!\",\"Herzlichen Dank!\"]": "/audio/phrases/dialogue-785df789040b183bad6d.m4a",
      "[\"Was sind deine Hobbys?\",\"Meine Hobbys sind Schwimmen und Radfahren.\"]": "/audio/phrases/dialogue-71f3a79efc3df114c10e.m4a",
      "[\"Was machst du in deiner Freizeit?\",\"Ich spiele gern Fußball. Das macht Spaß.\"]": "/audio/phrases/dialogue-aa6cf025a117b457d545.m4a",
      "[\"Wie oft liest du?\",\"Ich lese oft.\"]": "/audio/phrases/dialogue-19c129a3b3b319d4b9a1.m4a",
      "[\"Wie oft fährst du Ski?\",\"Ich fahre nie Ski.\"]": "/audio/phrases/dialogue-2925cc0f85756bc53f18.m4a",
      "[\"Wie oft spielst du Tennis?\",\"Ich spiele manchmal Tennis.\"]": "/audio/phrases/dialogue-f9494f037d9314377c1b.m4a",
      "[\"Wie oft hörst du in deiner Freizeit Musik?\",\"Ich höre in meiner Freizeit immer Musik.\"]": "/audio/phrases/dialogue-9b85ff2266a4d53379da.m4a"
    },
    "turns": {
      "Kannst du schwimmen?": {
        "A": "/audio/phrases/turn-06c97a75b3470f18e78d.mp3"
      },
      "Ja, ein bisschen.": {
        "B": "/audio/phrases/turn-78411ea069113a5fd024.mp3"
      },
      "Kannst du gut kochen?": {
        "A": "/audio/phrases/turn-376a94ae62c55be7c770.mp3"
      },
      "Nein, ich kann nicht so gut kochen.": {
        "B": "/audio/phrases/turn-580ca9c03bae43eed74e.mp3"
      },
      "Könnt ihr Tennis spielen?": {
        "A": "/audio/phrases/turn-b5de3799206700917fce.mp3"
      },
      "Ja, wir können Tennis spielen.": {
        "B": "/audio/phrases/turn-5768842994886671490f.mp3"
      },
      "Können Sie reiten?": {
        "A": "/audio/phrases/turn-4104f76b8ac4ca1f6183.mp3"
      },
      "Ja, ich kann reiten.": {
        "B": "/audio/phrases/turn-0728fe72e2572d0eba32.mp3"
      },
      "Du kannst wirklich toll tanzen!": {
        "A": "/audio/phrases/turn-4c7870c313deef2f2da2.mp3"
      },
      "Oh, danke!": {
        "B": "/audio/phrases/turn-10dd56ceb94087a261c1.mp3"
      },
      "Sie können sehr gut malen!": {
        "A": "/audio/phrases/turn-169bd01335dc93288f7b.mp3"
      },
      "Herzlichen Dank!": {
        "B": "/audio/phrases/turn-73d0a63ee813d218a24c.mp3"
      },
      "Was sind deine Hobbys?": {
        "A": "/audio/phrases/turn-d3159c69f1d0d9af5021.mp3"
      },
      "Meine Hobbys sind Schwimmen und Radfahren.": {
        "B": "/audio/phrases/turn-809a34b5b2ec61c95228.mp3"
      },
      "Was machst du in deiner Freizeit?": {
        "A": "/audio/phrases/turn-3a7f658223b0772d13a0.mp3"
      },
      "Ich spiele gern Fußball. Das macht Spaß.": {
        "B": "/audio/phrases/turn-f022ed947a77c588cf35.mp3"
      },
      "Wie oft liest du?": {
        "A": "/audio/phrases/turn-f591d47539108587dcfd.mp3"
      },
      "Ich lese oft.": {
        "B": "/audio/phrases/turn-f9131bd0c260610d304c.mp3"
      },
      "Wie oft fährst du Ski?": {
        "A": "/audio/phrases/turn-dcfd17775833f5356d31.mp3"
      },
      "Ich fahre nie Ski.": {
        "B": "/audio/phrases/turn-0d98961f1b98034a2f43.mp3"
      },
      "Wie oft spielst du Tennis?": {
        "A": "/audio/phrases/turn-fd99955082952524bdf1.mp3"
      },
      "Ich spiele manchmal Tennis.": {
        "B": "/audio/phrases/turn-538361a8c3987efc251c.mp3"
      },
      "Wie oft hörst du in deiner Freizeit Musik?": {
        "A": "/audio/phrases/turn-e08a53fa3b6caddb9679.mp3"
      },
      "Ich höre in meiner Freizeit immer Musik.": {
        "B": "/audio/phrases/turn-fb531aa05feb09668724.mp3"
      }
    },
    "notes": {}
  },
  "L08": {
    "annotations": {
      "Was machen wir heute Abend?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "machen",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "heute Abend?",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Gehen wir ins Kino?": [
        [
          {
            "text": "Gehen",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "ins Kino?",
            "role": "other",
            "label": "สถานที่"
          }
        ]
      ],
      "Wann treffen wir uns?": [
        [
          {
            "text": "Wann",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "treffen",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "uns?",
            "role": "other",
            "label": "คำสะท้อนกลับ"
          }
        ]
      ],
      "Um vier Uhr.": [
        [
          {
            "text": "Um vier Uhr.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Gehen wir heute Abend ins Kino?": [
        [
          {
            "text": "Gehen",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "heute Abend",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "ins Kino?",
            "role": "other",
            "label": "สถานที่"
          }
        ]
      ],
      "Ja, gern. Gute Idee!": [
        [
          {
            "text": "Ja, gern.",
            "role": "other",
            "label": "ตอบรับคำชวน"
          }
        ],
        [
          {
            "text": "Gute Idee!",
            "role": "other",
            "label": "เห็นด้วยกับข้อเสนอ"
          }
        ]
      ],
      "Hast du heute Abend Zeit?": [
        [
          {
            "text": "Hast",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "heute Abend",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "Zeit?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Tut mir leid, heute Abend habe ich keine Zeit. Vielleicht morgen?": [
        [
          {
            "text": "Tut mir leid,",
            "role": "other",
            "label": "ขอโทษก่อนปฏิเสธ"
          },
          {
            "text": "heute Abend",
            "role": "time",
            "label": "เวลา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "habe",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "keine Zeit.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ],
        [
          {
            "text": "Vielleicht morgen?",
            "role": "other",
            "label": "เสนอวันพรุ่งนี้"
          }
        ]
      ],
      "Kannst du am Samstag?": [
        [
          {
            "text": "Kannst",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "am Samstag?",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Das weiß ich noch nicht.": [
        [
          {
            "text": "Das",
            "role": "other",
            "label": "ส่วนเติมเต็ม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "weiß",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "noch nicht.",
            "role": "other",
            "label": "คำขยาย"
          }
        ]
      ],
      "Treffen wir uns um sieben Uhr?": [
        [
          {
            "text": "Treffen",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "uns",
            "role": "other",
            "label": "คำสะท้อนกลับ"
          },
          {
            "text": "um sieben Uhr?",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Tut mir leid, ich kann leider nicht. Ich arbeite am Abend.": [
        [
          {
            "text": "Tut mir leid,",
            "role": "other",
            "label": "ขอโทษก่อนปฏิเสธ"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kann",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "leider nicht.",
            "role": "other",
            "label": "คำขยาย"
          }
        ],
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "arbeite",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "am Abend.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Wie spät ist es?": [
        [
          {
            "text": "Wie spät",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Es ist halb vier.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "halb vier.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Wie viel Uhr ist es?": [
        [
          {
            "text": "Wie viel Uhr",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Es ist Viertel nach drei.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Viertel nach drei.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Es ist Viertel vor vier.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Viertel vor vier.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Es ist fünf nach halb vier.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "fünf nach halb vier.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Es ist fünf vor halb vier.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "fünf vor halb vier.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Was machen wir heute Abend?\",\"Gehen wir ins Kino?\"]": "/audio/phrases/dialogue-da3d6364729c339e8f2a.m4a",
      "[\"Wann treffen wir uns?\",\"Um vier Uhr.\"]": "/audio/phrases/dialogue-33db0a2bb51c32ac22e8.m4a",
      "[\"Gehen wir heute Abend ins Kino?\",\"Ja, gern. Gute Idee!\"]": "/audio/phrases/dialogue-77c98393da537c79a94f.m4a",
      "[\"Hast du heute Abend Zeit?\",\"Tut mir leid, heute Abend habe ich keine Zeit. Vielleicht morgen?\"]": "/audio/phrases/dialogue-edda15f0cf947db6f2d4.m4a",
      "[\"Kannst du am Samstag?\",\"Das weiß ich noch nicht.\"]": "/audio/phrases/dialogue-588e36c6384131715a22.m4a",
      "[\"Treffen wir uns um sieben Uhr?\",\"Tut mir leid, ich kann leider nicht. Ich arbeite am Abend.\"]": "/audio/phrases/dialogue-6a35f72e0d239cf1417b.m4a",
      "[\"Wie spät ist es?\",\"Es ist halb vier.\"]": "/audio/phrases/dialogue-b140e33772b78302d389.m4a",
      "[\"Wie viel Uhr ist es?\",\"Es ist Viertel nach drei.\"]": "/audio/phrases/dialogue-1fe043f69e8008710bed.m4a",
      "[\"Wie spät ist es?\",\"Es ist Viertel vor vier.\"]": "/audio/phrases/dialogue-9bb2e6ef76c8923a6bf4.m4a",
      "[\"Wie spät ist es?\",\"Es ist fünf nach halb vier.\"]": "/audio/phrases/dialogue-0809e7704cdbb7064abc.m4a",
      "[\"Wie spät ist es?\",\"Es ist fünf vor halb vier.\"]": "/audio/phrases/dialogue-733d96d10fa056019de5.m4a"
    },
    "turns": {
      "Was machen wir heute Abend?": {
        "A": "/audio/phrases/turn-c0ab1d3dbea73702c0bd.mp3"
      },
      "Gehen wir ins Kino?": {
        "B": "/audio/phrases/turn-c724402f6d42dcc64b67.mp3"
      },
      "Wann treffen wir uns?": {
        "A": "/audio/phrases/turn-29ecf42671bb103a72ac.mp3"
      },
      "Um vier Uhr.": {
        "B": "/audio/phrases/turn-924aaabf4655f578096f.mp3"
      },
      "Gehen wir heute Abend ins Kino?": {
        "A": "/audio/phrases/turn-606081950e67a034e839.mp3"
      },
      "Ja, gern. Gute Idee!": {
        "B": "/audio/phrases/turn-051ddf2731012d9efd02.mp3"
      },
      "Hast du heute Abend Zeit?": {
        "A": "/audio/phrases/turn-19942d70413204e22cf1.mp3"
      },
      "Tut mir leid, heute Abend habe ich keine Zeit. Vielleicht morgen?": {
        "B": "/audio/phrases/turn-25cf2a80bfe6336a00c5.mp3"
      },
      "Kannst du am Samstag?": {
        "A": "/audio/phrases/turn-9111189a59b262925bfe.mp3"
      },
      "Das weiß ich noch nicht.": {
        "B": "/audio/phrases/turn-11fd2960aa61516fde14.mp3"
      },
      "Treffen wir uns um sieben Uhr?": {
        "A": "/audio/phrases/turn-4af1aab5941ff834cb33.mp3"
      },
      "Tut mir leid, ich kann leider nicht. Ich arbeite am Abend.": {
        "B": "/audio/phrases/turn-eb0fd18cbdb5fe4407a8.mp3"
      },
      "Wie spät ist es?": {
        "A": "/audio/phrases/turn-72c6cb31399043d7857f.mp3"
      },
      "Es ist halb vier.": {
        "B": "/audio/phrases/turn-5982cc3ddc46a366c742.mp3"
      },
      "Wie viel Uhr ist es?": {
        "A": "/audio/phrases/turn-48247d2aafb07f2a77c3.mp3"
      },
      "Es ist Viertel nach drei.": {
        "B": "/audio/phrases/turn-107f81c080c2f650b11a.mp3"
      },
      "Es ist Viertel vor vier.": {
        "B": "/audio/phrases/turn-4730f00d54899f8a9a26.mp3"
      },
      "Es ist fünf nach halb vier.": {
        "B": "/audio/phrases/turn-99ae848a52411800f72b.mp3"
      },
      "Es ist fünf vor halb vier.": {
        "B": "/audio/phrases/turn-27bafda94f8e3003980b.mp3"
      }
    },
    "notes": {}
  },
  "L09": {
    "annotations": {
      "Was isst du gern zum Frühstück?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "isst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "gern",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "zum Frühstück?",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Zum Frühstück esse ich gern Brot mit Marmelade.": [
        [
          {
            "text": "Zum Frühstück",
            "role": "time",
            "label": "เวลา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "esse",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "gern",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "Brot mit Marmelade.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Was magst du besonders gern?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "magst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "besonders gern?",
            "role": "other",
            "label": "คำขยาย"
          }
        ]
      ],
      "Ich mag besonders gern Schokolade.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "mag",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "besonders gern",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "Schokolade.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Guten Tag! Sie wünschen?": [
        [
          {
            "text": "Guten Tag!",
            "role": "other",
            "label": "กล่าวทักทาย"
          }
        ],
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "wünschen?",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          }
        ]
      ],
      "Eine Tasse Kaffee und einen Kuchen, bitte.": [
        [
          {
            "text": "Eine Tasse Kaffee und einen Kuchen, bitte.",
            "role": "other",
            "label": "สั่งกาแฟกับเค้ก"
          }
        ]
      ],
      "Möchten Sie einen Kuchen?": [
        [
          {
            "text": "Möchten",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "einen Kuchen?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Nein, danke.": [
        [
          {
            "text": "Nein, danke.",
            "role": "other",
            "label": "ปฏิเสธอย่างสุภาพ"
          }
        ]
      ],
      "Was möchten Sie?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "möchten",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Ich möchte einen Salat, bitte.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "möchte",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "einen Salat,",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "bitte.",
            "role": "other",
            "label": "คำขยาย"
          }
        ]
      ],
      "Eine Tasse Kaffee und einen Kuchen.": [
        [
          {
            "text": "Eine Tasse Kaffee und einen Kuchen.",
            "role": "other",
            "label": "สั่งกาแฟกับเค้ก"
          }
        ]
      ],
      "Salat": [
        [
          {
            "text": "Salat",
            "role": "other",
            "label": "อาหารที่ต้องการ"
          }
        ]
      ],
      "Kuchen": [
        [
          {
            "text": "Kuchen",
            "role": "other",
            "label": "อาหารที่ต้องการ"
          }
        ]
      ],
      "Tut mir leid, wir haben keinen Schokoladenkuchen mehr.": [
        [
          {
            "text": "Tut mir leid,",
            "role": "other",
            "label": "ขอโทษก่อนแจ้งของหมด"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "haben",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "keinen Schokoladenkuchen mehr.",
            "role": "other",
            "label": "สิ่งที่ไม่มีเหลือแล้ว (กรรม)"
          }
        ]
      ],
      "Schade, dann nehme ich einen Apfelkuchen.": [
        [
          {
            "text": "Schade,",
            "role": "other",
            "label": "แสดงความเสียดาย"
          },
          {
            "text": "dann",
            "role": "sequence",
            "label": "ถ้าอย่างนั้น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "nehme",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "einen Apfelkuchen.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ein Eis, bitte.": [
        [
          {
            "text": "Ein Eis, bitte.",
            "role": "other",
            "label": "สั่งไอศกรีม"
          }
        ]
      ],
      "Tut mir leid, wir haben kein Eis mehr.": [
        [
          {
            "text": "Tut mir leid,",
            "role": "other",
            "label": "ขอโทษก่อนแจ้งของหมด"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "haben",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "kein Eis",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "mehr.",
            "role": "other",
            "label": "คำขยาย"
          }
        ]
      ],
      "Guten Appetit!": [
        [
          {
            "text": "Guten Appetit!",
            "role": "other",
            "label": "อวยพรก่อนกิน"
          }
        ]
      ],
      "Danke, gleichfalls!": [
        [
          {
            "text": "Danke, gleichfalls!",
            "role": "other",
            "label": "ขอบคุณและอวยพรกลับ"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Was isst du gern zum Frühstück?\",\"Zum Frühstück esse ich gern Brot mit Marmelade.\"]": "/audio/phrases/dialogue-8cd39b4df21096ee0756.m4a",
      "[\"Was magst du besonders gern?\",\"Ich mag besonders gern Schokolade.\"]": "/audio/phrases/dialogue-402e684f5daecfe7d626.m4a",
      "[\"Guten Tag! Sie wünschen?\",\"Eine Tasse Kaffee und einen Kuchen, bitte.\"]": "/audio/phrases/dialogue-ef1832daff2f273bbb8e.m4a",
      "[\"Möchten Sie einen Kuchen?\",\"Nein, danke.\"]": "/audio/phrases/dialogue-ea55dd24efd831ea36b3.m4a",
      "[\"Was möchten Sie?\",\"Ich möchte einen Salat, bitte.\"]": "/audio/phrases/dialogue-f236dd317697eb0a6c05.m4a",
      "[\"Tut mir leid, wir haben keinen Schokoladenkuchen mehr.\",\"Schade, dann nehme ich einen Apfelkuchen.\"]": "/audio/phrases/dialogue-ba9319d174756cc6c408.m4a",
      "[\"Ein Eis, bitte.\",\"Tut mir leid, wir haben kein Eis mehr.\"]": "/audio/phrases/dialogue-73b3ac211117d191a718.m4a",
      "[\"Guten Appetit!\",\"Danke, gleichfalls!\"]": "/audio/phrases/dialogue-9b8775421079089baba0.m4a"
    },
    "turns": {
      "Was isst du gern zum Frühstück?": {
        "A": "/audio/phrases/turn-6b216c95efbbf67ea3f9.mp3"
      },
      "Zum Frühstück esse ich gern Brot mit Marmelade.": {
        "B": "/audio/phrases/turn-139d0d1cc001715a3de4.mp3"
      },
      "Was magst du besonders gern?": {
        "A": "/audio/phrases/turn-2793bae6aa7c023030c9.mp3"
      },
      "Ich mag besonders gern Schokolade.": {
        "B": "/audio/phrases/turn-35b5be19dc99b4b0ee48.mp3"
      },
      "Guten Tag! Sie wünschen?": {
        "A": "/audio/phrases/turn-295377c62cac3116d2da.mp3"
      },
      "Eine Tasse Kaffee und einen Kuchen, bitte.": {
        "B": "/audio/phrases/turn-95d74d7a32f166d5e9d5.mp3"
      },
      "Möchten Sie einen Kuchen?": {
        "A": "/audio/phrases/turn-1befdf1c39194c48a72d.mp3"
      },
      "Nein, danke.": {
        "B": "/audio/phrases/turn-0c3858e71002c9060411.mp3"
      },
      "Was möchten Sie?": {
        "A": "/audio/phrases/turn-e96b0ae70fc53c3e7eeb.mp3"
      },
      "Ich möchte einen Salat, bitte.": {
        "B": "/audio/phrases/turn-78d91d2addb8921668df.mp3"
      },
      "Tut mir leid, wir haben keinen Schokoladenkuchen mehr.": {
        "A": "/audio/phrases/turn-1c92f99b3ea8035c2dfd.mp3"
      },
      "Schade, dann nehme ich einen Apfelkuchen.": {
        "B": "/audio/phrases/turn-35ffb9ea7e7b99c2291e.mp3"
      },
      "Ein Eis, bitte.": {
        "A": "/audio/phrases/turn-2b1576247145ae9d7c4b.mp3"
      },
      "Tut mir leid, wir haben kein Eis mehr.": {
        "B": "/audio/phrases/turn-4f8062855a66ec56e926.mp3"
      },
      "Guten Appetit!": {
        "A": "/audio/phrases/turn-b253cd267f90608b33d7.mp3"
      },
      "Danke, gleichfalls!": {
        "B": "/audio/phrases/turn-5198d8d11c86f166a550.mp3"
      }
    },
    "notes": {}
  },
  "L10": {
    "annotations": {
      "Wo fährt der Zug nach Stuttgart ab?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "fährt",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "der Zug nach Stuttgart",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "ab?",
            "role": "verb",
            "label": "ส่วนแยกกริยา",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Von Gleis vier.": [
        [
          {
            "text": "Von Gleis vier.",
            "role": "other",
            "label": "ชานชาลาออกเดินทาง"
          }
        ]
      ],
      "Wo steigst du um?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "steigst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "um?",
            "role": "verb",
            "label": "ส่วนแยกกริยา",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Am Hamburger Hauptbahnhof.": [
        [
          {
            "text": "Am Hamburger Hauptbahnhof.",
            "role": "other",
            "label": "สถานีเปลี่ยนรถ"
          }
        ]
      ],
      "Kannst du mich abholen?": [
        [
          {
            "text": "Kannst",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "mich",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "abholen?",
            "role": "verb",
            "label": "Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Natürlich. Ich hole dich ab.": [
        [
          {
            "text": "Natürlich.",
            "role": "other",
            "label": "ตอบตกลงไปรับ"
          }
        ],
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hole",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "dich",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "ab.",
            "role": "verb",
            "label": "ส่วนแยกกริยา",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Mein Flug startet um fünf Uhr.": [
        [
          {
            "text": "Mein Flug",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "startet",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "um fünf Uhr.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "So früh? Bist du sicher?": [
        [
          {
            "text": "So früh?",
            "role": "other",
            "label": "ถามยืนยันว่าเช้ามาก"
          }
        ],
        [
          {
            "text": "Bist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "sicher?",
            "role": "other",
            "label": "ส่วนบอกลักษณะ"
          }
        ]
      ],
      "Mein Handy hat keinen Akku mehr.": [
        [
          {
            "text": "Mein Handy",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hat",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "keinen Akku",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "mehr.",
            "role": "other",
            "label": "คำขยาย"
          }
        ]
      ],
      "Verstehe. Alles klar.": [
        [
          {
            "text": "Verstehe.",
            "role": "verb",
            "label": "บอกว่าเข้าใจ"
          }
        ],
        [
          {
            "text": "Alles klar.",
            "role": "other",
            "label": "ตอบรับว่าเข้าใจ"
          }
        ]
      ],
      "Wann kommst du an?": [
        [
          {
            "text": "Wann",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kommst",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "an?",
            "role": "verb",
            "label": "ส่วนแยกกริยา",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Um neun Uhr. Hoffentlich haben wir keine Verspätung.": [
        [
          {
            "text": "Um neun Uhr.",
            "role": "time",
            "label": "เวลา"
          }
        ],
        [
          {
            "text": "Hoffentlich",
            "role": "other",
            "label": "คำขยาย",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "haben",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "keine Verspätung.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich freue mich auf dich!": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "freue",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "mich",
            "role": "other",
            "label": "คำสะท้อนกลับ"
          },
          {
            "text": "auf dich!",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich freue mich auch auf dich!": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "freue",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "mich",
            "role": "other",
            "label": "คำสะท้อนกลับ"
          },
          {
            "text": "auch",
            "role": "other",
            "label": "คำขยาย"
          },
          {
            "text": "auf dich!",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Wo fährt der Intercity 642 ab?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "fährt",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "der Intercity 642",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "ab?",
            "role": "verb",
            "label": "ส่วนแยกกริยา",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Von Bahnsteig fünf.": [
        [
          {
            "text": "Von Bahnsteig fünf.",
            "role": "other",
            "label": "ชานชาลาออกเดินทาง"
          }
        ]
      ],
      "Welcher Ausgang?": [
        [
          {
            "text": "Welcher Ausgang?",
            "role": "question",
            "label": "คำถามทางออก"
          }
        ]
      ],
      "Am Ausgang B48.": [
        [
          {
            "text": "Am Ausgang B48.",
            "role": "other",
            "label": "ประตูทางออก"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Wo fährt der Zug nach Stuttgart ab?\",\"Von Gleis vier.\"]": "/audio/phrases/dialogue-fc864d774804e9ebb965.m4a",
      "[\"Wo steigst du um?\",\"Am Hamburger Hauptbahnhof.\"]": "/audio/phrases/dialogue-37b9be92978343f36a0c.m4a",
      "[\"Kannst du mich abholen?\",\"Natürlich. Ich hole dich ab.\"]": "/audio/phrases/dialogue-054d0e82a9c35ee31315.m4a",
      "[\"Mein Flug startet um fünf Uhr.\",\"So früh? Bist du sicher?\"]": "/audio/phrases/dialogue-bd376411116ba03416e4.m4a",
      "[\"Mein Handy hat keinen Akku mehr.\",\"Verstehe. Alles klar.\"]": "/audio/phrases/dialogue-ecf4d77dcef478d56838.m4a",
      "[\"Wann kommst du an?\",\"Um neun Uhr. Hoffentlich haben wir keine Verspätung.\"]": "/audio/phrases/dialogue-c1c9c5c330455fa66003.m4a",
      "[\"Ich freue mich auf dich!\",\"Ich freue mich auch auf dich!\"]": "/audio/phrases/dialogue-eb73b48c907acb81a599.m4a",
      "[\"Wo fährt der Intercity 642 ab?\",\"Von Bahnsteig fünf.\"]": "/audio/phrases/dialogue-bd4bb033c3e3423d767a.m4a",
      "[\"Welcher Ausgang?\",\"Am Ausgang B48.\"]": "/audio/phrases/dialogue-2e84bf500c15a67141ff.m4a"
    },
    "turns": {
      "Wo fährt der Zug nach Stuttgart ab?": {
        "A": "/audio/phrases/turn-d8bbe43620736ccefa42.mp3"
      },
      "Von Gleis vier.": {
        "B": "/audio/phrases/turn-e24d73175e3d7f7fc8de.mp3"
      },
      "Wo steigst du um?": {
        "A": "/audio/phrases/turn-324c671c7399a2868e8b.mp3"
      },
      "Am Hamburger Hauptbahnhof.": {
        "B": "/audio/phrases/turn-fa10b2c9ac40c18dcffe.mp3"
      },
      "Kannst du mich abholen?": {
        "A": "/audio/phrases/turn-69daa9995f7242fcacbc.mp3"
      },
      "Natürlich. Ich hole dich ab.": {
        "B": "/audio/phrases/turn-0771f91ca4403fafd073.mp3"
      },
      "Mein Flug startet um fünf Uhr.": {
        "A": "/audio/phrases/turn-094113f6d5509f248c66.mp3"
      },
      "So früh? Bist du sicher?": {
        "B": "/audio/phrases/turn-8d51812d74a1c454bf1a.mp3"
      },
      "Mein Handy hat keinen Akku mehr.": {
        "A": "/audio/phrases/turn-008cffd9d00b05b8eaa7.mp3"
      },
      "Verstehe. Alles klar.": {
        "B": "/audio/phrases/turn-058e6317bc4241b5e248.mp3"
      },
      "Wann kommst du an?": {
        "A": "/audio/phrases/turn-882f8f2e815d77c17a2a.mp3"
      },
      "Um neun Uhr. Hoffentlich haben wir keine Verspätung.": {
        "B": "/audio/phrases/turn-c4bd3d607b05ddd2d9d6.mp3"
      },
      "Ich freue mich auf dich!": {
        "A": "/audio/phrases/turn-96bbdd69bd99669b8a4c.mp3"
      },
      "Ich freue mich auch auf dich!": {
        "B": "/audio/phrases/turn-f3bd83aaf74f5b32a270.mp3"
      },
      "Wo fährt der Intercity 642 ab?": {
        "A": "/audio/phrases/turn-409cda8a6c0e418c2120.mp3"
      },
      "Von Bahnsteig fünf.": {
        "B": "/audio/phrases/turn-59e25b6935734c8bee68.mp3"
      },
      "Welcher Ausgang?": {
        "A": "/audio/phrases/turn-39098966d00dee6fca57.mp3"
      },
      "Am Ausgang B48.": {
        "B": "/audio/phrases/turn-4b2250b9746869e5edf9.mp3"
      }
    },
    "notes": {
      "L10-COMM-04": [
        "อ่านชื่อขบวนหรือปลายทางก่อนหาชานชาลาหรือทางออก",
        "เมื่อฟังประกาศ ให้จับชื่อขบวนหรือปลายทาง แล้วจึงฟังหมายเลขชานชาลาหรือทางออก"
      ]
    }
  },
  "L11": {
    "annotations": {
      "Was hast du gemacht?": [
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
      "Ich habe gekocht.": [
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
      ],
      "Ich habe gelesen.": [
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
      ],
      "Hast du gestern gekocht?": [
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
      "Nein, ich habe Zeitung gelesen.": [
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
      ],
      "Was hast du letzten Samstag gemacht?": [
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
      "Ich habe Freunde getroffen.": [
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
      ],
      "Ich arbeite.": [
        [
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
        ]
      ],
      "Ich habe gearbeitet.": [
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
            "text": "gearbeitet.",
            "role": "participle",
            "label": "กริยาหลัก · Partizip II",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Wo lernst du Deutsch?": [
        [
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
        ]
      ],
      "Wo hast du Deutsch gelernt?": [
        [
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
        ]
      ],
      "Macht ihr die Hausaufgaben?": [
        [
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
        ]
      ],
      "Habt ihr die Hausaufgaben gemacht?": [
        [
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
        ]
      ],
      "Was hast du gestern gemacht?": [
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
      "Von neun bis siebzehn Uhr habe ich gearbeitet. Danach habe ich gekocht.": [
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
      "Was hast du gestern Abend gemacht?": [
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
      "Ab halb sechs habe ich gelesen.": [
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
      "Was hast du am Sonntag gemacht?": [
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
      "Am Morgen habe ich gefrühstückt. Dann habe ich Freunde getroffen.": [
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
      "Wann ist die Praxis geöffnet?": [
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
      "Von Montag bis Freitag, von neun bis siebzehn Uhr.": [
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
      ],
      "Wann beginnt der Unterricht?": [
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
      "Am Mittwoch um acht Uhr.": [
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
      ],
      "Wann ist die Praxis geschlossen?": [
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
      "Am Samstag und am Sonntag.": [
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
    },
    "dialogues": {
      "[\"Was hast du gemacht?\",\"Ich habe gekocht.\"]": "/audio/phrases/dialogue-230fe2a391a3f73dcd49.m4a",
      "[\"Was hast du gemacht?\",\"Ich habe gelesen.\"]": "/audio/phrases/dialogue-1979108942eefeee0fd1.m4a",
      "[\"Hast du gestern gekocht?\",\"Nein, ich habe Zeitung gelesen.\"]": "/audio/l11/feedback-l11-comm-01-d01.m4a",
      "[\"Was hast du letzten Samstag gemacht?\",\"Ich habe Freunde getroffen.\"]": "/audio/l11/feedback-l11-comm-01-d02.m4a",
      "[\"Was hast du gestern gemacht?\",\"Von neun bis siebzehn Uhr habe ich gearbeitet. Danach habe ich gekocht.\"]": "/audio/l11/feedback-l11-comm-02-d01.m4a",
      "[\"Was hast du gestern Abend gemacht?\",\"Ab halb sechs habe ich gelesen.\"]": "/audio/l11/feedback-l11-comm-02-d02.m4a",
      "[\"Was hast du am Sonntag gemacht?\",\"Am Morgen habe ich gefrühstückt. Dann habe ich Freunde getroffen.\"]": "/audio/l11/feedback-l11-comm-02-d03.m4a",
      "[\"Wann ist die Praxis geöffnet?\",\"Von Montag bis Freitag, von neun bis siebzehn Uhr.\"]": "/audio/l11/feedback-l11-comm-03-d01.m4a",
      "[\"Wann beginnt der Unterricht?\",\"Am Mittwoch um acht Uhr.\"]": "/audio/l11/feedback-l11-comm-03-d02.m4a",
      "[\"Wann ist die Praxis geschlossen?\",\"Am Samstag und am Sonntag.\"]": "/audio/l11/feedback-l11-comm-03-d03.m4a"
    },
    "turns": {
      "Was hast du gemacht?": {
        "A": "/audio/phrases/turn-cbc34c2e287706499c79.mp3"
      },
      "Ich habe gekocht.": {
        "B": "/audio/phrases/turn-3737991e157913393a57.mp3"
      },
      "Ich habe gelesen.": {
        "B": "/audio/phrases/turn-fba86a4b40957706a207.mp3"
      },
      "Hast du gestern gekocht?": {
        "A": "/audio/phrases/turn-8ecc36e6577143672580.mp3"
      },
      "Nein, ich habe Zeitung gelesen.": {
        "B": "/audio/phrases/turn-0b98e417b8392349a647.mp3"
      },
      "Was hast du letzten Samstag gemacht?": {
        "A": "/audio/phrases/turn-438821858bc048d35fb1.mp3"
      },
      "Ich habe Freunde getroffen.": {
        "B": "/audio/phrases/turn-ab56552ee20d0c5b4f06.mp3"
      },
      "Was hast du gestern gemacht?": {
        "A": "/audio/phrases/turn-64ffab185f93f6b6202c.mp3"
      },
      "Von neun bis siebzehn Uhr habe ich gearbeitet. Danach habe ich gekocht.": {
        "B": "/audio/phrases/turn-ba1cc8fb342521c310db.mp3"
      },
      "Was hast du gestern Abend gemacht?": {
        "A": "/audio/phrases/turn-6ffdf30b149c902f6ea5.mp3"
      },
      "Ab halb sechs habe ich gelesen.": {
        "B": "/audio/phrases/turn-1dec66d072bc5f6fd4f5.mp3"
      },
      "Was hast du am Sonntag gemacht?": {
        "A": "/audio/phrases/turn-ebfbce98168b6b06c0e4.mp3"
      },
      "Am Morgen habe ich gefrühstückt. Dann habe ich Freunde getroffen.": {
        "B": "/audio/phrases/turn-2d87b3b5967920050fec.mp3"
      },
      "Wann ist die Praxis geöffnet?": {
        "A": "/audio/phrases/turn-9eb576be2f174e836fec.mp3"
      },
      "Von Montag bis Freitag, von neun bis siebzehn Uhr.": {
        "B": "/audio/phrases/turn-98f244689870cd6c04f3.mp3"
      },
      "Wann beginnt der Unterricht?": {
        "A": "/audio/phrases/turn-fd833e9ba4689eedf7bb.mp3"
      },
      "Am Mittwoch um acht Uhr.": {
        "B": "/audio/phrases/turn-41d5ec574d64bee59851.mp3"
      },
      "Wann ist die Praxis geschlossen?": {
        "A": "/audio/phrases/turn-347dc489a9b85043e212.mp3"
      },
      "Am Samstag und am Sonntag.": {
        "B": "/audio/phrases/turn-0025edbf3e1c99f2af8d.mp3"
      }
    },
    "notes": {}
  },
  "L12": {
    "annotations": {
      "Wie war deine Reise?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "war",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "deine Reise?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Ich war mit meiner Familie unterwegs. Es war schön.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "war",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "mit meiner Familie",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "unterwegs.",
            "role": "other",
            "label": "ส่วนบอกลักษณะ"
          }
        ],
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "war",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "schön.",
            "role": "other",
            "label": "ส่วนบอกลักษณะ"
          }
        ]
      ],
      "Wie war die Reise?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "war",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Reise?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Ich hatte Glück mit dem Wetter. Ich hatte viel Spaß.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hatte",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Glück",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "mit dem Wetter.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ],
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hatte",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "viel Spaß.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich glaube, du hattest Glück mit dem Wetter.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "glaube,",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1 · ประโยคย่อย"
          },
          {
            "text": "hattest",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2 · ประโยคย่อย"
          },
          {
            "text": "Glück",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "mit dem Wetter.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Nein, das Wetter war nicht so schön.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "das Wetter",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "war",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nicht so schön.",
            "role": "other",
            "label": "ส่วนบอกลักษณะ"
          }
        ]
      ],
      "Wann hast du Geburtstag?": [
        [
          {
            "text": "Wann",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hast",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "Geburtstag?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich habe im Januar Geburtstag, im Winter.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "habe",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "im Januar",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "Geburtstag,",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "im Winter.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Wann haben Sie Geburtstag?": [
        [
          {
            "text": "Wann",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "haben",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "Geburtstag?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Ich habe im Mai Geburtstag.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "habe",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "im Mai",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "Geburtstag.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Im Juni.": [
        [
          {
            "text": "Im Juni.",
            "role": "time",
            "label": "เดือน"
          }
        ]
      ],
      "Wann ist das Stadtfest und wie lange dauert es?": [
        [
          {
            "text": "Wann",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das Stadtfest",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "und",
            "role": "other",
            "label": "คำเชื่อม"
          },
          {
            "text": "wie lange",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "dauert",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Es ist im Mai und dauert drei Tage.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "im Mai",
            "role": "time",
            "label": "เวลา"
          },
          {
            "text": "und",
            "role": "other",
            "label": "คำเชื่อม"
          },
          {
            "text": "dauert",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2 · ประธานร่วม"
          },
          {
            "text": "drei Tage.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Seit wann gibt es das Stadtfest?": [
        [
          {
            "text": "Seit wann",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "das Stadtfest?",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Das Stadtfest gibt es seit 2000.": [
        [
          {
            "text": "Das Stadtfest",
            "role": "other",
            "label": "ส่วนเติมเต็ม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "seit 2000.",
            "role": "time",
            "label": "เวลา"
          }
        ]
      ],
      "Wie viele Besucher hat das Fest?": [
        [
          {
            "text": "Wie viele Besucher",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hat",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das Fest?",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          }
        ]
      ],
      "Es hat ungefähr tausend Besucher.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hat",
            "role": "verb",
            "label": "กริยา",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ungefähr tausend Besucher.",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          }
        ]
      ],
      "Wo hast du Weihnachten gefeiert?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "คำถาม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "hast",
            "role": "auxiliary",
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "du",
            "role": "subject",
            "label": "ประธาน",
            "position": "หลังกริยา"
          },
          {
            "text": "Weihnachten",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "gefeiert?",
            "role": "participle",
            "label": "Partizip II",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ich habe Weihnachten in Düsseldorf gefeiert.": [
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
            "label": "กริยาช่วย",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Weihnachten",
            "role": "other",
            "label": "ส่วนเติมเต็ม"
          },
          {
            "text": "in Düsseldorf",
            "role": "other",
            "label": "สถานที่"
          },
          {
            "text": "gefeiert.",
            "role": "participle",
            "label": "Partizip II",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Mai": [
        [
          {
            "text": "Mai",
            "role": "time",
            "label": "เดือน"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Wie war deine Reise?\",\"Ich war mit meiner Familie unterwegs. Es war schön.\"]": "/audio/phrases/dialogue-4e0c5c07ca95b4a7fc8a.m4a",
      "[\"Wie war die Reise?\",\"Ich hatte Glück mit dem Wetter. Ich hatte viel Spaß.\"]": "/audio/phrases/dialogue-473c4a5a25ca47c640f3.m4a",
      "[\"Ich glaube, du hattest Glück mit dem Wetter.\",\"Nein, das Wetter war nicht so schön.\"]": "/audio/phrases/dialogue-b55c49924026073bccec.m4a",
      "[\"Wann hast du Geburtstag?\",\"Ich habe im Januar Geburtstag, im Winter.\"]": "/audio/phrases/dialogue-35f9811081dc1f812ad2.m4a",
      "[\"Wann haben Sie Geburtstag?\",\"Ich habe im Mai Geburtstag.\"]": "/audio/phrases/dialogue-01cbd331bd6a3078f5f5.m4a",
      "[\"Wann ist das Stadtfest und wie lange dauert es?\",\"Es ist im Mai und dauert drei Tage.\"]": "/audio/phrases/dialogue-a78c22f04903cb43e232.m4a",
      "[\"Seit wann gibt es das Stadtfest?\",\"Das Stadtfest gibt es seit 2000.\"]": "/audio/phrases/dialogue-5ef92b8889d69ff2365c.m4a",
      "[\"Wie viele Besucher hat das Fest?\",\"Es hat ungefähr tausend Besucher.\"]": "/audio/phrases/dialogue-f404694bd8a6c129c6e6.m4a",
      "[\"Wo hast du Weihnachten gefeiert?\",\"Ich habe Weihnachten in Düsseldorf gefeiert.\"]": "/audio/phrases/dialogue-a3b00c8d99c0b79b2cbc.m4a"
    },
    "turns": {
      "Wie war deine Reise?": {
        "A": "/audio/phrases/turn-278c968cc77d863e0499.mp3"
      },
      "Ich war mit meiner Familie unterwegs. Es war schön.": {
        "B": "/audio/phrases/turn-5c11854fa4b51cdacc05.mp3"
      },
      "Wie war die Reise?": {
        "A": "/audio/phrases/turn-5983ba5db19b2608ae75.mp3"
      },
      "Ich hatte Glück mit dem Wetter. Ich hatte viel Spaß.": {
        "B": "/audio/phrases/turn-20824812041c1db775f3.mp3"
      },
      "Ich glaube, du hattest Glück mit dem Wetter.": {
        "A": "/audio/phrases/turn-c6034e68f6d5d7d6afbd.mp3"
      },
      "Nein, das Wetter war nicht so schön.": {
        "B": "/audio/phrases/turn-74c7cd99a582eb948e0f.mp3"
      },
      "Wann hast du Geburtstag?": {
        "A": "/audio/phrases/turn-cf608921cb01fa45551d.mp3"
      },
      "Ich habe im Januar Geburtstag, im Winter.": {
        "B": "/audio/phrases/turn-ef2ece74942c359d5da6.mp3"
      },
      "Wann haben Sie Geburtstag?": {
        "A": "/audio/phrases/turn-7ad727927213c22de5e8.mp3"
      },
      "Ich habe im Mai Geburtstag.": {
        "B": "/audio/phrases/turn-e69db72aaf9face427f6.mp3"
      },
      "Wann ist das Stadtfest und wie lange dauert es?": {
        "A": "/audio/phrases/turn-0db79a462b3a5fe54909.mp3"
      },
      "Es ist im Mai und dauert drei Tage.": {
        "B": "/audio/phrases/turn-aadfaf2db26566697e47.mp3"
      },
      "Seit wann gibt es das Stadtfest?": {
        "A": "/audio/phrases/turn-7a55108e57df2b6acadb.mp3"
      },
      "Das Stadtfest gibt es seit 2000.": {
        "B": "/audio/phrases/turn-291312741f0f5176982a.mp3"
      },
      "Wie viele Besucher hat das Fest?": {
        "A": "/audio/phrases/turn-b83fe9bb2b3e738bf35c.mp3"
      },
      "Es hat ungefähr tausend Besucher.": {
        "B": "/audio/phrases/turn-a8cc4d6c5e770163d874.mp3"
      },
      "Wo hast du Weihnachten gefeiert?": {
        "A": "/audio/phrases/turn-1edd2bba0b155f8ede5c.mp3"
      },
      "Ich habe Weihnachten in Düsseldorf gefeiert.": {
        "B": "/audio/phrases/turn-10888df5ff211c86f9c5.mp3"
      }
    },
    "notes": {}
  },
  "L13": {
    "annotations": {
      "Berlin gefällt mir.": [
        [
          {
            "text": "Berlin",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gefällt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "mir.",
            "role": "other",
            "label": "ผู้ที่ชอบ (Dativ)"
          }
        ]
      ],
      "Berlin gefällt mir sehr.": [
        [
          {
            "text": "Berlin",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gefällt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "mir",
            "role": "other",
            "label": "ผู้ที่ชอบ (Dativ)"
          },
          {
            "text": "sehr.",
            "role": "other",
            "label": "ระดับความชอบ"
          }
        ]
      ],
      "Das gefällt mir besonders gut.": [
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gefällt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "mir",
            "role": "other",
            "label": "ผู้ที่ชอบ (Dativ)"
          },
          {
            "text": "besonders gut.",
            "role": "other",
            "label": "ระดับความชอบ"
          }
        ]
      ],
      "Ich finde die Stadt toll.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finde",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Stadt",
            "role": "other",
            "label": "สิ่งที่แสดงความเห็น (กรรม)"
          },
          {
            "text": "toll.",
            "role": "other",
            "label": "ความเห็น"
          }
        ]
      ],
      "Ich finde Berlin interessant.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finde",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Berlin",
            "role": "other",
            "label": "สิ่งที่แสดงความเห็น (กรรม)"
          },
          {
            "text": "interessant.",
            "role": "other",
            "label": "ความเห็น"
          }
        ]
      ],
      "Die Stadt ist einfach anders.": [
        [
          {
            "text": "Die Stadt",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "einfach anders.",
            "role": "other",
            "label": "ลักษณะของเมือง"
          }
        ]
      ],
      "Die Stadt ist zu groß.": [
        [
          {
            "text": "Die Stadt",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "zu groß.",
            "role": "other",
            "label": "ลักษณะของเมือง"
          }
        ]
      ],
      "Das ist super!": [
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "super!",
            "role": "other",
            "label": "ความเห็น"
          }
        ]
      ],
      "Das ist cool!": [
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "cool!",
            "role": "other",
            "label": "ความเห็น"
          }
        ]
      ],
      "Was gibt es hier?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "ถามสิ่งที่มี",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "hier?",
            "role": "other",
            "label": "สถานที่"
          }
        ]
      ],
      "Hier gibt es einen Park.": [
        [
          {
            "text": "Hier",
            "role": "other",
            "label": "ส่วนขึ้นต้น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "einen Park.",
            "role": "other",
            "label": "สิ่งที่มีหรือไม่มี (Akkusativ)"
          }
        ]
      ],
      "Es gibt viele Kirchen.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "viele Kirchen.",
            "role": "other",
            "label": "สิ่งที่มีหรือไม่มี (Akkusativ)"
          }
        ]
      ],
      "Es gibt auch ein Café.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "auch ein Café.",
            "role": "other",
            "label": "สิ่งที่มีหรือไม่มี (Akkusativ)"
          }
        ]
      ],
      "In der Nähe gibt es auch einen See.": [
        [
          {
            "text": "In der Nähe",
            "role": "other",
            "label": "ส่วนขึ้นต้น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "auch einen See.",
            "role": "other",
            "label": "สิ่งที่มีหรือไม่มี (Akkusativ)"
          }
        ]
      ],
      "Leider gibt es keinen Hafen.": [
        [
          {
            "text": "Leider",
            "role": "other",
            "label": "ส่วนขึ้นต้น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "keinen Hafen.",
            "role": "other",
            "label": "สิ่งที่มีหรือไม่มี (Akkusativ)"
          }
        ]
      ],
      "Es gibt keine Altstadt.": [
        [
          {
            "text": "Es",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "keine Altstadt.",
            "role": "other",
            "label": "สิ่งที่มีหรือไม่มี (Akkusativ)"
          }
        ]
      ],
      "Was ist Ihr Lieblingsort?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "ถามสถานที่โปรด",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Ihr Lieblingsort?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Mein Lieblingsort ist der Park.": [
        [
          {
            "text": "Mein Lieblingsort",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "der Park.",
            "role": "other",
            "label": "สถานที่โปรด (Nominativ)"
          }
        ]
      ],
      "Ich liebe die Natur.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "liebe",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Natur.",
            "role": "other",
            "label": "สิ่งที่ชอบ (กรรม)"
          }
        ]
      ],
      "Dort kann man spazieren gehen.": [
        [
          {
            "text": "Dort",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kann",
            "role": "auxiliary",
            "label": "Modalverb (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "man",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "spazieren gehen.",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Dort kann man auch angeln.": [
        [
          {
            "text": "Dort",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kann",
            "role": "auxiliary",
            "label": "Modalverb (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "man",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "auch",
            "role": "other",
            "label": "ข้อมูลเพิ่มเติม"
          },
          {
            "text": "angeln.",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Dort treffen wir Freunde.": [
        [
          {
            "text": "Dort",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "treffen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "wir",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "Freunde.",
            "role": "other",
            "label": "บุคคลที่พบ (กรรม)"
          }
        ]
      ],
      "Leider gibt es keinen Fußballplatz.": [
        [
          {
            "text": "Leider",
            "role": "other",
            "label": "ส่วนขึ้นต้น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gibt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "es",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "keinen Fußballplatz.",
            "role": "other",
            "label": "สิ่งที่มีหรือไม่มี (Akkusativ)"
          }
        ]
      ],
      "Wie finden Sie Berlin?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "ถามความเห็น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finden",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "Berlin?",
            "role": "other",
            "label": "สิ่งที่ถามความเห็น (กรรม)"
          }
        ]
      ],
      "Möchten Sie Berlin besuchen?": [
        [
          {
            "text": "Möchten",
            "role": "auxiliary",
            "label": "Modalverb (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "Berlin",
            "role": "other",
            "label": "สถานที่ที่จะไป (กรรม)"
          },
          {
            "text": "besuchen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ich glaube, Berlin ist sehr interessant.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธานของประโยคนำ",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "glaube,",
            "role": "verb",
            "label": "กริยาแสดงความคิด",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Berlin",
            "role": "subject",
            "label": "ประธานของข้อความที่คาดเดา",
            "position": "ตำแหน่ง 1 ในข้อความถัดมา"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2 ในข้อความถัดมา"
          },
          {
            "text": "sehr interessant.",
            "role": "other",
            "label": "ความเห็นที่คาดเดา"
          }
        ]
      ],
      "Ich finde die Stadt zu groß.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finde",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Stadt",
            "role": "other",
            "label": "สิ่งที่แสดงความเห็น (กรรม)"
          },
          {
            "text": "zu groß.",
            "role": "other",
            "label": "ความเห็น"
          }
        ]
      ],
      "Was gefällt Ihnen besonders?": [
        [
          {
            "text": "Was",
            "role": "subject",
            "label": "สิ่งที่ถามถึง (ประธาน)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gefällt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Ihnen",
            "role": "other",
            "label": "ผู้ที่ชอบ"
          },
          {
            "text": "besonders?",
            "role": "other",
            "label": "เน้นสิ่งที่ชอบเป็นพิเศษ"
          }
        ]
      ],
      "Was fehlt Ihnen?": [
        [
          {
            "text": "Was",
            "role": "subject",
            "label": "สิ่งที่ถามถึง (ประธาน)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "fehlt",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Ihnen?",
            "role": "other",
            "label": "ผู้ที่ขาดสิ่งนั้น"
          }
        ]
      ],
      "Wie finden Sie die Stadt?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "ถามความเห็น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "finden",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "die Stadt?",
            "role": "other",
            "label": "สิ่งที่ถามความเห็น (กรรม)"
          }
        ]
      ],
      "Wie findest du das?": [
        [
          {
            "text": "Wie",
            "role": "question",
            "label": "ถามความเห็น",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "findest",
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
            "text": "das?",
            "role": "other",
            "label": "สิ่งที่ถามความเห็น (กรรม)"
          }
        ]
      ],
      "Was mögen Sie?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "ถามสิ่งที่ชอบ",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "mögen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Was kann man dort machen?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "ถามกิจกรรม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "kann",
            "role": "auxiliary",
            "label": "Modalverb (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "man",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "dort",
            "role": "other",
            "label": "สถานที่"
          },
          {
            "text": "machen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Was macht ihr dort?": [
        [
          {
            "text": "Was",
            "role": "question",
            "label": "ถามกิจกรรม",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "macht",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ihr",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "dort?",
            "role": "other",
            "label": "สถานที่"
          }
        ]
      ],
      "Ja, gern.": [
        [
          {
            "text": "Ja, gern.",
            "role": "other",
            "label": "ตอบรับคำชวน"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Wie finden Sie Berlin?\",\"Berlin gefällt mir.\"]": "/audio/phrases/dialogue-024ac7bd33e0f2a88c96.m4a",
      "[\"Wie finden Sie Berlin?\",\"Berlin gefällt mir sehr.\"]": "/audio/phrases/dialogue-d407e74add0bcd7c8f4e.m4a",
      "[\"Wie finden Sie Berlin?\",\"Das gefällt mir besonders gut.\"]": "/audio/phrases/dialogue-6eaa66eb6bcbc0b21b8e.m4a",
      "[\"Wie finden Sie Berlin?\",\"Ich finde die Stadt toll.\"]": "/audio/phrases/dialogue-ac702c7e53ac61beffc9.m4a",
      "[\"Wie finden Sie Berlin?\",\"Ich finde Berlin interessant.\"]": "/audio/phrases/dialogue-913c1f6552b1804b21b4.m4a",
      "[\"Wie finden Sie Berlin?\",\"Die Stadt ist einfach anders.\"]": "/audio/phrases/dialogue-5704b365523fe896cc52.m4a",
      "[\"Wie finden Sie Berlin?\",\"Die Stadt ist zu groß.\"]": "/audio/phrases/dialogue-8dc83f5719b490e54d52.m4a",
      "[\"Wie findest du das?\",\"Das ist super!\"]": "/audio/phrases/dialogue-017f2db29458f2fa0991.m4a",
      "[\"Wie findest du das?\",\"Das ist cool!\"]": "/audio/phrases/dialogue-512360a7ac2a86a11fc5.m4a",
      "[\"Was gibt es hier?\",\"Hier gibt es einen Park.\"]": "/audio/phrases/dialogue-b578554a30357e8721a6.m4a",
      "[\"Was gibt es hier?\",\"Es gibt viele Kirchen.\"]": "/audio/phrases/dialogue-49fbadabd2fb6280bc10.m4a",
      "[\"Was gibt es hier?\",\"Es gibt auch ein Café.\"]": "/audio/phrases/dialogue-26a04d864448e268974e.m4a",
      "[\"Was gibt es hier?\",\"In der Nähe gibt es auch einen See.\"]": "/audio/phrases/dialogue-6ede26be2f9bdb42c481.m4a",
      "[\"Was gibt es hier?\",\"Leider gibt es keinen Hafen.\"]": "/audio/phrases/dialogue-96ee2d9df696919011fa.m4a",
      "[\"Was gibt es hier?\",\"Es gibt keine Altstadt.\"]": "/audio/phrases/dialogue-00acacecb1024420f50b.m4a",
      "[\"Was ist Ihr Lieblingsort?\",\"Mein Lieblingsort ist der Park.\"]": "/audio/phrases/dialogue-915c6b3aca538bd3feb0.m4a",
      "[\"Was mögen Sie?\",\"Ich liebe die Natur.\"]": "/audio/phrases/dialogue-099a0ebefbd59cdf2c0a.m4a",
      "[\"Was kann man dort machen?\",\"Dort kann man spazieren gehen.\"]": "/audio/phrases/dialogue-13adad50891dccf512e5.m4a",
      "[\"Was kann man dort machen?\",\"Dort kann man auch angeln.\"]": "/audio/phrases/dialogue-438374d7e519d3b9d5d5.m4a",
      "[\"Was macht ihr dort?\",\"Dort treffen wir Freunde.\"]": "/audio/phrases/dialogue-9e4cfe36d8c3f33ec69d.m4a",
      "[\"Was fehlt Ihnen?\",\"Leider gibt es keinen Fußballplatz.\"]": "/audio/phrases/dialogue-6ac9a04ff8a5365f8ac6.m4a",
      "[\"Möchten Sie Berlin besuchen?\",\"Ja, gern.\"]": "/audio/phrases/dialogue-92ac2032eeb5f6801e7a.m4a",
      "[\"Wie finden Sie Berlin?\",\"Ich glaube, Berlin ist sehr interessant.\"]": "/audio/phrases/dialogue-447d9041b3209130833c.m4a",
      "[\"Wie finden Sie Berlin?\",\"Ich finde die Stadt zu groß.\"]": "/audio/phrases/dialogue-131d6ac021c8ee3022e6.m4a",
      "[\"Was gefällt Ihnen besonders?\",\"Das gefällt mir besonders gut.\"]": "/audio/phrases/dialogue-d7aeae188c83be21175e.m4a"
    },
    "turns": {
      "Wie finden Sie Berlin?": {
        "A": "/audio/phrases/turn-5c978f58f3ff5bd3d4f0.mp3"
      },
      "Berlin gefällt mir.": {
        "B": "/audio/phrases/turn-75769488b7807039d7be.mp3"
      },
      "Berlin gefällt mir sehr.": {
        "B": "/audio/phrases/turn-2ea36e3fd9cf9c8f7b85.mp3"
      },
      "Das gefällt mir besonders gut.": {
        "B": "/audio/phrases/turn-884814401532fb1496c6.mp3"
      },
      "Ich finde die Stadt toll.": {
        "B": "/audio/phrases/turn-6b5bc064e6b92b07096d.mp3"
      },
      "Ich finde Berlin interessant.": {
        "B": "/audio/phrases/turn-932cbe53c864a338119a.mp3"
      },
      "Die Stadt ist einfach anders.": {
        "B": "/audio/phrases/turn-cb60633d5e135090286b.mp3"
      },
      "Die Stadt ist zu groß.": {
        "B": "/audio/phrases/turn-9828d8b7c2854015b553.mp3"
      },
      "Wie findest du das?": {
        "A": "/audio/phrases/turn-48963f6d4d8b3ab4e583.mp3"
      },
      "Das ist super!": {
        "B": "/audio/phrases/turn-77c4859f2e790784f216.mp3"
      },
      "Das ist cool!": {
        "B": "/audio/phrases/turn-906cdc3acf7ab1b5a8c9.mp3"
      },
      "Was gibt es hier?": {
        "A": "/audio/phrases/turn-f44b22f18afef331db39.mp3"
      },
      "Hier gibt es einen Park.": {
        "B": "/audio/phrases/turn-28a2fdcb871b2ce2a79d.mp3"
      },
      "Es gibt viele Kirchen.": {
        "B": "/audio/phrases/turn-52d48b7ebc120fe03341.mp3"
      },
      "Es gibt auch ein Café.": {
        "B": "/audio/phrases/turn-87830d39c2793434c095.mp3"
      },
      "In der Nähe gibt es auch einen See.": {
        "B": "/audio/phrases/turn-41b729f70adaa942ca7b.mp3"
      },
      "Leider gibt es keinen Hafen.": {
        "B": "/audio/phrases/turn-0e0e69f641e715bd709a.mp3"
      },
      "Es gibt keine Altstadt.": {
        "B": "/audio/phrases/turn-051c751a8670ab421ddc.mp3"
      },
      "Was ist Ihr Lieblingsort?": {
        "A": "/audio/phrases/turn-0d52e5465afeab471d34.mp3"
      },
      "Mein Lieblingsort ist der Park.": {
        "B": "/audio/phrases/turn-5a8edfeecbc13e977a28.mp3"
      },
      "Was mögen Sie?": {
        "A": "/audio/phrases/turn-43847a4d319049ca12f4.mp3"
      },
      "Ich liebe die Natur.": {
        "B": "/audio/phrases/turn-54494609cd5c8e5f1524.mp3"
      },
      "Was kann man dort machen?": {
        "A": "/audio/phrases/turn-283613edadba0ee28a29.mp3"
      },
      "Dort kann man spazieren gehen.": {
        "B": "/audio/phrases/turn-d6b5486b38ee68475121.mp3"
      },
      "Dort kann man auch angeln.": {
        "B": "/audio/phrases/turn-b85b2d7abf20f1bb1e4b.mp3"
      },
      "Was macht ihr dort?": {
        "A": "/audio/phrases/turn-0b41367c74f2074997fd.mp3"
      },
      "Dort treffen wir Freunde.": {
        "B": "/audio/phrases/turn-edd250bf7ba4b638a599.mp3"
      },
      "Was fehlt Ihnen?": {
        "A": "/audio/phrases/turn-45c0bc0a0ac3525f6142.mp3"
      },
      "Leider gibt es keinen Fußballplatz.": {
        "B": "/audio/phrases/turn-4d067005510fac6d12a8.mp3"
      },
      "Möchten Sie Berlin besuchen?": {
        "A": "/audio/phrases/turn-94a7d1f0963ac825e2bd.mp3"
      },
      "Ja, gern.": {
        "B": "/audio/phrases/turn-9fe165bb4fb696fc568f.mp3"
      },
      "Ich glaube, Berlin ist sehr interessant.": {
        "B": "/audio/phrases/turn-7c3c5a685217d939e25d.mp3"
      },
      "Ich finde die Stadt zu groß.": {
        "B": "/audio/phrases/turn-7bf862ac8b1edd0be8bc.mp3"
      },
      "Was gefällt Ihnen besonders?": {
        "A": "/audio/phrases/turn-e06a55740be212fe1bc0.mp3"
      }
    },
    "notes": {}
  },
  "L14": {
    "annotations": {
      "Entschuldigung. Können Sie mir helfen?": [
        [
          {
            "text": "Entschuldigung.",
            "role": "other",
            "label": "ขออนุญาตเริ่มสนทนา"
          }
        ],
        [
          {
            "text": "Können",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "mir",
            "role": "other",
            "label": "ผู้รับความช่วยเหลือ (Dativ)"
          },
          {
            "text": "helfen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ja, gern.": [
        [
          {
            "text": "Ja, gern.",
            "role": "other",
            "label": "ยินดีช่วย"
          }
        ]
      ],
      "Wo ist denn hier eine Bank?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "eine Bank?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Sie gehen die erste Straße nach rechts. Da sehen Sie die Bank.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die erste Straße nach rechts.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "die Bank.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Ist das sehr weit?": [
        [
          {
            "text": "Ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "sehr weit?",
            "role": "other",
            "label": "ถามระยะทาง"
          }
        ]
      ],
      "Nein, das ist gar nicht weit.": [
        [
          {
            "text": "Nein,",
            "role": "other",
            "label": "ตอบปฏิเสธ"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "gar nicht weit.",
            "role": "other",
            "label": "ระยะทาง: ไม่ไกลเลย"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche die Post.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Post.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Sie gehen die zweite Straße nach rechts. Da sehen Sie die Post.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die zweite Straße nach rechts.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "die Post.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Kann ich zu Fuß gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ja, das können Sie.": [
        [
          {
            "text": "Ja,",
            "role": "other",
            "label": "ตอบรับ"
          },
          {
            "text": "das",
            "role": "other",
            "label": "สิ่งที่ทำได้ (กรรม)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "können",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie.",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Sie gehen hier geradeaus.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "hier geradeaus.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ]
      ],
      "Da sehen Sie eine Bank.": [
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "eine Bank.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Vor der Bank biegen Sie nach rechts ab.": [
        [
          {
            "text": "Vor der Bank",
            "role": "other",
            "label": "สถานที่อ้างอิง",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "biegen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "nach rechts",
            "role": "other",
            "label": "ทิศทาง"
          },
          {
            "text": "ab.",
            "role": "verb",
            "label": "ส่วนแยกของ abbiegen",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Das ist gar nicht weit.": [
        [
          {
            "text": "Das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "gar nicht weit.",
            "role": "other",
            "label": "ระยะทาง: ไม่ไกลเลย"
          }
        ]
      ],
      "Sie gehen die fünfte Straße nach links.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die fünfte Straße nach links.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ]
      ],
      "Sie gehen nach rechts.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nach rechts.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ]
      ],
      "Wo ist denn hier die Post?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "die Post?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Tut mir leid. Ich bin nicht von hier.": [
        [
          {
            "text": "Tut mir leid.",
            "role": "other",
            "label": "กล่าวขอโทษ"
          }
        ],
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bin",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "nicht",
            "role": "other",
            "label": "ปฏิเสธ"
          },
          {
            "text": "von hier.",
            "role": "other",
            "label": "ถิ่นที่มา"
          }
        ]
      ],
      "Das weiß ich leider nicht.": [
        [
          {
            "text": "Das",
            "role": "other",
            "label": "เรื่องที่ไม่รู้ (กรรม)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "weiß",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "leider nicht.",
            "role": "other",
            "label": "บอกว่าไม่ทราบ"
          }
        ]
      ],
      "Ich bin fremd hier.": [
        [
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "bin",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "fremd",
            "role": "other",
            "label": "ไม่คุ้นเคย"
          },
          {
            "text": "hier.",
            "role": "other",
            "label": "สถานที่"
          }
        ]
      ],
      "Herzlichen Dank.": [
        [
          {
            "text": "Herzlichen Dank.",
            "role": "other",
            "label": "กล่าวขอบคุณ"
          }
        ]
      ],
      "Sehr nett. Vielen Dank.": [
        [
          {
            "text": "Sehr nett.",
            "role": "other",
            "label": "ชมความใจดี"
          }
        ],
        [
          {
            "text": "Vielen Dank.",
            "role": "other",
            "label": "กล่าวขอบคุณ"
          }
        ]
      ],
      "Oh, danke schön.": [
        [
          {
            "text": "Oh, danke schön.",
            "role": "other",
            "label": "กล่าวขอบคุณ"
          }
        ]
      ],
      "Wo ist denn hier ein Café?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "ein Café?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Wo ist denn hier der Bahnhof?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "der Bahnhof?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Wo ist denn hier eine Apotheke?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "eine Apotheke?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Wo ist denn hier eine Bibliothek?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "eine Bibliothek?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Wo ist denn hier ein Kino?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "ein Kino?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Wo ist denn hier der Park?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามสถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "denn hier",
            "role": "other",
            "label": "บริเวณนี้"
          },
          {
            "text": "der Park?",
            "role": "subject",
            "label": "ประธาน"
          }
        ]
      ],
      "Sie gehen die zweite Straße nach rechts. Folgen Sie der Straße um die Kurve. Da sehen Sie die Post.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die zweite Straße nach rechts.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Folgen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "der Straße um die Kurve.",
            "role": "other",
            "label": "เส้นทางที่เดินตาม (Dativ)"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "die Post.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Sie gehen die zweite Straße nach links. Da sehen Sie das Café.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die zweite Straße nach links.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "das Café.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Sie gehen die erste Straße nach links. Vor der Apotheke biegen Sie nach rechts ab. Folgen Sie der Straße bis zum Bahnhof.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die erste Straße nach links.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Vor der Apotheke",
            "role": "other",
            "label": "สถานที่อ้างอิง",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "biegen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "nach rechts",
            "role": "other",
            "label": "ทิศทาง"
          },
          {
            "text": "ab.",
            "role": "verb",
            "label": "ส่วนแยกของ abbiegen",
            "position": "ท้ายประโยค"
          }
        ],
        [
          {
            "text": "Folgen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "der Straße bis zum Bahnhof.",
            "role": "other",
            "label": "เส้นทางที่เดินตาม (Dativ)"
          }
        ]
      ],
      "Sie gehen die erste Straße nach links. Dann gehen Sie an der nächsten Kreuzung geradeaus. Da sehen Sie die Apotheke.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die erste Straße nach links.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Dann",
            "role": "sequence",
            "label": "ลำดับเหตุการณ์",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "an der nächsten Kreuzung geradeaus.",
            "role": "other",
            "label": "สถานที่และทิศทาง"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "die Apotheke.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Sie gehen die zweite Straße nach rechts. Folgen Sie der Straße. Da sehen Sie die Bibliothek.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die zweite Straße nach rechts.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Folgen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "der Straße.",
            "role": "other",
            "label": "เส้นทางที่เดินตาม (Dativ)"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "die Bibliothek.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Sie gehen die erste Straße nach rechts. Folgen Sie der Straße. Da sehen Sie das Kino.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die erste Straße nach rechts.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Folgen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "der Straße.",
            "role": "other",
            "label": "เส้นทางที่เดินตาม (Dativ)"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "das Kino.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Sie gehen die zweite Straße nach rechts. Da sehen Sie den Park.": [
        [
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "gehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die zweite Straße nach rechts.",
            "role": "other",
            "label": "เส้นทางและทิศทาง"
          }
        ],
        [
          {
            "text": "Da",
            "role": "other",
            "label": "สถานที่",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "sehen",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "Sie",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "den Park.",
            "role": "other",
            "label": "สิ่งที่เห็น (Akkusativ)"
          }
        ]
      ],
      "Wo muss ich dann abbiegen?": [
        [
          {
            "text": "Wo",
            "role": "question",
            "label": "ถามจุดเลี้ยว",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "muss",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "dann",
            "role": "sequence",
            "label": "ลำดับเหตุการณ์"
          },
          {
            "text": "abbiegen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Ja, das ist weit.": [
        [
          {
            "text": "Ja,",
            "role": "other",
            "label": "ตอบรับ"
          },
          {
            "text": "das",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ist",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "weit.",
            "role": "other",
            "label": "ระยะทาง: ไกล"
          }
        ]
      ],
      "Bitte schön.": [
        [
          {
            "text": "Bitte schön.",
            "role": "other",
            "label": "ตอบรับคำขอบคุณ"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche die Bank.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Bank.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche das Café.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das Café.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche den Bahnhof.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "den Bahnhof.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche die Apotheke.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Apotheke.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche die Bibliothek.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "die Bibliothek.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche das Kino.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "das Kino.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Eine Frage bitte: Ich suche den Park.": [
        [
          {
            "text": "Eine Frage bitte:",
            "role": "other",
            "label": "ขออนุญาตถาม"
          },
          {
            "text": "Ich",
            "role": "subject",
            "label": "ประธาน",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "suche",
            "role": "verb",
            "label": "กริยาหลัก (ผันแล้ว)",
            "position": "ตำแหน่ง 2"
          },
          {
            "text": "den Park.",
            "role": "other",
            "label": "สิ่งที่กำลังหา (Akkusativ)"
          }
        ]
      ],
      "Kann ich zu Fuß zur Post gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zur Post",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Kann ich zu Fuß zur Bank gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zur Bank",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Kann ich zu Fuß zum Café gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zum Café",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Kann ich zu Fuß zum Bahnhof gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zum Bahnhof",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Kann ich zu Fuß zur Apotheke gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zur Apotheke",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Kann ich zu Fuß zur Bibliothek gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zur Bibliothek",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Kann ich zu Fuß zum Kino gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zum Kino",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ],
      "Kann ich zu Fuß zum Park gehen?": [
        [
          {
            "text": "Kann",
            "role": "auxiliary",
            "label": "กริยาช่วย (ผันแล้ว)",
            "position": "ตำแหน่ง 1"
          },
          {
            "text": "ich",
            "role": "subject",
            "label": "ประธาน"
          },
          {
            "text": "zu Fuß",
            "role": "other",
            "label": "วิธีเดินทาง"
          },
          {
            "text": "zum Park",
            "role": "other",
            "label": "จุดหมาย"
          },
          {
            "text": "gehen?",
            "role": "verb",
            "label": "กริยาหลัก · Infinitiv",
            "position": "ท้ายประโยค"
          }
        ]
      ]
    },
    "dialogues": {
      "[\"Entschuldigung. Können Sie mir helfen?\",\"Ja, gern.\"]": "/audio/phrases/dialogue-1d5693c684faa44fc114.m4a",
      "[\"Wo ist denn hier eine Bank?\",\"Sie gehen die erste Straße nach rechts. Da sehen Sie die Bank.\"]": "/audio/phrases/dialogue-27a6d4f4425adf1f6f04.m4a",
      "[\"Ist das sehr weit?\",\"Nein, das ist gar nicht weit.\"]": "/audio/phrases/dialogue-cd8aacd48f4be9f082c9.m4a",
      "[\"Eine Frage bitte: Ich suche die Post.\",\"Sie gehen die zweite Straße nach rechts. Da sehen Sie die Post.\"]": "/audio/phrases/dialogue-fbd3a0760bdf88399254.m4a",
      "[\"Kann ich zu Fuß gehen?\",\"Ja, das können Sie.\"]": "/audio/phrases/dialogue-58b83d8893500de3a442.m4a",
      "[\"Wo ist denn hier eine Bank?\",\"Sie gehen hier geradeaus.\"]": "/audio/phrases/dialogue-4d843686fec2e4e5c399.m4a",
      "[\"Wo ist denn hier eine Bank?\",\"Da sehen Sie eine Bank.\"]": "/audio/phrases/dialogue-5c753366d881b75189eb.m4a",
      "[\"Wo ist denn hier eine Bank?\",\"Vor der Bank biegen Sie nach rechts ab.\"]": "/audio/phrases/dialogue-4c1a6ae3c6567a7adf51.m4a",
      "[\"Ist das sehr weit?\",\"Das ist gar nicht weit.\"]": "/audio/phrases/dialogue-b7bc637c239423485254.m4a",
      "[\"Wo ist denn hier eine Bank?\",\"Sie gehen die fünfte Straße nach links.\"]": "/audio/phrases/dialogue-5cf605be938f30ec8825.m4a",
      "[\"Wo ist denn hier eine Bank?\",\"Sie gehen nach rechts.\"]": "/audio/phrases/dialogue-8539bc55a30d51ccf4fc.m4a",
      "[\"Wo ist denn hier die Post?\",\"Tut mir leid. Ich bin nicht von hier.\"]": "/audio/phrases/dialogue-1591f01e7780ed4abff1.m4a",
      "[\"Wo ist denn hier die Post?\",\"Das weiß ich leider nicht.\"]": "/audio/phrases/dialogue-9e93d65c7c049f8c369a.m4a",
      "[\"Wo ist denn hier die Post?\",\"Ich bin fremd hier.\"]": "/audio/phrases/dialogue-f8bad878a2047b4e5f81.m4a",
      "[\"Ja, das können Sie.\",\"Herzlichen Dank.\"]": "/audio/phrases/dialogue-a1adf64b9d16f8a71f23.m4a",
      "[\"Ja, das können Sie.\",\"Sehr nett. Vielen Dank.\"]": "/audio/phrases/dialogue-9fb28491cdf21003e143.m4a",
      "[\"Ja, das können Sie.\",\"Oh, danke schön.\"]": "/audio/phrases/dialogue-d4796918b52b8666182e.m4a"
    },
    "turns": {
      "Entschuldigung. Können Sie mir helfen?": {
        "A": "/audio/phrases/turn-50fd128a671d7620aa94.mp3",
        "B": "/audio/phrases/turn-bb75aa29527d7b7c38db.mp3"
      },
      "Ja, gern.": {
        "B": "/audio/phrases/turn-9fe165bb4fb696fc568f.mp3",
        "A": "/audio/phrases/turn-7dc984b6288b04e32516.mp3"
      },
      "Wo ist denn hier eine Bank?": {
        "A": "/audio/phrases/turn-dcb4aaea1a66bc503b6e.mp3",
        "B": "/audio/phrases/turn-7bbccd8026250fc40ced.mp3"
      },
      "Sie gehen die erste Straße nach rechts. Da sehen Sie die Bank.": {
        "B": "/audio/phrases/turn-e834f62a3c5bff72e73f.mp3",
        "A": "/audio/phrases/turn-f52264c743bdecb1dcab.mp3"
      },
      "Ist das sehr weit?": {
        "A": "/audio/phrases/turn-b04b622d8cb5194958bf.mp3",
        "B": "/audio/phrases/turn-d0f94feff4319b82faf5.mp3"
      },
      "Nein, das ist gar nicht weit.": {
        "B": "/audio/phrases/turn-fa29447d76da4e520cbd.mp3",
        "A": "/audio/phrases/turn-76b5494771fbe2149ccc.mp3"
      },
      "Eine Frage bitte: Ich suche die Post.": {
        "A": "/audio/phrases/turn-09f9fdf9b110d20727d3.mp3",
        "B": "/audio/phrases/turn-493dda4e08716360e4bc.mp3"
      },
      "Sie gehen die zweite Straße nach rechts. Da sehen Sie die Post.": {
        "B": "/audio/phrases/turn-37a1695b384af0569793.mp3",
        "A": "/audio/phrases/turn-5c333c576ade979c81e0.mp3"
      },
      "Kann ich zu Fuß gehen?": {
        "A": "/audio/phrases/turn-86bebc13f7f45c7b7da9.mp3",
        "B": "/audio/phrases/turn-dda816e1dee54466cfe9.mp3"
      },
      "Ja, das können Sie.": {
        "B": "/audio/phrases/turn-7684cffa14951ec20b17.mp3",
        "A": "/audio/phrases/turn-cda5c495dc4473ef2546.mp3"
      },
      "Sie gehen hier geradeaus.": {
        "B": "/audio/phrases/turn-68ba5f969cd78db064c6.mp3",
        "A": "/audio/phrases/turn-6a232ee9a5e3665baf21.mp3"
      },
      "Da sehen Sie eine Bank.": {
        "B": "/audio/phrases/turn-e80506d8f7e53edf08de.mp3",
        "A": "/audio/phrases/turn-dced7b8dafcc165a4485.mp3"
      },
      "Vor der Bank biegen Sie nach rechts ab.": {
        "B": "/audio/phrases/turn-6507af48e1a0db9d9bd8.mp3",
        "A": "/audio/phrases/turn-a0c28c7108c98eaa2e2e.mp3"
      },
      "Das ist gar nicht weit.": {
        "B": "/audio/phrases/turn-6095409a7e6e6206d48a.mp3",
        "A": "/audio/phrases/turn-d882956930569542d9d2.mp3"
      },
      "Sie gehen die fünfte Straße nach links.": {
        "B": "/audio/phrases/turn-702928671f14027c0863.mp3",
        "A": "/audio/phrases/turn-c2de213dcdac183da80a.mp3"
      },
      "Sie gehen nach rechts.": {
        "B": "/audio/phrases/turn-110d20df00cfba0135d2.mp3",
        "A": "/audio/phrases/turn-2972d048f5b8a82b935f.mp3"
      },
      "Wo ist denn hier die Post?": {
        "A": "/audio/phrases/turn-4fbd6546d8300089d461.mp3",
        "B": "/audio/phrases/turn-9a834174e5b9db27ae77.mp3"
      },
      "Tut mir leid. Ich bin nicht von hier.": {
        "B": "/audio/phrases/turn-dec2fa2e9c473b7c3e59.mp3",
        "A": "/audio/phrases/turn-6660fd7c94591de08146.mp3"
      },
      "Das weiß ich leider nicht.": {
        "B": "/audio/phrases/turn-dbccb38c22a2bddef285.mp3",
        "A": "/audio/phrases/turn-c28e1b41f3deb5748882.mp3"
      },
      "Ich bin fremd hier.": {
        "B": "/audio/phrases/turn-1de4ddaa3e1ba75a5ea3.mp3",
        "A": "/audio/phrases/turn-6333f863b30eef01f78d.mp3"
      },
      "Herzlichen Dank.": {
        "B": "/audio/phrases/turn-feb19e57d8ece1315df6.mp3",
        "A": "/audio/phrases/turn-fb2254c04911c60ca87d.mp3"
      },
      "Sehr nett. Vielen Dank.": {
        "B": "/audio/phrases/turn-f27d0fdd9864e94e2568.mp3",
        "A": "/audio/phrases/turn-de25280bfef100d8f096.mp3"
      },
      "Oh, danke schön.": {
        "B": "/audio/phrases/turn-508f3ef53203a1d1073a.mp3",
        "A": "/audio/phrases/turn-2c83c5a78d76086d6b40.mp3"
      },
      "Wo ist denn hier ein Café?": {
        "A": "/audio/phrases/turn-6a259cd6b7ebc2d8b21d.mp3",
        "B": "/audio/phrases/turn-d2afd5edc3eda2a82f5e.mp3"
      },
      "Wo ist denn hier der Bahnhof?": {
        "A": "/audio/phrases/turn-14fc8b9f983bc7b57707.mp3",
        "B": "/audio/phrases/turn-af4e51f6b12aa44fbacb.mp3"
      },
      "Wo ist denn hier eine Apotheke?": {
        "A": "/audio/phrases/turn-1e5b015fe3a98eeb0e73.mp3",
        "B": "/audio/phrases/turn-16b65266c5abe5ee236e.mp3"
      },
      "Wo ist denn hier eine Bibliothek?": {
        "A": "/audio/phrases/turn-67db78aa57097cd7e64a.mp3",
        "B": "/audio/phrases/turn-cb4d2747b99c88754cc1.mp3"
      },
      "Wo ist denn hier ein Kino?": {
        "A": "/audio/phrases/turn-cb9836a013acbacb1cac.mp3",
        "B": "/audio/phrases/turn-bf755fd8dad79227bfb2.mp3"
      },
      "Wo ist denn hier der Park?": {
        "A": "/audio/phrases/turn-afd9f2e3967dabba5482.mp3",
        "B": "/audio/phrases/turn-4338e931cc2a306167c4.mp3"
      },
      "Sie gehen die zweite Straße nach rechts. Folgen Sie der Straße um die Kurve. Da sehen Sie die Post.": {
        "A": "/audio/phrases/turn-0a0f1b90a07abb697470.mp3",
        "B": "/audio/phrases/turn-f2f81ef8d450d98530e1.mp3"
      },
      "Sie gehen die zweite Straße nach links. Da sehen Sie das Café.": {
        "A": "/audio/phrases/turn-75f375fecf80bad695cc.mp3",
        "B": "/audio/phrases/turn-9857359d93c74d8d5e4b.mp3"
      },
      "Sie gehen die erste Straße nach links. Vor der Apotheke biegen Sie nach rechts ab. Folgen Sie der Straße bis zum Bahnhof.": {
        "A": "/audio/phrases/turn-43b1346b6cb2b0097467.mp3",
        "B": "/audio/phrases/turn-9af4410fe9b5dfb1813f.mp3"
      },
      "Sie gehen die erste Straße nach links. Dann gehen Sie an der nächsten Kreuzung geradeaus. Da sehen Sie die Apotheke.": {
        "A": "/audio/phrases/turn-5b1045b6082ad8d2a923.mp3",
        "B": "/audio/phrases/turn-c4b8bd295a65a3cc9e4a.mp3"
      },
      "Sie gehen die zweite Straße nach rechts. Folgen Sie der Straße. Da sehen Sie die Bibliothek.": {
        "A": "/audio/phrases/turn-91f4da00e84c84625fd0.mp3",
        "B": "/audio/phrases/turn-0b6f23e2c037bd2af87f.mp3"
      },
      "Sie gehen die erste Straße nach rechts. Folgen Sie der Straße. Da sehen Sie das Kino.": {
        "A": "/audio/phrases/turn-59c4b9b88e47e9f06d55.mp3",
        "B": "/audio/phrases/turn-48f6f611bbf2cfbcf562.mp3"
      },
      "Sie gehen die zweite Straße nach rechts. Da sehen Sie den Park.": {
        "A": "/audio/phrases/turn-14351ad2def9aa800f46.mp3",
        "B": "/audio/phrases/turn-e749548e8a52a800837f.mp3"
      },
      "Wo muss ich dann abbiegen?": {
        "A": "/audio/phrases/turn-32bcd673568034ed3efb.mp3",
        "B": "/audio/phrases/turn-08c1f4159c3987bee4d3.mp3"
      },
      "Ja, das ist weit.": {
        "A": "/audio/phrases/turn-6ff88fad1b9f933a5e1e.mp3",
        "B": "/audio/phrases/turn-8ec7a8b3b5600e8a595c.mp3"
      },
      "Bitte schön.": {
        "A": "/audio/phrases/turn-41d99037d292ded744d1.mp3",
        "B": "/audio/phrases/turn-3f085ffca8be618cd537.mp3"
      },
      "Eine Frage bitte: Ich suche die Bank.": {
        "A": "/audio/phrases/turn-0e0491a101f7ca8aaa6b.mp3",
        "B": "/audio/phrases/turn-19463150b440e9a0930b.mp3"
      },
      "Eine Frage bitte: Ich suche das Café.": {
        "A": "/audio/phrases/turn-f317aab18c3e28c9ffaa.mp3",
        "B": "/audio/phrases/turn-8a0f456b90bc79509199.mp3"
      },
      "Eine Frage bitte: Ich suche den Bahnhof.": {
        "A": "/audio/phrases/turn-60c41fdfa857d135e6bb.mp3",
        "B": "/audio/phrases/turn-e605445c12c071e6c029.mp3"
      },
      "Eine Frage bitte: Ich suche die Apotheke.": {
        "A": "/audio/phrases/turn-b481edc328caf70a932f.mp3",
        "B": "/audio/phrases/turn-895f6c4b573c468d625a.mp3"
      },
      "Eine Frage bitte: Ich suche die Bibliothek.": {
        "A": "/audio/phrases/turn-f5f48864ad4cfe8adfd8.mp3",
        "B": "/audio/phrases/turn-b6245bef36fb036ad949.mp3"
      },
      "Eine Frage bitte: Ich suche das Kino.": {
        "A": "/audio/phrases/turn-901289c5237daf91428d.mp3",
        "B": "/audio/phrases/turn-71a8e53a59b6cd470d55.mp3"
      },
      "Eine Frage bitte: Ich suche den Park.": {
        "A": "/audio/phrases/turn-d8fb980ffb8567cba9db.mp3",
        "B": "/audio/phrases/turn-fc22f64dd577ad09fd37.mp3"
      },
      "Kann ich zu Fuß zur Post gehen?": {
        "A": "/audio/phrases/turn-f7868a4a014ce6b15b73.mp3",
        "B": "/audio/phrases/turn-5e06f5ff9df12910da03.mp3"
      },
      "Kann ich zu Fuß zur Bank gehen?": {
        "A": "/audio/phrases/turn-b54cf504fcfa45ddfd64.mp3",
        "B": "/audio/phrases/turn-5a6cd58550e2950a55ca.mp3"
      },
      "Kann ich zu Fuß zum Café gehen?": {
        "A": "/audio/phrases/turn-bf54cdc4d574ff6b3fa3.mp3",
        "B": "/audio/phrases/turn-85a7a00fc9e3ff1a4b41.mp3"
      },
      "Kann ich zu Fuß zum Bahnhof gehen?": {
        "A": "/audio/phrases/turn-0b207531d1558d7ca72f.mp3",
        "B": "/audio/phrases/turn-e4dc835658e7541640a1.mp3"
      },
      "Kann ich zu Fuß zur Apotheke gehen?": {
        "A": "/audio/phrases/turn-d4a9c1c38dcd1138610d.mp3",
        "B": "/audio/phrases/turn-84510a583e68169eabf4.mp3"
      },
      "Kann ich zu Fuß zur Bibliothek gehen?": {
        "A": "/audio/phrases/turn-7c04f9aabc4afbfb3d56.mp3",
        "B": "/audio/phrases/turn-45f9d1b357fc44edf3f2.mp3"
      },
      "Kann ich zu Fuß zum Kino gehen?": {
        "A": "/audio/phrases/turn-162687c82ab493f02b7d.mp3",
        "B": "/audio/phrases/turn-b1b38baafe0a57d1704d.mp3"
      },
      "Kann ich zu Fuß zum Park gehen?": {
        "A": "/audio/phrases/turn-83db86efb31ea31c997b.mp3",
        "B": "/audio/phrases/turn-c57006c89c92e85ea7ad.mp3"
      }
    },
    "notes": {}
  }
};
