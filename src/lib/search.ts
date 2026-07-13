/**
 * Pure helpers for the Explore search surface.
 *
 * Kept free of React and the DOM so the URL-sync rules and the result summary
 * can be unit-tested directly.
 */

/**
 * Build the querystring for a search term. An empty term drops `q` entirely
 * rather than leaving a dangling `?q=` in the address bar.
 */
export function buildSearchQuery(term: string): string {
  const q = term.trim();
  return q ? `?q=${encodeURIComponent(q)}` : '';
}

/** The URL is the source of truth; treat absent and blank as the same thing. */
export function normalizeQuery(raw: string | null | undefined): string {
  return (raw ?? '').trim();
}

/**
 * True when a search returned nothing anywhere on the page, so the UI can show
 * one honest empty state instead of three separate "no matches" lines.
 */
export function isEmptySearch(term: string, counts: { trends: number; people: number }): boolean {
  return normalizeQuery(term).length > 0 && counts.trends === 0 && counts.people === 0;
}

/**
 * Screen-reader summary of what a search turned up. Announced in a live region,
 * because a visual "3 results" that only sighted users get is not a result.
 */
export function describeResults(term: string, counts: { trends: number; people: number }): string {
  if (!normalizeQuery(term)) return '';
  const total = counts.trends + counts.people;
  if (total === 0) return `No results for ${normalizeQuery(term)}.`;
  const parts: string[] = [];
  if (counts.trends) parts.push(`${counts.trends} ${counts.trends === 1 ? 'trend' : 'trends'}`);
  if (counts.people) parts.push(`${counts.people} ${counts.people === 1 ? 'person' : 'people'}`);
  return `${parts.join(' and ')} for ${normalizeQuery(term)}.`;
}
