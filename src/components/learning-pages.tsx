"use client";
import { dayKey } from "@/lib/engine";
import { useContent } from "./content-provider";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sun,
  Check,
  BookOpen,
  Flame,
  ArrowUpRight,
  Sparkles,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import {
  getLevel,
  skills,
  skillName,
  type Item,
  type Skill,
} from "@/lib/content";
import {
  completedAttempts,
  dimensionLabels,
  reviewCandidates,
} from "@/lib/learning";
import { useLearning } from "./learning-store";
import { Empty, Meter, SectionTitle, skillIcons } from "./ui";
import type { StartSession } from "./trainer";
export function LearningHome() {
  const h = useLearning();
  const { items, lessons, coreVocabulary } = useContent();
  const completed = completedAttempts(h.attempts);
  const seen = new Set(h.exposures.map((e) => e.item_id));
  const practiced = h.knowledge.filter((k) => Number(k.attempts) > 0);
  const review = reviewCandidates(items, h.sessionItems, h.attempts);
  const latestExposure = [...h.exposures].sort((a, b) =>
    b.seen_at.localeCompare(a.seen_at),
  )[0];
  const last = items.find((item) => item.id === latestExposure?.item_id);
  const lesson = lessons.find((l) => l.id === last?.lessonId) || lessons[0];
  const counts = new Map<string, number>();
  for (const attempt of completed) {
    const key = dayKey(new Date(attempt.submitted_at));
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const today = counts.get(dayKey()) || 0;
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    return {
      day: date.toLocaleDateString("th-TH", { weekday: "short" }),
      count: counts.get(dayKey(date)) || 0,
      today: index === 6,
    };
  });
  const stats = [
    {
      label: "คำศัพท์หลัก",
      value: coreVocabulary.length,
      caption: `ครบทั้ง ${lessons.length} บทเรียน`,
      icon: BookOpen,
      color: "green",
      href: "/progress?skill=vocabulary&collection=core",
    },
    {
      label: "เคยฝึกแล้ว",
      value: practiced.length,
      caption: "เริ่มต้นแล้ว นับทุกทักษะ",
      icon: Flame,
      color: "orange",
      href: "/progress?status=practiced",
    },
    {
      label: "เคยเรียนแล้ว",
      value: seen.size,
      caption: "เนื้อหาที่เคยเปิดเรียน",
      icon: Check,
      color: "purple",
      href: "/progress?status=learned",
    },
    {
      label: "ควรทบทวน",
      value: review.length,
      caption: "กลับไปฝึกสิ่งที่ยังไม่แม่น",
      icon: RotateCcw,
      color: "pink",
      href: "/review",
    },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DEIN DEUTSCH, JEDEN TAG</span>
          <h1>
            Hallo, Sun <span className="wave">☀</span>
          </h1>
          <p>วันนี้มาเก่งภาษาเยอรมันขึ้นอีกนิดกัน</p>
        </div>
        <span className="date-label">
          {new Date().toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
      <section className="hero">
        <div className="hero-copy">
          <span className="hero-tag">
            <span />
            เล็กน้อยทุกวัน เปลี่ยนเป็นความมั่นใจ
          </span>
          <h2>
            ภาษาใหม่ เริ่มได้
            <br />
            ด้วย<span>ก้าวเล็ก ๆ ของเรา</span>
          </h2>
          <p>
            ฝึกคำศัพท์ เข้าใจไวยากรณ์ และค่อย ๆ พูดในแบบของคุณ
            <br className="desktop-break" />
            เลือกบทที่อยากเรียน แล้วไปต่อด้วยกัน
          </p>
          <Link className="button primary" href={`/lesson/${lesson.id}`}>
            {last ? "เรียนต่อจากครั้งก่อน" : "เริ่มบทเรียนแรก"}
            <ArrowRight size={18} />
          </Link>
          <Link className="button secondary" href="/practice">
            ไปแบบฝึกหัด <ArrowRight size={18} />
          </Link>
          <span className="hero-footnote">
            {lesson.id} · {lesson.title}
          </span>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit" />
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✦</span>
          <span className="art-dot" />
          <div className="speech-card">
            <span className="german-flag" />
            <small>EIN WORT, EIN ANFANG</small>
            <strong>Hallo!</strong>
            <span>สวัสดี จุดเริ่มต้นเล็ก ๆ ของเรา</span>
            <div className="speech-rule" />
            <span className="art-audio">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="sound-label">/haˈloː/</span>
          </div>
          <div className="mini-card">
            <span className="mini-sun">
              <Sun size={23} />
            </span>
            <span>
              Schön, dass du da bist.<small>ดีใจที่คุณอยู่ตรงนี้นะ</small>
            </span>
            <Check size={17} />
          </div>
          <div className="art-caption">
            Übung macht den Meister.<span>เก่งขึ้นได้ด้วยการฝึกฝน</span>
          </div>
        </div>
      </section>
      <div className="stats-grid">
        {stats.map((s) => (
          <Link className="stat-card" href={s.href} key={s.label}>
            <div className="stat-top">
              <span className={`icon-tile ${s.color}`}>
                <s.icon size={19} />
              </span>
              <ArrowUpRight size={17} />
            </div>
            <strong>
              {s.value}
              <small>{s.label === "คำศัพท์หลัก" ? "คำ" : "รายการ"}</small>
            </strong>
            <span className="stat-label">{s.label}</span>
            <small>{s.caption}</small>
          </Link>
        ))}
      </div>
      <div className="dashboard-columns">
        <section>
          <SectionTitle eyebrow="DEIN LERNWEG" title="เลือกเส้นทางการเรียน">
            <Link className="text-link" href="/learn">
              ดูทุกบท <ArrowRight size={15} />
            </Link>
          </SectionTitle>
          <div className="level-cards">
            {["A1.1", "A1.2"].map((level, i) => {
              const pool = coreVocabulary.filter(
                (w) => getLevel(w.lessonId) === level,
              );
              const learned = pool.filter((w) => seen.has(w.id)).length;
              const pct = pool.length
                ? Math.round((learned / pool.length) * 100)
                : 0;
              return (
                <Link
                  className={`level-card level-${i}`}
                  href={`/learn?level=${level}`}
                  key={level}
                >
                  <div className="level-card-top">
                    <span className="level-number">{level}</span>
                    <ArrowUpRight size={21} />
                  </div>
                  <h3>
                    {i === 0 ? "เริ่มต้นอย่างมั่นใจ" : "ต่อยอดให้คล่องขึ้น"}
                  </h3>
                  <p>
                    {i === 0
                      ? "ทักทาย แนะนำตัว และเรื่องใกล้ตัว"
                      : "งานอดิเรก ชีวิตประจำวัน และการเดินทาง"}
                  </p>
                  <div className="level-meta">
                    <span>Lektion {i === 0 ? "01–06" : "07–12"}</span>
                    <span>6 บท · {pool.length} คำ</span>
                  </div>
                  <Meter value={pct} label={`คำศัพท์ ${level} ที่เคยเรียน`} />
                  <div className="level-progress">
                    <span>
                      เคยเรียนแล้ว {learned} / {pool.length} คำ
                    </span>
                    <b>{pct}%</b>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        <section className="weekly-card">
          <div className="weekly-title">
            <span className="icon-tile orange">
              <Flame size={18} />
            </span>
            <h3>ทีละนิด แต่สม่ำเสมอ</h3>
          </div>
          <p>ความพยายามใน 7 วันที่ผ่านมา</p>
          <div className="week-days">
            {week.map((d, i) => (
              <div className={`week-day ${d.today ? "today" : ""}`} key={i}>
                <span>{d.day}</span>
                <div className={d.count ? "done" : ""}>
                  {d.count ? <Check size={17} /> : <i />}
                </div>
              </div>
            ))}
          </div>
          <div className="weekly-summary">
            <span>
              <strong>{today}</strong> / 10 ข้อวันนี้
            </span>
            <span>
              {today >= 10 ? "ครบเป้าหมายแล้ว!" : "เริ่มเมื่อไหร่ก็ดีเสมอ"}
            </span>
          </div>
          <Meter value={Math.min(100, today * 10)} label="เป้าหมายวันนี้" />
          <small>ทุกครั้งที่ฝึก ความจำจะค่อย ๆ แข็งแรงขึ้น</small>
        </section>
      </div>
      <section className="review-banner">
        <div className="review-orb">
          <RotateCcw size={24} />
        </div>
        <div>
          <h3>
            {review.length
              ? `มี ${review.length} รายการรอให้คุณทบทวน`
              : "เว้นจังหวะ แล้วกลับมาทบทวน"}
          </h3>
          <p>
            {review.length
              ? "กลับมาฝึกสิ่งที่ยังไม่แม่น ให้จำได้นานกว่าเดิม"
              : "เมื่อเริ่มฝึก ระบบจะช่วยเลือกสิ่งที่ยังไม่แม่นให้คุณ"}
          </p>
        </div>
        <Link href="/review" className="button secondary">
          ไปทบทวน <ArrowRight size={17} />
        </Link>
      </section>
      <div className="bottom-note">
        <Sparkles size={15} />
        <span>
          ไม่ต้องเก่งทุกอย่างในวันเดียว แค่วันนี้ได้เรียนรู้อะไรเพิ่มก็พอแล้ว
        </span>
      </div>
    </>
  );
}

export function PracticeEntry({ start }: { start: StartSession }) {
  const { items, lessons } = useContent();
  const h = useLearning();
  const [lesson, setLesson] = useState(lessons[0].id);
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>แบบฝึกหัด</h1>
          <p>ฝึกเฉพาะเนื้อหาที่เคยเรียน เลือกบทได้โดยไม่ต้องเรียนซ้ำ</p>
        </div>
      </div>
      <label className="setting-label">
        บทเรียน
        <select value={lesson} onChange={(e) => setLesson(e.target.value)}>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>
              {l.id} · {l.thai}
            </option>
          ))}
        </select>
      </label>
      <div className="skills-grid">
        {skills.map((s) => {
          const count = items.filter(
            (i) =>
              i.lessonId === lesson &&
              i.skill === s.id &&
              h.exposures.some((e) => e.item_id === i.id),
          ).length;
          return (
            <Link
              className="skill-card"
              href={`/practice/${lesson}/${s.id}`}
              key={s.id}
            >
              <h2>{s.th}</h2>
              <p>เคยเรียน {count} รายการ</p>
              <span>เลือกแบบฝึก →</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function ReviewPage({ start }: { start: StartSession }) {
  const { items, lessons } = useContent();
  const history = useLearning();
  const reviewItems = reviewCandidates(
    items,
    history.sessionItems,
    history.attempts,
  );
  const itemByAttempt = new Map(
    history.sessionItems.map((entry) => [
      `${entry.session_id}:${entry.ordinal}`,
      entry.item_id,
    ]),
  );
  const latestByItem = new Map<string, (typeof history.attempts)[number]>();
  for (const attempt of completedAttempts(history.attempts)) {
    const itemId = itemByAttempt.get(
      `${attempt.session_id}:${attempt.ordinal}`,
    );
    if (!itemId) continue;
    const previous = latestByItem.get(itemId);
    if (!previous || attempt.submitted_at > previous.submitted_at)
      latestByItem.set(itemId, attempt);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">WIEDERHOLEN & WACHSEN</span>
          <h1>ทบทวน</h1>
          <p>กลับมาฝึกข้อที่ตอบผิดหรือยังไม่มั่นใจ</p>
        </div>
        <span className="quiet-pill">{reviewItems.length} รายการ</span>
      </div>
      {reviewItems.length ? (
        <section className="panel review-summary">
          <h2>{reviewItems.length} รายการที่รอทบทวน</h2>
          <p>คิวนี้อ้างอิงจากคำตอบครั้งล่าสุดและระดับความมั่นใจ</p>
          <div className="review-list">
            {reviewItems.map((item) => {
              const latest = latestByItem.get(item.id)!;
              const confidence = latest.confidence;
              const reason = !latest.correct
                ? "ตอบผิดล่าสุด"
                : confidence === "guess"
                  ? "ตอบถูกแต่เดา"
                  : confidence === "thought"
                    ? "ตอบถูกแต่ต้องคิด"
                    : "รอระบุความมั่นใจ";
              return (
                <div className="review-row" key={item.id}>
                  <span
                    className={`icon-tile ${
                      skills.find((entry) => entry.id === item.skill)?.color ||
                      "green"
                    }`}
                  >
                    <RotateCcw size={17} />
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>
                      {item.lessonId} · {skillName(item.skill)} · {item.meaning}
                    </small>
                    <small>{reason}</small>
                  </div>
                  <span className="status review">
                    <i />
                    ควรทบทวน
                  </span>
                </div>
              );
            })}
          </div>
          <button
            className="button primary"
            onClick={() =>
              start(
                reviewItems,
                "review",
                0,
                "ทบทวนสิ่งที่ยังไม่แม่น",
                "/review",
              )
            }
          >
            เริ่มทบทวน {reviewItems.length} รายการ
          </button>
        </section>
      ) : (
        <Empty
          title="ยังไม่มีข้อที่ต้องทบทวน"
          text="ข้อที่ตอบผิดล่าสุด หรือยังไม่มั่นใจ จะแสดงตรงนี้"
        >
          <Link className="button primary" href="/practice">
            ไปแบบฝึกหัด
          </Link>
        </Empty>
      )}
    </>
  );
}

function VerbLesson() {
  const { items, lessons } = useContent();
  const history = useLearning();
  const verbs = [
    ...new Set(
      items
        .filter(
          (i) =>
            i.lessonId === "L01" &&
            i.skill === "grammar" &&
            (i.group.startsWith("Verbkonjugation") || i.group === "sein"),
        )
        .map((i) => (i.group === "sein" ? "sein" : i.group.split(" · ")[1])),
    ),
  ];
  const learningStorageKey = "deutsch-trainer-verb-learning-L01";
  const [verb, setVerb] = useState(verbs[0] || "kommen");
  const [completedVerbs, setCompletedVerbs] = useState<string[]>([]);
  const [matchesByVerb, setMatchesByVerb] = useState<
    Record<string, Record<number, number>>
  >({});
  const [resultsByVerb, setResultsByVerb] = useState<
    Record<string, { item: Item; input: string; correct: boolean }[]>
  >({});
  const [orderByVerb, setOrderByVerb] = useState<Record<string, number[]>>({});
  const [restored, setRestored] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const verbItems = items.filter(
    (i) =>
      i.lessonId === "L01" &&
      i.skill === "grammar" &&
      (verb === "sein"
        ? i.group === "sein"
        : i.group === `Verbkonjugation · ${verb}`),
  );
  const sessionItems = verbItems;
  const forms = sessionItems.map((i) => i.answer);
  const exposureKey = verbItems
    .map((i) => `${i.id}:${history.exposures.some((e) => e.item_id === i.id)}`)
    .join("|");
  useEffect(() => {
    if (!restored || document.visibilityState !== "visible" || history.busy)
      return;
    let cancelled = false;
    const exposed = new Set(history.exposures.map((e) => e.item_id));
    void (async () => {
      for (const entry of verbItems) {
        if (cancelled || exposed.has(entry.id)) continue;
        try {
          await history.act("expose", { itemId: entry.id });
          exposed.add(entry.id);
        } catch {
          break;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [restored, verb, exposureKey, history.busy]); // eslint-disable-line react-hooks/exhaustive-deps
  const learned = verbItems.every((i) =>
    history.exposures.some((e) => e.item_id === i.id),
  );
  const matches = matchesByVerb[verb] || {};
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const formOrder = orderByVerb[verb] || [];
  const results = resultsByVerb[verb] || null;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(learningStorageKey);
      if (saved) {
        const state = JSON.parse(saved);
        if (typeof state.verb === "string" && verbs.includes(state.verb))
          setVerb(state.verb);
        if (Array.isArray(state.completedVerbs))
          setCompletedVerbs(
            state.completedVerbs.filter(
              (v: unknown) => typeof v === "string" && verbs.includes(v),
            ),
          );
        if (state.matchesByVerb && typeof state.matchesByVerb === "object")
          setMatchesByVerb(state.matchesByVerb);
        if (state.resultsByVerb && typeof state.resultsByVerb === "object")
          setResultsByVerb(state.resultsByVerb);
        if (state.orderByVerb && typeof state.orderByVerb === "object")
          setOrderByVerb(state.orderByVerb);
        if (typeof state.showSummary === "boolean")
          setShowSummary(state.showSummary);
      }
    } catch {
      localStorage.removeItem(learningStorageKey);
    }
    setRestored(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!restored) return;
    localStorage.setItem(
      learningStorageKey,
      JSON.stringify({
        verb,
        completedVerbs,
        matchesByVerb,
        resultsByVerb,
        orderByVerb,
        showSummary,
      }),
    );
  }, [
    restored,
    verb,
    completedVerbs,
    matchesByVerb,
    resultsByVerb,
    orderByVerb,
    showSummary,
  ]);
  useEffect(() => {
    if (!orderByVerb[verb])
      setOrderByVerb((previous) => ({
        ...previous,
        [verb]: forms.map((_, i) => i).sort(() => Math.random() - 0.5),
      }));
    setSelectedToken(null);
  }, [verb, orderByVerb, forms.length]);
  function assign(row: number) {
    if (selectedToken === null) return;
    const token = selectedToken;
    setMatchesByVerb((previous) => {
      const next = { ...(previous[verb] || {}) };
      for (const [key, value] of Object.entries(next))
        if (value === token) delete next[Number(key)];
      next[row] = token;
      return { ...previous, [verb]: next };
    });
    setSelectedToken(null);
  }
  async function checkMatches() {
    if (Object.keys(matches).length !== sessionItems.length) return;
    setResultsByVerb((previous) => ({
      ...previous,
      [verb]: sessionItems.map((item, i) => ({
        item,
        input: forms[matches[i]],
        correct: forms[matches[i]] === item.answer,
      })),
    }));
    setCompletedVerbs((previous) =>
      previous.includes(verb) ? previous : [...previous, verb],
    );
  }
  const selectedIndex = verbs.indexOf(verb);
  const nextVerb = verbs[selectedIndex + 1];
  const renderForm = (form: string, item: Item) => {
    if (verb === "sein") {
      const person = item.title.split(" + ")[0];
      if (["ich", "du", "er / sie / es"].includes(person))
        return (
          <strong lang="de" className="ending-result">
            {form}
          </strong>
        );
      if (form === "sind")
        return (
          <strong lang="de">
            s<span className="ending-result">in</span>d
          </strong>
        );
      return <strong lang="de">{form}</strong>;
    }
    if (verb === "heißen" && item.title.startsWith("du +"))
      return (
        <strong lang="de">
          hei<span className="ending-result">ßt</span>
        </strong>
      );
    const stemLength = verb.slice(0, -2).length;
    return (
      <strong lang="de">
        {form.slice(0, stemLength)}
        <span className="ending-result">{form.slice(stemLength)}</span>
      </strong>
    );
  };
  const renderSummaryForm = (
    form: string,
    verbName: string,
    person: string,
  ) => {
    if (verbName === "sein") {
      if (["ich", "du", "er / sie / es"].includes(person))
        return <strong className="ending-result">{form}</strong>;
      if (form === "sind")
        return (
          <strong>
            s<span className="ending-result">in</span>d
          </strong>
        );
      return <strong>{form}</strong>;
    }
    if (verbName === "heißen" && person === "du")
      return (
        <strong>
          hei<span className="ending-result">ßt</span>
        </strong>
      );
    const stemLength = verbName.slice(0, -2).length;
    return (
      <strong>
        {form.slice(0, stemLength)}
        <span className="ending-result">{form.slice(stemLength)}</span>
      </strong>
    );
  };
  const summaryTable = (
    <section className="verb-summary">
      <h2>สรุปการผันกริยาที่เรียน</h2>
      <div
        className="verb-summary-scroll"
        role="region"
        aria-label="ตารางสรุปการผันกริยาทั้งหมด"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              <th scope="col">ประธาน</th>
              {verbs.map((v) => (
                <th scope="col" lang="de" key={v}>
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {["ich", "du", "er / sie / es", "wir", "ihr", "sie / Sie"].map(
              (person) => (
                <tr key={person}>
                  <th scope="row" lang="de">
                    {person}
                  </th>
                  {verbs.map((v) => {
                    const group =
                      v === "sein" ? "sein" : `Verbkonjugation · ${v}`;
                    const item = items.find(
                      (entry) =>
                        entry.group === group &&
                        entry.title.startsWith(`${person} +`),
                    );
                    return (
                      <td lang="de" key={v}>
                        {item ? renderSummaryForm(item.answer, v, person) : "—"}
                      </td>
                    );
                  })}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
  return (
    <>
      <Link href="/lesson/L01" className="back-link">
        ← กลับบทเรียน
      </Link>
      <div className="page-heading">
        <div>
          <span className="eyebrow">L01 · VERBKONJUGATION</span>
          <h1>จับคู่คำกริยา</h1>
          <p>เรียนทีละคำ จับคู่ประธานกับรูปกริยาเพื่อดูเนื้อหาของบทนี้</p>
        </div>
      </div>
      <section className="panel conjugation-panel">
        <div className="verb-sequence" aria-label="ลำดับคำกริยา">
          {verbs.map((v, i) => (
            <button
              key={v}
              disabled={
                i > selectedIndex && !completedVerbs.includes(verbs[i - 1])
              }
              className={!showSummary && v === verb ? "selected" : ""}
              onClick={() => {
                setVerb(v);
                setShowSummary(false);
              }}
            >
              {v}
            </button>
          ))}
          <button
            disabled={!verbs.every((v) => completedVerbs.includes(v))}
            className={showSummary ? "selected" : ""}
            onClick={() => setShowSummary(true)}
          >
            สรุป
          </button>
        </div>
        {showSummary ? (
          <>
            {summaryTable}
            <div className="result-actions">
              <Link className="button primary" href="/lesson/L01">
                กลับหน้าบทเรียน
              </Link>
              <Link className="button secondary" href="/practice/L01/grammar">
                ไปฝึกผันกริยา
              </Link>
            </div>
          </>
        ) : results ? (
          <>
            <section className="matching-feedback">
              <h2>
                ผลการจับคู่ · {results.filter((r) => r.correct).length}/
                {results.length} คู่ถูก
              </h2>
              {results.map((r) => (
                <div className="matching-result" key={r.item.id}>
                  <span lang="de">{r.item.title.split(" + ")[0]}</span>
                  <span>
                    {r.correct ? (
                      renderForm(r.input, r.item)
                    ) : (
                      <>
                        <del lang="de">{r.input}</del> →{" "}
                        {renderForm(r.item.answer, r.item)}
                      </>
                    )}
                  </span>
                </div>
              ))}
            </section>
            {nextVerb ? (
              <button
                className="button primary wide"
                onClick={() => setVerb(nextVerb)}
              >
                เรียนคำถัดไป · {nextVerb}
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="button primary wide"
                onClick={() => setShowSummary(true)}
              >
                ดูตารางสรุป
                <ArrowRight size={17} />
              </button>
            )}
          </>
        ) : (
          <>
            <div className="matching-board" aria-label={`จับคู่รูปผัน ${verb}`}>
              <div className="matching-column">
                <h2>ประธาน</h2>
                {sessionItems.map((item, i) => (
                  <button
                    key={item.id}
                    className={`matching-subject ${
                      selectedToken !== null ? "target-ready" : ""
                    }`}
                    onClick={() => assign(i)}
                  >
                    <span lang="de">{item.title.split(" + ")[0]}</span>
                    <span
                      className={`matching-drop ${
                        matches[i] !== undefined ? "filled" : ""
                      }`}
                      onClick={(e) => {
                        if (matches[i] !== undefined) {
                          e.stopPropagation();
                          setMatchesByVerb((previous) => {
                            const next = { ...(previous[verb] || {}) };
                            delete next[i];
                            return { ...previous, [verb]: next };
                          });
                        }
                      }}
                    >
                      {matches[i] !== undefined ? (
                        <span lang="de">{forms[matches[i]]}</span>
                      ) : (
                        "เลือกคำตอบ"
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <div className="matching-column">
                <h2>รูปกริยา · แตะเลือกก่อน</h2>
                <div className="matching-bank">
                  {formOrder
                    .filter((token) => !Object.values(matches).includes(token))
                    .map((token) => (
                      <button
                        className={`matching-token ${
                          selectedToken === token ? "selected" : ""
                        }`}
                        key={token}
                        onClick={() => setSelectedToken(token)}
                        lang="de"
                      >
                        {forms[token]}
                      </button>
                    ))}
                </div>
                <p className="conjugation-hint">
                  แตะกล่องรูปกริยาทางขวา แล้วแตะช่อง “เลือกคำตอบ”
                  ของประธานทางซ้าย
                </p>
              </div>
            </div>
            <button
              className="button primary wide"
              disabled={
                !learned || Object.keys(matches).length !== sessionItems.length
              }
              onClick={checkMatches}
            >
              ตรวจการจับคู่
              <ArrowRight size={17} />
            </button>
            {!learned && (
              <p className="conjugation-hint">กำลังบันทึกเนื้อหาที่เห็น</p>
            )}
          </>
        )}
      </section>
    </>
  );
}

export function LearnActivity({
  lessonId,
  skill,
  start,
}: {
  lessonId: string;
  skill: Skill;
  start?: StartSession;
}) {
  const { items } = useContent();
  const h = useLearning();
  const pool = items.filter(
    (i) => i.lessonId === lessonId && i.skill === skill,
  );
  const [position, setPosition] = useState(0);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const exposing = useRef<string | null>(null);
  const item = pool[position];
  if (skill === "grammar" && start) {
    return <VerbLesson />;
  }
  const seen = !!item && h.exposures.some((e) => e.item_id === item.id);
  // Only the mounted, visible Learn card produces an exposure. Catalog/Practice never do.
  useEffect(() => {
    function expose() {
      if (
        !item ||
        seen ||
        document.visibilityState !== "visible" ||
        exposing.current === item.id
      )
        return;
      exposing.current = item.id;
      void h
        .act("expose", { itemId: item.id })
        .catch((e) => setError(e.message))
        .finally(() => {
          exposing.current = null;
        });
    }
    expose();
    document.addEventListener("visibilitychange", expose);
    return () => document.removeEventListener("visibilitychange", expose);
  }, [item?.id, seen, retry]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item)
    return (
      <Empty title="ยังไม่มีเนื้อหาในชุดนี้" text="เลือกบทเรียนหรือทักษะอื่น">
        <Link href="/learn" className="button primary">
          เลือกบทเรียน
        </Link>
      </Empty>
    );
  return (
    <>
      <Link href={`/lesson/${lessonId}`} className="back-link">
        ← กลับบทเรียน
      </Link>
      <div className="page-heading">
        <div>
          <h1>เรียน{skillName(skill)}</h1>
          <p>
            {position + 1} / {pool.length} รายการ
          </p>
        </div>
      </div>
      <section className="question-card">
        <span className="eyebrow">{item.group}</span>
        {item.passage && <p lang="de">{item.passage}</p>}
        <h2 lang="de">{item.answer}</h2>
        <p>{item.meaning}</p>
        {item.prompt && item.prompt !== item.meaning && <p>{item.prompt}</p>}
        {item.plural && <p lang="de">Plural: die {item.plural}</p>}
        {item.reply && <p lang="de">คู่สนทนา: {item.reply}</p>}
        <p role="status">
          {seen
            ? "บันทึกว่าเคยเรียนแล้ว · เข้าแบบฝึกได้ทันที"
            : "กำลังบันทึกการเรียน…"}
        </p>
        {error && !seen && (
          <div role="alert" className="notice error">
            {error}
            <button
              className="button secondary"
              onClick={() => {
                setError("");
                setRetry((v) => v + 1);
              }}
            >
              ลองบันทึกใหม่
            </button>
          </div>
        )}
        <div className="result-actions">
          <button
            className="button secondary"
            disabled={position === 0 || h.busy}
            onClick={() => setPosition((p) => p - 1)}
          >
            ก่อนหน้า
          </button>
          {position < pool.length - 1 && (
            <button
              className="button primary"
              disabled={!seen || h.busy}
              onClick={() => {
                setError("");
                setPosition((p) => p + 1);
              }}
            >
              เรียนรายการถัดไป
            </button>
          )}
          <Link
            className="button secondary"
            href={`/practice/${lessonId}/${skill}`}
          >
            ไปแบบฝึกหัด
          </Link>
        </div>
      </section>
    </>
  );
}
export function HistoryProgress({ query = "" }: { query?: string }) {
  const { items, lessons } = useContent();
  const history = useLearning();
  const params = useMemo(() => new URLSearchParams(query), [query]);
  const [level, setLevel] = useState("all");
  const [lesson, setLesson] = useState(params.get("lesson") || "all");
  const [skill, setSkill] = useState(params.get("skill") || "all");
  const [state, setState] = useState(params.get("status") || "all");
  const [collection, setCollection] = useState(
    params.get("collection") || "all",
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [page, setPage] = useState(0);
  const learned = useMemo(
    () => new Set(history.exposures.map((exposure) => exposure.item_id)),
    [history.exposures],
  );
  const attempts = useMemo(() => {
    const result = new Map<string, { right: number; wrong: number }>();
    const byAttempt = new Map(
      completedAttempts(history.attempts).map((attempt) => [
        `${attempt.session_id}:${attempt.ordinal}`,
        attempt,
      ]),
    );
    for (const sessionItem of history.sessionItems) {
      const attempt = byAttempt.get(
        `${sessionItem.session_id}:${sessionItem.ordinal}`,
      );
      if (!attempt) continue;
      const counts = result.get(sessionItem.item_id) || { right: 0, wrong: 0 };
      if (attempt.correct) counts.right++;
      else counts.wrong++;
      result.set(sessionItem.item_id, counts);
    }
    return result;
  }, [history.attempts, history.sessionItems]);
  const errors = useMemo(() => {
    const completedKeys = new Set(
      completedAttempts(history.attempts).map(
        (attempt) => `${attempt.session_id}:${attempt.ordinal}`,
      ),
    );
    const byAttempt = new Map(
      history.sessionItems.map((sessionItem) => [
        `${sessionItem.session_id}:${sessionItem.ordinal}`,
        sessionItem.item_id,
      ]),
    );
    const result = new Map<string, Map<string, number>>();
    for (const evidence of history.evidence) {
      if (
        evidence.correct ||
        !completedKeys.has(`${evidence.session_id}:${evidence.ordinal}`)
      )
        continue;
      const itemId = byAttempt.get(
        `${evidence.session_id}:${evidence.ordinal}`,
      );
      if (!itemId) continue;
      const dimensions = result.get(itemId) || new Map<string, number>();
      dimensions.set(
        evidence.dimension,
        (dimensions.get(evidence.dimension) || 0) + 1,
      );
      result.set(itemId, dimensions);
    }
    return result;
  }, [history.attempts, history.evidence, history.sessionItems]);
  const filtered = items.filter((item) => {
    const count = attempts.get(item.id) || { right: 0, wrong: 0 };
    const isLearned = learned.has(item.id);
    const hasErrors = (errors.get(item.id)?.size || 0) > 0;
    return (
      (level === "all" || getLevel(item.lessonId) === level) &&
      (lesson === "all" || item.lessonId === lesson) &&
      (skill === "all" || item.skill === skill) &&
      (collection === "all" || item.collection === collection) &&
      (state === "all" ||
        (state === "notSeen" && !isLearned) ||
        (state === "learned" && isLearned) ||
        (state === "practiced" && count.right + count.wrong > 0) ||
        (state === "errors" && hasErrors)) &&
      `${item.title} ${item.meaning} ${item.group}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase())
    );
  });
  const visible = filtered.slice(page * 30, page * 30 + 30);
  function change(action: () => void) {
    action();
    setPage(0);
  }
  function resetFilters() {
    setLevel("all");
    setLesson("all");
    setSkill("all");
    setState("all");
    setCollection("all");
    setSearch("");
    setPage(0);
  }
  function status(item: Item) {
    const count = attempts.get(item.id) || { right: 0, wrong: 0 };
    if (!learned.has(item.id))
      return { label: "ยังไม่เรียน", className: "new" };
    if (count.right + count.wrong === 0)
      return { label: "เคยเรียน", className: "learning" };
    if (count.wrong > 0) return { label: "มีข้อผิดพลาด", className: "review" };
    return { label: "เคยฝึกแล้ว", className: "mastered" };
  }
  const closeDetails = () => setSelected(null);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DEIN FORTSCHRITT</span>
          <h1>เห็นทุกก้าวที่คุณเติบโต</h1>
          <p>ดูสิ่งที่เรียนและผลการฝึกจากประวัติจริงของคุณ</p>
        </div>
        <Link href="/settings" className="button secondary">
          สำรองข้อมูล
        </Link>
      </div>
      <div className="skill-progress-grid">
        {skills.map((entry) => {
          const pool = items.filter((item) => item.skill === entry.id);
          const seenCount = pool.filter((item) => learned.has(item.id)).length;
          const percentage = pool.length
            ? Math.round((seenCount / pool.length) * 100)
            : 0;
          const Icon = skillIcons[entry.id];
          return (
            <button
              className={`skill-summary ${
                skill === entry.id ? "selected" : ""
              }`}
              key={entry.id}
              onClick={() =>
                change(() => {
                  setSkill(entry.id);
                  setCollection("all");
                })
              }
            >
              <span className={`icon-tile ${entry.color}`}>
                <Icon size={19} />
              </span>
              <span>
                {entry.th}
                <strong>{percentage}%</strong>
              </span>
              <Meter value={percentage} label={`เคยเรียน ${entry.th}`} />
            </button>
          );
        })}
      </div>
      <section className="panel progress-panel">
        <SectionTitle title="คลังการเรียนรู้ของคุณ">
          <span className="quiet-pill">{filtered.length} รายการ</span>
        </SectionTitle>
        <div className="search-field">
          <Search size={19} />
          <input
            aria-label="ค้นหาคำศัพท์หรือหัวข้อ"
            placeholder="ค้นหาคำศัพท์ คำแปล หรือหัวข้อ…"
            value={search}
            onChange={(event) => change(() => setSearch(event.target.value))}
          />
        </div>
        <div className="progress-filters">
          <label>
            ระดับ
            <select
              value={level}
              onChange={(event) =>
                change(() => {
                  setLevel(event.target.value);
                  setLesson("all");
                })
              }
            >
              <option value="all">ทุกระดับ</option>
              <option>A1.1</option>
              <option>A1.2</option>
            </select>
          </label>
          <label>
            บทเรียน
            <select
              value={lesson}
              onChange={(event) => change(() => setLesson(event.target.value))}
            >
              <option value="all">ทุกบท</option>
              {lessons
                .filter((entry) => level === "all" || entry.level === level)
                .map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.id} · {entry.thai}
                  </option>
                ))}
            </select>
          </label>
          <label>
            ทักษะ
            <select
              value={skill}
              onChange={(event) =>
                change(() => {
                  setSkill(event.target.value);
                  setCollection("all");
                })
              }
            >
              <option value="all">ทุกทักษะ</option>
              {skills.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.th}
                </option>
              ))}
            </select>
          </label>
          <label>
            สถานะ
            <select
              value={state}
              onChange={(event) => change(() => setState(event.target.value))}
            >
              <option value="all">ทุกสถานะ</option>
              <option value="notSeen">ยังไม่เรียน</option>
              <option value="learned">เคยเรียน</option>
              <option value="practiced">เคยฝึกแล้ว</option>
              <option value="errors">มีข้อผิดพลาด</option>
            </select>
          </label>
          <label>
            ชุดเนื้อหา
            <select
              value={collection}
              onChange={(event) =>
                change(() => {
                  setCollection(event.target.value);
                  if (event.target.value !== "all") setSkill("vocabulary");
                })
              }
            >
              <option value="all">ทุกชุด</option>
              <option value="core">ศัพท์หลัก</option>
              <option value="extra">ศัพท์เสริม</option>
            </select>
          </label>
          <button className="clear-filter" onClick={resetFilters}>
            ล้างตัวกรอง
          </button>
        </div>
        {filtered.length === 0 ? (
          <Empty
            title="ยังไม่มีรายการที่ตรงกับตัวกรอง"
            text="ลองเปลี่ยนตัวกรองหรือคำค้นหา"
          >
            <button className="button secondary" onClick={resetFilters}>
              ดูเนื้อหาทั้งหมด
            </button>
          </Empty>
        ) : (
          <>
            <div className="table-scroll">
              <table className="progress-table">
                <caption className="sr-only">
                  ความก้าวหน้ารายข้อ กดเนื้อหาเพื่อดูหลักฐานการเรียน
                </caption>
                <thead>
                  <tr>
                    <th>เนื้อหา</th>
                    <th>บท / ทักษะ</th>
                    <th>ถูก / ผิด</th>
                    <th>ข้อผิดพลาดตามมิติ</th>
                    <th>สถานะ</th>
                    <th>
                      <span className="sr-only">ดูข้อมูล</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => {
                    const count = attempts.get(item.id) || {
                      right: 0,
                      wrong: 0,
                    };
                    const dimensions = errors.get(item.id);
                    const itemStatus = status(item);
                    return (
                      <tr key={item.id}>
                        <td>
                          <button
                            className="item-link"
                            onClick={() => setSelected(item)}
                          >
                            <strong>{item.title}</strong>
                            <small>{item.meaning}</small>
                            {item.pluralOnly && (
                              <span className="plural-tag">Plural</span>
                            )}
                          </button>
                        </td>
                        <td>
                          <span>
                            {item.lessonId} · {skillName(item.skill)}
                          </span>
                          <small>{item.group}</small>
                        </td>
                        <td>
                          <span className="right-count">{count.right}</span>
                          <span className="slash">/</span>
                          <span className="wrong-count">{count.wrong}</span>
                        </td>
                        <td>
                          {dimensions?.size
                            ? [...dimensions]
                                .map(
                                  ([dimension, total]) =>
                                    `${
                                      dimensionLabels[
                                        dimension as keyof typeof dimensionLabels
                                      ]
                                    } ${total}`,
                                )
                                .join(" · ")
                            : "—"}
                        </td>
                        <td>
                          <span className={`status ${itemStatus.className}`}>
                            <i />
                            {itemStatus.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="icon-button"
                            aria-label={`ดูรายละเอียด ${item.title}`}
                            onClick={() => setSelected(item)}
                          >
                            <ChevronRight size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pagination">
              <span>
                {page * 30 + 1}–{Math.min((page + 1) * 30, filtered.length)} จาก{" "}
                {filtered.length} รายการ
              </span>
              <div>
                <button
                  className="icon-button"
                  aria-label="หน้าก่อนหน้า"
                  disabled={page === 0}
                  onClick={() => setPage((value) => value - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="icon-button"
                  aria-label="หน้าถัดไป"
                  disabled={(page + 1) * 30 >= filtered.length}
                  onClick={() => setPage((value) => value + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
      {selected && (
        <ProgressItemDetail
          item={selected}
          close={closeDetails}
          learned={learned.has(selected.id)}
          attempts={attempts.get(selected.id) || { right: 0, wrong: 0 }}
          errors={errors.get(selected.id) || new Map()}
          seenAt={
            history.exposures.find((entry) => entry.item_id === selected.id)
              ?.seen_at
          }
          sessionItems={history.sessionItems}
          historyAttempts={completedAttempts(history.attempts)}
        />
      )}
    </>
  );
}

function ProgressItemDetail({
  item,
  close,
  learned,
  attempts,
  errors,
  seenAt,
  sessionItems,
  historyAttempts,
}: {
  item: Item;
  close: () => void;
  learned: boolean;
  attempts: { right: number; wrong: number };
  errors: Map<string, number>;
  seenAt?: string;
  sessionItems: ReturnType<typeof useLearning>["sessionItems"];
  historyAttempts: ReturnType<typeof useLearning>["attempts"];
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  const evidence = historyAttempts
    .filter((attempt) =>
      sessionItems.some(
        (sessionItem) =>
          sessionItem.item_id === item.id &&
          sessionItem.session_id === attempt.session_id &&
          sessionItem.ordinal === attempt.ordinal,
      ),
    )
    .sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));
  return (
    <dialog
      ref={dialog}
      className="detail-dialog"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      aria-labelledby="progress-item-title"
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          aria-label="ปิดรายละเอียด"
          onClick={close}
        >
          <X size={21} />
        </button>
        <span className="eyebrow">
          {item.lessonId} · {skillName(item.skill)} · {item.group}
        </span>
        <h2 id="progress-item-title">{item.title}</h2>
        <p>{item.meaning}</p>
        {item.plural && <p lang="de">Plural: die {item.plural}</p>}
        <div className="detail-stats">
          <div>
            <strong>{attempts.right}</strong>
            <span>ตอบถูกครั้งแรก</span>
          </div>
          <div>
            <strong>{attempts.wrong}</strong>
            <span>ตอบผิดครั้งแรก</span>
          </div>
          <div>
            <strong>{errors.size}</strong>
            <span>มิติที่เคยผิด</span>
          </div>
        </div>
        <dl>
          <div>
            <dt>สถานะ</dt>
            <dd>{learned ? "เคยเรียน" : "ยังไม่เรียน"}</dd>
          </div>
          {seenAt && (
            <div>
              <dt>เรียนเมื่อ</dt>
              <dd>{new Date(seenAt).toLocaleString("th-TH")}</dd>
            </div>
          )}
          {[...errors].map(([dimension, total]) => (
            <div key={dimension}>
              <dt>
                {dimensionLabels[dimension as keyof typeof dimensionLabels]}
              </dt>
              <dd>ผิด {total} ครั้ง</dd>
            </div>
          ))}
          {evidence.slice(0, 5).map((attempt) => (
            <div key={`${attempt.session_id}-${attempt.ordinal}`}>
              <dt>{new Date(attempt.submitted_at).toLocaleString("th-TH")}</dt>
              <dd>
                {attempt.correct ? "ถูก" : "ผิด"}
                {attempt.confidence
                  ? ` · ${
                      { easy: "ง่าย", thought: "ต้องคิด", guess: "เดา" }[
                        attempt.confidence
                      ]
                    }`
                  : ""}
              </dd>
            </div>
          ))}
        </dl>
        <Link
          className="button primary wide"
          href={
            learned
              ? `/practice/${item.lessonId}/${item.skill}`
              : `/learn/${item.lessonId}/${item.skill}`
          }
          onClick={close}
        >
          {learned ? "ไปแบบฝึกหัด" : "ไปเรียน"}
        </Link>
      </div>
    </dialog>
  );
}
