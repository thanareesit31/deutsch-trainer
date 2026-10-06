"use client";
import { useContent } from "./content-provider";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Sun,
  LayoutDashboard,
  BookOpen,
  ListChecks,
  RotateCcw,
  ChartNoAxesCombined,
  Settings,
  ChevronRight,
  ArrowUpRight,
  Flame,
  Sparkles,
  Check,
  ArrowRight,
  Leaf,
  Menu,
  X,
  CircleHelp,
  LogOut,
} from "lucide-react";
import {
  getLevel,
  skills,
  skillName,
  type Item,
  type Mode,
  type Skill,
} from "@/lib/content";
import { makeQuestion, sessionItems, type Question } from "@/lib/engine";
import { useStore } from "./store";
import { useLearning } from "./learning-store";
import {
  LearnActivity,
  PracticeEntry,
  ReviewPage,
  HistoryProgress,
  LearningHome,
} from "./learning-pages";
import { Badge, Empty, Meter, SectionTitle, skillIcons } from "./ui";
import { PracticeSetup, Session } from "./practice";
import { SettingsPage } from "./progress";
import { AuthScreen } from "./auth-screen";
import { TestWorkspaceNotice } from "./test-workspace-notice";
import { VocabularyLearningEntryPoints } from "./vocabulary-learning";
import { AlphabetLearningPage } from "./alphabet-learning";
import { VocabularyImageMatching } from "./vocabulary-image-matching";
import { vocabularyImageGroups } from "@/lib/vocabulary-image-content";

export type StartSession = (
  pool: Item[],
  mode: Mode | "review",
  count: number,
  title: string,
  origin: string,
  prioritize?: boolean,
  ordered?: boolean,
) => void;
const nav = [
  { path: "/", label: "หน้าแรก", icon: LayoutDashboard },
  { path: "/learn", label: "บทเรียน", icon: BookOpen },
  { path: "/practice", label: "แบบฝึกหัด", icon: ListChecks },
  { path: "/review", label: "ทบทวน", icon: RotateCcw },
  { path: "/progress", label: "ความก้าวหน้า", icon: ChartNoAxesCombined },
];
export default function Trainer() {
  return (
    <Suspense fallback={<div className="loading">กำลังเปิดบทเรียน…</div>}>
      <AuthenticatedApp />
    </Suspense>
  );
}
function AuthenticatedApp() {
  const { ready, user } = useStore();
  if (!ready)
    return (
      <div className="loading">
        <Sun className="spin" size={32} />
        <p>กำลังเชื่อมต่อพื้นที่เรียนรู้ของคุณ…</p>
      </div>
    );
  if (!user) return <AuthScreen />;
  return <App />;
}
function App() {
  const { items, lessons, coreVocabulary } = useContent();
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, ready, error, user, signOut } = useStore();
  const history = useLearning();
  const selectedSession =
    history.sessions.find((s) => s.id === searchParams.get("id")) ||
    [...history.sessions]
      .filter((s) => !s.completed)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  const session = selectedSession
    ? {
        ...selectedSession,
        questions: history.sessionItems
          .filter((i) => i.session_id === selectedSession.id)
          .sort((a, b) => a.ordinal - b.ordinal)
          .map((i) => i.question),
      }
    : null;
  const [startError, setStartError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError("");
    try {
      await signOut();
    } catch (cause) {
      setSignOutError(
        `ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง: ${
          cause instanceof Error ? cause.message : "เชื่อมต่อไม่ได้"
        }`,
      );
    } finally {
      setSigningOut(false);
    }
  }

  const start: StartSession = async (
    pool,
    mode,
    count,
    title,
    origin,
    _prioritize,
    ordered,
  ) => {
    try {
      const learned = new Set(history.exposures.map((e) => e.item_id));
      const eligible = pool.filter((i) => learned.has(i.id));
      const selected = ordered
        ? eligible
        : sessionItems(eligible, count, {}, false);
      if (!selected.length) {
        router.push("/practice");
        return;
      }
      const questions = selected.map((item) => {
        const selectedMode: Mode =
          mode === "review" || mode === "flash"
            ? item.skill === "reading" || item.skill === "listening"
              ? "choice"
              : item.group === "Satzbau"
                ? "order"
                : "typing"
            : mode;
        const question = makeQuestion(items, item, selectedMode);
        return { ...question, hint: undefined };
      });
      const id = crypto.randomUUID();
      await history.act("start", { sessionId: id, questions, title, origin });
      setStartError("");
      router.push(`/session?id=${id}`);
    } catch (e) {
      setStartError((e as Error).message);
    }
  };
  const active = (p: string) =>
    p === "/"
      ? path === p
      : path.startsWith(p) || (p === "/learn" && path.startsWith("/lesson"));
  let page: React.ReactNode;
  const parts = path.split("/").filter(Boolean);
  if (!ready)
    page = (
      <div className="loading">
        <Sun className="spin" size={32} />
        <p>กำลังเปิดพื้นที่เรียนรู้ของคุณ…</p>
      </div>
    );
  else if (!history.ready)
    page = (
      <Empty
        title="กำลังเปิดประวัติการเรียน"
        text={history.error || "กำลังโหลดข้อมูล…"}
      >
        <button
          className="button secondary"
          onClick={() => void history.reload().catch(() => {})}
        >
          ลองโหลดใหม่
        </button>
      </Empty>
    );
  else if (path === "/") page = <LearningHome />;
  else if (path === "/learn")
    page = (
      <LessonList
        key={searchParams.toString()}
        initialLevel={searchParams.get("level") || "A1.1"}
      />
    );
  else if (parts[0] === "lesson" && lessons.some((l) => l.id === parts[1]))
    page = <LessonDetail id={parts[1]} />;
  else if (
    parts[0] === "practice" &&
    lessons.some((l) => l.id === parts[1]) &&
    skills.some((s) => s.id === parts[2])
  )
    page = (
      <PracticeSetup
        key={path}
        lessonId={parts[1]}
        skill={parts[2] as Skill}
        start={start}
      />
    );
  else if (path === "/practice") page = <PracticeEntry start={start} />;
  else if (path === "/review") page = <ReviewPage start={start} />;
  else if (path === "/learn/L01/vocabulary/alphabet")
    page = <AlphabetLearningPage />;
  else if (vocabularyImageGroups.some((group) => group.route === path))
    page = (
      <VocabularyImageMatching
        key={path}
        items={items}
        groupId={vocabularyImageGroups.find((group) => group.route === path)!.id}
      />
    );
  else if (parts[0] === "learn" && parts[1] && parts[2])
    page =
      parts[1] === "L01" && parts[2] === "vocabulary" ? (
        <VocabularyLearningEntryPoints
          key={path}
          lessonId={parts[1]}
        />
      ) : (
        <LearnActivity
          key={path}
          lessonId={parts[1]}
          skill={parts[2] as Skill}
          start={start}
        />
      );
  else if (path === "/progress")
    page = <HistoryProgress query={searchParams.toString()} />;
  else if (path === "/settings") page = <SettingsPage />;
  else if (path === "/session" && session)
    page = <Session key={session.id} plan={session} start={start} />;
  else
    page = (
      <Empty
        title={
          path === "/session" ? "คำตอบที่ฝึกไว้ถูกบันทึกแล้ว" : "ไม่พบหน้านี้"
        }
        text="เลือกบทเรียนเพื่อเริ่มรอบฝึกใหม่ได้เลย"
      >
        <Link className="button primary" href="/learn">
          ไปที่บทเรียน <ArrowRight size={16} />
        </Link>
      </Empty>
    );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        ข้ามไปเนื้อหา
      </a>
      {mobileMenu && (
        <button
          className="nav-scrim"
          aria-label="ปิดเมนู"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <Link href="/" className="brand" onClick={() => setMobileMenu(false)}>
          <span className="brand-mark">
            <Sun size={26} />
          </span>
          <span>
            Deutsch
            <span className="brand-sub">
              mit Sun<span className="brand-dot">.</span>
            </span>
          </span>
        </Link>
        <span className="nav-label">MEIN LERNRAUM</span>
        <nav aria-label="เมนูหลัก">
          {nav.map((n) => (
            <Link
              href={n.path}
              key={n.path}
              className={`nav-item ${active(n.path) ? "active" : ""}`}
              onClick={() => setMobileMenu(false)}
            >
              <n.icon size={20} />
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="note-sun">✳</span>
          <p>
            ทุกคำที่จำได้
            <br />
            คืออีกก้าวที่ไกลขึ้น
          </p>
          <small>Ein Schritt nach dem anderen.</small>
          <span className="note-line" />
        </div>
        <div className="sidebar-bottom">
          <Link
            className={`nav-item ${active("/settings") ? "active" : ""}`}
            href="/settings"
            onClick={() => setMobileMenu(false)}
          >
            <Settings size={20} />
            ตั้งค่าและข้อมูล
          </Link>
          <div className="profile">
            <span className="avatar">
              {(user?.email || "S").slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{user?.email || "ผู้เรียน"}</strong>
              <small>บัญชีผู้เรียน · A1</small>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>
      <div className="app-content">
        <TestWorkspaceNotice />
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button menu-toggle"
              aria-label={mobileMenu ? "ปิดเมนู" : "เปิดเมนู"}
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>
            <span className="topbar-label">พื้นที่เรียนภาษาเยอรมันของคุณ</span>
            <span className="topbar-mobile">Deutsch mit Sun</span>
          </div>
          <div className="topbar-right">
            <span className="level-pill">
              <span className="german-flag" />
              A1.1 — A1.2
            </span>
            <span className="topbar-divider" />
            <span className="small-avatar">
              {(user?.email || "S").slice(0, 1).toUpperCase()}
            </span>
            <button
              className="topbar-signout"
              onClick={() => void handleSignOut()}
              disabled={signingOut || history.busy}
              aria-label="ออกจากระบบ"
            >
              <LogOut size={16} aria-hidden="true" />
              <span>{signingOut ? "กำลังออก…" : "ออกจากระบบ"}</span>
            </button>
          </div>
        </header>
        <main
          id="main"
          className={
            path === "/session" ? "main-content session-main" : "main-content"
          }
        >
          {(signOutError || error || startError || history.error) && (
            <div role="alert" className="notice error">
              {signOutError || error || startError || history.error}
            </div>
          )}
          {page}
        </main>
        <footer className="footer">
          <span>
            <Leaf size={14} />
            เรียนทีละนิด เติบโตทุกวัน
          </span>
          <Link href="/settings">
            บันทึกบนบัญชีของคุณ · สำรองข้อมูล <ArrowUpRight size={13} />
          </Link>
        </footer>
      </div>
    </div>
  );
}

function LessonList({ initialLevel }: { initialLevel: string }) {
  const { items, lessons, coreVocabulary } = useContent();
  const { data } = useStore();
  const history = useLearning();
  const [level, setLevel] = useState(initialLevel);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">DEIN LERNWEG</span>
          <h1>บทเรียนของคุณ</h1>
          <p>เลือกบทที่อยากฝึกได้เลย ทุกบทเปิดให้เรียนอย่างอิสระ</p>
        </div>
        <span className="quiet-pill">
          {lessons.length} บทเรียน · {coreVocabulary.length} คำหลัก
        </span>
      </div>
      <div className="segmented level-switch" aria-label="เลือกระดับ">
        {["A1.1", "A1.2"].map((l) => (
          <button
            className={level === l ? "selected" : ""}
            onClick={() => setLevel(l)}
            key={l}
          >
            {l}
            <span>Lektion {l === "A1.1" ? "01–06" : "07–12"}</span>
          </button>
        ))}
      </div>
      <div className="lesson-grid">
        {lessons
          .filter((l) => l.level === level)
          .map((l) => {
            const pool = coreVocabulary.filter((w) => w.lessonId === l.id);
            const learned = pool.filter((w) =>
              history.exposures.some((e) => e.item_id === w.id),
            ).length;
            const pct = Math.round((learned / pool.length) * 100);
            const any = learned > 0;
            return (
              <Link className="lesson-card" href={`/lesson/${l.id}`} key={l.id}>
                <div className="lesson-card-top">
                  <span className="lesson-num">
                    {String(l.number).padStart(2, "0")}
                  </span>
                  <Badge state={any ? "learning" : "new"} />
                </div>
                <span className="eyebrow">
                  LEKTION {String(l.number).padStart(2, "0")}
                </span>
                <h2>{l.title}</h2>
                <p>{l.thai}</p>
                <div className="lesson-tags">
                  <span>{pool.length} คำหลัก</span>
                  {l.id === "L01" && <span>6 ทักษะ</span>}
                </div>
                <Meter value={pct} label={`${l.id} คำศัพท์ที่เคยเรียน`} />
                <div className="lesson-card-bottom">
                  <span>คำศัพท์ที่เคยเรียน {pct}%</span>
                  <ArrowRight size={18} />
                </div>
              </Link>
            );
          })}
      </div>
      <div className="notice">
        <CircleHelp size={19} />
        <span>
          L01 มีแบบฝึกทั้ง 6 ทักษะ ส่วน L02–L12 มีคำศัพท์เดิมครบ
          พร้อมเพิ่มเนื้อหาทักษะอื่นเมื่อจัดเตรียมบทเรียนแล้ว
        </span>
      </div>
    </>
  );
}
function LessonDetail({ id }: { id: string }) {
  const { items, lessons, coreVocabulary } = useContent();
  const lesson = lessons.find((l) => l.id === id)!;
  const { data } = useStore();
  const history = useLearning();
  return (
    <>
      <Link className="back-link" href={`/learn?level=${lesson.level}`}>
        ← กลับไปเลือกบทเรียน
      </Link>
      <div className="lesson-heading">
        <span className="lesson-heading-num">
          {String(lesson.number).padStart(2, "0")}
        </span>
        <div>
          <span className="eyebrow">
            {lesson.level} / LEKTION {String(lesson.number).padStart(2, "0")}
          </span>
          <h1>{lesson.title}</h1>
          <p>{lesson.thai}</p>
        </div>
      </div>
      <SectionTitle
        title="วันนี้อยากเรียนทักษะไหน?"
        eyebrow="EIN SCHRITT WEITER"
      />
      <div className="skills-grid">
        {skills.map((s) => {
          const Icon = skillIcons[s.id];
          const pool = items.filter(
            (i) => i.lessonId === id && i.skill === s.id,
          );
          const pct = pool.length
            ? Math.round(
                (pool.filter((i) =>
                  history.exposures.some((e) => e.item_id === i.id),
                ).length *
                  100) /
                  pool.length,
              )
            : 0;
          const content = (
            <>
              <div className="skill-top">
                <span className={`icon-tile large ${s.color}`}>
                  <Icon size={24} />
                </span>
                {pool.length ? (
                  <ArrowUpRight size={20} />
                ) : (
                  <span className="quiet-pill">กำลังเตรียมเนื้อหา</span>
                )}
              </div>
              <span className="eyebrow">{s.de}</span>
              <h2>{s.th}</h2>
              <p>{s.description}</p>
              {pool.length > 0 && (
                <>
                  <div className="skill-count">
                    {pool.length} รายการ
                    {s.id === "vocabulary" && id === "L01"
                      ? " · ศัพท์หลัก 7 + ศัพท์เสริม 16"
                      : ""}
                  </div>
                  <Meter value={pct} label={`เคยเรียน ${s.th}`} />
                  <small>เคยเรียน {pct}%</small>
                </>
              )}
            </>
          );
          return pool.length ? (
            <Link
              key={s.id}
              href={`/learn/${id}/${s.id}`}
              className="skill-card"
            >
              {content}
            </Link>
          ) : (
            <div className="skill-card unavailable" key={s.id}>
              {content}
            </div>
          );
        })}
      </div>
      <Link href={`/progress?lesson=${id}`} className="lesson-progress-link">
        <ChartNoAxesCombined size={21} />
        <span>ดูความก้าวหน้ารายข้อของบทนี้</span>
        <ChevronRight size={18} />
      </Link>
    </>
  );
}
