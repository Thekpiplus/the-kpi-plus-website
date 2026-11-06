import Link from "next/link";
import { ClientLogoManager } from "@/components/cms/ClientLogoManager";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { listClientLogos } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function CmsClientLogosPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const records = await listClientLogos();
  const notice =
    params.saved === "1" ? "บันทึกโลโก้แล้ว" : params.deleted === "1" ? "ลบโลโก้แล้ว" : "";

  return (
    <div className="crm-cms crm-cms-globals crm-cms-logos-page">
      <PageHeader
        eyebrow="Content Management · โลโก้ลูกค้า"
        title="โลโก้ลูกค้า"
        description="จัดการรูปโลโก้ ชื่อลูกค้า และลิงก์เว็บไซต์ — Pending หรือ Rejected จะไม่ขึ้นสาธารณะจนกว่าจะ Approved และ Active"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms/client-logos?new=1" className="kpi-button crm-users-primary">
              เพิ่มโลโก้
            </Link>
            <Link href="/crm/cms/case-studies" className="crm-users-secondary">
              ผลงานลูกค้า
            </Link>
            <Link href="/crm/cms/media" className="crm-users-secondary">
              คลังสื่อ
            </Link>
          </div>
        }
      />

      <ClientLogoManager
        key={`${params.saved ?? ""}-${params.deleted ?? ""}-${params.error ?? ""}-${records.length}`}
        records={records}
        notice={notice}
        error={params.error}
        autoOpenCreate={params.new === "1"}
      />
    </div>
  );
}
