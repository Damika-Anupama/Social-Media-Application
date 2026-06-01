/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { Send, Search, Plus, Phone, Video, Info } from 'lucide-react';
import { TopBar } from '@/components/dashboard/TopBar';
import { Avatar } from '@/components/Avatar';
import { conversations, currentUser } from '@/lib/mock-data';

const initialThread = [
  { from: 'them' as const, time: '10:12', text: 'Sending the press kit over tonight — Lina is in.' },
  {
    from: 'them' as const,
    time: '10:12',
    text: "Also: the studio tour on Saturday is moving to 6pm. Theo's flight changes.",
  },
  { from: 'me' as const, time: '10:18', text: 'Perfect. I will push the new time to the events feed.' },
  {
    from: 'me' as const,
    time: '10:18',
    text: 'If you want, I can write the announcement copy this afternoon — just send me the dye-process line.',
  },
  {
    from: 'them' as const,
    time: '10:21',
    text: 'Yes please. I will email the full sourcing doc as soon as Coastline signs off on it.',
  },
];

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState(initialThread);

  const active = conversations.find((c) => c.id === activeId)!;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setThread((t) => [...t, { from: 'me', time: 'now', text: draft.trim() }]);
    setDraft('');
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
                placeholder="Search chats"
                className="w-full bg-transparent text-xs text-ink placeholder:text-ink-dim focus:outline-none"
              />
            </div>
            <button className="btn-icon h-8 w-8" aria-label="New message">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
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
            ))}
          </ul>
        </div>

        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 border-b border-line/60 p-4">
            <Avatar user={active.user} size={40} online={active.online} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-ink">{active.user.name}</div>
              <div className="truncate text-xs text-ink-dim">@{active.user.handle} · Active now</div>
            </div>
            <button className="btn-icon h-9 w-9" aria-label="Call"><Phone className="h-4 w-4" /></button>
            <button className="btn-icon h-9 w-9" aria-label="Video"><Video className="h-4 w-4" /></button>
            <button className="btn-icon h-9 w-9" aria-label="Info"><Info className="h-4 w-4" /></button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            <div className="mx-auto w-fit rounded-full bg-bg-subtle px-3 py-1 text-[11px] text-ink-dim">
              Today
            </div>
            {thread.map((m, i) => (
              <div
                key={i}
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
                  <p>{m.text}</p>
                  <div
                    className={clsx(
                      'mt-1 text-[10px]',
                      m.from === 'me' ? 'text-brand-100/80' : 'text-ink-dim',
                    )}
                  >
                    {m.time}
                  </div>
                </div>
                {m.from === 'me' && <Avatar user={currentUser} size={28} />}
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-line/60 p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message"
              className="flex-1 rounded-full border border-line/60 bg-bg-subtle px-4 py-2.5 text-sm text-ink placeholder:text-ink-dim focus:border-brand-400/40 focus:outline-none"
            />
            <button type="submit" className="btn-primary px-4 py-2.5" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
