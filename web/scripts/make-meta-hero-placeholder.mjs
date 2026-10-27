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
      <stop offset="0.52" stop-color="#0B1F33"/>
      <stop offset="1" stop-color="#0B6660"/>
    </linearGradient>
    <linearGradient id="creative" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#A2DC25" stop-opacity="0.38"/>
      <stop offset="0.48" stop-color="#EBE722" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#0B6660" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="14" fill="url(#bar)"/>
  <rect x="40" y="36" width="1520" height="928" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="280" height="56" rx="8" fill="#06182B"/>
  <text x="96" y="102" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="800" letter-spacing="3">SAMPLE DATA</text>
  <text x="72" y="188" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="48" font-weight="700">ตัวอย่าง Meta Ad Creative และ Hotel Booking Funnel</text>
  <text x="72" y="248" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">Sample workflow · Creative, Audience and Direct Booking</text>

  <rect x="72" y="292" width="620" height="488" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="108" y="352" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="30" font-weight="800">Creative</text>
  <text x="108" y="400" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="34">ครีเอทีฟ</text>
  <rect x="108" y="428" width="548" height="236" rx="16" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.42" stroke-width="3" stroke-dasharray="12 10"/>
  <rect x="136" y="456" width="492" height="128" rx="12" fill="url(#creative)"/>
  <rect x="176" y="504" width="240" height="18" rx="9" fill="#071C30" fill-opacity="0.55"/>
  <rect x="176" y="536" width="160" height="18" rx="9" fill="#071C30" fill-opacity="0.38"/>
  <rect x="136" y="604" width="360" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.3"/>
  <rect x="136" y="632" width="220" height="16" rx="8" fill="#F2F8E2" fill-opacity="0.16"/>
  <text x="108" y="720" fill="#C5D4E0" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="28">ตัวอย่างครีเอทีฟที่ปิดข้อมูลบัญชี</text>
  <text x="108" y="758" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">Redacted sample · not a live account</text>

  <rect x="720" y="292" width="808" height="144" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="756" y="348" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">01  Audience</text>
  <text x="756" y="398" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="34">กลุ่มลูกค้า · เข้ากับตลาดโรงแรม</text>

  <rect x="720" y="456" width="808" height="144" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="756" y="512" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">02  Offer page</text>
  <text x="756" y="562" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="34">หน้าข้อเสนอที่เกี่ยวข้อง</text>

  <rect x="720" y="620" width="808" height="160" rx="22" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.16" stroke-width="2"/>
  <text x="756" y="676" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">03  Enquire or book</text>
  <text x="756" y="728" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="34">สอบถามหรือจอง · วัดผลได้</text>

  <rect x="72" y="808" width="236" height="64" rx="32" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="324" y="808" width="236" height="64" rx="32" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="576" y="808" width="220" height="64" rx="32" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="812" y="808" width="268" height="64" rx="32" fill="#A2DC25" fill-opacity="0.18"/>
  <rect x="1096" y="808" width="320" height="64" rx="32" fill="#A2DC25" fill-opacity="0.18"/>
  <text x="120" y="850" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="26" font-weight="700">เป้าหมาย</text>
  <text x="368" y="850" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="26" font-weight="700">กลุ่มลูกค้า</text>
  <text x="624" y="850" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="26" font-weight="700">ครีเอทีฟ</text>
  <text x="848" y="850" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="26" font-weight="700">หน้าข้อเสนอ</text>
  <text x="1136" y="850" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="26" font-weight="700">สอบถามหรือจอง</text>
  <text x="72" y="930" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="24">ตัวอย่างข้อมูล · Sample data · not a live campaign or client account</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/meta-ads-management-hero-placeholder.webp");
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
  throw new Error("sharp is required to write meta-ads-management-hero-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
