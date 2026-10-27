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
    <linearGradient id="fit" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#A2DC25" stop-opacity="0.7"/>
      <stop offset="0.62" stop-color="#EBE722" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#F2F8E2" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="10" fill="url(#bar)"/>
  <rect x="36" y="28" width="1128" height="744" rx="22" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.32" stroke-width="2"/>
  <rect x="60" y="52" width="220" height="44" rx="8" fill="#06182B"/>
  <text x="78" y="82" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800" letter-spacing="2.4">SAMPLE DATA</text>
  <text x="60" y="148" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="34" font-weight="700">ตัวอย่าง Audience Insight และ Creative Performance</text>
  <text x="60" y="188" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="18" font-weight="700">Sample data · not hotel campaign reach</text>

  <rect x="60" y="220" width="520" height="360" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="88" y="262" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Interest / Market Segment</text>
  <rect x="88" y="286" width="464" height="78" rx="12" fill="#06182B"/>
  <text x="108" y="318" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="22">การเข้าพัก · Stay</text>
  <text x="108" y="346" fill="#9BB0C2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">ประเภทห้องและการเข้าพัก</text>
  <rect x="88" y="376" width="464" height="78" rx="12" fill="#06182B"/>
  <text x="108" y="408" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="22">โอกาส · Occasion</text>
  <text x="108" y="436" fill="#9BB0C2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">พักผ่อน ทำงาน หรืออีเวนต์</text>
  <rect x="88" y="466" width="464" height="86" rx="12" fill="#06182B"/>
  <text x="108" y="500" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="22">ตลาด · Market</text>
  <text x="108" y="528" fill="#9BB0C2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="16">ภาษาและตลาดต้นทาง</text>

  <rect x="604" y="220" width="532" height="360" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="632" y="262" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">Creative Performance</text>
  <rect x="632" y="286" width="476" height="128" rx="12" fill="#06182B"/>
  <text x="656" y="322" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Creative A</text>
  <text x="656" y="352" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="20">สอดคล้องข้อเสนอ · Offer fit</text>
  <rect x="656" y="368" width="300" height="14" rx="7" fill="url(#fit)"/>
  <text x="656" y="400" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample comparison · no CTR or ROAS</text>
  <rect x="632" y="430" width="476" height="128" rx="12" fill="#06182B"/>
  <text x="656" y="466" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">Creative B</text>
  <text x="656" y="496" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="20">สอดคล้องกลุ่มลูกค้า · Audience fit</text>
  <rect x="656" y="512" width="220" height="14" rx="7" fill="url(#fit)"/>
  <text x="656" y="544" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="14">Sample comparison · not a live account</text>

  <rect x="60" y="604" width="248" height="52" rx="26" fill="#A2DC25" fill-opacity="0.16"/>
  <rect x="324" y="604" width="220" height="52" rx="26" fill="#A2DC25" fill-opacity="0.16"/>
  <rect x="560" y="604" width="268" height="52" rx="26" fill="#A2DC25" fill-opacity="0.16"/>
  <rect x="844" y="604" width="292" height="52" rx="26" fill="#A2DC25" fill-opacity="0.16"/>
  <text x="92" y="638" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18" font-weight="700">การเห็นโฆษณา</text>
  <text x="368" y="638" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18" font-weight="700">ความสนใจ</text>
  <text x="596" y="638" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18" font-weight="700">หน้าปลายทาง</text>
  <text x="876" y="638" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18" font-weight="700">สอบถามหรือจอง</text>
  <text x="60" y="718" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, sans-serif" font-size="18">ตัวอย่างข้อมูล · Sample data · not campaign reach, website visitors, or bookings · 1200 × 800</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/meta-ads-audience-insight-placeholder.webp");
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
  throw new Error("sharp is required to write meta-ads-audience-insight-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
