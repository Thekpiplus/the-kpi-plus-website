import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const options = [
  "Website Health Check",
  "Direct Booking Path Review",
  "Mobile UX Audit",
  "Room Detail Page Review",
  "Booking Engine Connection",
];

const rows = options
  .map((label, index) => {
    const y = 228 + index * 86;
    const featured = index === 0;
    return `<rect x="56" y="${y}" width="1088" height="76" rx="16" fill="#0B1F33" stroke="${featured ? "#A2DC25" : "#F2F8E2"}" stroke-opacity="${featured ? "0.55" : "0.16"}" stroke-width="2"/>
  <text x="84" y="${y + 32}" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">0${index + 1}</text>
  <text x="84" y="${y + 58}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">${label}</text>`;
  })
  .join("\n  ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#0B1F33"/>
  <rect width="${width}" height="10" fill="#A2DC25"/>
  <rect x="32" y="28" width="1136" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.32" stroke-width="3"/>
  <rect x="56" y="52" width="168" height="40" rx="999" fill="#A2DC25"/>
  <text x="140" y="78" text-anchor="middle" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">SAMPLE</text>
  <text x="56" y="140" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="30" font-weight="700">Hotel Website / Direct Booking Content</text>
  <text x="56" y="176" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Not the hero or booking-confidence visual · not a hotel booking result</text>
  ${rows}
  <text x="56" y="730" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Related content map · 1200 × 800 · display 520 × 347 · 3:2</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-website-related-content-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-website-related-content-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
