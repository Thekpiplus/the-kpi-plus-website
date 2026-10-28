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
  <rect x="72" y="64" width="268" height="52" rx="26" fill="#A2DC25"/>
  <text x="96" y="98" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="26" font-weight="800">ตัวอย่างข้อมูล</text>
  <text x="360" y="98" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800" letter-spacing="2">SAMPLE WEBSITE</text>
  <text x="72" y="178" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="40" font-weight="700">ตัวอย่าง Website → Room Detail → Booking Engine</text>
  <text x="72" y="228" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="700">Sample direct-booking flow · Replace with approved hotel project</text>

  <rect x="72" y="268" width="980" height="430" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <rect x="72" y="268" width="980" height="48" rx="22" fill="#06182B"/>
  <circle cx="104" cy="292" r="7" fill="#E3A008"/>
  <circle cx="128" cy="292" r="7" fill="#EBE722"/>
  <circle cx="152" cy="292" r="7" fill="#A2DC25"/>
  <text x="184" y="300" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">sample-website.local / room-detail</text>
  <rect x="104" y="340" width="420" height="220" rx="16" fill="#0B6660" fill-opacity="0.28"/>
  <rect x="124" y="368" width="220" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.22"/>
  <rect x="124" y="400" width="160" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.12"/>
  <rect x="124" y="448" width="140" height="36" rx="18" fill="#A2DC25"/>
  <text x="148" y="472" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Book</text>
  <rect x="552" y="340" width="460" height="88" rx="14" fill="#06182B"/>
  <text x="576" y="376" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">01  Website</text>
  <text x="576" y="408" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="20">หน้าแรกที่ลูกค้าเข้ามา</text>
  <rect x="552" y="444" width="460" height="88" rx="14" fill="#06182B"/>
  <text x="576" y="480" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">02  Room Detail</text>
  <text x="576" y="512" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="20">ข้อมูลห้องพักที่เปรียบเทียบได้</text>
  <rect x="104" y="580" width="430" height="80" rx="14" fill="#06182B"/>
  <text x="128" y="616" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">03  Price / Policy</text>
  <text x="128" y="648" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="20">ราคาและนโยบายที่ต้องเห็นก่อนจอง</text>
  <rect x="552" y="580" width="460" height="80" rx="14" fill="#06182B"/>
  <text x="576" y="616" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">04  Booking Engine</text>
  <text x="576" y="648" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="20">ส่งต่อข้อมูลต่อเนื่อง ไม่ถือคลิกเป็นยอดจอง</text>

  <rect x="1088" y="268" width="404" height="430" rx="36" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <rect x="1108" y="288" width="364" height="390" rx="28" fill="#06182B"/>
  <rect x="1248" y="300" width="84" height="10" rx="5" fill="#F2F8E2" fill-opacity="0.28"/>
  <rect x="1132" y="332" width="316" height="150" rx="14" fill="#0B6660" fill-opacity="0.28"/>
  <rect x="1152" y="356" width="180" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.22"/>
  <rect x="1152" y="384" width="132" height="14" rx="7" fill="#F2F8E2" fill-opacity="0.12"/>
  <rect x="1152" y="428" width="120" height="30" rx="15" fill="#A2DC25"/>
  <text x="1172" y="448" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="14" font-weight="800">Book</text>
  <text x="1132" y="524" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Same path</text>
  <text x="1132" y="560" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="22">มือถือใช้เส้นทางเดียวกัน</text>
  <text x="1132" y="598" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Not a live hotel screenshot</text>
  <text x="1132" y="634" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">No invented rates or bookings</text>

  <text x="72" y="760" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="26">ตรวจให้เห็นว่าลูกค้าเข้าเว็บไซต์แล้วหยุดตรงไหน ก่อนปรับข้อมูล ปุ่ม และเส้นทางการจองให้ต่อเนื่องกัน</text>
  <rect x="72" y="792" width="220" height="52" rx="26" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="308" y="792" width="220" height="52" rx="26" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="544" y="792" width="220" height="52" rx="26" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="780" y="792" width="268" height="52" rx="26" fill="#A2DC25" fill-opacity="0.18"/>
  <text x="108" y="826" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">01 Discover</text>
  <text x="338" y="826" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">02 Understand</text>
  <text x="588" y="826" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">03 Trust</text>
  <text x="820" y="826" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="700">04 Book Direct</text>
  <text x="72" y="910" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">Website Review · Mobile UX · Booking Path · Measurement</text>
  <text x="72" y="948" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Sample data · not an approved hotel website or Booking Engine screenshot</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-direct-booking-hero-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-direct-booking-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
