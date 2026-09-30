import { insightPosts } from "@/lib/insights";
import { pages } from "@/lib/seo";

const extraLocked = new Set([
  "/admin",
  "/crm",
  "/partners",
  "/partners/login",
  "/partner",
]);

export function lockedPublicRoutes() {
  return new Set([...pages.map((page) => page.route), ...insightPosts.map((post) => post.href), ...extraLocked]);
}

export function isLockedRoute(route: string) {
  return lockedPublicRoutes().has(route);
}

export function lockedPageList() {
  return pages
    .filter((page) => !page.route.startsWith("/admin") && !page.route.startsWith("/crm") && !page.route.startsWith("/partners"))
    .map((page) => ({
      route: page.route,
      title: page.title,
      language: page.language,
    }));
}
