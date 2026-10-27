import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const cells = [
  ["New hotel or new market", "Awareness and Audience Test", "Market and Creative Learning"],
  ["Website exists but booking is low", "Landing Page and Conversion Path Review", "Booking Path Checklist"],
  ["Existing website visitors or customer base", "Remarketing and Offer Test", "Remarketing Plan"],
  ["Campaign exists but results are unclear", "Tracking and Attribution Review", "Measurement Plan"],
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
  <text x="80" y="172" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="36" font-weight="700">Hotel Meta Ads Scenario Matrix — Sample</text>
  <text x="80" y="216" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Sample matrix · Start from the hotel situation</text>
  ${cells
    .map(([situation, action, output], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 80 + col * 720;
      const y = 268 + row * 230;
      return `<rect x="${x}" y="${y}" width="696" height="206" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="${x + 28}" y="${y + 52}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${situation}</text>
  <text x="${x + 28}" y="${y + 96}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Start with ${action}</text>
  <rect x="${x + 28}" y="${y + 122}" width="420" height="48" rx="24" fill="#0B6660"/>
  <text x="${x + 48}" y="${y + 153}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">${output}</text>`;
    })
    .join("\n  ")}
  <text x="80" y="780" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">ตัวอย่างข้อมูล · Sample data · not a hotel or person photo · 1600 × 900</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/meta-ads-hotel-scenario-matrix-placeholder.webp");
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
  throw new Error("sharp is required to write meta-ads-hotel-scenario-matrix-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
