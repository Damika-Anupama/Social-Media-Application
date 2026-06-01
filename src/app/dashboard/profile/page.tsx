/* eslint-disable @next/next/no-img-element */
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import { PostCard } from '@/components/dashboard/PostCard';
import { currentUser, posts, formatCount } from '@/lib/mock-data';
import { Calendar, MapPin, Link as LinkIcon, BadgeCheck, MessageCircle, Settings2 } from 'lucide-react';

const userPosts = posts.slice(0, 3);
const stats = [
  { label: 'Posts', value: '184' },
  { label: 'Following', value: formatCount(currentUser.following ?? 0) },
  { label: 'Followers', value: formatCount(currentUser.followers ?? 0) },
  { label: 'Joined', value: 'Mar 2024' },
];

export default function ProfilePage() {
  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Your profile" subtitle="This is what your handle looks like from the outside." />

      <div className="card relative overflow-hidden">
        <div className="relative h-48 sm:h-56">
          <img
            src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1600&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-raised via-bg-raised/40 to-transparent" />
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="relative inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint p-1 shadow-xl">
                <img src={currentUser.avatar} alt="" className="h-full w-full rounded-full bg-bg object-cover" />
              </span>
              <div className="pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">{currentUser.name}</h2>
                  {currentUser.verified && <BadgeCheck className="h-5 w-5 text-brand-300" aria-label="Verified" />}
                </div>
                <p className="text-sm text-ink-dim">@{currentUser.handle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <button className="btn-ghost px-4 py-2 text-sm">
                <Settings2 className="h-4 w-4" /> Edit profile
              </button>
              <button className="btn-primary px-4 py-2 text-sm">
                <MessageCircle className="h-4 w-4" /> Message
              </button>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted">{currentUser.bio}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-dim">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Colombo · San Francisco</span>
            <a className="inline-flex items-center gap-1 text-brand-300 hover:text-brand-200" href="#">
              <LinkIcon className="h-3.5 w-3.5" /> damika.dev
            </a>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined March 2024</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line/60 bg-bg-subtle/60 p-3">
                <div className="text-lg font-semibold text-ink">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-ink-dim">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {['Posts', 'Replies', 'Media', 'Long-form', 'Likes', 'Lists'].map((t, i) => (
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

      <div className="mt-4 space-y-5">
        {userPosts.map((p) => (
          <PostCard key={p.id} post={{ ...p, author: currentUser }} />
        ))}
      </div>
    </div>
  );
}
