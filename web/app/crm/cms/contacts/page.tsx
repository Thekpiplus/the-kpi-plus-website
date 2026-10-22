import Link from "next/link";
import { ContactManager } from "@/components/crm/cms/ContactManager";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { emptyContactInput, inputFromRow, placeholdersFromCompany } from "@/lib/cms/contact";
import { listContacts } from "@/lib/cms/queries";
import { ensurePrimaryContact } from "@/lib/company-public";

export default async function CmsContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; new?: string; saved?: string; deleted?: string; primary?: string; error?: string }>;
}) {
  const params = await searchParams;
  await ensurePrimaryContact();
  const records = await listContacts();
  const creating = params.new === "1" || records.length === 0;
  const selectedRow = creating ? null : records.find((row) => row.id === params.id) ?? records.find((row) => row.isPrimary) ?? records[0] ?? null;
  const selected = selectedRow ? inputFromRow(selectedRow) : emptyContactInput();
  const notice = params.saved === "1" ? "บันทึกข้อมูลติดต่อแล้ว" : params.deleted === "1" ? "ลบรายการแล้ว" : params.primary === "1" ? "ตั้งเป็นรายการหลักแล้ว" : "";

  return (
    <div className="crm-cms crm-cms-globals">
      <PageHeader
        eyebrow="Content Management"
        title="ข้อมูลติดต่อ"
        description="เพิ่ม แก้ไข และลบข้อมูลติดต่อโดยไม่ต้องแก้โค้ด รายการหลักจะไปแสดงบนหน้า Contact สาธารณะ"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms/globals" className="crm-users-secondary">
              ตั้งค่าเว็บ
            </Link>
            <Link href="/crm/cms/media" className="crm-users-secondary">
              คลังสื่อ
            </Link>
          </div>
        }
      />

      <ContactManager
        key={creating ? "new" : selected.id || "empty"}
        records={records}
        selected={selected}
        creating={creating}
        notice={notice}
        error={params.error}
        placeholders={placeholdersFromCompany()}
      />
    </div>
  );
}
