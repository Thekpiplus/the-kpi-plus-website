"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { pages } from "@/lib/seo";
import { documentPath } from "./body";
import {
  CASE_STUDIES_CMS_INTENTS,
  CASE_STUDIES_CMS_TEMPLATE,
  CASE_STUDIES_PAGE_ROUTE,
  CASE_STUDIES_PAGE_SLUG,
  defaultCaseStudiesCms,
  isCaseStudiesCmsBody,
  isCaseStudiesPageDocument,
  parseCaseStudiesPageBody,
  serializeCaseStudiesPageBody,
  type CaseStudiesCmsIntent,
  type CaseStudiesCmsSaveResult,
  type CaseStudiesEditorState,
  type CmsCaseStudiesPage,
} from "./case-studies-page";
import { cmsDb, documentById, pageDocumentBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): CaseStudiesCmsIntent {
  return CASE_STUDIES_CMS_INTENTS.includes(value as CaseStudiesCmsIntent)
    ? (value as CaseStudiesCmsIntent)
    : "save";
}

function applyIntent(status: string, intent: CaseStudiesCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

function revalidateCaseStudiesPage(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/case-studies");
  revalidatePath("/crm/cms/case-studies-page");
  revalidatePath("/", "layout");
  revalidatePath(CASE_STUDIES_PAGE_ROUTE);
  revalidatePath("/en/case-studies");
  revalidatePath("/ru/case-studies");
  revalidatePath("/zh/case-studies");
  revalidatePath(path);
  revalidatePath(path, "page");
}

export async function hydrateCaseStudiesPageDocument(doc: CmsDocumentRow) {
  if (!isCaseStudiesPageDocument(doc)) return doc;
  const parsed = isCaseStudiesCmsBody(doc.body) ? parseCaseStudiesPageBody(doc.body) : null;
  if (doc.template === CASE_STUDIES_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultCaseStudiesCms();
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: CASE_STUDIES_CMS_TEMPLATE,
      slug: CASE_STUDIES_PAGE_SLUG,
      body: serializeCaseStudiesPageBody(content),
    },
  });
}

export async function editorStateForCaseStudiesPageDocument(id: string): Promise<CaseStudiesEditorState | null> {
  const existing = await documentById(id);
  if (!existing || existing.kind !== "page") return null;
  const doc = await hydrateCaseStudiesPageDocument(existing);
  const content = parseCaseStudiesPageBody(doc.body) ?? defaultCaseStudiesCms();
  return {
    documentId: doc.id,
    title: doc.title,
    status: doc.status,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    content,
  };
}

export async function saveCaseStudiesPage(formData: FormData): Promise<CaseStudiesCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const parsed = parseCaseStudiesPageBody(String(formData.get("contentJson") ?? ""));
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsCaseStudiesPage = parsed;

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.pageTitle.th;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription || content.hero.description.th;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      slug: CASE_STUDIES_PAGE_SLUG,
      locale: "th",
      status: nextStatus,
      template: CASE_STUDIES_CMS_TEMPLATE,
      excerpt,
      body: serializeCaseStudiesPageBody(content),
      featuredImage: content.media.heroImage || existing.featuredImage,
      imageAlt: content.media.heroAlt.th || existing.imageAlt,
      seoTitle,
      metaDescription,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });

  await refreshCmsFiles();
  revalidateCaseStudiesPage(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureCaseStudiesPageFromSite() {
  const user = await requireCms();
  const existing = await pageDocumentBySlug(CASE_STUDIES_PAGE_SLUG, "th");
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateCaseStudiesPageDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === CASE_STUDIES_PAGE_ROUTE && page.language === "th");
  const content = defaultCaseStudiesCms();
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.hero.pageTitle.th,
      slug: CASE_STUDIES_PAGE_SLUG,
      locale: "th",
      status: "published",
      template: CASE_STUDIES_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description.th,
      body: serializeCaseStudiesPageBody(content),
      featuredImage: content.media.heroImage,
      imageAlt: content.media.heroAlt.th,
      seoTitle: sitePage?.title || content.hero.pageTitle.th,
      metaDescription: sitePage?.description || content.hero.description.th,
      canonical: CASE_STUDIES_PAGE_ROUTE,
      author: user.email,
      updatedBy: user.email,
      publishedAt: new Date(),
    },
  });
  await refreshCmsFiles();
  revalidateCaseStudiesPage(created);
  return created.id;
}
