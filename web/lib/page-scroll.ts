import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setPageLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getPageLenis() {
  return lenis;
}

/** Scroll to the page top (sticky site header). */
export function scrollPageToTop(options?: { immediate?: boolean }) {
  if (typeof window === "undefined") return;
  const immediate = options?.immediate ?? true;
  if (lenis) {
    lenis.scrollTo(0, { immediate, force: true });
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function scrollPageToHash(hash: string, options?: { immediate?: boolean }) {
  if (typeof window === "undefined" || !hash) return;
  const target = hash.startsWith("#") ? hash : `#${hash}`;
  const immediate = options?.immediate ?? false;
  if (lenis) {
    lenis.scrollTo(target, { immediate, force: true });
    return;
  }
  const el = document.querySelector(target);
  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: immediate ? "auto" : "smooth", block: "start" });
  }
}
