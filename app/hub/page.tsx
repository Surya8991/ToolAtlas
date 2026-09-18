import { getCatalogStats } from "@/lib/catalogStats";
import HubClient from "@/components/hub/HubClient";

// Server Component: computes the real catalog stats (needs `fs`, so this file
// must stay outside the "use client" boundary) and passes them down as typed
// props for HubClient's SSR-correct first paint (header counts render right
// away; the client-side catalog load, tools then lazy tech, hydrates in after).
//
// The legacy dangerouslySetInnerHTML implementation (components/HubClient.tsx
// + lib/hubMarkup.ts + public/hub-app/*.js) is kept as reference until the
// Phase 7 cutover; this route no longer references any of it.
export default function HubPage() {
  const stats = getCatalogStats();
  return <HubClient stats={stats} />;
}
