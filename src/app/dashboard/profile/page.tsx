/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  BadgeCheck,
  MessageCircle,
  Settings2,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { PostCard } from '@/components/dashboard/PostCard';
import {
  currentUser as seedUser,
  posts,
  formatCount,
  type User,
} from '@/lib/mock-data';

const stats = (u: User) => [
  { label: 'Posts', value: '184' },
  { label: 'Following', value: formatCount(u.following ?? 0) },
  { label: 'Followers', value: formatCount(u.followers ?? 0) },
  { label: 'Joined', value: u.joined ?? 'Mar 2024' },
];

const tabs = ['Posts', 'Replies', 'Media', 'Long-form', 'Likes'] as const;
type Tab = (typeof tabs)[number];

export default function ProfilePage() {
  const [user, setUser] = useState<User>(seedUser);
  const [tab, setTab] = useState<Tab>('Posts');
  const [editing, setEditing] = useState(false);

  const tabPosts = useMemo(() => {
    const withMe = posts.map((p) => ({ ...p, author: user }));
    switch (tab) {
      case 'Posts':
        return withMe.slice(0, 4);
      case 'Replies':
        return withMe.slice(2, 5);
      case 'Media':
        return withMe.filter((p) => p.media);
      case 'Long-form':
        return withMe.filter((p) => p.category === 'longform');
      case 'Likes':
        return withMe.filter((p) => p.liked).concat(withMe.slice(0, 2));
    }
  }, [tab, user]);

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
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-ghost px-4 py-2 text-sm"
              >
                <Settings2 className="h-4 w-4" /> Edit profile
              </button>
              <button className="btn-primary px-4 py-2 text-sm">
                <MessageCircle className="h-4 w-4" /> Share
              </button>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-muted">{user.bio}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-dim">
            {user.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {user.location}
              </span>
            )}
            {user.link && (
              <a className="inline-flex items-center gap-1 text-brand-300 hover:text-brand-200" href="#">
                <LinkIcon className="h-3.5 w-3.5" /> {user.link}
              </a>
            )}
            {user.joined && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Joined {user.joined}
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats(user).map((s) => (
              <div key={s.label} className="rounded-2xl border border-line/60 bg-bg-subtle/60 p-3">
                <div className="text-lg font-semibold text-ink">{s.value}</div>
                <div className="text-[11px] uppercase tracking-wider text-ink-dim">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-xs transition-colors',
              tab === t
                ? 'bg-brand-500/15 font-semibold text-brand-200'
                : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-5">
        {tabPosts.length === 0 ? (
          <div className="card p-10 text-center text-sm text-ink-muted">Nothing in {tab.toLowerCase()} yet.</div>
        ) : (
          tabPosts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      {editing && (
        <EditProfileModal
          user={user}
          onClose={() => setEditing(false)}
          onSave={(u) => {
            setUser(u);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}

function EditProfileModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (u: User) => void;
}) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? '');
  const [location, setLocation] = useState(user.location ?? '');
  const [link, setLink] = useState(user.link ?? '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />
      <div className="card relative w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink">Edit profile</h3>
          <button type="button" onClick={onClose} className="btn-icon h-8 w-8" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-line/60 bg-bg-subtle/60 p-3">
          <img src={user.avatar} alt="" className="h-12 w-12 rounded-full" />
          <button className="btn-ghost px-3 py-1.5 text-xs">
            <ImageIcon className="h-3.5 w-3.5" /> Change avatar
          </button>
        </div>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...user, name, bio, location, link });
          }}
        >
          <FieldInput label="Display name" value={name} onChange={setName} />
          <FieldInput label="Bio" value={bio} onChange={setBio} multiline />
          <FieldInput label="Location" value={location} onChange={setLocation} />
          <FieldInput label="Link" value={link} onChange={setLink} />
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="input-field mt-1.5"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field mt-1.5"
        />
      )}
    </label>
  );
}
