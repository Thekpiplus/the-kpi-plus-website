import { prisma } from "@/lib/crm/db";
import { seedSolutionsDefaultsIfEmpty } from "./seed-defaults";

const TABLE_OPTS = "DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";

let ensured: Promise<void> | null = null;

async function createTables() {
  const db = prisma();

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsService (
      id VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL DEFAULT '',
      categoryId VARCHAR(191) NOT NULL DEFAULT '',
      publicDescription TEXT NULL,
      problemSolved TEXT NULL,
      suitableFor TEXT NULL,
      deliverables TEXT NULL,
      dependencies TEXT NULL,
      ownerDepartment VARCHAR(64) NOT NULL DEFAULT 'management',
      publicRoute VARCHAR(255) NOT NULL DEFAULT '',
      contentStatusTh VARCHAR(32) NOT NULL DEFAULT 'not_started',
      contentStatusEn VARCHAR(32) NOT NULL DEFAULT 'not_started',
      imagePermissionStatus VARCHAR(32) NOT NULL DEFAULT 'unreviewed',
      proofSourceRef VARCHAR(500) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      nextReviewAt DATETIME NULL,
      archived BOOLEAN NOT NULL DEFAULT false,
      payloadJson LONGTEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SolutionsService_status_idx (status),
      INDEX SolutionsService_department_idx (ownerDepartment),
      INDEX SolutionsService_category_idx (categoryId)
    ) ${TABLE_OPTS}
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsCategory (
      id VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT NULL,
      ownerDepartment VARCHAR(64) NOT NULL DEFAULT 'management',
      sortOrder INT NOT NULL DEFAULT 0,
      status VARCHAR(32) NOT NULL DEFAULT 'active',
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id)
    ) ${TABLE_OPTS}
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsRelationship (
      id VARCHAR(191) NOT NULL,
      fromServiceId VARCHAR(191) NOT NULL,
      toServiceId VARCHAR(191) NOT NULL,
      kind VARCHAR(32) NOT NULL DEFAULT 'pairs_with',
      notes TEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SolutionsRelationship_from_idx (fromServiceId),
      INDEX SolutionsRelationship_to_idx (toServiceId)
    ) ${TABLE_OPTS}
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsOpsAccess (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      department VARCHAR(64) NOT NULL,
      canSeeContacts BOOLEAN NOT NULL DEFAULT false,
      canApprove BOOLEAN NOT NULL DEFAULT false,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SolutionsOpsAccess_userId_idx (userId)
    ) ${TABLE_OPTS}
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsOpsSettings (
      id VARCHAR(191) NOT NULL,
      settingsJson LONGTEXT NULL,
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id)
    ) ${TABLE_OPTS}
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsOpsAudit (
      id VARCHAR(191) NOT NULL,
      entityType VARCHAR(32) NOT NULL DEFAULT 'service',
      entityId VARCHAR(191) NOT NULL DEFAULT '',
      action VARCHAR(64) NOT NULL DEFAULT '',
      detail TEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SolutionsOpsAudit_entity_idx (entityType, entityId),
      INDEX SolutionsOpsAudit_created_idx (createdAt)
    ) ${TABLE_OPTS}
  `);

  /** Overlay on the existing Lead table — never stores guest data or credentials. */
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsInquiryNote (
      id VARCHAR(191) NOT NULL,
      leadId VARCHAR(191) NOT NULL,
      needCategory VARCHAR(191) NOT NULL DEFAULT '',
      selectedServices VARCHAR(500) NOT NULL DEFAULT '',
      contactPreference VARCHAR(32) NOT NULL DEFAULT '',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'new',
      nextActionAt DATETIME NULL,
      consentStatus VARCHAR(32) NOT NULL DEFAULT 'unknown',
      notes TEXT NULL,
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE INDEX SolutionsInquiryNote_leadId_uq (leadId)
    ) ${TABLE_OPTS}
  `);

  /** Cross-department subtasks for a service (parentType = 'service') or an inquiry (parentType = 'inquiry', parentId = leadId). */
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsOpsSubtask (
      id VARCHAR(191) NOT NULL,
      parentType VARCHAR(16) NOT NULL DEFAULT 'service',
      parentId VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL DEFAULT '',
      department VARCHAR(64) NOT NULL DEFAULT 'management',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      reviewerId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'not_started',
      completed BOOLEAN NOT NULL DEFAULT false,
      dueAt DATETIME NULL,
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      comments TEXT NULL,
      evidence TEXT NULL,
      gateKind VARCHAR(32) NOT NULL DEFAULT 'none',
      sortOrder INT NOT NULL DEFAULT 0,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SolutionsOpsSubtask_parent_idx (parentType, parentId),
      INDEX SolutionsOpsSubtask_owner_idx (ownerId),
      INDEX SolutionsOpsSubtask_department_idx (department)
    ) ${TABLE_OPTS}
  `);

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SolutionsOpsSubtaskComment (
      id VARCHAR(191) NOT NULL,
      subtaskId VARCHAR(191) NOT NULL,
      authorId VARCHAR(191) NOT NULL DEFAULT '',
      body TEXT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX SolutionsOpsSubtaskComment_subtask_idx (subtaskId)
    ) ${TABLE_OPTS}
  `);
}

/** Creates tables (idempotent) and seeds default categories/services once when empty. */
export function ensureSolutionsOpsSchema() {
  if (!ensured) {
    ensured = (async () => {
      await createTables();
      await seedSolutionsDefaultsIfEmpty().catch(() => undefined);
    })().catch((error) => {
      ensured = null;
      throw error;
    });
  }
  return ensured;
}
