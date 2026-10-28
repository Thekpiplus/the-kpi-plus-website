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
  <text x="72" y="176" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">Search → Maps → Website → Contact / Booking Flow</text>
  <text x="72" y="222" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Sample flow · Search visibility and local discovery</text>

  <rect x="72" y="268" width="328" height="360" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="104" y="318" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">01  Search</text>
  <text x="104" y="372" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Search &amp; AI Data Structure</text>
  <text x="104" y="416" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Entity and structured content</text>
  <rect x="104" y="452" width="248" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.24"/>
  <rect x="104" y="480" width="176" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.12"/>
  <text x="104" y="580" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a live search result</text>

  <polygon points="412,448 448,428 448,468" fill="#A2DC25"/>

  <rect x="460" y="268" width="328" height="360" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="492" y="318" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">02  Maps</text>
  <text x="492" y="372" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Google Business Profile</text>
  <text x="492" y="416" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Hours, photos, reviews, links</text>
  <rect x="492" y="452" width="248" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.24"/>
  <rect x="492" y="480" width="176" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.12"/>
  <text x="492" y="580" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a live Maps rank</text>

  <polygon points="800,448 836,428 836,468" fill="#A2DC25"/>

  <rect x="848" y="268" width="328" height="360" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="880" y="318" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">03  Website</text>
  <text x="880" y="372" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Website Answer Structure</text>
  <text x="880" y="416" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Relevant content and landing page</text>
  <rect x="880" y="452" width="248" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.24"/>
  <rect x="880" y="480" width="176" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.12"/>
  <text x="880" y="580" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a ranking guarantee</text>

  <polygon points="1188,448 1224,428 1224,468" fill="#A2DC25"/>

  <rect x="1236" y="268" width="324" height="360" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="1268" y="318" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">04  Contact / Booking</text>
  <text x="1268" y="372" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Contact / Booking Path</text>
  <text x="1268" y="416" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Call, Directions, Visit, Contact</text>
  <rect x="1268" y="452" width="248" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.24"/>
  <rect x="1268" y="480" width="176" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.12"/>
  <text x="1268" y="580" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a live booking total</text>

  <text x="72" y="708" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">The KPI Plus may support review and structure. The hotel approves business facts.</text>
  <text x="72" y="780" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Sample data · not a live hotel ranking, AI appearance, or booking result</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-local-discovery-flow-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-local-discovery-flow-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
