import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

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
  throw new Error("sharp is required to write independent-hotel placeholders");
}

const width = 1600;
const height = 1000;

function svgFor({ id, titleTh, titleEn, cards }) {
  const cardMarkup = cards
    .map((card, index) => {
      const x = 72 + (index % 4) * 370;
      const y = 280 + Math.floor(index / 4) * 220;
      return `<rect x="${x}" y="${y}" width="350" height="196" rx="18" fill="#06182B"/>
        <text x="${x + 24}" y="${y + 48}" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">${String(index + 1).padStart(2, "0")}</text>
        <text x="${x + 24}" y="${y + 88}" fill="#F2F8E2" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="24" font-weight="700">${card.th}</text>
        <text x="${x + 24}" y="${y + 128}" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">${card.en}</text>
        <text x="${x + 24}" y="${y + 164}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample Workflow</text>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
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
  <text x="360" y="98" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800" letter-spacing="1.4">SAMPLE WORKFLOW</text>
  <text x="72" y="178" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="38" font-weight="700">${titleTh}</text>
  <text x="72" y="228" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">${titleEn}</text>
  ${cardMarkup}
  <text x="72" y="910" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Replace with approved hotel project · Not a live client hotel · No invented occupancy / ADR / RevPAR</text>
  <text x="72" y="948" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">${id} · Diagram only · Hotel keeps legal, staffing, and safety responsibility</text>
</svg>`;
}

const boards = [
  {
    file: "independent-hotel-hero-placeholder.webp",
    id: "hero",
    titleTh: "เส้นทางบริหารโรงแรมอิสระ",
    titleEn: "Owner direction → Assessment → Operating model → 30/60/90",
    cards: [
      { th: "ทิศทางเจ้าของ", en: "Owner direction" },
      { th: "ประเมินโรงแรม", en: "Hotel assessment" },
      { th: "โมเดลดำเนินงาน", en: "Operating model" },
      { th: "จังหวะ 30/60/90", en: "30/60/90 rhythm" },
    ],
  },
  {
    file: "independent-hotel-assessment-placeholder.webp",
    id: "assessment",
    titleTh: "กระดานประเมินโรงแรม",
    titleEn: "Hotel assessment board · not a meeting photo",
    cards: [
      { th: "ทีมและบทบาท", en: "Team and roles" },
      { th: "ระบบงาน", en: "Front / back of house" },
      { th: "การค้า", en: "Commercial" },
      { th: "ประสบการณ์แขก", en: "Guest experience" },
      { th: "ข้อมูลตัดสินใจ", en: "Decision data" },
      { th: "จังหวะเจ้าของ", en: "Owner rhythm" },
    ],
  },
  {
    file: "independent-hotel-services-placeholder.webp",
    id: "services",
    titleTh: "สิ่งที่อาจช่วยได้ ตามขอบเขตที่ตกลง",
    titleEn: "Support that may be offered within an agreed scope",
    cards: [
      { th: "ทิศทาง", en: "Direction" },
      { th: "การค้า", en: "Commercial" },
      { th: "ปฏิบัติการ", en: "Operations" },
      { th: "คน", en: "People" },
      { th: "ประสบการณ์แขก", en: "Guest experience" },
      { th: "ทบทวน KPI", en: "KPI review" },
    ],
  },
  {
    file: "independent-hotel-operating-model-placeholder.webp",
    id: "operating-model",
    titleTh: "โมเดลดำเนินงาน Diagnose Align Coordinate Review Adjust",
    titleEn: "Operating model with hotel responsibility remaining visible",
    cards: [
      { th: "Diagnose", en: "See the hotel as it is" },
      { th: "Align", en: "Agree scope and owners" },
      { th: "Coordinate", en: "Run the agreed work" },
      { th: "Review", en: "Look at verified KPIs" },
      { th: "Adjust", en: "Change order, not ownership" },
    ],
  },
  {
    file: "independent-hotel-workflow-placeholder.webp",
    id: "workflow",
    titleTh: "วิธีเริ่มงาน Review / Align / Start",
    titleEn: "Sample Review, Align, Start workflow",
    cards: [
      { th: "Review", en: "Owner / assessment note" },
      { th: "Align", en: "Hotel approves scope" },
      { th: "Start", en: "Agreed 30/60/90 outline" },
    ],
  },
  {
    file: "independent-hotel-fit-matrix-placeholder.webp",
    id: "fit-matrix",
    titleTh: "ตารางความเหมาะสม",
    titleEn: "Fit / needs information / not this service",
    cards: [
      { th: "เข้ากับงาน", en: "May fit" },
      { th: "ต้องมีข้อมูลเพิ่ม", en: "Needs more information" },
      { th: "ไม่ใช่บริการนี้", en: "Not this service" },
    ],
  },
  {
    file: "independent-hotel-scope-placeholder.webp",
    id: "scope",
    titleTh: "ขอบเขตและความรับผิดชอบ",
    titleEn: "Support / hotel approval / hotel responsibility",
    cards: [
      { th: "อาจช่วยได้", en: "May support" },
      { th: "โรงแรมอนุมัติ", en: "Hotel approves" },
      { th: "โรงแรมรับผิดชอบ", en: "Hotel owns" },
    ],
  },
  {
    file: "independent-hotel-plan-placeholder.webp",
    id: "plan",
    titleTh: "โครง 30 / 60 / 90 วัน",
    titleEn: "Sample timeline, not a live hotel plan",
    cards: [
      { th: "30 วัน", en: "Assessment" },
      { th: "60 วัน", en: "Operating rhythm" },
      { th: "90 วัน", en: "KPI review" },
    ],
  },
  {
    file: "independent-hotel-related-placeholder.webp",
    id: "related",
    titleTh: "งานที่เกี่ยวข้อง",
    titleEn: "Related hotel work, not a result",
    cards: [
      { th: "รายได้", en: "Revenue" },
      { th: "ฝึกอบรม", en: "Training" },
      { th: "เว็บไซต์", en: "Website" },
      { th: "จองตรง", en: "Direct bookings" },
    ],
  },
  {
    file: "independent-hotel-contact-placeholder.webp",
    id: "contact",
    titleTh: "ขั้นตอนหลังส่งข้อมูล",
    titleEn: "Assessment note → proposed scope → owner conversation",
    cards: [
      { th: "ประเมินเบื้องต้น", en: "Assessment note" },
      { th: "ร่างขอบเขต", en: "Proposed scope" },
      { th: "คุยกับเจ้าของ", en: "Owner conversation" },
    ],
  },
];

const processWidth = 1200;
const processHeight = 600;
const processSteps = [
  { n: "01", en: "Context" },
  { n: "02", en: "Assessment" },
  { n: "03", en: "Scope" },
  { n: "04", en: "Operating Plan" },
];
const processCards = processSteps
  .map((step, index) => {
    const x = 56 + index * 280;
    return `<rect x="${x}" y="250" width="256" height="210" rx="18" fill="#06182B"/>
      <text x="${x + 22}" y="${290}" fill="#A2DC25" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="800">${step.n}</text>
      <text x="${x + 22}" y="${338}" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="26" font-weight="700">${step.en}</text>
      <text x="${x + 22}" y="${378}" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">Sample process</text>`;
  })
  .join("");
const processSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${processWidth}" height="${processHeight}" viewBox="0 0 ${processWidth} ${processHeight}">
  <defs>
    <linearGradient id="pbar" x1="0" y1="0" x2="${processWidth}" y2="0">
      <stop stop-color="#A2DC25"/>
      <stop offset="1" stop-color="#EBE722"/>
    </linearGradient>
    <linearGradient id="pwash" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#06182B"/>
      <stop offset="0.55" stop-color="#0B1F33"/>
      <stop offset="1" stop-color="#0B6660"/>
    </linearGradient>
  </defs>
  <rect width="${processWidth}" height="${processHeight}" fill="url(#pwash)"/>
  <rect width="${processWidth}" height="10" fill="url(#pbar)"/>
  <rect x="32" y="28" width="1136" height="544" rx="24" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="56" y="52" width="430" height="44" rx="22" fill="#A2DC25"/>
  <text x="76" y="81" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="20" font-weight="800">What Happens Next — Sample process</text>
  <text x="56" y="140" fill="#FFFFFF" font-family="Leelawadee UI, Segoe UI, Tahoma, sans-serif" font-size="32" font-weight="700">ขั้นตอนหลังเริ่มคุย</text>
  <text x="56" y="186" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Context → Assessment → Scope → Operating Plan</text>
  ${processCards}
  <text x="56" y="510" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="18">Diagram only · Not a person photo · Not a live client hotel</text>
  <text x="56" y="542" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="16">1200 × 600 · display about 420 × 210 · Sample process</text>
</svg>`;

const outDir = join(dirname(fileURLToPath(import.meta.url)), "../public/images");
await mkdir(outDir, { recursive: true });

if (!process.argv.includes("--process-only")) {
  for (const board of boards) {
    const buffer = await sharp(Buffer.from(svgFor(board))).webp({ quality: 88 }).toBuffer();
    const out = join(outDir, board.file);
    await writeFile(out, buffer);
    console.log(`wrote ${out} ${width}x${height} ${buffer.length} bytes`);
  }
}

const processBuffer = await sharp(Buffer.from(processSvg)).webp({ quality: 88 }).toBuffer();
const processOut = join(outDir, "independent-hotel-contact-process-placeholder.webp");
await writeFile(processOut, processBuffer);
console.log(`wrote ${processOut} ${processWidth}x${processHeight} ${processBuffer.length} bytes`);
