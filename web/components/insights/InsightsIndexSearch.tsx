"use client";

import { useRouter } from "next/navigation";
import { insightIndexHref, type InsightSortId, type InsightTopicId } from "@/lib/insights";

export function InsightsIndexSearch({
  insightsHref,
  topic,
  sort,
  q,
  label,
  placeholder,
  submit,
}: {
  insightsHref: string;
  topic: InsightTopicId;
  sort: InsightSortId;
  q: string;
  label: string;
  placeholder: string;
  submit: string;
}) {
  const router = useRouter();

  return (
    <form
      className="kpi-insight-search"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const next = String(new FormData(event.currentTarget).get("q") ?? "");
        router.replace(insightIndexHref(insightsHref, { topic, sort, q: next }), { scroll: false });
      }}
    >
      <label className="kpi-insight-search-field">
        <span className="sr-only">{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>
      <button type="submit" className="kpi-insight-search-submit">
        {submit}
      </button>
    </form>
  );
}
