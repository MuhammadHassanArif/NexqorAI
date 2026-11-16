import { useCallback, useEffect, useRef, useState } from "react";

// Loads data when a page opens and gives { data, error, isLoading, reload }.
//   fetcher  a function that returns a promise, for example () => projectService.list()
//   key      change it to load again (for example when a filter changes)
export function useApiData(fetcher, key = "") {
  const fetcherRef = useRef(fetcher);
  const [state, setState] = useState({ data: null, error: null, isLoading: true });
  const [reloadCount, setReloadCount] = useState(0);

  // Always call the newest fetcher, without loading again on every render
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, error: null, isLoading: true }));

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, isLoading: false });
      })
      .catch((error) => {
        if (!cancelled) setState((current) => ({ data: current.data, error, isLoading: false }));
      });

    return () => {
      cancelled = true;
    };
  }, [key, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return { ...state, reload };
}