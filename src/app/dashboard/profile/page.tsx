/* eslint-disable @next/next/no-img-element */
'use client';

import { useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { useTabs } from '@/components/Tabs';
import { DemoButton } from '@/components/DemoButton';
import { PostCard } from '@/components/dashboard/PostCard';
import { useProfile } from '@/lib/useProfile';
import { useUserPostsContext } from '@/lib/UserPostsContext';
import { buildShareUrl, shareLink } from '@/lib/share';
import { useDialog } from '@/lib/useDialog';
import { Portal } from '@/components/Portal';
import { useToast } from '@/components/Toast';
import {
  LIMITS,
  validateProfile,
  profilePostCount,
  type ProfileEdits,
  type ProfileErrors,
} from '@/lib/profile';
import { posts, postsByUser, currentUser, formatCount, type User } from '@/lib/mock-data';

const stats = (u: User, postCount: number): { label: string; value: string; href?: string }[] => [
  { label: 'Posts', value: formatCount(postCount) },
  { label: 'Following', value: formatCount(u.following ?? 0), href: `/dashboard/u/${u.handle}/following` },
  { label: 'Followers', value: formatCount(u.followers ?? 0), href: `/dashboard/u/${u.handle}/followers` },
  { label: 'Joined', value: u.joined ?? 'Mar 2024' },
];

const tabs = ['Posts', 'Replies', 'Media', 'Long-form', 'Likes'] as const;
type Tab = (typeof tabs)[number];

export default function ProfilePage() {
  // Persisted: an edit that disappears on reload is not an edit.
  const { user, saveProfile } = useProfile();
  // Composed posts are the user's only real content in this demo — the profile
  // reads the same store the composer writes to, so the count and the Posts tab
  // both update the moment they post.
  const { posts: userPosts } = useUserPostsContext();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('Posts');
  const [editing, setEditing] = useState(false);

  const postCount = profilePostCount(postsByUser(currentUser.id).length, userPosts.length);

  // The Share button had no onClick — sharing your own profile is the one thing
  // a profile page is for, and it was the one thing it did not do.
  const onShare = async () => {
    const result = await shareLink({
      url: buildShareUrl(`/dashboard/u/${user.handle}`),
      title: `${user.name} (@${user.handle}) on Pulse`,
      text: user.bio,
    });
    if (result === 'copied') toast('Profile link copied to clipboard');
    else if (result === 'failed') toast('Could not share this profile', { tone: 'info' });
  };

  const { tabListProps, getTabProps } = useTabs({
    items: tabs,
    selected: tabs.indexOf(tab),
    onSelect: (i) => setTab(tabs[i]),
  });

  const tabPosts = useMemo(() => {
    const withMe = posts.map((p) => ({ ...p, author: user }));
    // Show the user's own composed posts first, so posting is visible here and
    // not only in the home feed. Re-attribute to `user` to pick up profile edits.
    const mine = userPosts.map((p) => ({ ...p, author: user }));
    switch (tab) {
      case 'Posts':
        return [...mine, ...withMe.slice(0, 4)];
      case 'Replies':
        return withMe.slice(2, 5);
      case 'Media':
        return withMe.filter((p) => p.media);
      case 'Long-form':
        return withMe.filter((p) => p.category === 'longform');
      case 'Likes':
        return withMe.filter((p) => p.liked).concat(withMe.slice(0, 2));
    }
  }, [tab, user, userPosts]);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Your profile" subtitle="This is what your handle looks like from the outside." />

      <div className="card relative overflow-hidden">
        <div className="relative h-48 sm:h-56">
          {/* LCP element on this route — priority so it is not lazy-loaded. */}
          <Image
            src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1600&q=80"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-raised via-bg-raised/40 to-transparent" />
        </div>
        <div className="px-6 pb-6 sm:px-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
            {/* The avatar is fixed-width; the name beside it must be allowed to
                shrink, or a long display name pushes the card off a 320px phone.
                Only the avatar carries the negative margin so it alone straddles
                the banner — the name/handle stay fully below the wallpaper edge
                instead of riding up into the photo and getting clipped. */}
            <div className="flex min-w-0 max-w-full items-end gap-4">
              <span className="relative -mt-12 inline-flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint p-1 shadow-xl">
                <img src={user.avatar} alt="" className="h-full w-full rounded-full bg-bg object-cover" />
              </span>
              <div className="min-w-0 translate-y-1 pb-2">
                <div className="flex min-w-0 items-center gap-2">
                  <h2 className="truncate font-display text-2xl font-semibold tracking-tight">
                    {user.name}
                  </h2>
                  {user.verified && (
                    <BadgeCheck className="h-5 w-5 shrink-0 text-brand-300" aria-label="Verified" />
                  )}
                </div>
                <p className="truncate text-sm text-ink-dim">@{user.handle}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-ghost px-4 py-2 text-sm"
              >
                <Settings2 className="h-4 w-4" /> Edit profile
              </button>
              <button type="button" onClick={onShare} className="btn-primary px-4 py-2 text-sm">
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
              <a
                className="inline-flex min-h-[24px] items-center gap-1 text-brand-300 hover:text-brand-200"
                href={`https://${user.link}`}
                target="_blank"
                rel="noopener noreferrer"
              >
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
            {stats(user, postCount).map((s) => {
              const base = 'rounded-2xl border border-line/60 bg-bg-subtle/60 p-3';
              const body = (
                <>
                  <div className="text-lg font-semibold text-ink">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-dim">{s.label}</div>
                </>
              );
              return s.href ? (
                <Link
                  key={s.label}
                  href={s.href}
                  className={clsx(base, 'block text-left transition-colors hover:border-brand-400/40')}
                >
                  {body}
                </Link>
              ) : (
                <div key={s.label} className={base}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div {...tabListProps} aria-label="Profile content" className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t, i) => (
          <button
            key={t}
            {...getTabProps(i)}
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
          onSave={(edits) => {
            saveProfile(edits);
            setEditing(false);
            toast('Profile updated');
          }}
        />
      )}
    </div>
  );
}

/**
 * Edit-profile dialog.
 *
 * Was a plain <div> overlay: no dialog role, no Escape, no scroll lock, and no
 * validation — you could save an empty display name and wipe your own identity.
 */
function EditProfileModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (edits: ProfileEdits) => void;
}) {
  const [edits, setEdits] = useState<ProfileEdits>({
    name: user.name,
    bio: user.bio ?? '',
    location: user.location ?? '',
    link: user.link ?? '',
  });
  /** Errors are only shown once the viewer has tried to save. */
  const [showErrors, setShowErrors] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useDialog<HTMLDivElement>({ onClose, initialFocus: nameRef });

  const errors: ProfileErrors = validateProfile(edits);
  const visibleErrors = showErrors ? errors : {};

  const set = (key: keyof ProfileEdits) => (v: string) =>
    setEdits((current) => ({ ...current, [key]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length) {
      setShowErrors(true);
      return;
    }
    onSave(edits);
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        tabIndex={-1}
        className="card relative w-full max-w-lg p-6 shadow-2xl focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 id="edit-profile-title" className="text-lg font-semibold text-ink">
            Edit profile
          </h3>
          <button type="button" onClick={onClose} className="btn-icon h-8 w-8" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-line/60 bg-bg-subtle/60 p-3">
          <img src={user.avatar} alt="" className="h-12 w-12 rounded-full" />
          <DemoButton
            notice="Uploading an avatar isn't part of this demo — name, bio, location and link all save."
            className="btn-ghost px-3 py-1.5 text-xs"
          >
            <ImageIcon aria-hidden="true" className="h-3.5 w-3.5" /> Change avatar
          </DemoButton>
        </div>
        <form className="mt-5 space-y-4" onSubmit={submit} noValidate>
          <FieldInput
            ref={nameRef}
            label="Display name"
            value={edits.name}
            onChange={set('name')}
            error={visibleErrors.name}
            limit={LIMITS.name}
          />
          <FieldInput
            label="Bio"
            value={edits.bio}
            onChange={set('bio')}
            error={visibleErrors.bio}
            limit={LIMITS.bio}
            multiline
          />
          <FieldInput
            label="Location"
            value={edits.location}
            onChange={set('location')}
            error={visibleErrors.location}
            limit={LIMITS.location}
          />
          <FieldInput
            label="Link"
            value={edits.link}
            onChange={set('link')}
            error={visibleErrors.link}
            limit={LIMITS.link}
          />
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
    </Portal>
  );
}

function FieldInput({
  ref,
  label,
  value,
  onChange,
  multiline,
  error,
  limit,
}: {
  ref?: React.Ref<HTMLInputElement>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  error?: string;
  limit: number;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const over = value.trim().length > limit;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-medium text-ink-muted">
          {label}
        </label>
        <span className={clsx('text-[11px] tabular-nums', over ? 'text-accent-coral-fg' : 'text-ink-dim')}>
          {value.trim().length}/{limit}
        </span>
      </div>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={clsx('input-field mt-1.5', error && 'border-accent-coral/60')}
        />
      ) : (
        <input
          ref={ref}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={clsx('input-field mt-1.5', error && 'border-accent-coral/60')}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-accent-coral-fg">
          {error}
        </p>
      )}
    </div>
  );
}
