"use client";

import { useEffect, useId, useState } from "react";
import { insightHeadingId } from "@/lib/insights";

type Heading = { text: string };

export function ArticleToc({
  headings,
  label,
  openLabel,
}: {
  headings: Heading[];
  label: string;
  openLabel: string;
}) {
  const titleId = useId();
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nodes = headings
      .map((heading) => document.getElementById(insightHeadingId(heading.text)))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] },
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

  function renderList(keyPrefix: string) {
    return (
      <ol className="kpi-article-toc-list">
        {headings.map((heading, index) => {
          const id = insightHeadingId(heading.text);
          return (
            <li key={`${keyPrefix}-${id}`}>
              <a
                href={`#${id}`}
                className={activeId === id ? "is-active" : undefined}
                aria-current={activeId === id ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="kpi-article-toc-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="kpi-article-toc-text">{heading.text}</span>
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
        <summary>
          <span>{openLabel}</span>
          <span aria-hidden="true" className="kpi-article-toc-chevron">
            {open ? "−" : "+"}
          </span>
        </summary>
        {renderList("mobile")}
      </details>

      <nav className="kpi-article-toc kpi-article-toc-rail" aria-labelledby={titleId}>
        <p id={titleId} className="kpi-article-toc-title">
          {label}
        </p>
        {renderList("rail")}
      </nav>
    </>
  );
}
