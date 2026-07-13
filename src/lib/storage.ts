'use client';

/**
 * The one place that writes to localStorage.
 *
 * Every store used to do `try { setItem(…) } catch {}`. That empty catch is the
 * whole bug: if storage is full, or disabled (Safari private browsing, some
 * embedded webviews, a locked-down profile), the write fails, the in-memory
 * state still updates, the UI still shows the post — and then it evaporates on
 * reload with nothing ever having said a word.
 *
 * Failing to save is not a detail the app gets to keep to itself. Writes now
 * report, and the UI can tell the viewer the truth.
 */

export type StorageFailure = {
  key: string;
  /** Quota exceeded, as opposed to storage being unavailable outright. */
  quotaExceeded: boolean;
};

type Listener = (failure: StorageFailure) => void;

const listeners = new Set<Listener>();

/** Notified once per failed write. Returns an unsubscribe. */
export function onStorageFailure(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * A DOMException thrown because storage is full, rather than because it is
 * unavailable. Browsers disagree on the name and the code, so check both.
 */
export function isQuotaExceeded(error: unknown): boolean {
  if (!(error instanceof DOMException)) return false;
  return (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    error.code === 22 ||
    error.code === 1014
  );
}

/**
 * Persist a value. Returns whether it actually landed, so callers can stop
 * pretending it did.
 */
export function writeJson(key: string, value: unknown): boolean {
  return writeRaw(key, JSON.stringify(value));
}

/**
 * Persist an already-serialized string. Some stores have their own canonical
 * form (sorted, de-duped) and should keep it.
 */
export function writeRaw(key: string, serialized: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    const failure: StorageFailure = { key, quotaExceeded: isQuotaExceeded(error) };
    for (const listener of listeners) listener(failure);
    return false;
  }
}

/** Read a raw string back. Absent and unreadable are the same to callers. */
export function readRaw(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Reading can throw too when storage is disabled — that is genuinely
    // equivalent to "nothing stored", so it stays quiet.
    return null;
  }
}
