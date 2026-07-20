/**
 * Deterministic, context-aware auto-reply for the demo DM thread.
 *
 * Replies used to be a random line from a fixed pool — so "thanks!" might come
 * back with "going through it now" and a reload could change what was "said".
 * This reads the message and answers in kind (greeting, thanks, a question, a
 * time), falling back to a pool entry chosen by a hash of the text: same
 * message → same reply, no Math.random, and unit-testable.
 */

const GENERIC = [
  'Got it — let me chase that down and revert in a bit.',
  'Yes, that works on my end. Sending the details shortly.',
  'Appreciate the heads up. Will loop in the rest of the team.',
  'Perfect, I will queue it up for the morning.',
  'Just opened the doc — going through it now.',
];

/** Deterministic string hash (djb2). No Date/Math.random. */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/** Compose a believable reply to what the viewer just sent. */
export function composeReply(userText: string): string {
  const text = userText.trim();
  const lower = text.toLowerCase();

  if (/\b(hi|hey|hello|morning|evening)\b/.test(lower)) {
    return 'Hey! Good to hear from you — what’s up?';
  }
  if (/\b(thanks|thank you|cheers|appreciate)\b/.test(lower)) {
    return 'Anytime — happy to help.';
  }
  if (/\b(tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|weekend|later|tonight)\b/.test(lower)) {
    return 'Works for me — I’ll make a note and confirm.';
  }
  if (text.endsWith('?')) {
    return 'Good question. Let me look into it and get back to you.';
  }
  if (/\b(sent|sending|attached|link|doc|file)\b/.test(lower)) {
    return 'Got it, opening it now — I’ll read through and reply.';
  }
  // Deterministic fallback keyed by the message.
  return GENERIC[hashString(text) % GENERIC.length];
}

/**
 * A believable "typing" delay in ms, scaled a little by message length and
 * capped. Deterministic — a given message always takes the same time.
 */
export function replyDelay(userText: string): number {
  const base = 1200;
  const perChar = 20;
  return Math.min(3200, base + userText.trim().length * perChar);
}
