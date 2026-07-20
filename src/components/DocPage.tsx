import Link from 'next/link';

/**
 * Reading shell for the static policy/help pages (Terms, Privacy, Help).
 *
 * A calm, centered prose column on the same aurora background as the landing
 * and auth screens, with a header that links home and to sign-in. Kept
 * presentational so each page just supplies a title and its sections.
 */
export function DocPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-90" />
      <div className="noise-overlay absolute inset-0" />

      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-5 sm:px-10">
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

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-8 sm:px-10">
        <p className="text-xs uppercase tracking-wider text-brand-300">Pulse</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-ink-dim">{updated}</p>
        <p className="mt-8 text-lg leading-relaxed text-ink-muted">{intro}</p>

        <article className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-muted">{children}</article>

        <p className="mt-16 border-t border-line/70 pt-6 text-xs leading-relaxed text-ink-dim">
          Pulse is a frontend demonstration. All content, accounts, and policies here are fictional and exist only to
          show what a finished product could feel like.
        </p>
      </main>
    </div>
  );
}

/** A titled block within a {@link DocPage}. */
export function DocSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-ink">{heading}</h2>
      {children}
    </section>
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
