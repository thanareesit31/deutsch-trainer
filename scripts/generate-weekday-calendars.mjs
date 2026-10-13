import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL("../public/images/lektion-08-vocabulary/", import.meta.url));
const days = [
  { short: "Mo", color: "#d8aa16", tint: "#fff2b8" },
  { short: "Di", color: "#d65d91", tint: "#ffe2ee" },
  { short: "Mi", color: "#459b64", tint: "#def3e4" },
  { short: "Do", color: "#dc8333", tint: "#ffead4" },
  { short: "Fr", color: "#3d87bb", tint: "#deeffb" },
  { short: "Sa", color: "#845ca8", tint: "#eee2f7" },
  { short: "So", color: "#c95657", tint: "#ffe4e0" },
];

function calendarSvg(selectedDay) {
  const weekend = selectedDay === 7;
  const cells = days.map((day, index) => {
    const x = 82 + index * 82;
    const selected = weekend ? index >= 5 : index === selectedDay;
    return `
      <rect x="${x}" y="190" width="75" height="165" rx="12" fill="${selected ? day.tint : "#fffdf9"}" stroke="${selected ? day.color : "#e2d9cd"}" stroke-width="${selected ? 2.5 : 1.5}"/>
      <path d="M${x + 12} 208h51" stroke="${day.color}" stroke-width="7" stroke-linecap="round"/>
      <text x="${x + 37.5}" y="262" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="32" fill="#303b36">${day.short}</text>
      <text x="${x + 37.5}" y="324" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="41" fill="${selected ? day.color : "#87918b"}">${14 + index}</text>`;
  }).join("");
  const ring = weekend
    ? `<rect x="486" y="181" width="171" height="182" rx="48" fill="none" stroke="url(#weekendRing)" stroke-width="7" transform="rotate(-2 571.5 272)"/>`
    : `<rect x="${76 + selectedDay * 82}" y="181" width="87" height="182" rx="41" fill="none" stroke="${days[selectedDay].color}" stroke-width="7" transform="rotate(-3 ${119.5 + selectedDay * 82} 272)"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480" width="720" height="480" role="img" aria-label="ปฏิทินหนึ่งสัปดาห์ เน้น${weekend ? "วันเสาร์และวันอาทิตย์" : days[selectedDay].short}">
    <defs>
      <linearGradient id="desk" x2="0" y2="1"><stop stop-color="#e4c9a8"/><stop offset="1" stop-color="#c89f76"/></linearGradient>
      <linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fffdf8"/><stop offset="1" stop-color="#f6eee2"/></linearGradient>
      <linearGradient id="weekendRing" x2="1" y2="0"><stop stop-color="#845ca8"/><stop offset="1" stop-color="#c95657"/></linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="13" stdDeviation="14" flood-color="#775338" flood-opacity=".23"/></filter>
    </defs>
    <rect width="720" height="480" fill="url(#desk)"/>
    <path d="M0 434H720" stroke="#b4855e" stroke-width="2" opacity=".45"/>
    <rect x="52" y="57" width="616" height="364" rx="21" fill="url(#paper)" filter="url(#shadow)"/>
    <rect x="52" y="57" width="616" height="81" rx="21" fill="#f1e9dd"/>
    <path d="M52 117H668" stroke="#e2d5c4" stroke-width="2"/>
    ${[121, 217, 313, 409, 505, 601].map((x) => `<rect x="${x - 10}" y="40" width="20" height="44" rx="10" fill="none" stroke="#827b72" stroke-width="7"/><path d="M${x - 5} 49v23" stroke="#cbc6bc" stroke-width="2"/>`).join("")}
    <text x="360" y="166" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700" letter-spacing="3" fill="#435047">DIE WOCHE</text>
    ${cells}
    ${ring}
    <path d="M83 385H637" stroke="#e5d9c9" stroke-width="2"/>
  </svg>`;
}

for (let index = 0; index < 8; index++) {
  await writeFile(`${outputDirectory}V${113 + index}-calendar-v2.svg`, calendarSvg(index));
}
