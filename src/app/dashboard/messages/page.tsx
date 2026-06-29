'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Send, Search, Plus, Phone, Video, Info, Smile, Paperclip, Image as ImageIcon } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import {
  conversations as seedConversations,
  threadsByConversation,
  currentUser,
  type ChatMessage,
  type ConversationPreview,
} from '@/lib/mock-data';

const cannedReplies = [
  'Got it — let me chase that down and revert in a bit.',
  'Yes, that works on my end. Sending the details after lunch.',
  'Appreciate the heads up. Will loop in the rest of the team.',
  'Perfect, I will queue it up for tomorrow morning.',
  'Just opened the doc — going through it now.',
];

export default function MessagesPage() {
  const [convos, setConvos] = useState<ConversationPreview[]>(seedConversations);
  const [threads, setThreads] = useState<Record<string, ChatMessage[]>>(threadsByConversation);
  const [activeId, setActiveId] = useState(seedConversations[0].id);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const active = convos.find((c) => c.id === activeId) ?? convos[0];
  const thread = threads[activeId] ?? [];

  useEffect(() => {
    setConvos((cs) => cs.map((c) => (c.id === activeId ? { ...c, unread: undefined } : c)));
  }, [activeId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.length, typing, activeId]);

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
    const myMsg: ChatMessage = { from: 'me', time: 'now', text };
    setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] ?? []), myMsg] }));
    setConvos((cs) =>
      cs.map((c) => (c.id === activeId ? { ...c, lastMessage: text, time: 'now' } : c)),
    );
    setDraft('');

    setTyping(true);
    setTimeout(() => {
      const reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
      const themMsg: ChatMessage = { from: 'them', time: 'now', text: reply };
      setThreads((t) => ({ ...t, [activeId]: [...(t[activeId] ?? []), themMsg] }));
      setConvos((cs) =>
        cs.map((c) => (c.id === activeId ? { ...c, lastMessage: reply, time: 'now' } : c)),
      );
      setTyping(false);
    }, 1400 + Math.random() * 1000);
  };

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Messages" subtitle="Direct conversations are end-to-end encrypted on Pulse." />

      <div className="card grid h-[calc(100vh-200px)] grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
        <div className="flex flex-col border-r border-line/60">
          <div className="flex items-center gap-2 border-b border-line/60 p-3">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-line/60 bg-bg-subtle px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-ink-dim" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats"
                className="w-full bg-transparent text-xs text-ink placeholder:text-ink-dim focus:outline-none"
              />
            </div>
            <button className="btn-icon h-8 w-8" aria-label="New message" title="New message">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="p-6 text-center text-xs text-ink-muted">No conversations match &quot;{search}&quot;.</li>
            ) : (
              filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(c.id)}
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
                    {c.unread && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white">
                        {c.unread}
                      </span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-line/60 p-4">
            <Avatar user={active.user} size={40} online={active.online} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">{active.user.name}</div>
              <div className="truncate text-xs text-ink-dim">
                @{active.user.handle} · {active.online ? 'Active now' : 'Active recently'}
              </div>
            </div>
            <button className="btn-icon h-9 w-9" aria-label="Call"><Phone className="h-4 w-4" /></button>
            <button className="btn-icon h-9 w-9" aria-label="Video"><Video className="h-4 w-4" /></button>
            <button className="btn-icon h-9 w-9" aria-label="Info"><Info className="h-4 w-4" /></button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            <div className="mx-auto w-fit rounded-full bg-bg-subtle px-3 py-1 text-[11px] text-ink-dim">Today</div>
            {thread.map((m, i) => (
              <div key={i} className={clsx('flex gap-2', m.from === 'me' ? 'justify-end' : 'justify-start')}>
                {m.from === 'them' && <Avatar user={active.user} size={28} />}
                <div
                  className={clsx(
                    'max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-snug',
                    m.from === 'me'
                      ? 'rounded-br-sm bg-brand-500 text-white'
                      : 'rounded-bl-sm border border-line/60 bg-bg-subtle text-ink',
                  )}
                >
                  <p>{m.text}</p>
                  <div className={clsx('mt-1 text-[10px]', m.from === 'me' ? 'text-brand-100/80' : 'text-ink-dim')}>
                    {m.time}
                  </div>
                </div>
                {m.from === 'me' && <Avatar user={currentUser} size={28} />}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2">
                <Avatar user={active.user} size={28} />
                <div className="rounded-2xl rounded-bl-sm border border-line/60 bg-bg-subtle px-4 py-3">
                  <span className="inline-flex gap-1">
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
            <button type="button" className="btn-icon h-9 w-9" aria-label="Attach"><Paperclip className="h-4 w-4" /></button>
            <button type="button" className="btn-icon h-9 w-9" aria-label="Photo"><ImageIcon className="h-4 w-4" /></button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`Message ${active.user.name.split(' ')[0]}…`}
              className="flex-1 rounded-full border border-line/60 bg-bg-subtle px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-brand-400/40 focus:outline-none"
            />
            <button type="button" className="btn-icon h-9 w-9" aria-label="Emoji"><Smile className="h-4 w-4" /></button>
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
