import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const articles = JSON.parse(readFileSync(join(ROOT, "content/_seo/articles.json"), "utf8"));
const batch = JSON.parse(readFileSync(join(ROOT, "content/_seo/blog-batch-posts.json"), "utf8"));
const insightsSrc = readFileSync(join(ROOT, "lib/insights.ts"), "utf8");
const path = join(ROOT, "lib/internal-backlinks.ts");
let s = readFileSync(path, "utf8");

function kindFor(href) {
  if (href.startsWith("/tools")) return "tool";
  if (href.startsWith("/solutions")) return "solution";
  if (href.includes("/insights/")) return "insight";
  return "page";
}

function enHref(href) {
  // Tools stay unprefixed (Thai default / shared tools). Solutions and pages get /en.
  if (href.startsWith("/tools")) return href;
  if (href.startsWith("/en/")) return href;
  if (href.startsWith("/insights/")) return `/en${href}`;
  if (href.startsWith("/solutions/") || href === "/solutions") return `/en${href}`;
  if (href === "/contact-us" || href === "/case-studies" || href === "/insights" || href === "/approach" || href === "/about-us") {
    return `/en${href}`;
  }
  // hubs like /hotel-digital-marketing — keep Thai hub if no EN alternate is guaranteed
  return href;
}

function relatedFromInsights(slug) {
  const marker = `id: "${slug}"`;
  const start = insightsSrc.indexOf(marker);
  if (start < 0) return [];
  const next = insightsSrc.indexOf('id: "', start + marker.length);
  const block = insightsSrc.slice(start, next < 0 ? insightsSrc.length : next);
  return [...(block.match(/relatedArticleIds:\s*\[([^\]]*)\]/)?.[1] || "").matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

/** Rebuild insight route entries: remove old ones, insert fresh block after ROUTE_LINKS open. */
function stripInsightKeys(src) {
  return src.replace(/\n  "\/(?:en\/)?insights\/[^"]+": \[[\s\S]*?\],/g, "");
}

s = stripInsightKeys(s);

const blocks = [];

function pushRoute(route, links) {
  const unique = [];
  const seen = new Set();
  for (const l of links) {
    if (!l?.href || seen.has(l.href) || l.href === route) continue;
    seen.add(l.href);
    unique.push(l);
  }
  blocks.push(
    `  ${JSON.stringify(route)}: [\n` +
      unique
        .slice(0, 6)
        .map((l) => `    { href: ${JSON.stringify(l.href)}, kind: ${JSON.stringify(l.kind)} },`)
        .join("\n") +
      `\n  ],`,
  );
}

const allSlugs = [
  ...new Set([
    ...batch.posts.map((p) => p.slug),
    "hotel-revenue-meetings-that-lead-to-decisions",
    "hotel-technology-adoption-commercial-project",
    "direct-booking-journey-audit",
    "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
  ]),
];

for (const slug of allSlugs) {
  const a = articles.find((x) => x.slug === slug) || {};
  const relatedIds = relatedFromInsights(slug);
  const services = (a.serviceLinks || []).map((href) => ({ href, kind: kindFor(href) }));
  // fallback services for core 4
  const fallbackServices =
    slug === "hotel-revenue-meetings-that-lead-to-decisions"
      ? [{ href: "/solutions/revenue-commercial-management", kind: "solution" }]
      : slug === "hotel-technology-adoption-commercial-project"
        ? [
            { href: "/solutions/hotel-ai-automation", kind: "solution" },
            { href: "/solutions/hotel-systems-implementation", kind: "solution" },
          ]
        : slug === "direct-booking-journey-audit"
          ? [
              { href: "/solutions/hotel-direct-bookings", kind: "solution" },
              { href: "/solutions/hotel-website-design", kind: "solution" },
            ]
          : slug === "seo-vs-sem-for-hotels-which-one-should-you-focus-on"
            ? [
                { href: "/solutions/hotel-seo-google-maps-ai-search", kind: "solution" },
                { href: "/solutions/google-ads-management", kind: "solution" },
              ]
            : [];

  const svc = services.length ? services : fallbackServices;
  const related = relatedIds.map((id) => ({ href: `/insights/${id}`, kind: "insight" }));

  pushRoute(`/insights/${slug}`, [...related, ...svc, { href: "/contact-us", kind: "page" }, { href: "/insights", kind: "page" }]);

  // EN map for every published insight that has an EN route
  pushRoute(`/en/insights/${slug}`, [
    ...relatedIds.map((id) => ({ href: `/en/insights/${id}`, kind: "insight" })),
    ...svc.map((x) => ({ href: enHref(x.href), kind: x.kind })),
    { href: "/en/insights", kind: "page" },
    { href: "/en/contact-us", kind: "page" },
  ]);
}

pushRoute("/insights", [
  { href: "/insights/hotel-branding", kind: "insight" },
  { href: "/insights/hotel-seo", kind: "insight" },
  { href: "/insights/what-is-ota", kind: "insight" },
  { href: "/solutions", kind: "page" },
  { href: "/case-studies", kind: "page" },
  { href: "/tools", kind: "tool" },
]);

const injected = `${blocks.join("\n")}\n`;
const marker = /const ROUTE_LINKS: Record<string, LinkRef\[\]> = \{\r?\n/;
if (!marker.test(s)) {
  throw new Error("ROUTE_LINKS marker not found");
}
s = s.replace(marker, (m) => `${m}${injected}`);

writeFileSync(path, s, "utf8");
console.log("wrote insight backlink routes:", blocks.length);
