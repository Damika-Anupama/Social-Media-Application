import Link from 'next/link';
import { ArrowRight, ShieldCheck, Heart, MessageCircle, Bookmark, Repeat2 } from 'lucide-react';

export default function LandingPage() {
  return (
    // A viewport-tall flex column: header and footer hug the edges, the hero
    // takes the space between and centres in it. `min-h` (not a fixed height)
    // lets the page still grow and scroll in the extreme cases — 320px + the
    // "larger type" setting — where locking it would clip content and break
    // WCAG 1.4.10 reflow. In every normal size it fills exactly one screen.
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-90" />
      <div className="noise-overlay absolute inset-0" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-6 py-[clamp(0.6rem,1.6vh,1.25rem)] sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">Pulse</span>
        </Link>
        <Link
          href="/login"
          className="inline-flex min-h-[24px] items-center text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Sign in
        </Link>
      </header>

      <section className="relative z-10 mx-auto flex w-full min-h-0 max-w-5xl flex-1 flex-col items-center justify-center gap-[clamp(0.4rem,1.9vh,1.5rem)] px-6 py-[clamp(0.5rem,2vh,1rem)] text-center sm:px-10">
        {/* Purely decorative — the first thing to fold away on a short landscape. */}
        <span className="badge animate-fade-up [@media(max-height:440px)]:hidden">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
          A quieter, calmer feed
        </span>

        {/* Sized off both width and height (min of the two) so the headline
            shrinks on short viewports instead of forcing the page to scroll. */}
        <h1 className="animate-fade-up font-display text-[clamp(1.75rem,min(6.5vw,8vh),4rem)] font-semibold leading-[1.05] tracking-tight">
          The social network <br className="hidden sm:block" />
          that <span className="gradient-text">respects your time.</span>
        </h1>

        {/* Descriptive copy folds away on short viewports before the CTA does. */}
        <p className="max-w-xl animate-fade-up text-[clamp(0.95rem,1.5vw,1.125rem)] leading-relaxed text-ink-muted [animation-delay:80ms] [@media(max-height:640px)]:hidden">
          Pulse is a feed designed by people who care about craft. No outrage loops, no
          tracker pixels — just the people and ideas you actually came here for.
        </p>

        <div className="flex flex-col items-center gap-3 animate-fade-up [animation-delay:160ms]">
          <Link
            href="/login"
            className="btn-primary px-7 py-3.5 text-base shadow-2xl shadow-brand-500/30"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-ink-dim">
            New here?{' '}
            <Link href="/register" className="text-brand-300 underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <p className="flex items-center gap-2 text-xs text-ink-dim animate-fade-up [animation-delay:240ms] [@media(max-height:720px)]:hidden">
          <ShieldCheck className="h-4 w-4 text-accent-mint-fg" />
          No trackers · No ads · Your data, your call
        </p>

        {/* The decorative preview is the largest block, so it needs real room —
            it only appears on tall screens and folds away first everywhere else,
            keeping the essential hero (headline + CTA) on one screen. */}
        <div className="w-full max-w-lg animate-fade-up [animation-delay:320ms] [@media(max-height:960px)]:hidden">
          <HeroPreview />
        </div>
      </section>

      <footer className="relative z-10 shrink-0 border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-[clamp(0.6rem,1.6vh,1.25rem)] text-xs text-ink-dim sm:flex-row sm:px-10">
          <div className="flex items-center gap-2">
            <Logo small />
            <span>© {new Date().getFullYear()} Pulse</span>
          </div>
          <div className="flex items-center gap-5">
            <Link className="inline-flex min-h-[24px] items-center hover:text-ink" href="/legal/privacy">Privacy</Link>
            <Link className="inline-flex min-h-[24px] items-center hover:text-ink" href="/legal/terms">Terms</Link>
            <Link className="inline-flex min-h-[24px] items-center hover:text-ink" href="/help">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Logo({ small }: { small?: boolean }) {
  const size = small ? 'h-5 w-5' : 'h-7 w-7';
  return (
    <span
      className={`relative inline-flex ${size} items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint shadow-lg shadow-brand-500/30`}
      aria-hidden
    >
      <span className="absolute inset-1 rounded-lg bg-bg" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-accent-mint shadow-[0_0_12px_4px_rgba(61,219,179,0.6)]" />
    </span>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-500/20 via-accent-sky/10 to-accent-mint/15 blur-3xl" />
      <div className="card relative overflow-hidden p-4 glow text-left">
        <div className="flex items-center justify-between text-xs text-ink-dim">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-mint" />
            <span>Live feed · for you</span>
          </div>
          <span>10:24</span>
        </div>
        <div className="mt-3 space-y-2.5">
          <FakePost
            name="Nadia Pereira"
            handle="nadia"
            body="Notes on type pairing — quiet conversations between two voices."
            tone="lavender"
          />
          <FakePost
            name="Sasha Reyes"
            handle="sasha"
            body="New investigation up: the real cost of inference clusters."
            tone="coral"
          />
          <FakePost
            name="Amaru Quispe"
            handle="amaru"
            body="Cut our cutover window from 14 minutes to under 90 seconds."
            tone="mint"
          />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-line/70 bg-bg-subtle/80 p-3 text-xs text-ink-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500/10 text-brand-300">
              <Heart className="h-3.5 w-3.5" />
            </span>
            <span>247 reactions</span>
          </div>
          <div className="flex items-center gap-3 text-ink-dim">
            <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> 18</span>
            <span className="inline-flex items-center gap-1"><Repeat2 className="h-3.5 w-3.5" /> 6</span>
            <span className="inline-flex items-center gap-1"><Bookmark className="h-3.5 w-3.5" /> 32</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FakePost({
  name,
  handle,
  body,
  tone,
}: {
  name: string;
  handle: string;
  body: string;
  tone: 'lavender' | 'coral' | 'mint';
}) {
  const toneClass = {
    lavender: 'from-brand-400 to-brand-600',
    coral: 'from-accent-coral to-accent-sun',
    mint: 'from-accent-mint to-accent-sky',
  }[tone];
  return (
    <div className="flex items-start gap-3 rounded-xl border border-line/60 bg-bg-subtle/70 p-3">
      <div className={`h-9 w-9 shrink-0 rounded-full bg-gradient-to-br ${toneClass}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 text-xs">
          <span className="font-semibold text-ink">{name}</span>
          <span className="text-ink-dim">@{handle}</span>
          <span className="text-ink-dim">· now</span>
        </div>
        <p className="mt-1 text-sm leading-snug text-ink">{body}</p>
      </div>
    </div>
  );
}
