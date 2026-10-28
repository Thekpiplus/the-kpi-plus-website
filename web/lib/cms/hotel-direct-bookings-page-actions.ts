"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { CASE_STUDY_IMAGE_TYPES, MAX_CASE_STUDY_IMAGE_BYTES } from "./case-studies";
import { documentPath } from "./body";
import { cmsDb, documentById, pageDocumentBySlug, pageDocumentsBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";
import {
  DIRECT_BOOKING_CMS_INTENTS,
  HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
  HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE,
  HOTEL_DIRECT_BOOKINGS_PAGE_SLUG,
  defaultDirectBookingCms,
  editorStateFromDirectBookingDocument,
  isDirectBookingCmsBody,
  isHotelDirectBookingsPageDocument,
  parseDirectBookingPageBody,
  serializeDirectBookingPageBody,
  validateDirectBookingPage,
  type CmsDirectBookingPage,
  type CmsDirectBookingVisual,
  type DirectBookingCmsIntent,
  type DirectBookingCmsSaveResult,
} from "./hotel-direct-bookings-page";
import { pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): DirectBookingCmsIntent {
  return DIRECT_BOOKING_CMS_INTENTS.includes(value as DirectBookingCmsIntent) ? (value as DirectBookingCmsIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateDirectBookings(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/hotel-direct-bookings");
  revalidatePath("/", "layout");
  revalidatePath(HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE);
  revalidatePath("/en/solutions/hotel-direct-bookings");
  revalidatePath("/ru/solutions/hotel-direct-bookings");
  revalidatePath("/zh/solutions/hotel-direct-bookings");
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
    /* media table optional */
  }
  return { ok: true, path };
}

async function applyVisualUpload(
  formData: FormData,
  visual: CmsDirectBookingVisual,
  fileKey: string,
  clearKey: string,
): Promise<string | null> {
  const file = formData.get(fileKey);
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const stored = await storeImage(file);
    if (!stored.ok) return stored.error;
    visual.src = stored.path;
    if (visual.status === "placeholder" || visual.status === "replace") visual.status = "sample";
  }
  if (formData.get(clearKey) === "1" && !hasFile) {
    visual.src = "";
    visual.status = "replace";
  }
  return null;
}

export async function hydrateDirectBookingDocument(doc: CmsDocumentRow) {
  if (!isHotelDirectBookingsPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isDirectBookingCmsBody(doc.body) ? parseDirectBookingPageBody(doc.body, locale) : null;
  if (doc.template === HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultDirectBookingCms(locale);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
      body: serializeDirectBookingPageBody(content),
    },
  });
}

function applyIntent(status: string, intent: DirectBookingCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveDirectBookingPage(formData: FormData): Promise<DirectBookingCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  const parsed = parseDirectBookingPageBody(String(formData.get("contentJson") ?? ""), locale);
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsDirectBookingPage = parsed;

  const uploads = await Promise.all([
    applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    applyVisualUpload(formData, content.confidence.visual, "confidenceImageFile", "clearConfidenceImage"),
    applyVisualUpload(formData, content.friction.visual, "frictionImageFile", "clearFrictionImage"),
    applyVisualUpload(formData, content.framework.visual, "frameworkImageFile", "clearFrameworkImage"),
    applyVisualUpload(formData, content.audit.visual, "auditImageFile", "clearAuditImage"),
    applyVisualUpload(formData, content.rebuild.visual, "rebuildImageFile", "clearRebuildImage"),
    applyVisualUpload(formData, content.workflow.visual, "workflowImageFile", "clearWorkflowImage"),
    applyVisualUpload(formData, content.measure.visual, "measureImageFile", "clearMeasureImage"),
    applyVisualUpload(formData, content.related.visual, "relatedImageFile", "clearRelatedImage"),
    applyVisualUpload(formData, content.form.visual, "formImageFile", "clearFormImage"),
    applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
  ]);
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const invalid = validateDirectBookingPage(content, intent);
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.title;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      locale,
      status: nextStatus,
      template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
      excerpt,
      body: serializeDirectBookingPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      seoTitle,
      metaDescription,
      canonical: content.seo.canonical || existing.canonical,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateDirectBookings(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureDirectBookingPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = HOTEL_DIRECT_BOOKINGS_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateDirectBookingDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE && page.language === "th");
  const content = defaultDirectBookingCms(locale);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.hero.title,
      slug,
      locale,
      status: "draft",
      template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description,
      body: serializeDirectBookingPageBody(content),
      seoTitle: sitePage?.title || content.hero.title,
      metaDescription: sitePage?.description || content.hero.description,
      canonical: HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE,
      createdBy: user.email,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateDirectBookings(created);
  return created.id;
}

function contentForLocaleCopy(content: CmsDirectBookingPage, locale: Locale): CmsDirectBookingPage {
  if (locale !== "en") return content;
  return {
    ...content,
    faqs: content.faqs.map((faq) => ({
      ...faq,
      q: faq.qEn.trim() || faq.q,
      a: faq.aEn.trim() || faq.a,
    })),
  };
}

export async function duplicateDirectBookingPageToLocale(formData: FormData): Promise<DirectBookingCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const locale = asLocale(String(formData.get("targetLocale") ?? ""));
  if (!locale || locale === String(formData.get("locale") ?? "")) return { ok: false, error: "invalid_locale" };
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page" || !isHotelDirectBookingsPageDocument(existing)) return { ok: false, error: "missing" };
  const duplicate = await pageDocumentBySlug(HOTEL_DIRECT_BOOKINGS_PAGE_SLUG, locale);
  if (duplicate && !duplicate.trashedAt) return { ok: false, error: "locale_exists" };

  const parsed = parseDirectBookingPageBody(existing.body, asLocale(existing.locale)) ?? defaultDirectBookingCms(locale);
  const content = contentForLocaleCopy(parsed, locale);
  const canonical = locale === "th" ? HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE : `/${locale}${HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE}`;
  const db = await cmsDb();
  if (duplicate?.trashedAt) {
    const restored = await db.cmsDocument.update({
      where: { id: duplicate.id },
      data: {
        title: `${existing.title} (${locale})`,
        locale,
        status: "draft",
        template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
        excerpt: existing.excerpt,
        body: serializeDirectBookingPageBody(content),
        featuredImage: content.hero.visual.src,
        imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
        ogImage: content.seo.social.src,
        seoTitle: existing.seoTitle,
        metaDescription: existing.metaDescription,
        canonical,
        publishedAt: null,
        scheduledAt: null,
        trashedAt: null,
        updatedBy: user.email,
      },
    });
    await refreshCmsFiles();
    revalidateDirectBookings(restored);
    return { ok: true, id: restored.id, intent: "draft" };
  }

  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: `${existing.title} (${locale})`,
      slug: HOTEL_DIRECT_BOOKINGS_PAGE_SLUG,
      locale,
      status: "draft",
      template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
      excerpt: existing.excerpt,
      body: serializeDirectBookingPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      seoTitle: existing.seoTitle,
      metaDescription: existing.metaDescription,
      canonical,
      createdBy: user.email,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateDirectBookings(created);
  return { ok: true, id: created.id, intent: "draft" };
}

export async function editorStateForDirectBookingDocument(id: string) {
  const document = await documentById(id);
  if (!document || document.kind !== "page" || !isHotelDirectBookingsPageDocument(document)) return null;
  const hydrated = await hydrateDirectBookingDocument(document);
  const locales = await pageDocumentsBySlug(HOTEL_DIRECT_BOOKINGS_PAGE_SLUG);
  return {
    document: hydrated,
    state: editorStateFromDirectBookingDocument(hydrated),
    locales: locales.map((row) => ({
      id: row.id,
      locale: row.locale,
      status: row.status,
      title: row.title,
    })),
  };
}
