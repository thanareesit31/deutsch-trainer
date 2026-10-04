"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Item } from "@/lib/content";
import {
  vocabularyImageEntries,
  vocabularyImageGroups,
  type CountryFlagId,
  type VocabularyImageGroupId,
} from "@/lib/vocabulary-image-content";
import {
  readLearnedImageVocabularyIds,
  writeLearnedImageVocabularyIds,
} from "@/lib/vocabulary-image-learning-storage";

function CountryFlag({ flag }: { flag: CountryFlagId }) {
  const common = { viewBox: "0 0 3 2", className: "vocabulary-image-flag", "aria-hidden": true as const };
  switch (flag) {
    case "france": return <svg {...common}><path fill="#002395" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#ed2939" d="M2 0h1v2H2z"/></svg>;
    case "australia": return <svg {...common}><path fill="#012169" d="M0 0h3v2H0z"/><path stroke="#fff" strokeWidth=".35" d="M0 0l1.5 1M1.5 0L0 1"/><path stroke="#c8102e" strokeWidth=".13" d="M0 0l1.5 1M1.5 0L0 1"/><path fill="#fff" d="M.58 0h.3v1H.58zM0 .35h1.45v.3H0z"/><path fill="#c8102e" d="M.65 0h.16v1H.65zM0 .42h1.45v.16H0z"/><path fill="#fff" d="M2.1.25l.08.2.22-.03-.16.14.1.2-.2-.11-.18.13.05-.22-.18-.12.22-.01zM2.58.72l.07.16.17-.02-.13.11.07.16-.15-.09-.14.1.04-.17-.14-.09.17-.01zM2.12 1.25l.07.17.19-.03-.14.12.08.17-.17-.1-.15.11.04-.18-.15-.1.18-.01zM2.7 1.55l.06.15.17-.02-.13.11.07.15-.15-.08-.13.09.03-.16-.13-.09.16-.01z"/></svg>;
    case "thailand": return <svg {...common}><path fill="#ed1c24" d="M0 0h3v2H0z"/><path fill="#fff" d="M0 .28h3v1.44H0z"/><path fill="#241d4f" d="M0 .56h3v.88H0z"/></svg>;
    case "germany": return <svg {...common}><path fill="#000" d="M0 0h3v.67H0z"/><path fill="#d00" d="M0 .67h3v.66H0z"/><path fill="#ffce00" d="M0 1.33h3v.67H0z"/></svg>;
    case "austria": return <svg {...common}><path fill="#ed2939" d="M0 0h3v2H0z"/><path fill="#fff" d="M0 .67h3v.66H0z"/></svg>;
    case "switzerland": return <svg {...common}><path fill="#d52b1e" d="M0 0h3v2H0z"/><path fill="#fff" d="M1.25 .35h.5v1.3h-.5zM.85 .75h1.3v.5H.85z"/></svg>;
    case "turkey": return <svg {...common}><path fill="#e30a17" d="M0 0h3v2H0z"/><circle cx="1.12" cy="1" r=".5" fill="#fff"/><circle cx="1.27" cy="1" r=".4" fill="#e30a17"/><path fill="#fff" d="M1.62.71l.1.23.25-.04-.18.16.1.23-.22-.13-.2.14.06-.25-.2-.13.25-.02z"/></svg>;
    case "japan": return <svg {...common}><path fill="#fff" d="M0 0h3v2H0z"/><circle cx="1.5" cy="1" r=".55" fill="#bc002d"/></svg>;
    case "china": return <svg {...common}><path fill="#de2910" d="M0 0h3v2H0z"/><path fill="#ffde00" d="M.52.28l.1.25.27.02-.21.16.07.26-.23-.15-.22.15.07-.26-.21-.16.27-.02zM1.12.2l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01zM1.33.43l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01zM1.32.72l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01zM1.1.91l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01z"/></svg>;
    case "spain": return <svg {...common}><path fill="#aa151b" d="M0 0h3v2H0z"/><path fill="#f1bf00" d="M0 .45h3v1.1H0z"/><path fill="#aa151b" d="M.8.65h.16v.55H.8z"/><path fill="#aa151b" d="M.96.8h.25v.12H.96z"/></svg>;
    case "italy": return <svg {...common}><path fill="#009246" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#ce2b37" d="M2 0h1v2H2z"/></svg>;
    case "usa": return <svg {...common}><path fill="#b22234" d="M0 0h3v2H0z"/>{Array.from({ length: 6 }, (_, index) => <path key={index} fill="#fff" d={`M0 ${index * 0.31 + 0.15}h3v.15H0z`}/>)}<path fill="#3c3b6e" d="M0 0h1.35v1.08H0z"/><g fill="#fff">{Array.from({ length: 9 }, (_, index) => <circle key={index} cx={index % 2 ? 0.9 : 0.35} cy={Math.floor(index / 2) * 0.2 + 0.12} r=".045"/>)}</g></svg>;
    case "laos": return <svg {...common}><path fill="#ce1126" d="M0 0h3v2H0z"/><path fill="#002868" d="M0 .5h3v1H0z"/><circle cx="1.5" cy="1" r=".34" fill="#fff"/></svg>;
    case "eritrea": return <svg {...common}><path fill="#12ad2b" d="M0 0h3v.55H0z"/><path fill="#4189dd" d="M0 1.45h3V2H0z"/><path fill="#ea1d2c" d="M0 0l3 1-3 1z"/><path fill="#f4c542" d="M.55.72l.12.18.2-.05-.13.16.12.17-.2-.07-.14.16.01-.21-.18-.1.2-.05z"/></svg>;
    case "argentina": return <svg {...common}><path fill="#74acdf" d="M0 0h3v2H0z"/><path fill="#fff" d="M0 .67h3v.66H0z"/><circle cx="1.5" cy="1" r=".16" fill="#f6b40e"/><path stroke="#f6b40e" strokeWidth=".07" d="M1.5 .7v-.12m0 .84v-.12m-.3-.3h-.12m.84 0H1.8"/></svg>;
  }
}

export function VocabularyImageMatching({ items, groupId }: { items: Item[]; groupId: VocabularyImageGroupId }) {
  const groupIndex = vocabularyImageGroups.findIndex((entry) => entry.id === groupId);
  const group = vocabularyImageGroups[groupIndex] ?? vocabularyImageGroups[0];
  const entries = useMemo(() => vocabularyImageEntries.map((definition) => {
    const candidates = [definition.german, ...(definition.lookup ?? [])].map((word) => word.toLocaleLowerCase("de"));
    const item = items.find((candidate) =>
      candidate.skill === "vocabulary" &&
      (candidate.collection === "core" || candidate.collection === "extra") &&
      candidates.includes((candidate.word || candidate.answer).trim().toLocaleLowerCase("de")),
    );
    return { ...definition, itemId: item?.id ?? definition.id, meaning: item?.meaning ?? definition.meaning };
  }), [items]);
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<{ id: string; type: "word" | "image" } | null>(null);
  const [incorrectIds, setIncorrectIds] = useState<string[]>([]);
  const [replaying, setReplaying] = useState(false);
  const [replayMatchedIds, setReplayMatchedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLearnedIds(readLearnedImageVocabularyIds());
    setHydrated(true);
  }, []);

  const learned = new Set(learnedIds);
  const replayMatched = new Set(replayMatchedIds);
  const byId = new Map(entries.map((entry) => [entry.id, entry] as const));
  const completedCount = entries.filter((entry) => learned.has(entry.itemId)).length;
  const groupEntries = entries.filter((entry) => entry.groupId === group.id);
  const groupCompletedCount = groupEntries.filter((entry) => learned.has(entry.itemId)).length;
  const groupWords = group.wordOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && (replaying ? !replayMatched.has(entry.id) : !learned.has(entry.itemId)) ? [entry] : [];
  });
  const groupPictures = group.pictureOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && (replaying ? !replayMatched.has(entry.id) : !learned.has(entry.itemId)) ? [entry] : [];
  });
  const matchedEntries = group.wordOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && (replaying ? replayMatched.has(entry.id) : learned.has(entry.itemId)) ? [entry] : [];
  });
  const previousGroup = vocabularyImageGroups[groupIndex - 1];
  const nextGroup = vocabularyImageGroups[groupIndex + 1];
  const previousGroupsComplete = vocabularyImageGroups.slice(0, groupIndex).every((previous) =>
    entries.filter((entry) => entry.groupId === previous.id).every((entry) => learned.has(entry.itemId)),
  );
  const groupIsComplete = groupEntries.length > 0 && groupCompletedCount === groupEntries.length;

  function startReplay() {
    setReplaying(true);
    setReplayMatchedIds([]);
    setSelectedId(null);
    setIncorrectIds([]);
    setFeedback("");
  }

  function chooseMatch(id: string, type: "word" | "image") {
    if (!selectedId || selectedId.type === type) {
      setSelectedId({ id, type });
      setIncorrectIds([]);
      setFeedback("");
      return;
    }
    if (selectedId.id !== id) {
      setIncorrectIds([selectedId.id, id]);
      setSelectedId(null);
      setFeedback("ลองใหม่");
      return;
    }
    const entry = byId.get(id);
    if (!entry) return;
    if (replaying) {
      setReplayMatchedIds((current) => [...new Set([...current, entry.id])]);
      setSelectedId(null);
      setIncorrectIds([]);
      setFeedback("");
      return;
    }
    const nextLearnedIds = [...new Set([...learnedIds, entry.itemId])];
    setLearnedIds(nextLearnedIds);
    writeLearnedImageVocabularyIds(nextLearnedIds);
    setIncorrectIds([]);
    setSelectedId(null);
    setFeedback("");
  }

  if (!hydrated) return <main className="vocabulary-image-matching" aria-busy="true" />;

  if (!previousGroupsComplete) {
    const firstIncompleteGroup = vocabularyImageGroups.slice(0, groupIndex).find((previous) =>
      entries.filter((entry) => entry.groupId === previous.id).some((entry) => !learned.has(entry.itemId)),
    );
    return (
      <main className="vocabulary-image-matching">
        <Link className="back-link" href="/learn/L01/vocabulary">← กลับ Wortschatz</Link>
        <section className="vocabulary-image-locked">
          <span className="eyebrow">LEKTION 1 · WORTSCHATZ</span>
          <h1>{group.title}</h1>
          <p>จับคู่หมวดก่อนหน้าให้ครบ แล้วจึงไปต่อ</p>
          <Link className="button primary" href={firstIncompleteGroup?.route ?? vocabularyImageGroups[0].route}>ย้อนกลับ</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="vocabulary-image-matching">
      <div className="vocabulary-image-navigation">
        <Link className="back-link" href="/learn/L01/vocabulary">← กลับ Wortschatz</Link>
        {groupIsComplete && <button className="button secondary" type="button" onClick={startReplay}>เรียนซ้ำ</button>}
      </div>
      <header className="vocabulary-image-heading">
        <span className="eyebrow">LEKTION 1 · WORTSCHATZ</span>
        <h1 lang="de">{group.germanTitle}</h1>
        <p>{group.title}</p>
      </header>
      <div className="vocabulary-image-progress" aria-live="polite">
        <span>เรียนแล้ว {completedCount} / {entries.length} คำ</span>
        <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${entries.length ? completedCount / entries.length * 100 : 0}%` }} /></div>
      </div>
      <div className="vocabulary-image-groups">
        <section className={`vocabulary-image-group group-${group.id}`}>
          <header className="vocabulary-image-group-heading"><span>{groupCompletedCount} / {groupEntries.length} คำ</span></header>
          {matchedEntries.length > 0 && <section className="vocabulary-image-paired-grid" aria-label="คำศัพท์ที่จับคู่แล้ว">
            {matchedEntries.map((entry) => <article className="vocabulary-image-paired-card" key={entry.itemId}>
              {entry.flag ? <CountryFlag flag={entry.flag} /> : <Image src={`/images/lektion-1-core-vocabulary-images/${entry.image}.jpg`} alt={`ภาพสำหรับ ${entry.german}`} width={960} height={960} sizes="(max-width: 700px) 42vw, (max-width: 1100px) 28vw, 220px" />}
              <div className="vocabulary-image-paired-word"><strong lang="de">{entry.german}</strong><span>({entry.reading})</span><small>{entry.meaning}</small></div>
            </article>)}
          </section>}
          <section className="vocabulary-image-word-list" aria-label={`${group.title} — คำภาษาเยอรมัน`}>
            {groupWords.map((entry) => <button className={`vocabulary-image-word ${selectedId?.type === "word" && selectedId.id === entry.id ? "selected" : ""} ${incorrectIds.includes(entry.id) ? "incorrect" : ""}`} key={entry.id} type="button" aria-pressed={selectedId?.type === "word" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "word")}><span lang="de">{entry.german}</span></button>)}
          </section>
          <section className={`vocabulary-image-picture-grid count-${groupPictures.length}`} aria-label={`${group.title} — เลือกรูปภาพ`}>
            {groupPictures.map((entry) => <button className={`vocabulary-image-picture ${selectedId?.type === "image" && selectedId.id === entry.id ? "selected" : ""} ${incorrectIds.includes(entry.id) ? "incorrect" : ""}`} key={entry.id} type="button" aria-label="เลือกภาพนี้" aria-pressed={selectedId?.type === "image" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "image")}>
              {entry.flag ? <CountryFlag flag={entry.flag} /> : <Image src={`/images/lektion-1-core-vocabulary-images/${entry.image}.jpg`} alt="ภาพประกอบสำหรับจับคู่คำศัพท์" width={960} height={960} sizes="(max-width: 700px) 42vw, (max-width: 1100px) 28vw, 220px" />}
            </button>)}
          </section>
        </section>
      </div>
      <p className={`vocabulary-image-feedback ${feedback === "ลองใหม่" ? "incorrect" : ""}`} role="status">{feedback}</p>
      <div className="vocabulary-image-done-actions">
        <Link className="button secondary" href={previousGroup?.route ?? "/learn/L01/vocabulary/alphabet"}>ย้อนกลับ</Link>
        {groupCompletedCount === groupEntries.length && groupEntries.length > 0 && (nextGroup
          ? <Link className="button primary" href={nextGroup.route}>ไปต่อ</Link>
          : <Link className="button primary" href="/learn/L01/vocabulary">กลับไปที่คำศัพท์</Link>)}
      </div>
    </main>
  );
}
