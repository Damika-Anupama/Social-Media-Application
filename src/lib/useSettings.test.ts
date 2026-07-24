import { describe, expect, it } from 'vitest';
import { SETTING_DEFAULTS, isDefault, parseSettings, type Settings } from './useSettings';

describe('parseSettings', () => {
  it('returns the shipped defaults when nothing is stored', () => {
    expect(parseSettings(null)).toEqual(SETTING_DEFAULTS);
  });

  it('falls back to defaults on corrupt or wrongly-shaped payloads', () => {
    expect(parseSettings('not json')).toEqual(SETTING_DEFAULTS);
    expect(parseSettings('[]')).toEqual(SETTING_DEFAULTS);
    expect(parseSettings('null')).toEqual(SETTING_DEFAULTS);
  });

  it('applies stored values over the defaults', () => {
    const parsed = parseSettings(JSON.stringify({ privateAccount: true, notifyMentions: false }));
    expect(parsed.privateAccount).toBe(true);
    expect(parsed.notifyMentions).toBe(false);
  });

  it('keeps the default for a key the stored payload predates', () => {
    // An old payload that never heard of notifyLiveRooms must not yield undefined.
    const parsed = parseSettings(JSON.stringify({ privateAccount: true }));
    expect(parsed.notifyLiveRooms).toBe(SETTING_DEFAULTS.notifyLiveRooms);
  });

  it('ignores non-boolean values and unknown keys', () => {
    const parsed = parseSettings(
      JSON.stringify({ privateAccount: 'yes', notifyMentions: 1, bogus: true }),
    );
    expect(parsed).toEqual(SETTING_DEFAULTS);
    expect('bogus' in parsed).toBe(false);
  });
});

describe('isDefault', () => {
  it('is true for the shipped defaults', () => {
    expect(isDefault({ ...SETTING_DEFAULTS })).toBe(true);
  });

  it('is false once any switch is flipped', () => {
    const changed: Settings = { ...SETTING_DEFAULTS, privateAccount: true };
    expect(isDefault(changed)).toBe(false);
  });
});
