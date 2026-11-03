/** Client-safe locale helpers (no fs). Thai is the default locale and has no URL prefix. */
export const SOL_LOCALES = ["th", "en", "ru", "zh"] as const;
export type SolLocale = (typeof SOL_LOCALES)[number];

export function localizedRoute(route: string, locale: SolLocale) {
  if (!route) return "";
  if (locale === "th") return route;
  return `/${locale}${route}`;
}
