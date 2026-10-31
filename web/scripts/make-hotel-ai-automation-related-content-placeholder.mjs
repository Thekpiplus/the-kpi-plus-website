import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const items = [
  ["01", "Technology decisions"],
  ["02", "Revenue meetings"],
  ["03", "Search health"],
  ["04", "Academy courses"],
];

const rows = items
  .map(([num, label], index) => {
    const y = 318 + index * 86;
    return `<rect x="88" y="${y}" width="1024" height="74" rx="12" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <text x="118" y="${y + 46}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="800">${num}</text>
  <text x="198" y="${y + 46}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">${label}</text>`;
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
  <rect x="48" y="40" width="1104" height="720" rx="22" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <rect x="88" y="72" width="168" height="40" rx="6" fill="#06182B"/>
  <text x="102" y="99" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="2">SAMPLE</text>
  <text x="88" y="168" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="3">SAMPLE COVER</text>
  <text x="88" y="222" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="42" font-weight="800">Hotel AI &amp; Automation</text>
  <text x="88" y="268" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800" letter-spacing="4">GUIDE</text>
  ${rows}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-related-content-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-related-content-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
const meta = await sharp(buffer).metadata();
if (meta.width !== width || meta.height !== height) {
  throw new Error(`expected ${width}x${height}, got ${meta.width}x${meta.height}`);
}
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
