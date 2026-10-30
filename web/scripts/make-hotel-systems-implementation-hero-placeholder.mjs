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
  <rect x="72" y="64" width="420" height="52" rx="26" fill="#A2DC25"/>
  <text x="96" y="98" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24" font-weight="800">ตัวอย่าง Hotel Systems และ Data Flow</text>
  <text x="516" y="98" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800" letter-spacing="1">SAMPLE ARCHITECTURE</text>
  <text x="72" y="168" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="32" font-weight="700">PMS → Channel Manager → OTA / Booking Engine → Reporting</text>
  <text x="72" y="210" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Sample integration architecture · Subject to technical verification</text>

  <rect x="72" y="248" width="1048" height="520" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <rect x="72" y="248" width="1048" height="48" rx="22" fill="#06182B"/>
  <circle cx="104" cy="272" r="7" fill="#E3A008"/>
  <circle cx="128" cy="272" r="7" fill="#EBE722"/>
  <circle cx="152" cy="272" r="7" fill="#A2DC25"/>
  <text x="184" y="280" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">sample-architecture.local / data-flow-review</text>

  <rect x="104" y="328" width="228" height="196" rx="16" fill="#06182B" stroke="#EBE722" stroke-width="2"/>
  <text x="124" y="368" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">01  PMS</text>
  <rect x="124" y="384" width="132" height="28" rx="14" fill="#EBE722"/>
  <text x="136" y="404" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">Needs Mapping</text>
  <text x="124" y="448" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">ผู้สมัคร Source of Truth</text>
  <text x="124" y="478" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Still needs mapping</text>

  <text x="344" y="430" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">→</text>

  <rect x="380" y="328" width="228" height="196" rx="16" fill="#06182B" stroke="#E3A008" stroke-width="2"/>
  <text x="400" y="368" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">02  Channel Manager</text>
  <rect x="400" y="384" width="132" height="28" rx="14" fill="#EBE722"/>
  <text x="412" y="404" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="13" font-weight="800">Pending Access</text>
  <text x="400" y="448" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">รอสิทธิ์ผู้ให้บริการ</text>
  <text x="400" y="478" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Not a live connection</text>

  <text x="620" y="430" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">→</text>

  <rect x="656" y="328" width="228" height="196" rx="16" fill="#06182B" stroke="#E3A008" stroke-width="2"/>
  <text x="676" y="368" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">03  OTA / Engine</text>
  <rect x="676" y="384" width="188" height="28" rx="14" fill="#E3A008"/>
  <text x="688" y="404" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Requires Provider Support</text>
  <text x="676" y="448" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">API / connector</text>
  <text x="676" y="478" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Subject to verification</text>

  <text x="896" y="430" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800">→</text>

  <rect x="932" y="328" width="156" height="196" rx="16" fill="#06182B" stroke="#3B3B3B" stroke-width="2"/>
  <text x="948" y="368" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">04  Reporting</text>
  <rect x="948" y="384" width="124" height="28" rx="14" fill="#3B3B3B"/>
  <text x="958" y="404" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="12" font-weight="800">Not Configured</text>
  <text x="948" y="448" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">หลัง Go-live</text>
  <text x="948" y="478" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample only</text>

  <rect x="104" y="556" width="228" height="44" rx="22" fill="#0B6660"/>
  <text x="128" y="584" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Connected</text>
  <rect x="348" y="556" width="188" height="44" rx="22" fill="#EBE722"/>
  <text x="368" y="584" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Needs Mapping</text>
  <rect x="552" y="556" width="268" height="44" rx="22" fill="#E3A008"/>
  <text x="568" y="584" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Requires Provider Support</text>
  <rect x="836" y="556" width="188" height="44" rx="22" fill="#EBE722"/>
  <text x="852" y="584" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Pending Access</text>
  <rect x="104" y="616" width="188" height="44" rx="22" fill="#3B3B3B"/>
  <text x="124" y="644" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Not Configured</text>
  <text x="312" y="644" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Legend only. No system is marked Connected in this sample.</text>
  <text x="104" y="710" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="22">ช่วยให้ระบบโรงแรม ข้อมูล ผู้รับผิดชอบ และขั้นตอนหลัง Go-live เชื่อมกันอย่างตรวจสอบได้</text>
  <text x="104" y="746" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Not an approved hotel screenshot · No API keys, account IDs, bookings, or revenue</text>

  <rect x="1156" y="248" width="372" height="520" rx="36" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <rect x="1176" y="268" width="332" height="480" rx="28" fill="#06182B"/>
  <rect x="1300" y="280" width="84" height="10" rx="5" fill="#F2F8E2" fill-opacity="0.28"/>
  <text x="1200" y="328" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">MOBILE REVIEW</text>
  <rect x="1200" y="348" width="284" height="72" rx="12" fill="#0B1F33"/>
  <text x="1216" y="378" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">PMS</text>
  <text x="1216" y="404" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Needs Mapping</text>
  <rect x="1200" y="432" width="284" height="72" rx="12" fill="#0B1F33"/>
  <text x="1216" y="462" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Channel Manager</text>
  <text x="1216" y="488" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Pending Access</text>
  <rect x="1200" y="516" width="284" height="72" rx="12" fill="#0B1F33"/>
  <text x="1216" y="546" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">OTA / Booking Engine</text>
  <text x="1216" y="572" fill="#E3A008" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Requires Provider Support</text>
  <rect x="1200" y="600" width="284" height="72" rx="12" fill="#0B1F33"/>
  <text x="1216" y="630" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Reporting</text>
  <text x="1216" y="656" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Not Configured</text>
  <text x="1200" y="714" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Same sample path</text>

  <text x="72" y="830" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24">งานเริ่มจากสำรวจระบบ เส้นทางข้อมูล การจับคู่ และความพร้อมก่อนตั้งค่า</text>
  <text x="72" y="870" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Inventory · Data flow · Mapping · Implementation readiness</text>
  <text x="72" y="920" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Dummy 1600 × 1000 · display 560 × 350 · 8:5</text>
  <text x="72" y="956" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Replace with an approved redacted architecture screenshot when publication is approved</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-systems-implementation-hero-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-systems-implementation-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
