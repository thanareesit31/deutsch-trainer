import type { Item } from "@/lib/content";

export const vocabularyImageActivity = {
  eyebrow: "Bilder",
  title: "Wortschatz",
  germanTitle: "Bilder Wortschatz",
};

export type FamilyPluralPair = {
  id: string;
  singular: string;
  plural: string;
};

export const l03FamilyPluralPairs: readonly FamilyPluralPair[] = [
  { id: "V025", singular: "Vater", plural: "Väter" },
  { id: "V027", singular: "Mutter", plural: "Mütter" },
  { id: "V035", singular: "Großvater", plural: "Großväter" },
  { id: "V037", singular: "Großmutter", plural: "Großmütter" },
  { id: "V030", singular: "Sohn", plural: "Söhne" },
  { id: "V031", singular: "Tochter", plural: "Töchter" },
  { id: "V032", singular: "Bruder", plural: "Brüder" },
  { id: "V033", singular: "Schwester", plural: "Schwestern" },
  { id: "V040", singular: "Enkel", plural: "Enkel" },
  { id: "V041", singular: "Enkelin", plural: "Enkelinnen" },
  { id: "V190", singular: "Mann", plural: "Männer" },
  { id: "V191", singular: "Frau", plural: "Frauen" },
  { id: "V192", singular: "Onkel", plural: "Onkel" },
  { id: "V193", singular: "Tante", plural: "Tanten" },
  { id: "V194", singular: "Neffe", plural: "Neffen" },
  { id: "V195", singular: "Nichte", plural: "Nichten" },
  { id: "V196", singular: "Freund", plural: "Freunde" },
  { id: "V197", singular: "Freundin", plural: "Freundinnen" },
];

export const vocabularyImageGroups = [
  {
    id: "greeting",
    title: "คำทักทาย",
    germanTitle: "Begrüßung",
    route: "/learn/L01/vocabulary/core-images",
    wordOrder: ["V001", "V003", "V002", "V004"],
    pictureOrder: ["V004", "V002", "V001", "V003"],
  },
  {
    id: "farewell",
    title: "คำบอกลา",
    germanTitle: "Abschied",
    route: "/learn/L01/vocabulary/core-images/farewell",
    wordOrder: ["V005", "V007", "V006"],
    pictureOrder: ["V006", "V005", "V007"],
  },
  {
    id: "names",
    title: "ชื่อ-สกุล",
    germanTitle: "Name und Familienname",
    route: "/learn/L01/vocabulary/core-images/names",
    wordOrder: ["image-L01-name", "image-L01-vorname", "image-L01-familienname"],
    pictureOrder: ["image-L01-familienname", "image-L01-name", "image-L01-vorname"],
  },
  {
    id: "countries",
    title: "ประเทศ",
    germanTitle: "Länder",
    route: "/learn/L01/vocabulary/core-images/countries",
    wordOrder: [
      "extra-L01-8", "image-L01-australia", "extra-L01-1", "extra-L01-6",
      "extra-L01-7", "extra-L01-3", "extra-L01-5", "extra-L01-9",
      "country-L01-usa", "extra-L01-2", "extra-L01-10", "extra-L01-4",
      "country-L01-laos", "country-L01-eritrea", "country-L01-argentina",
    ],
    pictureOrder: [
      "image-L01-australia", "extra-L01-1", "extra-L01-6", "extra-L01-7",
      "extra-L01-3", "extra-L01-5", "extra-L01-9", "country-L01-usa",
      "extra-L01-2", "extra-L01-10", "extra-L01-4", "country-L01-laos",
      "country-L01-eritrea", "country-L01-argentina", "extra-L01-8",
    ],
  },
  {
    id: "feelings",
    title: "ความรู้สึก",
    germanTitle: "Gefühle",
    route: "/learn/L01/vocabulary/core-images/feelings",
    wordOrder: [
      "image-L01-gut", "image-L01-sehr-gut", "image-L01-super",
      "image-L01-es-geht", "image-L01-nicht-so-gut",
    ],
    pictureOrder: [
      "image-L01-super", "image-L01-nicht-so-gut", "image-L01-gut",
      "image-L01-sehr-gut", "image-L01-es-geht",
    ],
  },
] as const;

export const l13VocabularyImageGroups = [
  { id: "l13-urban", title: "สถานที่ในเมือง", germanTitle: "Orte in der Stadt", route: "/learn/L13/vocabulary/images/urban", wordOrder: ["L13-V001", "L13-V002", "L13-V003", "L13-V004", "L13-V005", "L13-V006", "L13-V007", "L13-V047", "L13-V048", "L13-V049", "L13-V055"], pictureOrder: ["L13-V049", "L13-V004", "L13-V048", "L13-V002", "L13-V006", "L13-V047", "L13-V001", "L13-V055", "L13-V007", "L13-V003", "L13-V005"] },
  { id: "l13-culture", title: "ร้านค้าและวัฒนธรรม", germanTitle: "Einkaufen und Kultur", route: "/learn/L13/vocabulary/images/culture", wordOrder: ["L13-V008", "L13-V009", "L13-V010", "L13-V018", "L13-V019", "L13-V020", "L13-V021"], pictureOrder: ["L13-V019", "L13-V010", "L13-V021", "L13-V008", "L13-V018", "L13-V009", "L13-V020"] },
  { id: "l13-leisure", title: "สันทนาการและธรรมชาติ", germanTitle: "Freizeit und Natur", route: "/learn/L13/vocabulary/images/leisure", wordOrder: ["L13-V011", "L13-V012", "L13-V013", "L13-V014", "L13-V015", "L13-V016", "L13-V017"], pictureOrder: ["L13-V014", "L13-V017", "L13-V012", "L13-V015", "L13-V011", "L13-V016", "L13-V013"] },
] as const;

const l13CityWords = [
  ["L13-V001", "die Stadt", "เมือง", "stadt"], ["L13-V002", "die Altstadt", "ย่านเมืองเก่า", "altstadt"], ["L13-V003", "der Park", "สวนสาธารณะ", "park"], ["L13-V004", "die Kirche", "โบสถ์", "kirche"], ["L13-V005", "das Schloss", "ปราสาท", "schloss"], ["L13-V006", "der Brunnen", "น้ำพุ", "brunnen"], ["L13-V007", "das Rathaus", "ศาลาว่าการเมือง", "rathaus"],
  ["L13-V008", "das Geschäft", "ร้านค้า", "geschaeft"], ["L13-V009", "der Laden", "ร้านค้า", "laden"], ["L13-V010", "der Markt", "ตลาด", "markt"], ["L13-V011", "der Zoo", "สวนสัตว์", "zoo"], ["L13-V012", "der Tierpark", "สวนสัตว์หรือสวนสัตว์เปิด", "tierpark"], ["L13-V013", "der Spielplatz", "สนามเด็กเล่น", "spielplatz"], ["L13-V014", "der Hafen", "ท่าเรือ", "hafen"], ["L13-V015", "der See", "ทะเลสาบ", "see"], ["L13-V016", "die Mauer", "กำแพง", "mauer"], ["L13-V017", "die Straße", "ถนน", "strasse"],
  ["L13-V018", "das Café", "คาเฟ่", "cafe"], ["L13-V019", "das Museum", "พิพิธภัณฑ์", "museum"], ["L13-V020", "das Kino", "โรงภาพยนตร์", "kino"], ["L13-V021", "die Wohnung", "ที่พักหรืออพาร์ตเมนต์", "wohnung"],
  ["L13-V047", "der Fluss", "แม่น้ำ", "fluss-v2"], ["L13-V048", "die Brücke", "สะพาน", "bruecke-v2"], ["L13-V049", "die Galerie", "แกลเลอรี", "galerie-v2"], ["L13-V055", "der Fußballplatz", "สนามฟุตบอล", "fussballplatz-v2"],
] as const;

export const l13VocabularyImageEntries: VocabularyImageEntryDefinition[] = l13CityWords.map(([id, german, meaning, image]) => ({
  id, german, reading: "", meaning,
  groupId: l13VocabularyImageGroups.find((group) => group.wordOrder.some((wordId) => wordId === id))?.id ?? "l13-urban",
  image, lookup: [german.replace(/^(der|die|das) /, "")],
} as VocabularyImageEntryDefinition));

export type VocabularyImageGroupId = string;

export type VocabularyImageGroup = {
  id: string;
  title: string;
  germanTitle: string;
  route: string;
  wordOrder: readonly string[];
  pictureOrder: readonly string[];
};

export function vocabularyImagePages(wordOrder: readonly string[]): string[][] {
  const count = Math.max(1, Math.ceil(wordOrder.length / 6));
  const pages: string[][] = [];
  for (let page = 0, offset = 0; page < count; page++) {
    const size = Math.ceil((wordOrder.length - offset) / (count - page));
    pages.push(wordOrder.slice(offset, offset + size));
    offset += size;
  }
  return pages;
}

const vocabularyImageGroupThai: Record<string, string> = {
  Familie: "ครอบครัว",
  Familienstand: "สถานภาพครอบครัว",
  Möbel: "เฟอร์นิเจอร์",
  Elektrogeräte: "เครื่องใช้ไฟฟ้า",
  Bad: "ห้องน้ำ",
  Gegenstände: "สิ่งของ",
  "Büro & Technik": "สำนักงานและเทคโนโลยี",
  Freizeitaktivitäten: "กิจกรรมยามว่าง",
  Orte: "สถานที่",
  Wochentage: "วันในสัปดาห์",
  Tageszeiten: "ช่วงเวลาของวัน",
  "Essen und Trinken": "อาหารและเครื่องดื่ม",
  "Verkehrsmittel & Reise": "การเดินทางและยานพาหนะ",
  Alltagsaktivitäten: "กิจวัตรประจำวัน",
  Jahreszeiten: "ฤดูกาล",
  Monate: "เดือน",
  Institutionen: "สถานที่บริการในเมือง",
  "Plätze und Wege": "สถานที่และทางในเมือง",
  "Wohnen und Zimmer": "บ้านและห้อง",
  "Teile der Wohnung": "ส่วนต่าง ๆ ของที่อยู่อาศัย",
};

const l03FamilyImageAliases = new Map([
  ["V026", "V025"],
  ["V028", "V027"],
  ["V036", "V035"],
  ["V038", "V037"],
]);

export function catalogVocabularyImageSource(lessonId: string, image: string): string {
  if (image.startsWith("/images/")) return image;
  if (lessonId === "L02") return `/images/lektion-2-vocabulary/${image}-v2.webp`;
  if (lessonId === "L14" || lessonId === "L15") return `/images/lektion-${lessonId.slice(1)}-vocabulary/${image}.png`;
  const filename = lessonId === "L03" ? `${image}-family-v2.png`
    : lessonId === "L04" && image === "V053" ? `${image}-isolated-v3.jpg`
    : ["L04", "L05"].includes(lessonId) ? `${image}-isolated-v2.jpg`
      : `${image}.jpg`;
  return `/images/lektion-${lessonId.slice(1)}-vocabulary/${filename}`;
}

export function lessonVocabularyImageGroups(items: Item[], lessonId: string, onlyGroups?: readonly string[]): VocabularyImageGroup[] {
  const lessonItems = items.filter((item) =>
    item.lessonId === lessonId && item.skill === "vocabulary" && item.collection === "core" &&
    (!onlyGroups || onlyGroups.includes(item.group)),
  );
  const groupNames = [...new Set(lessonItems.map((item) => item.group))];
  return groupNames.map((germanTitle) => {
    const wordOrder = lessonItems.filter((item) => item.group === germanTitle && !(lessonId === "L03" && l03FamilyImageAliases.has(item.id))).map((item) => item.id);
    const slug = germanTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("de")
      .replace(/&/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id: `${lessonId.toLocaleLowerCase("de")}-${slug}`,
      title: vocabularyImageGroupThai[germanTitle] ?? germanTitle,
      germanTitle,
      route: `/learn/${lessonId}/vocabulary/images/${slug}`,
      wordOrder,
      pictureOrder: [...wordOrder].reverse(),
    };
  });
}

export function lessonVocabularyImageEntries(
  items: Item[],
  groups: VocabularyImageGroup[],
): VocabularyImageEntryDefinition[] {
  const groupByItem = new Map(groups.flatMap((group) => group.wordOrder.map((id) => [id, group.id] as const)));
  const entries: VocabularyImageEntryDefinition[] = [];
  for (const item of items) {
    const groupId = groupByItem.get(item.id);
    if (groupId) entries.push({
      id: item.id,
      german: [item, ...items.filter((candidate) => candidate.lessonId === "L03" && l03FamilyImageAliases.get(candidate.id) === item.id)]
        .map((member, index) => index === 0 ? member.answer : member.answer.replace(/^(der|die|das) /u, "")).join(" / "),
      itemIds: [item.id, ...items.filter((candidate) => candidate.lessonId === "L03" && l03FamilyImageAliases.get(candidate.id) === item.id).map((member) => member.id)],
      reading: "",
      meaning: item.meaning,
      groupId,
      image: item.image ?? (item.lessonId === "L03" ? l03FamilyImageAliases.get(item.id) ?? item.id : item.id),
    });
  }
  return entries;
}
export type CountryFlagId =
  | "france" | "australia" | "thailand" | "germany" | "austria"
  | "switzerland" | "turkey" | "japan" | "china" | "spain" | "italy"
  | "usa" | "laos" | "eritrea" | "argentina";

export type VocabularyImageEntryDefinition = {
  id: string;
  german: string;
  reading: string;
  meaning: string;
  groupId: VocabularyImageGroupId;
  image?: string;
  flag?: CountryFlagId;
  lookup?: string[];
  itemIds?: readonly string[];
};

export const vocabularyImageEntries: VocabularyImageEntryDefinition[] = [
  { id: "V001", german: "Hallo", reading: "ฮัลโล", meaning: "สวัสดี (เป็นกันเอง)", groupId: "greeting", image: "hallo-informal" },
  { id: "V002", german: "Guten Tag", reading: "กูเทิน ทาค", meaning: "สวัสดีตอนกลางวัน", groupId: "greeting", image: "guten-tag-midday" },
  { id: "V003", german: "Guten Morgen", reading: "กูเทิน มอร์เกิน", meaning: "สวัสดีตอนเช้า", groupId: "greeting", image: "guten-morgen-sunrise" },
  { id: "V004", german: "Guten Abend", reading: "กูเทิน อาเบินท์", meaning: "สวัสดีตอนเย็น", groupId: "greeting", image: "guten-abend-sunset" },
  { id: "V005", german: "Tschüss", reading: "ชึส", meaning: "ลาก่อน (เป็นกันเอง)", groupId: "farewell", image: "tschuess-ciao" },
  { id: "V006", german: "Auf Wiedersehen", reading: "เอาฟ์ วีเดอร์เซน", meaning: "แล้วพบกันใหม่ / ลาก่อน (เป็นทางการ)", groupId: "farewell", image: "auf-wiedersehen" },
  { id: "V007", german: "Gute Nacht", reading: "กูเทอะ นัคท์", meaning: "ราตรีสวัสดิ์", groupId: "farewell", image: "gute-nacht" },

  { id: "image-L01-name", german: "der Name", reading: "เดอร์ นาเมอ", meaning: "ชื่อ", groupId: "names", image: "name" },
  { id: "image-L01-vorname", german: "der Vorname", reading: "เดอร์ ฟอร์นาเมอ", meaning: "ชื่อตัว", groupId: "names", image: "vorname" },
  { id: "image-L01-familienname", german: "der Familienname", reading: "เดอร์ ฟามีเลียนนาเมอ", meaning: "นามสกุล", groupId: "names", image: "familienname" },

  { id: "extra-L01-8", german: "Frankreich", reading: "ฟรังค์ไรช์", meaning: "ฝรั่งเศส", groupId: "countries", flag: "france" },
  { id: "image-L01-australia", german: "Australien", reading: "เอาส์ทราเลียน", meaning: "ออสเตรเลีย", groupId: "countries", flag: "australia" },
  { id: "extra-L01-1", german: "Thailand", reading: "ไทลันท์", meaning: "ไทย", groupId: "countries", flag: "thailand" },
  { id: "extra-L01-6", german: "Japan", reading: "ยาพาน", meaning: "ญี่ปุ่น", groupId: "countries", flag: "japan" },
  { id: "extra-L01-7", german: "China", reading: "ชีนา", meaning: "จีน", groupId: "countries", flag: "china" },
  { id: "extra-L01-3", german: "Österreich", reading: "เอิสเทอร์ไรช์", meaning: "ออสเตรีย", groupId: "countries", flag: "austria" },
  { id: "extra-L01-5", german: "die Türkei", reading: "ดี เทือร์คาย", meaning: "ตุรกี", groupId: "countries", flag: "turkey", lookup: ["Türkei"] },
  { id: "extra-L01-9", german: "Spanien", reading: "ชปาเนียน", meaning: "สเปน", groupId: "countries", flag: "spain" },
  { id: "country-L01-usa", german: "die USA", reading: "ดี อูเอสอา", meaning: "สหรัฐอเมริกา", groupId: "countries", flag: "usa", lookup: ["USA"] },
  { id: "extra-L01-2", german: "Deutschland", reading: "ดอยช์ลันท์", meaning: "เยอรมนี", groupId: "countries", flag: "germany" },
  { id: "extra-L01-10", german: "Italien", reading: "อิตาเลียน", meaning: "อิตาลี", groupId: "countries", flag: "italy" },
  { id: "extra-L01-4", german: "die Schweiz", reading: "ดี ชไวท์ส", meaning: "สวิตเซอร์แลนด์", groupId: "countries", flag: "switzerland", lookup: ["Schweiz"] },
  { id: "country-L01-laos", german: "Laos", reading: "ลาวส์", meaning: "ลาว", groupId: "countries", flag: "laos" },
  { id: "country-L01-eritrea", german: "Eritrea", reading: "เอริเทรีย", meaning: "เอริเทรีย", groupId: "countries", flag: "eritrea" },
  { id: "country-L01-argentina", german: "Argentinien", reading: "อาร์เจนทีเนียน", meaning: "อาร์เจนตินา", groupId: "countries", flag: "argentina" },

  { id: "image-L01-gut", german: "gut", reading: "กูท", meaning: "ดี", groupId: "feelings", image: "feeling-gut" },
  { id: "image-L01-sehr-gut", german: "sehr gut", reading: "เซียร์ กูท", meaning: "ดีมาก", groupId: "feelings", image: "feeling-sehr-gut" },
  { id: "image-L01-super", german: "super", reading: "ซูเปอร์", meaning: "ยอดเยี่ยม", groupId: "feelings", image: "feeling-super" },
  { id: "image-L01-es-geht", german: "es geht", reading: "เอส เกท", meaning: "ก็พอไหว / เรื่อย ๆ", groupId: "feelings", image: "feeling-es-geht" },
  { id: "image-L01-nicht-so-gut", german: "nicht so gut", reading: "นิชท์ โซ กูท", meaning: "ไม่ค่อยดี", groupId: "feelings", image: "feeling-nicht-so-gut" },
];
