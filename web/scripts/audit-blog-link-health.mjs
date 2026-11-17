import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BASE = process.env.AUDIT_BASE || "http://localhost:3001";
const manifest = new Set(JSON.parse(readFileSync(join(ROOT, "content/seo-manifest.json"), "utf8")).map((p) => p.route));
const articles = JSON.parse(readFileSync(join(ROOT, "content/_seo/articles.json"), "utf8"));
const batch = new Set(articles.map((a) => a.slug));
const insightsSrc = readFileSync(join(ROOT, "lib/insights.ts"), "utf8");
const backlinksSrc = readFileSync(join(ROOT, "lib/internal-backlinks.ts"), "utf8");
const linksSrc = readFileSync(join(ROOT, "lib/insight-links.ts"), "utf8");

const insightIds = [...insightsSrc.matchAll(/^\s*id: "([^"]+)"/gm)].map((m) => m[1]);

function relatedOf(slug) {
  const start = insightsSrc.indexOf(`id: "${slug}"`);
  if (start < 0) return [];
  const next = insightsSrc.indexOf('id: "', start + 8);
  const block = insightsSrc.slice(start, next < 0 ? insightsSrc.length : next);
  return [...(block.match(/relatedArticleIds:\s*\[([^\]]*)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

function hasBacklink(route) {
  return backlinksSrc.includes(`${JSON.stringify(route)}:`);
}

function servicesOf(slug) {
  const re = new RegExp(`${JSON.stringify(slug)}: \\[([\\s\\S]*?)\\n  \\],`);
  const m = linksSrc.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/href: "([^"]+)"/g)].map((x) => x[1]);
}

function mdLinks(file) {
  const text = readFileSync(file, "utf8");
  return [...text.matchAll(/\]\((\/[^)\s#]+)(?:#[^)]*)?\)/g)]
    .map((m) => m[1])
    .filter((h) => !h.startsWith("/images/") && !h.startsWith("/media/") && !h.startsWith("/brand/"));
}

const insightMd = [];
for (const loc of ["content/pages/insights", "content/pages/en/insights"]) {
  const dir = join(ROOT, loc);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    insightMd.push({ file: `${loc}/${name}`, slug: name.replace(/\.md$/, ""), hrefs: mdLinks(join(dir, name)) });
  }
}

const report = {
  insights: insightIds.length,
  batch: batch.size,
  perInsight: [],
  brokenPageLinksInBlogs: [],
  summary: {},
};

for (const slug of insightIds) {
  const related = relatedOf(slug);
  const services = servicesOf(slug);
  const thKey = hasBacklink(`/insights/${slug}`);
  const enKey = hasBacklink(`/en/insights/${slug}`);
  const thRoute = manifest.has(`/insights/${slug}`);
  const enRoute = manifest.has(`/en/insights/${slug}`);
  report.perInsight.push({
    slug,
    related: related.length,
    services: services.length,
    backlinkTH: thKey,
    backlinkEN: enKey,
    seoTH: thRoute,
    seoEN: enRoute,
  });
}

for (const f of insightMd) {
  for (const href of f.hrefs) {
    if (!manifest.has(href) && !(href.startsWith("/tools") && manifest.has(href))) {
      // tools are unprefixed
      if (href.startsWith("/en/tools")) {
        report.brokenPageLinksInBlogs.push({ from: f.file, href, note: "tools are unprefixed; use /tools/..." });
      } else if (!manifest.has(href)) {
        report.brokenPageLinksInBlogs.push({ from: f.file, href });
      }
    }
  }
}

const live = { th: [], en: [], bad: [] };
for (const slug of batch) {
  for (const path of [`/insights/${slug}`, `/en/insights/${slug}`]) {
    try {
      const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
      if (res.status !== 200) live.bad.push({ path, status: res.status });
      else if (path.startsWith("/en/")) live.en.push(path);
      else live.th.push(path);
    } catch (e) {
      live.bad.push({ path, error: String(e.message || e) });
    }
  }
}

report.summary = {
  allHaveRelated: report.perInsight.every((r) => r.related > 0),
  allHaveServices: report.perInsight.every((r) => r.services > 0),
  allHaveBacklinkTH: report.perInsight.every((r) => r.backlinkTH),
  batchHaveBacklinkEN: report.perInsight.filter((r) => batch.has(r.slug)).every((r) => r.backlinkEN),
  batchSeoTH: [...batch].every((s) => manifest.has(`/insights/${s}`)),
  batchSeoEN: [...batch].every((s) => manifest.has(`/en/insights/${s}`)),
  brokenInBlogBodies: report.brokenPageLinksInBlogs.length,
  liveBatchOk: live.bad.length === 0,
  liveBad: live.bad,
};

console.log(JSON.stringify(report, null, 2));
