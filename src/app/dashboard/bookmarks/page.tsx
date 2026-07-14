'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Bookmark, Search, FolderPlus, X, Check, Trash2 } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { useTabs } from '@/components/Tabs';
import { PostCard } from '@/components/dashboard/PostCard';
import { posts } from '@/lib/mock-data';
import { useReactions } from '@/lib/useReactions';
import { useCollections } from '@/lib/useCollections';
import { useDialog } from '@/lib/useDialog';
import { Portal } from '@/components/Portal';
import { useToast } from '@/components/Toast';
import {
  BUILT_IN,
  NAME_LIMIT,
  collectionCount,
  validateCollectionName,
  type Collection,
} from '@/lib/collections';

export default function BookmarksPage() {
  const [active, setActive] = useState('all');
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const { bookmarks } = useReactions();
  const { collections, createCollection, togglePost, deleteCollection } = useCollections();
  const { toast } = useToast();

  // Real bookmarks: only posts the viewer has actually saved (persisted store).
  const saved = useMemo(() => posts.filter((p) => bookmarks.has(p.id)), [bookmarks]);

  const builtIn = BUILT_IN.find((c) => c.id === active);
  const collection = collections.find((c) => c.id === active);
  const activeLabel = builtIn?.label ?? collection?.name ?? 'All';

  // Built-in filters and the viewer's own collections are one tab strip.
  const allTabs = [
    ...BUILT_IN.map((c) => ({ id: c.id, label: c.label, count: undefined as number | undefined })),
    ...collections.map((c) => ({
      id: c.id,
      label: c.name,
      count: collectionCount(c, bookmarks),
    })),
  ];
  const { tabListProps, getTabProps } = useTabs({
    items: allTabs,
    selected: Math.max(
      allTabs.findIndex((t) => t.id === active),
      0,
    ),
    onSelect: (i) => setActive(allTabs[i].id),
  });

  // Deleting the active collection must not strand the viewer on a filter that
  // no longer exists, staring at an empty list.
  useEffect(() => {
    if (!builtIn && !collection) setActive('all');
  }, [builtIn, collection]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return saved.filter((p) => {
      if (builtIn?.tag && !(p.tags ?? []).some((t) => t.includes(builtIn.tag!))) return false;
      if (collection && !collection.postIds.includes(p.id)) return false;
      if (q && !p.body.toLowerCase().includes(q) && !p.author.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [saved, builtIn, collection, query]);

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Bookmarks" subtitle="Posts you saved for later. Only visible to you." />

      <div className="card mb-5 flex items-center gap-3 p-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
          <Bookmark aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">
            {filtered.length} saved {filtered.length === 1 ? 'post' : 'posts'}
          </div>
          <div className="text-xs text-ink-dim">
            Bookmarks sync across your devices and are never shown to other accounts.
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-2 text-xs font-semibold text-brand-200 hover:bg-brand-500/20"
        >
          <FolderPlus aria-hidden="true" className="h-3.5 w-3.5" /> New collection
        </button>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* A tablist may contain only tabs, so the per-collection delete button
            cannot live in here. It sits beside the strip, acting on whichever
            collection is selected — which is also a far bigger target than a
            28px bin icon wedged inside a chip. */}
        <div
          {...tabListProps}
          aria-label="Filter bookmarks"
          className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1"
        >
          {allTabs.map((t, i) => (
            <button
              key={t.id}
              {...getTabProps(i)}
              className={clsx(
                'shrink-0 rounded-full px-4 py-1.5 text-xs transition-colors',
                active === t.id
                  ? 'bg-brand-500/15 font-semibold text-brand-200'
                  : 'border border-line bg-bg-subtle font-medium text-ink-muted hover:text-ink',
              )}
            >
              {t.label}
              {t.count !== undefined && <span className="ml-1.5 text-ink-dim">{t.count}</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {collection && (
            <button
              type="button"
              onClick={() => {
                deleteCollection(collection.id);
                toast(`Deleted ${collection.name}`);
              }}
              aria-label={`Delete collection ${collection.name}`}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-bg-subtle px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-accent-coral/40 hover:text-accent-coral-fg"
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" /> Delete
            </button>
          )}

          <div className="flex items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-3 py-1.5 focus-within:border-brand-400/50 focus-within:ring-2 focus-within:ring-brand-500/20">
            <Search aria-hidden="true" className="h-3.5 w-3.5 text-ink-dim" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter saved"
              aria-label="Filter saved posts"
              className="w-40 bg-transparent py-1 text-xs text-ink placeholder:text-ink-dim focus:outline-none"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-muted">
          Nothing saved in <span className="text-ink">{activeLabel}</span> yet.
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((p) => (
            <div key={p.id}>
              <PostCard post={p} />
              {collections.length > 0 && (
                <CollectionPicker postId={p.id} collections={collections} onToggle={togglePost} />
              )}
            </div>
          ))}
        </div>
      )}

      {creating && (
        <CreateCollectionModal
          existing={collections}
          onClose={() => setCreating(false)}
          onCreate={(name) => {
            const c = createCollection(name);
            setCreating(false);
            setActive(c.id);
            toast(`Created ${c.name}`);
          }}
        />
      )}
    </div>
  );
}

/** File a saved post into any of the viewer's collections. */
function CollectionPicker({
  postId,
  collections,
  onToggle,
}: {
  postId: string;
  collections: Collection[];
  onToggle: (collectionId: string, postId: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
      <span className="text-[11px] text-ink-dim">Save to</span>
      {collections.map((c) => {
        const filed = c.postIds.includes(postId);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onToggle(c.id, postId)}
            aria-pressed={filed}
            aria-label={filed ? `Remove from ${c.name}` : `Add to ${c.name}`}
            className={clsx(
              'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
              filed
                ? 'border-accent-mint/40 bg-accent-mint/10 text-accent-mint-fg'
                : 'border-line bg-bg-subtle text-ink-muted hover:text-ink',
            )}
          >
            {filed && <Check aria-hidden="true" className="h-3 w-3" />}
            {c.name}
          </button>
        );
      })}
    </div>
  );
}

/** Create-collection dialog: labelled, Escape-closable, validated. */
function CreateCollectionModal({
  existing,
  onClose,
  onCreate,
}: {
  existing: Collection[];
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useDialog<HTMLDivElement>({ onClose, initialFocus: inputRef });
  const id = useId();
  const errorId = `${id}-error`;

  const error = validateCollectionName(name, existing);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      setShowError(true);
      return;
    }
    onCreate(name);
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
            New collection
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
              ref={inputRef}
              id={`${id}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Weekend reads"
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
