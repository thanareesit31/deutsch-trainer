import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function PracticeLanding({
  eyebrow,
  title,
  description,
  href,
  action,
  children,
  ariaLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  action: string;
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <main className="l14-practice-entry practice-landing">
      <section className="l14-practice-entry-main" aria-label={ariaLabel}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link className="button primary" href={href}>
          {action} <ArrowRight size={18} />
        </Link>
      </section>
      <details className="l14-practice-entry-topics">
        <summary>ฝึกเฉพาะหัวข้อ</summary>
        <div className="practice-grammar-topic-list">{children}</div>
      </details>
    </main>
  );
}
