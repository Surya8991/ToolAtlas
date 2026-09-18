"use client";
// React port of the <header class="hub-header"> block in lib/hubMarkup.ts.
// Reuses the exact hub.css class names (hub-header, hub-topline, hub-nav-btn,
// ...) so the rebuild is a visual no-op. Behavior beyond the tab switch itself
// (search palette open, help popover) lands in later phases; the search
// trigger is rendered now for layout parity but its onOpenSearch is a no-op
// until Phase 4 wires GlobalSearch.

import { useState } from "react";
import type { HubSection } from "@/lib/hub/types";

export interface HubHeaderProps {
  section: HubSection;
  onSectionChange: (section: HubSection) => void;
  totalTools: number;
  totalTech: number;
  lastUpdatedLabel: string;
  onOpenSearch?: () => void;
}

export default function HubHeader({
  section,
  onSectionChange,
  totalTools,
  totalTech,
  lastUpdatedLabel,
  onOpenSearch,
}: HubHeaderProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const totalItems = totalTools + totalTech;

  return (
    <header className="hub-header">
      <div className="hub-topline">
        <a className="hub-brand" href="/" aria-label="Back to ToolAtlas home">
          <span className="hub-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
              <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
            </svg>
          </span>
          <div className="hub-brand-copy">
            <span className="hub-brand-text">ToolAtlas</span>
            <span className="hub-brand-subtext">AI tools + developer technologies</span>
          </div>
        </a>

        <nav className="hub-nav" role="tablist" aria-label="Main navigation">
          <button
            className={`hub-nav-btn${section === "tools" ? " active" : ""}`}
            type="button"
            role="tab"
            id="hub-tab-tools"
            aria-selected={section === "tools"}
            aria-controls="tools-section"
            tabIndex={section === "tools" ? 0 : -1}
            onClick={() => onSectionChange("tools")}
          >
            <span className="hub-nav-icon" aria-hidden="true">🤖</span>
            <span className="hub-nav-label">AI Tools</span>
            <span className="hub-nav-count" id="hub-count-tools">{totalTools.toLocaleString()}</span>
          </button>
          <button
            className={`hub-nav-btn${section === "tech" ? " active" : ""}`}
            type="button"
            role="tab"
            id="hub-tab-tech"
            aria-selected={section === "tech"}
            aria-controls="tech-section"
            tabIndex={section === "tech" ? 0 : -1}
            onClick={() => onSectionChange("tech")}
          >
            <span className="hub-nav-icon" aria-hidden="true">🛠</span>
            <span className="hub-nav-label">Tech Stack</span>
            <span className="hub-nav-count" id="hub-count-tech">{totalTech.toLocaleString()}</span>
          </button>
        </nav>

        <button
          type="button"
          className="hub-search-trigger"
          id="hub-search-trigger"
          aria-label="Search all tools and technologies"
          aria-keyshortcuts="Control+K Meta+K"
          onClick={onOpenSearch}
        >
          <svg className="hub-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search tools &amp; tech…</span>
          <span className="hub-search-trigger-kbd" aria-hidden="true"><kbd>Ctrl</kbd><kbd>K</kbd></span>
        </button>

        <div className="hub-meta">
          <a href="/" className="hub-home-link" aria-label="Home">← Home</a>
          <span className="hub-total-meta" id="hub-total-meta" data-updated={lastUpdatedLabel}>
            {totalItems.toLocaleString()} items · Updated {lastUpdatedLabel}
          </span>
          <span className="hub-result-chip" id="hub-result-chip" hidden />
          <button
            type="button"
            className="hub-help"
            id="hub-help-btn"
            aria-label="Keyboard shortcuts"
            aria-expanded={helpOpen}
            aria-controls="hub-help-popover"
            onClick={() => setHelpOpen((v) => !v)}
          >
            <kbd>?</kbd>
          </button>
          <div className="hub-help-popover" id="hub-help-popover" role="dialog" aria-label="Keyboard shortcuts" hidden={!helpOpen}>
            <div className="hub-help-row"><span>Switch to AI Tools</span><kbd>1</kbd></div>
            <div className="hub-help-row"><span>Switch to Tech Stack</span><kbd>2</kbd></div>
            <div className="hub-help-row"><span>Focus search</span><kbd>/</kbd></div>
            <div className="hub-help-row"><span>Command search</span><kbd>Ctrl</kbd><kbd>K</kbd></div>
            <div className="hub-help-row"><span>Close / dismiss</span><kbd>Esc</kbd></div>
          </div>
        </div>
      </div>
    </header>
  );
}
