# Amharic Keyboard Mobile Companion App (React Native + Expo)

This is the companion mobile application for the Amharic Phonetic Keyboard (Addiyon scheme), built with React Native, Expo, and TypeScript.

> [!IMPORTANT]
> **Companion App ONLY**:
> The custom `<AmharicTextInput />` component in this app works **ONLY inside this application** for live typing practice, rules demonstration, and testing.
>
> System-wide typing across other mobile apps (e.g. Telegram, WhatsApp, TikTok, Notes, Safari/Chrome) is powered by the **native keyboard extensions**:
> - **Android**: Native `InputMethodService` in Java ([`apps/android/`](../android/))
> - **iOS**: Native Keyboard Extension in Swift ([`apps/ios/`](../ios/))

---

## Features

1. **Onboarding & OS Keyboard Activation**:
   - Deep-links directly into system keyboard settings:
     - **Android**: `android.settings.INPUT_METHOD_SETTINGS` (`Settings.ACTION_INPUT_METHOD_SETTINGS`)
     - **iOS**: `app-settings:` (App Keyboard Settings)
   - Step-by-step visual instructions to enable the native keyboard and switch input methods.
2. **Practice Sandbox (`<AmharicTextInput />`)**:
   - Built directly on `@amharic-keyboard/core` (`LiveTypingEngine`).
   - Supports `onChangeText`, selection/caret tracking, and progressive backspace (`se` &rarr; `ሰ` &rarr; `[Backspace]` &rarr; `ስ` &rarr; `[Backspace]` &rarr; empty).
   - Real-time word and character counter, copy to clipboard, and clear button.
   - Amharic / Latin toggle button.
3. **Phonetic Rules Cheat Sheet**:
   - Addiyon scheme reference (7 vowel orders + 8th labialized column).
   - Instant search filter by Latin keystroke or Ethiopic glyph.
4. **Settings**:
   - **Amharic UI by default** with a toggle to English.
   - Privacy guarantee statement: 100% offline, zero network requests, zero telemetry, zero keystroke logging.

---

## Development & Testing

### Run Tests
```bash
pnpm --filter mobile test
```

### Typecheck
```bash
pnpm --filter mobile typecheck
```

### Run Expo Development Server
```bash
pnpm --filter mobile start
```
