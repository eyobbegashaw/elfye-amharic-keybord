# Elfye Keyboard: Phase 2 Architecture & Roadmap Backlog

This document outlines the architectural specifications and implementation roadmap for **Phase 2** of the Elfye Amharic Phonetic Keyboard.

---

## 1. Word Suggestions & Autocomplete

### 1.1 Compact Dictionary Trie (DAWG)
- **Goal**: Sub-millisecond prefix lookup for 50,000+ common Amharic words within a 2MB memory budget.
- **Data Structure**: Directed Acyclic Word Graph (DAWG / Double-Array Trie) compiled ahead-of-time.
- **Corpus Frequency Weighting**: Words are tagged with frequency counts derived from the audited 1,750+ corpus and verified public domain Amharic texts.
- **Homophone Ambiguity Resolution**:
  - Amharic has homophones with identical pronunciation but distinct orthography:
    - `ሰ` (እሳት) vs `ሠ` (ንጉሥ)
    - `አ` (አልጋ) vs `ዐ` (ዓለም)
    - `ጸ` (ጸሎት) vs `ፀ` (ፀሐይ)
    - `ሀ` (ሀገር) vs `ሐ` (ሐኪም) vs `ኀ` (ኀይል)
  - When typing a Latin sequence (e.g. `selam`), the autocomplete engine displays the primary Addiyon match (`ሰላም`) first, while offering alternate historical spellings (`ሠላም`) in the suggestion bar.

---

## 2. On-Device User Dictionary

### 2.1 Local Learning & Custom Vocabulary
- **Privacy-Preserving On-Device Storage**:
  - Words manually added by the user or frequently typed proper nouns (names, places, slang) are saved strictly to local on-device databases:
    - Android: Room / SQLite
    - iOS: CoreData / SQLite in private app group
    - Desktop: SQLite (`~/.config/elfye/user_words.db`)
    - Web: IndexedDB
- **Zero Cloud Sync by Default**: User dictionary data is never synced to external servers.
- **Import / Export**: JSON-based backup and restore allowing users to transfer their custom vocabulary between devices manually.

---

## 3. Emoji Keyboard & Inline Keyword Suggestions

### 3.1 Amharic Keyword to Emoji Mapping
- Map common Amharic words and emotional expressions to Unicode emojis:
  - `ሳቅ` / `ፈገግታ` &rarr; 😂 / 😊
  - `ፍቅር` / `ውዴ` &rarr; ❤️ / 💖
  - `ሰላም` &rarr; 🕊️ / 🤝
  - `እሳት` &rarr; 🔥
  - `ምስጋና` &rarr; 🙏
- Suggestions appear dynamically in the suggestion strip alongside text completions.
- Dedicated tabbed emoji panel (Smileys, People, Nature, Food, Travel, Flags, Ethiopic symbols).

---

## 4. On-Device Voice Typing (Speech-to-Text)

### 4.1 Architecture
- **Offline First**: Use compact on-device models (such as `whisper.tflite` quantized to 8-bit, or Vosk Amharic acoustic model) or native OS on-device speech engines (`SFSpeechRecognizer` on iOS, `SpeechRecognizer` on Android).
- **Direct Phonetic Piping**: Transcribed text feeds directly into the active `LiveTypingEngine` to preserve formatting and punctuation rules.

---

## 5. Custom User Schemes (SERA Preset & Custom Tables)

### 5.1 Scheme Switcher
- Support configurable transliteration schemes via options flags:
  - **Elfye (Addiyon)**: Standard default (he=ሀ, ha=ሃ, hie=ሄ, h=ህ, ho=ሆ, hua=ኋ).
  - **SERA (System for Ethiopic Representation in ASCII)**: Preset mapping based on RFC 3044.
  - **GeezEdit / PowerGe'ez Compatibility**: Preset mapping familiar to legacy desktop users.
- **User Custom Rules**: Allow users to remap specific character combinations via a settings GUI.

---

## 6. Analytics-Free Feedback Mechanism

- Provide a "Report Missing Word or Rule" button in the companion apps.
- Opens a pre-filled GitHub issue template or email client (`mailto:`) containing:
  - Typed Latin string
  - Produced output
  - Operating system and version
- **Zero background tracking**: No telemetry payload, no background crash analytics SDK, no unique user identifier.
