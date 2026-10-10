import type { Item } from "./content";

export const l13VerbContent: Record<string, NonNullable<Item["verbContent"]>> = {
  "L13-V022": {
    infinitive: "gefallen",
    stem: "gefall",
    examples: [
      { de: "Der Park gefällt mir.", th: "ฉันชอบสวนสาธารณะแห่งนี้" },
      { de: "Die alten Häuser gefallen uns.", th: "พวกเราชอบบ้านเก่าเหล่านี้" },
    ],
    conjugations: [
      { subject: "ich", form: "gefalle", ending: "e" },
      {
        subject: "du",
        form: "gefällst",
        ending: "st",
        segments: [
          { text: "gef", changed: false },
          { text: "ä", changed: true },
          { text: "ll", changed: false },
          { text: "st", changed: true },
        ],
      },
      {
        subject: "er / sie / es",
        form: "gefällt",
        ending: "t",
        segments: [
          { text: "gef", changed: false },
          { text: "ä", changed: true },
          { text: "ll", changed: false },
          { text: "t", changed: true },
        ],
      },
      { subject: "wir", form: "gefallen", ending: "en" },
      { subject: "ihr", form: "gefallt", ending: "t" },
      { subject: "sie / Sie", form: "gefallen", ending: "en" },
    ],
  },
  "L13-V023": {
    infinitive: "gehören",
    stem: "gehör",
    examples: [
      { de: "Das Café gehört der Frau.", th: "คาเฟ่แห่งนี้เป็นของผู้หญิงคนนั้น" },
      { de: "Die Wohnung gehört uns.", th: "อพาร์ตเมนต์แห่งนี้เป็นของพวกเรา" },
    ],
    conjugations: [
      { subject: "ich", form: "gehöre", ending: "e" },
      { subject: "du", form: "gehörst", ending: "st" },
      { subject: "er / sie / es", form: "gehört", ending: "t" },
      { subject: "wir", form: "gehören", ending: "en" },
      { subject: "ihr", form: "gehört", ending: "t" },
      { subject: "sie / Sie", form: "gehören", ending: "en" },
    ],
  },
  "L13-V024": {
    infinitive: "helfen",
    stem: "helf",
    examples: [
      { de: "Ich helfe dir am Bahnhof.", th: "ฉันช่วยคุณที่สถานีรถไฟ" },
      { de: "Du hilfst der Frau auf dem Markt.", th: "คุณช่วยผู้หญิงคนนั้นที่ตลาด" },
    ],
    conjugations: [
      { subject: "ich", form: "helfe", ending: "e" },
      {
        subject: "du",
        form: "hilfst",
        ending: "st",
        segments: [
          { text: "h", changed: false },
          { text: "i", changed: true },
          { text: "lf", changed: false },
          { text: "st", changed: true },
        ],
      },
      {
        subject: "er / sie / es",
        form: "hilft",
        ending: "t",
        segments: [
          { text: "h", changed: false },
          { text: "i", changed: true },
          { text: "lf", changed: false },
          { text: "t", changed: true },
        ],
      },
      { subject: "wir", form: "helfen", ending: "en" },
      { subject: "ihr", form: "helft", ending: "t" },
      { subject: "sie / Sie", form: "helfen", ending: "en" },
    ],
  },
  "L13-V025": {
    infinitive: "danken",
    stem: "dank",
    examples: [
      { de: "Ich danke dir für den Stadtplan.", th: "ฉันขอบคุณคุณสำหรับแผนที่เมือง" },
      { de: "Wir danken dem Mann auf dem Markt für seine Hilfe.", th: "พวกเราขอบคุณผู้ชายคนนั้นที่ตลาดสำหรับความช่วยเหลือของเขา" },
    ],
    conjugations: [
      { subject: "ich", form: "danke", ending: "e" },
      { subject: "du", form: "dankst", ending: "st" },
      { subject: "er / sie / es", form: "dankt", ending: "t" },
      { subject: "wir", form: "danken", ending: "en" },
      { subject: "ihr", form: "dankt", ending: "t" },
      { subject: "sie / Sie", form: "danken", ending: "en" },
    ],
  },
  "L13-V026": {
    infinitive: "finden",
    stem: "find",
    examples: [
      { de: "Ich finde die Altstadt schön.", th: "ฉันคิดว่าย่านเมืองเก่าสวย" },
      { de: "Wie findest du den Park?", th: "คุณคิดว่าสวนสาธารณะแห่งนี้เป็นอย่างไร" },
    ],
    conjugations: [
      { subject: "ich", form: "finde", ending: "e" },
      { subject: "du", form: "findest", ending: "est" },
      { subject: "er / sie / es", form: "findet", ending: "et" },
      { subject: "wir", form: "finden", ending: "en" },
      { subject: "ihr", form: "findet", ending: "et" },
      { subject: "sie / Sie", form: "finden", ending: "en" },
    ],
  },
  "L13-V027": {
    infinitive: "besuchen",
    stem: "besuch",
    examples: [
      { de: "Wir besuchen das Museum.", th: "พวกเราไปเที่ยวพิพิธภัณฑ์" },
      { de: "Ich besuche meine Freundin in der Stadt.", th: "ฉันไปเยี่ยมเพื่อนผู้หญิงของฉันในเมือง" },
    ],
    conjugations: [
      { subject: "ich", form: "besuche", ending: "e" },
      { subject: "du", form: "besuchst", ending: "st" },
      { subject: "er / sie / es", form: "besucht", ending: "t" },
      { subject: "wir", form: "besuchen", ending: "en" },
      { subject: "ihr", form: "besucht", ending: "t" },
      { subject: "sie / Sie", form: "besuchen", ending: "en" },
    ],
  },
  "L13-V028": {
    infinitive: "kennen",
    stem: "kenn",
    examples: [
      { de: "Ich kenne die Stadt gut.", th: "ฉันรู้จักเมืองนี้ดี" },
      { de: "Kennst du den Markt?", th: "คุณรู้จักตลาดแห่งนี้ไหม" },
    ],
    conjugations: [
      { subject: "ich", form: "kenne", ending: "e" },
      { subject: "du", form: "kennst", ending: "st" },
      { subject: "er / sie / es", form: "kennt", ending: "t" },
      { subject: "wir", form: "kennen", ending: "en" },
      { subject: "ihr", form: "kennt", ending: "t" },
      { subject: "sie / Sie", form: "kennen", ending: "en" },
    ],
  },
  "L13-V029": {
    infinitive: "es gibt",
    stem: "gib",
    examples: [
      { de: "Es gibt einen Park in der Stadt.", th: "มีสวนสาธารณะแห่งหนึ่งในเมือง" },
      { de: "In der Altstadt gibt es viele Cafés.", th: "ในย่านเมืองเก่ามีคาเฟ่หลายแห่ง" },
    ],
    conjugations: [
      { subject: "es", form: "gibt", ending: "t" },
    ],
  },
  "L13-V030": {
    infinitive: "fehlen",
    stem: "fehl",
    examples: [
      { de: "Uns fehlt ein Stadtplan.", th: "พวกเราขาดแผนที่เมือง" },
      { de: "In der Stadt fehlen Spielplätze.", th: "เมืองนี้ขาดสนามเด็กเล่น" },
    ],
    conjugations: [
      { subject: "ich", form: "fehle", ending: "e" },
      { subject: "du", form: "fehlst", ending: "st" },
      { subject: "er / sie / es", form: "fehlt", ending: "t" },
      { subject: "wir", form: "fehlen", ending: "en" },
      { subject: "ihr", form: "fehlt", ending: "t" },
      { subject: "sie / Sie", form: "fehlen", ending: "en" },
    ],
  },
  "L13-V031": {
    infinitive: "lieben",
    stem: "lieb",
    examples: [
      { de: "Ich liebe diese Stadt.", th: "ฉันรักเมืองนี้" },
      { de: "Wir lieben den Park am See.", th: "พวกเราชอบสวนสาธารณะริมทะเลสาบมาก" },
    ],
    conjugations: [
      { subject: "ich", form: "liebe", ending: "e" },
      { subject: "du", form: "liebst", ending: "st" },
      { subject: "er / sie / es", form: "liebt", ending: "t" },
      { subject: "wir", form: "lieben", ending: "en" },
      { subject: "ihr", form: "liebt", ending: "t" },
      { subject: "sie / Sie", form: "lieben", ending: "en" },
    ],
  },
} satisfies Record<string, NonNullable<Item["verbContent"]>>;
