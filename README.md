# Amharic Phonetic Keyboard (Addiyon Scheme)

A cross-platform input system and transliteration engine converting Latin letters into Amharic (Ethiopic/Ge'ez) script in real time.

```
selam , endiet nesh  ──►  ሰላም ፣ እንዴት ነሽ
```

---

## 1. Monorepo Architecture

```
DBU_app/
 ├── test-vectors.json            # Shared source-of-truth test vectors across all platforms
 ├── corpus.source.json           # Hand-written (non-circular) source corpus of 1,750+ words
 ├── UNVERIFIED.md                # Homophone / dialectal review list for native speakers
 ├── turbo.json                   # Turborepo task pipeline
 ├── pnpm-workspace.yaml          # Workspaces definition (packages/*, apps/*)
 ├── package.json                 # Monorepo root package.json
 ├── packages/
 │    └── core/                   # Zero-dependency TypeScript core (npm-publishable, ESM+CJS)
 ├── apps/
 │    ├── web/                    # React + Vite web playground and rules demo
 │    ├── android/                # Native Java InputMethodService keyboard + companion app
 │    ├── ios/                    # Swift Keyboard Extension + companion app
 │    └── desktop/                # Native OS IME (IBus / IMK / TSF) + Electron companion
 └── scripts/
      ├── build-corpus-source.js  # Generator/validator for corpus.source.json
      └── generate-vectors.js     # Validates corpus.source.json & exports test-vectors.json
```

---

## 2. Shared `test-vectors.json` & Corpus Audit

To guarantee identical behavior across all platforms (TypeScript, Java, Swift, C/Rust), every implementation must pass `test-vectors.json`:
- **Full transliteration vectors**: Complete phrases, vowel orders, homophones, digraphs, punctuation, escapes.
- **Live typing sequences**: Keystroke by keystroke composing state `{ committed, composing }`.
- **Backspace sequences**: Progressive keystroke deletion behavior (e.g. `ሰ` → `ስ` → empty).
- **Non-Circular Common Words Corpus**: **1,758 authentic Amharic words** loaded from `corpus.source.json` (where Ethiopic text is typed independently, not computed by the engine).
- **Native Speaker Review**: Words with homophone ambiguity (e.g. `ሐ` vs `ሀ` vs `ኀ`, `ጸ` vs `ፀ`, `ዐ` vs `አ`) are flagged with `"unverified": true` and documented in [UNVERIFIED.md](file:///c:/Users/CS_LAB/Documents/appp/dbu/DBU_app/UNVERIFIED.md).

---

## 3. Locked Defaults & Decisions

The following defaults are locked into `@amharic-keyboard/core`:

1. **4th form of አ (ኣ)** = `"aa"` (`a` = **አ**, `aa` = **ኣ**).
2. **4th and 5th forms of ዐ (ዓ, ዔ)** = `"Aa"` (alias `"AA"`) for **ዓ**, and `"Aie"` (alias `"EE"`) for **ዔ**.
3. **The ኀ row (ኀ ኁ ኂ ኃ ኄ ኅ ኆ ኋ)** = `"hh"` (alias `"x"`).
4. **The consonant ፈ (`f`)** = Standard consonant row (`fe`=**ፈ**, `fu`=**ፉ**, `fi`=**ፊ**, `fa`=**ፋ**, `fie`=**ፌ**, `f`=**ፍ**, `fo`=**ፎ**, `fua`/`fwa`=**ፏ**).
5. **The 8th form of አ (ኧ)** = `"ea"`.
6. **"wa" alias for labialized 8th form**: Stays enabled by default (`kwa` = **ኳ**, `gwa` = **ጓ**, `hwa` = **ኋ**). To type unlabialized 6th form + `ዋ` (such as **ክዋ**), use the escape character: `k'wa` → **ክዋ**, `h'wa` → **ህዋ**, `g'wa` → **ግዋ**.
7. **Duplicated ኋ Note**: The duplicated **ኋ** (8th form of `h` via `hua`/`hwa` and 8th form of `hh` via `hhua`/`hhwa`) is intentional; in Unicode Ethiopic, both map to code point `U+128B` (ETHIOPIC SYLLABLE HWA).

---

## 4. Quick Start

### Build & Run Tests
```bash
# Install dependencies
pnpm install

# Build all packages via Turborepo
pnpm build

# Run test suite across packages against test-vectors.json
pnpm test
```
