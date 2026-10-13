import { writeFileSync } from "node:fs";

const swatches = [
  ["V222-weiss-v2.svg", "#fffdf7", "#a5a49d"],
  ["V223-gelb-v2.svg", "#f4c629", "#be9311"],
  ["V224-orange-v2.svg", "#ed851d", "#bc5b0e"],
  ["V225-rot-v2.svg", "#db3b35", "#ab2b2d"],
  ["V226-gruen-v2.svg", "#3e9b56", "#287443"],
  ["V227-blau-v2.svg", "#347cbe", "#245d96"],
  ["V228-braun-v2.svg", "#8c5537", "#69402e"],
  ["V229-schwarz-v2.svg", "#252728", "#111819"],
];

for (const [filename, color, edge] of swatches) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" role="img">
  <defs>
    <radialGradient id="paper"><stop stop-color="#fffaf0"/><stop offset="1" stop-color="#eddfc9"/></radialGradient>
    <linearGradient id="paint" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset=".7" stop-color="${color}"/><stop offset="1" stop-color="${edge}"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="13" stdDeviation="12" flood-color="#514537" flood-opacity=".2"/></filter>
  </defs>
  <rect width="960" height="640" fill="url(#paper)"/>
  <path d="M129 210 C185 142 293 137 374 133 C477 119 550 138 639 126 C722 122 817 153 840 210 C858 247 840 283 843 327 C853 404 825 470 748 494 C676 521 609 501 537 512 C443 530 381 505 292 511 C208 511 139 474 126 409 C116 370 137 340 121 303 C107 266 106 236 129 210Z" fill="url(#paint)" stroke="${edge}" stroke-width="${filename.includes("weiss") ? 10 : 3}" filter="url(#shadow)"/>
  <path d="M147 213 C221 177 329 169 406 169 C550 164 655 146 782 192 M162 428 C239 466 352 468 443 471 C605 480 718 456 800 427" fill="none" stroke="#ffffff" stroke-opacity=".16" stroke-width="17" stroke-linecap="round"/>
</svg>`;
  writeFileSync(new URL(`../public/images/lektion-05-vocabulary/${filename}`, import.meta.url), svg);
}
