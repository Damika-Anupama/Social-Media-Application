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
