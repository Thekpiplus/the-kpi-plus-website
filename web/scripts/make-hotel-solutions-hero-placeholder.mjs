import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 1000;
const steps = [
  ["01", "Revenue &amp; Sales", "รายได้และการขาย"],
  ["02", "Marketing &amp; Booking", "การตลาดและการจอง"],
  ["03", "Website / Booking", "เว็บไซต์และระบบจอง"],
  ["04", "Systems &amp; Data", "ระบบและข้อมูล"],
  ["05", "Team &amp; Operations", "ทีมและการดำเนินงาน"],
  ["06", "Measured Review", "ทบทวนและวัดผล"],
];

const cardW = 220;
const gap = 18;
const startX = 72;
const rowY = 320;

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
  <rect x="72" y="64" width="980" height="64" rx="32" fill="#EBE722"/>
  <text x="96" y="106" fill="#0B1F33" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="26" font-weight="800">Hotel Solutions Overview — Sample Visual</text>
  <rect x="1272" y="76" width="216" height="40" rx="20" fill="#A2DC25"/>
  <text x="1300" y="103" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="1.2">DUMMY 8:5</text>
  <text x="72" y="176" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">Hotel Solutions Ecosystem</text>
  <text x="72" y="220" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24" font-weight="700">Revenue &amp; Sales · Marketing &amp; Booking · Systems &amp; Team Development</text>
  <text x="72" y="262" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22">เริ่มจากจุดที่ธุรกิจต้องการก่อน — ไม่ต้องซื้อครบทุกบริการ</text>

  ${steps
    .map(([num, en, th], index) => {
      const x = startX + index * (cardW + gap);
      const arrow =
        index < steps.length - 1
          ? `<path d="M${x + cardW + 2} ${rowY + 110} L${x + cardW + gap - 2} ${rowY + 110}" stroke="#A2DC25" stroke-width="3" fill="none"/><path d="M${x + cardW + gap - 10} ${rowY + 102} L${x + cardW + gap - 2} ${rowY + 110} L${x + cardW + gap - 10} ${rowY + 118}" stroke="#A2DC25" stroke-width="3" fill="none"/>`
          : "";
      return `<rect x="${x}" y="${rowY}" width="${cardW}" height="220" rx="18" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.45" stroke-width="2"/>
  <text x="${x + 20}" y="${rowY + 48}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${num}</text>
  <text x="${x + 20}" y="${rowY + 96}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">${en}</text>
  <text x="${x + 20}" y="${rowY + 132}" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="16">${th}</text>
  <text x="${x + 20}" y="${rowY + 180}" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample step</text>
  ${arrow}`;
    })
    .join("\n  ")}

  <text x="72" y="620" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Revenue &amp; Sales → Marketing &amp; Booking → Hotel Website/Booking → Systems &amp; Data → Team &amp; Operations → Measured Review</text>
  <text x="72" y="668" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">แผนภาพตัวอย่างสำหรับหน้าไดเรกทอรีโซลูชัน — รอภาพจริงที่ได้รับอนุญาต</text>
  <rect x="72" y="720" width="1456" height="180" rx="18" fill="#06182B"/>
  <text x="96" y="780" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">Three service groups · choose one starting point</text>
  <text x="96" y="824" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">บริหารรายได้และการขาย · การตลาดและการจองตรง · บริหารและพัฒนาโรงแรม</text>
  <text x="96" y="868" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Dummy 1600 × 1000 · display ~560 × 350 · 8:5 / 16:10</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-solutions-hero-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-solutions-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
