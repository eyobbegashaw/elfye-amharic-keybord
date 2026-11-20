import Foundation

public struct VowelToken: Sendable {
    public let token: String
    public let order: EthiopicOrder

    public init(token: String, order: EthiopicOrder) {
        self.token = token
        self.order = order
    }
}

/// Standard vowel tokens in Addiyon scheme. Longer tokens ordered first for greedy match.
public let VOWEL_TOKENS: [VowelToken] = [
    VowelToken(token: "ie", order: .hames),   // 5th (ኃምስ)
    VowelToken(token: "ua", order: .labial),  // 8th (ላብያል / ራብዕ ዘካዕብ)
    VowelToken(token: "e", order: .geEz),     // 1st (ግዕዝ)
    VowelToken(token: "u", order: .kaEb),     // 2nd (ካዕብ)
    VowelToken(token: "i", order: .sales),    // 3rd (ሣልስ)
    VowelToken(token: "a", order: .rabe),     // 4th (ራብዕ)
    VowelToken(token: "o", order: .sabe),     // 7th (ሳብዕ)
]

/// Consonant definition mappings according to Addiyon scheme.
public let CONSONANT_DEFINITIONS: [String: ConsonantMeta] = [
    // Trigraphs / Digraphs first
    "sh": ConsonantMeta(base: 0x1238, hasLabial: true),                          // ሸ..ሿ (0x123F)
    "ch": ConsonantMeta(base: 0x1278, hasLabial: true),                          // ቸ..ቿ (0x127F)
    "gn": ConsonantMeta(base: 0x1298, hasLabial: true),                          // ኘ..ኟ (0x129F)
    "kh": ConsonantMeta(base: 0x12B8, hasLabial: true, labialOverride: 0x12C3),  // ኸ..ዃ
    "zh": ConsonantMeta(base: 0x12E0, hasLabial: true),                          // ዠ..ዧ (0x12E7)
    "ts": ConsonantMeta(base: 0x1338, hasLabial: true),                          // ጸ..ጿ (0x133F)
    "Ts": ConsonantMeta(base: 0x1340, hasLabial: true),                          // ፀ..ፇ (0x1347)

    // Single letter consonants
    "h":  ConsonantMeta(base: 0x1200, hasLabial: true, labialOverride: 0x128B),  // ሀ..ኋ
    "l":  ConsonantMeta(base: 0x1208, hasLabial: true),                          // ለ..ሏ (0x120F)
    "H":  ConsonantMeta(base: 0x1210, hasLabial: false),                         // ሐ..ሖ (no 8th in chart)
    "m":  ConsonantMeta(base: 0x1218, hasLabial: true),                          // መ..ሟ (0x121F)
    "S":  ConsonantMeta(base: 0x1220, hasLabial: true),                          // ሠ..ሧ (0x1227)
    "r":  ConsonantMeta(base: 0x1228, hasLabial: true),                          // ረ..ሯ (0x122F)
    "s":  ConsonantMeta(base: 0x1230, hasLabial: true),                          // ሰ..ሷ (0x1237)
    "q":  ConsonantMeta(base: 0x1240, hasLabial: true, labialOverride: 0x124B),  // ቀ..ቋ
    "b":  ConsonantMeta(base: 0x1260, hasLabial: true),                          // በ..ቧ (0x1267)
    "v":  ConsonantMeta(base: 0x1268, hasLabial: true),                          // ቨ..ቯ (0x126F)
    "t":  ConsonantMeta(base: 0x1270, hasLabial: true),                          // ተ..ቷ (0x1277)
    "c":  ConsonantMeta(base: 0x1278, hasLabial: true),                          // shortcut for ቸ
    "n":  ConsonantMeta(base: 0x1290, hasLabial: true),                          // ነ..ኗ (0x1297)
    "k":  ConsonantMeta(base: 0x12A8, hasLabial: true, labialOverride: 0x12B3),  // ከ..ኳ
    "w":  ConsonantMeta(base: 0x12C8, hasLabial: false),                         // ወ..ዎ (no 8th in chart)
    "z":  ConsonantMeta(base: 0x12D8, hasLabial: true),                          // ዘ..ዟ (0x12DF)
    "y":  ConsonantMeta(base: 0x12E8, hasLabial: false),                         // የ..ዮ (no 8th in chart)
    "d":  ConsonantMeta(base: 0x12F0, hasLabial: true),                          // ደ..ዷ (0x12F7)
    "j":  ConsonantMeta(base: 0x1300, hasLabial: true),                          // ጀ..ጇ (0x1307)
    "g":  ConsonantMeta(base: 0x1308, hasLabial: true, labialOverride: 0x1313),  // ገ..ጓ
    "T":  ConsonantMeta(base: 0x1320, hasLabial: true),                          // ጠ..ጧ (0x1327)
    "C":  ConsonantMeta(base: 0x1328, hasLabial: true),                          // ጨ..ጯ (0x132F)
    "P":  ConsonantMeta(base: 0x1330, hasLabial: true),                          // ጰ..ጷ (0x1337)
    "f":  ConsonantMeta(base: 0x1348, hasLabial: true),                          // ፈ..ፏ (0x134F)
    "p":  ConsonantMeta(base: 0x1350, hasLabial: true),                          // ፐ..ፗ (0x1357)

    // ኀ row (standard Ge'ez homophone)
    "hh": ConsonantMeta(base: 0x1280, hasLabial: true, labialOverride: 0x128B),  // ኀ..ኋ
    "x":  ConsonantMeta(base: 0x1280, hasLabial: true, labialOverride: 0x128B),  // alternative alias for ኀ
]

/// Lone vowel row (አ row, base 0x12A0).
public let LONE_VOWELS: [String: String] = [
    "ie": "\u{12A4}", // ኤ
    "aa": "\u{12A3}", // ኣ (4th form of አ)
    "ea": "\u{12A7}", // ኧ (8th form of አ)
    "a":  "\u{12A0}", // አ
    "u":  "\u{12A1}", // ኡ
    "i":  "\u{12A2}", // ኢ
    "e":  "\u{12A5}", // እ
    "o":  "\u{12A6}", // ኦ
]

/// Pharyngeal lone vowel row (ዐ row, base 0x12D0).
public let PHARYNGEAL_VOWELS: [String: String] = [
    "Aie": "\u{12D4}", // ዔ
    "AA":  "\u{12D3}", // ዓ
    "Aa":  "\u{12D3}", // ዓ
    "EE":  "\u{12D4}", // ዔ
    "Ie":  "\u{12D4}", // ዔ
    "A":   "\u{12D0}", // ዐ
    "U":   "\u{12D1}", // ዑ
    "I":   "\u{12D2}", // ዒ
    "E":   "\u{12D5}", // ዕ
    "O":   "\u{12D6}", // ዖ
]

/// Ethiopic punctuation mapping.
public let PUNCTUATION_MAP: [Character: String] = [
    ",": "\u{1363}", // ፣ (Ethiopic comma)
    ".": "\u{1362}", // ። (Ethiopic full stop)
    ";": "\u{1364}", // ፤ (Ethiopic semicolon)
    ":": "\u{1361}", // ፡ (Ethiopic wordspace)
]

/// Ethiopic numeral conversion.
public let ETHIOPIC_DIGITS: [Character: String] = [
    "1": "\u{1369}", // ፩
    "2": "\u{136A}", // ፪
    "3": "\u{136B}", // ፫
    "4": "\u{136C}", // ፬
    "5": "\u{136D}", // ፭
    "6": "\u{136E}", // ፮
    "7": "\u{136F}", // ፯
    "8": "\u{1370}", // ፰
    "9": "\u{1371}", // ፱
]
