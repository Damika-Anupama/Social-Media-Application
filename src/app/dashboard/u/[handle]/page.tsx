/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  BadgeCheck,
  MessageCircle,
  UserPlus,
  Share2,
} from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import { PostCard } from '@/components/dashboard/PostCard';
import {
  allHandles,
  findUser,
  formatCount,
  posts,
  postsByUser,
  users,
} from '@/lib/mock-data';
import type { Metadata } from 'next';

type Params = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return allHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) return { title: '@' + handle + ' not found' };
  return {
    title: `${user.name} (@${user.handle})`,
    description: user.bio,
  };
}

const covers: Record<string, string> = {
  nadia: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  kenji: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  sasha: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=1600&q=80',
  amaru: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
  lina: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80',
  theo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
  priya: 'https://images.unsplash.com/photo-1517242027094-631f8c218a0f?auto=format&fit=crop&w=1600&q=80',
  marcos: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
  demo: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1600&q=80',
};

export default async function PublicProfilePage({ params }: Params) {
  const { handle } = await params;
  const user = findUser(handle);
  if (!user) notFound();

  const userPosts = postsByUser(user.id);
  const display = userPosts.length > 0 ? userPosts : posts.slice(0, 2).map((p) => ({ ...p, author: user }));
  const cover = covers[user.handle] ?? covers.nadia;

  const followsBack = users.slice(0, 4).filter((u) => u.id !== user.id);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title={user.name} subtitle={`@${user.handle} · ${formatCount(user.followers ?? 0)} followers`} />

      <div className="card overflow-hidden">
        <div className="relative h-48 sm:h-60">
          <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-raised via-bg-raised/40 to-transparent" />
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint p-1 shadow-xl">
                <img src={user.avatar} alt="" className="h-full w-full rounded-full bg-bg object-cover" />
              </span>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">{user.name}</h2>
                  {user.verified && <BadgeCheck className="h-5 w-5 text-brand-300" aria-label="Verified" />}
                </div>
                <p className="text-sm text-ink-dim">@{user.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <button className="btn-icon" aria-label="Share profile">
                <Share2 className="h-4 w-4" />
              </button>
              <Link href="/dashboard/messages" className="btn-ghost px-4 py-2 text-sm">
                <MessageCircle className="h-4 w-4" /> Message
              </Link>
              <button className="btn-primary px-4 py-2 text-sm">
                <UserPlus className="h-4 w-4" /> Follow
              </button>
            </div>
          </div>

          {user.bio && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted">{user.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-dim">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Remote</span>
            <a className="inline-flex items-center gap-1 text-brand-300 hover:text-brand-200" href="#">
              <LinkIcon className="h-3.5 w-3.5" /> {user.handle}.studio
            </a>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined 2024</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label="Posts" value={display.length.toString()} />
            <Stat label="Following" value={formatCount(user.following ?? 0)} />
            <Stat label="Followers" value={formatCount(user.followers ?? 0)} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['Posts', 'Replies', 'Media', 'Long-form', 'Likes'].map((t, i) => (
              <button
                key={t}
                className={
                  i === 0
                    ? 'rounded-full bg-brand-500/15 px-4 py-1.5 text-xs font-semibold text-brand-200'
                    : 'rounded-full border border-line bg-bg-subtle px-4 py-1.5 text-xs font-medium text-ink-muted hover:text-ink'
                }
              >
                {t}
              </button>
            ))}
          </div>
          {display.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>

        <aside className="hidden flex-col gap-4 lg:flex">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink">Followed by people you know</h3>
            <ul className="mt-4 space-y-3">
              {followsBack.slice(0, 3).map((u) => (
                <li key={u.id}>
                  <Link href={`/dashboard/u/${u.handle}`} className="flex items-center gap-3 hover:opacity-80">
                    <Avatar user={u} size={32} />
                    <span className="text-sm">
                      <span className="font-semibold text-ink">{u.name}</span>
                      <span className="block text-xs text-ink-dim">@{u.handle}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-ink-dim">
              And {Math.max((user.followers ?? 0) - followsBack.length, 0).toLocaleString()} others you don't.
            </p>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-ink">Pinned link</h3>
            <a
              href="#"
              className="mt-3 block rounded-xl border border-line/60 bg-bg-subtle/60 p-4 transition-colors hover:border-brand-400/40"
            >
              <div className="text-[11px] uppercase tracking-wider text-brand-300">Studio</div>
              <div className="mt-1 text-sm font-semibold text-ink">{user.handle}.studio</div>
              <div className="text-xs text-ink-dim">Updated this week</div>
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/60 bg-bg-subtle/60 p-3">
      <div className="text-lg font-semibold text-ink">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-ink-dim">{label}</div>
    </div>
  );
}
