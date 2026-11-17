import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "content/pages");
const slugs = [
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
  // Only restore EN-facing content (en/, ru/, zh/ often share EN insight URLs)
  const rel = file.replace(/\\/g, "/");
  if (!/\/(en|ru|zh)\//.test(rel)) continue;
  let text = readFileSync(file, "utf8");
  const before = text;
  for (const slug of slugs) {
    const from = `/insights/${slug}`;
    const to = `/en/insights/${slug}`;
    // Avoid double-prefixing already-EN links
    const re = new RegExp(`(?<!/en)/insights/${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g");
    const next = text.replace(re, to);
    if (next !== text) {
      hits += (text.match(re) || []).length;
      text = next;
    }
  }
  if (text !== before) {
    writeFileSync(file, text);
    filesChanged += 1;
  }
}
console.log(JSON.stringify({ filesChanged, hits }));
