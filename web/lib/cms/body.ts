import type { HandoffBlock } from "@/lib/handoff";
import { parseMain } from "@/lib/handoff";
import { localizePath, type Locale } from "@/lib/seo";

export function parseCmsBody(raw: string): HandoffBlock[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) return parsed as HandoffBlock[];
    } catch {
      // Fall through to markdown.
    }
  }
  return parseMain(raw);
}

export function blocksToMarkdown(blocks: HandoffBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "h1") return `# ${block.text}`;
      if (block.type === "h2") return `## ${block.text}`;
      if (block.type === "h3") return `### ${block.text}`;
      if (block.type === "p") return block.text;
      if (block.type === "image") return `![${block.alt}](${block.src})`;
      if (block.type === "link") return `[${block.text}](${block.href})`;
      if (block.type === "list") return block.items.map((item) => `- ${item}`).join("\n");
      if (block.type === "table") {
        const header = `| ${block.headers.join(" | ")} |`;
        const sep = `| ${block.headers.map(() => "---").join(" | ")} |`;
        const rows = block.rows.map((row) => `| ${row.join(" | ")} |`);
        return [header, sep, ...rows].join("\n");
      }
      return "";
    })
    .join("\n\n");
}

export function bodyFromMarkdown(raw: string) {
  return JSON.stringify(parseMain(raw));
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/-]+/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function documentPath(input: { kind: string; slug: string; locale: string }) {
  const slug = slugify(input.slug);
  const bare = input.kind === "insight" ? `/insights/${slug}` : `/${slug}`;
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  return locale === "th" ? bare : localizePath(bare, locale);
}

export function estimateMinutes(blocks: HandoffBlock[]) {
  const text = blocks
    .map((block) => {
      if ("text" in block) return block.text;
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "table") return [...block.headers, ...block.rows.flat()].join(" ");
      return "";
    })
    .join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 180));
}
