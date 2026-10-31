import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const teams = ["Reservations", "Revenue", "Distribution", "Marketing", "Operations", "Management"];

const cells = teams
  .map((label, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = 80 + col * 480;
    const y = 220 + row * 230;
    const num = String(index + 1).padStart(2, "0");
    return `<rect x="${x}" y="${y}" width="456" height="206" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.35" stroke-width="2"/>
  <text x="${x + 28}" y="${y + 58}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="800">${num}</text>
  <text x="${x + 28}" y="${y + 104}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">${label}</text>
  <text x="${x + 28}" y="${y + 146}" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Start condition</text>`;
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
  <text x="80" y="168" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="2">HOTEL AI AND AUTOMATION FIT MATRIX</text>
  ${cells}
  <rect x="80" y="700" width="1440" height="120" rx="16" fill="#1B160C" stroke="#F3D39A" stroke-width="2"/>
  <text x="108" y="752" fill="#F3D39A" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">NOT READY</text>
  <text x="108" y="792" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Do not automate if there is no owner or manual fallback</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-fit-matrix-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-fit-matrix-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
const meta = await sharp(buffer).metadata();
if (meta.width !== width || meta.height !== height) {
  throw new Error(`expected ${width}x${height}, got ${meta.width}x${meta.height}`);
}
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
