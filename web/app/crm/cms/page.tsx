import Link from "next/link";
import { cmsOverview, listDocuments, listMedia, listRedirects } from "@/lib/cms/queries";
import { lockedPageList } from "@/lib/cms/locked";

export default async function CmsHomePage() {
  const [overview, pages, insights, media, redirects] = await Promise.all([
    cmsOverview(),
    listDocuments("page"),
    listDocuments("insight"),
    listMedia(),
    listRedirects(),
  ]);
  const locked = lockedPageList().slice(0, 8);

  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Content Management System</h1>
        <p className="mt-2">สร้างหน้าและบทความใหม่ จัดการสื่อ SEO เมนู และ redirect หน้าเดิมของเว็บยังออกแบบจากโค้ด</p>
      </div>
      <div className="crm-split-cards">
        <Link href="/crm/cms/pages" className="crm-card no-underline">
          <h2 className="text-xl font-extrabold">หน้า</h2>
          <p className="mt-2 text-sm">{overview.pages} รายการ · ฉบับร่าง {pages.filter((item) => item.status === "draft").length}</p>
          <span className="kpi-button mt-5 inline-flex">จัดการหน้า</span>
        </Link>
        <Link href="/crm/cms/insights" className="crm-card no-underline">
          <h2 className="text-xl font-extrabold">บทความ</h2>
          <p className="mt-2 text-sm">{overview.insights} รายการ</p>
          <span className="kpi-button mt-5 inline-flex">จัดการบทความ</span>
        </Link>
        <Link href="/crm/cms/media" className="crm-card no-underline">
          <h2 className="text-xl font-extrabold">สื่อ</h2>
          <p className="mt-2 text-sm">{media.length} ไฟล์</p>
          <span className="kpi-button mt-5 inline-flex">คลังสื่อ</span>
        </Link>
        <Link href="/crm/cms/redirects" className="crm-card no-underline">
          <h2 className="text-xl font-extrabold">Redirect</h2>
          <p className="mt-2 text-sm">{redirects.length} รายการ</p>
          <span className="kpi-button mt-5 inline-flex">จัดการเส้นทาง</span>
        </Link>
      </div>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">หน้าจากโค้ด (ล็อกไว้)</h2>
        <p className="mt-2 text-sm">หน้าเหล่านี้ยังแก้เลย์เอาต์จากโค้ด ไม่ทับด้วย CMS</p>
        <ul className="mt-3 grid gap-2 text-sm">
          {locked.map((page) => (
            <li key={page.route}>
              <span className="font-semibold text-[#0B6660]">{page.route}</span> · {page.title}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">ดูรายการเต็มในหน้า Pages</p>
      </section>
    </div>
  );
}
