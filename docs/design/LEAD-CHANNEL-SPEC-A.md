# LEAD-CHANNEL-SPEC-A — แยกตามช่องทาง / ลีดจากเว็บไซต์ «แบบ A»

สเปคจอ `/crm/leads?view=channel` (+ `source=`) — ชั้น UI เท่านั้น  
คง route · ฟิลด์ · สิทธิ์ · ใช้ตารางจาก `LEAD-ALL-SPEC-A`

## กติกา

- Nav ชั้นเดียว · แท็บ «แยกตามช่องทาง» active เมื่อ `view=channel` (รองรับ `origin=web` เดิม)
- URL เป็น SSOT: `?view=channel&source=<key>` · ทุกช่องทาง = ไม่มี `source`
- H1 = `ลีดจาก{ช่องทาง}` · อักษรละตินมีเว้นวรรคหลัง «จาก»
- แท่งสัดส่วน + การ์ด/chip คลิกกรอง · ปุ่ม «ทุกช่องทาง»
- ตารางล็อกช่องทาง: pill แหล่งที่มา (ไม่ใช่ input) · นับ chip ตามช่องทาง · บรรทัด 3 = ขอบเขตงาน
- ห้าม modal / alert / confirm / toast

อ้างอิงโทเคน: Design Spec A / `leads-a.css` / `lead-all-a.css`
