import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/lib/seo";

export type CmsNavLink = {
  href: string;
  label: string;
  locale: string;
  menu: "header" | "footer";
  position: number;
};

export type CmsRedirectFile = {
  fromPath: string;
  toPath: string;
  statusCode: number;
};

const NAV_FILE = join(process.cwd(), "content", "cms-nav.json");
const REDIRECT_FILE = join(process.cwd(), "content", "cms-redirects.json");

function readJson<T>(path: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export function loadCmsNav(): CmsNavLink[] {
  return readJson<CmsNavLink[]>(NAV_FILE, []);
}

export function saveCmsNav(links: CmsNavLink[]) {
  writeFileSync(NAV_FILE, `${JSON.stringify(links, null, 2)}\n`);
}

export function cmsHeaderLinks(locale: Locale) {
  return loadCmsNav()
    .filter((item) => item.menu === "header" && item.locale === locale)
    .sort((a, b) => a.position - b.position);
}

export function cmsFooterLinks(locale: Locale) {
  return loadCmsNav()
    .filter((item) => item.menu === "footer" && item.locale === locale)
    .sort((a, b) => a.position - b.position);
}

export function loadCmsRedirects(): CmsRedirectFile[] {
  return readJson<CmsRedirectFile[]>(REDIRECT_FILE, []);
}

export function saveCmsRedirects(items: CmsRedirectFile[]) {
  writeFileSync(REDIRECT_FILE, `${JSON.stringify(items, null, 2)}\n`);
}

export function matchCmsRedirect(pathname: string) {
  return loadCmsRedirects().find((item) => item.fromPath === pathname) ?? null;
}
