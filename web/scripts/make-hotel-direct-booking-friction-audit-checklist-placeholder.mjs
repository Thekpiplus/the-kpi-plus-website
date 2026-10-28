import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const groups = [
  { num: "01", title: "Website / Message", status: "Needs Review", tone: "yellow" },
  { num: "02", title: "Room / Offer / Policy", status: "Needs Review", tone: "yellow" },
  { num: "03", title: "CTA / Booking Path", status: "Blocked", tone: "blocked" },
  { num: "04", title: "Measurement / Consent", status: "Not Configured", tone: "muted" },
];

function box(group, index) {
  const x = 72 + index * 372;
  const fill = group.tone === "blocked" ? "#0B1F33" : group.tone === "muted" ? "#E3E8EB" : "#FFF6C2";
  const stroke = group.tone === "blocked" ? "#A2DC25" : group.tone === "muted" ? "#3B3B3B" : "#EBE722";
  const titleFill = group.tone === "blocked" ? "#FFFFFF" : "#0B1F33";
  const statusFill = group.tone === "blocked" ? "#A2DC25" : "#3B3B3B";
  return `
  <rect x="${x}" y="310" width="348" height="360" rx="24" fill="${fill}" stroke="${stroke}" stroke-width="4"/>
  <text x="${x + 28}" y="372" fill="${statusFill}" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${group.num}</text>
  <text x="${x + 28}" y="430" fill="${titleFill}" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">${group.title}</text>
  <text x="${x + 28}" y="490" fill="${statusFill}" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">${group.status}</text>
  <text x="${x + 28}" y="540" fill="${statusFill}" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Sample status</text>`;
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
  <text x="96" y="101" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="28" font-weight="800">สถานะตัวอย่าง</text>
  <text x="72" y="196" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="42" font-weight="800">Direct Booking Friction Audit Checklist — Sample</text>
  <text x="72" y="250" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">Not automatically checked · HTML table is the working list</text>
  ${groups.map(box).join("")}
  <text x="72" y="730" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="24">Clear is unused in this sample · Last reviewed: not reviewed</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-friction-audit-checklist-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-direct-booking-friction-audit-checklist-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
