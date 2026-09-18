import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Effects from "@/components/Effects";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "Contact",
  description: "Report a bug, suggest a tool, request a feature, or just say hello.",
};

const REPO = "https://github.com/Surya8991/ToolAtlas";

export default function Contact() {
  return (
    <>
      <SiteNav />

      <header className="page-hero" aria-label="Contact page header">
        <div className="hero-orb o1" aria-hidden="true" />
        <div className="hero-orb o2" aria-hidden="true" />
        <div className="page-hero-inner">
          <div className="page-hero-tag reveal">Contact</div>
          <h1 className="page-hero-title reveal" style={{ "--delay": "60ms" }}>
            Say <span className="grad">hello.</span>
          </h1>
          <p className="page-hero-sub reveal" style={{ "--delay": "140ms" }}>
            Found a bug, know a tool I should add, or have an idea? Send it over. I read everything.
          </p>
        </div>
      </header>

      <div className="contact-grid">
        <div className="reveal">
          <h2 className="contact-info-title">Get in touch</h2>
          <p className="contact-info-sub">
            The quickest way to reach me is a GitHub issue. It keeps things public and searchable, so the next
            person with the same question can find the answer. Prefer email? That works too.
          </p>

          <div className="contact-methods">
            <a href={`${REPO}/issues/new/choose`} target="_blank" rel="noopener noreferrer" className="contact-method" aria-label="Open a GitHub issue">
              <div className="contact-method-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
              </div>
              <div><div className="contact-method-title">GitHub Issues</div><div className="contact-method-value">github.com/Surya8991/ToolAtlas (preferred)</div></div>
            </a>
            <a href={`${REPO}/issues/new?labels=tool-request`} target="_blank" rel="noopener noreferrer" className="contact-method" aria-label="Suggest a tool to add">
              <div className="contact-method-icon" aria-hidden="true">🔧</div>
              <div><div className="contact-method-title">Suggest a Tool</div><div className="contact-method-value">Open a Tool Request issue on GitHub</div></div>
            </a>
            <a href={`${REPO}/issues/new?labels=bug`} target="_blank" rel="noopener noreferrer" className="contact-method" aria-label="Report a bug">
              <div className="contact-method-icon" aria-hidden="true">🐛</div>
              <div><div className="contact-method-title">Report a Bug</div><div className="contact-method-value">Open a Bug Report issue on GitHub</div></div>
            </a>
          </div>

          <div className="contact-note">
            <strong>⏱ Response times</strong>
            I usually get to GitHub issues within a couple of days. The form opens your email client, and replies to those take a bit longer, but I do get to them.
          </div>
        </div>

        <div className="reveal" style={{ "--delay": "100ms" }}>
          <ContactForm />
        </div>
      </div>

      <Faq />

      <SiteFooter />
      <Effects />
    </>
  );
}
