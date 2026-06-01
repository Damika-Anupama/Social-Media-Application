/* eslint-disable @next/next/no-img-element */
import { TopBar } from '@/components/dashboard/TopBar';
import { Users2, Plus } from 'lucide-react';

const myCommunities = [
  {
    name: 'Slow Web Society',
    members: '12.4K',
    online: 318,
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    description: 'For people building software that respects attention.',
  },
  {
    name: 'Open Climate Lab',
    members: '8.1K',
    online: 96,
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    description: 'Field notes, datasets, and methods from climate researchers.',
  },
  {
    name: 'Halftone',
    members: '24.0K',
    online: 540,
    cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=1200&q=80',
    description: 'Design studios talking shop about type, identity, and craft.',
  },
];

const discover = [
  { name: 'Roastery', members: '3.2K', topic: 'Specialty coffee' },
  { name: 'Pixel Diaries', members: '6.8K', topic: 'Indie game dev' },
  { name: 'Long-form Cycling', members: '2.1K', topic: 'Endurance + travel' },
  { name: 'Postgres Wizards', members: '5.6K', topic: 'Databases at scale' },
];

export default function CommunitiesPage() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Communities" subtitle="Small, opinionated rooms where the conversation goes deeper." />

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Your communities</h2>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-200">
            <Plus className="h-3 w-3" /> Create
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myCommunities.map((c) => (
            <div key={c.name} className="card overflow-hidden">
              <div className="relative h-28">
                <img src={c.cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-raised to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold text-ink">{c.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{c.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-ink-dim">{c.members} members</span>
                  <span className="inline-flex items-center gap-1 text-accent-mint">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-mint animate-pulse" />
                    {c.online} online
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Discover more</h2>
        <div className="card divide-y divide-line/40">
          {discover.map((c) => (
            <div key={c.name} className="flex items-center gap-3 p-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
                <Users2 className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">{c.name}</div>
                <div className="text-xs text-ink-dim">{c.members} members · {c.topic}</div>
              </div>
              <button className="btn-ghost px-4 py-2 text-xs">Preview</button>
              <button className="btn-primary px-4 py-2 text-xs">Join</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
