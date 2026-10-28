import { WEBSITE_WORKFLOW_HANDOVER } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

function markLatin(text: string) {
  const parts = text.split(/(Booking Engine|CMS|Analytics|Search Console)/g);
  return parts.map((part, index) =>
    /^(Booking Engine|CMS|Analytics|Search Console)$/.test(part) ? (
      <span key={`${part}-${index}`} className="kpi-latin">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function WebsiteWorkflowHandover({
  locale,
  items,
}: {
  locale: Locale;
  items?: Array<{ id?: string; label?: string }>;
}) {
  const thai = locale === "th";
  const rows = items?.length
    ? items.map((item, index) => ({
        id: item.id || WEBSITE_WORKFLOW_HANDOVER[index]?.id || `hand-${index + 1}`,
        label: item.label?.trim() || (thai ? WEBSITE_WORKFLOW_HANDOVER[index]?.th : WEBSITE_WORKFLOW_HANDOVER[index]?.en) || "",
      }))
    : WEBSITE_WORKFLOW_HANDOVER.map((item) => ({ id: item.id, label: thai ? item.th : item.en }));
  return (
    <div className="web-workflow-handover">
      <h3>{thai ? "รายการตรวจส่งมอบ" : "Handover checklist"}</h3>
      <p className="web-workflow-handover-lead">
        {thai
          ? "รายการนี้เป็นตัวอย่างการตรวจส่งมอบ ไม่ใช่สถานะโปรเจกต์โรงแรมรายใด"
          : "This is a sample handover checklist, not a live hotel project status."}
      </p>
      <ul>
        {rows.map((item) => (
          <li key={item.id}>
            <span className="web-workflow-check" aria-hidden="true" />
            <span>{markLatin(item.label)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
