/**
 * Global keyboard shortcuts for the dashboard.
 *
 * The resolver is kept pure (no DOM, no React) so the whole chord state machine
 * is unit-testable. `KeyboardShortcuts` owns the listener and the side effects.
 */

export type ShortcutAction =
  | { kind: 'navigate'; href: string }
  | { kind: 'compose' }
  | { kind: 'palette' }
  | { kind: 'help' };

export type ShortcutSpec = {
  /** Human-readable keys, e.g. ['g', 'h'] renders as "G then H". */
  keys: string[];
  label: string;
  group: 'Navigate' | 'Actions';
  action: ShortcutAction;
};

/**
 * `g` is a prefix key (Gmail-style chords): `g h` → Home, `g e` → Explore, …
 * Single keys handle the actions people reach for constantly.
 */
export const SHORTCUTS: ShortcutSpec[] = [
  { keys: ['g', 'h'], label: 'Go to Home', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard' } },
  { keys: ['g', 'e'], label: 'Go to Explore', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard/explore' } },
  { keys: ['g', 'n'], label: 'Go to Notifications', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard/notifications' } },
  { keys: ['g', 'm'], label: 'Go to Messages', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard/messages' } },
  { keys: ['g', 'b'], label: 'Go to Bookmarks', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard/bookmarks' } },
  { keys: ['g', 'c'], label: 'Go to Communities', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard/communities' } },
  { keys: ['g', 'p'], label: 'Go to Profile', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard/profile' } },
  { keys: ['g', 's'], label: 'Go to Settings', group: 'Navigate', action: { kind: 'navigate', href: '/dashboard/settings' } },
  { keys: ['n'], label: 'New post', group: 'Actions', action: { kind: 'compose' } },
  { keys: ['/'], label: 'Search & jump to', group: 'Actions', action: { kind: 'palette' } },
  { keys: ['?'], label: 'Keyboard shortcuts', group: 'Actions', action: { kind: 'help' } },
];

const PREFIX = 'g';

export type ResolveResult =
  /** A chord was started; hold this prefix and wait for the next key. */
  | { type: 'pending'; prefix: string }
  /** A shortcut fired. */
  | { type: 'action'; action: ShortcutAction }
  /** Nothing matched; any pending prefix is dropped. */
  | { type: 'none' };

/**
 * Advance the chord state machine.
 *
 * @param pending the prefix held from the previous keystroke, if any
 * @param key the key just pressed (already lowercased by the caller for letters)
 */
export function resolveShortcut(pending: string | null, key: string): ResolveResult {
  if (pending) {
    const match = SHORTCUTS.find((s) => s.keys.length === 2 && s.keys[0] === pending && s.keys[1] === key);
    return match ? { type: 'action', action: match.action } : { type: 'none' };
  }

  if (key === PREFIX) return { type: 'pending', prefix: PREFIX };

  const match = SHORTCUTS.find((s) => s.keys.length === 1 && s.keys[0] === key);
  return match ? { type: 'action', action: match.action } : { type: 'none' };
}

/**
 * True when the keystroke belongs to the user's text entry, not to us. Firing
 * `n` mid-sentence in the composer would be maddening.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.tagName !== 'string') return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  return el.isContentEditable === true;
}
