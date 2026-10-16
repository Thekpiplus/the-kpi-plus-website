import { insightPosts } from "@/lib/insights";
import { cmsDb, getSetting, listDocuments } from "./queries";

export const INSIGHT_ORDER_SETTING = "insightOrder";

type InsightOrderValue = { slugs: string[] };

function parseOrder(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as InsightOrderValue;
    if (!Array.isArray(parsed?.slugs)) return [];
    return parsed.slugs.map((slug) => String(slug).trim()).filter(Boolean);
  } catch {
    return [];
  }
}

/** All CMS + site insight slugs that appear in the CRM list (not trashed). */
export async function listInsightSlugsForOrder() {
  const docs = await listDocuments("insight");
  const cmsSlugs = new Set(docs.map((doc) => doc.slug));
  const site = insightPosts.filter((post) => !cmsSlugs.has(post.slug));
  const byDate = [
    ...docs.map((doc) => ({
      slug: doc.slug,
      published: (doc.publishedAt ?? doc.createdAt).toISOString().slice(0, 10),
    })),
    ...site.map((post) => ({ slug: post.slug, published: post.published })),
  ].sort((a, b) => b.published.localeCompare(a.published));
  return byDate.map((item) => item.slug);
}

export async function getStoredInsightOrder() {
  const setting = await getSetting(INSIGHT_ORDER_SETTING).catch(() => null);
  return parseOrder(setting?.value);
}

/** Merge stored order with current articles; new ones append by date. */
export async function resolveInsightOrder(slugs?: string[]) {
  const available = slugs ?? (await listInsightSlugsForOrder());
  const availableSet = new Set(available);
  const stored = await getStoredInsightOrder();
  const ordered: string[] = [];
  for (const slug of stored) {
    if (availableSet.has(slug) && !ordered.includes(slug)) ordered.push(slug);
  }
  for (const slug of available) {
    if (!ordered.includes(slug)) ordered.push(slug);
  }
  return ordered;
}

export function sortByInsightOrder<T extends { slug: string }>(items: T[], order: string[]) {
  const rank = new Map(order.map((slug, index) => [slug, index]));
  return [...items].sort((a, b) => {
    const ai = rank.has(a.slug) ? rank.get(a.slug)! : Number.MAX_SAFE_INTEGER;
    const bi = rank.has(b.slug) ? rank.get(b.slug)! : Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return 0;
  });
}

export async function saveInsightOrder(slugs: string[]) {
  const value = JSON.stringify({ slugs } satisfies InsightOrderValue);
  const db = await cmsDb();
  await db.cmsSetting.upsert({
    where: { id: INSIGHT_ORDER_SETTING },
    create: { id: INSIGHT_ORDER_SETTING, value },
    update: { value },
  });
}
