import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { trashDocument } from "@/lib/cms/actions";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";

export default async function EditCmsInsightPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const document = await documentById(id);
  if (!document || document.kind !== "insight") notFound();

  const path = documentPath(document);

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title={document.title}
        description={path}
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms/insights" className="crm-users-secondary">
              ← บทความทั้งหมด
            </Link>
            {document.status === "published" ? (
              <a href={path} className="crm-users-secondary" target="_blank" rel="noreferrer">
                เปิดดู
              </a>
            ) : null}
          </div>
        }
      />
      <CmsDocumentForm kind="insight" document={document} error={error} saved={saved === "1"} />
      <div className="crm-cms-editor-danger">
        <div>
          <p>ลบบทความ</p>
          <span>ย้ายเข้าถังขยะ บทความจะไม่แสดงบนเว็บ</span>
        </div>
        <ConfirmDeleteButton
          action={trashDocument}
          fields={{ id: document.id, returnTo: "/crm/cms/insights" }}
          itemName={document.title}
          eyebrow="Content"
          title="ย้ายเข้าถังขยะ"
          message={`ยืนยันย้าย “${document.title}” เข้าถังขยะ?`}
          buttonLabel="ลบบทความ"
          confirmLabel="ลบบทความ"
          className="kpi-button crm-users-delete-btn"
        />
      </div>
    </div>
  );
}
