/**
 * Live SEO/AEO HTML checks against localhost.
 * Usage: node scripts/audit-seo-aeo-live.mjs [baseUrl]
 */
const BASE = process.argv[2] || "http://localhost:3001";

const SAMPLE = [
  "/",
  "/en",
  "/about-us",
  "/en/about-us",
  "/contact-us",
  "/solutions",
  "/solutions/revenue-commercial-management",
  "/solutions/hotel-direct-bookings",
  "/solutions/hotel-seo-google-maps-ai-search",
  "/solutions/hotel-ai-automation",
  "/hotel-seo-local-search",
  "/insights",
  "/insights/what-is-ota",
  "/en/insights/what-is-ota",
  "/insights/hotel-revenue-meetings-that-lead-to-decisions",
  "/en/insights/hotel-revenue-meetings-that-lead-to-decisions",
  "/insights/direct-booking-journey-audit",
  "/en/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on",
  "/case-studies",
  "/tools",
  "/robots.txt",
  "/sitemap.xml",
];

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function all(html, re) {
  return [...html.matchAll(re)].map((m) => m[0]);
}

function jsonLdTypes(html) {
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const types = new Set();
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1]);
      const list = Array.isArray(data) ? data : [data];
      for (const item of list) {
        if (item?.["@type"]) types.add(item["@type"]);
        if (Array.isArray(item?.["@graph"])) {
          for (const g of item["@graph"]) if (g?.["@type"]) types.add(g["@type"]);
        }
      }
    } catch {
      types.add("INVALID_JSON_LD");
    }
  }
  return [...types];
}

const rows = [];
for (const path of SAMPLE) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const status = res.status;
    const ctype = res.headers.get("content-type") || "";
    let html = "";
    if (ctype.includes("text") || ctype.includes("xml") || ctype.includes("json")) {
      html = await res.text();
    }
    if (path === "/robots.txt" || path === "/sitemap.xml") {
      rows.push({
        path,
        status,
        ok: status === 200,
        notes:
          path === "/robots.txt"
            ? html.includes("sitemap")
              ? "has sitemap directive"
              : "missing sitemap directive"
            : `sitemap urls≈${(html.match(/<loc>/g) || []).length}`,
      });
      continue;
    }

    const title = pick(html, /<title>([^<]*)<\/title>/i);
    const canonical = pick(html, /rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
      pick(html, /href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
    const desc = pick(html, /name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      pick(html, /content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const robots = pick(html, /name=["']robots["'][^>]*content=["']([^"']*)["']/i);
    const ogImage = pick(html, /property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      pick(html, /content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    const hrefLangs = [...html.matchAll(/rel=["']alternate["'][^>]*hrefLang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi)].map(
      (m) => m[1],
    );
    if (!hrefLangs.length) {
      // Next may serialize differently
      hrefLangs.push(
        ...[...html.matchAll(/hrefLang=["']([^"']+)["']/gi)].map((m) => m[1]),
      );
    }
    const types = jsonLdTypes(html);
    const problems = [];
    if (status !== 200) problems.push(`status ${status}`);
    if (!title) problems.push("no title");
    if (!desc) problems.push("no description");
    if (!canonical) problems.push("no canonical");
    if (!ogImage) problems.push("no og:image");
    if (!hrefLangs.includes("th") && !hrefLangs.includes("x-default")) problems.push("no th/x-default hreflang");
    if (!types.includes("Organization")) problems.push("no Organization JSON-LD");
    if (!types.includes("WebSite")) problems.push("no WebSite JSON-LD");
    if (!types.includes("WebPage") && !types.includes("AboutPage") && !types.includes("ContactPage") && !types.includes("CollectionPage") && !types.includes("Article")) {
      problems.push("no WebPage/Article JSON-LD");
    }

    rows.push({
      path,
      status,
      title: title?.slice(0, 70),
      canonical,
      descLen: desc?.length || 0,
      hrefLangs: [...new Set(hrefLangs)],
      jsonLd: types,
      robots,
      ogImage: Boolean(ogImage),
      problems,
      ok: problems.length === 0,
    });
  } catch (err) {
    rows.push({ path, status: 0, ok: false, problems: [String(err.message || err)] });
  }
}

const failed = rows.filter((r) => !r.ok);
console.log(JSON.stringify({ base: BASE, checked: rows.length, failed: failed.length, rows }, null, 2));
process.exitCode = failed.length ? 1 : 0;
