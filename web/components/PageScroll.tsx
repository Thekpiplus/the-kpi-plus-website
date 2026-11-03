"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  ensurePageScrollPosition,
  scrollPageToHashWhenReady,
  scrollPageToTop,
  setPageLenis,
} from "@/lib/page-scroll";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isMenuNavigationLink(anchor: HTMLAnchorElement) {
  return Boolean(
    anchor.closest(".kpi-header, .kpi-mobile-drawer, .kpi-footer, .kpi-solutions-menu, .kpi-header-lang-menu"),
  );
}

export function PageScroll() {
  const pathname = usePathname();
  const fromHistory = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hash = window.location.hash;

    if (reduceMotion) {
      if (fromHistory.current) {
        fromHistory.current = false;
        return;
      }
      ensurePageScrollPosition(hash || undefined);
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.15,
      anchors: false,
      allowNestedScroll: true,
    });
    setPageLenis(lenis);

    if (fromHistory.current) {
      fromHistory.current = false;
      if (hash) ensurePageScrollPosition(hash);
    } else {
      ensurePageScrollPosition(hash || undefined);
    }

    return () => {
      setPageLenis(null);
      lenis.destroy();
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isModifiedClick(event) || event.defaultPrevented) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isMenuNavigationLink(anchor)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const samePath = url.pathname === window.location.pathname && url.search === window.location.search;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Same-route hash (e.g. footer category → /solutions#grow-revenue): pathname
      // does not change, so the route effect will not run — scroll here.
      if (samePath && url.hash) {
        requestAnimationFrame(() => {
          scrollPageToHashWhenReady(url.hash, { immediate: reduceMotion, attempts: 16 });
        });
        return;
      }

      // Same-route plain link (e.g. "ดูโซลูชันทั้งหมด" while already on /solutions):
      // jump back up under the sticky header.
      if (samePath && !url.hash) {
        requestAnimationFrame(() => {
          scrollPageToTop({ immediate: true });
          window.setTimeout(() => scrollPageToTop({ immediate: true }), 120);
        });
        return;
      }

      // Cross-route menu/footer link without hash: preemptively reset so the new
      // page does not inherit the previous mid-page Lenis offset.
      if (!samePath && !url.hash) {
        scrollPageToTop({ immediate: true });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const root = document.querySelector(".kpi-shell");
    if (!root) return;

    const sections = root.querySelectorAll("main > section, footer");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    sections.forEach((section, index) => {
      section.classList.add("kpi-scroll-section");
      if (index === 0) {
        section.classList.add("is-inview");
        return;
      }
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
