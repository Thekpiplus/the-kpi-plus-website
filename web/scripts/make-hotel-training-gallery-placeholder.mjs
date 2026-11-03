import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const width = 1200;
const height = 900;
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/images/training/gallery");

const crops = [
  {
    id: "hospitality-training-workshop-group.webp",
    from: "public/media/hospitality-training-group_cdf6d58f.webp",
    position: "centre",
  },
  {
    id: "hotel-team-workshop-circle.webp",
    from: "public/media/service-quality-circle_e4c75522.webp",
    position: "centre",
  },
  {
    id: "hospitality-workshop-facilitation.webp",
    from: "public/media/hospitality-training-speaking_d8b5b303.webp",
    extract: { left: 110, top: 160, width: 348, height: 261 },
    position: "attention",
  },
  {
    id: "readiness-workshop-speaking.webp",
    from: "public/media/internship-workshop-speaking_d360672e.webp",
    position: "attention",
  },
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
  <rect x="36" y="36" width="1128" height="828" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="2"/>
  <rect x="64" y="64" width="760" height="52" rx="26" fill="#EBE722"/>
  <text x="84" y="98" fill="#0B1F33" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="22" font-weight="800">ตัวอย่างแกลเลอรีงานอบรม — เปลี่ยนเป็นภาพจริง</text>
  <rect x="848" y="74" width="280" height="36" rx="18" fill="#A2DC25"/>
  <text x="868" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="15" font-weight="800">DUMMY 4:3</text>
  <text x="64" y="176" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="28" font-weight="700">Training Gallery Placeholder</text>
  <text x="64" y="220" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">replace with approved real photo</text>
  <text x="64" y="272" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="20">ไม่ใช้ภาพ AI ของห้องอบรม และไม่ใส่ชื่อโรงแรมหรือโลโก้ลูกค้าโดยไม่ได้รับอนุญาต</text>
  <rect x="64" y="320" width="1072" height="500" rx="18" fill="#06182B" stroke="#A2DC25" stroke-opacity="0.42" stroke-width="2"/>
  <rect x="108" y="372" width="420" height="396" rx="16" fill="#0B1F33"/>
  <rect x="156" y="420" width="324" height="220" rx="12" fill="#0B6660" fill-opacity="0.35"/>
  <circle cx="318" cy="530" r="46" fill="#A2DC25"/>
  <rect x="572" y="400" width="508" height="22" rx="11" fill="#0B1F33"/>
  <rect x="572" y="448" width="420" height="22" rx="11" fill="#0B1F33"/>
  <rect x="572" y="496" width="360" height="22" rx="11" fill="#0B1F33"/>
  <text x="572" y="580" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Source 1200 × 900 · Card 360 × 270</text>
  <text x="572" y="620" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Permission required for identifiable participants</text>
</svg>`;

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
  throw new Error("sharp is required to write training gallery images");
}

await mkdir(outDir, { recursive: true });

const placeholder = join(outDir, "training-session-placeholder-01.webp");
const placeholderBuffer = await sharp(Buffer.from(svg)).webp({ quality: 88 }).toBuffer();
await writeFile(placeholder, placeholderBuffer);
const placeholderMeta = await sharp(placeholderBuffer).metadata();
console.log(`wrote ${placeholder} ${placeholderMeta.width}x${placeholderMeta.height} ${placeholderBuffer.length} bytes`);

for (const crop of crops) {
  const source = join(root, crop.from);
  const dest = join(outDir, crop.id);
  let image = sharp(source).rotate();
  if (crop.extract) image = image.extract(crop.extract);
  const buffer = await image
    .resize(width, height, { fit: "cover", position: crop.position })
    .webp({ quality: 86 })
    .toBuffer();
  await writeFile(dest, buffer);
  const meta = await sharp(buffer).metadata();
  const sourceMeta = await sharp(source).metadata();
  console.log(`wrote ${dest} ${meta.width}x${meta.height} from ${sourceMeta.width}x${sourceMeta.height} ${buffer.length} bytes`);
}
