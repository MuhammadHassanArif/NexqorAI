import { useEffect } from "react";

// Sets the browser tab title while the page is open, and restores the old one afterwards.
export function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}