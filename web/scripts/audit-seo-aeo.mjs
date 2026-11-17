import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SITE = "https://thekpiplus.com";
const pages = JSON.parse(readFileSync(join(ROOT, "content/seo-manifest.json"), "utf8"));
const byRoute = new Map(pages.map((p) => [p.route, p]));

function walkMd(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMd(p, out);
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function pathFromCanonical(url) {
  try {
    return new URL(url, SITE).pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
}

function localOgPath(ogImage) {
  if (!ogImage) return null;
  try {
    const u = new URL(ogImage, SITE);
    if (!u.hostname.includes("thekpiplus.com") && u.hostname !== "localhost") return null;
    return u.pathname;
  } catch {
    return ogImage.startsWith("/") ? ogImage : null;
  }
}

const issues = {
  missingTitle: [],
  missingDescription: [],
  shortTitle: [],
  longTitle: [],
  shortDescription: [],
  longDescription: [],
  missingCanonical: [],
  canonicalMismatch: [],
  missingAlternates: [],
  brokenAlternateTargets: [],
  missingSelfHreflang: [],
  missingThaiInAlternates: [],
  missingOgImage: [],
  missingOgFile: [],
  duplicateRoutes: [],
  mdWithoutManifest: [],
  manifestWithoutMdHint: [],
};

const seenRoutes = new Map();
for (const page of pages) {
  if (seenRoutes.has(page.route)) issues.duplicateRoutes.push(page.route);
  seenRoutes.set(page.route, (seenRoutes.get(page.route) || 0) + 1);

  const title = (page.title || "").trim();
  const desc = (page.description || "").trim();
  if (!title) issues.missingTitle.push(page.route);
  else {
    if (title.length < 20) issues.shortTitle.push({ route: page.route, len: title.length, title });
    if (title.length > 70) issues.longTitle.push({ route: page.route, len: title.length, title });
  }
  if (!desc) issues.missingDescription.push(page.route);
  else {
    // CJK packs more meaning per character; use a lower floor for Chinese-majority copy.
    const cjk = (desc.match(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
    const cjkHeavy = cjk / desc.length >= 0.4;
    const minDesc = cjkHeavy ? 55 : 70;
    const maxDesc = cjkHeavy ? 120 : 170;
    if (desc.length < minDesc) issues.shortDescription.push({ route: page.route, len: desc.length, minDesc });
    if (desc.length > maxDesc) issues.longDescription.push({ route: page.route, len: desc.length, maxDesc });
  }

  if (!page.canonical) issues.missingCanonical.push(page.route);
  else {
    const canPath = pathFromCanonical(page.canonical);
    if (canPath !== page.route) {
      issues.canonicalMismatch.push({ route: page.route, canonical: page.canonical, canPath });
    }
  }

  const alts = page.alternates || [];
  if (!alts.length) issues.missingAlternates.push(page.route);

  const selfLang = page.language === "zh-Hant" ? "zh" : page.language;
  const selfAlt = alts.find((a) => a.hreflang === selfLang || a.hreflang === page.language);
  if (!selfAlt) issues.missingSelfHreflang.push(page.route);
  if (!alts.some((a) => a.hreflang === "th")) issues.missingThaiInAlternates.push(page.route);

  for (const alt of alts) {
    const path = pathFromCanonical(alt.href);
    if (!path || !byRoute.has(path)) {
      issues.brokenAlternateTargets.push({
        route: page.route,
        hreflang: alt.hreflang,
        href: alt.href,
        path,
      });
    }
  }

  if (!page.ogImage) issues.missingOgImage.push(page.route);
  else {
    const local = localOgPath(page.ogImage);
    if (local && !existsSync(join(ROOT, "public", local.replace(/^\//, "")))) {
      issues.missingOgFile.push({ route: page.route, ogImage: page.ogImage, local });
    }
  }
}

// Markdown route coverage (content pages)
const mdRoutes = new Set();
for (const file of walkMd(join(ROOT, "content/pages"))) {
  const text = readFileSync(file, "utf8");
  const m = text.match(/^#\s+(\/[^\s]+)/m);
  if (m) mdRoutes.add(m[1]);
}
for (const route of mdRoutes) {
  if (!byRoute.has(route)) issues.mdWithoutManifest.push(route);
}

// Insights: every published insight should have TH (+ EN when md exists)
const insightsTs = readFileSync(join(ROOT, "lib/insights.ts"), "utf8");
const insightIds = [...insightsTs.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
const insightSeo = {
  missingTh: [],
  missingEnWhenMd: [],
  thWithoutEnAlternate: [],
};
for (const id of insightIds) {
  const th = `/insights/${id}`;
  const en = `/en/insights/${id}`;
  if (!byRoute.has(th)) insightSeo.missingTh.push(th);
  const enMd = existsSync(join(ROOT, "content/pages/en/insights", `${id}.md`));
  if (enMd && !byRoute.has(en)) insightSeo.missingEnWhenMd.push(en);
  if (byRoute.has(th)) {
    const page = byRoute.get(th);
    const hasEnAlt = (page.alternates || []).some((a) => a.hreflang === "en");
    if (enMd && !hasEnAlt) insightSeo.thWithoutEnAlternate.push(th);
  }
}

const summary = {
  totals: {
    manifestRoutes: pages.length,
    byLanguage: pages.reduce((acc, p) => {
      acc[p.language] = (acc[p.language] || 0) + 1;
      return acc;
    }, {}),
    markdownRoutes: mdRoutes.size,
    insightIds: insightIds.length,
  },
  issueCounts: Object.fromEntries(
    Object.entries(issues).map(([k, v]) => [k, Array.isArray(v) ? v.length : v]),
  ),
  insightSeo,
  issues,
};

writeFileSync(join(ROOT, "scripts/_seo-aeo-audit.json"), `${JSON.stringify(summary, null, 2)}\n`);

console.log("=== SEO/AEO manifest audit ===");
console.log("routes", summary.totals.manifestRoutes, summary.totals.byLanguage);
console.log("markdown routes", summary.totals.markdownRoutes);
console.log("\nIssue counts:");
for (const [k, n] of Object.entries(summary.issueCounts)) {
  if (n) console.log(`  ${k}: ${n}`);
}
console.log("\nInsight SEO:");
console.log(JSON.stringify(insightSeo, null, 2));

function preview(label, arr, mapFn = (x) => (typeof x === "string" ? x : JSON.stringify(x))) {
  if (!arr?.length) return;
  console.log(`\n${label} (showing up to 12 of ${arr.length}):`);
  for (const item of arr.slice(0, 12)) console.log(" ", mapFn(item));
}

preview("brokenAlternateTargets", issues.brokenAlternateTargets);
preview("missingOgFile", issues.missingOgFile);
preview("canonicalMismatch", issues.canonicalMismatch);
preview("mdWithoutManifest", issues.mdWithoutManifest);
preview("longTitle", issues.longTitle, (x) => `${x.len} ${x.route}`);
preview("shortDescription", issues.shortDescription, (x) => `${x.len} ${x.route}`);
preview("longDescription", issues.longDescription, (x) => `${x.len} ${x.route}`);
