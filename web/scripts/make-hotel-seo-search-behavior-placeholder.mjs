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
  <rect x="56" y="52" width="248" height="44" rx="8" fill="#06182B"/>
  <text x="76" y="81" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800" letter-spacing="3">SAMPLE DATA</text>
  <text x="56" y="148" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="32" font-weight="700">ตัวอย่าง Search Behavior และ Local Discovery</text>
  <text x="56" y="190" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Sample diagram · Search query, AI-ready facts, local path</text>

  <text x="56" y="242" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="2">SEARCH BEHAVIOR MAP</text>
  <rect x="56" y="258" width="208" height="72" rx="14" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.18"/>
  <text x="72" y="288" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">01</text>
  <text x="72" y="312" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">Customer question</text>
  <rect x="276" y="258" width="208" height="72" rx="14" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.18"/>
  <text x="292" y="288" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">02</text>
  <text x="292" y="312" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Search / AI Search</text>
  <rect x="496" y="258" width="208" height="72" rx="14" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.18"/>
  <text x="512" y="288" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">03</text>
  <text x="512" y="312" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Trusted business facts</text>
  <rect x="716" y="258" width="188" height="72" rx="14" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.18"/>
  <text x="732" y="288" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">04</text>
  <text x="732" y="312" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Maps / Website</text>
  <rect x="916" y="258" width="220" height="72" rx="14" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.18"/>
  <text x="932" y="288" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">05</text>
  <text x="932" y="312" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Call / Directions / Book</text>

  <rect x="56" y="360" width="528" height="196" rx="18" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="80" y="400" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Search query structure</text>
  <rect x="80" y="420" width="360" height="28" rx="8" fill="#F2F8E2" fill-opacity="0.12"/>
  <text x="96" y="440" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">สปาใกล้ฉันที่มีนวดคู่</text>
  <text x="80" y="488" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">Traditional Search → useful page</text>
  <text x="80" y="522" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Not a live Google Search result</text>

  <rect x="608" y="360" width="528" height="196" rx="18" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="632" y="400" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">AI-ready content structure</text>
  <rect x="632" y="420" width="180" height="22" rx="7" fill="#A2DC25" fill-opacity="0.22"/>
  <rect x="824" y="420" width="140" height="22" rx="7" fill="#EBE722" fill-opacity="0.18"/>
  <rect x="632" y="454" width="220" height="22" rx="7" fill="#F2F8E2" fill-opacity="0.12"/>
  <text x="632" y="512" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">บริการ · ทำเล · เวลา · วิธีจอง</text>
  <text x="632" y="542" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Not an AI Overview screenshot</text>

  <rect x="56" y="580" width="264" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.28"/>
  <text x="76" y="616" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">01 Traditional Search</text>
  <text x="76" y="644" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Query to page</text>
  <rect x="336" y="580" width="264" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.28"/>
  <text x="356" y="616" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">02 AI Search / AEO</text>
  <text x="356" y="644" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Question to facts</text>
  <rect x="616" y="580" width="264" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.28"/>
  <text x="636" y="616" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">03 Maps / Local Search</text>
  <text x="636" y="644" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Local discovery path</text>
  <rect x="896" y="580" width="240" height="88" rx="16" fill="#0B1F33" stroke="#A2DC25" stroke-opacity="0.28"/>
  <text x="916" y="616" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">04 Website / Contact</text>
  <text x="916" y="644" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Call · Directions · Book</text>

  <text x="56" y="708" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">ตัวอย่างเส้นทาง Local Discovery · ไม่ใช่ผลอันดับหรือคำตอบ AI ของโรงแรม</text>
  <text x="56" y="742" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Redacted search-performance evidence is omitted unless an approved period and status exist</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-search-behavior-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-search-behavior-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
