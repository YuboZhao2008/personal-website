"use client";

import { useEffect } from "react";

/** Pause decorative studies in background tabs. No animation library owns scrolling. */
export function PortfolioMotion() {
  useEffect(() => {
    const sync = () => { document.documentElement.dataset.pageHidden = String(document.hidden); };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);
  return null;
}
