import Foundation

/// Represents the 8 vowel orders in Ethiopic / Ge'ez script.
public enum EthiopicOrder: Int, CaseIterable, Sendable {
    case geEz = 0    // 1st: ግዕዝ (e)
    case kaEb = 1    // 2nd: ካዕብ (u)
    case sales = 2   // 3rd: ሣልስ (i)
    case rabe = 3    // 4th: ራብዕ (a)
    case hames = 4   // 5th: ኃምስ (ie)
    case sades = 5   // 6th: ሳድስ (consonant alone / sixth form)
    case sabe = 6    // 7th: ሳብዕ (o)
    case labial = 7  // 8th: ራብዕ ዘካዕብ / labialized (ua)
}

/// Result returned by LiveTypingEngine on each input or backspace event.
public struct EngineResult: Equatable, Sendable {
    /// Newly committed text that should be permanently written to the document.
    public let committed: String

    /// The current composing (pending) text undergoing composition.
    public let composing: String

    public init(committed: String, composing: String) {
        self.committed = committed
        self.composing = composing
    }
}

/// Metadata for an Ethiopic consonant row.
public struct ConsonantMeta: Equatable, Sendable {
    public let base: UInt32
    public let hasLabial: Bool
    public let labialOverride: UInt32?

    public init(base: UInt32, hasLabial: Bool = true, labialOverride: UInt32? = nil) {
        self.base = base
        self.hasLabial = hasLabial
        self.labialOverride = labialOverride
    }
}

/// Configuration options for the transliteration engine.
public struct TransliterationOptions: Sendable {
    /// Character used to break digraphs and syllable grouping (e.g. "s'h" -> "ስህ" instead of "ሽ").
    public var escapeChar: Character

    /// Whether to convert Latin punctuation (',', '.', ';', ':') to Ethiopic punctuation ('፣', '።', '፤', '፡').
    public var convertPunctuation: Bool

    /// Whether to convert Arabic digits (1, 2, 3...) to Ethiopic numerals (፩, ፪, ፫...).
    public var convertDigits: Bool

    /// Allow "wa" as an alias for "ua" in labialized syllables (e.g. "kwa" -> "ኳ").
    public var allowWaForLabial: Bool

    /// Allow SERA style aliases (e.g. "ee" or "E" for 5th order ኃምስ).
    public var enableSeraAliases: Bool

    /// Custom consonant mappings to override or extend defaults.
    public var customConsonants: [String: ConsonantMeta]?

    /// Custom vowel / order overrides.
    public var customVowels: [String: EthiopicOrder]?

    public init(
        escapeChar: Character = "'",
        convertPunctuation: Bool = true,
        convertDigits: Bool = false,
        allowWaForLabial: Bool = true,
        enableSeraAliases: Bool = false,
        customConsonants: [String: ConsonantMeta]? = nil,
        customVowels: [String: EthiopicOrder]? = nil
    ) {
        self.escapeChar = escapeChar
        self.convertPunctuation = convertPunctuation
        self.convertDigits = convertDigits
        self.allowWaForLabial = allowWaForLabial
        self.enableSeraAliases = enableSeraAliases
        self.customConsonants = customConsonants
        self.customVowels = customVowels
    }
}
