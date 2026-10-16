import Link from "next/link";
import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";
import { PageHeader } from "@/components/crm/ui/PageHeader";

export default async function NewCmsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title="สร้างหน้าเพจใหม่"
        description="ใส่ชื่อ เนื้อหา และตั้งค่าการเผยแพร่ แล้วบันทึกเป็นฉบับร่างหรือเผยแพร่ได้ทันที"
        actions={
          <Link href="/crm/cms" className="crm-users-secondary">
            ← หน้าเพจทั้งหมด
          </Link>
        }
      />
      <CmsDocumentForm kind="page" error={error} />
    </div>
  );
}
