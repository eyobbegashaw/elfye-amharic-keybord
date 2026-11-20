import Foundation

/// Pure function to transliterate an entire string from Latin to Ethiopic (Amharic)
/// based on the Addiyon phonetic keyboard scheme.
///
/// - Parameters:
///   - input: The Latin text string to transliterate.
///   - options: Optional transliteration configuration.
/// - Returns: The transliterated Amharic string.
public func transliterate(_ input: String, options: TransliterationOptions? = nil) -> String {
    guard !input.isEmpty else { return "" }
    let rules = buildCompiledRules(options: options)
    return transliterate(input, rules: rules)
}

/// Transliterates input using precompiled rules for optimal performance.
public func transliterate(_ input: String, rules: CompiledRules) -> String {
    guard !input.isEmpty else { return "" }
    var result = ""
    var index = input.startIndex
    let end = input.endIndex
    let escapeChar = rules.escapeChar

    while index < end {
        let currentChar = input[index]

        // 1. Double escape character produces a literal escape character
        if currentChar == escapeChar {
            let nextIndex = input.index(after: index)
            if nextIndex < end && input[nextIndex] == escapeChar {
                result.append(escapeChar)
                index = input.index(after: nextIndex)
                continue
            }
            // 2. Standalone escape character: advances and resets boundary
            index = nextIndex
            continue
        }

        // 3. Punctuation
        if let punct = rules.punctuation[currentChar] {
            result.append(punct)
            index = input.index(after: index)
            continue
        }

        // 4. Digits
        if let digit = rules.digits[currentChar] {
            result.append(digit)
            index = input.index(after: index)
            continue
        }

        let remaining = input[index...]

        // 5. Try matching consonants (greedy longest match)
        var matchedConsonant: String? = nil
        for cKey in rules.sortedConsonantKeys {
            if remaining.hasPrefix(cKey) {
                matchedConsonant = cKey
                break
            }
        }

        if let cKey = matchedConsonant, let meta = rules.consonants[cKey] {
            let afterConsonant = input.index(index, offsetBy: cKey.count)

            // Check if immediately followed by escapeChar
            if afterConsonant < end && input[afterConsonant] == escapeChar {
                let sixthChar = getEthiopicChar(meta: meta, order: .sades) ?? cKey
                result.append(sixthChar)
                index = input.index(after: afterConsonant)
                continue
            }

            // Check for vowel suffix
            let remainingAfterConsonant = input[afterConsonant...]
            var matchedVowel: String? = nil
            var matchedOrder: EthiopicOrder? = nil

            for vKey in rules.sortedVowelKeys {
                if remainingAfterConsonant.hasPrefix(vKey) {
                    matchedVowel = vKey
                    matchedOrder = rules.vowelMap[vKey]
                    break
                }
            }

            if let vKey = matchedVowel, let order = matchedOrder {
                if let ethiopic = getEthiopicChar(meta: meta, order: order) {
                    result.append(ethiopic)
                    index = input.index(afterConsonant, offsetBy: vKey.count)
                    continue
                }
            }

            // No vowel matched or order unsupported: emit 6th order (sades)
            let sixthChar = getEthiopicChar(meta: meta, order: .sades) ?? cKey
            result.append(sixthChar)
            index = afterConsonant
            continue
        }

        // 6. Pharyngeal lone vowels (ዐ row) - greedy check
        var matchedPharyngeal: String? = nil
        for pKey in rules.sortedPharyngealKeys {
            if remaining.hasPrefix(pKey) {
                matchedPharyngeal = pKey
                break
            }
        }

        if let pKey = matchedPharyngeal, let ethiopic = rules.pharyngealVowels[pKey] {
            result.append(ethiopic)
            index = input.index(index, offsetBy: pKey.count)
            continue
        }

        // 7. Lone vowels (አ row) - greedy check
        var matchedLone: String? = nil
        for lKey in rules.sortedLoneVowelKeys {
            if remaining.hasPrefix(lKey) {
                matchedLone = lKey
                break
            }
        }

        if let lKey = matchedLone, let ethiopic = rules.loneVowels[lKey] {
            result.append(ethiopic)
            index = input.index(index, offsetBy: lKey.count)
            continue
        }

        // 8. Other characters pass through directly
        result.append(currentChar)
        index = input.index(after: index)
    }

    return result
}
