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
      <stop offset="0.55" stop-color="#0B1F33"/>
      <stop offset="1" stop-color="#0B6660"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="12" fill="url(#bar)"/>
  <rect x="32" y="28" width="1136" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="56" y="52" width="320" height="40" rx="20" fill="#A2DC25"/>
  <text x="76" y="78" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Sample review framework</text>
  <text x="56" y="128" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="1">DATA CONSISTENCY AUDIT · REDACTED</text>
  <text x="56" y="168" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="28" font-weight="700">ตัวอย่าง Hotel Systems Review และ Data Consistency Audit</text>
  <text x="56" y="204" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Room / rate / availability comparison · Not a live hotel diagnosis</text>

  <rect x="56" y="228" width="720" height="250" rx="16" fill="#0B1F33"/>
  <text x="76" y="260" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">ITEM</text>
  <text x="260" y="260" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">PMS</text>
  <text x="390" y="260" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">CM</text>
  <text x="510" y="260" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">OTA/BE</text>
  <text x="640" y="260" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">STATUS</text>
  <text x="76" y="308" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Room type</text>
  <text x="260" y="308" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">••••</text>
  <text x="390" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Gap</text>
  <text x="510" y="308" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">••••</text>
  <rect x="640" y="288" width="112" height="26" rx="13" fill="#EBE722"/>
  <text x="652" y="306" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Needs Review</text>
  <text x="76" y="356" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Rate plan</text>
  <text x="260" y="356" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">••••</text>
  <text x="390" y="356" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">—</text>
  <text x="510" y="356" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">••••</text>
  <rect x="640" y="336" width="118" height="26" rx="13" fill="#E3A008"/>
  <text x="652" y="354" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Pending Access</text>
  <text x="76" y="404" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Availability</text>
  <text x="260" y="404" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">••••</text>
  <text x="390" y="404" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">••••</text>
  <text x="510" y="404" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">••••</text>
  <rect x="640" y="384" width="112" height="26" rx="13" fill="#EBE722"/>
  <text x="652" y="402" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Needs Review</text>
  <text x="76" y="452" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">No guest names, booking IDs, or revenue totals</text>

  <rect x="792" y="228" width="344" height="250" rx="16" fill="#0B1F33"/>
  <text x="812" y="260" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">INTEGRATION CHECKLIST</text>
  <text x="812" y="300" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">System inventory</text>
  <rect x="812" y="312" width="112" height="24" rx="12" fill="#EBE722"/>
  <text x="824" y="328" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Needs Review</text>
  <text x="812" y="368" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Error handling</text>
  <rect x="812" y="380" width="124" height="24" rx="12" fill="#3B3B3B"/>
  <text x="824" y="396" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Not Configured</text>
  <text x="812" y="436" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Failure contact</text>
  <rect x="812" y="448" width="72" height="24" rx="12" fill="#C45C26"/>
  <text x="826" y="464" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Blocked</text>

  <rect x="56" y="500" width="520" height="120" rx="16" fill="#0B1F33"/>
  <text x="76" y="532" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">DASHBOARD · REDACTED</text>
  <text x="76" y="572" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">•••• · •••• · ••••</text>
  <text x="76" y="604" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Private totals hidden · Sample only</text>

  <rect x="592" y="500" width="544" height="120" rx="16" fill="#0B1F33"/>
  <text x="612" y="532" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">OPS SYSTEM MAP</text>
  <text x="612" y="572" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Source of Truth · Owner · Contact</text>
  <text x="612" y="604" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a client architecture · Not the Hero visual</text>

  <text x="56" y="668" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">กรอบทบทวนตัวอย่าง สำหรับจัดประเด็นระบบและข้อมูล ไม่ใช่ผลตรวจโรงแรมลูกค้า</text>
  <text x="56" y="704" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Question · Status · Evidence · Owner · Recommended next action</text>
  <text x="56" y="742" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Dummy 1200 × 800 · display 480 × 320 · 3:2 · Replace with an approved redacted audit</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-systems-review-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-systems-review-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
