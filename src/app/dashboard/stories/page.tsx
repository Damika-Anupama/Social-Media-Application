'use client';

import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import { Radio } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { StoryViewer } from '@/components/dashboard/StoryViewer';
import { stories } from '@/lib/mock-data';
import { Avatar } from '@/components/Avatar';
import { useSeenStories, partitionStories } from '@/lib/useSeenStories';

export default function StoriesPage() {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const { seenIds, markSeen } = useSeenStories();

  const { live, fresh, watched: seen } = partitionStories(stories, seenIds);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar
        title="Stories"
        subtitle="Live rooms and quick updates from people you follow. Tap any tile to watch."
      />

      {live.length > 0 && (
        <Section title="Live right now" tone="coral">
          <Grid stories={live} onOpen={(i) => setOpenAt(stories.indexOf(live[i]))} />
        </Section>
      )}

      <Section title="Fresh from your follows" tone="brand">
        <Grid stories={fresh} onOpen={(i) => setOpenAt(stories.indexOf(fresh[i]))} />
      </Section>

      {seen.length > 0 && (
        <Section title="Already watched" tone="muted">
          <Grid stories={seen} onOpen={(i) => setOpenAt(stories.indexOf(seen[i]))} />
        </Section>
      )}

      {openAt !== null && (
        <StoryViewer
          stories={stories}
          startIndex={openAt}
          onClose={() => setOpenAt(null)}
          onSeen={markSeen}
        />
      )}
    </div>
  );
}

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone: 'coral' | 'brand' | 'muted';
  children: React.ReactNode;
}) {
  const dot = {
    coral: 'bg-accent-coral animate-pulse',
    brand: 'bg-brand-400',
    muted: 'bg-line',
  }[tone];
  return (
    <section className="mb-7">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <span className={clsx('h-1.5 w-1.5 rounded-full', dot)} />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ stories, onOpen }: { stories: typeof import('@/lib/mock-data').stories; onOpen: (i: number) => void }) {
  if (stories.length === 0) {
    return (
      <div className="card p-6 text-sm text-ink-muted">Nothing to show in this row right now.</div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {stories.map((s, i) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onOpen(i)}
          // Without this the tile's name is whatever text lands inside it —
          // a name, a caption, and the word "Live", run together.
          aria-label={`View ${s.user.name}'s story`}
          className="group relative overflow-hidden rounded-2xl border border-line/60 text-left transition-transform hover:-translate-y-0.5"
        >
          <div className="relative aspect-[3/4]">
            <Image
              src={s.thumbnail}
              alt=""
              fill
              sizes="(min-width: 1024px) 260px, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
            {s.isLive && (
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent-coral px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                <Radio className="h-3 w-3" /> Live
              </span>
            )}
            <div className="absolute inset-x-3 bottom-3 flex items-end gap-2">
              <Avatar user={s.user} size={32} ring="story" />
              <div className="min-w-0 flex-1 pb-1">
                <div className="truncate text-sm font-semibold text-white">{s.user.name}</div>
                <div className="truncate text-[11px] text-white/70">@{s.user.handle}</div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
