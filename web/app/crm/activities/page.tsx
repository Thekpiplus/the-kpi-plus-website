import { Suspense } from "react";
import { ActivitiesWorkspace } from "@/components/crm/activities/ActivitiesWorkspace";
import {
  classifyDue,
  formatBaht,
  formatDueLabel,
  mapActivityKind,
  shortCode,
  thaiActivityDetail,
  thaiActivityTitle,
  type ActivityCard,
} from "@/components/crm/activities/activity-types";
import { KIND_META } from "@/components/crm/activities/activity-types";
import { requireUser } from "@/lib/crm/auth";
import { openActivities } from "@/lib/crm/queries";
import { prisma } from "@/lib/crm/db";

export default async function ActivitiesPage() {
  await requireUser();
  const [rows, users] = await Promise.all([
    openActivities(),
    prisma().user.findMany({ select: { id: true, name: true } }),
  ]);
  const ownerName = new Map(users.map((user) => [user.id, user.name || "ยังไม่มอบหมาย"]));
  const now = new Date();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  const items: ActivityCard[] = rows.map((item) => {
    const due = classifyDue(item.dueAt, now);
    const kind = mapActivityKind(item.type, item.title);
    const ownerId = item.ownerId || item.lead.ownerId || "";
    return {
      id: item.id,
      leadId: item.lead.id,
      code: shortCode(item.id),
      kind,
      kindLabel: KIND_META[kind].label,
      title: thaiActivityTitle(item.type, item.title, item.lead.contactName),
      detail: thaiActivityDetail(item.notes, item.lead.stage?.nameTh || ""),
      contactName: item.lead.contactName,
      businessName: item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ",
      ownerName: ownerName.get(ownerId) || "ยังไม่มอบหมาย",
      valueLabel: formatBaht(item.lead.estimatedValue),
      dueAt: item.dueAt ? item.dueAt.toISOString() : null,
      dueLabel: formatDueLabel(item.dueAt),
      dueBucket: due.bucket,
      dayOffset: due.dayOffset,
      isOld: due.bucket === "overdue" && now.getTime() - item.dueAt.getTime() > weekMs,
      typeRaw: item.type,
    };
  });

  return (
    <Suspense fallback={<div className="kpi-act-a">กำลังโหลดกิจกรรม…</div>}>
      <ActivitiesWorkspace items={items} />
    </Suspense>
  );
}
