import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const steps = [
  ["01", "Business Goal", "เป้าหมายทางธุรกิจ"],
  ["02", "Role / Skill", "บทบาท / ทักษะที่ต้องการ"],
  ["03", "Current Level", "ระดับทักษะปัจจุบัน"],
  ["04", "Gap / Priority", "ช่องว่าง / ลำดับความสำคัญ"],
  ["05", "Recommendation", "ข้อเสนอการอบรม"],
];

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
  <rect x="32" y="28" width="1136" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="2"/>
  <rect x="56" y="52" width="760" height="52" rx="26" fill="#EBE722"/>
  <text x="76" y="86" fill="#0B1F33" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22" font-weight="800">ตัวอย่าง Training Needs Assessment — Sample / Redacted</text>
  <rect x="836" y="62" width="300" height="36" rx="18" fill="#A2DC25"/>
  <text x="856" y="86" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 3:2 · 1200 × 800</text>
  <text x="56" y="148" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">Training Needs Assessment</text>
  <text x="56" y="184" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18" font-weight="700">ใช้เพื่อพัฒนาทีม ไม่ใช่จัดอันดับพนักงาน · For development, not ranking</text>
  ${steps
    .map(([num, title, note], index) => {
      const x = 56 + index * 218;
      return `<rect x="${x}" y="214" width="204" height="250" rx="16" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.42" stroke-width="2"/>
  <text x="${x + 18}" y="252" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">${num}</text>
  <text x="${x + 18}" y="292" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">${title}</text>
  <text x="${x + 18}" y="322" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="15">${note}</text>
  <rect x="${x + 18}" y="346" width="168" height="28" rx="8" fill="#0B1F33"/>
  <text x="${x + 28}" y="366" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Sample / Redacted</text>
  <text x="${x + 18}" y="432" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">No names · No scores</text>`;
    })
    .join("\n  ")}
  <rect x="56" y="490" width="1088" height="236" rx="18" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14" stroke-width="2"/>
  <text x="80" y="530" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Sample sheet · Role A · Handover · Practise · In-house practice</text>
  <text x="80" y="566" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">ใบสำรวจตัวอย่าง ปิดชื่อพนักงาน คะแนนรายบุคคล และรายละเอียดโรงแรม</text>
  <text x="80" y="604" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a live hotel record · Not public employee ranking</text>
  <text x="80" y="668" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Dummy 1200 × 800 · display 480 × 320 · 3:2</text>
  <text x="80" y="698" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Replace with an approved unique photo only if it is not used in the gallery</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-training-needs-assessment-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-training-needs-assessment-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
