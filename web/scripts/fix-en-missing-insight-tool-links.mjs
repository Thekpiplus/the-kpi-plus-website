import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "content/pages");
const missingEnInsights = [
  "hotel-revenue-meetings-that-lead-to-decisions",
  "hotel-technology-adoption-commercial-project",
  "direct-booking-journey-audit",
  "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
];

function walk(d, out = []) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (n.endsWith(".md")) out.push(p);
  }
  return out;
}

let filesChanged = 0;
let hits = 0;
for (const file of walk(ROOT)) {
  let text = readFileSync(file, "utf8");
  const before = text;
  text = text.replaceAll("/en/tools/", "/tools/");
  text = text.replaceAll("](/en/tools)", "](/tools)");
  text = text.replaceAll("(/en/tools)", "(/tools)");
  for (const slug of missingEnInsights) {
    const from = `/en/insights/${slug}`;
    const to = `/insights/${slug}`;
    if (text.includes(from)) {
      const count = text.split(from).length - 1;
      hits += count;
      text = text.replaceAll(from, to);
    }
  }
  if (text !== before) {
    writeFileSync(file, text);
    filesChanged += 1;
  }
}
console.log(JSON.stringify({ filesChanged, insightLinkRewrites: hits }));
