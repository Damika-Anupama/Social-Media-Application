import type { Metadata, Viewport } from 'next';
import { resolveSiteUrl } from '@/lib/site';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import './globals.css';

// Was hardcoded to a vercel.app domain we do not own — it resolves to a
// stranger's "Create Next App". Every canonical and OG URL pointed at them.
const siteUrl = resolveSiteUrl();

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply saved display preferences before paint to avoid a flash of the
            wrong theme. Mirrors PreferencesProvider; kept tiny and dependency-free. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=JSON.parse(localStorage.getItem('pulse.preferences.v1')||'{}');var t=p.theme||'dark';var light=t==='light'||(t==='system'&&window.matchMedia('(prefers-color-scheme: light)').matches);var r=document.documentElement;r.classList.toggle('theme-light',light);if(p.reduceMotion)r.classList.add('reduce-motion');if(p.largerType)r.classList.add('text-larger');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
