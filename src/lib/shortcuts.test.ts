import { describe, expect, it } from 'vitest';
import { SHORTCUTS, isTypingTarget, resolveShortcut } from './shortcuts';

describe('resolveShortcut', () => {
  it('starts a chord on the g prefix', () => {
    expect(resolveShortcut(null, 'g')).toEqual({ type: 'pending', prefix: 'g' });
  });

  it('completes a navigation chord', () => {
    expect(resolveShortcut('g', 'e')).toEqual({
      type: 'action',
      action: { kind: 'navigate', href: '/dashboard/explore' },
    });
  });

  it('drops an unknown second key instead of leaving the chord armed', () => {
    expect(resolveShortcut('g', 'z')).toEqual({ type: 'none' });
  });

  it('fires single-key actions', () => {
    expect(resolveShortcut(null, 'n')).toEqual({ type: 'action', action: { kind: 'compose' } });
    expect(resolveShortcut(null, '/')).toEqual({ type: 'action', action: { kind: 'palette' } });
    expect(resolveShortcut(null, '?')).toEqual({ type: 'action', action: { kind: 'help' } });
  });

  it('ignores keys with no binding', () => {
    expect(resolveShortcut(null, 'q')).toEqual({ type: 'none' });
  });

  it('does not treat a chord suffix as a standalone shortcut', () => {
    // 'h' only means Home *after* 'g'.
    expect(resolveShortcut(null, 'h')).toEqual({ type: 'none' });
  });

  it('has no duplicate bindings', () => {
    const ids = SHORTCUTS.map((s) => s.keys.join('+'));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('isTypingTarget', () => {
  const el = (tagName: string, contentEditable = false) =>
    ({ tagName, isContentEditable: contentEditable }) as unknown as EventTarget;

  it('detects text entry elements', () => {
    expect(isTypingTarget(el('INPUT'))).toBe(true);
    expect(isTypingTarget(el('TEXTAREA'))).toBe(true);
    expect(isTypingTarget(el('SELECT'))).toBe(true);
    expect(isTypingTarget(el('DIV', true))).toBe(true);
  });

  it('lets shortcuts through elsewhere', () => {
    expect(isTypingTarget(el('DIV'))).toBe(false);
    expect(isTypingTarget(el('BUTTON'))).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
});
