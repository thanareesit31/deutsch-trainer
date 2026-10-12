"use client";

import Image from "next/image";
import { Volume2 } from "lucide-react";
import { useVocabularyAudio } from "./vocabulary-audio";
import { CategoryTabLabel, LearningCategoryTabs } from "./learning-breadcrumbs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Item } from "@/lib/content";
import {
  vocabularyImageActivity,
  vocabularyImageEntries,
  vocabularyImageGroups,
  l13VocabularyImageEntries,
  l13VocabularyImageGroups,
  lessonVocabularyImageEntries,
  lessonVocabularyImageGroups,
  vocabularyImagePages,
  catalogVocabularyImageSource,
  type CountryFlagId,
  type VocabularyImageGroupId,
  type VocabularyImageGroup,
  type VocabularyImageEntryDefinition,
} from "@/lib/vocabulary-image-content";
import {
  readLearnedImageVocabularyIds,
  writeLearnedImageVocabularyIds,
} from "@/lib/vocabulary-image-learning-storage";

import { useLessonState, lessonStateKeys } from "./lesson-state-provider";
import { isTestWorkspaceUser, useStore } from "./store";
import { ArticleDot, ArticleLegend } from "./profession-matching";

export function CountryFlag({ flag }: { flag: CountryFlagId }) {
  const viewBox = flag === "switzerland" ? "0 0 2 2" : ["australia", "eritrea"].includes(flag) ? "0 0 4 2" : flag === "usa" ? "0 0 3.8 2" : "0 0 3 2";
  const common = { viewBox, className: `vocabulary-image-flag flag-${flag}`, "aria-hidden": true as const };
  switch (flag) {
    case "france": return <svg {...common}><path fill="#002395" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#ed2939" d="M2 0h1v2H2z"/></svg>;
    case "australia": return <svg {...common}><path fill="#012169" d="M0 0h4v2H0z"/><path stroke="#fff" strokeWidth=".24" d="M0 0l2 1M2 0L0 1"/><path stroke="#c8102e" strokeWidth=".1" d="M0 0l2 1M2 0L0 1"/><path stroke="#fff" strokeWidth=".3" d="M1 0v1M0 .5h2"/><path stroke="#c8102e" strokeWidth=".13" d="M1 0v1M0 .5h2"/><polygon fill="#fff" points="1,1.33 1.06,1.47 1.22,1.48 1.1,1.58 1.14,1.74 1,1.66 .86,1.74 .9,1.58 .78,1.48 .94,1.47"/><polygon fill="#fff" points="2.72,.2 2.78,.33 2.93,.34 2.82,.44 2.86,.58 2.72,.5 2.59,.58 2.62,.44 2.51,.34 2.66,.33"/><polygon fill="#fff" points="3.43,.73 3.49,.86 3.64,.87 3.53,.97 3.57,1.11 3.43,1.03 3.3,1.11 3.33,.97 3.22,.87 3.37,.86"/><polygon fill="#fff" points="2.88,1.21 2.94,1.34 3.09,1.35 2.98,1.45 3.02,1.59 2.88,1.51 2.75,1.59 2.78,1.45 2.67,1.35 2.82,1.34"/><polygon fill="#fff" points="2.25,1.65 2.31,1.78 2.46,1.79 2.35,1.89 2.39,2.03 2.25,1.95 2.12,2.03 2.15,1.89 2.04,1.79 2.19,1.78"/><polygon fill="#fff" points="3.55,1.45 3.61,1.58 3.76,1.59 3.65,1.69 3.69,1.83 3.55,1.75 3.42,1.83 3.45,1.69 3.34,1.59 3.49,1.58"/></svg>;
    case "thailand": return <svg {...common}><path fill="#ed1c24" d="M0 0h3v2H0z"/><path fill="#fff" d="M0 .28h3v1.44H0z"/><path fill="#241d4f" d="M0 .56h3v.88H0z"/></svg>;
    case "germany": return <svg {...common}><path fill="#000" d="M0 0h3v.67H0z"/><path fill="#d00" d="M0 .67h3v.66H0z"/><path fill="#ffce00" d="M0 1.33h3v.67H0z"/></svg>;
    case "austria": return <svg {...common}><path fill="#ed2939" d="M0 0h3v2H0z"/><path fill="#fff" d="M0 .67h3v.66H0z"/></svg>;
    case "switzerland": return <svg {...common}><path fill="#d52b1e" d="M0 0h2v2H0z"/><path fill="#fff" d="M.8 .3h.4v1.4H.8zM.3 .8h1.4v.4H.3z"/></svg>;
    case "turkey": return <svg {...common}><path fill="#e30a17" d="M0 0h3v2H0z"/><circle cx="1.12" cy="1" r=".5" fill="#fff"/><circle cx="1.27" cy="1" r=".4" fill="#e30a17"/><path fill="#fff" d="M1.62.71l.1.23.25-.04-.18.16.1.23-.22-.13-.2.14.06-.25-.2-.13.25-.02z"/></svg>;
    case "japan": return <svg {...common}><path fill="#fff" d="M0 0h3v2H0z"/><circle cx="1.5" cy="1" r=".55" fill="#bc002d"/></svg>;
    case "china": return <svg {...common}><path fill="#de2910" d="M0 0h3v2H0z"/><path fill="#ffde00" d="M.52.28l.1.25.27.02-.21.16.07.26-.23-.15-.22.15.07-.26-.21-.16.27-.02zM1.12.2l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01zM1.33.43l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01zM1.32.72l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01zM1.1.91l.04.1.1.01-.08.06.03.1-.09-.06-.08.06.03-.1-.08-.06.1-.01z"/></svg>;
    case "spain": return <svg {...common}><path fill="#aa151b" d="M0 0h3v2H0z"/><path fill="#f1bf00" d="M0 .45h3v1.1H0z"/><path fill="#aa151b" d="M.8.65h.16v.55H.8z"/><path fill="#aa151b" d="M.96.8h.25v.12H.96z"/></svg>;
    case "italy": return <svg {...common}><path fill="#009246" d="M0 0h1v2H0z"/><path fill="#fff" d="M1 0h1v2H1z"/><path fill="#ce2b37" d="M2 0h1v2H2z"/></svg>;
    case "usa": return <svg {...common}>{Array.from({ length: 13 }, (_, index) => <rect key={index} x="0" y={index * (2 / 13)} width="3.8" height={2 / 13 + .005} fill={index % 2 ? "#fff" : "#b22234"}/>)}<rect fill="#3c3b6e" width="1.55" height="1.08"/><g fill="#fff">{Array.from({ length: 45 }, (_, index) => <circle key={index} cx={index % 2 ? .98 : .35} cy={Math.floor(index / 2) * .095 + .07} r=".025"/>)}</g></svg>;
    case "laos": return <svg {...common}><path fill="#ce1126" d="M0 0h3v2H0z"/><path fill="#002868" d="M0 .5h3v1H0z"/><circle cx="1.5" cy="1" r=".34" fill="#fff"/></svg>;
    case "eritrea": return <svg {...common}><path fill="#12ad2b" d="M0 0h4v.56H0z"/><path fill="#4189dd" d="M0 1.44h4V2H0z"/><path fill="#ea1d2c" d="M0 0l4 1-4 1z"/><g fill="none" stroke="#f4c542" strokeWidth=".055"><path d="M.87 .48C.34 .7 .35 1.3 .87 1.52M.87 .48C1.4 .7 1.39 1.3 .87 1.52"/><path d="M.47 .69l.2 .05M.38 .87l.22 .04M.38 1.08l.22-.02M.49 1.29l.19-.07M1.27 .69l-.2 .05M1.36 .87l-.22 .04M1.36 1.08l-.22-.02M1.25 1.29l-.19-.07"/></g></svg>;
    case "argentina": return <svg {...common}><path fill="#74acdf" d="M0 0h3v2H0z"/><path fill="#fff" d="M0 .67h3v.66H0z"/><circle cx="1.5" cy="1" r=".16" fill="#f6b40e"/><path stroke="#f6b40e" strokeWidth=".07" d="M1.5 .7v-.12m0 .84v-.12m-.3-.3h-.12m.84 0H1.8"/></svg>;
  }
}

function GermanNoun({ value }: { value: string }) {
  const match = /^(der|die|das)\s+(.+)$/u.exec(value);
  if (!match) return <span lang="de">{value}</span>;
  return <span lang="de"><span className={`vocabulary-gender gender-${match[1]}`}>{match[1]}</span> {match[2]}</span>;
}

export function VocabularyImageMatching({ items, groupId, lessonId }: { items: Item[]; groupId: VocabularyImageGroupId; lessonId: string }) {
  const searchParams = useSearchParams();
  const { user } = useStore();
  const allowIncompleteNavigation = isTestWorkspaceUser(user);
  const lessonState = useLessonState();
  const isL13 = groupId.startsWith("l13-");
  const isL02Familienstand = lessonId === "L02";
  const isCatalogLesson = isL02Familienstand || /^L(?:0[3-9]|1[0-2]|1[4-5])$/u.test(lessonId);
  const isGroupedImageVocabulary = lessonId === "L01" || isL13 || isCatalogLesson;
  const isCountryGroup = lessonId === "L01" && groupId === "countries";
  const catalogGroups = useMemo(() => lessonVocabularyImageGroups(items, lessonId, isL02Familienstand ? ["Familienstand"] : undefined), [items, lessonId, isL02Familienstand]);
  const catalogDefinitions = useMemo(() => lessonVocabularyImageEntries(items, catalogGroups), [items, catalogGroups]);
  const groups: readonly VocabularyImageGroup[] = isL13 ? l13VocabularyImageGroups : isCatalogLesson ? catalogGroups : vocabularyImageGroups;
  const definitions: VocabularyImageEntryDefinition[] = isL13 ? l13VocabularyImageEntries : isCatalogLesson ? catalogDefinitions : vocabularyImageEntries;
  const stateKey = isL13 ? lessonStateKeys.l13Images : isL02Familienstand ? lessonStateKeys.l02Vocabulary : isCatalogLesson ? lessonStateKeys.vocabularyImages(lessonId) : lessonStateKeys.images;
  const groupIndex = groups.findIndex((entry) => entry.id === groupId);
  const group = groups[groupIndex] ?? groups[0];
  const entries = useMemo(() => definitions.map((definition) => {
    if (isCatalogLesson) {
      const item = items.find((candidate) => candidate.id === definition.id);
      return { ...definition, itemId: item?.id ?? definition.id, itemIds: definition.itemIds ?? [item?.id ?? definition.id], meaning: item?.meaning ?? definition.meaning, audioRef: item?.audio };
    }
    const candidates = [definition.german, ...(definition.lookup ?? [])].map((word) => word.toLocaleLowerCase("de"));
    const item = items.find((candidate) =>
      candidate.lessonId === (isL13 ? "L13" : "L01") && candidate.skill === "vocabulary" &&
      (candidate.collection === "core" || candidate.collection === "extra") &&
      (isL13 ? candidate.id === definition.id : candidates.includes((candidate.word || candidate.answer).trim().toLocaleLowerCase("de"))),
    );
    return { ...definition, itemId: item?.id ?? definition.id, itemIds: definition.itemIds ?? [item?.id ?? definition.id], meaning: item?.meaning ?? definition.meaning, audioRef: item?.audio };
  }), [items, definitions, isL13, isCatalogLesson]);
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
  const isPaginated = isCatalogLesson || isCountryGroup;
  const pages = isPaginated ? vocabularyImagePages(group.wordOrder) : [[...group.wordOrder]];
  const requestedPage = Number(searchParams.get("page") ?? "1");
  const pageIndex = isPaginated && Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? Math.min(requestedPage, pages.length) - 1 : 0;
  const currentPageIds = new Set(pages[pageIndex]);
  const pageHref = (index: number) => index === 0 ? group.route : `${group.route}?page=${index + 1}`;
  const pageComplete = (ids: readonly string[]) => ids.every((id) => {
    const entry = byId.get(id);
    return entry !== undefined && entry.itemIds.every((id) => learned.has(id));
  });
  const previousPagesComplete = pages.slice(0, pageIndex).every(pageComplete);
  const allItemIds = entries.flatMap((entry) => entry.itemIds);
  const completedCount = allItemIds.filter((id) => learned.has(id)).length;
  const groupEntries = entries.filter((entry) => entry.groupId === group.id);
  const pageEntries = groupEntries.filter((entry) => currentPageIds.has(entry.id));
  const groupCompletedCount = groupEntries.filter((entry) => entry.itemIds.every((id) => learned.has(id))).length;
  const groupWords = group.wordOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && currentPageIds.has(id) && !entry.itemIds.every((id) => learned.has(id)) ? [entry] : [];
  });
  const groupPictures = group.pictureOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && currentPageIds.has(id) && !entry.itemIds.every((id) => learned.has(id)) ? [entry] : [];
  });
  const matchedEntries = group.wordOrder.flatMap((id) => {
    const entry = byId.get(id);
    return entry && currentPageIds.has(id) && entry.itemIds.every((id) => learned.has(id)) ? [entry] : [];
  });
  const previousGroup = groups[groupIndex - 1];
  const nextGroup = groups[groupIndex + 1];
  const previousGroupsComplete = groups.slice(0, groupIndex).every((previous) =>
    entries.filter((entry) => entry.groupId === previous.id).every((entry) => entry.itemIds.every((id) => learned.has(id))),
  );
  const currentPageComplete = pageComplete(pages[pageIndex]);
  const canContinue = allowIncompleteNavigation || (previousGroupsComplete && previousPagesComplete && currentPageComplete);

  useEffect(() => {
    setSelectedId(null);
    setIncorrectPair(null);
    setFeedback("");
  }, [group.id, pageIndex]);
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
    const wordEntry = selectedId.type === "word" ? byId.get(selectedId.id) : entry;
    const imageEntry = selectedId.type === "image" ? byId.get(selectedId.id) : entry;
    if (!wordEntry || !imageEntry) return;
    if (wordEntry.id !== imageEntry.id) {
      setIncorrectPair({
        wordId: selectedId.type === "word" ? selectedId.id : id,
        imageId: selectedId.type === "image" ? selectedId.id : id,
      });
      setSelectedId(null);
      setFeedback("ลองใหม่");
      return;
    }
    play(imageEntry.german, imageEntry.audioRef);
    const nextLearnedIds = [...new Set([...learnedIds, ...imageEntry.itemIds])];
    setLearnedIds(nextLearnedIds);
    lessonState.write(stateKey, writeLearnedImageVocabularyIds(lessonState.read(stateKey), nextLearnedIds));
    setIncorrectPair(null);
    setSelectedId(null);
    setFeedback("");
  }

  if (!hydrated) return <main className="vocabulary-image-matching" aria-busy="true" />;

  return (
    <main className={`vocabulary-image-matching${isL13 || isCatalogLesson ? " profession-learning l13-city-learning" : isCountryGroup ? " profession-learning l01-country-learning" : ""}${isCatalogLesson && lessonId !== "L03" ? " vocabulary-object-image-learning" : ""}${isPaginated ? " vocabulary-paged-learning" : ""}`}>
      <h1 className="sr-only">{isGroupedImageVocabulary ? group.germanTitle : vocabularyImageActivity.germanTitle}</h1>
      {!isGroupedImageVocabulary && <LearningCategoryTabs currentKey={group.id}>
        {groups.map((category, index) => {
          const available = groups.slice(0, index).every((previous) =>
            entries.filter((entry) => entry.groupId === previous.id).every((entry) => entry.itemIds.every((id) => learned.has(id))));
          return available || allowIncompleteNavigation ? <Link key={category.id} href={category.route} title={category.germanTitle}
            aria-current={category.id === group.id ? "page" : undefined}><CategoryTabLabel german={category.germanTitle} thai={category.title} /></Link>
            : <span key={category.id} aria-disabled="true" title="เรียนหมวดก่อนหน้าให้ครบก่อน"><CategoryTabLabel german={category.germanTitle} thai={category.title} /></span>;
        })}
      </LearningCategoryTabs>}
      {(isL13 || ((isCatalogLesson || isCountryGroup) && entries.some((entry) => /^(der|die|das)\s/u.test(entry.german)))) && <ArticleLegend />}
      <div className="vocabulary-image-progress" aria-live="polite">
        <span>เรียนแล้ว {completedCount} / {allItemIds.length} คำ</span>
        <div className="vocabulary-image-progress-track" aria-hidden="true"><span style={{ width: `${allItemIds.length ? completedCount / allItemIds.length * 100 : 0}%` }} /></div>
      </div>
      {(!previousGroupsComplete || !previousPagesComplete) && !allowIncompleteNavigation ? <section className="vocabulary-image-locked">
        <h1>{group.title}</h1>
        <p>จับคู่หน้าหรือหมวดก่อนหน้าให้ครบ แล้วจึงไปต่อ</p>
        <Link className="button primary" href={!previousGroupsComplete ? groups.find((previous) =>
          entries.filter((entry) => entry.groupId === previous.id).some((entry) => !entry.itemIds.every((id) => learned.has(id))))?.route ?? groups[0].route
          : pageHref(Math.max(0, pages.findIndex((ids) => !pageComplete(ids))))}>กลับหน้าที่กำลังเรียน</Link>
      </section> : <>
      <div className="vocabulary-image-groups">
        <section className={`vocabulary-image-group group-${group.id}`}>
          <header className="vocabulary-image-group-heading"><div><span className="eyebrow">{group.germanTitle}</span><h2>{group.title}</h2></div><span>{groupCompletedCount} / {groupEntries.length} {lessonId === "L03" ? "คู่" : "คำ"}</span></header>
          {isL13 || isCatalogLesson ? <>
            {groupWords.length > 0 && <div className="matching-options-sticky profession-options-sticky">
              <div className="profession-options" role="group" aria-label="ตัวเลือกคำศัพท์">
              {groupWords.map((entry) => {
                const article = /^(der|die|das)\s/u.exec(entry.german)?.[1];
                return <button key={entry.id} type="button" className={`profession-option${selectedId?.type === "word" && selectedId.id === entry.id ? " selected" : ""}`} aria-pressed={selectedId?.type === "word" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "word")}>{article && <ArticleDot article={article} />}{entry.german}</button>;
              })}
              </div>
            </div>}
            <section className="l13-city-grid" aria-label="ภาพคำศัพท์ จับคู่กับคำศัพท์">
              {pageEntries.map((entry) => {
                const matched = entry.itemIds.every((id) => learned.has(id));
                const wrong = incorrectPair?.imageId === entry.id;
                const image = entry.image ?? "";
                return <article className={`l13-city-card${matched ? " matched" : ""}${wrong ? " incorrect" : ""}`} key={entry.id} data-vocabulary-id={entry.id} data-matched={matched}>
                  <button type="button" className="l13-city-image" aria-label={matched ? `ภาพ ${entry.german}` : "เลือกภาพนี้เพื่อจับคู่"} aria-pressed={selectedId?.type === "image" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "image")}>
                    <Image src={isCatalogLesson ? catalogVocabularyImageSource(lessonId, image) : `/images/lektion-13-city/${image}-places.webp`} alt={matched ? `ภาพ ${entry.german}` : "ภาพประกอบสำหรับจับคู่คำศัพท์"} width={960} height={640} sizes={isCatalogLesson ? "(max-width: 700px) 90vw, (max-width: 1100px) 29vw, (max-width: 1600px) 27vw, 25vw" : "(max-width: 700px) 42vw, (max-width: 1100px) 29vw, (max-width: 1600px) 27vw, 25vw"} />
                  </button>
                  {matched ? <div className="l13-city-answer">{entry.itemIds.length > 1 ? <div className="vocabulary-synonym-answer">{entry.itemIds.map((id, index) => {
                    const word = items.find((item) => item.id === id);
                    if (!word) return null;
                    const article = /^(der|die|das)\s/u.exec(word.answer)?.[1];
                    return <span key={id}>{index > 0 && " / "}<button type="button" className="profession-label profession-audio-word" aria-label={`ฟัง ${word.answer}`} onClick={() => play(word.answer, word.audio)}>{index === 0 && article && <ArticleDot article={article} />}<span lang="de">{index === 0 ? word.answer : word.answer.replace(/^(der|die|das) /u, "")}</span><Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" /></button></span>;
                  })} ✓</div> : <button type="button" className="profession-label profession-audio-word" onClick={() => play(entry.german, entry.audioRef)}>{/^(der|die|das)\s/u.test(entry.german) && <ArticleDot article={entry.german.split(" ")[0]} />}<span lang="de">{entry.german}</span><Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" /> ✓</button>}<small>{entry.meaning}</small></div>
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
          {isCountryGroup ? <div className="matching-options-sticky profession-options-sticky">
            <div className="profession-options" role="group" aria-label="ตัวเลือกประเทศ">
              {groupWords.map((entry) => {
                const article = /^(der|die|das)\s/u.exec(entry.german)?.[1];
                return <button key={entry.id} type="button" className={`profession-option${selectedId?.type === "word" && selectedId.id === entry.id ? " selected" : ""}`} aria-pressed={selectedId?.type === "word" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "word")}>
                  {article && <ArticleDot article={article} />}{entry.german}<Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" />
                </button>;
              })}
            </div>
          </div> : <section className="vocabulary-image-word-list" aria-label={`${group.title} — คำภาษาเยอรมัน`}>
            {groupWords.map((entry) => <button className={`vocabulary-image-word ${selectedId?.type === "word" && selectedId.id === entry.id ? "selected" : ""} ${incorrectPair?.wordId === entry.id ? "incorrect" : ""}`} key={entry.id} type="button" aria-pressed={selectedId?.type === "word" && selectedId.id === entry.id} onClick={() => chooseMatch(entry.id, "word")}><GermanNoun value={entry.german} /><Volume2 className="vocabulary-audio-icon" size={16} aria-hidden="true" /></button>)}
          </section>}
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
        <Link className="button secondary" href={pageIndex > 0 ? pageHref(pageIndex - 1) : previousGroup?.route ?? (isL13 || isCatalogLesson ? `/learn/${lessonId}/vocabulary` : "/learn/L01/vocabulary/alphabet")}>ย้อนกลับ</Link>
        {canContinue && pageEntries.length > 0 && (pageIndex < pages.length - 1
          ? <Link className="button primary" href={pageHref(pageIndex + 1)}>หน้าถัดไป</Link>
          : nextGroup
          ? <Link className="button primary" href={nextGroup.route}>หน้าถัดไป</Link>
          : <Link className="button primary" href={isL13 || isCatalogLesson ? `/learn/${lessonId}/vocabulary` : "/learn/L01/vocabulary"}>กลับไปที่คำศัพท์</Link>)}
      </div>
    </main>
  );
}
