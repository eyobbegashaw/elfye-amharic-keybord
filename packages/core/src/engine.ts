import { EngineResult, EthiopicOrder, TransliterationOptions } from './types.js';
import { buildCompiledRules, getEthiopicChar, CompiledRules } from './table.js';

/**
 * Live typing engine for real-time Amharic transliteration.
 *
 * Keeps an internal buffer of Latin keystrokes representing the current
 * composing syllable, rendering the Ethiopic character dynamically.
 * When a syllable completes or the user enters a non-binding character,
 * previous syllables are committed.
 */
export class LiveTypingEngine {
  private rules: CompiledRules;
  private buffer: string = '';
  private fullCommitted: string = '';

  constructor(options?: TransliterationOptions) {
    this.rules = buildCompiledRules(options);
  }

  /**
   * Feed a single character or keystroke into the engine.
   *
   * @param char Keystroke character.
   * @returns Newly committed string and current composing string.
   */
  public input(char: string): EngineResult {
    if (!char) {
      return { committed: '', composing: this.getComposing() };
    }

    // Handle string with multiple characters by feeding them sequentially
    if (char.length > 1) {
      let totalCommitted = '';
      for (const ch of char) {
        const res = this.inputSingle(ch);
        totalCommitted += res.committed;
      }
      return { committed: totalCommitted, composing: this.getComposing() };
    }

    return this.inputSingle(char);
  }

  private inputSingle(char: string): EngineResult {
    const { escapeChar } = this.rules;

    // 1. Escape character (e.g. apostrophe)
    if (char === escapeChar) {
      if (this.buffer.length > 0) {
        // Commits current composing buffer and clears it
        const committedText = this.renderBuffer(this.buffer) ?? this.buffer;
        this.buffer = '';
        this.fullCommitted += committedText;
        return { committed: committedText, composing: '' };
      }
      // If buffer is empty, literal escape or boundary reset
      return { committed: '', composing: '' };
    }

    // 2. Whitespace / newline / tab commits current buffer + whitespace
    if (char === ' ' || char === '\n' || char === '\r' || char === '\t') {
      const pending = this.buffer.length > 0 ? (this.renderBuffer(this.buffer) ?? this.buffer) : '';
      this.buffer = '';
      const committed = pending + char;
      this.fullCommitted += committed;
      return { committed, composing: '' };
    }

    // 3. Punctuation
    if (this.rules.punctuation[char]) {
      const pending = this.buffer.length > 0 ? (this.renderBuffer(this.buffer) ?? this.buffer) : '';
      this.buffer = '';
      const ethPunct = this.rules.punctuation[char];
      const committed = pending + ethPunct;
      this.fullCommitted += committed;
      return { committed, composing: '' };
    }

    // 4. Digits
    if (this.rules.digits[char]) {
      const pending = this.buffer.length > 0 ? (this.renderBuffer(this.buffer) ?? this.buffer) : '';
      this.buffer = '';
      const digit = this.rules.digits[char];
      const committed = pending + digit;
      this.fullCommitted += committed;
      return { committed, composing: '' };
    }

    // 5. Latin letter input
    const candidate = this.buffer + char;
    const candidateRender = this.renderBuffer(candidate);

    if (candidateRender !== null) {
      // Candidate forms a valid syllable or composing prefix
      this.buffer = candidate;
      return { committed: '', composing: candidateRender };
    }

    // Candidate does NOT form a valid continuation of current buffer.
    // Commit the current buffer, then check if char starts a new syllable.
    const committedFromPrevious = this.buffer.length > 0 ? (this.renderBuffer(this.buffer) ?? this.buffer) : '';
    this.fullCommitted += committedFromPrevious;

    const singleRender = this.renderBuffer(char);
    if (singleRender !== null) {
      this.buffer = char;
      return { committed: committedFromPrevious, composing: singleRender };
    }

    // Character doesn't map to any Ethiopic syllable: pass it through directly as committed
    this.buffer = '';
    const committed = committedFromPrevious + char;
    this.fullCommitted += committed;
    return { committed, composing: '' };
  }

  /**
   * Backspace: removes the last Latin keystroke from the buffer
   * and re-renders the composing text (e.g. ሰ -> ስ -> empty).
   */
  public backspace(): EngineResult {
    if (this.buffer.length === 0) {
      return { committed: '', composing: '' };
    }

    this.buffer = this.buffer.slice(0, -1);
    if (this.buffer.length === 0) {
      return { committed: '', composing: '' };
    }

    const composing = this.renderBuffer(this.buffer) ?? '';
    return { committed: '', composing };
  }

  /**
   * Resets the engine buffer (clears composing text).
   * Call on cursor move, blur, focus change, or escape.
   */
  public reset(): void {
    this.buffer = '';
  }

  /**
   * Commits whatever is currently in the composing buffer and returns it.
   */
  public commitCurrent(): string {
    if (this.buffer.length === 0) {
      return '';
    }
    const committed = this.renderBuffer(this.buffer) ?? '';
    this.buffer = '';
    this.fullCommitted += committed;
    return committed;
  }

  /**
   * Returns current composing text without modifying state.
   */
  public getComposing(): string {
    if (this.buffer.length === 0) {
      return '';
    }
    return this.renderBuffer(this.buffer) ?? '';
  }

  /**
   * Returns the internal Latin buffer currently composing.
   */
  public getBuffer(): string {
    return this.buffer;
  }

  /**
   * Returns the entire accumulated text (committed so far + current composing).
   */
  public getText(): string {
    return this.fullCommitted + this.getComposing();
  }

  /**
   * Helper to render a candidate buffer into an Ethiopic character, or null if invalid.
   */
  private renderBuffer(buf: string): string | null {
    if (!buf) {
      return null;
    }

    // 1. Match longest consonant
    for (const cKey of this.rules.sortedConsonantKeys) {
      if (buf.startsWith(cKey)) {
        const meta = this.rules.consonants[cKey];
        const remainder = buf.slice(cKey.length);

        if (remainder === '') {
          // Consonant alone -> 6th order (ሳድስ)
          return getEthiopicChar(meta, EthiopicOrder.Sades);
        }

        // Remainder must match a vowel
        for (const vKey of this.rules.sortedVowelKeys) {
          if (remainder === vKey) {
            const order = this.rules.vowelMap[vKey];
            const char = getEthiopicChar(meta, order);
            if (char) {
              return char;
            }
          }
        }

        // If remainder is not a complete vowel match, it cannot be rendered as a single syllable
        return null;
      }
    }

    // 2. Pharyngeal lone vowels (ዐ row)
    for (const pKey of this.rules.sortedPharyngealKeys) {
      if (buf === pKey) {
        return this.rules.pharyngealVowels[pKey];
      }
    }

    // 3. Lone vowels (አ row)
    for (const lKey of this.rules.sortedLoneVowelKeys) {
      if (buf === lKey) {
        return this.rules.loneVowels[lKey];
      }
    }

    return null;
  }
}
