import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const columns = ["Signal", "What it covers", "Evidence", "Public status"];
const rows = [
  ["Participation", "Attendance / completion", "Hotel keeps the list", "Not set — Sample"],
  ["Confidence", "Reflection / self-check", "Only if collected", "Not collected — Sample"],
  ["Application", "Role-play or observation", "No public scores", "Not set — Sample"],
  ["Follow-through", "Owner and review date", "Where in scope", "Not set — Sample"],
  ["Review", "Summary and next action", "Not a ranking", "Not set — Sample"],
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
  <rect x="72" y="64" width="1100" height="56" rx="28" fill="#EBE722"/>
  <text x="92" y="100" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">Learning Follow-through Framework — Sample</text>
  <rect x="1200" y="74" width="216" height="36" rx="18" fill="#A2DC25"/>
  <text x="1220" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 16:9</text>
  <text x="72" y="168" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Review signals for practice and application. Not a proprietary assessment model.</text>
  <text x="72" y="204" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">No public individual scores, progress badges, or employee ranking.</text>
  ${columns
    .map((label, index) => {
      const x = 72 + index * 365;
      return `<rect x="${x}" y="236" width="349" height="44" rx="10" fill="#0B6660"/>
  <text x="${x + 16}" y="264" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">${label}</text>`;
    })
    .join("\n  ")}
  ${rows
    .map((cells, row) => {
      const y = 296 + row * 78;
      return cells
        .map((cell, index) => {
          const x = 72 + index * 365;
          const sample = /Sample|Not set|Not collected/.test(cell);
          return `<rect x="${x}" y="${y}" width="349" height="70" rx="10" fill="${sample ? "#0B1F33" : "#06182B"}" stroke="#A2DC25" stroke-opacity="0.28"/>
  <text x="${x + 16}" y="${y + 42}" fill="${sample ? "#9BB0C2" : "#F2F8E2"}" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">${cell}</text>`;
        })
        .join("\n  ");
    })
    .join("\n  ")}
  <text x="72" y="720" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Public page uses an HTML table and cards. Confidence appears only if it was collected.</text>
  <text x="72" y="756" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Source 1600 x 900 · Display ~720 x 405 · 16:9 · Dummy only</text>
  <text x="72" y="836" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">HTML / CSS table. Not a people photo.</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-training-learning-followthrough-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-training-learning-followthrough-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
