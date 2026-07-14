'use client';

import Image from 'next/image';
import { useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Users2, Plus, Search, Check, X } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { useCommunities } from '@/lib/useCommunities';
import { useDialog } from '@/lib/useDialog';
import { Portal } from '@/components/Portal';
import { NAME_LIMIT, TOPIC_LIMIT, validateCommunityName } from '@/lib/communities';
import { useToast } from '@/components/Toast';
import { formatCount, type Community } from '@/lib/mock-data';

export default function CommunitiesPage() {
  // Persisted: joining and leaving used to be forgotten on reload.
  const { communities, isJoined, toggleJoin, createCommunity } = useCommunities();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const onToggleJoin = (c: Community) => {
    const wasJoined = isJoined(c);
    toggleJoin(c);
    toast(wasJoined ? `Left ${c.name}` : `Joined ${c.name}`, {
      action: { label: 'Undo', onClick: () => toggleJoin(c) },
    });
  };

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      communities.filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      ),
    [communities, q],
  );

  const myList = visible.filter((c) => isJoined(c));
  const discoverList = visible.filter((c) => !isJoined(c));

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Communities" subtitle="Small, opinionated rooms where the conversation goes deeper." />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-4 py-2 focus-within:border-brand-400/50 focus-within:ring-2 focus-within:ring-brand-500/20">
          <Search className="h-4 w-4 text-ink-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities by name or topic"
            className="w-full bg-transparent py-1 text-sm text-ink placeholder:text-ink-dim focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-400/40 bg-brand-500/10 px-4 py-2 text-xs font-semibold text-brand-200 hover:bg-brand-500/20"
        >
          <Plus className="h-3.5 w-3.5" /> Create community
        </button>
      </div>

      <section className="mb-7">
        <h2 className="mb-3 text-sm font-semibold text-ink">Your communities ({myList.length})</h2>
        {myList.length === 0 ? (
          <div className="card p-6 text-sm text-ink-muted">You haven&apos;t joined any communities yet. Browse below.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myList.map((c) => (
              <CommunityCard key={c.id} community={c} joined onToggle={() => onToggleJoin(c)} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Discover more</h2>
        <div className="card divide-y divide-line/40">
          {discoverList.length === 0 ? (
            <p className="p-6 text-sm text-ink-muted">Nothing new matching &quot;{query}&quot;.</p>
          ) : (
            discoverList.map((c) => {
              const joined = isJoined(c);
              return (
                <div key={c.id} className="flex items-center gap-3 p-4">
                  <Link
                    href={`/dashboard/c/${c.slug}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300"
                    aria-label={c.name}
                  >
                    <Users2 className="h-4 w-4" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/c/${c.slug}`} className="inline-flex min-h-[24px] items-center text-sm font-semibold text-ink hover:underline">
                      {c.name}
                    </Link>
                    <div className="truncate text-xs text-ink-dim">
                      {formatCount(c.members)} members · {c.topic}
                    </div>
                  </div>
                  <Link href={`/dashboard/c/${c.slug}`} className="btn-ghost px-4 py-2 text-xs">
                    Preview
                  </Link>
                  <button
                    type="button"
                    onClick={() => onToggleJoin(c)}
                    aria-pressed={joined}
                    aria-label={joined ? `Leave ${c.name}` : `Join ${c.name}`}
                    className={clsx(
                      'rounded-full px-4 py-2 text-xs font-semibold transition-colors',
                      joined
                        ? 'border border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg'
                        : 'btn-primary',
                    )}
                  >
                    {joined ? 'Joined' : 'Join'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {creating && (
        <CreateCommunityModal
          existing={communities}
          onClose={() => setCreating(false)}
          onCreate={(name, topic) => {
            const c = createCommunity(name, topic);
            setCreating(false);
            setQuery('');
            toast(`Created ${c.name}`);
          }}
        />
      )}
    </div>
  );
}

/** Create-community dialog: labelled, Escape-closable, validated. */
function CreateCommunityModal({
  existing,
  onClose,
  onCreate,
}: {
  existing: Community[];
  onClose: () => void;
  onCreate: (name: string, topic: string) => void;
}) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [showError, setShowError] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useDialog<HTMLDivElement>({ onClose, initialFocus: nameRef });
  const id = useId();
  const errorId = `${id}-error`;

  const error = validateCommunityName(name, existing);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      setShowError(true);
      return;
    }
    onCreate(name, topic);
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
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
        aria-labelledby={`${id}-title`}
        tabIndex={-1}
        className="card relative w-full max-w-md p-6 shadow-2xl focus:outline-none"
      >
        <div className="flex items-center justify-between">
          <h3 id={`${id}-title`} className="text-lg font-semibold text-ink">
            Create community
          </h3>
          <button type="button" onClick={onClose} className="btn-icon h-8 w-8" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={submit} noValidate>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor={`${id}-name`} className="text-xs font-medium text-ink-muted">
                Name
              </label>
              <span className="text-[11px] tabular-nums text-ink-dim">
                {name.trim().length}/{NAME_LIMIT}
              </span>
            </div>
            <input
              ref={nameRef}
              id={`${id}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rust & systems"
              aria-invalid={showError && !!error}
              aria-describedby={showError && error ? errorId : undefined}
              className={clsx('input-field mt-1.5', showError && error && 'border-accent-coral/60')}
            />
            {showError && error && (
              <p id={errorId} role="alert" className="mt-1 text-xs text-accent-coral-fg">
                {error}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor={`${id}-topic`} className="text-xs font-medium text-ink-muted">
                Topic <span className="text-ink-dim">(optional)</span>
              </label>
              <span className="text-[11px] tabular-nums text-ink-dim">
                {topic.trim().length}/{TOPIC_LIMIT}
              </span>
            </div>
            <input
              id={`${id}-topic`}
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="systems programming"
              maxLength={TOPIC_LIMIT}
              className="input-field mt-1.5"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}

function CommunityCard({
  community,
  joined,
  onToggle,
}: {
  community: Community;
  joined: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      {/* Wraps only the cover image, so it had no text and no name — a tab stop
          that announced nothing at all. */}
      <Link
        href={`/dashboard/c/${community.slug}`}
        aria-label={`Open ${community.name}`}
        className="block"
      >
        <div className="relative h-28">
          <Image
            src={community.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-raised to-transparent" />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/dashboard/c/${community.slug}`} className="text-base font-semibold text-ink hover:underline">
          {community.name}
        </Link>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{community.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-ink-dim">{formatCount(community.members)} members</span>
          <span className="inline-flex items-center gap-1 text-accent-mint-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-mint animate-pulse" />
            {community.online} online
          </span>
        </div>
        {/* Named the same way as the Discover row's control, so "Joined" is not
            an unlabelled button whose meaning depends on where it sits. */}
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={joined}
          aria-label={joined ? `Leave ${community.name}` : `Join ${community.name}`}
          className={clsx(
            'mt-4 w-full rounded-full py-2 text-xs font-semibold transition-colors',
            joined
              ? 'border border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg'
              : 'btn-primary',
          )}
        >
          {joined ? (
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3 w-3" /> Joined
            </span>
          ) : (
            'Join community'
          )}
        </button>
      </div>
    </div>
  );
}
