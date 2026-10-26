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
  RESERVATIONS_CMS_TEMPLATE,
  RESERVATIONS_INTENTS,
  RESERVATIONS_PAGE_ROUTE,
  RESERVATIONS_PAGE_SLUG,
  editorStateFromReservationsDocument,
  isReservationsCmsBody,
  isReservationsPageDocument,
  parseReservationsPageBody,
  serializeReservationsPageBody,
  validateReservationsPage,
  type CmsReservationsPage,
  type CmsReservationsVisual,
  type ReservationsIntent,
  type ReservationsSaveResult,
} from "./reservations-page";
import { defaultReservationsCms } from "./reservations-page-seed";
import {
  RESERVATIONS_BOUNDARIES_SETTING,
  loadReservationBoundaries,
  serializeReservationBoundaries,
} from "./reservations-boundaries";
import type { ReservationServiceBoundaries } from "@/lib/reservations";
import { pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): ReservationsIntent {
  return RESERVATIONS_INTENTS.includes(value as ReservationsIntent) ? (value as ReservationsIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateReservations(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/reservations");
  revalidatePath(`/crm/cms/pages/${doc.slug}`);
  revalidatePath("/", "layout");
  revalidatePath(RESERVATIONS_PAGE_ROUTE);
  revalidatePath(RESERVATIONS_PAGE_ROUTE, "page");
  revalidatePath("/en/solutions/outsourced-hotel-reservations");
  revalidatePath("/ru/solutions/outsourced-hotel-reservations");
  revalidatePath("/zh/solutions/outsourced-hotel-reservations");
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
  visual: CmsReservationsVisual,
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

function boundariesFromContent(content: CmsReservationsPage, locale: Locale): ReservationServiceBoundaries {
  const thai = locale === "th";
  return {
    handles: content.boundaries.handles.map((item) => ({ ...item })),
    hotelOwns: content.boundaries.hotelOwns.map((item) => ({ ...item })),
    supportedChannels: [...content.boundaries.supportedChannels],
    supportedLanguages: [...content.boundaries.supportedLanguages],
    operatingHours: content.boundaries.operatingHours,
    slaTextTh: thai ? content.boundaries.slaText : "",
    slaTextEn: thai ? "" : content.boundaries.slaText,
    escalationPath: content.boundaries.escalationPath,
    integrationNotes: content.boundaries.integrationNotes,
    reportingFrequency: content.boundaries.reportingFrequency,
    privacyNoteTh: thai ? content.boundaries.privacyNote : "",
    privacyNoteEn: thai ? "" : content.boundaries.privacyNote,
  };
}

async function syncBoundariesSetting(content: CmsReservationsPage, locale: Locale) {
  if (locale !== "th") return;
  const db = await cmsDb();
  const value = serializeReservationBoundaries(boundariesFromContent(content, locale));
  await db.cmsSetting.upsert({
    where: { id: RESERVATIONS_BOUNDARIES_SETTING },
    create: { id: RESERVATIONS_BOUNDARIES_SETTING, value },
    update: { value },
  });
}

export async function hydrateReservationsDocument(doc: CmsDocumentRow) {
  if (!isReservationsPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isReservationsCmsBody(doc.body) ? parseReservationsPageBody(doc.body, locale) : null;
  if (doc.template === RESERVATIONS_CMS_TEMPLATE && parsed) return doc;
  const setting = await loadReservationBoundaries().catch(() => undefined);
  const content = parsed ?? defaultReservationsCms(locale, setting);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: RESERVATIONS_CMS_TEMPLATE,
      body: serializeReservationsPageBody(content),
    },
  });
}

function applyIntent(status: string, intent: ReservationsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveReservationsPage(formData: FormData): Promise<ReservationsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  let content: CmsReservationsPage;
  try {
    content = parseReservationsPageBody(String(formData.get("contentJson") ?? ""), locale) ?? defaultReservationsCms(locale);
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  const uploads = await Promise.all([
    applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    applyVisualUpload(formData, content.problemsSection.visual, "problemsImageFile", "clearProblemsImage"),
    applyVisualUpload(formData, content.scopeSection.visual, "mapImageFile", "clearMapImage"),
    applyVisualUpload(formData, content.benefitsSection.visual, "benefitsImageFile", "clearBenefitsImage"),
    applyVisualUpload(formData, content.workflowSection.visual, "workflowImageFile", "clearWorkflowImage"),
    applyVisualUpload(formData, content.measureSection.visual, "kpiImageFile", "clearKpiImage"),
    applyVisualUpload(formData, content.related.visual, "relatedImageFile", "clearRelatedImage"),
    applyVisualUpload(formData, content.form.visual, "formImageFile", "clearFormImage"),
    applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
  ]);
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  const invalid = validateReservationsPage(content, intent);
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
      template: RESERVATIONS_CMS_TEMPLATE,
      excerpt,
      body: serializeReservationsPageBody(content),
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
  await syncBoundariesSetting(content, locale);
  await refreshCmsFiles();
  revalidateReservations(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureReservationsPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = RESERVATIONS_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateReservationsDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === RESERVATIONS_PAGE_ROUTE && page.language === "th");
  const setting = await loadReservationBoundaries().catch(() => undefined);
  const content = defaultReservationsCms(locale, setting);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.hero.title,
      slug,
      locale,
      status: "published",
      template: RESERVATIONS_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description,
      body: serializeReservationsPageBody(content),
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
  await syncBoundariesSetting(content, locale);
  await refreshCmsFiles();
  revalidateReservations(created);
  return created.id;
}

export async function editorStateForReservationsDocument(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "page") return null;
  const hydrated = await hydrateReservationsDocument(doc);
  return { document: hydrated, state: editorStateFromReservationsDocument(hydrated) };
}
