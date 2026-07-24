'use client';

import { Heart, MessageCircle, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { currentUser, formatCount, type Comment } from '@/lib/mock-data';
import { useRef, useState } from 'react';
import clsx from 'clsx';
import { COMMENT_LIMIT, mergeComments, validateComment } from '@/lib/comments';
import { useComments } from '@/lib/useComments';
import { useToast } from '@/components/Toast';

export function CommentThread({ postId, comments }: { postId: string; comments: Comment[] }) {
  const [draft, setDraft] = useState('');
  const [showError, setShowError] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  // Persisted: a comment that vanishes on reload was never a comment.
  const { ownFor, addComment, removeComment, isLiked, toggleLike } = useComments();
  const { toast } = useToast();

  const error = validateComment(draft);
  const remaining = COMMENT_LIMIT - draft.trim().length;
  const thread = mergeComments(comments, ownFor(postId));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      setShowError(true);
      return;
    }
    const comment = addComment(postId, draft);
    setDraft('');
    setShowError(false);
    toast('Reply posted', {
      action: { label: 'Undo', onClick: () => removeComment(postId, comment.id) },
    });
  };

  /**
   * "Reply" on a comment used to be a button wired to nothing at all. It now
   * does the obvious thing: focus the composer and address the person.
   */
  const replyTo = (handle: string) => {
    setDraft((current) => (current.includes(`@${handle}`) ? current : `@${handle} ${current}`.trim() + ' '));
    composerRef.current?.focus();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="flex items-start gap-3" noValidate>
        <Avatar user={currentUser} size={36} />
        <div className="flex-1 rounded-xl border border-line/60 bg-bg-subtle/60 focus-within:border-brand-400/50 focus-within:ring-2 focus-within:ring-brand-500/20">
          <label htmlFor="comment-body" className="sr-only">
            Add a reply
          </label>
          <textarea
            id="comment-body"
            ref={composerRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Add a thoughtful reply…"
            aria-invalid={showError && !!error}
            aria-describedby={showError && error ? 'comment-error' : undefined}
            className="w-full resize-none rounded-xl bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:outline-none"
          />
          <div className="flex items-center justify-end gap-2 border-t border-line/40 px-3 py-2 text-xs text-ink-dim">
            {showError && error && (
              <p id="comment-error" role="alert" className="mr-auto text-accent-coral-fg">
                {error}
              </p>
            )}
            {/* The counter used to count down past zero with nothing stopping
                you: the limit was decoration. It is enforced now. */}
            <span className={clsx('tabular-nums', remaining < 0 && 'text-accent-coral-fg')}>
              {remaining}
            </span>
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
        {thread.map((c) => (
          <li key={c.id} className="pt-4">
            <CommentItem
              comment={c}
              isLiked={isLiked}
              onToggleLike={toggleLike}
              onReply={replyTo}
              onDelete={
                c.id.startsWith('own-')
                  ? () => {
                      removeComment(postId, c.id);
                      toast('Reply deleted');
                    }
                  : undefined
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentItem({
  comment,
  depth = 0,
  isLiked,
  onToggleLike,
  onReply,
  onDelete,
}: {
  comment: Comment;
  depth?: number;
  // Passed as lookups, not as a resolved boolean: a nested reply has its own
  // like state, and handing it the parent's would light them up together.
  isLiked: (commentId: string) => boolean;
  onToggleLike: (commentId: string) => void;
  onReply: (handle: string) => void;
  onDelete?: () => void;
}) {
  const liked = isLiked(comment.id);
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
            onClick={() => onToggleLike(comment.id)}
            // The accessible name used to be the like count — a button called
            // "42", which tells a screen-reader user nothing about what it does.
            aria-label={
              liked
                ? `Unlike ${comment.user.name}'s reply`
                : `Like ${comment.user.name}'s reply`
            }
            aria-pressed={liked}
            className={clsx(
              'inline-flex min-h-[24px] items-center gap-1 rounded-full px-2 py-1 transition-colors hover:text-accent-coral-fg',
              liked && 'text-accent-coral-fg',
            )}
          >
            <Heart aria-hidden="true" className={clsx('h-3.5 w-3.5', liked && 'fill-accent-coral')} />
            {formatCount(likes)}
          </button>

          <button
            type="button"
            onClick={() => onReply(comment.user.handle)}
            aria-label={`Reply to ${comment.user.name}`}
            className="inline-flex min-h-[24px] items-center gap-1 rounded-full px-2 py-1 hover:text-ink"
          >
            <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" /> Reply
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete your reply"
              className="inline-flex min-h-[24px] items-center gap-1 rounded-full px-2 py-1 hover:text-accent-coral-fg"
            >
              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" /> Delete
            </button>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                depth={depth + 1}
                isLiked={isLiked}
                onToggleLike={onToggleLike}
                onReply={onReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
