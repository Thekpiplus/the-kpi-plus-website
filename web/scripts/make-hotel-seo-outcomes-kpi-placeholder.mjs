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
      <stop offset="0.52" stop-color="#0B1F33"/>
      <stop offset="1" stop-color="#0B6660"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="14" fill="url(#bar)"/>
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="280" height="52" rx="8" fill="#06182B"/>
  <text x="96" y="99" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800" letter-spacing="3">SAMPLE DATA</text>
  <text x="72" y="176" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="700">Search Visibility and Business Outcomes · Sample data</text>
  <text x="72" y="222" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Metric Framework · not hotel impressions, clicks, calls, or bookings</text>

  <line x1="140" y1="280" x2="140" y2="690" stroke="#A2DC25" stroke-width="3"/>
  <line x1="140" y1="690" x2="1520" y2="690" stroke="#A2DC25" stroke-width="3"/>
  <line x1="140" y1="362" x2="1520" y2="362" stroke="#F2F8E2" stroke-opacity="0.12" stroke-width="2"/>
  <line x1="140" y1="444" x2="1520" y2="444" stroke="#F2F8E2" stroke-opacity="0.12" stroke-width="2"/>
  <line x1="140" y1="526" x2="1520" y2="526" stroke="#F2F8E2" stroke-opacity="0.12" stroke-width="2"/>
  <line x1="140" y1="608" x2="1520" y2="608" stroke="#F2F8E2" stroke-opacity="0.12" stroke-width="2"/>
  <text x="118" y="286" text-anchor="end" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">5</text>
  <text x="118" y="368" text-anchor="end" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">4</text>
  <text x="118" y="450" text-anchor="end" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">3</text>
  <text x="118" y="532" text-anchor="end" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">2</text>
  <text x="118" y="614" text-anchor="end" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">1</text>
  <text x="118" y="696" text-anchor="end" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">0</text>

  <rect x="250" y="280" width="220" height="410" rx="16" fill="#A2DC25"/>
  <text x="360" y="264" text-anchor="middle" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">5</text>
  <text x="360" y="732" text-anchor="middle" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Website Search</text>

  <rect x="690" y="280" width="220" height="410" rx="16" fill="#0B6660"/>
  <text x="800" y="264" text-anchor="middle" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">5</text>
  <text x="800" y="732" text-anchor="middle" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Business Profile</text>

  <rect x="1130" y="280" width="220" height="410" rx="16" fill="#EBE722"/>
  <text x="1240" y="264" text-anchor="middle" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">5</text>
  <text x="1240" y="732" text-anchor="middle" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Business Outcomes</text>

  <text x="72" y="792" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">Metrics in this framework · not hotel volume</text>
  <text x="72" y="836" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Impressions are not revenue. Profile views are not bookings.</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-outcomes-kpi-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-outcomes-kpi-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
