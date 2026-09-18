"use client";
// New React root for /hub, replacing the dangerouslySetInnerHTML +
// runtime-<script>-injection approach in the legacy components/HubClient.tsx
// (kept in place, unreferenced, until the Phase 7 cutover moves it to
// _legacy/hub-vanilla/ alongside the vanilla JS it drove).
//
// Phase 1 scope only: typed data loading + the header shell + tab switching.
// Sidebar/grid/search/compare/detail-drawer land in later phases; the section
// panels below are intentionally empty placeholders that already carry the
// exact ids/classes the final markup needs, so later phases can fill them in
// without touching this file's structure.

import { useEffect, useState } from "react";
import type { CatalogStats } from "@/lib/catalogStats";
import type { HubSection } from "@/lib/hub/types";
import { STORAGE_KEYS } from "@/lib/hub/types";
import { useCatalogData } from "@/lib/hub/useCatalogData";
import HubHeader from "./HubHeader";

export interface HubClientProps {
  stats: CatalogStats;
}

export default function HubClient({ stats }: HubClientProps) {
  const [section, setSection] = useState<HubSection>("tools");
  const catalog = useCatalogData();

  // One-time resolve of the persisted section after mount (parity with the
  // legacy runtime, which only ever ran client-side and read this the same
  // way -- see main.js's closing IIFE). Deep-link (#tools/... / #tech/...)
  // resolution is added in the Phase 6 URL-sync work; this only restores the
  // last-used top-level tab.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.section);
      if (saved === "tools" || saved === "tech") setSection(saved);
    } catch {
      // localStorage unavailable (private mode, etc.) -- default stands.
    }
  }, []);

  useEffect(() => {
    if (section === "tech") catalog.ensureTech();
  }, [section, catalog]);

  const handleSectionChange = (next: HubSection) => {
    setSection(next);
    try {
      localStorage.setItem(STORAGE_KEYS.section, next);
    } catch {
      // ignore -- non-critical persistence
    }
  };

  return (
    <>
      <HubHeader
        section={section}
        onSectionChange={handleSectionChange}
        totalTools={stats.totalTools}
        totalTech={stats.totalTech}
        lastUpdatedLabel={stats.lastUpdatedLabel}
      />

      <main className="hub-main">
        <section
          id="tools-section"
          className={`hub-section sec-tools${section === "tools" ? " active" : ""}`}
          role="tabpanel"
          aria-labelledby="hub-tab-tools"
          hidden={section !== "tools"}
        >
          <a className="skip-link" href="#tools-main">Skip to tools</a>
          <div className="page-shell">
            <aside className="category-sidebar" aria-label="Categories and filters">
              <div className="sidebar-title">Categories</div>
              <p style={{ padding: 12, color: "var(--muted)", fontSize: 13 }}>
                {catalog.tools.loading ? "Loading catalog…" : `${stats.toolDepartmentCount} departments · ${stats.toolSubcategoryCount} categories`}
              </p>
            </aside>
            <section data-embedded-main="tools" id="tools-main">
              <div id="tools-content" style={{ padding: 24 }}>
                {catalog.tools.error && <p role="alert">Failed to load tools: {catalog.tools.error}</p>}
              </div>
            </section>
          </div>
        </section>

        <section
          id="tech-section"
          className={`hub-section sec-tech${section === "tech" ? " active" : ""}`}
          role="tabpanel"
          aria-labelledby="hub-tab-tech"
          hidden={section !== "tech"}
        >
          <a className="skip-link" href="#tech-main">Skip to tech stack</a>
          <div className="page-shell">
            <aside className="category-sidebar" aria-label="Categories">
              <div className="sidebar-title">Categories</div>
            </aside>
            <section data-embedded-main="tech" id="tech-main">
              <div id="tech-content" style={{ padding: 24 }}>
                {catalog.tech.loading && <p>Loading tech stack…</p>}
                {catalog.tech.error && <p role="alert">Failed to load tech: {catalog.tech.error}</p>}
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
