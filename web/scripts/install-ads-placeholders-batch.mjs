import sharp from "sharp";
import { existsSync } from "node:fs";
import { join } from "node:path";

const ASSETS = "C:/Users/thekp/.cursor/projects/d-Cursor-Project-the-kpi-plus-website/assets";
const ROOT = process.cwd();

const jobs = [
  // Google Ads
  {
    src: "google-ads-campaign-workflow-placeholder.jpg",
    dest: "public/images/google-ads-campaign-workflow-placeholder.webp",
  },
  {
    src: "google-ads-channel-comparison-placeholder.jpg",
    dest: "public/images/google-ads-channel-comparison-placeholder.webp",
  },
  {
    src: "google-ads-management-visibility-placeholder.jpg",
    dest: "public/images/google-ads-management-visibility-placeholder.webp",
  },
  {
    src: "google-ads-performance-kpi-placeholder.jpg",
    dest: "public/images/google-ads-performance-kpi-placeholder.webp",
  },
  {
    src: "google-ads-related-content-placeholder.jpg",
    dest: "public/images/google-ads-related-content-placeholder.webp",
  },
  {
    src: "google-ads-search-readiness-framework-placeholder.jpg",
    dest: "public/images/google-ads-search-readiness-framework-placeholder.webp",
  },
  {
    src: "google-ads-team-placeholder.jpg",
    dest: "public/images/google-ads-team-placeholder.webp",
  },
  // Meta Ads
  {
    src: "meta-ads-audience-insight-placeholder.jpg",
    dest: "public/images/meta-ads-audience-insight-placeholder.webp",
  },
  {
    src: "meta-ads-campaign-workflow-placeholder.jpg",
    dest: "public/images/meta-ads-campaign-workflow-placeholder.webp",
  },
  {
    src: "meta-ads-hotel-sales-objectives-placeholder.jpg",
    dest: "public/images/meta-ads-hotel-sales-objectives-placeholder.webp",
  },
  {
    src: "meta-ads-hotel-scenario-matrix-placeholder.jpg",
    dest: "public/images/meta-ads-hotel-scenario-matrix-placeholder.webp",
  },
  {
    src: "meta-ads-management-visibility-placeholder.jpg",
    dest: "public/images/meta-ads-management-visibility-placeholder.webp",
  },
  {
    src: "meta-ads-performance-kpi-placeholder.jpg",
    dest: "public/images/meta-ads-performance-kpi-placeholder.webp",
  },
  {
    src: "meta-ads-readiness-framework-placeholder.jpg",
    dest: "public/images/meta-ads-readiness-framework-placeholder.webp",
  },
  {
    src: "meta-ads-related-content-placeholder.jpg",
    dest: "public/images/meta-ads-related-content-placeholder.webp",
  },
  {
    src: "meta-ads-scenario-comparison-placeholder.jpg",
    dest: "public/images/meta-ads-scenario-comparison-placeholder.webp",
  },
  {
    src: "meta-ads-team-placeholder.jpg",
    dest: "public/images/meta-ads-team-placeholder.webp",
  },
];

const only = process.argv.slice(2);
const selected = only.length
  ? jobs.filter((j) => only.some((arg) => j.src.includes(arg) || j.dest.includes(arg)))
  : jobs;

let ok = 0;
let missing = 0;

for (const job of selected) {
  const from = join(ASSETS, job.src);
  const to = join(ROOT, job.dest);
  if (!existsSync(from)) {
    console.error("missing", from);
    missing += 1;
    continue;
  }
  await sharp(from).resize(1600, 900, { fit: "cover" }).webp({ quality: 86 }).toFile(to);
  console.log("wrote", job.dest);
  ok += 1;
}

console.log(`done: ${ok} installed, ${missing} missing`);
