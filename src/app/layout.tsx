import type { Metadata, Viewport } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pulse-demo.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pulse — A next-level social network',
    template: '%s · Pulse',
  },
  description:
    'Pulse is a frontend demonstration of a modern social platform — feeds, stories, messaging, and a polished UI built for clarity, speed, and presence.',
  applicationName: 'Pulse',
  authors: [{ name: 'Damika Anupama' }],
  openGraph: {
    title: 'Pulse — A next-level social network',
    description: 'Frontend demonstration of a modern social platform.',
    type: 'website',
    siteName: 'Pulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse — A next-level social network',
    description: 'Frontend demonstration of a modern social platform.',
  },
};

export const viewport: Viewport = {
  themeColor: '#07070b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
