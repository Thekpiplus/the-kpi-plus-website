import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const stages = [
  { num: "01", line1: "Ad/Search", line2: "", tone: "yellow" },
  { num: "02", line1: "Hotel", line2: "Website", tone: "yellow" },
  { num: "03", line1: "Room/Offer", line2: "Page", tone: "yellow" },
  { num: "04", line1: "Booking", line2: "CTA", tone: "yellow" },
  { num: "05", line1: "Booking", line2: "Engine", tone: "yellow" },
  { num: "06", line1: "Booking", line2: "Complete", tone: "amber" },
];

const boxW = 210;
const boxH = 250;
const gap = 24;
const startX = 110;
const startY = 290;

function box(stage, index) {
  const x = startX + index * (boxW + gap);
  const fill = stage.tone === "amber" ? "#F8E6C8" : "#FFF6C2";
  const stroke = stage.tone === "amber" ? "#E3A008" : "#EBE722";
  const numFill = stage.tone === "amber" ? "#3B3B3B" : "#0B6660";
  const arrow =
    index < stages.length - 1
      ? `<polygon points="${x + boxW + 4},${startY + boxH / 2 - 10} ${x + boxW + gap - 4},${startY + boxH / 2} ${x + boxW + 4},${startY + boxH / 2 + 10}" fill="#A2DC25"/>`
      : "";
  return `
  <rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="4"/>
  <text x="${x + 22}" y="${startY + 58}" fill="${numFill}" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="800">${stage.num}</text>
  <text x="${x + 22}" y="${startY + 118}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${stage.line1}</text>
  ${stage.line2 ? `<text x="${x + 22}" y="${startY + 158}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${stage.line2}</text>` : ""}
  ${arrow}`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="${width}" y2="0">
      <stop stop-color="#A2DC25"/>
      <stop offset="1" stop-color="#EBE722"/>
    </linearGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#06182B"/>
      <stop offset="0.55" stop-color="#0B1F33"/>
      <stop offset="1" stop-color="#0B6660"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="14" fill="url(#bar)"/>
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="268" height="56" rx="28" fill="#A2DC25"/>
  <text x="96" y="101" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="28" font-weight="800">ตัวอย่างข้อมูล</text>
  <text x="72" y="196" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="48" font-weight="800">Direct Booking Friction Map — Sample</text>
  <text x="72" y="250" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">Ad/Search → Hotel Website → Room/Offer → CTA → Engine → Complete</text>
  ${stages.map(box).join("")}
  <rect x="72" y="600" width="28" height="28" rx="14" fill="#A2DC25"/>
  <text x="112" y="624" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Clear</text>
  <rect x="248" y="600" width="28" height="28" rx="14" fill="#EBE722"/>
  <text x="288" y="624" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Needs review</text>
  <rect x="520" y="600" width="28" height="28" rx="14" fill="#E3A008"/>
  <text x="560" y="624" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Blocked / tracking not configured</text>
  <text x="72" y="710" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="26">Sample flow · Replace with approved hotel project</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-friction-map-placeholder.webp",
);
await mkdir(dirname(out), { recursive: true });

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  try {
    sharp = require("next/dist/compiled/sharp");
  } catch {
    sharp = null;
  }
}

if (!sharp) {
  throw new Error("sharp is required to write hotel-direct-booking-friction-map-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
