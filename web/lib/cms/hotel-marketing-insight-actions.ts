"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { insightBySlug, insightHeadingId, type InsightSource } from "@/lib/insights";
import { parseInsightImageMeta, serializeInsightImageMeta, type InsightImageMeta } from "@/lib/insights-media";
import { SITE } from "@/lib/seo";
import { CASE_STUDY_IMAGE_TYPES, MAX_CASE_STUDY_IMAGE_BYTES } from "./case-studies";
import { documentPath } from "./body";
import { cmsDb, documentById, insightDocumentBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";
import {
  HM_CMS_INTENTS,
  HOTEL_MARKETING_CMS_TEMPLATE,
  HOTEL_MARKETING_ROUTE,
  HOTEL_MARKETING_SLUG,
  editorStateFromHotelMarketingDocument,
  hmDateToUtc,
  isHotelMarketingCmsBody,
  isHotelMarketingInsightDocument,
  parseHotelMarketingInsightBody,
  serializeHotelMarketingInsightBody,
  validateHotelMarketingInsight,
  type CmsHmVisual,
  type CmsHotelMarketingInsight,
  type HmCmsIntent,
  type HmCmsSaveResult,
  type LocaleText,
} from "./hotel-marketing-insight";
import { defaultHotelMarketingInsight } from "./hotel-marketing-insight-seed";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): HmCmsIntent {
  return HM_CMS_INTENTS.includes(value as HmCmsIntent) ? (value as HmCmsIntent) : "save";
}

function applyIntent(status: string, intent: HmCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

function revalidateHm(doc: Pick<CmsDocumentRow, "id" | "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/insights");
  revalidatePath(`/crm/cms/insights/${doc.id}`);
  revalidatePath(`/crm/cms/insights/${doc.id}/preview`);
  revalidatePath("/crm/cms/hotel-marketing");
  revalidatePath("/", "layout");
  revalidatePath("/insights");
  revalidatePath(HOTEL_MARKETING_ROUTE);
  revalidatePath(HOTEL_MARKETING_ROUTE, "page");
  revalidatePath(`/en${HOTEL_MARKETING_ROUTE}`);
  revalidatePath(path);
  revalidatePath(path, "page");
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Image upload → /media/cms (same storage + CmsMedia row as the other CMS editors)                              */
/* ------------------------------------------------------------------------------------------------------------ */

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

async function applyVisualUpload(formData: FormData, visual: CmsHmVisual, fileKey: string, clearKey: string) {
  const file = formData.get(fileKey);
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const stored = await storeImage(file);
    if (!stored.ok) return stored.error;
    visual.src = stored.path;
    visual.mode = "image";
    if (visual.status === "placeholder") visual.status = "sample";
    if (!visual.assetSource.trim()) visual.assetSource = file.name;
  }
  if (formData.get(clearKey) === "1" && !hasFile) {
    visual.src = "";
    visual.status = "placeholder";
    if (visual.diagramId) visual.mode = "diagram";
  }
  return null;
}

/** Every uploadable visual slot, keyed the way the editor form names its file inputs. */
function uploadSlots(content: CmsHotelMarketingInsight) {
  return [
    { visual: content.cover, file: "coverImageFile", clear: "clearCoverImage" },
    ...content.strategies.map((strategy) => ({
      visual: strategy.visual,
      file: `strategyImageFile_${strategy.id}`,
      clear: `clearStrategyImage_${strategy.id}`,
    })),
    ...content.sections.map((section) => ({
      visual: section.visual,
      file: `sectionImageFile_${section.id}`,
      clear: `clearSectionImage_${section.id}`,
    })),
    { visual: content.compare.visual, file: "compareImageFile", clear: "clearCompareImage" },
    { visual: content.startHere.visual, file: "startImageFile", clear: "clearStartImage" },
    { visual: content.seo.social, file: "ogImageFile", clear: "clearOgImage" },
  ];
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Content helpers                                                                                              */
/* ------------------------------------------------------------------------------------------------------------ */

function parseContentJson(raw: string): CmsHotelMarketingInsight | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    // The editor posts the content object; make sure the kind marker survives a hand-edited payload.
    return parseHotelMarketingInsightBody(JSON.stringify({ ...(parsed as object), kind: "hotel-marketing-insight" }));
  } catch {
    return null;
  }
}

function renumber<T extends { order: number }>(items: T[]) {
  items.forEach((item, index) => {
    item.order = index + 1;
  });
}

/** Keep anchor sections (compare / start / conclusion) aligned with their content blocks, and fill ToC defaults. */
function normalizeContent(content: CmsHotelMarketingInsight) {
  renumber(content.sections);
  renumber(content.strategies);
  renumber(content.metrics);
  renumber(content.compare.lanes);
  renumber(content.compare.handoffs);
  renumber(content.startHere.steps);
  renumber(content.relatedServices);
  renumber(content.relatedArticles);

  const heading = (value: LocaleText) => (value.th.trim() || value.en.trim() ? { ...value } : null);
  for (const section of content.sections) {
    const linked =
      section.type === "compare"
        ? heading(content.compare.heading)
        : section.type === "start"
          ? heading(content.startHere.heading)
          : section.type === "conclusion"
            ? heading(content.conclusion.heading)
            : null;
    if (linked) section.heading = linked;
    if (!section.tocLabel.th.trim()) section.tocLabel.th = section.heading.th;
    if (!section.tocLabel.en.trim()) section.tocLabel.en = section.heading.en;
    if (!section.tocAnchor.trim() && section.heading.th.trim()) section.tocAnchor = insightHeadingId(section.heading.th);
  }
}

function pickLocale(locale: string, text: LocaleText) {
  return locale === "th" ? text.th : text.en.trim() || text.th;
}

/** Legacy insight metadata (`CmsDocument.tags`) kept in sync so listings / related cards / sources keep working. */
function buildInsightTags(content: CmsHotelMarketingInsight, previous: Partial<InsightImageMeta>) {
  const sources: InsightSource[] = content.references
    .filter((reference) => reference.label.th.trim() || reference.label.en.trim())
    .map((reference) => {
      const th = reference.label.th.trim();
      const en = reference.label.en.trim();
      const url = reference.url.trim();
      return {
        label: en || th,
        ...(th || en ? { labelByLocale: { ...(th ? { th } : {}), ...(en ? { en } : {}) } } : {}),
        ...(url ? { url } : {}),
      };
    });
  return serializeInsightImageMeta({
    imageFit: previous.imageFit ?? "cover",
    imageStatus: content.cover.status,
    authorRole: "",
    // Only a verified review may surface publicly as "Reviewed by".
    reviewerName: content.reviewerVerified ? content.reviewerName.trim() : "",
    sources,
    relatedArticleIds: content.relatedArticles.map((article) => article.articleId.trim()).filter(Boolean),
    isFeatured: previous.isFeatured,
  });
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Hydration                                                                                                    */
/* ------------------------------------------------------------------------------------------------------------ */

export async function hydrateHotelMarketingInsightDocument(doc: CmsDocumentRow) {
  if (!isHotelMarketingInsightDocument(doc)) return doc;
  const parsed = isHotelMarketingCmsBody(doc.body) ? parseHotelMarketingInsightBody(doc.body) : null;
  if (doc.template === HOTEL_MARKETING_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultHotelMarketingInsight();
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: { template: HOTEL_MARKETING_CMS_TEMPLATE, body: serializeHotelMarketingInsightBody(content) },
  });
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Save                                                                                                         */
/* ------------------------------------------------------------------------------------------------------------ */

function formText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveHotelMarketingInsight(formData: FormData): Promise<HmCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "insight" || !isHotelMarketingInsightDocument(existing)) {
    return { ok: false, error: "missing" };
  }

  const content = parseContentJson(String(formData.get("contentJson") ?? ""));
  if (!content) return { ok: false, error: "invalid_json" };

  const locale = existing.locale || "th";

  const uploads = await Promise.all(
    uploadSlots(content).map((slot) => applyVisualUpload(formData, slot.visual, slot.file, slot.clear)),
  );
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  normalizeContent(content);

  // Optional form-level overrides for the SEO tab; the content JSON stays the source of truth otherwise.
  const seoTitleOverride = formText(formData, "seoTitle");
  const metaDescriptionOverride = formText(formData, "metaDescription");
  const excerptOverride = formText(formData, "excerpt");
  const canonical = formText(formData, "canonical") || content.seo.canonical.trim();
  const target = locale === "th" ? "th" : "en";
  if (seoTitleOverride) content.seo.title[target] = seoTitleOverride;
  if (metaDescriptionOverride) content.seo.description[target] = metaDescriptionOverride;
  if (excerptOverride) content.excerpt[target] = excerptOverride;
  content.seo.canonical = canonical;

  const title = pickLocale(locale, content.title).trim() || existing.title;
  const excerpt = pickLocale(locale, content.excerpt).trim();
  const seoTitle = pickLocale(locale, content.seo.title).trim() || title;
  const metaDescription = pickLocale(locale, content.seo.description).trim() || excerpt;

  const invalid = validateHotelMarketingInsight(content, intent, {
    seoTitle,
    metaDescription,
    bilingual: content.translation.enEnabled,
  });
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const publishedAt = hmDateToUtc(content.publishedAt) ?? existing.publishedAt ?? (published ? new Date() : null);
  const updatedAt = hmDateToUtc(content.updatedAt);

  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      status: nextStatus,
      template: HOTEL_MARKETING_CMS_TEMPLATE,
      excerpt,
      body: serializeHotelMarketingInsightBody(content),
      featuredImage: content.cover.src,
      imageAlt: pickLocale(locale, content.cover.alt),
      category: pickLocale(locale, content.category),
      author: content.authorName.trim(),
      tags: buildInsightTags(content, parseInsightImageMeta(existing.tags)),
      seoTitle,
      metaDescription,
      canonical,
      ogImage: content.seo.social.src,
      publishedAt,
      scheduledAt: null,
      updatedBy: user.email,
      ...(updatedAt ? { updatedAt } : {}),
    },
  });
  await refreshCmsFiles();
  revalidateHm(saved);
  return { ok: true, id: saved.id, intent };
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Ensure / editor state                                                                                        */
/* ------------------------------------------------------------------------------------------------------------ */

export async function ensureHotelMarketingInsightFromSite() {
  const user = await requireCms();
  const db = await cmsDb();
  const existing = await insightDocumentBySlug(HOTEL_MARKETING_SLUG, "th");
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({ where: { id: existing.id }, data: { trashedAt: null, updatedBy: user.email } });
    }
    const hydrated = await hydrateHotelMarketingInsightDocument(existing);
    return hydrated.id;
  }

  const post = insightBySlug(HOTEL_MARKETING_SLUG);
  const content = defaultHotelMarketingInsight();
  const created = await db.cmsDocument.create({
    data: {
      kind: "insight",
      title: content.title.th,
      slug: HOTEL_MARKETING_SLUG,
      locale: "th",
      status: "published",
      template: HOTEL_MARKETING_CMS_TEMPLATE,
      excerpt: content.excerpt.th,
      body: serializeHotelMarketingInsightBody(content),
      featuredImage: content.cover.src,
      imageAlt: content.cover.alt.th,
      category: content.category.th,
      tags: buildInsightTags(content, {
        imageFit: post?.coverImageFit ?? "contain",
        isFeatured: post?.isFeatured,
      }),
      author: content.authorName,
      seoTitle: content.seo.title.th,
      metaDescription: content.seo.description.th,
      canonical: "",
      ogImage: "",
      publishedAt: hmDateToUtc(content.publishedAt) ?? new Date(),
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateHm(created);
  return created.id;
}

export async function editorStateForHotelMarketingDocument(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "insight" || !isHotelMarketingInsightDocument(doc)) return null;
  const hydrated = await hydrateHotelMarketingInsightDocument(doc);
  return { document: hydrated, state: editorStateFromHotelMarketingDocument(hydrated) };
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Translation duplicate                                                                                        */
/* ------------------------------------------------------------------------------------------------------------ */

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Copy previously entered English text from `previous` into the freshly cloned `target`, so re-syncing structure from
 * the Thai article never wipes a translator's work. Items are matched by `id` (falling back to index).
 */
function keepEnglish(target: unknown, previous: unknown): void {
  if (Array.isArray(target)) {
    if (!Array.isArray(previous)) return;
    target.forEach((item, index) => {
      const match =
        isObject(item) && typeof item.id === "string"
          ? previous.find((candidate) => isObject(candidate) && candidate.id === item.id)
          : previous[index];
      keepEnglish(item, match);
    });
    return;
  }
  if (!isObject(target) || !isObject(previous)) return;
  for (const key of Object.keys(target)) {
    const next = target[key];
    const prior = previous[key];
    const isEnglishKey = key === "en" || (key.length > 2 && key.endsWith("En"));
    if (isEnglishKey) {
      if (typeof next === "string" && typeof prior === "string" && prior.trim()) target[key] = prior;
      else if (Array.isArray(next) && Array.isArray(prior) && prior.length) target[key] = prior;
      continue;
    }
    keepEnglish(next, prior);
  }
}

/** FormData wrapper for the editor's "duplicate for translation" button (`id` + `targetLocale`). */
export async function duplicateHotelMarketingInsightFromForm(
  formData: FormData,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  return duplicateHotelMarketingInsightForTranslation(
    String(formData.get("id") ?? ""),
    String(formData.get("targetLocale") ?? ""),
  );
}

export async function duplicateHotelMarketingInsightForTranslation(
  id: string,
  targetLocale: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const user = await requireCms();
  if (targetLocale !== "en") return { ok: false, error: "unsupported_locale" };

  const source = id ? await documentById(id) : null;
  if (!source || source.kind !== "insight" || !isHotelMarketingInsightDocument(source) || source.locale !== "th") {
    return { ok: false, error: "missing" };
  }
  const hydrated = await hydrateHotelMarketingInsightDocument(source);
  const thContent = parseHotelMarketingInsightBody(hydrated.body);
  if (!thContent) return { ok: false, error: "invalid_json" };

  const content = JSON.parse(JSON.stringify(thContent)) as CmsHotelMarketingInsight;
  const db = await cmsDb();
  const existing = await insightDocumentBySlug(HOTEL_MARKETING_SLUG, "en");
  const previous = existing ? parseHotelMarketingInsightBody(existing.body) : null;
  if (previous) keepEnglish(content, previous);

  // The English copy is a review draft: enabled so the editor shows EN fields, never "ready" until a human says so.
  content.translation = {
    enEnabled: true,
    enReady: previous?.translation.enReady ?? false,
    duplicateOfLocale: "th",
  };
  const path = documentPath({ kind: "insight", slug: HOTEL_MARKETING_SLUG, locale: "en" });
  content.seo.canonical = previous?.seo.canonical.trim() || `${SITE}${path}`;
  normalizeContent(content);

  const title = content.title.en.trim() || content.title.th;
  const excerpt = content.excerpt.en.trim() || content.excerpt.th;
  const data = {
    title,
    excerpt,
    body: serializeHotelMarketingInsightBody(content),
    template: HOTEL_MARKETING_CMS_TEMPLATE,
    featuredImage: content.cover.src,
    imageAlt: content.cover.alt.en.trim() || content.cover.alt.th,
    category: content.category.en.trim() || content.category.th,
    author: content.authorName.trim(),
    tags: buildInsightTags(content, parseInsightImageMeta(hydrated.tags)),
    seoTitle: content.seo.title.en.trim() || title,
    metaDescription: content.seo.description.en.trim() || excerpt,
    canonical: content.seo.canonical,
    ogImage: content.seo.social.src,
    updatedBy: user.email,
  };

  let saved: CmsDocumentRow;
  if (existing) {
    saved = await db.cmsDocument.update({
      where: { id: existing.id },
      // A live English page stays live; a trashed one is restored as a draft.
      data: { ...data, ...(existing.trashedAt ? { trashedAt: null, status: "draft" } : {}) },
    });
  } else {
    saved = await db.cmsDocument.create({
      data: {
        ...data,
        kind: "insight",
        slug: HOTEL_MARKETING_SLUG,
        locale: "en",
        status: "draft",
        publishedAt: null,
      },
    });
  }
  await refreshCmsFiles();
  revalidateHm(saved);
  revalidateHm(hydrated);
  return { ok: true, id: saved.id };
}
