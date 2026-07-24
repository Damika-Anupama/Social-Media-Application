'use client';

import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { X, ChevronLeft, ChevronRight, Heart, Send, Radio, Pause, Play } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { useDialog } from '@/lib/useDialog';
import { conversations, type Story } from '@/lib/mock-data';
import { useConversations } from '@/lib/useConversations';
import { useToast } from '@/components/Toast';

const STORY_DURATION_MS = 5000;

export function StoryViewer({
  stories,
  startIndex,
  onClose,
  onSeen,
}: {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
  /** Called with a story's id once it is shown, so the grid can mark it watched. */
  onSeen?: (id: string) => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reply, setReply] = useState('');
  // Typing is its own pause: the timer kept running under the reply box, so a
  // slow reply was sent to whichever story had flipped in underneath it.
  const [replyFocused, setReplyFocused] = useState(false);
  const frozen = paused || replyFocused;

  const { append } = useConversations();
  const { toast } = useToast();

  const current = stories[index];

  // Whichever story is on screen counts as watched. Fires on open and on every
  // advance, so the grid's "Already watched" row reflects the whole session.
  useEffect(() => {
    onSeen?.(current.id);
  }, [current.id, onSeen]);

  /**
   * Send the reply as a direct message to whoever posted the story. If there is
   * no thread with them in the seeded inbox, say so rather than pretending it
   * landed somewhere.
   */
  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    const text = reply.trim();
    if (!text) return;

    const conversation = conversations.find((c) => c.user.handle === current.user.handle);
    if (!conversation) {
      toast(`You don't have a conversation with @${current.user.handle} yet.`, { tone: 'info' });
      return;
    }

    append(conversation.id, { from: 'me', time: 'now', text });
    setReply('');
    toast(`Reply sent to ${current.user.name.split(' ')[0]} — find it in Messages`);
  };

  const next = useCallback(() => {
    setLiked(false);
    setProgress(0);
    setIndex((i) => {
      if (i >= stories.length - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
  }, [onClose, stories.length]);

  const prev = useCallback(() => {
    setLiked(false);
    setProgress(0);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    if (frozen) return;
    const start = Date.now() - progress * STORY_DURATION_MS;
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / STORY_DURATION_MS);
      setProgress(p);
      if (p >= 1) next();
    }, 50);
    return () => clearInterval(id);
  }, [frozen, next, progress, index]);

  // Escape, scroll lock, focus trap and focus restore come from useDialog —
  // this overlay covered the whole screen and had none of them, so Tab walked
  // straight out into the page behind it. Story navigation stays here.
  const dialogRef = useDialog<HTMLDivElement>({ onClose });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Keys typed into the reply box are text, not navigation: Space was
      // pausing instead of typing a space, and arrows switched stories out
      // from under the caret.
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const overlay = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${current.user.name}'s story`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-xl focus:outline-none"
    >
      {/* Stories advance on their own. WCAG 2.2.2 wants a way to stop that, and
          "hold the mouse down" is not a way anyone can find. */}
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? 'Resume stories' : 'Pause stories'}
        className="absolute right-[4.5rem] top-5 z-50 btn-icon h-10 w-10"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close stories"
        className="absolute right-5 top-5 z-50 btn-icon h-10 w-10"
      >
        <X className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous story"
        disabled={index === 0}
        className="absolute left-4 top-1/2 z-40 -translate-y-1/2 btn-icon h-12 w-12 hidden md:inline-flex disabled:opacity-30"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next story"
        className="absolute right-4 top-1/2 z-40 -translate-y-1/2 btn-icon h-12 w-12 hidden md:inline-flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        className="relative h-[88vh] w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-line/60 shadow-2xl"
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <Image
          src={current.thumbnail}
          alt=""
          fill
          priority
          sizes="(min-width: 640px) 420px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg/80" />

        <div className="absolute inset-x-3 top-3 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className={clsx('h-full bg-white transition-[width] duration-50', i < index && 'w-full')}
                style={{ width: i === index ? `${progress * 100}%` : i < index ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-3 top-7 flex items-center gap-2 pt-2">
          <Avatar user={current.user} size={36} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              {current.user.name}
              {current.isLive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-coral px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
                  <Radio className="h-2.5 w-2.5" /> Live
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/70">@{current.user.handle} · just now</div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          {current.caption && (
            <p className="mb-4 text-sm leading-snug text-white drop-shadow-md">{current.caption}</p>
          )}
          {/* This form used to swallow whatever you typed: submit called
              preventDefault and stopped. Replying to a story is a direct
              message, and messages are a real, persisted feature — so send it
              there, and say where it went. */}
          <form onSubmit={sendReply} className="flex items-center gap-2">
            <label htmlFor="story-reply" className="sr-only">
              Reply to {current.user.name}
            </label>
            <input
              id="story-reply"
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onFocus={() => setReplyFocused(true)}
              onBlur={() => setReplyFocused(false)}
              placeholder={`Reply to ${current.user.name.split(' ')[0]}…`}
              className="flex-1 rounded-full border border-white/20 bg-bg/40 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:border-white/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setLiked((v) => !v)}
              aria-pressed={liked}
              aria-label="Like story"
              className="btn-icon h-10 w-10"
            >
              <Heart className={clsx('h-4 w-4', liked && 'fill-accent-coral text-accent-coral-fg')} />
            </button>
            <button
              type="submit"
              disabled={!reply.trim()}
              className="btn-icon h-10 w-10 disabled:opacity-40"
              aria-label="Send reply"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* These invisible tap zones used to span the full height, so on a
            phone they sat on top of the reply bar: tapping Send advanced the
            story instead of sending the reply. They now stop above it. */}
        <button
          type="button"
          onClick={prev}
          aria-label="Tap previous"
          className="absolute bottom-24 left-0 top-0 w-1/3 md:hidden"
        />
        <button
          type="button"
          onClick={next}
          aria-label="Tap next"
          className="absolute bottom-24 right-0 top-0 w-1/3 md:hidden"
        />
      </div>
    </div>
  );

  // Portal to <body> so the overlay is a true full-screen window. Rendered in
  // place, it is trapped by the Stories card's `overflow-hidden` and its
  // `backdrop-filter` (which makes the card a containing block for fixed
  // descendants) — the popup would be clipped to that small card instead of
  // covering the screen.
  if (typeof document === 'undefined') return null;
  return createPortal(overlay, document.body);
}
