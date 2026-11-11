import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setPageLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getPageLenis() {
  return lenis;
}

function stickyHeaderOffset() {
  if (typeof document === "undefined") return 0;
  const header = document.querySelector(".kpi-header");
  if (header instanceof HTMLElement) {
    const position = getComputedStyle(header).position;
    if (position === "fixed" || position === "sticky") {
      return Math.ceil(header.getBoundingClientRect().height) + 8;
    }
  }
  // Match html { scroll-padding-top: 5.25rem } when Lenis bypasses CSS scroll-margin.
  const pad = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || "0");
  return Number.isFinite(pad) ? Math.ceil(pad) : 84;
}

/** Scroll to the page top (sticky site header). */
export function scrollPageToTop(options?: { immediate?: boolean }) {
  if (typeof window === "undefined") return;
  const immediate = options?.immediate ?? true;
  if (lenis) {
    lenis.scrollTo(0, { immediate, force: true });
  }
  window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function scrollPageToHash(hash: string, options?: { immediate?: boolean }) {
  if (typeof window === "undefined" || !hash) return false;
  const target = hash.startsWith("#") ? hash : `#${hash}`;
  const el = document.querySelector(target);
  if (!(el instanceof HTMLElement)) return false;

  const immediate = options?.immediate ?? false;
  const offset = stickyHeaderOffset();
  const scrollY = lenis?.scroll ?? window.scrollY;
  const top = Math.max(0, el.getBoundingClientRect().top + scrollY - offset);

  if (lenis) {
    lenis.scrollTo(el, { immediate, force: true, offset: -offset });
  }
  // Keep window scroll in sync on immediate jumps — Lenis-only updates can leave
  // native position stale on long mobile pages and make CTAs feel stuck.
  if (!lenis || immediate) {
    window.scrollTo({ top, left: 0, behavior: immediate || !lenis ? "auto" : "smooth" });
    if (immediate) {
      document.documentElement.scrollTop = top;
      document.body.scrollTop = top;
    }
  }
  return true;
}

/** Retry until the hash target exists or attempts run out (late-mounted sections). */
export function scrollPageToHashWhenReady(hash: string, options?: { immediate?: boolean; attempts?: number }) {
  if (typeof window === "undefined" || !hash) return;
  const attempts = options?.attempts ?? 12;
  const immediate = options?.immediate ?? false;
  let left = attempts;

  const tick = () => {
    if (scrollPageToHash(hash, { immediate: immediate || left > attempts - 2 })) return;
    left -= 1;
    if (left <= 0) return;
    window.setTimeout(tick, 50);
  };

  requestAnimationFrame(tick);
}

/** Beat Next.js scroll restoration after client navigations. */
export function ensurePageScrollPosition(hash?: string) {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const run = (immediate: boolean) => {
    if (hash) scrollPageToHashWhenReady(hash, { immediate, attempts: 16 });
    else scrollPageToTop({ immediate: true });
  };

  run(true);
  window.setTimeout(() => run(Boolean(hash) ? reduce : true), 0);
  window.setTimeout(() => run(reduce), 120);
  window.setTimeout(() => run(reduce), 320);
}
