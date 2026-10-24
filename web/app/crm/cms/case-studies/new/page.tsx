import Link from "next/link";
import { CaseStudyEditor } from "@/components/cms/CaseStudyEditor";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { relatedArticleOptions } from "@/lib/cms/case-study-options";
import { emptyCaseStudyInput } from "@/lib/cms/case-studies";
import { deleteCaseStudy, duplicateCaseStudy, saveCaseStudy } from "@/lib/cms/case-study-actions";

export default async function NewCmsCaseStudyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const relatedOptions = await relatedArticleOptions();
  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title="เพิ่มเคสสตัดดี"
        description="กรอกเนื้อหา ตัวชี้วัด และสื่อ แล้วบันทึกเป็นฉบับร่าง ดูตัวอย่าง หรือส่งตรวจ — ต้องบันทึกก่อนดูตัวอย่าง"
        actions={
          <Link href="/crm/cms/case-studies" className="crm-users-secondary">
            ← เคสทั้งหมด
          </Link>
        }
      />
      <CaseStudyEditor
        creating
        initial={emptyCaseStudyInput()}
        relatedOptions={relatedOptions}
        error={error}
        saveAction={saveCaseStudy}
        deleteAction={deleteCaseStudy}
        duplicateAction={duplicateCaseStudy}
      />
    </div>
  );
}
