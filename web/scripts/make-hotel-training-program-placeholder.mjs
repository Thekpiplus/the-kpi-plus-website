import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
const tiles = [
  ["01", "Service", "Hotel Operations"],
  ["02", "Revenue / KPI", "Commercial literacy"],
  ["03", "Team Building", "Collaboration"],
  ["04", "Leadership", "Communication"],
  ["05", "Digital / AI", "Systems at work"],
  ["06", "Academy", "Online Learning"],
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
  <rect x="56" y="52" width="820" height="52" rx="26" fill="#EBE722"/>
  <text x="76" y="86" fill="#0B1F33" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22" font-weight="800">ตัวอย่างหลักสูตร/กิจกรรม — เปลี่ยนเป็นภาพจริง</text>
  <rect x="896" y="62" width="240" height="36" rx="18" fill="#A2DC25"/>
  <text x="916" y="86" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 3:2</text>
  <text x="56" y="148" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">Training formats · not a course catalogue</text>
  <text x="56" y="184" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18" font-weight="700">ไม่มีชื่อหลักสูตรปลอม ใบรับรอง จำนวนวัน หรือภาพคน AI</text>
  ${tiles
    .map(([num, title, note], index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 56 + col * 362;
      const y = 214 + row * 250;
      return `<rect x="${x}" y="${y}" width="342" height="228" rx="16" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.42" stroke-width="2"/>
  <circle cx="${x + 46}" cy="${y + 48}" r="22" fill="#0B6660"/>
  <text x="${x + 36}" y="${y + 55}" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">${num}</text>
  <text x="${x + 84}" y="${y + 46}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">${title}</text>
  <text x="${x + 84}" y="${y + 74}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">${note}</text>
  <rect x="${x + 24}" y="${y + 108}" width="294" height="14" rx="7" fill="#0B1F33"/>
  <rect x="${x + 24}" y="${y + 136}" width="220" height="14" rx="7" fill="#0B1F33"/>
  <text x="${x + 24}" y="${y + 188}" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Icon / material · 360 × 240</text>`;
    })
    .join("\n  ")}
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-training-program-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-training-program-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
