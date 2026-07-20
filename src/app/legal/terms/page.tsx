import type { Metadata } from 'next';
import { DocPage, DocSection } from '@/components/DocPage';

export const metadata: Metadata = {
  title: 'Terms & Community Charter',
  description: 'The simple rules of the road for Pulse — and the kind of place we want it to be.',
};

export default function TermsPage() {
  return (
    <DocPage
      title="Terms & Community Charter"
      updated="Last updated 20 July 2026"
      intro="Two things in one page: the plain-language terms for using Pulse, and the Community Charter — the culture we design for."
    >
      <DocSection heading="A demonstration, not a service">
        <p>
          Pulse is a frontend demonstration. There is no backend, no real account, and nothing you do here leaves your
          browser. Any input that passes validation on the sign-in screens &ldquo;signs you in&rdquo; — there is no
          password to be right or wrong. Because of that, these terms describe how the demo behaves rather than a
          contract for a live product.
        </p>
      </DocSection>

      <DocSection heading="The Community Charter">
        <p>
          If Pulse were real, this is the room we&apos;d want to walk into. Be a person other people are glad to share a
          feed with:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Assume good faith. Argue with ideas, never with someone&apos;s right to exist.</li>
          <li>No harassment, hate, or threats — toward anyone, for any reason.</li>
          <li>Credit the work of others. Don&apos;t pass off someone else&apos;s craft as your own.</li>
          <li>Keep it human. No spam, no manipulation, no engagement bait.</li>
        </ul>
      </DocSection>

      <DocSection heading="Your content stays yours">
        <p>
          Anything you compose in this demo lives in your browser&apos;s local storage and belongs entirely to you. We
          claim no rights over it, and clearing your browser data removes it completely.
        </p>
      </DocSection>

      <DocSection heading="What Pulse doesn&apos;t do">
        <p>
          No trackers. No advertising. No selling of data — there is no data to sell, because none of it leaves your
          device. That&apos;s not a promise we&apos;re asking you to trust; it&apos;s a consequence of how the demo is
          built.
        </p>
      </DocSection>

      <DocSection heading="Changes">
        <p>
          As the demonstration evolves, this page may change with it. Since there are no accounts, there&apos;s no one to
          notify — the latest version simply lives here.
        </p>
      </DocSection>
    </DocPage>
  );
}
