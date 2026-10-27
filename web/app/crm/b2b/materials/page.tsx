import { redirect } from "next/navigation";
import { B2bMaterialsPanel } from "@/components/b2b-ops/B2bOpsPanels";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { b2bAccessFor, canOpenB2b } from "@/lib/b2b-ops/access";
import { listB2bMaterials } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bMaterialsPage() {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const [access, items] = await Promise.all([b2bAccessFor(user), listB2bMaterials()]);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Sales Materials"
        description="สื่อขายและบันทึกแคมเปญ — Marketing จัดการไฟล์ได้"
      />
      <B2bMaterialsPanel items={items} canEdit={access.canEditMaterials} />
    </div>
  );
}
