import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const path = join("content", "seo-manifest.json");
const pages = JSON.parse(readFileSync(path, "utf8"));

const fixes = {
  "/zh/hotel-seo-local-search":
    "了解酒店 SEO、本地搜尋資訊、Google 商家資料準備度與網站可發現性，協助客人先找到正確事實，再往詢問、比較價格或訂房的下一步前進。",
  "/zh/case-studies/patong-boutique-hotel-revenue":
    "普吉巴東獨立精品飯店案例：透過定價與商務管理，客房營收成長 12.8%，年增約 185 萬泰銖營收；相關數字均以客戶核准可公開資料為準。",
  "/zh/case-studies/patong-direct-booking-performance":
    "普吉巴東精品飯店與公寓案例：重建追蹤與品牌搜尋策略之後，ROAS 達 17.29×；相關成果數字均以客戶核准可公開資料為準。",
};

for (const [route, desc] of Object.entries(fixes)) console.log(desc.length, route);

for (const page of pages) {
  if (!fixes[page.route]) continue;
  page.description = fixes[page.route];
  const md = join("content", "pages", `${page.route.slice(1)}.md`);
  if (!existsSync(md)) continue;
  let text = readFileSync(md, "utf8");
  if (!/\*\*Description:\*\*/.test(text)) continue;
  text = text.replace(/(\*\*Description:\*\*\s*)(.+)/, `$1${page.description}`);
  writeFileSync(md, text, "utf8");
}

writeFileSync(path, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
