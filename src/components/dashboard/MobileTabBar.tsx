'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Home, Compass, PenSquare, Bell, User } from 'lucide-react';
import { useComposeOpener } from '@/components/dashboard/ComposeContext';

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/explore', label: 'Explore', icon: Compass },
  { href: '__compose', label: 'Post', icon: PenSquare, primary: true },
  { href: '/dashboard/notifications', label: 'Inbox', icon: Bell },
  { href: '/dashboard/profile', label: 'Me', icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const openCompose = useComposeOpener();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-bg/95 backdrop-blur-md lg:hidden">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.primary) {
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={openCompose}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-accent-mint text-white shadow-lg shadow-brand-500/30"
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </li>
            );
          }

          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] font-medium',
                  active ? 'text-ink' : 'text-ink-dim',
                )}
              >
                <Icon className={clsx('h-5 w-5', active && 'text-brand-300')} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
