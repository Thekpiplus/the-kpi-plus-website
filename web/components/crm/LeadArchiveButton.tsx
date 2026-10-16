"use client";

import { setLeadArchiveState } from "@/lib/crm/actions";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";

export function LeadArchiveButton({
  leadId,
  archived,
  compact = false,
  leadName = "ลีดนี้",
}: {
  leadId: string;
  archived: boolean;
  compact?: boolean;
  leadName?: string;
}) {
  const buttonClass = compact ? "crm-button-quiet" : "kpi-button";

  if (archived) {
    return (
      <form action={setLeadArchiveState}>
        <input type="hidden" name="leadId" value={leadId} />
        <input type="hidden" name="archived" value="0" />
        <button className={buttonClass} type="submit">
          นำกลับมาใช้
        </button>
      </form>
    );
  }

  return (
    <ConfirmDeleteButton
      action={setLeadArchiveState}
      fields={{ leadId, archived: "1" }}
      itemName={leadName}
      eyebrow="Lead"
      title="เก็บลีด"
      message={`ยืนยันเก็บ “${leadName}” ออกจากรายการหลัก? เรียกคืนได้จากหน้ารายการลีดที่เก็บไว้`}
      buttonLabel="เก็บลีด"
      confirmLabel="เก็บลีด"
      className={buttonClass}
    />
  );
}
