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
