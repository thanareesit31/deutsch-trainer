"use client";

import { useState } from "react";
import Image from "next/image";
import type { Item } from "@/lib/content";
import { activityPairs, type LearningActivity } from "@/lib/guided-learning";
import { l14DativRows } from "@/lib/l14-dativ-learning";
import { ArticleDot } from "./profession-matching";
import { GermanListenText } from "./german-listen-text";

export function L14DativTable({ activity, items, matchedIds, busy, onMatch }: {
  activity: LearningActivity;
  items: Item[];
  matchedIds: string[];
  busy: boolean;
  onMatch: (id: string) => Promise<void>;
}) {
  const [wrongRow, setWrongRow] = useState<string | null>(null);
  const pairs = activityPairs(activity, items);

  return <div className="l14-dativ-learning">
    <p className="l14-dativ-intro">ดูคำด้านซ้าย แล้วเลือกคำเติมช่องว่างด้านขวา</p>
    <div className="l14-dativ-guide">
      <p><strong lang="de">Wo?</strong> แปลว่า “อยู่ที่ไหน” เมื่อบอกตำแหน่ง คำนำหน้านามจะเปลี่ยนเป็นรูป <strong lang="de">Dativ</strong></p>
      <ul>
        <li><span className="l14-dativ-guide-label"><ArticleDot article="der" />เพศชาย</span><strong lang="de">der → dem</strong><span lang="de">ein → einem</span></li>
        <li><span className="l14-dativ-guide-label"><ArticleDot article="das" />เพศกลาง</span><strong lang="de">das → dem</strong><span lang="de">ein → einem</span></li>
        <li><span className="l14-dativ-guide-label"><ArticleDot article="die" />เพศหญิง</span><strong lang="de">die → der</strong><span lang="de">eine → einer</span></li>
        <li><span className="l14-dativ-guide-label"><ArticleDot article="plural" />พหูพจน์</span><strong lang="de">die → den</strong><span>คำนามมักเติม -n</span></li>
      </ul>
    </div>
    <div className="l14-dativ-heading" aria-hidden="true"><span>รูปเดิม</span><span lang="de">Wo?</span><span>รูป Dativ</span><span>ภาพประกอบ</span></div>
    <div className="l14-dativ-rows">
      {l14DativRows.map((row, index) => {
        const pair = pairs[index];
        if (!pair) return null;
        const solved = matchedIds.includes(pair.id);
        return <div className="l14-dativ-row" key={row.contentId}>
          <div className="l14-dativ-original" lang="de"><ArticleDot article={{ masculine: "der", neuter: "das", feminine: "die", plural: "plural" }[row.article]} />{row.nominative}</div>
          <div className="l14-dativ-preposition" lang="de"><span className="l14-dativ-mobile-label">Wo?</span>{row.preposition}</div>
          <div className="l14-dativ-answer">
            <span className="l14-dativ-mobile-label">Dativ</span>
            {solved ? <>
              <GermanListenText text={`${row.correct} ${row.noun}`} />
              {row.alternate && <span className="l14-dativ-alternate" lang="de">หรือ {row.alternate}</span>}
              <small>{row.explanation}</small>
            </> : <>
              <span className="l14-dativ-prompt" lang="de"><strong>___</strong> {row.noun}</span>
              <div className="l14-dativ-choices" aria-label={`เลือกรูป Dativ ของ ${row.nominative}`}>
                {row.choices.map((choice) => <button key={choice} type="button" className="guided-choice" disabled={busy}
                  onClick={() => {
                    if (choice !== row.correct) { setWrongRow(pair.id); return; }
                    setWrongRow(null);
                    void onMatch(pair.id);
                  }} lang="de">{choice}</button>)}
              </div>
              {wrongRow === pair.id && <span className="l14-dativ-wrong" role="status">ลองอีกครั้ง ดูคำนำหน้านามทางซ้าย</span>}
            </>}
          </div>
          <Image className="l14-dativ-picture" src={row.image} alt={row.imageAlt} width={480} height={320} sizes="(max-width: 700px) 160px, (max-width: 1100px) 180px, 220px" />
        </div>;
      })}
    </div>
  </div>;
}
