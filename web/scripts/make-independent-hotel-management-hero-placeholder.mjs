import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 1000;
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
  <rect width="${width}" height="14" fill="url(#bar)"/>
  <rect x="40" y="36" width="1520" height="928" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="268" height="52" rx="26" fill="#A2DC25"/>
  <text x="96" y="98" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24" font-weight="800">ตัวอย่างข้อมูล</text>
  <text x="360" y="98" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800" letter-spacing="1.6">SAMPLE WORKFLOW</text>
  <text x="72" y="176" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="36" font-weight="700">ตัวอย่าง Hotel Management Review และ Operating Plan</text>
  <text x="72" y="224" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Sample management workflow · Replace with approved hotel project</text>

  <rect x="72" y="268" width="900" height="520" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="104" y="316" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Operating plan board</text>
  <text x="104" y="352" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Not a live client hotel · No occupancy / ADR / RevPAR</text>

  <rect x="104" y="384" width="836" height="72" rx="14" fill="#06182B"/>
  <text x="128" y="428" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">01  Assessment</text>
  <text x="360" y="428" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22">ประเมินทีม ระบบงาน และการค้า</text>
  <rect x="104" y="468" width="836" height="72" rx="14" fill="#06182B"/>
  <text x="128" y="512" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">02  Plan / owners</text>
  <text x="360" y="512" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22">แผนงานและผู้รับผิดชอบตามที่อนุมัติ</text>
  <rect x="104" y="552" width="836" height="72" rx="14" fill="#06182B"/>
  <text x="128" y="596" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">03  Alignment</text>
  <text x="360" y="596" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22">จัดทีม ทิศทางการค้า และจังหวะงาน</text>
  <rect x="104" y="636" width="836" height="72" rx="14" fill="#06182B"/>
  <text x="128" y="680" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">04  Review / actions</text>
  <text x="360" y="680" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22">ทบทวน KPI และติดตามการกระทำ</text>
  <text x="104" y="748" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Hotel keeps GM, staffing, legal, and guest-safety responsibility</text>

  <rect x="1004" y="268" width="508" height="520" rx="22" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.28" stroke-width="2"/>
  <text x="1036" y="320" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Sample checklist</text>
  <rect x="1036" y="352" width="444" height="64" rx="12" fill="#0B1F33"/>
  <text x="1056" y="392" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22">ทิศทางเจ้าของ</text>
  <rect x="1036" y="428" width="444" height="64" rx="12" fill="#0B1F33"/>
  <text x="1056" y="468" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Operating structure</text>
  <rect x="1036" y="504" width="444" height="64" rx="12" fill="#0B1F33"/>
  <text x="1056" y="544" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Commercial direction</text>
  <rect x="1036" y="580" width="444" height="64" rx="12" fill="#0B1F33"/>
  <text x="1056" y="620" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Team alignment</text>
  <rect x="1036" y="656" width="444" height="88" rx="12" fill="#0B6660" fill-opacity="0.35"/>
  <text x="1056" y="700" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Not configured</text>
  <text x="1056" y="728" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Occupancy / ADR hidden until approved</text>

  <text x="72" y="860" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="26">ช่วยเจ้าของโรงแรมเปลี่ยนปัญหาการบริหารให้เป็นแผนงาน ผู้รับผิดชอบ และจังหวะการติดตามผลที่ทำได้จริง</text>
  <text x="72" y="910" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Independent Hotel · Operating Structure · Commercial Direction · Team Alignment</text>
  <text x="72" y="948" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Diagram only · Does not guarantee revenue and does not replace a hotel GM</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/independent-hotel-management-hero-placeholder.webp");
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
  throw new Error("sharp is required to write independent-hotel-management-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
