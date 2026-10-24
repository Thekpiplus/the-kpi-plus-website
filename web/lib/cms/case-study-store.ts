import { randomToken } from "@/lib/crm/security";
import { prisma } from "@/lib/crm/db";
import type { CaseStudy, CaseStudyComparison } from "@/lib/case-studies";
import { asBool, type CmsCaseStudyRow } from "./types";
import { ensureCmsSchema } from "./ensure";
import {
  departmentFromServiceArea,
  type CaseStudySaveInput,
} from "./case-studies";

type CaseStudyData = Omit<CmsCaseStudyRow, "createdAt" | "updatedAt">;

function toDate(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapRow(row: Record<string, unknown>): CmsCaseStudyRow {
  return {
    id: String(row.id ?? ""),
    department: String(row.department ?? "revenue"),
    title: String(row.title ?? ""),
    slug: String(row.slug ?? ""),
    locale: String(row.locale ?? "th"),
    shortDescription: String(row.shortDescription ?? ""),
    clientName: String(row.clientName ?? ""),
    clientNameApproved: asBool(row.clientNameApproved),
    anonymisedLabel: String(row.anonymisedLabel ?? ""),
    hotelType: String(row.hotelType ?? ""),
    location: String(row.location ?? ""),
    serviceArea: String(row.serviceArea ?? ""),
    challenge: String(row.challenge ?? ""),
    analysis: String(row.analysis ?? ""),
    actionPlan: String(row.actionPlan ?? ""),
    result: String(row.result ?? ""),
    metricsJson: String(row.metricsJson ?? "[]"),
    measurementPeriod: String(row.measurementPeriod ?? ""),
    baselinePeriod: String(row.baselinePeriod ?? ""),
    dataStatus: String(row.dataStatus ?? "anonymised"),
    workflowStatus: String(row.workflowStatus ?? "draft"),
    isPublished: asBool(row.isPublished),
    isFeatured: asBool(row.isFeatured),
    coverImage: String(row.coverImage ?? ""),
    coverImageAlt: String(row.coverImageAlt ?? ""),
    coverImageStatus: String(row.coverImageStatus ?? "placeholder"),
    reportPreview: String(row.reportPreview ?? ""),
    reportPreviewAlt: String(row.reportPreviewAlt ?? ""),
    chartJson: String(row.chartJson ?? ""),
    testimonialJson: String(row.testimonialJson ?? ""),
    methodologyNote: String(row.methodologyNote ?? ""),
    sourceNotes: String(row.sourceNotes ?? ""),
    relatedArticleIds: String(row.relatedArticleIds ?? "[]"),
    seoTitle: String(row.seoTitle ?? ""),
    metaDescription: String(row.metaDescription ?? ""),
    clientLogo: String(row.clientLogo ?? ""),
    clientLogoPublishable: asBool(row.clientLogoPublishable),
    adminNotes: String(row.adminNotes ?? ""),
    publishedAt: toDate(row.publishedAt),
    trashedAt: toDate(row.trashedAt),
    updatedBy: String(row.updatedBy ?? ""),
    createdAt: toDate(row.createdAt) ?? new Date(),
    updatedAt: toDate(row.updatedAt) ?? new Date(),
  };
}

async function db() {
  await ensureCmsSchema();
  return prisma();
}

const COLUMNS = `
  id, department, title, slug, locale, shortDescription, clientName, clientNameApproved, anonymisedLabel,
  hotelType, location, serviceArea, challenge, analysis, actionPlan, result, metricsJson, measurementPeriod,
  baselinePeriod, dataStatus, workflowStatus, isPublished, isFeatured, coverImage, coverImageAlt, coverImageStatus,
  reportPreview, reportPreviewAlt, chartJson, testimonialJson, methodologyNote, sourceNotes, relatedArticleIds,
  seoTitle, metaDescription, clientLogo, clientLogoPublishable, adminNotes, publishedAt, trashedAt, updatedBy,
  createdAt, updatedAt
`;

function values(data: CaseStudyData) {
  return [
    data.id,
    data.department,
    data.title,
    data.slug,
    data.locale,
    data.shortDescription,
    data.clientName,
    data.clientNameApproved ? 1 : 0,
    data.anonymisedLabel,
    data.hotelType,
    data.location,
    data.serviceArea,
    data.challenge,
    data.analysis,
    data.actionPlan,
    data.result,
    data.metricsJson,
    data.measurementPeriod,
    data.baselinePeriod,
    data.dataStatus,
    data.workflowStatus,
    data.isPublished ? 1 : 0,
    data.isFeatured ? 1 : 0,
    data.coverImage,
    data.coverImageAlt,
    data.coverImageStatus,
    data.reportPreview,
    data.reportPreviewAlt,
    data.chartJson,
    data.testimonialJson,
    data.methodologyNote,
    data.sourceNotes,
    data.relatedArticleIds,
    data.seoTitle,
    data.metaDescription,
    data.clientLogo,
    data.clientLogoPublishable ? 1 : 0,
    data.adminNotes,
    data.publishedAt,
    data.trashedAt,
    data.updatedBy,
  ];
}

export function rowFromInput(input: CaseStudySaveInput, existing?: CmsCaseStudyRow | null, updatedBy = ""): CaseStudyData {
  const publishedAt = input.publishedAt ? toDate(input.publishedAt) : existing?.publishedAt ?? null;
  return {
    id: input.id || existing?.id || `cs${randomToken(12)}`,
    department: input.department,
    title: input.title,
    slug: input.slug,
    locale: input.locale || "th",
    shortDescription: input.shortDescription,
    clientName: input.clientName,
    clientNameApproved: input.clientNameApproved,
    anonymisedLabel: input.anonymisedLabel,
    hotelType: input.hotelType,
    location: input.location,
    serviceArea: input.serviceArea,
    challenge: input.challenge,
    analysis: input.analysis,
    actionPlan: input.actionPlan,
    result: input.result,
    metricsJson: JSON.stringify(input.metrics),
    measurementPeriod: input.measurementPeriod,
    baselinePeriod: input.baselinePeriod,
    dataStatus: input.dataStatus,
    workflowStatus: input.workflowStatus,
    isPublished: input.isPublished,
    isFeatured: input.isFeatured,
    coverImage: input.coverImage,
    coverImageAlt: input.coverImageAlt,
    coverImageStatus: input.coverImageStatus,
    reportPreview: input.reportPreview,
    reportPreviewAlt: input.reportPreviewAlt,
    chartJson: input.comparison ? JSON.stringify(input.comparison) : "",
    testimonialJson: JSON.stringify(input.testimonial),
    methodologyNote: input.methodologyNote,
    sourceNotes: JSON.stringify(input.sourceNotes),
    relatedArticleIds: JSON.stringify(input.relatedArticleIds),
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    clientLogo: input.clientLogo,
    clientLogoPublishable: input.clientLogoPublishable,
    adminNotes: input.adminNotes,
    publishedAt,
    trashedAt: existing?.trashedAt ?? null,
    updatedBy: updatedBy || existing?.updatedBy || "",
  };
}

export async function caseStudyCount() {
  try {
    const rows = await (await db()).$queryRawUnsafe<Array<{ n: number }>>(
      "SELECT COUNT(*) AS n FROM `CmsCaseStudy` WHERE `trashedAt` IS NULL",
    );
    return Number(rows[0]?.n ?? 0);
  } catch {
    return 0;
  }
}

export async function listCaseStudyRows() {
  await ensureCaseStudiesSeeded();
  const rows = await (
    await db()
  ).$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${COLUMNS} FROM \`CmsCaseStudy\` WHERE \`trashedAt\` IS NULL ORDER BY \`isFeatured\` DESC, \`updatedAt\` DESC`,
  );
  return rows.map(mapRow);
}

export async function listPublishedCaseStudyRows() {
  await ensureCaseStudiesSeeded();
  const rows = await (
    await db()
  ).$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${COLUMNS} FROM \`CmsCaseStudy\`
      WHERE \`trashedAt\` IS NULL
        AND \`isPublished\` = 1
        AND \`workflowStatus\` NOT IN ('draft', 'review')
        AND \`dataStatus\` NOT IN ('draft', 'review')
      ORDER BY \`isFeatured\` DESC, \`publishedAt\` DESC, \`updatedAt\` DESC`,
  );
  return rows.map(mapRow);
}

export async function findCaseStudy(id: string) {
  const rows = await (await db()).$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${COLUMNS} FROM \`CmsCaseStudy\` WHERE \`id\` = ? LIMIT 1`,
    id,
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function findCaseStudyBySlug(slug: string, locale = "th", excludeId?: string) {
  const rows = excludeId
    ? await (
        await db()
      ).$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT ${COLUMNS} FROM \`CmsCaseStudy\` WHERE \`slug\` = ? AND \`locale\` = ? AND \`id\` <> ? LIMIT 1`,
        slug,
        locale,
        excludeId,
      )
    : await (
        await db()
      ).$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT ${COLUMNS} FROM \`CmsCaseStudy\` WHERE \`slug\` = ? AND \`locale\` = ? LIMIT 1`,
        slug,
        locale,
      );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function insertCaseStudy(data: CaseStudyData) {
  await (
    await db()
  ).$executeRawUnsafe(
    `INSERT INTO \`CmsCaseStudy\` (
      id, department, title, slug, locale, shortDescription, clientName, clientNameApproved, anonymisedLabel,
      hotelType, location, serviceArea, challenge, analysis, actionPlan, result, metricsJson, measurementPeriod,
      baselinePeriod, dataStatus, workflowStatus, isPublished, isFeatured, coverImage, coverImageAlt, coverImageStatus,
      reportPreview, reportPreviewAlt, chartJson, testimonialJson, methodologyNote, sourceNotes, relatedArticleIds,
      seoTitle, metaDescription, clientLogo, clientLogoPublishable, adminNotes, publishedAt, trashedAt, updatedBy,
      createdAt, updatedAt
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW(),NOW())`,
    ...values(data),
  );
  return (await findCaseStudy(data.id))!;
}

export async function updateCaseStudyRow(id: string, data: CaseStudyData) {
  await (
    await db()
  ).$executeRawUnsafe(
    `UPDATE \`CmsCaseStudy\` SET
      department=?, title=?, slug=?, locale=?, shortDescription=?, clientName=?, clientNameApproved=?, anonymisedLabel=?,
      hotelType=?, location=?, serviceArea=?, challenge=?, analysis=?, actionPlan=?, result=?, metricsJson=?, measurementPeriod=?,
      baselinePeriod=?, dataStatus=?, workflowStatus=?, isPublished=?, isFeatured=?, coverImage=?, coverImageAlt=?, coverImageStatus=?,
      reportPreview=?, reportPreviewAlt=?, chartJson=?, testimonialJson=?, methodologyNote=?, sourceNotes=?, relatedArticleIds=?,
      seoTitle=?, metaDescription=?, clientLogo=?, clientLogoPublishable=?, adminNotes=?, publishedAt=?, trashedAt=?, updatedBy=?,
      updatedAt=NOW()
      WHERE id=?`,
    data.department,
    data.title,
    data.slug,
    data.locale,
    data.shortDescription,
    data.clientName,
    data.clientNameApproved ? 1 : 0,
    data.anonymisedLabel,
    data.hotelType,
    data.location,
    data.serviceArea,
    data.challenge,
    data.analysis,
    data.actionPlan,
    data.result,
    data.metricsJson,
    data.measurementPeriod,
    data.baselinePeriod,
    data.dataStatus,
    data.workflowStatus,
    data.isPublished ? 1 : 0,
    data.isFeatured ? 1 : 0,
    data.coverImage,
    data.coverImageAlt,
    data.coverImageStatus,
    data.reportPreview,
    data.reportPreviewAlt,
    data.chartJson,
    data.testimonialJson,
    data.methodologyNote,
    data.sourceNotes,
    data.relatedArticleIds,
    data.seoTitle,
    data.metaDescription,
    data.clientLogo,
    data.clientLogoPublishable ? 1 : 0,
    data.adminNotes,
    data.publishedAt,
    data.trashedAt,
    data.updatedBy,
    id,
  );
  return findCaseStudy(id);
}

export async function trashCaseStudyRow(id: string) {
  await (await db()).$executeRawUnsafe("UPDATE `CmsCaseStudy` SET `trashedAt` = NOW(), `isPublished` = 0, `updatedAt` = NOW() WHERE `id` = ?", id);
}

export async function restoreCaseStudyRow(id: string) {
  await (await db()).$executeRawUnsafe("UPDATE `CmsCaseStudy` SET `trashedAt` = NULL, `updatedAt` = NOW() WHERE `id` = ?", id);
}

export async function listTrashedCaseStudyRows() {
  const rows = await (
    await db()
  ).$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT ${COLUMNS} FROM \`CmsCaseStudy\` WHERE \`trashedAt\` IS NOT NULL ORDER BY \`trashedAt\` DESC, \`updatedAt\` DESC`,
  );
  return rows.map(mapRow);
}

function seedAlt(study: CaseStudy) {
  return study.coverImageAlt?.trim() || `${study.anonymisedLabel || study.hotelType || study.title} case study cover`;
}

function seedFromStudy(study: CaseStudy, comparison?: CaseStudyComparison): CaseStudyData {
  return {
    id: study.id,
    department: departmentFromServiceArea(study.serviceArea),
    title: study.title,
    slug: study.slug,
    locale: "th",
    shortDescription: study.shortDescription,
    clientName: study.clientName ?? "",
    clientNameApproved: false,
    anonymisedLabel: study.anonymisedLabel ?? "",
    hotelType: study.hotelType ?? "",
    location: study.location ?? "",
    serviceArea: study.serviceArea,
    challenge: study.challenge,
    analysis: study.analysis,
    actionPlan: study.action,
    result: study.result,
    metricsJson: JSON.stringify(study.metrics),
    measurementPeriod: study.measurementPeriod,
    baselinePeriod: study.baselinePeriod ?? "",
    dataStatus: study.dataStatus === "review" || study.dataStatus === "draft" ? "anonymised" : study.dataStatus,
    workflowStatus: study.isPublished ? "approved" : "draft",
    isPublished: study.isPublished,
    isFeatured: study.isFeatured,
    coverImage: study.coverImage ?? "",
    coverImageAlt: seedAlt(study),
    coverImageStatus: study.coverImageStatus,
    reportPreview: "",
    reportPreviewAlt: "",
    chartJson: comparison ? JSON.stringify(comparison) : "",
    testimonialJson: study.testimonial ? JSON.stringify(study.testimonial) : "",
    methodologyNote: study.methodologyNote ?? "",
    sourceNotes: JSON.stringify(study.sourceNotes ?? []),
    relatedArticleIds: "[]",
    seoTitle: study.title,
    metaDescription: study.shortDescription,
    clientLogo: "",
    clientLogoPublishable: false,
    adminNotes: "",
    publishedAt: study.publishedAt ? new Date(study.publishedAt) : study.isPublished ? new Date() : null,
    trashedAt: null,
    updatedBy: "seed",
  };
}

let seeding: Promise<void> | null = null;

export async function ensureCaseStudiesSeeded() {
  if (seeding) return seeding;
  seeding = (async () => {
    try {
      const count = await caseStudyCount();
      if (count > 0) return;
      const { caseStudies, caseStudyComparisons } = await import("@/lib/case-studies");
      for (const study of caseStudies) {
        await insertCaseStudy(seedFromStudy(study, caseStudyComparisons[study.slug]));
      }
    } catch {
      // Database may be unavailable during build.
    } finally {
      seeding = null;
    }
  })();
  return seeding;
}
