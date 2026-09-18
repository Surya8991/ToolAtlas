import type { Metadata } from "next";
import { getCatalogStats } from "@/lib/catalogStats";

const stats = getCatalogStats();

export const metadata: Metadata = {
  title: "Browse AI Tools & Tech Stack",
  description: `Browse ${stats.totalTools.toLocaleString()} AI Tools and ${stats.totalTech.toLocaleString()} Developer Technologies. Filter, compare, and discover with fuzzy search.`,
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
