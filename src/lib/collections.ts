/**
 * Bookmark collections: user-created folders that saved posts can be filed
 * into. Pure — no React, no DOM — so the rules are unit-testable directly.
 */

export type Collection = {
  id: string;
  name: string;
  /** Ids of the posts filed here. */
  postIds: string[];
};

export const NAME_LIMIT = 30;

/** The built-in filters, which are tag-driven and cannot be edited or deleted. */
export const BUILT_IN = [
  { id: 'all', label: 'All', tag: null },
  { id: 'reading', label: 'Reading list', tag: 'longform' },
  { id: 'studio', label: 'Studio inspiration', tag: 'design' },
  { id: 'climate', label: 'Climate', tag: 'climate' },
  { id: 'infra', label: 'Infra & systems', tag: 'postgres' },
] as const;

const BUILT_IN_NAMES = BUILT_IN.map((c) => c.label.toLowerCase());

export function validateCollectionName(
  name: string,
  existing: Collection[],
): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return 'Give the collection a name.';
  if (trimmed.length > NAME_LIMIT) return `Keep it under ${NAME_LIMIT} characters.`;
  const lower = trimmed.toLowerCase();
  if (BUILT_IN_NAMES.includes(lower) || existing.some((c) => c.name.toLowerCase() === lower)) {
    return 'You already have a collection with that name.';
  }
  return undefined;
}

function isCollection(value: unknown): value is Collection {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    Array.isArray(c.postIds) &&
    c.postIds.every((p) => typeof p === 'string')
  );
}

/** Parse persisted collections, discarding malformed entries. */
export function parseCollections(raw: string | null): Collection[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCollection).map((c) => ({
      ...c,
      postIds: Array.from(new Set(c.postIds)),
    }));
  } catch {
    return [];
  }
}

/** File a post into a collection, or take it out. Membership is a set. */
export function togglePostInCollection(
  collections: Collection[],
  collectionId: string,
  postId: string,
): Collection[] {
  return collections.map((c) => {
    if (c.id !== collectionId) return c;
    const has = c.postIds.includes(postId);
    return {
      ...c,
      postIds: has ? c.postIds.filter((id) => id !== postId) : [...c.postIds, postId],
    };
  });
}

/**
 * Drop any post that is no longer bookmarked.
 *
 * Un-saving a post has to remove it from every collection too, or a collection
 * keeps pointing at something the viewer no longer has saved and the counts lie.
 */
export function pruneCollections(collections: Collection[], bookmarked: Set<string>): Collection[] {
  return collections.map((c) => ({
    ...c,
    postIds: c.postIds.filter((id) => bookmarked.has(id)),
  }));
}

export function collectionCount(collection: Collection, bookmarked: Set<string>): number {
  return collection.postIds.filter((id) => bookmarked.has(id)).length;
}
