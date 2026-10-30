import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const out = join(process.cwd(), "public/images/hotel-systems-implementation-responsibility-placeholder.webp");
await mkdir(dirname(out), { recursive: true });
if (existsSync(out)) {
  const meta = await sharp(out).metadata();
  if (meta.width === 1600 && meta.height === 900) {
    console.log("responsibility placeholder ok", meta.width, meta.height);
    process.exit(0);
  }
}
await sharp({
  create: {
    width: 1600,
    height: 900,
    channels: 3,
    background: { r: 11, g: 31, b: 51 },
  },
})
  .webp({ quality: 80 })
  .toFile(out);
console.log("wrote", out);
