# ToolAtlas — Design / UI-UX / Content Improvement Plan

_Last updated: 2026-09-18_

## What this is (and what it is NOT)

This is an **in-place redesign** of ToolAtlas: improve the **visual design, UI/UX,
content, and functionality** of the site working **on top of the existing code**.

**"Rebuild" here does NOT mean rewrite the code.** An earlier attempt read the word
"rebuild" as "re-architect the vanilla-JS `/hub` into typed React components." That
was wrong and has been **reverted** (commit `627be9c` "Hub rebuild Phase 1…" was
undone by `82aadd7`). We keep the current architecture exactly:

- `/hub` stays a vanilla-JS catalog engine (`public/hub-app/{tools,tech,main,dataLoader}.js`)
  injected into a React island via `dangerouslySetInnerHTML` from `lib/hubMarkup.ts`,
  mounted by `components/HubClient.tsx`. **No port to React, no new framework, no new deps.**
- Marketing pages (`app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx` +
  `components/{SiteNav,SiteFooter,Effects,ContactForm,Faq}.tsx`) stay React as they are.
- `public/data/*.js` (2,324 tools, 1,850 tech) is untouched source of truth. Counts
  everywhere still come from `lib/catalogStats.ts` (`getCatalogStats()`, server-only `fs`).

We improve look/feel/UX/behaviour by editing the existing files, not replacing them.

## Completed work (before this plan)

Everything below is already committed on `add-video-models` (oldest → newest). Listed
here so this document is the full picture, not just what's left to do.

**Catalog data (content/data, not UI):**
- `2326e58`, `77b86db`, `7a2e178` — closed out the design-review's P0/P1/P2 findings:
  every published tool/tech/category count was wrong in 25+ places, fixed by a single
  source of truth (`lib/catalogStats.ts`); category-selection now writes to the URL hash
  (deep links became real, not just claimed); a conflicting duplicate `:root` token block
  in `hub.css` removed; first-ever `:focus-visible` rule added to the marketing site;
  low-contrast focus rings fixed; duplicate Sort/preset filters (Free/Open Source/etc.)
  removed from Sort; Compare modal + global search got correct ARIA roles and focus
  management; mobile touch targets raised to 44×44.
- `7a2e178` — sidebar became a real collapsible department tree (added `parentId` to
  every category in `tools-data.js`); Master List's 2,324-card first paint cut to 60
  cards / 1,803 DOM nodes via "Show N more" pagination (was 43,621 nodes).
- `e31837f`, `3a8874b`, `f45075b`, `9a59715` — planned and executed the full taxonomy
  reorg: 9 department umbrella tabs added; the 315-item "Cybersecurity & Privacy"
  mega-category split into 7 real subcategories; "Useful Websites & Utilities" (84 items)
  split into 8; "AI Browser Extensions" (118 items) dissolved into real functional
  categories with a new `delivery_format` facet; two follow-up passes fixed stale
  category text (description/best_for/tags) and a stale `placement.group` left behind
  on the 517 reclassified tools.
- `8bb9e08` — rebrand "ToolForge" → "ToolAtlas" completed everywhere, including the
  GitHub repo slug itself (`Master-Tools-Hub` → `ToolAtlas`), fixing an earlier partial
  rebrand that renamed the product but not the repo.
- `c58b5a9`, `1bc381b`, `bf6c4ba`, `68065b5` — catalog freshness pass: added 5 tools
  launched after the last bulk-verify, refreshed 2 stale entries (Gemini, Meta AI);
  refreshed live GitHub star counts/status for 695 tech entries; deduped 73 duplicate
  tool rows + 11 duplicate tech rows; added 6 new 2026 video-generation models and
  refreshed 4 stale flagship versions (Veo, Sora, Kling, Runway).

**Visual design ("Field Atlas"):**
- `24de6dd` — full redesign from the old generic violet-to-cyan AI-SaaS palette to
  "Field Atlas": ink/brass/paper cartography theme, Space Grotesk + Fraunces fonts,
  authored compass-rose hero SVG, gradient-clipped heading text removed (banned pattern),
  one-accent (brass) strategy across both the dark marketing "cover" and the light hub
  "pages" register. Found and fixed a live bug in the same pass: `.tab-children` was
  visually showing regardless of the `hidden` attribute because an author CSS rule beats
  the browser's own `[hidden]{display:none}` at equal specificity.
- `ce59feb` — sidebar departments converted from inline-expanding blocks to floating
  dropdowns (one open at a time); found and fixed a real bug where clicking a department
  closed its own dropdown one tick later, because re-rendering mid-click-bubble detached
  the original event target (fixed via `e.composedPath()` instead of `.contains(e.target)`).
- `b677334` — borrowed the monospace/tabular-nums treatment from a user-shared reference
  design for data readouts (star counts, category counts); closed out a second color-sweep
  pass that found several live leftover violet/cyan values the first pass missed.

**Reverted (do not repeat):**
- `627be9c` → reverted by `82aadd7` — a full React re-architecture of `/hub` was started
  under a misreading of "rebuild," then fully reverted once corrected. See the top of
  this document.

## Decisions locked with the user

1. **Both** Hub and marketing pages are in scope.
2. **Content stays mostly the same** — improve/tighten copy only where it genuinely
   helps; do not rewrite what already works. No new marketing claims.
3. Improve **UI/UX and functionality**, not just colours/fonts (that Field Atlas token
   pass already shipped earlier).
4. **Sidebar: redesign it, do not remove it.** Keep category browsing; fix the mobile
   experience and tidy the desktop controls (see Hub §1).
5. **Order: Hub first**, then marketing pages.
6. Work in **small, reviewable batches**; verify each in the browser (`preview_start
   toolatlas-dev`, localhost:3500) and show screenshots/diffs. Commit locally per batch
   as `Surya8991` on branch `add-video-models`. **Push only when explicitly asked.**

---

## Current state — audit findings (2026-09-18, live at localhost:3500)

### Hub (`/hub`)

**🔴 1. Sidebar — the priority fix.**
The category sidebar is `<aside class="category-sidebar">` inside `lib/hubMarkup.ts`,
rendered by `renderTabs()` in `public/hub-app/tools.js` (department-tree from
`category.parentId`: Master List + 9 `dept-*` rows, each a dropdown of `tool-cat-*`
leaves).
- **Desktop:** sticky beside the grid, works, but the 4 stacked utility buttons
  (`All categories` / `Clear saved` / `⬇ Export saved` / `⬇ Export CSV`) + density row
  read as an untidy pile; hierarchy is weak.
- **Mobile (375px):** renders **inline above the content** — category search → 4 utility
  buttons → density control → all 9 department rows appear *before the first tool card*.
  A phone visitor scrolls a full screen of controls before seeing a single tool. This is
  the core complaint ("remove the sidebar completely or make it function with better
  design/UX").
- **Chosen fix (redesign, keep it):** on mobile, collapse the whole sidebar behind a
  **"Filters / Categories" button** that opens a **bottom-sheet / drawer**, so tools show
  first; on desktop keep the sidebar but **group + restyle** the utility actions and
  density control into a cleaner block with real hierarchy. Preserve all existing
  behaviour: department dropdowns (one open at a time), the `composedPath()` outside-click
  fix (tools.js:475), the `.tab-children:not([hidden])` CSS rule, `ensureActiveDeptOpen()`
  running once, category search, `STORAGE_KEYS` (`master_tools_density_v1` etc.).

**🟠 2. Nav tab labels disappear ~561–900px.** Between those widths the header shows an
icon + a bare count with no "AI Tools" / "Tech Stack" label (a leftover responsive CSS
rule in `app/hub/…`/`public/hub-app/hub.css`). Looks broken on laptop/tablet widths. Fix
the breakpoint so the label persists.

**🟠 3. "Recommended views" preset panel eats vertical space.** `renderRecommendedViews()`
(tools.js:200) sits above results and pushes real content down. Consider making it more
compact / collapsible so results are reachable sooner.

**🟡 4. Card polish.** `renderCard()` (tools.js:554): tags wrap to 2 lines; the compare
checkbox is a bare unstyled square (`.compare-check`); the favourite button (`.favorite-btn`)
barely reads at default density. Tighten spacing, style the compare/favourite affordances.

**Functionality to verify / improve (Hub):**
- Sort dropdown (`renderFilterControls()`, tools.js:302): recommended / editor / developer /
  popular / verified / A-Z — confirm all behave; consider "recently added".
- Advanced filters panel (pricing/platform/user/availability/status) — confirm end-to-end.
- Compare tray + matrix modal — confirm limit/flow is obvious to a first-timer.
- Global Ctrl+K fuzzy search (Levenshtein + synonyms, `main.js`) — stress-test typo tolerance.
- Export CSV / Export saved (`exportCsv()`/`exportSaved()`, tools.js:759/763) — confirm both work.
- Detail drawer (`openToolDetail()`, tools.js:800) — confirm it adds value over the card.

### Marketing pages (Home / About / Contact)

**🟠 5. Emoji used as icons.** Home feature tiles and About's "How it's built" / "Principles"
sections use raw emoji (`▲ ⚛️ 🎨 🔍 💾 🌐 🚀`). Reads generic against the brass/cartography
identity. Fix: authored single-stroke line SVG icons (no icon library, zero deps).

**🟡 6. Generic card grid.** Home feature/category tiles are a stock same-size card grid;
doesn't speak the "map legend" language of the compass-rose hero. Restructure composition
(legend/index treatment), keep the copy.

**🟢 7. Content is fine.** About/Contact copy reads well; stat counters (2,324 / 1,850 / 55 /
0 paid placements) animate correctly. No stale/incorrect content found — this is a
design/structure pass, not a copy rewrite.

---

## Work plan (ordered, small batches)

### Phase H — Hub (first)
- **H1. Sidebar redesign.** Mobile drawer/bottom-sheet + "Filters" trigger; desktop
  regroup/restyle utility actions + density. Preserve all dropdown/search/storage behaviour
  and the known bug-fixes noted above. Verify desktop + 375px.
- **H2. Nav-label breakpoint fix** (561–900px) so labels never vanish.
- **H3. "Recommended views" compaction** so results sit higher.
- **H4. Card polish** — tag wrap, compare checkbox, favourite button, density legibility.
- **H5. Functionality sweep** — verify sort, filters, compare, Ctrl+K search, exports,
  detail drawer; fix whatever's broken/confusing; add small wins (e.g. "recently added" sort)
  only if low-risk.

### Phase M — Marketing pages (after Hub)
- **M1. Authored SVG icon set** replacing all emoji-as-icons (nav, footer, home features,
  About sections). One consistent stroke, `currentColor`.
- **M2. Home restructure** — recast feature/category tiles from generic grid into the
  cartographic legend/index language; keep hero compass-rose + copy.
- **M3. About + Contact** — light structural refinement to match; keep the honest
  maker's-note voice, mailto/no-backend truth, existing form a11y.

### Constraints (every batch)
- Zero new npm dependencies (`next`/`react`/`react-dom` + types + typescript only).
- No changes to `public/data/*.js`. Real counts via `getCatalogStats()` — never hardcode.
- Field Atlas identity holds: one accent (brass), no gradient-clipped heading text,
  `--grad-cta` for text-on-gradient (≥4.5:1), honour `prefers-reduced-motion`, ≥44px touch
  targets on mobile.
- Verify in browser per batch; `npx tsc --noEmit` clean; commit locally as `Surya8991`;
  push only when asked.

## Out of scope
- Re-architecting `/hub` into React (reverted; explicitly not wanted).
- New routes (`/tool/[slug]`, `/compare`), virtualization, or new search libraries.
- `tech-data.js`'s 42 orphaned category slugs and stale `alternativeIds` after dedupe
  (tracked as separate task chips).
