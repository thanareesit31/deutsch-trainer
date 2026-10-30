"use client";

import { useEffect, useState } from "react";

export type A11PreviewLoader = () => Promise<{ default: { html: string } }>;

export function useA11Preview(loader: A11PreviewLoader | undefined) {
  const [state, setState] = useState<{ loader: A11PreviewLoader; html: string } | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!loader) return;
    let active = true;
    loader().then(module => {
      if (active) {
        setState({ loader, html: module.default.html });
        setError(false);
      }
    }).catch(() => {
      if (active) setError(true);
    });
    return () => { active = false; };
  }, [loader]);
  return { html: state && state.loader === loader ? state.html : null, error };
}
