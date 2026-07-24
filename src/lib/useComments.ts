'use client';

import { useCallback, useEffect, useState } from 'react';
import { currentUser, type Comment } from '@/lib/mock-data';
import { createComment, parseComments, type OwnComments } from '@/lib/comments';
import { readRaw, writeJson, writeRaw } from '@/lib/storage';

const COMMENTS_KEY = 'pulse.comments.v1';
const COMMENT_LIKES_KEY = 'pulse.commentLikes.v1';

function readOwn(): OwnComments {
  return parseComments(readRaw(COMMENTS_KEY));
}

function readLikes(): Set<string> {
  const raw = readRaw(COMMENT_LIKES_KEY);
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

/**
 * Comments the viewer has written, and comment likes — both persisted.
 *
 * Writing a comment used to be local component state: it appeared, and it was
 * gone on reload, with nothing to say so. Liking one was the same. This is the
 * last surface in the app where that was still true.
 */
export function useComments() {
  const [own, setOwn] = useState<OwnComments>({});
  const [likes, setLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    setOwn(readOwn());
    setLikes(readLikes());
    const onStorage = (e: StorageEvent) => {
      if (e.key === COMMENTS_KEY) setOwn(readOwn());
      if (e.key === COMMENT_LIKES_KEY) setLikes(readLikes());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /** Comments the viewer added to a post, newest first. */
  const ownFor = useCallback((postId: string): Comment[] => own[postId] ?? [], [own]);

  const addComment = useCallback((postId: string, body: string) => {
    const comment = createComment(body, currentUser, Date.now());
    setOwn((current) => {
      const next = { ...current, [postId]: [comment, ...(current[postId] ?? [])] };
      writeJson(COMMENTS_KEY, next);
      return next;
    });
    return comment;
  }, []);

  const removeComment = useCallback((postId: string, commentId: string) => {
    setOwn((current) => {
      const list = (current[postId] ?? []).filter((c) => c.id !== commentId);
      const next = { ...current };
      if (list.length) next[postId] = list;
      else delete next[postId];
      writeJson(COMMENTS_KEY, next);
      return next;
    });
  }, []);

  const isLiked = useCallback((commentId: string) => likes.has(commentId), [likes]);

  const toggleLike = useCallback((commentId: string) => {
    setLikes((current) => {
      const next = new Set(current);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      // Sorted, so the stored form is canonical and diffable.
      writeRaw(COMMENT_LIKES_KEY, JSON.stringify([...next].sort()));
      return next;
    });
  }, []);

  return { ownFor, addComment, removeComment, isLiked, toggleLike };
}
