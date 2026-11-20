# Windows Text Services Framework (TSF) Input Method: Amharic Phonetic (Addiyon)

This directory contains the native Windows Text Services Framework (TSF) text input processor (TIP) for the Amharic Phonetic Keyboard (Addiyon scheme). It provides real-time system-wide transliteration across Windows 10, Windows 11, and Windows Server in Win32, UWP, and Chromium-based applications.

---

## 1. Architecture Overview

### Why TSF instead of Legacy IMM32?
- **IMM32 (Input Method Manager)** is the legacy Windows 95/NT4 architecture. It relies on floating UI windows (candidate window, composition window) outside the client application's layout flow and does not work in modern UWP/AppContainer applications, Microsoft Store packages, or high-DPI modern UI frameworks.
- **TSF (Text Services Framework)** is Microsoft's modern, unified text input architecture. A TSF text service is an in-process COM DLL that integrates directly with the host application's text document context (`ITfContext`), supporting inline preedit markup, range tracking, and native rendering across modern and legacy software.

### COM Interfaces & Class Hierarchy

```
+-------------------------------------------------------------------------------+
|                             CClassFactory (IClassFactory)                     |
|                                         | creates                             |
|                                         v                                     |
|                                   CTextService                                |
|  +---------------------------+-----------------------+---------------------+  |
|  |    ITfTextInputProcessor  |   ITfKeyEventSink     |  ITfCompositionSink |  |
|  |   ITfTextInputProcessorEx |                       |                     |  |
|  +---------------------------+-----------------------+---------------------+  |
|                                         |                                     |
|                                         v                                     |
|                             Amharic::LiveTypingEngine                         |
|                     (C++17 port of table + greedy match)                      |
|                                         |                                     |
|                                         v                                     |
|                       ITfContext / ITfContextComposition                      |
|                      (EditSession -> ITfRange -> SetText)                     |
+-------------------------------------------------------------------------------+
```

1. **`ITfTextInputProcessor` / `ITfTextInputProcessorEx`**:
   - `ActivateEx(ptim, tid, dwFlags)`: Receives the thread manager (`ITfThreadMgr`) and client ID (`TfClientId`). Advises the keystroke manager (`ITfKeystrokeMgr::AdviseKeyEventSink`) and thread focus sinks. Supports `TF_TMAE_UIELEMENTENABLEDONLY` for AppContainer compatibility.
   - `Deactivate()`: Unadvises sinks, releases threads and active composition ranges.

2. **`ITfKeyEventSink`**:
   - `OnTestKeyDown` / `OnKeyDown`: Intercepts physical and virtual keystrokes before the application receives them.
   - Hotkey toggle (`Ctrl+Space`): Toggles between Amharic and Latin pass-through mode without changing OS keyboard layouts.
   - Backspace (`VK_BACK`): If a syllable is actively composing (e.g. `se` -> `ሰ`), performs **progressive backspace** (`ሰ` -> `ስ` -> empty) and sets `*pfEaten = TRUE`. When no composition is active, sets `*pfEaten = FALSE` so the host application handles regular deletion.
   - Escape / Enter / Tab / Navigation: Commits the composing buffer and passes the key through to the host application.

3. **`ITfCompositionSink` & Edit Sessions**:
   - Any modification to an application's text document in TSF requires an `ITfEditSession` (`TF_ES_SYNC | TF_ES_READWRITE`).
   - Starting a syllable: `ITfContextComposition::StartComposition` wraps the active caret selection into an `ITfComposition` instance.
   - Composing updates: `ITfRange::SetText` updates the inline preedit text.
   - Ending a syllable: `ITfComposition::EndComposition` commits the Ethiopic glyph into the application document.
   - `OnCompositionTerminated`: If the application or user forces composition termination (e.g., clicking with the mouse, switching tabs, undo), this sink resets the internal engine buffer.

---

## 2. Directory Structure

```
apps/desktop-ime/windows/
├── README.md                      # This documentation
├── build.bat                      # Builds test suite and dual x64/x86 DLLs
├── register.bat                   # Registers DLLs via regsvr32 (Admin)
├── unregister.bat                 # Unregisters DLLs via regsvr32 /u (Admin)
├── installer/
│   └── AmharicTSF.wxs             # WiX toolset installer outline for MSI
├── core/
│   ├── AmharicCore.hpp            # C++17 transliteration table & LiveTypingEngine
│   ├── AmharicCore.cpp            # Core implementation passing test-vectors.json
│   └── TestVectors.cpp            # Test runner asserting all vectors and 1,758 corpus words
└── tsf/
    ├── Globals.hpp / Globals.cpp  # CLSIDs, GUIDs, reference counting
    ├── ClassFactory.hpp / .cpp    # COM IClassFactory
    ├── Register.hpp / Register.cpp# COM InprocServer32, CategoryMgr, InputProcessorProfiles
    ├── TextService.hpp / .cpp     # CTextService implementation
    ├── Composition.cpp            # ITfEditSession & ITfComposition logic
    ├── KeyEventSink.cpp           # Keystroke intercept, progressive backspace, hotkeys
    ├── DllMain.cpp                # DLL export entry points
    └── AmharicTSF.def             # Module definition file
```

---

## 3. Registration & Platform Details

### GUIDs and Language Profile
- **COM CLSID**: `{792C6287-E8DF-4CA1-82BB-A9250646BF63}`
- **Profile GUID**: `{C8894451-9C4E-4FD7-A0E5-0D5460E58552}`
- **Language ID**: `0x045E` (Amharic - Ethiopia, BCP-47 / RFC 4646: `am-ET`)
- **TSF Categories Registered**:
  - `GUID_TFCAT_TIP_KEYBOARD` (`{054C21FB-144D-4835-A171-858A1838A4F1}`)
  - `GUID_TFCAT_TIPCAP_UIELEMENTENABLED` (Required for Windows 8+ UWP AppContainer sandboxes)
  - `GUID_TFCAT_TIPCAP_IMMERSIVESUPPORT` (Required for Windows 10/11 modern shell)
  - `GUID_TFCAT_TIPCAP_SYSTRAYSUPPORT` (Language bar indicator)

### 32-bit vs. 64-bit Architecture
Windows 64-bit runs both native 64-bit processes and 32-bit processes (via WOW64):
- 64-bit applications (Explorer, Edge, 64-bit Chrome, Notepad, modern apps) load `AmharicTSF64.dll`.
- 32-bit applications (legacy software, 32-bit Office, WOW64 utilities) load `AmharicTSF32.dll`.
- Both DLLs are built by `build.bat` and registered with their respective `regsvr32` binaries:
  ```cmd
  %SystemRoot%\System32\regsvr32.exe AmharicTSF64.dll
  %SystemRoot%\SysWOW64\regsvr32.exe AmharicTSF32.dll
  ```

### Common Pitfalls Handled
1. **UWP / AppContainer Sandboxes**:
   - Modern Windows Store apps (Calculator, Settings, WhatsApp UWP) run inside an AppContainer.
   - For an IME DLL to be loaded inside an AppContainer, the DLL file must have read permissions granted to `ALL APPLICATION PACKAGES` (`SID: S-1-15-2-1`), and the category `GUID_TFCAT_TIPCAP_UIELEMENTENABLED` must be registered in the TSF category database. Both are configured in `Register.cpp` and `installer/AmharicTSF.wxs`.
2. **Elevated (Administrator) Windows**:
   - When an application runs with elevated UAC privileges (e.g. Administrator cmd or PowerShell), Windows blocks loading IMEs from untrusted user directories. The DLL must reside in `%ProgramFiles%` or `%SystemRoot%\System32`.
3. **Chromium & Electron (Chrome, Edge, Slack, Discord, VS Code)**:
   - Modern Chromium builds use TSF natively. Our `ITfKeyEventSink` and `ITfComposition` manage the inline preedit range seamlessly without double-insertion.

---

## 4. Build & Test Commands

### Prerequisites
- Windows 10 or 11
- Visual Studio 2019/2022 or Visual Studio C++ Build Tools (with C++17 support)

### Automated Build Script
Run the automated build script from `apps\desktop-ime\windows`:
```cmd
build.bat
```
This executes:
1. Compiles and executes the C++ test runner against `test-vectors.json` (asserts all 104 vectors, live typing, backspace sequences, and all 1,758 corpus words).
2. Builds `bin\x64\AmharicTSF64.dll` (64-bit release build).
3. Builds `bin\x86\AmharicTSF32.dll` (32-bit release build).

### Manual Test Runner Execution
```cmd
cd apps\desktop-ime\windows\core
cl /nologo /std:c++17 /EHsc /utf-8 /Fe:test_vectors.exe AmharicCore.cpp TestVectors.cpp
.\test_vectors.exe ..\..\..\..\test-vectors.json
```
Output:
```
=== AmharicCore C++ Test Runner (test-vectors.json) ===
[TEST] Testing full transliteration vectors...
Result: 104 / 104 full vectors passed.
[TEST] Testing live typing sequences...
Result: Live typing sequences passed (both UTF-8 and UTF-16).
[TEST] Testing progressive backspace sequences...
Result: Progressive backspace sequences passed.
[TEST] Testing 1,750+ corpus words...
Result: 1758 / 1758 corpus words passed.

ALL TESTS PASSED SUCCESSFULLY! (0 failures)
```

---

## 5. Manual QA Checklist

After registering the DLL via `register.bat` (as Administrator) and switching input method via `Win + Space`:

| Test Target | Application | Test Input | Expected Output | Verified |
| :--- | :--- | :--- | :--- | :--- |
| **Web Browser** | Google Chrome / Microsoft Edge | `selam , endiet nesh` | `ሰላም ፣ እንዴት ነሽ` | [ ] |
| **Rich Text Editor**| Microsoft Word / WordPad | `kwa and k'wa` | `ኳ and ክዋ` | [ ] |
| **Plain Text** | Notepad (`notepad.exe`) | `he hu hi ha hie h ho hua` | `ሀ ሁ ሂ ሃ ሄ ህ ሆ ኋ` | [ ] |
| **Terminal** | Windows Terminal / PowerShell | `se` + `[Backspace]` + `e` | `ሰ` -> `ስ` -> `ሰ` | [ ] |
| **Chat App** | Telegram Desktop / Slack | `ameseg'nalehu` | `አመሰግናለሁ` | [ ] |
| **Mode Toggle** | Any text field | `Ctrl + Space` | Switched to English; typing letters outputs Latin | [ ] |
| **Focus Loss** | Switch between two windows | Type `se`, click other window | Preedit `ሰ` commits before focus change | [ ] |

---

## 6. Known Limitations & Environment Disclosure

- **Build Environment**: Both the standalone C++17 test runner and the 64-bit (`AmharicTSF64.dll`) and 32-bit (`AmharicTSF32.dll`) DLLs have been compiled and verified using MSVC v19.50 (Visual Studio 2026 Developer Build Tools) against the Windows 10/11 SDK.
- **Automated UI Testing**: Full interactive testing of an in-process COM IME inside third-party application processes (like Chrome or MS Word) requires GUI session interactive desktop rights (`Session 1`) and cannot be executed headless in non-interactive CI/CD containers.
- **Language Profile Association**: On some clean Windows installations without Ethiopian language packs installed, Windows displays the input method under the English or secondary language tray icon until the `am-ET` language pack is downloaded from Windows Settings (`Time & Language -> Language -> Add a language -> Amharic`).
