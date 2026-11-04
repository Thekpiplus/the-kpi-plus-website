import { prisma } from "@/lib/crm/db";

async function addColumn(table: string, name: string, definition: string) {
  try {
    await prisma().$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
  } catch {
    /* already present */
  }
}

let ensured: Promise<void> | null = null;

/**
 * Creates the Hotel Marketing Editorial Operations tables (idempotent). No rows are seeded:
 * the board starts empty and is populated by manual create / update only.
 */
export function ensureHotelMarketingOpsSchema() {
  if (!ensured) {
    ensured = createTables().catch((error) => {
      ensured = null;
      throw error;
    });
  }
  return ensured;
}

async function createTables() {
  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelMarketingOpsRecord (
      id VARCHAR(191) NOT NULL,
      kind VARCHAR(32) NOT NULL DEFAULT 'article',
      title VARCHAR(255) NOT NULL DEFAULT '',
      category VARCHAR(191) NOT NULL DEFAULT '',
      department VARCHAR(64) NOT NULL DEFAULT 'marketing_content',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      authorId VARCHAR(191) NOT NULL DEFAULT '',
      reviewerId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      channel VARCHAR(191) NOT NULL DEFAULT '',
      publishAt DATETIME NULL,
      lastReviewAt DATETIME NULL,
      nextAction VARCHAR(500) NOT NULL DEFAULT '',
      nextActionOwnerId VARCHAR(191) NOT NULL DEFAULT '',
      dueAt DATETIME NULL,
      archived BOOLEAN NOT NULL DEFAULT false,
      payloadJson LONGTEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelMarketingOpsRecord_kind_idx (kind),
      INDEX HotelMarketingOpsRecord_status_idx (status),
      INDEX HotelMarketingOpsRecord_department_idx (department),
      INDEX HotelMarketingOpsRecord_owner_idx (ownerId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelMarketingOpsAccess (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      department VARCHAR(64) NOT NULL,
      canApprove BOOLEAN NOT NULL DEFAULT false,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelMarketingOpsAccess_userId_idx (userId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelMarketingOpsSettings (
      id VARCHAR(191) NOT NULL,
      extraDepartmentsJson LONGTEXT NULL,
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelMarketingOpsAudit (
      id VARCHAR(191) NOT NULL,
      recordId VARCHAR(191) NOT NULL,
      action VARCHAR(191) NOT NULL DEFAULT '',
      detail TEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelMarketingOpsAudit_recordId_idx (recordId),
      INDEX HotelMarketingOpsAudit_createdAt_idx (createdAt)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelMarketingOpsSubtask (
      id VARCHAR(191) NOT NULL,
      recordId VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(64) NOT NULL DEFAULT 'marketing_content',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      reviewerId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'not_started',
      completed BOOLEAN NOT NULL DEFAULT false,
      dueAt DATETIME NULL,
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      comments TEXT NULL,
      evidence VARCHAR(500) NOT NULL DEFAULT '',
      gateKind VARCHAR(32) NOT NULL DEFAULT 'none',
      sortOrder INT NOT NULL DEFAULT 0,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelMarketingOpsSubtask_recordId_idx (recordId),
      INDEX HotelMarketingOpsSubtask_department_idx (department)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS HotelMarketingOpsSubtaskComment (
      id VARCHAR(191) NOT NULL,
      subtaskId VARCHAR(191) NOT NULL,
      authorId VARCHAR(191) NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX HotelMarketingOpsSubtaskComment_subtaskId_idx (subtaskId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  /* forward-compatible additions (no-ops on a fresh install) */
  await addColumn("HotelMarketingOpsAccess", "canApprove", "BOOLEAN NOT NULL DEFAULT false");
  await addColumn("HotelMarketingOpsSubtask", "reviewerId", "VARCHAR(191) NOT NULL DEFAULT ''");
  await addColumn("HotelMarketingOpsSubtask", "gateKind", "VARCHAR(32) NOT NULL DEFAULT 'none'");
}
