import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const before = ["Choose a tool first", "Then look for work that fits", "Reviewer still unclear"];
const after = ["Start from stuck work", "Simplify", "Small pilot", "Human review", "Scale / Adjust / Stop"];

const beforeItems = before
  .map((label, index) => {
    const y = 250 + index * 92;
    const num = String(index + 1).padStart(2, "0");
    return `<text x="92" y="${y}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${num}</text>
  <text x="148" y="${y}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">${label}</text>`;
  })
  .join("\n  ");

const afterItems = after
  .map((label, index) => {
    const y = 230 + index * 78;
    const num = String(index + 1).padStart(2, "0");
    return `<text x="656" y="${y}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${num}</text>
  <text x="712" y="${y}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">${label}</text>`;
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
  <rect x="36" y="32" width="1128" height="736" rx="22" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <rect x="64" y="56" width="168" height="40" rx="6" fill="#06182B"/>
  <text x="78" y="83" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="2">SAMPLE</text>
  <rect x="64" y="124" width="516" height="596" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.35" stroke-width="2"/>
  <rect x="628" y="124" width="516" height="596" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.35" stroke-width="2"/>
  <text x="92" y="178" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="2">BEFORE</text>
  <text x="656" y="178" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="2">AFTER</text>
  ${beforeItems}
  ${afterItems}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-ai-automation-evidence-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-ai-automation-evidence-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 86 }).toBuffer();
const meta = await sharp(buffer).metadata();
if (meta.width !== width || meta.height !== height) {
  throw new Error(`expected ${width}x${height}, got ${meta.width}x${meta.height}`);
}
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
