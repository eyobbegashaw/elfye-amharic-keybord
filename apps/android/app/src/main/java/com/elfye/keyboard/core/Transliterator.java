package com.elfye.keyboard.core;

/**
 * Pure string transliterator from Latin to Ethiopic using greedy longest match.
 */
public final class Transliterator {

    private Transliterator() {}

    public static String transliterate(String input) {
        return transliterate(input, new TransliterationOptions());
    }

    public static String transliterate(String input, TransliterationOptions options) {
        if (input == null || input.isEmpty()) {
            return "";
        }
        AmharicTable table = new AmharicTable(options);
        return transliterateWithTable(input, table);
    }

    public static String transliterateWithTable(String input, AmharicTable table) {
        StringBuilder result = new StringBuilder(input.length());
        int i = 0;
        int len = input.length();
        char escapeChar = table.escapeChar;

        while (i < len) {
            char ch = input.charAt(i);

            // 1. Double escape -> literal escapeChar
            if (ch == escapeChar && i + 1 < len && input.charAt(i + 1) == escapeChar) {
                result.append(escapeChar);
                i += 2;
                continue;
            }

            // 2. Standalone escape -> boundary reset
            if (ch == escapeChar) {
                i++;
                continue;
            }

            // 3. Punctuation
            String punct = table.punctuation.get(ch);
            if (punct != null) {
                result.append(punct);
                i++;
                continue;
            }

            // 4. Digits
            String digit = table.digits.get(ch);
            if (digit != null) {
                result.append(digit);
                i++;
                continue;
            }

            // 5. Consonants (greedy longest match)
            String matchedConsonant = null;
            for (String cKey : table.sortedConsonantKeys) {
                if (input.startsWith(cKey, i)) {
                    matchedConsonant = cKey;
                    break;
                }
            }

            if (matchedConsonant != null) {
                int cLen = matchedConsonant.length();
                AmharicTable.ConsonantMeta meta = table.consonants.get(matchedConsonant);

                // Immediately followed by escapeChar -> emit 6th order (Sades)
                if (i + cLen < len && input.charAt(i + cLen) == escapeChar) {
                    String sixth = AmharicTable.getEthiopicChar(meta, AmharicTable.EthiopicOrder.SADES);
                    result.append(sixth != null ? sixth : matchedConsonant);
                    i += cLen + 1;
                    continue;
                }

                // Check for vowel suffix
                String matchedVowel = null;
                AmharicTable.EthiopicOrder matchedOrder = null;
                for (String vKey : table.sortedVowelKeys) {
                    if (input.startsWith(vKey, i + cLen)) {
                        matchedVowel = vKey;
                        matchedOrder = table.vowelMap.get(vKey);
                        break;
                    }
                }

                if (matchedVowel != null && matchedOrder != null) {
                    String ethChar = AmharicTable.getEthiopicChar(meta, matchedOrder);
                    if (ethChar != null) {
                        result.append(ethChar);
                        i += cLen + matchedVowel.length();
                        continue;
                    }
                    // Fallback if consonant has no 8th labial form (e.g. w, y, H)
                    String sixth = AmharicTable.getEthiopicChar(meta, AmharicTable.EthiopicOrder.SADES);
                    result.append(sixth != null ? sixth : matchedConsonant);
                    i += cLen;
                    continue;
                }

                // No vowel suffix -> 6th order (Sades)
                String sixth = AmharicTable.getEthiopicChar(meta, AmharicTable.EthiopicOrder.SADES);
                result.append(sixth != null ? sixth : matchedConsonant);
                i += cLen;
                continue;
            }

            // 6. Pharyngeal lone vowels (A, U, I, E, O, AA, Aa, Aie, EE, Ie)
            String matchedPharyngeal = null;
            for (String pKey : table.sortedPharyngealKeys) {
                if (input.startsWith(pKey, i)) {
                    matchedPharyngeal = pKey;
                    break;
                }
            }
            if (matchedPharyngeal != null) {
                result.append(table.pharyngealVowels.get(matchedPharyngeal));
                i += matchedPharyngeal.length();
                continue;
            }

            // 7. Standard lone vowels (a, u, i, e, o, ie, aa, ea)
            String matchedLone = null;
            for (String lKey : table.sortedLoneVowelKeys) {
                if (input.startsWith(lKey, i)) {
                    matchedLone = lKey;
                    break;
                }
            }
            if (matchedLone != null) {
                result.append(table.loneVowels.get(matchedLone));
                i += matchedLone.length();
                continue;
            }

            // 8. Unmapped character pass-through
            result.append(ch);
            i++;
        }

        return result.toString();
    }
}
