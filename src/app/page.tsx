import Link from 'next/link';
import { ArrowRight, ShieldCheck, Heart, MessageCircle, Bookmark, Repeat2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-90" />
      <div className="noise-overlay absolute inset-0" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">Pulse</span>
        </Link>
        <Link
          href="/login"
          className="text-sm text-ink-muted transition-colors hover:text-ink"
        >
          Sign in
        </Link>
      </header>

      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-12 pb-24 text-center sm:pt-20 sm:px-10">
        <span className="badge mb-7 animate-fade-up">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
          A quieter, calmer feed
        </span>

        <h1 className="animate-fade-up font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          The social network <br className="hidden sm:block" />
          that <span className="gradient-text">respects your time.</span>
        </h1>

        <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-ink-muted [animation-delay:80ms]">
          Pulse is a feed designed by people who care about craft. No outrage loops, no
          tracker pixels — just the people and ideas you actually came here for.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 animate-fade-up [animation-delay:160ms]">
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

        <p className="mt-12 flex items-center gap-2 text-xs text-ink-dim animate-fade-up [animation-delay:240ms]">
          <ShieldCheck className="h-4 w-4 text-accent-mint" />
          No trackers · No ads · Your data, your call
        </p>

        <div className="mt-16 w-full max-w-lg animate-fade-up [animation-delay:320ms]">
          <HeroPreview />
        </div>
      </section>

      <footer className="relative z-10 border-t border-line/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-7 text-xs text-ink-dim sm:flex-row sm:px-10">
          <div className="flex items-center gap-2">
            <Logo small />
            <span>© {new Date().getFullYear()} Pulse</span>
          </div>
          <div className="flex items-center gap-5">
            <a className="hover:text-ink" href="#">Privacy</a>
            <a className="hover:text-ink" href="#">Terms</a>
            <a className="hover:text-ink" href="#">Help</a>
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
      <div className="card relative overflow-hidden p-5 glow text-left">
        <div className="flex items-center justify-between text-xs text-ink-dim">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-accent-mint" />
            <span>Live feed · for you</span>
          </div>
          <span>10:24</span>
        </div>
        <div className="mt-4 space-y-3">
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
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-line/70 bg-bg-subtle/80 p-3 text-xs text-ink-muted">
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
