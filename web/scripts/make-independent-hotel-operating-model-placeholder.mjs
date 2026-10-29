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

  <rect x="64" y="56" width="310" height="46" rx="23" fill="#A2DC25"/>
  <text x="84" y="87" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Sample operating model</text>
  <text x="392" y="87" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Independent Hotel Operating Model — Sample</text>

  <text x="64" y="156" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="34" font-weight="700">ทิศทาง → แผนการค้า → ระบบปฏิบัติการ → คนและบริการ → จังหวะทบทวน → ปรับปรุงที่วัดได้</text>
  <text x="64" y="198" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Direction → Commercial Plan → Operations System → People &amp; Service → Review Rhythm → Measured Improvement</text>
  <text x="64" y="232" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a live hotel diagnosis · No occupancy / ADR / RevPAR · Scope depends on hotel needs, data, team, and agreed responsibilities</text>

  <rect x="64" y="264" width="232" height="150" rx="16" fill="#0B1F33"/>
  <text x="84" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">01</text>
  <text x="84" y="342" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Direction</text>
  <text x="84" y="376" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Management Direction Brief</text>

  <rect x="312" y="264" width="232" height="150" rx="16" fill="#0B1F33"/>
  <text x="332" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">02</text>
  <text x="332" y="342" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Commercial Plan</text>
  <text x="332" y="376" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Commercial Action Plan</text>

  <rect x="560" y="264" width="232" height="150" rx="16" fill="#0B1F33"/>
  <text x="580" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">03</text>
  <text x="580" y="342" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Operations System</text>
  <text x="580" y="376" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">SOP / Operating Checklist</text>

  <rect x="808" y="264" width="232" height="150" rx="16" fill="#0B1F33"/>
  <text x="828" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">04</text>
  <text x="828" y="342" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">People &amp; Service</text>
  <text x="828" y="376" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Role and Meeting Rhythm</text>

  <rect x="1056" y="264" width="232" height="150" rx="16" fill="#0B1F33"/>
  <text x="1076" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">05</text>
  <text x="1076" y="342" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Review Rhythm</text>
  <text x="1076" y="376" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Guest Experience Review</text>

  <rect x="1304" y="264" width="232" height="150" rx="16" fill="#0B1F33"/>
  <text x="1324" y="308" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">06</text>
  <text x="1324" y="342" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Measured Improvement</text>
  <text x="1324" y="376" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">KPI Review and Action Log</text>

  <rect x="64" y="448" width="480" height="300" rx="18" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <text x="88" y="492" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">01 Direction &amp; Commercial</text>
  <text x="88" y="536" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ทิศทางการบริหาร</text>
  <text x="88" y="572" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Revenue and commercial priorities</text>
  <text x="88" y="608" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Rate, channel, and marketing coordination</text>
  <text x="88" y="668" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Owner / GM approves direction and rate policy</text>
  <text x="88" y="704" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample only · Hotel keeps commercial authority</text>

  <rect x="560" y="448" width="480" height="300" rx="18" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <text x="584" y="492" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">02 Operations &amp; Guest Experience</text>
  <text x="584" y="536" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ขั้นตอนการดำเนินงาน</text>
  <text x="584" y="572" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">SOP and service standards</text>
  <text x="584" y="608" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Guest journey and service quality</text>
  <text x="584" y="668" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">GM / department head approves SOP and service standard</text>
  <text x="584" y="704" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample only · Hotel keeps guest safety</text>

  <rect x="1056" y="448" width="480" height="300" rx="18" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <text x="1080" y="492" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">03 People &amp; Governance</text>
  <text x="1080" y="536" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">บทบาท จังหวะประชุม KPI</text>
  <text x="1080" y="572" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Decision rights and action log</text>
  <text x="1080" y="608" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">KPI Review and Action Log</text>
  <text x="1080" y="668" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Owner / GM approve roles, meetings, and measures</text>
  <text x="1080" y="704" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample only · Hiring stays with the hotel</text>

  <text x="64" y="792" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ขอบเขตงานจริงขึ้นกับความต้องการของโรงแรม ข้อมูลที่มี โครงสร้างทีม และหน้าที่ที่ตกลงกัน</text>
  <text x="64" y="830" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Replace with approved hotel project · Does not guarantee revenue and does not replace a hotel GM</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/independent-hotel-operating-model-placeholder.webp",
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
  throw new Error("sharp is required to write independent-hotel-operating-model-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
