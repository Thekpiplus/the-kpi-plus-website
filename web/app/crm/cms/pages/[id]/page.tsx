import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";
import { trashDocument } from "@/lib/cms/actions";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";

export default async function EditCmsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { id } = await params;
  const { error, saved } = await searchParams;
  const document = await documentById(id);
  if (!document || document.kind !== "page") notFound();

  return (
    <div className="crm-grid">
      <Link href="/crm/cms/pages" className="text-sm font-semibold text-[#0B6660]">
        ← หน้าทั้งหมด
      </Link>
      <p className="text-sm">
        เส้นทางสาธารณะ: {documentPath(document)}
        {document.status === "published" ? (
          <>
            {" "}
            ·{" "}
            <a href={documentPath(document)} className="font-semibold text-[#0B6660]" target="_blank" rel="noreferrer">
              เปิดดู
            </a>
          </>
        ) : null}
      </p>
      <CmsDocumentForm kind="page" document={document} error={error} saved={saved === "1"} />
      <form action={trashDocument} className="crm-card mx-auto max-w-3xl">
        <input type="hidden" name="id" value={document.id} />
        <button className="kpi-button" type="submit">
          ย้ายเข้าถังขยะ
        </button>
      </form>
    </div>
  );
}
