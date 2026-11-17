import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

function walk(dir, out = [], filter = () => true) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p, out, filter);
    } else if (filter(p, name)) out.push(p);
  }
  return out;
}

// 1) Insight covers
const insightsSrc = readFileSync(join(ROOT, "lib/insights.ts"), "utf8");
const coverRe =
  /id: "([^"]+)"[\s\S]*?coverImage: "([^"]+)"[\s\S]*?coverImageStatus: "([^"]+)"/g;
const covers = [];
let m;
while ((m = coverRe.exec(insightsSrc))) {
  const [, id, img, status] = m;
  covers.push({
    id,
    img,
    status,
    exists: existsSync(join(ROOT, "public", img.replace(/^\//, ""))),
    looksPlaceholder: /placeholder/i.test(img),
  });
}

// 2) Placeholder-named files in public/
const placeholderFiles = walk(join(ROOT, "public"), [], (_p, name) =>
  /placeholder/i.test(name),
);

// 3) Code refs to /images/*placeholder* (and /media if any)
const codeFiles = walk(
  ROOT,
  [],
  (p, name) =>
    /\.(ts|tsx|js|jsx|md|json)$/.test(name) &&
    !p.includes(`${join("scripts")}`) &&
    !/\.test\./.test(name),
);
const srcHits = new Map();
const statusHits = { sample: 0, placeholder: 0, replace: 0 };
const srcRe = /["'`](\/(?:images|media)\/[^"'`]*placeholder[^"'`]*)["'`]/gi;
const statusRe = /status:\s*["'](sample|placeholder|replace)["']/g;

for (const file of codeFiles) {
  // Skip CMS editors and CRM — public-site focus
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (
    rel.startsWith("components/cms/") ||
    rel.startsWith("app/crm/") ||
    rel.startsWith("components/crm/") ||
    rel.includes(".test.")
  ) {
    continue;
  }
  const text = readFileSync(file, "utf8");
  let hit;
  while ((hit = srcRe.exec(text))) {
    const src = hit[1];
    const entry = srcHits.get(src) || { count: 0, files: new Set() };
    entry.count += 1;
    entry.files.add(rel);
    srcHits.set(src, entry);
  }
  while ((hit = statusRe.exec(text))) {
    statusHits[hit[1]] += 1;
  }
}

const referenced = [...srcHits.entries()]
  .map(([src, meta]) => ({
    src,
    count: meta.count,
    files: [...meta.files].sort(),
    exists: existsSync(join(ROOT, "public", src.replace(/^\//, ""))),
  }))
  .sort((a, b) => a.src.localeCompare(b.src));

// Group referenced placeholders by page area (from filename)
function area(src) {
  const s = src.toLowerCase();
  if (s.includes("insight")) return "insights";
  if (s.includes("hotel-systems") || s.includes("systems")) return "hotel-systems";
  if (s.includes("direct-booking")) return "direct-bookings";
  if (s.includes("hotel-ai") || s.includes("ai-automation")) return "hotel-ai";
  if (s.includes("training")) return "hotel-training";
  if (s.includes("seo")) return "hotel-seo";
  if (s.includes("meta") || s.includes("ads")) return "ads";
  if (s.includes("website")) return "hotel-website";
  if (s.includes("independent")) return "independent-hotel";
  if (s.includes("solutions")) return "solutions";
  if (s.includes("client-logo")) return "logos";
  return "other";
}

const byArea = {};
for (const row of referenced) {
  const a = area(row.src);
  byArea[a] = (byArea[a] || 0) + 1;
}

const report = {
  insightCovers: {
    total: covers.length,
    byStatus: covers.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {}),
    placeholderOrSample: covers.filter(
      (c) => c.status === "placeholder" || c.status === "sample" || !c.exists || c.looksPlaceholder,
    ),
  },
  publicPlaceholderFiles: placeholderFiles.length,
  publicSiteStatusFieldMentions: statusHits,
  uniquePlaceholderPathsReferencedInPublicCode: referenced.length,
  referencedMissing: referenced.filter((r) => !r.exists).map((r) => r.src),
  byArea,
  referenced,
};

writeFileSync(join(ROOT, "scripts/_placeholder-audit.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log("=== Insight covers ===");
console.log(`total ${report.insightCovers.total}`, report.insightCovers.byStatus);
console.log(
  "placeholder/sample/missing/named-placeholder:",
  report.insightCovers.placeholderOrSample.length,
);
for (const row of report.insightCovers.placeholderOrSample) {
  console.log(`  ${row.status} ${row.id} ${row.img}`);
}

console.log("\n=== Public assets named *placeholder* ===");
console.log(report.publicPlaceholderFiles);

console.log("\n=== Unique /images|/media *placeholder* paths referenced in public code ===");
console.log(report.uniquePlaceholderPathsReferencedInPublicCode, report.byArea);
console.log("status field mentions (public code):", report.publicSiteStatusFieldMentions);
if (report.referencedMissing.length) {
  console.log("missing refs:");
  for (const src of report.referencedMissing) console.log(" ", src);
}
console.log("\nReferenced list:");
for (const row of report.referenced) {
  console.log(`  ${row.exists ? "ok" : "MISS"} ${String(row.count).padStart(2)}x  ${row.src}`);
}
