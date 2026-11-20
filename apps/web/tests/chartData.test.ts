import { describe, it, expect } from 'vitest';
import { generateReferenceChart } from '../src/chartData.js';
import { transliterate } from '@elfye/core';

describe('Web Reference Chart Generation from Core', () => {
  it('generates rows for lone vowels, pharyngeal vowels, and consonants', () => {
    const rows = generateReferenceChart();
    expect(rows.length).toBeGreaterThanOrEqual(34);

    const loneVowelRow = rows.find((r) => r.key === 'lone_vowels');
    expect(loneVowelRow).toBeDefined();
    expect(loneVowelRow?.cells).toHaveLength(8);

    // Verify 'a' -> 'አ', 'u' -> 'ኡ', 'aa' -> 'ኣ'
    expect(loneVowelRow?.cells[0].char).toBe('አ');
    expect(loneVowelRow?.cells[0].keystroke).toBe('a');
    expect(loneVowelRow?.cells[3].char).toBe('ኣ');
    expect(loneVowelRow?.cells[3].keystroke).toBe('aa');
  });

  it('generates correct 8 orders for consonant rows matching transliteration engine', () => {
    const rows = generateReferenceChart();
    const hRow = rows.find((r) => r.key === 'h');
    expect(hRow).toBeDefined();
    expect(hRow?.cells).toHaveLength(8);

    // 1st: he -> ሀ
    expect(hRow?.cells[0].char).toBe('ሀ');
    expect(hRow?.cells[0].keystroke).toBe('he');
    expect(transliterate('he')).toBe('ሀ');

    // 4th: ha -> ሃ
    expect(hRow?.cells[3].char).toBe('ሃ');
    expect(hRow?.cells[3].keystroke).toBe('ha');
    expect(transliterate('ha')).toBe('ሃ');

    // 6th: h -> ህ
    expect(hRow?.cells[5].char).toBe('ህ');
    expect(hRow?.cells[5].keystroke).toBe('h');
    expect(transliterate('h')).toBe('ህ');

    // 8th: hua -> ኋ
    expect(hRow?.cells[7].char).toBe('ኋ');
    expect(hRow?.cells[7].keystroke).toBe('hua');
    expect(transliterate('hua')).toBe('ኋ');
  });

  it('marks null for consonants without an 8th labial order', () => {
    const rows = generateReferenceChart();
    const pharyngealRow = rows.find((r) => r.key === 'pharyngeal_vowels');
    expect(pharyngealRow?.cells[7].char).toBeNull();
  });
});
