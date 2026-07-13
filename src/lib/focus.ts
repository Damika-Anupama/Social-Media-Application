/**
 * Focus-trap rules, kept pure so the wrap-around arithmetic is unit-testable
 * without a DOM. `useDialog` owns the listeners and the actual focus calls.
 */

/**
 * Elements that can hold focus. Ordered as they appear in the DOM, which is
 * also tab order for anything without an explicit positive tabindex (we have
 * none — positive tabindex is its own bug).
 */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Where Tab should land next, given where focus is now.
 *
 * Returns the index to move to, or null to let the browser handle it. The trap
 * only intervenes at the edges: Tab past the last element wraps to the first,
 * Shift+Tab before the first wraps to the last. Everything in between is the
 * browser's job and should stay that way.
 */
export function nextFocusIndex(
  count: number,
  currentIndex: number,
  shiftKey: boolean,
): number | null {
  if (count === 0) return null;
  // Focus is somewhere outside the dialog (or nowhere) — pull it back in.
  if (currentIndex === -1) return shiftKey ? count - 1 : 0;

  if (!shiftKey && currentIndex === count - 1) return 0;
  if (shiftKey && currentIndex === 0) return count - 1;

  return null;
}
