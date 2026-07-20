import { describe, expect, it } from 'vitest';
import { users } from '@/lib/mock-data';
import { deriveConnections, orderConnections } from '@/lib/socialGraph';

describe('orderConnections', () => {
  it('excludes the profile owner', () => {
    const list = orderConnections('nadia', 'followers');
    expect(list.some((u) => u.handle === 'nadia')).toBe(false);
    expect(list).toHaveLength(users.length - 1);
  });

  it('includes every other seed user', () => {
    const handles = new Set(orderConnections('nadia', 'followers').map((u) => u.handle));
    for (const u of users) {
      if (u.handle !== 'nadia') expect(handles.has(u.handle)).toBe(true);
    }
  });

  it('is deterministic — same inputs, same order', () => {
    const a = orderConnections('kenji', 'following').map((u) => u.id);
    const b = orderConnections('kenji', 'following').map((u) => u.id);
    expect(a).toEqual(b);
  });

  it('orders followers and following differently', () => {
    const followers = orderConnections('kenji', 'followers').map((u) => u.id);
    const following = orderConnections('kenji', 'following').map((u) => u.id);
    expect(followers).not.toEqual(following);
    // ...but over the same set of people.
    expect([...followers].sort()).toEqual([...following].sort());
  });

  it('gives different profiles different orderings', () => {
    const nadia = orderConnections('nadia', 'followers').map((u) => u.id);
    const sasha = orderConnections('sasha', 'followers').map((u) => u.id);
    expect(nadia).not.toEqual(sasha);
  });
});

describe('deriveConnections', () => {
  it('returns both lists for an unknown handle (no one is excluded)', () => {
    const { followers, following } = deriveConnections('demo');
    expect(followers).toHaveLength(users.length);
    expect(following).toHaveLength(users.length);
  });
});
