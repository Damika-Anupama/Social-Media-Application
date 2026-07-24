'use client';

import { useState } from 'react';
import { Image as ImageIcon, Smile, MapPin, Calendar, Hash, Globe2, ChevronDown, Check } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { DemoButton } from '@/components/DemoButton';
import { currentUser } from '@/lib/mock-data';
import { useUserPostsContext } from '@/lib/UserPostsContext';
import { useDraft } from '@/lib/useDraft';
import clsx from 'clsx';

const tones = [
  { id: 'thought', label: 'Thought' },
  { id: 'photo', label: 'Photo' },
  { id: 'video', label: 'Video' },
  { id: 'live', label: 'Live room' },
  { id: 'poll', label: 'Poll' },
];

export function PostComposer({
  onPosted,
  variant = 'card',
}: {
  onPosted?: () => void;
  variant?: 'card' | 'naked';
}) {
  // Text and tone live in the persisted draft store, so closing the compose
  // modal — or a reload — no longer eats whatever was typed.
  const { draft, save, clear } = useDraft();
  const [posted, setPosted] = useState(false);
  const { addPost } = useUserPostsContext();

  const text = draft.text;
  const tone = draft.tone;
  const remaining = 500 - text.length;
  const remainingTone =
    remaining < 0 ? 'text-accent-coral-fg' : remaining < 40 ? 'text-accent-sun-fg' : 'text-ink-dim';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || remaining < 0) return;
    addPost(trimmed);
    clear();
    setPosted(true);
    setTimeout(() => setPosted(false), 2500);
    onPosted?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={variant === 'card' ? 'card p-5' : 'p-5'}
    >
      <div className="flex items-start gap-3">
        <Avatar user={currentUser} size={44} />
        {/* min-w-0: a flex child defaults to min-width:auto, so it refuses to
            shrink below its content. Without this the composer was 409px wide
            inside a 320px phone and dragged the whole page sideways. */}
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => save({ ...draft, tone: t.id })}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  tone === t.id
                    ? 'border-brand-400/60 bg-brand-500/10 text-brand-200'
                    : 'border-line bg-bg-subtle text-ink-muted hover:text-ink',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => save({ ...draft, text: e.target.value })}
            onKeyDown={(e) => {
              // Cmd/Ctrl+Enter posts — the shortcut every composer teaches.
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="What are you noticing today?"
            rows={3}
            className="w-full resize-none rounded-xl bg-transparent p-2 text-[15px] leading-relaxed text-ink placeholder:text-ink-dim focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-y-3 border-t border-line/60 pt-3">
            <div className="flex flex-wrap items-center gap-1 text-ink-muted">
              <ToolbarButton icon={<ImageIcon className="h-4 w-4" />} label="Photo" />
              <ToolbarButton icon={<Smile className="h-4 w-4" />} label="Emoji" />
              <ToolbarButton icon={<MapPin className="h-4 w-4" />} label="Location" />
              <ToolbarButton icon={<Calendar className="h-4 w-4" />} label="Schedule" />
              <ToolbarButton icon={<Hash className="h-4 w-4" />} label="Tag" />
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              <DemoButton
                notice="Audience controls aren't part of this demo — every post here is public."
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-subtle px-3 py-1.5 text-xs text-ink-muted hover:text-ink"
              >
                <Globe2 aria-hidden="true" className="h-3.5 w-3.5" /> Everyone{' '}
                <ChevronDown aria-hidden="true" className="h-3 w-3" />
              </DemoButton>
              <span className={clsx('text-xs tabular-nums', remainingTone)}>{remaining}</span>
              {posted ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-mint/10 px-5 py-2 text-sm font-medium text-accent-mint-fg animate-fade-up">
                  <Check className="h-4 w-4" /> Posted!
                </span>
              ) : (
                <button
                  type="submit"
                  disabled={text.trim().length === 0 || remaining < 0}
                  className="btn-primary px-4 py-2 text-sm sm:px-5"
                >
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <DemoButton
      notice={`${label} isn't part of this demo — the text composer is.`}
      className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-bg-subtle hover:text-ink"
      aria-label={label}
      title={label}
    >
      {icon}
    </DemoButton>
  );
}
