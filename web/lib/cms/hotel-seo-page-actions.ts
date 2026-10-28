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
  HOTEL_SEO_CMS_TEMPLATE,
  HOTEL_SEO_PAGE_ROUTE,
  HOTEL_SEO_PAGE_SLUG,
  SEO_CMS_INTENTS,
  editorStateFromHotelSeoDocument,
  isHotelSeoCmsBody,
  isHotelSeoPageDocument,
  parseHotelSeoPageBody,
  serializeHotelSeoPageBody,
  validateHotelSeoPage,
  type CmsHotelSeoPage,
  type CmsSeoVisual,
  type SeoCmsIntent,
  type SeoCmsSaveResult,
} from "./hotel-seo-page";
import { defaultHotelSeoCms } from "./hotel-seo-page-seed";
import { pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): SeoCmsIntent {
  return SEO_CMS_INTENTS.includes(value as SeoCmsIntent) ? (value as SeoCmsIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateSeo(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/hotel-seo");
  revalidatePath("/", "layout");
  revalidatePath(HOTEL_SEO_PAGE_ROUTE);
  revalidatePath(HOTEL_SEO_PAGE_ROUTE, "page");
  revalidatePath("/en/solutions/hotel-seo-google-maps-ai-search");
  revalidatePath("/ru/solutions/hotel-seo-google-maps-ai-search");
  revalidatePath("/zh/solutions/hotel-seo-google-maps-ai-search");
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
      data: { filename: file.name, path, alt: "", caption: "", mime: file.type || "image/jpeg", size: file.size },
    });
  } catch {
    // File is on disk even if the media library row cannot be written.
  }
  return { ok: true, path };
}

async function applyVisualUpload(formData: FormData, visual: CmsSeoVisual, fileKey: string, clearKey: string) {
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

export async function hydrateHotelSeoDocument(doc: CmsDocumentRow) {
  if (!isHotelSeoPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isHotelSeoCmsBody(doc.body) ? parseHotelSeoPageBody(doc.body, locale) : null;
  if (doc.template === HOTEL_SEO_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultHotelSeoCms(locale);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: { template: HOTEL_SEO_CMS_TEMPLATE, body: serializeHotelSeoPageBody(content) },
  });
}

function applyIntent(status: string, intent: SeoCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveHotelSeoPage(formData: FormData): Promise<SeoCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  let content: CmsHotelSeoPage;
  try {
    content = parseHotelSeoPageBody(String(formData.get("contentJson") ?? ""), locale) ?? defaultHotelSeoCms(locale);
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  const uploads = await Promise.all([
    applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    applyVisualUpload(formData, content.search.visual, "searchImageFile", "clearSearchImage"),
    applyVisualUpload(formData, content.compare.visual, "compareImageFile", "clearCompareImage"),
    applyVisualUpload(formData, content.problems.visual, "problemImageFile", "clearProblemImage"),
    applyVisualUpload(formData, content.help.visual, "helpImageFile", "clearHelpImage"),
    applyVisualUpload(formData, content.gbp.visual, "gbpImageFile", "clearGbpImage"),
    applyVisualUpload(formData, content.method.visual, "processImageFile", "clearProcessImage"),
    applyVisualUpload(formData, content.measure.visual, "kpiImageFile", "clearKpiImage"),
    applyVisualUpload(formData, content.related.visual, "relatedImageFile", "clearRelatedImage"),
    applyVisualUpload(formData, content.form.visual, "teamImageFile", "clearTeamImage"),
    applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
  ]);
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.title;
  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const invalid = validateHotelSeoPage(content, intent, { seoTitle, metaDescription });
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription;
  const canonical = String(formData.get("canonical") ?? content.seo.canonical ?? "").trim();
  content.seo.canonical = canonical;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      locale,
      status: nextStatus,
      template: HOTEL_SEO_CMS_TEMPLATE,
      excerpt,
      body: serializeHotelSeoPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      seoTitle,
      metaDescription,
      canonical,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateSeo(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureHotelSeoPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = HOTEL_SEO_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({ where: { id: existing.id }, data: { trashedAt: null, updatedBy: user.email } });
    }
    const hydrated = await hydrateHotelSeoDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === HOTEL_SEO_PAGE_ROUTE && page.language === "th");
  const content = defaultHotelSeoCms(locale);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.hero.title,
      slug,
      locale,
      status: "published",
      template: HOTEL_SEO_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description,
      body: serializeHotelSeoPageBody(content),
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
  revalidateSeo(created);
  return created.id;
}

export async function editorStateForHotelSeoDocument(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "page") return null;
  const hydrated = await hydrateHotelSeoDocument(doc);
  return { document: hydrated, state: editorStateFromHotelSeoDocument(hydrated) };
}
