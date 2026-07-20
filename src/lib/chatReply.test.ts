import { describe, it, expect } from 'vitest';
import { composeReply, replyDelay } from '@/lib/chatReply';

describe('composeReply', () => {
  it('greets back a greeting', () => {
    expect(composeReply('Hey there!')).toMatch(/good to hear from you/i);
    expect(composeReply('hello')).toMatch(/good to hear from you/i);
  });

  it('acknowledges thanks', () => {
    expect(composeReply('thanks so much')).toMatch(/happy to help/i);
    expect(composeReply('Appreciate it')).toMatch(/happy to help/i);
  });

  it('acknowledges a time / scheduling message', () => {
    expect(composeReply('can we do it tomorrow')).toMatch(/make a note/i);
    expect(composeReply('see you monday')).toMatch(/make a note/i);
  });

  it('answers a question', () => {
    expect(composeReply('are you free later?')).toMatch(/make a note|good question/i);
    expect(composeReply('what do you think of this design')).not.toMatch(/happy to help/i);
    expect(composeReply('is this ready?')).toMatch(/good question/i);
  });

  it('reacts to a shared link/doc', () => {
    expect(composeReply('just sent the doc over')).toMatch(/opening it now/i);
  });

  it('is deterministic for the fallback (same text → same reply)', () => {
    const a = composeReply('random musings about nothing in particular');
    const b = composeReply('random musings about nothing in particular');
    expect(a).toBe(b);
  });

  it('always returns a non-empty string, even for empty input', () => {
    expect(composeReply('').length).toBeGreaterThan(0);
    expect(composeReply('   ').length).toBeGreaterThan(0);
  });
});

describe('replyDelay', () => {
  it('scales with length and is capped and deterministic', () => {
    expect(replyDelay('hi')).toBe(1200 + 2 * 20);
    expect(replyDelay('hi')).toBe(replyDelay('hi'));
    expect(replyDelay('x'.repeat(500))).toBe(3200); // capped
  });
});
