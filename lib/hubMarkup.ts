// AUTO-GENERATED from hub.html: the proven hub markup, injected by app/hub/page.tsx.
// Controllers query these element IDs at runtime; do not rename IDs.
export const HUB_MARKUP = `<header class="hub-header">
    <div class="hub-topline">
      <a class="hub-brand" href="/" aria-label="Back to ToolAtlas home">
        <span class="hub-brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z"/></svg>
        </span>
        <div class="hub-brand-copy">
          <span class="hub-brand-text">ToolAtlas</span>
          <span class="hub-brand-subtext">AI tools + developer technologies</span>
        </div>
      </a>

      <nav class="hub-nav" role="tablist" aria-label="Main navigation">
        <button class="hub-nav-btn active" data-target="tools" type="button" role="tab" id="hub-tab-tools" aria-selected="true" aria-controls="tools-section" tabindex="0">
          <span class="hub-nav-icon" aria-hidden="true">🤖</span>
          <span class="hub-nav-label">AI Tools</span>
          <span class="hub-nav-count" id="hub-count-tools" aria-label="2386 AI tools">2,386</span>
        </button>
        <button class="hub-nav-btn" data-target="tech" type="button" role="tab" id="hub-tab-tech" aria-selected="false" aria-controls="tech-section" tabindex="-1">
          <span class="hub-nav-icon" aria-hidden="true">🛠</span>
          <span class="hub-nav-label">Tech Stack</span>
          <span class="hub-nav-count" id="hub-count-tech" aria-label="1861 tech items">1,861</span>
        </button>
      </nav>

      <button type="button" class="hub-search-trigger" id="hub-search-trigger" aria-label="Search all tools and technologies" aria-keyshortcuts="Control+K Meta+K">
        <svg class="hub-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <span>Search tools &amp; tech…</span>
        <span class="hub-search-trigger-kbd" aria-hidden="true"><kbd>Ctrl</kbd><kbd>K</kbd></span>
      </button>

      <div class="hub-meta">
        <a href="/" class="hub-home-link" aria-label="Home">← Home</a>
        <span class="hub-total-meta" id="hub-total-meta">4,247 items · Updated May 2026</span>
        <span class="hub-result-chip" id="hub-result-chip" hidden></span>
        <button type="button" class="hub-help" id="hub-help-btn" aria-label="Keyboard shortcuts" aria-expanded="false" aria-controls="hub-help-popover">
          <kbd>?</kbd>
        </button>
        <div class="hub-help-popover" id="hub-help-popover" role="dialog" aria-label="Keyboard shortcuts" hidden>
          <div class="hub-help-row"><span>Switch to AI Tools</span><kbd>1</kbd></div>
          <div class="hub-help-row"><span>Switch to Tech Stack</span><kbd>2</kbd></div>
          <div class="hub-help-row"><span>Focus search</span><kbd>/</kbd></div>
          <div class="hub-help-row"><span>Command search</span><kbd>Ctrl</kbd><kbd>K</kbd></div>
          <div class="hub-help-row"><span>Close / dismiss</span><kbd>Esc</kbd></div>
        </div>
      </div>
    </div>

    <div class="hub-search" role="combobox" aria-haspopup="listbox" aria-owns="hub-global-search-results" aria-expanded="false" hidden>
      <svg class="hub-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      <input type="text" id="hub-global-search" placeholder="Search tools, tech, categories, packages, frameworks, APIs…" autocomplete="off" spellcheck="false" aria-label="Global command search across tools and tech" aria-keyshortcuts="/ Control+K" aria-autocomplete="list" aria-controls="hub-global-search-results">
      <button type="button" class="hub-search-clear" id="hub-global-search-clear" aria-label="Clear search" hidden>&times;</button>
      <span class="hub-search-hint" aria-hidden="true"><kbd>Esc</kbd></span>
      <div id="hub-global-search-results" class="hub-results" role="listbox" aria-label="Search results" hidden></div>
      <span id="hub-search-live" class="sr-only" aria-live="polite" role="status"></span>
    </div>
  </header>

  <main class="hub-main">
    <div class="hub-loading hidden" id="hub-loading" aria-label="Loading section">
      <div class="spinner"></div>
      <div>Loading...</div>
    </div>
    <section id="tools-section" class="hub-section sec-tools active" role="tabpanel" aria-labelledby="hub-tab-tools">
<a class="skip-link" href="#tools-main">Skip to tools</a>

<div id="tools-recentStrip" class="recent-strip hidden" aria-label="Recently viewed tools"></div>
<div class="page-shell">
  <aside class="category-sidebar" aria-label="Categories and filters">
    <div class="sidebar-title">Categories</div>
    <div class="category-tools" aria-label="Category tools">
      <label class="field" for="tools-categorySearch">
        <span class="field-label">Find category</span>
        <input class="category-search" id="tools-categorySearch" type="search" placeholder="Search categories…" autocomplete="off" spellcheck="false">
      </label>
      <div class="category-summary" id="tools-categorySummary"></div>
    </div>
    <div class="sidebar-controls">
      <div class="utility-actions">
        <button class="action-btn" id="tools-resetFilters" type="button">All categories</button>
        <button class="action-btn" id="tools-clearSaved" type="button">Clear saved</button>
        <button class="action-btn" id="tools-exportSaved" type="button">⬇ Export saved</button>
        <button class="action-btn" id="tools-exportCsv" type="button">⬇ Export CSV</button>
      </div>
      <div class="field">
        <span class="field-label">Density</span>
        <div class="density-controls">
          <button class="density-btn" data-density="compact" type="button" title="Compact">▪▪▪</button>
          <button class="density-btn active" data-density="default" type="button" title="Default">▪▪</button>
          <button class="density-btn" data-density="comfortable" type="button" title="Comfortable">▪</button>
        </div>
      </div>
    </div>
    <nav class="tabs" id="tools-tabs" aria-label="Tool categories" role="tablist"></nav>
  </aside>

  <section data-embedded-main="tools" id="tools-main">
    <div id="tools-content"></div>
  </section>
</div>

<div class="compare-bar" id="tools-compareBar">
  <div class="compare-items" id="tools-compareItems"></div>
  <button class="compare-btn" id="tools-compareAction">Compare</button>
  <button class="compare-clear" id="tools-compareClear">Clear</button>
</div>

<div class="modal-backdrop" id="tools-compareModal">
  <div class="modal">
    <div class="modal-head">
      <h2>Tool Comparison</h2>
      <button class="modal-close" id="tools-modalClose">Close</button>
    </div>
    <div id="tools-compareModalContent"></div>
  </div>
</div>

<div class="tool-detail-backdrop" id="tools-toolDetailModal" role="dialog" aria-modal="true" aria-labelledby="tools-tdName">
  <div class="tool-detail-panel">
    <div class="td-head">
      <div class="td-identity">
        <img class="td-favicon-lg" id="tools-tdFavicon" width="44" height="44" src="" alt="">
        <div class="td-name-block">
          <h2 class="td-title" id="tools-tdName"></h2>
          <a class="td-url-link" id="tools-tdUrlLink" href="#" target="_blank" rel="noopener"></a>
        </div>
      </div>
      <button class="td-close-btn" id="tools-tdClose" type="button" aria-label="Close detail panel">✕ Close</button>
    </div>
    <div class="td-body" id="tools-tdBody"></div>
  </div>
</div>

<footer class="directory-footer" aria-label="AI tools directory footer">
  <div class="directory-footer-inner">
    <div class="directory-footer-brand">
      <strong>ToolAtlas</strong>
      <span id="tools-footer-summary">2,386 AI tools across curated categories.</span>
    </div>
    <div class="directory-footer-actions">
      <button type="button" class="footer-action" data-footer-action="search">Search all</button>
      <button type="button" class="footer-action" data-footer-action="top">Back to top</button>
      <a href="/" class="footer-action" style="text-decoration:none">← Home</a>
      <span class="footer-meta">Updated May 2026</span>
    </div>
  </div>
</footer>
<button class="back-to-top" id="tools-backToTop" aria-label="Back to top" title="Back to top">↑</button>
<div class="share-toast" id="tools-shareToast">Link copied!</div>
    </section>

    <section id="tech-section" class="hub-section sec-tech" role="tabpanel" aria-labelledby="hub-tab-tech" hidden>
<div class="page-shell">
  <aside class="category-sidebar" aria-label="Categories">
    <div class="sidebar-title">Categories</div>
    <div class="category-tools" aria-label="Category tools">
      <label class="field" for="tech-categorySearch">
        <span class="field-label">Find category</span>
        <input class="category-search" id="tech-categorySearch" type="search" placeholder="Search categories…" autocomplete="off" spellcheck="false">
      </label>
      <div class="category-summary" id="tech-categorySummary"></div>
    </div>
    <nav class="tabs" id="tech-tabs" aria-label="Technology categories"></nav>
  </aside>

  <section data-embedded-main="tech" id="tech-main">
    <div id="tech-content"></div>
  </section>
</div>

<div class="tool-detail-backdrop" id="tech-techDetailModal" role="dialog" aria-modal="true" aria-labelledby="tech-tdName">
  <div class="tool-detail-panel">
    <div class="td-head">
      <div class="td-identity">
        <div class="td-favicon-lg" id="tech-tdIcon" aria-hidden="true" style="display:grid;place-items:center;font-size:22px;background:#f8fafc"></div>
        <div class="td-name-block">
          <h2 class="td-title" id="tech-tdName"></h2>
          <a class="td-url-link" id="tech-tdUrlLink" href="#" target="_blank" rel="noopener"></a>
        </div>
      </div>
      <button class="td-close-btn" id="tech-tdClose" type="button" aria-label="Close detail panel">✕ Close</button>
    </div>
    <div class="td-body" id="tech-tdBody"></div>
  </div>
</div>

<footer class="directory-footer" aria-label="Technology directory footer">
  <div class="directory-footer-inner">
    <div class="directory-footer-brand">
      <strong>ToolAtlas</strong>
      <span id="tech-tech-footer-summary">1,861 technologies organized by developer-focused categories.</span>
    </div>
    <div class="directory-footer-actions">
      <button type="button" class="footer-action" data-footer-action="search">Search all</button>
      <button type="button" class="footer-action" data-footer-action="top">Back to top</button>
      <a href="/" class="footer-action" style="text-decoration:none">← Home</a>
      <span class="footer-meta">Updated May 2026</span>
    </div>
  </div>
</footer>
<button class="back-to-top" id="tech-backToTop" aria-label="Back to top">↑</button>
    </section>
  </main>`;
