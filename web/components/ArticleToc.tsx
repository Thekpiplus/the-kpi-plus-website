"use client";

import { useEffect, useId, useRef, useState } from "react";

export type ArticleTocHeading = {
  id: string;
  text: string;
};

export function ArticleToc({
  headings,
  label,
  openLabel,
  currentLabel = "current section",
}: {
  headings: ArticleTocHeading[];
  label: string;
  openLabel: string;
  currentLabel?: string;
}) {
  const titleId = useId();
  const panelId = useId();
  const railRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const [open, setOpen] = useState(false);
  const [stickySafe, setStickySafe] = useState(true);

  useEffect(() => {
    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
          return;
        }

        // Fallback: nearest section above the reading line.
        const marker = window.scrollY + Math.min(window.innerHeight * 0.28, 180);
        let current = headings[0]?.id ?? "";
        for (const node of nodes) {
          const top = node.getBoundingClientRect().top + window.scrollY;
          if (top <= marker) current = node.id;
        }
        if (current) setActiveId(current);
      },
      { rootMargin: "-18% 0px -62% 0px", threshold: [0, 0.1, 0.25, 0.5, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    function onHash() {
      setOpen(false);
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    function updateStickySafe() {
      if (!rail) return;
      // Desktop TOC sits in its own column, so sticky never overlays article text.
      // Enable sticky whenever the shell has room for a side rail.
      setStickySafe(window.matchMedia("(min-width: 64rem)").matches);
    }

    updateStickySafe();
    window.addEventListener("resize", updateStickySafe);
    return () => window.removeEventListener("resize", updateStickySafe);
  }, [headings]);

  useEffect(() => {
    if (!activeId || !railRef.current) return;
    const activeLink = [...railRef.current.querySelectorAll<HTMLAnchorElement>("a")].find(
      (link) => link.getAttribute("href") === `#${activeId}`,
    );
    activeLink?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  function renderList(keyPrefix: string) {
    return (
      <ol className="kpi-article-toc-list">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          return (
            <li key={`${keyPrefix}-${heading.id}`}>
              <a
                href={`#${heading.id}`}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="kpi-article-toc-num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="kpi-article-toc-text">{heading.text}</span>
                {isActive ? <span className="sr-only">{` (${currentLabel})`}</span> : null}
              </a>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <>
      <details
        className="kpi-article-toc kpi-article-toc-mobile"
        open={open}
        onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
      >
        <summary aria-expanded={open} aria-controls={panelId}>
          <span>{openLabel}</span>
          <span aria-hidden="true" className="kpi-article-toc-chevron">
            {open ? "−" : "+"}
          </span>
        </summary>
        <nav id={panelId} className="kpi-article-toc-mobile-panel" aria-label={label}>
          {renderList("mobile")}
        </nav>
      </details>

      <nav
        ref={railRef}
        className={`kpi-article-toc kpi-article-toc-rail${stickySafe ? " is-sticky-safe" : ""}`}
        aria-labelledby={titleId}
      >
        <p id={titleId} className="kpi-article-toc-title">
          {label}
        </p>
        {renderList("rail")}
      </nav>
    </>
  );
}
