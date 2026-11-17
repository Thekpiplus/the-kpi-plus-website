import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const path = join("content", "seo-manifest.json");
const pages = JSON.parse(readFileSync(path, "utf8"));

const fixes = {
  "/zh/associations":
    "與 The KPI Plus 合作的酒店科技、教育與旅遊服務公司，用於延伸產品、專業支援與產業網絡，協助酒店經營者取得實務觀點。",
  "/zh/solutions/revenue-commercial-management":
    "從 Revenue Management 開始，再依談好的範圍擴到通路、直銷預訂、行銷與系統；協助把商業決策連成可追蹤節奏，不是只看房價。",
  "/zh/case-studies/patong-boutique-hotel-revenue":
    "普吉巴東獨立精品飯店：透過定價與商務管理，客房營收成長 12.8%，年增約 185 萬泰銖營收（以客戶核准可公開資料為準）。",
  "/zh/case-studies/patong-direct-booking-performance":
    "普吉巴東精品飯店與公寓：重建追蹤與品牌搜尋策略後，ROAS 達 17.29×（案例數字以客戶核准可公開資料為準）。",
  "/insights/hotel-marketing":
    "การตลาดโรงแรมคือการเชื่อม Google OTA Website Direct Booking Distribution และ Revenue Management ให้ผู้เข้าพักค้นพบ เปรียบเทียบ และจองได้ชัดเจน โดยไม่รับประกันยอดจอง",
};

let updated = 0;
for (const page of pages) {
  if (!fixes[page.route]) continue;
  page.description = fixes[page.route];
  updated += 1;
  const md = join("content", "pages", `${page.route.slice(1)}.md`);
  if (!existsSync(md)) continue;
  let text = readFileSync(md, "utf8");
  if (!/\*\*Description:\*\*/.test(text)) continue;
  text = text.replace(/(\*\*Description:\*\*\s*)(.+)/, `$1${page.description}`);
  writeFileSync(md, text, "utf8");
  console.log("synced", md, page.description.length);
}

writeFileSync(path, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
console.log(
  JSON.stringify(
    {
      updated,
      lengths: Object.fromEntries(Object.entries(fixes).map(([r, d]) => [r, d.length])),
    },
    null,
    2,
  ),
);
