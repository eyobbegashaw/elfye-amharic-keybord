import { describe, it, expect } from 'vitest';
import { translations } from '../src/translations.js';

describe('Web Localization & Translations', () => {
  it('has identical keys for Amharic and English', () => {
    const amKeys = Object.keys(translations.am).sort();
    const enKeys = Object.keys(translations.en).sort();
    expect(amKeys).toEqual(enKeys);
  });

  it('defaults to Amharic text in Amharic locale', () => {
    expect(translations.am.title).toBe('የአማርኛ ፎኔቲክ ኪቦርድ');
    expect(translations.am.copyBtn).toBe('ኮፒ አድርግ');
    expect(translations.am.clearBtn).toBe('አጽዳ');
  });
});
