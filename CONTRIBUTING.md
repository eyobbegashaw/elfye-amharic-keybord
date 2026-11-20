# Contributing to Elfye Keyboard

Thank you for your interest in improving **Elfye Keyboard** (እልፍዬ ፎነቲክ ኪቦርድ).

Elfye is a cross-platform Amharic phonetic input system running on Web, Android, iOS, Windows, macOS, and Linux. Because every platform implements the transliteration algorithm in its own native language, **strict cross-platform parity** is the foundational requirement of this project.

---

## The Golden Rule

> [!IMPORTANT]
> **ANY change to the transliteration scheme or vocabulary MUST start by editing `test-vectors.json` at the root of the repository.**
>
> Never edit engine code on a single platform without first updating `test-vectors.json`. `test-vectors.json` is the single source of truth across all platforms. A pull request that changes transliteration logic without updating `test-vectors.json` will be rejected by the CI parity runner.

---

## 1. Adding a Test Vector

All test vectors live in `test-vectors.json`.

### A) Adding a Full Transliteration Vector
Add an object to the `"fullTransliteration"` array:
```json
{
  "input": "new_latin_sequence",
  "expected": "የተጠበቀው_አማርኛ",
  "description": "Short explanation of the phonetic rule"
}
```

### B) Adding a Corpus Word
Add an entry to `corpus.source.json`:
```json
{
  "latin": "selamta",
  "amharic": "ሰላምታ"
}
```
Run `pnpm generate:vectors` to update the canonical `test-vectors.json`.

---

## 2. Running Parity Tests Locally

Before submitting a pull request, verify that the native engines continue to pass `test-vectors.json`:

### TypeScript (Core & React)
```bash
pnpm --filter @elfye/core test
pnpm --filter @elfye/react test
```

### C (Linux IBus Engine)
```bash
cd apps/desktop-ime/linux/ibus-amharic/core
gcc -std=c11 -O2 amharic_core.c test_vectors.c -o test_runner
./test_runner ../../../../../test-vectors.json
```

### Swift (macOS & iOS)
```bash
cd apps/ios/AmharicCore
swift test
```

### C++ (Windows Text Services Framework)
```cmd
cd apps\desktop-ime\windows\core
cl /nologo /std:c++17 /EHsc /utf-8 /Fe:test_vectors.exe AmharicCore.cpp TestVectors.cpp
.\test_vectors.exe ..\..\..\..\test-vectors.json
```

### Java (Android InputMethodService)
```bash
cd apps/android
./gradlew testDebugUnitTest
```

---

## 3. Pull Request Requirements

1. **All Parity Tests Must Pass**: Every platform must pass 100% of the vectors in `test-vectors.json`.
2. **Typecheck & Lint**: Run `pnpm turbo run build typecheck test lint`.
3. **Changeset**: Run `pnpm changeset` if you are modifying `@elfye/core` or `@elfye/react` to document the change for automated semver release.
