import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const columns = ["Department / Role", "Skill / topic", "Learning activity", "Assessment / follow-up"];
const rows = [
  ["Front Office / Guest Service", "Service recovery", "Role-play", "Observe practice"],
  ["Reservations", "Workflow / handover", "Case exercise", "Review artefact"],
  ["Revenue", "KPI / data literacy", "Sample-data workshop", "Decision review"],
  ["Sales / Marketing", "Commercial handover", "Group exercise", "Owner follow-up"],
  ["Supervisor / Manager", "Coaching / feedback", "Practice conversation", "Workplace observation"],
];

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
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="2"/>
  <rect x="72" y="64" width="820" height="56" rx="28" fill="#EBE722"/>
  <text x="92" y="100" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">Hotel Team Skill Matrix — Sample</text>
  <rect x="916" y="74" width="216" height="36" rx="18" fill="#A2DC25"/>
  <text x="936" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 16:9</text>
  <text x="72" y="168" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">By department / role · not a live score</text>
  <text x="72" y="204" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20" font-weight="700">ตัวอย่างตามงานที่เปิดรับ ไม่ใช่แคตตาล็อกหลักสูตร และไม่ใช่คะแนนพนักงาน</text>
  ${columns
    .map((label, index) => {
      const x = 72 + index * 365;
      return `<rect x="${x}" y="236" width="349" height="48" rx="10" fill="#0B6660"/>
  <text x="${x + 16}" y="266" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">${label}</text>`;
    })
    .join("\n  ")}
  ${rows
    .map((cells, row) => {
      const y = 300 + row * 92;
      return cells
        .map((cell, index) => {
          const x = 72 + index * 365;
          return `<rect x="${x}" y="${y}" width="349" height="80" rx="12" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.28"/>
  <text x="${x + 16}" y="${y + 46}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">${cell}</text>`;
        })
        .join("\n  ");
    })
    .join("\n  ")}
  <text x="72" y="800" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Public page uses an HTML table and cards. Do not replace with a stock photo.</text>
  <text x="72" y="836" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Source 1600 × 900 · Display ~720 × 405 · 16:9 · Dummy only</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-team-skill-matrix-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-team-skill-matrix-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
