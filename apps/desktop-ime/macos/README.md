# macOS Amharic Phonetic Input Method (`Amharic.app`)

Native system-wide macOS input method engine built with Swift and Apple's **InputMethodKit** framework, implementing the **Addiyon Keyboard scheme**.

---

## 1. Architecture & Code Reuse

```
apps/desktop-ime/macos/
 ├── AmharicInputMethod/
 │    ├── Package.swift               # SPM package referencing apps/ios/AmharicCore
 │    ├── Sources/
 │    │    ├── main.swift             # App entry point & IMKServer initialization
 │    │    └── AmharicInputController.swift # IMKInputController, markedText, progressive backspace
 │    └── Resources/
 │         └── Info.plist             # InputMethodConnectionName, tsInputModeListKey
 ├── build.sh                         # Build, bundle, ad-hoc sign, and install script
 └── README.md
```

### Direct Reuse of `AmharicCore`
This macOS input method directly imports and reuses the **`AmharicCore`** Swift package from `apps/ios/AmharicCore` via local Swift Package Manager dependency:
```swift
dependencies: [
    .package(path: "../../../ios/AmharicCore")
]
```
The table, greedy longest-match transliterator, and `LiveTypingEngine` are shared with 100% fidelity without forking.

---

## 2. Key InputMethodKit Mechanics

- **Marked Text (`client.setMarkedText`)**:
  - The pending composing syllable is rendered as marked (underlined) inline text at the cursor position.
  - As subsequent keystrokes arrive (e.g. `s` → `ስ` → `e` → `ሰ`), `client.setMarkedText()` updates the inline text dynamically.
- **Commit Composition (`client.insertText`)**:
  - Syllables are committed into the document when followed by vowels, whitespace, punctuation, return, or focus change.
- **Progressive Backspace**:
  - Intercepts Delete (keyCode 51). If the internal buffer has composing keystrokes, `engine.backspace()` decomposes the syllable (`ሰ` → `ስ` → empty) and updates `markedText`.
  - When the composing buffer is empty, passes through to delete native document characters.
- **Hotkey Toggle (Ctrl + Space)**:
  - Toggles between Amharic transliteration and pass-through English mode.
- **Menu Bar Icon**:
  - `AmharicInputController.menu()` provides an input mode indicator in the macOS menu bar showing current status and switching options.

---

## 3. Build & Installation

### Build and Package
On macOS (macOS 12+ with Xcode installed):
```bash
cd apps/desktop-ime/macos
chmod +x build.sh
./build.sh
```
This compiles the release executable and bundles it into `build/Amharic.app`.

### User-Level Installation
To build and install directly to `~/Library/Input Methods/`:
```bash
./build.sh --install
```

### Enabling the Input Method in macOS Settings
1. Open **System Settings** → **Keyboard**.
2. Click **Text Input** → **Edit...** (under Input Sources).
3. Click the **"+" (Add)** button.
4. In the language list, select **Amharic** (or search for "Amharic").
5. Select **Amharic Phonetic** and click **Add**.
6. Switch input sources using `Control + Space` or via the Input menu in the top menu bar.

---

## 4. Code Signing & Notarization Notes

- **Local Ad-hoc Signing**:
  `build.sh` automatically signs the bundle using an ad-hoc identity:
  ```bash
  codesign --force --deep --sign - build/Amharic.app
  ```
- **Distribution & Notarization (Apple Developer ID)**:
  For distributing to other macOS users without Gatekeeper warnings:
  ```bash
  codesign --force --deep --options runtime --sign "Developer ID Application: Your Name (TEAMID)" build/Amharic.app
  ditto -c -k --keepParent build/Amharic.app build/Amharic.zip
  xcrun notarytool submit build/Amharic.zip --keychain-profile "AC_PASSWORD" --wait
  xcrun stapler staple build/Amharic.app
  ```

---

## 5. Manual QA Checklist

- [ ] **Web Browser (Safari / Chrome)**:
  - Click any web input field or address bar.
  - Type `selam`: marked text updates `ስ` → `ሰ` → `ሰል` → `ሰላ` → `ሰላም`.
  - Press Space: commits `ሰላም `.
  - Type `hua`: marked text updates `ህ` → `ሁ` → `ኋ`.
  - Press Delete/Backspace: progressive backspace decomposes `ኋ` → `ሁ` → `ህ` → empty.
- [ ] **Text Editor (TextEdit / Pages / VSCode)**:
  - Type `endiet nesh`: verifies 5th vowel `ie` produces `ኤ`/`ዴ` correctly.
  - Press `Ctrl + Space`: toggles to English. Type `hello` (inserts Latin `hello`).
  - Press `Ctrl + Space`: toggles back to Amharic. Type `selam` (inserts `ሰላም`).
  - Press `Cmd + Z`: verifies undo functions cleanly without corrupting document text.
- [ ] **Terminal (Terminal.app / iTerm2)**:
  - Focus shell prompt. Type Amharic commands. Verify marked text floats properly at cursor and commits on Enter.
- [ ] **Chat Apps (Messages / Slack / Telegram)**:
  - Type `tena yist'illign`. Verify Enter commits `ጤና ይስጥልኝ` and sends message.
  - Click outside text field: verify `commitComposition` commits pending text and leaves no stray marked text.

---

## 6. Known Limitations

1. **Host App Marked Text Styling**: A few non-standard Mac apps (like certain Electron apps or games with custom text rendering) do not render underlined marked text styles, but text insertion and composition still operate correctly.
2. **Terminal Non-UTF8 Locales**: If Terminal is set to an ASCII-only or legacy C locale, Ethiopic glyphs may render as question marks in the terminal emulator output. Ensure UTF-8 locale is enabled.
