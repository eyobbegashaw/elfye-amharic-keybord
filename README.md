# Elfye (እልፍዬ) — Amharic Phonetic Keyboard

[![CI](https://github.com/elfye/elfye/actions/workflows/ci.yml/badge.svg)](https://github.com/elfye/elfye/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![npm @elfye/core](https://img.shields.io/npm/v/@elfye/core.svg?label=%40elfye%2Fcore)](https://www.npmjs.com/package/@elfye/core)
[![npm @elfye/react](https://img.shields.io/npm/v/@elfye/react.svg?label=%40elfye%2Freact)](https://www.npmjs.com/package/@elfye/react)

A cross-platform input system and phonetic transliteration engine converting Latin letters into Amharic (Ethiopic/Ge'ez) script in real time following the **Addiyon Scheme**.

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
 │    ├── core/                   # Zero-dependency TypeScript core (npm-publishable, ESM+CJS)
 │    └── react/                  # React hook, input/textarea components, beforeinput handling
 ├── apps/
 │    ├── web/                    # React + Vite web playground, dynamic chart, practice area
 │    ├── android/                # Native Java InputMethodService keyboard (Phase 3)
 │    ├── ios/                    # Swift Keyboard Extension (Phase 4)
 │    └── desktop/                # Native OS IME (IBus / IMK / TSF) + Electron companion (Phase 5)
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

The following defaults are locked into `@elfye/core`:

1. **4th form of አ (ኣ)** = `"aa"` (`a` = **አ**, `aa` = **ኣ**).
2. **4th and 5th forms of ዐ (ዓ, ዔ)** = `"Aa"` (alias `"AA"`) for **ዓ**, and `"Aie"` (alias `"EE"`) for **ዔ**.
3. **The ኀ row (ኀ ኁ ኂ ኃ ኄ ኅ ኆ ኋ)** = `"hh"` (alias `"x"`).
4. **The consonant ፈ (`f`)** = Standard consonant row (`fe`=**ፈ**, `fu`=**ፉ**, `fi`=**ፊ**, `fa`=**ፋ**, `fie`=**ፌ**, `f`=**ፍ**, `fo`=**ፎ**, `fua`/`fwa`=**ፏ**).
5. **The 8th form of አ (ኧ)** = `"ea"`.
6. **"wa" alias for labialized 8th form**: Stays enabled by default (`kwa` = **ኳ**, `gwa` = **ጓ**, `hwa` = **ኋ**). To type unlabialized 6th form + `ዋ` (such as **ክዋ**), use the escape character: `k'wa` → **ክዋ**, `h'wa` → **ህዋ**, `g'wa` → **ግዋ**.
7. **Duplicated ኋ Note**: The duplicated **ኋ** (8th form of `h` via `hua`/`hwa` and 8th form of `hh` via `hhua`/`hhwa`) is intentional; in Unicode Ethiopic, both map to code point `U+128B` (ETHIOPIC SYLLABLE HWA).

---

## 4. React Library (`@elfye/react`)

- **useAmharic(options)**: React hook with full caret management, IME composition state, progressive backspace, and native undo stack preservation via `document.execCommand('insertText')`.
- **`<AmharicInput />` & `<AmharicTextarea />`**: Drop-in accessible components with forward refs supporting all native HTML attributes.
- **Level 2 Input Events (`beforeinput`)**: Intercepts `insertText`, `insertCompositionText`, and `deleteContentBackward`.
- **Keyboard Shortcut**: `Ctrl+Space` toggles between English and Amharic.

---

## 5. Web Application (`apps/web`)

- **Landing / Demo Page**: Interactive `<AmharicTextarea />` with live transliteration, character/word counters, copy-to-clipboard toast, and clear buttons.
- **Typing Rules Reference Chart (የፊደል ገበታ)**: Generated dynamically from core tables (`CONSONANT_DEFINITIONS`, `getEthiopicChar`, etc.) with zero drift, searchable by Latin key or Ethiopic glyph, and click-to-insert.
- **Try It Practice Area (ተለማመዱ)**: Interactive typing practice with prompt rotation and instant visual feedback on match.
- **Installation Guide (የአጫጫን መመሪያ)**: Clear steps for enabling native Android, iOS, and desktop system-wide keyboards.
- **Accessibility & Themes**: Full Light/Dark mode, mobile-first responsive layout, and Google Font `Noto Serif Ethiopic` with system fallbacks. Amharic UI by default with English toggle.

---

## 6. iOS Keyboard & Swift Core (`apps/ios`)

- **AmharicCore (Swift Package)**: Zero UIKit dependencies, pure Foundation port of the Addiyon table, greedy longest-match transliterator, and `LiveTypingEngine`. Includes XCTest suite validating `test-vectors.json`.
- **Keyboard Extension (`UIInputViewController`)**:
  - Full custom keyboard UI: QWERTY, Shift (single / caps-lock), 123 & Symbols layers, Ethiopic punctuation (`፣`, `።`, `፤`, `፡`), Space bar, Return key (with dynamic `returnKeyType`), Backspace with long-press repeat timer, Globe key calling `advanceToNextInputMode()`, and EN/አማ toggle.
  - Atomic composition via `textDocumentProxy` (`deleteBackward()` + `insertText()`) replacing composing syllables cleanly without stray characters.
  - Context & keyboardType awareness: auto-resets on cursor moves; auto-switches to English mode for email/URL/number fields.
  - Memory safe (<15MB RAM, well below the ~60MB iOS limit), zero third-party dependencies.
  - 100% on-device private: `RequestsOpenAccess = false` (no Full Access needed).
- **Container App (SwiftUI, iOS 15+)**: Step-by-step onboarding guide, one-tap link to iOS Settings, interactive practice text field, and privacy statement in Amharic and English.

---

## 7. Verification & Testing

```bash
# Build all workspaces
pnpm build

# Run unit tests across core, react, and web packages
pnpm test

# Run Playwright E2E smoke tests for web
pnpm --filter web run test:e2e

# Run Swift Core unit tests (on macOS with Xcode)
cd apps/ios/AmharicCore && swift test
```
