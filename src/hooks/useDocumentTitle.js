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
