import { l13VocabularyImageEntries } from "./vocabulary-image-content";

type Choice = { id: string; label: string };
export type ArticleAssessment = { targetId: string; subskill: "vocabulary_article"; taskVersion: 1; difficulty: 2; assistance: "image-and-noun-no-article" };
type Base = { id: string; difficulty: 1 | 2 | 3; requiredItemIds: string[]; added: boolean };
type ChoiceFields = { prompt: string; answer: string; options: Choice[]; explanation: string; translation: string };
export type VocabularyChallengeActivity = Base & (
  | (ChoiceFields & { kind: "picture"; image: string })
  | (ChoiceFields & { kind: "pictureArticle"; image: string; noun: string; assessment: ArticleAssessment })
  | (ChoiceFields & { kind: "odd" | "riddle" | "category" })
  | { kind: "build"; prompt: string; answer: string; parts: string[]; explanation: string }
  | { kind: "crossword"; title: string; solution: string; solutionMeaning: string; rows: { id: string; clue: string; translation: string; answer: string; keyIndex: number }[] }
  | { kind: "story"; title: string; image: string; translation: string; wordBank: Choice[]; gaps: { id: string; before: string; after: string; answer: string; explanation: string }[] }
);

const words = {
  stadt: ["L13-V001", "Stadt", "เมือง", "stadt"],
  altstadt: ["L13-V002", "Altstadt", "ย่านเมืองเก่า", "altstadt"],
  park: ["L13-V003", "Park", "สวนสาธารณะ", "park"],
  kirche: ["L13-V004", "Kirche", "โบสถ์", "kirche"],
  schloss: ["L13-V005", "Schloss", "ปราสาท", "schloss"],
  brunnen: ["L13-V006", "Brunnen", "น้ำพุ", "brunnen"],
  rathaus: ["L13-V007", "Rathaus", "ศาลาว่าการเมือง", "rathaus"],
  geschaeft: ["L13-V008", "Geschäft", "ร้านค้า", "geschaeft"],
  laden: ["L13-V009", "Laden", "ร้านค้า", "laden"],
  markt: ["L13-V010", "Markt", "ตลาด", "markt"],
  zoo: ["L13-V011", "Zoo", "สวนสัตว์", "zoo"],
  tierpark: ["L13-V012", "Tierpark", "สวนสัตว์", "tierpark"],
  spielplatz: ["L13-V013", "Spielplatz", "สนามเด็กเล่น", "spielplatz"],
  hafen: ["L13-V014", "Hafen", "ท่าเรือ", "hafen"],
  see: ["L13-V015", "See", "ทะเลสาบ", "see"],
  mauer: ["L13-V016", "Mauer", "กำแพง", "mauer"],
  strasse: ["L13-V017", "Straße", "ถนน", "strasse"],
  cafe: ["L13-V018", "Café", "คาเฟ่", "cafe"],
  museum: ["L13-V019", "Museum", "พิพิธภัณฑ์", "museum"],
  kino: ["L13-V020", "Kino", "โรงภาพยนตร์", "kino"],
  wohnung: ["L13-V021", "Wohnung", "ที่พักหรืออพาร์ตเมนต์", "wohnung"],
  lieblingsort: ["L13-V044", "Lieblingsort", "สถานที่โปรด", null],
  lieblingsviertel: ["L13-V045", "Lieblingsviertel", "ย่านโปรด", null],
  fluss: ["L13-V047", "Fluss", "แม่น้ำ", "fluss-v2"],
  bruecke: ["L13-V048", "Brücke", "สะพาน", "bruecke-v2"],
  galerie: ["L13-V049", "Galerie", "แกลเลอรี", "galerie-v2"],
  fussballplatz: ["L13-V055", "Fußballplatz", "สนามฟุตบอล", "fussballplatz-v2"],
  strassenfest: ["L13-V056", "Straßenfest", "เทศกาลบนถนน", null],
} as const;
type Word = keyof typeof words;
const option = (key: Word): Choice => ({ id: words[key][0], label: words[key][1] });
const ids = (keys: Word[]) => keys.map(key => words[key][0]);
const image = (key: Word) => `/images/lektion-13-city/${words[key][3]}-places.webp`;
function choices(keys: Word[], answer: Word, offset: number): Choice[] {
  const alternatives = keys.filter(key => key !== answer);
  alternatives.splice(offset % keys.length, 0, answer);
  return alternatives.map(option);
}
function choice({ id, kind, prompt, answer, keys, explanation, translation = "", added = true, offset = 0 }: {
  id: string; kind: "odd" | "riddle"; prompt: string; answer: Word; keys: Word[]; explanation: string; translation?: string; added?: boolean; offset?: number;
}): VocabularyChallengeActivity {
  return { id, kind, prompt, answer: words[answer][0], options: choices(keys, answer, offset), requiredItemIds: ids(keys), explanation, translation, added, difficulty: 2 };
}
function picture(key: Word, keys: Word[], added = true, offset = 0): VocabularyChallengeActivity {
  return { id: `picture-${key}`, kind: "picture", prompt: "สถานที่ในภาพคืออะไร?", answer: words[key][0], options: choices(keys, key, offset), requiredItemIds: ids(keys), explanation: `${words[key][1]} หมายถึง${words[key][2]}`, translation: "", image: image(key), added, difficulty: 1 };
}
function story({ id, title, scene, rows, translation, added = true }: {
  id: string; title: string; scene: Word; rows: [string, string, Word, string][]; translation: string; added?: boolean;
}): VocabularyChallengeActivity {
  const keys = rows.map(row => row[2]);
  return { id, kind: "story", title, image: image(scene), translation, added, difficulty: 3, requiredItemIds: ids(keys),
    wordBank: [...keys.slice(1), ...keys.slice(0, 1)].reverse().map(option),
    gaps: rows.map(([slotId, before, key, explanation]) => ({ id: slotId, before, after: ".", answer: words[key][0], explanation })),
  };
}

const original: VocabularyChallengeActivity[] = [
  story({ id: "story-day", title: "Ein Tag in der Stadt", scene: "stadt", added: false,
    rows: [
      ["story-market", "Am Samstag sind wir in der Stadt. Zuerst kaufen wir Obst auf dem ", "markt", "ซื้อผลไม้ที่ตลาด: auf dem Markt"],
      ["story-museum", "Danach sehen wir alte Bilder im ", "museum", "ดูภาพเก่าในพิพิธภัณฑ์: im Museum"],
      ["story-playground", "Am Nachmittag spielen die Kinder auf dem ", "spielplatz", "เด็กเล่นที่สนามเด็กเล่น: auf dem Spielplatz"],
      ["story-cafe", "Zum Schluss trinken wir Kaffee im ", "cafe", "ดื่มกาแฟที่คาเฟ่: im Café"],
    ], translation: "วันเสาร์พวกเราอยู่ในเมือง เริ่มจากซื้อผลไม้ที่ตลาด จากนั้นไปดูภาพเก่าในพิพิธภัณฑ์ ตอนบ่ายเด็ก ๆ เล่นที่สนามเด็กเล่น สุดท้ายพวกเราดื่มกาแฟที่คาเฟ่" }),
  choice({ id: "odd-nature", kind: "odd", prompt: "เลือกคำที่ไม่ใช่พื้นที่ธรรมชาติหรือพื้นที่สีเขียว", answer: "kino", keys: ["park", "see", "fluss", "kino"], explanation: "Park, See และ Fluss เป็นพื้นที่ธรรมชาติหรือพื้นที่สีเขียว ส่วน Kino เป็นโรงภาพยนตร์", added: false }),
  choice({ id: "odd-culture", kind: "odd", prompt: "เลือกคำที่ไม่ใช่สถานที่ชมภาพยนตร์หรือศิลปะ", answer: "spielplatz", keys: ["kino", "museum", "galerie", "spielplatz"], explanation: "สามคำแรกเกี่ยวกับการชมภาพยนตร์หรือศิลปะ ส่วน Spielplatz เป็นสนามเด็กเล่น", added: false }),
  choice({ id: "odd-shopping", kind: "odd", prompt: "เลือกคำที่ไม่ใช่สถานที่ซื้อของ", answer: "kirche", keys: ["geschaeft", "laden", "markt", "kirche"], explanation: "Geschäft, Laden และ Markt เป็นสถานที่ซื้อของ ส่วน Kirche คือโบสถ์", added: false }),
  ...(["rathaus", "hafen", "brunnen", "schloss"] satisfies Word[]).map((key, index) => picture(key, ["rathaus", "hafen", "brunnen", "schloss"], false, index)),
  choice({ id: "riddle-kino", kind: "riddle", prompt: "Hier sehen wir einen Film.", answer: "kino", keys: ["kino", "spielplatz", "wohnung", "rathaus"], explanation: "สถานที่ดูภาพยนตร์คือ Kino", translation: "พวกเราดูภาพยนตร์ที่นี่", added: false }),
  choice({ id: "riddle-playground", kind: "riddle", prompt: "Hier spielen Kinder auf Schaukeln.", answer: "spielplatz", keys: ["kino", "spielplatz", "wohnung", "rathaus"], explanation: "สถานที่ที่เด็กเล่นชิงช้าคือ Spielplatz", translation: "เด็ก ๆ เล่นชิงช้าที่นี่", added: false }),
  choice({ id: "riddle-apartment", kind: "riddle", prompt: "Hier wohnt meine Familie.", answer: "wohnung", keys: ["kino", "spielplatz", "wohnung", "rathaus"], explanation: "ที่พักอาศัยของครอบครัวคือ Wohnung", translation: "ครอบครัวของฉันอาศัยอยู่ที่นี่", added: false }),
  choice({ id: "riddle-rathaus", kind: "riddle", prompt: "Hier arbeitet die Stadtverwaltung.", answer: "rathaus", keys: ["kino", "spielplatz", "wohnung", "rathaus"], explanation: "ที่ทำงานของเทศบาลคือ Rathaus", translation: "ฝ่ายบริหารเมืองทำงานที่นี่", added: false }),
];

const newPictures: VocabularyChallengeActivity[] = (
  [
    ["kirche", ["kirche", "rathaus", "schloss", "museum"]],
    ["museum", ["museum", "kino", "geschaeft", "cafe"]],
    ["spielplatz", ["spielplatz", "fussballplatz", "park", "zoo"]],
    ["see", ["see", "fluss", "hafen", "brunnen"]],
    ["bruecke", ["bruecke", "strasse", "mauer", "hafen"]],
    ["markt", ["markt", "geschaeft", "cafe", "museum"]],
    ["kino", ["kino", "museum", "cafe", "galerie"]],
    ["wohnung", ["wohnung", "schloss", "rathaus", "geschaeft"]],
    ["fluss", ["fluss", "see", "brunnen", "hafen"]],
    ["fussballplatz", ["fussballplatz", "spielplatz", "park", "tierpark"]],
  ] satisfies [Word, Word[]][]
).map(([key, keys], index) => picture(key, keys, true, index));

const newOdd: VocabularyChallengeActivity[] = (
  [
    ["water", "เลือกคำที่ไม่ใช่แหล่งน้ำ", "bruecke", ["see", "fluss", "brunnen", "bruecke"], "See คือทะเลสาบ Fluss คือแม่น้ำ Brunnen คือน้ำพุ ส่วน Brücke คือสะพานที่ใช้ข้าม"],
    ["outdoor", "เลือกคำที่ไม่ใช่พื้นที่กลางแจ้งสำหรับเล่นหรือออกกำลัง", "museum", ["spielplatz", "fussballplatz", "park", "museum"], "สามคำแรกเป็นพื้นที่เล่นหรือออกกำลังกลางแจ้ง ส่วน Museum คือพิพิธภัณฑ์"],
    ["structures", "เลือกคำที่ไม่ใช่สิ่งปลูกสร้าง", "see", ["bruecke", "mauer", "rathaus", "see"], "Brücke, Mauer และ Rathaus เป็นสิ่งปลูกสร้าง ส่วน See เป็นแหล่งน้ำ"],
    ["buy", "เลือกคำที่ไม่ใช่สถานที่ขายสินค้า", "schloss", ["geschaeft", "laden", "markt", "schloss"], "Geschäft, Laden และ Markt ใช้ซื้อสินค้า ส่วน Schloss คือปราสาท"],
    ["culture", "เลือกคำที่ไม่ใช่สถานที่ชมงานศิลปะหรือภาพยนตร์", "hafen", ["museum", "galerie", "kino", "hafen"], "Museum, Galerie และ Kino เกี่ยวกับการชมงาน ส่วน Hafen ใช้จอดเรือ"],
    ["transport", "เลือกคำที่ไม่เกี่ยวกับเส้นทางสัญจรหรือการเดินทาง", "wohnung", ["strasse", "bruecke", "hafen", "wohnung"], "Straße เป็นถนน Brücke เป็นสะพาน Hafen เป็นท่าเรือ ส่วน Wohnung เป็นที่อยู่อาศัย"],
    ["animals", "เลือกคำที่ไม่ใช่สวนสัตว์หรือพื้นที่สีเขียว", "rathaus", ["zoo", "tierpark", "park", "rathaus"], "Zoo และ Tierpark เป็นสวนสัตว์ Park เป็นสวนสาธารณะ ส่วน Rathaus เป็นศาลาว่าการเมือง"],
    ["public", "เลือกคำที่เป็นที่พักอาศัยส่วนตัว", "wohnung", ["museum", "rathaus", "kirche", "wohnung"], "Wohnung เป็นที่พักอาศัย ส่วนอีกสามคำเป็นสถานที่ที่ใช้ร่วมกัน"],
    ["places", "เลือกคำที่เป็นกิจกรรมหรืองานเทศกาล แทนที่จะเป็นสถานที่", "strassenfest", ["markt", "park", "kino", "strassenfest"], "Straßenfest คืองานเทศกาลบนถนน ส่วน Markt, Park และ Kino เป็นสถานที่"],
    ["land", "เลือกคำที่ไม่ใช่สถานที่บนบก", "fluss", ["spielplatz", "markt", "fussballplatz", "fluss"], "สามคำแรกเป็นสถานที่บนบก ส่วน Fluss คือแม่น้ำ"],
  ] satisfies [string, string, Word, Word[], string][]
).map(([id, prompt, answer, keys, explanation], index) => choice({ id: `odd-added-${id}`, kind: "odd", prompt, answer, keys, explanation, offset: index }));

const newRiddles: VocabularyChallengeActivity[] = (
  [
    ["altstadt", "Hier stehen viele alte Häuser. Das ist der historische Teil der Stadt.", ["altstadt", "park", "hafen", "fussballplatz"], "ที่นี่มีบ้านเก่าหลายหลัง เป็นส่วนเก่าแก่ของเมือง", "ส่วนเก่าแก่ของเมืองเรียกว่า Altstadt"],
    ["kirche", "Menschen kommen hierher, um zu beten. Oft gibt es einen Turm mit Glocken.", ["kirche", "rathaus", "museum", "kino"], "ผู้คนมาสวดมนต์ที่นี่ และมักมีหอระฆัง", "สถานที่สวดมนต์ที่มีหอระฆังคือ Kirche"],
    ["schloss", "Früher wohnte hier eine Königsfamilie. Das Gebäude ist groß und prächtig.", ["schloss", "wohnung", "geschaeft", "cafe"], "เมื่อก่อนราชวงศ์อาศัยอยู่ที่นี่ อาคารใหญ่และโอ่อ่า", "ที่ประทับของราชวงศ์ในบริบทนี้คือ Schloss"],
    ["brunnen", "Mitten auf dem Platz spritzt Wasser nach oben.", ["brunnen", "fluss", "see", "hafen"], "ตรงกลางลานมีน้ำพุ่งขึ้นด้านบน", "น้ำที่พุ่งขึ้นกลางลานเป็นลักษณะของ Brunnen"],
    ["bruecke", "Wir gehen darüber und kommen auf die andere Seite des Flusses.", ["bruecke", "mauer", "park", "schloss"], "พวกเราเดินข้ามสิ่งนี้แล้วไปถึงอีกฝั่งของแม่น้ำ", "สิ่งที่ใช้ข้ามแม่น้ำคือ Brücke"],
    ["fluss", "Das Wasser fließt durch die Stadt. An beiden Seiten gibt es Ufer.", ["fluss", "see", "brunnen", "markt"], "น้ำไหลผ่านเมืองและมีตลิ่งทั้งสองข้าง", "แหล่งน้ำที่ไหลผ่านเมืองคือ Fluss"],
    ["see", "Dieses große Gewässer liegt im Park. Es hat keine Strömung wie ein Fluss.", ["see", "fluss", "strasse", "kirche"], "แหล่งน้ำขนาดใหญ่นี้อยู่ในสวนและไม่มีกระแสไหลแบบแม่น้ำ", "แหล่งน้ำนิ่งตามคำบรรยายคือ See"],
    ["galerie", "Hier stellt eine Künstlerin ihre neuen Bilder aus und verkauft sie.", ["galerie", "kino", "markt", "spielplatz"], "ศิลปินนำภาพใหม่มาจัดแสดงและขายที่นี่", "สถานที่จัดแสดงและขายภาพศิลปะในบริบทนี้คือ Galerie"],
    ["cafe", "Wir bestellen zwei Tassen Kaffee und ein Stück Kuchen.", ["cafe", "museum", "kino", "rathaus"], "พวกเราสั่งกาแฟสองถ้วยและเค้กหนึ่งชิ้น", "สถานที่สั่งกาแฟและเค้กในตัวเลือกนี้คือ Café"],
    ["fussballplatz", "Hier trainiert unsere Mannschaft. An beiden Enden steht ein Tor.", ["fussballplatz", "spielplatz", "zoo", "brunnen"], "ทีมของพวกเราฝึกซ้อมที่นี่ มีประตูฟุตบอลอยู่ทั้งสองด้าน", "สนามที่มีประตูฟุตบอลคือ Fußballplatz"],
  ] satisfies [Word, string, Word[], string, string][]
).map(([answer, prompt, keys, translation, explanation], index) => choice({ id: `riddle-added-${answer}`, kind: "riddle", prompt, answer, keys, translation, explanation, offset: index }));

const newBuild: VocabularyChallengeActivity[] = (
  [
    ["altstadt", ["stadt", "Alt"], "Alt หมายถึงเก่า ส่วน Stadt คือเมือง รวมเป็น Altstadt หรือย่านเมืองเก่า"],
    ["spielplatz", ["platz", "Spiel"], "Spiel เกี่ยวกับการเล่น ส่วน Platz คือพื้นที่ รวมเป็น Spielplatz หรือสนามเด็กเล่น"],
    ["rathaus", ["haus", "Rat"], "Rat + haus รวมเป็น Rathaus หรือศาลาว่าการเมือง"],
    ["tierpark", ["park", "Tier"], "Tier คือสัตว์ ส่วน Park คือสวน รวมเป็น Tierpark หรือสวนสัตว์"],
    ["fussballplatz", ["platz", "Fuß", "ball"], "Fuß + ball + platz รวมเป็น Fußballplatz หรือสนามฟุตบอล"],
    ["lieblingsort", ["ort", "Lieblings"], "Lieblings- บอกว่าเป็นสิ่งโปรด รวมกับ Ort เป็น Lieblingsort หรือสถานที่โปรด"],
    ["lieblingsviertel", ["viertel", "Lieblings"], "Lieblings- รวมกับ Viertel เป็น Lieblingsviertel หรือย่านโปรด"],
    ["strassenfest", ["fest", "Straßen"], "Straßen- เกี่ยวกับถนน รวมกับ Fest เป็น Straßenfest หรืองานเทศกาลบนถนน"],
    ["geschaeft", ["schäft", "Ge"], "ส่วนตัวอักษร Ge + schäft สะกดรวมเป็น Geschäft หรือร้านค้า"],
    ["brunnen", ["nen", "Brun"], "ส่วนตัวอักษร Brun + nen สะกดรวมเป็น Brunnen หรือน้ำพุ"],
  ] satisfies [Word, string[], string][]
).map(([key, parts, explanation]) => ({ id: `build-${key}`, kind: "build", prompt: words[key][2], answer: words[key][1], parts, explanation, requiredItemIds: ids([key]), difficulty: 3, added: true }));

const categoryChoices = [
  { id: "nature", label: "พื้นที่ธรรมชาติ" }, { id: "culture", label: "สถานที่ชมศิลปะหรือภาพยนตร์" },
  { id: "shopping", label: "สถานที่ซื้อสินค้า" }, { id: "play", label: "พื้นที่เล่นหรือเล่นกีฬา" },
];
const newCategories: VocabularyChallengeActivity[] = (
  [["fluss", "nature"], ["galerie", "culture"], ["laden", "shopping"], ["fussballplatz", "play"], ["see", "nature"]] satisfies [Word, string][]
).map(([key, answer]) => ({ id: `category-${key}`, kind: "category", prompt: words[key][1], answer, options: categoryChoices, requiredItemIds: ids([key]), explanation: `${words[key][1]} คือ${words[key][2]} จึงอยู่ในหมวด${categoryChoices.find(category => category.id === answer)?.label}`, translation: "", difficulty: 1, added: true }));

const newStories: VocabularyChallengeActivity[] = [
  story({ id: "story-water", title: "Ein Spaziergang am Wasser", scene: "fluss", rows: [
    ["water-river", "Heute machen wir einen Spaziergang. Zuerst folgen wir dem Wasser, das durch die Stadt fließt. Das ist der ", "fluss", "น้ำที่ไหลผ่านเมืองคือ Fluss หรือแม่น้ำ"],
    ["water-bridge", "Wir wollen auf die andere Seite. Deshalb gehen wir über die ", "bruecke", "ใช้ Brücke หรือสะพานเพื่อข้ามไปอีกฝั่ง"],
    ["water-lake", "Später kommen wir in einen Park. Dort gibt es ein großes Gewässer ohne Strömung: einen ", "see", "แหล่งน้ำนิ่งขนาดใหญ่คือ See หรือทะเลสาบ"],
  ], translation: "วันนี้พวกเราเดินเล่น เริ่มจากเดินตามแม่น้ำที่ไหลผ่านเมือง เมื่อต้องการไปอีกฝั่งจึงข้ามสะพาน ต่อมาพวกเราไปถึงสวนที่มีทะเลสาบขนาดใหญ่" }),
  story({ id: "story-culture", title: "Ein Tag voller Kultur", scene: "museum", rows: [
    ["culture-museum", "Heute lernen wir etwas über die Geschichte der Stadt. Alte Werkzeuge und historische Gegenstände sehen wir im ", "museum", "ดูสิ่งของโบราณและเรียนรู้ประวัติศาสตร์ที่ Museum"],
    ["culture-gallery", "Danach besuchen wir eine Künstlerin. Ihre neuen Bilder stellt sie aus und verkauft sie in ihrer ", "galerie", "ศิลปินจัดแสดงและขายภาพใน Galerie"],
    ["culture-cinema", "Am Abend möchten wir einen neuen Film sehen. Wir gehen ins ", "kino", "ชมภาพยนตร์ที่ Kino"],
    ["culture-cafe", "Vor dem Film trinken wir noch Kaffee und essen Kuchen im ", "cafe", "ดื่มกาแฟและกินเค้กที่ Café"],
  ], translation: "วันนี้พวกเราเรียนรู้ประวัติศาสตร์เมืองจากสิ่งของเก่าในพิพิธภัณฑ์ จากนั้นไปชมภาพที่ศิลปินจัดแสดงและขายในแกลเลอรี ตอนเย็นจะไปดูภาพยนตร์ ก่อนหนังเริ่มจึงแวะดื่มกาแฟและกินเค้กที่คาเฟ่" }),
  story({ id: "story-family", title: "Ein Sonntag mit den Kindern", scene: "park", rows: [
    ["family-park", "Am Sonntag gehen wir zuerst ins Grüne. Zwischen Bäumen und Blumen spazieren wir durch den ", "park", "สวนที่มีต้นไม้ ดอกไม้ และทางเดินคือ Park"],
    ["family-playground", "Die Kinder entdecken Schaukeln und eine Rutsche. Sie laufen sofort zum ", "spielplatz", "ชิงช้าและกระดานลื่นอยู่ที่ Spielplatz"],
    ["family-zoo", "Danach möchten sie Giraffen und Elefanten sehen. Wir besuchen den ", "zoo", "สถานที่ชมยีราฟและช้างคือ Zoo"],
    ["family-football", "Später treffen wir die Fußballmannschaft. Sie trainiert zwischen zwei Toren auf dem ", "fussballplatz", "ทีมฟุตบอลฝึกซ้อมที่ Fußballplatz"],
  ], translation: "วันอาทิตย์พวกเราเดินชมต้นไม้และดอกไม้ในสวน เด็ก ๆ เห็นชิงช้ากับกระดานลื่นจึงวิ่งไปสนามเด็กเล่น จากนั้นไปสวนสัตว์เพื่อดูยีราฟและช้าง ต่อมาพบทีมฟุตบอลกำลังฝึกซ้อมอยู่ในสนาม" }),
  story({ id: "story-old-town", title: "Ein Besuch im historischen Viertel", scene: "altstadt", rows: [
    ["old-town", "Heute besuchen wir den ältesten Teil der Stadt mit vielen alten Häusern. Wir sind in der ", "altstadt", "ย่านเก่าแก่ของเมืองคือ Altstadt"],
    ["old-church", "Wir hören Glocken. Zum Beten gehen die Menschen hier in die ", "kirche", "ผู้คนไปสวดมนต์ใน Kirche"],
    ["old-castle", "Auf einem Hügel sehen wir ein großes Gebäude. Früher wohnte dort eine Königsfamilie. Es ist ein ", "schloss", "ที่ประทับของราชวงศ์คือ Schloss"],
    ["old-fountain", "Auf dem Platz machen wir eine Pause. In der Mitte spritzt Wasser aus einem ", "brunnen", "น้ำพุที่อยู่กลางลานเรียกว่า Brunnen"],
  ], translation: "วันนี้พวกเราไปย่านเก่าแก่ของเมืองที่มีบ้านเก่าหลายหลัง ได้ยินเสียงระฆังจากโบสถ์ที่ผู้คนมาสวดมนต์ บนเนินเขามีปราสาทซึ่งเคยเป็นที่ประทับของราชวงศ์ แล้วแวะพักที่ลานซึ่งมีน้ำพุอยู่ตรงกลาง" }),
  story({ id: "story-shopping", title: "Einkaufen für das Wochenende", scene: "markt", rows: [
    ["shopping-market", "Am Samstag stehen viele Stände auf dem Platz. Dort kaufen wir frisches Obst auf dem ", "markt", "แผงขายของหลายแผงบนลานบอกว่าเป็น Markt"],
    ["shopping-store", "Danach brauchen wir eine neue Jacke. Wir gehen in ein ", "geschaeft", "ซื้อเสื้อแจ็กเก็ตใน Geschäft หรือร้านค้า"],
    ["shopping-home", "Nach dem Einkaufen gehen wir nach Hause. Unsere Familie wohnt im zweiten Stock in einer ", "wohnung", "ที่พักอาศัยของครอบครัวในอาคารคือ Wohnung"],
  ], translation: "วันเสาร์มีแผงขายของหลายแผงที่ลาน พวกเราซื้อผลไม้สดที่ตลาด จากนั้นไปร้านค้าเพื่อซื้อแจ็กเก็ต แล้วกลับบ้านซึ่งเป็นอพาร์ตเมนต์อยู่บนชั้นสอง" }),
];

const crossword: VocabularyChallengeActivity = {
  id: "crossword-city-places", kind: "crossword", title: "Orte in der Stadt", difficulty: 3, added: true,
  requiredItemIds: ids(["markt", "spielplatz", "brunnen", "schloss", "rathaus", "see", "kirche"]),
  solution: "KIRCHE", solutionMeaning: "โบสถ์",
  rows: [
    { id: "crossword-city-market", clue: "Hier kaufen wir Obst und Gemüse an vielen Ständen.", translation: "พวกเราซื้อผลไม้และผักจากแผงขายของหลายแผงที่นี่", answer: "MARKT", keyIndex: 3 },
    { id: "crossword-city-playground", clue: "Hier spielen Kinder auf Schaukeln und einer Rutsche.", translation: "เด็ก ๆ เล่นชิงช้าและกระดานลื่นที่นี่", answer: "SPIELPLATZ", keyIndex: 2 },
    { id: "crossword-city-fountain", clue: "Auf dem Platz spritzt hier Wasser nach oben.", translation: "ตรงนี้มีน้ำพุ่งขึ้นด้านบนอยู่กลางลาน", answer: "BRUNNEN", keyIndex: 1 },
    { id: "crossword-city-castle", clue: "In diesem großen Gebäude wohnte früher eine Königsfamilie.", translation: "เมื่อก่อนราชวงศ์อาศัยอยู่ในอาคารใหญ่แห่งนี้", answer: "SCHLOSS", keyIndex: 1 },
    { id: "crossword-city-townhall", clue: "Hier arbeitet die Stadtverwaltung.", translation: "ฝ่ายบริหารเมืองทำงานที่นี่", answer: "RATHAUS", keyIndex: 3 },
    { id: "crossword-city-lake", clue: "Dieses große Gewässer im Park hat keine Strömung wie ein Fluss.", translation: "แหล่งน้ำใหญ่ในสวนแห่งนี้ไม่มีกระแสไหลแบบแม่น้ำ", answer: "SEE", keyIndex: 1 },
  ],
};

const pictureArticles: VocabularyChallengeActivity[] = l13VocabularyImageEntries.map(entry => {
  const article = /^(der|die|das)\s/u.exec(entry.german)?.[1];
  if (article !== "der" && article !== "die" && article !== "das") throw new Error(`Missing singular Artikel for ${entry.id}`);
  return {
    id: `picture-article-${entry.id}`, kind: "pictureArticle", added: true, difficulty: 2,
    requiredItemIds: [entry.id], prompt: "Welcher Artikel passt?", noun: entry.german.slice(article.length + 1),
    image: `/images/lektion-13-city/${entry.image}-places.webp`, answer: article,
    options: [{ id: "der", label: "der" }, { id: "die", label: "die" }, { id: "das", label: "das" }],
    explanation: `${entry.german} หมายถึง${entry.meaning} คำนี้ใช้ ${article} จึงเป็น${{ der: "เพศชาย", die: "เพศหญิง", das: "เพศกลาง" }[article]}`,
    translation: "คำนามนี้ใช้ Artikel อะไร?",
    assessment: { targetId: entry.id, subskill: "vocabulary_article", taskVersion: 1, difficulty: 2, assistance: "image-and-noun-no-article" },
  };
});

export const l13VocabularyChallengeActivities: VocabularyChallengeActivity[] = [
  ...original, ...newPictures, ...newOdd, ...newRiddles, ...newBuild, ...newCategories, ...newStories, crossword, ...pictureArticles,
];

export type ChallengeResponseDefinition = { id: string; answer: string; choices: string[] | null; assessment?: ArticleAssessment };
export const l13ChallengeResponses: ChallengeResponseDefinition[] = l13VocabularyChallengeActivities.flatMap(activity => {
  if (activity.kind === "story") return activity.gaps.map(gap => ({ id: gap.id, answer: gap.answer, choices: activity.wordBank.map(option => option.id) }));
  if (activity.kind === "crossword") return activity.rows.map(row => ({ id: row.id, answer: row.answer, choices: null }));
  if (activity.kind === "pictureArticle") return [{ id: activity.id, answer: activity.answer, choices: activity.options.map(option => option.id), assessment: activity.assessment }];
  return [{ id: activity.id, answer: activity.answer, choices: activity.kind === "build" ? null : activity.options.map(option => option.id) }];
});
