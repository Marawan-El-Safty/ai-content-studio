"use client";

import { useCallback, useEffect, useState } from "react";
import type { Draft } from "@/lib/types";
import { uid } from "@/lib/utils";

const STORAGE_KEY = "acs.library.v1";

/**
 * Content library store. Persists to localStorage today; the shape is
 * Supabase-ready (see README) so swapping in a remote table is a drop-in
 * change without touching the UI.
 */
export function useLibrary() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDrafts(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: Draft[]) => {
    setDrafts(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage full / unavailable — keep in-memory */
    }
  }, []);

  const save = useCallback(
    (draft: Omit<Draft, "id" | "createdAt" | "favorite">) => {
      const entry: Draft = {
        ...draft,
        id: uid(),
        createdAt: new Date().toISOString(),
        favorite: false,
      };
      setDrafts((prev) => {
        const next = [entry, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      });
      return entry;
    },
    [],
  );

  const remove = useCallback(
    (id: string) => persist(drafts.filter((d) => d.id !== id)),
    [drafts, persist],
  );

  const toggleFavorite = useCallback(
    (id: string) =>
      persist(
        drafts.map((d) =>
          d.id === id ? { ...d, favorite: !d.favorite } : d,
        ),
      ),
    [drafts, persist],
  );

  return { drafts, ready, save, remove, toggleFavorite };
}
