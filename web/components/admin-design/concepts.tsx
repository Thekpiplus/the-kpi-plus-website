import { NAV, TOP_SECTIONS } from "./data";
import {
  ActivityList,
  BrandMark,
  DataTable,
  FilterBar,
  QuickActionsRow,
  SectionHeader,
  StatsRow,
  Topbar,
} from "./shared";

function groupedNav() {
  const groups = new Map<string, typeof NAV>();
  for (const item of NAV) {
    const key = item.section || "General";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

/** Atlas — Left Sidebar Classic */
export function ConceptAtlas({ view }: { view: "dashboard" | "leads" | "empty" }) {
  return (
    <div className="ad-frame ad-atlas">
      <aside className="ad-sidebar">
        <BrandMark />
        <nav className="ad-side-nav" aria-label="Primary">
          {groupedNav().map(([section, items]) => (
            <div key={section} className="ad-nav-group">
              <p className="ad-nav-section">{section}</p>
              {items.map((item) => (
                <div key={item.id}>
                  <a className={`ad-nav-link${item.id === (view === "dashboard" ? "dashboard" : "leads") ? " is-active" : ""}`} href="#atlas">
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </a>
                  {item.children && item.id === "leads" ? (
                    <div className="ad-nav-children">
                      {item.children.map((child) => (
                        <a key={child.id} href="#atlas" className={child.id === "leads-inbox" ? "is-active" : undefined}>
                          {child.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <p className="ad-side-note">Collapse on tablet · Drawer on mobile</p>
      </aside>
      <div className="ad-main">
        <Topbar title={view === "dashboard" ? "Dashboard" : "Leads"} />
        <div className="ad-content">
          {view === "dashboard" ? (
            <>
              <StatsRow />
              <div className="ad-grid-2">
                <section className="ad-panel">
                  <SectionHeader title="Quick actions" lead="งานที่ใช้บ่อยในหนึ่งคลิก" />
                  <QuickActionsRow />
                </section>
                <section className="ad-panel">
                  <SectionHeader title="Recent activity" lead="สิ่งที่เพิ่งอัปเดตในระบบ" />
                  <ActivityList />
                </section>
              </div>
              <section className="ad-panel">
                <SectionHeader
                  title="Leads needing attention"
                  lead="รายการที่ควรติดตามวันนี้"
                  action={
                    <button type="button" className="ad-btn-primary">
                      Add lead
                    </button>
                  }
                />
                <FilterBar />
                <DataTable variant="leads" />
              </section>
            </>
          ) : (
            <section className="ad-panel">
              <SectionHeader
                title="Lead inbox"
                lead="Contact requests และลีดจากทุกช่องทาง"
                action={
                  <button type="button" className="ad-btn-primary">
                    Add lead
                  </button>
                }
              />
              <FilterBar />
              <DataTable variant={view === "empty" ? "empty" : "leads"} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/** Pulse — Slim Sidebar + Content Focus */
export function ConceptPulse({ view }: { view: "dashboard" | "leads" | "empty" }) {
  return (
    <div className="ad-frame ad-pulse">
      <aside className="ad-slim-side">
        <BrandMark compact />
        <nav aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.id}
              href="#pulse"
              className={`ad-slim-link${item.id === (view === "dashboard" ? "dashboard" : "leads") ? " is-active" : ""}`}
              title={item.label}
            >
              <span aria-hidden="true">{item.icon}</span>
              <em>{item.label}</em>
            </a>
          ))}
        </nav>
      </aside>
      <div className="ad-main">
        <Topbar title={view === "dashboard" ? "Command center" : "Lead operations"} dense />
        <div className="ad-content ad-content-wide">
          {view === "dashboard" ? (
            <>
              <div className="ad-pulse-hero">
                <div>
                  <p className="ad-kicker">Daily focus</p>
                  <h2 className="ad-display">9 follow-ups · 28 new leads</h2>
                  <p className="ad-muted">พื้นที่ content กว้างขึ้นเพื่ออ่านตารางและรายละเอียดได้เร็ว</p>
                </div>
                <div className="ad-pulse-cta">
                  <button type="button" className="ad-btn-primary">
                    Start today&apos;s queue
                  </button>
                  <button type="button" className="ad-btn-secondary">
                    New article
                  </button>
                </div>
              </div>
              <StatsRow />
              <section className="ad-panel">
                <SectionHeader title="Priority leads" lead="ตารางเป็นศูนย์กลางการทำงาน" />
                <FilterBar />
                <DataTable variant="leads" />
              </section>
              <div className="ad-grid-2">
                <section className="ad-panel">
                  <SectionHeader title="Articles in motion" />
                  <DataTable variant="articles" />
                </section>
                <section className="ad-panel">
                  <SectionHeader title="Activity" />
                  <ActivityList />
                </section>
              </div>
            </>
          ) : (
            <section className="ad-panel">
              <SectionHeader title="Leads" lead="Full-width list for daily ops" action={<button type="button" className="ad-btn-primary">Add lead</button>} />
              <FilterBar />
              <DataTable variant={view === "empty" ? "empty" : "leads"} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/** Harbor — Top Navigation + Section Sidebar */
export function ConceptHarbor({ view }: { view: "dashboard" | "leads" | "empty" }) {
  const sectionItems =
    view === "dashboard"
      ? NAV.filter((item) => item.section === "Overview" || item.id === "dashboard")
      : NAV.find((item) => item.id === "leads")?.children ?? [];

  return (
    <div className="ad-frame ad-harbor">
      <header className="ad-harbor-top">
        <BrandMark />
        <nav className="ad-top-nav" aria-label="Domains">
          {TOP_SECTIONS.map((section) => (
            <a
              key={section.id}
              href="#harbor"
              className={
                section.id === (view === "dashboard" ? "overview" : "pipeline") ? "is-active" : undefined
              }
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="ad-topbar-tools">
          <label className="ad-top-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search…" />
          </label>
          <div className="ad-profile">
            <span className="ad-avatar">IK</span>
          </div>
        </div>
      </header>
      <div className="ad-harbor-body">
        <aside className="ad-section-side">
          <p className="ad-nav-section">{view === "dashboard" ? "Overview" : "Pipeline"}</p>
          <nav aria-label="Section">
            {view === "dashboard" ? (
              <>
                <a href="#harbor" className="ad-nav-link is-active">
                  Dashboard
                </a>
                <a href="#harbor" className="ad-nav-link">
                  Snapshots
                </a>
                <a href="#harbor" className="ad-nav-link">
                  Alerts
                </a>
              </>
            ) : (
              sectionItems.map((item, index) => (
                <a key={item.id} href="#harbor" className={`ad-nav-link${index === 0 ? " is-active" : ""}`}>
                  {item.label}
                </a>
              ))
            )}
          </nav>
        </aside>
        <div className="ad-content">
          {view === "dashboard" ? (
            <>
              <SectionHeader title="Website & commercial overview" lead="เมนูหลักอยู่บน — เมนูย่อยตามหมวดด้านซ้าย" />
              <StatsRow />
              <div className="ad-grid-2">
                <section className="ad-panel">
                  <SectionHeader title="Pipeline snapshot" />
                  <DataTable variant="leads" />
                </section>
                <section className="ad-panel">
                  <SectionHeader title="Content snapshot" />
                  <DataTable variant="articles" />
                  <div className="ad-spacer" />
                  <SectionHeader title="Quick actions" />
                  <QuickActionsRow />
                </section>
              </div>
            </>
          ) : (
            <section className="ad-panel">
              <SectionHeader title="Pipeline · Inbox" lead="หมวด Pipeline ถูกเลือกจาก top nav" action={<button type="button" className="ad-btn-primary">Add lead</button>} />
              <FilterBar />
              <DataTable variant={view === "empty" ? "empty" : "leads"} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/** Mosaic — Modular Workspace */
export function ConceptMosaic({ view }: { view: "dashboard" | "leads" | "empty" }) {
  return (
    <div className="ad-frame ad-mosaic">
      <Topbar title="Workspace" />
      <div className="ad-mosaic-shell">
        <aside className="ad-mosaic-rail">
          <BrandMark compact />
          {NAV.slice(0, 6).map((item) => (
            <a
              key={item.id}
              href="#mosaic"
              className={`ad-rail-link${item.id === (view === "dashboard" ? "dashboard" : "leads") ? " is-active" : ""}`}
              title={item.label}
            >
              <span aria-hidden="true">{item.icon}</span>
            </a>
          ))}
        </aside>
        <div className="ad-content ad-mosaic-content">
          {view === "dashboard" ? (
            <>
              <div className="ad-mosaic-banner">
                <div>
                  <p className="ad-kicker">Modular workspace</p>
                  <h2 className="ad-display">Monitor leads, content, and SEO in one board</h2>
                </div>
                <button type="button" className="ad-btn-primary">
                  Customize widgets
                </button>
              </div>
              <div className="ad-mosaic-grid">
                <section className="ad-panel ad-span-2">
                  <SectionHeader title="Performance widgets" />
                  <StatsRow />
                </section>
                <section className="ad-panel">
                  <SectionHeader title="Quick actions" />
                  <QuickActionsRow />
                </section>
                <section className="ad-panel ad-span-2">
                  <SectionHeader title="Live leads" action={<button type="button" className="ad-btn-secondary">Open inbox</button>} />
                  <DataTable variant="leads" />
                </section>
                <section className="ad-panel">
                  <SectionHeader title="Recent activity" />
                  <ActivityList />
                </section>
                <section className="ad-panel ad-span-2">
                  <SectionHeader title="Content board" />
                  <DataTable variant="articles" />
                </section>
                <section className="ad-panel">
                  <SectionHeader title="Empty lane example" />
                  <DataTable variant="empty" />
                </section>
              </div>
            </>
          ) : (
            <section className="ad-panel">
              <SectionHeader title="Leads module" lead="เปิดจาก rail แล้วขยายเป็น full panel" action={<button type="button" className="ad-btn-primary">Add lead</button>} />
              <FilterBar />
              <DataTable variant={view === "empty" ? "empty" : "leads"} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
