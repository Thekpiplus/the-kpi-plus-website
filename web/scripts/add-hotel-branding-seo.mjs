import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const manifestPath = join("content", "seo-manifest.json");
const pages = JSON.parse(readFileSync(manifestPath, "utf8"));

const th = {
  route: "/insights/hotel-branding",
  language: "th",
  title: "การสร้างแบรนด์โรงแรม 2569: ให้แขกจำได้และจอง | The KPI Plus",
  description:
    "การสร้างแบรนด์โรงแรมปี 2569: เลือกกลุ่มแขก เขียนคำสัญญาที่ตรวจสอบได้ ทำข้อมูลให้ตรงทุกช่องทาง ตั้งราคาให้สอดคล้อง และใช้รีวิวตรวจผล",
  canonical: "https://thekpiplus.com/insights/hotel-branding",
  alternates: [
    { hreflang: "th", href: "https://thekpiplus.com/insights/hotel-branding" },
    { hreflang: "en", href: "https://thekpiplus.com/en/insights/hotel-branding" },
  ],
  ogImage: "https://thekpiplus.com/images/blog/hotel-branding/th/og.webp",
  ogUrl: "https://thekpiplus.com/insights/hotel-branding",
};

const en = {
  route: "/en/insights/hotel-branding",
  language: "en",
  title: "Hotel Branding 2026: Be Remembered and Booked | The KPI Plus",
  description:
    "Hotel branding for 2026: choose your guests, write a promise you can prove, keep every channel consistent, price to match, and use reviews to check the result.",
  canonical: "https://thekpiplus.com/en/insights/hotel-branding",
  alternates: [
    { hreflang: "th", href: "https://thekpiplus.com/insights/hotel-branding" },
    { hreflang: "en", href: "https://thekpiplus.com/en/insights/hotel-branding" },
  ],
  ogImage: "https://thekpiplus.com/images/blog/hotel-branding/en/og.webp",
  ogUrl: "https://thekpiplus.com/en/insights/hotel-branding",
};

function upsert(entry) {
  const idx = pages.findIndex((p) => p.route === entry.route);
  if (idx >= 0) pages[idx] = entry;
  else {
    const after = pages.findIndex((p) => p.route === "/insights/hotel-marketing");
    if (after >= 0) pages.splice(after + 1, 0, entry);
    else pages.push(entry);
  }
}

upsert(th);
upsert(en);
writeFileSync(manifestPath, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
console.log("seo-manifest updated; total", pages.length);

mkdirSync(join("content", "_seo"), { recursive: true });
const articlesPath = join("content", "_seo", "articles.json");
let articles = [];
try {
  articles = JSON.parse(readFileSync(articlesPath, "utf8"));
  if (!Array.isArray(articles)) articles = [];
} catch {
  articles = [];
}
const packageArticle = JSON.parse(readFileSync(join(".tmp-blog-import", "seo", "articles.json"), "utf8"));
const aIdx = articles.findIndex((a) => a.slug === packageArticle.slug);
if (aIdx >= 0) articles[aIdx] = packageArticle;
else articles.push(packageArticle);
writeFileSync(articlesPath, `${JSON.stringify(articles, null, 2)}\n`, "utf8");
console.log("articles.json entries", articles.length);
