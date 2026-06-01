'use client';

import { useCompose } from './ComposeContext';
import { PostComposer } from './PostComposer';
import { X } from 'lucide-react';

export function ComposeModal() {
  const { open, setOpen } = useCompose();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10 sm:py-16">
      <button
        type="button"
        aria-label="Close compose"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-2xl animate-fade-up">
        <div className="card relative overflow-hidden p-1.5 shadow-2xl shadow-brand-500/10">
          <div className="flex items-center justify-between px-4 pt-3">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">New post</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-icon h-8 w-8"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <PostComposer variant="naked" onPosted={() => setOpen(false)} />
        </div>
        <p className="mt-3 text-center text-[11px] text-ink-dim">
          Press <kbd className="rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
