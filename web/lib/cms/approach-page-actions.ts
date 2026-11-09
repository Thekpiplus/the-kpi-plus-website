"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { pages } from "@/lib/seo";
import { documentPath } from "./body";
import {
  APPROACH_CMS_INTENTS,
  APPROACH_CMS_TEMPLATE,
  APPROACH_PAGE_ROUTE,
  APPROACH_PAGE_SLUG,
  defaultApproachCms,
  isApproachCmsBody,
  isApproachPageDocument,
  parseApproachPageBody,
  serializeApproachPageBody,
  type ApproachCmsIntent,
  type ApproachCmsSaveResult,
  type ApproachEditorState,
  type CmsApproachPage,
} from "./approach-page";
import { cmsDb, documentById, pageDocumentBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): ApproachCmsIntent {
  return APPROACH_CMS_INTENTS.includes(value as ApproachCmsIntent)
    ? (value as ApproachCmsIntent)
    : "save";
}

function applyIntent(status: string, intent: ApproachCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

function revalidateApproachPage(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/approach");
  revalidatePath("/", "layout");
  revalidatePath(APPROACH_PAGE_ROUTE);
  revalidatePath("/en/approach");
  revalidatePath("/ru/approach");
  revalidatePath("/zh/approach");
  revalidatePath(path);
  revalidatePath(path, "page");
}

export async function hydrateApproachPageDocument(doc: CmsDocumentRow) {
  if (!isApproachPageDocument(doc)) return doc;
  const parsed = isApproachCmsBody(doc.body) ? parseApproachPageBody(doc.body) : null;
  if (doc.template === APPROACH_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultApproachCms();
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: APPROACH_CMS_TEMPLATE,
      slug: APPROACH_PAGE_SLUG,
      body: serializeApproachPageBody(content),
    },
  });
}

export async function editorStateForApproachPageDocument(id: string): Promise<ApproachEditorState | null> {
  const existing = await documentById(id);
  if (!existing || existing.kind !== "page") return null;
  const doc = await hydrateApproachPageDocument(existing);
  const content = parseApproachPageBody(doc.body) ?? defaultApproachCms();
  return {
    documentId: doc.id,
    title: doc.title,
    status: doc.status,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    content,
  };
}

export async function saveApproachPage(formData: FormData): Promise<ApproachCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const parsed = parseApproachPageBody(String(formData.get("contentJson") ?? ""));
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsApproachPage = parsed;

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title =
    String(formData.get("title") ?? existing.title).trim() ||
    content.hero.titleLead.th ||
    "แนวทางของเรา";
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription || content.hero.lead.th;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      slug: APPROACH_PAGE_SLUG,
      locale: "th",
      status: nextStatus,
      template: APPROACH_CMS_TEMPLATE,
      excerpt,
      body: serializeApproachPageBody(content),
      seoTitle,
      metaDescription,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });

  await refreshCmsFiles();
  revalidateApproachPage(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureApproachPageFromSite() {
  const user = await requireCms();
  const existing = await pageDocumentBySlug(APPROACH_PAGE_SLUG, "th");
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateApproachPageDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === APPROACH_PAGE_ROUTE && page.language === "th");
  const content = defaultApproachCms();
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.method.title.th,
      slug: APPROACH_PAGE_SLUG,
      locale: "th",
      status: "published",
      template: APPROACH_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.lead.th,
      body: serializeApproachPageBody(content),
      seoTitle: sitePage?.title || content.method.title.th,
      metaDescription: sitePage?.description || content.hero.lead.th,
      canonical: APPROACH_PAGE_ROUTE,
      author: user.email,
      updatedBy: user.email,
      publishedAt: new Date(),
    },
  });
  await refreshCmsFiles();
  revalidateApproachPage(created);
  return created.id;
}
