// Keep the lesson 14–15 catalog and its additive SQL migration in sync.
// Run from the repository root: node scripts/build-a13-lesson-content.mjs
import { readFile, writeFile, access } from "node:fs/promises";

const document = "หนังสือเรียน บท13-15.pdf";
const source = (pdfPage) => [{ document, pdfPage, printedPage: pdfPage + 8 }];
const noun = (lessonId, number, group, article, word, meaning, image, pdfPage) => ({
  id: `${lessonId}-V${String(number).padStart(3, "0")}`,
  lessonId, skill: "vocabulary", collection: "core", group,
  title: `${article} ${word}`, answer: `${article} ${word}`,
  word, article, meaning, type: "noun", image,
  sourceScope: "core_book", sources: source(pdfPage),
});
const expression = (number, answer, meaning, pdfPage) => ({
  id: `L14-V${String(number).padStart(3, "0")}`,
  lessonId: "L14", skill: "vocabulary", collection: "extra",
  group: "Wegbeschreibung", title: answer, answer, word: answer,
  meaning, type: "expression", sourceScope: "core_book", sources: source(pdfPage),
});
const grammar = (lessonId, number, group, answer, meaning, pdfPage, notes) => ({
  id: `${lessonId}-G${String(number).padStart(3, "0")}`,
  lessonId, skill: "grammar", group, title: answer, answer, meaning,
  ...(notes ? { notes } : {}),
  sourceScope: "core_book", sources: [...source(pdfPage), ...source(17)],
});
const l13 = (name) => `/images/lektion-13-city/${name}-places.webp`;
const l04 = (id) => `/images/lektion-04-vocabulary/${id}-isolated-v2.jpg`;

const items = [
  noun("L14", 1, "Institutionen", "das", "Kaufhaus", "ห้างสรรพสินค้า", "kaufhaus", 6),
  noun("L14", 2, "Institutionen", "der", "Kindergarten", "โรงเรียนอนุบาล", "kindergarten", 6),
  noun("L14", 3, "Institutionen", "die", "Schule", "โรงเรียน", "schule", 6),
  noun("L14", 4, "Institutionen", "die", "Post", "ที่ทำการไปรษณีย์", "post", 6),
  noun("L14", 5, "Institutionen", "die", "Bank", "ธนาคาร", "bank", 6),
  noun("L14", 6, "Institutionen", "die", "Apotheke", "ร้านขายยา", "apotheke", 6),
  noun("L14", 7, "Institutionen", "die", "Polizei", "สถานีตำรวจ", "polizei", 6),
  noun("L14", 8, "Institutionen", "das", "Krankenhaus", "โรงพยาบาล", "krankenhaus", 6),
  noun("L14", 9, "Institutionen", "der", "Bahnhof", "สถานีรถไฟ", "bahnhof", 6),
  noun("L14", 10, "Plätze und Wege", "das", "Zentrum", "ใจกลางเมือง", "zentrum", 7),
  noun("L14", 11, "Plätze und Wege", "die", "Straße", "ถนน", l13("strasse"), 7),
  noun("L14", 12, "Plätze und Wege", "die", "Ampel", "สัญญาณไฟจราจร", "ampel", 7),
  noun("L14", 13, "Plätze und Wege", "die", "Brücke", "สะพาน", l13("bruecke-v2"), 7),
  noun("L14", 14, "Plätze und Wege", "der", "Platz", "ลานหรือจัตุรัส", "platz", 7),
  noun("L14", 15, "Plätze und Wege", "die", "Kreuzung", "สี่แยก", "kreuzung", 7),
  noun("L14", 16, "Plätze und Wege", "die", "Ecke", "หัวมุมถนน", "ecke", 7),
  expression(17, "die Stadtmitte", "ใจกลางเมือง · อีกคำหนึ่งของ das Zentrum", 7),
  expression(18, "der Hauptbahnhof", "สถานีรถไฟหลัก", 5),
  expression(19, "geradeaus", "ตรงไป", 5),
  expression(20, "nach rechts", "ไปทางขวา", 5),
  expression(21, "nach links", "ไปทางซ้าย", 5),
  expression(22, "rechts abbiegen", "เลี้ยวขวา", 5),
  expression(23, "links abbiegen", "เลี้ยวซ้าย", 8),
  expression(24, "über die Straße", "ข้ามถนน", 5),
  expression(25, "zu Fuß", "เดินเท้า", 8),
  expression(26, "nach 50 Metern", "หลังจาก 50 เมตร", 5),
  noun("L15", 1, "Wohnen und Zimmer", "das", "Haus", "บ้าน", "haus", 10),
  noun("L15", 2, "Wohnen und Zimmer", "die", "Wohnung", "อพาร์ตเมนต์หรือห้องชุด", l13("wohnung"), 10),
  noun("L15", 3, "Wohnen und Zimmer", "das", "Zimmer", "ห้อง", "zimmer", 10),
  noun("L15", 4, "Wohnen und Zimmer", "das", "Arbeitszimmer", "ห้องทำงาน", "arbeitszimmer", 10),
  noun("L15", 5, "Wohnen und Zimmer", "das", "Wohnzimmer", "ห้องนั่งเล่น", "wohnzimmer", 10),
  noun("L15", 6, "Wohnen und Zimmer", "das", "Schlafzimmer", "ห้องนอน", "schlafzimmer", 10),
  noun("L15", 7, "Wohnen und Zimmer", "das", "Kinderzimmer", "ห้องเด็ก", "kinderzimmer", 10),
  noun("L15", 8, "Wohnen und Zimmer", "das", "Bad", "ห้องน้ำ", "bad", 10),
  noun("L15", 9, "Teile der Wohnung", "die", "Küche", "ห้องครัว", "kueche", 11),
  noun("L15", 10, "Teile der Wohnung", "die", "Toilette", "ห้องสุขา", "toilette", 11),
  noun("L15", 11, "Teile der Wohnung", "der", "Flur", "โถงทางเดิน", "flur", 11),
  noun("L15", 12, "Teile der Wohnung", "der", "Balkon", "ระเบียง", "balkon", 11),
  noun("L15", 13, "Teile der Wohnung", "der", "Garten", "สวน", "garten", 11),
  noun("L15", 14, "Teile der Wohnung", "die", "Treppe", "บันได", "treppe", 11),
  noun("L15", 15, "Teile der Wohnung", "das", "Fenster", "หน้าต่าง", "fenster", 11),
  noun("L15", 16, "Teile der Wohnung", "die", "Tür", "ประตู", "tuer", 11),
  noun("L15", 17, "Möbel", "das", "Bett", "เตียง", l04("V045"), 15),
  noun("L15", 18, "Möbel", "die", "Lampe", "โคมไฟ", l04("V046"), 11),
  noun("L15", 19, "Möbel", "der", "Sessel", "เก้าอี้นวม", l04("V048"), 11),
  noun("L15", 20, "Möbel", "das", "Sofa", "โซฟา", l04("V050"), 10),
  noun("L15", 21, "Möbel", "der", "Tisch", "โต๊ะ", l04("V051"), 15),
  noun("L15", 22, "Möbel", "der", "Schrank", "ตู้", l04("V052"), 15),
  noun("L15", 23, "Möbel", "der", "Teppich", "พรมปูพื้น", "/images/lektion-04-vocabulary/V053-isolated-v3.jpg", 11),
  noun("L15", 24, "Möbel", "der", "Stuhl", "เก้าอี้", l04("V044"), 15),
  ...[
    ["in", "ใน"], ["auf", "บน"], ["über", "เหนือ"], ["unter", "ใต้"],
    ["an", "ชิดหรือที่"], ["vor", "ด้านหน้า"], ["hinter", "ด้านหลัง"],
    ["neben", "ข้าง"], ["zwischen", "ระหว่าง"],
  ].map(([answer, meaning], index) => grammar("L14", index + 1, "Lokale Präpositionen", answer, meaning, 6)),
  grammar("L14", 10, "Wo? + Dativ", "vor dem Baum", "อยู่หน้าต้นไม้ · der → dem", 7),
  grammar("L14", 11, "Wo? + Dativ", "neben einem Kaufhaus", "อยู่ข้างห้างแห่งหนึ่ง · ein → einem", 7),
  grammar("L14", 12, "Wo? + Dativ", "an der Ampel", "อยู่ที่สัญญาณไฟ · die → der", 7),
  grammar("L14", 13, "Wo? + Dativ", "zwischen den Bäumen", "อยู่ระหว่างต้นไม้ · พหูพจน์ die → den และเติม -n", 7),
  grammar("L14", 14, "Wo? + Dativ", "im", "รูปย่อของ in dem", 7),
  grammar("L14", 15, "Wo? + Dativ", "am", "รูปย่อของ an dem", 7),
  ...[
    ["ihr Sessel", "เก้าอี้นวมของเธอ · Nominativ ชาย"],
    ["ihr Zimmer", "ห้องของเธอ · Nominativ กลาง"],
    ["ihre Lampe", "โคมไฟของเธอ · Nominativ หญิง"],
    ["ihre Lampen", "โคมไฟหลายดวงของเธอ · Nominativ พหูพจน์"],
    ["ihren Teppich", "พรมของเธอ · Akkusativ ชาย"],
    ["sein Sessel", "เก้าอี้นวมของเขา · Nominativ ชาย"],
    ["sein Zimmer", "ห้องของเขา · Nominativ กลาง"],
    ["seine Lampe", "โคมไฟของเขา · Nominativ หญิง"],
    ["seine Lampen", "โคมไฟหลายดวงของเขา · Nominativ พหูพจน์"],
    ["seinen Teppich", "พรมของเขา · Akkusativ ชาย"],
  ].map(([answer, meaning], index) => grammar("L15", index + 1, "Possessivartikel", answer, meaning, 11)),
];

const ids = new Set();
for (const item of items) {
  if (ids.has(item.id)) throw new Error(`Duplicate content ID: ${item.id}`);
  ids.add(item.id);
  if (item.image) {
    const imagePath = item.image.startsWith("/images/")
      ? `public${item.image}`
      : `public/images/lektion-${item.lessonId.slice(1)}-vocabulary/${item.image}.png`;
    await access(imagePath);
  }
}
const seedPath = "supabase/seed/catalog.json";
const catalog = JSON.parse(await readFile(seedPath, "utf8"));
const l13Grammar = catalog.items
  .filter((item) => item.lessonId === "L13" && item.skill === "grammar" && /^L13-G\d{3}$/u.test(item.id))
  .map((item) => ({ ...item, sourceScope: "core_book", sources: source(17) }));
const oldIds = new Set(catalog.items.map((item) => item.id));
const generatedById = new Map([...l13Grammar, ...items].map((item) => [item.id, item]));
catalog.items = catalog.items.map((item) => generatedById.get(item.id) ?? item);
catalog.items.push(...items.filter((item) => !oldIds.has(item.id)));
await writeFile(seedPath, JSON.stringify(catalog, null, 2) + "\n");

const quote = (value) => `'${value.replaceAll("'", "''")}'`;
const rows = [...l13Grammar, ...items].map((item, index) =>
  `(${quote(item.id)},${quote(item.lessonId)},${quote(item.skill)},${500 + index},'published',${quote(JSON.stringify(item))}::jsonb)`
);
const allowedKeys = [
  "deutsch-trainer-alphabet-learning-v1-L01",
  "deutsch-trainer-vocabulary-image-learning-v1-L01",
  "deutsch-trainer-verb-learning-L01",
  "deutsch-trainer-guided-learning-L02-vocabulary",
  "deutsch-trainer-guided-learning-L02-grammar",
  ...Array.from({ length: 13 }, (_, index) => `deutsch-trainer-vocabulary-image-learning-v1-L${String(index + 3).padStart(2, "0")}`),
  "deutsch-trainer-guided-learning-L13-grammar",
  "deutsch-trainer-family-plural-learning-v1-L03",
  "deutsch-trainer-guided-learning-L14-vocabulary",
  "deutsch-trainer-guided-learning-L14-grammar",
  "deutsch-trainer-guided-learning-L15-grammar",
];
const contentSql = `begin;

insert into public.content_items(id,lesson_id,skill,position,status,data) values
${rows.join(",\n")}
on conflict (id) do update set status = excluded.status, data = excluded.data;

commit;
`;
const stateSql = `begin;

alter table public.learner_lesson_states drop constraint if exists learner_lesson_states_lesson_key_check;
alter table public.learner_lesson_states add constraint learner_lesson_states_lesson_key_check check (lesson_key in (
 ${allowedKeys.map(quote).join(",\n ")}
));

commit;
`;
await writeFile("supabase/migrations/20261012040000_a13_l14_l15_content.sql", contentSql);
await writeFile("supabase/migrations/20261012050000_a13_l14_l15_states.sql", stateSql);
console.log(`Prepared ${items.length} L14–L15 items, ${l13Grammar.length} L13 source updates, and additive SQL migrations.`);
