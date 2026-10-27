import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const platform = ["Reach", "Frequency", "Impressions", "CTR", "Landing Page View", "Video View / Engagement"];
const business = ["Lead / Inquiry", "Booking Engine Start", "Booking Complete", "Cost per Lead", "Cost per Booking", "ROAS"];

function cells(items, x0) {
  return items
    .map((name, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = x0 + col * 350;
      const y = 290 + row * 110;
      return `<rect x="${x}" y="${y}" width="330" height="92" rx="14" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <text x="${x + 22}" y="${y + 54}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">${name}</text>`;
    })
    .join("\n  ");
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
  <rect width="${width}" height="12" fill="url(#bar)"/>
  <rect x="48" y="40" width="1504" height="820" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.32" stroke-width="2"/>
  <rect x="80" y="68" width="220" height="48" rx="8" fill="#06182B"/>
  <text x="96" y="100" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800" letter-spacing="2.4">SAMPLE DATA</text>
  <text x="80" y="172" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">Meta Ads Performance KPI · Sample data</text>
  <text x="80" y="214" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Platform vs business · Reach is not a revenue result</text>
  <text x="80" y="268" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="1.6">PLATFORM METRICS</text>
  <text x="820" y="268" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="1.6">BUSINESS METRICS</text>
  ${cells(platform, 80)}
  ${cells(business, 820)}
  <text x="80" y="800" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">No fabricated numbers · Sample frame · 1600 × 900 · display 720 × 405</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/meta-ads-performance-kpi-placeholder.webp");
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
  throw new Error("sharp is required to write meta-ads-performance-kpi-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
