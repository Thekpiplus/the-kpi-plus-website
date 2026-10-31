import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const steps = ["MAP", "SIMPLIFY", "AUTOMATE", "CONNECT", "REVIEW"];

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
  ${steps
    .map((label, index) => {
      const x = 80 + index * 292;
      const num = String(index + 1).padStart(2, "0");
      return `<rect x="${x}" y="280" width="268" height="320" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.35" stroke-width="2"/>
  <text x="${x + 28}" y="340" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${num}</text>
  <text x="${x + 28}" y="390" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">${label}</text>
  <text x="${x + 28}" y="436" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Gate</text>`;
    })
    .join("\n  ")}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-roadmap-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-roadmap-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
