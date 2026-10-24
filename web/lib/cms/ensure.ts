import { prisma } from "@/lib/crm/db";

const CONTACT_TABLE = `
CREATE TABLE IF NOT EXISTS \`CmsContact\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`label\` VARCHAR(191) NOT NULL DEFAULT '',
  \`companyNameTh\` VARCHAR(255) NOT NULL DEFAULT '',
  \`companyNameEn\` VARCHAR(255) NOT NULL DEFAULT '',
  \`addressTh\` TEXT NOT NULL,
  \`addressEn\` TEXT NOT NULL,
  \`phone\` VARCHAR(191) NOT NULL DEFAULT '',
  \`secondaryPhone\` VARCHAR(191) NOT NULL DEFAULT '',
  \`email\` VARCHAR(191) NOT NULL DEFAULT '',
  \`whatsappNumber\` VARCHAR(191) NOT NULL DEFAULT '',
  \`googleMapsUrl\` VARCHAR(1000) NOT NULL DEFAULT '',
  \`googleMapsEmbed\` TEXT NOT NULL,
  \`hoursTh\` VARCHAR(255) NOT NULL DEFAULT '',
  \`hoursEn\` VARCHAR(255) NOT NULL DEFAULT '',
  \`facebook\` VARCHAR(500) NOT NULL DEFAULT '',
  \`instagram\` VARCHAR(500) NOT NULL DEFAULT '',
  \`linkedin\` VARCHAR(500) NOT NULL DEFAULT '',
  \`tiktok\` VARCHAR(500) NOT NULL DEFAULT '',
  \`lineHref\` VARCHAR(500) NOT NULL DEFAULT '',
  \`locationImage\` VARCHAR(500) NOT NULL DEFAULT '',
  \`locationImageAlt\` VARCHAR(500) NOT NULL DEFAULT '',
  \`consultantImage\` VARCHAR(500) NOT NULL DEFAULT '',
  \`consultantImageAlt\` VARCHAR(500) NOT NULL DEFAULT '',
  \`adminNotes\` TEXT NOT NULL,
  \`isPrimary\` BOOLEAN NOT NULL DEFAULT false,
  \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`CmsContact_isPrimary_idx\` (\`isPrimary\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

const CASE_STUDY_TABLE = `
CREATE TABLE IF NOT EXISTS \`CmsCaseStudy\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`department\` VARCHAR(191) NOT NULL DEFAULT 'revenue',
  \`title\` VARCHAR(500) NOT NULL,
  \`slug\` VARCHAR(255) NOT NULL,
  \`locale\` VARCHAR(191) NOT NULL DEFAULT 'th',
  \`shortDescription\` TEXT NOT NULL,
  \`clientName\` VARCHAR(191) NOT NULL DEFAULT '',
  \`clientNameApproved\` BOOLEAN NOT NULL DEFAULT false,
  \`anonymisedLabel\` VARCHAR(255) NOT NULL DEFAULT '',
  \`hotelType\` VARCHAR(255) NOT NULL DEFAULT '',
  \`location\` VARCHAR(255) NOT NULL DEFAULT '',
  \`serviceArea\` VARCHAR(255) NOT NULL DEFAULT '',
  \`challenge\` TEXT NOT NULL,
  \`analysis\` TEXT NOT NULL,
  \`actionPlan\` TEXT NOT NULL,
  \`result\` TEXT NOT NULL,
  \`metricsJson\` LONGTEXT NOT NULL,
  \`measurementPeriod\` VARCHAR(255) NOT NULL DEFAULT '',
  \`baselinePeriod\` VARCHAR(255) NOT NULL DEFAULT '',
  \`dataStatus\` VARCHAR(191) NOT NULL DEFAULT 'anonymised',
  \`workflowStatus\` VARCHAR(191) NOT NULL DEFAULT 'draft',
  \`isPublished\` BOOLEAN NOT NULL DEFAULT false,
  \`isFeatured\` BOOLEAN NOT NULL DEFAULT false,
  \`coverImage\` VARCHAR(500) NOT NULL DEFAULT '',
  \`coverImageAlt\` VARCHAR(500) NOT NULL DEFAULT '',
  \`coverImageStatus\` VARCHAR(191) NOT NULL DEFAULT 'placeholder',
  \`reportPreview\` VARCHAR(500) NOT NULL DEFAULT '',
  \`reportPreviewAlt\` VARCHAR(500) NOT NULL DEFAULT '',
  \`chartJson\` LONGTEXT NOT NULL,
  \`testimonialJson\` TEXT NOT NULL,
  \`methodologyNote\` TEXT NOT NULL,
  \`sourceNotes\` TEXT NOT NULL,
  \`relatedArticleIds\` TEXT NOT NULL,
  \`seoTitle\` VARCHAR(500) NOT NULL DEFAULT '',
  \`metaDescription\` TEXT NOT NULL,
  \`clientLogo\` VARCHAR(500) NOT NULL DEFAULT '',
  \`clientLogoPublishable\` BOOLEAN NOT NULL DEFAULT false,
  \`adminNotes\` TEXT NOT NULL,
  \`publishedAt\` DATETIME(3) NULL,
  \`trashedAt\` DATETIME(3) NULL,
  \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`CmsCaseStudy_slug_locale_key\` (\`slug\`, \`locale\`),
  INDEX \`CmsCaseStudy_department_idx\` (\`department\`),
  INDEX \`CmsCaseStudy_isPublished_idx\` (\`isPublished\`),
  INDEX \`CmsCaseStudy_trashedAt_idx\` (\`trashedAt\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

const CLIENT_LOGO_TABLE = `
CREATE TABLE IF NOT EXISTS \`CmsClientLogo\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`filePath\` VARCHAR(500) NOT NULL DEFAULT '',
  \`clientName\` VARCHAR(255) NOT NULL DEFAULT '',
  \`anonymisedLabel\` VARCHAR(255) NOT NULL DEFAULT '',
  \`altText\` VARCHAR(500) NOT NULL DEFAULT '',
  \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
  \`permission\` VARCHAR(191) NOT NULL DEFAULT 'pending',
  \`isActive\` BOOLEAN NOT NULL DEFAULT false,
  \`adminNotes\` TEXT NOT NULL,
  \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`CmsClientLogo_permission_idx\` (\`permission\`),
  INDEX \`CmsClientLogo_isActive_idx\` (\`isActive\`),
  INDEX \`CmsClientLogo_sortOrder_idx\` (\`sortOrder\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

/** CMS tables are defined in Prisma schema. Contact, Case Study, and Client Logo records also self-heal if migrate has not run yet. */
export async function ensureCmsSchema() {
  try {
    await prisma().$executeRawUnsafe(CONTACT_TABLE);
  } catch {
    // Database may be unavailable during build.
  }
  try {
    await prisma().$executeRawUnsafe(CASE_STUDY_TABLE);
  } catch {
    // Database may be unavailable during build.
  }
  try {
    await prisma().$executeRawUnsafe(CLIENT_LOGO_TABLE);
  } catch {
    // Database may be unavailable during build.
  }
}
