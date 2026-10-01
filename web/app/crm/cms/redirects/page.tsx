import { createRedirect, deleteRedirect, toggleRedirect } from "@/lib/cms/actions";
import { listRedirects } from "@/lib/cms/queries";

export default async function CmsRedirectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirects = await listRedirects();

  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Redirects</h1>
        <p className="mt-2">ย้ายเส้นทางเก่าไปหน้าใหม่โดยไม่ต้องแก้โค้ด</p>
      </div>
      {params.saved === "1" ? <p className="font-semibold text-[#0B1F33]">บันทึกแล้ว</p> : null}
      {params.error === "invalid" ? <p className="font-semibold text-[#0B1F33]">from ต้องขึ้นต้นด้วย /</p> : null}
      {params.error === "exists" ? <p className="font-semibold text-[#0B1F33]">เส้นทางนี้มี redirect อยู่แล้ว</p> : null}
      <form action={createRedirect} className="crm-card mx-auto max-w-xl">
        <label className="text-sm font-bold">
          จาก
          <input className="crm-field" name="fromPath" placeholder="/old-url" required />
        </label>
        <label className="mt-4 block text-sm font-bold">
          ไปที่
          <input className="crm-field" name="toPath" placeholder="/new-url" required />
        </label>
        <label className="mt-4 block text-sm font-bold">
          รหัส
          <select className="crm-select" name="statusCode" defaultValue="301">
            <option value="301">301</option>
            <option value="302">302</option>
          </select>
        </label>
        <button className="kpi-button mt-5" type="submit">
          เพิ่ม redirect
        </button>
      </form>
      <section className="crm-card">
        <ul className="grid gap-3">
          {redirects.map((item) => (
            <li key={item.id} className="rounded-xl border border-[#E3E8EB] p-3">
              <p className="font-semibold">
                {item.fromPath} → {item.toPath}
              </p>
              <p className="mt-1 text-sm">
                {item.statusCode} · {item.active ? "เปิดใช้" : "ปิด"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={toggleRedirect}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="active" value={item.active ? "0" : "1"} />
                  <button className="kpi-button" type="submit">
                    {item.active ? "ปิด" : "เปิด"}
                  </button>
                </form>
                <form action={deleteRedirect}>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="kpi-button" type="submit">
                    ลบ
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
