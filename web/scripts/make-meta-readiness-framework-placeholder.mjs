import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const cells = [
  ["Objective", "Campaign Objective Plan"],
  ["Audience", "Audience Map"],
  ["Creative", "Creative Matrix"],
  ["Landing Page", "Landing Page Checklist"],
  ["Booking / Lead Path", "Conversion Path Review"],
  ["Tracking &amp; Optimization", "Tracking Plan"],
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
  <rect x="48" y="40" width="1504" height="820" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.32" stroke-width="2"/>
  <rect x="80" y="68" width="220" height="48" rx="8" fill="#06182B"/>
  <text x="96" y="100" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800" letter-spacing="2.4">SAMPLE DATA</text>
  <text x="80" y="172" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="40" font-weight="700">Meta Ads Readiness Framework — Sample</text>
  <text x="80" y="216" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Sample framework · Objective to Tracking</text>
  ${cells
    .map(([area, output], index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 80 + col * 480;
      const y = 260 + row * 230;
      return `<rect x="${x}" y="${y}" width="456" height="206" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="${x + 28}" y="${y + 56}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">${area}</text>
  <text x="${x + 28}" y="${y + 102}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">${output}</text>
  <text x="${x + 28}" y="${y + 148}" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Inspect · Improve · Output</text>`;
    })
    .join("\n  ")}
  <text x="80" y="820" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">ตัวอย่างข้อมูล · Sample data · not campaign Reach or a hotel result · 1600 × 900</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/meta-ads-readiness-framework-placeholder.webp");
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
  throw new Error("sharp is required to write meta-ads-readiness-framework-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
