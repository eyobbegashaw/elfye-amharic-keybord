import { describe, it, expect } from 'vitest';
import { translations } from '../src/renderer/translations.js';
import { generateReferenceChart } from '@amharic-keyboard/react';

describe('Desktop Companion App', () => {
  it('loads translations for both Amharic and English', () => {
    expect(translations.am.appTitle).toBeDefined();
    expect(translations.en.appTitle).toBeDefined();
    expect(translations.am.practiceTab).toContain('ልምምድ');
    expect(translations.en.practiceTab).toContain('Practice');
  });

  it('includes IME setup instructions for Linux, macOS, and Windows', () => {
    expect(translations.am.linuxSteps.length).toBeGreaterThan(0);
    expect(translations.am.macosSteps.length).toBeGreaterThan(0);
    expect(translations.am.windowsSteps.length).toBeGreaterThan(0);

    expect(translations.en.linuxSteps[0]).toContain('IBus');
    expect(translations.en.macosSteps[0]).toContain('Input Methods');
    expect(translations.en.windowsSteps[1]).toContain('register.bat');
  });

  it('generates the reference chart rows from @amharic-keyboard/react', () => {
    const rows = generateReferenceChart();
    expect(rows.length).toBeGreaterThanOrEqual(33);

    const loneVowels = rows.find((r) => r.key === 'lone_vowels');
    expect(loneVowels).toBeDefined();
    expect(loneVowels?.cells.length).toBe(8);

    const hRow = rows.find((r) => r.key === 'h');
    expect(hRow).toBeDefined();
    expect(hRow?.cells[0].char).toBe('ሀ');
    expect(hRow?.cells[7].char).toBe('ኋ');
  });
});
