"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { skills } from "@/lib/content";
import { useContent } from "./content-provider";

// Derive the learning hierarchy from the route, so direct links and reloads keep it.
export function LearningBreadcrumbs() {
  const path = usePathname();
  const { lessons } = useContent();
  const parts = path.split("/").filter(Boolean);
  if (!["lesson", "learn"].includes(parts[0]) || !parts[1]) return null;
  const lesson = lessons.find((entry) => entry.id === parts[1]);
  if (!lesson) return null;
  const crumbs = [
    { label: `Lektion ${String(lesson.number).padStart(2, "0")}`, href: `/lesson/${lesson.id}` },
  ];
  if (parts[0] === "learn" && parts[2]) {
    crumbs.push({ label: skills.find((skill) => skill.id === parts[2])?.de ?? parts[2], href: `/learn/${lesson.id}/${parts[2]}` });
    if (parts[3]) {
      const l13Label = lesson.id === "L13" ? ({
        "vocabulary:images": "Bilder Wortschatz",
        "vocabulary:extra": "Zusatzwortschatz",
        "grammar:verben": "Verben",
        "grammar:adjektive": "Adjektive",
      } as Record<string, string>)[`${parts[2]}:${parts[3]}`] : undefined;
      const label = l13Label ?? (parts[3] === "alphabet" ? "Das Alphabet"
        : parts[3] === "numbers" ? "Die Zahlen"
        : ["core-images", "core"].includes(parts[3]) ? "Bilder Wortschatz"
        : parts[3] === "pronouns" ? "Personalpronomen"
        : parts[3] === "verbs" ? "Verben"
        : parts[3] === "sentences" ? "Fragen und Sätze"
        : parts[3].replaceAll("-", " ").replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("de")));
      const href = lesson.id === "L13" && parts[2] === "vocabulary" && parts[3] === "images"
        ? "/learn/L13/vocabulary/images/urban"
        : `/learn/${lesson.id}/${parts[2]}/${parts[3]}`;
      crumbs.push({ label, href });
    }
  }
  return (
    <nav className="learning-breadcrumbs" aria-label="เส้นทางบทเรียน">
      <ol>{crumbs.map((crumb, index) => (
        <li key={crumb.href}>
          {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
          {index === crumbs.length - 1
            ? <span aria-current="page">{crumb.label}</span>
            : <Link href={crumb.href}>{crumb.label}</Link>}
        </li>
      ))}</ol>
    </nav>
  );
}

// Keep the current category visible when a narrow screen needs horizontal scrolling.
export function LearningCategoryTabs({ currentKey, children, ariaLabel = "หมวดคำศัพท์" }: { currentKey: string | number; children: ReactNode; ariaLabel?: string }) {
  const navigation = useRef<HTMLElement>(null);
  function enabledTabs() {
    return [...(navigation.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)') ?? [])];
  }
  function moveCategory(direction: number, focused?: HTMLElement | null) {
    const tabs = enabledTabs();
    const focusedIndex = focused ? tabs.indexOf(focused) : -1;
    const current = focusedIndex >= 0 ? focusedIndex : tabs.findIndex((tab) => tab.getAttribute("aria-current") === "page");
    const next = current >= 0 ? tabs[current + direction] : undefined;
    if (!next) return false;
    next.focus({ preventScroll: true });
    next.click();
    return true;
  }
  useEffect(() => {
    const element = navigation.current;
    const current = element?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!element || !current) return;
    const offset = current.getBoundingClientRect().left - element.getBoundingClientRect().left;
    element.scrollTo({ left: element.scrollLeft + offset - (element.clientWidth - current.offsetWidth) / 2 });
  }, [currentKey]);
  useEffect(() => {
    function navigateWithArrow(event: KeyboardEvent) {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key) || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const element = navigation.current;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!element || target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="slider"]')) return;
      // Preserve native arrow behavior in controls outside the category strip.
      if (target?.closest('button, a, [role="tab"]') && !element.contains(target)) return;
      if (moveCategory(event.key === "ArrowRight" ? 1 : -1, target)) event.preventDefault();
    }
    document.addEventListener("keydown", navigateWithArrow);
    return () => document.removeEventListener("keydown", navigateWithArrow);
  }, []);
  return <nav ref={navigation} className="learning-category-tabs" aria-label={ariaLabel}>{children}</nav>;
}

export function CategoryTabLabel({ german, thai }: { german: string; thai: string }) {
  return <><span className="category-tab-german" lang="de">{german}</span><span className="category-tab-thai" lang="th">{thai}</span></>;
}
