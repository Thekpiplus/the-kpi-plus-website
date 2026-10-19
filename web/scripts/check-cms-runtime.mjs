import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const docs = await prisma.cmsDocument.findMany({
  select: { id: true, kind: true, slug: true, status: true, title: true, body: true },
  orderBy: { updatedAt: "desc" },
});
for (const doc of docs) {
  let parseOk = false;
  try {
    parseOk = Array.isArray(JSON.parse(doc.body));
  } catch {
    parseOk = false;
  }
  console.log({
    kind: doc.kind,
    slug: doc.slug || "(home)",
    status: doc.status,
    bodyLen: doc.body.length,
    parseOk,
    title: doc.title.slice(0, 40),
  });
}
await prisma.$disconnect();
