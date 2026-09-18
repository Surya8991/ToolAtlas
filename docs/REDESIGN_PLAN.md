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
