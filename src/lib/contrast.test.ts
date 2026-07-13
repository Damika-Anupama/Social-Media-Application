import { describe, expect, it } from 'vitest';
import {
  AA_BODY,
  ACCENT_TOKENS,
  DARK,
  DARK_ACCENTS,
  LIGHT,
  LIGHT_ACCENTS,
  SURFACES,
  TEXT_TOKENS,
  contrastRatio,
  luminance,
} from './contrast';

describe('contrastRatio', () => {
  it('is 21 for black on white and 1 for a colour on itself', () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 1);
    expect(contrastRatio([120, 120, 120], [120, 120, 120])).toBeCloseTo(1, 5);
  });

  it('is symmetric — order of foreground and background does not matter', () => {
    const a = [30, 40, 50] as const;
    const b = [200, 210, 220] as const;
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });

  it('agrees with known WCAG luminances', () => {
    expect(luminance([255, 255, 255])).toBeCloseTo(1, 5);
    expect(luminance([0, 0, 0])).toBeCloseTo(0, 5);
  });
});

/**
 * The real point of this file. Every text token is used for small text
 * somewhere — timestamps, hints, counts, captions are all ink-dim — so all of
 * them are held to AA body text (4.5:1), not the large-text exemption.
 */
describe.each([
  ['dark', DARK],
  ['light', LIGHT],
])('%s theme meets WCAG AA', (_name, theme) => {
  for (const text of TEXT_TOKENS) {
    for (const surface of SURFACES) {
      it(`${text} on ${surface}`, () => {
        const ratio = contrastRatio(theme[text], theme[surface]);
        expect(
          ratio,
          `${text} on ${surface} is ${ratio.toFixed(2)}:1, needs ${AA_BODY}:1`,
        ).toBeGreaterThanOrEqual(AA_BODY);
      });
    }
  }
});

/**
 * Coloured text — the case the original test did not model, and where every
 * real failure turned out to be hiding.
 */
describe.each([
  ['dark', DARK, DARK_ACCENTS],
  ['light', LIGHT, LIGHT_ACCENTS],
])('%s theme accent text meets WCAG AA', (_name, theme, accents) => {
  for (const token of ACCENT_TOKENS) {
    for (const surface of SURFACES) {
      it(`${token} on ${surface}`, () => {
        const ratio = contrastRatio(accents[token], theme[surface]);
        expect(
          ratio,
          `${token} on ${surface} is ${ratio.toFixed(2)}:1, needs ${AA_BODY}:1`,
        ).toBeGreaterThanOrEqual(AA_BODY);
      });
    }
  }
});
