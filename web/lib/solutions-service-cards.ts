import type { Locale } from "@/lib/seo";
import { MARKETING_CATEGORY_ID, marketingCategoryCard } from "@/lib/solutions-marketing-category";
import { REVENUE_CATEGORY_ID, revenueCategoryCard } from "@/lib/solutions-revenue-category";
import { SYSTEMS_CATEGORY_ID, systemsCategoryCard } from "@/lib/solutions-systems-category";

export type StandardizedServiceCard = {
  href: string;
  category: string;
  name: string;
  problem?: string;
  suitable?: string;
  deliverable?: string;
  /** Honest scope limit — shown when the source card defines it (e.g. Systems). */
  boundary?: string;
  latinName?: boolean;
};

/** Optional “Services can connect” chains — illustrative, not a required package. */
export const SOLUTIONS_CONNECT_CHAINS = {
  [REVENUE_CATEGORY_ID]: {
    id: "revenue",
    steps: {
      en: ["Revenue Strategy", "Channel / Rate Execution", "Performance Review"],
      th: ["กลยุทธ์รายได้", "ช่องทาง / ราคา", "ทบทวนผล"],
      ru: ["Revenue Strategy", "Channel / Rate", "Performance Review"],
      zh: ["收益策略", "通路／價格執行", "績效檢視"],
    },
  },
  [MARKETING_CATEGORY_ID]: {
    id: "marketing",
    steps: {
      en: ["Ads", "Website", "Booking Engine", "Measurement"],
      th: ["Ads", "Website", "Booking Engine", "Measurement"],
      ru: ["Ads", "Website", "Booking Engine", "Measurement"],
      zh: ["Ads", "Website", "Booking Engine", "Measurement"],
    },
  },
  [SYSTEMS_CATEGORY_ID]: {
    id: "systems",
    steps: {
      en: ["Systems", "Data Flow", "Team Training", "Ongoing Operations"],
      th: ["Systems", "Data Flow", "Team Training", "Ongoing Operations"],
      ru: ["Systems", "Data Flow", "Team Training", "Ongoing Operations"],
      zh: ["Systems", "Data Flow", "Team Training", "Ongoing Operations"],
    },
  },
} as const;

export type SolutionsConnectGroupId = keyof typeof SOLUTIONS_CONNECT_CHAINS;

export function solutionsConnectChain(groupId: string) {
  return SOLUTIONS_CONNECT_CHAINS[groupId as SolutionsConnectGroupId];
}

function pickLocale(map: Record<Locale, string> | undefined, locale: Locale) {
  if (!map) return undefined;
  return map[locale] ?? map.en;
}

/**
 * Normalize category-specific verified copy into one card shape.
 * Does not invent suitable/deliverable when the source group does not have them.
 */
export function standardizeServiceCard(input: {
  groupId: string;
  category: string;
  href: string;
  name: string;
  problem?: string;
  locale: Locale;
}): StandardizedServiceCard {
  const { groupId, category, href, name, problem, locale } = input;
  const latinName = locale === "en";

  if (groupId === REVENUE_CATEGORY_ID) {
    const card = revenueCategoryCard(href);
    return {
      href,
      category,
      name,
      latinName,
      problem: pickLocale(card?.problem, locale) ?? problem,
      suitable: pickLocale(card?.suitableFor, locale),
      deliverable: pickLocale(card?.deliverable, locale),
    };
  }

  if (groupId === MARKETING_CATEGORY_ID) {
    const card = marketingCategoryCard(href);
    return {
      href,
      category,
      name,
      latinName,
      problem: problem ?? pickLocale(card?.bestFit, locale),
      // bestFit mirrors the problem line for this group; omit duplicate “suitable”
      suitable: undefined,
      deliverable: pickLocale(card?.cover, locale),
    };
  }

  if (groupId === SYSTEMS_CATEGORY_ID) {
    const card = systemsCategoryCard(href);
    return {
      href,
      category,
      name,
      latinName,
      problem,
      suitable: undefined,
      deliverable: pickLocale(card?.summary, locale),
      boundary: pickLocale(card?.boundary, locale),
    };
  }

  return { href, category, name, latinName, problem };
}
