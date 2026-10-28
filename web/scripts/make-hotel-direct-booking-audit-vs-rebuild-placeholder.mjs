import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const stages = [
  { num: "01", line1: "Current", line2: "Website Audit" },
  { num: "02", line1: "Content / Mobile", line2: "CTA / Engine" },
  { num: "03", line1: "Identify", line2: "Friction" },
  { num: "04", line1: "Improve or", line2: "Rebuild" },
];

const boxW = 310;
const boxH = 230;
const gap = 32;
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
  <text x="${x + 24}" y="${startY + 56}" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="800">${stage.num}</text>
  <text x="${x + 24}" y="${startY + 114}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="30" font-weight="800">${stage.line1}</text>
  <text x="${x + 24}" y="${startY + 156}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="30" font-weight="800">${stage.line2}</text>
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
  <text x="72" y="196" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="42" font-weight="800">Direct Booking Audit Before Redesign — Sample</text>
  <text x="72" y="248" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">Audit → Review → Identify Friction → Improve or Rebuild</text>
  ${stages.map(box).join("")}
  <rect x="92" y="578" width="520" height="72" rx="36" fill="#F2F8E2"/>
  <text x="128" y="624" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">Improve Existing Website</text>
  <rect x="644" y="578" width="420" height="72" rx="36" fill="#FFF6C2"/>
  <text x="680" y="624" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">Consider Rebuild</text>
  <text x="72" y="710" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="26">A rebuild is not always better</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-audit-vs-rebuild-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-direct-booking-audit-vs-rebuild-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
