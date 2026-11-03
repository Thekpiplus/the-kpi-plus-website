import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 800;
const height = 1000;

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
  <rect width="${width}" height="10" fill="url(#bar)"/>
  <rect x="36" y="36" width="728" height="928" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="2"/>
  <rect x="64" y="64" width="672" height="96" rx="24" fill="#EBE722"/>
  <text x="84" y="104" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">Trainer portrait placeholder</text>
  <text x="84" y="136" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">replace with approved facilitator photo</text>
  <rect x="168" y="220" width="464" height="464" rx="28" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.4" stroke-width="2"/>
  <circle cx="400" cy="392" r="78" fill="none" stroke="#A2DC25" stroke-width="6"/>
  <path d="M268 612 C268 528 332 484 400 484 C468 484 532 528 532 612" fill="none" stroke="#A2DC25" stroke-width="6" stroke-linecap="round"/>
  <text x="400" y="678" text-anchor="middle" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Not a person photo</text>
  <text x="400" y="708" text-anchor="middle" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">No AI portrait · Dummy 4:5</text>
  <text x="64" y="820" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Use a real facilitator portrait</text>
  <text x="64" y="854" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Natural light, real work setting, publication permission required.</text>
  <text x="64" y="908" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Source 800 x 1000 · Display ~320 x 400 · 4:5</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-training-facilitator-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-training-facilitator-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
