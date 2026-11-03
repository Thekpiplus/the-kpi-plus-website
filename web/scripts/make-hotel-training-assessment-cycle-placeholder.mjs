import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1600;
const height = 900;
const steps = [
  ["01", "Brief", "Business Goal"],
  ["02", "Needs", "Skill Assessment"],
  ["03", "Design", "Learning Design"],
  ["04", "Training", "Workshop"],
  ["05", "Practice", "Role-play"],
  ["06", "Post-assess", "Optional"],
  ["07", "Follow-up", "Optional"],
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
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="2"/>
  <rect x="72" y="64" width="980" height="56" rx="28" fill="#EBE722"/>
  <text x="92" y="100" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">Hotel Training &amp; Assessment Cycle — Sample</text>
  <rect x="1072" y="74" width="216" height="36" rx="18" fill="#A2DC25"/>
  <text x="1092" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 16:9</text>
  <text x="72" y="168" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">Not only a training day</text>
  <text x="72" y="204" fill="#A2DC25" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20" font-weight="700">สำรวจ ออกแบบ ฝึก ประเมิน ติดตาม — ประเมิน/ติดตามมีได้เมื่อตกลงขอบเขต</text>
  ${steps
    .map(([num, title, note], index) => {
      const x = 72 + index * 210;
      return `<rect x="${x}" y="248" width="196" height="430" rx="18" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.42" stroke-width="2"/>
  <text x="${x + 18}" y="292" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${num}</text>
  <text x="${x + 18}" y="336" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">${title}</text>
  <text x="${x + 18}" y="368" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">${note}</text>
  <rect x="${x + 18}" y="400" width="160" height="12" rx="6" fill="#0B1F33"/>
  <rect x="${x + 18}" y="428" width="124" height="12" rx="6" fill="#0B1F33"/>
  <text x="${x + 18}" y="490" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">Possible deliverable</text>
  <text x="${x + 18}" y="630" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="13">HTML/CSS cycle · 1600 × 900</text>`;
    })
    .join("\n  ")}
  <text x="72" y="740" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Replace with HTML cycle on the public page. No AI image with embedded text.</text>
  <text x="72" y="776" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Display ~720 × 405 · 16:9 · Dummy only</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-training-assessment-cycle-placeholder.webp",
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
  throw new Error("sharp is required to write hotel-training-assessment-cycle-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
const meta = await sharp(buffer).metadata();
console.log(`wrote ${out} ${meta.width}x${meta.height} ${buffer.length} bytes`);
