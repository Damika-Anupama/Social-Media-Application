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

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
};

const Ctx = createContext<CommandPaletteContextValue | null>(null);

type Command = {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions';
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

    return [...actionCommands, ...navCommands];
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
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onKeyDown}
            className="motion-safe:animate-fade-up relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-bg-raised shadow-2xl shadow-black/40"
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
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-dim focus:outline-none"
              />
              <kbd className="rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-dim">
                Esc
              </kbd>
            </div>

            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-ink-muted">No matches.</li>
              ) : (
                filtered.map((c, i) => {
                  const Icon = c.icon;
                  const active = i === activeIndex;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => c.perform()}
                        className={clsx(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                          active ? 'bg-brand-500/15 text-ink' : 'text-ink-muted hover:bg-bg-elevated/60',
                        )}
                      >
                        <Icon className={clsx('h-4 w-4 shrink-0', active ? 'text-brand-300' : 'text-ink-dim')} />
                        <span className="flex-1 truncate">{c.label}</span>
                        <span className="text-[10px] uppercase tracking-wider text-ink-dim">{c.group}</span>
                        {active && <CornerDownLeft className="h-3.5 w-3.5 text-ink-dim" />}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
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
