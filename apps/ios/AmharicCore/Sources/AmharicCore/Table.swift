import Foundation

/// Returns the Ethiopic character for a given consonant meta and vowel order.
public func getEthiopicChar(meta: ConsonantMeta, order: EthiopicOrder) -> String? {
    if order == .labial {
        guard meta.hasLabial else { return nil }
        if let overrideCode = meta.labialOverride, let scalar = UnicodeScalar(overrideCode) {
            return String(scalar)
        }
        if let scalar = UnicodeScalar(meta.base + 7) {
            return String(scalar)
        }
        return nil
    }

    if let scalar = UnicodeScalar(meta.base + UInt32(order.rawValue)) {
        return String(scalar)
    }
    return nil
}

/// Precompiled rules for high-performance transliteration matching.
public struct CompiledRules: Sendable {
    public let consonants: [String: ConsonantMeta]
    public let sortedConsonantKeys: [String]
    public let vowelMap: [String: EthiopicOrder]
    public let sortedVowelKeys: [String]
    public let loneVowels: [String: String]
    public let sortedLoneVowelKeys: [String]
    public let pharyngealVowels: [String: String]
    public let sortedPharyngealKeys: [String]
    public let punctuation: [Character: String]
    public let digits: [Character: String]
    public let escapeChar: Character

    public init(
        consonants: [String: ConsonantMeta],
        sortedConsonantKeys: [String],
        vowelMap: [String: EthiopicOrder],
        sortedVowelKeys: [String],
        loneVowels: [String: String],
        sortedLoneVowelKeys: [String],
        pharyngealVowels: [String: String],
        sortedPharyngealKeys: [String],
        punctuation: [Character: String],
        digits: [Character: String],
        escapeChar: Character
    ) {
        self.consonants = consonants
        self.sortedConsonantKeys = sortedConsonantKeys
        self.vowelMap = vowelMap
        self.sortedVowelKeys = sortedVowelKeys
        self.loneVowels = loneVowels
        self.sortedLoneVowelKeys = sortedLoneVowelKeys
        self.pharyngealVowels = pharyngealVowels
        self.sortedPharyngealKeys = sortedPharyngealKeys
        self.punctuation = punctuation
        self.digits = digits
        self.escapeChar = escapeChar
    }
}

/// Compiles transliteration rules from the specified options with defaults.
public func buildCompiledRules(options: TransliterationOptions? = nil) -> CompiledRules {
    let opts = options ?? TransliterationOptions()

    // 1. Consonants
    var consonants = CONSONANT_DEFINITIONS
    if let custom = opts.customConsonants {
        for (k, v) in custom {
            consonants[k] = v
        }
    }

    let sortedConsonantKeys = consonants.keys.sorted { (a, b) -> Bool in
        if a.count != b.count {
            return a.count > b.count
        }
        return a < b
    }

    // 2. Vowels
    var vowelMap: [String: EthiopicOrder] = [:]
    for item in VOWEL_TOKENS {
        vowelMap[item.token] = item.order
    }

    if opts.allowWaForLabial {
        vowelMap["wa"] = .labial
    }

    if opts.enableSeraAliases {
        vowelMap["ee"] = .hames
        vowelMap["E"] = .hames
    }

    if let customV = opts.customVowels {
        for (k, v) in customV {
            vowelMap[k] = v
        }
    }

    let sortedVowelKeys = vowelMap.keys.sorted { (a, b) -> Bool in
        if a.count != b.count {
            return a.count > b.count
        }
        return a < b
    }

    // 3. Lone vowels
    let loneVowels = LONE_VOWELS
    let sortedLoneVowelKeys = loneVowels.keys.sorted { (a, b) -> Bool in
        if a.count != b.count {
            return a.count > b.count
        }
        return a < b
    }

    // 4. Pharyngeal vowels
    let pharyngealVowels = PHARYNGEAL_VOWELS
    let sortedPharyngealKeys = pharyngealVowels.keys.sorted { (a, b) -> Bool in
        if a.count != b.count {
            return a.count > b.count
        }
        return a < b
    }

    // 5. Punctuation
    let punctuation: [Character: String] = opts.convertPunctuation ? PUNCTUATION_MAP : [:]

    // 6. Digits
    let digits: [Character: String] = opts.convertDigits ? ETHIOPIC_DIGITS : [:]

    return CompiledRules(
        consonants: consonants,
        sortedConsonantKeys: sortedConsonantKeys,
        vowelMap: vowelMap,
        sortedVowelKeys: sortedVowelKeys,
        loneVowels: loneVowels,
        sortedLoneVowelKeys: sortedLoneVowelKeys,
        pharyngealVowels: pharyngealVowels,
        sortedPharyngealKeys: sortedPharyngealKeys,
        punctuation: punctuation,
        digits: digits,
        escapeChar: opts.escapeChar
    )
}
