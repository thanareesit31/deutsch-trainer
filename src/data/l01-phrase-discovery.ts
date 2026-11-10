import type { DiscoveryTopic } from "@/lib/phrase-discovery";

export const l01PhraseDiscovery = [
  {
    "id": "L01-COMM-01",
    "title": "ทักทายและลา",
    "note": "ตอนเช้า: Guten Morgen! = สวัสดีตอนเช้า\nตอนกลางวัน: Guten Tag! = สวัสดี\nตอนเย็น: Guten Abend! = สวัสดีตอนเย็น\nลาเพื่อน: Tschüs! = ลาก่อน\nลาแบบสุภาพ: Auf Wiedersehen! = แล้วพบกันใหม่",
    "introducedIn": 1,
    "tasks": [
      {
        "id": "L01-COMM-01-D01-learn-v1",
        "targetId": "L01-COMM-01-D01-target",
        "objectiveId": "L01-COMM-01",
        "sourceExampleId": "L01-COMM-01-D01",
        "context": "เวลา 08:00 น. · พบครูที่ห้องเรียน",
        "prompt": "Guten Morgen!",
        "promptTh": "สวัสดีตอนเช้า",
        "answer": "Guten Morgen!",
        "answerTh": "สวัสดีตอนเช้า",
        "explanation": "เวลา 08:00 น. เป็นตอนเช้า จึงทักทายด้วย Guten Morgen!\nGuten Abend! ใช้ตอนเย็น ส่วน Auf Wiedersehen! ใช้ลา",
        "wordHelp": false,
        "difficulty": 1,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "เลือกสำนวนทักทาย ลา ขอบคุณ หรือรับคำชมจากคำพูดตรงหน้าและบทบาทที่ระบุ; เป็นสูตรสั้นและมีตัวเลือก ไม่ต้องเรียกคืนคำเอง",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Guten Abend!",
          "Guten Morgen!",
          "Auf Wiedersehen!"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/guten-morgen-sunrise.jpg",
          "alt": "คนสองคนคุยกันระหว่างอาหารเช้า",
          "caption": "",
          "time": "08:00",
          "cue": "none"
        }
      },
      {
        "id": "L01-COMM-01-D04-learn-v1",
        "targetId": "L01-COMM-01-D04-target",
        "objectiveId": "L01-COMM-01",
        "sourceExampleId": "L01-COMM-01-D04",
        "context": "กำลังแยกย้ายกลับบ้าน · คุยกับเพื่อน",
        "prompt": "Tschüs!",
        "promptTh": "ลาก่อน",
        "answer": "Tschüs!",
        "answerTh": "ลาก่อน",
        "explanation": "คุณกำลังลาเพื่อน จึงใช้ Tschüs!\nGuten Tag! และ Guten Morgen! ใช้ทักทายเมื่อพบกัน",
        "wordHelp": false,
        "difficulty": 1,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "เลือกสำนวนทักทาย ลา ขอบคุณ หรือรับคำชมจากคำพูดตรงหน้าและบทบาทที่ระบุ; เป็นสูตรสั้นและมีตัวเลือก ไม่ต้องเรียกคืนคำเอง",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Guten Tag!",
          "Guten Morgen!",
          "Tschüs!"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/tschuess-ciao.jpg",
          "alt": "เพื่อนสองคนโบกมือลาและเดินแยกกัน",
          "caption": "แยกย้ายกลับบ้าน",
          "time": null,
          "cue": "none"
        }
      }
    ]
  },
  {
    "id": "L01-COMM-02",
    "title": "บอกชื่อและแนะนำคนอื่น",
    "note": "บอกชื่อของคุณ: Ich heiße Mali. หรือ Ich bin Mali. = ฉันชื่อมะลิ\nแนะนำคนอื่น: Das ist Mali. = นี่คือมะลิ",
    "introducedIn": 1,
    "tasks": [
      {
        "id": "L01-COMM-02-D01-learn-v1",
        "targetId": "L01-COMM-02-D01-target",
        "objectiveId": "L01-COMM-02",
        "sourceExampleId": "L01-COMM-02-D01",
        "context": "คุณชื่อ Mali · คุยกับเพื่อนร่วมชั้น",
        "prompt": "Ich heiße Anna. Und wer bist du?",
        "promptTh": "ฉันชื่ออันนา แล้วเธอคือใคร",
        "answer": "Ich bin Mali.",
        "answerTh": "ฉันชื่อมะลิ",
        "explanation": "ในข้อนี้ Ich bin ใช้แนะนำตัวว่า ฉันชื่อ…\nวางชื่อ Mali ไว้หลัง bin",
        "wordHelp": true,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "supplied-words"
        ],
        "difficultyRationale": "มีตัวอย่างการสอนก่อนตอบและมีคำให้ทั้งหมด; วัดลำดับคำ",
        "kind": "order",
        "subskill": "phrase_word_order",
        "tokens": [
          "Mali.",
          "bin",
          "Ich"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "identity",
          "role": "คุณ",
          "givenName": "Mali",
          "familyName": null
        }
      },
      {
        "id": "L01-COMM-02-D03-learn-v1",
        "targetId": "L01-COMM-02-D03-target",
        "objectiveId": "L01-COMM-02",
        "sourceExampleId": "L01-COMM-02-D03",
        "context": "คุณคือ Anna · กำลังแนะนำเพื่อนชื่อ Mali",
        "prompt": "Wer ist das?",
        "promptTh": "นี่คือใคร",
        "answer": "Das ist Mali.",
        "answerTh": "นี่คือมะลิ",
        "explanation": "คุณกำลังแนะนำ Mali จึงใช้ Das ist ตามด้วยชื่อ\nIch bin ใช้บอกชื่อของตัวคุณเอง",
        "wordHelp": true,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "ต้องเชื่อมคำถามหรือคำพูดก่อนหน้ากับข้อมูลเฉพาะของผู้ตอบและบทบาท du/Sie ที่ระบุ; เลือกประโยคจากตัวเลือก จึงยังไม่ใช่การผลิตภาษาอิสระ",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Ich bin Anna.",
          "Das ist Mali.",
          "Ich komme aus Thailand."
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "introduction",
          "selfName": "Anna",
          "otherName": "Mali"
        }
      }
    ]
  },
  {
    "id": "L01-COMM-03",
    "title": "ถามว่าเป็นอย่างไรบ้าง",
    "note": "ถามเพื่อน: Wie geht's dir? = เธอเป็นอย่างไรบ้าง\nถามแบบสุภาพ: Wie geht es Ihnen? = คุณเป็นอย่างไรบ้าง\nถามกลับว่า แล้วเธอ/คุณล่ะ: Und dir? กับเพื่อน หรือ Und Ihnen? แบบสุภาพ\nคำตอบบอกความรู้สึก: Gut = สบายดี · Nicht so gut = ไม่ค่อยดี",
    "introducedIn": 1,
    "tasks": [
      {
        "id": "L01-COMM-03-D02-learn-v1",
        "targetId": "L01-COMM-03-D02-target",
        "objectiveId": "L01-COMM-03",
        "sourceExampleId": "L01-COMM-03-D02",
        "context": "คุณสบายดี · คุยกับเจ้าหน้าที่อย่างสุภาพ",
        "prompt": "Wie geht es Ihnen?",
        "promptTh": "คุณเป็นอย่างไรบ้าง",
        "answer": "Gut, danke. Und Ihnen?",
        "answerTh": "สบายดี ขอบคุณ แล้วคุณล่ะ",
        "explanation": "คุณคุยกับเจ้าหน้าที่อย่างสุภาพ จึงถามกลับด้วย Und Ihnen?\nUnd dir? ใช้ถามกลับแบบกันเอง เช่น เมื่อคุยกับเพื่อน",
        "wordHelp": true,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "ต้องเชื่อมคำถามหรือคำพูดก่อนหน้ากับข้อมูลเฉพาะของผู้ตอบและบทบาท du/Sie ที่ระบุ; เลือกประโยคจากตัวเลือก จึงยังไม่ใช่การผลิตภาษาอิสระ",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Gut, danke. Und dir?",
          "Ich heiße Mali.",
          "Gut, danke. Und Ihnen?"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/feeling-gut.jpg",
          "alt": "ผู้หญิงยิ้มและยกนิ้วโป้ง",
          "caption": "คุยอย่างสุภาพ · Sie",
          "time": null,
          "cue": "none"
        }
      },
      {
        "id": "L01-COMM-03-D03-learn-v1",
        "targetId": "L01-COMM-03-D03-target",
        "objectiveId": "L01-COMM-03",
        "sourceExampleId": "L01-COMM-03-D03",
        "context": "วันนี้คุณรู้สึกไม่ค่อยดี · คุยกับเพื่อน",
        "prompt": "Wie geht's dir?",
        "promptTh": "เธอเป็นอย่างไรบ้าง",
        "answer": "Nicht so gut.",
        "answerTh": "ไม่ค่อยดี",
        "explanation": "วันนี้คุณรู้สึกไม่ค่อยดี จึงตอบ Nicht so gut.\nSehr gut. หมายถึงสบายดีมาก",
        "wordHelp": true,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "ต้องเชื่อมคำถามหรือคำพูดก่อนหน้ากับข้อมูลเฉพาะของผู้ตอบและบทบาท du/Sie ที่ระบุ; เลือกประโยคจากตัวเลือก จึงยังไม่ใช่การผลิตภาษาอิสระ",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Sehr gut.",
          "Nicht so gut.",
          "Auf Wiedersehen!"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/feeling-nicht-so-gut.jpg",
          "alt": "ผู้หญิงทำหน้าหม่นและนั่งเท้าคาง",
          "caption": "คุยกับเพื่อน",
          "time": null,
          "cue": "none"
        }
      }
    ]
  },
  {
    "id": "L01-COMM-04",
    "title": "ถามว่ามาจากไหน",
    "note": "บอกประเทศของคุณ: Ich komme aus Thailand. = ฉันมาจากประเทศไทย\nบอกประเทศของ Anna: Sie kommt aus Deutschland. = เธอมาจากเยอรมนี\nSie ในตัวอย่างนี้หมายถึง Anna",
    "introducedIn": 1,
    "tasks": [
      {
        "id": "L01-COMM-04-D01-learn-v1",
        "targetId": "L01-COMM-04-D01-target",
        "objectiveId": "L01-COMM-04",
        "sourceExampleId": "L01-COMM-04-D01",
        "context": "คุณมาจากประเทศไทย · คุยกับเจ้าหน้าที่อย่างสุภาพ",
        "prompt": "Woher kommen Sie?",
        "promptTh": "คุณมาจากที่ไหน",
        "answer": "Ich komme aus Thailand.",
        "answerTh": "ฉันมาจากประเทศไทย",
        "explanation": "เริ่มด้วย Ich komme เพื่อพูดถึงตัวคุณเอง\nตามด้วย aus Thailand เพื่อบอกว่ามาจากประเทศไทย",
        "wordHelp": true,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "supplied-words"
        ],
        "difficultyRationale": "มีตัวอย่างการสอนก่อนตอบและมีคำให้ทั้งหมด; วัดลำดับคำ",
        "kind": "order",
        "subskill": "phrase_word_order",
        "tokens": [
          "Thailand.",
          "aus",
          "komme",
          "Ich"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "origin",
          "person": "Mali",
          "role": "คุณ",
          "country": "TH"
        }
      },
      {
        "id": "L01-COMM-04-D02-learn-v1",
        "targetId": "L01-COMM-04-D02-target",
        "objectiveId": "L01-COMM-04",
        "sourceExampleId": "L01-COMM-04-D02",
        "context": "Anna มาจากเยอรมนี · คุณกำลังบอกว่าเธอมาจากไหน",
        "prompt": "Woher kommt Anna?",
        "promptTh": "อันนามาจากที่ไหน",
        "answer": "Sie kommt aus Deutschland.",
        "answerTh": "เธอมาจากเยอรมนี",
        "explanation": "Sie ในคำตอบนี้หมายถึง Anna จึงใช้ kommt\naus Deutschland บอกว่าเธอมาจากเยอรมนี",
        "wordHelp": true,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "ต้องเชื่อมคำถามหรือคำพูดก่อนหน้ากับข้อมูลเฉพาะของผู้ตอบและบทบาท du/Sie ที่ระบุ; เลือกประโยคจากตัวเลือก จึงยังไม่ใช่การผลิตภาษาอิสระ",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Ich komme aus Thailand.",
          "Sie kommt aus Deutschland.",
          "Sie heißt Mali."
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "origin",
          "person": "Anna",
          "role": "คนที่คุณพูดถึง",
          "country": "DE"
        }
      }
    ]
  },
  {
    "id": "L01-COMM-05",
    "title": "ขอให้พูดซ้ำและขอบคุณ",
    "note": "ฟังไม่ชัด: Entschuldigung. Wie bitte? = ขอโทษนะ อะไรนะ\nอีกฝ่ายช่วยพูดซ้ำหรือสะกดให้แล้ว: Danke. = ขอบคุณ",
    "introducedIn": 1,
    "tasks": [
      {
        "id": "L01-COMM-05-D01-learn-v1",
        "targetId": "L01-COMM-05-D01-target",
        "objectiveId": "L01-COMM-05",
        "sourceExampleId": "L01-COMM-05-D01",
        "context": "คุณฟังชื่อที่เพิ่งได้ยินไม่ชัด",
        "prompt": "Ich heiße Mali.",
        "promptTh": "ฉันชื่อมะลิ",
        "answer": "Entschuldigung. Wie bitte?",
        "answerTh": "ขอโทษนะ อะไรนะ",
        "explanation": "คุณฟังชื่อไม่ชัด จึงใช้ Wie bitte? เพื่อขอให้อีกฝ่ายพูดซ้ำ\nเติม Entschuldigung. ข้างหน้าเพื่อกล่าวขอโทษอย่างสุภาพ",
        "wordHelp": false,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "ต้องเชื่อมคำถามหรือคำพูดก่อนหน้ากับข้อมูลเฉพาะของผู้ตอบและบทบาท du/Sie ที่ระบุ; เลือกประโยคจากตัวเลือก จึงยังไม่ใช่การผลิตภาษาอิสระ",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Auf Wiedersehen!",
          "Entschuldigung. Wie bitte?",
          "Ich komme aus Thailand."
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/name.jpg",
          "alt": "คนหนึ่งบอกชื่อขณะพบเพื่อนใหม่",
          "caption": "ฟังชื่อไม่ชัด",
          "time": null,
          "cue": "unclear-name"
        }
      },
      {
        "id": "L01-COMM-05-D03-learn-v1",
        "targetId": "L01-COMM-05-D03-target",
        "objectiveId": "L01-COMM-05",
        "sourceExampleId": "L01-COMM-05-D03",
        "context": "อีกฝ่ายเพิ่งสะกดชื่อให้แล้ว · คุณต้องการขอบคุณ",
        "prompt": "Mali. M-A-L-I.",
        "promptTh": "มะลิ เอ็ม เอ แอล ไอ",
        "answer": "Danke.",
        "answerTh": "ขอบคุณ",
        "explanation": "อีกฝ่ายช่วยสะกดชื่อให้แล้ว จึงตอบ Danke. เพื่อขอบคุณ",
        "wordHelp": false,
        "difficulty": 2,
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "difficultyRationale": "ต้องเชื่อมคำถามหรือคำพูดก่อนหน้ากับข้อมูลเฉพาะของผู้ตอบและบทบาท du/Sie ที่ระบุ; เลือกประโยคจากตัวเลือก จึงยังไม่ใช่การผลิตภาษาอิสระ",
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Danke.",
          "Wie heißt du?",
          "Guten Abend!"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/vorname.jpg",
          "alt": "คนกำลังจดข้อมูลชื่อในแบบฟอร์ม",
          "caption": "อีกฝ่ายช่วยสะกดให้แล้ว",
          "time": null,
          "cue": "spelled-name"
        }
      }
    ]
  },
  {
    "id": "L01-SUP-name-fields",
    "title": "ถามชื่อและนามสกุล",
    "note": "ถามชื่อ: Wie ist dein Vorname?\nตอบชื่อ: Mein Vorname ist Mali. = ฉันชื่อมะลิ\nถามนามสกุล: Wie ist dein Familienname?\nตอบนามสกุล: Mein Familienname ist Sommer. = ฉันนามสกุลซอมเมอร์",
    "introducedIn": 2,
    "tasks": [
      {
        "id": "L01-SUP-N01-learn-v1",
        "targetId": "L01-SUP-N01-target",
        "objectiveId": "L01-COMM-02",
        "sourceExampleId": "L01-SUP-N01",
        "context": "ในสถานการณ์นี้ คุณชื่อ Mali นามสกุล Sommer",
        "prompt": "Wie ist dein Vorname?",
        "promptTh": "เธอชื่ออะไร",
        "answer": "Mein Vorname ist Mali.",
        "answerTh": "ฉันชื่อมะลิ",
        "explanation": "คำถามนี้ต้องการชื่อตัว ในสถานการณ์นี้คือ Mali\nSommer เป็นนามสกุล จึงไม่ใช่ข้อมูลที่ถาม",
        "wordHelp": false,
        "difficulty": 2,
        "difficultyRationale": "อ่านบัตรชื่อแล้วเลือกข้อมูลให้ตรงคำถาม",
        "assistance": [
          "model-dialogue",
          "person-card",
          "german-reply-options"
        ],
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Mein Familienname ist Sommer.",
          "Mein Vorname ist Mali.",
          "Ich komme aus Thailand."
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "identity",
          "role": "คุณ",
          "givenName": "Mali",
          "familyName": "Sommer"
        }
      },
      {
        "id": "L01-SUP-N02-learn-v1",
        "targetId": "L01-SUP-N02-target",
        "objectiveId": "L01-COMM-02",
        "sourceExampleId": "L01-SUP-N02",
        "context": "ในสถานการณ์นี้ คุณชื่อ Mali นามสกุล Sommer",
        "prompt": "Wie ist dein Familienname?",
        "promptTh": "เธอนามสกุลอะไร",
        "answer": "Mein Familienname ist Sommer.",
        "answerTh": "ฉันนามสกุลซอมเมอร์",
        "explanation": "คำถามนี้ต้องการนามสกุล ในสถานการณ์นี้คือ Sommer\nMali เป็นชื่อตัว",
        "wordHelp": false,
        "difficulty": 2,
        "difficultyRationale": "อ่านบัตรชื่อแล้วเลือกข้อมูลให้ตรงคำถาม",
        "assistance": [
          "model-dialogue",
          "person-card",
          "german-reply-options"
        ],
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Mein Vorname ist Mali.",
          "Freut mich!",
          "Mein Familienname ist Sommer."
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "identity",
          "role": "คุณ",
          "givenName": "Mali",
          "familyName": "Sommer"
        }
      }
    ]
  },
  {
    "id": "L01-SUP-name-spelling",
    "title": "ขอให้สะกดชื่อ",
    "note": "ขอให้สะกดชื่อ: Wie bitte? Wie schreibt man das? = อะไรนะ สะกดอย่างไร\nเมื่ออีกฝ่ายถาม ให้บอกชื่อทีละตัวอักษร เช่น Mali: M–A–L–I\nกดปุ่มตัวอักษรในตัวอย่างเพื่อฟังทีละตัว",
    "introducedIn": 2,
    "tasks": [
      {
        "id": "L01-SUP-S01-learn-v1",
        "targetId": "L01-SUP-S01-target",
        "objectiveId": "L01-COMM-05",
        "sourceExampleId": "L01-SUP-S01",
        "context": "คุณต้องจดชื่ออีกฝ่าย แต่ยังไม่แน่ใจว่าสะกดอย่างไร",
        "prompt": "Mein Vorname ist Mali.",
        "promptTh": "ฉันชื่อมะลิ",
        "answer": "Wie bitte? Wie schreibt man das?",
        "answerTh": "อะไรนะ สะกดอย่างไร",
        "explanation": "Wie schreibt man das? ใช้ถามว่าชื่อหรือคำที่เพิ่งได้ยินสะกดอย่างไร\nWie bitte? ใช้ขอให้พูดซ้ำเมื่อฟังไม่ชัด",
        "wordHelp": false,
        "difficulty": 1,
        "difficultyRationale": "เลือกสำนวนตอบให้ตรงหน้าที่ในบทสนทนาที่มีตัวอย่างให้เรียนก่อน",
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Wie geht es dir?",
          "Wie bitte? Wie schreibt man das?",
          "Freut mich!"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/vorname.jpg",
          "alt": "คนกำลังเขียนข้อมูลชื่อในแบบฟอร์ม",
          "caption": "กำลังจดชื่อ",
          "time": null,
          "cue": "write-name"
        }
      },
      {
        "id": "L01-SUP-S02-learn-v1",
        "targetId": "L01-SUP-S02-target",
        "objectiveId": "L01-COMM-05",
        "sourceExampleId": "L01-SUP-S02",
        "context": "ชื่อของคุณคือ Mali · ใช้ตัวอักษรที่ให้สะกดชื่อนี้",
        "prompt": "Wie schreibt man das?",
        "promptTh": "สะกดอย่างไร",
        "answer": "M-A-L-I.",
        "answerTh": "สะกดชื่อมะลิทีละตัวอักษร",
        "explanation": "ชื่อ Mali เริ่มด้วย M ตามด้วย A, L และ I\nเมื่อบอกตัวสะกด ให้ออกเสียงทีละตัวอักษร",
        "wordHelp": false,
        "difficulty": 2,
        "difficultyRationale": "เรียงตัวอักษรที่ให้ตามชื่อที่แสดง; เป็นการฝึกแบบมีตัวช่วย ไม่ใช่เรียกคืนตัวสะกดเอง",
        "assistance": [
          "model-dialogue",
          "visible-name",
          "supplied-letters"
        ],
        "kind": "letters",
        "subskill": "name_letter_order",
        "tokens": [
          "L",
          "I",
          "M",
          "A"
        ],
        "listening": {
          "version": "name-listening-v1",
          "targetId": "L01-SUP-S02-listening-target",
          "subskill": "name_letter_listening",
          "audioText": "Em. A. El. I.",
          "difficulty": 3,
          "difficultyRationale": "Decode German letter names without seeing the written name; supplied letters, replay and prior teaching remain assistance.",
          "assistance": [
            "prior-model",
            "replayable-german-letter-audio",
            "supplied-letters"
          ],
          "audioSource": "/audio/l01/spelling-dialogue-v1.m4a"
        },
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "identity",
          "role": "คุณ",
          "givenName": "Mali",
          "familyName": null
        }
      }
    ]
  },
  {
    "id": "L01-SUP-nice-to-meet",
    "title": "ตอบว่ายินดีที่ได้รู้จัก",
    "note": "หลังแนะนำตัว ใช้ Freut mich! = ยินดีที่ได้รู้จัก\nถ้าอีกฝ่ายพูดก่อน ตอบ Freut mich auch! = ยินดีที่ได้รู้จักเช่นกัน\nauch ในคำตอบนี้หมายถึง เช่นกัน",
    "introducedIn": 2,
    "tasks": [
      {
        "id": "L01-SUP-P01-learn-v1",
        "targetId": "L01-SUP-P01-target",
        "objectiveId": "L01-COMM-02",
        "sourceExampleId": "L01-SUP-P01",
        "context": "ทั้งคู่บอกชื่อแล้ว · คุณได้ยินชัดเจนและอยากบอกว่ายินดีที่รู้จัก",
        "prompt": "Ich heiße Anna.",
        "promptTh": "ฉันชื่ออันนา",
        "answer": "Freut mich!",
        "answerTh": "ยินดีที่ได้รู้จัก",
        "explanation": "หลังรู้จักชื่อกันแล้ว ใช้ Freut mich! เพื่อบอกว่ายินดีที่ได้รู้จัก",
        "wordHelp": false,
        "difficulty": 1,
        "difficultyRationale": "เลือกสำนวนตอบให้ตรงหน้าที่ในบทสนทนาที่มีตัวอย่างให้เรียนก่อน",
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Auf Wiedersehen!",
          "Wie bitte?",
          "Freut mich!"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/hallo-informal.jpg",
          "alt": "คนสองคนพบกันและพูดคุยอย่างเป็นมิตร",
          "caption": "แนะนำตัวแล้ว · ได้ยินชื่อชัดเจน",
          "time": null,
          "cue": "none"
        }
      },
      {
        "id": "L01-SUP-P02-learn-v1",
        "targetId": "L01-SUP-P02-target",
        "objectiveId": "L01-COMM-02",
        "sourceExampleId": "L01-SUP-P02",
        "context": "เพื่อนใหม่บอกว่ายินดีที่ได้รู้จัก · คุณรู้สึกเช่นเดียวกัน",
        "prompt": "Freut mich!",
        "promptTh": "ยินดีที่ได้รู้จัก",
        "answer": "Freut mich auch!",
        "answerTh": "ยินดีที่ได้รู้จักเช่นกัน",
        "explanation": "เพิ่ม auch เพื่อบอกว่าคุณยินดีที่ได้รู้จักเช่นกัน\nตอนนี้ทั้งคู่แนะนำตัวแล้ว จึงไม่ต้องถามชื่อซ้ำ",
        "wordHelp": false,
        "difficulty": 1,
        "difficultyRationale": "เลือกสำนวนตอบให้ตรงหน้าที่ในบทสนทนาที่มีตัวอย่างให้เรียนก่อน",
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Ich komme aus Thailand.",
          "Freut mich auch!",
          "Wie heißt du?"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/hallo-informal.jpg",
          "alt": "คนสองคนพบกันและพูดคุยอย่างเป็นมิตร",
          "caption": "เพิ่งรู้จักกัน",
          "time": null,
          "cue": "none"
        }
      }
    ]
  },
  {
    "id": "L01-SUP-good-night",
    "title": "ลาก่อนเข้านอน",
    "note": "ก่อนเข้านอน ใช้ Gute Nacht! = ราตรีสวัสดิ์\nเมื่อพบกันตอนเย็น ใช้ Guten Abend! = สวัสดีตอนเย็น",
    "introducedIn": 2,
    "tasks": [
      {
        "id": "L01-SUP-G01-learn-v1",
        "targetId": "L01-SUP-G01-target",
        "objectiveId": "L01-COMM-01",
        "sourceExampleId": "L01-SUP-G01",
        "context": "เวลา 22:30 น. · คุณกับเพื่อนกำลังลากันเพื่อไปนอน",
        "prompt": "Tschüs!",
        "promptTh": "ลาก่อน",
        "answer": "Gute Nacht!",
        "answerTh": "ราตรีสวัสดิ์",
        "explanation": "คุณกำลังลาก่อนเข้านอน จึงใช้ Gute Nacht!\nGuten Abend! ใช้ทักทายเมื่อพบกันตอนเย็น",
        "wordHelp": false,
        "difficulty": 1,
        "difficultyRationale": "เลือกสำนวนตอบให้ตรงหน้าที่ในบทสนทนาที่มีตัวอย่างให้เรียนก่อน",
        "assistance": [
          "model-dialogue",
          "authored-context",
          "german-reply-options"
        ],
        "kind": "choice",
        "subskill": "phrase_dialogue_response",
        "options": [
          "Guten Morgen!",
          "Gute Nacht!",
          "Guten Abend!"
        ],
        "visual": {
          "version": "l01-context-visuals-v1",
          "kind": "scene",
          "image": "/images/lektion-1-core-vocabulary-images/gute-nacht.jpg",
          "alt": "คนหนึ่งโบกมือลาอีกคนที่อยู่บนเตียงตอนกลางคืน",
          "caption": "ก่อนเข้านอน",
          "time": "22:30",
          "cue": "none"
        }
      }
    ]
  }
] satisfies readonly DiscoveryTopic[];
