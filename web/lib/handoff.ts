import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pages } from "./seo";

export type HandoffBlock =
  | { type: "h1" | "h2" | "h3" | "p"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "link"; href: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

const ROOT = join(process.cwd(), "content", "pages");

function fileForRoute(route: string) {
  if (route === "/") return join(ROOT, "index.md");
  return join(ROOT, `${route.replace(/^\//, "")}.md`);
}

export function loadHandoff(route: string) {
  const raw = readFileSync(fileForRoute(route), "utf8");
  const main = raw.split("### MAIN")[1]?.split("### FOOTER")[0] ?? raw;
  return parseMain(main);
}

function rewriteHref(href: string) {
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href;
  }
  return href
    .replace(/^(?:\.\.\/)+/, "/")
    .replace(/\.html($|#)/, "$1")
    .replace(/^([^/#])/, "/$1")
    .replace(/\/index($|#)/, "/$1")
    .replace(/^\/#/, "/#");
}

function parseInlineLink(line: string) {
  const match = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (!match) return null;
  return { text: match[1], href: rewriteHref(match[2]) };
}

function parseImage(line: string) {
  const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (!match) return null;
  const src = match[2]
    .replace(/^(?:\.\.\/)+/, "")
    .replace(/^(?:media\/)/, "/media/")
    .replace(/^\//, "/");
  return { alt: match[1], src: src.startsWith("/") ? src : `/${src}` };
}

function parseTableRow(line: string) {
  if (!line.startsWith("|")) return null;
  const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
  if (!cells.length) return null;
  if (cells.every((cell) => /^:?-+:?$/.test(cell))) return "sep" as const;
  return cells;
}

export function parseMain(source: string): HandoffBlock[] {
  const blocks: HandoffBlock[] = [];
  let list: string[] = [];
  let tableRows: string[][] = [];

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: list });
      list = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length >= 2) {
      blocks.push({ type: "table", headers: tableRows[0], rows: tableRows.slice(1) });
    }
    tableRows = [];
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      flushTable();
      continue;
    }
    const tableRow = parseTableRow(line);
    if (tableRow) {
      flushList();
      if (tableRow !== "sep") tableRows.push(tableRow);
      continue;
    }
    flushTable();
    if (
      line === "### SECTION" ||
      line === "### HEADER" ||
      line === "### FOOTER" ||
      line === "### MAIN"
    ) {
      break;
    }
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) });
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }
    if (line.startsWith("### ")) {
      const heading = line.slice(4);
      if (NOISE.has(heading)) continue;
      blocks.push({ type: "h3", text: heading });
      continue;
    }
    const image = parseImage(line);
    if (image) {
      blocks.push({ type: "image", ...image });
      continue;
    }
    const link = parseInlineLink(line);
    if (link) {
      blocks.push({ type: "link", ...link });
      continue;
    }
    blocks.push({ type: "p", text: line });
  }
  flushList();
  flushTable();
  return blocks.filter((block) => {
    if (block.type === "p" || block.type === "h2" || block.type === "h3") {
      return !NOISE.has(block.text);
    }
    return true;
  });
}

const NOISE = new Set([
  "โซลูชัน",
  "ไทย",
  "Solutions",
  "/",
  "Insights",
  "อุปสงค์",
  "หน้าแรก",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "01",
  "02",
  "03",
  "Grow Revenue",
  "Grow Demand",
  "Grow Capability",
  "SECTION",
  "HEADER",
  "FOOTER",
  "MAIN",
  "แนวทางการทำงาน",
  "บทความและมุมมอง",
  "ผลงานลูกค้า",
  "เกี่ยวกับเรา",
  "ติดต่อเรา",
  "Approach",
  "Case Studies",
  "About",
  "Contact",
  "English",
  "Русский",
  "繁體中文",
  "All solutions",
  "Related solutions",
  "Related Insights",
  "Free Hotel Tools",
  "Common questions",
  "Request an audit",
  "Discuss this solution",
  "Discuss your question",
  "Educational & discovery guide",
  "Revenue · Direct Booking · Commercial Growth",
  "Commercial approach",
  "Channel roles",
  "Purpose of this guide",
]);

export function handoffRoutes() {
  return pages.map((page) => page.route);
}
