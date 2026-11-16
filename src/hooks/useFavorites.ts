import { useCallback, useEffect, useState } from 'react';

const FAVORITES_STORAGE_KEY = 'sweetmarket_favorites';
const FOLLOWED_BAKERIES_STORAGE_KEY = 'sweetmarket_followed_bakeries';

function readStringArray(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

function writeStringArray(key: string, values: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    readStringArray(FAVORITES_STORAGE_KEY),
  );
  const [followedBakeryIds, setFollowedBakeryIds] = useState<string[]>(() =>
    readStringArray(FOLLOWED_BAKERIES_STORAGE_KEY),
  );

  useEffect(() => {
    writeStringArray(FAVORITES_STORAGE_KEY, favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    writeStringArray(FOLLOWED_BAKERIES_STORAGE_KEY, followedBakeryIds);
  }, [followedBakeryIds]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds],
  );

  const toggleFollowBakery = useCallback((bakeryId: string) => {
    setFollowedBakeryIds((prev) =>
      prev.includes(bakeryId)
        ? prev.filter((id) => id !== bakeryId)
        : [...prev, bakeryId],
    );
  }, []);

  const isFollowingBakery = useCallback(
    (bakeryId: string) => followedBakeryIds.includes(bakeryId),
    [followedBakeryIds],
  );

  return {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    followedBakeryIds,
    toggleFollowBakery,
    isFollowingBakery,
  };
}
