# Amharic Phonetic Keyboard (Addiyon Scheme)

A cross-platform input system and transliteration engine converting Latin letters into Amharic (Ethiopic/Ge'ez) script in real time.

```
selam , endiet nesh  ──►  ሰላም ፣ እንዴት ነሽ
```

---

## 1. Monorepo Architecture

```
amharic-keyboard/
 ├── test-vectors.json            # Shared source-of-truth test vectors across all platforms
 ├── packages/
 │    └── core/                   # Zero-dependency TypeScript core (npm-publishable, ESM+CJS)
 ├── apps/
 │    ├── web/                    # React + Vite web playground and rules demo
 │    ├── android/                # Native Java InputMethodService keyboard + companion app
 │    ├── ios/                    # Swift Keyboard Extension + companion app
 │    └── desktop/                # Native OS IME (IBus / IMK / TSF) + Electron companion
 ├── pnpm-workspace.yaml
 ├── turbo.json
 └── package.json
```

---

## 2. Shared `test-vectors.json`

To guarantee identical behavior across all platforms (TypeScript, Java, Swift, C/Rust), every implementation must pass `test-vectors.json`:
- **Full transliteration vectors**: Complete phrases, words, vowel orders, homophones, digraphs, punctuation.
- **Live typing sequences**: Keystroke by keystroke composing state `{ committed, composing }`.
- **Backspace sequences**: Progressive keystroke deletion behavior (e.g. `ሰ` → `ስ` → empty).
- **Common words corpus**: **1,050 authentic Amharic words** for regression testing.

---

## 3. Quick Start

### Build & Run Tests
```bash
# Install dependencies
pnpm install

# Build all packages via Turborepo
pnpm build

# Run test suite across packages against test-vectors.json
pnpm test
```

---

## 4. Open Decisions & Configuration

The reference Addiyon chart leaves several rarer forms unspecified. In `@amharic-keyboard/core`, these are fully configurable and default to standard phonetic conventions:

1. **4th form of አ (ኣ)**: Defaulted to `aa` (e.g. `a` = አ, `aa` = ኣ).
2. **4th and 5th forms of ዐ (ዓ, ዔ)**: Defaulted to `Aa` / `AA` for ዓ, and `Aie` / `EE` for ዔ.
3. **The ኀ row (ኀ ኁ ኂ ኃ ኄ ኅ ኆ ኋ)**: Defaulted to `hh` or `x`.
4. **The consonant ፈ (`f`)**: Included with standard orders (`fe`=ፈ, `fu`=ፉ, `fi`=ፊ, `fa`=ፋ, `fie`=ፌ, `f`=ፍ, `fo`=ፎ, `fua`/`fwa`=ፏ).
5. **The 8th form of አ (ኧ)**: Defaulted to `ea`.
6. **Labialized alias (`wa` for `ua`)**: Enabled by default (`kwa` = `ኳ`, `hwa` = `ኋ`).
7. **SERA aliases**: Optional flag (`enableSeraAliases: true` maps `ee`/`E` to 5th form ኃምስ).
