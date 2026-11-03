import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Sample consultation steps frame only — live copy lives in the page callout. */
const width = 1200;
const height = 600;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="${width}" y2="0">
      <stop stop-color="#A2DC25"/>
      <stop offset="1" stop-color="#EBE722"/>
    </linearGradient>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#F2F8E2"/>
      <stop offset="0.55" stop-color="#E8F0D4"/>
      <stop offset="1" stop-color="#DCE8C8"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="10" fill="url(#bar)"/>
  <rect x="36" y="36" width="1128" height="528" rx="24" fill="#FFFFFF" stroke="#0B6660" stroke-opacity="0.22" stroke-width="2"/>
  <rect x="60" y="56" width="720" height="48" rx="24" fill="#EBE722"/>
  <text x="84" y="88" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">Solution Consultation — Sample Steps</text>
  <rect x="920" y="62" width="210" height="36" rx="18" fill="#A2DC25"/>
  <text x="948" y="86" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800" letter-spacing="1">DUMMY 2:1</text>
  <g font-family="Montserrat, Segoe UI, sans-serif">
    <rect x="80" y="160" width="300" height="280" rx="20" fill="#0B1F33"/>
    <text x="110" y="210" fill="#A2DC25" font-size="20" font-weight="800">01</text>
    <text x="110" y="260" fill="#FFFFFF" font-size="22" font-weight="700">Goal / problem</text>
    <text x="110" y="300" fill="#F2F8E2" font-size="16">Clarify what matters first</text>
    <rect x="450" y="160" width="300" height="280" rx="20" fill="#0B6660"/>
    <text x="480" y="210" fill="#A2DC25" font-size="20" font-weight="800">02</text>
    <text x="480" y="260" fill="#FFFFFF" font-size="22" font-weight="700">Group the need</text>
    <text x="480" y="300" fill="#F2F8E2" font-size="16">Revenue · Marketing · Booking</text>
    <text x="480" y="330" fill="#F2F8E2" font-size="16">Systems · Team</text>
    <rect x="820" y="160" width="300" height="280" rx="20" fill="#3B3B3B"/>
    <text x="850" y="210" fill="#A2DC25" font-size="20" font-weight="800">03</text>
    <text x="850" y="260" fill="#FFFFFF" font-size="22" font-weight="700">First service</text>
    <text x="850" y="300" fill="#F2F8E2" font-size="16">Relevant start + prepare list</text>
  </g>
  <text x="80" y="500" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Sample · not a diagnosis or promised result</text>
  <text x="80" y="536" fill="#555555" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Dummy 1200 × 600 · display ~420 × 210 · 2:1</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-solutions-consultation-process-placeholder.webp",
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
  await writeFile(out.replace(/\.webp$/, ".svg"), svg, "utf8");
  console.log("sharp unavailable; wrote SVG fallback");
  process.exit(0);
}

await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(out);
console.log(`wrote ${out}`);
