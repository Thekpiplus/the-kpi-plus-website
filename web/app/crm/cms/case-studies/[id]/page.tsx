import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyEditor } from "@/components/cms/CaseStudyEditor";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { relatedArticleOptions } from "@/lib/cms/case-study-options";
import { inputFromRow } from "@/lib/cms/case-studies";
import { deleteCaseStudy, duplicateCaseStudy, saveCaseStudy } from "@/lib/cms/case-study-actions";
import { getCaseStudyRecord } from "@/lib/cms/queries";

export default async function EditCmsCaseStudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const row = await getCaseStudyRecord(id);
  if (!row || row.trashedAt) notFound();
  const relatedOptions = await relatedArticleOptions(row.slug);

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title={row.title || "แก้ไขเคสสตัดดี"}
        description={`/case-studies/${row.slug} · บันทึกก่อนดูตัวอย่าง`}
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms/case-studies" className="crm-users-secondary">
              ← เคสทั้งหมด
            </Link>
          </div>
        }
      />
      <CaseStudyEditor
        creating={false}
        initial={inputFromRow(row)}
        updatedAt={row.updatedAt.toISOString()}
        relatedOptions={relatedOptions}
        error={error}
        notice={saved === "1" ? "บันทึกแล้ว" : ""}
        saveAction={saveCaseStudy}
        deleteAction={deleteCaseStudy}
        duplicateAction={duplicateCaseStudy}
      />
    </div>
  );
}
