'use client';

import { Heart, MessageCircle } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { currentUser, formatCount, type Comment } from '@/lib/mock-data';
import { useState } from 'react';
import clsx from 'clsx';

export function CommentThread({ comments }: { comments: Comment[] }) {
  const [draft, setDraft] = useState('');
  const [local, setLocal] = useState<Comment[]>([]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setLocal((arr) => [
      { id: `local-${Date.now()}`, user: currentUser, body: draft.trim(), time: 'now', likes: 0 },
      ...arr,
    ]);
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex items-start gap-3">
        <Avatar user={currentUser} size={36} />
        <div className="flex-1 rounded-xl border border-line/60 bg-bg-subtle/60 focus-within:border-brand-400/50">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Add a thoughtful reply…"
            className="w-full resize-none rounded-xl bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:outline-none"
          />
          <div className="flex items-center justify-end gap-2 border-t border-line/40 px-3 py-2 text-xs text-ink-dim">
            <span className={clsx(draft.length > 280 && 'text-accent-coral')}>{300 - draft.length}</span>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="btn-primary px-3 py-1.5 text-xs disabled:opacity-50"
            >
              Reply
            </button>
          </div>
        </div>
      </form>

      <ul className="divide-y divide-line/40">
        {[...local, ...comments].map((c) => (
          <li key={c.id} className="pt-4">
            <CommentItem comment={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [liked, setLiked] = useState(false);
  const likes = comment.likes + (liked ? 1 : 0);

  return (
    <div className={clsx('flex items-start gap-3 pb-4', depth > 0 && 'mt-3 border-l border-line/60 pl-4')}>
      <Avatar user={comment.user} size={depth ? 30 : 36} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-semibold text-ink">{comment.user.name}</span>
          <span className="text-xs text-ink-dim">@{comment.user.handle} · {comment.time}</span>
        </div>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-muted">{comment.body}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-ink-dim">
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className={clsx(
              'inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:text-accent-coral',
              liked && 'text-accent-coral',
            )}
            aria-pressed={liked}
          >
            <Heart className={clsx('h-3.5 w-3.5', liked && 'fill-accent-coral')} /> {formatCount(likes)}
          </button>
          <button className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:text-ink">
            <MessageCircle className="h-3.5 w-3.5" /> Reply
          </button>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((r) => (
              <CommentItem key={r.id} comment={r} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
