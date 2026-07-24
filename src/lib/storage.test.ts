import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isQuotaExceeded, onStorageFailure, readRaw, writeJson } from './storage';

const store = new Map<string, string>();

function installStorage(setItem: (k: string, v: string) => void) {
  vi.stubGlobal('window', {
    localStorage: {
      setItem,
      getItem: (k: string) => store.get(k) ?? null,
    },
  });
}

beforeEach(() => {
  store.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('writeJson', () => {
  it('persists and reports success', () => {
    installStorage((k, v) => store.set(k, v));
    expect(writeJson('k', { a: 1 })).toBe(true);
    expect(readRaw('k')).toBe('{"a":1}');
  });

  it('returns false and notifies when the write throws', () => {
    installStorage(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });

    const seen: string[] = [];
    const off = onStorageFailure((f) => seen.push(f.key));

    // The bug this exists to kill: this used to return nothing and say nothing.
    expect(writeJson('posts', { a: 1 })).toBe(false);
    expect(seen).toEqual(['posts']);

    off();
  });

  it('flags quota exhaustion separately from storage being unavailable', () => {
    installStorage(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    const failures: boolean[] = [];
    const off = onStorageFailure((f) => failures.push(f.quotaExceeded));
    writeJson('k', 1);
    expect(failures).toEqual([true]);
    off();

    installStorage(() => {
      throw new Error('storage disabled');
    });
    const failures2: boolean[] = [];
    const off2 = onStorageFailure((f) => failures2.push(f.quotaExceeded));
    writeJson('k', 1);
    expect(failures2).toEqual([false]);
    off2();
  });

  it('stops notifying an unsubscribed listener', () => {
    installStorage(() => {
      throw new Error('nope');
    });
    const seen: string[] = [];
    const off = onStorageFailure((f) => seen.push(f.key));
    off();
    writeJson('k', 1);
    expect(seen).toEqual([]);
  });
});

describe('isQuotaExceeded', () => {
  it('recognises the browsers that disagree about the name', () => {
    expect(isQuotaExceeded(new DOMException('x', 'QuotaExceededError'))).toBe(true);
    expect(isQuotaExceeded(new DOMException('x', 'NS_ERROR_DOM_QUOTA_REACHED'))).toBe(true);
  });

  it('is false for anything that is not a quota problem', () => {
    expect(isQuotaExceeded(new DOMException('x', 'SecurityError'))).toBe(false);
    expect(isQuotaExceeded(new Error('boom'))).toBe(false);
    expect(isQuotaExceeded(null)).toBe(false);
  });
});
