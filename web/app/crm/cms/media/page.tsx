import { deleteMedia, updateMedia, uploadMedia } from "@/lib/cms/actions";
import { listMedia } from "@/lib/cms/queries";

export default async function CmsMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const media = await listMedia();

  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Media</h1>
        <p className="mt-2">อัปโหลดรูปไปที่ /media/cms แล้วคัดลอกพาธไปใส่ในหน้าหรือบทความ</p>
      </div>
      {params.saved === "1" ? <p className="font-semibold text-[#0B1F33]">อัปโหลดแล้ว</p> : null}
      {params.error === "invalid" ? <p className="font-semibold text-[#0B1F33]">เลือกไฟล์ก่อนอัปโหลด</p> : null}
      {params.error === "type" ? <p className="font-semibold text-[#0B1F33]">ใช้ได้เฉพาะ jpg png webp gif svg pdf</p> : null}
      <form action={uploadMedia} className="crm-card mx-auto max-w-xl" encType="multipart/form-data">
        <label className="text-sm font-bold">
          ไฟล์
          <input className="crm-field" type="file" name="file" accept="image/*,.pdf" required />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Alt
          <input className="crm-field" name="alt" />
        </label>
        <label className="mt-4 block text-sm font-bold">
          คำบรรยาย
          <input className="crm-field" name="caption" />
        </label>
        <button className="kpi-button mt-5" type="submit">
          อัปโหลด
        </button>
      </form>
      <section className="crm-card">
        <p className="text-sm">{media.length} ไฟล์</p>
        <ul className="mt-3 grid gap-4">
          {media.map((item) => (
            <li key={item.id} className="rounded-xl border border-[#E3E8EB] p-3">
              {item.mime.startsWith("image/") ? (
                <img src={item.path} alt={item.alt || item.filename} className="mb-3 max-h-40 rounded-lg" />
              ) : null}
              <p className="font-semibold">{item.filename}</p>
              <p className="mt-1 text-sm">{item.path}</p>
              <form action={updateMedia} className="mt-3 grid gap-2 md:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />
                <input className="crm-field" name="alt" defaultValue={item.alt} placeholder="alt" />
                <input className="crm-field" name="caption" defaultValue={item.caption} placeholder="caption" />
                <button className="kpi-button" type="submit">
                  บันทึกคำอธิบาย
                </button>
              </form>
              <form action={deleteMedia} className="mt-2">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="path" value={item.path} />
                <button className="kpi-button" type="submit">
                  ลบไฟล์
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
