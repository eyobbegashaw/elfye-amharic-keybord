#pragma once

#include <string>
#include <string_view>
#include <vector>
#include <cstdint>

namespace Amharic {

enum class EthiopicOrder : int {
    GEEZ = 0,   // 1st (e)
    KAEB = 1,   // 2nd (u)
    SALES = 2,  // 3rd (i)
    RABE = 3,   // 4th (a)
    HAMES = 4,  // 5th (ie)
    SADES = 5,  // 6th (consonant alone)
    SABE = 6,   // 7th (o)
    LABIAL = 7  // 8th (ua/wa)
};

struct TransliterationOptions {
    char escapeChar = '\'';
    bool convertPunctuation = true;
    bool convertDigits = false;
    bool allowWaForLabial = true;
};

struct EngineResult {
    std::string committed;
    std::string composing;
};

struct EngineResultW {
    std::wstring committed;
    std::wstring composing;
};

// String conversion helpers
std::wstring Utf8ToUtf16(std::string_view utf8);
std::string Utf16ToUtf8(std::wstring_view utf16);
std::string EncodeUtf8(uint32_t codepoint);
std::wstring EncodeUtf16(uint32_t codepoint);

// Pure transliteration function
std::string Transliterate(std::string_view input, const TransliterationOptions& options = {});
std::wstring TransliterateW(std::wstring_view input, const TransliterationOptions& options = {});

// Live typing engine for IME preedit & progressive composition
class LiveTypingEngine {
public:
    explicit LiveTypingEngine(TransliterationOptions options = {});

    // UTF-8 input
    EngineResult Input(std::string_view text);
    EngineResult Input(char ch);

    // UTF-16 input (convenient for Windows TSF / Win32)
    EngineResultW InputW(wchar_t ch);
    EngineResultW InputW(std::wstring_view text);

    // Backspace: progressive backspace if composing, or empty if not
    EngineResult Backspace();
    EngineResultW BackspaceW();

    // Reset buffer (on space, cursor movement, focus change)
    void Reset();

    // Commit current buffer and clear
    std::string CommitCurrent();
    std::wstring CommitCurrentW();

    // Composing & buffer inspection
    std::string GetComposing() const;
    std::wstring GetComposingW() const;
    const std::string& GetBuffer() const { return m_buffer; }
    bool IsComposing() const { return !m_buffer.empty(); }

    const TransliterationOptions& GetOptions() const { return m_options; }
    void SetOptions(const TransliterationOptions& opts) { m_options = opts; }

private:
    std::string m_buffer;
    TransliterationOptions m_options;

    std::string ComputeComposing(const std::string& buf) const;
};

} // namespace Amharic
