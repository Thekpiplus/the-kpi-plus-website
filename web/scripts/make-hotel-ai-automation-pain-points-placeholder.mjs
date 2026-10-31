import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const steps = [
  ["01", "Website / LINE / Email", "Missing owner"],
  ["02", "Copy / Paste by Staff", "Duplicate work"],
  ["03", "Spreadsheet / PMS / CRM", "Data mismatch"],
  ["04", "Manual Check", "Human review required"],
  ["05", "Guest / Team Response", "Delayed handoff"],
];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="${width}" y2="0">
      <stop stop-color="#A2DC25"/>
      <stop offset="1" stop-color="#EBE722"/>
    </linearGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#06182B"/>
      <stop offset="1" stop-color="#0B1F33"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="10" fill="url(#bar)"/>
  <rect x="40" y="36" width="1120" height="728" rx="20" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <rect x="64" y="60" width="168" height="36" rx="6" fill="#06182B"/>
  <text x="76" y="84" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800" letter-spacing="2">SAMPLE</text>
  ${steps
    .map(([num, title, friction], index) => {
      const y = 128 + index * 118;
      return `<rect x="64" y="${y}" width="1072" height="100" rx="14" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <text x="92" y="${y + 42}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">${num}</text>
  <text x="148" y="${y + 42}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">${title}</text>
  <rect x="148" y="${y + 56}" width="260" height="28" rx="14" fill="#EBE722"/>
  <text x="164" y="${y + 76}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="700">${friction}</text>`;
    })
    .join("\n  ")}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-pain-points-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-pain-points-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
