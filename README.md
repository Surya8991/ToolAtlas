# ⚡ ToolAtlas

A premium developer catalog featuring **2,386 AI Tools** and **1,861 Developer Technologies**, built on **Next.js 15 (App Router) + React 19 + TypeScript**. A polished marketing site (Home / About / Contact) wraps the full-featured catalog hub.

## 📁 Repository Structure
```
toolatlas/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout (Inter font, metadata)
│   ├── globals.css                 # World-class dark design system
│   ├── page.tsx                    # Home (hero, product preview, features, CTA)
│   ├── about/page.tsx              # About / story / principles
│   ├── contact/page.tsx            # Contact form + FAQ
│   └── hub/                        # The catalog hub
│       ├── layout.tsx              # Hub metadata
│       └── page.tsx                # Client component: injects markup + boots controllers
├── components/                     # React components
│   ├── SiteNav.tsx · SiteFooter.tsx
│   ├── Effects.tsx                 # Scroll-reveal, count-up, cursor spotlight
│   ├── ContactForm.tsx · Faq.tsx
├── lib/
│   └── hubMarkup.ts                # Hub DOM markup (the catalog shell)
├── public/
│   ├── data/                       # Lazy-loaded datasets (tools, tech, search index)
│   ├── hub-app/                    # Hub engine served as static assets
│   │   ├── hub.css                 # Hub styles (shell + cards + drawers)
│   │   ├── dataLoader.js · tools.js · tech.js · main.js
│   ├── favicon.svg · icons.svg
├── next.config.mjs · tsconfig.json · types.d.ts
└── agents.md                       # Layout constraints and visual gotchas
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
