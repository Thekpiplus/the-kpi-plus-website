import { prisma } from "@/lib/crm/db";

const PROPERTY_COLUMNS: Array<[string, string]> = [
  ["createdBy", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["updatedBy", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["businessName", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["gbpUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["searchMarket", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["language", "VARCHAR(64) NOT NULL DEFAULT ''"],
  ["location", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["primaryCategory", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["secondaryCategories", "TEXT NULL"],
  ["nextActionAt", "DATETIME NULL"],
  ["auditAt", "DATETIME NULL"],
  ["gscPropertyRef", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["googleAccountRef", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["contactPath", "TEXT NULL"],
  ["bookingUrl", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["reviewWorkflow", "TEXT NULL"],
  ["gbpName", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["gbpCategory", "VARCHAR(191) NOT NULL DEFAULT ''"],
  ["gbpAddress", "TEXT NULL"],
  ["gbpHours", "TEXT NULL"],
  ["gbpPhone", "VARCHAR(64) NOT NULL DEFAULT ''"],
  ["gbpWebsite", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["gbpPhotos", "TEXT NULL"],
  ["gbpServices", "TEXT NULL"],
  ["gbpReviewWorkflow", "TEXT NULL"],
  ["gbpContactLink", "VARCHAR(500) NOT NULL DEFAULT ''"],
  ["gbpApproval", "VARCHAR(32) NOT NULL DEFAULT 'not_requested'"],
  ["escalatedAt", "DATETIME NULL"],
  ["closedAt", "DATETIME NULL"],
];

async function addColumn(table: string, name: string, definition: string) {
  try {
    await prisma().$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
  } catch {
    /* already present */
  }
}

export async function ensureSeoSchema() {
  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoProperty (
      id VARCHAR(191) NOT NULL,
      hotelName VARCHAR(191) NOT NULL,
      workstream VARCHAR(32) NOT NULL DEFAULT 'visibility',
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      department VARCHAR(32) NOT NULL DEFAULT 'marketing',
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      website VARCHAR(500) NOT NULL DEFAULT '',
      mapsUrl VARCHAR(500) NOT NULL DEFAULT '',
      nextAction VARCHAR(500) NOT NULL DEFAULT '',
      notes TEXT NULL,
      ownerId VARCHAR(191) NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SeoProperty_status_idx (status),
      INDEX SeoProperty_workstream_idx (workstream),
      INDEX SeoProperty_department_idx (department)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  for (const [name, definition] of PROPERTY_COLUMNS) {
    await addColumn("SeoProperty", name, definition);
  }

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoAccess (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      department VARCHAR(32) NOT NULL,
      canSeePrivateIds BOOLEAN NOT NULL DEFAULT false,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SeoAccess_userId_idx (userId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await addColumn("SeoAccess", "canSeePrivateIds", "BOOLEAN NOT NULL DEFAULT false");

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoSource (
      id VARCHAR(191) NOT NULL,
      propertyId VARCHAR(191) NOT NULL,
      name VARCHAR(191) NOT NULL DEFAULT '',
      url VARCHAR(500) NOT NULL DEFAULT '',
      publishedAt VARCHAR(64) NOT NULL DEFAULT '',
      accessedAt VARCHAR(64) NOT NULL DEFAULT '',
      notes TEXT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SeoSource_propertyId_idx (propertyId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoAeoQuery (
      id VARCHAR(191) NOT NULL,
      propertyId VARCHAR(191) NOT NULL,
      queryText VARCHAR(500) NOT NULL DEFAULT '',
      intent VARCHAR(191) NOT NULL DEFAULT '',
      answerDraft TEXT NULL,
      source VARCHAR(500) NOT NULL DEFAULT '',
      entityInfo TEXT NULL,
      faqStatus VARCHAR(32) NOT NULL DEFAULT 'not_started',
      language VARCHAR(64) NOT NULL DEFAULT '',
      market VARCHAR(191) NOT NULL DEFAULT '',
      reviewStatus VARCHAR(32) NOT NULL DEFAULT 'not_requested',
      publishedStatus VARCHAR(32) NOT NULL DEFAULT 'not_started',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SeoAeoQuery_propertyId_idx (propertyId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoKpiEntry (
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
      INDEX SeoKpiEntry_propertyId_idx (propertyId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoAuditEvent (
      id VARCHAR(191) NOT NULL,
      propertyId VARCHAR(191) NOT NULL,
      action VARCHAR(191) NOT NULL DEFAULT '',
      detail TEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SeoAuditEvent_propertyId_idx (propertyId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoSubtask (
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
      INDEX SeoSubtask_propertyId_idx (propertyId),
      INDEX SeoSubtask_department_idx (department),
      INDEX SeoSubtask_status_idx (status)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
  await addColumn("SeoSubtask", "source", "VARCHAR(500) NOT NULL DEFAULT ''");

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoSubtaskComment (
      id VARCHAR(191) NOT NULL,
      subtaskId VARCHAR(191) NOT NULL,
      authorId VARCHAR(191) NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SeoSubtaskComment_subtaskId_idx (subtaskId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SeoSubtaskFile (
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
      INDEX SeoSubtaskFile_subtaskId_idx (subtaskId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

export const ensureSeoOpsSchema = ensureSeoSchema;
