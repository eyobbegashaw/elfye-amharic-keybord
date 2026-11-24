import { describe, it, expect } from 'vitest';
import { mobileTranslations } from '../src/utils/translations';
import { LiveTypingEngine } from '@elfye/core';

describe('Mobile Companion App', () => {
  it('defaults to Amharic translations with English option', () => {
    expect(mobileTranslations.am).toBeDefined();
    expect(mobileTranslations.en).toBeDefined();
    expect(mobileTranslations.am.appName).toContain('የአማርኛ ኪቦርድ');
    expect(mobileTranslations.en.appName).toContain('Amharic Keyboard');
  });

  it('contains onboarding steps for OS keyboard settings', () => {
    expect(mobileTranslations.am.step1Title).toBeDefined();
    expect(mobileTranslations.am.openSettingsBtn).toContain('ቅንብሮችን ክፈት');
    expect(mobileTranslations.en.openSettingsBtn).toContain('Settings');
  });

  it('powers AmharicTextInput correctly via LiveTypingEngine', () => {
    const engine = new LiveTypingEngine();

    // Type s -> e -> l -> a -> m
    const r1 = engine.input('s');
    expect(r1.composing).toBe('ስ');

    const r2 = engine.input('e');
    expect(r2.composing).toBe('ሰ');

    const r3 = engine.input('l');
    expect(r3.committed).toBe('ሰ');
    expect(r3.composing).toBe('ል');

    const r4 = engine.input('a');
    expect(r4.composing).toBe('ላ');

    const r5 = engine.input('m');
    expect(r5.committed).toBe('ላ');
    expect(r5.composing).toBe('ም');

    const r6 = engine.input(' ');
    expect(r6.committed).toBe('ም ');
    expect(r6.composing).toBe('');
  });

  it('supports progressive backspace in mobile input', () => {
    const engine = new LiveTypingEngine();
    engine.input('s');
    engine.input('e');
    expect(engine.getComposing()).toBe('ሰ');

    const b1 = engine.backspace();
    expect(b1.composing).toBe('ስ');

    const b2 = engine.backspace();
    expect(b2.composing).toBe('');
  });

  it('handles rapid sequential typing without latency or duplicate letters', () => {
    const engine = new LiveTypingEngine();
    const word = 'selam';
    let output = '';

    for (const char of word) {
      const res = engine.input(char);
      if (res.committed) {
        output += res.committed;
      }
    }
    const end = engine.commitCurrent();
    output += end;

    expect(output).toBe('ሰላም');
  });
});
