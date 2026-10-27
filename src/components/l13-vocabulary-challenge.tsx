"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { l13ChallengeResponses, l13VocabularyChallengeActivities, type VocabularyChallengeActivity } from "@/lib/l13-vocabulary-challenge-bank";
import { activityResponseIds, nextChallengeRound, readChallengeState, readPartOrder, type ChallengeResponse, type ChallengeRound } from "@/lib/l13-vocabulary-challenge-state";
import { useL13VocabularyEligibility } from "./use-l13-vocabulary-eligibility";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { isVocabularyPracticeAvailable, useStore } from "./store";
import { useContent } from "./content-provider";
import { NounText, NounPrefix } from "./noun-text";
import { findNoun, nounPresentation } from "@/lib/noun-presentation";
import { ArticleDot, ArticleLegend } from "./profession-matching";
import { VocabularyFeedbackAudio } from "./vocabulary-feedback-audio";

type Story = Extract<VocabularyChallengeActivity, { kind: "story" }>;
type Build = Extract<VocabularyChallengeActivity, { kind: "build" }>;
type Crossword = Extract<VocabularyChallengeActivity, { kind: "crossword" }>;
type PictureArticle = Extract<VocabularyChallengeActivity, { kind: "pictureArticle" }>;
const definitions = new Map(l13ChallengeResponses.map(response => [response.id, response]));
const activitiesById = new Map(l13VocabularyChallengeActivities.map(activity => [activity.id, activity]));
const titles = { odd: "หาคำที่ไม่เข้ากลุ่ม", picture: "เลือกคำให้ตรงกับภาพ", riddle: "ทายสถานที่จากคำบรรยาย", category: "จัดคำศัพท์เข้าหมวด" };

function StoryExercise({ activity, responses, drafts, onDraft, onSubmit }: {
  activity: Story; responses: Record<string, ChallengeResponse>; drafts: Record<string, string>;
  onDraft: (id: string, answer: string) => void; onSubmit: (answers: Record<string, string>) => void;
}) {
  const { items } = useContent();
  const [activeId, setActiveId] = useState(() => activity.gaps.find(gap => !responses[gap.id] && !drafts[gap.id])?.id ?? activity.gaps[0]?.id);
  const checked = activity.gaps.every(gap => Boolean(responses[gap.id]));
  const filled = activity.gaps.every(gap => Boolean(responses[gap.id]?.answer ?? drafts[gap.id]));
  const target = activity.gaps.find(gap => gap.id === activeId && !responses[gap.id]) ?? activity.gaps.find(gap => !responses[gap.id]);
  const used = new Set(activity.gaps.map(gap => responses[gap.id]?.answer ?? drafts[gap.id]).filter(Boolean));
  return <>
    <p className="eyebrow">เติมคำศัพท์ในเรื่องสั้น</p><h1 lang="de">{activity.title}</h1>
    <div className="l13-vocab-story-header"><Image src={activity.image} alt="ภาพประกอบสถานที่ในเรื่องสั้น" width={240} height={160} sizes="(max-width: 600px) 100vw, 240px" />
      <div><p id="story-wordbank-help">เลือกช่องว่าง แล้วกดคำศัพท์เพื่อเติม กดคำที่เติมแล้วเพื่อนำกลับ</p>
        <div className="l13-vocab-story-wordbank" aria-label="คลังคำศัพท์">{activity.wordBank.map(option => <button type="button" className="button secondary" key={option.id} lang="de" disabled={checked || !target || used.has(option.id)} onClick={() => {
          if (!target) return;
          onDraft(target.id, option.id);
          setActiveId(activity.gaps.find(gap => gap.id !== target.id && !responses[gap.id] && !drafts[gap.id])?.id ?? target.id);
        }}><NounText text={option.label} item={items.find(item => item.id === option.id)} /></button>)}</div>
      </div>
    </div>
    <p className="l13-vocab-story-text" lang="de" aria-describedby="story-wordbank-help">{activity.gaps.map((gap, index) => {
      const label = activity.wordBank.find(option => option.id === (responses[gap.id]?.answer ?? drafts[gap.id]))?.label;
      return <Fragment key={gap.id}>{index > 0 ? " " : ""}{gap.before}<button type="button" className="l13-vocab-story-gap" data-correct={responses[gap.id] ? String(responses[gap.id].correct) : undefined} aria-label={`ช่อง ${index + 1}${label ? ` ${label}` : " ว่าง"}`} aria-pressed={!checked && target?.id === gap.id} disabled={Boolean(responses[gap.id])} onClick={() => { onDraft(gap.id, ""); setActiveId(gap.id); }}>{label ?? `(${index + 1}) …`}</button>{gap.after}</Fragment>;
    })}</p>
    {checked ? <div className={`l14-vocab-feedback${activity.gaps.every(gap => responses[gap.id]?.correct) ? " correct" : " incorrect"}`} role="status">
      <strong>{activity.gaps.every(gap => responses[gap.id]?.correct) ? "ถูกต้องทุกช่อง" : "มาดูคำตอบแต่ละช่อง"}</strong>
      <ol>{activity.gaps.map(gap => <li key={gap.id}><strong>{responses[gap.id]?.correct ? "ถูกต้อง" : "ยังไม่ถูก"}</strong> · <NounText text={activity.wordBank.find(option => option.id === gap.answer)?.label ?? ""} item={items.find(item => item.id === gap.answer)} /> <VocabularyFeedbackAudio text={activity.wordBank.find(option => option.id === gap.answer)?.label ?? ""} item={items.find(item => item.id === gap.answer)} /> · {gap.explanation}</li>)}</ol><p>{activity.translation}</p>
    </div> : <div className="l14-vocab-actions"><button type="button" className="button primary" disabled={!filled} onClick={() => onSubmit(Object.fromEntries(activity.gaps.map(gap => [gap.id, drafts[gap.id] ?? responses[gap.id]?.answer ?? ""])))}>ตรวจคำตอบทั้งเรื่อง</button></div>}
  </>;
}

function BuildExercise({ activity, draft, response, onDraft, onSubmit }: {
  activity: Build; draft: string | undefined; response: ChallengeResponse | undefined;
  onDraft: (id: string, answer: string) => void; onSubmit: (answers: Record<string, string>) => void;
}) {
  const { items } = useContent();
  const targetItem = items.find(item => item.id === activity.requiredItemIds[0]);
  const order = readPartOrder(draft, activity.parts.length);
  const answer = order.map(index => activity.parts[index]).join("");
  return <>
    <p className="eyebrow">ประกอบส่วนคำเป็นคำศัพท์</p><h1>{activity.prompt}</h1><p>กดส่วนคำตามลำดับ กดส่วนที่วางแล้วเพื่อนำกลับ</p>
    <div className="l13-vocab-build-answer" aria-label="คำศัพท์ที่ประกอบ"><NounPrefix noun={nounPresentation(targetItem)} />{response ? <strong lang="de">{response.answer}</strong> : order.length ? order.map((index, position) => <button type="button" className="button secondary" key={index} lang="de" onClick={() => onDraft(activity.id, JSON.stringify(order.filter((_, at) => at !== position)))}>{activity.parts[index]}</button>) : <span>วางส่วนคำที่นี่</span>}</div>
    <div className="l13-vocab-story-wordbank" aria-label="ส่วนคำศัพท์">{activity.parts.map((part, index) => <button type="button" className="button secondary" key={index} lang="de" disabled={Boolean(response) || order.includes(index)} onClick={() => onDraft(activity.id, JSON.stringify([...order, index]))}>{part}</button>)}</div>
    {response ? <div className={`l14-vocab-feedback${response.correct ? " correct" : " incorrect"}`} role="status"><strong>{response.correct ? "ถูกต้อง" : "ยังไม่ถูก"}</strong><p>คำตอบ: <span lang="de"><NounText text={activity.answer} item={targetItem} /></span> <VocabularyFeedbackAudio text={activity.answer} item={targetItem} /></p><p>{activity.explanation}</p></div>
      : <div className="l14-vocab-actions"><button type="button" className="button primary" disabled={order.length !== activity.parts.length} onClick={() => onSubmit({ [activity.id]: answer })}>ตรวจคำตอบ</button></div>}
  </>;
}

function CrosswordExercise({ activity, responses, drafts, onDraft, onSubmit }: {
  activity: Crossword; responses: Record<string, ChallengeResponse>; drafts: Record<string, string>;
  onDraft: (id: string, answer: string) => void; onSubmit: (answers: Record<string, string>) => void;
}) {
  const { items } = useContent();
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const keyColumn = Math.max(...activity.rows.map(row => row.keyIndex));
  const columns = Math.max(...activity.rows.map(row => keyColumn - row.keyIndex + row.answer.length));
  const checked = activity.rows.every(row => Boolean(responses[row.id]));
  const rowValue = (id: string) => responses[id]?.answer ?? drafts[id] ?? "";
  const complete = activity.rows.every(row => rowValue(row.id).length === row.answer.length && !rowValue(row.id).includes(" "));
  const focus = (id: string, index: number) => inputs.current.get(`${id}-${index}`)?.focus();
  return <>
    <p className="eyebrow">ปริศนาคำศัพท์</p><h1 lang="de">{activity.title}</h1>
    <p>อ่านคำใบ้แล้วเติมตัวอักษรลงช่องโดยไม่ใส่ Artikel ตัวอักษรในช่องสีเหลืองจะรวมเป็นคำแนวตั้ง</p>
    <ol className="l13-crossword-clues">{activity.rows.map(row => <li key={row.id} lang="de"><NounPrefix noun={findNoun(row.answer, items)} /> · {row.clue}</li>)}</ol>
    <div className="l13-crossword-grid" role="group" aria-label="ตารางปริศนาคำศัพท์" style={{ gridTemplateColumns: `20px repeat(${columns}, minmax(0, 1fr))` }}>
      {activity.rows.map((row, rowIndex) => <Fragment key={row.id}><span className="l13-crossword-row-number">{rowIndex + 1}</span>{Array.from({ length: columns }, (_, column) => {
        const index = column - (keyColumn - row.keyIndex);
        if (index < 0 || index >= row.answer.length) return <span key={column} aria-hidden="true" />;
        const value = rowValue(row.id).padEnd(row.answer.length, " ");
        return <input key={column} ref={input => { const key = `${row.id}-${index}`; if (input) inputs.current.set(key, input); else inputs.current.delete(key); }} type="text" lang="de" className={column === keyColumn ? "l13-crossword-cell keyword" : "l13-crossword-cell"} aria-label={`คำที่ ${rowIndex + 1} ตัวอักษรที่ ${index + 1}`} autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={1} value={value[index].trim()} disabled={Boolean(responses[row.id])} data-correct={responses[row.id] ? String(responses[row.id].correct) : undefined} onFocus={event => event.currentTarget.select()} onChange={event => {
          const letter = event.currentTarget.value.normalize("NFC").toLocaleUpperCase("de").replace(/[^A-ZÄÖÜ]/gu, "").slice(0, 1);
          onDraft(row.id, value.slice(0, index) + (letter || " ") + value.slice(index + 1));
          if (letter && index + 1 < row.answer.length) focus(row.id, index + 1);
        }} onKeyDown={event => {
          if (event.key === "ArrowLeft" && index > 0) { event.preventDefault(); focus(row.id, index - 1); }
          if (event.key === "ArrowRight" && index + 1 < row.answer.length) { event.preventDefault(); focus(row.id, index + 1); }
          if (event.key === "Backspace" && !value[index].trim() && index > 0) { event.preventDefault(); onDraft(row.id, value.slice(0, index - 1) + " " + value.slice(index)); focus(row.id, index - 1); }
        }} onPaste={event => {
          event.preventDefault();
          const letters = event.clipboardData.getData("text").normalize("NFC").toLocaleUpperCase("de").replace(/[^A-ZÄÖÜ]/gu, "").slice(0, row.answer.length - index);
          if (!letters) return;
          onDraft(row.id, value.slice(0, index) + letters + value.slice(index + letters.length));
          focus(row.id, Math.min(row.answer.length - 1, index + letters.length));
        }} />;
      })}</Fragment>)}
    </div>
    <p className="l13-crossword-keyword">คำแนวตั้ง: <span lang="de"><NounPrefix noun={findNoun(activity.solution, items)} /> {activity.rows.map(row => rowValue(row.id)[row.keyIndex]?.trim() || "_").join(" ")}</span></p>
    {checked ? <div className={`l14-vocab-feedback${activity.rows.every(row => responses[row.id]?.correct) ? " correct" : " incorrect"}`} role="status"><strong>{activity.rows.every(row => responses[row.id]?.correct) ? "ถูกต้องทุกคำ" : "มาดูคำตอบแต่ละคำ"}</strong>
      <ol>{activity.rows.map(row => <li key={row.id}><strong lang="de"><NounText text={row.answer} items={items} /></strong> <VocabularyFeedbackAudio text={findNoun(row.answer, items)?.label ?? row.answer} /> · {responses[row.id]?.correct ? "ถูกต้อง" : "ยังไม่ถูก"}<p>{row.translation}</p></li>)}</ol>
      <p>คำแนวตั้ง: <strong lang="de"><NounText text={activity.solution} items={items} /></strong> <VocabularyFeedbackAudio text={findNoun(activity.solution, items)?.label ?? activity.solution} /> · {activity.solutionMeaning}</p>
    </div> : <div className="l14-vocab-actions"><button type="button" className="button primary" disabled={!complete} onClick={() => onSubmit(Object.fromEntries(activity.rows.map(row => [row.id, rowValue(row.id)])))}>ตรวจคำตอบทั้งตาราง</button></div>}
  </>;
}

function PictureArticleExercise({ activity, response, picked, onPick }: { activity: PictureArticle; response: ChallengeResponse | undefined; picked: string; onPick: (answer: string) => void }) {
  return <>
    <h1 lang="de">{activity.prompt}</h1>
    <div className="l13-vocab-picture-layout">
      <div><Image className="l13-vocab-challenge-image" src={activity.image} alt="ภาพประกอบคำนามที่ให้เลือก Artikel" width={440} height={290} sizes="(max-width: 760px) 100vw, 440px" />
        <p className="l13-vocab-article-target" lang="de" aria-label={`คำนาม ${activity.noun}`}><span aria-hidden="true">___ </span>{activity.noun}</p>
      </div>
      <div className="l13-vocab-challenge-options">{activity.options.map(option => <button type="button" key={option.id} lang="de" aria-pressed={picked === option.id} disabled={Boolean(response)} onClick={() => onPick(option.id)}><span className="l13-vocab-noun-label"><ArticleDot article={option.id} />{option.label}</span></button>)}</div>
    </div>
    {response && <div className={`l14-vocab-feedback${response.correct ? " correct" : " incorrect"}`} role="status"><strong>{response.correct ? "ถูกต้อง" : "ยังไม่ถูก"}</strong><p>คำแปลโจทย์: {activity.translation}</p><p>คำตอบ: <span className="l13-vocab-noun-label" lang="de"><ArticleDot article={activity.answer} />{activity.answer} {activity.noun}</span> <VocabularyFeedbackAudio text={`${activity.answer} ${activity.noun}`} /></p><p>{activity.explanation}</p></div>}
  </>;
}

export function L13VocabularyChallenge({ format }: { format?: "pictureArticle" }) {
  const { user } = useStore();
  const { items } = useContent();
  const eligibility = useL13VocabularyEligibility();
  const storage = useLessonState();
  const learned = new Set(eligibility.ids);
  const eligible = l13VocabularyChallengeActivities.filter(activity => activity.requiredItemIds.every(id => learned.has(id)));
  const [state, setState] = useState(() => {
    const saved = readChallengeState(storage.read(lessonStateKeys.l13VocabularyChallenge), eligible);
    return saved && format === "pictureArticle" && !saved.articleRound ? nextChallengeRound(saved, eligible, format) : saved;
  });
  const round = format === "pictureArticle" ? state?.articleRound : state?.round;
  const activity = round ? activitiesById.get(round.activityIds[round.position]) : undefined;
  useEffect(() => {
    if (user && eligibility.ready && state?.round.activityIds.length) storage.write(lessonStateKeys.l13VocabularyChallenge, JSON.stringify(state));
  }, [state, storage, user, eligibility.ready]);
  if (!user || !isVocabularyPracticeAvailable(user)) return <p>กำลังเตรียมแบบฝึกหัด</p>;
  if (eligibility.error) return <div role="alert"><p>โหลดคำศัพท์ที่เรียนแล้วไม่ได้</p><button className="button secondary" onClick={() => void eligibility.retry()}>ลองใหม่</button></div>;
  if (!eligibility.ready) return <p role="status">กำลังโหลดคำศัพท์ที่เรียนแล้ว…</p>;
  if (!state || !round) return <section className="l14-vocab-practice-card" role="alert"><h1>เปิดประวัติรอบฝึกนี้ไม่ได้</h1><p>เก็บข้อมูลเดิมไว้แล้ว กรุณาโหลดหน้าใหม่เพื่อลองอีกครั้ง</p><button className="button secondary" onClick={() => window.location.reload()}>โหลดใหม่</button></section>;
  if (!eligible.length || !round.activityIds.length || round.activityIds.some(id => !eligible.some(activity => activity.id === id))) return <main className="l13-vocab-challenge"><section className="l14-vocab-practice-card"><h1>เรียนคำศัพท์เพิ่มก่อนฝึกขั้นสูง</h1><p>ชุดนี้ใช้คำหลายกลุ่มร่วมกัน เรียนคำจากภาพแล้วกลับมาฝึกได้</p><Link className="button primary" href="/learn/L13/vocabulary">ไปเรียนคำศัพท์</Link></section></main>;
  if (round.completedAt || !activity) return <main className="l13-vocab-challenge"><section className="l14-vocab-practice-card"><p className="eyebrow">WORTSCHATZ · LEKTION 13</p><h1>{format ? "จบรอบฝึกแล้ว" : "จบรอบฝึกขั้นสูงแล้ว"}</h1><p>บันทึกคำตอบไว้เพื่อวางแผนการฝึกครั้งต่อไป</p><div className="l14-vocab-actions"><button type="button" className="button primary" onClick={() => setState(nextChallengeRound(state, eligible, format))}>ฝึกเพิ่ม</button><Link className="button secondary" href="/practice/L13/vocabulary">จบ</Link></div></section></main>;
  const updateRound = (update: (round: ChallengeRound) => ChallengeRound) => setState(current => {
    if (!current) return current;
    return format === "pictureArticle" && current.articleRound ? { ...current, articleRound: update(current.articleRound) } : { ...current, round: update(current.round) };
  });
  const onDraft = (id: string, answer: string) => updateRound(current => ({ ...current, drafts: { ...current.drafts, [id]: answer } }));
  const submit = (answers: Record<string, string>) => updateRound(current => {
    const responses = { ...current.responses };
    const submittedAt = new Date().toISOString();
    for (const id of activityResponseIds(activity)) {
      if (responses[id]) continue;
      const answer = answers[id];
      const definition = definitions.get(id);
      if (!answer || !definition || (definition.choices && !definition.choices.includes(answer))) return current;
      responses[id] = { answer, correct: answer === definition.answer, submittedAt, confidence: null, ...(definition.assessment ? { assessment: definition.assessment } : {}) };
    }
    return { ...current, responses, drafts: Object.fromEntries(Object.entries(current.drafts).filter(([id]) => !responses[id])) };
  });
  const checked = activityResponseIds(activity).every(id => Boolean(round.responses[id]));
  const response = round.responses[activity.id];
  const picked = response?.answer ?? round.drafts[activity.id] ?? "";
  const optionLabel = (option: { id: string; label: string } | undefined) => {
    if (!option) return "";
    const answer = items.find(item => item.id === option.id)?.answer;
    return answer && /^(der|die|das)\s/u.test(answer) ? answer : option.label;
  };
  const optionContent = (option: { id: string; label: string } | undefined) => {
    const label = optionLabel(option);
    const article = /^(der|die|das)\s/u.exec(label)?.[1];
    if (!article) return label;
    const item = items.find(item => item.id === option?.id);
    return <span className="l13-vocab-noun-label"><ArticleDot article={item?.pluralOnly ? "plural" : article} /><span>{label}</span></span>;
  };
  return <main className="l13-vocab-challenge">
    <div className="l13-vocab-challenge-sticky"><ArticleLegend />
    <div className="l14-vocab-progress"><span>{round.position + 1} / {round.activityIds.length} กิจกรรม</span><div role="progressbar" aria-valuenow={round.position + 1} aria-valuemin={1} aria-valuemax={round.activityIds.length}><span style={{ width: `${(round.position + 1) / round.activityIds.length * 100}%` }} /></div></div>
    </div>
    <section className="l14-vocab-practice-card" data-activity-id={activity.id} data-activity-kind={activity.kind} data-assessment-subskill={activity.kind === "pictureArticle" ? activity.assessment.subskill : undefined}>
      {activity.kind === "story" ? <StoryExercise key={`${round.id}-${activity.id}`} activity={activity} responses={round.responses} drafts={round.drafts} onDraft={onDraft} onSubmit={submit} />
        : activity.kind === "pictureArticle" ? <PictureArticleExercise activity={activity} response={response} picked={picked} onPick={answer => onDraft(activity.id, answer)} />
        : activity.kind === "crossword" ? <CrosswordExercise key={`${round.id}-${activity.id}`} activity={activity} responses={round.responses} drafts={round.drafts} onDraft={onDraft} onSubmit={submit} />
        : activity.kind === "build" ? <BuildExercise activity={activity} draft={round.drafts[activity.id]} response={response} onDraft={onDraft} onSubmit={submit} />
          : <>{activity.kind !== "picture" && <p className="eyebrow">{titles[activity.kind]}</p>}<h1 lang={activity.kind === "picture" ? "de" : "th"}>{activity.kind === "picture" ? "Was sehen Sie auf dem Bild?" : activity.kind === "odd" ? "คำไหนต่างจากพวก?" : activity.kind === "category" ? "คำนี้อยู่ในหมวดไหน?" : "อ่านคำใบ้แล้วเลือกสถานที่"}</h1>
            <div className={activity.kind === "picture" ? "l13-vocab-picture-layout" : undefined}>
              {activity.kind === "picture" && <Image className="l13-vocab-challenge-image" src={activity.image} alt="ภาพสถานที่สำหรับเลือกคำศัพท์" width={440} height={290} sizes="(max-width: 760px) 100vw, 440px" />}
              <div>{activity.kind !== "picture" && <p className="l13-vocab-challenge-prompt" lang={activity.kind === "riddle" || activity.kind === "category" ? "de" : "th"}><NounText text={activity.prompt} items={items} /></p>}
                <div className="l13-vocab-challenge-options">{activity.options.map(option => <button type="button" key={option.id} lang={activity.kind === "category" ? "th" : "de"} aria-pressed={picked === option.id} disabled={Boolean(response)} onClick={() => onDraft(activity.id, option.id)}>{optionContent(option)}</button>)}</div>
              </div>
            </div>
            {response && <div className={`l14-vocab-feedback${response.correct ? " correct" : " incorrect"}`} role="status"><strong>{response.correct ? "ถูกต้อง" : "ยังไม่ถูก"}</strong>{activity.kind === "picture" ? <p>คำแปลโจทย์: คุณเห็นอะไรในภาพ?</p> : activity.translation && <p>คำแปลโจทย์: {activity.translation}</p>}<p>คำตอบ: <span lang={activity.kind === "category" ? "th" : "de"}>{optionContent(activity.options.find(option => option.id === activity.answer))}</span> <VocabularyFeedbackAudio text={activity.kind === "category" ? activity.prompt : activity.options.find(option => option.id === activity.answer)?.label ?? ""} item={items.find(item => item.id === (activity.kind === "category" ? activity.requiredItemIds[0] : activity.answer))} /></p><p>{activity.explanation}</p></div>}
          </>}
      <div className="l14-vocab-actions">{round.position === 0 ? <Link className="button secondary" href="/practice/L13/vocabulary">← ย้อนกลับ</Link> : <button type="button" className="button secondary" onClick={() => updateRound(current => ({ ...current, position: current.position - 1 }))}>← ย้อนกลับ</button>}
        {!checked && activity.kind !== "story" && activity.kind !== "build" && activity.kind !== "crossword" && <button type="button" className="button primary" disabled={!picked} onClick={() => submit({ [activity.id]: picked })}>ตรวจคำตอบ</button>}
        {checked && <button type="button" className="button primary" onClick={() => updateRound(current => ({ ...current, position: current.position + 1, completedAt: current.position + 1 >= current.activityIds.length ? new Date().toISOString() : null }))}>{round.position + 1 === round.activityIds.length ? "จบรอบ" : "กิจกรรมถัดไป"}</button>}
      </div>
    </section>
  </main>;
}
