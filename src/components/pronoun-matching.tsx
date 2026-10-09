"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, Check } from "lucide-react";
import type { Item } from "@/lib/content";
import { activityPairs, optionValue, type LearningActivity } from "@/lib/guided-learning";
import { pronounScenes, politePluralScene, pronounGroups } from "@/lib/pronoun-learning";
import { useVocabularyAudio } from "./vocabulary-audio";
import { GermanListenText } from "./german-listen-text";

function shuffle<T>(values: T[]) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function PronounScene({ id, plural = false, reveal = false }: { id: string; plural?: boolean; reveal?: boolean }) {
  const scene = plural && id === "L02-pronoun-Sie" ? politePluralScene : pronounScenes[id];
  return <>
    <span className="quiet-pill pronoun-number-badge">{scene.group ? "Plural · พหูพจน์" : "Singular · เอกพจน์"}</span>
    <span className="pronoun-scene full-scene">
      <span className={`pronoun-person${scene.group ? " group" : ""}`}>
        <img draggable={false} src={scene.image} alt={reveal ? scene.caption : "ภาพประกอบสรรพนาม"} width={1024} height={683} />
        {reveal && <small>{scene.target}</small>}
      </span>
    </span>
    {reveal && <span className="pronoun-scene-caption">{scene.caption}</span>}
  </>;
}

export function PronounMatching({ activity, items, matchedIds, busy, onMatch }: {
  activity: LearningActivity; items: Item[]; matchedIds: string[]; busy: boolean; onMatch: (id: string) => Promise<void>;
}) {
  const pairs = activityPairs(activity, items);
  const [words] = useState(() => {
    const sie = pairs.find(pair => pair.id === "L02-pronoun-Sie");
    const shuffled = shuffle(pairs.filter(pair => pair.id !== "L02-pronoun-Sie"));
    return sie ? [...shuffled, sie] : shuffled;
  });
  const [pictures] = useState(() => {
    if (!pairs.some(pair => pair.id === "L02-pronoun-Sie")) return shuffle(pairs);
    return [...pairs.filter(pair => pair.id === "L02-pronoun-Sie"), ...shuffle(pairs.filter(pair => pair.id !== "L02-pronoun-Sie"))];
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<{word: string; picture: string} | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);
  const { play, error } = useVocabularyAudio();
  useEffect(() => () => {if (timer.current) clearTimeout(timer.current);}, []);
  async function place(id: string, offered = selected) {
    if (matchedIds.includes(id)) {
      play(optionValue(pairs.find(p => p.id === id)!.right, items));
      return;
    }
    if (!offered || busy || saving.current || matchedIds.includes(offered)) return;
    const offeredPair = pairs.find(pair => pair.id === offered);
    const targetPair = pairs.find(pair => pair.id === id);
    if (!offeredPair || !targetPair) return;
    setSelected(null);
    if (timer.current) clearTimeout(timer.current);
    if (optionValue(offeredPair.right, items) !== optionValue(targetPair.right, items)) {
      setWrong({word: offered, picture: id});
      timer.current = setTimeout(() => setWrong(null), 700);
      return;
    }
    setWrong(null);
    play(optionValue(pairs.find(p => p.id === id)!.right, items));
    saving.current = true;
    try { await onMatch(id); } finally {saving.current = false;}
  }
  return <>
    <p className="pronoun-scene-guide">ดูว่าใครเป็นผู้พูด และกำลังพูดกับใครหรือพูดถึงใคร</p>
    <div className="matching-options-sticky">
      <div className="pronoun-word-bank" aria-label="สรรพนามให้เลือก">
        {words.filter(p => !matchedIds.includes(p.id)).map(pair => <button type="button" key={pair.id} lang="de" data-pronoun-word={pair.id}
          className={`matching-token${selected === pair.id ? " selected" : ""}${wrong?.word === pair.id ? " incorrect" : ""}`}
          disabled={busy} draggable={!busy} aria-pressed={selected === pair.id}
          onClick={() => {setSelected(pair.id); play(optionValue(pair.right, items));}}
          onDragStart={event => {event.dataTransfer.setData("text/plain", pair.id); event.dataTransfer.effectAllowed = "move"; setSelected(pair.id);}}>
          {optionValue(pair.right, items)} <Volume2 size={16} aria-hidden="true" />
        </button>)}
      </div>
    </div>
    <div className={`pronoun-picture-grid${pairs.some(pair => pair.id === "L02-pronoun-Sie") ? " pronoun-second-person-grid" : ""}`} aria-label="จับคู่สรรพนามกับภาพบุคคล">
      {pictures.map(pair => {
        const correct = matchedIds.includes(pair.id);
        return <button type="button" key={pair.id} data-pronoun-id={pair.id}
          aria-label={correct ? `ฟังเสียง ${optionValue(pair.right, items)}` : "จับคู่ภาพบุคคล"}
          className={`pronoun-picture${correct ? " correct" : ""}${wrong?.picture === pair.id ? " incorrect" : ""}`}
          disabled={busy && !correct} onClick={() => void place(pair.id)}
          onDragOver={event => event.preventDefault()} onDrop={event => {event.preventDefault(); void place(pair.id, event.dataTransfer.getData("text/plain"));}}>
          {pair.id === "L02-pronoun-Sie" ? <div className="pronoun-sie-scenes">
            <div className="pronoun-sie-context"><PronounScene id={pair.id} reveal={correct} /></div>
            <div className="pronoun-sie-context"><PronounScene id={pair.id} plural reveal={correct} /></div>
          </div> : <PronounScene id={pair.id} reveal={correct} />}
          <span className={`pronoun-answer${correct ? " correct" : ""}`}>{correct ? <><span lang="de">{optionValue(pair.right, items)}</span><Volume2 size={16} aria-hidden="true" /><Check size={16} aria-hidden="true" /></> : "วางสรรพนามที่นี่"}</span>
          {correct && <span className="pronoun-meaning">{items.find(i => i.id === pair.id)?.meaning}</span>}
        </button>;
      })}
    </div>
    <p role="status" className="guided-feedback wrong">{wrong ? "ยังไม่ตรงกับภาพ ลองเลือกใหม่ได้เลย" : error}</p>
  </>;
}

export function PronounSummary({ items }: { items: Item[] }) {
  const groups = [
      { ...pronounGroups[0], rows: [
      { id: "L02-pronoun-ich", plural: false, meaning: "ฉัน", context: "ผู้พูดพูดถึงตัวเอง" },
      { id: "L02-pronoun-wir", plural: true, meaning: "พวกเรา", context: "ผู้พูดพูดถึงกลุ่มที่มีตัวเองรวมอยู่ด้วย" },
    ] },
    { ...pronounGroups[1], rows: [
      { id: "L02-pronoun-du", plural: false, meaning: "เธอ / คุณ", context: "ผู้พูดพูดกับผู้ฟังหนึ่งคน", form: "กันเอง · informell" },
      { id: "L02-pronoun-Sie", plural: false, meaning: "คุณ / ท่าน", context: "ผู้พูดพูดกับผู้ฟังหนึ่งคน", form: "สุภาพ · formell" },
      { id: "L02-pronoun-ihr", plural: true, meaning: "พวกเธอ / พวกคุณ", context: "ผู้พูดพูดกับผู้ฟังหลายคน", form: "กันเอง · informell" },
      { id: "L02-pronoun-Sie", plural: true, meaning: "พวกคุณ / พวกท่าน", context: "ผู้พูดพูดกับผู้ฟังหลายคน", form: "สุภาพ · formell" },
    ] },
    { ...pronounGroups[2], rows: [
      { id: "L02-pronoun-er", plural: false, meaning: "เขา (ผู้ชาย)", context: "ผู้พูดกล่าวถึงผู้ชายหนึ่งคน" },
      { id: "L02-pronoun-sie-sg", plural: false, meaning: "เธอ / เขา (ผู้หญิง)", context: "ผู้พูดกล่าวถึงผู้หญิงหนึ่งคน" },
      { id: "L02-pronoun-sie-pl", plural: true, meaning: "พวกเขา", context: "ผู้พูดกล่าวถึงคนหลายคน" },
    ] },
  ];
  return <div className="pronoun-summary">
    <h2>Personalpronomen · ตารางสรุป</h2>
    <p>sie ใช้กล่าวถึงผู้หญิงหนึ่งคนหรือคนหลายคน ส่วน Sie ขึ้นต้นด้วยตัวใหญ่ ใช้พูดกับผู้ฟังแบบสุภาพได้ทั้งหนึ่งคนและหลายคน</p>
    <table className="pronoun-summary-table">
      <colgroup><col className="pronoun-col-group" /><col className="pronoun-col-number" /><col className="pronoun-col-thai" /><col className="pronoun-col-german" /><col className="pronoun-col-context" /></colgroup>
      <thead><tr><th scope="col">หมวด</th><th scope="col">บุรุษ / จำนวน</th><th scope="col">Thai</th><th scope="col">Deutsch</th><th scope="col">ผู้พูดกำลังพูดกับใครหรือพูดถึงใคร</th></tr></thead>
      {groups.map(group => <tbody key={group.label}>{group.rows.map((row, index) => {
        const pronoun = items.find(item => item.id === row.id)?.pronounContent?.pronoun;
        const firstOfNumber = index === 0 || group.rows[index - 1].plural !== row.plural;
        const numberRows = group.rows.filter(entry => entry.plural === row.plural).length;
        return <tr key={`${row.id}-${row.plural}`}>
          {index === 0 && <th scope="rowgroup" rowSpan={group.rows.length} className="pronoun-summary-group">{group.thai}</th>}
          {firstOfNumber && <td rowSpan={numberRows}><span lang="de">{group.label}<br />({row.plural ? "Plural" : "Singular"})</span><small>{row.plural ? "พหูพจน์" : "เอกพจน์"}</small></td>}
          <td>{row.meaning}{"form" in row && <small>{row.form}</small>}</td>
          <th scope="row" className="pronoun-summary-word"><GermanListenText text={pronoun ?? ""} /></th>
          <td>{row.context}</td>
        </tr>;
      })}</tbody>)}
    </table>
  </div>;
}
