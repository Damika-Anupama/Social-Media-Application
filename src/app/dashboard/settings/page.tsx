'use client';

import { useState } from 'react';
import { TopBar } from '@/components/dashboard/TopBar';
import { currentUser } from '@/lib/mock-data';
import { Avatar } from '@/components/Avatar';
import {
  User as UserIcon,
  Bell,
  Lock,
  Palette,
  Shield,
  Download,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';

const sections = [
  { id: 'account', label: 'Account', icon: UserIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'data', label: 'Your data', icon: Download },
];

export default function SettingsPage() {
  const [active, setActive] = useState('account');

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Settings" subtitle="Make Pulse yours. Every setting on this screen is reversible." />

      <div className="card grid overflow-hidden md:grid-cols-[240px_1fr]">
        <nav className="border-b border-line/60 p-3 md:border-b-0 md:border-r">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={clsx(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active === s.id
                    ? 'bg-bg-elevated text-ink'
                    : 'text-ink-muted hover:bg-bg-elevated/50 hover:text-ink',
                )}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={clsx('h-4 w-4', active === s.id && 'text-brand-300')} />
                  {s.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              </button>
            );
          })}
        </nav>

        <div className="p-6 sm:p-8">
          {active === 'account' && <AccountSection />}
          {active === 'notifications' && <NotificationsSection />}
          {active === 'privacy' && <PrivacySection />}
          {active === 'appearance' && <AppearanceSection />}
          {active === 'safety' && <ComingSoon title="Safety controls" />}
          {active === 'data' && <ComingSoon title="Data export" />}
        </div>
      </div>
    </div>
  );
}

function AccountSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Account</h2>
      <div className="flex items-center gap-4">
        <Avatar user={currentUser} size={64} ring="brand" />
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">{currentUser.name}</div>
          <div className="text-xs text-ink-dim">@{currentUser.handle}</div>
        </div>
        <button className="btn-ghost px-4 py-2 text-sm">Change photo</button>
      </div>
      <Row label="Display name" value="Damika Anupama" />
      <Row label="Username" value={`@${currentUser.handle}`} />
      <Row label="Email" value="damikaanupama@gmail.com" />
      <Row label="Phone" value="Add a recovery number" muted />
      <Row label="Time zone" value="Indian Standard Time (UTC+05:30)" />
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Notifications</h2>
      <Toggle label="Mentions" hint="Always notify when someone @-mentions me." defaultOn />
      <Toggle label="Replies to my posts" hint="Group quiet activity into a daily digest." defaultOn />
      <Toggle label="New followers" hint="One ping per follower, no batching." />
      <Toggle label="Live rooms from people I follow" hint="Up to two pings per day." defaultOn />
      <Toggle label="Trending in your network" hint="Off by default — opt in only." />
    </div>
  );
}

function PrivacySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Privacy</h2>
      <Toggle label="Private account" hint="Approve every follower manually." />
      <Toggle label="Hide read receipts in DMs" hint="Only affects new conversations." />
      <Toggle label="Discover by phone or email" hint="Off by default." />
      <Toggle label="Personalised ads" hint="Pulse does not sell your data. Period." disabled />
    </div>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<'system' | 'dark' | 'light'>('dark');
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Appearance</h2>
      <div>
        <div className="text-sm font-medium text-ink">Theme</div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {(['system', 'dark', 'light'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={clsx(
                'rounded-2xl border bg-bg-subtle p-4 text-left transition-colors',
                theme === t ? 'border-brand-400/50' : 'border-line hover:border-line',
              )}
            >
              <div className="mb-2 h-12 rounded-lg bg-gradient-to-br from-bg-elevated to-bg-raised" />
              <div className="text-xs font-semibold capitalize text-ink">{t}</div>
            </button>
          ))}
        </div>
      </div>
      <Toggle label="Reduce motion" hint="Disable animations across the app." />
      <Toggle label="Larger type" hint="Bump base font up by 1 step." />
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-line/40 pt-4">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className={clsx('text-sm', muted ? 'text-ink-dim' : 'text-ink-muted')}>{value}</div>
      </div>
      <button className="btn-ghost px-3 py-1.5 text-xs">Edit</button>
    </div>
  );
}

function Toggle({
  label,
  hint,
  defaultOn,
  disabled,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
  disabled?: boolean;
}) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 border-t border-line/40 pt-4">
      <div className="flex-1">
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-xs text-ink-dim">{hint}</div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOn((s) => !s)}
        className={clsx(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          disabled && 'opacity-50',
          on ? 'bg-brand-500' : 'bg-line',
        )}
        aria-pressed={on}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
            on ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </button>
    </div>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="text-sm text-ink-muted">This panel will ship in the next release.</p>
      <span className="badge">In design review</span>
    </div>
  );
}
