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
  <rect x="36" y="32" width="1528" height="836" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>

  <rect x="64" y="56" width="268" height="44" rx="22" fill="#A2DC25"/>
  <text x="84" y="85" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Sample decision matrix</text>
  <text x="352" y="85" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Is Independent Hotel Management Right for You? — Sample</text>

  <text x="64" y="150" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">Sample situations often discussed</text>
  <text x="64" y="186" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">ไม่ใช่ผลการวินิจฉัยโรงแรมก่อนประเมิน · Not a diagnosis before the hotel is assessed</text>

  <rect x="64" y="214" width="1472" height="48" rx="10" fill="#0B6660"/>
  <text x="80" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">HOTEL SITUATION</text>
  <text x="372" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">SYMPTOMS</text>
  <text x="668" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">FIRST DIAGNOSTIC QUESTION</text>
  <text x="1028" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">RECOMMENDED SUPPORT</text>
  <text x="1320" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">EXPECTED OUTPUT</text>

  <rect x="64" y="270" width="1472" height="72" rx="10" fill="#0B1F33"/>
  <text x="80" y="300" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Owner managing too many areas alone</text>
  <text x="80" y="324" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Slow decisions, no time for review</text>
  <text x="668" y="312" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Who decides daily vs owner items?</text>
  <text x="1028" y="312" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Management rhythm</text>
  <text x="1320" y="312" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Priority Plan</text>

  <rect x="64" y="350" width="1472" height="72" rx="10" fill="#06182B"/>
  <text x="80" y="380" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Team in place, roles unclear</text>
  <text x="80" y="404" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Duplicated work, missed tasks</text>
  <text x="668" y="392" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Who owns each key task?</text>
  <text x="1028" y="392" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Role framework</text>
  <text x="1320" y="392" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Role Framework</text>

  <rect x="64" y="430" width="1472" height="72" rx="10" fill="#0B1F33"/>
  <text x="80" y="460" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Goals without an operating plan</text>
  <text x="80" y="484" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Goal known, next action not</text>
  <text x="668" y="472" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">What is next this week, and who owns it?</text>
  <text x="1028" y="472" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">30/60/90-Day Plan</text>
  <text x="1320" y="472" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">30/60/90-Day Plan</text>

  <rect x="64" y="510" width="1472" height="72" rx="10" fill="#06182B"/>
  <text x="80" y="540" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Commercial and marketing disconnected</text>
  <text x="80" y="564" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Price, channels, promotions apart</text>
  <text x="668" y="552" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Who decides rate, channel, and promo together?</text>
  <text x="1028" y="552" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Commercial review</text>
  <text x="1320" y="552" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Action Plan</text>

  <rect x="64" y="590" width="1472" height="72" rx="10" fill="#0B1F33"/>
  <text x="80" y="620" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Opening, repositioning, or model change</text>
  <text x="80" y="644" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Standards and ownership still forming</text>
  <text x="668" y="632" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Which standards and dates are already agreed?</text>
  <text x="1028" y="632" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Pre-opening plan</text>
  <text x="1320" y="632" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Repositioning Plan</text>

  <text x="64" y="704" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">May not be the right fit when...</text>
  <rect x="64" y="720" width="352" height="56" rx="12" fill="#06182B"/>
  <text x="80" y="754" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Photography or website only</text>
  <rect x="428" y="720" width="352" height="56" rx="12" fill="#06182B"/>
  <text x="444" y="754" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">No decision-maker to approve</text>
  <rect x="792" y="720" width="372" height="56" rx="12" fill="#06182B"/>
  <text x="808" y="754" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Guaranteed revenue, no change</text>
  <rect x="1176" y="720" width="360" height="56" rx="12" fill="#06182B"/>
  <text x="1192" y="754" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Cannot share assessment data</text>

  <text x="64" y="822" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">ตัวอย่างสถานการณ์ที่ใช้เริ่มคุย ไม่ใช่ผลโรงแรมจริง และไม่การันตีรายได้ Occupancy หรือ ADR</text>
  <text x="64" y="852" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Diagram only · Replace with an approved hotel project after assessment</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/independent-hotel-management-fit-matrix-placeholder.webp",
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
  throw new Error("sharp is required to write independent-hotel-management-fit-matrix-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
