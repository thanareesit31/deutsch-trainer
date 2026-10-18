"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import {
  courseCategories,
  courseCompetencyLabel,
  learningStageLabels,
  l13L14Curriculum,
  type CourseCategory,
  type CourseLessonId,
  type CourseTopic,
  type GuidedCheck,
} from "@/lib/l13-l14-course";
import {
  completeCourseTopic,
  parseCourseProgress,
  recordCourseAttempt,
  saveCourseDraft,
  summarizeCourseProgress,
  type ParsedCourseProgress,
} from "@/lib/l13-l14-course-progress";
import { practiceSetsFor } from "@/lib/l13-l14-course-exercises";
import { CourseExerciseRunner } from "./l13-l14-exercise-runner";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";

type CourseMode = "lernen" | "ueben";
type LearnDraft = {
  step: number;
  checkIndex: number;
  selected: string;
  application: string;
};
const stages = ["เข้าใจ", "สังเกต", "กฎ", "ลองใช้", "ประยุกต์", "สรุป"] as const;

function categoryById(id: string | undefined) {
  return courseCategories.find((category) => category.id === id);
}

function loadDraft(serialized: string | undefined): LearnDraft {
  if (!serialized) return { step: 0, checkIndex: 0, selected: "", application: "" };
  try {
    const value: unknown = JSON.parse(serialized);
    if (!value || typeof value !== "object" || Array.isArray(value))
      return { step: 0, checkIndex: 0, selected: "", application: "" };
    const record = Object.fromEntries(Object.entries(value));
    return {
      step: typeof record.step === "number" && Number.isInteger(record.step) && record.step >= 0 && record.step <= 5 ? record.step : 0,
      checkIndex: typeof record.checkIndex === "number" && Number.isInteger(record.checkIndex) && record.checkIndex >= 0 ? record.checkIndex : 0,
      selected: typeof record.selected === "string" ? record.selected : "",
      application: typeof record.application === "string" ? record.application : "",
    };
  } catch {
    return { step: 0, checkIndex: 0, selected: "", application: "" };
  }
}

function topicById(lessonId: CourseLessonId, category: CourseCategory, topicId: string | undefined) {
  return l13L14Curriculum
    .find((lesson) => lesson.id === lessonId)
    ?.categories.find((entry) => entry.category === category)
    ?.topics.find((topic) => topic.id === topicId);
}

function categoryHref(lessonId: CourseLessonId, mode: CourseMode, category: CourseCategory) {
  return `/learn/${lessonId}/course/${mode}/${category}`;
}

function CourseNotice({ parsed }: { parsed: ParsedCourseProgress }) {
  if (parsed.kind !== "invalid") return null;
  return (
    <div className="notice error" role="alert">
      ระบบอ่านความคืบหน้าชุดใหม่นี้ไม่ได้ จึงยังไม่เขียนทับข้อมูลเดิม กรุณาเก็บไฟล์สำรองก่อนแก้ไข
    </div>
  );
}

function TopicLearning({
  lessonId,
  category,
  topic,
  parsed,
  onSave,
}: {
  lessonId: CourseLessonId;
  category: CourseCategory;
  topic: CourseTopic;
  parsed: ParsedCourseProgress;
  onSave: (next: ParsedCourseProgress) => void;
}) {
  const initial = loadDraft(parsed.kind === "invalid" ? undefined : parsed.state.drafts[topic.id]);
  const [step, setStep] = useState(initial.step);
  const [checkIndex, setCheckIndex] = useState(initial.checkIndex);
  const [selected, setSelected] = useState(initial.selected);
  const [application, setApplication] = useState(initial.application);
  const [feedback, setFeedback] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const completed = parsed.kind !== "invalid" && parsed.state.completedTopics.includes(topic.id);
  const currentCheck = topic.guidedChecks[Math.min(checkIndex, topic.guidedChecks.length - 1)];

  function storeDraft(next: Partial<LearnDraft> = {}) {
    if (parsed.kind === "invalid") return;
    const draft: LearnDraft = {
      step,
      checkIndex,
      selected,
      application,
      ...next,
    };
    const state = saveCourseDraft(parsed.state, topic.id, JSON.stringify(draft));
    onSave({ kind: "valid", state });
  }

  function moveTo(nextStep: number) {
    setStep(nextStep);
    setFeedback("");
    setHintVisible(false);
    storeDraft({ step: nextStep, selected: "" });
    setSelected("");
  }

  function submitGuidedCheck(check: GuidedCheck) {
    if (!selected) {
      setFeedback("เลือกคำตอบก่อนครับ");
      return;
    }
    if (selected !== check.answer) {
      setFeedback("ยังไม่ตรง ลองดูคำใบ้แล้วเลือกอีกครั้ง");
      return;
    }
    setFeedback(check.explanation);
    const nextIndex = checkIndex + 1;
    if (nextIndex >= topic.guidedChecks.length) {
      setCheckIndex(nextIndex);
      storeDraft({ checkIndex: nextIndex, selected: "" });
    } else {
      setCheckIndex(nextIndex);
      storeDraft({ checkIndex: nextIndex, selected: "" });
    }
    setSelected("");
  }

  function finishTopic() {
    if (parsed.kind === "invalid") return;
    const state = completeCourseTopic(parsed.state, topic.id);
    const next = saveCourseDraft(state, topic.id, JSON.stringify({
      step: 5,
      checkIndex: topic.guidedChecks.length,
      selected: "",
      application,
    }));
    onSave({ kind: "valid", state: next });
  }

  const learningSteps = [
    { title: "เข้าใจสถานการณ์", content: <p>{topic.context}</p> },
    {
      title: "สังเกตตัวอย่าง",
      content: (
        <div className="a13-course-examples">
          {topic.examples.map((example, index) => (
            <article className="a13-course-example" key={index}>
              <p lang="de">{example.german}</p>
              <span>{example.thai}</span>
              {example.focus && <small>สังเกต: {example.focus}</small>}
            </article>
          ))}
        </div>
      ),
    },
    { title: "สรุปกฎ", content: <p>{topic.rule}</p> },
    {
      title: "ลองใช้พร้อมคำใบ้",
      content:
        checkIndex < topic.guidedChecks.length
          ? (
            <div className="a13-course-check">
              <h3>{currentCheck.prompt}</h3>
              <div className="a13-course-choices" role="group" aria-label="ตัวเลือกคำตอบ">
                {currentCheck.choices.map((choice) => (
                  <button
                    type="button"
                    key={choice}
                    className={selected === choice ? "selected" : ""}
                    aria-pressed={selected === choice}
                    onClick={() => {
                      setSelected(choice);
                      storeDraft({ selected: choice });
                      setFeedback("");
                    }}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              {hintVisible && <p className="a13-course-hint">คำใบ้: {currentCheck.hint}</p>}
              {feedback && <p className="a13-course-feedback" role="status">{feedback}</p>}
              <div className="a13-course-actions">
                <button type="button" className="button secondary" onClick={() => setHintVisible(true)}>ขอคำใบ้</button>
                <button type="button" className="button primary" onClick={() => submitGuidedCheck(currentCheck)}>ตรวจคำตอบ</button>
              </div>
            </div>
          )
          : (
            <div>
              <p className="a13-course-feedback" role="status">ตอบกิจกรรมลองใช้ครบแล้ว อ่านเหตุผลของคำตอบก่อนนำไปใช้</p>
              <p>{topic.guidedChecks.at(-1)?.explanation}</p>
            </div>
          ),
    },
    {
      title: "นำไปใช้",
      content: (
        <>
          <p>{topic.application}</p>
          <textarea
            value={application}
            onChange={(event) => {
              setApplication(event.target.value);
              storeDraft({ application: event.target.value });
            }}
            aria-label="คำตอบสำหรับลองนำไปใช้"
            rows={3}
          />
          <small>คำตอบส่วนนี้เก็บเป็นฉบับร่าง ไม่ใช้คำนวณความชำนาญ</small>
        </>
      ),
    },
    {
      title: "สรุป",
      content: (
        <ul className="a13-course-summary">
          {topic.summary.map((point) => <li key={point}>{point}</li>)}
        </ul>
      ),
    },
  ];
  const content = learningSteps[step];

  return (
    <section className="a13-course-learning">
      <div className="a13-course-topic-heading">
        <span className="eyebrow">LERNEN · {categoryById(category)?.de}</span>
        <h1>{topic.title}</h1>
        <p>{topic.outcome}</p>
        <span className={completed ? "a13-course-status done" : "a13-course-status"}>
          {completed ? "เรียนเนื้อหาแล้ว" : "ยังไม่เรียนจบ"}
        </span>
      </div>
      <nav className="a13-course-stage-list" aria-label="ขั้นตอนการเรียน">
        {stages.map((label, index) => (
          <span key={label} aria-current={step === index ? "step" : undefined} className={step === index ? "current" : step > index ? "past" : ""}>
            {index + 1}. {label}
          </span>
        ))}
      </nav>
      <article className="a13-course-panel" aria-live="polite">
        <h2>{content.title}</h2>
        {content.content}
        <div className="a13-course-actions">
          <button
            type="button"
            className="button secondary"
            disabled={step === 0}
            onClick={() => moveTo(Math.max(0, step - 1))}
          >
            ย้อนหนึ่งขั้น
          </button>
          {step < 3 && (
            <button type="button" className="button primary" onClick={() => moveTo(step + 1)}>
              ถัดไป
            </button>
          )}
          {step === 3 && checkIndex >= topic.guidedChecks.length && (
            <button type="button" className="button primary" onClick={() => moveTo(4)}>นำไปใช้</button>
          )}
          {step === 4 && (
            <button type="button" className="button primary" onClick={() => moveTo(5)}>ดูสรุป</button>
          )}
          {step === 5 && !completed && (
            <button type="button" className="button primary" disabled={parsed.kind === "invalid"} onClick={finishTopic}>จบหัวข้อนี้</button>
          )}
          {step === 5 && completed && (
            <Link className="button primary" href={categoryHref(lessonId, "lernen", category)}>กลับไปหัวข้อทั้งหมด</Link>
          )}
        </div>
      </article>
      <Link className="a13-course-back" href={categoryHref(lessonId, "lernen", category)}>กลับไป {categoryById(category)?.de}</Link>
    </section>
  );
}

export function L13L14CoursePage({
  lessonId,
  segments,
}: {
  lessonId: CourseLessonId;
  segments: string[];
}) {
  const lesson = l13L14Curriculum.find((entry) => entry.id === lessonId);
  const lessonState = useLessonState();
  const stateKey = lessonStateKeys.courseLearning(lessonId);
  const [parsed, setParsed] = useState(() => parseCourseProgress(lessonState.read(stateKey)));
  const [progressFilter, setProgressFilter] = useState<"all" | CourseLessonId>("all");
  if (!lesson) return <p role="alert">ไม่พบเนื้อหาบทเรียน</p>;

  function save(next: ParsedCourseProgress) {
    setParsed(next);
    if (next.kind !== "invalid") lessonState.write(stateKey, JSON.stringify(next.state));
  }

  const mode = segments[0] === "lernen" || segments[0] === "ueben" ? segments[0] : undefined;
  const category = categoryById(segments[1]);
  const topic = mode === "lernen" && category
    ? topicById(lessonId, category.id, segments[2])
    : undefined;
  const completed = parsed.kind === "invalid" ? [] : parsed.state.completedTopics;
  const allTopics = lesson.categories
    .filter((entry) => entry.category !== "vocabulary")
    .flatMap((entry) => entry.topics);
  const completedCount = allTopics.filter((entry) => completed.includes(entry.id)).length;
  const summary = parsed.kind === "invalid" ? undefined : summarizeCourseProgress(parsed.state);

  if (segments[0] === "progress") {
    const progressLessons = l13L14Curriculum
      .filter((entry) => progressFilter === "all" || entry.id === progressFilter)
      .map((entry) => ({ lesson: entry, parsed: parseCourseProgress(lessonState.read(lessonStateKeys.courseLearning(entry.id))) }));
    const recentAttempts = progressLessons.flatMap(({ parsed: progress }) => progress.kind === "invalid" ? [] : progress.state.attempts)
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 12);
    return (
      <section className="a13-course-page">
        <div className="a13-course-topic-heading"><span className="eyebrow">PROGRESS · L13–L14</span><h1>ความก้าวหน้าการเรียนและการฝึก</h1><p>การเรียนจบหัวข้อและหลักฐานจากการฝึกแสดงแยกกัน</p></div>
        <div className="a13-course-progress-tabs" role="group" aria-label="เลือกบทเรียนที่ต้องการดู">
          {(["all", "L13", "L14"] as const).map((filter) => <button type="button" key={filter} aria-pressed={progressFilter === filter} onClick={() => setProgressFilter(filter)}>{filter === "all" ? "รวมทุกบท" : filter}</button>)}
        </div>
        {progressLessons.some(({ parsed: progress }) => progress.kind === "invalid") && <CourseNotice parsed={{ kind: "invalid", raw: "invalid" }} />}
        <div className="a13-course-progress-grid">
          {progressLessons.map(({ lesson: courseLesson, parsed: progress }) => progress.kind === "invalid" ? null : courseLesson.categories.map((plan) => {
            const category = categoryById(plan.category);
            if (!category) return null;
            const learned = plan.topics.filter((entry) => progress.state.completedTopics.includes(entry.id)).length;
            const attempts = progress.state.attempts.filter((entry) => entry.category === plan.category);
            const independent = attempts.filter((entry) => entry.correctness !== null && entry.hintsUsed === 0 && entry.evaluationMethod === "deterministic");
            const correct = independent.filter((entry) => entry.correctness === 1).length;
            const patterns = new Set(independent.map((entry) => entry.patternId));
            const dates = new Set(independent.map((entry) => new Date(entry.submittedAt).toISOString().slice(0, 10)));
            const first = independent.length ? Math.min(...independent.map((entry) => Date.parse(entry.submittedAt))) : 0;
            const last = independent.length ? Math.max(...independent.map((entry) => Date.parse(entry.submittedAt))) : 0;
            const intervalDays = independent.length && correct === independent.length ? [1, 3, 7, 14][Math.min(3, Math.floor(independent.length / 2))] : 1;
            const due = last ? new Date(last + intervalDays * 86400000).toLocaleDateString("th-TH") : "ยังไม่มีข้อมูลพอ";
            const stable = independent.length >= 8 && patterns.size >= 3 && dates.size >= 2 && last - first >= 86400000;
            const errors = Object.entries(attempts.reduce<Record<string, number>>((result, attempt) => {
              if (attempt.errorTag) result[attempt.errorTag] = (result[attempt.errorTag] ?? 0) + 1;
              return result;
            }, {}));
            const progressHref = `/learn/${courseLesson.id}/course/ueben/${plan.category}`;
            return <article key={`${courseLesson.id}-${plan.category}`} className="a13-course-progress-card">
              <span className="eyebrow">{courseLesson.id} · {category.de}</span>
              <h2>{category.th}</h2>
              {plan.category === "vocabulary"
                ? <p>บทเรียนคำศัพท์ใช้หน้าเรียนรูปแบบเดิม</p>
                : <p>เรียนเนื้อหาแล้ว <strong>{learned}/{plan.topics.length}</strong> หัวข้อ</p>}
              <p>ฝึกแล้ว <strong>{attempts.length}</strong> ครั้ง · ถูกโดยไม่มีคำใบ้ <strong>{correct}</strong> ข้อ</p>
              <p>ความแม่นยำ: {independent.length >= 8 ? `${Math.round(correct / independent.length * 100)}%` : "ยังไม่มีข้อมูลพอ"}</p>
              <p>หลักฐาน: {stable ? "ทบทวนข้ามวันแล้ว" : `รูปแบบ ${patterns.size}/3 · รอบฝึก ${dates.size}/2`}</p>
              <p>ทบทวนครั้งถัดไป: {due}</p>
              {errors.length > 0 && <p>จุดที่ควรทบทวน: {errors.map(([tag, count]) => `${tag} (${count})`).join(" · ")}</p>}
              <Link className="button secondary" href={progressHref}>ไปฝึกหมวดนี้</Link>
            </article>;
          }))}
        </div>
        <section className="a13-course-attempt-history"><h2>ประวัติการฝึกล่าสุด</h2>
          {recentAttempts.length ? <ol>{recentAttempts.map((attempt) => <li key={attempt.attemptId}><span>{attempt.lessonId} · {categoryById(attempt.category)?.th} · {attempt.patternId}</span><span>{attempt.correctness === null ? "ประเมินด้วยตนเอง" : attempt.correctness === 1 ? "ถูก" : "ลองทบทวน"}{attempt.hintsUsed ? ` · ใช้คำใบ้ ${attempt.hintsUsed} ครั้ง` : " · ไม่มีคำใบ้"}</span><time dateTime={attempt.submittedAt}>{new Date(attempt.submittedAt).toLocaleString("th-TH")}</time></li>)}</ol> : <p>ยังไม่มีประวัติการฝึกในบทเหล่านี้</p>}
        </section>
        <Link className="a13-course-back" href={`/learn/${lessonId}/course`}>กลับหน้าบทเรียน</Link>
      </section>
    );
  }

  if (!segments.length) {
    return (
      <section className="a13-course-page">
        <div className="lesson-heading">
          <span className="lesson-heading-num">{lessonId.slice(1)}</span>
          <div>
            <span className="eyebrow">A1.3 / LEKTION {lessonId.slice(1)}</span>
            <h1>{lesson.title}</h1>
            <p>เลือกเรียนเนื้อหาใหม่หรือฝึกทักษะใน 7 หมวด</p>
          </div>
        </div>
        <CourseNotice parsed={parsed} />
        <div className="a13-course-progress-line">
          เรียนเนื้อหาแล้ว {completedCount} / {allTopics.length} หัวข้อ
          {summary && <> · ฝึกแล้ว {summary.attempts} ครั้ง · {summary.stable ? "มีข้อมูลทบทวนข้ามวันแล้ว" : "ยังไม่มีข้อมูลพอสำหรับสรุปความแม่นยำระยะยาว"}</>}
        </div>
        <div className="a13-course-modes">
          <Link href={`/learn/${lessonId}/course/lernen`} className="a13-course-mode learn">
            <span className="eyebrow">LERNEN</span>
            <h2>เรียนเนื้อหา</h2>
            <p>ทำความเข้าใจตัวอย่าง ลองใช้พร้อมคำใบ้ และสรุปสิ่งที่เรียน</p>
            <span>เลือกหนึ่งใน 7 หมวด →</span>
          </Link>
          <Link href={`/learn/${lessonId}/course/ueben`} className="a13-course-mode practice">
            <span className="eyebrow">ÜBEN</span>
            <h2>ฝึกเพิ่มเติม</h2>
            <p>ทำแบบฝึกตามหมวดและตรวจคำตอบจากทักษะที่เลือก</p>
            <span>เลือกหนึ่งใน 7 หมวด →</span>
          </Link>
        </div>
        <div className="a13-course-category-strip" aria-label="7 หมวดการเรียน">
          {courseCategories.map((entry) => (
            <span key={entry.id}><strong>{entry.de}</strong><small>{entry.th}</small></span>
          ))}
        </div>
        <Link className="a13-course-back" href={`/lesson/${lessonId}`}>กลับหน้าบทเรียน</Link>
        <Link className="a13-course-progress-link" href={`/learn/${lessonId}/course/progress`}>ดูความก้าวหน้าของ L13–L14</Link>
      </section>
    );
  }

  if (!mode) return <p role="alert">เส้นทางบทเรียนนี้ไม่ถูกต้อง</p>;

  if (segments.length === 1) {
    return (
      <section className="a13-course-page">
        <div className="a13-course-topic-heading">
          <span className="eyebrow">{mode === "lernen" ? "LERNEN" : "ÜBEN"} · {lessonId}</span>
          <h1>{mode === "lernen" ? "เลือกหมวดเพื่อเรียน" : "เลือกหมวดเพื่อฝึก"}</h1>
          <p>{mode === "lernen" ? "เริ่มจากเนื้อหาที่ต้องการเข้าใจ" : "แบบฝึกจะใช้เฉพาะความรู้ที่เรียนแล้วในบทนี้"}</p>
        </div>
        <CourseNotice parsed={parsed} />
        <div className="a13-course-category-grid">
          {lesson.categories.map((entry) => {
            const learned = entry.topics.filter((entryTopic) => completed.includes(entryTopic.id)).length;
            return (
              <Link key={entry.category} href={mode === "lernen" && entry.category === "vocabulary" ? `/learn/${lessonId}/vocabulary` : categoryHref(lessonId, mode, entry.category)} className="a13-course-category-card">
                <span className="eyebrow">{categoryById(entry.category)?.de}</span>
                <h2>{categoryById(entry.category)?.th}</h2>
                <p>{mode === "lernen" && entry.category === "vocabulary" ? "บทเรียนคำศัพท์รูปแบบเดิม" : `${entry.topics.length} หัวข้อ · เรียนแล้ว ${learned}`}</p>
              </Link>
            );
          })}
        </div>
        <Link className="a13-course-back" href={`/learn/${lessonId}/course`}>กลับหน้าบทเรียน</Link>
      </section>
    );
  }

  if (!category) return <p role="alert">ไม่พบหมวดนี้</p>;

  if (mode === "lernen" && segments.length === 3 && topic) {
    return (
      <section className="a13-course-page">
        <CourseNotice parsed={parsed} />
        <TopicLearning lessonId={lessonId} category={category.id} topic={topic} parsed={parsed} onSave={save} />
      </section>
    );
  }

  if (mode === "ueben" && segments.length === 3) {
    const set = practiceSetsFor(lessonId, category.id).find((entry) => entry.id === segments[2]);
    if (!set) return <p role="alert">ไม่พบชุดฝึกนี้</p>;
    return (
      <section className="a13-course-page">
        <div className="a13-course-topic-heading"><span className="eyebrow">ÜBEN · {category.de}</span><h1>{set.title}</h1><p>ทักษะหลัก: {set.id.includes("-AB-") || set.id.includes("-SUP-") ? courseCompetencyLabel(set.primaryCompetency) : set.primaryCompetency} · ระดับ {set.difficulty}</p></div>
        <CourseNotice parsed={parsed} />
        <CourseExerciseRunner set={set} onAttempt={(attempt) => {
          if (parsed.kind !== "invalid") save({ kind: "valid", state: recordCourseAttempt(parsed.state, attempt) });
        }} />
        <Link className="a13-course-back" href={categoryHref(lessonId, "ueben", category.id)}>กลับไปชุดฝึกทั้งหมด</Link>
      </section>
    );
  }

  if (mode === "lernen" && segments.length === 2) {
    const plan = lesson.categories.find((entry) => entry.category === category.id);
    if (!plan) return <p role="alert">ไม่พบหมวดนี้</p>;
    return (
      <section className="a13-course-page">
        <div className="a13-course-topic-heading">
          <span className="eyebrow">{mode === "lernen" ? "LERNEN" : "ÜBEN"} · {category.de}</span>
          <h1>{category.th}</h1>
          <p>{mode === "lernen" ? "เลือกหัวข้อ แล้วเรียนตามลำดับเข้าใจ → สังเกต → ลองใช้ → สรุป" : "แบบฝึกเรียงจากการจำและเลือก ไปสู่การสร้างภาษาและประยุกต์ใช้"}</p>
        </div>
        <CourseNotice parsed={parsed} />
        <div className="a13-course-topic-list">
          {plan.topics.map((entry, index) => {
            const learned = completed.includes(entry.id);
            const href = mode === "lernen"
              ? `${categoryHref(lessonId, mode, category.id)}/${entry.id}`
              : undefined;
            return (
              <article className="a13-course-topic-card" key={entry.id}>
                <span className="a13-course-topic-index">{index + 1}</span>
                <div>
                  <h2>{entry.title}</h2>
                  <p>{entry.outcome}</p>
                  <small className={learned ? "a13-course-status done" : "a13-course-status"}>{learned ? "เรียนเนื้อหาแล้ว" : "ยังไม่เรียน"}</small>
                </div>
                {href
                  ? <Link className="button secondary" href={href}>{learned ? "ทบทวน" : "เริ่มเรียน"}</Link>
                  : <span className="a13-course-status">เนื้อหาที่เกี่ยวข้อง</span>}
              </article>
            );
          })}
        </div>
        {category.id !== "speaking" && <Link className="button secondary" href={`/learn/${lessonId}/${category.id}`}>เปิดบทเรียนเดิมในหมวดนี้</Link>}
        <Link className="a13-course-back" href={`/lesson/${lessonId}`}>กลับไปเลือกหมวดบทเรียน</Link>
      </section>
    );
  }

  if (mode === "ueben" && segments.length === 2) {
    const sets = practiceSetsFor(lessonId, category.id);
    const recorded = parsed.kind === "invalid" ? [] : parsed.state.attempts;
    return (
      <section className="a13-course-page">
        <div className="a13-course-topic-heading"><span className="eyebrow">ÜBEN · {category.de}</span><h1>{category.th}</h1><p>เริ่มจากข้อที่มีตัวเลือก แล้วค่อยลดตัวช่วยหรือสร้างคำตอบเอง</p></div>
        <CourseNotice parsed={parsed} />
        <div className="a13-course-topic-list">{sets.map((set, index) => {
          const count = recorded.filter((attempt) => attempt.exerciseId === set.id).length;
          return <Fragment key={set.id}>
            {set.id.includes("-AB-") && !sets[index - 1]?.id.includes("-AB-") && <h2>แบบฝึกเพิ่มเติมจาก MOMENTE Arbeitsbuch · เรียงง่ายไปยาก</h2>}
            <article className="a13-course-topic-card">
            <span className="a13-course-topic-index">{index + 1}</span><div><h2>{set.title}</h2><p>{set.id.includes("-SUP-") || set.id.includes("-AB-") ? courseCompetencyLabel(set.primaryCompetency) : set.primaryCompetency.replaceAll(".", " · ")} · ระดับ {set.difficulty} · {set.questions.length} ข้อ</p>{set.learningStage && <p>{learningStageLabels[set.learningStage]}</p>}<small>{count ? `ทำแล้ว ${count} ครั้ง` : "ยังไม่ได้ทำ"}</small></div>
            <Link className="button primary" href={`${categoryHref(lessonId,"ueben",category.id)}/${set.id}`}>{count ? "ฝึกต่อ" : "เริ่มฝึก"}</Link>
          </article></Fragment>;
        })}</div>
        {category.id !== "speaking" && <Link className="button secondary" href={`/practice/${lessonId}/${category.id}`}>เปิดแบบฝึกหัดเดิมในหมวดนี้</Link>}
        <Link className="a13-course-back" href="/practice">กลับไปเลือกหมวดแบบฝึกหัด</Link>
      </section>
    );
  }

  return <p role="alert">ไม่พบหัวข้อหรือกิจกรรมที่เลือก</p>;
}
