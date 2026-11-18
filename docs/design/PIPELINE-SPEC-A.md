# PIPELINE-SPEC-A — Pipeline / Deal Tracker «แบบ A คลีนสว่าง»

สเปคการนำเสนอหน้า Pipeline ของ The KPI PLUS  
เปลี่ยนเฉพาะชั้น UI — คง route · โมดูล · ฟิลด์ · การกรอง · สิทธิ์เดิม ห้ามแก้ backend / schema / API

อ้างอิงโทเคนร่วม: `docs/design/DESIGN-SPEC-A.md` · แท็บร่วมกับ Lead Management

## 1. Route จริง

| มุมมอง | Route |
|---|---|
| บอร์ด / ตาราง / ปฏิทิน | `/crm/pipeline` · `?view=kanban` · `?view=table` · `?view=calendar` |
| กรองขั้น | `?stageId=` |
| ค้นหา | `?q=` |
| ดีลเสี่ยง | `?risk=1` |
| เรียง | `?sort=value` · `chance` · `risk` |

แท็บ: ต้องติดต่อวันนี้ | Pipeline | ลีดทั้งหมด (+ ทางลัดบทบาท) ผ่าน `LeadsPageChrome`

## 2. โครงหน้า

1. Hero พาสเทล + H1 Pipeline + meta เปิด/มูลค่า/เสี่ยง + ปุ่มเพิ่มลีด / งานวันนี้  
2. Inline notice (`aria-live="polite"`) เมื่อย้ายขั้น — ห้าม modal/toast  
3. KPI 4 ใบคลิกกรอง: ลีดทั้งหมด · กำลังติดต่อ · ปิดได้ · มูลค่ารวม  
4. Funnel + chip ขั้นจาก `pipelineData` จริง  
5. Toolbar: ค้นหา · เรียง · ดีลเสี่ยง · สลับตาราง/บอร์ด  
6. ตาราง: ขยาย detail inline (ย้ายขั้นที่นี่เท่านั้น)  
7. บอร์ด: คอลัมน์ตามขั้น · จอเล็กเรียงแนวตั้ง · detail ใต้บอร์ดเมื่อเลือกการ์ด  

## 3. Interaction ห้ามใช้

modal / dialog / `alert()` / `confirm()` / `prompt()` / toast

## 4. กติกาธุรกิจ (UI)

- ขั้น 1–8 ตาม `STAGES` ในระบบ  
- มูลค่ารวมนับดีลที่ยังเปิด (ไม่รวมขั้นแพ้) · ค่า 0 แสดง "—"  
- โอกาสปิด/ความเสี่ยง: ประมาณจากขั้น + กำหนดติดต่อ (ถ้าไม่มีฟิลด์ใน API)  
