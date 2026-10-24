"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import {
  CASE_STUDY_IMAGE_TYPES,
  MAX_CASE_STUDY_IMAGE_BYTES,
  inputFromForm,
  intentFromForm,
  validateCaseStudyInput,
  validateImageBuffer,
  type CaseStudyIntent,
  type CaseStudySaveInput,
  type CaseStudySaveResult,
} from "./case-studies";
import {
  findCaseStudy,
  findCaseStudyBySlug,
  insertCaseStudy,
  restoreCaseStudyRow,
  rowFromInput,
  trashCaseStudyRow,
  updateCaseStudyRow,
} from "./case-study-store";
import { cmsDb } from "./queries";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function revalidateCaseStudies(slug?: string) {
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/case-studies");
  revalidatePath("/case-studies");
  revalidatePath("/en/case-studies");
  revalidatePath("/ru/case-studies");
  revalidatePath("/zh/case-studies");
  if (!slug) return;
  revalidatePath(`/crm/cms/case-studies`);
  for (const path of [`/case-studies/${slug}`, `/en/case-studies/${slug}`, `/ru/case-studies/${slug}`, `/zh/case-studies/${slug}`]) {
    revalidatePath(path);
    revalidatePath(path, "page");
  }
}

async function storeCaseStudyImage(
  file: File,
  kind: "cover" | "report" | "logo",
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const original = file.name || "";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  if (!CASE_STUDY_IMAGE_TYPES.has(ext) || file.size > MAX_CASE_STUDY_IMAGE_BYTES) {
    return { ok: false, error: "invalid_image" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const dimensionError = validateImageBuffer(buffer, kind);
  if (dimensionError) return { ok: false, error: dimensionError };
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

async function applyUploads(formData: FormData, input: CaseStudySaveInput): Promise<string | null> {
  const coverFile = formData.get("coverImageFile");
  const reportFile = formData.get("reportPreviewFile");
  const logoFile = formData.get("clientLogoFile");
  const hasCover = coverFile instanceof File && coverFile.size > 0;
  const hasReport = reportFile instanceof File && reportFile.size > 0;
  const hasLogo = logoFile instanceof File && logoFile.size > 0;

  if (hasCover) {
    const stored = await storeCaseStudyImage(coverFile, "cover");
    if (!stored.ok) return stored.error;
    input.coverImage = stored.path;
    if (input.coverImageStatus === "placeholder") input.coverImageStatus = "real";
  }
  if (hasReport) {
    const stored = await storeCaseStudyImage(reportFile, "report");
    if (!stored.ok) return stored.error;
    input.reportPreview = stored.path;
  }
  if (hasLogo) {
    const stored = await storeCaseStudyImage(logoFile, "logo");
    if (!stored.ok) return stored.error;
    input.clientLogo = stored.path;
  }
  if (formData.get("clearCoverImage") === "1" && !hasCover) {
    input.coverImage = "";
    input.coverImageStatus = "placeholder";
  }
  if (formData.get("clearReportPreview") === "1" && !hasReport) input.reportPreview = "";
  if (formData.get("clearClientLogo") === "1" && !hasLogo) input.clientLogo = "";
  return null;
}

function applyIntent(
  input: CaseStudySaveInput,
  intent: CaseStudyIntent,
  existingPublished: boolean,
  existingWorkflow: CaseStudySaveInput["workflowStatus"],
) {
  if (intent === "review") {
    input.workflowStatus = "review";
    input.isPublished = false;
    return;
  }
  if (intent === "approve") {
    input.workflowStatus = "approved";
    input.isPublished = existingPublished;
    return;
  }
  if (intent === "publish") {
    input.workflowStatus = "approved";
    input.isPublished = true;
    if (!input.publishedAt) input.publishedAt = new Date().toISOString().slice(0, 16);
    return;
  }
  if (intent === "unpublish") {
    input.isPublished = false;
    return;
  }
  if (intent === "draft") {
    input.workflowStatus = "draft";
    input.isPublished = false;
    return;
  }
  input.workflowStatus = existingWorkflow || input.workflowStatus || "draft";
  input.isPublished = existingPublished;
}

export async function saveCaseStudy(formData: FormData): Promise<CaseStudySaveResult> {
  const user = await requireCms();
  const intent = intentFromForm(formData);
  const input = inputFromForm(formData);
  const uploadError = await applyUploads(formData, input);
  if (uploadError) return { ok: false, error: uploadError };

  const existing = input.id ? await findCaseStudy(input.id) : null;
  if (input.id && !existing) return { ok: false, error: "missing" };

  applyIntent(input, intent, Boolean(existing?.isPublished), existing ? (existing.workflowStatus as CaseStudySaveInput["workflowStatus"]) : "draft");

  if (intent === "publish" && existing && existing.workflowStatus !== "approved" && existing.workflowStatus !== "review") {
    // Publish may approve in the same step after validation.
  }

  const invalid = validateCaseStudyInput(input, intent);
  if (invalid) return { ok: false, error: invalid };

  const duplicate = await findCaseStudyBySlug(input.slug, input.locale, existing?.id);
  if (duplicate && !duplicate.trashedAt) return { ok: false, error: "exists" };

  const row = rowFromInput(input, existing, user.name || user.email || user.id);
  const saved = existing ? await updateCaseStudyRow(existing.id, { ...row, id: existing.id }) : await insertCaseStudy(row);
  if (!saved) return { ok: false, error: "missing" };

  revalidateCaseStudies(saved.slug);
  revalidatePath(`/crm/cms/case-studies/${saved.id}`);
  revalidatePath(`/crm/cms/case-studies/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function deleteCaseStudy(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const existing = id ? await findCaseStudy(id) : null;
  if (!existing) redirect("/crm/cms/case-studies?error=missing");
  await trashCaseStudyRow(existing.id);
  revalidateCaseStudies(existing.slug);
  redirect("/crm/cms/case-studies?deleted=1");
}

export async function restoreCaseStudy(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const existing = id ? await findCaseStudy(id) : null;
  if (!existing) redirect("/crm/cms/case-studies?error=missing");
  await restoreCaseStudyRow(existing.id);
  revalidateCaseStudies(existing.slug);
  redirect("/crm/cms/case-studies?restored=1");
}

export async function duplicateCaseStudy(formData: FormData) {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const existing = id ? await findCaseStudy(id) : null;
  if (!existing) redirect("/crm/cms/case-studies?error=missing");
  let slug = `${existing.slug}-copy`;
  let n = 2;
  while (await findCaseStudyBySlug(slug, existing.locale)) {
    slug = `${existing.slug}-copy-${n}`;
    n += 1;
  }
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = existing;
  void _createdAt;
  void _updatedAt;
  const copy = await insertCaseStudy({
    ...rest,
    id: `cs${randomToken(12)}`,
    title: `${existing.title} (Draft copy)`,
    slug,
    workflowStatus: "draft",
    isPublished: false,
    publishedAt: null,
    trashedAt: null,
    updatedBy: user.name || user.email || user.id,
  });
  revalidatePath("/crm/cms/case-studies");
  redirect(`/crm/cms/case-studies/${copy.id}?saved=1`);
}
