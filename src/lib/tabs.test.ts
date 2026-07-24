import { describe, expect, it } from 'vitest';
import { nextTabIndex, tabIndexFor } from './tabs';

describe('nextTabIndex — horizontal', () => {
  it('moves right and wraps off the end', () => {
    expect(nextTabIndex(4, 1, 'ArrowRight')).toBe(2);
    expect(nextTabIndex(4, 3, 'ArrowRight')).toBe(0);
  });

  it('moves left and wraps off the start', () => {
    expect(nextTabIndex(4, 1, 'ArrowLeft')).toBe(0);
    expect(nextTabIndex(4, 0, 'ArrowLeft')).toBe(3);
  });

  it('jumps to the ends with Home and End', () => {
    expect(nextTabIndex(4, 2, 'Home')).toBe(0);
    expect(nextTabIndex(4, 2, 'End')).toBe(3);
  });

  it('leaves the perpendicular axis alone, so the page can still scroll', () => {
    expect(nextTabIndex(4, 2, 'ArrowDown')).toBeNull();
    expect(nextTabIndex(4, 2, 'ArrowUp')).toBeNull();
  });

  it('ignores keys that are not ours', () => {
    expect(nextTabIndex(4, 2, 'a')).toBeNull();
    expect(nextTabIndex(4, 2, 'Enter')).toBeNull();
    expect(nextTabIndex(4, 2, 'Tab')).toBeNull();
  });
});

describe('nextTabIndex — vertical', () => {
  it('uses Up/Down instead', () => {
    expect(nextTabIndex(3, 0, 'ArrowDown', 'vertical')).toBe(1);
    expect(nextTabIndex(3, 0, 'ArrowUp', 'vertical')).toBe(2);
  });

  it('leaves Left/Right alone', () => {
    expect(nextTabIndex(3, 0, 'ArrowRight', 'vertical')).toBeNull();
  });
});

describe('nextTabIndex — edges', () => {
  it('does nothing with no tabs', () => {
    expect(nextTabIndex(0, 0, 'ArrowRight')).toBeNull();
  });

  it('keeps a single tab on itself rather than going out of bounds', () => {
    expect(nextTabIndex(1, 0, 'ArrowRight')).toBe(0);
    expect(nextTabIndex(1, 0, 'ArrowLeft')).toBe(0);
  });
});

describe('tabIndexFor', () => {
  it('puts only the selected tab in the page tab order', () => {
    expect(tabIndexFor(1, 1)).toBe(0);
    expect(tabIndexFor(0, 1)).toBe(-1);
    expect(tabIndexFor(2, 1)).toBe(-1);
  });
});
