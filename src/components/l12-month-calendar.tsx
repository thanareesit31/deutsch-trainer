import Image from "next/image";
import { l12MonthNumberById } from "@/lib/vocabulary-image-content";

const seasonArtwork = {
  spring: { image: "V166.jpg", ink: "#477a55", line: "#a7cfa2" },
  summer: { image: "V167.jpg", ink: "#9a6419", line: "#e7bf68" },
  autumn: { image: "V168.jpg", ink: "#a35838", line: "#d9a47d" },
  winter: { image: "V169.jpg", ink: "#47708d", line: "#a8c7db" },
} as const;

export function L12MonthCalendar({ itemId }: { itemId: string }) {
  const month = l12MonthNumberById[itemId];
  if (!month) return null;
  const season = month >= 3 && month <= 5 ? "spring"
    : month >= 6 && month <= 8 ? "summer"
      : month >= 9 && month <= 11 ? "autumn" : "winter";
  const artwork = seasonArtwork[season];

  return <div className={`l12-month-calendar season-${season}`}>
    <Image
      src={`/images/lektion-12-vocabulary/${artwork.image}`}
      alt=""
      width={600}
      height={400}
      sizes="(max-width: 700px) 82vw, (max-width: 1100px) 27vw, 22vw"
      className="l12-month-calendar-background"
    />
    <span className="l12-month-calendar-shade" aria-hidden="true" />
    <svg className="l12-month-calendar-face" viewBox="0 0 600 400" aria-hidden="true" focusable="false">
      <rect x="142" y="48" width="316" height="304" rx="24" fill="#fffdf8" fillOpacity=".97" stroke={artwork.line} strokeWidth="5" />
      <path d="M142 112V72a24 24 0 0 1 24-24h268a24 24 0 0 1 24 24v40Z" fill={artwork.ink} />
      {[212, 300, 388].map((x) => <g key={x}><rect x={x - 6} y="28" width="12" height="44" rx="6" fill="#f4efe4" /><circle cx={x} cy="66" r="10" fill="#fffdf8" /></g>)}
      <text x="300" y="259" textAnchor="middle" fill={artwork.ink} fontFamily="Arial, sans-serif" fontSize="142" fontWeight="700" letterSpacing="-8">{String(month).padStart(2, "0")}</text>
      <path d="M188 300h224" stroke={artwork.line} strokeWidth="5" strokeLinecap="round" />
      {[208, 245, 282, 319, 356, 393].map((x) => <circle key={x} cx={x} cy="326" r="5" fill={artwork.line} />)}
    </svg>
  </div>;
}
