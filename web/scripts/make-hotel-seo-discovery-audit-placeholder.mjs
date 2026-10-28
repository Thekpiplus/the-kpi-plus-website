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
  <text x="56" y="148" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="30" font-weight="700">ตัวอย่าง Search และ Google Business Profile Audit</text>
  <text x="56" y="186" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Anonymised data · Local listing consistency check</text>

  <rect x="56" y="216" width="528" height="430" rx="18" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="80" y="256" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Search Console overview</text>
  <rect x="80" y="276" width="220" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.16"/>
  <text x="80" y="322" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Property ID redacted</text>
  <rect x="80" y="348" width="460" height="54" rx="10" fill="#06182B"/>
  <text x="100" y="382" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Queries · Pages · No live metrics</text>
  <rect x="80" y="420" width="300" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.14"/>
  <rect x="80" y="448" width="220" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.1"/>
  <text x="80" y="510" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">ตรวจว่าหน้าใดถูกค้นพบ</text>
  <text x="80" y="546" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Not a client Search Console screenshot</text>
  <text x="80" y="610" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">ANONYMISED DATA</text>

  <rect x="608" y="216" width="536" height="430" rx="18" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="632" y="256" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Google Business Profile audit</text>
  <text x="632" y="300" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Name / category</text>
  <text x="980" y="300" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Check</text>
  <text x="632" y="348" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Hours</text>
  <text x="980" y="348" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Match site</text>
  <text x="632" y="396" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Address / phone / web</text>
  <text x="980" y="396" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">One set</text>
  <text x="632" y="444" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Services / photos</text>
  <text x="980" y="444" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Current</text>
  <text x="632" y="492" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Contact / booking path</text>
  <text x="980" y="492" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Reachable</text>
  <rect x="632" y="520" width="280" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.12"/>
  <text x="632" y="610" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Account name and emails redacted</text>

  <text x="56" y="688" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">Search query → Business profile → Website → Contact / Booking</text>
  <text x="56" y="730" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Sample data · not a live hotel ranking, AI appearance, or booking result</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-discovery-audit-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-discovery-audit-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
