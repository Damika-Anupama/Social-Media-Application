'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { SHORTCUTS, isTypingTarget, resolveShortcut, type ShortcutAction } from '@/lib/shortcuts';
import { useComposeOpener } from './ComposeContext';
import { useCommandPalette } from './CommandPalette';
import { useDialog } from '@/lib/useDialog';

/**
 * How long a `g` prefix stays armed before it expires.
 *
 * Was 1.2s. That is a fine window for a fast typist on a quiet machine and a
 * mean one for anyone else: users with motor impairments, switch devices, or
 * just a busy laptop can easily take longer between two keys, and the chord
 * silently evaporates with no feedback. A slower engine failed it under load,
 * which is the same complaint in a different voice.
 */
const CHORD_TIMEOUT_MS = 2500;

const GROUPS = ['Navigate', 'Actions'] as const;

/**
 * Render keycaps. Sequences (`g` then `h`) say so; simultaneous combos (⌘K)
 * just sit side by side.
 */
function Keys({ keys, sequence = true }: { keys: string[]; sequence?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-1">
      {keys.map((k, i) => (
        <span key={k} className="flex items-center gap-1">
          {i > 0 && sequence && <span className="text-[10px] text-ink-dim">then</span>}
          <kbd className="min-w-[1.5rem] rounded border border-line bg-bg-subtle px-1.5 py-0.5 text-center font-mono text-[11px] uppercase text-ink-muted">
            {k}
          </kbd>
        </span>
      ))}
    </span>
  );
}

/**
 * Installs the app-wide keyboard shortcuts and the `?` help overlay.
 *
 * Lives inside CommandPaletteProvider so `/` can open the palette, and inside
 * ComposeProvider so `n` can open the composer.
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const openCompose = useComposeOpener();
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette();
  const [helpOpen, setHelpOpen] = useState(false);

  // Chord state is a ref: it changes on every keystroke and must not re-render.
  const pending = useRef<string | null>(null);
  const chordTimer = useRef<number | null>(null);

  const clearChord = useCallback(() => {
    pending.current = null;
    if (chordTimer.current !== null) {
      window.clearTimeout(chordTimer.current);
      chordTimer.current = null;
    }
  }, []);

  const perform = useCallback(
    (action: ShortcutAction) => {
      switch (action.kind) {
        case 'navigate':
          router.push(action.href);
          break;
        case 'compose':
          openCompose();
          break;
        case 'palette':
          setPaletteOpen(true);
          break;
        case 'help':
          setHelpOpen((v) => !v);
          break;
      }
    },
    [router, openCompose, setPaletteOpen],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Never steal keys from text entry, modifier combos (⌘K owns its own
      // handler), or while the palette is capturing input.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (paletteOpen) return;

      if (e.key === 'Escape') {
        clearChord();
        setHelpOpen(false);
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const result = resolveShortcut(pending.current, key);
      clearChord();

      if (result.type === 'pending') {
        pending.current = result.prefix;
        chordTimer.current = window.setTimeout(clearChord, CHORD_TIMEOUT_MS);
        return;
      }
      if (result.type === 'action') {
        e.preventDefault();
        perform(result.action);
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearChord();
    };
  }, [paletteOpen, perform, clearChord]);

  if (!helpOpen) return null;
  return <ShortcutsDialog onClose={() => setHelpOpen(false)} />;
}

/** Split out so the dialog hook only mounts while the overlay is open. */
function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useDialog<HTMLDivElement>({ onClose });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close keyboard shortcuts"
        onClick={onClose}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        tabIndex={-1}
        className="motion-safe:animate-fade-up relative w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-bg-raised shadow-2xl shadow-black/40 focus:outline-none"
      >
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-3.5">
          <h2 id="shortcuts-title" className="text-sm font-semibold text-ink">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-ink-dim transition-colors hover:bg-bg-elevated/60 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* A scrollable region with no focusable child is unreachable by
            keyboard — you can see the overflow and never scroll to it. */}
        <div
          tabIndex={0}
          role="group"
          aria-label="Shortcut list"
          className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400/60"
        >
          {GROUPS.map((group) => (
            <section key={group}>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-dim">
                {group}
              </h3>
              <ul className="space-y-1">
                {SHORTCUTS.filter((s) => s.group === group).map((s) => (
                  <li
                    key={s.keys.join('+')}
                    className="flex items-center justify-between gap-4 rounded-lg px-2 py-1.5 text-sm text-ink-muted"
                  >
                    <span className="truncate">{s.label}</span>
                    <Keys keys={s.keys} />
                  </li>
                ))}
                {group === 'Actions' && (
                  <li className="flex items-center justify-between gap-4 rounded-lg px-2 py-1.5 text-sm text-ink-muted">
                    <span className="truncate">Command palette</span>
                    <Keys keys={['⌘', 'K']} sequence={false} />
                  </li>
                )}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
