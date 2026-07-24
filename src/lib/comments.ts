/**
 * Comment rules, kept pure so the merge and validation are testable without a
 * DOM. `useComments` owns the storage.
 */

import type { Comment, User } from '@/lib/mock-data';

export const COMMENT_LIMIT = 300;

/** Comments the viewer has written, keyed by the post they belong to. */
export type OwnComments = Record<string, Comment[]>;

export function validateComment(body: string): string | undefined {
  const trimmed = body.trim();
  if (!trimmed) return 'Write something first.';
  if (trimmed.length > COMMENT_LIMIT) return `Keep it under ${COMMENT_LIMIT} characters.`;
  return undefined;
}

function isComment(value: unknown): value is Comment {
  if (!value || typeof value !== 'object') return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.body === 'string' &&
    typeof c.time === 'string' &&
    typeof c.likes === 'number' &&
    !!c.user &&
    typeof (c.user as User).handle === 'string'
  );
}

/**
 * Parse persisted comments, discarding anything malformed. One corrupt entry
 * must not take the whole thread down.
 */
export function parseComments(raw: string | null): OwnComments {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: OwnComments = {};
    for (const [postId, list] of Object.entries(parsed)) {
      if (!Array.isArray(list)) continue;
      const valid = list.filter(isComment);
      if (valid.length) out[postId] = valid;
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * The viewer's own comments first, then the seeded thread.
 *
 * Newest-first is what the UI showed before; keeping it means a comment you
 * just wrote is where you expect it, at the top.
 */
export function mergeComments(seed: Comment[], own: Comment[]): Comment[] {
  return [...own, ...seed];
}

/** Compose a new comment. Time-based id — one per millisecond is plenty. */
export function createComment(body: string, user: User, now: number): Comment {
  return {
    id: `own-${now.toString(36)}`,
    user,
    body: body.trim(),
    time: 'now',
    likes: 0,
  };
}
