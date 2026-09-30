import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import {
  CONTROLLER,
  POLICY_VERSION,
  PRIVACY_CONTACT,
  formatPolicyDate,
  policyMeta,
} from "@/lib/privacy";
import { existingHref, type Locale } from "@/lib/seo";

function policyLocale(locale: Locale): "th" | "en" {
  return locale === "th" ? "th" : "en";
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="kpi-policy-table-wrap">
      <table className="kpi-policy-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactBlock({ locale }: { locale: "th" | "en" }) {
  return (
    <p>
      {locale === "en" ? (
        <>
          For questions or requests about your personal data, contact our {PRIVACY_CONTACT.roleEn}:
          <br />
        </>
      ) : null}
      {PRIVACY_CONTACT.name}
      <br />
      {locale === "th" ? PRIVACY_CONTACT.addressTh : PRIVACY_CONTACT.addressEn}
      <br />
      {locale === "th" ? "อีเมล" : "Email"}: {PRIVACY_CONTACT.email} · {locale === "th" ? "โทรศัพท์" : "Phone"}: {PRIVACY_CONTACT.phone}
      <br />
      WhatsApp:{" "}
      <a href={PRIVACY_CONTACT.whatsapp} className="font-semibold text-[#0B6660]">
        wa.me/66826356266
      </a>{" "}
      · LINE:{" "}
      <a href={PRIVACY_CONTACT.line} className="font-semibold text-[#0B6660]">
        lin.ee/TQibLMD
      </a>
    </p>
  );
}

export function PrivacyNoticeView({ locale, route }: { locale: Locale; route: string }) {
  const lang = policyLocale(locale);
  const cookiesHref = existingHref("/cookies", locale) ?? (lang === "th" ? "/cookies" : "/en/cookies");
  const contactHref = existingHref("/contact", locale) ?? (lang === "th" ? "/contact" : "/en/contact");
  const date = formatPolicyDate(lang);

  const purposeRows =
    lang === "th"
      ? [
          ["ตอบคำถาม ให้ข้อมูล และติดต่อกลับตามที่คุณร้องขอ", "การดำเนินการตามคำขอก่อนเข้าทำสัญญา และประโยชน์โดยชอบด้วยกฎหมายในการตอบการติดต่อ"],
          ["จัดทำใบเสนอราคา ให้บริการ และบริหารความสัมพันธ์กับลูกค้า", "การปฏิบัติตามสัญญา"],
          ["วิเคราะห์การใช้งานเว็บไซต์เพื่อปรับปรุงเนื้อหา ผ่าน Google Analytics", "ความยินยอม (คุกกี้เพื่อการวิเคราะห์)"],
          ["รักษาความปลอดภัยของเว็บไซต์ ป้องกันสแปมและการใช้งานในทางที่ผิด", "ประโยชน์โดยชอบด้วยกฎหมาย"],
          ["เก็บหลักฐานการให้หรือถอนความยินยอม", "ประโยชน์โดยชอบด้วยกฎหมาย และหน้าที่ตามกฎหมาย"],
          ["จัดทำบัญชีและเอกสารภาษี", "หน้าที่ตามกฎหมาย"],
          ["ก่อตั้ง ใช้ หรือยกขึ้นต่อสู้สิทธิเรียกร้องตามกฎหมาย", "ประโยชน์โดยชอบด้วยกฎหมาย"],
        ]
      : [
          ["Answer your enquiry and get back to you", "Steps you ask us to take before a contract; our legitimate interest in responding to people who contact us"],
          ["Prepare quotations, deliver services and manage our client relationship", "Performance of a contract"],
          ["Understand how the website is used so we can improve it, through Google Analytics", "Your consent (analytics cookies)"],
          ["Keep the website secure and prevent spam and abuse", "Legitimate interest"],
          ["Keep a record of consent given or withdrawn", "Legitimate interest and legal obligation"],
          ["Keep accounting and tax records", "Legal obligation"],
          ["Establish, exercise or defend legal claims", "Legitimate interest"],
        ];

  const retentionRows =
    lang === "th"
      ? [
          ["การติดต่อสอบถามที่ไม่ได้เป็นลูกค้า", "2 ปีนับจากการติดต่อครั้งล่าสุด"],
          ["ข้อมูลลูกค้าและสัญญา", "ตลอดระยะสัญญา และต่อไปเท่าที่กฎหมายบัญชีและภาษีกำหนด"],
          ["เอกสารบัญชีและภาษี", "ตามที่กฎหมายกำหนด โดยทั่วไปไม่น้อยกว่า 5 ปี"],
          ["ใบสมัคร Partner", "ตลอดการพิจารณา และต่อไปหากได้รับอนุมัติตามความสัมพันธ์พาร์ตเนอร์"],
          ["หลักฐานการตั้งค่าคุกกี้", "12 เดือนนับจากวันที่เลือก"],
          ["ข้อมูลในคุกกี้", "ตามอายุที่ระบุในนโยบายคุกกี้"],
        ]
      : [
          ["Enquiries that do not lead to a client relationship", "2 years after last contact"],
          ["Client and contract records", "For the contract term and then as long as accounting and tax law require"],
          ["Accounting and tax documents", "As required by law (generally at least 5 years)"],
          ["Partner applications", "During review, and for the partnership if approved"],
          ["Cookie consent records", "12 months from the choice"],
          ["Cookie data", "As listed in the Cookie Policy"],
        ];

  return (
    <SiteShell locale={locale} route={route}>
      <PageHero>
        <p className="kpi-kicker text-[#F2F8E2]">{lang === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Notice"}</p>
        <h1 className="kpi-h1 mt-5">{lang === "th" ? "นโยบายความเป็นส่วนตัว" : "Privacy Notice"}</h1>
        <p className="kpi-lead mt-5 text-white/72">{policyMeta(lang)}</p>
      </PageHero>
      <section className="kpi-section">
        <article className="kpi-policy mx-auto grid max-w-4xl gap-6 text-base leading-8 text-[#555555]">
          {lang === "th" ? (
            <>
              <p>
                นโยบายนี้อธิบายว่า The KPI Plus เก็บ ใช้ และเปิดเผยข้อมูลส่วนบุคคลของคุณอย่างไรเมื่อคุณใช้เว็บไซต์ thekpiplus.com
                ติดต่อเราผ่านแบบฟอร์ม อีเมล โทรศัพท์ LINE หรือ WhatsApp รวมถึงสิทธิของคุณตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              </p>
              <h2>1. ผู้ควบคุมข้อมูลส่วนบุคคลและช่องทางติดต่อ</h2>
              <p>
                ผู้ควบคุมข้อมูลส่วนบุคคลคือ {CONTROLLER.th} ซึ่งดำเนินธุรกิจภายใต้ชื่อ The KPI Plus (“เรา”) ที่อยู่สำหรับติดต่อเรื่องข้อมูลส่วนบุคคลคือที่อยู่ด้านล่าง
              </p>
              <p>
                หากมีคำถามหรือต้องการใช้สิทธิเกี่ยวกับข้อมูลส่วนบุคคล โปรดติดต่อ{PRIVACY_CONTACT.roleTh}ของเรา
              </p>
              <ContactBlock locale="th" />
              <p>
                หรือผ่านหน้า{" "}
                <a href={contactHref} className="font-semibold text-[#0B6660]">
                  ติดต่อเรา
                </a>
              </p>

              <h2>2. ข้อมูลส่วนบุคคลที่เราเก็บ</h2>
              <ul>
                <li>ข้อมูลติดต่อ เช่น ชื่อ อีเมล หมายเลขโทรศัพท์ ชื่อโรงแรมหรือบริษัท ตำแหน่ง จังหวัด จำนวนห้อง และช่องทางที่สะดวกให้ติดต่อกลับ</li>
                <li>ข้อมูลที่คุณส่งมาให้เรา เช่น ข้อความ คำถาม รายละเอียดโครงการ และการติดต่อผ่าน LINE หรือ WhatsApp</li>
                <li>ข้อมูลใบสมัคร Partner เช่น ชื่อ อีเมล เบอร์โทร พื้นที่ทำงาน ประเภทธุรกิจ และเอกสารที่คุณอัปโหลดใน Partner Portal เช่น บัตรประชาชน</li>
                <li>ข้อมูลทางเทคนิคและการใช้งาน เช่น หมายเลข IP ประเภทเบราว์เซอร์และอุปกรณ์ หน้าที่เข้าชม และตัวระบุในคุกกี้ โดยข้อมูลเพื่อการวิเคราะห์จะเก็บเมื่อคุณอนุญาตเท่านั้น</li>
                <li>ข้อมูลการตั้งค่าคุกกี้ ได้แก่ ตัวเลือกที่คุณเลือก เวลา และเวอร์ชันของข้อความที่คุณเห็น</li>
                <li>ข้อมูลลูกค้าและการเงิน เมื่อคุณใช้บริการของเรา เช่น ข้อมูลในใบเสนอราคา ใบแจ้งหนี้ และการชำระเงิน</li>
              </ul>
              <p>
                เราไม่มีความประสงค์จะเก็บข้อมูลส่วนบุคคลที่อ่อนไหว เช่น ข้อมูลสุขภาพ ศาสนา หรือประวัติอาชญากรรม โปรดอย่าระบุข้อมูลเหล่านี้ในข้อความที่ส่งถึงเรา หากได้รับโดยไม่ตั้งใจ เราจะลบข้อมูลนั้นเมื่อไม่จำเป็นต้องใช้
              </p>

              <h2>3. แหล่งที่มาของข้อมูล</h2>
              <p>
                เราได้รับข้อมูลจากคุณโดยตรงเมื่อคุณกรอกแบบฟอร์มหรือติดต่อเรา จากอุปกรณ์ของคุณผ่านคุกกี้และเทคโนโลยีที่คล้ายกันตามที่คุณเลือก และจากผู้ให้บริการแพลตฟอร์ม เช่น รายงานสรุปจาก Google Analytics เมื่อคุณอนุญาตคุกกี้เพื่อการวิเคราะห์
              </p>

              <h2>4. วัตถุประสงค์และฐานทางกฎหมาย</h2>
              <Table headers={["วัตถุประสงค์", "ฐานทางกฎหมาย"]} rows={purposeRows} />
              <p>
                หากคุณไม่ให้ข้อมูลที่จำเป็น เช่น ช่องทางติดต่อกลับ เราอาจไม่สามารถตอบคำถามหรือให้บริการแก่คุณได้ การปฏิเสธคุกกี้เพื่อการวิเคราะห์ไม่มีผลต่อการใช้งานพื้นฐานของเว็บไซต์
              </p>

              <h2>5. คุกกี้</h2>
              <p>
                รายละเอียดคุกกี้และวิธีเปลี่ยนการตั้งค่าอยู่ใน{" "}
                <a href={cookiesHref} className="font-semibold text-[#0B6660]">
                  นโยบายคุกกี้
                </a>
                คุณเปิดศูนย์ตั้งค่าคุกกี้ได้จากลิงก์ “ตั้งค่าคุกกี้” ด้านล่างของทุกหน้า
              </p>

              <h2>6. ผู้ที่ได้รับข้อมูลของคุณ</h2>
              <p>เราไม่ขายข้อมูลส่วนบุคคลของคุณ เราเปิดเผยข้อมูลเท่าที่จำเป็นแก่ผู้รับดังต่อไปนี้เท่านั้น</p>
              <ul>
                <li>ผู้ให้บริการโฮสติ้งเว็บไซต์และผู้ให้บริการอีเมล ซึ่งประมวลผลข้อมูลตามคำสั่งของเรา</li>
                <li>ระบบบริหารลูกค้า (CRM) ของ The KPI Plus สำหรับทีมที่ได้รับอนุญาต</li>
                <li>Google (Google Analytics) เฉพาะเมื่อคุณอนุญาตคุกกี้หมวดการวิเคราะห์ และ Google Maps เมื่อคุณเลือกแสดงแผนที่</li>
                <li>LY Corporation (LINE) และ WhatsApp (Meta) เมื่อคุณเลือกติดต่อเราผ่านช่องทางเหล่านี้ ซึ่งผู้ให้บริการแต่ละรายมีนโยบายความเป็นส่วนตัวของตนเอง</li>
                <li>ผู้สอบบัญชี ผู้ทำบัญชี และที่ปรึกษากฎหมาย เมื่อจำเป็น</li>
                <li>หน่วยงานรัฐหรือศาล เมื่อกฎหมายกำหนดหรือมีคำสั่งโดยชอบด้วยกฎหมาย</li>
              </ul>

              <h2>7. การส่งข้อมูลไปต่างประเทศ</h2>
              <p>
                ผู้ให้บริการบางรายข้างต้น เช่น Google อาจประมวลผลหรือจัดเก็บข้อมูลนอกประเทศไทย รวมถึงสหรัฐอเมริกา ซึ่งอาจมีมาตรฐานการคุ้มครองข้อมูลต่างจากประเทศไทย เราจะส่งข้อมูลเมื่อเป็นไปตามเงื่อนไขของ PDPA และอาศัยข้อตกลงหรือมาตรการคุ้มครองของผู้ให้บริการ
              </p>

              <h2>8. ระยะเวลาการเก็บรักษา</h2>
              <Table headers={["ประเภทข้อมูล", "ระยะเวลา"]} rows={retentionRows} />
              <p>เมื่อพ้นระยะเวลาดังกล่าว เราจะลบ ทำลาย หรือทำให้ข้อมูลไม่สามารถระบุตัวบุคคลได้</p>

              <h2>9. การรักษาความปลอดภัย</h2>
              <p>
                เราใช้มาตรการเชิงองค์กรและเชิงเทคนิคที่เหมาะสมเพื่อป้องกันการเข้าถึง ใช้ เปลี่ยนแปลง หรือเปิดเผยข้อมูลโดยไม่ได้รับอนุญาต ได้แก่ การเข้ารหัส HTTPS การจำกัดสิทธิ์เข้าถึงเฉพาะผู้ที่จำเป็น การยืนยันตัวตนสำหรับบัญชีผู้ดูแลระบบ และการเข้ารหัสเอกสารส่วนตัวของพาร์ตเนอร์ และจะทบทวนมาตรการเหล่านี้เป็นระยะ
              </p>

              <h2>10. สิทธิของคุณ</h2>
              <p>ภายใต้เงื่อนไขที่กฎหมายกำหนด คุณมีสิทธิ</p>
              <ul>
                <li>ขอเข้าถึงและขอรับสำเนาข้อมูลส่วนบุคคลของคุณ</li>
                <li>ขอให้ส่งหรือโอนข้อมูลในรูปแบบที่อ่านได้ด้วยเครื่องอัตโนมัติ</li>
                <li>คัดค้านการประมวลผล รวมถึงการใช้ข้อมูลเพื่อการตลาดแบบตรง</li>
                <li>ขอให้ลบ ทำลาย หรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้</li>
                <li>ขอให้ระงับการใช้ข้อมูล</li>
                <li>ขอให้แก้ไขข้อมูลให้ถูกต้อง เป็นปัจจุบัน และสมบูรณ์</li>
                <li>ถอนความยินยอมเมื่อใดก็ได้ โดยไม่กระทบการประมวลผลที่ทำไปแล้วก่อนการถอน</li>
                <li>ร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) หากเห็นว่าเราไม่ปฏิบัติตามกฎหมาย</li>
              </ul>

              <h2>11. วิธีใช้สิทธิและถอนความยินยอม</h2>
              <ul>
                <li>คุกกี้: คลิก “ตั้งค่าคุกกี้” ด้านล่างของทุกหน้า แล้วปิดหมวดที่ไม่ต้องการ</li>
                <li>
                  สิทธิอื่น: ส่งคำขอมาที่ {PRIVACY_CONTACT.email} หรือช่องทางในข้อ 1 โดยระบุสิทธิที่ต้องการใช้ เราอาจขอข้อมูลเพิ่มเติมเท่าที่จำเป็นเพื่อยืนยันตัวตนก่อนดำเนินการ
                </li>
              </ul>
              <p>
                เราจะตอบคำขอโดยไม่ชักช้าและภายในระยะเวลาที่กฎหมายกำหนด ซึ่งโดยทั่วไปไม่เกิน 30 วันนับแต่ได้รับคำขอ หากเราไม่สามารถดำเนินการตามคำขอได้ เราจะแจ้งเหตุผลให้คุณทราบ
              </p>

              <h2>12. ผู้เยาว์</h2>
              <p>เว็บไซต์และบริการของเราไม่ได้มุ่งให้บริการแก่ผู้เยาว์ หากเราทราบว่าได้รับข้อมูลของผู้เยาว์โดยไม่มีความยินยอมที่ถูกต้อง เราจะลบข้อมูลนั้น</p>

              <h2>13. การเปลี่ยนแปลงนโยบาย</h2>
              <p>
                เราอาจปรับปรุงนโยบายนี้เมื่อบริการ เครื่องมือ หรือกฎหมายเปลี่ยนไป โดยจะแสดงวันที่ปรับปรุงไว้ด้านบน หากมีการเปลี่ยนแปลงที่สำคัญ เช่น การเพิ่มวัตถุประสงค์ใหม่ที่ต้องอาศัยความยินยอม เราจะแจ้งให้คุณทราบบนเว็บไซต์ และขอความยินยอมใหม่เมื่อจำเป็น
              </p>
              <p className="text-sm">ฉบับที่ {POLICY_VERSION} · มีผล {date}</p>
            </>
          ) : (
            <>
              <p>
                This notice explains how The KPI Plus collects, uses and shares your personal data when you visit thekpiplus.com, contact us through a form, email, phone, LINE or WhatsApp, or use the Partner Portal. It also explains your rights under Thailand’s Personal Data Protection Act B.E. 2562 (2019) (“PDPA”) and, where it applies to you, the EU or UK General Data Protection Regulation (“GDPR”).
              </p>
              <h2>1. Who we are and how to reach us</h2>
              <p>The data controller is {CONTROLLER.en}, trading as The KPI Plus (“we”, “us”).</p>
              <ContactBlock locale="en" />
              <p>
                Or use our{" "}
                <a href={contactHref} className="font-semibold text-[#0B6660]">
                  contact page
                </a>
                .
              </p>

              <h2>2. Personal data we collect</h2>
              <ul>
                <li>Contact details such as your name, email, phone number, hotel or company, job title, province, room count and preferred contact method.</li>
                <li>What you send us, such as messages, questions, project details and conversations on LINE or WhatsApp.</li>
                <li>Partner application details such as name, email, phone, territory, business type, and documents you upload in the Partner Portal, such as an ID card.</li>
                <li>Technical and usage data such as IP address, browser and device type, pages visited and cookie identifiers. Analytics data is collected only if you allow it.</li>
                <li>Cookie choices: the options you selected, when, and which version of the notice you saw.</li>
                <li>Client and billing data if you become a client, such as details in quotations, invoices and payments.</li>
              </ul>
              <p>
                We do not intend to collect sensitive data such as health information, religious beliefs or criminal records. Please do not include it in messages to us. If we receive it by mistake, we delete it once we no longer need it.
              </p>

              <h2>3. Where the data comes from</h2>
              <p>
                Directly from you when you fill in a form or contact us; from your device through cookies and similar technologies, according to your choices; and from platform providers such as aggregated reports from Google Analytics when you allow analytics cookies.
              </p>

              <h2>4. Why we use your data, and our legal basis</h2>
              <Table headers={["Purpose", "Legal basis"]} rows={purposeRows} />
              <p>
                If you do not give us information we need, such as a way to reply, we may not be able to answer you or provide our services. Declining analytics cookies does not affect the basic use of the website.
              </p>

              <h2>5. Cookies</h2>
              <p>
                Details of the cookies we use and how to change your settings are in our{" "}
                <a href={cookiesHref} className="font-semibold text-[#0B6660]">
                  Cookie Policy
                </a>
                . You can reopen the cookie settings from the “Cookie settings” link at the bottom of every page.
              </p>

              <h2>6. Who receives your data</h2>
              <p>We do not sell your personal data. We share only what is needed with:</p>
              <ul>
                <li>our website host and email provider, who process data on our instructions;</li>
                <li>The KPI Plus CRM, accessible only to authorised team users;</li>
                <li>Google (Google Analytics) only if you allow analytics cookies, and Google Maps if you choose to load the map;</li>
                <li>LY Corporation (LINE) and WhatsApp (Meta) when you choose to contact us through them — each has its own privacy policy;</li>
                <li>our auditors, accountants and legal advisers when needed;</li>
                <li>public authorities or courts where the law requires it or a lawful order is made.</li>
              </ul>

              <h2>7. International transfers</h2>
              <p>
                Some of these providers, including Google, may process or store data outside Thailand, including in the United States, where data protection standards may differ. We transfer data only where the PDPA (and GDPR, where it applies) allows it, relying on the provider’s safeguards.
              </p>

              <h2>8. How long we keep data</h2>
              <Table headers={["Data", "Retention"]} rows={retentionRows} />
              <p>After that, we delete or destroy the data or make it anonymous.</p>

              <h2>9. Security</h2>
              <p>
                We use appropriate organisational and technical measures to protect personal data against unauthorised access, use, alteration or disclosure, including HTTPS encryption, access limited to staff who need it, authentication on admin accounts, and encryption of partner identity documents. We review these measures regularly.
              </p>

              <h2>10. Your rights</h2>
              <p>Subject to the conditions set by law, you have the right to:</p>
              <ul>
                <li>access your personal data and receive a copy;</li>
                <li>receive or transfer your data in a machine-readable format;</li>
                <li>object to processing, including direct marketing;</li>
                <li>have your data deleted, destroyed or anonymised;</li>
                <li>restrict the use of your data;</li>
                <li>have inaccurate or incomplete data corrected;</li>
                <li>withdraw consent at any time, without affecting processing that took place before;</li>
                <li>complain to Thailand’s Office of the Personal Data Protection Committee (PDPC) — or, if GDPR applies to you, to the data protection authority where you live or work.</li>
              </ul>

              <h2>11. How to exercise your rights or withdraw consent</h2>
              <ul>
                <li>Cookies: click “Cookie settings” at the bottom of any page and switch off the categories you no longer want.</li>
                <li>
                  Other rights: send your request to {PRIVACY_CONTACT.email} or any channel in section 1, saying which right you want to use. We may ask for the minimum information needed to verify your identity.
                </li>
              </ul>
              <p>
                We respond without undue delay and within the time the law allows — generally no more than 30 days from receiving your request. If we cannot fulfil a request, we will tell you why.
              </p>

              <h2>12. Children</h2>
              <p>Our website and services are not directed at minors. If we learn that we hold a minor’s data without valid consent, we will delete it.</p>

              <h2>13. Changes to this notice</h2>
              <p>
                We may update this notice when our services, tools or the law change, and will show the update date at the top. For significant changes — for example a new purpose that needs consent — we will tell you on the website and ask for your consent again where required.
              </p>
              <p>If the Thai and English versions differ, the Thai version prevails.</p>
              <p className="text-sm">
                Version {POLICY_VERSION} · Effective {date}
              </p>
            </>
          )}
        </article>
      </section>
    </SiteShell>
  );
}
