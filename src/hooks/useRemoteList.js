/**
 * Generic Remote List Fetcher Hook
 * 
 * Architectural Intent:
 * Abstracts the boilerplate of fetching array data (loading state, error handling, abort controllers).
 * Designed to be consumed by simple list views to avoid repetitive `useEffect` blocks.
 * 
 * Usage:
 * Pass an async `loader` function that accepts an AbortSignal.
 */
import { useEffect, useState } from "react";

export function useRemoteList(loader) {
  const [state, setState] = useState({ data: [], loading: true, error: "" });

  useEffect(() => {
    const controller = new AbortController();
    loader(controller.signal)
      .then((data) => setState({ data, loading: false, error: "" }))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setState({
            data: [],
            loading: false,
            error: "Unable to load data right now.",
          });
        }
      });
    return () => controller.abort();
  }, [loader]);

  return state;
}
