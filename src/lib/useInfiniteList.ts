'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useInfiniteList<T>(
  initial: T[],
  loadMore: (startIndex: number) => T[],
  pageSize = 6,
) {
  const [items, setItems] = useState<T[]>(initial);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const triggerLoad = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => {
        const next = loadMore(prev.length);
        return [...prev, ...next.slice(0, pageSize)];
      });
      setLoading(false);
      loadingRef.current = false;
    }, 450);
  }, [loadMore, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) triggerLoad();
        });
      },
      { rootMargin: '600px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerLoad]);

  const reset = useCallback((nextInitial: T[]) => {
    setItems(nextInitial);
    loadingRef.current = false;
    setLoading(false);
  }, []);

  return { items, loading, sentinelRef, reset, triggerLoad };
}
