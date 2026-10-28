import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const steps = [
  { num: "01", label: "Review", output: "Friction Audit" },
  { num: "02", label: "Prioritize", output: "Priority Backlog" },
  { num: "03", label: "Adjust", output: "Approved Change Set" },
  { num: "04", label: "Measure", output: "Conversion Report" },
];
const checks = ["Analytics", "Key pages", "Mobile", "Room detail", "CTA", "Engine", "Tracking"];

const boxW = 310;
const boxH = 250;
const gap = 36;
const startX = 86;
const startY = 268;

function box(step, index) {
  const x = startX + index * (boxW + gap);
  const arrow =
    index < steps.length - 1
      ? `<polygon points="${x + boxW + 6},${startY + boxH / 2 - 12} ${x + boxW + gap - 6},${startY + boxH / 2} ${x + boxW + 6},${startY + boxH / 2 + 12}" fill="#A2DC25"/>`
      : "";
  return `
  <rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="24" fill="#F2F8E2" stroke="#A2DC25" stroke-width="4"/>
  <text x="${x + 24}" y="${startY + 56}" fill="#0B6660" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="800">${step.num}</text>
  <text x="${x + 24}" y="${startY + 114}" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="800">${step.label}</text>
  <rect x="${x + 20}" y="${startY + 148}" width="${boxW - 40}" height="72" rx="18" fill="#0B1F33"/>
  <text x="${x + boxW / 2}" y="${startY + 194}" text-anchor="middle" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${step.output}</text>
  ${arrow}`;
}

function check(label, index) {
  const x = 86 + index * 204;
  return `
  <rect x="${x}" y="678" width="188" height="64" rx="32" fill="#FFF6C2"/>
  <text x="${x + 94}" y="720" text-anchor="middle" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">${label}</text>`;
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
  <text x="72" y="196" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="40" font-weight="800">Direct Booking Optimization Workflow — Sample</text>
  <text x="72" y="240" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Review → Prioritize → Adjust → Measure</text>
  ${steps.map(box).join("")}
  ${checks.map(check).join("")}
  <text x="72" y="830" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="24">Handoff map · not a meeting photo</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-direct-booking-workflow-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-direct-booking-workflow-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
