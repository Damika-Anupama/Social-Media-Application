/**
 * Image sizing helpers.
 *
 * The mock image URLs already carry their intrinsic size (`&w=800&h=1000`),
 * which is exactly what next/image needs to reserve space before the bytes
 * arrive. Recovering it from the URL keeps the data shape unchanged and means
 * no image can ship without dimensions — which is what caused the layout shift.
 */

export type ImageSize = { width: number; height: number };

/** Fallback for a URL with no usable size — a plain 4:3, never zero. */
export const DEFAULT_SIZE: ImageSize = { width: 800, height: 600 };

function positiveInt(raw: string | null): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

/**
 * Read the intrinsic size out of an image URL's query string.
 *
 * Falls back rather than throwing: a bad URL should cost a slightly wrong
 * aspect ratio, not a crashed render.
 */
export function parseImageSize(src: string): ImageSize {
  try {
    const url = new URL(src, 'https://example.invalid');
    const width = positiveInt(url.searchParams.get('w'));
    const height = positiveInt(url.searchParams.get('h'));
    if (width && height) return { width, height };
    if (width) return { width, height: Math.round(width * 0.75) };
    return DEFAULT_SIZE;
  } catch {
    return DEFAULT_SIZE;
  }
}

/** Aspect ratio as a CSS-ready value, so a container can reserve the space. */
export function aspectRatio(src: string): string {
  const { width, height } = parseImageSize(src);
  return `${width} / ${height}`;
}
