import { getCatalogStats } from "@/lib/catalogStats";
import { buildHubMarkup } from "@/lib/hubMarkup";
import HubClient from "@/components/HubClient";

// Server Component: computes the real catalog stats (needs `fs`, so this
// file must stay outside the "use client" boundary) and bakes them into the
// initial markup before handing off to the client runtime in HubClient.
export default function HubPage() {
  const stats = getCatalogStats();
  const markup = buildHubMarkup(stats);
  return <HubClient markup={markup} />;
}
