import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyDetailView } from "@/components/CaseStudyDetailView";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { loadCaseStudyPreview } from "@/lib/cms/case-study-public";
import { isPubliclyVisible } from "@/lib/cms/case-studies";
import { getCaseStudyRecord } from "@/lib/cms/queries";

export default async function PreviewCmsCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await getCaseStudyRecord(id);
  const study = await loadCaseStudyPreview(id);
  if (!row || !study || row.trashedAt) notFound();
  const live = isPubliclyVisible(row);

  return (
    <div className="crm-cms crm-cs-preview">
      <PageHeader
        eyebrow="Content Management"
        title="ตัวอย่างเคสสตัดดี"
        description={live ? "มุมมองสาธารณะของเคสที่เผยแพร่แล้ว" : "ตัวอย่างในระบบ — ยังไม่แสดงบนเว็บสาธารณะ"}
        actions={
          <div className="crm-cms-actions">
            <Link href={`/crm/cms/case-studies/${row.id}`} className="crm-users-secondary">
              ← กลับไปแก้ไข
            </Link>
            <Link href="/crm/cms/case-studies" className="crm-users-secondary">
              เคสทั้งหมด
            </Link>
          </div>
        }
      />
      <p className={`crm-users-alert ${live ? "is-ok" : "is-warn"}`} role="status">
        {live
          ? "เคสนี้อยู่ในสถานะ Published และจะแสดงบน /case-studies"
          : "บันทึกแล้ว — ตัวอย่างนี้ยังไม่เป็นสาธารณะ จนกว่าจะเผยแพร่"}
      </p>
      <div className="crm-cs-preview-frame">
        <CaseStudyDetailView locale="th" slug={study.slug} previewStudy={study} embedded />
      </div>
    </div>
  );
}
