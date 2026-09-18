"use client";

import { useEffect, useRef } from "react";

// Version query busts the browser cache when the hub stylesheet changes.
const CSS_HREF = "/hub-app/hub.css?v=9";
const SCRIPTS = [
  "/hub-app/dataLoader.js",
  "/hub-app/tools.js",
  "/hub-app/tech.js",
  "/hub-app/main.js",
];

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = false; // preserve execution order
    s.dataset.hub = "1";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

export default function HubClient({ markup }: { markup: string }) {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    document.body.classList.add("hub-active");

    // Inject hub stylesheet (scoped to this route by removing it on unmount).
    let link = document.getElementById("hub-css") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "hub-css";
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      document.head.appendChild(link);
    }

    // Boot the catalog controllers in order, after the markup is in the DOM.
    (async () => {
      try {
        for (const src of SCRIPTS) {
          if (!mounted.current) return;
          await loadScript(src);
        }
      } catch (e) {
        console.error("[hub] failed to initialize:", e);
      }
    })();

    return () => {
      mounted.current = false;
      document.body.classList.remove("hub-active");
      document.getElementById("hub-css")?.remove();
      document.querySelectorAll('script[data-hub="1"]').forEach((el) => el.remove());
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}
