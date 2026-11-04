import sharp from "sharp";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const out = join(root, "public/images/insights/hotel-marketing-cover-placeholder.webp");
const width = 1600;
const height = 900;

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1F33"/>
      <stop offset="48%" stop-color="#0B6660"/>
      <stop offset="100%" stop-color="#0B1F33"/>
    </linearGradient>
    <radialGradient id="r" cx="88%" cy="18%" r="55%">
      <stop offset="0%" stop-color="#A2DC25" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#A2DC25" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#r)"/>
</svg>`);

await mkdir(dirname(out), { recursive: true });
await sharp(svg).webp({ quality: 82 }).toFile(out);
console.log(`Wrote ${out}`);
