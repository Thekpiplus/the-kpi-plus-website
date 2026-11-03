import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 1000;
const steps = [
  ["01", "Role practice", "ฝึกตามบทบาทกับงานจริง"],
  ["02", "Assess", "ประเมินตามเกณฑ์ที่ตกลง"],
  ["03", "Apply", "ทดลองใช้ที่หน้างาน"],
  ["04", "Follow-up", "ติดตามและทบทวนในทีม"],
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
  <rect width="${width}" height="14" fill="url(#bar)"/>
  <rect x="40" y="36" width="1520" height="928" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="1180" height="64" rx="32" fill="#EBE722"/>
  <text x="96" y="106" fill="#0B1F33" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="26" font-weight="800">ตัวอย่างภาพกิจกรรม Hotel Team Training — เปลี่ยนเป็นภาพจริงที่ได้รับอนุญาต</text>
  <rect x="1272" y="76" width="216" height="40" rx="20" fill="#A2DC25"/>
  <text x="1300" y="103" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="1.2">DUMMY 8:5</text>
  <text x="72" y="176" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">Hotel Training &amp; Team Development</text>
  <text x="72" y="220" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24" font-weight="700">ฝึกตามบทบาท · ฝึกใช้ · ประเมิน · ติดตาม — ไม่ใช่การบรรยายครั้งเดียว</text>

  <rect x="72" y="256" width="1456" height="430" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14" stroke-width="2"/>
  ${steps
    .map(([num, title, note], index) => {
      const x = 104 + index * 354;
      return `<rect x="${x}" y="292" width="326" height="358" rx="20" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.42" stroke-width="2"/>
  <text x="${x + 28}" y="348" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${num}</text>
  <rect x="${x + 28}" y="372" width="270" height="88" rx="12" fill="#0B1F33"/>
  <rect x="${x + 52}" y="392" width="222" height="16" rx="8" fill="#0B6660"/>
  <rect x="${x + 68}" y="420" width="86" height="22" rx="6" fill="#3B3B3B"/>
  <rect x="${x + 168}" y="420" width="86" height="22" rx="6" fill="#3B3B3B"/>
  <text x="${x + 28}" y="500" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">${title}</text>
  <text x="${x + 28}" y="542" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">${note}</text>
  <text x="${x + 28}" y="586" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample station · no people photo</text>`;
    })
    .join("\n  ")}

  <text x="72" y="740" fill="#EBE722" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24" font-weight="700">ออกแบบการเรียนรู้ให้เชื่อมกับงานจริง พร้อมฝึกใช้และติดตามการนำไปใช้ในทีม</text>
  <text x="72" y="786" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Sample activity frame · not a live workshop photo · not AI-generated people</text>
  <rect x="72" y="820" width="1456" height="96" rx="18" fill="#06182B"/>
  <text x="96" y="860" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Discover → Design → Deliver → Assess → Follow-up</text>
  <text x="96" y="894" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Dummy 1600 × 1000 · display 560 × 350 · 8:5 / 16:10</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-training-hero-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-training-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
