/**
 * Keyboard behaviour for the WAI-ARIA tabs pattern.
 *
 * role="tablist" is a promise, not a decoration. It tells a screen reader
 * "this is a tab strip — arrow between them", and it changes what Tab itself
 * does: the strip is one stop, and you move *within* it using the arrows. Four
 * surfaces here declared the role and implemented none of that, so the reader
 * announced "tab 2 of 5", the user pressed Right, and nothing happened.
 *
 * Pure, so the wrap-around and Home/End cases are unit-testable.
 */

export type Orientation = 'horizontal' | 'vertical';

/**
 * Which tab a keypress should move to, or null if the key is not ours.
 *
 * Arrows wrap. Home/End jump to the ends. The perpendicular axis is left alone
 * — Up/Down in a horizontal tablist should still scroll the page.
 */
export function nextTabIndex(
  count: number,
  current: number,
  key: string,
  orientation: Orientation = 'horizontal',
): number | null {
  if (count === 0) return null;

  const forward = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
  const backward = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

  switch (key) {
    case forward:
      return (current + 1) % count;
    case backward:
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

/**
 * Roving tabindex: exactly one tab is in the page's tab order — the selected
 * one. Without this every tab is a separate Tab stop, which is the behaviour
 * the role explicitly tells assistive tech not to expect.
 */
export function tabIndexFor(index: number, selectedIndex: number): 0 | -1 {
  return index === selectedIndex ? 0 : -1;
}
