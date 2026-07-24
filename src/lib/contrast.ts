/**
 * WCAG contrast maths, plus the design tokens as data.
 *
 * The tokens live in globals.css as CSS variables, which nothing could check.
 * Mirroring them here lets the contrast rules be a test instead of an opinion —
 * ink-dim failed AA on every background in both themes and nobody noticed,
 * because "is this grey too grey" is not a thing code review catches.
 */

export type Rgb = readonly [number, number, number];

/** WCAG relative luminance. */
export function luminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio, 1 (identical) to 21 (black on white). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** AA needs 4.5:1 for body text, 3:1 for large text (>=18.66px bold / 24px). */
export const AA_BODY = 4.5;
export const AA_LARGE = 3;

/** Must match the :root blocks in globals.css. */
export const DARK = {
  bg: [7, 7, 11],
  'bg-subtle': [13, 13, 20],
  'bg-raised': [19, 19, 28],
  'bg-elevated': [26, 26, 36],
  ink: [245, 245, 250],
  'ink-muted': [167, 167, 184],
  'ink-dim': [130, 130, 151],
} as const satisfies Record<string, Rgb>;

export const LIGHT = {
  bg: [247, 247, 251],
  'bg-subtle': [237, 238, 244],
  'bg-raised': [255, 255, 255],
  'bg-elevated': [240, 241, 247],
  ink: [23, 23, 31],
  'ink-muted': [74, 76, 92],
  'ink-dim': [104, 106, 120],
} as const satisfies Record<string, Rgb>;

export const SURFACES = ['bg', 'bg-subtle', 'bg-raised', 'bg-elevated'] as const;
export const TEXT_TOKENS = ['ink', 'ink-muted', 'ink-dim'] as const;

/**
 * Accent foregrounds — brand and accent colours used as *text*.
 *
 * These were the gap. The original contrast test checked ink tokens against
 * the neutral surfaces and passed, and I read that as "contrast is fine". It
 * was not: every coloured text token failed AA somewhere, and axe found them
 * later. A test proves what it measures and not one thing more.
 */
export const DARK_ACCENTS = {
  'brand-200': [201, 191, 255],
  'brand-300': [161, 140, 255],
  'accent-coral-fg': [255, 107, 107],
  'accent-mint-fg': [61, 219, 179],
  'accent-sun-fg': [255, 209, 102],
  'accent-sky-fg': [76, 201, 240],
} as const satisfies Record<string, Rgb>;

export const LIGHT_ACCENTS = {
  'brand-200': [91, 46, 204],
  'brand-300': [76, 31, 184],
  'accent-coral-fg': [192, 38, 38],
  'accent-mint-fg': [13, 122, 99],
  'accent-sun-fg': [138, 90, 0],
  'accent-sky-fg': [11, 106, 148],
} as const satisfies Record<string, Rgb>;

export const ACCENT_TOKENS = [
  'brand-200',
  'brand-300',
  'accent-coral-fg',
  'accent-mint-fg',
  'accent-sun-fg',
  'accent-sky-fg',
] as const;
