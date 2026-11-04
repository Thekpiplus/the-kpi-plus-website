import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";
import { HotelMarketingInsightEditor } from "@/components/cms/HotelMarketingInsightEditor";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { trashDocument } from "@/lib/cms/actions";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";
import { isHotelMarketingInsightDocument } from "@/lib/cms/hotel-marketing-insight";
import {
  duplicateHotelMarketingInsightFromForm,
  editorStateForHotelMarketingDocument,
  saveHotelMarketingInsight,
} from "@/lib/cms/hotel-marketing-insight-actions";

export default async function EditCmsInsightPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; tab?: string }>;
}) {
  const { id } = await params;
  const { error, saved, tab } = await searchParams;
  const document = await documentById(id);
  if (!document || document.kind !== "insight") notFound();

  const hotelMarketing = isHotelMarketingInsightDocument(document);
  const hydrated = hotelMarketing ? await editorStateForHotelMarketingDocument(id) : null;
  if (hotelMarketing && !hydrated) notFound();

  const current = hydrated?.document ?? document;
  const path = documentPath(current);

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title={current.title}
        description={path}
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms/insights" className="crm-users-secondary">
              ← บทความทั้งหมด
            </Link>
            {hotelMarketing ? (
              <Link href={`/crm/cms/insights/${current.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            ) : null}
            {current.status === "published" ? (
              <a href={path} className="crm-users-secondary" target="_blank" rel="noreferrer">
                เปิดดู
              </a>
            ) : null}
          </div>
        }
      />
      {hydrated ? (
        <HotelMarketingInsightEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveHotelMarketingInsight}
          duplicateAction={duplicateHotelMarketingInsightFromForm}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/insights/${hydrated.document.id}/preview`}
          publicHref={path}
        />
      ) : (
        <CmsDocumentForm kind="insight" document={document} error={error} saved={saved === "1"} />
      )}
      <div className="crm-cms-editor-danger">
        <div>
          <p>ลบบทความ</p>
          <span>ย้ายเข้าถังขยะ บทความจะไม่แสดงบนเว็บ</span>
        </div>
        <ConfirmDeleteButton
          action={trashDocument}
          fields={{ id: current.id, returnTo: "/crm/cms/insights" }}
          itemName={current.title}
          eyebrow="Content"
          title="ย้ายเข้าถังขยะ"
          message={`ยืนยันย้าย “${current.title}” เข้าถังขยะ?`}
          buttonLabel="ลบบทความ"
          confirmLabel="ลบบทความ"
          className="kpi-button crm-users-delete-btn"
        />
      </div>
    </div>
  );
}
