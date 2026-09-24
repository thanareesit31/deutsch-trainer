import { BookOpen, Brain, MessageCircle, PenLine, Headphones, BookText, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { Skill } from "@/lib/content";
import type { Status } from "@/lib/engine";

export const skillIcons: Record<Skill, LucideIcon> = { vocabulary: BookOpen, grammar: Brain, phrases: MessageCircle, writing: PenLine, listening: Headphones, reading: BookText };
export const statusLabels: Record<Status, string> = { new: "ยังไม่เริ่ม", learning: "กำลังเรียนรู้", mastered: "จำได้แล้ว", review: "ควรทบทวน" };
export function Badge({ state }: { state: Status }) { return <span className={`status ${state}`}><i />{statusLabels[state]}</span>; }
export function Meter({ value, label }: { value: number; label: string }) { return <div className="meter" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}><span style={{ width: `${value}%` }} /></div>; }
export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) { return <div className="section-title"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{children}</div>; }
export function Empty({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) { return <div className="empty"><span className="empty-icon"><BookOpen size={30} /></span><h3>{title}</h3><p>{text}</p>{children}</div>; }
export function Arrow() { return <ArrowUpRight size={18} aria-hidden="true" />; }
