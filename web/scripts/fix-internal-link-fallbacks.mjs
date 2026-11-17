import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DEAD_INSIGHT =
  "/insights/how-to-increase-direct-bookings-for-independent-hotels";
const LIVE_INSIGHT = "/insights/direct-booking-journey-audit";
const EN_DEAD = "/en/insights/how-to-increase-direct-bookings-for-independent-hotels";
const EN_LIVE = "/en/insights/direct-booking-journey-audit";

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".md") || name.endsWith(".ts") || name.endsWith(".tsx") || name.endsWith(".json")) {
      out.push(p);
    }
  }
  return out;
}

const roots = [join(ROOT, "content/pages"), join(ROOT, "content/seo-manifest.json")];

let filesChanged = 0;
let toolsHits = 0;
let insightHits = 0;

const files = [
  ...walk(join(ROOT, "content/pages")),
  join(ROOT, "content/seo-manifest.json"),
  join(ROOT, "lib/internal-backlinks.ts"),
  join(ROOT, "lib/insight-links.ts"),
].filter((p) => existsSync(p));

for (const file of files) {
  let text = readFileSync(file, "utf8");
  const before = text;

  // Prefixed tools → unprefixed (site rule)
  text = text.replace(/(["`(\[])\/(?:en|ru|zh)(\/tools(?:\/[a-z0-9-]*)?)/g, "$1$2");
  text = text.replace(/\]\(\/(?:en|ru|zh)(\/tools(?:\/[a-z0-9-]*)?)(#[^)]*)?\)/g, "]($1$2)");

  const toolsBefore = (before.match(/\/(?:en|ru|zh)\/tools/g) || []).length;
  const toolsAfter = (text.match(/\/(?:en|ru|zh)\/tools/g) || []).length;
  toolsHits += Math.max(0, toolsBefore - toolsAfter);

  if (text.includes(DEAD_INSIGHT) || text.includes(EN_DEAD)) {
    const c1 = (text.match(new RegExp(DEAD_INSIGHT.replace(/\//g, "\\/"), "g")) || []).length;
    const c2 = (text.match(new RegExp(EN_DEAD.replace(/\//g, "\\/"), "g")) || []).length;
    text = text.split(DEAD_INSIGHT).join(LIVE_INSIGHT);
    text = text.split(EN_DEAD).join(EN_LIVE);
    insightHits += c1 + c2;
  }

  if (text !== before) {
    writeFileSync(file, text, "utf8");
    filesChanged += 1;
  }
}

console.log(JSON.stringify({ filesChanged, toolsHits, insightHits }, null, 2));
