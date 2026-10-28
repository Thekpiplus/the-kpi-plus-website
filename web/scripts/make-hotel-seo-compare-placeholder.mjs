import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
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
  <rect x="36" y="32" width="1528" height="836" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="60" y="56" width="248" height="44" rx="8" fill="#06182B"/>
  <text x="80" y="85" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800" letter-spacing="3">SAMPLE DATA</text>
  <text x="60" y="148" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">SEO + AEO + Local SEO Framework — Sample</text>
  <text x="60" y="188" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Sample framework · same verified business facts</text>

  <rect x="60" y="220" width="480" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.3"/>
  <text x="84" y="256" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">01 SEO</text>
  <text x="84" y="286" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Search-ready Website</text>
  <rect x="560" y="220" width="480" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.3"/>
  <text x="584" y="256" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">02 AEO / AI Search</text>
  <text x="584" y="286" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Answer-ready Content</text>
  <rect x="1060" y="220" width="468" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.3"/>
  <text x="1084" y="256" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">03 Local SEO</text>
  <text x="1084" y="286" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Local Discovery Profile</text>

  <rect x="60" y="332" width="1480" height="430" rx="18" fill="#0B1F33"/>
  <text x="84" y="372" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">AREA</text>
  <text x="300" y="372" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">GOAL</text>
  <text x="620" y="372" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">WHAT TO PREPARE</text>
  <text x="980" y="372" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">CUSTOMER SEES</text>
  <text x="1320" y="372" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">OUTPUT</text>

  <text x="84" y="430" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">SEO</text>
  <text x="300" y="430" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">Website answers relevant searches</text>
  <text x="620" y="430" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Structure, intent, technical SEO</text>
  <text x="980" y="430" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">A useful website page</text>
  <rect x="1320" y="406" width="196" height="36" rx="18" fill="#A2DC25"/>
  <text x="1336" y="430" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">Search-ready Website</text>

  <text x="84" y="530" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">AEO / AI</text>
  <text x="300" y="530" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">Clear, answer-ready facts</text>
  <text x="620" y="530" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">FAQs, entities, structured content</text>
  <text x="980" y="530" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Facts a system can use, if shown</text>
  <rect x="1320" y="506" width="196" height="36" rx="18" fill="#A2DC25"/>
  <text x="1336" y="530" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">Answer-ready Content</text>

  <text x="84" y="630" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Local SEO</text>
  <text x="300" y="630" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">Clear in local search and Maps</text>
  <text x="620" y="630" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">GBP, hours, photos, reviews, contact</text>
  <text x="980" y="630" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Profile, hours, call, directions</text>
  <rect x="1320" y="606" width="196" height="36" rx="18" fill="#A2DC25"/>
  <text x="1336" y="630" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">Local Discovery Profile</text>

  <text x="84" y="710" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="20">All three areas should use the same verified business information.</text>
  <text x="60" y="820" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample framework · not a ranking, AI appearance, or booking promise</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-aeo-local-seo-framework-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-aeo-local-seo-framework-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
