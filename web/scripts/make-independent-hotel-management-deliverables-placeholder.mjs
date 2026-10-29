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

  <rect x="64" y="56" width="214" height="44" rx="22" fill="#A2DC25"/>
  <text x="84" y="85" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Sample deliverables</text>
  <text x="300" y="85" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">Independent Hotel Management Deliverables — Sample</text>

  <text x="64" y="150" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">Named deliverables and hotel approval points</text>
  <text x="64" y="186" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">ไม่ใช่รูปสต็อก ไม่ใช่แพ็กเกจสำเร็จรูป และไม่ใช่ผลที่การันตี · Not a stock photo</text>

  <rect x="64" y="214" width="1472" height="48" rx="10" fill="#0B6660"/>
  <text x="80" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">AREA</text>
  <text x="360" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">WHAT WE REVIEW OR SUPPORT</text>
  <text x="900" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">DELIVERABLE</text>
  <text x="1240" y="245" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">HOTEL APPROVAL POINT</text>

  <rect x="64" y="270" width="1472" height="72" rx="10" fill="#0B1F33"/>
  <text x="80" y="314" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Management Direction</text>
  <text x="360" y="314" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Goals, market, positioning, priorities</text>
  <text x="900" y="314" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Management Direction Brief</text>
  <text x="1240" y="314" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Owner approves goals</text>

  <rect x="64" y="350" width="1472" height="72" rx="10" fill="#06182B"/>
  <text x="80" y="394" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Commercial</text>
  <text x="360" y="394" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Revenue, rate, channel, promotion</text>
  <text x="900" y="394" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Commercial Action Plan</text>
  <text x="1240" y="394" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Hotel approves rates</text>

  <rect x="64" y="430" width="1472" height="72" rx="10" fill="#0B1F33"/>
  <text x="80" y="474" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Operations</text>
  <text x="360" y="474" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Workflows, SOP, standards, ownership</text>
  <text x="900" y="474" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Operating Checklist</text>
  <text x="1240" y="474" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Hotel approves standards</text>

  <rect x="64" y="510" width="1472" height="72" rx="10" fill="#06182B"/>
  <text x="80" y="554" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">People</text>
  <text x="360" y="554" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Roles, meeting rhythm, decision rights</text>
  <text x="900" y="554" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">Team Rhythm Plan</text>
  <text x="1240" y="554" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Hotel approves roles</text>

  <rect x="64" y="590" width="1472" height="72" rx="10" fill="#0B1F33"/>
  <text x="80" y="634" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Measurement</text>
  <text x="360" y="634" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">KPI, reporting, action tracking</text>
  <text x="900" y="634" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="700">KPI Review and Action Log</text>
  <text x="1240" y="634" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Hotel approves KPIs</text>

  <rect x="64" y="690" width="720" height="70" rx="14" fill="#0B6660"/>
  <text x="88" y="732" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">The KPI Plus may support structure and review</text>
  <rect x="808" y="690" width="728" height="70" rx="14" fill="#06182B"/>
  <text x="832" y="732" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Hotel remains responsible for owner decisions</text>

  <text x="64" y="808" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="18">โรงแรมยังรับผิดชอบกฎหมาย ความปลอดภัยของแขก คน งบประมาณ และมาตรฐานบริการขั้นสุดท้าย</text>
  <text x="64" y="844" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Diagram only · Replace with an approved hotel project · No occupancy, ADR, or guaranteed revenue</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/independent-hotel-management-deliverables-placeholder.webp",
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
  throw new Error("sharp is required to write independent-hotel-management-deliverables-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
