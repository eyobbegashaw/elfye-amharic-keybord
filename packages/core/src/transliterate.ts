import { EthiopicOrder, TransliterationOptions } from './types.js';
import { buildCompiledRules, getEthiopicChar, CompiledRules } from './table.js';
import { toGeezNumber } from './geezNumber.js';

/**
 * Pure function to transliterate an entire string from Latin to Ethiopic (Amharic)
 * based on the Addiyon phonetic keyboard scheme.
 *
 * @param input The Latin string to transliterate.
 * @param options Optional configuration overrides.
 * @returns The converted Ethiopic string.
 */
export function transliterate(input: string, options?: TransliterationOptions): string {
  if (!input) {
    return '';
  }

  const rules = buildCompiledRules(options);
  return transliterateWithRules(input, rules);
}

/**
 * Transliterates input using precompiled rules for optimal performance.
 */
export function transliterateWithRules(input: string, rules: CompiledRules): string {
  let result = '';
  let i = 0;
  const len = input.length;
  const { escapeChar } = rules;

  while (i < len) {
    // 1. Double escape character produces a literal escape character
    if (input[i] === escapeChar && i + 1 < len && input[i + 1] === escapeChar) {
      result += escapeChar;
      i += 2;
      continue;
    }

    // 2. Standalone escape character: advances and resets boundary
    if (input[i] === escapeChar) {
      i++;
      continue;
    }

    // 3. Punctuation
    const char = input[i];
    if (rules.punctuation[char]) {
      result += rules.punctuation[char];
      i++;
      continue;
    }

    // 4. Digits (convert contiguous ASCII digits into Ge'ez numerals when enabled)
    if (Object.keys(rules.digits).length > 0 && char >= '0' && char <= '9') {
      let end = i + 1;
      while (end < len && input[end] >= '0' && input[end] <= '9') {
        end++;
      }
      result += toGeezNumber(input.slice(i, end));
      i = end;
      continue;
    }

    // 5. Try matching consonants (greedy longest match)
    let matchedConsonant: string | null = null;
    for (const cKey of rules.sortedConsonantKeys) {
      if (input.startsWith(cKey, i)) {
        matchedConsonant = cKey;
        break;
      }
    }

    if (matchedConsonant !== null) {
      const cLen = matchedConsonant.length;
      const meta = rules.consonants[matchedConsonant];

      // Check if immediately followed by escapeChar
      if (i + cLen < len && input[i + cLen] === escapeChar) {
        // Consonant broken by escape: emit 6th order (Sades)
        const sixthChar = getEthiopicChar(meta, EthiopicOrder.Sades);
        result += sixthChar ?? matchedConsonant;
        i += cLen + 1; // skip consonant and escapeChar
        continue;
      }

      // Check for vowel suffix
      let matchedVowel: string | null = null;
      let matchedOrder: EthiopicOrder | null = null;

      for (const vKey of rules.sortedVowelKeys) {
        if (input.startsWith(vKey, i + cLen)) {
          matchedVowel = vKey;
          matchedOrder = rules.vowelMap[vKey];
          break;
        }
      }

      if (matchedVowel !== null && matchedOrder !== null) {
        const ethiopic = getEthiopicChar(meta, matchedOrder);
        if (ethiopic) {
          result += ethiopic;
          i += cLen + matchedVowel.length;
          continue;
        }
      }

      // No vowel matched or order not supported: emit 6th order (Sades)
      const sixthChar = getEthiopicChar(meta, EthiopicOrder.Sades);
      result += sixthChar ?? matchedConsonant;
      i += cLen;
      continue;
    }

    // 6. Pharyngeal lone vowels (ዐ row) - greedy check
    let matchedPharyngeal: string | null = null;
    for (const pKey of rules.sortedPharyngealKeys) {
      if (input.startsWith(pKey, i)) {
        matchedPharyngeal = pKey;
        break;
      }
    }

    if (matchedPharyngeal !== null) {
      result += rules.pharyngealVowels[matchedPharyngeal];
      i += matchedPharyngeal.length;
      continue;
    }

    // 7. Lone vowels (አ row) - greedy check
    let matchedLone: string | null = null;
    for (const lKey of rules.sortedLoneVowelKeys) {
      if (input.startsWith(lKey, i)) {
        matchedLone = lKey;
        break;
      }
    }

    if (matchedLone !== null) {
      result += rules.loneVowels[matchedLone];
      i += matchedLone.length;
      continue;
    }

    // 8. Other characters (whitespace, unmapped symbols) pass through
    result += input[i];
    i++;
  }

  return result;
}
