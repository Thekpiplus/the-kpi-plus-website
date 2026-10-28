import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const stages = [
  { num: "01", label: "Website Visit", fill: "#F2F8E2", stroke: "#A2DC25", dash: "" },
  { num: "02", label: "Room Interest", fill: "#F2F8E2", stroke: "#A2DC25", dash: "" },
  { num: "03", label: "Booking Start", fill: "#FFF6C2", stroke: "#EBE722", dash: "" },
  { num: "04", label: "Booking Complete", fill: "#F8E6C8", stroke: "#E3A008", dash: "14 12" },
];
const tops = [1320, 1080, 840, 600];
const bottoms = [1080, 840, 600, 400];

function trapezoid(stage, index) {
  const y = 250 + index * 145;
  const h = 126;
  const top = tops[index];
  const bot = bottoms[index];
  const tx = (width - top) / 2;
  const bx = (width - bot) / 2;
  const dash = stage.dash ? ` stroke-dasharray="${stage.dash}"` : "";
  return `
  <polygon points="${tx},${y} ${tx + top},${y} ${bx + bot},${y + h} ${bx},${y + h}" fill="${stage.fill}" stroke="${stage.stroke}" stroke-width="6"${dash}/>
  <text x="800" y="${y + 52}" text-anchor="middle" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${stage.num}</text>
  <text x="800" y="${y + 94}" text-anchor="middle" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="36" font-weight="800">${stage.label}</text>`;
}

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
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="268" height="56" rx="28" fill="#A2DC25"/>
  <text x="96" y="101" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="28" font-weight="800">ตัวอย่างข้อมูล</text>
  <text x="72" y="196" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="42" font-weight="800">Direct Booking Measurement Funnel · Sample data</text>
  ${stages.map(trapezoid).join("")}
  <text x="800" y="840" text-anchor="middle" fill="#E3A008" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">Booking Complete · Tracking not configured</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-measurement-funnel-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-direct-booking-measurement-funnel-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
