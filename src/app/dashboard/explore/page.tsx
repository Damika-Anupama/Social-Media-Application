/* eslint-disable @next/next/no-img-element */
import { TopBar } from '@/components/dashboard/TopBar';
import { exploreImages, trending, users, formatCount } from '@/lib/mock-data';
import { Flame, Globe2, MapPin } from 'lucide-react';
import { Avatar } from '@/components/Avatar';

const chips = ['For you', 'Trending', 'News', 'Design', 'Climate', 'Tech', 'Sports', 'Film', 'Music'];

export default function ExplorePage() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Explore" subtitle="What the rest of Pulse is paying attention to right now." />

      <div className="mb-5 flex flex-wrap gap-2">
        {chips.map((c, i) => (
          <button
            key={c}
            className={
              i === 0
                ? 'rounded-full bg-brand-500/15 px-4 py-1.5 text-xs font-semibold text-brand-200'
                : 'rounded-full border border-line bg-bg-subtle px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink'
            }
          >
            {c}
          </button>
        ))}
      </div>

      <section className="card mb-6 p-5">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-accent-coral" />
          <h2 className="text-sm font-semibold text-ink">Headline trends</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((t) => (
            <button
              key={t.title}
              className="group flex flex-col gap-1.5 rounded-2xl border border-line/60 bg-bg-subtle/60 p-4 text-left transition-colors hover:border-brand-400/40"
            >
              <span className="text-[11px] uppercase tracking-wider text-brand-300">{t.category}</span>
              <span className="text-base font-semibold text-ink">{t.title}</span>
              <span className="text-xs text-ink-dim">{t.posts}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card mb-6 p-5">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-accent-mint" />
          <h2 className="text-sm font-semibold text-ink">People to discover</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.slice(0, 6).map((u) => (
            <div key={u.id} className="flex items-center gap-3 rounded-xl border border-line/60 bg-bg-subtle/60 p-3">
              <Avatar user={u} size={44} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink">{u.name}</div>
                <div className="truncate text-xs text-ink-dim">@{u.handle} · {formatCount(u.followers ?? 0)} followers</div>
              </div>
              <button className="rounded-full border border-line bg-bg-raised px-3 py-1 text-xs font-medium text-ink-muted hover:text-ink">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent-sun" />
          <h2 className="text-sm font-semibold text-ink">Visual feed</h2>
        </div>
        <div className="mt-4 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {exploreImages.map((src, i) => (
            <div key={i} className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-line/60">
              <img src={src} alt="" className="w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
