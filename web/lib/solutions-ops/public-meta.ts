import { access, readFile } from "node:fs/promises";
import path from "node:path";

/** Read-only reference data from web/content (never written by this module). */

import { SOL_LOCALES, localizedRoute, type SolLocale } from "./locale-routes";

type ManifestEntry = {
  route: string;
  language: string;
  title?: string;
  description?: string;
  canonical?: string;
};

export type SolLocaleMeta = {
  locale: SolLocale;
  route: string;
  /** A Markdown page exists in web/content/pages for this locale. */
  contentExists: boolean;
  manifestTitle: string;
  manifestDescription: string;
  canonical: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function slugOf(route: string) {
  return route.split("/").filter(Boolean).pop() ?? "";
}

async function exists(file: string) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function loadManifest(): Promise<Map<string, ManifestEntry>> {
  try {
    const raw = await readFile(path.join(CONTENT_ROOT, "seo-manifest.json"), "utf8");
    const parsed = JSON.parse(raw) as ManifestEntry[];
    return new Map(parsed.map((entry) => [entry.route, entry]));
  } catch {
    return new Map();
  }
}

/** Per-service locale availability + manifest metadata. Routes without a slug return an empty list. */
export async function loadSolutionsLocaleMeta(routes: string[]): Promise<Map<string, SolLocaleMeta[]>> {
  const manifest = await loadManifest();
  const result = new Map<string, SolLocaleMeta[]>();
  for (const route of routes) {
    const slug = slugOf(route);
    if (!route || !slug) {
      result.set(route, []);
      continue;
    }
    const list: SolLocaleMeta[] = [];
    for (const locale of SOL_LOCALES) {
      const localized = localizedRoute(route, locale);
      const file = locale === "th" ? path.join(CONTENT_ROOT, "pages", "solutions", `${slug}.md`) : path.join(CONTENT_ROOT, "pages", locale, "solutions", `${slug}.md`);
      const entry = manifest.get(localized);
      list.push({
        locale,
        route: localized,
        contentExists: await exists(file),
        manifestTitle: entry?.title ?? "",
        manifestDescription: entry?.description ?? "",
        canonical: entry?.canonical ?? "",
      });
    }
    result.set(route, list);
  }
  return result;
}
