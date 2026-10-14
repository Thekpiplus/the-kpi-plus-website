"use client";

import { useState } from "react";
import { CONCEPTS, type ConceptId } from "./data";
import { ConceptAtlas, ConceptHarbor, ConceptMosaic, ConceptPulse } from "./concepts";

type View = "dashboard" | "leads" | "empty";

export function DesignLab() {
  const [concept, setConcept] = useState<ConceptId>("atlas");
  const [view, setView] = useState<View>("dashboard");
  const active = CONCEPTS.find((item) => item.id === concept) ?? CONCEPTS[0];

  return (
    <div className="ad-lab">
      <header className="ad-lab-intro">
        <h1>KPI Plus Admin Design Lab</h1>
        <p>
          4 layout concepts ในแบรนด์เดียวกัน — Navy / Lime / clean SaaS — สำหรับระบบ hotel commercial,
          content, website และ SEO admin
        </p>

        <div className="ad-concept-switch" role="tablist" aria-label="Design concepts">
          {CONCEPTS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={concept === item.id}
              className={`ad-concept-card${concept === item.id ? " is-active" : ""}`}
              onClick={() => setConcept(item.id)}
            >
              <strong>{item.name}</strong>
              <span>{item.subtitle}</span>
            </button>
          ))}
        </div>

        <div className="ad-view-switch" aria-label="Preview screen">
          {(
            [
              ["dashboard", "Dashboard"],
              ["leads", "Leads list"],
              ["empty", "Empty state"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={view === id ? "is-active" : undefined}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <section className="ad-stage" aria-label={`${active.name} prototype`}>
        <div className="ad-stage-meta">
          <div>
            <h2>
              {active.name} · {active.subtitle}
            </h2>
            <p>{active.bestFor}</p>
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#7a8178", fontSize: "0.85rem" }}>
            {active.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </div>

        {concept === "atlas" ? <ConceptAtlas view={view} /> : null}
        {concept === "pulse" ? <ConceptPulse view={view} /> : null}
        {concept === "harbor" ? <ConceptHarbor view={view} /> : null}
        {concept === "mosaic" ? <ConceptMosaic view={view} /> : null}
      </section>

      <section className="ad-rec">
        <h2>Recommendation</h2>
        <ol>
          <li>
            <strong>เลือกหลัก: Harbor (Top Nav + Section Sidebar)</strong> — ตรงกับงานจริงของ KPI Plus ที่แยก
            Pipeline / Website / Workspace ชัด และรองรับ content + SEO ได้ไม่ทำให้ sidebar ยาวเกิน
          </li>
          <li>
            <strong>Dashboard แบบ hybrid จาก Mosaic</strong> — ใช้ widget / quick actions / activity บนหน้าแรก
            แล้วเมื่อเข้าหมวดงานให้ใช้ Harbor navigation
          </li>
          <li>
            <strong>List pages ยึด Pulse spacing</strong> — ตารางกว้าง อ่านง่าย สำหรับทีมที่ทำงานทุกวัน
          </li>
        </ol>
        <ul>
          <li>Mobile: top domains เป็น tabs, section menu เป็น horizontal chips, primary nav เป็น bottom/drawer</li>
          <li>Tablet: sidebar ยุบเป็น icon rail (แบบ Pulse)</li>
          <li>Desktop: Harbor full pattern + Mosaic widgets on home</li>
        </ul>
      </section>
    </div>
  );
}
