import { saveGlobals } from "@/lib/cms/actions";
import { getSetting } from "@/lib/cms/queries";
import { SITE } from "@/lib/seo";

export default async function CmsGlobalsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const row = await getSetting("site");
  const value = row ? (JSON.parse(row.value) as { defaultOg?: string; siteLine?: string; canonicalHost?: string }) : {};

  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">ตั้งค่าเว็บ</h1>
        <p className="mt-2">ค่าทั้งไซต์ ฟอร์มติดต่อยังทำงานในโค้ดตามเดิม ไม่มี backend ปลอม</p>
      </div>
      {saved === "1" ? <p className="font-semibold text-[#0B1F33]">บันทึกแล้ว</p> : null}
      <form action={saveGlobals} className="crm-card mx-auto max-w-xl">
        <label className="text-sm font-bold">
          โดเมน canonical
          <input className="crm-field" name="canonicalHost" defaultValue={value.canonicalHost || SITE} />
        </label>
        <label className="mt-4 block text-sm font-bold">
          รูป OG เริ่มต้น
          <input className="crm-field" name="defaultOg" defaultValue={value.defaultOg} placeholder="/media/..." />
        </label>
        <label className="mt-4 block text-sm font-bold">
          ข้อความสั้นของบริษัท
          <textarea className="crm-area" name="siteLine" defaultValue={value.siteLine} style={{ minHeight: "6rem" }} />
        </label>
        <button className="kpi-button mt-5" type="submit">
          บันทึก
        </button>
      </form>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">ฟอร์มที่มีอยู่แล้ว</h2>
        <p className="mt-2 text-sm">ฟอร์มบนหน้าโซลูชันและหน้าติดต่อยังอยู่ในโค้ด คำนวณเครื่องคิดเลขทำในเบราว์เซอร์</p>
      </section>
    </div>
  );
}
