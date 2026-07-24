import type { Metadata } from 'next';
import { DocPage, DocSection } from '@/components/DocPage';

export const metadata: Metadata = {
  title: 'Help',
  description: 'A quick tour of what works in the Pulse demo and how to get around it.',
};

export default function HelpPage() {
  return (
    <DocPage
      title="Help"
      updated="Last updated 20 July 2026"
      intro="Pulse is a frontend demonstration, but most of it genuinely works. Here's what you can do and where to find it."
    >
      <DocSection heading="Signing in">
        <p>
          There&apos;s no real authentication. Any email and password that pass the on-screen validation will sign you
          in and drop you at your dashboard. Create an account or sign in — either way lands in the same place.
        </p>
      </DocSection>

      <DocSection heading="Posting, liking & saving">
        <p>
          The composer is real: your posts appear at the top of the feed, survive a reload, and can be deleted. Likes,
          bookmarks, and follows all persist too, and your Bookmarks page shows exactly what you saved. Each of these
          confirms with a toast you can undo.
        </p>
      </DocSection>

      <DocSection heading="Finding your way around">
        <p>
          Press <kbd className="rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[12px]">⌘K</kbd>{' '}
          (or <kbd className="rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[12px]">Ctrl K</kbd>)
          anywhere in the dashboard to open the command palette and jump to any person, community, or page. Press{' '}
          <kbd className="rounded border border-line bg-bg-subtle px-1.5 py-0.5 font-mono text-[12px]">?</kbd> to see the
          full list of keyboard shortcuts.
        </p>
      </DocSection>

      <DocSection heading="Appearance & accessibility">
        <p>
          Under Settings → Appearance you can switch between light, dark, and system themes, reduce motion, and enable
          larger type. Every choice is remembered. Pulse ships with a skip-to-content link, focus management on dialogs,
          and labelled live regions throughout.
        </p>
      </DocSection>

      <DocSection heading="Resetting the demo">
        <p>
          Everything you do is stored locally in your browser. To start completely fresh, clear this site&apos;s data in
          your browser settings (or open your dev tools and clear local storage). Pulse returns to its first-run state
          right away — see the{' '}
          <a className="text-ink underline-offset-4 hover:underline" href="/legal/privacy">Privacy Notice</a> for the
          details of what&apos;s stored.
        </p>
      </DocSection>
    </DocPage>
  );
}
