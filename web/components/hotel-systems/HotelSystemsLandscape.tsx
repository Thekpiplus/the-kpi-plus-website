import type { CmsSystemsCategory, CmsSystemsConnection, CmsSystemsService } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_LANDSCAPE_CATEGORIES,
  SYSTEMS_LANDSCAPE_CONNECTIONS,
  SYSTEMS_LANDSCAPE_FIELDS,
  SYSTEMS_LANDSCAPE_LEGEND,
  SYSTEMS_LANDSCAPE_NOTE,
  SYSTEMS_LANDSCAPE_PATH,
  SYSTEMS_SERVICES_VISUAL,
  systemsLandscapeStatus,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function nodeCopy(item: CmsSystemsService, thai: boolean, sample: boolean) {
  const raw = String(item.status || "not_configured");
  const status = systemsLandscapeStatus(sample && raw === "connected" && !item.verified ? "not_configured" : raw);
  return {
    title: thai ? item.titleTh || item.titleEn : item.titleEn || item.titleTh,
    role: thai ? item.roleTh || item.actionTh || item.roleEn : item.roleEn || item.actionEn || item.roleTh,
    dataIn: thai ? item.inputTh || item.inputEn : item.inputEn || item.inputTh,
    dataOut: thai ? item.dataOutTh || item.dataOutEn || item.output : item.dataOutEn || item.output || item.dataOutTh,
    sourceOfTruth: thai ? item.sourceOfTruthTh || item.sourceOfTruthEn : item.sourceOfTruthEn || item.sourceOfTruthTh,
    owner: thai ? item.ownerTh || item.ownerEn : item.ownerEn || item.ownerTh,
    provider: thai ? item.providerTh || item.approvalTh || item.providerEn : item.providerEn || item.approvalEn || item.providerTh,
    connector: thai ? item.connectorTh || item.connectorEn : item.connectorEn || item.connectorTh,
    status,
  };
}

function LandscapeNode({
  item,
  thai,
  area,
  fields,
}: {
  item?: CmsSystemsService;
  thai: boolean;
  area: string;
  fields: typeof SYSTEMS_LANDSCAPE_FIELDS;
}) {
  if (!item) return null;
  const copy = nodeCopy(item, thai, true);
  const facts = [
    { key: "role", label: thai ? fields.role.th : fields.role.en, value: copy.role },
    { key: "dataIn", label: thai ? fields.dataIn.th : fields.dataIn.en, value: copy.dataIn },
    { key: "dataOut", label: thai ? fields.dataOut.th : fields.dataOut.en, value: copy.dataOut },
    { key: "sourceOfTruth", label: thai ? fields.sourceOfTruth.th : fields.sourceOfTruth.en, value: copy.sourceOfTruth },
    { key: "owner", label: thai ? fields.owner.th : fields.owner.en, value: copy.owner },
    { key: "status", label: thai ? fields.status.th : fields.status.en, value: copy.status.label, latin: true },
    { key: "provider", label: thai ? fields.provider.th : fields.provider.en, value: copy.provider },
  ];
  return (
    <article className={`hsi-landscape-node is-${copy.status.tone}`} style={{ gridArea: area }}>
      <p className="hsi-landscape-node-name kpi-latin">{copy.title}</p>
      <em className={`hsi-status is-${copy.status.tone} kpi-latin`}>{copy.status.label}</em>
      <dl className="hsi-landscape-facts">
        {facts.map((fact) => (
          <div key={fact.key}>
            <dt className="kpi-latin">{fact.label}</dt>
            <dd className={fact.latin ? "kpi-latin" : undefined}>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function HotelSystemsLandscape({
  locale,
  src,
  alt,
  status,
  label,
  caption,
  note,
  nodes,
  categories,
  connections,
  pathLabel,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  label?: string;
  caption?: string;
  note?: string;
  nodes: CmsSystemsService[];
  categories?: CmsSystemsCategory[];
  connections?: CmsSystemsConnection[];
  pathLabel?: string;
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const byId = Object.fromEntries(nodes.map((item) => [item.id, item]));
  const fields = SYSTEMS_LANDSCAPE_FIELDS;
  const displayLabel = label?.trim() || (thai ? SYSTEMS_SERVICES_VISUAL.labelTh : SYSTEMS_SERVICES_VISUAL.labelEn);
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_SERVICES_VISUAL.captionTh : SYSTEMS_SERVICES_VISUAL.captionEn);
  const displayNote = note?.trim() || (thai ? SYSTEMS_LANDSCAPE_NOTE.th : SYSTEMS_LANDSCAPE_NOTE.en);
  const displayPath = pathLabel?.trim() || (thai ? SYSTEMS_LANDSCAPE_PATH.th : SYSTEMS_LANDSCAPE_PATH.en);
  const displayAlt = alt?.trim() || (thai ? SYSTEMS_SERVICES_VISUAL.altTh : SYSTEMS_SERVICES_VISUAL.altEn);
  const cats = categories?.length ? categories : SYSTEMS_LANDSCAPE_CATEGORIES.map((item) => ({ id: item.id, th: item.th, en: item.en }));
  const links = connections?.length
    ? connections
    : SYSTEMS_LANDSCAPE_CONNECTIONS.map((item) => ({ id: item.id, from: item.from, to: item.to, labelTh: item.labelTh, labelEn: item.labelEn }));

  return (
    <div className="hsi-landscape">
      <figure className="hsi-landscape-figure">
        {fileSrc ? (
          <div className="hsi-landscape-photo">
            <img
              src={fileSrc}
              alt={displayAlt}
              width={SYSTEMS_SERVICES_VISUAL.displayWidth}
              height={SYSTEMS_SERVICES_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_SERVICES_VISUAL.displayWidth} / ${SYSTEMS_SERVICES_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Hotel Systems Landscape — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-landscape-board" role="img" aria-label={displayAlt}>
            {sample ? <span className="hsi-visual-badge">Hotel Systems Landscape — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">{displayPath}</p>
            <div className="hsi-landscape-flow">
              <LandscapeNode item={byId.guest} thai={thai} area="guest" fields={fields} />
              <span className="hsi-landscape-arrow" style={{ gridArea: "a1" }} aria-hidden="true">
                ↓
              </span>
              <LandscapeNode item={byId.website} thai={thai} area="web" fields={fields} />
              <span className="hsi-landscape-arrow" style={{ gridArea: "a2" }} aria-hidden="true">
                ↓
              </span>
              <LandscapeNode item={byId.pms} thai={thai} area="pms" fields={fields} />
              <span className="hsi-landscape-arrow" style={{ gridArea: "a3" }} aria-hidden="true">
                ↓
              </span>
              <LandscapeNode item={byId.cm} thai={thai} area="cm" fields={fields} />
              <div className="hsi-landscape-fork" style={{ gridArea: "fork" }} aria-hidden="true">
                <svg className="hsi-landscape-fork-svg" viewBox="0 0 200 36" preserveAspectRatio="none">
                  <path d="M100 2 V14 M100 14 L24 34 M100 14 L176 34" fill="none" stroke="#A2DC25" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span>↙</span>
                <span>↘</span>
              </div>
              <LandscapeNode item={byId.ota} thai={thai} area="ota" fields={fields} />
              <LandscapeNode item={byId.reporting} thai={thai} area="reporting" fields={fields} />
              <span className="hsi-landscape-arrow" style={{ gridArea: "a5" }} aria-hidden="true">
                ↓
              </span>
              <LandscapeNode item={byId.team} thai={thai} area="team" fields={fields} />
            </div>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_SERVICES_VISUAL.metaTh : SYSTEMS_SERVICES_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <p className="hsi-landscape-cats-label kpi-latin">{thai ? "หมวดข้อมูลตัวอย่าง" : "Example data categories"}</p>
      <ul className="hsi-landscape-cats">
        {cats.map((item) => (
          <li key={item.id}>{thai ? item.th || item.en : item.en || item.th}</li>
        ))}
      </ul>
      <p className="hsi-landscape-cats-label kpi-latin">{thai ? "เส้นเชื่อมตัวอย่าง" : "Sample connections"}</p>
      <ul className="hsi-landscape-links">
        {links.map((item) => {
          const from = byId[item.from];
          const to = byId[item.to];
          const fromTitle = from ? (thai ? from.titleTh || from.titleEn : from.titleEn || from.titleTh) : item.from;
          const toTitle = to ? (thai ? to.titleTh || to.titleEn : to.titleEn || to.titleTh) : item.to;
          const linkLabel = thai ? item.labelTh || item.labelEn : item.labelEn || item.labelTh;
          return (
            <li key={item.id}>
              <span className="kpi-latin">{fromTitle}</span>
              <span aria-hidden="true"> → </span>
              <span className="kpi-latin">{toTitle}</span>
              {linkLabel ? <em>{linkLabel}</em> : null}
            </li>
          );
        })}
      </ul>

      <ul className="hsi-landscape-legend" aria-label={thai ? "คำอธิบายสถานะตัวอย่าง ไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว" : "Sample status legend. Not a verified integration status."}>
        {SYSTEMS_LANDSCAPE_LEGEND.map((item) => (
          <li key={item.id}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="hsi-landscape-table-wrap">
        <table className="hsi-landscape-table">
          <caption className="sr-only">
            {thai
              ? "ตารางตัวอย่างบทบาท ข้อมูลเข้า ข้อมูลออก Source of Truth ผู้รับผิดชอบ สถานะ การพึ่งพาผู้ให้บริการ และ Connector / API ของแต่ละระบบ ไม่ใช่สถานะโรงแรมจริง"
              : "Sample table of role, data in, data out, source of truth, owner, integration status, provider dependency, and connector or API for each system. Not a live hotel status."}
          </caption>
          <thead>
            <tr>
              <th scope="col">{thai ? "ระบบ" : "System"}</th>
              <th scope="col">{thai ? fields.role.th : fields.role.en}</th>
              <th scope="col">{thai ? fields.dataIn.th : fields.dataIn.en}</th>
              <th scope="col">{thai ? fields.dataOut.th : fields.dataOut.en}</th>
              <th scope="col">{thai ? fields.sourceOfTruth.th : fields.sourceOfTruth.en}</th>
              <th scope="col">{thai ? fields.owner.th : fields.owner.en}</th>
              <th scope="col">{thai ? fields.status.th : fields.status.en}</th>
              <th scope="col">{thai ? fields.provider.th : fields.provider.en}</th>
              <th scope="col">{thai ? fields.connector.th : fields.connector.en}</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((item) => {
              const copy = nodeCopy(item, thai, sample);
              return (
                <tr key={item.id}>
                  <th scope="row">
                    <span className="kpi-latin">{copy.title}</span>
                  </th>
                  <td data-label={thai ? fields.role.th : fields.role.en}>{copy.role}</td>
                  <td data-label={thai ? fields.dataIn.th : fields.dataIn.en}>{copy.dataIn}</td>
                  <td data-label={thai ? fields.dataOut.th : fields.dataOut.en}>{copy.dataOut}</td>
                  <td data-label={thai ? fields.sourceOfTruth.th : fields.sourceOfTruth.en}>{copy.sourceOfTruth}</td>
                  <td data-label={thai ? fields.owner.th : fields.owner.en}>{copy.owner}</td>
                  <td data-label={thai ? fields.status.th : fields.status.en}>
                    <em className={`hsi-status is-${copy.status.tone} kpi-latin`}>{copy.status.label}</em>
                  </td>
                  <td data-label={thai ? fields.provider.th : fields.provider.en}>{copy.provider}</td>
                  <td data-label={thai ? fields.connector.th : fields.connector.en}>{copy.connector}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="hsi-landscape-note kpi-latin">{displayNote}</p>
    </div>
  );
}
