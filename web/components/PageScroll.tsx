"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function PageScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.15,
      anchors: true,
      allowNestedScroll: true,
    });

    const hash = window.location.hash;
    if (hash) {
      requestAnimationFrame(() => {
        lenis.scrollTo(hash);
      });
    }

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

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
