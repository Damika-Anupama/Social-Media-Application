'use client';

import { useEffect, useRef } from 'react';
import { FOCUSABLE_SELECTOR, nextFocusIndex } from '@/lib/focus';

/**
 * Everything a modal dialog owes the keyboard, in one place.
 *
 * Each of the app's dialogs had grown its own partial version of this: some
 * closed on Escape, some locked scroll, one focused its first field. None of
 * them trapped Tab — so you could tab straight out of an "aria-modal" dialog
 * into the page behind it, which is still there and still clickable — and none
 * restored focus to whatever opened them, so closing a dialog dumped keyboard
 * users back at the top of the document.
 *
 * Attach the returned ref to the dialog element.
 */
export function useDialog<T extends HTMLElement = HTMLDivElement>({
  onClose,
  /** Focus this on open. Defaults to the first focusable element. */
  initialFocus,
  /**
   * For dialogs whose owner component stays mounted while they are closed
   * (the command palette lives inside its always-mounted provider). Hooks
   * cannot be conditional; the behaviour can.
   */
  enabled = true,
}: {
  onClose: () => void;
  initialFocus?: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
}) {
  const ref = useRef<T>(null);

  // Kept in a ref so a re-rendered onClose does not re-run the effect and
  // re-steal focus mid-interaction. Written in an effect, not during render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!enabled) return;

    const dialog = ref.current;
    // Whatever had focus when we opened — we owe it back on close.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    /**
     * Matching the selector is not enough: a `display: none` control still
     * matches it, but the browser will not tab to it. The trap then believed
     * there were more elements to reach, never recognised the real last one,
     * and let Tab walk straight out of the dialog. It only showed up in the
     * story viewer, which is the one dialog with responsive (md:hidden)
     * buttons — the others have nothing hidden to get this wrong about.
     */
    const isFocusable = (el: HTMLElement) =>
      el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';

    const focusable = () =>
      dialog
        ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusable)
        : [];

    // Move focus in: the caller's choice, else the first thing we can focus,
    // else the dialog itself (so Escape still reaches us).
    const target = initialFocus?.current ?? focusable()[0] ?? dialog;
    target?.focus();

    // iOS Safari ignores programmatic focus on a text input outside a user
    // gesture — the effect runs after the click, so the focus call is simply
    // dropped and focus stays on <body>, outside the dialog. Verify rather than
    // assume, and fall back to the dialog itself so focus is always *somewhere*
    // inside it.
    if (dialog && !dialog.contains(document.activeElement)) dialog.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusable();
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = nextFocusIndex(items.length, index, e.shiftKey);
      if (next === null) return; // mid-dialog: let the browser tab normally

      e.preventDefault();
      items[next]?.focus();
    };

    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      // Restore focus, but only if it is still ours to give — if something else
      // has since taken focus deliberately, stealing it back would be worse.
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
    // initialFocus is a ref object; its identity is stable, and onClose is read
    // through a ref so a re-render cannot re-run this and re-steal focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return ref;
}
