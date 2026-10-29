import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
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
  <rect width="${width}" height="12" fill="url(#bar)"/>
  <rect x="36" y="32" width="1528" height="836" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>

  <rect x="64" y="56" width="168" height="44" rx="22" fill="#A2DC25"/>
  <text x="84" y="85" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Sample plan</text>
  <text x="252" y="85" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">30/60/90-Day Hotel Management Plan — Sample</text>

  <text x="64" y="150" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">A sample sequence of work. Not a promised result.</text>
  <text x="64" y="186" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">แผนตัวอย่างสำหรับจัดลำดับงาน · Not every hotel will achieve a specific result in these periods</text>

  <rect x="64" y="220" width="464" height="300" rx="18" fill="#0B1F33"/>
  <text x="88" y="264" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">First 30 Days</text>
  <text x="88" y="304" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Audit current situation</text>
  <text x="88" y="336" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Align goals and owners</text>
  <text x="88" y="368" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Identify quick wins</text>
  <text x="88" y="400" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Confirm data and meeting rhythm</text>
  <text x="88" y="456" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Output: Baseline and Priority List</text>

  <rect x="560" y="220" width="464" height="300" rx="18" fill="#0B1F33"/>
  <text x="584" y="264" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Days 31–60</text>
  <text x="584" y="304" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Implement priority actions</text>
  <text x="584" y="336" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Establish weekly/monthly review</text>
  <text x="584" y="368" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Test operating changes</text>
  <text x="584" y="400" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Review KPI and blockers</text>
  <text x="584" y="456" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Output: Action Log and First Review</text>

  <rect x="1056" y="220" width="480" height="300" rx="18" fill="#0B1F33"/>
  <text x="1080" y="264" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Days 61–90</text>
  <text x="1080" y="304" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Stabilize operating rhythm</text>
  <text x="1080" y="336" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Evaluate progress</text>
  <text x="1080" y="368" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Update priorities</text>
  <text x="1080" y="400" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Set the next management cycle</text>
  <text x="1080" y="456" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Output: Review Summary and Next Plan</text>

  <text x="64" y="572" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Management Cadence — Sample</text>
  <rect x="64" y="596" width="464" height="120" rx="16" fill="#06182B"/>
  <text x="88" y="640" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Weekly</text>
  <text x="88" y="676" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Priorities · Blockers · Guest issues · Next actions</text>
  <rect x="560" y="596" width="464" height="120" rx="16" fill="#06182B"/>
  <text x="584" y="640" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Monthly</text>
  <text x="584" y="676" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Commercial · KPI · Budget · Next-month priorities</text>
  <rect x="1056" y="596" width="480" height="120" rx="16" fill="#06182B"/>
  <text x="1080" y="640" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Quarterly</text>
  <text x="1080" y="676" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Direction · Positioning · Investment · Strategy</text>

  <text x="64" y="784" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">ไม่ใช่แผนโรงแรมจริง และไม่การันตีรายได้ Occupancy หรือ ADR</text>
  <text x="64" y="824" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample plan only · Replace with an approved hotel project after assessment</text>
  <text x="64" y="856" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Diagram only · Hotel keeps owner decisions, staffing, budget, and service standards</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/independent-hotel-30-60-90-day-plan-placeholder.webp",
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
  throw new Error("sharp is required to write independent-hotel-30-60-90-day-plan-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
