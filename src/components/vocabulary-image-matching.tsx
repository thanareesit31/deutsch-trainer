"use client";

import Image from "next/image";
import { Volume2 } from "lucide-react";
import { useVocabularyAudio } from "./vocabulary-audio";
import { CategoryTabLabel, LearningCategoryTabs } from "./learning-breadcrumbs";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Item } from "@/lib/content";
import {
  vocabularyImageEntries,
  vocabularyImageGroups,
  l13VocabularyImageEntries,
  l13VocabularyImageGroups,
  type CountryFlagId,
  type VocabularyImageGroupId,
} from "@/lib/vocabulary-image-content";
import {
  readLearnedImageVocabularyIds,
} from "@/lib/vocabulary-image-learning-storage";

import { useLessonState, lessonStateKeys } from "./lesson-state-provider";
import { ArticleDot, ArticleLegend } from "./profession-matching";

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

function GermanNoun({ value }: { value: string }) {
  const match = /^(der|die|das)\s+(.+)$/u.exec(value);
  if (!match) return <span lang="de">{value}</span>;
  return <span lang="de"><span className={`vocabulary-gender gender-${match[1]}`}>{match[1]}</span> {match[2]}</span>;
}

export function VocabularyImageMatching({ items, groupId }: { items: Item[]; groupId: VocabularyImageGroupId }) {
  const lessonState = useLessonState();
  const isL13 = groupId.startsWith("l13-");
  const groups = isL13 ? l13VocabularyImageGroups : vocabularyImageGroups;
  const definitions = isL13 ? l13VocabularyImageEntries : vocabularyImageEntries;
  const stateKey = isL13 ? lessonStateKeys.l13Images : lessonStateKeys.images;
  const groupIndex = groups.findIndex((entry) => entry.id === groupId);
  const group = groups[groupIndex] ?? groups[0];
  const entries = useMemo(() => definitions.map((definition) => {
    const candidates = [definition.german, ...(definition.lookup ?? [])].map((word) => word.toLocaleLowerCase("de"));
    const item = items.find((candidate) =>
      candidate.lessonId === (isL13 ? "L13" : "L01") && candidate.skill === "vocabulary" &&
      (candidate.collection === "core" || candidate.collection === "extra") &&
      (isL13 ? candidate.id === definition.id : candidates.includes((candidate.word || candidate.answer).trim().toLocaleLowerCase("de"))),
    );
    return { ...definition, itemId: item?.id ?? definition.id, meaning: item?.meaning ?? definition.meaning, audioRef: item?.audio };
  }), [items, definitions, isL13]);
  const { play, error: audioError } = useVocabularyAudio();
  const [learnedIds, setLearnedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<{ id: string; type: "word" | "image" } | null>(null);
  const [incorrectPair, setIncorrectPair] = useState<{ wordId: string; imageId: string } | null>(null);
  const [feedback, setFeedback] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLearnedIds(readLearnedImageVocabularyIds(lessonState.read(stateKey)));
    setHydrated(true);
  }, [lessonState.read, stateKey]);

  const learned = new Set(learnedIds);
  const byId = new Map(entries.map((entry) => [entry.id, entry] as const));
  const completedCount = entries.filter((entry) => learned.has(entry.itemId)).length;
  const groupEntries = entries.filter((entry) => entry.groupId === group.id);
  const groupCompletedCount = groupEntries.filter((entry) => learned.has(entry.itemId)).length;
  const groupWords = group.wordOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && !learned.has(entry.itemId) ? [entry] : [];
  });
  const groupPictures = group.pictureOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && !learned.has(entry.itemId) ? [entry] : [];
  });
  const matchedEntries = group.wordOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && learned.has(entry.itemId) ? [entry] : [];
  });
  const previousGroup = groups[groupIndex - 1];
  const nextGroup = groups[groupIndex + 1];
  const previousGroupsComplete = groups.slice(0, groupIndex).every((previous) =>
    entries.filter((entry) => entry.groupId === previous.id).every((entry) => learned.has(entry.itemId)),
  );
  function chooseMatch(id: string, type: "word" | "image") {
    const entry = byId.get(id);
    if (!entry) return;
    if (type === "word" && (!selectedId || selectedId.type === "word" || selectedId.id !== id)) play(entry.german, entry.audioRef);
    if (!selectedId || selectedId.type === type) {
      setSelectedId({ id, type });
      setIncorrectPair(null);
      setFeedback("");
      return;
    }
    if (selectedId.id !== id) {
      setIncorrectPair({
        wordId: selectedId.type === "word" ? selectedId.id : id,
        imageId: selectedId.type === "image" ? selectedId.id : id,
      });
      setSelectedId(null);
      setFeedback("ลองใหม่");
      return;
    }
    play(entry.german, entry.audioRef);
    const nextLearnedIds = [...new Set([...learnedIds, entry.itemId])];
    setLearnedIds(nextLearnedIds);
    lessonState.write(stateKey, JSON.stringify(nextLearnedIds));
    setIncorrectPair(null);
    setSelectedId(null);
    setFeedback("");
  }

  if (!hydrated) return <main className="vocabulary-image-matching" aria-busy="true" />;

  return (
    <main className={`vocabulary-image-matching${isL13 ? " profession-learning l13-city-learning" : ""}`}>
      <h1 className="sr-only">Bilder Wortschatz</h1>
      <LearningCategoryTabs currentKey={group.id}>
        {groups.map((category, index) => {
          const available = groups.slice(0, index).every((previous) =>
            entries.filter((entry) => entry.groupId === previous.id).every((entry) => learned.has(entry.itemId)));
          return available ? <Link key={category.id} href={category.route} title={category.germanTitle}
            aria-current={category.id === group.id ? "page" : undefined}><CategoryTabLabel german={category.germanTitle} thai={category.title} /></Link>
            : <span key={category.id} aria-disabled="true" title="เรียนหมวดก่อนหน้าให้ครบก่อน"><CategoryTabLabel german={category.germanTitle} thai={category.title} /></span>;
        })}
      </LearningCategoryTabs>
      {isL13 && <ArticleLegend />}
      <div className="vocabulary-image-progress" aria-live="polite">
        <span>เรียนแล้ว {completedCount} / {entries.length} คำ</span>
        <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${entries.length ? completedCount / entries.length * 100 : 0}%` }} /></div>
      </div>
      {!previousGroupsComplete ? <section className="vocabulary-image-locked">
        <h1>{group.title}</h1>
        <p>จับคู่หมวดก่อนหน้าให้ครบ แล้วจึงไปต่อ</p>
        <Link className="button primary" href={groups.find((previous) =>
          entries.filter((entry) => entry.groupId === previous.id).some((entry) => !learned.has(entry.itemId)))?.route ?? groups[0].route}>กลับหมวดที่กำลังเรียน</Link>
      </section> : <>
      <div className="vocabulary-image-groups">
        <section className={`vocabulary-image-group group-${group.id}`}>
          <header className="vocabulary-image-group-heading"><div><span className="eyebrow">{group.germanTitle}</span><h2>{group.title}</h2></div><span>{groupCompletedCount} / {groupEntries.length} คำ</span></header>
          {isL13 ? <>
            {groupWords.length > 0 && <div className="matching-options-sticky profession-options-sticky">
              <div className="profession-options" role="group" aria-label="ตัวเลือกคำศัพท์">
                {groupWords.map((entry) => <button key={entry.id} type="button" className={`profession-option${selectedId?.type === "word" && selectedId.id === entry.id ? " selected" : ""}`} aria-pressed={selectedId?.type === "word" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "word")}><ArticleDot article={entry.german.split(" ")[0]} />{entry.german}</button>)}
              </div>
            </div>}
            <section className="l13-city-grid" aria-label="ภาพสถานที่ จับคู่กับคำศัพท์">
              {groupEntries.map((entry) => {
                const matched = learned.has(entry.itemId);
                const wrong = incorrectPair?.imageId === entry.id;
                return <article className={`l13-city-card${matched ? " matched" : ""}${wrong ? " incorrect" : ""}`} key={entry.id}>
                  <button type="button" className="l13-city-image" aria-label={matched ? `ภาพ ${entry.german}` : "เลือกภาพนี้เพื่อจับคู่"} aria-pressed={selectedId?.type === "image" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "image")}>
                    <Image src={`/images/lektion-13-city/${entry.image}.webp`} alt="ภาพสถานที่สำหรับจับคู่" width={960} height={640} sizes="(max-width: 700px) 42vw, (max-width: 1100px) 29vw, (max-width: 1600px) 27vw, 25vw" />
                  </button>
                  {matched ? <div className="l13-city-answer"><button type="button" className="profession-label profession-audio-word" onClick={() => play(entry.german, entry.audioRef)}><ArticleDot article={entry.german.split(" ")[0]} /><span lang="de">{entry.german}</span><Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" /> ✓</button><small>{entry.meaning}</small></div>
                    : <button className="profession-slot l13-city-slot" type="button" disabled={selectedId?.type !== "word"} onClick={() => chooseMatch(entry.id, "image")}>{selectedId?.type === "word" ? "จับคู่คำนี้กับภาพ" : "เลือกคำศัพท์ด้านบนก่อน"}</button>}
                  {wrong && <p className="profession-error" role="status">ยังไม่ตรงกัน ลองเลือกใหม่ได้เลย</p>}
                </article>;
              })}
            </section>
          </> : <>
          {matchedEntries.length > 0 && <section className="vocabulary-image-paired-grid" aria-label="คำศัพท์ที่จับคู่แล้ว">
            {matchedEntries.map((entry) => <article className="vocabulary-image-paired-card" key={entry.itemId}>
              {entry.flag ? <CountryFlag flag={entry.flag} /> : <Image src={`/images/${isL13 ? "lektion-13-city" : "lektion-1-core-vocabulary-images"}/${entry.image}.${isL13 ? "svg" : "jpg"}`} alt={`ภาพสำหรับ ${entry.german}`} width={960} height={960} sizes="(max-width: 700px) 42vw, (max-width: 1100px) 28vw, 220px" />}
              <div className="vocabulary-image-paired-word"><button type="button" className="vocabulary-word-audio" aria-label={`ฟัง ${entry.german}`} title="กดเพื่อฟังเสียง" onClick={() => play(entry.german, entry.audioRef)}><GermanNoun value={entry.german} /><Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" /></button><small>{entry.meaning}</small></div>
            </article>)}
          </section>}
          <section className="vocabulary-image-word-list" aria-label={`${group.title} — คำภาษาเยอรมัน`}>
            {groupWords.map((entry) => <button className={`vocabulary-image-word ${selectedId?.type === "word" && selectedId.id === entry.id ? "selected" : ""} ${incorrectPair?.wordId === entry.id ? "incorrect" : ""}`} key={entry.id} type="button" aria-pressed={selectedId?.type === "word" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "word")}><GermanNoun value={entry.german} /><Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" /></button>)}
          </section>
          <section className={`vocabulary-image-picture-grid count-${groupPictures.length}`} aria-label={`${group.title} — เลือกรูปภาพ`}>
            {groupPictures.map((entry) => <button className={`vocabulary-image-picture ${selectedId?.type === "image" && selectedId.id === entry.id ? "selected" : ""} ${incorrectPair?.imageId === entry.id ? "incorrect" : ""}`} key={entry.id} type="button" aria-label="เลือกภาพนี้" aria-pressed={selectedId?.type === "image" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "image")}>
              {entry.flag ? <CountryFlag flag={entry.flag} /> : <Image src={`/images/${isL13 ? "lektion-13-city" : "lektion-1-core-vocabulary-images"}/${entry.image}.${isL13 ? "svg" : "jpg"}`} alt="ภาพประกอบสำหรับจับคู่คำศัพท์" width={960} height={960} sizes="(max-width: 700px) 42vw, (max-width: 1100px) 28vw, 220px" />}
            </button>)}
          </section>
          </>}
        </section>
      </div>
      <p className={`vocabulary-image-feedback ${feedback === "ลองใหม่" ? "incorrect" : ""}`} role="status">{feedback}</p>
      </>}
      {audioError && <p role="status" className="alphabet-audio-error">{audioError}</p>}
      <div className="vocabulary-image-done-actions">
        <Link className="button secondary" href={previousGroup?.route ?? (isL13 ? "/learn/L13/vocabulary" : "/learn/L01/vocabulary/alphabet")}>ย้อนกลับ</Link>
        {previousGroupsComplete && groupCompletedCount === groupEntries.length && groupEntries.length > 0 && (nextGroup
          ? <Link className="button primary" href={nextGroup.route}>หน้าถัดไป</Link>
          : <Link className="button primary" href={isL13 ? "/learn/L13/vocabulary" : "/learn/L01/vocabulary"}>กลับไปที่คำศัพท์</Link>)}
      </div>
    </main>
  );
}
