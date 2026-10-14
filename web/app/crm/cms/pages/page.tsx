import Link from "next/link";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { listDocuments } from "@/lib/cms/queries";
import { lockedPageList } from "@/lib/cms/locked";
import { documentPath } from "@/lib/cms/body";

export default async function CmsPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const pages = await listDocuments("page", { q: params.q, status: params.status });
  const locked = lockedPageList();

  return (
    <div className="crm-grid">
      <PageHeader
        eyebrow="Content"
        title="Pages"
        description="สร้างหน้าใหม่ด้วย slug ที่ยังไม่มีบนเว็บ"
        actions={
          <Link href="/crm/cms/pages/new" className="kpi-button">
            สร้างหน้า
          </Link>
        }
      />
      {params.deleted === "1" ? <p className="font-semibold text-[#0B1F33]">ย้ายเข้าถังขยะแล้ว</p> : null}
      <form className="crm-card grid gap-3 md:grid-cols-3" method="get">
        <label className="text-sm font-bold">
          ค้นหา
          <input className="crm-field" name="q" defaultValue={params.q} />
        </label>
        <label className="text-sm font-bold">
          สถานะ
          <select className="crm-select" name="status" defaultValue={params.status ?? ""}>
            <option value="">ทั้งหมด</option>
            <option value="draft">ฉบับร่าง</option>
            <option value="published">เผยแพร่</option>
            <option value="scheduled">ตั้งเวลา</option>
          </select>
        </label>
        <button className="kpi-button self-end" type="submit">
          ค้นหา
        </button>
      </form>
      <section className="crm-card">
        <p className="text-sm">{pages.length} หน้าจาก CMS</p>
        <ul className="mt-3 grid gap-3">
          {pages.map((page) => (
            <li key={page.id} className="rounded-xl border border-[#E3E8EB] p-3">
              <Link href={`/crm/cms/pages/${page.id}`} className="font-semibold text-[#0B6660]">
                {page.title}
              </Link>
              <p className="mt-1 text-sm">
                {page.status} · {documentPath(page)} · {page.locale}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">หน้าจากโค้ด</h2>
        <ul className="mt-3 grid gap-2 text-sm">
          {locked.map((page) => (
            <li key={`${page.language}-${page.route}`}>
              {page.route} · {page.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
