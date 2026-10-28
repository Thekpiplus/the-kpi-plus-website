import { prisma } from "@/lib/crm/db";

const PROJECT_COLUMNS: Array<[string, string]> = [
  ["createdBy", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["updatedBy", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["projectName", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["currentUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["bookingEngine", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["bookingEngineUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["cmsType", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["projectType", "VARCHAR(64) NOT NULL DEFAULT 'improve_existing'"],
  ["primaryGoal", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["targetMarket", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["languages", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["startDate", "DATETIME NULL"],
  ["launchDate", "DATETIME NULL"],
  ["mobileReady", "VARCHAR(64) NOT NULL DEFAULT ''"],
  ["improveOrRebuild", "VARCHAR(64) NOT NULL DEFAULT ''"],
  ["nextActionAt", "DATETIME NULL"],
  ["budgetStatus", "VARCHAR(32) NOT NULL DEFAULT 'not_set'"],
  ["trackingStatus", "VARCHAR(32) NOT NULL DEFAULT 'not_started'"],
  ["analyticsStatus", "VARCHAR(32) NOT NULL DEFAULT 'not_started'"],
  ["engineTrackingStatus", "VARCHAR(32) NOT NULL DEFAULT 'not_started'"],
  ["primaryKpi", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["kpiTarget", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["hotelApprover", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["seoStatus", "VARCHAR(32) NOT NULL DEFAULT 'not_started'"],
  ["mobileStatus", "VARCHAR(32) NOT NULL DEFAULT 'not_started'"],
  ["handoverStatus", "VARCHAR(32) NOT NULL DEFAULT 'not_started'"],
  ["engineAccountRef", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["analyticsRef", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["cmsOwner", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["sourceCodeOwner", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["domainOwner", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["hostingOwner", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["analyticsOwner", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["bookingEngineOwner", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["discoveryJson", "LONGTEXT NULL"],
  ["sitemapJson", "LONGTEXT NULL"],
  ["uxJson", "LONGTEXT NULL"],
  ["cmsJson", "LONGTEXT NULL"],
  ["bookingJson", "LONGTEXT NULL"],
  ["trackingJson", "LONGTEXT NULL"],
  ["seoJson", "LONGTEXT NULL"],
  ["qaJson", "LONGTEXT NULL"],
  ["handoverJson", "LONGTEXT NULL"],
  ["filesJson", "LONGTEXT NULL"],
  ["decisionsJson", "LONGTEXT NULL"],
  ["approvalsJson", "LONGTEXT NULL"],
  ["frictionJson", "LONGTEXT NULL"],
  ["engineJson", "LONGTEXT NULL"],
];

async function addColumn(table: string, name: string, definition: string) {
  try {
    await prisma().$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
  } catch {
    /* already present */
  }
}

export async function ensureConversionSchema() {
  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionProject (
      id VARCHAR(191) NOT NULL,
      hotelName VARCHAR(191) NOT NULL,
      workstream VARCHAR(32) NOT NULL DEFAULT 'project',
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      department VARCHAR(32) NOT NULL DEFAULT 'marketing',
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      nextAction VARCHAR(500) NOT NULL DEFAULT '',
      notes TEXT NULL,
      ownerId VARCHAR(191) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionProject_status_idx (status),
      INDEX ConversionProject_workstream_idx (workstream),
      INDEX ConversionProject_department_idx (department)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  for (const [name, definition] of PROJECT_COLUMNS) {
    await addColumn("ConversionProject", name, definition);
  }

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionAccess (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      department VARCHAR(32) NOT NULL,
      canSeePrivateIds BOOLEAN NOT NULL DEFAULT false,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionAccess_userId_idx (userId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await addColumn("ConversionAccess", "canSeePrivateIds", "BOOLEAN NOT NULL DEFAULT false");

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionSource (
      id VARCHAR(191) NOT NULL,
      propertyId VARCHAR(191) NOT NULL,
      name VARCHAR(191) NOT NULL DEFAULT '',
      url VARCHAR(500) NOT NULL DEFAULT '',
      publishedAt VARCHAR(64) NOT NULL DEFAULT '',
      accessedAt VARCHAR(64) NOT NULL DEFAULT '',
      notes TEXT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionSource_propertyId_idx (propertyId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionKpiEntry (
      id VARCHAR(191) NOT NULL,
      propertyId VARCHAR(191) NOT NULL,
      name VARCHAR(191) NOT NULL DEFAULT '',
      period VARCHAR(64) NOT NULL DEFAULT '',
      value VARCHAR(191) NOT NULL DEFAULT '',
      definition TEXT NULL,
      source VARCHAR(500) NOT NULL DEFAULT '',
      dataStatus VARCHAR(32) NOT NULL DEFAULT 'draft',
      market VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionKpiEntry_propertyId_idx (propertyId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionAuditEvent (
      id VARCHAR(191) NOT NULL,
      propertyId VARCHAR(191) NOT NULL,
      action VARCHAR(191) NOT NULL DEFAULT '',
      detail TEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionAuditEvent_propertyId_idx (propertyId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionSubtask (
      id VARCHAR(191) NOT NULL,
      propertyId VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(32) NOT NULL DEFAULT 'marketing',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'not_started',
      completed BOOLEAN NOT NULL DEFAULT false,
      dueAt DATETIME NULL,
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      comments TEXT NULL,
      source VARCHAR(500) NOT NULL DEFAULT '',
      sortOrder INT NOT NULL DEFAULT 0,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionSubtask_propertyId_idx (propertyId),
      INDEX ConversionSubtask_department_idx (department),
      INDEX ConversionSubtask_status_idx (status)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionSubtaskComment (
      id VARCHAR(191) NOT NULL,
      subtaskId VARCHAR(191) NOT NULL,
      authorId VARCHAR(191) NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionSubtaskComment_subtaskId_idx (subtaskId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ConversionSubtaskFile (
      id VARCHAR(191) NOT NULL,
      subtaskId VARCHAR(191) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      mime VARCHAR(191) NOT NULL,
      size INT NOT NULL,
      path VARCHAR(500) NOT NULL,
      caption VARCHAR(500) NOT NULL DEFAULT '',
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX ConversionSubtaskFile_subtaskId_idx (subtaskId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

export const ensureConversionOpsSchema = ensureConversionSchema;
