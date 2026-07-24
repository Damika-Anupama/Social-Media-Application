import { describe, expect, it } from 'vitest';
import { FOCUSABLE_SELECTOR, nextFocusIndex } from './focus';

describe('nextFocusIndex', () => {
  it('wraps forward off the last element', () => {
    expect(nextFocusIndex(3, 2, false)).toBe(0);
  });

  it('wraps backward off the first element', () => {
    expect(nextFocusIndex(3, 0, true)).toBe(2);
  });

  it('manages the middle of the cycle too, not just the edges', () => {
    // Deferring the middle to the browser assumed the browser agrees about
    // what is tabbable. Safari skips buttons, so it does not.
    expect(nextFocusIndex(3, 1, false)).toBe(2);
    expect(nextFocusIndex(3, 1, true)).toBe(0);
  });

  it('pulls focus back in when it is outside the dialog', () => {
    expect(nextFocusIndex(3, -1, false)).toBe(0);
    expect(nextFocusIndex(3, -1, true)).toBe(2);
  });

  it('does nothing when the dialog has nothing focusable', () => {
    expect(nextFocusIndex(0, -1, false)).toBeNull();
    expect(nextFocusIndex(0, 0, true)).toBeNull();
  });

  it('handles a single focusable element by keeping focus on it', () => {
    // Both directions wrap to the only element, so focus cannot escape.
    expect(nextFocusIndex(1, 0, false)).toBe(0);
    expect(nextFocusIndex(1, 0, true)).toBe(0);
  });
});

describe('FOCUSABLE_SELECTOR', () => {
  it('excludes disabled controls and tabindex="-1"', () => {
    expect(FOCUSABLE_SELECTOR).toContain('button:not([disabled])');
    expect(FOCUSABLE_SELECTOR).toContain('[tabindex]:not([tabindex="-1"])');
  });
});
