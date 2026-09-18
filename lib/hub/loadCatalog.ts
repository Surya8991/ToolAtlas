"use client";
// Typed port of public/hub-app/dataLoader.js. Same idempotent-append strategy
// (safe to call more than once -- React StrictMode double-invokes effects in
// dev) but with real return types instead of an untyped `window[name]` read,
// and one function per dataset instead of a stringly-typed globalVarName arg.

import type { ToolsData, TechItem, SearchIndexEntry } from "./types";

declare global {
  interface Window {
    __TOOLS_DATA__?: ToolsData;
    __TECH_DATA__?: TechItem[];
    __SEARCH_INDEX__?: SearchIndexEntry[];
  }
}

const cache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function loadGlobalScript<T>(scriptUrl: string, globalVarName: string): Promise<T> {
  if (cache.has(globalVarName)) {
    return Promise.resolve(cache.get(globalVarName) as T);
  }
  const existing = inflight.get(globalVarName);
  if (existing) return existing as Promise<T>;

  const promise = new Promise<T>((resolve, reject) => {
    const w = window as unknown as Record<string, T>;
    if (w[globalVarName]) {
      cache.set(globalVarName, w[globalVarName]);
      resolve(w[globalVarName]);
      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.dataset.hubData = "1";
    script.onload = () => {
      const value = w[globalVarName];
      if (value === undefined) {
        reject(new Error(`${scriptUrl} loaded but window.${globalVarName} was not set`));
        return;
      }
      cache.set(globalVarName, value);
      resolve(value);
    };
    script.onerror = () => {
      reject(new Error(`Failed to load ${scriptUrl}`));
    };
    document.head.appendChild(script);
  }).finally(() => {
    inflight.delete(globalVarName);
  });

  inflight.set(globalVarName, promise);
  return promise;
}

export function loadToolsData(): Promise<ToolsData> {
  return loadGlobalScript<ToolsData>("/data/tools-data.js", "__TOOLS_DATA__");
}

export function loadTechData(): Promise<TechItem[]> {
  return loadGlobalScript<TechItem[]>("/data/tech-data.js", "__TECH_DATA__");
}

export function loadSearchIndex(): Promise<SearchIndexEntry[]> {
  return loadGlobalScript<SearchIndexEntry[]>("/data/search-index.js", "__SEARCH_INDEX__");
}
