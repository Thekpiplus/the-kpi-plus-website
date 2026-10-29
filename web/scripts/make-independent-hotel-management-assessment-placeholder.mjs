import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
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
  <rect x="28" y="28" width="1144" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>

  <rect x="52" y="52" width="430" height="48" rx="24" fill="#A2DC25"/>
  <text x="74" y="84" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">Sample assessment framework</text>
  <text x="502" y="84" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Not a live hotel diagnosis</text>

  <text x="52" y="150" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="34" font-weight="700">ตัวอย่าง Independent Hotel Assessment</text>
  <text x="52" y="186" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Evidence types the review may use · No invented findings · No occupancy / ADR / RevPAR</text>

  <rect x="52" y="214" width="534" height="168" rx="16" fill="#0B1F33"/>
  <text x="76" y="258" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">01</text>
  <text x="128" y="258" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Property walkthrough</text>
  <text x="76" y="296" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Walkthrough checklist on site</text>
  <text x="76" y="348" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Sample only</text>

  <rect x="602" y="214" width="534" height="168" rx="16" fill="#0B1F33"/>
  <text x="626" y="258" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">02</text>
  <text x="678" y="258" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Owner / GM meeting</text>
  <text x="626" y="296" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Assessment meeting inside the hotel</text>
  <text x="626" y="348" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Sample only</text>

  <rect x="52" y="398" width="534" height="168" rx="16" fill="#0B1F33"/>
  <text x="76" y="442" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">03</text>
  <text x="128" y="442" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Operations review</text>
  <text x="76" y="480" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Operating standards and owners board</text>
  <text x="76" y="532" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Sample only</text>

  <rect x="602" y="398" width="534" height="168" rx="16" fill="#0B1F33"/>
  <text x="626" y="442" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">04</text>
  <text x="678" y="442" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Commercial review</text>
  <text x="626" y="480" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Pricing, channels, and revenue decisions</text>
  <text x="626" y="532" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Sample only · No published results</text>

  <rect x="52" y="582" width="534" height="118" rx="16" fill="#0B1F33"/>
  <text x="76" y="626" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">05</text>
  <text x="128" y="626" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Guest experience audit</text>
  <text x="76" y="666" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Service friction and floor follow-up</text>

  <rect x="602" y="582" width="534" height="118" rx="16" fill="#0B6660" fill-opacity="0.45"/>
  <text x="626" y="626" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">06</text>
  <text x="678" y="626" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Team capability review</text>
  <text x="626" y="666" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Roles and meeting rhythm</text>

  <text x="52" y="740" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Direction · Operations · Commercial · People · Measurement · Replace with approved hotel project</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/independent-hotel-management-assessment-placeholder.webp",
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
  throw new Error("sharp is required to write independent-hotel-management-assessment-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
