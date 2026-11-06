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
        const active = view === item.id;
        return (
          <Link
            key={item.id}
            href={`/crm/pipeline?${query.toString()}`}
            aria-current={active ? "page" : undefined}
            className={active ? "is-active" : undefined}
            title={item.label}
          >
            <span className="crm-pipe-switch-label">{item.label}</span>
            {active ? <span className="sr-only"> (กำลังแสดง)</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}
