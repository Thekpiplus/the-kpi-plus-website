import { prisma } from "@/lib/crm/db";

async function addColumn(table: string, name: string, definition: string) {
  try {
    await prisma().$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${name}\` ${definition}`);
  } catch {
    /* already present */
  }
}

export async function ensureTrainingOpsSchema() {
  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TrainingOpsRecord (
      id VARCHAR(191) NOT NULL,
      kind VARCHAR(32) NOT NULL DEFAULT 'request',
      title VARCHAR(255) NOT NULL DEFAULT '',
      hotelName VARCHAR(191) NOT NULL DEFAULT '',
      department VARCHAR(64) NOT NULL DEFAULT 'hr_ld',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      approverId VARCHAR(191) NOT NULL DEFAULT '',
      trainerId VARCHAR(191) NOT NULL DEFAULT '',
      programId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      eventAt DATETIME NULL,
      notes TEXT NULL,
      archived BOOLEAN NOT NULL DEFAULT false,
      payloadJson LONGTEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX TrainingOpsRecord_kind_idx (kind),
      INDEX TrainingOpsRecord_status_idx (status),
      INDEX TrainingOpsRecord_department_idx (department),
      INDEX TrainingOpsRecord_owner_idx (ownerId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TrainingOpsAccess (
      id VARCHAR(191) NOT NULL,
      userId VARCHAR(191) NOT NULL,
      department VARCHAR(64) NOT NULL,
      canSeeParticipants BOOLEAN NOT NULL DEFAULT false,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX TrainingOpsAccess_userId_idx (userId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TrainingOpsSettings (
      id VARCHAR(191) NOT NULL,
      extraDepartmentsJson LONGTEXT NULL,
      updatedBy VARCHAR(191) NOT NULL DEFAULT '',
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TrainingOpsAudit (
      id VARCHAR(191) NOT NULL,
      recordId VARCHAR(191) NOT NULL,
      action VARCHAR(191) NOT NULL DEFAULT '',
      detail TEXT NULL,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX TrainingOpsAudit_recordId_idx (recordId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TrainingOpsSubtask (
      id VARCHAR(191) NOT NULL,
      recordId VARCHAR(191) NOT NULL,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(64) NOT NULL DEFAULT 'hr_ld',
      ownerId VARCHAR(191) NOT NULL DEFAULT '',
      status VARCHAR(32) NOT NULL DEFAULT 'not_started',
      completed BOOLEAN NOT NULL DEFAULT false,
      dueAt DATETIME NULL,
      priority VARCHAR(16) NOT NULL DEFAULT 'normal',
      comments TEXT NULL,
      evidence VARCHAR(500) NOT NULL DEFAULT '',
      reviewerId VARCHAR(191) NOT NULL DEFAULT '',
      gateKind VARCHAR(32) NOT NULL DEFAULT 'none',
      sortOrder INT NOT NULL DEFAULT 0,
      createdBy VARCHAR(191) NOT NULL DEFAULT '',
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX TrainingOpsSubtask_recordId_idx (recordId),
      INDEX TrainingOpsSubtask_department_idx (department)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await prisma().$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TrainingOpsSubtaskComment (
      id VARCHAR(191) NOT NULL,
      subtaskId VARCHAR(191) NOT NULL,
      authorId VARCHAR(191) NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX TrainingOpsSubtaskComment_subtaskId_idx (subtaskId)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);

  await addColumn("TrainingOpsRecord", "approverId", "VARCHAR(191) NOT NULL DEFAULT ''");
  await addColumn("TrainingOpsRecord", "trainerId", "VARCHAR(191) NOT NULL DEFAULT ''");
  await addColumn("TrainingOpsRecord", "programId", "VARCHAR(191) NOT NULL DEFAULT ''");
  await addColumn("TrainingOpsSubtask", "reviewerId", "VARCHAR(191) NOT NULL DEFAULT ''");
  await addColumn("TrainingOpsSubtask", "gateKind", "VARCHAR(32) NOT NULL DEFAULT 'none'");
}
