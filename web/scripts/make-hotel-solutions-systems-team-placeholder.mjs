import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Large-label sample frame only — relationship node copy lives in HTML/CSS on the page. */
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
  <rect x="40" y="36" width="1520" height="828" rx="28" fill="#071C30" stroke="#A2DC25" stroke-opacity="0.34" stroke-width="3"/>
  <rect x="72" y="64" width="1080" height="56" rx="28" fill="#EBE722"/>
  <text x="96" y="100" fill="#0B1F33" font-family="Montserrat, Segoe UI, sans-serif" font-size="24" font-weight="800">Hotel Systems, Workflow &amp; Team — Sample Overview</text>
  <rect x="1288" y="72" width="200" height="40" rx="20" fill="#A2DC25"/>
  <text x="1318" y="98" fill="#1A3A02" font-family="Montserrat, Segoe UI, sans-serif" font-size="16" font-weight="800" letter-spacing="1.2">DUMMY 16:9</text>
  <text x="72" y="220" fill="#FFFFFF" font-family="Montserrat, Segoe UI, sans-serif" font-size="34" font-weight="700">Relationship overview frame</text>
  <text x="72" y="278" fill="#F2F8E2" font-family="Montserrat, Segoe UI, sans-serif" font-size="22">Editable node labels and honest status tags render in HTML/CSS</text>
  <g fill="none" stroke="#A2DC25" stroke-width="4" stroke-linecap="round">
    <rect x="120" y="420" width="260" height="120" rx="18"/>
    <rect x="480" y="420" width="280" height="120" rx="18"/>
    <rect x="860" y="420" width="280" height="120" rx="18"/>
    <rect x="1240" y="420" width="240" height="120" rx="18"/>
    <path d="M380 480 H480 M760 480 H860 M1140 480 H1240"/>
  </g>
  <text x="72" y="680" fill="#EBE722" font-family="Montserrat, Segoe UI, sans-serif" font-size="22" font-weight="700">Sample · not automatic end-to-end integration</text>
  <text x="72" y="740" fill="#9BB0C2" font-family="Montserrat, Segoe UI, sans-serif" font-size="20">Dummy 1600 × 900 · display ~720 × 405 · 16:9</text>
</svg>`;

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/images/hotel-solutions-systems-team-placeholder.webp",
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
  await writeFile(out.replace(/\.webp$/, ".svg"), svg, "utf8");
  console.log("sharp unavailable; wrote SVG fallback");
  process.exit(0);
}

await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(out);
console.log(`wrote ${out}`);
