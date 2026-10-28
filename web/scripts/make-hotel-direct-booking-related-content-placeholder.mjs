import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const options = [
  "Website Health Check",
  "Direct Booking Path Review",
  "Booking Engine Handoff",
  "Mobile Conversion Audit",
];

const rows = options
  .map((label, index) => {
    const y = 248 + index * 108;
    const featured = index === 0;
    return `
  <rect x="64" y="${y}" width="1072" height="92" rx="18" fill="#0B1F33" stroke="${featured ? "#A2DC25" : "#F2F8E2"}" stroke-opacity="${featured ? "0.7" : "0.22"}" stroke-width="3"/>
  <text x="96" y="${y + 38}" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">0${index + 1}</text>
  <text x="96" y="${y + 72}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="800">${label}</text>`;
  })
  .join("");

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
  <rect x="32" y="28" width="1136" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="64" y="56" width="248" height="48" rx="24" fill="#A2DC25"/>
  <text x="88" y="88" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22" font-weight="800">ตัวอย่างข้อมูล</text>
  <text x="64" y="160" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="800">Hotel Direct Booking / Website Content</text>
  <text x="64" y="204" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Not the Hero or Booking Confidence visual</text>
  ${rows}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-related-content-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-direct-booking-related-content-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
