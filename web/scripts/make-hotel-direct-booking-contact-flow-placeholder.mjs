import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 600;
const steps = ["Website Review", "Booking Path Review", "Measurement Plan"];

const boxes = steps
  .map((label, index) => {
    const x = 56 + index * 380;
    return `
  <rect x="${x}" y="250" width="328" height="168" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.55" stroke-width="3"/>
  <text x="${x + 28}" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">0${index + 1}</text>
  <text x="${x + 28}" y="360" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${label}</text>`;
  })
  .join("");

const arrows = [0, 1]
  .map((index) => {
    const x = 384 + index * 380;
    return `<text x="${x}" y="344" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="42" font-weight="800">→</text>`;
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
  <rect x="28" y="24" width="1144" height="552" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="56" y="48" width="248" height="48" rx="24" fill="#A2DC25"/>
  <text x="80" y="80" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22" font-weight="800">ตัวอย่างข้อมูล</text>
  <text x="56" y="148" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="800">What Happens Next — Sample process</text>
  <text x="56" y="192" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Not a team photo or a live hotel website</text>
  ${boxes}
  ${arrows}
  <text x="56" y="520" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Website Review → Booking Path Review → Measurement Plan</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-contact-flow-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-direct-booking-contact-flow-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
