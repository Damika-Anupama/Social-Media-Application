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

/** The category chips on Explore. "For you" is everything. */
export const EXPLORE_CHIPS = [
  'For you',
  'Trending',
  'News',
  'Design',
  'Climate',
  'Tech',
  'Sports',
  'Film',
  'Music',
  'Books',
] as const;

export type ExploreChip = (typeof EXPLORE_CHIPS)[number];

/**
 * Does a trend belong under this chip?
 *
 * The chips used to filter nothing at all: clicking one moved the highlight and
 * left the list exactly as it was. A control that gives feedback and changes
 * nothing is worse than one that does nothing — it tells you it worked.
 *
 * Categories in the data read like "Technology · Trending", so a chip matches
 * on a substring, with the couple of aliases the copy actually uses.
 */
export function matchesChip(category: string, chip: string): boolean {
  if (chip === 'For you') return true;

  const haystack = category.toLowerCase();
  const aliases: Record<string, string[]> = {
    Tech: ['tech', 'technology', 'science'],
    News: ['news', 'politics', 'world'],
    Film: ['film', 'cinema', 'tv'],
    Books: ['book', 'writing', 'literature'],
    Music: ['music', 'audio'],
    Sports: ['sport'],
    Design: ['design', 'craft'],
    Climate: ['climate', 'energy', 'nature'],
    Trending: ['trending'],
  };

  const terms = aliases[chip] ?? [chip.toLowerCase()];
  return terms.some((t) => haystack.includes(t));
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
