import { EthiopicOrder, TransliterationOptions } from './types.js';
import {
  CONSONANT_DEFINITIONS,
  ConsonantMeta,
  LONE_VOWELS,
  PHARYNGEAL_VOWELS,
  PUNCTUATION_MAP,
  ETHIOPIC_DIGITS,
  VOWEL_TOKENS,
} from './constants.js';

export interface CompiledRules {
  consonants: Record<string, ConsonantMeta | string[]>;
  sortedConsonantKeys: string[];
  vowelMap: Record<string, EthiopicOrder>;
  sortedVowelKeys: string[];
  loneVowels: Record<string, string>;
  sortedLoneVowelKeys: string[];
  pharyngealVowels: Record<string, string>;
  sortedPharyngealKeys: string[];
  punctuation: Record<string, string>;
  digits: Record<string, string>;
  escapeChar: string;
}

/**
 * Returns the Ethiopic character for a given consonant and vowel order.
 */
export function getEthiopicChar(
  meta: ConsonantMeta | string[],
  order: EthiopicOrder,
): string | null {
  if (Array.isArray(meta)) {
    return meta[order] ?? null;
  }

  // 8th column (labialized)
  if (order === EthiopicOrder.Labial) {
    if (!meta.hasLabial) {
      return null;
    }
    if (meta.labialOverride !== undefined) {
      return String.fromCodePoint(meta.labialOverride);
    }
    return String.fromCodePoint(meta.base + 7);
  }

  // 1st through 7th orders: consecutive from base
  // 1st (e): base + 0
  // 2nd (u): base + 1
  // 3rd (i): base + 2
  // 4th (a): base + 3
  // 5th (ie): base + 4
  // 6th (sixth): base + 5
  // 7th (o): base + 6
  return String.fromCodePoint(meta.base + order);
}

/**
 * Compile rules from options with defaults.
 */
export function buildCompiledRules(options?: TransliterationOptions): CompiledRules {
  const consonants: Record<string, ConsonantMeta | string[]> = {
    ...CONSONANT_DEFINITIONS,
  };

  if (options?.customConsonants) {
    for (const [key, val] of Object.entries(options.customConsonants)) {
      if (typeof val === 'number') {
        consonants[key] = { base: val, hasLabial: true };
      } else {
        consonants[key] = val;
      }
    }
  }

  // Sort consonants longest first (e.g. 'sh', 'ch', 'gn', 'kh', 'zh', 'ts', 'Ts' before 's', 'c', 't'...)
  const sortedConsonantKeys = Object.keys(consonants).sort(
    (a, b) => b.length - a.length || a.localeCompare(b),
  );

  // Vowel map
  const vowelMap: Record<string, EthiopicOrder> = {};
  for (const item of VOWEL_TOKENS) {
    vowelMap[item.token] = item.order;
  }

  // Optional "wa" alias for labialized "ua"
  if (options?.allowWaForLabial !== false) {
    vowelMap['wa'] = EthiopicOrder.Labial;
  }

  // Optional SERA-style aliases
  if (options?.enableSeraAliases) {
    vowelMap['ee'] = EthiopicOrder.Hames; // 5th order
    vowelMap['E'] = EthiopicOrder.Hames;  // 5th order
  }

  if (options?.customVowels) {
    for (const [v, ord] of Object.entries(options.customVowels)) {
      vowelMap[v] = ord;
    }
  }

  const sortedVowelKeys = Object.keys(vowelMap).sort(
    (a, b) => b.length - a.length || a.localeCompare(b),
  );

  // Lone vowels
  const loneVowels: Record<string, string> = { ...LONE_VOWELS };
  const sortedLoneVowelKeys = Object.keys(loneVowels).sort(
    (a, b) => b.length - a.length || a.localeCompare(b),
  );

  // Pharyngeal lone vowels
  const pharyngealVowels: Record<string, string> = { ...PHARYNGEAL_VOWELS };
  const sortedPharyngealKeys = Object.keys(pharyngealVowels).sort(
    (a, b) => b.length - a.length || a.localeCompare(b),
  );

  // Punctuation
  const punctuation: Record<string, string> =
    options?.convertPunctuation !== false ? { ...PUNCTUATION_MAP } : {};

  // Digits
  const digits: Record<string, string> =
    options?.convertDigits ? { ...ETHIOPIC_DIGITS } : {};

  return {
    consonants,
    sortedConsonantKeys,
    vowelMap,
    sortedVowelKeys,
    loneVowels,
    sortedLoneVowelKeys,
    pharyngealVowels,
    sortedPharyngealKeys,
    punctuation,
    digits,
    escapeChar: options?.escapeChar ?? "'",
  };
}
