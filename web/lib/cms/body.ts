import type { HandoffBlock } from "@/lib/handoff";
import { parseMain } from "@/lib/handoff";
import { localizePath, type Locale } from "@/lib/seo";

function isBlockArray(value: unknown): value is HandoffBlock[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === "object" && "type" in item);
}

/** Undo accidental JSON-in-paragraph nesting from earlier CMS saves. */
export function unwrapCmsBody(raw: string): string {
  let current = raw.trim();
  for (let i = 0; i < 6; i += 1) {
    if (!current.startsWith("[")) return current;
    try {
      const parsed = JSON.parse(current) as unknown;
      if (!isBlockArray(parsed)) return current;
      if (
        parsed.length === 1 &&
        parsed[0].type === "p" &&
        typeof (parsed[0] as { text?: string }).text === "string" &&
        (parsed[0] as { text: string }).text.trim().startsWith("[")
      ) {
        current = (parsed[0] as { text: string }).text.trim();
        continue;
      }
      return JSON.stringify(parsed);
    } catch {
      return current;
    }
  }
  return current;
}

export function parseCmsBody(raw: string): HandoffBlock[] {
  const trimmed = unwrapCmsBody(raw);
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (isBlockArray(parsed)) return parsed;
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
  const trimmed = raw.trim();
  // If the editor somehow still holds CMS JSON, keep/normalize it instead of nesting again.
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(unwrapCmsBody(trimmed)) as unknown;
      if (isBlockArray(parsed)) return JSON.stringify(parsed);
    } catch {
      // Fall through to markdown parse.
    }
  }
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
  let slug = slugify(input.slug);
  if (input.kind !== "insight" && slug === "about") slug = "about-us";
  if (input.kind !== "insight" && slug === "contact") slug = "contact-us";
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
