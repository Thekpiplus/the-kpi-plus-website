import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqSetEditor } from "@/components/cms/FaqSetEditor";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { loadFaqEditorItems } from "@/lib/cms/faq-store";
import { normalizeFaqRoute, resolveFaqRouteKey } from "@/lib/faqs";

export default async function CmsFaqEditPage({
  searchParams,
}: {
  searchParams: Promise<{ route?: string; saved?: string; reset?: string }>;
}) {
  const params = await searchParams;
  const route = normalizeFaqRoute(resolveFaqRouteKey(String(params.route ?? "")));
  if (!params.route?.trim()) notFound();
  const { items, source } = await loadFaqEditorItems(route);

  return (
    <div className="crm-cms crm-cms-faqs">
      <PageHeader
        eyebrow="Content Management · FAQ"
        title={`FAQ: ${route}`}
        description="แก้คำถามและคำตอบด้วยช่องข้อความ — บันทึกแล้วหน้าเว็บสาธารณะจะอ่านจาก CMS"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms/faqs" className="crm-users-secondary">
              รายการ FAQ
            </Link>
            <Link href={route === "/" ? "/" : route} className="crm-users-secondary" target="_blank" rel="noreferrer">
              เปิดหน้าเว็บ
            </Link>
          </div>
        }
      />

      {params.saved === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          บันทึก FAQ แล้ว
        </p>
      ) : null}
      {params.reset === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          กลับไปใช้ FAQ จากโค้ดแล้ว
        </p>
      ) : null}

      <FaqSetEditor route={route} initialItems={items} source={source} />
    </div>
  );
}
