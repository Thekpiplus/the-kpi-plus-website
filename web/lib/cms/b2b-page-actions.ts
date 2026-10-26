"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { CASE_STUDY_IMAGE_TYPES, MAX_CASE_STUDY_IMAGE_BYTES } from "./case-studies";
import { documentPath } from "./body";
import { cmsDb, documentById, pageDocumentBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";
import {
  B2B_CMS_TEMPLATE,
  B2B_INTENTS,
  B2B_PAGE_ROUTE,
  B2B_PAGE_SLUG,
  editorStateFromB2bDocument,
  isB2bCmsBody,
  isB2bPageDocument,
  parseB2bPageBody,
  serializeB2bPageBody,
  validateB2bPage,
  type CmsB2bPage,
  type CmsB2bVisual,
  type B2bIntent,
  type B2bSaveResult,
} from "./b2b-page";
import { defaultB2bCms } from "./b2b-page-seed";
import { pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): B2bIntent {
  return B2B_INTENTS.includes(value as B2bIntent) ? (value as B2bIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateB2b(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/b2b");
  revalidatePath("/", "layout");
  revalidatePath(B2B_PAGE_ROUTE);
  revalidatePath(B2B_PAGE_ROUTE, "page");
  revalidatePath("/en/solutions/b2b-agent-sales");
  revalidatePath("/ru/solutions/b2b-agent-sales");
  revalidatePath("/zh/solutions/b2b-agent-sales");
  revalidatePath(path);
  revalidatePath(path, "page");
}

async function storeImage(file: File): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const original = file.name || "";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  if (!CASE_STUDY_IMAGE_TYPES.has(ext) || file.size > MAX_CASE_STUDY_IMAGE_BYTES) {
    return { ok: false, error: "invalid_image" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const [{ mkdirSync, writeFileSync }, { join }] = await Promise.all([import("node:fs"), import("node:path")]);
  const name = `${randomToken(8)}${ext || ".jpg"}`;
  const dir = join(process.cwd(), "public", "media", "cms");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  const path = `/media/cms/${name}`;
  try {
    const db = await cmsDb();
    await db.cmsMedia.create({
      data: {
        filename: file.name,
        path,
        alt: "",
        caption: "",
        mime: file.type || "image/jpeg",
        size: file.size,
      },
    });
  } catch {
    // File is on disk even if the media library row cannot be written.
  }
  return { ok: true, path };
}

async function applyVisualUpload(
  formData: FormData,
  visual: CmsB2bVisual,
  fileKey: string,
  clearKey: string,
): Promise<string | null> {
  const file = formData.get(fileKey);
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const stored = await storeImage(file);
    if (!stored.ok) return stored.error;
    visual.src = stored.path;
    if (visual.status === "placeholder") visual.status = "sample";
  }
  if (formData.get(clearKey) === "1" && !hasFile) {
    visual.src = "";
    visual.status = "placeholder";
  }
  return null;
}

export async function hydrateB2bDocument(doc: CmsDocumentRow) {
  if (!isB2bPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isB2bCmsBody(doc.body) ? parseB2bPageBody(doc.body, locale) : null;
  if (doc.template === B2B_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultB2bCms(locale);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: B2B_CMS_TEMPLATE,
      body: serializeB2bPageBody(content),
    },
  });
}

function applyIntent(status: string, intent: B2bIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveB2bPage(formData: FormData): Promise<B2bSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  let content: CmsB2bPage;
  try {
    content = parseB2bPageBody(String(formData.get("contentJson") ?? ""), locale) ?? defaultB2bCms(locale);
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  const uploads = await Promise.all([
    applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    applyVisualUpload(formData, content.readiness.visual, "readinessImageFile", "clearReadinessImage"),
    applyVisualUpload(formData, content.workflowSection.visual, "workflowImageFile", "clearWorkflowImage"),
    applyVisualUpload(formData, content.measureSection.visual, "kpiImageFile", "clearKpiImage"),
    applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
  ]);
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  const invalid = validateB2bPage(content, intent);
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.title;
  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      locale,
      status: nextStatus,
      template: B2B_CMS_TEMPLATE,
      excerpt,
      body: serializeB2bPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      seoTitle,
      metaDescription,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateB2b(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureB2bPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = B2B_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateB2bDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === B2B_PAGE_ROUTE && page.language === "th");
  const content = defaultB2bCms(locale);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.hero.title,
      slug,
      locale,
      status: "published",
      template: B2B_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description,
      body: serializeB2bPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      tags: "",
      seoTitle: sitePage?.title || content.hero.title,
      metaDescription: sitePage?.description || content.hero.description,
      publishedAt: new Date(),
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateB2b(created);
  return created.id;
}

export async function editorStateForB2bDocument(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "page") return null;
  const hydrated = await hydrateB2bDocument(doc);
  return { document: hydrated, state: editorStateFromB2bDocument(hydrated) };
}
