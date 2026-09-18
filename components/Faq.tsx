"use client";

import { useState } from "react";

type Item = { q: string; a: React.ReactNode };

const ITEMS: Item[] = [
  {
    q: "How do I suggest a tool or technology to add?",
    a: (
      <>Best way is to <a href="https://github.com/Surya8991/ToolAtlas/issues/new" target="_blank" rel="noopener noreferrer">open a GitHub issue</a> with the name, URL, category, and a line on what it does. I check suggestions by hand, usually within a week. The form above works too, just pick the &quot;Tool / Tech Suggestion&quot; subject.</>
    ),
  },
  {
    q: "I found outdated or incorrect information. What should I do?",
    a: (
      <><a href="https://github.com/Surya8991/ToolAtlas/issues/new" target="_blank" rel="noopener noreferrer">Open an issue</a> with the tool name and what&apos;s wrong (pricing, description, URL, category). Corrections are the fastest thing for me to fix, so don&apos;t hesitate.</>
    ),
  },
  {
    q: "Is the data available via an API or for download?",
    a: (
      <>The raw data files (<code>tools-data.js</code> and <code>tech-data.js</code>) are right there in the <a href="https://github.com/Surya8991/ToolAtlas" target="_blank" rel="noopener noreferrer">GitHub repo</a>. There&apos;s no formal API, but it&apos;s plain JSON so it&apos;s easy to work with. Ask if you need something specific.</>
    ),
  },
  {
    q: "Can I sponsor or advertise on ToolAtlas?",
    a: (
      <>I&apos;m open to tasteful, developer-focused sponsorships that don&apos;t mess with the catalog. What I won&apos;t do is sell placement. Paying won&apos;t move a tool up the rankings or into a category. If that works for you, use the form with the &quot;Partnership / Collaboration&quot; subject.</>
    ),
  },
  {
    q: "How often is the catalog updated?",
    a: (
      <>I try to refresh it monthly. The &quot;Updated May 2026&quot; badge in the hub shows the last big pass. Corrections and additions people send in get merged as I work through them.</>
    ),
  },
  {
    q: "Is ToolAtlas open source?",
    a: (
      <>Yep, all the source is on <a href="https://github.com/Surya8991/ToolAtlas" target="_blank" rel="noopener noreferrer">GitHub</a>. PRs are welcome for fixes, accessibility tweaks, and features. For anything bigger, open an issue first so we can talk it through before you put in the work.</>
    ),
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq-section" aria-labelledby="faq-heading">
      <h2 className="faq-title reveal" id="faq-heading">Frequently asked questions</h2>
      {ITEMS.map((item, i) => (
        <div className={`faq-item reveal${open === i ? " open" : ""}`} key={i}>
          <button
            className="faq-question"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
            <span className="faq-chevron" aria-hidden="true">▾</span>
          </button>
          <div className="faq-answer">{item.a}</div>
        </div>
      ))}
    </div>
  );
}
