import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Radio,
  Compass,
  MessageCircle,
  Heart,
  Bookmark,
  Repeat2,
} from 'lucide-react';

const features = [
  {
    icon: Compass,
    title: 'Discover, on purpose',
    body:
      'A feed that ranks by what you actually engage with, not what shouted loudest. Every signal is visible and tunable.',
  },
  {
    icon: Radio,
    title: 'Stories and live rooms',
    body:
      'Ephemeral video and live audio rooms baked into the same surface — share a moment without leaving the conversation.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by default',
    body:
      'No third-party trackers, no shadow profiles, no dark-pattern engagement metrics. Your data settings sit one click away.',
  },
  {
    icon: Sparkles,
    title: 'Built for craft',
    body:
      'A composer that respects long-form writing, beautiful media, and the people doing real work — not just hot takes.',
  },
];

const stats = [
  { value: '4.2M', label: 'monthly creators' },
  { value: '92%', label: 'D7 retention' },
  { value: '1.1B', label: 'meaningful interactions / mo' },
  { value: '0', label: 'third-party trackers' },
];

const voices = [
  {
    name: 'Nadia Pereira',
    role: 'Creative Director, Halftone Studio',
    quote:
      'Pulse is the first feed in a decade that feels like it was designed by people who care about how letters sit next to each other.',
  },
  {
    name: 'Sasha Reyes',
    role: 'Independent journalist',
    quote:
      'I can publish a 4,000-word investigation and a one-line shitpost from the same composer and neither feels out of place.',
  },
  {
    name: 'Amaru Quispe',
    role: 'Backend engineer, Nucleus',
    quote:
      'Their ranking signals are documented. I have never been able to say that about a social product before.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-90" />
      <div className="noise-overlay absolute inset-0" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold tracking-tight">Pulse</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
          <a href="#features" className="hover:text-ink transition-colors">Product</a>
          <a href="#voices" className="hover:text-ink transition-colors">Creators</a>
          <a href="#manifesto" className="hover:text-ink transition-colors">Manifesto</a>
          <a href="#changelog" className="hover:text-ink transition-colors">Changelog</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-ink-muted hover:text-ink sm:inline">
            Sign in
          </Link>
          <Link href="/register" className="btn-primary">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 sm:px-10 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="animate-fade-up">
            <span className="badge mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
              Public beta — v0.9 rolling out today
            </span>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              A social network that{' '}
              <span className="gradient-text">acts like a city</span>, not a slot machine.
            </h1>
            <p className="mt-7 max-w-xl text-lg text-ink-muted">
              Pulse is a feed, a stage, and a quiet corner — all on the same surface. Built for people who want to make
              things, share them, and find each other without being mined for ad revenue.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/register" className="btn-primary">
                Claim your handle <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="btn-ghost">
                I already have an account
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-ink-dim">
              <ShieldCheck className="h-4 w-4 text-accent-mint" />
              No credit card, no tracker pixel, no waitlist gimmick.
            </p>
          </div>

          <HeroPreview />
        </div>

        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-semibold text-ink sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-300">Product</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Four ideas, executed without compromise.
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink-muted">
            Every Pulse surface answers the same question: would a thoughtful person actually want to spend time here?
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="card group p-7 transition-all hover:border-brand-400/40">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-300 transition-colors group-hover:bg-brand-500/20">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="voices" className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-300">Creators</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Built with the people who fill it.
          </h2>
          <p className="mt-4 text-base text-ink-muted">
            Pulse is shaped by working creators, journalists, engineers, and small studios — not by ad metrics.
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {voices.map((v) => (
            <figure key={v.name} className="card flex h-full flex-col gap-6 p-7">
              <blockquote className="text-base leading-relaxed text-ink">“{v.quote}”</blockquote>
              <figcaption className="mt-auto">
                <div className="text-sm font-semibold text-ink">{v.name}</div>
                <div className="text-xs text-ink-dim">{v.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="manifesto" className="relative z-10 mx-auto max-w-5xl px-6 py-24 sm:px-10">
        <div className="gradient-border rounded-3xl p-10 sm:p-14">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-300">Manifesto</p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            The internet used to feel like a place. We're trying to bring that back — without pretending the last fifteen
            years didn't happen.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-muted">
            We owe you a feed you can trust, a composer that takes your writing seriously, and a way out at any time —
            with your followers, your archive, and your data in your hands. That's the floor. The ceiling is whatever
            you build on top of it.
          </p>
          <div className="mt-8">
            <Link href="/register" className="btn-primary">
              Start with a handle <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer id="changelog" className="relative z-10 border-t border-line/70">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-10 text-xs text-ink-dim sm:flex-row sm:items-center sm:px-10">
          <div className="flex items-center gap-2">
            <Logo small />
            <span>© {new Date().getFullYear()} Pulse · Frontend demonstration</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a className="hover:text-ink" href="#">Status</a>
            <a className="hover:text-ink" href="#">Press kit</a>
            <a className="hover:text-ink" href="#">API docs</a>
            <a className="hover:text-ink" href="#">Privacy</a>
            <a className="hover:text-ink" href="#">Terms</a>
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
    <div className="relative animate-fade-up [animation-delay:120ms]">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-500/20 via-accent-sky/10 to-accent-mint/15 blur-3xl" />
      <div className="card relative overflow-hidden p-5 glow">
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
            body="Cut our cutover window from 14 minutes to under 90 seconds 🎯"
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

      <div className="card absolute -right-4 -top-6 hidden w-56 p-3 sm:block animate-float">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="inline-flex h-2 w-2 rounded-full bg-accent-coral" />
          Live room · 318 listening
        </div>
        <div className="mt-2 text-sm font-semibold text-ink">Designing for slow time</div>
        <div className="mt-1 text-xs text-ink-dim">Hosted by Lina · 2 speakers</div>
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
