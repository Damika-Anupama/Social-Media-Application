import type { Metadata } from 'next';
import { DocPage, DocSection } from '@/components/DocPage';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'What Pulse stores, where it lives, and why nothing you do here ever leaves your browser.',
};

export default function PrivacyPage() {
  return (
    <DocPage
      title="Privacy Notice"
      updated="Last updated 20 July 2026"
      intro="The short version: Pulse has no server, so there is nowhere for your data to go. Everything below just explains how that works."
    >
      <DocSection heading="What we collect">
        <p>
          Nothing on a server, because there is no server. Pulse runs entirely in your browser. There are no accounts,
          no analytics, no cookies for tracking, and no third-party pixels.
        </p>
      </DocSection>

      <DocSection heading="What lives in your browser">
        <p>
          The interactions that persist — your composed posts, likes and bookmarks, who you follow, joined communities,
          read state, and your appearance preferences — are saved in your browser&apos;s local storage under keys
          prefixed with <code className="rounded bg-bg-subtle px-1 py-0.5 text-[13px]">pulse.</code>. They stay on your
          device, sync across your own tabs, and never travel over the network.
        </p>
      </DocSection>

      <DocSection heading="Third-party assets">
        <p>
          Avatars and photography are loaded from public placeholder services (DiceBear for avatars; Unsplash for
          imagery) purely to make the demo feel alive. These are fictional stand-ins, not real people or accounts.
        </p>
      </DocSection>

      <DocSection heading="You&apos;re in control">
        <p>
          Because everything is local, you hold every switch. Clearing your browser&apos;s site data — or using the
          reset guidance on the <a className="text-ink underline-offset-4 hover:underline" href="/help">Help page</a> —
          wipes Pulse back to its first-run state instantly and completely.
        </p>
      </DocSection>
    </DocPage>
  );
}
