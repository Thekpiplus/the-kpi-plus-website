/**
 * Speed / mobile / AI-readiness / sitemap audit against localhost.
 * Usage: node scripts/audit-speed-mobile-ai-sitemap.mjs [baseUrl]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.argv[2] || "http://localhost:3001";
const ROOT = process.cwd();
const SITE = "https://thekpiplus.com";
const manifest = JSON.parse(readFileSync(join(ROOT, "content/seo-manifest.json"), "utf8"));
const manifestRoutes = new Set(manifest.map((p) => p.route));

const SAMPLE = [
  "/",
  "/en",
  "/about-us",
  "/contact-us",
  "/solutions",
  "/solutions/revenue-commercial-management",
  "/solutions/hotel-direct-bookings",
  "/solutions/hotel-seo-google-maps-ai-search",
  "/insights",
  "/insights/what-is-ota",
  "/en/insights/what-is-ota",
  "/tools",
  "/tools/revpar-calculator",
  "/case-studies",
  "/ru",
  "/zh",
];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function all(html, re) {
  return [...html.matchAll(re)];
}

function jsonLdTypes(html) {
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();
  let invalid = 0;
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1]);
      const list = Array.isArray(data) ? data : [data];
      for (const item of list) {
        if (item?.["@type"]) types.add(String(item["@type"]));
        if (Array.isArray(item?.["@graph"])) {
          for (const g of item["@graph"]) if (g?.["@type"]) types.add(String(g["@type"]));
        }
      }
    } catch {
      invalid += 1;
    }
  }
  return { types: [...types], invalid, count: blocks.length };
}

async function fetchTimed(path) {
  const url = `${BASE}${path}`;
  const t0 = performance.now();
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
  });
  const buf = Buffer.from(await res.arrayBuffer());
  const ms = Math.round(performance.now() - t0);
  const html = buf.toString("utf8");
  return { path, status: res.status, ms, bytes: buf.length, html, headers: res.headers };
}

function analyzePage(page) {
  const { html, path, status, ms, bytes } = page;
  const problems = [];
  const notes = [];

  // --- Speed signals ---
  if (ms > 3000) problems.push(`slow TTFB+body ${ms}ms`);
  else if (ms > 1500) notes.push(`moderate load ${ms}ms (dev server)`);
  if (bytes > 900_000) problems.push(`heavy HTML ${Math.round(bytes / 1024)}KB`);
  else if (bytes > 450_000) notes.push(`large HTML ${Math.round(bytes / 1024)}KB`);

  const preload = all(html, /rel=["']preload["']/gi).length;
  const images = all(html, /<img\b/gi).length;
  const lazy = all(html, /loading=["']lazy["']/gi).length;
  const eager = all(html, /fetchpriority=["']high["']/gi).length;
  const unsized = all(
    html,
    /<img\b(?![^>]*(?:\bwidth=|\bheight=|style=["'][^"']*(?:width|height|aspect-ratio)))[^>]*>/gi,
  ).length;

  // --- Mobile ---
  const viewport = pick(html, /name=["']viewport["'][^>]*content=["']([^"']+)["']/i) ||
    pick(html, /content=["']([^"']+)["'][^>]*name=["']viewport["']/i);
  if (!viewport) problems.push("missing viewport");
  else {
    if (!/width\s*=\s*device-width/i.test(viewport)) problems.push("viewport missing device-width");
    if (/user-scalable\s*=\s*no/i.test(viewport) || /maximum-scale\s*=\s*1(\.0)?/i.test(viewport)) {
      problems.push("viewport blocks zoom (a11y)");
    }
  }
  const hasTouchIcon = /apple-touch-icon/i.test(html);
  const themeColor = /name=["']theme-color["']/i.test(html);

  // horizontal overflow hints: fixed widths over 100vw in inline styles (rough)
  const wideFixed = all(html, /style=["'][^"']*width:\s*(\d{4,})px/gi).length;

  // --- AI readiness ---
  const ld = jsonLdTypes(html);
  if (ld.invalid) problems.push(`${ld.invalid} invalid JSON-LD`);
  if (!ld.types.includes("Organization")) problems.push("no Organization schema");
  if (!ld.types.includes("WebSite")) problems.push("no WebSite schema");
  const hasFaq = ld.types.includes("FAQPage");
  const hasArticle = ld.types.includes("BlogPosting") || ld.types.includes("Article");
  const hasHowTo = ld.types.includes("HowTo");
  const hasBreadcrumb = ld.types.includes("BreadcrumbList");
  const hasService = ld.types.includes("Service");
  const h1 = all(html, /<h1\b/gi).length;
  if (h1 === 0) problems.push("no H1");
  if (h1 > 1) notes.push(`multiple H1 (${h1})`);
  const title = pick(html, /<title>([^<]*)<\/title>/i);
  const desc =
    pick(html, /name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    pick(html, /content=["']([^"']*)["'][^>]*name=["']description["']/i);
  if (!title) problems.push("no title");
  if (!desc) problems.push("no meta description");
  const canonical =
    pick(html, /rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    pick(html, /href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  if (!canonical) problems.push("no canonical");
  const hrefLangs = [...new Set(all(html, /hrefLang=["']([^"']+)["']/gi).map((m) => m[1]))];

  // Answer-ready: FAQ presence on commercial pages is a plus
  if (path.startsWith("/solutions") && !hasFaq) notes.push("solutions page without FAQPage schema");
  if (path.includes("/insights/") && path !== "/insights" && !hasArticle) {
    problems.push("insight without Article/BlogPosting schema");
  }

  return {
    path,
    status,
    ms,
    kb: Math.round(bytes / 1024),
    viewport: Boolean(viewport),
    themeColor,
    hasTouchIcon,
    preload,
    images,
    lazy,
    eager,
    unsizedImgsApprox: unsized,
    wideFixed,
    h1,
    title: title?.slice(0, 70),
    descLen: desc?.length || 0,
    canonical,
    hrefLangs,
    jsonLd: ld.types,
    jsonLdCount: ld.count,
    hasFaq,
    hasArticle,
    hasHowTo,
    hasBreadcrumb,
    hasService,
    problems,
    notes,
    ok: status === 200 && problems.length === 0,
  };
}

async function auditSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const xhtmlAlts = [...xml.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)].map((m) => ({
    hreflang: m[1],
    href: m[2],
  }));

  const paths = locs.map((u) => {
    try {
      return new URL(u).pathname.replace(/\/$/, "") || "/";
    } catch {
      return u;
    }
  });

  const inSitemap = new Set(paths);
  const missingFromSitemap = [...manifestRoutes].filter((r) => {
    if (r.startsWith("/admin") || r.startsWith("/crm") || r.startsWith("/partners") || r.startsWith("/login"))
      return false;
    return !inSitemap.has(r);
  });
  const extraInSitemap = paths.filter((p) => !manifestRoutes.has(p));

  // broken targets in sitemap
  const brokenAlts = [];
  for (const alt of xhtmlAlts.slice(0, 5000)) {
    try {
      const p = new URL(alt.href).pathname.replace(/\/$/, "") || "/";
      if (!manifestRoutes.has(p) && !inSitemap.has(p)) {
        brokenAlts.push({ ...alt, path: p });
      }
    } catch {
      brokenAlts.push(alt);
    }
  }

  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  return {
    status: res.status,
    urlCount: locs.length,
    xhtmlAlternateCount: xhtmlAlts.length,
    missingFromSitemap: missingFromSitemap.slice(0, 30),
    missingCount: missingFromSitemap.length,
    extraInSitemap: extraInSitemap.slice(0, 20),
    extraCount: extraInSitemap.length,
    brokenAlternateSample: brokenAlts.slice(0, 15),
    brokenAlternateCount: brokenAlts.length,
    robotsHasSitemap: /sitemap:\s*https?:\/\//i.test(robots),
    robotsDisallowsCrm: /disallow:\s*\/crm/i.test(robots),
    robotsSample: robots.split("\n").slice(0, 20),
  };
}

const pages = [];
for (const path of SAMPLE) {
  try {
    const raw = await fetchTimed(path);
    pages.push(analyzePage(raw));
  } catch (err) {
    pages.push({ path, status: 0, ok: false, problems: [String(err.message || err)], notes: [] });
  }
}

const sitemap = await auditSitemap();

const speed = {
  avgMs: Math.round(pages.filter((p) => p.ms).reduce((a, p) => a + p.ms, 0) / pages.filter((p) => p.ms).length || 0),
  maxMs: Math.max(0, ...pages.map((p) => p.ms || 0)),
  heaviest: [...pages].sort((a, b) => (b.kb || 0) - (a.kb || 0)).slice(0, 5).map((p) => ({ path: p.path, kb: p.kb, ms: p.ms })),
  slowest: [...pages].sort((a, b) => (b.ms || 0) - (a.ms || 0)).slice(0, 5).map((p) => ({ path: p.path, ms: p.ms, kb: p.kb })),
};

const mobileIssues = pages.flatMap((p) =>
  (p.problems || [])
    .filter((x) => /viewport|zoom/i.test(x))
    .map((x) => ({ path: p.path, issue: x })),
);

const aiGaps = pages
  .filter((p) => (p.problems || []).some((x) => /schema|JSON-LD|H1|Article|description|canonical|title/i.test(x)))
  .map((p) => ({ path: p.path, problems: p.problems }));

const report = {
  base: BASE,
  checkedAt: new Date().toISOString(),
  summary: {
    pagesChecked: pages.length,
    pagesOk: pages.filter((p) => p.ok).length,
    pagesWithProblems: pages.filter((p) => !p.ok).length,
    avgMs: speed.avgMs,
    maxMs: speed.maxMs,
    sitemapUrls: sitemap.urlCount,
    sitemapMissingManifest: sitemap.missingCount,
    robotsHasSitemap: sitemap.robotsHasSitemap,
  },
  speed,
  mobile: {
    allHaveViewport: pages.every((p) => p.viewport || p.status !== 200),
    themeColorPresent: pages.filter((p) => p.themeColor).length,
    issues: mobileIssues,
    notes: pages.flatMap((p) => (p.notes || []).filter((n) => /H1|HTML|load/i.test(n)).map((n) => `${p.path}: ${n}`)),
  },
  aiReadiness: {
    pagesWithOrganization: pages.filter((p) => p.jsonLd?.includes("Organization")).length,
    pagesWithFaq: pages.filter((p) => p.hasFaq).length,
    insightsWithArticle: pages.filter((p) => p.path.includes("/insights/") && p.path !== "/insights" && p.hasArticle).length,
    gaps: aiGaps,
  },
  sitemap,
  pages,
};

writeFileSync(join(ROOT, "scripts/_speed-mobile-ai-sitemap.json"), `${JSON.stringify(report, null, 2)}\n`);

console.log("=== SUMMARY ===");
console.log(JSON.stringify(report.summary, null, 2));
console.log("\n=== SPEED ===");
console.log("slowest", report.speed.slowest);
console.log("heaviest", report.speed.heaviest);
console.log("\n=== MOBILE ===");
console.log(JSON.stringify(report.mobile, null, 2));
console.log("\n=== AI READINESS ===");
console.log(JSON.stringify(report.aiReadiness, null, 2));
console.log("\n=== SITEMAP ===");
console.log(
  JSON.stringify(
    {
      urlCount: sitemap.urlCount,
      xhtmlAlternateCount: sitemap.xhtmlAlternateCount,
      missingCount: sitemap.missingCount,
      missingFromSitemap: sitemap.missingFromSitemap,
      extraCount: sitemap.extraCount,
      brokenAlternateCount: sitemap.brokenAlternateCount,
      brokenAlternateSample: sitemap.brokenAlternateSample,
      robotsHasSitemap: sitemap.robotsHasSitemap,
      robotsDisallowsCrm: sitemap.robotsDisallowsCrm,
    },
    null,
    2,
  ),
);
console.log("\n=== PAGE PROBLEMS ===");
for (const p of pages.filter((x) => !x.ok)) {
  console.log(p.path, p.problems);
}
