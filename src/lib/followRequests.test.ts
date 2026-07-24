import { describe, expect, it } from 'vitest';
import {
  parseRequestState,
  pendingRequesters,
  seedRequesters,
  serializeRequestState,
} from '@/lib/followRequests';

describe('seedRequesters', () => {
  it('is deterministic and sized', () => {
    const a = seedRequesters().map((u) => u.id);
    const b = seedRequesters().map((u) => u.id);
    expect(a).toEqual(b);
    expect(a).toHaveLength(5);
    expect(new Set(a).size).toBe(5); // no duplicates
  });
});

describe('parseRequestState', () => {
  it('returns empty for null, junk, or wrong shapes', () => {
    expect(parseRequestState(null)).toEqual({ approved: [], declined: [] });
    expect(parseRequestState('not json')).toEqual({ approved: [], declined: [] });
    expect(parseRequestState('[1,2,3]')).toEqual({ approved: [], declined: [] });
  });

  it('keeps only string ids and de-dupes', () => {
    const parsed = parseRequestState(JSON.stringify({ approved: ['a', 'a', 3, null], declined: ['b'] }));
    expect(parsed.approved).toEqual(['a']);
    expect(parsed.declined).toEqual(['b']);
  });

  it('round-trips through serialize', () => {
    const state = { approved: ['x', 'y'], declined: ['z'] };
    expect(parseRequestState(serializeRequestState(state))).toEqual(state);
  });
});

describe('pendingRequesters', () => {
  it('is every seed requester when nothing is decided', () => {
    expect(pendingRequesters({ approved: [], declined: [] })).toHaveLength(seedRequesters().length);
  });

  it('drops requesters that were approved or declined', () => {
    const seeds = seedRequesters();
    const state = { approved: [seeds[0].id], declined: [seeds[1].id] };
    const pendingIds = pendingRequesters(state).map((u) => u.id);
    expect(pendingIds).not.toContain(seeds[0].id);
    expect(pendingIds).not.toContain(seeds[1].id);
    expect(pendingIds).toHaveLength(seeds.length - 2);
  });
});
