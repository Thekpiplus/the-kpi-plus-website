import Link from "next/link";
import type { PipelineView } from "@/components/crm/pipeline-types";

const VIEWS: { id: PipelineView; label: string }[] = [
  { id: "table", label: "ตาราง" },
  { id: "kanban", label: "คานบัน" },
  { id: "calendar", label: "ปฏิทิน" },
];

export function PipelineViewSwitch({
  view,
  month,
}: {
  view: PipelineView;
  month?: string;
}) {
  return (
    <nav className="crm-pipe-switch" aria-label="มุมมอง Pipeline">
      {VIEWS.map((item) => {
        const query = new URLSearchParams({ view: item.id });
        if (item.id === "calendar" && month) query.set("month", month);
        return (
          <Link
            key={item.id}
            href={`/crm/pipeline?${query.toString()}`}
            aria-current={view === item.id ? "page" : undefined}
            className={view === item.id ? "is-active" : undefined}
            title={item.label}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
