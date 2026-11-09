import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";
import { HotelMarketingInsightEditor } from "@/components/cms/HotelMarketingInsightEditor";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { trashDocument } from "@/lib/cms/actions";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";
import { isHotelMarketingInsightDocument } from "@/lib/cms/hotel-marketing-insight";
import {
  duplicateHotelMarketingInsightFromForm,
  editorStateForHotelMarketingDocument,
  saveHotelMarketingInsight,
} from "@/lib/cms/hotel-marketing-insight-actions";

function statusText(status: string) {
  if (status === "draft") return "ฉบับร่าง";
  if (status === "scheduled") return "ตั้งเวลา";
  if (status === "published") return "เผยแพร่แล้ว";
  return status;
}

export default async function EditCmsInsightPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; tab?: string; editor?: string }>;
}) {
  const { id } = await params;
  const { error, saved, tab, editor } = await searchParams;
  const document = await documentById(id);
  if (!document || document.kind !== "insight") notFound();

  const hotelMarketing = isHotelMarketingInsightDocument(document);
  const useStructuredEditor = hotelMarketing && editor === "structured";
  const hydrated = useStructuredEditor ? await editorStateForHotelMarketingDocument(id) : null;
  if (useStructuredEditor && !hydrated) notFound();

  const current = hydrated?.document ?? document;
  const path = documentPath(current);
  const previewHref = `/crm/cms/insights/${current.id}/preview`;
  const publicHref = current.status === "published" ? path : undefined;
  const standardHref = `/crm/cms/insights/${current.id}`;

  const danger = (
    <>
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
    </>
  );

  return (
    <div className="crm-cms crm-cms-insight-edit">
      <header className="crm-cms-edit-head">
        <nav className="crm-cms-edit-crumb" aria-label="เส้นทาง">
          <Link href="/crm/cms/insights">บทความ</Link>
          <span aria-hidden="true">/</span>
          {useStructuredEditor ? (
            <>
              <Link href={standardHref}>แก้ไขบทความ</Link>
              <span aria-hidden="true">/</span>
              <span>ตัวแก้ไขโครงสร้าง</span>
            </>
          ) : (
            <span>แก้ไขบทความ</span>
          )}
        </nav>
        <div className="crm-cms-edit-head-row">
          <div className="crm-cms-edit-head-copy">
            <h1 className="crm-cms-edit-title">{current.title}</h1>
            <p className="crm-cms-edit-path" title={path}>
              {path}
            </p>
          </div>
          <div className="crm-cms-edit-head-meta">
            <span className={`crm-cms-status-pill is-${current.status}`}>{statusText(current.status)}</span>
            {useStructuredEditor ? (
              <Link href={standardHref} className="crm-users-secondary">
                ฟอร์มมาตรฐาน
              </Link>
            ) : null}
            {publicHref ? (
              <a href={publicHref} className="crm-users-secondary" target="_blank" rel="noreferrer">
                เปิดบนเว็บ
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {hydrated ? (
        <>
          <HotelMarketingInsightEditor
            initial={hydrated.state}
            notice={saved === "1" ? "บันทึกแล้ว" : undefined}
            error={error}
            saveAction={saveHotelMarketingInsight}
            duplicateAction={duplicateHotelMarketingInsightFromForm}
            updatedAt={hydrated.document.updatedAt.toISOString()}
            initialTab={tab}
            previewHref={previewHref}
            publicHref={path}
          />
          <div className="crm-cms-editor-danger">{danger}</div>
        </>
      ) : (
        <CmsDocumentForm
          kind="insight"
          document={document}
          error={error}
          saved={saved === "1"}
          previewHref={previewHref}
          publicHref={publicHref}
          dangerZone={danger}
        />
      )}
    </div>
  );
}
