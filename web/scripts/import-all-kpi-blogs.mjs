/**
 * Batch-import all KPI blog packages from web/_incoming/blog-* into content, SEO, images,
 * and generated insight post metadata.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

const ROOT = process.cwd();
const INCOMING = join(ROOT, "_incoming");
const SKIP_TH_BODY = new Set(["hotel-marketing"]); // keep live Thai page; EN is new

function unquote(v) {
  if (v == null) return "";
  let s = String(v).trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    s = s.slice(1, -1);
    if (s.includes("''")) s = s.replace(/''/g, "'");
  }
  return s;
}

/** Minimal YAML frontmatter parser for package markdown. */
function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: raw };
  const yaml = raw.slice(3, end).replace(/^\r?\n/, "");
  const body = raw.slice(end + 4).replace(/^\r?\n/, "");
  const lines = yaml.split(/\r?\n/);
  const meta = {};
  let i = 0;

  function parseValue(rawVal, indent) {
    const v = rawVal.trim();
    if (v === "" || v === "|" || v === ">") {
      // block / nested — handled by callers
      return null;
    }
    if (v.startsWith("[") && v.endsWith("]")) {
      return v
        .slice(1, -1)
        .split(",")
        .map((x) => unquote(x.trim()))
        .filter(Boolean);
    }
    return unquote(v);
  }

  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) {
      i += 1;
      continue;
    }
    const key = m[1];
    const rest = m[2];
    const next = lines[i + 1];
    const nextIndent = next ? (next.match(/^(\s*)/)?.[1].length ?? 0) : 0;

    // Lists may be indented or flush-left (`- title:` under `relatedPosts:`)
    if (rest.trim() === "" && next && /^\s*- /.test(next)) {
      i += 1;
      const items = [];
      while (i < lines.length && /^\s*- /.test(lines[i])) {
        const itemLine = lines[i];
        const itemIndent = itemLine.match(/^(\s*)/)[1].length;
        const afterDash = itemLine.replace(/^\s*- /, "");
        if (/^[A-Za-z0-9_]+:\s*/.test(afterDash)) {
          const obj = {};
          const first = afterDash.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
          obj[first[1]] = unquote(first[2]);
          i += 1;
          while (i < lines.length) {
            const l = lines[i];
            if (/^\s*- /.test(l) || /^[A-Za-z0-9_]+:\s*/.test(l)) break;
            const ind = l.match(/^(\s*)/)[1].length;
            if (ind <= itemIndent && l.trim() !== "") break;
            const km = l.trim().match(/^([A-Za-z0-9_]+):\s*(.*)$/);
            if (km) obj[km[1]] = unquote(km[2]);
            i += 1;
          }
          items.push(obj);
        } else {
          items.push(unquote(afterDash));
          i += 1;
        }
      }
      meta[key] = items;
      continue;
    }

    if (rest.trim() === "" && next && nextIndent > 0 && !/^\s+- /.test(next)) {
      // nested map (primaryCta, callouts, alternateLocale, faq)
      i += 1;
      const obj = {};
      while (i < lines.length) {
        const l = lines[i];
        const ind = l.match(/^(\s*)/)[1].length;
        if (ind === 0 && l.trim() !== "") break;
        if (ind === 0) {
          i += 1;
          continue;
        }
        const km = l.trim().match(/^([A-Za-z0-9_]+):\s*(.*)$/);
        if (!km) {
          i += 1;
          continue;
        }
        const subKey = km[1];
        const subRest = km[2];
        const peek = lines[i + 1];
        const peekInd = peek ? (peek.match(/^(\s*)/)?.[1].length ?? 0) : 0;
        if (subRest.trim() === "" && peek && peekInd > ind && /^\s+- /.test(peek)) {
          i += 1;
          const arr = [];
          while (i < lines.length && /^\s+- /.test(lines[i])) {
            const il = lines[i];
            const ii = il.match(/^(\s*)/)[1].length;
            if (ii <= ind) break;
            const after = il.replace(/^\s+- /, "");
            if (/^[A-Za-z0-9_]+:\s*/.test(after)) {
              const o = {};
              const fm = after.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
              o[fm[1]] = unquote(fm[2]);
              i += 1;
              while (i < lines.length) {
                const ll = lines[i];
                const lind = ll.match(/^(\s*)/)[1].length;
                if (lind <= ii) break;
                const k2 = ll.trim().match(/^([A-Za-z0-9_]+):\s*(.*)$/);
                if (k2) o[k2[1]] = unquote(k2[2]);
                i += 1;
              }
              arr.push(o);
            } else {
              arr.push(unquote(after));
              i += 1;
            }
          }
          obj[subKey] = arr;
          continue;
        }
        obj[subKey] = parseValue(subRest);
        i += 1;
      }
      meta[key] = obj;
      continue;
    }

    meta[key] = parseValue(rest);
    i += 1;
  }

  return { meta, body };
}

function toHandoff(body) {
  return (
    body
      .split(/\r?\n/)
      .map((line) => (line.startsWith(">") ? line.replace(/^>\s*/, "") : line))
      .join("\n")
      .trim() + "\n"
  );
}

function writeHandoff({ slug, loc, meta, body }) {
  const route = loc === "th" ? `/insights/${slug}` : `/en/insights/${slug}`;
  const title = meta.title || "";
  const description = meta.description || "";
  const seoTitle = meta.seoTitle || title;
  const published = meta.publishedAt || "2026-11-17";
  const updated = meta.updatedAt || published;
  const author = meta.author || "The KPI Plus Editorial Team";
  const header = [
    `# ${route}`,
    `**Language:** ${loc}`,
    `**Title:** ${title}`,
    `**SeoTitle:** ${seoTitle}`,
    `**Description:** ${description}`,
    `**Canonical:** https://thekpiplus.com${route}`,
    `**Author:** ${author}`,
    `**Published:** ${published}`,
    `**Updated:** ${updated}`,
    "**CMS editorial TODO:** Keep package copy verbatim; do not invent translations for other locales.",
    "",
    "### MAIN",
    "",
    `# ${title}`,
    "",
    toHandoff(body),
  ].join("\n");
  const destDir = loc === "th" ? join(ROOT, "content/pages/insights") : join(ROOT, "content/pages/en/insights");
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, `${slug}.md`);
  writeFileSync(dest, header, "utf8");
  return dest;
}

function copyDir(src, dest) {
  if (!existsSync(src)) return 0;
  mkdirSync(dest, { recursive: true });
  let n = 0;
  for (const name of readdirSync(src)) {
    const from = join(src, name);
    const to = join(dest, name);
    if (statSync(from).isDirectory()) n += copyDir(from, to);
    else {
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
      n += 1;
    }
  }
  return n;
}

function categoryFor(slug, packageCategory) {
  const seo = new Set([
    "hotel-seo",
    "hotel-local-seo",
    "hotel-website-content",
    "increase-hotel-bookings-from-google",
  ]);
  const booking = new Set(["what-is-ota", "hotel-rate-parity"]);
  if (seo.has(slug)) {
    return {
      th: "SEO และ Local Search",
      en: "SEO / Local Search",
      ru: "SEO / Local Search",
      zh: "SEO / Local Search",
    };
  }
  if (booking.has(slug)) {
    return {
      th: "การจองตรง",
      en: "OTA / Direct Booking",
      ru: "OTA / Direct Booking",
      zh: "OTA / Direct Booking",
    };
  }
  if (slug === "hotel-organizational-structure") {
    return {
      th: "การตลาดโรงแรม",
      en: "Hotel Marketing",
      ru: "Маркетинг отеля",
      zh: "飯店行銷",
    };
  }
  return {
    th: "การตลาดโรงแรม",
    en: packageCategory === "Marketing" ? "Hotel Marketing" : "Hotel Marketing",
    ru: "Маркетинг отеля",
    zh: "飯店行銷",
  };
}

function relatedIds(meta) {
  const posts = Array.isArray(meta.relatedPosts) ? meta.relatedPosts : [];
  return posts
    .map((p) => {
      const href = typeof p === "object" ? p.href : "";
      const m = String(href).match(/\/insights\/([^/?#]+)/);
      return m ? m[1] : null;
    })
    .filter(Boolean);
}

function sourcesFrom(thMeta, enMeta) {
  const th = Array.isArray(thMeta.sources) ? thMeta.sources : [];
  const en = Array.isArray(enMeta.sources) ? enMeta.sources : [];
  const byUrl = new Map();
  for (const s of th) {
    if (!s?.url && !s?.label) continue;
    byUrl.set(s.url || s.label, {
      label: s.label || s.url,
      labelByLocale: { th: s.label },
      url: s.url,
    });
  }
  for (const s of en) {
    if (!s?.url && !s?.label) continue;
    const key = s.url || s.label;
    const existing = byUrl.get(key);
    if (existing) {
      existing.labelByLocale = { ...existing.labelByLocale, en: s.label };
      if (!existing.label) existing.label = s.label;
    } else {
      byUrl.set(key, {
        label: s.label || s.url,
        labelByLocale: { en: s.label },
        url: s.url,
      });
    }
  }
  return [...byUrl.values()];
}

function esc(s) {
  return JSON.stringify(s ?? "");
}

const packages = readdirSync(INCOMING)
  .filter((d) => d.startsWith("blog-") && statSync(join(INCOMING, d)).isDirectory())
  .map((d) => d.slice(5))
  .sort();

const posts = [];
const seoEntries = [];
const articles = [];
const redirects = [];
const coversEn = {};
let imagesCopied = 0;
const written = [];
const skipped = [];

for (const slug of packages) {
  const base = join(INCOMING, `blog-${slug}`);
  const thPath = join(base, "content/blog/th", `${slug}.md`);
  const enPath = join(base, "content/blog/en", `${slug}.md`);
  if (!existsSync(thPath) || !existsSync(enPath)) {
    skipped.push(`${slug}: missing md`);
    continue;
  }

  const thRaw = readFileSync(thPath, "utf8");
  const enRaw = readFileSync(enPath, "utf8");
  const { meta: thMeta, body: thBody } = parseFrontmatter(thRaw);
  const { meta: enMeta, body: enBody } = parseFrontmatter(enRaw);

  imagesCopied += copyDir(join(base, "public/images/blog", slug), join(ROOT, "public/images/blog", slug));

  if (SKIP_TH_BODY.has(slug) && existsSync(join(ROOT, "content/pages/insights", `${slug}.md`))) {
    skipped.push(`${slug}: kept live Thai body`);
  } else {
    written.push(writeHandoff({ slug, loc: "th", meta: thMeta, body: thBody }));
  }
  written.push(writeHandoff({ slug, loc: "en", meta: enMeta, body: enBody }));

  const articlePath = join(base, "seo/articles.json");
  if (existsSync(articlePath)) {
    articles.push(JSON.parse(readFileSync(articlePath, "utf8")));
  }

  const thTitle = thMeta.title || "";
  const enTitle = enMeta.title || "";
  const thDesc = thMeta.description || "";
  const enDesc = enMeta.description || "";
  const thSeo = thMeta.seoTitle || thTitle;
  const enSeo = enMeta.seoTitle || enTitle;
  const published = thMeta.publishedAt || "2026-11-17";
  const updated = thMeta.updatedAt || published;
  const reading = Number(thMeta.readingTime || enMeta.readingTime || 10) || 10;
  const coverAlt = thMeta.coverAlt || thTitle;
  const coverEnAlt = enMeta.coverAlt || enTitle;

  coversEn[slug] = {
    src: `/images/blog/${slug}/en/cover.webp`,
    alt: coverEnAlt,
    readingTimeMinutes: Number(enMeta.readingTime || reading) || reading,
  };

  posts.push({
    id: slug,
    slug,
    href: `/insights/${slug}`,
    publishedAt: published,
    updatedAt: updated,
    readingTimeMinutes: reading,
    coverImage: `/images/blog/${slug}/th/cover.webp`,
    coverImageAlt: coverAlt,
    coverImageFit: "cover",
    coverImageStatus: "approved",
    authorName: "EDITORIAL_AUTHOR_NAME",
    isPublished: true,
    relatedArticleIds: relatedIds(thMeta),
    sources: sourcesFrom(thMeta, enMeta),
    category: categoryFor(slug, thMeta.category),
    title: { th: thTitle, en: enTitle, ru: enTitle, zh: enTitle },
    excerpt: { th: thDesc, en: enDesc, ru: enDesc, zh: enDesc },
    // preserve live Thai listing for hotel-marketing if requested later
    _preserveThListing: SKIP_TH_BODY.has(slug),
  });

  seoEntries.push({
    route: `/insights/${slug}`,
    language: "th",
    title: thSeo,
    description: thDesc,
    canonical: `https://thekpiplus.com/insights/${slug}`,
    alternates: [
      { hreflang: "th", href: `https://thekpiplus.com/insights/${slug}` },
      { hreflang: "en", href: `https://thekpiplus.com/en/insights/${slug}` },
    ],
    ogImage: `https://thekpiplus.com/images/blog/${slug}/th/og.webp`,
    ogUrl: `https://thekpiplus.com/insights/${slug}`,
  });
  seoEntries.push({
    route: `/en/insights/${slug}`,
    language: "en",
    title: enSeo,
    description: enDesc,
    canonical: `https://thekpiplus.com/en/insights/${slug}`,
    alternates: [
      { hreflang: "th", href: `https://thekpiplus.com/insights/${slug}` },
      { hreflang: "en", href: `https://thekpiplus.com/en/insights/${slug}` },
    ],
    ogImage: `https://thekpiplus.com/images/blog/${slug}/en/og.webp`,
    ogUrl: `https://thekpiplus.com/en/insights/${slug}`,
  });

  const legacy = unquote(thMeta.legacyUrl || "");
  if (legacy) {
    try {
      const u = legacy.startsWith("http") ? new URL(legacy).pathname : legacy;
      const pathOnly = decodeURIComponent(u).replace(/\/$/, "") || u;
      if (pathOnly && pathOnly !== `/insights/${slug}`) {
        redirects.push({ source: pathOnly, destination: `/insights/${slug}` });
        if (!pathOnly.endsWith("/")) {
          redirects.push({ source: `${pathOnly}/`, destination: `/insights/${slug}` });
        }
      }
    } catch {
      // ignore bad legacy
    }
  }
  // short slug redirects
  redirects.push({ source: `/${slug}`, destination: `/insights/${slug}` });
  redirects.push({ source: `/en/${slug}`, destination: `/en/insights/${slug}` });
}

// --- seo-manifest ---
const manifestPath = join(ROOT, "content/seo-manifest.json");
const pages = JSON.parse(readFileSync(manifestPath, "utf8"));
for (const entry of seoEntries) {
  // hotel-marketing TH: add EN alternate but keep existing title/description unless empty
  if (entry.route === "/insights/hotel-marketing") {
    const idx = pages.findIndex((p) => p.route === entry.route);
    if (idx >= 0) {
      pages[idx] = {
        ...pages[idx],
        alternates: entry.alternates,
        // keep live og if present; still attach hreflang
      };
      continue;
    }
  }
  const idx = pages.findIndex((p) => p.route === entry.route);
  if (idx >= 0) pages[idx] = entry;
  else pages.push(entry);
}
writeFileSync(manifestPath, `${JSON.stringify(pages, null, 2)}\n`, "utf8");

// --- articles registry ---
const articlesPath = join(ROOT, "content/_seo/articles.json");
mkdirSync(dirname(articlesPath), { recursive: true });
let existingArticles = [];
try {
  existingArticles = JSON.parse(readFileSync(articlesPath, "utf8"));
  if (!Array.isArray(existingArticles)) existingArticles = [];
} catch {
  existingArticles = [];
}
for (const a of articles) {
  const i = existingArticles.findIndex((x) => x.slug === a.slug);
  if (i >= 0) existingArticles[i] = a;
  else existingArticles.push(a);
}
writeFileSync(articlesPath, `${JSON.stringify(existingArticles, null, 2)}\n`, "utf8");

// --- generated posts JSON (consumed by insights merge script) ---
const genPath = join(ROOT, "content/_seo/blog-batch-posts.json");
writeFileSync(genPath, `${JSON.stringify({ posts, coversEn, redirects }, null, 2)}\n`, "utf8");

// Dedupe redirects
const seen = new Set();
const uniqueRedirects = [];
for (const r of redirects) {
  const key = r.source;
  if (seen.has(key)) continue;
  // skip colliding with real routes that aren't insights
  if (["/about-us", "/contact-us", "/solutions", "/insights", "/tools"].includes(r.source)) continue;
  seen.add(key);
  uniqueRedirects.push(r);
}
writeFileSync(join(ROOT, "content/_seo/blog-batch-redirects.json"), `${JSON.stringify(uniqueRedirects, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      packages: packages.length,
      written: written.length,
      skipped,
      imagesCopied,
      seoEntries: seoEntries.length,
      articles: existingArticles.length,
      redirects: uniqueRedirects.length,
      posts: posts.length,
    },
    null,
    2,
  ),
);
