// Single source of truth for every count shown across the site.
// Reads the real public/data/*.js catalog files at build/request time
// (Server Components + generateMetadata only -- this module uses `fs`
// and must never be imported from a "use client" file or a module that
// one imports; do the fs read here, then pass plain numbers/strings down
// as props). Never hand-write a total anywhere else in the app.

import fs from "node:fs";
import path from "node:path";

interface ToolPlacement {
  tabId: string;
  category: string;
  group: string;
}

interface Tool {
  placements?: ToolPlacement[];
  last_verified?: string;
}

interface ToolsCategory {
  id: string;
  label: string;
  count: number;
}

interface ToolsData {
  categories: ToolsCategory[];
  tools: Tool[];
}

interface TechItem {
  category: string;
  last_verified?: string;
}

function readWindowAssignedJson<T>(fileName: string): T {
  const filePath = path.join(process.cwd(), "public", "data", fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^\s*window\.\w+\s*=\s*/);
  if (!match) throw new Error(`${fileName}: expected a "window.X = ..." assignment`);
  let body = raw.slice(match[0].length).trim();
  if (body.endsWith(";")) body = body.slice(0, -1);
  return JSON.parse(body) as T;
}

// Tech category ids carry a handful of legacy/duplicate spellings left over
// from an earlier taxonomy pass (e.g. "frontend_ui" and the older
// "frontend_frameworks_ui"). Until tech-data.js gets the same category
// cleanup tools-data.js received, sum every known alias so the displayed
// counts stay accurate rather than silently undercounting.
const TECH_TILE_CATEGORY_IDS: Record<string, string[]> = {
  frontend: ["frontend_ui", "frontend_frameworks_ui"],
  backend: ["backend_servers", "backend_frameworks_servers", "apis_sdks_dev_platforms", "apis_sdks_developer_platforms", "fullstack_web", "full_stack_web_frameworks"],
  databases: ["databases_storage_search"],
  devops: ["devops_infra", "devops_containers_infrastructure", "cloud_hosting"],
  mobile: ["mobile_desktop"],
  testing: ["testing_qa", "testing_quality_assurance"],
  security: ["security_auth_identity"],
};

export interface CatalogStats {
  totalTools: number;
  totalTech: number;
  totalItems: number;
  /** Real subcategory tabs under the AI Tools taxonomy (excludes the 9 department umbrella tabs and Master List). */
  toolSubcategoryCount: number;
  /** The 9 department umbrella tabs added by the 2026-09 reorg. */
  toolDepartmentCount: number;
  /** Human label for the most recent verification pass across the whole catalog, e.g. "September 2026". */
  lastUpdatedLabel: string;
  toolCategoryCounts: Record<string, number>;
  techTileCounts: Record<string, number>;
  /** Combined size, in whole MB, of tools-data.js + tech-data.js + search-index.js as shipped in public/data. */
  dataSizeMB: number;
}

function monthYear(dateStr: string): string {
  const [y, m] = dateStr.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[(m ?? 1) - 1]} ${y}`;
}

let cached: CatalogStats | null = null;

export function getCatalogStats(): CatalogStats {
  if (cached) return cached;

  const toolsData = readWindowAssignedJson<ToolsData>("tools-data.js");
  const techData = readWindowAssignedJson<TechItem[]>("tech-data.js");

  const totalTools = toolsData.tools.length;
  const totalTech = techData.length;

  const toolCategoryCounts: Record<string, number> = {};
  let toolDepartmentCount = 0;
  let toolSubcategoryCount = 0;
  for (const cat of toolsData.categories) {
    toolCategoryCounts[cat.id] = cat.count;
    if (cat.id === "tab-0") continue;
    if (cat.id.startsWith("dept-")) toolDepartmentCount++;
    else toolSubcategoryCount++;
  }

  const techByRawCategory: Record<string, number> = {};
  for (const item of techData) {
    techByRawCategory[item.category] = (techByRawCategory[item.category] ?? 0) + 1;
  }
  const techTileCounts: Record<string, number> = {};
  for (const [tile, ids] of Object.entries(TECH_TILE_CATEGORY_IDS)) {
    techTileCounts[tile] = ids.reduce((sum, id) => sum + (techByRawCategory[id] ?? 0), 0);
  }

  let latest = "2026-01-01";
  for (const t of toolsData.tools) {
    if (t.last_verified && t.last_verified > latest) latest = t.last_verified;
  }
  for (const t of techData) {
    if (t.last_verified && t.last_verified > latest) latest = t.last_verified;
  }

  const dataDir = path.join(process.cwd(), "public", "data");
  const dataSizeBytes = ["tools-data.js", "tech-data.js", "search-index.js"].reduce(
    (sum, f) => sum + fs.statSync(path.join(dataDir, f)).size,
    0
  );

  cached = {
    totalTools,
    totalTech,
    totalItems: totalTools + totalTech,
    toolSubcategoryCount,
    toolDepartmentCount,
    lastUpdatedLabel: monthYear(latest),
    toolCategoryCounts,
    techTileCounts,
    dataSizeMB: Math.round((dataSizeBytes / (1024 * 1024)) * 10) / 10,
  };
  return cached;
}
