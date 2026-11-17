import sharp from "sharp";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ASSETS = "C:/Users/thekp/.cursor/projects/d-Cursor-Project-the-kpi-plus-website/assets";
const ROOT = process.cwd();

const jobs = [
  {
    id: "hotel-revenue-meetings-that-lead-to-decisions",
    src: join(ASSETS, "cover-revenue-meeting.jpg"),
    alt: "ภาพปกบทความประชุม Revenue โรงแรม ให้จบด้วยการตัดสินใจ จากสัญญาณรายได้สู่เจ้าของงานและจุดทบทวน โดย The KPI Plus",
  },
  {
    id: "hotel-technology-adoption-commercial-project",
    src: join(ASSETS, "cover-hotel-tech-ai.jpg"),
    alt: "ภาพปกบทความ Technology และ AI ช่วยทีมโรงแรม ด้วยเวิร์กโฟลว์ แผนปรับใช้ และบริบทรายได้ โดย The KPI Plus",
  },
  {
    id: "direct-booking-journey-audit",
    src: join(ASSETS, "cover-direct-booking.jpg"),
    alt: "ภาพปกบทความวิเคราะห์เส้นทาง Direct Booking จาก Search ถึง Website และ Booking Engine โดย The KPI Plus",
  },
  {
    id: "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
    src: join(ASSETS, "cover-seo-vs-sem.jpg"),
    alt: "ภาพปกบทความ SEO vs SEM สำหรับโรงแรม เปรียบเทียบ Organic SEO Paid SEM และเส้นทางจองตรง โดย The KPI Plus",
  },
];

async function writeCover(id, src) {
  const dir = join(ROOT, "public/images/blog", id, "th");
  mkdirSync(dir, { recursive: true });
  const cover = join(dir, "cover.webp");
  const og = join(dir, "og.webp");
  await sharp(src).resize(1600, 900, { fit: "cover" }).webp({ quality: 86 }).toFile(cover);
  await sharp(src).resize(1200, 630, { fit: "cover" }).webp({ quality: 84 }).toFile(og);
  return { cover: `/images/blog/${id}/th/cover.webp`, og: `/images/blog/${id}/th/og.webp` };
}

const paths = {};
for (const job of jobs) {
  paths[job.id] = { ...(await writeCover(job.id, job.src)), alt: job.alt };
  console.log("wrote", job.id);
}

// hotel-marketing: use package covers already imported
paths["hotel-marketing"] = {
  cover: "/images/blog/hotel-marketing/th/cover.webp",
  og: "/images/blog/hotel-marketing/th/og.webp",
  alt: "ภาพปกบทความการตลาดโรงแรมคืออะไร เชื่อมการค้นพบจนถึงการจอง โดย The KPI Plus",
  enCover: "/images/blog/hotel-marketing/en/cover.webp",
  enOg: "/images/blog/hotel-marketing/en/og.webp",
  enAlt:
    "Cover image for What Is Hotel Marketing and Why It Matters, by The KPI Plus",
};

// Patch insights.ts cover fields for these ids
let insights = readFileSync(join(ROOT, "lib/insights.ts"), "utf8");
for (const [id, meta] of Object.entries(paths)) {
  const marker = `id: "${id}"`;
  const start = insights.indexOf(marker);
  if (start < 0) continue;
  let i = start;
  while (i > 0 && insights[i] !== "{") i -= 1;
  let depth = 0;
  let j = i;
  for (; j < insights.length; j++) {
    if (insights[j] === "{") depth += 1;
    else if (insights[j] === "}") {
      depth -= 1;
      if (depth === 0) {
        j += 1;
        break;
      }
    }
  }
  let block = insights.slice(i, j);
  block = block
    .replace(/coverImage: "[^"]+"/, `coverImage: "${meta.cover}"`)
    .replace(/coverImageAlt: "[^"]*"/, `coverImageAlt: ${JSON.stringify(meta.alt)}`)
    .replace(/coverImageFit: "[^"]+"/, `coverImageFit: "cover"`)
    .replace(/coverImageStatus: "[^"]+"/, `coverImageStatus: "approved"`)
    .replace(/\n\s*sampleVisual: true,/, "");
  insights = insights.slice(0, i) + block + insights.slice(j);
}
writeFileSync(join(ROOT, "lib/insights.ts"), insights, "utf8");
console.log("insights.ts covers updated");

// Patch seo-manifest og images where routes exist
const manifestPath = join(ROOT, "content/seo-manifest.json");
const pages = JSON.parse(readFileSync(manifestPath, "utf8"));
for (const [id, meta] of Object.entries(paths)) {
  const route = `/insights/${id}`;
  const idx = pages.findIndex((p) => p.route === route);
  if (idx >= 0) {
    pages[idx].ogImage = `https://thekpiplus.com${meta.og || meta.cover}`;
  }
}
writeFileSync(manifestPath, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
console.log("seo-manifest og updated");

// EN cover for hotel-marketing in en page map if missing
const enPagePath = join(ROOT, "app/en/insights/[slug]/page.tsx");
let enPage = readFileSync(enPagePath, "utf8");
if (!enPage.includes('"hotel-marketing"')) {
  // already should exist from batch
}
writeFileSync(join(ROOT, "content/_seo/generated-covers.json"), `${JSON.stringify(paths, null, 2)}\n`);
