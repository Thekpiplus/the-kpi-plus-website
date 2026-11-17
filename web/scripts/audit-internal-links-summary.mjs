import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const routes = new Set(
  JSON.parse(readFileSync(join(ROOT, "content/seo-manifest.json"), "utf8")).map((p) => p.route),
);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}

function norm(h) {
  let x = h.split("#")[0].split("?")[0];
  if (x.length > 1 && x.endsWith("/")) x = x.slice(0, -1);
  return x;
}

function isPage(h) {
  if (!h?.startsWith("/")) return false;
  if (h.startsWith("/images/") || h.startsWith("/media/") || h.startsWith("/brand/") || h.startsWith("/_next/"))
    return false;
  if (/\.(webp|png|jpg|jpeg|gif|svg|pdf|css|js)$/i.test(h)) return false;
  return true;
}

/** Mirror site rules: tools unprefixed; insight articles TH/EN only (RU/ZH → EN). */
function resolve(href, fromFile) {
  const x = norm(href);
  if (routes.has(x)) return { ok: true, resolved: x };

  // tools are always unprefixed
  const tools = x.match(/^\/(en|ru|zh)(\/tools(?:\/.*)?)$/);
  if (tools) {
    const bare = tools[2];
    return routes.has(bare)
      ? { ok: true, resolved: bare, fix: bare, reason: "tools-should-be-unprefixed" }
      : { ok: false, resolved: bare, reason: "missing-tools" };
  }

  // RU/ZH insight articles resolve to EN
  const insight = x.match(/^\/(ru|zh)\/insights\/([^/]+)$/);
  if (insight) {
    const en = `/en/insights/${insight[2]}`;
    const th = `/insights/${insight[2]}`;
    if (routes.has(en)) return { ok: true, resolved: en, fix: en, reason: "insight-ru-zh-to-en" };
    if (routes.has(th)) return { ok: true, resolved: th, fix: th, reason: "insight-ru-zh-to-th" };
    return { ok: false, reason: "missing-insight" };
  }

  // EN insight that only exists in TH
  const enOnly = x.match(/^\/en\/insights\/([^/]+)$/);
  if (enOnly) {
    const th = `/insights/${enOnly[1]}`;
    if (routes.has(th)) return { ok: true, resolved: th, fix: th, reason: "insight-en-missing-use-th" };
  }

  return { ok: false, reason: "missing" };
}

const broken = [];
const fixable = [];
const byHref = new Map();

for (const file of walk(join(ROOT, "content/pages"))) {
  const rel = file.replace(/\\/g, "/").split("content/pages/").pop();
  const text = readFileSync(file, "utf8");
  const hrefs = [...text.matchAll(/\]\((\/[^)\s]+)(?:#[^)]*)?\)/g)].map((m) => m[1]).filter(isPage);
  for (const href of hrefs) {
    const r = resolve(href, rel);
    if (r.ok && !r.fix) continue;
    if (r.ok && r.fix) {
      fixable.push({ from: rel, href: norm(href), fix: r.fix, reason: r.reason });
      continue;
    }
    const key = norm(href);
    if (!byHref.has(key)) byHref.set(key, new Set());
    byHref.get(key).add(rel);
    broken.push({ from: rel, href: key, reason: r.reason });
  }
}

// Also scan internal-backlinks.ts for dead page targets
const back = readFileSync(join(ROOT, "lib/internal-backlinks.ts"), "utf8");
const backHrefs = [...back.matchAll(/href:\s*"(\/[^"]+)"/g)].map((m) => m[1]);
const deadBacklinks = [];
for (const href of backHrefs) {
  if (!isPage(href)) continue;
  const r = resolve(href);
  if (!r.ok) deadBacklinks.push(href);
}

const uniqueBroken = [...byHref.entries()]
  .map(([href, files]) => ({ href, count: files.size, sample: [...files].slice(0, 3) }))
  .sort((a, b) => b.count - a.count);

const fixableByRule = fixable.reduce((acc, x) => {
  acc[x.reason] = (acc[x.reason] || 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    {
      uniqueBrokenPageHrefs: uniqueBroken.length,
      uniqueBroken,
      fixableOccurrences: fixable.length,
      fixableByRule,
      deadBacklinkTargets: [...new Set(deadBacklinks)].sort(),
      partnersLoginNote: uniqueBroken.find((x) => x.href === "/partners/login") || null,
    },
    null,
    2,
  ),
);
