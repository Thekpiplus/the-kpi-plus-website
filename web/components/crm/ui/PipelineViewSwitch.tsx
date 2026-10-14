import Link from "next/link";
import type { PipelineView } from "@/components/crm/pipeline-types";

const VIEWS: { id: PipelineView; label: string }[] = [
  { id: "table", label: "Table" },
  { id: "kanban", label: "Kanban" },
  { id: "calendar", label: "Calendar" },
];

export function PipelineViewSwitch({
  view,
  month,
}: {
  view: PipelineView;
  month?: string;
}) {
  return (
    <div className="crm-pipe-switch" role="tablist" aria-label="มุมมอง Pipeline">
      {VIEWS.map((item) => {
        const query = new URLSearchParams({ view: item.id });
        if (item.id === "calendar" && month) query.set("month", month);
        return (
          <Link
            key={item.id}
            href={`/crm/pipeline?${query.toString()}`}
            role="tab"
            aria-selected={view === item.id}
            className={view === item.id ? "is-active" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
