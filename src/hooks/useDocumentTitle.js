/**
 * Document Title Hook
 * 
 * Architectural Intent:
 * Dynamically updates the browser tab title for SEO and UX based on the active route.
 * Automatically restores the previous title upon unmounting to maintain history cleanliness.
 */
import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | Nirbhor` : "Nirbhor - Professional Services";
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
