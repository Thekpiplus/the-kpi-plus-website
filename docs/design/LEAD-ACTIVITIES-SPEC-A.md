# LEAD-ACTIVITIES-SPEC-A — กิจกรรมที่ต้องทำ «แบบ A + monday.com»

สเปคจอ `/crm/activities` (+ `status` · `day` · `kind` · `q`) — ชั้น UI เป็นหลัก  
ใช้ `completeActivity` / `scheduleActivity` ที่มีอยู่ · ไม่แตะ schema

## นิยาม

- **งานเปิด** = `activity.status === "open"` และลีดยังไม่เก็บ
- สถานะกรอง: `open` · `overdue` · `today` · `upcoming`
- แถบวัน: `overdue` · offset `0…6` · `anytime` · `all` (ทุกวัน)
- ประเภท (chip): ทุกประเภท · โทร · LINE · อีเมล · นัดเยี่ยมชม · ใบเสนอราคา · ทำสัญญา  
  แมปจาก `Activity.type`: call / line / email / meeting / proposal / task
- `dueAt` ใน schema เป็น required → ช่อง «ไม่มีกำหนด» ว่างจนกว่า backend จะรองรับ null
- ฟอร์ม «บันทึกผล» เปิดได้ทีละ 1 ใบ · stripe สี = ประเภท · badge สี = กำหนด
- ห้าม modal / alert / confirm / toast-lib · ≤2 ปุ่ม brand บน hero
- URL เป็น SSOT ของตัวกรอง

## เลย์เอาต์

1. Hero ไล่สีพาสเทล + breadcrumb + H1 + คำอธิบาย + meta computed + เพิ่มลีดใหม่ / ดู Pipeline  
2. สรุป 4 การ์ด · แถบวัน 9 ช่อง · chips ประเภท + ค้นหา  
3. กริดการ์ดงาน 2 คอลัมน์ (จอใหญ่) · section «เสร็จแล้ววันนี้»  
4. Footer ระบุขอบเขตข้อมูล

อ้างอิงโทเคน: Design Spec A / `leads-a.css` / `activities-a.css`
