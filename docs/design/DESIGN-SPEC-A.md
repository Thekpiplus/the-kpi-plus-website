# DESIGN-SPEC-A — Dashboard «แบบ A คลีนสว่าง»

สเปคการนำเสนอหน้า CRM Dashboard (`/crm`) ของ The KPI PLUS  
เปลี่ยนเฉพาะชั้น UI — คงข้อมูล โมดูล route และสิทธิ์เดิม ห้ามแก้ backend / schema / API

## 1. Design tokens

| Token | Value | ใช้กับ |
|---|---|---|
| `--kpi-a-brand` | `#A2DC25` | ปุ่มหลัก, active nav, focus |
| `--kpi-a-brand-hover` | `#8AC016` | hover ปุ่ม brand |
| `--kpi-a-brand-soft` | `#F4FBE4` | พื้นอ่อน, empty |
| `--kpi-a-brand-ink` | `#1A3A02` | ตัวอักษรบน brand |
| `--kpi-a-sun` | `#EBE722` | gradient hero |
| `--kpi-a-amber` | `#F59E0B` | เตือนปานกลาง (เมื่อค่า > 0) |
| `--kpi-a-amber-soft` | `#FFF7E8` | chip soft |
| `--kpi-a-rose` | `#E11D48` | เกินกำหนด (เมื่อค่า > 0) |
| `--kpi-a-rose-soft` | `#FFE8EE` | chip soft |
| `--kpi-a-sky` | `#0EA5E9` | ข้อมูลกลาง |
| `--kpi-a-sky-soft` | `#E8F6FE` | chip soft |
| `--kpi-a-sidebar` | `#101A24` | พื้น sidebar (CrmShell) |
| `--kpi-a-canvas` | `#F6F8F6` | พื้นหน้า |
| `--kpi-a-card` | `#FFFFFF` | การ์ด |
| `--kpi-a-border` | `#E6EAE7` | ขอบ |
| `--kpi-a-hairline` | `#EEF1EE` | เส้นบาง |
| `--kpi-a-text` | `#16202B` | ตัวหลัก |
| `--kpi-a-muted` | `#5B6B7A` | คำอธิบาย (ห้ามใช้สีจางกว่านี้กับข้อมูลจำเป็น) |
| `--kpi-a-subtle` | `#FAFCF7` | กล่อง metric / empty |
| `--kpi-a-metric-box` | `#FAFCF7` | กล่อง 3 metrics |

Hero gradient: `linear-gradient(110deg, #A2DC25, #CFE86A 45%, #EBE722)`

## 2. Typography (Prompt)

| Role | Size | Weight |
|---|---|---|
| Base | 17px (mobile 16px) | 400 |
| H1 | clamp 34→42px | 700 |
| H2 | 22–24px | 700 |
| H3 | 18px | 700 |
| Body | 16px | 400 |
| Caption / metric label | 13–15px | 500–600 |
| KPI number | 34px | 700 + `tabular-nums` |
| Summary number | 46px | 700 + `tabular-nums` |

ห้ามมีข้อความที่ต้องอ่านต่ำกว่า 13px  
ตัวอักษรบนปุ่ม brand ต้องเป็น `#1A3A02` เท่านั้น (ห้ามขาว)

## 3. Layout blocks (ลำดับบนลงล่าง)

1. **Hero grid** `1.55fr | 1fr`  
   - ซ้าย: gradient card — label DASHBOARD + chip role, H1 ทักทาย, sub 1 บรรทัด, ปุ่ม dark «งานที่ต้องทำวันนี้» + ปุ่มขาว «+ สร้างเนื้อหาใหม่»  
   - ขวา: «งานที่ต้องจัดการ» — ตัวเลข 46px + «รายการ», chip rose-soft / brand-soft, ลิงก์ «เปิดงานวันนี้»
2. **KPI strip** 4 ใบ — ขอบบน 4px ตามโทน, ตัวเลข 34px, note 1 บรรทัด  
   (เกินกำหนด / ถึงกำหนดวันนี้ / งานเปิดวันนี้ / รออนุมัติ)
3. **งานที่ต้องดำเนินการ** — รายการหรือ empty เส้นประ พื้น `#FAFCF7`  
   ข้อความ empty: «ยังไม่มีงานค้างตอนนี้» / «เมื่องานถึงกำหนดหรือเกินกำหนด รายการจะมาแสดงที่นี่ตามความเร่งด่วน» / ปุ่ม «สร้างคิวใหม่»
4. **ทางลัดโมดูล** — grid sm:2 / lg:3 / 2xl:4  
   การ์ด: radius 20px, ขอบ `#E6EAE7`, icon chip, code chip, ชื่อ 18px, blurb 1 บรรทัด, 3 metrics ในกล่อง subtle, ปุ่ม pill brand (ไม่เต็มความกว้าง)
5. **กิจกรรมสำคัญล่าสุด** — จุดสี + ข้อความ + meta

## 4. States

- Loading: skeleton การ์ด (ไม่ใช่ spinner กลางจอ)
- Error: การ์ด rose-soft + ปุ่ม «ลองใหม่»
- Empty: ตามข้อ 3
- Hover: ยก 2px + border `#CFE3AD` + soft shadow
- Focus: ring 2px `#A2DC25` offset 2px
- สีเตือน (rose/amber) ใช้เฉพาะเมื่อค่า > 0
- `prefers-reduced-motion`: ปิด transition ยก

## 5. Responsive

- ≥1280: sidebar เต็ม sticky (CrmShell)
- 768–1279: sidebar drawer ของ CrmShell
- <640: ทุกบล็อกรวมคอลัมน์เดียว, base 16px, ปุ่มหลักเต็มความกว้างได้

## 6. ModuleDef (สัญญาข้อมูล)

```ts
type ModuleDef = {
  id: string;
  code: string;       // LEAD, PARTNER, …
  name: string;       // ชื่อโมดูล (อังกฤษได้)
  blurb: string;      // 1 บรรทัดไทย
  href: string;
  tone: string;
  metrics: Array<{ label: string; value: number }>; // label สั้น 1–3 พยางค์
  cta: string;        // "เปิด <Module>"
};
```

โมดูลที่ผู้ใช้ไม่มีสิทธิ์ต้องไม่ render

## 7. Shell / ขอบเขต

- Sidebar + Topbar ของทั้ง CRM อยู่ใน `CrmShell` — รอบนี้รีสไตล์**เนื้อหา Dashboard** ตามแบบ A
- ห้ามสร้าง sidebar ซ้ำในหน้า `/crm`
- Command palette ⌘K เป็นงานแยก (prompt 2.8)
- Stack จริงของโปรเจกต์: Next.js App Router + CSS ตัวแปร (ไม่ใช้ Tailwind ในรอบนี้)
