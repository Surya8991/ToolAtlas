import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Effects from "@/components/Effects";

export const metadata: Metadata = {
  title: "About",
  description:
    "ToolAtlas is built by Surya L, a self-taught developer in Bangalore who builds web tools. Here is the story behind the catalog.",
};

const REPO = "https://github.com/Surya8991";
const TWITTER = "https://twitter.com/SURYA_L1998";
const PORTFOLIO = "https://ivy-cave-ef2.notion.site/Surya-L-147e68f554e280e2809fdf88d75dc950";

const TECH = [
  { icon: "▲", name: "Next.js 15", desc: "App Router, React Server Components, and an optimized production build. One dev server, proper routing, no more file:// gotchas." },
  { icon: "⚛️", name: "React 19", desc: "The marketing pages are React components; the hub mounts its catalog logic in a client component with hooks for lifecycle." },
  { icon: "🎨", name: "Hand-written CSS", desc: "A custom dark design system with CSS variables, no UI kit. Gradients, glass, and animation built from scratch." },
  { icon: "🔍", name: "Fuzzy Search Engine", desc: "Custom Levenshtein edit-distance matching with synonym expansion and a pre-compiled index. No external search library." },
  { icon: "💾", name: "localStorage", desc: "Favorites, density, and last-visited section persist across sessions, with graceful fallback when storage is blocked." },
  { icon: "🌐", name: "Static-friendly data", desc: "9 MB of catalog data loads on demand from /public, so the initial page stays light and fast." },
];

const VALUES = [
  { icon: "🚀", title: "It has to be fast", desc: "Data loads on demand, assets are split, and the search index is built ahead of time so nothing is crunched while you wait." },
  { icon: "🔓", title: "No walls", desc: "No login, no limits, no paywall. You shouldn't have to hand over an email just to look something up." },
  { icon: "✅", title: "Quality over quantity", desc: "I'd rather have 2,386 tools I've actually checked than 20,000 scraped entries full of dead links and duplicates." },
  { icon: "♿", title: "Works without a mouse", desc: "Keyboard navigation throughout, with proper ARIA roles, focus handling, and skip links, not bolted on as an afterthought." },
];

export default function About() {
  return (
    <>
      <SiteNav />

      <header className="page-hero" aria-label="About page header">
        <div className="hero-orb o1" aria-hidden="true" />
        <div className="hero-orb o2" aria-hidden="true" />
        <div className="page-hero-inner">
          <div className="page-hero-tag reveal">About</div>
          <h1 className="page-hero-title reveal" style={{ "--delay": "60ms" }}>
            Hi, I&apos;m Surya.<br /><span className="grad">I build web tools.</span>
          </h1>
          <p className="page-hero-sub reveal" style={{ "--delay": "140ms" }}>
            A self-taught developer from Bangalore. ToolAtlas is one of the things I&apos;ve built. Here is the story behind it.
          </p>
        </div>
      </header>

      <section className="section" aria-labelledby="story-heading">
        <div className="container">
          <div className="section-head-center" style={{ marginBottom: 0 }}>
            <div className="section-tag reveal">The story</div>
            <h2 className="section-title reveal" id="story-heading" style={{ "--delay": "60ms" }}>From one huge HTML file to this</h2>
          </div>
          <div className="about-story reveal" style={{ marginTop: "40px", "--delay": "120ms" }}>
            <p>I&apos;m a self-taught developer based in Bangalore, and I spend most of my free time building small web tools that scratch my own itches. A free <a href={`${REPO}/ResumeBuildz`} target="_blank" rel="noopener noreferrer">resume builder</a>, an AI <a href={`${REPO}/CareerPath-AI`} target="_blank" rel="noopener noreferrer">career-path helper</a>, an <a href={`${REPO}/SEO-Suite`} target="_blank" rel="noopener noreferrer">SEO toolkit</a>, and a handful of others. ToolAtlas is one of those projects.</p>
            <p>It started because I wanted <strong>one place to keep track of AI tools and the tech I use</strong>, instead of digging through bookmarks, newsletters, and half-remembered Reddit threads. So I built a list. The first version was a single hand-coded HTML file with no build step, just data crammed into a 7.11&nbsp;MB document.</p>
            <p>It did the job, but it was slow to open, a pain to update, and impossible to share. So I rebuilt it properly, first with Vite and now on <strong>Next.js and React</strong>, splitting the data into chunks that load on demand and building the search index ahead of time.</p>
            <p>It now holds <strong>2,386 AI tools</strong> across writing, coding, image generation, video, SEO, and a few dozen other categories, plus <strong>1,861 developer technologies</strong> covering most of the stack. I add and check entries by hand. Nothing scraped, nothing paid for a spot.</p>
            <p>The idea hasn&apos;t changed: a quick reference I&apos;d actually trust. Search is fuzzy because I make typos. There&apos;s a comparison view because picking between five similar tools is genuinely annoying. You can export your favorites because your shortlist shouldn&apos;t be locked inside someone else&apos;s app.</p>
            <p><strong>It&apos;s free and it&apos;ll stay that way.</strong> No account, no limits, no upsell. If it&apos;s useful, pass it to someone. You can find more of my work on <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>, see my <a href={PORTFOLIO} target="_blank" rel="noopener noreferrer">portfolio</a>, or say hi on <a href={TWITTER} target="_blank" rel="noopener noreferrer">Twitter</a>.</p>
          </div>
        </div>
      </section>

      <section className="stats-bar" aria-label="Catalog statistics">
        <div className="stats-inner">
          <div className="stat"><span className="stat-number" data-count="2386">0</span><span className="stat-label">AI Tools</span></div>
          <div className="stat"><span className="stat-number" data-count="1861">0</span><span className="stat-label">Tech Items</span></div>
          <div className="stat"><span className="stat-number" data-count="30" data-suffix="+">0</span><span className="stat-label">Categories</span></div>
          <div className="stat"><span className="stat-number">0</span><span className="stat-label">Paid placements</span></div>
        </div>
      </section>

      <section className="section" aria-labelledby="tech-heading">
        <div className="container">
          <div className="section-head-center">
            <div className="section-tag reveal">How It&apos;s Built</div>
            <h2 className="section-title reveal" id="tech-heading" style={{ "--delay": "60ms" }}>The tech behind the hub</h2>
            <p className="section-sub reveal" style={{ "--delay": "120ms" }}>A modern React stack on the front, a fast hand-rolled catalog engine underneath.</p>
          </div>
          <div className="tech-grid">
            {TECH.map((t, i) => (
              <div className="tech-card reveal" key={t.name} style={{ "--delay": `${(i % 3) * 80}ms` }}>
                <div className="tech-card-icon" aria-hidden="true">{t.icon}</div>
                <div className="tech-card-name">{t.name}</div>
                <p className="tech-card-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="values-heading">
        <div className="container">
          <div className="section-head-center">
            <div className="section-tag reveal">Principles</div>
            <h2 className="section-title reveal" id="values-heading" style={{ "--delay": "60ms" }}>A few things I won&apos;t compromise on</h2>
            <p className="section-sub reveal" style={{ "--delay": "120ms" }}>The rules I keep coming back to when deciding what goes in.</p>
          </div>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div className="value-card reveal" key={v.title} style={{ "--delay": `${(i % 2) * 80}ms` }}>
                <div className="value-icon" aria-hidden="true">{v.icon}</div>
                <div className="value-title">{v.title}</div>
                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="about-cta-heading">
        <div className="cta-card reveal">
          <div className="cta-glow" aria-hidden="true" />
          <div className="cta-inner">
            <h2 className="cta-title" id="about-cta-heading">See it in action</h2>
            <p className="cta-sub">4,247 tools and technologies, one fast catalog. No account needed.</p>
            <div className="cta-actions">
              <Link href="/hub" className="btn-primary" style={{ fontSize: "16px", padding: "16px 34px" }}>Open the Hub →</Link>
              <Link href="/contact" className="btn-secondary">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <Effects />
    </>
  );
}
