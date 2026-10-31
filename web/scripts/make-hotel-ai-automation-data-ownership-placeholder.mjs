import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const steps = [
  ["Necessary", "data only"],
  ["Purpose and", "permission check"],
  ["Approved", "AI/Automation step"],
  ["Human review for", "consequential outputs"],
  ["Approved destination,", "storage, deletion"],
];

const nodes = steps
  .map((lines, index) => {
    const x = 72 + index * 298;
    const num = String(index + 1).padStart(2, "0");
    const review = index === 3;
    return `<rect x="${x}" y="280" width="274" height="340" rx="16" fill="#0B1F33" stroke="${review ? "#F3D39A" : "#A2DC25"}" stroke-opacity="${review ? "0.9" : "0.35"}" stroke-width="2"/>
  <text x="${x + 24}" y="340" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="800">${num}</text>
  <text x="${x + 24}" y="392" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">${lines[0]}</text>
  <text x="${x + 24}" y="424" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">${lines[1]}</text>`;
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
  <text x="80" y="180" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="2">DATA AND HUMAN REVIEW FLOW</text>
  ${nodes}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-data-ownership-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-data-ownership-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
const meta = await sharp(buffer).metadata();
if (meta.width !== width || meta.height !== height) {
  throw new Error(`expected ${width}x${height}, got ${meta.width}x${meta.height}`);
}
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
