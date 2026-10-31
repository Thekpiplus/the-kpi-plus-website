import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 600;
const steps = [
  ["01", "Workflow Intake"],
  ["02", "Simplify"],
  ["03", "Pilot"],
  ["04", "Review"],
];

const cells = steps
  .map(([num, label], index) => {
    const x = 72 + index * 280;
    return `<rect x="${x}" y="268" width="256" height="196" rx="16" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.32" stroke-width="2"/>
  <text x="${x + 24}" y="${268 + 72}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${num}</text>
  <text x="${x + 24}" y="${268 + 124}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">${label}</text>`;
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
  <rect x="40" y="36" width="1120" height="528" rx="22" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <rect x="72" y="64" width="168" height="40" rx="6" fill="#06182B"/>
  <text x="86" y="91" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="2">SAMPLE</text>
  <text x="72" y="156" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="2">WHAT HAPPENS NEXT</text>
  <text x="72" y="208" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="800">Workflow Intake → Simplify → Pilot → Review</text>
  ${cells}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-contact-process-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-contact-process-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
const meta = await sharp(buffer).metadata();
if (meta.width !== width || meta.height !== height) {
  throw new Error(`expected ${width}x${height}, got ${meta.width}x${meta.height}`);
}
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
