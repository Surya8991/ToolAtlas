"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const f = e.currentTarget;
    const name = (f.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (f.elements.namedItem("email") as HTMLInputElement).value.trim();
    const subject = (f.elements.namedItem("subject") as HTMLSelectElement).value;
    const message = (f.elements.namedItem("message") as HTMLTextAreaElement).value.trim();

    if (!name) return setError("Please enter your name.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (!subject) return setError("Please choose a subject.");
    if (!message) return setError("Please enter a message.");

    const body = [`Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, "", message].join("\n");
    const href =
      "mailto:contact@toolatlas.dev" +
      "?subject=" + encodeURIComponent("[ToolAtlas] " + subject) +
      "&body=" + encodeURIComponent(body);
    window.location.href = href;
    setTimeout(() => setSent(true), 400);
  }

  if (sent) {
    return (
      <div className="contact-form-card">
        <div className="form-success" style={{ display: "block" }} aria-live="polite">
          <div className="form-success-icon" aria-hidden="true">🎉</div>
          <h3 className="form-success-title">Message ready to send!</h3>
          <p className="form-success-msg">
            Your email client should have opened with everything filled in.<br />
            Just hit Send and I&apos;ll get back to you.
          </p>
          <button type="button" className="form-reset-btn" onClick={() => setSent(false)}>Send another →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-card">
      <h2 className="form-title">Send a message</h2>
      <p className="form-sub">Fill in the form and it&apos;ll open your email client with everything pre-filled.</p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="cf-name">Your name <span aria-hidden="true" style={{ color: "#f87171" }}>*</span></label>
            <input type="text" id="cf-name" name="name" placeholder="Jane Smith" autoComplete="name" />
          </div>
          <div className="form-field">
            <label htmlFor="cf-email">Email address <span aria-hidden="true" style={{ color: "#f87171" }}>*</span></label>
            <input type="email" id="cf-email" name="email" placeholder="jane@example.com" autoComplete="email" />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="cf-subject">Subject <span aria-hidden="true" style={{ color: "#f87171" }}>*</span></label>
          <select id="cf-subject" name="subject" defaultValue="">
            <option value="" disabled>Choose a topic…</option>
            <option value="Bug Report">🐛 Bug Report</option>
            <option value="Tool Request">🔧 Tool / Tech Suggestion</option>
            <option value="Feature Request">✨ Feature Request</option>
            <option value="Data Correction">📝 Data Correction</option>
            <option value="Partnership">🤝 Partnership / Collaboration</option>
            <option value="General">💬 General Enquiry</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="cf-message">Message <span aria-hidden="true" style={{ color: "#f87171" }}>*</span></label>
          <textarea id="cf-message" name="message" placeholder="Describe your request or question in as much detail as you like…" />
        </div>
        {error && <div className="form-error-box" role="alert" style={{ display: "block" }}>{error}</div>}
        <button type="submit" className="form-submit">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
          </svg>
          Send Message
        </button>
        <p className="form-note">Opens your email client with the message pre-filled. Your data is never stored by this site.</p>
      </form>
    </div>
  );
}
