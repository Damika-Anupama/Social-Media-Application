'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Heart, MessageCircle, UserPlus, AtSign, Award, Sparkles, CheckCheck } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import { notifications as seed, type Notification } from '@/lib/mock-data';

const iconMap = {
  like: { icon: Heart, tint: 'text-accent-coral bg-accent-coral/10' },
  comment: { icon: MessageCircle, tint: 'text-brand-300 bg-brand-500/10' },
  follow: { icon: UserPlus, tint: 'text-accent-mint bg-accent-mint/10' },
  mention: { icon: AtSign, tint: 'text-accent-sky bg-accent-sky/10' },
  milestone: { icon: Award, tint: 'text-accent-sun bg-accent-sun/10' },
} as const;

const filters: { id: string; label: string; types?: Notification['type'][] }[] = [
  { id: 'all', label: 'All' },
  { id: 'mentions', label: 'Mentions', types: ['mention'] },
  { id: 'likes', label: 'Likes', types: ['like'] },
  { id: 'replies', label: 'Replies', types: ['comment'] },
  { id: 'follows', label: 'Follows', types: ['follow'] },
];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(seed);
  const [active, setActive] = useState('all');

  const filter = filters.find((f) => f.id === active)!;
  const view = useMemo(() => {
    if (!filter.types) return items;
    return items.filter((n) => filter.types!.includes(n.type));
  }, [items, filter]);

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((arr) => arr.map((n) => ({ ...n, unread: false })));

  const toggleRead = (id: string) =>
    setItems((arr) => arr.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)));

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Notifications" subtitle="Only what matters. Everything else stays in the activity log." />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-xs transition-colors',
              active === f.id
                ? 'bg-brand-500/15 font-semibold text-brand-200'
                : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
            )}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-subtle px-3 py-1.5 text-xs font-medium text-ink-muted hover:text-ink disabled:opacity-50"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line/60 bg-bg-elevated/40 px-5 py-3 text-xs text-ink-dim">
          <Sparkles className="h-3.5 w-3.5 text-accent-sun" />
          <span>Pulse groups quiet activity for you — open it once a day, not seventeen times.</span>
        </div>
        {view.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink-muted">No {filter.label.toLowerCase()} to show right now.</p>
        ) : (
          <ul className="divide-y divide-line/40">
            {view.map((n) => {
              const meta = iconMap[n.type];
              const Icon = meta.icon;
              const body = (
                <>
                  <span className={clsx('inline-flex h-9 w-9 items-center justify-center rounded-full', meta.tint)}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      {n.user && (
                        <>
                          <Avatar user={n.user} size={20} />
                          <span className="text-sm font-semibold text-ink">{n.user.name}</span>
                        </>
                      )}
                      <span className="text-sm text-ink-muted">{n.text}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-ink-dim">{n.time}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleRead(n.id);
                    }}
                    className={clsx(
                      'mt-2 h-2 w-2 shrink-0 rounded-full',
                      n.unread ? 'bg-brand-400' : 'bg-line',
                    )}
                    aria-label={n.unread ? 'Mark as read' : 'Mark as unread'}
                    title={n.unread ? 'Mark as read' : 'Mark as unread'}
                  />
                </>
              );
              const className = clsx(
                'flex items-start gap-3 px-5 py-4 transition-colors hover:bg-bg-elevated/30',
                n.unread && 'bg-brand-500/5',
              );
              return (
                <li key={n.id}>
                  {n.postId ? (
                    <Link href={`/dashboard/p/${n.postId}`} className={className}>
                      {body}
                    </Link>
                  ) : (
                    <div className={className}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
