import Link from "next/link";
import { ClientLogoManager } from "@/components/cms/ClientLogoManager";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { emptyClientLogoInput, inputFromRow } from "@/lib/cms/client-logos";
import { listClientLogos } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function CmsClientLogosPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string; saved?: string; deleted?: string; error?: string }>;
}) {
  const params = await searchParams;
  const records = await listClientLogos();
  const creating = params.new === "1";
  const selectedRow = creating
    ? null
    : records.find((row) => row.id === params.id) ?? records[0] ?? null;
  const selected = selectedRow
    ? inputFromRow(selectedRow)
    : emptyClientLogoInput(records.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1);
  const notice =
    params.saved === "1" ? "บันทึกโลโก้แล้ว" : params.deleted === "1" ? "ลบโลโก้แล้ว" : "";

  return (
    <div className="crm-cms crm-cms-globals">
      <PageHeader
        eyebrow="Content Management"
        title="โลโก้ลูกค้า"
        description="จัดการไฟล์โลโก้และสิทธิ์เผยแพร่ โลโก้ Pending หรือ Rejected จะไม่ขึ้นบนหน้าสาธารณะ จนกว่าแอดมินจะบันทึกเป็น Approved และเปิดใช้งาน"
        actions={
          <div className="crm-cms-actions">
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
        key={creating ? "new" : selected.id || "empty"}
        records={records}
        selected={selected}
        creating={creating || !selectedRow}
        notice={notice}
        error={params.error}
      />
    </div>
  );
}
