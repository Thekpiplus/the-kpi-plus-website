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

type NavItem =
  | { kind: "topic"; id: InsightTopicId }
  | { kind: "sort"; id: InsightSortId };

/** Single chip row: All → Latest → Relevant → topics. */
const INSIGHT_NAV_ITEMS: NavItem[] = [
  { kind: "topic", id: "all" },
  { kind: "sort", id: "latest" },
  { kind: "sort", id: "relevant" },
  ...INSIGHT_TOPIC_IDS.filter((id) => id !== "all").map((id) => ({ kind: "topic" as const, id })),
];

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
          {INSIGHT_NAV_ITEMS.map((item) => {
            if (item.kind === "sort") {
              const href = insightIndexHref(insightsHref, { ...query, sort: item.id, page: 1 });
              const active = sort === item.id;
              const label = item.id === "latest" ? t.sortLatest : t.sortRelevant;
              return (
                <li key={`sort-${item.id}`}>
                  <Link
                    href={href}
                    scroll={false}
                    className={`kpi-insight-topic${active ? " is-active" : ""}${isTh ? "" : " kpi-latin"}`}
                    aria-current={active ? "true" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            }

            const href = insightIndexHref(insightsHref, { ...query, topic: item.id, page: 1 });
            const active = activeTopic === item.id;
            const label = item.id === "all" ? t.allTopics : INSIGHT_TOPIC_LABELS[item.id];
            const latin = item.id !== "all" || !isTh;
            return (
              <li key={`topic-${item.id}`}>
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

      {showSearch ? (
        <div className="kpi-insight-control-row">
          <InsightsIndexSearch
            insightsHref={insightsHref}
            topic={activeTopic}
            sort={sort}
            q={q}
            label={t.searchLabel}
            placeholder={t.searchPlaceholder}
            submit={t.searchSubmit}
          />
        </div>
      ) : null}
    </div>
  );
}
