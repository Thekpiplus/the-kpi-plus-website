import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const metrics = ["Time Saved", "Manual Steps", "Data Quality", "Handover", "Human Review", "Adoption"];

const rows = metrics
  .map((label, index) => {
    const y = 268 + index * 88;
    return `<rect x="80" y="${y}" width="1440" height="78" rx="12" fill="#071C30"/>
  <text x="108" y="${y + 48}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">${label}</text>
  <rect x="780" y="${y + 18}" width="280" height="42" rx="21" fill="#F4F4F4"/>
  <text x="908" y="${y + 47}" fill="#3B3B3B" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700" text-anchor="middle">—</text>
  <rect x="1128" y="${y + 18}" width="280" height="42" rx="21" fill="#F4F4F4"/>
  <text x="1268" y="${y + 47}" fill="#3B3B3B" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700" text-anchor="middle">—</text>`;
  })
  .join("\n  ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="${width}" y2="0">
      <stop stop-color="#A2DC25"/>
      <stop offset="1" stop-color="#EBE722"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#0B1F33"/>
  <rect width="${width}" height="10" fill="url(#bar)"/>
  <rect x="48" y="40" width="1504" height="820" rx="22" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <rect x="80" y="68" width="168" height="40" rx="6" fill="#06182B"/>
  <text x="94" y="95" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="2">SAMPLE</text>
  <text x="80" y="168" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="2">BASELINE VS PILOT</text>
  <text x="108" y="232" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="2">METRIC</text>
  <rect x="780" y="198" width="280" height="42" rx="8" fill="#EBE722"/>
  <text x="920" y="226" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="1" text-anchor="middle">BASELINE</text>
  <rect x="1128" y="198" width="280" height="42" rx="8" fill="#A2DC25"/>
  <text x="1268" y="226" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="1" text-anchor="middle">PILOT</text>
  ${rows}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-pilot-scorecard-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-pilot-scorecard-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
const meta = await sharp(buffer).metadata();
if (meta.width !== width || meta.height !== height) {
  throw new Error(`expected ${width}x${height}, got ${meta.width}x${meta.height}`);
}
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
