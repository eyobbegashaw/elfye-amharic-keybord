import { describe, it, expect } from 'vitest';
import { transliterate } from '../src/transliterate.js';

describe('transliterate - Whole String Function', () => {
  it('transliterates primary prompt example', () => {
    expect(transliterate('selam , endiet nesh')).toBe('ሰላም ፣ እንዴት ነሽ');
  });

  it('handles full vowel orders + labialized 8th column', () => {
    expect(transliterate('he')).toBe('ሀ');
    expect(transliterate('hu')).toBe('ሁ');
    expect(transliterate('hi')).toBe('ሂ');
    expect(transliterate('ha')).toBe('ሃ');
    expect(transliterate('hie')).toBe('ሄ');
    expect(transliterate('h')).toBe('ህ');
    expect(transliterate('ho')).toBe('ሆ');
    expect(transliterate('hua')).toBe('ኋ');
  });

  it('guarantees unambiguous 1st order vs 4th order', () => {
    expect(transliterate('hel')).toBe('ሀል');
    expect(transliterate('hal')).toBe('ሃል');
  });

  it('distinguishes case-sensitive homophones', () => {
    expect(transliterate('se')).toBe('ሰ');
    expect(transliterate('Se')).toBe('ሠ');
    expect(transliterate('te')).toBe('ተ');
    expect(transliterate('Te')).toBe('ጠ');
    expect(transliterate('che')).toBe('ቸ');
    expect(transliterate('Ce')).toBe('ጨ');
    expect(transliterate('pe')).toBe('ፐ');
    expect(transliterate('Pe')).toBe('ጰ');
    expect(transliterate('tse')).toBe('ጸ');
    expect(transliterate('Tse')).toBe('ፀ');
  });

  it('handles digraphs and trigraphs correctly with greedy match', () => {
    expect(transliterate('she')).toBe('ሸ');
    expect(transliterate('gne')).toBe('ኘ');
    expect(transliterate('khe')).toBe('ኸ');
    expect(transliterate('zhe')).toBe('ዠ');
  });

  it('handles lone vowels (አ row) vs pharyngeal row (ዐ row)', () => {
    expect(transliterate('a')).toBe('አ');
    expect(transliterate('u')).toBe('ኡ');
    expect(transliterate('i')).toBe('ኢ');
    expect(transliterate('ie')).toBe('ኤ');
    expect(transliterate('e')).toBe('እ');
    expect(transliterate('o')).toBe('ኦ');

    expect(transliterate('A')).toBe('ዐ');
    expect(transliterate('U')).toBe('ዑ');
    expect(transliterate('I')).toBe('ዒ');
    expect(transliterate('E')).toBe('ዕ');
    expect(transliterate('O')).toBe('ዖ');
  });

  it('supports escape character to break digraphs', () => {
    expect(transliterate("s'h")).toBe('ስህ');
    expect(transliterate('sh')).toBe('ሽ');
    expect(transliterate("t's")).toBe('ትስ');
    expect(transliterate('ts')).toBe('ጽ');
  });

  it('handles double escape character to output literal escape', () => {
    expect(transliterate("a''b")).toBe("አ'ብ");
  });

  it('handles labialized overrides correctly', () => {
    expect(transliterate('qua')).toBe('ቋ');
    expect(transliterate('kua')).toBe('ኳ');
    expect(transliterate('khua')).toBe('ዃ');
    expect(transliterate('gua')).toBe('ጓ');
    expect(transliterate('hua')).toBe('ኋ');
  });

  it('supports wa as alias for ua in labialized forms', () => {
    expect(transliterate('kwa')).toBe('ኳ');
    expect(transliterate('gwa')).toBe('ጓ');
    expect(transliterate('qwa')).toBe('ቋ');
    expect(transliterate('hwa')).toBe('ኋ');
  });

  it('converts punctuation by default', () => {
    expect(transliterate(',')).toBe('፣');
    expect(transliterate('.')).toBe('።');
    expect(transliterate(';')).toBe('፤');
    expect(transliterate(':')).toBe('፡');
  });

  it('keeps Latin punctuation when convertPunctuation is false', () => {
    expect(transliterate(',', { convertPunctuation: false })).toBe(',');
    expect(transliterate('.', { convertPunctuation: false })).toBe('.');
  });

  it('converts digits when convertDigits is true', () => {
    expect(transliterate('12345', { convertDigits: true })).toBe('፩፪፫፬፭');
  });

  it('leaves digits Latin by default', () => {
    expect(transliterate('12345')).toBe('12345');
  });
});
