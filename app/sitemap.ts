import type { MetadataRoute } from "next";

const BASE = "https://toolatlas.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/hub", priority: 0.9 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.6 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}
