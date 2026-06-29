'use client';

export type ShareResult = 'shared' | 'copied' | 'dismissed' | 'failed';

export type ShareData = {
  /** Absolute or root-relative path to share, e.g. "/dashboard/p/p1". */
  url: string;
  title?: string;
  text?: string;
};

/**
 * Build an absolute URL from a root-relative path. Pure (origin can be injected)
 * so it is unit-testable without a browser.
 */
export function buildShareUrl(path: string, origin?: string): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  if (/^https?:\/\//.test(path)) return path; // already absolute
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Share a link using the native Web Share API when available (great on mobile),
 * falling back to copying the URL to the clipboard. Returns a discriminated
 * result so callers can show the right feedback:
 *  - 'shared'    native share sheet completed
 *  - 'copied'    URL copied to clipboard (fallback)
 *  - 'dismissed' user cancelled the native sheet — show nothing
 *  - 'failed'    no mechanism worked
 */
export async function shareLink(data: ShareData): Promise<ShareResult> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;

  if (nav?.share) {
    try {
      await nav.share({ url: data.url, title: data.title, text: data.text });
      return 'shared';
    } catch (err) {
      // User dismissed the native sheet — not an error, just stop.
      if (err instanceof DOMException && err.name === 'AbortError') return 'dismissed';
      // Any other failure: fall through to the clipboard path below.
    }
  }

  if (nav?.clipboard?.writeText) {
    try {
      await nav.clipboard.writeText(data.url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
