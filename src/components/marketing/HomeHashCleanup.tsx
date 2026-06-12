"use client";

import { useEffect } from "react";

/**
 * Removes legacy `/#features` hash from the home URL (old footer anchor).
 */
export function HomeHashCleanup() {
  useEffect(() => {
    if (window.location.pathname === "/" && window.location.hash === "#features") {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  return null;
}
