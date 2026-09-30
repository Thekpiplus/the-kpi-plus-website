import { setLeadArchiveState } from "@/lib/crm/actions";

export function LeadArchiveButton({
  leadId,
  archived,
  compact = false,
}: {
  leadId: string;
  archived: boolean;
  compact?: boolean;
}) {
  return (
    <form action={setLeadArchiveState}>
      <input type="hidden" name="leadId" value={leadId} />
      <input type="hidden" name="archived" value={archived ? "0" : "1"} />
      <button className={compact ? "crm-button-quiet" : "kpi-button"} type="submit">
        {archived ? "นำกลับมาใช้" : "เก็บลีด"}
      </button>
    </form>
  );
}
