import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#06182B"/>
  <rect width="${width}" height="8" fill="url(#bar)"/>
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="${width}" y2="0">
      <stop stop-color="#A2DC25"/>
      <stop offset="1" stop-color="#EBE722"/>
    </linearGradient>
  </defs>
  <rect x="72" y="72" width="1056" height="656" rx="16" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.35" stroke-width="2"/>
  <text x="104" y="148" fill="#A2DC25" font-family="Montserrat, Arial, sans-serif" font-size="18" font-weight="800" letter-spacing="3">SAMPLE VISUAL</text>
  <text x="104" y="222" fill="#FFFFFF" font-family="Montserrat, Arial, sans-serif" font-size="36" font-weight="700">Replace with verified</text>
  <text x="104" y="272" fill="#FFFFFF" font-family="Montserrat, Arial, sans-serif" font-size="36" font-weight="700">Digital Marketing Team image</text>
  <text x="104" y="328" fill="#9BB0C2" font-family="Sarabun, Arial, sans-serif" font-size="24">1200 × 800 · 3:2 · not an AI-generated person</text>
  <rect x="104" y="392" width="420" height="280" rx="8" fill="#0B1F33" stroke="#E3E8EB" stroke-opacity="0.35" stroke-width="2"/>
  <text x="124" y="536" fill="#F2F8E2" font-family="Montserrat, Arial, sans-serif" font-size="22" font-weight="700">Display ~420 × 280</text>
  <text x="560" y="456" fill="#F2F8E2" font-family="Montserrat, Arial, sans-serif" font-size="22" font-weight="700">Do not publish this dummy</text>
  <text x="560" y="500" fill="#9BB0C2" font-family="Sarabun, Arial, sans-serif" font-size="20">Keep What Happens Next until a real team photo is approved</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/google-ads-team-placeholder.webp");
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
  throw new Error("sharp is required to write google-ads-team-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height}`);
