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
    params.saved === "1"
      ? "บันทึกโลโก้แล้ว — แสดงบนหน้าเว็บแล้ว"
      : params.deleted === "1"
        ? "ลบโลโก้แล้ว"
        : "";

  return (
    <div className="crm-cms crm-cms-globals crm-cms-logos-page">
      <PageHeader
        eyebrow="Content Management · โลโก้ลูกค้า"
        title="โลโก้ลูกค้า"
        description="จัดการรูปโลโก้ ชื่อลูกค้า และลิงก์เว็บไซต์ — โลโก้ที่บันทึกจะแสดงบนหน้าเว็บทันที"
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
