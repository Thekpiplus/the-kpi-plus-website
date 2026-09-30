import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { POLICY_VERSION, PRIVACY_CONTACT, formatPolicyDate, policyMeta } from "@/lib/privacy";
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

export function CookiePolicyView({ locale, route }: { locale: Locale; route: string }) {
  const lang = policyLocale(locale);
  const privacyHref = existingHref("/privacy", locale) ?? (lang === "th" ? "/privacy" : "/en/privacy");
  const date = formatPolicyDate(lang);
  const rows =
    lang === "th"
      ? [
          ["kpi_consent", "The KPI Plus", "จำเป็น", "จดจำตัวเลือกคุกกี้ของคุณ", "12 เดือน"],
          ["crm_session", "The KPI Plus", "จำเป็น", "เข้าสู่ระบบพื้นที่ทำงานของทีมและ Partner Portal", "ตามเซสชัน"],
          ["_ga", "Google Analytics", "การวิเคราะห์", "แยกแยะผู้เข้าชมเพื่อสถิติการใช้งาน", "2 ปี (อ้างอิง)"],
          ["_ga_<ID>", "Google Analytics", "การวิเคราะห์", "เก็บสถานะของเซสชัน", "2 ปี (อ้างอิง)"],
        ]
      : [
          ["kpi_consent", "The KPI Plus", "Necessary", "Remembers your cookie choices", "12 months"],
          ["crm_session", "The KPI Plus", "Necessary", "Keeps team workspace and Partner Portal sessions signed in", "Session"],
          ["_ga", "Google Analytics", "Analytics", "Distinguishes visitors for usage statistics", "2 years (reference)"],
          ["_ga_<ID>", "Google Analytics", "Analytics", "Keeps session state", "2 years (reference)"],
        ];

  return (
    <SiteShell locale={locale} route={route}>
      <PageHero>
        <p className="kpi-kicker text-[#F2F8E2]">{lang === "th" ? "นโยบายคุกกี้" : "Cookie Policy"}</p>
        <h1 className="kpi-h1 mt-5">{lang === "th" ? "นโยบายคุกกี้" : "Cookie Policy"}</h1>
        <p className="kpi-lead mt-5 text-white/72">{policyMeta(lang)}</p>
      </PageHero>
      <section className="kpi-section">
        <article className="kpi-policy mx-auto grid max-w-4xl gap-6 text-base leading-8 text-[#555555]">
          {lang === "th" ? (
            <>
              <h2>คุกกี้คืออะไร</h2>
              <p>
                คุกกี้คือไฟล์ข้อความขนาดเล็กที่เว็บไซต์บันทึกไว้ในเบราว์เซอร์ของคุณ นโยบายนี้ครอบคลุมเทคโนโลยีที่คล้ายกันด้วย เช่น local storage พิกเซล และแท็ก บางคุกกี้ตั้งโดยเราเอง (คุกกี้ของบุคคลที่หนึ่ง) และบางคุกกี้ตั้งโดยผู้ให้บริการอื่น เช่น Google (คุกกี้ของบุคคลที่สาม)
              </p>
              <h2>หมวดหมู่คุกกี้ที่เราใช้</h2>
              <ul>
                <li>
                  <strong>คุกกี้ที่จำเป็น</strong> ทำให้เว็บไซต์ทำงานได้ รักษาความปลอดภัย และจดจำตัวเลือกคุกกี้ของคุณ หมวดนี้ปิดไม่ได้เพราะเว็บไซต์ทำงานไม่ได้หากไม่มีคุกกี้เหล่านี้
                </li>
                <li>
                  <strong>คุกกี้เพื่อการวิเคราะห์</strong> ช่วยให้เราเข้าใจว่าผู้เข้าชมใช้เว็บไซต์อย่างไร เช่น หน้าที่ได้รับความนิยม เพื่อปรับปรุงเว็บไซต์ ทำงานเมื่อคุณอนุญาตเท่านั้น ผ่าน Google Analytics
                </li>
              </ul>
              <p>เว็บไซต์นี้ยังไม่ได้ติดตั้งแท็กโฆษณาของ Google Ads หรือ Meta Pixel ในโค้ด หากเพิ่มในภายหลัง เราจะขอความยินยอมหมวดการตลาดก่อนใช้งาน</p>
              <h2>รายการคุกกี้</h2>
              <Table headers={["ชื่อ", "ผู้ให้บริการ", "หมวด", "วัตถุประสงค์", "อายุ"]} rows={rows} />
              <p>ผู้ให้บริการภายนอกอาจเปลี่ยนชื่อหรืออายุของคุกกี้ เราจะทบทวนรายการนี้ทุก 6 เดือน และทุกครั้งที่เพิ่มเครื่องมือใหม่</p>
              <h2>เนื้อหาจากภายนอก</h2>
              <p>หน้าติดต่อเรามีแผนที่ Google Maps แผนที่จะแสดงหลังจากคุณคลิกเพื่อโหลดเท่านั้น เพราะผู้ให้บริการอาจตั้งคุกกี้ของตนเอง</p>
              <h2>วิธีจัดการคุกกี้</h2>
              <ul>
                <li>คลิก “ตั้งค่าคุกกี้” ด้านล่างของทุกหน้า เพื่อเปลี่ยนตัวเลือกหรือถอนความยินยอมได้ทุกเมื่อ เมื่อถอนความยินยอม เราจะหยุดใช้คุกกี้หมวดนั้นและลบคุกกี้ที่เราลบได้จากเบราว์เซอร์ของคุณ</li>
                <li>ตั้งค่าเบราว์เซอร์ให้บล็อกหรือลบคุกกี้ได้ แต่บางส่วนของเว็บไซต์อาจทำงานไม่สมบูรณ์</li>
                <li>
                  ดูวิธีที่ Google ใช้ข้อมูลจากเว็บไซต์ที่ใช้บริการของ Google ได้ที่{" "}
                  <a href="https://policies.google.com/technologies/partner-sites" className="font-semibold text-[#0B6660]">
                    policies.google.com/technologies/partner-sites
                  </a>
                </li>
              </ul>
              <p>
                ข้อมูลเพิ่มเติมเกี่ยวกับการใช้ข้อมูลส่วนบุคคลและสิทธิของคุณอยู่ใน{" "}
                <a href={privacyHref} className="font-semibold text-[#0B6660]">
                  นโยบายความเป็นส่วนตัว
                </a>
                หากมีคำถาม ติดต่อ {PRIVACY_CONTACT.email}
              </p>
              <p className="text-sm">
                ฉบับที่ {POLICY_VERSION} · มีผล {date}
              </p>
            </>
          ) : (
            <>
              <h2>What cookies are</h2>
              <p>
                Cookies are small text files a website stores in your browser. This policy also covers similar technologies such as local storage, pixels and tags. Some are set by us (first-party cookies) and some by other companies such as Google (third-party cookies).
              </p>
              <h2>The categories we use</h2>
              <ul>
                <li>
                  <strong>Necessary</strong> — keep the site working and secure, and remember your cookie choices. These cannot be switched off because the site does not work without them.
                </li>
                <li>
                  <strong>Analytics</strong> — help us understand how visitors use the site, for example which pages are popular, so we can improve it. Used only if you allow them, through Google Analytics.
                </li>
              </ul>
              <p>This website does not currently load Google Ads or Meta Pixel tags in code. If we add them later, we will ask for marketing consent before they run.</p>
              <h2>Cookie list</h2>
              <Table headers={["Name", "Provider", "Category", "Purpose", "Duration"]} rows={rows} />
              <p>Third parties may change cookie names or durations. We review this list every 6 months and whenever we add a tool.</p>
              <h2>Embedded content</h2>
              <p>The contact page includes a Google Maps embed. The map loads only after you click to show it, because that provider may set its own cookies.</p>
              <h2>Managing cookies</h2>
              <ul>
                <li>Click “Cookie settings” at the bottom of any page to change your choices or withdraw consent at any time. When you withdraw, we stop using that category and delete the cookies we are able to remove from your browser.</li>
                <li>You can also block or delete cookies in your browser settings, although parts of the site may not work fully.</li>
                <li>
                  See how Google uses information from sites that use its services at{" "}
                  <a href="https://policies.google.com/technologies/partner-sites" className="font-semibold text-[#0B6660]">
                    policies.google.com/technologies/partner-sites
                  </a>
                  .
                </li>
              </ul>
              <p>
                For how we use personal data and your rights, see our{" "}
                <a href={privacyHref} className="font-semibold text-[#0B6660]">
                  Privacy Notice
                </a>
                . Questions: {PRIVACY_CONTACT.email}.
              </p>
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
