'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import {
  Home,
  Compass,
  Bell,
  MessageCircle,
  Bookmark,
  Users2,
  User,
  Settings,
  PenSquare,
  Search,
  CornerDownLeft,
} from 'lucide-react';
import { useComposeOpener } from './ComposeContext';
import { useDialog } from '@/lib/useDialog';
import { searchDirectory } from '@/lib/commandPalette';
import { users, communities } from '@/lib/mock-data';

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const Ctx = createContext<CommandPaletteContextValue | null>(null);

type Command = {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions' | 'People' | 'Communities';
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
  perform: () => void;
};

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const openCompose = useComposeOpener();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOpen(false), []);
  // Trap Tab and restore focus to whatever was focused before ⌘K.
  const dialogRef = useDialog<HTMLDivElement>({
    onClose: close,
    initialFocus: inputRef,
    enabled: open,
  });

  const navItems: { label: string; href: string; icon: Command['icon'] }[] = useMemo(
    () => [
      { label: 'Home', href: '/dashboard', icon: Home },
      { label: 'Explore', href: '/dashboard/explore', icon: Compass },
      { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
      { label: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
      { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
      { label: 'Communities', href: '/dashboard/communities', icon: Users2 },
      { label: 'Profile', href: '/dashboard/profile', icon: User },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    [],
  );

  const commands: Command[] = useMemo(() => {
    const navCommands: Command[] = navItems.map((n) => ({
      id: `nav:${n.href}`,
      label: n.label,
      group: 'Navigate',
      icon: n.icon,
      keywords: n.href,
      perform: () => {
        router.push(n.href);
        close();
      },
    }));

    const actionCommands: Command[] = [
      {
        id: 'action:compose',
        label: 'Compose new post',
        group: 'Actions',
        icon: PenSquare,
        keywords: 'write new post tweet',
        perform: () => {
          close();
          openCompose();
        },
      },
    ];

    const q = query.trim();
    if (q) {
      actionCommands.unshift({
        id: 'action:search',
        label: `Search “${q}”`,
        group: 'Actions',
        icon: Search,
        perform: () => {
          router.push(`/dashboard/explore?q=${encodeURIComponent(q)}`);
          close();
        },
      });
    }

    // Typing turns the palette into a real jump list: matching people and
    // communities navigate straight to their pages, not just the fixed sections.
    const { people, communities: communityResults } = searchDirectory(q, users, communities);
    const directoryCommands: Command[] = [
      ...people.map((p) => ({
        id: `user:${p.id}`,
        label: p.label,
        group: 'People' as const,
        icon: User,
        keywords: p.keywords,
        perform: () => {
          router.push(p.href);
          close();
        },
      })),
      ...communityResults.map((c) => ({
        id: `community:${c.id}`,
        label: c.label,
        group: 'Communities' as const,
        icon: Users2,
        keywords: c.keywords,
        perform: () => {
          router.push(c.href);
          close();
        },
      })),
    ];

    return [...actionCommands, ...directoryCommands, ...navCommands];
  }, [navItems, query, router, openCompose, close]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.id === 'action:search' ||
        c.label.toLowerCase().includes(q) ||
        (c.keywords?.toLowerCase().includes(q) ?? false),
    );
  }, [commands, query]);

  // Keep the active row valid as the list shrinks/grows.
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(filtered.length - 1, 0)));
  }, [filtered.length]);

  // Keep the active option scrolled into view as arrow keys move it, so the
  // highlight never disappears below the fold of a long result list.
  useEffect(() => {
    if (!open) return;
    document.getElementById(`cmdk-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  // Global ⌘K / Ctrl+K to toggle the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // On open: reset state and focus the input.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus after paint so the input exists.
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[activeIndex]?.perform();
    }
  };

  return (
    <Ctx.Provider value={{ open, setOpen }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
          <button
            type="button"
            aria-label="Close command palette"
            onClick={close}
            className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onKeyDown}
            tabIndex={-1}
            className="motion-safe:animate-fade-up relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-bg-raised shadow-2xl shadow-black/40 focus:outline-none"
          >
            <div className="flex items-center gap-3 border-b border-line/60 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-ink-dim" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or jump to…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded={filtered.length > 0}
                aria-controls="cmdk-listbox"
                aria-autocomplete="list"
                aria-activedescendant={filtered.length ? `cmdk-opt-${activeIndex}` : undefined}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
              />
              <kbd className="rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-dim">
                Esc
              </kbd>
            </div>

            <ul id="cmdk-listbox" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li role="presentation" className="px-3 py-6 text-center text-sm text-ink-muted">
                  No matches.
                </li>
              ) : (
                filtered.map((c, i) => {
                  const Icon = c.icon;
                  const active = i === activeIndex;
                  // Options carry role/id/aria-selected and focus stays on the
                  // input (aria-activedescendant) — the correct combobox pattern,
                  // so they are list options, not nested tab-focusable buttons.
                  return (
                    <li
                      key={c.id}
                      id={`cmdk-opt-${i}`}
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => c.perform()}
                      className={clsx(
                        'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                        active ? 'bg-brand-500/15 text-ink' : 'text-ink-muted hover:bg-bg-elevated/60',
                      )}
                    >
                      <Icon className={clsx('h-4 w-4 shrink-0', active ? 'text-brand-300' : 'text-ink-dim')} />
                      <span className="flex-1 truncate">{c.label}</span>
                      {/* ink-dim is tuned against the neutral surfaces; on the
                          brand-tinted active row it lands at 4.44:1. */}
                      <span
                        className={clsx(
                          'text-[10px] uppercase tracking-wider',
                          active ? 'text-brand-200' : 'text-ink-dim',
                        )}
                      >
                        {c.group}
                      </span>
                      {active && <CornerDownLeft className="h-3.5 w-3.5 text-ink-dim" />}
                    </li>
                  );
                })
              )}
            </ul>

            {/* Announce result count to screen readers as the query changes —
                aria-activedescendant alone doesn't convey how many matched. */}
            <div className="sr-only" role="status" aria-live="polite">
              {filtered.length === 0
                ? 'No matches.'
                : `${filtered.length} result${filtered.length === 1 ? '' : 's'}.`}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-line/60 px-4 py-2.5 text-[11px] text-ink-dim">
              <span>Keyboard shortcuts</span>
              <kbd className="rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px]">
                ?
              </kbd>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useCommandPalette() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { open: false, setOpen: () => {} } as CommandPaletteContextValue;
  }
  return ctx;
}
