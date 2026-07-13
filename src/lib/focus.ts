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
 * The whole cycle is managed, not just the edges. It used to intervene only at
 * the ends and let the browser handle the middle — which assumes the browser
 * agrees with us about what is tabbable. Safari does not: by default it skips
 * buttons entirely, tabbing only between fields and links. So the trap never
 * recognised the real last stop, deferred to the browser, and focus walked out
 * of the dialog. Same failure as `display: none` elements, a different cause.
 *
 * Managing every step makes the behaviour identical in every engine, which is
 * the point of a trap.
 *
 * Returns null only when there is nothing to focus.
 */
export function nextFocusIndex(
  count: number,
  currentIndex: number,
  shiftKey: boolean,
): number | null {
  if (count === 0) return null;
  // Focus is somewhere outside the dialog (or nowhere) — pull it back in.
  if (currentIndex === -1) return shiftKey ? count - 1 : 0;

  return shiftKey ? (currentIndex - 1 + count) % count : (currentIndex + 1) % count;
}
