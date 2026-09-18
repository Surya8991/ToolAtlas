import Link from "next/link";

const REPO = "https://github.com/Surya8991/ToolAtlas";

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
              </svg>
            </span>
            ToolAtlas
          </div>
          <p className="footer-tagline">
            The developer&apos;s catalog for AI tools and technology stacks. Curated, searchable, always free.
          </p>
          <div className="footer-socials">
            <a href={REPO} className="footer-social" aria-label="GitHub repository" target="_blank" rel="noopener noreferrer">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Pages</div>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/hub">Browse Hub</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">AI Tools</div>
          <ul className="footer-links">
            <li><Link href="/hub#tools/tool-cat-writing">Writing</Link></li>
            <li><Link href="/hub#tools/tool-cat-coding">Coding</Link></li>
            <li><Link href="/hub#tools/tool-cat-image">Image Gen</Link></li>
            <li><Link href="/hub#tools/tool-cat-seo">SEO</Link></li>
            <li><Link href="/hub#tools/tool-cat-video">Video</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Tech Stack</div>
          <ul className="footer-links">
            <li><Link href="/hub#tech">Frontend</Link></li>
            <li><Link href="/hub#tech">Backend</Link></li>
            <li><Link href="/hub#tech">Databases</Link></li>
            <li><Link href="/hub#tech">DevOps</Link></li>
            <li><Link href="/hub#tech">Mobile</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">© 2026 ToolAtlas. Built for the developer community.</p>
        <div className="footer-bottom-links">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
