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
  HOTEL_AI_CMS_INTENTS,
  HOTEL_AI_CMS_TEMPLATE,
  HOTEL_AI_PAGE_ROUTE,
  HOTEL_AI_PAGE_SLUG,
  defaultHotelAiCms,
  editorStateFromHotelAiDocument,
  isHotelAiCmsBody,
  isHotelAiPageDocument,
  parseHotelAiPageBody,
  serializeHotelAiPageBody,
  validateHotelAiPage,
  type CmsHotelAiPage,
  type CmsHotelAiVisual,
  type HotelAiCmsIntent,
  type HotelAiCmsSaveResult,
} from "./hotel-ai-page";
import { pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): HotelAiCmsIntent {
  return HOTEL_AI_CMS_INTENTS.includes(value as HotelAiCmsIntent) ? (value as HotelAiCmsIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateHotelAi(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/hotel-ai");
  revalidatePath("/", "layout");
  revalidatePath(HOTEL_AI_PAGE_ROUTE);
  revalidatePath("/en/solutions/hotel-ai-automation");
  revalidatePath("/ru/solutions/hotel-ai-automation");
  revalidatePath("/zh/solutions/hotel-ai-automation");
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
  visual: CmsHotelAiVisual,
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

export async function hydrateHotelAiDocument(doc: CmsDocumentRow) {
  if (!isHotelAiPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isHotelAiCmsBody(doc.body) ? parseHotelAiPageBody(doc.body, locale) : null;
  if (doc.template === HOTEL_AI_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultHotelAiCms(locale);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: HOTEL_AI_CMS_TEMPLATE,
      body: serializeHotelAiPageBody(content),
    },
  });
}

function applyIntent(status: string, intent: HotelAiCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveHotelAiPage(formData: FormData): Promise<HotelAiCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  const parsed = parseHotelAiPageBody(String(formData.get("contentJson") ?? ""), locale);
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsHotelAiPage = parsed;

  const uploads = await Promise.all([
    applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    applyVisualUpload(formData, content.pains.visual, "painsImageFile", "clearPainsImage"),
    applyVisualUpload(formData, content.process.visual, "processImageFile", "clearProcessImage"),
    applyVisualUpload(formData, content.cases.visual, "casesImageFile", "clearCasesImage"),
    applyVisualUpload(formData, content.pilot.visual, "pilotImageFile", "clearPilotImage"),
    applyVisualUpload(formData, content.evidence.visual, "evidenceImageFile", "clearEvidenceImage"),
    applyVisualUpload(formData, content.measure.visual, "measureImageFile", "clearMeasureImage"),
    applyVisualUpload(formData, content.ownership.visual, "ownershipImageFile", "clearOwnershipImage"),
    applyVisualUpload(formData, content.fit.visual, "fitImageFile", "clearFitImage"),
    applyVisualUpload(formData, content.related.visual, "relatedImageFile", "clearRelatedImage"),
    applyVisualUpload(formData, content.form.visual, "formImageFile", "clearFormImage"),
    applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
  ]);
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const invalid = validateHotelAiPage(content, intent);
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || `${content.hero.titleLead} ${content.hero.titleAccent}`.trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      locale,
      status: nextStatus,
      template: HOTEL_AI_CMS_TEMPLATE,
      excerpt,
      body: serializeHotelAiPageBody(content),
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
  revalidateHotelAi(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureHotelAiPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = HOTEL_AI_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateHotelAiDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === HOTEL_AI_PAGE_ROUTE && page.language === "th");
  const content = defaultHotelAiCms(locale);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || `${content.hero.titleLead} ${content.hero.titleAccent}`.trim(),
      slug,
      locale,
      status: "draft",
      template: HOTEL_AI_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description,
      body: serializeHotelAiPageBody(content),
      seoTitle: sitePage?.title || `${content.hero.titleLead} ${content.hero.titleAccent}`.trim(),
      metaDescription: sitePage?.description || content.hero.description,
      canonical: HOTEL_AI_PAGE_ROUTE,
      createdBy: user.email,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateHotelAi(created);
  return created.id;
}

function contentForLocaleCopy(content: CmsHotelAiPage, locale: Locale): CmsHotelAiPage {
  const variant = content.seo.variants.find((item) => item.locale === locale);
  const canonical = locale === "th" ? HOTEL_AI_PAGE_ROUTE : `/${locale}${HOTEL_AI_PAGE_ROUTE}`;
  if (locale !== "en") {
    return {
      ...content,
      seo: { ...content.seo, canonical: variant?.canonical.trim() || canonical },
    };
  }
  return {
    ...content,
    hero: {
      ...content.hero,
      titleLead: variant?.title.trim() || content.hero.titleLead,
      description: variant?.description.trim() || content.hero.description,
    },
    faqs: content.faqs.map((faq) => ({
      ...faq,
      q: faq.qEn.trim() || faq.q,
      a: faq.aEn.trim() || faq.a,
    })),
    seo: { ...content.seo, canonical: variant?.canonical.trim() || canonical },
  };
}

export async function duplicateHotelAiPageToLocale(formData: FormData): Promise<HotelAiCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const locale = asLocale(String(formData.get("targetLocale") ?? ""));
  if (!locale || locale === String(formData.get("locale") ?? "")) return { ok: false, error: "invalid_locale" };
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page" || !isHotelAiPageDocument(existing)) return { ok: false, error: "missing" };
  const duplicate = await pageDocumentBySlug(HOTEL_AI_PAGE_SLUG, locale);
  if (duplicate && !duplicate.trashedAt) return { ok: false, error: "locale_exists" };

  const parsed = parseHotelAiPageBody(existing.body, asLocale(existing.locale)) ?? defaultHotelAiCms(locale);
  const content = contentForLocaleCopy(parsed, locale);
  const canonical = locale === "th" ? HOTEL_AI_PAGE_ROUTE : `/${locale}${HOTEL_AI_PAGE_ROUTE}`;
  const db = await cmsDb();
  if (duplicate?.trashedAt) {
    const restored = await db.cmsDocument.update({
      where: { id: duplicate.id },
      data: {
        title: `${existing.title} (${locale})`,
        locale,
        status: "draft",
        template: HOTEL_AI_CMS_TEMPLATE,
        excerpt: existing.excerpt,
        body: serializeHotelAiPageBody(content),
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
    revalidateHotelAi(restored);
    return { ok: true, id: restored.id, intent: "draft" };
  }

  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: `${existing.title} (${locale})`,
      slug: HOTEL_AI_PAGE_SLUG,
      locale,
      status: "draft",
      template: HOTEL_AI_CMS_TEMPLATE,
      excerpt: existing.excerpt,
      body: serializeHotelAiPageBody(content),
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
  revalidateHotelAi(created);
  return { ok: true, id: created.id, intent: "draft" };
}

export async function editorStateForHotelAiDocument(id: string) {
  const document = await documentById(id);
  if (!document || document.kind !== "page" || !isHotelAiPageDocument(document)) return null;
  const hydrated = await hydrateHotelAiDocument(document);
  const locales = await pageDocumentsBySlug(HOTEL_AI_PAGE_SLUG);
  return {
    document: hydrated,
    state: editorStateFromHotelAiDocument(hydrated),
    locales: locales.map((row) => ({
      id: row.id,
      locale: row.locale,
      status: row.status,
      title: row.title,
    })),
  };
}
