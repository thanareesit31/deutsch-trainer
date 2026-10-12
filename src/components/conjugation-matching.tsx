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
  return <ConjugationBoard ariaLabel={`จับคู่รูปผัน ${items.find(i => i.id === activity.verbId)?.verbContent?.infinitive ?? ""}`}
    pairs={pairs.map(pair => ({ id: pair.id, left: optionValue(pair.left, items), right: optionValue(pair.right, items) }))}
    matchedIds={matchedIds} busy={busy} onMatch={id => onMatch(id)} />;
}

export type ConjugationBoardPair = { id: string; left: string; right: string };

export function ConjugationBoard({ pairs, matchedIds, busy, onMatch, ariaLabel, tokenOrder, matchedTokenByRow }: {
  pairs: ConjugationBoardPair[];
  matchedIds: string[];
  busy: boolean;
  onMatch: (rowId: string, tokenId: string) => void | Promise<void>;
  ariaLabel: string;
  tokenOrder?: string[];
  matchedTokenByRow?: Record<string, string>;
}) {
  const { play, error } = useVocabularyAudio();
  const [order, setOrder] = useState(() => {
    const ids = tokenOrder?.filter(id => pairs.some(pair => pair.id === id)) ?? pairs.map(p => p.id);
    for (const pair of pairs) if (!ids.includes(pair.id)) ids.push(pair.id);
    if (tokenOrder) return ids;
    for (let index = ids.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [ids[index], ids[other]] = [ids[other], ids[index]];
    }
    return ids;
  });
  const tokenOrderKey = tokenOrder?.join("\u0000");
  useEffect(() => {
    if (!tokenOrder) return;
    setOrder(tokenOrder.filter(id => pairs.some(pair => pair.id === id)));
  }, [tokenOrderKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{ row: string; token: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const remaining = [...order];
  for (const id of matchedIds) {
    const pair = pairs.find(p => p.id === id);
    if (!pair) continue;
    const matchedTokenId = matchedTokenByRow?.[id];
    const index = matchedTokenId
      ? remaining.indexOf(matchedTokenId)
      : remaining.findIndex(token => pairs.find(p => p.id === token)?.right === pair.right);
    if (index >= 0) remaining.splice(index, 1);
  }
  function readPair(pair: ConjugationBoardPair) {
    play(`${pair.left.split("/")[0].trim()} ${pair.right}`);
  }
  async function assign(rowId: string, tokenId = selected) {
    if (busy || saving.current || matchedIds.includes(rowId) || !tokenId || !remaining.includes(tokenId)) return;
    const row = pairs.find(p => p.id === rowId);
    const token = pairs.find(p => p.id === tokenId);
    if (!row || !token) return;
    setSelected(null);
    if (timer.current) clearTimeout(timer.current);
    if (row.right !== token.right) {
      setWrong({ row: rowId, token: tokenId });
      timer.current = setTimeout(() => setWrong(null), 650);
      return;
    }
    setWrong(null);
    readPair(row);
    saving.current = true;
    try { await onMatch(rowId, tokenId); }
    finally { saving.current = false; }
  }
  return <>
    <div className="matching-board" aria-label={ariaLabel}>
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
            <span lang="de">{pair.left}</span>
            <span className={`matching-drop${correct ? " filled correct" : wrong?.row === pair.id ? " incorrect" : ""}`}>
              {correct ? <span lang="de">{pair.right} <Volume2 size={15} aria-hidden="true" /></span> : "เลือกคำตอบ"}
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
              onClick={() => { setSelected(id); play(pair.right); }}
              onDragStart={event => { event.dataTransfer.setData("text/plain", id); event.dataTransfer.effectAllowed = "move"; setSelected(id); }}>
              {pair.right} <Volume2 size={15} aria-hidden="true" />
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
