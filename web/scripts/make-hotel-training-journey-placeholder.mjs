import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const steps = ["Discover", "Design", "Deliver", "Assess", "Follow-up"];

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
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="2"/>
  <rect x="72" y="64" width="980" height="56" rx="28" fill="#EBE722"/>
  <text x="92" y="100" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">Hotel Team Training Journey — Sample</text>
  <rect x="1072" y="74" width="216" height="36" rx="18" fill="#A2DC25"/>
  <text x="1092" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 16:9</text>
  <text x="72" y="168" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">HTML / CSS / SVG timeline. Not a people photo.</text>
  <text x="72" y="204" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Input · Owner · Output · Approval. Package-dependent steps stay marked.</text>
  <line x1="140" y1="430" x2="1460" y2="430" stroke="#A2DC25" stroke-width="4"/>
  ${steps
    .map((label, index) => {
      const x = 140 + index * 330;
      const num = String(index + 1).padStart(2, "0");
      return `<circle cx="${x}" cy="430" r="28" fill="#0B6660" stroke="#EBE722" stroke-width="3"/>
  <text x="${x}" y="436" text-anchor="middle" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">${num}</text>
  <rect x="${x - 110}" y="490" width="220" height="54" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.35"/>
  <text x="${x}" y="524" text-anchor="middle" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">${label}</text>`;
    })
    .join("\n  ")}
  <text x="72" y="780" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Public page uses a responsive HTML timeline. Assess and Follow-up depend on the selected package.</text>
  <text x="72" y="836" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Source 1600 x 900 · Display ~720 x 405 · 16:9 · Dummy only</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-training-journey-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-training-journey-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
