import { TopBar } from '@/components/dashboard/TopBar';
import { notifications } from '@/lib/mock-data';
import { Avatar } from '@/components/Avatar';
import { Heart, MessageCircle, UserPlus, AtSign, Award, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const iconMap = {
  like: { icon: Heart, tint: 'text-accent-coral bg-accent-coral/10' },
  comment: { icon: MessageCircle, tint: 'text-brand-300 bg-brand-500/10' },
  follow: { icon: UserPlus, tint: 'text-accent-mint bg-accent-mint/10' },
  mention: { icon: AtSign, tint: 'text-accent-sky bg-accent-sky/10' },
  milestone: { icon: Award, tint: 'text-accent-sun bg-accent-sun/10' },
} as const;

const filters = ['All', 'Mentions', 'Likes', 'Replies', 'Follows'];

export default function NotificationsPage() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Notifications" subtitle="Only what matters. Everything else stays in the activity log." />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f, i) => (
          <button
            key={f}
            className={
              i === 0
                ? 'rounded-full bg-brand-500/15 px-4 py-1.5 text-xs font-semibold text-brand-200'
                : 'rounded-full border border-line bg-bg-subtle px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink'
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line/60 bg-bg-elevated/40 px-5 py-3 text-xs text-ink-dim">
          <Sparkles className="h-3.5 w-3.5 text-accent-sun" />
          <span>Pulse groups quiet activity for you — open it once a day, not seventeen times.</span>
        </div>
        <ul className="divide-y divide-line/40">
          {notifications.map((n) => {
            const meta = iconMap[n.type];
            const Icon = meta.icon;
            return (
              <li
                key={n.id}
                className={clsx(
                  'flex items-start gap-3 px-5 py-4 transition-colors hover:bg-bg-elevated/30',
                  n.unread && 'bg-brand-500/5',
                )}
              >
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
                {n.unread && <span className="mt-2 h-2 w-2 rounded-full bg-brand-400" aria-label="Unread" />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
