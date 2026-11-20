#include "AmharicCore.hpp"
#include <array>
#include <algorithm>
#include <stdexcept>
#include <cwctype>

#ifdef _WIN32
#include <windows.h>
#endif

namespace Amharic {

struct ConsonantMeta {
    std::string_view key;
    uint32_t base;
    bool hasLabial;
    uint32_t labialOverride;
};

struct VowelToken {
    std::string_view token;
    EthiopicOrder order;
};

struct DirectMapping {
    std::string_view key;
    uint32_t codepoint;
};

// Consonants ordered by length descending, then alphabetical for greedy matching
static const ConsonantMeta CONSONANTS[] = {
    // 2-character consonants
    { "sh", 0x1238, true,  0 },
    { "ch", 0x1278, true,  0 },
    { "gn", 0x1298, true,  0 },
    { "kh", 0x12B8, true,  0x12C3 },
    { "zh", 0x12E0, true,  0 },
    { "ts", 0x1338, true,  0 },
    { "Ts", 0x1340, true,  0 },
    { "hh", 0x1280, true,  0x128B },

    // 1-character consonants
    { "b",  0x1260, true,  0 },
    { "c",  0x1278, true,  0 },
    { "C",  0x1328, true,  0 },
    { "d",  0x12F0, true,  0 },
    { "f",  0x1348, true,  0 },
    { "g",  0x1308, true,  0x1313 },
    { "h",  0x1200, true,  0x128B },
    { "H",  0x1210, false, 0 },
    { "j",  0x1300, true,  0 },
    { "k",  0x12A8, true,  0x12B3 },
    { "l",  0x1208, true,  0 },
    { "m",  0x1218, true,  0 },
    { "n",  0x1290, true,  0 },
    { "p",  0x1350, true,  0 },
    { "P",  0x1330, true,  0 },
    { "q",  0x1240, true,  0x124B },
    { "r",  0x1228, true,  0 },
    { "s",  0x1230, true,  0 },
    { "S",  0x1220, true,  0 },
    { "t",  0x1270, true,  0 },
    { "T",  0x1320, true,  0 },
    { "v",  0x1268, true,  0 },
    { "w",  0x12C8, false, 0 },
    { "x",  0x1280, true,  0x128B },
    { "y",  0x12E8, false, 0 },
    { "z",  0x12D8, true,  0 }
};

// Vowel suffixes ordered by length descending
static const VowelToken VOWELS[] = {
    { "Aie", EthiopicOrder::HAMES },
    { "aie", EthiopicOrder::HAMES },
    { "ie",  EthiopicOrder::HAMES },
    { "ua",  EthiopicOrder::LABIAL },
    { "wa",  EthiopicOrder::LABIAL },
    { "e",   EthiopicOrder::GEEZ },
    { "u",   EthiopicOrder::KAEB },
    { "i",   EthiopicOrder::SALES },
    { "a",   EthiopicOrder::RABE },
    { "o",   EthiopicOrder::SABE }
};

// Pharyngeal vowels (ዐ row) ordered by length descending
static const DirectMapping PHARYNGEALS[] = {
    { "Aie", 0x12D4 },
    { "AA",  0x12D3 },
    { "Aa",  0x12D3 },
    { "EE",  0x12D4 },
    { "Ie",  0x12D4 },
    { "A",   0x12D0 },
    { "U",   0x12D1 },
    { "I",   0x12D2 },
    { "E",   0x12D5 },
    { "O",   0x12D6 }
};

// Lone vowels (አ row) ordered by length descending
static const DirectMapping LONE_VOWELS[] = {
    { "ie", 0x12A4 },
    { "aa", 0x12A3 },
    { "ea", 0x12A7 },
    { "a",  0x12A0 },
    { "u",  0x12A1 },
    { "i",  0x12A2 },
    { "e",  0x12A5 },
    { "o",  0x12A6 }
};

static const char* MatchPunctuation(char c) {
    switch (c) {
        case ',': return "\xE1\x8D\xA3"; // ፣ Netela Serez
        case '.': return "\xE1\x8D\xA2"; // ። Arat Neteb
        case ';': return "\xE1\x8D\xA4"; // ፤ Dirib Serez
        case ':': return "\xE1\x8D\xA1"; // ፡ Hulet Neteb
        default: return nullptr;
    }
}

static const char* MatchDigit(char c) {
    switch (c) {
        case '1': return "\xE1\x8D\xA9"; // ፩
        case '2': return "\xE1\x8D\xAA"; // ፪
        case '3': return "\xE1\x8D\xAB"; // ፫
        case '4': return "\xE1\x8D\xAC"; // ፬
        case '5': return "\xE1\x8D\xAD"; // ፭
        case '6': return "\xE1\x8D\xAE"; // ፮
        case '7': return "\xE1\x8D\xAF"; // ፯
        case '8': return "\xE1\x8D\xB0"; // ፰
        case '9': return "\xE1\x8D\xB1"; // ፱
        default: return nullptr;
    }
}

std::string EncodeUtf8(uint32_t codepoint) {
    std::string s;
    if (codepoint <= 0x7F) {
        s.push_back(static_cast<char>(codepoint));
    } else if (codepoint <= 0x7FF) {
        s.push_back(static_cast<char>(0xC0 | ((codepoint >> 6) & 0x1F)));
        s.push_back(static_cast<char>(0x80 | (codepoint & 0x3F)));
    } else if (codepoint <= 0xFFFF) {
        s.push_back(static_cast<char>(0xE0 | ((codepoint >> 12) & 0x0F)));
        s.push_back(static_cast<char>(0x80 | ((codepoint >> 6) & 0x3F)));
        s.push_back(static_cast<char>(0x80 | (codepoint & 0x3F)));
    } else if (codepoint <= 0x10FFFF) {
        s.push_back(static_cast<char>(0xF0 | ((codepoint >> 18) & 0x07)));
        s.push_back(static_cast<char>(0x80 | ((codepoint >> 12) & 0x3F)));
        s.push_back(static_cast<char>(0x80 | ((codepoint >> 6) & 0x3F)));
        s.push_back(static_cast<char>(0x80 | (codepoint & 0x3F)));
    }
    return s;
}

std::wstring EncodeUtf16(uint32_t codepoint) {
    std::wstring ws;
    if (codepoint <= 0xFFFF) {
        ws.push_back(static_cast<wchar_t>(codepoint));
    } else if (codepoint <= 0x10FFFF) {
        codepoint -= 0x10000;
        ws.push_back(static_cast<wchar_t>(0xD800 + (codepoint >> 10)));
        ws.push_back(static_cast<wchar_t>(0xDC00 + (codepoint & 0x3FF)));
    }
    return ws;
}

std::wstring Utf8ToUtf16(std::string_view utf8) {
    if (utf8.empty()) return L"";
#ifdef _WIN32
    int size = MultiByteToWideChar(CP_UTF8, 0, utf8.data(), static_cast<int>(utf8.size()), nullptr, 0);
    if (size <= 0) return L"";
    std::wstring ws(size, 0);
    MultiByteToWideChar(CP_UTF8, 0, utf8.data(), static_cast<int>(utf8.size()), &ws[0], size);
    return ws;
#else
    std::wstring ws;
    size_t i = 0;
    while (i < utf8.size()) {
        uint8_t c = static_cast<uint8_t>(utf8[i]);
        uint32_t cp = 0;
        if (c < 0x80) {
            cp = c;
            i += 1;
        } else if ((c & 0xE0) == 0xC0 && i + 1 < utf8.size()) {
            cp = ((c & 0x1F) << 6) | (utf8[i + 1] & 0x3F);
            i += 2;
        } else if ((c & 0xF0) == 0xE0 && i + 2 < utf8.size()) {
            cp = ((c & 0x0F) << 12) | ((utf8[i + 1] & 0x3F) << 6) | (utf8[i + 2] & 0x3F);
            i += 3;
        } else if ((c & 0xF8) == 0xF0 && i + 3 < utf8.size()) {
            cp = ((c & 0x07) << 18) | ((utf8[i + 1] & 0x3F) << 12) | ((utf8[i + 2] & 0x3F) << 6) | (utf8[i + 3] & 0x3F);
            i += 4;
        } else {
            i += 1;
        }
        ws += EncodeUtf16(cp);
    }
    return ws;
#endif
}

std::string Utf16ToUtf8(std::wstring_view utf16) {
    if (utf16.empty()) return "";
#ifdef _WIN32
    int size = WideCharToMultiByte(CP_UTF8, 0, utf16.data(), static_cast<int>(utf16.size()), nullptr, 0, nullptr, nullptr);
    if (size <= 0) return "";
    std::string s(size, 0);
    WideCharToMultiByte(CP_UTF8, 0, utf16.data(), static_cast<int>(utf16.size()), &s[0], size, nullptr, nullptr);
    return s;
#else
    std::string s;
    for (wchar_t wc : utf16) {
        s += EncodeUtf8(static_cast<uint32_t>(wc));
    }
    return s;
#endif
}

static uint32_t GetEthiopicCodepoint(const ConsonantMeta& meta, EthiopicOrder order) {
    if (order == EthiopicOrder::LABIAL) {
        if (!meta.hasLabial) return 0;
        if (meta.labialOverride != 0) return meta.labialOverride;
        return meta.base + 7;
    }
    return meta.base + static_cast<int>(order);
}

std::string Transliterate(std::string_view input, const TransliterationOptions& options) {
    std::string output;
    output.reserve(input.size() * 3);

    size_t inLen = input.size();
    size_t i = 0;
    char esc = options.escapeChar;

    while (i < inLen) {
        // 1. Double escape -> literal escape
        if (input[i] == esc && i + 1 < inLen && input[i + 1] == esc) {
            output.push_back(esc);
            i += 2;
            continue;
        }

        // 2. Single escape -> advance
        if (input[i] == esc) {
            i++;
            continue;
        }

        // 3. Punctuation
        if (options.convertPunctuation) {
            const char* p = MatchPunctuation(input[i]);
            if (p) {
                output += p;
                i++;
                continue;
            }
        }

        // 4. Digits
        if (options.convertDigits) {
            const char* d = MatchDigit(input[i]);
            if (d) {
                output += d;
                i++;
                continue;
            }
        }

        std::string_view rem = input.substr(i);

        // 5. Consonants
        const ConsonantMeta* matchedC = nullptr;
        for (const auto& c : CONSONANTS) {
            if (rem.rfind(c.key, 0) == 0) {
                matchedC = &c;
                break;
            }
        }

        if (matchedC) {
            size_t cLen = matchedC->key.size();

            // Followed by escape?
            if (i + cLen < inLen && input[i + cLen] == esc) {
                uint32_t cp = GetEthiopicCodepoint(*matchedC, EthiopicOrder::SADES);
                output += EncodeUtf8(cp);
                i += cLen + 1;
                continue;
            }

            // Followed by vowel?
            std::string_view afterC = rem.substr(cLen);
            const VowelToken* matchedV = nullptr;
            for (const auto& v : VOWELS) {
                if (!options.allowWaForLabial && v.token == "wa") continue;
                if (afterC.rfind(v.token, 0) == 0) {
                    matchedV = &v;
                    break;
                }
            }

            if (matchedV) {
                uint32_t cp = GetEthiopicCodepoint(*matchedC, matchedV->order);
                if (cp != 0) {
                    output += EncodeUtf8(cp);
                    i += cLen + matchedV->token.size();
                    continue;
                }
            }

            // No vowel matched: 6th order
            uint32_t cp = GetEthiopicCodepoint(*matchedC, EthiopicOrder::SADES);
            output += EncodeUtf8(cp);
            i += cLen;
            continue;
        }

        // 6. Pharyngeal lone vowels
        const DirectMapping* matchedP = nullptr;
        for (const auto& p : PHARYNGEALS) {
            if (rem.rfind(p.key, 0) == 0) {
                matchedP = &p;
                break;
            }
        }
        if (matchedP) {
            output += EncodeUtf8(matchedP->codepoint);
            i += matchedP->key.size();
            continue;
        }

        // 7. Lone vowels
        const DirectMapping* matchedL = nullptr;
        for (const auto& l : LONE_VOWELS) {
            if (rem.rfind(l.key, 0) == 0) {
                matchedL = &l;
                break;
            }
        }
        if (matchedL) {
            output += EncodeUtf8(matchedL->codepoint);
            i += matchedL->key.size();
            continue;
        }

        // 8. Other character pass-through
        output.push_back(input[i]);
        i++;
    }

    return output;
}

std::wstring TransliterateW(std::wstring_view input, const TransliterationOptions& options) {
    std::string utf8 = Utf16ToUtf8(input);
    std::string res = Transliterate(utf8, options);
    return Utf8ToUtf16(res);
}

// -------------------------------------------------------------
// LiveTypingEngine Implementation
// -------------------------------------------------------------

LiveTypingEngine::LiveTypingEngine(TransliterationOptions options)
    : m_options(options) {}

static bool RenderBufferInternal(std::string_view buf, std::string& out, const TransliterationOptions& opts) {
    if (buf.empty()) return false;

    // 1. Consonant prefix matching
    for (const auto& c : CONSONANTS) {
        if (buf.rfind(c.key, 0) == 0) {
            std::string_view rem = buf.substr(c.key.size());
            if (rem.empty()) {
                // Consonant alone -> 6th order (SADES)
                uint32_t cp = GetEthiopicCodepoint(c, EthiopicOrder::SADES);
                if (cp) {
                    out = EncodeUtf8(cp);
                    return true;
                }
                return false;
            }

            for (const auto& v : VOWELS) {
                if (!opts.allowWaForLabial && v.token == "wa") continue;
                if (rem == v.token) {
                    uint32_t cp = GetEthiopicCodepoint(c, v.order);
                    if (cp) {
                        out = EncodeUtf8(cp);
                        return true;
                    }
                }
            }
            return false;
        }
    }

    // 2. Pharyngeal vowels
    for (const auto& p : PHARYNGEALS) {
        if (buf == p.key) {
            out = EncodeUtf8(p.codepoint);
            return true;
        }
    }

    // 3. Lone vowels
    for (const auto& l : LONE_VOWELS) {
        if (buf == l.key) {
            out = EncodeUtf8(l.codepoint);
            return true;
        }
    }

    return false;
}

std::string LiveTypingEngine::ComputeComposing(const std::string& buf) const {
    if (buf.empty()) return "";
    std::string out;
    if (RenderBufferInternal(buf, out, m_options)) {
        return out;
    }
    return "";
}

EngineResult LiveTypingEngine::Input(std::string_view text) {
    EngineResult result;
    for (char ch : text) {
        // 1. Escape character
        if (ch == m_options.escapeChar) {
            if (!m_buffer.empty()) {
                std::string rendered;
                if (RenderBufferInternal(m_buffer, rendered, m_options)) {
                    result.committed += rendered;
                } else {
                    result.committed += m_buffer;
                }
                m_buffer.clear();
            }
            continue;
        }

        // 2. Whitespace
        if (ch == ' ' || ch == '\n' || ch == '\r' || ch == '\t') {
            if (!m_buffer.empty()) {
                std::string rendered;
                if (RenderBufferInternal(m_buffer, rendered, m_options)) {
                    result.committed += rendered;
                } else {
                    result.committed += m_buffer;
                }
                m_buffer.clear();
            }
            result.committed.push_back(ch);
            continue;
        }

        // 3. Punctuation
        if (m_options.convertPunctuation) {
            const char* p = MatchPunctuation(ch);
            if (p) {
                if (!m_buffer.empty()) {
                    std::string rendered;
                    if (RenderBufferInternal(m_buffer, rendered, m_options)) {
                        result.committed += rendered;
                    } else {
                        result.committed += m_buffer;
                    }
                    m_buffer.clear();
                }
                result.committed += p;
                continue;
            }
        }

        // 4. Digits
        if (m_options.convertDigits) {
            const char* d = MatchDigit(ch);
            if (d) {
                if (!m_buffer.empty()) {
                    std::string rendered;
                    if (RenderBufferInternal(m_buffer, rendered, m_options)) {
                        result.committed += rendered;
                    } else {
                        result.committed += m_buffer;
                    }
                    m_buffer.clear();
                }
                result.committed += d;
                continue;
            }
        }

        // 5. Syllable candidate
        std::string candidate = m_buffer + ch;
        std::string rendered;
        if (RenderBufferInternal(candidate, rendered, m_options)) {
            m_buffer = candidate;
            result.composing = rendered;
            continue;
        }

        // Candidate does not match continuation: commit previous buffer
        if (!m_buffer.empty()) {
            std::string prevRendered;
            if (RenderBufferInternal(m_buffer, prevRendered, m_options)) {
                result.committed += prevRendered;
            } else {
                result.committed += m_buffer;
            }
            m_buffer.clear();
        }

        // Check if single char starts a new syllable
        std::string singleStr(1, ch);
        std::string singleRendered;
        if (RenderBufferInternal(singleStr, singleRendered, m_options)) {
            m_buffer = singleStr;
            result.composing = singleRendered;
            continue;
        }

        // Pass-through unmapped char as committed
        result.committed.push_back(ch);
    }
    return result;
}

EngineResult LiveTypingEngine::Input(char ch) {
    return Input(std::string_view(&ch, 1));
}

EngineResultW LiveTypingEngine::InputW(wchar_t ch) {
    std::wstring inWs(1, ch);
    std::string utf8 = Utf16ToUtf8(inWs);
    EngineResult res = Input(utf8);
    return { Utf8ToUtf16(res.committed), Utf8ToUtf16(res.composing) };
}

EngineResultW LiveTypingEngine::InputW(std::wstring_view text) {
    std::string utf8 = Utf16ToUtf8(text);
    EngineResult res = Input(utf8);
    return { Utf8ToUtf16(res.committed), Utf8ToUtf16(res.composing) };
}

EngineResult LiveTypingEngine::Backspace() {
    EngineResult result;
    if (m_buffer.empty()) {
        return result;
    }

    m_buffer.pop_back();
    if (m_buffer.empty()) {
        result.composing = "";
    } else {
        result.composing = ComputeComposing(m_buffer);
    }
    return result;
}

EngineResultW LiveTypingEngine::BackspaceW() {
    EngineResult res = Backspace();
    return { Utf8ToUtf16(res.committed), Utf8ToUtf16(res.composing) };
}

void LiveTypingEngine::Reset() {
    m_buffer.clear();
}

std::string LiveTypingEngine::CommitCurrent() {
    if (m_buffer.empty()) return "";
    std::string res = ComputeComposing(m_buffer);
    m_buffer.clear();
    return res;
}

std::wstring LiveTypingEngine::CommitCurrentW() {
    return Utf8ToUtf16(CommitCurrent());
}

std::string LiveTypingEngine::GetComposing() const {
    return ComputeComposing(m_buffer);
}

std::wstring LiveTypingEngine::GetComposingW() const {
    return Utf8ToUtf16(GetComposing());
}

} // namespace Amharic
