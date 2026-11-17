import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const pages = JSON.parse(readFileSync("content/seo-manifest.json", "utf8"));
const short = pages.filter(
  (p) => (p.description || "").length < 70 && (p.route.startsWith("/zh") || p.route.startsWith("/ru")),
);

for (const p of short) {
  const rel = `${p.route.replace(/^\//, "")}.md`;
  const file = join("content/pages", rel);
  let mdDesc = "";
  let lead = "";
  if (existsSync(file)) {
    const t = readFileSync(file, "utf8");
    mdDesc = (t.match(/\*\*Description:\*\*\s*(.+)/) || [])[1] || "";
    const main = t.split("### MAIN")[1] || "";
    const paras = [...main.matchAll(/^[^\n#][^\n]{40,}/gm)]
      .map((m) => m[0].trim())
      .filter((x) => !/^(The KPI Plus|Hotel |Vision|Mission)/.test(x));
    lead = (paras[0] || "").slice(0, 200);
  }
  console.log("ROUTE", p.route);
  console.log(" MAN", p.description.length, p.description);
  console.log(" MD ", mdDesc.length, mdDesc);
  console.log(" LEAD", lead.length, lead);
  console.log("");
}
