# Elfye Android Keyboard (`apps/android`)

Native Android `InputMethodService` implementing the **Addiyon** Amharic phonetic transliteration scheme in Java.

## Features
- **System-Wide Typing**: Works in WhatsApp, Telegram, Chrome, Messages, Gmail, and any Android text field.
- **Core Parity (`com.elfye.keyboard.core`)**: Pure Java port of `AmharicTable`, `Transliterator`, and `LiveTypingEngine`, validated against the monorepo root `test-vectors.json` (104 full vectors, live typing sequences, progressive backspace, and 1,758 corpus words).
- **Inline Composition**: Uses `InputConnection.setComposingText` and `commitText` for smooth syllable updates (`ስ` → `ሰ`) and progressive backspace (`ሰ` → `ስ` → empty).
- **Custom Keyboard UI**: QWERTY, Shift/Caps-Lock, 123/Symbols layers, long-press Backspace repeat, 🌐 Globe switcher, and **አማ / EN** toggle.
- **Privacy First**: Requests **zero** `INTERNET` permissions; runs 100% offline on-device.

## Build & Test
```bash
cd apps/android

# Run JUnit parity tests against ../../test-vectors.json
./gradlew testDebugUnitTest --continue

# Build Debug APK
./gradlew assembleDebug
```
The Debug APK is generated at `app/build/outputs/apk/debug/app-debug.apk`.
