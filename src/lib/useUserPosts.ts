'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeJson } from '@/lib/storage';
import { currentUser, type Post } from '@/lib/mock-data';

const STORAGE_KEY = 'pulse.userPosts.v1';

/** Build a fully-formed Post from composed text, attributed to the current user. */
export function buildUserPost(body: string): Post {
  return {
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    author: currentUser,
    postedAt: 'Just now',
    body: body.trim(),
    metrics: { likes: 0, comments: 0, shares: 0, bookmarks: 0 },
    category: 'foryou',
  };
}

function read(): Post[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Post[]) : [];
  } catch {
    return [];
  }
}

function write(posts: Post[]): void {
  writeJson(STORAGE_KEY, posts);
}

/**
 * Client-side persistent store for posts the user composes.
 *
 * Posts are kept newest-first in localStorage so they survive reloads and are
 * shared across tabs (via the `storage` event). This is a real, working feature
 * on top of the otherwise mock feed — the composer adds here optimistically and
 * the home feed prepends these to the generated content.
 */
export function useUserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  // Hydrate after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setPosts(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setPosts(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addPost = useCallback((body: string): Post => {
    const post = buildUserPost(body);
    setPosts((current) => {
      const next = [post, ...current];
      write(next);
      return next;
    });
    return post;
  }, []);

  const removePost = useCallback((id: string) => {
    setPosts((current) => {
      const next = current.filter((p) => p.id !== id);
      write(next);
      return next;
    });
  }, []);

  const clearPosts = useCallback(() => {
    setPosts([]);
    write([]);
  }, []);

  return { posts, addPost, removePost, clearPosts };
}
