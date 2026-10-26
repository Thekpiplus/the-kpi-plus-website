import Link from "next/link";
import { notFound } from "next/navigation";
import { ReservationsView } from "@/components/ReservationsView";
import { RevenueView } from "@/components/RevenueView";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { loadReservationsPagePreview } from "@/lib/cms/reservations-page-public";
import { isReservationsPageDocument } from "@/lib/cms/reservations-page";
import { loadRevenuePagePreview } from "@/lib/cms/revenue-page-public";
import { isRevenuePageDocument } from "@/lib/cms/revenue-page";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";

export default async function PreviewCmsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await documentById(id);
  if (!document || document.kind !== "page" || document.trashedAt) notFound();

  const reservations = isReservationsPageDocument(document);
  const revenue = isRevenuePageDocument(document);
  if (!reservations && !revenue) notFound();

  const preview = reservations ? await loadReservationsPagePreview(id) : null;
  const revenuePreview = revenue ? await loadRevenuePagePreview(id) : null;
  const live = preview?.live ?? revenuePreview?.live ?? false;
  if (!preview && !revenuePreview) notFound();
  const path = documentPath(document);
  const title = reservations ? "ตัวอย่างหน้า Outsourced Hotel Reservations" : "ตัวอย่างหน้า Revenue & Commercial";

  return (
    <div className="crm-cms crm-cs-preview">
      <PageHeader
        eyebrow="Content Management"
        title={title}
        description={live ? "มุมมองสาธารณะของหน้าที่เผยแพร่แล้ว" : "ตัวอย่างในระบบ — ยังไม่แทนที่เนื้อหาในโค้ดบนเว็บสาธารณะ"}
        actions={
          <div className="crm-cms-actions">
            <Link href={`/crm/cms/pages/${document.id}`} className="crm-users-secondary">
              ← กลับไปแก้ไข
            </Link>
            <Link href="/crm/cms" className="crm-users-secondary">
              หน้าเพจทั้งหมด
            </Link>
          </div>
        }
      />
      <p className={`crm-users-alert ${live ? "is-ok" : "is-warn"}`} role="status">
        {live
          ? `หน้านี้อยู่ในสถานะ Published และจะแสดงบน ${path}`
          : "บันทึกแล้ว — ตัวอย่างนี้ยังไม่เป็นสาธารณะ จนกว่าจะเผยแพร่"}
      </p>
      <div className="crm-cs-preview-frame">
        {preview ? (
          <ReservationsView locale={preview.locale} previewContent={preview.content} embedded />
        ) : revenuePreview ? (
          <RevenueView locale={revenuePreview.locale} previewContent={revenuePreview.content} embedded />
        ) : null}
      </div>
    </div>
  );
}
