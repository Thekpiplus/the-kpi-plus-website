import { prisma } from "@/lib/crm/db";

const OPERATION_TABLE = `
CREATE TABLE IF NOT EXISTS \`ReservationOperation\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`reference\` VARCHAR(32) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`type\` VARCHAR(191) NOT NULL,
  \`channel\` VARCHAR(191) NOT NULL,
  \`status\` VARCHAR(191) NOT NULL DEFAULT 'new',
  \`priority\` VARCHAR(191) NOT NULL DEFAULT 'normal',
  \`assigneeId\` VARCHAR(191) NOT NULL DEFAULT '',
  \`dueAt\` DATETIME(3) NULL,
  \`hotelName\` VARCHAR(255) NOT NULL DEFAULT '',
  \`guestName\` VARCHAR(255) NOT NULL DEFAULT '',
  \`guestEmail\` VARCHAR(255) NOT NULL DEFAULT '',
  \`guestPhone\` VARCHAR(64) NOT NULL DEFAULT '',
  \`bookingCode\` VARCHAR(64) NOT NULL DEFAULT '',
  \`notes\` TEXT NOT NULL,
  \`closedAt\` DATETIME(3) NULL,
  \`escalatedAt\` DATETIME(3) NULL,
  \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
  \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`ReservationOperation_reference_key\` (\`reference\`),
  INDEX \`ReservationOperation_status_idx\` (\`status\`),
  INDEX \`ReservationOperation_type_idx\` (\`type\`),
  INDEX \`ReservationOperation_channel_idx\` (\`channel\`),
  INDEX \`ReservationOperation_assigneeId_idx\` (\`assigneeId\`),
  INDEX \`ReservationOperation_dueAt_idx\` (\`dueAt\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

const SUBTASK_TABLE = `
CREATE TABLE IF NOT EXISTS \`ReservationSubtask\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`operationId\` VARCHAR(191) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`status\` VARCHAR(191) NOT NULL DEFAULT 'open',
  \`completed\` BOOLEAN NOT NULL DEFAULT false,
  \`dueAt\` DATETIME(3) NULL,
  \`assigneeId\` VARCHAR(191) NOT NULL DEFAULT '',
  \`priority\` VARCHAR(191) NOT NULL DEFAULT 'normal',
  \`comments\` TEXT NOT NULL,
  \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  \`updatedAt\` DATETIME(3) NOT NULL,
  PRIMARY KEY (\`id\`),
  INDEX \`ReservationSubtask_operationId_idx\` (\`operationId\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

const COMMENT_TABLE = `
CREATE TABLE IF NOT EXISTS \`ReservationOpComment\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`operationId\` VARCHAR(191) NOT NULL,
  \`authorId\` VARCHAR(191) NOT NULL,
  \`body\` TEXT NOT NULL,
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (\`id\`),
  INDEX \`ReservationOpComment_operationId_idx\` (\`operationId\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

const ATTACHMENT_TABLE = `
CREATE TABLE IF NOT EXISTS \`ReservationOpAttachment\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`operationId\` VARCHAR(191) NOT NULL,
  \`filename\` VARCHAR(191) NOT NULL,
  \`mime\` VARCHAR(191) NOT NULL,
  \`size\` INTEGER NOT NULL,
  \`path\` VARCHAR(500) NOT NULL,
  \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
  \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (\`id\`),
  INDEX \`ReservationOpAttachment_operationId_idx\` (\`operationId\`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
`;

async function addForeignKey(sql: string) {
  try {
    await prisma().$executeRawUnsafe(sql);
  } catch {
    // Constraint may already exist.
  }
}

export async function ensureReservationOpsSchema() {
  try {
    await prisma().$executeRawUnsafe(OPERATION_TABLE);
    await prisma().$executeRawUnsafe(SUBTASK_TABLE);
    await prisma().$executeRawUnsafe(COMMENT_TABLE);
    await prisma().$executeRawUnsafe(ATTACHMENT_TABLE);
    await addForeignKey(
      "ALTER TABLE `ReservationSubtask` ADD CONSTRAINT `ReservationSubtask_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `ReservationOperation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addForeignKey(
      "ALTER TABLE `ReservationOpComment` ADD CONSTRAINT `ReservationOpComment_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `ReservationOperation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addForeignKey(
      "ALTER TABLE `ReservationOpAttachment` ADD CONSTRAINT `ReservationOpAttachment_operationId_fkey` FOREIGN KEY (`operationId`) REFERENCES `ReservationOperation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
  } catch {
    // Database may be unavailable during build.
  }
}
