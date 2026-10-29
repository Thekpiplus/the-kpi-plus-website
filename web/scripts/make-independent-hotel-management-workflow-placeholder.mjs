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

  <rect x="64" y="56" width="220" height="44" rx="22" fill="#A2DC25"/>
  <text x="84" y="85" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Sample workflow</text>
  <text x="304" y="85" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Independent Hotel Management Workflow — Sample</text>

  <text x="64" y="154" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="700">Assess → Align → Operate</text>
  <text x="64" y="194" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ไทม์ไลน์ จุดส่งมอบ ผลลัพธ์ และจุดที่โรงแรมอนุมัติ · Not a meeting photo</text>

  <rect x="64" y="228" width="464" height="250" rx="18" fill="#0B1F33"/>
  <text x="88" y="272" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">01 Assess</text>
  <text x="88" y="312" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ทำความเข้าใจโรงแรม</text>
  <text x="88" y="350" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Owner: Advisor + owner</text>
  <text x="88" y="386" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Output: Independent Hotel Assessment</text>
  <text x="88" y="430" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Next: define scope, roles, 30/60/90</text>

  <rect x="560" y="228" width="464" height="250" rx="18" fill="#0B1F33"/>
  <text x="584" y="272" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">02 Align</text>
  <text x="584" y="312" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">จัดขอบเขตและจังหวะงาน</text>
  <text x="584" y="350" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Owner: Owner approves</text>
  <text x="584" y="386" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Output: Scope, Roles, 30/60/90-Day Plan</text>
  <text x="584" y="430" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Next: start Operate on approved plan</text>

  <rect x="1056" y="228" width="480" height="250" rx="18" fill="#0B1F33"/>
  <text x="1080" y="272" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">03 Operate</text>
  <text x="1080" y="312" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">เริ่มงานและติดตามผล</text>
  <text x="1080" y="350" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Owner: Named department owners</text>
  <text x="1080" y="386" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Output: Weekly/Monthly Rhythm + Action Log</text>
  <text x="1080" y="430" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Next: continue, adjust, or stop</text>

  <text x="64" y="528" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Hotel approval points</text>
  <rect x="64" y="552" width="232" height="70" rx="14" fill="#06182B"/>
  <text x="84" y="594" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Goals</text>
  <rect x="312" y="552" width="232" height="70" rx="14" fill="#06182B"/>
  <text x="332" y="594" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Scope</text>
  <rect x="560" y="552" width="232" height="70" rx="14" fill="#06182B"/>
  <text x="580" y="594" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Budget</text>
  <rect x="808" y="552" width="320" height="70" rx="14" fill="#06182B"/>
  <text x="828" y="594" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Brand and service standards</text>
  <rect x="1144" y="552" width="392" height="70" rx="14" fill="#06182B"/>
  <text x="1164" y="594" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Pricing and promotion</text>
  <rect x="64" y="640" width="360" height="70" rx="14" fill="#06182B"/>
  <text x="84" y="682" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Staffing or policy changes</text>

  <text x="64" y="768" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ไม่ใช่รูปประชุมทั่วไป ไม่ใช่แผนโรงแรมจริง และไม่การันตีรายได้ Occupancy หรือ ADR</text>
  <text x="64" y="808" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Handoff: Advisor + owner → Owner approves → Named department owners · Replace with approved hotel project</text>
  <text x="64" y="844" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Diagram only · Hotel keeps GM, legal, staffing, and guest-safety responsibility</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/independent-hotel-management-workflow-placeholder.webp",
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
  throw new Error("sharp is required to write independent-hotel-management-workflow-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
