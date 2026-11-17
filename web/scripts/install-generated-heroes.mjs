import sharp from "sharp";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ASSETS = "C:/Users/thekp/.cursor/projects/d-Cursor-Project-the-kpi-plus-website/assets";
const ROOT = process.cwd();

const jobs = [
  { src: "hero-solutions.jpg", dest: "public/images/hotel-solutions-hero-placeholder.webp" },
  { src: "hero-direct-booking.jpg", dest: "public/images/hotel-direct-booking-hero-placeholder.webp" },
  { src: "hero-hotel-seo.jpg", dest: "public/images/hotel-seo-local-search-hero-placeholder.webp" },
  { src: "hero-google-ads.jpg", dest: "public/images/google-ads-management-hero-placeholder.webp" },
  { src: "hero-meta-ads.jpg", dest: "public/images/meta-ads-management-hero-placeholder.webp" },
  { src: "hero-hotel-ai.jpg", dest: "public/images/hotel-ai-automation-hero-placeholder.webp" },
  { src: "hero-hotel-systems.jpg", dest: "public/images/hotel-systems-implementation-hero-placeholder.webp" },
  { src: "hero-hotel-training.jpg", dest: "public/images/hotel-training-hero-placeholder.webp" },
  { src: "hero-hotel-website.jpg", dest: "public/images/hotel-website-design-hero-placeholder.webp" },
  { src: "hero-independent-hotel.jpg", dest: "public/images/independent-hotel-management-hero-placeholder.webp" },
];

for (const job of jobs) {
  const from = join(ASSETS, job.src);
  const to = join(ROOT, job.dest);
  if (!existsSync(from)) {
    console.error("missing", from);
    continue;
  }
  await sharp(from).resize(1600, 900, { fit: "cover" }).webp({ quality: 86 }).toFile(to);
  console.log("wrote", job.dest);
}
