import Foundation

/// Live typing engine for real-time Amharic transliteration.
///
/// Keeps an internal buffer of Latin keystrokes representing the current
/// composing syllable, rendering the Ethiopic character dynamically.
/// When a syllable completes or the user enters a non-binding character,
/// previous syllables are committed.
public final class LiveTypingEngine {
    private var rules: CompiledRules
    private var buffer: String = ""
    private var fullCommitted: String = ""

    public init(options: TransliterationOptions? = nil) {
        self.rules = buildCompiledRules(options: options)
    }

    /// Feed a character or string of keystrokes into the engine.
    ///
    /// - Parameter char: Single keystroke or multi-character string.
    /// - Returns: Result containing any newly committed text and the current composing text.
    @discardableResult
    public func input(_ char: String) -> EngineResult {
        guard !char.isEmpty else {
            return EngineResult(committed: "", composing: getComposing())
        }

        if char.count > 1 {
            var totalCommitted = ""
            for ch in char {
                let res = inputSingle(ch)
                totalCommitted += res.committed
            }
            return EngineResult(committed: totalCommitted, composing: getComposing())
        }

        return inputSingle(char.first!)
    }

    private func inputSingle(_ char: Character) -> EngineResult {
        let escapeChar = rules.escapeChar

        // 1. Escape character (e.g. apostrophe)
        if char == escapeChar {
            if !buffer.isEmpty {
                let committedText = renderBuffer(buffer) ?? buffer
                buffer = ""
                fullCommitted += committedText
                return EngineResult(committed: committedText, composing: "")
            }
            return EngineResult(committed: "", composing: "")
        }

        // 2. Whitespace / newline / tab commits current buffer + whitespace
        if char == " " || char == "\n" || char == "\r" || char == "\t" {
            let pending = !buffer.isEmpty ? (renderBuffer(buffer) ?? buffer) : ""
            buffer = ""
            let committed = pending + String(char)
            fullCommitted += committed
            return EngineResult(committed: committed, composing: "")
        }

        // 3. Punctuation
        if let ethPunct = rules.punctuation[char] {
            let pending = !buffer.isEmpty ? (renderBuffer(buffer) ?? buffer) : ""
            buffer = ""
            let committed = pending + ethPunct
            fullCommitted += committed
            return EngineResult(committed: committed, composing: "")
        }

        // 4. Digits
        if let digit = rules.digits[char] {
            let pending = !buffer.isEmpty ? (renderBuffer(buffer) ?? buffer) : ""
            buffer = ""
            let committed = pending + digit
            fullCommitted += committed
            return EngineResult(committed: committed, composing: "")
        }

        // 5. Latin letter input
        let candidate = buffer + String(char)
        if let candidateRender = renderBuffer(candidate) {
            buffer = candidate
            return EngineResult(committed: "", composing: candidateRender)
        }

        // Candidate does NOT form a valid continuation.
        // Commit current buffer, then check if char starts a new syllable.
        let committedFromPrev = !buffer.isEmpty ? (renderBuffer(buffer) ?? buffer) : ""
        fullCommitted += committedFromPrev

        if let singleRender = renderBuffer(String(char)) {
            buffer = String(char)
            return EngineResult(committed: committedFromPrev, composing: singleRender)
        }

        // Character doesn't map to any Ethiopic syllable: pass through as committed
        buffer = ""
        let committed = committedFromPrev + String(char)
        fullCommitted += committed
        return EngineResult(committed: committed, composing: "")
    }

    /// Backspace: removes the last Latin keystroke from the buffer
    /// and re-renders the composing text (e.g. ሰ -> ስ -> empty).
    public func backspace() -> EngineResult {
        if buffer.isEmpty {
            return EngineResult(committed: "", composing: "")
        }

        buffer.removeLast()
        if buffer.isEmpty {
            return EngineResult(committed: "", composing: "")
        }

        let composing = renderBuffer(buffer) ?? ""
        return EngineResult(committed: "", composing: composing)
    }

    /// Resets the engine buffer (clears composing text).
    /// Call on cursor move, blur, focus change, or escape.
    public func reset() {
        buffer = ""
    }

    /// Commits whatever is currently in the composing buffer and returns it.
    @discardableResult
    public func commitCurrent() -> String {
        if buffer.isEmpty {
            return ""
        }
        let committed = renderBuffer(buffer) ?? ""
        buffer = ""
        fullCommitted += committed
        return committed
    }

    /// Returns current composing text without modifying engine state.
    public func getComposing() -> String {
        if buffer.isEmpty {
            return ""
        }
        return renderBuffer(buffer) ?? ""
    }

    /// Returns the internal Latin buffer currently composing.
    public func getBuffer() -> String {
        return buffer
    }

    /// Returns the entire accumulated text (committed so far + current composing).
    public func getText() -> String {
        return fullCommitted + getComposing()
    }

    /// Helper to render a candidate buffer into an Ethiopic character, or nil if invalid.
    private func renderBuffer(_ buf: String) -> String? {
        guard !buf.isEmpty else { return nil }

        // 1. Match longest consonant
        for cKey in rules.sortedConsonantKeys {
            if buf.hasPrefix(cKey) {
                guard let meta = rules.consonants[cKey] else { continue }
                let remainder = String(buf.dropFirst(cKey.count))

                if remainder.isEmpty {
                    // Consonant alone -> 6th order (ሳድስ)
                    return getEthiopicChar(meta: meta, order: .sades)
                }

                // Remainder must match a vowel
                for vKey in rules.sortedVowelKeys {
                    if remainder == vKey {
                        if let order = rules.vowelMap[vKey], let char = getEthiopicChar(meta: meta, order: order) {
                            return char
                        }
                    }
                }

                return nil
            }
        }

        // 2. Pharyngeal lone vowels (ዐ row)
        for pKey in rules.sortedPharyngealKeys {
            if buf == pKey {
                return rules.pharyngealVowels[pKey]
            }
        }

        // 3. Lone vowels (አ row)
        for lKey in rules.sortedLoneVowelKeys {
            if buf == lKey {
                return rules.loneVowels[lKey]
            }
        }

        return nil
    }
}
