"use client";
// Drives the client-side data lifecycle for /hub: tools load eagerly on mount
// (needed for first paint of the default AI Tools tab), tech + the global
// search index load lazily on demand (first Tech-tab visit / first search),
// exactly matching the legacy main.js loading sequence -- just typed and
// without the effect coordinating over raw DOM element lookups.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ToolsData, TechItem, SearchIndexEntry } from "./types";
import { loadToolsData, loadTechData, loadSearchIndex } from "./loadCatalog";

interface AsyncSlice<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const idle = <T,>(): AsyncSlice<T> => ({ data: null, loading: false, error: null });

export interface CatalogData {
  tools: AsyncSlice<ToolsData>;
  tech: AsyncSlice<TechItem[]>;
  searchIndex: AsyncSlice<SearchIndexEntry[]>;
  /** Idempotent -- safe to call repeatedly (e.g. every time the Tech tab is opened). */
  ensureTech: () => void;
  /** Idempotent -- safe to call repeatedly (e.g. every time search opens). */
  ensureSearchIndex: () => void;
}

export function useCatalogData(): CatalogData {
  const [tools, setTools] = useState<AsyncSlice<ToolsData>>({ data: null, loading: true, error: null });
  const [tech, setTech] = useState<AsyncSlice<TechItem[]>>(idle);
  const [searchIndex, setSearchIndex] = useState<AsyncSlice<SearchIndexEntry[]>>(idle);

  const techRequested = useRef(false);
  const searchRequested = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadToolsData()
      .then((data) => {
        if (!cancelled) setTools({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setTools({ data: null, loading: false, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ensureTech = useCallback(() => {
    if (techRequested.current) return;
    techRequested.current = true;
    setTech((s) => ({ ...s, loading: true }));
    loadTechData()
      .then((data) => setTech({ data, loading: false, error: null }))
      .catch((err: Error) => setTech({ data: null, loading: false, error: err.message }));
  }, []);

  const ensureSearchIndex = useCallback(() => {
    if (searchRequested.current) return;
    searchRequested.current = true;
    setSearchIndex((s) => ({ ...s, loading: true }));
    loadSearchIndex()
      .then((data) => setSearchIndex({ data, loading: false, error: null }))
      .catch((err: Error) => setSearchIndex({ data: null, loading: false, error: err.message }));
  }, []);

  return { tools, tech, searchIndex, ensureTech, ensureSearchIndex };
}
