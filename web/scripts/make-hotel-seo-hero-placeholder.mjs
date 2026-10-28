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
  <rect x="72" y="64" width="280" height="56" rx="8" fill="#06182B"/>
  <text x="96" y="102" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800" letter-spacing="3">SAMPLE DATA</text>
  <text x="72" y="188" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="42" font-weight="700">ตัวอย่าง Local Search → Maps → Website → Contact</text>
  <text x="72" y="244" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">Sample workflow · Search visibility and local discovery</text>

  <rect x="72" y="292" width="340" height="430" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="104" y="348" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">01  Search / AI</text>
  <text x="104" y="404" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="30">คำค้นที่ชัด</text>
  <text x="104" y="452" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="24">ข้อมูลธุรกิจชุดเดียว</text>
  <rect x="104" y="488" width="276" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.28"/>
  <rect x="104" y="520" width="196" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.14"/>
  <text x="104" y="668" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Not a live search result</text>

  <rect x="436" y="292" width="340" height="430" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="468" y="348" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">02  Maps / Profile</text>
  <text x="468" y="404" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="30">Google Maps</text>
  <text x="468" y="452" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="24">รองรับการตัดสินใจชุดเดียวกัน</text>
  <rect x="468" y="488" width="276" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.28"/>
  <rect x="468" y="520" width="168" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.14"/>
  <text x="468" y="668" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Redacted sample layout</text>

  <rect x="800" y="292" width="340" height="430" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="832" y="348" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">03  Website</text>
  <text x="832" y="404" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="30">หน้าธุรกิจที่มีประโยชน์</text>
  <text x="832" y="452" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="24">คำตอบพาไปหน้าที่ใช้ต่อได้</text>
  <rect x="832" y="488" width="276" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.28"/>
  <rect x="832" y="520" width="188" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.14"/>
  <text x="832" y="668" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Not a ranking screenshot</text>

  <rect x="1164" y="292" width="356" height="430" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="1196" y="348" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">04  Contact / Booking</text>
  <text x="1196" y="404" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="30">ติดต่อหรือจอง</text>
  <text x="1196" y="452" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="24">เส้นทางที่วัดผลได้</text>
  <rect x="1196" y="488" width="292" height="16" rx="8" fill="#A2DC25" fill-opacity="0.35"/>
  <rect x="1196" y="520" width="188" height="16" rx="8" fill="#EBE722" fill-opacity="0.28"/>
  <text x="1196" y="668" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">No invented bookings</text>

  <text x="72" y="790" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="28">ทำให้ข้อมูลธุรกิจสอดคล้องกันตั้งแต่ Search, Google Maps ไปจนถึงเว็บไซต์และช่องทางติดต่อ</text>
  <rect x="72" y="828" width="220" height="56" rx="28" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="308" y="828" width="220" height="56" rx="28" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="544" y="828" width="220" height="56" rx="28" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="780" y="828" width="268" height="56" rx="28" fill="#A2DC25" fill-opacity="0.18"/>
  <text x="118" y="864" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Search</text>
  <text x="360" y="864" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Maps</text>
  <text x="592" y="864" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Website</text>
  <text x="812" y="864" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Contact / Booking</text>
  <text x="72" y="930" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">Sample data · not a live Google Search, Maps, or AI answer result</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-local-search-hero-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-local-search-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
