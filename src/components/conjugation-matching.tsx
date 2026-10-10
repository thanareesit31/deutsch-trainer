"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2 } from "lucide-react";
import type { Item } from "@/lib/content";
import { activityPairs, optionValue, type LearningActivity } from "@/lib/guided-learning";
import { useVocabularyAudio } from "./vocabulary-audio";

export function ConjugationAudioForm({ speechText, children }: { speechText: string; children: ReactNode }) {
  const { play } = useVocabularyAudio();
  return <button type="button" className="conjugation-audio-form" lang="de"
    aria-label={`ฟังเสียง ${speechText}`} onClick={() => play(speechText)}>
    <span>{children}</span><Volume2 size={16} aria-hidden="true" />
  </button>;
}

// Uses the existing activity/pair IDs so old PairMatching drafts restore in place.
export function ConjugationMatching({ activity, items, matchedIds, busy, onMatch }: {
  activity: LearningActivity;
  items: Item[];
  matchedIds: string[];
  busy: boolean;
  onMatch: (id: string) => Promise<void>;
}) {
  const pairs = activityPairs(activity, items);
  const { play, error } = useVocabularyAudio();
  const [order] = useState(() => {
    const ids = pairs.map(p => p.id);
    for (let index = ids.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [ids[index], ids[other]] = [ids[other], ids[index]];
    }
    return ids;
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ row: string; token: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const remaining = [...order];
  for (const id of matchedIds) {
    const pair = pairs.find(p => p.id === id);
    if (!pair) continue;
    const index = remaining.findIndex(token => optionValue(pairs.find(p => p.id === token)!.right, items) === optionValue(pair.right, items));
    if (index >= 0) remaining.splice(index, 1);
  }
  function readPair(pair: (typeof pairs)[number]) {
    play(`${optionValue(pair.left, items).split("/")[0].trim()} ${optionValue(pair.right, items)}`);
  }
  async function assign(rowId: string, tokenId = selected) {
    if (busy || saving.current || matchedIds.includes(rowId) || !tokenId || !remaining.includes(tokenId)) return;
    const row = pairs.find(p => p.id === rowId);
    const token = pairs.find(p => p.id === tokenId);
    if (!row || !token) return;
    setSelected(null);
    if (timer.current) clearTimeout(timer.current);
    if (optionValue(row.right, items) !== optionValue(token.right, items)) {
      setWrong({ row: rowId, token: tokenId });
      timer.current = setTimeout(() => setWrong(null), 650);
      return;
    }
    setWrong(null);
    readPair(row);
    saving.current = true;
    try { await onMatch(rowId); }
    finally { saving.current = false; }
  }
  return <>
    <div className="matching-board" aria-label={`จับคู่รูปผัน ${items.find(i => i.id === activity.verbId)?.verbContent?.infinitive ?? ""}`}>
      <div className="matching-column">
        <h2>ประธาน</h2>
        {pairs.map(pair => {
          const correct = matchedIds.includes(pair.id);
          return <button type="button" key={pair.id} data-pair-id={pair.id}
            className={`matching-subject${selected ? " target-ready" : ""}`}
            disabled={busy && !correct}
            title={correct ? "กดฟังเสียงซ้ำ" : "วางรูปผันข้างประธาน"}
            onClick={() => correct ? readPair(pair) : void assign(pair.id)}
            onDragOver={event => event.preventDefault()}
            onDrop={event => {
              event.preventDefault();
              void assign(pair.id, event.dataTransfer.getData("text/plain"));
            }}>
            <span lang="de">{optionValue(pair.left, items)}</span>
            <span className={`matching-drop${correct ? " filled correct" : wrong?.row === pair.id ? " incorrect" : ""}`}>
              {correct ? <span lang="de">{optionValue(pair.right, items)} <Volume2 size={15} aria-hidden="true" /></span> : "เลือกคำตอบ"}
            </span>
          </button>;
        })}
      </div>
      <div className="matching-column">
        <h2>รูปกริยา</h2>
        <div className="matching-bank">
          {remaining.map(id => {
            const pair = pairs.find(p => p.id === id)!;
            return <button type="button" key={id} lang="de" disabled={busy} draggable={!busy}
              className={`matching-token${selected === id ? " selected" : ""}${wrong?.token === id ? " incorrect" : ""}`}
              aria-pressed={selected === id}
              onClick={() => { setSelected(id); play(optionValue(pair.right, items)); }}
              onDragStart={event => { event.dataTransfer.setData("text/plain", id); event.dataTransfer.effectAllowed = "move"; setSelected(id); }}>
              {optionValue(pair.right, items)} <Volume2 size={15} aria-hidden="true" />
            </button>;
          })}
        </div>
        <p className="conjugation-hint">ลากรูปกริยาไปวางข้างประธาน หรือแตะรูปกริยาแล้วแตะช่องประธาน</p>
      </div>
    </div>
    <p role="status" className="guided-feedback wrong">{wrong ? "ลองใหม่" : error}</p>
  </>;
}

export function ConjugationSummary({ activities, items }: { activities: LearningActivity[]; items: Item[] }) {
  const verbs = activities.map(a => items.find(i => i.id === a.verbId)?.verbContent).filter(v => !!v);
  return <section className="verb-summary">
    <h2>สรุปการผันกริยาที่เรียน</h2>
    <div className="verb-summary-scroll" role="region" aria-label="ตารางสรุปการผันกริยาทั้งหมด" tabIndex={0}>
      <table><thead><tr><th scope="col">ประธาน</th>{verbs.map(verb => <th scope="col" key={verb.infinitive} lang="de">{verb.infinitive}</th>)}</tr></thead>
        <tbody>{[...new Set(verbs.flatMap(verb => verb.conjugations.map(row => row.subject)))].map(subjectLabel => <tr key={subjectLabel}>
          <th scope="row" lang="de">{subjectLabel}</th>
          {verbs.map(verb => {
            const form = verb.conjugations.find(row => row.subject === subjectLabel);
            if (!form) return <td key={verb.infinitive}>—</td>;
            const split = form.ending && form.form.endsWith(form.ending) ? form.form.length - form.ending.length : form.form.length;
            const subject = subjectLabel.split("/")[0].trim();
            return <td key={verb.infinitive}><ConjugationAudioForm speechText={`${subject} ${form.form}`}>
              <strong>{form.segments
                ? form.segments.map((segment, index) => <span key={index} className={segment.changed ? "ending-result" : undefined}>{segment.text}</span>)
                : <>{form.form.slice(0, split)}<span className="ending-result">{form.form.slice(split)}</span></>}</strong>
            </ConjugationAudioForm></td>;
          })}
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}
