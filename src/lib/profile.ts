/**
 * Profile editing rules, kept pure so the validation and the persistence
 * shape can be unit-tested without React or the DOM.
 */

export type ProfileEdits = {
  name: string;
  bio: string;
  location: string;
  link: string;
};

export const LIMITS = {
  name: 50,
  bio: 160,
  location: 30,
  link: 100,
} as const;

export type ProfileErrors = Partial<Record<keyof ProfileEdits, string>>;

/**
 * Validate the edit form. A display name is the one thing that cannot be
 * blank — everything else is optional, but bounded.
 */
export function validateProfile(edits: ProfileEdits): ProfileErrors {
  const errors: ProfileErrors = {};

  const name = edits.name.trim();
  if (!name) errors.name = 'Display name is required.';
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;

  if (edits.bio.trim().length > LIMITS.bio) errors.bio = `Keep it under ${LIMITS.bio} characters.`;

  if (edits.location.trim().length > LIMITS.location) {
    errors.location = `Keep it under ${LIMITS.location} characters.`;
  }

  if (edits.link.trim().length > LIMITS.link) {
    errors.link = `Keep it under ${LIMITS.link} characters.`;
  }

  return errors;
}

export function isValidProfile(edits: ProfileEdits): boolean {
  return Object.keys(validateProfile(edits)).length === 0;
}

/**
 * The "Posts" stat on the profile. The current user authors no seed posts in
 * this frontend demo — their only real content is what they compose — so the
 * count is their seeded posts plus their persisted composed posts. It starts
 * honest (rather than a hardcoded "184") and grows the moment they post.
 */
export function profilePostCount(seedPostCount: number, composedPostCount: number): number {
  return Math.max(0, seedPostCount) + Math.max(0, composedPostCount);
}

/** Trim every field, so " Ada " and "Ada" are not two different names. */
export function normalizeProfile(edits: ProfileEdits): ProfileEdits {
  return {
    name: edits.name.trim(),
    bio: edits.bio.trim(),
    location: edits.location.trim(),
    link: edits.link.trim(),
  };
}

/**
 * Parse persisted edits. Every field is optional and independently validated,
 * so a partial or half-corrupt payload degrades to the seed rather than
 * blanking the profile.
 */
export function parseProfileEdits(raw: string | null): Partial<ProfileEdits> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const out: Partial<ProfileEdits> = {};
    for (const key of ['name', 'bio', 'location', 'link'] as const) {
      const value = (parsed as Record<string, unknown>)[key];
      if (typeof value === 'string') out[key] = value;
    }
    // A stored empty name is not a valid profile — fall back to the seed.
    if (out.name !== undefined && !out.name.trim()) delete out.name;
    return out;
  } catch {
    return {};
  }
}
