'use client';

import { useRef } from 'react';
import { nextTabIndex, tabIndexFor, type Orientation } from '@/lib/tabs';

/**
 * The keyboard half of the tabs pattern, in one place.
 *
 * Attach `tabListProps` to the strip and spread `getTabProps(i)` onto each tab.
 * Selection follows focus (automatic activation), which is what the pattern
 * prescribes for tabs whose panels are cheap to render — all of these are.
 */
export function useTabs<T>({
  items,
  selected,
  onSelect,
  orientation = 'horizontal',
}: {
  items: readonly T[];
  /** Index of the selected tab. */
  selected: number;
  onSelect: (index: number) => void;
  orientation?: Orientation;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const next = nextTabIndex(items.length, selected, e.key, orientation);
    if (next === null) return;
    e.preventDefault();
    onSelect(next);
    // Focus follows selection, or the roving tabindex strands focus on a tab
    // that is no longer in the tab order.
    refs.current[next]?.focus();
  };

  return {
    tabListProps: {
      role: 'tablist' as const,
      'aria-orientation': orientation,
      onKeyDown,
    },
    getTabProps: (index: number) => ({
      ref: (el: HTMLButtonElement | null) => {
        refs.current[index] = el;
      },
      role: 'tab' as const,
      type: 'button' as const,
      'aria-selected': index === selected,
      tabIndex: tabIndexFor(index, selected),
      onClick: () => onSelect(index),
    }),
  };
}
