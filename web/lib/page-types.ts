import { barePath } from "./seo";

export type PageKind =
  | "home"
  | "about"
  | "contact"
  | "solution"
  | "solutionsIndex"
  | "insightsIndex"
  | "article"
  | "caseStudies"
  | "partner"
  | "tool"
  | "other";

export function pageKind(route: string): PageKind {
  const bare = barePath(route);
  if (bare === "/") return "home";
  if (bare === "/about") return "about";
  if (bare === "/contact") return "contact";
  if (bare === "/solutions") return "solutionsIndex";
  if (bare.startsWith("/solutions/")) return "solution";
  if (bare === "/insights") return "insightsIndex";
  if (bare.startsWith("/insights/")) return "article";
  if (bare === "/case-studies") return "caseStudies";
  if (bare === "/partner") return "partner";
  if (bare.startsWith("/tools/")) return "tool";
  return "other";
}

export function hasOwnBreadcrumbs(route: string) {
  const kind = pageKind(route);
  return kind === "home" || kind === "solution" || kind === "article";
}
