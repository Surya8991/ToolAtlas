// Precise types for the real shape of public/data/*.js, as it exists on disk today
// (checked against live samples, not an idealized schema). These are the exact
// fields the legacy vanilla-JS hub (public/hub-app/{tools,tech,main}.js) reads;
// the React rebuild ports that logic against this contract instead of re-deriving
// field names from memory. Optional markers reflect fields that are present on
// most but not provably all records.

/** One row of `tool.placements[]` -- which tab/category/group a tool appears under. */
export interface ToolPlacement {
  tabId: string;
  category: string;
  group: string;
}

export interface Tool {
  id: string;
  name: string;
  url: string;
  domain: string;
  description: string;
  pricing: string;
  tags: string[];
  placements: ToolPlacement[];
  searchText: string;
  tagline?: string;
  logoUrl?: string;
  useCases?: string[];
  keyFeatures?: string[];
  integrations?: string[];
  platforms?: string[];
  /** Legacy camelCase duplicate of open_source; both appear in the data, keep both. */
  openSource?: boolean;
  status?: string;
  alternativeIds?: string[];
  last_verified?: string;
  source_url?: string;
  best_for?: string;
  risk_notes?: string;
  score_confidence?: string;
  popularity_score?: number;
  quality_score?: number;
  freshness_score?: number;
  trust_score?: number;
  final_rank_score?: number;
  open_source?: boolean;
  has_free_plan?: boolean;
  api_available?: boolean;
  target_user?: string[];
  tool_type?: string;
  primary_category?: string;
  primary_group?: string;
  last_tag_cleanup?: string;
  description_status?: string;
  pricing_confidence?: string;
  verification_status?: string;
  item_type?: string;
}

export interface TechItem {
  id: string;
  name: string;
  icon?: string;
  /** Raw category slug -- may be a legacy/duplicate spelling, see catalogStats.ts TECH_TILE_CATEGORY_IDS. */
  category: string;
  sub?: string;
  desc?: string;
  url: string;
  github?: string;
  tags?: string[];
  badges?: string[];
  stars?: string;
  source_url?: string;
  status?: string;
  last_verified?: string;
  best_for?: string;
  risk_notes?: string;
  score_confidence?: string;
  popularity_score?: number;
  quality_score?: number;
  freshness_score?: number;
  trust_score?: number;
  final_rank_score?: number;
  domain?: string;
  description?: string;
  github_repo?: string;
  open_source?: boolean;
  has_free_plan?: boolean;
  api_available?: boolean;
  platforms?: string[];
  target_user?: string[];
  tech_type?: string;
  package_manager?: string;
  package_name?: string;
  stars_or_installs?: string;
  previous_category?: string;
  previous_category_label?: string;
  category_label?: string;
  group?: string;
  taxonomy_version?: string;
  last_tag_cleanup?: string;
  verification_status?: string;
  source_confidence?: string;
  description_status?: string;
  searchText?: string;
}

/**
 * A row in tools-data.js's `categories[]`. `parentId` is null for the "tab-0"
 * Master List and the 9 "dept-*" department umbrellas; for a "tool-cat-*" leaf
 * it is the id of the owning department -- this is what lets the sidebar build
 * a two-level department tree instead of a flat list.
 */
export interface Category {
  id: string;
  label: string;
  count: number;
  parentId: string | null;
}

export interface ToolsAudit {
  last_phase_update?: string;
  phase1_tools_added?: number;
  phase1_tools_skipped?: number;
  [key: string]: unknown;
}

export interface ToolsData {
  categories: Category[];
  tools: Tool[];
  audit?: ToolsAudit;
}

/** One entry of window.__SEARCH_INDEX__ -- a flattened, pre-lowercased index over both tools and tech. */
export interface SearchIndexEntry {
  /** Section this record belongs to. */
  s: "tools" | "tech";
  id: string;
  /** Display name. */
  n: string;
  /** Primary category label. */
  c: string;
  /** Pre-lowercased searchable keyword blob. */
  k: string;
  rank: number;
}

export type HubSection = "tools" | "tech";

export type Density = "compact" | "default" | "comfortable";

export type SortMode =
  | "relevance"
  | "name-asc"
  | "name-desc"
  | "rank-desc"
  | "popularity-desc"
  | "recently-verified";

export type FilterPreset = "all" | "free" | "open-source" | "websites-only" | "tools-only";

export interface AdvancedFilters {
  pricing?: string[];
  targetUser?: string[];
  platforms?: string[];
  apiAvailable?: boolean;
}

/** Client-side view state for one section (tools or tech); mirrors the legacy per-section controller state. */
export interface SectionFilterState {
  activeCategory: string;
  activeGroup: string | null;
  query: string;
  sortMode: SortMode;
  activePreset: FilterPreset;
  advFilters: AdvancedFilters;
  density: Density;
  /** id of the currently-open department dropdown in the sidebar, or null when all are closed. */
  openDept: string | null;
  /** How many cards of the current filtered set are rendered (pagination via "Show N more"). */
  visibleCount: number;
}

export interface FilterState {
  section: HubSection;
  tools: SectionFilterState;
  tech: SectionFilterState;
  compareIds: string[];
  favorites: string[];
  recent: string[];
}

export const CARD_PAGE_SIZE = 60;

export const STORAGE_KEYS = {
  favorites: "master_tools_favorites_v2",
  recent: "master_tools_recent_v1",
  density: "master_tools_density_v1",
  section: "hubSection",
  searchRecent: "hub_global_search_recent_v1",
} as const;
