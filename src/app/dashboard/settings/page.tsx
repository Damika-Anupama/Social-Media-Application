'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/dashboard/TopBar';
import { useTabs } from '@/components/Tabs';
import { DemoButton } from '@/components/DemoButton';
import { currentUser } from '@/lib/mock-data';
import { Avatar } from '@/components/Avatar';
import { usePreferences } from '@/lib/PreferencesContext';
import { useSettings } from '@/lib/useSettings';
import {
  User as UserIcon,
  Bell,
  Lock,
  Palette,
  Shield,
  Download,
  ChevronRight,
  Check,
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
  // Vertical strip, so it arrows with Up/Down — Left/Right would be wrong here.
  const { tabListProps, getTabProps } = useTabs({
    items: sections,
    selected: sections.findIndex((s) => s.id === active),
    onSelect: (i) => setActive(sections[i].id),
    orientation: 'vertical',
  });

  return (
    <div className="px-4 pt-1 sm:px-6">
      <TopBar title="Settings" subtitle="Make Pulse yours. Every setting on this screen is reversible." />

      <div className="card grid overflow-hidden md:grid-cols-[240px_1fr]">
        {/* min-w-0: a grid item also defaults to min-width:auto, so the nav
            refused to shrink below its widest label and overflowed the card. */}
        <nav
          {...tabListProps}
          aria-label="Settings sections"
          className="min-w-0 border-b border-line/60 p-3 md:border-b-0 md:border-r"
        >
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                {...getTabProps(i)}
                className={clsx(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active === s.id
                    ? 'bg-bg-elevated text-ink'
                    : 'text-ink-muted hover:bg-bg-elevated/50 hover:text-ink',
                )}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Icon className={clsx('h-4 w-4', active === s.id && 'text-brand-300')} />
                  {s.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 p-6 sm:p-8">
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
      <div className="flex flex-wrap items-center gap-4">
        <Avatar user={currentUser} size={64} ring="brand" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">{currentUser.name}</div>
          <div className="truncate text-xs text-ink-dim">@{currentUser.handle}</div>
        </div>
        <DemoButton
          notice="Uploading an avatar isn't part of this demo — your name, bio and links are editable on your profile."
          className="btn-ghost shrink-0 px-4 py-2 text-sm"
        >
          Change photo
        </DemoButton>
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
  const { settings, setSetting } = useSettings();
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Notifications</h2>
      <Toggle
        label="Mentions"
        hint="Always notify when someone @-mentions me."
        checked={settings.notifyMentions}
        onChange={(v) => setSetting('notifyMentions', v)}
      />
      <Toggle
        label="Replies to my posts"
        hint="Group quiet activity into a daily digest."
        checked={settings.notifyReplies}
        onChange={(v) => setSetting('notifyReplies', v)}
      />
      <Toggle
        label="New followers"
        hint="One ping per follower, no batching."
        checked={settings.notifyFollowers}
        onChange={(v) => setSetting('notifyFollowers', v)}
      />
      <Toggle
        label="Live rooms from people I follow"
        hint="Up to two pings per day."
        checked={settings.notifyLiveRooms}
        onChange={(v) => setSetting('notifyLiveRooms', v)}
      />
      <Toggle
        label="Trending in your network"
        hint="Off by default — opt in only."
        checked={settings.notifyTrending}
        onChange={(v) => setSetting('notifyTrending', v)}
      />
    </div>
  );
}

function PrivacySection() {
  const { settings, setSetting } = useSettings();
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ink">Privacy</h2>
      <Toggle
        label="Private account"
        hint="Approve every follower manually."
        checked={settings.privateAccount}
        onChange={(v) => setSetting('privateAccount', v)}
      />
      {settings.privateAccount && (
        <Link
          href="/dashboard/requests"
          className="-mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-brand-200"
        >
          Review follow requests
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
      <Toggle
        label="Hide read receipts in DMs"
        hint="Only affects new conversations."
        checked={settings.hideReadReceipts}
        onChange={(v) => setSetting('hideReadReceipts', v)}
      />
      <Toggle
        label="Discover by phone or email"
        hint="Off by default."
        checked={settings.discoverByContact}
        onChange={(v) => setSetting('discoverByContact', v)}
      />
      <Toggle
        label="Personalised ads"
        hint="Pulse does not sell your data. Period."
        checked={false}
        disabled
      />
    </div>
  );
}

function AppearanceSection() {
  const { preferences, setPreference } = usePreferences();
  const theme = preferences.theme;
  const setTheme = (t: 'system' | 'dark' | 'light') => setPreference('theme', t);
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
              aria-pressed={theme === t}
              className={clsx(
                'rounded-2xl border bg-bg-subtle p-4 text-left transition-colors',
                theme === t ? 'border-brand-400/50 ring-1 ring-brand-400/40' : 'border-line hover:border-brand-400/30',
              )}
            >
              <ThemePreview theme={t} />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold capitalize text-ink">{t}</span>
                {theme === t && <Check className="h-3.5 w-3.5 text-brand-300" />}
              </div>
            </button>
          ))}
        </div>
      </div>
      <Toggle
        label="Reduce motion"
        hint="Disable animations across the app."
        checked={preferences.reduceMotion}
        onChange={(v) => setPreference('reduceMotion', v)}
      />
      <Toggle
        label="Larger type"
        hint="Bump base font up by 1 step."
        checked={preferences.largerType}
        onChange={(v) => setPreference('largerType', v)}
      />
    </div>
  );
}

/**
 * A theme-independent mini mock of each theme, drawn with literal colors so the
 * swatch always shows what that theme looks like regardless of the active one.
 */
function ThemePreview({ theme }: { theme: 'system' | 'dark' | 'light' }) {
  if (theme === 'system') {
    return (
      <div className="relative h-12 overflow-hidden rounded-lg border border-line">
        <div className="absolute inset-0 flex">
          <div className="w-1/2" style={{ background: '#0d0d14' }} />
          <div className="w-1/2" style={{ background: '#f7f7fb' }} />
        </div>
        <div className="absolute left-2 top-2 h-1.5 w-7 rounded-full" style={{ background: '#7c5cff' }} />
        <div className="absolute bottom-2 left-2 h-1 w-5 rounded-full" style={{ background: 'rgba(245,245,250,0.7)' }} />
        <div className="absolute bottom-2 right-2 h-1 w-5 rounded-full" style={{ background: 'rgba(21,21,28,0.45)' }} />
      </div>
    );
  }
  const dark = theme === 'dark';
  return (
    <div
      className="relative h-12 overflow-hidden rounded-lg border"
      style={{ background: dark ? '#0d0d14' : '#f7f7fb', borderColor: dark ? '#22222e' : '#e0e2ec' }}
    >
      <div className="absolute left-2 top-2 h-1.5 w-7 rounded-full" style={{ background: '#7c5cff' }} />
      <div
        className="absolute left-2 top-5 h-1 w-9 rounded-full"
        style={{ background: dark ? 'rgba(245,245,250,0.55)' : 'rgba(21,21,28,0.55)' }}
      />
      <div
        className="absolute left-2 top-7 h-1 w-6 rounded-full"
        style={{ background: dark ? 'rgba(167,167,184,0.4)' : 'rgba(74,76,92,0.4)' }}
      />
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    // min-w-0 + break-words: a value like "Indian Standard Time (UTC+05:30)"
    // cannot shrink otherwise, and pushes the page sideways on a 320px phone.
    // My machine rendered the font narrow enough to hide it; CI on Linux did not.
    <div className="flex items-center justify-between gap-3 border-t border-line/40 pt-4">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className={clsx('break-words text-sm', muted ? 'text-ink-dim' : 'text-ink-muted')}>
          {value}
        </div>
      </div>
      {/* Five identical "Edit" buttons read as five identical "Edit" buttons —
          name each by the row it belongs to. */}
      <DemoButton
        notice={`Editing your ${label.toLowerCase()} isn't part of this demo — display name, bio, location and link are, on your profile.`}
        className="btn-ghost shrink-0 px-3 py-1.5 text-xs"
        aria-label={`Edit ${label.toLowerCase()}`}
      >
        Edit
      </DemoButton>
    </div>
  );
}

/**
 * An accessible on/off switch.
 *
 * Previously a bare <button aria-pressed> whose only content was a decorative
 * span — so it had no accessible name at all: a screen reader announced
 * "button, pressed" and nothing else, fourteen times down the page. It is now
 * a role="switch" named by its label and described by its hint.
 */
function Toggle({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex items-start justify-between gap-4 border-t border-line/40 pt-4">
      <div className="min-w-0 flex-1">
        <div id={labelId} className="text-sm font-medium text-ink">
          {label}
        </div>
        <div id={hintId} className="break-words text-xs text-ink-dim">
          {hint}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={clsx(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          disabled && 'cursor-not-allowed opacity-50',
          checked ? 'bg-brand-500' : 'bg-line',
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
            checked ? 'left-[22px]' : 'left-0.5',
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
