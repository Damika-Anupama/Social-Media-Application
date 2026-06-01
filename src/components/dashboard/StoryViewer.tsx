/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { X, ChevronLeft, ChevronRight, Heart, Send, Radio } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import type { Story } from '@/lib/mock-data';

const STORY_DURATION_MS = 5000;

export function StoryViewer({
  stories,
  startIndex,
  onClose,
}: {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [liked, setLiked] = useState(false);

  const current = stories[index];

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
    if (paused) return;
    const start = Date.now() - progress * STORY_DURATION_MS;
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / STORY_DURATION_MS);
      setProgress(p);
      if (p >= 1) next();
    }, 50);
    return () => clearInterval(id);
  }, [paused, next, progress, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [next, prev, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-xl">
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
        <img src={current.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
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
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-coral px-1.5 py-0.5 text-[9px] font-bold uppercase">
                  <Radio className="h-2.5 w-2.5" /> Live
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/70">@{current.user.handle} · just now</div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5">
          {current.caption && (
            <p className="mb-4 text-sm leading-snug text-white drop-shadow-md">{current.caption}</p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
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
              <Heart className={clsx('h-4 w-4', liked && 'fill-accent-coral text-accent-coral')} />
            </button>
            <button type="submit" className="btn-icon h-10 w-10" aria-label="Send reply">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Tap previous"
          className="absolute inset-y-0 left-0 w-1/3 md:hidden"
        />
        <button
          type="button"
          onClick={next}
          aria-label="Tap next"
          className="absolute inset-y-0 right-0 w-1/3 md:hidden"
        />
      </div>
    </div>
  );
}
