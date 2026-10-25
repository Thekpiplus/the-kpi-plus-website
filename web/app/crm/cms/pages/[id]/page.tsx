import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";
import { RevenuePageEditor } from "@/components/cms/RevenuePageEditor";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { trashDocument } from "@/lib/cms/actions";
import { editorStateForDocument, saveRevenuePage } from "@/lib/cms/revenue-page-actions";
import { isRevenuePageDocument } from "@/lib/cms/revenue-page";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";

export default async function EditCmsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; tab?: string }>;
}) {
  const { id } = await params;
  const { error, saved, tab } = await searchParams;
  const document = await documentById(id);
  if (!document || document.kind !== "page") notFound();

  const path = documentPath(document);
  const revenue = isRevenuePageDocument(document);

  if (revenue) {
    const hydrated = await editorStateForDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <RevenuePageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveRevenuePage}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title={document.title}
        description={path}
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms" className="crm-users-secondary">
              ← หน้าเพจทั้งหมด
            </Link>
            {document.status === "published" ? (
              <a href={path} className="crm-users-secondary" target="_blank" rel="noreferrer">
                เปิดดู
              </a>
            ) : null}
          </div>
        }
      />
      <CmsDocumentForm kind="page" document={document} error={error} saved={saved === "1"} />
      <div className="crm-cms-editor-danger">
        <div>
          <p>ลบหน้าเพจ</p>
          <span>ย้ายเข้าถังขยะ หน้านี้จะไม่แสดงบนเว็บ</span>
        </div>
        <ConfirmDeleteButton
          action={trashDocument}
          fields={{ id: document.id, returnTo: "/crm/cms" }}
          itemName={document.title}
          eyebrow="Content"
          title="ย้ายเข้าถังขยะ"
          message={`ยืนยันย้าย “${document.title}” เข้าถังขยะ?`}
          buttonLabel="ลบหน้าเพจ"
          confirmLabel="ลบหน้าเพจ"
          className="kpi-button crm-users-delete-btn"
        />
      </div>
    </div>
  );
}
