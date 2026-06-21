'use client';

import { useState } from 'react';
import { Image as ImageIcon, Smile, MapPin, Calendar, Hash, Globe2, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { currentUser } from '@/lib/mock-data';
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
  onSubmitText,
  variant = 'card',
}: {
  onPosted?: () => void;
  onSubmitText?: (text: string) => void;
  variant?: 'card' | 'naked';
}) {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('thought');
  const remaining = 500 - text.length;
  const remainingTone =
    remaining < 0 ? 'text-accent-coral' : remaining < 40 ? 'text-accent-sun' : 'text-ink-dim';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed.length === 0 || remaining < 0) return;
        onSubmitText?.(trimmed);
        setText('');
        onPosted?.();
      }}
      className={variant === 'card' ? 'card p-5' : 'p-5'}
    >
      <div className="flex items-start gap-3">
        <Avatar user={currentUser} size={44} />
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
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
            onChange={(e) => setText(e.target.value)}
            placeholder="What are you noticing today?"
            rows={3}
            className="w-full resize-none rounded-xl bg-transparent text-[15px] leading-relaxed text-ink placeholder:text-ink-dim focus:outline-none"
          />

          <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-3">
            <div className="flex items-center gap-1 text-ink-muted">
              <ToolbarButton icon={<ImageIcon className="h-4 w-4" />} label="Photo" />
              <ToolbarButton icon={<Smile className="h-4 w-4" />} label="Emoji" />
              <ToolbarButton icon={<MapPin className="h-4 w-4" />} label="Location" />
              <ToolbarButton icon={<Calendar className="h-4 w-4" />} label="Schedule" />
              <ToolbarButton icon={<Hash className="h-4 w-4" />} label="Tag" />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-subtle px-3 py-1.5 text-xs text-ink-muted hover:text-ink"
              >
                <Globe2 className="h-3.5 w-3.5" /> Everyone <ChevronDown className="h-3 w-3" />
              </button>
              <span className={clsx('text-xs tabular-nums', remainingTone)}>{remaining}</span>
              <button type="submit" disabled={text.trim().length === 0 || remaining < 0} className="btn-primary px-5 py-2 text-sm">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function ToolbarButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-bg-subtle hover:text-ink"
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
