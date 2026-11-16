import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router does not scroll to "#section" links by itself, so we do it here.
// "key" changes on every navigation, so clicking the same link twice still scrolls.
export function useScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));

    // Wait one frame so the page has finished rendering
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
}