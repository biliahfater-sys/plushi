import { useCallback, useEffect, useState } from "react";

const KEY = "plushi.favorites.v1";

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { favorites, toggle };
}
