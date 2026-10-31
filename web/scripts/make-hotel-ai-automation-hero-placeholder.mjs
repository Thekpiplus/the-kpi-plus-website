import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 1000;
const steps = [
  ["01", "Hotel Workflow", "Real work that is stuck"],
  ["02", "AI / Automation", "Chosen after the problem"],
  ["03", "Human Review", "A person checks the output"],
  ["04", "Team / System", "Handover the team can run"],
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
  <rect x="48" y="40" width="1504" height="920" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.32" stroke-width="2"/>
  <rect x="80" y="72" width="236" height="48" rx="8" fill="#06182B"/>
  <text x="96" y="104" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800" letter-spacing="2.4">SAMPLE DATA</text>
  <text x="80" y="176" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">Hotel AI &amp; Automation — Sample workflow</text>
  <text x="80" y="220" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Hotel Workflow → AI / Automation → Human Review → Team / System</text>
  ${steps
    .map(([num, title, note], index) => {
      const x = 80 + index * 366;
      return `<rect x="${x}" y="280" width="346" height="420" rx="18" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.42" stroke-width="2"/>
  <text x="${x + 28}" y="${340}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${num}</text>
  <text x="${x + 28}" y="${400}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">${title}</text>
  <text x="${x + 28}" y="${448}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">${note}</text>`;
    })
    .join("\n  ")}
  <text x="80" y="780" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">ตัวอย่าง Workflow สำหรับทดลองใช้ AI และ Automation</text>
  <text x="80" y="824" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Sample workflow · Replace with approved hotel process</text>
  <text x="80" y="890" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Not a live client system · 1600 × 1000 · 8:5</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-hero-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
