export const conjugationSubjects = [
  { id: "ich", label: "ich", sentence: "Ich", inner: "ich" },
  { id: "du", label: "du", sentence: "Du", inner: "du" },
  { id: "er", label: "er / sie / es", sentence: "Er", inner: "er" },
  { id: "wir", label: "wir", sentence: "Wir", inner: "wir" },
  { id: "ihr", label: "ihr", sentence: "Ihr", inner: "ihr" },
  { id: "sie", label: "sie / Sie", sentence: "Sie", inner: "Sie" },
] as const;

export type ConjugationSubject = (typeof conjugationSubjects)[number]["id"];
export type GrammarConjugationVerb = {
  id: string;
  infinitive: string;
  meaning: string;
  stem: string;
  forms: readonly [string, string, string, string, string, string];
  sentence: string;
  note: string;
};
export type GrammarConjugationTopic = {
  lessonId: string;
  topicSlug: string;
  verbs: readonly [GrammarConjugationVerb, ...GrammarConjugationVerb[]];
};

const topics: readonly GrammarConjugationTopic[] = [
  { lessonId: "L03", topicSlug: "sprechen", verbs: [
    { id: "sprechen", infinitive: "sprechen", meaning: "พูด", stem: "sprech", forms: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"], sentence: "{S} ___ Deutsch.", note: "du และ er/sie/es เปลี่ยน e เป็น i" },
  ] },
  { lessonId: "L05", topicSlug: "sehen", verbs: [
    { id: "sehen", infinitive: "sehen", meaning: "เห็น", stem: "seh", forms: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"], sentence: "{S} ___ das Bild.", note: "du และ er/sie/es เปลี่ยน e เป็น ie" },
  ] },
  { lessonId: "L07", topicSlug: "koennen", verbs: [
    { id: "koennen", infinitive: "können", meaning: "สามารถ", stem: "könn", forms: ["kann", "kannst", "kann", "können", "könnt", "können"], sentence: "{S} ___ gut tanzen.", note: "กริยาหลัก tanzen อยู่ท้ายประโยค" },
  ] },
  { lessonId: "L08", topicSlug: "wissen", verbs: [
    { id: "wissen", infinitive: "wissen", meaning: "รู้", stem: "wiss", forms: ["weiß", "weißt", "weiß", "wissen", "wisst", "wissen"], sentence: "{S} ___ das nicht.", note: "รูปเอกพจน์คือ weiß / weißt / weiß" },
  ] },
  { lessonId: "L09", topicSlug: "moegen", verbs: [
    { id: "moegen", infinitive: "mögen", meaning: "ชอบ", stem: "mög", forms: ["mag", "magst", "mag", "mögen", "mögt", "mögen"], sentence: "{S} ___ Pizza.", note: "รูปเอกพจน์เปลี่ยน ö เป็น a" },
  ] },
  { lessonId: "L09", topicSlug: "essen-kein", verbs: [
    { id: "essen", infinitive: "essen", meaning: "กิน", stem: "ess", forms: ["esse", "isst", "isst", "essen", "esst", "essen"], sentence: "{S} ___ Pizza.", note: "du และ er/sie/es ใช้ isst; การเลือก keinen ในหัวข้อก่อนหน้ายังคงเป็นเรื่อง Akkusativ" },
  ] },
  { lessonId: "L09", topicSlug: "moechte", verbs: [
    { id: "moechte", infinitive: "möchte", meaning: "อยากได้", stem: "möcht", forms: ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"], sentence: "{S} ___ eine Pizza.", note: "รูปสุภาพที่ใช้บอกความต้องการตามผู้พูด" },
  ] },
  { lessonId: "L10", topicSlug: "trennbare-verben", verbs: [
    { id: "ankommen", infinitive: "ankommen", meaning: "มาถึง", stem: "komm", forms: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], sentence: "{S} ___ um acht Uhr an.", note: "ผันส่วน kommen แล้วแยก an ไปท้ายประโยค" },
    { id: "einsteigen", infinitive: "einsteigen", meaning: "ขึ้นยานพาหนะ", stem: "steig", forms: ["steige", "steigst", "steigt", "steigen", "steigt", "steigen"], sentence: "{S} ___ in Berlin ein.", note: "ผันส่วน steigen แล้วแยก ein ไปท้ายประโยค" },
    { id: "abfahren", infinitive: "abfahren", meaning: "ออกเดินทาง", stem: "fahr", forms: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"], sentence: "{S} ___ um neun Uhr ab.", note: "du และ er/sie/es เปลี่ยน a เป็น ä; ab อยู่ท้ายประโยค" },
  ] },
  { lessonId: "L11", topicSlug: "perfekt-haben", verbs: [
    { id: "haben", infinitive: "haben", meaning: "กริยาช่วยใน Perfekt", stem: "hab", forms: ["habe", "hast", "hat", "haben", "habt", "haben"], sentence: "{S} ___ gestern Musik gehört.", note: "ผัน haben ตามประธาน ส่วน Partizip II อยู่ท้ายประโยค" },
  ] },
  { lessonId: "L12", topicSlug: "perfekt-sein", verbs: [
    { id: "sein", infinitive: "sein", meaning: "กริยาช่วยใน Perfekt", stem: "sei", forms: ["bin", "bist", "ist", "sind", "seid", "sind"], sentence: "{S} ___ nach Hamburg gefahren.", note: "การเดินทางด้วย fahren ใช้ sein ที่ผันแล้วเป็นกริยาช่วย" },
  ] },
  { lessonId: "L12", topicSlug: "war-hatte", verbs: [
    { id: "war", infinitive: "war (sein)", meaning: "เป็น / อยู่ ในอดีต", stem: "war", forms: ["war", "warst", "war", "waren", "wart", "waren"], sentence: "Gestern ___ {s} in Hamburg.", note: "รูปอดีตของ sein" },
    { id: "hatte", infinitive: "hatte (haben)", meaning: "มี ในอดีต", stem: "hatte", forms: ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"], sentence: "Gestern ___ {s} Zeit.", note: "รูปอดีตของ haben" },
  ] },
];

export function grammarConjugationTopic(lessonId: string, topicSlug: string): GrammarConjugationTopic | undefined {
  return topics.find((topic) => topic.lessonId === lessonId && topic.topicSlug === topicSlug);
}

export function conjugationSentence(pattern: string, subject: (typeof conjugationSubjects)[number]): string {
  return pattern.replace("{S}", subject.sentence).replace("{s}", subject.inner);
}
