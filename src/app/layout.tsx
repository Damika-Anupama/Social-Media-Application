import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pulse — A next-level social network',
  description:
    'Pulse is a frontend demonstration of a modern social platform — feeds, stories, messaging, and a polished UI built for clarity, speed, and presence.',
  openGraph: {
    title: 'Pulse — A next-level social network',
    description: 'Frontend demonstration of a modern social platform.',
    type: 'website',
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
