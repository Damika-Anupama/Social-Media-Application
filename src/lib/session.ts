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

/** Read the current session flag from storage. SSR-safe (false on the server). */
export function readSession(): boolean {
  return parseSession(readRaw(SESSION_KEY));
}

function announce(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(SESSION_EVENT));
}

/** Mark the viewer signed in. Called after a successful login/register. */
export function signIn(): void {
  writeJson(SESSION_KEY, { signedIn: true });
  announce();
}

/** Clear the session. Called by "Sign out". */
export function signOut(): void {
  writeJson(SESSION_KEY, { signedIn: false });
  announce();
}
