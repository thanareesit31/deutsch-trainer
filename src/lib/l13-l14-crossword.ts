import presetData from "@/data/l14-crossword-preset.json";

export type CrosswordEntry = {
  number: number;
  answer: string;
  direction: "across" | "down";
  row: number;
  col: number;
  clue: { imageAssetId: string; altText: string; hintTh: string };
  vocabularyId: string;
  sourceRefs: readonly string[];
};
export type CrosswordPreset = {
  id: string;
  lessonId: "L14";
  title: string;
  gridWidth: number;
  gridHeight: number;
  coordinateSystem: "zero-based-row-col";
  entries: readonly CrosswordEntry[];
};
export type CrosswordCell = { row: number; col: number; value: string; entries: number[]; number?: number };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);
function isCrosswordPreset(value: unknown): value is CrosswordPreset {
  if (!isRecord(value) || !Array.isArray(value.entries)) return false;
  if (value.lessonId !== "L14" || value.coordinateSystem !== "zero-based-row-col" ||
      typeof value.id !== "string" || typeof value.title !== "string" ||
      !Number.isInteger(value.gridWidth) || !Number.isInteger(value.gridHeight)) return false;
  return value.entries.every((entry) => {
    if (!isRecord(entry) || !isRecord(entry.clue)) return false;
    return Number.isInteger(entry.number) && typeof entry.answer === "string" &&
      (entry.direction === "across" || entry.direction === "down") &&
      Number.isInteger(entry.row) && Number.isInteger(entry.col) &&
      typeof entry.vocabularyId === "string" &&
      typeof entry.clue.imageAssetId === "string" && typeof entry.clue.altText === "string" &&
      typeof entry.clue.hintTh === "string" && Array.isArray(entry.sourceRefs) &&
      entry.sourceRefs.every((source) => typeof source === "string");
  });
}

const imported: unknown = presetData;
if (!isCrosswordPreset(imported)) throw new Error("Invalid L14 crossword preset");
export const l14CrosswordPreset = imported;
const assetByImage: Readonly<Record<string, string>> = {
  "city/polizei.svg": "l14-polizei",
  "city/post.svg": "l14-post",
  "city/ampel.svg": "l14-ampel",
  "city/zentrum.svg": "l14-zentrum",
  "city/bank.svg": "l14-bank",
};
export const crosswordEntries = l14CrosswordPreset.entries.map((entry) => ({
  ...entry,
  assetId: assetByImage[entry.clue.imageAssetId] ?? "",
  clue: entry.clue.hintTh,
}));

export function buildCrosswordGrid(preset: CrosswordPreset = l14CrosswordPreset) {
  const errors: string[] = [];
  const cells = new Map<string, CrosswordCell>();
  const answerSet = new Set<number>();
  for (const entry of preset.entries) {
    if (answerSet.has(entry.number)) errors.push(`duplicate clue number ${entry.number}`);
    answerSet.add(entry.number);
    const characters = [...entry.answer.normalize("NFC").toLocaleUpperCase("de-DE")];
    if (!characters.length) errors.push(`empty answer ${entry.number}`);
    characters.forEach((letter, index) => {
      const row = entry.row + (entry.direction === "down" ? index : 0);
      const col = entry.col + (entry.direction === "across" ? index : 0);
      if (row < 0 || col < 0 || row >= preset.gridHeight || col >= preset.gridWidth) {
        errors.push(`entry ${entry.number} exceeds grid at ${row},${col}`);
        return;
      }
      const key = `${row}:${col}`;
      const cell = cells.get(key) ?? { row, col, value: "", entries: [] };
      if (cell.value && cell.value !== letter) errors.push(`crossing mismatch at ${row},${col}`);
      cell.value = letter;
      cell.entries.push(entry.number);
      if (index === 0) cell.number = entry.number;
      cells.set(key, cell);
    });
  }
  const intersections = [...cells.values()].filter((cell) => cell.entries.length > 1).length;
  if (intersections < 1) errors.push("puzzle has no intersections");
  for (const entry of preset.entries) if (!assetByImage[entry.clue.imageAssetId]) errors.push(`missing clue illustration mapping ${entry.number}`);
  return { cells: [...cells.values()], errors, intersections };
}
