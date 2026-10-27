import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const cells = [
  ["Awareness", "reach · frequency · video view", "market and creative learning"],
  ["Consideration", "CTR · landing page view", "qualified interest"],
  ["Inquiry", "lead · cost per lead", "inquiry list"],
  ["Direct Booking", "booking · conversion · cost per booking", "direct booking opportunity"],
  ["Remarketing", "return visit · booking · ROAS", "re-engagement performance"],
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
  <text x="80" y="172" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="36" font-weight="700">Meta Ads Objective to Booking Map — Sample</text>
  <text x="80" y="216" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Sample map · Objective to KPI</text>
  ${cells
    .map(([objective, kpi, output], index) => {
      const x = 72 + index * 292;
      const y = 268;
      return `<rect x="${x}" y="${y}" width="276" height="430" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="${x + 20}" y="${y + 52}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">${objective}</text>
  <rect x="${x + 20}" y="${y + 78}" width="236" height="118" rx="10" fill="#071C30"/>
  <text x="${x + 32}" y="${y + 112}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">KPI</text>
  <text x="${x + 32}" y="${y + 140}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">${kpi.split(" · ")[0] || ""}</text>
  <text x="${x + 32}" y="${y + 166}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">${kpi.split(" · ").slice(1).join(" · ")}</text>
  <rect x="${x + 20}" y="${y + 220}" width="236" height="72" rx="36" fill="#F2F8E2"/>
  <text x="${x + 32}" y="${y + 262}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">${output}</text>
  ${index < cells.length - 1 ? `<circle cx="${x + 276}" cy="${y + 215}" r="8" fill="#A2DC25"/>` : ""}`;
    })
    .join("\n  ")}
  <text x="80" y="780" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">ตัวอย่างข้อมูล · Sample data · KPI names are not a hotel result · 1600 × 900</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/meta-ads-hotel-sales-objectives-placeholder.webp");
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
  throw new Error("sharp is required to write meta-ads-hotel-sales-objectives-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
