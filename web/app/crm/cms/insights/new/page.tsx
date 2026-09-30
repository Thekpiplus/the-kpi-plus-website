import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";

export default async function NewCmsInsightPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <CmsDocumentForm kind="insight" error={error} />;
}
