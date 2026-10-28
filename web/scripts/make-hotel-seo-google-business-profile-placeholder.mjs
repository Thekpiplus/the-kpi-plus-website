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
      <stop offset="0.52" stop-color="#0B1F33"/>
      <stop offset="1" stop-color="#0B6660"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#wash)"/>
  <rect width="${width}" height="12" fill="url(#bar)"/>
  <rect x="32" y="28" width="1136" height="744" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="56" y="52" width="268" height="44" rx="8" fill="#06182B"/>
  <text x="76" y="81" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800" letter-spacing="3">SAMPLE DATA</text>
  <text x="56" y="148" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="30" font-weight="700">ตัวอย่าง Google Business Profile สำหรับโรงแรม</text>
  <text x="56" y="186" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Anonymised data · not a Maps rank</text>
  <text x="56" y="230" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Hotel •••••</text>
  <rect x="56" y="248" width="280" height="12" rx="6" fill="#F2F8E2" fill-opacity="0.18"/>

  <rect x="56" y="280" width="528" height="300" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="80" y="318" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">Profile checklist</text>
  <text x="80" y="352" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Business name</text>
  <text x="360" y="352" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Redacted</text>
  <text x="80" y="386" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Category</text>
  <text x="360" y="386" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Matches</text>
  <text x="80" y="420" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Address / service area</text>
  <text x="360" y="420" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">One set</text>
  <text x="80" y="454" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Hours / phone / website</text>
  <text x="360" y="454" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Current</text>
  <text x="80" y="488" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Photos / services</text>
  <text x="360" y="488" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Current</text>
  <text x="80" y="522" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Reviews / questions</text>
  <text x="360" y="522" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Authors redacted</text>
  <text x="80" y="556" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Contact / booking link</text>
  <text x="360" y="556" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">If measurable</text>

  <rect x="608" y="280" width="536" height="300" rx="16" fill="#0B1F33" stroke="#F2F8E2" stroke-opacity="0.14"/>
  <text x="632" y="318" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">Customer next step</text>
  <rect x="632" y="344" width="110" height="40" rx="20" fill="rgba(162,220,37,0.18)"/>
  <text x="662" y="370" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Call</text>
  <rect x="754" y="344" width="148" height="40" rx="20" fill="rgba(162,220,37,0.18)"/>
  <text x="776" y="370" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Directions</text>
  <rect x="914" y="344" width="196" height="40" rx="20" fill="rgba(162,220,37,0.18)"/>
  <text x="934" y="370" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Website Visit</text>
  <rect x="632" y="400" width="132" height="40" rx="20" fill="rgba(162,220,37,0.18)"/>
  <text x="658" y="426" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Contact</text>
  <rect x="776" y="400" width="132" height="40" rx="20" fill="rgba(162,220,37,0.18)"/>
  <text x="800" y="426" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="700">Booking</text>
  <text x="632" y="480" fill="#C5D4E0" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Booking intent only if a booking event can be measured</text>
  <text x="632" y="518" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">No large Google logo · not a live client screenshot</text>
  <text x="632" y="552" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="15">Does not promise the top Maps position</text>

  <text x="56" y="640" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Call · Directions · Website Visit · Contact · Booking if measurable</text>
  <text x="56" y="688" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Account ID, private email, review authors, and internal notes redacted</text>
  <text x="56" y="730" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800">ANONYMISED DATA</text>
</svg>`;

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/images/hotel-seo-google-business-profile-placeholder.webp");
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
  throw new Error("sharp is required to write hotel-seo-google-business-profile-placeholder.webp");
}

const buffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(out, buffer);
console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
