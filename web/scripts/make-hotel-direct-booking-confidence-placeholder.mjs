import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 800;
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
  <rect x="32" y="28" width="1136" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="56" y="48" width="220" height="44" rx="22" fill="#A2DC25"/>
  <text x="76" y="78" fill="#1A3A02" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22" font-weight="800">ตัวอย่างข้อมูล</text>
  <text x="292" y="78" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800" letter-spacing="1.5">SAMPLE WEBSITE</text>
  <text x="56" y="140" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="32" font-weight="700">ตัวอย่าง Booking Confidence Flow</text>
  <text x="56" y="178" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Redacted Room Detail · Price / Policy · Booking Engine preview</text>

  <rect x="56" y="208" width="320" height="430" rx="36" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <rect x="168" y="224" width="96" height="10" rx="5" fill="#F2F8E2" fill-opacity="0.28"/>
  <rect x="76" y="252" width="280" height="118" rx="16" fill="#0B6660" fill-opacity="0.3"/>
  <text x="96" y="284" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Room Detail / Offer</text>
  <rect x="96" y="300" width="180" height="12" rx="6" fill="#F2F8E2" fill-opacity="0.18"/>
  <rect x="96" y="322" width="132" height="12" rx="6" fill="#F2F8E2" fill-opacity="0.1"/>
  <rect x="76" y="386" width="280" height="118" rx="16" fill="#06182B"/>
  <text x="96" y="418" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Price / Cancellation</text>
  <rect x="96" y="434" width="196" height="12" rx="6" fill="#F2F8E2" fill-opacity="0.18"/>
  <rect x="96" y="456" width="148" height="12" rx="6" fill="#F2F8E2" fill-opacity="0.1"/>
  <rect x="96" y="520" width="240" height="36" rx="18" fill="#A2DC25"/>
  <text x="128" y="544" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Availability / CTA</text>
  <text x="76" y="604" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Redacted mobile UI · not a live hotel</text>

  <rect x="400" y="208" width="736" height="430" rx="20" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="424" y="248" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="800">Booking confidence checklist</text>
  <rect x="424" y="268" width="330" height="70" rx="14" fill="#06182B"/>
  <text x="444" y="298" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">01  Room Details</text>
  <text x="444" y="322" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">รายละเอียดห้องพัก</text>
  <rect x="770" y="268" width="342" height="70" rx="14" fill="#06182B"/>
  <text x="790" y="298" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">02  Price / Offer</text>
  <text x="790" y="322" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">ราคาและข้อเสนอ</text>
  <rect x="424" y="350" width="330" height="70" rx="14" fill="#06182B"/>
  <text x="444" y="380" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">03  Cancellation / Policy</text>
  <text x="444" y="404" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">นโยบายยกเลิกและการจอง</text>
  <rect x="770" y="350" width="342" height="70" rx="14" fill="#06182B"/>
  <text x="790" y="380" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">04  Availability / CTA</text>
  <text x="790" y="404" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">ห้องว่างและปุ่มดำเนินการ</text>
  <rect x="424" y="432" width="330" height="70" rx="14" fill="#06182B"/>
  <text x="444" y="462" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">05  Booking Engine</text>
  <text x="444" y="486" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">ระบบจองที่ยืนยันเส้นทางได้</text>
  <rect x="770" y="432" width="342" height="70" rx="14" fill="#06182B"/>
  <text x="790" y="462" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">06  Confirmation</text>
  <text x="790" y="486" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">ยืนยันการจองเมื่อมีข้อมูลจริง</text>
  <rect x="424" y="516" width="688" height="96" rx="14" fill="#06182B"/>
  <text x="444" y="554" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Direct booking flow · redacted engine preview</text>
  <text x="444" y="582" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">ไม่แสดงชื่อโรงแรม ราคา รหัสจอง หรือยอดจอง</text>
  <text x="444" y="604" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">A Book click is not a completed booking</text>

  <text x="56" y="684" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ลูกค้ายังเปลี่ยนใจได้จนกว่าจะจองสำเร็จ จึงต้องเห็นห้องพัก ราคา นโยบาย และเส้นทางจองให้ต่อเนื่องกัน</text>
  <text x="56" y="726" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample Booking Confidence Flow · Replace with approved hotel project</text>
  <text x="56" y="754" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Not the Hero visual · not a live client website or Booking Engine screenshot</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-direct-booking-confidence-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-direct-booking-confidence-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
