'use client';

import { useCallback, useEffect, useState } from 'react';
import { writeJson } from '@/lib/storage';
import {
  parseCollections,
  togglePostInCollection,
  type Collection,
} from '@/lib/collections';

const STORAGE_KEY = 'pulse.collections.v1';

function read(): Collection[] {
  if (typeof window === 'undefined') return [];
  return parseCollections(window.localStorage.getItem(STORAGE_KEY));
}

function write(collections: Collection[]): void {
  writeJson(STORAGE_KEY, collections);
}

/**
 * User-created bookmark collections, persisted.
 *
 * "New collection" was a dead button; this is what it now does. Built-in
 * filters stay tag-driven (see BUILT_IN) — these are the viewer's own folders.
 */
export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    setCollections(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCollections(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const createCollection = useCallback((name: string) => {
    const collection: Collection = {
      // Time-based ids collide only if two are created in the same millisecond,
      // which the name-uniqueness check already prevents.
      id: `col-${Date.now().toString(36)}`,
      name: name.trim(),
      postIds: [],
    };
    setCollections((current) => {
      const next = [...current, collection];
      write(next);
      return next;
    });
    return collection;
  }, []);

  const togglePost = useCallback((collectionId: string, postId: string) => {
    setCollections((current) => {
      const next = togglePostInCollection(current, collectionId, postId);
      write(next);
      return next;
    });
  }, []);

  const deleteCollection = useCallback((collectionId: string) => {
    setCollections((current) => {
      const next = current.filter((c) => c.id !== collectionId);
      write(next);
      return next;
    });
  }, []);

  return { collections, createCollection, togglePost, deleteCollection };
}
