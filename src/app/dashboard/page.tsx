import { TopBar } from '@/components/dashboard/TopBar';
import { StoryRail } from '@/components/dashboard/StoryRail';
import { PostComposer } from '@/components/dashboard/PostComposer';
import { PostCard } from '@/components/dashboard/PostCard';
import { RightRail } from '@/components/dashboard/RightRail';
import { posts } from '@/lib/mock-data';
import { Sparkles } from 'lucide-react';

const tabs = [
  { id: 'foryou', label: 'For you', active: true },
  { id: 'following', label: 'Following' },
  { id: 'longform', label: 'Long-form' },
  { id: 'live', label: 'Live now', accent: true },
];

export default function HomeFeed() {
  return (
    <div className="flex gap-6 px-4 pt-1 sm:px-6">
      <div className="min-w-0 flex-1 space-y-5">
        <TopBar title="Home" subtitle="A quieter feed, ranked by what you actually engage with." />

        <div className="card flex flex-wrap items-center gap-1 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={
                t.active
                  ? 'inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-4 py-2 text-sm font-semibold text-brand-200'
                  : 'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink-muted hover:bg-bg-elevated hover:text-ink'
              }
            >
              {t.accent && <span className="h-1.5 w-1.5 rounded-full bg-accent-coral animate-pulse" />}
              {t.label}
            </button>
          ))}
          <div className="ml-auto mr-2 inline-flex items-center gap-1.5 text-xs text-ink-dim">
            <Sparkles className="h-3.5 w-3.5 text-accent-sun" />
            Ranking is transparent — view signals
          </div>
        </div>

        <StoryRail />
        <PostComposer />

        <div className="space-y-5">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>

        <div className="card flex flex-col items-center gap-2 p-8 text-center">
          <span className="badge">You're caught up</span>
          <p className="text-sm text-ink-muted">No more posts from people you follow. Try Explore for something new.</p>
        </div>
      </div>

      <RightRail />
    </div>
  );
}
