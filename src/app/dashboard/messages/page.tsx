'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  Send,
  Search,
  Plus,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import { DemoButton } from '@/components/DemoButton';
import { useConversations } from '@/lib/useConversations';
import { useReadConversations } from '@/lib/useReadConversations';
import { composeReply, replyDelay } from '@/lib/chatReply';
import { scrollBehavior, useReducedMotion } from '@/lib/useReducedMotion';
import {
  conversations as seedConversations,
  threadsByConversation,
  currentUser,
  type ChatMessage,
  type ConversationPreview,
} from '@/lib/mock-data';

export default function MessagesPage() {
  const [convos, setConvos] = useState<ConversationPreview[]>(seedConversations);
  const [activeId, setActiveId] = useState(seedConversations[0].id);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  /**
   * Below md the list and the thread are separate screens (there is not room
   * for both), so we track which one the viewer is looking at. Desktop shows
   * both and ignores this entirely.
   */
  const [showThreadOnMobile, setShowThreadOnMobile] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const replyTimer = useRef<number | null>(null);

  const { sent, append } = useConversations();
  const { readIds, markRead } = useReadConversations();
  const reducedMotion = useReducedMotion();

  const active = convos.find((c) => c.id === activeId) ?? convos[0];
  // Seeded history first, then everything said since (restored from storage).
  const thread = useMemo<ChatMessage[]>(
    () => [...(threadsByConversation[activeId] ?? []), ...(sent[activeId] ?? [])],
    [activeId, sent],
  );

  // A pending canned reply must not outlive the page.
  useEffect(
    () => () => {
      if (replyTimer.current !== null) window.clearTimeout(replyTimer.current);
    },
    [],
  );

  // Opening a conversation reads it — persisted, so the sidebar badge drops
  // in the same breath and a reload doesn't resurrect the unread chip.
  useEffect(() => {
    markRead(activeId);
  }, [activeId, markRead]);

  // Keep the newest message in view without yanking the whole page around —
  // and jump instantly rather than gliding if motion is unwelcome.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: scrollBehavior(reducedMotion), block: 'nearest' });
  }, [thread.length, typing, activeId, reducedMotion]);

  const openConversation = useCallback((id: string) => {
    setActiveId(id);
    setShowThreadOnMobile(true);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return convos;
    return convos.filter(
      (c) =>
        c.user.name.toLowerCase().includes(q) ||
        c.user.handle.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q),
    );
  }, [convos, search]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const conversationId = activeId;
    append(conversationId, { from: 'me', time: 'now', text });
    setConvos((cs) =>
      cs.map((c) => (c.id === conversationId ? { ...c, lastMessage: text, time: 'now' } : c)),
    );
    setDraft('');

    setTyping(true);
    const reply = composeReply(text);
    replyTimer.current = window.setTimeout(() => {
      append(conversationId, { from: 'them', time: 'now', text: reply });
      setConvos((cs) =>
        cs.map((c) => (c.id === conversationId ? { ...c, lastMessage: reply, time: 'now' } : c)),
      );
      setTyping(false);
      replyTimer.current = null;
    }, replyDelay(text));
  };

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Messages" subtitle="Direct conversations are end-to-end encrypted on Pulse." />

      <div className="card grid h-[calc(100dvh-220px)] min-h-[420px] grid-cols-1 overflow-hidden md:h-[calc(100vh-200px)] md:grid-cols-[320px_1fr]">
        <div
          className={clsx(
            'flex-col border-r border-line/60 md:flex',
            showThreadOnMobile ? 'hidden' : 'flex',
          )}
        >
          <div className="flex items-center gap-2 border-b border-line/60 p-3">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-3 py-1.5 focus-within:border-brand-400/50 focus-within:ring-2 focus-within:ring-brand-500/20">
              <Search className="h-3.5 w-3.5 text-ink-dim" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats"
                aria-label="Search chats"
                className="w-full bg-transparent py-1 text-xs text-ink placeholder:text-ink-dim focus:outline-none"
              />
            </div>
            <DemoButton notice="Starting a new conversation isn't part of this demo — the existing threads are real." className="btn-icon h-8 w-8" aria-label="New message">
              <Plus aria-hidden="true" className="h-4 w-4" />
            </DemoButton>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="p-6 text-center text-xs text-ink-muted">No conversations match &quot;{search}&quot;.</li>
            ) : (
              filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => openConversation(c.id)}
                    aria-current={c.id === activeId ? 'true' : undefined}
                    className={clsx(
                      'flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors',
                      c.id === activeId
                        ? 'border-brand-400 bg-bg-elevated/60'
                        : 'border-transparent hover:bg-bg-elevated/30',
                    )}
                  >
                    <Avatar user={c.user} size={40} online={c.online} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-ink">{c.user.name}</span>
                        <span className="text-[11px] text-ink-dim">{c.time}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-muted">{c.lastMessage}</p>
                    </div>
                    {c.unread && !readIds.has(c.id) ? (
                      <span
                        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white"
                        aria-label={`${c.unread} unread`}
                      >
                        {c.unread}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div
          className={clsx(
            'h-full flex-col md:flex',
            showThreadOnMobile ? 'flex' : 'hidden',
          )}
        >
          <div className="flex items-center gap-3 border-b border-line/60 p-4">
            <button
              type="button"
              onClick={() => setShowThreadOnMobile(false)}
              className="btn-icon h-9 w-9 shrink-0 md:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <Avatar user={active.user} size={40} online={active.online} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">{active.user.name}</div>
              <div className="truncate text-xs text-ink-dim">
                @{active.user.handle} · {active.online ? 'Active now' : 'Active recently'}
              </div>
            </div>
            <DemoButton notice="Voice calls aren't part of this demo." className="btn-icon h-9 w-9" aria-label="Call"><Phone aria-hidden="true" className="h-4 w-4" /></DemoButton>
            <DemoButton notice="Video calls aren't part of this demo." className="btn-icon h-9 w-9" aria-label="Video"><Video aria-hidden="true" className="h-4 w-4" /></DemoButton>
            <DemoButton notice="Conversation details aren't part of this demo." className="btn-icon h-9 w-9" aria-label="Info"><Info aria-hidden="true" className="h-4 w-4" /></DemoButton>
          </div>

          <div
            role="log"
            aria-live="polite"
            aria-label={`Conversation with ${active.user.name}`}
            className="flex-1 space-y-3 overflow-y-auto p-5"
          >
            <div className="mx-auto w-fit rounded-full bg-bg-subtle px-3 py-1 text-[11px] text-ink-dim">Today</div>
            {thread.map((m, i) => (
              <div
                key={i}
                data-testid="chat-message"
                className={clsx('flex gap-2', m.from === 'me' ? 'justify-end' : 'justify-start')}
              >
                {m.from === 'them' && <Avatar user={active.user} size={28} />}
                <div
                  className={clsx(
                    'max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-snug',
                    m.from === 'me'
                      ? 'rounded-br-sm bg-brand-500 text-white'
                      : 'rounded-bl-sm border border-line/60 bg-bg-subtle text-ink',
                  )}
                >
                  <span className="sr-only">
                    {m.from === 'me' ? 'You' : active.user.name} said:{' '}
                  </span>
                  <p>{m.text}</p>
                  <div className={clsx('mt-1 text-[10px]', m.from === 'me' ? 'text-white/85' : 'text-ink-dim')}>
                    {m.time}
                  </div>
                </div>
                {m.from === 'me' && <Avatar user={currentUser} size={28} />}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2" data-testid="typing-indicator">
                <Avatar user={active.user} size={28} />
                <div className="rounded-2xl rounded-bl-sm border border-line/60 bg-bg-subtle px-4 py-3">
                  <span className="sr-only">{active.user.name} is typing…</span>
                  <span aria-hidden="true" className="inline-flex gap-1">
                    <Dot delay="0ms" />
                    <Dot delay="120ms" />
                    <Dot delay="240ms" />
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-line/60 p-3">
            <DemoButton notice="Attachments aren't part of this demo — messages are." className="btn-icon h-9 w-9" aria-label="Attach"><Paperclip aria-hidden="true" className="h-4 w-4" /></DemoButton>
            <DemoButton notice="Sending photos isn't part of this demo." className="btn-icon h-9 w-9" aria-label="Photo"><ImageIcon aria-hidden="true" className="h-4 w-4" /></DemoButton>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${active.user.name.split(' ')[0]}…`}
              className="flex-1 rounded-full border border-line/60 bg-bg-subtle px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-brand-400/40 focus:outline-none"
            />
            <DemoButton notice="The emoji picker isn't part of this demo." className="btn-icon h-9 w-9" aria-label="Emoji"><Smile aria-hidden="true" className="h-4 w-4" /></DemoButton>
            <button type="submit" disabled={!draft.trim()} className="btn-primary px-4 py-2.5 disabled:opacity-40" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-ink-dim"
      style={{ animationDelay: delay }}
    />
  );
}
