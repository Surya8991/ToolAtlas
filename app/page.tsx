import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Effects from "@/components/Effects";
import { getCatalogStats } from "@/lib/catalogStats";

const MARQUEE = [
  "ChatGPT", "Claude", "Midjourney", "GitHub Copilot", "Figma", "Notion AI",
  "React", "Next.js", "TypeScript", "PostgreSQL", "Docker", "Kubernetes",
  "Stripe", "Tailwind", "Vercel", "Supabase", "Rust", "Go", "Vite", "Linear",
];

function buildAiCats(stats: ReturnType<typeof getCatalogStats>) {
  const c = stats.toolCategoryCounts;
  return [
    { icon: "✍️", name: "Writing & Copy", count: `${c["tool-cat-writing"]} tools`, href: "/hub#tools/tool-cat-writing" },
    { icon: "💻", name: "Coding & Dev", count: `${c["tool-cat-coding"]} tools`, href: "/hub#tools/tool-cat-coding" },
    { icon: "🎨", name: "Image Generation", count: `${c["tool-cat-image"]} tools`, href: "/hub#tools/tool-cat-image" },
    { icon: "📈", name: "SEO & Marketing", count: `${c["tool-cat-seo"] + c["tool-cat-marketing"]} tools`, href: "/hub#tools/tool-cat-seo" },
    { icon: "🎬", name: "Video & Audio", count: `${c["tool-cat-video"] + c["tool-cat-audio"]} tools`, href: "/hub#tools/tool-cat-video" },
    { icon: "📝", name: "Meeting Notes", count: `${c["tool-cat-meeting"]} tools`, href: "/hub#tools/tool-cat-meeting" },
    { icon: "🖌️", name: "Design & UI", count: `${c["tool-cat-design"]} tools`, href: "/hub#tools/tool-cat-design" },
    { icon: "⚡", name: "View all →", count: `${stats.totalTools.toLocaleString()} total`, href: "/hub" },
  ];
}

function buildTechCats(stats: ReturnType<typeof getCatalogStats>) {
  const c = stats.techTileCounts;
  return [
    { icon: "🌐", name: "Frontend", count: `${c.frontend} items`, href: "/hub#tech/frontend_ui" },
    { icon: "⚙️", name: "Backend & APIs", count: `${c.backend} items`, href: "/hub#tech/backend_servers" },
    { icon: "🗄️", name: "Databases", count: `${c.databases} items`, href: "/hub#tech/databases_storage_search" },
    { icon: "🚀", name: "DevOps & Cloud", count: `${c.devops} items`, href: "/hub#tech/devops_infra" },
    { icon: "📱", name: "Mobile", count: `${c.mobile} items`, href: "/hub#tech/mobile_desktop" },
    { icon: "🧪", name: "Testing & QA", count: `${c.testing} items`, href: "/hub#tech/testing_qa" },
    { icon: "🔒", name: "Security & Auth", count: `${c.security} items`, href: "/hub#tech/security_auth_identity" },
    { icon: "🛠️", name: "View all →", count: `${stats.totalTech.toLocaleString()} total`, href: "/hub#tech" },
  ];
}

const PREVIEW_CARDS = [
  { av: "C", grad: "linear-gradient(135deg,#10a37f,#0d8a6c)", name: "ChatGPT", tag: "Conversational AI", desc: "Advanced LLM for writing, coding, and analysis.", pill: "Freemium", pillCls: "paid" },
  { av: "C", grad: "linear-gradient(135deg,#d97757,#c25b3a)", name: "Claude", tag: "AI Assistant", desc: "Thoughtful AI for long-context reasoning.", pill: "Freemium", pillCls: "paid" },
  { av: "M", grad: "linear-gradient(135deg,#8b5cf6,#6d28d9)", name: "Midjourney", tag: "Image Generation", desc: "State-of-the-art AI image generation.", pill: "Paid", pillCls: "" },
  { av: "G", grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)", name: "Copilot", tag: "Code Assistant", desc: "AI pair programmer in your editor.", pill: "Paid", pillCls: "paid" },
  { av: "P", grad: "linear-gradient(135deg,#06b6d4,#0891b2)", name: "Perplexity", tag: "AI Search", desc: "Answer engine with cited sources.", pill: "Free", pillCls: "free" },
  { av: "N", grad: "linear-gradient(135deg,#f59e0b,#d97706)", name: "Notion AI", tag: "Productivity", desc: "AI writing built into your workspace.", pill: "Freemium", pillCls: "paid" },
];

export default function Home() {
  const stats = getCatalogStats();
  const AI_CATS = buildAiCats(stats);
  const TECH_CATS = buildTechCats(stats);
  const totalCategories = stats.toolSubcategoryCount + stats.toolDepartmentCount;

  return (
    <>
      <SiteNav />

      {/* Hero */}
      <header className="hero" aria-label="Hero">
        <div className="hero-orb o1" aria-hidden="true" />
        <div className="hero-orb o2" aria-hidden="true" />
        <div className="hero-orb o3" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-badge reveal">
            <span className="hero-badge-dot" aria-hidden="true" />
            {stats.totalItems.toLocaleString()} curated items · Updated {stats.lastUpdatedLabel}
          </div>
          <h1 className="hero-title reveal" style={{ "--delay": "60ms" }}>
            Find the right tool,<br />
            <span className="grad">skip the noise.</span>
          </h1>
          <p className="hero-sub reveal" style={{ "--delay": "140ms" }}>
            A hand-checked catalog of <strong>{stats.totalTools.toLocaleString()} AI tools</strong> and{" "}
            <strong>{stats.totalTech.toLocaleString()} developer technologies</strong>. Search it, compare options, save what you like. No signup, no spam.
          </p>
          <div className="hero-actions reveal" style={{ "--delay": "220ms" }}>
            <Link href="/hub" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse AI Tools
            </Link>
            <Link href="/hub#tech" className="btn-secondary">Explore Tech Stack →</Link>
          </div>
          <div className="hero-stats reveal" style={{ "--delay": "300ms" }} aria-label="Quick stats">
            <div className="hero-stat-chip"><strong>{stats.totalTools.toLocaleString()}</strong> AI Tools</div>
            <div className="hero-stat-chip"><strong>{stats.totalTech.toLocaleString()}</strong> Technologies</div>
            <div className="hero-stat-chip"><strong>{totalCategories}</strong> Categories</div>
            <div className="hero-stat-chip">Always <strong>Free</strong></div>
          </div>

          {/* Product preview */}
          <div className="hero-preview reveal" style={{ "--delay": "380ms" }} aria-hidden="true">
            <div className="preview-glow" />
            <div className="browser">
              <div className="browser-bar">
                <span className="dot red" /><span className="dot amber" /><span className="dot green" />
                <div className="browser-url">toolatlas.dev/hub</div>
              </div>
              <div className="app">
                <div className="app-top">
                  <div className="app-brand">⚡ ToolAtlas</div>
                  <div className="app-tabs">
                    <span className="app-tab active">🤖 AI Tools</span>
                    <span className="app-tab">🛠 Tech Stack</span>
                  </div>
                  <div className="app-search">🔍 Search… <kbd>⌘K</kbd></div>
                </div>
                <div className="app-body">
                  <aside className="app-side">
                    <div className="app-side-title">Categories</div>
                    <div className="app-side-item active">All tools</div>
                    <div className="app-side-item">Writing</div>
                    <div className="app-side-item">Coding</div>
                    <div className="app-side-item">Image Gen</div>
                    <div className="app-side-item">Video</div>
                    <div className="app-side-item">SEO</div>
                  </aside>
                  <div className="app-grid">
                    {PREVIEW_CARDS.map((c) => (
                      <div className="app-card" key={c.name}>
                        <div className="app-card-top">
                          <span className="app-av" style={{ background: c.grad }}>{c.av}</span>
                          <div>
                            <div className="app-card-name">{c.name}</div>
                            <div className="app-card-tag">{c.tag}</div>
                          </div>
                        </div>
                        <div className="app-card-desc">{c.desc}</div>
                        <span className={`app-pill ${c.pillCls}`}>{c.pill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span className="marquee-pill" key={i}>
              <span className="dot" aria-hidden="true" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="stats-bar" aria-label="Platform statistics">
        <div className="stats-inner">
          <div className="stat"><span className="stat-number" data-count={stats.totalTools}>0</span><span className="stat-label">AI Tools</span></div>
          <div className="stat"><span className="stat-number" data-count={stats.totalTech}>0</span><span className="stat-label">Tech Items</span></div>
          <div className="stat"><span className="stat-number" data-count={totalCategories}>0</span><span className="stat-label">Categories</span></div>
          <div className="stat"><span className="stat-number">Free</span><span className="stat-label">Always</span></div>
        </div>
      </section>

      {/* Features */}
      <section className="section" aria-labelledby="features-heading">
        <div className="container">
          <div className="section-head-center">
            <div className="section-tag reveal">Features</div>
            <h2 className="section-title reveal" id="features-heading" style={{ "--delay": "60ms" }}>Made to get out of your way</h2>
            <p className="section-sub reveal" style={{ "--delay": "120ms" }}>No dashboard to learn. Just the handful of things that make finding a tool quick.</p>
          </div>
          <div className="features-grid bento" data-spotlight>
            <div className="feature-card span-2 reveal">
              <div className="feature-icon" aria-hidden="true">🔍</div>
              <h3 className="feature-title">Fuzzy Global Search</h3>
              <p className="feature-desc">Fat-finger a name and it still finds it. Typo-tolerant matching with synonyms across all {stats.totalItems.toLocaleString()} entries, fully keyboard-driven. Hit <kbd>Ctrl</kbd>+<kbd>K</kbd> from anywhere.</p>
            </div>
            <div className="feature-card reveal" style={{ "--delay": "80ms" }}>
              <div className="feature-icon" aria-hidden="true">⚖️</div>
              <h3 className="feature-title">Comparison Matrix</h3>
              <p className="feature-desc">Select tools for a side-by-side comparison of pricing, features, and tags in a clean matrix.</p>
            </div>
            <div className="feature-card reveal">
              <div className="feature-icon" aria-hidden="true">⭐</div>
              <h3 className="feature-title">Favorites &amp; Export</h3>
              <p className="feature-desc">Save tools across sessions and export your shortlist as JSON or CSV for your own workflows.</p>
            </div>
            <div className="feature-card reveal" style={{ "--delay": "80ms" }}>
              <div className="feature-icon" aria-hidden="true">🔗</div>
              <h3 className="feature-title">Deep Links</h3>
              <p className="feature-desc">Every category, tool, and filter state is shareable via URL. Bookmark any view or send it on.</p>
            </div>
            <div className="feature-card span-2 reveal" style={{ "--delay": "160ms" }}>
              <div className="feature-icon" aria-hidden="true">🛡️</div>
              <h3 className="feature-title">Density Controls &amp; Resilient UI</h3>
              <p className="feature-desc">Pick Compact, Default, or Comfortable to fit your screen. When a favicon won&apos;t load, a color-coded letter avatar stands in so you never see a broken image. Keyboard-navigable throughout, with proper ARIA roles and skip links.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Categories */}
      <section className="section" aria-labelledby="ai-cats-heading">
        <div className="container">
          <div className="section-head-center">
            <div className="section-tag reveal">AI Tools</div>
            <h2 className="section-title reveal" id="ai-cats-heading" style={{ "--delay": "60ms" }}>{stats.totalTools.toLocaleString()} tools across every use case</h2>
            <p className="section-sub reveal" style={{ "--delay": "120ms" }}>From writing assistants to code copilots, discover AI tools organized by what they actually do.</p>
          </div>
          <div className="categories-grid">
            {AI_CATS.map((c, i) => (
              <Link href={c.href} className="cat-card reveal" key={c.name} style={{ "--delay": `${(i % 4) * 50}ms` }}>
                <div className="cat-icon" aria-hidden="true">{c.icon}</div>
                <div className="cat-info"><div className="cat-name">{c.name}</div><div className="cat-count">{c.count}</div></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Categories */}
      <section className="section" aria-labelledby="tech-cats-heading">
        <div className="container">
          <div className="section-head-center">
            <div className="section-tag reveal">Tech Stack</div>
            <h2 className="section-title reveal" id="tech-cats-heading" style={{ "--delay": "60ms" }}>{stats.totalTech.toLocaleString()} technologies, every layer of the stack</h2>
            <p className="section-sub reveal" style={{ "--delay": "120ms" }}>Languages, frameworks, databases, DevOps, cloud. Your entire stack reference in one place.</p>
          </div>
          <div className="categories-grid">
            {TECH_CATS.map((c, i) => (
              <Link href="/hub#tech" className="cat-card reveal" key={c.name} style={{ "--delay": `${(i % 4) * 50}ms` }}>
                <div className="cat-icon" aria-hidden="true">{c.icon}</div>
                <div className="cat-info"><div className="cat-name">{c.name}</div><div className="cat-count">{c.count}</div></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-head-center">
            <div className="section-tag reveal">How It Works</div>
            <h2 className="section-title reveal" id="how-heading" style={{ "--delay": "60ms" }}>Three steps, that&apos;s it</h2>
            <p className="section-sub reveal" style={{ "--delay": "120ms" }}>It&apos;s free and there&apos;s no account. Here&apos;s the whole flow.</p>
          </div>
          <div className="features-grid" data-spotlight>
            <div className="feature-card reveal"><div className="feature-icon" aria-hidden="true">1️⃣</div><h3 className="feature-title">Choose your section</h3><p className="feature-desc">Switch between AI Tools and Tech Stack with a click, or press <kbd>1</kbd> / <kbd>2</kbd>.</p></div>
            <div className="feature-card reveal" style={{ "--delay": "80ms" }}><div className="feature-icon" aria-hidden="true">2️⃣</div><h3 className="feature-title">Search or browse</h3><p className="feature-desc">Use fuzzy global search (<kbd>Ctrl</kbd>+<kbd>K</kbd>) or drill into any of the {totalCategories} sidebar categories.</p></div>
            <div className="feature-card reveal" style={{ "--delay": "160ms" }}><div className="feature-icon" aria-hidden="true">3️⃣</div><h3 className="feature-title">Inspect &amp; compare</h3><p className="feature-desc">Open the detail drawer for full info, or select multiple tools to compare side-by-side.</p></div>
          </div>
        </div>
      </section>

      {/* Maker's note */}
      <section className="section" aria-labelledby="note-heading">
        <div className="container">
          <div className="section-head-center">
            <div className="section-tag reveal">The honest version</div>
            <h2 className="section-title reveal" id="note-heading" style={{ "--delay": "60ms" }}>Why this exists</h2>
          </div>
          <div className="about-story reveal" style={{ marginTop: "36px", "--delay": "120ms" }}>
            <p>I got tired of hunting for tools across bookmarks, newsletters, and random Reddit threads, and tired of &quot;best tools&quot; listicles that are mostly ads. So I started keeping my own list. It grew, I cleaned it up, and this is what it became.</p>
            <p>Every entry is checked by hand. There are no paid placements and nothing is ranked because someone bought a slot. If something&apos;s out of date or missing, that&apos;s on me, so <Link href="/contact">tell me about it</Link> and I&apos;ll fix it.</p>
            <p>It&apos;s free, it&apos;ll stay free, and it doesn&apos;t ask for your email. If it saves you ten minutes, that&apos;s the whole point.</p>
            <p style={{ color: "var(--text-2)", fontSize: "0.95rem" }}>Surya</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="cta-card reveal">
          <div className="cta-glow" aria-hidden="true" />
          <div className="cta-inner">
            <h2 className="cta-title" id="cta-heading">Have a look around</h2>
            <p className="cta-sub">{stats.totalItems.toLocaleString()} tools and technologies, nothing behind a login. Open it and start digging.</p>
            <div className="cta-actions">
              <Link href="/hub" className="btn-primary" style={{ fontSize: "16px", padding: "16px 34px" }}>Open the Hub →</Link>
              <Link href="/about" className="btn-secondary">Learn more</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <Effects />
    </>
  );
}
