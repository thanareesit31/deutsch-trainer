"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import { l03FamilyPluralPairs, vocabularyImagePages, type FamilyPluralPair } from "@/lib/vocabulary-image-content";
import { readLearnedImageVocabularyIds } from "@/lib/vocabulary-image-learning-storage";
import { useLessonState, lessonStateKeys } from "./lesson-state-provider";
import { isTestWorkspaceUser, useStore } from "./store";
import { useVocabularyAudio } from "./vocabulary-audio";
import { ArticleDot } from "./profession-matching";
import { LearnPracticeLink } from "./learn-practice-link";

const route = "/learn/L03/vocabulary/familie-plural";
type Side = "singular" | "plural";
type Selection = { side: Side; id: string };

function changedPluralSegments(singular: string, plural: string) {
  const source = [...singular];
  const target = [...plural];
  const common = Array.from({ length: source.length + 1 }, () => Array<number>(target.length + 1).fill(0));
  for (let left = source.length - 1; left >= 0; left--) {
    for (let right = target.length - 1; right >= 0; right--) {
      common[left][right] = source[left] === target[right]
        ? common[left + 1][right + 1] + 1
        : Math.max(common[left + 1][right], common[left][right + 1]);
    }
  }
  const changed = target.map(() => true);
  for (let left = 0, right = 0; left < source.length && right < target.length;) {
    if (source[left] === target[right]) {
      changed[right] = false;
      left++;
      right++;
    } else if (common[left + 1][right] >= common[left][right + 1]) {
      left++;
    } else {
      right++;
    }
  }
  const segments: { text: string; changed: boolean }[] = [];
  target.forEach((letter, index) => {
    const last = segments.at(-1);
    if (last && last.changed === changed[index]) last.text += letter;
    else segments.push({ text: letter, changed: changed[index] });
  });
  return segments;
}

function HighlightedPlural({ singular, plural }: { singular: string; plural: string }) {
  return <span lang="de">{changedPluralSegments(singular, plural).map((segment, index) =>
    segment.changed ? <span className="family-plural-changed" key={index}>{segment.text}</span>
      : <span key={index}>{segment.text}</span>)}</span>;
}

function FamilyPluralAnswerTable({ pairs, title, onPlay }: {
  pairs: readonly (FamilyPluralPair & { article: string })[];
  title: string;
  onPlay: (text: string) => void;
}) {
  return <section className="family-plural-summary" aria-label={title}>
    <h2>{title}</h2>
    <p>ตัวอักษรสีแดงคือส่วนของพหูพจน์ที่เปลี่ยนหรือเพิ่ม กดคำเพื่อฟังเสียง</p>
    <table><thead><tr><th scope="col">Singular · เอกพจน์</th><th scope="col">Plural · พหูพจน์</th></tr></thead>
      <tbody>{pairs.map((pair) => <tr key={pair.id}>
        <td><button type="button" className="family-plural-summary-audio" aria-label={`ฟังเอกพจน์ ${pair.article} ${pair.singular}`} onClick={() => onPlay(`${pair.article} ${pair.singular}`)}><ArticleDot article={pair.article} /><span lang="de">{pair.article} {pair.singular}</span><Volume2 size={17} aria-hidden="true" /></button></td>
        <td><button type="button" className="family-plural-summary-audio" aria-label={`ฟังพหูพจน์ die ${pair.plural}`} onClick={() => onPlay(`die ${pair.plural}`)}><ArticleDot article="plural" /><span lang="de">die <HighlightedPlural singular={pair.singular} plural={pair.plural} /></span><Volume2 size={17} aria-hidden="true" /></button></td>
      </tr>)}</tbody>
    </table>
  </section>;
}

export function FamilyPluralLearning({ items }: { items: { id: string; article?: string; plural?: string }[] }) {
  const searchParams = useSearchParams();
  const { user } = useStore();
  const allowIncompleteNavigation = isTestWorkspaceUser(user);
  const lessonState = useLessonState();
  const { play, error: audioError } = useVocabularyAudio();
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Selection | null>(null);
  const [incorrect, setIncorrect] = useState<{ singularId: string; pluralId: string } | null>(null);
  const [feedback, setFeedback] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const pairs = useMemo(() => l03FamilyPluralPairs.flatMap((pair) => {
    const item = items.find((entry) => entry.id === pair.id);
    return item?.plural === pair.plural && item.article ? [{ ...pair, article: item.article }] : [];
  }), [items]);
  const pages = useMemo(() => vocabularyImagePages(pairs.map((pair) => pair.id)), [pairs]);
  const requestedPage = searchParams.get("page");
  const summary = requestedPage === "summary";
  const pageNumber = Number(requestedPage ?? "1");
  const pageIndex = Number.isSafeInteger(pageNumber) && pageNumber > 0 ? Math.min(pageNumber - 1, pages.length - 1) : 0;
  const pageHref = (index: number) => index === 0 ? route : `${route}?page=${index + 1}`;

  useEffect(() => {
    setLearnedIds(readLearnedImageVocabularyIds(lessonState.read(lessonStateKeys.l03FamilyPlural)));
    setHydrated(true);
  }, [lessonState.read]);

  useEffect(() => {
    setSelected(null);
    setIncorrect(null);
    setFeedback("");
  }, [requestedPage]);

  const learned = new Set(learnedIds);
  const pagePairs = pairs.filter((pair) => pages[pageIndex].includes(pair.id));
  const remaining = pagePairs.filter((pair) => !learned.has(pair.id));
  const completedCount = pairs.filter((pair) => learned.has(pair.id)).length;
  const firstIncompletePage = pages.findIndex((page) => page.some((id) => !learned.has(id)));
  const previousPagesComplete = pages.slice(0, pageIndex).every((page) => page.every((id) => learned.has(id)));
  const unlocked = allowIncompleteNavigation || (summary ? completedCount === pairs.length : previousPagesComplete);

  function choose(side: Side, id: string) {
    const pair = pairs.find((entry) => entry.id === id);
    if (!pair || learned.has(id)) return;
    play(side === "singular" ? `${pair.article} ${pair.singular}` : `die ${pair.plural}`);
    if (!selected || selected.side === side) {
      setSelected(selected?.side === side && selected.id === id ? null : { side, id });
      setIncorrect(null);
      setFeedback("");
      return;
    }
    const singularId = selected.side === "singular" ? selected.id : id;
    const pluralId = selected.side === "plural" ? selected.id : id;
    if (singularId !== pluralId) {
      setIncorrect({ singularId, pluralId });
      setSelected(null);
      setFeedback("ยังไม่ตรงกัน ลองอีกครั้ง");
      return;
    }
    const next = [...new Set([...learnedIds, id])];
    setLearnedIds(next);
    lessonState.write(lessonStateKeys.l03FamilyPlural, JSON.stringify(next));
    setSelected(null);
    setIncorrect(null);
    setFeedback("ถูกต้อง จับคู่ได้แล้ว");
  }

  if (!hydrated) return <main className="family-plural-learning" aria-busy="true" />;

  return <main className="family-plural-learning">
    <div className="vocabulary-image-heading"><div><span className="eyebrow">WORTSCHATZ</span><h1>Familie: Singular und Plural</h1><p>{summary ? "สรุปรูปเอกพจน์และพหูพจน์ กดคำเพื่อฟังเสียง" : "จับคู่เอกพจน์ทางซ้ายกับพหูพจน์ทางขวา กดคำเพื่อฟังเสียง"}</p></div></div>
    <div className="family-plural-learning-sticky">
      <div className="family-plural-legend" aria-label="สี Artikel">
        <span><ArticleDot article="der" />der · Maskulin</span>
        <span><ArticleDot article="die" />die · Feminin</span>
        <span><ArticleDot article="das" />das · Neutrum</span>
        <span><ArticleDot article="plural" />die · Plural (ไม่ใช่เพศ)</span>
      </div>
      <div className="vocabulary-image-progress" aria-live="polite"><span>เรียนแล้ว {completedCount} / {pairs.length} คู่</span><div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${pairs.length ? completedCount / pairs.length * 100 : 0}%` }} /></div></div>
    </div>
    {!unlocked ? <section className="vocabulary-image-locked">
      <h2>{summary ? "ตารางสรุป" : "จับคู่หน้าก่อนให้ครบ"}</h2>
      <p>จับคู่คำในหน้าก่อนให้ครบ แล้วจึงไปต่อ</p>
      <Link className="button primary" href={pageHref(firstIncompletePage < 0 ? 0 : firstIncompletePage)}>กลับหน้าที่กำลังเรียน</Link>
    </section> : summary ? <FamilyPluralAnswerTable pairs={pairs} title="ตารางสรุป" onPlay={play} />
      : pagePairs.length > 0 && remaining.length === 0 ? <FamilyPluralAnswerTable pairs={pagePairs} title="จับคู่หน้านี้ครบแล้ว" onPlay={play} />
        : <section className="family-plural-board" aria-label="จับคู่เอกพจน์กับพหูพจน์">
      <div className="family-plural-column"><h2>Singular <small>เอกพจน์</small></h2>
        {remaining.map((pair) => <button type="button" key={pair.id} className={`family-plural-option${selected?.side === "singular" && selected.id === pair.id ? " selected" : ""}${incorrect?.singularId === pair.id ? " incorrect" : ""}`} aria-label={`เลือกและฟังเอกพจน์ ${pair.article} ${pair.singular}`} aria-pressed={selected?.side === "singular" && selected.id === pair.id} onClick={() => choose("singular", pair.id)}><ArticleDot article={pair.article} /><span lang="de">{pair.article} {pair.singular}</span><Volume2 size={17} aria-hidden="true" /></button>)}
      </div>
      <div className="family-plural-column"><h2>Plural <small>พหูพจน์</small></h2>
        {[...remaining].reverse().map((pair) => <button type="button" key={pair.id} className={`family-plural-option${selected?.side === "plural" && selected.id === pair.id ? " selected" : ""}${incorrect?.pluralId === pair.id ? " incorrect" : ""}`} aria-label={`เลือกและฟังพหูพจน์ die ${pair.plural}`} aria-pressed={selected?.side === "plural" && selected.id === pair.id} onClick={() => choose("plural", pair.id)}><ArticleDot article="plural" /><span lang="de">die {pair.plural}</span><Volume2 size={17} aria-hidden="true" /></button>)}
      </div>
    </section>}
    <p className={`vocabulary-image-feedback${incorrect ? " incorrect" : ""}`} role="status">{feedback}</p>
    {audioError && <p className="alphabet-audio-error" role="status">{audioError}</p>}
    <div className="vocabulary-image-done-actions">
      <Link className="button secondary" href={summary ? pageHref(pages.length - 1) : pageIndex > 0 ? pageHref(pageIndex - 1) : "/learn/L03/vocabulary"}>{summary || pageIndex > 0 ? "ย้อนกลับ" : "ย้อนกลับไปคำศัพท์"}</Link>
      {!summary && unlocked && (allowIncompleteNavigation || remaining.length === 0) && <Link className="button primary" href={pageIndex < pages.length - 1 ? pageHref(pageIndex + 1) : `${route}?page=summary`}>{pageIndex < pages.length - 1 ? "หน้าถัดไป" : "ดูตารางสรุป"}</Link>}
      {summary && <Link className="button secondary" href="/learn/L03/vocabulary">กลับไปคำศัพท์</Link>}
      {summary && (completedCount === pairs.length || allowIncompleteNavigation) && <LearnPracticeLink lessonId="L03" skill="vocabulary" />}
    </div>
  </main>;
}
