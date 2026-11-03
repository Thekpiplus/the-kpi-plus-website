import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const columns = ["Metric", "Before", "After", "Follow-up"];
const rows = [
  ["Attendance / completion", "Not set", "Not set", "Not set"],
  ["Knowledge or skill check", "Not set", "Not set", "Not set"],
  ["Role-play checklist", "Not set", "Not set", "Not set"],
  ["Manager observation", "Not set", "Not set", "Not set"],
  ["Action plan follow-through", "Not set", "Not set", "Not set"],
  ["Business result", "Not set", "Not set", "Not set"],
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
  <rect x="72" y="64" width="980" height="56" rx="28" fill="#EBE722"/>
  <text x="92" y="100" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">Training Outcome Scorecard — Sample data</text>
  <rect x="1072" y="74" width="216" height="36" rx="18" fill="#A2DC25"/>
  <text x="1092" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 16:9</text>
  <rect x="72" y="144" width="318" height="40" rx="20" fill="#0B6660"/>
  <text x="92" y="170" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Immediate learning</text>
  <rect x="406" y="144" width="318" height="40" rx="20" fill="#0B6660"/>
  <text x="426" y="170" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Workplace application</text>
  <rect x="740" y="144" width="318" height="40" rx="20" fill="#0B6660"/>
  <text x="760" y="170" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Business if verified</text>
  <text x="72" y="214" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Empty template. No invented scores, headcount, revenue, or productivity claims.</text>
  ${columns
    .map((label, index) => {
      const x = 72 + index * 370;
      return `<rect x="${x}" y="236" width="354" height="44" rx="10" fill="#0B6660"/>
  <text x="${x + 16}" y="264" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">${label}</text>`;
    })
    .join("\n  ")}
  ${rows
    .map((cells, row) => {
      const y = 292 + row * 72;
      return cells
        .map((cell, index) => {
          const x = 72 + index * 370;
          const empty = cell === "Not set";
          return `<rect x="${x}" y="${y}" width="354" height="64" rx="10" fill="${empty ? "#0B1F33" : "#06182B"}" stroke="#A2DC25" stroke-opacity="0.28"/>
  <text x="${x + 16}" y="${y + 39}" fill="${empty ? "#9BB0C2" : "#F2F8E2"}" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">${cell}</text>`;
        })
        .join("\n  ");
    })
    .join("\n  ")}
  <text x="72" y="750" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Public page uses an HTML scorecard with Definition, Method, and Reviewer columns.</text>
  <text x="72" y="786" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Value cells stay empty until verified data exists. Business results stay blank without a measurement design.</text>
  <text x="72" y="836" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Source 1600 x 900 · Display ~720 x 405 · 16:9 · Dummy only</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-training-outcomes-scorecard-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-training-outcomes-scorecard-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
