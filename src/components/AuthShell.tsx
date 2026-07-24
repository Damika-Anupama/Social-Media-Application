import Link from 'next/link';
import { Quote, ShieldCheck } from 'lucide-react';

export function AuthShell({
  children,
  title,
  subtitle,
  footer,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora" />
      <div className="noise-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:py-16">
        <aside className="hidden flex-col justify-between lg:flex">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">Pulse</span>
          </Link>

          <div className="max-w-md">
            <Quote className="h-8 w-8 text-brand-300" />
            <p className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight">
              The first feed in a decade that feels like it was designed by people who care about how letters sit next
              to each other.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint" />
              <div>
                <div className="font-semibold text-ink">Nadia Pereira</div>
                <div className="text-xs text-ink-dim">Creative Director, Halftone Studio</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-dim">
            <ShieldCheck className="h-4 w-4 text-accent-mint-fg" />
            Frontend demonstration — any valid input will sign you in.
          </div>
        </aside>

        <main className="flex w-full max-w-md flex-col justify-center self-center lg:max-w-none">
          <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <Logo />
            <span className="text-lg font-semibold tracking-tight">Pulse</span>
          </Link>

          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-ink-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-sm text-ink-muted">{footer}</div>
        </main>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <span
      className="relative inline-flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-accent-mint shadow-lg shadow-brand-500/30"
      aria-hidden
    >
      <span className="absolute inset-1 rounded-lg bg-bg" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-accent-mint shadow-[0_0_12px_4px_rgba(61,219,179,0.6)]" />
    </span>
  );
}
