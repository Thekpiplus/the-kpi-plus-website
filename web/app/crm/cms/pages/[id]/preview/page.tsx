import Link from "next/link";
import { notFound } from "next/navigation";
import { RevenueView } from "@/components/RevenueView";
import { PageHeader } from "@/components/crm/ui/PageHeader";
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
  if (!isRevenuePageDocument(document)) notFound();

  const preview = await loadRevenuePagePreview(id);
  if (!preview) notFound();
  const path = documentPath(document);

  return (
    <div className="crm-cms crm-cs-preview">
      <PageHeader
        eyebrow="Content Management"
        title="ตัวอย่างหน้า Revenue & Commercial"
        description={preview.live ? "มุมมองสาธารณะของหน้าที่เผยแพร่แล้ว" : "ตัวอย่างในระบบ — ยังไม่แทนที่เนื้อหาในโค้ดบนเว็บสาธารณะ"}
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
      <p className={`crm-users-alert ${preview.live ? "is-ok" : "is-warn"}`} role="status">
        {preview.live
          ? `หน้านี้อยู่ในสถานะ Published และจะแสดงบน ${path}`
          : "บันทึกแล้ว — ตัวอย่างนี้ยังไม่เป็นสาธารณะ จนกว่าจะเผยแพร่"}
      </p>
      <div className="crm-cs-preview-frame">
        <RevenueView locale={preview.locale} previewContent={preview.content} embedded />
      </div>
    </div>
  );
}
