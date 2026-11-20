# Amharic Keyboard Desktop Companion App

This is the desktop companion application for the Amharic Phonetic Keyboard (Addiyon scheme), built with Electron, React, and TypeScript.

> [!IMPORTANT]
> **Companion App ONLY**: This application is a companion practice tool, reference chart, and settings manager. System-wide typing across other desktop apps (Word, Telegram, Chrome, Terminal, etc.) is handled by the native OS Input Method Engines (IMEs) located in [`apps/desktop-ime/`](../desktop-ime/).

---

## Features

1. **Live Practice Area**:
   - Reuses `@amharic-keyboard/react` `<AmharicTextarea />` with live phonetic transliteration.
   - Character and word counter, copy-to-clipboard button, clear button.
   - Toggle between Amharic and Latin pass-through mode with `Ctrl + Space`.
2. **Addiyon Reference Chart**:
   - Interactive 7-order + 8th-order labialized vowel chart with real-time search.
   - Click-to-copy functionality for any Ethiopic glyph.
3. **Per-OS Native IME Installation Guide**:
   - Auto-detects the host OS (`process.platform` exposed securely via `preload.ts`).
   - Step-by-step instructions for:
     - **Linux**: IBus engine (`apps/desktop-ime/linux/ibus-amharic/`)
     - **macOS**: InputMethodKit bundle (`apps/desktop-ime/macos/AmharicInputMethod/`)
     - **Windows**: Text Services Framework COM DLL (`apps/desktop-ime/windows/`)
4. **Settings & Customization**:
   - Theme toggle (Light, Dark, System Default).
   - Language toggle (አማርኛ / English).
   - Shortcut hotkey display (`Ctrl + Space`).

---

## Security Architecture

The desktop companion app implements strict Electron security best practices:
- **`contextIsolation: true`**: Renderer code runs in an isolated context and cannot access Node.js internals.
- **`nodeIntegration: false`**: Node.js APIs are completely disabled in renderer processes.
- **`sandbox: true`**: Chromium sandbox is enabled for the renderer.
- **Strict Content Security Policy (CSP)**: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data:;`.
- **Navigation Lockdown**: Prevents opening new windows (`setWindowOpenHandler` denies all) and cancels external URL navigation (`will-navigate` blocks non-local URLs).
- **Zero Remote Content**: 100% offline, bundles all assets locally.

---

## Development & Build

### Run in Development
```bash
pnpm --filter desktop dev
```

### Run Unit Tests
```bash
pnpm --filter desktop test
```

### Build Distribution Packages
Packaged using `electron-builder` defined in `electron-builder.yml`:
- **Windows**: NSIS installer (`.exe`) and portable binary
- **macOS**: Apple Disk Image (`.dmg`) and `.zip`
- **Linux**: `AppImage` and `.deb`
```bash
pnpm --filter desktop build
pnpm --filter desktop dist
```
