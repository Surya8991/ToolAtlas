# ToolAtlas — Agent Context

## Overview
A hand-checked developer catalog: **2,324 AI Tools** and **1,850 developer technologies**
(55 browsable categories: 9 department umbrellas + 46 subcategories), wrapped in a
"Field Atlas" cartography-themed marketing site (Home / About / Contact). Built on
**Next.js 15 (App Router) + React 19 + TypeScript**. Counts are never hand-written —
every one on the site comes from `lib/catalogStats.ts` reading the real data files.

**Do not read this as "rewrite the catalog engine in React."** An earlier attempt did
exactly that (commit `627be9c`) and was fully reverted (`82aadd7`) once corrected. The
`/hub` catalog stays vanilla JS. See `docs/REDESIGN_PLAN.md` for the full history and
rationale — it is required reading before touching `/hub` or the marketing pages.

## Architecture
Two deliberately different registers of the same design system, not two apps:
- **Marketing pages** (`app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx` +
  `components/{SiteNav,SiteFooter,Effects,ContactForm,Faq,icons}.tsx`) are ordinary React
  Server/Client Components, styled by `app/globals.css` (dark ink/brass "cover" register).
- **The Hub** (`/hub`) is a vanilla-JS catalog engine (`public/hub-app/{dataLoader,tools,tech,main}.js`,
  styled by `public/hub-app/hub.css`, light paper "pages" register) whose markup is generated
  server-side by `lib/hubMarkup.ts` and injected via `dangerouslySetInnerHTML` from
  `components/HubClient.tsx`, which also boots the vanilla-JS controllers on mount and tears
  them down on unmount. This is the original, battle-tested engine — treat it as a real app
  you're editing in place, not a legacy shim.

## Stack
- **Framework**: Next.js 15 App Router, React 19, TypeScript.
- **Styling**: Hand-written CSS only (`app/globals.css` for marketing, `public/hub-app/hub.css`
  for the hub) — CSS variables, Grid, Flexbox. **No Tailwind, no UI kit, no new npm deps**
  beyond `next`/`react`/`react-dom` + types + typescript, ever, unless explicitly requested.
- **Data**: `public/data/{tools-data.js,tech-data.js,search-index.js}` — plain
  `window.X = {...}` assignments loaded via `<script>` tag injection (not `fetch`), so the
  hub works from `file://` too. ~9.3 MB combined. Never hand-edit these; they're the source
  of truth and any recategorization needs a real audit (see `docs/CATALOG_REORG_PLAN.md` for
  the taxonomy design already executed on `tools-data.js`).
- **Icons**: `components/icons.tsx` — ~28 authored single-stroke SVG line icons
  (`currentColor`, one viewBox convention). No emoji-as-icon anywhere on the marketing
  pages; no icon library.

## Key Dirs & Files
```
Master-Tools-Hub/
├── app/
│   ├── layout.tsx                  # Root layout, fonts (Space Grotesk + Fraunces), metadata
│   ├── globals.css                 # "Field Atlas" design system (marketing register)
│   ├── page.tsx                    # Home: hero, product preview, legend panels, features, CTA
│   ├── about/page.tsx              # Story, "how it's built", principles
│   ├── contact/page.tsx            # Contact methods + form + FAQ
│   └── hub/
│       ├── layout.tsx              # Hub-specific metadata
│       └── page.tsx                # Renders <HubClient markup={buildHubMarkup()} />
├── components/
│   ├── HubClient.tsx                # Injects hub markup, boots/tears down vanilla-JS controllers
│   ├── SiteNav.tsx / SiteFooter.tsx / Effects.tsx / ContactForm.tsx / Faq.tsx
│   └── icons.tsx                    # Shared authored SVG icon set
├── lib/
│   ├── hubMarkup.ts                 # Server-rendered hub DOM shell (string template)
│   └── catalogStats.ts              # SINGLE source of truth for every count on the site (fs, server-only)
├── public/
│   ├── data/                        # tools-data.js, tech-data.js, search-index.js (source of truth)
│   └── hub-app/                     # The vanilla-JS catalog engine, served as static assets
│       ├── hub.css                  # Hub styles (shell, cards, drawers, sidebar dropdowns)
│       └── dataLoader.js · tools.js · tech.js · main.js
├── docs/
│   ├── REDESIGN_PLAN.md             # UI/UX redesign history + decisions locked with the user
│   └── CATALOG_REORG_PLAN.md        # Taxonomy reorg design (executed; see its Status line)
└── next.config.mjs · tsconfig.json · types.d.ts
```

## How to Run / Build / Test
```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npx tsc --noEmit # typecheck (run after every change; must be clean)
```

## Env Vars Needed
None. Fully client-side data (server only reads `public/data/*.js` via `fs` for stats/build).

## Agent-Specific Notes

### What to avoid
- **Don't re-architect `/hub` into React.** Explicitly reverted once already; see Overview.
- **No Tailwind, no UI kit, no new npm dependencies** for styling or components.
- **Never hardcode a tool/tech/category count anywhere.** Always go through
  `getCatalogStats()` (`lib/catalogStats.ts`). It's cached per request and reads the real
  data files — a hand-written number will drift the moment the catalog changes.
- **Don't fight `[hidden]` with a bare display rule.** Any CSS that styles a JS-toggled
  `[hidden]` element (`.tab-children`, `.recommended-panel`, etc. in `hub.css`) must be
  scoped `:not([hidden])`, not a plain class selector with its own `display` — an author
  rule at equal specificity beats the browser's own `[hidden]{display:none}`. This exact
  bug has been hit and fixed twice already in `hub.css` (see the comment at hub.css:950).
- **Don't swap `composedPath()` for `.contains(e.target)`** in the sidebar's outside-click
  handling (`tools.js` around line 491). Re-rendering mid-click-bubble detaches the original
  event target, which broke the dropdown-closes-itself-one-tick-late bug `composedPath()`
  was specifically added to fix.

### Sensitive areas
- **Favicon fallback chain**: `faviconUrl()` (`public/hub-app/tools.js:548`) builds the
  Google `s2/favicons` URL with `default=404` so a missing favicon fails cleanly instead of
  returning Google's generic globe. `main.js:6` has a single `document`-level `error`
  listener registered **with capturing** (`addEventListener('error', fn, true)`, main.js:6-65)
  that catches failed `<img class="tool-favicon">` / `.td-favicon-lg` / `.td-sim-favicon`
  loads, tries the DuckDuckGo fallback once (`data-fallback`), then renders a deterministic
  CSS-gradient letter avatar. The `error` event does not bubble — the capturing flag is load-bearing.
- **`lib/catalogStats.ts` is server-only.** It uses Node's `fs` to read `public/data/*.js` at
  request time. Never import it from a `"use client"` file, or from a module that one imports.
- **Density / storage keys** (`public/hub-app/tools.js`): `DENSITY_KEY =
  'master_tools_density_v1'`, plus `RECENT_KEY` / `FAVORITES_KEY`. `main.js` separately owns
  `hubSection` and `HUB_RECENT_KEY`. All localStorage reads are wrapped in try/catch (storage
  can be blocked).

### Known gotchas
- **Capturing error handler**: see above — must stay `true` as the 3rd argument or lazy-loaded
  card favicons stop falling back.
- **`window.X = {...}` data loading, not `fetch`**: bypasses `file://` CORS entirely; don't
  "modernize" this into a fetch call without checking offline/raw-file testing still works.
- **Tech category id aliases**: `tech-data.js` still carries a few legacy/duplicate category
  spellings from an earlier taxonomy pass (e.g. `frontend_ui` and `frontend_frameworks_ui`).
  `lib/catalogStats.ts`'s `TECH_TILE_CATEGORY_IDS` sums every known alias per tile rather than
  undercounting — extend that map, don't "clean up" the raw ids, until `tech-data.js` gets the
  same category cleanup `tools-data.js` already received (tracked, not yet done).
- **Design language**: one accent only (brass, `--accent`/`--brass`), no gradient-clipped
  heading text, `≥44px` touch targets on mobile, `prefers-reduced-motion` honoured. Home's
  category sections and About/Contact's list-like sections use a numbered "legend/index"
  treatment (`.legend-panel`/`.legend-row`, `.card-index`, `.contact-method-index`) — see
  `docs/REDESIGN_PLAN.md` M2/M3 for why, before changing that pattern.
