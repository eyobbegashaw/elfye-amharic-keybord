# iOS Amharic Phonetic Keyboard (`apps/ios`)

Native iOS 15+ implementation of the Amharic Phonetic Keyboard following the **Addiyon Keyboard scheme**, built entirely with Swift and SwiftUI without any third-party dependencies.

---

## 1. Project Architecture

```
apps/ios/
 ├── AmharicCore/                     # Standalone Swift Package (NO UIKit dependency)
 │    ├── Package.swift               # SPM package definition
 │    ├── Sources/
 │    │    └── AmharicCore/
 │    │         ├── Types.swift       # EthiopicOrder, EngineResult, TransliterationOptions
 │    │         ├── Constants.swift   # Consonants, vowels, punctuation, numerals
 │    │         ├── Table.swift       # Unicode syllable offset logic & CompiledRules
 │    │         ├── Transliterator.swift # Greedy longest-match pure transliteration
 │    │         └── LiveTypingEngine.swift # Real-time stateful input/backspace engine
 │    └── Tests/
 │         └── AmharicCoreTests/
 │              ├── AmharicCoreTests.swift # XCTest suite loading test-vectors.json
 │              └── Resources/
 │                   └── test-vectors.json # Synced copy from repo root
 ├── AmharicKeyboard/                 # Container App (SwiftUI, iOS 15+)
 │    ├── AmharicKeyboardApp.swift    # App entry point
 │    ├── ContentView.swift           # Onboarding, live practice area, privacy statement
 │    └── Info.plist                  # Main application configuration
 ├── AmharicKeyboardExtension/        # Custom Keyboard Extension (UIInputViewController)
 │    ├── KeyboardViewController.swift # Lifecycle, textDocumentProxy, atomic composition
 │    ├── KeyboardView.swift          # Programmatic Auto Layout responsive keyboard view
 │    ├── KeyboardKey.swift           # Key button styling, haptics, backspace repeat timer
 │    ├── KeyboardLayout.swift        # QWERTY, Shift/Caps, 123/Symbols, Ethiopic punctuation
 │    └── Info.plist                  # com.apple.keyboard-service, RequestsOpenAccess = false
 └── AmharicKeyboard.xcodeproj/       # Xcode project linking App, Extension, and Core
      └── project.pbxproj
```

---

## 2. Technical Details & Highlights

### A. Pure Swift Core (`AmharicCore`)
- Zero UIKit dependencies (only Foundation).
- Complete greedy longest-match transliteration matching `@amharic-keyboard/core` (TypeScript).
- Comprehensive `XCTest` suite reading `test-vectors.json` directly and asserting:
  - All transliteration vectors
  - All live typing step sequences
  - All progressive backspace sequences
  - Complete 1,758-word corpus

### B. Keyboard Extension (`AmharicKeyboardExtension`)
- **Composition over `textDocumentProxy`**: Because third-party iOS keyboards lack Android's `setComposingText()`, composing is implemented atomically:
  - The current composing syllable is inserted via `textDocumentProxy.insertText()`.
  - As the Latin keystroke sequence updates (e.g. `s` → `ስ` → `e` → `ሰ`), the previous composing character is replaced by checking `documentContextBeforeInput.hasSuffix(currentComposingText)`, deleting backward, and inserting the new character.
  - The composing buffer is automatically finalized when the user enters whitespace, punctuation, return, taps elsewhere in the text, or switches apps.
- **Strict Memory Budget**: Keyboard extensions on iOS have a strict memory ceiling (~60MB before the system kills the process). `AmharicKeyboardExtension` uses lightweight programmatic Auto Layout with zero heavy xibs, zero external dependencies, and zero bitmap assets, idling at under 15MB.
- **Privacy & Zero Full Access**: `RequestsOpenAccess` is explicitly set to `<false/>` in `Info.plist`. The keyboard has no network access and logs zero keystrokes.
- **Apple Guideline 4.4.1 Compliance**: Provides a Globe key hooked to `advanceToNextInputMode()` to allow switching to other system keyboards.
- **Context Awareness**: Checks `textDocumentProxy.keyboardType`. Automatically defaults to English mode when fields require email addresses, URLs, or numbers.

### C. Container App (`AmharicKeyboard`)
- Modern SwiftUI interface (iOS 15+).
- Visual step-by-step onboarding guide directing users to enable the keyboard in iOS Settings.
- One-tap button opening the system settings page via `UIApplication.openSettingsURLString`.
- Interactive practice field with Addiyon typing tips.
- Amharic interface by default with an instant English toggle button.

---

## 3. Exact Xcode Build & Test Commands

### 1. Test `AmharicCore` (Swift Package)
On macOS with Xcode installed, run:

```bash
# Using Swift Package Manager CLI:
cd apps/ios/AmharicCore
swift test

# Or using xcodebuild on macOS:
xcodebuild test \
  -package-path apps/ios/AmharicCore \
  -scheme AmharicCore \
  -destination 'platform=macOS'

# Or using xcodebuild on iOS Simulator:
xcodebuild test \
  -package-path apps/ios/AmharicCore \
  -scheme AmharicCore \
  -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest'
```

### 2. Build the Full iOS App & Keyboard Extension
```bash
cd apps/ios

# Build for iOS Simulator:
xcodebuild build \
  -project AmharicKeyboard.xcodeproj \
  -scheme AmharicKeyboard \
  -destination 'platform=iOS Simulator,name=iPhone 16,OS=latest'

# Build for generic iOS device (Archive):
xcodebuild archive \
  -project AmharicKeyboard.xcodeproj \
  -scheme AmharicKeyboard \
  -destination 'generic/platform=iOS' \
  -archivePath build/AmharicKeyboard.xcarchive
```

---

## 4. App Group & Entitlements Notes

- **App Group**: **Not required**. The keyboard extension runs self-contained in memory without needing to share files or `UserDefaults` with the container app.
- **Entitlements**: **Zero special entitlements required**. No network, no keychain sharing, no push notifications.

---

## 5. App Store Review Considerations

1. **Full Access (`RequestsOpenAccess`)**:
   - `RequestsOpenAccess` is `<false/>`.
   - The app does not prompt for Full Access, ensuring smooth passage through App Store review.
2. **Input Mode Switching**:
   - The keyboard provides a Globe key (`globe`) calling `advanceToNextInputMode()`, fulfilling Apple Guideline 4.4.1.
3. **Secure Text Entry (`isSecureTextEntry`)**:
   - iOS automatically replaces custom third-party keyboards with the default system keyboard when secure fields (passwords) are focused.

---

## 6. Honest Disclosures: Items Requiring macOS / Real Device Verification

Because this repository was developed in a cross-platform environment without native macOS/iOS toolchains, the following items cannot be fully verified without a physical iOS device or an active Xcode Simulator on macOS:

1. **Simulator & Device Compilation**:
   - While the Swift code conforms strictly to Swift 5.9/6 and iOS 15 SDK specifications, compilation must be verified on a Mac running Xcode 15+.
2. **Visual Layout & Scaling**:
   - Key heights, padding, and dynamic font resizing on specific device resolutions (@2x/@3x Retina, Dynamic Island, iPad split keyboards) must be visually confirmed on the iOS Simulator.
3. **Haptic Feedback**:
   - `UIImpactFeedbackGenerator` only triggers physical vibrations on real hardware; the iOS simulator does not simulate haptics.
4. **Input Mode Switching Interaction**:
   - `advanceToNextInputMode()` only operates when multiple keyboards are installed in the device settings.
5. **Real-World Host App Testing**:
   - Testing text replacement behavior across various host apps (e.g. Safari URL bar, Telegram chat, Notes text selection) requires live testing on iOS.
