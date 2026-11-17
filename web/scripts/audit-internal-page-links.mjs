import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BASE = process.env.AUDIT_BASE || "http://localhost:3001";
const manifest = JSON.parse(readFileSync(join(ROOT, "content/seo-manifest.json"), "utf8"));
const routes = new Set(manifest.map((p) => p.route));
const articles = JSON.parse(readFileSync(join(ROOT, "content/_seo/articles.json"), "utf8"));
const articleSlugs = new Set(articles.map((a) => a.slug));
const insightsSrc = readFileSync(join(ROOT, "lib/insights.ts"), "utf8");
const insightIds = [...insightsSrc.matchAll(/^\s*id: "([^"]+)"/gm)].map((m) => m[1]);
const published = new Set(insightIds);

function norm(h) {
  if (!h) return h;
  let x = h.split("#")[0].split("?")[0];
  if (x.length > 1 && x.endsWith("/")) x = x.slice(0, -1);
  return x;
}

function isPageLink(h) {
  const x = norm(h);
  if (!x?.startsWith("/")) return false;
  if (x.startsWith("/images/") || x.startsWith("/media/") || x.startsWith("/brand/") || x.startsWith("/_next/"))
    return false;
  if (/\.(webp|png|jpg|jpeg|gif|svg|pdf|css|js)$/i.test(x)) return false;
  return true;
}

function existsRoute(h) {
  const x = norm(h);
  if (routes.has(x)) return true;
  // known published insight even if SEO entry somehow missing
  const m = x.match(/^\/(?:en\/)?insights\/([^/]+)$/);
  if (m && published.has(m[1])) return routes.has(x);
  return false;
}

function walkMd(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkMd(p, acc);
    else if (name.endsWith(".md")) {
      const text = readFileSync(p, "utf8");
      const hrefs = [...text.matchAll(/\]\((\/[^)\s]+)(?:#[^)]*)?\)/g)].map((m) => m[1]).filter(isPageLink);
      acc.push({
        file: p.replace(/\\/g, "/").replace(ROOT.replace(/\\/g, "/") + "/", ""),
        hrefs: [...new Set(hrefs.map(norm))],
      });
    }
  }
  return acc;
}

const md = [
  ...walkMd(join(ROOT, "content/pages/insights")),
  ...walkMd(join(ROOT, "content/pages/en/insights")),
  ...walkMd(join(ROOT, "content/pages"), []).filter((f) => !f.file.includes("/insights/")),
];

// related
const related = new Map();
{
  let i = 0;
  while (i < insightsSrc.length) {
    const start = insightsSrc.indexOf('id: "', i);
    if (start < 0) break;
    const id = insightsSrc.slice(start + 5).match(/^"([^"]+)"/)?.[1];
    const next = insightsSrc.indexOf('id: "', start + 5);
    const block = insightsSrc.slice(start, next < 0 ? insightsSrc.length : next);
    const ids = [...(block.match(/relatedArticleIds:\s*\[([^\]]*)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map(
      (m) => m[1],
    );
    if (id) related.set(id, ids);
    i = start + 5;
  }
}

const services = new Map();
{
  const src = readFileSync(join(ROOT, "lib/insight-links.ts"), "utf8");
  const re = /"([^"]+)":\s*\[([\s\S]*?)\n  \],/g;
  let m;
  while ((m = re.exec(src))) {
    services.set(
      m[1],
      [...m[2].matchAll(/href:\s*"([^"]+)"/g)].map((x) => norm(x[1])),
    );
  }
}

const backlinks = new Map();
{
  const src = readFileSync(join(ROOT, "lib/internal-backlinks.ts"), "utf8");
  const re = /"(\/[^"]+)":\s*\[([\s\S]*?)\n  \],/g;
  let m;
  while ((m = re.exec(src))) {
    backlinks.set(
      m[1],
      [...m[2].matchAll(/href:\s*"([^"]+)"/g)].map((x) => norm(x[1])),
    );
  }
}

const broken = [];
function check(href, from) {
  if (!isPageLink(href)) return;
  if (!existsRoute(href)) broken.push({ from, href: norm(href) });
}

for (const f of md) for (const h of f.hrefs) check(h, f.file);
for (const [slug, ids] of related) {
  for (const id of ids) {
    check(`/insights/${id}`, `related:${slug}`);
    if (articleSlugs.has(id) || routes.has(`/en/insights/${id}`)) check(`/en/insights/${id}`, `related-en:${slug}`);
  }
}
for (const [slug, hrefs] of services) for (const h of hrefs) check(h, `services:${slug}`);
for (const [route, hrefs] of backlinks) {
  check(route, "backlink-key");
  for (const h of hrefs) check(h, `backlinks:${route}`);
}

// inbound graph among blogs
const inbound = new Map([...published].map((s) => [s, new Set()]));
for (const [slug, ids] of related) for (const id of ids) inbound.get(id)?.add(`related:${slug}`);
for (const f of md) {
  const from = f.file.match(/insights\/([^/]+)\.md$/)?.[1];
  if (!from) continue;
  for (const h of f.hrefs) {
    const m = h.match(/^\/(?:en\/)?insights\/([^/]+)$/);
    if (m && m[1] !== from) inbound.get(m[1])?.add(`md:${from}`);
  }
}

const coverage = {
  insightsMissingBacklinkKeyTH: [...published].filter((s) => !backlinks.has(`/insights/${s}`)),
  insightsMissingBacklinkKeyEN: [...articleSlugs].filter((s) => !backlinks.has(`/en/insights/${s}`)),
  insightsNoRelated: [...published].filter((s) => !(related.get(s)?.length > 0)),
  insightsNoServices: [...published].filter((s) => !(services.get(s)?.length > 0)),
  batchNoInbound: [...articleSlugs].filter((s) => (inbound.get(s)?.size || 0) === 0),
};

// unique broken
const uniqBroken = [...new Map(broken.map((b) => [`${b.from}|${b.href}`, b])).values()];

console.log(
  JSON.stringify(
    {
      counts: {
        manifestRoutes: routes.size,
        insights: published.size,
        batch: articleSlugs.size,
        mdPageLinks: md.reduce((n, f) => n + f.hrefs.length, 0),
        relatedEdges: [...related.values()].reduce((n, a) => n + a.length, 0),
        backlinkKeys: backlinks.size,
        brokenUnique: uniqBroken.length,
      },
      coverage,
      broken: uniqBroken.slice(0, 60),
      inboundSample: Object.fromEntries(
        [...articleSlugs].slice(0, 8).map((s) => [s, [...(inbound.get(s) || [])]]),
      ),
    },
    null,
    2,
  ),
);

const probe = [
  ...[...articleSlugs].flatMap((s) => [`/insights/${s}`, `/en/insights/${s}`]),
  ...uniqBroken.map((b) => b.href).filter((h) => h.startsWith("/insights") || h.startsWith("/en/insights") || h.startsWith("/solutions") || h.startsWith("/tools") || h.startsWith("/hotel")),
];
const bad = [];
for (const p of [...new Set(probe)]) {
  try {
    const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
    if (![200, 301, 308].includes(res.status)) bad.push({ p, status: res.status });
  } catch (e) {
    bad.push({ p, status: 0, error: String(e.message || e) });
  }
}
console.log(JSON.stringify({ probed: [...new Set(probe)].length, badLive: bad }, null, 2));
