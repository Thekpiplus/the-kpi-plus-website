import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const groups = [
  { title: "01 Landing Page", items: ["Room detail views", "CTA clicks", "Offer views", "Landing page engagement"], outcome: false },
  { title: "02 Mobile", items: ["Mobile visits", "Page speed", "Interaction success", "Error rate", "Mobile booking path"], outcome: false },
  { title: "03 Intent", items: ["Calls", "Contact form", "Chat starts", "Booking Engine starts", "Availability checks"], outcome: false },
  { title: "04 Booking Outcome", items: ["Booking complete", "Conversion rate", "Direct booking value", "Cost / revenue attribution"], outcome: true },
];

function groupBlock(group, index) {
  const x = 72 + index * 370;
  const rows = group.items
    .map((name, row) => {
      const y = 268 + row * 52;
      return `<rect x="${x}" y="${y}" width="338" height="44" rx="10" fill="${group.outcome ? "#1A1408" : "#0B1F33"}" stroke="${group.outcome ? "#E3A008" : "#A2DC25"}" stroke-opacity="${group.outcome ? "0.9" : "0.35"}" stroke-width="2"/>
  <text x="${x + 16}" y="${y + 28}" fill="${group.outcome ? "#E3A008" : "#F2F8E2"}" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">${name}</text>`;
    })
    .join("\n  ");
  const footer = group.outcome
    ? `<text x="${x + 16}" y="572" fill="#E3A008" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="700">Tracking not configured</text>`
    : `<text x="${x + 16}" y="572" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="700">Sample series</text>`;
  return `<text x="${x}" y="248" fill="${group.outcome ? "#E3A008" : "#A2DC25"}" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="1.2">${group.title}</text>
  ${rows}
  ${footer}`;
}

const points = [
  [92, 780],
  [250, 742],
  [408, 754],
  [566, 700],
  [724, 708],
  [882, 658],
];
const path = points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0B1F33"/>
  <rect width="${width}" height="10" fill="#A2DC25"/>
  <rect x="48" y="36" width="1504" height="828" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <rect x="80" y="64" width="168" height="40" rx="999" fill="#A2DC25"/>
  <text x="164" y="91" text-anchor="middle" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">SAMPLE DATA</text>
  <text x="80" y="150" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">Hotel Website Performance Metrics · Sample data</text>
  <text x="80" y="190" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Four groups · Booking Outcome hidden until the engine and events are approved</text>
  ${groups.map(groupBlock).join("\n  ")}
  <line x1="80" y1="820" x2="900" y2="820" stroke="#E3E8EB" stroke-width="2"/>
  <line x1="80" y1="640" x2="80" y2="820" stroke="#E3E8EB" stroke-width="2"/>
  <line x1="80" y1="688" x2="900" y2="688" stroke="#EBE722" stroke-width="2" stroke-dasharray="8 7"/>
  <path d="${path}" fill="none" stroke="#A2DC25" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  ${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#A2DC25"/>`).join("\n  ")}
  <text x="80" y="848" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample index · not a hotel result · no Booking Outcome values</text>
  <text x="920" y="700" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">#A2DC25 positive series</text>
  <text x="920" y="732" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">#EBE722 target marker</text>
  <text x="920" y="764" fill="#E3A008" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Amber · tracking incomplete</text>
  <text x="920" y="796" fill="#E3E8EB" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Navy / grey axes · 1600 × 900 · 720 × 405</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-website-performance-metrics-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-website-performance-metrics-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
