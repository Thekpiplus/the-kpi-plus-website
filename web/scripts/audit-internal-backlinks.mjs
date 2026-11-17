/**
 * Audit internal links: blog markdown, relatedArticleIds, insight-links, internal-backlinks, seo-manifest.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BASE = process.env.AUDIT_BASE || "http://localhost:3001";

const manifest = JSON.parse(readFileSync(join(ROOT, "content/seo-manifest.json"), "utf8"));
const routes = new Set(manifest.map((p) => p.route));
const articles = JSON.parse(readFileSync(join(ROOT, "content/_seo/articles.json"), "utf8"));
const articleSlugs = new Set(articles.map((a) => a.slug));

const insightsSrc = readFileSync(join(ROOT, "lib/insights.ts"), "utf8");
const insightIds = [...insightsSrc.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
const publishedSlugs = new Set(insightIds);

function extractRelated(src) {
  const map = new Map();
  const blocks = src.split(/\{\s*\n\s*id: "/).slice(1);
  for (const block of blocks) {
    const id = block.match(/^([^"]+)"/)?.[1];
    if (!id) continue;
    const related = [...(block.match(/relatedArticleIds:\s*\[([^\]]*)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map(
      (m) => m[1],
    );
    map.set(id, related);
  }
  return map;
}
const relatedMap = extractRelated(insightsSrc);

function parseInsightLinks() {
  const src = readFileSync(join(ROOT, "lib/insight-links.ts"), "utf8");
  const map = new Map();
  const re = /"([^"]+)":\s*\[([\s\S]*?)\],/g;
  let m;
  while ((m = re.exec(src))) {
    const slug = m[1];
    if (!publishedSlugs.has(slug) && !articleSlugs.has(slug)) continue;
    const hrefs = [...m[2].matchAll(/href:\s*"([^"]+)"/g)].map((x) => x[1]);
    map.set(slug, hrefs);
  }
  return map;
}
const serviceMap = parseInsightLinks();

function parseInternalBacklinks() {
  const src = readFileSync(join(ROOT, "lib/internal-backlinks.ts"), "utf8");
  const map = new Map();
  const re = /"(\/[^"]+)":\s*\[([\s\S]*?)\],/g;
  let m;
  while ((m = re.exec(src))) {
    const route = m[1];
    const hrefs = [...m[2].matchAll(/href:\s*"([^"]+)"/g)].map((x) => x[1]);
    map.set(route, hrefs);
  }
  return map;
}
const backlinkMap = parseInternalBacklinks();

function collectMdLinks(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".md")) {
        const text = readFileSync(p, "utf8");
        const hrefs = [...text.matchAll(/\]\((\/[^)\s#]+)(?:#[^)]*)?\)/g)].map((m) => m[1]);
        out.push({ file: p.replace(ROOT + "\\", "").replace(ROOT + "/", ""), hrefs });
      }
    }
  }
  walk(dir);
  return out;
}

const mdFiles = [
  ...collectMdLinks(join(ROOT, "content/pages/insights")),
  ...collectMdLinks(join(ROOT, "content/pages/en/insights")),
];

function normalize(href) {
  if (!href) return href;
  let h = href.split("#")[0].split("?")[0];
  if (h.length > 1 && h.endsWith("/")) h = h.slice(0, -1);
  return h;
}

function routeExists(href) {
  const h = normalize(href);
  if (!h || !h.startsWith("/")) return { ok: false, reason: "external-or-empty" };
  if (routes.has(h)) return { ok: true, via: "manifest" };
  // tools sometimes unprefixed
  if (h.startsWith("/en/") && routes.has(h.slice(3))) return { ok: true, via: "manifest-th-fallback" };
  if (!h.startsWith("/en/") && routes.has(`/en${h}`)) return { ok: true, via: "en-exists-th-missing" };
  // insight slug known even if only one locale in manifest
  const insight = h.match(/^\/(?:en\/)?insights\/([^/]+)$/);
  if (insight && publishedSlugs.has(insight[1])) {
    return { ok: routes.has(h), via: routes.has(h) ? "manifest" : "insight-listed-no-seo-route" };
  }
  return { ok: false, reason: "missing" };
}

const broken = [];
const warnings = [];

function check(href, from) {
  const r = routeExists(href);
  if (!r.ok) broken.push({ from, href: normalize(href), reason: r.reason || "missing" });
  else if (r.via === "insight-listed-no-seo-route" || r.via === "en-exists-th-missing") {
    warnings.push({ from, href: normalize(href), via: r.via });
  }
}

// Markdown body links
for (const f of mdFiles) {
  for (const href of f.hrefs) check(href, f.file);
}

// relatedArticleIds
for (const [slug, related] of relatedMap) {
  for (const id of related) {
    if (!publishedSlugs.has(id)) broken.push({ from: `insights.ts:${slug}.related`, href: `/insights/${id}`, reason: "unknown-insight" });
    else {
      check(`/insights/${id}`, `related:${slug}`);
      // EN counterpart for batch articles
      if (articleSlugs.has(id)) check(`/en/insights/${id}`, `related-en:${slug}`);
    }
  }
}

// service links
for (const [slug, hrefs] of serviceMap) {
  for (const href of hrefs) check(href, `insight-links:${slug}`);
}

// internal-backlinks map
for (const [route, hrefs] of backlinkMap) {
  check(route, `backlinks-key`);
  for (const href of hrefs) check(href, `backlinks:${route}`);
}

// Coverage: each batch article should have inbound from at least one other article (related or markdown)
const inbound = new Map([...publishedSlugs].map((s) => [s, new Set()]));
for (const [slug, related] of relatedMap) {
  for (const id of related) inbound.get(id)?.add(slug);
}
for (const f of mdFiles) {
  const fromSlug = f.file.match(/insights[\\/]([^\\/]+)\.md$/)?.[1];
  for (const href of f.hrefs) {
    const m = normalize(href).match(/^\/(?:en\/)?insights\/([^/]+)$/);
    if (m && fromSlug && m[1] !== fromSlug) inbound.get(m[1])?.add(fromSlug);
  }
}

const noInbound = [...articleSlugs].filter((s) => (inbound.get(s)?.size || 0) === 0);
const noRelated = [...articleSlugs].filter((s) => !(relatedMap.get(s)?.length > 0));
const noServices = [...articleSlugs].filter((s) => !(serviceMap.get(s)?.length > 0));
const noBacklinkEntry = [...articleSlugs].filter(
  (s) => !backlinkMap.has(`/insights/${s}`) && !backlinkMap.has(`/en/insights/${s}`),
);

// Blog↔blog graph density
const blogToBlog = [];
for (const [slug, related] of relatedMap) {
  if (!articleSlugs.has(slug) && !publishedSlugs.has(slug)) continue;
  for (const id of related) {
    if (publishedSlugs.has(id)) blogToBlog.push(`${slug} → ${id}`);
  }
}

const summary = {
  routesInManifest: routes.size,
  insightPosts: publishedSlugs.size,
  batchArticles: articleSlugs.size,
  mdFilesChecked: mdFiles.length,
  mdLinkCount: mdFiles.reduce((n, f) => n + f.hrefs.length, 0),
  relatedEdges: blogToBlog.length,
  broken: broken.length,
  warnings: warnings.length,
  coverage: {
    batchNoInboundFromOtherBlogs: noInbound,
    batchNoRelatedIds: noRelated,
    batchNoServiceLinks: noServices,
    batchNoBacklinkMapEntry: noBacklinkEntry,
  },
};

console.log(JSON.stringify({ summary, broken: broken.slice(0, 80), warnings: warnings.slice(0, 40), sampleEdges: blogToBlog.slice(0, 30) }, null, 2));

// Optional live HTTP check for broken-looking insight URLs
const toProbe = [
  ...new Set(
    [
      ...[...articleSlugs].map((s) => `/insights/${s}`),
      ...[...articleSlugs].map((s) => `/en/insights/${s}`),
      ...broken.map((b) => b.href).filter((h) => h.startsWith("/")),
    ].slice(0, 80),
  ),
];

async function probe(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { method: "GET", redirect: "manual" });
    return { path, status: res.status };
  } catch (e) {
    return { path, status: 0, error: String(e.message || e) };
  }
}

const live = [];
for (const p of toProbe) live.push(await probe(p));
const badLive = live.filter((x) => x.status !== 200 && x.status !== 308 && x.status !== 301);
console.log(JSON.stringify({ liveChecked: live.length, badLive }, null, 2));
