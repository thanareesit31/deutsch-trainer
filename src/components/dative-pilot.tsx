"use client";

import { useEffect, useRef, useState } from "react";
import dative from "@/data/l13-dative-preview.json";
import esGibt from "@/data/l13-es-gibt-preview.json";
import verbs from "@/data/l13-verbs-preview.json";
import daily from "@/data/l13-daily-preview.json";
import basic from "@/data/l13-grammar-basic-preview.json";
import l14Grammar from "@/data/l14-grammar-preview.json";
import l14LokalePraepositionen from "@/data/l14-lokale-praepositionen-preview.json";
import l14WoDativ from "@/data/l14-wo-dativ-preview.json";
import l15Grammar from "@/data/l15-grammar-preview.json";
import l15Possessivartikel from "@/data/l15-possessivartikel-preview.json";
import l16Grammar from "@/data/l16-grammar-preview.json";
import l16TemporalePraepositionen from "@/data/l16-temporale-praepositionen-preview.json";
import l17Grammar from "@/data/l17-grammar-preview.json";
import l17Werden from "@/data/l17-werden-preview.json";
import l17Wollen from "@/data/l17-wollen-preview.json";
import l17MitOhne from "@/data/l17-mit-ohne-preview.json";
import l18Grammar from "@/data/l18-grammar-preview.json";
import l18ImperativSie from "@/data/l18-imperativ-sie-preview.json";
import l18Sollen from "@/data/l18-sollen-preview.json";

import vocabUrban from '@/data/l13-vocab-urban-preview.json';
import vocabCulture from '@/data/l13-vocab-culture-preview.json';
import vocabLeisure from '@/data/l13-vocab-leisure-preview.json';
import vocabExtra from '@/data/l13-vocab-extra-preview.json';
import vocabBasic from '@/data/l13-vocab-basic-preview.json';
import vocabDaily from '@/data/l13-vocab-daily-preview.json';

import phraseRating from '@/data/l13-phrases-rating-preview.json';
import phraseCity from '@/data/l13-phrases-city-preview.json';
import phraseFavorite from '@/data/l13-phrases-favorite-preview.json';
import phraseOpinions from '@/data/l13-phrases-opinions-preview.json';
import phraseBasic from '@/data/l13-phrases-basic-preview.json';
import phraseDaily from '@/data/l13-phrases-daily-preview.json';

const previews = {
  phraseRating: {html:phraseRating.html,title:'แบบฝึกประโยคและสำนวนบท 13',accountPrefix:'phrases-rating'},
  phraseCity: {html:phraseCity.html,title:'แบบฝึกประโยคและสำนวนบท 13',accountPrefix:'phrases-city'},
  phraseFavorite: {html:phraseFavorite.html,title:'แบบฝึกประโยคและสำนวนบท 13',accountPrefix:'phrases-favorite'},
  phraseOpinions: {html:phraseOpinions.html,title:'แบบฝึกประโยคและสำนวนบท 13',accountPrefix:'phrases-opinions'},
  phraseBasic: {html:phraseBasic.html,title:'แบบฝึกประโยคและสำนวนบท 13',accountPrefix:'phrases-basic'},
  phraseDaily: {html:phraseDaily.html,title:'แบบฝึกประโยคและสำนวนบท 13',accountPrefix:'phrases-daily'},

  vocabUrban: { html: vocabUrban.html, title: 'แบบฝึกคำศัพท์สถานที่ในเมือง', accountPrefix: 'vocab-urban' },
  vocabCulture: { html: vocabCulture.html, title: 'แบบฝึกคำศัพท์ร้านค้าและวัฒนธรรม', accountPrefix: 'vocab-culture' },
  vocabLeisure: { html: vocabLeisure.html, title: 'แบบฝึกคำศัพท์สันทนาการและธรรมชาติ', accountPrefix: 'vocab-leisure' },
  vocabExtra: { html: vocabExtra.html, title: 'แบบฝึกคำศัพท์เพิ่มเติม', accountPrefix: 'vocab-extra' },
  vocabBasic: { html: vocabBasic.html, title: 'แบบฝึกคำศัพท์บท 13', accountPrefix: 'vocab-basic' },
  vocabDaily: { html: vocabDaily.html, title: 'ชุดฝึกคำศัพท์แนะนำ', accountPrefix: 'vocab-daily' },
  dative: { html: dative.html, title: "แบบฝึก Personalpronomen im Dativ", accountPrefix: "dative" },
  esGibt: { html: esGibt.html, title: "แบบฝึก Es gibt + Akkusativ", accountPrefix: "es-gibt" },
  verbs: { html: verbs.html, title: "แบบฝึก Verben", accountPrefix: "verbs" },
  daily: { html: daily.html, title: "ชุดฝึกแนะนำบท 13", accountPrefix: "daily" },
  basic: { html: basic.html, title: "แบบฝึกไวยากรณ์ Lektion 13", accountPrefix: "grammar-basic" },
  l14Grammar: { html: l14Grammar.html, title: "แบบฝึกไวยากรณ์ Lektion 14", accountPrefix: "l14-grammar" },
  l14LokalePraepositionen: { html: l14LokalePraepositionen.html, title: "แบบฝึก Lokale Präpositionen", accountPrefix: "l14-lokale-praepositionen" },
  l14WoDativ: { html: l14WoDativ.html, title: "แบบฝึก Wo? + Dativ", accountPrefix: "l14-wo-dativ" },
  l15Grammar: { html: l15Grammar.html, title: "แบบฝึกไวยากรณ์ Lektion 15", accountPrefix: "l15-grammar" },
  l15Possessivartikel: { html: l15Possessivartikel.html, title: "แบบฝึก Possessivartikel", accountPrefix: "l15-possessivartikel" },
  l16Grammar: { html: l16Grammar.html, title: "แบบฝึกไวยากรณ์ Lektion 16", accountPrefix: "l16-grammar" },
  l16TemporalePraepositionen: { html: l16TemporalePraepositionen.html, title: "แบบฝึก in / vor / nach", accountPrefix: "l16-temporale-praepositionen" },
  l17Grammar: { html: l17Grammar.html, title: "แบบฝึกไวยากรณ์ Lektion 17", accountPrefix: "l17-grammar" },
  l17Werden: { html: l17Werden.html, title: "แบบฝึก werden", accountPrefix: "l17-werden" },
  l17Wollen: { html: l17Wollen.html, title: "แบบฝึก wollen", accountPrefix: "l17-wollen" },
  l17MitOhne: { html: l17MitOhne.html, title: "แบบฝึก mit และ ohne", accountPrefix: "l17-mit-ohne" },
  l18Grammar: { html: l18Grammar.html, title: "แบบฝึกไวยากรณ์ Lektion 18", accountPrefix: "l18-grammar" },
  l18ImperativSie: { html: l18ImperativSie.html, title: "แบบฝึก Imperativ Sie", accountPrefix: "l18-imperativ-sie" },
  l18Sollen: { html: l18Sollen.html, title: "แบบฝึก sollen", accountPrefix: "l18-sollen" },
} as const;

export function GrammarPilot({ userId, topic, learnedItemIds }: { userId: string; topic: keyof typeof previews; learnedItemIds?: string[] }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);
  const preview = previews[topic];

  useEffect(() => {
    function resize(event: MessageEvent<unknown>) {
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data;
      if (typeof data === "object" && data !== null && "type" in data && data.type === "grammar-preview-progress") {
        window.dispatchEvent(new Event("practice-progress-updated"));
        return;
      }
      if (typeof data !== "object" || data === null || !("type" in data) || data.type !== "grammar-preview-height") return;
      if (!("height" in data) || typeof data.height !== "number" || !Number.isFinite(data.height)) return;
      setHeight(Math.min(20000, Math.max(500, data.height)));
    }
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, []);

  return (
    <>
      <iframe
        key={`${topic}-${userId}`}
        ref={frame}
        title={preview.title}
        name={`${preview.accountPrefix}-account-${userId}`}
        srcDoc={preview.html}
        onLoad={() => frame.current?.contentWindow?.postMessage({ type: "grammar-preview-direct-start", learnedItemIds, resumeId: new URLSearchParams(window.location.search).get("resume") }, "*")}
        style={{ display: "block", width: "100%", height, border: 0 }}
      />
    </>
  );
}
