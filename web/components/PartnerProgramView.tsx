import { PartnerApplyForm } from "@/components/PartnerApplyForm";
import { TrackOnce } from "@/components/TrackOnce";
import { Network } from "@/components/Icons";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";

const benefits = [
  "โอกาสสร้างรายได้จากลูกค้าที่แนะนำ",
  "ระบบส่งและติดตาม Referral ของตนเอง",
  "ทีม The KPI Plus ช่วยดูแลการประเมินและนำเสนอบริการ",
  "ข้อมูลบริการและสื่อที่ช่วยให้แนะนำลูกค้าได้ง่ายขึ้น",
  "โอกาสพัฒนาความร่วมมือในระดับที่มากขึ้น",
];

const tiers = [
  {
    name: "Referral Partner",
    title: "คุณแนะนำลูกค้า เราดูแลขั้นตอนต่อไป",
    body: "เหมาะกับผู้ที่รู้จักเจ้าของหรือผู้บริหารที่พัก และต้องการส่งต่อโอกาสให้ทีม The KPI Plus ติดต่อและดูแล",
  },
  {
    name: "Certified Partner",
    title: "เข้าใจบริการ และร่วมพูดคุยกับลูกค้า",
    body: "สำหรับพาร์ตเนอร์ที่ผ่านการเรียนรู้และรับรองจาก The KPI Plus สามารถช่วยอธิบายบริการ คัดกรองความต้องการ และร่วมทำงานกับทีมในขั้นตอนการขาย",
  },
  {
    name: "Solution Partner",
    title: "ร่วมทำงานตั้งแต่การขายถึงการเริ่มให้บริการ",
    body: "สำหรับพาร์ตเนอร์ที่มีความพร้อมช่วยนำเสนอ วางแนวทางแก้ปัญหา และประสานงานช่วงเริ่มต้นกับลูกค้า โดยทำงานร่วมกับทีม The KPI Plus",
  },
];

const services = [
  ["Revenue Management", "วางราคา โปรโมชั่น และกลยุทธ์เพิ่มรายได้จากห้องพัก"],
  ["OTA & Distribution", "ดูแลช่องทางขาย เช่น Booking.com, Agoda และช่องทางออนไลน์อื่น ๆ"],
  ["Reservations & Commercial Support", "ช่วยจัดการกระบวนการรับจองและโอกาสทางการขาย"],
  ["Hotel Website & Direct Booking", "พัฒนาเว็บไซต์และเส้นทางการจองตรง"],
  ["Hotel Digital Marketing", "วางแผนการตลาดออนไลน์ให้สอดคล้องกับเป้าหมายของที่พัก"],
  ["Training & Team Development", "พัฒนาความเข้าใจด้านรายได้ การขาย และการใช้ข้อมูลของทีมโรงแรม"],
];

const steps = [
  ["01", "สมัคร", "กรอกข้อมูลเกี่ยวกับตัวคุณ ประสบการณ์ และรูปแบบการร่วมงานที่สนใจ"],
  ["02", "พูดคุยกับทีม", "ทีม The KPI Plus ตรวจสอบใบสมัครและติดต่อกลับเพื่อทำความรู้จักกัน"],
  ["03", "เริ่มแนะนำลูกค้า", "เมื่อได้รับอนุมัติ คุณสามารถส่งข้อมูลลูกค้าผ่าน Partner Portal"],
  ["04", "ติดตามความคืบหน้า", "ดูสถานะ Referral และข้อมูลผลตอบแทนที่เกี่ยวข้องกับคุณในระบบ"],
];

export function PartnerProgramView({ sent, error }: { sent?: boolean; error?: string }) {
  return (
    <SiteShell locale="th" route="/partner">
      <PageHero>
        <div className="kpi-split">
          <div>
            <p className="kpi-kicker text-[#F2F8E2]">The KPI Plus Partner Program</p>
            <h1 className="kpi-h1 mt-5">รู้จักโรงแรมที่อยากเพิ่มรายได้? มาเติบโตไปด้วยกัน</h1>
            <p className="mt-5 text-2xl font-extrabold tracking-[-.04em] text-white">สมัครเป็น The KPI Plus Partner</p>
            <p className="kpi-lead mt-5 text-white/72">
              ใช้ความสัมพันธ์และประสบการณ์ของคุณในธุรกิจโรงแรม เชื่อมต่อผู้ประกอบการกับทีมที่ช่วยดูแลเรื่องรายได้ ราคา
              และช่องทางการขาย
            </p>
            <p className="kpi-lead mt-4 text-white/72">
              The KPI Plus Partner Program เปิดรับผู้ที่ต้องการแนะนำโรงแรม รีสอร์ท วิลล่า และที่พักที่อาจได้รับประโยชน์จากบริการของเรา
              คุณเริ่มต้นได้เพียงแนะนำลูกค้า หรือร่วมทำงานกับทีมในขั้นตอนการขายและเริ่มให้บริการ
            </p>
            <div className="kpi-actions">
              <a href="#apply" className="kpi-button">
                สมัครเป็น Partner
              </a>
              <a href="/partners/login" className="kpi-button-ghost">
                เข้าสู่ Partner Portal
              </a>
            </div>
          </div>
          <div className="kpi-hero-visual rounded-[1.25rem] border border-white/12 bg-white/5 p-8">
            <Network className="h-10 w-10 text-[#F2F8E2]" />
            <p className="mt-10 text-sm font-bold leading-7 text-white/80">
              คุณแนะนำ เราช่วยประเมิน ติดต่อ และนำเสนอบริการที่เหมาะสม แล้วคุณติดตาม Referral ได้ใน Partner Portal
            </p>
          </div>
        </div>
      </PageHero>

      <section className="kpi-section">
        <h2 className="kpi-h2">คุณแนะนำ เราช่วยดูแลโอกาสนั้นต่อ</h2>
        <p className="kpi-lead mt-5">
          คุณอาจรู้จักเจ้าของโรงแรมที่ยอดจองยังไม่เป็นไปตามเป้า ที่พักที่ต้องการปรับราคาให้เหมาะกับตลาด
          หรือทีมงานที่ไม่มีเวลาดูแล OTA อย่างใกล้ชิด
        </p>
        <p className="kpi-lead mt-4">
          เมื่อคุณแนะนำลูกค้าเข้ามา The KPI Plus จะช่วยประเมินความต้องการ ติดต่อพูดคุย และนำเสนอบริการที่เหมาะสม
          คุณสามารถติดตามความคืบหน้าของลูกค้าที่แนะนำได้ผ่าน Partner Portal
        </p>
        <h3 className="mt-10 text-xl font-extrabold text-[#3B3B3B]">สิ่งที่คุณจะได้รับ</h3>
        <ul className="mt-5 grid gap-3">
          {benefits.map((item) => (
            <li key={item} className="kpi-card px-5 py-4 text-base leading-7 text-[#555555]">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-7 text-[#555555]">
          ผลตอบแทนเป็นไปตามระดับพาร์ตเนอร์และเงื่อนไขของโปรแกรมที่ได้รับอนุมัติ
        </p>
      </section>

      <section className="bg-[#F4F4F4]">
        <div className="kpi-section">
          <h2 className="kpi-h2">เลือกรูปแบบการร่วมงานที่เหมาะกับคุณ</h2>
          <div className="kpi-grid-3 mt-10">
            {tiers.map((tier) => (
              <article key={tier.name} className="kpi-card p-7">
                <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0B6660]">{tier.name}</p>
                <h3 className="mt-4 text-xl font-extrabold text-[#3B3B3B]">{tier.title}</h3>
                <p className="mt-4 text-base leading-8 text-[#555555]">{tier.body}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-base leading-8 text-[#555555]">
            คุณไม่จำเป็นต้องเลือกระดับด้วยตัวเองตั้งแต่วันแรก สมัครเข้ามาก่อน แล้วเราจะพูดคุยเพื่อหารูปแบบที่เหมาะกับประสบการณ์และความสนใจของคุณ
          </p>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">ลูกค้าแบบไหนที่คุณแนะนำได้?</h2>
        <p className="kpi-lead mt-5">เราอยากรู้จักผู้ประกอบการที่กำลังมองหาความช่วยเหลือในเรื่องเหล่านี้:</p>
        <div className="kpi-grid-2 mt-8">
          {services.map(([title, body]) => (
            <article key={title} className="kpi-card p-6">
              <h3 className="text-lg font-extrabold text-[#3B3B3B]">{title}</h3>
              <p className="mt-3 text-base leading-8 text-[#555555]">{body}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-base leading-8 text-[#555555]">
          ไม่ต้องวิเคราะห์แทนลูกค้าทั้งหมด เพียงบอกเราให้ทราบว่าที่พักแห่งนั้นกำลังเจอปัญหาหรือมองหาโอกาสเรื่องใด
          ทีมงานจะช่วยประเมินบริการที่เหมาะสม
        </p>
      </section>

      <section className="bg-[#F2F8E2]">
        <div className="kpi-section">
          <h2 className="kpi-h2">ใครสมัครได้บ้าง?</h2>
          <p className="kpi-lead mt-5">
            โปรแกรมนี้เหมาะกับผู้ที่มีความสัมพันธ์หรือประสบการณ์เกี่ยวกับธุรกิจที่พัก เช่น ที่ปรึกษาโรงแรม
            พนักงานหรืออดีตพนักงานโรงแรม ผู้ให้บริการเทคโนโลยีโรงแรม เอเจนซี นักการตลาด ผู้ดูแลวิลล่า ซัพพลายเออร์
            และผู้ประกอบอาชีพอิสระ
          </p>
          <p className="mt-6 text-lg font-extrabold leading-8 text-[#063F3B]">
            ไม่จำเป็นต้องเป็นนักขายมืออาชีพ หากคุณรู้จักธุรกิจที่ The KPI Plus อาจช่วยได้ และอยากเริ่มจากการแนะนำอย่างจริงใจ ก็สมัครได้
          </p>
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">เริ่มต้นอย่างไร?</h2>
        <ol className="kpi-grid-2 mt-10">
          {steps.map(([num, title, body]) => (
            <li key={num} className="kpi-card p-6">
              <p className="text-xs font-extrabold tracking-[.14em] text-[#0B6660]">{num}</p>
              <h3 className="mt-3 text-xl font-extrabold text-[#3B3B3B]">{title}</h3>
              <p className="mt-3 text-base leading-8 text-[#555555]">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-[#F4F4F4]">
        <div className="kpi-section">
          <h2 className="kpi-h2">จัดการ Referral ได้ในที่เดียว</h2>
          <p className="kpi-lead mt-5">
            เมื่อได้รับอนุมัติ คุณจะสามารถใช้ The KPI Plus Partner Portal เพื่อส่งลูกค้า ดูความคืบหน้าของ Referral
            ติดตามค่าคอมมิชชันและประวัติการจ่าย รวมถึงจัดการข้อมูลสำหรับการรับเงิน
          </p>
          <p className="kpi-lead mt-4">
            รายละเอียดที่แสดงใน Portal จะเป็นข้อมูลที่เกี่ยวข้องกับ Referral ของคุณ และเป็นไปตามเงื่อนไข Partner Program
          </p>
        </div>
      </section>

      <section className="kpi-section">
        <p className="kpi-kicker text-[#0B6660]">Better together</p>
        <h2 className="kpi-h2 mt-4">มาเชื่อมต่อโอกาสใหม่ให้ธุรกิจโรงแรม</h2>
        <p className="kpi-lead mt-5">หากคุณรู้จักผู้ประกอบการที่อยากบริหารรายได้และช่องทางขายให้ดีขึ้น เราอยากรู้จักคุณ</p>
        <div className="kpi-actions">
          <a href="#apply" className="kpi-button">
            สมัครเป็น The KPI Plus Partner
          </a>
          <a href="/partners/login" className="kpi-button-ghost">
            เข้าสู่ระบบ
          </a>
        </div>
      </section>

      <section id="terms" className="bg-[#F4F4F4]">
        <div className="kpi-section">
          <h2 className="kpi-h2">เงื่อนไข Partner Program</h2>
          <div className="mt-8 grid gap-4 text-base leading-8 text-[#555555]">
            <p>การส่งใบสมัครยังไม่ทำให้คุณเป็นพาร์ตเนอร์ ทีม The KPI Plus จะตรวจสอบข้อมูลและติดต่อกลับก่อนยืนยันการเข้าร่วมโปรแกรม</p>
            <p>
              อัตราผลตอบแทนจะแจ้งในเงื่อนไขพาร์ตเนอร์หลังได้รับอนุมัติ ไม่แสดงบนหน้าสาธารณะนี้
              ผลตอบแทนขึ้นอยู่กับระดับพาร์ตเนอร์ ประเภทของดีล และเงื่อนไขที่ได้รับอนุมัติในขณะนั้น
            </p>
            <p>
              การให้เครดิต Referral ยังไม่ใช่ค่าคอมมิชชัน จนกว่า Referral จะถูกรับเข้าสู่กระบวนการขาย ปิดดีลได้
              และมีการยืนยันว่ารับเงินจริงแล้ว
            </p>
            <p>
              บัตรประชาชน เลขผู้เสียภาษี และบัญชีธนาคารไม่ต้องกรอกในหน้านี้ ให้กรอกใน Partner Portal หลังได้รับอนุมัติ
            </p>
            <p>โปรดตรวจสอบว่าลูกค้ายินดีให้ The KPI Plus ติดต่อก่อนส่งข้อมูล Referral</p>
          </div>
        </div>
      </section>

      <section className="kpi-section">
        {sent ? <TrackOnce event="generate_lead" params={{ form: "partner_application" }} /> : null}
        {error === "unavailable" ? (
          <p className="mb-6 font-semibold text-[#063F3B]">ระบบรับสมัครยังไม่พร้อม กรุณาลองใหม่ภายหลังหรือติดต่อทีมงาน</p>
        ) : null}
        <PartnerApplyForm sent={sent} error={error} />
      </section>
    </SiteShell>
  );
}
