import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";

export default async function NewCmsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <CmsDocumentForm kind="page" error={error} />;
}
