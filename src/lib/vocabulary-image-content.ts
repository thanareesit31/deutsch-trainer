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
  { id: "l13-urban", title: "สถานที่ในเมือง", germanTitle: "Orte in der Stadt", route: "/learn/L13/vocabulary/images/urban", wordOrder: ["L13-V001", "L13-V002", "L13-V003", "L13-V004", "L13-V005", "L13-V006", "L13-V007"], pictureOrder: ["L13-V004", "L13-V002", "L13-V006", "L13-V001", "L13-V007", "L13-V003", "L13-V005"] },
  { id: "l13-culture", title: "ร้านค้าและวัฒนธรรม", germanTitle: "Einkaufen und Kultur", route: "/learn/L13/vocabulary/images/culture", wordOrder: ["L13-V008", "L13-V009", "L13-V010", "L13-V018", "L13-V019", "L13-V020", "L13-V021"], pictureOrder: ["L13-V019", "L13-V010", "L13-V021", "L13-V008", "L13-V018", "L13-V009", "L13-V020"] },
  { id: "l13-leisure", title: "สันทนาการและธรรมชาติ", germanTitle: "Freizeit und Natur", route: "/learn/L13/vocabulary/images/leisure", wordOrder: ["L13-V011", "L13-V012", "L13-V013", "L13-V014", "L13-V015", "L13-V016", "L13-V017"], pictureOrder: ["L13-V014", "L13-V017", "L13-V012", "L13-V015", "L13-V011", "L13-V016", "L13-V013"] },
] as const;

const l13CityWords = [
  ["L13-V001", "die Stadt", "เมือง", "stadt"], ["L13-V002", "die Altstadt", "ย่านเมืองเก่า", "altstadt"], ["L13-V003", "der Park", "สวนสาธารณะ", "park"], ["L13-V004", "die Kirche", "โบสถ์", "kirche"], ["L13-V005", "das Schloss", "ปราสาท", "schloss"], ["L13-V006", "der Brunnen", "น้ำพุ", "brunnen"], ["L13-V007", "das Rathaus", "ศาลาว่าการเมือง", "rathaus"],
  ["L13-V008", "das Geschäft", "ร้านค้า", "geschaeft"], ["L13-V009", "der Laden", "ร้านค้า", "laden"], ["L13-V010", "der Markt", "ตลาด", "markt"], ["L13-V011", "der Zoo", "สวนสัตว์", "zoo"], ["L13-V012", "der Tierpark", "สวนสัตว์หรือสวนสัตว์เปิด", "tierpark"], ["L13-V013", "der Spielplatz", "สนามเด็กเล่น", "spielplatz"], ["L13-V014", "der Hafen", "ท่าเรือ", "hafen"], ["L13-V015", "der See", "ทะเลสาบ", "see"], ["L13-V016", "die Mauer", "กำแพง", "mauer"], ["L13-V017", "die Straße", "ถนน", "strasse"],
  ["L13-V018", "das Café", "คาเฟ่", "cafe"], ["L13-V019", "das Museum", "พิพิธภัณฑ์", "museum"], ["L13-V020", "das Kino", "โรงภาพยนตร์", "kino"], ["L13-V021", "die Wohnung", "ที่พักหรืออพาร์ตเมนต์", "wohnung"],
] as const;

export const l13VocabularyImageEntries: VocabularyImageEntryDefinition[] = l13CityWords.map(([id, german, meaning, image]) => ({
  id, german, reading: "", meaning,
  groupId: id <= "L13-V007" ? "l13-urban" : id <= "L13-V010" || id >= "L13-V018" ? "l13-culture" : "l13-leisure",
  image, lookup: [german.replace(/^(der|die|das) /, "")],
} as VocabularyImageEntryDefinition));

export type VocabularyImageGroupId = (typeof vocabularyImageGroups)[number]["id"] | (typeof l13VocabularyImageGroups)[number]["id"];
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
