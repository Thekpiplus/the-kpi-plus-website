import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const ASSETS = "C:/Users/thekp/.cursor/projects/d-Cursor-Project-the-kpi-plus-website/assets";
const ROOT = process.cwd();

const jobs = [
  {
    src: "case-studies-hero-property.jpg",
    dest: "public/images/case-studies-hero-property-placeholder.webp",
    w: 1600,
    h: 900,
  },
  {
    src: "case-studies-results-chart.jpg",
    dest: "public/images/case-studies-results-chart-placeholder.webp",
    w: 1600,
    h: 900,
  },
  {
    src: "case-study-report-preview.jpg",
    dest: "public/images/case-study-report-preview-placeholder.webp",
    w: 1200,
    h: 800,
  },
  {
    src: "insights-featured-revenue-meeting.jpg",
    dest: "public/images/insights-featured-revenue-meeting-placeholder.webp",
    w: 1600,
    h: 900,
  },
  {
    src: "insights-direct-booking.jpg",
    dest: "public/images/insights-direct-booking-placeholder.webp",
    w: 1200,
    h: 675,
  },
  {
    src: "insights-hotel-ai-workflow.jpg",
    dest: "public/images/insights-hotel-ai-workflow-placeholder.webp",
    w: 1200,
    h: 675,
  },
  {
    src: "insights-seo-vs-sem.jpg",
    dest: "public/images/insights-seo-sem-placeholder.webp",
    w: 1200,
    h: 675,
  },
  {
    src: "insights-download-guide.jpg",
    dest: "public/images/insights-download-guide-placeholder.webp",
    w: 800,
    h: 600,
  },
];

for (const job of jobs) {
  const from = join(ASSETS, job.src);
  const to = join(ROOT, job.dest);
  if (!existsSync(from)) {
    console.error("missing source", from);
    continue;
  }
  mkdirSync(dirname(to), { recursive: true });
  await sharp(from).resize(job.w, job.h, { fit: "cover" }).webp({ quality: 86 }).toFile(to);
  console.log("wrote", job.dest);
}
