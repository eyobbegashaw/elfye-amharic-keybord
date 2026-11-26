import { describe, it, expect, beforeEach } from 'vitest';
import { LiveTypingEngine } from '../src/engine.js';

describe('LiveTypingEngine - Live Typing & Composing State', () => {
  let engine: LiveTypingEngine;

  beforeEach(() => {
    engine = new LiveTypingEngine();
  });

  it('correctly manages pending and committed characters when typing "selam"', () => {
    // "s" -> composing "ስ"
    let res = engine.input('s');
    expect(res).toEqual({ committed: '', composing: 'ስ' });

    // "e" -> composing "ሰ"
    res = engine.input('e');
    expect(res).toEqual({ committed: '', composing: 'ሰ' });

    // "l" -> commits "ሰ", composing "ል"
    res = engine.input('l');
    expect(res).toEqual({ committed: 'ሰ', composing: 'ል' });

    // "a" -> composing "ላ"
    res = engine.input('a');
    expect(res).toEqual({ committed: '', composing: 'ላ' });

    // "m" -> commits "ላ", composing "ም"
    res = engine.input('m');
    expect(res).toEqual({ committed: 'ላ', composing: 'ም' });

    // " " -> commits "ም "
    res = engine.input(' ');
    expect(res).toEqual({ committed: 'ም ', composing: '' });

    expect(engine.getText()).toBe('ሰላም ');
  });

  it('handles backspace sequentially (ሰ -> ስ -> empty)', () => {
    engine.input('s');
    expect(engine.getComposing()).toBe('ስ');

    engine.input('e');
    expect(engine.getComposing()).toBe('ሰ');

    // First backspace: removes 'e' -> re-renders 's' as 'ስ'
    let res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: 'ስ' });

    // Second backspace: removes 's' -> buffer empty
    res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: '' });

    // Third backspace on empty buffer: no-op
    res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: '' });
  });

  it('handles backspace on labialized syllables (ኋ -> ሁ -> ህ -> empty)', () => {
    engine.input('h');
    expect(engine.getComposing()).toBe('ህ');

    engine.input('u');
    expect(engine.getComposing()).toBe('ሁ');

    engine.input('a');
    expect(engine.getComposing()).toBe('ኋ');

    let res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: 'ሁ' });

    res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: 'ህ' });

    res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: '' });
  });

  it('handles digraphs composing and backspace (ሽ -> ስ -> empty)', () => {
    engine.input('s');
    expect(engine.getComposing()).toBe('ስ');

    engine.input('h');
    expect(engine.getComposing()).toBe('ሽ');

    let res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: 'ስ' });

    res = engine.backspace();
    expect(res).toEqual({ committed: '', composing: '' });
  });

  it('resets buffer properly on reset()', () => {
    engine.input('s');
    engine.input('e');
    expect(engine.getComposing()).toBe('ሰ');

    engine.reset();
    expect(engine.getComposing()).toBe('');
    expect(engine.getBuffer()).toBe('');
  });

  it('commits current buffer on commitCurrent()', () => {
    engine.input('h');
    engine.input('u');
    engine.input('a');
    expect(engine.getComposing()).toBe('ኋ');

    const committed = engine.commitCurrent();
    expect(committed).toBe('ኋ');
    expect(engine.getComposing()).toBe('');
  });

  it('handles punctuation and commit behavior', () => {
    engine.input('s');
    engine.input('e');
    const res = engine.input(',');
    expect(res).toEqual({ committed: 'ሰ፣', composing: '' });
  });

  it('passes through special characters cleanly without losing composing text', () => {
    engine.input('h');
    engine.input('a');
    const res = engine.input('!');
    expect(res).toEqual({ committed: 'ሃ!', composing: '' });

    const paren = engine.input('(2026)');
    expect(paren).toEqual({ committed: '(2026)', composing: '' });
  });

  it('supports Ethiopic digits when convertDigits is enabled', () => {
    const digitEngine = new LiveTypingEngine({ convertDigits: true });
    expect(digitEngine.input('1')).toEqual({ committed: '', composing: '፩' });
    expect(digitEngine.input('2')).toEqual({ committed: '', composing: '፲፪' });
    expect(digitEngine.backspace()).toEqual({ committed: '', composing: '፩' });
    expect(digitEngine.input('0')).toEqual({ committed: '', composing: '፲' });
    expect(digitEngine.input('0')).toEqual({ committed: '', composing: '፻' });
    expect(digitEngine.input(' ')).toEqual({ committed: '፻ ', composing: '' });

    const yearEngine = new LiveTypingEngine({ convertDigits: true });
    yearEngine.input('2026');
    expect(yearEngine.getText()).toBe('፳፻፳፮');
  });
});
