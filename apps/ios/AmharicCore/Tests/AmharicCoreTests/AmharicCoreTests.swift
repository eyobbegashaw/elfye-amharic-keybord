import XCTest
@testable import AmharicCore

// MARK: - Test Vectors Decodable Models

struct TestVectorPayload: Decodable {
    let version: String
    let fullTransliteration: [VectorItem]
    let liveTypingSequences: [LiveTypingSequence]
    let backspaceSequences: [BackspaceSequence]
    let commonWordsCorpus: [CorpusItem]
}

struct VectorItem: Decodable {
    let input: String
    let expected: String
    let description: String?
}

struct LiveTypingStep: Decodable {
    let input: String
    let expectedCommitted: String
    let expectedComposing: String
}

struct LiveTypingSequence: Decodable {
    let name: String
    let steps: [LiveTypingStep]
}

struct BackspaceStep: Decodable {
    let action: String
    let char: String?
    let expectedCommitted: String
    let expectedComposing: String
}

struct BackspaceSequence: Decodable {
    let name: String
    let steps: [BackspaceStep]
}

struct CorpusItem: Decodable {
    let latin: String
    let amharic: String
    let unverified: Bool?
}

// MARK: - AmharicCoreTests

final class AmharicCoreTests: XCTestCase {
    private var testData: TestVectorPayload!

    override func setUpWithError() throws {
        try super.setUpWithError()

        // 1. Try loading from SPM Bundle.module
        var dataURL: URL? = nil
        #if SWIFT_PACKAGE
        dataURL = Bundle.module.url(forResource: "test-vectors", withExtension: "json")
        #endif

        // 2. Fallback to path relative to source file
        if dataURL == nil || !FileManager.default.fileExists(atPath: dataURL!.path) {
            let currentFile = URL(fileURLWithPath: #filePath)
            let candidate1 = currentFile.deletingLastPathComponent().appendingPathComponent("Resources/test-vectors.json")
            let candidate2 = currentFile.deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent().appendingPathComponent("test-vectors.json")

            if FileManager.default.fileExists(atPath: candidate1.path) {
                dataURL = candidate1
            } else if FileManager.default.fileExists(atPath: candidate2.path) {
                dataURL = candidate2
            }
        }

        guard let validURL = dataURL else {
            XCTFail("Could not locate test-vectors.json in Bundle.module or repository filesystem")
            return
        }

        let data = try Data(contentsOf: validURL)
        let decoder = JSONDecoder()
        testData = try decoder.decode(TestVectorPayload.self, from: data)
    }

    func testPayloadLoaded() {
        XCTAssertGreaterThan(testData.fullTransliteration.count, 50)
        XCTAssertGreaterThan(testData.liveTypingSequences.count, 0)
        XCTAssertGreaterThan(testData.backspaceSequences.count, 0)
        XCTAssertGreaterThanOrEqual(testData.commonWordsCorpus.count, 1000)
    }

    func testAllTransliterationVectors() {
        for (idx, item) in testData.fullTransliteration.enumerated() {
            let actual = transliterate(item.input)
            XCTAssertEqual(
                actual,
                item.expected,
                "Vector #\(idx + 1) failed for input '\(item.input)' (\(item.description ?? ""))"
            )
        }
    }

    func testAllLiveTypingSequences() {
        for seq in testData.liveTypingSequences {
            let engine = LiveTypingEngine()
            for (stepIdx, step) in seq.steps.enumerated() {
                let res = engine.input(step.input)
                XCTAssertEqual(
                    res.committed,
                    step.expectedCommitted,
                    "Sequence '\(seq.name)' step #\(stepIdx + 1) committed mismatch for input '\(step.input)'"
                )
                XCTAssertEqual(
                    res.composing,
                    step.expectedComposing,
                    "Sequence '\(seq.name)' step #\(stepIdx + 1) composing mismatch for input '\(step.input)'"
                )
            }
        }
    }

    func testAllBackspaceSequences() {
        for seq in testData.backspaceSequences {
            let engine = LiveTypingEngine()
            for (sIdx, step) in seq.steps.enumerated() {
                if step.action == "type", let ch = step.char {
                    let res = engine.input(ch)
                    XCTAssertEqual(
                        res.composing,
                        step.expectedComposing,
                        "Sequence '\(seq.name)' step #\(sIdx + 1) type composing mismatch"
                    )
                } else if step.action == "backspace" {
                    let res = engine.backspace()
                    XCTAssertEqual(
                        res.composing,
                        step.expectedComposing,
                        "Sequence '\(seq.name)' step #\(sIdx + 1) backspace composing mismatch"
                    )
                }
            }
        }
    }

    func testFullCorpus() {
        var failureCount = 0
        for item in testData.commonWordsCorpus {
            let actual = transliterate(item.latin)
            if actual != item.amharic {
                failureCount += 1
                XCTFail("Corpus word '\(item.latin)' produced '\(actual)', expected '\(item.amharic)'")
            }
        }
        XCTAssertEqual(failureCount, 0, "Corpus transliteration should have 0 failures")
    }

    func testEngineResetAndCommit() {
        let engine = LiveTypingEngine()
        engine.input("s")
        XCTAssertEqual(engine.getComposing(), "ስ")
        let committed = engine.commitCurrent()
        XCTAssertEqual(committed, "ስ")
        XCTAssertEqual(engine.getComposing(), "")

        engine.input("h")
        XCTAssertEqual(engine.getComposing(), "ህ")
        engine.reset()
        XCTAssertEqual(engine.getComposing(), "")
    }

    func testPunctuationAndEscape() {
        XCTAssertEqual(transliterate("selam , endiet nesh"), "ሰላም ፣ እንዴት ነሽ")
        XCTAssertEqual(transliterate("s'h"), "ስህ")
        XCTAssertEqual(transliterate("k'wa"), "ክዋ")
        XCTAssertEqual(transliterate("kwa"), "ኳ")
        XCTAssertEqual(transliterate("''"), "'")
    }
}
