# LEAD-SPEC-A — Lead Management «แบบ A คลีนสว่าง»

สเปคการนำเสนอหน้า Lead Management ของ The KPI PLUS  
เปลี่ยนเฉพาะชั้น UI — คง route · โมดูล · ฟิลด์ · การกรอง · สิทธิ์เดิม ห้ามแก้ backend / schema / API

อ้างอิงโทเคนร่วม: `docs/design/DESIGN-SPEC-A.md`

## 1. Routes จริงในโปรเจกต์

| แท็บ | Route |
|---|---|
| ต้องติดต่อวันนี้ | `/crm/sales` |
| Pipeline | `/crm/pipeline` |
| ลีดทั้งหมด | `/crm/leads` |
| จากเว็บ / คีย์เอง | `/crm/leads?origin=web` · `?origin=manual` |
| รายละเอียดลีด | `/crm/leads/[id]` |

Sidebar กลุ่ม «การขายและลูกค้า» · โมดูล Lead Management เป็น active ผ่าน `CrmShell` — ห้ามสร้าง sidebar ซ้ำ

## 2. Design tokens

ใช้ชุดเดียวกับ DESIGN-SPEC-A:

| Token | Value |
|---|---|
| `--kpi-a-brand` | `#A2DC25` |
| `--kpi-a-brand-hover` | `#8AC016` |
| `--kpi-a-brand-soft` | `#F4FBE4` |
| `--kpi-a-brand-ink` | `#1A3A02` |
| `--kpi-a-amber` / soft | `#F59E0B` / `#FFF7E8` |
| `--kpi-a-rose` / soft | `#E11D48` / `#FFE8EE` |
| `--kpi-a-sky` / soft | `#0EA5E9` / `#E8F6FE` |
| `--kpi-a-canvas` | `#F6F8F6` |
| `--kpi-a-card` | `#FFFFFF` |
| `--kpi-a-border` | `#E6EAE7` |
| `--kpi-a-text` | `#16202B` |
| `--kpi-a-muted` | `#5B6B7A` |
| `--kpi-a-subtle` | `#FAFCF7` |

ฟอนต์: Prompt (fallback Sarabun) · base 17px (mobile ≥16px) · ห้ามอ่านต่ำกว่า 13.5px  
ตัวอักษรบนปุ่ม brand = `#1A3A02` เท่านั้น

## 3. โครงหน้า «ต้องติดต่อวันนี้» (`/crm/sales`)

1. Breadcrumb: การขายและลูกค้า / Lead Management  
2. Header: H1 + วันที่ไทย พ.ศ. + ปุ่ม «เพิ่มลีดใหม่» (lime) + «ดู Pipeline» (outline)  
3. แท็บ: ต้องติดต่อวันนี้ | Pipeline | ลีดทั้งหมด  
4. Inline notice (`aria-live="polite"`) เมื่อบันทึก/เพิ่มรายการ  
5. KPI strip 4 ใบ: เกินกำหนด / ถึงกำหนดวันนี้ / รอตอบกลับ / ลีดใหม่ — คลิกกรองรายการ · ring/พื้นอ่อนเฉพาะใบที่เกินกำหนด > 0  
6. คอลัมน์ซ้าย «รายการที่ต้องติดต่อ»: ค้นหา + chip กรอง + รายการจัดกลุ่ม  
7. คอลัมน์ขวา: กิจกรรมล่าสุด · ลีดใหม่ที่สุด · ช่องทางที่ลีดเข้ามา (แท่งแนวนอน)

## 4. แถวลีด + Follow-up (ห้าม popup)

- 1 ลีด = 1 แถว: avatar ตัวอักษร · ชื่อ · บรรทัดรอง (กิจการ · ขั้น/ขอบเขต · ช่องทาง) · ติดต่อล่าสุด · chip กำหนด · ปุ่ม «บันทึกผล» outline  
- เกินกำหนด: จุดสี + chip เท่านั้น — ห้ามทาสีพื้นทั้งใบ  
- «บันทึกผล» ขยายแผง inline ใต้แถว: radio chip ผลติดต่อ 5 ตัว · นัดครั้งถัดไป date+time แยกช่องพร้อม label ไทย · หมายเหตุ · บันทึก (lime) + ยกเลิก  
- error: `role="alert"` ใต้ฟอร์ม · success: ข้อความในหน้า + chip «บันทึกแล้ว»  
- ปุ่ม lime หลัก ≤ 2 ต่อบริบท (header + ฟอร์มที่กรอก)

## 5. Pipeline / ลีดทั้งหมด

- Pipeline: คานบันตามขั้นจริงจาก `pipelineData` · จอเล็กเรียงคอลัมน์แนวตั้ง  
- ลีดทั้งหมด: ตาราง ≥1024px · การ์ด stacked บนจอเล็ก

## 6. Interaction ห้ามใช้

modal / dialog / `alert()` / `confirm()` / `prompt()` / toast ใน flow Lead Management — ใช้ side panel หรือแผง inline แทน

## 7. ขอบเขต

- ห้ามแตะ backend / schema / API contract / query เดิม (อ่านอย่างเดียวได้)  
- ห้าม dependency ใหม่  
- Shell sidebar/topbar อยู่ใน `CrmShell`
