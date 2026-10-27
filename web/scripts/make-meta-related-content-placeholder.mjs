import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const options = [
  "Creative Review",
  "Campaign Report",
  "Audience Workshop",
  "Remarketing Funnel",
  "Hotel Marketing Planning",
];

const chips = options
  .map((name, index) => {
    const y = 278 + index * 78;
    return `<rect x="72" y="${y}" width="1056" height="64" rx="32" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.4" stroke-width="2"/>
  <text x="104" y="${y + 42}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">${name}</text>`;
  })
  .join("\n  ");

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
  <rect x="36" y="32" width="1128" height="736" rx="22" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.32" stroke-width="2"/>
  <rect x="72" y="56" width="188" height="40" rx="8" fill="#06182B"/>
  <text x="86" y="83" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="2.2">SAMPLE VISUAL</text>
  <text x="72" y="150" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="700">Meta Ads / Hotel Marketing Content</text>
  <text x="72" y="192" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Related content frame · 3:2 · not a campaign result</text>
  <text x="72" y="236" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not the Hero or Audience image</text>
  ${chips}
  <text x="72" y="732" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">1200 × 800 · display 520 × 347</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/meta-ads-related-content-placeholder.webp");
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
  throw new Error("sharp is required to write meta-ads-related-content-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
