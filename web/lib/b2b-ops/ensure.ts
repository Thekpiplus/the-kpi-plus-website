import { prisma } from "@/lib/crm/db";

const TABLES = [
  `CREATE TABLE IF NOT EXISTS \`B2bPartner\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`type\` VARCHAR(191) NOT NULL,
    \`market\` VARCHAR(255) NOT NULL DEFAULT '',
    \`contactPerson\` VARCHAR(255) NOT NULL DEFAULT '',
    \`contactChannel\` VARCHAR(255) NOT NULL DEFAULT '',
    \`ownerId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`department\` VARCHAR(191) NOT NULL DEFAULT 'sales',
    \`priority\` VARCHAR(191) NOT NULL DEFAULT 'normal',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'new_lead',
    \`nextAction\` VARCHAR(500) NOT NULL DEFAULT '',
    \`nextActionAt\` DATETIME(3) NULL,
    \`lastContactAt\` DATETIME(3) NULL,
    \`notes\` TEXT NOT NULL,
    \`hotels\` TEXT NOT NULL,
    \`rateApproval\` VARCHAR(191) NOT NULL DEFAULT 'draft',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`B2bPartner_status_idx\` (\`status\`),
    INDEX \`B2bPartner_ownerId_idx\` (\`ownerId\`),
    INDEX \`B2bPartner_department_idx\` (\`department\`),
    INDEX \`B2bPartner_market_idx\` (\`market\`),
    INDEX \`B2bPartner_nextActionAt_idx\` (\`nextActionAt\`),
    INDEX \`B2bPartner_priority_idx\` (\`priority\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bContact\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`partnerId\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`role\` VARCHAR(255) NOT NULL DEFAULT '',
    \`email\` VARCHAR(255) NOT NULL DEFAULT '',
    \`phone\` VARCHAR(64) NOT NULL DEFAULT '',
    \`channel\` VARCHAR(64) NOT NULL DEFAULT '',
    \`isPrimary\` BOOLEAN NOT NULL DEFAULT false,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`B2bContact_partnerId_idx\` (\`partnerId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bCommercialTerm\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`partnerId\` VARCHAR(191) NOT NULL,
    \`hotelName\` VARCHAR(255) NOT NULL DEFAULT '',
    \`ratePlan\` VARCHAR(255) NOT NULL DEFAULT '',
    \`commissionText\` TEXT NOT NULL,
    \`availability\` VARCHAR(255) NOT NULL DEFAULT '',
    \`channel\` VARCHAR(255) NOT NULL DEFAULT '',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'draft',
    \`notes\` TEXT NOT NULL,
    \`approvedBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`approvedAt\` DATETIME(3) NULL,
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`B2bCommercialTerm_partnerId_idx\` (\`partnerId\`),
    INDEX \`B2bCommercialTerm_status_idx\` (\`status\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bActivity\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`partnerId\` VARCHAR(191) NOT NULL,
    \`type\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`hotelName\` VARCHAR(255) NOT NULL DEFAULT '',
    \`dueAt\` DATETIME(3) NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'planned',
    \`notes\` TEXT NOT NULL,
    \`ownerId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`completedAt\` DATETIME(3) NULL,
    \`closedAt\` DATETIME(3) NULL,
    \`escalatedAt\` DATETIME(3) NULL,
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`B2bActivity_partnerId_idx\` (\`partnerId\`),
    INDEX \`B2bActivity_dueAt_idx\` (\`dueAt\`),
    INDEX \`B2bActivity_status_idx\` (\`status\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bActivitySubtask\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`activityId\` VARCHAR(191) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'planned',
    \`completed\` BOOLEAN NOT NULL DEFAULT false,
    \`dueAt\` DATETIME(3) NULL,
    \`assigneeId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`priority\` VARCHAR(191) NOT NULL DEFAULT 'normal',
    \`comments\` TEXT NOT NULL,
    \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`B2bActivitySubtask_activityId_idx\` (\`activityId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bActivityComment\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`activityId\` VARCHAR(191) NOT NULL,
    \`authorId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`body\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`B2bActivityComment_activityId_idx\` (\`activityId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bActivityFile\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`activityId\` VARCHAR(191) NOT NULL,
    \`filename\` VARCHAR(191) NOT NULL,
    \`mime\` VARCHAR(191) NOT NULL,
    \`size\` INTEGER NOT NULL,
    \`path\` VARCHAR(500) NOT NULL,
    \`caption\` VARCHAR(500) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`B2bActivityFile_activityId_idx\` (\`activityId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bBooking\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`partnerId\` VARCHAR(191) NOT NULL,
    \`hotelName\` VARCHAR(255) NOT NULL DEFAULT '',
    \`period\` VARCHAR(255) NOT NULL DEFAULT '',
    \`roomNights\` VARCHAR(64) NOT NULL DEFAULT '',
    \`revenueText\` VARCHAR(255) NOT NULL DEFAULT '',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'draft',
    \`dataStatus\` VARCHAR(191) NOT NULL DEFAULT 'internal',
    \`notes\` TEXT NOT NULL,
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`B2bBooking_partnerId_idx\` (\`partnerId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bFile\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`partnerId\` VARCHAR(191) NOT NULL,
    \`kind\` VARCHAR(191) NOT NULL DEFAULT 'file',
    \`filename\` VARCHAR(191) NOT NULL,
    \`mime\` VARCHAR(191) NOT NULL,
    \`size\` INTEGER NOT NULL,
    \`path\` VARCHAR(500) NOT NULL,
    \`caption\` VARCHAR(500) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`B2bFile_partnerId_idx\` (\`partnerId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bNote\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`partnerId\` VARCHAR(191) NOT NULL,
    \`kind\` VARCHAR(191) NOT NULL DEFAULT 'general',
    \`body\` TEXT NOT NULL,
    \`authorId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`B2bNote_partnerId_idx\` (\`partnerId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bAudit\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`partnerId\` VARCHAR(191) NOT NULL,
    \`actorId\` VARCHAR(191) NOT NULL DEFAULT '',
    \`action\` VARCHAR(191) NOT NULL,
    \`detail\` TEXT NOT NULL,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (\`id\`),
    INDEX \`B2bAudit_partnerId_idx\` (\`partnerId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bMaterial\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`kind\` VARCHAR(191) NOT NULL DEFAULT 'kit',
    \`status\` VARCHAR(191) NOT NULL DEFAULT 'draft',
    \`notes\` TEXT NOT NULL,
    \`filename\` VARCHAR(191) NOT NULL DEFAULT '',
    \`mime\` VARCHAR(191) NOT NULL DEFAULT '',
    \`size\` INTEGER NOT NULL DEFAULT 0,
    \`path\` VARCHAR(500) NOT NULL DEFAULT '',
    \`createdBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`updatedBy\` VARCHAR(191) NOT NULL DEFAULT '',
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    INDEX \`B2bMaterial_status_idx\` (\`status\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS \`B2bAccess\` (
    \`id\` VARCHAR(191) NOT NULL,
    \`userId\` VARCHAR(191) NOT NULL,
    \`department\` VARCHAR(191) NOT NULL,
    \`canContacts\` BOOLEAN NOT NULL DEFAULT false,
    \`canCommercial\` BOOLEAN NOT NULL DEFAULT false,
    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    \`updatedAt\` DATETIME(3) NOT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`B2bAccess_userId_department_key\` (\`userId\`, \`department\`),
    INDEX \`B2bAccess_userId_idx\` (\`userId\`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
];

async function addSql(sql: string) {
  try {
    await prisma().$executeRawUnsafe(sql);
  } catch {
    // Column or constraint may already exist.
  }
}

export async function ensureB2bOpsSchema() {
  try {
    for (const sql of TABLES) {
      await prisma().$executeRawUnsafe(sql);
    }
    await addSql("ALTER TABLE `B2bActivity` ADD COLUMN `hotelName` VARCHAR(255) NOT NULL DEFAULT ''");
    await addSql("ALTER TABLE `B2bActivity` ADD COLUMN `closedAt` DATETIME(3) NULL");
    await addSql("ALTER TABLE `B2bActivity` ADD COLUMN `escalatedAt` DATETIME(3) NULL");
    await addSql("UPDATE `B2bActivity` SET `status` = 'planned' WHERE `status` = 'open'");
    await addSql("UPDATE `B2bActivity` SET `status` = 'completed' WHERE `status` = 'done'");
    await addSql("UPDATE `B2bActivity` SET `type` = 'follow_up' WHERE `type` = 'note'");
    await addSql("UPDATE `B2bActivity` SET `type` = 'booking_review' WHERE `type` = 'review'");
    await addSql(
      "ALTER TABLE `B2bContact` ADD CONSTRAINT `B2bContact_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `B2bPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bCommercialTerm` ADD CONSTRAINT `B2bCommercialTerm_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `B2bPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bActivity` ADD CONSTRAINT `B2bActivity_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `B2bPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bActivitySubtask` ADD CONSTRAINT `B2bActivitySubtask_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `B2bActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bActivityComment` ADD CONSTRAINT `B2bActivityComment_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `B2bActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bActivityFile` ADD CONSTRAINT `B2bActivityFile_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `B2bActivity`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bBooking` ADD CONSTRAINT `B2bBooking_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `B2bPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bFile` ADD CONSTRAINT `B2bFile_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `B2bPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bNote` ADD CONSTRAINT `B2bNote_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `B2bPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
    await addSql(
      "ALTER TABLE `B2bAudit` ADD CONSTRAINT `B2bAudit_partnerId_fkey` FOREIGN KEY (`partnerId`) REFERENCES `B2bPartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE",
    );
  } catch {
    // Database may be unavailable during build.
  }
}
