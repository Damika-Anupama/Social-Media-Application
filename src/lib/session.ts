'use client';

/**
 * Simulated session for the demo.
 *
 * There is no backend and no real credential check — login/register accept any
 * input that passes client validation. But "signed in" should still mean
 * something: this stores a flag in localStorage so the dashboard can be gated,
 * a reload keeps you where you were, and "Sign out" genuinely signs you out.
 */

import { writeJson, readRaw } from '@/lib/storage';

export const SESSION_KEY = 'pulse.session.v1';

/** Fired same-tab so the gate and the sidebar react to sign-in/out without a reload. */
export const SESSION_EVENT = 'pulse:session';

/**
 * Interpret a persisted session payload. Accepts either a bare `true` or a
 * `{ signedIn: true }` object; anything else — absent, malformed, signed out —
 * reads as not signed in.
 */
export function parseSession(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === true) return true;
    return Boolean(
      parsed && typeof parsed === 'object' && (parsed as { signedIn?: unknown }).signedIn === true,
    );
  } catch {
    return false;
  }
}

/**
 * In-memory mirror of the session, for this tab only.
 *
 * When storage is unavailable — Safari private browsing, a full quota, a
 * locked-down profile — the write in `signIn()` fails and the flag never lands.
 * Without this, the sign-in would appear to succeed and then the AuthGate,
 * reading storage back and finding nothing, would bounce the viewer straight to
 * /login: signing in would be impossible on exactly the browsers the storage
 * layer already goes out of its way to degrade gracefully for. The memory flag
 * carries the session for the life of the tab so sign-in still works; it is
 * only consulted when storage has nothing to say.
 */
let memorySignedIn = false;

/**
 * Read the current session flag. SSR-safe (false on the server).
 *
 * Storage is authoritative whenever it can answer — so a sign-out in another
 * tab still takes effect here. Only when storage is empty or unreadable does
 * this fall back to the in-tab memory flag, which is what keeps sign-in working
 * when writes throw.
 */
export function readSession(): boolean {
  const raw = readRaw(SESSION_KEY);
  if (raw !== null) return parseSession(raw);
  return memorySignedIn;
}

function announce(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SESSION_EVENT));
}

/** Mark the viewer signed in. Called after a successful login/register. */
export function signIn(): void {
  memorySignedIn = true;
  writeJson(SESSION_KEY, { signedIn: true });
  announce();
}

/** Clear the session. Called by "Sign out". */
export function signOut(): void {
  memorySignedIn = false;
  writeJson(SESSION_KEY, { signedIn: false });
  announce();
}
