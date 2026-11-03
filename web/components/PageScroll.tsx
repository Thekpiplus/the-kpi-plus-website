"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { scrollPageToTop, setPageLenis, scrollPageToHash } from "@/lib/page-scroll";

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
    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (fromHistory.current) {
        fromHistory.current = false;
        return;
      }
      if (!window.location.hash) scrollPageToTop({ immediate: true });
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.15,
      anchors: true,
      allowNestedScroll: true,
    });
    setPageLenis(lenis);

    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        scrollPageToHash(hash, { immediate: false });
      });
    } else if (fromHistory.current) {
      fromHistory.current = false;
    } else {
      scrollPageToTop({ immediate: true });
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

      // Section links keep their own target (e.g. /#audit).
      if (url.hash) return;

      const samePath = url.pathname === window.location.pathname && url.search === window.location.search;
      if (!samePath) return;

      // Same page menu click: scroll up to the sticky header.
      requestAnimationFrame(() => {
        scrollPageToTop({
          immediate: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
      });
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
