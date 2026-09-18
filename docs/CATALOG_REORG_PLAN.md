# ToolAtlas Catalog Reorganization — Implementation Plan

**Status:** Proposal — no data files changed yet.
**Scope:** `public/data/tools-data.js` taxonomy only (tech-data.js categories are not covered here).
**Author:** Drafted by Claude, based on a live audit of the current 2,324-tool catalog (2026-09-18).

## Why

The catalog's 34 flat category tabs have three concrete problems, found by inspecting the live data rather than guessing:

1. **One category is 13.5% of the whole catalog.** "Cybersecurity & Privacy" holds 315 of 2,324 tools — nearly 2x the next-largest category (AI Coding & Dev Tools, 164). It's a dumping ground, not a browsable category.
2. **That mega-category is internally inconsistent.** Its "Privacy Tools" sub-label (52 items) mixes pentesting tools (Burp Suite, Metasploit, Nmap), EDR platforms (CrowdStrike, SentinelOne), identity infra (Auth0, Clerk, Okta, WorkOS), and consumer VPNs (ExpressVPN, Mullvad, NordVPN) under one meaningless label. Two items in there aren't security tools at all (Amazon Q Developer, Tabnine — both coding assistants).
3. **Two categories group by delivery format, not function.** "AI Browser Extensions" (118 items) and "Useful Websites & Utilities" (84 items) sort tools by *how you access them*, not *what they do*. A writing-assistant browser extension is invisible to someone browsing "AI Writing" because it got filed under "extension" instead.

## Part 1 — Group the 34 categories into 9 departments

No tools move category yet in this part — this only adds a parent grouping layer above the existing category tabs, for navigation. Every current `tool-cat-*` id and count is preserved as a subtab.

| # | Department | Subcategories (existing tabs, unchanged) | Total |
|---|---|---|---|
| 1 | **AI Assistants & Agents** | Chatbots (31), Search & Answer Engines (24), Agents & Automation (116) | 171 |
| 2 | **Creative & Content Generation** | Image (50), Video (83), Voice/Audio/Music (17), Design & Presentation (73), 3D/Game (55) | 278 |
| 3 | **Developer & Infrastructure** | Coding & Dev Tools (164), API & Developer Platforms (115), AI Infra & Model Ops (78), Data & Analytics (38) | 395 |
| 4 | **Growth & Marketing** | SEO (108), Digital Marketing (97), Social Media (41), AI Writing (35), E-commerce (54) | 335 |
| 5 | **Business Operations** | Sales & CRM (73), HR & Recruiting (87), Finance & Accounting (53), Legal & Contracts (44), Project Management (42), Productivity (42), Customer Support (43) | 384 |
| 6 | **Knowledge & Learning** | Research (58), Knowledge & PKM (26), Learning & Education (47), Translation (25), Meeting Assistants (58) | 214 |
| 7 | **Live & Audio Media** | Podcasting (30), Streaming (31) | 61 |
| 8 | **Security & Trust** | *see Part 2 — re-split from the 315-item mega-bucket* | 315 |
| 9 | **Resources & Directories** | *see Part 3 — reorganized from "Useful Websites"* | ~84 |

"AI Browser Extensions" (118) is not a department — it's dissolved in Part 4.

## Part 2 — Split "Security & Trust" into 6 real subcategories

The existing `primary_group` sub-labels already contain a decent taxonomy for **246 of 315 items** — they just need promoting to real tabs. The other **69 items** sit in two mislabeled catch-alls ("Privacy Tools", 52; "Passwords VPN & Privacy Tools", 17) and need per-item reassignment. That reassignment is done below — every one of the 69 is placed by hand, not sampled.

| New subcategory | From existing clean sub-labels | + reclassified from the 2 catch-alls | Total |
|---|---|---|---|
| **A. Pentest, AppSec & Vulnerability** | Vulnerability & Pentest (26) + Bug Bounty & Security Learning (23) + AppSec & Code Security (21) + Code Security (1) = 71 | Aikido Security, Burp Suite, Metasploit, Nmap, Snyk Code, Snyk DeepCode AI, Wireshark (7) | **78** |
| **B. Cloud, Network & Endpoint Security** | Container/K8s/IaC (16) + Cloud CNAPP/CSPM (15) + Cloud Security (3) + Zero Trust Networking (2) = 36 | Cloudflare, Bitdefender, Malwarebytes, Twingate, ZeroTier (5) | **41** |
| **C. SIEM, Threat Intel & Detection** | SIEM/SOAR/SOC/XDR (19) + Threat Intelligence (17) + Email/Domain/Phishing (14) = 50 | CrowdStrike, SentinelOne, Shodan (3) | **53** |
| **D. Identity, Secrets & Compliance** | Identity/Zero Trust (10) + Secrets/Supply Chain (10) + Secrets Mgmt (3) + Secret Scanning (2) + Software Supply Chain (1) + Compliance/GRC (12) + Data Protection/DLP/Backup (12) = 50 | Auth0 (Okta), Clerk, Drata, Infisical, Okta, Secureframe, Socket, Teleport, Vanta, WorkOS (10) | **60** |
| **E. Privacy, VPN & Encrypted Comms** | Encrypted Comm/Privacy (21) + Privacy DNS (1) + VPN (1) + Scam Protection (1) = 24 | Brave, CalyxOS, Cloaked, Cryptomator, DeleteMe, DuckDuckGo, EasyOptOuts, ExpressVPN, Firefox Relay, GrapheneOS, Incogni, IVPN, Mullvad, MySudo, NordVPN, Optery, Privacy.com, Proton Drive, ProtonMail, ProtonVPN, SimpleLogin, Surfshark, Sync.com, Tresorit, Tutanota (25) + AdGuard DNS, Control D, LibreWolf, Mozilla VPN, NextDNS, Quad9, Tor Browser, Windscribe (8) | **57** |
| **F. Password Managers** | Password Managers (12) | Apple Passwords, Enpass, KeePassXC, LessPass, Padloc, pass, Psono, RoboForm, Vaultwarden (9) | **21** |
| *(residual)* Security Utilities | 3 (unclassified, review at execution) | — | **3** |
| **Moved out of Security entirely** | — | Amazon Q Developer, Tabnine → **AI Coding & Dev Tools** (both are coding assistants, not security tools) | **−2** |

Check: 78+41+53+60+57+21+3 = 313, plus the 2 moved out = **315** ✓ (matches the current bucket exactly).

## Part 3 — Reorganize "Useful Websites & Utilities" (84 items, 42 micro-labels)

This category is genuinely different in kind from the rest of the catalog — quick reference sites and utilities (Archive.org, GTmetrix, Namechk, tldraw), not SaaS products with pricing. Recommend keeping it as its own department but consolidating its 42 one-or-two-item micro-labels into 7 real subcategories:

| Subcategory | Rough count | Examples |
|---|---|---|
| Developer Resources | ~26 | Developer Discovery, Developer Learning, Package Analysis, Regex/JSON/API testing utilities |
| Design & UX Inspiration | ~15 | Design Inspiration, UX Case Studies, Font Pairing, Whiteboarding |
| Discovery & Directories | ~13 | Product/Tool/Software/Startup Discovery, AI Tool Directories |
| Research & Intelligence | ~10 | Company Research, Market Intelligence, Domain/Username Search |
| Marketing & Email Resources | ~5 | Email/Marketing Inspiration, Email Utilities |
| Testing & Diagnostics | ~3 | Website Performance, Status Monitoring |
| Misc Utilities | ~4 | PDF, Web Archive, Reader, Sustainability tools |
| *(generic residual)* "Useful Websites" | 7 | Truly uncategorizable one-offs |

*(Counts above are ~84 total but approximate on the smallest 1-item labels — confirm exact bucket at execution time; the rule for each is unambiguous, just not hand-verified item-by-item here.)*

## Part 4 — Dissolve "AI Browser Extensions" into a facet

Its own sub-labels already map cleanly onto existing departments — the format ("it's a browser extension") should become a filter chip, not the primary category:

| Sub-label (current) | Count | Target department |
|---|---|---|
| Developer Browser Tools | 36 | Developer & Infrastructure |
| SEO & Marketing Extensions | 16 | Growth & Marketing |
| Search & Research Assistants | 13 | Knowledge & Learning |
| Writing Extensions | 13 | Growth & Marketing (AI Writing) |
| Reading & Summarization | 11 | Knowledge & Learning |
| Productivity & Tab Management | 8 | Business Operations |
| General Browser AI | 8 | AI Assistants & Agents |
| Email Assistants | 7 | Business Operations |
| Browser Automation | 5 | Developer & Infrastructure (or Agents) |
| Terminal / CLI AI | 1 | Developer & Infrastructure |

**Schema change needed:** add a `delivery_format` field (e.g. `["web", "browser_extension", "desktop", "api"]`) to each affected tool, preserved as a cross-cutting filter in the hub UI, while `primary_category`/`placements` move to the real functional department above.

## Rollout steps

1. Add `delivery_format` field to schema (additive, non-breaking).
2. Run the Security re-split (Part 2) — update `primary_category`/`primary_group`/`placements` for all 315 items per the table above; move the 2 miscategorized tools out.
3. Run the Browser Extensions dissolution (Part 4) — reassign 118 items' `primary_category`, tag `delivery_format: browser_extension`.
4. Run the Useful Websites consolidation (Part 3) — regroup 84 items into 7 subcategories.
5. Add the 9 department-level parent tabs to `categories[]` (new `tabId`s, e.g. `dept-security`), each listing its existing/new child `tool-cat-*` ids — additive, doesn't remove any existing tab.
6. Recompute every category count from `placements` (same pattern already used in the video-model and dedupe commits on this branch).
7. Resync `search-index.js` (`c` field per entry should reflect the corrected `primary_category`).
8. Spot-check: no tool should belong to zero categories; no category should drop to 0 unexpectedly; `tab-0` (Master List) count stays exactly 2,324.

## What this does NOT do

- Does not touch `tech-data.js` (a separate audit would apply the same "format vs. function" lens there — e.g. its npm-package/docker-image/awesome-list split, noted in the earlier dedupe pass, is intentional and likely fine as-is).
- Does not delete or merge any tools — this is a pure re-categorization.
- Does not change pricing, descriptions, or any other field.
