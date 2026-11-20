#include "AmharicCore.hpp"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <cassert>
#include <cstring>
#include <cstdlib>

static std::string ReadEntireFile(const std::string& path) {
    std::ifstream file(path, std::ios::binary);
    if (!file.is_open()) return "";
    std::ostringstream ss;
    ss << file.rdbuf();
    return ss.str();
}

static std::string FindJsonString(const std::string& json, const std::string& key, size_t startPos, size_t* nextPos = nullptr) {
    std::string pattern = "\"" + key + "\"";
    size_t pos = json.find(pattern, startPos);
    if (pos == std::string::npos) return "";

    pos += pattern.size();
    while (pos < json.size() && (json[pos] == ' ' || json[pos] == '\t' || json[pos] == '\r' || json[pos] == '\n' || json[pos] == ':')) {
        pos++;
    }
    if (pos >= json.size() || json[pos] != '\"') return "";
    pos++; // skip opening quote

    std::string out;
    while (pos < json.size() && json[pos] != '\"') {
        if (json[pos] == '\\' && pos + 1 < json.size()) {
            pos++;
            if (json[pos] == 'n') out.push_back('\n');
            else if (json[pos] == 't') out.push_back('\t');
            else if (json[pos] == 'r') out.push_back('\r');
            else if (json[pos] == '\"') out.push_back('\"');
            else if (json[pos] == '\\') out.push_back('\\');
            else if (json[pos] == 'u' && pos + 4 < json.size()) {
                std::string hex = json.substr(pos + 1, 4);
                uint32_t cp = static_cast<uint32_t>(std::strtoul(hex.c_str(), nullptr, 16));
                out += Amharic::EncodeUtf8(cp);
                pos += 4;
            } else {
                out.push_back(json[pos]);
            }
            pos++;
        } else {
            out.push_back(json[pos++]);
        }
    }

    if (nextPos) {
        *nextPos = (pos < json.size() && json[pos] == '\"') ? pos + 1 : pos;
    }
    return out;
}

static int RunFullVectorsTest(const std::string& json) {
    std::cout << "[TEST] Testing full transliteration vectors...\n";
    size_t section = json.find("\"fullTransliteration\"");
    if (section == std::string::npos) {
        std::cerr << "Error: \"fullTransliteration\" section not found\n";
        return 1;
    }

    size_t endSection = json.find("\"liveTypingSequences\"", section);
    if (endSection == std::string::npos) endSection = json.size();

    size_t p = section;
    int count = 0;
    int failures = 0;

    while (p < endSection) {
        size_t entry = json.find("\"input\"", p);
        if (entry == std::string::npos || entry >= endSection) break;

        size_t afterIn = 0;
        std::string input = FindJsonString(json, "input", entry, &afterIn);
        size_t afterExp = 0;
        std::string expected = FindJsonString(json, "expected", entry, &afterExp);

        std::string actual = Amharic::Transliterate(input);

        // Also test UTF-16 wide overload
        std::wstring actualW = Amharic::TransliterateW(Amharic::Utf8ToUtf16(input));
        std::string actualFromW = Amharic::Utf16ToUtf8(actualW);

        if (actual != expected || actualFromW != expected) {
            std::cerr << "FAIL: input='" << input << "' expected='" << expected 
                      << "' actual='" << actual << "' actualW='" << actualFromW << "'\n";
            failures++;
        }
        count++;
        p = (afterExp > entry) ? afterExp : entry + 7;
    }

    std::cout << "Result: " << (count - failures) << " / " << count << " full vectors passed.\n";
    return failures;
}

static int RunLiveSequencesTest(const std::string& /*json*/) {
    std::cout << "[TEST] Testing live typing sequences...\n";

    Amharic::LiveTypingEngine engine;

    auto r1 = engine.Input("s");
    assert(r1.composing == "ስ");

    auto r2 = engine.Input("e");
    assert(r2.composing == "ሰ");

    auto r3 = engine.Input("l");
    assert(r3.committed == "ሰ");
    assert(r3.composing == "ል");

    auto r4 = engine.Input("a");
    assert(r4.composing == "ላ");

    auto r5 = engine.Input("m");
    assert(r5.committed == "ላ");
    assert(r5.composing == "ም");

    auto r6 = engine.Input(" ");
    assert(r6.committed == "ም ");
    assert(r6.composing == "");

    // Also test UTF-16 engine
    Amharic::LiveTypingEngine engineW;
    auto w1 = engineW.InputW(L's');
    assert(w1.composing == L"ስ");

    auto w2 = engineW.InputW(L'e');
    assert(w2.composing == L"ሰ");

    auto w3 = engineW.InputW(L'l');
    assert(w3.committed == L"ሰ");
    assert(w3.composing == L"ል");

    std::cout << "Result: Live typing sequences passed (both UTF-8 and UTF-16).\n";
    return 0;
}

static int RunBackspaceSequencesTest(const std::string& /*json*/) {
    std::cout << "[TEST] Testing progressive backspace sequences...\n";

    Amharic::LiveTypingEngine engine;

    // se -> ሰ -> backspace -> ስ -> backspace -> empty
    engine.Input("s");
    engine.Input("e");
    assert(engine.GetComposing() == "ሰ");

    auto b1 = engine.Backspace();
    assert(b1.composing == "ስ");

    auto b2 = engine.Backspace();
    assert(b2.composing == "");

    // hua -> ኋ -> backspace -> ሁ -> backspace -> ህ
    engine.Reset();
    engine.Input("h");
    engine.Input("u");
    engine.Input("a");
    assert(engine.GetComposing() == "ኋ");

    auto hb1 = engine.Backspace();
    assert(hb1.composing == "ሁ");

    auto hb2 = engine.Backspace();
    assert(hb2.composing == "ህ");

    // Test UTF-16 progressive backspace
    Amharic::LiveTypingEngine engineW;
    engineW.InputW(L"se");
    assert(engineW.GetComposingW() == L"ሰ");
    auto wb1 = engineW.BackspaceW();
    assert(wb1.composing == L"ስ");
    auto wb2 = engineW.BackspaceW();
    assert(wb2.composing == L"");

    std::cout << "Result: Progressive backspace sequences passed.\n";
    return 0;
}

static int RunCorpusTest(const std::string& json) {
    std::cout << "[TEST] Testing 1,750+ corpus words...\n";
    size_t section = json.find("\"commonWordsCorpus\"");
    if (section == std::string::npos) {
        std::cerr << "Error: \"commonWordsCorpus\" section not found\n";
        return 1;
    }

    size_t p = section;
    int count = 0;
    int failures = 0;

    while (true) {
        size_t entry = json.find("\"latin\"", p);
        if (entry == std::string::npos) break;

        size_t afterLat = 0;
        std::string latin = FindJsonString(json, "latin", entry, &afterLat);
        size_t afterAmh = 0;
        std::string expected = FindJsonString(json, "amharic", entry, &afterAmh);

        std::string actual = Amharic::Transliterate(latin);

        if (actual != expected) {
            std::cerr << "FAIL CORPUS: latin='" << latin << "' expected='" << expected 
                      << "' actual='" << actual << "'\n";
            failures++;
        }
        count++;
        p = (afterAmh > entry) ? afterAmh : entry + 7;
    }

    std::cout << "Result: " << (count - failures) << " / " << count << " corpus words passed.\n";
    return failures;
}

int main(int argc, char** argv) {
    std::string path = (argc > 1) ? argv[1] : "../../../../test-vectors.json";
    std::string json = ReadEntireFile(path);
    if (json.empty()) {
        path = "test-vectors.json";
        json = ReadEntireFile(path);
    }
    if (json.empty()) {
        path = "../../test-vectors.json";
        json = ReadEntireFile(path);
    }
    if (json.empty()) {
        std::cerr << "Error: Unable to open test-vectors.json\n";
        return 1;
    }

    std::cout << "=== AmharicCore C++ Test Runner (test-vectors.json) ===\n";
    int failures = 0;
    failures += RunFullVectorsTest(json);
    failures += RunLiveSequencesTest(json);
    failures += RunBackspaceSequencesTest(json);
    failures += RunCorpusTest(json);

    if (failures == 0) {
        std::cout << "\nALL TESTS PASSED SUCCESSFULLY! (0 failures)\n";
        return 0;
    } else {
        std::cerr << "\nTEST SUITE COMPLETED WITH " << failures << " FAILURES.\n";
        return 1;
    }
}
