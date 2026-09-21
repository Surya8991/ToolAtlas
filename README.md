# ⚡ ToolAtlas

A hand-checked developer catalog featuring **2,324 AI Tools** and **1,850 Developer Technologies** across 55 categories, built on **Next.js 15 (App Router) + React 19 + TypeScript**. A "Field Atlas" cartography-themed marketing site (Home / About / Contact) wraps the full-featured catalog hub. Every count on the site is computed live from the data files — never hardcoded.

## 📁 Repository Structure
```
toolatlas/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout (Space Grotesk + Fraunces, metadata)
│   ├── globals.css                 # "Field Atlas" dark design system (marketing register)
│   ├── page.tsx                    # Home (hero, product preview, category legend panels, features, CTA)
│   ├── about/page.tsx              # About / story / principles
│   ├── contact/page.tsx            # Contact methods + form + FAQ
│   └── hub/                        # The catalog hub
│       ├── layout.tsx              # Hub metadata
│       └── page.tsx                # Client component: injects markup + boots controllers
├── components/                     # React components
│   ├── SiteNav.tsx · SiteFooter.tsx
│   ├── Effects.tsx                 # Scroll-reveal, count-up, cursor spotlight
│   ├── ContactForm.tsx · Faq.tsx
│   ├── HubClient.tsx               # Mounts/tears down the hub's vanilla-JS controllers
│   └── icons.tsx                   # Shared authored SVG line-icon set (no emoji, no icon lib)
├── lib/
│   ├── hubMarkup.ts                # Hub DOM markup (the catalog shell)
│   └── catalogStats.ts             # Single source of truth for every count shown on the site
├── public/
│   ├── data/                       # Source-of-truth datasets (tools, tech, search index)
│   ├── hub-app/                    # Hub engine served as static assets (light "pages" register)
│   │   ├── hub.css                 # Hub styles (shell + cards + drawers)
│   │   ├── dataLoader.js · tools.js · tech.js · main.js
│   ├── favicon.svg · icons.svg
├── docs/
│   ├── REDESIGN_PLAN.md            # UI/UX redesign history, decisions, and rationale
│   └── CATALOG_REORG_PLAN.md       # Taxonomy reorg design (executed)
├── next.config.mjs · tsconfig.json · types.d.ts
└── agents.md                       # Architecture, constraints, and known gotchas for agents
```

> The hub catalog logic is the original, battle-tested vanilla-JS engine. The `/hub` route mounts it inside a React client component (injecting the markup and booting the controllers on mount, cleaning up on unmount). Its internals can be incrementally rewritten into pure React over time.

## 🚀 Getting Started

```bash
git clone https://github.com/Surya8991/ToolAtlas.git
cd ToolAtlas
npm install
npm run dev      # http://localhost:3000
```

### Production Build
```bash
npm run build    # optimized Next.js build
npm run start    # serve the production build
```
Deploys cleanly to Vercel (zero-config) or any Node host.

## ⚡ Core Features
- **Bi-Tabular Dashboard**: Instant client-side switching between **AI Tools** and **Tech Stack** directories.
- **Fuzzy Global Search**: pre-compiled synonym-expanded edit distance fuzzy matching with full keyboard arrow + enter navigation.
- **Responsive density settings**: Choose between **S** (Compact), **M** (Default), or **L** (Comfortable) density views to adjust screen card details.
- **Comparison matrix**: Side-by-side matrices comparing selected tools on pricing, tags, and description.
- **Interactive slide-out drawer**: Slick, responsive side panel inspecting exhaustive details (integrations, features, similar tools).
- **Favicons fallback**: Integrated Google s2 API (`default=404`) and DuckDuckGo API with a custom global listener generating color-harmonized CSS gradient avatars repeatably derived from tool names if offline or blocked.
