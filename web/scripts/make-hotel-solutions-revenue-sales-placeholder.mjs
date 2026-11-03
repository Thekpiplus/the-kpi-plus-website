import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const steps = [
  ["01", "Demand / Booking Data", "ข้อมูลความต้องการ / การจอง"],
  ["02", "Rate / Channel Decision", "ตัดสินใจราคา / ช่องทาง"],
  ["03", "Team Action", "ทีมลงมือทำ"],
  ["04", "Performance Review", "ทบทวนผล"],
];

const cardW = 300;
const gap = 40;
const startX = 80;
const rowY = 280;

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
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="920" height="56" rx="28" fill="#EBE722"/>
  <text x="96" y="100" fill="#0B1F33" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24" font-weight="800">Revenue &amp; Sales Workflow — Sample / Redacted</text>
  <rect x="1288" y="72" width="200" height="40" rx="20" fill="#A2DC25"/>
  <text x="1318" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="1.2">DUMMY 16:9</text>
  <text x="72" y="168" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="700">Commercial decision flow</text>
  <text x="72" y="212" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22">Process labels only · no Occupancy, ADR, RevPAR, or client rates</text>

  ${steps
    .map(([num, en, th], index) => {
      const x = startX + index * (cardW + gap);
      const arrow =
        index < steps.length - 1
          ? `<path d="M${x + cardW + 4} ${rowY + 100} L${x + cardW + gap - 4} ${rowY + 100}" stroke="#A2DC25" stroke-width="3" fill="none"/><path d="M${x + cardW + gap - 14} ${rowY + 92} L${x + cardW + gap - 4} ${rowY + 100} L${x + cardW + gap - 14} ${rowY + 108}" stroke="#A2DC25" stroke-width="3" fill="none"/>`
          : "";
      return `<rect x="${x}" y="${rowY}" width="${cardW}" height="200" rx="18" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.45" stroke-width="2"/>
  <text x="${x + 24}" y="${rowY + 48}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${num}</text>
  <text x="${x + 24}" y="${rowY + 96}" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">${en}</text>
  <text x="${x + 24}" y="${rowY + 136}" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">${th}</text>
  <text x="${x + 24}" y="${rowY + 172}" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample step · redacted</text>
  ${arrow}`;
    })
    .join("\n  ")}

  <text x="72" y="560" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Demand / Booking Data → Rate / Channel Decision → Team Action → Performance Review</text>
  <rect x="72" y="600" width="1456" height="200" rx="18" fill="#06182B"/>
  <text x="96" y="660" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">Sample / redacted commercial workflow</text>
  <text x="96" y="708" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ไม่แสดงตัวเลขรายได้ ราคา หรือชื่อโรงแรมลูกค้า</text>
  <text x="96" y="752" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Dummy 1600 × 900 · display ~720 × 405 · 16:9</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-solutions-revenue-sales-placeholder.webp",
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
  await writeFile(out.replace(/\.webp$/, ".svg"), svg, "utf8");
  console.log("sharp unavailable; wrote SVG fallback");
  process.exit(0);
}

await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(out);
console.log(`wrote ${out}`);
