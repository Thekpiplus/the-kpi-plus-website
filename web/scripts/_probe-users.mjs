import "dotenv/config";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const root = resolve(import.meta.dirname, "..");
const sqlite = new Database(resolve(root, "prisma", "dev.db"), { readonly: true });
const prisma = new PrismaClient();

const users = sqlite
  .prepare(
    "SELECT id, phone, email, username, name, role, modules, failedAttempts, lockedUntil, createdAt, length(pinHash) as pinHashLen, length(pinSalt) as pinSaltLen FROM User",
  )
  .all();
const partners = sqlite.prepare("SELECT * FROM Partner").all();
console.log("=== SQLITE USERS ===");
console.log(JSON.stringify(users, null, 2));
console.log("=== SQLITE PARTNERS ===");
console.log(JSON.stringify(partners, null, 2));

const mysqlUsers = await prisma.user.findMany({
  select: { id: true, phone: true, email: true, username: true, name: true, role: true, modules: true },
});
const mysqlPartners = await prisma.partner.findMany({
  select: { id: true, userId: true, email: true, displayName: true, type: true, status: true },
});
console.log("=== MYSQL USERS ===");
console.log(JSON.stringify(mysqlUsers, null, 2));
console.log("=== MYSQL PARTNERS ===");
console.log(JSON.stringify(mysqlPartners, null, 2));

sqlite.close();
await prisma.$disconnect();
