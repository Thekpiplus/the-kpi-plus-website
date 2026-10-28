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
      <stop offset="0.52" stop-color="#0B1F33"/>
      <stop offset="1" stop-color="#0B6660"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="12" fill="url(#bar)"/>
  <rect x="32" y="28" width="1136" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="56" y="52" width="268" height="44" rx="8" fill="#06182B"/>
  <text x="76" y="81" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800" letter-spacing="3">SAMPLE DATA</text>
  <text x="56" y="148" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="30" font-weight="700">Hotel SEO / Local Search Content</text>
  <text x="56" y="186" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Not the hero or Google Business Profile image · not a ranking result</text>

  <rect x="56" y="224" width="1088" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.35"/>
  <text x="84" y="258" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">01</text>
  <text x="84" y="286" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Search Visibility Report</text>

  <rect x="56" y="328" width="1088" height="88" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="84" y="362" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">02</text>
  <text x="84" y="390" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Google Business Profile Review</text>

  <rect x="56" y="432" width="1088" height="88" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="84" y="466" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">03</text>
  <text x="84" y="494" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Local SEO Audit</text>

  <rect x="56" y="536" width="528" height="88" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="84" y="570" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">04</text>
  <text x="84" y="598" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Search Console Analysis</text>

  <rect x="616" y="536" width="528" height="88" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="644" y="570" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">05</text>
  <text x="644" y="598" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Hotel Website Health Check</text>

  <text x="56" y="680" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Related content map · not a meeting photo</text>
  <text x="56" y="718" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample visual · no fake authors, dates, rankings, or booking results</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-related-content-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-related-content-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
