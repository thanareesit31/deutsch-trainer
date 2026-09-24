"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Sun, LayoutDashboard, BookOpen, RotateCcw, ChartNoAxesCombined, Settings, ChevronRight, ArrowUpRight, Flame, Sparkles, Check, ArrowRight, Leaf, Menu, X, CircleHelp } from "lucide-react";
import { coreVocabulary, getLevel, items, lessons, skills, skillName, type Item, type Mode, type Skill } from "@/lib/content";
import { dayKey, makeQuestion, mastery, sessionItems, status, type Question } from "@/lib/engine";
import { useStore } from "./store";
import { useSession } from "./session-store";
import { Badge, Empty, Meter, SectionTitle, skillIcons } from "./ui";
import { PracticeSetup, Session } from "./practice";
import { ProgressPage, SettingsPage } from "./progress";

export type StartSession = (pool: Item[], mode: Mode | "review", count: number, title: string, origin: string, prioritize?: boolean) => void;
const nav = [
  { path: "/", label: "วันนี้ของฉัน", icon: LayoutDashboard }, { path: "/learn", label: "บทเรียน", icon: BookOpen },
  { path: "/review", label: "ทบทวน", icon: RotateCcw }, { path: "/progress", label: "ความก้าวหน้า", icon: ChartNoAxesCombined },
];
export default function Trainer() { return <Suspense fallback={<div className="loading">กำลังเปิดบทเรียน…</div>}><App /></Suspense>; }
function App() {
  const path = usePathname(); const router = useRouter(); const searchParams = useSearchParams();
  const { data, ready, error } = useStore();
  const { session, setSession } = useSession();
  const [mobileMenu, setMobileMenu] = useState(false);
  const due = items.filter(i => status(data.progress[i.id]) === "review").length;
  const start: StartSession = (pool, mode, count, title, origin, prioritize = data.settings.prioritize) => {
    const selected = sessionItems(pool, count, data.progress, prioritize);
    if (!selected.length) return;
    const questions: Question[] = selected.map(item => {
      const selectedMode: Mode = mode === "review" ? item.skill === "reading" || item.skill === "listening" ? "choice" : item.group === "Satzbau" ? "order" : "typing" : mode;
      return makeQuestion(item, selectedMode, data.progress[item.id]);
    });
    setSession({ id: Date.now(), questions, title, origin }); router.push("/session");
  };
  const active = (p: string) => p === "/" ? path === p : path.startsWith(p) || (p === "/learn" && (path.startsWith("/lesson") || path.startsWith("/practice")));
  let page: React.ReactNode;
  const parts = path.split("/").filter(Boolean);
  if (!ready) page = <div className="loading"><Sun className="spin" size={32} /><p>กำลังเปิดพื้นที่เรียนรู้ของคุณ…</p></div>;
  else if (path === "/") page = <Dashboard />;
  else if (path === "/learn") page = <LessonList key={searchParams.toString()} initialLevel={searchParams.get("level") || "A1.1"} />;
  else if (parts[0] === "lesson" && lessons.some(l => l.id === parts[1])) page = <LessonDetail id={parts[1]} />;
  else if (parts[0] === "practice" && lessons.some(l => l.id === parts[1]) && skills.some(s => s.id === parts[2])) page = <PracticeSetup key={path} lessonId={parts[1]} skill={parts[2] as Skill} start={start} />;
  else if (path === "/review") page = <ReviewPage start={start} />;
  else if (path === "/progress") page = <ProgressPage key={searchParams.toString()} query={searchParams.toString()} start={start} />;
  else if (path === "/settings") page = <SettingsPage />;
  else if (path === "/session" && session) page = <Session key={session.id} plan={session} start={start} />;
  else page = <Empty title={path === "/session" ? "คำตอบที่ฝึกไว้ถูกบันทึกแล้ว" : "ไม่พบหน้านี้"} text="เลือกบทเรียนเพื่อเริ่มรอบฝึกใหม่ได้เลย"><Link className="button primary" href="/learn">ไปที่บทเรียน <ArrowRight size={16} /></Link></Empty>;
  return <div className="app-shell">
    <a className="skip-link" href="#main">ข้ามไปเนื้อหา</a>
    {mobileMenu && <button className="nav-scrim" aria-label="ปิดเมนู" onClick={() => setMobileMenu(false)} />}
    <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
      <Link href="/" className="brand" onClick={() => setMobileMenu(false)}><span className="brand-mark"><Sun size={26} /></span><span>Deutsch<span className="brand-sub">mit Sun<span className="brand-dot">.</span></span></span></Link>
      <span className="nav-label">MEIN LERNRAUM</span>
      <nav aria-label="เมนูหลัก">{nav.map(n => <Link href={n.path} key={n.path} className={`nav-item ${active(n.path) ? "active" : ""}`} onClick={() => setMobileMenu(false)}><n.icon size={20} /><span>{n.label}</span>{n.path === "/review" && due > 0 && <span className="nav-count">{due}</span>}</Link>)}</nav>
      <div className="sidebar-note"><span className="note-sun">✳</span><p>ทุกคำที่จำได้<br />คืออีกก้าวที่ไกลขึ้น</p><small>Ein Schritt nach dem anderen.</small><span className="note-line" /></div>
      <div className="sidebar-bottom"><Link className={`nav-item ${active("/settings") ? "active" : ""}`} href="/settings" onClick={() => setMobileMenu(false)}><Settings size={20} />ตั้งค่าและข้อมูล</Link><div className="profile"><span className="avatar">S</span><div><strong>Sun</strong><small>German learner · A1</small></div><span className="online-dot" /></div></div>
    </aside>
    <div className="app-content">
      <header className="topbar"><div className="topbar-left"><button className="icon-button menu-toggle" aria-label={mobileMenu ? "ปิดเมนู" : "เปิดเมนู"} onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button><span className="topbar-label">พื้นที่เรียนภาษาเยอรมันของคุณ</span><span className="topbar-mobile">Deutsch mit Sun</span></div><div className="topbar-right"><span className="level-pill"><span className="german-flag" />A1.1 — A1.2</span><span className="topbar-divider" /><span className="small-avatar">S</span></div></header>
      <main id="main" className={path === "/session" ? "main-content session-main" : "main-content"}>{error && <div role="alert" className="notice error">{error}</div>}{page}</main>
      <footer className="footer"><span><Leaf size={14} />เรียนทีละนิด เติบโตทุกวัน</span><Link href="/settings">บันทึกในเบราว์เซอร์นี้ · สำรองข้อมูล <ArrowUpRight size={13} /></Link></footer>
    </div>
  </div>;
}

function Dashboard() {
  const { data } = useStore();
  const practiced = items.filter(i => data.progress[i.id]?.right + data.progress[i.id]?.wrong > 0);
  const mastered = items.filter(i => status(data.progress[i.id]) === "mastered");
  const review = items.filter(i => status(data.progress[i.id]) === "review");
  const last = [...practiced].sort((a,b) => data.progress[b.id].lastPracticed - data.progress[a.id].lastPracticed)[0];
  const lesson = lessons.find(l => l.id === last?.lessonId) || lessons[0];
  const today = data.days[dayKey()] || 0;
  const week = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - 6 + index); return { day: date.toLocaleDateString("th-TH", { weekday: "short" }), count: data.days[dayKey(date)] || 0, today: index === 6 }; });
  const stats = [
    { label: "คำศัพท์หลัก", value: coreVocabulary.length, caption: "ครบทั้ง 12 บทเรียน", icon: BookOpen, color: "green", href: "/progress?skill=vocabulary&collection=core" },
    { label: "เคยฝึกแล้ว", value: practiced.length, caption: "เริ่มต้นแล้ว นับทุกทักษะ", icon: Flame, color: "orange", href: "/progress?status=practiced" },
    { label: "จำได้แล้ว", value: mastered.length, caption: "ความมั่นใจที่ค่อย ๆ เพิ่มขึ้น", icon: Check, color: "purple", href: "/progress?status=mastered" },
    { label: "ควรทบทวน", value: review.length, caption: "ถึงเวลาทักทายความจำ", icon: RotateCcw, color: "pink", href: "/progress?status=review" },
  ];
  return <>
    <div className="page-heading"><div><span className="eyebrow">DEIN DEUTSCH, JEDEN TAG</span><h1>Hallo, Sun <span className="wave">☀</span></h1><p>วันนี้มาเก่งภาษาเยอรมันขึ้นอีกนิดกัน</p></div><span className="date-label">{new Date().toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" })}</span></div>
    <section className="hero">
      <div className="hero-copy"><span className="hero-tag"><span />เล็กน้อยทุกวัน เปลี่ยนเป็นความมั่นใจ</span><h2>ภาษาใหม่ เริ่มได้<br />ด้วย<span>ก้าวเล็ก ๆ ของเรา</span></h2><p>ฝึกคำศัพท์ เข้าใจไวยากรณ์ และค่อย ๆ พูดในแบบของคุณ<br className="desktop-break" />เลือกบทที่อยากเรียน แล้วไปต่อด้วยกัน</p><Link className="button primary" href={`/lesson/${lesson.id}`}>{last ? "เรียนต่อจากครั้งก่อน" : "เริ่มบทเรียนแรก"}<ArrowRight size={18} /></Link><span className="hero-footnote">{lesson.id} · {lesson.title}</span></div>
      <div className="hero-art" aria-hidden="true"><div className="art-orbit" /><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span><span className="art-dot" /><div className="speech-card"><span className="german-flag" /><small>EIN WORT, EIN ANFANG</small><strong>Hallo!</strong><span>สวัสดี จุดเริ่มต้นเล็ก ๆ ของเรา</span><div className="speech-rule" /><span className="art-audio"><span /><span /><span /><span /><span /><span /><span /></span><span className="sound-label">/haˈloː/</span></div><div className="mini-card"><span className="mini-sun"><Sun size={23} /></span><span>Schön, dass du da bist.<small>ดีใจที่คุณอยู่ตรงนี้นะ</small></span><Check size={17} /></div><div className="art-caption">Übung macht den Meister.<span>เก่งขึ้นได้ด้วยการฝึกฝน</span></div></div>
    </section>
    <div className="stats-grid">{stats.map(s => <Link className="stat-card" href={s.href} key={s.label}><div className="stat-top"><span className={`icon-tile ${s.color}`}><s.icon size={19} /></span><ArrowUpRight size={17} /></div><strong>{s.value}<small>{s.label === "คำศัพท์หลัก" ? "คำ" : "รายการ"}</small></strong><span className="stat-label">{s.label}</span><small>{s.caption}</small></Link>)}</div>
    <div className="dashboard-columns"><section><SectionTitle eyebrow="DEIN LERNWEG" title="เลือกเส้นทางการเรียน"><Link className="text-link" href="/learn">ดูทุกบท <ArrowRight size={15} /></Link></SectionTitle><div className="level-cards">{["A1.1", "A1.2"].map((level, i) => {
      const pool = coreVocabulary.filter(w => getLevel(w.lessonId) === level); const learned = pool.filter(w => status(data.progress[w.id]) === "mastered").length; const pct = Math.round(learned / pool.length * 100);
      return <Link className={`level-card level-${i}`} href={`/learn?level=${level}`} key={level}><div className="level-card-top"><span className="level-number">{level}</span><ArrowUpRight size={21} /></div><h3>{i === 0 ? "เริ่มต้นอย่างมั่นใจ" : "ต่อยอดให้คล่องขึ้น"}</h3><p>{i === 0 ? "ทักทาย แนะนำตัว และเรื่องใกล้ตัว" : "งานอดิเรก ชีวิตประจำวัน และการเดินทาง"}</p><div className="level-meta"><span>Lektion {i === 0 ? "01–06" : "07–12"}</span><span>6 บท · {pool.length} คำ</span></div><Meter value={pct} label={`คำศัพท์ ${level} ที่จำได้`} /><div className="level-progress"><span>จำได้แล้ว {learned} / {pool.length} คำ</span><b>{pct}%</b></div></Link>;
    })}</div></section><section className="weekly-card"><div className="weekly-title"><span className="icon-tile orange"><Flame size={18} /></span><h3>ทีละนิด แต่สม่ำเสมอ</h3></div><p>ความพยายามใน 7 วันที่ผ่านมา</p><div className="week-days">{week.map((d, i) => <div className={`week-day ${d.today ? "today" : ""}`} key={i}><span>{d.day}</span><div className={d.count ? "done" : ""}>{d.count ? <Check size={17} /> : <i />}</div></div>)}</div><div className="weekly-summary"><span><strong>{today}</strong> / 10 ข้อวันนี้</span><span>{today >= 10 ? "ครบเป้าหมายแล้ว!" : "เริ่มเมื่อไหร่ก็ดีเสมอ"}</span></div><Meter value={Math.min(100, today * 10)} label="เป้าหมายวันนี้" /><small>ทุกครั้งที่ฝึก ความจำจะค่อย ๆ แข็งแรงขึ้น</small></section></div>
    <section className="review-banner"><div className="review-orb"><RotateCcw size={24} /></div><div><h3>{review.length ? `มี ${review.length} รายการรอให้คุณทบทวน` : "เว้นจังหวะ แล้วกลับมาทบทวน"}</h3><p>{review.length ? "กลับมาฝึกสิ่งที่ยังไม่แม่น ให้จำได้นานกว่าเดิม" : "เมื่อเริ่มฝึก ระบบจะช่วยเลือกสิ่งที่ถึงเวลาทบทวนให้คุณ"}</p></div><Link href="/review" className="button secondary">ไปทบทวน <ArrowRight size={17} /></Link></section>
    <div className="bottom-note"><Sparkles size={15} /><span>ไม่ต้องเก่งทุกอย่างในวันเดียว แค่วันนี้ได้เรียนรู้อะไรเพิ่มก็พอแล้ว</span></div>
  </>;
}

function LessonList({ initialLevel }: { initialLevel: string }) {
  const { data } = useStore();
  const [level, setLevel] = useState(initialLevel);
  return <><div className="page-heading"><div><span className="eyebrow">DEIN LERNWEG</span><h1>บทเรียนของคุณ</h1><p>เลือกบทที่อยากฝึกได้เลย ทุกบทเปิดให้เรียนอย่างอิสระ</p></div><span className="quiet-pill">12 บทเรียน · 181 คำหลัก</span></div><div className="segmented level-switch" aria-label="เลือกระดับ">{["A1.1", "A1.2"].map(l => <button className={level === l ? "selected" : ""} onClick={() => setLevel(l)} key={l}>{l}<span>Lektion {l === "A1.1" ? "01–06" : "07–12"}</span></button>)}</div><div className="lesson-grid">{lessons.filter(l => l.level === level).map(l => {
    const pool = coreVocabulary.filter(w => w.lessonId === l.id); const learned = pool.filter(w => status(data.progress[w.id]) === "mastered").length; const pct = Math.round(learned / pool.length * 100);
    const any = pool.some(w => data.progress[w.id]);
    return <Link className="lesson-card" href={`/lesson/${l.id}`} key={l.id}><div className="lesson-card-top"><span className="lesson-num">{String(l.number).padStart(2, "0")}</span><Badge state={pct === 100 ? "mastered" : any ? "learning" : "new"} /></div><span className="eyebrow">LEKTION {String(l.number).padStart(2, "0")}</span><h2>{l.title}</h2><p>{l.thai}</p><div className="lesson-tags"><span>{pool.length} คำหลัก</span>{l.id === "L01" && <span>6 ทักษะ</span>}</div><Meter value={pct} label={`${l.id} คำศัพท์ที่จำได้`} /><div className="lesson-card-bottom"><span>คำศัพท์ที่จำได้ {pct}%</span><ArrowRight size={18} /></div></Link>;
  })}</div><div className="notice"><CircleHelp size={19} /><span>L01 มีแบบฝึกทั้ง 6 ทักษะ ส่วน L02–L12 มีคำศัพท์เดิมครบ พร้อมเพิ่มเนื้อหาทักษะอื่นเมื่อจัดเตรียมบทเรียนแล้ว</span></div></>;
}
function LessonDetail({ id }: { id: string }) {
  const lesson = lessons.find(l => l.id === id)!; const { data } = useStore();
  return <><Link className="back-link" href={`/learn?level=${lesson.level}`}>← กลับไปเลือกบทเรียน</Link><div className="lesson-heading"><span className="lesson-heading-num">{String(lesson.number).padStart(2, "0")}</span><div><span className="eyebrow">{lesson.level} / LEKTION {String(lesson.number).padStart(2, "0")}</span><h1>{lesson.title}</h1><p>{lesson.thai}</p></div></div><SectionTitle title="วันนี้อยากฝึกทักษะไหน?" eyebrow="EIN SCHRITT WEITER" /><div className="skills-grid">{skills.map(s => {
    const Icon = skillIcons[s.id]; const pool = items.filter(i => i.lessonId === id && i.skill === s.id); const pct = pool.length ? Math.round(pool.reduce((sum, i) => sum + mastery(data.progress[i.id]), 0) / pool.length) : 0;
    const content = <><div className="skill-top"><span className={`icon-tile large ${s.color}`}><Icon size={24} /></span>{pool.length ? <ArrowUpRight size={20} /> : <span className="quiet-pill">กำลังเตรียมเนื้อหา</span>}</div><span className="eyebrow">{s.de}</span><h2>{s.th}</h2><p>{s.description}</p>{pool.length > 0 && <><div className="skill-count">{pool.length} รายการ{s.id === "vocabulary" && id === "L01" ? " · ศัพท์หลัก 7 + ศัพท์เสริม 16" : ""}</div><Meter value={pct} label={`ความชำนาญ ${s.th}`} /><small>ความชำนาญ {pct}%</small></>}</>;
    return pool.length ? <Link key={s.id} href={`/practice/${id}/${s.id}`} className="skill-card">{content}</Link> : <div className="skill-card unavailable" key={s.id}>{content}</div>;
  })}</div><Link href={`/progress?lesson=${id}`} className="lesson-progress-link"><ChartNoAxesCombined size={21} /><span>ดูความก้าวหน้ารายข้อของบทนี้</span><ChevronRight size={18} /></Link></>;
}
function ReviewPage({ start }: { start: StartSession }) {
  const { data } = useStore();
  const pool = items.filter(i => status(data.progress[i.id]) === "review");
  const [selected, setSelected] = useState<Skill | "all">("all");
  const filtered = pool.filter(i => selected === "all" || i.skill === selected);
  return <><div className="page-heading"><div><span className="eyebrow">WIEDERHOLEN & WACHSEN</span><h1>กลับมาทบทวนกัน</h1><p>สิ่งที่ยังไม่แม่น และสิ่งที่ถึงเวลาจำอีกครั้ง</p></div><span className="icon-tile large green"><RotateCcw size={24} /></span></div>{pool.length === 0 ? <Empty title="ตอนนี้ยังไม่มีรายการถึงกำหนดทบทวน" text="เริ่มฝึกบทเรียน ระบบจะเก็บคำตอบที่ผิดและนัดวันทบทวนคำที่ตอบถูกให้คุณ"><Link href="/learn" className="button primary">เลือกบทเรียน <ArrowRight size={17} /></Link></Empty> : <><div className="review-summary panel"><span className="eyebrow">DEINE WIEDERHOLUNG</span><h2>{pool.length} รายการที่ควรทบทวน</h2><p>เลือกทักษะ หรือฝึกสลับทักษะในรอบทบทวน</p><div className="filter-chips"><button className={selected === "all" ? "selected" : ""} onClick={() => setSelected("all")}>ทุกทักษะ ({pool.length})</button>{skills.filter(s => pool.some(i => i.skill === s.id)).map(s => <button key={s.id} className={selected === s.id ? "selected" : ""} onClick={() => setSelected(s.id)}>{s.th} ({pool.filter(i => i.skill === s.id).length})</button>)}</div><button className="button primary" onClick={() => start(filtered, "review", data.settings.sessionSize, "ทบทวนวันนี้", "/review")}>เริ่มทบทวน {data.settings.sessionSize ? Math.min(filtered.length, data.settings.sessionSize) : filtered.length} ข้อ <ArrowRight size={18} /></button></div><div className="review-list">{filtered.map(i => <div className="review-row" key={i.id}><span className={`icon-tile ${skills.find(s => s.id === i.skill)?.color}`}><RotateCcw size={17} /></span><div><strong>{i.title}</strong><small>{i.lessonId} · {skillName(i.skill)} · {i.meaning}</small></div><Badge state="review" /></div>)}</div></>}</>;
}
