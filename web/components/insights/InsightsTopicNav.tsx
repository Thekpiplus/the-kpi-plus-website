import Link from "next/link";
import { InsightsIndexSearch } from "@/components/insights/InsightsIndexSearch";
import {
  INSIGHT_TOPIC_IDS,
  INSIGHT_TOPIC_LABELS,
  insightIndexHref,
  insightsIndexCopy,
  type InsightSortId,
  type InsightTopicId,
} from "@/lib/insights";
import type { Locale } from "@/lib/seo";

export function InsightsTopicNav({
  locale,
  insightsHref,
  activeTopic,
  sort,
  q,
  showSearch = false,
}: {
  locale: Locale;
  insightsHref: string;
  activeTopic: InsightTopicId;
  sort: InsightSortId;
  q: string;
  showSearch?: boolean;
}) {
  const t = insightsIndexCopy[locale];
  const isTh = locale === "th";
  const query = { topic: activeTopic, sort, q };

  return (
    <div className="kpi-insight-controls">
      <nav className="kpi-insight-topics" aria-label={t.topicsNav} aria-controls="insight-feed">
        <ul className="kpi-insight-topics-scroller" data-lenis-prevent>
          {INSIGHT_TOPIC_IDS.map((id) => {
            const href = insightIndexHref(insightsHref, { ...query, topic: id, page: 1 });
            const active = activeTopic === id;
            const label = id === "all" ? t.allTopics : INSIGHT_TOPIC_LABELS[id];
            const latin = id !== "all" || !isTh;
            return (
              <li key={id}>
                <Link
                  href={href}
                  scroll={false}
                  className={`kpi-insight-topic${active ? " is-active" : ""}${latin ? " kpi-latin" : ""}`}
                  aria-current={active ? "true" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="kpi-insight-control-row">
        <nav className="kpi-insight-sort" aria-label={t.sortNav} aria-controls="insight-feed">
          <Link
            href={insightIndexHref(insightsHref, { ...query, sort: "relevant", page: 1 })}
            scroll={false}
            className={`kpi-insight-sort-link${sort === "relevant" ? " is-active" : ""}${isTh ? "" : " kpi-latin"}`}
            aria-current={sort === "relevant" ? "true" : undefined}
          >
            {t.sortRelevant}
          </Link>
          <Link
            href={insightIndexHref(insightsHref, { ...query, sort: "latest", page: 1 })}
            scroll={false}
            className={`kpi-insight-sort-link${sort === "latest" ? " is-active" : ""}${isTh ? "" : " kpi-latin"}`}
            aria-current={sort === "latest" ? "true" : undefined}
          >
            {t.sortLatest}
          </Link>
        </nav>
        {showSearch ? (
          <InsightsIndexSearch
            insightsHref={insightsHref}
            topic={activeTopic}
            sort={sort}
            q={q}
            label={t.searchLabel}
            placeholder={t.searchPlaceholder}
            submit={t.searchSubmit}
          />
        ) : null}
      </div>
    </div>
  );
}
