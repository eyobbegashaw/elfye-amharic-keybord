/**
 * Configuration options for the transliteration engine.
 */
export interface TransliterationOptions {
  /**
   * Character used to break digraphs and syllable grouping (e.g. "s'h" -> "ስህ" instead of "ሽ").
   * Default: "'" (single quote / apostrophe).
   */
  escapeChar?: string;

  /**
   * Whether to transliterate Latin punctuation to Ethiopic punctuation:
   * ',' -> '፣', '.' -> '።', ';' -> '፤', ':' -> '፡'
   * Default: true.
   */
  convertPunctuation?: boolean;

  /**
   * Whether to convert Arabic numerals (1, 2, 3...) to Ethiopic numerals (፩, ፪, ፫...).
   * Default: false (digits remain Latin by default).
   */
  convertDigits?: boolean;

  /**
   * Custom consonant mappings to override or extend defaults.
   * Key: Latin consonant token (e.g. "h", "sh", "Ts", "x").
   * Value: Ethiopic base code point or array of 8 syllable characters.
   */
  customConsonants?: Record<string, number | string[]>;

  /**
   * Custom vowel / order overrides.
   */
  customVowels?: Record<string, number>;

  /**
   * Custom irregular labialized overrides (e.g. "hua" -> "ኋ").
   */
  customLabialized?: Record<string, string>;

  /**
   * Allow "wa" as an alias for "ua" in labialized syllables (e.g. "kwa" -> "ኳ").
   * Default: true.
   */
  allowWaForLabial?: boolean;

  /**
   * Allow SERA style aliases (e.g. "ee" or "E" for 5th order ኃምስ).
   * Default: false.
   */
  enableSeraAliases?: boolean;
}

/**
 * Result returned by the LiveTypingEngine on each input or backspace event.
 */
export interface EngineResult {
  /**
   * Any newly committed text that should be permanently written to the output.
   */
  committed: string;

  /**
   * The current composing (pending) text undergoing composition.
   */
  composing: string;
}

/**
 * Represents the 8 vowel orders in Ethiopic / Ge'ez script.
 */
export enum EthiopicOrder {
  GeEz = 0,    // 1st: ግዕዝ (e)
  KaEb = 1,    // 2nd: ካዕብ (u)
  Sales = 2,   // 3rd: ሣልስ (i)
  Rabe = 3,    // 4th: ራብዕ (a)
  Hames = 4,   // 5th: ኃምስ (ie)
  Sades = 5,   // 6th: ሳድስ (consonant alone / sixth form)
  Sabe = 6,    // 7th: ሳብዕ (o)
  Labial = 7,  // 8th: ራብዕ ዘካዕብ / labialized (ua)
}
