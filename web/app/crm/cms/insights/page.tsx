import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { listDocuments } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";

export default async function CmsInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const posts = await listDocuments("insight", { q: params.q, status: params.status });

  return (
    <div className="crm-grid">
      <PageHeader
        eyebrow="Content"
        title="Insights"
        description="บทความใหม่จะไปอยู่ที่ /insights/[slug] คู่กับบทความที่เขียนในโค้ด"
        actions={
          <Link href="/crm/cms/insights/new" className="kpi-button">
            สร้างบทความ
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
        <p className="text-sm">{posts.length} บทความจาก CMS</p>
        {posts.length === 0 ? (
          <EmptyState
            title="ยังไม่มีบทความ"
            body="สร้างบทความใหม่เพื่อเผยแพร่ที่ /insights/[slug]"
            action={
              <Link href="/crm/cms/insights/new" className="kpi-button">
                สร้างบทความ
              </Link>
            }
          />
        ) : (
          <ul className="mt-3 grid gap-3">
            {posts.map((post) => (
              <li key={post.id} className="rounded-xl border border-[#E3E8EB] p-3">
                <Link href={`/crm/cms/insights/${post.id}`} className="font-semibold text-[#0B6660]">
                  {post.title}
                </Link>
                <p className="mt-1 text-sm">
                  {post.status} · {documentPath(post)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
