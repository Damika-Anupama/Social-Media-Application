import { describe, it, expect } from 'vitest';
import { commandMatches, searchDirectory } from '@/lib/commandPalette';
import type { User, Community } from '@/lib/mock-data';

const user = (over: Partial<User>): User =>
  ({ id: 'u', handle: 'u', name: 'U', avatar: '', ...over }) as User;

const community = (over: Partial<Community>): Community =>
  ({
    id: 'c',
    name: 'C',
    slug: 'c',
    members: 0,
    online: 0,
    cover: '',
    description: '',
    topic: 'T',
    ...over,
  }) as Community;

describe('commandMatches', () => {
  it('matches everything on an empty/whitespace query', () => {
    expect(commandMatches('', ['Home'])).toBe(true);
    expect(commandMatches('   ', ['Home'])).toBe(true);
  });

  it('is a case-insensitive substring match', () => {
    expect(commandMatches('NAD', ['Nadia Pereira'])).toBe(true);
    expect(commandMatches('per', ['Nadia Pereira'])).toBe(true);
  });

  it('returns false when nothing matches and skips undefined haystacks', () => {
    expect(commandMatches('zzz', ['Nadia', undefined])).toBe(false);
    expect(commandMatches('nadia', [undefined, 'Nadia'])).toBe(true);
  });
});

describe('searchDirectory', () => {
  const users = [
    user({ id: 'u1', handle: 'nadia', name: 'Nadia Pereira' }),
    user({ id: 'u2', handle: 'kenji', name: 'Kenji Mori' }),
  ];
  const communities = [
    community({ id: 'cm1', slug: 'slow-web', name: 'Slow Web Society', topic: 'Calm tech' }),
    community({ id: 'cm2', slug: 'open-climate', name: 'Open Climate Lab', topic: 'Science' }),
  ];

  it('returns nothing for an empty query', () => {
    expect(searchDirectory('', users, communities)).toEqual({ people: [], communities: [] });
  });

  it('matches a person by name and builds a profile href', () => {
    const { people } = searchDirectory('nadia', users, communities);
    expect(people).toHaveLength(1);
    expect(people[0]).toMatchObject({
      type: 'user',
      id: 'u1',
      label: 'Nadia Pereira',
      sublabel: '@nadia',
      href: '/dashboard/u/nadia',
    });
  });

  it('matches a person by handle even when the name does not contain the query', () => {
    const { people } = searchDirectory('kenji', users, communities);
    expect(people.map((p) => p.id)).toEqual(['u2']);
  });

  it('matches a community by name, slug, or topic and builds a community href', () => {
    expect(searchDirectory('slow', users, communities).communities[0]).toMatchObject({
      type: 'community',
      id: 'cm1',
      href: '/dashboard/c/slow-web',
    });
    expect(searchDirectory('science', users, communities).communities.map((c) => c.id)).toEqual([
      'cm2',
    ]);
    expect(searchDirectory('open-climate', users, communities).communities.map((c) => c.id)).toEqual([
      'cm2',
    ]);
  });

  it('caps each group at limitPer', () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      user({ id: `u${i}`, handle: `dev${i}`, name: `Dev ${i}` }),
    );
    expect(searchDirectory('dev', many, [], 3).people).toHaveLength(3);
  });
});
