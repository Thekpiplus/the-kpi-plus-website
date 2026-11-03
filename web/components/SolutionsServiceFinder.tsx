"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { SOLUTION_CHALLENGES, type SolutionChallenge } from "@/lib/solutions-challenges";
import { barePath, type Locale } from "@/lib/seo";

type FinderItem = {
  href: string;
  label: string;
  problem?: string;
};

type FinderCopy = {
  sectionEyebrow: string;
  sectionTitle: string;
  startNote: string;
  challengeLegend: string;
  emptyTitle: string;
  emptyBody: string;
  resultTitle: string;
  resultLead: string;
  clearSelection: string;
  relatedWhy: string;
  details: string;
  browseAll: string;
  unsureHint: string;
  unsureCta: string;
  /** Decorative empty-state map — sample labels only, not diagnosis. */
  mapLabel?: string;
  mapSteps?: readonly string[];
};

export function SolutionsServiceFinder({
  locale,
  items,
  auditHref,
  copy,
  challenges = SOLUTION_CHALLENGES,
}: {
  locale: Locale;
  items: FinderItem[];
  auditHref: string;
  copy: FinderCopy;
  challenges?: SolutionChallenge[];
}) {
  const groupId = useId();
  const [selected, setSelected] = useState<string | null>(null);

  const itemByPath = useMemo(() => {
    const map = new Map<string, FinderItem>();
    for (const item of items) {
      map.set(barePath(item.href), item);
    }
    return map;
  }, [items]);

  const challenge = selected ? challenges.find((item) => item.id === selected) ?? null : null;

  const results = useMemo(() => {
    if (!challenge) return [];
    return challenge.matches
      .map((match) => {
        const item = itemByPath.get(match.href);
        if (!item) return null;
        return {
          href: item.href,
          label: item.label,
          problem: item.problem,
          reason: match.reason[locale] ?? match.reason.en,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [challenge, itemByPath, locale]);

  return (
    <section id="solutions" className="kpi-solutions-finder scroll-mt-28" aria-labelledby={`${groupId}-title`}>
      <div className="kpi-section kpi-solutions-finder-intro">
        <p className="kpi-kicker text-[#0B6660]">{copy.sectionEyebrow}</p>
        <h2 id={`${groupId}-title`} className="kpi-h2 mt-5">
          {copy.sectionTitle}
        </h2>
        <p className="kpi-solutions-finder-note">{copy.startNote}</p>
      </div>

      <div className="kpi-solutions-finder-panel">
        <div className="kpi-section kpi-solutions-finder-controls">
          <fieldset className="kpi-solutions-finder-fieldset">
            <legend className="kpi-solutions-finder-legend">{copy.challengeLegend}</legend>
            <div className="kpi-solutions-finder-chips" role="presentation">
              {challenges.map((item) => {
                const inputId = `${groupId}-${item.id}`;
                const checked = selected === item.id;
                return (
                  <label
                    key={item.id}
                    htmlFor={inputId}
                    className={`kpi-solutions-finder-chip${checked ? " is-selected" : ""}`}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`${groupId}-challenge`}
                      value={item.id}
                      checked={checked}
                      onChange={() => setSelected(item.id)}
                      className="kpi-solutions-finder-input"
                    />
                    <span>{item.label[locale] ?? item.label.en}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {selected ? (
            <button type="button" className="kpi-solutions-finder-clear" onClick={() => setSelected(null)}>
              {copy.clearSelection}
            </button>
          ) : null}
        </div>

        <div
          className="kpi-section kpi-solutions-finder-results"
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-labelledby={selected ? `${groupId}-result-title` : `${groupId}-empty-title`}
        >
          {!selected ? (
            <div className="kpi-solutions-finder-empty">
              <div className="kpi-solutions-finder-map" aria-hidden="true">
                <p className="kpi-solutions-finder-map-label">
                  {copy.mapLabel ?? "Challenge map — Sample"}
                </p>
                <ul className="kpi-solutions-finder-map-list">
                  {(
                    copy.mapSteps ?? [
                      "Revenue & Sales",
                      "Marketing & Booking",
                      "Website / Booking Journey",
                      "Systems & Data",
                      "Team & Operations",
                    ]
                  ).map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, "0")}</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="kpi-solutions-finder-empty-copy">
                <h3 id={`${groupId}-empty-title`} className="kpi-solutions-finder-empty-title">
                  {copy.emptyTitle}
                </h3>
                <p className="kpi-solutions-finder-empty-body">{copy.emptyBody}</p>
              </div>
            </div>
          ) : (
            <div className="kpi-solutions-finder-result">
              <h3 id={`${groupId}-result-title`} className="kpi-solutions-finder-result-title">
                {copy.resultTitle}
              </h3>
              <p className="kpi-solutions-finder-result-lead">{copy.resultLead}</p>

              {selected === "unsure" ? (
                <p className="kpi-solutions-finder-unsure">
                  {copy.unsureHint}{" "}
                  <Link href={auditHref} className="kpi-solutions-finder-unsure-link">
                    {copy.unsureCta}
                  </Link>
                </p>
              ) : null}

              <div className="kpi-solutions-finder-grid">
                {results.map((item) => (
                  <article key={item.href} className="kpi-card kpi-solutions-finder-card relative flex flex-col overflow-hidden p-7 sm:p-8">
                    <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                    <p className="kpi-solutions-finder-why">
                      <span className="kpi-solutions-finder-why-label">{copy.relatedWhy}</span> {item.reason}
                    </p>
                    <h4 className={`${locale === "en" ? "kpi-latin " : ""}mt-3 text-xl font-extrabold leading-snug text-[#0B1F33]`}>
                      {item.label}
                    </h4>
                    {item.problem ? <p className="mt-4 text-base leading-8 text-[#555555]">{item.problem}</p> : null}
                    <Link href={item.href} className="mt-auto pt-8 text-sm font-semibold text-[#0B6660]">
                      {copy.details}
                    </Link>
                  </article>
                ))}
              </div>

              <p className="kpi-solutions-finder-browse">
                <a href="#solutions-all">{copy.browseAll}</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
