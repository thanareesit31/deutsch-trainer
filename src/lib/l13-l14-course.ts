export const courseCategories = [
  { id: "vocabulary", de: "Wortschatz", th: "คำศัพท์", kind: "knowledge" },
  { id: "grammar", de: "Grammatik", th: "ไวยากรณ์", kind: "knowledge" },
  { id: "phrases", de: "Redemittel", th: "ประโยคและสำนวน", kind: "knowledge" },
  { id: "listening", de: "Hören", th: "การฟัง", kind: "skill" },
  { id: "speaking", de: "Sprechen", th: "การพูด", kind: "skill" },
  { id: "reading", de: "Lesen", th: "การอ่าน", kind: "skill" },
  { id: "writing", de: "Schreiben", th: "การเขียน", kind: "skill" },
] as const;

export type CourseCategory = (typeof courseCategories)[number]["id"];
export type CourseLessonId = "L13" | "L14";
export type ExerciseKind =
  | "text_marking"
  | "codeword_riddle"
  | "word_search"
  | "context_bank"
  | "multiple_choice"
  | "multi_select"
  | "matching"
  | "cloze"
  | "word_order"
  | "letter_slots"
  | "crossword"
  | "image_hotspot"
  | "categorization"
  | "true_false_evidence"
  | "text_response"
  | "audio_mcq"
  | "audio_route"
  | "recorded_speech"
  | "dialogue_builder"
  | "map_route"
  | "flashcard_recall";
export type Difficulty = 1 | 2 | 3 | 4;

export type SourceId =
  | "momente-arbeitsbuch-a11"
  | "momente-arbeitsbuch-a12"
  | "momente-kursbuch-a12"
  | "sheet-l13"
  | "grammatik-aktiv"
  | "wortschatz-a1"
  | "user-crossword"
  | "original";
export type SourceRelation =
  | "source_topic"
  | "exercise_mechanic"
  | "original_practice";
export type SourceRef = {
  sourceId: SourceId;
  printedPage?: number;
  pdfPage?: number;
  activity?: string;
  relation: SourceRelation;
};

export type CourseExercisePattern = {
  id: string;
  category: CourseCategory;
  kind: ExerciseKind;
  name: string;
  minDifficulty: Difficulty;
  maxDifficulty: Difficulty;
  sourceRefs: readonly SourceRef[];
};

const book = (printedPage: number, activity: string): SourceRef => ({
  sourceId: "momente-kursbuch-a12",
  printedPage,
  activity,
  relation: "source_topic",
});
const original = (): SourceRef => ({ sourceId: "original", relation: "original_practice" });
const mechanic = (sourceId: SourceId): SourceRef => ({ sourceId, relation: "exercise_mechanic" });

export const courseExercisePatterns = [
  { id: "VOC-01", category: "vocabulary", kind: "multiple_choice", name: "ภาพกับคำศัพท์", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [book(11, "Bildlexikon"), original()] },
  { id: "VOC-02", category: "vocabulary", kind: "matching", name: "จับคู่ศัพท์กับความหมาย", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [original()] },
  { id: "VOC-03", category: "vocabulary", kind: "multiple_choice", name: "เลือก Artikel", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(15, "5a"), original()] },
  { id: "VOC-04", category: "vocabulary", kind: "flashcard_recall", name: "Flashcard และประเมินตนเอง", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [original()] },
  { id: "VOC-05", category: "vocabulary", kind: "letter_slots", name: "เติมอักษรที่หายไป", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [book(16, "Schnelltest"), original()] },
  { id: "VOC-06", category: "vocabulary", kind: "crossword", name: "ภาพกับอักษรไขว้", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [mechanic("user-crossword"), book(15, "Bildlexikon"), original()] },
  { id: "VOC-07", category: "vocabulary", kind: "word_order", name: "เรียงตัวอักษรเป็นคำ", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [original()] },
  { id: "VOC-08", category: "vocabulary", kind: "matching", name: "ประกอบคำจากส่วนคำ", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [book(12, "Schnelltest"), original()] },
  { id: "VOC-09", category: "vocabulary", kind: "multi_select", name: "ค้นคำในตารางอักษร", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [original()] },
  { id: "VOC-10", category: "vocabulary", kind: "audio_mcq", name: "ฟังแล้วเลือกศัพท์", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [original()] },

  { id: "GR-01", category: "grammar", kind: "matching", name: "สังเกตและเติมตารางรูปคำ", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [book(11, "4–5a"), book(15, "4b"), original()] },
  { id: "GR-02", category: "grammar", kind: "multiple_choice", name: "เลือกรูปไวยากรณ์", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(12, "Schnelltest"), book(16, "Schnelltest"), original()] },
  { id: "GR-03", category: "grammar", kind: "image_hotspot", name: "เลือกคำบุพบทจากตำแหน่ง", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(14, "4a"), original()] },
  { id: "GR-04", category: "grammar", kind: "matching", name: "จับคู่ Nominativ กับ Dativ", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [book(11, "5a"), original()] },
  { id: "GR-05", category: "grammar", kind: "cloze", name: "เติมรูปคำในประโยค", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [original()] },
  { id: "GR-06", category: "grammar", kind: "cloze", name: "แปลงรูปประโยค", minDifficulty: 3, maxDifficulty: 4, sourceRefs: [book(12, "Schnelltest"), original()] },
  { id: "GR-07", category: "grammar", kind: "multiple_choice", name: "แยกผู้กระทำกับผู้รับ", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [book(11, "5a"), original()] },
  { id: "GR-08", category: "grammar", kind: "true_false_evidence", name: "หาและแก้จุดผิด", minDifficulty: 3, maxDifficulty: 4, sourceRefs: [book(10, "3b"), original()] },
  { id: "GR-09", category: "grammar", kind: "categorization", name: "จัดกลุ่มรูปประโยค", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [original()] },

  { id: "RED-01", category: "phrases", kind: "multiple_choice", name: "เลือกสำนวนให้ตรงสถานการณ์", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(11, "3c"), book(16, "6a"), original()] },
  { id: "RED-02", category: "phrases", kind: "matching", name: "จับคู่คำถามกับคำตอบ", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(11, "6"), original()] },
  { id: "RED-03", category: "phrases", kind: "categorization", name: "จัดกลุ่มตามเจตนาการพูด", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(16, "6a"), original()] },
  { id: "RED-04", category: "phrases", kind: "dialogue_builder", name: "เรียงบทสนทนา", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [book(16, "Schnelltest"), original()] },
  { id: "RED-05", category: "phrases", kind: "cloze", name: "เติมประโยคสนทนา", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [original()] },

  { id: "HOE-01", category: "listening", kind: "audio_mcq", name: "ฟังแล้วเลือกภาพ", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [original()] },
  { id: "HOE-02", category: "listening", kind: "audio_mcq", name: "ฟังแล้วเลือกคำตอบ", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(13, "1"), original()] },
  { id: "HOE-03", category: "listening", kind: "cloze", name: "ฟังแล้วเติมข้อมูล", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [original()] },
  { id: "HOE-04", category: "listening", kind: "audio_route", name: "ฟังแล้วลากเส้นทาง", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [book(14, "3a"), original()] },
  { id: "HOE-05", category: "listening", kind: "dialogue_builder", name: "ฟังแล้วเรียงลำดับ", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [original()] },

  { id: "LES-01", category: "reading", kind: "matching", name: "จับคู่หัวข้อกับข้อความ", minDifficulty: 1, maxDifficulty: 3, sourceRefs: [book(10, "3a"), original()] },
  { id: "LES-02", category: "reading", kind: "true_false_evidence", name: "ตรวจข้อความพร้อมชี้หลักฐาน", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [book(10, "3b"), original()] },
  { id: "LES-03", category: "reading", kind: "map_route", name: "อ่านคำบอกทางแล้วเลือกจุดหมาย", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [book(15, "5"), original()] },
  { id: "LES-04", category: "reading", kind: "cloze", name: "อ่านแล้วตอบข้อมูล", minDifficulty: 2, maxDifficulty: 4, sourceRefs: [original()] },

  { id: "SCH-01", category: "writing", kind: "text_response", name: "วางแผนด้วยคำสำคัญ", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [book(11, "6a"), original()] },
  { id: "SCH-02", category: "writing", kind: "word_order", name: "สร้างประโยคจากส่วนคำ", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [original()] },
  { id: "SCH-03", category: "writing", kind: "text_response", name: "เขียนย่อหน้าสั้น", minDifficulty: 3, maxDifficulty: 4, sourceRefs: [book(12, "6b"), original()] },
  { id: "SCH-04", category: "writing", kind: "text_response", name: "เขียนข้อความถึงผู้รับ", minDifficulty: 3, maxDifficulty: 4, sourceRefs: [original()] },
  { id: "SCH-05", category: "writing", kind: "text_response", name: "เขียนขั้นตอนบอกทาง", minDifficulty: 3, maxDifficulty: 4, sourceRefs: [book(16, "6a–b"), original()] },

  { id: "SPR-01", category: "speaking", kind: "recorded_speech", name: "อ่านและตรวจการพูด", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [original()] },
  { id: "SPR-02", category: "speaking", kind: "recorded_speech", name: "ตอบคำถามสั้น", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [book(11, "3c, 5b"), original()] },
  { id: "SPR-03", category: "speaking", kind: "recorded_speech", name: "สวมบทบาทถามทาง", minDifficulty: 3, maxDifficulty: 4, sourceRefs: [book(16, "6b"), original()] },
  { id: "SPR-04", category: "speaking", kind: "recorded_speech", name: "อธิบายสถานที่หรือแผนที่", minDifficulty: 3, maxDifficulty: 4, sourceRefs: [original()] },
] as const satisfies readonly CourseExercisePattern[];

export const supplementalExercisePatterns = [
  { id: "SUP-VOC-SEARCH", category: "vocabulary", kind: "word_search", name: "ค้นคำในตารางจริง", minDifficulty: 1, maxDifficulty: 2, sourceRefs: [{sourceId:"wortschatz-a1",printedPage:48,pdfPage:47,activity:"B9/4",relation:"exercise_mechanic"}, original()] },
  { id: "SUP-VOC-CONTEXT", category: "vocabulary", kind: "context_bank", name: "เติมข้อความจากคลังคำร่วม", minDifficulty: 2, maxDifficulty: 3, sourceRefs: [{sourceId:"wortschatz-a1",printedPage:37,pdfPage:36,activity:"B7/4",relation:"exercise_mechanic"}, original()] },
] as const satisfies readonly CourseExercisePattern[];
const abMechanic = (printedPage:number,pdfPage:number,activity:string):SourceRef => ({sourceId:"momente-arbeitsbuch-a12",printedPage,pdfPage,activity,relation:"exercise_mechanic"});
export const arbeitsbuchExercisePatterns = [
 {id:"AB-GR-MARK",category:"grammar",kind:"text_marking",name:"สังเกตคำในข้อความ",minDifficulty:1,maxDifficulty:2,sourceRefs:[abMechanic(8,7,"L13/7a"),original()]},
 {id:"AB-GR-BANK",category:"grammar",kind:"context_bank",name:"Dativ ในบริบทจากคลังคำ",minDifficulty:2,maxDifficulty:3,sourceRefs:[abMechanic(8,7,"L13/8a"),original()]},
 {id:"AB-VOC-CODE",category:"vocabulary",kind:"codeword_riddle",name:"แก้คำใบ้และถอดคำรหัส",minDifficulty:3,maxDifficulty:4,sourceRefs:[abMechanic(12,11,"L14/8"),original()]},
 {id:"AB-RED-BANK",category:"phrases",kind:"context_bank",name:"เติมสำนวนสนทนาในบริบท",minDifficulty:3,maxDifficulty:4,sourceRefs:[abMechanic(13,12,"L14/13"),original()]},
] as const satisfies readonly CourseExercisePattern[];
export const allCourseExercisePatterns = [...courseExercisePatterns, ...supplementalExercisePatterns, ...arbeitsbuchExercisePatterns];
export type CoursePatternId = (typeof allCourseExercisePatterns)[number]["id"];

export const courseSourceAudit = [
  { sourceId: "momente-kursbuch-a12", status: "available", use: "L13–L14 learning topics and source map activities" },
  { sourceId: "sheet-l13", status: "icloud-placeholder", use: "not used to claim worksheet-specific content" },
  { sourceId: "grammatik-aktiv", status: "available-initial-review", use: "PDF extracted from user-located nested ZIP/RAR; table of contents checked; individual exercise references pending review" },
  { sourceId: "wortschatz-a1", status: "available-initial-review", use: "user-located PDF opened; word-search mechanism checked; remaining exercise references pending review" },
  { sourceId: "user-crossword", status: "preset-available", use: "original grid mechanic and coordinates" },
] as const;

export type CourseAsset = {
  id: string;
  src: string;
  alt: string;
  sourceRefs: readonly SourceRef[];
};

export type CourseOption = {
  id: string;
  text: string;
  assetId?: string;
};
export type SearchWord = { word: string; meaning: string; start: number; end: number };
export type WordSearchQuestion = { id:string; kind:"word_search"; prompt:string; grid:readonly string[]; words:readonly SearchWord[]; showWords:boolean; hint:string; explanation:string };
export type ContextBankQuestion = { id:string; kind:"context_bank"; wrongExplanation?:string; caseSensitive?:boolean; prompt:string; segments:readonly string[]; bank:readonly string[]; answers:readonly string[]; hint:string; explanation:string };
export type TextMarkingRole = "verb" | "dative";
export type TextMarkingQuestion = {id:string;kind:"text_marking";prompt:string;tokens:readonly string[];answerRoles:Readonly<Record<string,TextMarkingRole>>;hint:string;explanation:string};
export type CodewordQuestion = {id:string;kind:"codeword_riddle";prompt:string;clues:readonly {id:string;clueTh:string;answer:string;extractIndex:number}[];solution:string;hint:string;explanation:string};
export type CourseQuestion =
  | TextMarkingQuestion
  | CodewordQuestion
  | WordSearchQuestion
  | ContextBankQuestion
  | {
      id: string;
      kind: "multiple_choice";
      prompt: string;
      assetId?: string;
      options: readonly CourseOption[];
      answerId: string;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "multi_select";
      prompt: string;
      options: readonly CourseOption[];
      answerIds: readonly string[];
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "matching";
      prompt: string;
      left: readonly CourseOption[];
      right: readonly CourseOption[];
      answerPairs: Readonly<Record<string, string>>;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "cloze";
      assetId?: string;
      wrongExplanation?: string;
      prompt: string;
      sentence: string;
      audioText?: string;
      acceptedAnswers: readonly string[];
      caseSensitive?: boolean;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "word_order";
      prompt: string;
      tokens: readonly string[];
      acceptedOrders: readonly (readonly string[])[];
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "letter_slots";
      prompt: string;
      answer: string;
      assetId?: string;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "crossword";
      prompt: string;
      presetId: string;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "image_hotspot";
      prompt: string;
      assetId: string;
      options: readonly CourseOption[];
      answerId: string;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "categorization";
      prompt: string;
      buckets: readonly CourseOption[];
      items: readonly CourseOption[];
      answerBuckets: Readonly<Record<string, string>>;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "true_false_evidence";
      passage: string;
      statement: string;
      answer: boolean;
      evidence: string;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "text_response";
      prompt: string;
      minimumWords: number;
      targetPhrases: readonly string[];
      rubric: readonly string[];
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "audio_mcq";
      prompt: string;
      audioText: string;
      options: readonly CourseOption[];
      answerId: string;
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "audio_route";
      prompt: string;
      audioText: string;
      mapId: string;
      acceptedRoutes: readonly (readonly string[])[];
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "recorded_speech";
      prompt: string;
      example: string;
      checklist: readonly string[];
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "dialogue_builder";
      prompt: string;
      audioText?: string;
      turns: readonly CourseOption[];
      acceptedOrders: readonly (readonly string[])[];
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "map_route";
      prompt: string;
      mapId: string;
      startNode: string;
      acceptedRoutes: readonly (readonly string[])[];
      hint: string;
      explanation: string;
    }
  | {
      id: string;
      kind: "flashcard_recall";
      prompt: string;
      answer: string;
      meaning: string;
      hint: string;
      explanation: string;
    };

type ExercisePackBase = {
  id: string;
  lessonId: CourseLessonId;
  category: CourseCategory;
  patternId: CoursePatternId;
  primaryCompetency: string;
  secondaryCompetencies: readonly string[];
  topicIds: readonly string[];
  requiredLearnedTopics: readonly string[];
  difficulty: Difficulty;
  title: string;
  sourceRefs: readonly SourceRef[];
  isOriginalPractice: true;
  answerVersion: string;
};
export type ExercisePack = {
  [K in CourseQuestion["kind"]]: ExercisePackBase & {
    kind: K;
    questions: readonly [
      Extract<CourseQuestion, { kind: K }>,
      ...Extract<CourseQuestion, { kind: K }>[],
    ];
  };
}[CourseQuestion["kind"]];

export type CourseAttempt = {
  attemptId: string;
  exerciseId: string;
  questionId: string;
  lessonId: CourseLessonId;
  category: CourseCategory;
  topicIds: readonly string[];
  primaryCompetency: string;
  patternId: CoursePatternId;
  response: string | readonly string[] | Readonly<Record<string, string>> | null;
  startedAt: string;
  submittedAt: string;
  correctness: number | null;
  errorTag?: string;
  maxScore: number;
  hintsUsed: number;
  retryNumber: number;
  evaluationMethod: "deterministic" | "rubric" | "manual" | "asr_assisted";
  answerVersion: string;
};

export type CourseProgressStatus =
  | "not_started"
  | "learning"
  | "practicing"
  | "review_due"
  | "stable";
export type CourseCompetencyProgress = {
  key: string;
  lessonId: CourseLessonId;
  category: CourseCategory;
  topicId: string;
  status: CourseProgressStatus;
  learnCompleted: boolean;
  independentAttempts: number;
  uniqueExerciseTypes: number;
  sessionsWithEvidence: number;
  correctWithoutHints: number;
  wrongByErrorTag: Readonly<Record<string, number>>;
  lastPracticedAt?: string;
  dueAt?: string;
  confidence: "insufficient" | "low" | "medium" | "high";
};

export type CourseProgressState = {
  version: 1;
  completedTopics: readonly string[];
  attempts: readonly CourseAttempt[];
  drafts: Readonly<Record<string, string>>;
};

export const courseAssets = [
  { id: "l13-park", src: "/images/lektion-13-city/park-places.webp", alt: "สวนสาธารณะในเมือง", sourceRefs: [book(9, "Orte in der Stadt"), original()] },
  { id: "l13-tierpark", src: "/images/lektion-13-city/tierpark-places.webp", alt: "สวนสัตว์ในเมือง", sourceRefs: [book(9, "Orte in der Stadt"), original()] },
  { id: "l14-local-position", src: "/images/lektion-14-vocabulary/local-position.svg", alt: "คาเฟ่กับธนาคารอยู่ข้างกัน และที่ทำการไปรษณีย์อยู่อีกฝั่งถนน", sourceRefs: [original()] },
  { id: "l14-post", src: "/images/lektion-14-vocabulary/post-v2.jpg", alt: "ที่ทำการไปรษณีย์", sourceRefs: [book(14, "Bildlexikon"), original()] },
  { id: "l14-bank", src: "/images/lektion-14-vocabulary/bank-v2.jpg", alt: "ธนาคาร", sourceRefs: [book(14, "Bildlexikon"), original()] },
  { id: "l14-ampel", src: "/images/lektion-14-vocabulary/ampel.png", alt: "ไฟจราจร", sourceRefs: [book(15, "Bildlexikon"), original()] },
  { id: "l14-polizei", src: "/images/lektion-14-vocabulary/polizei.png", alt: "สถานีตำรวจ", sourceRefs: [book(14, "Bildlexikon"), original()] },
  { id: "l14-zentrum", src: "/images/lektion-14-vocabulary/zentrum.png", alt: "ใจกลางเมือง", sourceRefs: [book(15, "Bildlexikon"), original()] },
  { id: "l14-kaufhaus", src: "/images/lektion-14-vocabulary/kaufhaus.png", alt: "ห้างสรรพสินค้า", sourceRefs: [book(14, "4a"), original()] },
] as const satisfies readonly CourseAsset[];

export type CourseExample = {
  german: string;
  thai: string;
  focus?: string;
};
export type GuidedCheck = {
  id: string;
  prompt: string;
  choices: readonly string[];
  answer: string;
  hint: string;
  explanation: string;
};
export type CourseTopic = {
  id: string;
  title: string;
  outcome: string;
  context: string;
  examples: readonly CourseExample[];
  rule: string;
  guidedChecks: readonly GuidedCheck[];
  application: string;
  summary: readonly [string, string, string];
  sourceRefs: readonly SourceRef[];
};
export type CourseCategoryPlan = {
  category: CourseCategory;
  topics: readonly CourseTopic[];
};
export type CourseLessonCurriculum = {
  id: CourseLessonId;
  level: "A1.3";
  title: string;
  categories: readonly CourseCategoryPlan[];
};

const topicSources = (page: number, activity: string): readonly SourceRef[] => [
  book(page, activity),
  original(),
];
const check = (
  id: string,
  prompt: string,
  choices: readonly string[],
  answer: string,
  hint: string,
  explanation: string,
): GuidedCheck => ({ id, prompt, choices, answer, hint, explanation });

export const l13L14Curriculum: readonly CourseLessonCurriculum[] = [
  {
    id: "L13",
    level: "A1.3",
    title: "Berlin gefällt mir.",
    categories: [
      {
        category: "vocabulary",
        topics: [{
          id: "L13-ort-in-der-stadt",
          title: "Orte in der Stadt",
          outcome: "บอกชื่อสถานที่ในเมืองพร้อม Artikel ได้",
          context: "โซเฟียเล่าเรื่องเบอร์ลินและสถานที่ที่เธอไป ผู้เรียนสังเกตชื่อสถานที่กับ Artikel",
          examples: [
            { german: "der Park", thai: "สวนสาธารณะ", focus: "der" },
            { german: "die Kirche", thai: "โบสถ์", focus: "die" },
            { german: "das Rathaus", thai: "ศาลาว่าการเมือง", focus: "das" },
            { german: "der Hafen", thai: "ท่าเรือ", focus: "der" },
          ],
          rule: "เรียนคำนามพร้อม Artikel เพราะเพศของคำนามไม่ได้บอกได้จากความหมายภาษาไทย",
          guidedChecks: [
            check("L13-W-01", "สวนสาธารณะใช้ Artikel ใด?", ["der", "die", "das"], "der", "ดูตัวอย่าง der Park", "Park เป็นคำนามเพศชาย จึงใช้ der Park"),
            check("L13-W-02", "ศาลาว่าการเมืองใช้ Artikel ใด?", ["der", "die", "das"], "das", "ดูตัวอย่าง das Rathaus", "Rathaus เป็นคำนามเพศกลาง จึงใช้ das Rathaus"),
          ],
          application: "เลือกสถานที่ในเมืองหนึ่งแห่ง แล้วพูดชื่อพร้อม Artikel",
          summary: ["จำคำนามพร้อม der/die/das", "ใช้ภาพช่วยจำความหมาย ไม่เดาเพศจากภาษาไทย", "ทบทวนคำที่ยังสับสนด้วยแบบฝึกภาพ"],
          sourceRefs: topicSources(11, "Bildlexikon"),
        }],
      },
      {
        category: "grammar",
        topics: [
          {
            id: "L13-es-gibt-akkusativ",
            title: "Es gibt + Akkusativ",
            outcome: "เลือกรูป Artikel หลัง es gibt ตามเพศและจำนวนของคำนามได้",
            context: "โซเฟียบอกว่ามีหรือไม่มีสถานที่ใดในเมือง",
            examples: [
              { german: "Es gibt einen Hafen.", thai: "มีท่าเรือแห่งหนึ่ง", focus: "einen" },
              { german: "Es gibt ein Rathaus.", thai: "มีศาลาว่าการเมืองแห่งหนึ่ง", focus: "ein" },
              { german: "Es gibt eine Altstadt.", thai: "มีย่านเมืองเก่า", focus: "eine" },
              { german: "Es gibt viele Kirchen.", thai: "มีโบสถ์หลายแห่ง", focus: "viele" },
            ],
            rule: "es gibt ใช้ Akkusativ กับสิ่งที่มีหรือไม่มี คำนามเพศชายเปลี่ยน ein/kein เป็น einen/keinen; เพศกลางใช้ ein/kein, เพศหญิงใช้ eine/keine และพหูพจน์ใช้ viele/keine",
            guidedChecks: [
              check("L13-G-01", "Es gibt ___ Hafen. (der Hafen)", ["ein", "einen", "eine"], "einen", "Hafen เป็นเพศชาย และตามหลัง es gibt", "Akkusativ เพศชายใช้ einen"),
              check("L13-G-02", "Es gibt ___ Rathaus. (das Rathaus)", ["einen", "ein", "eine"], "ein", "Rathaus เป็นเพศกลาง", "Akkusativ เพศกลางยังใช้ ein"),
            ],
            application: "แต่งประโยคหนึ่งประโยคว่าบริเวณของคุณมีหรือไม่มีสถานที่ใด",
            summary: ["es gibt ตามด้วยสิ่งที่มีในรูป Akkusativ", "เพศชายเอกพจน์ใช้ einen/keinen", "เพศหญิง เพศกลาง และพหูพจน์ใช้รูปตามตาราง"],
            sourceRefs: topicSources(11, "4"),
          },
          {
            id: "L13-dativ-pronomen",
            title: "Personalpronomen im Dativ",
            outcome: "เปลี่ยนสรรพนามผู้รับเป็นรูป Dativ ตามบุคคลได้",
            context: "ราอูลขอบคุณโซเฟียและพูดถึงบล็อกของเธอ",
            examples: [
              { german: "ich → mir", thai: "ฉัน → แก่ฉัน", focus: "mir" },
              { german: "du → dir", thai: "เธอ → แก่เธอ", focus: "dir" },
              { german: "er / es → ihm", thai: "เขา / มัน → แก่เขา / แก่มัน", focus: "ihm" },
              { german: "wir → uns", thai: "พวกเรา → แก่พวกเรา", focus: "uns" },
              { german: "sie / Sie → ihnen / Ihnen", thai: "พวกเขา / คุณอย่างสุภาพ", focus: "ihnen / Ihnen" },
            ],
            rule: "Dativ ใช้กับผู้รับหรือผู้ที่ได้รับผลจากเหตุการณ์ รูปสรรพนามต้องเปลี่ยนตามบุคคล รวมรูปสุภาพ Ihnen",
            guidedChecks: [
              check("L13-G-03", "Ich danke ___. (du)", ["du", "dir", "dich"], "dir", "ผู้ที่ได้รับคำขอบคุณอยู่ใน Dativ", "du เปลี่ยนเป็น dir"),
              check("L13-G-04", "Das gefällt ___. (ich)", ["ich", "mir", "mich"], "mir", "ผู้ที่รู้สึกชอบเป็นผู้รับความรู้สึก", "ich เปลี่ยนเป็น mir"),
            ],
            application: "พูดขอบคุณคนหนึ่งคนโดยใช้ Ich danke ...",
            summary: ["ดูว่าประโยคกล่าวถึงผู้รับคนใด", "ich/du เปลี่ยนเป็น mir/dir", "ฝึกจำรูปอื่นรวมทั้ง Ihnen"],
            sourceRefs: topicSources(11, "5a"),
          },
          {
            id: "L13-verben-mit-dativ",
            title: "Verben mit Dativ",
            outcome: "สร้างประโยคสั้นด้วย gefallen, gehören, helfen และ danken ได้",
            context: "โซเฟียให้ความเห็นเกี่ยวกับสถานที่ และราอูลพูดกับเธอ",
            examples: [
              { german: "Der Park gefällt mir.", thai: "ฉันชอบสวนสาธารณะ", focus: "Der Park" },
              { german: "Das Buch gehört ihr.", thai: "หนังสือเป็นของเธอ", focus: "ihr" },
              { german: "Der Weg hilft uns.", thai: "เส้นทางนี้ช่วยพวกเรา", focus: "uns" },
              { german: "Ich danke dir.", thai: "ฉันขอบคุณเธอ", focus: "dir" },
            ],
            rule: "gefallen, gehören, helfen และ danken ใช้ Dativ กับคนที่รู้สึกชอบ เป็นเจ้าของ ได้รับความช่วยเหลือ หรือได้รับคำขอบคุณ; ใน Der Park gefällt mir ประธานคือ Der Park",
            guidedChecks: [
              check("L13-G-05", "Der Park gefällt ___. (ich)", ["ich", "mir", "mich"], "mir", "ถามว่าใครรู้สึกชอบ", "ผู้รู้สึกชอบใช้ Dativ mir"),
              check("L13-G-06", "Das Fahrrad gehört ___. (er)", ["er", "ihm", "ihn"], "ihm", "คนที่เป็นเจ้าของใช้ Dativ", "er เปลี่ยนเป็น ihm"),
            ],
            application: "เขียนประโยคหนึ่งประโยคว่าคุณชอบหรือมีสิ่งใด",
            summary: ["จำกริยาที่ตามด้วย Dativ", "ผู้รับ/ผู้รู้สึกชอบอยู่ใน Dativ", "gefallen มีสิ่งที่ชอบเป็นประธาน"],
            sourceRefs: topicSources(11, "5a–5b"),
          },
        ],
      },
      {
        category: "phrases",
        topics: [{
          id: "L13-ort-bewerten",
          title: "Einen Ort bewerten",
          outcome: "บอกความชอบและยกเหตุผลสั้น ๆ เกี่ยวกับสถานที่ได้",
          context: "เพื่อนคุยกันว่าอยากไปเบอร์ลินหรือชอบสถานที่ใด",
          examples: [
            { german: "Mein Lieblingsort ist der Park.", thai: "สถานที่โปรดของฉันคือสวนสาธารณะ" },
            { german: "Ich liebe die Altstadt.", thai: "ฉันรักย่านเมืองเก่า" },
            { german: "Der See gefällt mir besonders gut.", thai: "ฉันชอบทะเลสาบเป็นพิเศษ" },
          ],
          rule: "ใช้ Ich finde ... หรือ Ich liebe ... เพื่อบอกความเห็น และใช้ ... gefällt mir เพื่อบอกว่าสถานที่นั้นทำให้เรารู้สึกชอบ",
          guidedChecks: [
            check("L13-R-01", "ต้องการบอกว่า 'ฉันชอบทะเลสาบมาก' เลือกประโยคใด?", ["Der See gefällt mir sehr gut.", "Es gibt der See.", "Ich danke der See."], "Der See gefällt mir sehr gut.", "เลือกประโยคที่บอกความรู้สึกชอบ", "Der See gefällt mir sehr gut. ใช้บอกความชอบ"),
            check("L13-R-02", "ประโยคใดบอกสถานที่โปรด?", ["Mein Lieblingsort ist der Park.", "Der Park gehört mir.", "Ich helfe dem Park."], "Mein Lieblingsort ist der Park.", "มองหาคำว่า Lieblingsort", "Mein Lieblingsort ist ... ใช้บอกสถานที่โปรด"),
          ],
          application: "เลือกหนึ่งสถานที่แล้วบอกว่าชอบหรือไม่ชอบ พร้อมเหตุผลหนึ่งข้อ",
          summary: ["Mein Lieblingsort ist ... ใช้แนะนำสถานที่โปรด", "Ich finde ... ใช้แสดงความเห็น", "... gefällt mir ใช้บอกความรู้สึกชอบ"],
          sourceRefs: topicSources(26, "einen Ort bewerten"),
        }],
      },
      {
        category: "listening",
        topics: [{
          id: "L13-stadt-hoeren",
          title: "Eine Stadt hören",
          outcome: "ฟังข้อมูลสั้นเกี่ยวกับเมืองแล้วเลือกสถานที่และสิ่งที่มีได้",
          context: "ฟังเสียงสังเคราะห์ภาษาเยอรมันที่แต่งใหม่เกี่ยวกับเมืองและสถานที่",
          examples: [
            { german: "In der Altstadt gibt es eine Kirche.", thai: "ในย่านเมืองเก่ามีโบสถ์" },
            { german: "Der Park gefällt mir sehr gut.", thai: "ฉันชอบสวนมาก" },
          ],
          rule: "ฟังหนึ่งรอบเพื่อจับหัวข้อ แล้วฟังซ้ำเพื่อเก็บรายละเอียด เช่นชื่อสถานที่หรือความเห็น",
          guidedChecks: [
            check("L13-H-01", "ก่อนเลือกคำตอบ ให้ฟังประโยคเยอรมันหนึ่งรอบ คุณได้ยินชื่อสถานที่ใด?", ["Kirche", "Bank", "Kaufhaus"], "Kirche", "กดฟังอีกครั้งและจับคำนาม", "ประโยคเสียงสังเคราะห์ระบุ die Kirche"),
            check("L13-H-02", "ประโยคที่ได้ยินบอกว่ามีอะไรในย่านเมืองเก่า?", ["eine Kirche", "einen Hafen", "keinen Park"], "eine Kirche", "ฟังส่วนหลังคำว่า es gibt", "es gibt ตามด้วย eine Kirche"),
          ],
          application: "ฟังตัวอย่างใหม่โดยไม่เปิดข้อความ แล้วสรุปสิ่งที่จับใจความได้",
          summary: ["เสียงในบทนี้เป็นเสียงสังเคราะห์จากข้อความแต่งใหม่", "เลือกตอบจากสิ่งที่ได้ยิน", "ถ้าไม่มีเสียงภาษาเยอรมัน ระบบจะไม่บันทึกคะแนน Hören"],
          sourceRefs: topicSources(9, "topic: city listening"),
        }],
      },
      {
        category: "speaking",
        topics: [{
          id: "L13-stadt-sprechen",
          title: "Über einen Ort sprechen",
          outcome: "พูดแนะนำสถานที่และบอกกิจกรรมที่ทำได้อย่างน้อยสองประโยค",
          context: "เล่าให้เพื่อนฟังว่าคุณชอบสถานที่ใดในเมือง",
          examples: [
            { german: "Mein Lieblingsort ist der See.", thai: "สถานที่โปรดของฉันคือทะเลสาบ" },
            { german: "Dort kann man spazieren gehen.", thai: "ที่นั่นเดินเล่นได้" },
          ],
          rule: "เริ่มจากบอกชื่อสถานที่ ตามด้วยกิจกรรมหรือเหตุผล ผู้เรียนเลือกอัดเสียงหรือใช้แบบประเมินตนเองได้",
          guidedChecks: [
            check("L13-S-01", "เริ่มแนะนำสถานที่โปรดด้วยวลีใด?", ["Mein Lieblingsort ist ...", "Wo ist ...?", "Tut mir leid ..."], "Mein Lieblingsort ist ...", "ใช้คำว่า Lieblingsort", "วลีนี้ใช้เริ่มแนะนำสถานที่โปรด"),
            check("L13-S-02", "เลือกวลีบอกกิจกรรมที่ทำได้ในสถานที่", ["Dort kann man ...", "Ich danke dir.", "Es gibt keinen ..."], "Dort kann man ...", "วลีนี้ตามด้วยกิจกรรม", "Dort kann man ... ใช้บอกกิจกรรมที่ทำได้"),
          ],
          application: "พูด 2–3 ประโยคเกี่ยวกับสถานที่ที่คุณชอบ โดยใช้อย่างน้อยหนึ่งวลีตัวอย่าง",
          summary: ["บอกชื่อสถานที่ก่อน", "เพิ่มกิจกรรมหรือความเห็น", "เสียงพูดไม่ถูกส่งออกจากอุปกรณ์"],
          sourceRefs: topicSources(11, "3c, 6"),
        }],
      },
      {
        category: "reading",
        topics: [{
          id: "L13-stadt-lesen",
          title: "Ein Blog über einen Ort",
          outcome: "จับคู่หัวข้อกับข้อความสั้นและยืนยันคำตอบจากหลักฐานได้",
          context: "อ่านข้อความ blog ที่เขียนใหม่เกี่ยวกับสถานที่ในเมือง แล้วลองเดาหัวข้อก่อนอ่านรายละเอียด",
          examples: [
            { german: "Am Wochenende gehen wir oft in den Park. Dort gibt es einen Spielplatz und einen Brunnen.", thai: "เนื้อหากล่าวถึงกิจกรรมกับสถานที่ในสวน" },
            { german: "Die Altstadt ist schön, aber die Wohnungen sind teuer.", thai: "เนื้อหากล่าวถึงย่านเมืองเก่าและราคาที่พัก" },
          ],
          rule: "อ่านคำสำคัญเพื่อจับใจความก่อน แล้วกลับไปหาประโยคที่ยืนยันรายละเอียด",
          guidedChecks: [
            check("L13-L-01", "ข้อความเรื่องสวนกล่าวถึงหัวข้อใด?", ["กิจกรรมสำหรับเด็ก", "การเดินทางด้วยรถไฟ", "ร้านขายยา"], "กิจกรรมสำหรับเด็ก", "หา Spielplatz ในข้อความ", "ข้อความบอกว่ามีสนามเด็กเล่น"),
            check("L13-L-02", "ข้อความบอกว่าที่พักในย่านเมืองเก่าเป็นอย่างไร?", ["ราคาแพง", "อยู่ใกล้สนามบิน", "ไม่มีหน้าต่าง"], "ราคาแพง", "มองหาคำว่า teuer", "teuer หมายถึงแพง"),
          ],
          application: "อ่านข้อความสั้นอีกครั้ง แล้วเลือกประโยคที่ใช้เป็นหลักฐานของคำตอบ",
          summary: ["จับหัวข้อจากคำสำคัญ", "ตรวจรายละเอียดในข้อความ", "ใช้ประโยคในข้อความเป็นหลักฐาน"],
          sourceRefs: topicSources(10, "3a–3b"),
        }],
      },
      {
        category: "writing",
        topics: [{
          id: "L13-lieblingsort-schreiben",
          title: "Mein Lieblingsort",
          outcome: "วางแผนและเขียนข้อความสั้นเกี่ยวกับสถานที่โปรดได้",
          context: "ก่อนเขียน ให้จดสถานที่ กิจกรรม สิ่งที่มี และสิ่งที่ชอบหรือขาด",
          examples: [
            { german: "Mein Lieblingsort ist der Park.", thai: "สถานที่โปรดของฉันคือสวนสาธารณะ" },
            { german: "Dort gibt es einen See. Der See gefällt mir.", thai: "ที่นั่นมีทะเลสาบ ฉันชอบทะเลสาบ" },
          ],
          rule: "เริ่มจากคำสำคัญ แล้วเรียงประโยคให้ตอบว่าอยู่ที่ไหน ทำอะไรได้ มีอะไร และคุณรู้สึกอย่างไร",
          guidedChecks: [
            check("L13-WR-01", "ช่อง 'Was gibt es?' ควรจดข้อมูลชนิดใด?", ["สิ่งที่มีในสถานที่", "เวลาเปิดร้าน", "ที่อยู่ของผู้รับ"], "สิ่งที่มีในสถานที่", "มองหาคำถาม Es gibt ...", "จดสิ่งที่มีในสถานที่ไว้ในช่องนี้"),
            check("L13-WR-02", "วลีใดใช้บอกความรู้สึกต่อสถานที่?", ["Der Ort gefällt mir.", "Der Ort ist neben.", "Ich suche den Weg."], "Der Ort gefällt mir.", "มองหากริยา gefällt", "Der Ort gefällt mir. แสดงความรู้สึกชอบ"),
          ],
          application: "เขียน 3–5 ประโยคเกี่ยวกับสถานที่โปรด โดยใช้ช่องวางแผนทั้งสี่",
          summary: ["จดคำสำคัญก่อนเขียน", "ใช้ Es gibt เพื่อบอกสิ่งที่มี", "ตรวจ Artikel และ Dativ ก่อนส่ง"],
          sourceRefs: topicSources(11, "6a–6b"),
        }],
      },
    ],
  },
  {
    id: "L14",
    level: "A1.3",
    title: "Vor dem Kaufhaus nach rechts.",
    categories: [
      {
        category: "vocabulary",
        topics: [{
          id: "L14-orte-in-der-stadt",
          title: "Institutionen und Plätze",
          outcome: "ระบุสถานที่และสิ่งของในเมืองพร้อม Artikel ได้",
          context: "ดูแผนที่เมืองและป้ายสถานที่ แล้วสังเกต Artikel ของคำนาม",
          examples: [
            { german: "die Post", thai: "ที่ทำการไปรษณีย์", focus: "die" },
            { german: "die Bank", thai: "ธนาคาร", focus: "die" },
            { german: "die Ampel", thai: "ไฟจราจร", focus: "die" },
            { german: "das Kaufhaus", thai: "ห้างสรรพสินค้า", focus: "das" },
            { german: "das Zentrum", thai: "ใจกลางเมือง", focus: "das" },
          ],
          rule: "เรียนชื่อสถานที่พร้อม Artikel และจัดคำเป็นหน่วยงาน สถานที่ และสิ่งบนถนน",
          guidedChecks: [
            check("L14-W-01", "ที่ทำการไปรษณีย์ใช้ Artikel ใด?", ["der", "die", "das"], "die", "ดูตัวอย่าง die Post", "Post เป็นคำนามเพศหญิง"),
            check("L14-W-02", "ห้างสรรพสินค้าใช้ Artikel ใด?", ["der", "die", "das"], "das", "ดูตัวอย่าง das Kaufhaus", "Kaufhaus เป็นคำนามเพศกลาง"),
          ],
          application: "เลือกสถานที่สามแห่งจากแผนที่แล้วพูดชื่อพร้อม Artikel",
          summary: ["จำคำนามพร้อม Artikel", "Zentrum และ Stadtmitte เป็นคำเรียกใจกลางเมือง", "ใช้แผนที่ช่วยจัดกลุ่มสถานที่"],
          sourceRefs: topicSources(14, "Bildlexikon"),
        }],
      },
      {
        category: "grammar",
        topics: [{
          id: "L14-wo-dativ-lokale-praepositionen",
          title: "Wo? + lokale Präpositionen + Dativ",
          outcome: "บอกตำแหน่งด้วยคำบุพบทและ Artikel Dativ ได้",
          context: "ดูจุดบนแผนที่เทียบกับอาคาร แล้วบอกว่าสิ่งนั้นอยู่ที่ใด",
          examples: [
            { german: "vor dem Kaufhaus", thai: "หน้าห้างสรรพสินค้า", focus: "dem" },
            { german: "neben der Ampel", thai: "ข้างไฟจราจร", focus: "der" },
            { german: "zwischen dem Bahnhof und dem Kaufhaus", thai: "ระหว่างสถานีกับห้าง", focus: "zwischen" },
            { german: "in dem Kaufhaus → im Kaufhaus", thai: "ในห้าง", focus: "im" },
          ],
          rule: "คำถาม Wo? ถามตำแหน่งและใช้ Dativ หลังคำบุพบทตำแหน่งที่เรียน; dem ใช้กับ der/das, der ใช้กับ die, den ใช้กับพหูพจน์ตามรูปแบบในตาราง บางวลีหด in dem เป็น im และ an dem เป็น am",
          guidedChecks: [
            check("L14-G-01", "Die Bank ist neben ___ Apotheke. (die)", ["dem", "der", "den"], "der", "Apotheke เป็น die Apotheke", "Dativ เพศหญิงใช้ der"),
            check("L14-G-02", "Der Bahnhof ist vor ___ Kaufhaus. (das)", ["dem", "der", "den"], "dem", "Kaufhaus เป็น das Kaufhaus", "Dativ เพศกลางใช้ dem"),
          ],
          application: "เลือกจุดหนึ่งบนแผนที่แล้วบอกตำแหน่งเทียบกับสถานที่ข้างเคียง",
          summary: ["Wo? ใช้ถามตำแหน่ง", "ใช้ Dativ หลังคำบุพบทตำแหน่งในหัวข้อนี้", "จำรูป dem/der/den และคำย่อ im/am"],
          sourceRefs: topicSources(14, "4a–4b"),
        }],
      },
      {
        category: "phrases",
        topics: [{
          id: "L14-nach-dem-weg-fragen",
          title: "Nach dem Weg fragen und den Weg beschreiben",
          outcome: "เลือกสำนวนถามทาง บอกทาง และขอบคุณตามสถานการณ์ได้",
          context: "ผู้เดินทางต้องการหาไปรษณีย์ และผู้รู้ทางอธิบายเส้นทางอย่างสุภาพ",
          examples: [
            { german: "Entschuldigung. Können Sie mir helfen?", thai: "ขอโทษครับ/ค่ะ ช่วยฉันได้ไหม" },
            { german: "Wo ist die Post?", thai: "ไปรษณีย์อยู่ที่ไหน" },
            { german: "Gehen Sie hier geradeaus.", thai: "เดินตรงไปทางนี้" },
            { german: "Vielen Dank.", thai: "ขอบคุณมาก" },
          ],
          rule: "แยกประโยคตามหน้าที่: ถามทาง บอกทาง ไม่รู้ทาง และขอบคุณ ใช้ Sie เมื่อต้องการพูดสุภาพ",
          guidedChecks: [
            check("L14-R-01", "ต้องการขอความช่วยเหลืออย่างสุภาพ ควรพูดว่าอะไร?", ["Können Sie mir helfen?", "Gehen Sie nach links.", "Das weiß ich nicht."], "Können Sie mir helfen?", "เลือกประโยคที่เป็นคำขอ", "Können Sie mir helfen? ใช้ขอความช่วยเหลือ"),
            check("L14-R-02", "หลังได้รับคำบอกทาง ควรตอบว่าอะไร?", ["Vielen Dank.", "Wo ist die Post?", "Gehen Sie geradeaus."], "Vielen Dank.", "เลือกคำขอบคุณ", "Vielen Dank. ใช้กล่าวขอบคุณ"),
          ],
          application: "จัดบทสนทนาสั้นโดยเริ่มถามทางและจบด้วยการขอบคุณ",
          summary: ["ใช้ Entschuldigung เพื่อเริ่มถามอย่างสุภาพ", "ใช้ geradeaus/rechts/links เพื่อบอกทาง", "ขอบคุณด้วย Vielen Dank หรือ Herzlichen Dank"],
          sourceRefs: topicSources(16, "6a"),
        }],
      },
      {
        category: "listening",
        topics: [{
          id: "L14-weg-hoeren",
          title: "Hören und den Weg finden",
          outcome: "ฟังคำบอกทางแล้วเรียงจุดผ่านไปยังจุดหมายได้",
          context: "ฟังเสียงสังเคราะห์ที่แต่งใหม่ แล้วตามเส้นทางบนแผนที่จำลอง",
          examples: [
            { german: "Gehen Sie geradeaus.", thai: "เดินตรงไป" },
            { german: "An der Ampel gehen Sie nach links.", thai: "ที่ไฟจราจรให้เลี้ยวซ้าย" },
          ],
          rule: "ฟังคำบอกทางทีละช่วง จับจุดสังเกตและทิศทาง แล้วตรวจเส้นทางตามลำดับ ไม่แสดงบทถอดเสียงก่อนตอบ",
          guidedChecks: [
            check("L14-H-01", "ในคำบอกทางที่ได้ยิน ให้เดินตรงหรือเลี้ยว?", ["ตรงไป", "เลี้ยวซ้าย", "เลี้ยวขวา"], "ตรงไป", "ฟังคำต้นประโยค", "เสียงเริ่มด้วย Gehen Sie geradeaus."),
            check("L14-H-02", "จุดสังเกตใดอยู่ก่อนคำสั่งเลี้ยว?", ["ไฟจราจร", "สถานีตำรวจ", "โรงพยาบาล"], "ไฟจราจร", "ฟังคำว่า Ampel", "An der Ampel คือที่ไฟจราจร"),
          ],
          application: "ฟังเส้นทางอีกครั้ง แล้วแตะจุดผ่านตามลำดับที่ได้ยิน",
          summary: ["เสียงฝึกแต่งใหม่และระบุว่าเป็นเสียงสังเคราะห์", "ฟัง landmark ก่อนเลือกเส้นทาง", "หากไม่มีเสียงที่เล่นได้ จะไม่บันทึกคะแนน Hören"],
          sourceRefs: topicSources(14, "3a"),
        }],
      },
      {
        category: "speaking",
        topics: [{
          id: "L14-weg-sprechen",
          title: "Nach dem Weg fragen",
          outcome: "ถามทางและตอบกลับสั้น ๆ ด้วยสำนวนสุภาพได้",
          context: "สวมบทบาทเป็นผู้เดินทางและคนในพื้นที่ ใช้แผนที่เดียวกัน",
          examples: [
            { german: "Entschuldigung, wo ist die Post?", thai: "ขอโทษครับ/ค่ะ ไปรษณีย์อยู่ที่ไหน" },
            { german: "Gehen Sie geradeaus und dann nach rechts.", thai: "เดินตรงไปแล้วเลี้ยวขวา" },
          ],
          rule: "เริ่มด้วยคำขอสุภาพ บอกจุดหมาย และใช้ landmark กับทิศทางในคำตอบ",
          guidedChecks: [
            check("L14-S-01", "เลือกคำขึ้นต้นสำหรับถามคนที่ไม่รู้จัก", ["Entschuldigung ...", "Du bist ...", "Ich danke ..."], "Entschuldigung ...", "ใช้คำสุภาพเพื่อเรียกความสนใจ", "Entschuldigung ใช้เริ่มถามคนแปลกหน้าได้"),
            check("L14-S-02", "เลือกคำตอบที่บอกทิศทาง", ["Gehen Sie geradeaus.", "Ich suche die Post.", "Vielen Dank."], "Gehen Sie geradeaus.", "มองหาคำสั่งการเดิน", "Gehen Sie geradeaus. เป็นคำบอกทาง"),
          ],
          application: "พูดถามทางและตอบ 2–4 เทิร์น อัดเสียงในเครื่องหรือใช้แบบประเมินตนเอง",
          summary: ["ถามด้วยรูปสุภาพ Sie", "บอกทางเป็นช่วงสั้น ๆ", "ไมโครโฟนเป็นตัวเลือกและเสียงไม่ถูกอัปโหลด"],
          sourceRefs: topicSources(16, "6b"),
        }],
      },
      {
        category: "reading",
        topics: [{
          id: "L14-weg-lesen",
          title: "Eine Wegbeschreibung lesen",
          outcome: "อ่านคำบอกทางใหม่และหาเส้นทางพร้อมหลักฐานในข้อความได้",
          context: "อ่านคำบอกทางสั้นที่แต่งใหม่จากสวนไปยังไปรษณีย์",
          examples: [
            { german: "Gehen Sie bis zur Ampel. Dort gehen Sie nach links. Die Post ist neben der Bank.", thai: "เดินไปจนถึงไฟจราจร แล้วเลี้ยวซ้าย ไปรษณีย์อยู่ข้างธนาคาร" },
          ],
          rule: "ทำเครื่องหมายจุดเริ่ม จุดสังเกต ทิศทาง และจุดหมาย จากนั้นย้อนอ่านข้อความเพื่อหาหลักฐาน",
          guidedChecks: [
            check("L14-L-01", "หลังถึง Ampel ให้ไปทางใด?", ["ซ้าย", "ขวา", "ตรงต่อไป"], "ซ้าย", "หา nach ... ในประโยคที่สอง", "ข้อความระบุ nach links"),
            check("L14-L-02", "ไปรษณีย์อยู่ตรงไหนเมื่อเทียบกับธนาคาร?", ["ข้างธนาคาร", "หลังโรงพยาบาล", "ในสถานี"], "ข้างธนาคาร", "หา neben der Bank", "ข้อความระบุ neben der Bank"),
          ],
          application: "เลือกเส้นทางบนแผนที่และชี้ประโยคที่ยืนยันจุดหมาย",
          summary: ["อ่านคำบอกทางตามลำดับ", "แยกตำแหน่งออกจากทิศทาง", "ยืนยันคำตอบด้วยข้อความ"],
          sourceRefs: topicSources(15, "5"),
        }],
      },
      {
        category: "writing",
        topics: [{
          id: "L14-weg-schreiben",
          title: "Einen Weg beschreiben",
          outcome: "เขียนคำบอกทาง 2–3 ขั้นจากแผนที่ได้",
          context: "วางแผนจุดเริ่ม จุดสังเกต ทิศทาง และปลายทางก่อนเรียบเรียงข้อความ",
          examples: [
            { german: "Gehen Sie geradeaus bis zur Ampel.", thai: "เดินตรงไปจนถึงไฟจราจร" },
            { german: "Dann gehen Sie nach rechts. Die Bank ist neben der Post.", thai: "จากนั้นเลี้ยวขวา ธนาคารอยู่ข้างไปรษณีย์" },
          ],
          rule: "เขียนคำสั่งตามลำดับ ใช้ dann เชื่อมขั้นตอน และตรวจว่าเส้นทางตรงกับแผนที่",
          guidedChecks: [
            check("L14-WR-01", "คำใดช่วยเชื่อมขั้นตอนถัดไป?", ["Dann", "weil", "gestern"], "Dann", "หาคำที่ใช้เรียงขั้นตอน", "Dann หมายถึงจากนั้น"),
            check("L14-WR-02", "ประโยคใดบอกตำแหน่งปลายทาง?", ["Die Bank ist neben der Post.", "Ich danke dir.", "Es gibt einen Park."], "Die Bank ist neben der Post.", "หา neben เพื่อระบุตำแหน่ง", "ประโยคนี้บอกตำแหน่งของธนาคาร"),
          ],
          application: "เขียนคำบอกทางไปยังไปรษณีย์หรือธนาคารอย่างน้อย 3 ขั้น",
          summary: ["เรียงคำสั่งตามเส้นทาง", "ใช้ landmark ที่เห็นบนแผนที่", "ตรวจตำแหน่งและ Artikel Dativ"],
          sourceRefs: topicSources(16, "6a–6b"),
        }],
      },
    ],
  },
] as const satisfies readonly CourseLessonCurriculum[];

export function validateCourseRegistry(): string[] {
  const errors: string[] = [];
  const expectedCounts: Record<CourseCategory, number> = {
    vocabulary: 10,
    grammar: 9,
    phrases: 5,
    listening: 5,
    reading: 4,
    writing: 5,
    speaking: 4,
  };
  const ids = new Set<string>();
  const allowedSources = new Set<SourceId>([
    "momente-kursbuch-a12",
    "user-crossword",
    "original",
  ]);
  const counts = new Map<CourseCategory, number>();

  for (const pattern of courseExercisePatterns) {
    if (ids.has(pattern.id)) errors.push(`duplicate pattern ${pattern.id}`);
    ids.add(pattern.id);
    counts.set(pattern.category, (counts.get(pattern.category) ?? 0) + 1);
    if (pattern.minDifficulty > pattern.maxDifficulty)
      errors.push(`invalid difficulty range ${pattern.id}`);
    if (!pattern.sourceRefs.some((source) => source.sourceId === "original" && source.relation === "original_practice"))
      errors.push(`missing original-practice provenance ${pattern.id}`);
    for (const source of pattern.sourceRefs) {
      if (!allowedSources.has(source.sourceId))
        errors.push(`unavailable source cited by ${pattern.id}: ${source.sourceId}`);
      if (source.sourceId === "momente-kursbuch-a12" && source.printedPage !== undefined && ![9, 10, 11, 12, 13, 14, 15, 16, 25, 26].includes(source.printedPage))
        errors.push(`out-of-scope Kursbuch page ${pattern.id}: ${source.printedPage}`);
    }
  }

  if (courseExercisePatterns.length !== 42)
    errors.push(`expected 42 exercise patterns, found ${courseExercisePatterns.length}`);
  for (const category of courseCategories) {
    if ((counts.get(category.id) ?? 0) !== expectedCounts[category.id])
      errors.push(`unexpected pattern count for ${category.id}`);
  }
  if (new Set(courseAssets.map((asset) => asset.id)).size !== courseAssets.length)
    errors.push("duplicate course asset id");
  return errors;
}

export function validateCurriculum(): string[] {
  const errors: string[] = [];
  const lessonIds = new Set<string>();
  const topicIds = new Set<string>();
  const checkIds = new Set<string>();
  const expectedCategories = new Set(courseCategories.map((category) => category.id));
  const allowedSources = new Set<SourceId>([
    "momente-kursbuch-a12",
    "user-crossword",
    "original",
  ]);

  for (const lesson of l13L14Curriculum) {
    if (lessonIds.has(lesson.id)) errors.push(`duplicate lesson ${lesson.id}`);
    lessonIds.add(lesson.id);
    const seenCategories = new Set<CourseCategory>();
    for (const categoryPlan of lesson.categories) {
      if (seenCategories.has(categoryPlan.category))
        errors.push(`duplicate category ${lesson.id}/${categoryPlan.category}`);
      seenCategories.add(categoryPlan.category);
      if (!categoryPlan.topics.length)
        errors.push(`empty category ${lesson.id}/${categoryPlan.category}`);
      for (const topic of categoryPlan.topics) {
        if (topicIds.has(topic.id)) errors.push(`duplicate topic ${topic.id}`);
        topicIds.add(topic.id);
        if (topic.guidedChecks.length < 2)
          errors.push(`too few guided checks ${topic.id}`);
        if (topic.summary.length !== 3)
          errors.push(`invalid summary length ${topic.id}`);
        for (const guidedCheck of topic.guidedChecks) {
          if (checkIds.has(guidedCheck.id))
            errors.push(`duplicate guided check ${guidedCheck.id}`);
          checkIds.add(guidedCheck.id);
          if (!guidedCheck.choices.includes(guidedCheck.answer))
            errors.push(`answer not present in choices ${guidedCheck.id}`);
          if (new Set(guidedCheck.choices).size !== guidedCheck.choices.length)
            errors.push(`duplicate choices ${guidedCheck.id}`);
        }
        for (const source of topic.sourceRefs) {
          if (!allowedSources.has(source.sourceId))
            errors.push(`unavailable source cited by ${topic.id}: ${source.sourceId}`);
          if (source.sourceId === "momente-kursbuch-a12" && source.printedPage !== undefined && ![9, 10, 11, 12, 13, 14, 15, 16, 25, 26].includes(source.printedPage))
            errors.push(`out-of-scope Kursbuch page ${topic.id}: ${source.printedPage}`);
        }
      }
    }
    if (seenCategories.size !== expectedCategories.size ||
        [...expectedCategories].some((category) => !seenCategories.has(category)))
      errors.push(`lesson missing category: ${lesson.id}`);
  }
  for (const id of ["L13", "L14"])
    if (!lessonIds.has(id)) errors.push(`missing required lesson ${id}`);
  return errors;
}


const supplementalCompetencyLabels: Readonly<Record<string,string>> = {
  "grammar.dative-verbs": "ผันกริยาที่ใช้ Dativ",
  "grammar.local-prepositions": "บอกตำแหน่งด้วย Dativ",
  "reading.noticing": "สังเกตรูปคำในข้อความ",
  "reading.visual": "อ่านผังและจุดอ้างอิง",
  "vocabulary.retrieval": "ดึงคำศัพท์จากความจำ",
  "vocabulary.recognition": "จำแนกคำศัพท์",
  "vocabulary.context": "ใช้คำศัพท์ในบริบท",
  "vocabulary.spelling": "สังเกตการสะกดคำ",
  "visual.discrimination": "สังเกตตัวอักษรในตาราง",
  "reading.context": "อ่านจับความหมายในบริบท",
  "grammar.dative": "ใช้รูป Dativ",
  "phrases.directions": "ใช้สำนวนบอกทาง",
};
export function courseCompetencyLabel(competency:string):string {
  return supplementalCompetencyLabels[competency] ?? competency.replaceAll("."," · ");
}

export const learningStageLabels = {
 recognition:"1 · จำแนกคำตอบ",
 guided_recall:"2 · ตอบโดยมีตัวช่วย",
 controlled_production:"3 · เติมหรือสร้างรูปคำ",
 independent_recall:"4 · ตอบเองโดยไม่มีตัวเลือก",
 contextual_application:"5 · ใช้ความรู้ในบริบท",
} as const;
