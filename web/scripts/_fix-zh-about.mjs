import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const desc =
  "認識 The KPI Plus：總部位於普吉、由創辦人帶領的酒店績效與成長夥伴，協助泰國酒店業主與商業團隊看清收益缺口、機會與優先行動。";
console.log(desc.length);

const path = join("content", "seo-manifest.json");
const pages = JSON.parse(readFileSync(path, "utf8"));
for (const page of pages) {
  if (page.route === "/zh/about-us") page.description = desc;
}
writeFileSync(path, `${JSON.stringify(pages, null, 2)}\n`, "utf8");

const md = join("content", "pages", "zh", "about-us.md");
if (existsSync(md)) {
  let text = readFileSync(md, "utf8");
  text = text.replace(/(\*\*Description:\*\*\s*)(.+)/, `$1${desc}`);
  writeFileSync(md, text, "utf8");
}
