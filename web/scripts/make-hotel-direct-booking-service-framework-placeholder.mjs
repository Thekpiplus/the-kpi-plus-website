import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const stages = [
  { num: "01", stage: "Diagnose", output: "Friction Audit" },
  { num: "02", stage: "Clarify", output: "Room/Offer/Policy" },
  { num: "03", stage: "Guide", output: "CTA / Navigation" },
  { num: "04", stage: "Connect", output: "Engine Handoff" },
  { num: "05", stage: "Measure", output: "Measurement Plan" },
];

const boxW = 248;
const boxH = 260;
const gap = 28;
const startX = 92;
const startY = 300;

function box(stage, index) {
  const x = startX + index * (boxW + gap);
  const arrow =
    index < stages.length - 1
      ? `<polygon points="${x + boxW + 6},${startY + boxH / 2 - 12} ${x + boxW + gap - 6},${startY + boxH / 2} ${x + boxW + 6},${startY + boxH / 2 + 12}" fill="#A2DC25"/>`
      : "";
  return `
  <rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="24" fill="#F2F8E2" stroke="#A2DC25" stroke-width="4"/>
  <text x="${x + 24}" y="${startY + 58}" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="800">${stage.num}</text>
  <text x="${x + 24}" y="${startY + 118}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="800">${stage.stage}</text>
  <text x="${x + 24}" y="${startY + 178}" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">${stage.output}</text>
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
  <text x="72" y="196" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="44" font-weight="800">Direct Booking Conversion Framework — Sample</text>
  <text x="72" y="248" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">Diagnose → Clarify → Guide → Connect → Measure</text>
  ${stages.map(box).join("")}
  <text x="72" y="660" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="26">Sample framework · Replace with approved hotel project</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-service-framework-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-direct-booking-service-framework-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
