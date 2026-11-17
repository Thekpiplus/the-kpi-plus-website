import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function stripFrontmatter(raw) {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return { meta: {}, body: raw };
  const yaml = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\r?\n/, "");
  const meta = {};
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    meta[m[1]] = v;
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

for (const loc of ["th", "en"]) {
  const src = join(".tmp-blog-import/content/blog", loc, "hotel-branding.md");
  const raw = readFileSync(src, "utf8");
  const { meta, body } = stripFrontmatter(raw);
  const title = meta.title || "";
  const description = meta.description || "";
  const seoTitle = meta.seoTitle || title;
  const route = loc === "th" ? "/insights/hotel-branding" : "/en/insights/hotel-branding";
  const canonical = `https://thekpiplus.com${route}`;
  const published = meta.publishedAt || "2023-05-23";
  const updated = meta.updatedAt || "2026-11-17";
  const author = meta.author || "The KPI Plus Editorial Team";
  const header = [
    `# ${route}`,
    `**Language:** ${loc}`,
    `**Title:** ${title}`,
    `**SeoTitle:** ${seoTitle}`,
    `**Description:** ${description}`,
    `**Canonical:** ${canonical}`,
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
  const destDir = loc === "th" ? "content/pages/insights" : "content/pages/en/insights";
  mkdirSync(destDir, { recursive: true });
  const dest = join(destDir, "hotel-branding.md");
  writeFileSync(dest, header, "utf8");
  console.log("wrote", dest, Buffer.byteLength(header), "bytes");
}
