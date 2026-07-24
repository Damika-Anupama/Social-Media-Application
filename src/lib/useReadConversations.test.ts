import { describe, expect, it } from 'vitest';
import { countUnreadMessages } from './useReadConversations';

const convos = [
  { id: 'c1', unread: 2 },
  { id: 'c2', unread: 1 },
  { id: 'c3' },
];

describe('countUnreadMessages', () => {
  it('sums the seeded unread counts when nothing has been read', () => {
    expect(countUnreadMessages(convos, new Set())).toBe(3);
  });

  it('opening a conversation removes its whole count', () => {
    expect(countUnreadMessages(convos, new Set(['c1']))).toBe(1);
    expect(countUnreadMessages(convos, new Set(['c1', 'c2']))).toBe(0);
  });

  it('conversations without a count contribute nothing, read or not', () => {
    expect(countUnreadMessages(convos, new Set(['c3']))).toBe(3);
    expect(countUnreadMessages([], new Set())).toBe(0);
  });
});
