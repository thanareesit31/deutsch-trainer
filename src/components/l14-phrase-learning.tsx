"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Volume2 } from "lucide-react";
import { articleColors } from "@/lib/profession-learning";
import { useVocabularyAudio } from "./vocabulary-audio";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { clearLastLessonPageRequest, isLastLessonPageRequested } from "@/lib/test-workspace-last-page";

const groups = [
  { id: "ask", german: "Nach dem Weg fragen", thai: "ถามทาง" },
  { id: "describe", german: "Den Weg beschreiben", thai: "บอกทาง" },
  { id: "unknown", german: "Den Weg nicht kennen", thai: "บอกว่าไม่รู้ทาง" },
  { id: "thanks", german: "Sich bedanken", thai: "ขอบคุณ" },
] as const;
type GroupId = (typeof groups)[number]["id"];
type CheckResult = "correct" | "wrong";
const thankYouOptions = [
  { german: "Herzlichen Dank.", thai: "ขอบคุณมาก" },
  { german: "Sehr nett. Vielen Dank.", thai: "ใจดีมาก ขอบคุณมาก" },
  { german: "Oh, danke schön.", thai: "อ๋อ ขอบคุณมาก" },
] as const;
type ThankYouLine = (typeof thankYouOptions)[number]["german"];
const isThankYouLine = (value: unknown): value is ThankYouLine =>
  typeof value === "string" && thankYouOptions.some((option) => option.german === value);

const phrases: readonly { id: string; text: string; thai: string; spoken: string; group: GroupId }[] = [
  { id: "ask-help", text: "Entschuldigung. Können Sie mir helfen?", thai: "ขอโทษครับ/ค่ะ ช่วยฉันหน่อยได้ไหม", spoken: "Entschuldigung. Können Sie mir helfen?", group: "ask" },
  { id: "thanks-heart", text: "Herzlichen Dank.", thai: "ขอบคุณมาก", spoken: "Herzlichen Dank.", group: "thanks" },
  { id: "describe-straight", text: "Sie gehen / fahren hier geradeaus.", thai: "เดินหรือขับตรงไปจากตรงนี้", spoken: "Sie gehen hier geradeaus.", group: "describe" },
  { id: "unknown-local", text: "Tut mir leid. Ich bin nicht von hier.", thai: "ขอโทษ ฉันไม่ใช่คนแถวนี้", spoken: "Tut mir leid. Ich bin nicht von hier.", group: "unknown" },
  { id: "ask-place", text: "Wo ist denn hier ein / eine …?", thai: "แถวนี้มี...อยู่ที่ไหน", spoken: "Wo ist denn hier eine Bank?", group: "ask" },
  { id: "describe-see", text: "Da sehen Sie einen / ein / eine …", thai: "ตรงนั้นคุณจะเห็น...", spoken: "Da sehen Sie eine Bank.", group: "describe" },
  { id: "thanks-kind", text: "Sehr nett. Vielen Dank.", thai: "ใจดีมาก ขอบคุณมาก", spoken: "Sehr nett. Vielen Dank.", group: "thanks" },
  { id: "ask-far", text: "Ist das sehr weit?", thai: "ไกลมากไหม", spoken: "Ist das sehr weit?", group: "ask" },
  { id: "unknown-answer", text: "Das weiß ich leider nicht.", thai: "ขอโทษ ฉันไม่รู้เรื่องนั้น", spoken: "Das weiß ich leider nicht.", group: "unknown" },
  { id: "describe-turn", text: "Vor … biegen Sie nach rechts / links ab.", thai: "เลี้ยวขวาหรือซ้ายก่อนถึง...", spoken: "Vor der Bank biegen Sie nach rechts ab.", group: "describe" },
  { id: "ask-search", text: "Eine Frage bitte: Ich suche den / das / die …", thai: "ขอถามหน่อย ฉันกำลังหา...", spoken: "Eine Frage bitte: Ich suche die Post.", group: "ask" },
  { id: "describe-distance", text: "Das ist (gar nicht) weit.", thai: "ที่นั่นไกล หรือไม่ไกลเลย", spoken: "Das ist gar nicht weit.", group: "describe" },
  { id: "thanks-oh", text: "Oh, danke schön.", thai: "อ๋อ ขอบคุณมาก", spoken: "Oh, danke schön.", group: "thanks" },
  { id: "ask-walk", text: "Kann ich zu Fuß gehen?", thai: "ฉันเดินไปได้ไหม", spoken: "Kann ich zu Fuß gehen?", group: "ask" },
  { id: "describe-street", text: "Sie gehen die erste / zweite / dritte / vierte / fünfte Straße nach rechts / links.", thai: "เลี้ยวเข้าถนนสายที่หนึ่งถึงห้า ทางขวาหรือซ้าย", spoken: "Sie gehen die fünfte Straße nach links.", group: "describe" },
  { id: "unknown-new", text: "Ich bin fremd hier.", thai: "ฉันไม่คุ้นกับแถวนี้", spoken: "Ich bin fremd hier.", group: "unknown" },
  { id: "describe-direction", text: "… nach rechts / nach links.", thai: "ไปทางขวาหรือทางซ้าย", spoken: "Sie gehen nach rechts.", group: "describe" },
];

const secondHints: Record<GroupId, string> = {
  ask: "สังเกตว่าผู้พูดกำลังรอคำตอบจากอีกคน",
  describe: "สังเกตว่าผู้พูดให้ข้อมูลเส้นทางหรือระยะทาง",
  unknown: "สังเกตว่าผู้พูดไม่มีข้อมูลเส้นทางที่จะบอก",
  thanks: "สังเกตว่าผู้พูดตอบรับความช่วยเหลือ",
};

const places = [
  { id: "post", label: "die Post", thai: "ที่ทำการไปรษณีย์", article: "die", question: "Wo ist denn hier die Post?", destination: "die Post", walkDestination: "zur Post", roadNumber: 2, direction: "rechts", complex: true, far: true, turn: "Sie gehen die zweite Straße nach rechts. Folgen Sie der Straße um die Kurve. Da sehen Sie die Post.", turnThai: "เลี้ยวขวาเข้าถนนสายที่สอง แล้วเดินตามทางโค้ง จะเห็นที่ทำการไปรษณีย์", x: 88, y: 12, rx: 11, ry: 12, labelX: 88, labelY: 6, route: [[52, 97], [52, 54], [52, 34], [60, 32], [68, 32], [74, 29], [76, 24], [77, 21], [85, 23]] },
  { id: "bank", label: "die Bank", thai: "ธนาคาร", article: "die", question: "Wo ist denn hier eine Bank?", destination: "die Bank", walkDestination: "zur Bank", roadNumber: 1, direction: "rechts", complex: false, far: false, turn: "Sie gehen die erste Straße nach rechts. Da sehen Sie die Bank.", turnThai: "เลี้ยวขวาเข้าถนนสายแรก แล้วจะเห็นธนาคาร", x: 65, y: 43, rx: 12, ry: 13, labelX: 65, labelY: 36, route: [[52, 97], [52, 54], [60, 55], [66, 55]] },
  { id: "cafe", label: "das Café", thai: "คาเฟ่", article: "das", question: "Wo ist denn hier ein Café?", destination: "das Café", walkDestination: "zum Café", roadNumber: 2, direction: "links", complex: false, far: true, turn: "Sie gehen die zweite Straße nach links. Da sehen Sie das Café.", turnThai: "เลี้ยวซ้ายเข้าถนนสายที่สอง แล้วจะเห็นคาเฟ่", x: 36, y: 17, rx: 12, ry: 13, labelX: 36, labelY: 9, route: [[52, 97], [52, 54], [52, 34], [47, 32], [40, 30], [36, 28]] },
  { id: "bahnhof", label: "der Bahnhof", thai: "สถานีรถไฟ", article: "der", question: "Wo ist denn hier der Bahnhof?", destination: "den Bahnhof", walkDestination: "zum Bahnhof", roadNumber: 1, direction: "links", complex: true, far: true, turn: "Sie gehen die erste Straße nach links. Vor der Apotheke biegen Sie nach rechts ab. Folgen Sie der Straße bis zum Bahnhof.", turnThai: "เลี้ยวซ้ายเข้าถนนสายแรก ก่อนถึงร้านขายยาให้เลี้ยวขวา แล้วตามถนนไปจนถึงสถานีรถไฟ", x: 16, y: 12, rx: 16, ry: 12, labelX: 16, labelY: 5, route: [[52, 97], [52, 54], [44, 54], [37, 51], [31, 48], [30, 42], [30, 35], [28, 28], [24, 23], [20, 21]] },
  { id: "apotheke", label: "die Apotheke", thai: "ร้านขายยา", article: "die", question: "Wo ist denn hier eine Apotheke?", destination: "die Apotheke", walkDestination: "zur Apotheke", roadNumber: 1, direction: "links", complex: true, far: false, turn: "Sie gehen die erste Straße nach links. Dann gehen Sie an der nächsten Kreuzung geradeaus. Da sehen Sie die Apotheke.", turnThai: "เลี้ยวซ้ายเข้าถนนสายแรก แล้วตรงผ่านแยกถัดไป จะเห็นร้านขายยา", x: 18, y: 37, rx: 13, ry: 13, labelX: 18, labelY: 29, route: [[52, 97], [52, 54], [46, 54], [38, 51], [31, 48], [24, 49], [19, 49]] },
  { id: "bibliothek", label: "die Bibliothek", thai: "ห้องสมุด", article: "die", question: "Wo ist denn hier eine Bibliothek?", destination: "die Bibliothek", walkDestination: "zur Bibliothek", roadNumber: 2, direction: "rechts", complex: false, far: true, turn: "Sie gehen die zweite Straße nach rechts. Folgen Sie der Straße. Da sehen Sie die Bibliothek.", turnThai: "เลี้ยวขวาเข้าถนนสายที่สอง แล้วเดินตามถนนไป จะเห็นห้องสมุด", x: 89, y: 40, rx: 11, ry: 13, labelX: 89, labelY: 31, route: [[52, 97], [52, 54], [52, 34], [63, 32], [73, 30], [83, 28], [89, 29]] },
  { id: "kino", label: "das Kino", thai: "โรงหนัง", article: "das", question: "Wo ist denn hier ein Kino?", destination: "das Kino", walkDestination: "zum Kino", roadNumber: 1, direction: "rechts", complex: false, far: false, turn: "Sie gehen die erste Straße nach rechts. Folgen Sie der Straße. Da sehen Sie das Kino.", turnThai: "เลี้ยวขวาเข้าถนนสายแรก แล้วเดินตามถนนไป จะเห็นโรงหนัง", x: 88, y: 67, rx: 13, ry: 14, labelX: 88, labelY: 60, route: [[52, 97], [52, 54], [60, 55], [74, 56], [88, 55]] },
  { id: "park", label: "der Park", thai: "สวนสาธารณะ", article: "der", question: "Wo ist denn hier der Park?", destination: "den Park", walkDestination: "zum Park", roadNumber: 2, direction: "rechts", complex: false, far: true, turn: "Sie gehen die zweite Straße nach rechts. Da sehen Sie den Park.", turnThai: "เลี้ยวขวาเข้าถนนสายที่สอง แล้วจะเห็นสวนสาธารณะ", x: 61, y: 17, rx: 14, ry: 15, labelX: 61, labelY: 7, route: [[52, 97], [52, 54], [52, 34], [60, 32]] },
] as const;

const scenarios = [
  { kind: "help" },
  { kind: "search" },
  { kind: "where" },
  { kind: "walk" },
] as const;
type PlaceId = (typeof places)[number]["id"];
const placeById = new Map<PlaceId, (typeof places)[number]>(places.map((place) => [place.id, place]));

function drawScenarioPlaces(): PlaceId[] {
  const ids: PlaceId[] = places.map((place) => place.id);
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const shuffled = [...ids];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    const chosen = shuffled.slice(0, scenarios.length);
    const selected = chosen.filter((_, index) => scenarios[index].kind !== "where").map((id) => placeById.get(id)!);
    if (selected.some((place) => place.direction === "links") && selected.some((place) => place.direction === "rechts")
      && selected.some((place) => place.roadNumber === 1) && selected.some((place) => place.roadNumber === 2)
      && selected.some((place) => place.complex)) return chosen;
  }
  return ["post", "bank", "cafe", "bahnhof"];
}

type PhraseProgress = {
  version: 14;
  tab: "sort" | "context";
  placed: Record<string, GroupId>;
  selected: string | null;
  results: Record<string, CheckResult>;
  misses: Record<string, number>;
  solved: Record<string, boolean>;
  flipped: Record<string, boolean>;
  message: string;
  scenarioIndex: number;
  placeIds: PlaceId[];
  dialogueStep: number;
  scenarioStarted: boolean;
  choice: string;
  thanksChoice: ThankYouLine | "";
  mode: "guided" | "reorder";
  orderedTurns: number[];
  orderChecked: boolean;
  dialogueFlipped: number[];
  completedScenarios: boolean;
};

const phraseById = new Map(phrases.map((phrase) => [phrase.id, phrase]));
const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function emptyPhraseProgress(): PhraseProgress {
  return { version: 14, tab: "sort", placed: {}, selected: null, results: {}, misses: {}, solved: {}, flipped: {}, message: "", scenarioIndex: 0, placeIds: [], dialogueStep: 0, scenarioStarted: false, choice: "", thanksChoice: "", mode: "guided", orderedTurns: [], orderChecked: false, dialogueFlipped: [], completedScenarios: false };
}

function readPhraseProgress(raw: string | null): PhraseProgress {
  if (!raw) return emptyPhraseProgress();
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || (value.version !== 1 && value.version !== 2 && value.version !== 3 && value.version !== 4 && value.version !== 5 && value.version !== 6 && value.version !== 7 && value.version !== 8 && value.version !== 9 && value.version !== 10 && value.version !== 11 && value.version !== 12 && value.version !== 13 && value.version !== 14)) return emptyPhraseProgress();
    const progress = emptyPhraseProgress();
    if (value.tab === "sort" || value.tab === "context") progress.tab = value.tab;
    if (isRecord(value.placed)) {
      for (const [id, group] of Object.entries(value.placed)) {
        const validGroup = groups.find((entry) => entry.id === group);
        if (phraseById.has(id) && validGroup) progress.placed[id] = validGroup.id;
      }
    }
    if (typeof value.selected === "string" && phraseById.has(value.selected)) progress.selected = value.selected;
    if (isRecord(value.results)) {
      for (const [id, result] of Object.entries(value.results)) {
        const phrase = phraseById.get(id);
        if (phrase && progress.placed[id] && (result === "correct" || result === "wrong") && result === (progress.placed[id] === phrase.group ? "correct" : "wrong"))
          progress.results[id] = result;
      }
    }
    if (isRecord(value.misses)) {
      for (const [id, count] of Object.entries(value.misses))
        if (phraseById.has(id) && typeof count === "number" && Number.isSafeInteger(count) && count >= 0) progress.misses[id] = count;
    }
    for (const field of ["solved", "flipped"] as const) {
      if (!isRecord(value[field])) continue;
      for (const [id, enabled] of Object.entries(value[field]))
        if (phraseById.has(id) && enabled === true) progress[field][id] = true;
    }
    if (typeof value.message === "string") progress.message = value.message.slice(0, 300);
    progress.completedScenarios = value.completedScenarios === true;
    if (value.version === 2 || value.version === 3 || value.version === 4 || value.version === 5 || value.version === 6 || value.version === 7 || value.version === 8 || value.version === 9 || value.version === 10 || value.version === 11 || value.version === 12 || value.version === 13 || value.version === 14) {
      progress.scenarioStarted = value.scenarioStarted === true;
      if (value.version === 6 || value.version === 7 || value.version === 8 || value.version === 9 || value.version === 10 || value.version === 11 || value.version === 12 || value.version === 13 || value.version === 14) {
        if (typeof value.scenarioIndex === "number" && Number.isInteger(value.scenarioIndex) && value.scenarioIndex >= 0 && value.scenarioIndex < scenarios.length) progress.scenarioIndex = value.scenarioIndex;
      }
      if (value.version === 10 || value.version === 11 || value.version === 12 || value.version === 13 || value.version === 14) {
        if (Array.isArray(value.placeIds) && value.placeIds.length === scenarios.length
          && value.placeIds.every((id): id is PlaceId => typeof id === "string" && placeById.has(id as PlaceId))
          && new Set(value.placeIds).size === scenarios.length) progress.placeIds = value.placeIds;
        if (value.version === 13 || value.version === 14 || (value.version === 12 && scenarios[progress.scenarioIndex].kind !== "where")
          || (value.version === 11 && scenarios[progress.scenarioIndex].kind !== "where" && progress.placeIds[progress.scenarioIndex] !== "apotheke")) {
          const turnCount = scenarios[progress.scenarioIndex].kind === "where" ? 4 : 8;
          if (typeof value.dialogueStep === "number" && Number.isInteger(value.dialogueStep) && value.dialogueStep >= 0 && value.dialogueStep <= turnCount) progress.dialogueStep = value.dialogueStep;
          if (value.mode === "guided" || value.mode === "reorder") progress.mode = value.mode;
          if (Array.isArray(value.orderedTurns)) progress.orderedTurns = value.orderedTurns.filter((turn): turn is number => typeof turn === "number" && Number.isInteger(turn) && turn >= 0 && turn < turnCount).filter((turn, index, turns) => turns.indexOf(turn) === index);
          progress.orderChecked = value.orderChecked === true && progress.orderedTurns.length === turnCount;
          if (typeof value.choice === "string") progress.choice = value.choice.slice(0, 300);
          if (value.version === 14 && isThankYouLine(value.thanksChoice)) progress.thanksChoice = value.thanksChoice;
          if (Array.isArray(value.dialogueFlipped)) progress.dialogueFlipped = value.dialogueFlipped.filter((turn): turn is number => typeof turn === "number" && Number.isInteger(turn) && turn >= 0 && turn < turnCount).filter((turn, index, turns) => turns.indexOf(turn) === index);
        }
      }
    }
    return progress;
  } catch {
    return emptyPhraseProgress();
  }
}

export function L14PhraseLearning() {
  const { play, error: audioError } = useVocabularyAudio();
  const mapRef = useRef<HTMLDivElement>(null);
  const storage = useLessonState();
  const stateKey = lessonStateKeys.l14Phrases;
  const [testLastPage] = useState(() => isLastLessonPageRequested());
  const [progress, setProgress] = useState(() => {
    const saved = readPhraseProgress(storage.read(stateKey));
    return testLastPage ? { ...saved, tab: "context" as const, scenarioIndex: scenarios.length - 1, scenarioStarted: true, placeIds: saved.placeIds.length === scenarios.length ? saved.placeIds : drawScenarioPlaces(), dialogueStep: 0, mode: "guided" as const, orderedTurns: [], orderChecked: false, choice: "" } : saved;
  });
  useEffect(() => {
    if (testLastPage) clearLastLessonPageRequest();
  }, [testLastPage]);
  useEffect(() => {
    if (progress.placeIds.length === scenarios.length) return;
    const next = { ...progress, placeIds: drawScenarioPlaces() };
    setProgress(next);
    storage.write(stateKey, JSON.stringify(next));
  }, [progress, stateKey, storage]);
  const { tab, placed, selected, results, misses, solved, flipped, message, scenarioIndex, dialogueStep, choice, mode, orderedTurns, orderChecked, dialogueFlipped } = progress;
  const scenario = scenarios[scenarioIndex];
  const unknownEncounter = scenario.kind === "where";
  const place = placeById.get(progress.placeIds[scenarioIndex] ?? "post") ?? places[0];
  const spotlightId = `l14-map-spotlight-${place.id}`;
  const otherPlace = places[(places.findIndex((entry) => entry.id === place.id) + 1) % places.length];
  const followUpQuestion = "Wo muss ich dann abbiegen?";
  const firstQuestion = {
    help: "Entschuldigung. Können Sie mir helfen?",
    search: `Eine Frage bitte: Ich suche ${place.destination}.`,
    where: place.question,
    walk: `Kann ich zu Fuß ${place.walkDestination} gehen?`,
  }[scenario.kind];
  const distanceAnswer = place.far ? "Ja, das ist weit." : "Nein, das ist gar nicht weit.";
  const wrongDistanceAnswer = place.far ? "Nein, das ist gar nicht weit." : "Ja, das ist weit.";
  const thankYouStep = unknownEncounter ? 2 : 6;
  const defaultThanks = { help: "Herzlichen Dank.", search: "Sehr nett. Vielen Dank.", where: "Oh, danke schön.", walk: "Herzlichen Dank." }[scenario.kind];
  const thanks = dialogueStep === thankYouStep && isThankYouLine(choice) ? choice : progress.thanksChoice || defaultThanks;
  const thanksThai = thankYouOptions.find((option) => option.german === thanks)?.thai ?? "ขอบคุณมาก";
  const askerLines = [firstQuestion, scenario.kind === "help" ? place.question : scenario.kind === "walk" ? followUpQuestion : "Ist das sehr weit?", scenario.kind === "help" || scenario.kind === "walk" ? "Ist das sehr weit?" : "Kann ich zu Fuß gehen?", thanks];
  const helperLines = scenario.kind === "help"
    ? ["Ja, gern.", place.turn, distanceAnswer, "Bitte schön."]
    : scenario.kind === "walk"
      ? ["Ja, das können Sie.", place.turn, distanceAnswer, "Bitte schön."]
      : [place.turn, distanceAnswer, "Ja, das können Sie.", "Bitte schön."];
  const firstQuestionThai = { help: "ขอโทษครับ/ค่ะ ช่วยฉันหน่อยได้ไหม", search: `ขอถามหน่อย ฉันกำลังหา${place.thai}`, where: `${place.thai}อยู่ตรงไหน`, walk: `ฉันเดินไป${place.thai}ได้ไหม` }[scenario.kind];
  const askerThai = [firstQuestionThai, scenario.kind === "help" ? `${place.thai}อยู่ตรงไหน` : scenario.kind === "walk" ? "แล้วต้องเลี้ยวตรงไหน" : "ไกลมากไหม", scenario.kind === "help" || scenario.kind === "walk" ? "ไกลมากไหม" : "ฉันเดินไปได้ไหม", thanksThai];
  const helperThai = scenario.kind === "help"
    ? ["ได้สิ", place.turnThai, place.far ? "ใช่ ไกลอยู่" : "ไม่เลย ไม่ไกล", "ยินดีครับ/ค่ะ"]
    : scenario.kind === "walk"
      ? ["ได้สิ เดินไปได้", place.turnThai, place.far ? "ใช่ ไกลอยู่" : "ไม่เลย ไม่ไกล", "ยินดีครับ/ค่ะ"]
      : [place.turnThai, place.far ? "ใช่ ไกลอยู่" : "ไม่เลย ไม่ไกล", "ได้สิ เดินไปได้", "ยินดีครับ/ค่ะ"];
  const unknownLines = ["Tut mir leid. Ich bin nicht von hier.", "Das weiß ich leider nicht.", "Ich bin fremd hier."];
  const unknownAnswer = unknownLines[places.findIndex((entry) => entry.id === place.id) % unknownLines.length];
  const dialogueLines = unknownEncounter ? [place.question, unknownAnswer, thanks, "Bitte schön."] : askerLines.flatMap((line, index) => [line, helperLines[index]]);
  const unknownThai = ["ขอโทษ ฉันไม่ใช่คนแถวนี้", "ขอโทษ ฉันไม่รู้เรื่องนั้น", "ฉันไม่คุ้นกับแถวนี้"];
  const dialogueThai = unknownEncounter ? [`${place.thai}อยู่ตรงไหน`, unknownThai[places.findIndex((entry) => entry.id === place.id) % unknownThai.length], thanksThai, "ยินดีครับ/ค่ะ"] : askerThai.flatMap((line, index) => [line, helperThai[index]]);
  const answer = dialogueLines[dialogueStep] ?? "";
  const wrongTurn = place.turn.includes("Straße nach links") ? place.turn.replace("Straße nach links", "Straße nach rechts") : place.turn.replace("Straße nach rechts", "Straße nach links");
  const wrongNumberTurn = place.roadNumber === 1 ? place.turn.replace("erste Straße", "zweite Straße") : place.turn.replace("zweite Straße", "erste Straße");
  const wrongSecondTurn = place.id === "bahnhof" ? place.turn.replace("Vor der Apotheke biegen Sie nach rechts", "Vor der Apotheke biegen Sie nach links") : wrongNumberTurn;
  const openingDistractors = ["Entschuldigung. Können Sie mir helfen?", `Eine Frage bitte: Ich suche ${otherPlace.destination}.`, otherPlace.question, "Kann ich zu Fuß zur Post gehen?"].filter((line) => line !== answer);
  const turnChoices = [place.turn, wrongTurn, wrongSecondTurn];
  const distanceChoices = [distanceAnswer, wrongDistanceAnswer, "Das weiß ich leider nicht."];
  const routeChoicesByStep = [
    [answer, openingDistractors[scenarioIndex % openingDistractors.length], openingDistractors[(scenarioIndex + 1) % openingDistractors.length]],
    scenario.kind === "help" || scenario.kind === "walk" ? [answer, "Das weiß ich leider nicht.", "Herzlichen Dank."] : turnChoices,
    [answer, otherPlace.question, "Kann ich zu Fuß gehen?"],
    scenario.kind === "help" || scenario.kind === "walk" ? turnChoices : distanceChoices,
    [answer, "Herzlichen Dank.", otherPlace.question],
    scenario.kind === "help" || scenario.kind === "walk" ? distanceChoices : [answer, "Das weiß ich leider nicht.", wrongDistanceAnswer],
    thankYouOptions.map((option) => option.german),
    [answer, "Das weiß ich leider nicht.", "Ich bin fremd hier."],
  ];
  const choicesByStep = unknownEncounter ? [
    [answer, otherPlace.question, "Ist das sehr weit?"],
    [answer, place.turn, distanceAnswer],
    thankYouOptions.map((option) => option.german),
    [answer, "Das weiß ich leider nicht.", "Herzlichen Dank."],
  ] : routeChoicesByStep;
  const choices = (choicesByStep[dialogueStep] ?? []).filter((line, index, lines) => lines.indexOf(line) === index);
  const routeChoicePrompts = ["เริ่มถามทาง", scenario.kind === "help" ? "ตอบรับว่าจะช่วย" : scenario.kind === "walk" ? "ตอบว่าเดินไปได้ไหม" : "บอกทางตามเส้นบนแผนที่", scenario.kind === "help" ? "ถามหาสถานที่" : scenario.kind === "walk" ? "ถามว่าจะเลี้ยวตรงไหน" : "ถามเรื่องระยะทาง", scenario.kind === "help" || scenario.kind === "walk" ? "บอกทางตามเส้นบนแผนที่" : "ตอบเรื่องระยะทาง", scenario.kind === "help" || scenario.kind === "walk" ? "ถามเรื่องระยะทาง" : "ถามว่าเดินไปได้ไหม", scenario.kind === "help" || scenario.kind === "walk" ? "ตอบเรื่องระยะทาง" : "ตอบว่าเดินไปได้ไหม", "กล่าวขอบคุณ", "ตอบรับคำขอบคุณ"];
  const choicePrompts = unknownEncounter ? ["ถามหาสถานที่", "B ไม่คุ้นกับเมืองนี้ จะตอบอย่างไร", "ตอบกลับอย่างสุภาพ", "ตอบรับคำขอบคุณ"] : routeChoicePrompts;
  const turnCount = dialogueLines.length;
  const placedCount = phrases.filter((phrase) => placed[phrase.id]).length;
  const correctCount = phrases.filter((phrase) => placed[phrase.id] === phrase.group).length;
  const allCheckedCorrect = phrases.every((phrase) => results[phrase.id] === "correct");
  const contextProgress = mode === "guided" ? dialogueStep : turnCount + orderedTurns.length;
  const correctChoice = dialogueStep < turnCount && (choice === answer || (dialogueStep === thankYouStep && isThankYouLine(choice)));
  const dialogueTurns = dialogueLines.slice(0, Math.min(turnCount, dialogueStep + (dialogueStep < turnCount ? 1 : 0)));
  const shuffledTurns = (unknownEncounter ? [2, 0, 3, 1] : [4, 1, 6, 3, 0, 7, 2, 5]).map((index) => (index + scenarioIndex) % turnCount);
  const orderIsCorrect = orderedTurns.length === turnCount && orderedTurns.every((turn, index) => turn === index);

  function persist(next: PhraseProgress) {
    setProgress(next);
    storage.write(stateKey, JSON.stringify(next));
  }
  function openContext() {
    if (progress.scenarioStarted) {
      persist({ ...progress, tab: "context" });
      return;
    }
    persist({ ...progress, tab: "context", placeIds: progress.placeIds.length === scenarios.length ? progress.placeIds : drawScenarioPlaces(), scenarioStarted: true });
  }
  function nextScenario() {
    persist({ ...progress, completedScenarios: progress.completedScenarios || (scenarioIndex === scenarios.length - 1 && orderChecked && orderIsCorrect), scenarioIndex: (scenarioIndex + 1) % scenarios.length, placeIds: scenarioIndex === scenarios.length - 1 ? drawScenarioPlaces() : progress.placeIds, dialogueStep: 0, choice: "", thanksChoice: "", mode: "guided", orderedTurns: [], orderChecked: false, dialogueFlipped: [], scenarioStarted: true });
    requestAnimationFrame(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  function select(id: string) {
    persist({ ...progress, selected: selected === id ? null : id });
  }
  function move(group: GroupId) {
    if (!selected) return;
    const nextResults = { ...results };
    let nextMessage = message;
    if (placed[selected] !== group) {
      delete nextResults[selected];
      nextMessage = "";
    }
    persist({ ...progress, placed: { ...placed, [selected]: group }, results: nextResults, selected: null, message: nextMessage });
  }
  function returnToBank() {
    if (!selected) return;
    const nextPlaced = { ...placed };
    const nextResults = { ...results };
    delete nextPlaced[selected];
    delete nextResults[selected];
    persist({ ...progress, placed: nextPlaced, results: nextResults, selected: null, message: "" });
  }
  function check() {
    if (placedCount < phrases.length) {
      persist({ ...progress, message: `ยังมี ${phrases.length - placedCount} ประโยคที่ไม่ได้จัดกลุ่ม` });
      return;
    }
    const nextMisses = { ...misses };
    const nextSolved = { ...solved };
    const nextResults: Record<string, CheckResult> = {};
    for (const phrase of phrases) {
      const correct = placed[phrase.id] === phrase.group;
      nextResults[phrase.id] = correct ? "correct" : "wrong";
      if (correct) nextSolved[phrase.id] = true;
      else if (!results[phrase.id]) nextMisses[phrase.id] = (nextMisses[phrase.id] ?? 0) + 1;
    }
    persist({
      ...progress,
      misses: nextMisses,
      solved: nextSolved,
      results: nextResults,
      message: correctCount === phrases.length
        ? `ถูก ${phrases.length} / ${phrases.length} ประโยค ไปลองถามทางได้เลย`
        : `ถูก ${correctCount} จาก ${phrases.length} ประโยค แตะประโยคที่ต้องแก้แล้วเลือกกลุ่มใหม่`,
    });
  }

  function phraseCard(phrase: (typeof phrases)[number]) {
    const result = results[phrase.id];
    const wrongCount = misses[phrase.id] ?? 0;
    const isFlipped = Boolean(flipped[phrase.id]);
    const canFlip = wrongCount >= 3 || Boolean(solved[phrase.id]);
    function face(back: boolean) {
      const visible = back === isFlipped;
      return <div className={`l14-phrase-card-face l14-phrase-card-face--${back ? "back" : "front"}`} aria-hidden={!visible}>
        <div className="l14-phrase-card-main">
          <button type="button" className="l14-phrase-audio" tabIndex={visible ? 0 : -1} aria-label={`ฟังเสียงภาษาเยอรมัน ${phrase.text}`} onClick={() => play(phrase.spoken)}><Volume2 size={18} aria-hidden="true" /></button>
          <span className="l14-phrase-card-text" lang={back ? "th" : "de"} aria-hidden="true">{back ? phrase.thai : phrase.text}</span>
        </div>
        <button type="button" className="l14-phrase-select-target" tabIndex={visible ? 0 : -1} lang={back ? "th" : "de"} aria-label={back ? phrase.thai : phrase.text} aria-pressed={selected === phrase.id} onClick={() => select(phrase.id)} />
        {canFlip && <div className="l14-phrase-card-actions"><button type="button" tabIndex={visible ? 0 : -1} onClick={() => persist({ ...progress, flipped: { ...flipped, [phrase.id]: !isFlipped } })}>{back ? "ดูภาษาเยอรมัน" : "พลิกดูคำแปล"}</button></div>}
        {result === "wrong" && <small className="l14-phrase-hint">{back
          ? "ใช้คำแปลช่วยลองจัดกลุ่มใหม่"
          : wrongCount === 1 ? "ลองอีกครั้ง" : wrongCount === 2 ? secondHints[phrase.group] : "กดพลิกเพื่อดูคำแปลไทย แล้วลองจัดกลุ่มใหม่"}</small>}
      </div>;
    }
    return <div className="l14-phrase-card l14-phrase-card--sort" key={phrase.id} data-result={result} data-selected={selected === phrase.id ? "true" : undefined} data-flipped={isFlipped ? "true" : undefined}>
      <div className="l14-phrase-card-inner">{face(false)}{face(true)}</div>
    </div>;
  }

  function dialogueCard(slot: number, turnIndex: number | undefined, revealed: boolean, removable: boolean, result?: CheckResult) {
    const canFlip = turnIndex !== undefined && revealed;
    const isFlipped = turnIndex !== undefined && revealed && dialogueFlipped.includes(turnIndex);
    const german = turnIndex === undefined ? "" : dialogueLines[turnIndex];
    const thai = turnIndex === undefined ? "" : dialogueThai[turnIndex];
    function toggleFlip() {
      if (turnIndex === undefined || !canFlip) return;
      persist({ ...progress, dialogueFlipped: isFlipped ? dialogueFlipped.filter((index) => index !== turnIndex) : [...dialogueFlipped, turnIndex] });
    }
    return <div className="l14-phrase-turn-flip" data-flipped={isFlipped ? "true" : undefined} key={`${place.id}-${slot}`}>
      <div className="l14-phrase-turn-inner">
        <div className={`l14-phrase-turn l14-phrase-turn-front${mode === "guided" && slot === dialogueStep ? " is-current" : ""}`} data-result={result} aria-hidden={isFlipped}>
          <span>{slot % 2 === 0 ? "A" : "B"}</span>
          {german ? <div className="l14-phrase-turn-line"><button type="button" className="l14-phrase-audio" tabIndex={isFlipped ? -1 : 0} aria-label={`ฟัง ${german}`} onClick={() => play(german)}><Volume2 size={18} aria-hidden="true" /></button>{removable ? <button type="button" lang="de" tabIndex={isFlipped ? -1 : 0} className="l14-phrase-placed-line" onClick={() => persist({ ...progress, orderedTurns: orderedTurns.filter((_, index) => index !== slot), orderChecked: false, dialogueFlipped: [] })}>{german}</button> : <p lang="de">{german}</p>}</div> : <p className="l14-phrase-empty">…</p>}
          {canFlip && <button type="button" className="l14-phrase-flip-button" tabIndex={isFlipped ? -1 : 0} onClick={toggleFlip}>พลิกดูคำแปล</button>}
        </div>
        {canFlip && <div className="l14-phrase-turn l14-phrase-turn-back" aria-hidden={!isFlipped}>
          <span>{slot % 2 === 0 ? "A" : "B"}</span>
          <div className="l14-phrase-turn-line"><button type="button" className="l14-phrase-audio" tabIndex={isFlipped ? 0 : -1} aria-label={`ฟัง ${german}`} onClick={() => play(german)}><Volume2 size={18} aria-hidden="true" /></button><p lang="th">{thai}</p></div>
          <button type="button" className="l14-phrase-flip-button" tabIndex={isFlipped ? 0 : -1} onClick={toggleFlip}>ดูภาษาเยอรมัน</button>
        </div>}
      </div>
    </div>;
  }

  return <main className="guided-learning l14-phrase-learning">
    <h1>Wegbeschreibungen</h1>
    <p>เลือกประโยคให้ตรงกับหน้าที่ แล้วลองถามทางในเมือง</p>
    <nav className="learning-category-tabs" aria-label="ขั้นตอนการเรียน">
      <button type="button" aria-current={tab === "sort" ? "page" : undefined} onClick={() => persist({ ...progress, tab: "sort" })}>1. จัดกลุ่มประโยค</button>
      <button type="button" aria-current={tab === "context" ? "page" : undefined} onClick={openContext}>2. ฝึกถามทาง</button>
    </nav>
    {tab === "context" && <div className="l14-context-sticky">
      <aside className="article-legend" aria-label="สีของคำนำหน้านาม">
        <span><i className="article-dot" style={{ backgroundColor: articleColors.der }} aria-hidden="true" />der · Maskulin</span>
        <span><i className="article-dot" style={{ backgroundColor: articleColors.die }} aria-hidden="true" />die · Feminin</span>
        <span><i className="article-dot" style={{ backgroundColor: articleColors.das }} aria-hidden="true" />das · Neutrum</span>
        <span><i className="article-dot" style={{ backgroundColor: articleColors.plural }} aria-hidden="true" />die · Plural</span>
      </aside>
      <div className="vocabulary-image-progress" aria-live="polite"><span>{scenarioIndex + 1}/{scenarios.length}</span><div className="vocabulary-image-progress-track" role="progressbar" aria-label={`ความคืบหน้าข้อ ${scenarioIndex + 1} จาก ${scenarios.length}`} aria-valuemin={0} aria-valuemax={turnCount * 2} aria-valuenow={contextProgress} aria-valuetext={mode === "guided" ? `เลือกประโยคแล้ว ${dialogueStep} จาก ${turnCount}` : `เรียงประโยคแล้ว ${orderedTurns.length} จาก ${turnCount}`}><span style={{ width: `${contextProgress / (turnCount * 2) * 100}%` }} /></div></div>
    </div>}
    {tab === "sort" && <div className="vocabulary-image-progress" aria-live="polite">
      <span>จัดแล้ว {placedCount} / {phrases.length} ประโยค</span>
      <div className="vocabulary-image-progress-track" role="progressbar" aria-label="ความคืบหน้าการจัดกลุ่ม" aria-valuemin={0} aria-valuemax={phrases.length} aria-valuenow={placedCount}>
        <span style={{ width: `${placedCount / phrases.length * 100}%` }} />
      </div>
    </div>}
    {tab === "sort" ? <section className="guided-card">
      <h2>ประโยคนี้ใช้ทำอะไร?</h2>
      {placedCount < phrases.length && <div className="l14-phrase-bank" aria-label="คลังประโยค">
        <div className="l14-phrase-list">
          {phrases.filter((phrase) => !placed[phrase.id]).map(phraseCard)}
        </div>
      </div>}
      {selected && <div className="l14-phrase-quick-assign" aria-label="เลือกกลุ่มให้ประโยคที่เลือก">
        <p lang="de">{phrases.find((phrase) => phrase.id === selected)?.text}</p>
        <div>{groups.map((group) => <button key={group.id} type="button" onClick={() => move(group.id)}><span lang="de">{group.german}</span><span lang="th">{group.thai}</span></button>)}</div>
        <button type="button" className="l14-phrase-cancel" onClick={() => persist({ ...progress, selected: null })}>ยกเลิก</button>
      </div>}
      {selected && placed[selected] && <button className="button secondary l14-phrase-return" type="button" onClick={returnToBank}>คืนประโยคที่เลือกเข้าคลัง</button>}
      <div className="l14-phrase-groups">
        {groups.map((group) => <section className="l14-phrase-group" key={group.id}>
          <button type="button" className="l14-phrase-group-target" disabled={!selected} onClick={() => move(group.id)}><strong lang="de">{group.german}</strong><span>{group.thai}</span></button>
          <div className="l14-phrase-group-items">
            {phrases.filter((phrase) => placed[phrase.id] === group.id).map(phraseCard)}
          </div>
        </section>)}
      </div>
      <div className="guided-navigation"><button className="button primary" type="button" onClick={check}>ตรวจคำตอบ</button>{allCheckedCorrect && <button className="button secondary" type="button" onClick={openContext}>ไปฝึกถามทาง</button>}</div>
      {message && <p className="l14-phrase-feedback" role="status">{message}</p>}
      {audioError && <p role="alert">{audioError}</p>}
    </section> : <section className="guided-card l14-phrase-context">
      <p className="l14-phrase-context-intro">{unknownEncounter ? "B เพิ่งมาเมืองนี้และไม่รู้เส้นทาง เลือกประโยคที่ใช้ตอบเมื่อมีคนถามทาง" : "ดูเส้นทางบนแผนที่ แล้วเลือกประโยคให้ตรงกับทางที่เห็น"}</p>
      <div className="l14-city-map" ref={mapRef} key={place.id} role="img" aria-label={`แผนที่เมืองมีถนนแตกแขนง ${unknownEncounter ? `สถานที่ที่ A ถามคือ ${place.label}` : `เส้นทางไป ${place.label}`} และสถานที่ ${places.map((entry) => entry.label).join(", ")}`}>
        <Image src="/images/lektion-14-vocabulary/phrase-city-map-branching.png" width={1536} height={1024} sizes="(max-width: 720px) 100vw, 1200px" alt="" priority />
        <svg className="l14-city-map-extension" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="49.5" y="87" width="5" height="13" fill="#9aaeb9" /><path d="M52 89V100" fill="none" stroke="#fff" strokeWidth=".18" strokeDasharray="1.5 1.7" /></svg>
        <svg className="l14-city-map-shade" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><mask id={spotlightId}><rect width="100" height="100" fill="white" /><ellipse cx={place.x} cy={place.y} rx={place.rx} ry={place.ry} fill="black" /></mask></defs><rect width="100" height="100" fill="#faf8ed" opacity=".45" mask={`url(#${spotlightId})`} /></svg>
        {!unknownEncounter && <svg className="l14-city-map-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline className="l14-city-map-route-halo" points={place.route.map(([x, y]) => `${x},${y}`).join(" ")} /><polyline className="l14-city-map-route-line" points={place.route.map(([x, y]) => `${x},${y}`).join(" ")} /><circle className="l14-city-map-route-end" cx={place.route[place.route.length - 1][0]} cy={place.route[place.route.length - 1][1]} r="1.2" /></svg>}
        <svg className="l14-city-map-person" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><circle cx="52" cy="95" r=".55" fill="#df151e" stroke="white" strokeWidth=".15" /><rect x="51.55" y="95.6" width=".9" height="2.2" rx=".4" fill="#df151e" stroke="white" strokeWidth=".12" /></svg>
        {places.map((entry) => <span key={entry.id} lang="de" className={`l14-city-map-label${entry.id === place.id ? " is-active" : ""}`} style={{ left: `${entry.labelX}%`, top: `${entry.labelY}%` }}><i className="article-dot" style={{ backgroundColor: articleColors[entry.article] }} aria-hidden="true" />{entry.label}</span>)}
        <span className="l14-city-map-start">Sie sind hier</span>
      </div>
      {mode === "guided" ? <>
        <div className="l14-phrase-dialogue">
          {dialogueTurns.map((_, index) => dialogueCard(index, index < dialogueStep || correctChoice ? index : undefined, index < dialogueStep || correctChoice, false))}
        </div>
        {dialogueStep < turnCount && <><h3>{choicePrompts[dialogueStep]}</h3><div className="l14-phrase-choices">{choices.map((option) => <div className="l14-phrase-card" key={option} data-result={choice === option ? correctChoice ? "correct" : "wrong" : undefined}><div className="l14-phrase-card-main"><button type="button" className="l14-phrase-audio" aria-label={`ฟัง ${option}`} onClick={() => play(option)}><Volume2 size={18} aria-hidden="true" /></button><button type="button" lang="de" className="l14-phrase-chip" aria-pressed={choice === option} disabled={correctChoice} onClick={() => persist({ ...progress, choice: option })}>{option}</button></div></div>)}</div>
          {choice && <p className="l14-phrase-feedback" role="status">{correctChoice ? "เลือกประโยคได้เหมาะกับสถานการณ์" : unknownEncounter && dialogueStep === 1 ? "B ไม่คุ้นกับเมืองนี้ ลองเลือกประโยคที่บอกว่าไม่รู้ทาง" : choice.includes(otherPlace.question) ? "ดูชื่อสถานที่ที่เส้นทางพาไป แล้วลองอีกครั้ง" : choice === wrongTurn || choice === wrongNumberTurn || choice === wrongSecondTurn ? "ดูว่าต้องเลี้ยวเข้าถนนสายไหนและไปทางซ้ายหรือขวา" : choice === wrongDistanceAnswer ? "ดูระยะทางบนแผนที่ แล้วลองอีกครั้ง" : "ดูว่าตอนนี้ A หรือ B ต้องพูดอะไร แล้วลองอีกครั้ง"}</p>}
        </>}
        {dialogueStep === turnCount && <p className="l14-phrase-feedback">ครบแล้ว ลองเรียงบทสนทนาเองอีกรอบ</p>}
      </> : <>
        <p className="l14-phrase-context-intro">แตะประโยคเพื่อเรียงบทสนทนาจาก A ไป B แตะประโยคที่วางแล้วเพื่อนำกลับ</p>
        <div className="l14-phrase-dialogue" aria-label="บทสนทนาที่เรียงแล้ว">
          {Array.from({ length: turnCount }, (_, index) => dialogueCard(index, orderedTurns[index], orderChecked && orderIsCorrect, true, orderChecked && orderedTurns[index] !== undefined ? orderedTurns[index] === index ? "correct" : "wrong" : undefined))}
        </div>
        <div className="l14-phrase-choices" aria-label="ประโยคที่ยังไม่เรียง">{shuffledTurns.filter((index) => !orderedTurns.includes(index)).map((index) => <div className="l14-phrase-card" key={index}><div className="l14-phrase-card-main"><button type="button" className="l14-phrase-audio" aria-label={`ฟัง ${dialogueLines[index]}`} onClick={() => play(dialogueLines[index])}><Volume2 size={18} aria-hidden="true" /></button><button type="button" lang="de" className="l14-phrase-chip" onClick={() => persist({ ...progress, orderedTurns: [...orderedTurns, index], orderChecked: false, dialogueFlipped: [] })}>{dialogueLines[index]}</button></div></div>)}</div>
        {orderChecked && <p className="l14-phrase-feedback" role="status">{orderIsCorrect ? "เรียงบทสนทนาได้ถูกต้อง" : "ลองอีกครั้ง แตะประโยคที่ไม่เข้ากับลำดับเพื่อนำกลับไปเลือกใหม่"}</p>}
      </>}
      {audioError && <p role="alert">{audioError}</p>}
      <div className="guided-navigation"><button className="button secondary" type="button" onClick={() => persist({ ...progress, tab: "sort" })}>ย้อนกลับ</button>
        {mode === "guided" && correctChoice && <button className="button primary" type="button" onClick={() => persist({ ...progress, dialogueStep: dialogueStep + 1, choice: "", thanksChoice: dialogueStep === thankYouStep && isThankYouLine(choice) ? choice : progress.thanksChoice })}>ประโยคถัดไป</button>}
        {mode === "guided" && dialogueStep === turnCount && <button className="button primary" type="button" onClick={() => persist({ ...progress, mode: "reorder", dialogueFlipped: [] })}>ลองเรียงบทสนทนา</button>}
        {mode === "reorder" && orderedTurns.length === turnCount && !orderIsCorrect && <button className="button primary" type="button" onClick={() => persist({ ...progress, orderChecked: true })}>ตรวจคำตอบ</button>}
        {mode === "reorder" && orderIsCorrect && !orderChecked && <button className="button primary" type="button" onClick={() => persist({ ...progress, orderChecked: true })}>ตรวจคำตอบ</button>}
        {mode === "reorder" && orderChecked && orderIsCorrect && <button className="button primary" type="button" onClick={nextScenario}>{scenarioIndex === scenarios.length - 1 ? "เรียนอีกครั้ง" : "ไปข้อถัดไป"}</button>}
        {((progress.completedScenarios || (scenarioIndex === scenarios.length - 1 && orderChecked && orderIsCorrect)) && allCheckedCorrect || testLastPage) && <Link className="button primary" href="/practice/L14/phrases/basic?flow=lesson">ทำแบบฝึกหัด</Link>}
      </div>
      {mode === "reorder" && orderChecked && orderIsCorrect && scenarioIndex === scenarios.length - 1 && <p className="l14-phrase-feedback" role="status">ครบทั้ง 4 สถานการณ์แล้ว</p>}
    </section>}
  </main>;
}
