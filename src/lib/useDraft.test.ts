import { describe, expect, it } from 'vitest';
import { EMPTY_DRAFT, parseDraft, serializeDraft } from './useDraft';

describe('draft persistence', () => {
  it('round-trips a draft', () => {
    const draft = { text: 'half a thought', tone: 'photo' };
    expect(parseDraft(serializeDraft(draft))).toEqual(draft);
  });

  it('nothing stored is the empty draft', () => {
    expect(parseDraft(null)).toEqual(EMPTY_DRAFT);
    expect(parseDraft('')).toEqual(EMPTY_DRAFT);
  });

  it('a corrupted store cannot poison the composer', () => {
    expect(parseDraft('not json {')).toEqual(EMPTY_DRAFT);
    expect(parseDraft('null')).toEqual(EMPTY_DRAFT);
    expect(parseDraft('42')).toEqual(EMPTY_DRAFT);
    expect(parseDraft('[1,2,3]')).toEqual({ text: '', tone: 'thought' });
  });

  it('wrong field types degrade per-field, not wholesale', () => {
    expect(parseDraft('{"text":7,"tone":"photo"}')).toEqual({ text: '', tone: 'photo' });
    expect(parseDraft('{"text":"kept","tone":null}')).toEqual({ text: 'kept', tone: 'thought' });
  });
});
