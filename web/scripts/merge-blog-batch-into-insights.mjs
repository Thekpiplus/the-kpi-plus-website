/**
 * Merge content/_seo/blog-batch-posts.json into lib/insights.ts and
 * update EN covers + next.config redirects + insight-links.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const batch = JSON.parse(readFileSync(join(ROOT, "content/_seo/blog-batch-posts.json"), "utf8"));
const redirects = JSON.parse(readFileSync(join(ROOT, "content/_seo/blog-batch-redirects.json"), "utf8"));
const articles = JSON.parse(readFileSync(join(ROOT, "content/_seo/articles.json"), "utf8"));

const CORE_KEEP = new Set([
  "hotel-revenue-meetings-that-lead-to-decisions",
  "hotel-technology-adoption-commercial-project",
  "direct-booking-journey-audit",
  "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
]);

function tsString(s) {
  return JSON.stringify(s ?? "");
}

function renderSources(sources) {
  if (!sources?.length) return "    sources: [],";
  const lines = ["    sources: ["];
  for (const s of sources) {
    lines.push("      {");
    lines.push(`        label: ${tsString(s.label)},`);
    if (s.labelByLocale) {
      lines.push("        labelByLocale: {");
      for (const [k, v] of Object.entries(s.labelByLocale)) {
        if (v) lines.push(`          ${k}: ${tsString(v)},`);
      }
      lines.push("        },");
    }
    if (s.url) lines.push(`        url: ${tsString(s.url)},`);
    lines.push("      },");
  }
  lines.push("    ],");
  return lines.join("\n");
}

function renderPost(p, preserveTh) {
  const titleTh = preserveTh?.title?.th ?? p.title.th;
  const titleEn = p.title.en;
  const excerptTh = preserveTh?.excerpt?.th ?? p.excerpt.th;
  const excerptEn = p.excerpt.en;
  const category = preserveTh?.category && p.slug === "hotel-marketing" ? preserveTh.category : p.category;
  // Prefer package cover for batch; for hotel-marketing keep placeholder unless cover exists approved
  const usePackageCover = p.slug !== "hotel-marketing";
  const related = [...new Set([...(p.relatedArticleIds || []), ...(preserveTh?.relatedArticleIds || [])])].slice(0, 4);
  // Prefer package related for batch articles
  const relatedFinal = p.slug === "hotel-marketing"
    ? [...new Set([...(p.relatedArticleIds || []), "hotel-branding", "direct-booking-journey-audit"])].slice(0, 4)
    : p.relatedArticleIds || [];

  return `  {
    id: ${tsString(p.id)},
    slug: ${tsString(p.slug)},
    href: ${tsString(p.href)},
    publishedAt: ${tsString(p.publishedAt)},
    updatedAt: ${tsString(p.updatedAt)},
    readingTimeMinutes: ${p.readingTimeMinutes},
    coverImage: ${tsString(usePackageCover ? p.coverImage : preserveTh?.coverImage || p.coverImage)},
    coverImageAlt: ${tsString(usePackageCover ? p.coverImageAlt : preserveTh?.coverImageAlt || p.coverImageAlt)},
    coverImageFit: ${tsString(usePackageCover ? "cover" : preserveTh?.coverImageFit || "cover")},
    coverImageStatus: ${tsString(usePackageCover ? "approved" : preserveTh?.coverImageStatus || "approved")},
    ${usePackageCover ? "" : preserveTh?.sampleVisual ? "sampleVisual: true," : ""}
    authorName: EDITORIAL_AUTHOR_NAME,
    isPublished: true,
    relatedArticleIds: ${JSON.stringify(relatedFinal)},
${renderSources(p.sources)}
    category: {
      th: ${tsString(category.th)},
      en: ${tsString(category.en)},
      ru: ${tsString(category.ru)},
      zh: ${tsString(category.zh)},
    },
    title: {
      th: ${tsString(titleTh)},
      en: ${tsString(p.slug === "hotel-marketing" ? titleEn : titleEn)},
      ru: ${tsString(titleEn)},
      zh: ${tsString(titleEn)},
    },
    excerpt: {
      th: ${tsString(excerptTh)},
      en: ${tsString(excerptEn)},
      ru: ${tsString(excerptEn)},
      zh: ${tsString(excerptEn)},
    },
  }`;
}

// Extract existing core posts from insights.ts by evaluating via regex blocks is hard;
// instead read preserve data for hotel-marketing from current file with a small parse.
const insightsPath = join(ROOT, "lib/insights.ts");
const insightsSrc = readFileSync(insightsPath, "utf8");

function extractPostObject(src, id) {
  const marker = `id: "${id}"`;
  const start = src.indexOf(marker);
  if (start < 0) return null;
  // walk back to opening brace
  let i = start;
  while (i > 0 && src[i] !== "{") i -= 1;
  let depth = 0;
  let j = i;
  for (; j < src.length; j++) {
    if (src[j] === "{") depth += 1;
    else if (src[j] === "}") {
      depth -= 1;
      if (depth === 0) {
        j += 1;
        break;
      }
    }
  }
  const block = src.slice(i, j);
  const get = (field) => {
    const m = block.match(new RegExp(`${field}:\\s*"((?:\\\\.|[^"\\\\])*)"`));
    return m ? JSON.parse(`"${m[1]}"`) : undefined;
  };
  const getLocale = (field) => {
    const m = block.match(new RegExp(`${field}:\\s*\\{([^}]+)\\}`, "s"));
    if (!m) return {};
    const out = {};
    for (const lm of m[1].matchAll(/(th|en|ru|zh):\s*"((?:\\.|[^"\\\\])*)"/g)) {
      out[lm[1]] = JSON.parse(`"${lm[2]}"`);
    }
    return out;
  };
  const related = [...block.matchAll(/relatedArticleIds:\s*\[([^\]]*)\]/g)].pop();
  let relatedArticleIds = [];
  if (related) {
    relatedArticleIds = [...related[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  }
  return {
    coverImage: get("coverImage"),
    coverImageAlt: get("coverImageAlt"),
    coverImageFit: get("coverImageFit"),
    coverImageStatus: get("coverImageStatus"),
    sampleVisual: /sampleVisual:\s*true/.test(block),
    category: getLocale("category"),
    title: getLocale("title"),
    excerpt: getLocale("excerpt"),
    relatedArticleIds,
  };
}

const preserveMarketing = extractPostObject(insightsSrc, "hotel-marketing");

// Build core posts text by extracting each CORE_KEEP block verbatim
function extractBlock(src, id) {
  const marker = `id: "${id}"`;
  const start = src.indexOf(marker);
  if (start < 0) return null;
  let i = start;
  while (i > 0 && src[i] !== "{") i -= 1;
  let depth = 0;
  let j = i;
  for (; j < src.length; j++) {
    if (src[j] === "{") depth += 1;
    else if (src[j] === "}") {
      depth -= 1;
      if (depth === 0) {
        j += 1;
        break;
      }
    }
  }
  return src.slice(i, j);
}

const coreBlocks = [...CORE_KEEP].map((id) => extractBlock(insightsSrc, id)).filter(Boolean);

const batchBlocks = batch.posts.map((p) =>
  renderPost(p, p.slug === "hotel-marketing" ? preserveMarketing : null),
);

const arrayStart = insightsSrc.indexOf("export const insightPosts: InsightPost[] = [");
const featuredIdx = insightsSrc.indexOf("export const FEATURED_INSIGHT_SLUG");
if (arrayStart < 0 || featuredIdx < 0) {
  throw new Error("Could not locate insightPosts array bounds");
}
// Find the `];` that closes insightPosts (last before FEATURED)
const beforeFeatured = insightsSrc.slice(arrayStart, featuredIdx);
let closeRel = beforeFeatured.lastIndexOf("];");
let closeLen = 2;
if (closeRel < 0) {
  closeRel = beforeFeatured.lastIndexOf("\n]");
  closeLen = 2; // "\n]" — keep the newline by starting replace at ]
  if (closeRel >= 0) {
    closeRel += 1; // point at ]
    closeLen = 1;
  }
}
if (closeRel < 0) throw new Error("Could not find closing ] for insightPosts");
const arrayClose = arrayStart + closeRel;

const newArray =
  "export const insightPosts: InsightPost[] = [\n" +
  coreBlocks.join(",\n") +
  ",\n" +
  batchBlocks.join(",\n") +
  "\n];";

const finalInsights = insightsSrc.slice(0, arrayStart) + newArray + insightsSrc.slice(arrayClose + closeLen);
writeFileSync(insightsPath, finalInsights, "utf8");
console.log("insights.ts posts:", coreBlocks.length + batchBlocks.length);

// --- EN covers page ---
const enPagePath = join(ROOT, "app/en/insights/[slug]/page.tsx");
let enPage = readFileSync(enPagePath, "utf8");
const coverEntries = Object.entries(batch.coversEn)
  .map(
    ([slug, c]) =>
      `  ${JSON.stringify(slug)}: {\n    src: ${JSON.stringify(c.src)},\n    alt: ${JSON.stringify(c.alt)},\n  },`,
  )
  .join("\n");
enPage = enPage.replace(
  /const EN_COVER: Record<string, \{ src: string; alt: string \}> = \{[\s\S]*?\n\};/,
  `const EN_COVER: Record<string, { src: string; alt: string }> = {\n${coverEntries}\n};`,
);
// reading time from covers
enPage = enPage.replace(
  /readingTimeMinutes: slug === "hotel-branding" \? 10 : base\.readingTimeMinutes,/,
  `readingTimeMinutes: (EN_COVER[slug] && batchReading?.[slug]) || base.readingTimeMinutes,`,
);
// Actually keep simpler: use base.readingTimeMinutes from insight post which has correct values
enPage = enPage.replace(
  /readingTimeMinutes: \(EN_COVER\[slug\] && batchReading\?\.\[slug\]\) \|\| base\.readingTimeMinutes,/,
  `readingTimeMinutes: base.readingTimeMinutes,`,
);
writeFileSync(enPagePath, enPage, "utf8");
console.log("EN covers:", Object.keys(batch.coversEn).length);

// --- next.config redirects ---
const nextPath = join(ROOT, "next.config.ts");
let nextCfg = readFileSync(nextPath, "utf8");
const redirectBlock = redirects
  .filter((r) => {
    // avoid redirecting real top-level routes incorrectly; short slug ok for blog slugs
    const reserved = new Set([
      "/about-us",
      "/contact-us",
      "/solutions",
      "/insights",
      "/tools",
      "/case-studies",
      "/partner",
      "/approach",
      "/associations",
      "/hotel-digital-marketing",
      "/hotel-seo-local-search",
      "/hotel-technology-ai",
      "/hotel-website-conversion",
    ]);
    return !reserved.has(r.source) && !reserved.has(r.source.replace(/\/$/, ""));
  })
  .map(
    (r) => `      {
        source: ${JSON.stringify(r.source)},
        destination: ${JSON.stringify(r.destination)},
        permanent: true,
      },`,
  )
  .join("\n");

if (!nextCfg.includes("/* KPI blog batch redirects */")) {
  nextCfg = nextCfg.replace(
    /async redirects\(\) \{\s*return \[/,
    `async redirects() {\n    return [\n      /* KPI blog batch redirects */\n${redirectBlock}`,
  );
  writeFileSync(nextPath, nextCfg, "utf8");
  console.log("redirects injected:", redirects.length);
} else {
  console.log("redirects already present; skip inject");
}

// --- insight-links from articles serviceLinks ---
const linksPath = join(ROOT, "lib/insight-links.ts");
let linksSrc = readFileSync(linksPath, "utf8");
for (const a of articles) {
  const slug = a.slug;
  const services = (a.serviceLinks || []).filter((h) => typeof h === "string");
  if (!services.length) continue;
  const entry =
    `  ${JSON.stringify(slug)}: [\n` +
    services
      .map((href) => `    { href: ${JSON.stringify(href)} },`)
      .join("\n") +
    `\n  ],`;
  const re = new RegExp(`  ${JSON.stringify(slug)}: \\[[\\s\\S]*?\\],`);
  if (re.test(linksSrc)) {
    linksSrc = linksSrc.replace(re, entry);
  } else {
    linksSrc = linksSrc.replace(
      /const relatedServices: Record<string, RelatedServiceDef\[\]> = \{/,
      `const relatedServices: Record<string, RelatedServiceDef[]> = {\n${entry}`,
    );
  }
}
writeFileSync(linksPath, linksSrc, "utf8");
console.log("insight-links updated for", articles.length, "articles");
