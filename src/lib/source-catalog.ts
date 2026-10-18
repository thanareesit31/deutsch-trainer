import arbeitsbuchInventory from "../data/momente-arbeitsbuch-inventory.json";
/** Document identity is independent of the application's course-level labels. */
export const sourceCatalog = {
  MOMENTE_A1_1_AB: { title: "MOMENTE A1.1 Arbeitsbuch", kind: "book", filename: "แบบฝึกหัด Momente A1.1  บท1-12.pdf", pdfPageCount: 123, sha256: "fa0e7a5724dd3d7d1fcf5ba2c01c0c7bea84a756314c2389be3db917d60cdacf" },
  MOMENTE_A1_2_AB: { title: "MOMENTE A1.2 Arbeitsbuch", kind: "book", filename: "แบบฝึกหัด Momente A1.2 บท 13-24.pdf", pdfPageCount: 123, sha256: "d16bc4194ba8d4874a85b3597b0fddc61f94e6235625f41053322e74d9f69079" },
  MOMENTE_A1_1_KB: { title: "MOMENTE A1.1 Kursbuch", kind: "book", filename: null, pdfPageCount: null, sha256: null },
  MOMENTE_A1_2_KB: { title: "MOMENTE A1 Kursbuch, Lektionen 13–24", kind: "book", filename: "หนังสือเรียน Moment A1 Lektion 13-24.pdf", pdfPageCount: 108, sha256: "c8c643d98a3845bb29f73480b09c94ec8d86121772d33a36d93c422527d99fdf" },
  GRAMMATIK_AKTIV_A1_B1: { title: "Grammatik aktiv A1–B1, 2. aktualisierte Ausgabe", kind: "book", filename: "Grammatik aktiv A1-B1 [2. aktualisierte Ausgabe].pdf", pdfPageCount: 256, sha256: "de53e61b8c9ce6e0c3cfb1b1cb01aea2a9fc6256c6cc40e5eec1d4c353a278a8" },
  WORTSCHATZ_A1_TRAINING: { title: "Wortschatz A1 – das Training", kind: "book", filename: "Wortschatz_A1_das_Training.pdf", pdfPageCount: 79, sha256: "409895abb257324f4aa7ddb9519055e7730755da681136af56452254367f7ddd" },
  SHEET_L13: { title: "ชีท Lektion 13", kind: "book", filename: "ชีท Lektion 13.pdf", pdfPageCount: null, sha256: null },
  DEUTSCH_TRAINER_ORIGINAL: { title: "Deutsch Trainer original web content", kind: "repository", filename: null, pdfPageCount: null, sha256: null },
  USER_L14_CROSSWORD_PRESET: { title: "User-provided L14 crossword layout", kind: "repository", filename: "l14-crossword-preset.json", pdfPageCount: null, sha256: null },
} as const;

export type RegisteredSourceId = keyof typeof sourceCatalog;
export function isRegisteredSourceId(value: unknown): value is RegisteredSourceId {
  return typeof value === "string" && Object.hasOwn(sourceCatalog, value);
}

export type SourceEvidence = {
  id: string;
  sourceId: RegisteredSourceId;
  printedPage: number | null;
  pdfPage: number | null;
  originalActivityId: string | null;
  inspectedAt: string;
  method: "visual_pdf" | "repository_inspection";
  note: string;
};

const pdfEvidence = (id: string, sourceId: RegisteredSourceId, printedPage: number, pdfPage: number, originalActivityId: string, note: string): SourceEvidence => ({
  id, sourceId, printedPage, pdfPage, originalActivityId, inspectedAt: "2026-10-16", method: "visual_pdf", note,
});

/** Only individually inspected pages are listed. No global page-offset rule is assumed. */
export const sourceEvidence: readonly SourceEvidence[] = [
  { ...pdfEvidence("AB11-OPEN-L01", "MOMENTE_A1_1_AB", 6, 5, "L01/1a", "Interior page opened visually: dialogue completion, conversation ordering and listening table. Identity confirmation only; no protected L01 activity changed."), inspectedAt:"2026-10-17" },
  ...arbeitsbuchInventory.map((entry):SourceEvidence => ({
    id:entry.evidenceId, sourceId:"MOMENTE_A1_2_AB", printedPage:entry.printedPage, pdfPage:entry.pdfPage,
    originalActivityId:entry.originalActivityId, inspectedAt:"2026-10-17", method:"visual_pdf",
    note:`${entry.title}: ${entry.instruction}. Inventory documents source mechanics; no claim to have heard missing original audio.`,
  })),
  ...arbeitsbuchInventory.flatMap(entry => (entry.additionalEvidencePages ?? []).map((extra):SourceEvidence => ({
    id:`${entry.evidenceId}-scene`,sourceId:"MOMENTE_A1_2_AB",printedPage:extra.printedPage,pdfPage:extra.pdfPage,
    originalActivityId:entry.originalActivityId,inspectedAt:"2026-10-17",method:"visual_pdf",note:extra.purpose,
  }))),
  pdfEvidence("KB13-VOC-10", "MOMENTE_A1_2_KB", 10, 10, "Bildlexikon", "Page number and city-place picture vocabulary visually checked."),
  pdfEvidence("KB13-VOC-11", "MOMENTE_A1_2_KB", 11, 11, "Bildlexikon", "Additional city-place vocabulary at the bottom of the page."),
  pdfEvidence("KB13-G4", "MOMENTE_A1_2_KB", 11, 11, "4", "Ihr Kursort: es gibt + Akkusativ, including negative forms."),
  pdfEvidence("KB13-G5A", "MOMENTE_A1_2_KB", 11, 11, "5a", "Dativpronomen table, reference arrows, and verbs danken/helfen/gehören."),
  pdfEvidence("KB13-G5B", "MOMENTE_A1_2_KB", 11, 11, "5b", "Pair activity evaluating places with gefallen."),
  pdfEvidence("KB13-G6A", "MOMENTE_A1_2_KB", 11, 11, "6a", "Planning notes about a Lieblingsort."),
  pdfEvidence("KB13-G6B", "MOMENTE_A1_2_KB", 12, 12, "6b", "Writing a Lieblingsort text; the activity continues from page 11."),
  pdfEvidence("KB13-G3A", "MOMENTE_A1_2_KB", 10, 10, "3a", "Read a blog/comments and match headings."),
  pdfEvidence("KB13-G3B", "MOMENTE_A1_2_KB", 10, 10, "3b", "Read again and correct statements about the text."),
  pdfEvidence("KB13-ST-G", "MOMENTE_A1_2_KB", 12, 12, "Schnelltest G", "Rewrite sentences using gehören, gefallen or danken."),
  pdfEvidence("KB13-ST-W", "MOMENTE_A1_2_KB", 12, 12, "Schnelltest W", "Assemble city-place words from word parts."),
  pdfEvidence("KB14-VOC-14", "MOMENTE_A1_2_KB", 14, 14, "Bildlexikon", "Institution vocabulary."),
  pdfEvidence("KB14-VOC-15", "MOMENTE_A1_2_KB", 15, 15, "Bildlexikon", "Places, roads and street features."),
  pdfEvidence("KB14-G3A", "MOMENTE_A1_2_KB", 14, 14, "3a", "Listen and draw a route in a plan. Original audio/transcript not inferred."),
  pdfEvidence("KB14-G4A", "MOMENTE_A1_2_KB", 14, 14, "4a", "Spatial pictures and preposition cloze."),
  pdfEvidence("KB14-G4B", "MOMENTE_A1_2_KB", 15, 15, "4b", "Wo? + Dativ table and im/am contractions."),
  pdfEvidence("KB14-G5A", "MOMENTE_A1_2_KB", 15, 15, "5a", "A numbered city plan and place-name completion. This is not a reading-route task."),
  pdfEvidence("KB14-G6A", "MOMENTE_A1_2_KB", 16, 16, "6a", "Classify phrases by communicative function."),
  pdfEvidence("KB14-G6B", "MOMENTE_A1_2_KB", 16, 16, "6b", "Pair work asking for and giving directions."),
  pdfEvidence("KB14-ST-K", "MOMENTE_A1_2_KB", 16, 16, "Schnelltest K", "Order conversation turns."),
  pdfEvidence("GA-DAT-48", "GRAMMATIK_AKTIV_A1_B1", 48, 44, "18/1", "Dativ table and picture-based definite-article cloze."),
  pdfEvidence("GA-PRON-54", "GRAMMATIK_AKTIV_A1_B1", 54, 50, "21/3", "Dativ personal-pronoun cloze. Printed 54 is PDF 50 in this file."),
  pdfEvidence("GA-VERB-58", "GRAMMATIK_AKTIV_A1_B1", 58, 54, "23/1–2", "Dativ semantic-role diagrams and sentence construction."),
  pdfEvidence("GA-PREP-86", "GRAMMATIK_AKTIV_A1_B1", 86, 82, "35/1", "Picture-based spatial-preposition completion; Wo? + Dativ and im/am explanation."),
  pdfEvidence("GA-WO-92", "GRAMMATIK_AKTIV_A1_B1", 92, 88, "38/1", "Local Wo? table and preposition completion. Content beyond L14 is not automatically included."),
  pdfEvidence("WS-CROSS-33", "WORTSCHATZ_A1_TRAINING", 33, 32, "B6/8", "Hotel crossword with shared letter cells; analogous mechanic, not city content."),
  pdfEvidence("WS-SORT-36", "WORTSCHATZ_A1_TRAINING", 36, 35, "B7/3", "Assign food words to table categories; analogous classification mechanic."),
  { ...pdfEvidence("WS-CONTEXT-37", "WORTSCHATZ_A1_TRAINING", 37, 36, "B7/4", "Visually checked connected dialogue with shared word bank and multiple blanks. Web adapts the mechanic using city content."), inspectedAt: "2026-10-17" },
  pdfEvidence("WS-SEARCH-48", "WORTSCHATZ_A1_TRAINING", 48, 47, "B9/4", "Find words in a letter grid. This does not validate the current multi-select VOC-09 implementation."),
  { id: "WEB-AUTHORED", sourceId: "DEUTSCH_TRAINER_ORIGINAL", printedPage: null, pdfPage: null, originalActivityId: null, inspectedAt: "2026-10-16", method: "repository_inspection", note: "L13/L14 examples and practice prompts in src/lib/l13-l14-course.ts and l13-l14-course-exercises.ts are newly authored for this project." },
  { id: "USER-CROSSWORD", sourceId: "USER_L14_CROSSWORD_PRESET", printedPage: null, pdfPage: null, originalActivityId: null, inspectedAt: "2026-10-16", method: "repository_inspection", note: "Coordinate layout in src/data/l14-crossword-preset.json; images are project assets." },
];
