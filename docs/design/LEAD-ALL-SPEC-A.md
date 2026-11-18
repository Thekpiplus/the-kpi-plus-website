# LEAD-ALL-SPEC-A — Lead Management · ลีดทั้งหมด «แบบ A»

สเปคจอ `/crm/leads` — เปลี่ยนเฉพาะชั้น UI  
คง route · ฟิลด์ · การกรอง · สิทธิ์ · ห้ามแก้ schema / API contract

## กติกาหลัก

- ตาราง ≤ 7 คอลัมน์ · ไม่มี select ย้ายขั้น/มอบหมายในแถวหลัก
- การกระทำอยู่ในแผง inline ใต้แถว · ห้าม modal / alert / confirm / toast
- เมนูย่อย Lead = ชั้นเดียวจาก `CrmShell` (ห้ามแท็บซ้ำในหน้า)
- มูลค่า 0 หรือ null = «ยังไม่ประเมิน»
- เก็บ = archive คืนค่าได้ · ลบออกจากรายการหลัก = ยืนยันซ้ำในบรรทัด (ระบบเก็บ ไม่ hard-delete)

## โครงสร้างจอ

1. Hero จาก `LeadsPageChrome` — breadcrumb · H1 · วันที่+จำนวนใช้งาน · เพิ่มลีดใหม่ · ดู Pipeline
2. Inline notice (`aria-live`) หลังย้ายขั้น / มอบหมาย / เก็บ / แก้ไข
3. KPI 4 ใบคลิกกรอง: เกินกำหนด · ถึงกำหนดวันนี้ · รอตอบกลับ · ลีดใหม่
4. การ์ดรายการ: ค้นหาทันที · chip ใช้งานอยู่/เก็บแล้ว/ทั้งหมด · กรองแหล่ง/ขั้น/ผู้ดูแล · เรียง · ล้างตัวกรอง · แสดง X จาก Y · bulk bar
5. Desktop table-fixed: เลือก | ผู้ติดต่อ·โรงแรม | ลำดับขั้น | มูลค่า | ผู้ดูแล | กำหนดติดต่อ | จัดการ (เลื่อนขั้น + ขยาย)
6. แผง inline: รายละเอียด + ย้ายขั้น/มอบหมาย/แก้ไขสั้น · บันทึกผล · เก็บ/คืนค่า · ยืนยันลบซ้ำ
7. `<1024px`: การ์ด stacked · แผงใต้การ์ด

## ไฟล์

- `web/app/crm/leads/page.tsx` — query จริง → serialize
- `web/components/crm/leads/LeadAllWorkspace.tsx` — UI client
- `web/components/crm/leads/lead-all-types.ts` · `lead-all-a.css`
- `web/lib/crm/actions.ts` — `setLeadArchiveQuiet` (ไม่มี redirect)

อ้างอิงโทเคน: Design Spec A / `leads-a.css`
