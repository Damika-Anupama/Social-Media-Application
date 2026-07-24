'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the root layout (including <html>/<body>), so it can't rely on globals.css or
 * Tailwind — styles are inlined and kept minimal on purpose.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07070b',
          color: '#f5f5fa',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          padding: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            Pulse hit an unexpected error.
          </h1>
          <p style={{ marginTop: '1rem', color: '#a7a7b8', lineHeight: 1.6 }}>
            Please reload the app. If it keeps happening, try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: 999,
              border: 'none',
              background: '#6435ff',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
